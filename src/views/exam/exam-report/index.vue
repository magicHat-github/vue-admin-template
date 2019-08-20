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
          <el-button>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <div class="edit">
        <el-button type="text" class="el-icon-question" style="font-size:16px;margin-bottom:0px;"> 查看详情</el-button>
      </div>
      <el-table :data="tableData" stripe size="mini" border fit>
        <el-table-column type="selection" />
        <el-table-column prop="examName" label="考试名" />
        <el-table-column prop="examSession" label="场次" />
        <el-table-column prop="examEndTime" label="考试截止时间" />
        <el-table-column prop="planPeopleNum" label="计划考试人数" />
        <el-table-column prop="actualPeopleNum" label="实际考试人数" />
        <el-table-column prop="" label="操作">
          <template slot-scope="{ row }">
            <el-button class="el-icon-question" type="text" style="color:green;font-size:16px;" @click="edit(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { add, mockData } from './function'

export default {
  name: 'ExaminationReport',
  data() {
    return {
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
      tableData: []
    }
  },
  created() {
    this.tableData = mockData
  },
  mounted() {
    const sum = add(10, 20)
    console.log(`相加${sum}`)
    // console.debug('created')
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
