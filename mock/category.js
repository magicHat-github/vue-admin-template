
export default [
  {
    url: '/boss/bes/basedata/category',
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
            list: categoryList,
            total: 6
          }
        }
      }
    }
  }
]

// const catetoryTree = [
//   {
//     label: '数学题',
//     children: [
//       {
//         label: '几何'
//       }
//     ]
//   },
//   {
//     label: '物理题',
//     children: [
//       {
//         label: '力学'
//       },
//       {
//         label: '电学'
//       }
//     ]
//   }
// ]

// eslint-disable-next-line no-unused-vars
const categoryList = [
  {
    name: '腾讯',
    categoryId: '001',
    remark: '腾讯',
    updatedTime: '2019/8/19',
    status: '1'
  },
  {
    name: '阿里',
    categoryId: '002',
    remark: '腾讯',
    updatedTime: '2019/8/19',
    status: '0'
  },
  {
    name: '阿里',
    categoryId: '002',
    remark: '腾讯',
    updatedTime: '2019/8/19',
    status: '0'
  },
  {
    name: '阿里',
    categoryId: '002',
    remark: '腾讯',
    updatedTime: '2019/8/19',
    status: '0'
  },
  {
    name: '阿里',
    categoryId: '002',
    remark: '腾讯',
    updatedTime: '2019/8/19',
    status: '0'
  }
]
