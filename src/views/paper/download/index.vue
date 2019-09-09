<template>
  <div class="app-container allData">

    <!-- 试卷查询域 -->
    <div class="filter-container searchData">
      <el-form ref="form" :model="searchData" size="mini" label-width="70px" inline>
        <el-form-item label="试卷名">
          <el-input v-model="searchData.name" placeholder="试卷名" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="组卷人">
          <el-input v-model="searchData.createdBy" placeholder="组卷人" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="组卷时间">
          <el-date-picker v-model="searchData.comTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="试卷难度">
          <el-select v-model="searchData.difficult" placeholder="请选择难度.." size="mini" style="width: 160px" class="filter-item">
            <el-option v-for="item in difficultList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      </el-form>
    </div>
    <!-- 试卷数据域 -->
    <el-card class="tableData">
      <div>
        <el-link class="itemAction" type="primary" icon="el-icon-download" @click="downloadPaper()">下载模板</el-link>
      </div>
      <!-- 试卷数据表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        size="mini"
        element-loading-text="Loading"
        fit
        stripe
        highlight-current-row
        style="margin-top: 10px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="试卷名" width="110" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="组卷人" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.combExamMan }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卷子类型" align="center">
          <template slot-scope="scope">{{ scope.row.paperType | userIdToValueConversionFilter(paperTypeList) }}</template>
        </el-table-column>
        <el-table-column label="卷子难度" align="center">
          <template slot-scope="scope">{{ scope.row.difficult | userIdToValueConversionFilter(difficultList) }}</template>
        </el-table-column>
        <el-table-column label="组卷时间" align="center">
          <template slot-scope="scope">{{ scope.row.combExamTime | parseUserTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column label="试卷总分" align="center">
          <template slot-scope="scope">{{ scope.row.score }}</template>
        </el-table-column>
        <el-table-column label="试卷描述" align="center">
          <template slot-scope="scope">{{ scope.row.descript }}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">禁用</el-tag>
            <el-tag v-else>启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-link v-if="scope.row.status === 0" class="itemAction" disabled type="warning" icon="el-icon-download">已被禁用</el-link>
            <el-link v-else class="itemAction" type="primary" icon="el-icon-download" @click="downloadPaperRow(scope.$index, scope.row)">下载模板</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
    </el-card>
  </div>
</template>

<script>
import { select, downloadPaper } from '@/api/paper/composition.js'
import { searchByCategory } from '@/api/basedata/dictionary'
import { parseTime, idToValueConversionFilter, getIdByValue, constants } from '@/utils'
import { code } from '@/utils/code' // 响应码
import Pagination from '@/components/Pagination'

export default {
  name: 'Download',
  components: { Pagination },
  filters: {
    parseUserTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    userIdToValueConversionFilter(target, targetList) {
      return idToValueConversionFilter(target, targetList)
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      // 试卷难度集合
      difficultList: [],
      // 试卷类型集合
      paperTypeList: [],
      searchData: {
        name: '',
        createdBy: '',
        difficult: '',
        comTime: ''
      },
      page: {
        size: 5,
        pageNumber: 1
      },
      listLoading: false,
      multipleSelection: [],
      noticeTime: 0
    }
  },
  created() {
    this.getDifficultList()
    this.getPaperTypeList()
    this.fetchData()
  },
  methods: {
    /**
     * 分页查询数据
     */
    fetchData() {
      this.listLoading = true
      const difficultId = getIdByValue(this.difficultList, this.searchData.difficult)
      const params = {
        pageSize: this.page.size,
        pageNum: this.page.pageNumber,
        name: this.searchData.name,
        combExamMan: this.searchData.createdBy,
        difficult: difficultId,
        template: 1,
        combExamTimeStart: this.searchData.comTime[0],
        combExamTimeEnd: this.searchData.comTime[1]
      }
      select(params).then(result => {
        const body = result.body
        this.list = body.dataList
        this.total = body.dataCount * 1
        this.listLoading = false
      })
    },
    /**
     * 初始获取全部试卷难度
     */
    getDifficultList() {
      searchByCategory(constants.paperDifficult).then(result => {
        this.difficultList = result.body
      })
    },
    /**
     * 初始获取全部试卷类型
     */
    getPaperTypeList() {
      searchByCategory(constants.paperType).then(result => { this.paperTypeList = result.body })
    },
    /**
     * 输入框响应enter查询
     */
    handleFilter() {
      this.page.pageNumber = 1
      this.fetchData()
    },
    /**
     * 获取表格选取的数据
     */
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    /**
     * 下载试卷
     */
    downloadPaper() {
      const length = this.multipleSelection.length
      if (length > 0) {
        let count = 0
        const selectedId = []
        this.multipleSelection.forEach(item => {
          if (item.template === 1 && item.status === 1) {
            selectedId.push(item.id)
          } else {
            count++
          }
        })
        if (selectedId.length === 0) {
          this.$message({
            type: 'error',
            message: '选中的数据都无法下载！请排除已禁用的模板'
          })
          return
        }
        const isDownload = count === 0
        const notice = this.$notify({
          title: '提示',
          type: isDownload ? 'info' : 'warning',
          message: isDownload ? '开始下载试卷...' : '排除不能下载的' + count + '张模板，开始下载' + (length - count) + '张试卷...',
          duration: 0
        })
        downloadPaper(selectedId).then(result => {
          const success = result.head.code === code.SUCCESS
          this.normalNotice(
            notice,
            '提示',
            success ? 'success' : 'error',
            success ? '批量下载成功！' : result.head.msg
          )
          this.fetchData()
        }).catch(result => {
          this.normalNotice(notice, '提示', 'error', result.msg)
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择数据'
        })
      }
    },
    /**
     * 单行下载模板
     */
    downloadPaperRow(index, row) {
      const notice = this.$notify({
        title: '提示',
        type: 'info',
        message: row.name + ' 开始下载',
        duration: 0
      })
      downloadPaper([row.id]).then(result => {
        const success = result.head.code === code.SUCCESS
        this.normalNotice(
          notice,
          '提示',
          success ? 'success' : 'error',
          success ? row.name + ' 下载成功！' : result.head.msg
        )
        this.fetchData()
      }).catch(result => {
        this.normalNotice(notice, '提示', 'error', result.msg)
      })
    },
    /**
     * 错误提示
     */
    normalNotice(notice, title, type, message) {
      setTimeout(() => {
        notice.close()
      }, 2000)
      this.$notify({
        title: title,
        type: type,
        message: message,
        duration: 3000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.itemAction {
  margin-bottom: 10px;
  margin-left: 5px;
}
</style>
