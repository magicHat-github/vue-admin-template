import { DialogType } from './common'
import { addNewRecord } from '@/api/exam'
/**
 * 获得弹窗的表单数据
 * @param {弹窗数据} DialogData
 */
function getDialogFromData(formData) {
  return {
    // 试卷名
    paperName: formData.paperName,
    // 试卷id
    paperId: formData.paperId,
    // 考试场次
    examSession: formData.examSession,
    // 考试的标题
    title: formData.title,
    // 考试开始时间
    examStartTime: formData.examStartTime,
    // 考试结束时间
    examEndTime: formData.examEndTime,
    // 考试时长
    examLimitTime: formData.examLimitTime,
    // 阅卷官列表
    judges: formData.judges,
    // 阅卷方式
    markingMode: formData.markingMode,
    // 阅卷结束时间
    markingEndTime: formData.markingEndTime,
    // 计划参加人数
    planPeopleNum: formData.planPeopleNum,
    // 备注
    description: formData.description
  }
}
export default {

  /**
   * 添加一条发布记录
   * @param {请求的数据} formData
   */
  addPublishRecord(formData) {
    return new Promise((resolve, reject) => {
      if (formData.dialogType === DialogType.NEWPUBLISH || formData.dialogType === DialogType.REPUBLISH) {
        console.log(formData)
        /**
         * 设置请求格式
         */
        const record = getDialogFromData(formData)
        addNewRecord(record).then(rsp => {
          resolve(rsp)
        }).catch(err => {
          reject(err)
        })
      } else {
        reject(new Error('错误调用'))
      }
    })
  }
}
