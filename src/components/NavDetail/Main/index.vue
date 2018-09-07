<template>
    <div class="Main clearfix">
        <div class="left">
            <div class="overview">
                <header>今日营业概览</header>
                <ul class="clearfix ">
                    <li >
                        <div class="dateCount" @click="gotodetail('appointment')">
                            <p>{{dateCount}}</p>
                            预约
                            <i class="icon "></i>
                        </div>
                    </li>
                    <li >
                        <div class="custRegCount" @click="gotodetail('arriveStore')">
                            <p>{{custRegCount}}</p>
                            到店
                            <i class="icon "></i>
                        </div>
                    </li>
                    <li >
                        <div class="receipt" @click="gotodetail('receipt')">
                            <p>￥{{parseFloat(receipt).toFixed(2)}}</p>
                            收款金额
                            <i class="icon "></i>
                        </div>
                    </li>
                    <li >
                        <div class="consumeAmount" @click="gotodetail('consumeAmount')">
                            <p>￥{{parseFloat(consumeAmount).toFixed(2)}}</p>
                            消费金额
                            <i class="icon "></i>
                        </div>
                    </li>
                    <li >
                        <div class="newCustomer"  @click="gotodetail('newCustomer')">
                            <p>{{newCustomer}}</p>
                            新客户数
                            <i class="icon "></i>
                        </div>
                    </li>
                    <li >
                        <div class="newVipCustomer"  @click="gotodetail('newVipCustomer')">
                            <p>{{newVipCustomer}}</p>
                            新入会客户数
                            <i class="icon "></i>
                        </div>
                    </li>
                     <li >
                        <div class="refund"  @click="gotodetail('refund')">
                            <p>￥{{parseFloat(refund).toFixed(2)}}</p>
                            退款金额
                            <i class="icon "></i>
                        </div>
                    </li>
                    <li >
                        <div class="totalAchievement"  @click="gotodetail('totalAchievement')">
                            <p>￥{{parseFloat(totalAchievement).toFixed(2)}}</p>
                            总业绩
                            <i class="icon "></i>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="shortcut">
                <header>常用功能快捷入口</header>
                <ul class="clearfix ">
                    <li @click="gotodetail('addappoint')" v-if="type==1">
                        <i class="icon appoint"></i>
                        <p>添加预约</p>
                    </li>
                     <li @click="gotodetail('addorder')" v-if="type==1">
                        <i class="icon order"></i>
                        <p>点单</p>
                    </li>
                    <li  @click="gotodetail('arriveStore')" v-if="type==1">
                        <i class="icon arriveStore"></i>
                        <p>打单签字</p>
                    </li>
                    <li @click="gotodetail('addReceipt')" v-if="type==1">
                        <i class="icon getm"></i>
                        <p>收款</p>
                    </li>
                     <li @click="gotodetail('OpenCardAdd')" v-if="type==1">
                        <i class="icon openc"></i>
                        <p>开卡</p>
                    </li>
                     <li @click="gotodetail('addCustomer')" v-if="type==1">
                        <i class="icon addcust"></i>
                        <p>新增客户</p>
                    </li>
                    <li @click="gotodetail('Arrange')" v-if="type==1">
                        <i class="icon arrange"></i>
                        <p>排班管理</p>
                    </li>
                    <li @click="gotodetail('DailybalanceTotal')" v-if="type==1">
                        <i class="icon daily"></i>
                        <p>营业日结</p>
                    </li>


                    <li @click="gotodetail('DailybalanceTotal')" v-if="type!=1">
                        <i class="icon balanceTotal"></i>
                        <p>日结审核</p>
                    </li>
                    <li @click="gotodetail('Closing')" v-if="type!=1">
                        <i class="icon Closing"></i>
                        <p>财务关帐</p>
                    </li>
                    <li @click="gotodetail('BusinessTotal')" v-if="type!=1">
                        <i class="icon BusinessTotal"></i>
                        <p>营业总汇表</p>
                    </li>
                    <li @click="gotodetail('perforforms')" v-if="type!=1">
                        <i class="icon perforforms"></i>
                        <p>员工业绩报表</p>
                    </li>
                    <li @click="gotodetail('Customer')" v-if="type!=1">
                        <i class="icon Customer"></i>
                        <p>会员管理</p>
                    </li>
                    <li @click="gotodetail('noCustomer')" v-if="type!=1">
                        <i class="icon noCustomer"></i>
                        <p>有效会员报表</p>
                    </li>
                    <li @click="gotodetail('ProductServelist')" v-if="type!=1">
                        <i class="icon ProductServelist"></i>
                        <p>产品管理</p>
                    </li>
                     <li @click="gotodetail('noProductServelist')" v-if="type!=1">
                        <i class="icon noProductServelist"></i>
                        <p>产品分析报表</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right backlog">
            <header>待办事项</header>
            <ul class="clearfix ">
                <li class="clearfix" v-for="(item,index) in detail" @click="gotodetail(item.linkType)">
                    <div class="left">{{index<9?('0'+(index+1)):(index+1)}} | {{item.name}}</div>
                    <div class="right">({{item.value}})</div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dateCount:0,//预约单
            custRegCount:0,//到店客户
            receipt:0,//收款金额
            consumeAmount:0,//消费金额
            newCustomer:0,//新客户数
            newVipCustomer:0,//新入会客户数
            totalAchievement:0,//总业绩
            refund:0,//退款金额
            detail:[],
            type:"",//权限类别
            isShop:false,//非门店用户
        }
    },
    mounted(){
        this.getDatas();
        if(this.$getCookie("belongShop")){
            this.isShop=true;//门店用户
        }
    },
    methods:{
        getDatas(){
            this.$post(this.$host+"/api/store/index/statistics/todaySurvey",{}).then(d=>{
                if(d.success){
                    this.dateCount=d.data.dateCount;
                    this.custRegCount=d.data.custRegCount;
                    this.receipt=d.data.receipt;
                    this.consumeAmount=d.data.consumeAmount;
                    this.newCustomer=d.data.newCustomer;
                    this.newVipCustomer=d.data.newVipCustomer;
                    this.totalAchievement=d.data.totalAchievement;
                    this.refund=d.data.refund;
                    let detail=d.data.detail;
                    this.type=d.data.type||'';
                    detail.map(el=>{
                        switch(el.linkType){
                            case 1:el.name="待开始服务";break;
                            case 2:el.name="待结束服务";break;
                            case 3:el.name="待确认消费";break;
                            case 4:el.name="待填写护理日志";break;
                            case 5:el.name="待分配提成/业绩";break;
                            case 6:el.name="待处理退款";break;
                            case 7:el.name="待处理审批";break;
                            case 8:
                                if(this.type==2||this.type==3){//多门店
                                    el.name="待分配门店会员";
                                }else{
                                    el.name="待分配跟进人会员";
                                }
                                break;
                            case 9:el.name="近期生日会员";break;
                        }
                    })
                    this.detail=detail;
                }
            })
        },
        gotodetail(url){
            switch(url){
                //今日营业概览
                case "appointment":this.$router.push({path:"/NavDetail/appointment"});break;//预约
                case "arriveStore":this.$router.push({path:"/NavDetail/arriveStore"});break;//到店
                case "receipt":this.isShop?this.$router.push({path:"/NavDetail/ReceiptTotaldetail"}):this.$router.push({path:"/NavDetail/receiptforms"});break;//收款
                case "consumeAmount":this.isShop?this.$router.push({path:"/NavDetail/OrderTotaldetail"}):this.$router.push({path:"/NavDetail/Orderforms"});break;//消费
                case "newCustomer":alert("新客");break;//新客
                case "newVipCustomer":alert("新入会");break;//新入会
                case "refund":this.isShop?this.$router.push({path:"/NavDetail/refundTotaldetail"}):this.$router.push({path:"/NavDetail/refundforms"});break;//退款
                case "totalAchievement":alert("营业报表");break;//总业绩
                //常用功能快捷入口
                case "addappoint":this.$router.push({path:"/NavDetail/appointment/addAppointment",query:{type:"_add"}});break;//添加预约
                case "addorder":this.$router.push({path:"/NavDetail/addOrder"});break;//点单
                case "arriveStore":this.$router.push({path:"/NavDetail/arriveStore"});break;//打单签字(暂去到店)
                case "addReceipt":this.$router.push({path:"/NavDetail/addReceipt"});break;//收款
                case "OpenCardAdd":this.$router.push({path:"/NavDetail/OpenCardAdd"});break;//开卡
                case "addCustomer":this.$router.push({path:"/NavDetail/addCustomer"});break;//新增客户
                case "Arrange":this.$router.push({path:"/NavDetail/Arrange"});break;//排班管理
                case "DailybalanceTotal":this.$router.push({path:"/NavDetail/DailybalanceTotal"});break;//营业日结.日结审核
                case "Closing":this.$router.push({path:"/NavDetail/Closing"});break;//财务关帐
                case "BusinessTotal":this.$router.push({path:"/NavDetail/BusinessTotal"});break;//营业总汇表
                case "perforforms":this.$router.push({path:"/NavDetail/perforforms"});break;//员工业绩报表
                case "Customer":this.$router.push({path:"/NavDetail/Customer"});break;//会员管理
                case "noCustomer":alert('暂无');break;//有效会员报表
                case "ProductServelist":this.$router.push({path:"/NavDetail/ProductServelist"});break;//产品管理
                case "noProductServelist":alert('暂无');break;//产品分析报表
                
                //待办事项
                case 1:this.$router.push({path:"/NavDetail/Order",query:{type:'start'}});break;//待开始服务
                case 2:this.$router.push({path:"/NavDetail/Order",query:{type:'end'}});break;//待开始服务
                case 3:this.$router.push({path:"/NavDetail/Order",query:{type:'sure'}});break;//待确认消费
                case 4:this.$router.push({path:"/NavDetail/Order",query:{type:'huli'}});break;//待填写护理日志（已结束，但没填护理日志的消费单）
                case 5:this.$router.push({path:"/NavDetail/ResultsAllot",query:{type:'undistributed'}});break;//待分配提成/业绩
                case 6:this.$router.push({path:"/NavDetail/Refunds",query:{type:'pending'}});break;//待处理退款
                case 7:this.$router.push({path:"/NavDetail/Approve_progress"});break;//待处理审批
                case 8:this.$router.push({path:"/NavDetail/Customer",query:{type:'undistributed'}});break;//待分配跟进人客户
                case 9:this.$router.push({path:"/NavDetail/Customer/recentBirthday"});break;//近期生日客户

            }
        }
    }
}
</script>
<style scoped>
    .Main{
        padding-top: 18px;
        padding-bottom: 48px;
    }
    .Main>.left{
        width: 70%;
    }
    .Main>.right{
        width: 30%;
        padding-left: 20px;
    }
    .overview header,.backlog header,.shortcut header{
        font-size: 24px;
        color: #666666;
        padding-bottom: 18px;
        margin-bottom: -10px;
    }
    .shortcut header{
        padding-bottom: 0;
    }
    .backlog ul{
        border: 1px solid #EFEFEF;
        border-radius: 8px;
    }
    .backlog ul li{
        margin: 0 12px;
        font-size: 14px;
        padding-top: 10px;
        color: #999999;
        border-bottom: 1px solid #EFEFEF;
        cursor: pointer;
    }
    .backlog ul li .right{
        color: #D0021B;
    }
    .overview ul{

    }
    .overview ul li{
        float: left;
        width: 25%;
        min-width:200px;
        font-size: 14px;
        color: #999999;
        padding: 0 10px;
        margin-bottom: 36px;
        cursor: pointer;
    }
    .overview ul li p{
        font-size: 30px;
        margin: 20px 0;
    }
    .overview ul li i{
        font-size: 54px;
        position: absolute;
        right: 0;
        opacity: 0.24;
    }
    .overview ul li>div{
        position: relative;
        border-radius: 8px;
        border: 1px solid #DAF0F6;
        padding-left: 15px;
        padding-bottom: 12px;
    }
    .overview .dateCount{
        border: 1px solid #DAF0F6;
    }
    .dateCount i::before{
        content: "\e658";
        color: #63BED6;
    }
    .overview .custRegCount{
        border: 1px solid #D5EAFF;
    }
    .custRegCount i::before{
        content: "\e642";
        color: #4CA6FF;
    }
    .overview .receipt{
        border: 1px solid #FDEACA;
    }
    .receipt i::before{
        content: "\e645";
        color: #F5A623;
    }
    .overview .consumeAmount{
        border: 1px solid #E4DFFE;
    }
    .consumeAmount i::before{
        content: "\e657";
        color: #8B76F9;
    }
    .overview .newCustomer{
        border: 1px solid  #D6EFF1;
    }
    .newCustomer i::before{
        content: "\e704";
        color: #52BAC3;
    }
    .overview .newVipCustomer{
        border: 1px solid  #E5C7FF;
    }
    .newVipCustomer i::before{
        content: "\e616";
        color:  #9013FE;
    }
    .overview .totalAchievement{
        border: 1px solid  #FDE5EA;
    }
    .totalAchievement i::before{
        content: "\e6a9";
        color:   #F792A7;
    }
    .overview .refund{
        border: 1px solid  #E1D9EF;
    }
    .refund i::before{
        content: "\e6c3";
        color:   #7F60BC;
    }
    .shortcut header{
        
    }
    .shortcut ul li{
        float: left;
        width: 20%;
        font-size: 18px;
        color: #666666;
        position: relative;
        text-align: center;
        margin-top: 64px;
        cursor: pointer;
    }
    .shortcut ul li i{
        font-size: 80px;
        margin-bottom: 40px;
        display: block;
    }
    .shortcut .appoint::before{
        content: "\e651";
        color:   #5AC3C7;
    }
    .shortcut .order::before{
        content: "\e66d";
        color:   #FF8940;
    }
    .shortcut .getm::before{
        content: "\e7bc";
        color:   #F5A623 ;
    }
    .shortcut .openc::before{
        content: "\e66e";
        color:   #58C7F6;
    }
    .shortcut .addcust::before{
        content: "\e714";
        color:   #FD9C78;
    }
    .shortcut .allot::before{
        content: "\e646";
        color:   #8B76F9;
    }
    .shortcut .arrange::before{
        content: "\e66a";
        color:   #CD94E5;
    }
    .shortcut .daily::before{
        content: "\e65b";
        color:   #52BAC3;
    }
    .shortcut .balanceTotal::before{
        content: "\e672";
        color:   #5AC3C7;
    }
    .shortcut .Closing::before{
        content: "\e675";
        color:   #EC6941;
    }
    .shortcut .BusinessTotal::before{
        content: "\e678";
        color:   #F5A623;
    }
    .shortcut .perforforms::before{
        content: "\e7e1";
        color:   #EEB05F;
    }
    .shortcut .Customer::before{
        content: "\e67b";
        color:   #FD9C78 ;
    }
    .shortcut .noCustomer::before{
        content: "\e67c";
        color:   #CD94E5 ;
    }
    .shortcut .ProductServelist::before{
        content: "\e676";
        color:   #58C7F6  ;
    }
    .shortcut .noProductServelist::before{
        content: "\e681";
        color:   #52BAC3  ;
    }
    .shortcut .arriveStore::before{
        content: "\e667";
        color:   #81C689  ;
    }
    
</style>

