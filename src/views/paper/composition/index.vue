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
          <el-select v-model="searchData.difficult" placeholder="请选择难度.." size="mini" style="width: 160px" class="filter-item">
            <el-option v-for="item in difficultList" :key="item.id" :label="item.value" :value="item.value" />
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="试卷名" width="110" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="组卷人" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.combExamMan }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卷子类型" align="center">
          <template slot-scope="scope">{{ scope.row.paperType | userIdToValueConversionFilter(paperTypeList) }}</template>
        </el-table-column>
        <el-table-column label="卷子难度" align="center">
          <template slot-scope="scope">{{ scope.row.difficult | userIdToValueConversionFilter(difficultList) }}</template>
        </el-table-column>
        <el-table-column label="组卷时间" align="center">
          <template slot-scope="scope">{{ scope.row.combExamTime | parseUserTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column label="试卷总分" align="center">
          <template slot-scope="scope">{{ scope.row.score }}</template>
        </el-table-column>
        <el-table-column label="试卷描述" align="center">
          <template slot-scope="scope">{{ scope.row.descript }}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">禁用</el-tag>
            <el-tag v-else>启用</el-tag>
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
            <el-select v-model="searchConfigData.difficult" placeholder="请选择难度.." size="mini" style="width: 200px" class="filter-item">
              <el-option v-for="item in difficultList" :key="item.id" :label="item.value" :value="item.value" />
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
            <el-table-column align="center" property="updatedTime" label="修改时间">
              <template slot-scope="scope">{{ scope.row.updatedTime | parseUserTime('{y}-{m}-{d} {h}:{i}') }}</template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip property="remark" label="备注" />
            <el-table-column align="center" property="status" label="启用标志" />
            <el-table-column align="center" label="操作" width="160">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="findCombConfigItem(scope.row)">查看</el-button>
                <el-button size="mini" type="danger" @click="fillPaperForm(scope.row)">组卷</el-button>
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
            <el-table-column property="subjectTypeId" label="题目类别" width="200">
              <template slot-scope="scope">{{ scope.row.subjectTypeId | userIdToValueConversionFilter(subjectTypeList) }}</template>
            </el-table-column>
            <el-table-column property="categoryId" label="题型">
              <template slot-scope="scope">{{ scope.row.categoryId | userIdToValueConversionFilter(subjectCategoryList) }}</template>
            </el-table-column>
            <el-table-column property="difficult" label="题目难度">
              <template slot-scope="scope">{{ scope.row.difficult | userIdToValueConversionFilter(subjectDifficultList) }}</template>
            </el-table-column>
            <el-table-column property="num" label="题目数量" />
            <el-table-column property="score" label="题目分值" />
          </el-table>
        </el-card>
      </div>
    </el-drawer>

    <!-- 标准组卷 -->
    <el-drawer title="标准组卷" size="60%" :visible.sync="normalDialog" :wrapper-closable="false">
      <div class="drawerClass">
        <div class="drawer-content">
          <span>组卷配置信息</span>
          <el-divider />
          <div style="margin-left:20px;">
            <el-form ref="normalPaperConfig" :rules="normalPaperConfigRules" :model="normalPaperConfig" size="medium" label-width="100px" inline>
              <el-form-item label="配置项" prop="name">
                <el-input v-model="normalPaperConfig.name" placeholder="配置项名称" style="width: 200px;" class="filter-item" />
              </el-form-item>
              <el-form-item label="是否启用" prop="status">
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
              <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addCombConfigItem">添加</el-link>
              <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="editCombConfigItem">修改</el-link>
              <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCombConfigItem">删除</el-link>
            </div>
            <el-table
              v-loading="normalConfigListLoading"
              :data="normalConfigItemList"
              size="mini"
              element-loading-text="Loading"
              fit
              stripe
              highlight-current-row
              @row-dblclick="editCombConfigItem"
              @selection-change="handleConfigItemSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" width="50" />
              <el-table-column property="type" label="题目类别" />
              <el-table-column property="category" label="题型" />
              <el-table-column property="number" label="题目数量" />
              <el-table-column property="difficult" label="题目难度" />
              <el-table-column property="score" label="题目分值" />
            </el-table>
          </el-card>
        </div>
        <div class="drawer-footer">
          <el-button @click="normalDialog = false">取 消</el-button>
          <el-button type="primary" @click="validateCombConfig('normalPaperConfig')">开始组卷</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 添加组卷明细弹框 -->
    <el-dialog title="添加组卷明细" :visible.sync="addCombConfigItemDialog" width="28%" :close-on-click-modal="false" :show-close="false">
      <el-form ref="combConfigItem" :model="combConfigItem" :rules="combConfigItemRules" size="medium" label-width="80px">
        <el-form-item label="题目类别" prop="type">
          <el-select v-model="combConfigItem.type" placeholder="请选择题目类别.." style="width:250px">
            <el-option v-for="item in subjectTypeList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目类型" prop="category">
          <el-select v-model="combConfigItem.category" placeholder="请选择题型.." style="width:250px">
            <el-option v-for="item in subjectCategoryList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目难度" prop="difficult">
          <el-select v-model="combConfigItem.difficult" placeholder="请选择题目难度.." style="width:250px">
            <el-option v-for="item in subjectDifficultList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目数量" prop="number">
          <el-input v-model="combConfigItem.number" placeholder="请选择题目数量.." style="width:250px" />
        </el-form-item>
        <el-form-item label="题目分值" prop="score">
          <el-input v-model="combConfigItem.score" placeholder="请选择题目分值.." style="width:250px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exitAddCombConfigItem('combConfigItem')">取 消</el-button>
        <el-button type="primary" @click="addCombConfigItemData('combConfigItem')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 试卷详情 -->
    <paper-view :page-show="paperDetailDialog" :paper-info="paperInfo" size="50%" @show-change="showChange" />

    <!-- 填写试卷信息弹框 -->
    <paper-form-dialog ref="paperForm" :default-paper-name="defaultPaperName" :dialog-show="paperFormDialog" :difficult-list="difficultList" :paper-type-list="paperTypeList" @showChange="showPaperFormDialog" @startComposition="getPaperInfo" />

    <!-- 组卷提示框 -->
    <composition-loading ref="compositionLoading" :dialog-show="paperTipDialog" @showChange="showCompositionLoading" @cancelRequest="cancelCompositionRequest" />
  </div>
</template>

<script>
import { select, startCompositionRequest, normalCompositionRequest } from '@/api/paper/composition.js'
import { cancel } from '@/utils/requestUtil'
import { selectConfigs, selectItemsByConfigId } from '@/api/basedata/config'
import { parseTime, idToValueConversionFilter, getIdByValue } from '@/utils'
import Pagination from '@/components/Pagination'
import PaperView from '@/components/PaperView'
import CompositionLoading from '@/views/paper/composition/compositionLoading'
import PaperFormDialog from '@/views/paper/composition/paperFormDialog'

export default {
  name: 'Composition',
  components: { Pagination, PaperView, CompositionLoading, PaperFormDialog },
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
      // 校验规则
      normalPaperConfigRules: {
        name: [
          { required: true, message: '请输入题目配置项', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '题目配置项状态不能为空', trigger: 'blur' }
        ]
      },
      // 校验规则
      combConfigItemRules: {
        type: [
          { required: true, message: '题目类别不能为空', trigger: 'change' }
        ],
        category: [
          { required: true, message: '题型不能为空', trigger: 'change' }
        ],
        difficult: [
          { required: true, message: '题目难度不能为空', trigger: 'change' }
        ],
        number: [
          { required: true, message: '题目数量不能为空', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '题目分值不能为空', trigger: 'blur' }
        ]
      },
      // 试卷集合
      list: null,
      // 配置项表格数据
      configList: null,
      // 试卷配置明细表格数据
      configItemList: null,
      // 标准组卷中配置明细的表格数据
      normalConfigItemList: [],
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
      // 组卷配置难度集合
      configDifficultList: [],
      // 题目类型集合
      subjectTypeList: [],
      // 题型集合
      subjectCategoryList: [],
      // 题目难度集合
      subjectDifficultList: [],
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
        type: null,
        category: null,
        difficult: null,
        number: null,
        score: null
      },
      // 快速组卷弹窗标志
      fastDialog: false,
      // 标准组卷弹窗标志
      normalDialog: false,
      // 正在组卷提示弹窗标志
      paperTipDialog: false,
      // 试卷详情弹窗标志
      paperDetailDialog: false,
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
      multipleSelection: [],
      multipleConfigItemSelection: [],
      configItemCount: 0,
      cancelId: null,
      paperFormDialog: false,
      paperConfigId: Number,
      combConfigDialogStatus: Boolean,
      compositionType: '',
      defaultPaperName: ''
    }
  },
  created() {
    this.getDifficultList()
    this.getPaperTypeList()
    this.fetchData()
    this.getConfigDifficultList()
    this.getSubjectTypeList()
    this.getSubjectCategoryList()
    this.getSubjectDifficultList()
  },
  methods: {
    /**
     * 分页查询试卷数据
     */
    fetchData() {
      this.listLoading = true
      const difficultId = getIdByValue(this.difficultList, this.searchData.difficult)
      const params = {
        pageSize: this.page.size,
        pageNum: this.page.pageNumber,
        name: this.searchData.name,
        combExamMan: this.searchData.createdBy,
        difficult: difficultId,
        combExamTimeStart: this.searchData.comTime[0],
        combExamTimeEnd: this.searchData.comTime[1]
      }
      select(params).then(result => {
        const body = result.body
        this.list = body.list
        this.total = body.total
        this.listLoading = false
      })
    },
    /**
     * 分页查询配置项数据
     */
    fetchConfigData() {
      this.configListLoading = true
      const difficult = getIdByValue(this.configDifficultList, this.searchConfigData.difficult)
      const params = {
        pageSize: this.pageConfig.size,
        pageNum: this.pageConfig.pageNumber,
        name: this.searchConfigData.name,
        difficult: difficult
      }
      selectConfigs(params).then(result => {
        const body = result.body
        this.configList = body.list
        this.configTotal = body.total * 1
        this.configListLoading = false
      })
      this.configItemList = null
    },
    /**
     * 查看组卷配置明细
     */
    findCombConfigItem(row) {
      this.configItemListLoading = true
      selectItemsByConfigId(row.id).then(result => {
        this.configItemList = result.body
        this.configItemListLoading = false
      })
    },
    /**
     * 初始获取全部试卷难度
     */
    getDifficultList() {
      // TODO: 获取全部试卷难度
      this.difficultList = [
        {
          id: '327071356621533183',
          value: '困难'
        },
        {
          id: '327071356621533182',
          value: '中等'
        },
        {
          id: '327071356621533184',
          value: '简单'
        }
      ]
    },
    /**
     * 初始获取全部试卷类型
     */
    getPaperTypeList() {
      // TODO：获取试卷类型
      this.paperTypeList = [
        {
          id: '327071356621533184',
          value: 'Java'
        },
        {
          id: '2',
          value: 'Python'
        },
        {
          id: '3',
          value: 'C#'
        }
      ]
    },
    /**
     * 获取组卷配置类型
     */
    getConfigDifficultList() {
      // TODO：获取组卷配置类型
      this.configDifficultList = [
        {
          id: '1',
          value: '简单'
        },
        {
          id: '2',
          value: '中等'
        },
        {
          id: '3',
          value: '困难'
        }
      ]
    },
    /**
     * 初始获取题目类别
     */
    getSubjectTypeList() {
      // TODO：获取题目类别
      this.subjectTypeList = [
        {
          id: '1',
          value: 'Java'
        },
        {
          id: '2',
          value: 'Python'
        },
        {
          id: '3',
          value: 'C#'
        }
      ]
    },
    /**
     * 初始获取题目类型
     */
    getSubjectCategoryList() {
      // TODO：获取题目类型
      this.subjectCategoryList = [
        {
          id: '326730406219907072',
          value: '单选'
        },
        {
          id: '326730408442888192',
          value: '多选'
        },
        {
          id: '326730410808475648',
          value: '填空'
        },
        {
          id: '326730412939182080',
          value: '主观'
        }
      ]
    },
    /**
     * 初始获取题目难度
     */
    getSubjectDifficultList() {
      // TODO：获取题目难度
      this.subjectDifficultList = [
        {
          id: '1',
          value: '简单'
        },
        {
          id: '2',
          value: '中等'
        },
        {
          id: '3',
          value: '困难'
        }
      ]
    },
    /**
     * 响应分页事件
     */
    paperConfigPagination(number) {
      this.pageConfig.pageNumber = number
      this.fetchConfigData()
    },

    // 快速组卷的方法
    /**
     * 打开快速组卷的抽屉
     */
    fastComposition() {
      this.fastDialog = true
      this.compositionType = 'fast'
      this.fetchConfigData()
    },
    /**
     * 快速组卷前的填写表单
     */
    fillPaperForm(row) {
      this.paperConfigId = row.id
      this.defaultPaperName = row.name
      console.log(this.defaultPaperName)
      this.paperFormDialog = true
    },
    /**
     * 开始快速组卷
     */
    startComposition(paperInfo) {
      this.$confirm('是否开始快速组卷?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.paperTipDialog = true
        const params = {
          id: this.paperConfigId,
          name: paperInfo.name,
          paperType: getIdByValue(this.paperTypeList, paperInfo.paperType),
          difficult: getIdByValue(this.difficultList, paperInfo.difficult),
          descript: paperInfo.descript
        }
        this.$refs.compositionLoading.init()
        this.cancelId = new Date().getTime()
        startCompositionRequest(params, this.cancelId).then(result => {
          this.$refs.compositionLoading.stopComposition('组卷成功，弹窗即将关闭！', true)
        }).catch(result => {
          this.$refs.compositionLoading.stopComposition(result.msg, false)
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消组卷'
        })
      })
    },

    // 标准组卷
    /**
     * 打开标准组卷的抽屉
     */
    normalComposition() {
      this.normalDialog = true
      this.compositionType = 'normal'
    },
    /**
     * 快速组卷前的填写表单
     */
    normalFillPaperForm() {
      this.defaultPaperName = this.normalPaperConfig.name
      this.paperFormDialog = true
    },
    /**
     * 标准组卷前校验配置项格式
     */
    validateCombConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.normalConfigItemList.length > 0) {
            this.normalFillPaperForm()
          } else {
            this.$message({
              type: 'error',
              message: '请添加配置明细！'
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '数据格式验证失败！'
          })
        }
      })
    },
    /**
     * 开始标准组卷
     */
    startNormalComposition(paperInfo) {
      this.$confirm('是否开始标准组卷?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.normalConfigItemList.forEach(item => {
          item.difficult = getIdByValue(this.subjectDifficultList, item.difficult)
          item.category = getIdByValue(this.subjectCategoryList, item.category)
          item.type = getIdByValue(this.subjectTypeList, item.type)
        })
        const params = {
          name: paperInfo.name,
          paperType: getIdByValue(this.paperTypeList, paperInfo.paperType),
          difficult: getIdByValue(this.difficultList, paperInfo.difficult),
          descript: paperInfo.descript,
          configName: this.normalPaperConfig.name,
          status: this.getStatusValue(this.normalPaperConfig.status),
          itemList: this.normalConfigItemList
        }
        this.paperTipDialog = true
        this.$refs.compositionLoading.init()
        this.cancelId = new Date().getTime()
        normalCompositionRequest(params, this.cancelId).then(result => {
          this.$refs.compositionLoading.stopComposition('组卷成功，弹窗即将关闭！', true)
        }).catch(result => {
          this.$refs.compositionLoading.stopComposition(result.msg, false)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消组卷'
        })
      })
    },

    // 标准组卷中配置明细的相关操作
    /**
     * 添加组卷明细弹框
     */
    addCombConfigItem() {
      this.addCombConfigItemDialog = true
      this.combConfigDialogStatus = true
    },
    /**
     * 修改组卷明细弹框
     */
    editCombConfigItem() {
      if (this.multipleConfigItemSelection.length === 1) {
        this.combConfigItem = JSON.parse(JSON.stringify(this.multipleConfigItemSelection[0]))
        this.addCombConfigItemDialog = true
        this.combConfigDialogStatus = false
      } else {
        this.$message({
          type: 'error',
          message: '只能选择一条配置条目数据'
        })
      }
    },
    /**
     * 删除组卷明细
     */
    deleteCombConfigItem() {
      if (this.multipleConfigItemSelection.length === 1) {
        const selectItem = JSON.parse(JSON.stringify(this.multipleConfigItemSelection[0]))
        this.normalConfigItemList.forEach((item, index, arry) => {
          if (item.id === selectItem.id) {
            arry.splice(index, 1)
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '只能选择一条配置条目数据'
        })
      }
    },
    /**
     * 添加配置项条目数据
     */
    addCombConfigItemData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const configItem = JSON.parse(JSON.stringify(this.combConfigItem))
          if (this.combConfigDialogStatus) {
            // 添加
            configItem.id = this.configItemCount
            this.normalConfigItemList.push(configItem)
            this.configItemCount++
          } else {
            // 修改
            this.normalConfigItemList.forEach((item, index) => {
              if (item.id === configItem.id) {
                this.normalConfigItemList.splice(index, 1, configItem)
              }
            })
          }
          this.exitAddCombConfigItem(formName)
        } else {
          this.$message({
            type: 'error',
            message: '数据格式验证失败！'
          })
        }
      })
    },
    /**
     * 退出配置项目条目的窗口
     * 重置 combConfigItem
     */
    exitAddCombConfigItem(formName) {
      this.addCombConfigItemDialog = false
      this.$refs[formName].resetFields()
    },

    /**
     * 填写完试卷信息的回调方法
     */
    getPaperInfo(paperInfo) {
      if (this.compositionType === 'fast') {
        this.startComposition(paperInfo)
      } else if (this.compositionType === 'normal') {
        this.startNormalComposition(paperInfo)
      }
    },
    /**
     * 取消组卷请求
     */
    cancelCompositionRequest() {
      cancel(this.cancelId, '取消组卷请求')
      // TODO: 这里要取消后端的请求
    },

    // 模板组卷
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

    // 试卷详情
    /**
     * 查看试卷详情
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
     * 返回Status Value的工具方法
     */
    getStatusValue(value) {
      return value === '启用' ? 1 : 0
    },

    // 键盘或者鼠标的响应事件
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

    // 同步数据表格左侧的多选框
    /**
     * 获取表格选取的数据
     */
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    /**
     * 获取配置条目表格选取的数据
     */
    handleConfigItemSelectionChange(selection) {
      this.multipleConfigItemSelection = selection
    },

    // 同步父子组件中值的方法，基本为控制弹窗的打开与关闭
    /**
     * 同步试卷预览的值
     * @param val
     */
    showChange(val) {
      this.paperDetailDialog = val
    },
    /**
     * 同步组卷提示弹框的值
     * @param val
     */
    showCompositionLoading(val) {
      this.paperTipDialog = val
    },
    /**
     * 同步试卷表单弹框的值
     * @param val
     */
    showPaperFormDialog(val) {
      this.paperFormDialog = val
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerClass {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  .drawer-content {
    flex-grow: 1;
  }
  .drawer-footer {
    margin-bottom: 15px;
    margin-right: 20px;
    display: flex;
    justify-content: flex-end;
  }
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

