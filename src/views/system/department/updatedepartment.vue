<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改部门</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">部门基本信息</font>
    </el-col>
    <div class="app-container allData">
      <hr>
      <!--表单输入 -->
      <el-form
        ref="departmentForm"
        :model="departmentForm"
        :rules="departmentRules"
        label-width="100px"
        class="user-add-Form"
        label-position="right"
      >
        <!-- 第一行 -->
        <el-row>
          <!-- 部门名称输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="departmentForm.name" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 部门编号输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="部门编号" prop="code">
              <el-input v-model="departmentForm.code" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row>
          <!-- 注记码输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="助记码" prop="mnemonic_code">
              <el-input v-model="departmentForm.mnemonic_code" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 部门等级下拉框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="部门等级" prop="level">
              <el-select v-model="departmentForm.level" placeholder="请选择">
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
        <el-row>

          <!-- 上级部门下拉框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="上级部门" prop="parentName">
              <el-select v-model="departmentForm.parentName" placeholder="请选择">
                <el-option
                  v-for="role in roles"
                  :key="role.name"
                  :label="role.name"
                  :value="role.name"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 负责人输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="负责人" prop="master">
              <el-input v-model="departmentForm.master" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <!--复选按钮 -->
        <el-row>
          <el-col :span="7" :offset="3">
            <el-form-item label="是否启用">
              <el-radio v-model="departmentForm.status" label="1">是</el-radio>
              <el-radio v-model="departmentForm.status" label="2">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <!-- 按钮组件 -->
        <el-row :gutter="0">
          <el-form-item>
            <el-col :span="3" :offset="8">
              <el-button type="primary" @click="submitForm('departmentForm')">保存</el-button>
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
    return {
      /**
       * 表单数据
       */
      departmentForm: {
        name: '',
        code: '',
        mnemonic_code: '',
        level: '',
        parentName: '',
        master: '',
        status: '1'
      },
      /**
       * 表单校验规则
       */
      departmentRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        mnemonic_code: [
          { required: true, message: '请输入助记码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择部门等级', trigger: 'change' }
        ],
        parentName: [
          { required: true, message: '请选择上级部门', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        master: [
          { required: true, message: '请输入部门负责人', trigger: 'blur' },
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
  created() {
    var x = this
    x.departmentForm = this.$route.params.row
    console.log(x.departmentForm)
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
        name: 'Department'
      })
      this.$message('操作成功')
    },
    /**
     * 关闭按钮
     */
    close() {
      this.$router.push({
        name: 'Department'
      })
    }
  }
}
</script>
