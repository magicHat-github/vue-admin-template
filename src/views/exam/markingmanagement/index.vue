<template>
  <div id="marking-management">
    <el-form :inline="true" :model="queryForm" size="mini" class="querydiv">
      <el-form-item label="批阅状态:">
        <el-select v-model="queryForm.selectStatus">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交卷时间段:从">
        <el-date-picker
          v-model="queryForm.commitPeriodTime"
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
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="editDiv">
      <el-button type="text" class="el-icon-s-claim" @click="marking">批阅</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe size="mini" border fit>
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="paperName" label="试卷" />
        <el-table-column prop="examSessionName" label="场次" />
        <el-table-column prop="publishTime" label="发布日期" />
        <el-table-column prop="tel" label="答卷人手机号" />
        <el-table-column prop="examerName" label="答卷人" />
        <el-table-column prop="actualEndTime" label="交卷时间" />
        <el-table-column prop="makingStopTime" label="阅卷终止时间" />
        <el-table-column prop="objectiveScore" label="客观题" />
        <el-table-column prop="subjectiveScore" label="主观题" />
        <el-table-column prop="systemEvaluate" label="系统评价" />
        <el-table-column label="状态">
          <!-- 使用过滤器来显示 -->
          <template slot-scope="{row}">
            {{ row.status | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button class="el-icon-s-claim" type="text" @click="marking(row)">批阅</el-button>
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
import { layout, pageSize, pageSizes, markingStatuOptions, markingMockData } from '../common'
export default {
  name: 'MarkingManagement',
  filters: {
    statusFilter: val => {
      if (val === '1') {
        return '已批阅'
      } else {
        return '未批阅'
      }
    }
  },
  data() {
    return {
      queryForm: {
        selectStatus: 'marked',
        // 提交的时间段
        commitPeriodTime: '',
        // 考试场次
        examSessionName: ''
      },
      layout: layout,
      pageSizes: pageSizes,
      pageSize: pageSize,
      currentPage: 1,
      total: 100,
      tableData: [],
      statusOptions: markingStatuOptions
    }
  },
  mounted() {
    this.tableData = markingMockData
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      console.log(val)
    },
    search() {
      console.log(this.queryForm)
      // 调用查询
      this.$message({
        type: 'success',
        message: '查询成功'
      })
    },
    marking(row) {
      // 判断是否已经批阅过了
      if (row.status === 1) {
        this.$message({
          type: 'info',
          message: '已经批阅过'
        })
      }
    }
  }
}
</script>
<style>
#marking-management {
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
