<!--图表查看-->
<template>
  <div style="height:835px">
    <div id="main" style="width:100%;height:350px;margin:20px;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList:[],
      addr:[],
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
      // console.log(jquery)
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.charts();
  },
  methods: {
    //显示当前24小时之内每个小时登录人数的图表
    charts() {
      var levels = []; // x数组
      var nums = []; // y数组
      var myChart = this.$echarts.init(document.getElementById("main"));
      this.axios
        .post(
          // "http://172.16.0.57:8972/app/manage/v1/getUsersPointMessage?token=" +localStorage.getItem("tokenlo")
          // "http://test.viefong.com:8972/app/manage/v1/getUsersPointMessage?token=" +localStorage.getItem("tokenlo")
          "http://viefong.com:8972/app/manage/v1/getUsersPointMessage?token=" +localStorage.getItem("tokenlo")
        )
        .then(result => {
          if (result != null && result.data.data.length > 0) {
            for (var i = 0; i < result.data.data.length; i++) {
              var userTimeSlot = result.data.data[i].userTimeSlot;
              // console.log(111 , result);
              // userTimeSlot = userTimeSlot.slice(3);
              levels.push(userTimeSlot);
              nums.push(result.data.data[i].userCount);
              var min;
              for (var x = 0; x < levels.length; x++) {
                for (var z = x; z < levels.length; z++) {
                  if (levels[x] > levels[z]) {
                    min = levels[z];
                    levels[z] = levels[x];
                    levels[x] = min;
                  }
                }
              }
            }
          }
          myChart.setOption({
            //载入数据
            title: {
              text: "在线人数" // 柱状图标题，位于柱状图左上角。
            },
            tooltip: {
              trigger: "axis"
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true }, // 辅助线标志
                magicType: { show: true, type: ["line", "bar"] } // 动态类型转换（折线柱形互转）
                // restore : {show: true},        // 还原
              }
            },
            calculable: true, // 启用拖拽，重新计算
            xAxis: {
              type: "category",
              data: levels //填入X轴数据
            },
            yAxis: {
              type: "value"
            },
            series: {
              name: "数量",
              type: "bar",
              data: nums //填入y轴数据
            }
          });
        });
    },
     }
};
</script>
<style scoped="less">
/* @import url(); 引入css类 */
</style>
