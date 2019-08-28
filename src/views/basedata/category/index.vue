<template>
  <el-container>
    <el-card class="tableData">
      <!-- 左侧边栏 -->
      <el-aside width="180px">
        <!-- 树上方的信息 -->
        <el-container>
          <el-header>
            <el-row>
              <el-col>
                <h1 style="font-size:20px;" class="el-icon-menu">题目类别</h1>
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
              <el-button size="mini" type="primary" @click="fetch">查询</el-button>
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
            height
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
                  :type="scope.row.status === '1' ? 'primary' : 'info'"
                >{{ scope.row.status === 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateItem" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteItem(scope.row.id)" />
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页部分 -->
          <div>
            <pagination
              v-show="dataCount>0 && formInline.name === ''"
              :total="dataCount"
              :page.sync="page.pageNum"
              :limit.sync="page.pageSize"
              @pagination="fetchData"
            />
            <pagination
              v-show="dataCount>0 && formInline.name !== ''"
              :total="dataCount"
              :page.sync="page.pageNumSearch"
              :limit.sync="page.pageSize"
              @pagination="fetchByName"
            />
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
// import { log } from 'util'
import Pagination from '@/components/Pagination'
// eslint-disable-next-line no-unused-vars
import { select, selectByName, deleteList } from '@/api/basedata/catetory'
export default {
  name: 'App',
  // eslint-disable-next-line vue/no-unused-components
  components: { Pagination },
  data() {
    return {
      dataList: null,
      /**
         * 树结构数据
         */
      treeData: [
        {
          label: '数学题',
          children: [
            {
              label: '几何'
            }
          ]
        },
        {
          label: '物理题',
          children: [
            {
              label: '力学'
            },
            {
              label: '电学'
            }
          ]
        }
      ],
      /**
         * 树结构的默认属性
         */
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      /**
         * 查询字段
         */
      formInline: {
        name: ''
      },
      page: {
        pageSize: 5,
        pageNum: 1,
        pageNumSearch: 1
      },
      listLoading: false,
      // 试卷总数
      dataCount: 0,
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

    handleSizeChange(val) {
      this.page.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.fetchData()
    },
    /**
     * 分页查询数据字典数据
     */
    fetchData() {
      this.listLoading = true
      const params = {
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
    fetch() {
      this.page.pageNumSearch = 1
      this.fetchByName()
    },
    fetchByName() {
      this.listLoading = true
      const params = {
        name: this.formInline.name,
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNumSearch
      }
      selectByName(params).then(result => {
        const body = result.body
        this.dataList = body.categories.dataList
        this.dataCount = body.categories.dataCount
        this.listLoading = false
      })
    },
    queryData() {
      this.dataCount = this.categories.length
    },
    /**
       * 树结构的点击事件
       */
    handleNodeClick(data) {
      console.log(data)
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
    updateItem() {
      this.$router.push({
        name: 'UpdateCategory'
      })
    },
    /**
     * 对表格多选项进行判定，成则跳转至修改页面
     */
    updateCheck() {
      // eslint-disable-next-line eqeqeq
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
    deleteItem(id) {
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // eslint-disable-next-line no-unused-vars
          const idList = { idList: [id] }
          deleteList(idList).then(result => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchByName()
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
     * 对表格多选项进行判定，成功则删除
     */
    deleteCheck() {
      // eslint-disable-next-line eqeqeq
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除选项'
        })
      } else {
        // eslint-disable-next-line no-unused-vars
        const idList = { idList: [] }
        this.multipleSelection.forEach(item => {
          idList.idList.push(item.id)
        })
        console.log(idList)
        this.$confirm('是否要删除选定信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
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
