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
                            券类型：</div>
                        <div class="update_main">
                            {{datas.cpTypeText}}

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">

                            券名称：</div>
                        <div class="update_main">
                            {{datas.cpName}}

                        </div>
                    </li>
                    <li v-if='datas.cpType==0'>
                        <div class="update_tit">

                            兑换次数：</div>
                        <div class="update_main">
                            {{datas.cpExTimes}}次

                        </div>
                    </li>
                    <li v-if='datas.cpType==2'>
                        <div class="update_tit">

                            卷面金额：</div>
                        <div class="update_main">
                            {{datas.cpValue}}元

                        </div>
                    </li>

                    <li v-if='datas.cpType==1'>
                        <div class="update_tit">

                            折扣比例：</div>
                        <div class="update_main">
                            {{datas.cpDiscRatio}}折
                        </div>
                    </li>

                    <li>
                        <div class="update_tit">

                            <span v-show='datas.cpType==0'>兑换说明：</span>
                            <span v-show='datas.cpType==2'>优惠说明：</span>
                            <span v-show='datas.cpType==1'>折扣说明：</span>
                        </div>
                        <div class="update_main">
                            {{datas.cpExRemark}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">

                            卷封画面：</div>
                        <div class="update_main">
                            <img :src="datas.cpImg" alt="">
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            卷有效期：</div>
                        <div class="update_main">
                            <p>{{datas.cpValidTypeText}}</p>

                            <div v-if="datas.cpValidType=='2'">
                                领取后 {{datas.cpEffectDays}}天生效，有效期 {{datas.cpValidDays}}天
                            </div>
                            <div v-show="datas.cpValidType=='1'">
                                {{datas.cpValidStart}}至{{datas.cpValidEnd}}
                                <p>只可修改结束日期：</p>
                                <el-date-picker :clearable='false' type="date" value-format='yyyy-MM-dd' v-model='datas.cpValidEnd' :picker-options="pickerOptions" size='mini'>
                                </el-date-picker>
                            </div>
                            <div v-if="datas.cpValidType=='3'">
                                领取后
                                <!-- <el-select v-model='datas.cpStartTime' placeholder="请选择">
                                    <el-option v-for="item in nowNextStatus" :key="item.key" :label="item.value" :value="item.key">
                                    </el-option>
                                </el-select>
                                <el-select v-model='datas.cpEndTime' placeholder="请选择">
                                    <el-option v-for="item in dayWeekMonth" :key="item.key" :label="item.value" :value="item.key">
                                    </el-option>
                                </el-select> -->
                                {{cpEndTimeFirst}}{{cpEndTimeTwo}} 结束前有效
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">

                            是否自定义券码：</div>
                        <div class="update_main">
                            <p v-if='datas.cpDefCode=="0"'>否，由系统后台随机分配</p>
                            <p v-if='datas.cpDefCode=="1"'>是，按商户自定义规则生成</p>
                        </div>
                    </li>
                    <!-- <li>
                        <div class="update_tit">
                             
                            核销方式：</div>
                        <div class="update_main">
                            <el-radio v-model="couponStatus" label="1">商家门店核销（数字券码/二维码/条形码）</el-radio>
                            <el-radio v-model="couponStatus" label="2">客户在线核销</el-radio>
                        </div>
                    </li> -->
                    <li>
                        <div class="update_tit">

                            库存量：</div>
                        <div class="update_main">
                            {{datas.cpTotalNum}}张
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">

                            每人限领：</div>
                        <div class="update_main">
                            {{datas.cpLimitPices}}张
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            付费类型：</div>
                        <div class="update_main">
                            <ul>
                                <li v-if='datas.cpPayType=="1"'>
                                    免费
                                </li>
                                <li v-if='datas.cpPayType=="2"'>
                                    付费购买{{datas.cpPayAmount}}元可购
                                </li>
                                <li v-if='datas.cpPayType=="3"'>
                                    积分兑换 {{datas.cpPayAmount}}分可兑
                                </li>
                                <li v-if='datas.cpPayType=="4"'>
                                    第三方团购{{datas.cpPayAmount}}元，其中手续费 {{datas.cpGroupFee}}元
                                </li>
                            </ul>
                        </div>
                    </li>

                    <!-- <li>
                        <div class="update_tit">
                             
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
                            适用产品：</div>
                        <div class="update_main">
                            <el-radio v-if='isEdit' label="1" v-model="prodListRadio">全部产品</el-radio>
                            <el-radio v-if='isEdit' label="2" v-model="prodListRadio">
                                指定产品：
                                <!-- <input type="text" readonly placeholder="点击选择适用产品" class="x_input cursor" @click="productShowFun"> -->
                                <Button :iconadd="true" small="Btn small" Name="点击选择适用产品" @click.native.stop="productShowFun"></Button>
                            </el-radio>
                            <ul class="clearfix tag_wrap">
                                <li v-for='(item,key) in datas.prodList' :key="key" class="x_tags">
                                    {{item.name}}
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            适用门槛：
                        </div>
                        <div class="update_main">
                            <p v-if='datas.cpLimit=="0"'>无限制</p>
                            <p v-else>满{{datas.cpLimit}}元可用</p>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            适用门店：</div>
                        <div class="update_main">
                            <el-radio v-if='isEdit' label="1" v-model="storeListRadio">全部门店</el-radio>
                            <el-radio v-if='isEdit' label="2" v-model="storeListRadio">
                                指定门店：
                                <!-- <input type="text" readonly placeholder="点击选择适用门店" class="x_input cursor" @click="storeShowFun"> -->
                                <Button :iconadd="true" small="Btn small" Name="点击选择适用门店" @click.native.stop="storeShowFun"></Button>
                            </el-radio>
                            <ul class="clearfix tag_wrap">
                                <li v-for='(item,key) in datas.storeList' :key="key" class="x_tags">
                                    {{item.sShortName}}
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            操作提示：</div>
                        <div class="update_main">
                            {{datas.cpOpTips}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            使用须知：
                        </div>
                        <div class="update_main">
                            {{datas.cpRemark}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            优惠同享：</div>
                        <div class="update_main">
                            <p v-if="datas.cpShare">不叠加使用</p>
                            <p v-else>叠加使用</p>
                            <el-popover placement="right" title="优惠同享的优先级：" width="200" trigger="hover">
                                <ul>
                                    <li>1.不同的优惠券之间，团购券>兑换券>折扣券>代金券</li>
                                    <li>2.有其他不涉及卡券促销活动的，活动优先级大于卡券</li>
                                </ul>
                                <i slot="reference" class="icon icon_wenhao"></i>
                            </el-popover>
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
                             微信同步：</div>
                        <div class="update_main">
                            <el-checkbox>已绑定微信公众号可用，勾选后，券可同步至微信-卡包</el-checkbox>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                             同步详情：</div>
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
            <Button Name="确定 " :plain="true " @click.stop.native="history.back(-1) "></Button>
            <Button v-if="isEdit" Name="提交 " :plain="true " @click.stop.native="editBtn"></Button>
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
                                <el-table-column type="selection" :selectable='selecProTable' :reserve-selection="true">
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
                        <li v-for='(item,key) in datas.prodList' :key="key" class="x_tags">
                            {{item.name}}
                            <i class="icon icon_chahao" @click="delSelProduct(datas.prodList,key)"></i>
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
                                    <input type="text" class="x_input"></li>
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
                            <el-table ref='storeRef' border :data="storeDatas" size='mini' @selection-change="selectStoreFun" :row-key="getStoreKeys">
                                <el-table-column :selectable='selecStoreTable' type="selection" :reserve-selection="true">
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
                        <li v-for='(item,key) in datas.storeList' :key="key" class="x_tags">
                            {{item.sShortName}}
                            <i class="icon icon_chahao" @click="delSelProduct(datas.storeList,key)"></i>
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

import Button from "@/components/common/Button";
import Paging from "@/components/common/Paging";
export default {
    components: {
        Button, ProductTag: resolve => { require(['../../common/ProductTag'], resolve) }, Paging, getArea: resolve => { require(['@/components/common/getArea'], resolve) }, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) }
    },
    data() {
        return {
            //券有效期 绝对时间 时间组件 限制
            pickerOptions: {
                disabledDate: (time) => {
                    let num = this.datas.cpValidEnd.replace('-', '/');
                    const date = new Date(num);
                    return time.getTime() < date;
                },
            },
            //选产品
            prodListRadio: '2',
            //选门店
            storeListRadio: '2',
            //选门店model 显示隐藏
            selectStoreShow: false,

            //产品形态
            productStatus: [
                {
                    key: '0',
                    value: '服务'
                },
                {
                    key: '1',
                    value: '套卡'
                },
            ],
            //搜索门店
            queryStoreMsg: {
                sName: '', //门店名称
                sDistrictCode: '', //所在地区
                cCode: this.$getCookie("dept"),//所属部门
            },
            //所属部门code
            cCodesArr: [],
            //门店信息
            storeDatas: [],
            //门店总数
            storeTotal: 0,
            //产品选择
            searchProduct: {
                prodKey: '',//产品编号/名称
                cateId: '',//产品分类id
                prodClass: '',//产品分类（0-服务，1-套卡）
            },
            //产品modelshow
            selectProductShow: false,

            //使用产品数据
            productData: [],
            //产品总数
            productTotal: 0,
            //添加 优惠券数据
            datas: {
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
            isEdit: false,//是编辑还是查看
            selStore: [],//已选的门店
            selProduct: [],//已选的产品
            cpEndTimeFirst: '',//当/次
            cpEndTimeTwo: '',//日/周/月
        }
    },
    methods: {
        //验证数字整数
        keyupFun(val) {
            if (val.length === 1) {
                val = val.replace(/[^1-9]/g, '')
            } else if (val.length > 1) {
                val = val.replace(/[^0-9]/g, '')
            } else {
                val = val.replace(/\D/g, '')
            }
        },
        //编辑
        editBtn() {
            let isSubmit = true;
            let obj = JSON.parse(JSON.stringify(this.datas))
            //适用门店
            switch (this.storeListRadio) {
                case '1':
                    this.gotoStorePage(1, 10000)
                    break;
                case '2':
                    if (obj.storeList.length == 0) {
                        isSubmit = false;
                    } else {
                        let arr = []
                        obj.storeList.map(el => {
                            let newObj = {
                                storeNo: el.sCode,//门店编号,
                                sName: el.sShortName,//门店名称
                            };
                            arr.push(newObj);
                        })
                        obj.storeList = arr;
                    }
                    break;
            };
            //适用产品
            switch (this.prodListRadio) {
                case '1':
                    this.getProduct(1, 10000)
                    break;
                case '2':
                    if (obj.prodList.length == 0) {
                        isSubmit = false;
                    } else {
                        let arr = []
                        obj.prodList.map(el => {
                            let newObj = {
                                prodNo: el.prodCode,//产品编号,
                                psName: el.name,//产品名称
                            };
                            arr.push(newObj);
                        })
                        obj.prodList = arr;
                    }
                    break;
            };


            if (isSubmit) {
                obj.logicType = 1;
                this.$post(this.$host + "/api/mkt/coupon/modifyCoupon", obj)
                    .then(d => {
                        if (d.success) {
                            this.$message({
                                type: "success",
                                message: "编辑成功！"
                            });
                            history.back(-1)
                        }
                    });
            } else {
                this.$message({
                    type: "warning",
                    message: "信息填写不完整！"
                });
            }
        },
        //删除已选的产品
        delSelProduct(val, key) {
            if (val[key].isSelect) {
                this.$message({
                    type: "warning",
                    message: "只能进行增量编辑！"
                });
            } else {
                val.splice(key, 1)
            }
        },
        selecProTable(row, index) {
            if (this.selProduct.some(el => { return el.prodCode == row.prodCode; })) {
                return false
            } else {
                return true;
            }
        },
        selecStoreTable(row, index) {

            if (this.selStore.some(el => { return el.sCode == row.sCode; })) {
                return false
            } else {
                return true;
            }

            // console.log(row,index)
        },
        //适用门店
        selectStoreFun(val) {
            this.datas.storeList = val;
            // console.log(this.datas.storeList)
        },
        //适用门店
        getStoreKeys(row) {
            return row.sCode;
        },
        //获取所选部门
        getCorpStore(value) {
            this.queryStoreMsg.cCode = value[value.length - 1];
        },
        //获取地区aCode
        getAreaCode(val) {
            this.queryStoreMsg.sDistrictCode = val;
        },
        //适用产品
        selectDatasFun(val) {
            this.datas.prodList = val;
            // console.log(this.datas.prodList)
        },
        //适用产品
        getRowKeys(row) {
            return row.prodCode;
        },
        //产品分类
        upProductSelect(id) {
            this.searchProduct.cateId = id;
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
                                newData.storeList.push(obj);
                            })
                        }
                    }
                });

        },
        //选门店按钮
        storeShowFun() {
            if (this.storeDatas.length == 0) {
                this.gotoStorePage(1)
            }
            this.selectStoreShow = true;

        },
        //关闭门店model
        closeStoreModel() {
            this.selectStoreShow = !this.selectStoreShow
        },
        //选产品按钮
        productShowFun() {
            if (this.productData.length == 0) {
                this.getProduct(1)
            }
            this.selectProductShow = true;

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
                            newData.prodList.push(obj);
                        })
                    }
                }
            })
        },


    },
    mounted() {
        if (this.$route.query.type == '_edit') {
            this.isEdit = true;
        }
        this.$post(this.$host + '/api/mkt/coupon/queryCouponInfo', { id: this.$route.query.id }).then(d => {
            if (d.success) {
                switch (d.data.cpType) {
                    case 0: d.data.cpTypeText = '兑换券'; break;
                    case 1: d.data.cpTypeText = '折扣券'; break;
                    case 2: d.data.cpTypeText = '代金券'; break;
                }
                switch (d.data.cpValidType) {
                    case 1: d.data.cpValidTypeText = '绝对时间'; break;
                    case 2: d.data.cpValidTypeText = '相对时间'; break;
                    case 3: d.data.cpValidTypeText = '统一截止日期'; break;
                }

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


                };
                if (d.data.cpEndTime) {
                    this.cpEndTimeFirst = d.data.cpEndTime.slice(0, 1) == 1 ? '当' : '次';
                    switch (d.data.cpEndTime.slice(1, 2)) {
                        case 1: this.cpEndTimeTwo = '日'; break;
                        case 2: this.cpEndTimeTwo = '周'; break;
                        case 3: this.cpEndTimeTwo = '月'; break;
                    }
                }
                this.datas = d.data;

            }
        })
    },
}
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
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

