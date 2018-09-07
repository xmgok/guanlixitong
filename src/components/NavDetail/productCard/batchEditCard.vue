<template>
    <div class="batch_edit_rule">
        <div class="right_content_wrap">
            <div class="right_content">
                <div class="table_content">
                    <div class="table-wrap">
                        <div class='add_header'>
                            <i class="icon x_iconsign"></i>
                            套卡规则编辑
                        </div>
                        <table class="Tablesdf edit_card">
                            <thead>
                                <tr>
                                    <th>
                                        购买渠道
                                    </th>
                                    <th>
                                        支付方式
                                    </th>
                                    <th>
                                        单客购买上限
                                    </th>
                                    <th>
                                        消费次数限制
                                    </th>
                                    <th>
                                        消费时间限制
                                    </th>
                                    <th v-if='isSingel'>
                                        余额扣减
                                    </th>
                                    <th>
                                        过期处置
                                    </th>
                                    <th>
                                        开票方式
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <!-- 购买渠道 -->
                                        <el-radio-group v-model="purchaseWayDatas">
                                            <ul>
                                                <li v-for='it in purchaseWay'>

                                                    <el-radio :label="it.purchaseWayType">
                                                        {{it.purchaseWayName}}
                                                    </el-radio>
                                                </li>
                                            </ul>
                                        </el-radio-group>
                                    </td>
                                    <td>
                                        <!-- 支付方式 -->
                                        <el-radio-group v-model="payWayDatas">
                                            <ul>
                                                <li v-for='it in payWay'>

                                                    <el-radio :label="it.payWayType">
                                                        {{it.payWayType===0?"无限制,积分最高可购买金额 ￥":it.payWayName}}
                                                        <input v-if='it.payWayType===0' @click.stop="" type="number" v-model='it.payWayValue' placeholder="0.00">
                                                    </el-radio>
                                                </li>
                                            </ul>
                                        </el-radio-group>
                                    </td>
                                    <td>
                                        <!-- 单客购买上线 -->
                                        <el-radio-group v-model="purchaseLimitDatas">
                                            <ul>
                                                <li v-for='(it,ix) in  purchaseLimit'>
                                                    <el-radio :label="it.purchaseLimitType">
                                                        {{it.purchaseLimitName}}
                                                        <span v-if='it.purchaseLimitType!=0'>
                                                            <input @onafterpaste="keyupFun(it,'purchaseLimitValue')" @keyup="keyupFun(it,'purchaseLimitValue')" :class="{x_border_error:it.notNull}" type="text" v-model='it.purchaseLimitValue' @click.stop="" />次
                                                        </span>
                                                    </el-radio>

                                                </li>
                                            </ul>
                                        </el-radio-group>
                                    </td>
                                    <td>
                                        <!-- 消费次数限制 -->
                                        <el-checkbox-group v-model="timesLimitDatas">
                                            <ul>
                                                <li v-for='(it,ix) in  timesLimit'>
                                                    <el-checkbox :key="it.timesLimitType" :label='it.timesLimitType'>
                                                        {{it.timesLimitName}}
                                                        <input @onafterpaste="keyupFun(it,'timesLimitValue')" @keyup="keyupFun(it,'timesLimitValue')" :class="{x_border_error:it.notNull}" type="tel" @click.stop="" v-model='it.timesLimitValue' />次
                                                    </el-checkbox>
                                                </li>
                                            </ul>
                                        </el-checkbox-group>
                                    </td>
                                    <td>
                                        <!-- 消费时间限制 -->
                                        <el-radio-group v-model="dateLimitDatas">
                                            <ul>
                                                <li v-for='(it,ix) in  dateLimit'>
                                                    <el-radio :key="it.dateLimitType" :label='it.dateLimitType'>
                                                        <span v-if='it.dateLimitType===0'>
                                                            {{it.dateLimitName}}
                                                        </span>
                                                        <span v-else>
                                                            {{it.dateLimitName}}
                                                            <input @onafterpaste="keyupFun(it,'dateLimitValue')" @keyup="keyupFun(it,'dateLimitValue')" :class="{x_border_error:it.notNull}" type="tel" v-model="it.dateLimitValue" @click.stop="" />天
                                                        </span>
                                                    </el-radio>
                                                </li>
                                            </ul>
                                        </el-radio-group>
                                    </td>
                                    <td v-if='isSingel'>
                                        <!-- 余额扣减 -->
                                        <el-radio-group v-model="debitWayDatas">
                                            <ul>
                                                <li v-for='it in  debitWay'>
                                                    <el-radio :key="it.debitWayType" :label='it.debitWayType'>
                                                        {{it.debitWayName}}
                                                    </el-radio>
                                                    <input @onafterpaste="keyupFun(it,'debitWayValue')" @keyup="keyupFun(it,'debitWayValue')" v-if='it.debitWayType===1' :class="{x_border_error:it.notNull}" type="tel" v-model="it.debitWayValue" />
                                                </li>
                                            </ul>
                                        </el-radio-group>
                                    </td>
                                    <td v-if='isSingel'>
                                        <!-- 过期处置 -->
                                        <el-radio-group v-model="expireHandleDatas">
                                            <ul>
                                                <li v-for='it in  expireHandle'>
                                                    <el-radio :key="it.expireHandleType" :label='it.expireHandleType'>
                                                        {{it.expireHandleName}}
                                                    </el-radio>
                                                </li>
                                            </ul>
                                        </el-radio-group>
                                    </td>
                                    <td>
                                        <!-- 开票方式 -->
                                        <el-radio-group v-model="billingWayDatas">
                                            <ul>
                                                <li v-for='it in  billingWay'>
                                                    <el-radio :key="it.billingWayType" :label='it.billingWayType'>
                                                        {{it.billingWayName}}
                                                    </el-radio>
                                                </li>
                                            </ul>
                                        </el-radio-group>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="btn_wrap">
                            <Button Name="保存" @click.native.stop="saveBtn()"></Button>
                        </div>
                    </div>
                </div>
                <div class="table_content">
                    <div class="table-wrap">
                        <div class='add_header'>
                            <i class="icon x_iconsign"></i>
                            产品信息
                        </div>
                        <el-table :data="products" border style="width: 100%" align='left'>
                            <el-table-column prop="prodCode" label="产品编号" width="300">
                            </el-table-column>
                            <el-table-column prop="prodName" label="产品名称" width="400">
                            </el-table-column>
                            <el-table-column>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import Button from "../../common/Button";
import Paging from "../../common/Paging";
import Input from "../../common/Input";
export default {
    components: { Button, Paging, Input },
    // props:[values,],
    data() {
        return {

            //isSingel
            isSingel: true,

            //消费次数限制选择数据
            timesLimitDatas: [],

            //单客购买上限选择数据
            purchaseLimitDatas: 0,

            //支付方式购买上限
            payWayDatas: 0,

            //购买渠道
            purchaseWayDatas: 0,

            //消费时间限制
            dateLimitDatas: 0,

            //开票方式
            billingWayDatas: 2,

            //余额扣减
            debitWayDatas: 0,

            //过期处置
            expireHandleDatas: 0,


            //产品
            products: [],

            //修改 数据
            rules: {
                billingWay: [{
                    billingWayType: "",
                    billingWayName: "",
                    billingWayValue: "",
                    // isChecked: false
                }],
                dateLimit: [{
                    dateLimitType: "",
                    dateLimitName: "",
                    dateLimitValue: "",
                    // isChecked: false
                }],
                payWay: [{
                    payWayType: "",
                    payWayName: "",
                    payWayValue: "",
                    // isChecked: false
                }],
                purchaseLimit: [{
                    purchaseLimitType: "",
                    purchaseLimitName: "",
                    purchaseLimitValue: "",
                    // isChecked: false
                }],
                purchaseWay: [{
                    purchaseWayType: "",
                    purchaseWayName: "",
                    purchaseWayValue: "",
                    // isChecked: false
                }],
                expireHandle: [{
                    expireHandleType: "",
                    expireHandleName: "",
                    expireHandleValue: "",
                    // isChecked: false
                }],
                timesLimit: [
                    {
                        timesLimitType: "",
                        timesLimitName: "",
                        timesLimitValue: "",
                        // isChecked: false,
                    },
                    {
                        timesLimitType: "",
                        timesLimitName: "",
                        timesLimitValue: "",
                        // isChecked: false,
                    },
                    {
                        timesLimitType: "",
                        timesLimitName: "",
                        timesLimitValue: "",
                        // isChecked: false,
                    }
                ],
                //余额扣减
                debitWay: [
                    {
                        debitWayType: "",
                        debitWayValue: "",
                        debitWayName: "",
                        // isChecked: false
                    },
                ],
            },

            //购买渠道 select
            purchaseWay: [
                {
                    purchaseWayType: 0,
                    purchaseWayValue: "",
                    purchaseWayName: "无限制",
                    // isChecked: false
                },
                {
                    purchaseWayType: 1,
                    purchaseWayValue: "",
                    purchaseWayName: "仅门店",
                    // isChecked: false
                },
                {
                    purchaseWayType: 2,
                    purchaseWayValue: "",
                    purchaseWayName: "仅线上",
                    // isChecked: false
                },
                {
                    purchaseWayType: 3,
                    purchaseWayValue: "",
                    purchaseWayName: "不单卖",
                    // isChecked: false
                },
            ],

            //过期处置
            expireHandle: [
                {
                    expireHandleType: 0,
                    expireHandleValue: "",
                    expireHandleName: "禁止使用，剩余价值返回为可用余额",
                    // isChecked: false
                },
                {
                    expireHandleType: 1,
                    expireHandleValue: "",
                    expireHandleName: "禁止使用，剩余价值一次性清零",
                    // isChecked: false
                },

            ],

            //支付方式 select
            payWay: [
                {
                    payWayType: 0,
                    payWayValue: "",
                    payWayName: "无限制",
                    // isChecked: false
                },
                {
                    payWayType: 1,
                    payWayValue: "",
                    payWayName: "仅支付",
                    // isChecked: false
                },
                {
                    payWayType: 2,
                    payWayValue: "",
                    payWayName: "仅积分",
                    // isChecked: false
                },
            ],

            //单客购买上限
            purchaseLimit: [
                {
                    purchaseLimitType: 0,
                    purchaseLimitValue: "",
                    purchaseLimitName: "无限制",
                    // isChecked: false
                },
                {
                    purchaseLimitType: 1,
                    purchaseLimitValue: "",
                    purchaseLimitName: "同期限",
                    // isChecked: false
                    notNull: false,
                },
                {
                    purchaseLimitType: 2,
                    purchaseLimitValue: "",
                    purchaseLimitName: "总限制",
                    // isChecked: false
                    notNull: false,
                },
            ],

            //消费次数限制
            timesLimit: [
                {
                    timesLimitType: 0,
                    timesLimitValue: "",
                    timesLimitName: "日上限",
                    // isChecked: false,
                    notNull: false,
                },
                {
                    timesLimitType: 1,
                    timesLimitValue: "",
                    timesLimitName: "周上限",
                    // isChecked: false,
                    notNull: false,
                },
                {
                    timesLimitType: 2,
                    timesLimitValue: "",
                    timesLimitName: "月上限",
                    // isChecked: false,
                    notNull: false,
                },
            ],

            //消费时间限制
            dateLimit: [
                {
                    dateLimitType: 0,
                    dateLimitValue: "",
                    dateLimitName: "无限制",
                    // isChecked: false

                },
                {
                    dateLimitType: 1,
                    dateLimitValue: "",
                    dateLimitName: "购买后",
                    // isChecked: false
                    notNull: false,

                },
                {
                    dateLimitType: 2,
                    dateLimitValue: "",
                    dateLimitName: "启用后",
                    // isChecked: false
                    notNull: false,

                }
            ],

            //开票方式
            billingWay: [
                {
                    billingWayType: 0,
                    billingWayValue: "",
                    billingWayName: "当次",
                    // isChecked: false
                },
                {
                    billingWayType: 1,
                    billingWayValue: "",
                    billingWayName: "月底",
                    // isChecked: false
                },
                {
                    billingWayType: 2,
                    billingWayValue: "",
                    billingWayName: "不开",
                    // isChecked: false
                },
            ],

            //余额扣减
            debitWay: [
                {
                    debitWayType: 0,
                    debitWayValue: "",
                    debitWayName: "每次消费后扣（按折后价）",
                    // isChecked: false
                },
                {
                    debitWayType: 1,
                    debitWayValue: "",
                    debitWayName: "每月预扣（按有效月均摊）",
                    // isChecked: false
                    notNull: false,
                },
                {
                    debitWayType: 2,
                    debitWayValue: "",
                    debitWayName: "不扣",
                    //                     // isChecked: false
                },
            ],
            isSubSta: 0,
            newArr: [],
        }


    },

    methods: {
        keyupFun(it, key) {
            if (it[key].length === 1) {
                it[key] = it[key].replace(/[^1-9]/g, '')
            } else if (it[key].length > 1) {
                it[key] = it[key].replace(/[^0-9]/g, '')
            } else {
                it[key] = it[key].replace(/\D/g, '')
            }
        },

        //赋值
        editFun(el) {
            //消费次数限制
            if (el === "timesLimit") {
                this.timesLimit.map((item, index) => {
                    this.timesLimitDatas.map(el => {
                        if (item.timesLimitType == el) {
                            let obj = {};
                            obj.timesLimitName = item.timesLimitName;
                            obj.timesLimitValue = item.timesLimitValue;
                            obj.timesLimitType = item.timesLimitType;
                            if (item.timesLimitValue === '') {
                                item.notNull = true;
                                this.isSubSta++
                            } else {
                                item.notNull = false;
                                this.newArr.push(obj)
                            }
                            // obj.isChecked = true;

                        };
                    })
                });
                return this.newArr
            } else {
                let name = el + 'Name';
                let type = el + 'Type';
                let value = el + 'Value';
                let datas = el + 'Datas';
                let rules = this.rules;
                this[el].map((item, index) => {
                    if (item[type] === this[datas]) {
                        if (el === "purchaseLimit" && item[type] > 0) {
                            rules[el][0][type] = item[type];
                            rules[el][0][name] = item[name];
                            if (item[type] > 0 && item[value] === '') {
                                item.notNull = true;
                                this.isSubSta++
                            } else {
                                rules[el][0][value] = item[value];
                                item.notNull = false;
                            }
                        } else if (item[type] === 1 && el === "dateLimit") {
                            rules[el][0][type] = item[type];
                            rules[el][0][name] = item[name];
                            if (item[value] === '') {
                                item.notNull = true;
                                this.isSubSta++
                            } else {
                                rules[el][0][value] = item[value];
                                item.notNull = false;
                            }
                        } else if (el === 'debitWay' && item[type] === 1) {
                            rules[el][0][type] = item[type];
                            rules[el][0][name] = item[name];
                            if (item[value] === '') {
                                item.notNull = true;
                                this.isSubSta++
                            } else {
                                rules[el][0][value] = item[value];
                                item.notNull = false;
                            }
                        } else {
                            rules[el][0][type] = item[type];
                            rules[el][0][name] = item[name];
                            rules[el][0][value] = item[value];
                        };
                        // rules[el][0].isChecked = true;
                        return rules;
                    }
                });
            }
        },

        //单个修改 保存
        saveBtn() {
            this.isSubSta = 0;
            //购买渠道
            this.editFun("purchaseWay");
            //过期处置
            this.editFun("expireHandle")

            //支付方式
            this.editFun("payWay");

            //单客购买上限
            this.editFun("purchaseLimit");

            this.editFun("timesLimit");

            //消费时间限制
            this.editFun("dateLimit");

            //开票方式billingWay
            this.editFun("billingWay");

            //余额扣减
            this.editFun("debitWay");

            this.rules.timesLimit = this.newArr
            let par = {
                accessToken: this.$getCookie("accessToken"),
                prodIds: JSON.parse(this.$route.query.ids),
                rules: this.rules
            }
            if (this.isSubSta > 0) {
                this.$message({
                    type: 'warning',
                    message: '红色下划线处为必填项!',
                    duration: "3000",
                    onClose: () => {
                    }
                });
            } else {
                this.$post(this.$host + "/api/prod/rules/editRules", par)
                    .then(d => {
                        if (d.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!',
                                duration: "1000",
                                onClose: () => {
                                }
                            });
                            history.back(-1)
                        }
                    });
            }

        },



    },
    mounted() {
        if (this.$route.query.type === '_singel') {
            let jsonArr = JSON.parse(this.$route.query.rules);
            for (let key in jsonArr) {
                if (key != undefined) {
                    let val = key + 'Datas';
                    let type = key + 'Type';
                    let value = key + 'Value';
                    let name = key + 'Name';
                    jsonArr[key].map(el => {
                        if (key == "timesLimit") {
                            this[val].push(el[type])
                            this[key].map(ts => {
                                if (ts[type] === el[type]) {
                                    ts[value] = el[value]
                                }
                            })
                        } else {
                            this[val] = el[type];
                            this[key].map(va => {
                                if (va[type] === this[val]) {
                                    va[value] = el[value];
                                }
                            })
                        }
                    });

                }
            }
        } else {
            this.isSingel = false;
        }

        let par = {
            accessToken: this.$getCookie("accessToken"),
            prodIds: JSON.parse(this.$route.query.ids)
        }
        //
        this.$post(this.$host + "/api/prod/rules/prodList", par)
            .then(d => {
                if (d.success) {
                    this.products = d.data;
                }
            });

    }

}

</script>
<style scoped>
@import "../../../../static/commonStyle.css";

.batch_edit_rule table tbody td {
    text-align: left;
    vertical-align: top;
    padding-left: 6px;
}

table td input {
    width: 50px;
    height: 14px;
    line-height: 14px !important;
    border: 0;
    padding: 0;
    border-radius: 0;
    border-bottom: 1px solid #ccc;
    background: transparent;
}

table td input:focus {
    border-top: 0;
    border-left: 0;
    border-right: 0;
}
table td li {
    margin: 3px 0;
    cursor: pointer;
    height: 20px;
}

.table-wrap {
    margin-bottom: 24px;
}

.btn_wrap {
    margin: 24px 0;
    text-align: center;
}
</style>
<style>
.batch_edit_rule .el-radio__label,
.batch_edit_rule .el-radio {
    font-size: 12px;
}
.batch_edit_rule .el-select {
    width: 120px;
}

.batch_edit_rule .el-checkbox__input {
    vertical-align: top;
}
.batch_edit_rule .el-checkbox,
.el-checkbox__label {
    vertical-align: top;
}
</style>



