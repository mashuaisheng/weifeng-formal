<template>
    <div style="height:835px;">
        <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="">
            <el-input v-model="search" ref="search" placeholder="请输入申诉手机号" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="userAppealList" border style="width: 100%" @submit.native.prevent :header-cell-style="{color: '#848484', fontSize: '14px'}" :cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
            <!-- <el-table-column fixed prop="userId" label="用户编号"></el-table-column> -->
            <el-table-column prop="appealPhone" label="申诉手机号"></el-table-column>
            <el-table-column prop="appealReason" label="申诉原因"></el-table-column>
            <el-table-column prop="appealContent" label="申诉内容"></el-table-column>
            <el-table-column prop="state" label="申诉状态">
                <template slot-scope="scope">
                    <div v-if="scope.row.state==1" style="color:green;font-size:20px;">已审核</div>
                    <div v-else style="color:red;font-size:20px;">待审核</div>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="申诉时间"></el-table-column>
            <el-table-column prop="address" label="审核">
            <template slot-scope="scope">
                <div v-if="scope.row.state==0">
                    <el-button @click="banClick(scope.row)" type="text" size="small">解封</el-button>
                    <el-button type="text" size="small" @click="ProhibitClick(scope.row)">驳回</el-button>
                </div>
                <div v-else>
                    <el-button @click="banClick(scope.row)" type="text" size="small" disabled>解封</el-button>
                    <el-button type="text" size="small" @click="ProhibitClick(scope.row)" disabled>驳回</el-button>
                </div>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin:20px auto;text-align:center;"	@size-change="sizeChange" @current-change="pageChange" :current-page="this.obj.pageNum" background :page-size="this.obj.pageSize" layout="total, prev, pager, next" :total="this.total"></el-pagination>
    </div>
</template>

<script>
    export default {
        name: "appeal.vue",
        data(){
            return{
                //用户账户申诉列表
                userAppealList:[],
                search:'',//搜索字段
                total:0,
                obj: {
                    pageNum: 1,
                    pageSize: 10
                },
            };
        },
        mounted(){
            this.$refs.search.focus();//光标事件
            //用户账户申诉列表
            // this.userAppealListList();
            // 审核申诉信息
            // this.setUserAppeal();
        },
        methods:{
            cellStyle ({ row, column, rowIndex, columnIndex }) {
            // 状态列字体颜色
            if (columnIndex === 0) {
                return 'color: #4e72b8'
            } else if (columnIndex === 1) {
                return 'color: #ef4136'
            } else if (columnIndex === 2) {
                return 'color: #0CB618'
            } else if (columnIndex === 4) {
                return 'color: #f58220'
            } else {
                return 'color: #1a1a1b'
            }
            },
            //用户账户申诉列表
            userAppealListList() {
                // this.axios.post("http://172.16.0.57:8972/app/manage/v1/userAppealList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                // this.axios.post("http://test.viefong.com:8972/app/manage/v1/userAppealList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                this.axios.post("http://viefong.com:8972/app/manage/v1/userAppealList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                        if(res.data.rescode==100 && res.data.data !== null){
                            this.total = res.data.totalSize;
                            this.userAppealList = res.data.data;
                            for (var i = 0; i < this.userAppealList.length; i++) {
                                // this.userAppealList[i].state = this.userAppealList[i].state===1?'已审核':"待审核";
                                function getLocalTime(nS) {
                                    return new Date(parseInt(nS) * 1000).toLocaleString();
                                }
                                this.userAppealList[i].createTime = getLocalTime(this.userAppealList[i].createTime);
                            }
                        }else{
                            this.$message({
                                message: "未搜索到",
                                type: 'error'
                            });
                        }
                    });
            },
            //搜索申诉用户
            onSearch() {
                var search = this.search;
                if (search == "") {
                    this.$message.error("请输入申诉用户手机号");
                    this.userAppealList=[];//清空数组
                } else{
                    // this.axios.post("http://172.16.0.57:8972/app/manage/v1/searchAppealList?appealPhone=" +search+"&token=" +localStorage.getItem("tokenlo"))
                    // this.axios.post("http://test.viefong.com:8972/app/manage/v1/searchAppealList?appealPhone=" +search+"&token=" +localStorage.getItem("tokenlo"))
                    this.axios.post("http://viefong.com:8972/app/manage/v1/searchAppealList?appealPhone=" +search+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                         if(res.data.rescode==100 && res.data.totalSize !== 0){
                            this.total = res.data.totalSize;
                            this.userAppealList = res.data.data;
                            for (var i = 0; i < this.userAppealList.length; i++) {
                                function getLocalTime(nS) {
                                    return new Date(parseInt(nS) * 1000).toLocaleString();
                                }
                                this.userAppealList[i].createTime = getLocalTime(this.userAppealList[i].createTime);
                            }
                            this.$message({
                                type: 'success',
                                message: '搜索成功!'
						    });
                        }else{
                            this.$message({
                                message: "未搜索到该用户进行申诉",
                                type: 'error'
                            });
                            this.userAppealList=[];//清空数组
                        }
                    })
                }
            },
            // 选择页数
            pageChange(currentPage) {
                this.obj.pageNum = currentPage;
                this.userAppealListList();
            },
            // 选择行数
            sizeChange(rows) {
                this.obj.pageSize = rows;
                this.userAppealListList();
            },
            //确认申诉
            banClick(row) {
                // console.log(11 , row);
                this.$confirm('您确定要解封此用户吗？是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
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
                }).then(() => {
                    // this.axios.post("http://172.16.0.57:8972/app/manage/v1/setUserAppeal?userId=" +row.userId +"&userAppealId=" +row.id +"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
                    // this.axios.post("http://test.viefong.com:8972/app/manage/v1/setUserAppeal?userId=" +row.userId +"&userAppealId=" +row.id +"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
                    this.axios.post("http://viefong.com:8972/app/manage/v1/setUserAppeal?userId=" +row.userId +"&userAppealId=" +row.id +"&state=" +1+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                        if(res.data.rescode==100){
                            this.$message({
                                type: 'success',
                                message: '解封成功!'
                            });
                            this.userAppealListList();
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
            //驳回申诉
            ProhibitClick(row) {
               this.$confirm('您确定要驳回用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
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
                }).then(() => {
                    // this.axios.post("http://172.16.0.57:8972/app/manage/v1/setUserAppeal?userId=" +row.userId +"&userAppealId=" +row.id+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                    // this.axios.post("http://test.viefong.com:8972/app/manage/v1/setUserAppeal?userId=" +row.userId +"&userAppealId=" +row.id+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                    this.axios.post("http://viefong.com:8972/app/manage/v1/setUserAppeal?userId=" +row.userId +"&userAppealId=" +row.id+"&state=" +0+"&token=" +localStorage.getItem("tokenlo"))
                    .then(res => {
                        if(res.data.rescode==100){
                           this.$message({
                                type: 'success',
                                message: '驳回成功!'
                            });
                            this.userAppealListList();
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
        } ,
    }
</script>

<style scoped="less">

</style>
