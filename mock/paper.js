
export default [
  {
    url: '/paper/composition',
    type: 'get',
    response: config => {
      // console.log(config.body)
      return {
        code: 200,
        data: {
          list: paperList,
          total: 3
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
