<template>
    <div class="right_content_wrap">
        <div class="right_content">
            <div class='update_sysparas update_content'>
                <div class='add_header'>
                    <i class="icon x_iconsign"></i>
                    价格规则编辑
                </div>
                <ul class="update_sysparas_content">
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>券类型：</div>
                        <div class="update_main">
                            <el-radio-group @change='couponStatusChange' v-model="addDatas.cpType">
                                <el-radio label="0">兑换券</el-radio>
                                <el-radio label="2">代金券</el-radio>
                                <el-radio label="1">折扣券</el-radio>
                            </el-radio-group>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            券名称：</div>
                        <div class="update_main">
                            <input @keyup="keyUpSpecial" v-model='addDatas.cpName' class="x_input" :placeholder="couponStatusPlaceholder" type="text">
                            <span class="x_error" v-if='verify.cpName'>必填！</span>
                        </div>
                    </li>
                    <li v-if='addDatas.cpType==0'>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            兑换次数：</div>
                        <div class="update_main">
                            <input @keyup="keyupFun" v-model='addDatas.cpExTimes' class="x_input" placeholder="请填写1-99之间数字" maxlength="2" type="text">次
                            <span class="x_error" v-if='verify.cpExTimes'>必填！</span>
                        </div>
                    </li>
                    <li v-if='addDatas.cpType==2'>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            卷面金额：</div>
                        <div class="update_main">
                            <input @keyup="keyUp" v-model='addDatas.cpValue' class="x_input" placeholder="￥0.00" maxlength="10" type="text">元
                            <span class="x_error" v-if='verify.cpValue'>必填！</span>
                        </div>
                    </li>

                    <li v-if='addDatas.cpType==1'>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            折扣比例：</div>
                        <div class="update_main">
                            <input @keyup="keyupFun" v-model='addDatas.cpDiscRatio' class="x_input" placeholder="请填写1-99之间数字" maxlength="2" type="text">%
                            <span class="x_error" v-if='verify.cpDiscRatio'>必填！</span>
                        </div>
                    </li>

                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            <span v-show='addDatas.cpType==0'>兑换说明：</span>
                            <span v-show='addDatas.cpType==2'>优惠说明：</span>
                            <span v-show='addDatas.cpType==1'>折扣说明：</span>
                        </div>
                        <div class="update_main">
                            <textarea @keyup="keyUpSpecial" v-model="addDatas.cpExRemark" name="" id="" cols="40" rows="2" placeholder="请输入内容"></textarea>
                            <span class="x_error" v-if='verify.cpExRemark'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            卷封画面：</div>
                        <div class="update_main">
                            <upload :url='addDatas.cpImg' @sonInput='sonInput' arguName="cpImg" />
                            <span class="x_error" v-if='verify.cpImg'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            卷有效期：</div>
                        <div class="update_main">
                            <el-select v-model='addDatas.cpValidType' placeholder="请选择">
                                <el-option v-for="item in couponIndateStatus" :key="item.key" :label="item.value" :value="item.key">
                                </el-option>
                            </el-select>
                            <div style="display:inline-block" v-if="addDatas.cpValidType=='2'">
                                领取后 <input v-model='addDatas.cpEffectDays' type="text" @keyup="keyupFun">天生效，有效期 <input @keyup="keyupFun" v-model='addDatas.cpValidDays' type="text">天
                            </div>
                            <div style="display:inline-block" v-show="addDatas.cpValidType=='1'">
                                <el-date-picker value-format='yyyy-MM-dd' v-model='addDatas.cpValidStart' :picker-options="pickerOptions" type="daterange" size='mini' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                                <!-- <el-date-picker v-model='search.startTime' picker-options="pickerOptions" type="daterange" size='mini' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker> -->
                            </div>
                            <div style="display:inline-block" v-if="addDatas.cpValidType=='3'">
                                领取后
                                <el-select v-model='addDatas.cpStartTime' placeholder="请选择">
                                    <el-option v-for="item in nowNextStatus" :key="item.key" :label="item.value" :value="item.key">
                                    </el-option>
                                </el-select>
                                <el-select v-model='addDatas.cpEndTime' placeholder="请选择">
                                    <el-option v-for="item in dayWeekMonth" :key="item.key" :label="item.value" :value="item.key">
                                    </el-option>
                                </el-select>
                                结束前有效
                            </div>
                            <span class="x_error" v-if='verify.cpValidType'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            是否自定义券码：</div>
                        <div class="update_main">
                            <el-radio v-model="addDatas.cpDefCode" label="0">否，由系统后台随机分配</el-radio>
                            <el-radio v-model="addDatas.cpDefCode" label="1">是，按商户自定义规则生成</el-radio>
                        </div>
                    </li>
                    <!-- <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            核销方式：</div>
                        <div class="update_main">
                            <el-radio v-model="couponStatus" label="1">商家门店核销（数字券码/二维码/条形码）</el-radio>
                            <el-radio v-model="couponStatus" label="2">客户在线核销</el-radio>
                        </div>
                    </li> -->
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            库存量：</div>
                        <div class="update_main">
                            <input :readonly='isReadonly' @keyup="keyupFun" v-model='addDatas.cpTotalNum' placeholder="最多可填9999999张" maxlength="7" type="text">张
                            <span class="x_error" v-if='verify.cpTotalNum'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            每人限领：</div>
                        <div class="update_main">
                            <input @keyup="keyupFun" v-model='addDatas.cpLimitPices' type="text">张
                            <span class="x_error" v-if='verify.cpLimitPices'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            付费类型：</div>
                        <div class="update_main">
                            <el-radio-group v-model='addDatas.cpPayType'>
                                <ul class="x_ul">
                                    <li>
                                        <el-radio label="1">免费</el-radio>
                                    </li>
                                    <li>
                                        <el-radio label="3">积分兑换 <input v-model="cpPayAmount1" @keyup="keyupFun" type="text">分可兑</el-radio>
                                    </li>
                                    <li>
                                        <el-radio label="2">付费购买 <input @keyup="keyUp" v-model="cpPayAmount2" type="text">元可购</el-radio>
                                    </li>
                                    <li>
                                        <el-radio label="4">第三方团购 <input @keyup="keyUp" v-model="cpPayAmount3" type="text">元，其中手续费 <input v-model="addDatas.cpGroupFee" type="text">元</el-radio>
                                    </li>
                                </ul>
                            </el-radio-group>
                            <span class="x_error" v-if='verify.cpPayType'>必填！</span>
                        </div>
                    </li>

                    <!-- <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            卷合作商家：</div>
                        <div class="update_main">
                            <input type="text">
                        </div>
                    </li> -->
                </ul>
                <!--  -->
                <div class='add_header'>
                    <i class="icon x_iconsign"></i>
                    使用条件
                </div>
                <ul class="update_sysparas_content">
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>适用产品：</div>
                        <div class="update_main">
                            <el-radio label="1" v-model="prodListRadio">全部产品</el-radio>
                            <el-radio label="2" v-model="prodListRadio">
                                指定产品：
                                <!-- <input type="text" readonly placeholder="点击选择适用产品" class="x_input cursor" @click="productShowFun"> -->
                                <Button :iconadd="true" small="Btn small" Name="点击选择适用产品" @click.native.stop="productShowFun"></Button>
                            </el-radio>
                            <ul class="clearfix tag_wrap">
                                <li v-for='(item,key) in addDatas.prodList' :key="key" class="x_tags">
                                    {{item.name}}
                                </li>
                            </ul>
                            <span class="x_error" v-if='verify.prodList'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>适用门槛：
                        </div>
                        <div class="update_main">
                            <el-radio v-model="addDatas.cpLimit" label="0">无限制</el-radio>
                            <el-radio v-model="addDatas.cpLimit" label="1">满 <input @keyup="keyUp" type="text" v-model='cpLimitVal'>元可用</el-radio>
                            <span class="x_error" v-if='verify.cpLimit'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>适用门店：</div>
                        <div class="update_main">
                            <el-radio label="1" v-model="storeListRadio">全部门店</el-radio>
                            <el-radio label="2" v-model="storeListRadio">
                                指定门店：
                                <!-- <input type="text" readonly placeholder="点击选择适用门店" class="x_input cursor" @click="storeShowFun"> -->
                                <Button :iconadd="true" small="Btn small" Name="点击选择适用门店" @click.native.stop="storeShowFun"></Button>
                            </el-radio>
                            <ul class="clearfix tag_wrap">
                                <li v-for='(item,key) in addDatas.storeList' :key="key" class="x_tags">
                                    {{item.sShortName}}
                                </li>
                            </ul>
                            <span class="x_error" v-if='verify.storeList'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>操作提示：</div>
                        <div class="update_main">
                            <input type="text" @keyup="keyUpSpecial" class="x_input" v-model='addDatas.cpOpTips'>
                            <span class="x_error" v-if='verify.cpOpTips'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>使用须知：
                        </div>
                        <div class="update_main">
                            <textarea @keyup="keyUpSpecial" v-model="addDatas.cpRemark" name="" id="" cols="40" rows="2" placeholder="请输入内容"></textarea>
                            <span class="x_error" v-if='verify.cpRemark'>必填！</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>优惠同享：</div>
                        <div class="update_main">
                            <el-checkbox v-model="addDatas.cpShare">不与其他优惠同享</el-checkbox>

                        </div>
                    </li>
                </ul>
                <!-- <div class='add_header'>
                    <i class="icon x_iconsign"></i>
                    卡券同步
                </div>
                <ul class="update_sysparas_content">
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>微信同步：</div>
                        <div class="update_main">
                            <el-checkbox>已绑定微信公众号可用，勾选后，券可同步至微信-卡包</el-checkbox>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>同步详情：</div>
                        <div class="update_main">
                            <el-switch active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                        </div>
                    </li>
                </ul> -->
            </div>
        </div>
        <div class="btn_wrap ">
            <Button Name="取消 " buttonClass='None' @click.stop.native="history.back(-1) "></Button>
            <Button Name="提交 " :plain="true " @click.stop.native="submit() "></Button>
        </div>
        <!--  -->
        <!-- 产品 start -->
        <transition name="el-fade-in">
            <div class='x_model select_product' v-show='selectProductShow'>
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">添加授权产品</div>
                        <div class="right curor icon Fork" @click="selectProductShow=!selectProductShow"></div>
                    </header>
                    <div class="x_model_main select_prod">
                        <div class="search_wrap">
                            <ul>
                                <li>
                                    产品名称/编号：
                                    <input type="text" v-model='searchProduct.prodKey' class="x_input" placeholder="产品名称/编号">
                                </li>
                                <li>
                                    产品分类：
                                    <ProductTag @sonProductSelect="upProductSelect" />
                                </li>
                                <li>
                                    产品形态：
                                    <el-select v-model='searchProduct.prodClass' placeholder="请选择">
                                        <el-option v-for="item in productStatus" :key="item.key" :label="item.value" :value="item.key">
                                        </el-option>
                                    </el-select>
                                </li>
                                <li>
                                    <Button Name="搜索" @click.native="getProduct(1)" />
                                </li>
                            </ul>
                        </div>
                        <div class="transfer_wrap">
                            <el-table border :data="productData" size='mini' @selection-change="selectDatasFun" ref="proRef" :row-key="getRowKeys">
                                <el-table-column type="selection" :reserve-selection="true">
                                </el-table-column>
                                <el-table-column width="120" prop="prodCode" label="产品编号">
                                </el-table-column>
                                <el-table-column prop="name" label="产品名称">
                                </el-table-column>
                                <el-table-column width="100" prop="price" label="标准定价">
                                    <template slot-scope="scope">
                                        ￥{{scope.row.price}}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <Paging :handleCurrentChange="getProduct" :total="productTotal" :pageSize='10' />
                        </div>

                    </div>

                    <ul class="clearfix tag_wrap">
                        <li v-for='(item,key) in addDatas.prodList' :key="key" class="x_tags">
                            {{item.name}}
                            <i class="icon icon_chahao" @click="delSelProduct(addDatas.prodList,key)"></i>
                        </li>
                    </ul>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="selectProductShow=!selectProductShow" buttonClass="None" />
                        <Button Name="确定" @click.native="selectProductShow=!selectProductShow" />
                    </div>
                </div>
            </div>
        </transition>
        <!-- 产品 end -->
        <!-- 门店 start -->
        <transition name="el-fade-in">
            <div class='x_model select_store' v-show='selectStoreShow'>
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">添加适用门店</div>
                        <div class="right curor icon Fork" @click="closeStoreModel"></div>
                    </header>
                    <div class="x_model_main select_prod">
                        <div class="search_wrap">
                            <ul>
                                <li>
                                    门店名称：
                                    <input v-model="queryStoreMsg.sName" type="text" class="x_input"></li>
                                <li>
                                    地区：
                                    <getArea @getAreaCode='getAreaCode' /> </li>
                                <li>
                                    所属部门：
                                    <getCorpStore @getCorpStore="getCorpStore" :values="cCodesArr" />
                                </li>
                                <li>
                                    <Button Name="搜索" @click.native="gotoStorePage(1)" />
                                </li>
                            </ul>
                        </div>
                        <div class="transfer_wrap">
                            <el-table border :data="storeDatas" size='mini' @selection-change="selectStoreFun" ref="storeRef" :row-key="getStoreKeys">
                                <el-table-column type="selection" :reserve-selection="true">
                                </el-table-column>
                                <el-table-column width="120" prop="sCode" label="门店编号">
                                </el-table-column>
                                <el-table-column prop="sShortName" label="门店简称">
                                </el-table-column>
                            </el-table>
                            <Paging :handleCurrentChange="gotoStorePage" :total="storeTotal" :pageSize='10' />
                        </div>
                    </div>

                    <ul class="clearfix tag_wrap">
                        <li v-for='(item,key) in addDatas.storeList' :key="key" class="x_tags">
                            {{item.sShortName}}
                            <i class="icon icon_chahao" @click="delSelProduct(addDatas.storeList,key)"></i>
                        </li>
                    </ul>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeStoreModel" buttonClass="None" />
                        <Button Name="确定" @click.native="closeStoreModel" />
                    </div>
                </div>
            </div>
        </transition>
        <!--门店 end -->
    </div>
</template>
<script>
import Upload from "../../common/upload";
import Paging from "@/components/common/Paging";
import Axios from "axios";
import Button from "@/components/common/Button";
export default {
    components: {
        Upload, ProductTag: resolve => { require(['../../common/ProductTag'], resolve) }, Button, Paging, getArea: resolve => { require(['@/components/common/getArea'], resolve) }, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) }
    },
    data() {
        return {
            couponStatus: 1,
            couponIndate: 0,
            //券有效期选项
            couponIndateStatus: [{
                key: '2',
                value: '相对时间'
            }, {
                key: '1',
                value: '绝对时间'
            }, {
                key: '3',
                value: '统一截止时间'
            }],
            //券有效期 绝对时间 时间组件 限制
            pickerOptions: {
                disabledDate(time) {
                    const date = new Date();
                    return time.getTime() < date - 3600 * 1000 * 24 * 1;
                },
            },
            //当次
            nowNextStatus: [{
                key: '1',
                value: '当'
            },
            {
                key: '2',
                value: '次'
            },],
            //日周月
            dayWeekMonth: [
                {
                    key: '1',
                    value: '日'
                },
                {
                    key: '2',
                    value: '周'
                },
                {
                    key: '3',
                    value: '月'
                },
            ],
            //门店信息
            storeDatas: [],
            //门店总数
            storeTotal: 0,
            //所属部门code
            cCodesArr: [],
            //搜索门店
            queryStoreMsg: {
                sName: '', //门店名称
                sDistrictCode: '', //所在地区
                cCode: this.$getCookie("dept"),//所属部门
            },
            //适用的门店
            isSelecctProd: [],
            //选门店model 显示隐藏
            selectStoreShow: false,
            //添加 优惠券数据
            addDatas: {
                cpType: '0',//优惠券类型 0 兑换券,1. 折扣券 2. 代金券,
                cpName: '',//优惠券名称,
                cpExTimes: '',//兑换次数,
                cpExRemark: '',//兑换说明、优惠说明、折扣说明,
                cpImg: '',//封面图片URL,
                cpDiscRatio: '',//折扣比例（折扣券的时候存在的参数）,
                cpValue: '',//面值（代金券的时候存在的参数）,
                cpLimit: '0',//使用门槛 0-无门槛 >0 金额限制,
                cpPayType: '1',//付费类型 1-免费 2-付费 3-积分  4.第三方团购,
                // cpPart: '',//合作方,
                cpPayAmount: '',//付费数,
                cpGroupFee: '',//团购手续费,
                cpTotalNum: '',//发行总量,
                cpLimitPices: '',//每人限领,
                cpValidType: '1',//有效期类型 1-绝对时间 2-相对时间 3-统一截止日期,
                cpEndTime: '3',//特定截止时间 第一个字符:1-当/2-次 第二个字符: 1-月/2-周/3-日,
                cpStartTime: '1',
                cpValidStart: '',//有效期开始日期
                cpValidEnd: '',//有效期截止日期
                cpValidDays: '',//有效天数,
                cpEffectDays: '',//领取后几天生效,
                cpRemark: '',//使用须知,
                cpOpTips: '',//操作提示,
                cpShare: '',//是否叠加使用 0-否 1-是,
                cpDefCode: '0',//是否自定义券码 0-否 1-是,
                // cpChannel: '',// 投放渠道   1 新美大 ,
                prodList: [
                    //     {
                    //     prodNo: '',//产品编号,
                    //     psName: '',//产品名称
                    // }
                ],
                storeList: [
                    //     {
                    //     storeNo: '',//门店编号,
                    //     sName: '',//门店名称
                    // }
                ]
            },
            //验证
            verify: {
                cpName: false,//优惠券名称,
                cpExTimes: false,//兑换次数,
                cpExRemark: false,//兑换说明、优惠说明、折扣说明,
                cpImg: false,//封面图片URL,
                cpValidType: false,//有效期类型 
                cpTotalNum: false,//发行总量,
                cpValue: false,//面值（代金券的时候存在的参数）,
                cpDiscRatio: false,//折扣比例（折扣券的时候存在的参数）,
                cpLimitPices: false,//每人限领,
                cpPayType: false,//付费类型 1-免费 2-付费 3-积分  4.第三方团购,
                prodList: false,//适用产品
                storeList: false,//适用门店
                cpLimit: false,//使用门槛 0-无门槛 >0 金额限制,
                cpOpTips: false,//操作提示,
                cpEffectDays: false,//领取后几天生效,
                cpValidDays: false,//有效天数,

            },
            //券类型选择 placehodler
            couponStatusPlaceholder: '如：XX护理1次兑换券，不超过20字',

            //付费类型 付费数
            cpPayAmount1: '',
            cpPayAmount2: '',
            cpPayAmount3: '',

            //使用产品数据
            productData: [],
            //产品总数
            productTotal: 0,
            //产品分类

            //产品形态
            productStatus: [
                {
                    key: '0',
                    value: '服务'
                },
                {
                    key: '1',
                    value: '套卡'
                },],

            //产品选择
            searchProduct: {
                prodKey: '',//产品编号/名称
                cateId: '',//产品分类id
                prodClass: '',//产品分类（0-服务，1-套卡）
            },
            //选择产品modelshow
            selectProductShow: false,
            //指定产品 radio
            prodListRadio: '2',

            //适用门店 radio
            storeListRadio: '2',
            //适用门槛 val
            cpLimitVal: '',

            //是否是编辑
            isEdit: false,

            //编辑已选门店
            selStore: [],

            //编辑已选服务
            selProduct: [],
            obj: '',
            //是否自定义
            isReadonly: false,

        }
    },
    watch: {
        "addDatas.cpDefCode": function (val) {
            switch (val) {
                case '0':
                    this.isReadonly = false;
                    this.addDatas.cpTotalNum = '';
                    break;
                case '1':
                    this.isReadonly = true;
                    this.addDatas.cpTotalNum = 0;
                    break;
            }

        },

    },

    methods: {
        //key up  验证特殊字符
        keyUpSpecial(e) {
            let IllegalString = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘’";
            let textboxvalue = e.target.value;
            let index = textboxvalue.length - 1;
            let s = e.target.value.charAt(index);
            if (IllegalString.indexOf(s) >= 0) {
                e.target.value = e.target.value.substring(0, index);
            }
        },
        //删除已选的产品
        delSelProduct(val, key) {
            val.splice(key, 1)
        },
        //选门店按钮
        storeShowFun() {
            if (this.storeDatas.length == 0) {
                this.gotoStorePage(1)
            }
            this.selectStoreShow = true;

        },
        //选产品按钮
        productShowFun() {
            if (this.productData.length == 0) {
                this.getProduct(1)
            }
            this.selectProductShow = true;

        },
        //提交
        submit() {
            let isSubmit = true;

            this.obj = JSON.parse(JSON.stringify(this.addDatas))
            //券类型 验证及赋值
            switch (this.obj.cpType) {
                case '0':
                    delete this.obj.cpValue;
                    delete this.obj.cpDiscRatio;
                    if (!this.obj.cpExTimes) {
                        this.verify.cpExTimes = true;
                        isSubmit = false;
                    }
                    break;
                case '2':
                    delete this.obj.cpExTimes;
                    delete this.obj.cpDiscRatio;
                    if (!this.obj.cpValue) {
                        this.verify.cpValue = true;
                        isSubmit = false;
                    }
                    break;
                case '1':
                    delete this.obj.cpExTimes;
                    delete this.obj.cpValue;
                    if (!this.obj.cpDiscRatio) {
                        this.verify.cpDiscRatio = true;
                        isSubmit = false;
                    }
                    break;
            }
            //图片
            if (!this.obj.cpImg) {
                this.verify.cpImg = true;
                isSubmit = false;
            }
            //券有效期 卷有效期 赋值及验证
            switch (this.obj.cpValidType) {
                case '2':
                    delete this.obj.cpValidStart;
                    delete this.obj.cpValidEnd;
                    delete this.obj.cpEndTime;
                    delete this.obj.cpStartTime;
                    if (!this.obj.cpEffectDays || !this.obj.cpValidDays) {
                        this.verify.cpValidType = true;
                        isSubmit = false;
                    }

                    break;
                case '1':
                    delete this.obj.cpValidDays;
                    delete this.obj.cpEffectDays;
                    delete this.obj.cpEndTime;
                    delete this.obj.cpStartTime;
                    if (this.obj.cpValidStart) {
                        this.obj.cpValidEnd = this.obj.cpValidStart[1]
                        this.obj.cpValidStart = this.obj.cpValidStart[0]
                        if (!this.obj.cpValidEnd || !this.obj.cpValidStart) {
                            this.verify.cpValidType = true;
                            isSubmit = false;
                        }
                    } else {
                        this.verify.cpValidType = true;
                        isSubmit = false;
                    }

                    break;
                case '3':
                    if (!this.obj.cpStartTime || !this.obj.cpEndTime) {
                        this.verify.cpValidType = true;
                        isSubmit = false;
                    } else {
                        this.obj.cpEndTime = this.obj.cpStartTime + this.obj.cpEndTime;
                        delete this.obj.cpValidDays;
                        delete this.obj.cpEffectDays;
                        delete this.obj.cpStartTime;
                        delete this.obj.cpValidStart;
                        delete this.obj.cpValidEnd;
                    }
                    break;
            };
            //库存量
            if (!this.obj.cpTotalNum) {
                this.verify.cpTotalNum = true;
                isSubmit = false;
            }
            //每人限领
            if (!this.obj.cpLimitPices) {
                this.verify.cpLimitPices = true;
                isSubmit = false;
            };
            //付费类型
            switch (this.obj.cpPayType) {
                case '1':
                    delete this.obj.cpGroupFee;
                    delete this.obj.cpPayAmount;
                    break;
                case '3':
                    if (this.cpPayAmount1) {
                        this.obj.cpPayAmount = this.cpPayAmount1
                    } else {
                        this.verify.cpPayType = true;
                        isSubmit = false;
                    }
                    delete this.obj.cpGroupFee
                    break;
                case '2':
                    if (this.cpPayAmount2) {
                        this.obj.cpPayAmount = this.cpPayAmount2
                    } else {
                        this.verify.cpPayType = true;
                        isSubmit = false;
                    }
                    delete this.obj.cpGroupFee
                    break;
                case '4':
                    if (!this.cpPayAmount3 || !this.obj.cpGroupFee) {
                        this.verify.cpPayType = true;
                        isSubmit = false;
                    } else {
                        this.obj.cpPayAmount = this.cpPayAmount3
                    }
                    break;
            };
            //适用产品
            switch (this.prodListRadio) {
                case '1':
                    this.obj.prodList = [];
                    // this.getProduct(1, 10000, this.obj.prodList)
                    break;
                case '2':
                    if (this.obj.prodList.length == 0) {
                        this.verify.prodList = true;
                        isSubmit = false;
                    } else {
                        let arr = []
                        this.obj.prodList.map(el => {
                            let newObj = {
                                prodNo: el.prodCode,//产品编号,
                                psName: el.name,//产品名称
                            };
                            arr.push(newObj);
                        })
                        this.obj.prodList = arr;
                    }
                    break;
            };
            //适用门店
            switch (this.storeListRadio) {
                case '1':
                    this.obj.storeList = [];
                    // this.gotoStorePage(1, 10000, this.obj.storeList)
                    break;
                case '2':
                    if (this.obj.storeList.length == 0) {
                        this.verify.storeList = true;
                        isSubmit = false;
                    } else {
                        let arr = []
                        this.obj.storeList.map(el => {
                            let newObj = {
                                storeNo: el.sCode,//门店编号,
                                sName: el.sShortName,//门店名称
                            };
                            arr.push(newObj);
                        })
                        this.obj.storeList = arr;
                    }
                    break;
            };
            //使用门槛
            switch (this.obj.cpLimit) {

                case '2':
                    if (!this.cpLimitVal) {
                        this.verify.cpLimit = true;
                        isSubmit = false;
                    } else {
                        this.obj.cpLimit = this.cpLimitVal;
                    }
                    break;
            };
            //操作提示
            if (!this.obj.cpOpTips) {
                this.verify.cpOpTips = true;
                isSubmit = false;
            };
            //使用须知
            if (!this.obj.cpRemark) {
                this.verify.cpRemark = true;
                isSubmit = false;
            }
            this.obj.cpShare = this.obj.cpShare ? 1 : 0
            if (isSubmit) {
                let url = this.isEdit ? "/api/mkt/coupon/modifyCoupon" : "/api/mkt/coupon/saveMktCoupon";
                let msg = this.isEdit ? '编辑成功！' : '添加成功！'
                Axios.all([this.gotoStorePage(1, 1000, this.obj.storeList), this.getProduct(1, 1000, this.obj.prodList)])
                    .then(Axios.spread(() => {
                        this.$post(this.$host + url, this.obj)
                            .then(d => {
                                if (d.success) {
                                    this.$message({
                                        type: "success",
                                        message: msg,
                                        duration: "1000",
                                        onClose: () => {
                                            history.go(-1);
                                        }
                                    });
                                }
                            })
                    }));

            } else {
                this.$message({
                    type: "warning",
                    message: "信息填写不完整！"
                });
            }
        },
        //适用产品
        selectDatasFun(val) {
            this.addDatas.prodList = val;
        },
        //适用产品
        getRowKeys(row) {
            return row.prodCode;
        },
        //适用门店
        getStoreKeys(row) {
            return row.sCode;
        },
        //适用门店
        selectStoreFun(val) {
            this.addDatas.storeList = val;
        },
        //产品分类
        upProductSelect(id) {
            this.searchProduct.cateId = id;
        },

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
        keyUp(value) {
            value.target.value = value.target.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
            value.target.value = value.target.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
            value.target.value = value.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            value.target.value = value.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
            if (value.target.value.indexOf(".") < 0 && value.target.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
                value.target.value = parseFloat(value.target.value);
            }
        },
        //图片
        sonInput(value, arguName) {
            this.addDatas[arguName] = value;
        },

        //选择券类型 类型发生变化
        couponStatusChange() {
            switch (this.addDatas.cpType) {
                case '0':
                    this.couponStatusPlaceholder = '如：XX护理1次兑换券，不超过20字';
                    break;
                case '1':
                    this.couponStatusPlaceholder = '如：XX护理XX元代金券，不超过20字';
                    break;
                case '2':
                    this.couponStatusPlaceholder = '如：XX护理8折券，不超过20字';
                    break;
            }
        },

        //获取所选部门
        getCorpStore(value) {
            this.queryStoreMsg.cCode = value[value.length - 1];
        },
        //获取地区aCode
        getAreaCode(val) {
            this.queryStoreMsg.sDistrictCode = val;
        },
        //获取门店信息
        gotoStorePage(index, total, newData) {
            let data = {
                pageNumber: parseInt(index),
                pageSize: total || 10
            }
            if (!total) {
                for (var key in this.queryStoreMsg) {
                    if (this.queryStoreMsg[key] != null) {
                        data[key] = this.queryStoreMsg[key];
                    }
                }
            }

            //获取门店信息
            return this.$post(this.$host + "/api/store/store/query/page", data)
                .then(d => {
                    if (d.success) {
                        this.storeDatas = d.pageData.content;
                        this.storeTotal = d.pageData.total;
                        if (total) {
                            this.storeDatas.map(el => {
                                let obj = {
                                    storeNo: el.sCode,//门店编号,
                                    sName: el.sShortName,//门店名称
                                };
                                if (newData) {
                                    console.log(newData)
                                    this.obj.storeList.push(obj);
                                }
                            })
                            return this.obj.storeList
                        }
                    }
                });

        },
        //关闭门店model
        closeStoreModel() {
            this.selectStoreShow = !this.selectStoreShow
        },
        //获取服务
        getProduct(val, total, newData) {
            let _data = {
                pageNumber: parseInt(val),
                pageSize: total || 10,
                prodKey: this.searchProduct.prodKey || undefined,//产品编号/名称
                cateId: this.searchProduct.cateId || undefined,//产品分类id
                prodClass: this.searchProduct.prodClass || undefined,//产品分类（0-服务，1-套卡）
            }

            return this.$post(this.$host + '/api/prod/prtserv/findAllProd', _data).then(d => {
                if (d.success) {
                    this.productData = d.data.content;
                    this.productTotal = d.data.total;
                    if (total) {
                        this.productData.map(el => {
                            let obj = {
                                prodNo: el.prodCode,//产品编号,
                                psName: el.name,//产品名称
                            };
                            if (newData) {
                                return this.obj.prodList.push(obj);
                            }

                        })
                    }
                }
            })
        }
    },
    mounted() {

        if (this.$route.query.type == '_edit') {
            this.isEdit = true;
            this.$post(this.$host + '/api/mkt/coupon/queryCouponInfo', { id: this.$route.query.id }).then(d => {
                if (d.success) {

                    //产品
                    if (d.data.prodList.length > 0) {
                        let arr = [];
                        d.data.prodList.map(el => {
                            let obj = {
                                prodCode: el.prodNo,
                                name: el.psName,
                                isSelect: true,
                            }
                            this.$refs.proRef.toggleRowSelection(obj);
                            arr.push(obj)
                        })
                        d.data.prodList = this.selProduct = arr
                    }
                    //门店
                    if (d.data.storeList.length > 0) {
                        let arr = [];
                        d.data.storeList.map(el => {
                            let obj = {
                                sCode: el.storeNo,
                                sShortName: el.sName,
                                isSelect: true,
                            }
                            this.$refs.storeRef.toggleRowSelection(obj);
                            arr.push(obj)
                        })
                        d.data.storeList = this.selStore = arr
                    }
                    for (let key in d.data) {
                        if (typeof (d.data[key]) != 'object') {
                            d.data[key] = d.data[key] + ''
                        }
                    }
                    d.data.cpValidStart = [d.data.cpValidStart, d.data.cpValidEnd]

                    this.addDatas = d.data;

                }
            })
        }
        // this.gotoStorePage(1);
        // this.getProduct(1)

    },
}
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.x_ul li{
    margin: 6px 0;
}
.select_store .btn_wrap {
    margin-bottom: 12px;
}
.btn_wrap {
    text-align: center;
    margin: 24px;
}
.select_store .model_content,
.select_product .model_content {
    width: 600px;
}
.icon_wenhao::after {
    content: "\e671";
}
.icon_chahao::after {
    content: "\e61a";
}
.tag_wrap {
    max-height: 80px;
    overflow: auto;
}
.x_tags {
    position: relative;
    padding: 0 20px;
    margin-top: 2px;
    margin-bottom: 2px;
}
.x_tags:hover .icon_chahao {
    opacity: 1;
    transition: all 0.2s;
}
.icon_chahao {
    position: absolute;
    top: 54%;
    transform: translateY(-50%);
    right: 6px;
    opacity: 0;
}
</style>

