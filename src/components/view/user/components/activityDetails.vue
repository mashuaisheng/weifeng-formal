<template>
    <div :data= "this .getuserCode ">
        <div>{{getuserCode.nickName}}</div>
        <!-- <el-container>
            <el-header height="auto" >
                <el-table :data="getuserCode" border>
                    <el-table-column fixed prop="nickName" label="编号" width="150"></el-table-column>
                    <el-table-column prop="nickName" label="昵称" width="200"></el-table-column>
                    <el-table-column prop="phoneNum" label="账号" width="200"></el-table-column>
                    <el-table-column prop="lastLoginTime" label="上次登录" width="300"></el-table-column>
                    <el-table-column prop="state" label="状态" width="120"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                        <template slot-scope="scope">
                        <el-button @click="banClick(scope.row)" type="text" size="small">禁用</el-button>
                        <el-button type="text" size="small" @click="ProhibitClick(scope.row)">解封</el-button>
                        </template>
                    </el-table-column>
                </el-table>         
            </el-header>
            <el-container style="padding:20px 0;box-sizing:border-box;display:flex;">
                <el-main width="50%" style="height:400px;  overflow:auto">
                <el-table border :data="friendsTable" style="width: 100%">
                    <el-table-column prop="uid" label="好友编号" width="180"></el-table-column>
                    <el-table-column prop="nickName" label="昵称" width="180"></el-table-column>
                    <el-table-column prop="phoneNum" label="账号"></el-table-column>
                </el-table>
                </el-main>
                <el-main width="50%" style="height:400px;  overflow:auto">
                <el-table border :data="groupTable" style="width: 100%">
                    <el-table-column prop="gid" label="群聊编号" width="180"></el-table-column>
                    <el-table-column prop="groupMembers[0].nickName" label="群主" width="180"></el-table-column>
                    <el-table-column prop="groupMembers.length" label="群聊人数"></el-table-column>
                </el-table>
                </el-main>
            </el-container>
        </el-container> -->
    </div>
</template>

<script>
import qs from "qs";
export default {
    data(){
        return{
            //用户详情
            getuserCode:[],
        };
    },
    mounted() {
        //用户详情
        this.demandId = this.$route.query.id;
        this.getuserCodeList();

    },
    methods: {
        //用户详情
        getuserCodeList(){
            console.log(2323,this.demandId);
            this.axios.post("http://call.newmine.net:8978/app/common/v1/getUsersMessage?userId="+this.demandId)
            .then(res=>{
                console.log(22,res);
                if(res.data.rescode==100){
                    console.log(33,res.data.data);
                    this.getuserCode = res.data.data;
                }
            })
        },
    }
}
</script>

<style>

</style>