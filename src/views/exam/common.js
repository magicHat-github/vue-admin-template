import { parseTime } from '@/utils'
/**
 * 分页布局
 */
export const layout = 'total,sizes,prev,pager,next,jumper'
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
    status: '未发布',
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
  examStartTime: [
    { type: 'date', required: true, message: '必须选择考试开始时间', trigger: 'blur' }
  ],
  examEndTime: [
    { type: 'date', required: true, message: '必须选择考试截止时间', trigger: 'blur' }
  ],
  planPeopleNum: [
    { required: true, message: '必须输入计划参加人数', trigger: 'blur' },
    { type: 'number', message: '必须输入数字' }
  ],
  examLimitTime: [
    { required: true, message: '必须输入考试时长', trigger: 'blur' },
    { type: 'number', message: '时长必须为数字' }
  ],
  judges: [
    // { type: 'array', required: true, message: '必须选择至少一个阅卷官', trigger: 'blur' }
    { validator: checkJudges, trigger: 'blur' }
  ],
  markingEndTime: [
    { required: true, message: '必须选择阅卷截止时间', trigger: 'blur' }
  ]
}
/**
 * 弹窗的类型
 */
export const DialogType = {
  // 重新发布记录类型
  REPUBLISH: 1,
  // 新发布记录类型
  NEWPUBLISH: 2,
  // 编辑记录
  EDITRECORD: 3
}
/**
 * 模拟答卷数据
 */
export const answerData = [
  {
    title: '秋招',
    examSessionName: '十月份场次',
    endTime: '2019-10-29 12:00:00',
    tel: '12312341234',
    examerName: '龙同学',
    actualStartTime: '2019-10-29 11:00:00',
    actualEndTime: '2019-10-29 11:00:00',
    makingStopTime: '2019-11-10 12:00:00',
    objectiveScore: 24,
    subjectiveScore: 34
  },
  {
    title: '秋招',
    examSessionName: '十月份场次',
    endTime: '2019-10-29 12:00:00',
    tel: '12312341234',
    examerName: '龙同学',
    actualStartTime: '2019-10-29 11:00:00',
    actualEndTime: '2019-10-29 11:00:00',
    makingStopTime: '2019-11-10 12:00:00',
    objectiveScore: 24,
    subjectiveScore: 34
  },
  {
    title: '秋招',
    examSessionName: '十月份场次',
    endTime: '2019-10-29 12:00:00',
    tel: '12312341234',
    examerName: '龙同学',
    actualStartTime: '2019-10-29 11:00:00',
    actualEndTime: '2019-10-29 11:00:00',
    makingStopTime: '2019-11-10 12:00:00',
    objectiveScore: 24,
    subjectiveScore: 34
  },
  {
    title: '秋招',
    examSessionName: '十月份场次',
    endTime: '2019-10-29 12:00:00',
    tel: '12312341234',
    examerName: '龙同学',
    actualStartTime: '2019-10-29 11:00:00',
    actualEndTime: '2019-10-29 11:00:00',
    makingStopTime: '2019-11-10 12:00:00',
    objectiveScore: 24,
    subjectiveScore: 34
  }
]
/**
 * 考试批阅
 */
export const markingStatuOptions = [
  {
    value: 'marked',
    label: '已批阅'
  },
  {
    value: 'unmark',
    label: '未批阅'
  }
]
/**
 * 考试批阅的数据
 */
export const markingMockData = [
  {
    paperName: 'java基础',
    examSessionName: '秋招第一场',
    publishTime: '2019-10-11 11:11:11',
    tel: '12312341234',
    examerName: '李同学',
    actualEndTime: '2019-10-1 11:11:11',
    makingStopTime: '2019-11-1 11:11:11',
    objectiveScore: '50',
    subjectiveScore: '49',
    systemEvaluate: 'A',
    status: 1
  },
  {
    paperName: 'java基础',
    examSessionName: '秋招第一场',
    publishTime: '2019-10-11 11:11:11',
    tel: '12312341234',
    examerName: '李同学',
    actualEndTime: '2019-10-1 11:11:11',
    makingStopTime: '2019-11-1 11:11:11',
    objectiveScore: '50',
    subjectiveScore: '49',
    systemEvaluate: 'A',
    status: 1
  },
  {
    paperName: 'java基础',
    examSessionName: '秋招第一场',
    publishTime: '2019-10-11 11:11:11',
    tel: '12312341234',
    examerName: '李同学',
    actualEndTime: '2019-10-1 11:11:11',
    makingStopTime: '2019-11-1 11:11:11',
    objectiveScore: '50',
    subjectiveScore: '49',
    systemEvaluate: 'A',
    status: 1
  },
  {
    paperName: 'java基础',
    examSessionName: '秋招第一场',
    publishTime: '2019-10-11 11:11:11',
    tel: '12312341234',
    examerName: '李同学',
    actualEndTime: '2019-10-1 11:11:11',
    makingStopTime: '2019-11-1 11:11:11',
    objectiveScore: '50',
    subjectiveScore: '49',
    systemEvaluate: 'A',
    status: 1
  }
]
export const filters = {
  operateFilter: val => {
    // 只有处于未发布的状态才可以编辑
    const unPublished = 0
    if (val.status !== unPublished) {
      return true
    } else {
      return false
    }
  },
  toggle: val => {
    return !val
  },
  timeFilter: val => {
    return parseTime(val)
  },
  statusFilter: val => {
    const description = ['未发布', '发布中', '发布结束']
    return description[val]
  }
}
