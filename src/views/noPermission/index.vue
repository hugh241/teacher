<template>
  <div class="container">
    <div class="center-panel">
      <div class="content">
        <img src="@/assets/img/base/noPermission.png" alt="无权限" class="no-permission-img">
        <el-button 
          type="primary" 
          class="back-btn"
          @click="handleBack"
        >
          返回
        </el-button>
      </div>
    </div>
    <div class="right-panel">
      <div class="right-content">
        <div class="faq-box">
          <div class="faq-header">
            <h3>常见问题</h3>
          </div>
        <div class="faq-content">
          <div
            v-for="(item, pIndex) in faqList"
            :key="`parent-${pIndex}`"
            class="faq-parent-card"
          >
            <div class="faq-parent-body">
              <div class="parent-head">
                <div class="parent-index">{{ (pIndex + 1).toString().padStart(2, '0') }}</div>
                <div class="parent-info">
                  <div class="parent-title-text">{{ item.question }}</div>
                  <div
                    class="parent-desc"
                    v-if="item.description"
                    v-html="formatAnswer(item.description)"
                  ></div>
                </div>
              </div>
              <!-- <div class="parent-footer">
                <div class="parent-meta">
                  {{ item.children.length ? `共 ${item.children.length} 条解决方案` : '暂无解决方案' }}
                </div>
              </div> -->
            </div>
            <div v-if="item.children.length" class="faq-children">
              <div
                v-for="(child, cIndex) in item.children"
                :key="`child-${pIndex}-${cIndex}`"
                class="faq-child-item"
              >
                <div class="child-row">
                  <div class="child-question">
                    <span class="child-icon">Q{{ cIndex + 1 }}</span>
                    <span class="child-text">{{ child.question }}</span>
                  </div>
                </div>
                <div class="solution-link" @click="toggleSolution(`${pIndex}-${cIndex}`)">
                  解决方法
                  <i :class="activeKey === `${pIndex}-${cIndex}` ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </div>
                <transition name="slide-fade">
                  <div
                    v-show="activeKey === `${pIndex}-${cIndex}`"
                    class="faq-answer"
                  >
                    <div class="answer-content" v-html="formatAnswer(child.answer)"></div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div class="manual-link">
          <i class="el-icon-document"></i>
          <a 
            href="https://cdnbasic.scbdc.edu.cn/平台资源/实名认证操作手册2025年11月26日.pdf" 
            target="_blank"
            class="manual-link-text"
          >
            实名认证操作手册
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoPermission',
  data() {
    return {
      activeKey: '',
      faqList: [
        {
          question: '问题一：登录培训平台提示无权限',
          description: `老师需确认自己登录时使用的手机号是否已经完成教师实名认证，如果还未完成实名认证，请前往四川中小学智慧教育平台（https://basic.sc.smartedu.cn/）完成教师实名认证。以下是实名认证过程中常见问题的解决方法：`,
          children: [
            {
              question: '实名认证问题一：实名认证时若提示“该实名信息不存在，请联系学校管理员新增”',
              answer: `请老师联系工作学校的管理员在四川中小学管理后台中的用户管理-教师检验信息管理处将信息新增，新增之后老师在四川中小学智慧教育平台（https://basic.sc.smartedu.cn/）完成实名认证。`
            },
            {
              question: '实名认证问题二：实名认证时若提示“该实名信息已被认证，请联系学校管理员查询”，(手机号不一致)',
              answer: `请老师联系工作学校的管理员在四川中小学管理后台中的用户管理-用户查询处输入身份证号码查询，如果查询出来是已经实名认证的教师身份，但是绑定的手机号与现在使用的手机号不一致，可让工作学校的管理员修改手机号，修改之后直接重新登录培训平台，不用再进行实名认证。
              `
            },
            {
              question: '实名认证问题三：实名认证时若提示“该实名信息已被认证，请联系学校管理员查询”，(学生身份解绑)',
              answer: `请老师联系工作学校的管理员在四川中小学管理后台中的用户管理-用户查询处输入身份证号码查询，如果查询出来是学生身份，需要老师本人使用学生身份绑定的手机号登录四川中小学智慧教育平台，登录之后将学生身份解绑，然后再让工作学校的管理员在四川中小学管理后台中的用户管理-教师检验信息管理处将信息新增，新增之后老师在四川中小学智慧教育平台（https://basic.sc.smartedu.cn/）完成实名认证。
              `
            },
            {
              question: '实名认证问题四：实名认证时若提示“您已毕业，是否解除毕业学生身份绑定？”',
              answer: `老师需点击解绑，将学生身份进行解绑，解绑后联系工作学校的管理员在四川中小学管理后台中的用户管理-教师检验信息管理处将信息新增，新增之后老师在四川中小学智慧教育平台（https://basic.sc.smartedu.cn/）完成实名认证。
              `
            },
            {
              question: '实名认证问题五：实名认证时若提示“认证失败，该用户实名类型错误”',
              answer: `请老师联系工作的学校管理员在四川中小学管理后台中的用户管理-用户查询处输入身份证号码查询，如果查询出来身份号码还是其他学校的学生，需要联系该学校的管理员在管理后台中的用户管理-学生检验信息管理处将信息停用，然后再让工作学校管理员在四川中小学管理后台中的用户管理-教师检验信息管理处将信息新增，新增之后老师在四川中小学智慧教育平台（https://basic.sc.smartedu.cn/）完成实名认证。
              `
            },
            {
              question: '实名认证问题六：实名认证时绑定年级班级信息时没有数据',
              answer: `需要联系工作的学校管理员在四川中小学管理后台中的机构管理-班级管理处新增对应的班级数据。
              `
            },
          ]
        },
        {
          question: '问题二：登录时提示绑定授课信息',
          description: '任意选择一条班级年级学科信息之后，添加信息保存完成授课信息的绑定，然后重新登陆教师培训平台（https://basic.sc.smartedu.cn/hd/teacherTraining/）',
          children: []
        }
      ]
    }
  },
  methods: {
    handleBack() {
      // 跳转到指定URL
      window.location.href = 'https://www.scedu.com.cn/ThirdPortalService/html/indexNew/index.html#/home?active=2&type';
    },
    toggleSolution(key) {
      this.activeKey = this.activeKey === key ? '' : key;
    },
    formatAnswer(answer) {
      if (!answer) return '';
      // 匹配 http(s) 链接，排除尾部的括号等符号
      const urlPattern = /(https?:\/\/[^\s<>"'）)]+)/g;
      const withLinks = answer.replace(urlPattern, (url) => {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
      return withLinks.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.center-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
}

.right-panel {
  flex: 0 0 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.right-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.right-content::-webkit-scrollbar {
  width: 6px;
}

.right-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.right-content::-webkit-scrollbar-thumb {
  background: #409EFF;
  border-radius: 3px;
}

.right-content::-webkit-scrollbar-thumb:hover {
  background: #66b1ff;
}

.faq-box {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.faq-header {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  padding: 20px 24px;
  color: #ffffff;
}

.faq-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.faq-header h3::before {
  content: '❓';
  margin-right: 10px;
  font-size: 24px;
}

.manual-link {
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding: 12px 10px;
  /* background-color: #ffffff; */
  border-radius: 8px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); */
  transition: all 0.3s ease;
  width: 100%;
}

.manual-link:hover {
  background-color: #f0f7ff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.manual-link i {
  font-size: 18px;
  color: #409EFF;
  margin-right: 8px;
}

.manual-link-text {
  color: #409EFF;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.manual-link-text:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.faq-content {
  padding: 16px;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

.faq-content::-webkit-scrollbar {
  width: 6px;
}

.faq-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.faq-content::-webkit-scrollbar-thumb {
  background: #409EFF;
  border-radius: 3px;
}

.faq-content::-webkit-scrollbar-thumb:hover {
  background: #66b1ff;
}

.faq-parent-card {
  margin-bottom: 24px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(64, 158, 255, 0.2);
  box-shadow: 0 16px 40px rgba(64, 158, 255, 0.08);
  overflow: hidden;
}

.faq-parent-body {
  padding: 24px;
}

.parent-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.parent-index {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 25px rgba(64, 158, 255, 0.35);
}

.parent-info {
  flex: 1;
}

.parent-title-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2d3d;
  margin-bottom: 10px;
  line-height: 1.6;
}

.parent-desc {
  font-size: 14px;
  color: #5f6f87;
  line-height: 1.8;
  margin-bottom: 18px;
}

.parent-desc a {
  color: #409EFF;
  text-decoration: none;
  border-bottom: 1px solid #409EFF;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.parent-desc a:hover {
  color: #66b1ff;
  border-bottom-color: #66b1ff;
}

.parent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.parent-meta {
  font-size: 13px;
  color: #8c9bb5;
}

.parent-solution-link {
  font-size: 14px;
  color: #409EFF;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s ease;
}

.parent-solution-link:hover {
  color: #66b1ff;
}

.faq-children {
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.child-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.faq-child-item {
  border: 1px solid #dfe8ff;
  border-radius: 12px;
  padding: 18px 20px;
  background: #f9fbff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.child-question {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.child-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #409EFF;
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
}

.child-text {
  flex: 1;
  font-size: 15px;
  color: #2c3e50;
  line-height: 1.6;
}

.solution-link {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  font-weight: 600;
  color: #409EFF;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s ease;
  width: 100%;
}

.solution-link i {
  font-size: 12px;
}

.solution-link:hover {
  color: #66b1ff;
}


.faq-answer {
  margin-top: 12px;
  padding: 12px;
  background-color: #ffffff;
  border-top: 1px solid #f0f2f5;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
}

.answer-label {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%);
  border-left: 3px solid #409EFF;
  border-radius: 6px;
  margin: 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #409EFF;
}

.answer-label i {
  margin-right: 8px;
  font-size: 16px;
}

.answer-content {
  padding: 0 0 0 4px;
  font-size: 14px;
  color: #666666;
  line-height: 1.8;
  word-break: break-word;
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.answer-content a {
  color: #409EFF;
  text-decoration: none;
  border-bottom: 1px solid #409EFF;
  transition: all 0.3s ease;
}

.answer-content a:hover {
  color: #66b1ff;
  border-bottom-color: #66b1ff;
}

.answer-content h4 {
  margin: 16px 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #333333;
}

.answer-content h4:first-child {
  margin-top: 0;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.no-permission-img {
  max-width: 400px;
  width: 100%;
  height: auto;
  margin-bottom: 30px;
}

.back-btn {
  padding: 12px 40px;
  font-size: 16px;
  border-radius: 6px;
}


/* 响应式设计 */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }

  .center-panel {
    flex: none;
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }

  .right-panel {
    flex: none;
    width: 100%;
  }

  .right-content {
    max-height: 600px;
  }

  .faq-content {
    max-height: 450px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .right-content {
    max-height: 500px;
  }

  .faq-content {
    max-height: 350px;
  }

  .no-permission-img {
    max-width: 300px;
  }
  
  .back-btn {
    padding: 10px 30px;
    font-size: 14px;
  }

  .faq-header h3 {
    font-size: 18px;
  }

  .parent-title {
    font-size: 16px;
  }

  .child-text {
    font-size: 14px;
  }
}
</style>