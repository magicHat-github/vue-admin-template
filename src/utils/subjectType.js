/**
 * 题型
 * @type {{QUESTION_JUDGE: string, QUESTION_FILL_BLANK: string, QUESTION_SUBJECTIVE: string, QUESTION_MULTIPLE_CHOICE: string, QUESTION_SINGLE_CHOICE: string}}
 */
export const questionType = {
  QUESTION_SINGLE_CHOICE: '单选题',
  QUESTION_MULTIPLE_CHOICE: '多选题',
  QUESTION_FILL_BLANK: '填空题',
  QUESTION_SUBJECTIVE: '主观题',
  QUESTION_JUDGE: '判断题'
}

/**
 * 正确答案标志位
 * @type {{right: number, wrong: number}}
 */
export const rightAnswerStatus = {
  right: 2,
  wrong: 1
}

/**
 * 题目数据转换
 * @param info
 * @param subjectCategoryList
 * @returns {*}
 */
export function subjectConversion(info, subjectCategoryList) {
  info.subjects.forEach(item => {
    subjectCategoryList.forEach(category => {
      if (category.id === item.categoryId) {
        item.type = category.attribute
        item.typeName = category.value
      }
    })
    item.userAnswer = ''
    if (item.type === questionType.QUESTION_MULTIPLE_CHOICE) { // 单选题
      item.userAnswer = []
      item.answers.forEach(answer => {
        if (answer.rightAnswer === rightAnswerStatus.right) {
          answer.rightAnswer = true
          item.userAnswer.push(answer.id)
        } else {
          answer.rightAnswer = false
        }
      })
    } else if (item.type === questionType.QUESTION_SINGLE_CHOICE) { // 多选题
      item.answers.forEach(answer => {
        if (answer.rightAnswer === rightAnswerStatus.right) {
          answer.rightAnswer = true
          item.userAnswer = answer.id
        } else {
          answer.rightAnswer = false
        }
      })
    } else {
      item.userAnswer = item.answers[0].answer
      item.answers[0].rightAnswer = true
    }
  })
  return info
}
