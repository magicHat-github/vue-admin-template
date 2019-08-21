<template>
  <el-container>
    <el-card class="aside">
      <!-- 左侧边栏 -->
      <el-aside width="120px">
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
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
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
              <el-input v-model="formInline.userCode" clearable size="mini" />
            </el-form-item>
            <!-- 用户手机号输入框 -->
            <el-form-item label="手机号:">
              <el-input v-model="formInline.tel" clearable size="mini" />
            </el-form-item>
            <!-- 角色下拉框 -->
            <el-form-item label="角色:">
              <el-select
                v-model="formInline.roles"
                filterable
                multiple
                placeholder="请选择"
                size="mini"
              >
                <el-option v-for="user in users" :key="user.role" :value="user.role" />
              </el-select>
            </el-form-item>
            <!-- 查询按钮 -->
            <el-form-item>
              <el-button size="mini" type="primary">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card>
          <!-- 增删改按钮框 -->
          <div>
            <el-link class="itemAction" size="mini" type="primary" icon="el-icon-plus" @click="addUser">增加</el-link>
            <el-link class="itemAction" size="mini" type="danger" icon="el-icon-delete" @click="deleteUser">删除</el-link>
            <el-link class="itemAction" size="mini" type="warning" icon="el-icon-edit" @click="updateSelectedUser">修改</el-link>
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
            <el-table-column prop="password" label="初始密码" align="center" />
            <el-table-column prop="name" label="用户名" align="center" />
            <el-table-column prop="role" label="角色" align="center" />
            <el-table-column prop="sex" label="性别" align="center" />
            <el-table-column prop="birthday" label="生日" align="center" />
            <el-table-column prop="position" label="职位" align="center" />
            <el-table-column prop="tel" label="电话" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="other" label="其它/微信" width="105" align="center" />
            <el-table-column prop="status" label="是否启用" sortable="true" width="110" align="center" />
            <el-table-column label="操作" width="130" align="center">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addUser" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteUser" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateUser(scope.row)" />
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
              @click="queryData"
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
// import { log } from 'util'
export default {
  name: 'App',
  components: { Pagination },
  data() {
    return {
      /**
       * 树结构数据
       */
      treeData: [
        {
          label: '组织机构 1',
          children: [
            {
              label: '公司 1-1'
            }
          ]
        },
        {
          label: '组织机构 2',
          children: [
            {
              label: '公司 2-1'
            },
            {
              label: '公司 2-2'
            }
          ]
        },
        {
          label: '组织机构 3',
          children: [
            {
              label: '公司 3-1',
              children: [
                {
                  label: '这是假数据 3-1-1'
                }
              ]
            },
            {
              label: '公司 3-2',
              children: [
                {
                  label: '这是假数据 3-2-1'
                }
              ]
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
        userName: '',
        userCode: '',
        tel: '',
        roles: []
      },

      /**
       * 用户管理
       */
      users: [
        {
          code: '9527',
          password: '123456',
          name: '傻瓜许林瑜',
          role: '鼓励师',
          sex: '男',
          birthday: '1949-10-01',
          position: '码农',
          tel: '13000000000',
          email: 'test@test.com',
          other: '无',
          status: '启用'
        },
        {
          code: '9527',
          password: '123456',
          name: '傻瓜许林瑜',
          role: '鼓励师',
          sex: '男',
          birthday: '1949-10-01',
          position: '码农',
          tel: '13000000000',
          email: 'test@test.com',
          other: '无',
          status: '启用'
        },
        {
          code: '9527',
          password: '123456',
          name: '傻瓜许林瑜',
          role: '鼓励师',
          sex: '男',
          birthday: '1949-10-01',
          position: '码农',
          tel: '13000000000',
          email: 'test@test.com',
          other: '无',
          status: '启用'
        },
        {
          code: '9527',
          password: '123456',
          name: '傻瓜许林瑜',
          role: '鼓励师',
          sex: '男',
          birthday: '1949-10-01',
          position: '码农',
          tel: '13000000000',
          email: 'test@test.com',
          other: '无',
          status: '启用'
        },
        {
          code: '9527',
          password: '123456',
          name: '傻瓜许林瑜',
          role: '鼓励师',
          sex: '男',
          birthday: '1949-10-01',
          position: '码农',
          tel: '13000000000',
          email: 'test@test.com',
          other: '无',
          status: '启用'
        },
        {
          code: '9527',
          password: '123456',
          name: '傻瓜许林瑜',
          role: '鼓励师',
          sex: '男',
          birthday: '1949-10-01',
          position: '码农',
          tel: '13000000000',
          email: 'test@test.com',
          other: '无',
          status: '启用'
        }
      ],

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
      // 试卷总数
      total: 0
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
      this.total = this.users.length
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

    updateUser(row) {
      this.$router.push({
        name: 'UpdateUser',
        params: {
          'row': row
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
        this.$router.push({
          name: 'UpdateUser',
          params: {
            'row': this.multipleSelection[0]
          }
        })
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
        this.deleteUser()
      }
    },

    /**
     * 删除信息
     */
    deleteUser() {
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
