import request from '@/utils/request'
// 获取培训首页
export function getTrainList(payload = {}) {
    return request({
        url: '/studyCourse/getTrainList',
        method: 'post',
        data: payload
    })
}