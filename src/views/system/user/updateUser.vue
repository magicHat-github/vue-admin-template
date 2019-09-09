<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改用户</h1>
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
        <el-row>
          <!-- 工号输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="用户工号" prop="code">
              <el-input v-model="userForm.code" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 密码输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="初始密码" prop="password">
              <el-input v-model="userForm.password" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row>
          <!-- 姓名输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="userForm.name" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 职位下拉框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="职位" prop="positionName">
              <el-select
                v-model="userForm.position"
                value-key="id"
                clearable
                filterable
                placeholder="请选择"
                @visible-change="$forceUpdate()"
              >
                <el-option
                  v-for="position in computedPositions"
                  :key="position.id"
                  :label="position.name"
                  :value="position"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row>
          <!-- 电话输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="电话" prop="tel">
              <el-input v-model="userForm.tel" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 邮箱输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row>
          <el-col :span="7" :offset="3">
            <el-form-item label="所属公司" prop="companyName">
              <el-select
                v-model="userForm.company"
                value-key="id"
                clearable
                filterable
                placeholder="请选择"
                @visible-change="$forceUpdate()"
                @change="computeCompany"
              >
                <el-option
                  v-for="company in computedCompanys"
                  :key="company.id"
                  :label="company.name"
                  :value="company"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="2">
            <el-form-item label="所属部门" prop="departmentName">
              <el-select
                v-model="userForm.departmentName"
                value-key="id"
                filterable
                clearable
                placeholder="请选择"
                @visible-change="$forceUpdate()"
                @change="computeDepartment"
              >
                <el-option
                  v-for="department in computedDepartments"
                  :key="department.id"
                  :label="department.name"
                  :value="department"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row>
          <!-- 拥有角色下拉框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="拥有角色" prop="roles">
              <el-select
                v-model="userForm.roles"
                value-key="name"
                filterable
                multiple
                placeholder="请选择"
                @visible-change="$forceUpdate()"
              >
                <el-option
                  v-for="role in roles"
                  :key="role.name"
                  :label="role.name"
                  :value="role.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 其它/微信输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="其它/微信">
              <el-input v-model="userForm.other" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行 -->
        <el-row>
          <el-col :span="7" :offset="3">
            <!-- 生日输入框 -->
            <el-form-item label="生日">
              <div class="block">
                <el-date-picker v-model="userForm.birthday" type="date" placeholder="选择日期" />
              </div>
            </el-form-item>
          </el-col>
          <!-- 备注栏 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="备注">
              <el-input v-model="userForm.remark" type="textarea" :rows="2" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 -->
        <!-- 性别输入框 -->
        <el-row>
          <el-col :span="7" :offset="3">
            <el-form-item label="性别">
              <el-radio v-model="userForm.sex" label="0">男</el-radio>
              <el-radio v-model="userForm.sex" label="1">女</el-radio>
            </el-form-item>
          </el-col>
          <!--复选按钮 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="是否启用">
              <el-radio v-model="userForm.status" label="1">是</el-radio>
              <el-radio v-model="userForm.status" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第九行 -->
        <!-- 按钮组件 -->
        <el-row :gutter="0">
          <el-form-item>
            <el-col :span="3" :offset="8">
              <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
            </el-col>
            <el-col :span="3">
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
    /**
     * 手机验证
     */
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    /**
     * 邮箱验证
     */
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请正确填写邮箱'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (!reg.test(value)) {
            callback(new Error('请输入有效的邮箱'))
          }
        }
        callback()
      }
    }
    return {
      /**
       * 表单数据
       */
      userForm: {
        code: '',
        name: '',
        password: '123456',
        position: '',
        birthday: '',
        tel: '',
        sex: '0',
        email: '',
        other: '',
        remark: '',
        department: '',
        company: '',
        roles: [],
        status: '1'
      },
      /**
       * 表单校验规则
       */
      userRules: {
        code: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        positionName: [
          { required: true, message: '请选择职位', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        departmentName: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      },
      /**
       * 职位下拉框选项
       */
      positions: [],
      /**
       * 计算过后的职位选项
       */
      computedPositions: [],
      /**
       * 所有公司下拉框选项
       */
      companys: [],
      /**
       * 计算过后的公司选项
       */
      computedCompanys: [],
      /**
       * 部门下拉框选项
       */
      departments: [],
      /**
       * 计算过后的部门选项
       */
      computedDepartments: [],
      /**
       * 所有角色下拉框选项
       */
      roles: []
    }
  },
  created() {
    var x = this
    x.userForm = this.$route.params.row
    console.log(x.userForm)
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
