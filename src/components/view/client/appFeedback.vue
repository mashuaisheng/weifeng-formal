<template>
    <div class= "app_div">
        <!-- <div class="back">意见反馈</div> -->
        <el-form ref="form" :model="form"  :rules="rulesAddUser">
            <!-- <el-form-item prop="userId" label="被投诉用户编号">
                <el-input v-model="form.userId"></el-input>
            </el-form-item> -->
            <el-form-item label="意见反馈" prop="feedbackContent">
                <el-input type="textarea" v-model="form.feedbackContent" :rows="7" placeholder="遇到什么问题？还是想要什么功能？请您描述..."></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交意见</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                feedbackContent: '',
                userId:'',
            },
            rulesAddUser: {
                feedbackContent: [
                    { required: true, message: '请输入反馈意见', trigger: 'blur' },
                    { min: 6, max: 100, message: '长度在 6 到 500个字符', trigger: 'blur' }
                ],
            },
            qs:"",
            userId:"",
            token:'',
        }
    },
     mounted:function(){
        this.QueryString();
    },
    methods: {
        QueryString() {
        	var name, value, i;
            var str = decodeURI(location.href);
        	var num = str.indexOf("?")
            str = str.substr(num + 1);
            var arrtmp = str.split("&");
        	for(i = 0; i < arrtmp.length; i++) {
                num = arrtmp[i].indexOf("=");
        		if(num > 0) {
        			name = arrtmp[i].substring(0, num);
        			value = arrtmp[i].substr(num + 1);
                    this[name] = value;
        		}
            }
            return this;
        },
        onSubmit() {
            this.qs = this.QueryString();
            this.userId = this.qs['userId'];
            this.token = this.qs['token'];
            this.$refs.form.validate(async valid => {
                if (!valid) return null  // 如果验证失败就不往下继续执行
                let model = this.$refs.form.model;
                // this.axios.post("http://172.16.0.57:8972/app/user/v1/feedbackMessage?userId=" +this.userId +"&feedbackContent=" +model.feedbackContent+"&state=" +1+"&token=" +this.token)
                // this.axios.post("http://test.viefong.com:8972/app/user/v1/feedbackMessage?userId=" +this.userId +"&feedbackContent=" +model.feedbackContent+"&state=" +1+"&token=" +this.token)
                this.axios.post("http://viefong.com:8972/app/user/v1/feedbackMessage?userId=" +this.userId +"&feedbackContent=" +model.feedbackContent+"&state=" +1+"&token=" +this.token)
                .then(res => {
                    // console.log(444 , res);
                    if(res.data.rescode==100){
                        this.$message({
                            message: '反馈成功',
                            type: 'success',
                        });
                        model.feedbackContent="";
                    }else{
                        this.$message.error('反馈失败');
                    }
                });
            })
        },
    },
}
</script>

<style scope="less">
    .back{
        font-size:20px;
        margin:20px auto;
        padding-left:80px;
        /* border:1px solid red; */
    }
    .app_div{
        margin:20px;
    }
</style>
<style>
  .el-form-item__label{
    /*font-size:20px!important;*/
    font-weight:bold!important;
  }
  .el-textarea{
    font-size: 16px!important;
  }
  .el-textarea__inner{
    font-size: 16px!important;
  }
</style>
