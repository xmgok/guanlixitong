<template>
    <div class="appointment right_content_wrap">
        <div>
            <ul class="tklist clearfix">
                <li v-for="(item,index) in tabSelect" :class="{active:item.active}" @click="toggleSelect(item)">{{item.name}}
                </li>
            </ul>
        </div>
        <div v-show='tabSelect[0].active'>
            <div id='calendar'>

            </div>
        </div>
        <div v-show='tabSelect[1].active'>
            <div class="search_wrap">
                <ul>
                    <li>
                        <span>
                            预约来源：
                        </span>
                        <el-select v-model="query.dateSource" placeholder="请选择">
                            <el-option v-for="item in sourceStus" :key="item.key" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </li>

                    <li>
                        <span>
                            会员：
                        </span>
                        <input class="x_input" type="text" v-model='query.customer' placeholder="会员编号/姓名/手机号码" />
                    </li>
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
                        <Select :SelecttemData="storeDatas" :values="query.belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" />
                    </li>

                    <li>
                        <span>
                            状态：
                        </span>
                        <el-select v-model="query.status" placeholder="请选择">
                            <el-option v-for="item in status" :key="item.key" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </li>

                    <li>
                        <span>
                            是否会员：
                        </span>
                        <el-select v-model="query.isMember" placeholder="请选择">
                            <el-option v-for="item in memberStus" :key="item.key" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </li>
                    <li>
                        <span>
                            预约时间：
                        </span>
                        <el-date-picker clearable size='mini' v-model="date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                        </el-date-picker>

                    </li>
                    <li>
                        <Button Name="查询" @click.native="gotoPage(1,'ser')" Search="true"></Button>
                        <Button Name="重置" @click.native="reset" Reset="true"></Button>
                    </li>
                </ul>
            </div>

            <div class="right_content">
                <div class="btn_wrap">
                    <Button :iconadd="true" Name="新增" @click.native="addAppointmentBtn()"></Button>
                    <!-- <Button Name="导出" @click.native="downAll()"></Button> -->
                </div>
                <div>
                    <el-table :data="datas" border style="width: 100%" align='left' @selection-change="handleSelectionChange">
                        <!-- <el-table-column type="selection" width="55">
                    </el-table-column> -->
                        <el-table-column prop="cName" label="预约人" width="100" fixed="left">
                        </el-table-column>
                        <el-table-column prop="levName" label="会员等级" width="120">
                        </el-table-column>
                        <el-table-column prop="sName" label="预约门店" width="200">
                        </el-table-column>
                        <el-table-column prop="dateDate" label="预约到店时间" width="160">
                        </el-table-column>
                        <el-table-column prop="period" label="预约时长(分钟)" width="140">
                        </el-table-column>
                        <el-table-column prop="psNameList" label="预约内容" min-width="180">
                            <template slot-scope="scope">
                                <el-popover placement="top-start" title="" width="200" trigger="hover">
                                    <ul>
                                        <li v-for='item in scope.row.psNameList'>{{item.psName}} </li>
                                    </ul>
                                    <p slot="reference"> {{scope.row.psNameListFirst}}</p>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="empName" label="预约服务员工" width="130">
                        </el-table-column>
                        <el-table-column prop="dateSourceText" label="预约来源" width="140">
                        </el-table-column>
                        <el-table-column prop="statusText" label="预约状态" width="140">
                        </el-table-column>
                        <el-table-column width="330" fixed="right" label="操作">
                            <template slot-scope="scope">
                                <Button small="Btn small" Name="查看" @click.native="seeDetail(scope.row.dateNo)"></Button>
                                <i v-if='scope.row.dao' class="cut_off_rule"></i>
                                <Button v-if='scope.row.dao' small="Btn small" Name="到店" @click.native="sureCancleApp(scope.row,1)"></Button>
                                <i v-if='scope.row.que' class="cut_off_rule"></i>
                                <Button v-if='scope.row.que' small="Btn small" Name="确认" @click.native="sureCancleApp(scope.row,4)"></Button>
                                <i v-if='scope.row.bian' class="cut_off_rule"></i>
                                <Button v-if='scope.row.bian' small="Btn small" Name="变更" @click.native="editDetail(scope.row.dateNo)"></Button>
                                <i v-if='scope.row.qu' class="cut_off_rule"></i>
                                <Button v-if='scope.row.qu' small="Btn small" Name="取消" @click.native="cancelApp(scope.row,2)"></Button>
                                <i v-if='scope.row.kai' class="cut_off_rule"></i>
                                <Button v-if='scope.row.kai' small="Btn small" Name="开单" @click.native="openOrder(scope.row)"></Button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagingwidth">
                        <Paging :handleCurrentChange="gotoPage" :total="total"  :currentPage="pageNumber"/>
                    </div>
                </div>
            </div>
            <div class='x_model cancle_app' v-if="addAppointmentShow">
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">取消预约</div>
                        <div class="right curor icon Fork" @click="closeModel"></div>
                    </header>
                    <div class="x_model_main">
                        <div class="cancle_main">
                            <p>取消原因：</p>
                            <textarea name="" id="" cols="30" rows="4" v-model='cancleRemark'></textarea>
                        </div>
                    </div>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeModel" buttonClass="None" />
                        <Button Name="确定" @click.native="sureCancleApp('',2)" />
                    </div>
                </div>
            </div>
            <!-- <Mytext v-model='something'></Mytext>{{something}} -->
        </div>
    </div>

</template>
<script>
import $ from 'jquery';
import fullcalendar from "fullcalendar";
import 'fullcalendar-scheduler';
import "fullcalendar/dist/fullcalendar.css";
import Button from "../../common/Button";
// import Mytext from "../../common/mytext";
import Paging from "../../common/Paging";
import Select from "../../common/Select";
import { mapMutations, mapState } from "vuex"
export default {
    name: "appointment",
    components: { Button, getArea: resolve => { require(['@/components/common/getArea'], resolve) }, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) }, Select, Paging },
    data() {
        return {
            pageNumber:1,
            tabSelect: [
                {
                    name: '看板模式',
                    active: true,
                },
                {
                    name: '列表模式',
                    active: false,
                },
            ],
            corpShow: false,//部门权限
            sCodeShow: false,//门店权限
            cCodesArr: [],
            value: '',
            something: '',
            myText: '',
            CancleAppNo: '',
            //
            total: 0,

            datas: [{ a: '测试数据' }],

            //日期快捷
            pickerOptions: {
                shortcuts: [{
                    text: '最近一天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近两天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 2);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            //门店data
            storeDatas: [],

            //日期
            date: [],
            //搜索
            query: {
                belongShop: "",
                // beginTime: "",
                // endTime: "",
                status: "",
                dateSource: "",
                isMember: "",
                customer: "",
            },

            //部门名字
            cName: '',

            //部门code
            cCode: '',

            //添加预约header
            addAppointmentHeader: '添加预约',

            //取消预约show
            addAppointmentShow: false,

            //取消预约show
            cancleAppShow: false,

            // 状态
            status: [
                {
                    key: 0,
                    value: "已登记"
                }, {
                    key: 1,
                    value: "已到店"
                }, {
                    key: 2,
                    value: "已取消"
                },
                {
                    key: 3,
                    value: "未履约"
                },
                {
                    key: 4,
                    value: "已确定"
                },
                {
                    key: 5,
                    value: "已开单"
                },
            ],

            //预约来源
            sourceStus: [
                {
                    key: 0,
                    value: "门店代约 "
                }, {
                    key: 1,
                    value: "自主预约"
                },
            ],

            //是否会员
            memberStus: [
                {
                    key: 0,
                    value: "否"
                }, {
                    key: 1,
                    value: "是"
                },
            ],

            selectData: [],

            //取消预约备注
            cancleRemark: '',


            minTime: '',
            maxTime: '',
            events: '',
            resources: "",

        }
    },
    computed: {
        ...mapState(["storesvuex"]),

    },
    methods: {
        //tab 切换
        toggleSelect(item) {
            this.tabSelect.map(el => {
                el.active = false;
            });
            item.active = true;
        },
        openOrder(val) {
            this.$router.push({
                path: "/NavDetail/addOrder",
                query: {
                    resUrl: "/NavDetail/appointment",
                    item: JSON.stringify(val),
                }
            });
        },
        //关闭model取消预约
        closeModel() {
            this.addAppointmentShow = false;
        },

        //确定 取消预约
        sureCancleApp(el, val) {
            let par = {
                "dateNo": el.dateNo,
                "remark": el.remark,
                "status": val
            }
            if (el === '') {
                par.dateNo = this.CancleAppNo
            }

            if (val === 1) {
                this.$messagebox.confirm('该操作将修改客户状态为到店，是否继续操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post(this.$host + "/api/cust/dateBill/updateDateBillStatus", par)
                        .then(d => {
                            if (d.success) {
                                this.gotoPage(this.pageNumber)
                                this.$messagebox.confirm("会员已到店，是否立即下单？", '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$router.push({
                                        path: "/NavDetail/addOrder",
                                        query: {
                                            resUrl: "/NavDetail/appointment",
                                            item: JSON.stringify(el),
                                        }
                                    });
                                }).catch(() => {
                                    this.$message({
                                        type: 'info',
                                        message: '已取消下单！',
                                        onClose: () => {
                                        }
                                    });
                                })
                            }
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消到店！',
                        onClose: () => {
                        }
                    });
                })
            } else {
                this.$post(this.$host + "/api/cust/dateBill/updateDateBillStatus", par)
                    .then(d => {
                        if (d.success) {
                            this.gotoPage(this.pageNumber)
                            let message = '';
                            switch (val) {
                                case 2: message = "预约已取消！"; break;
                                case 4: message = "已确认！"; break;
                            }
                            this.$message({
                                type: 'success',
                                message: message,
                                onClose: () => {
                                    this.addAppointmentShow = false;
                                }
                            });
                        }
                    });
            }

        },

        //取消预约
        cancelApp(item) {
            this.CancleAppNo = item.dateNo;
            this.addAppointmentShow = true;

        },

        seeDetail(val) {
            this.$router.push({
                path: "/NavDetail/appointment/seeAppointment",
                query: {
                    type: "_update",
                    dateNo: val,
                }
            });
        },

        //查看详情
        editDetail(val) {
            this.$router.push({
                path: "/NavDetail/appointment/addAppointment",
                query: {
                    type: "_update",
                    dateNo: val,
                }
            });
        },

        //导出
        downAll() {
            this.getDataId();
            if (this.batchDatas.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择期望导出的预约单!',
                    duration: "3000",
                    onClose: () => {
                    }
                });
            } else {
                let arr1 = ['预约人', '会员等级', "预约门店", '预约到店时间', '预约时长', '预约内容', '预约服务员工', "备注", "预约来源", "预约状态"];
                let arr2 = ['cName', 'levName', 'sName', 'dateDate', 'period', 'psNameList', 'empName', "remark", "dateSource", "status"];
                this.$exportExcel(arr1, arr2, this.batchDatas, '预约列表');
                this.batchDatas = [];
                this.batchDatasId = [];
                this.invert()
            }

        },

        //table选项
        handleSelectionChange(val) {
            console.log(val)
        },



        //重置
        reset() {
            this.query = {
                belongShop: "",
                // beginTime: "",
                // endTime: "",
                status: "",
                dateSource: "",
                isMember: "",
                customer: "",
            };
            this.cCodesArr = []
            //部门名字
            this.cName = '';
            this.date = '';
            //部门code
            this.cCode = '';
            // this.gotoPage(1)
        },
        //添加预约 按钮
        addAppointmentBtn() {
            this.$router.push({
                path: "/NavDetail/appointment/addAppointment",
                query: {
                    type: "_add"
                }
            });
        },

        //获取地区code
        getAreaCode(value) {

        },

        //获取数据
        upInput(value, arguName) {
            this.query[arguName] = value;
        },

        //部门
        getCorpStore(value) {
            if (this.cCode != value[value.length - 1]) {
                this.cCode = value[value.length - 1];
                this.query.belongShop = "";
                this.getStore();
            }
        },
        ...mapMutations(["setDatas"]),
        //根据部门 查门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 500,
                corpCode: this.cCode || this.$getCookie("dept") || "",
                queryType: 0,
            }
            if (!this.cCode) {//默认门店（当前部门下的门店）
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



        //查询预约
        gotoPage(index, val) {
            let par = {
                belongShop: this.$getCookie("belongShop"),
                // sCorp: this.$getCookie("dept"),
                pageNumber: parseInt(index),
                pageSize: 20,
            }
            this.pageNumber=parseInt(index);
            for (let key in this.query) {
                if (this.query[key] !== "") {
                    par[key] = this.query[key];
                }
            }
            if (!this.cCode && !this.query.belongShop) {

            } else {
                par.sCorp = this.cCode
                par.belongShop = this.query.belongShop;
            }
            if (typeof (this.date) == "object") {
                if (this.date !== null)
                    if (this.date.length > 0) {
                        par.beginTime = this.$dateFormat('yy-MM-dd', this.date[0]);
                        par.endTime = this.$dateFormat('yy-MM-dd', this.date[1]);
                    }
            }
            this.$post(this.$host + "/api/cust/dateBill/findDateBillPage", par)
                .then(d => {
                    if (d.success) {

                        d.data.content.map(el => {
                            el.psNameListFirst = '';
                            el.psNameListName = ''
                            if (el.psNameList.length > 1) {
                                el.psNameListFirst = el.psNameList[0].psName + '…';
                                el.psNameList.map(val => {
                                    el.psNameListName += val.psName + '\r\n'
                                })
                            } else {
                                el.psNameListFirst = el.psNameList[0].psName
                                el.psNameListName = el.psNameList[0].psName
                            }
                            switch (el.status) {
                                case 0:
                                    el.statusText = "已登记";
                                    el.dao = true;
                                    el.bian = true;
                                    el.qu = true;
                                    el.kai = false;
                                    el.que = true;
                                    break;
                                case 1:
                                    el.statusText = "已到店";
                                    el.bian = false;
                                    el.qu = false;
                                    el.dao = false;
                                    el.que = false;
                                    break;
                                case 2:
                                    el.statusText = "已取消";
                                    el.dao = false;
                                    el.bian = false;
                                    el.qu = false;
                                    el.kai = false;
                                    el.que = false;
                                    break;
                                case 3:
                                    el.statusText = "未履约";
                                    el.dao = false;
                                    el.bian = false;
                                    el.qu = false;
                                    el.kai = false;
                                    el.que = false;
                                    break;
                                case 4:
                                    el.statusText = "已确认";
                                    el.bian = true;
                                    el.qu = true;
                                    el.kai = false;
                                    el.dao = true;
                                    el.que = false;
                                    break;
                            }
                            if (el.status === 1 && el.regStatus === 1) {
                                el.kai = true;
                            } else if (el.status === 1 && el.regStatus === 3) {
                                el.kai = false;
                            }
                            switch (el.dateSource) {
                                case 0: el.dateSourceText = "门店代约"; break;
                                case 1: el.dateSourceText = "自主预约"; break;
                            }
                            if (el.levName === null) {
                                el.levName = '非会员'
                            }
                        })
                        this.datas = d.data.content;
                        this.total = d.data.total;

                    }
                });
        },

        //获取看板
        getGrade() {
            let _that = this;
            let par = {
                dateDate: this.$dateFormat('yy-MM-dd', new Date())
            }

            //
            _that.$post(_that.$host + "/api/cust/dateBill/dateBillKanban", par)
                .then(d => {
                    if (d.success) {
                        let val = d.data;
                        _that.minTime = val.shift.startTime || "09:00"

                        if (val.shift.endTime !== null) {
                            let date = val.shift.endTime.split(":");
                            let con = Number(date[0]);
                            let num = Number(date[1]) + 15
                            if (num > 60) {
                                num = num - 60;
                                con + 1;
                                if (con > 23) {
                                    con = "00"
                                }
                            }
                            _that.maxTime = con + ":" + num
                        } else {
                            _that.maxTime = "22:00"
                        }
                        let arr = ["#F8B651", "#57DBE0", "#F58068", "#88D389"]

                        val.events.map(el => {

                            let num = parseInt(Math.random() * 4, 10)
                            el.color = arr[num]
                        });
                        _that.events = val.events;
                        _that.resources = val.resources;
                        getCal(_that)
                    }
                });
        }
    },
    mounted() {
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
        });

    },
    activated() {
        //查询会员预约列表
        this.gotoPage(this.pageNumber);
        this.getGrade();
        this.getStore();

    },
}

//  .看板


function formatTen(num) {

    return num > 9 ? num + "" : "0" + num;
}

function dateFormat(format, timestamp) {
    var date = null;
    if (!timestamp) {
        return;
    }
    if (!isNaN(timestamp)) {
        date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        return;
    }
    let Y = date.getFullYear(),
        M = formatTen((date.getMonth() + 1)),
        D = formatTen(date.getDate()),
        h = formatTen(date.getHours()),
        m = formatTen(date.getMinutes()),
        s = formatTen(date.getSeconds()),
        S = date.getMilliseconds()
    if (format == 'yy-MM-dd') {
        return Y + '-' + M + '-' + D
    }
    //   return Y + M + D + h + m + s;
}
let storageDate = dateFormat('yy-MM-dd', new Date());
function getCal(_that) {
    // console.log(this.resources)
    let cal = $('#calendar').fullCalendar({
        defaultView: 'agendaDay',
        header: {
            left: 'title',            //居中：时间范围
            center: ' prev,next today',       //上一页、下一页、今天  
            right: ''    //右边：显示哪些视图  
        },
        title: 'yyyy-MM-dd',
        // Moment:ISO8601,
        // lang: 'zh-cn',
        allDaySlot: false,
        allDayText: '全天',
        // aspectRatio : 0.85,
        slotDuration: "00:15:00",
        minTime: _that.minTime,           //周/日视图左边时间线显示的最小日期，默认00:00:00  
        maxTime: _that.maxTime,
        monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        monthNamesShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        today: ["今天"],
        titleFormat: `YYYY-MM-DD`,
        month: 'MMMM yyyy',                             // September 2009
        week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",  // Sep 7 - 13 2009
        day: 'dddd, MMM d, yyyy',
        firstDay: 1,
        timeFormat: 'HH:mm',
        eventLimit: true,
        // axisFormat: "24:00:00",
        slotLabelFormat: "HH:mm",
        buttonText: {
            today: '当天',
            month: '月',
            week: '周',
            day: '日',
            prev: '上一天',
            next: '下一天'
        },
        selectable: true,
        handleWindowResize: true,
        refetchResourcesOnNavigate: true,
        events: (start, end, timezone, callback) => {
            let date = _that.$dateFormat('yy-MM-dd', start);
            if (storageDate == date && _that.events) {
                callback(_that.events);
            } else {
                let par = {
                    dateDate: _that.$dateFormat('yy-MM-dd', start)
                }
                storageDate = par.dateDate;
                _that.$post(_that.$host + "/api/cust/dateBill/dateBillKanban", par)
                    .then(d => {
                        if (d.success) {
                            let arr = ["#F8B651", "#57DBE0", "#F58068", "#88D389"]
                            let val = d.data;
                            val.events.map(el => {
                                let num = parseInt(Math.random() * 4, 10)
                                el.color = arr[num]
                            });
                            _that.events = val.events;
                            _that.resources = val.resources;
                            callback(_that.events);

                        }
                    });
            }
        },
        resources: _that.resources,
        // function (callback, start, end, timezone) {
        //     let date = _that.$dateFormat('yy-MM-dd', start);
        //     if (_that.$dateFormat('yy-MM-dd', new Date()) == date && _that.events) {

        //         callback(_that.resources);
        //     } else {
        //         let par = {
        //             dateDate: _that.$dateFormat('yy-MM-dd', start)
        //         }
        //         storageDate = par.dateDate;
        //         _that.$post(_that.$host + "/api/cust/dateBill/dateBillKanban", par)
        //             .then(d => {
        //                 if (d.success) {
        //                     let val = d.data;
        //                     _that.resources = val.resources;
        //                     callback(_that.resources);
        //                 }
        //             });

        //     }
        //     callback(_that.resources);

        // },
        eventColor: '#579EC8',
        columnFormat: 'yyyy-MM-dd',
        columnHeaderFormat: 'dddd',
        select: function (start, end, jsEvent, view, resource) {
            // console.log("↓↓↓select↓↓↓");
            // console.log(jsEvent, resource)
            // console.log("start:" + start + "|end:" + end + "|jsEvent:" + jsEvent + "|view:" + view.title);
            // var title = prompt('Event Title:');
            var eventData;
            console.log(start, end, jsEvent, view, resource)
            // if (title) {
            //     eventData = {
            //         title: title,
            //         start: start,
            //         end: end
            //     };
            //     $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true  
            // }
            // $('#calendar').fullCalendar('unselect');
        }


    });
}
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.search_wrap li > span {
    display: inline-block;
    width: 64px;
    text-align: right;
}
.cancle_app .model_content {
    width: 400px;
}
.cancle_main textarea {
    width: 100%;
}
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
.tklist {
    display: inline-block;
    margin-right: 12px;
    margin-bottom: 12px;
    height: 30px;
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
    background-color: #eee;
}
.tklist li.active {
    border: 1px solid #2cbcc8;
    background: #2cbcc8;
    color: #fff;
}
.icongou::before {
    content: "\E650";
    position: absolute;
    font-size: 36px;
    right: -10px;
    bottom: -9px;
}
</style>
<style>
.appointment .el-select {
    width: 160px;
}
.appointment .el-range-editor.el-input__inner {
    padding: 0 15px;
    padding-right: 4px;
}
.appointment .el-date-editor .el-range-separator {
    padding: 0 15px;
}
.appointment .el-input__inner {
    line-height: 0;
}
.appointment .el-date-editor .el-range__close-icon {
    width: 20px;
}
.appointment .el-table tbody td:last-child .cell {
    text-align: left;
}
.fc-license-message {
    display: none;
}
.fc-toolbar .fc-left {
    position: absolute;
    bottom: 4px;
    margin-bottom: -12px;
}
.fc-toolbar.fc-header-toolbar {
    position: relative;
}
</style>


