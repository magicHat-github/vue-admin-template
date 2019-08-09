<template>
  <div class="app-container allData">
    <!-- 查询 -->
    <div class="filter-container searchData">
      <el-form ref="form" :model="searchData" size="mini" label-width="70px" inline>
        <el-form-item label="试卷名">
          <el-input v-model="searchData.name" placeholder="试卷名" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="组卷人">
          <el-input v-model="searchData.createdBy" placeholder="组卷人" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="试卷类型">
          <el-select v-model="searchData.paperType" placeholder="请选择难度.." size="mini" style="width: 160px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in paperTypeList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="组卷时间">
          <el-date-picker v-model="searchData.comTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="试卷难度">
          <el-select v-model="searchData.difficult" placeholder="请选择难度.." size="mini" style="width: 160px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in difficultList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-remove-outline" @click="exportData">清空</el-button>
      </el-form>
    </div>
    <el-card class="tableData">
      <div>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="fastComposition">快速组卷</el-button>
        <el-button class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="exportData">标准组卷</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-goods" @click="exportData">模板组卷</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-goods" @click="exportData">试卷详情</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        size="mini"
        element-loading-text="Loading"
        fit
        stripe
        highlight-current-row
        style="margin-top: 10px;"
        @row-dblclick="exportData"
        @selection-change="exportData"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="试卷名" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="组卷人" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdBy }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卷子类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.paperType }}
          </template>
        </el-table-column>
        <el-table-column label="卷子难度" align="center">
          <template slot-scope="scope">
            {{ scope.row.difficult }}
          </template>
        </el-table-column>
        <el-table-column label="组卷时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.combExamTime }}
          </template>
        </el-table-column>
        <el-table-column label="试卷总分" align="center">
          <template slot-scope="scope">
            {{ scope.row.score }}
          </template>
        </el-table-column>
        <el-table-column label="试卷描述" align="center">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" width="230" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="exportData(row)">修改</el-button>
            <el-button v-if="row.status" size="mini" type="danger" :disabled="row.status!=='启用'" @click="exportData(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
    </el-card>

    <el-drawer title="快速组卷" size="80%" :visible.sync="dialog" :wrapper-closable="false">
      <div class="drawerClass">
        <el-form ref="form" :model="searchData" size="mini" label-width="70px" inline>
          <el-form-item label="配置项">
            <el-input v-model="searchData.name" placeholder="配置项" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="难度">
            <el-select v-model="searchData.difficult" placeholder="请选择难度.." size="mini" style="width: 160px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in difficultList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
          <el-button class="filter-item" size="small" type="primary" icon="el-icon-remove-outline" @click="exportData">清空</el-button>
        </el-form>
        <el-card>
          <el-table :data="gridData" size="mini">
            <el-table-column property="name" label="配置项" />
            <el-table-column property="difficult" label="难度" />
            <el-table-column property="updatedBy" label="修改人" />
            <el-table-column property="updatedTime" label="修改时间" />
            <el-table-column property="status" label="启用标志" />
            <el-table-column property="company" label="公司" />
            <el-table-column property="remark" label="备注" />
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="exportData(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini" type="danger" @click="startComposition(scope.$index, scope.row)">组卷</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationSmall">
            <el-pagination small layout="prev, pager, next" :hide-on-single-page="true" :total="50" />
          </div>
        </el-card>
        <el-card style="margin-top:5px;">
          <el-table :data="gridData" size="mini">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column property="name" label="题目类别" width="200" />
            <el-table-column property="address" label="题型" />
            <el-table-column property="address" label="题目数量" />
            <el-table-column property="address" label="题目难度" />
            <el-table-column property="address" label="题目分值" />
          </el-table>
        </el-card>
      </div>
    </el-drawer>

    <el-dialog title="提示" width="30%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <span>正在组卷.....</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible = false">取消组卷</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { select } from '@/api/paper/composition.js'
import Pagination from '@/components/Pagination'

export default {
  name: 'Composition',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      difficultList: ['困难', '一般', '简单'],
      paperTypeList: ['Java', 'C#', 'Python'],
      searchData: {
        name: '',
        createdBy: '',
        difficult: '简单',
        paperType: 'Java',
        comTime: ''
      },
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      page: {
        size: 5,
        pageNumber: 1
      },
      dialog: false,
      dialogVisible: false,
      listLoading: true,
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 分页查询数据
     */
    fetchData() {
      this.listLoading = true
      const params = {
        size: this.page.size,
        page: this.page.pageNumber,
        name: this.searchData.name,
        createdBy: this.searchData.createdBy,
        difficult: this.searchData.difficult,
        comTime: this.searchData.comTime
      }
      select(params).then(result => {
        this.list = result.data.list
        this.total = result.data.total
        this.listLoading = false
      })
    },
    /**
     * 输入框响应enter查询
     */
    handleFilter() {
      this.page.pageNumber = 1
      this.fetchData()
    },
    /**
     * 获取表格选取的数据
     */
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    /**
     * 快速组卷
     */
    fastComposition() {
      this.dialog = true
    },
    /**
     * 开始组卷
     */
    startComposition() {
      this.$confirm('是否开始组卷?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogVisible = true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 导入数据
     */
    exportData() {
      this.$message({
        type: 'info',
        message: '该功能暂未开发...'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerClass {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  // border-top: 1px solid black;
}
.paginationSmall {
  margin-top: 5px;
  text-align: center;
}
</style>

