<template>
    <div class="right_content_wrap add_refund flowHistId_refund">
        <div class="right_content">
            <div class='table_wrap'>
                <div class="table_content">
                    <header class="x_header_title">
                        <i class="icon iconsign"></i>
                        基本信息
                    </header>
                    <table class='Tablesdf basic_information'>
                        <tr>
                            <td style='width:130px'>退款单号：</td>
                            <td style='width:200px'>{{datas.refundNo}}</td>
                            <td style='width:130px'>申请人：</td>
                            <td style='width:200px'>
                                <span>{{refundBill.proposer}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>申请门店：</td>
                            <td>{{datas.sName}}</td>
                            <td>申请时间：</td>
                            <td>{{refundBill.createTime}}</td>
                        </tr>
                        <tr>
                            <td>会员：</td>
                            <td>
                                <span>{{datas.cName}}</span>
                            </td>
                            <td>账户可用实付金额：</td>
                            <td>
                                <span>￥{{datas.accCurAmount?datas.accCurAmount:'0.00'}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>余额退还：</td>
                            <td>
                                ￥{{refundBill.amount?refundBill.amount:"0.00"}}
                            </td>
                            <td>补偿金额：</td>
                            <td>
                                ￥{{refundBill.compAmount?refundBill.compAmount:"0.00"}}
                            </td>
                        </tr>
                        <tr>
                            <td>总退款：</td>
                            <td>
                                ￥{{datas.totalAmount?datas.totalAmount:"0.00"}}
                            </td>
                            <td>备注：</td>
                            <td>
                                {{refundBill.refundCause}}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class='table_wrap'>
                <div class="table_content">
                    <header class="x_header_title">
                        <i class="icon iconsign"></i>
                        退款方式
                    </header>
                    <table class='Tablesdf '>
                        <thead>
                            <tr>
                                <th>户名</th>
                                <th>开户行</th>
                                <th>银行账号</th>
                                <!-- <th>银行卡类型</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {{payFlow.custBackAcctNm}}
                                </td>
                                <td>
                                    {{payFlow.custBackBankNm}}
                                </td>
                                <td>
                                    {{payFlow.custBackAcct}}
                                </td>
                                <!-- <td>
                                    {{payFlow.custBackType}}
                                </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>如涉及现金、支票、转账汇款，请务必填写退款方式并确保其准确性；POS刷卡、微信、支付宝收款默认按原支付渠道返回，可不填写退款方式</p>
            </div>
            <div class='table_wrap' v-if='this.$route.query.flowHistId'>
                <div class="table_content">
                    <header class="x_header_title">
                        <i class="icon iconsign"></i>
                        审批进度
                    </header>
                    <div class="flowHistId_refund_content">
                        <ul class="Detail clearfix">
                            <li v-for="(item,index) in detaildata" :key="index">
                                <div class="header">
                                    <i class="icon" :class="'F'+item.checkStatus"></i>
                                    <p :class="'F'+item.checkStatus">{{(item.checkStatus=="1"&&"待审批")||(item.checkStatus=="2"&&"审批通过")||(item.checkStatus=="3"&&"驳回")}}</p>
                                    <i class="xuxian"></i>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>

import Button from "@/components/common/Button";


export default {
    components: { Button, },
    data() {
        return {


            datas: "",

            refundBill: '',

            payFlow: '',

            detaildata: [],

        }
    },
    methods: {

    },
    mounted() {
        let par = {
            "flowDataId": this.$route.query.flowDataId
        }
        this.$post(this.$host + "/api/order/refund/findRefundAudit", par)
            .then(d => {
                if (d.success) {
                    this.datas = d.data.jsonData[0];
                    this.refundBill = d.data.jsonData[0].refundBill;
                    this.refundBill.createTime = this.$dateFormat('yy-MM-dd hh:mm:ss', this.refundBill.createTime)
                    this.payFlow = d.data.jsonData[0].payFlow;
                }
            });

        this.$post(this.$host + "/api/sysmgr/flowHistory/getProgress/" + this.$route.query.flowHistId, {}).then(d => {
            if (d.success) {
                this.detaildata = d.data;
            }
        });
    }
}
</script>
<style scoped>
@import "../../../../../static/commonStyle.css";
.flowHistId_refund_content {
    margin: 24px 12px;
}
.flowHistId_refund .Detail .icon {
    font-size: 48px;
    color: #888;
}
.flowHistId_refund .Detail > li {
    width: 16.666667rem;
    float: left;
    position: relative;
}
.flowHistId_refund .Detail li > p {
    width: 5rem;
    text-align: center;
}

/* 待审核 */
.flowHistId_refund .icon.F1::before {
    content: "\e62c";
}
/* 已审核 */
.flowHistId_refund .icon.F2::before {
    content: "\e624";
}

/* 已驳回 */
.flowHistId_refund .icon.F3::before {
    content: "\e68d";
}

.table_wrap {
    overflow: auto;
    margin-bottom: 40px;
}

.table_wrap table td {
    padding: 4px;
}
/* .basic_information td input {
  width: 100px;
} */

.basic_information td:nth-child(2n-1) {
    text-align: right;
}
.basic_information td:nth-child(2n) {
    text-align: left;
}
.basic_information textarea {
    width: 100%;
    border: 0;
}
.iconsign::before {
    content: "\E62D";
}
.x_remind {
    margin: 12px 0;
}
.all_money {
    font-size: 16px;
}
</style>

