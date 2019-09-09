<template>
  <div>
    <!-- 试卷详情 -->
    <el-drawer :size="size" :visible.sync="pageShowCache" :wrapper-closable="closable">
      <template slot="title">
        <span>{{ pageTitle }}</span>
        <el-switch
          v-if="showDisableSwitch"
          v-model="subjectDisableCache"
          style="display: block;margin-right: 10px;"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="允许操作"
          inactive-text="禁止操作"
        />
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
        <el-card v-if="paperEdit" class="paper-form">
          <el-form ref="paperForm" :model="paperForm" size="mini" :rules="paperRules" label-width="80px" inline>
            <el-form-item label="试卷名" prop="name">
              <el-input v-model="paperForm.name" placeholder="请输入试卷名" style="width: 160px;" @blur="changePaperName" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-form-item label="卷子类型" prop="paperType">
              <el-select v-model="paperForm.paperType" placeholder="请选择类型.." style="width: 160px">
                <el-option v-for="item in paperTypeList" :key="item.id" :label="item.value" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="卷子难度" prop="difficult">
              <el-select v-model="paperForm.difficult" placeholder="请选择难度.." style="width: 160px">
                <el-option v-for="item in paperDifficultList" :key="item.id" :label="item.value" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="试卷总分" prop="score">
              <el-input v-model="paperForm.score" placeholder="请输入试卷总分" disabled style="width: 160px;" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-form-item label="试卷描述" prop="descript">
              <el-input v-model="paperForm.descript" placeholder="请输入试卷描述" style="width: 160px;" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" @click="submitPaperForm('paperForm')">提交</el-button>
          </el-form>
        </el-card>
        <el-card class="paper-card">
          <div class="paper-title">{{ paperInfoCache.name }}</div>
          <div class="paper-question">
            <el-row v-for="(question, index) in paperInfoCache.subjects" :key="index" class="quest">
              <el-col :span="paperEdit?18:24">
                <div v-if="question.type === questionType.QUESTION_SINGLE_CHOICE">
                  <question-single-choice
                    :question-index="index"
                    :question-type="question.typeName"
                    :question-detail="question.subject"
                    :user-answer="question.userAnswer"
                    :question-id="question.id"
                    :question-answer="question.answers"
                    :show-answer="showAnswer"
                    :subject-disable="subjectDisableCache"
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
                    :subject-disable="subjectDisableCache"
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
                    :subject-disable="subjectDisableCache"
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
                    :subject-disable="subjectDisableCache"
                    @userAnswerAction="userAnswerAction"
                  />
                </div>
              </el-col>
              <el-col v-if="paperEdit" :span="6">
                <el-button type="primary" icon="el-icon-plus" circle @click="addSubjectAction(question)" />
                <el-button type="success" icon="el-icon-edit" circle @click="editSubjectAction(question)" />
                <el-button type="danger" icon="el-icon-delete" circle @click="deleteSubject(question)" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </el-drawer>
    <!-- 题目表单 -->
    <subject-form
      :dialog-show="subjectFormDialog"
      :dialog-status="dialogStatus"
      :subject-title="subjectTitle"
      :default-subject-info="defaultSubjectInfo"
      :category-list="categoryList"
      @showChange="changeSubjectFormDialog"
      @submitForm="submitForm"
    />
  </div>
</template>
<script>
import { questionType, rightAnswerStatus } from '@/utils/subjectType'
import QuestionFillBlank from '@/components/QuestionFillBlank'
import QuestionSingleChoice from '@/components/QuestionSingleChoice'
import QuestionMultipleChoice from '@/components/QuestionMultipleChoice'
import QuestionSubjective from '@/components/QuestionSubjective'
import SubjectForm from '@/views/paper/maintenance/subjectForm'

export default {
  name: 'PaperView',
  components: { QuestionFillBlank, QuestionSingleChoice, QuestionMultipleChoice, QuestionSubjective, SubjectForm },
  props: {
    pageTitle: {
      type: String,
      required: false,
      default: '试卷预览'
    },
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
    showDisableSwitch: {
      type: Boolean,
      required: false,
      default: false
    },
    paperEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    subjectDisable: {
      type: Boolean,
      required: false,
      default: true
    },
    paperTypeList: {
      type: Array,
      required: false,
      default: null
    },
    categoryList: {
      type: Array,
      required: false,
      default: null
    },
    paperDifficultList: {
      type: Array,
      required: false,
      default: null
    }
  },
  data() {
    return {
      paperRules: {
        name: [
          { required: true, message: '试卷名称不能为空', trigger: 'blur' }
        ],
        paperType: [
          { required: true, message: '试卷类型不能为空', trigger: 'change' }
        ],
        difficult: [
          { required: true, message: '试卷难度不能为空', trigger: 'change' }
        ],
        score: [
          { required: true, message: '试卷分值不能为空', trigger: 'blur' }
        ]
      },
      pageShowCache: this.pageShow,
      paperInfoCache: this.paperInfo,
      subjectDisableCache: this.subjectDisable,
      questionType: questionType,
      showAnswer: false,
      userAnswer: [],
      deleteIds: [],
      updateSubjects: [],
      insertSubjects: [],
      paperForm: {
        name: '',
        paperType: '',
        difficult: '',
        score: 0,
        descript: ''
      },

      subjectFormDialog: false,
      subjectTitle: '',
      dialogStatus: true,
      defaultSubjectInfo: null
    }
  },
  watch: {
    pageShow(val) {
      this.pageShowCache = val
    },
    pageShowCache(val) {
      if (!val) {
        this.deleteIds = []
        this.updateSubjects = []
        this.insertSubjects = []
      }
      this.$emit('show-change', val)
    },
    subjectDisable(val) {
      this.subjectDisableCache = val
    },
    paperInfo(val) {
      this.paperInfoCache = val
      this.paperForm.name = val.name
      this.paperForm.paperType = val.paperType
      this.paperForm.difficult = val.difficult
      this.paperForm.descript = val.descript
      this.countScore()
    }
  },
  methods: {
    /**
     * 缓存答案
     * @param val
     */
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
    },
    /**
     * 表单提交的响应方法
     */
    submitForm(subjectInfo) {
      if (this.dialogStatus) {
        this.addSubject(subjectInfo)
      } else {
        this.editSubject(subjectInfo)
      }
    },
    /**
     * 添加题目
     * @param question
     */
    addSubjectAction(question) {
      this.subjectFormDialog = true
      this.dialogStatus = true
      this.subjectTitle = '自定义添加题目'
      this.defaultSubjectInfo = null
    },
    /**
     * 表单提交完之后的添加操作
     */
    addSubject(subjectInfo) {
      this.insertSubjects.push(subjectInfo)
      this.paperInfoCache.subjects.push(subjectInfo)
      this.countScore()
    },
    /**
     * 修改题目
     * @param question
     */
    editSubjectAction(question) {
      this.subjectFormDialog = true
      this.dialogStatus = false
      this.subjectTitle = '修改题目'
      this.defaultSubjectInfo = JSON.parse(JSON.stringify(question))
    },
    /**
     * 表单提交完之后的修改操作
     */
    editSubject(subjectInfo) {
      if (!(subjectInfo.new != null && subjectInfo.new)) {
        let exist = false
        this.updateSubjects.forEach((item, index) => {
          if (item.id === subjectInfo.id) {
            exist = true
            this.updateSubjects.splice(index, 1, subjectInfo)
          }
        })
        if (!exist) {
          this.updateSubjects.push(subjectInfo)
        }
      }
      this.paperInfoCache.subjects.forEach((item, index) => {
        if (item.id === subjectInfo.id) {
          this.paperInfoCache.subjects.splice(index, 1, subjectInfo)
        }
      })
      this.countScore()
    },
    /**
     * 删除题目
     * @param question
     */
    deleteSubject(question) {
      if (question.new != null && question.new) {
        this.insertSubjects.forEach((item, index, arry) => {
          if (item.id === question.id) {
            arry.splice(index, 1)
          }
        })
      } else {
        this.updateSubjects.forEach((item, index, arry) => {
          if (item.id === question.id) {
            arry.splice(index, 1)
          }
        })
        this.deleteIds.push(question)
      }
      this.paperInfoCache.subjects.forEach((item, index, arry) => {
        if (item.id === question.id) {
          arry.splice(index, 1)
        }
      })
      this.countScore()
    },
    /**
     * 响应enter事件
     */
    handleFilter() {
    },
    /**
     * 试卷名修改时的响应事件
     */
    changePaperName() {
      this.paperInfoCache.name = this.paperForm.name
    },
    /**
     * 提交表单的验证
     * @param formName
     */
    submitPaperForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.paperForm))
          params.deleteIds = []
          this.deleteIds.forEach(item => {
            params.deleteIds.push(item.id)
          })
          params.insertSubjects = this.rightAnswerConversion(this.insertSubjects)
          params.updateSubjects = this.rightAnswerConversion(this.updateSubjects)
          params.id = this.paperInfo.id
          this.$emit('submitPaper', params)
          this.pageShowCache = false
        }
      })
    },
    /**
     * 根据子组件的值改变弹窗状态
     * @param val
     */
    changeSubjectFormDialog(val) {
      this.subjectFormDialog = val
    },
    /**
     * 计算整张试卷的分值
     */
    countScore() {
      let score = 0
      this.paperInfoCache.subjects.forEach(item => {
        score += Number(item.score)
      })
      this.paperForm.score = score
    },
    /**
     * 正确答案的转换
     * @param list
     */
    rightAnswerConversion(list) {
      list.forEach(item => {
        item.answers.forEach(answer => {
          answer.rightAnswer = answer.rightAnswer ? rightAnswerStatus.right : rightAnswerStatus.wrong
        })
      })
      return list
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
  flex-direction: column;
  .paper-form {
    margin-bottom: 10px;
  }
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
