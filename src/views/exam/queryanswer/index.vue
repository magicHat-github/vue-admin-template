<template>
  <div id="queryanswer">
    <el-form :inline="true" :model="queryForm" size="mini" class="querydiv">
      <el-form-item label="考试名:">
        <el-input v-model="queryForm.title" />
      </el-form-item>
      <el-form-item label="场次编号:">
        <el-input v-model="queryForm.examSession" />
      </el-form-item>
      <el-form-item label="考试时间段:从">
        <el-date-picker
          v-model="queryForm.examPeriodTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </el-form-item>
      <el-form-item label="试卷发布人:">
        <el-input v-model="queryForm.publisher" />
      </el-form-item>
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        stripe
        size="mini"
        border
        fit
      >
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="title" label="考试名" />
        <el-table-column prop="examSession" label="场次" />
        <el-table-column prop="endTime" label="考试截止时间" />
        <el-table-column prop="tel" label="答卷人手机号" />
        <el-table-column prop="examiner" label="姓名" />
        <el-table-column prop="actualStartTime" label="开始考试时间" />
        <el-table-column prop="actualEndTime" label="交卷时间" />
        <el-table-column prop="objectiveSubjectScore" label="客观题得分" />
        <el-table-column prop="subjectiveSubjectScore" label="主观题得分" />
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-show="total > 0"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { layout, pageSizes, pageSize } from '../common'
import answerApi from '../../../api/exam/answers'

export default {
  name: 'QueryAnswer',
  data() {
    return {
      queryForm: {
        // 考试的标题
        title: '',
        // 考试的场次
        examSession: '',
        // 考试时间段
        examPeriodTime: '',
        // 考试场次名称
        examSessionName: '',
        // 发布人
        publisher: ''
      },
      layout: layout,
      pageSizes: pageSizes,
      pageSize: pageSize,
      currentPage: 1,
      total: 100,
      tableLoading: true,
      tableData: []
    }
  },
  mounted() {
    this.freshIndex()
  },
  methods: {
    /**
     * 获得初始数据函数
     */
    async freshIndex() {
      // 初始化的数据
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      await answerApi.queryAnswerList(query)
        .then(rsp => this.loadListData(rsp.body))
        .catch(err => this.showMessage('error', err))
    },
    /**
     * 查询函数
     */
    async search() {
      // 传到后端的查询数据
      this.tableLoading = true
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        // 考试标题
        title: this.queryForm.title,
        // 场次编号
        examSession: this.queryForm.examSession,
        // 考试开始时间
        examStartTime: this.queryForm.examPeriodTime[0],
        // 考试结束时间
        examEndTime: this.queryForm.examPeriodTime[1],
        // 发布人的名称
        publisher: this.queryForm.publisher
      }
      await answerApi.queryAnswerList(query)
        .then(rsp => this.loadListData(rsp.body))
        .catch(err => this.showMessage('error', err))
    },
    /**
    * 加载数据
    */
    loadListData(listData) {
      console.log('返回的数据')
      console.log(listData)
      this.page = listData.pageSize
      this.currentPage = listData.pageNum
      this.total = listData.total
      this.tableData = listData.list
      this.tableLoading = false
    },
    /**
     * 页数大小改变
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.search()
    },
    /**
     * 当前页面改变
     * */
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    /**
     * 显示信息
     * @param type
     * @param message
     */
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    }
  }
}
</script>
<style>
#queryanswer {
  margin: 20px;
}
#editDiv {
  margin-left: 15px;
  margin-bottom: 20px;
}
#editDiv span {
  margin-left: 10px;
  font-size: 16px;
}
.pagination {
  margin-top: 20px;
}
</style>

