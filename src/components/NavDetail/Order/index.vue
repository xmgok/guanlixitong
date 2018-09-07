<template>
    <div class="examine_approve ">
        <div class="search-wraps">
            <ul>
                <li v-if="corpShow">
                    <span>部门:</span>
                     <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr" :widths="'160px'"/>
                </li>
                <li v-if="sCodeShow">
                    <span>门店:</span>
                    <Select :SelecttemData="storeDatas" :values="searchFlow.sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>会员:</span>
                    <Input placeholder="会员编号/姓名/手机" :value="searchFlow.custCodeOrNameOrTel"  arguName="custCodeOrNameOrTel" @sonInput="upInput" />
                </li>
                <li>
                    <span>创建日期:</span>
                    <DateRange @getDateRange="upDateRange" :arguName="times"  :values="timesArr"/>
                </li>
                <li>
                    <span>消费单号:</span>
                    <Input :value="searchFlow.billNo" arguName="billNo" @sonInput="upInput" />
                </li>
                <li>
                    <span>支付方式:</span>
                    <Select :SelecttemData="payTypeDatas" :values="searchFlow.payType" arguName="payType" :SelecttemDetail="['dKey','dValue']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>状态:</span>
                    <Select :SelecttemData="billStatus" :values="searchFlow.billStatus" arguName="billStatus" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'" />
                </li>
                <li>
                    <span>客户签名:</span>
                    <Select :SelecttemData="signStatus" :values="searchFlow.signStatus" arguName="signStatus" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span  >发票状态:</span>
                    <Select :SelecttemData="auditStus" :values="searchFlow.invoiceStatus" arguName="invoiceStatus" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="demand" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="">
            <div class="btn_wrap" v-if="isShop">
                <Button Name='新增'  @click.native="gotoAdd" :iconadd="true"></Button>
            </div>
            <div >
                <el-table :data="datas" border style="width:100%" :fit="false">
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
                    <el-table-column prop="billNo" label="消费单号" width="200">
                        <template slot-scope="scope">
                            <span class="btncor" @click="gotoDetail(scope.row)">{{scope.row.billNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="totalMoney" label="消费总额(￥)" width="120"></el-table-column>
                    <el-table-column  prop="sShortName" label="服务员工" width="120">
                        <template slot-scope="scope">
                            <div :class="{btncor:((scope.row.billStatus!=3)&&isShop&&(scope.row.billStatus!=2))}" @click="gotoService(scope.row,scope.$index)">{{scope.row.servEmp?(scope.row.servEmp):'(未选择)'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="workplcName" label="工位" width="120">
                        <template slot-scope="scope">
                            <div :class="{btncor:((scope.row.billStatus==0)||(scope.row.billStatus==1)||(scope.row.billStatus==4))&&isShop}" @click="gotoWork(scope.row,scope.$index)">{{scope.row.workplcName||'(未选择)'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="psStartTime" label="开始时间" width="200"></el-table-column>
                    <el-table-column  prop="billStatusName" label="订单状态" width="120"></el-table-column>
                    <el-table-column  prop="signStatus" label="客户签名状态" width="120"></el-table-column>
                    <el-table-column  prop="logId" label="日志状态" width="120">
                        <template slot-scope="scope">
                            {{scope.row.logId?'已填写':'未填写'}}
                        </template>
                    </el-table-column>
                    <el-table-column  prop="invoiceStatus" label="发票开具状态" width="120"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="250" v-if="isShop">
                        <template slot-scope="scope" class="rtext" >
                            <div class="rtext">
                                <Button :Name="scope.row.startName" buttonClass="Btn"  v-show="scope.row.startShow" @click.native="handleStartorEnd(scope.row,scope.$index)"/>
                                <i class="borderLeft" v-show="scope.row.startShow&&(scope.row.signShow||scope.row.invoiceShow||scope.row.logShow||scope.row.amendShow||scope.row.backoutShow)"></i>
                                <Button :Name="scope.row.signName" buttonClass="Btn"  v-show="scope.row.signShow" @click.native="suresign(scope.row,scope.$index)"/>
                                <i class="borderLeft" v-show="scope.row.signShow&&(scope.row.invoiceShow||scope.row.logShow||scope.row.amendShow||scope.row.backoutShow)"></i>
                                <Button Name="开票" buttonClass="Btn"  v-show="scope.row.invoiceShow" @click.native="handleClick(scope.row,scope.$index)"/>
                                <i class="borderLeft" v-show="scope.row.invoiceShow&&(scope.row.logShow||scope.row.amendShow||scope.row.backoutShow)"></i>
                                <Button Name="护理日志" buttonClass="Btn"  v-show="scope.row.logShow" @click.native="gotonurseLog(scope.row,scope.$index)"/>
                                <i class="borderLeft" v-show="scope.row.logShow&&(scope.row.amendShow||scope.row.backoutShow)"></i>
                                <Button :Name="scope.row.amendName" buttonClass="Btn"  v-show="scope.row.amendShow" @click.native="gotoupdate(scope.row,scope.$index)"/>
                                <i class="borderLeft" v-show="scope.row.amendShow&&(scope.row.backoutShow)"></i>
                                <Button :Name="scope.row.cancleName"  buttonClass="Btn"  v-show="scope.row.backoutShow" @click.native="canclebillNo(scope.row,scope.$index)"/>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <Paging :handleCurrentChange="gotoPage" :total="total"  class="pagingwidth" :currentPage='searchFlow.pageNumber'/>
        <!-- 服务员工 -->
        <div class="model serviceEmp" v-show="serviceEmpShow">
            <header class="Header clearfix">
                <div class="left">选择服务员工</div>
                <div class="right"><i class="icon iconclose" @click="cancleserviceEmp"></i></div>
            </header>
            <div class="body">
                <el-table :data="serviceEmpDatas" border style="width: 100%">
                    <el-table-column fixed prop="prodName" label="服务项目" width="281"></el-table-column>
                    <el-table-column  prop="cName" label="服务员工" width="281">
                        <template slot-scope="scope">
                            <div class="btncor" @click="gotoemps(scope.$index)">
                                <span v-for="(item,index) in scope.row.servEmp">{{item.name+((scope.row.servEmp.length-1)==index?"":",")}}</span>
                                <span v-if="scope.row.servEmp.length==0">暂无</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="footer">
                <Button Name="取消" buttonClass="None" @click.native="cancleserviceEmp"/>
                <Button Name="确定" @click.native="sureserviceEmp" />
            </div>
        </div>
        <Workplace v-show="WorkplaceShow" :selectWorkplace="selectWorkplace" :cancleWorkplace="cancleWorkplace" :workdatas="workdatas"/>
        <AboutPeople :RadioPeople="Radio"   v-if="modelemployee" :submit="sureemployee" :SelectedData="yuEmployees" :canclefun="canclefun" :isShopStat="1" :corpShow="corpShow" :sCodeShow="sCodeShow"/>
        <Mtk  v-show="WorkplaceShow"/>
        <Mtk  v-show="serviceEmpShow"/>
        <Mtk v-show="receiptDetailShow"/>
        <div class="MTK" v-show="showMtk" @click="HideAll"></div>
    </div>
</template>
<script>
import Vue from "vue";
import Button from "../../common/Button";
import Paging from "../../common/Paging";
import Input from "@/components/common/Input";
import Mtk from "@/components/common/Mtk";
import DateRange from "../../common/DateRange"
import Select from "../../common/Select";
import noShop from "../../common/noShop"
import {mapMutations,mapState} from "vuex"
export default {
    name:"Order",
    components: { Paging, Button, Input, Select,Mtk,DateRange,getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)},
    Workplace:resolve => {require(['../../common/Workplace'], resolve)},AboutPeople:resolve => {require(['../../common/AboutPeople'], resolve)} ,noShop},
    data() {
        return {
            isShop:true,//是否有所属门店
            corpShow:false,//部门权限
            sCodeShow:false,//门店权限
            workdatas:[],
            timesArr:[],
            corpCodeArr:[],
            yuEmployees:[],
            modelemployee:false,
            Radio:false,
            Index:0,
            serviceEmpShow:false,//服务员工弹框
            serviceEmpDatas:[],//服务员工的数据
            WorkplaceShow:false,//工位的显示
            hang:0,
            storeDatas:[],
            storeTotal:1,
            AboutStoreShow:false,
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
            receiptDetail:[],
            times:['createTimeStart','createTimeEnd'],
            payTypeDatas:[
                {key:0,value:"现金"},
                {key:1,value:"支付宝"},
                {key:2,value:"微信"},
                {key:3,value:"POS刷卡"},
            ],
            billStatus:[
                {key:0,value:"待服务"},
                {key:1,value:"服务中"},
                {key:2,value:"已结束"},
                {key:3,value:"已撤销"},
            ],
            signStatus:[
                {key:1,value:"已签名"},
                {key:0,value:"未签名"},
            ],
            auditStus:[
                {key:0,value:"未开票"},
                {key:1,value:"已开票"},
                {key:2,value:"不可开票"},
            ],
            idArr:[],//(批量)财务审核
            datas:[],
            billShow:false,
            signName:"签名确认",
            total:1,
            iptWidth:"120px",
            Lines:10,
            searchFlow:{//搜索条件
                "pageNumber": 1,
                "pageSize": 20,
                billNo:"",
                payType:"",
                billStatus:"",
                signStatus:"",
                invoiceStatus:"",
                createTimeStart:"",
                createTimeEnd:"",
                custCodeOrNameOrTel:"",
                sDistrictCode:"",
                corpCode:this.$getCookie("dept"),
                sCode:this.$getCookie("belongShop"),
            },
            checkedAll:false,
            pageNum:'',
            TabelHeader:[
                {detail:"支付方式",width:"100px"},
                {detail:"支付单号",width:"250px"},
                {detail:"支付金额",width:"100px"},
                {detail:"支付状态",width:"100px"},
                {detail:"支付时间",width:"100px"},
                {detail:"收款设备号",width:"100px"},
                {detail:"备注",width:"100px"},
            ],
            Tbody:["psCode","psName","psPrice","psServTime","psValidTime","psInvalidTime","psStatus"],
        };
    },
    computed: {
        ...mapState(["storesvuex","newOrder","payTypevuex"]),
        timeArr(){
            return [this.searchFlow.createTimeStart,this.searchFlow.createTimeEnd]
        },
    },
    beforeRouteLeave(to, from, next) {
        if(to.path=="/NavDetail/addOrder"){
            this.updateAlives({name:"addOrder"})
        }
        next()
    },
    methods: {
        ...mapMutations(["updateAlives","setDatas"]),
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
        gotoupdate(item){
            if(item.amendName=="取单"){//去取单
                this.$router.push({
                    path:"/NavDetail/addOrder",
                    query:{
                        billNo:item.billNo,
                        update:'update',
                        getbill:"getbill",
                    }
                })
            }else{
                this.$router.push({
                    path:"/NavDetail/addOrder",
                    query:{
                        billNo:item.billNo,
                        update:'update'
                    }
                })
            }
        },
        // 去护理日志
        gotonurseLog(item){
            if(item.logId){//有护理日志，去查看编辑
                this.$router.push({
                    path:"/NavDetail/nurseLog/addNurse",
                    query:{
                        id:item.logId,
                        type:'_see',
                    }
                })
            }else{//去添加护理日志
                
                this.$router.push({
                    path:"/NavDetail/nurseLog/addNurse",
                    query:{
                        billNo:item.billNo,
                        id:"_add",
                        type:'_add',
                        cName:item.cName,
                        cCode:item.cCode,
                        date:item.createTime
                    }
                })
            }
            
        },
        // 撤销订单
        canclebillNo(item){
            if(item.billStatus==4||item.billStatus==5){//挂单的删除
                this.$messagebox.confirm('确定删除！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.$post(this.$host+"/api/order/consume/deleteConsemeBill",{billNo:item.billNo}).then(d=>{
                        if(d.success){
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            if(this.datas.length==1){//当前页就一条数据
                                if(this.searchFlow.pageNumber==1){//当前页就是第一页
                                    this.datas.splice(index,1)
                                    this.total--;
                                }else{
                                    this.searchFlow.pageNumber--;
                                    this.demandFunc(this.searchFlow);
                                }
                            }else{
                                let data =this.searchFlow;
                                this.demandFunc(data);
                            }
                            
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
                return
            }
            this.$router.push({
                path:"/NavDetail/cancleOrder",
                query:{
                    billNo:item.billNo,
                    cCode:item.cCode
                }
            })
        },
        // 关闭服务员工弹框
        cancleserviceEmp(){
            this.serviceEmpShow=false;
        },
        //确定选择服务员工提交
        sureserviceEmp(){
            let newserviceEmpDatas=[];
            this.serviceEmpDatas.map(el=>{
                let newobj=new Object();
                newobj.conDetailId=el.conDetailId;
                newobj.servEmp=el.servEmp;
                newserviceEmpDatas.push(newobj);
            })
            let data={
                billNo:this.billNo,
                servEmpList:newserviceEmpDatas
            }
            this.$post(this.$host+"/api/order/consume/updateServEmp",data).then(d=>{
                if(d.success){
                    this.serviceEmpShow=false;
                    this.datas[this.hang].servEmp=d.data.servEmp;
                }
            })
            console.log(this.serviceEmpDatas)
        },
         //确认选择的员工
        sureemployee(items){
            this.modelemployee=false;
            let newarr=[];
            items.map(el=>{
                let newobj=new Object();
                newobj.workNo=el.workNo;
                newobj.name=el.empName;
                newarr.push(newobj);
            })
            this.serviceEmpDatas[this.Index].servEmp=newarr;
            this.yuEmployees=[];
            console.log(items);
            console.log(this.serviceEmpDatas[this.Index]);
        },
        // 去选择服务员工
        gotoemps(index){
            this.modelemployee=true;
            this.Index=index;
            console.log(index)
        },
        // 点击服务员工列
        gotoService(item,hang){
            if(item.billStatus!=3&&this.isShop&&item.billStatus!=2){
                this.$post(this.$host+"/api/order/consume/consumeServEmp",{billNo:item.billNo}).then(d=>{
                    if(d.success){
                        let data=d.data;
                        data.map(el=>{
                            if(el.servEmp){
                                let arr=el.servEmp.split(",");
                                let newarr=[];
                                arr.map(val=>{
                                    newarr.push({name:val})
                                });
                                el.servEmp=newarr;
                            }else{
                                el.servEmp=[];
                            }
                        })
                        console.log(data)
                        this.serviceEmpDatas=data;
                        this.serviceEmpShow=true;
                        this.billNo=item.billNo;
                        this.hang=hang;
                    }
                })
            }
        },
        // 点击工位列
        gotoWork(item,hang){
            if((item.billStatus==0||item.billStatus==1||item.billStatus==4)&&this.isShop){
                console.log(item);
                this.hang=hang;
                this.getWork(item.storeId)
            }
        },
        getWork(storeId){
            let data={
                storeId:storeId,
            }
            this.$post(this.$host+"/api/order/workplace/select",data).then(d=>{
                if(d.success){
                    let data=d.data;
                    data.map(el=>{
                        el.active=false;
                    })
                    this.workdatas=data;
                    this.WorkplaceShow=true;
                }
            })
        },
        // 选择工位
        selectWorkplace(item){
            console.log(item)
            console.log(this.hang)
            let data={
                id:this.datas[this.hang].id,
                workplacNo:item.workplacNo
            }
            this.$post(this.$host+"/api/order/workplace/update",data).then(d=>{
                if(d.success){
                    this.datas[this.hang].workplcName=item.workplacName;
                    this.cancleWorkplace();
                }
            })
        },
        // 取消工位
        cancleWorkplace(){
            this.WorkplaceShow=false;
        },
        // 开始
        handleStartorEnd(item,index){
            console.log(item)
            if(item.billStatus==0||item.billStatus==4){//开始
                if(item.servEmp==null){
                    this.$message({
                        type:"info",
                        message:"请先选择服务员工",
                    });
                    return;
                }
                if(item.workplcName==null){
                    this.$message({
                        type:"info",
                        message:"请先选择工位",
                    });
                    return;
                }
                
                this.$post(this.$host+"/api/order/workplace/start",{billNo:item.billNo,cCode:item.cCode,billStatus:item.billStatus}).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"服务开始成功"
                        });
                        item.psStartTime=this.$dateFormat("yy-MM-dd hh:mm:ss",new Date());
                        if(item.billStatus=="0"){
                            item.billStatusName="服务中";
                            item.billStatus=1;
                        }else{
                            item.billStatusName="服务中/挂单";
                            item.billStatus=4;
                            item.startShow=false;
                        }
                        item.startName="结束";
                    }
                })
            }else if(item.billStatus==1){
                this.$messagebox.confirm('确认结束？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$post(this.$host+"/api/order/workplace/end",{billNo:item.billNo,cCode:item.cCode}).then(d=>{
                        if(d.success){
                            this.$message({
                                type:"success",
                                message:"服务结束成功"
                            });
                            item.billStatusName="已结束";
                            item.billStatus=2;
                            item.startName="";
                            item.startShow=false;
                            item.signShow=true;
                            item.signName="签名确认";
                            item.logShow=true;
                            item.backoutShow=false;
                            item.amendShow=false;
                        }
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '已取消结束'
                    });
                })
                
            }
        },
        // 签名
        suresign(item,index){
            this.$router.push({
                path:"/NavDetail/sureReceipt",
                query:{
                    billNo:item.billNo,
                    resurl:"/NavDetail/Order"
                }
            })
        },
        resetAll(){
            
            this.corpName="";
            this.sName="";
            this.corpCodeArr=[];
            this.timesArr=[];
            this.searchFlow={
                "pageNumber": 1,
                "pageSize": 20,
                rcptNo:"",
                payType:"",
                billStatus:"",
                signStatus:"",
                auditStus:"",
                invoiceStatus:"",
                createTimeStart:"",
                createTimeEnd:"",
                custCodeOrNameOrTel:"",
                sDistrictCode:"",
                corpCode:this.$getCookie("dept"),
                sCode:this.$getCookie("belongShop"),
            };
            this.getStore();
            console.log(this.searchFlow)
        },
        showStoreFunc(){
            this.StoreCliked=!this.StoreCliked;
            this.AboutStoreShow=!this.AboutStoreShow;
            this.StoreSelectActive=!this.StoreSelectActive;
        },
        getStore(){
            let data={
                pageNumber:1,
                pageSize:1000,
                corpCode:this.searchFlow.corpCode||"",
                queryType:0
            }
            if(this.searchFlow.corpCode==this.$getCookie("dept")){//默认门店（当前部门下的门店）
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
        getCorpStore(value){
            if(this.searchFlow.corpCode!=value[value.length-1]){
                this.searchFlow.corpCode=value[value.length-1];
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
            console.log(this.timesArr)
            if(value){
                this.searchFlow[arguName[0]]=value[0];
                this.searchFlow[arguName[1]]=value[1];
            }else{
                this.searchFlow[arguName[0]]="";
                this.searchFlow[arguName[1]]="";
            }
            
        },
        gotoDetail(item){
            this.$router.push({
                path:"/NavDetail/OrderDetail",
                query:{
                    billNo:item.billNo||""
                }
            })
        },
        gotoPage(index){
            this.searchFlow.pageNumber=parseInt(index);
            this.demandFunc(this.searchFlow);
        },
        gotoAdd(){
            this.$router.push({
                path:"/NavDetail/addOrder"
            })
        },
        demandFunc(data){
            this.$post(this.$host+"/api/order/consume/page", data).then(d => {
                if (d.success) {
                    let content= d.data.content;
                    if(content.length>0){
                        content.map(el=>{
                            el.startShow=false;//开始结束按钮显示
                            el.signShow=false;//签名按钮显示
                            el.invoiceShow=false;//开票按钮显示
                            el.logShow=false;//护理日志按钮显示
                            el.amendShow=false;//修改按钮显示
                            el.backoutShow=false;//撤销按钮显示
                            el.amendName="修改";
                            el.cancleName="撤销";
                            switch(el.invoiceStatus){//财务审核状态
                                case 0:el.invoiceStatus="未开";break;
                                case 1:el.auditStus="已开";break;
                                case 2:el.auditStus="不可开";break;
                            }
                            switch(el.signStatus){//签名状态
                                case 0:el.signStatus="未签名";el.signName="签名确认";break;
                                case 1:el.signStatus="已签名";el.signName="查看签名";break;
                            }
                            switch(el.billStatus){//收款单状态
                                case 0:el.billStatusName="待服务";el.startName="开始";el.startShow=true;el.amendShow=true;el.backoutShow=true;break;
                                case 1:el.billStatusName="服务中";el.startName="结束";el.startShow=true;el.amendShow=true;el.backoutShow=true;break;
                                case 2:
                                        el.billStatusName="已结束";el.logShow=true;el.signShow=true;el.backoutShow=false;
                                        switch(el.invoiceStatus){
                                            case "未开":el.invoiceShow=true;break;
                                        }
                                        switch(el.signStatus){
                                            case "未签名":el.invoiceShow=false;break;
                                            case "已签名":break;
                                        }
                                        break;
                                case 3:el.billStatusName="已撤销";break;
                                case 4:el.billStatusName="待服务/挂单";el.cancleName="删除";el.startName="开始";el.startShow=true;el.amendShow=true;el.amendName="取单";el.backoutShow=true;break;
                                case 5:el.billStatusName="服务中/挂单";el.cancleName="删除";el.startShow=false;el.amendShow=true;el.amendName="取单";el.backoutShow=true;break;
                            }
                            el.psStartTime=this.$dateFormat("yy-MM-dd hh:mm:ss",el.psStartTime);
                            el.createTime=this.$dateFormat("yy-MM-dd",el.createTime);
                            el.totalMoney=parseFloat(el.totalMoney).toFixed(2);
                        })
                    }
                    this.datas=content;
                    this.total = d.data.total;
                }
            });
        },
       
    },
    mounted() {
        // this.updateAlives({name:"Order",key:1})
        this.getStore();
        this.getPayType();
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F062") {//点单消费的权限
                if (el.fUrl == "corp") {
                    this.corpShow = true;
                }
                if (el.fUrl == "sCode") {
                    this.sCodeShow = true;
                }
            }
        });
        if(!this.$getCookie("belongShop")){
            this.isShop=false;
        }        
        
       
    },
    activated(){
            // if(this.newOrder){
                    //查询消费单列表
                    let type=this.$route.query.type||""
                    // this.resetAll();
                    if(type=="start"){//待开始
                        this.searchFlow.billStatus=0
                        this.searchFlow.createTimeStart=this.$dateFormat("yy-MM-dd",new Date());
                        this.searchFlow.createTimeEnd=this.$dateFormat("yy-MM-dd",new Date());
                        this.timesArr=[this.searchFlow.createTimeStart,this.searchFlow.createTimeStart];
                    }else if(type=="end"){//待结束
                        this.searchFlow.billStatus=1
                        this.searchFlow.createTimeStart=this.$dateFormat("yy-MM-dd",new Date());
                        this.searchFlow.createTimeEnd=this.$dateFormat("yy-MM-dd",new Date());
                        this.timesArr=[this.searchFlow.createTimeStart,this.searchFlow.createTimeStart];
                    }else if(type=="sure"){//已结束，未签名
                        this.searchFlow.billStatus=2;
                        this.searchFlow.signStatus=0;
                    }else if(type=="huli"){//待填写护理日志（已结束，但没填护理日志的消费单）
                        this.searchFlow.billStatus=2;
                        this.searchFlow.logStatus=0;
                    }else{
                    }
                    let data =this.searchFlow;
                    this.demandFunc(data);
                    this.setDatas({name:"newOrder",value:false})
            // }
    },
};
</script>
<style scoped>
/*  */
.over{
    overflow-y: auto;
}
.el-table .cell>div{
    overflow: hidden;
    text-overflow: ellipsis;
}
.search-wraps li span:first-child{
    display: inline-block;
    width: 52px;
    text-align: right;
}
.serviceEmp.model{
    width: 600px;
}
.search_wraps li span:first-child {
    display: inline-block;
    width: 60px;
    text-align: right;
}
.body{
    padding: 0 18px;
}

.serviceEmp .footer{
    text-align: center;
    padding: 24px;
}
.serviceEmp .footer button:last-child{
    margin-left: 24px;
}
.iconClose::before{
        content: "\e61a";
        cursor: pointer;
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
.model{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    width: 900px;
    z-index: 1000;
}

.model .header .Name{
    color: #ab9ee6;
}
.caozuo{
    text-align: left;
}
.closemtk::before{
    content: "\e622";
    cursor: pointer;
}
.modeltable{
    border-top: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
    margin-bottom:3.333333rem;
}
.last.modeltable{
    border-left: none;
}
.last.modeltable .table-bordered{
    border-right: none;
}
.last.modeltable .Border{
    border-top: none;
}
.last.modeltable .Border .table-bordered{
    border-right: none;
}
.last.modeltable>header{
    border-left: 1px solid #cccccc;
}
.modelBody{
    padding: 0 100px;
}
.modelBody .buttons{
    padding: 1.333333rem 0;
    text-align: right;
}
.modeltable header{
    border-right: 1px solid #cccccc;
    height: 30px;
    line-height: 30px;
}
.modeltable td{
    height: 30px;
    line-height: 30px;
    padding: 0 0.5rem;
    color: #666666;
    background: #f3f3f6;
}
.Table{
    border-top: 1px solid #cccccc;
}
.Table td{
    border-right: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    width: 25%;
    text-align: right;
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
    content: "\E708";
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
/*  */
.btn_wrap {
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
.model-btn_wrap {
  text-align: center;
  margin-top: 4.166667rem;
}
.model-btn_wrap button:nth-child(1) {
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
<style>

</style>

