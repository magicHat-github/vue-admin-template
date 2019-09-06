<template>
  <!--报表详情-->
  <div id="report-detail">
    <!-- 发布记录的表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        stripe
        size="mini"
        border
        fit
        style="width:100%"
      >
        <el-table-column type="index" label="序号" />
        <el-table-column prop="examiner" label="姓名" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="examName" label="考试名" />
        <el-table-column prop="subjectiveSubjectScore" label="主观题" />
        <el-table-column prop="objectiveSubjectScore" label="客观题" />
        <el-table-column prop="score" label="总分" />
        <el-table-column prop="range" label="排名" />
        <el-table-column prop="consumTime" label="考试耗时" />
        <el-table-column prop="systemEvaluate" label="能力标签" />
      </el-table>

    </div>
    <!-- 分页框 -->
    <el-pagination
      v-show="total > 0"
      background
      :layout="layout"
      :total="total"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-button @click="goBack">返回</el-button>
  </div>
</template>
<script>
import { layout, pageSizes, pageSize } from '../../common'

export default {
  name: 'ReportDetail',
  data() {
    return {
      recordId: '',
      tableData: [
        {
          id: '11',
          examinerCode: '112',
          examiner: 'GG',
          sex: 1,
          examName: '秋招第一场',
          objectiveSubjectScore: '44',
          subjectiveSubjectScore: '44',
          score: '88',
          range: '1/220',
          consumTime: '30分钟',
          systemEvaluate: 'A'

        }
      ],
      total: 12,
      layout: layout,
      pageSizes: pageSizes,
      pageSize: pageSize,
      currentPage: 1
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        console.log(route)
        if (route.name === 'ReportDetail') {
          const id = route.params.recordId
          this.recordId = id
          if (this.recordId === null || this.recordId === '' || this.recordId === undefined) {
            // 错误访问
            this.errorAccess()
          } else {
            this.loadData(id)
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 错误访问
     */
    errorAccess() {
      this.$confirm(
        '错误访问',
        '警告',
        {
          type: 'warning',
          confirmButtonText: '确定'
        }
      ).then(() => {
        this.goBack()
      }).catch(() => {
        this.goBack()
      })
    },
    /**
     * 返回报表页面
     */
    goBack() {
      this.$router.push({ name: 'report' })
    },
    /**
     * 加载数据
     */
    loadData(id) {
    },
    handleSizeChange(val) {
      console.log('大小改变')
    },
    handleCurrentChange(val) {
      console.log('当前页改变')
    }
  }
}
</script>
<style>
#report-detail {
  padding: 15px;
}
.table {
  margin: 15px;
  /* margin-bottom: 15px; */
}
</style>
