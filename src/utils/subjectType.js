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
        item.typeName = category.name
      }
    })
    item.userAnswer = ''
    if (item.type === questionType.QUESTION_MULTIPLE_CHOICE) {
      item.userAnswer = []
      item.answers.forEach(answer => {
        if (answer.rightAnswer === 1) {
          item.userAnswer.push(answer.id)
        }
      })
    } else if (item.type === questionType.QUESTION_SINGLE_CHOICE) {
      item.answers.forEach(answer => {
        if (answer.rightAnswer === 1) {
          item.userAnswer = answer.id
        }
      })
    } else {
      item.userAnswer = item.answers[0].answer
    }
  })
  return info
}
