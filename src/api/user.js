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

  url,

}