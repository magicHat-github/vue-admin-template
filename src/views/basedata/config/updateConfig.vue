<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改组卷配置</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <span style="font-size:15px; color: blue; ">基本信息</span>
    </el-col>
    <!--表单输入 -->
    <div class="app-container allData">
      <hr>
      <el-form ref="form" :label-position="left" :rules="rules" :model="form" size="mini">
        <el-form-item label="配置项名称" prop="name">
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
        <el-form-item label="添加配置信息" />
        <el-form-item>
          <el-card class="tableData">
            <el-table
              ref="multipleTable"
              :data="chooseDetails"
              tooltip-effect="dark"
              stripe
              height
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
              />
              <el-table-column prop="category" label="题目类别" />
              <el-table-column prop="type" label="题型" />
              <el-table-column prop="num" label="题目数量" />
              <el-table-column prop="difficult" label="题目难度" />
              <el-table-column prop="score" label="题目分值" />
              <el-table-column label="操作">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="update1" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="delete1" />
              </el-table-column>
            </el-table>
          </el-card>
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
        status: '1'
      },
      rules: {
        name: [
          { required: true, message: '请输入题目类别', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
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
