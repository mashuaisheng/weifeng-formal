<!--登录页-->
<template>
<div class="login-whole">
  <div class="login">
    <div class="form">
      <h2>微鳯后台&nbsp;&nbsp;&nbsp;管理系统</h2>
      <div class="form-lo">
        <el-form :model="ruleForm"	status-icon :rules="rules" ref="ruleForm" label-width="100px"	class="demo-ruleForm" @submit.native.prevent>
          <el-form-item label="账号" prop="userName">
            <el-input type="text" v-model="ruleForm.userName" autocomplete="off" placeholder="请输入账户" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"  placeholder="请输入密码" maxlength="16">></el-input>
          </el-form-item>
          <el-form-item prop="sidentify"> 
              <el-col :span="14">
                <el-input placeholder="请输入验证码" v-model="ruleForm.sidentify" @keyup.enter.native="submitForm('ruleForm')"></el-input>
              </el-col>
              <el-col :span="8">
                <v-sidentify ref="sidentify"></v-sidentify>
              </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  
  <div class="keep-record">
    <span style="width:30%;text-align:right;float:left;margin-left:200px;margin-top:3px;">北京纽曼凤凰科技有限公司</span>
      <div style="float:left;margin-left:20px;margin-bottom:5px;">
          <img src="/static/img/guohui.png" width="30px" height="30px" class="guohui">
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802037851">京公网安备&nbsp;11010802037851</a>&nbsp;&nbsp;&nbsp;
          <a href="https://beian.miit.gov.cn/#/Integrated/index">京ICP备&nbsp;15063200号-2</a>
      </div>
  </div>
</div>
</template>

<script>
import Sidentify from './common/Sidentify'  //**引入验证码组件**
import {mapActions} from 'vuex'
export default {
  name: "login.vue",
  data() {
    return {
       ruleForm: {
          userName: '',
          password: '',
          sidentify: '',
        },
        rules: {
          userName: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur' }
          ],
          sidentify:[
              { required: true, message: '请输入验证码', trigger: 'blur' },
          ],
        }
    };
  },
  components: {
      'v-sidentify':Sidentify 
  },
   methods: {
      ...mapActions(['setUserName','setToken','setUserAccount']),
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  // this.axios.post('http://172.16.0.57:8972/app/resource/v1/webAccountLogin?'+"&userName="+this.$refs[formName].model.userName +"&password=" +this.$refs[formName].model.password)
                  // this.axios.post('http://test.viefong.com:8972/app/resource/v1/webAccountLogin?'+"&userName="+this.$refs[formName].model.userName +"&password=" +this.$refs[formName].model.password)
                  this.axios.post('http://viefong.com:8972/app/resource/v1/webAccountLogin?'+"&userName="+this.$refs[formName].model.userName +"&password=" +this.$refs[formName].model.password)
                  .then((res)=>{
                    if(this.$refs[formName].model.sidentify==this.$refs.sidentify.value.toLowerCase() || this.$refs[formName].model.sidentify==this.$refs.sidentify.value){
                        if(res.data.rescode==100){
                            this.$message({
                                message: '恭喜您，登录成功',
                                type: 'success'
                            });
                            // 存储
                            localStorage.setItem("tokenlo", res.data.data.token);
                            localStorage.setItem("userName", res.data.data.userName);
                            this.$router.push({path:"/home"})
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    }else{
                        this.$message.error("验证码错误");
                    }
                  })
              } else {
                  return false;
              }
          });
      },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login{
  width: 100%;
  height: 100%;
  padding-bottom: 18%;
  display: flex;
  /* align-items: center; */
  justify-content: center;
  background: url('/static/img/login.jpg') no-repeat;
  background-size:100% 100%;
}
.form{
	margin-top: 240px;
	height: 350px;
	width: 30%;
	border: 1px solid gray;
	-moz-box-shadow:0 0 20px gray;
    -webkit-box-shadow:0 0 20px gray;
    box-shadow:0 0 20px gray;
}
.form-lo{
	height: 200px;
	padding:20px;
}
.form>h2{
	border-bottom:1px solid gray ;
    height: 55px;
    line-height: 55px ;
    font-size: 20px;
    padding-left:20px;
    background: #edf3fe;
}
.keep-record{
  justify-content: center;
  justify-content: space-around;
  /* display: flex; */
  /* width:100%; */
  font-size: 18px;
  margin-top:15px;
}
.keep-record a{
  color: black;
  text-decoration: none;
}
.guohui{
  vertical-align: middle;
}
</style>
