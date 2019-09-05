<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">新增数据字典</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <span style="font-size:15px; color: blue; ">基本信息</span>
    </el-col>

    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px" label-position="left" size="mini" style="padding-left:30%;">

        <el-form-item label="字典名称" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>

        <el-form-item label="字典类型" prop="category">
          <el-col :span="8">
            <el-input v-model="form.category" />
          </el-col>
        </el-form-item>

        <el-form-item label="字典值" prop="value">
          <el-col :span="8">
            <el-input v-model="form.value" />
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
            <el-input v-model="form.remark" type="textarea" :rows="10" placeholder="请输入内容" />
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
import { insert } from '@/api/basedata/dictionary'
export default {
  data() {
    return {
      form: {
        name: '',
        category: '',
        value: '',
        remark: '',
        status: '1'
      },
      rules: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入字典类型', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ]
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
      const params = {
        name: this.form.name,
        category: this.form.category,
        value: this.form.value,
        remark: this.form.remark,
        status: this.form.status
      }
      console.log(params)
      insert(params).then(result => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$router.push({
          name: 'Dictionary'
        })
      }).catch(result => {
        this.$message({
          type: 'success',
          message: '操作失败!'
        })
      })
    },
    close() {
      this.$router.push({
        name: 'Dictionary'
      })
    }
  }
}
</script>
