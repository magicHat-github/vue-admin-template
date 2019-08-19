<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">新增用户</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">基本信息</font>
    </el-col>
    <div class="app-container allData">
      <hr>
      <!--表单输入 -->
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
        class="user-add-Form"
        label-position="left"
      >
        <!-- 第一行 -->
        <el-row type="flex" justify="space-around">
          <!-- 工号输入框 -->
          <el-col :span="10">
            <el-form-item label="用户工号:" prop="code">
              <el-input v-model="userForm.code" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 密码输入框 -->
          <el-col :span="10">
            <el-form-item label="初始密码:" prop="password">
              <el-input v-model="userForm.password" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row type="flex" justify="space-around">
          <!-- 姓名输入框 -->
          <el-col :span="10">
            <el-form-item label="用户名:" prop="name">
              <el-input v-model="userForm.name" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 职位下拉框 -->
          <el-col :span="10">
            <el-form-item label="职位:" prop="position">
              <el-select v-model="userForm.position" placeholder="请选择">
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
          <!-- 性别输入框 -->
          <el-col :span="10">
            <el-form-item label="性别:" prop="sex">
              <el-input v-model="userForm.sex" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 生日输入框 -->
          <el-col :span="10">
            <el-form-item label="生日:" prop="birthday">
              <el-input v-model="userForm.birthday" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row type="flex" justify="space-around">
          <!-- 电话输入框 -->
          <el-col :span="10">
            <el-form-item label="电话:" prop="tel">
              <el-input v-model="userForm.tel" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 邮箱输入框 -->
          <el-col :span="10">
            <el-form-item label="邮箱:" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <!-- 其它/微信输入框 -->
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="其它/微信:">
              <el-input v-model="userForm.other" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="拥有角色:">
              <el-select v-model="userForm.roles" filterable multiple placeholder="请选择">
                <el-option v-for="role in roles" :key="role.name" :value="role.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行 -->
        <!-- 备注栏 -->
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="备注:">
              <el-input v-model="userForm.remark" type="textarea" :rows="2" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 -->
        <!--复选按钮 -->
        <el-row>
          <el-col :span="8" :offset="1">
            <el-form-item label="是否启用:">
              <el-radio v-model="userForm.status" label="1">是</el-radio>
              <el-radio v-model="userForm.status" label="2">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第八行 -->
        <!-- 按钮组件 -->
        <el-row :gutter="0">
          <el-form-item>
            <el-col :span="4" :offset="8">
              <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
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
      userForm: {
        code: '',
        name: '',
        password: '',
        position: '',
        birthday: '',
        tel: '',
        sex: '',
        email: '',
        other: '',
        remark: '',
        status: '1'
      },
      /**
       * 表单校验规则
       */
      userRules: {
        code: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入职位', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请输入性别', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请输入生日', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        tel: [
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
        name: 'User'
      })
      this.$message('操作成功')
    },
    /**
     * 关闭按钮
     */
    close() {
      this.$router.push({
        name: 'User'
      })
    }
  }
}
</script>
