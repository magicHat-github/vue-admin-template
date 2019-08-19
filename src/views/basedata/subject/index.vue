<template>
  <el-container>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- 组织机构下拉框 -->
            <el-form-item label="题目类别:">
              <el-select
                v-model="formInline.categories"
                filterable
                multiple
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="subject in subjects"
                  :key="subject.category"
                  :value="subject.category"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="选择题型:">
              <el-input v-model="formInline.type" clearable size="mini" />
            </el-form-item>
            <el-form-item label="输入题目:">
              <el-input v-model="formInline.name" clearable size="mini" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-card class="tableData">
          <!-- 增删改按钮框 -->
          <div>
            <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto">增加</el-link>
            <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="delete1">删除</el-link>
            <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="update1">修改</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-upload2" @click="update1">导入</el-link>
            <el-link class="itemAction" type="primary" icon="el-icon-download" @click="update1">导出</el-link>
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            border="true"
            :data="subjects"
            tooltip-effect="dark"
            stripe
            height
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="题目" />
            <el-table-column prop="category" label="题目类型" sortable="true" />
            <el-table-column prop="type" label="题目分类" />
            <el-table-column prop="updatedTime" label="更新时间" />
            <el-table-column prop="status" label="是否启用" sortable="true" />
            <el-table-column label="操作">
              <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
              <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="update1" />
              <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="delete1" />
            </el-table-column>
          </el-table>
          <!-- 分页部分 -->
          <div class="block">
            <el-pagination
              :current-page.sync="currentPage1"
              :page-size="70"
              layout="prev, pager, next, jumper"
              :total="1000"
            />
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
// import { log } from 'util'
export default {
  name: 'App',
  data() {
    return {
      /**
         * 查询字段
         */
      formInline: {
        categories: [],
        type: '',
        name: ''
      },

      /**
         * 公司管理
         */
      subjects: [
        {
          name: '腾讯',
          subjectId: '001',
          category: '编程',
          type: '选择',
          updatedTime: '2019/11/11',
          status: '启用'
        },
        {
          name: '阿里',
          subjectId: '002',
          category: '编程',
          type: '选择',
          updatedTime: '2019/11/11',
          status: '不启用'
        },
        {
          name: '百度',
          subjectId: '003',
          category: '编程',
          type: '选择',
          updatedTime: '2019/11/11',
          status: ' 启用'
        },
        {
          name: '腾讯',
          subjectId: '001',
          category: '编程',
          type: '选择',
          updatedTime: '2019/11/11',
          status: ' 启用'
        },
        {
          name: '腾讯',
          subjectId: '001',
          category: '编程',
          type: '选择',
          updatedTime: '2019/11/11',
          status: ' 启用'
        },
        {
          name: '腾讯',
          subjectId: '001',
          category: '编程',
          type: '选择',
          updatedTime: '2019/11/11',
          status: ' 启用'
        },
        {
          name: '腾讯',
          category: '编程',
          type: '选择',
          updatedTime: '2019/11/11',
          status: ' 启用'
        }
      ],

      /**
         * 待确认字段
         */
      multipleSelection: [],
      /**
         * 初始显示的页数
         */
      currentPage1: 1,
      currentPage2: 2,
      currentPage3: 3,
      currentPage4: 4,
      dynamicTags: ['标签一', '标签二', '标签三']
    }
  },

  methods: {
    /**
       * 勾选事件触发的函数
       */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
       * 跳转到增加界面
       */
    goto() {
      this.$router.push({
        name: 'AddSubject'
      })
    },
    update1() {
      this.$router.push({
        name: 'UpdateSubject'
      })
    },

    /**
       * 删除信息
       */
    delete1() {
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

<style>
  .itemAction {
    margin-right: 10px;
  }
</style>
