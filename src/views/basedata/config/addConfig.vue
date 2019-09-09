<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">增加组卷配置</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <span style="font-size:15px; color: blue; ">基本信息</span>
    </el-col>
    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :label-position="left" :rules="rules" :model="form" size="mini">
        <el-form-item label="配置项名称" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>
        <!--复选按钮 -->
        <el-form-item label="是否启用" prop="status">
          <el-col :offset="1" :span="8">
            <el-radio v-model="form.status" label="1">是</el-radio>
            <el-radio v-model="form.status" label="2">否</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-col :span="8">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="10"
              placeholder="请输入内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="添加配置信息" />
        <el-form-item>
          <el-card class="tableData">
            <!-- 增删改按钮框 -->
            <div>
              <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addConfigDialog=true">增加</el-link>
              <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCheck">删除</el-link>
              <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateCheck">修改</el-link>
            </div>
            <!--添加弹窗-->
            <el-dialog title="添加配置详情" :visible.sync="addConfigDialog" :show-close="false">
              <el-form ref="form" :model="detailForm" size="mini">
                <el-form-item label="题目类别">
                  <el-cascader
                    v-model="detailForm.categoryId"
                    :options="categoryList"
                    :props="{ checkStrictly: true }"
                    :show-all-levels="false"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="题型">
                  <el-select v-model="detailForm.subjectTypeId" filterable placeholder="请选择">
                    <el-option
                      v-for="type in typeList"
                      :key="type.name"
                      :label="type.name"
                      :value="type.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="题目数量">
                  <el-col :span="8">
                    <el-input v-model="detailForm.num" placeholder="请输入内容" />
                  </el-col>
                </el-form-item>
                <el-form-item label="难度">
                  <el-select v-model="detailForm.difficult" filterable placeholder="请选择">
                    <el-option
                      v-for="difficult in difficultList"
                      :key="difficult.value"
                      :label="difficult.value"
                      :value="difficult.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="题目分值">
                  <el-col :span="8">
                    <el-input v-model="detailForm.score" placeholder="请输入内容" />
                  </el-col>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="addDetail">确 定</el-button>
              </div>
            </el-dialog>
            <!--修改弹窗-->
            <el-dialog title="修改配置信息" :visible.sync="updateConfigDialog" :show-close="false">
              <el-form ref="form" :model="detailForm" size="mini">
                <el-form-item label="题目类别">
                  <el-cascader
                    v-model="detailForm.categoryId"
                    :options="categoryList"
                    :props="{ checkStrictly: true }"
                    :show-all-levels="false"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="题型">
                  <el-select v-model="detailForm.subjectTypeId" filterable placeholder="请选择" value="">
                    <el-option
                      v-for="type in typeList"
                      :key="type.name"
                      :label="type.name"
                      :value="type.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="题目数量">
                  <el-col :span="8">
                    <el-input v-model="detailForm.num" placeholder="请输入内容" />
                  </el-col>
                </el-form-item>
                <el-form-item label="难度">
                  <el-select v-model="detailForm.difficult" filterable placeholder="请选择">
                    <el-option
                      v-for="difficult in difficultList"
                      :key="difficult.value"
                      :label="difficult.value"
                      :value="difficult.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="题目分值">
                  <el-col :span="8">
                    <el-input v-model="detailForm.score" placeholder="请输入内容" />
                  </el-col>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdate">取 消</el-button>
                <el-button type="primary" @click="updateDetail">确 定</el-button>
              </div>
            </el-dialog>
            <!--显示-->
            <el-table
              ref="multipleTable"
              :data="configDetailList"
              tooltip-effect="dark"
              stripe
              height
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" fixed="left" />
              <el-table-column prop="categoryId" label="题目类别" />
              <el-table-column prop="subjectTypeId" label="题型" />
              <el-table-column prop="num" label="题目数量" />
              <el-table-column prop="difficult" label="题目难度" />
              <el-table-column prop="score" label="题目分值" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addConfigDialog=true" />
                  <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateItem(scope.row)" />
                  <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteDetail(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form-item>
        <!-- 按钮组件 -->
        <el-form-item>
          <el-col :offset="11" :span="8">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="close">关闭</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { searchCategoryTree, selectType, selectDifficult } from '@/api/basedata/subject'
import { insert } from '@/api/basedata/config'
// import { idToValueConversionFilter } from '@/utils/index'
export default {
  data() {
    return {
      categoryList: null,
      typeList: null,
      difficultList: null,
      addConfigDialog: false,
      updateConfigDialog: false,
      form: {
        name: '',
        remark: '随机',
        status: '1'
      },
      detailForm: {
        formId: '',
        id: '',
        categoryId: '',
        subjectTypeId: '',
        num: '',
        difficult: '',
        score: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入配置项名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ]
      },
      configDetailList: [],
      detailCount: 0,
      // configDetailList: [
      //   {
      //     category: '1',
      //     type: '1',
      //     num: '1',
      //     difficult: '1',
      //     score: '1'
      //   },
      //   {
      //     category: '2',
      //     type: '1',
      //     num: '1',
      //     difficult: '1',
      //     score: '1'
      //   }
      // ],

      /**
       * 待确认字段
       */
      multipleSelection: []
    }
  },
  created() {
    this.searchInline()
  },
  methods: {
    addDetail() {
      this.configDetailList.push({
        categoryId: this.detailForm.categoryId.pop(),
        subjectTypeId: this.detailForm.subjectTypeId,
        num: this.detailForm.num,
        difficult: this.detailForm.difficult,
        score: this.detailForm.score,
        formId: this.detailCount,
        id: ''
      })
      this.detailForm = []
      this.addConfigDialog = false
      this.detailCount++
      console.log(this.configDetailList)
    },
    cancelAdd() {
      this.detailForm = []
      this.addConfigDialog = false
    },
    updateDetail() {
      if (this.detailForm.id !== '') {
        this.configDetailList.forEach((item, index) => {
          if (item.id === this.detailForm.id) {
            this.configDetailList.splice(index, 1, this.detailForm)
          }
        })
      } else if (this.detailForm.formId !== '') {
        this.configDetailList.forEach((item, index) => {
          if (item.formId === this.detailForm.formId) {
            this.configDetailList.splice(index, 1, this.detailForm)
          }
        })
      }
      this.detailForm = []
      this.updateConfigDialog = false
    },
    cancelUpdate() {
      this.detailForm = []
      this.updateConfigDialog = false
    },
    updateItem(row) {
      this.updateConfigDialog = true
      if (row.id !== '') {
        this.configDetailList.forEach(item => {
          if (item.id === row.id) {
            this.detailForm = item
          }
        })
      } else if (row.formId !== '') {
        this.configDetailList.forEach(item => {
          if (item.formId === row.formId) {
            this.detailForm = item
          }
        })
      }
    },
    /**
     * 查询题目类别、题型、难度
     */
    searchInline() {
      searchCategoryTree().then(result => {
        const body = result.body
        this.categoryList = body.treeData
      })
      const params = {
        name: '',
        pageSize: 1000000,
        pageNum: 1
      }
      selectType(params).then(result => {
        const body = result.body
        this.typeList = body.dataList
      })
      const params2 = {
        name: '题目难度',
        category: '题目难度',
        pageSize: 1000000,
        pageNum: 1
      }
      selectDifficult(params2).then(result => {
        const body = result.body
        this.difficultList = body.dictionaries.dataList
        console.log(this.difficultList)
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
        this.updateItem(this.multipleSelection[0])
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
        this.$confirm('是否要删除选定信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.multipleSelection.forEach(item => {
              this.configDetailList.forEach((config, index, arry) => {
                if (item.id !== '') {
                  if (item.id === config.id) {
                    arry.splice(index, 1)
                  }
                } else if (item.formId !== '') {
                  if (item.formId === config.formId) {
                    arry.splice(index, 1)
                  }
                }
              })
            })
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
    },
    save() {
      const params = {
        name: this.form.name,
        status: this.form.status,
        remark: this.form.remark,
        configDetailList: this.configDetailList
      }
      console.log(params)
      insert(params).then(() => {
        this.$router.push({
          name: 'Config'
        })
        this.$message('操作成功')
      }).catch(() => {
        this.$message('操作失败')
      })
    },
    close() {
      this.$router.push({
        name: 'Config'
      })
    },
    /**
     * 勾选事件触发的函数
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * 删除信息
     */
    deleteDetail(row) {
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.detailForm.id !== '') {
            this.configDetailList.forEach((item, index, arry) => {
              if (item.id === row.id) {
                arry.splice(index, 1)
              }
            })
          } else if (this.detailForm.formId !== '') {
            this.configDetailList.forEach((item, index, arry) => {
              if (item.formId === row.formId) {
                arry.splice(index, 1)
              }
            })
          }
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
