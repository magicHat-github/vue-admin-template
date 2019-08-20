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
    <el-card>
      <div>
        <el-link class="itemAction" type="primary" icon="el-icon-plus" @click="addOrg">增加</el-link>
        <el-link class="itemAction" type="danger" icon="el-icon-delete" @click="deleteOrg">删除</el-link>
        <el-link class="itemAction" type="warning" icon="el-icon-edit" @click="updateOrg">修改</el-link>
      </div>
      <!-- 数据显示表单 -->
      <div>
        <el-table
          ref="multipleTable"
          :data="organizations"
          tooltip-effect="dark"
          style="width: 100%; margin-top: 10px;"
          stripe
          size="mini"
          fit
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="orgname" label="组织机构" width="120" align="center" />
          <el-table-column prop="code" label="机构代码" width="120" align="center" />
          <el-table-column prop="master" label="负责人" show-overflow-tooltip align="center" />
          <el-table-column prop="tel" label="电话" show-overflow-tooltip align="center" />
          <el-table-column prop="address" label="地址" show-overflow-tooltip align="center" />
          <el-table-column
            prop="status"
            label="是否启用"
            show-overflow-tooltip
            width="110"
            align="center"
          />
          <el-table-column label="操作" width="110" align="center">
            <el-link class="itemAction" size="mini" type="primary" icon="el-icon-plus" @click="addOrg" />
            <el-link class="itemAction" size="mini" type="danger" icon="el-icon-delete" @click="deleteOrg" />
            <el-link class="itemAction" size="mini" type="warning" icon="el-icon-edit" @click="updateOrg" />
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页部分 -->
      <div class="block">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="page.pageNumber"
          :limit.sync="page.size"
          @click="queryData"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入分页组件
import Pagination from '@/components/Pagination'
// import { log } from 'util'
export default {
  name: 'App',
  components: { Pagination },
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
      organizations: [
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
       * 默认的分页的页面数据
       */
      page: {
        size: 5,
        pageNumber: 1
      },
      // 试卷总数
      total: 0
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    /**
     * 查询数据
     */
    queryData() {
      this.total = this.organizations.length
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
    addOrg() {
      this.$router.push({
        name: 'AddOrg'
      })
    },
    updateOrg() {
      this.$router.push({
        name: 'UpdateOrg'
      })
    },

    /**
     * 删除信息
     */
    deleteOrg() {
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
