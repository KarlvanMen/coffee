import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        jwt: ''
    },
    mutations: {
        setJwt(state, jwt) {
            state.jwt = jwt
            Vue.$cookies.set('jwt',jwt)
        }
    },
    getters: {
      isJwtSet: state => {
        if (state.jwt == '' && Vue.$cookies.get('jwt') !== null) {
          state.jwt = Vue.$cookies.get('jwt')
        }
        return state.jwt == '' ? false : true
      },
      getJwt: state => {
        return state.jwt
      }
    }
})
  
export default store