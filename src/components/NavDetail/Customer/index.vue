<template>
    <div class="right_content_wrap customer">
        <div class="search_wrap">
            <ul>
                <li v-if="corpShow">
                    <span>
                        部门：
                    </span>
                    <getCorpStore @getCorpStore="getCorpStore" :values="cCodesArr" />
                </li>
                <li v-if="sCodeShow">
                    <span>
                        门店：
                    </span>
                    <Select :SelecttemData="storeDatas" :values="search.sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" />
                </li>
                <li>
                    <span>
                        会员：
                    </span>
                    <input class="x_input" type="text" v-model='search.cCodeOrNameOrPhone' placeholder="会员编号/名称/手机号" />
                </li>
                <li>
                    <span>
                        所属技师：
                    </span>
                    <el-select placeholder="请选择 " v-model='search.cEmpWorkNo' clearable>
                        <el-option v-for="item in staff" :label="item.empName" :value="item.workNo" :key="item.workNo">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        所属顾问：
                    </span>
                    <el-select placeholder="请选择 " v-model='search.cSaleMgrWorkNo' clearable>
                        <el-option v-for="item in manager" :label="item.empName" :value="item.workNo" :key="item.workNo">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        会员状态：
                    </span>
                    <el-select placeholder="请选择 " v-model='search.cCustStatus' clearable>
                        <el-option v-for="item in cCustStatus" :label="item.name" :value="item.code" :key="item.code">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        <Button Name="查询" @click.native="getData(1)" Search="true"></Button>
                        <Button Name="重置" @click.native="reset" Reset="true"></Button>
                    </span>
                </li>
            </ul>
        </div>
        <div class="right_content">
            <div class="btn_wrap">
                <Button :iconadd="true" Name="新增" buttonClass="purple" @click.native="addData" v-if="addShow"></Button>
                <Button Name="分配归属门店" buttonClass="purple" @click.native="allotStore" v-if="storeShow"></Button>
                <Button Name="分配跟进员工" buttonClass="purple" @click.native="allotPeople" v-if="empShow"></Button>
                <!-- <ToImport configKey='impCustAutoCode'></ToImport> -->
                <!-- <Button Name="导出" buttonClass="purple"></Button> -->
                <Button :Upload="true" Name="导出已选择" @click.native="downSelected" v-if="exportShow"></Button>
                <Button :Upload="true" Name="导出全部" @click.native="getData(1,total)" v-if="exportShow"></Button>
                <Button small="Btn small" Name="近期生日会员" @click.native.stop="recentBirthdayBTn()"></Button>
            </div>
            <div class="table_content">

                <el-table :data="datas" border @selection-change="selectDatasFun" ref="multipleTable" :row-key="getRowKeys" empty-text=' '>
                    <el-table-column type="selection" :reserve-selection="true">
                    </el-table-column>
                    <el-table-column prop="cCode" label="姓名(编号)" width="200">
                        <template slot-scope="scope">
                            <i v-if="scope.row.workNo!='--'" :title="'内部员工，工号：'+scope.row.workNo" class="icon x_xing"></i>
                            <Button small="Btn small" :Name="scope.row.cName+'('+ scope.row.cCode+')'" @click.native.stop="viewDetails(scope.row)"></Button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cPhone" label="手机号" width="120">
                    </el-table-column>
                    <el-table-column prop="levName" label="会员等级" width="100">
                    </el-table-column>
                    <el-table-column prop="sName" label="当前门店" width="180">
                    </el-table-column>
                    <el-table-column label="跟进技师" width="140">
                        <template slot-scope="scope">
                            <el-popover placement="top-start" title="跟进技师" width="200" trigger="hover" :open-delay='500'>
                                <ul>
                                    <li v-for='(item,key) in scope.row.empList' :class="{isMain:item.isMain}" :key='key'>{{item.emp}}</li>
                                </ul>
                                <div slot="reference">
                                    <p class="cousor">
                                        <span v-for='(item,key) in scope.row.empName' :class="{isMain:item.isMain}" :key='key'>{{item.emp}}</span>
                                        <span v-if='scope.row.empList.length>1'>...</span>
                                    </p>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟进顾问" width="140">
                        <template slot-scope="scope">
                            <el-popover placement="top-start" title="跟进顾问" width="200" trigger="hover" :open-delay='500'>
                                <ul>
                                    <li v-for='(item,key) in scope.row.mgrList' :class="{isMain:item.isMain}" :key='key'>{{item.emp}}</li>
                                </ul>
                                <div slot="reference">
                                    <p class="cousor">
                                        <span v-for='(item,key) in scope.row.mgrName' :class="{isMain:item.isMain}" :key='key'>{{item.emp}}</span>
                                        <span v-if='scope.row.mgrList.length>1'>...</span>
                                    </p>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="custStatusText" label="会员状态" width="130">
                    </el-table-column>
                    <el-table-column width="260" label='操作' fixed='right'>
                        <template slot-scope="scope">
                            <Button small="Btn small" v-if="editShow" Name="修改" @click.native.stop="editData(scope.row,scope.$index)"></Button>
                            <i class="cut_off_rule" v-if="freezeShow"></i>
                            <Button small="Btn small" v-if='scope.row.custStatus!==2&&freezeShow' Name="冻结" @click.native.stop="freeze(scope.row.id,2)"></Button>
                            <Button small="Btn small" v-if='scope.row.custStatus===2&&freezeShow' Name="解冻" @click.native.stop="freeze(scope.row.id,0)"></Button>
                            <i class="cut_off_rule" v-if="!(!integralShow&&!refundShow&&!CancelCardShow)"></i>
                            <el-dropdown trigger="click" @command='dropdownClick' v-if="!(!integralShow&&!refundShow&&!CancelCardShow)">
                                <span class="el-dropdown-link">
                                    更多
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :disabled='scope.row.custStatus===2&&freezeShow' :command="{n: 'a', data: scope.row}" v-if="integralShow">赠送积分</el-dropdown-item>
                                    <el-dropdown-item :disabled='scope.row.custStatus===2&&freezeShow' :command="{n: 'b', data: scope.row}" v-if="refundShow">退款</el-dropdown-item>
                                    <el-dropdown-item :disabled='scope.row.custStatus===2&&freezeShow' :command="{n: 'c', data: scope.row}" v-if="CancelCardShow">退卡</el-dropdown-item>
                                    <el-dropdown-item :disabled='scope.row.custStatus===2&&freezeShow' :command="{n: 'd', data: scope.row}">会员调整</el-dropdown-item>
                                    <el-dropdown-item :disabled='scope.row.custStatus===2&&freezeShow' :command="{n: 'e', data: scope.row}">赠送优惠券</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                    <el-table-column fixed='right' min-width='1'>
                    </el-table-column>
                </el-table>
                <div class="pagingwidth">
                    <Paging :handleCurrentChange="getData" :total="total" :currentPage='pageNumber' />
                </div>
            </div>
        </div>

        <!-- 赠送积分 -->
        <transition name="el-fade-in">
            <div class='x_model give_integral' v-if="giveIntegralShow">
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">赠送积分</div>
                        <div class="right curor icon Fork" @click="closeModel"></div>
                    </header>
                    <div class="x_model_main">
                        <ul class="clearfix">
                            <li>
                                <span>赠送对象：</span>
                                {{giveIntegralcName}}{{'('+giveIntegralData.cCodes[0]+')'}}
                            </li>
                            <li>
                                <span>赠送积分值：</span>
                                <input @keyup="giveIntegralData.changeAmount.length>0?giveIntegralData.changeAmount=giveIntegralData.changeAmount.replace(/[^0-9]/g, ''):giveIntegralData.changeAmount=giveIntegralData.changeAmount.replace(/\D/g,'')" type="number" class=" give_int_inp" placeholder="0" v-model='giveIntegralData.changeAmount' /> 分
                            </li>
                            <li>
                                <span>备注：</span>
                                <textarea name="" id="" cols="30" rows="4" v-model='giveIntegralData.remark'></textarea>
                            </li>
                        </ul>
                    </div>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeModel" buttonClass="None" />
                        <Button Name="确定" @click.native="sureGiveIntegral" />
                    </div>
                </div>
            </div>
            <!-- 赠送积分 -->
        </transition>

        <!-- 赠送优惠券 -->
        <transition name="el-fade-in">
            <div class='x_model give_coupon' v-if="couponShow">
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">赠送优惠券</div>
                        <div class="right curor icon Fork" @click="closeCouponModel"></div>
                    </header>
                    <div class="x_model_main">
                        <div class="search_wrap">
                            <ul>
                                <li>
                                    优惠券名称：
                                    <input v-model="queryCoupon.cpName" placeholder="请输入券名称" type="text" class="x_input"></li>
                                <li>
                                    优惠券类型：
                                    <el-select v-model='queryCoupon.cpType' placeholder="请选择 " clearable>
                                        <el-option v-for="item in couponStatus" :label="item.value" :value="item.key" :key="item.key">
                                        </el-option>
                                    </el-select>
                                </li>
                                <li>
                                    <Button Name="搜索" @click.native="giveCoupon(1)" />
                                </li>
                            </ul>
                        </div>
                        <div>
                            <el-table :data="couponDatas" border @selection-change="selectCouponFun" ref="couponTable" :row-key="rowKey" empty-text=' '>
                                <el-table-column type="selection" :reserve-selection="true">
                                </el-table-column>
                                <el-table-column prop="cpName" label="优惠券名称" width="200">
                                </el-table-column>
                                <el-table-column prop="cpType" label="优惠券类型" width="120">
                                </el-table-column>
                                <el-table-column prop="cpPayType" label="付费类型" width="100">
                                </el-table-column>
                                <el-table-column prop="cpStock" label="剩余库存" width="100">
                                </el-table-column>
                                <el-table-column prop="validDate" label="券有效期" width="180">
                                </el-table-column>
                                <el-table-column fixed='right' min-width='1'>
                                </el-table-column>
                            </el-table>
                            <Paging :handleCurrentChange="giveCoupon" :total="couponTotal" :pageSize='10' />
                        </div>

                    </div>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeCouponModel" buttonClass="None" />
                        <Button Name="确定" @click.native="sureGiveCoupon" />
                    </div>
                </div>
            </div>
        </transition>
        <!-- 赠送优惠券 -->
    </div>
</template>
<script>
import Button from "@/components/common/Button";
import Paging from "@/components/common/Paging";
import Input from "@/components/common/Input";
import ToImport from "@/components/common/toImport";
import Select from "../../common/Select";
import Vue from "vue";
import { mapState, mapMutations } from "vuex"
export default {
    name: "Customer",
    components: { Button, Paging, Input, ToImport, Select, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) }, },
    // props:[values,],
    data() {
        return {
            addShow: false,//新增权限
            editShow: false,//编辑权限
            freezeShow: false,//冻结权限
            integralShow: false,//赠送积分权限
            refundShow: false,//退款权限
            CancelCardShow: false,//退卡权限
            exportShow: false,//导出权限
            storeShow: false,//分配归属门店权限
            empShow: false,//分配跟进员工权限
            corpShow: false,
            sCodeShow: false,
            pageNumber: 1,
            //赠送积分show
            giveIntegralShow: false,

            //赠送积分data
            giveIntegralData: {
                cCodes: [],
                changeAmount: "",
                remark: "",
            },

            //赠送积分的客户名
            giveIntegralcName: '',

            //门店数组
            storeDatas: [],
            //部门
            cCodesArr: [],

            //总条数
            total: 0,

            //数据
            datas: [],

            //全选
            checkedAll: false,

            cCustStatus: [
                {
                    code: '0',
                    name: '正常'
                },
                {
                    code: '1',
                    name: '休眠'
                },
                {
                    code: '2',
                    name: '冻结'
                },
            ],

            //技师
            staff: [
                {
                    code: '1',
                    name: '技师A'
                },
                {
                    code: '2',
                    name: '技师B'
                },
                {
                    code: '3',
                    name: '技师C'
                },
            ],

            //经理
            manager: [
                {
                    code: "1",
                    name: '经理A'
                },
                {
                    code: "2",
                    name: '经理B'
                }
            ],

            //搜索
            search: {
                cCodeOrNameOrPhone: "",
                dept: '',
                sCode: '',
                cEmpWorkNo: "",
                cSaleMgrWorkNo: "",
                cCustStatus: '',
                custflowStatus: "",//客户被跟进状态
            },

            //当前选中数据
            selectDatas: [],

            //优惠券query
            queryCoupon: {
                cpName: '',
                cpType: '',
            },
            //优惠券数据
            couponDatas: [],

            //
            couponTotal: 0,
            //已选优惠券
            selectCoupon: [],
            //赠送优惠券show
            couponShow: false,
            couponStatus: [
                {
                    key: '2',
                    value: '代金券'
                },
                {
                    key: '0',
                    value: '兑换券'
                }, {
                    key: '1',
                    value: '折扣券'
                }
            ],
            //赠送优惠券
            giveCouponData: {
                "customerId": '',//客户ID,
                "custAcct": '',//客户账户编号,
                "batchNoList": [],//优惠券批次号
            }

        }
    },
    computed: {
        ...mapState(["newCustomer"])
    },
    methods: {

        //近期生日客户按钮
        recentBirthdayBTn() {
            this.$router.push({
                path: "/NavDetail/Customer/recentBirthday",
            });
        },
        //部门
        getCorpStore(value) {
            if (this.search.dept != value[value.length - 1]) {
                this.search.dept = value[value.length - 1];
                this.search.sCode = ""
                this.getStore();
                this.getEmployee()
            }
        },
        //根据部门 查门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 500,
                corpCode: this.search.dept || this.$getCookie("dept") || "",
                queryType: 0
            }
            if (!this.search.dept) {//默认门店（当前部门下的门店）
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

        //获取数据
        upInput(value, arguName) {
            this.search[arguName] = value;
        },
        //rowKey
        rowKey(row) {
            return row.batchNo;
        },
        ...mapMutations(["updateAlives", 'setDatas']),
        getRowKeys(row) {
            return row.id;
        },
        //选择的数据
        selectDatasFun(val) {
            this.selectDatas = val;
        },

        //导出已选择
        downSelected() {
            if (this.selectDatas.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择期望导出的会员!',
                    duration: "3000",
                    onClose: () => {
                    }
                });
            } else {
                let arr1 = ['会员编号', '姓名', "手机号", '会员等级', '当前门店', '当前技师', '当前会员经理'];
                let arr2 = ['cCode', 'cName', 'cPhone', 'levName', 'sName', 'empNames', 'mgrNames'];
                this.$exportExcel(arr1, arr2, this.selectDatas, '会员列表');
                this.$refs.multipleTable.clearSelection()
            }

        },


        //确定赠送积分
        sureGiveIntegral() {
            let par = this.giveIntegralData;
            this.$post(this.$host + "/api/order/integralHis/givenIntegral", par)
                .then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '积分赠送成功!',
                            onClose: () => {
                                this.giveIntegralShow = !this.giveIntegralShow;
                            }
                        });

                    }
                });
        },

        //赠送积分按钮
        dropdownClick(val) {
            switch (val.n) {
                case "a"://赠送积分
                    this.giveIntegralShow = !this.giveIntegralShow;
                    this.giveIntegralData.cCodes = [val.data.cCode];
                    this.giveIntegralcName = val.data.cName;
                    break;
                case "b"://添加退款
                    this.$router.push({
                        path: "/NavDetail/refund/addRefund",
                        query: {
                            type: '_selected',
                            cCode: val.data.cCode,
                            cName: val.data.cName,
                        }
                    });
                    break;
                case "c"://添加退卡
                    this.$router.push({
                        path: "/NavDetail/OpenCard",
                        query: {
                            cCode: val.data.cCode,
                        }
                    });
                    break;
                case "d"://会员调整
                    this.$router.push({
                        path: "/NavDetail/customerAdjust",
                        query: {
                            cCode: val.data.cCode,
                            cName: val.data.cName,
                            id: val.data.id,
                        }
                    });
                    break;
                case "e"://赠送优惠券
                    this.giveCoupon(1);
                    this.giveCouponData.customerId = val.data.id;
                    this.giveCouponData.custAcct = val.data.custAcct;
                    this.couponShow = true;
                    break;
            }

        },

        //确定赠送
        sureGiveCoupon() {
            if (this.selectCoupon.length == 0) {
                this.$message({
                    type: "warning",
                    message: "请选择优惠券！",
                });
            } else {
                this.giveCouponData.batchNoList = []
                this.selectCoupon.map(el => {
                    if (el.batchNo) {
                        this.giveCouponData.batchNoList.push(el.batchNo)
                    }
                })
                this.$post(this.$host + "/api/mkt/coupon/giveCustCoupon", this.giveCouponData)
                    .then(d => {
                        if (d.success) {
                            this.$message({
                                type: "success",
                                message: "赠送成功！",
                            });
                            this.couponShow = false;
                        }
                    });
            }


        },

        //已选优惠券
        selectCouponFun(val) {
            this.selectCoupon = val
        },
        closeCouponModel() {
            this.couponShow = false;
            this.selectCoupon = [];
        },
        //赠送优惠券
        giveCoupon(val) {
            let par = {
                "pageNumber": parseInt(val),
                "pageSize": 10,
                logicType: 1,
                cpType: this.queryCoupon.cpType || undefined,
                cpName: this.queryCoupon.cpName || undefined,
            };
            this.$post(this.$host + "/api/mkt/coupon/findCouponList", par)
                .then(d => {
                    if (d.success) {
                        d.data.content.map(el => {
                            switch (el.cpStatus) {
                                case 1:
                                    el.cpStatusText = '未投放'
                                    break;
                                case 2:
                                    el.cpStatusText = '已投放'
                                    break;
                                case 3:
                                    el.cpStatusText = '已过期'
                                    break;
                            }
                            //券类型
                            switch (el.cpType) {
                                case 0:
                                    el.cpType = '兑换券'
                                    break;
                                case 1:
                                    el.cpType = '折扣券'
                                    break;
                                case 2:
                                    el.cpType = '代金券'
                                    break;
                            };
                            //付费类型
                            switch (el.cpPayType) {
                                case 1:
                                    el.cpPayType = '免费'
                                    break;
                                case 2:
                                    el.cpPayType = '付费'
                                    break;
                                case 3:
                                    el.cpPayType = '积分'
                                    break;
                                case 4:
                                    el.cpPayType = '第三方团购'
                                    break;
                            }
                        })
                        let len = d.data.content.length
                        if (d.data.content.length < 10) {
                            for (let i = 0; i < 10 - len; i++) {
                                let obj = {};
                                d.data.content.push(obj)
                            }
                        }

                        this.couponDatas = d.data.content;
                        this.couponTotal = d.data.total;
                    }
                });
        },

        closeModel() {
            this.giveIntegralShow = !this.giveIntegralShow;
        },

        //搜索重置
        reset() {
            this.search = {
                cCodeOrNameOrPhone: "",
                // sDistrictCode: "",
                // sCode: "",
                cEmpWorkNo: "",
                cSaleMgrWorkNo: "",
            };
        },

        // 分配门店
        allotStore() {
            if (this.selectDatas.length > 0) {
                let selected = [];
                this.selectDatas.map(el => {
                    selected.push(el.id);
                })
                this.$router.push({
                    path: "/NavDetail/allotStore",
                    query: {
                        selected: JSON.stringify(selected) || ""
                    }
                })
            } else {
                this.$message({
                    type: "info",
                    message: "请先选择会员",
                });
            }
        },

        // 分配跟进员工
        allotPeople() {
            if (this.selectDatas.length > 0) {
                let selected = [];
                this.selectDatas.map(el => {
                    selected.push(el.id);
                })
                this.$router.push({
                    path: "/NavDetail/allotPeople",
                    query: {
                        selected: JSON.stringify(selected) || ""
                    }
                })
            } else {
                this.$message({
                    type: "info",
                    message: "请先选择会员",
                });
            }
        },

        //新增客户
        addData() {
            this.$router.push({
                path: "/NavDetail/addCustomer"
            })
        },

        //修改客户
        editData(val, key) {
            this.$router.push({
                path: "/NavDetail/addCustomer",
                query: {
                    id: val.id
                }
            })
        },

        //查看详情
        viewDetails(item) {
            this.$router.push({
                path: "/NavDetail/customerDetails",
                query: {
                    id: item.id,
                    code: item.cCode
                }
            })
        },

        //冻结
        freeze(id, num) {
            let warnMessage = '';
            let message = '';
            let cancleMessage = '';
            if (num === 2) {
                warnMessage = '此操作将冻结该会员, 是否继续?'
                message = '冻结成功!';
                cancleMessage = '已取消冻结！'
            } else {
                warnMessage = '此操作将解冻该会员, 是否继续?'
                message = '解冻成功!';
                cancleMessage = '已取消解冻！'
            }
            this.$messagebox.confirm(warnMessage, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let par = {
                    id: id,
                    cCustStatus: num,
                    accessToken: this.$getCookie("accessToken"),
                }
                this.$post(this.$host + "/api/cust/customer/setstatus", par)
                    .then(d => {
                        if (d.success) {
                            this.$message({
                                type: 'success',
                                message: message,
                                duration: "1000",
                                onClose: () => {
                                    this.getData(1)
                                }
                            });
                        }
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: cancleMessage
                });
            });

        },

        //获取客户列表
        getData(i, total) {
            this.pageNumber = i;
            let par = {
                sCode: this.$getCookie("belongShop"),
                dept: this.$getCookie('dept'),
                pageNumber: parseInt(i),
                pageSize: total || 20,
            }
            for (let key in this.search) {
                if (this.search[key] !== '') {
                    par[key] = this.search[key];
                }
            }
            this.$post(this.$host + "/api/cust/customer/page", par)
                .then(d => {
                    if (d.success) {

                        d.data.content.map(el => {
                            el.isChecked = false;
                            for (let key in el) {
                                if (el[key] === null || el[key] === '') {
                                    el[key] = "--"
                                };

                            }
                            switch (el.custStatus) {
                                case 0: el.custStatusText = "正常"; break;
                                case 1: el.custStatusText = "休眠"; break;
                                case 2: el.custStatusText = "冻结"; break;
                            }
                            el.empName = el.empList.length > 0 ? [el.empList[0]] : [];
                            el.mgrName = el.mgrList.length > 0 ? [el.mgrList[0]] : [];
                            el.empNames = '';
                            el.mgrNames = '';
                            el.empList.map(val => {
                                el.empNames += val.emp
                            });
                            el.mgrList.map(val => {
                                el.mgrNames += val.emp
                            })
                        })


                        if (total) {//导出全部
                            if (d.data.content.length === 0) {
                                this.$message({
                                    type: 'warning',
                                    message: '无数据!',
                                    duration: "3000",
                                    onClose: () => {
                                    }
                                });
                            } else {
                                let arr1 = ['会员编号', '姓名', "手机号", '会员等级', '当前门店', '当前技师', '当前顾问'];
                                let arr2 = ['cCode', 'cName', 'cPhone', 'levName', 'sName', 'empNames', 'mgrNames'];
                                this.$exportExcel(arr1, arr2, d.data.content, '会员列表')
                            }
                        } else {
                            this.datas = d.data.content;
                            this.total = d.data.total;
                        }

                    }
                });
        },
        // 获取员工
        getEmployee() {
            let par = {
                belongShop: this.$getCookie("belongShop"),
                pageNumber: 1,
                pageSize: 1000,
                dept: this.search.dept || this.$getCookie("dept") || "",
            }
            this.$post(this.$host + "/api/store/employee/query/page", par)
                .then(d => {
                    if (d.success) {
                        this.manager = JSON.parse(JSON.stringify(d.pageData.content));
                        this.staff = JSON.parse(JSON.stringify(d.pageData.content));
                    }
                });
        },
    },
    activated() {
        // if (this.newCustomer) {
        //查询会员列表
        this.selectDatas = [];
        this.$refs.multipleTable.clearSelection()
        this.selectCoupon = [];
        // this.$refs.couponTable.clearSelection()
        let type = this.$route.query.type || "";
        if (type == "undistributed") {//待分配跟进人客户
            this.search.custflowStatus = 0;
        } else {
            this.search.custflowStatus = "";
        }
        this.getData(this.pageNumber);
        this.setDatas({ name: "newCustomer", value: false })
        // }
    },
    mounted() {

        // this.getData(1);
        this.getStore();
        this.getEmployee();
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F052") {//会员管理的权限
                if (el.fUrl == "add") {
                    this.addShow = true;
                }
                if (el.fUrl == "edit") {
                    this.editShow = true;
                }
                if (el.fUrl == "freeze") {
                    this.freezeShow = true;
                }
                if (el.fUrl == "integral") {
                    this.integralShow = true;
                }
                if (el.fUrl == "refund") {
                    this.refundShow = true;
                }
                if (el.fUrl == "CancelCard") {
                    this.CancelCardShow = true;
                }
                if (el.fUrl == "export") {
                    this.exportShow = true;
                }
                if (el.fUrl == "store") {
                    this.storeShow = true;
                }
                if (el.fUrl == "emp") {
                    this.empShow = true;
                }
                if (el.fUrl == "corp") {
                    this.corpShow = true;
                }
                if (el.fUrl == "sCode") {
                    this.sCodeShow = true;
                }

            }
        })
    },


}

</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.give_int_inp {
    width: 80px;
}
table {
    width: 100%;
}
.table-wrap {
    width: 100%;
    min-width: 930px;
}

.btn_wrap {
    margin-bottom: 12px;
}
.give_coupon .model_content {
    width: 800px;
}
.give_integral .x_model_main {
    width: 400px;
    margin: 12px 24px;
}
.x_model_main li {
    margin: 6px 0;
}
.x_model_main li span {
    display: inline-block;
    width: 80px;
    text-align: right;
}
.x_model_main li textarea {
    vertical-align: top;
}
</style>
<style>
.customer .el-dropdown {
    font-size: 12px;
}
.customer .el-dropdown span {
    padding-left: 0.6rem;
}
.customer .el-dropdown span:hover {
    cursor: pointer;
}
.customer .el-dropdown .el-dropdown-link .Btn {
    padding-right: 0;
}
.customer .el-dropdown .el-icon--right {
    margin: 0;
}
</style>


