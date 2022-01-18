<template>
	<div class="app_div">
		<!-- <div>请选择您的申诉原因</div> -->
		<div class="message-1">
            <div class="message-1-2">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="用户编号" prop="userId">
						<el-input v-model="ruleForm.userId"></el-input>
					</el-form-item>
                    <el-form-item label="申诉原因" prop="appealReason">
                         <el-select v-model="ruleForm.appealReason" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="问题描述" prop="appealContent">
						<el-input type="textarea" v-model="ruleForm.appealContent" :rows="7" placeholder="请输入问题..."></el-input>
					</el-form-item>
					<el-form-item label="手机号码"  prop="appealPhone">
						<el-input v-model="ruleForm.appealPhone"></el-input>
					</el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
	</div>
</template>

<script>
export default {
	data(){
		return{
			options: [{
				value: '帐号被封',
				label: '帐号被封'
			} ],
			ruleForm: {
				appealContent:'',
				appealReason: '帐号被封',
				appealPhone:'',
				userId:'',
			},
			rules: {
				appealReason: [
					{ required: true, message: '请输入申诉原因', trigger: 'blur' },
				],
				appealContent: [
					{ required: true, message: '请输入问题描述', trigger: 'blur' },
					{ min: 6, max: 100, message: '长度在 6 到 500个字符', trigger: 'blur' }
				],
				appealPhone: [
				{ required: true, message: "请输入手机号", trigger: "blur" },
				// 这个只能验证手机号
				{ pattern:/^0{0,1}(122[0-9]|13[0-9]|14[0-9]|19[0-9]|16[0-9]|18[0-9]|17[0-9]|15[7-9]|153|156)[0-9]{8}$/, message: "请输入合法手机号", trigger: "blur"}
				],
			}
		};
	},
	mounted(){

	},
	methods:{
		submitForm(formName){
			this.$refs[formName].validate((valid) => {
				if (!valid) return null  // 如果验证失败就不往下继续执行
				let model = this.$refs[formName].model;
				// this.axios.post("http://172.16.0.57:8972/app/user/v1/userAppeal?userId=" +model.userId +"&appealReason=" +model.appealReason+"&appealContent=" +model.appealContent+"&appealPhone=" +model.appealPhone+"&token=" +localStorage.getItem("tokenlo"))
				// this.axios.post("http://test.viefong.com:8972/app/user/v1/userAppeal?userId=" +model.userId +"&appealReason=" +model.appealReason+"&appealContent=" +model.appealContent+"&appealPhone=" +model.appealPhone+"&token=" +localStorage.getItem("tokenlo"))
				this.axios.post("http://viefong.com:8972/app/user/v1/userAppeal?userId=" +model.userId +"&appealReason=" +model.appealReason+"&appealContent=" +model.appealContent+"&appealPhone=" +model.appealPhone+"&token=" +localStorage.getItem("tokenlo"))
                .then(res => {
                    if(res.data.rescode==100){
                        this.$message({
                            message: '发送成功',
                            type: 'success',
                        });
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
			})
		}
	},
}
</script>

<style scoped="less">
	.app_div{
        margin:10px 20px 0 10px;
    }
</style>
