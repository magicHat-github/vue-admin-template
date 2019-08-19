<template>
  <el-container>
    <el-card class="tableData">
      <!-- 左侧边栏 -->
      <el-aside width="180px">
        <!-- 树上方的信息 -->
        <el-container>
          <el-header>
            <el-row>
              <el-col>
                <h1 style="font-size:20px;" class="el-icon-menu">题目类别</h1>
              </el-col>
            </el-row>
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
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- 组织机构下拉框 -->
            <el-form-item label="题目类别:">
              <el-select
                v-model="formInline.name"
                filterable
                multiple
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="category in categories"
                  :key="category.name"
                  :value="category.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-card class="tableData">
          <!-- 增删改按钮框 -->
          <div>
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto">增加</el-link>
            <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="delete1">删除</el-link>
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="update1">修改</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-upload2" @click="update1">导入</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-download" @click="update1">导出</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            :data="categories"
            tooltip-effect="dark"
            stripe
            height
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="题目类别" />
            <el-table-column prop="remark" label="备注" show-overflow-tooltip />
            <el-table-column prop="updatedTime" label="更新时间" />
            <el-table-column prop="status" label="是否启用" sortable="true" />
            <el-table-column label="操作">
              <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
              <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="update1" />
              <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="delete1" />
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
        </el-card>
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
        categoryName: '',
        organizationNames: []
      },

      /**
         * 公司管理
         */
      categories: [
        {
          name: '腾讯',
          categoryId: '001',
          remark: '腾讯',
          updatedTime: '2019/8/19',
          status: '启用'
        },
        {
          name: '阿里',
          categoryId: '002',
          remark: '腾讯',
          updatedTime: '2019/8/19',
          status: '不启用'
        }
        // {
        //   name: '百度',
        //   categoryId: '003',
        //   remark: '腾讯sd',
        //   updatedTime: '2019/8/19',
        //   status: ' 启用'
        // },
        // {
        //   name: '百度',
        //   categoryId: '003',
        //   remark: '腾讯',
        //   updatedTime: '2019/8/19',
        //   status: ' 启用'
        // },
        // {
        //   name: '百度',
        //   categoryId: '003',
        //   remark: '腾讯',
        //   updatedTime: '2019/8/19',
        //   status: ' 启用'
        // },
        // {
        //   name: '百度',
        //   categoryId: '003',
        //   remark: '腾讯',
        //   updatedTime: '2019/8/19',
        //   status: ' 启用'
        // },
        // {
        //   name: '百度',
        //   categoryId: '003',
        //   remark: '腾讯',
        //   updatedTime: '2019/8/19',
        //   status: ' 启用'
        // }
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
        name: 'AddCategory'
      })
    },
    update1() {
      this.$router.push({
        name: 'UpdateCategory'
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
