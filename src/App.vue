<template>
  <div id="app">
      <!-- <router-view/> -->
      <router-view v-wechat-title='$route.meta.title'></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
}
html,body,#app{
  width: 100%;
  height: 100%;
  /*background: #73819c;*/
}
</style>
