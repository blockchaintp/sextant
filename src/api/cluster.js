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

  delete(id) {
    return new Promise(function(resolve, reject){
      axios.delete(url(`/${id}`))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  cleanup(id) {
    return new Promise(function(resolve, reject){
      axios.put(url(`/cleanup/${id}`))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  status(id) {
    return new Promise(function(resolve, reject){
      axios.get(url(`/status/${id}`))
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

  createKeypair(data) {
    return new Promise(function(resolve, reject){
      axios.post(url(`/keypair/create`), data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

}