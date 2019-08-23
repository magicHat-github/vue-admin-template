<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改用户</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">用户基本信息</font>
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
        <el-row>
          <el-form-item label="角色名称" prop="name">
            <el-col :span="8">
              <el-input v-model="form.name" />
            </el-col>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="角色编码" prop="code">
            <el-col :span="8">
              <el-input v-model="form.code" />
            </el-col>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="角色备注" prop="remark">
            <el-col :span="8">
              <el-input v-model="form.remark" />
            </el-col>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="所属机构" prop="org">
              <el-select v-model="form.org" filterable placeholder="请选择">
                <el-option v-for="org in orgs" :key="org.name" :label="org.name" :value="org.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="所属公司" prop="company">
              <el-select v-model="form.company" filterable placeholder="请选择">
                <el-option
                  v-for="company in companys"
                  :key="company.name"
                  :label="company.name"
                  :value="company.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--复选按钮 -->
          <el-form-item label="是否启用">
            <el-col :offset="1" :span="8">
              <el-radio-group v-model="form.status">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row>
          <!-- 按钮组件 -->
          <el-form-item>
            <el-col :offset="1" :span="8">
              <el-button type="primary" @click="submitForm('form')">保存</el-button>
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
      form: {
        name: '',
        code: '',
        remark: '',
        org: '',
        company: '',
        status: '1'
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
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
            message: '请输入角色编码',
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
            required: true,
            message: '请选择启用标记',
            trigger: 'change'
          }
        ],
        org: [
          {
            required: true,
            message: '请选择所属机构',
            trigger: 'blur'
          }
        ]
      },
      /**
       * 职位下拉框选项
       */
      orgs: [{ name: '中国电信' }, { name: '中国联通' }],
      /**
       * 角色下拉框选项
       */
      companys: [{ name: '福建联通' }, { name: '江苏联通' }]
    }
  },
  created() {
    this.form = this.$route.params.row
    console.log(this.form)
  },
  methods: {
    /**
     * 路由跳转
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$router.push({
            name: 'Role'
          })
          this.$message('操作成功')
          console.log(this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close() {
      this.$router.push({
        name: 'Role'
      })
    }
  }
}
</script>
