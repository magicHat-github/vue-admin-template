<template>
  <div id="examination-report" class="page-contain">
    <h2>考试报表</h2>
    <el-form :inline="true" :model="queryForm" size="mini" class="querydiv">
      <el-form-item label="场次号:">
        <el-input />
      </el-form-item>
      <el-form-item label="考试号:">
        <el-input />
      </el-form-item>
      <el-form-item label="试卷发布人:">
        <el-input />
      </el-form-item>
      <el-form-item label="考试时间段:从">
        <el-date-picker
          v-model="value3"
          type="datetimerange"
          :picker-options="pickerOptions"
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
    <div class="edit">
      <span>
        <el-link :underline="false" class="el-icon-question">查看详情</el-link>
      </span>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe size="mini" border fit>
        <el-table-column type="selection" />
        <el-table-column prop="a" label="考试名" />
        <el-table-column prop="" label="场次" />
        <el-table-column prop="" label="考试截止时间" />
        <el-table-column prop="" label="答卷人手机号" />
        <el-table-column prop="" label="姓名" />
        <el-table-column prop="" label="开始考试时间" />
        <el-table-column prop="" label="交卷时间" />
        <el-table-column prop="" label="阅卷终止时间" />
        <el-table-column prop="" label="客观题得分" />
        <el-table-column prop="" label="主观题得分" />
        <el-table-column prop="" label="操作">
          <template slot-scope="{ row }">
            <el-button class="el-icon-question" type="text" @click="edit(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ExaminationReport',
  data() {
    return {
      tableData: [
        {
          a: 'ddd'
        }
      ]
    }
  }
}
</script>
<style>
.edit {
  /* margin: 20px; */
  margin-bottom: 20px;
}
.table {
  /* margin: 20px; */
  margin-bottom: 20px;
}
.page-contain {
  margin: 20px;
}
</style>
