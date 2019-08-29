<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">增加题目类别</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <span style="font-size:15px; color: blue; ">基本信息</span>
    </el-col>
    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :label-position="left" :rules="rules" :model="form" label-width="80px" size="mini" style="padding-left:30%;">
        <el-form-item label="父类别" required>
          <el-select v-model="form.parentId" placeholder="请选择">
            <el-option
              v-for="parent in parents"
              :key="parent.name"
              :label="parent.name"
              :value="parent.id"
            />
          </el-select>
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
export default {
  data() {
    return {
      form: {
        name: '',
        remark: '',
        status: '1',
        parentId: ''
      },
      parents: [
        { id: '',
          name: ''
        },
        { id: '1',
          name: '2'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入题目类别', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
       * 路由跳转
       */
    onSubmit() {
      console.log('submit!')
    },
    save() {
      this.$router.push({
        name: 'Category'
      })
      this.$message('操作成功')
    },
    close() {
      this.$router.push({
        name: 'Category'
      })
    }
  }
}
</script>
