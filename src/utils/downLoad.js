/*
 * @Date: 2022-11-22 18:40:23
 * @LastEditTime: 2023-01-04 15:24:32
 * @FilePath: /campus-security-vue/src/utils/downloadEvent.js
 * @Description:
 */
import { getToken } from '@/utils/auth'
import axios from 'axios'
// import { type } from 'stylus/lib/functions'
export default {
  downloadEvent(metheds, name, url, isform, data) {
    // const loading = this.$loading({
    //   lock: true,
    //   text: '文件下载中，请稍后',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)',
    // })
    let type = ''
    if (isform) {
      type = 'application/x-www-form-urlencoded'
    } else {
      type = 'application/json;charset=utf-8'
    }
    axios({
      url: process.env.VUE_APP_BASE_API + url,
      method: metheds,
      data: data,
      headers: {
        'Content-Type': type,
        'X-Token': getToken(),
        Authorization: getToken(),
      },
      onDownloadProgress: pro => {},
      responseType: 'blob', // important
    })
      .then(res => {
        let fileName = decodeURI(res.headers[`content-disposition`].split('=')[1])
        const content = res.data
        const blob = new Blob([content], { type: 'application/vnd.ms-excel,charset=UTF-8' })
        if ('download' in document.createElement('a')) {
          // 支持a标签download的浏览器
          const link = document.createElement('a') // 创建a标签
          // link.download = fileName + '.xlsx' // a标签添加属性
          link.download = fileName // a标签添加属性
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click() // 执行下载
          URL.revokeObjectURL(link.href) // 释放url
          document.body.removeChild(link) // 释放标签
        } else {
          // 其他浏览器
          navigator.msSaveBlob(blob, fileName)
        }
        // eslint-disable-next-line handle-callback-err
      })
      .catch(err => {})
  },
}
