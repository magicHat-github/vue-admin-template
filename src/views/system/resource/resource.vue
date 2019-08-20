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
                <h1 style="font-size:15px;" class="el-icon-menu">资源管理</h1>
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
      <div>
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- 节点名称输入框 -->
            <el-form-item label="节点名称:">
              <el-select
                v-model="formInline.resourceNames"
                filterable
                multiple
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="resource in resources"
                  :key="resource.name"
                  :value="resource.name"
                />
              </el-select>
            </el-form-item>
            <!-- 父亲节点下拉框 -->
            <el-form-item label="父亲节点:">
              <el-select
                v-model="formInline.parentResources"
                filterable
                multiple
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="resource in resources"
                  :key="resource.parentName"
                  :value="resource.parentName"
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
            <el-link class="itemAction" size="mini" type="primary" icon="el-icon-plus" @click="addResource">增加</el-link>
            <el-link class="itemAction" size="mini" type="danger" icon="el-icon-delete" @click="deleteResource">删除</el-link>
            <el-link class="itemAction" size="mini" type="warning" icon="el-icon-edit" @click="updateResource">修改</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
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
            <el-table-column prop="leaf" label="是否叶节点" sortable="true" width="120" align="center" />
            <el-table-column label="操作" style="white-space:nowrap" width="110" align="center">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addResource" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteResource" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateResource(scope.row)" />
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
        resourceNames: [],
        parentResources: []
      },

      /**
       * 资源管理
       */
      resources: [
        {
          name: '节点 1',
          code: 'code1',
          parentName: 'null',
          url: '???不懂该是什么',
          resourceType: '菜单栏',
          openImg: '我是打开图标',
          closeImg: '我是关闭图标',
          leaf: '否'
        },
        {
          name: '节点 2',
          code: 'code2',
          parentName: '节点 1',
          url: '不懂该是什么',
          resourceType: '菜单栏',
          openImg: '我是打开图标',
          closeImg: '我是关闭图标',
          leaf: '是'
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
      this.total = this.resources.length
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
    addResource() {
      this.$router.push({
        name: 'AddResource'
      })
    },
    updateResource(row) {
      this.$router.push({
        name: 'UpdateResource',
        params: {
          'row': row
        }
      })
    },

    /**
     * 删除信息
     */
    deleteResource() {
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
.aside .el-card__body .el-main {
  padding-left: 5px;
}

.aside .el-card__body .el-header {
  padding: 5px;
}
</style>
