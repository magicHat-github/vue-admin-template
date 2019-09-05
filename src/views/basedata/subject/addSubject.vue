<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">增加题目</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <span style="font-size:15px; color: blue; ">基本信息</span>
    </el-col>
    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-card class="tableData">
        <el-form ref="form" :label-position="left" :rules="rules" :model="form" label-width="80px" size="mini">
          <el-row>
            <el-col :span="8">
              <el-form-item label="题目类别">
                <el-cascader
                  v-model="form.category"
                  :options="categoryList"
                  :props="{ checkStrictly: true }"
                  :show-all-levels="false"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="题型">
                <el-select v-model="form.type" filterable placeholder="请选择">
                  <el-option
                    v-for="type in typeList"
                    :key="type.name"
                    :label="type.name"
                    :value="type.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="难度">
                <el-select v-model="form.difficult" filterable placeholder="请选择">
                  <el-option
                    v-for="difficult in difficultList"
                    :key="difficult.value"
                    :label="difficult.value"
                    :value="difficult.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="题目">
              <el-input
                v-model="form.name"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col span="24">
              <el-form-item label="题目答案">
                <el-row>
                  <el-col :offset="11">
                    <el-button type="warning" @click="addAnswer">新增</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-col span="24">
                <el-form-item
                  v-for="(answer, index) in form.answers"
                  :key="answer.key"
                  :label="'答案' + index"
                  :prop="'answers.' + index + '.value'"
                >
                  <el-col :span="16">
                    <el-input
                      v-model="answer.answer"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入答案内容"
                    />
                  </el-col>
                  <el-col :span="4" offset="1">
                    <el-switch
                      v-model="answer.rightAnswer"
                      style="display: block"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="正 确"
                      inactive-text="错 误"
                    />
                  </el-col>
                  <el-button type="danger" @click.prevent="removeAnswer(answer)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="上传图片">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :auto-upload="false"
                >
                  <el-button slot="trigger" style="margin-left: 90px;" size="small" type="primary">选取文件</el-button>
                  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注信息">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="12">
              <!--复选按钮 -->
              <el-form-item label="是否启用" prop="status">
                <el-radio v-model="form.status" label="1">是</el-radio>
                <el-radio v-model="form.status" label="2">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 按钮组件 -->
              <el-form-item>
                <el-col :offset="1" :span="8">
                  <el-button type="primary" @click="save">保存</el-button>
                  <el-button @click="close">关闭</el-button>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>

</template>

<script>
import { searchCategoryTree, selectType, selectDifficult, insert } from '@/api/basedata/subject'
export default {
  data() {
    return {
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      form: {
        name: '',
        remark: '',
        status: '1',
        category: '',
        type: '',
        difficult: '',
        answers: [{
          key: '',
          answer: '',
          rightAnswer: false
        }]
      },
      categoryList: null,
      typeList: null,
      difficultList: null,
      rules: {
        category: [
          { required: true, message: '请输入题目类别', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入题目类型', trigger: 'blur' }
        ],
        difficult: [
          { required: true, message: '请输入题目难度', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '请输入题目内容', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入题目类别', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '选项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.searchInline()
  },
  methods: {
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
    save() {
      const params = {
        name: this.form.name,
        status: this.form.status,
        dictionaryId: this.form.difficult,
        subjectTypeId: this.form.type,
        categoryId: this.form.category.pop(),
        remark: this.form.remark,
        answerList: this.form.answers
      }
      console.log(params)
      insert(params).then(() => {
        this.$router.push({
          name: 'Subject'
        })
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '操作失败'
        })
      })
    },
    close() {
      this.$router.push({
        name: 'Subject'
      })
      this.$message('取消操作')
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    removeAnswer(item) {
      const index = this.form.answers.indexOf(item)
      if (index !== -1) {
        this.form.answers.splice(index, 1)
      }
    },
    addAnswer() {
      this.form.answers.push({
        id: '',
        answer: '',
        rightAnswer: false
      })
    }
  }
}
</script>
