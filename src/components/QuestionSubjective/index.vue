<template>
  <div>
    <label for="answerCode"><span>{{ questionIndex + 1 }}.</span><span>({{ questionType }})</span><span>{{ questionDetail }}</span></label>
    <div>
      <textarea
        id="answerCode"
        v-model="userAnswerCache"
        :disabled="subjectDisable"
        class="code-quest-answer"
        rows="8"
        cols="50"
      />
    </div>
  </div>
</template>
<script>
/**
 * 填空题组件
 */
export default {
  name: 'QuestionSubjective',
  props: {
    questionIndex: {
      type: Number,
      require: true,
      default: 0
    },
    questionType: {
      type: String,
      require: true,
      default: ''
    },
    questionDetail: {
      type: String,
      require: true,
      default: ''
    },
    questionId: {
      type: String,
      require: true,
      default: ''
    },
    userAnswer: {
      type: String,
      require: true,
      default: ''
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
      userAnswerCache: ''
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
.code-quest-answer{
  margin-top: 5px;
  border-bottom: 1px solid black;
  padding: 10px;
  outline: none;
}
</style>
