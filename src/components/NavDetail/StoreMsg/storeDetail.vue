<template>
    <div class="right_content_wrap">
        <div class="store_detail right_content">
            <el-tabs v-model="tabActiveName" @tab-click='tabClick'>
                <el-tab-pane label="基本信息" name="storeDetail1">
                    <div class="update_content">
                        <ul>
                            <li>
                                <div class="update_tit">门店编号： </div>
                                <div class="update_main">{{storeMsg.sCode}} </div>
                            </li>
                            <li>
                                <div class="update_tit">门店名称： </div>
                                <div class="update_main">{{storeMsg.sName}} </div>
                            </li>
                            <li>
                                <div class="update_tit">门店简称： </div>
                                <div class="update_main">{{storeMsg.sShortName}} </div>
                            </li>
                            <li>
                                <div class="update_tit">所在地区： </div>
                                <div class="update_main">{{storeMsg.aName}} </div>
                            </li>
                            <li>
                                <div class="update_tit">所属部门： </div>
                                <div class="update_main">{{storeMsg.cName}} </div>
                            </li>
                            <li>
                                <div class="update_tit">开业日期： </div>
                                <div class="update_main">{{storeMsg.sStartDate}} </div>
                            </li>
                            <li>
                                <div class="update_tit">停业日期： </div>
                                <div class="update_main">{{storeMsg.sEndDate}} </div>
                            </li>
                            <li>
                                <div class="update_tit">门店地址： </div>
                                <div class="update_main">{{storeMsg.sShopAddr}} </div>

                            </li>
                            <li>
                                <div class="update_tit">经营性质： </div>
                                <div class="update_main">{{storeMsg.oName}} </div>
                            </li>
                            <li>
                                <div class="update_tit">地图： </div>
                                <div class="update_main">
                                    <div class="allmap_wrap">
                                        <div id='allmap' style='height:400px;width:calc(100% - 160px);'>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                    </div>
                </el-tab-pane>
                <el-tab-pane label="财务信息" name="storeDetail2">
                    <div class="btn_wrap">
                        <div>
                            <Button v-if="addStoreFinanceMsg" Name="新增" @click.native="addFinanceMsg()"></Button>
                        </div>
                        <div v-if="!addStoreFinanceMsg">
                            <Button v-show="isFinanceReadonly" Name="修改" @click.native="aditFinanceMsg()"></Button>
                            <div v-show="!isFinanceReadonly">
                                <Button Name="保存" @click.native="saveMsg"></Button>
                                <Button buttonClass='None' Name="取消" @click.native="cancelFinanceBtn"></Button>
                            </div>
                        </div>
                    </div>
                    <div class="update_content">
                        <ul class="edit_input" :class="{finance_msg:isFinanceReadonly}">
                            <li>
                                <div class="update_tit">
                                    <span>
                                        <i class="icon waring"></i>
                                        发票公司名称：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <input @blur="verifyFinanceFun('sBillCo')" class="x_input" type="text" :disabled="isFinanceReadonly" placeholder="无" v-model='storeFinanceMsg.sBillCo' />
                                    <span class="x_error" v-if='verifyFinance.sBillCo'>必填!</span>
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        <i class="icon waring"></i>
                                        发票税点：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <input @keyup='keyupFun' @blur="verifyFinanceFun('sBillTp')" class="x_input s_billTp" type="text" :disabled="isFinanceReadonly" placeholder="无" v-model='storeFinanceMsg.sBillTp' />
                                    <span v-if='isPercent'>%</span>
                                    <span class="x_error">{{verifyFinance.sBillTp}}</span>
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        <i class="icon waring"></i>
                                        税务注册号：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <input @keyup='keyupsTaxRegNo' @blur="verifyFinanceFun('sTaxRegNo')" class="x_input" type="text" :disabled="isFinanceReadonly" placeholder="无" v-model='storeFinanceMsg.sTaxRegNo' />
                                    <span class="x_error">{{verifyFinance.sTaxRegNo}}</span>
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        <i class="icon waring"></i>
                                        开户行名称：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <input @blur="verifyFinanceFun('sBank')" class="x_input" type="text" :disabled="isFinanceReadonly" placeholder="无" v-model='storeFinanceMsg.sBank' />
                                    <span class="x_error" v-if='verifyFinance.sBank'>必填!</span>
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        <i class="icon waring"></i>
                                        银行账号：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <input @keyup='keyupFun' @blur="verifyFinanceFun('sBankAcct')" class="x_input" type="text" :disabled="isFinanceReadonly" placeholder="无" v-model='storeFinanceMsg.sBankAcct' />
                                    <span class="x_error">{{verifyFinance.sBankAcct}}</span>
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        <i class="icon waring"></i>
                                        发票电话：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <input @blur="verifyFinanceFun('sBillTel')" class="x_input" type="number" :disabled="isFinanceReadonly" placeholder="无" v-model='storeFinanceMsg.sBillTel' />
                                    <span class="x_error" v-if='verifyFinance.sBillTel'>必填!</span>
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        <i class="icon waring"></i>
                                        发票地址：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <textarea @blur="verifyFinanceFun('sBillAddr')" name="" id="" :disabled="isFinanceReadonly" cols="40" rows="2" placeholder="无" v-model='storeFinanceMsg.sBillAddr'></textarea>
                                    <span class="x_error" v-if='verifyFinance.sBillAddr'>必填!</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="工位信息" name="storeDetail3">
                    <div class="btn_wrap">
                        <div>
                            <Button Name="添加" @click.native="addStationMsgBtn()"></Button>
                        </div>
                    </div>
                    <div class="store_station">

                        <div class="table_content">
                            <el-table :data="storeStationMsgs" border style="width: 100%" align='left'>
                                <el-table-column prop="workplcName" label="工位名称" width="180" fixed="left">
                                </el-table-column>
                                <el-table-column prop="isChecked" label="启用状态" width="140">
                                    <template slot-scope="scope">
                                        <el-switch disabled v-model="scope.row.isChecked">
                                        </el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column width="140" label='操作'>
                                    <template slot-scope="scope">
                                        <Button small="Btn small" Name="修改" @click.native="editStationMsg(scope.$index,scope.row)">
                                        </Button>
                                        <i class="cut_off_rule"></i>
                                        <Button small="Btn small" Name="删除" @click.native="delStationMsg(scope.row.id,scope.$index)">
                                        </Button>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width='1'>
                                </el-table-column>
                            </el-table>
                            <div class="pagingwidth">
                                <Paging :handleCurrentChange="stationgotoPage" :total="stationTotal" />
                            </div>

                            <!--  -->
                            <transition name="el-fade-in-linear">

                                <div class="x_model update_station_model" v-if='updateStationShow'>
                                    <div class="model_content">
                                        <header class="x_model_header clear">
                                            <div class="left">{{updateStationTitle}}</div>
                                            <div class="right curor icon Fork" @click="closeModelStation"></div>
                                        </header>
                                        <ul class="x_model_main">
                                            <li>
                                                <span>
                                                    <i class="icon waring"></i>
                                                    工位名称：
                                                </span>
                                                <input class="x_input" @blur="verifyStationFun('workplcName')" v-model='updateStationData.workplcName' type="text">
                                                <a class="x_error" v-if='verifyStation.workplcName'>必填!</a>
                                            </li>
                                            <li>
                                                <span>
                                                    是否启用：
                                                </span>

                                                <el-switch v-model="updateStationData.isChecked">
                                                </el-switch>
                                            </li>
                                        </ul>
                                        <div class="x_model_footer">
                                            <Button Name='取消' buttonClass='None' @click.native="closeModelStation"></Button>
                                            <Button Name='提交' @click.native="addMsg"></Button>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                            <!--  -->
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="班次信息" name="storeDetail4" size='mini'>
                    <div class="btn_wrap">
                        <div>
                            <Button Name="添加" @click.native="addSchedulingMsgBtn"></Button>
                        </div>
                    </div>
                    <div class='store_scheduling'>
                        <div class="table_content">
                            <el-table :data="schedulingMsgs" border style="width: 100%" align='left'>
                                <el-table-column prop="storeName" label="班次类别" width="180">
                                </el-table-column>
                                <el-table-column prop="startTime" label="开始时间" width="140">
                                </el-table-column>
                                <el-table-column prop="endTime" label="结束时间" width="180">
                                </el-table-column>
                                <el-table-column width="140" label='操作'>
                                    <template slot-scope="scope">
                                        <Button small="Btn small" Name="修改" @click.native="editSchedulingMsg(scope.$index,scope.row)"></Button>
                                        <i class="cut_off_rule"></i>
                                        <Button small="Btn small" Name="删除" @click.native="delSchedulingMsg(scope.row.id,scope.$index)"></Button>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width='1'>
                                </el-table-column>
                            </el-table>

                            <div class="pagingwidth">
                                <Paging :handleCurrentChange="schedulinggotoPage" :total="total" />
                            </div>

                        </div>
                        <!--  -->
                        <transition name="el-fade-in-linear">
                            <div class="x_model update_station_model" v-if='updateSchedulingShow'>
                                <div class="model_content">
                                    <header class="x_model_header clear">
                                        <div class="left">{{updateSchedulingTitle}}</div>
                                        <div class="right curor icon Fork" @click="closeModelScheduling"></div>
                                    </header>
                                    <ul class="x_model_main">
                                        <li>
                                            <span>
                                                <i class="icon waring"></i>
                                                班次类别：
                                            </span>
                                            <input class="x_input" @blur="verifySchedulingFun('storeName')" v-model='updateSchedulingData.storeName' type="text">
                                            <a class="x_error" v-if='verifyScheduling.storeName'>必填!</a>
                                        </li>
                                        <li>
                                            <span>
                                                <i class="icon waring"></i>
                                                开始时间：
                                            </span>
                                            <el-time-picker :editable="editable" :clearable='editable' @blur="verifySchedulingFun('startTime')" placeholder="请选择开始时间" size='mini' value-format='HH:mm' format='HH:mm' v-model="updateSchedulingData.startTime">
                                            </el-time-picker>
                                            <a class="x_error" v-if='verifyScheduling.startTime'>必填!</a>
                                        </li>
                                        <li>
                                            <span>
                                                <i class="icon waring"></i>
                                                结束时间：
                                            </span>
                                            <el-time-picker :editable="editable" :clearable='editable' @blur="verifySchedulingFun('endTime')" placeholder="请选择结束时间" size='mini' value-format='HH:mm' format='HH:mm' v-model="updateSchedulingData.endTime">
                                            </el-time-picker>
                                            <a class="x_error" v-if='verifyScheduling.endTime'>必填!</a>
                                        </li>
                                    </ul>
                                    <div class="x_model_footer">
                                        <Button Name='取消' buttonClass='None' @click.native="closeModelScheduling"></Button>
                                        <Button Name='提交' @click.native="addMsg"></Button>
                                    </div>
                                </div>
                            </div>
                        </transition>
                        <!--  -->
                    </div>
                </el-tab-pane>
                <el-tab-pane label="收款信息" name="storeDetail5">
                    <Collections/>
                </el-tab-pane>
                <el-tab-pane label="推广信息" name="storeDetail6">
                    <div class="btn_wrap">
                        <div v-if='addStoreGeneralizeMsg'>
                            <Button Name="添加" @click.native="addGeneralizeMsg()"></Button>
                        </div>
                        <div v-if='!addStoreGeneralizeMsg'>
                            <Button v-if='isGeneralizeReadonly' Name="修改" @click.native="editGeneralizeMsgBtn()"></Button>
                            <div v-if='!isGeneralizeReadonly'>
                                <Button Name="保存" @click.native="saveMsg"></Button>
                                <Button buttonClass='None' Name="取消" @click.native="cancelEdit"></Button>
                            </div>
                        </div>
                    </div>
                    <div class="update_content">
                        <ul class="edit_input" :class="{finance_msg:isGeneralizeReadonly}">
                            <li>
                                <div class="update_tit">
                                    <span>
                                        门店LOGO：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <img class="show_img" v-if='generalizeMsg.storeLogo!=""&&isGeneralizeReadonly' :src="generalizeMsg.storeLogo" alt="">
                                    <input type="text" v-if='generalizeMsg.storeLogo==""&&isGeneralizeReadonly' :readonly='true' placeholder="无">
                                    <upload imgType='logo' :url='generalizeMsg.storeLogo' v-if='!isGeneralizeReadonly' @sonInput='generalizeUpInput' arguName="storeLogo" />
                                </div>
                            </li>

                            <li>
                                <div class="update_tit">
                                    <span>
                                        门店简介：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <Input :value="generalizeMsg.storeIntro" placeholder="无" :readonly="isGeneralizeReadonly" arguName="storeIntro" @sonInput="generalizeUpInput" :widths="widths" />
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        门店二维码：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <img class="show_img" v-if='generalizeMsg.storeQrc!=""&&isGeneralizeReadonly' :src="generalizeMsg.storeQrc" alt="">
                                    <input type="text" v-if='generalizeMsg.storeQrc==""&&isGeneralizeReadonly' :readonly='true' placeholder="无">

                                    <upload :url='generalizeMsg.storeQrc' v-if='!isGeneralizeReadonly' @sonInput='generalizeUpInput' arguName="storeQrc" />
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        门店链接地址：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <Input :value="generalizeMsg.storeLink" placeholder="无" :readonly="isGeneralizeReadonly" arguName="storeLink" @sonInput="generalizeUpInput" :widths="widths" />
                                    <a :href="generalizeMsg.storeLink"></a>
                                </div>
                            </li>
                            <li>
                                <div class="update_tit">
                                    <span>
                                        门店展示图：
                                    </span>
                                </div>
                                <div class="update_main">
                                    <img class="show_img" v-if='generalizeMsg.storeImgs.length!=0&&isGeneralizeReadonly' v-for='item in generalizeMsg.storeImgs' :src="item">
                                    <input type="text" v-if='generalizeMsg.storeImgs.length==0&&isGeneralizeReadonly' :readonly='true' placeholder="无">
                                    <upload :fileList='fileList' v-if='!isGeneralizeReadonly' @sonInput='generalizeUpInput' :multiple='true' arguName="storeImgs" />
                                </div>
                            </li>
                        </ul>

                    </div>
                </el-tab-pane>
                <el-tab-pane label="适用产品" name="storeDetail7">
                    <div class="btn_wrap">
                        <Button Name="编辑" @click.native="addApplyProdBtn()"></Button>
                    </div>
                    <div>
                        <el-table border :data="ApplyProdDatas" size='mini'>
                            <el-table-column width="80" prop="typeText" label="产品形态">
                            </el-table-column>
                            <el-table-column width="120" prop="prodCode" label="编号">
                            </el-table-column>
                            <el-table-column width="320" prop="prodName" label="服务名称">
                            </el-table-column>

                            <el-table-column min-width='1'>
                            </el-table-column>
                        </el-table>
                        <div class="pagingwidth">
                            <Paging :handleCurrentChange="getApplyProd" :total="ApplyProdTotal" />
                        </div>
                    </div>

                    <!--  -->
                    <transition name="el-fade-in">
                        <div class='x_model select_prod' v-show="selectProdShow">
                            <div class="model_content">
                                <header class="x_model_header clear">
                                    <div class="left">添加授权产品</div>
                                    <div class="right curor icon Fork" @click="closeModelProd"></div>
                                </header>
                                <div class="x_model_main">
                                    <div class="btn_wrap">
                                        <el-select class="mini_select" v-model='searchProdData.prodType' placeholder="请选择产品形态" size='mini'>
                                            <el-option v-for="(item,index) in prodTypeDatas" :label="item.value" :value="item.key" :key="index">
                                            </el-option>
                                        </el-select>
                                        <el-select class="mini_select" v-model='searchProdData.cateId' placeholder="请选择产品分类" size='mini'>
                                            <el-option v-for="(item,index) in cateDatas" :label="item.cateName" :value="item.id" :key="index">
                                            </el-option>
                                        </el-select>
                                        <input class="x_input" v-model='searchProdData.prodName' type="text">
                                        <Button Name="搜索" @click.native="getProdList()" />
                                    </div>
                                    <div class="transfer_wrap">
                                        <el-transfer :empty-text="['无未适用', '无已适用']" :titles="['未适用', '已适用']" v-model="isSelecctProd" :data="prodList"></el-transfer>
                                    </div>

                                </div>
                                <div class="x_model_footer">
                                    <Button Name="取消" @click.native="closeModelProd" buttonClass="None" />
                                    <Button Name="确定" @click.native="sureProdFun()" />
                                </div>
                            </div>
                        </div>
                    </transition>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>
<script>
import Vue from 'vue'
import Input from "../../common/Input";
import Upload from "../../common/upload";
import { mapMutations, mapState } from "vuex";
import { Tabs, TabPane, TimePicker, Message, Switch } from 'element-ui';
import Button from "../../common/Button";
// import BMap from 'BMap';
import Paging from "../../common/Paging";
import Collections from './Collections';
import BaiduMap from '../../../assets/baidu_map.js';
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(TimePicker);
Vue.use(Switch);
export default {
    components: {
        Collections, Button, Paging, Input, Upload
    },
    data() {
        return {
            fileList: [],
            // fileList:[{
            //     url: ' http://p3t5upnkj.bkt.clouddn.com/20180424184438147_banner_light-apply-banner.jpg?imageView2/1/w/180/h/135'
            // }, {
            //     url: 'http://p3t5upnkj.bkt.clouddn.com/2018042418443874_aa18972bd40735fa324a79d792510fb30f240821.jpg?imageView2/1/w/180/h/135'
            // }],
            logo: 'logo',
            //日期不可输入
            editable: false,


            //添加班次model
            updateSchedulingShow: false,

            //添加班次model title
            updateSchedulingTitle: '添加班次',

            //添加班次data
            updateSchedulingData: {

            },

            verifyScheduling: {
                workplcName: false,
                startTime: false,
                endTime: false,
            },

            //添加工位model
            updateStationShow: false,

            //添加工位model title
            updateStationTitle: '添加工位',

            //添加工位data
            updateStationData: {

            },

            verifyStation: {
                workplcName: false
            },


            //门店
            storeImgs1: '',

            Lines: 10,
            stationNowPage: 1,
            schedulingNowPage: 1,
            stationPageNum: "",
            schedulingPageNum: "",
            litWid: "50px",
            //班次总数
            total: 1,
            isPercent: false,

            //工位总数
            stationTotal: 1,

            //输入框宽度
            widths: "180px",

            //财务信息只读
            isFinanceReadonly: true,

            //推广信息只读
            isGeneralizeReadonly: true,

            //门店基本信息
            storeMsg: [],

            //门店财务信息
            storeFinanceMsg: {
                storeId: this.$route.query.storeId,
                sBank: "",
                sBankAcct: "",
                sBillAddr: "",
                sBillCo: "",
                sBillTel: "",
                sBillTp: "",
                sTaxRegNo: ""
            },

            //验证财务信息
            verifyFinance: {
                sBank: false,//开户行名称
                sBankAcct: '',//银行账号
                sBillAddr: false,//发票地址
                sBillCo: false,//发票公司名称
                sBillTel: false,//发票电话
                sBillTp: "",//发票税点
                sTaxRegNo: ''//税务注册号
            },

            //财务信息是否验证通过提交
            isFinanceSub: false,

            //是否 添加门店财务信息
            addStoreFinanceMsg: false,

            //是否 添加门店推广信息
            addStoreGeneralizeMsg: true,

            //工位信息
            storeStationMsgs: [],

            //备用工位信息
            preStoreStationMsgs: [],

            //班次信息
            schedulingMsgs: [],

            //门店推广信息
            generalizeMsg: {
                storeId: this.$route.query.storeId,
                storeImgs: [],
                storeIntro: "",
                storeLink: "",
                storeLogo: "",
                storeQrc: ""
            },

            //新增 修改状态
            addEditState: 1,

            //tabs  activeName
            tabActiveName: "storeDetail1",

            //门店适用产品数据
            ApplyProdDatas: [],
            ApplyProdTotal: 0,
            //所有的产品
            prodList: [],
            //m门店已有产品id
            isSelecctProd: [],
            //搜索产品
            searchProdData: {
                prodType: '',
                cateId: '',
                prodName: '',
            },
            //
            //产品形态
            prodTypeDatas: [
                {
                    key: 0,
                    value: "服务"
                },
                {
                    key: 1,
                    value: "套卡"
                }
            ],
            //产品类型
            cateDatas: [],
            //编辑产品model 显示隐藏
            selectProdShow: false,
        };
    },

    methods: {
        //验证数字整数
        keyupFun(e) {
            if (e.target.value.length == 1) {
                e.target.value = e.target.value.replace(/[^1-9]/g, '')
            } else if (e.target.value.length > 1) {
                e.target.value = e.target.value.replace(/[^0-9]/g, '')
            } else {
                e.target.value = e.target.value.replace(/\D/g, '')
            }
        },
        //keyupkeyupsTaxRegNo
        keyupsTaxRegNo(e) {
            e.target.value = e.target.value.replace(/[^\w\.\/]/ig, '')
        },
        //确定编辑门店适用产品
        sureProdFun() {
            this.$post(this.$host + "/api/prod/store/applyStore", { storeId: this.$route.query.storeId, prodIds: this.isSelecctProd }).then(d => {
                if (d.success) {
                    this.$message({
                        message: '编辑成功！',
                        type: 'success',
                    })
                    this.getApplyProd(1)
                    this.selectProdShow = false;
                }
            })
        },
        closeModelProd() {
            this.selectProdShow = false;
        },
        //编辑适用门店按钮
        addApplyProdBtn() {
            this.selectProdShow = true;
            if (this.cateDatas.length == 0) {
                this.getCateId()
            };
            if (this.prodList.length == 0) {
                this.getProdList()
            }
        },
        //获取产品类型
        getCateId() {
            this.$post(this.$host + "/api/prod/productcate/tree", {}).then(d => {
                if (d.success) {
                    this.cateDatas = d.list;
                }
            })
        },
        //获取产品
        getProdList() {
            let par = {
                storeId: this.$route.query.storeId,
                prodType: this.searchProdData.prodType || '',
                cateId: this.searchProdData.cateId || '',
                prodName: this.searchProdData.prodName || '',
            }
            this.$post(this.$host + "/api/prod/store/findProdList", par).then(d => {
                if (d.success) {
                    if (d.data.length > 0) {
                        d.data.map(el => {
                            el.key = el.prodId;
                            el.label = el.prodName;
                            if (el.isSelected == 1) {
                                this.isSelecctProd.push(el.prodId)
                            }
                        })
                    }

                    this.prodList = d.data;

                }
            });
        },
        //获取门店适用产品
        getApplyProd(index) {
            let par = {
                storeId: this.$route.query.storeId,
                pageNumber: parseInt(index),
                pageSize: 20
            }
            this.$post(this.$host + "/api/prod/store/findApplyProd", par).then(d => {
                if (d.success) {
                    if (d.data.content.length > 0) {
                        d.data.content.map(el => {
                            switch (el.prodType) {
                                case 0: el.typeText = '服务';
                                    break;
                                case 1: el.typeText = '套卡';
                                    break;
                            }
                        })
                    }
                    this.ApplyProdDatas = d.data.content;
                    this.ApplyProdTotal = d.data.total;
                }
            });
        },

        //财务验证
        verifyFinanceFun(el) {
            let tv = this.verifyFinance;
            let tn = this.storeFinanceMsg;
            let sBillTpReg = /^\d+$/g;
            let sTaxRegNoReg = /([a-zA-Z0-9]{15})|([a-zA-Z0-9]{18})/;//税务注册号
            let bankBoReg = /^([1-9]{1})(\d{14}|\d{18})$/;//银行卡号验证正则
            let num = 0;

            if (el === 'sBillTp') {
                if (!tn.sBillTp) {
                    tv.sBillTp = '必填！'
                    num++
                } else if (!sBillTpReg.test(tn.sBillTp)) {
                    tv.sBillTp = '必须为整数！'
                    num++
                } else {
                    tv.sBillTp = '';

                }
            } else if (el == 'sBankAcct') {
                if (!tn.sBankAcct) {
                    tv.sBankAcct = '必填！'
                    num++
                } else if (!bankBoReg.test(tn.sBankAcct)) {
                    tv.sBankAcct = '银行卡号不合法！'
                    num++
                } else {
                    tv.sBankAcct = '';
                }
            } else if (el == 'sTaxRegNo') {
                if (!tn.sTaxRegNo) {
                    tv.sTaxRegNo = '必填！'
                    num++
                } else if (!sTaxRegNoReg.test(tn.sTaxRegNo)) {
                    tv.sTaxRegNo = '税务号不合法！'
                    num++
                } else {
                    tv.sTaxRegNo = '';
                }
            } else {
                if (!tn[el]) {
                    tv[el] = true;
                    num++
                } else {
                    tv[el] = false;
                }
            }
            if (num > 0) {
                return false;
            } else {
                return true;
            }

        },

        //工位验证
        verifyStationFun(el) {
            let tv = this.verifyStation;
            let tn = this.updateStationData;
            !tn[el] ? tv[el] = true : tv[el] = false;
        },

        //班次验证
        verifySchedulingFun(el) {
            let tv = this.verifyScheduling;
            let tn = this.updateSchedulingData;
            !tn[el] ? tv[el] = true : tv[el] = false;
        },

        //tabClick
        tabClick(val) {
            switch (val.name) {
                case "storeDetail2": this.getFinanceMsgFun();
                    break;
                case "storeDetail3": if (this.storeStationMsgs.length == 0) { this.stationgotoPage(1) };
                    break;
                case "storeDetail4": if (this.schedulingMsgs.length == 0) { this.schedulinggotoPage(1) };
                    break;//班次信息
                case "storeDetail7": if (this.ApplyProdDatas.length == 0) { this.getApplyProd(1) }
                    break;//使用产品
            }
        },

        //财务信息 数据
        financeUpInput(value, arguName) {
            this.storeFinanceMsg[arguName] = value;
        },
        //岗位信息 数据
        stationUpInput(value, arguName) {
            this.storeStationMsgs[arguName] = value;
        },
        //班次信息 数据
        schedulingUpInput(value, arguName) {
            this.schedulingMsgs[arguName] = value;
        },

        //推广信息 数据
        generalizeUpInput(value, arguName) {
            this.generalizeMsg[arguName] = value
        },


        //跳转 班次 分页   班次列表
        schedulinggotoPage(index) {
            this.schedulingNowPage = parseInt(index);
            let data = {
                accessToken: this.$getCookie("accessToken"),
                storeId: this.$route.query.storeId,
                pageNumber: parseInt(index),
                pageSize: 20
            };
            //班次信息
            this.$post(this.$host + "/api/store/shift/query/page", data).then(d => {
                if (d.success) {
                    for (let i = 0; i < d.pageData.content.length; i++) {
                        d.pageData.content[i].isReadonly = true;
                    }
                    d.pageData.content.map(el => {
                        el.endTime = el.endTime.slice(11, 16)
                        el.startTime = el.startTime.slice(11, 16);
                        el.isReadonly = true;
                    })
                    this.schedulingMsgs = d.pageData.content;
                    this.total = d.pageData.total;
                }
            });
        },

        //跳转 工位 分页 工位列表
        stationgotoPage(index) {
            this.stationNowPage = parseInt(index);
            let data = {
                accessToken: this.$getCookie("accessToken"),
                storeId: this.$route.query.storeId,
                pageNumber: parseInt(index),
                pageSize: 20
            };
            //工位信息
            this.$post(this.$host + "/api/store/workplace/query/page", data)
                .then(d => {
                    if (d.success) {
                        d.pageData.content.map(el => {
                            el.isReadonly = true;
                            el.useStatus === 1 ? el.isChecked = true : el.isChecked = false;
                        })
                        this.storeStationMsgs = d.pageData.content;
                        this.preStoreStationMsgs = JSON.parse(JSON.stringify(d.pageData.content))
                        this.stationTotal = d.pageData.total;
                    }
                });
        },

        //添加财务信息
        addFinanceMsg() {
            //修改按钮隐藏 保存取消按钮显示
            this.isFinanceReadonly = false;
            this.isPercent = true;
            //添加按钮隐藏
            this.addStoreFinanceMsg = false;
            this.addEditState = 5;
        },

        //财务信息 取消按钮
        cancelFinanceBtn() {
            if (this.addEditState == 5) {//取消按钮功能为  取消新增财务信息
                //修改按钮隐藏 保存取消按钮显示 input边框隐藏
                this.isFinanceReadonly = true;
                this.isPercent = false;
                //添加按钮隐藏
                this.addStoreFinanceMsg = true;
                this.storeFinanceMsg = {
                    storeId: this.$route.query.storeId,
                    sBank: "",
                    sBankAcct: "",
                    sBillAddr: "",
                    sBillCo: "",
                    sBillTel: "",
                    sBillTp: "",
                    sTaxRegNo: ""
                };
                this.verifyFinance = {
                    sBank: false,//开户行名称
                    sBankAcct: '',//银行账号
                    sBillAddr: false,//发票地址
                    sBillCo: false,//发票公司名称
                    sBillTel: false,//发票电话
                    sBillTp: "",//发票税点
                    sTaxRegNo: ''//税务注册号
                };
            } else if (this.addEditState == 6) {//取消修改
                this.isFinanceReadonly = true;
                this.isPercent = true;
                this.verifyFinance = {
                    sBank: false,//开户行名称
                    sBankAcct: '',//银行账号
                    sBillAddr: false,//发票地址
                    sBillCo: false,//发票公司名称
                    sBillTel: false,//发票电话
                    sBillTp: "",//发票税点
                    sTaxRegNo: ''//税务注册号
                };
                let data = {
                    accessToken: this.$getCookie("accessToken"),
                    storeId: this.$route.query.storeId,
                    pageNumber: "",
                    pageSize: 20
                }
                //财务信息
                this.$post(this.$host + "/api/store/storefi/query/page", data)
                    .then(d => {
                        if (d.success) {
                            if (d.pageData.content.length == 0) {
                                this.addStoreFinanceMsg = true;

                            } else {
                                this.storeFinanceMsg = d.pageData.content[0];
                            }
                        }
                    });
            }
        },

        //修改财务信息
        aditFinanceMsg() {
            this.addEditState = 6;
            this.isPercent = true;
            this.isFinanceReadonly = false;
        },

        //修改推广信息
        editGeneralizeMsgBtn() {
            this.addEditState = 7;
            this.isGeneralizeReadonly = false;
        },

        //添加推广信息
        addGeneralizeMsg() {
            this.addEditState = 8;//这个时候 取消按钮为取消 新增推广信息功能
            this.isGeneralizeReadonly = false;
            this.addStoreGeneralizeMsg = false;

        },

        //验证必填
        isSubFun(ver, val) {
            let len = 0;
            for (let key in ver) {
                if (key == 'sBillTp' || key == 'sBankAcct' || key == 'sTaxRegNo') {
                    if (!this.verifyFinanceFun(key)) {
                        len++;
                    };
                } else if (val[key] === '' || val[key] === null) {
                    ver[key] = true;

                    len++;
                };
            };
            if (len > 0) {
                return false;
            } else {
                return true;
            }
        },

        //保存
        saveMsg() {
            if (this.$stop()) { return }
            if (this.addEditState === 6) {//保存  修改财务信息
                //保存 财务信息
                if (this.isSubFun(this.verifyFinance, this.storeFinanceMsg)) {
                    this.storeFinanceMsg.accessToken = this.$getCookie("accessToken");
                    this.storeFinanceMsg.storeId = this.$route.query.storeId
                    let saveFinanceMsg = this.storeFinanceMsg;
                    this.$post(this.$host + "/api/store/storefi/update", saveFinanceMsg).then(d => {
                        if (d.success) {
                            Message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.isFinanceReadonly = true;
                        }
                    });
                } else {
                    this.$message({
                        message: '有必填信息未填写或填写错误！',
                        type: 'warning',
                    })
                }
            } else if (this.addEditState === 7) {//修改 推广信息

                this.generalizeMsg.accessToken = this.$getCookie("accessToken");
                this.$post(this.$host + "/api/store/marketinfo/update", this.generalizeMsg)
                    .then(d => {
                        if (d.success) {
                            Message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.isGeneralizeReadonly = true;
                        }
                    });
            } else if (this.addEditState === 5) {//新增 财务信息
                if (this.isSubFun(this.verifyFinance, this.storeFinanceMsg)) {
                    this.storeFinanceMsg.accessToken = this.$getCookie("accessToken");
                    this.storeFinanceMsg.storeId = this.$route.query.storeId
                    this.$post(this.$host + "/api/store/storefi/add", this.storeFinanceMsg)
                        .then(d => {
                            if (d.success) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                })
                                this.getFinanceMsgFun()
                                this.isFinanceReadonly = true;
                            }
                        });
                } else {
                    this.$message({
                        message: '有必填信息未填写或填写错误！',
                        type: 'warning',
                    })
                }

            } else if (this.addEditState === 8) {//新增 推广信息
                this.$post(this.$host + "/api/store/marketinfo/add", this.generalizeMsg)
                    .then(d => {
                        if (d.success) {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            this.isGeneralizeReadonly = true;
                        }
                    });
            }
        },

        //工位信息 删除
        delStationMsg(val, index) {
            this.$messagebox.confirm('此操作将永久删除该工位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let delStationMsgParams = {
                    accessToken: this.$getCookie("accessToken"),
                    id: val
                };
                this.$post(this.$host + "/api/store/workplace/delete", delStationMsgParams)
                    .then(d => {
                        if (d.success) {
                            if (this.storeStationMsgs.length == 1 && this.stationNowPage > 1) {
                                this.stationNowPage--
                            }
                            this.stationgotoPage(this.stationNowPage);
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                        }
                    });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //工位信息 添加按钮
        addStationMsgBtn() {
            this.updateStationShow = true;
            this.updateStationData = {
                workplcName: '',
                isChecked: true,
                useStatus: ''//启用状态(0- 未启用 1-已启用)
            }
            this.updateStationTitle = '添加工位';
            this.addEditState = 1;
        },

        //关闭update工位弹框
        closeModelStation() {
            this.updateStationShow = false;
            this.updateStationData = {
                workplcName: '',
                isChecked: true,
                useStatus: ''//启用状态(0- 未启用 1-已启用)
            }
        },


        //工位信息 修改
        editStationMsg(key, val) {
            let isChecked = '';
            val.useStatus = 1 ? isChecked = true : isChecked = false;
            this.updateStationShow = true;
            this.addEditState = 2;//取消按钮为取消工位信息修改功能
            this.updateStationData = {
                id: val.id,
                workplcName: val.workplcName,
                useStatus: val.useStatus,
                isChecked: isChecked,
                storeId: val.storeId
            }
        },


        //工位信息 班次信息 新增 修改
        addMsg(key, val) {
            if (this.$stop()) { return }
            let that = this;
            if (this.addEditState == 1) { //添加 工位信息
                if (this.isSubFun(this.verifyStation, this.updateStationData)) {
                    this.updateStationData.isChecked ? this.updateStationData.useStatus = 1 : this.updateStationData.useStatus = 0;
                    let addStationMsgParams = {
                        storeId: this.$route.query.storeId,
                        workplcName: this.updateStationData.workplcName,
                        useStatus: this.updateStationData.useStatus,
                    };
                    this.$post(this.$host + "/api/store/workplace/add", addStationMsgParams)
                        .then(d => {
                            if (d.success) {
                                Message({
                                    message: '工位新增成功',
                                    type: 'success',
                                    duration: "1200",
                                    onClose: () => {
                                        that.stationgotoPage(this.stationNowPage)
                                    }
                                })
                                this.updateStationShow = false;
                            }
                        });
                } else {
                    this.$message({
                        message: '有必填信息未填写或填写错误！',
                        type: 'warning',
                    })
                }
            } else if (this.addEditState === 2) {
                if (this.isSubFun(this.verifyStation, this.updateStationData)) {
                    this.updateStationData.isChecked ? this.updateStationData.useStatus = 1 : this.updateStationData.useStatus = 0;
                    //修改工位信息
                    let par = {
                        storeId: this.updateStationData.storeId,
                        id: this.updateStationData.id,
                        workplcName: this.updateStationData.workplcName,
                        useStatus: this.updateStationData.useStatus,
                    };
                    this.$post(this.$host + "/api/store/workplace/update", par)
                        .then(d => {
                            if (d.success) {
                                Message({
                                    message: '工位修改成功',
                                    type: 'success',
                                    duration: "1200",
                                    onClose: () => {
                                        that.stationgotoPage(this.stationNowPage)
                                    }
                                })
                                this.updateStationShow = false;
                            }
                        });
                } else {
                    this.$message({
                        message: '有必填信息未填写或填写错误！',
                        type: 'warning',
                    })
                }
            } else if (this.addEditState === 3) {
                //添加 班次信息
                if (this.isSubFun(this.verifyScheduling, this.updateSchedulingData)) {
                    if (this.updateSchedulingData.startTime > this.updateSchedulingData.endTime) {
                        this.$message({
                            message: '班次开始时间不能大于班次结束时间！',
                            type: 'warning',
                        })
                    } else {
                        let data = {
                            storeId: this.$route.query.storeId,
                            storeName: this.updateSchedulingData.storeName,
                            startTime: this.$dateFormat("yy-MM-dd", new Date()) + " " + this.updateSchedulingData.startTime + ":00",
                            endTime: this.$dateFormat("yy-MM-dd", new Date()) + " " + this.updateSchedulingData.endTime + ":00"
                        };

                        this.$post(this.$host + "/api/store/shift/add", data)
                            .then(d => {
                                if (d.success) {
                                    Message({
                                        message: '班次添加成功',
                                        type: 'success',
                                        duration: "1200",
                                        onClose: () => {
                                            that.schedulinggotoPage(this.schedulingNowPage)
                                            this.updateSchedulingShow = false;
                                        }
                                    });

                                }
                            });
                    }

                } else {
                    this.$message({
                        message: '有必填信息未填写或填写错误！',
                        type: 'warning',
                    })
                }
            } else if (this.addEditState === 4) {
                if (this.isSubFun(this.verifyScheduling, this.updateSchedulingData)) {
                    //修改班次信息
                    let addMsgParams = {
                        storeId: this.$route.query.storeId,
                        id: this.updateSchedulingData.id,
                        storeNo: this.updateSchedulingData.storeNo,
                        storeName: this.updateSchedulingData.storeName,
                        startTime: this.$dateFormat("yy-MM-dd", new Date()) + " " + this.updateSchedulingData.startTime + ":00",
                        endTime: this.$dateFormat("yy-MM-dd", new Date()) + " " + this.updateSchedulingData.endTime + ":00"
                    };

                    this.$post(this.$host + "/api/store/shift/update", addMsgParams).then(d => {
                        if (d.success) {
                            Message({
                                message: '修改成功',
                                type: 'success',
                                duration: "1200",
                                onClose: () => {
                                    that.schedulinggotoPage(this.schedulingNowPage)
                                    this.updateSchedulingShow = false;
                                }
                            });

                        }
                    });
                } else {
                    this.$message({
                        message: '有必填信息未填写或填写错误！',
                        type: 'warning',
                    })
                }
            }
        },

        //取消修改 班次-工位-推广

        cancelEdit(key, val) {
            if (this.addEditState == 1) {//取消 工位信息 添加
                this.storeStationMsgs.splice(key, 1)
            } else if (this.addEditState == 2) {//取消 工位信息 修改
                this.preStoreStationMsgs.map(el => {
                    if (el.id === val.id) {
                        for (let a in el) {
                            val[a] = el[a]
                        }
                    }
                })
            } else if (this.addEditState == 4) {//取消 修改班次
                val.isReadonly = true;
                this.schedulinggotoPage(this.schedulingNowPage)
            } else if (this.addEditState == 8) {//取消 添加推广信息
                this.generalizeMsg = {
                    storeId: this.$route.query.storeId,
                    storeImgs: [],
                    storeIntro: "",
                    storeLink: "",
                    storeLogo: "",
                    storeQrc: ""
                }
                this.addStoreGeneralizeMsg = true;
                this.isGeneralizeReadonly = true;
            } else if (this.addEditState == 7) {//取消修改推广信息
                this.getGeneralize()
            }

        },

        //班次信息 删除
        delSchedulingMsg(val, index) {
            this.$messagebox.confirm('此操作将永久删除该班次, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let delStationMsgParams = {
                    accessToken: this.$getCookie("accessToken"),
                    id: val
                };
                this.$post(this.$host + "/api/store/shift/delete", delStationMsgParams).then(d => {
                    if (d.success) {
                        if (this.schedulingMsgs.length == 1 && this.schedulingNowPage > 1) {
                            this.schedulingNowPage--
                        }
                        this.schedulinggotoPage(this.schedulingNowPage)
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    }
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //关闭添加班次model
        closeModelScheduling() {
            this.updateSchedulingShow = false;
            this.updateSchedulingData = {
                storeName: "",
                startTime: "",
                endTime: "",
            };
        },
        //班次信息 添加按钮
        addSchedulingMsgBtn() {
            //添加班次model
            this.updateSchedulingShow = true;

            //添加班次model title
            this.updateSchedulingTitle = '添加班次';

            //添加班次data
            this.updateSchedulingData = {
                storeName: "",
                startTime: "",
                endTime: "",
            };
            this.verifyScheduling = {
                storeName: false,
                startTime: false,
                endTime: false,
            };
            this.addEditState = 3;
        },

        //班次信息 修改
        editSchedulingMsg(key, val) {
            this.addEditState = 4;//取消按钮 为取消修改功能
            //添加班次model
            this.updateSchedulingShow = true;

            //添加班次model title
            this.updateSchedulingTitle = '编辑班次';

            //添加班次data
            this.updateSchedulingData = {
                id: val.id,    //id参数必须
                storeId: val.storeId, //storeId参数必须
                storeName: val.storeName,
                storeNo: val.storeNo,
                startTime: val.startTime,
                endTime: val.endTime,
            };
        },

        //获取财务信息
        getFinanceMsgFun() {
            let data = {
                accessToken: this.$getCookie("accessToken"),
                storeId: this.$route.query.storeId,
                pageNumber: 1,
                pageSize: 20
            }
            //财务信息
            this.$post(this.$host + "/api/store/storefi/query/page", data)
                .then(d => {
                    if (d.success) {
                        if (d.pageData.content.length == 0) {
                            this.addStoreFinanceMsg = true;
                            this.storeFinanceMsg = {
                                // storeId: this.$route.query.storeId,
                                sBank: "",
                                sBankAcct: "",
                                sBillAddr: "",
                                sBillCo: "",
                                sBillTel: "",
                                sBillTp: "",
                                sTaxRegNo: "",
                            }
                            this.isPercent = false;
                        } else {
                            this.storeFinanceMsg = d.pageData.content[0];
                            this.isPercent = true;
                        }

                    }
                });
        },

        //获取推广信息
        getGeneralize() {
            let data = {
                storeId: this.$route.query.storeId,
            }
            // //门店推广信息
            this.$post(this.$host + "/api/store/marketinfo/query", data)
                .then(d => {
                    if (d.success) {
                        if (d.id == null) {
                            this.generalizeMsg = {
                                storeId: this.$route.query.storeId,
                                storeImgs: [],
                                storeIntro: null,
                                storeLink: null,
                                storeLogo: '',
                                storeQrc: ''
                            }
                            this.addStoreGeneralizeMsg = true;

                        } else {
                            delete d.success;
                            delete d.respCode;
                            delete d.respMsg;
                            this.generalizeMsg = d;
                            this.addStoreGeneralizeMsg = false;
                            this.isGeneralizeReadonly = true;

                            d.storeImgs.map(el => {
                                let obj = {
                                    url: el,
                                }
                                this.fileList.push(obj)
                            })
                        }
                    }
                });
        },


    },

    mounted() {

        let params = {
            id: this.$route.query.storeId,
        };
        //门店基本信息
        this.$post(this.$host + "/api/store/store/query", params)
            .then(d => {
                if (d.success) {
                    d.data.sEndDate = this.$dateFormat('yy-MM-dd', d.data.sEndDate)
                    d.data.sStartDate = this.$dateFormat('yy-MM-dd', d.data.sStartDate)
                    this.storeMsg = d.data;
                    let _that = this;
                    let arr = [];
                    let isLocation = {}
                    if (this.storeMsg.sCoor != null && this.storeMsg.sCoor != '' && this.storeMsg.sCoor != undefined) {
                        arr = this.storeMsg.sCoor.split(',')
                        isLocation.lng = arr[0]; isLocation.lat = arr[1];
                    }
                    BaiduMap.init(_that, isLocation)
                        .then((BMap) => {
                            let map = new BMap.Map("allmap");
                            let geolocation = new BMap.Geolocation();
                            let xPoint = '';
                            let yPoint = '';
                            geolocation.getCurrentPosition(function (r) {
                                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                                    let _point = {}
                                    if (isLocation.lng != null && isLocation.lng != '' && isLocation.lng != undefined) {
                                        _point = isLocation
                                    } else {
                                        _point = r.point
                                    }
                                    var marker = new BMap.Marker(_point);//创建点
                                    _that.marker = marker

                                    map.addOverlay(marker);//绘制点
                                    // map.panTo(r.point);//到 中心点
                                    xPoint = _point.lng || 116.403928;//定位x
                                    yPoint = _point.lat || 39.915024//定位y


                                    // console.log("><<<", xPoint); console.log("><<", yPoint)
                                    let point = new BMap.Point(xPoint, yPoint);//创建点实例
                                    map.centerAndZoom(point, 16);
                                } else {
                                    switch (this.getStatus()) {
                                        case 2:
                                            this.$message({
                                                message: '位置结果未知 获取位置失败！',
                                                type: 'warning',
                                            })
                                            break;
                                        case 3:
                                            this.$message({
                                                message: '导航结果未知 获取位置失败！',
                                                type: 'warning',
                                            })
                                            break;
                                        case 4:
                                            this.$message({
                                                message: '非法密钥 获取位置失败！',
                                                type: 'warning',
                                            })
                                            break;
                                        case 5:
                                            this.$message({
                                                message: '对不起,非法请求位置  获取位置失败！',
                                                type: 'warning',
                                            })
                                            break;
                                        case 6:
                                            this.$message({
                                                message: '对不起,当前 没有权限 获取位置失败！',
                                                type: 'warning',
                                            })
                                            break;
                                        case 7:
                                            this.$message({
                                                message: '对不起,服务不可用 获取位置失败！',
                                                type: 'warning',
                                            })
                                            break;
                                        case 8:
                                            this.$message({
                                                message: '对不起,请求超时 获取位置失败！',
                                                type: 'warning',
                                            })
                                            break;
                                    }
                                };

                            })

                            map.enableScrollWheelZoom(true);//鼠标滚动事件
                            // map.enableDoubleClickZoom(true);//鼠标双击事件

                        })
                }
            });


        this.getGeneralize();

    },
};
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.show_img {
    margin-right: 12px;
}
textarea:disabled,
textarea[disabled],
input[disabled],
input:disabled {
    background-color: #fff;
}
.select_prod .model_content {
    width: 532px;
}
.mini_select {
    width: 120px;
}
.select_prod .btn_wrap {
    margin-bottom: 12px;
}
.s_billTp {
    width: 36px;
    vertical-align: initial;
}

.update_station_model .model_content {
    width: 400px;
}
.update_station_model li {
    margin: 24px 0;
}
.update_station_model li span {
    display: inline-block;
    width: 100px;
    text-align: right;
}
.btn_wrap {
    margin-bottom: 12px;
}

.store_detail td input {
    text-align: center;
    height: 22px;
    vertical-align: middle;
}
.edit_input input {
    text-align: left;
    padding: 0 0.666667rem;
}

.finance_msg textarea,
.finance_msg input {
    border: 1px solid transparent;
}

.finance_msg textarea:focus,
.finance_msg input:focus {
    border: 1px solid transparent;
}
td:nth-child(3) input {
    width: 4.166667rem;
}
</style>
<style>
.store_detail .el-tabs__header {
    margin-bottom: 0;
}
.store_detail .el-tabs__content {
    border-top: 0;
    padding-top: 12px;
    padding-bottom: 40px;
}
.store_detail .el-upload__input {
    display: initial;
}
</style>


