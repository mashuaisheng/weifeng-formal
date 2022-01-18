import Vue from 'vue'
import Router from 'vue-router'
import routes from './index'
// import { getToken } from '@/utils/auth'

Vue.use(Router)

const router = new Router({routes})

// 设置全局路由守卫
router.beforeEach((to, from, next) => {
	const token = localStorage.getItem("tokenlo")
	if(to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
		if (token) { // 判断缓存里面是否有 token  //在登录的时候设置它的值
			next();
		}else {
			next({
				// path: '/',
				query: {
					redirect: to.fullPath
				} // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	}else {
		next();
	}
})

export default router
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
