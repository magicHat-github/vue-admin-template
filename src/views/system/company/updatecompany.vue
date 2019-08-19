<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改公司基本信息</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">公司的基本信息</font>
    </el-col>
    <div class="app-container allData">
      <hr>
      <!--表单输入 -->
      <el-form
        ref="companyForm"
        :model="companyForm"
        :rules="companyRules"
        label-width="100px"
        class="user-add-Form"
        label-position="left"
      >
        <!-- 第一行 -->
        <el-row type="flex" justify="space-around">
          <!-- 公司名输入框 -->
          <el-col :span="10">
            <el-form-item label="公司名:" prop="name">
              <el-input v-model="companyForm.name" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 公司编号输入框 -->
          <el-col :span="10">
            <el-form-item label="公司编号:" prop="code">
              <el-input v-model="companyForm.code" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row type="flex" justify="space-around">
          <!-- 助记码输入框 -->
          <el-col :span="10">
            <el-form-item label="助记码:" prop="mnemonic_code">
              <el-input v-model="companyForm.mnemonic_code" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 法人下拉框 -->
          <el-col :span="10">
            <el-form-item label="法人:" prop="master">
              <el-select v-model="companyForm.master" placeholder="请选择">
                <el-option
                  v-for="position in positions"
                  :key="position.name"
                  :label="position.name"
                  :value="position.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row type="flex" justify="space-around">
          <!-- 税号输入框 -->
          <el-col :span="10">
            <el-form-item label="税号:" prop="tax">
              <el-input v-model="companyForm.tax" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 传真输入框 -->
          <el-col :span="10">
            <el-form-item label="传真:" prop="fax">
              <el-input v-model="companyForm.fax" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row type="flex" justify="space-around">
          <!-- 电话输入框 -->
          <el-col :span="10">
            <el-form-item label="电话:">
              <el-input v-model="companyForm.tel" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 地址输入框 -->
          <el-col :span="10">
            <el-form-item label="地址:">
              <el-input v-model="companyForm.address" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <!-- 所属机构输入框 -->
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="所属机构:" prop="org_name">
              <el-input v-model="companyForm.org_name" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- 邮箱输入框 -->
            <el-form-item label="邮箱:" prop="email">
              <el-input v-model="companyForm.email" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 -->
        <!--复选按钮 -->
        <el-row>
          <el-col :span="8" :offset="1">
            <el-form-item label="是否启用:">
              <el-radio v-model="companyForm.status" label="1">是</el-radio>
              <el-radio v-model="companyForm.status" label="2">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第八行 -->
        <!-- 按钮组件 -->
        <el-row :gutter="0">
          <el-form-item>
            <el-col :span="4" :offset="8">
              <el-button type="primary" @click="submitForm('companyForm')">保存</el-button>
            </el-col>
            <el-col :span="4">
              <el-button @click="close">关闭</el-button>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /**
       * 表单数据
       */
      companyForm: {
        name: '',
        code: '',
        mnemonic_code: '',
        master: '',
        tax: '',
        fax: '',
        tel: '',
        address: '',
        org_name: '',
        email: '',
        status: '1'
      },
      /**
       * 表单校验规则
       */
      companyRules: {
        name: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        mnemonic_code: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        master: [
          { required: true, message: '请输入职位', trigger: 'change' }
        ],
        tax: [
          { required: true, message: '请输入性别', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        fax: [
          { required: true, message: '请输入生日', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        org_name: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      /**
       * 职位下拉框选项
       */
      positions: [{ name: '鼓励师' }, { name: '搬砖人' }],
      /**
       * 角色下拉框选项
       */
      roles: [{ name: '鼓励师' }, { name: '搬砖人' }]
    }
  },
  methods: {
    /**
     * 保存按钮
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
          this.submit()
        } else {
          console.log(this.userForm.status)
          return false
        }
      })
    },
    submit() {
      this.$router.push({
        name: 'Company'
      })
      this.$message('操作成功')
    },
    /**
     * 关闭按钮
     */
    close() {
      this.$router.push({
        name: 'Company'
      })
    }
  }
}
</script>
