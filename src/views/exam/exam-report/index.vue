<template>
  <div id="examination-report" class="page-contain">
    <div class="query">
      <el-form :inline="true" :model="queryForm" size="small">
        <el-form-item label="场次号:">
          <el-input v-model="queryForm.examSession" />
        </el-form-item>
        <el-form-item label="考试号:">
          <el-input v-model="queryForm.examNum" />
        </el-form-item>
        <el-form-item label="试卷发布人:">
          <el-input v-model="queryForm.publisher" />
        </el-form-item>
        <el-form-item label="考试时间段:从">
          <el-date-picker
            v-model="queryForm.publishPeriodTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <div class="edit">
        <el-button type="text" class="el-icon-question" style="font-size:16px;margin-bottom:0px;" @click="detail"> 查看详情</el-button>
      </div>
      <el-table :data="tableData" stripe size="mini" border fit @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="examName" label="考试名" />
        <el-table-column prop="examSessionName" label="场次" />
        <el-table-column prop="examEndTime" label="考试截止时间" />
        <el-table-column prop="planPeopleNum" label="计划考试人数" />
        <el-table-column prop="actualPeopleNum" label="实际考试人数" />
        <el-table-column prop="" label="操作">
          <template slot-scope="{ row }">
            <el-button class="el-icon-question" type="text" style="color:green;font-size:16px;" @click="detail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页系统 -->
      <el-pagination
        v-show="total > 0"
        background
        :layout="layout"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { mockData } from './function'
import { layout, pageSize, pageSizes } from '../common'

export default {
  name: 'ExaminationReport',
  data() {
    return {
      /**
       * 查询的表单
       */
      queryForm: {
        // 场次号
        examSessionNum: '',
        // 考试号
        examNum: '',
        // 试卷发布人
        publisher: '',
        // 发布时间段
        publishPeriodTime: ''
      },
      /**
       * 表格数据
       */
      tableData: [],
      /**
       * 复选框的选择列表
       */
      selectList: '',
      /**
       * 分页相关
       */
      layout: layout,
      pageSize: pageSize,
      pageSizes: pageSizes,
      total: 100,
      currentPage: 1
    }
  },
  created() {
    this.tableData = mockData
  },
  mounted() {
    // const sum = add(10, 20)
    // console.log(`相加${sum}`)
    // console.debug('created')
  },
  methods: {
    /**
     * 查询函数
     */
    search() {
      console.log(this.queryForm)
    },
    /**
     * 页面大小改变处理函数
     */
    handleSizeChange(val) {
      console.log(val)
    },
    /**
     * 当前页面更改处理函数
     */
    handleCurrentChange(val) {
      console.log(val)
    },
    /**
     * 表格复选框组的监听事件
     */
    handleSelectionChange(val) {
      this.selectList = val
    },
    /**
     * 查看详情界面
     */
    detail(row) {
      const id = row.id
      if (!id) {
        // 菜单栏查询详情
        const selectNum = this.selectList.length
        if (selectNum > 1) {
          this.showMessage('warning', '你选择太多了')
        } else if (selectNum === 1) {
          const selectId = this.selectList[0].id
          // 跳转到详情界面
          this.$router.push({ name: 'ReportDetail', params: { recordId: selectId }})
        } else {
          this.showMessage('info', '你没有选择任何的一行')
        }
      } else {
        // 侧边栏查看详情
        this.$router.push({ name: 'ReportDetail', params: { recordId: id }})
      }
    },
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
.query {
  /* margin-left: 40px; */
  padding-left: 40px;
}
.table {
  /* margin: 20px; */
  margin-bottom: 20px;
  padding-left:15px;
}
.page-contain {
  margin: 20px;
}
</style>
