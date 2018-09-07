<template>
    <div class="right_content_wrap batch_edit_rule">
        <div class="right_content">
            <div class="table_content edit_table">
                <div class='add_header'>
                    <i class="icon x_iconsign"></i>
                    价格规则编辑
                </div>
                <table class="Tablesdf batch_tab">
                    <thead>
                        <tr>
                            <th v-if='isSingel' style='width: 120px;'>原价</th>
                            <th v-for="(it,ix) in level" :key='ix'>
                                {{it.levName}}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-if='isSingel'>￥{{price}}</td>
                            <td v-for='(it,ix) in level' :key="ix">
                                <ul>
                                    <li>
                                        适用：
                                        <el-switch v-model="it.isChecked" :width="width">
                                        </el-switch>
                                    </li>
                                    <li>
                                        折扣：
                                        <input type="text" v-model='it.discount' placeholder="" @keyup="editDiscount(it,ix)" />%
                                    </li>
                                    <li v-if='isSingel'>
                                        价格： ￥ <input type="text" v-model='it.price' placeholder="" @keyup="editPrice(it,ix)" />
                                    </li>
                                </ul>
                            </td>

                        </tr>
                    </tbody>
                </table>

                <div class="btn_wrap">
                    <Button Name="保存" @click.native.stop="saveBtn()"></Button>
                </div>
            </div>
            <div class="table_content">
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
</template>
<script>
import Button from "../../common/Button";
import Paging from "../../common/Paging";
import Input from "../../common/Input";
import Vue from "vue";
import { Radio, } from "element-ui";
Vue.use(Radio);
export default {
    components: { Button, Paging, Input },
    // props:[values,],
    data() {
        return {
            isSingel: true,

            width: 26,

            //产品
            products: [],

            rules: '',

            //level
            level: "",

            price: this.$route.query.price,
        }
    },

    methods: {


        // //修改折扣
        editDiscount(val, ix) {
            let bol = false;
            let reg = /^((?!0)\d{1,2}|100)$/;
            if (!val.discount.match(reg)) {
                val.discount = ''
            } else {
                val.discount = val.discount
            }
            if (this.$route.query.type === '_singel') {
                val.price = (val.discount / 100 * this.price).toFixed(2);
            }

        },

        // //修改价格
        editPrice(val, ix) {
            if (this.$route.query.type === '_singel') {
                val.discount = (val.price / this.price).toFixed(2) * 100
            }
        },

        //单个修改 保存
        saveBtn() {
            let arr = []
            this.level.map(el => {
                let obj = {};
                if (el.isChecked === true) {
                    el.isFit = 1;
                } else {
                    el.isFit = 0;
                };
                obj.isFit = el.isFit;
                obj.lvlId = el.id;
                obj.discount = el.discount;
                obj.price = el.price;
                arr.push(obj)
            });
            let par = {
                prodIds: JSON.parse(this.$route.query.ids),
                priceRules: arr
            }
            this.$post(this.$host + "/api/prod/price/editPriceRules", par)
                .then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration: "1000",
                        });
                        history.back(-1);
                    }
                });
        },



    },
    mounted() {
        if (this.$route.query.type === '_more') {
            this.isSingel = false;
        }
        let par = {
            prodIds: JSON.parse(this.$route.query.ids)
        }
        this.$post(this.$host + "/api/prod/rules/prodList", par)
            .then(d => {
                if (d.success) {
                    this.products = d.data;
                }
            });

        let data = {
        };
        this.$post(this.$host + "/api/cust/lev/queryall", data)
            .then(d => {
                if (d.success) {
                    let rules = '';
                    if (this.$route.query.type === '_singel') {
                        rules = JSON.parse(this.$route.query.rules);
                        d.data.map((el, ix) => {
                            el.discount = rules[ix].discount;
                            el.isFit = rules[ix].isFit;
                            rules[ix].isFit === 1 ? el.isChecked = true : el.isChecked = false;
                            el.price = rules[ix].price;
                        })
                    } else {
                        d.data.map((el, ix) => {
                            el.discount = el.discountRate;
                            el.isChecked = true;
                            el.isFit = 1;
                            el.price = '';
                        })
                    };
                    this.level = d.data;
                }
            });

    }

}

</script>
<style scoped>
@import "../../../../static/commonStyle.css";

.table_content {
    margin-bottom: 24px;
}
.edit_table table td {
    text-align: left;
    padding-bottom: 6px;
}

table td input {
    width: 60px;
    /* height: 16px;
  line-height: 16px; */
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
.batch_edit_rule .el-switch__core {
    height: 14px;
}
.batch_edit_rule .el-switch__core .el-switch__button {
    top: 0;
    width: 12px;
    height: 12px;
}
.batch_edit_rule .is-checked .el-switch__core .el-switch__button {
    transform: translate3d(10px, 0px, 0px) !important;
}
</style>


