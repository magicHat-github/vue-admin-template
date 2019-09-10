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
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" fixed="left" />
            <el-table-column prop="name" label="配置项" />
            <el-table-column prop="difficult" label="难度">
              <template slot-scope="scope">{{ scope.row.difficult | userIdToValueConversionFilter(difficultList) }}</template>
            </el-table-column>
            <el-table-column prop="updatedBy" label="修改人" />
            <el-table-column label="修改时间">
              <template slot-scope="scope">{{ scope.row.updatedTime | parseUserTime('{y}-{m}-{d} {h}:{i}') }}</template>
            </el-table-column>
            <el-table-column class-name="status-col" label="是否启用" width="110" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === '1' ? 'primary' : 'info'"
                >{{ scope.row.status === '1' ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="companyId" label="公司" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateItem(scope.row.id)" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteItem(scope.row.id,scope.row.version)" />
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
              <el-table-column label="题目类别">
                <template slot-scope="scope">{{ scope.row.categoryId | userIdToValueConversionFilter(categoryList) }}</template>
              </el-table-column>
              <el-table-column label="题型">
                <template slot-scope="scope">{{ scope.row.subjectTypeId | userIdToNameConversionFilter(typeList) }}</template>
              </el-table-column>
              <el-table-column prop="num" label="题目数量" />
              <el-table-column label="题目难度">
                <template slot-scope="scope">{{ scope.row.difficult | userIdToValueConversionFilter(difficultList) }}</template>
              </el-table-column>
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
import { searchCategoryTree, selectType, selectDifficult } from '@/api/basedata/subject'
import { selectConfigs, deleteList, selectItemsByConfigId, searchById } from '@/api/basedata/config'
import { parseTime, idToValueConversionFilter, idToNameConversionFilter, getTreeList } from '@/utils'
export default {
  name: 'App',
  components: { Pagination },
  filters: {
    parseUserTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    userIdToNameConversionFilter(target, targetList) {
      return idToNameConversionFilter(target, targetList)
    },
    userIdToValueConversionFilter(target, targetList) {
      return idToValueConversionFilter(target, targetList)
    }
  },
  data() {
    return {
      categoryTree: null,
      categoryList: [],
      typeList: null,
      difficultList: [],
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
      searchCategoryTree().then(result => {
        const body = result.body
        this.categoryTree = body.treeData
        getTreeList(this.categoryTree, this.categoryList)
      })
      const params2 = {
        name: '',
        pageSize: 1000000,
        pageNum: 1
      }
      selectType(params2).then(result => {
        const body = result.body
        this.typeList = body.dataList
      })
      const params3 = {
        name: '题目难度',
        category: '题目难度',
        pageSize: 1000000,
        pageNum: 1
      }
      selectDifficult(params3).then(result => {
        const body = result.body
        this.difficultList = body.dictionaries.dataList
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
    updateItem(id) {
      searchById(id).then(result => {
        const body = result.body
        this.$router.push({
          params: {
            id: body.id,
            name: body.name,
            remark: body.remark,
            version: body.version,
            difficult: body.difficult,
            configDetailList: body.configDetailList
          },
          name: 'UpdateConfig'
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '系统错误!'
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
            this.select()
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
