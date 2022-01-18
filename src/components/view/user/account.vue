<template>
    <div style="height:835px;">
        <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="">
            <el-input v-model="deviceNumes" ref="deviceNumes" placeholder="请输入设备编号" @keyup.enter.native="onSearch()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="SubAccountList" border style="width: 100%">
            <el-table-column prop="userId" label="用户编号"></el-table-column>
            <el-table-column prop="userNickName" label="用户昵称"></el-table-column>
            <el-table-column prop="toUserId" label="子账户编号"></el-table-column>
            <el-table-column prop="toUserIdNickName" label="子账户昵称"></el-table-column>
            <el-table-column prop="deviceNum" label="设备编号"></el-table-column>
            <el-table-column prop="isBind" label="绑定状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.isBind==0" style="color:red;font-size:16px;">已解绑</span>
                    <el-button v-if="scope.row.isBind==1" @click="banClick(scope.row)" type="warning" size="small" style="border-bottom:1px solid red;">已绑定</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin:20px auto;text-align:center;" @size-change="sizeChange" @current-change="pageChange" :current-page="this.obj.pageNum" background :page-size="this.obj.pageSize" layout="total, prev, pager, next" :total="this.total"></el-pagination>
    </div>
</template>
<script>
    export default {
        name: "account.vue",
        data(){
            return{
                SubAccountList:[],//用户设备数组
                subAccountId:'',//设备id
                total:0,//条数
                deviceNumes:'',//搜索字段
                obj: {
                    pageNum: 1,
                    pageSize: 10
                },//分页
            };
        },
        mounted(){
            // this.getUserCancellationListList();
            this.$refs.deviceNumes.focus();//光标事件
        },
        methods:{
            //用户设备列表
            getUserCancellationListList() {
                // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getDeviceList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                this.axios.post("http://viefong.com:8972/app/manage/v1/getDeviceList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                        if(res.data.rescode==100){
                            this.total = res.data.totalSize;
                            this.SubAccountList = res.data.data;
                            for (var i = 0; i < this.SubAccountList.length; i++) {
                                this.SubAccountList[i].isBind = this.SubAccountList[i].isBind;
                                this.SubAccountList[i].id = this.SubAccountList[i].id;
                                // this.SubAccountList[i].isBind = this.SubAccountList[i].isBind===1?"绑定中":"已解绑"; 
                            }
                        }else{
                            this.$message({
                                message: "未获取用户子账户",
                                type: 'error'
                            });
                        }
                    });
            },
            //搜索设备编号
            onSearch() {
                var deviceNumes = this.deviceNumes;//搜索字段
                if (deviceNumes == "") {
                    this.$message.error("请输入设备编号");
                } else{
                    // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getDeviceByNum?deviceNum=" +deviceNumes+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    // this.axios.post("http://test.viefong.com:8972/app/manage/v1/getDeviceByNum?deviceNum=" +deviceNumes+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    this.axios.post("http://viefong.com:8972/app/manage/v1/getDeviceByNum?deviceNum=" +deviceNumes+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                        if(res.data.rescode == 100 && res.data.data.length != 0){
                            this.total = res.data.totalSize;//总条数
                            this.SubAccountList = res.data.data;//搜索信息展示
                            for (var i = 0; i < this.SubAccountList.length; i++) {
                                this.SubAccountList[i].isBind = this.SubAccountList[i].isBind;//绑定状态
                                this.SubAccountList[i].id = this.SubAccountList[i].id;
                            }
                        }else{
                            this.$message.error("未搜索到该设备");
                        }
                    })
                }
            },
            // 选择页数
            pageChange(currentPage) {
                this.obj.pageNum = currentPage;
            },
            // 选择行数
            sizeChange(rows) {
                this.obj.pageSize = rows;
            },
            //解除设备
            banClick(row) {
                this.subAccountId=row.id
                this.$confirm('您确定要解绑此设备吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose:(action , instance , done)=>{
                        if(action === "confirm"){
                            instance.$refs["confirm"].$el.onclick=function(e){
                                e=e||window.event;
                                if(e.detail != 0){
                                    done();
                                }
                            }();
                        }else{
                            done();
                        };
                    },
                    type: 'warning'
                }).then(() => {
                    // console.log(this.subAccountId)
                    // this.axios.post("http://172.16.0.57:8972/app/manage/v1/unboundDevice?token=" +localStorage.getItem("tokenlo") +"&deviceId=" +this.subAccountId)
                    // this.axios.post("http://test.viefong.com:8972/app/manage/v1/unboundDevice?token=" +localStorage.getItem("tokenlo") +"&deviceId=" +this.subAccountId)
                    this.axios.post("http://viefong.com:8972/app/manage/v1/unboundDevice?token=" +localStorage.getItem("tokenlo") +"&deviceId=" +this.subAccountId)
                    .then(res => {
                        if(res.data.rescode==100){
                            this.$message({
                                type: 'success',
                                message: '解绑成功!'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
        },
    }
</script>

<style scoped>

</style>
