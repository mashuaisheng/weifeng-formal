<template>
    <div>
        <el-table :data="getGroup" border style="width: 100%">
        <el-table-column fixed prop="id" label="编号" width="100"></el-table-column>
        <el-table-column prop="userName" label="操作人" width="110"></el-table-column>
        <el-table-column prop="param" label="传入参数" width="400"></el-table-column>
        <el-table-column prop="className" label="类名" width="300"></el-table-column>
        <el-table-column prop="methodName" label="方法名" width="180"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="160"></el-table-column>
        <el-table-column prop="userAction" label="操作内容"></el-table-column>
      </el-table>
		<el-pagination style="margin:20px auto;text-align:center;" @size-change="sizeChange" @current-change="pageChange" :current-page="obj.pageNum" background :page-size="obj.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
</template>

<script>
    export default {
        name: "message.vue",
        data() {
            return {
                //获取操作记录
                getGroup:[],
                total:0,
                obj: {
                    userId: 1,
                    pageNum: 1,
                    pageSize: 10
                },
            }
        },
        mounted(){
            //获取操作记录
            this.operatingList();
        },
        methods:{
            // 选择页数
            pageChange(currentPage) {
                this.obj.pageNum = currentPage;
                this.operatingList();
            },
            // 选择行数
            sizeChange(rows) {
                this.obj.pageSize = rows;
                this.operatingList();
            },
             //获取操作记录
            operatingList(){
                // this.axios.post("http://172.16.0.57:8972/app/manage/v1/operationLog?"+"&userId="+this.obj.userId +"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                // this.axios.post("http://test.viefong.com:8972/app/manage/v1/operationLog?"+"&userId="+this.obj.userId +"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                this.axios.post("http://viefong.com:8972/app/manage/v1/operationLog?"+"&userId="+this.obj.userId +"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                        if(res.data.rescode==100){
                            // console.log(33 ,  res);
                            this.total = res.data.totalSize;
                            this.getGroup = res.data.data;
                            for (var i = 0; i < this.getGroup.length; i++) {
                                // this.getGroup[i].userId = this.getGroup[i].userId===1?'admin':"普通用户";
                                function getLocalTime(nS) {
                                    return new Date(parseInt(nS) * 1000).toLocaleString();
                                }
                                this.getGroup[i].createTime = getLocalTime(this.getGroup[i].createTime);
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
