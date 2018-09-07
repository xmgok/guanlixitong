<template>
    <div class="BusinessTotal">
        <div class="search-wraps">
            <ul>
                <li>
                    <span>所在地区：</span>
                        <getArea @getAreaCode="getAreaCode" :values="sDistrictCodearr"/>
                </li>
                <li>
                    <span>部门：</span>
                    <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr" :widths="'160px'"/>
                </li>
                <li>
                    <span>门店：</span>
                    <Select :SelecttemData="storeDatas" :values="searchFlow.sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>日期：</span>
                    <DateRange @getDateRange="upDateRange" :arguName="times" :values="timesArr"/>
                </li>
                <li>
                    <span>经营性质：</span>
                    <Select :SelecttemData="sOwnerDatas" :values="searchFlow.sOwner" arguName="sOwner" :SelecttemDetail="['ownerId','ownerName']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="getDatas(1)" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="deptSelect">
            <ul class="clearfix funHeader">
                <li v-for="item in lis" @click="selectclass(item)" :class="{active:item.active}">{{item.value}}
                    <i class="icon icongou" v-show="item.active"></i>
                </li>
                <li>
                    <Button :Upload="true" Name="导出已选择" @click.native="downSelected"></Button>
                    <Button :Upload="true" Name="导出全部" @click.native="demandAll(1,total)"></Button>
                </li>
            </ul>

        </div>
        <el-table :data="datas" border style="width:100%" show-summary :summary-method="getSummaries" @selection-change="selectDatasFun" ref="multipleTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column  prop="areaName" label="地区" width="120" v-if="AreaShow" :key="Math.random()"></el-table-column>
            <el-table-column  prop="deptName" label="部门" width="200" v-if="deptShow" :key="Math.random()"></el-table-column>
            <el-table-column  prop="storeName" label="门店" width="200" v-if="storeShow" :key="Math.random()"></el-table-column>
            <el-table-column  prop="payCount" label="本期收款金额(￥)" width="150" >
            </el-table-column>
            <el-table-column  prop="refundCount" label="本期退款金额(￥)" width="150">
            </el-table-column>
            <el-table-column  prop="incomeCount" label="本期净收金额(￥)" width="150">
            </el-table-column>
            <el-table-column  prop="consumeCount" label="本期消费金额(￥)" width="150">
            </el-table-column>
            <el-table-column  prop="busiCount" label="本期业绩(￥)" width="150">
            </el-table-column>
            <el-table-column  min-width='1'></el-table-column>
        </el-table>
        <Paging :handleCurrentChange="getDatas" :total="total" class="pagingwidth"  :pageSize="searchFlow.pageSize"/>
        
    </div>
</template>
<script>
    import getArea from "@/components/common/getArea";
    import getCorpStore from "@/components/common/getCorpStore";
    import Select from "@/components/common/Select";
    import DateRange from "@/components/common/DateRangeNr";
    import Button from "@/components/common/Button";
    import Paging from "@/components/common/Paging";
    import {mapMutations,mapState} from "vuex"
    export default {
        components: {
            Select,getArea:resolve => {require(['../../common/getArea'], resolve)},getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)},
            DateRange,Button,Paging
        },
        data () {
            return {
                sOwnerDatas:[],
                Tbody:["areaName","deptName","storeName","payCount","refundCount","payCount","consumeCount","busiCount"],
                total:1,
                AreaShow:true,
                deptShow:true,
                storeShow:true,
                datas:[],
                times:['startDate','endDate'],
                timesArr:[],
                sDistrictCodearr:[],
                corpCodeArr:[],
                storeDatas:[],
                dataTotal:{},
                searchFlow:{
                    sCode:this.$getCookie("belongShop"),
                    areaCode:"",
                    deptCode:"",
                    pageNumber:1,
                    pageSize:50,
                    startDate:"",
                    endDate:"",
                    sOwner:"",
                    groupType:"1",
                },
                lis:[
                    {value:"按门店汇总",key:"1",active:true,},
                    {value:"按部门汇总",key:"2",active:false,},
                    {value:"按地区汇总",key:"3",active:false,},
                ],
                dateslis:[
                    {value:"今日",key:"1",active:false,},
                    {value:"昨日",key:"2",active:false,},
                    {value:"本周",key:"3",active:false,},
                    {value:"本月",key:"4",active:false,},
                    
                ],
                selectDatas:[],
            }
        },
        computed: {
            ...mapState(["storesvuex"]),
        },
        methods: {
            //选择的数据
            selectDatasFun(val) {
                this.selectDatas = val;
            },
            toggleSelection(rows) {
                this.$refs.multipleTable.clearSelection();
                this.selectDatas="";
            },
            downSelected(){
                if (this.selectDatas.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '请选择期望导出的产品!',
                        duration: "1000",
                        onClose: () => {
                        }
                    });
                } else {
                    console.log(this.searchFlow.groupType)
                    switch(this.searchFlow.groupType){
                        case "1":
                            let arr1 = ["地区", "部门", "门店", "本期收款金额(￥)", "本期退款金额(￥)", "本期净收金额(￥)", "本期消费金额(￥)","本期业绩(￥)"];
                            let Tbody1=["areaName","deptName","storeName","payCount","refundCount","incomeCount","consumeCount","busiCount"];
                            this.selectDatas.push({
                                areaName:"",
                                deptName:"",
                                storeName:"合计",
                                payCount:parseFloat(this.dataTotal.payTotal).toFixed(2),
                                refundCount:parseFloat(this.dataTotal.refundTotal).toFixed(2),
                                incomeCount:parseFloat(this.dataTotal.payTotal-this.dataTotal.refundTotal).toFixed(2),
                                consumeCount:parseFloat(this.dataTotal.consumeTotal).toFixed(2),
                                busiCount:parseFloat(this.dataTotal.busiTotal).toFixed(2),
                            });
                            this.$exportExcel(arr1, Tbody1, this.selectDatas, '营业汇总');
                            break;
                        case "2":
                            let arr2 = [ "部门", "本期收款金额(￥)", "本期退款金额(￥)", "本期净收金额(￥)", "本期消费金额(￥)","本期业绩(￥)"];
                            let Tbody2=["deptName","payCount","refundCount","payCount","consumeCount","busiCount"];
                            this.selectDatas.push({
                                deptName:"合计",
                                payCount:parseFloat(this.dataTotal.payTotal).toFixed(2),
                                refundCount:parseFloat(this.dataTotal.refundTotal).toFixed(2),
                                incomeCount:parseFloat(this.dataTotal.payTotal-this.dataTotal.refundTotal).toFixed(2),
                                consumeCount:parseFloat(this.dataTotal.consumeTotal).toFixed(2),
                                busiCount:parseFloat(this.dataTotal.busiTotal).toFixed(2),
                            });
                            this.$exportExcel(arr2, Tbody2, this.selectDatas, '营业汇总');
                            break;
                        case "3":
                            let arr3 = [ "地区", "本期收款金额(￥)", "本期退款金额(￥)", "本期净收金额(￥)", "本期消费金额(￥)","本期业绩(￥)"];
                            let Tbody3=["areaName","payCount","refundCount","payCount","consumeCount","busiCount"];
                            this.selectDatas.push({
                                areaName:"合计",
                                payCount:parseFloat(this.dataTotal.payTotal).toFixed(2),
                                refundCount:parseFloat(this.dataTotal.refundTotal).toFixed(2),
                                incomeCount:parseFloat(this.dataTotal.payTotal-this.dataTotal.refundTotal).toFixed(2),
                                consumeCount:parseFloat(this.dataTotal.consumeTotal).toFixed(2),
                                busiCount:parseFloat(this.dataTotal.busiTotal).toFixed(2),
                            });
                            this.$exportExcel(arr3, Tbody3, this.selectDatas, '营业汇总');
                            break;
                    }
                    this.toggleSelection();
                }
            },
            // 导出全部
            demandAll(){
                let data=this.searchFlow;
                data.pageSize=this.total;
                this.$post(this.$cspr+"/api/report/busiSummary/getBusiSummaryData",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        content.map(el=>{
                            el.payCount=(parseFloat(el.payCount)).toFixed(2);
                            el.refundCount=(parseFloat(el.refundCount)).toFixed(2);
                            el.incomeCount=el.payCount-el.refundCount;
                            el.consumeCount=(parseFloat(el.consumeCount)).toFixed(2);
                            el.busiCount=(parseFloat(el.busiCount)).toFixed(2);
                        })
                        let dataTotal=d.data.dataTotal;
                        switch(this.searchFlow.groupType){
                        case "1":
                            let arr1 = ["地区", "部门", "门店", "本期收款金额(￥)", "本期退款金额(￥)", "本期净收金额(￥)", "本期消费金额(￥)","本期业绩(￥)"];
                            let Tbody1=["areaName","deptName","storeName","payCount","refundCount","incomeCount","consumeCount","busiCount"];
                            content.push({
                                areaName:"",
                                deptName:"",
                                storeName:"合计",
                                payCount:parseFloat(dataTotal.payTotal).toFixed(2),
                                refundCount:parseFloat(dataTotal.refundTotal).toFixed(2),
                                incomeCount:parseFloat(dataTotal.payTotal-dataTotal.refundTotal).toFixed(2),
                                consumeCount:parseFloat(dataTotal.consumeTotal).toFixed(2),
                                busiCount:parseFloat(dataTotal.busiTotal).toFixed(2),
                            });
                            this.$exportExcel(arr1, Tbody1, content, '营业汇总');
                            break;
                        case "2":
                            let arr2 = [ "部门", "本期收款金额(￥)", "本期退款金额(￥)", "本期净收金额(￥)", "本期消费金额(￥)","本期业绩(￥)"];
                            let Tbody2=["deptName","payCount","refundCount","payCount","consumeCount","busiCount"];
                            content.push({
                                deptName:"合计",
                                payCount:parseFloat(dataTotal.payTotal).toFixed(2),
                                refundCount:parseFloat(dataTotal.refundTotal).toFixed(2),
                                incomeCount:parseFloat(dataTotal.payTotal-dataTotal.refundTotal).toFixed(2),
                                consumeCount:parseFloat(dataTotal.consumeTotal).toFixed(2),
                                busiCount:parseFloat(dataTotal.busiTotal).toFixed(2),
                            });
                            this.$exportExcel(arr2, Tbody2, content, '营业汇总');
                            break;
                        case "3":
                            let arr3 = [ "地区", "本期收款金额(￥)", "本期退款金额(￥)", "本期净收金额(￥)", "本期消费金额(￥)","本期业绩(￥)"];
                            let Tbody3=["areaName","payCount","refundCount","payCount","consumeCount","busiCount"];
                            content.push({
                                areaName:"合计",
                                payCount:parseFloat(dataTotal.payTotal).toFixed(2),
                                refundCount:parseFloat(dataTotal.refundTotal).toFixed(2),
                                incomeCount:parseFloat(dataTotal.payTotal-this.dataTotal.refundTotal).toFixed(2),
                                consumeCount:parseFloat(dataTotal.consumeTotal).toFixed(2),
                                busiCount:parseFloat(dataTotal.busiTotal).toFixed(2),
                            });
                            this.$exportExcel(arr3, Tbody3, content, '营业汇总');
                            break;
                    }
                    }
                })
            },
            getSummaries(){
                if(this.searchFlow.groupType==1){
                    return ["","","","合计",parseFloat(this.dataTotal.payTotal).toFixed(2),parseFloat(this.dataTotal.refundTotal).toFixed(2),parseFloat(this.dataTotal.payTotal-this.dataTotal.refundTotal).toFixed(2),parseFloat(this.dataTotal.consumeTotal).toFixed(2),parseFloat(this.dataTotal.busiTotal).toFixed(2)]
                }else{
                    return ["","合计",parseFloat(this.dataTotal.payTotal).toFixed(2),parseFloat(this.dataTotal.refundTotal).toFixed(2),parseFloat(this.dataTotal.payTotal-this.dataTotal.refundTotal).toFixed(2),parseFloat(this.dataTotal.consumeTotal).toFixed(2),parseFloat(this.dataTotal.busiTotal).toFixed(2)]
                }
            },
            // 查询
            demand(){},
            // 重置
            resetAll(){
                this.searchFlow.sCode=this.$getCookie("belongShop");
                this.searchFlow.areaCode="";
                this.searchFlow.deptCode="";
                this.searchFlow.startDate="";
                this.searchFlow.endDate="";
                this.searchFlow.sOwner="";
                this.sDistrictCodearr=[];
                this.corpCodeArr=[];
                this.timesArr=[];
                this.getStore();
                this.dateslis.map(el=>{
                    el.active=false;
                })
            },
            selectclass(item){
                this.lis.map(el=>{
                    el.active=false;
                })
                item.active=true;
                this.searchFlow.groupType=item.key;
                switch(item.key){
                    case "1":this.AreaShow=true;this.deptShow=true;this.storeShow=true;break;
                    case "2":this.AreaShow=false;this.deptShow=true;this.storeShow=false;break;
                    case "3":this.AreaShow=true;this.deptShow=false;this.storeShow=false;break;
                }
                this.getDatas();
            },
            selectdate(item){
                if(item.active){
                    item.active=false;
                    this.searchFlow.startDate="";
                    this.searchFlow.endDate="";
                }else{
                    this.dateslis.map(el=>{
                        el.active=false;
                    })
                    item.active=true;
                    switch(item.key){
                        case "1":this.searchFlow.startDate=this.$dateFormat("yy-MM-dd",new Date().getTime());this.searchFlow.endDate=this.searchFlow.startDate;break;
                        case "2":this.searchFlow.startDate=this.$dateFormat("yy-MM-dd",new Date().setDate(new Date().getDate()-1));this.searchFlow.endDate=this.searchFlow.startDate;break;
                        case "3":this.searchFlow.startDate=this.$dateFormat("yy-MM-dd",new Date().setDate(new Date().getDate()-new Date().getDay()+1));
                                this.searchFlow.endDate=this.$dateFormat("yy-MM-dd",new Date().setDate(new Date().getDate()+8-new Date().getDay()));break;
                        case "4":
                                var Nowdate=new Date();
                                var MonthFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1); 
                                let M=Number(MonthFirstDay.getMonth())+1;
                                this.searchFlow.startDate=MonthFirstDay.getFullYear()+"-"+M+"-"+MonthFirstDay.getDate(); 
                                var MonthNextFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth()+1,1);
                                var MonthLastDay=new Date(MonthNextFirstDay-86400000);
                                let MN=Number(MonthLastDay.getMonth())+1;
                                this.searchFlow.endDate=MonthLastDay.getFullYear()+"-"+MN+"-"+MonthLastDay.getDate();break;
                    };
                }
                this.timesArr=[];
                console.log(this.searchFlow.startDate)
                console.log(this.searchFlow.endDate)
            },
            ...mapMutations(["updateAlives","setDatas"]),
             // 搜索查询的条件
            upInput(value,arguName){
                this.searchFlow[arguName]=value||"";
            },
            getAreaCode(value){
                this.searchFlow.areaCode=value;
            },
            upDateRange(value,arguName){
                this.timesArr=value;
                console.log(value)
                this.dateslis.map(el=>{
                    el.active=false;
                });
                if(value){
                    this.searchFlow[arguName[0]]=value[0];
                    this.searchFlow[arguName[1]]=value[1];
                }else{
                    this.searchFlow[arguName[0]]="";
                    this.searchFlow[arguName[1]]="";
                }
                
            },
            getCorpStore(value){
                if(this.searchFlow.deptCode!=value[value.length-1]){
                    this.searchFlow.deptCode=value[value.length-1];
                    this.searchFlow.sCode="";
                    this.getStore();
                }
            },
            getStore(){
                let data={
                    pageNumber:1,
                    pageSize:1000,
                    corpCode:this.searchFlow.deptCode||this.$getCookie("dept")||"",
                    queryType:0
                }
                if(!this.searchFlow.deptCode){//默认门店（当前部门下的门店）
                    if(this.storesvuex){
                        this.storesvuex.map(e=>{
                            e.active=false;
                            return e;
                        })
                        this.storeDatas=this.storesvuex;
                    }else{
                        this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                            if(d.success){
                                let content=d.data.content.map(e=>{
                                    e.active=false;
                                    return e;
                                })
                                this.storeDatas=content;
                                this.setDatas({name:"storesvuex",value:this.storeDatas})
                            }
                        });
                    }
                }else{
                    this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                        if(d.success){
                            let content=d.data.content.map(e=>{
                                e.active=false;
                                return e;
                            })
                            this.storeDatas=content;
                        }
                    });
                }
            },
            getDatas(index){
                console.log(index)
                if(index){
                    this.searchFlow.pageNumber=parseInt(index);
                }
                let data=this.searchFlow;
                this.$post(this.$cspr+"/api/report/busiSummary/getBusiSummaryData",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        content.map(el=>{
                            el.payCount=(parseFloat(el.payCount)).toFixed(2);
                            el.refundCount=(parseFloat(el.refundCount)).toFixed(2);
                            el.incomeCount=(el.payCount-el.refundCount).toFixed(2);
                            el.consumeCount=(parseFloat(el.consumeCount)).toFixed(2);
                            el.busiCount=(parseFloat(el.busiCount)).toFixed(2);
                        })
                        this.datas=content;
                        this.total=d.data.dataList.total;
                        this.dataTotal=d.data.dataTotal;
                    }
                })
            },
            // 获取经营方式
            getsOwnerDatas(){
                this.$post(this.$cspr+"/api/report/busiSummary/getSowner",{}).then(d=>{
                    if(d.success){
                        let content=d.data;
                        this.sOwnerDatas=content;
                    }
                })
            },
        },
        mounted () {
            this.getDatas();
            this.getStore();
            this.getsOwnerDatas();
        }
    }
</script>
<style scoped>
    .dates{
        display: inline-block;
    }
    .dates >span{
        height: 25px;
        line-height: 25px;
        width: 34px;
        text-align: center;
        border: 1px solid #dcdfe6;
        display: inline-block;
        cursor: pointer;
        margin-left: 4px;
    }
    .dates >span.active{
        border: 1px solid #2cbcc8;
        background: #2cbcc8;
        color: #ffffff;
    }
    .deptSelect{
        padding-bottom: 12px;
    }
    .funHeader li{
        float: left;
        border: 1px solid #dcdfe6;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        position: relative;
        cursor: pointer;
    }
    .funHeader li:last-child{
        float: right;
        width: inherit;
        border: none;
    }
    .funHeader li.active{
        border: 1px solid #2cbcc8;
        color: #2cbcc8;
    }
    .icongou::before {
        content: "\E650";
        position: absolute;
        font-size: 36px;
        right: -10px;
        bottom: -9px;
    }
</style>