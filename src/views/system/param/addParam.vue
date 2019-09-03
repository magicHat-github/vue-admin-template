<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">新增系统参数</h1>
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
            <el-input v-model="form.paramType" placeholder="请输入参数类型" />
          </el-col>
        </el-form-item>

        <el-form-item label="参数项" prop="paramName">
          <el-col :span="8">
            <el-input v-model="form.paramName" placeholder="请输入参数项" />
          </el-col>
        </el-form-item>

        <el-form-item label="参数值" prop="value">
          <el-col :span="8">
            <el-input v-model="form.value" placeholder="请输入参数值" />
          </el-col>
        </el-form-item>

        <!--单选按钮 -->
        <el-form-item label="是否启用" prop="status">
          <el-col :offset="1" :span="8">
            <el-radio-group v-model="form.status">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item label="备注信息">
          <el-col :span="8">
            <el-input v-model="form.remark" type="textarea" :rows="10" placeholder="备注信息" />
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
import { insert } from '@/api/system/param'
export default {
  data() {
    return {
      form: {
        paramType: '',
        paramName: '',
        value: '',
        remark: '',
        status: '1'
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
        paramType: this.form.paramTye,
        paramName: this.form.paramName,
        value: this.form.value,
        remark: this.form.remark,
        status: this.form.status
      }
      console.log(params)
      insert(params).then(result => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.$router.push({
          name: 'Param'
        })
      }).catch(result => {
        this.$message({
          type: 'success',
          message: '添加失败!'
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
