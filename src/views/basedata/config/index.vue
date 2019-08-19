<template>
  <el-container>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="组卷配置项标题:">
              <el-input v-model="formInline.companyName" clearable size="mini" />
            </el-form-item>
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
          border="true"
          :data="companys"
          tooltip-effect="dark"
          stripe
          height
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="配置项" />
          <el-table-column prop="website" label="难度" />
          <el-table-column prop="website" label="修改人" />
          <el-table-column prop="website" label="修改时间" />
          <el-table-column prop="status" label="启用标志" sortable="true" />
          <el-table-column prop="website" label="公司" />
          <el-table-column prop="website" label="备注" />
          <el-table-column label="操作">
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
            <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="update1" />
            <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="delete1" />
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
          <el-table-column prop="name" label="序号" />
          <el-table-column prop="name" label="题目类别" />
          <el-table-column prop="website" label="题型" />
          <el-table-column prop="website" label="题目数量" />
          <el-table-column prop="website" label="题目难度" />
          <el-table-column prop="status" label="题目分值" />
          <el-table-column label="操作">
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
            <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="update1" />
            <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="delete1" />
          </el-table-column>
        </el-table>
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
        companyName: '',
        organizationNames: []
      },

      /**
         * 公司管理
         */
      companys: [
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: '启用'
        },
        {
          name: '阿里',
          code: '002',
          mnemonicCode: '亏钱的濒危企业',
          master: '马云',
          organizationName: '中国',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: '不启用'
        },
        {
          name: '百度',
          code: '003',
          mnemonicCode: '不接广告的搜索引擎',
          master: '李红艳',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
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
    }
  }
}
</script>

<style>
  .itemAction {
    margin-right: 10px;
  }
</style>
