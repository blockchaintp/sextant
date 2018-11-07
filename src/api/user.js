import axios from 'axios'
import settings from '../settings'

const url = (path = '') => `${settings.baseApi}/user${path || ''}`

export default {

  status() {
    return new Promise(function(resolve, reject){
      axios.get(url(`/status`))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  login() {
    return new Promise(function(resolve, reject){
      axios.post(url(`/login`))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  create(payload) {
    return new Promise(function(resolve, reject){
      axios.post(url(), payload)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  update(payload) {
    return new Promise(function(resolve, reject){
      axios.put(url(), payload)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  url,

}