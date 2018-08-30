import axios from 'axios'
import settings from '../settings'

const url = (path = '') => `${settings.baseApi}/cluster${path || ''}`

export default {

  list() {
    return new Promise(function(resolve, reject){
      axios.get(url())
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  get(id) {
    return new Promise(function(resolve, reject){
      axios.get(url(`/${id}`))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  create(data) {
    return new Promise(function(resolve, reject){
      axios.post(url(), data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

}