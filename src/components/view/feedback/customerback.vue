<template>
    <div style="height:835px;">
        <div style="border-bottom:1px solid gray;padding:10px 10px;margin-bottom:40px;display:flex;justify-content:space-between;">
            <div style="font-weight:bold;font-size:30px;">客服反馈信息</div>
            <el-button @click="add" type="primary" size="small">添加客服反馈</el-button>
        </div>
        <el-table :data="feedbackMessage" border style="width: 100%">
            <!-- <el-table-column fixed prop="userId" label="编号" width="150"></el-table-column> -->
            <el-table-column prop="nickName" label="昵称" width="200"></el-table-column>
            <el-table-column prop="createTime" label="反馈时间" width="260"></el-table-column>
            <el-table-column prop="feedbackContent" label="反馈意见"></el-table-column>
        </el-table>
        <el-pagination style="margin:20px auto;text-align:center;" @size-change="sizeChange" @current-change="pageChange" :current-page="this.obj.pageNum" background :page-size="this.obj.pageSize" layout="total, prev, pager, next" :total="this.total"></el-pagination>
         <!-- 添加用户弹框 -->
        <el-dialog title="审核用户" @close="addDialogClose" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
            <!-- 添加用户的表单 -->
            <el-form ref="rules" :rules="rulesAddUser" label-width="150px" :model="rules">
                <el-form-item label="客服反馈" prop="userId">
                    <el-select  v-model="rules.userId" placeholder="请选择">
                        <el-option v-for="item in getAllRole" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="feedbackContent" label="反馈信息">
                    <el-input  type="textarea" v-model="rules.feedbackContent" :rows="5" placeholder="请输入内容..."></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogTableVisible = false">取消</el-button>
                    <el-button type="primary" @click="onAddUser">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "feedback.vue",
    data(){
        return{
            dialogTableVisible: false, // 添加用户弹框
            // 验证规则
            rulesAddUser: {
                userId: [
                        { required: true, message: '请选择客服', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                feedbackContent: [
                    { required: true, message: '请输入审核信息', trigger: 'blur' },
                    { min: 6, max: 100, message: '长度在 6 到 100个字符', trigger: 'blur' }
                ],
            },
            rules: {
                userId: 'admin',
                feedbackContent:""
            },
            //反馈信息查询
            feedbackMessage:[],
            total:0,
            obj: {
              pageNum: 1,
              pageSize: 10
            },
            //获取客服列表
            getAllRole:[],
            idcc:"",
        };
    },
    mounted(){
        //反馈信息查询
        this.feedbackMessageList();
        //获取客服列表
        this.getAllRoleList();
    },
    methods:{
        // 关闭弹框的回调
        addDialogClose() {
            this.$refs.rules.resetFields() // 清空表单
        },
        add(){
            this.dialogTableVisible = true;
            // this.onAddUser();
        },
        // 客服添加反馈
        onAddUser() {
            this.$refs.rules.validate(async valid => {
                let model = this.$refs.rules.model;
                for(var i=0;i<this.getAllRole.length;i++){
                    if(this.getAllRole[i].userName == this.$refs.rules.model.userId){
                        this.idcc = this.getAllRole[i].id;
                    }
                }
                if (!valid) return null  // 如果验证失败就不往下继续执行
                // this.axios.post("http://172.16.0.57:8972/app/manage/v1/feedbackMessage?userId=" +this.idcc +"&feedbackContent=" +model.feedbackContent+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                // this.axios.post("http://test.viefong.com:8972/app/manage/v1/feedbackMessage?userId=" +this.idcc +"&feedbackContent=" +model.feedbackContent+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                this.axios.post("http://viefong.com:8972/app/manage/v1/feedbackMessage?userId=" +this.idcc +"&feedbackContent=" +model.feedbackContent+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                .then(res => {
                    if(res.data.rescode==100){
                        this.$message({
                            message: '反馈成功',
                            type: 'success',
                        });
                        this.dialogTableVisible = false;
                        this.feedbackMessageList();
                    }else{
                        this.$message.error('反馈失败');
                    }
                });
            })
        },
        //获取所有客服信息
        getAllRoleList(){
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getAllRole?"+"&token=" +localStorage.getItem("tokenlo"))
            // this.axios.post("http://test.viefong.com:8972/app/manage/v1/getAllRole?"+"&token=" +localStorage.getItem("tokenlo"))
            this.axios.post("http://viefong.com:8972/app/manage/v1/getAllRole?"+"&token=" +localStorage.getItem("tokenlo"))
                .then(res => {
                    if(res.data.rescode==100){
                        this.getAllRole = res.data.data;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
        },
        // 选择页数
		pageChange(currentPage) {
			this.obj.pageNum = currentPage;
			this.feedbackMessageList();
		},
		// 选择行数
		sizeChange(rows) {
			this.obj.pageSize = rows;
			this.feedbackMessageList();
        },
        //反馈信息查询
        feedbackMessageList(){
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/feedbackMessageList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
            // this.axios.post("http://test.viefong.com:8972/app/manage/v1/feedbackMessageList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
            this.axios.post("http://viefong.com:8972/app/manage/v1/feedbackMessageList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                .then(res => {
                    if(res.data.rescode==100){
                        this.total = res.data.totalSize;
                        this.feedbackMessage = res.data.data;
                        for (var i = 0; i < this.feedbackMessage.length; i++) {
                            function getLocalTime(nS) {
                                return new Date(parseInt(nS) * 1000).toLocaleString();
                            }
                            this.feedbackMessage[i].createTime = getLocalTime(this.feedbackMessage[i].createTime);
                        }
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
        },
    },

}
</script>

<style scoped="less">

</style>
