<template>
  <div class="OpenCardAdd clearfix">
      <div class="OpenCardAddLeft left">
            <header>
                <span>会员选择：</span>
                <span class="selectemp">
                    <Input placeholder="选择会员(输入名称/编号/手机)" widths="240px" :value="cCodeOrNameOrPhone" :focus="focus"  @sonInput="upInput" :blur="blur" :onkeyup="onkeyup"/>
                    <span class="sousuo" @click="ReceiptClick" :class="{focusActive:focusActive}">
                        <i class="icon iconss"></i>
                    </span>
                    <el-collapse-transition>
                    <div class="shopNotes" v-show="shopNotesShow">
                        <header>今日已到店的会员</header>
                        <el-table :data="shopNotes" border style="width: 100%" :show-header="false" @row-click="handleRowHandle">
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
                        <el-table :data="CustomerDatas" border style="width: 100%" :show-header="false" @row-click="handleRowHandle">
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
                <span class="newcustmer">
                    <Button Name="添加新会员" @click.native="AddedUser" :iconadd="true" small="Btn"/>
                </span>
            </header>
            <div class="ProductSEarch">
                    <span class="SEarchAll" :class="{Lookall:Lookall}" @click.stop="SeeAll">全部</span>
                    <span class="selectemp">
                        <Input placeholder="输入名称/编号" widths="240px" arguName="prodKey" :value="prodKey" @sonInput="sonInput" :focus="profocus" :onkeyup="proonkeyup" :blur="problur"/>
                        <span class="sousuo" @click="Search" :class="{focusActive:proActive}">
                            <i class="icon iconss"></i>
                        </span>
                    </span>
                    <ul class="lists clearfix">
                        <li v-for="item in lists" :class="{active:item.active}" @click.stop="toggleTk(item)">{{item.cateName}}</li>
                    </ul>
            </div>
            <ul class="SetCardList clearfix">
                    <li v-for="(item,index) in SetCardData" @click.stop="AddCard(index,item)">
                        <div class="cardImg">
                            <img :src="item.prodImg?item.prodImg:'../../../../static/img/img.png'">                            
                        </div>
                        <div class="CardContentBox">
                            <span class="berName ">{{item.tkName}}</span><br/>
                            <span class="CardText">原价：</span><span class="grade">￥{{item.price}}</span><br/>
                            <span class="CardText">折后价：</span><span class="grade">￥{{item.disPrice}}</span>
                        </div>
                    </li>
            </ul>
      </div>
      <div class="OpenCardAddRight right">
            <div class="detail" >
                <img src="../../../../static/img/header.png" class="ConentImg" @click.stop="showInfo">
                <span class="customerName" @click.stop="showInfo">{{InputValue}}</span>
            </div>
            <ul>
                <li class="tkList clearfix" v-for="(item,index) in tkList">
                    <div class="left tkListImg">
                        <img :src="item.prodImg?item.prodImg:'../../../../static/img/img.png'"  >
                    </div>
                    <div class="right">
                        <div class="clearfix">
                            <span class="left">{{item.tkName}}</span>
                            <i class="icon right icondelete" @click.stop="Delete(index,item)"></i>
                        </div>
                        <div class="clearfix">
                            <span class="grade left">￥{{item.disPrice}}</span>
                            <span class="right">
                                <el-input-number v-model="item.saleNum" size="mini" :min="1" ></el-input-number>
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="selectedposition clearfix">
                <Button Name="选择开卡员工"  @click.native="addtkList" class="left" :iconadd="true" buttonClass="Btn"/>
                <ul class="left kkstaff">
                    <li v-for="(item,index) in employees" >{{item.empName}}
                        <i class="icon iconClose" @click.stop="DeleteEmps(index,item)"></i>
                    </li>
                </ul>
            </div>
            <div class="clearfix positions">
                <div class="left" @click.stop="checkYH">
                    <i class="icon unchecked" :class="{checked:checkedYH}"></i>优惠券
                </div>
                <span class="Integral" v-show="checkedYH">-￥{{cashcouAmount ||'0.00'}}</span>
                <div class="right" @click.stop="SetYH">
                    <i v-show="checkedYH">>></i>
                </div>
                <!-- <div v-show="pointSynCoupon || Single" class="right" @click.stop="SetYH">
                    <i v-show="checkedYH">>></i>
                </div> -->
                <!-- <div v-if="accCurCashcou<=0"  class="right">无可用</div> -->
            </div>
            <div class="clearfix positions">
                <div class="left"  @click.stop="checkJF">
                    <i class="icon unchecked" :class="{checked:checkedJF}"></i>积分抵扣
                </div>
                <span class="Integral" v-show="checkedJF">-￥{{accIntegralamount ||'0.00'}}</span>
                <div v-if="!pointSynCoupon"  class="right">无可用</div>
                <div v-if="pointSynCoupon" class="right" @click.stop="SetJF">
                    <i v-show="checkedJF">>></i>
                </div>
            </div>
            <div class="remark">
                开卡备注：
                <div>
                    <Textarea @sonTextarea="sonTextarea" arguName="Textarea" style="width:100%"/>
                </div>
            </div>
            <div class="footer">
                <span class="actAmount">应收金额：￥{{accAmount ||'0.00'}}</span>
                <span class="Billing" @click.stop="Cashier">开卡</span>
                <!-- <span class="Billing" @click.stop="Cashier">{{accAmount>accCurAmount?'收款':'保存'}}</span> -->
            </div>
      </div>
      <AboutPeople :RadioPeople="false" v-show="modelemployee" :submit="submit" :SelectedData="Employees" :canclefun="canclefun" :corpShow="corpShow" :sCodeShow="sCodeShow"/>
      <Mtk v-show="infoShow"/>
      <div v-show="infoShow" class="modelinfo">
            <header class="InfoHeader"> 客户信息<i class="icon Fork Postion" @click="hideInfo"></i> </header>
            <div class="Tcontent">
                <img src="../../../../static/img/header.png" class="InfoImg">
                <div class="customerName">{{customerName}}</div>
                <div class="grade">{{levelName}}</div>
                <div class="contentBox clearfix">
                    <div class="Cell">
                        <span class="">可用实付余额：</span>
                        <div class="grade">{{accCurAmount}}</div>
                    </div>
                    <div class="Cell">
                        <span class="">可用赠送余额：</span>
                        <div class="grade">{{accCurCashcou}}</div>
                    </div>
                    <div class="Cell">
                        <span class="">可消耗套卡：</span>
                        <div class="grade">{{tkCount}}张</div>
                    </div>
                    <div class="Cell">
                        <span class="">可消耗服务：</span>
                        <div class="grade">0项</div>
                    </div>
                    <div class="Cell">
                        <span class="">可用优惠券：</span>
                        <div class="grade">0张</div>
                    </div>
                    <div class="Cell">
                        <span class="">可用积分：</span>
                        <div class="grade">{{accIntegral}}分</div>
                    </div>
                </div>
            </div>
      </div>
      <Mtk v-show="YHIsShow"/>
      <div v-show="YHIsShow" class="JFBox">
            <div class="JFHeader">优惠卷金额抵扣<i class="icon Fork Postion" @click.stop="cancel"></i></div>
            <div class="JFBoxContent">
                <p class="ZHJF">账户优惠金额:{{accCurCashcou || '0'}}</p>
                <span>本次使用</span>
                <Input widths="10rem" arguName="cashcouAmount" :value="cashcouAmount" :onkeyup="getcashcouAmount" />
                <span>抵扣￥{{cashcouAmount ||'0.00'}}</span>
            </div>
            <div class="JFBoxBtn">
                <!-- <Button Name="取消" class="None" @click.native="cancel"/>                     -->
                <Button Name="确定" @click.native="cashcouAmountSave"/>
            </div>
      </div>
      <Mtk v-show="JFIsShow"/>
      <div v-show="JFIsShow" class="JFBox">
            <div class="JFHeader">积分抵扣<i class="icon Fork Postion" @click.stop="cancel"></i></div>
            <div class="JFBoxContent">
                <p class="ZHJF">账户积分：{{accIntegral || '0'}}</p>
                <span>本次使用</span>
                <Input  :readonlys="!pointSynCoupon" arguName="AccIntegral" :value="AccIntegral" :onkeyup="getAccIntegral" widths="10rem" />
                <span>抵扣￥{{accIntegralamount||'0.00'}}</span>
            </div>
            <div class="JFBoxBtn">
                <!-- <Button Name="取消" class="None" @click.native="cancel"/>                     -->
                <Button Name="确定" @click.native="AccIntegralSave"/>
            </div>
      </div>
  </div>
</template>

<script>
import Input from "../../common/Input"
import Button from '../../common/Button'
import Textarea from "../../common/Textarea"
import Mtk from '../../common/Mtk'
import {mapMutations} from "vuex"
export default {
    name:"OpenCardAdd",
    components:{Input,Button,AboutPeople:resolve => {require(['../../common/AboutPeople'],resolve)},Textarea,Mtk},
    data(){
        return{
            corpShow:false,//部门权限
            sCodeShow:false,//门店权限
            shopNotes:[],//到店用户数组
            shopNotesShow:false,//今日到店会员显示            
            cCodeOrNameOrPhone:'',//客户信息
            focusActive:false,
            proActive:false,
            shopReceiptShow:false,
            CustomerDatas:[],//查找出来的会员
            lists:[],
            pointShow:true,
            InputValue:"",
            infoShow:false,//客户会员是否展示
            cateId:'',
            customerName:'会员名称',//客户名称
            levelName:'会员等级', //客户等级
            tkCount:0,
            accCurAmount:0.00,//当前余额
            accCurCashcou:0.00,//当前赠送金额
            cashcouAmount:0,//赠送金额  优惠卷 要使用的优惠金额            
            // AccCurCashcou:0,//要使用的优惠金额
            pointDeduct:1,//积分兑换比率
            pointSynCoupon:'',//积分优惠券是否同步使用
            Single:true,
            checkedYH:true,//优惠卷
            YHIsShow:false,//优惠卷弹框
            checkedJF:'',//积分
            JFIsShow:false,//积分弹框
            Lookall:true,
            prodKey:"",//产品编号/名称
            cardLis:[],//已选的套卡数组
            // AddcardShow:false,
            SetCardData:[],//全部套卡
            modelemployee:false,
            employees:[],//已选中的员工
            Employees:[],//传入组件的员工
            Textarea:'',//备注
            customerId:'',//客户id            
            cCode:'',//客户code
            sales:'',
            // totalAmount:0,//总金额
            // accAmount:0,//现金金额  
            accIntegral:0,//积分
            AccIntegral:0,//输入的积分            
            tkList:[]
        }
    },
    computed:{
        // 积分抵扣金额
        accIntegralamount(){
            return parseInt(this.AccIntegral/this.pointDeduct*100)/100
        },
        //套卡总价
        totalAmount(){
            if(!this.tkList.length)return
            let Total = 0
            this.tkList.map(e=>{
                Total += e.disPrice*100*e.saleNum
            })
            return Total/100
        },
        //去掉优惠卷和积分价格
        accAmount(){
            if(this.checkedJF && this.checkedYH){
                return (this.totalAmount*100 - this.cashcouAmount*100 - this.accIntegralamount*100)/100
            }else if(this.checkedJF && !this.checkedYH){ //使用积分
                return (this.totalAmount*100  - this.cashcouAmount*100)/100  
            }else if(!this.checkedJF && this.checkedYH){ //优惠卷
                return (this.totalAmount*100  - this.accIntegralamount*100)/100        
            }else{
                return this.totalAmount         
            }
        },

    }, 
    mounted(){
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F061") {//开卡管理的权限
                if (el.fUrl == "corp") {
                    this.corpShow = true;
                }
                if (el.fUrl == "sCode") {
                    this.sCodeShow = true;
                }
            }
        })
        if(this.$route.query.cCode){
            let item=this.$route.query
            this.InputValue=item.cName+"("+item.cCode+")";
            this.cCode = item.cCode
            this.customerId = item.id
            this.Query(item)
            this.findForStore()
        }
        this.updateAlives({name:"OpenCardAdd",key:1})
        //积分兑换比率
        this.$post(this.$host+"api/order/consume/getScoreRules",{}).then(d=>{
            if(d.success){
                if(!d.data.pointDeduct){
                    this.pointShow=false;
                    return;
                }
                this.pointDeduct=parseFloat(d.data.pointDeduct);
                d.data.pointSynCoupon=="true"?this.pointSynCoupon=this.checkedJF=true: this.pointSynCoupon=this.checkedJF=false;
            }
        })
        this.getCustomer()//获取已到店会员
        this.gettags()//产品分类树
        this.findForStore()//默认全部套卡
    },
    beforeRouteLeave(to, from, next) {
        if(to.path=="/NavDetail/Payment"){
            this.updateAlives({name:"OpenCardAdd",key:1})
        }else{
            this.updateAlives({name:"OpenCardAdd"});
            this.$destroy();
        }
        next()
    },
    methods:{
        ...mapMutations(["updateAlives","setDatas"]),
        // 获取已到店的用户        
        getCustomer(){
            this.$post(this.$host+"/api/cust/dateBill/findDateBillCustomers",{}).then(d=>{
                if(d.success){
                    this.shopNotes=d.data||[];
                }
            })
        },
        // 会员聚焦
        focus(){
            this.focusActive=true;
            if(!this.cCodeOrNameOrPhone&&this.shopNotes.length>0){
                this.shopNotesShow=true;
            }
        },
        upInput(value){
            this.cCodeOrNameOrPhone=value;
            if(value==""){
                this.shopNotesShow=true;
                this.shopReceiptShow=false;
            }else{
                this.shopNotesShow=false;
            }
        },
        handleRowHandle(item){
            this.InputValue=item.cName+"("+item.cCode+")";
            this.cCode = item.cCode
            this.customerId = item.id
            this.shopReceiptShow=false;
            this.Query(item)
            this.findForStore()
        },
        Query(item){
            this.$post(this.$host+'/api/cust/accInfo/findByCustomerId/'+item.id,{}).then(d=>{
                if(d.success){
                    this.cCodeOrNameOrPhone = ''; 
                    this.customerName=d.data.customerName//客户名称
                    this.levelName=d.data.levelName //客户等级
                    this.tkCount=d.data.tkCount //套卡数量
                    this.accCurAmount=parseFloat(d.data.accCurAmount)//当前余额
                    this.accCurCashcou=parseFloat(d.data.accCurCashcou)//当前赠送金额
                    this.accIntegral=parseFloat(d.data.accIntegral)//客户当前拥有积分
                }
            })
        },
        // 会员失去焦点
        blur(){
            this.focusActive=false;
            setTimeout(() => {
                this.shopNotesShow=false;
            }, 250);
        },
        onkeyup(value){
            if(value.keyCode==13){//回车事件
                this.cCodeOrNameOrPhone=value.target.value;             
                this.ReceiptClick();
            }
            if(value==""){
                this.shopNotesShow=true;
                this.shopReceiptShow=false;
            }else{
                this.shopNotesShow=false;
            }
        },
        ReceiptClick(){
            if(this.cCodeOrNameOrPhone==""){
                this.$message({
                    type:"info",
                    message:"请输入查询条件",
                    duration: "1000",
                });
                return;
            }
            let data={
                pageNumber:1,
                pageSize:100,
                cCodeOrNameOrPhone:this.cCodeOrNameOrPhone
            }
            this.$post(this.$host+"/api/cust/customer/page",data).then(d=>{
                if(d.success){
                    let content=d.data.content;
                    this.CustomerDatas=content;
                    this.shopReceiptShow=true;
                }
            })
        },
        showInfo(){
            if(this.cCode){
                this.infoShow=true;
            }
        },
        hideInfo(){
            this.infoShow=false;
        },
        sonInput(value,arguName){
            this[arguName] = value
        },
        profocus(){
            this.proActive=true;
        },
        problur(){
            this.proActive=false;
        },
        proonkeyup(value){
            if(value.keyCode==13){
                this.Search()
            }
        },
        getcashcouAmount(value){
            console.log(value.target.value)
            value.target.value=value.target.value.replace(/\D/g,'');
            if(value.target.value>this.accCurCashcou){
                value.target.value=this.accCurCashcou;
                this.cashcouAmount=this.accCurCashcou;
            }else{
                this.cashcouAmount=value.target.value;
            }
        },
        getAccIntegral(value){
            console.log(value.target.value)
            value.target.value=value.target.value.replace(/\D/g,'');
            if(value.target.value>this.accIntegral){
                value.target.value=this.accIntegral;
                this.AccIntegral=this.accIntegral;
            }else{
                this.AccIntegral=value.target.value;
            }
        },
        gettags(){
            this.$post(this.$host+"/api/prod/productcate/tree",{}).then(d=>{
                if(d.success){
                    let list=d.list;
                    list.map(el=>{
                        el.active=false;
                    })
                    this.lists=list;
                }
            })
        },
        Search(){
            if(!this.prodKey)return
            this.findForStore()
        },
        findForStore(){
            let _data = {
                customerId:this.customerId,
                prodKey:this.prodKey,
                prodClass:1,
                cateId:this.cateId,
            }
            this.$post(this.$host+'/api/prod/prtserv/findForStore',_data).then(d=>{
                if(d.success){
                    d.data.map(e=>{e.checked = false,e.saleNum = 1})
                    this.SetCardData = d.data
                }
            })
        },
        SeeAll(){
            if(this.lists.every(e=>{return(!e.active)}))return
            this.lists.map(el=>{
                el.active=false;
            })
            this.Lookall = true;
            this.cateId="";
            this.findForStore();
        },
        toggleTk(item){
            if(item.active){
                this.cateId="";
                this.findForStore();
                item.active=false;
                this.Lookall = !item.active                   
                return;
            }
            this.cateId=item.id;
            this.findForStore();
            this.lists.map(el=>{
                el.active=false;
            })
            item.active=true;
            this.Lookall = !item.active;
        },
        sonTextarea(value,arguName){
            this[arguName]=value
            console.log(value,arguName)
        },
        AddCard(index,item){
            if(!this.cCode){
                this.$message({
                    type:"info",
                    message:"请先选择会员"
                });
                return;
            }
            if(!this.tkList.some(e=>{return(e.prodId == item.prodId)})){
                this.tkList.push(item)
            }
        },
        AddedUser(){
            this.$router.push({
                    path:"/NavDetail/addCustomer",
                    query:{
                        resurl:"/NavDetail/OpenCardAdd"
                    }
                })
        },
        Delete(index,item){
            this.tkList.splice(index,1)
        },
        canclefun(){
            this.modelemployee=false;
        },
        submit(items){
            this.modelemployee=false;
            items.map(e=>{
                if(!this.employees.some(em=>{return(e.workNo == em.workNo)})){
                    this.employees.push(e)
                }
            })
        },
        addtkList(){
            if(!this.cCode){
                 this.$message({
                    type:"info",
                    message:"请先选择会员"
                });
                return;
            }
            if(this.tkList.length<1){
                this.$message({
                    type: 'info',
                    message: '请选择套卡!',
                    duration:"1000",
                });
                return
            }
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
        DeleteEmps(index,item){
            this.employees.splice(index,1)
        },
        checkYH(){
            // if(!this.pointSynCoupon){
            //     this.checkedJF =  this.checkedYH                
            //     this.checkedYH = !this.checkedYH  
            //     this.Single = this.checkedYH                                 
            //     return            
            // }
            this.checkedYH = !this.checkedYH
        },
        checkJF(){
            if(!this.pointSynCoupon){
                // this.Single = this.checkedJF                 
                // this.checkedYH =  this.checkedJF                
                // this.checkedJF = !this.checkedJF  
                return  this.checkedJF = false            
            }
            this.checkedJF = !this.checkedJF
        },
        SetYH(){
            if(!this.checkedYH)return
            this.YHIsShow = true
        },
        cashcouAmountSave(){
            this.cancel()
        },
        SetJF(){
            if(!this.checkedJF)return
            this.JFIsShow = true
        },
        AccIntegralSave(){
            this.cancel()
        },
        cancel(){
            this.YHIsShow = this.JFIsShow = false
        },
        Cashier(){
            if(!this.customerId){
                this.$message({
                    type:"info",
                    message:"请先选择会员",
                    duration:"1000",
                });
                return
            }
            let tkList = []
            this.getCardData(tkList)
            if(tkList.length==0){
                this.$message({
                    type: 'info',
                    message: '请选择套卡',
                    duration:"1000",
                });
                return
            }
            let _data = {
                custId:this.customerId,
                cCode:this.cCode,
                // sales:this.sales, //开卡员工this.employees
                totalAmount:this.totalAmount, //总金额
                cashcouAmount:this.cashcouAmount,//赠送金额  优惠卷
                accIntegral:parseFloat(this.AccIntegral),//积分
                tkList:tkList,
            }
            this.$post(this.$host+'/api/order/ord/createOrder',_data).then(d=>{
                if(d.success){
                    if(d.data.orderNo==1){
                        _data=JSON.stringify(_data);
                        this.$setCookie("jsondata",_data);
                        this.$router.push({path:"/NavDetail/Payment",
                            query:{amount:this.accAmount,resurl:'/NavDetail/OpenCard',id:this.customerId},
                        })
                    }else{
                        this.$message({
                            type: 'success',
                            message: '开卡成功！',
                            duration:"1000",
                            onClose:()=>{
                                this.setDatas({name:"newOpenCard",value:true})
                                this.$router.push({path:'/NavDetail/OpenCard'})
                            }
                        });
                    }
                }
            })
        },
        getCardData(arr){
            this.tkList.map(e=>{
                    let _data = {
                    tkId : e.prodId, //套卡id
                    tkCode : e.tkCode , //套卡code
                    tkName : e.tkName , //套卡名称
                    salePrice : e.price ,//套卡售价
                    saleNum : e.saleNum  ,//套卡数量
                    streetAmount : e.disPrice, //套卡成交价 折扣价
                    discount : e.discount, //套卡折扣
                    psList:[]
                }
                if(e.serList != null){
                    e.serList.map(el=>{
                        _data.psList.push({
                            salePrice : el.serPrice, //服务售价
                            remainTimes : el.times, //服务次数
                            streetAmount : el.serDisPrice, //服务成交价
                            psCode : el.prodCode, //服务code
                            isGift:el.isGift //是否为赠品
                        })
                    })
                }
                arr.push(_data)
            })
        },
    }
}
</script>

<style scoped>
.newcustmer{
    margin-left: 24px;
}
.OpenCardAddLeft{
    width: 70%;
    box-sizing: border-box;
}
.selectemp{
    position: relative;
    display: inline-block;
}
.shopNotes{
    position: absolute;
    background: #fff;
    z-index: 1;
}
.shopNotes header{
    background: #fafafa;
    border: 1px solid #efefef;
    border-bottom: none;
}
.ProductSEarch{
    margin-top: 1.833333rem;
}
.OpenCardAddLeft .iconss::before{
    content: "\e632";
}
.SEarchAll{
    display: inline-block;
    margin-right: 1rem;
    border: 1px solid #efefef;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.Lookall{
    background: #2cbcc8;
    color: #fff;
}
.OpenCardAddLeft .sousuo{
    position: absolute;
    right: 0;
    top: 1px;
    border-left: 1px solid #dcdfe6;
    width: 2.166667rem;
    height: 26px;
    text-align: center;
    cursor: pointer;
}
.sousuo.focusActive{
    border-color:#2cbcc8;
}
.lists{
    margin: 12px 0;
}
.lists li{
    float: left;
    margin-right: 24px;
    padding: 0 10px;
    cursor: pointer;
}
.lists li.active{
    color: #2cbcc8;
}
.SetCardList li{
    width: 15rem;
    float: left;
    margin:0 1rem 1rem 0;
    box-shadow: 0 2px 4px 0 rgba(220,223,230,0.50);
    border-radius: 2px;
}
.cardImg{
    width: 100%;
    cursor: pointer;
    position: relative;
    height: 0;
    overflow: hidden;
    padding-bottom: 75%;
}
.cardImg img{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.CardContentBox{
    padding: .5rem 1rem;
}
.CardText{
    display: inline-block;
    width: 35%;
    text-align: right;
}
.OpenCardAddRight{
    width: 30%;
    border-left: 1px solid #dcdfe6;
    min-height: 100vh;
    height: 100%;
    margin-top: -14px;
}
.detail{
    cursor: pointer;
    border-bottom: 1px solid #efefef;
}
.ConentImg{
    width: 4rem;
    height: 4rem;
    border-radius: 100%;
    margin:6px 12px;
}
.tkListImg{
    width: 7rem;
}
.tkListImg img{
    width: 100%;
    height: 5.333333rem;
}
.icondelete::before{
    content: "\e659";
    color: #1dade2;
    font-size: 14px;
    cursor: pointer;
}
.tkList{
    background: #fafafa;
    padding: 1rem;
    border-bottom: 1px solid #efefef;
}

.tkList > .right{
    width: 100%;
    padding-left: 100px;
    height: 75px;
    margin-top: -58px;
}
.selectedposition{
    padding:8px 0 12px 12px;
    background: #fafafa;
}
.selectedposition .kkstaff li{
    display: inline-block;
    padding: 0 .5rem;
    height: 2rem;
    line-height: 2rem;
    border: 1px solid #efefef;
    border-radius: 2px;
    margin: 0 12px 0 0;
    color: #999999;
    background: #fafafa;
}


.modelinfo{
    width: 50rem;
    height: 33.333333rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index: 1000;
    background: #fff;
    border-radius: 4px;
}
.InfoHeader{
    font-size:1.166667rem; 
    margin:0 1.5rem 1.5rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
    color: #5d717c;
}
.OpenCardAdd .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.Tcontent{
    text-align: center;
}
.InfoImg{
    width: 4rem;
    height: 4rem;
}
.customerName{
    font-size: 14px;
    font-weight: 700;
    color: #AB9EE6;
}
.grade{
    color: #ff962f;
}
.contentBox{
    margin: 2rem auto;
    width: 480px;
    padding-bottom: 20px;
}
 .contentBox .Cell{
    float: left;
    width: 50%;
    padding-bottom: 12px;
}
.contentBox .Cell span{
    float: left;
    width: 50%;
    text-align: right;
}
.iconClose::before{
    content: "\e61a";
    cursor: pointer;
}
.positions{
    background: #fafafa;
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    margin-top: 12px;
    position: relative;
}
.positions .unchecked{
    margin-right: .5rem;
}
.positions .left{
    height: 40px;
    cursor: pointer;
}
.positions .right{
    color: #1DADE2;
    height: 40px;
    cursor: pointer;
}
.positions .right i{
    font-size: 14px;
    vertical-align: baseline;
}
.remark{
    padding: 1rem 0 0 1rem;
}
.Integral{
    position: absolute;
    left: 50%;
    transform: translateX(-50%)
}
.footer{
    text-align: center;
    padding: 24px 10px;
}
.footer .actAmount{
    margin-right: 5%;
    font-size: 20px;
    color: #ff962f;
}
.footer .Billing:hover {
    background: #7ad0d8;
}
.footer .Billing{
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

.JFBox{
    width: 33.333333rem;
    height: 20rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
    border-radius: 4px;
    background: #fff;
    z-index: 1000;
}
.JFHeader{
    font-size: 1.333333rem;
    margin: 0 1.5rem 1.5rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
    color: #5d717c;  
}
.JFBoxContent{
    padding: 0  1.5rem;
    text-align: center;
}
.ZHJF{
    font-size: 1.166667rem;
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
}
.JFBoxBtn{
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%)
}
/* .JFBoxBtn button:first-child{
    margin-right: 2rem;
} */
</style>
