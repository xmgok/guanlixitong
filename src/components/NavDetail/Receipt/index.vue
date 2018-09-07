<template>
    <div class="examine_approve ">
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
                    <Select :SelecttemData="storeDatas" :values="searchFlow.sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>会员：</span>
                    <Input placeholder="会员编号/姓名/手机" :value="searchFlow.custCodeOrNameOrTel"  arguName="custCodeOrNameOrTel" @sonInput="upInput" />
                </li>
                <li>
                    <span>创建日期：</span>
                    <DateRange @getDateRange="upDateRange" :arguName="times" :values="timesArr"/>
                </li>
                <li>
                    <span>收款单号：</span>
                    <Input :value="searchFlow.rcptNo"  arguName="rcptNo" @sonInput="upInput" />
                </li>
                <li>
                    <span>支付方式：</span>
                    <Select :SelecttemData="payTypeDatas" :values="searchFlow.payType" arguName="payType" :SelecttemDetail="['dKey','dValue']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>状态：</span>
                    <Select :SelecttemData="billStatus" :values="searchFlow.billStatus" arguName="billStatus" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>客户签名：</span>
                    <Select :SelecttemData="signStatus" :values="searchFlow.signStatus" arguName="signStatus" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>财务审核：</span>
                    <Select :SelecttemData="auditStus" :values="searchFlow.auditStus" arguName="auditStus" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="demand" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="">
            <div class="btn-wrap">
                <Button Name='新增' buttonClass='purple' @click.native="gotoAdd" :iconadd="true" v-if="addShow"></Button>
                <Button Name='批量审核' buttonClass='purple' @click.native="checkids" v-if="checkShow"></Button>
            </div>
            <div :style="{minWidth:'900px'}">
                    <el-table :data="datas" border style="width:100%"  @selection-change="selectDatasFun" :row-key='rowKey'>
                        <el-table-column type="selection" width="50" v-if="checkShow" :reserve-selection='true'></el-table-column>
                        <el-table-column fixed prop="sShortName" label="门店" width="120"></el-table-column>
                        <el-table-column fixed prop="cName" label="客户" width="200">
                            <template slot-scope="scope">
                                {{scope.row.cName+"("+scope.row.cCode+")"}}
                                <i class="icon iconF" v-show="scope.row.cWorkNo" :title="'内部员工，工号：'+scope.row.cWorkNo">
                                    <!-- <div class="iconDetal">内部员工<br>工号：{{scope.row.cWorkNo}}</div> -->
                                </i>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="createTime" label="创建日期" width="120"></el-table-column>
                        <el-table-column prop="rcptNo" label="收款单号" width="200">
                            <template slot-scope="scope">
                                <span class="btncor" @click="gotoDetail(scope.row)">{{scope.row.rcptNo}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="amount" label="实收金额(￥)" width="120">
                            <template slot-scope="scope">
                                {{parseFloat(scope.row.amount).toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column  prop="sShortName" label="业绩员工" width="120">
                            <template slot-scope="scope">
                                <div :class="{btncor:isShop&&scope.row.empPerIsCan&&scope.row.canallot}" @click="ChoiceStaff(scope.$index,scope.row)">{{scope.row.perEmpName?(scope.row.perEmpName+'...'):'(未选择)'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="billStatus" label="状态" width="120">
                        </el-table-column>
                        <el-table-column  prop="signStatus" label="客户签名状态" width="120"></el-table-column>
                        <el-table-column  prop="auditStus" label="财务审核状态" width="120"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="250" >
                            <template slot-scope="scope" class="rtext" >
                                <div class="rtext">
                                    <Button :Name="scope.row.signName" buttonClass="Btn" @click.native="suresign(scope.row,scope.$index)" v-show="scope.row.signShow"  v-if="isShop"/>
                                    <i class="borderLeft" v-show="scope.row.signShow&&(scope.row.auditShow||scope.row.payShow||scope.row.billShow)&&checkShow"  v-if="isShop"></i>
                                    <Button :Name="scope.row.auditName" buttonClass="Btn" @click.native="checkid(scope.row,scope.$index)" v-if="scope.row.auditShow&&checkShow"/>
                                    <i class="borderLeft" v-show="scope.row.auditShow&&(scope.row.payShow||scope.row.billShow)" v-if="isShop"></i>
                                    <Button :Name="scope.row.payName" buttonClass="Btn" @click.native="gotoPay(scope.row,scope.$index)" v-show="scope.row.payShow"  v-if="isShop"/>
                                    <i class="borderLeft" v-show="scope.row.payShow&&(scope.row.billShow)"  v-if="isShop"></i>
                                    <Button :Name="scope.row.billName" buttonClass="Btn"  v-show="scope.row.billShow" @click.native="deleteBillNo(scope.row)"  v-if="isShop"/>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
        </div>
        <Paging :handleCurrentChange="gotoPage" :total="total"  class="pagingwidth" :currentPage='searchFlow.pageNumber' :pageSize='searchFlow.pageSize'/>
        <div class="model" v-show="AddempIsShow">
            <header class="Header clearfix">
                <div class="left">可分配员工</div>
                <div class="right"><i class="icon iconclose" @click="cancelling"></i></div>
            </header>
            <div class="AllemployeeBox">
                <span class="Elementtag " v-for="(item,index) in employees">{{item.empName+'(工号'+item.workNo+')'}} <i class="icon cross Cursor" @click.stop="Delemp(item,index)"></i></span>
                <span class="Elementtag Cursor" @click.stop="Append" ><i class="icon Add"></i>添加</span>                    
            </div>
            <div class="ResultBtn">
                <Button Name="取消" class="None" @click.native="cancelling"/>
                <Button Name="确定" @click.native="Confirm"/>
            </div>
        </div>
        <Mtk v-show="AddempIsShow"/>
        <AboutPeople :RadioPeople="false" v-if="modelemployee" :submit="submit" :SelectedData="Employees" :canclefun="canclefun" :corpShow="corpShow" :sCodeShow="sCodeShow"/> 
    </div>
</template>
<script>
import Vue from "vue";
import Button from "../../common/Button";
import Paging from "../../common/Paging";
import Input from "@/components/common/Input";
import Table from "@/components/common/Table";
import Mtk from "@/components/common/Mtk";
import DateRange from "../../common/DateRange"
import Select from "../../common/Select";
import noShop from "../../common/noShop"
import {mapMutations,mapState} from "vuex"
export default {
    name:"Receipt",
    components: { Paging, Button, Input, Select,Mtk,Table,DateRange,getArea:resolve => {require(['../../common/getArea'], resolve)},noShop
    ,getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)},AboutPeople:resolve => {require(['../../common/AboutPeople'], resolve)} },
    data() {
        return {
            isShop:true,//是否有所属门店
            checkShow:false,//审核权限
            addShow:false,//新增权限
            areaShow:false,//地区权限
            corpShow:false,//部门权限
            sCodeShow:false,//门店权限
            sDistrictCodearr:[],
            timesArr:[],
            corpCodeArr:[],
            modelemployee:false,
            Search:true,
            AboutStoreShow:false,
            Radio:true,
            StoreSelectActive:false,
            AboutBranchClass:false,
            Cliked:false,
            StoreCliked:false,
            showMtk:false,
            SelectActive:false,
            showBranch:false,
            corpName:"",
            sName:"",
            receiptDetailShow:false,
            storeDatas:[],
            receiptDetail:[],
            times:['createTimeStart','createTimeEnd'],
            payTypeDatas:[],
            billStatus:[
                {key:0,value:"未收款"},
                {key:1,value:"已收款"},
                {key:2,value:"已撤销"},
            ],
            signStatus:[
                {key:1,value:"已签名"},
                {key:0,value:"未签名"},
            ],
            auditStus:[
                {key:0,value:"未审核"},
                {key:1,value:"已审核"},
                {key:2,value:"已撤销"},
            ],
            rcptNo:"",//收款单号
            idArr:[],//(批量)财务审核
            datas:[],
            billShow:false,
            signName:"签名确认",
            total:0,
            iptWidth:"120px",
            Lines:10,
            searchFlow:{//搜索条件
                "pageNumber": 1,
                "pageSize": 20,
                flowCode:"",
                rcptNo:"",
                payType:"",
                billStatus:"",
                signStatus:"",
                auditStus:"",
                createTimeStart:"",
                createTimeEnd:"",
                custCodeOrNameOrTel:"",
                sDistrictCode:"",
                corpCode:this.$getCookie("dept"),
                sCode:this.$getCookie("belongShop"),
            },
            checkedAll:false,
            batchDatas:[],//批量选择用户
            pageNum:'',
            AddempIsShow:false,
            employees:[],//已选中的员工
            Employees:[],//传入组件的员工
            dblTimes:1,
            selectDatas: [],
        };
    },
    computed: {
        ...mapState(["storesvuex","newReceipt","payTypevuex"]),
        timeArr(){
            return [this.searchFlow.createTimeStart,this.searchFlow.createTimeEnd]
        }
    },
    beforeRouteLeave(to, from, next) {
        if(to.path=="/NavDetail/addReceipt"){
            this.updateAlives({name:"addReceipt"})
        }
        next()
    },
    methods: {
        ...mapMutations(["updateAlives","setDatas"]),
         //rowKey
        rowKey(row) {
            return row.id;
        },
        //选择的数据
        selectDatasFun(val) {
            this.selectDatas = val;
        },
         // 获取支付方式
        getPayType(){
            if(this.payTypevuex){
                    this.payTypeDatas=this.payTypevuex;
            }else{
                this.$post(this.$host+"/api/sysmgr/dict/getPayType",{}).then(d=>{
                    if(d.success){
                        let content=d.data;
                        this.payTypeDatas=content;
                        this.setDatas({name:"payTypevuex",value:this.payTypeDatas})
                    }
                })
            }
        },
        canclefun(){
            this.modelemployee=false;
        },
        deleteBillNo(row){
            console.log(row);
            this.$post(this.$host+"/api/order/receiptbill/delNotRec",{rcptNo:row.rcptNo}).then(d=>{
                if(d.success){
                    this.$message({
                        type:"success",
                        message:"删除成功"
                    });
                    if(this.datas.length==1){//当前页就一条数据
                        if(this.searchFlow.pageNumber==1){//当前页就是第一页
                            this.datas.splice(index,1)
                            this.total--;
                        }else{
                            this.searchFlow.pageNumber--;
                            this.gotoPage();
                        }
                    }else{
                        this.gotoPage();
                    }
                    this.selectDatas.length&&this.selectDatas.map((el,i)=>{
                        if(el.id==row.id){
                            this.selectDatas.splice(i,1);
                        }
                    })
                }
            })
        },
        Delemp(item,index){
            this.employees.splice(index,1)
        },
        Confirm(){
            let empCodes = []
            this.employees.map(e=>{empCodes.push(e.workNo) });
            if(empCodes.length==0){
                this.$message({
                    type:"info",
                    message:"请最少选择一个员工"
                });
                return;
            }
            this.$post(this.$host+'/api/performance/receiptallot/superpositionupdateemp',{billNo:this.rcptNo,empCodes:empCodes}).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '分配成功！',
                        duration:"1000",
                    });
                    this.cancelling()
                    this.datas.map(e=>{if(e.rcptNo == this.rcptNo){e.perEmpName =this.employees.length>0?this.employees[0].empName:""}})                    
                }
            })
        },
        submit(items){
            this.modelemployee=false;
            items.map(e=>{
                if(!this.employees.some(em=>{return(e.workNo == em.workNo)})){
                    this.employees.push(e)
                }
            })
            console.log(this.employees)
        },
        Append(){
            this.modelemployee = true
            this.Employees=this.deepCopy(this.employees);
        },
        deepCopy(arr){
            let newArr=[];
            for(let i=0;i<arr.length;i++){
                newArr.push(this.copy(arr[i]));
            }
            return newArr;
        },
        copy(obj){
            let newobj={};
            for(let attr in obj){
                newobj[attr] = obj[attr];
            }
            return newobj;
        },
        cancelling(){
            this.AddempIsShow = false
        },
        ChoiceStaff(index,item){
            if(this.isShop&&item.empPerIsCan&&item.canallot){
                this.$post(this.$host+'/api/performance/receiptallot/allotquery',{billNo:item.rcptNo}).then(d=>{
                    if(d.success){
                        this.rcptNo = item.rcptNo;
                        this.AddempIsShow = true                    
                        this.employees = d.data.list
                    }
                })
            }
        },
        getCorpStore(value){
            console.log(value)
            if(this.searchFlow.corpCode!=value[value.length-1]){
                this.searchFlow.corpCode=value[value.length-1];
                this.searchFlow.sCode="";
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
        // 签名
        suresign(item,index){
            this.$router.push({
                path:"/NavDetail/sureReceipt",
                query:{
                    rcptNo:item.rcptNo
                }
            })
        },
        resetAll(){
            this.corpName="";
            this.sName="";
            this.corpCodeArr=[];
            this.timesArr=[];
            this.sDistrictCodearr=[];
            this.searchFlow={
                "pageNumber": 1,
                "pageSize": 20,
                flowCode:"",
                rcptNo:"",
                payType:"",
                billStatus:"",
                signStatus:"",
                auditStus:"",
                createTimeStart:"",
                createTimeEnd:"",
                custCodeOrNameOrTel:"",
                sDistrictCode:"",
                corpCode:this.$getCookie("dept"),
                sCode:this.$getCookie("belongShop"),
            };
            this.getStore();
        },
        showStoreFunc(){
            this.StoreCliked=!this.StoreCliked;
            this.AboutStoreShow=!this.AboutStoreShow;
            this.StoreSelectActive=!this.StoreSelectActive;
        },
        HideAll(){
            this.showBranch=false;
            this.Cliked = false;
            this.SelectActive=false;
            this.showMtk=false;
        },
        showBranchFunc() {
            this.showBranch = !this.showBranch;
            this.Cliked = !this.Cliked;
            this.SelectActive=!this.SelectActive;
            this.showMtk=!this.showMtk;
        },
        AboutBranchSelected(item){
            this.corpName=item.cName;
            this.searchFlow.corpCode=item.cCode;
            this.showBranchFunc();
        },
        // 查询
        demand(){
            console.log(this.searchFlow)
            this.searchFlow.pageNumber=1;
            let data = this.searchFlow;
            this.demandFunc(data);
        },
        getAreaCode(value){
            if(this.searchFlow.sDistrictCode!=value){
                this.searchFlow.sDistrictCode=value;
                this.searchFlow.sCode="";
                this.getStore();
            }
        },
        // 搜索查询的条件
        upInput(value,arguName){
            console.log(value)
            this.searchFlow[arguName]=value;
        },
        upDateRange(value,arguName){
            this.timesArr=value;
            if(value){
                this.searchFlow[arguName[0]]=value[0];
                this.searchFlow[arguName[1]]=value[1];
            }else{
                this.searchFlow[arguName[0]]="";
                this.searchFlow[arguName[1]]="";
            }
            
        },
        upSelect(value,arguName){

        },
        // 去付款
        gotoPay(item){

            this.$router.push({
                path:"/NavDetail/Payment",
                query:{
                    rcptNo:item.rcptNo
                }
            })
        },
        // 详情里去退款
        refund(){

        },
        togoSign(){
            // 详情里去签名确认或查看签名 
            this.$router.push({
                path:"/NavDetail/sureReceipt"
            })
        },
        // 批量审核
        checkids(){
            if(this.$stop()){return}//阻止双击的调用。
            if(this.selectDatas.length==0){
                this.$message({
                    type:'info',
                    message:"请最少先选中一个订单"
                });
                return;
            }
            let idArr=[];
            this.selectDatas.map(el=>{
                idArr.push(el.id)
            })
            let data={
                idArr:idArr
            }
            this.$post(this.$host+"/api/order/receiptbill/approve",data).then(d=>{
                if(d.success){
                    // this.datas=Object.assign({},this.datas,{auditName:"撤销审核"})
                    this.$message({
                        type:'success',
                        message:"审核成功"
                    });
                    this.datas.map(el=>{
                        this.selectDatas.map(val=>{
                            if(el.id==val){
                                el.auditStus="已审核";
                                el.auditName="撤销审核";
                            }
                        })
                    })
                }
            })
        },
        // 列表的审核
        checkid(item,index){
            if(item.auditName=="审核"){//审核
                let idArr=[];
                idArr.push(item.id);
                let data={
                    // idArr:idArr
                    idArr:idArr
                }
                this.$post(this.$host+"/api/order/receiptbill/approve",data).then(d=>{
                    if(d.success){
                        // this.datas[index]=Object.assign({},this.datas[index],{auditName:"撤销审核"})
                        this.$message({
                            type:"success",
                            message:"审核成功"
                        })
                        this.$set(this.datas[index],"auditName","撤销审核")
                        this.$set(this.datas[index],"auditStus","已审核")
                    }
                })
            }else{//撤销审核
                let idArr=[];
                idArr.push(item.id);
                let data={
                    idArr:idArr
                }
                this.$post(this.$host+"/api/order/receiptbill/approveCancel",data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"撤销审核成功"
                        })
                        this.$set(this.datas[index],"auditName","审核")
                        this.$set(this.datas[index],"auditStus","已撤销")
                    }
                })
            }
        },
        closeMtk(){
            this.receiptDetailShow=false;
            this.receiptDetail=[];
            this.rcptNo="";
            this.idArr=[];
            this.signName="签名确认";
            this.billShow=false;
        },
        gotoDetail(item){
            this.$router.push({
                path:"/NavDetail/ReceiptDetail",
                query:{
                    rcptNo:item.rcptNo,
                }
            })
        },
        gotoPage(index){
            let data=this.searchFlow;
            if(index){
                data.pageNumber=parseInt(index);
            }
            this.$post(this.$host + "/api/order/receiptbill/page", data)
                .then(d => {
                    if (d.success) {
                        let content= d.data.content;
                        if(content.length>0){
                            content.map(el=>{
                                el.isChecked=false;//签名按钮显示
                                el.signShow=true;//签名按钮显示
                                el.auditShow=true;//审核按钮显示
                                el.billShow=true;//撤销按钮显示
                                switch(el.auditStus){//财务审核状态
                                    case 0:el.auditStus="未审核";el.auditName="审核";break;
                                    case 1:el.auditStus="已审核";el.auditName="撤销审核";break;
                                    case 2:el.auditStus="已撤销";el.auditName="审核";break;
                                }
                                switch(el.signStatus){//签名状态
                                    case 0:el.signStatus="未签名";el.signName="签名确认";break;
                                    case 1:el.signStatus="已签名";el.signName="查看签名";break;
                                }
                                switch(el.billStatus){//收款单状态
                                    case 0:el.billStatus="未收款";el.billName="删除";el.payName="收款";el.payShow=true;break;
                                    case 1:el.billStatus="已收款";el.billName="退款";el.billShow=false;break;
                                    case 2:el.billStatus="已撤销";el.signStatus="";el.auditStus="";el.signShow=false;el.auditShow=false;el.billShow=false;break;
                                    case 3:el.billStatus="已退款";el.signName="查看退款单";el.signStatus="";el.auditStus="";el.auditShow=false;el.billShow=false;break;
                                }
                                el.createTime=this.$dateFormat("yy-MM-dd",el.createTime);
                            })
                        }
                        this.datas=content;
                        this.total = d.data.total;
                        this.invert(this.datas, this.batchDatas);
                    }
                });
        },
        //反选
        invert(arr, data) {
            arr.map((el, ix) => {
                data.some((val, key) => {
                    return (val === el.id)
                }) ? el.isChecked = true : el.isChecked = false;
            });
            arr.every(el => {
                return (el.isChecked)
            }) ? this.checkedAll = true : this.checkedAll = false;
        },
        searchFlowDatas(){},
        gotoAdd(){
            this.$router.push({
                path:"/NavDetail/addReceipt"
            })
        },
        demandFunc(data){
            this.$post(this.$host+"/api/order/receiptbill/page", data).then(d => {
                if (d.success) {
                    let content= d.data.content;
                    if(content.length>0){
                        content.map(el=>{
                            el.isChecked=false;//签名按钮显示
                            el.signShow=true;//签名按钮显示
                            el.auditShow=true;//审核按钮显示
                            el.billShow=true;//撤销按钮显示
                            el.payShow=false;//付款按钮显示
                            switch(el.auditStus){//财务审核状态
                                case 0:el.auditStus="未审核";el.auditName="审核";break;
                                case 1:el.auditStus="已审核";el.auditName="撤销审核";break;
                                case 2:el.auditStus="已撤销";el.auditName="审核";break;
                            }
                            switch(el.signStatus){//签名状态
                                case 0:el.signStatus="未签名";el.signName="签名确认";break;
                                case 1:el.signStatus="已签名";el.signName="查看签名";break;
                            }
                            switch(el.billStatus){//收款单状态
                                case 0:el.billStatus="未收款";el.billName="删除";el.payName="收款";el.payShow=true;break;
                                case 1:el.billStatus="已收款";el.billName="退款";el.billShow=false;break;
                                case 2:el.billStatus="已撤销";el.signStatus="";el.auditStus="";el.signShow=false;el.auditShow=false;el.billShow=false;break;
                                case 3:el.billStatus="已退款";el.signName="查看退款单";el.signStatus="";el.auditStus="";el.auditShow=false;el.billShow=false;break;
                            }
                            el.createTime=this.$dateFormat("yy-MM-dd",el.createTime);
                        })
                    }
                    this.datas=content;
                    this.total = d.data.total;
                }
            });
        },
    },
    mounted() {
        this.getStore();
        this.getPayType();
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F060") {//预存收款的权限
                if (el.fUrl == "add") {
                    this.addShow = true;
                }
                if (el.fUrl == "check") {
                    this.checkShow = true;
                }
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
        if(!this.$getCookie("belongShop")){
            this.isShop=false;
        } 
    },
    activated(){
        // if(this.newReceipt){
            //查询预存列表
            let data = this.searchFlow;
            this.demandFunc(data);
            this.setDatas({name:"newReceipt",value:false})
        // }
        
    }
};
</script>
<style scoped>
/*  */
.search-wraps li span:first-child{
    display: inline-block;
    width: 60px;
    text-align: right;
}
.MTK{
        position:absolute;
        z-index:999;
        background:transparent;
        width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    }
    .model{
        width: 400px;
    }

.Cursor {
    cursor: pointer;
    font-size: 1rem;
}
.Elementtag.Cursor{
    background: #ecf6ff;border-color: #1dade2;
    color: #1dade2;
}
.cross::before {
    content: "\E61A";
    color: #999;
}
.Add::before {
    content: "\E752";
    color: #1dade2;
    margin-right: .2rem;
}
.AllemployeeBox{
    width: 300px;
    margin: 0 auto;
}
.ResultBtn{
    padding: 24px 0;
    text-align: center;

}
.ResultBtn button:last-child{
    margin-left: 24px;
}
    .StoreSelect {
  position: absolute;
  right:14px;
  top: .333333rem;
  width: 8px;
  height: 8px;
  border-right: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  transform: rotate(45deg);
  cursor: pointer;
  transition: all 0.2s linear;
  transform-origin: 75% 75%;
}
.StoreSelect.StoreCliked{
    transform: rotate(-135deg);
}
.BranchSelect {
  position: absolute;
  right:14px;
  top: .333333rem;
  width: 8px;
  height: 8px;
  border-right: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  transform: rotate(45deg);
  cursor: pointer;
  transition: all 0.2s linear;
  transform-origin: 75% 75%;
}
.BranchSelect.Cliked{
    transform: rotate(-135deg);
}
.curor{
        cursor: pointer;
    }
    .SelectActive{
        border: 1px solid #82a9bf;
    }
    .StoreSelectActive{
        border: 1px solid #82a9bf;
    }
.caozuo{
    text-align: left;
}
.closemtk::before{
    content: "\e622";
    cursor: pointer;
}


.Table td.tleft{
    text-align: left;
    background: #fff;
}
.iconF{
    cursor: pointer;
    position: relative;
}
.iconCk::before{
    content: "\E68C";
    font-size: 12px;
    cursor: pointer;
}
.iconCked.iconCk::before{
    content: "\E67E";
    color: #386b88;
}
.iconDetal{
    display: none;
    position: absolute;
    left: 13px;
    top: -15px;
    background: #ddd;
    padding: 3px;
    border-radius: 2px;
    width: 90px;
}
.iconF:hover .iconDetal{
    display: block;
}
.iconF::before{
    content: "\e708";
    color: #eb8617;
}
.btn_group {
  display: inline-block;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
}
.btn_group > button {
  color: #fff;
  float: left;
  background-color: #82a9bf;
  height: 26px;
  line-height: 26px;
  padding: 0 6px;
  border-right: 1px solid #386b88;
}
.btn_group > button:last-child {
  border-right: 0;
}
.btn_group > button.selected {
  background: -webkit-linear-gradient(#81a9bf, #386b88); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#81a9bf, #386b88); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#81a9bf, #386b88); /* Firefox 3.6 - 15 */
  background: linear-gradient(#81a9bf, #386b88); /* 标准的语法 */
}
.btn-wrap {
  margin-bottom: 1.166667rem;
}
.add_flow_content {
  margin: 4rem 8rem;
}
table {
  width: 100%;
}
.table-wrap {
  /* width: 60%;
  min-width: 75rem; */
}

.model-content li {
  margin: 0.833333rem 0;
  font-size: 14px;
}
.model-btn-wrap {
  text-align: center;
  margin-top: 4.166667rem;
}
.model-btn-wrap button:nth-child(1) {
  margin-right: 4.333333rem;
}
.model-content .add_flow_content P {
  font-size: 24px;
  color: #386b88;
  text-align: center;
  margin-bottom: 30px;
}
.like_select {
  position: relative;
}
.like_select .StoreSelect {
  position: absolute;
  right: 1.166667rem;
  top: 2px;
  width: 8px;
  height: 8px;
  border-right: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  transform: rotate(45deg);
  cursor: pointer;
  transition: all 0.2s linear;
  transform-origin: 75% 75%;
}
.like_select .StoreSelect.Cliked {
  transform: rotate(-135deg);
}
.AboutBranch {
  position: absolute;
  left: 0%;
  top: 1.833333rem;
  z-index: 1000;
  background: #fff;
}
</style>


