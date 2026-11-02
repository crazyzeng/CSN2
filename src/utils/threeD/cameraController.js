/**
 * 相机平滑飞行控制器
 *
 * 职责：
 *  提供一个「聚焦到指定物体」的相机动画工具：根据目标物体的包围盒计算合适的观察位置，
 *  然后通过线性插值（lerp）逐帧平滑移动相机与控制器目标点，实现柔和的镜头推近效果。
 *
 * 说明：
 *  本模块不直接操作渲染循环，而是由外部（渲染循环或组件）周期性调用 update() 来驱动动画。
 */

import * as THREE from "three"

/**
 * 创建相机控制器实例。
 *
 * @param {Object} camera   需要被控制的透视图相机
 * @param {Object} controls 与该相机绑定的轨道控制器（OrbitControls）
 * @returns {{focusOnObject: Function, update: Function}}
 */
export function createCameraController(camera, controls) {

    /** 相机将要移动到的目标位置 */
    let targetPosition = new THREE.Vector3()
    /** 相机（与控制器）将要注视的目标点 */
    let targetLookAt = new THREE.Vector3()

    /** 是否正在执行飞行动画 */
    let isMoving = false

    /**
     * 让相机聚焦到指定物体：根据其包围盒计算目标位置与注视点，并开始动画。
     * @param {Object3D} object 需要聚焦的物体
     */
    function focusOnObject(object) {
        // 计算物体包围盒的中心与尺寸
        const box = new THREE.Box3().setFromObject(object)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z)

        // 相机距离取最长边的 2 倍，保证物体完整落入视野
        const distance = maxDim * 2

        // 从斜上方观察的方向（归一化后乘距离得到偏移量）
        const direction = new THREE.Vector3(1, 1, 1).normalize()

        targetPosition = center.clone().add(direction.multiplyScalar(distance))
        targetLookAt = center

        isMoving = true
    }

    /**
     * 每帧更新：若处于飞行状态，则对相机位置与目标点做插值逼近。
     * 当足够接近目标时停止动画。
     */
    function update() {
        if (!isMoving) return

        // lerp 因子 0.08：每次向目标移动 8%，形成「快 -> 慢」的缓动效果
        camera.position.lerp(targetPosition, 0.08)
        controls.target.lerp(targetLookAt, 0.08)

        controls.update()

        // 距离逼近到 0.1 以内视为到达，结束动画
        if (camera.position.distanceTo(targetPosition) < 0.1) {
            isMoving = false
        }
    }

    return {
        focusOnObject,
        update,
    }
}