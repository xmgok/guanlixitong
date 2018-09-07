<template>
    <div class="right_content_wrap add_refund">
        <div class="right_content">

            <div class='table_wrap'>
                <div class="table_content">
                    <div class='add_header'>
                        <i class="icon iconsign"></i>
                        基本信息
                    </div>
                    <table class='Tablesdf basic_information'>
                        <tr>
                            <td style='width:25%'>申请人：</td>
                            <td style='width:25%'>
                                <span>{{datas.proposer}}</span>
                            </td>
                            <td style='width:25%'>申请门店：</td>
                            <td>
                                <span>{{datas.sName}}</span>
                            </td>
                        </tr>

                        <tr>
                            <td>会员：</td>
                            <td>
                                <span v-if='status'>{{cName}}</span>
                                <input class="x_input" v-if='!status' type="text" v-model='cName' readonly @click="SelectCustomer" placeholder="请选择会员" />

                            </td>
                            <td>账户可用实付金额：</td>
                            <td>
                                <span>￥{{accCurAmount?accCurAmount:'0.00'}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>退还金额：</td>
                            <td>
                                <input class="x_input" type="text" v-model='amount' placeholder="￥0.00" @keyup="keyUp">
                            </td>
                            <td>补偿金额：</td>
                            <td>
                                <input class="x_input" type="text" v-model='totalAmount' placeholder="￥0.00" @keyup="keyUp">

                            </td>
                        </tr>
                        <tr>
                            <td>总退款：</td>
                            <td>
                                <span class="all_money">￥{{totalMoney?totalMoney:"0.00"}}</span>
                            </td>
                            <td>备注：</td>
                            <td>
                                <textarea v-model='refundCause' name="" id="" cols="30" rows="2" placeholder="请输入"></textarea>

                            </td>
                        </tr>

                    </table>
                </div>
            </div>

            <div class='table_wrap'>
                <div class="table_content">
                    <div class='add_header'>
                        <i class="icon iconsign"></i>
                        退款方式
                    </div>
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
                                    <input class="x_input" type="text" v-model='payFlow.custBackAcctNm' placeholder="请输入" />

                                </td>
                                <td>
                                    <div class="bank_name">
                                        <input class="x_input" type="text" v-model='payFlow.custBackBankNm' placeholder="点击选择银行" @click="selectBackFun" />
                                        <i class="icon quxiao cursor" v-if='payFlow.custBackBankNm' @click="cancleSelectBank"></i>
                                    </div>

                                </td>
                                <td>
                                    <input class="x_input" type="number" v-model='payFlow.custBackAcct' placeholder="请输入" />
                                </td>
                                <!-- <td>
                                    <input class="x_input" type="text" v-model='payFlow.custBackType' placeholder="请输入" />
                                </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="x_remind">注：如涉及现金、支票、转账汇款，请务必填写退款方式并确保其准确性；POS刷卡、微信、支付宝收款默认按原支付渠道返回，可不填写退款方式。</p>
            </div>
            <div class='btn_wrap'>
                <Button Name="取消" class="None" @click.native="goBack"></Button>
                <Button Name="提交审核" @click.native="submit()"></Button>
            </div>
        </div>
        <selectReceipt v-show="selectReceiptShow" :cancleReceipt="cancleReceipt" :sureselectReceipt="sureselectReceipt" />
        <div class='x_model select_banl_model' v-if="selectBankShow">
            <div class="model_content">
                <header class="x_model_header clear">
                    <div class="left">选择银行</div>
                    <div class="right curor icon Fork" @click="closeModel"></div>
                </header>

                <div class="x_model_main">
                    <div class="search_wrap">
                        银行名称：<input class="x_input" type="text" v-model='payFlow.custBackType' placeholder="请输入" />
                        <Button Name="查询" @click.native="getBank(1)" />
                    </div>
                    <el-table :data="bankDatas" border @row-dblclick='handleRowHandle' @current-change="setCurrentRow" highlight-current-row>
                        <el-table-column prop="bankName" label="银行名称"></el-table-column>
                    </el-table>
                    <div class="paging_wrap">
                        <Paging :handleCurrentChange="getBank" :total="total" :pageSize="10" />
                    </div>
                </div>
                <div class="x_model_footer">
                    <Button Name="取消" @click.native="closeModel" buttonClass="None" />
                    <Button Name="确定" @click.native="closeModel()" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import Button from "@/components/common/Button";
import Paging from "@/components/common/Paging";
import selectReceipt from "../../../common/selectReceipt"

export default {
    components: { Button, selectReceipt, Paging },
    data() {
        return {
            total: 0,
            //银行数据
            bankDatas: [],

            //选银行
            selectBankShow: false,

            //客户已选 未选状态
            status: false,

            datas: {
                sCode: '',
                proposer: '',
                sName: ''
            },

            seeDatas: "",

            selectReceiptShow: false,

            //账户余额
            accCurAmount: "",

            //客户名字
            cName: '',

            //退还余额
            amount: '',


            //补偿金额
            totalAmount: "",

            //备注
            refundCause: '',

            //退款方式
            payFlow: {
                custBackAcctNm: "",
                custBackBankNm: "",
                custBackAcct: "",
                custBackType: '',
                custBackBank: ''
            },

            //客户code
            cCode: '',

            //搜索银行
            // bankName: '',
            activeItem: {},

        }
    },
    computed: {

        totalMoney() {
            return (Number(this.amount) + Number(this.totalAmount)).toFixed(2)
        },
    },
    methods: {
        keyUp(value) {
            value.target.value = value.target.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
            value.target.value = value.target.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
            value.target.value = value.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            value.target.value = value.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
            if (value.target.value.indexOf(".") < 0 && value.target.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
                value.target.value = parseFloat(value.target.value);
            }
        },
        setCurrentRow(row) {
            this.activeItem = row;
            this.payFlow.custBackBankNm = row.bankName
            this.payFlow.custBackBank = row.bankNo
        },
        handleRowHandle(row) {
            this.activeItem = row;
            this.selectBankShow = false;
            this.payFlow.custBackBankNm = row.bankName;
            this.payFlow.custBackBank = row.bankNo
        },
        closeModel() {
            this.selectBankShow = false;
        },
        selectBackFun() {
            this.selectBankShow = true;
        },
        cancleSelectBank() {
            this.payFlow.custBackBankNm = '';
            this.payFlow.custBackBank = ''
            this.activeItem = {};
        },

        //后退
        goBack() {
            history.back(-1)
        },
        //提交审核
        submit() {
            if (this.$stop()) { return };
            let num = 0;
            for (let key in this.payFlow) {
                if (key === '' || key === null) {
                    num++;
                }
            }

            let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (this.amount <= 0) {
                this.$message({
                    type: "warning",
                    duration: '5000',
                    message: "退还金额不能小于或等于0！"
                })
                return
            } else if (!reg.test(this.amount)) {
                this.$message({
                    type: "warning",
                    duration: '5000',
                    message: "请输入正确的退还金额，最多保留两位小数"
                })
                return;
            } else if (this.totalAmount.length > 0 && !reg.test(this.totalAmount)) {

                this.$message({
                    type: "warning",
                    duration: '5000',
                    message: "请输入正确的补偿金额，最多保留两位小数"
                })
                return;

            } else if (Number(this.amount) > Number(this.accCurAmount)) {

                this.$message({
                    type: "warning",
                    duration: '5000',
                    message: "退还金额不能大于账户可用实付金额"
                })
                return;
            } else if (num > 0 && num < 3) {
                this.$message({
                    type: "warning",
                    duration: '5000',
                    message: "退款方式不完善！"
                })
                return;
            } else {
                this.payFlow.custBackType = 4;
                let par = {
                    // refundNo: this.datas.refundNo,
                    proposer: this.datas.proposer,
                    sName: this.datas.sName,
                    cName: this.cName,
                    accCurAmount: this.accCurAmount,
                    sCode: this.datas.sCode,
                    // createTime: this.datas.createTime,
                    cCode: this.cCode,
                    amount: this.amount,
                    compAmount: this.totalAmount,
                    refundCause: this.refundCause,
                    payFlow: this.payFlow,
                };
                this.$post(this.$host + "/api/order/refund/submitRefundAudit", par)
                    .then(d => {
                        if (d.success) {
                            this.$message({
                                type: "success",
                                message: "添加成功"
                            });
                            history.back(-1);
                        }
                    });
            }

        },

        //选择客户
        SelectCustomer() {
            if (this.status === false) {
                this.selectReceiptShow = true;
            }
        },

        //选择客户取消按钮
        cancleReceipt() {
            this.selectReceiptShow = false;
        },

        //选择客户确定按钮
        sureselectReceipt(item) {
            if (this.status === false) {
                this.selectReceiptShow = false;
                this.cCode = item.cCode;
                this.cName = item.cName;
                let par = {
                    cCode: item.cCode,
                }

                this.$post(this.$host + "/api/order/refund/findCcustAcctinfoByCcode", par)
                    .then(d => {
                        if (d.success) {
                            d.data === null ? this.accCurAmount = '0.00' : this.accCurAmount = d.data.accCurAmount;
                        }
                    });
            }

        },

        //银行数据
        getBank(index) {
            let par = {
                "pageNumber": parseInt(index),
                "pageSize": 10,
                "bankName": this.bankName || undefined,
            }
            this.$post(this.$host + "/api/order/refund/findBankInfoPage", par)
                .then(d => {
                    if (d.success) {
                        let content = d.data.content;
                        if (content.length < 10) {
                            let length = 10 - content.length;
                            for (let i = 0; i < length; i++) {
                                content.push({})
                            }
                        }
                        this.bankDatas = content;
                        this.total = d.data.total;
                    }
                });
        }

    },
    mounted() {

        this.datas.sCode = this.$getCookie("belongShop");
        this.datas.proposer = this.$getCookie("uname");
        this.datas.sName = this.$getCookie("shopName");
        if (this.$route.query.type === '_selected') {
            this.status = true;
            this.cCode = this.$route.query.cCode;
            this.cName = this.$route.query.cName;
            let par = {
                cCode: this.$route.query.cCode,
            }
            this.$post(this.$host + "/api/order/refund/findCcustAcctinfoByCcode", par)
                .then(d => {
                    if (d.success) {
                        d.data === null ? this.accCurAmount = '0.00' : this.accCurAmount = d.data.accCurAmount;
                    }
                });
            this.getBank(1)
        } else if (this.$route.query.type === "_add") {
            this.status = false;
            this.getBank(1)
            if (this.$route.query.flowDataId != undefined) {
                let par = {
                    flowDataId: this.$route.query.flowDataId
                }
                this.$post(this.$host + "/api/order/refund/findRefundAudit", par)
                    .then(d => {
                        if (d.success) {
                            let val = d.data.jsonData[0];
                            this.refundCause = val.refundBill.refundCause;
                            this.totalAmount = val.totalAmount;
                            this.amount = val.refundBill.amount;
                            this.cCode = val.refundBill.cCode;
                            this.datas.sCode = val.refundBill.sCode;
                            this.accCurAmount = val.accCurAmount;
                            this.cName = val.cName;

                            this.refundBill = d.data.jsonData[0].refundBill;
                            this.refundBill.createTime = this.$dateFormat('yy-MM-dd hh:mm:ss', this.refundBill.createTime)
                            this.payFlow = val.payFlow;


                        }
                    });

            }
        }

    }
}
</script>
<style scoped>
@import "../../../../../static/commonStyle.css";
.btn_wrap {
    text-align: center;
}
.quxiao::before {
    content: "\e61a";
}
.bank_name {
    display: inline-block;
    position: relative;
}
.select_banl_model .model_content {
    width: 600px;
}
.bank_name .quxiao {
    position: absolute;
    top: 54%;
    right: 4px;
    transform: translate(0, -50%);
    opacity: 0;
    transition: all 0.2s;
}
.bank_name input {
    padding-right: 18px;
}
.bank_name:hover .quxiao {
    opacity: 1;
    transition: all 0.2s;
}
.table_wrap {
    overflow: auto;
    margin-bottom: 40px;
}

.table_wrap table td {
    padding: 4px;
}

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

