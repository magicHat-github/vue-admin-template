import { examRequestApi } from '@/utils/requestUtil'

/**
 * 根据id获得考试的记录
 * @param {记录的id} id
 */
export function getExamRecordById(id) {
  return examRequestApi('/info', 'post', id)
}

/**
 * 添加一条新的记录
 * @param {记录的数据} record
 */
export function addNewRecord(record) {
  return examRequestApi(
    '/publish',
    'post',
    record
  )
}
/**
 * 更新发布记录
 * @param {更新后的数据} record Object
 */
export function updatePublishRecord(record) {
  return examRequestApi(
    '/publish',
    'put',
    record
  )
}

/**
 * 根据记录的id来删除记录
 * @param {考试记录的id} id NUMBER
 */
export function deleteRecordById(id) {
  return examRequestApi(
    '/publish',
    'delete',
    id
  )
}

/**
 * 根据分页的数据获得考试记录的列表
 * @param {分页的数据} param
 */
export function getRecordList(param) {
  return examRequestApi(
    '/list',
    'post',
    param
  )
}

/**
 * 批量删除记录
 * @param {待删除的id列表} idList
 */
export function deleteRecordByIdList(idList) {
  return examRequestApi(
    '/list',
    'delete',
    idList
  )
}
/**
 * 根据id发布考试记录，这条记录的状态只能是未发布的
 * @param {要发布的记录的id} id
 */
export function publishRecordById(id) {
  return examRequestApi(
    '/publish',
    'post',
    id
  )
}

/**
 * 根据查询条件用来查询记录
 * @param {查询的条件} queryForm Object
 */
export function queryRecord(queryForm) {
  return examRequestApi(
    '/searchApi',
    'post',
    queryForm
  )
}
/**
 * 获得阅卷官的列表
 */
export function getJudgeList() {
  return examRequestApi(
    '/judge',
    'post'
  )
}
/**
 * 获得试卷的列表
 */
export function getPapers() {
  return examRequestApi(
    '/paper',
    'post'
  )
}
