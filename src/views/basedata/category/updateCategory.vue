<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改题目类别</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <span style="font-size:15px; color: blue; ">基本信息</span>
    </el-col>
    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :label-position="left" :rules="rules" :model="form" label-width="80px" size="mini" style="padding-left:30%;">
        <el-form-item label="原父类别" prop="name">
          <el-col :span="8">
            {{ form.parentName }}
          </el-col>
        </el-form-item>
        <el-form-item label="新父类别" required>
          <el-cascader
            v-model="form.parentIdCheck"
            :options="options"
            :props="{ checkStrictly: true }"
            clearable
          />
        </el-form-item>
        <el-form-item label="题目类别" prop="name">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>
        <!--复选按钮 -->
        <el-form-item label="是否启用" prop="status">
          <el-col :offset="1" :span="8">
            <el-radio v-model="form.status" label="1">是</el-radio>
            <el-radio v-model="form.status" label="2">否</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-col :span="8">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="10"
              placeholder="请输入内容"
            />
          </el-col>
        </el-form-item>
        <!-- 按钮组件 -->
        <el-form-item>
          <el-col :offset="1" :span="8">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="close">关闭</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { searchTree, updateItem } from '@/api/basedata/catetory'
export default {
  data() {
    return {
      checkStrictly: true,
      form: {
        id: this.$route.params.id,
        name: this.$route.params.name,
        remark: this.$route.params.remark,
        status: this.$route.params.status,
        parentId: this.$route.params.parentId,
        parentIdCheck: '',
        parentName: this.$route.params.parentName
      },
      options: null,
      rules: {
        name: [
          { required: true, message: '请输入题目类别', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.searchTree()
  },
  methods: {
    searchTree() {
      searchTree().then(result => {
        const body = result.body
        this.options = body.treeData
        console.log(this.options)
        console.log(this.form)
      })
    },
    /**
       * 路由跳转
       */
    onSubmit() {
      console.log('submit!')
    },
    save() {
      // eslint-disable-next-line no-unused-vars
      if (this.form.parentIdCheck !== '') {
        this.form.parentId = this.form.parentIdCheck.pop()
      }
      const params = {
        id: this.form.id,
        name: this.form.name,
        parentId: this.form.parentId,
        remark: this.form.remark,
        status: this.form.status
      }
      console.log(params)
      updateItem(params).then(result => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$router.push({
          name: 'Category'
        })
      }).catch(result => {
        this.$message({
          type: 'warning',
          message: '操作失败!'
        })
      })
    },
    close() {
      this.$router.push({
        name: 'Category'
      })
      this.$message({
        type: 'warning',
        message: '操作取消!'
      })
    }
  }
}
</script>
