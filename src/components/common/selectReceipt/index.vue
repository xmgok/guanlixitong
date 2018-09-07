<template>
    <div class="selectReceipt">
        <div class="model">
            <header class="Header clearfix">
                <div class="left">选择会员</div>
                <div class="right">
                    <i class="icon iconclose" @click="cancleReceipt"></i>
                </div>
            </header>
            <div class="modelbody">
                <header>
                    会员：
                    <Input placeholder="会员编号/姓名/手机" :value="cCodeOrNameOrPhone" arguName="cCodeOrNameOrPhone" @sonInput="upInput" />
                    <Button Name="查询" @click.native="demand" />
                </header>
                <!-- <Table  :TabelHeader="TabelHeader" :Tbody="Tbody"  :datas="CustomerDatas" :queryRole="queryRole"/> -->
                <!-- <div class="layout"> -->
                <div v-if="len==0" class="no_cust">
                    该门店暂无会员
                </div>
                <el-table v-if='len>0' :data="CustomerDatas" border @row-dblclick='handleRowHandle' @current-change="setCurrentRow" highlight-current-row>
                    <el-table-column prop="cCode" label="会员编号" width="120"></el-table-column>
                    <el-table-column prop="cName" label="会员名称" width="202"></el-table-column>
                    <el-table-column prop="cPhone" label="会员手机" width="120"></el-table-column>
                    <el-table-column prop="levName" label="会员等级" width="120"></el-table-column>
                </el-table>
                <!-- </div> -->
                <div class="paging_wrap">
                    <Paging :handleCurrentChange="handleCurrentChange" :total="total" v-show="total>10" :pageSize="10" />

                </div>
            </div>
            <div class="Footer">
                <Button Name="取消" buttonClass="None" @click.native="cancleReceipt" />
                <Button Name="确定" @click.native="sureselectReceipt(activeItem)" />
            </div>
        </div>
        <MTk />
    </div>
</template>
<script>
import Button from "../Button";
import Paging from "../Paging";
import Table from "../Table";
import Input from "../Input";
import MTk from "../Mtk";
export default {
    components: {
        Paging, Button, Table, Input, MTk
    },
    data() {
        return {
            cCodeOrNameOrPhone: "",
            CustomerDatas: [],
            total: 1,
            TabelHeader: [
                { detail: "会员编号", width: "100px" },
                { detail: "会员名称", width: "250px" },
                { detail: "会员手机", width: "100px" },
                { detail: "会员等级", width: "100px" },
            ],
            Tbody: ["cCode", "cName", "cPhone", "levName"],
            activeItem: {},
            len: '',
        }
    },
    props: {
        cancleReceipt: {
            type: Function,
            default: () => { }
        },
        sureselectReceipt: {
            type: Function,
            default: () => { }
        },
        sCode: {
            default: '',
        }
    },
    methods: {
        setCurrentRow(row) {
            this.activeItem = row;
        },
        handleRowHandle(row) {
            this.activeItem = row;
            this.sureselectReceipt(row);
        },
        upInput(value, arguName) {
            this[arguName] = value;
            console.log(arguName)
        },
        demand() {
            if (this.cCodeOrNameOrPhone == "") {
                this.getCustomerDatas();
                return;
            }
            let data = {
                pageNumber: 1,
                pageSize: 10,
                cCodeOrNameOrPhone: this.cCodeOrNameOrPhone
            }
            this.$post(this.$host + "/api/cust/customer/page", data).then(d => {
                if (d.success) {
                    let content = d.data.content;
                    content.map(el => {
                        el.active = false;
                    })
                    this.CustomerDatas = content;
                    this.buquanDatas();
                    this.total = d.data.total;
                }
            })
        },
        handleCurrentChange(index) {
            let data = {
                pageNumber: parseInt(index),
                pageSize: 10,
                sCode: this.$getCookie("belongShop"),
                cCodeOrNameOrPhone: this.cCodeOrNameOrPhone
            }
            this.$post(this.$host + "/api/cust/customer/page", data).then(d => {
                if (d.success) {
                    let content = d.data.content;
                    content.map(el => {
                        el.active = false;
                    })
                    this.CustomerDatas = content;
                    this.buquanDatas();
                    this.total = d.data.total;
                }
            })
        },
        queryRole(index, item) {
            this.CustomerDatas.map((v, i) => {
                v.active = false;
                if (i == index) {
                    v.active = true;
                }
            });
            this.activeItem = item;
        },
        //获取自己门店下的会员数据
        getCustomerDatas() {
            let data = {
                pageNumber: 1,
                pageSize: 10,
                sCode: this.$getCookie("belongShop") || this.sCode
            }
            this.$post(this.$host + "/api/cust/customer/page", data).then(d => {
                if (d.success) {
                    this.len = d.data.content.length;
                    let content = d.data.content;
                    content.map(el => {
                        el.active = false;
                    })
                    this.CustomerDatas = content;
                    this.buquanDatas();
                    this.total = d.data.total;
                }
            })
        },
        buquanDatas() {
            if (this.CustomerDatas.length < 10) {
                let length = 10 - this.CustomerDatas.length;
                for (let i = 0; i < length; i++) {
                    this.CustomerDatas.push({})
                }
            }
        },
    },
    watch: {
        sCode: 'getCustomerDatas'
    },
    mounted() {
        this.getCustomerDatas();
    }
}
</script>
<style scoped>
.Paging {
    text-align: right;
}
.no_cust {
    margin: 24px 12px;
}
.model {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 1000;
    width: 600px;
    border-radius: 4px;
    transform: translate(-50%, -50%);
    background: #fff;
}
.paging_wrap {
    text-align: right;
    margin-top: 12px;
}
.model .Header {
    padding: 1rem;
    font-size: 16px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin-bottom: 10px;
}
.model .modelbody {
    padding: 0 18px;
}
.model .Footer {
    text-align: center;
    padding: 2rem 0;
}
.model .Footer button:last-child {
    margin-left: 24px;
}
.model .modelbody header {
    padding: 1rem 0;
}
</style>

<style>
.selectReceipt .el-table__fixed {
    min-height: 60px !important;
}
</style>
