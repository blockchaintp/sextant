import axios from 'axios'
import settings from '../settings'

const url = (path = '') => `${settings.baseApi}/config${path || ''}`

export default {

  getVersion() {
    return new Promise(function(resolve, reject){
      axios.get(url('/version'))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  getValues() {
    return new Promise(function(resolve, reject){
      axios.get(url('/values'))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  getAws() {
    return new Promise(function(resolve, reject){
      axios.get(url('/aws'))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  setupRemote(payload) {
    return new Promise(function(resolve, reject){
      axios.post(url('/setup_remote'), payload)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

}