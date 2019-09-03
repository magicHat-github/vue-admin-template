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
                <h1 style="font-size:15px;" class="el-icon-menu">资源管理</h1>
              </el-col>
            </el-row>
            <div class="horizon">
              <hr>
            </div>
          </el-header>
          <!-- 树 -->
          <el-main>
            <el-tree
              v-loading="loading"
              accordion
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
            />
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
            <!-- 节点名称输入框 -->
            <el-form-item label="节点名称:">
              <el-select
                v-model="formInline.resourceName"
                filterable
                clearable
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="name in resourceNames"
                  :key="name"
                  :value="name"
                />
              </el-select>
            </el-form-item>
            <!-- 父亲节点下拉框 -->
            <el-form-item label="父亲节点:">
              <el-select
                v-model="formInline.parentName"
                filterable
                clearable
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="name in parentResourceNames"
                  :key="name"
                  :value="name"
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
            <el-link
              class="itemAction"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addResource"
            >增加</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteSelectedResource"
            >删除</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="updateSelectedResource"
            >修改</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="resources"
            tooltip-effect="dark"
            stripe
            style="width: 100%; margin-top: 10px;"
            size="mini"
            fit
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="节点名称" align="center" />
            <el-table-column prop="code" label="编号" align="center" />
            <el-table-column prop="parentName" label="父亲节点" sortable="true" align="center" />
            <el-table-column prop="url" label="URL" show-overflow-tooltip align="center" />
            <el-table-column prop="resourceType" label="资源类型" sortable="true" align="center" />
            <el-table-column prop="openImg" label="打开图标" align="center" />
            <el-table-column prop="closeImg" label="关闭图标" align="center" />
            <el-table-column class-name="status-col" label="是否叶节点" width="110" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.leaf === 1 ? 'primary' : 'info'"
                >{{ scope.row.leaf == 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 1 ? 'primary' : 'info'"
                >{{ scope.row.status == 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" style="white-space:nowrap" width="110" align="center">
              <template slot-scope="{ row }">
                <el-link
                  class="itemAction"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addResource"
                />
                <el-link
                  class="itemAction"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteSpecificResource(row)"
                />
                <el-link
                  class="itemAction"
                  type="warning"
                  icon="el-icon-edit"
                  @click="updateResource(row)"
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
import { fetchResource, dropResource } from '@/api/system/resource'
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
       * 所有资源的名称
       */
      resourceNames: [],

      /**
       * 所有资源的名称
       */
      parentResourceNames: [],

      /**
       * 查询字段
       */
      formInline: {
        resourceName: '',
        parentName: ''
      },

      /**
       * 资源管理
       */
      resources: [],

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
      // 资源总数
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
      this.resourceNames = []
      this.parentResourceNames = []
      const params = {
        resourceName: this.formInline.resourceName,
        parentName: this.formInline.parentName,
        pageSize: this.page.size,
        pageNum: this.page.pageNumber
      }
      fetchResource(params).then(result => {
        const body = result.body
        // 转换树结构的数据
        console.log(body.tree)
        const tree = body.tree.treeNodeList
        this.treeData = this.transDataToTree(tree)
        console.log('this is treeData')
        console.log(this.treeData)
        // 转换表格数据
        this.resources = body.dataList
        console.log('this is table data')
        console.log(this.resources)
        // 分页信息
        console.log(body.dataCount)
        this.total = parseInt(body.dataCount)
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
        this.resourceNames.push(element.name)
        return re
      } else {
        this.resourceNames.push(element.name)
        this.parentResourceNames.push(element.name)
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
      this.formInline.resourceName = data.label
      this.queryData()
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
    addResource() {
      this.$router.push({
        name: 'AddResource'
      })
    },
    updateResource(row) {
      console.log('this is updating-data')
      console.log(row)
      this.$router.push({
        name: 'UpdateResource',
        params: {
          resource: row
        }
      })
    },
    /**
     * 顶层的菜单栏事件函数
     */
    updateSelectedResource() {
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
        this.updateCompany(this.multipleSelection[0])
      }
    },

    deleteSelectedResource() {
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
            this.deleteResource(params)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    deleteSpecificResource(row) {
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
          this.deleteResource(params)
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
    deleteResource(params) {
      console.log(params.idList)
      dropResource(params)
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
