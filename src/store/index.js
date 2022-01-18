import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 公共状态
let state = {
    token: null,
    userName: null,
    pwd: null,
    code: null,
    showMessage: false,
    userAccount: null,
    userHeadIcon: null
}

// 修改公共状态
const mutations = {
    // 设置token
    SETTOKEN (state, token) {
        if (token) {
            localStorage.setItem('loglevel:webpack-dev-server', token)
            state.token = token
        }
    },
    // 删除token
    REMOVETOKEN (state) {
        localStorage.removeItem('loglevel:webpack-dev-server')
        state.token = null
    },
    // 设置用户名
    SETUSERNAME(state, userName) {
        if (userName) {
            localStorage.setItem('userName', userName)
            state.userName = userName
        }
    },
    // 删除用户名
    REMOVEUSERNAME(state) {
        localStorage.removeItem('userName')
        state.userName = null
    },
    // 设置用户Account(用户名)
    SETUSERACCOUNT(state, userAccount) {
        if (userAccount) {
            localStorage.setItem('userAccount', userAccount)
            state.userAccount = userAccount
        }
    },
    
 
}

// 做业务逻辑及异步数据的加载
const actions = {
    // 设置token
    setToken({ commit }, token) {
        commit('SETTOKEN', token)
    },
    // 删除token
    removeToken({ commit }, token) {
        commit('REMOVETOKEN', token)
    },
    // 设置用户名
    setUserName({ commit }, userName) {
        commit('SETUSERNAME', userName)
    },
    // 删除用户名
    removeUserName({ commit }, userName) {
        commit('REMOVEUSERNAME', userName)
    },
    // 设置用户Account(用户名)
    setUserAccount({ commit }, userAccount) {
        commit('SETUSERACCOUNT', userAccount)
    },
 
}

const getters = {
    token: (state) => {
        if (!state.token) {
            state.token = localStorage.getItem('loglevel:webpack-dev-server')
        }
        return state.token
    },
    userName: (state) => {
        if (!state.userName) {
            state.userName = localStorage.getItem('userName')
        }
        return state.userName
    },
}

//通过Vuex创建仓库
const store= new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules:{}
})


export default store