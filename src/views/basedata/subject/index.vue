<template>
  <el-container>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="题目:">
              <el-input v-model="formInline.name" clearable size="mini" />
            </el-form-item>
            <el-form-item label="题目类别:">
              <el-input v-model="formInline.categoryName" clearable size="mini" />
            </el-form-item>
            <el-form-item label="题型:">
              <el-input v-model="formInline.typeName" clearable size="mini" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="queryData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-card class="tableData">
          <!-- 增删改按钮框 -->
          <div>
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto">增加</el-link>
            <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCheck">删除</el-link>
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateCheck">修改</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-upload2" @click="updateItem">导入</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-download" @click="updateItem">导出</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="dataList"
            tooltip-effect="dark"
            stripe
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="题目" />
            <el-table-column prop="categoryName" label="题目类别" sortable="true" />
            <el-table-column prop="subjectTypeName" label="题型" />
            <el-table-column label="更新时间">
              <template slot-scope="scope">{{ scope.row.updatedTime | parseUserTime('{y}-{m}-{d} {h}:{i}') }}</template>
            </el-table-column>
            <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 1 ? 'primary' : 'info'"
                >{{ scope.row.status === 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateItem(scope.row.id)" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteItem(scope.row.id,scope.row.version)" />
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
              @pagination="queryData"
            />
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { parseTime, idToValueConversionFilter } from '@/utils'
import Pagination from '@/components/Pagination'
import { select, deleteList, searchById } from '@/api/basedata/subject'
export default {
  name: 'App',
  components: { Pagination },
  filters: {
    parseUserTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    userIdToValueConversionFilter(target, targetList) {
      return idToValueConversionFilter(target, targetList)
    }
  },
  data() {
    return {
      /**
         * 查询字段
         */
      formInline: {
        categoryName: '',
        typeName: '',
        name: ''
      },
      page: {
        pageSize: 5,
        pageNum: 1
      },
      // 试卷总数
      dataCount: 0,

      /**
         * 数据List
         */
      dataList: null,
      listLoading: false,
      /**
         * 多选
         */
      multipleSelection: []
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    /**
     * 显示和查询
     */
    queryData() {
      this.listLoading = true
      const params = {
        categoryName: this.formInline.categoryName,
        typeName: this.formInline.typeName,
        name: this.formInline.name,
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      select(params).then(result => {
        const body = result.body
        this.dataList = body.dataList
        this.dataCount = parseInt(body.dataCount)
        this.listLoading = false
        console.log(this.dataList)
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
              this.queryData()
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
        name: 'AddSubject'
      })
    },
    updateItem(id) {
      searchById(id).then(result => {
        const body = result.body
        this.$router.push({
          name: 'UpdateSubject',
          params: {
            id: body.id,
            name: body.name,
            categoryId: body.categoryId,
            dictionaryId: body.dictionaryId,
            subjectTypeId: body.subjectTypeId,
            status: body.status,
            version: body.version,
            remark: body.remark,
            answerList: body.answerList
          }
        })
      })
    },

    /**
     * 删除信息
     */
    deleteItem(id, version) {
      const params = { dataList: [] }
      const data = { id: id,
        version: version }
      params.dataList.push(data)
      console.log(params)
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteList(params).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.queryData()
          }).catch(() => {
            this.$message({
              type: 'success',
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
  }
}
</script>

<style>
  .itemAction {
    margin-right: 10px;
  }
</style>
