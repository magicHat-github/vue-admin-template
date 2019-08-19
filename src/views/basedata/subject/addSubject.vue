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
      <el-form ref="form" :label-position="left" :rules="rules" :model="form" label-width="80px" size="mini" style="padding-left:30%;">
        <el-form-item label="题目类别" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>
        <el-form-item label="题型" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>
        <el-form-item label="难度" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>
        <el-form-item label="题目">
          <el-col :span="8">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="选项：">
          <el-button type="primary" @click="addOption">新增选项</el-button>
        </el-form-item>
        <el-form-item
          v-for="(option, index) in optionForm.options"
          :key="option.key"
          :label="'选项' + index"
          :prop="'options.' + index + '.value'"
        >
          <el-col :span="8">
            <el-input v-model="option.value" />
          </el-col>
          <el-button type="danger" @click.prevent="removeOption(option)">删除</el-button>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-col :offset="1" :span="8">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="答案：">
          <el-button type="warning" @click="addAnswer">新增答案</el-button>
        </el-form-item>
        <el-form-item
          v-for="(answer, index) in answerForm.answers"
          :key="answer.key"
          :label="'答案' + index"
          :prop="'answers.' + index + '.value'"
        >
          <el-col :span="8">
            <el-input v-model="answer.value" />
          </el-col>
          <el-button type="danger" @click.prevent="removeAnswer(answer)">删除</el-button>
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
        <!-- 按钮组件 -->
        <el-form-item>
          <el-col :offset="1" :span="8">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="close">关闭</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      form: {
        name: '',
        remark: '',
        status: '1'
      },
      rules: {
        name: [
          { required: true, message: '请输入题目类别', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '选项不能为空', trigger: 'blur' }
        ]
      },
      optionForm: {
        options: [{
          value: ''
        }]
      },
      answerForm: {
        answers: [{
          value: ''
        }]
      }
    }
  },
  methods: {
    /**
       * 路由跳转
       */
    onSubmit() {
      console.log('submit!')
    },
    save() {
      this.$router.push({
        name: 'Category'
      })
      this.$message('操作成功')
    },
    close() {
      this.$router.push({
        name: 'Category'
      })
    },
    removeOption(item) {
      const index = this.optionForm.options.indexOf(item)
      if (index !== -1) {
        this.optionForm.options.splice(index, 1)
      }
    },
    addOption() {
      this.optionForm.options.push({
        value: '',
        key: Date.now()
      })
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
      const index = this.answerForm.answers.indexOf(item)
      if (index !== -1) {
        this.answerForm.answers.splice(index, 1)
      }
    },
    addAnswer() {
      this.answerForm.answers.push({
        value: '',
        key: Date.now()
      })
    }
  }
}
</script>
