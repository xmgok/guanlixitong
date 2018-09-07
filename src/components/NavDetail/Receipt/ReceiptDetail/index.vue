<template>
    <div class="ReceiptDetail">
        <header class="clearfix header">
            <div class="left"><span class="Name">{{receiptDetail.cName}}</span>({{receiptDetail.cCode}})的收款单</div>
            <div class="right buttons" v-if="isShop">
                <Button :Name="receiptDetail.signName" @click.native="togoSign"/>
                <Button :Name="receiptDetail.auditName" @click.native="Check"/>
                <Button :Name="receiptDetail.billName" @click.native="refund" v-show="billShow"/>
            </div>
        </header>
        <div class="modelBody">
            <!-- <div class="buttons">
                <Button :Name="receiptDetail.signName" @click.native="togoSign"/>
                <Button :Name="receiptDetail.auditName" @click.native="Check"/>
                <Button :Name="receiptDetail.billName" @click.native="refund" v-show="billShow"/>
            </div> -->
            <div class="modeltable clearfix">
                <header class="CellHeader">
                    <i class="icon iconsign"></i>基本信息
                </header>
                <table class="Table">
                    <tr>
                        <td>收款单号：</td>
                        <td class="tleft">{{rcptNo}}</td>
                        <td>业务类型：</td>
                        <td class="tleft">收款</td>
                        <td>客户：</td>
                        <td class="tleft">{{receiptDetail.cName}}</td>
                    </tr>
                    <tr>
                        <td>是否内部员工：</td>
                        <td class="tleft">{{receiptDetail.isEmp}}</td>
                        <td>门店：</td>
                        <td class="tleft">{{receiptDetail.sName}}</td>
                        <td>状态：</td>
                        <td class="tleft">{{receiptDetail.billStatus}}</td>
                    </tr>
                    <tr>
                        <td>实付金额：</td>
                        <td class="tleft">{{parseFloat(receiptDetail.amount).toFixed(2)}}</td>
                        <td>赠送金额：</td>
                        <td class="tleft">{{parseFloat(receiptDetail.donateAmount).toFixed(2)}}</td>
                        <td>创建时间：</td>
                        <td class="tleft">{{receiptDetail.createTime}}</td>
                    </tr>
                    <tr>
                        <td>创建人：</td>
                        <td class="tleft">{{receiptDetail.creName}}</td>
                        <td>客户签名时间：</td>
                        <td class="tleft">{{receiptDetail.signTime}}</td>
                        <td>客户签名状态：</td>
                        <td class="tleft">{{receiptDetail.signStatus}}</td>
                    </tr>
                    <tr>
                        <td>财务审核时间：</td>
                        <td class="tleft">{{receiptDetail.auditTime}}</td>
                        <td>财务审核状态：</td>
                        <td class="tleft">{{receiptDetail.auditStus}}</td>
                        <td>业绩员工：</td>
                        <td class="tleft">{{receiptDetail.perEmp}}</td>
                    </tr>
                    <tr>
                        <td>备注：</td>
                        <td class="tleft">{{receiptDetail.remark}}</td>
                        <td></td>
                        <td class="tleft"></td>
                        <td></td>
                        <td class="tleft"></td>
                    </tr>
                </table>
            </div>
            <div class="modeltable clearfix last">
                <header class="CellHeader">
                    <i class="icon iconsign"></i>支付明细
                </header>
                <el-table :data="payFlowList" border style="width: 100%" >
                    <el-table-column  prop="payType" label="方式" width="120"></el-table-column>
                    <el-table-column  prop="serialNo" label="支付单号" width="200"></el-table-column>
                    <el-table-column  prop="amount" label="支付金额" width="120"></el-table-column>
                    <el-table-column  prop="payStatus" label="支付状态" width="120"></el-table-column>
                    <el-table-column  prop="payTime" label="支付时间" width="200"></el-table-column>
                    <el-table-column  prop="machineNo" label="收款设备号" width="120"></el-table-column>
                    <el-table-column  ></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
    import Input from "../../../common/Input"
    import Button from "../../../common/Button"
    export default {
        components: {
            Input,Button
        },
        data(){
            return{
                isShop:true,//是否有所属门店
                readonlys:false,
                rcptNo:"",
                receiptDetail:{},
                billShow:false,
                idArr:[],
                payFlowList:[],
            }
        },
        methods: {
            gotoback(){
                history.go(-1)
            },
            // 去付款
            refund(){
                this.$router.push({
                    path:"/NavDetail/Payment",
                    query:{
                        rcptNo:this.rcptNo
                    }
                })
            },
            // 去签名
            togoSign(){
                this.$router.push({
                    path:"/NavDetail/sureReceipt"
                })
            },
            // 审核
            Check(){
                if(this.receiptDetail.auditName=="审核"){//审核
                    let data={
                        idArr:this.idArr
                    }
                    this.$post(this.$host+"/api/order/receiptbill/approve",data).then(d=>{
                        if(d.success){
                            // this.receiptDetail.auditName=="撤销审核";
                            this.receiptDetail=Object.assign({},this.receiptDetail,{auditName:"撤销审核"})
                        }
                    })
                }else{//取消审核
                    let data={
                        idArr:this.idArr
                    }
                    this.$post(this.$host+"/api/order/receiptbill/approveCancel",data).then(d=>{
                        if(d.success){
                            this.receiptDetail=Object.assign({},this.receiptDetail,{auditName:"审核"})
                        }
                    })
                }
            },
        },
        mounted () {
            if(!this.$getCookie("belongShop")){
                this.isShop=false;
            } 
            this.rcptNo=this.$route.query.rcptNo||"";
            let data={
                rcptNo:this.rcptNo
            }
            this.$post(this.$host+"/api/order/receiptbill/detail",data).then(d=>{
                if(d.success){
                    let data=d.data;
                    this.idArr.push(data.id);
                    data.auditTime=this.$dateFormat("yy-MM-dd hh:mm:ss",data.auditTime);
                    data.signTime=this.$dateFormat("yy-MM-dd hh:mm:ss",data.signTime);
                    data.createTime =this.$dateFormat("yy-MM-dd hh:mm:ss",data.createTime);
                    data.billName="收款";
                    data.auditName="审核";
                    data.signName="签名确认";
                    switch(data.billStatus){//收款单状态
                        case 0:data.billStatus="未收款";this.billShow=true;data.billName="收款";break;
                        case 1:data.billStatus="已收款";this.billShow=false;data.billName="退款";break;
                        case 2:data.billStatus="已撤销";this.billShow=false;break;
                        case 3:data.billStatus="已退款";this.billShow=false;break;
                    }
                    switch(data.auditStus){//财务审核状态
                        case 0:data.auditStus="未审核";data.auditName="审核";break;
                        case 1:data.auditStus="已审核";data.auditName="撤销审核";break;
                        case 2:data.auditStus="已撤销";data.auditName="审核";break;
                    }
                    switch(data.signStatus){//签名状态
                        case 0:data.signStatus="未签名";data.signName="签名确认";break;
                        case 1:data.signStatus="已签名";data.signName="查看签名";break;
                    }
                    this.receiptDetail=data;
                    let payFlowList=d.payFlowList;
                    payFlowList.map(el=>{
                        el.payTime=this.$dateFormat("yy-MM-dd hh:mm:ss",el.payTime);
                        el.amount="￥"+el.amount;
                        switch(el.payType){
                            case "0":el.payType="现金";break;
                            case "1":el.payType="支付宝";break;
                            case "2":el.payType="微信";break;
                            case "3":el.payType="pos机";break;
                            case "4":el.payType="汇款";break;
                            case "5":el.payType="聚合支付";break;
                            case "6":el.payType="支票";break;
                            case "7":el.payType="其他";break;
                        }
                        switch(el.payStatus){
                            case 0:el.payStatus="支付中";break;
                            case 1:el.payStatus="已支付";break;
                            case 2:el.payStatus="支付失败";break;
                        }
                    });
                    this.payFlowList=payFlowList;
                }
            })
        }
    }
</script>
<style scoped lang="less">
    .CellHeader {
    color: #2cbcc8;
    font-size: 14px;
    font-weight: 600;
}
.modeltable {
    margin-bottom: 24px;
}
    .ReceiptDetail{
        padding-top: 1rem;
    }
    .ReceiptDetail .header .Name{
        color: #ab9ee6;
        font-size: 14px;
        vertical-align: baseline;
    }
    .ReceiptDetail>header{
    box-shadow: 0px 2px 2px #efefef;
    height: 40px;
    line-height: 40px;
    margin-bottom: 24px;
    }
    .modelBody .buttons{
        margin-bottom:24px;
    }
    .iconsign::before {
    content: "\E62D";
}
    .Table{
        border-top: 1px solid #efefef;
    border-left: 1px solid #efefef;
    width: 100%;
}
.Table td{
    border-right: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    width: 16.66%;
    text-align: right;
    background: #fafafa;
    height: 30px;
    line-height: 30px;
}
.Table td.tleft{
    text-align: left;
    background: #fff;
    padding-left: 5px;
}
</style>