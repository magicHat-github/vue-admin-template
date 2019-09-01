<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改机构</h1>
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
        style="padding-left:30%;"
        label-position="right"
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
import { queryOrg, updateOrg } from '@/api/system/org'
export default {
  data() {
    return {
      form: {
        id: '',
        name: '',
        code: '',
        master: '',
        tel: '',
        address: '',
        version: '',
        status: ''
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
  created() {
    const org = this.$route.params.org
    this.queryOrgAndCompanyData(org)
  },
  methods: {
    /**
     * 查询树结构数据，从而获取公司名字和机构数据
     */
    queryOrgAndCompanyData(org) {
      const params = {
        orgName: org.name,
        pageSize: 1,
        pageNum: 1
      }
      queryOrg(params).then(result => {
        const body = result.body
        // 转换树结构的数据
        this.form = body.dataList[0]
      })
    },

    /**
		 * 保存操作
		 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
          this.submit()
        } else {
          return false
        }
      })
    },

    submit() {
      console.log('this is formData')
      console.log(this.form)
      const params = {
        id: this.form.id,
        name: this.form.name,
        code: this.form.code,
        master: this.form.master,
        tel: this.form.tel,
        address: this.form.address,
        version: this.form.version,
        status: this.form.status
      }
      console.log('this is params')
      console.log(params)
      updateOrg(params).then(
        this.$message('操作成功')
      )
    },

    /**
     * 关闭按钮
     */
    close() {
      this.$router.push({
        name: 'Org'
      })
    }
  }

}
</script>
