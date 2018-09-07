<template>
    <div class="right_content_wrap">
        <div class="right_content">
            <div class="update_content">
                <ul>
                    <li v-if='isUpdate'>
                        <div class="update_tit">

                            任务编号：
                        </div>
                        <div class="update_main">
                            {{addAllocateNodes.taskCode}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            任务名称：</div>
                        <div class="update_main">
                            <!-- <Input :value="addAllocateNodes.taskName" :widths='iptWidth' :blur="verifyFun('taskName')" arguName="taskName" @sonInput="upDatas" /> -->
                            <input class="x_input" type="text" v-model='addAllocateNodes.taskName' @blur="verifyFun('taskName')">
                            <span class="x_error" v-if='verify.taskName'>必填!</span>
                        </div>
                    </li>
                    <li style="display:none">
                        <div class="update_tit">是否需要审批：</div>
                        <div class="update_main">
                            <Select :clearable='clearable' :SelecttemData="approval" :values="addAllocateNodes.approval" arguName="approval" :SelecttemDetail="['key','value']" @sonSelect="upDatas" />
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">是否门店审批：</div>
                        <div class="update_main">
                            <Select :clearable='clearable' :SelecttemData="approval" :values="addAllocateNodes.isShop" arguName="isShop" :SelecttemDetail="['key','value']" @sonSelect="upDatas" />
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">可回退：</div>
                        <div class="update_main">
                            <Select :clearable='clearable' :SelecttemData="approval" :values="addAllocateNodes.overrulePreviousNode" arguName="overrulePreviousNode" :SelecttemDetail="['key','value']" @sonSelect="upDatas" />
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            审批人：
                        </div>
                        <div class="update_main">
                            <Input @click.native="selectApproveButn" readonly='true' :value="showApproverName.join(';')" :widths='iptWidth' arguName="operators" @sonInput="upDatas" placeholder="请选择审批人" />
                            <!-- <input type="text" readonly @click="selectApproveButn" :value="showApproverName.join(';')" placeholder="请选择审批人"> -->
                            <span class="x_error" v-if='verify.backData'>必填!</span>
                        </div>
                    </li>

                    <li>
                        <div class="update_tit">审批模式：</div>
                        <div class="update_main">
                            <Select :clearable='clearable' :SelecttemData="approveType" :values="addAllocateNodes.type" arguName="type" :SelecttemDetail="['key','value']" @sonSelect="upDatas" />
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            节点顺序：
                        </div>
                        <div class="update_main">
                            <input class="x_input" type="number" v-model='addAllocateNodes.sortNum' @blur="verifyFun('sortNum')">
                            <span class="x_error" v-if='verify.sortNum'>必填!</span>
                        </div>
                    </li>
                </ul>
                <div class="btn_wrap">
                    <Button Name='取消' buttonClass='None' @click.native="goBack"></Button>
                    <Button Name='提交' buttonClass='purple' @click.native="submitAddAllocateNode()"></Button>
                </div>
            </div>
            <!-- model -->
            <div class="x_model select_app_model" v-show="approverShow">
                <div class="model_content">
                    <div class="x_model_main">
                        <el-tabs type="border-card">
                            <el-tab-pane label="用户">
                                <div>
                                    <div class="AboutPeople">
                                        <ul class="model_search search_wrap">
                                            <li>
                                                用户名称：
                                                <Input :value="searchUser.uName" :widths='searchIptWid' arguName="uName" @sonInput="searchUserDatas" />
                                            </li>
                                            <li>
                                                联系电话：
                                                <Input :value="searchUser.uTel" :widths='searchIptWid' arguName="uTel" @sonInput="searchUserDatas" />
                                            </li>
                                            <li>
                                                <Button Name="查询" @click.native="searchUserFunc(1)" Search="true" />
                                                <Button Name="重置" @click.native="resethUserFunc" Reset="true" />
                                            </li>
                                        </ul>

                                        <Table :TbodyCheck='true' :datas="userDatas" :Tbody="userTbody" :TabelHeader="userTabelHeader" :queryRole="approveSelected" :checkBox='approveSelected' Lines='6' />
                                        <div class="pagingwidth model_wrap">
                                            <Paging :pageSize='modelPageSize' :handleCurrentChange="searchUserFunc" :total='userTotal' />
                                        </div>

                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="角色">
                                <Table :TbodyCheck='true' :datas="roleDatas" :Tbody="roleTbody" :TabelHeader="roleTabelHeader" :queryRole="approveSelected" :checkBox='approveSelected' Lines='6' />
                                <div class="pagingwidth model_wrap">
                                    <Paging :pageSize='modelPageSize' :handleCurrentChange="searchRolePage" :total='roleTotal' />
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="岗位">
                                <Table :TbodyCheck='true' :datas="postDatas" :Tbody="postTbody" :TabelHeader="postTabelHeader" :queryRole="approveSelected" :checkBox='approveSelected' Lines='6' />
                                <div class="pagingwidth model_wrap">
                                    <Paging :pageSize='modelPageSize' :handleCurrentChange="searchPostFunc" :total='postTotal' />
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="selected_content">
                        已选择：
                        <div class="x_tags" v-for='(item,index) in selectedData'>
                            {{item.nm}}
                            <i @click="cancleSelect(item,index)" class="icon icon-chahao"></i>
                        </div>
                    </div>
                    <div class="x_model_footer">
                        <Button Name="取消" buttonClass='None' @click.native="cancelBtn" />
                        <Button Name="确定" @click.native="ensureBtn" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import Vue from "vue";
import Button from "../../common/Button";
import Table from "../../common/Table";
import Paging from "../../common/Paging";
import MTK from "../../common/Mtk";
import Input from "../../common/Input";
import Select from "../../common/Select";
export default {
    components: {
        Button, Input, MTK, Paging, Table, Select
    },
    data() {
        return {
            //弹框表格没页数量
            modelPageSize: 6,

            //select 是否可清除
            clearable: false,

            isUpdate: false,

            //headerTitle
            headerTitle: '新增节点',
            //input  宽度
            iptWidth: "160px",

            //search input width
            searchIptWid: '120px',

            //审批模式状态
            approveType: [
                { value: "串行", key: 1 },
                { value: "并行", key: 2 },
            ],

            //是否审批 可退回
            approval: [
                { value: "是", key: 1 },
                { value: "否", key: 0 }
            ],

            //添加 修改节点
            addAllocateNodes: {
                taskCode: "",
                taskName: "",
                approval: 1,
                isShop: 1,
                overrulePreviousNode: 0,
                type: 1,
                operators: "",
                flowConfigId: "",
                sortNum: ""
            },

            //selectUser
            selectUser: null,

            //selectUserVal
            selectUserVal: null,

            // //传后台数据
            backData: [],

            //展示审批人名字
            showApproverName: [],

            //展示审批人名字 data
            showApproverNameData: [],

            approverShow: false,
            //审批人code
            showApproverCode: [],

            //用户查询
            searchUser: {
                uName: "",
                uTel: ""
            },


            //选用户
            userDatas: [],
            userTotal: 1,
            userTabelHeader: [
                { detail: "", width: "50px" },
                { detail: "用户名称", width: "" },
                { detail: "手机号码", width: "" },
            ],
            userTbody: ["uName", "uTel"],
            // userNoDO: true,
            selectedData: [],//选中的用户

            //选角色
            roleDatas: [],
            roleTotal: 1,
            roleTabelHeader: [

                { detail: "", width: "50px" },
                { detail: "角色名", width: "" },
            ],
            roleTbody: ["rName"],


            //选岗位
            postDatas: [],
            postTotal: 1,
            postTabelHeader: [
                { detail: "", width: "50px" },
                { detail: "岗位名", width: "" },
            ],
            postTbody: ["statName"],
            //验证
            verify: {
                sortNum: false, //顺序
                taskName: false, //任务名
                backData: false, //审批人
            },


        }
    },

    methods: {
        //验证
        verifyFun(el) {
            let tv = this.verify;
            let tn = this.addAllocateNodes;
            !tn[el] ? tv[el] = true : tv[el] = false;
        },

        //确定  添加-修改  新配置节点
        submitAddAllocateNode(val) {
            if (this.$stop()) { return }
            let isDisableAdd = 0;
            let tv = this.verify;
            let tn = this.addAllocateNodes;
            if (tn.sortNum === '') {
                tv.sortNum = true;
                isDisableAdd++
            };
            if (tn.taskName === '') {
                tv.taskName = true;
                isDisableAdd++
            };

            if (this.backData.length <= 0) {
                tv.backData = true;
                isDisableAdd++
            };
            let params = this.addAllocateNodes;
            params.operators = this.backData;
            params.flowConfigId = this.$route.query.flowConfigId;
            if (isDisableAdd > 0) {
                this.$message.error('信息填写不完整！');
                return;
            } else
                if (this.$route.query.type === "_add") {//添加新节点
                    delete params.taskCode;
                    this.$post(
                        this.$host + "/api/sysmgr/flowTaskConfig/add",
                        params
                    ).then(d => {
                        if (d.success) {
                            this.$message({
                                type: 'success',
                                message: '新增成功!',
                                duration: "1000",
                                onClose: () => {
                                    this.goBack();
                                }
                            });
                        }
                    });
                } else if (this.$route.query.type === "_update") {//修改节点
                    this.$post(
                        this.$host + "/api/sysmgr/flowTaskConfig/update",
                        params
                    ).then(d => {
                        if (d.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!',
                                duration: "1000",
                                onClose: () => {
                                    this.goBack();
                                }
                            });
                        }
                    });

                }

        },


        //select 审批模式 数据
        upDatas(val, key) {
            this.addAllocateNodes[key] = val;
        },

        //搜索用户 u数据
        searchUserDatas(val, key) {
            this.searchUser[key] = val;
        },

        // showApproverNameData
        //选 审批人
        approveSelected(index, val) {
            val.checked = !val.checked
            if (val.checked == true) {
                //把选中值 push 到this.selectedData

                if (val.uCode != undefined) {
                    val.t = "u";
                    val.sid = val.uCode;
                    val.nm = val.uName
                    this.showApproverName.push(val.uName);
                    this.selectedData.push(val);
                } else if (val.rName != undefined) {
                    val.t = "r";
                    val.sid = val.id;
                    val.nm = val.rName
                    this.showApproverName.push(val.rName);
                    this.selectedData.push(val);
                } else if (val.statName != undefined) {
                    val.t = "g";
                    val.sid = val.id;
                    val.nm = val.statName
                    this.showApproverName.push(val.statName);
                    this.selectedData.push(val);
                }

            } else {
                //把取消选中的值 移除
                this.selectedData.map((item, i) => {
                    if (item.id == val.id) {
                        this.selectedData.splice(i, 1);
                        this.showApproverName.splice(i, 1);
                    }
                })
            }

        },

        //取消选中
        cancleSelect(val, key) {
            this.selectedData.splice(key, 1);
            this.showApproverName.splice(key, 1);
            if (val.t == "u") {
                this.userDatas.map((item, index) => {
                    if (item.uCode == val.uCode) {
                        item.checked = false;
                    }
                })
            } else if (val.t == "r") {
                this.roleDatas.map((item, index) => {
                    if (item.id == val.id) {
                        item.checked = false;
                    }
                })
            } else if (val.t == "g") {
                this.postDatas.map((item, index) => {
                    if (item.id == val.id) {
                        item.checked = false;
                    }
                })
            }
        },

        //按钮 点击显示model
        selectApproveButn() {
            this.approverShow = true;

        },

        //修改反选审批人
        invertSelect() {
            this.showApproverCode.map((item, i) => {
                let key = item.substring(0, 1);
                let val = item.substring(1);
                if (key == "u") {
                    this.userDatas.map((item, index) => {
                        if (item.uCode == val) {
                            item.checked = true;
                            item.t = "u";
                            item.sid = item.uCode
                            item.nm = item.uName
                            this.selectedData.push(item);
                        }
                    })
                } else if (key == "r") {
                    this.roleDatas.map((item, index) => {
                        if (item.id == val) {
                            item.checked = true;
                            item.t = "r";
                            item.sid = item.id;
                            item.nm = item.rName
                            this.selectedData.push(item);

                        }
                    })
                } else if (key == "g") {
                    this.postDatas.map((item, index) => {
                        if (item.id == val) {
                            item.checked = true;
                            item.t = "g";
                            item.sid = item.id;
                            item.nm = item.statName
                            this.selectedData.push(item);

                        }
                    })
                }
            })
        },

        //选择审批人 确定按钮
        ensureBtn() {
            this.backData = [];
            this.selectedData.map((item, i) => {
                let p = {}
                if (item.uCode != undefined && item.checked == true) {
                    p.operator = this.selectedData[i].uName
                    p.operatorId = "u" + this.selectedData[i].uCode
                    this.backData.push(p);
                } else if (item.rName != undefined && item.checked == true) {
                    p.operator = this.selectedData[i].rName
                    p.operatorId = "r" + this.selectedData[i].id
                    this.backData.push(p);
                } else if (item.statName != undefined && item.checked == true) {
                    p.operator = this.selectedData[i].statName
                    p.operatorId = "g" + this.selectedData[i].id
                    this.backData.push(p);
                }
            })
            if (this.backData.length == 1 && this.backData[0].operator == '') {
                this.backData = []
            };
            this.approverShow = false;
            this.backData.length === 0 ? this.verify.backData = true : this.verify.backData = false;
        },

        //选择审批人 取消按钮
        cancelBtn() {
            this.approverShow = false;
            this.backData.length === 0 ? this.verify.backData = true : this.verify.backData = false;
        },

        // 查询用户方法
        searchUserFunc(index) {
            let params = {
                pageNumber: parseInt(index),
                pageSize: 6
            };
            for (var k in this.searchUser) {
                if (this.searchUser[k] !== '') {
                    params[k] = this.searchUser[k];
                }

            }
            this.$post(this.$host + "/api/sysmgr/user/query/page", params).then(d => {
                if (d.success) {
                    let content = d.data.content.map(e => {
                        e.checked = false;
                        return e;
                    })
                    this.userDatas = content;
                    this.userTotal = d.data.total;
                    // this.invertSelect();
                }
            })

        },

        //取消用户搜索
        resethUserFunc() {

            this.searchUser = {
                uName: "",
                uTel: ""
            };
            this.searchUserFunc(1)
        },


        //返回
        goBack() {
            history.go(-1)
        },

        //角色 分页查询方法
        searchRolePage(index) {
            let data = {
                pageNumber: parseInt(index),
                pageSize: 6
            }
            this.$post(
                this.$host + "/api/sysmgr/role/allridrname",
                data
            ).then(d => {
                if (d.success) {
                    this.roleDatas = d.data.content.map(e => {
                        e.checked = false;
                        return e;
                    });
                    this.roleTotal = d.data.total;
                }
            });
        },

        //查询全部岗位

        searchPostFunc(index) {
            let data = {
                pageNumber: parseInt(index),
                pageSize: 6
            }
            //查询全部岗位
            this.$post(this.$host + "/api/store/empstat/page", data).then(d => {
                if (d.success) {
                    let content = d.data.content.map(e => {
                        e.checked = false;
                        return e;
                    })
                    this.postDatas = content;
                    this.postTotal = d.data.total;
                }
            });
        }
    },

    mounted() {
        //根据ID查询 流程节点

        //获取全部用户
        let data = {
            accessToken: this.$getCookie("accessToken"),
            pageNumber: 1,
            pageSize: 6
        }

        this.searchUserFunc(1)

        //获取全部角色

        this.searchRolePage(1)

        this.searchPostFunc(1)

        //id查节点
        if (this.$route.query.type === "_update") {
            this.headerTitle = '修改节点'
            this.$post(this.$host + "/api/sysmgr/flowTaskConfig/getOne/" + this.$route.query.id, {}).then(d => {
                if (d.success) {
                    this.isUpdate = true;
                    this.addAllocateNodes = d.data;
                    this.showApproverName = JSON.parse(this.$route.query.name).split('；');
                    this.showApproverCode = JSON.parse(this.$route.query.code);

                    this.showApproverName.map((el, i) => {
                        let obj = {};
                        obj.operator = el;
                        obj.operatorId = this.showApproverCode[i];
                        this.backData.push(obj)
                    })
                    setTimeout(() => {
                        this.invertSelect();
                    }, 2000)
                }
            })
        }
    },
}
</script>
<style scoped>
.model_wrap {
    position: relative !important;
}
@import "../../../../static/commonStyle.css";
@import "../../../assets/iconfont.css";

.select_app_model .model_content {
    width: 600px;
    height: 520px;
}
.right_content_wrap .pagingwidth {
    right: 0;
    margin-top: 12px;
}
.select_app_model .x_model_footer {
    position: absolute;
    width: 100%;
    bottom: 0;
}
.select_app_model .x_model_main {
    margin: 0;
}
.selected_content {
    border-radius: 0.333333rem;
    margin-top: 1.166667rem;
    padding: 10px;
    line-height: 30px;
}

.el-tabs--border-card {
    -webkit-box-shadow: none;
    box-shadow: none;
}
.btn_wrap {
    margin-top: 1.666667rem;
    text-align: center;
}
.btn_wrap button:last-child {
    margin-left: 24px;
}
</style>

