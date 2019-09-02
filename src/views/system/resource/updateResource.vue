<template>
  <div class="app-container allData">
    <h1 style="font-size:25px;" class="el-icon-menu">修改资源</h1>
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
        label-position="left"
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
              <el-select
                v-model="resourceForm.parent"
                value-key="id"
                filterable
                clearable
                placeholder="请选择"
                @visible-change="$forceUpdate()"
              >
                <el-option
                  v-for="parent in parents"
                  :key="parent.id"
                  :label="parent.name"
                  :value="parent"
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
            <el-form-item label="备注">
              <el-input
                v-model="resourceForm.remark"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行 -->
        <el-row>
          <!-- 资源类型下拉框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="是否子叶节点">
              <el-radio v-model="resourceForm.leaf" :disabled="leafdisabled" label="1">是</el-radio>
              <el-radio v-model="resourceForm.leaf" :disabled="leafdisabled" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 -->
        <el-row>
          <!-- 资源类型下拉框 -->
          <el-col :span="7" :offset="3">
            <el-form-item label="是否启用">
              <el-radio v-model="resourceForm.status" label="1">是</el-radio>
              <el-radio v-model="resourceForm.status" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第八行 -->
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
import { updateResource, fetchResource } from '@/api/system/resource'
export default {
  data() {
    return {
      /**
       * 表单数据
       */
      resourceForm: {
        id: '',
        version: '',
        name: '',
        code: '',
        parent: '',
        url: '',
        resourceType: '',
        openImg: '',
        closeImg: '',
        leaf: '0',
        remark: '',
        status: '1'
      },
      /**
       * 表单校验规则
       */
      resourceRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
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
       * 父亲节点下拉框选项
       */
      parents: [],
      /**
       * 打开图标和关闭图标下拉框选项
       */
      resources: [
        { openImg: '打开1', closeImg: '关闭1', type: 1 },
        { openImg: '打开2', closeImg: '关闭2', type: 2 },
        { openImg: '打开3', closeImg: '关闭3', type: 3 }
      ],
      leafdisabled: false
    }
  },
  created() {
    const resource = this.$route.params.resource
    this.queryResource(resource)
  },
  methods: {
    /**
     * 查询树结构数据，从而获取公司名字和机构数据
     */
    queryResource(resource) {
      const params = {
        resourceName: resource.name,
        parentName: resource.parentName,
        pageSize: 1,
        pageNum: 1
      }
      fetchResource(params).then(result => {
        const body = result.body
        // 转换表单数据
        console.log('this is result')
        this.resourceForm = body.dataList[0]
        const parent = {
          name: body.dataList[0].parentName,
          id: body.dataList[0].parentId
        }
        this.resourceForm.parent = parent
        this.resourceForm.leaf = body.dataList[0].leaf + ''
        this.resourceForm.status = body.dataList[0].status + ''
        console.log(this.resourceForm)
        // 转换树结构的数据
        console.log('this is tree')
        console.log(body.tree)
        const tree = body.tree.treeNodeList
        this.transDataToTree(tree)
      })
    },
    /**
     * 查询树结构的方法
     */
    transDataToTree(arr) {
      return arr.map(element => {
        return this.getChildren(element)
      })
    },
    /**
     * 用树结构的数据对下拉框进行填充
     */
    getChildren(element) {
      if (!element.childList) {
        console.log('this is leafnode')
        console.log(element)
        if (element.leaf === 0) {
          const parent = {
            name: element.name,
            id: element.id
          }
          this.parents.push(parent)
        }
        const re = {
          label: element.name,
          id: element.id,
          children: null
        }
        return re
      } else {
        console.log('this is node')
        console.log(element)
        if (element.leaf === 0) {
          const parent = {
            name: element.name,
            id: element.id
          }
          this.parents.push(parent)
        }
        // 如果存在子节点，不允许将子节点设为父节点
        if (element.name === this.resourceForm.name) {
          // 如果当前节点不是根节点，则当前表单中，该数据不能为叶子节点，且不允许修改
          if (!element.parentId) {
            this.leafdisabled = true
          }
          return
        }
        return {
          children: this.transDataToTree(element.childList)
        }
      }
    },
    /**
     * 保存按钮
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
          this.submit()
        } else {
          return false
        }
      })
    },
    /**
     * 提交数据的promise函数
     */
    submit() {
      const params = {
        id: this.resourceForm.id,
        version: this.resourceForm.version,
        name: this.resourceForm.name,
        code: this.resourceForm.code,
        parentId: this.resourceForm.parent.id,
        parentName: this.resourceForm.parent.name,
        url: this.resourceForm.url,
        resourceType: this.resourceForm.resourceType,
        openImg: this.resourceForm.openImg,
        closeImg: this.resourceForm.closeImg,
        remark: this.resourceForm.remark,
        leaf: this.resourceForm.leaf,
        status: this.resourceForm.status
      }
      console.log('this is params')
      console.log(params)
      updateResource(params).then(result => {
        this.close()
        this.$message(result.head.msg)
      })
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
