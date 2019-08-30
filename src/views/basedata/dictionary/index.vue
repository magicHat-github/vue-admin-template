<template>
  <div class="app-container allData">
    <!--查询框 -->
    <div>
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="字典名称:">
          <el-input v-model="searchData.name" placeholder="字典名称" size="mini" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="字典类型:">
          <el-input v-model="searchData.category" placeholder="字典类型" size="mini" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card class="tableData">
      <!-- 增删改按钮框 -->
      <div>
        <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addDictionary">增加</el-link>
        <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCheck">删除</el-link>
        <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateCheck">修改</el-link>
        <el-link class="itemAction" type="primary" icon="el-icon-upload2" @click="importDictioanry">导入</el-link>
        <el-link class="itemAction" type="primary" icon="el-icon-download" @click="exportDictionary">导出</el-link>
      </div>
      <!--数据显示区域 -->
      <!-- stripe斑马纹  border带边框 -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        border="true"
        element-loading-text="Loading"
        :data="list"
        tooltip-effect="dark"
        stripe="true"
        height
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="字典名" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="category" label="字典类型" sortable="true" align="center">
          <template slot-scope="scope">{{ scope.row.category }}</template>
        </el-table-column>
        <el-table-column prop="value" label="字典值" align="center">
          <template slot-scope="scope">{{ scope.row.value }}</template>
        </el-table-column>
        <el-table-column prop="updatedTime" label="更新时间" align="center">
          <template slot-scope="scope">{{ scope.row.updatedTime }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注信息" align="center">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column prop="status" label="启用标记" sortable="true" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'primary' : 'info'">
              {{ scope.row.status === 1 ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" style="white-space:nowrap" align="center">
          <template slot-scope="{row}">
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addDictionary" />
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateDictionary(row.id)" />
            <el-link class="itemAction" type="danger" :disabled="row.status===1 " icon="el-icon-delete" @click="deleteDictionary(row.id)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <div>
        <pagination v-show="dataCount>0" :total="dataCount" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
      </div>
    </el-card>
  </div>
</template>

<script>
// import { log } from 'util'
import Pagination from '@/components/Pagination'
import { select, deleteList, searchItem } from '@/api/basedata/dictionary'
export default {
  name: 'Dictionary',
  components: { Pagination },
  data() {
    return {
      // 数据字典集合，用于页面数据的渲染
      list: null,
      // 数据字典总条目数
      dataCount: 0,
      /**
       * 查询字段
       */
      searchData: {
        name: '',
        category: ''
      },
      // 分页的页面数据，默认5条一页，默认处于第一页
      page: {
        pageSize: 5,
        pageNumber: 1
      },
      // load加载动画标志
      listLoading: false,
      // 表格选择列表
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
  created() {
    this.fetchData()
  },
  methods: {
    //  改变页面大小，拉取一次数据
    handleSizeChange(val) {
      this.page.pageSize = val
      this.fetchData()
    },
    //  跳转到指定页面，拉取一次数据
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.fetchData()
    },
    /**
     * 分页查询数据字典数据
     * 将显示数据的初始化和查询数据放在一起
     * 初始化的时候是按照页面给定的页面大小，只拉取一页数据
     * 查询是按照给定的查询条件结合页面大小进行显示
    */
    fetchData() {
      this.listLoading = true
      const params = {
        size: this.page.pageSize,
        page: this.page.pageNumber,
        name: this.searchData.name,
        category: this.searchData.category
      }
      select(params).then(result => {
        const body = result.body
        this.list = body.dictionaries.dataList
        this.dataCount = body.dictionaries.dataCount
        this.listLoading = false
      })
    },
    /**
     * 获取表格选取的数据，即勾选事件的处理函数
    */
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },

    /**
     * 输入框响应enter查询
     */
    handleFilter() {
      this.page.pageNumber = 1
      this.fetchData()
    },
    /**
     * 跳转到增加界面
     */
    addDictionary() {
      this.$router.push({
        name: 'AddDictionary'
      })
    },
    /**
     * 跳转至更新页面
     */
    updateDictionary(id) {
      searchItem(id).then(result => {
        const body = result.body
        this.$router.push({
          name: 'UpdateDictionary',
          params: {
            id: body.id,
            name: body.name,
            category: body.category,
            value: body.value,
            remark: body.remark,
            status: body.status
          }
        })
      })
    },
    /**
     * 对表格多选项进行判定，如果修改的是单条数据则跳转至更新页面
     */
    updateCheck() {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          type: 'warning',
          message: '请选择单个修改选项'
        })
      } else {
        this.$router.push({
          name: 'UpdateDictionary'
        })
      }
    },

    /**
     * 删除信息
     */
    deleteDictionary(id) {
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //  确认之后执行删除操作
          const idList = { idList: [id] }
          deleteList(idList).then(result => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }).catch(result => {
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
    },
    /**
     * 对表格多选项进行判定，至少选择一行才能执行删除操作
     */
    deleteCheck() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除选项'
        })
      } else {
        const idList = { idList: [] }
        this.multipleSelection.forEach(item => {
          idList.idList.push(item.id)
        })
        this.$confirm('是否要删除选定信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteList(idList).then(result => {
              console.log(idList)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.fetchData()
            }).catch(result => {
              console.log(idList)
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
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
