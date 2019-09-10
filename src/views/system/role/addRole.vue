<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">新增角色</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">角色基本信息</font>
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
        label-position="left"
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
              <el-select
                v-model="form.org"
                value-key="id"
                clearable
                filterable
                placeholder="请选择"
                @visible-change="$forceUpdate()"
              >
                <el-option v-for="org in orgs" :key="org.id" :label="org.name" :value="org" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="所属公司" prop="company">
              <el-select
                v-model="form.company"
                value-key="id"
                clearable
                filterable
                placeholder="请选择"
                @visible-change="$forceUpdate()"
              >
                <el-option
                  v-for="company in companys"
                  :key="company.id"
                  :label="company.name"
                  :value="company"
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
import { fetchRoleBeforeModify } from '@/api/system/role'
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
      /**
       * 表单校验规则
       */
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
       * 组织机构下拉框选项
       */
      orgs: [],
      computedOrgs: [],
      /**
       * 公司下拉框选项
       */
      companys: [],
      computedCompanys: []
    }
  },
  created() {
    this.query()
  },
  methods: {
    /**
     * 根据所选公司自动填充机构
     */
    computeOrgs() {
      this.computedOrgs = []
      // 公司表单不为空
      if (this.form.company && this.form.company !== '') {
        this.form.org = this.form.company.parent
      }
    },
    /**
     * 根据所选机构自动填充机构下拉框
     */
    computeCompanys() {
      this.computedOrgs = []
      // 当前机构表单为空, 填充公司下拉框
      if (!this.form.org || this.form.org == '') {
        this.computedCompanys = this.companys
      // 当前机构表单非空，将机构旗下的公司填入公司下拉框
      } else {
        this.companys.map(company => {
          if (company.parent.id === this.form.org.id) {
            this.computedCompanys.push(company)
          }
        })
      }
    },
    query() {
      this.orgs = []
      this.companys = []
      this.computedOrgs = []
      this.computedCompanys = []
      const params = {
        id: ''
      }
      fetchRoleBeforeModify(params).then(result => {
        const body = result.body
        // 从树结构中取数据填充下拉框
        this.fillSelectData(body.orgCompanyTree.treeNodeList)
      })
    },
    /**
     * 填充下拉框数据
     */
    fillSelectData(nodes, parent) {
      nodes.map(org => {
        this.fillOrgsAndCompanys(org, parent)
      })
    },
    fillOrgsAndCompanys(node, parent) {
      const element = {
        id: node.id,
        name: node.name,
        parent: parent
      }
      // 公司节点
      if (!node.childList) {
        this.companys.push(element)
      // 组织机构节点
      } else {
        this.orgs.push(element)
        this.fillSelectData(node.childList, element)
      }
    },
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
