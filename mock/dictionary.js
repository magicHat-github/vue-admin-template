
export default [
  {
    url: '/boss/bes/basedata/dictionary',
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
            list: dictionaryList,
            total: 5
          }
        }
      }
    }
  }
]
const dictionaryList = [
  {
    name: '花朵',
    category: 'flower',
    value: 'beauty',
    updatedTime: '20190821',
    remark: '123',
    status: '启用'
  },
  {
    name: '花朵',
    category: 'flower',
    value: 'beauty',
    updatedTime: '20190821',
    remark: '123',
    status: '启用'
  },
  {
    name: '花朵',
    category: 'flower',
    value: 'beauty',
    updatedTime: '20190821',
    remark: '123',
    status: '启用'
  },
  {
    name: '花朵',
    category: 'flower',
    value: 'beauty',
    updatedTime: '20190821',
    remark: '123',
    status: '启用'
  },
  {
    name: '花朵',
    category: 'flower',
    value: 'beauty',
    updatedTime: '20190821',
    remark: '123',
    status: '启用'
  }
]
