<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改数据字典</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">基本信息</font>
    </el-col>

    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left" size="mini" style="padding-left:30%;">

        <el-form-item label="字典名称" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>

        <el-form-item label="字典类型" prop="type">
          <el-col :span="8">
            <el-input v-model="form.type" />
          </el-col>
        </el-form-item>

        <el-form-item label="字典值" prop="value">
          <el-col :span="8">
            <el-input v-model="form.value" />
          </el-col>
        </el-form-item>

        <el-form-item label="备注信息">
          <el-col :span="8">
            <el-input v-model="form.remark" type="textarea" :rows="3" />
          </el-col>
        </el-form-item>

        <!--复选按钮 -->
        <el-form-item label="是否启用" prop="status">
          <el-col :offset="1" :span="8">
            <el-radio v-model="status" label="1">是</el-radio>
            <el-radio v-model="status" label="2">否</el-radio>
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
      form: {
        name: '',
        type: '',
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
      this.$router.push({
        name: 'Dictionary'
      })
      this.$message('更新成功')
    },
    close() {
      this.$router.push({
        name: 'Dictionary'
      })
    }
  }
}
</script>
