import { baseDataRequestApi } from '@/utils/requestUtil'

export function select(params) {
  return baseDataRequestApi('/subjects', 'post', params)
}
