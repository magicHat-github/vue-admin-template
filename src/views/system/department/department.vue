<template>
  <el-container>
    <el-card class="aside">
      <!-- 左侧边栏 -->
      <el-aside width="140px">
        <!-- 树上方的信息 -->
        <el-container>
          <el-header>
            <el-row>
              <el-col>
                <h1 style="font-size:15px;" class="el-icon-menu">部门管理</h1>
              </el-col>
            </el-row>
            <div class="horizon">
              <hr>
            </div>
          </el-header>
          <!-- 树 -->
          <el-main>
            <el-tree
              v-loading="loading"
              accordion
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
            />
          </el-main>
        </el-container>
      </el-aside>
    </el-card>

    <!-- 主体部分 -->
    <el-main>
      <div>
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- 部门名称输入框 -->
            <el-form-item label="部门名称:">
              <el-input v-model="formInline.departmentName" clearable size="mini" />
            </el-form-item>
            <!-- 部门等级下拉框 -->
            <el-form-item label="部门等级:">
              <el-select v-model="formInline.level" placeholder="请选择" size="mini">
                <el-option
                  v-for="department in formInline.departmentLevels"
                  :key="department"
                  :value="department"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="queryData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card>
          <!-- 增删改按钮框 -->
          <div>
            <el-link
              class="itemAction"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addDepartment"
            >增加</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteSelectedDepartment"
            >删除</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="updateSelectedDepartment"
            >修改</el-link>
          </div>

          <!-- 数据显示表单 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="departments"
              tooltip-effect="dark"
              stripe
              style="width: 100%; margin-top: 10px;"
              fit
              size="mini"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="name" label="部门名称" align="center" />
              <el-table-column prop="code" label="部门编号" align="center" />
              <el-table-column prop="level" label="部门等级" align="center" />
              <el-table-column prop="parentName" label="上级部门" align="center" />
              <el-table-column prop="companyName" label="所属公司" align="center" />
              <el-table-column prop="master" label="负责人" align="center" />
              <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.status === 1 ? 'primary' : 'info'"
                  >{{ scope.row.status == 1 ? "是" : "否" }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" style="white-space:nowrap" width="110" align="center">
                <template slot-scope="scope">
                  <el-link
                    class="itemAction"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addDepartment"
                  />
                  <el-link
                    class="itemAction"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteSpecificDepartment(scope.row)"
                  />
                  <el-link
                    class="itemAction"
                    type="warning"
                    icon="el-icon-edit"
                    @click="updateDepartment(scope.row)"
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
    </el-main>
  </el-container>
</template>

<script>
// 引入分页组件
import Pagination from '@/components/Pagination'
// 引入方法
import { queryDepartment, deleteDepartment } from '@/api/system/department'
// import { log } from 'util'
export default {
  name: 'App',
  components: { Pagination },
  data() {
    return {
      /**
       * 树结构数据
       */
      treeData: [],
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
        departmentName: '',
        level: '',
        departmentLevels: ['', 1, 2, 3, 4, 5]
      },

      /**
       * 部门管理的表单数据
       */
      departments: [],

      /**
       * 多选被选中的数组字段
       */
      multipleSelection: [],

      /**
       * 默认的分页的页面数据
       */
      page: {
        size: 5,
        pageNumber: 1
      },
      // 试卷总数
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
      const params = {
        departmentName: this.formInline.departmentName,
        level: this.formInline.level,
        pageSize: this.page.size,
        pageNum: this.page.pageNumber
      }
      queryDepartment(params).then(result => {
        const body = result.body
        // 转换树结构的数据
        console.log(body)
        const tree = body.tree.treeNodeList
        this.treeData = this.transDataToTree(tree)
        console.log('this is result')
        console.log(this.treeData)
        // 转换表格数据
        this.departments = body.dataList
        console.log('this is table data')
        console.log(this.companys)
        // 分页信息
        console.log(body.dataCount)
        this.total = parseInt(body.dataCount)
        this.loading = false
      })
    },
    /**
     * 查询树结构的方法
     */
    transDataToTree(arr) {
      return arr.map(element => {
        return this.getChildren(element)
      })
    },
    /**
     * 查询树结构的方法
     */
    getChildren(element) {
      if (!element.childList) {
        console.log('this is recall')
        console.log(element)
        const re = {
          label: element.name,
          id: element.id,
          children: null
        }
        return re
      } else {
        console.log('this is call')
        console.log(element)
        return {
          label: element.name,
          id: element.id,
          children: this.transDataToTree(element.childList)
        }
      }
    },

    /**
     * 勾选事件触发的函数
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
     * 树结构的点击事件
     */
    handleNodeClick(data) {
      console.log(data)
    },

    /**
     * 跳转到增加界面
     */
    addDepartment() {
      this.$router.push({
        name: 'AddDepartment'
      })
    },
    /**
		 * 跳转到更新界面
		 */
    updateDepartment(row) {
      this.$router.push({
        name: 'UpdateDepartment',
        params: {
          row: row
        }
      })
    },
    /**
     * 顶层的菜单栏更新事件函数
     */
    updateSelectedDepartment() {
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
          name: 'UpdateDepartment',
          params: {
            row: this.multipleSelection[0]
          }
        })
      }
    },

    /**
     * 删除选中组织机构
     */
    deleteSelectedDepartment() {
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
            this.deleteDepartment(params)
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
     * 删除指定部门
     */
    deleteSpecificDepartment(row) {
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
          this.deleteDepartment(params)
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
    deleteDepartment(params) {
      console.log(params.idList)
      deleteDepartment(params)
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
.aside .el-card__body .el-main {
  padding-left: 7px;
}
.aside .el-card__body .el-header {
  padding: 5px;
}
.aside .el-card__body .el-header .el-row {
  padding: 0px 15px;
}
</style>
