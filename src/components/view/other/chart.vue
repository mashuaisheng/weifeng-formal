<!--图表查看-->
<template>
  <div style="height:835px">
     <div id="myChartChina" :style="{ width: '100%', height: '500px', margin:'0 auto'}"></div>
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
    //各个省份使用人数
    this.getmapsone();
  },
  methods: {
    getmapsone(){
      // this.axios.post('http://172.16.0.57:8972/app/manage/v1/getUsersIPMessage?token=' +localStorage.getItem("tokenlo")).then((res)=>{
        this.axios.post('http://viefong.com:8972/app/manage/v1/getUsersIPMessage?token=' +localStorage.getItem("tokenlo")).then((res)=>{
        if(res.data.rescode==100){
          this.dataList= res.data.data;
          this.drawLine();
        }
      })
    },

    //各个省份使用人数
    drawLine(){
        let that=this
        // 基于准备好的dom，初始化echarts实例
        var myChartContainer = document.getElementById('myChartChina');
        var resizeMyChartContainer = function(){
          // myChartContainer.style.width=(document.body.offsetWidth/2)+'px'//页面一半的大小
        }
        resizeMyChartContainer();
        var myChartChina = this.$echarts.init(myChartContainer);
        // 绘制图表
        var optionMap = {
          tooltip: {},
          legend: {
            orient: 'vertical',
            left: 'left',
            data:['']
          },
          visualMap: {
            min: 0,
            max: 1500,
            left: '10%',
            top: 'bottom',
            text: ['高','低'],
            calculable : true,
            color:['#0b50b9','#c3e2f4'],
          },
          selectedMode: 'single',
          series : [
            {
              name: '微鳯用户',
              type: 'map',
              mapType: 'china',
              zoom:1.2,
              itemStyle: {
              normal:{
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis:{
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          showLegendSymbol: false,//去除地图上的指示点
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
            data:that.dataList
          }
        ]
      }
        myChartChina.setOption(optionMap);
        window.onresize=function(){
          resizeMyChartContainer();
          myChartChina.resize();
        }
    },

    }
};
</script>
<style scoped="less">
/* @import url(); 引入css类 */
</style>
