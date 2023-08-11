import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload';
import axios from "axios"


// 屏幕切换页面 先安装 npm install vue-touch@next --save
import VueTouch from 'vue-touch';
Vue.use(VueTouch, { name: 'v-touch' });
VueTouch.config.swipe={
  threshold:50 // 设置左右滑动的距离
}





Vue.prototype.$axios = axios

//图片懒加载
Vue.use(VueLazyload)


// 设置全局的警告处理函数
Vue.config.warnHandler = function (msg, vm, trace) {
  // 忽略特定警告信息 

  // 下面是提示我不要直接修改父组件传递给子组件的 prop 值(playNum点击次数)
  if (msg.includes("Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: ")) 
  {
    return;
  }

  // 默认的警告处理逻辑
  console.warn(msg, vm, trace);
};



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
