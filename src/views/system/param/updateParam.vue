<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">更新系统参数</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">基本信息</font>
    </el-col>

    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" size="mini" style="padding-left:30%;">

        <el-form-item label="父参数类型" prop="parentType">
          <el-col :span="8">
            <el-input v-model="form.parentType" />
          </el-col>
        </el-form-item>

        <el-form-item label="子参数类型" prop="childType">
          <el-col :span="8">
            <el-input v-model="form.childType" />
          </el-col>
        </el-form-item>

        <el-form-item label="参数值" prop="value">
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
            <el-radio v-model="stats" label="2">否</el-radio>
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
        parentType: '',
        childType: '',
        value: '',
        remark: '',
        status: '1'
      },
      rules: {
        parentType: [
          { required: true, message: '请输入父参数类型', trigger: 'blur' }
        ],
        childType: [
          { required: true, message: '请输入子参数类型', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
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
        name: 'Param'
      })
      this.$message('操作成功')
    },
    close() {
      this.$router.push({
        name: 'Param'
      })
    }
  }
}
</script>
