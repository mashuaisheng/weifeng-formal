<!--用户管理  -->
<template>
  <div style="height:835px;">
    <el-container>
      <el-header height="auto">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="" prop="user">
            <el-input v-model="formInline.user" ref="formInline" placeholder="请输入用户账号" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" border @submit.native.prevent :header-cell-style="{color: '#848484', fontSize: '14px'}"	:cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
          <el-table-column fixed prop="nmId" label="用户编号"></el-table-column>
          <el-table-column prop="nickName" label="昵称"></el-table-column>
          <el-table-column prop="phoneNum" label="账号"></el-table-column>
          <el-table-column prop="lastLoginTime" label="上次登录"></el-table-column>
          <el-table-column prop="state" label="用户状态">
            <template slot-scope="scope">
                <span v-if="scope.row.state==0" style="color:red;font-size:18px;">禁用中</span>
                <span v-if="scope.row.state==1" style="color:green;font-size:18px;">正常</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state==1" @click="banClick(scope.row)" type="danger" size="small">禁用</el-button>
              <el-button v-if="scope.row.state==0" @click="ProhibitClick(scope.row)" type="success" size="small">解封</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-header>
      <el-container style="padding:50px 0;box-sizing:border-box;display:flex;">
        <el-main style="height:500px;width:550px; overflow:auto">
          <el-table border :data="friendsTable" @submit.native.prevent :header-cell-style="{color: '#848484', fontSize: '14px'}"	:cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column prop="nmId" label="好友编号" width="100"></el-table-column>
            <el-table-column prop="nickName" label="昵称" width="180"></el-table-column>
            <el-table-column prop="phoneNum" label="账号"></el-table-column>
          </el-table>
        </el-main>
        <el-main style="height:500px; overflow:auto">
          <el-table border :data="groupTable" @submit.native.prevent :header-cell-style="{color: '#848484', fontSize: '14px'}"	:cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
            <!-- <el-table-column prop="gid" label="群聊编号" width="80"></el-table-column> -->
            <el-table-column prop="name" label="群名" width="140"></el-table-column>
            <el-table-column prop="groupMembers[0].nickName" label="群主" width="180"></el-table-column>
            <el-table-column prop="groupMembers.length" label="群聊人数" width="80"></el-table-column>
            <el-table-column prop="state" label="群组状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.state==1" style="color:green;font-size:18px;">正常</span>
                    <span v-if="scope.row.state==2" style="color:red;font-size:18px;">已解散</span>
                    <span v-if="scope.row.state==3" style="color:red;font-size:18px;">已封闭</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                  <el-button @click="seeNember(scope.row)" size="small" type="primary">查看群成员</el-button>
                </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <!-- 查看群组用户弹框 -->
    <el-dialog title="群成员" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <!-- 查看群组用户table -->
      <el-table border :data="groupMember">
        <el-table-column prop="aliasName" label="群成员"></el-table-column>
        <el-table-column prop="joinTime" label="加入时间" width="220px"></el-table-column>
        <el-table-column prop="state" label="用户状态">
            <template slot-scope="scope">
                <span v-if="scope.row.state==0" style="color:red;font-size:18px;">异常</span>
                <span v-if="scope.row.state==1" style="color:green;font-size:18px;">正常</span>
            </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import qs from "qs";
export default {
  name: "user.vue",
  data() {
    return {
      //用户详情
      tableData: [],//用户信息
      friendsTable: [],//好友列表
      groupTable: [],//群组列表
      formInline: {
        user: ""
      },//搜索字段
      obj: {
        pageNum: 1,
        pageSize: 1
      },//分页
      newdata: [],
      uid: "",
      gid: 1,
      dialogTableVisible: false, // 添加用户弹框
      groupMember:"",//群成员
    };
  },
  mounted() {
      this.$refs.formInline.focus();//光标事件
  },
  methods: {
    cellStyle ({ row, column, rowIndex, columnIndex }) {
          // 状态列字体颜色
          if (columnIndex === 1) {
            return 'color: #0CB618'
          } else if (columnIndex === 0) {
            return 'color: #4e72b8'
          } else {
            return 'color: #1a1a1b'
          }
        },
    //查看群成员
    seeNember(row){
        this.dialogTableVisible = true;
        this.groupMember = row.groupMembers;
        for(var i=0;i<row.groupMembers.length;i++){
          function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString();
          }
          this.groupMember[i].joinTime = getLocalTime(this.groupMember[i].joinTime);
        }
    },
    //搜索用户
    onSubmit() {
      var search = this.formInline.user;//搜索字段
      if (search == "") {
        this.$message.error("请输入用户账号或用户编号");
        this.tableData=[];//清空用户信息
        this.friendsTable=[];//清空好友信息
        this.groupTable=[];//清空群组信息
      } else{
        // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getUsers2NotFriend?key=" +search+"&token=" +localStorage.getItem("tokenlo"))
        // this.axios.post("http://test.viefong.com:8972/app/manage/v1/getUsers2NotFriend?key=" + +search+"&token=" +localStorage.getItem("tokenlo"))
        this.axios.post("http://viefong.com:8972/app/manage/v1/getUsers2NotFriend?key=" + +search+"&token=" +localStorage.getItem("tokenlo"))
          .then(res => {
            if(res.data.rescode == 100 && res.data.data !== null){
              function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString();
              }//转换时间格式
              res.data.data.lastLoginTime = getLocalTime(res.data.data.lastLoginTime);//时间展示
              if (this.newdata == []) {
                this.newdata.push(res.data.data);
              } else {
                this.newdata = [];
                this.newdata.push(res.data.data);
              }
              this.tableData = this.newdata;//查询用户的信息展示
              this.uid = res.data.data.uid;//查询用户的id
              //获取用户好友
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getUsers2Friend?userId=" +this.uid+"&token=" +localStorage.getItem("tokenlo"))
            // this.axios.post("http://test.viefong.com:8972/app/manage/v1/getUsers2Friend?userId=" +this.uid+"&token=" +localStorage.getItem("tokenlo"))
            this.axios.post("http://viefong.com:8972/app/manage/v1/getUsers2Friend?userId=" +this.uid+"&token=" +localStorage.getItem("tokenlo"))
              .then(res => {
                this.friendsTable = res.data.data;//好友列表
              });
            //获取用户所隶属的群聊
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getUserGroupList?userId=" +this.uid+"&token=" +localStorage.getItem("tokenlo"),qs.stringify({ gid: 1 }))
            // this.axios.post("http://test.viefong.com:8972/app/manage/v1/getUserGroupList?userId=" +this.uid+"&token=" +localStorage.getItem("tokenlo"),qs.stringify({ gid: 1 }))
            this.axios.post("http://viefong.com:8972/app/manage/v1/getUserGroupList?userId=" +this.uid+"&token=" +localStorage.getItem("tokenlo"),qs.stringify({ gid: 1 }))
              .then(res => {
                  this.groupTable = res.data.data;
                  for(var i=0;i<this.groupTable.length;i++){
                      this.groupTable[i].name = this.groupTable[i].name?this.groupTable[i].name:'暂未设置群名称';
                  }
              });
            }else{
              this.$message.error("未搜索到该用户");
              this.tableData=[];//清空用户信息
              this.friendsTable=[];//清空好友信息
              this.groupTable=[];//清空群组信息
            }
          });
      }
    },
    //封禁账号
    banClick(row) {
      var id = row.uid;
      this.$confirm('您确定要禁用此用户, 是否继续?', '提示', {
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
                  // this.axios.post("http://172.16.0.57:8972/app/manage/v1/setCloseUser?userId=" +id +"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                  // this.axios.post("http://test.viefong.com:8972/app/manage/v1/setCloseUser?userId=" +id +"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                  this.axios.post("http://viefong.com:8972/app/manage/v1/setCloseUser?userId=" +id +"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                      if(res.data.rescode==100){
                            this.$message({
                              message: "禁用成功",
                              type: "success"
                            });
                            this.onSubmit();//重新调用列表
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
    //解封账号
    ProhibitClick(row) {
      var id = row.uid;
       this.$confirm('您确定要解封此用户, 是否继续?', '提示', {
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
        // this.axios.post("http://172.16.0.57:8972/app/manage/v1/setCloseUser?userId=" +id +"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
        // this.axios.post("http://test.viefong.com:8972/app/manage/v1/setCloseUser?userId=" +id +"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
        this.axios.post("http://viefong.com:8972/app/manage/v1/setCloseUser?userId=" +id +"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
          .then(res => {
              if(res.data.rescode==100){
                  this.$message({
                    message: "解封成功",
                    type: "success"
                  });
                  this.onSubmit();//重新调用列表
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
    }
  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>
