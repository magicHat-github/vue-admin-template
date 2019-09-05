<template>
  <div class="app-container allData">
    <!--查询框 -->
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="组织机构:">
          <el-input v-model="formInline.name" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 增删改按钮框 -->
    <el-card>
      <div>
        <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addOrg">增加</el-link>
        <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteSelectedOrg">删除</el-link>
        <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateSelectedOrg">修改</el-link>
      </div>
      <!-- 数据显示表单 -->
      <div>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="organizations"
          tooltip-effect="dark"
          style="width: 100%; margin-top: 10px;"
          stripe
          size="mini"
          fit
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="name" label="组织机构" width="120" align="center" />
          <el-table-column prop="code" label="机构代码" width="120" align="center" />
          <el-table-column prop="master" label="负责人" show-overflow-tooltip align="center" />
          <el-table-column prop="tel" label="电话" show-overflow-tooltip align="center" />
          <el-table-column prop="address" label="地址" show-overflow-tooltip align="center" />
          <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'primary' : 'info'"
              >{{ scope.row.status == 1 ? "是" : "否" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-link class="itemAction" size="mini" type="primary" icon="el-icon-plus" @click="addOrg" />
              <el-link
                class="itemAction"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteSpecificOrg(scope.row)"
              />
              <el-link
                class="itemAction"
                size="mini"
                type="warning"
                icon="el-icon-edit"
                @click="updateOrg(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页部分 -->
      <div class="block">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="page.pageNumber"
          :limit.sync="page.size"
          @pagination="queryData"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入分页组件
import Pagination from '@/components/Pagination'
import { queryOrg, deleteOrg } from '@/api/system/org'

// import { log } from 'util'
export default {
  name: 'App',
  components: { Pagination },
  data() {
    return {
      /**
			 * 查询字段
			 */
      formInline: {
        name: ''
      },

      /**
			 * 组织管理
			 */
      organizations: [],

      /**
			 * 待确认字段
			 */
      multipleSelection: [],
      /**
			 * 默认的分页的页面数据
			 */
      page: {
        size: 5,
        pageNumber: 1
      },
      // 组织机构数据总数
      total: 0,
      loading: true
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    /**
		 * 查询数据
		 */
    queryData() {
      console.log(this.formInline.name)
      const params = {
        orgName: this.formInline.name,
        pageSize: this.page.size,
        pageNum: this.page.pageNumber
      }
      console.log(params)
      queryOrg(params).then(result => {
        const body = result.body
        // 转换树结构的数据
        console.log('this is result')
        console.log(body)
        // 转换表格数据
        this.organizations = body.dataList
        // 分页信息
        this.total = parseInt(body.dataCount)
      }).catch(err => {
        console.log(err)
      })
      this.total = this.organizations.length
      this.loading = false
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
    addOrg() {
      this.$router.push({
        name: 'AddOrg'
      })
    },

    /**
		 * 跳转到更新界面
		 */
    updateOrg(row) {
      this.$router.push({
        name: 'UpdateOrg',
        params: {
          org: row
        }
      })
    },
    /**
		 * 顶层的菜单栏更新事件函数
		 */
    updateSelectedOrg() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择要操作对象!'
        })
      }
      if (this.multipleSelection.length > 1) {
        this.$message({
          type: 'info',
          message: '请选择单个对象!'
        })
      }
      if (this.multipleSelection.length === 1) {
        this.$router.push({
          name: 'UpdateOrg',
          params: {
            org: this.multipleSelection[0]
          }
        })
      }
    },
    /**
     * 删除选中组织机构
     */
    deleteSelectedOrg() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择要操作对象!'
        })
      }
      if (this.multipleSelection.length > 0) {
        this.$confirm('是否要删除选定信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const params = {
              dataList: []
            }
            this.multipleSelection.forEach(item => {
              const deleteData = {
                id: item.id,
                version: item.version
              }
              params.dataList.push(deleteData)
            })
            this.deleteOrg(params)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    deleteSpecificOrg(row) {
      console.log(row)
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            dataList: []
          }
          const deleteData = {
            id: row.id,
            version: row.version
          }
          params.dataList.push(deleteData)
          this.deleteOrg(params)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 删除信息
     */
    deleteOrg(params) {
      console.log(params.idList)
      deleteOrg(params)
        .then(result => {
          this.$message(result.head.msg)
          this.queryData()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: `错误${err}`
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
