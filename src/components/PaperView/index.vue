<template>
  <div>
    <!-- 试卷详情 -->
    <el-drawer :size="size" :visible.sync="pageShowCache" :wrapper-closable="closable">
      <template slot="title">
        <span>试卷详情</span>
        <el-switch
          v-if="showAnswerSwitch"
          v-model="showAnswer"
          style="display: block;margin-right: 10px;"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="显示答案"
          inactive-text="不显示答案"
        />
      </template>
      <div class="paper-drawer">
        <el-card class="paper-card">
          <div class="paper-title">{{ paperInfoCache.name }}</div>
          <div class="paper-question">
            <div v-for="(question, index) in paperInfoCache.subjects" :key="index" class="quest">
              <div v-if="question.type === questionType.QUESTION_SINGLE_CHOICE">
                <question-single-choice
                  :question-index="index"
                  :question-type="question.typeName"
                  :question-detail="question.subject"
                  :user-answer="question.userAnswer"
                  :question-id="question.id"
                  :question-answer="question.answers"
                  :show-answer="showAnswer"
                  :subject-disable="subjectDisable"
                  @userAnswerAction="userAnswerAction"
                />
              </div>
              <div v-if="question.type === questionType.QUESTION_MULTIPLE_CHOICE">
                <question-multiple-choice
                  :question-index="index"
                  :question-type="question.typeName"
                  :question-detail="question.subject"
                  :user-answer="question.userAnswer"
                  :question-id="question.id"
                  :question-answer="question.answers"
                  :show-answer="showAnswer"
                  :subject-disable="subjectDisable"
                  @userAnswerAction="userAnswerAction"
                />
              </div>
              <div v-if="question.type === questionType.QUESTION_FILL_BLANK">
                <question-fill-blank
                  :question-index="index"
                  :question-type="question.typeName"
                  :question-detail="question.subject"
                  :user-answer="question.userAnswer"
                  :question-id="question.id"
                  :show-answer="showAnswer"
                  :subject-disable="subjectDisable"
                  @userAnswerAction="userAnswerAction"
                />
              </div>
              <div v-if="question.type === questionType.QUESTION_SUBJECTIVE">
                <question-subjective
                  :question-index="index"
                  :question-type="question.typeName"
                  :question-detail="question.subject"
                  :user-answer="question.userAnswer"
                  :question-id="question.id"
                  :show-answer="showAnswer"
                  :subject-disable="subjectDisable"
                  @userAnswerAction="userAnswerAction"
                />
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { questionType } from '@/utils/subjectType'
import QuestionFillBlank from '@/components/QuestionFillBlank'
import QuestionSingleChoice from '@/components/QuestionSingleChoice'
import QuestionMultipleChoice from '@/components/QuestionMultipleChoice'
import QuestionSubjective from '@/components/QuestionSubjective'

export default {
  name: 'PaperView',
  components: { QuestionFillBlank, QuestionSingleChoice, QuestionMultipleChoice, QuestionSubjective },
  props: {
    pageShow: {
      type: Boolean,
      required: true,
      default: false
    },
    closable: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: '60%'
    },
    paperInfo: {
      type: Object,
      required: true
    },
    showAnswerSwitch: {
      type: Boolean,
      required: false,
      default: false
    },
    subjectDisable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      pageShowCache: this.pageShow,
      paperInfoCache: this.paperInfo,
      questionType: questionType,
      showAnswer: false,
      userAnswer: []
    }
  },
  watch: {
    pageShow(val) {
      this.pageShowCache = val
    },
    pageShowCache(val) {
      this.$emit('show-change', val)
    },
    paperInfo(val) {
      this.paperInfoCache = this.paperInfo
    }
  },
  methods: {
    userAnswerAction(val) {
      this.pushAnswer(val)
    },
    /**
     * 缓存答案
     * @param val
     */
    pushAnswer(val) {
      let status = true
      const { questionId, userAnswer } = val
      this.userAnswer.forEach(item => {
        if (questionId === item.questionId) {
          item.userAnswer = userAnswer
          status = false
        }
      })
      if (status) {
        this.userAnswer.push(val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.paper-drawer{
  width: 100%;
  height: 100%;
  padding: 0 30px;
  overflow: scroll;
  .paper-card {
    display: flex;
    flex-direction: column;
    .paper-title {
      text-align: center;
      font-size: 20px;
      margin-bottom: 15px;
    }
    .paper-question {
      margin-left: 20px;
      .title{
        margin-bottom: 10px;
      }
      .quest {
        margin-top: 20px;
        margin-left: 10px;
      }
    }
  }
}
</style>
