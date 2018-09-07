<template>
    <div v-show="show">
        <div class="AboutPeople">
            <header class="Headers clearfix">
                <div class="left">选择员工</div>
                <div class="right">
                    <i class="icon Fork" @click="canclefun"></i>
                </div>
            </header>
            <div class="Header clearfix" v-show="demandShow">
                <p class="Third">
                    <span>
                        工号：
                    </span>
                    <Input placeholder="请输入工号" arguName="workNo" widths="110px" :value="workNo" @sonInput="upInput" />
                </p>
                <p class="Third">
                    <span>
                        员工姓名：
                    </span>
                    <Input placeholder="请输入姓名" arguName="empName" :value="empName" @sonInput="upInput" widths="110px" />
                </p>
                <p class="Third">
                    <span>
                        岗位/职位：
                    </span>
                    <Position @sonPostPosition="upPostPosition" :style="{width:'110px'}" :isShopStat="isShopStat" />
                </p>
                <p class="Third" v-if="corpShow">
                    <span>
                        所属部门：
                    </span>
                    <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr" :widths="'110px'" />
                </p>
                <p class="Third" v-if="sCodeShow">
                    <span>
                        门店：
                    </span>
                    <Select :SelecttemData="storeDatas" :values="belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" :widths="'110px'" />
                </p>
                <p class="Third chaxunBTN">
                    <Button Name="查询" @click.native="getDatas" />
                    <Button Name="重置" @click.native="resetDemand" />
                </p>
            </div>
            <Table class="Table" :datas="datas" :Tbody="Tbody" :TabelHeader="TabelHeader" :NoDO="NoDO" :queryRole="Selected" :widthValue="'660px'" :Lines="10" />
            <Paging :handleCurrentChange="getDatas" :total="total" v-show="total>6" class="PagingPeople" :pageSize="10" />
            <p v-if="!RadioPeople" class="clearfix selectedcla">
                <span v-for="(item,index) in SelectedData" class="empNames" @click="deleteemps(item,index)">{{item.empName}}
                    <i class="icon iconF"></i>
                </span>
            </p>
            <div class="Footer">
                <Button v-if="!RadioPeople" Name="取消" @click.native="canclefun" buttonClass="None" />
                <Button v-if="!RadioPeople" Name="确定" @click.native="submit(SelectedData)" />
            </div>
            <div class="MTK" v-show="showMtk" @click="HideAll"></div>
        </div>
        <MTK show="showMtk" @click.native="HideAll" />
    </div>

</template>
<script>
import Table from "../Table";
import Paging from "../Paging";
import Button from "../Button";
import MTK from "../Mtk";
import Input from "../Input";
import Select from "../Select";
import getCorpStore from "../../common/getCorpStore";
import AboutBranch from "../../common/AboutBranch";
import Position from "../../common/Position";
import { mapMutations, mapState } from "vuex"
export default {
    components: {
        Table, Paging, Button, MTK, Input, AboutBranch, Select, Position, getCorpStore
    },
    data() {
        return {
            corpCodeArr: [],
            storeDatas: [],
            showMtk: false,
            StoreShow: false,
            ShopShow: false,
            show: true,
            datas: [],
            total: 1,
            TabelHeader: [
                { detail: "员工名称", width: "200px" },
                { detail: "工号", width: "130px" },
                { detail: "职位", width: "130px" },
                { detail: "所属门店", width: "200px" },
            ],
            Tbody: ["empName", "workNo", "position", "belongShop"],
            datasStore: [],
            TabelHeaderStore: [
                { detail: "门店名称", width: "125px" },
                { detail: "门店编号", width: "125px" },
            ],
            TbodyStore: ["sCode", "sShortName"],
            NoDO: true,
            workNo: "",
            empName: "",
            position: "",
            jobs: "",
            belongShop: this.$getCookie("belongShop"),
            dept: "",//部门
            OrgName: "",
            appBoole: false,
        }
    },
    computed: {
        ...mapState(["storesvuex", "employee", "employeetotal", "isShopemployee", "isShopemployeetotal"]),
    },
    methods: {
        ...mapMutations(["setDatas"]),
        getCorpStore(value) {
            if (value[value.length - 1]) {
                if (this.dept != value[value.length - 1]) {
                    this.dept = value[value.length - 1];
                    this.belongShop = "";
                    this.getStore();
                }
            } else {
                this.dept = "";
                this.belongShop = "";
                this.getStore();
            }
        },
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 500,
                corpCode: this.dept || this.$getCookie("dept") || "",
                queryType: 0
            }
            if (!this.dept) {//默认门店（当前部门下的门店）
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
        upPostPosition(e) {
            this.position = e[1] || "";
            this.jobs = e[0] || "";
        },
        deleteemps(item, index) {
            this.SelectedData.splice(index, 1);
            this.datas.map(el => {
                if (el.id == item.id) {
                    el.active = false;
                }
            })
        },
        resetDemand() {
            this.dept = "";
            this.empName = "";
            this.workNo = "";
            this.position = "";
            this.belongShop = this.$getCookie("belongShop");
            this.OrgName = "";
            this.corpCodeArr = [];
        },
        HideAll() {
            this.ShopShow = false;
            this.StoreShow = false;
            this.showMtk = false;
        },
        upSelect(value, arguName) {
            this[arguName] = value;
        },
        showStore() {
            this.StoreShow = !this.StoreShow;
            this.ShopShow = false;
            this.showMtk = true;
        },
        // 选中员工
        Selected(index, item) {
            if (this.RadioPeople) {
                if (this.Index >= 0) {
                    this.AboutPeopleSelected(item, this.Index)
                } else {
                    this.AboutPeopleSelected(item)
                }
            } else {
                let that = this;
                this.datas.map((v, i) => {
                    v.active = false;
                    if (i == index) {
                        v.active = true;
                        let objUser = new Object();
                        objUser.empName = v.empName;
                        objUser.id = v.id;
                        //uCode相同的不添加
                        let canPush = true;
                        this.SelectedData.map(el => {
                            if (el.id == v.id) { canPush = false; }
                        });
                        canPush && this.SelectedData.push(v);
                    }
                })
            }

        },

        upInput(value, arguName) {
            this[arguName] = value;

        },
        // 查询方法
        getDatas(index) {
            let data = {
                pageNumber: parseInt(index),
                pageSize: 10,
                jobs: this.jobs,//岗位
                workNo: this.workNo,//工号
                empName: this.empName,//员工姓名
                position: this.position,//职位
                belongShop: this.belongShop,//所属门店
                dept: this.dept || this.$getCookie("dept"),//所属机构
                isShopStat: parseInt(this.isShopStat),
            }
            if (this.appBoole) {
                data.dateDate = this.date.dateDate;
                data.cCode = this.date.cCode;
                delete data.isShopStat;
            }
            if (this.prodIds.length > 0) {
                data.prodIds = this.prodIds
            }
            this.$post(this.$host + this.api, data).then(d => {
                if (d.success) {
                    let content = '';
                    if (this.appBoole) {
                        content = d.data.content.map(e => {
                            if (e.leaveInfo != 'null' && e.leaveInfo != null && e.leaveInfo != '') {
                                e.empName = e.empName + '(' + e.leaveInfo + ')'
                                alert(1)

                            } else if (e.dateBillInfo != 'null' && e.dateBillInfo != null && e.dateBillInfo != '') {
                                e.empName = e.empName + '(' + e.dateBillInfo + ')'
                                alert(2)
                            } else {
                                e.empName = e.empName
                            }

                            e.active = false;
                            return e;
                        })
                        this.total = parseInt(d.data.total);
                    } else {
                        content = d.pageData.content.map(e => {
                            e.active = false;
                            return e;
                        })
                        this.total = d.pageData.total;

                    }

                    this.datas = content;

                }
            })
        }
    },
    props: {
        demandShow: {
            default: true
        },
        corpShow: {
            default: false
        },
        sCodeShow: {
            default: false
        },
        Radio: {
            default: true
        },
        isShopStat: {
            default: ""
        },
        SelectedData: {//选中的人
            type: Array,
            default: () => {
                return []
            }
        },
        RadioPeople: {
            default: true
        },
        AboutPeopleSelected: {
            type: Function,
            default: () => { }
        },
        submit: {
            type: Function,
            default: () => { }
        },
        Index: {
            default: ""
        },
        canclefun: {
            type: Function,
            default: () => { }
        },
        api: {
            default: "/api/store/employee/query/page"
        },
        date: {
            default: Object,
        },
        prodIds: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    mounted() {
        this.getStore();
        if (this.isShopStat) {//做服务的员工
            let data = {
                pageNumber: 1,
                pageSize: 10,
                belongShop: this.$getCookie("belongShop"),
                dept: this.$getCookie("dept"),
                isShopStat: this.isShopStat,
            }
            if (this.prodIds.length > 0) {
                data.prodIds = this.prodIds
            }
            this.$post(this.$host + this.api, data).then(d => {
                if (d.success) {
                    let content = '';
                    content = d.pageData.content.map(e => {
                        e.active = false;
                        return e;
                    })
                    this.total = d.pageData.total;
                    this.datas = content;
                    this.setDatas({ name: "isShopemployee", value: content })
                    this.setDatas({ name: "isShopemployeetotal", value: this.total })
                }
            });
            return;
        }
        if (this.api != "/api/store/employee/query/page") {
            this.appBoole = true;
        }

        if (this.employee.length === 0) {
            let data = {
                pageNumber: 1,
                pageSize: 10,
                belongShop: this.$getCookie("belongShop"),
                dept: this.$getCookie("dept"),
                isShopStat: this.isShopStat,
            }
            if (this.appBoole) {
                data.dateDate = this.date.dateDate;
                data.cCode = this.date.cCode;
                delete data.isShopStat;
                data.dept = ''
            }
            if (this.prodIds.length > 0) {
                data.prodIds = this.prodIds
            }
            // 员工查询接口
            this.$post(this.$host + this.api, data).then(d => {
                if (d.success) {
                    let content = '';
                    if (this.appBoole) {
                        content = d.data.content.map(e => {
                            // if (e.leaveInfo != 'null' && e.leaveInfo != null) {
                            //     e.empName = e.empName + '(' + e.leaveInfo + ')'

                            // } else if (e.dateBillInfo != 'null' && e.dateBillInfo != null) {
                            //     e.empName = e.empName + '(' + e.dateBillInfo + ')'
                            // } else {
                            //     e.empName = e.empName
                            // }
                            if (e.dateBillInfo || e.leaveInfo) {
                                if (e.dateBillInfo) {
                                    e.empName = e.empName + '(' + e.leaveInfo + e.dateBillInfo + ')'
                                } else {
                                    e.empName = e.empName + '(' + e.leaveInfo + ')'
                                }

                            }


                            e.active = false;
                            return e;
                        })
                        this.total = parseInt(d.data.total);
                    } else {
                        content = d.pageData.content.map(e => {
                            e.active = false;
                            return e;
                        })
                        this.total = d.pageData.total;
                        this.setDatas({ name: "employee", value: content })
                        this.setDatas({ name: "employeetotal", value: this.total })
                    }

                    this.datas = content;

                }
            });
        } else {
            this.datas = this.employee;
            this.total = this.employeetotal;
        }
        // }
    }
}
</script>
<style scoped>
.curor {
    cursor: pointer;
}
.selectedcla {
    margin: 1rem 0;
}
.PagingPeople {
    margin: 0.833333rem 0;
    text-align: right;
}
.Footer {
    text-align: center;
}
.Footer button:last-child {
    margin-left: 24px;
}
.empNames {
    /* float: left;
        border: 1px solid #cccccc;
        padding: 2px 5px;
        cursor: pointer;
        margin-right: 1rem; */
    display: inline-block;
    padding: 0 0.5rem;
    height: 2rem;
    line-height: 2rem;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    margin: 0 12px 12px 0;
    color: #999999;
    background: #f4f4f4;
    cursor: pointer;
}
.iconF::before {
    content: "\E61A";
}
.empNames:hover {
    border: 1px solid #1dade2;
    color: #1dade2;
}
.Headers {
    font-size: 1.166667rem;
    padding-bottom: 10px;
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
    color: #5d7c7c;
}
.iconclose::before {
    content: "\E61a";
    color: #999999;
    cursor: pointer;
    font-size: 14px;
}
.MTK {
    position: absolute;
    z-index: 1001;
    background: transparent;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}
.AboutPeople {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    padding: 1.666667rem;
    background: #fff;
    border-radius: 4px;
    color: #666666;
    width: 60rem;
}
.AboutPeople .Table {
    width: 100% !important;
}
.AboutPeople p.Third.chaxunBTN {
    /* position: absolute;
    right: 2.916667rem;
    top: 0; */
    padding-right: 53px;
    text-align: right;
    float: right;
}
.AboutPeople p.Third.chaxunBTN button:last-child {
    margin-left: 12px;
}
.AboutPeople p.Third {
    position: relative;
    left: 0;
    top: 0;
    float: left;
    width: 33%;
    padding: 0 2.916667rem 0.833333rem 0;
}
.AboutPeople p.Third span {
    width: 65px;
    display: inline-block;
    text-align: right;
}
.AboutPeople .StoreSelect {
    position: absolute;
    right: 56px;
    top: 10px;
    width: 8px;
    height: 8px;
    border-right: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    transform: rotate(45deg);
}
.Storetem {
    position: absolute;
    left: 64px;
    top: 36px;
    z-index: 1001;
    background: #fff;
}
.Shoptem {
    position: absolute;
    left: 297px;
    top: 96px;
    z-index: 1001;
}
.AboutPeople .ShopSelect {
    position: absolute;
    right: 56px;
    top: 10px;
    width: 8px;
    height: 8px;
    border-right: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    transform: rotate(45deg);
}
</style>