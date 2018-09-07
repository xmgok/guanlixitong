<template>
    <div class="right_content_wrap">
        <div class="right_content">
            <div class="overall_balance">
                <div class="card">
                    <ul>
                        <li>可用总余额</li>
                        <li>￥{{datas.availableTotalAmount}}</li>
                    </ul>
                </div>
                <div class="card">
                    <ul>
                        <li>累计实收金额</li>
                        <li>￥{{datas.sumRealAmount}}</li>
                    </ul>
                </div>
                <div class="card">
                    <ul>
                        <li>累计赠送金额</li>
                        <li>￥{{datas.sumDonationAmount}}</li>
                    </ul>
                </div>

            </div>

            <div class="touch_balance">
                <header>
                    <i class="icon iconsign"></i>
                    余额明细
                </header>
                <div class="table-wrap">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th style="width:200px">余额类型</th>
                                <th style="width:150px">余额</th>
                                <th style="width:180px">变动记录</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    可用实付余额
                                </td>
                                <td>
                                    ￥{{datas.accCurAmount}}
                                </td>
                                <td>
                                    <Button small="Btn small" Name="查看变动记录" @click.native="seeBalance(0)"></Button>
                                    <Button small="Btn small" Name="转出" @click.native="forwardBtn()"></Button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    可用赠送余额
                                </td>
                                <td>
                                    ￥{{datas.accCurCashcou}}
                                </td>
                                <td>
                                    <Button small="Btn small" Name="查看变动记录" @click.native="seeBalance(1)"></Button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    已锁定实付余额
                                </td>
                                <td>
                                    ￥{{datas.accLockAmount}}
                                </td>
                                <td>
                                    <Button small="Btn small" Name="查看变动记录" @click.native="seeBalance(2)"></Button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    已锁定赠送余额
                                </td>
                                <td>
                                    ￥{{datas.lockCurCashcou}}
                                </td>
                                <td>
                                    <Button small="Btn small" Name="查看变动记录" @click.native="seeBalance(3)"></Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>

        </div>

        <!--  -->

        <transition name="el-fade-in">
            <div class='x_model forward_model' v-if="modelShow">
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">客户调整</div>
                        <div class="right curor icon Fork" @click="closeModel"></div>
                    </header>
                    <div class="x_model_main">
                        <ul>
                            <li>
                                <div class="acount_wrap">
                                    <p>转出账户</p>
                                    <input type="text" disabled v-model='currentAccount.busiType' class="x_input">
                                </div>
                                <div class="acount_wrap">
                                    <p>转入账户</p>
                                    <el-select v-model="shiftTo" placeholder="请选择">
                                        <el-option v-for="item in account" :key="item.key" :label="item.busiType" :disabled="item.disabled" :value="item.belongOrg">
                                        </el-option>
                                    </el-select>
                                </div>

                            </li>
                            <li>
                                可用余额：
                                <span>￥{{currentAccount.accAmount}}</span>
                            </li>

                            <li>
                                <input type="number" placeholder="请输入转出金额" v-model='transferAmount' class="x_input">
                                <Button Name="全部" @click.native="allMoneyBtn" buttonClass="None" />
                            </li>
                            <li>
                                备注：
                                <textarea name="" id="" cols="40" rows="3" v-model='remark'></textarea>
                            </li>
                        </ul>
                    </div>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeModel" buttonClass="None" />
                        <Button Name="确定" @click.native="sureBtn()"></Button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Button from "../../../common/Button"
export default {
    components: {
        Button
    },
    data() {
        return {
            datas: '',
            forwardBtnShow: false,
            //当前账户的信息
            account: [],
            //转入的账户
            shiftTo: '',
            //当前账户
            currentAccount: {},
            //modelshow
            modelShow: false,
            //转出金额
            transferAmount: '',
            //备注
            remark: '',
        }
    },

    methods: {
        sureBtn() {
            let sub = true;
            if (Number(this.transferAmount) > Number(this.currentAccount.accAmount)) {
                this.$message({
                    type: "warning",
                    message: "转出金额不能大于可用金额",
                    duration: 5000,
                });
                sub = false;
            } else if (this.transferAmount == '') {
                this.$message({
                    type: "warning",
                    message: "请输入转出金额",
                    duration: 5000,
                });
                sub = false;
            }

            if (sub) {

                let par = {
                    custCode: this.$route.query.code,
                    turnOutAmount: this.transferAmount,
                    toBelongShop: '',
                    toBelongOrg: '',
                }
                this.account.map(el => {
                    if (el.belongOrg == this.shiftTo) {
                        par.toBelongShop = el.cStore
                        par.toBelongOrg = el.belongOrg
                    }
                })
                this.$post(this.$host + "/api/cust/accInfo/acctTurnOut", par).then(d => {
                    if (d.success) {
                        this.$message({
                            type: "success",
                            message: "转出成功",
                        });
                        this.modelShow = false;
                    }
                });
            }

        },
        //全部按钮
        allMoneyBtn() {
            this.transferAmount = this.currentAccount.accAmount;
        },
        forwardBtn() {
            this.modelShow = true;
        },
        closeModel() {
            this.modelShow = false;
        },
        seeBalance(val) {
            this.$router.push({
                path: "/NavDetail/Customer/balanceDetail",
                query: {
                    type: val,
                    code: this.$route.query.code
                }

            });
        }

    },
    mounted() {
        this.$post(this.$host + "/api/cust/accInfo/getAcctInfo", { cCode: this.$route.query.code }).then(d => {
            if (d.success) {
                this.datas = d.data;
            }
        });
        this.$post(this.$host + "/api/cust/accInfo/findCustAccts", { customerId: this.$route.query.id }).then(d => {
            if (d.success) {

                let org = this.$getCookie('belongOrg');
                d.data.map(el => {
                    if (el.belongOrg === org) {
                        this.currentAccount = el;
                        el.disabled = true
                    }
                });

            }
            this.account = d.data;

        });
    }
}
</script>

<style scoped>
@import "../../../../../static/commonStyle.css";
.forward_model .model_content {
    width: 400px;
}
.model_content li {
    margin: 6px 0;
}
.acount_wrap {
    display: inline-block;
}
.overall_balance {
    border: 1px solid #dcdfe6;
    padding: 24px;
    display: inline-block;
    margin-bottom: 40px;
    width: 800px;
    text-align: center;
}
textarea {
    vertical-align: text-top;
}
.card {
    display: inline-block;
    width: 160px;
    height: 80px;
    color: #fff;
    border-radius: 4px;
    font-size: 16px;
    text-align: center;
    margin: 12px;
    position: relative;
}
.overall_balance ul {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.card:nth-child(1) {
    background-color: #74b2e8;
}
.card:nth-child(2) {
    background-color: #a88cd5;
}
.card:nth-child(3) {
    background-color: #5dc292;
}
header {
    border-bottom: 1px solid #dcdfe6;
    line-height: 40px;
    padding: 0 16px;
    color: #1dade6;
    font-size: 18px;
}
.table-wrap {
    padding: 16px;
}
.iconsign::before {
    content: "\E62D";
}
.touch_balance {
    width: 800px;
}
</style>

