import { baseDataRequestApi } from '@/utils/requestUtil'

export function select(params) {
  return baseDataRequestApi('/subjects', 'post', params)
}

export function deleteList(params) {
  return baseDataRequestApi('/subject', 'delete', params)
}

export function searchCategoryTree() {
  return baseDataRequestApi('/category/searchTree', 'get')
}

export function selectType(params) {
  return baseDataRequestApi('/types', 'post', params)
}

export function selectDifficult(params) {
  return baseDataRequestApi('/dictionary/queryRecord', 'post', params)
}

export function insert(params) {
  return baseDataRequestApi('/subject', 'post', params)
}
export function searchById(params) {
  return baseDataRequestApi('/subject/searchById', 'post', params)
}

export function update(params) {
  return baseDataRequestApi('/subject', 'put', params)
}
