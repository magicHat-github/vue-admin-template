<template>
  <div id="queryanswer">
    <h2>答卷查询</h2>
    <el-form :inline="true" :model="queryForm" size="mini" class="querydiv">
      <el-form-item label="考试名:">
        <el-input v-model="queryForm.title" />
      </el-form-item>
      <el-form-item label="场次编号:">
        <el-input v-model="queryForm.examSessionNum" />
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
      <el-form-item label="场次:">
        <el-input v-model="queryForm.examSessionName" />
      </el-form-item>
      <el-form-item label="试卷发布人:">
        <el-input v-model="queryForm.publisher" />
      </el-form-item>
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table :data="tableData" stripe size="mini" border fit>
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="title" label="考试名" />
        <el-table-column prop="examSessionName" label="场次" />
        <el-table-column prop="endTime" label="考试截止时间" />
        <el-table-column prop="tel" label="答卷人手机号" />
        <el-table-column prop="examerName" label="姓名" />
        <el-table-column prop="actualStartTime" label="开始考试时间" />
        <el-table-column prop="actualEndTime" label="交卷时间" />
        <el-table-column prop="makingStopTime" label="阅卷终止时间" />
        <el-table-column prop="objectiveScore" label="客观题得分" />
        <el-table-column prop="subjectiveScore" label="主观题得分" />
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-show="total > 0"
        :current-page="1"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
        class="pagination"
      />
    </div>
  </div>
</template>
<script>
import { layout, pageSizes, answerData, pageSize } from '../common'

export default {
  name: 'Queryanswer',
  data() {
    return {
      queryForm: {
        // 考试的标题
        title: '考试标题',
        // 考试的场次
        examSessionNum: 2,
        // 考试时间段
        examPeriodTime: '',
        // 考试场次名称
        examSessionName: '第二场',
        // 发布人
        publisher: '发布人'
      },
      layout: layout,
      pageSizes: pageSizes,
      pageSize: pageSize,
      total: 100,
      tableData: []
    }
  },
  mounted() {
    this.tableData = answerData
  },
  methods: {
    /**
     * 查询函数
     */
    search() {
      console.log(this.queryForm)
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

