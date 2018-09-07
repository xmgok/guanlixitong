<template>
    <div class="add_store add_app right_content_wrap">
        <div class="right_content">
            <div class="add_store_content update_content">
                <ul>
                    <li v-if='isBelongShop'>
                        <div class="update_tit">
                            <!-- <i class="icon waring"></i> -->
                            <span>部门：</span>
                        </div>
                        <div class="update_main">
                            {{dept}}
                            <!-- <getCorpStore :clearable='false' @getCorpStore="getCorpStore" :values="cCodesArr" :widths="'160px'" /> -->
                        </div>
                    </li>
                    <li v-if='isBelongShop'>
                        <div class="update_tit">

                            <span>门店：</span>
                        </div>
                        <div class="update_main">
                            {{sName}}
                            <!-- <Select :clearable='false' :SelecttemData="storeDatas" :Blur='blur' :values="datas.cStore" arguName="cStore" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" :widths="'160px'" /> -->
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            会员：</div>
                        <div class="update_main">
                            <!-- <input class="x_input" :class="{no_border:isSee}" type="text" v-model='cName' placeholder="请点击选择" readonly @click="SelectCustomer" /> -->
                            {{cName}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            手机：
                        </div>
                        <div class="update_main">
                            {{cPhone}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            到店日期：</div>
                        <div class="update_main">

                            {{datas.dateDate}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            预约服务：</div>
                        <div class="update_main">

                            <el-table :data="detail" size='mini' width='350'>
                                <el-table-column width="240" prop="tkName" label="产品名称">
                                </el-table-column>
                                <el-table-column width="60" prop="psServTime" label="时长">
                                </el-table-column>

                            </el-table>
                        </div>
                    </li>
                    <!-- <li>
                        <div class="update_tit">
                            预约服务时长：
                        </div>
                        <div class="update_main">
                            <input v-model='datas.period' type="text">分钟
                        </div>
                    </li> -->
                    <li>
                        <div class="update_tit">
                            预约服务员工：
                        </div>
                        <div class="update_main">
                            <!-- <input class="x_input" type="text" v-model='eName' readonly placeholder="请点击选择员工" @click="selStaffBtn"> -->
                            {{eName}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            备注：
                        </div>
                        <div class="update_main">
                            <!-- <textarea v-model='' cols="80" rows="3"></textarea> -->
                            {{datas.remark}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
import Button from "@/components/common/Button";
import Select from "@/components/common/Select";
export default {
    components: { Button, Select, },
    data() {
        return {
            isBelongShop: true,

            //展示员工排班预约时间
            staffTime: false,

            //员工预约modelTitle
            modelTitle: '',

            isSee: false,
            //头部信息


            stepDate: '',

            dateDate: '',

            //
            stepOptions: { start: '08:00', step: '00:15', end: '20:00' },

            //添加客户的数据
            datas: {
                cStore: this.$getCookie('belongShop'),
                dept: this.$getCookie('dept'),
                cCode: "",
                cName: "",
                dateDate: "",
                remark: "",
                workNo: ''
            },

            verify: {
                cCode: false,
                dateDate: false,
                serData: false
            },

            //门店名字
            storeName: '',

            //detail
            detail: [],

            //选择的客户名字
            cName: '',

            cCodesArr: [this.$getCookie('dept')],//部门数组

            //
            eName: '',

            //客户手机号
            cPhone: '',

            //选择客户展示
            selectReceiptShow: false,

            //选择服务
            AddserviceShow: false,

            //所有服务
            SetSerData: [],

            //选择员工show
            selStaffShow: false,

            //员工排班
            empClassList: '',

            //员工请假
            empChange: {},

            //员工预约
            dateBill: [],

            //门店选择
            storeDatas: [],
            dept: '',
            sName: '',
            remark: '',

        }
    },

    methods: {

    },

    mounted() {
        // this.getStore();
        let belongShop = this.$getCookie("belongShop");
        if (belongShop === 'null' || belongShop === '' || belongShop === null) {
            this.isBelongShop = true;
        } else {
            this.isBelongShop = false;
        }
        if (this.$route.query.type === "_update") {
            this.isSee = true;
            let par = {
                dateNo: this.$route.query.dateNo,
            }
            this.$post(this.$host + "/api/cust/dateBill/findDateBillDetail", par)
                .then(d => {
                    if (d.success) {
                        this.cName = d.data.cName + "(" + d.data.cCode + ")";
                        this.cPhone = d.data.cPhone;
                        this.eName = d.data.empName;
                        this.dept = d.data.deptName
                        this.sName = d.data.sName
                        this.remark = d.data.remark
                        d.data.productInfo.map(el => {
                            let obj = {}
                            obj.psServTime = el.psServTime;
                            obj.tkName = el.psName;
                            obj.tkCode = el.dateServ;

                            this.detail.push(obj);
                        })
                        for (let k in this.datas) {
                            for (let v in d.data) {
                                if (k === v) {
                                    this.datas[k] = d.data[k];
                                } else if (v === 'adteDate') {

                                }
                            }
                        }
                    }
                });
        }
    }
}

</script>

<style scoped>
@import "../../../../../static/commonStyle.css";

.add_store textarea {
    vertical-align: top;
    width: 15rem;
    font-size: 12px !important;
}

.btn_wrap {
    margin: 1.666667rem 0;
    text-align: center;
}
.btn_wrap button:last-child {
    margin-left: 24px;
}
</style>
<style>
</style>


