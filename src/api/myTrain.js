import request from '@/utils/request'
// 获取我的培训数据
export function getMyTrainList(payload = {}) {
    return request({
        url: '/studySubsectionUser/getMyTrainList',
        method: 'post',
        params: payload
    })
}
// 获取我的培训统计数据
export function getMyTrainCount(payload = {}) {
    return request({
        url: 'studySubsectionUser/getMyTrainCount',
        method: 'post',
        data: payload
    })
}
//获取我的证书列表
export function getHonorList(payload = {}) {
    return request({
        url: '/resource/getHonorList',
        method: 'post',
        params: payload
    })
}
// 获取我的证书统计数据
export function getHonorCount(payload = {}) {
    return request({
        url: 'resource/getHonorCount',
        method: 'post',
        data: payload
    })
}
export function getHonorSelf(query) {
    return request({
        url: '/resource/getHonorSelf',
        method: 'post',
        params:query
    })
}
export function getCourseFinishedHour(query) {
    return request({
        url: 'studyCourse/getCourseFinishedHour',
        method: 'post',
        data: query  // 改为 data 传递请求体
    })
}