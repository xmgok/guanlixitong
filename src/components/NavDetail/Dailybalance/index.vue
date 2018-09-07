<template>
    <div class="examine_approve Dailybalance">
        <div class="search-wraps">
            <ul>
                <li v-if="areaShow">
                    <span>所在地区：</span>
                     <getArea @getAreaCode="getAreaCode" :values="sDistrictCodearr"/>
                </li>
                <li v-if="corpShow">
                    <span>部门：</span>
                    <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr" :widths="'160px'"/>
                </li>
                <li v-if="sCodeShow">
                    <span>门店：</span>
                    <Select :SelecttemData="storeDatas" :values="searchFlow.belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>日期：</span>
                    <DatePiker :values="searchFlow.busiDate" @clickDatePiker="upInput" arguName="busiDate" :clearable="clearable" :style="{width:'160px'}"/>
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="demand" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="">
            <div class="btn-wrap">
                <ul class="tag clearfix">
                    <li v-for="item in tag" :class="{active:item.active}" @click="toggle(item)">{{item.value}}</li>
                </ul>
                <div class="daily" v-show="dailyShow">
                    <el-table :data="listdata" border style="width:100%" >
                        <el-table-column  prop="collectMoney" label="收银汇总" width="200">
                            <template slot-scope="scope">
                                <ul class="total">
                                    <li  class="clearfix">
                                        <div class="left">收款方式</div>
                                        <div class="right">金额</div>
                                    </li>
                                    <li v-for="item in scope.row.collectMoney" class="clearfix">
                                        <div class="left">{{item.payTypeName}}</div>
                                        <div class="right">{{item.amount.toFixed(2)}}</div>
                                    </li>
                                </ul>
                                
                            </template>
                        </el-table-column>
                        <el-table-column  prop="balanceChange" label="余额变动" width="200">
                            <template slot-scope="scope">
                                <ul class="total">
                                    <li  class="clearfix">
                                        <div class="left">变动类型</div>
                                        <div class="right">金额</div>
                                    </li>
                                    <li v-for="item in scope.row.balanceChange" class="clearfix">
                                        <div class="left">{{item.changeTypeName}}</div>
                                        <div class="right">{{item.changeAmount.toFixed(2)}}</div>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="analyze" v-show="!dailyShow">
                    日结分析
                </div>
            </div>
            <footer  v-show="dailyShow">
                <div class="clearfix">
                    <span class="spanl">现金存银行：</span>
                    <Input placeholder="￥0.00" :onkeyup="onkeyup"  :value="bankSaving"/>
                </div>
                <div class="clearfix">
                    <span class="spanl">备注：</span>
                    <Textarea :values="remark" @sonTextarea="upTextarea"/>
                </div>
            </footer>
            <div class="footer"  v-show="dailyShow">
                <Button :Name="status?'撤销日结':'提交日结'" @click.native="commit" />
                <Button Name="打印"  />
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import Button from "../../common/Button";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Table from "@/components/common/Table";
import Select from "../../common/Select";
import DatePiker from "../../common/DatePiker";
import {mapMutations,mapState} from "vuex"
export default {
    name:"Dailybalance",
    components: { DatePiker,Textarea, Button, Input, Select,Table,getArea:resolve => {require(['../../common/getArea'], resolve)}
    ,getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)} },
    data() {
        return {
            clearable:false,
            areaShow:true,//地区权限
            corpShow:true,//部门权限
            sCodeShow:true,//门店权限
            status:0,//（0:未日结 1:已日结）
            searchFlow:{//搜索条件
                sDistrictCode:"",
                corpCode:this.$getCookie("dept"),
                belongShop:this.$getCookie("belongShop"),
                busiDate:this.$dateFormat('yy-MM-dd',new Date())
            },
            sDistrictCodearr:[],
            corpCodeArr:[],
            storeDatas:[],
            tag:[
                {key:0,value:"日结",active:true},
                {key:1,value:"日结分析",active:false},
            ],
            dailyShow:true,
            listdata:[],
            remark:"",
            bankSaving:""
        };
    },
    computed: {
        ...mapState(["storesvuex"]),
    },
    beforeRouteLeave(to, from, next) {
        
        next()
    },
    methods: {
        ...mapMutations(["setDatas"]),
        upTextarea(value){
            this.remark=value;
        },
        toggle(item){
            this.tag.map(el=>{
                el.active=false;
            })
            item.active=true;
            if(item.key==1){
                this.dailyShow=false;
            }else{
                this.dailyShow=true;
            }
        },
        resetAll(){
            this.corpCodeArr=[];
            this.sDistrictCodearr=[];
            this.searchFlow={
                sDistrictCode:"",
                corpCode:this.$getCookie("dept"),
                belongShop:this.$getCookie("belongShop"),
                busiDate:this.$dateFormat('yy-MM-dd',new Date())
            };
            this.getStore();
        },
        getCorpStore(value){
            console.log(value)
            if(this.searchFlow.corpCode!=value[value.length-1]){
                this.searchFlow.corpCode=value[value.length-1];
                this.searchFlow.belongShop="";
                this.getStore();
            }
        },
        getStore(){
            let data={
                pageNumber:1,
                pageSize:1000,
                corpCode:this.searchFlow.corpCode||"",
                queryType:0,
                sDistrictCode:this.searchFlow.sDistrictCode||"",
            }
            if(this.searchFlow.corpCode==this.$getCookie("dept")&&!this.searchFlow.sDistrictCode){//默认门店（当前部门下的门店）
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
         // 搜索查询的条件
        upInput(value,arguName){
            console.log(value)
            this.searchFlow[arguName]=value;
        },
        // 查询
        demand(){
            console.log(this.searchFlow)
            if(!this.searchFlow.belongShop){
                this.$message({
                    type:'info',
                    message:"请选择门店"
                });
                return
            }
            let data = {
                belongShop:this.searchFlow.belongShop,
                busiDate:this.searchFlow.busiDate,
            };
            this.demandFunc(data);
        },
        getAreaCode(value){
            if(this.searchFlow.sDistrictCode!=value){
                this.searchFlow.sDistrictCode=value;
                this.searchFlow.belongShop="";
                this.getStore();
            }
        },
        onkeyup(value){
            value.target.value = value.target.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
            value.target.value = value.target.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
            value.target.value = value.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
            value.target.value = value.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
            if(value.target.value.indexOf(".")< 0 && value.target.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
                value.target.value= parseFloat(value.target.value);  
            }  
            this.bankSaving=value.target.value;
        },
        commit(){
            if(this.status==1){//撤销日结
                 let data = {
                    belongShop:this.searchFlow.belongShop,
                    busiDate:this.searchFlow.busiDate,
                };
                this.$post(this.$host+"/api/store/business/statistics/revokeCtBusi", data).then(d => {
                    if (d.success) {
                        this.$message({
                            type:'success',
                            message:"撤销日结成功"
                        })
                        this.status=0;
                    }
                });
            }else{
                let data = {
                    belongShop:this.searchFlow.belongShop,
                    busiDate:this.searchFlow.busiDate,
                    remark:this.remark,
                    bankSaving:this.bankSaving||0
                };
                this.$post(this.$host+"/api/store/business/statistics/saveCtBusi", data).then(d => {
                    if (d.success) {
                        this.$message({
                            type:'success',
                            message:"提交日结成功"
                        })
                        this.status=1;
                    }
                });
            }
        },
        demandFunc(data){
            this.$post(this.$host+"/api/store/business/statistics/diurnalKnotShow", data).then(d => {
                if (d.success) {
                   this.listdata=[];
                   let balanceChange=d.data.balanceChange;
                   let collectMoney=d.data.collectMoney;
                   this.status=d.data.status;
                   if(this.status==1){
                        this.remark=d.data.remark;
                        this.bankSaving=d.data.bankSaving;
                   }
                    this.listdata[0]=new Object();
                    this.listdata[0].balanceChange=balanceChange;
                    this.listdata[0].collectMoney=collectMoney;
                   console.log(this.listdata)
                }
            });
        },
    },
    mounted() {
        this.getStore();
        if(this.$getCookie("belongShop")){
            let data = {
                belongShop:this.searchFlow.belongShop,
                busiDate:this.searchFlow.busiDate,
            };
            this.demandFunc(data);
        }
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F060") {//预存收款的权限
                if (el.fUrl == "area") {
                    this.areaShow = true;
                }
                if (el.fUrl == "corp") {
                    this.corpShow = true;
                }
                if (el.fUrl == "sCode") {
                    this.sCodeShow = true;
                }
            }
        })
    },
};
</script>
<style scoped>
    .examine_approve{

    }
    .tag{
        margin-bottom: 12px;
    }
    .tag li{
        float: left;
        border: 1px solid #DCDFE6;
        width: 80px;
        text-align: center;
        border-right: none;
        cursor: pointer;
    }
    .tag li:last-child{
        border: 1px solid #DCDFE6;
    }
    .tag li.active{
        background: #2CBCC8;
        border: 1px solid #2CBCC8;
        color: #ffffff;
    }
    footer>div{
        margin-top: 24px;
    }
    .spanl{
        display: inline-block;
        width: 73px;
        text-align: right;
        vertical-align:top;
    }
    .footer{
        text-align: center;
        margin-top: 24px;
    }
    .footer button:last-child{
        margin-left: 24px;
    }
    .total li{
        padding: 0 10px;
        padding-top: 10px;
    }
    .total li:last-child{
        color: #F5A623;
        padding-bottom: 10px;
    }
    
</style>
<style>
    .Dailybalance .el-table td{
        vertical-align: top;
    }
   
</style>



