<template>
  <el-container>
    <!-- 左侧边栏 -->
    <el-aside width="180px">
      <!-- 树上方的信息 -->
      <el-container>
        <el-header>
          <el-row>
            <el-col>
              <h1 style="font-size:20px;" class="el-icon-menu">资源管理</h1>
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
            <!-- 资源名称输入框 -->
            <el-form-item label="资源名称:">
              <el-input v-model="formInline.resourceName" clearable size="mini" />
            </el-form-item>
            <!-- 资源等级下拉框 -->
            <el-form-item label="资源等级:">
              <el-select
                v-model="formInline.resourceLevels"
                filterable
                multiple
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="resource in resources"
                  :key="resource.level"
                  :value="resource.level"
                />
              </el-select>
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
          :data="resources"
          tooltip-effect="dark"
          stripe
          height
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="资源名称" />
          <el-table-column prop="code" label="资源编号" />
          <el-table-column prop="level" label="资源等级" sortable="true" />
          <el-table-column prop="parentName" label="上级资源" sortable="true" />
          <el-table-column prop="companyName" label="所属公司" />
          <el-table-column prop="master" label="负责人" />
          <el-table-column prop="status" label="是否启用" sortable="true" />
          <el-table-column label="操作" style="white-space:nowrap">
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
      treeData: [
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
        resourceName: '',
        resourceLevels: []
      },

      /**
       * 资源管理
       */
      resources: [
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '1',
          status: '启用',
          companyName: 'boss'
        },
        {
          name: '技术部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '5',
          status: '启用',
          companyName: 'boss'
        },
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '2',
          status: '不启用',
          companyName: 'boss'
        },
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '4',
          status: '启用',
          companyName: 'boss'
        },
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '3',
          status: '启用',
          companyName: 'boss'
        },
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '0',
          status: '启用',
          companyName: 'boss'
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
