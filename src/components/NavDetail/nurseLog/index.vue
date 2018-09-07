<template>
    <div class="right_content_wrap nurse_log">
        <div class="search_wrap">
            <ul>
                <li>
                    <span>
                        部门：
                    </span>
                    <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr" />
                </li>
                <li>
                    <span>
                        门店：
                    </span>
                    <Select :SelecttemData="storeDatas" :values="queryData.sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" />
                </li>
                <li>
                    <span>
                        会员：
                    </span>
                    <input type="text" v-model='queryData.custNameOrCodeOrPhone' placeholder="会员编号/姓名/手机号码" />
                </li>
                <li>
                    <span>
                        申请日期：
                    </span>
                    <el-date-picker clearable size='mini' v-model="date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </li>
                <li>
                    <span>
                        <Button Name="查询" @click.native="getData" Search="true"></Button>
                        <Button Name="重置" @click.native="reset" Reset="true"></Button>
                    </span>
                </li>
            </ul>
        </div>
        <div class="right_content">
            <div>
                <el-table :data="datas" border style="width: 100%">
                    <el-table-column prop="sShortName" label="门店" width="220">
                    </el-table-column>
                    <el-table-column prop="cName" label="会员" width="120">
                    </el-table-column>
                    <el-table-column prop="servTime" width="180" sortable label="护理日期">
                    </el-table-column>
                    <el-table-column prop="careDegree" label="重要程度" sortable width="220">
                        <template slot-scope="scope">
                            <el-rate v-model="scope.row.careDegree" disabled> </el-rate>
                        </template>
                    </el-table-column>
                    <el-table-column prop="uName" width="120" label="记录人">
                    </el-table-column>
                    <el-table-column prop="logTime" sortable width="180" label="记录日期">
                    </el-table-column>
                    <el-table-column width="140" label="操作" fixed='right'>
                        <template slot-scope="scope">
                            <Button small="Btn small" Name="修改" @click.native="edit(scope.row)"></Button>
                            <Button small="Btn small" Name="查看详情" @click.native="seeDetail(scope.row)"></Button>
                        </template>
                    </el-table-column>
                    <el-table-column min-width='1' fixed='right'>
                    </el-table-column>
                </el-table>
                <div class="pagingwidth">
                    <Paging :handleCurrentChange="getData" :total="total" />
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import Button from "@/components/common/Button";
import Paging from "../../common/Paging";
import Select from "../../common/Select";
import { mapMutations, mapState } from "vuex"
export default {
    components: { Button, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) }, Paging, Select },
    data() {
        return {
            //datas
            datas: [],

            //部门
            corpCodeArr: [],

            total: 0,

            //门店data
            storeDatas: [],

            //日期
            date: [],

            //查询
            queryData: {
                sCorp: this.$getCookie('dept') || '',
                sCode: this.$getCookie('belongShop') || '',
                servTimeStart: "",
                servTimeEnd: "",
                custNameOrCodeOrPhone: "",
                servTimeSortF: "",
                logTimeSort: "",
                careDegreeSort: "",
            },

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


        }
    },
    computed: {
        ...mapState(["storesvuex",]),
    },
    methods: {
        //重置
        reset() {
            this.corpCodeArr = [];
            this.queryData = {
                sCorp: '',
                sCode: '',
                servTimeStart: "",
                servTimeEnd: "",
                custNameOrCodeOrPhone: "",
                servTimeSortF: "",
                logTimeSort: "",
                careDegreeSort: "",
            };
        },
        ...mapMutations(["setDatas"]),
        //部门
        getCorpStore(value) {
            if (this.queryData.sCorp != value[value.length - 1]) {
                this.queryData.sCorp = value[value.length - 1];
                this.queryData.sCode = "";
                this.getStore();
            }
        },

        //根据部门 查门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.queryData.sCorp || this.$getCookie("dept") || "",
                queryType: 0
            }
            if (!this.queryData.corpCode) {//默认门店（当前部门下的门店）
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

        //修改
        edit(item) {
            this.$router.push({
                path: "/NavDetail/nurseLog/addNurse",
                query: {
                    id: item.id,
                    type: '_edit'
                }

            });
        },

        //查看详情
        seeDetail(item) {
            this.$router.push({
                path: "/NavDetail/nurseLog/addNurse",
                query: {
                    id: item.id,
                    type: '_see',
                }
            });
        },

        //获取列表 /分页 查询
        getData(index) {
            let par = {
                sCode: this.$getCookie("belongShop"),
                sCorp: this.$getCookie("dept"),
                pageNumber: 1,
                pageSize: 20,
            }
            if (typeof (index) !== "undefined" && typeof (index) !== "object") {
                par.pageNumber = parseInt(index);
            }
            for (var key in this.queryData) {
                if (this.queryData[key] != "") {
                    par[key] = this.queryData[key];
                }
            }
            if (typeof (this.date) == "object") {
                if (this.date !== null)
                    if (this.date.length > 0) {
                        par.servTimeStart = this.$dateFormat('yy-MM-dd', this.date[0]);
                        par.servTimeEnd = this.$dateFormat('yy-MM-dd', this.date[1]);
                    }
            }
            this.$post(this.$host + "/api/order/servlog/page", par)
                .then(d => {
                    if (d.success) {

                        this.datas = JSON.parse(JSON.stringify(d.data.content));
                        this.datas.map(el => {
                            el.servTime = this.$dateFormat('yy-MM-dd', el.servTime);
                            el.logTime = this.$dateFormat('yy-MM-dd', el.logTime);
                        })
                        this.total = Number(d.data.total);

                    }
                });
        },

        //获取数据
        upInput(value, arguName) {
            this.queryData[arguName] = value;
        },

        //添加按钮
        addBtn() {
            this.$router.push({
                path: "/NavDetail/nurseLog/addNurse",
                query: {
                    id: "_add"
                }

            });
        }

    },
    mounted() {
        this.getData();
        this.getStore();
    }
}    
</script>

<style scoped>
@import "../../../../static/commonStyle.css";
.btn_wrap {
    margin-bottom: 12px;
}
</style>
<style>
.nurse_log .el-select {
    width: 160px;
}
.nurse_log .el-range-editor.el-input__inner {
    padding: 0 15px;
    padding-right: 4px;
}
.nurse_log .el-date-editor .el-range-separator {
    padding: 0 15px;
}
.nurse_log .el-input__inner {
    line-height: 0;
}
.nurse_log .el-date-editor .el-range__close-icon {
    width: 20px;
}
.nurse_log .defaultTheme .el-table tbody td:last-child .cell {
    text-align: left;
}
</style>
