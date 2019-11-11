import Firebase from 'firebase'
import { loading } from 'quasar'

export default {
  namespaced: true,

  state: {
    user: {
    },
    role: {
      admin: false,
      client: false
    }
  },

  getters: {
    user (state) {
      return state.user
    },

    isAuthenticated (state) {
      return !!state.user
    },
    
    isAdmin: state => {
      return !!state.role.admin
    },

    isClient: state => {
      return !!state.role.client
    }

  },

  mutations: {
    SET_USER (state, payload) {
      let user = payload
      state.user = user
    },

    SET_ADMIN (state, payload) {
      state.role.admin = payload
    },
    
    SET_CLIENT (state, payload) {
      state.role.client = payload
    },

    RESET_USER (state) {
      state.user = null
      state.role.admin = false
      state.role.client = false
    }
  },

  actions: {
    async signIn ({ commit }, payload) {
      let email = payload.email
      let password = payload.password

      await Firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => {
          commit('SET_USER', user)
        })
        .catch(error => {
          throw error
        })
    },

    async signOut ({ commit }) {
      await Firebase.auth().signOut()
        .then(() => {
          commit('SET_USER', {})
        })
    },

    async getPermissions ({ commit }, payload) {
      if (payload.admin) {
        commit('SET_ADMIN', payload.admin)
      } else {
        commit('SET_CLIENT', true)
      }
    }
    
  }
}
