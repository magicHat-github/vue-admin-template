<template>
  <el-container>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="题目类型:">
              <el-input v-model="formInline.typeName" clearable size="mini" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="queryData">查询</el-button>
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
            :data="typeList"
            tooltip-effect="dark"
            stripe
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="题目类型" sortable="true">
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
          <div class="block">
            <pagination
              v-show="dataCount>0"
              :total="dataCount"
              :page.sync="page.pageNum"
              :limit.sync="page.pageSize"
              @pagination="queryData"
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
import { select, deleteList, selectById } from '@/api/basedata/type'
export default {
  name: 'App',
  components: { Pagination },
  data() {
    return {
      /**
       * 题型数据List
       */
      typeList: null,
      listLoading: false,
      /**
         * 查询字段
         */
      formInline: {
        typeName: ''
      },
      page: {
        pageSize: 5,
        pageNum: 1
      },
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
    this.queryData()
  },
  methods: {
    /**
     * 查询题型数据
     */
    queryData() {
      this.listLoading = true
      const params = {
        name: this.formInline.typeName,
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      select(params).then(result => {
        const body = result.body
        this.typeList = body.dataList
        this.dataCount = parseInt(body.dataCount)
        this.listLoading = false
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
        selectById(this.multipleSelection.pop().id).then(result => {
          const body = result.body
          console.log(body)
          this.$router.push({
            name: 'UpdateType',
            params: {
              id: body.id,
              name: body.name,
              status: body.status,
              version: body.version,
              remark: body.remark
            }
          })
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '系统错误!'
          })
        })
      }
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
        name: 'AddType'
      })
    },
    updateItem(id) {
      selectById(id).then(result => {
        const body = result.body
        console.log(body)
        this.$router.push({
          name: 'UpdateType',
          params: {
            id: body.id,
            name: body.name,
            status: body.status,
            version: body.version,
            remark: body.remark
          }
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '系统错误!'
        })
      })
    },

    /**
       * 删除信息
       */
    deleteItem(id, version) {
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
            this.queryData()
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
    }
  }
}
</script>

<style>
  .itemAction {
    margin-right: 10px;
  }
</style>
