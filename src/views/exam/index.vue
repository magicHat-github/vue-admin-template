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
              <el-button @click="handleSelectPaper">选择试卷</el-button>
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
              <el-button class="el-icon-plus">增加评卷官</el-button>
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
    <!-- 菜单栏 -->
    <div id="editDiv">
      <span>
        <el-link :underline="false" class="el-icon-edit" @click="handleEditEvent">修改</el-link>
      </span>
      <span>
        <el-link :underline="false" class="el-icon-delete" @click="deleteRows">删除</el-link>
      </span>
      <span>
        <el-link :underline="false" class="el-icon-right" @click="newPublishRecord">发布</el-link>
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
            <el-button class="el-icon-edit" type="text" @click="handleEditEvent(row)" />
            <el-button class="el-icon-delete" type="text" @click="deleteRow(row)" />
            <el-button class="el-icon-right" type="text" @click="publishRecord(row)" />
            <el-button class="el-icon-picture" type="text" @click="showQrCode(row)" />
          </template>
        </el-table-column>
      </el-table>
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
      <h2>选择的时间</h2>
      {{ queryForm.examTimeRange }}
    </div>
  </div>
</template>
<script>
import { pageSizes, pageSize, mockData, markOptions } from './common'
import { rules } from './common'
import { getExamRecordById } from '@/api/exam'

export default {
  name: 'Exam',
  data() {
    return {
      // 查询数据的表单数据
      queryForm: {
        publisher: '', // 考试发布人
        title: '', // 考试标题
        publishTimeRange: '', // 发布的时间段
        examTimeRange: '' // 考试时间段
      },
      tableData: [],
      // 编辑和发布弹窗的数据
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
      // 表格单选和复选框
      tableForm: {
        select: ''
      },
      markOptions: markOptions,
      rules: rules,
      total: 100,
      layout: 'total,sizes,prev,pager,next,jumper',
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
    search() {
      // 传送到后端的数据
      const query = {
        publisherName: this.queryForm.publisher,
        publishStartTime: this.queryForm.publishTimeRange[0],
        publishEndTime: this.queryForm.publishTimeRange[1],
        examStartTime: this.queryForm.examTimeRange[0],
        examEndTime: this.queryForm.examTimeRange[1],
        title: this.queryForm.title
      }
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
          const seleteId = this.tableForm.select[0].id
          this.editRecord(seleteId)
        } else {
          this.$message({
            type: 'info',
            message: '你没有选择一个选项'
          })
        }
      } else {
        // 侧边栏编辑
        const rowId = row.id
        this.editRecord(rowId)
      }
    },
    /**
     * 选择试卷处理事件
     */
    handleSelectPaper() {

    },
    /**
     * 发布新纪录弹窗
     */
    newPublishRecord() {
      this.dialogForm.dialogTitle = '新增发布记录'
      this.dialogForm.dialogFormVisible = true
    },
    editRecord(id) {
      getExamRecordById(id).then(rsp => {
        console.log(`后台数据`)
        // console.log(rsp)
        const body = rsp.body
        console.log(body)
        // 将得到的数据 给弹窗赋值
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
     * 保存考试的记录
     */
    saveRecord() {
      // 判断是编辑界面还是发布界面
      if (this.dialogForm.title === '编辑') {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
      } else {
        this.$message({
          type: 'success',
          message: '添加发布成功'
        })
      }
      console.log(this.dialogForm)
      // 关闭窗口
      this.dialogForm.dialogFormVisible = false
    },
    /**
     * 发布记录操作处理函数
     */
    publishRecord(row) {
      // 1.获得id
      // 2.向后台请求发布记      // 3.显示相关消息
      console.log(row)
    },
    /**
     * 删除选中的数据
     */
    deleteRows() {
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
    showQrCode(row) {
      // 1 获得id
      const id = row.recordId
      // 2 请求该条记录的qrcodeurl
      // 3 显示qrcode
      console.log(id)
      this.$router.push({ name: 'phoneanswer' })
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
  /* margin: 20px; */
  margin: 15px;
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
