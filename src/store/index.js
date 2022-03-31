import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
    state: {
        superApp: {
            logInTrue: false,
            id: '',
            name: '',
            email: '',
            password: '',
            toDo: []
        }
    },
    mutations: {
        updateLogInStatus(state){
            state.superApp.logInTrue = !state.superApp.logInTrue  
        }
    },
    actions: {
        async getUser() {
            const arreyUsers = await axios.get('http://localhost:3000/users')
        }
    },
    getters: {
        logInTrue(state) {
            return state.superApp.logInTrue
        }
    },
    modules: {}
})
