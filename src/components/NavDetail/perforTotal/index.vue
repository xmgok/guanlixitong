<template>
    <div class="ReceiptTotal">
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
                    <span>员工：</span>
                    <Input :values="searchFlow.emp" arguName="emp" @sonInput="upInput" placeholder="员工工号/名称"/>
                </li>
                <li>
                    <span>业绩日期：</span>
                    <DateRange @getDateRange="upDateRange" :arguName="times" :values="timesArr"/>
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="getDatas(1)" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="deptSelect">
            <ul class="clearfix funHeader">
                <li>
                    <Button :Upload="true" Name="导出已选择" @click.native="downSelected"></Button>
                    <Button :Upload="true" Name="导出全部" @click.native="demandAll(1,total)"></Button>
                </li>
            </ul>

        </div>
        <el-table :data="datas" border style="width:100%"  @selection-change="selectDatasFun" ref="multipleTable" :row-key="getRowKeys">
            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
            <el-table-column  prop="storeName" label="门店" width="200" v-if="AreaShow" :key="Math.random()"></el-table-column>
            <el-table-column  prop="empName" label="员工姓名" width="120" v-if="deptShow" :key="Math.random()">
                <template slot-scope="scope">
                    <span class="btncor" @click="gotoDetail(scope.row)">{{scope.row.empName}}</span>
                </template>
            </el-table-column>
            <el-table-column  prop="empNo" label="员工工号" width="120" v-if="storeShow" :key="Math.random()"></el-table-column>
            <el-table-column  prop="statName" label="岗位" width="120" >
            </el-table-column>
            <el-table-column  prop="postName" label="职级" width="120">
            </el-table-column>
            <el-table-column  prop="totalVal" label="汇总金额(￥)" width="120">
            </el-table-column>
            <el-table-column  prop="repeitVal" label="收款总业绩(￥)" width="120">
            </el-table-column>
            <el-table-column  prop="perVal" label="服务总提成(￥)" width="120">
            </el-table-column>
            <el-table-column  prop="consumeVal" label="销售总提成(￥)" width="120">
            </el-table-column>
            <el-table-column min-width='1'></el-table-column>
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
    import Input from "@/components/common/Input";
    import {mapMutations,mapState} from "vuex"
    export default {
        components: {
            Select,getArea:resolve => {require(['../../common/getArea'], resolve)},getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)},
            DateRange,Button,Paging,Input
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
                    emp:"",
                },
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
            getRowKeys(row){
                return row.empNo;
            },
            ...mapMutations(["setDatas"]),
            gotoDetail(item){
                this.$router.push({
                    path:"/NavDetail/perforTotaldetail",
                    query:{
                        code:item.empNo
                    }
                })
            },
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
                        message: '请选择期望导出的汇总!',
                        duration: "1000",
                        onClose: () => {
                        }
                    });
                } else {
                    let arr1 = ["门店", "员工姓名", "员工工号", "岗位","职级","汇总金额(￥)", "收款总业绩(￥)", "服务总提成(￥)", "销售总提成(￥)"];
                    let Tbody1=["storeName","empName","empNo","statName","postName","totalVal","repeitVal","perVal","consumeVal"];
                    this.$exportExcel(arr1, Tbody1, this.selectDatas, '业绩汇总');
                    this.toggleSelection();
                }
            },
            // 导出全部
            demandAll(){
                let data=this.searchFlow;
                data.pageSize=this.total;
                this.$post(this.$cspr+"/api/report/perSummary/getPerSummaryData",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        content.map(el=>{
                            el.consumeVal=(parseFloat(el.consumeVal)).toFixed(2);
                            el.perVal=(parseFloat(el.perVal)).toFixed(2);
                            el.repeitVal=(parseFloat(el.repeitVal)).toFixed(2);
                            el.totalVal=(parseFloat(el.totalVal)).toFixed(2);
                        })
                        let arr1 = ["门店", "员工姓名", "员工工号", "岗位","职级","汇总金额(￥)", "收款总业绩(￥)", "服务总提成(￥)", "销售总提成(￥)"];
                        let Tbody1=["storeName","empName","empNo","statName","postName","totalVal","repeitVal","perVal","consumeVal"];
                        this.$exportExcel(arr1, Tbody1, content, '业绩汇总');
                    }
                })
            },
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
             // 搜索查询的条件
            upInput(value,arguName){
                this.searchFlow[arguName]=value;
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
                if(index){
                    this.searchFlow.pageNumber=parseInt(index);
                }
                this.searchFlow.pageSize=50;
                let data=this.searchFlow;
                this.$post(this.$cspr+"/api/report/perSummary/getPerSummaryData",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        content.map(el=>{
                            el.consumeVal=(parseFloat(el.consumeVal)).toFixed(2);
                            el.perVal=(parseFloat(el.perVal)).toFixed(2);
                            el.repeitVal=(parseFloat(el.repeitVal)).toFixed(2);
                            el.totalVal=(parseFloat(el.totalVal)).toFixed(2);
                        })
                        this.datas=content;
                        this.total=d.data.dataList.total;
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