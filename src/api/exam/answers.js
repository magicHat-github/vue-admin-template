/**
 * 答卷查询相关的api
 */
import { examRequestApi } from '../../utils/requestUtil'

export default {
  /**
   * 根据查询条件获得答卷查询的数据
   * @param param 查询的数据
   * @returns {AxiosPromise}
   */
  queryAnswerList(param) {
    return examRequestApi(
      '/answer/list',
      'post',
      param
    )
  }
}
