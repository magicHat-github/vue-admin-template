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
                <h1 style="font-size:15px;" class="el-icon-menu">分配角色</h1>
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
            <!-- 角色名称输入框 -->
            <el-form-item label="角色名称:">
              <el-input v-model="formInline.userName" clearable size="mini" />
            </el-form-item>
            <!-- 查询按钮 -->
            <el-form-item>
              <el-button size="mini" type="primary" @click="queryData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card>
          <!-- 分配用户按钮 -->
          <div>
            <el-link
              class="itemAction"
              type="primary"
              icon="el-icon-user"
              size="mini"
              @click="distributeFromSelectedRole"
            >将选定角色分配给用户</el-link>
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
            <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.leaf == 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <el-link
                class="itemAction"
                type="primary"
                icon="el-icon-user"
                @click="distributeFromRole"
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
        roleName: ''
      },

      /**
       * 用户管理
       */
      roles: [
        {
          code: '9527',
          name: '傻瓜许林瑜',
          remark: '备注',
          companyName: '公司',
          organizationName: '组织机构',
          status: '0'
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
     * 为用户分配角色
     */
    distributeFromRole() {
      this.$confirm('为选定用户分配角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '分配成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消分配'
          })
        })
    },
    /**
     * 顶层的菜单栏的分配事件函数
     */
    distributeFromSelectedRole() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择待分配角色!'
        })
      }
      if (this.multipleSelection.length > 1) {
        this.$message({
          type: 'info',
          message: '请选择单个角色!'
        })
      }
      if (this.multipleSelection.length === 1) {
        this.distributeFromRole()
      }
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
