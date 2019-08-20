<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">新增组织机构</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">组织机构基本信息</font>
    </el-col>
    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        size="mini"
        class="demo-ruleForm"
        label-position="right"
        style="padding-left:30%;"
      >
        <el-form-item label="机构名称" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>

        <el-form-item label="机构代码" prop="code">
          <el-col :span="8">
            <el-input v-model="form.code" />
          </el-col>
        </el-form-item>

        <el-form-item label="负责人" prop="master">
          <el-col :span="8">
            <el-input v-model="form.master" />
          </el-col>
        </el-form-item>

        <el-form-item label="电话" prop="tel">
          <el-col :span="8">
            <el-input v-model="form.tel" />
          </el-col>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-col :span="8">
            <el-input v-model="form.address" />
          </el-col>
        </el-form-item>

        <!--复选按钮 -->
        <el-form-item label="是否启用">
          <el-col :offset="1" :span="8">
            <el-radio-group v-model="form.status">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <!-- 按钮组件 -->
        <el-form-item>
          <el-col :offset="1" :span="8">
            <el-button type="primary" @click="submitForm('form')">保存</el-button>
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
        code: '',
        master: '',
        tel: '',
        address: '',
        status: '1'
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入组织机构名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入组织机构名',
            trigger: 'change'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        status: [
          {
            type: 'date',
            required: true,
            message: '请选择启用标记',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    /**
		 * 路由跳转
		 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$router.push({
            name: 'org'
          })
          this.$message('操作成功')
          console.log(this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    save() {
      this.$router.push({
        name: 'org'
      })
      this.$message('操作成功')
    },
    close() {
      this.$router.push({
        name: 'org'
      })
    }
  }
}
</script>
