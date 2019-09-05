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
      <!--表单输入 		label-position="right"-->
      <el-form
        ref="departmentForm"
        :model="departmentForm"
        :rules="departmentRules"
        label-width="100px"
        class="user-add-Form"
        label-org-name="left"
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
            <el-form-item label="助记码" prop="mnemonicCode">
              <el-input v-model="departmentForm.mnemonicCode" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 部门等级下拉框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="部门等级" prop="level">
              <el-select v-model="departmentForm.level" filterable placeholder="请选择">
                <el-option v-for="level in levels" :key="level" :label="level" :value="level" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row>
          <!-- 上级部门下拉框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="上级部门" prop="parent">
              <el-select
                v-model="departmentForm.parent"
                value-key="name"
                filterable
                placeholder="请选择"
                clearable
                @visible-change="$forceUpdate()"
              >
                <el-option v-for="parent in parents" :key="parent.id" :label="parent.name" :value="parent" />
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
        <!--选择所偶公司按钮 -->
        <el-row>
          <el-col :span="7" :offset="3">
            <el-form-item label="所属公司" prop="company">
              <el-select
                v-model="departmentForm.company"
                value-key="name"
                filterable
                placeholder="请选择"
                clearable
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

          <el-col :span="7" :offset="2">
            <el-form-item label="描述" prop="descript">
              <el-input v-model="departmentForm.descript" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <!--复选按钮 -->
        <el-row>
          <el-col :span="7" :offset="3">
            <el-form-item label="是否启用">
              <el-radio v-model="departmentForm.status" label="1">是</el-radio>
              <el-radio v-model="departmentForm.status" label="0">否</el-radio>
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
import { queryDepartment, updateDepartment } from '@/api/system/department'
export default {
  data() {
    return {
      /**
			 * 表单数据
			 */
      departmentForm: {
        id: '',
        version: '',
        name: '',
        code: '',
        mnemonicCode: '',
        level: '',
        parent: '',
        master: '',
        company: '',
        descript: '',
        status: '1'
      },
      /**
			 * 表单校验规则
			 */
      departmentRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            min: 4,
            max: 8,
            message: '长度在 4 到 8 个字符',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输部门编号', trigger: 'blur' },
          {
            min: 4,
            max: 6,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        mnemonicCode: [
          { required: true, message: '请输入助记码', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        level: [
          { required: true, message: '请选择部门等级', trigger: 'change' }
        ],
        master: [
          { required: true, message: '请输负责人', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        descript: [
          { required: true, message: '请输入相关描述', trigger: 'blur' },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ],
        parent: [
          { required: true, message: '请选择上级部门', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请选择所属公司', trigger: 'blur' }
        ]
      },
      /**
			 * 职位下拉框选项
			 */
      levels: [1, 2, 3, 4, 5],
      /**
			 * 上级部门下拉框选项
			 */
      parents: [{ name: '无', id: 1 }],
      companys: []
    }
  },
  created() {
    const department = this.$route.params.row
    this.queryData(department)
  },
  methods: {
    /**
		 * 查询数据
		 */
    queryData(department) {
      const params = {
        departmentId: department.id,
        departmentName: department.name,
        level: department.level,
        pageSize: 1,
        pageNum: 1
      }
      queryDepartment(params)
        .then(result => {
          const body = result.body
          const tree = body.tree.treeNodeList
          console.log('this is result')
          this.departmentForm = body.dataList[0]
          const parent = {
            name: body.dataList[0].parentName,
            id: body.dataList[0].parentId
          }
          const company = {
            name: body.dataList[0].companyName,
            id: body.dataList[0].companyId
          }
          this.departmentForm.parent = parent
          this.departmentForm.company = company
          this.departmentForm.status = body.dataList[0].status + ''
          console.log(this.departmentForm)
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
        // console.log('this is departments')
        // console.log(element)
        const re = {
          label: element.name,
          id: element.id,
          children: null
        }
        const parent = {
          name: element.name,
          id: element.id
        }
        console.log(parent.id)
        console.log(this.departmentForm.id)
        if (parent.id !== this.departmentForm.id) {
          this.parents.push(parent)
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
		 * 保存按钮
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
      console.log(this.departmentForm)
      const params = {
        id: this.departmentForm.id,
        version: this.departmentForm.version,
        name: this.departmentForm.name,
        code: this.departmentForm.code,
        mnemonicCode: this.departmentForm.mnemonicCode,
        master: this.departmentForm.master,
        level: this.departmentForm.level,
        parentId: this.departmentForm.parent.id,
        status: this.departmentForm.status,
        descript: this.departmentForm.descript,
        companyId: this.departmentForm.company.id
      }
      console.log('this is params')
      console.log(params)
      updateDepartment(params).then(result => {
        this.close()
        this.$message(result.head.msg)
      })
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
