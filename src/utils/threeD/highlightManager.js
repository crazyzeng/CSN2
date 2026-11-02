/**
 * 模型描边高亮管理器（基于 three.js 后处理 EffectComposer）
 *
 * 职责：
 *  在常规渲染的基础上叠加一层后处理管线，用 OutlinePass 对选中的网格（Mesh）绘制描边，
 *  实现「选中/高亮」的视觉反馈。支持单选、多选、清除高亮，并在无高亮时回退为普通渲染。
 *
 * 后处理管线构成（按顺序叠加）：
 *  1. RenderPass        —— 正常渲染场景到离屏缓冲；
 *  2. OutlinePass       —— 对 selectedObjects 中的物体绘制边缘描边（发光呼吸效果）；
 *  3. SMAAPass          —— 抗锯齿，提升描边与画面边缘的平滑度；
 *  4. ShaderPass(Gamma) —— Gamma 校正，让最终输出的颜色更接近 sRGB 观感。
 */

import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader"

/**
 * 创建高亮管理器。所有内部状态（composer / outlinePass / 是否高亮）均封装在闭包内。
 *
 * @param {Scene}    scene    需要渲染的场景
 * @param {Camera}   camera   场景使用的相机
 * @param {WebGLRenderer} renderer 场景使用的渲染器
 * @returns {Object} 高亮控制接口
 */
export function createHighlightManager(scene, camera, renderer) {

    /** 后处理合成器：串起所有渲染 Pass */
    let composer
    /** 描边 Pass：高亮功能的核心 */
    let outlinePass
    /** 当前是否处于高亮状态（决定渲染时走 composer 还是直接渲染器） */
    let highlightEnabled = false

    /**
     * 初始化后处理管线。必须在场景/相机/渲染器就绪后调用一次。
     */
    function init() {
        const width = renderer.domElement.clientWidth
        const height = renderer.domElement.clientHeight

        composer = new EffectComposer(renderer)

        // 1. 正常渲染场景
        const renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        // 2. 描边（高亮）Pass
        outlinePass = new OutlinePass(
            new THREE.Vector2(width, height),
            scene,
            camera,
        )

        /* ---------- 描边核心参数 ---------- */
        outlinePass.edgeStrength = 5     // 边缘发光强度
        outlinePass.edgeGlow = 1         // 边缘泛光范围
        outlinePass.edgeThickness = 2    // 边缘线条粗细

        outlinePass.pulsePeriod = 5      // 呼吸（脉冲）周期，数值越大变化越慢

        // 可见边缘与不可见边缘颜色统一设为青色，形成一致的高亮描边
        outlinePass.visibleEdgeColor.set("#00ffff")
        outlinePass.hiddenEdgeColor.set("#00ffff")
        outlinePass.hiddenEdgeColor.multiplyScalar(1)

        composer.addPass(outlinePass)

        // 3. 抗锯齿 Pass（按渲染器像素比放大处理，保证高分屏清晰）
        const pixelRatio = renderer.getPixelRatio()
        const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio)
        composer.addPass(smaaPass)

        // 4. Gamma 校正 Pass
        const gammaPass = new ShaderPass(GammaCorrectionShader)
        composer.addPass(gammaPass)
    }

    /**
     * 清空所有高亮（selectedObjects 置空）并关闭高亮渲染状态。
     */
    function clearHighlight() {
        if (outlinePass) {
            outlinePass.selectedObjects = []
        }
        highlightEnabled = false
    }

    /**
     * 按名称集合查找需要高亮的网格。
     *
     * 匹配策略：遍历场景中的所有对象，若对象的 name 命中给定名称集合，
     * 则收集该对象自身（若为 Mesh）及其所有子 Mesh。这样既能高亮单个网格，
     * 也能一次性高亮某个命名分组下的整块区域。
     *
     * @param {string[]} names 目标对象名称数组
     * @returns {Mesh[]} 命中的网格集合
     */
    function findMeshesByNames(names = []) {
        const meshes = []

        scene.traverse((obj) => {
            if (names.includes(obj.name)) {
                // 如果命中的对象本身是 Mesh，先加入
                if (obj.isMesh) {
                    meshes.push(obj)
                }
                // 再递归收集其所有子 Mesh，实现「按区域名高亮整块模型」
                obj.traverse((child) => {
                    if (child.isMesh) {
                        meshes.push(child)
                    }
                })
            }
        })

        return meshes
    }

    /**
     * 高亮单个指定名称的对象。
     * @param {string} name 目标对象名称
     */
    function highlightOne(name) {
        highlightEnabled = true
        const meshes = findMeshesByNames([name])

        if (outlinePass) {
            outlinePass.selectedObjects = meshes
        }
    }

    /**
     * 批量高亮多个指定名称的对象。
     * @param {string[]} names 目标对象名称数组
     */
    function highlightByNames(names = []) {
        highlightEnabled = true
        const meshes = findMeshesByNames(names)

        if (outlinePass) {
            outlinePass.selectedObjects = meshes
        }
    }

    /**
     * 执行一帧渲染：存在后处理管线时走 composer，否则回退为直接渲染。
     */
    function render() {
        if (composer) {
            composer.render()
        } else {
            renderer.render(scene, camera)
        }
    }

    /**
     * 释放后处理相关资源（各 Pass、渲染目标缓冲），防止内存泄漏。
     */
    function dispose() {
        if (composer) {
            composer.passes.forEach((pass) => {
                pass.dispose?.()
            })

            composer.renderTarget1?.dispose?.()
            composer.renderTarget2?.dispose?.()

            composer = null
        }

        outlinePass = null
    }

    return {
        init,
        highlightOne,
        highlightByNames,
        clearHighlight,
        render,
        /** 返回当前是否处于高亮状态 */
        isEnabled: () => highlightEnabled,
        dispose,
    }
}