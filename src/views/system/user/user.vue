<!-- 用户管理，只能维护当前组织机构的用户 -->
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
                <h1 style="font-size:15px;" class="el-icon-menu">用户管理</h1>
              </el-col>
            </el-row>
            <div class="horizon">
              <hr>
            </div>
          </el-header>
          <!-- 树 -->
          <el-main>
            <el-tree v-loading="loading" accordion :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
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
            <!-- 用户名称输入框 -->
            <el-form-item label="用户名称:">
              <el-input v-model="formInline.userName" clearable size="mini" />
            </el-form-item>
            <!-- 用户工号输入框 -->
            <el-form-item label="工号:">
              <el-input v-model="formInline.code" clearable size="mini" />
            </el-form-item>
            <!-- 用户手机号输入框 -->
            <el-form-item label="手机号:">
              <el-input v-model="formInline.tel" clearable size="mini" />
            </el-form-item>
            <!-- 角色下拉框 -->
            <el-form-item label="角色:">
              <el-select
                v-model="formInline.role"
                value-key="id"
                clearable
                filterable
                placeholder="请选择"
                size="mini"
              >
                <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role" />
              </el-select>
            </el-form-item>
            <!-- 查询按钮 -->
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
              @click="addUser"
            >增加</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteSelectedUser"
            >删除</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="updateSelectedUser"
            >修改</el-link>
            <!-- 角色分配按钮 -->
            <el-link
              class="itemAction"
              type="primary"
              icon="el-icon-user"
              @click="distributeRole"
            >角色分配</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="users"
            tooltip-effect="dark"
            stripe
            size="mini"
            fit
            style="width: 100%; margin-top: 10px;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="code" label="用户工号" align="center" />
            <el-table-column prop="departmentName" label="所属部门" align="center" />
            <el-table-column prop="companyName" label="所属公司" align="center" />
            <el-table-column prop="password" label="初始密码" align="center" />
            <el-table-column prop="name" label="用户名" align="center" />
            <el-table-column prop="roles" label="角色" align="center" />
            <el-table-column prop="sex" label="性别" align="center" />
            <el-table-column prop="birthday" label="生日" align="center" />
            <el-table-column prop="positionName" label="职位" align="center" />
            <el-table-column prop="tel" label="电话" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="other" label="其它/微信" width="105" align="center" />
            <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 1 ? 'primary' : 'info'"
                >{{ scope.row.status == 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130" align="center">
              <template slot-scope="{ row }">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addUser" />
                <el-link
                  class="itemAction"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteSpecificUser(row)"
                />
                <el-link
                  class="itemAction"
                  type="warning"
                  icon="el-icon-edit"
                  @click="updateUser(row)"
                />
              </template>
              <el-link
                class="itemAction"
                type="primary"
                icon="el-icon-user"
                @click="distributeRole"
              />
            </el-table-column>
          </el-table>
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
import { fetchUser, dropUser } from '@/api/system/user'
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
       * 所有角色的名称和ID
       */
      roles: [],

      /**
       * 查询字段
       */
      formInline: {
        userName: '',
        code: '',
        tel: '',
        role: ''
      },

      /**
       * 所有用户的信息
       */
      users: [],

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
      // 用户数据总数
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
      this.loading = true
      this.roles = []
      // 填入表单参数
      const params = {
        userName: this.formInline.userName,
        code: this.formInline.code,
        tel: this.formInline.tel,
        owingRoleId: this.formInline.role.id,
        pageSize: this.page.size,
        pageNum: this.page.pageNumber
      }
      console.log('this is params')
      console.log(params)
      fetchUser(params).then(result => {
        const body = result.body
        console.log('this is response data')
        console.log(body)
        // 转换树结构的数据
        const tree = body.tree.treeNodeList
        this.treeData = this.transDataToTree(tree)
        console.log('this is treeData')
        console.log(this.treeData)
        // 转换表格数据
        const users = []
        body.dataList.map(user => {
          user.roles = user.roles.join(',')
          users.push(user)
        })
        this.users = users
        console.log('this is table data')
        console.log(this.users)
        // 分页信息
        this.total = parseInt(body.dataCount)
        // 所有角色名称和id
        body.allPermittedRole.map(role => {
          this.roles.push(role)
        })
        // 加载动画
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
        const re = {
          label: element.name,
          id: element.id,
          children: null
        }
        return re
      } else {
        return {
          label: element.name,
          id: element.id,
          children: this.transDataToTree(element.childList)
        }
      }
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
    addUser() {
      this.$router.push({
        name: 'AddUser'
      })
    },

    /**
     * 跳转到修改界面
     */
    updateUser(row) {
      console.log('this is updating-data')
      console.log(row)
      this.$router.push({
        name: 'UpdateUser',
        params: {
          user: row
        }
      })
    },

    /**
     * 顶层的菜单栏事件函数
     */
    updateSelectedUser() {
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
        this.updateUser(this.multipleSelection[0])
      }
    },

    deleteSelectedUser() {
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
            this.deleteUser(params)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    deleteSpecificUser(row) {
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
          this.deleteUser(params)
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
    deleteUser(params) {
      console.log(params.idList)
      dropUser(params)
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
    },

    /**
     * 分配角色
     */
    distributeRole() {
      this.$router.push({
        name: 'DistributeRole'
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
