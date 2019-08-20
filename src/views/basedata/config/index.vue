<template>
  <el-container>
    <!-- 主体部分 -->
    <el-main>
      <div class="app-container allData">
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="组卷配置项标题:">
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
          </div>

          <!-- 数据显示表单 -->
          <el-table
            ref="multipleTable"
            :data="configs"
            tooltip-effect="dark"
            stripe
            height
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" fixed="left" />
            <el-table-column prop="name" label="配置项" />
            <el-table-column prop="difficult" label="难度" />
            <el-table-column prop="updatedBy" label="修改人" />
            <el-table-column prop="updatedTime" label="修改时间" />
            <el-table-column prop="status" label="启用标志" sortable="true" />
            <el-table-column prop="company" label="公司" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
                <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="update1" />
                <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="delete1" />
                <el-link class="itemAction" type="success" icon="el-icon-view" @click="findConfigDetail(scope.$index, scope.row)" />
              </template>
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
        <el-drawer
          title="组卷配置详情"
          :visible.sync="tableView"
          direction="btt"
          size="75%"
        >
          <!-- 数据显示表单 -->
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
        </el-drawer>
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
        name: '',
        findId: ''
      },
      tableView: false,
      /**
         * 公司管理
         */
      configs: [
        {
          configId: '1',
          name: '11',
          difficult: '简单',
          updatedBy: 'lynch',
          updatedTime: '2019/11/11',
          status: '启用',
          company: 'boss',
          remark: 'null'
        },
        {
          configId: '2',
          name: '22',
          difficult: '困难',
          updatedBy: 'lynch',
          updatedTime: '2019/11/11',
          status: '启用',
          company: 'boss',
          remark: 'null'
        }
      ],
      details: [
        {
          configId: '1',
          category: 'Java基础题',
          type: '选择题',
          num: '10',
          difficult: '中等',
          score: '30'
        },
        {
          configId: '1',
          category: 'Java基础题',
          type: '填空题',
          num: '5',
          difficult: '中等',
          score: '20'
        },
        {
          configId: '1',
          category: 'Java基础题',
          type: '编程题',
          num: '3',
          difficult: '中等',
          score: '50'
        },
        {
          configId: '2',
          category: '编程题',
          type: '第二',
          num: 'sad',
          difficult: '',
          score: ''
        },
        {
          configId: '3',
          category: '1',
          type: '',
          num: '',
          difficult: '',
          score: ''
        },
        {
          configId: '4',
          category: '1',
          type: '',
          num: '',
          difficult: '',
          score: ''
        }
      ],
      chooseDetails: [],
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
       * 树结构的点击事件
       */
    handleNodeClick(data) {
      console.log(data)
    },

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
        name: 'AddConfig'
      })
    },
    update1() {
      this.$router.push({
        name: 'UpdateConfig'
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
    },
    findConfigDetail(index, row) {
      this.tableView = true
      // eslint-disable-next-line no-unused-vars
      const configId = row.configId
      // eslint-disable-next-line eqeqeq
      this.chooseDetails = this.details.filter(p => p.configId.indexOf(configId) !== -1)
    }
  }
}
</script>

<style>
  .itemAction {
    margin-right: 10px;
  }
</style>
