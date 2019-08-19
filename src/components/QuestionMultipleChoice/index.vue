<template>
  <div>
    <label><span>{{ questionIndex + 1 }}.</span><span style="margin-right: 5px;">({{ questionType }})</span><span>{{ questionDetail }}</span></label>
    <div class="answer">
      <el-checkbox-group v-model="userAnswerCache">
        <el-checkbox v-for="(answerItem, answerIndex) in questionAnswer" :key="answerIndex" :label="answerItem" />
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
/**
 * 填空题组件
 */
export default {
  name: 'QuestionFillBlank',
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
      type: String,
      require: true,
      default: ''
    },
    /**
     * 可选答案
     */
    questionAnswer: {
      type: Array,
      require: true,
      default: null
    }
  },
  data() {
    return {
      userAnswerCache: []
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
