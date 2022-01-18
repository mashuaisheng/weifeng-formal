<template>
    <div style="height:835px;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="用户投诉办理" name="first">
                <el-table :data="getGroup" border style="width: 100%" :header-cell-style="{color: '#848484', fontSize: '14px'}"	:cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
                    <el-table-column fixed prop="userName" label="投诉用户" width="200px"></el-table-column>
                    <el-table-column prop="toTargetName" label="被投诉用户" width="200px"></el-table-column>
                    <el-table-column prop="createTime" label="投诉时间" width="180px"></el-table-column>
                    <el-table-column prop="content" label="投诉内容"></el-table-column>
                    <el-table-column label="投诉凭证">
                        <template slot-scope="scope">
                            <a :href="scope.row.userComplainImg.url" target="_blank">
                                <img :src="scope.row.userComplainImg.url" width="150px" height="100px" class="img"/>
                                <!--  :width="scope.row.userComplainImg.imgW" :height="scope.row.userComplainImg.imgH" -->
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button @click="handleClicke(scope.row)" type="success" round>审核</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="margin:20px auto;text-align:center;" @size-change="sizeChange" @current-change="pageChange" :current-page="this.obj.pageNum" background :page-size="this.obj.pageSize" layout="total, prev, pager, next" :total="this.total"></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="群组投诉办理" name="second">
                <el-table :data="this.getGroups" border style="width: 100%" :header-cell-style="{color: '#848484', fontSize: '14px'}"	:cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
                    <el-table-column fixed prop="userName" label="投诉用户" width="120"></el-table-column>
                    <el-table-column prop="toTargetName" label="被投诉的群组" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="投诉时间"></el-table-column>
                    <el-table-column prop="content" label="投诉内容"></el-table-column>
                    <el-table-column label="投诉凭证">
                        <template slot-scope="scope">
                            <a :href="scope.row.userComplainImg.url" target="_blank">
                                <img :src="scope.row.userComplainImg.url" width="150px" height="100px" class="img"/>
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="address" label="审核" width="200px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="banClick(scope.row)">封锁此群</el-button>
                            <el-button type="text" size="small" @click="ProhibitClick(scope.row)">暂不成立</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="margin:20px auto;text-align:center;" @size-change="sizeChanges" @current-change="pageChanges" :current-page="this.objs.pageNum" background :page-size="this.objs.pageSize" layout="total, prev, pager, next" :total="this.totals"></el-pagination>
            </el-tab-pane>
        </el-tabs>
        <!-- 添加用户弹框 -->
        <el-dialog title="审核用户" @close="addDialogClose" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
            <!-- 添加用户的表单 -->
            <el-form ref="addFormRef" :rules="rulesAddUser" :model="ruleForm" label-width="150px">
                <el-form-item prop="userName" label="投诉用户姓名">
                    <el-input v-model="details.userName" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item prop="toTargetName" label="被投诉用户姓名">
                    <el-input v-model="details.toTargetName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item prop="userResult" label="反馈信息">
                    <el-input v-model.trim="ruleForm.userResult" type="textarea" :rows="3" placeholder="请输入内容..."></el-input>
                </el-form-item>
                <el-form-item label="审核结果" prop="state">
                    <el-radio-group v-model="ruleForm.state">
                        <el-radio label="1">通过</el-radio>
                        <el-radio label="2">驳回</el-radio>
                    </el-radio-group>
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
    name: "complaint.vue",
    data(){
        return{
            ruleForm:{
                state: "2",
                userResult:"",
            },
            activeName: 'first',
            dialogTableVisible: false, // 添加用户弹框
            // 验证规则
            rulesAddUser: {
                userResult: [
                    { required: true, message: '请输入审核信息', trigger: 'blur' },
                    { min: 2, max: 100, message: '长度在 2 到 100个字符', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择开启或者关闭', trigger: 'change' }
                ],
            },
            //获取用户群组信息
            getGroup:[],
            total:0,
            obj: {
              pageNum: 1,
              pageSize: 10
            },
            //获取用户群组信息
            getGroups:[],
            totals:0,
            objs: {
              pageNum: 1,
              pageSize: 10
            },
            // 信息审核
            details:[],
        };
    },
    mounted(){
        //获取用户群组信息
        this.getUserComplainList();
        //获取用户群组信息
        this.getGroupComplainList();
    },
    methods:{
        handleClick(tab, event) {
        // console.log(tab, event);
        },
        cellStyle ({ row, column, rowIndex, columnIndex }) {
          // 状态列字体颜色
          if (columnIndex === 0) {
            return 'color: #0CB618'
          } else if (columnIndex === 1) {
            return 'color: #EA1B29'
          } else {
            return 'color: #1a1a1b'
          }
        },
        // 信息审核
        onAddUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return null  // 如果验证失败就不往下继续执行
                let model = this.$refs.addFormRef.model;
                // this.axios.post("http://172.16.0.57:8972/app/manage/v1/setUserAuditing?userId=" +this.details.userId+"&toTarget=" +this.details.toTarget+"&state=" +model.state+"&userResult=" +model.userResult+"&toTargetType="+1+"&token=" +localStorage.getItem("tokenlo"))
                this.axios.post("http://viefong.com:8972/app/manage/v1/setUserAuditing?userId=" +this.details.userId+"&toTarget=" +this.details.toTarget+"&state=" +model.state+"&userResult=" +model.userResult+"&toTargetType="+1+"&token=" +localStorage.getItem("tokenlo"))
                .then(res => {
                    if(res.data.rescode==100){
                        this.$message({
                            message: '发送成功',
                            type: 'success',
                        });
                        this.getUserComplainList();
                        this.dialogTableVisible = false  // 关闭弹框
                        this.$refs.addFormRef.resetFields() // 清空表单
                    }else{
                        this.$message.error('审核失败');
                    }
                });
            })
        },
        //获取用户信息
        getUserComplainList(){
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getUserGroupComplainList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo")+"&toTargetType="+ 1 +"&state=" +0)
            this.axios.post("http://viefong.com:8972/app/manage/v1/getUserGroupComplainList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo")+"&toTargetType="+ 1 +"&state=" +0)
                .then(res => {
                    if(res.data.rescode==100){
                        this.total = res.data.totalSize;
                        this.getGroup = res.data.data;
                        // console.log(this.getGroup)
                        for (var i = 0; i < this.getGroup.length; i++) {
                            function getLocalTime(nS) {
                                return new Date(parseInt(nS) * 1000).toLocaleString();
                            }
                            this.getGroup[i].createTime = getLocalTime(this.getGroup[i].createTime);
                            this.getGroup[i].userComplainImg = JSON.parse(this.getGroup[i].userComplainImg);
				        }
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
        },
        // 选择页数
		pageChange(currentPage) {
			this.obj.pageNum = currentPage;
			this.getUserComplainList();
		},
		// 选择行数
		sizeChange(rows) {
			this.obj.pageSize = rows;
			this.getUserComplainList();
		},

        //弹框
        handleClicke(row){
            this.details = row;
            this.dialogTableVisible = true;
        },
        // 关闭弹框的回调
        addDialogClose() {
            this.$refs.addFormRef.resetFields() // 清空表单
        },

        // 群组
        //获取投诉群组信息
        getGroupComplainList(){
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getUserGroupComplainList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo")+"&toTargetType="+ 2 +"&state=" +0)
            this.axios.post("http://viefong.com:8972/app/manage/v1/getUserGroupComplainList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo")+"&toTargetType="+ 2 +"&state=" +0)
                .then(res => {
                    if(res.data.rescode==100){
                        this.totals = res.data.totalSize;
                        this.getGroups = res.data.data;
                        for (var i = 0; i < this.getGroups.length; i++) {
                            function getLocalTime(nS) {
                                return new Date(parseInt(nS) * 1000).toLocaleString();
                            }
                            this.getGroups[i].createTime = getLocalTime(this.getGroups[i].createTime);
                            this.getGroups[i].userComplainImg = JSON.parse(this.getGroups[i].userComplainImg);
                            this.getGroups[i].toTargetName = this.getGroups[i].toTargetName?this.getGroups[i].toTargetName:'暂未设置群名称';
				        }
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
        },
        // 选择页数
		pageChanges(currentPage) {
			this.objs.pageNum = currentPage;
			this.getGroupComplainList();
		},
		// 选择行数
		sizeChanges(rows) {
			this.objs.pageSize = rows;
			this.getGroupComplainList();
		},
        //封锁此群
		banClick(row) {
			this.$confirm('您确定要封锁此群吗, 是否继续?', '提示', {
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
                // this.axios.post("http://172.16.0.57:8972/app/manage/v1/setUserAuditing?userId=" +row.userId+"&toTarget=" +row.toTarget+"&state=" +1+"&userResult=" +"封锁此群"+"&toTargetType="+2+"&token=" +localStorage.getItem("tokenlo"))
                this.axios.post("http://viefong.com:8972/app/manage/v1/setUserAuditing?userId=" +row.userId+"&toTarget=" +row.toTarget+"&state=" +1+"&userResult=" +"封锁此群"+"&toTargetType="+2+"&token=" +localStorage.getItem("tokenlo"))
				.then(res => {
					if(res.data.rescode==100){
						this.$message({
							type: 'success',
							message: '封锁成功!'
						});
                        this.getGroupComplainList();
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
		//暂不成立
		ProhibitClick(row){
			this.$confirm('您确定要暂不成立吗, 是否继续?', '提示', {
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
                // this.axios.post("http://172.16.0.57:8972/app/manage/v1/setUserAuditing?userId=" +row.userId+"&toTarget=" +row.toTarget+"&state=" +2+"&userResult=" +"未成立"+"&toTargetType="+2+"&token=" +localStorage.getItem("tokenlo"))
                this.axios.post("http://viefong.com:8972/app/manage/v1/setUserAuditing?userId=" +row.userId+"&toTarget=" +row.toTarget+"&state=" +2+"&userResult=" +"未成立"+"&toTargetType="+2+"&token=" +localStorage.getItem("tokenlo"))
				.then(res => {
					if(res.data.rescode==100){
						this.$message({
							type: 'success',
							message: '暂不成立成功!'
						});
                        this.getGroupComplainList();
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

<style scoped = "less">

</style>
<style>
    .el-table .cell{
        display: flex !important;
    }
</style>
