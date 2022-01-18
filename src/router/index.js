import Vue from 'vue'
import Router from 'vue-router'
// import login from '@/components/login/login'
import { getToken } from '@/utils/auth'

Vue.use(Router)

var router= new Router({
  // mode:'history',
  routes: [
    {
      // 登录页
      path: '/',
      name: 'login',
      component: resolve => require(['@/components/login/login'], resolve)
    },
    {
      // 首页
      path: '/home',
      name: 'home',
      component: resolve => require(['@/components/view/home'], resolve),
      children:[
    //用户管理
        {
          //用户管理---账号信息
          path: '/user',
          name: 'user',
          component: resolve => require(['@/components/view/user/user'], resolve)
        },
        {
          //用户管理---账号注销
          path: '/close',
          name: 'close',
          component: resolve => require(['@/components/view/user/close'], resolve)
        },
        {
          //用户管理---账号申诉
          path: '/appeal',
          name: 'appeal',
          component: resolve => require(['@/components/view/user/appeal'], resolve)
        },
        {
          //用户管理---账号设备
          path: '/account',
          name: 'account',
          component: resolve => require(['@/components/view/user/account'], resolve)
        },
    //投诉管理
        {
          //投诉管理---投诉问题办理
          path: '/complaint',
          name: 'complaint',
          component: resolve => require(['@/components/view/complaint/complaint'], resolve)
        },
        {
          //投诉管理---处理结果查询
          path: '/result',
          name: 'result',
          component: resolve => require(['@/components/view/complaint/result'], resolve)
        },
    //反馈管理
        {
          //用户反馈
          path: '/feedback',
          name: 'feedback',
          component: resolve => require(['@/components/view/feedback/feedback'], resolve)
        },
        {
          //客服反馈
          path: '/customerback',
          name: 'customerback',
          component: resolve => require(['@/components/view/feedback/customerback'], resolve)
        },
    //公告信息发送
        {
          path: '/notice',
          name: 'notice',
          component: resolve => require(['@/components/view/other/notice'], resolve)
        },
        {
          path: '/qrcode',
          name: 'qrcode',
          component: resolve => require(['@/components/view/other/qrcode'], resolve)
        },
    // 统计和图表
        {
          // 用户活动统计和图表
          path: '/online',
          name: 'online',
          component: resolve => require(['@/components/view/other/online'], resolve)
        },
        {
          // 用户活动统计和图表
          path: '/chart',
          name: 'chart',
          component: resolve => require(['@/components/view/other/chart'], resolve)
        },
        
    //未知页面
        {
          //用户管理详情页面
          path: '/activityDetails',
          name: 'activityDetails',
          component: resolve => require(['@/components/view/user/components/activityDetails'], resolve)
        },
        {
          //管理信息操作记录
          path: '/message',
          name: 'message',
          component: resolve => require(['@/components/view/other/message'], resolve)
        },

      ],
      redirect:"/user",
    },

    // app 端页面
    {
      // app 端  反馈管理
      path: '/appFeedback',
      name: 'appFeedback',
      component: resolve => require(['@/components/view/client/appFeedback'], resolve),
      meta:{
        title:'意见反馈'
      }
    },
    {
      // app 端  用户账户申诉
      path: '/appAppeal',
      name: 'appAppeal',
      component: resolve => require(['@/components/view/client/appAppeal'], resolve)
    },
    {
      // app 端  用户投诉
      path: '/appUserComplaint',
      name: 'appUserComplaint',
      component: resolve => require(['@/components/view/client/appUserComplaint'], resolve)
    },
    {
      // app 端  用户群组投诉
      path: '/appGroupComplaint',
      name: 'appGroupComplaint',
      component: resolve => require(['@/components/view/client/appGroupComplaint'], resolve)
    },
    {
      // app 端  客户端打卡功能
      path: '/appClock',
      name: 'appClock',
      component: resolve => require(['@/components/view/client/appClock'], resolve),
      meta:{
        title:'打卡'
      }
    },
    {
      // app 端  广告
      path: '/appAdvertising',
      name: 'appAdvertising',
      component: resolve => require(['@/components/view/client/appAdvertising'], resolve)
    },
  ]
})



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

// router.beforeEach((to, from, next) => {
// 	const token = getToken()
// 	if(to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
// 		if (token) { // 判断缓存里面是否有 token  //在登录的时候设置它的值
// 			next();
// 		}else {
// 			next({
// 				path: '/login',
// 				query: {
// 					redirect: to.fullPath
// 				} // 将跳转的路由path作为参数，登录成功后跳转到该路由
// 			})
// 		}
// 	}else {
// 		next();
// 	}
// })


export default router


const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}