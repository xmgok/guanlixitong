<template>
    <div class="right_content_wrap customer">
        <div class="search_wrap">
            <ul>
                <li>
                    <span>
                        部门：
                    </span>
                    <getCorpStore @getCorpStore="getCorpStore" />
                </li>
                <li>
                    <span>
                        门店：
                    </span>
                    <Select :SelecttemData="storeDatas" @sonSelectobj='storeChange' :values="search.sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" />
                </li>
                <li>
                    <span>
                        服务员工：
                    </span>
                    <Select :SelecttemData="staffDatas" :values="search.workNo" arguName="workNo" :SelecttemDetail="['workNo','empName']" @sonSelect="upInput" />
                </li>
                <li>
                    <span>
                        会员：
                    </span>
                    <input class="x_input" type="text" v-model='search.customerInfo' placeholder="会员编号/名称/手机号" />
                </li>
                <li>
                    <span>
                        是否会员：
                    </span>
                    <el-select placeholder="请选择 " v-model='search.isVip' clearable>
                        <el-option v-for="item in isVipStatus" :label="item.name" :value="item.code" :key="item.code">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        日期：
                    </span>
                    <el-date-picker clearable size='mini' v-model="date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </li>
                <!-- <li>
                    <span>
                        服务员工：
                    </span>
                    <el-select placeholder="请选择 " v-model='search.cSaleMgr' clearable>
                        <el-option v-for="item in manager" :label="item.empName" :value="item.code" :key="item.code">
                        </el-option>
                    </el-select>
                </li> -->
                <li>
                    <span>
                        在店状态：
                    </span>
                    <el-select placeholder="请选择 " v-model='search.status' clearable>
                        <el-option v-for="item in atShopStatus" :label="item.name" :value="item.code" :key="item.code">
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
                <Button :iconadd="true" Name="新增" @click.native="addArriveBtn"></Button>
            </div>
            <div class="table_content">
                <el-table :data="datas" ref='eTable' border>
                    <el-table-column fixed='left' prop="cName" label="会员(编号)" width="200">
                        <template slot-scope="scope">
                            {{scope.row.cName+'('+scope.row.cCode+")"}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="levName" label="会员等级" width="100">
                    </el-table-column>
                    <el-table-column prop="sName" label="门店" width="160">
                    </el-table-column>
                    <el-table-column prop="createTime" label="到店时间" width="180">
                    </el-table-column>
                    <el-table-column prop="status" label="在店状态" width="180">
                    </el-table-column>
                    <el-table-column prop="empName" label="服务员工" width="100">
                    </el-table-column>
                    <el-table-column prop="technician" label="跟进技师" width="130">
                    </el-table-column>
                    <el-table-column prop="salemgr" label="跟进顾问" width="130">
                    </el-table-column>
                    <el-table-column width="200" label='操作' fixed='right'>
                        <template slot-scope="scope">
                            <Button v-if='scope.row.kai' small="Btn small" Name="开单" @click.native.stop="billing(scope.row)"></Button>
                            <i v-if='scope.row.kai' class="cut_off_rule"></i>
                            <Button small="Btn small" Name="删除" @click.native.stop="remove(scope.row)"></Button>
                        </template>
                    </el-table-column>
                    <el-table-column fixed='right' min-width='1'>
                    </el-table-column>
                </el-table>
                <div class="pagingwidth">
                    <Paging :handleCurrentChange="getData" :total="total" />
                </div>
            </div>
        </div>

        <!--  -->
        <transition name="el-fade-in-linear">
            <div class='x_model sel_arrive_model' v-if="selCustomerShow">
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">选择到店客户</div>
                        <div class="right curor icon Fork" @click="closeModel"></div>
                    </header>
                    <div class="x_model_main">
                        <div class="search_wrap">
                            <ul>
                                <li>
                                    <span>
                                        会员：
                                    </span>
                                    <input v-model='modelSearch.customerInfo' type="text" class="x_input" placeholder="会员编号/姓名/手机" />
                                </li>
                                <li>
                                    <span>
                                        <Button Name="查询" @click.native="getModelDatas(1,'_search')" Search="true"></Button>
                                    </span>
                                </li>
                                <li class="rt">
                                    <span>
                                        <Button :iconadd="true" Name="新增新客户" @click.native="addNewCustomer"></Button>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <el-table :data="modelDatas" ref='eTable' border @row-dblclick='handleRowHandle' @current-change="setCurrentRow" highlight-current-row>
                                <el-table-column fixed='left' prop="cName" label="会员(编号)" width="200">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.cCode!=undefined">
                                            {{scope.row.cName+'('+scope.row.cCode+")"}}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="cPhone" label="手机号" width="120">
                                </el-table-column>
                                <el-table-column prop="levName" label="会员等级" width="160">
                                </el-table-column>
                                <el-table-column prop="sName" label="当前所属门店">
                                </el-table-column>
                                <el-table-column prop="status" label="是否已预约" width="100">
                                </el-table-column>
                            </el-table>
                            <div class="pagingwidth">
                                <Paging :handleCurrentChange="getModelDatas" :total="modelTotal" :pageSize='10' />
                            </div>
                        </div>
                    </div>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeModel" buttonClass="None" />
                        <Button Name="确定" @click.native="sureSelCustomer" />
                    </div>
                </div>
            </div>
        </transition>

        <!-- 赠送积分 -->

    </div>
</template>
<script>
import Button from "@/components/common/Button";
import Paging from "@/components/common/Paging";
import Select from "@/components/common/Select";
import Vue from "vue";

export default {
    components: { Button, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) }, Paging, Select },


    methods: {
        //开单
        billing(val) {
            this.$router.push({
                path: "/NavDetail/addOrder",
                query: {
                    resUrl: "/NavDetail/arriveStore",
                    item: JSON.stringify(val),
                }
            });
        },
        //添加会员
        addNewCustomer() {
            this.$router.push({
                path: "/NavDetail/addCustomer",
                query: {
                    resurl: "/NavDetail/arriveStore",
                }
            })
        },

        //到店新增按钮
        addArriveBtn() {
            this.selCustomerShow = true;
            this.getModelDatas(1)
        },
        closeModel() {
            this.selCustomerShow = false;
        },
        //重置
        reset() {
            this.search = {
                "customerInfo": "",
                "cStore": "",
                "status": "",
                "sCorp": "",
                "isVip": "",
                "beginTime": "",
                "endTime": "",
                "workNo": "",
            };
            this.getData(1)
        },
        //部门
        getCorpStore(value) {
            if (this.search.sCorp != value) {
                this.search.sCorp = value[value.length - 1];
                this.search.cStore = ''
                this.staffDatas = []
                this.getStore();
            }
        },
        //获取数据
        upInput(value, arguName) {
            this.search[arguName] = value;
        },
        //根据部门 查门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.search.sCorp || this.$getCookie("dept") || "",
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
        //门店发生变化
        storeChange(val, el, it) {
            this.search.cStore = el;
            this.getStaff()
        },
        //获取门店员工
        getStaff() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                belongShop: this.belongShop || this.search.cStore,
            }
            this.$post(this.$host + "/api/store/employee/query/page", data).then(d => {
                if (d.success) {

                    this.staffDatas = d.pageData.content;
                }
            });
        },
        //查询预约到店
        getData(index) {
            this.nowPage = parseInt(index)
            let par = {
                cStore: this.$getCookie("belongShop"),
                pageNumber: this.nowPage,
                pageSize: 20,
            }

            for (let key in this.search) {
                if (this.search[key] !== "") {
                    par[key] = this.search[key];
                }
            }
            if (!this.cCode && !this.search.belongShop) {

            } else {
                par.sCorp = this.cCode
                par.cStore = this.search.belongShop;
            }
            if (typeof (this.date) == "object") {
                if (this.date !== null)
                    if (this.date.length > 0) {
                        par.beginTime = this.$dateFormat('yy-MM-dd', this.date[0]);
                        par.endTime = this.$dateFormat('yy-MM-dd', this.date[1]);
                    }
            }
            this.$post(this.$host + "/api/cust/custreg/findCustRegPage", par)
                .then(d => {
                    if (d.success) {
                        if (d.data != null) {
                            d.data.content.map(el => {
                                switch (el.status) {
                                    case 1: el.status = '待服务'; el.kai = true; return;
                                    case 2: el.status = '服务中'; el.kai = true; return;
                                    case 3: el.status = '已完成'; el.kai = false; return;
                                }
                            })
                            this.datas = d.data.content;
                            this.total = d.data.total;
                        }

                    }
                });
        },

        getModelDatas(index, val) {
            let par = {
                cStore: this.$getCookie("belongShop"),
                pageNumber: parseInt(index),
                pageSize: 10,
            }
            if (val != undefined) {
                delete par.cStore
            }

            for (let key in this.modelSearch) {
                if (this.modelSearch[key] !== "") {
                    par[key] = this.modelSearch[key];
                }
            }

            this.$post(this.$host + "/api/cust/custreg/pageQueryCustomer", par)
                .then(d => {
                    if (d.success) {
                        this.modelDatas = d.data.content;
                        this.modelTotal = d.data.total;
                        if (this.modelDatas.length < 10) {
                            let length = 10 - this.modelDatas.length;
                            for (let i = 0; i < length; i++) {
                                this.modelDatas.push({})
                            }
                        }
                    }
                });
        },
        setCurrentRow(row) {
            this.selCustomerData = row;
        },
        handleRowHandle(row) {
            this.selCustomerData = row;
        },
        //调用到店接口
        arriveStoreApi() {
            let par = {
                cStore: this.$getCookie('belongShop'),
                cName: this.selCustomerData.cName,
                cCode: this.selCustomerData.cCode,
                dateNo: this.selCustomerData.dateNo,
                customerStore: this.selCustomerData.sCode,
                id: this.selCustomerData.id,
            }
            this.$post(this.$host + "/api/cust/custreg/saveCCustReg", par)
                .then(d => {
                    if (d.success) {
                        this.$message({
                            type: "success",
                            message: "添加成功！"
                        });
                        this.selCustomerShow = false;
                        this.getData(1)
                    }


                });
        },
        sureSelCustomer() {
            if (this.selCustomerData.sCode != this.$getCookie('belongShop')) {
                this.$messagebox.confirm('该会员不属于当前门店，该操作将自动转到该门店下，是否继续？\n该客户当前所属门店：' + this.selCustomerData.sName + '\n自动变更后所属门店：' + this.$getCookie('shopName'), '转店提示', {
                    confirmButtonText: '确定并选中',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.arriveStoreApi()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消选择'
                    });
                });
            } else {
                this.arriveStoreApi()
            }
        },
        //删除到店
        remove(val) {
            this.$messagebox.confirm('该操作将删除该会员到店信息，是否继续操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post(this.$host + "/api/cust/custreg/deleteCustReg", { id: val.id })
                    .then(d => {
                        if (d.success) {
                            this.$message({
                                type: "success",
                                message: "删除成功！"
                            });
                            this.getData(this.nowPage)
                        }
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
    },
    data() {
        return {
            //当前页
            nowPage: '',
            selCustomerData: "",
            modelTotal: 1,
            //model数据
            modelDatas: [],
            //model选择客户
            modelSearch: {
                customerInfo: '',
            },
            //到店
            selCustomerShow: false,
            //日期快捷
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '明天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(end.getTime() + 3600 * 1000 * 24 * 2);
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 2);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '后天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            //员工data
            staffDatas: [],
            cCode: '',
            //门店data
            storeDatas: [],
            //在店状态
            atShopStatus: [
                {
                    code: '1',
                    name: '待服务'
                },
                {
                    code: '2',
                    name: '服务中'
                },
                {
                    code: '3',
                    name: '已完成'
                },
            ],
            //是否会员
            isVipStatus: [
                {
                    code: '1',
                    name: '是'
                },
                {
                    code: '0',
                    name: '否'
                },

            ],
            //服务员工
            manager: [],
            search: {
                "customerInfo": "",
                "cStore": "",
                "status": "",
                "sCorp": "",
                "isVip": "",
                "beginTime": "",
                "endTime": "",
                "workNo": "",
            },
            date: '',
            total: 0,
            datas: [],
        }
    },
    mounted() {
        this.getData(1);
        this.getStore();
        this.getStaff()
    }
}

</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.sel_arrive_model .model_content {
    width: 800px;
}
.rt {
    float: right;
}
.btn_wrap {
    margin-bottom: 12px;
}
</style>
<style>
</style>


