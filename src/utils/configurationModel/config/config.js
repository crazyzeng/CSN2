/**
 * 组件对照表
 * @author 童汉
*/

/**
 * 组件属性对照表
 * 主要对应设置中的样式，
 * 需与后端就字段进行匹配
*/
export const prefixByType = {
    configPartImgList:                      'img',
    configPartPointTrendList:               'img',
    configPartPointSwitchList:              'img',
    configPartPointSelectList:              'select',
    configPartPointRadioboxList:            'img',
    configPartTextList:                     'text',
    configPartPointNumList:                 'value',
    configPartPointCheckboxList:            'img',
    configPartPointBitSwitchList:           'img',
    configPartPointMultiStatusDisplayList:  'img',
    configPartPointFireMonitorList:         'value',
    configPartPointBatchControlList:        'batchswitch',
    configPartPointLightControlList:        'img',    
}

/**
 * 组件属性对照表 和 文件名一致
*/
export const baseModelByType = {
    Text:               'TextModel',
    Image:              'ImageModel',
    Number:             'NumberModel',
    Radio:              'RadioModel',
    Checkbox:           'CheckboxModel',
    Switch:             'SwitchModel',
    DropListMenu:       'DropListMenuModel',
    BitSwitch:          'BitSwitchModel',
    MultiStatus:        'MultiStatusModel',
    Chart:              'ChartModel',
    DimensionChart:     'DimensionChartModel',
    FireAlarm:          'FireAlarmModel',
    BatchSwitch:        'BatchSwitchModel',
    LightingMode:       'LightingModel'
}

/**
 * 组态 key 对照表
*/
export const keyTransform = {
    Text:               'configPartTextList',
    Image:              'configPartImgList',
    Number:             'configPartPointNumList',
    Radio:              'configPartPointRadioboxList',
    Checkbox:           'configPartPointCheckboxList',
    Switch:             'configPartPointSwitchList',
    DropListMenu:       'configPartPointSelectList',
    BitSwitch:          'configPartPointBitSwitchList',
    MultiStatus:        'configPartPointMultiStatusDisplayList',
    Chart:              'configPartPointTrendList',
    DimensionChart:     'configPartDimensionChartList',
    FireAlarm:          'configPartPointFireMonitorList',
    BatchSwitch:        'configPartPointBatchControlList',
    LightingMode:       'configPartPointLightControlList'
}

/**
 * 组态 key 对照表
*/
export const formTransKey = {
    configPartImgList:                      'Image',
    configPartPointTrendList:               'Chart',
    configPartPointSwitchList:              'Switch',
    configPartPointSelectList:              'DropListMenu',
    configPartPointRadioboxList:            'Radio',
    configPartTextList:                     'Text',
    configPartPointNumList:                 'Number',
    configPartPointCheckboxList:            'Checkbox',
    configPartPointBitSwitchList:           'BitSwitch',
    configPartPointMultiStatusDisplayList:  'MultiStatus',
    configPartPointFireMonitorList:         'FireAlarm',
    configPartPointBatchControlList:        'BatchSwitch',
    configPartPointLightControlList:        'LightingMode'
}

export const formTransKeyList = {
    Text:               '文本',
    Image:              '图片',
    Number:             '数值',
    Radio:              '单选',
    Checkbox:           '复选',
    Switch:             '开关',
    DropListMenu:       '下拉菜单',
    BitSwitch:          '位开关',
    MultiStatus:        '多状态',
    Chart:              '图表',
    DimensionChart:     '趋势图',
    FireAlarm:          '火警自动监测',
    BatchSwitch:        '群控开关',
    LightingMode:       '照明模式设置'
}
