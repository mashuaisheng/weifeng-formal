<template>
    <div style="height:835px;">
        <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="">
            <el-input v-model="search" ref="search" placeholder="请输入注册手机号" @keyup.enter.native="onSearch()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="getUserCancellationList" border style="width: 100%" @submit.native.prevent :header-cell-style="{color: '#848484', fontSize: '14px'}" :cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column fixed prop="nmId" label="编号"></el-table-column>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column prop="phoneNum" label="手机号"></el-table-column>
            <el-table-column prop="regTime" label="注册时间"></el-table-column>
            <el-table-column prop="lastLoginTime" label="上次登录"></el-table-column>
            <el-table-column prop="gender" label="性别" width="80"></el-table-column>
            <el-table-column prop="state" label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.state==0" style="color:red;font-size:16px;">禁用中</span>
                    <span v-if="scope.row.state==3" style="color:red;font-size:16px;">已注销</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        name: "close.vue",
        data(){
            return{
                //注销用户列表
                getUserCancellationList:[],
                search:'',//搜索字段
            };
        },
        mounted(){
            this.$refs.search.focus();//光标事件
        },
        methods:{
            cellStyle ({ row, column, rowIndex, columnIndex }) {
            // 状态列字体颜色
            if (columnIndex === 0) {
                return 'color: #4e72b8'
            } else if (columnIndex === 1) {
                return 'color: #0CB618'
            } else if (columnIndex === 3) {
                return 'color: #f58220'
            } else {
                return 'color: #1a1a1b'
            }
            },
            //搜索注销用户
            onSearch() {
                var search = this.search;//搜索字段
                if (search == "") {
                    //判断搜索的是否存在值
                    this.$message.error("请输入注销用户手机号");
                    this.getUserCancellationList=[];//清空列表
                } else{
                    // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getUsers2NotFriend?key=" +search+"&token=" +localStorage.getItem("tokenlo"))
                    // this.axios.post("http://test.viefong.com:8972/app/manage/v1/getUsers2NotFriend?key=" +search+"&token=" +localStorage.getItem("tokenlo"))
                    this.axios.post("http://viefong.com:8972/app/manage/v1/getUsers2NotFriend?key=" +search+"&token=" +localStorage.getItem("tokenlo"))
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
                            function getLocalTime(nS) {
                                return new Date(parseInt(nS) * 1000).toLocaleString();
                            }//转换时间格式
                            res.data.data.lastLoginTime = getLocalTime(res.data.data.lastLoginTime);//上次登录时间展示
                            res.data.data.regTime = getLocalTime(res.data.data.regTime);//注册时间展示
                             //如果该用户的状态为0则为注销，并进行展示数据
                             if(res.data.data.state == 0){
                                if (this.newdata == []) {
                                    this.newdata.push(res.data.data);
                                } else {
                                    this.newdata = [];
                                    this.newdata.push(res.data.data);
                                }
                                this.getUserCancellationList = this.newdata;//用户展示的信息
                                this.uid = res.data.data.uid;//用户id
                                for (var i = 0; i < this.getUserCancellationList.length; i++) {
                                    this.getUserCancellationList[i].gender = this.getUserCancellationList[i].gender===1?'男':'女';//判断性别
                                }
                                this.$message({
                                    message: "搜索成功",
                                    type: "success"
                                });
                             }else{
                                 //如果该用户状态为1就是没有注销，则不进行展示
                                this.$message({
                                    message: "对不起，您搜索的用户未注销",
                                    type: 'error'
                                });
                                this.getUserCancellationList=[];//清空列表
                             }
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
