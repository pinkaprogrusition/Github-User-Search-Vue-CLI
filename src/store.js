import { createStore } from "vuex";

export default createStore({
    state () {
      return {
        users: []
      }
    },
    getters: {
        getUserByUsername: (state) => (username) => {
          return state.users.find(user => user.login  === username)
        }
    },
    mutations: {
      setUsersList (state, users) {
        state.users = users
      }
    }
  })