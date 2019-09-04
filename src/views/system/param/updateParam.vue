<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改参数</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">基本信息</font>
    </el-col>

    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" size="mini" style="padding-left:30%;">

        <el-form-item label="参数类型" prop="paramType">
          <el-col :span="8">
            <el-input v-model="form.paramType" />
          </el-col>
        </el-form-item>

        <el-form-item label="参数项" prop="paramName">
          <el-col :span="8">
            <el-input v-model="form.paramName" />
          </el-col>
        </el-form-item>

        <el-form-item label="参数值" prop="value">
          <el-col :span="8">
            <el-input v-model="form.value" />
          </el-col>
        </el-form-item>

        <!--单选按钮 -->
        <el-form-item label="是否启用" prop="status">
          <el-col :offset="1" :span="8">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item label="备注信息">
          <el-col :span="8">
            <el-input v-model="form.remark" type="textarea" :rows="10" />
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
import { updateItem } from '@/api/system/param'
export default {
  data() {
    return {
      form: {
        id: this.$route.params.id,
        paramName: this.$route.params.paramName,
        paramType: this.$route.params.paramType,
        value: this.$route.params.value,
        remark: this.$route.params.remark,
        status: this.$route.params.status
      },
      rules: {
        paramType: [
          { required: true, message: '请输入参数类型', trigger: 'blur' }
        ],
        paramName: [
          { required: true, message: '请输入参数项', trigger: 'blur' }
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
      const params = {
        id: this.form.id,
        name: this.form.name,
        category: this.form.category,
        value: this.form.value,
        status: this.form.status,
        remark: this.form.remark
      }
      console.log(params)
      updateItem(params).then(result => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.$router.push({
          name: 'Param'
        })
      }).catch(result => {
        this.$message({
          type: 'success',
          message: '修改失败!'
        })
      })
    },
    close() {
      this.$router.push({
        name: 'Param'
      })
    }
  }
}
</script>
