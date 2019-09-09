<template>
  <div>
    <label><span>{{ questionIndex + 1 }}.</span><span style="margin-right: 5px;">({{ questionType }})</span><span>{{ questionDetail }}</span></label>
    <div class="answer">
      <el-radio-group v-model="userAnswerCache">
        <el-radio
          v-for="(answerItem, answerIndex) in questionAnswer"
          :key="answerIndex"
          :label="answerItem.id"
          :disabled="subjectDisable"
        >
          <span class="answerText"><span style="margin-right: 5px;">{{ optionList[answerIndex] }}.</span>{{ answerItem.answer }}</span>
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import { optionList } from '@/utils'
/**
 * 填空题组件
 */
export default {
  name: 'QuestionSingleChoice',
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
      userAnswerCache: '',
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
.answerText{
  word-break: break-all;
  white-space: normal;
  line-height: 1.5;
  letter-spacing: 1.5px;
}
</style>
