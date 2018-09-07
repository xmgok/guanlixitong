<template>
    <div class="refund right_content_wrap">
        <div class="search_wrap">
            <ul>
                <!-- <li>
                    <span>
                        所在地区：
                    </span>
                    <getArea @getAreaCode='getAreaCode' />
                </li> -->
                <li>
                    <span>
                        部门：
                    </span>
                    <getCorpStore @getCorpStore="getCorpStore" :values='corpCodeArr' />
                </li>
                <li>
                    <span>
                        门店：
                    </span>
                    <Select :SelecttemData="storeDatas" :values="query.belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" />
                </li>
                <li>
                    <span>
                        会员：
                    </span>
                    <input class="x_input" type="text" v-model='query.customer' placeholder="会员编号/姓名/手机号码" />
                </li>
                <li>
                    <span>
                        申请日期：
                    </span>
                    <el-date-picker size='mini' clearable v-model="date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </li>
                <li>
                    <span>
                        审核状态：
                    </span>
                    <el-select clearable v-model="query.auditStus" placeholder="请选择">
                        <el-option v-for="item in auditStus" :key="item.key" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        退款状态：
                    </span>
                    <el-select clearable v-model="query.billStatus" placeholder="请选择">
                        <el-option v-for="item in billStatus" :key="item.key" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        <Button Name="查询" @click.native="gotoPage(1)" Search="true"></Button>
                        <Button Name="重置" @click.native="reset" Reset="true"></Button>
                    </span>
                </li>
            </ul>
        </div>

        <div class="right_content">
            <div class="btn_wrap" v-if="addShow">
                <Button :iconadd="true" Name="新增" @click.native="addRefundBtn('_add')"></Button>
            </div>
            <div>
                <el-table :data="datas" border style="width: 100%" align='left'>
                    <el-table-column prop="refundNo" label="退款单号" width="180" fixed='left'>
                        <template slot-scope="scope">
                            <Button small="Btn small" :Name="scope.row.refundNo" @click.native="seeDetail(scope.row)"></Button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cName" label="会员" width="120" fixed='left'>
                    </el-table-column>
                    <el-table-column prop="sName" label="门店" width="200">
                    </el-table-column>
                    <el-table-column prop="proposer" label="申请人" width="100">
                    </el-table-column>
                    <el-table-column prop="createTime" label="申请日期" width="130">
                    </el-table-column>
                    <el-table-column prop="amount" label="余额退还" width="100">
                    </el-table-column>
                    <el-table-column prop="compAmount" label="补偿金额" width="100">
                    </el-table-column>
                    <el-table-column prop="auditStus" label="审核状态" width="100">
                    </el-table-column>
                    <el-table-column prop="backDate" label="退款日期" width="130">
                    </el-table-column>
                    <el-table-column prop="billStatus" label="退款状态" width="130">
                    </el-table-column>
                    <el-table-column width="300" label="操作" fixed='right'>
                        <template slot-scope="scope">
                            <Button small="Btn small" Name="查看审批进度" @click.native="seeApprovals(scope.row)"></Button>
                            <i v-if='scope.row.repealStatus&&cancleShow' class="cut_off_rule"></i>
                            <Button v-if='scope.row.repealStatus&&cancleShow' small="Btn small" Name="撤销" @click.native="revocationRefund(scope.row)"></Button>
                            <i v-if=' scope.row.isReissue' class="cut_off_rule"></i>
                            <Button small="Btn small" v-if=' scope.row.isReissue' Name="重新发起" @click.native="addRefundBtn('_add',scope.row)"></Button>
                            <i v-if=' scope.row.refundStatus&&refundShow' class="cut_off_rule"></i>
                            <Button v-if=' scope.row.refundStatus&&refundShow' small="Btn small" Name="退款" @click.native="refundBack(scope.row)"></Button>
                            <i v-if=' scope.row.seeRefundStatus' class="cut_off_rule"></i>
                            <Button v-if=' scope.row.seeRefundStatus' small="Btn small" Name="查看退款" @click.native="seeRefundBtn(scope.row)"></Button>
                        </template>
                    </el-table-column>
                    <el-table-column min-width='1' fixed='right'>
                    </el-table-column>
                </el-table>
                <div class="pagingwidth">
                    <Paging :handleCurrentChange="gotoPage" :total="total" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import Button from "../../common/Button";
import Paging from "../../common/Paging";
import Select from "../../common/Select";
import { mapMutations, mapState } from "vuex"
export default {

    components: { Button, getArea: resolve => { require(['@/components/common/getArea'], resolve) }, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) }, Select, Paging },
    data() {
        return {
            cancleShow: false,//撤销权限
            addShow: false,//新增权限
            refundShow: false,//退款权限
            total: 0,
            datas: [],
            Radio: true, //表示单选用户
            //日期快捷
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            corpCodeArr: [],
            //门店data
            storeDatas: [],

            date: [],
            //搜索
            query: {
                beginDate: "",
                endDate: "",
                billStatus: '',
                auditStus: '',
                belongShop: this.$getCookie('belongShop') || '',
                sCorp: this.deptVuex || '',
                customer: '',

            },

            //部门名字
            cName: '',

            //部门code
            cCode: '',

            //退款状态
            billStatus: [
                {
                    key: 1,
                    value: "未退款"
                },
                {
                    key: 0,
                    value: "已退款"
                },
            ],
            //  审核状态
            auditStus: [
                {
                    key: 0,
                    value: "未审核"
                }, {
                    key: 1,
                    value: "已审核"
                }, {
                    key: 2,
                    value: "已驳回"
                },
                {
                    key: 3,
                    value: "审核中"
                }
            ],


            btnStatus: '',
        }
    },
    computed: {
        ...mapState(["storesvuex", "belongShopVuex", 'deptVuex']),
    },
    methods: {
        ...mapMutations(["setDatas"]),

        //查看退款
        seeRefundBtn(val) {
            this.$router.push({
                path: "/NavDetail/refund/refundDetail",
                query: {
                    cCode: val.cCode,
                    refundNo: val.refundNo,
                    amount: val.amount,
                    cName: val.cName,
                    compAmount: val.compAmount,
                }
            });
        },
        refundBack(val) {
            this.$router.push({
                path: "/NavDetail/refund/refundBack",
                query: {
                    cCode: val.cCode,
                    refundNo: val.refundNo,
                    amount: val.amount,
                    cName: val.cName,
                    compAmount: val.compAmount,
                }
            });
        },

        //撤销退款
        revocationRefund(item) {
            this.$messagebox.confirm('此操作将撤销该退款单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let par = {
                    refundNo: item.refundNo,
                    flowHistId: item.flowHistId
                }
                this.$post(this.$host + "/api/order/refund/updateRefundBillStatus", par).then(d => {
                    if (d.success) {
                        item.repealStatus = false;
                        this.$message({
                            type: 'success',
                            message: '撤销成功!',
                            duration: "1500",
                            onClose: () => {
                            }
                        });

                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消撤销'
                });
            });


        },

        //查看详情
        seeDetail(item) {
            this.$router.push({
                path: "/NavDetail/refund/seeRefund",
                query: {
                    flowDataId: item.flowDataId,
                }
            });
        },

        //查看进程按钮
        seeApprovals(item) {
            this.$router.push({
                path: "/NavDetail/refund/seeRefund",
                query: {
                    flowDataId: item.flowDataId,
                    flowHistId: item.flowHistId,
                }
            });
        },

        //重置
        reset() {
            this.corpCodeArr = [];
            this.query = {
                beginDate: "",
                endDate: "",
                billStatus: '',
                auditStus: '',
                sCode: '',
                sCorp: '',
                customer: '',
            };

        },
        //添加退款 按钮
        addRefundBtn(type, val) {
            let id = '';
            val === undefined ? id = undefined : id = val.flowDataId;
            this.$router.push({
                path: "/NavDetail/refund/addRefund",
                query: {
                    type: "_add",
                    flowDataId: id
                }
            });
        },

        //获取地区code
        getAreaCode(value) {

        },

        //获取数据
        upInput(value, arguName) {
            console.log(value)
            this.setDatas({ name: "belongShopVuex", value: value })
            this.query[arguName] = value;
        },

        //部门
        getCorpStore(value) {
            if (this.query.sCorp != value[value.length - 1]) {
                this.query.sCorp = value[value.length - 1];
                this.setDatas({ name: "deptVuex", value: this.query.sCorp })
                this.query.sCode = "";
                this.getStore();
            }
        },

        //根据部门 查门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.query.sCorp || this.$getCookie("dept") || "",
                queryType: 0
            }
            if (!this.query.sCorp) {//默认门店（当前部门下的门店）
                if (this.storesvuex) {
                    this.storesvuex.map(e => {
                        e.active = false;
                        return e;
                    })
                    this.storeDatas = this.storesvuex;
                } else {
                    this.$post(this.$host + "/api/store/store/allnamecode", data).then(d => {
                        if (d.success) {
                            let content = d.data.content.map(e => {
                                e.active = false;
                                return e;
                            })
                            this.storeDatas = content;
                            this.setDatas({ name: "storesvuex", value: this.storeDatas })
                        }
                    });
                }
            } else {
                this.$post(this.$host + "/api/store/store/allnamecode", data).then(d => {
                    if (d.success) {
                        let content = d.data.content.map(e => {
                            e.active = false;
                            return e;
                        })
                        this.storeDatas = content;
                    }
                });
            }

        },



        //查询退款单
        gotoPage(index) {
            let par = {
                pageNumber: parseInt(index),
                pageSize: 20,
            }
            //搜索
            this.query.belongShop = this.$getCookie('belongShop') || this.belongShopVuex || '';
            this.query.sCorp = this.deptVuex || '';

            for (var key in this.query) {
                if (this.query[key] !== "") {
                    par[key] = this.query[key];
                }
            }
            if (typeof (this.date) == "object") {
                if (this.date !== null)
                    if (this.date.length > 0) {
                        par.beginDate = this.$dateFormat('yy-MM-dd', this.date[0]);
                        par.endDate = this.$dateFormat('yy-MM-dd', this.date[1]);
                    }
            }


            this.$post(this.$host + "/api/order/refund/findRefundBill", par)
                .then(d => {
                    if (d.success) {
                        d.data.content.map(el => {
                            el.repealStatus = false;
                            el.isReissue = false;
                            el.refundStatus = false;
                            el.seeRefundStatus = false;
                            switch (el.auditStus) {
                                case 0: el.auditStus = '未审核';
                                    break;
                                case 1: el.auditStus = '已审核';
                                    el.refundStatus = true;
                                    break;
                                case 2: el.auditStus = '已驳回';
                                    el.isReissue = true;
                                    break;
                                case 3: el.auditStus = '审核中';
                                    break;
                            }
                            switch (el.billStatus) {
                                case 0: el.billStatus = '已退款';
                                    el.repealStatus = false;
                                    el.seeRefundStatus = true;
                                    el.refundStatus = false;
                                    break;
                                case 1: el.billStatus = '未退款';
                                    el.repealStatus = true;
                                    el.refundStatus = true;
                                    break;
                                case 2: el.billStatus = '已撤销';
                                    el.refundStatus = false;
                                    break;
                            }
                            el.createTime = this.$dateFormat('yy-MM-dd', el.createTime);
                            el.backDate = this.$dateFormat('yy-MM-dd', el.backDate);
                        })
                        this.datas = d.data.content;
                        this.total = Number(d.data.total);

                    }
                });
        },
    },
    activated() {


    },
    mounted() {


        let type = this.$route.query.type || ""
        if (type == "pending") {//待处理退款
            this.query.billStatus = 1
        } else {
            this.query.billStatus = ""
        }
        this.gotoPage(1);
        this.getStore();
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F063") {//排班管理的权限
                if (el.fUrl == "add") {
                    this.addShow = true;
                }
                if (el.fUrl == "cancle") {
                    this.cancleShow = true;
                }
                if (el.fUrl == "refund") {
                    this.refundShow = true;
                }
            }
        })
    }
}
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.SearchBranch {
    position: relative;
}
.SearchBranch .Storetem {
    position: absolute;
    left: 0%;
    top: 24px;
    z-index: 1000;
}
.btn_wrap {
    margin-bottom: 12px;
}
</style>
<style>
.refund .el-select {
    width: 160px;
}
.refund .el-range-editor.el-input__inner {
    padding: 0 15px;
    padding-right: 4px;
}
.refund .el-date-editor .el-range-separator {
    padding: 0 15px;
}
.refund .el-input__inner {
    line-height: 0;
}
.refund .el-date-editor .el-range__close-icon {
    width: 20px;
}
.refund .el-table tbody td:last-child .cell {
    text-align: left;
}
</style>


