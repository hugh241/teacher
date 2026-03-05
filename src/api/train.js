import request from "@/utils/request";
// 培训列表
// export function getTrainList(data) {
//   return request({
//     url: "/studyCourse/getTrainList",
//     method: "post",
//     data: data,
//   });
// }
export function getTrainList(data) {
  return request({
    url: "/studyCourse/getTrainListManager",
    method: "post",
    data: data,
  });
}
// 培训人员情况列表
export function getTrainListUser(data) {
  return request({
    url: "/studyCourse/getTrainListUser",
    method: "post",
    data: data,
  });
}
// 上下线
export function updateState(data) {
  return request({
    url: "/studyCourse/updateState",
    method: "post",
    params: data,
  });
}
// 培训封面上传
export function uploadFile(data) {
  return request({
    url: "/file/img/upload",
    method: "post",
    data,
  });
}
// 新增基本信息
export function addStudyCourse(data) {
  return request({
    url: "/studyCourse/addStudyCourse",
    method: "post",
    data,
  });
}
// 修改基本信息
export function updateStudyCourse(data) {
  return request({
    url: "/studyCourse/updateStudyCourse",
    method: "post",
    data,
  });
}

// 获取省市
export function getAreaListBycondition(data) {
  return request({
    url: "/area/getAreaListBycondition",
    method: "post",
    data,
  });
}

// 获取学校
export function getSchoolList(data) {
  return request({
    url: "/area/getSchoolList",
    method: "post",
    data,
  });
}

// 获取学段
export function getTuition(data) {
  return request({
    url: "/tuition/getTuition",
    method: "post",
    data,
  });
}

// 获取分类
export function getTuitionCategory(data) {
  return request({
    url: "/tuition/getTuitionCategory",
    method: "post",
    data,
  });
}

// 提交内容要求设置
export function updateRequire(data) {
  return request({
    url: "/studyCourse/updateRequire",
    method: "post",
    data,
  });
}
// 章节新增
export function addStudyChapter(data) {
  return request({
    url: "/studyChapter/addStudyChapter",
    method: "post",
    data,
  });
}
// 章节修改
export function editChapter(data) {
  return request({
    url: "/studyChapter/editChapter",
    method: "post",
    data: data,
  });
}
// 章节删除
export function deleteChapter(data) {
  return request({
    url: "/studyChapter/deleteChapter",
    method: "post",
    data: data,
  });
}
// 获取章节
export function getStudyChapterList(data) {
  return request({
    url: "/studyChapter/getStudyChapterList",
    method: "post",
    params: data,
  });
}
// 文件合并
export function mergeFile(data) {
  return request({
    url: "/uploader/mergeFile",
    method: "post",
    params: data,
  });
}
// 小节新增
export function addStudySubsection(data) {
  return request({
    url: "/studySubsection/addStudySubsection",
    method: "post",
    data,
  });
}

// 小节新增接口 11月27日 
export function addStudySubsectionNew(data) {
  return request({
    url: "/studySubsection/addStudySubsectionNew",
    method: "post",
    data,
  });
}
// 小节修改
export function editSubsection(data) {
  return request({
    url: "/studySubsection/editSubsection",
    method: "post",
    data,
  });
}
// 小节删除
export function deleteSubsection(data) {
  return request({
    url: "/studySubsection/deleteSubsection",
    method: "post",
    data,
  });
}
// 获取小节
export function getStudySubsectionList(data) {
  return request({
    url: "/studySubsection/getStudySubsectionList",
    method: "post",
    params: data,
  });
}
// 小节详情
export function getSubsectionDetail(data) {
  return request({
    url: "/studySubsection/getSubsectionDetail",
    method: "post",
    data,
  });
}
// 获取文件信息
export function getFileByFileId(id) {
  return request({
    url: "/studyCourse/getFileByFileId?fileId=" + id,
    method: "get",
  });
}
// 证书颁发设置
export function updateCertificate(data) {
  return request({
    url: "/studyCourse/updateCertificate",
    method: "post",
    data,
  });
}

//6.20新需求
//资源分类列表
export function getResTypeListData(data) {
  return request({
    url: "/resManager/getResTypeListData",
    method: "get",
    params: data,
  });
}
//资源列表
export function getResList(data) {
  return request({
    url: "/resManager/getResList",
    method: "get",
    params: data,
  });
}

//学习资源
export function getResFileList(data) {
  return request({
    url: "/resManager/getResFileList",
    method: "get",
    params: data,
  });
}
