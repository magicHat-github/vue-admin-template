import { baseDataRequestApi } from '@/utils/requestUtil'

export function select(params) {
  return baseDataRequestApi('/types', 'post', params)
}

export function deleteList(params) {
  return baseDataRequestApi('/type', 'delete', params)
}

export function insert(params) {
  return baseDataRequestApi('/type', 'post', params)
}

export function selectById(params) {
  return baseDataRequestApi('/type/searchById', 'post', params)
}

export function update(params) {
  return baseDataRequestApi('/type', 'put', params)
}
