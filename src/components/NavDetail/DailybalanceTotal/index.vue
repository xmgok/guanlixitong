<template>
    <div class="examine_approve DailybalanceTotal">
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
                    <Button Name='查询' buttonClass='purple' @click.native="getDatas(1)" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="">
            <div class="btn-wrap">
                <div class="btns">
                    <Button Name="添加" @click.native="adddaily" />
                    <Button Name="批量结账" v-if="!isShop" @click.native="arrdaily"/>
                </div>
                <div class="daily" v-show="dailyShow">
                    <el-table :data="datas" border style="width:100%" show-summary :summary-method="getSummaries"  @selection-change="selectDatasFun" ref="multipleTable" :row-key="getRowKeys">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column  prop="aName" label="地区" width="200"></el-table-column>
                        <el-table-column  prop="deptName" label="部门" width="200"></el-table-column>
                        <el-table-column  prop="sName" label="门店" width="200"></el-table-column>
                        <el-table-column  prop="busiDate" label="日期" width="120"></el-table-column>
                        <el-table-column v-for="(item,index) in payTypeDatas" :key="index"  :label="item.typeName"  width="200" >
                            <template slot-scope="scope">
                                {{getids(scope.row.payList,item.type)}}
                            </template>
                        </el-table-column>
                        <el-table-column  prop="statusName" label="状态" width="120"></el-table-column>
                        <el-table-column  prop="operator" label="日结操作人" width="200"></el-table-column>
                        <el-table-column  prop="closeAcctor" label="财务结账人" width="200"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="250" >
                            <template slot-scope="scope" class="rtext" >
                                <div class="rtext">
                                    <Button Name="查看" buttonClass="Btn" @click.native="seedetail(scope.row,scope.$index)"  />
                                    <i class="borderLeft"   ></i>
                                    <Button Name="撤销日结" buttonClass="Btn" @click.native="cancledaily(scope.row,scope.$index)" />
                                    <i class="borderLeft"  v-if="!isShop"></i>
                                    <Button :Name="scope.row.dailyName" buttonClass="Btn" @click.native="closedaily(scope.row)" v-if="!isShop"/>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                <Paging :handleCurrentChange="getDatas" :total="total" class="pagingwidth"  :pageSize="searchFlow.pageSize" :currentPage='searchFlow.pageNumber'/>
                </div>
            </div>
        </div>
        <div class="model Dailybalancemodel" v-show="DailybalanceShow">
            <header class="Header clearfix">
                <div class="left">门店营业日结</div>
                <div class="right"><i class="icon iconclose" @click="cancelling"></i></div>
            </header>
            <div class="examine_approve Dailybalance">
                <div class="search-wraps">
                    <ul>
                        <li v-if="!isShop">
                            <span>所在地区：</span>
                            <getArea @getAreaCode="getAreaCodes" :values="sDistrictCodearrs"/>
                        </li>
                        <li v-if="!isShop">
                            <span>部门：</span>
                            <getCorpStore @getCorpStore="getCorpStores" :values="corpCodeArrs" :widths="'160px'"/>
                        </li>
                        <li v-if="!isShop">
                            <span>门店：</span>
                            <Select :SelecttemData="storeDatass" :values="searchFlows.belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInputs" :widths="'160px'"/>
                        </li>
                        <li v-if="isShop">
                            <span>门店：</span>{{shopName}}
                        </li>
                        <li>
                            <span>日期：</span>
                            <!-- <DatePiker :values="searchFlows.busiDate" @clickDatePiker="upInput" arguName="busiDate" :clearable="clearable" :style="{width:'160px'}"/> -->
                            <el-date-picker
                                v-model="searchFlows.busiDate"
                                type="date"
                                size="mini"
                                value-format="yyyy-MM-dd"
                                :clearable="clearable"
                                placeholder="选择日期" @change="upInputs" :style="{width:'160px'}">
                            </el-date-picker>
                        </li>
                        <li>
                            <Button Name='查询' buttonClass='purple' @click.native="demand" :Search="true"></Button>
                            <Button Name='重置' buttonClass='purple' @click.native="resetAlls" Reset="true"  v-if="!isShop"></Button>
                        </li>
                    </ul>
                </div>
                <div class="">
                    <div class="btn-wrap">
                        <ul class="tag clearfix">
                            <li v-for="(item,index) in tag" :class="{active:item.active}" @click="toggle(item,index)" v-show="item.show">{{item.value}}</li>
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
                                                <div class="left">{{item.typeName}}</div>
                                                <div class="right">{{parseFloat(item.amount).toFixed(2)}}</div>
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
                                                <div class="left">{{item.typeName}}</div>
                                                <div class="right">{{parseFloat(item.amount).toFixed(2)}}</div>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="analyze" v-show="!dailyShow">
                            <el-table :data="listdatas" border style="width:100%" >
                                <el-table-column  prop="pointListConsume" label="点单消费" width="330">
                                    <template slot-scope="scope">
                                        <ul class="total">
                                            <li  class="clearfix">
                                                <div class="left">产品分类（一级）</div>
                                                <div class="left">消费项目数</div>
                                                <div class="right">消费金额</div>
                                            </li>
                                            <li v-for="item in scope.row.pointListConsume" class="clearfix">
                                                <div class="left">{{item.cateName}}</div>
                                                <div class="left">{{item.consumeTimes}}</div>
                                                <div class="right">{{parseFloat(item.consumePrice).toFixed(2)}}</div>
                                            </li>
                                        </ul>
                                        
                                    </template>
                                </el-table-column>
                                <el-table-column  prop="empProduce" label="员工产出" width="330">
                                    <template slot-scope="scope">
                                        <ul class="total">
                                            <li  class="clearfix">
                                                <div class="left">员工</div>
                                                <div class="left">服务会员数</div>
                                                <div class="right">服务项目数</div>
                                            </li>
                                            <li v-for="item in scope.row.empProduce" class="clearfix">
                                                <div class="left">{{item.empName+'('+item.workNo+')'}}</div>
                                                <div class="left">{{item.serCusNumber}}</div>
                                                <div class="right">{{item.serProNumber}}</div>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <footer class="dailyShowfooter"  v-show="dailyShow">
                        <div class="clearfix">
                            <span class="spanl">现金存银行：</span>
                            <Input placeholder="￥0.00" :onkeyup="onkeyup"  :value="bankSaving"/>
                        </div>
                        <div class="clearfix">
                            <span class="spanl">备注：</span>
                            <Textarea :values="remark" @sonTextarea="upTextarea"/>
                        </div>
                    </footer>
                    <div class="footer"  >
                        <Button Name="关闭" buttonClass="None" @click.native="cancelling"/>
                        <Button :Name="status?'撤销日结':'提交日结'" @click.native="commit" v-show="status!=2"/>
                    </div>
                </div>
            </div>
        </div>
        <Mtk v-show="DailybalanceShow"/>
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
import Mtk from "@/components/common/Mtk";
import Paging from "@/components/common/Paging";
import {mapMutations,mapState} from "vuex"
export default {
    name:"Dailybalance",
    components: { DatePiker,Textarea,Mtk,Paging, Button, Input, Select,Table,getArea:resolve => {require(['../../common/getArea'], resolve)}
    ,getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)} },
    data() {
        return {
            DailybalanceShow:false,
            clearable:false,
            areaShow:true,//地区权限
            corpShow:true,//部门权限
            sCodeShow:true,//门店权限
            shopName:this.$getCookie("shopName")||"",
            status:0,//（0:未日结 1:已日结）
            id:"",
            busiDate:"",
            belongShop:this.$getCookie("belongShop"),
            dataTotal:[],
            searchFlow:{//搜索条件
                aCode:"",
                deptCode:this.$getCookie("dept"),
                belongShop:this.$getCookie("belongShop"),
                pageNumber:1,
                pageSize:50,
                status:"",
                beginTime:"",
                endTime:"",
            },
            searchFlows:{//弹框搜索条件
                sDistrictCode:"",
                corpCode:this.$getCookie("dept"),
                belongShop:this.$getCookie("belongShop"),
                busiDate:this.$dateFormat('yy-MM-dd',new Date())
            },
            sDistrictCodearr:[],
            sDistrictCodearrs:[],
            corpCodeArr:[],
            corpCodeArrs:[],
            storeDatas:[],
            storeDatass:[],
            tag:[
                {key:0,value:"日结",active:true,show:true,},
                {key:1,value:"日结分析",active:false,show:false,},
            ],
            dailyShow:true,
            datas:[],
            listdata:[],
            remark:"",
            bankSaving:"",
            isShop:false,
            payTypeDatas:[],
            total:0,
            listdatas:[],
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
        arrdaily(){
            console.log(this.selectDatas)
            if(this.selectDatas&&this.selectDatas.length>0){
                let idArray=[];
                this.selectDatas.map(el=>{
                    idArray.push(el.id)
                })
                let data={
                    idArray:idArray
                }
                this.$post(this.$host+'/api/store/business/statistics/batchEndAcct',data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:'success',
                            message:"批量结账成功"
                        });
                        this.getDatas();
                    }
                })
            }else{
                this.$message({
                    type:"info",
                    message:'请选择结账门店'
                })
            }
        },
        cancelling(){
            this.DailybalanceShow=false;
        },
        // 查看
        seedetail(item){
            let data = {
                belongShop:item.belongShop,
                busiDate:item.busiDate,
            };
            this.searchFlows.busiDate=item.busiDate;
            this.searchFlows.corpCode =item.deptCode;
            this.corpCodeArrs=[];
            this.getStores();
            this.searchFlows.belongShop=item.belongShop;
            console.log(item)
            this.demandFunc(data);
            this.DailybalanceShow=true;
        },
        // 撤销日结
        cancledaily(item){
            let data = {
                belongShop:item.belongShop,
                busiDate:item.busiDate,
                id:item.id
            };
            this.$post(this.$host+"/api/store/business/statistics/revokeCtBusi", data).then(d => {
                if (d.success) {
                    this.$message({
                        type:'success',
                        message:"撤销日结成功"
                    });
                    this.getDatas();
                }
            });
        },
        // 撤销结账或结账
        closedaily(item){
            let status=0;
            let message="";
            if(item.status==2){//已结账的撤销
                status=1;
                message='撤销结账成功'
            }else if(item.status==1){//结账
                status=2;
                message='结账成功';
            }
            let data = {
                id:item.id,
                status:status
            };
            this.$post(this.$host+"/api/store/business/statistics/endAcct", data).then(d => {
                if (d.success) {
                    this.$message({
                        type:'success',
                        message:message
                    });
                    item.closeAcctor=this.$getCookie("uname");
                    if(item.status==2){
                        item.status=1;
                        item.dailyName="财务结账";
                        item.statusName="未结账";
                    }else if(item.status==1){
                        item.status=2;
                        item.dailyName="撤销结账";
                        item.statusName="已结账";
                    }
                }
            });
        },
        adddaily(){
            if(this.isShop){
                let data = {
                    belongShop:this.$getCookie("belongShop"),
                    busiDate:this.searchFlows.busiDate,
                };
                this.demandFunc(data);
            }
            this.DailybalanceShow=true;
        },
        upTextarea(value){
            this.remark=value;
        },
        toggle(item,index){
            this.tag.map(el=>{
                el.active=false;
            })
            // item.active=true;
            this.tag[index].active=true;
            if(item.key==1){
                this.dailyShow=false;
                this.getdiurnalAnalysis();
            }else{
                this.dailyShow=true;
            }
        },
        // 日结分析
        getdiurnalAnalysis(){
            let data = {
                belongShop:this.belongShop,
                busiDate:this.busiDate,
            };
            this.$post(this.$host+"/api/store/business/statistics/diurnalAnalysis", data).then(d => {
                if (d.success) {
                   this.listdatas=[];
                   let pointListConsume=d.data.pointListConsume;
                   let empProduce=d.data.empProduce;
                    this.listdatas[0]=new Object();
                    this.listdatas[0].pointListConsume=pointListConsume;
                    this.listdatas[0].empProduce=empProduce;
                   console.log(this.listdatas)
                }
            });
        },
        resetAll(){
            this.corpCodeArr=[];
            this.sDistrictCodearr=[];
            this.searchFlow={
                aCode:"",
                deptCode:this.$getCookie("dept"),
                belongShop:this.$getCookie("belongShop"),
                pageNumber:1,
                pageSize:50,
                status:"",
                beginTime:"",
                endTime:"",
            };
            this.getStore();
        },
        resetAlls(){
            this.corpCodeArrs=[];
            this.sDistrictCodearrs=[];
            this.searchFlows={
                sDistrictCode:"",
                corpCode:this.$getCookie("dept"),
                belongShop:this.$getCookie("belongShop"),
                busiDate:this.$dateFormat('yy-MM-dd',new Date())
            };
            this.getStore();
        },
        getCorpStore(value){
            console.log(value)
            if(this.searchFlow.deptCode!=value[value.length-1]){
                this.searchFlow.deptCode=value[value.length-1];
                this.searchFlow.belongShop="";
                this.getStore();
            }
        },
        getCorpStores(value){
            console.log(value)
            if(this.searchFlows.corpCode!=value[value.length-1]){
                this.searchFlows.corpCode=value[value.length-1];
                this.searchFlows.belongShop="";
                this.getStores();
            }
        },
        getStore(){
            let data={
                pageNumber:1,
                pageSize:1000,
                corpCode:this.searchFlow.deptCode||"",
                queryType:0,
                sDistrictCode:this.searchFlow.sDistrictCode||"",
            }
            if(this.searchFlow.deptCode==this.$getCookie("dept")&&!this.searchFlow.sDistrictCode){//默认门店（当前部门下的门店）
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
        getStores(){
            let data={
                pageNumber:1,
                pageSize:1000,
                corpCode:this.searchFlows.corpCode||"",
                queryType:0,
                sDistrictCode:this.searchFlows.sDistrictCode||"",
            }
            if(this.searchFlows.corpCode==this.$getCookie("dept")&&!this.searchFlows.sDistrictCode){//默认门店（当前部门下的门店）
                if(this.storesvuex){
                    this.storesvuex.map(e=>{
                        e.active=false;
                        return e;
                    })
                    this.storeDatass=this.storesvuex;
                }else{
                    this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                        if(d.success){
                            let content=d.data.content.map(e=>{
                                e.active=false;
                                return e;
                            })
                            this.storeDatass=content;
                            this.setDatas({name:"storesvuex",value:this.storeDatass})
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
                        this.storeDatass=content;
                    }
                });
            }
        },
         // 搜索查询的条件
        upInput(value,arguName){
            console.log(value)
            this.searchFlow[arguName]=value;
        },
        
        upInputs(value,arguName){
            console.log(value)
            this.searchFlows[arguName]=value;
        },
        // 查询
        demand(){
            console.log(this.searchFlows)
            if(!this.searchFlows.belongShop){
                this.$message({
                    type:'info',
                    message:"请选择门店"
                });
                return
            }
            let data = {
                belongShop:this.searchFlows.belongShop,
                busiDate:this.searchFlows.busiDate,
            };
            this.toggle({key:0},0)
            this.demandFunc(data);
        },
        getAreaCode(value){
            if(this.searchFlow.aCode!=value){
                this.searchFlow.aCode=value;
                this.searchFlow.belongShop="";
                this.getStore();
            }
        },
        getAreaCodes(value){
            if(this.searchFlows.sDistrictCode!=value){
                this.searchFlows.sDistrictCode=value;
                this.searchFlows.belongShop="";
                this.getStores();
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
                    belongShop:this.belongShop,
                    busiDate:this.busiDate,
                    id:this.id,
                };
                this.$post(this.$host+"/api/store/business/statistics/revokeCtBusi", data).then(d => {
                    if (d.success) {
                        this.$message({
                            type:'success',
                            message:"撤销日结成功"
                        })
                        this.status=0;
                        this.tag[1].show=false;
                        this.toggle({key:0},0)
                    }
                });
            }else if(this.status===0){//提交日结
                let data = {
                    belongShop:this.belongShop,
                    busiDate:this.busiDate,
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
                        this.tag[1].show=true;
                        this.id=d.data.id||"";
                    }
                });
            }
        },
        getids(list,type){
            let value="--";
            list.map(el=>{
                if(el.type==type){
                    value=el.amount;
                }
            });
            return value;
        },
         getSummaries(){
            let arrSUm=[];
            this.payTypeDatas.map(el=>{
                let hasdata=false;//是否有此分类
                this.dataTotal.map(val=>{
                    if(val.type==el.type){
                        hasdata=true;
                        arrSUm.push(val.amount);
                    }
                });
                !hasdata&&arrSUm.push("");
            });
            let arr1= ["","","","","合计"];
            arr1.push.apply(arr1,arrSUm);
            return arr1;
        },
        getDatas(index){
            console.log(index)
            if(index>0){
                this.searchFlow.pageNumber=parseInt(index);
            }
            this.searchFlow.pageSize=50;
            let data=this.searchFlow;
            this.$post(this.$host+"/api/store/business/statistics/findCTBusiPage",data).then(d=>{
                if(d.success){
                    let content=d.data.pageData.content;
                    content.map(el=>{
                        switch(el.status){
                            case 0:el.dailyName="财务结账";el.statusName="未日结";break;//未日结
                            case 1:el.dailyName="财务结账";el.statusName="未结账";break;//未结账
                            case 2:el.dailyName=" 撤销结账";el.statusName="已结账";break;//已结账
                        }
                    })
                    this.datas=content;
                    this.total=d.data.pageData.total;
                    this.dataTotal=d.data.totalList;
                }
            })
        },
        getRowKeys(row){
            return row.id;
        },
         //选择的数据
        selectDatasFun(val) {
            this.selectDatas = val;
        },
         // 获取动态列
        getPayType(){
            this.$post(this.$host+"/api/store/business/statistics/getDynamicColumn",{}).then(d=>{
                if(d.success){
                    let content=d.data;
                    this.payTypeDatas=content;
                }
            })
        },
       
        demandFunc(data){
            this.$post(this.$host+"/api/store/business/statistics/diurnalKnotShow", data).then(d => {
                if (d.success) {
                   this.listdata=[];
                   let balanceChange=d.data.balanceChange;
                   let collectMoney=d.data.collectMoney;
                   this.belongShop=data.belongShop;
                   this.status=d.data.status;
                   if(this.status){//已日结
                        this.tag[1].show=true;
                   }else{
                        this.tag[1].show=false;
                   }
                   this.busiDate=d.data.busiDate;
                   this.id=d.data.id||"";
                   if(this.status){
                        this.remark=d.data.remark;
                        this.bankSaving=d.data.bankSaving;
                   }else{
                        this.remark='';
                        this.bankSaving='';
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
        this.getPayType();
        this.getDatas(1);
        if(this.$getCookie("belongShop")){
            this.isShop=true;
            this.adddaily();
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
    .analyze .total li div{
        width: 33.33%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        text-align: right;
    }
    .analyze .total li div:first-child{
        text-align: left;
    }
    .btn-wrap .btns{
        margin-bottom:12px;
    }
    .btn-wrap .tag{
        margin-bottom:12px;
    }
    .dailyShowfooter >div{
        margin-top:12px;
    }
    .Dailybalancemodel{
        width: 800px;
    }
    .Dailybalance{
        padding: 0 18px;
    }
    .Dailybalance .footer{
        text-align: center;
        padding: 24px 0;
    }
    .Dailybalance .footer button:last-child{
        margin-left: 24px;
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
</style>




