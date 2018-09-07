<template>
    <div class="right_content_wrap refund_back">
        <div class="right_content">
            <div>
                对会员{{cName +"("+ cCode +")"}}进行{{"￥"+amount}}的实际收款追溯>>>
            </div>
            <div v-for='item in datas'>

                <div>
                    收款门店：{{item.sName}} 收款单号：{{item.rcptNo}}实收金额：{{"￥"+item.totalAmount}}
                </div>
                <div>
                    <template>
                        <el-table :data="item.detail" border style="width: 100%">
                            <el-table-column prop="payText" label="原付款方式" width="180">
                            </el-table-column>
                            <el-table-column prop="serialNo" label="原支付单号" width="180">
                            </el-table-column>
                            <el-table-column prop="amount" label="原支付金额" width="180">
                                <template slot-scope="scope">
                                    {{"￥"+scope.row.amount}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="remark" label="备注" width="180">
                            </el-table-column>
                            <el-table-column prop="refundAmount" label="退款金额" width="180">
                                <template slot-scope="scope">
                                    {{"￥"+scope.row.refundAmount}}
                                </template>
                            </el-table-column>
                            <el-table-column fixed='right' label="退款类型" width="220">
                                <template slot-scope="scope">
                                    <el-radio-group v-model="scope.row.type">
                                        <p>
                                            <el-radio :label="0">原支付渠道退款</el-radio>
                                        </p>
                                        <p>
                                            <el-radio :label="1">非原支付渠道退款</el-radio>
                                        </p>
                                    </el-radio-group>
                                </template>
                            </el-table-column>
                            <el-table-column fixed='right' min-width='1'>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
            </div>
            <div class='btn_wrap'>
                <Button Name="取消" class="None" @click.native="goBack"></Button>
                <Button Name="确定" @click.native="submit()"></Button>
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
            //客户code
            cCode: this.$route.query.cCode,
            refundNo: this.$route.query.refundNo,//退款单号
            amount: this.$route.query.amount,//退款金额
            cName: this.$route.query.cName,
            compAmount: this.$route.query.compAmount,//补偿金额
            // sName: this.$route.query.sName,
            datas: [],



        }
    },
    methods: {
        goBack() {
            history.back(-1)
        },
        submit() {
            let submit = this.datas[0].refundTypeStatus === 0 ? false : true;
            let selected = this.datas.every(el => { return el.type == 0 })
            if (!submit && !selected) {
                this.$message({
                    type: "warning",
                      duration: "5000",
                    message: "您选择的有非原渠道退还状态，并且退款发起人没有填写非原渠道退款信息，请通知发起人从新发起退款！"
                })
            } else {
                let par = {
                    "refundNo": this.refundNo,
                    "totalRefundAmount": this.amount,
                    "compAmount": this.compAmount,
                    "cCode": this.cCode,
                    "belongShop": this.$getCookie('belongShop') || '',
                }
                par.main = JSON.parse(JSON.stringify(this.datas));
                par.main.map(item => {
                    delete item.sName;
                    item.detail.map(el => {
                        delete el.payText;
                        delete el.remark;
                        el.payType = Number(el.payType)
                    })
                });
                this.$post(this.$host + "/api/order/refund/refundBusi", par)
                    .then(d => {
                        if (d.success) {
                            this.$message({
                                type: "success",
                                message: "保存成功！",
                            })
                            history.back(-1)
                        }
                    });

            }

        }

    },
    mounted() {

        let par = {
            cCode: this.cCode,
            refundNo: this.refundNo,
            refundAmount: this.amount,
        }
        this.$post(this.$host + "/api/order/refund/findReceiptBillByCcode", par)

            .then(d => {
                if (d.success) {
                    d.data.map(item => {
                        item.detail.map(el => {
                            el.type = 0;
                            switch (el.payType) {
                                case "0": el.payText = '现金';
                                    el.type = 1;
                                    break;
                                case "1": el.payText = '支付宝';
                                    break;
                                case "2": el.payText = '微信';
                                    break;
                                case "3": el.payText = 'pos机';
                                    break;
                                case "4": el.payText = '汇款';
                                    break;
                                case "5": el.payText = '聚合支付';
                                    break;
                                case "6": el.payText = '支票';
                                    el.type = 1;
                                    break;
                                case "7": el.payText = '其他';
                                    break;
                            };
                        });

                    })
                    this.datas = d.data;
                }
            });
    }
}
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.btn_wrap {
  margin-top: 24px;
  text-align: center;
}
</style>
<style>
.refund_back td:nth-child(6) {
  text-align: left;
}
.refund_back td:nth-child(6) p {
  margin: 4px 0;
}
</style>


