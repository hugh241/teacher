import request from "@/utils/request";
// 获取区县列表
export function getCountyList(params) {
  return request({
    url: "/getCountyList",
    method: "post",
    data: params,
  });
}
// 获取学校列表
export function getSchoolInfo(params) {
  return request({
    url: "/getSchoolInfo",
    method: "post",
    params: params,
  });
}
// 获取培训人员列表

export function getStudySubsectionUserList(params) {
  return request({
    url: "/studySubsectionUser/getStudySubsectionUserList",
    method: "post",
    params: params,
  });
}
// 获取培训人员状态的/studySubsectionUser/getStudySubsectionUserListCount
export function getStudySubsectionUserListCount(params) {
  return request({
    url: "/studySubsectionUser/getStudySubsectionUserListCount",
    method: "post",
    params: params,
  });
}
// 答题记录接口http://localhost:9090/paperUserRecord/getRecordList?pageNo=1&pageSize=5&courseId=&chapterId=&searchName=&perName=&perType=

export function getRecordList(params) {
  return request({
    url: "/paperUserRecord/getRecordList",
    method: "post",
    params: params,
  });
}
// 培训，心得数量列表/studyNotes/getStateNum

export function getStateNum(params) {
  return request({
    url: "/studyNotes/getStateNum",
    method: "post",
    params: params,
  });
}
// 培训，心得列表/studyNotes/getNotesWorkList
export function getNotesWorkList(params) {
  return request({
    url: "/studyNotes/getNotesWorkList",
    method: "post",
    params: params,
  });
}
// 管理详情/studyCourse/getCourseDetails
export function getCourseDetails(params) {
  return request({
    url: "/studyCourse/getCourseDetails",
    method: "post",
    params: params,
  });
}
// 章节列表/studySubsectionUser/getStudySubsectionUserList
export function getStudyChapterList(params) {
  return request({
    url: "/studyChapter/getStudyChapterList",
    method: "post",
    params: params,
  });
}
// 培训心得，作业详情
export function findNotesList(params) {
  return request({
    url: "/studyNotes/findNotesList",
    method: "post",
    data: params,
  });
}
// 查看证书列表
export function getHonorList(params) {
  return request({
    url: "/resource/getHonorList",
    method: "post",
    params: params,
  });
}
// 新增打分/expertScore/addScore
export function addScore(params) {
  return request({
    url: "/expertScore/addScore",
    method: "post",
    params: params,
  });
}
// 修改/expertScore/updateScore
export function updateScore(params) {
  return request({
    url: "/expertScore/updateScore",
    method: "post",
    params: params,
  });
}
// 删除试卷
export function deleteQuestionV3(params) {
  return request({
    url: "/paperPer/deletePaperPer",
    method: "post",
    data: params,
  });
}

//课程名称列表
export function getStudyCourseList(params) {
  return request({
    url: "/studyStatistics/getStudyCourseList",
    method: "get",
    params: params,
  });
}

//心得证书列表
export function getResNotesList(params) {
  return request({
    url: "/studyStatistics/getResNotesList",
    method: "get",
    params: params,
  });
}

//用户培训统计
export function getMyTrainCount(params) {
  return request({
    url: "/studyStatistics/getMyTrainCount",
    method: "get",
    params: params,
  });
}

/*
user:pf
function:证书模板
*/
export function getCertificateTemplateList(params) {
  return request({
    url: "/certificateTemplate/getCertificateTemplateList",
    method: "post",
    params: params,
  });
}
export function addOrUpdateCertificateTemplate(params) {
  return request({
    url: "/certificateTemplate/addOrUpdateCertificateTemplate",
    method: "post",
    data: params,
  });
}
export function getCertificateTemplate(params) {
  return request({
    url: "/certificateTemplate/getCertificateTemplate",
    method: "post",
    params: params,
  });
}
export function deleteCertificateTemplate(params) {
  return request({
    url: "/certificateTemplate/deleteCertificateTemplate",
    method: "post",
    params: params,
  });
}
export function previewTemplate(params) {
  return request({
    url: "/certificateTemplate/previewTemplate",
    method: "post",
    params: params,
  });
}
