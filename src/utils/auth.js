/**
 * 鉴权文件验证用户登陆设置Token
 */

const Tokenkey = 'tec-trans-platform-datong-token'

export const getToken = () => localStorage.getItem(Tokenkey)

export const setToken = (token) => localStorage.setItem(Tokenkey,token)

export const removeToken = () => localStorage.removeItem(Tokenkey)