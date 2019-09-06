<template>
  <div id="exam">
    <el-form :inline="true" :model="queryForm" size="mini" class="querydiv">
      <el-form-item label="试卷发布人:">
        <el-input v-model="queryForm.publisher" placeholder="输入试卷发布人" />
      </el-form-item>
      <el-form-item label="发布时间段:从">
        <el-date-picker
          v-model="queryForm.publishTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </el-form-item>
      <el-form-item label="考试时间段:从">
        <el-date-picker
          v-model="queryForm.examTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </el-form-item>
      <el-form-item label="考试标题:">
        <el-input v-model="queryForm.title" />
      </el-form-item>
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 菜单栏 -->
    <div id="editDiv">
      <span>
        <el-link :underline="false" class="el-icon-edit" @click="handleEditEvent">修改</el-link>
      </span>
      <span>
        <el-link :underline="false" class="el-icon-delete" @click="handleDeleteEvent">删除</el-link>
      </span>
      <span>
        <el-link :underline="false" class="el-icon-right" @click="handlePublishEvent">发布</el-link>
      </span>
    </div>
    <!-- 发布记录的表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        stripe
        size="mini"
        border
        fit
        style="width:100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="publisher" label="试卷发布人" />
        <el-table-column label="发布时间段" width="280">
          <template slot-scope="{ row }">
            <span>{{ row.publishStartTime|timeFilter }} 至 {{ row.publishEndTime|timeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考试结束日期和时间">
          <template slot-scope="{ row }">
            <span>{{ row.examEndTime | timeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="planPeopleCount" label="计划人数" />
        <el-table-column prop="examLimitTime" label="考试时长" />
        <el-table-column label="评卷管">
          <template slot-scope="{ row }">
            <el-tag v-for="judge in row.judges" :key="judge.judegId" size="small" style="margin-left:5px">
              {{ judge.judgeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="考试说明" />
        <el-table-column label="状态列">
          <template slot-scope="{ row }">
            <span>{{ row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publishTimes" label="发布次数" />
        <el-table-column label="操作列">
          <template slot-scope="{ row }">
            <el-button :disabled="row|operateFilter" class="el-icon-edit" type="text" @click="handleEditEvent(row)" />
            <el-button :disabled="row|operateFilter" class="el-icon-delete" type="text" @click="handleDeleteEvent(row)" />
            <el-button class="el-icon-right" type="text" @click="handlePublishEvent(row)" />
            <el-button :disabled="row|operateFilter|toggle" class="el-icon-picture" type="text" @click="handleShowQrCode(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页框 -->
    <el-pagination
      v-show="total > 0"
      background
      :layout="layout"
      :total="total"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <publish-dialog
      :record-id="dialogConfig.recordId"
      :dialog-type="dialogConfig.dialogType"
      :dialog-visible="dialogConfig.dialogVisible"
      @dialog-save="handleDialogSave"
      @close-dialog="()=> {dialogConfig.dialogVisible = false}"
    />
  </div>
</template>
<script>
// import qs from 'qs'
import { layout, pageSizes, pageSize, markOptions } from './common'
import { rules, DialogType } from './common'
import { getRecordList } from '@/api/exam'
import { filters } from './common'
import PublishDialog from './components/publish-dialog'
import service from './service'

export default {
  name: 'Exam',
  filters: filters,
  components: {
    PublishDialog
  },
  data() {
    return {
      // 查询数据的表单数据
      queryForm: {
        publisher: '', // 考试发布人
        title: '', // 考试标题
        publishTimeRange: '', // 发布的时间段
        examTimeRange: '' // 考试时间段
      },
      /**
       * 表格数据
       */
      tableData: [],
      /**
       * 编辑和发布弹窗的配置数据
       */
      dialogConfig: {
        // 弹窗的标题
        dialogTitle: '',
        // 弹窗的类型
        dialogType: 1,
        // 弹窗显示与否
        dialogVisible: false,
        // 传进去的id
        recordId: ''
      },
      /**
       * 表格单选和多选
       */
      tableForm: {
        select: ''
      },
      markOptions: markOptions,
      rules: rules,
      total: 0,
      layout: layout,
      pageSizes: pageSizes,
      pageSize: pageSize,
      currentPage: 1
    }
  },
  async mounted() {
    this.freshIndex()
  },
  methods: {
    /**
     * 获得首页数据
     */
    async freshIndex() {
      // 初始化数据
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      await getRecordList(query)
        .then(rsp => this.loadListData(rsp.body))
        .catch(err => this.showMessage('error', `网络错误${err}`))
    },
    /**
     * 查询数据
     */
    async search() {
      // 传送到后端的数据
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        publisher: this.queryForm.publisher,
        publishStartTime: this.queryForm.publishTimeRange[0],
        publishEndTime: this.queryForm.publishTimeRange[1],
        examStartTime: this.queryForm.examTimeRange[0],
        examEndTime: this.queryForm.examTimeRange[1],
        title: this.queryForm.title
      }
      await getRecordList(query)
        .then(rsp => {
          const listData = rsp.body
          this.loadListData(listData)
        }).catch(err => {
          this.$message({
            type: 'error',
            message: `请求错误${err}`
          })
        })
    },
    /**
     * 编辑记录函数
     * 可能是从菜单栏来的,
     * 也可能是从一行中的操作栏来的
     */
    handleEditEvent(row) {
      const id = row.id
      if (!id) {
        // 菜单栏编辑
        const selectNum = this.tableForm.select.length
        if (selectNum > 1) {
          this.$message({
            type: 'info',
            message: '选择太多选项了'
          })
        } else if (selectNum === 1) {
          // 根据id编辑
          const selectId = this.tableForm.select[0].id
          const selectRow = this.tableForm.select[0]
          const published = 1
          if (selectRow.status === published) {
            this.$message({
              type: 'error',
              message: '已经发布不可编辑'
            })
          } else {
            this.editPublishRecord(selectId)
          }
        } else {
          this.$message({
            type: 'info',
            message: '请选择数据'
          })
        }
      } else {
        // 侧边栏编辑
        const rowId = row.id
        const published = 1
        if (row.status === published) {
          this.$message({
            type: 'error',
            message: '已经发布不可编辑'
          })
        } else {
          this.editPublishRecord(rowId)
        }
      }
    },
    /**
     * 发布记录的事件处理
     * 可能是发布新的记录
     * 可能是重新发布新的记录
     * 如果是重新发布就要获得已发布的数据
     */
    async handlePublishEvent(row) {
      const published = 1
      const id = row.id
      if (!id) {
        // 菜单栏的发布操作
        const selectNum = this.tableForm.select.length
        if (selectNum > 1) {
          this.$message({
            type: 'info',
            message: '选项太多'
          })
        } else if (selectNum === 1) {
          // 获得选择行的id
          // 获得选择的数据
          const selectRow = this.tableForm.select[0]
          if (selectRow.status === published) {
            this.$confirm(
              '该场考试已经发布过,是否重新发布',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }
            ).then(() => {
              // 重新发布函数
              this.rePublishRecord(selectRow.id)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消重新发布'
              })
            })
          } else {
            // 调用发布函数 未发布 => 已发布
            this.publishRecord(selectRow.id)
          }
        } else {
          // 发布新的记录
          this.newPublishRecord()
        }
      } else {
        // 侧边栏的操作
        if (row.status === published) {
          this.$confirm(
            '该场考试已经发布过,是否重新发布',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }
          ).then(() => {
            // 重新发布函数
            this.rePublishRecord(row.id)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消重新发布'
            })
          })
        } else {
          // 调用发布函数 未发布 => 已发布
          this.publishRecord(row.id)
        }
      }
    },
    /**
     * 新发布记录
     * 从0开始新增一条记录
     */
    newPublishRecord() {
      this.dialogConfig.dialogType = DialogType.NEWPUBLISH
      this.dialogConfig.dialogVisible = true
    },
    /**
     * 重新发布记录
     */
    rePublishRecord(id) {
      // 打开发布弹窗
      this.dialogConfig.dialogType = DialogType.REPUBLISH
      this.dialogConfig.recordId = id
      this.dialogConfig.dialogVisible = true
    },
    /**
     * 编辑考试发布记录
     */
    editPublishRecord(id) {
      this.dialogConfig.recordId = id
      this.dialogConfig.dialogType = DialogType.EDITRECORD
      this.dialogConfig.dialogVisible = true
    },
    /**
     * 可能是保存编辑的数据
     * 可能是保存发布的数据
     */
    async handleDialogSave(formData) {
      // 判断是编辑界面还是发布界面
      const dialogType = this.dialogConfig.dialogType
      if (dialogType === DialogType.NEWPUBLISH) {
        // 调用service 的新发布函数来发布一条数据
        await service.addPublishRecord(formData)
          .then(rsp => {
            console.log(rsp)
            if (rsp.body.status === 200) {
              this.showMessage('success', '发布成功')
            } else {
              this.showMessage('error', `发布失败${rsp.body.description}`)
            }
          })
          .catch(err => this.showMessage('error', `网络错误${err}`))
        this.dialogConfig.dialogVisible = false
        // 刷新数据
        this.freshIndex()
      } else if (dialogType === DialogType.REPUBLISH) {
        // 重新发布记录流程
        service.rePublishRecord(formData)
          .then(rsp => {
            // TODO 判断操作结果
            this.showMessage('success', rsp.body.description)
            this.freshIndex()
          })
          .catch(err => { this.showMessage('error', `网络错误${err}`) })
      } else if (dialogType === DialogType.EDITRECORD) {
        // 更新发布记录
        service.updatePublishRecord(formData)
          .then(rsp => {
            if (rsp.body.status === 200) {
              this.showMessage('success', '记录更改成功')
            } else if (rsp.body.status === 201) {
              this.showMessage('error', `记录更改失败${rsp.body.description}`)
            } else {
              this.showMessage('error', '未知错误')
            }
            this.dialogConfig.dialogVisible = false
            this.freshIndex()
          })
          .catch(err => this.showMessage('error', `网络错误${err}`))
      } else {
        this.$message({
          type: 'error',
          message: '错误选项'
        })
      }
    },
    /**
     * 发布记录函数
     * 这个函数是向后台发送要发布记录的id
     * 效果是该条记录的状态从 未发布 => 已发布
     */
    async publishRecord(id) {
      this.$confirm(
        '是否要发布该场考试?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).then(() => {
        service.publishExamById(id)
          .then(rsp => {
            if (rsp.head.code === '0000') {
              this.showMessage('success', '考试已经发布，注意时间')
            } else {
              this.showMessage('error', rsp.head.msg)
            }
            this.freshIndex()
          }).catch(err => {
            this.$message({
              type: 'error',
              message: `发布错误${err}`
            })
          })
      }).catch(() => this.showMessage('info', '取消发布'))
    },
    /**
     * 处理删除事件
     * 菜单栏 多选删除
     * 菜单栏 单选删除
     * 侧边栏操作 删除
     * 删除的优先级
     * 侧边栏删除 > 菜单栏删除
     * @param {侧边栏删除传入的行数据} row
     */
    handleDeleteEvent(row) {
      if (row.id) {
        // 侧边栏删除操作
        const id = row.id
        this.$confirm('确定删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' })
          .then(_ => {
            service.deleteRecordById(id)
              .then(rsp => {
                if (rsp.body.status === 200) {
                  this.showMessage('success', '删除成功')
                } else if (rsp.body.status === 201) {
                  this.showMessage('error', `${rsp.body.description}`)
                } else {
                  this.showMessage('error', '未知错误')
                }
                this.freshIndex()
              })
          }).catch(_ => { this.showMessage('info', '取消删除') })
      } else {
        // 菜单栏删除操作
        console.log('菜单栏删除')
        // 先判断单选和多选数据
        const selectCount = this.tableForm.select.length
        if (selectCount > 0) {
          // 删除确认框
          this.$confirm(`是否删除${selectCount}条数据?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const deleteData = this.tableForm.select
            // 批量删除数据
            service.deleteRecordByIdList(deleteData)
              .then(rsp => {
                if (rsp.body.status === 200) {
                  this.showMessage('success', '删除数据成功')
                } else if (rsp.body.status === 201) {
                  this.showMessage('error', '删除数据失败')
                } else {
                  this.showMessage('error', '未知错误')
                }
              })
            this.freshIndex()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          // 没有选中任何数据
          this.$message({
            type: 'info',
            message: '没有选中任何行'
          })
        }
      }
    },
    /**
     * 选中和不选中
     */
    handleSelectionChange(val) {
      console.log(val)
      this.tableForm.select = val
    },
    /**
     * 显示二维码
     */
    handleShowQrCode(row) {
      // 1 获得row 对应的url
      const qrCodeUrl = 'https://long95288.github.io/'
      // 2 请求该条记录的qrcodeurl
      this.$router.push({ name: 'phoneanswer', params: { qrCodeUrl: qrCodeUrl }})
    },
    /**
     * 处理分页页面大小改变事件
     */
    handleSizeChange(val) {
      this.pageSize = val
      // 获得数据
      this.search()
    },
    /**
     * 处理分页页面跳转
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    /**
     * 加载列表数据
     */
    loadListData(listData) {
      this.pageSize = listData.pageSize
      this.currentPage = listData.pageNum
      this.total = listData.total
      this.tableData = listData.list
    },
    /**
     * 消息提示框
     */
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    }
  }
}
</script>
<style>
#exam {
  padding: 15px;
}
#editDiv {
  margin-left: 15px;
}
#editDiv span {
  margin-left: 10px;
  font-size: 16px;
}
.querydiv {
  margin-left: 15px;
}
.table {
  margin: 15px;
  /* margin-bottom: 15px; */
}
</style>
