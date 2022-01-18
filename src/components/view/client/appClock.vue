<template>
    <div class="appClass">
        <div class="appClassAccount">
              {{ nowDate  + '  ' + nowWeek }}
        </div>
        <div>
            <section class="weather">
                <ul class="weatherUl">
                    <li class="weatherUlLi"  v-if="setWeater=='OK'">
                        <h1 style="color:gray;font-size:18px">{{setCity}}</h1>
                        <p>
                            <span style="color:#DAA520;font-size:14px;">{{forecast.type}}</span>
                            <span class="span0" style="font-size:13px;margin-left:5px;">当前温度 : {{wendu}}℃</span>
                        </p>
                        <div style="display:block;">
                            <span class="span1" style="font-size:13px">{{forecast.low}}</span>
                            ~
                            <span style="font-size:13px" class="span2">{{forecast.high}}</span>
                        </div>
                    </li>
                    <p v-else class="el-icon-loading" style="font-size: 30px;margin:30px;"></p>
                </ul>
                <div class="weatherDeial" v-on:click="getDetial"><div>考勤</div><div>详情</div></div>
            </section>
        </div>
        <div class="appClassPunch" v-if="getNowTime.signTime!==null && (this.nowDate+' '+this.nowTime)<this.nowDate+ ' 08:00:00' && getNowTime.signOffTime==null">
            <div class="onClack">
                <div  v-if="androidGo=='undefined;undefined'">
                    <el-button type="success" disabled round class="onClackAddrButton">
                       <span style="font-size: 30px"  class="el-icon-loading"></span><span style="font-size: 20px;">正在加载</span><br/><br/>
                    </el-button>
                </div>
                <div v-else-if="inOutTime.signOffTime==null">
                    <div v-if="userSignStatus==false">
                        <el-button type="success" v-on:click="clockOut" round class="onClackAddrButton"  v-if="positionNum<=setPositionNum">
                            <span style="font-size: 30px;">下班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="success" v-else-if="positionNum>setPositionNum" round class="onClackAddrButton" disabled>
                            <span style="font-size: 20px;"> 不在考勤范围</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="success" v-on:click="clockOut" v-else round class="onClackAddrButton">
                            <span style="font-size: 20px;">下班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button type="success" v-on:click="clockOut" round class="onClackAddrButton"  v-if="positionNum<=setPositionNum">
                            <span style="font-size: 30px;">下班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="success" v-else-if="positionNum>setPositionNum" v-on:click="clockOut" round class="onClackAddrButton" >
                            <span style="font-size: 30px;">外勤打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                    </div>
                </div>
                <div v-else-if="inOutTime.signOffTime!==null">
                    <el-button type="success" disabled round class="onClackAddrButton">
                        <span style="font-size: 30px;">下班已打卡</span><br/><br/>{{inOutTime.signOffTime}}
                    </el-button>
                </div>
            </div>
        </div>
          <div class="appClassPunch" v-else-if="inOutTime.signTime==null">
            <div class="onClack">
                <div v-if="androidGo=='undefined;undefined'">
                    <el-button type="primary" disabled round class="onClackAddrButton">
                        <span style="font-size: 30px" class="el-icon-loading"></span><span style="font-size: 20px;">正在加载</span><br/><br/>
                    </el-button>
                </div>
                <div v-else-if="inOutTime.signTime==null">
                    <div v-if="userSignStatus==false">
                        <el-button type="primary" v-on:click="clockIn" round class="onClackAddrButton" v-if="positionNum<=setPositionNum">
                            <span style="font-size: 30px;"> 上班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="primary"  v-else-if="positionNum>setPositionNum" round class="onClackAddrButton" disabled>
                            <span style="font-size: 20px;"> 不在考勤范围</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="primary"  v-on:click="clockIn" v-else round class="onClackAddrButton">
                            <span style="font-size: 20px;"> 上班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button type="primary" v-on:click="clockIn" round class="onClackAddrButton" v-if="positionNum<=setPositionNum">
                            <span style="font-size: 30px;"> 上班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="primary" v-on:click="clockIn" round class="onClackAddrButton" v-if="positionNum>setPositionNum">
                            <span style="font-size: 30px;"> 外勤打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                    </div>
                </div>
                <div v-else-if="inOutTime.signTime!==null">
                    <el-button type="primary" disabled  round class="onClackAddrButton">
                        <span style="font-size: 30px;">上班已打卡</span><br/><br/>{{inOutTime.signTime}}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="appClassPunch" v-else>
            <div class="onClack">
                <div v-if="androidGo=='undefined;undefined'">
                    <el-button type="success" disabled round class="onClackAddrButton">
                       <span style="font-size: 30px"  class="el-icon-loading"></span><span style="font-size: 20px;">正在加载</span><br/><br/>
                    </el-button>
                </div>
                <div v-else-if="inOutTime.signOffTime==null">
                    <div  v-if="userSignStatus==false">
                        <el-button type="success" v-on:click="clockOut" round class="onClackAddrButton"  v-if="positionNum<=setPositionNum">
                            <span style="font-size: 30px;">下班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="success"  v-else-if="positionNum>setPositionNum" round class="onClackAddrButton" disabled>
                            <span style="font-size: 20px;"> 不在考勤范围</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="success" v-on:click="clockOut" v-else round class="onClackAddrButton">
                            <span style="font-size: 20px;">下班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button type="success" v-on:click="clockOut" round class="onClackAddrButton"  v-if="positionNum<=setPositionNum">
                            <span style="font-size: 30px;">下班打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                        <el-button type="success" v-on:click="clockOut" round class="onClackAddrButton" v-else-if="positionNum>setPositionNum">
                            <span style="font-size: 30px;">外勤打卡</span><br/><br/>{{nowTime}}
                        </el-button>
                    </div>
                </div>
                <div v-else-if="inOutTime.signOffTime!==null">
                    <el-button type="success" disabled round class="onClackAddrButton">
                        <span style="font-size: 30px;">下班已打卡</span><br/><br/>{{inOutTime.signOffTime}}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="addrs" v-if="addrs.length!=0">
            地址：
            <!-- <span v-if="positionNum>setPositionNum">{{addrs}}</span> -->
            <!-- <span v-else-if="userSignName!=null">{{userSignName}}</span> -->
            <span>{{addrs}}</span>
        </div>
        <div v-else  class="addrs">
            <i class="el-icon-loading" style="font-size:20px;margin:10px;"></i>
        </div>
        <!-- 添加用户弹框 -->
        <el-dialog title="考勤详细" width="100%" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
            <!-- 查询用户的打卡信息 -->
            <el-table border stripe style="width: 100%;" :data="getDetialList">
            <el-table-column label="上班时间">
                <template slot-scope="scope"> 
                    <el-popover title="详细" trigger="hover" placement="top" width="200">
                        <p>{{ scope.row.signTime }}</p>
                        <div slot="reference" >
                            <p style="width:70px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">{{ scope.row.signTime}}</p>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="上班地址">
                <template slot-scope="scope"> 
                    <el-popover title="详细" trigger="hover" placement="top" width="200">
                        <p>{{ scope.row.signPosition }}</p>
                        <div slot="reference">
                            <p size="medium" style="width:70px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">{{ scope.row.signPosition}}</p>
                        </div>
                    </el-popover> 
                </template>
            </el-table-column>
            <el-table-column prop="signOffTime" label="下班时间">
                <template slot-scope="scope"> 
                    <el-popover title="详细" trigger="hover" placement="top" width="200">
                        <p>{{ scope.row.signOffTime }}</p>
                        <div slot="reference">
                            <p size="medium" style="width:70px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">{{ scope.row.signOffTime}}</p>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="signOffPosition" label="下班地址">
                <template slot-scope="scope"> 
                    <el-popover title="详细" trigger="hover" placement="top" width="200">
                        <p>{{ scope.row.signOffPosition }}</p>
                        <div slot="reference">
                            <p size="medium" style="width:70px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">{{ scope.row.signOffPosition}}</p>
                        </div>
                    </el-popover> 
                </template>
            </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            nowDate: "",    // 当前日期
            nowTime: "",    // 当前时间
            nowDateLata:"",
            getNowTime:"",
            nowWeek: "",     // 当前星期
            qs:"",
            token:"",
            userId:"",
            groupId:"",
            inOutTime:"",
            inTime:"",
            androidGo:null,
            userSignName:"",
            dataT:"",
            ac :'',
            groupTime:"",
            positionNum :"", //限制打卡范围
            setPositionNum :0.3, //设置打卡范围
            city: '',//城市天气
            forecast: "",
            getPositionList:"",
            setWeater:"",
            setCity:"",
            gaodeAddressLiss:"",
            gaodeAddressLisses:"",
            currentAddress:"",
            getOutP:"",
            userSignStatus:"",
            addrs:"",
            wendu:"",//当前温度
            dialogTableVisible: false, // 添加用户弹框
            timer:null,
            getDetialList:null
        };
    },
    mounted() {
        this.QueryString();
        this.currentTime();
        this.getUserSignDayList();
        window.Location = this.Location;
        this.Location();//调用手机APP
        this.getPosition();//获取打卡经纬度
        this.gaodeAddress();//调用高德,经纬度转换 具体地址 
        this.tianqiApi();//调用天气api
        this.setTimeThis();
        // this.dataRefreh();//定时刷新
        // 定时刷新数据函数
        // this.timer = setInterval(() =>{
        //     setTimeout(this.Location, 0)
        // },1000*60)
    },
    // 销毁定时器
    beforeDestroy: function() {
        if (this.getDate) {
          clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
        }
    },
    // beforeDestroy(){
    //     // 在页面销毁后，清除计时器
    //     // this.clear();
    //     clearInterval(this.timer);
    //     this.timer = null;
    // },
    methods:{
        // dataRefreh() {
        //     // 计时器正在进行中，退出函数
        //     if (this.intervalId != null) {
        //         return;
        //     }
        //     // // 计时器为空，操作
        //     // this.intervalId = setInterval(() => {
        //     //     // console.log("刷新" + new Date());
        //     //     this.Location(latitude , longitude); //加载数据函数
        //     // }, 1000* 10);
        // }, 
        //查看群用户自己的打卡详情
        getDetial(){
            this.dialogTableVisible = true;
            // this.axios.post("http://172.16.0.57:8976/app/sign/v1/getUserSign?userId=" +this.userId +"&groupId="+this.groupId +"&token=" + this.token)
            // this.axios.post("http://test.viefong.com:8976/app/sign/v1/getUserSign?userId=" +this.userId +"&groupId="+this.groupId +"&token=" + this.token)
            this.axios.post("http://viefong.com:8976/app/sign/v1/getUserSign?userId=" +this.userId +"&groupId="+this.groupId +"&token=" + this.token)
              .then(res => {
                if(res.data.rescode==100){
                    this.getDetialList = res.data.data;
                }else{
                    this.$message.error(res.data.msg);
                }
              }).catch(e=>e);
        },
        // 调用高德,经纬度转换 具体地址  
        gaodeAddress(){
            let tianqi = this.gaodeAddressLiss;
            let address = tianqi[1]+","+tianqi[0];
            this.axios.get(`http://restapi.amap.com/v3/geocode/regeo?key=e4f125cb287f912d447b07d1445e06df&location=${address}`)
            .then((res) => {
                this.currentAddress = res.data.regeocode.addressComponent;
                this.addrs = res.data.regeocode.formatted_address;
                if(this.currentAddress.city.length == 0){
                    this.currentAddress = res.data.regeocode.addressComponent.province;
                }else{
                    this.currentAddress = this.currentAddress.city;
                }
                this.tianqiApi();
            }).catch((err) => {
                console.log(err);
            })
        },
        //调用天气api
        tianqiApi(){
            //天气查询  //天气搜索
            this.axios.get(`http://wthrcdn.etouch.cn/weather_mini?city=${this.currentAddress}`)
            .then((res) => {
                this.forecast = res.data.data.forecast[0];
                this.setWeater = res.data.desc;
                this.setCity = res.data.data.city;
                this.wendu = res.data.data.wendu;
            }).catch((err) => {
                console.log(err);
            })
        },
        // 获取打卡经纬度
        getPosition(){
            this.qs = this.QueryString();
            this.userId = this.qs['userId'];
            this.groupId = this.qs['groupId'];
            this.token = this.qs['token'];
            // this.axios.post("http://172.16.0.57:8976/app/sign/v1/getUserClockPosition?userId=" +this.userId + "&groupId="+this.groupId + "&token=" + this.token)
            // this.axios.post("http://test.viefong.com:8976/app/sign/v1/getUserClockPosition?userId=" +this.userId +"&groupId="+this.groupId +"&token=" + this.token)
            this.axios.post("http://viefong.com:8976/app/sign/v1/getUserClockPosition?userId=" +this.userId +"&groupId="+this.groupId +"&token=" + this.token)
            .then(res => {
                if(res.data.rescode==100){
                    // console.log(res.data.data)
                    this.userSignName = res.data.data.userSignName;
                    this.getPositionList = res.data.data.userClockLotAndLat;
                    // console.log('数据为空'+this.getPositionList)
                    if(this.getPositionList!=="notSet" && this.getPositionList!==''){
                        let latLng1 = this.gaodeAddressLiss;
                        let latLng2 = this.getPositionList.split(",");
                        let lat1 =  latLng1[0];
                        let lng1 =  latLng1[1];
                        let lat2 =  latLng2[1];
                        let lng2 =  latLng2[0];
                        let radLat1 = lat1*Math.PI / 180.0;
                        let radLat2 = lat2*Math.PI / 180.0;
                        let a = radLat1 - radLat2;
                        let b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
                        this.positionNum = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
                        this.positionNum = this.positionNum *6378.137 ;// EARTH_RADIUS;
                        this.positionNum = Math.round(this.positionNum * 10000) / 10000;
                        // console.log("成功")
                    }else{
                        this.positionNum = NaN
                        this.getPositionList=this.gaodeAddressLisses
                        // console.log("获取位置失败")
                    }
                }else{
                    this.$message.error(res.data.msg);
                }
            });
        },
        //调用手机APP 安卓
        Location(latitude , longitude){
            // latitude 经度 longitude 纬度
            let arrYX = latitude + ";" + longitude;
            // let arrYX = 40.046333+";"+ 116.304209;   //纽曼地址      116.118477,40.079386
            // console.log(arrYX)
            this.androidGo = arrYX;
            this.gaodeAddressLiss = arrYX.split(";");
            this.gaodeAddressLisses = arrYX;//如果没有打卡地址则使用
            this.gaodeAddress();
            this.getPosition();
        },
        //网址截取传参
        QueryString() {
          var name, value, i;
          var str = decodeURI(location.href);
          var num = str.indexOf("?")
          str = str.substr(num + 1);
          var arrtmp = str.split("&");
          for(i = 0; i < arrtmp.length; i++) {
            num = arrtmp[i].indexOf("=");
            if(num > 0) {
              name = arrtmp[i].substring(0, num);
              value = arrtmp[i].substr(num + 1);
              this[name] = value;
            }
          }
          return this;
        },
        // 点击下班打卡
        clockOut(){
            this.getDate();
            if((this.nowDate+' '+this.nowTime)<this.nowDate+ ' 08:00:00'){
                let yy = new Date().getFullYear();
                let mm = new Date().getMonth() + 1 < 10 ? "0"+(new Date().getMonth() + 1 ): new Date().getMonth() + 1;
                // let sdtime3=new Date().getDate()-1;  //7天
                let sdtime3= new Date().getDate()-1 < 10 ? "0"+(new Date().getDate() - 1 ): new Date().getDate()-1;  //7天
                this.ac =  yy + "-" + mm +'-'+sdtime3;
                this.getUserSignDayList(this.ac);
            }
            this.qs = this.QueryString();
            this.userId = this.qs['userId'];
            this.groupId = this.qs['groupId'];
            this.token = this.qs['token'];
            // let signPosition = this.getPositionList.split(',').reverse().join(';')
            if(this.userSignStatus==false){
                this.signPosition = this.getPositionList.split(',').reverse().join(';')
            }else{
                this.signPosition = this.gaodeAddressLisses
            }
            // this.axios.post("http://172.16.0.57:8976/app/sign/v1/setUserSigOff?userId=" +this.userId +"&groupId="+this.groupId + "&signPosition="+this.signPosition + "&token=" + this.token)
            // this.axios.post("http://test.viefong.com:8976/app/sign/v1/setUserSigOff?userId=" +this.userId +"&groupId="+this.groupId + "&signPosition="+this.signPosition + "&token=" + this.token)
            this.axios.post("http://viefong.com:8976/app/sign/v1/setUserSigOff?userId=" +this.userId +"&groupId="+this.groupId + "&signPosition="+this.signPosition + "&token=" + this.token)
             .then(res => {
                if(res.data.rescode===100){
                    this.$message({
                        message: '签退成功',
                        type: 'success',
                    });
                    this.getUserSignDayList(this.ac);
                    try {
                        window.webkit.messageHandlers.clockSuccess.postMessage(null);
                    } catch (error) { 
                    }
                    try {
                        android.clockSuccess();
                    } catch (error) {
                    }
                  clearTimeout(this.timer);  //清除延迟执行
                  this.timer = setTimeout(()=>{   //设置延迟执行
                      //调用android和IOS点击打完卡回到聊天页面
                      try {
                          window.webkit.messageHandlers.finishActivity.postMessage(null);
                      } catch (error) {
                      }
                      try {
                          android.finishActivity();
                      } catch (error) {
                      } 
                  },1000);
                }else{
                  this.$message.error(res.data.msg);
                  console.log(res.data.msg) 
                }
              });
        },
        //点击上班打卡
        clockIn(){
            this.qs = this.QueryString();
            this.userId = this.qs['userId'];
            this.groupId = this.qs['groupId'];
            this.token = this.qs['token'];
            if(this.userSignStatus==false){
                this.signPosition = this.getPositionList.split(',').reverse().join(';')
            }else{
                this.signPosition = this.gaodeAddressLisses
            }
            // this.axios.post("http://172.16.0.57:8976/app/sign/v1/setUserSig?userId=" +this.userId + "&groupId="+this.groupId + "&signPosition=" + this.signPosition + "&token=" + this.token)
            // this.axios.post("http://test.viefong.com:8976/app/sign/v1/setUserSig?userId=" +this.userId +"&groupId="+this.groupId + "&signPosition="+this.signPosition + "&token=" + this.token)
            this.axios.post("http://viefong.com:8976/app/sign/v1/setUserSig?userId=" +this.userId +"&groupId="+this.groupId + "&signPosition="+this.signPosition + "&token=" + this.token)
              .then(res => {
                if(res.data.rescode==100){
                  this.$message({
                    message: '签到成功',
                    type: 'success',
                  });
                  try {
                      window.webkit.messageHandlers.clockSuccess.postMessage(null);
                  } catch (error) {
                  }
                  try {
                      android.clockSuccess();
                  } catch (error) {
                  } 
                  clearTimeout(this.timer);  //清除延迟执行
                  this.timer = setTimeout(()=>{   //设置延迟执行
                      this.getUserSignDayList();
                  },2000);
                  this.timer = setTimeout(()=>{   //设置延迟执行
                      try {
                          window.webkit.messageHandlers.finishActivity.postMessage(null);
                      } catch (error) {
                      }
                      try {
                          android.finishActivity();
                      } catch (error) {
                      }   
                  },1000);
                }else{
                  this.$message.error(res.data.msg);
                }
              });
        },
        //查询签到时间
        getUserSignDayList(ac){
            this.getDate();
            this.qs = this.QueryString();
            this.userId = this.qs['userId'];
            this.groupId = this.qs['groupId'];
            this.token = this.qs['token'];
            this.dataT = this.qs['dateTime'];
            //ac是第二天8点打卡之前的时间
            if(ac){
                this.nowDate = ac;
            }else{
                this.nowDate;
            }
            // this.axios.post("http://172.16.0.57:8976/app/sign/v1/getUserSignDay?userId=" +this.userId +"&groupId="+this.groupId + "&dateTime="+this.nowDate+"&token=" + this.token)
            // this.axios.post("http://test.viefong.com:8976/app/sign/v1/getUserSignDay?userId=" +this.userId +"&groupId="+this.groupId + "&dateTime="+this.nowDate+"&token=" + this.token)
            this.axios.post("http://viefong.com:8976/app/sign/v1/getUserSignDay?userId=" +this.userId +"&groupId="+this.groupId + "&dateTime="+this.nowDate+"&token=" + this.token)
              .then(res => {
                if(res.data.rescode==100){
                    this.inOutTime = res.data.data;
                    // console.log(this.inOutTime);
                    this.groupTime = res.data.data.groupTime;
                    this.userSignStatus = res.data.data.userSignState;
                }else{
                    this.$message.error(res.data.msg);
                }
              }).catch(e=>e);
        },
        setTimeThis(){
            this.getDate();
            // this.axios.post("http://172.16.0.57:8976/app/sign/v1/getUserSignDay?userId=" +this.userId +"&groupId="+this.groupId + "&dateTime="+this.nowDateLata+"&token=" + this.token)
            // this.axios.post("http://test.viefong.com:8976/app/sign/v1/getUserSignDay?userId=" +this.userId +"&groupId="+this.groupId + "&dateTime="+this.nowDateLata+"&token=" + this.token)
            this.axios.post("http://viefong.com:8976/app/sign/v1/getUserSignDay?userId=" +this.userId +"&groupId="+this.groupId + "&dateTime="+this.nowDateLata+"&token=" + this.token)
              .then(res => {
                if(res.data.rescode==100){
                    this.getNowTime = res.data.data;
                    // console.log(this.getNowTime)
                }else{
                    this.$message.error(res.data.msg);
                }
              }).catch(e=>e);
        },
        //获取时间
        currentTime() {
            setInterval(this.getDate, 500);
        },
        getDate: function() {
            let _this = this;
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth() + 1 < 10 ? "0"+(new Date().getMonth() + 1 ): new Date().getMonth() + 1;
            let dd = new Date().getDate() < 10  ? '0'+new Date().getDate() : new Date().getDate();
            let week = new Date().getDay();
            let hh = new Date().getHours() < 10 ? "0"+new Date().getHours() : new Date().getHours();
            let mf = new Date().getMinutes() < 10? '0' + new Date().getMinutes() : new Date().getMinutes();
            let sec = new Date().getSeconds() < 10? '0' + new Date().getSeconds() : new Date().getSeconds();
            if (week == 1) {
              this.nowWeek = "星期一";
            } else if (week == 2) {
              this.nowWeek = "星期二";
            } else if (week == 3) {
              this.nowWeek = "星期三";
            } else if (week == 4) {
              this.nowWeek = "星期四";
            } else if (week == 5) {
              this.nowWeek = "星期五";
            } else if (week == 6) {
              this.nowWeek = "星期六";
            } else {
              this.nowWeek = "星期日";
            }
            _this.nowTime = hh + ":" + mf + ":" + sec;
            _this.nowDate = yy + "-" + mm + "-" + dd;
            let cc =dd-1
            if(cc<10){
                let aa ='0'+cc
                this.nowDateLata = yy + "-" + mm + "-" + aa;
            }else{
                this.nowDateLata = yy + "-" + mm + "-" + (dd-1);
            }
        }
    },
}
</script>
<style scope="less">
    .appClass{
        margin: 0 20px 0 20px;
        box-sizing:border-box;
    }
    .appClassAccount{
        color: #409EFF;
        padding-top: 4rem;
        font-size: 2rem;
        text-align: center;
    }
    .appClassPunch_time{
        color: #409EFF;
        line-height: 5rem;
    }
    .onClack{
        text-align:center;
        padding: 18% 0 0 0;
    }
    .onClackAddrButton{
        width: 80%;
        height: 150px;
    }
    .onClackAddrP{
        word-wrap:break-word;
        margin: 5px auto;
        width: 60%;
        border:1px solid #409EFF;
        padding:10px 20px;
        background-color: rgba(51,102,255 , 0.2);
        border-radius:25px;
        -moz-border-radius:25px; /* 老的 Firefox */
        color: #409EFF;
    }
    .onClackAddrB{
        word-wrap:break-word;
        margin: 5px auto;
        width: 60%;
        border:1px solid green;
        padding:10px 20px;
        background-color: rgba(60,179,113 , 0.3);
        border-radius:25px;
        -moz-border-radius:25px; /* 老的 Firefox */
        color: green;
    }
    .addrs{
        width:80%;
        /* height:80%; */
        /* border:1px solid red; */
        margin:0 auto;
        padding-top: 7px;
        text-align: center;
    }
    .addrs span{
        color:gray;
    }
    /*天气*/
    .weather{
        width: 100%;
        height: 200px; 
    }
    .weather .weatherDeial{
        margin:0 auto;
        margin-top:8px;
        border:1px solid #409EFF;
        width:10%;
        text-align:center;
        border-radius:50%;
        padding: 3%;
        background: #409EFF;
        color: whitesmoke;
        box-shadow: 0px 0px 30px #888888;
    }
    .weather .weatherDeial div{
        font-size:10px ;
    }
    .weather .weatherUl{
        width: 100%;
        display: flex;
        justify-content: center;
        
    }
    .weather .weatherUl .weatherUlLi{
        list-style: none;
        padding: 0 2px;
        text-align: center;
        margin-top: 12%;
    }
    .weather .weatherUl .weatherUlLi p .span0{
        color:#8FBC8F;
    }
    .weather .weatherUl .weatherUlLi div .span1{
        color:#409EFF;
    }
    .weather .weatherUl .weatherUlLi div .span2{
        color: #A52A2A; 	
    }
    .el-dialog__body{
        padding:5% 0;
    }
</style>
