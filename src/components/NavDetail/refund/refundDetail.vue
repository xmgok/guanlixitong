<template>
    <div class="right_content_wrap refund_back">
        <div class="right_content">
            <div>
               会员{{cName +"("+ cCode +")"}}{{"￥"+amount}}的总退款已从公司扣款。具体到账时间取决于银行/第三方支付平台等平台，敬告会员留意。
            </div>
            <div v-if='originalChannel.length>0'>
                <div>
                    按原支付渠道退款
                </div>
                <div>
                    <template>
                        <el-table :data="originalChannel" border style="width: 100%">
                            <el-table-column prop="serialNo" label="退款流水" width="180">
                            </el-table-column>
                            <el-table-column prop="paytype" label="原支付方式" width="180">
                            </el-table-column>
                            <el-table-column prop="payFlowNo" label="原支付流水" width="180">
                            </el-table-column>
                            <el-table-column prop="payAmount" label="原支付金额" width="180">
                                <template slot-scope="scope">
                                    {{"￥"+scope.row.payAmount}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="amount" label="退款金额" width="180">
                                <template slot-scope="scope">
                                    {{"￥"+scope.row.amount}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="payAcct" label="付款方账号" width="180">
                            </el-table-column>
                            <el-table-column prop="billStatus" label="退款状态" width="180">
                            </el-table-column>
                            <el-table-column prop='backDate' label="退款时间" width="220">
                            </el-table-column>
                            <el-table-column min-width='1'>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
            </div>
            <div v-if='designatedChannel.length>0'>
                <div>
                    按原支付渠道退款
                </div>
                <div>
                    <template>
                        <el-table :data="designatedChannel" border style="width: 100%">
                            <el-table-column prop="serialNo" label="退款流水" width="180">
                            </el-table-column>
                            <el-table-column prop="amount" label="退款金额" width="180">
                                <template slot-scope="scope">
                                    {{"￥"+scope.row.amount}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="custBackAcctNm" label="户名" width="180">
                            </el-table-column>
                            <el-table-column prop="custBackBankNm" label="开户行" width="180">
                            </el-table-column>
                            <el-table-column prop="custBackAcct" label="银行账号" width="180">
                            </el-table-column>
                            <el-table-column prop="custBackType" label="银行卡类型" width="180">
                            </el-table-column>
                            <el-table-column prop="billStatus" label="退款状态" width="180">
                            </el-table-column>
                            <el-table-column prop='backDate' label="退款时间" width="220">
                            </el-table-column>
                            <el-table-column min-width='1'>
                            </el-table-column>
                        </el-table>
                    </template>
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
            //客户code
            cCode: this.$route.query.cCode,
            refundNo: this.$route.query.refundNo,//退款单号
            amount: this.$route.query.amount,//退款金额
            cName: this.$route.query.cName,
            compAmount: this.$route.query.compAmount,//补偿金额
            // sName: this.$route.query.sName,

            originalChannel: [],
            designatedChannel: [],




        }
    },
    methods: {


    },
    mounted() {

        let par = {
            refundNo: this.refundNo,
        }
        this.$post(this.$host + "/api/order/refund/findRefundBillAndPayFlowByRefundNo", par)
            .then(d => {
                if (d.success) {

                    d.data.originalChannel.map(el => {
                        el.billStatus === 0 ? el.billStatus = '退款成功' : el.billStatus = '退款失败';
                        el.backDate = this.$dateFormat('yy-MM-dd hh:mm:ss', el.backDate)
                    })
                    d.data.designatedChannel.map(el => {
                        el.billStatus === 0 ? el.billStatus = '退款成功' : el.billStatus = '退款失败';
                        el.backDate = this.$dateFormat('yy-MM-dd hh:mm:ss', el.backDate)
                    })
                    this.originalChannel = d.data.originalChannel;
                    this.designatedChannel = d.data.designatedChannel;
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


