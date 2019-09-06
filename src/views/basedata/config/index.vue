<template>
  <el-container>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="组卷配置项标题:">
              <el-input v-model="formInline.name" clearable size="mini" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="select">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-card class="tableData">
          <!-- 增删改按钮框 -->
          <div>
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto">增加</el-link>
            <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCheck">删除</el-link>
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateCheck">修改</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="configList"
            tooltip-effect="dark"
            stripe
            height
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" fixed="left" />
            <el-table-column prop="name" label="配置项" />
            <el-table-column prop="difficult" label="难度" />
            <el-table-column prop="updatedBy" label="修改人" />
            <el-table-column prop="updatedTime" label="修改时间" />
            <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 1 ? 'primary' : 'info'"
                >{{ scope.row.status === 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="companyId" label="公司" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateItem" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteItem" />
                <el-link class="itemAction" type="success" icon="el-icon-view" @click="findConfigDetail(scope.row.id)" />
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页部分 -->
          <div class="block">
            <pagination
              v-show="dataCount>0"
              :total="dataCount"
              :page.sync="page.pageNum"
              :limit.sync="page.pageSize"
              @pagination="select"
            />
          </div>
        </el-card>
        <el-drawer
          title="组卷配置详情"
          :visible.sync="tableView"
          direction="btt"
          size="75%"
        >
          <!-- 数据显示表单 -->
          <el-card class="tableData">
            <el-table
              ref="multipleTable"
              :data="chooseDetails"
              tooltip-effect="dark"
              stripe
              height
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
              />
              <el-table-column prop="categoryId" label="题目类别" />
              <el-table-column prop="subjectTypeId" label="题型" />
              <el-table-column prop="num" label="题目数量" />
              <el-table-column prop="difficult" label="题目难度" />
              <el-table-column prop="score" label="题目分值" />
            </el-table>
          </el-card>
        </el-drawer>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectConfigs, deleteList, selectItemsByConfigId } from '@/api/basedata/config'
export default {
  name: 'App',
  components: { Pagination },
  data() {
    return {
      /**
       *加载
       */
      listLoading: false,
      /**
         * 查询字段
         */
      formInline: {
        name: '',
        findId: ''
      },
      tableView: false,
      page: {
        pageSize: 5,
        pageNum: 1
      },
      // 分页总数
      dataCount: 0,
      /**
         * 配置项数据
         */
      configList: null,
      detailList: null,
      chooseDetails: [],
      /**
         * 待确认字段
         */
      multipleSelection: []
    }
  },
  created() {
    this.select()
  },
  methods: {
    /**
     * 模糊查询
     */
    select() {
      this.listLoading = true
      const params = {
        name: this.formInline.name,
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      selectConfigs(params).then(result => {
        const body = result.body
        this.configList = body.list
        this.dataCount = parseInt(body.total)
        this.listLoading = false
      })
    },

    /**
     * 对表格多选项进行判定，成则跳转至修改页面
     */
    updateCheck() {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          type: 'warning',
          message: '请选择单个修改选项'
        })
      } else {
        this.$router.push({
          name: 'UpdateCategory'
        })
      }
    },
    /**
     * 对表格多选项进行判定，成功则删除
     */
    deleteCheck() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除选项'
        })
      } else {
        const params = { dataList: [] }
        this.multipleSelection.forEach(item => {
          const data = { id: item.id,
            version: item.version }
          params.dataList.push(data)
        })
        this.$confirm('是否要删除选定信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log(params)
            deleteList(params).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.select()
            }).catch(() => {
              this.$message({
                type: 'warning',
                message: '删除失败!'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
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
    goto() {
      this.$router.push({
        name: 'AddConfig'
      })
    },
    updateItem() {
      this.$router.push({
        name: 'UpdateConfig'
      })
    },
    /**
       * 删除信息
       */
    deleteItem() {
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
    findConfigDetail(id) {
      this.tableView = true
      selectItemsByConfigId(id).then(result => {
        this.chooseDetails = result.body
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
