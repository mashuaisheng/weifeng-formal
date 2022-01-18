<template>
    <div style="height:835px;">
        <!-- <div style="font-weight:bold;font-size:30px;border-bottom:1px solid gray;padding:10px 10px;margin-bottom:30px;display:flex;">用户反馈管理</div> -->
        <div style="border-bottom:1px solid gray;padding:10px 10px;margin-bottom:40px;display:flex;justify-content:space-between;">
            <div style="font-weight:bold;font-size:30px;">用户反馈信息</div>
            <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
                <el-form-item label="">
                    <el-input v-model="search" ref="search" placeholder="请输入反馈用户名" @keyup.enter.native="onSearch()"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="feedbackMessage" border style="width: 100%">
            <!-- <el-table-column fixed prop="userId" label="编号" width="150"></el-table-column> -->
            <el-table-column prop="nickName" label="昵称" width="200"></el-table-column>
            <el-table-column prop="createTime" label="反馈时间" width="260"></el-table-column>
            <el-table-column prop="feedbackContent" label="反馈意见"></el-table-column>
        </el-table>
        <el-pagination style="margin:20px auto;text-align:center;" @size-change="sizeChange" @current-change="pageChange" :current-page="this.obj.pageNum" background :page-size="this.obj.pageSize" layout="total, prev, pager, next" :total="this.total"></el-pagination>
    </div>
</template>

<script>
export default {
    name: "feedback.vue",
    data(){
        return{
            //反馈信息查询
            feedbackMessage:[],
            total:0,
            obj: {
              pageNum: 1,
              pageSize: 10
			},
            search:'',//搜索字段
        };
    },
    mounted(){
        this.feedbackMessageList();
    },
    methods:{
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
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/feedbackMessageList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
            // this.axios.post("http://test.viefong.com:8972/app/manage/v1/feedbackMessageList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
            this.axios.post("http://viefong.com:8972/app/manage/v1/feedbackMessageList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
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
        //搜索反馈用户
            onSearch() {
                var search = this.search;//搜索字段
                if (search == "") {
                    //判断搜索的是否存在值
                    this.$message.error("请输入反馈用户手机号");
                    this.feedbackMessageList();//清空列表
                } else{
                    // this.axios.post("http://172.16.0.57:8972/app/manage/v1/searchFeedbackMessage?feedbackPhone=" +search+"&state="+1+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    // this.axios.post("http://test.viefong.com:8972/app/manage/v1/searchFeedbackMessage?feedbackPhone=" +search+"&state="+1+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    this.axios.post("http://viefong.com:8972/app/manage/v1/searchFeedbackMessage?feedbackPhone=" +search+"&state="+1+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                         if(res.data.rescode==100){
                             //如果数组为空则查询失败  279452 356536
                             if(res.data.data === null){
                                this.$message({
                                    message: "未找到该用户",
                                    type: 'error'
                                });
                                this.getUserCancellationList=[];//清空列表
                                return;//终止程序
                             }
                            this.total = res.data.totalSize;
                            this.feedbackMessage = res.data.data;
                            for (var i = 0; i < this.feedbackMessage.length; i++) {
                                function getLocalTime(nS) {
                                    return new Date(parseInt(nS) * 1000).toLocaleString();
                                }
                                this.feedbackMessage[i].createTime = getLocalTime(this.feedbackMessage[i].createTime);
                            }
                            this.$message({
                                message: "搜索成功",
                                type: "success"
                            });
                        }else{
                            //搜索失败
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                }
            },
    },
}
</script>

<style scoped="less">

</style>
