import request from "@/utils/request";

// 选择培训下拉列表
export function chooseCourseList(data) {
  return request({
    url: "/statistics/chooseCourseList",
    method: "get",
    params: data,
  });
}

// 获取总学时等列表
export function trainingCountByCondition(params) {
  return request({
    url: "/statistics/trainingCountByCondition",
    method: "get",
    params: params,
  });
}

// 获取近七天总学时等列表
export function trainingHoursCount(params) {
  return request({
    url: "/statistics/trainingHoursCount",
    method: "get",
    params: params,
  });
}

// 获取近七天总学时等列表
export function courseUserByMonth(params) {
  return request({
    url: "/statistics/courseUserByMonth",
    method: "post",
    params: params,
  });
}

// 获取参与人完成培训比例(饼图)
export function courseUserFinish(params) {
  return request({
    url: "/statistics/courseUserFinish",
    method: "post",
    params: params,
  });
}

// 获取参与人按市州划分(柱状图)
export function courseUserByCity(params) {
  return request({
    url: "/statistics/courseUserByCity",
    method: "post",
    params: params,
  });
}

// 获取参与人学习时长占比(饼图)
export function courseStudyTime(params) {
  return request({
    url: "/statistics/courseStudyTime",
    method: "post",
    params: params,
  });
}

// 获取参与人按学段分类划分(柱状图)
export function courseUserByTuition(params) {
  return request({
    url: "/statistics/courseUserByTuition",
    method: "post",
    params: params,
  });
}
