<template>
  <div class="app-container allData">
    <!-- 试卷查询域 -->
    <div class="filter-container searchData">
      <el-form ref="form" :model="searchData" size="mini" label-width="70px" inline>
        <el-form-item label="模板名">
          <el-input v-model="searchData.name" placeholder="模板名" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="组卷人">
          <el-input v-model="searchData.createdBy" placeholder="组卷人" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="组卷时间">
          <el-date-picker v-model="searchData.comTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="模板难度">
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
        <el-link class="itemAction" type="primary" icon="el-icon-view" @click="paperView">预览</el-link>
        <el-link class="itemAction" type="warning" icon="el-icon-info" @click="paperDetail">详情</el-link>
        <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="paperDelete">删除</el-link>
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
        <el-table-column label="模板名" width="110" align="center">
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
        <el-table-column label="模板描述" align="center">
          <template slot-scope="scope">{{ scope.row.descript }}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">禁用</el-tag>
            <el-tag v-else>启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="address" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link class="filter-item" size="mini" type="primary" icon="el-icon-view" style="margin-right: 2px;" @click="paperViewRow(scope.row)">预览</el-link>
            <el-link class="filter-item" size="mini" type="warning" icon="el-icon-info" style="margin-right: 2px;" @click="paperDetailRow(scope.row)">详情</el-link>
            <el-link class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="paperDeleteRow(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
    </el-card>
    <!-- 试卷详情 -->
    <paper-view
      :page-title="pageTitle"
      :paper-edit="paperEdit"
      :page-show="paperDetailDialog"
      :show-answer-switch="true"
      :show-disable-switch="disableSwitch"
      :paper-info="paperInfo"
      :category-list="subjectCategoryList"
      :paper-type-list="paperTypeList"
      :paper-difficult-list="difficultList"
      :size="paperSize"
      @show-change="showChange"
      @submitPaper="submitPaper"
    />
  </div>
</template>

<script>
import { select, previewRequest, deletePaperRequest, maintainPaperRequest } from '@/api/paper/composition.js'
import { parseTime, idToValueConversionFilter, getIdByValue, constants } from '@/utils'
import { searchByCategory } from '@/api/basedata/dictionary'
import { subjectConversion } from '@/utils/subjectType'
import { code } from '@/utils/code' // 响应码
import Pagination from '@/components/Pagination'
import PaperView from '@/components/PaperView'

export default {
  name: 'Template',
  components: { Pagination, PaperView },
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
      // 题型集合
      subjectCategoryList: [],
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
      paperSize: '50%',
      paperInfo: {},
      paperDetailDialog: false,
      listLoading: false,
      pageTitle: '',
      paperEdit: false,
      disableSwitch: false,
      multipleSelection: []
    }
  },
  created() {
    this.getDifficultList()
    this.getPaperTypeList()
    this.fetchData()
    this.getSubjectCategoryList()
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
     * 初始获取题目类型
     */
    getSubjectCategoryList() {
      // TODO：获取题目类型
      this.subjectCategoryList = [
        {
          id: '329196546032566272',
          attribute: '单选题',
          value: '单选'
        },
        {
          id: '329196582854361088',
          attribute: '多选题',
          value: '多选'
        },
        {
          id: '329196619005067264',
          attribute: '填空题',
          value: '填空'
        },
        {
          id: '329196650844028928',
          attribute: '主观题',
          value: '主观'
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
     * 同步试卷预览的值
     * @param val
     */
    showChange(val) {
      this.paperDetailDialog = val
    },
    /**
     * 试卷删除
     */
    paperDelete() {
      this.$confirm('此操作将永久删除试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.multipleSelection.forEach(item => {
          ids.push({
            id: item.id,
            version: item.version
          })
        })
        this.sendDeletePaperRequest(ids)
      })
    },
    /**
     * 试卷删除
     */
    paperDeleteRow(row) {
      this.$confirm('此操作将永久删除试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sendDeletePaperRequest([{ id: row.id, version: row.version }])
      })
    },
    /**
     * 获取表格选取的数据
     */
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    /**
     * 试卷预览
     */
    paperView() {
      this.paperSize = '50%'
      this.pageTitle = '试卷预览'
      this.paperEdit = false
      this.disableSwitch = false
      this.decideTableSelection(() => {
        this.sendPreviewRequest(this.multipleSelection[0].id, this.multipleSelection[0].name)
      })
    },
    /**
     * 试卷预览单行
     * @param row 行数据
     */
    paperViewRow(row) {
      this.paperSize = '50%'
      this.pageTitle = '试卷预览'
      this.paperEdit = false
      this.disableSwitch = false
      this.sendPreviewRequest(row.id, row.name)
    },
    /**
     * 查看试卷详情
     */
    paperDetail() {
      this.paperSize = '60%'
      this.pageTitle = '试卷详情'
      this.paperEdit = true
      this.disableSwitch = true
      this.decideTableSelection(() => {
        this.sendPreviewRequest(this.multipleSelection[0].id, this.multipleSelection[0].name)
      })
    },
    /**
     * 查看试卷详情
     * @param row 行数据
     */
    paperDetailRow(row) {
      this.paperSize = '60%'
      this.pageTitle = '试卷详情'
      this.paperEdit = true
      this.disableSwitch = true
      this.sendPreviewRequest(row.id, row.name)
    },
    /**
     * 发送试卷预览请求
     * @param id 参数ID
     * @param name 参数名称
     */
    sendPreviewRequest(id, name) {
      const params = {
        id: id,
        name: name
      }
      previewRequest(params).then(result => {
        const info = result.body
        this.paperInfo = subjectConversion(info, this.subjectCategoryList)
        this.list.forEach(item => {
          if (item.id === id) {
            this.paperInfo.id = item.id
            this.paperInfo.paperType = item.paperType
            this.paperInfo.difficult = item.difficult
            this.paperInfo.descript = item.descript
          }
        })
        this.paperDetailDialog = true
      })
    },
    /**
     * 判断表格只能选择一条数据
     * @param fun 成功时调用的方法
     */
    decideTableSelection(fun) {
      if (this.multipleSelection.length === 1) {
        fun()
      } else {
        this.$message({
          type: 'error',
          message: '只能选择一条试卷数据！'
        })
      }
    },
    /**
     * 发送删除试卷请求
     * @param data 试卷数据
     */
    sendDeletePaperRequest(data) {
      const params = {
        dataList: data
      }
      const notice = this.$notify({
        title: '提示',
        type: 'info',
        message: '正在删除试卷...',
        duration: 0
      })
      deletePaperRequest(params).then(result => {
        const success = result.head.code === code.SUCCESS
        this.normalNotice(
          notice,
          '提示',
          success ? 'success' : 'error',
          success ? '删除成功！' : result.head.msg
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
     * 提交修改的表单
     * @param params
     */
    submitPaper(params) {
      const notice = this.$notify({
        title: '提示',
        type: 'info',
        message: '正在修改试卷...',
        duration: 0
      })
      maintainPaperRequest(params).then(result => {
        const success = result.head.code === code.SUCCESS
        this.normalNotice(
          notice,
          '提示',
          success ? 'success' : 'error',
          success ? '修改成功！' : result.head.msg
        )
        this.fetchData()
      }).catch(result => {
        this.normalNotice(notice, '提示', 'error', result.msg)
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
