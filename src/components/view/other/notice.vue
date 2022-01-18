<template>
  <div style="height:835px">
    <div style="font-weight: bold;font-size: 30px;border-bottom: 1px solid gray;padding: 20px 10px;">
      公告信息通知
    </div>
    <div class="message-1">
      <div class="message-1-2">
        <el-form :model="ruleForm" :ruleForm="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="网站名称" prop="siteTitle">
            <el-select v-model="ruleForm.siteTitle" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站点状态" prop="siteStatus">
            <el-radio-group v-model="ruleForm.siteStatus">
              <el-radio label="开启">开启</el-radio>
              <el-radio label="关闭">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="消息提示" prop="messageContent">
            <el-input type="textarea" v-model="ruleForm.messageContent" placeholder="非常抱歉，站点正在维护，稍后恢复..."></el-input>
          </el-form-item>
          <el-form-item label="搜索用户" prop="search">
            <el-autocomplete class="inline-input search" v-model="ruleForm.search" :fetch-suggestions="querySearch" placeholder="请输入用户手机号" :trigger-on-focus="false" @select="handleSelect" @blur="querySearches" :maxlength="11"></el-autocomplete>
            <i v-if="searchList !== ''" style="margin-left:10px;">用户名称：{{ searchList }}</i>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "notice.vue",
  data() {
    return {
    searchList: '',//用户名称
    searchId:0,//用户ID
    restaurants:[],//查询
      options: [
        {
          value: "微鳳",
          label: "微鳳",
        },
      ],
      // 提交信息
      ruleForm: {
        siteTitle: "微鳳",
        type: [],
        siteStatus: "开启",
        messageContent: "",
        // 搜索内容
        search: "",
      },
      nameTipsArray:[],//用于存放下拉提醒框中数据的数组
      nameArray:[],//页面初始化时全部数据
      // 正则
      rules: {
        siteTitle: [
          { required: true, message: "请输入网站名称", trigger: "blur" },
        ],
        siteStatus: [
          { required: true, message: "请选择开启或者关闭", trigger: "change" },
        ],
        messageContent: [
          { required: true, message: "请填写必填项目", trigger: "blur" },
          {
            min: 6,
            max: 100,
            message: "长度在 6 到 100个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
      // 模糊查询接口
      querySearch(queryString, cb) {
        // this.axios.post("http://172.16.0.57:8978/app/common/v1/getUsersSearchByName?name=" +this.ruleForm.search)
        // this.axios.post("http://test.viefong.com:8978/app/common/v1/getUsersSearchByName?name=" +this.ruleForm.search)
        this.axios.post("http://viefong.com:8978/app/common/v1/getUsersSearchByName?name=" +this.ruleForm.search)
          .then((res) => {
            if (res.data.rescode == 100 && res.data.data !=null) {
              this.total = res.data.totalSize;
              this.restaurants = res.data.data;
              for (var i = 0; i < this.restaurants.length; i++) {
                this.restaurants[i].value = this.restaurants[i].nickName;
				      }
              var restaurants = this.restaurants;
              var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
              cb(results);
            } else {
              // this.$message.error(res.data.msg);
            }
          })
      },
      // 调用查询展示
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      // 点击查询展示数据之后触发
       handleSelect(item) {
        // console.log(item);
        this.searchId = item.uid;
        this.searchList = item.nickName;
      },
    // 搜索
    querySearches() {
      if(this.ruleForm.search.length==11 || this.ruleForm.search.length==6){
        // 如果搜索的长度等于11位则为手机号搜索 如果搜索的长度等于6位则为ID搜索
        // this.axios.post("http://172.16.0.57:8978/app/common/v1/getUsersSearch?phone=" + this.ruleForm.search)
        // this.axios.post("http://test.viefong.com:8978/app/common/v1/getUsersSearch?phone=" + this.ruleForm.search)
        this.axios.post("http://viefong.com:8978/app/common/v1/getUsersSearch?phone=" + this.ruleForm.search)
        .then((res) => {
          if (res.data.rescode == 100) {
            if (res.data.data != null) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
              this.searchList = res.data.data.nickName;
              this.searchId = res.data.data.uid;
            } else {
              this.searchList = '';
              this.searchId = null;
              // this.$message({
              //   message: "查询失败",
              //   type: "error",
              // });
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }else{
        //如果不符合以上条件则不执行任何操作
          this.searchList = '';
          this.searchId = null;
      }
    },
    // 发送消息
  submitForm(ruleForm) {
    this.$refs[ruleForm].validate((valid) => {
      if (valid) {
        let model = this.$refs[ruleForm].model;
        if(this.searchId==0){
        // this.axios.post("http://172.16.0.57:8972/app/manage/v1/sendAnnouncement?siteStatus=" +model.siteStatus +"&siteTitle=" +model.siteTitle+"&targetid="+this.searchId +"&messageContent=" +model.messageContent+"&token=" +localStorage.getItem("tokenlo"))
        // this.axios.post("http://test.viefong.com:8972/app/manage/v1/sendAnnouncement?siteStatus=" +model.siteStatus +"&siteTitle=" +model.siteTitle+"&targetid="+this.searchId +"&messageContent=" +model.messageContent+"&token=" +localStorage.getItem("tokenlo"))
        this.axios.post("http://viefong.com:8972/app/manage/v1/sendAnnouncement?siteStatus=" +model.siteStatus +"&siteTitle=" +model.siteTitle+"&targetid="+this.searchId +"&messageContent=" +model.messageContent+"&token=" +localStorage.getItem("tokenlo"))
          .then((res) => {
            if (res.data.rescode == 100) {
              this.$message({
                message: "群发发送成功",
                type: "success",
              });
              this.searchList = '';
              this.searchId = null;
              this.$refs.ruleForm.resetFields() // 清空表单
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }else{
          // this.axios.post("http://172.16.0.57:8972/app/manage/v1/sendAnnouncement?siteStatus=" +model.siteStatus +"&siteTitle=" +model.siteTitle+"&targetid=" +this.searchId+"&messageContent=" +model.messageContent+"&token=" +localStorage.getItem("tokenlo"))
        // this.axios.post("http://test.viefong.com:8972/app/manage/v1/sendAnnouncement?siteStatus=" +model.siteStatus +"&siteTitle=" +model.siteTitle+"&targetid=" +this.searchId+"&messageContent=" +model.messageContent+"&token=" +localStorage.getItem("tokenlo"))
        this.axios.post("http://viefong.com:8972/app/manage/v1/sendAnnouncement?siteStatus=" +model.siteStatus +"&siteTitle=" +model.siteTitle+"&targetid=" +this.searchId+"&messageContent=" +model.messageContent+"&token=" +localStorage.getItem("tokenlo"))
          .then((res) => {
            if (res.data.rescode == 100) {
              this.$message({
                message: "向"+this.searchList+ "用户发送成功",
                type: "success",
              });
              this.searchList = '';
              this.searchId = null;
              this.$refs.ruleForm.resetFields() // 清空表单
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      } else {
        return false;
      }
    });
  },
  },
};
</script>

<style scoped="less">
.message-1 {
  width: 100%;
  border: 1px solid rgb(128, 128, 128);
  margin-top: 20px;
}
.message-1-2 {
  width: 700px;
  margin: 30px auto;
}
.search-in{
  width: 200px;
}
</style>
