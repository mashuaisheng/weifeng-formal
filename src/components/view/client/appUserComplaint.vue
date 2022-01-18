<template>
	<div class="app_div">
		<!-- <div>请选择您的申诉原因</div> -->
		<div class="message-1">
            <div class="message-1-2">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<!-- <el-form-item label="投诉者编号"  prop="userId ">
						<el-input v-model="ruleForm.userId"></el-input>
					</el-form-item>
                    <el-form-item label="被投诉者编号"  prop="toTarget">
						<el-input v-model="ruleForm.toTarget"></el-input>
					</el-form-item> -->
                    <el-form-item label="投诉原因" prop="cityCodeName">
                         <el-select v-model="ruleForm.cityCodeName" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                   <el-form-item label="上传图片" label-width="100px" >
                        <el-upload v-model="ruleForm.uploadPicUrl" ref="uploadPicUrl" :action="domain" accept="image/png,image/gif,image/jpg,image/jpeg" list-type="picture-card" :limit="limitNum" :auto-upload="true" :on-error="uploadError" :on-success="uploadSuccess" :on-exceed="handleExceed" :before-upload="handleBeforeUpload" :on-remove="handleRemove" :file-list="fileList"><i class="el-icon-plus"></i>
                            <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg文件，最多上传3张且单张图片不超过2M</div> -->
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="this.imagefile" alt="">
                        </el-dialog>
                    </el-form-item>
					<el-form-item label="投诉描述" prop="content">
						<el-input type="textarea" v-model="ruleForm.content" :rows="7" placeholder="请输入问题..."></el-input>
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
             QiniuData: {
                key: "", //图片名字处理
                token: "" //七牛云token
            },
            // domain: "http://172.16.0.57:8972/app/file/v1/uploadImage", // 七牛云的上传地址（华南区）
            domain: "http://viefong.com:8972/app/file/v1/uploadImage", // 七牛云的上传地址（华南区）
            qiniuaddr: "http://web.niumine.com/", // 七牛云的图片外链地址
            fileList: [],//上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
            uploadPicUrl: "", //提交到后台图片地址
            dialogVisible: false,
            // formLabelWidth: '80px',
            limitNum: 3,
            imagefile : [],
            fileUrl:[],
            imagefile2:[],
			options: [{
				value: '发布不正当内容',
				label: '发布不正当内容'
			},{
				value: '此号可能被盗用',
				label: '此号可能被盗用'
			},{
				value: '冒充他人',
				label: '冒充他人'
			} ,{
				value: '发布仿冒信息',
				label: '发布仿冒信息'
			} ,{
				value: '其他',
				label: '其他'
			} ],
			ruleForm: {
				content:'',
				cityCodeName: '发布不正当内容',
                userId:'',
                toTarget:'',
			},
			rules: {
				cityCodeName: [
					{ required: true, message: '请输入投诉原因', trigger: 'blur' },
				],
				content: [
					{ required: true, message: '请输入问题描述', trigger: 'blur' },
					{ min: 6, max: 100, message: '长度在 6 到 500个字符', trigger: 'blur' }
                ],
                uploadPicUrl :[
					{ required: true, trigger: 'blur'},
                ],
			}
		};
	},
	mounted(){
        this.getQiniuToken();
        this.QueryString();
	},
	methods:{
        //获取浏览器地址
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
        //上传图片
        //请求后台拿七牛云token
        getQiniuToken() {
            // this.axios.post("http://172.16.0.57:8972/app/file/v1/getQINIUToken")
            this.axios.post("http://viefong.com:8972/app/file/v1/getQINIUToken")
            .then(res => {
                if(res.data.rescode==100){
                    this.QiniuData.token = res.data.data;
                }else{
                    this.$message.error(res.data.msg);
                }
            });
        },
       // 上传文件之前的钩子
        handleBeforeUpload(file){
            // console.log(file);
            const isPNG = file.type === "image/png";
            const isJPEG = file.type === "image/jpeg";
            const isJPG = file.type === "image/jpg";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isPNG && !isJPEG && !isJPG) {
                this.$message.error("上传头像图片只能是 jpg、png、jpeg 格式!");
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
                return false;
            }
            this.QiniuData.key = `upload_pic_${file.name}`;
            // console.log(this.QiniuData);
        },
        // 文件超出个数限制时的钩子
        handleExceed(files, fileList) {
            this.$notify.warning({
                title: '警告',
                // message: `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`
                 message: `只能选择 ${this.limitNum} 个文件`
            });
        },
        //上传成功时
        uploadSuccess(response, file, fileList) {
            this.uploadPicUrl = `${this.qiniuaddr}${response.data.key}`;
            for(var i=0;i<fileList.length ; i++){
                this.fileUrl = fileList[i].response.data.url;
            }
            this.imagefile.push(this.fileUrl);
        },
        //报错时
        uploadError(err, file, fileList) {
            this.$message({
                message: "上传出错，请重试！",
                type: "error",
                center: true
            });
        },
        // 文件列表移除文件时的钩子
        handleRemove(file, fileList) {
            const getIndex = ((arr,item)=>{
                for(var i in arr){
                    if(arr[i] == item){
                        return arr.splice(i, 1);
                    };
                };
            });
            getIndex(this.imagefile,file.response.data.url);
            // this.axios.post("http://172.16.0.57:8972/app/file/v1/deletePic?picPath="+file.response.data.url)
            this.axios.post("http://viefong.com:8972/app/file/v1/deletePic?picPath="+file.response.data.url)
            .then(res=>{
                if(res.data.rescode==100){
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                    });
                }else{
                    this.$message.error(res.data.msg);
                }
            });
        },
        //添加
		submitForm(formName){
            let qs = this.QueryString();
            let userId = qs['userId'];
            let toTarget = qs['toTarget'];
            let contents = this.$refs[formName].model.cityCodeName+":"+this.$refs[formName].model.content;
            this.$refs[formName].validate((valid) => {
				if (!valid) return null  // 如果验证失败就不往下继续执行
                let model = this.$refs[formName].model;
                // this.axios.post("http://172.16.0.57:8972/app/manage/v1/complainUser?userId=" +userId +"&toTarget=" +toTarget+"&userComplainImg=" +this.imagefile+"&content=" +contents+"&toTargetType="+ 1+"&token=" +localStorage.getItem("tokenlo"))
                this.axios.post("http://viefong.com:8972/app/manage/v1/complainUser?userId=" +userId +"&toTarget=" +toTarget+"&userComplainImg=" +this.imagefile+"&content=" +contents+"&toTargetType="+ 1+"&token=" +localStorage.getItem("tokenlo"))
                .then(res => {
                    if(res.data.rescode==100){
                        this.$message({
                            message: '投诉成功',
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