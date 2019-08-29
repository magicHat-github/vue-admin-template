<template>
  <div id="exam">
    <el-form :inline="true" :model="queryForm" size="mini" class="querydiv">
      <el-form-item label="试卷发布人:">
        <el-input v-model="queryForm.publisher" placeholder="输入试卷发布人" />
      </el-form-item>
      <el-form-item label="发布时间段:从">
        <el-date-picker
          v-model="queryForm.publishTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </el-form-item>
      <el-form-item label="考试时间段:从">
        <el-date-picker
          v-model="queryForm.examTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </el-form-item>
      <el-form-item label="考试标题:">
        <el-input v-model="queryForm.title" />
      </el-form-item>
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 发布弹窗 -->
    <el-dialog :title="dialogForm.dialogTitle" :visible.sync="dialogForm.dialogFormVisible">
      <div style="text-align:center">
        <!-- <h3>{{ dialogForm.dialogTitle }}</h3> -->
        <el-form :model="dialogForm" :rules="rules" size="small" label-position="left" label-width="120px">
          <el-form-item label="试卷名称" prop="paperName">
            <el-col :span="16">
              <el-input v-model="dialogForm.paperName" />
            </el-col>
            <el-col :span="4">
              <el-button @click="openChoicePaperDialog">选择试卷</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="考试场次">
            <el-col :span="16">
              <el-input v-model="dialogForm.examTimes" disabled />
            </el-col>
          </el-form-item>
          <el-form-item label="考试标题:" prop="title">
            <el-col :span="16">
              <el-input v-model="dialogForm.title" />
            </el-col>
          </el-form-item>
          <el-form-item label="考试截止日期:" prop="examEndDay">
            <el-col :span="16">
              <el-date-picker
                v-model="dialogForm.examEndDay"
                type="date"
                placeholder="选择考试截止日期"
                style="width:100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="考试截止时间" prop="examEndTime">
            <el-col :span="16">
              <el-time-picker
                v-model="dialogForm.examEndTime"
                :picker-options="{
                  selectableRange:'00:00:00 - 23:59:59'
                }"
                placeholder="选择考试截止时间"
                style="width:100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="计划参加人数" prop="planPeopleNum">
            <el-col :span="16">
              <el-input v-model="dialogForm.planPeopleNum" />
            </el-col>
          </el-form-item>
          <el-form-item label="考试时长" prop="examLimitTime">
            <el-col :span="16">
              <el-input v-model="dialogForm.examLimitTime" />
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
                {{ tag.name }}
              </el-tag>
            </el-col>
            <el-col :span="4">
              <el-button class="el-icon-plus" @click="openJudgesDialog">增加评卷官</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="评卷方式:">
            <el-col :span="16">
              <el-select v-model="dialogForm.markingWay" style="width:100%;">
                <el-option
                  v-for="markway in markOptions"
                  :key="markway.value"
                  :label="markway.label"
                  :value="markway.value"
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
              <el-button size="large" type="danger" @click="()=>{dialogForm.dialogFormVisible=false;}">取消</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size="large" @click="saveRecord">保存</el-button>
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
          <el-table-column prop="name" label="试卷名" />
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
          <el-table-column prop="name" label="阅卷官" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="text" class="el-icon-plus" @click="addJudge(row)">增加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 菜单栏 -->
    <div id="editDiv">
      <span>
        <el-link :underline="false" class="el-icon-edit" @click="handleEditEvent">修改</el-link>
      </span>
      <span>
        <el-link :underline="false" class="el-icon-delete" @click="handleDeleteEvent">删除</el-link>
      </span>
      <span>
        <el-link :underline="false" class="el-icon-right" @click="handlePublishEvent">发布</el-link>
      </span>
    </div>
    <!-- 发布记录的表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        stripe
        size="mini"
        border
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="publisher" label="试卷发布人" />
        <el-table-column prop="publishTimeRange" label="发布时间段" />
        <el-table-column prop="examEndTime" label="考试结束日期和时间" />
        <el-table-column prop="planPeopleCount" label="计划人数" />
        <el-table-column prop="examLimitTime" label="考试时长" />
        <el-table-column prop="judges" label="评卷管" />
        <el-table-column prop="description" label="考试说明" />
        <el-table-column prop="status" label="状态列" />
        <el-table-column prop="publishTimes" label="发布次数" />
        <el-table-column label="操作列">
          <template slot-scope="{ row }">
            <el-button :disabled="row|operateFilter" class="el-icon-edit" type="text" @click="handleEditEvent(row)" />
            <el-button :disabled="row|operateFilter" class="el-icon-delete" type="text" @click="handleDeleteEvent(row)" />
            <el-button class="el-icon-right" type="text" @click="handlePublishEvent(row)" />
            <el-button :disabled="row|operateFilter|toggle" class="el-icon-picture" type="text" @click="handleShowQrCode(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页框 -->
    <el-pagination
      background
      :layout="layout"
      :total="total"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
// import qs from 'qs'
import { layout, pageSizes, pageSize, mockData, markOptions } from './common'
import { rules, DialogType } from './common'
import { getExamRecordById, publishRecordById, getRecordList } from '@/api/exam'

export default {
  name: 'Exam',
  filters: {
    operateFilter: val => {
      const published = '已发布'
      if (val.status === published) {
        return true
      } else {
        return false
      }
    },
    toggle: val => {
      return !val
    }
  },
  data() {
    return {
      // 查询数据的表单数据
      queryForm: {
        publisher: '', // 考试发布人
        title: '', // 考试标题
        publishTimeRange: '', // 发布的时间段
        examTimeRange: '' // 考试时间段
      },
      /**
       * 表格数据
       */
      tableData: [],
      /**
       * 编辑和发布弹窗的数据
       */
      dialogForm: {
        // 弹窗的显示标题 编辑or发布
        dialogTitle: '编辑',
        dialogFormVisible: false,
        paperName: '试卷名',
        paperId: '试卷id',
        // 考试场次
        examTimes: 2,
        title: '考试标题',
        // 考试截止日期
        examEndDay: '',
        // 考试截止日期
        examEndTime: '',
        // 计划参加人数
        planPeopleNum: '',
        // 考试时长
        examLimitTime: '',
        // 评卷官
        judges: [
          {
            id: 123,
            name: '清木'
          }
        ],
        // 评卷方式
        markingWay: 1,
        // 备注
        description: ''
      },
      /**
       * 表格单选和多选
       */
      tableForm: {
        select: ''
      },
      /**
       * 选择试卷的弹窗
       */
      choicePaperDialog: {
        dialogFormVisible: false,
        paperList: [
          {
            name: 'java基础',
            id: 1234
          },
          {
            name: 'java进阶',
            id: 2433
          }
        ]
      },
      /**
       * 选择阅卷官弹窗相关
       */
      choiceJudgesDialog: {
        dialogFormVisible: false,
        judgeList: [
          {
            name: '王工',
            id: 12345
          },
          {
            name: '李工',
            id: 2345
          }
        ]
      },
      markOptions: markOptions,
      rules: rules,
      total: 100,
      layout: layout,
      pageSizes: pageSizes,
      pageSize: pageSize,
      currentPage: 1
    }
  },
  created() {
    this.tableData = mockData
  },
  methods: {
    /**
     * 查询数据
     */
    async search() {
      // 传送到后端的数据
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        publisher: this.queryForm.publisher,
        publishStartTime: this.queryForm.publishTimeRange[0],
        publishEndTime: this.queryForm.publishTimeRange[1],
        examStartTime: this.queryForm.examTimeRange[0],
        examEndTime: this.queryForm.examTimeRange[1],
        title: this.queryForm.title
      }
      await getRecordList(query)
        .then(rsp => {
          console.log(`查询返回值`)
          console.log(rsp)
        }).catch(err => {
          this.$message({
            type: 'error',
            message: `请求错误${err}`
          })
        })
      console.log(query)
    },
    /**
     * 编辑记录函数
     * 可能是从菜单栏来的,
     * 也可能是从一行中的操作栏来的
     */
    handleEditEvent(row) {
      const id = row.recordId
      if (!id) {
        // 菜单栏编辑
        const selectNum = this.tableForm.select.length
        if (selectNum > 1) {
          this.$message({
            type: 'info',
            message: '选择太多选项了'
          })
        } else if (selectNum === 1) {
          // 根据id编辑
          const seleteId = this.tableForm.select[0].recordId
          const selectRow = this.tableForm.select[0]
          const published = '已发布'
          if (selectRow.status === published) {
            this.$message({
              type: 'error',
              message: '已经发布不可编辑'
            })
          } else {
            this.editRecord(seleteId)
          }
        } else {
          this.$message({
            type: 'info',
            message: '请选择数据'
          })
        }
      } else {
        // 侧边栏编辑
        const rowId = row.id
        const published = '已发布'
        if (row.status === published) {
          this.$message({
            type: 'error',
            message: '已经发布不可编辑'
          })
        } else {
          this.editRecord(rowId)
        }
      }
    },
    /**
     * 选择试卷处理事件
     */
    handleSelectPaper() {

    },
    /**
     * 发布记录的事件处理
     * 可能是发布新的记录
     * 可能是重新发布新的记录
     * 如果是重新发布就要获得已发布的数据
     */
    handlePublishEvent(row) {
      const id = row.recordId
      if (!id) {
        // 菜单栏的发布操作
        const selectNum = this.tableForm.select.length
        if (selectNum > 1) {
          this.$message({
            type: 'info',
            message: '选项太多'
          })
        } else if (selectNum === 1) {
          // 获得选择行的id
          // 获得选择的数据
          const published = '已发布'
          const selectRow = this.tableForm.select[0]
          if (selectRow.status === published) {
            this.$confirm(
              '该场考试已经发布过,是否重新发布',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }
            ).then(() => {
              // 重新发布函数
              this.rePublishRecord(selectRow.recordId)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消重新发布'
              })
            })
          } else {
            // 调用发布函数 未发布 => 已发布
            this.publishRecord(selectRow.recordId)
          }
        } else {
          // 发布新的记录
          this.newPublishRecord()
        }
      } else {
        // 侧边栏的操作
        const published = '已发布'
        if (row.status === published) {
          this.$confirm(
            '该场考试已经发布过,是否重新发布',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }
          ).then(() => {
            // 重新发布函数
            this.rePublishRecord(row.recordId)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消重新发布'
            })
          })
        } else {
          // 调用发布函数 未发布 => 已发布
          this.publishRecord(row.recordId)
        }
      }
    },
    /**
     * 新发布记录
     * 从0开始新增一条记录
     */
    newPublishRecord() {
      this.dialogForm.dialogTitle = '新增发布记录'
      this.dialogForm.dialogType = DialogType.NEWPUBLISH
      this.dialogForm.dialogFormVisible = true
    },
    /**
     * 重新发布记录
     */
    rePublishRecord(id) {
      // TODO 获得该id对应的数据
      // 打开发布弹窗
      this.dialogForm.dialogTitle = '重新发布考试记录'
      this.dialogForm.dialogType = DialogType.REPUBLISH
      this.dialogForm.dialogFormVisible = true
    },
    /**
     * 根据id从
     * 后台数据拿数据
     */
    editRecord(id) {
      getExamRecordById(id).then(rsp => {
        console.log(`后台数据`)
        // console.log(rsp)
        const body = rsp.body
        console.log(body)
        // TODO 将得到的数据 给弹窗赋值
        // 显示弹窗
        this.dialogForm.dialogFormVisible = true
      }).catch(err => {
        this.$message({
          type: 'error',
          message: `请求错误${err}`
        })
      })
    },
    /**
     * 可能是保存编辑的数据
     * 可能是保存发布的数据
     */
    saveRecord() {
      // 判断是编辑界面还是发布界面
      if (this.dialogForm.title === '编辑') {
        // 调用更新函数
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
      } else {
        // 调用发布函数
        this.$message({
          type: 'success',
          message: '添加发布成功'
        })
      }
      // console.log(this.dialogForm)
      // 关闭窗口
      this.dialogForm.dialogFormVisible = false
    },
    /**
     * 发布记录函数
     * 这个函数是向后台发送要发布记录的id
     * 效果是该条记录的状态从 未发布 => 已发布
     */
    async publishRecord(id) {
      await publishRecordById(id)
        .then(rsp => {
          this.$message({
            type: 'success',
            message: '该场考试已经发布了,注意考试时间'
          })
        }).catch(err => {
          this.$message({
            type: 'error',
            message: `发布错误${err}`
          })
        })
      // TODO 刷新页面数据
    },
    /**
     * 处理删除事件
     * 菜单栏 多选删除
     * 菜单栏 单选删除
     * 侧边栏操作 删除
     * 删除的优先级
     * 侧边栏删除 > 菜单栏删除
     * @param {侧边栏删除传入的行数据} row
     */
    handleDeleteEvent(row) {
      // 先判断单选和多选数据
      const selectCount = this.tableForm.select.length
      if (selectCount > 0) {
        // 删除确认框
        this.$confirm(`是否删除${selectCount}条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const deleteData = this.tableForm.select
          this.deleteRecord(deleteData)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        // 没有选中任何数据
        this.$message({
          type: 'info',
          message: '没有选中任何行'
        })
      }
    },
    /**
     * 删除一条记录
     */
    deleteRow(row) {
      const id = row.recordId
      // alert(`id=${id}`)
      console.log(id)
      // 删除确认框
      this.$confirm('是否删除该条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除的操作
        const deleteData = [row]
        this.deleteRecord(deleteData)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 删除记录
     * @param rows 传进来数据列表
     */
    deleteRecord(rows) {
      // 获得传进来的id列表
      const deleteForm = rows.map(row => {
        // 返回选中的id列表
        return row.recordId
      })
      // 调用api进行删除
      console.log(deleteForm)
    },
    /**
     * 选中和不选中
     */
    handleSelectionChange(val) {
      console.log(val)
      this.tableForm.select = val
    },
    /**
     * 显示二维码
     */
    handleShowQrCode(row) {
      // 1 获得row 对应的url
      const qrCodeUrl = 'https://long95288.github.io/'
      // 2 请求该条记录的qrcodeurl
      this.$router.push({ name: 'phoneanswer', params: { qrCodeUrl: qrCodeUrl }})
    },
    /**
     * 处理分页页面大小改变事件
     */
    handleSizeChange(val) {
      console.log(`sizechange`)
      this.pageSize = val
      // 获得数据
    },
    /**
     * 处理分页页面跳转
     */
    handleCurrentChange(val) {
      this.currentPage = val
    },
    /**
     * 打开选择试卷弹窗
     */
    openChoicePaperDialog() {
      this.choicePaperDialog.dialogFormVisible = true
    },
    /**
     * 关闭选择试卷弹窗
     */
    closeChoicePaperDialog() {
      this.choicePaperDialog.dialogFormVisible = false
    },
    /**
     * 选择试卷
     */
    choicePaper(row) {
      this.dialogForm.paperName = row.name
      this.dialogForm.paperId = row.id
      this.closeChoicePaperDialog()
    },
    /**
     * 打开增加阅卷官的弹窗
     */
    openJudgesDialog() {
      this.choiceJudgesDialog.dialogFormVisible = true
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
        name: row.name,
        id: row.id
      }
      this.dialogForm.judges.push(newJudge)
      this.closeJudgesDialog()
    },
    /**
     * 关闭试卷官标签的处理事件
     */
    handleCloseTag(tag) {
      this.dialogForm.judges.splice(this.dialogForm.judges.indexOf(tag), 1)
    }
  }
}
</script>
<style>
#exam {
  padding: 15px;
}
#editDiv {
  margin-left: 15px;
}
#editDiv span {
  margin-left: 10px;
  font-size: 16px;
}
.querydiv {
  margin-left: 15px;
}
.table {
  margin: 15px;
  /* margin-bottom: 15px; */
}
.judges {
  padding:0%;
  /* margin: 0%; */
  text-align:left;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  min-height: 32px;
}
</style>
