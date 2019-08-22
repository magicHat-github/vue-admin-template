export default [
  {
    url: '/system/company-department-tree',
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
          TreeVO: TreeVO
        }
      }
    }
  },
  {

  }
]
const TreeVO = [
  {
    id: 1,
    label: '假公司 1',
    children: [
      {
        id: 11,
        label: '部门 1-1'
      }
    ]
  },
  {
    id: 2,
    label: '公司 2',
    children: [
      {
        id: 21,
        label: '部门 2-1'
      },
      {
        id: 22,
        label: '部门 2-2'
      }
    ]
  }
]
