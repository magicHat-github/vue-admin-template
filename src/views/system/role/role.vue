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
                <h1 style="font-size:15px;" class="el-icon-menu">角色管理</h1>
              </el-col>
            </el-row>
            <div class="horizon">
              <hr />
            </div>
          </el-header>
          <!-- 树 -->
          <el-main>
            <el-tree :data="organizationTreeVO" :props="defaultProps" @node-click="handleNodeClick" />
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
            <!-- 角色名称输入框 -->
            <el-form-item label="角色名称:">
              <el-input v-model="formInline.roleName" clearable size="mini" />
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
            <el-link
              class="itemAction"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addRole"
            >增加</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteSelectedRole"
            >删除</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="updateSelectedRole"
            >修改</el-link>
            <!-- 资源分配按钮 -->
            <el-link
              class="itemAction"
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="distributeResource = true"
            >资源分配</el-link>
            <el-dialog title="为角色分配资源" :visible.sync="distributeResource">
              <!-- 角色的资源树 -->
              <el-tree
                :data="resourceTreeVO"
                show-checkbox
                default-expand-all
                ref="resourceTree"
                node-key="id"
                highlight-current
                :default-checked-keys="[5]"
                :props="defaultProps"
              ></el-tree>
              <div slot="footer" class="dialog-footer">
                <el-button @click="distributeResource = false">取 消</el-button>
                <el-button type="primary" @click="distributeResource = false">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 用户分配按钮 -->
            <el-link
              class="itemAction"
              type="primary"
              icon="el-icon-user"
              @click="distributeUser"
            >用户分配</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            :data="roles"
            tooltip-effect="dark"
            stripe
            style="width: 100%; margin-top: 10px;"
            size="mini"
            fit
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="角色" align="center" />
            <el-table-column prop="code" label="角色代号" align="center" />
            <el-table-column prop="remark" label="角色备注" show-overflow-tooltip align="center" />
            <el-table-column prop="companyName" label="所属公司" align="center" />
            <el-table-column prop="organizationName" label="所属机构" align="center" />
            <el-table-column prop="status" label="是否启用" sortable="true" align="center" />
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addRole" />
                <el-link
                  class="itemAction"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRole"
                />
                <el-link
                  class="itemAction"
                  type="warning"
                  icon="el-icon-edit"
                  @click="updateRole(scope.row)"
                />
                <el-link
                  class="itemAction"
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  @click="distributeResource = true"
                />
                <el-link
                  class="itemAction"
                  type="primary"
                  icon="el-icon-user"
                  @click="distributeUser"
                />
              </template>
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
      organizationTreeVO: [
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
       * 资源树数据（为角色分配资源时弹出）
       */
      resourceTreeVO: [
        {
          label: '资源树 1',
          children: [
            {
              label: '资源 1-1'
            }
          ]
        },
        {
          label: '资源树 2',
          children: [
            {
              label: '资源 2-1'
            },
            {
              label: '资源 2-2'
            }
          ]
        }
      ],

      /**
       * 查询字段
       */
      formInline: {
        roleName: ''
      },

      /**
       * 角色管理
       */
      roles: [
        {
          name: 'name1',
          code: 'code1',
          remark: '傻瓜许林瑜',
          companyName: '福报厂',
          organizationName: '码农基地',
          status: '启用'
        },
        {
          name: 'name1',
          code: 'code1',
          remark: '傻瓜许林瑜',
          companyName: '福报厂',
          organizationName: '码农基地',
          status: '启用'
        },
        {
          name: 'name1',
          code: 'code1',
          remark: '傻瓜许林瑜',
          companyName: '福报厂',
          organizationName: '码农基地',
          status: '启用'
        },
        {
          name: 'name1',
          code: 'code1',
          remark: '傻瓜许林瑜',
          companyName: '福报厂',
          organizationName: '码农基地',
          status: '启用'
        },
        {
          name: 'name1',
          code: 'code1',
          remark: '傻瓜许林瑜',
          companyName: '福报厂',
          organizationName: '码农基地',
          status: '启用'
        }
      ],

      /**
       * 待确认字段
       */
      multipleSelection: [],

      /**
       *  资源分配和角色分配
       */
      distributeResource: false,
      formLabelWidth: '120px',
      resourceDestribution: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },

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
      this.total = this.roles.length
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
    addRole() {
      this.$router.push({
        name: 'AddCompany'
      })
    },
    updateRole(row) {
      this.$router.push({
        name: 'update',
        params: {
          row: row
        }
      })
    },
    /**
     * 顶层的菜单栏事件函数
     */
    updateSelectedRole() {
      if (this.multipleSelection.length == 0) {
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
      if (this.multipleSelection.length == 1) {
        this.$router.push({
          name: 'UpdateOrg',
          params: {
            row: this.multipleSelection[0]
          }
        })
      }
    },

    deleteSelectedRole() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: 'info',
          message: '请选择要操作对象!'
        })
      }
      if (this.multipleSelection.length > 0) {
        this.deleteRole()
      }
    },

    /**
     * 删除信息
     */
    deleteRole() {
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
     * 分配用户
     */
    distributeUser() {
      this.$router.push({
        name: 'DistributeUser'
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
