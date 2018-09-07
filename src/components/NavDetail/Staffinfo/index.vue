<template>
    <div class="Info">
        <div class="searchInfo">
            <span class="searchText">工号：</span>
            <Input :value="workNo" widths="13.333333rem" arguName="workNo" @sonInput="sonSelect" />
        </div>
        <div class="searchInfo">
            <span class="searchText">姓名：</span>
            <Input :value="empName" widths="13.333333rem" arguName="empName" @sonInput="sonSelect" />
        </div>
        <div class="searchInfo">
            <span class="searchText">职位：</span>
            <Select :SelecttemData="PostionArr" arguName="position" :values="position" :SelecttemDetail="['id','pstName']" @sonSelect="sonSelect" widths="13.333333rem" />
        </div>
        <div class="searchInfo" v-if="corpShow">
            <span class="searchText">所属部门：</span>
            <getCorpStore @getCorpStore="getCorpStore" :values="deptArr" />
        </div>
        <div class="searchInfo " v-if="sCodeShow">
            <span class="searchText">所属门店：</span>
            <Select :SelecttemData="storeDatas" :values="belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonSelect" widths="160px" />
        </div>
        <div class="searchInfo ">
            <span class="searchText">状态：</span>
            <Select :SelecttemData="allstatus" :values="status" arguName="status" :SelecttemDetail="['eStuCode','eStuValue']" @sonSelect="sonSelect" widths="160px" />
        </div>
        <div class="searchBtn">
            <Button Name="查询" :Search="true" @click.native="gotoPage(1)" />
            <Button Name="重置" :Reset="true" @click.native="Reset" />
        </div>
        <div class="">
            <Button class="InfoBtn" Name="新增" @click.native="addStaff" v-show="addShow" :iconadd="true" />
            <!-- <ToImport class="InfoBtn" configKey='impEmp'></ToImport> -->
            <Button class="InfoBtn" :Upload="true" Name="导出已选择" @click.native="downSelected" v-if="exportShow"></Button>
            <Button class="InfoBtn" :Upload="true" Name="导出全部" @click.native="gotoPage(1,total)" v-if="exportShow"></Button>
        </div>
        <template>
            <el-table :data="content" style="width:100%" border ref="table" @selection-change="selectDatasFun" :row-key='rowKey' @row-click="rowClick">
                <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                <el-table-column label="工号" prop="workNo" width="150"></el-table-column>
                <el-table-column label="姓名" prop="empName" width="150"></el-table-column>
                <el-table-column label="职位" prop="position" width="250"></el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        <span> {{(scope.row.status==1&&'待入职')||(scope.row.status==2&&'试用')||(scope.row.status==3&&'在职')||(scope.row.status==4&&'离职')||(scope.row.status==5&&'长假')}} </span>
                    </template>
                </el-table-column>
                <el-table-column label="所属门店" prop="belongShop" width="300"> </el-table-column>
                <el-table-column label="操作" width="150" fixed="right" v-if="!(!editShow&&!deleteShow)">
                    <template slot-scope="scope">
                        <Button Name="修改" class="Btn" @click.native.stop="Modify(scope.$index,scope.row)" v-if="editShow"/>
                        <i class="borderLeft" v-if="editShow"></i>
                        <Button Name="删除" :class="{Btndisabled:scope.row.workNo==WorkNum}" class="Btn" @click.native.stop="Delete(scope.$index,scope.row)" v-if="deleteShow"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="gotoPage" :total="total" class="pagingwidth" />
    </div>
</template>
<script>
import Input from "../../common/Input";
import Button from "../../common/Button";
import Select from "../../common/Select";
import Table from "../../common/Table";
import Paging from "../../common/Paging";
import DatePiker from "../../common/DatePiker"
import ToImport from "@/components/common/toImport";
import { mapState, mapMutations } from 'vuex'
export default {
    components: { Input, Button, Select, Table, Paging, getCorpStore: resolve => { require(['../../common/getCorpStore'], resolve) }, DatePiker, ToImport },
    data() {
        return {
            WorkNum:this.$getCookie('workNo') == 'null'?'':this.$getCookie('workNo'),
            addShow: false,//新增权限
            editShow: false,//修改权限
            deleteShow: false,//删除权限
            exportShow: false,//导出权限
            corpShow: false,//部门权限
            sCodeShow: false,//门店权限
            workNo: "", //工号
            empName: "", //员工姓名
            position: "", //职位
            ThCheckAll: false,
            Radio: true, //表示单选用户
            PostionArr: [], // 查询职位
            storeDatas: [],   //门店数组
            allstatus: [], //员工状态数组
            status: '3',
            deptArr: this.$getCookie('belongShop') == 'null' ? [this.$getCookie('dept')] : [],
            dept: "", //部门code            
            belongShop: this.$getCookie('belongShop'), //所属门店
            Theads: [
                { detail: "工号", width: "12rem" },
                { detail: "姓名", width: "12rem" },
                { detail: "职位", width: "12rem" },
                { detail: "所属门店", width: "20rem" },
                { detail: "", width: "16rem" }
            ],
            Tbodys: ["workNo", "empName", "position", "belongShop"],
            content: [], //员工分页内容数组
            pageNumber: "", //当前页
            pageSize: 20, //每页数据条数
            total: 0, //总条数

            //当前选择数据
            selectDatas: [],
        };
    },
    computed: {
        ...mapState(['Postionvuex', 'storesvuex', 'allstatusvuex', 'employee', 'employeetotal'])
    },
    mounted() {
        this.gotoPage(1)
        // 查询职位
        this.getPostion();
        //查询门店
        this.getStore();
        //员工状态
        this.getAllstatus()
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F014") {//员工信息的权限
                if (el.fUrl == "add") {
                    this.addShow = true;
                }
                if (el.fUrl == "edit") {
                    this.editShow = true;
                }
                if (el.fUrl == "delete") {
                    this.deleteShow = true;
                }
                if (el.fUrl == "export") {
                    this.exportShow = true;
                }
                if (el.fUrl == "corp") {
                    this.corpShow = true;
                }
                if (el.fUrl == "sCode") {
                    this.sCodeShow = true;
                }
            }
        })
        if (!this.editShow && !this.deleteShow) {
            this.Theads.splice(this.Theads.length - 1, 1)
        }
    },
    methods: {
        //rowKey
        rowKey(row) {
            return row.id;
        },
        ...mapMutations(['setDatas']),
        //职位
        getPostion() {
            if (!this.Postionvuex) {
                this.$post(this.$host + "/api/store/emppost/idNameQueryAll", {}).then(d => {
                    if (d.success) {
                        this.PostionArr = d.list;
                        this.setDatas({ name: "Postionvuex", value: this.PostionArr })
                    }
                });
            } else {
                this.PostionArr = this.Postionvuex
            }
        },
        //员工状态
        getAllstatus() {
            if (!this.allstatusvuex) {
                this.$post(this.$host + "/api/store/employee/allstatus", {}).then(d => {
                    if (d.success) {
                        this.allstatus = d.data;
                        this.setDatas({ name: 'allstatusvuex', value: this.allstatus })
                    }
                });
            } else {
                this.allstatus = this.allstatusvuex
            }
        },
        //导出
        downSelected() {
            if (this.selectDatas.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择期望导出的员工!',
                    onClose: () => {
                    }
                });
            } else {
                let arr1 = ["工号", "姓名", "职位", "所属门店"];
                this.$exportExcel(arr1, this.Tbodys, this.selectDatas, '员工列表');
                this.$refs.eTable.clearSelection()
            }
        },
        //根据部门 查门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.dept || this.$getCookie("dept") || "",
                queryType:0,
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
        getCorpStore(value) {          
            if (this.dept != value[value.length - 1]) {
                this.dept = value[value.length - 1];
                this.belongShop = "";
                this.getStore();
            }
        },
        sonSelect(value, arguName) {
            this[arguName] = value;
        },
        Reset() {
            if (!this.workNo && !this.empName && !this.position && !this.belongShop && !this.dept && !this.status) return
            this.workNo = this.empName = this.position = this.dept = "";this.deptArr =[]; this.belongShop = this.$getCookie('belongShop') || ''; this.status = '3'
            this.getStore()
        },
        gotoPage(index, total) {
            let _data = {
                dept: this.dept||this.$getCookie('dept'),
                workNo: this.workNo,
                empName: this.empName,
                position: this.position,
                belongShop: this.belongShop,
                status: this.status,
                pageNumber: parseInt(index),
                pageSize: total || this.pageSize,
            };
            this.$post(this.$host + "/api/store/employee/query/page", _data).then(d => {
                if (d.success) {
                    if (total) {//导出全部
                        if (d.pageData.content.length === 0) {
                            this.$message({
                                type: 'warning',
                                message: '无数据!',
                                duration: "3000",
                                onClose: () => {
                                }
                            });
                        } else {
                            let arr1 = ["工号", "姓名", "职位", "所属门店"];
                            this.$exportExcel(arr1, this.Tbodys, d.pageData.content, '员工列表')
                        }
                    } else {
                        this.content = d.pageData.content;
                        this.total = d.pageData.total;
                        this.pageNumber = d.pageData.pageNumber;
                    }

                }
            });
        },
        selectDatasFun(rows) {
            this.selectDatas = rows;
        },
        rowClick(row) {
            this.$refs.table.toggleRowSelection(row)
        },


        addStaff() {
            this.$router.push({ path: "/NavDetail/Addstaff" })
        },
        Modify(index, item) {
            this.$router.push({                path: "/NavDetail/Modifysta",
                query: { id: item.id }
            })
        },
        Delete(index,item){
            if(item.workNo==this.WorkNum){
                this.$alert('该账号为当前登录账号，无法删除！', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                })
                return
            }
            this.$messagebox.confirm('此操作将永久删除该员工, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _data = {
                    id: item.id,
                    accessToken: this.accessToken
                };
                this.$post(this.$host + "/api/store/employee/delete", _data).then(d => {
                    if (d.success) {
                        this.content.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            duration: "1000",
                        });
                        this.setDatas({ name: "isShopemployee", value: [] })
                        this.setDatas({ name: "isShopemployeetotal", value: "" })
                        this.setDatas({ name: "employee", value: [] })
                        this.setDatas({ name: "employeetotal", value: "" })
                    }
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: "1500",
                });
            });
        }
    }
};
</script>

<style >
.Info .searchInfo {
    display: inline-block;
    font-size: 1rem;
    color: #666666;
    margin: 0 2rem 1rem 0;
}
.Info .searchBtn {
    display: inline-block;
    margin-bottom: 1rem;
}
.Info .searchBtn button:first-child {
    margin-right: 1rem;
}
.Info .InfoBtn {
    margin: 0 2rem 1rem 0 !important;
}
</style>
