<template>
    <div class="store-msg right_content_wrap">
        <div>
            <div class="search_wrap">
                <ul>
                    <li>
                        门店编号：
                        <Input :value="queryStoreMsg.sCode" arguName="sCode" @sonInput="upInput" />
                    </li>
                    <li>
                        门店名称：
                        <Input :value="queryStoreMsg.sName" arguName="sName" @sonInput="upInput" />
                    </li>
                    <li>
                        经营性质：
                        <el-select v-model='queryStoreMsg.sOwner' placeholder="请选择" size='mini'>
                            <el-option v-for="(item,index) in storeOwners" :label="item.ownerValue" :value="item.sOwner" :key="index">
                            </el-option>
                        </el-select>
                    </li>
                    <li>
                        <span>门店状态：</span>
                        <el-select v-model='queryStoreMsg.sStatus' placeholder="请选择" size='mini'>
                            <el-option v-for="(item,index) in storeStatus" :label="item.statusValue" :value="item.sStatus" :key="index">
                            </el-option>
                        </el-select>
                    </li>
                    <li v-if="areaShow">
                        地区：
                        <getArea @getAreaCode='getAreaCode' :values='areaDatas' />
                    </li>
                    <li v-if="corpShow">
                        所属部门：
                        <getCorpStore @getCorpStore="getCorpStore" :values="cCodesArr" />
                    </li>
                    <li>
                        <Button Name="查询" @click.native="gotoPage(1)" Search="true"></Button>
                        <Button Name="重置" @click.native="reset" Reset="true"></Button>
                    </li>
                </ul>
            </div>
            <div class="right_content">
                <!-- 新增导入按钮 -->
                <div class="btn_wrap">
                    <Button :iconadd="true" Name="新增" @click.native="addStoreBtn" v-show="addShow"></Button>
                    <Button :Upload="true" Name="导出已选择" @click.native="downSelected" v-if="exportShow"></Button>
                    <Button :Upload="true" Name="导出全部" @click.native="gotoPage(1,total)" v-if="exportShow"></Button>
                </div>
                <!-- 门店数据表格 -->
                <div class="table_content">
                    <div class="table_wrap">
                        <el-table :data="datas" ref='eTable' border @selection-change="selectDatasFun" :row-key='rowKey'>
                            <el-table-column type="selection" :reserve-selection='true'>
                            </el-table-column>
                            <el-table-column prop="sCode" label="门店编号" width="150">
                            </el-table-column>
                            <el-table-column prop="sShortName" label="门店名称" width="250" fixed="left">
                            </el-table-column>
                            <el-table-column prop="sDistrict" label="所在地区" width="170">
                            </el-table-column>
                            <el-table-column prop="sOwner" label="经营性质" width="150">
                            </el-table-column>
                            <el-table-column prop="sStatus" label="门店状态" width="150">
                            </el-table-column>
                            <el-table-column width="220" label='操作' fixed="right">
                                <template slot-scope="scope">
                                    <Button small="Btn small" Name="修改" @click.native="aditStoreMsg(scope.row.id)" v-show="editShow"></Button>
                                    <i class="cut_off_rule" v-show="editShow"></i>
                                    <Button small="Btn small" Name="详细信息" @click.native="storeDetail(scope.row.id)"></Button>
                                    <i class="cut_off_rule" v-show="deleteShow"></i>
                                    <Button small="Btn small" Name="删除" @click.native="deleteStore(scope.row,scope.$index)" v-show="deleteShow"></Button>
                                </template>
                            </el-table-column>
                            <el-table-column min-width='1' fixed="right">
                            </el-table-column>
                        </el-table>
                        <div class="pagingwidth">
                            <Paging :handleCurrentChange="gotoPage" :total="total" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Paging from "@/components/common/Paging";
import * as qiniu from 'qiniu-js';
import Select from "@/components/common/Select";
import { mapMutations, mapState } from "vuex"
import Vue from "vue";
export default {
    components: { Button, Paging, getArea: resolve => { require(['@/components/common/getArea'], resolve) }, Input, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) } },
    data() {
        return {
            areaDatas: [],
            //
            pageSize: 20,
            addShow: false,//新增权限
            editShow: false,//修改权限
            deleteShow: false,//删除权限
            exportShow: false,//导出权限
            corpShow: false,//部门权限
            areaShow: false,//门店权限
            nowPage: 1,
            Lines: 10,
            pageNum: 0,
            //门店信息
            datas: [],

            //条件 查询 店面 信息
            queryStoreMsg: {
                sCode: null, //门店标号
                sName: null, //门店名称
                sDistrictCode: null, //所在地区
                sOwner: null, //经营性质
                sStatus: null,
                cCode: this.$getCookie("dept"),
            },

            //门店总数
            total: 1,

            //经营性质
            storeOwners: [],

            //门店状态
            storeStatus: [],

            //删除门店信息
            delStoreMsg: '',
            delStoreMsgIdx: '',

            cCodesArr: this.$getCookie('belongShop') == 'null' ? [this.$getCookie('dept')] : [],//部门数组

            //当前被选数据
            selectDatas: [],

            imgUrl: '',



        };
    },
    computed: {
        ...mapState(["storesvuex",]),
        imgUrls:function(){
            return this.imgUrl;
        }
    },
    methods: {
       
        //rowKey
        rowKey(row) {
            return row.id;
        },


        //选择的数据
        selectDatasFun(val) {
            console.log('>>>',val)
            this.selectDatas = val;
        },


        //导出
        downSelected() {
            if (this.selectDatas.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择期望导出的门店!',
                    duration: "3000",
                    onClose: () => {
                    }
                });
            } else {
                let arr1 = ['门店名称', '门店编号', "所在地区", '经营性质', '门店状态',];
                let arr2 = ['sShortName', 'sCode', 'sDistrict', 'sOwner', 'sStatus',];
                this.$exportExcel(arr1, arr2, this.selectDatas, '门店列表')
                this.$refs.eTable.clearSelection()


            }

        },

        //选择部门
        getCorpStore(value) {
            this.queryStoreMsg.cCode = value[value.length - 1];
        },


        selectTr(val) {
            val.isSelected = !val.isSelected;
        },
        //input组件 事件
        upInput(val, key) {
            this.queryStoreMsg[key] = val;
        },

        //获取地区aCode
        getAreaCode(val) {
            this.queryStoreMsg.sDistrictCode = val;
        },

        //跳转分页
        gotoPage(index, total) {
            this.nowPage = parseInt(index);
            let data = {
                pageNumber: parseInt(index),
                pageSize: total || this.pageSize
            }
            for (var key in this.queryStoreMsg) {
                if (this.queryStoreMsg[key] != null) {
                    data[key] = this.queryStoreMsg[key];
                }
            }
            //获取门店信息
            this.$post(this.$host + "/api/store/store/query/page", data)
                .then(d => {
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
                                let arr1 = ['门店名称', '门店编号', "所在地区", '经营性质', '门店状态',];
                                let arr2 = ['sShortName', 'sCode', 'sDistrict', 'sOwner', 'sStatus',];
                                this.$exportExcel(arr1, arr2, d.pageData.content, '门店列表')
                            }
                        } else {
                            this.datas = d.pageData.content;
                            this.total = d.pageData.total;
                        }

                    }
                });
        },

        //重置
        reset() {
            this.queryStoreMsg = {
                sCode: null, //门店标号
                sName: null, //门店名称
                sDistrictCode: null, //所在地区
                sOwner: null, //经营性质
                sStatus: null,
                cCode: this.$getCookie("dept"),
            };
            this.areaDatas = [];
            this.cCodesArr = this.$getCookie('belongShop') == 'null' ? [this.$getCookie('dept')] : [];//部门数组

        },

        //门店详细信息
        storeDetail(val) {
            this.$router.push({
                path: "/NavDetail/storeDetail",
                query: {
                    storeId: val
                }
            });
        },
        ...mapMutations(["setDatas"]),
        //删除门店
        deleteStore(store, index) {
            this.$messagebox.confirm('此操作将永久删除该门店, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post(this.$host + "/api/store/store/delete", {
                    accessToken: this.$getCookie("accessToken"),
                    id: store.id
                }).then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功',
                        });
                        this.setDatas({ name: "storesvuex", value: '' })
                        this.gotoPage(this.nowPage)
                    }
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: "1000",
                });
            });

        },

        //新增按钮
        addStoreBtn() {
            this.$router.push({
                path: "/NavDetail/addStore",
                type: '_add'
            });
        },

        //修改
        aditStoreMsg(val) {
            this.$router.push({
                path: "/NavDetail/addStore",
                query: {
                    id: val,
                    type: '_edit'
                }
            });
        },


    },

    mounted() {
        this.gotoPage(this.nowPage)

        //门店状态-经营性质
        this.$post(this.$host + "/api/store/store/query/ownerandstatus", { accessToken: this.$getCookie("accessToken") })
            .then(d => {
                if (d.success) {
                    this.storeOwners = d.owners;
                    this.storeStatus = d.status;
                }
            });
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F010") {//门店信息的权限
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
                if (el.fUrl == "area") {
                    this.areaShow = true;
                }
            }
        })
    }
};
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.btn_wrap {
    margin-bottom: 1rem;
}
</style>
<style>
</style>


