<template>
    <div class="addReceipt">
        <div v-if="isShop">
        <div class="clearfix" :style="{overflow:'hidden'}" >
            <div class="left leftaddReceipt" ref="father">
                <header>
                    <span>会员选择：</span>
                    <span class="selectemp">
                        <Input placeholder="选择会员(输入名称/编号/手机)" :value="cCodeOrNameOrPhone"   :widths="'240px'" :focus="focus" :blur="blur" :onkeyup="onkeyup"/>
                        <span class="sousuo" @click="ReceiptClick" :class="{active:focusActive}">
                            <i class="icon iconss"></i>
                        </span>
                        <el-collapse-transition>
                            <div class="shopNotes" v-show="shopNotesShow">
                                <header>今日已到店的会员</header>
                                <el-table :data="shopNotes" border style="width: 100%" :show-header="false" @row-click="sureselectReceipt">
                                    <el-table-column  prop="cName" label="" width="120">
                                        <template slot-scope="scope">
                                            {{scope.row.cName+"("+scope.row.cCode+")"}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column  prop="cPhone" label="" width="120"></el-table-column>
                                    <el-table-column  prop="levName" label="" width="120"></el-table-column>
                                    <el-table-column  prop="updateTime" label="" width="120">
                                        <template slot-scope="scope">
                                            {{$dateFormat("hh:mm:ss",scope.row.updateTime)}}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-transition>
                        <el-collapse-transition>
                            <div class="shopNotes" v-show="shopReceiptShow">
                                <header>为您找到相关结果{{CustomerDatas.length}}个</header>
                                <el-table :data="CustomerDatas" border style="width: 100%" :show-header="false" @row-click="sureselectReceipt">
                                    <el-table-column  prop="cName" label="" width="120">
                                        <template slot-scope="scope">
                                            {{scope.row.cName+"("+scope.row.cCode+")"}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column  prop="cPhone" label="" width="120"></el-table-column>
                                    <el-table-column  prop="levName" label="" width="120"></el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-transition>
                    </span>
                    <span class="padd">
                        <Button Name="添加新会员" @click.native="gotoAdd" class="" :iconadd="iconadd" buttonClass="Btn"/>
                    </span>
                </header>
                <div class="custmer">
                    <p>会员账户及可用余额信息：</p>
                     <el-table :data="datas" border style="width:100%" :empty-text="'请先选择会员'">
                        <el-table-column prop="acctinfoTypeName" label="账户类型" width="200"></el-table-column>
                        <el-table-column prop="accCurAmount" label="余额" width="120">
                            <template slot-scope="scope">
                                <span class="cormount">{{scope.row.accCurAmount}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="accCurCashcou" label="赠送余额" width="120">
                            <template slot-scope="scope">
                                <span class="cormount">{{scope.row.accCurCashcou}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width='1'></el-table-column>
                    </el-table>
                    <div class="custmerlimit" v-show="cName">
                        本月已充值<i class="cormount">{{thisMonthReceTotTimes}}</i>次共计<i class="cormount">{{thisMonthPayTotleAmount}}</i>元
                        <span v-show="residueMonthReceiptAmount>0">
                            ，本次最大可充值<i class="cormount">{{residueMonthReceiptAmount}}</i>元
                        </span>
                    </div>
                </div>
            </div>
            <div class="right rightaddReceipt" >
                <div class="kfdetail clearfix">
                    <div class="left" @click="showInfo">
                        <img src="../../../../../static/img/header.png" alt="">
                        <span class="cName" v-show="cName">{{cName}}
                            <span class="grade" v-show="levName">{{levName}}</span>
                            <br/>
                            <span class="cCode">{{cCode}}</span>
                        </span>

                    </div>
                </div>
                <div class="emps selectedposition clearfix" v-show="empPerIsCan">
                    <Button Name="选择业绩员工" @click.native="addemployee" class="left" :iconadd="iconadd" buttonClass="Btn"/>
                    <ul>
                        <li v-for="(items,index) in employees" @click="deleteEmps(item,index)">{{items.empName}}
                            <i class="icon iconClose"></i>
                        </li>   
                    </ul>
                </div>
                <div class="remark">
                    收款备注：
                    <div>
                        <Textarea @sonTextarea="upTextarea" widths="100%"/>
                    </div>
                </div>
                 <div class="footer">
                    <span class="Billing" @click="submit">收款</span>
                </div>
            </div>
        </div>
        <div class="border" v-show="false">
            <div class="padd">
                <span class="Name"><i class="icon iconsign"></i>会员选择</span>
                <Input placeholder="选择会员" :readonlys="readonlys" class="selectReceipt" @click.native="ReceiptClick" :value="InputValue" :widths="ipwidth"/>
                <Button Name="添加新会员" @click.native="gotoAdd" class="right" :iconadd="iconadd"/>
            </div>
            <div class="detail clearfix">
                <div class="tCenter">
                    <img src="../../../../../static/img/LoginBg.jpg" alt="">
                    <div >
                        <span class="berName">{{cName}}</span><br/>
                        <span class="grade" v-show="levName">{{levName}}</span>
                    </div>
                </div>
                <div class="sum clearfix">
                    <div class="Cell fisrt">
                        <span class="">可用总余额</span>
                        <!-- <div class="">{{(accCurAmount+accCurCashcou).toFixed(2)}}</div> -->
                    </div>
                    <div class="Cell second">
                        <span class="">可用实付余额</span>
                        <!-- <div class="">{{accCurAmount.toFixed(2)}}</div> -->
                    </div>
                    <div class="Cell third">
                        <span class="">可用赠送余额</span>
                        <!-- <div class="">{{accCurCashcou.toFixed(2)}}</div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="employee border"  v-show="false">
            <header class="padd">
                <span class="Name">
                    <i class="icon iconsign"></i>员工选择
                </span>
                <Button Name="添加业绩员工"  class="right" :iconadd="iconadd" @click.native="addemployee"/>
            </header>
            <div class="detail">
                <Table :datas="employees" :Tbody="Tbody" :TabelHeader="TabelHeader" :yesDetail="yesDetail" :widthValue="'500px'" :showKong="showKong" :Not="Not" Detail="删除" :gotoDetail="deleteemployee"/>
            </div>
            
        </div>
        <div class="remark border"  v-show="false">
            <div class="Name padd">
                    <i class="icon iconsign"></i>备注：
            </div>
            <div class="detail">
                <Textarea @sonTextarea="upTextarea"/>
            </div>
            
        </div>
        <div class="footer"  v-show="false">
            <Button buttonClass="None" Name="取消" @click.native="cancle"/>
            <Button Name="收款" @click.native="submit"/>
        </div>
        <AboutPeople :RadioPeople="Radio"  :AboutPeopleSelected="AboutStoreSelected" v-if="modelemployee" :submit="sureemployee" :SelectedData="yuEmployees" :canclefun="canclefun" :corpShow="corpShow" :sCodeShow="sCodeShow"/>
    </div>
    <noShop v-if="!isShop"/>        
    </div>
</template>
<script>
    import Input from "../../../common/Input"
    import Button from "../../../common/Button"
    import Table from "../../../common/Table"
    import Paging from "../../../common/Paging"
    import AboutPeople from "../../../common/AboutPeople"
    import Textarea from "../../../common/Textarea"
    import noShop from "../../../common/noShop"
    import {mapMutations} from "vuex"
    export default {
        name:"addReceipt",
        components: {
            Input,Button,Table,Paging,AboutPeople,Textarea,noShop
        },
        data(){
            return{
                cCodeOrNameOrPhone:"",
                shopNotesShow:false,
                focusActive: false,
                shopReceiptShow:false,
                shopNotes: [],
                CustomerDatas:[],
                datas:[],
                isShop:true,//是否有所属门店
                corpShow:false,//部门权限
                sCodeShow:false,//门店权限
                Not:true,
                showKong:false,
                yesDetail:true,
                iconadd:true,
                ipwidth:"160px",
                Radio:false,
                modelemployee:false,
                employees:[],//选中的员工
                TabelHeader:[
                    {detail:"员工姓名",width:"200px"},
                    {detail:"员工等级",width:"200px"},
                    {detail:"",width:"100px"},
                    ],
                Tbody:["empName","position"],
                perfEmpCodes:[],
                yuEmployees:[],//预选中的员工
                readonlys:true,
                InputValue:"",
                id:"",
                cName:"",
                levName:"会员等级",
                cCode:"",
                remark:"",//备注
                accCurAmount:0,//可用实际余额
                accCurCashcou:0,//可用赠送余额
                empPerIsCan:false,
                thisMonthReceTotTimes:0,//本月充值总次数
                thisMonthPayTotleAmount:0,//本月充值总金额
                residueMonthReceiptAmount:0,//本月充值剩余额
            }
        },
        beforeRouteLeave(to, from, next) {
            if(to.path=="/NavDetail/Payment"||to.path=="/NavDetail/customerDetails"){
                this.updateAlives({name:"addReceipt",key:1})
            }else{
                this.updateAlives({name:"addReceipt"});
                this.$destroy();
                // this.updateAlives({name:"addOrder"})
            }
            next()
        },
        methods: {
            ...mapMutations(["updateAlives"]),
            deleteEmps(item,index){
                this.employees.splice(index,1);
            },
            showInfo(){
                if(this.cCode){
                    this.$router.push({
                        path:"/NavDetail/customerDetails",
                        query:{
                            id:this.id,
                            code:this.cCode
                        }
                    })
                }
            },
            // 会员聚焦
            focus() {
                this.focusActive = true;
                if (!this.cCodeOrNameOrPhone && this.shopNotes.length > 0) {
                    this.shopNotesShow = true;
                }
            },
            // 会员失去焦点
            blur() {
                this.focusActive = false;
                setTimeout(() => {
                    this.shopNotesShow = false;
                }, 250);
            },
            onkeyup(value) {
                console.log(value.target.value);
                if (value.keyCode == 13) {
                    //回车事件
                    this.ReceiptClick();
                }
                this.cCodeOrNameOrPhone = value.target.value;
                if (value == "") {
                    this.shopNotesShow = true;
                    this.shopReceiptShow = false;
                } else {
                    this.shopNotesShow = false;
                }
            },
            // 取消
            cancle(){
                history.go(-1);
            },
            upTextarea(value){
                this.remark=value;
            },
            submit(){
                if(this.$stop()){return}//阻止双击的调用。
                this.employees.map(el=>{
                    this.perfEmpCodes.push(el.workNo)
                });
                if(this.cCode==""){
                    this.$message({
                        type:"info",
                        message:"请选择会员"
                    });
                    return;
                }
                let data={
                    cCode:this.cCode,
                    remark:this.remark,
                    perfEmpCodes:this.perfEmpCodes
                }
                this.$post(this.$host+"/api/order/receiptbill/create",data).then(d=>{
                    if(d.success){
                        this.$router.push({
                            path:"/NavDetail/Payment",
                            query:{
                                rcptNo:d.rcptNo
                            }
                        })
                    }
                })
            },
            //删除选中的员工
            deleteemployee(item,index){
                this.employees.splice(index,1);
            },
            //确认选择的员工
            sureemployee(items){
                this.modelemployee=false;
                items.map(el=>{
                    el.active=false;
                });
                this.employees=items;
                console.log(items);
            },
            canclefun(){
                this.modelemployee=false;
            },
            AboutStoreSelected(){},
            // 点击添加业绩员工
            addemployee(){
                this.modelemployee=true;
                this.yuEmployees=this.deepCopy(this.employees);
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
            //去添加新会员
            gotoAdd(){
                this.$router.push({
                    path:"/NavDetail/addCustomer",
                    query:{
                        resurl:"/NavDetail/addReceipt"
                    }
                })
            },
            handleCurrentChange(index){},
            ReceiptClick() {
                if (this.cCodeOrNameOrPhone == "") {
                    this.$message({
                    type: "info",
                    message: "请输入查询条件"
                    });
                    return;
                }
                let data = {
                    pageNumber: 1,
                    pageSize: 100,
                    cCodeOrNameOrPhone: this.cCodeOrNameOrPhone
                };
                this.$post(this.$host + "/api/cust/customer/page", data).then(d => {
                    if (d.success) {
                    let content = d.data.content;
                    this.CustomerDatas = content;
                    this.shopReceiptShow = true;
                    }
                });
                },
            // 确定选择会员弹框
            sureselectReceipt(item){
                console.log(item)
                this.shopReceiptShow=false;
                if(!item.id){return;}
                this.InputValue=item.cName+"("+item.cCode+")";
                this.id=item.id;
                this.$post(this.$host+"/api/cust/customer/acctshow",{id:item.id,cCode:item.cCode}).then(d=>{
                    if(d.success){
                        this.cCodeOrNameOrPhone="";
                        this.employees=[];
                        this.perfEmpCodes=[];
                        this.cName=d.cName;
                        this.cCode=d.cCode;
                        this.empPerIsCan=d.empPerIsCan;
                        this.levName=d.levName;
                        this.thisMonthReceTotTimes=d.thisMonthReceTotTimes||0;
                        this.thisMonthPayTotleAmount=parseFloat(d.thisMonthPayTotleAmount).toFixed(2)||0;
                        this.residueMonthReceiptAmount=parseFloat(d.residueMonthReceiptAmount).toFixed(2)||0;
                        this.accCurAmount=(parseFloat(d.accCurAmount)).toFixed(2)||0.00;
                        this.accCurCashcou=(parseFloat(d.accCurCashcou)).toFixed(2)||0.00;
                        let newobj = new Object();
                        newobj.acctinfoTypeName=d.acctinfoTypeName;
                        newobj.accCurAmount=this.accCurAmount;
                        newobj.accCurCashcou=this.accCurCashcou;
                        this.datas=[];
                        this.datas.push(newobj);
                    }
                })
                console.log(item)
            },
        },
        mounted () {
            if(this.$getCookie("belongShop")){
                let cCode=this.$route.query.cCode||"";
                if(cCode){
                    let item={
                        cCode:cCode,
                        cName:this.$route.query.cName||"",
                        id:this.$route.query.id||"",
                    }
                    this.sureselectReceipt(item);
                }
                // 获取已到店的用户
                this.$post(this.$host + "/api/cust/dateBill/findDateBillCustomers", {
                }).then(d => {
                if (d.success) {
                    this.shopNotes = d.data || [];
                }
                });
                this.updateAlives({name:"addReceipt",key:1});
                let auths = JSON.parse(this.$getSession("auths"));
                auths.map(el => {
                    if (el.fParentCode == "F060") {//预存收款的权限
                        if (el.fUrl == "corp") {
                            this.corpShow = true;
                        }
                        if (el.fUrl == "sCode") {
                            this.sCodeShow = true;
                        }
                    }
                })
            }else{
                this.isShop=false;
            }
        }
    }
</script>
<style scoped >
.cName{
    display: inline-block;

}
.custmerlimit{
    text-align: center;
    padding-top: 12px;
}
.cormount{
    color: #ff962f;
}
.cCode{
    font-size: 12px;
}
.selectedposition{
    padding: 8px 0;
    padding-left: 12px;
}
.selectedposition ul {
    float: left;
}
.custmer{
    padding-right: 12px;
    padding-top: 12px;
}
.selectedposition ul li{
    display: inline-block;
    padding: 0 0.5rem;
    height: 2rem;
    line-height: 2rem;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    margin: 0 12px 0 0;
    color: #999999;
    background: #f4f4f4;
}
.iconClose::before {
    content: "\E61A";
    cursor: pointer;
}
.sousuo{
    position: absolute;
    right: 0;
    top: 1px;
    border-left: 1px solid #dcdfe6;
    width: 26px;
    height: 26px;
    text-align: center;
    cursor: pointer;
}
.iconss::before {
    content: "\E632";
}
.selectemp{
    position: relative;
    display: inline-block;
}
.shopNotes {
    position: absolute;
    background: #fff;
    z-index: 100;
}
.shopNotes header{
    background: #fafafa;
    border: 1px solid #efefef;
    border-bottom: none;
}
    .iconsign::before{
        content: "\e62d";
    }
    .footer{
        text-align: center;
    padding: 24px 10px;
    }
    .footer button{
        margin-right:2rem;
    }
    .footer .Billing {
    font-size: 18px;
    color: #fff;
    text-align: center;
    background: #2cbcc8;
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    display: inline-block;
    width: 40%;
}
.footer .Billing:hover {
    background: #7ad0d8;
}
    .remark{
        margin-top:12px;
        padding-left: 12px;
    }
    .padd {
        padding-left: 24px;
    }
    .addReceipt{
        margin-top: -14px;
    }
    .kfdetail {
    border-bottom: 1px solid #efefef;
}
.kfdetail .left {
    color: #ab9ee6;
    font-size: 14px;
    cursor: pointer;
}
.kfdetail .left img{
    width: 48px;
    border-radius: 50%;
    margin: 6px;
}
    .leftaddReceipt{
    width: 70%;
    padding-top: 14px;
    margin-bottom: -3000px;
    padding-bottom: 3000px;
}
.rightaddReceipt {
    margin-bottom: -3000px;
    padding-bottom: 3000px;
    width: 30%;
    border-left: 1px solid #dcdfe6;
}
    .tCenter{
        text-align: center;
        padding-top: 2rem;
    }
    .berName{
        color: #ab9ee6;
        font-size: 18px;
    }
    .grade{
        color: #ffffff;
        background: #ab9ee6;
        border-radius: 10px;
        padding: 4px 8px;
        font-size: 12px;
    }
    .border{
        border: 1px solid #ccc;
        width: 900px;
    }
    .border .right{
        float: right;
        margin-top: 6px;
    }
    .Name{
        color: #2cbcc8;
        font-size: 18px;
    }
    .selectReceipt{
        cursor: pointer;
    }
    .employee{
        margin-top: 3.333333rem;
    }
    .employee ul li{
        float: left;
        border: 1px solid #ccc;
        padding: 5px ;
        cursor: pointer;
    }
    .employee ul li:hover{
        border: 1px solid #4db0e8;
        color: #4db0e8;
    }
    .employee ul li .iconF::before{
        content: "\E61A";
    }
    .detail{
        vertical-align: middle;
        border-top: 1px solid #ccc;
        padding:2rem 1rem;
    }
    .detail .Cell{
        float: left;
        width: 160px;
        height: 80px;
        text-align: center;
        border-radius: 4px;
        font-size: 16px;
        color: #ffffff;
        padding: 20px;
        margin-right: 80px;
    }
    .detail .Cell:last-child{
        margin-right: 0;
    }
    .detail .Cell.fisrt{
        background: #74b2e8;
    }
    .detail .Cell.second{
        background: #a88cd5;
    }
    .detail .Cell.third{
        background: #5dc292;
    }
    .sum{
        margin: 2rem auto;
        width: 640px;
    }
    .detail img{
        width: 80px;
        border-radius: 100%;
    }
</style>