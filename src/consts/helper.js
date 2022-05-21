export const HELPER = {
  JSONPATH_TITLE: `JSON格式的解析同样支持数组中指定对象，如data.itemlist[0]；支持提取数据中随机值data.itemlist[random]；同时支持提取部分值组合为新数组，data.itemlist[0-99].id导出前100个id，data.itemlist[all].id即导出全部id。若想将数组内的值进行遍历使用，请结合数据导出节点配合使用。正则表达式可指定匹配项.
                    常见正则表达式中使用到的字符范围示例如下:
                    英文字母:[a-zA-Z]
                    数字:[0-9]
                    中文字符范围:[\u4e00-\u9fa5]
                    中文、英文、数字：[\u4e00-\u9fa5a-zA-Z0-9]
                    指定符合条件的字符个数：[a-zA-Z]{2,4} 表示2-4个字符；{2}表示字符个数为2个。
                    注意：尽量不要使用*,否则0个也会匹配到`,

}
