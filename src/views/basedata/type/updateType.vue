<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改题目类型</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <span style="font-size:15px; color: blue; ">基本信息</span>
    </el-col>
    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :label-position="left" :rules="rules" :model="form" label-width="80px" size="mini" style="padding-left:30%;">
        <el-form-item label="题目类型" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>
        <el-form-item label="属性">
          <el-select v-model="form.attribute" placeholder="请选择">
            <el-option
              v-for="item in attributeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import { update } from '@/api/basedata/type'
import { questionType } from '@/utils/subjectType'
export default {
  data() {
    return {
      form: {
        id: this.$route.params.id,
        name: this.$route.params.name,
        remark: this.$route.params.remark,
        status: this.$route.params.status.toString(),
        attribute: this.$route.params.attribute
      },
      attributeList: [
        {
          value: questionType.QUESTION_FILL_BLANK,
          label: questionType.QUESTION_FILL_BLANK
        },
        {
          value: questionType.QUESTION_JUDGE,
          label: questionType.QUESTION_JUDGE
        },
        {
          value: questionType.QUESTION_MULTIPLE_CHOICE,
          label: questionType.QUESTION_MULTIPLE_CHOICE
        },
        {
          value: questionType.QUESTION_SINGLE_CHOICE,
          label: questionType.QUESTION_SINGLE_CHOICE
        },
        {
          value: questionType.QUESTION_SUBJECTIVE,
          label: questionType.QUESTION_SUBJECTIVE
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入题目类型', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
       * 路由跳转
       */
    save() {
      console.log(this.form)
      update(this.form).then(() => {
        this.$router.push({
          name: 'Type'
        })
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '操作失败!'
        })
      })
    },
    close() {
      this.$router.push({
        name: 'Type'
      })
      this.$message({
        type: 'warning',
        message: '操作取消!'
      })
    }
  }
}
</script>
