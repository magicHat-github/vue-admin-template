<template>
  <div id="publish-dialog">
    <!-- 发布弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="visible">
      <div style="text-align:center">
        <!-- <h3>{{ dialogForm.dialogTitle }}</h3> -->
        <el-form :model="dialogForm" :rules="rules" size="small" label-position="left" label-width="120px">
          <el-form-item label="试卷名称" prop="paperName">
            <el-col :span="16">
              <el-input v-model="dialogForm.paperName" disabled />
            </el-col>
            <el-col :span="4">
              <el-button @click="openChoicePaperDialog">选择试卷</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="考试场次">
            <el-col :span="16">
              <el-input v-model="dialogForm.examSession" disabled placeholder="系统自动生成" />
            </el-col>
          </el-form-item>
          <el-form-item label="考试标题:" prop="title">
            <el-col :span="16">
              <el-input v-model="dialogForm.title" />
            </el-col>
          </el-form-item>
          <el-form-item label="考试开始时间:" prop="examStartTime">
            <el-col :span="16">
              <el-date-picker
                v-model="dialogForm.examStartTime"
                type="datetime"
                placeholder="选择考试开始时间"
                style="width:100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="考试截止时间:" prop="examEndTime">
            <el-col :span="16">
              <el-date-picker
                v-model="dialogForm.examEndTime"
                type="datetime"
                placeholder="选择考试截止时间"
                style="width:100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="计划参加人数" prop="planPeopleNum">
            <el-col :span="16">
              <el-input v-model.number="dialogForm.planPeopleNum" />
            </el-col>
          </el-form-item>
          <el-form-item label="考试时长" prop="examLimitTime">
            <el-col :span="16">
              <el-input v-model.number="dialogForm.examLimitTime" />
            </el-col>
          </el-form-item>
          <el-form-item label="评卷官" prop="judges">
            <el-col :span="16" class="judges">
              <el-tag
                v-for="tag in dialogForm.judges"
                :key="tag.id"
                closable
                size="small"
                style="margin-left:5px;"
                @close="handleCloseTag(tag)"
              >
                {{ tag.judgeName }}
              </el-tag>
            </el-col>
            <el-col :span="4">
              <el-button class="el-icon-plus" @click="openJudgesDialog">增加评卷官</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="评卷方式:">
            <el-col :span="16">
              <el-select v-model="dialogForm.markingMode" style="width:100%;">
                <el-option
                  v-for="markWay in markOptions"
                  :key="markWay.value"
                  :label="markWay.label"
                  :value="markWay.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="阅卷截止时间:" prop="markingEndTime">
            <el-col :span="16">
              <el-date-picker
                v-model="dialogForm.markingEndTime"
                type="datetime"
                placeholder="选择阅卷截止时间"
                style="width:100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="备注">
            <el-col :span="16">
              <el-input v-model="dialogForm.description" type="textarea" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="8">
              <el-button size="large" type="danger" @click="handleCancelEvent">取消</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size="large" @click="handleSaveEvent">保存</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 选择试卷的弹窗 -->
    <el-dialog title="选择试卷" :visible.sync="choicePaperDialog.dialogFormVisible">
      <div class="choice-paper">
        <el-table :data="choicePaperDialog.paperList">
          <el-table-column type="index" />
          <el-table-column prop="paperName" label="试卷名" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="text" @click="choicePaper(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 选择阅卷官的弹窗 -->
    <el-dialog title="选择阅卷官" :visible.sync="choiceJudgesDialog.dialogFormVisible">
      <div class="choice-judges">
        <h3>选择阅卷官</h3>
        <el-table :data="choiceJudgesDialog.judgeList">
          <el-table-column type="index" />
          <el-table-column prop="judgeName" label="阅卷官" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="text" class="el-icon-plus" @click="addJudge(row)">增加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { filters, rules, DialogType, markOptions } from '../../common'
import service from '../../service'

export default {
  name: 'PublishDialog',
  filters: filters,
  // 弹窗的属性值
  props: {
    // 弹窗可见
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 弹窗的类型
    dialogType: {
      type: Number,
      default: 0
    },
    // 记录的id
    recordId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      /**
       * 阅卷方式
       */
      markOptions,
      /**
       * 表单校验规则
       */
      rules: rules,
      /**
       * 弹窗可见
       */
      visible: false,
      /**
       * 弹窗的标题
       */
      dialogTitle: '',
      /**
       * 表单数据
       */
      dialogForm: {
        // 记录id
        id: '',
        // 试卷名
        paperName: '',
        // 试卷id
        paperId: '',
        // 考试场次
        examSession: '',
        // 考试标题
        title: '',
        // 考试开始时间
        examStartTime: '',
        // 考试截止日期
        examEndTime: '',
        // 计划参加人数
        planPeopleNum: '',
        // 考试时长
        examLimitTime: '',
        // 评卷官
        judges: [],
        // 评卷方式
        markingMode: 1,
        // 评卷截止时间
        markingEndTime: '',
        // 备注 描述
        description: '',
        // 版本号
        version: ''
      },
      /**
       * 选择试卷的弹窗
       */
      choicePaperDialog: {
        dialogFormVisible: false,
        paperList: []
      },
      /**
       * 选择阅卷官弹窗
       */
      choiceJudgesDialog: {
        dialogFormVisible: false,
        judgeList: []
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.dispatch()
      }
      this.visible = val
    },
    visible(val) {
      if (val === false) {
        this.closeDialog()
      }
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 内容分发器
     */
    dispatch() {
      // 对编辑、新发布、重新发布进行相应的处理
      if (this.dialogType === DialogType.NEWPUBLISH) {
        this.initNewPublishDialog()
      } else if (this.dialogType === DialogType.REPUBLISH) {
        this.initRePublishDialog()
      } else if (this.dialogType === DialogType.EDITRECORD) {
        this.initEditPublishDialog()
      } else {
        this.showMessage('error', '未知操作')
        this.closeDialog()
        return
      }
      // 显示弹窗
      this.visible = true
    },
    /**
     * 保存按钮处理对象
     * 激活dialog-save事件
     * 返回表单数据
     */
    handleSaveEvent() {
      if (this.formValid()) {
        // 数据校验之后
        this.closeDialog()
        this.$emit('dialog-save', this.dialogForm)
      } else {
        this.showMessage('warning', '请正确填写数据')
      }
    },
    /**
     * 取消事件处理
     */
    handleCancelEvent() {
      this.closeDialog()
      this.$emit('close-dialog', false)
    },
    /**
     * 消息提示框
     */
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit('close-dialog', false)
    },
    /**
     * 打开选择试卷弹窗
     */
    async openChoicePaperDialog() {
      // 后端捞试卷数据
      await service.getPapers().then(rsp => {
        // 加载试卷数据
        this.choicePaperDialog.paperList = rsp.body
        this.choicePaperDialog.dialogFormVisible = true
      }).catch(err => this.showMessage('error', err))
    },
    /**
     * 选择试卷
     */
    choicePaper(row) {
      this.dialogForm.paperName = row.paperName
      this.dialogForm.paperId = row.id
      this.closeChoicePaperDialog()
    },
    /**
     * 关闭选择试卷弹窗
     */
    closeChoicePaperDialog() {
      this.choicePaperDialog.dialogFormVisible = false
    },
    /**
     * 打开增加阅卷官的弹窗
     */
    async openJudgesDialog() {
      await service.getJudgeList().then(rsp => {
        // 加载阅卷官数据
        this.choiceJudgesDialog.judgeList = rsp.body
        this.choiceJudgesDialog.dialogFormVisible = true
      }).catch(err => { this.showMessage('error', `网络错误${err}`) })
    },
    /**
     * 关闭阅卷官的弹窗
     */
    closeJudgesDialog() {
      this.choiceJudgesDialog.dialogFormVisible = false
    },
    /**
     * 添加阅卷官
     */
    addJudge(row) {
      console.log(row)
      const newJudge = {
        judgeName: row.judgeName,
        id: row.id
      }
      let status = true
      this.dialogForm.judges.forEach(el => {
        if (el.id === newJudge.id) {
          status = false
        }
      })
      if (status) {
        this.dialogForm.judges.push(newJudge)
        this.closeJudgesDialog()
      } else {
        this.$message({
          type: 'warn',
          message: '已经选过了'
        })
      }
    },
    /**
     * 关闭阅卷官标签的处理事件
     */
    handleCloseTag(tag) {
      this.dialogForm.judges.splice(this.dialogForm.judges.indexOf(tag), 1)
    },
    /**
     * 初始化新发布记录弹窗
     */
    initNewPublishDialog() {
      this.dialogTitle = '新发布记录'
      this.visible = true
    },
    /**
     * 初始化编辑记录弹窗
     */
    initEditPublishDialog() {
      if (!this.recordId) {
        this.showMessage('error', '找不到数据')
        this.closeDialog()
        return
      }
      this.dialogTitle = '编辑发布记录'
      service.getExamRecordById(this.recordId)
        .then(rsp => {
          this.dialogForm = rsp.body
        })
        .catch(err => {
          this.showMessage('error', err.body)
        })
    },
    /**
     * 初始化重新发布记录弹窗
     */
    initRePublishDialog() {
      if (!this.recordId) {
        this.showMessage('error', '未知错误')
        this.closeDialog()
        return
      }
      service.getExamRecordById(this.recordId)
        .then(rsp => {
          this.dialogForm = rsp.body
          this.dialogTitle = '重新发布考试记录'
        })
        .catch(err => {
          this.showMessage('error', err.body)
          this.closeDialog()
        })
    },
    formValid() {
      if (this.valueNoEmpty(this.dialogForm.paperName) && this.valueNoEmpty(this.dialogForm.paperId) &&
        this.valueNoEmpty(this.dialogForm.title) && this.valueNoEmpty(this.dialogForm.examStartTime) &&
        this.valueNoEmpty(this.dialogForm.examEndTime) && this.valueNoEmpty(this.dialogForm.planPeopleNum) &&
        this.valueNoEmpty(this.dialogForm.examLimitTime) && (this.dialogForm.judges.length > 0) &&
        this.valueNoEmpty(this.dialogForm.markingEndTime)) {
        return true
      } else {
        return false
      }
    },
    /**
     * 判断值是不是为空
     * @param val
     * @returns {boolean}
     */
    valueNoEmpty(val) {
      if (val !== null && val !== undefined && val !== '') {
        return true
      }
      return false
    }
  }
}
</script>
<style scoped>
.judges {
  padding:0%;
  /* margin: 0%; */
  text-align:left;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  min-height: 32px;
}
</style>
