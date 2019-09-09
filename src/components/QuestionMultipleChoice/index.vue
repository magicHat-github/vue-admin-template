<template>
  <div>
    <label><span>{{ questionIndex + 1 }}.</span><span style="margin-right: 5px;">({{ questionType }})</span><span>{{ questionDetail }}</span></label>
    <div class="answer">
      <el-checkbox-group v-model="userAnswerCache">
        <el-checkbox
          v-for="(answerItem, answerIndex) in questionAnswer"
          :key="answerIndex"
          :label="answerItem.id"
          :disabled="subjectDisable"
        >{{ optionList[answerIndex] }}.{{ answerItem.answer }}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
import { optionList } from '@/utils'
/**
 * 填空题组件
 */
export default {
  name: 'QuestionMultipleChoice',
  props: {
    /**
     * 题号
     */
    questionIndex: {
      type: Number,
      require: true,
      default: 0
    },
    /**
     * 题型
     */
    questionType: {
      type: String,
      require: true,
      default: ''
    },
    /**
     * 题目
     */
    questionDetail: {
      type: String,
      require: true,
      default: ''
    },
    /**
     * 题目编号
     */
    questionId: {
      type: String,
      require: true,
      default: ''
    },
    /**
     * 用户答案
     */
    userAnswer: {
      type: Array,
      require: true,
      default: null
    },
    /**
     * 可选答案
     */
    questionAnswer: {
      type: Array,
      require: true,
      default: null
    },
    /**
     * 是否显示正确答案
     */
    showAnswer: {
      type: Boolean,
      require: false,
      default: false
    },
    /**
     * 试题禁止操作
     */
    subjectDisable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      userAnswerCache: [],
      optionList: optionList
    }
  },
  watch: {
    userAnswer(val) {
      this.userAnswerCache = val
    },
    userAnswerCache(val) {
      this.$emit('userAnswerAction', {
        questionId: this.questionId,
        userAnswer: val
      })
    },
    showAnswer(val) {
      this.userAnswerCache = val ? this.userAnswer : null
    }
  }
}
</script>
<style>
.answer{
  margin-top: 5px;
  margin-left: 10px;
}
</style>
