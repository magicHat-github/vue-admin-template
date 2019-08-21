<template>
  <el-container>
    <el-card class="aside">
      <!-- 左侧边栏 -->
      <el-aside width="120px">
        <!-- 树上方的信息 -->
        <el-container>
          <el-header>
            <el-row>
              <el-col>
                <h1 style="font-size: 15px;" class="el-icon-menu">公司管理</h1>
              </el-col>
            </el-row>
            <div class="horizon">
              <hr>
            </div>
          </el-header>
          <!-- 树 -->
          <el-main>
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
          </el-main>
        </el-container>
      </el-aside>
    </el-card>

    <!-- 主体部分 -->
    <el-main>
      <div>
        <!--查询框 -->
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- 公司名称输入框 -->
            <el-form-item label="公司名称:">
              <el-input v-model="formInline.companyName" clearable size="mini" />
            </el-form-item>

            <!-- 组织机构下拉框 -->
            <el-form-item label="组织机构:">
              <el-select v-model="formInline.organizationNames" placeholder="请选择" size="mini" />
            </el-form-item>

            <el-form-item>
              <el-button size="mini" type="primary" @click="queryData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card>
          <!-- 增删改按钮框 -->
          <div>
            <el-link
              class="itemAction"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addCompany"
            >增加</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteSelectedCompany"
            >删除</el-link>
            <el-link
              class="itemAction"
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="updateSelectedCompany"
            >修改</el-link>
          </div>
          <div>
            <!-- 数据显示表单 -->
            <el-table
              ref="multipleTable"
              :data="companys"
              tooltip-effect="dark"
              stripe
              style="width: 100%; margin-top: 10px;"
              size="mini"
              fit
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="name" label="公司名称" align="center" />
              <el-table-column prop="code" label="公司编号" align="center" />
              <el-table-column prop="mnemonicCode" label="助记码" align="center" />
              <el-table-column prop="master" label="法人" align="center" />
              <el-table-column prop="organizationName" label="所属机构" align="center" />
              <el-table-column prop="tax" label="税号" show-overflow-tooltip align="center" />
              <el-table-column prop="fax" label="传真" show-overflow-tooltip align="center" />
              <el-table-column prop="tel" label="电话" show-overflow-tooltip align="center" />
              <el-table-column prop="email" label="邮箱" show-overflow-tooltip align="center" />
              <el-table-column prop="website" label="网址" show-overflow-tooltip align="center" />
              <el-table-column
                prop="status"
                label="是否启用"
                sortable="true"
                width="110"
                align="center"
              />
              <el-table-column label="操作" width="110" align="center">
                <template slot-scope="scope">
                  <el-link
                    class="itemAction"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addCompany"
                  />
                  <el-link
                    class="itemAction"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteCompany"
                  />
                  <el-link
                    class="itemAction"
                    type="warning"
                    icon="el-icon-edit"
                    @click="updateCompany(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
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
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
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
       * 树结构数据
       */
      treeData: [
        {
          label: '组织机构 1',
          children: [
            {
              label: '公司 1-1'
            }
          ]
        },
        {
          label: '组织机构 2',
          children: [
            {
              label: '公司 2-1'
            },
            {
              label: '公司 2-2'
            }
          ]
        },
        {
          label: '组织机构 3',
          children: [
            {
              label: '公司 3-1',
              children: [
                {
                  label: '这是假数据 3-1-1'
                }
              ]
            },
            {
              label: '公司 3-2',
              children: [
                {
                  label: '这是假数据 3-2-1'
                }
              ]
            }
          ]
        }
      ],
      /**
       * 树结构的默认属性
       */
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      /**
       * 查询字段
       */
      formInline: {
        companyName: '',
        organizationNames: []
      },
      /**
       * 公司的表单数据
       */
      companys: [
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: '启用'
        },
        {
          name: '阿里',
          code: '002',
          mnemonicCode: '亏钱的濒危企业',
          master: '马云',
          organizationName: '中国',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: '不启用'
        },
        {
          name: '百度',
          code: '003',
          mnemonicCode: '不接广告的搜索引擎',
          master: '李红艳',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        }
      ],
      /**
       * 多选事件中的数据
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
      this.total = this.companys.length
    },
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
    addCompany(row) {
      this.$router.push({
        name: 'AddCompany'
      })
    },
    updateCompany(row) {
      this.$router.push({
        name: 'UpdateCompany',
        params: {
          row: row
        }
      })
    },

    /**
     * 顶层的菜单栏事件函数
     */
    updateSelectedCompany() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: 'info',
          message: '请选择要操作对象!'
        })
      }
      if (this.multipleSelection.length > 1) {
        this.$message({
          type: 'info',
          message: '请选择单个对象!'
        })
      }
      if (this.multipleSelection.length == 1) {
        this.$router.push({
          name: 'UpdateCompany',
          params: {
            'row': this.multipleSelection[0]
          }
        })
      }
    },

    deleteSelectedCompany() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: 'info',
          message: '请选择要操作对象!'
        })
      }
      if (this.multipleSelection.length > 0) {
        this.deleteCompany()
      }
    },

    /**
     * 删除信息
     */
    deleteCompany() {
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
.aside .el-card__body .el-main {
  padding-left: 7px;
}
.aside .el-card__body .el-header {
  padding: 5px;
}
.aside .el-card__body .el-header .el-row {
  padding: 0px 15px;
}
</style>
