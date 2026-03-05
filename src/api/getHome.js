import request from '@/utils/request'
// 获取培训首页
export function getTrainList(payload = {}) {
    return request({
        url: '/studyCourse/getTrainList',
        method: 'post',
        params: payload
    })
}

// 首页轮播图
export function getCarouselList(payload = {}) {
    return request({
        url: '/studyCourse/getCarouselList',
        method: 'post',
        data: payload
    })
}

//课程学习
export function getCourseDetails(param) {
    return request({
        url: '/studyCourse/getCourseDetails?courseId=' + param,
        method: 'get',
    })
}

export function getStudyTopList(query) {
    return request({
        url: '/studyCourse/getStudyTopList',
        method: 'post',
        params: query
    })
}