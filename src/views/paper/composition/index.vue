<template>
  <div class="app-container allData">
    <!-- 试卷查询域 -->
    <div class="filter-container searchData">
      <el-form ref="form" :model="searchData" size="mini" label-width="70px" inline>
        <el-form-item label="试卷名">
          <el-input v-model="searchData.name" placeholder="试卷名" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="组卷人">
          <el-input v-model="searchData.createdBy" placeholder="组卷人" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      </el-form>
    </div>
    <!-- 试卷数据域 -->
    <el-card class="tableData">
      <div>
        <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="fastComposition">快速组卷</el-link>
        <el-link class="itemAction" type="success" icon="el-icon-star-off" @click="normalComposition">标准组卷</el-link>
        <el-link class="itemAction" type="warning" icon="el-icon-goods" @click="templateComposition">模板组卷</el-link>
        <el-link class="itemAction" type="danger" icon="el-icon-info" @click="paperDetail">试卷详情</el-link>
      </div>
      <!-- 试卷数据表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        size="mini"
        element-loading-text="Loading"
        fit
        stripe
        highlight-current-row
        style="margin-top: 10px;"
        @row-dblclick="editPaper"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="试卷名" width="110" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="组卷人" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdBy }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卷子类型" align="center">
          <template slot-scope="scope">{{ scope.row.paperType }}</template>
        </el-table-column>
        <el-table-column label="卷子难度" align="center">
          <template slot-scope="scope">{{ scope.row.difficult }}</template>
        </el-table-column>
        <el-table-column label="组卷时间" align="center">
          <template slot-scope="scope">{{ scope.row.combExamTime }}</template>
        </el-table-column>
        <el-table-column label="试卷总分" align="center">
          <template slot-scope="scope">{{ scope.row.score }}</template>
        </el-table-column>
        <el-table-column label="试卷描述" align="center">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" width="230" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="editPaper(row)">修改</el-button>
            <el-button v-if="row.status" size="mini" type="danger" :disabled="row.status!=='启用'" @click="deletePaper(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNumber" :limit.sync="page.size" @pagination="fetchData" />
    </el-card>

    <!-- 快速组卷 -->
    <el-drawer title="快速组卷" size="80%" :visible.sync="fastDialog" :wrapper-closable="false">
      <div class="drawerClass">
        <!-- 配置项的查询框 -->
        <el-form ref="form" :model="searchConfigData" size="mini" label-width="70px" inline>
          <el-form-item label="配置项">
            <el-input v-model="searchConfigData.name" placeholder="配置项" style="width: 200px;" class="filter-item" @keyup.enter.native="handleConfigFilter" />
          </el-form-item>
          <el-form-item label="难度">
            <el-select :value="searchConfigData.difficult" placeholder="请选择难度.." size="mini" style="width: 200px" class="filter-item" @change="handleConfigFilter">
              <el-option v-for="item in difficultList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="fetchConfigData">查询</el-button>
        </el-form>
        <el-card>
          <!-- 配置项数据表格 -->
          <el-table
            v-loading="configListLoading"
            :data="configList"
            size="mini"
            element-loading-text="Loading"
            fit
            stripe
            highlight-current-row
          >
            <el-table-column align="center" property="name" label="配置项" />
            <el-table-column align="center" property="difficult" label="难度" />
            <el-table-column align="center" property="updatedBy" label="修改人" />
            <el-table-column align="center" property="company" label="公司" />
            <el-table-column align="center" property="updatedTime" label="修改时间" />
            <el-table-column align="center" show-overflow-tooltip property="remark" label="备注" />
            <el-table-column align="center" property="status" label="启用标志" />
            <el-table-column align="center" label="操作" width="160">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="findCombConfigItem(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini" type="danger" @click="startComposition(scope.$index, scope.row)">组卷</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 试卷配置项的分页组件 -->
          <div class="paginationSmall">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :page-size="pageConfig.size"
              :pager-count="pageConfig.count"
              :hide-on-single-page="true"
              :total="configTotal"
              @current-change="paperConfigPagination"
            />
          </div>
        </el-card>
        <el-card style="margin-top:5px;">
          <el-table
            v-loading="configItemListLoading"
            :data="configItemList"
            size="mini"
            element-loading-text="Loading"
            fit
            stripe
            highlight-current-row
          >
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column property="name" label="题目类别" width="200" />
            <el-table-column property="category" label="题型" />
            <el-table-column property="number" label="题目数量" />
            <el-table-column property="difficult" label="题目难度" />
            <el-table-column property="score" label="题目分值" />
          </el-table>
        </el-card>
      </div>
    </el-drawer>

    <!-- 标准组卷 -->
    <el-drawer title="标准组卷" size="60%" :visible.sync="normalDialog" :wrapper-closable="false">
      <div class="drawerClass">
        <span>组卷配置信息</span>
        <el-divider />
        <div style="margin-left:20px;">
          <el-form ref="form" :model="normalPaperConfig" size="medium" label-width="70px" inline>
            <el-form-item label="配置项" prop="normalPaperConfigName" required>
              <el-input v-model="normalPaperConfig.name" placeholder="配置项名称" style="width: 200px;" class="filter-item" />
            </el-form-item>
            <el-form-item label="是否启用" prop="normalPaperConfigStatus">
              <el-radio-group v-model="normalPaperConfig.status">
                <el-radio label="启用" />
                <el-radio label="禁用" />
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>

        <span style="margin-top:20px;">添加组卷明细</span>
        <el-divider />
        <el-card style="margin-top:5px;">
          <div class="addCombConfigItemActions">
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addCombConfigItem()">添加</el-link>
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="editCombConfigItem()">修改</el-link>
            <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCombConfigItem()">删除</el-link>
          </div>
          <el-table
            v-loading="normalConfigItemList"
            :data="normalConfigListLoading"
            size="mini"
            element-loading-text="Loading"
            fit
            stripe
            highlight-current-row
          >
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column property="category" label="题目类别" />
            <el-table-column property="type" label="题型" />
            <el-table-column property="number" label="题目数量" />
            <el-table-column property="difficult" label="题目难度" />
            <el-table-column property="score" label="题目分值" />
          </el-table>
        </el-card>
      </div>
    </el-drawer>

    <!-- 添加组卷明细弹框 -->
    <el-dialog title="添加组卷明细" :visible.sync="addCombConfigItemDialog" width="20%">
      <el-form :model="combConfigItem" size="medium" label-width="70px">
        <el-form-item label="题目类别">
          <el-select :value="combConfigItem.type" placeholder="请选择题目类别.." style="width: 250px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in paperTypeList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-select :value="combConfigItem.category" placeholder="请选择题型.." style="width: 250px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in paperTypeList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目难度">
          <el-select :value="combConfigItem.difficult" placeholder="请选择题目难度.." style="width: 250px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in difficultList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目数量">
          <el-input v-model="combConfigItem.number" style="width: 250px" />
        </el-form-item>
        <el-form-item label="题目分值" style="width: 250px">
          <el-input v-model="combConfigItem.score" style="width: 250px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCombConfigItemDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCombConfigItemDialog = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 试卷详情 -->
    <paper-view :page-show="paperDetailDialog" :paper-info="paperInfo" size="50%" @show-change="showChange" />

    <!-- 组卷提示框 -->
    <el-dialog title="提示" width="30%" :visible.sync="paperTipDialog" :close-on-click-modal="false">
      <span>正在组卷.....</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="paperTipDialog = false">取消组卷</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { select, selectConfigList, selectConfigItemById } from '@/api/paper/composition.js'
import Pagination from '@/components/Pagination'
import PaperView from '@/components/PaperView'

export default {
  name: 'Composition',
  components: { Pagination, PaperView },
  data() {
    return {
      // 试卷集合
      list: null,
      // 配置项表格数据
      configList: null,
      // 试卷配置明细表格数据
      configItemList: null,
      // 标准组卷中配置明细的表格数据
      normalConfigItemList: null,
      // 试卷详细数据，用于预览
      paperInfo: {},
      // 试卷总数
      total: 0,
      // 配置项总数
      configTotal: 0,
      // 试卷难度集合
      difficultList: [],
      // 试卷类型集合
      paperTypeList: [],
      // 试卷查询条件
      searchData: {
        name: '',
        createdBy: '',
        difficult: '简单',
        comTime: ''
      },
      // 分页的页面数据
      page: {
        size: 5,
        pageNumber: 1
      },
      // 配置项分页的页面数据
      pageConfig: {
        size: 5,
        count: 7,
        pageNumber: 1
      },
      // 配置项的查询条件
      searchConfigData: {
        name: '',
        difficult: '简单'
      },
      // 标准组卷的组卷配置
      normalPaperConfig: {
        name: '',
        status: '启用'
      },
      // 添加的组卷配置明细
      combConfigItem: {
        type: 'Java',
        category: 'Java',
        difficult: '困难',
        number: '',
        score: ''
      },
      // 快速组卷弹窗标志
      fastDialog: false,
      // 标准组卷弹窗标志
      normalDialog: false,
      // 正在组卷提示弹窗标志
      paperTipDialog: false,
      // 试卷详情弹窗标志
      paperDetailDialog: true,
      // 添加组卷明细弹框标志
      addCombConfigItemDialog: false,
      // 修改组卷明细弹框标志
      editCombConfigItemDialog: false,
      // load加载动画标志
      listLoading: false,
      configListLoading: false,
      configItemListLoading: false,
      normalConfigListLoading: false,
      // 表格选择列表
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
    this.getDifficultList()
    this.getPaperTypeList()
  },
  methods: {
    /**
     * 分页查询试卷数据
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
     * 分页查询配置项数据
     */
    fetchConfigData() {
      this.configListLoading = true
      const params = {
        size: this.pageConfig.size,
        page: this.pageConfig.pageNumber,
        name: this.searchConfigData.name,
        difficult: this.searchConfigData.difficult
      }
      selectConfigList(params).then(result => {
        this.configList = result.data.list
        this.configTotal = result.data.total
        this.configListLoading = false
      })
    },
    /**
     * 初始获取全部试卷难度
     */
    getDifficultList() {
      this.difficultList = ['困难', '一般', '简单']
    },
    /**
     * 初始获取全部试卷类型
     */
    getPaperTypeList() {
      this.paperTypeList = ['Java', 'C#', 'Python']
    },
    /**
     * 输入框响应enter查询
     */
    handleFilter() {
      this.page.pageNumber = 1
      this.fetchData()
    },
    /**
     * 输入框响应enter查询
     */
    handleConfigFilter() {
      this.pageConfig.pageNumber = 1
      this.fetchConfigData()
    },
    /**
     * 获取表格选取的数据
     */
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    /**
     * 响应分页事件
     */
    paperConfigPagination(number) {
      this.pageConfig.pageNumber = number
      this.fetchConfigData()
    },
    /**
     * 快速组卷
     */
    fastComposition() {
      this.fastDialog = true
      this.fetchConfigData()
    },
    /**
     * 标准组卷
     */
    normalComposition() {
      this.normalDialog = true
    },
    /**
     * 查看组卷配置明细
     */
    findCombConfigItem(index, row) {
      this.configItemListLoading = true
      const params = {
        configId: row.id
      }
      selectConfigItemById(params).then(result => {
        this.configItemList = result.data.list
        this.configItemListLoading = false
      })
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
        this.paperTipDialog = true
        // TODO: 这里进行组卷
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消组卷'
        })
      })
    },
    /**
     * 模板组卷
     */
    templateComposition() {
      this.$confirm('该功能与下载试卷一致，是否打开下载试卷页面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/paper/download')
      }).catch(() => {
        console.log('取消')
      })
    },
    /**
     * 试卷详情
     */
    paperDetail() {
      if (this.multipleSelection.length === 1) {
        console.log(this.multipleSelection[0])
        this.paperDetailDialog = true
      } else {
        this.$message({
          type: 'error',
          message: '只能选择一条试卷数据'
        })
      }
    },
    /**
     * 导入数据
     */
    exportData() {
      this.$message({
        type: 'info',
        message: '该功能暂未开发...'
      })
    },
    /**
     * 删除试卷
     * @param row
     */
    deletePaper(row) {
      this.$confirm('是否删除' + row.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 这里进行删除操作
        console.log('这里进行删除操作')
      }).catch(() => {
        console.log('取消')
      })
    },
    /**
     * 删除试卷
     * @param row
     */
    editPaper(row) {
      // TODO: 这里进行修改试卷操作
      console.log(row)
      console.log('这里进行修改试卷操作!')
    },
    /**
     * 添加组卷明细
     */
    addCombConfigItem() {
      // TODO: 添加组卷明细
      this.addCombConfigItemDialog = true
    },
    /**
     * 修改组卷明细
     */
    editCombConfigItem() {
      // TODO: 添加修改弹窗
      console.log('editCombConfigItem')
    },
    /**
     * 删除组卷明细
     */
    deleteCombConfigItem() {
      // TODO: 删除组卷明细
      console.log('deleteCombConfigItem')
    },
    /**
     * 同步试卷预览的值
     * @param val
     */
    showChange(val) {
      this.paperViewShow = val
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
.addCombConfigItemActions {
  font-size: 20px;
  margin-bottom: 10px;
}
.itemAction {
  margin-right: 10px;
}
</style>

