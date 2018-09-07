<template>
    <div class="add_appointment right_content_wrap">
        <div class="right_content">
            <div class="add_store_content update_content">
                <ul>
                    <li v-if='isBelongShop'>
                        <div class="update_tit">
                            <!-- <i class="icon waring"></i> -->
                            <span>部门：</span>
                        </div>
                        <div class="update_main">
                            <getCorpStore v-if='!isSee' :clearable='false' @getCorpStore="getCorpStore" :values="cCodesArr" :widths="'160px'" />
                            <span v-if='isSee'>{{dept}}</span>
                        </div>
                    </li>
                    <li v-if='isBelongShop'>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            门店：
                        </div>
                        <div class="update_main">
                            <Select v-if='!isSee' :clearable='false' :SelecttemData="storeDatas" :values="datas.cStore" arguName="cStore" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" :widths="'160px'" />
                            <span v-if='isSee'>{{sName}}</span>
                            <span class="x_error" v-if='verify.cStore'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i> 会员：

                        </div>
                        <div class="update_main">
                            <input class="x_input cursor" :class="{no_border:isSee}" type="text" v-model='cName' placeholder="请点击选择" readonly @click="SelectCustomer" />
                            <span class="x_error" v-if='verify.cCode'>必填！</span>
                            <Button Name="添加新会员" @click.native="gotoAdd" :iconadd="true" buttonClass="Btn" />
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
                            <i class="icon waring"></i>预约到店时间：</div>
                        <div class="update_main">

                            <input class="x_input cursor" type="text" v-model='dateDate' placeholder="请点击选择时间" readonly @click="selectDate" />
                            <span class="x_error" v-if='verify.dateDate'>必填！</span>

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i> 预约服务：</div>
                        <div class="update_main taoka">
                            <div>
                                <Button small="Btn small" Name="添加" @click.native="showSer"></Button>
                            </div>
                            <el-table border :data="detail" size='mini'>
                                <el-table-column width="240" prop="psName" label="产品名称">
                                    <template slot-scope="scope">
                                        {{scope.row.tkName||scope.row.prodName||scope.row.psName}}
                                    </template>
                                </el-table-column>
                                <el-table-column width="60" prop="psServTime" label="时长">
                                </el-table-column>
                                <el-table-column width="80" label="操作">
                                    <template slot-scope="scope">
                                        <Button small="Btn small" Name="删除" @click.native="deleteDetail(scope.$index)"></Button>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column min-width='1'>
                                </el-table-column> -->
                            </el-table>
                            <span class="x_error" v-if='verify.serData'>必选！</span>
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
                            <div class="input_wrap">
                                <input class="x_input cursor" type="text" v-model='eName' readonly placeholder="请点击选择员工" @click="selStaffBtn">
                                <i class="icon cha cursor" @click="cancleSelStaf"></i>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            备注：
                        </div>
                        <div class="update_main">
                            <textarea v-model='datas.remark' cols="80" rows="3"></textarea>
                        </div>
                    </li>
                </ul>
                <div class="btn_wrap ">
                    <Button Name="取消 " buttonClass='None' @click.stop.native="goBack "></Button>
                    <Button Name="提交 " :plain="true " @click.stop.native="addFun() "></Button>
                </div>

            </div>
        </div>
        <selectReceipt v-if="selectReceiptShow" :cancleReceipt="cancleReceipt" :sCode='datas.cStore' :sureselectReceipt="sureselectReceipt" />
        <div v-show="AddserviceShow" class="modelservice  x_model">
            <div class="model_content">
                <header class="x_model_header clear">
                    <div class="left">选择服务</div>
                    <div class="right curor icon Fork" @click="Cancel"></div>
                </header>
                <div class="AddcardSearch">
                    <ul class="tklist clearfix">
                        <li v-for="(item,index) in tklistData" :class="{active:item.active}" :key='index' @click="toggletk(item)">{{item.name}}
                            <i class="icon icongou" v-show="item.active"></i>
                        </li>
                    </ul>
                    <span class="selectemp" v-show="tklistData[1].active">
                        <Input placeholder="输入名称/编号" class="selectReceipt" :focus="profocus" :blur="problur" :widths="'240px'" arguName="prodKey" :value="prodKey" @sonInput="sonInput" />
                        <span class="sousuo" @click="getFuWu" :class="{active:proActive}">
                            <i class="icon iconss"></i>
                        </span>
                    </span>
                    <el-select v-show="tklistData[1].active" @change='selectChange' clearable v-model='cateId' placeholder="请选择产品分类">
                        <el-option v-for="item in fwlist" :key="item.id" :label="item.cateName" :value="item.id">
                        </el-option>
                    </el-select>

                </div>
                <div :class="[{ AddcardBox: tklistData[1].active },{ tklistdetail_wrap: tklistData[0].active }, 'x_model_main']">
                    <!-- <div class="tklistdetail " v-show="tklistData[0].active"> -->
                    <div v-show="tklistData[0].active" v-for="(item,index) in servicesDatas">
                        <div>
                            <header>
                                <span>{{item.tkName}}</span> 有效期至：
                                <i>{{item.validDate||'无限制'}}</i>
                            </header>
                            <div class="clearfix">
                                <!-- @click="addtk(items,item)"  -->
                                <div @click.stop="checkbox(items,ix,item,index)" v-for="(items,ix) in item.serList" class="card_main  cursor">
                                    <div class="cardElement" :class="[{Background:items.checked},{validStatus:items.xStatus}]">
                                        <div class="tk_card" :class="[{validStatus:items.psValidStatus===2}]">
                                            <img :src="items.prodImg?items.prodImg:'../../../../../static/img/img.png'" alt="" class="cardImg">
                                            <img class="tag" v-if="items.isGift==1" src="../../../../../static/img/give.png" alt="">
                                            <p class="card_name"> {{items.prodName}}</p>
                                            <p class="cardText">
                                                结算价格：￥{{items.streetAmount}}/次
                                            </p>
                                            <p class="cardText">
                                                <span class="TextColor">
                                                    <i>剩余次数：</i>
                                                    {{items.remainTimes>500?"不限次数":(items.remainTimes+"次")}}
                                                </span>
                                            </p>
                                        </div>
                                        <transition name="el-fade-in-linear">
                                            <i v-show="items.checked" class="icon icongou"></i>
                                        </transition>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div v-if="servicesDatas.length==0&&tklistData[0].active">暂无已购套卡</div>
                    <!-- </div> -->

                    <div class=" card_main" v-for="(item,index) in SetSerData" :key="index" v-show="tklistData[1].active">
                        <div @click.stop="checkbox(item,index)" class="cardElement" :class="{Background:item.checked}">
                            <div class="BoxElement">
                                <img :src="item.prodImg?item.prodImg:'../../../../../static/img/vip.png'" alt="" class="cardImg">
                                <p class="card_name">{{item.tkName}}</p>
                                <p :class="{'TextLine':item.disPrice}" class="cardText">{{item.disPrice?('原价￥'+item.price):('现价￥'+item.price)}}</p>
                                <p v-if="item.disPrice" class="cardText">折扣价
                                    <span class="TextColor">{{'￥'+item.disPrice}}</span>
                                </p>
                            </div>
                            <transition name="el-fade-in-linear">
                                <i v-show="item.checked" class="icon icongou"></i>
                            </transition>
                        </div>
                        <div v-if="SetSerData.length==0">
                            暂无服务
                        </div>
                    </div>

                </div>
                <div class="x_model_footer">
                    <Button class="None" Name="取消" @click.native.stop="Cancel" />
                    <Button Name="确定" @click.native.stop="SureSelectSer" />
                </div>
            </div>
        </div>
        <AboutPeople :prodIds='prodIds' :api='api' :date='peoDate' :canclefun='closeSelStaff' :RadioPeople="true" :AboutPeopleSelected="AboutStoreSelected" v-if="selStaffShow" :corpShow="corpShow" :sCodeShow="sCodeShow" />

        <!-- 时间 -->
        <div class='x_model app_time' v-if="appTime">
            <div class="model_content">
                <header class="x_model_header clear">
                    <div class="left">选择预约时间</div>
                    <div class="right curor icon Fork" @click="closeStaffModel"></div>
                </header>
                <div class="x_model_main">
                    <div class="date_header">
                        <Button Name="< 前一天" @click.native="prevDay" buttonClass="None" />
                        <el-date-picker @change='datePickerChange' :clearable='false' v-model='datas.dateDate' type="date" placeholder="选择日期" align="right" :picker-options="pickerOptions" size='mini'>
                        </el-date-picker>
                        <!--  -->
                        <Button Name="后一天 >" @click.native="nextDay" buttonClass="None" />
                        <div class="x_legend">
                            <div>
                                <span></span>空闲
                            </div>
                            <div class="busy">
                                <span></span>较忙
                            </div>
                            <div class="busyness">
                                <span></span>繁忙
                            </div>
                        </div>
                    </div>
                    <div class="x_legend">
                        <ul class="minute clear">
                            <li v-for='item in stepOptions'>
                                <el-popover popper-class="busyness" v-if='item.legend==2' placement="top" width="300" trigger="click" content="该时段门店繁忙，到店后预计需要长时间等待强烈建议您选择空闲时段">
                                    <div slot="reference" @click="selMin(item)" :class="[{busy:item.legend==1},{busyness:item.legend==2},{line_del:item.overtime},{sel_min:item.active},]">
                                        {{item.dateDate}}
                                    </div>
                                </el-popover>
                                <el-popover popper-class="busy" v-if='item.legend==1' placement="top" width="300" trigger="click" content="该时段门店较忙，到店后预计需要短时间等待您可以选择空闲时段">
                                    <div slot="reference" @click="selMin(item)" :class="[{busy:item.legend==1},{busyness:item.legend==2},{line_del:item.overtime},{sel_min:item.active},]">
                                        {{item.dateDate}}
                                    </div>
                                </el-popover>
                                <div v-if='item.legend==0' @click="selMin(item)" :class="[{busy:item.legend==1},{busyness:item.legend==2},{line_del:item.overtime},{sel_min:item.active},]">
                                    {{item.dateDate}}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="x_model_footer">
                    <Button Name="取消" @click.native="closeStaffModel" buttonClass="None" />
                    <Button Name="确定" @click.native="selAppTimeBtn()" />
                </div>
            </div>
        </div>

        <!-- 选择员工 -->
    </div>
</template>

<script>
import AboutPeople from "@/components/common/AboutPeople"
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
// import AboutBranch from "@/components/common/AboutBranch";
import selectReceipt from "@/components/common/selectReceipt"
import getCorpStore from "@/components/common/getCorpStore"
import { mapMutations, mapState } from "vuex"
export default {
    components: { Button, Input, Select, AboutBranch: (resolve) => { require(["@/components/common/AboutBranch"], resolve) }, selectReceipt, AboutPeople, getCorpStore },

    data() {
        return {
            corpShow: false,//部门权限
            sCodeShow: false,//门店权限

            api: '/api/cust/dateBill/findEmployeeByDateBillPage',
            tklistData: [
                { name: "已购套卡", active: false, key: 0 },
                { name: "全部服务", active: true, key: 1 },
            ],
            isBelongShop: true,

            //展示员工排班预约时间
            appTime: false,



            isSee: false,
            //头部信息

            pickerOptions: {
                disabledDate(time) {
                    const date = new Date();
                    return time.getTime() < date - 3600 * 1000 * 24 * 1;
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '明天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '后天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
                        picker.$emit('pick', date);
                    }
                }]
            },

            stepDate: '',

            dateDate: '',

            //
            stepOptions: [],

            //添加客户的数据
            datas: {
                cStore: this.$getCookie('belongShop'),
                dept: this.$getCookie('dept'),
                cCode: "",
                cName: "",
                dateDate: (new Date()).getTime(),
                remark: "",
                workNo: '',
            },

            verify: {
                cCode: false,
                dateDate: false,
                serData: false,
                cStore: false,
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
            triLeft: "0",
            triTransform: "translateX(-50%)",

            //员工请假
            empChange: {},

            //员工预约
            dateBill: [],

            //门店选择
            storeDatas: [],

            proActive: false,

            //变更的时候 存储 客户的预约时间
            alterationAppTime: '',

            customerId: "",//客户id
            cateId: '',
            prodKey: '',
            fwlist: '',
            servicesDatas: [],
            startTime: '',
            endTime: '',
            bill: '',
            peoDate: '',

            //选择员工的positionId
            positionId: '',
            //选择员工的员工id
            empId: '',
            //选择产品的产品id
            prodIds: [],

            //部门名称
            dept: '',
            //门店名称
            sName: '',


        }
    },
    computed: {
        ...mapState(["storesvuex", "employee", "employeetotal"]),
    },
    methods: {
        selectChange(val) {
            this.getFuWu();
        },
        //取消选择员工
        cancleSelStaf() {
            this.eName = '';
            this.datas.workNo = '';
        },
        //日期组件chang
        datePickerChange() {
            this.getDateDatas();
        },
        selAppTimeBtn() {
            this.dateDate = '';
            this.stepOptions.map(el => {
                if (el.active) {

                    if (typeof (this.datas.dateDate) === "number" || typeof (this.datas.dateDate) === "object") {
                        this.dateDate = this.$dateFormat('yy-MM-dd', this.datas.dateDate) + ' ' + el.dateDate;
                    } else {
                        this.dateDate = this.datas.dateDate + ' ' + el.dateDate;
                    }
                    this.verify.dateDate = false;
                }
            })
            if (this.stepOptions.every(el => { return !el.active })) {
                this.verify.dateDate = true;
            }
            this.appTime = false;
        },
        //选择时间
        selMin(el) {
            this.stepOptions.map(item => {
                if (item.overtime) {
                    return
                } else {
                    if (el.dateDate === item.dateDate) {
                        el.active = !el.active;
                    } else {
                        item.active = false;
                    }
                }

            });
        },
        //前一天
        prevDay() {
            let time = this.$dateFormat('yy-MM-dd', this.datas.dateDate - 3600 * 1000 * 24 * 1);
            if (time < this.$dateFormat('yy-MM-dd', new Date())) {
                this.$message({
                    type: "warning",
                    message: "预约时间不能小于当前时间！"
                });
            } else {
                this.datas.dateDate = this.datas.dateDate - 3600 * 1000 * 24 * 1;
            }
            this.getDateDatas()
        },
        //下一天
        nextDay() {
            this.datas.dateDate = this.datas.dateDate + 3600 * 1000 * 24 * 1;
            this.getDateDatas()
        },

        //生成时间点表
        getAppTime() {
            this.stepOptions = [];
            let start = this.startTime || "08:00";
            let end = this.endTime || "22:00";
            let startTime = start.split(':');
            let startMin = Number(startTime[1]);
            let startHour = Number(startTime[0]);
            if (0 < startMin && startMin <= 30) {
                startMin = 30
            } else if (30 < startMin && startMin <= 59) {
                startMin = 0;
                startHour = startHour + 1;
            }
            let startDate = startMin + startHour * 60;
            let endTime = end.split(':');
            let endMin = Number(endTime[1]);
            let endHour = Number(endTime[0]);
            if (0 < endMin && endMin <= 30) {
                endMin = 30
            } else if (30 < endMin && endMin <= 59) {
                endMin = 0;
                endHour = endHour + 1;
            }
            let endDate = endMin + endHour * 60;
            // 忙碌状态
            let bill = this.bill;
            for (let i = startDate; i <= endDate; i += 30) {
                let obj = {
                    legend: 0,
                    dateDate: '',
                    active: false,
                    overtime: false,
                };
                obj.dateDate = this.formatTen(parseInt(i / 60)) + ":" + this.formatTen(i % 60)
                if (obj.dateDate === end) {
                    obj.overtime = true;
                }

                let isActive = this.alterationAppTime === this.$dateFormat('yy-MM-dd', this.datas.dateDate)
                    && obj.dateDate === this.stepDate
                    && !(this.$dateFormat('yy-MM-dd', this.datas.dateDate) === this.$dateFormat('yy-MM-dd', new Date())
                        && this.$dateFormat('hh:mm', new Date()) > obj.dateDate)

                if (isActive) {
                    obj.active = true;
                }
                if (this.$dateFormat('yy-MM-dd', this.datas.dateDate) === this.$dateFormat('yy-MM-dd', new Date()) && this.$dateFormat('hh:mm', new Date()) > obj.dateDate) {
                    obj.overtime = true;
                }
                bill.map(el => {
                    if (el.dateDate === obj.dateDate && !obj.overtime) {
                        obj.legend = el.count;
                    }
                })

                this.stepOptions.push(obj);
                // console.log(this.stepOptions)
            }
        },

        //选择预约时间
        selectDate() {
            if (!this.$getCookie("belongShop") && !this.datas.cStore) {
                this.$message({
                    type: "warning",
                    message: "请选择门店！"
                });
                this.verify.cStore = true;
            } else {
                this.verify.cStore = false;
                this.getDateDatas();
                this.appTime = true;
            }

        },

        //时间表
        getDateDatas() {
            let par = {
                "dateDate": this.$dateFormat('yy-MM-dd', this.datas.dateDate),
                belongShop: this.$getCookie("belongShop") || this.datas.cStore
            }
            return this.$post(this.$host + "/api/cust/dateBill/queueUpInfo", par)
                .then(d => {
                    if (d.success) {
                        this.startTime = d.data.startTime || "08:00";
                        this.endTime = d.data.endTime || "22:00";
                        this.bill = d.data.bill;
                        this.getAppTime();
                    }
                });
        },
        //显示已购套卡服务
        gettkfw() {

            let data = {
                cCode: this.datas.cCode
            }
            this.$post(this.$host + '/api/order/consume/getCustOrderSerList', data).then(d => {
                if (d.success) {
                    let data = d.data;
                    data.map(el => {

                        el.serList.map(val => {
                            if (el.tkValidStatus === 2) {
                                val.psValidStatus = 2
                            }
                            if (val.psValidStatus == 2) {
                                val.xStatus = true;
                            }
                            val.checked = false;
                            val.orderNo = el.orderNo;
                            val.xtkCode = el.tkCode;
                            this.detail.map(it => {
                                if (el.tkCode === it.dateTk && val.prodCode === it.dateServ && el.orderNo == it.orderNo) {
                                    val.checked = true;
                                }
                            })
                        })
                    })
                    this.servicesDatas = data;
                    if (this.servicesDatas.length > 0) {
                        this.tklistData[0].active = true;
                        this.tklistData[1].active = false;
                    } else {
                        this.tklistData[0].active = false;
                        this.tklistData[1].active = true;
                    }
                }
            })
        },

        //获取产品类型
        gettags() {
            this.$post(this.$host + "/api/prod/productcate/tree", {}).then(d => {
                if (d.success) {
                    let list = d.list;
                    list.map(el => {
                        el.active = false;
                    })
                    this.fwlist = list;
                }
            })
        },
        sonInput(value, arguName) {
            this[arguName] = value;
            if (this.accIntegral > this.Integral) {
                this.$message({
                    type: "info",
                    message: "抵扣积分不得大于账户积分"
                });
            }
        },
        problur() {
            this.proActive = false;
        },
        // //搜索套卡


        //已购套卡 全部服务切换
        toggletk(item) {
            this.tklistData.map(el => {
                el.active = false;
            })
            item.active = true;
        },
        //搜索服务获取焦点
        profocus() {
            this.proActive = true;
        },
        //添加会员
        gotoAdd() {
            this.$router.push({
                path: "/NavDetail/addCustomer",
                query: {
                    resurl: "/NavDetail/appointment/addAppointment"
                }
            })
        },

        closeSelStaff() {
            this.selStaffShow = false;
        },



        upInput(value, arguName) {
            this.datas[arguName] = value;
            this.verify.cStore = false;

        },

        //部门选择
        getCorpStore(value) {
            if (this.datas.dept != value[value.length - 1]) {
                this.datas.dept = value[value.length - 1];
                this.datas.cStore = "";
                this.getStore();
            }
        },
        //获取门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.datas.dept || this.$getCookie("dept") || "",
                queryType: 0
            }
            this.$post(this.$host + "/api/store/store/allnamecode", data).then(d => {
                if (d.success) {
                    let content = d.data.content.map(e => {
                        e.active = false;
                        return e;
                    })
                    this.storeDatas = content;
                }
            });
        },

        //员工日程
        closeStaffModel() {
            this.appTime = false;
        },

        //选择员工
        AboutStoreSelected(item) {
            if (item.dateBillInfo) {
                this.alert('该员工在该时间点已被预约，不能重复预约！', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                });
            } else if (item.leaveInfo) {
                this.$alert('该员工未排班，不可预约。', '提示', {
                    confirmButtonText: '确定',
                    // callback: action => {
                    // }
                });
            } else {
                this.eName = item.empName + "(" + item.workNo + ")";
                this.datas.workNo = item.workNo;
                this.empId = item.id;
                this.positionId = item.positionId;
                this.selStaffShow = false;
            }

        },

        //选择员工按钮
        selStaffBtn() {
            this.peoDate = { cCode: '', dateDate: '' };
            let cNameBol = false;
            let dateDateBol = false;
            if (this.cName) {
                cNameBol = true;
                this.verify.cCode = false;
                this.peoDate.cCode = this.datas.cCode;
            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择预约会员！',
                    duration: "5000",
                });
                this.verify.cCode = true;
                cNameBol = false;
            }
            if (this.dateDate) {
                dateDateBol = true;
                this.verify.dateDate = false;
                this.peoDate.dateDate = this.dateDate + ":00";
            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择预约到店日期！',
                    duration: "5000",
                });
                this.verify.dateDate = true;
                dateDateBol = false;
            }
            if (dateDateBol && cNameBol) {
                this.selStaffShow = true;
            } else {
                this.selStaffShow = false;
            }

        },

        //移除已选服务
        deleteDetail(index) {

            this.detail.splice(index, 1);
            this.prodIds = [];
            this.detail.map(el => {
                this.prodIds.push(el.prodId)
            })
            this.eName = '';
            this.datas.workNo = '';
            this.empId = '';
            this.positionId = '';
            this.servicesDatas.map(el => {
                el.serList.map(val => {
                    if (el.tkValidStatus === 2) {
                        val.psValidStatus = 2
                    }
                    if (val.psValidStatus == 2) {
                        val.xStatus = true;
                    }
                    val.checked = false;
                    val.orderNo = el.orderNo;
                    val.xtkCode = el.tkCode;
                    this.detail.map(it => {
                        if (el.tkCode === it.dateTk && val.prodCode === it.dateServ && el.orderNo == it.orderNo) {
                            val.checked = true;
                        }
                    })
                })
            })

        },

        //确定选择服务
        SureSelectSer() {
            this.detail = [];
            this.prodIds = [];
            this.SetSerData.map(el => {
                if (el.checked) {
                    this.detail.push(el);
                    this.prodIds.push(el.prodId);
                }
            })
            this.servicesDatas.map(el => {
                el.serList.map(val => {
                    if (val.checked) {
                        this.detail.push(val);
                        this.prodIds.push(val.prodId);
                    }
                })
            });
            if (this.detail.length === 0) {
                this.verify.serv = true;
                this.AddserviceShow = false;
            } else {
                this.verify.serv = false;
                this.AddserviceShow = false;
                this.eName = '';
                this.datas.workNo = '';
                this.empId = '';
                this.positionId = '';
            }

        },

        //选择服务
        checkbox(item, ix, val, index) {
            if (item.psValidStatus == 2 && item.xStatus) {
                this.$messagebox.confirm('该服务已失效，是否继续选择？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.checked = !item.checked
                    item.xStatus = false;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消选择'
                    });
                });
            } else if (item.psValidStatus == 2 && !item.xStatus) {
                item.xStatus = true;
                item.checked = !item.checked;
            } else if (val) {
                let num = 0;
                // val.serList.map((el, key) => {
                for (let i = 0; i < val.serList.length; i++) {
                    if (item.prodCode == val.serList[i].prodCode && val.serList[i].isGift != item.isGift && val.serList[i].checked) {
                        this.$message({
                            type: 'warning',
                            message: '已选同款计价/赠送服务'
                        });

                        // item.checked = !item.checked;

                    } else if (item.prodCode == val.serList[i].prodCode && val.serList[i].isGift != item.isGift && !val.serList[i].checked) {
                        item.checked = !item.checked;
                    } else if (item.prodCode != val.serList[i].prodCode) {
                        num++
                    }
                }
                if (num == val.serList.length - 1) {
                    item.checked = !item.checked;
                }
                // })
            } else {
                item.checked = !item.checked;

            }
        },

        // 选择直接购买服务
        showSer() {
            if (!this.datas.cStore) {
                this.$message({
                    message: '请选择门店！',
                    type: 'warning',
                    duration: "3000",
                });
                this.verify.cStore = true;
                return;
            } else {
                this.verify.cStore = false;
                this.AddserviceShow = true;
                this.getFuWu();
            }
        },

        //选择服务取消
        Cancel() {
            this.AddserviceShow = false;
        },

        //选择客户按钮
        SelectCustomer() {
            if (this.$route.query.type === "_add") {
                this.selectReceiptShow = true;
            }
        },

        //选择客户确定按钮
        sureselectReceipt(item) {
            if (item.cName !== undefined) {
                this.cName = item.cName + "(" + item.cCode + ")";
                this.customerId = item.id;
                this.datas.cCode = item.cCode;
                this.datas.cName = item.cName;
                this.cPhone = item.cPhone;
                this.verify.cCode = false;
                this.detail = [];
                this.gettkfw();
            } else {
                this.verify.cCode = true;
            };
            this.selectReceiptShow = false;
        },

        //选择客户取消按钮
        cancleReceipt() {
            this.selectReceiptShow = false;
        },

        updated() {
            let message = '';
            let url = '';
            let par = {};
            for (let key in this.datas) {
                par[key] = this.datas[key]
            }

            let arr = [];
            this.detail.map(el => {
                let obj = {}
                el.xtkCode ? obj.dateTk = el.xtkCode : obj.dateTk = '';
                if (el.orderNo) {
                    obj.orderNo = el.orderNo;
                    obj.dateServ = el.prodCode || el.dateServ
                } else {
                    obj.orderNo = '';
                    obj.dateServ = el.tkCode || el.dateServ
                }
                arr.push(obj);
            })
            par.detail = arr;
            par.dateDate = this.dateDate + ':00'

            delete par.dept;
            if (this.$route.query.type === "_update") {//修改
                message = '修改成功！'
                url = "/api/cust/dateBill/updateDateBill";
                par.dateNo = this.$route.query.dateNo;
            } else {//新增
                message = '新增成功！'
                url = "/api/cust/dateBill/saveDateBill";
            }
            this.$post(this.$host + url, par).then(d => {
                if (d.success) {
                    this.$message({
                        type: 'success',
                        message: message,
                        duration: "1000",
                        onClose: () => {
                            this.$router.push({
                                path: "/NavDetail/appointment",
                            })
                        }
                    });
                }
            });
        },

        isSubFun() {
            let len = 0;
            if (this.cName === '') {
                this.verify.cCode = true;
                len++
            } else {
                this.verify.cCode = false;
            };
            if (this.dateDate == '') {
                len++
                this.verify.dateDate = true;

            } else {
                this.verify.dateDate = false;
            }

            if (this.detail.length === 0) {
                len++
                this.verify.serData = true;
            } else {
                this.verify.serData = false;
            }
            if (len > 0) {
                return false;
            } else {
                return true;
            }
        },

        //保存
        addFun() {
            if (this.$stop()) { return }
            if (this.isSubFun()) {

                this.updated();
            } else {
                this.$message({
                    message: '信息填写不完整！',
                    type: 'warning',
                    duration: "3000",
                })
            }
        },

        //返回
        goBack() {
            history.back(-1)
        },
        formatTen(num) {
            return num > 9 ? num + "" : "0" + num;
        },

        // //时间表
        // getDateDatas() {
        //     let par = {
        //         "dateDate": this.$dateFormat('yy-MM-dd', this.datas.dateDate),
        //     }

        //     if (!this.$getCookie("belongShop") && !this.datas.cStore) {
        //         this.$message({
        //             type: "warning",
        //             message: "请选择门店！"
        //         });
        //     } else {
        //         par.belongShop = this.$getCookie("belongShop") || this.datas.cStore
        //         return this.$post(this.$host + "/api/cust/dateBill/queueUpInfo", par)
        //             .then(d => {
        //                 if (d.success) {
        //                     this.startTime = d.data.startTime || "08:00";
        //                     this.endTime = d.data.endTime || "22:00";
        //                     this.bill = d.data.bill;
        //                     this.getAppTime();
        //                 }
        //             });
        //     }

        // },
        ...mapMutations(["setDatas"]),

        getFuWu() {
            let _data = {
                customerId: this.customerId,
                prodClass: 0,
                cateId: this.cateId,
                psValidStatus: 1,
                empId: this.empId || undefined,
                position: this.positionId || undefined,
                storeCode: this.datas.cStore
            }



            if (this.prodKey) {
                _data.prodKey = this.prodKey
            }
            this.$post(this.$host + '/api/prod/prtserv/findForStore', _data).then(d => {
                if (d.success) {
                    d.data.map(e => {
                        e.checked = false;
                        this.detail.map(el => {
                            if ((el.dateTk == null || el.dateTk == '') && el.dateServ === e.tkCode) {
                                e.checked = true;
                            }
                        })
                    })
                    this.SetSerData = d.data;

                }
            })
        }
    },
    activated() {
        this.gettkfw();
    },
    mounted() {
        this.setDatas({ name: "employee", value: [] })
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F081") {//会员预约的权限
                if (el.fUrl == "corp") {
                    this.corpShow = true;
                }
                if (el.fUrl == "sCode") {
                    this.sCodeShow = true;
                }
            }
        })
        if (this.$route.query.cName != undefined && this.$route.query.cCode != undefined) {
            let code = this.$route.query.cCode
            let name = this.$route.query.cName
            this.cName = name + "(" + code + ")";
            this.datas.cCode = code;
            this.datas.cName = name;
            this.cPhone = this.$route.query.cPhone
        }
        this.getStore();
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
                        this.detail = d.data.productInfo;
                        this.dept = d.data.deptName;
                        this.sName = d.data.sName;

                        for (let k in this.datas) {
                            for (let v in d.data) {
                                if (k === v) {
                                    this.datas[k] = d.data[k];
                                }
                            }
                        }

                        this.dateDate = d.data.dateDate
                        let arr = this.datas.dateDate.split(" ")
                        this.alterationAppTime = arr[0];
                        this.datas.dateDate = (new Date(arr[0])).getTime();
                        this.stepDate = arr[1] + '';
                        this.gettkfw();
                        this.prodIds = [];
                        this.detail.map(el => {
                            this.prodIds.push(el.prodId)
                        })

                    }
                });
        } else {
        };
        this.gettags();

    }
}

</script>

<style scoped>
@import "../../../../../static/commonStyle.css";
.tk_card {
    position: relative;
}
.tk_card .tag {
    position: absolute;
    top: 0;
    right: 0;
}
.input_wrap {
    display: inline-block;
    position: relative;
}
.input_wrap .cha::before {
    content: "\e61a";
    position: absolute;
    top: 52%;
    right: 6px;
    transform: translateY(-50%);
    -ms-transform: translateY(-50%); /* IE 9 */
    -moz-transform: translateY(-50%); /* Firefox */
    -webkit-transform: translateY(-50%); /* Safari 和 Chrome */
    -o-transform: translateY(-50%);
    opacity: 0;
    transition: all 0.2s;
    -ms-transform: all 0.2s; /* IE 9 */
    -moz-transform: all 0.2s; /* Firefox */
    -webkit-transform: all 0.2s; /* Safari 和 Chrome */
    -o-transform: all 0.2s;
}
.input_wrap:hover .cha::before {
    opacity: 1;
    transition: all 0.2s;
    -ms-transform: all 0.2s; /* IE 9 */
    -moz-transform: all 0.2s; /* Firefox */
    -webkit-transform: all 0.2s; /* Safari 和 Chrome */
    -o-transform: all 0.2s;
}
.minute li {
    float: left;
    padding: 0 6px;
    line-height: 52px;
}

.minute li div {
    padding: 0px 14px;
    color: #2cbcc8;
    line-height: 26px;
}
.minute li div.sel_min {
    background-color: #2cbcc8;
    color: #fff;
}
.minute li:hover {
    cursor: pointer;
}
.x_legend {
    margin-top: 12px;
    color: #2cbcc8;
}
.x_legend > div > span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid #2cbcc8;
    vertical-align: text-top;
    margin: 0 6px 0 12px;
}
.x_legend li > span {
    line-height: 0;
}
.x_legend div {
    display: inline-block;
}
.x_legend .busyness span {
    border-color: #d0021b;
}
.minute .line_del {
    text-decoration: line-through;
    color: #ccc;
}
.x_legend .busyness {
    color: #d0021b;
}
.x_legend .busy {
    color: #ff962f;
}
.x_legend .busy span {
    border-color: #ff962f;
}
.date_header {
    text-align: center;
}
.app_time .model_content {
    width: 600px;
}
.tkfws {
    margin-top: 12px;
}

.tklist {
    display: inline-block;
    margin-right: 12px;
}
.tklist li {
    float: left;
    border: 1px solid #efefef;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.tklist li.active {
    border: 1px solid #2cbcc8;
    color: #2cbcc8;
}
.icongou::before {
    content: "\E650";
    position: absolute;
    font-size: 36px;
    right: -10px;
    bottom: -9px;
}

/* .progress {
  margin: 20px 0;
} */
.sousuo {
    position: absolute;
    right: 0;
    top: 1px;
    border-left: 1px solid #dcdfe6;
    width: 26px;
    height: 26px;
    text-align: center;
    cursor: pointer;
}
.sousuo.active {
    border-left: 1px solid #2cbcc8;
}
.iconss::before {
    content: "\e632";
}
.sousuo.active .iconss {
    color: #2cbcc8;
}
.rt {
    float: right;
}
.selectemp {
    position: relative;
    display: inline-block;
}
/*  */
.staff_time .x_model_main {
    width: 400px;
}
.satff_time > li {
    margin: 24px 0;
}
.text_warning.warning {
    text-align: center;
    margin: 12px 0 24px 0;
}
.satff_time > li > span {
    float: left;
    width: 100px;
    text-align: right;
}
.satff_time > li > div {
    margin-left: 110px;
}
.no_border {
    border: 1px solid transparent !important;
}
.btn_wrap {
    margin: 1.666667rem 0;
    text-align: center;
}
.btn_wrap button:last-child {
    margin-left: 24px;
}
.AboutBranch {
    position: absolute;
    left: 0;
    top: 30px;
    z-index: 1000;
    background: #fff;
}
.modelservice .model_content {
    width: 75rem;
    height: 50rem;
    background-color: #fff;
    overflow: hidden;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
.AddcardSearch {
    font-size: 12px;
    color: #666666;
    padding: 0 30px;
    margin-top: 12px;
}
.card_main {
    float: left;
    width: 20%;
}
/* .tklistdetail .card_main {
    width: 20%;
} */
.cardElement {
    margin: 0 12px 24px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    border: solid 2px #e6e2f7;
    background: #fff;
    padding: 6px;
    position: relative;

    transition: all 0.16s;
    -webkit-transition: all 0.16s; /* Safari */
}
.BoxElement .icon,
.cardElement .icon {
    color: #ab9ee6;
}
.validStatus {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
}
.cardElement .icongou::before {
    position: absolute;
    font-size: 46px;
    right: -13px;
    bottom: -5px;
}
.Background {
    border: 2px solid #ab9ee6;
    transition: all 0.16s;
    -webkit-transition: all 0.16s; /* Safari */
}
.BoxElement {
    /* text-align: center; */
    font-size: 1rem;
    color: #666666;
    line-height: 2.5rem;
    position: relative;
}
.TextLine {
    text-decoration: line-through;
}
.TextColor {
    color: #ed8617 !important;
}
.cardText {
    font-size: 0.666667rem;
    line-height: 1.666667rem;
}
.cardImg {
    width: 100%;
    cursor: pointer;
    height: 96px;
}
.card_name {
    /* padding: 0 6px; */
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.AddcardBox {
    height: 68%;
    height: -moz-calc(100% - 152px);
    height: -o-calc(100% - 152px);
    height: -ms-tcalc(100% - 152px);
    height: -webkit-calc(100% - 152px);
    height: calc(100% - 152px);
    /* margin: 0 24px; */
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 12px;
}
.tklistdetail_wrap {
    height: 74%;
    height: -moz-calc(100% - 152px);
    height: -o-calc(100% - 152px);
    height: -ms-calc(100% - 152px);
    height: -webkit-calc(100% - 152px);
    height: calc(100% - 152px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px;
}
</style>
<style>
.add_appointment .taoka .el-table {
    width: 382px;
    max-width: 382px;
    display: inline-block;
}
.el-popover.busy {
    background-color: #ff962f;
    color: #fff;
}
.el-popper[x-placement^="top"].busy .popper__arrow::after {
    border-top-color: #ff962f;
}
.el-popover.busyness {
    background-color: #ff5500;
    color: #fff;
}
.el-popper[x-placement^="top"].busyness .popper__arrow::after {
    border-top-color: #ff5500;
}
</style>


