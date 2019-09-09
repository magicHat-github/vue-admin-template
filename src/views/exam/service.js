import { addNewRecord } from '@/api/exam'
import {
  deleteRecordById,
  deleteRecordByIdList, getExamRecordById, getJudgeList,
  getPapers,
  publishRecordById,
  updatePublishRecord
} from '../../api/exam'
/**
 * service 层,用来调用接口的api
 */
export default {

  /**
   * 添加一条发布记录
   * @param {请求的数据} formData
   */
  addPublishRecord(formData) {
    return new Promise((resolve, reject) => {
      console.log(`传到后台的表单数据`)
      console.log(formData)
      /**
       * 设置请求格式
       */
      addNewRecord(formData)
        .then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  },
  /**
   * 重新发布考试记录的函数
   * @param {重新发布记录的数据} formData
   */
  rePublishRecord(formData) {
    return new Promise((resolve, reject) => {
      addNewRecord(formData)
        .then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  },
  /**
   * 根据id删除单条数据
   */
  deleteRecordById(id) {
    const deleteVo = {
      id: id
    }
    return new Promise((resolve, reject) => {
      deleteRecordById(deleteVo)
        .then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  },
  /**
   * 批量删除数据
   * @param {传进来的id列表} idList
   */
  deleteRecordByIdList(idList) {
    // 剔除不必要的数据
    const deleteListVo = idList.map(element => {
      return {
        id: element.id
      }
    })
    return new Promise((resolve, reject) => {
      deleteRecordByIdList(deleteListVo)
        .then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  },
  /**
   * 编辑和更新发布的数据
   * @param formData
   */
  updatePublishRecord(formData) {
    return new Promise((resolve, reject) => {
      updatePublishRecord(formData)
        .then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  },
  /**
   * 根据记录的id发布该场考试
   * @param id
   * @returns {Promise<any>}
   */
  publishExamById(id) {
    return new Promise((resolve, reject) => {
      publishRecordById(id)
        .then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  },
  /**
   * 获得试卷列表
   * @returns {Promise<any>}
   */
  getPapers() {
    return new Promise((resolve, reject) => {
      getPapers().then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  },
  /**
   * 获得所有的阅卷官列表
   * @returns {Promise<any>}
   */
  getJudgeList() {
    return new Promise((resolve, reject) => {
      getJudgeList()
        .then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  },
  /**
   * 根据id获得考试记录
   * @param id 传进来的id
   * @returns {Promise<any>}
   */
  getExamRecordById(id) {
    return new Promise((resolve, reject) => {
      getExamRecordById(id)
        .then(rsp => resolve(rsp))
        .catch(err => reject(err))
    })
  }
}
