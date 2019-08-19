<template>
  <div class="app-container allData">
    <!--查询框 -->
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="字典名称:">
          <el-input v-model="formInline.name" size="mini" />
        </el-form-item>
        <el-form-item label="字典类型:">
          <el-input v-model="formInline.type" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 增删改按钮框 -->
    <div>
      <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto">增加</el-link>
      <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="delete1">删除</el-link>
      <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="update1">修改</el-link>
      <el-link class="itemAction" type="primary" icon="el-icon-upload2" @click="import1">导入</el-link>
      <el-link class="itemAction" type="primary" icon="el-icon-download" @click="export1">导出</el-link>
    </div>

    <el-table
      ref="multipleTable"
      border="true"
      :data="dictionaries"
      tooltip-effect="dark"
      stripe
      height
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="字典名" />
      <el-table-column prop="category" label="字典类型" sortable="true" />
      <el-table-column prop="value" label="字典值" />
      <el-table-column prop="updatedTime" label="更新时间" />
      <el-table-column prop="remark" label="备注信息" />
      <el-table-column prop="status" label="启用标记" sortable="true" />
      <el-table-column label="操作" style="white-space:nowrap">
        <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="goto" />
        <el-link class="itemAction" type="primary" icon="el-icon-delete" @click="delete1" />
        <el-link class="itemAction" type="primary" icon="el-icon-edit" @click="update1" />
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
  </div>
</template>

<script>
// import { log } from 'util'
export default {
  name: 'Dictionary',
  data() {
    return {
      /**
       * 查询字段
       */
      formInline: {
        name: '',
        type: ''
      },

      /**
       * 字典管理
       */
      dictionaries: [
        {
          name: '难度',
          category: 'parentDep',
          value: 'hrCode',
          updatedTime: '2019-8-18',
          remark: '1',
          status: '启用'
        },
        {
          name: '部门',
          category: 'parentDep',
          value: 'hrCode',
          updatedTime: '2019-8-18',
          remark: '1',
          status: '启用'
        },
        {
          name: '试卷类型',
          category: 'parentDep',
          value: 'hrCode',
          updatedTime: '2019-8-18',
          remark: '1',
          status: '启用'
        },
        {
          name: '题型',
          category: 'parentDep',
          value: 'hrCode',
          updatedTime: '2019-8-18',
          remark: '1',
          status: '启用'
        },
        {
          name: '组织机构',
          category: 'parentDep',
          value: 'hrCode',
          updatedTime: '2019-8-18',
          remark: '1',
          status: '启用'
        },
        {
          name: '人资部',
          category: 'parentDep',
          value: 'hrCode',
          updatedTime: '2019-8-18',
          remark: '1',
          status: '启用'
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
        name: 'AddDictionary'
      })
    },
    update1() {
      this.$router.push({
        name: 'UpdateDictionary'
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

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
