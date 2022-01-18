<template>
  <div style="height:835px">
    <div style="font-weight: bold;font-size: 30px;border-bottom: 1px solid gray;padding: 20px 10px;">
      挪车二维码
    </div>
    <div class="message-1">
      <div class="message-1-2">
        <el-form :model="ruleForm" :ruleForm="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="二维码数量" prop="number">
            <el-input-number v-model="ruleForm.number" @change="handleChange" :min="1" :max="100000" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" style="float: left; margin-left: -30px">创建二维码</el-button>
              <div class="dialogClassRight">
                <el-button type="success" @click="exportExcel">导出Excel</el-button>
              </div>
          </el-form-item>
        </el-form>
        <el-table id="out-table" :data="getSignList" border stripe style="width: 100%" v-if="getSignList!=''">
          <el-table-column prop="codeId">
            <template slot-scope="scope">
               {{link}}"codeId":"{{ scope.row.codeId }}"{{lint}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "qrcode.vue",
  data() {
    return {
      // 提交信息
      ruleForm: {
        // 搜索内容
        number: 1,
      },
      link:"http://app.viefong.com?p={",
      lint:"}",
      getSignList:[]
    }
  },
  methods: {
    handleChange(value) {
        console.log(value);
    },
    // 生成二维码
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let model = this.$refs[ruleForm].model;
          // this.axios.post("http://172.16.0.57:8972/app/manage/v1/writePermanentCode?&num="+model.number+"&token=" +localStorage.getItem("tokenlo"))
          // this.axios.post("http://test.viefong.com:8972/app/manage/v1/writePermanentCode?&num="+model.number+"&token=" +localStorage.getItem("tokenlo"))
          this.axios.post("http://viefong.com:8972/app/manage/v1/writePermanentCode?&num="+model.number+"&token=" +localStorage.getItem("tokenlo"))
            .then((res) => {
              if (res.data.rescode == 100) {
                this.$message({
                  message: "创建二维码成功",
                  type: "success",
                });
                this.getSignList=res.data.data;
                // this.$refs.ruleForm.resetFields() // 清空表单
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
      })
    },
    //点击按钮  导出excel表格：
    exportExcel() {
      let tables = document.getElementById("out-table");
      let table_book = this.$XLSX.utils.table_to_book(tables);
      // console.log("excel" , table_book);
      var table_write = this.$XLSX.write(table_book, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        this.$FileSaver.saveAs(
          new Blob([table_write], { type: "application/octet-stream" }),
          // "sheetjs.xlsx"
          "挪车二维码.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, table_write);
      }
      return table_write;
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
.dialogClassRight {
  display: inline-block;
  margin-left: 30px;
  /* text-align: right; */
}
</style>
