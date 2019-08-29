<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">新增资源</h1>
    <hr>
    <br>
    <el-col :span="5" :offset="1">
      <font style="font-size:15px;" color="blue">资源基本信息</font>
    </el-col>
    <div class="app-container allData">
      <hr>
      <!--表单输入 -->
      <el-form
        ref="resourceForm"
        :model="resourceForm"
        :rules="resourceRules"
        label-width="100px"
        class="user-add-Form"
        label-position="right"
      >
        <!-- 第一行 -->
        <el-row>
          <!-- 资源名称输入框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="节点名称" prop="name">
              <el-input v-model="resourceForm.name" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <!-- 资源编号输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="节点编号" prop="code">
              <el-input v-model="resourceForm.code" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row>
          <!-- 父亲节点下拉框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="父亲节点">
              <el-select v-model="resourceForm.parentName" filterable placeholder="请选择">
                <el-option
                  v-for="parent in parents"
                  :key="parent.name"
                  :label="parent.name"
                  :value="parent.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- url输入框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="URL" prop="url">
              <el-input v-model="resourceForm.url" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row>
          <!-- 打开图标下拉框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="打开图标" prop="openImg">
              <el-select v-model="resourceForm.openImg" filterable placeholder="请选择">
                <el-option
                  v-for="resource in resources"
                  :key="resource.openImg"
                  :label="resource.openImg"
                  :value="resource.openImg"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 关闭图标下拉框 -->
          <el-col :span="7" :offset="2">
            <el-form-item label="关闭图标" prop="closeImg">
              <el-select v-model="resourceForm.closeImg" filterable placeholder="请选择">
                <el-option
                  v-for="resource in resources"
                  :key="resource.closeImg"
                  :label="resource.closeImg"
                  :value="resource.closeImg"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row>
          <!-- 资源类型下拉框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="资源类型" prop="resourceType">
              <el-select v-model="resourceForm.resourceType" filterable placeholder="请选择">
                <el-option
                  v-for="resource in resources"
                  :key="resource.type"
                  :label="resource.type"
                  :value="resource.type"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="2">
            <el-form-item label="是否子叶节点">
              <el-radio v-model="resourceForm.leaf" label="1">是</el-radio>
              <el-radio v-model="resourceForm.leaf" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行 -->
        <!-- 按钮组件 -->
        <el-row :gutter="0">
          <el-form-item>
            <el-col :span="3" :offset="8">
              <el-button type="primary" @click="submitForm('resourceForm')">保存</el-button>
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
export default {
  data() {
    return {
      /**
       * 表单数据
       */
      resourceForm: {
        name: '',
        code: '',
        parentName: '',
        url: '',
        resourceType: '',
        openImg: '',
        closeImg: '',
        leaf: '2'
      },
      /**
       * 表单校验规则
       */
      resourceRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入资源URL', trigger: 'blur' }],
        resourceType: [
          { required: true, message: '请选择资源类型', trigger: 'blur' }
        ],
        openImg: [
          { required: true, message: '请选择打开图标', trigger: 'blur' }
        ],
        closeImg: [
          { required: true, message: '请选择关闭图标', trigger: 'blur' }
        ]
      },
      /**
       * 职位下拉框选项
       */
      parents: [{ name: '系统管理' }, { name: '基础数据管理' }],
      /**
       * 角色下拉框选项
       */
      resources: [
        { openImg: '打开1', closeImg: '关闭1', type: '类型1' },
        { openImg: '打开2', closeImg: '关闭2', type: '类型2' },
        { openImg: '打开3', closeImg: '关闭3', type: '类型3' }
      ]
    }
  },
  methods: {
    /**
     * 保存按钮
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
          this.submit()
        } else {
          console.log(this.resourceForm.status)
          return false
        }
      })
    },
    submit() {
      this.$router.push({
        name: 'Resource'
      })
      this.$message('操作成功')
    },
    /**
     * 关闭按钮
     */
    close() {
      this.$router.push({
        name: 'Resource'
      })
    }
  }
}
</script>
