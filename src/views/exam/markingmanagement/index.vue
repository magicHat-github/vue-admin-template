<template>
  <div id="marking-management">
    <h3>评卷管理</h3>
    <el-form inline="ture" :model="queryForm" size="mini" class="querydiv">
      <el-form-item label="批阅状态:">
        <el-select v-model="queryForm.selectStatus">
          <el-option
            v-for="item in statusOptions"
            :key="item"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交卷时间段:从">
        <el-date-picker
          v-model="value3"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </el-form-item>
      <el-form-item label="场次:">
        <el-inputx />
      </el-form-item>
      <el-form-item>
        <el-button>查询</el-button>
      </el-form-item>
    </el-form>
    <div id="editDiv">
      <span>
        <el-link :underline="false" class="el-icon-s-claim">批阅</el-link>
      </span>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe size="mini" border fit>
        <el-table-column type="selection" />
        <el-table-column prop="a" label="试卷" />
        <el-table-column prop="" label="场次" />
        <el-table-column prop="" label="发布日期" />
        <el-table-column prop="" label="答卷人手机号" />
        <el-table-column prop="" label="答卷人" />
        <el-table-column prop="" label="交卷时间" />
        <el-table-column prop="" label="阅卷终止时间" />
        <el-table-column prop="" label="客观题" />
        <el-table-column prop="" label="主观题" />
        <el-table-column prop="" label="系统评价" />
        <el-table-column prop="" label="状态" />
        <el-table-column prop="" label="操作">
          <template slot-scope="{ row }">
            <el-button class="el-icon-s-claim" type="text" @click="edit(row)">批阅</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页系统 -->
      <el-pagination
        :background="background"
        :layout="layout"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
// import { layout, pageSizes } from '@/views/exam/common'
export default {
  name: 'MarkingManagement',
  data() {
    return {
      queryForm: {
        selectStatus: 'marked'
      },
      tableData: [
        {
          a: 'ff'
        }
      ],
      statusOptions: [
        {
          value: 'marked',
          label: '已批阅'
        },
        {
          value: 'unmark',
          label: '未批阅'
        }
      ]
    }
  }
}
</script>
<style>
#marking-management {
  margin: 20px;
}
#editDiv {
  margin-left: 15px;
  margin-bottom: 20px;
}
#editDiv span {
  margin-left: 10px;
  font-size: 16px;
}
</style>
