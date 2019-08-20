/**
 * 分页布局
 */
export const layout = 'prev, pager, next'
/**
 * 分页大小
 */
export const pageSizes = [5, 10, 20, 50, 100]
/**
 * 默认页数大小
 */
export const pageSize = 5
/**
 * 虚拟的数据
 */
export const mockData = [
  {
    recordId: 11,
    publisher: '小王',
    publishTimeRange: '2019-8-19 9:03:22 至 2019-8-20 10:00:00',
    examEndTime: '2019-8-20 10:03:22',
    planPeopleCount: '100',
    examLimitTime: '112',
    judges: '王工,李工',
    description: '秋招',
    status: '已发布',
    publishTimes: 5
  },
  {
    recordId: 12,
    publisher: '小王',
    publishTimeRange: '2019-8-19 9:03:22 至 2019-8-20 10:00:00',
    examEndTime: '2019-8-20 10:03:22',
    planPeopleCount: '100',
    examLimitTime: '112',
    judges: '王工,李工',
    description: '秋招',
    status: '已发布',
    publishTimes: 5
  },
  {
    recordId: 13,
    publisher: '小王',
    publishTimeRange: '2019-8-19 9:03:22 至 2019-8-20 10:00:00',
    examEndTime: '2019-8-20 10:03:22',
    planPeopleCount: '100',
    examLimitTime: '112',
    judges: '王工,李工',
    description: '秋招',
    status: '已发布',
    publishTimes: 5
  }
]
/**
 * 评卷方式
 */
export const markOptions = [
  {
    label: '方式1',
    value: 1
  },
  {
    label: '方式2',
    value: 2
  },
  {
    label: '方式3',
    value: 3
  }
]
/**
 * 校验规则
 */
var checkJudges = (rule, value, callback) => {
  if (value.length <= 0) {
    return callback(new Error('必须选择一个阅卷官'))
  } else {
    callback()
  }
}
export const rules = {
  paperName: [
    { required: true, message: '必须选择试卷', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '必须输入考试标题', trigger: 'blur' }
  ],
  examEndDay: [
    { type: 'date', required: true, message: '必须选择考试截止日期', trigger: 'blur' }
  ],
  examEndTime: [
    { type: 'date', required: true, message: '必须选择考试截止时间', trigger: 'blur' }
  ],
  planPeopleNum: [
    { required: true, message: '必须输入计划参加人数', trigger: 'blur' }
  ],
  examLimitTime: [
    { required: true, message: '必须输入考试时长', trigger: 'blur' },
    { type: 'number', message: '时长必须为数字', trigger: 'blur' }
  ],
  judges: [
    // { type: 'array', required: true, message: '必须选择至少一个阅卷官', trigger: 'blur' }
    { validator: checkJudges, trigger: 'blur' }
  ],
  markingEndTime: [
    { required: true, message: '必须选择阅卷截止时间', trigger: 'blur' }
  ]
}
