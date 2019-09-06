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
        <el-table-column property="address" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link class="filter-item" size="mini" type="primary" icon="el-icon-view" style="margin-right: 2px;" @click="paperViewRow(scope.row)">预览</el-link>
            <el-link class="filter-item" size="mini" type="warning" icon="el-icon-info" style="margin-right: 2px;" @click="paperDetailRow(scope.row)">详情</el-link>
            <el-link class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="paperDelete(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
    </el-card>
    <!-- 试卷详情 -->
    <paper-view :page-show="paperDetailDialog" :paper-info="paperInfo" size="50%" @show-change="showChange" />
  </div>
</template>

<script>
import { select, previewRequest } from '@/api/paper/composition.js'
import { parseTime, idToValueConversionFilter, getIdByValue } from '@/utils'
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
        difficult: '简单',
        comTime: ''
      },
      page: {
        size: 5,
        pageNumber: 1
      },
      paperInfo: {},
      paperDetailDialog: false,
      listLoading: false,
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
     * 初始获取题目类型
     */
    getSubjectCategoryList() {
      // TODO：获取题目类型
      this.subjectCategoryList = [
        {
          id: '326730406219907072',
          value: '单选'
        },
        {
          id: '326730408442888192',
          value: '多选'
        },
        {
          id: '326730410808475648',
          value: '填空'
        },
        {
          id: '326730412939182080',
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
      console.log(123)
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
      if (this.multipleSelection.length === 1) {
        const params = {
          id: this.multipleSelection[0].id,
          name: this.multipleSelection[0].name
        }
        previewRequest(params).then(result => {
          const info = result.body
          info.subjects.forEach(item => {
            item.type = idToValueConversionFilter(item.categoryId, this.subjectCategoryList)
            item.userAnswer = ''
          })
          this.paperInfo = info
          this.paperDetailDialog = true
        })
      } else {
        this.$message({
          type: 'error',
          message: '只能选择一条试卷数据'
        })
      }
    },
    /**
     * 试卷预览单行
     * @param row 行数据
     */
    paperViewRow(row) {
      const params = {
        id: row.id,
        name: row.name
      }
      previewRequest(params).then(result => {
        const info = result.body
        info.subjects.forEach(item => {
          item.type = idToValueConversionFilter(item.categoryId, this.subjectCategoryList)
          item.userAnswer = ''
        })
        this.paperInfo = info
        this.paperDetailDialog = true
      })
    },
    /**
     * 查看试卷详情
     */
    paperDetail() {
      if (this.multipleSelection.length === 1) {
        const params = {
          id: this.multipleSelection[0].id,
          name: this.multipleSelection[0].name
        }
        previewRequest(params).then(result => {
          const info = result.body
          info.subjects.forEach(item => {
            item.type = idToValueConversionFilter(item.categoryId, this.subjectCategoryList)
            item.userAnswer = ''
          })
          this.paperInfo = info
          this.paperDetailDialog = true
        })
      } else {
        this.$message({
          type: 'error',
          message: '只能选择一条试卷数据'
        })
      }
    },
    /**
     * 查看试卷详情
     * @param row 行数据
     */
    paperDetailRow(row) {
      const params = {
        id: row.id,
        name: row.name
      }
      previewRequest(params).then(result => {
        const info = result.body
        info.subjects.forEach(item => {
          item.type = idToValueConversionFilter(item.categoryId, this.subjectCategoryList)
          item.userAnswer = ''
        })
        this.paperInfo = info
        this.paperDetailDialog = true
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
