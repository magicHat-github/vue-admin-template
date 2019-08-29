
export default [
  {
    url: '/paper/composition',
    type: 'get',
    response: config => {
      // console.log(config.body)
      return {
        head: {
          version: '123',
          code: 200,
          msg: 'success',
          crypt: '123'
        },
        body: {
          data: {
            list: paperList,
            total: 3
          }
        }
      }
    }
  },
  {
    url: '/paper/config/list',
    type: 'get',
    response: config => {
      // console.log(config.body)
      return {
        head: {
          version: '123',
          code: 200,
          msg: 'success',
          crypt: '123'
        },
        body: {
          data: {
            list: paperConfigList,
            total: 20
          }
        }
      }
    }
  },
  {
    url: '/paper/config/item',
    type: 'get',
    response: config => {
      console.log(config)
      return {
        head: {
          version: '123',
          code: 200,
          msg: 'success',
          crypt: '123'
        },
        body: {
          data: {
            list: configItemList,
            total: 20
          }
        }
      }
    }
  }
]

const paperList = [
  {
    paperId: 1,
    name: '试卷1',
    paperType: 'Java',
    difficult: '简单',
    combExamTime: '123',
    score: '123',
    status: '启用',
    createdBy: '张三'
  },
  {
    paperId: 2,
    name: '试卷2',
    paperType: 'Java',
    difficult: '简单',
    combExamTime: '123',
    score: '123',
    status: '启用',
    createdBy: '张三'
  },
  {
    paperId: 3,
    name: '试卷3',
    paperType: 'Java',
    difficult: '简单',
    combExamTime: '123',
    score: '123',
    status: '启用',
    createdBy: '张三'
  }
]

const paperConfigList = [
  {
    id: '123',
    name: '配置2',
    difficult: '简单',
    updatedBy: '张三',
    updatedTime: '123',
    status: '启用',
    company: '博思',
    remark: '我是测试数据我是测试数据我是测试数据我是测试数据我是测试数据我是测试数据'
  },
  {
    id: '234',
    name: '配置1',
    difficult: '简单',
    updatedBy: '张三',
    updatedTime: '123',
    status: '启用',
    company: '博思',
    remark: '我是测试数据我是测试数据我是测试数据我是测试数据我是测试数据我是测试数据'
  },
  {
    id: '345',
    name: '配置3',
    difficult: '简单',
    updatedBy: '张三',
    updatedTime: '123',
    status: '启用',
    company: '博思',
    remark: '我是测试数据我是测试数据我是测试数据我是测试数据我是测试数据我是测试数据'
  }
]

const configItemList = [
  {
    id: '123',
    difficult: '简单',
    category: 'java',
    type: '选择题',
    number: 20,
    score: 40
  },
  {
    id: '123',
    difficult: '困难',
    category: 'java',
    type: '填空题',
    number: 20,
    score: 40
  },
  {
    id: '123',
    difficult: '容易',
    category: 'java',
    type: '主观题',
    number: 20,
    score: 40
  }
]
