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
      <el-form ref="form" :model="form" label-width="80px" size="mini" style="padding-left:30%;">
        <el-form-item label="公司">
          <el-col :span="8">
            <el-select v-model="form.company">
              <el-option label="博思软件" value="shanghai" />
              <el-option label="阿里巴巴" value="beijing" />
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="职位名">
          <el-col :span="8">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>

        <el-form-item label="备注">
          <el-col :span="8">
            <el-input v-model="form.remark" />
          </el-col>
        </el-form-item>

        <!--复选按钮 -->
        <el-form-item>
          <el-col :offset="1" :span="8">
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="2">否</el-radio>
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
        company: '',
        name: '',
        remark: '',
        status: ''
      },
      radio: '1'
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
        name: 'position'
      })
      this.$message('操作成功')
    },
    close() {
      this.$router.push({
        name: 'position'
      })
    }
  }
}
</script>
