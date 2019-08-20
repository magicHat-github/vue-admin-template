<template>
  <el-container>
    <el-card>
      <!-- 左侧边栏 -->
      <el-aside width="160px">
        <!-- 树上方的信息 -->
        <el-container>
          <el-header>
            <el-row>
              <el-col>
                <h1 style="font-size:20px;" class="el-icon-menu">部门管理</h1>
              </el-col>
            </el-row>
            <hr>
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
            <!-- 部门名称输入框 -->
            <el-form-item label="部门名称:">
              <el-input v-model="formInline.departmentName" clearable size="mini" />
            </el-form-item>
            <!-- 部门等级下拉框 -->
            <el-form-item label="部门等级:">
              <el-select v-model="formInline.departmentLevels" placeholder="请选择" size="mini">
                <el-option
                  v-for="department in departments"
                  :key="department.level"
                  :value="department.level"
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
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addDepartment">增加</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="deleteDepartment">删除</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="updateDepartment">修改</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            :border="true"
            :data="departments"
            tooltip-effect="dark"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="部门名称" align="center" />
            <el-table-column prop="code" label="部门编号" align="center" />
            <el-table-column prop="level" label="部门等级" sortable="true" align="center" />
            <el-table-column prop="parentName" label="上级部门" sortable="true" align="center" />
            <el-table-column prop="companyName" label="所属公司" align="center" />
            <el-table-column prop="master" label="负责人" align="center" />
            <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" style="white-space:nowrap" width="110" align="center">
              <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addDepartment" />
              <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="deleteDepartment" />
              <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="updateDepartment" />
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
          label: '公司 1',
          children: [
            {
              label: '部门 1-1'
            }
          ]
        },
        {
          label: '公司 2',
          children: [
            {
              label: '部门 2-1'
            },
            {
              label: '部门 2-2'
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
        departmentName: '',
        departmentLevels: []
      },

      /**
       * 部门管理
       */
      departments: [
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '1',
          status: '是',
          companyName: 'boss'
        },
        {
          name: '技术部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '5',
          status: '是',
          companyName: 'boss'
        },
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '2',
          status: '否',
          companyName: 'boss'
        },
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '4',
          status: '是',
          companyName: 'boss'
        },
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '3',
          status: '是',
          companyName: 'boss'
        },
        {
          name: '人资部',
          parentName: 'parentDep',
          code: 'hrCode',
          master: 'hrMaster',
          level: '0',
          status: '是',
          companyName: 'boss'
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
      this.total = this.departments.length
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
    addDepartment() {
      this.$router.push({
        name: 'addDepartment'
      })
    },
    updateDepartment() {
      this.$router.push({
        name: 'updateDepartment'
      })
    },

    /**
     * 删除信息
     */
    deleteDepartment() {
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
