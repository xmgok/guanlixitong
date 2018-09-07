<template>
    <div class="Arrange">
        <div v-if="isShop">
        <div class="grounp">
            <Button Name="设置小组"  @click.native="gotogrounp" v-if="editShow"/>
            <Button Name="拷贝排班"  @click.native="copyclass" v-if="copysShow"/>
        </div>
        <div class="clearfix floatTop">
            <ul class="classes clearfix">
                <li v-for="item in lis" @click="selectclass(item)" :class="{active:item.active,line:!item.startTime}">
                    {{item.storeName}}
                    <p class="itemtimes" v-if="item.startTime">
                    {{item.startTime?(item.startTime+"-"+item.endTime):""}}
                    </p>
                    <i class="icon icongou" v-show="item.active"></i>
                </li>
            </ul>
            <ul class="search">
                <li>
                    <span>年月：</span>
                    <el-date-picker
                        v-model="value4"
                        type="month"
                        @change="changeMonth"
                        value-format="yyyy-MM"
                        placeholder="选择月">
                    </el-date-picker>
                </li>
                <!-- <li>
                    <Button Name="查询" @click.native="demand"/>
                </li> -->
            </ul>
        </div>
        
        <div class="pos" :style="{width:isWidth,maxWidth:'100%'}" >
            <div class="ov" >
                <table class="Tablesdf" :style="{width:isWidth}">
                    <thead>
                        <tr>
                            <th rowspan="2" :style="{width:'100px'}">小组</th>
                            <th rowspan="2" :style="{width:'100px'}">姓名</th>
                            <th v-for="item in datas[0]['empInfoList'][0].detail" :style="{width:'50px'}">{{item.date}}</th>
                            <th rowspan="2" :style="{width:'100px'}">操作
                            </th>
                        </tr>
                        <tr>
                            <th v-for="item in datas[0]['empInfoList'][0].detail" :class="{weekred:(item.week=='六'||item.week=='日')}">{{item.week}}</th>
                        </tr>
                    </thead>
                    <tbody v-for="itemss in datas">
                        <tr v-for="(item,index) in itemss.empInfoList">
                            <td :rowspan="itemss.empInfoList.length" v-if="index===0">
                                <div :style="{width:'120px'}">{{itemss.groupName+itemss.empInfoList.length}}</div>
                            </td>
                             <td>
                                <div :style="{width:'120px'}">{{item.empName}}</div>
                            </td>
                            <td v-for="items in item.detail" @click="setclass(items)" :class="[items.canclick?'canclick':'gay']" ><div>{{items.storeName||"--"}}</div></td>
                            <td>
                                <div :style="{width:'100px'}">
                                    <Button Name="保存" buttonClass="Btn"/>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="Tablesdf fixleft" >
                    <thead>
                        <tr>
                            <th rowspan="2" :style="{width:'100px'}">小组</th>
                            <th rowspan="2" :style="{width:'100px',height:'60px'}">姓名</th>
                        </tr>
                    </thead>
                    <tbody v-for="itemss in datas">
                        <tr v-for="(item,index) in itemss.empInfoList">
                            <td :rowspan="itemss.empInfoList.length" v-if="index===0">
                                <div :style="{width:'120px'}">{{itemss.groupName+itemss.empInfoList.length}}</div>
                            </td>
                             <td>
                                <div :style="{width:'120px'}">{{item.empName}}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="Tablesdf fixright" >
                    <thead>
                        <tr>
                            <th rowspan="2" :style="{width:'100px',height:'60px'}">操作
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="itemss in datas">
                        <tr v-for="(item,index) in itemss.empInfoList">
                            <td>
                                <div :style="{width:'100px'}">
                                    <Button Name="保存" buttonClass="Btn" @click.native="submit(item)"/>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="model " v-show="copyShow">
            <header class="clearfix">
                <div class="left">拷贝排班</div>
                <div class="right"><i class="icon iconclose" @click="canclecopy"></i></div>
            </header>
            <div class="body">
                <ul>
                    <li>
                        选择员工：<Input placeholder="请选择" @click.native="showPeople" :readonlys="readonlys" :value="sourceWorkName"/>
                    </li>
                    <li>
                        选择年月：<el-date-picker
                        v-model="value1"
                        type="month"
                        @change="copychangeMonth"
                        value-format="yyyy-MM"
                        placeholder="选择月">
                    </el-date-picker>
                    </li>
                    <li>
                        拷贝到以下员工：<Button Name="添加员工" @click.native="addEmps"/>
                        <ul class="sourceWorkNos clearfix"> 
                            <li v-for="item in sourceWorkNos" @click="deleteitem(item)">{{item.empName}} <i class="icon iconclose"></i></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="footer">
                <Button buttonClass="None" Name="取消" @click.native="canclecopy"/>
                <Button  Name="确定" @click.native="submitcopy"/>
            </div>
        </div>
        <AboutPeople :RadioPeople="Radio" :AboutPeopleSelected="AboutStoreSelected" v-if="modelemployee" :submit="sureemployee" :SelectedData="yuEmployees" :demandShow="demandShow"  :canclefun="canclefun"/>
        <Mtk v-show="copyShow"/>
    </div>
    <noShop v-if="!isShop"/>     
    </div>
</template>
<script>
    import Button from "../../common/Button"
    import Mtk from "../../common/Mtk"
    import Input from "../../common/Input"
    import noShop from "../../common/noShop"
    // import AboutPeople from "../../common/AboutPeople"
    export default{
        components: {
            Button,Mtk,Input,AboutPeople: resolve => {require(['../../common/AboutPeople'], resolve)},//懒加载
            noShop
        },
        data(){
            return{
                editShow:false,//设置小组权限
                copysShow:false,//拷贝排班权限
                demandShow:false,
                yuEmployees:[],
                sourceWorkNo:"",//复制来源的工号(单选)
                sourceWorkNos:[],//拷贝到以下员工(多选)
                sourceWorkName:"",//复制来源的员工名称
                readonlys:true,
                modelemployee:false,
                Radio:false,
                copyShow:false,
                value4:"",
                value1:"",//拷贝的月份
                datas:[
                    {'empInfoList':[
                        {empName:"",detail:[
                    ]},
                    ]}
                    
                ],
                lis:[
                ],//班次
                selectedli:{},
                isShop:true,//是否有所属门店
            }
        },
        computed: {
          isWidth:function(){
                return this.datas[0]['empInfoList'][0].detail.length*50+200+"px"
          }  
        },
        methods: {
            canclefun(){
                this.modelemployee=false;
            },
            submitcopy(){
                if(this.sourceWorkNo==""||this.sourceWorkNos.length==0){
                    this.$message({
                        type:"info",
                        message:"拷贝员工不能为空"
                    })
                    return;
                }
                let targetWorkNoList=[];
                this.sourceWorkNos.map(el=>{
                    let newobj=new Object()
                    newobj.workNo=el.workNo;
                    targetWorkNoList.push(newobj);
                })
                let data={
                    sourceWorkNo:this.sourceWorkNo,
                    beginTime:this.value1,
                    targetWorkNoList:targetWorkNoList
                }
                this.$post(this.$host+"/api/store/employee/cloneEmployeeShift",data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"排班拷贝成功"
                        })
                        this.sourceWorkNos=[];
                        this.demand();
                        this.copyShow=false;
                    }
                })
            },
            canclecopy(){
                this.copyShow=false;
                this.sourceWorkNos=[];
            },
            deleteitem(item){
                this.sourceWorkNos.map((el,index)=>{
                    if(el.workNo==item.workNo){
                        this.sourceWorkNos.splice(index,1)
                    }
                })
            },
            copychangeMonth(value){
                this.value1=value;
            },
            // 拷贝到以下员工
            addEmps(){//多选
                this.Radio=false;
                this.modelemployee=true;
            },
            // 多选的员工的确定
            sureemployee(items){
                this.modelemployee=false;
                items.map(el=>{
                    let canpush=true;
                    this.sourceWorkNos.map(val=>{
                        if(val.workNo==el.workNo){
                            canpush=false;
                        }
                    })
                    if(canpush){
                        this.sourceWorkNos.push(el);
                    }
                })
                this.yuEmployees=[];
                console.log(items)
            },
            // 单选员工
            AboutStoreSelected(item){
                if(this.Radio){//单选
                    this.modelemployee=false;
                    this.sourceWorkNo=item.workNo;
                    this.sourceWorkName=item.empName;
                    console.log(item)
                }
            },
            
            // 选择拷贝员工
            showPeople(){
                this.Radio=true;
                this.modelemployee=true;
            },
            // 拷贝排班
            copyclass(){
                this.copyShow=true;
            },
            // 保存
            submit(item){
                console.log(item)
                let list=[];
                item.detail.map(el=>{
                    let newobj=new Object();
                    newobj.classId=el.classId;
                    newobj.classDate=el.classDate;
                    list.push(newobj);
                })
                let data={
                    workNo:item.workNo,
                    list:list
                }
                this.$post(this.$host+"/api/store/employee/saveCEmpClass",data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"保存排班成功"
                        });
                    }
                })
            },
            // 点击查询
            demand(){
                let data={
                    belongShop:this.$getCookie("belongShop"),
                    date:this.value4
                }
                this.$post(this.$host+"/api/store/employee/findShiftInfo",data).then(d=>{
                    if(d.success){
                        let data=d.data;
                        let week=["日","一","二","三","四","五","六"];
                        data.map(value=>{
                            value.empInfoList.map(el=>{
                                el.detail.map(val=>{
                                    let day=new Date(val.classDate).getDay();
                                    val.week=week[day];
                                    let date=parseInt(val.classDate.slice(val.classDate.length-2));
                                    val.date=date;
                                    if(new Date(val.classDate)>new Date()){
                                        val.canclick=true;
                                    }else{
                                        val.canclick=false;
                                    }
                                })
                            })
                        })
                        this.datas=d.data;
                    }
                })
            },
            // 选中月份
            changeMonth(value){
                console.log(value);
                this.value4=value;
                if(value){
                    this.demand();
                }
            },
            // 选择班次
            selectclass(item){
                this.selectedli=item;
                this.lis.map(el=>{
                    el.active=false;
                })
                item.active=true;
            },
            // 去设置小组
            gotogrounp(){
                this.$router.push({
                    path:"/NavDetail/Grounp"
                })
            },
            // 设置班次
            setclass(items){
                if(new Date(items.classDate)>new Date()){//第二天
                    items.storeName=this.selectedli.storeName;
                    items.classId=this.selectedli.id;
                }else{
                    this.$message({
                        type:"info",
                        message:"时间已过，不能排班"
                    })
                }
            },
            // 获取班次
            getClass(){
                this.$post(this.$host+"/api/store/employee/findCShift",{}).then(d=>{
                    if(d.success){
                        let data=d.data;
                        data.map((el,index)=>{
                            el.startTime=this.$dateFormat("hh:mm",el.startTime);
                            el.endTime=this.$dateFormat("hh:mm",el.endTime);
                            el.active=false;
                            if(index==0){
                                el.active=true;
                            }
                        });
                        this.lis=data;
                        this.selectedli=this.lis[0];
                    }
                })
            },
            // 获取排班列表
            getClassList(){
                let now=new Date();
                let month=now.getMonth()+1;
                if(month<10){month="0"+month;}
                let times=now.getFullYear()+"-"+month;
                this.value4=times;
                this.value1=times;
                console.log(times)
                let data={
                    belongShop:this.$getCookie("belongShop"),
                    date:times
                }
                this.$post(this.$host+"/api/store/employee/findShiftInfo",data).then(d=>{
                    if(d.success){
                        let data=d.data;
                        let week=["日","一","二","三","四","五","六"];
                        data.map(value=>{
                            value.empInfoList.map(el=>{
                                el.detail.map(val=>{
                                    let day=new Date(val.classDate).getDay();
                                    val.week=week[day];
                                    let date=parseInt(val.classDate.slice(val.classDate.length-2));
                                    val.date=date;
                                    if(new Date(val.classDate)>new Date()){
                                        val.canclick=true;
                                    }else{
                                        val.canclick=false;
                                    }
                                })
                            })
                        })
                        this.datas=d.data;
                        console.log(this.datas[0]['empInfoList'][0].detail)
                    }
                })
            },
        },
        mounted () {
            if(this.$getCookie("belongShop")){
                this.getClassList();
                this.getClass();
            }else{
                this.isShop=false;
            }
            
            let auths = JSON.parse(this.$getSession("auths"));
            auths.map(el => {
                if (el.fParentCode == "F066") {//排班管理的权限
                    if (el.fUrl == "edit") {
                        this.editShow = true;
                    }
                    if (el.fUrl == "copy") {
                        this.copysShow = true;
                    }
                }
            })
        }
    }
</script>
<style scoped>
 .Tablesdf td div{
     overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 49px;
 }
 .line{
     line-height: 44px;
     height: 44px;
 }
 .line .icongou::before{
     bottom: -16px;
 }
 .itemtimes{
         font-size: 12px;
    margin-top: -10px;
 }
    .model{
        background: #fff;
        width: 600px;
    }
    .icongou::before{
        content: "\e650";
        position: absolute;
        font-size: 36px;
        right: -10px;
        bottom: -7px;
    }
    .floatTop{
        margin: 12px 0;
    }
    .sourceWorkNos li{
        float: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #efefef;
        text-align: center;
        margin-right: 12px;
        margin-top: 12px;
        cursor: pointer;
    }
    .sourceWorkNos li i{
        float: right;
    }
    .model header{
        padding: 12px 10px 12px 18px;
        font-size: 14px;
    }
    .model header i{
        font-size: 10px;
        cursor: pointer;
    }
    .model .body{
        padding-left: 24px;
    }
    .model .body>ul>li{
        padding-bottom:  12px;
    }
    .model .footer{
        text-align: right;
        padding: 12px 24px;
    }
    .grounp{
        cursor: pointer;
    }
    .weekred{
        color: red;
    }
    .Arrange .gay{
        background: #efefef;
    }
    .Arrange .canclick{
        cursor: pointer;
    }
    .classes{
        float: left;
    }
    ul.search{
        float: right;
    }
    .ov{
        overflow-x: auto;
        max-width: 100%;
    }
    .pos{
        position: relative;
    }
    .Tablesdf.fixleft{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 101px;
    }
    .Tablesdf.fixright{
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        width: 101px;
    }
</style>