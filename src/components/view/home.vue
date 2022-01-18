<!--首页 -->
<template>
  <div>
    <el-container>
      <el-header  class="top">
        <h2>微鳯后台管理系统</h2>
        <div class="right">
          <span class="topRightSpan1" style="margin-right:10px;">{{userName}}用户</span>
          <span class="topRightSpan2" @click="loginOut">退出</span>
        </div>
      </el-header>
      <el-container>
        <el-aside style="width:270px">
          <el-row class="tac" style="height:100%;">
            <el-col :span="20">
              <el-menu background-color="#1b222c" text-color="#fff" active-text-color="#ffd04b" default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router :default-active="$route.path" unique-opened>
              <div v-for="(item, index) in listar" :key="index">
                <el-submenu v-if="item.chirldResources&&item.chirldResources.length>0" :index="item.rid">
                  <template slot="title" :index="item.url">
                    <i :class="item.iconLevel"></i>
                    <span>{{item.resourceName}}</span>
                  </template>
                  <el-menu-item-group v-for="(items, index) in item.chirldResources" :key="index">
                    <el-menu-item :index="items.url">{{items.resourceName}}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item v-else :index="item.url">
                  <i :class="item.iconLevel"></i>
                  <span slot="title">{{item.resourceName}}</span>
                </el-menu-item>
              </div>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main><router-view/></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
      return {
          listar:[],
          Out:[],
          userName:[],
      };
  },
  mounted(){
      //登录
      this.list();
  },
  methods: {
      handleOpen(key, keyPath) {
          // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
          // console.log(key, keyPath);
      },
      //退出登录
      loginOut(){
          // this.axios.post("http://172.16.0.57:8972/app/resource/v1/webLoginOut?token="+localStorage.getItem("tokenlo"))
          // this.axios.post("http://test.viefong.com:8972/app/resource/v1/webLoginOut?token="+localStorage.getItem("tokenlo"))
          this.axios.post("http://viefong.com:8972/app/resource/v1/webLoginOut?token="+localStorage.getItem("tokenlo"))
          .then((res)=>{
              if(res.data.rescode==100){
                  this.Out = res.data.rescode;
                  localStorage.clear();
                  this.$router.push('/');
                  this.$message({
                    message: '退出成功',
                    type: 'success'
                  });
              }else{
                  this.$message.error(res.data.msg);
              }
          })
      },
      //检测是否登录
      list() {
          // this.axios.post('http://172.16.0.57:8972/app/resource/v1/getList?token='+localStorage.getItem("tokenlo"))
          // this.axios.post('http://test.viefong.com:8972/app/resource/v1/getList?token='+localStorage.getItem("tokenlo"))
          this.axios.post('http://viefong.com:8972/app/resource/v1/getList?token='+localStorage.getItem("tokenlo"))
          .then((res)=>{
              if(res.data.rescode==100){
                  this.listar = res.data.data;
                  this.userName = localStorage.getItem("userName")
              }else{
                  this.$message.error("请登录");
                  this.$router.push('/');
              }
          })
      },
  },
};
</script>
<style scoped="less">
.top{
	border-bottom:2px solid #000;
	background:#31394c;
	width: 100%;
	display: flex;
	justify-content:space-between;
}
h2{
	color: #FFFFFF;
	font-size: 20px;
	line-height: 60px;
}
.right{
	color: #FFFFFF;
	font-size: 20px;
	line-height: 60px;
}

a{
  color: #FFFFFF;
  text-decoration: none;
}
.aa{
  color:rgb(64, 255, 128);
}
.topRightSpan2:hover{
  color:#3e8bff;
  cursor:pointer
}
.router-link-active{
  color: #409EFF;
}
.el-menu-vertical-demo {
  height: 100%;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
.el-col{
  height: 100%;
}
.el-submenu .el-menu-item{
	color:rgb(119,136,153)!important;
  padding-left:60px !important;
}
.el-submenu .el-menu-item.is-active{
	color:rgb(255, 208, 75)!important;
}
</style>
