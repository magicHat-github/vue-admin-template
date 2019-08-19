<template>
  <div>
    <!-- 试卷详情 -->
    <el-drawer title="试卷详情" :size="size" :visible.sync="pageShowCache" :wrapper-closable="closable">
      <div class="paper-drawer">
        <el-card class="paper-card">
          <div class="paper-title">{{ paper.title }}</div>
          <div class="paper-question">
            <div v-for="(question, index) in paper.quest" :key="index" class="quest">
              <div v-if="question.type === '单选题'">
                <question-single-choice :question-index="index" :question-type="question.type" :question-detail="question.question" :user-answer="question.userAnswer" :question-id="question.id" :question-answer="question.answer" @userAnswerAction="userAnswerAction" />
              </div>
              <div v-if="question.type === '多选题'">
                <question-multiple-choice :question-index="index" :question-type="question.type" :question-detail="question.question" :user-answer="question.userAnswer" :question-id="question.id" :question-answer="question.answer" @userAnswerAction="userAnswerAction" />
              </div>
              <div v-else-if="question.type === '填空题'">
                <question-fill-blank :question-index="index" :question-type="question.type" :question-detail="question.question" :user-answer="question.userAnswer" :question-id="question.id" @userAnswerAction="userAnswerAction" />
              </div>
              <div v-else-if="question.type === '编程题'">
                <question-subjective :question-index="index" :question-type="question.type" :question-detail="question.question" :user-answer="question.userAnswer" :question-id="question.id" @userAnswerAction="userAnswerAction" />
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
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
    }
  },
  data() {
    return {
      pageShowCache: this.pageShow,
      paperInfoCache: this.paperInfo,
      paper: {
        title: 'Java 基础题',
        quest: [
          {
            id: '123',
            type: '单选题',
            question: '请问今年EDG是否能进总决赛?',
            answer: ['A.能', 'B.不可能', 'C.可能', 'D.绝无希望'],
            userAnswer: ''
          },
          {
            id: '123123',
            type: '单选题',
            question: '请问今年EDG是否能进总决赛?',
            answer: ['A.能', 'B.不可能', 'C.可能', 'D.绝无希望'],
            userAnswer: ''
          },
          {
            id: '12',
            type: '单选题',
            question: '请问今年EDG是否能进总决赛?',
            answer: ['A.能', 'B.不可能', 'C.可能', 'D.绝无希望'],
            userAnswer: ''
          },
          {
            id: '12',
            type: '多选题',
            question: '请问今年EDG是否能进总决赛?',
            answer: ['A.能', 'B.不可能', 'C.可能', 'D.绝无希望'],
            userAnswer: ''
          },
          {
            id: '123465789',
            type: '填空题',
            question: '请问今年总决赛的冠军是',
            userAnswer: ''
          },
          {
            type: '编程题',
            question: '写一个雪花算法',
            userAnswer: ''
          },
          {
            type: '编程题',
            question: '写一个雪花算法',
            userAnswer: ''
          }
        ]
      },
      userAnswer: [],
      answer: '',
      answer2: ''
    }
  },
  watch: {
    pageShow(val) {
      this.pageShowCache = val
    },
    pageShowCache(val) {
      this.$emit('show-change', val)
    }
  },
  methods: {
    userAnswerAction(val) {
      this.pushAnswer(val)
      console.log(this.userAnswer)
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
