// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios'
import echarts from 'echarts'
import 'echarts/map/js/china'
import 'element-ui/lib/theme-chalk/index.css';
import 'jquery';
import store from './store';
//标题
import VueWechatTitle from 'vue-wechat-title'
import vuex from 'vuex';

//地图插件
import AMap from 'vue-amap';
Vue.use(AMap);
AMap.initAMapApiLoader({
    // key: 'your amap key',
    key:'8dd729d3398a89ddb9e057ca343e028e',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView',
    'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'] 
}); 

// vue中导出excel表格模板
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style';

Vue.prototype.$FileSaver = FileSaver; //设置全局
Vue.prototype.$XLSX = XLSX; //设置全局
Vue.prototype.$XLSXStyle = XLSXStyle; //设置全局

Vue.use(vuex);

Vue.use(VueWechatTitle);
Vue.prototype.$store = store;
Vue.prototype.axios = axios;
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
