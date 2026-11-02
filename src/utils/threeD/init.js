/**
 * three.js 场景初始化与模型加载核心模块
 *
 * 职责：
 *  1. 创建并管理一个可复用的 three.js 场景（场景、相机、渲染器、轨道控制器、灯光、环境光）；
 *  2. 加载 GLTF/GLB 模型（带 Draco 压缩解码、HDR 环境贴图），并对模型做内存缓存与克隆复用；
 *  3. 根据模型包围盒自动计算相机距离与裁切面（fitCameraToModel）；
 *  4. 统一管理渲染循环、窗口 resize 以及资源的彻底释放（dispose），避免 WebGL 内存泄漏。
 *
 * 说明：
 *  - 所有可变状态（scene/camera/renderer/controls/currentModel/modelCache 等）都以模块级变量保存，
 *    形成「单例」式使用方式；重复调用 initThree 时会先销毁旧实例再重建。
 *  - 模型加载使用缓存 + clone 策略：同一 URL 只解析一次，后续直接克隆，避免重复网络请求。
 */

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js"
import { createHighlightManager } from "./highlightManager"

/* ================= 模块级单例状态 ================= */

/** 场景：所有 3D 物体的根节点容器 */
let scene
/** 透视相机：决定观察视角与投影 */
let camera
/** WebGL 渲染器：把场景绘制到 canvas 上 */
let renderer
/** 轨道控制器：支持鼠标旋转 / 缩放 / 平移 */
let controls
/** 场景挂载的 DOM 容器（用于读取尺寸、移除 canvas） */
let container
/** 当前已加入场景的模型（可能是克隆体） */
let currentModel = null
/** 模型缓存表：key 为模型 URL，value 为解析完成但尚未克隆的原始模型 */
let modelCache = {}
/** GLTF 加载器（配置了 Draco 解压） */
let loader
/** 后处理描边高亮管理器（仅在开启 enableHighlight 时存在） */
let highlightManager
/** requestAnimationFrame 返回的动画帧 id，用于销毁时取消渲染循环 */
let animationId

/* ================= 初始化 ================= */

/**
 * 初始化 three.js 场景并返回一组可供外部调用的控制方法。
 *
 * @param {HTMLElement} dom       承载 canvas 的容器元素
 * @param {string}      modelUrl  初始化时是否自动加载模型（当前由调用方手动 loadModel，默认不传）
 * @param {Object}      options   配置项，如 { enableHighlight: boolean }
 * @returns {Object}  包含 scene/camera/controls/renderer 及 loadModel 等方法
 */
export function initThree(dom, modelUrl, options) {

    // 若已存在旧实例，先彻底销毁，避免重复创建 canvas / 泄漏 GPU 资源
    if (renderer) {
        console.warn("Three 已存在，先销毁旧实例")
        dispose()
    }

    const { enableHighlight = false } = options

    // 记录容器，后续 resize / dispose 都会用到
    container = dom

    const width = container.clientWidth
    const height = container.clientHeight

    /* ---------- 场景 ---------- */
    scene = new THREE.Scene()

    /* ---------- 相机 ---------- */
    // 视野角 45°、按容器宽高比设置、近平面 0.1、远平面 2000（覆盖较大场景范围）
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
    // 初始给一个斜上方的视角，方便概览整个模型
    camera.position.set(200, 150, 200)

    /* ---------- 渲染器 ---------- */
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启抗锯齿
        alpha: true,     // 画布透明，便于叠加其它 UI 背景
    })

    renderer.setSize(width, height)
    // 依据设备像素比渲染，保证高分屏清晰度
    renderer.setPixelRatio(window.devicePixelRatio)

    /* ---------- gltf-viewer 兼容渲染参数 ---------- */
    // 色彩空间：线性 -> sRGB，使模型颜色显示更自然
    renderer.outputColorSpace = THREE.SRGBColorSpace
    // 使用 ACES 电影级色调映射，让高光更柔和、观感更接近引擎烘焙效果
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1

    // 把渲染出来的 canvas 挂到容器内
    container.appendChild(renderer.domElement)

    /* ---------- 轨道控制器 ---------- */
    controls = new OrbitControls(camera, renderer.domElement)
    // 开启阻尼（惯性），让旋转/缩放更顺滑
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // 如需模型自动旋转，可取消以下注释（当前保持手动控制）
    // controls.autoRotate = true
    // controls.autoRotateSpeed = 0.8

    /* ---------- 基础灯光 ---------- */
    // 环境光：均匀照亮暗部，避免死黑
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // 平行光：模拟主光源，从斜上方照射产生明暗与立体感
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5)
    dirLight.position.set(100, 200, 100)
    scene.add(dirLight)

    /* ---------- HDR 环境光（IBL） ---------- */
    // 使用 PMREMGenerator 将 HDR 等距柱状图转为预滤波环境贴图，用于 PBR 材质反射
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()

    new HDRLoader().load("/textures/studio_small_08_1k.hdr", (texture) => {
        // 将加载到的 HDR 转换为场景环境贴图
        const envMap = pmremGenerator.fromEquirectangular(texture).texture
        scene.environment = envMap
        // 背景保持为 null（透出容器背景），仅用环境贴图提供反射
        scene.background = null

        // 原始 HDR 纹理与生成器用完即释放，避免占用内存
        texture.dispose()
        pmremGenerator.dispose()
    })

    /* ---------- Draco 压缩解码 ---------- */
    // Draco 解码器（适用于被 Draco 压缩过的 GLB/GLTF，减小体积）
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("/draco/")

    loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    /* ---------- （可选）初始化高亮后处理 ---------- */
    if (enableHighlight) {
        highlightManager = createHighlightManager(scene, camera, renderer)
        highlightManager.init()
    }

    /* ---------- 监听窗口尺寸变化 ---------- */
    window.addEventListener("resize", onResize)

    // 启动渲染循环
    renderLoop()

    // 对外暴露控制接口
    return {
        scene,
        camera,
        controls,
        renderer,
        loadModel,
        fitCameraToModel,
        dispose,

        // 仅当 enableHighlight 为 true 时这些方法才可用（否则 highlightManager 为 null）
        highlightByNames: (names) => highlightManager.highlightByNames(names),
        highlightOne: (name) => highlightManager.highlightOne(name),
        clearHighlight: () => highlightManager.clearHighlight(),
    }
}

/**
 * 加载 GLTF/GLB 模型（带缓存）。
 *
 * @param {string}   modelUrl   模型文件地址，作为缓存 key
 * @param {Object}   options    传给 fitCameraToModel 的相机适配参数
 * @param {Function} onProgress 下载进度回调（百分比）
 * @returns {Promise<Object>} 加载完成（或命中缓存）后的模型对象（已加入场景）
 */
async function loadModel(modelUrl, options, onProgress) {

    // 命中缓存：直接克隆并替换当前模型，避免重复下载/解析
    if (modelCache[modelUrl]) {
        if (currentModel) {
            scene.remove(currentModel)
        }

        // 关键：clone(true) 深拷贝，保证同一份原始模型能被多处独立使用而不互相影响
        currentModel = modelCache[modelUrl].clone(true)
        scene.add(currentModel)

        fitCameraToModel(currentModel, camera, controls, options)

        return currentModel
    }

    // 未命中缓存：真正发起网络加载
    return new Promise((resolve, reject) => {
        loader.load(
            modelUrl,
            (gltf) => {
                const model = gltf.scene

                // 遍历所有网格，统一调整 PBR 质感（降低金属度、适度粗糙度）
                model.traverse((obj) => {
                    if (obj.isMesh && obj.material) {
                        obj.material.roughness = 0.6
                        obj.material.metalness = 0
                    }
                })

                // 缓存原始模型（后续可直接 clone）
                modelCache[modelUrl] = model

                if (currentModel) {
                    scene.remove(currentModel)
                }

                currentModel = model
                scene.add(model)

                // 根据模型包围盒自动把相机对准模型
                fitCameraToModel(model, camera, controls, options)

                resolve(model)
            },
            (xhr) => {
                // 下载进度：仅在能拿到 total 时计算百分比
                if (onProgress && xhr.total) {
                    const percent = (xhr.loaded / xhr.total) * 100
                    onProgress(percent)
                }
            },
            reject,
        )
    })
}

/* ================= 相机适配（自动居中与距离） ================= */

/**
 * 依据模型包围盒自动调整相机位置、目标点与远/近裁切面，使模型完整居中呈现。
 *
 * @param {Object} model    需要适配的模型对象
 * @param {Object} camera   需要调整的相机
 * @param {Object} controls 需要同步的轨道控制器
 * @param {Object} options  { distanceScale } 相机距离缩放系数，越小相机越近
 */
function fitCameraToModel(model, camera, controls, options = {}) {

    const { distanceScale = 0.5 } = options

    // 先更新世界矩阵，保证包围盒计算的是模型在世界空间中的真实范围
    model.updateWorldMatrix(true, true)

    // 计算模型包围盒的中心与尺寸
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    // 取包围盒最长边作为基准尺寸
    const maxDim = Math.max(size.x, size.y, size.z)

    // 相机距离：根据视野角 FOV 与模型尺寸反推，使模型刚好占满视野
    const fov = camera.fov * (Math.PI / 180)
    let distance = maxDim / (2 * Math.tan(fov / 2))

    // 应用外部传入的动态比例，控制模型在画面中的占比
    distance *= distanceScale

    // 从斜上方观察的方向向量（归一化后乘距离得到相机偏移）
    const direction = new THREE.Vector3(0, 1, 1).normalize()

    // 关键 1：先重置控制器（清空内部的旋转/缩放状态，避免受上次操作影响）
    controls.reset()

    // 相机位置 = 模型中心 + 方向 * 距离
    camera.position.copy(center.clone().add(direction.multiplyScalar(distance)))

    camera.lookAt(center)

    // 同步控制器目标点为中心，并刷新内部状态
    controls.target.copy(center)
    controls.update()

    // 关键 2：保存当前状态为「初始状态」，之后可随时一键复位视角
    controls.saveState()

    /* ---------- 关键：动态裁切面 ---------- */
    // 根据模型尺寸动态设定近/远平面，避免超大/超小模型被裁切或产生深度精度问题
    camera.near = maxDim / 100
    camera.far = maxDim * 20

    camera.updateProjectionMatrix()
}

/* ================= 渲染循环 ================= */

/** 每帧执行的渲染循环：更新控制器阻尼，并选择普通渲染或高亮后处理渲染 */
function renderLoop() {
    animationId = requestAnimationFrame(renderLoop)

    controls.update()

    // 开启高亮后处理时走 EffectComposer 渲染，否则直接渲染
    if (highlightManager && highlightManager.isEnabled) {
        highlightManager.render()
    } else {
        renderer.render(scene, camera)
    }
}

/* ================= resize 处理 ================= */

/** 容器尺寸变化时同步相机宽高比与渲染器尺寸 */
function onResize() {
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
}

/* ================= 销毁与资源释放 ================= */

/**
 * 彻底销毁 three 实例：取消渲染循环、释放控制器/模型/几何体/材质/纹理，
 * 并从 DOM 中移除 canvas、清空缓存与所有模块级引用，防止内存泄漏。
 */
function dispose() {
    cancelAnimationFrame(animationId)

    controls?.dispose()

    // 释放当前模型所有子资源的显式处理
    if (currentModel) {
        disposeModel(currentModel)
    }

    // 遍历并释放场景中残余的几何体与材质（双保险）
    scene?.traverse((obj) => {
        if (obj.isMesh) {
            obj.geometry?.dispose()
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach((m) => disposeMaterial(m))
                } else {
                    disposeMaterial(obj.material)
                }
            }
        }
    })

    scene?.clear()

    renderer?.dispose()

    // 从容器移除 canvas DOM 节点
    if (renderer?.domElement && container) {
        container.removeChild(renderer.domElement)
    }

    // 释放环境贴图
    if (scene.environment) {
        scene.environment.dispose?.()
        scene.environment = null
    }

    highlightManager?.dispose?.()
    highlightManager = null

    // 清空模型缓存，保证下次初始化时重新加载
    modelCache = {}

    // 清空单例引用
    scene = null
    camera = null
    renderer = null
    controls = null
    currentModel = null
}

/** 释放单个模型的几何体、材质（材质可能是数组）以及其上的纹理 */
function disposeModel(model) {
    model.traverse((obj) => {
        if (obj.isMesh) {
            obj.geometry?.dispose()

            if (Array.isArray(obj.material)) {
                obj.material.forEach((m) => disposeMaterial(m))
            } else {
                disposeMaterial(obj.material)
            }
        }
    })
}

/** 释放单个材质及其持有的所有纹理 */
function disposeMaterial(material) {
    if (!material) return

    // 遍历材质属性，找到纹理类型资源并逐一释放
    for (const key in material) {
        const value = material[key]
        if (value && value.isTexture) {
            value.dispose()
        }
    }

    material.dispose()
}