<template>
    <div class="right_content_wrap">
        <div class="search_wrap">
            <ul>
                <li>
                    <span>
                        产品名称：</span>
                    <input type="text" v-model='searchProduct.name' />
                </li>
                <li>
                    <span>购买渠道：</span>
                    <el-select v-model="searchProduct.purchaseWayType" placeholder="请选择" clearable>
                        <el-option v-for="item in purchaseWay" :key="item.purchaseWayType" :label="item.purchaseWayName" :value="item.purchaseWayType">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>支付方式：</span>
                    <el-select v-model="searchProduct.payWayType" placeholder="请选择" clearable>
                        <el-option v-for="item in payWay" :key="item.payWayType" :label="item.payWayName" :value="item.payWayType">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>单客购买上限：</span>
                    <el-select v-model="searchProduct.purchaseLimitType" placeholder="请选择" clearable>
                        <el-option v-for="item in purchaseLimit" :key="item.purchaseLimitType" :label="item.purchaseLimitName" :value="item.purchaseLimitType">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>消费次数限制：</span>
                    <el-select v-model="searchProduct.timesLimitType" placeholder="请选择" clearable>
                        <el-option v-for="item in timesLimit" :key="item.timesLimitType" :label="item.timesLimitName" :value="item.timesLimitType">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>消费时间限制：</span>
                    <el-select v-model="searchProduct.dateLimitType" placeholder="请选择" clearable>
                        <el-option v-for="item in dateLimit" :key="item.dateLimitType" :label="item.dateLimitName" :value="item.dateLimitType">
                        </el-option>
                    </el-select>
                </li>

                <li>
                    <span>开票方式：</span>
                    <el-select v-model="searchProduct.billingWayType" placeholder="请选择" clearable>
                        <el-option v-for="item in billingWay" :key="item.billingWayType" :label="item.billingWayName" :value="item.billingWayType">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <Button Name="查询" @click.native="query" Search="true"></Button>
                    <Button Name="重置" @click.native="reset" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="right_content">
            <div class="btn_wrap">
                <Button Name="批量修改" @click.native="batchEditBtn()"></Button>
            </div>
            <div class="table_content">
                <div class="table-wrap">

                    <el-table :data="products" ref='eTable' border style="width: 100%" align='left' @selection-change="selectDatasFun">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <!-- <el-table-column prop="refundNo" label="退款单号" width="180" fixed='left'>
                            <template slot-scope="scope">
                                <Button small="Btn small" :Name="scope.row.refundNo" @click.native="seeDetail(scope.row)"></Button>
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="prodCode" label="编号" width="110" fixed='left'>
                        </el-table-column>
                        <el-table-column prop="name" label="产品名称" width="200">
                        </el-table-column>
                        <el-table-column label="购买渠道" width="120">
                            <template slot-scope="scope">
                                <!-- 购买渠道 -->
                                <ul>
                                    <li v-if='scope.row.jsonRules.purchaseWay===undefined'>无限制</li>
                                    <li v-for='(im,ix) in scope.row.jsonRules.purchaseWay'>
                                        {{im.purchaseWayName}}
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式" width="180">
                            <template slot-scope="scope">
                                <!-- 支付方式 -->
                                <ul>
                                    <li v-if='scope.row.jsonRules.payWay===undefined'>无限制</li>
                                    <li v-for='(im,ix) in scope.row.jsonRules.payWay'>
                                        <span v-if='im.payWayType===0'>
                                            {{im.payWayName}}
                                            <span v-if='im.payWayValue!=""'>,积分最高可购 ￥</span>{{im.payWayValue}}
                                        </span>
                                        <span v-if='im.payWayType!==0'>
                                            {{im.payWayName}}{{im.payWayValue}}
                                        </span>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                        <el-table-column label="单客购买上限" width="140">
                            <template slot-scope="scope">
                                <!-- 单客购买上线 -->
                                <ul>
                                    <li v-if='scope.row.jsonRules.purchaseLimit===undefined'>无限制</li>
                                    <li v-for='(im,ix) in scope.row.jsonRules.purchaseLimit' v-if='im.purchaseLimitType!==""'>
                                        {{im.purchaseLimitName}} {{im.purchaseLimitValue}}
                                        <span v-if='im.purchaseLimitType!==0'>
                                            次
                                        </span>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                        <el-table-column label="消费次数限制" width="140">
                            <template slot-scope="scope">

                                <!-- 消费次数限制 -->
                                <ul>
                                    <li v-if='scope.row.jsonRules.timesLimit===undefined||scope.row.jsonRules.timesLimit.length===0'>无限制</li>
                                    <li v-for='(it,ix) in scope.row.jsonRules.timesLimit' v-if='it.isChecked !== false'>
                                        <span>
                                            {{it.timesLimitName}}{{it.timesLimitValue}}
                                            <span v-if='it.timesLimitValue!=""'>次</span>

                                        </span>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                        <el-table-column label="消费时间限制" width="140">
                            <template slot-scope="scope">

                                <!-- 消费时间限制 -->
                                <ul>
                                    <li v-if='scope.row.jsonRules.dateLimit===undefined'>无限制</li>
                                    <li v-for='(im,ix) in scope.row.jsonRules.dateLimit'>
                                        <!-- {{im.dateLimitName}} -->
                                        <span v-if='im.dateLimitType===0'>
                                            {{im.dateLimitName}}
                                        </span>
                                        <span v-if='im.dateLimitType===1'>
                                            购买后{{im.dateLimitValue}}天
                                        </span>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="余额扣减" width="180">
                            <template slot-scope="scope">
                                余额扣减
                                <ul>
                                    <li v-for='(im,ix) in scope.row.jsonRules.debitWay'>
                                        {{im.debitWayName}}
                                    </li>
                                </ul>

                            </template>
                        </el-table-column> -->
                        <el-table-column label="开票方式" width="140">
                            <template slot-scope="scope">
                                <!-- 开票方式 -->
                                <ul>
                                    <li v-if='scope.row.jsonRules.billingWay===undefined'>不开</li>
                                    <li v-for='(im,ix) in scope.row.jsonRules.billingWay'>
                                        {{im.billingWayName}}
                                    </li>
                                </ul>

                            </template>
                        </el-table-column>
                        <el-table-column width="80" label="操作" fixed="right">
                            <template slot-scope="scope">
                                <Button small="Btn small" Name="修改" @click.native.stop="edit(scope.row,scope.$index)"></Button>
                            </template>
                        </el-table-column>
                        <el-table-column min-width='1' fixed="right">
                        </el-table-column>
                    </el-table>
                    <div class="pagingwidth">
                        <Paging :handleCurrentChange="gotoPage" :total="total" />
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
            //搜索 
            searchProduct: {
                name: "",
                purchaseWayType: "",//购买渠道
                payWayType: "",//支付方式
                purchaseLimitType: "",//单客购买上限
                timesLimitType: '',//消费次数限制
                dateLimitType: '',//消费时间限制
                billingWayType: ''//开票方式限制
            },

            //总条数
            total: 1,

            //产品
            products: [],


            //购买渠道 select
            purchaseWay: [
                {
                    purchaseWayType: 0,
                    purchaseWayValue: "",
                    purchaseWayName: "无限制",
                    isChecked: false
                },
                {
                    purchaseWayType: 1,
                    purchaseWayValue: "",
                    purchaseWayName: "仅门店",
                    isChecked: false
                },
                {
                    purchaseWayType: 2,
                    purchaseWayValue: "",
                    purchaseWayName: "仅线上",
                    isChecked: false
                },
                {
                    purchaseWayType: 3,
                    purchaseWayValue: "",
                    purchaseWayName: "不单卖",
                    isChecked: false
                },
            ],

            //支付方式 select
            payWay: [
                {
                    payWayType: 0,
                    payWayValue: "",
                    payWayName: "无限制",
                    isChecked: false
                },
                {
                    payWayType: 1,
                    payWayValue: "",
                    payWayName: "仅支付",
                    isChecked: false
                },
                {
                    payWayType: 2,
                    payWayValue: "",
                    payWayName: "仅积分",
                    isChecked: false
                },
            ],

            //单客购买上限
            purchaseLimit: [
                {
                    purchaseLimitType: 0,
                    purchaseLimitValue: "",
                    purchaseLimitName: "无限制",
                    isChecked: false
                },
                {
                    purchaseLimitType: 1,
                    purchaseLimitValue: "",
                    purchaseLimitName: "同期限",
                    isChecked: false
                },
                {
                    purchaseLimitType: 2,
                    purchaseLimitValue: "",
                    purchaseLimitName: "总限制",
                    isChecked: false
                },
            ],

            //消费次数限制
            timesLimit: [
                {
                    timesLimitType: 0,
                    timesLimitValue: "",
                    timesLimitName: "日上限",
                    isChecked: false,
                },
                {
                    timesLimitType: 1,
                    timesLimitValue: "",
                    timesLimitName: "周上限",
                    isChecked: false,
                },
                {
                    timesLimitType: 2,
                    timesLimitValue: "",
                    timesLimitName: "月上限",
                    isChecked: false,
                },
            ],

            //消费时间限制
            dateLimit: [
                {
                    dateLimitType: 0,
                    dateLimitValue: "",
                    dateLimitName: "无限制",
                    isChecked: false

                },
                {
                    dateLimitType: 1,
                    dateLimitValue: "",
                    dateLimitName: "有限制",
                    isChecked: false

                }
            ],

            //开票方式
            billingWay: [
                {
                    billingWayType: 0,
                    billingWayValue: "",
                    billingWayName: "当次",
                    isChecked: false
                },
                {
                    billingWayType: 1,
                    billingWayValue: "",
                    billingWayName: "月底",
                    isChecked: false
                },
                {
                    billingWayType: 2,
                    billingWayValue: "",
                    billingWayName: "不开",
                    isChecked: false
                },
            ],

            //扣款方式
            debitWay: [
                {
                    debitWayType: 0,
                    debitWayValue: "",
                    debitWayName: "每次消费后扣（按折后价）",
                    isChecked: false
                },
                {
                    debitWayType: 1,
                    debitWayValue: "",
                    debitWayName: "每月预扣",
                    isChecked: false
                },
                {
                    debitWayType: 2,
                    debitWayValue: "",
                    debitWayName: "不扣",
                    isChecked: false
                },
            ],

            //批量修改   产品 id
            batchDatasId: [],
            batchDatas: [],
            selectDatas: [],
        }
    },

    methods: {

        //批量修改按钮
        batchEditBtn() {
            this.getDataId();
            if (this.batchDatasId.length == 0) {
                this.$message.error(
                    {
                        type: 'warning',
                        message: '请选择产品!',
                        duration: "1000",
                    }
                );
            } else {
                let ids = JSON.stringify(this.batchDatasId)
                this.$router.push({
                    path: "/NavDetail/batchEditRule",
                    query: {
                        ids: ids,
                        type: '_more'
                    }
                });
            }
        },

        //单个修改
        edit(item) {
            let ids = JSON.stringify([item.id])
            this.$router.push({
                path: "/NavDetail/batchEditRule",
                query: {
                    ids: ids,
                    type: '_singel',
                    rules: JSON.stringify(item.jsonRules)
                }
            });
        },

        selectDatasFun(val) {
            this.selectDatas = val;
        },

        //获取选中id
        getDataId() {
            this.products.map((item, index) => {
                this.selectDatas.map((el, ix) => {
                    if (item.id === el.id && this.batchDatasId.indexOf(item.id) == -1) {
                        this.batchDatasId.push(item.id);
                        this.batchDatas.push(item);
                    } else if (item.id === el.id && this.batchDatasId.indexOf(item.id) > -1) {
                        this.batchDatasId.splice(this.batchDatasId.indexOf(el.id), 1);
                        this.batchDatas.splice(this.batchDatasId.indexOf(el.id), 1);
                    }
                })
            })
        },

        //反选
        invert() {
            this.products.map((item) => {
                if (this.batchDatasId.some(el => { return (item.id == el) })) {
                    this.$refs.eTable.toggleRowSelection(item, true)
                }
            })
        },

        //跳转分页
        gotoPage(index) {
            this.getDataId();
            let par = {
                accessToken: this.$getCookie("accessToken"),
                packType: 0,
                pageNumber: parseInt(index),
                pageSize: 20
            }
            this.getProduct(par);
        },


        //搜索
        query() {
            let par = {
                packType: 0,
                pageNumber: 1,
                pageSize: 20
            }
            for (let key in this.searchProduct) {
                if (this.searchProduct[key] !== '') {
                    par[key] = this.searchProduct[key];
                }
            }
            this.getProduct(par);
        },

        //搜索重置
        reset() {
            this.searchProduct = {
                name: "",
                purchaseWayType: "",//购买渠道
                payWayType: "",//支付方式
                purchaseLimitType: "",//单客购买上限
                timesLimitType: '',//消费次数限制
                dateLimitType: '',//消费时间限制
                billingWayType: ''//开票方式限制
            };
            let par = {
                accessToken: this.$getCookie("accessToken"),
                packType: 0,//查询产品服务
                pageNumber: 1,
                pageSize: 20,
            }
            //获取服务信息
            this.getProduct(par);
        },

        //获取产品列表
        getProduct(par) {
            this.$post(this.$host + "/api/prod/rules/findList", par)
                .then(d => {
                    if (d.success) {
                        // d.data.content.map((item, index) => {

                        // });
                        this.products = d.data.content;
                        this.total = d.data.total;
                        this.invert();
                    }
                });
        }

    },
    mounted() {
        let par = {
            accessToken: this.$getCookie("accessToken"),
            packType: 0,//查询产品服务
            pageNumber: 1,
            pageSize: 20,
        }
        //获取服务信息
        this.getProduct(par);
    }

}

</script>
<style scoped>
@import "../../../../static/commonStyle.css";

.xing1::after {
    content: "\e69b";
}

.icon {
    color: red;
}
.search_wrap ul::after {
    content: "";
    display: block;
    clear: both;
}

table tbody td {
    text-align: left;
}
table tbody td :nth-child(2) {
    margin-right: 0;
}
.unchecked {
    background-color: #fff;
    vertical-align: middle;
    margin-right: 10px;
}
table tbody td:last-child,
table tbody td:nth-child(3),
table tbody td:nth-child(2),
table tbody td:nth-child(1) {
    text-align: center;
}
table td input {
    width: 60px;
    height: 30px;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    background: transparent;
    text-align: center;
}
table td input:focus {
    border-top: 0;
    border-left: 0;
    border-right: 0;
}
table td:nth-child(2) .unchecked {
    margin: 0;
}
table td li {
    margin: 1px 0;
    cursor: pointer;
}
/* table td li.selected {
  color: #386b88;
} */
/* .table-wrap {
  min-width: 1200px;
} */
.btn_wrap {
    margin-bottom: 12px;
}
</style>
<style>
.el-radio__label,
.el-radio {
    font-size: 12px;
}
</style>


