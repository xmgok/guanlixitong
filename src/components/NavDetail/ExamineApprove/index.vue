<template>
    <div class="examine_approve right_content_wrap">
        <div class="search_wrap">
            <ul>
                <li>
                    <span>流程编号:</span>
                    <Input :value="searchFlow.flowCode" :widths='iptWidth' arguName="flowCode" @sonInput="searchFlowDatas" />
                </li>
                <li>
                    <span>流程名称:</span>
                    <Input :value="searchFlow.flowName" :widths='iptWidth' arguName="flowName" @sonInput="searchFlowDatas" />
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="getData(nowPage)"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetQueryFlow"></Button>
                </li>
            </ul>
        </div>
        <div class="right_content">
            <div class="btn_wrap">
                <Button Name='新增' buttonClass='purple' @click.native="addFlowBtn"></Button>
            </div>
            <div class="table_content">
                <el-table :data="allExamineApproves" border style="width: 100%" align='left'>
                    <el-table-column prop="flowCode" label="流程编号" width="240" fixed="left">
                    </el-table-column>
                    <el-table-column prop="flowName" label="流程名称" width="210">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="140">
                        <template slot-scope="scope">
                            {{scope.row.status==0?"草稿":"已发布"}}
                        </template>
                    </el-table-column>
                    <el-table-column width="360" label='操作'>
                        <template slot-scope="scope">
                            <div v-if="scope.row.status==0">
                                <Button Name='修改' small="Btn small" @click.native="editFlow(scope.row)"></Button>
                                <i class="cut_off_rule"></i>
                                <Button Name='添加表单' small="Btn small" @click.native="setForm(scope.row)"></Button>
                                <i class="cut_off_rule"></i>
                                <Button Name='配置节点' small="Btn small" @click.native="allocateNode(scope.row.id)"></Button>
                                <i class="cut_off_rule"></i>
                                <Button Name='节点发布' small="Btn small" @click.native="publishFlow(scope.row)"></Button>
                                <i class="cut_off_rule"></i>
                                <Button Name='删除' small="Btn small" @click.native="deleteFlow(scope.$index,scope.row.id)"></Button>
                            </div>
                            <div v-if="scope.row.status==1">
                                <Button Name='查看表单' small="Btn small" @click.native="seeForm(scope.row)"></Button>
                                <i class="cut_off_rule"></i>
                                <Button Name='查看节点' small="Btn small" @click.native="seeNode(scope.row.id)"></Button>
                                <i class="cut_off_rule"></i>
                                <Button Name='删除' small="Btn small" @click.native="deleteFlow(scope.$index,scope.row.id)"></Button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width='1'>
                    </el-table-column>
                </el-table>
                <div class="pagingwidth">
                    <!-- <Paging :handleCurrentChange="getData" :total="total" /> -->
                </div>
            </div>
        </div>

        <div class="x_model add_flow_model" v-show='dialogFlowVisible'>
            <div class="model_content">
                <div class="add_flow_content">
                    <header class="x_model_header clear">
                        <div class="left">{{addFlowTitle}}</div>
                        <div  class="right curor icon Fork" @click="cancleFlowBtn"></div>
                    </header>
                    <ul class="x_model_main">
                        <li v-if='addFlowShow'>
                            <span>
                                流程编号：
                            </span>
                            {{fFlowCode}}
                        </li>
                        <li>
                            <span>
                                <i class="icon waring"></i>
                                流程名称：
                            </span>
                            <input class="x_input" type="text" v-model='flow.flowName' @blur="verifyFun('flowName')" />
                            <!-- <Input :value="flow.flowName" :widths='iptWidth' arguName="flowName" @sonInput="upDatas" /> -->
                            <a class="x_error" v-if='verify.flowName'>必填!</a>
                        </li>
                        <li>
                            <span>
                                <i class="icon waring"></i>
                                审批类型：
                            </span>
                            <Select :SelecttemData="approveType" :clearable='clearable' :widths="'120px'" :values="flow.flowType" arguName="flowType" :SelecttemDetail="['key','value']" @sonSelect="upDatas" />
                            <a class="x_error" v-if='verify.flowType'>必填!</a>
                        </li>
                    </ul>
                    <div class="x_model_footer">
                        <Button Name='取消' buttonClass='None' @click.native="cancleFlowBtn"></Button>
                        <Button Name='提交' @click.native="addFlow"></Button>
                    </div>
                </div>
            </div>
        </div>
        <!--  -->
    </div>
</template>
<script>
import Vue from "vue";
// import { Dialog, Form, FormItem, Input, Table, TableColumn, } from "element-ui";
import Button from "../../common/Button";
import Paging from "../../common/Paging";
import Input from "@/components/common/Input";
import { mapMutations, mapState } from "vuex";
import Select from "../../common/Select";
// Vue.use(Dialog);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Input);
// Vue.use(Table);
// Vue.use(TableColumn);


export default {
    components: { Paging, Button, Input, Select, AboutBranch: (resolve) => { require(["../../common/AboutBranch"], resolve) } },
    data() {
        return {
            clearable: false,
            nowPage: 1,
            Lines: 10,
            pageNum: "",
            //新增流程 头
            addFlowTitle: "新增流程",
            //input组件宽
            iptWidth: "160px",

            //数据总页数
            total: 0,

            //机构名
            belongName: "",

            //全部流程
            allExamineApproves: [
                // {
                //     id: "",
                //     flowCode: "",
                //     flowName: "",
                //     status: "",
                //     pageNo: null,
                //     pageSize: null
                // }
            ],
            //显示机构
            showBranch: false,
            //添加流程
            flow: {
                flowName: "",
                flowType: "",
            },
            //验证添加流程
            verify: {
                flowName: false,
                flowType: false,
            },
            fFlowCode: '',
            //查询流程
            searchFlow: {
                flowCode: "",
                flowName: "",
                flowType: "",
            },

            addFlowShow: false,

            // //新增修改 dialog显示状态
            dialogFlowVisible: false,


            //添加-修改  流程-节点  状态
            addOrEdit: 0, //0 为添加  1为修改

            //配置节点详情
            allocateNodes: [{
                id: null,
                taskCode: "",
                taskName: "",
                approval: "",
                overrulePreviousNode: "",
                type: "",
                operator: "",
                flowConfigId: "",
                sortNum: ""
            }],


            //添加新节点
            addNodeData: [{

            }],

            //审批类型
            approveType: [],

        };
    },
    computed: {
        ...mapState(["getSysparasDatas"])
    },

    methods: {
        verifyFun(el) {
            let tv = this.verify;
            let tn = this.flow;
            !tn[el] ? tv[el] = true : tv[el] = false;
        },

        isSubFun(ver, val) {
            let len = 0;
            for (let key in ver) {

                if (val[key] === '' || val[key] === null) {
                    ver[key] = true;
                    len++;
                }
            };
            if (len > 0) {
                return false;
            } else {
                return true;
            }
        },

        //查看表单
        seeForm(val) {
            this.$router.push({
                path: '/NavDetail/ApproveForm',
                query: {
                    type: '_see',
                    id: val.id,
                }
            })
        },

        //查看节点按钮
        seeNode(val) {
            this.$router.push({
                path: "/NavDetail/allocateNode",
                query: {
                    flowConfigId: val,
                    type: '_see'
                }
            });
        },


        //搜索节点数据
        searchFlowDatas(val, key) {
            this.searchFlow[key] = val;
        },

        //添加修改节点数据
        upDatas(val, key) {
            this.flow[key] = val;
            !val ? this.verify[key] = true : this.verify[key] = false;
        },

        //取消 添加 修改流程
        cancleFlowBtn() {
            this.dialogFlowVisible = false;
            this.belongName = '';
            this.flow = {
                flowName: "",
                flowType: "",
            }
        },

        //showBranchFunc
        showBranchFunc() {
            this.showBranch = !this.showBranch;

        },


        //配置节点
        allocateNode(key) {
            this.$router.push({
                path: "/NavDetail/allocateNode",
                query: {
                    flowConfigId: key,
                    type: '_set'
                }
            });

        },


        //添加 流程按钮
        addFlowBtn() {
            this.addFlowTitle = '新增流程';
            this.flow = {
                flowName: "",
                flowType: ""
            };
            //验证添加流程
            this.verify = {
                flowName: false,
                flowType: false,
            };
            let data = {
                accessToken: this.$getCookie("accessToken"),
            }
            this.addFlowShow = false;
            //审批类型
            this.$post(
                this.$host + "/api/sysmgr/dict/getFlowType",
                data
            ).then(d => {
                if (d.success) {
                    // this.approveType = d.data;
                    if (this.approveType.length > 0) {
                        return;
                    } else {
                        for (var k in d.data) {
                            let p = {
                                value: d.data[k].dKeyname,
                                key: d.data[k].dKey
                            }
                            this.approveType.push(p)
                        }
                    }

                }
            });

            this.dialogFlowVisible = true;
            this.addOrEdit = 0; // 0状态 dialog 确定按钮为 新增功能
            // this.show1=false;
        },

        //确定 修改/添加 流程
        addFlow() {
            if(this.$stop()){return} 
            if (this.addOrEdit == 0) {
                if (this.isSubFun(this.verify, this.flow)) {
                    //添加流程
                    let addFlowParams = {
                        flowName: this.flow.flowName,
                        flowType: this.flow.flowType
                    };
                    this.$post(
                        this.$host + "/api/sysmgr/flowConfig/add", addFlowParams
                    ).then(d => {
                        if (d.success) {
                            this.$message({
                                type: 'success',
                                message: '添加成功',
                                duration: "800",
                                onClose: () => {
                                    this.dialogFlowVisible = false; //dialog 隐藏
                                    this.getData(this.nowPage)
                                }
                            });
                        }
                    });
                } else {
                    this.$message({
                        message: '有必填信息未填写！',
                        type: 'warning',
                        duration: "1000",
                    })
                }


            } else if (this.addOrEdit == 1) {
                if (this.isSubFun(this.verify, this.flow)) {
                    //修改流程
                    let editFlowParams = this.flow;
                    editFlowParams.accessToken = this.$getCookie("accessToken");
                    editFlowParams.flowCode = this.fFlowCode;
                    this.$post(
                        this.$host + "/api/sysmgr/flowConfig/update",
                        editFlowParams
                    ).then(d => {
                        if (d.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功',
                                duration: "800",
                                onClose: () => {
                                    this.getData(this.nowPage);
                                    this.dialogFlowVisible = false; //
                                }
                            });

                        }
                    });
                } else {
                    this.$message({
                        message: '有必填信息未填写！',
                        type: 'warning',
                        duration: "1000",
                    })
                }
            }
        },

        //删除流程
        deleteFlow(key, val) {
            this.$messagebox.confirm('此操作将永久删除该流程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$delete(this.$host + "/api/sysmgr/flowConfig/delete/" + val, {
                    accessToken: this.$getCookie("accessToken")
                }).then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            duration: "800",
                            onClose: () => {

                            }
                        });
                        if (this.allExamineApproves.length == 1) {
                            this.nowPage--
                        }
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



        // 重置查询
        resetQueryFlow() {

            this.searchFlow = {
                flowCode: "",
                flowName: "",
                flowType: "",
            };

        },

        //修改流程
        editFlow(val) {
            this.addFlowTitle = "修改流程";
            this.addFlowShow = true;
            for (var key in val) {
                for (var k in this.flow) {
                    if (key === k) {
                        this.flow[k] = val[key];
                        //
                    }
                }
            };
            this.fFlowCode = val.flowCode;
            this.approveType = [];
            // console.log("this.flow", this.flow)
            //审批类型
            this.$post(
                this.$host + "/api/sysmgr/dict/getFlowType",
                { accessToken: this.$getCookie("accessToken") }
            ).then(d => {
                if (d.success) {
                    for (var k in d.data) {
                        let p = {
                            value: d.data[k].dKeyname,
                            key: d.data[k].dKey
                        }
                        this.approveType.push(p);
                    }
                }
            });


            this.dialogFlowVisible = true;
            this.flow.id = val.id;
            this.addOrEdit = 1; //1状态 dialog 确定按钮为 修改功能
        },

        //配置表单
        setForm(val) {
            this.$router.push({
                path: '/NavDetail/ApproveForm',
                query: {
                    id: val.id,
                    type: "_set"
                }
            })
        },

        //发布流程
        publishFlow(val) {
            this.$post(this.$host + "/api/sysmgr/flowConfig/publish/" + val.id, {
                accessToken: this.$getCookie("accessToken")
            }).then(d => {
                if (d.success) {
                    val.status = 1;
                    this.$message({
                        type: 'success',
                        message: '发布成功!',
                        duration: "800",
                        onClose: () => {
                        }
                    });
                }
            });
        },


        getData(index) {
            this.nowPage = parseInt(index);
            let par = {
                pageNumber: parseInt(index),
                pageSize: 20,
            }
            for (var key in this.searchFlow) {
                if (this.searchFlow[key] != "") {
                    par[key] = this.searchFlow[key];
                }
            }
            this.$post(this.$host + "/api/sysmgr/flowConfig/list", par).then(d => {
                if (d.success) {
                    if (d.data == null) {
                        return;
                    } else {
                        d.data.map((item, index) => {
                            return item.isSelected = false;
                        });
                        this.allExamineApproves = d.data;
                        this.total = d.data.total;

                    }
                }
            });

        },
    },

    mounted() {

        this.getData(this.nowPage)
    }
};
</script>
<style scoped>
/*  */
@import "../../../../static/commonStyle.css";
.examine_approve {
  padding-right: 16px;
}
.btn_wrap {
  margin-bottom: 1.166667rem;
}
.search_wrap li {
  margin: 2px;
}
.search_wrap li:last-child {
  margin-left: 24px;
}
.search_wrap li:last-child button {
  margin: 0 6px;
}
.add_flow_model .model_content {
  width: 400px;
}

.model_content li {
  margin: 36px 0;
  font-size: 12px;
}
.model_content li span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
</style>
<style>
/* .examine_approve .el-table--border td:nth-child(4) {
  text-align: left;
} */
</style>

