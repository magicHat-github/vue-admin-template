<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">增加职位</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">职位基本信息</font>
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
        label-org-name="left"
      >
        <el-form-item label="公司" prop="company">
          <el-col :span="8">
            <el-select v-model="form.company" value-key="name" filterable placeholder="请选择">
              <el-option
                v-for="company in companys"
                :key="company.id"
                :label="company.name"
                :value="company"
              />
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="职位名" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>

        <el-form-item label="职位代码" prop="code">
          <el-col :span="8">
            <el-input v-model="form.code" />
          </el-col>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-col :span="8">
            <el-input v-model="form.remark" />
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
import { queryDepartment } from '@/api/system/department'
import { insertPosition } from '@/api/system/position'
export default {
  data() {
    return {
      form: {
        company: '',
        name: '',
        code: '',
        remark: '',
        status: '1'
      },

      rules: {
        company: [
          {
            required: true,
            message: '请选择公司名称',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入职位名称',
            trigger: 'change'
          },
          {
            min: 4,
            max: 8,
            message: '长度在 4 到 8 个字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入职位代码',
            trigger: 'change'
          },
          {
            min: 4,
            max: 6,
            message: '长度在 4 到 6 个字符',
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
        ],
        remark: [
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'blur'
          }
        ]
      },
      companys: []
    }
  },
  created() {
    this.queryData()
  },
  methods: {

    /**
		 * 查询数据 并填充下拉框
		 */
    queryData() {
      const params = {
        departmentName: '',
        level: '',
        pageSize: 1,
        pageNum: 1
      }
      queryDepartment(params)
        .then(result => {
          const body = result.body
          // 转换树结构的数据
          const tree = body.tree.treeNodeList
          this.transDataToTree(tree)
        })
        .catch(err => {
          console.log(err)
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
        console.log('this is departments')
        console.log(element)
        const re = {
          label: element.name,
          id: element.id,
          children: null
        }
        return re
      } else {
        // 填充公司选项下拉框数据
        const company = {
          name: element.name,
          id: element.id
        }
        this.companys.push(company)
        return {
          children: this.transDataToTree(element.childList)
        }
      }
    },

    /**
		 * 保存操作
		 */
    submitForm(formName) {
      console.log('this is formData orgs')
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
      const params = {
        name: this.form.name,
        code: this.form.code,
        status: this.form.status,
        remark: this.form.remark,
        companyId: this.form.company.id,
        companyName: this.form.company.name
      }
      console.log('this is params')
      console.log(params)
      insertPosition(params).then(result => {
        this.close()
        this.$message(result.head.msg)
      })
    },
    /**
		 * 关闭按钮
		 */
    close() {
      this.$router.push({
        name: 'position'
      })
    }
  }
}
</script>
