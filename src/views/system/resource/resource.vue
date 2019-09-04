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
                @visible-change="$forceUpdate()"
                @change="computeParentNames"
              >
                <el-option
                  v-for="name in computedResourceNames"
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
                @visible-change="$forceUpdate()"
                @change="computeResourceNames"
              >
                <el-option
                  v-for="name in computedParentNames"
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
      resourceNodes: [],
      /**
       * 所有父节点的名称
       */
      parentNames: [],
      /**
       * 计算过后的资源名称
       */
      computedResourceNames: [],
      /**
       * 计算过后的父节点名称
       */
      computedParentNames: [],
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
      loading: true,
      // 用于判断节点下拉框
      flag: 0
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    /**
     * 计算资源下拉框
     * 暂定输入父节点信息后自动修改下拉框
     */
    computeResourceNames() {
      console.log('computing resource')
      this.computedResourceNames = []
      // 父节点表单为空
      if (!this.formInline.parentName || this.formInline.parentName === '') {
        this.resourceNodes.map(element => {
          this.computedResourceNames.push(element.name)
        })
      // 父节点表单不为空
      } else {
        this.flag = 0
        // 将父节点为表单中父节点的节点名称写入资源下拉框
        this.parentNames.map(element => {
          if (element.name === this.formInline.parentName && element.childList) {
            // 遍历父节点的所有子节点
            element.childList.map(child => {
              this.autoFillResourceName(child, element.name)
            })
          }
        })
        debugger
        console.log(this.flag)
        if (this.flag === 0) {
          this.formInline.resourceName = ''
        }
      }
    },
    autoFillResourceName(element, name) {
      if (element.name === name) {
        console.log('this is flag change')
        console.log(element.name)
        console.log(name)
        this.flag = this.flag + 1
      }
      this.computedResourceNames.push(element.name)
      if (element.childList) {
        element.childList.map(child => {
          this.autoFillResourceName(child, name)
        })
      }
    },
    /**
     * 计算父节点下拉框
     * 暂定输入资源信息后自动填充父节点信息
     */
    computeParentNames() {
      console.log('computing parent')
      this.computedParentNames = []
      // 资源表单为空
      if (this.formInline.resourceName && this.formInline.resourceName === '') {
        this.resourceNodes.map(element => {
          if (element.parentName && element.name === this.formInline.resourceName) {
            this.formInline.parentName = element.parentName
          }
        })
      }
      this.parentNames.map(element => {
        this.computedParentNames.push(element.name)
      })
    },
    /**
     * 查询数据
     */
    queryData() {
      this.loading = true
      this.resourceNodes = []
      const params = {
        resourceName: this.formInline.resourceName,
        parentName: this.formInline.parentName,
        pageSize: this.page.size,
        pageNum: this.page.pageNumber
      }
      fetchResource(params).then(result => {
        this.computedResourceNames = []
        this.computedParentNames = []
        this.parentNames = []
        this.resourceNodes = []
        const body = result.body
        // 转换树结构的数据
        console.log(body.tree)
        const tree = body.tree.treeNodeList
        this.treeData = this.transDataToTree(tree, null)
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
        // 填充下拉框
        this.formInline.resourceName = ''
        this.formInline.parentName = ''
        console.log('this is parent names')
        console.log(this.parentNames)
        this.computeParentNames()
        this.computeResourceNames()
      })
    },
    /**
     * 查询树结构的方法
     */
    transDataToTree(arr, parent) {
      return arr.map(element => {
        return this.getChildren(element, parent)
      })
    },
    /**
     * 查询树结构的方法
     */
    getChildren(element, parent) {
      if (!element.childList) {
        const re = {
          label: element.name,
          id: element.id,
          children: null
        }
        const resourceNode = {
          name: element.name,
          parentName: parent
        }
        this.resourceNodes.push(resourceNode)
        return re
      } else {
        const resourceNode = {
          name: element.name,
          parentName: parent
        }
        this.parentNames.push(element)
        this.resourceNodes.push(resourceNode)
        return {
          label: element.name,
          id: element.id,
          children: this.transDataToTree(element.childList, element.name)
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
