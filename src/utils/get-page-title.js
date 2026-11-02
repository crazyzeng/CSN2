import defaultSettings from '@/settings'

const title = defaultSettings.title || '长沙南综合节能管理控制系统'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}
