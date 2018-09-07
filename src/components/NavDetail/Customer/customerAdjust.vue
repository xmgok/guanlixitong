<template>
    <div class="right_content_wrap">
        <div class="search_wrap">
            <el-select v-model='busiType' placeholder="请选择调整类型" size='mini' clearable>
                <el-option v-for="(item,index) in adjustStatus" :label="item.value" :value="item.key" :key="index">
                </el-option>
            </el-select>
            <input type="text" class="x_input" v-model='customerCodeNamePhone' placeholder="请输入会员编号/姓名/手机号">
            <Button Name="查询" Search="true" @click.native="getDatas(1)"></Button>
        </div>
        <div>
            <div class="btn_wrap">
                <Button :iconadd="true" Name="会员调整" @click.native="adjustBtn()"></Button>
            </div>
        </div>
        <div>
            <el-table border :data="datas" size='mini'>
                <el-table-column width="180" label="姓名">
                    <template slot-scope="scope">
                        {{scope.row.custName+"("+scope.row.cCode+")"}}
                    </template>
                </el-table-column>
                <el-table-column width="120" prop="adjustType" label="调整类型">
                </el-table-column>
                <el-table-column width="200" prop="changeVal" label="调整内容">
                </el-table-column>
                <el-table-column width="240" prop="remark" label="备注">
                </el-table-column>
                <el-table-column width="120" prop="changeTime" label="操作时间">
                </el-table-column>

                <el-table-column min-width='1'>
                </el-table-column>
            </el-table>
            <div class="pagingwidth">
                <Paging :handleCurrentChange="getDatas" :total="total" />
            </div>
        </div>

        <transition name="el-fade-in">
            <div class='x_model customer_adjust_model' v-if="adjustModelShow">
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">会员调整</div>
                        <div class="right curor icon Fork" @click="closeModel"></div>
                    </header>
                    <div class="x_model_main">
                        <ul>
                            <li>
                                会员：
                                <div class="input_wrap">
                                    <div class="search_input_wrap">
                                        <input :disabled='isSelect' v-model="modelSearchCustomer" type="text" class="x_input" placeholder="输入会员姓名/编号/手机号">
                                        <el-collapse-transition>
                                            <div class="customer_data_wrap" v-show="shopReceiptShow">
                                                <header>为您找到相关结果{{customerDatas.length}}个</header>
                                                <el-table :data="customerDatas" border style="width: 100%" :show-header="false" @row-click="handleRowHandle">
                                                    <el-table-column prop="cName" label="" width="130">
                                                        <template slot-scope="scope">
                                                            {{scope.row.cName+"("+scope.row.cCode+")"}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="cPhone" label="" width="120"></el-table-column>
                                                    <el-table-column prop="levName" label="" width="120"></el-table-column>
                                                </el-table>
                                            </div>
                                        </el-collapse-transition>
                                    </div>
                                    <Button Name="查询" @click.native="searchCustomerBtn" />
                                </div>
                            </li>
                            <li>
                                调整内容：
                            </li>
                            <li>
                                <table class="Tablesdf">
                                    <tr>
                                        <td>账户余额：</td>
                                        <td>
                                            <p>
                                                可用余额：
                                                <span>
                                                    <span v-if='customerAccount.accCurAmount'>￥</span>{{customerAccount.accCurAmount}}</span>
                                            </p>
                                            <input type="number" placeholder="请输入余额扣减金额" v-model='acctChangeAmount' />
                                            <p>可用赠送余额：
                                                <span>
                                                    <span v-if='customerAccount.accCurCashcou'>￥</span>{{customerAccount.accCurCashcou}}</span>
                                            </p>
                                            <input type="number" placeholder="请输入赠送余额扣减金额" v-model='cashcouChangeAmount' />
                                        </td>
                                        <td>
                                            备注：
                                            <textarea name="" id="" cols="30" rows="4" placeholder="请输入调整原因" v-model='remark1'></textarea>
                                        </td>
                                        <td>
                                            <Button small="Btn small" Name="保存" @click.native="submit(2,remark1,1)"></Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>账户积分：</td>
                                        <td>
                                            <p>
                                                可用积分：
                                                <span>{{customerAccount.accIntegral}}</span>
                                            </p>
                                            <input @keyup="keyUpFun(pointChangeVal)" type="text" placeholder="请输入积分调整数值" v-model='pointChangeVal' />
                                        </td>
                                        <td>
                                            备注：
                                            <textarea name="" id="" cols="30" rows="4" placeholder="请输入调整原因" v-model='remark2'></textarea>
                                        </td>
                                        <td>
                                            <Button small="Btn small" Name="保存" @click.native="submit(2,remark2,2)"></Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>会员等级：</td>
                                        <td>
                                            <p>
                                                当前成长值：
                                                <span>{{customerAccount.growVal}}</span>
                                            </p>
                                            <input @blur="growValBlur" type="text" v-model='growChangeVal' @keyup="keyUpFun(growChangeVal)" placeholder="请输入成长值调整数值" />
                                            <p>
                                                会员等级：
                                                <span>{{levelNameBefore}}</span>
                                            </p>
                                            <p>
                                                调整后会员等级：
                                                <span>{{levelNameAfter}}</span>
                                            </p>
                                        </td>
                                        <td>
                                            备注：
                                            <textarea name="" id="" cols="30" rows="4" placeholder="请输入调整原因" v-model='remark3'></textarea>
                                        </td>
                                        <td>
                                            <Button small="Btn small" Name="保存" @click.native="submit(1,remark3,3)"></Button>

                                        </td>
                                    </tr>
                                </table>
                            </li>
                        </ul>
                    </div>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeModel" buttonClass="None" />
                        <Button Name="关闭" @click.native="closeModel"></Button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Button from "@/components/common/Button";
import Paging from "@/components/common/Paging";
export default {
    components: { Button, Paging },
    data() {
        return {
            //搜索到的会员展示
            shopReceiptShow: false,
            //调整model show
            adjustModelShow: false,
            //调整类型
            adjustStatus: [
                {
                    key: 8,
                    value: '余额调整'
                },
                {
                    key: 9,
                    value: '等级调整'
                },
                {
                    key: 12,
                    value: '积分调整'
                },
            ],
            modelSearchCustomer: '',
            modelSearchCustomerCode: '',

            //model搜出来的会员数据
            customerDatas: [],
            accountBalance: {

            },
            // 减少的可用余额
            acctChangeAmount: '',
            //赠送的
            cashcouChangeAmount: '',
            //账户积分
            pointChangeVal: '',
            remark1: '',
            remark2: '',
            remark3: '',
            //积分
            integral: {

            },
            //会员 可用积分 可用余额 账户积分等信息
            customerAccount: '',
            //选择调整类型
            busiType: '',
            //会员手机号姓名编号
            customerCodeNamePhone: '',
            //列表数据
            datas: [],
            //total
            total: 0,
            //已选会员
            isSelect: false,

            //客户成长值
            growChangeVal: '',

            //会员等级
            level: '',
            //会员等级 调整前name
            levelNameBefore: '',
            //会员等级 调整后name
            levelNameAfter: '',
        }
    },
    methods: {
        //积分失去焦点
        growValBlur() {
            if (this.growChangeVal.length > 0) {
                let val = this.customerAccount.growVal - this.growChangeVal
                this.getLevelName(val, 'levelNameAfter')
            }
        },
        //keyup
        keyUpFun(val) {

            if (val.length === 1) {
                val = val.replace(/[^1-9]/g, '')
            } else if (val.length > 1) {
                val = val.replace(/[^0-9]/g, '')
            } else {
                val = val.replace(/\D/g, '')
            }
        },
        submit(val, remark, num) {
            let sub = true;
            let par = {
                cCode: this.modelSearchCustomerCode,
                adjustType: val,
                remark: remark,
            }

            if (num === 1) {
                if (Number(this.acctChangeAmount) > Number(this.customerAccount.accCurAmount)) {
                    this.$message({
                        type: "warning",
                        message: "可用余额的扣减金额不能大于可用余额",
                        duration: 10000,
                    });
                    sub = false
                } else if (Number(this.cashcouChangeAmount) > Number(this.customerAccount.accCurCashcou)) {
                    this.$message({
                        type: "warning",
                        message: "赠送余额的扣减金额不能大于可赠送余额",
                        duration: 10000,
                    });
                    sub = false
                } else {
                    par.acctChangeAmount = this.acctChangeAmount;
                    par.cashcouChangeAmount = this.cashcouChangeAmount;
                }
            } else if (num === 2) {
                if (Number(this.pointChangeVal) > Number(this.customerAccount.accIntegral)) {
                    this.$message({
                        type: "warning",
                        message: "积分调整数值不能大于可用积分",
                        duration: 10000,
                    });
                    sub = false
                } else {
                    par.pointChangeVal = this.pointChangeVal;
                }
            } else if (num === 3) {
                if (Number(this.growChangeVal) > Number(this.customerAccount.growVal)) {
                    this.$message({
                        type: "warning",
                        message: "成长调整值不能大于成长值",
                        duration: 10000,
                    });
                    sub = false
                } else {
                    par.growChangeVal = this.growChangeVal
                }
            }
            if (sub) {
                this.$post(this.$host + "/api/cust/accInfo/adjustAcct", par).then(d => {
                    if (d.success) {
                        this.$message({
                            type: "success",
                            message: "保存成功",
                        });
                        this.adjustModelShow = false;
                        this.getDatas(1)
                    }
                });
            }

        },
        //会员调整按钮
        adjustBtn() {
            this.adjustModelShow = true;
            this.pointChangeVal = '';
            this.growChangeVal = ''
            this.acctChangeAmount = '';
            this.cashcouChangeAmount = '';
            this.selectedCustomer()
        },
        //model 关闭
        closeModel() {
            this.adjustModelShow = false;
        },

        // model 查出数据 table 点击事件
        handleRowHandle(val) {

            this.modelSearchCustomer = val.cName
            this.modelSearchCustomerCode = val.cCode;

            this.$post(this.$host + "/api/cust/accInfo/findByCustomerId/" + val.id, {})
                .then(d => {
                    if (d.success) {
                        if (d.data === null) {
                            this.customerAccount = {
                                accLockAmount: "0",
                                accCurAmount: "0",
                                accCurCashcou: "0",
                                lockCurCashcou: "0",
                            }
                        } else {
                            for (var key in d.data) {
                                if (d.data[key] === null) {
                                    d.data[key] = "0";
                                }
                            }
                            this.customerAccount = d.data;
                        }
                        this.shopReceiptShow = false;
                    }
                });
        },
        //model里 搜寻
        searchCustomerBtn() {
            if (this.modelSearchCustomer) {
                let data = {
                    pageNumber: 1,
                    pageSize: 100,
                    cCodeOrNameOrPhone: this.modelSearchCustomer
                };
                this.$post(this.$host + "/api/cust/customer/page", data).then(d => {
                    if (d.success) {
                        let content = d.data.content;
                        this.customerDatas = d.data.content;
                        this.shopReceiptShow = true;
                    }
                });
            } else {
                this.$message({
                    type: "info",
                    message: "请输入查询条件"
                });
            }

        },
        getDatas(index) {
            let par = {
                "busiType": this.busiType, // (8-会员余额调整  9-会员等级调整  12-会员积分调整)
                "custKey": this.customerCodeNamePhone,
                "pageNumber": index,
                "pageSize": 20
            }
            this.$post(this.$host + "/api/cust/accInfo/acctAdjustPageList", par).then(d => {
                if (d.success) {
                    d.data.content.map(el => {
                        el.changeTime = this.$dateFormat('yy-MM-dd', el.changeTime)
                    })
                    this.datas = d.data.content
                    this.total = d.data.total;
                }
            });
        },
        //算当前积分下的等级名称
        getLevelName(val, key) {
            let arr = [];
            this.level.map(el => {
                if (val >= el.lvlChangeValue) {
                    arr.push(el);
                }
            })
            let num = arr[0]
            // .lvlChangeValue
            for (let i = 1; i < arr.length; i++) {
                if (num.lvlChangeValue <= arr[i].lvlChangeValue) {
                    num = arr[i]
                }
            }
            this[key] = num.levName
        },
        //已选客户
        selectedCustomer() {
            if (this.$route.query.cCode) {
                this.adjustModelShow = true;
                this.modelSearchCustomer = this.$route.query.cName;
                this.modelSearchCustomerCode = this.$route.query.cCode;
                this.isSelect = true;
                this.$post(this.$host + "/api/cust/accInfo/findByCustomerId/" + this.$route.query.id, {})
                    .then(d => {
                        if (d.success) {
                            if (d.data === null) {
                                this.customerAccount = {
                                    accCurCashcou: "0",
                                    accCurAmount: "0",
                                    pointVal: "0",
                                    growVal: "0",
                                }
                            } else {
                                for (var key in d.data) {
                                    if (d.data[key] === null) {
                                        d.data[key] = "0";
                                    }
                                }
                                this.customerAccount = d.data;
                            }
                            this.shopReceiptShow = false;
                            this.$post(this.$host + `/api/cust/lev/queryall`, {}).then(res => {
                                if (res.success) {
                                    this.level = res.data
                                    this.getLevelName(this.customerAccount.growVal, 'levelNameBefore')
                                }
                            })
                        }
                    });
            }
        },
    },
    mounted() {
        this.getDatas(1)
        this.selectedCustomer();
    }
}
</script>

<style scoped>
@import "../../../../static/commonStyle.css";
.btn_wrap {
    margin-bottom: 12px;
}
.search_input_wrap,
.input_wrap {
    position: relative;
    display: inline-block;
}
.customer_adjust_model .model_content {
    width: 800px;
}
.customer_adjust_model li:first-child {
    margin-bottom: 12px;
}
.customer_data_wrap {
    position: absolute;
    top: 28px;
    box-shadow: 0px 0px 6px 1px #efefef;
}
.customer_data_wrap header {
    background-color: #fafafa;
}
.defaultTheme .Tablesdf td,
.defaultTheme .Tablesdf th {
    padding: 4px;
    text-align: left;
}
.defaultTheme .Tablesdf td:last-child {
    text-align: center;
}
.defaultTheme .Tablesdf td textarea {
    vertical-align: text-top;
    border: 0;
    width: 80%;
    padding: 0;
}
.defaultTheme .Tablesdf td textarea:focus {
    border: 0;
}
</style>

