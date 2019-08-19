<template>
  <el-container>
    <!-- 左侧边栏 -->
    <el-aside width="180px">
      <!-- 树上方的信息 -->
      <el-container>
        <el-header>
          <el-row>
            <el-col>
              <h1 style="font-size:20px;" class="el-icon-menu">角色管理</h1>
            </el-col>
          </el-row>
        </el-header>
        <!-- 树 -->
        <el-main>
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
        </el-main>
      </el-container>
    </el-aside>

    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
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

        <!-- 增删改按钮框 -->
        <div>
          <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto">增加</el-link>
          <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="delete1">删除</el-link>
          <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="update1">修改</el-link>
          <!-- 资源分配按钮 -->
          <el-link
            class="itemAction"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="distributeResource = true"
          >资源分配</el-link>
          <el-dialog title="为角色分配资源" :visible.sync="distributeResource">
            <el-form :model="resourceDestribution">
              <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-input v-model="resourceDestribution.name" autocomplete="off" />
              </el-form-item>
              <el-form-item label="活动区域" :label-width="formLabelWidth">
                <el-select v-model="resourceDestribution.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>
            </el-form>
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
          border="true"
          :data="companys"
          tooltip-effect="dark"
          stripe
          height
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="角色" />
          <el-table-column prop="code" label="角色代号" />
          <el-table-column prop="remark" label="角色备注" show-overflow-tooltip />
          <el-table-column prop="companyName" label="所属公司" />
          <el-table-column prop="organizationName" label="所属机构" />
          <el-table-column prop="status" label="是否启用" sortable="true" />
          <el-table-column label="操作">
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
            <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="delete1" />
            <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="update1" />
            <el-link
              class="itemAction"
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="distributeResource = true"
            />
            <el-link class="itemAction" type="primary" icon="el-icon-user" @click="distributeUser" />
          </el-table-column>
        </el-table>
        <!-- 分页部分 -->
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage1"
            :page-size="70"
            layout="prev, pager, next, jumper"
            :total="1000"
          />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
// import { log } from 'util'
export default {
  name: 'App',
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
       * 角色管理
       */
      companys: [
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
       * 初始显示的页数
       */
      currentPage1: 1,
      currentPage2: 2,
      currentPage3: 3,
      currentPage4: 4,
      dynamicTags: ['标签一', '标签二', '标签三'],

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
      }
    }
  },

  methods: {
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
        name: 'AddCompany'
      })
    },
    update1() {
      this.$router.push({
        name: 'update'
      })
    },

    /**
     * 删除信息
     */
    delete1() {
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
</style>
