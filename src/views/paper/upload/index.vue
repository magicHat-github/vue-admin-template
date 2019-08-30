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
        <el-link class="itemAction" type="primary" icon="el-icon-upload" @click="uploadPaper()">上传试卷</el-link>
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
          <template slot-scope="scope">{{ scope.row.paperType | paperTypeFiler(paperTypeList) }}</template>
        </el-table-column>
        <el-table-column label="卷子难度" align="center">
          <template slot-scope="scope">{{ scope.row.difficult | paperDifficultFilter(difficultList) }}</template>
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
            <el-link v-if="scope.row.status === 0" class="itemAction" disabled type="warning" icon="el-icon-upload">已被禁用</el-link>
            <el-link v-else-if="scope.row.template === 0" class="itemAction" type="primary" icon="el-icon-upload" @click="uploadPaperRow(scope.$index, scope.row)">上传试卷</el-link>
            <el-link v-else class="itemAction" disabled type="success" icon="el-icon-upload">已经上传</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
    </el-card>
  </div>
</template>

<script>
import { select, uploadPaper } from '@/api/paper/composition.js'
import { parseTime } from '@/utils'
import { code } from '@/utils/code' // 响应码
import Pagination from '@/components/Pagination'

export default {
  name: 'Upload',
  components: { Pagination },
  filters: {
    parseUserTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    paperTypeFiler(type, paperTypeList) {
      let result = null
      paperTypeList.forEach(item => {
        if (item.id === type) {
          result = item.value
        }
      })
      return result
    },
    paperDifficultFilter(difficult, difficultList) {
      let result = null
      difficultList.forEach(item => {
        if (item.id === difficult) {
          result = item.value
        }
      })
      return result
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
        difficult: '简单',
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
      const difficultId = this.getIdByValue(this.difficultList, this.searchData.difficult)
      const params = {
        pageSize: this.page.size,
        pageNum: this.page.pageNumber,
        name: this.searchData.name,
        combExamMan: this.searchData.createdBy,
        difficult: difficultId,
        combExamTimeStart: this.searchData.comTime[0],
        combExamTimeEnd: this.searchData.comTime[1]
      }
      select(params).then(result => {
        const body = result.body
        this.list = body.list
        this.total = body.total
        this.listLoading = false
      })
    },
    /**
     * 初始获取全部试卷难度
     */
    getDifficultList() {
      // TODO: 获取全部试卷难度
      this.difficultList = [
        {
          id: '327071356621533183',
          value: '困难'
        },
        {
          id: '327071356621533182',
          value: '中等'
        },
        {
          id: '327071356621533184',
          value: '简单'
        }
      ]
    },
    /**
     * 初始获取全部试卷类型
     */
    getPaperTypeList() {
      // TODO：获取试卷类型
      this.paperTypeList = [
        {
          id: '327071356621533184',
          value: 'Java'
        },
        {
          id: '2',
          value: 'Python'
        },
        {
          id: '3',
          value: 'C#'
        }
      ]
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
     * 上传试卷
     */
    uploadPaper() {
      const length = this.multipleSelection.length
      if (length > 0) {
        let count = 0
        const selectedId = []
        this.multipleSelection.forEach(item => {
          if (item.template === 0 && item.status === 1) {
            selectedId.push(item.id)
          } else {
            count++
          }
        })
        if (selectedId.length === 0) {
          this.$message({
            type: 'error',
            message: '选中的数据都无法上传！请排除禁用或者已经上传的试卷'
          })
          return
        }
        const isUpload = count === 0
        const notice = this.$notify({
          title: '提示',
          type: isUpload ? 'info' : 'warning',
          message: isUpload ? '开始上传试卷...' : '排除不能上传的' + count + '张试卷，开始上传' + (length - count) + '张试卷...',
          duration: 0
        })
        uploadPaper(selectedId).then(result => {
          const success = result.head.code === code.SUCCESS
          this.normalNotice(
            notice,
            '提示',
            success ? 'success' : 'error',
            success ? '批量上传成功！' : result.head.msg
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
     * 上传试卷
     */
    uploadPaperRow(index, row) {
      const notice = this.$notify({
        title: '提示',
        type: 'info',
        message: row.name + ' 开始上传',
        duration: 0
      })
      uploadPaper([row.id]).then(result => {
        const success = result.head.code === code.SUCCESS
        this.normalNotice(
          notice,
          '提示',
          success ? 'success' : 'error',
          success ? row.name + ' 上传成功！' : result.head.msg
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
    },
    /**
     * 根据value和集合获取对应的ID
     */
    getIdByValue(list, value) {
      let result = null
      list.forEach(item => {
        if (item.value === value) {
          result = item.id
        }
      })
      return result
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
