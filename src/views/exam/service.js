import { addNewRecord } from '@/api/exam'
import { deleteRecordById, deleteRecordByIdList, updatePublishRecord } from '../../api/exam'
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
  }
}
