import request from '@/utils/request'
// 获取群组列表
export function getGroupList(data) {
    return request({
      url: '/groupInfo/getGroupList',
      method: 'post',
      data: data
    })
  }