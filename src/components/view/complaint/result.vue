<template>
    <div style="height:835px;">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="用户投诉处理" name="first">
        <el-table :data="getGroup" border style="width: 100%" :header-cell-style="{color: '#848484', fontSize: '14px'}"	:cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column fixed prop="userName" label="投诉用户" width="200px"></el-table-column>
        <el-table-column prop="toTargetName" label="被投诉用户" width="200px" style="color:red"></el-table-column>
        <el-table-column prop="createTime" label="投诉时间" width="180px"></el-table-column>
        <el-table-column prop="content" label="投诉内容"></el-table-column>
        <el-table-column label="投诉凭证">
          <template slot-scope="scope">
            <a :href="scope.row.userComplainImg.url" target="_blank">
              <img :src="scope.row.userComplainImg.url" width="70%" height="70%" class="img"/>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="userResult" label="反馈信息" width="200px"></el-table-column>
        <el-table-column prop="state" label="审核结果" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.state==1" style="color:green;font-size:20px;">通过</div>
            <div v-if="scope.row.state==2" style="color:red;font-size:20px;">驳回</div>
          </template>
        </el-table-column>
        </el-table>
        <el-pagination style="margin:20px auto;text-align:center;" @size-change="sizeChange" @current-change="pageChange" :current-page="this.obj.pageNum" background :page-size="this.obj.pageSize" layout="total, prev, pager, next" :total="this.total"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="群组投诉处理" name="second">
        <el-table :data="getGroups" border style="width: 100%" :header-cell-style="{color: '#848484', fontSize: '14px'}"	:cell-style="cellStyle" :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column fixed prop="userName" label="投诉用户" width="200px"></el-table-column>
        <el-table-column prop="toTargetName" label="被投诉的群组" width="200px" style="color:red"></el-table-column>
        <el-table-column prop="createTime" label="投诉时间" width="180px"></el-table-column>
        <el-table-column prop="content" label="投诉内容"></el-table-column>
        <el-table-column label="投诉凭证">
          <template slot-scope="scope">
            <a :href="scope.row.userComplainImg.url" target="_blank">
              <img :src="scope.row.userComplainImg.url" width="70%" height="70%" class="img"/>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="审核结果">
          <template slot-scope="scope">
            <div v-if="scope.row.state==1" style="color:green;font-size:20px;">通过（封锁此群）</div>
            <div v-if="scope.row.state==2" style="color:red;font-size:20px;">驳回（暂不成立）</div>
          </template>
        </el-table-column>
        </el-table>
        <el-pagination style="margin:20px auto;text-align:center;" @size-change="sizeChanges" @current-change="pageChanges" :current-page="this.objs.pageNum" background :page-size="this.objs.pageSize" layout="total, prev, pager, next" :total="this.totals"></el-pagination>
      </el-tab-pane>
    </el-tabs>
    </div>
</template>

<script>
export default {
    name: "result.vue",
    data(){
        return{
            activeName: 'first',
            //获取用户群组信息
            getGroup:[],
            total:0,
            obj: {
              pageNum: 1,
              pageSize: 10,
              complainUser: 5,
            },
            getGroups:[],
            totals:0,
            objs: {
              pageNum: 1,
              pageSize: 10,
              complainUser: 5,
            },
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
        // 选择页数
        pageChange(currentPage) {
          this.obj.pageNum = currentPage;
          this.getGroupComplainList();
        },
        // 选择行数
        sizeChange(row) {
          this.obj.pageSize = row;
          this.getUserComplainList();
        },
        //获取用户信息
        getUserComplainList(){
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getUserGroupComplainList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo")+"&toTargetType="+ 1 +"&state=" +1)
            this.axios.post("http://viefong.com:8972/app/manage/v1/getUserGroupComplainList?"+"&pageNum="+this.obj.pageNum +"&pageSize=" +this.obj.pageSize+"&token=" +localStorage.getItem("tokenlo")+"&toTargetType="+ 1 +"&state=" +1)
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
        pageChanges(currentPage) {
          this.obj.pageNum = currentPage;
          this.getGroupComplainList();
        },
        // 选择行数
        sizeChanges(row) {
          this.obj.pageSize = row;
          this.getUserComplainList();
        },
        //获取用户信息
        getGroupComplainList(){
            // this.axios.post("http://172.16.0.57:8972/app/manage/v1/getUserGroupComplainList?"+"&pageNum="+this.objs.pageNum +"&pageSize=" +this.objs.pageSize+"&token=" +localStorage.getItem("tokenlo")+"&toTargetType="+ 2 +"&state=" +1)
            this.axios.post("http://viefong.com:8972/app/manage/v1/getUserGroupComplainList?"+"&pageNum="+this.objs.pageNum +"&pageSize=" +this.objs.pageSize+"&token=" +localStorage.getItem("tokenlo")+"&toTargetType="+ 2 +"&state=" +1)
                .then(res => {
                    if(res.data.rescode==100){
                        this.totals = res.data.totalSize;
                        this.getGroups = res.data.data;
                        // console.log(this.getGroup)
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
