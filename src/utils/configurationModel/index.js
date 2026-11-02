import localFactory from './model/local-transfer-theme'
import themeFactory from './model/theme-transfer-local'

import { keyTransform, formTransKey, formTransKeyList } from './config/config'
import { isEmpty } from '@/utils/index'


/**
 * 创建主题配置数据
 */
export function createConfigTheme(materials, screen) {

    /**
     * 初始化 主题的 key
     */
    function initThemeKeys(theme, keys) {
        for (const item of Object.values(keys)) {
            theme[item] = []
        }
    }

    /**
     * 设置 configTheme
     */
    function setConfigTheme(theme, screen) {
        if (isEmpty(screen.name)) {
            throw new Error(`请填写页面名称`)
        }

        if ('deviceType' in screen && isEmpty(screen.deviceType)) {
            throw new Error(`请选择设备类型`)
        }

        if ('orgId' in screen && (!Array.isArray(screen.orgId) || screen.orgId.length <= 0)) {
            throw new Error(`请选择所属资源`)
        }

        theme.configTheme = {
            name: screen.name,
            canvasWidth: screen.attribute.w,
            canvasHeight: screen.attribute.h
        }

        screen.id && (theme.configTheme.themeId = screen.id)
        screen.orgId && (theme.configTheme.orgId = screen.orgId[screen.orgId.length - 1].toString())
        screen.deviceType && (theme.configTheme.type = screen.deviceType)
    }

    /**
     * 设置 configTheme
     */
    function setConfigurationList(theme, materials) {
        materials.forEach(item => {
            theme[keyTransform[item.name]].push(localFactory(item))
        })
    }

    const theme = {}
    initThemeKeys(theme, keyTransform)
    setConfigTheme(theme, screen)
    setConfigurationList(theme, materials)
    return theme
}

/**
 * 创建物料配置数据
 */
export function createConfigMaterial(theme) {
    /**
     * 获取完整的 orgids
     */
    function getOrgIds(s) {
        let l = s.length - 4
        const arr = [s]
        while (l >= 4) {
            arr.push(s.substring(0, l))
            l -= 4
        }
        return arr.reverse()
    }

    /**
     * 设置 screen
     */
    function createScreen(theme) {
        const {
            name,
            orgId,
            type,
            themeId: id,
            canvasWidth: w,
            canvasHeight: h,
        } = theme.configTheme

        const data = {
            id,
            name,
            attribute: { w, h }
        }

        type && (data.deviceType = type)
        orgId && (data.orgId = getOrgIds(orgId))

        return data
    }

    /**
     * 设置 materials
     */
    function createMaterials(theme) {
        const material = []
        for (let [key, materials] of Object.entries(theme)) {
            const materialName = formTransKey[key]
            if (materialName && materials.length > 0) {
                materials.forEach((item => {
                    const data = themeFactory(item, materialName)
                    data && material.push(data)
                }))
            }
        }
        // 需要在此处做组件名称中文翻译
        for (let i = 0; i < material.length; i++) {
            material[i].text = formTransKeyList[material[i].name]
        }
        
        return material
    }


    const screen = createScreen(theme)
    const materials = createMaterials(theme)

    return {
        screen,
        materials
    }
}


