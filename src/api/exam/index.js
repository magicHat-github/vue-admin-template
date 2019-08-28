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
    '/',
    'post',
    record
  )
}
/**
 * 更新发布记录
 * @param {更新后的数据} record Object
 */
export function updateRecord(record) {
  return examRequestApi(
    '/',
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
    '/',
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
  const param = {
    queryType: 'judge'
  }
  return examRequestApi(
    '/extra',
    'post',
    param
  )
}
/**
 * 获得试卷的列表
 */
export function getPapers() {
  const param = {
    queryType: 'paper'
  }
  return examRequestApi(
    '/extra',
    'post',
    param
  )
}
