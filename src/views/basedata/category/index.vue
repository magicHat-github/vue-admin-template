<template>
  <el-container>
    <el-card class="tableData">
      <!-- 左侧边栏 -->
      <el-aside width="180px">
        <!-- 树上方的信息 -->
        <el-container>
          <el-header>
            <el-row align="center">
              <el-col span="18">
                <h1 style="font-size:20px;" class="el-icon-menu">题目类别</h1>
              </el-col>
              <el-col span="6">
                <el-link class="el-image-viewer__actions__inner" type="primary" icon="el-icon-refresh-right" @click="searchTree" />
              </el-col>
            </el-row>
          </el-header>
          <!-- 树 -->
          <el-main>
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
          </el-main>
        </el-container>
      </el-aside>
    </el-card>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="题目类别:">
              <el-input v-model="formInline.name" clearable size="mini" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="select">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-card class="tableData">
          <!-- 增删改按钮框 -->
          <div>
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto">增加</el-link>
            <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCheck">删除</el-link>
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateCheck">修改</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-upload2" @click="updateItem">导入</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-download" @click="updateItem">导出</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="dataList"
            tooltip-effect="dark"
            stripe
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="题目类别">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.remark }}
              </template>
            </el-table-column>
            <el-table-column prop="updatedTime" label="更新时间">
              <template slot-scope="scope">
                {{ scope.row.updatedTime }}
              </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 1 ? 'primary' : 'info'"
                >{{ scope.row.status === 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateItem(scope.row.id)" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteItem(scope.row.id,scope.row.version)" />
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页部分 -->
          <div>
            <pagination
              v-show="dataCount>0"
              :total="dataCount"
              :page.sync="page.pageNum"
              :limit.sync="page.pageSize"
              @pagination="select"
            />
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Pagination from '@/components/Pagination'
import { select, deleteList, searchTree, searchItem } from '@/api/basedata/catetory'
export default {
  name: 'App',
  components: { Pagination },
  data() {
    return {
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
      },
      /**
         * 查询框字段
         */
      formInline: {
        name: ''
      },
      dataList: null,
      page: {
        pageSize: 5,
        pageNum: 1
      },
      listLoading: false,
      // 试卷总数
      dataCount: 0,
      /**
         * 多选栏数据
         */
      multipleSelection: []
    }
  },
  created() {
    this.select()
    this.searchTree()
  },
  methods: {
    /**
     * 查询题目类别树
     */
    searchTree() {
      searchTree().then(result => {
        const body = result.body
        this.treeData = body.treeData
      })
    },
    /**
     * 树结构的点击事件
     */
    handleNodeClick(data) {
      console.log(data)
      this.formInline.name = data.label
      this.select()
    },
    /**
     * 模糊查询
     */
    select() {
      this.listLoading = true
      const params = {
        name: this.formInline.name,
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      select(params).then(result => {
        const body = result.body
        this.dataList = body.categories.dataList
        this.dataCount = body.categories.dataCount
        this.listLoading = false
      })
    },
    /**
       * 勾选事件触发的函数
       */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
       * 跳转到增加界面
       */
    goto() {
      this.$router.push({
        name: 'AddCategory'
      })
    },
    /**
     * 跳转至修改页面
     */
    updateItem(id) {
      searchItem(id).then(result => {
        const body = result.body
        this.$router.push({
          name: 'UpdateCategory',
          params: {
            id: body.id,
            name: body.name,
            parentId: body.parentId,
            parentName: body.parentName,
            remark: body.remark,
            status: body.status
          }
        })
      })
    },
    /**
     * 对表格多选项进行判定，成则跳转至修改页面
     */
    updateCheck() {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          type: 'warning',
          message: '请选择单个修改选项'
        })
      } else {
        this.$router.push({
          name: 'UpdateCategory'
        })
      }
    },

    /**
       * 删除信息
       */
    deleteItem(id, version) {
      this.treeData.forEach(item => {
        if (item.id === id) {
          console.log(id)
        }
      })
      const params = { dataList: [] }
      const data = { id: id,
        version: version }
      params.dataList.push(data)
      console.log(params)
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteList(params).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.select()
          }).catch(() => {
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
     * 对表格多选项进行判定，成功则删除
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
          const data = { id: item.id,
            version: item.version }
          params.dataList.push(data)
        })
        this.$confirm('是否要删除选定信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log(params)
            deleteList(params).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.queryData()
            }).catch(() => {
              this.$message({
                type: 'warning',
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
