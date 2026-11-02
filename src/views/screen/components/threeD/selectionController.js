/**
 * 模型选择/高亮/相机飞行控制器
 *
 * 职责：
 *  1. 将加载完成的模型登记为「可交互模型」，并维护可选网格列表（用于射线拾取范围限制）；
 *  2. 通过射线拾取（Raycaster）或按名称选择（selectByName）定位模型中的某个对象/区域；
 *  3. 对选中的对象做材质高亮（半透明 + 发光 + 提亮），并可一键清除/复位；
 *  4. 使用 GSAP 对相机位置与控制目标做平滑的「飞行」动画，聚焦到选中对象。
 *
 * 说明：
 *  当前实际交互走的是侧边 UI 的 selectByName（通过 name 精准选中），
 *  构造器中的鼠标点击拾取（initClick）默认被禁用，避免与页面其它交互冲突。
 */

import * as THREE from "three"
import gsap from "gsap"

export default class ThreeSelectionController {

    /**
     * @param {Scene}         scene    场景
     * @param {Camera}        camera   相机
     * @param {OrbitControls} controls 轨道控制器
     * @param {WebGLRenderer} renderer 渲染器
     */
    constructor(scene, camera, controls, renderer) {
        this.scene = scene
        this.camera = camera
        this.controls = controls
        this.renderer = renderer

        // 射线投射器：用于把屏幕坐标转换为场景中的射线，检测与模型的交点
        this.raycaster = new THREE.Raycaster()
        // 归一化鼠标坐标（范围 -1 ~ 1），供 raycaster.setFromCamera 使用
        this.mouse = new THREE.Vector2()

        /** 当前被选中的对象/分组 */
        this.current = null
        /** 可选对象集合：限制射线检测范围，提升拾取性能与准确性 */
        this.selectable = []
        /** 当前主模型（用于复位/整体操作） */
        this.currentModel = null

        // 登记鼠标点击拾取（当前实现入内直接返回，见 initClick 说明）
        this.initClick()
    }

    /**
     * 设置当前主模型，并收集其中所有 Mesh 作为射线拾取范围。
     * @param {Object3D} model 加载完成的模型对象
     */
    setModel(model) {
        this.currentModel = model

        // 重建可选列表：只收集 Mesh，缩小射线检测范围
        this.selectable = []
        model.traverse((o) => {
            if (o.isMesh) {
                this.selectable.push(o)
            }
        })
    }

    /**
     * 清空当前模型的高亮与可见性状态（恢复为原始材质、全部可见）。
     */
    clearModelState() {
        if (!this.currentModel) return

        this.currentModel.traverse((o) => {
            // 恢复被高亮替换过的原材质
            if (o.isMesh && o.userData._originMaterial) {
                o.material.dispose()
                o.material = o.userData._originMaterial
                delete o.userData._originMaterial
            }

            o.visible = true
        })

        this.current = null
    }

    /**
     * 注册画布点击事件的拾取逻辑。
     *
     * 注意：本方法当前在函数体最前面直接 return，即「鼠标点击拾取被禁用」。
     * 目前页面交互统一走 selectByName（侧边 UI 点击），故这里刻意关闭了
     * 直接点击 3D 模型的拾取通道。如需启用，移除该 return 即可恢复以下逻辑。
     */
    initClick() {
        return

        // ---- 以下为点击拾取实现（当前不可达，作为启用备选保留） ----

        this.renderer.domElement.addEventListener("click", (event) => {
            // 1. 计算归一化鼠标坐标（相对画布）
            const rect = this.renderer.domElement.getBoundingClientRect()
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

            // 2. 由相机与鼠标坐标生成射线
            this.raycaster.setFromCamera(this.mouse, this.camera)

            // 3. 在可选集合（或当前模型/整个场景）中做射线相交检测
            const intersects = this.raycaster.intersectObjects(
                this.selectable.length ? this.selectable : [this.currentModel || this.scene],
                true,
            )

            // 4. 命中后向上寻找所属的「区域节点」，选中整个区域
            if (intersects.length > 0) {
                const obj = intersects[0].object
                const group = this.findGroup(obj)

                if (group) {
                    this.select(group)
                }
            }
        })
    }

    /**
     * 沿父级链向上查找第一个拥有名称的节点（视为「区域/分组」节点）。
     * @param {Object3D} obj 起始对象
     * @returns {Object3D|null} 找到的分组节点，否则 null
     */
    findGroup(obj) {
        while (obj.parent) {
            if (obj.name && obj.name !== "") {
                return obj
            }
            obj = obj.parent
        }
        return null
    }

    /**
     * 供外部（侧边 UI）按名称选中对象。
     * @param {string} name 目标对象名称
     */
    selectByName(name) {
        const obj = this.scene.getObjectByName(name)

        if (!obj) {
            console.warn("未找到对象:", name)
            return
        }

        this.select(obj)
    }

    /**
     * 选中核心流程：清除旧高亮 -> 高亮新对象 -> 相机飞行聚焦。
     * @param {Object3D} group 目标对象/分组
     */
    select(group) {
        this.clearHighlight()
        this.highlight(group)
        this.moveCamera(group)
        this.current = group
    }

    /**
     * 按名称批量隐藏对象（将子节点全部设为不可见）。
     * @param {string[]} names 需要隐藏的对象名称数组
     */
    handleHide(names = []) {
        names.forEach((name) => {
            const obj = this.scene.getObjectByName(name)

            if (obj) {
                obj.traverse((o) => {
                    o.visible = false
                })
            }
        })
    }

    /**
     * 高亮指定分组：遍历其内所有 Mesh，替换为「半透明 + 发光 + 提亮」的克隆材质。
     * 原始材质会暂存到 userData._originMaterial，供清除时恢复。
     */
    highlight(group) {
        group.traverse((o) => {
            if (o.isMesh) {
                // 仅首次高亮时保存原材质，避免后续高亮覆盖丢失原始引用
                if (!o.userData._originMaterial) {
                    o.userData._originMaterial = o.material
                }

                // 克隆一份材质用于高亮，避免直接修改原材质影响其它对象
                const mat = o.material.clone()

                // 半透明效果
                mat.transparent = true
                mat.opacity = 0.9

                // 自发光：柔和的青色发光（符合 PBR 材质的 emissive 约定）
                if (mat.emissive) {
                    mat.emissive = new THREE.Color(0x00eaff)
                    mat.emissiveIntensity = 0.6
                }

                // 轻微提亮：整体亮度提升
                if (mat.color) {
                    mat.color.offsetHSL(0, 0, 0.25)
                }

                o.material = mat
            }
        })
    }

    /**
     * 清除整个场景的高亮：把所有被替换过的材质恢复为原始材质并释放克隆材质。
     */
    clearHighlight() {
        this.scene.traverse((o) => {
            if (o.isMesh && o.userData._originMaterial) {
                o.material.dispose()
                o.material = o.userData._originMaterial

                delete o.userData._originMaterial
            }
        })
    }

    /**
     * 相机飞行：使用 GSAP 平滑移动相机与控制器目标到目标对象前方（斜上方视角）。
     * @param {Object3D} targetObj 需要聚焦的对象
     */
    moveCamera(targetObj) {
        const box = new THREE.Box3().setFromObject(targetObj)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z)

        const distance = maxDim * 1
        const direction = new THREE.Vector3(0, 1, 1).normalize()

        // 目标位置 = 中心 + 斜上方方向 * 距离
        const newPos = center.clone().add(direction.multiplyScalar(distance))

        // 并行对相机位置和控制目标做动画
        gsap.to(this.camera.position, {
            x: newPos.x,
            y: newPos.y,
            z: newPos.z,
            duration: 1,
            ease: "power2.out",
        })

        gsap.to(this.controls.target, {
            x: center.x,
            y: center.y,
            z: center.z,
            duration: 1,
            ease: "power2.out",
        })
    }

    /**
     * 重置相机到以世界原点为中心的斜上方固定距离视角（可指定动画时长与距离）。
     * @param {number} duration 动画时长（秒）
     * @param {number} distance 相机离原点的距离
     */
    resetCamera(duration = 1, distance = 600) {
        const center = new THREE.Vector3(0, 0, 0)
        const direction = new THREE.Vector3(0, 1, 1).normalize()

        const newPos = center.clone().add(direction.multiplyScalar(distance))

        gsap.to(this.camera.position, {
            x: newPos.x,
            y: newPos.y,
            z: newPos.z,
            duration,
            ease: "power2.out",
        })

        gsap.to(this.controls.target, {
            x: center.x,
            y: center.y,
            z: center.z,
            duration,
            ease: "power2.out",
        })

        this.controls.update()
    }

    /**
     * 重置整个场景：恢复所有模型材质、全部可见、清空选中，并将相机复位到整体视角。
     */
    resetAll() {
        if (!this.currentModel) return

        this.currentModel.traverse((o) => {
            if (o.isMesh && o.userData._originMaterial) {
                o.material.dispose()
                o.material = o.userData._originMaterial
                delete o.userData._originMaterial
            }

            o.visible = true
        })

        this.current = null

        // 复位相机（较短动画时长，快速回到整体视角）
        this.resetCamera(0.6)
    }

    /**
     * 立即（无动画）将相机对准当前主模型的完整包围盒。
     */
    fitToCurrentModel() {
        if (!this.currentModel) return

        const box = new THREE.Box3().setFromObject(this.currentModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z)
        const distance = maxDim * 1
        const direction = new THREE.Vector3(0, 1, 1).normalize()

        const newPos = center.clone().add(direction.multiplyScalar(distance))

        // duration 为 0，即瞬时定位（不产生动画过渡）
        gsap.to(this.camera.position, {
            x: newPos.x,
            y: newPos.y,
            z: newPos.z,
            duration: 0,
        })

        gsap.to(this.controls.target, {
            x: center.x,
            y: center.y,
            z: center.z,
            duration: 0,
        })
    }
}