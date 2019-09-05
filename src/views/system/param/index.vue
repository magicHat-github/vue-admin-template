<template>
  <el-container>
    <el-card class="tableData">
      <!-- 左侧边栏 -->
      <el-aside width="180px">
        <!-- 树上方的信息 -->
        <el-container>
          <el-header>
            <el-row align="center">
              <el-col>
                <h1 style="font-size:20px;" class="el-icon-menu">参数管理</h1>
              </el-col>
              <el-col span="6">
                <el-link class="el-image-viewer__actions__inner" type="primary" icon="el-icon-refresh-right" @click="searchTree" />
              </el-col>
            </el-row>
          </el-header>
          <!-- 树 -->
          <el-main>
            <el-tree v-loading="Loading" element-loading-text="Loading" accordion :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
          </el-main>
        </el-container>
      </el-aside>
    </el-card>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="searchData" class="demo-form-inline">
            <!-- 组织机构下拉框 -->
            <el-form-item label="参数类型:">
              <el-input v-model="searchData.paramType" placeholder="参数类型" clearable size="mini" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-form-item label="参数项:">
              <el-input v-model="searchData.name" placeholder="参数项" clearable size="mini" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 增删改按钮框 -->
        <el-card class="tableData">
          <div>
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addParam">增加</el-link>
            <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCheck">删除</el-link>
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateCheck">修改</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-upload2" @click="importParam">导入</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-download" @click="exportParam">导出</el-link>
          </div>

          <!-- 数据显示表单 -->

          <el-table
            ref="multipleTable"
            v-loading="Loading"
            element-loading-text="Loading"
            :data="list"
            tooltip-effect="dark"
            stripe
            height
            fit
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="paramType" label="参数类型" sortable="true" align="center">
              <template slot-scope="scope">{{ scope.row.paramType }}</template>
            </el-table-column>
            <el-table-column prop="name" label="参数项" align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="value" label="参数值" align="center">
              <template slot-scope="scope">{{ scope.row.value }}</template>
            </el-table-column>
            <el-table-column prop="updatedTime" label="更新时间" align="center">
              <template slot-scope="scope">{{ scope.row.updatedTime }}</template>
            </el-table-column>
            <el-table-column class-name="status-col" prop="status" label="启用标记" sortable="true" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                  {{ scope.row.status === 1 ? "是" : "否" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addParam" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateParam(row.id)" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteParam(row)" />
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
import { select, searchItem, searchTree, deleteList } from '@/api/system/param'
export default {
  name: 'Param',
  components: { Pagination },
  data() {
    return {
      //  参数记录列表，用于页面显示区域渲染数据
      list: null,
      // 从数据库中查询出来的符合查询条件的参数记录总条目数
      dataCount: 0,
      /**
       * 查询字段
       */
      searchData: {
        paramType: '',
        name: ''
      },
      // 分页的页面数据，默认5条一页，默认处于第一页
      page: {
        pageSize: 5,
        pageNum: 1
      },
      // load加载动画标志
      Loading: false,
      // 表格选择列表
      multipleSelection: [],
      /**
         * 初始显示的页数
         */
      currentPage1: 1,
      currentPage2: 2,
      currentPage3: 3,
      currentPage4: 4,
      dynamicTags: ['标签一', '标签二', '标签三'],
      /**
         * 树结构数据
         */
      treeData: null,
      /**
         * 树结构的默认属性
         */
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'id'
      }
    }
  },
  created() {
    this.fetchData()
    // this.searchTree()
  },

  methods: {
    /**
     * 页面刚开始加载数据时，即还未在查询框中输入查询条件时，分页查询参数数据
     */
    fetchData() {
      this.listLoading = true
      const params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        paramType: this.searchData.paramType,
        name: this.searchData.name
      }
      select(params).then(result => {
        const body = result.body
        this.list = body.params.dataList
        this.dataCount = parseInt(body.params.dataCount)
        this.listLoading = false
      })
    },
    /**
     * 树的上方区域点击事件
     */
    searchTree() {
      searchTree().then(result => {
        const body = result.body
        this.treeData = body.treeData
        console.log(this.treeData)
      })
    },
    /**
       * 树结构的点击事件
       */
    handleNodeClick(data) {
      console.log(data)
      this.formInline.name = data.label
      this.fetchByName()
    },

    /**
     * 输入框响应enter查询
     */
    handleFilter() {
      this.page.pageNumber = 1
      this.fetchData()
    },

    /**
       * 勾选事件触发的函数,即多选操作
       */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
       * 跳转到增加界面
       */
    addParam() {
      this.$router.push({
        name: 'AddParam'
      })
    },
    /**
     * 跳转至更新页面
     */
    updateParam(id) {
      searchItem(id).then(result => {
        const body = result.body
        this.$router.push({
          name: 'UpdateParam',
          params: {
            id: body.id,
            paramType: body.paramType,
            name: body.name,
            value: body.value,
            remark: body.remark,
            status: body.status,
            version: body.version
          }
        })
      })
    },
    /**
     * 对表格多选项进行判定，如果修改的是单条数据则跳转至更新页面
     */
    updateCheck() {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          type: 'warning',
          message: '请选择单个修改选项'
        })
      } else {
        let id = null
        this.multipleSelection.forEach(item => {
          id = item.id
        })
        this.updateParam(id)
      }
    },

    /**
       * 删除信息
       */
    deleteParam(row) {
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //  确认之后执行删除操作
          const params = {
            dataList: []
          }
          const deleteData = {
            id: row.id,
            version: row.version
          }
          params.dataList.push(deleteData)
          deleteList(params).then(result => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }).catch(result => {
            this.$message({
              type: 'success',
              message: '删除失败!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 对表格多选项进行判定，至少选择一行才能执行删除操作
     */
    deleteCheck() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除选项'
        })
      } else {
        const params = { dataList: [] }
        this.multipleSelection.forEach(item => {
          const deleteData = {
            id: item.id,
            version: item.version
          }
          params.dataList.push(deleteData)
        })
        this.$confirm('是否要删除选定信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteList(params).then(result => {
              console.log(params)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.fetchData()
            }).catch(result => {
              console.log(params)
              this.$message({
                type: 'success',
                message: '删除失败!'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    }
  }
}
</script>

<style>
  .itemAction {
    margin-right: 10px;
  }
</style>
