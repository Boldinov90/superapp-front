import axios from 'axios'
import { createStore } from 'vuex'

export default createStore({
    state: {
        superApp: {
            logInStatus: false,
            user: {
                id: '',
                name: ''
            },
            toDo: []
        }
    },
    mutations: {
        TOGGLE_LOGIN_STATUS_IN_STATE (state){
            state.superApp.logInStatus = !state.superApp.logInStatus
        },
        CLEAR_SUPERAPP_IN_STATE(state) {
            state.superApp.user = {
                id: '',
                name: ''
            },
            state.superApp.toDo = []
        },
        SET_USER_TO_STATE(state, response){
            state.superApp.user.id = response.data.user._id
            state.superApp.user.name = response.data.user.name
        },
        SET_TODO_TO_STATE(state, response){
            state.superApp.toDo = response.data.user.toDo
        },
        SET_DATA_FROM_LOCALSTORAGE_TO_STATE(state, lS){
            state.superApp.logInStatus = lS.logInStatus
            state.superApp.user = lS.user
        },
        GET_USERTODO_BY_ID_AND_SAVE_TO_STATE(state, response){
            state.superApp.toDo = response.data.toDo
        }
    },
    actions: {
        TOGGLE_LOGIN_STATUS_IN_STATE ({commit}) {
            commit('TOGGLE_LOGIN_STATUS_IN_STATE')
        },
        CLEAR_SUPERAPP_IN_STATE ({commit}) {
            commit('CLEAR_SUPERAPP_IN_STATE')
        },
        SET_USER_TO_STATE({commit}, response){
            commit('SET_USER_TO_STATE', response)
        },
        SET_TODO_TO_STATE({commit}, response){
            commit('SET_TODO_TO_STATE', response)
        },
        SET_DATA_FROM_LOCALSTORAGE_TO_STATE({commit}){
            let lS = JSON.parse(localStorage.getItem('superApp'))
            if(!lS){
                lS = {
                    logInStatus: false,
                    user: {
                        name: '',
                        id: ''
                    }
                }
                localStorage.setItem('superApp', JSON.stringify(lS))
            }else{
                commit('SET_DATA_FROM_LOCALSTORAGE_TO_STATE', lS)
                return lS
            }
        },
        async GET_USERTODO_BY_ID_AND_SAVE_TO_STATE({commit}){
            let lS = JSON.parse(localStorage.getItem('superApp'))
            // http://localhost:3000/api/auth/62616965fc481b1d3a1441a8
            const response = await axios.get(`http://localhost:3000/api/auth/${lS.user.id}`)
            // console.log(response)
            commit('GET_USERTODO_BY_ID_AND_SAVE_TO_STATE', response)
            return response
        }
    },
    getters: {
        LOGINSTATUS (state) {
            return state.superApp.logInStatus
        },
        SUPERAPP (state) {
            return state.superApp
        }
    },
    modules: {}
})
