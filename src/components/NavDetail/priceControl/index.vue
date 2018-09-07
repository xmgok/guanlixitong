<template>
    <div class="right_content_wrap">
        <div class="search_wrap">
            <ul>
                <li>
                    <span>
                        产品名称：
                    </span>
                    <input type="text" v-model='searchProduct.prodKey' />
                </li>
                <li>
                    <Button Name="查询" @click.native="getProduct" Search="true"></Button>
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
                    <!-- <table class="Tablesdf">
                        <thead>
                            <tr>
                                <th style="width:50px;">
                                    <i :class="['x_unchecked','icon',{'x_checked':checkedAll}]" @click.stop="checkAll()"></i>
                                </th>
                                <th style="width:160px;">
                                    编号
                                </th>
                                <th>
                                    产品名称
                                </th>
                                <th>
                                    原价
                                </th>
                                <th v-for='(it,ix) in level'>
                                    {{it.levName}}
                                </th>

                                <th style='width: 120px;'>
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in products" :class="{selectTr:item.isChecked}">

                                <td>
                                    <i @click="selectTr(item)" :class="['x_unchecked','icon',{'x_checked':item.isChecked}]"></i>
                                </td>
                                <td>
                                    {{item.prodCode}}
                                </td>
                                <td>
                                    {{item.name}}
                                </td>
                                <td>
                                    ￥{{item.price}}
                                </td>
                                <td v-for='(it,ix) in item.priceRules'>
                                    <div>
                                        <span v-if='item.priceRules[ix].isFit===0'>
                                            不适用
                                        </span>
                                        <span v-if='item.priceRules[ix].isFit===1'>
                                            ￥{{item.priceRules[ix].price}}
                                        </span>
                                    </div>

                                </td>
                                <td>
                                    <Button small="Btn small" Name="修改" @click.native.stop="edit(item)"></Button>

                                </td>

                            </tr>

                        </tbody>
                    </table> -->
                    <el-table :data="products" ref='eTable' border style="width: 100%" align='left' @selection-change="selectDatasFun" :row-key='rowKey'>
                        <template v-for='(item,$item) in tableLabel'>
                            <el-table-column v-if='item.isType==="selection"' type="selection" width="55" :key='$item'>
                            </el-table-column>
                            <el-table-column v-if='item.isType==="column"' :prop='item.prop' :width='item.width' :label='item.label' :key='$item'>
                            </el-table-column>
                            <el-table-column v-if='item.isType==="button"' :label='item.label' :width='item.width' :fixed='item.fixed' :key='$item'>
                                <template slot-scope="scope">
                                    <Button small="Btn small" Name="修改" @click.native.stop="edit(scope.row,scope.$index)"></Button>
                                </template>
                            </el-table-column>
                        </template>
                        <el-table-column min-width='1' fixed="right">
                        </el-table-column>
                    </el-table>
                    <div class="pagingwidth">
                        <Paging :handleCurrentChange="getProduct" :total="total" />
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
import Vue from "vue";
import { Radio, Select, Option, Checkbox, Switch } from "element-ui";
Vue.use(Radio);
Vue.use(Select);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(Switch);
export default {
    components: { Button, Paging, Input },
    // props:[values,],
    data() {
        return {
            radio: 0,
            //搜索 
            width: 26,
            //全选
            checkedAll: false,
            Lines: 10,
            //总条数
            total: 1,
            pageNum: "",

            tableLabel: [
                {
                    isType: 'selection',
                    width: '55',
                },
                {
                    isType: 'column',
                    prop: 'name',
                    label: '产品名称',
                    width: '180'
                },
                {
                    isType: 'column',
                    prop: 'prodCode',
                    label: '编号',
                    width: '100'
                },
                {
                    isType: 'column',
                    prop: 'price',
                    label: '原价',
                    width: '100'
                },
                {
                    isType: 'button',
                    label: '操作',
                    fixed: 'right',
                    width: '100'
                }

            ],

            //搜索
            searchProduct: {
                prodKey: "",
            },
            //产品
            products: [],

            //预存产品
            preProducts: [],

            //会员
            level: [],

            //批量修改   产品 id

            selectDatas: [],
        }
    },

    methods: {
        rowKey(row) {
            return row.id;
        },
        //
        selectDatasFun(val) {
            this.selectDatas = val;
        },

        //批量修改按钮
        batchEditBtn() {
            if (this.selectDatas.length == 0) {
                this.$message.error(
                    {
                        type: 'warning',
                        message: '请选择产品!',
                        duration: "1000",
                    }
                );
            } else {
                let ids = [];
                this.selectDatas.map(el => {
                    ids.push(el.id)
                })

                this.$router.push({
                    path: "/NavDetail/batchEditPrice",
                    query: {
                        ids: JSON.stringify(ids),
                        type: '_more'
                    }
                });
            }
        },



        //单个修改
        edit(item) {
            let ids = JSON.stringify([item.id])
            this.$router.push({
                path: "/NavDetail/batchEditPrice",
                query: {
                    ids: ids,
                    type: '_singel',
                    price: item.price,
                    rules: JSON.stringify(item.priceRules)
                }
            });
        },





        //搜索重置
        reset() {
            this.searchProduct = {
                prodKey: "",
            };
            this.getProduct(1)
        },

        //获取产品列表
        getProduct(index) {
            let par = {
                prodClass: this.$route.query.num,
                pageNumber: parseInt(index),
                pageSize: 20,
            }
            for (let key in this.searchProduct) {
                if (this.searchProduct[key] !== '') {
                    par[key] = this.searchProduct[key];
                }
            };
            this.$post(this.$host + "/api/prod/price/findPageList", par)
                .then(d => {
                    if (d.success) {
                        this.total = d.data.total;
                        this.products = JSON.parse(JSON.stringify(d.data.content));
                        if (this.tableLabel.length === 5) {
                            this.$post(this.$host + "/api/cust/lev/queryall", {})
                                .then(r => {
                                    if (r.success) {
                                        r.data.map((el, ix) => {
                                            let obj = {}
                                            obj.isType = 'column';
                                            obj.width = '140';
                                            obj.label = el.levName;
                                            obj.prop = "levid" + el.id;
                                            this.tableLabel.push(obj);
                                        })
                                        this.level = r.data;

                                        this.products.map(el => {
                                            el.priceRules.map(va => {
                                                let levid = "levid" + va.lvlId;
                                                va.isFit === 0 ? el[levid] = '不适用' : el[levid] = "￥" + va.price;
                                            })
                                        })
                                    }
                                });
                        }
                        this.products.map(el => {
                            el.priceRules.map(va => {
                                let levid = "levid" + va.lvlId;
                                va.isFit === 0 ? el[levid] = '不适用' : el[levid] = "￥" + va.price;
                            })
                        })
                    }
                });
        },
    },
    activated() {
        
    },
    mounted() {
        this.getProduct(1)
    }

}

</script>
<style scoped>
@import "../../../../static/commonStyle.css";
/* .search_wrap li:last-child {
  margin-left: 24px;
} */
.search_wrap ul::after {
    content: "";
    display: block;
    clear: both;
}

.unchecked {
    background-color: #fff;
    vertical-align: middle;
    margin-right: 10px;
}
table tbody td {
    text-align: left;
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
table td li {
    margin: 1px 0;
    cursor: pointer;
}
/* table td li.selected {
  color: #386b88;
} */
.table-wrap {
    width: 100%;
}
.btn_wrap {
    margin-bottom: 12px;
}
</style>
<style>
.el-radio__label,
.el-radio {
    font-size: 12px;
}
.el-select {
    width: 120px;
}
.el-switch__core {
    height: 14px;
}
.el-switch__core .el-switch__button {
    top: 0;
    width: 12px;
    height: 12px;
}
.is-checked .el-switch__core .el-switch__button {
    transform: translate3d(10px, 0px, 0px) !important;
}
</style>


