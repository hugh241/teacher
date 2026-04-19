import request from '@/utils/request';
export function getStudyCourseList(query) {
  return request({
    url: '/studyCourse/getStudyCourseList',
    method: 'post',
    params: query
  })
}
export function getCourseList(query) {
  return request({
    url: '/studyCourse/getCourseList',
    method: 'post',
    params: query
  })
}

export function getStudyChapterList(query) {
  return request({
    url: '/studyChapter/getStudyChapterList',
    method: 'post',
    params: query
  })
}
export function getStudySubsectionList(query) {

  return request({
    url: '/studySubsection/getStudySubsectionList',
    method: 'post',
    params: query
  })
}

export function getChapterList(query) {
  return request({
    url: '/studyChapter/getChapterList',
    method: 'post',
    params: query
  })
}

export function getQuestionList(query) {
  return request({
    url: '/paperQuestions/getQuestionList',
    method: 'post',
    params: query
  })
}

//课程管理
export function addStudyCourse(param) {
  return request({
    url: '/studyCourse/addStudyCourse',
    method: 'post',
    params: param
  })
}
export function editStudyCourse(param) {
  return request({
    url: '/studyCourse/editStudyCourse',
    method: 'post',
    params: param
  })
}
export function deleteStudyCourse(param) {
  return request({
    url: '/studyCourse/deleteStudyCourse',
    method: 'post',
    params: param
  })
}
export function getCourseChapter(param) {
  return request({
    url: '/studyCourse/getCourseChapter',
    method: 'post',
    params: param
  })
}
export function getStudyTopList(query) {
  return request({
    url: '/studyCourse/getStudyTopList',
    method: 'post',
    params: query
  })
}

//章节管理
export function addStudyChapter(param) {
  return request({
    url: '/studyChapter/addStudyChapter',
    method: 'post',
    data: param
  })
}


export function editChapter(param) {
  return request({
    url: '/studyChapter/editChapter',
    method: 'post',
    data: param
  })
}
export function deleteChapter(param) {
  return request({
    url: '/studyChapter/deleteChapter',
    method: 'post',
    data: param
  })
}

//小节管理
export function addStudySubsection(param) {
  return request({
    url: '/studySubsection/addStudySubsection',
    method: 'post',
    data: param
  })
}

export function getSubsectionDetail(param) {
  return request({
    url: '/studySubsection/getSubsectionDetail',
    method: 'post',
    data: param
  })
}

export function getFileByFileId(param) {
  return request({
    url: '/studyCourse/getFileByFileId?fileId=' + param,
    method: 'get'
  })
}


export function editSubsection(param) {
  return request({
    url: '/studySubsection/editSubsection',
    method: 'post',
    data: param
  })
}
export function deleteSubsection(param) {
  return request({
    url: '/studySubsection/deleteSubsection',
    method: 'post',
    data: param
  })
}
export function addAnswerQuestion(param) {
  return request({
    url: '/studySubsection/addAnswerQuestion',
    method: 'post',
    data: param
  })
}

// 试题管理

// 编辑试题
export function editQuestion(param) {
  return request({
    url: '/paperQuestions/editQuestion',
    method: 'post',
    data: param
  })
}

//测试题管理
export function addPaperPer(param) {
  return request({
    url: '/paperPer/addPaperPer',
    method: 'post',
    data: param
  })
}
export function getPaperPerList(param) {
  return request({
    url: '/paperPer/getPaperPerList',
    method: 'post',
    params: param
  })
}
export function getPaperPerList2(param) {
  return request({
    url: '/paperPer/getPaperPerList2',
    method: 'post',
    params: param
  })
}
export function editPaperPer(param) {
  return request({
    url: '/paperPer/editPaperPer',
    method: 'post',
    data: param
  })
}
export function getPaperAnswerRecord(param) {
  return request({
    url: '/paperPer/getPaperAnswerRecord',
    method: 'post',
    data: param
  })
}
export function deletePaperPer(param) {
  return request({
    url: '/paperPer/deletePaperPer',
    method: 'post',
    data: param
  })
}
//组卷
export function getPaperInfo(param) {
  return request({
    url: '/paperPer/getPaperInfo',
    method: 'post',
    data: param
  })
}
export function getAnswerRecordDetail3(param) {
  return request({
    url: '/paperUserRecord/getAnswerRecordDetail3',
    method: 'post',
    data: param
  })
}
export function getPaperPerInfo3(param) {
  return request({
    url: '/paperPer/getPaperPerInfo3?perId=2032801782834556928',
    method: 'post',
    data: param
  })
}
export function addPaperRel(param) {
  return request({
    url: '/paperPer/addPaperRel',
    method: 'post',
    data: param
  })
}
export function deletePaperRel(param) {
  return request({
    url: '/paperPer/deletePaperRel',
    method: 'post',
    data: param
  })
}
export function getPaperTotalScore(param) {
  return request({
    url: '/paperPer/getPaperTotalScore',
    method: 'post',
    data: param
  })
}
export function getPaperRelCount(paperId) {
  return request({
    url: '/paperPer/getPaperRelCount?paperId=' + paperId,
    method: 'get',
  })
}



// // 添加试题
export function addQuestion(param) {
  return request({
    url: '/paperQuestions/addQuestion',
    method: 'post',
    data: param
  })
}
// // 删除试题
export function deleteQuestion(param) {
  return request({
    url: '/paperQuestions/deleteQuestion',
    method: 'post',
    data: param
  })
}
// // 获取试题选项
export function getOptionsByQuestion(param) {
  return request({
    url: '/paperQuestions/getOptionsByQuestion',
    method: 'post',
    data: param
  })
}
// // 修改试题选项
export function addQuestionOption(param) {
  return request({
    url: '/paperQuestions/addQuestionOption',
    method: 'post',
    data: param
  })
}
// // 试题模板导出
export function exportQuestionCard(param) {
  return request({
    url: '/paperQuestions/exportQuestionCard',
    method: 'post',
    data: param
  })
}
// // 试题导入
export function importQuestionMessage(param) {
  return request({
    url: '/paperQuestions/importQuestionExcel',
    method: 'post',
    data: param
  })
}
// //用户答题记录
export function getRecordList(param) {
  return request({
    url: '/paperUserRecord/getRecordList',
    method: 'post',
    params: param
  })
}
export function getAnswerRecordDetail(param) {
  return request({
    url: '/paperUserRecord/getAnswerRecordDetail',
    method: 'post',
    data: param
  })
}
export function getAnswerRecordDetail2(param) {
  return request({
    url: '/paperUserRecord/getAnswerRecordDetail2',
    method: 'post',
    data: param
  })
}


//课程学习
export function getCourseDetails(param) {
  return request({
    url: '/studyCourse/getCourseDetails?courseId=' + param,
    method: 'get',
  })
}
export function findCourseStudyDetail(param) {
  return request({
    url: '/studyCourseUser/process?courseId=' + param,
    method: 'get',
  })
}
export function findChapterStudyDetail(param) {
  return request({
    url: '/studyCourseUser/chapterProcess?chapterId=' + param,
    method: 'get'
  })
}
export function refreshStudyProcess(param) {
  return request({
    url: '/studyCourseUser/refreshProcess',
    method: 'post',
    data: param
  })
}
export function recordStudyProcess(param) {
  return request({
    url: '/studyCourseUser/recordProcess',
    method: 'post',
    data: param
  })
}
export function findNotes(param) {
  return request({
    url: '/studyNotes/findList',
    method: 'post',
    data: param
  })
}
export function findNotesList(param) {
  return request({
    url: '/studyNotes/findNotesList',
    method: 'post',
    data: param
  })
}
export function addNote(param) {
  return request({
    url: '/studyNotes/add',
    method: 'post',
    data: param
  })
}
export function addStudyNotes(param) {
  return request({
    url: '/studyNotes/addStudyNotes',
    method: 'post',
    data: param
  })
}
export function addStudyNotesWork(param) {
  return request({
    url: '/studyNotes/addStudyNotesWork',
    method: 'post',
    data: param
  })
}
export function findStudyProblemExchanges(param) {
  return request({
    url: '/studyProblemExchanges/findList',
    method: 'post',
    data: param
  })
}
export function addStudyProblemExchanges(param) {
  return request({
    url: '/studyProblemExchanges/add',
    method: 'post',
    data: param
  })
}
export function findReplies(param) {
  return request({
    url: '/studyProblemExchanges/findReplies',
    method: 'post',
    data: param
  })
}
export function uploadStudyFile(param) {
  return request({
    url: '/file/img/uploadStudyFile',
    method: 'post',
    data: param
  })
}
export function getQuestionDetail(param) {
  return request({
    url: '/paperQuestions/getQuestionDetail',
    method: 'post',
    data: param
  })
}

//考练中心
export function getUserPaperList(param) {
  return request({
    url: '/paperPer/getUserPaperList',
    method: 'post',
    data: param
  })
}
export function getChapterDetail(param) {
  return request({
    url: '/studyChapter/getChapterDetail',
    method: 'post',
    data: param
  })
}
export function getPaperInfoById(param) {
  return request({
    url: '/paperPer/getPaperInfoById',
    method: 'post',
    data: param
  })
}
export function addUserRecord(param) {
  return request({
    url: '/paperUserRecord/addUserRecord',
    method: 'post',
    data: param
  })
}
//问卷反馈
export function getPaperUserRecord(param) {
  return request({
    url: '/paperPer/getPaperUserRecord?perId=' + param,
    method: 'get'
  })
}
export function getQuestionPaper(param) {
  return request({
    url: '/paperPer/getQuestionPaper?courseId=' + param,
    method: 'get'
  })
}
export function saveQuestionPaper(param) {
  return request({
    url: '/paperPer/saveQuestionPaper',
    method: 'post',
    data: param
  })
}
export function deleteQuestionV3(questionId) {
  return request({
    url: '/paperQuestions/deleteQuestionV3?questionId=' + questionId,
    method: 'get'
  })
}
//  新增中途试题
export function addVerifyQuestion(param) {
  return request({
    url: '/paperQuestions/addVerifyQuestion',
    method: 'post',
    data: param
  })
}
export function getPaperQuestionsById(query) {
  return request({
    url: '/paperQuestions/getPaperQuestionsById',
    method: 'post',
    params: query
  })
}

//查看证书
export function getHonor(query) {
  return request({
    url: '/resource/getHonor',
    method: 'post',
    params: query
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

export function addPaperRel_v2(param) {
  return request({
    url: '/paperPer/addPaperRel_v2',
    method: 'post',
    data: param
  })
}
export function deleteQuestionV2(questionId) {
  return request({
    url: '/paperQuestions/deleteQuestionV2?questionId=' + questionId,
    method: 'get'
  })
}
export function recordStudyProcessV1(param) {
  return request({
    url: '/studyCourseUser/recordProcessV1',
    method: 'post',
    data: param
  })
}

// 新增学习资料接口
export function getSstudyFiles(subsectionId) {
  return request({
    url: '/studySubsection/getStudyFiles?subsectionId=' + subsectionId,
    method: 'get',
  })
}