<template>
  <el-container>
    <!-- 左侧树 -->
    <el-aside width="200px">
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="8">
              <i class="el-icon-edit"></i>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">公司管理</div>
            </el-col>
            <el-col :span="8">
              <el-button icon="el-icon-refresh-left" circle></el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-main>
      </el-container>
    </el-aside>

    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- 公司名称输入框 -->
            <el-form-item label="公司名称:">
              <el-input v-model="formInline.companyName" size="mini" />
            </el-form-item>
            <!-- 组织机构下拉框 -->
            <el-dropdown>
              <el-button size="small" type="primary">
                {{ formInline.orgName }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        </div>
        <!-- 数据显示表单 -->
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="company" label="姓名" width="120" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
          <el-table-column prop="status" label="是否启用" show-overflow-tooltip />
          <el-table-column label="操作">
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
            <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="delete1" />
            <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="update1" />
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
      data: [
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
        companyName: '',
        orgName: ''
      },

      /**
       * 职位管理
       */
      tableData3: [
        {
          company: '腾讯',
          name: 'CEO',
          remark: 'xly是懒猪',
          status: '0'
        },
        {
          company: '阿里巴巴',
          name: '执行总裁',
          remark: '福报厂',
          status: '0'
        },
        {
          company: '博思软件',
          name: '软件研发工程师',
          remark: ' 史上最苦命打工仔',
          status: '1'
        },
        {
          company: '博思软件',
          name: '软件研发工程师',
          remark: ' 史上最苦命打工仔',
          status: '1'
        },
        {
          company: '博思软件',
          name: '软件研发工程师',
          remark: ' 史上最苦命打工仔',
          status: '1'
        },
        {
          company: '博思软件',
          name: '软件研发工程师',
          remark: ' 史上最苦命打工仔',
          status: '1'
        },
        {
          company: '博思软件',
          name: '软件研发工程师',
          remark: ' 史上最苦命打工仔',
          status: '1'
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
      dynamicTags: ['标签一', '标签二', '标签三']
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
        name: 'Add'
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
    }
  }
}
</script>

<style>
.itemAction {
  margin-right: 10px;
}
</style>
