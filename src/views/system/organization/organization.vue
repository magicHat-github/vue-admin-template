<template>
  <div class="app-container allData">
    <!--查询框 -->
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="组织机构:">
          <el-input v-model="formInline.name" size="mini" />
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
    </div>
    <!-- 数据显示表单 -->
    <el-table
      ref="multipleTable"
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orgname" label="组织机构" width="120" />
      <el-table-column prop="code" label="机构代码" width="120" />
      <el-table-column prop="master" label="负责人" show-overflow-tooltip />
      <el-table-column prop="tel" label="电话" show-overflow-tooltip />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
      <el-table-column prop="status" label="是否启用" show-overflow-tooltip />
      <el-table-column label="操作">
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
  name: 'App',
  data() {
    return {
      /**
       * 查询字段
       */
      formInline: {
        name: ''
      },

      /**
       * 职位管理
       */
      tableData3: [
        {
          orgname: '腾讯',
          code: 'CEO',
          master: 'xly是懒猪',
          tel: '0',
          address: '博思大厦',
          status: '1'
        },
        {
          orgname: '腾讯',
          code: 'CEO',
          master: 'xly是懒猪',
          tel: '0',
          address: '博思大厦',
          status: '1'
        },
        {
          orgname: '腾讯',
          code: 'CEO',
          master: 'xly是懒猪',
          tel: '0',
          address: '博思大厦',
          status: '1'
        },
        {
          orgname: '腾讯',
          code: 'CEO',
          master: 'xly是懒猪',
          tel: '0',
          address: '博思大厦',
          status: '1'
        },
        {
          orgname: '腾讯',
          code: 'CEO',
          master: 'xly是懒猪',
          tel: '0',
          address: '博思大厦',
          status: '1'
        },
        {
          orgname: '腾讯',
          code: 'CEO',
          master: 'xly是懒猪',
          tel: '0',
          address: '博思大厦',
          status: '1'
        },
        {
          orgname: '腾讯',
          code: 'CEO',
          master: 'xly是懒猪',
          tel: '0',
          address: '博思大厦',
          status: '1'
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
        name: 'Addorg'
      })
    },
    update1() {
      this.$router.push({
        name: 'updateorg'
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
