<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">新增公司基本信息</h1>
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
        label-org-name="right"
      >
        <!-- 第一行 -->
        <el-row>
          <!-- 公司名输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="公司名" prop="name">
              <el-input v-model="companyForm.name" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 公司编号输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="公司编号" prop="code">
              <el-input v-model="companyForm.code" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row>
          <!-- 助记码输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="助记码" prop="mnemonicCode">
              <el-input v-model="companyForm.mnemonicCode" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 法人下拉框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="法人" prop="master">
              <el-input v-model="companyForm.master" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row>
          <!-- 税号输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="税号" prop="tax">
              <el-input v-model="companyForm.tax" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 传真输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="companyForm.fax" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row>
          <!-- 电话输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="电话">
              <el-input v-model="companyForm.tel" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 网址输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="网址">
              <el-input v-model="companyForm.website" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <!-- 所属机构输入框 -->
        <el-row>
          <el-col :span="7" :offset="3">
            <el-form-item label="所属机构" prop="org">
              <el-select v-model="companyForm.org" filterable placeholder="请选择" clearable>
                <el-option
                  v-for="org in orgs"
                  :key="org.name"
                  :label="org.name"
                  :value="org"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 邮箱输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="companyForm.email" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 -->
        <!--复选按钮 -->
        <el-row>
          <el-col :span="7" :offset="3">
            <el-form-item label="是否启用">
              <el-radio v-model="companyForm.status" label="1">是</el-radio>
              <el-radio v-model="companyForm.status" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第八行 -->
        <!-- 按钮组件 -->
        <el-row :gutter="0">
          <el-form-item>
            <el-col :span="3" :offset="8">
              <el-button type="primary" @click="submitForm('companyForm')">保存</el-button>
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
import { addCompany, fetchCompany } from '@/api/system/company'
export default {
  data() {
    return {
      /**
       * 表单数据
       */
      companyForm: {
        name: '',
        code: '',
        mnemonicCode: '',
        master: '',
        tax: '',
        fax: '',
        tel: '',
        website: '',
        org: '',
        email: '',
        status: '1'
      },
      /**
       * 表单校验规则
       */
      companyRules: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入公司编号', trigger: 'blur' }
        ],
        mnemonicCode: [
          { required: true, message: '请输入助记码', trigger: 'blur' }
        ],
        org: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        tax: [
          { required: true, message: '请输入税号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        fax: [
          { required: true, message: '请输入传真', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        master: [
          { required: true, message: '请输入法人信息', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      /**
       * 组织机构下拉框选项
       */
      orgs: []
    }
  },
  created() {
    this.queryOrgAndCompanyData()
  },
  methods: {
    /**
     * 查询树结构数据，从而获取公司名字和机构数据
     */
    queryOrgAndCompanyData() {
      const params = {
        companyName: '',
        orgName: '',
        pageSize: 1,
        pageNum: 1
      }
      fetchCompany(params).then(result => {
        const body = result.body
        // 转换树结构的数据
        console.log(body.tree)
        const tree = body.tree.treeNodeList
        this.transDataToTree(tree)
        console.log('this is result')
      })
    },
    /**
     * 查询树结构的方法
     */
    transDataToTree(arr) {
      return arr.map(element => {
        return this.getChildren(element)
      })
    },
    /**
     * 查询树结构中的数据
     */
    getChildren(element) {
      if (!element.childList) {
        // 这里可以用于判断公司名是否为空
        console.log('this is companys')
        console.log(element)
        const re = {
          label: element.name,
          id: element.id,
          children: null
        }
        return re
      } else {
        // 填充组织结构下拉框数据
        console.log('this is orgs')
        console.log(element)
        const org = {
          name: element.name,
          id: element.id
        }
        this.orgs.push(org)
        return {
          children: this.transDataToTree(element.childList)
        }
      }
    },
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
      console.log('this is formData')
      console.log(this.companyForm)
      const params = {
        name: this.companyForm.name,
        code: this.companyForm.code,
        mnemonicCode: this.companyForm.mnemonicCode,
        master: this.companyForm.master,
        tax: this.companyForm.tax,
        fax: this.companyForm.fax,
        tel: this.companyForm.tel,
        website: this.companyForm.website,
        orgName: this.companyForm.org.name,
        orgId: this.companyForm.org.id,
        email: this.companyForm.email,
        status: this.companyForm.status
      }
      console.log('this is params')
      console.log(params)
      addCompany(params).then(
        this.$message('操作成功')
      )
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
