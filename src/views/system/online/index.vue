<template>
  <el-container>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="searchData" class="demo-form-inline">
            <el-form-item label="工号:">
              <el-input v-model="searchData.code" clearable size="mini" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-form-item label="用户名:">
              <el-input v-model="searchData.name" clearable size="mini" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-form-item label="在线时间段：">
              <el-date-picker
                v-model="searchData.loginTime"
                type="datetime"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="至">
              <el-date-picker
                v-model="searchData.logoutTime"
                type="datetime"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 操作按钮框 -->
        <el-card class="tableData">
          <div>
            <el-link class="itemAction" type="danger" icon="el-icon-warning-outline" @click="forceOfflineCheck">强制下线</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-download" @click="update1">导出</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            element-loading-text="Loading"
            :data="list"
            tooltip-effect="dark"
            stripe
            height
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="code" label="工号" align="center" />
            <el-table-column prop="name" label="用户" align="center" />
            <el-table-column prop="IP" label="IP" align="center" />
            <el-table-column prop="loginTime" label="上线时间" align="center">
              <template slot-scope="scope">{{ scope.row.loginTime | parseUserTime('{y}-{m}-{d} {h}:{i}') }}</template>
            </el-table-column>
            <el-table-column prop="logoutTime" label="下线时间" align="center">
              <template slot-scope="scope">{{ scope.row.logoutTime | parseUserTime('{y}-{m}-{d} {h}:{i}') }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">{{ scope.row.status === 1 ? "在线" : "离线" }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <el-link class="itemAction" type="danger" icon="el-icon-warning-outline" @click="forceOffline(row.id)">强制下线</el-link>
                <el-link class="itemAction" type="primary" icon="el-icon-download" @click="exportForm">导出</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页部分 -->
          <div class="block">
            <pagination v-show="dataCount>0" :total="dataCount" :page.sync="page.pageNum" :limit.sync="page.pageSize" @pagination="fetchData" />
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
// import { log } from 'util'
import Pagination from '@/components/Pagination'
import { select } from '@/api/system/userOnline'
import { parseTime } from '@/utils'
export default {
  name: 'App',
  components: { Pagination },
  filters: {
    parseUserTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data() {
    return {
      /**
         * 查询字段
         */
      searchData: {
        code: '',
        name: '',
        loginTime: '',
        logoutTime: ''
      },
      // 在线用户记录集合，用于页面数据的渲染
      list: null,
      // 查询出来的记录的总条目数
      dataCount: 0,
      // 分页的页面数据，默认5条一页，默认处于第一页
      page: {
        pageSize: 5,
        pageNum: 1
      },
      // load加载动画标志
      listLoading: false,
      /**
         * 待确认字段
         */
      multipleSelection: [],
      /**
         * 初始显示的页数
         */
      currentPage1: 1,
      currentPage2: 2,
      currentPage3: 3,
      currentPage4: 4,
      dynamicTags: ['标签一', '标签二', '标签三']
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //  改变页面大小，拉取一次数据
    handleSizeChange(val) {
      this.page.pageSize = val
      this.fetchData()
    },
    //  跳转到指定页面，拉取一次数据
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.fetchData()
    },
    /**
     * 分页查询在线用户信息
     * 将显示数据的初始化和查询数据放在一起
     * 初始化的时候是按照页面给定的页面大小，只拉取一页数据
     * 查询是按照给定的查询条件结合页面大小进行显示
    */
    fetchData() {
      this.listLoading = true
      const params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        code: this.searchData.code,
        name: this.searchData.name,
        loginTime: this.searchData.loginTime,
        logoutTime: this.searchData.logoutTime
      }
      select(params).then(result => {
        const body = result.body
        this.list = body.userOnlineInfoList.dataList
        this.dataCount = parseInt(body.userOnlineInfoList.dataCount)
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
       * 勾选事件触发的函数
       */
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>
  .itemAction {
    margin-right: 10px;
  }
</style>
