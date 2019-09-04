<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改职位</h1>
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
import { updatePosition, queryPosition } from '@/api/system/position'
export default {
  data() {
    return {
      form: {
        id: '',
        version: '',
        company: '',
        code: '',
        name: '',
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
      },
      companys: []
    }
  },
  created() {
    const position = this.$route.params.row
    this.queryData(position)
  },
  methods: {

    /**
		 * 查询数据 并填充下拉框
		 */
    queryData(position) {
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

      const params2 = {
        positionId: position.id,
        positionName: '',
        pageSize: 1,
        pageNum: 1
      }
      queryPosition(params2)
        .then(result => {
          const body = result.body
          this.form = body.dataList[0]
          const company = {
            name: body.dataList[0].companyName,
            id: body.dataList[0].companyId
          }
          this.form.company = company
          this.form.status = body.dataList[0].status + ''
          console.log(this.form)
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
		 * 确认更新提交表单
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
        id: this.form.id,
        version: this.form.version,
        name: this.form.name,
        code: this.form.code,
        remark: this.form.remark,
        status: this.form.status,
        companyName: this.form.company.name,
        companyId: this.form.company.id
      }
      console.log('this is params')
      console.log(params)
      updatePosition(params).then(result => {
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
