<template>
  <div class="app-container allData">
    <!--查询框 -->
    <div>
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="字典名称:">
          <el-input v-model="searchData.name" placeholder="字典名称" size="mini" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="字典类型:">
          <el-input v-model="searchData.type" placeholder="字典类型" size="mini" @keyup.enter.native="handleFilter" />
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
        <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="deleteDictionary">删除</el-link>
        <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="updateDictionary">修改</el-link>
        <el-link class="itemAction" type="primary" icon="el-icon-upload2" @click="importDictioanry">导入</el-link>
        <el-link class="itemAction" type="primary" icon="el-icon-download" @click="exportDictionary">导出</el-link>
      </div>
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
          <template slot-scope="scope"><el-tag>{{ scope.row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" style="white-space:nowrap" align="center">
          <template slot-scope="{row}">
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addDictionary" />
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateDictionary(row)" />
            <el-link class="itemAction" type="danger" :disabled="row.status=='启用'" icon="el-icon-delete" @click="deleteDictionary(row)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
    </el-card>
  </div>
</template>

<script>
// import { log } from 'util'
import Pagination from '@/components/Pagination'
import { select } from '@/api/basedata/dictionary'
export default {
  name: 'Dictionary',
  components: { Pagination },
  data() {
    return {
      // 数据字典集合
      list: null,
      // 数据字典总条目数
      total: 0,
      /**
       * 查询字段
       */
      searchData: {
        name: '',
        type: ''
      },
      // 分页的页面数据，默认5条一页，默认处于第一页
      page: {
        size: 5,
        pageNumber: 1
      },
      // load加载动画标志
      listLoading: false,
      // 表格选择列表
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 分页查询数据字典数据
    */
    fetchData() {
      this.listLoading = true
      const params = {
        size: this.page.size,
        page: this.page.pageNumber,
        name: this.searchData.name,
        type: this.searchData.type
      }
      select(params).then(result => {
        const body = result.body
        this.list = body.data.list
        this.total = body.data.total
        this.listLoading = false
      })
    },
    /**
     * 获取表格选取的数据
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
    updateDictionary() {
      this.$router.push({
        name: 'UpdateDictionary'
      })
    },

    /**
     * 删除信息
     */
    deleteDictionary() {
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
