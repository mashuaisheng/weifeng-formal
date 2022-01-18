<!--  -->
<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column fixed prop="gid" label="群聊ID"></el-table-column>
      <el-table-column prop="name" label="群聊名称"></el-table-column>
      <el-table-column prop="createTime" label="创建日期"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="banClick(scope.row)" type="text" size="small">禁用</el-button>
          <el-button type="text" size="small"  @click="ProhibitClick(scope.row)">解封</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ul class="paging">
        <li><el-button type="text" @click="upJump">上一页</el-button></li>
        <li><input type="text" :value="obj.pageSize">条</li>
        <li><el-button type="text" @click="downJump">下一页</el-button></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      obj: {
        pageNum: 0,
        pageSize: 10
      }
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    //获取群聊列表
   this.getGroup()
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    getGroup(){
       this.axios.post("http://call.newmine.net:8978/app/common//v1/getGroupHot?pageNum=" + this.obj.pageNum + "&pageSize=" + this.obj.pageSize)
      .then(res => {
        var dataGroup=res.data.data
        for(var i=0;i<dataGroup.length;i++){
          if(dataGroup[i].name=="")
          dataGroup[i].name="该群聊暂未设置名称"
          function getLocalTime(nS) {
              return new Date(parseInt(nS) * 1000).toLocaleString();
          }
          dataGroup[i].createTime = getLocalTime(dataGroup[i].createTime);
        }
        this.tableData = dataGroup;
      });
    },
    handleClick(row) {
      console.log(row);
    },
    //上一页
    upJump(){
        if(this.obj.pageNum<=0){
            this.obj.pageNum=0
            this.$message({
              showClose: true,
              message: '已经是第一页了'
            });
        }else{
          this.obj.pageNum--
          this.getGroup()
        }
    },
    //下一页
    downJump(){
      this.obj.pageNum++
      this.getGroup()
    },
    //禁用
    banClick(row){
      console.log(row.gid)
      this.axios.post('http://call.newmine.net:8978/app/common//v1/setCloseUser?userId='+row.userId+'&state='+0).then((res)=>{
        this.$message({
          showClose: true,
          message: '封禁成功',
          type: 'success'
        });
      })
    },
    //解封
    ProhibitClick(row){
      console.log(row.gid)
      this.axios.post('http://call.newmine.net:8978/app/common//v1/setCloseUser?userId='+row.userId+'&state='+1).then((res)=>{
        this.$message({
          showClose: true,
          message: '解封成功',
          type: 'success'
        });
      })
    }
  }
};
</script>
<style scoped>
.paging{
  display: flex;
  width: 40%;
}
.paging li input{
  width: 20%;
  border: none;
  outline: none;
}
.paging li{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>