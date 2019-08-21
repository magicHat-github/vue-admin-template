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
            <!-- 增删改按钮框 -->
            <div>
              <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addConfigDialog=true">增加</el-link>
              <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteCheck">删除</el-link>
              <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateCheck">修改</el-link>
            </div>
            <el-dialog title="添加配置信息" :visible.sync="addConfigDialog">
              <div slot="footer" class="dialog-footer">
                <el-button @click="addConfigDialog = false">取 消</el-button>
                <el-button type="primary" @click="addConfigDialog = false">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="修改配置信息" :visible.sync="updateConfigDialog">
              <div slot="footer" class="dialog-footer">
                <el-button @click="updateConfigDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateConfigDialog = false">确 定</el-button>
              </div>
            </el-dialog>
            <el-table
              ref="multipleTable"
              :data="configDetail"
              tooltip-effect="dark"
              stripe
              height
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" fixed="left" />
              <el-table-column prop="category" label="题目类别" />
              <el-table-column prop="type" label="题型" />
              <el-table-column prop="num" label="题目数量" />
              <el-table-column prop="difficult" label="题目难度" />
              <el-table-column prop="score" label="题目分值" />
              <el-table-column label="操作">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addConfigDialog=true" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateItem" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteItem" />
              </el-table-column>
            </el-table>
          </el-card>
        </el-form-item>
        <!-- 按钮组件 -->
        <el-form-item>
          <el-col :offset="11" :span="8">
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
      addConfigDialog: false,
      updateConfigDialog: false,
      form: {
        name: '',
        remark: '',
        status: '1'
      },
      rules: {
        name: [
          { required: true, message: '请输入配置项名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ]
      },
      configDetail: [
        {
          category: '1',
          type: '1',
          num: '1',
          difficult: '1',
          score: '1'
        },
        {
          category: '2',
          type: '1',
          num: '1',
          difficult: '1',
          score: '1'
        }
      ],

      /**
         * 待确认字段
         */
      multipleSelection: []
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    /**
       * 对表格多选项进行判定，成则跳转至修改页面
       */
    updateCheck() {
      // eslint-disable-next-line eqeqeq
      if (this.multipleSelection.length !== 1) {
        this.$message({
          type: 'warning',
          message: '请选择单个修改选项'
        })
      } else {
        this.updateConfigDialog = true
      }
    },
    /**
       * 对表格多选项进行判定，成功则删除
       */
    deleteCheck() {
      // eslint-disable-next-line eqeqeq
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除选项'
        })
      } else {
        this.$confirm('是否要删除选定信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    queryData() {
      this.total = this.types.length
    },
    /**
       * 路由跳转
       */
    onSubmit() {
      console.log('submit!')
    },
    save() {
      this.$router.push({
        name: 'Config'
      })
      this.$message('操作成功')
    },
    close() {
      this.$router.push({
        name: 'Config'
      })
    },
    /**
       * 勾选事件触发的函数
       */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    updateItem() {
      this.updateConfigDialog = true
    },
    /**
       * 删除信息
       */
    deleteItem() {
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
