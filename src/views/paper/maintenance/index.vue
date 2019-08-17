<template>
  <div class="app-container allData">
    <!-- 查询 -->
    <div class="filter-container searchData">
      <el-form ref="form" :model="searchData" size="mini" label-width="70px" inline>
        <el-form-item label="试卷名">
          <el-input v-model="searchData.name" placeholder="试卷名" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="组卷人">
          <el-input v-model="searchData.createdBy" placeholder="组卷人" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="试卷难度">
          <el-select v-model="searchData.difficult" placeholder="请选择难度.." size="mini" style="width: 160px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in difficultList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="组卷时间">
          <el-date-picker v-model="searchData.comTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-remove-outline" @click="uploadPaper">清空</el-button>
      </el-form>
    </div>
    <el-card class="tableData">
      <div>
        <el-link class="itemAction" type="primary" icon="el-icon-view" @click="paperViewAction">预览</el-link>
        <el-link class="itemAction" type="warning" icon="el-icon-info" @click="uploadPaper()">详情</el-link>
        <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="uploadPaper()">删除</el-link>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        size="mini"
        element-loading-text="Loading"
        fit
        stripe
        highlight-current-row
        style="margin-top: 10px;"
        @row-dblclick="uploadPaper"
        @selection-change="uploadPaper"
      >
        <el-table-column property="name" label="试卷名" />
        <el-table-column property="address" label="组卷人" />
        <el-table-column property="address" label="卷子类型" />
        <el-table-column property="address" label="试卷难度" />
        <el-table-column property="address" label="组卷时间" />
        <el-table-column property="address" label="试卷总分" />
        <el-table-column property="address" label="试卷描述" />
        <el-table-column property="address" label="状态" />
        <el-table-column property="address" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button class="filter-item" size="mini" type="primary" icon="el-icon-view" @click="paperViewAction(scope.$index, scope.row)">预览</el-button>
            <el-button class="filter-item" size="mini" type="warning" icon="el-icon-info" @click="uploadPaper(scope.$index, scope.row)">详情</el-button>
            <el-button class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="uploadPaper(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
    </el-card>

    <paper-view :page-show="paperViewShow" :paper-info="paperInfo" @show-change="showChange" />
  </div>
</template>

<script>
import { select } from '@/api/paper/composition.js'
import Pagination from '@/components/Pagination'
import PaperView from '@/components/PaperView'

export default {
  name: 'Maintenance',
  components: { Pagination, PaperView },
  data() {
    return {
      list: null,
      total: 0,
      difficultList: ['困难', '一般', '简单'],
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
      paperViewShow: false,
      listLoading: false,
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 分页查询数据
     */
    fetchData() {
      this.listLoading = true
      const params = {
        size: this.page.size,
        page: this.page.pageNumber,
        name: this.searchData.name,
        createdBy: this.searchData.createdBy,
        difficult: this.searchData.difficult,
        comTime: this.searchData.comTime
      }
      select(params).then(result => {
        this.list = result.data.list
        this.total = result.data.total
        this.listLoading = false
      })
    },
    /**
     * 输入框响应enter查询
     */
    handleFilter() {
      this.page.pageNumber = 1
      this.fetchData()
    },
    /**
     * 上传试卷
     */
    uploadPaper() {
      console.log('uploadPaper')
    },
    /**
     * 试卷详情
     */
    paperViewAction() {
      this.paperViewShow = true
    },
    /**
     * 同步试卷预览的值
     * @param val
     */
    showChange(val) {
      this.paperViewShow = val
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
