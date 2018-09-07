<template>
    <div class="right_content_wrap customer">
        <div class="search_wrap">
            <ul>
                <li>
                    <span>
                        优惠券名称：
                    </span>
                    <input v-model='search.cpName' class="x_input" type="text" placeholder="优惠券名称" />
                </li>
                <li>
                    <span>
                        优惠券类型：
                    </span>
                    <el-select v-model='search.cpType' placeholder="请选择 " clearable>
                        <el-option v-for="item in couponStatus" :label="item.value" :value="item.key" :key="item.key">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        付费类型：
                    </span>
                    <el-select v-model='search.cpPayType' placeholder="请选择 " clearable>
                        <el-option v-for="item in payStatus" :label="item.value" :value="item.key" :key="item.key">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        有效期类型：
                    </span>
                    <el-select v-model="search.cpValidType" placeholder="请选择 " clearable>
                        <el-option v-for="item in periodStatus" :label="item.value" :value="item.key" :key="item.key">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>
                        有效时间：
                    </span>
                    <el-date-picker v-model='search.startTime' picker-options="pickerOptions" type="daterange" size='mini' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>

                </li>
                <li>
                    <span>
                        状态：
                    </span>
                    <el-select placeholder="请选择 " v-model="search.cpStatus" clearable>
                        <el-option v-for="item in putStatus" :label="item.value" :value="item.key" :key="item.key">
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
                <Button :iconadd="true" Name="新增优惠券" buttonClass="purple" @click.native="addData"></Button>
            </div>
            <div class="table_content">
                <el-table :data="datas" border>
                    <el-table-column prop="batchNo" label="优惠券编号" width="120">
                    </el-table-column>
                    <el-table-column prop="cpName" label="优惠券名称" width="200">
                    </el-table-column>
                    <el-table-column prop="cpType" label="优惠券类型" width="100">
                    </el-table-column>
                    <el-table-column prop="cpPayType" label="付费类型" width="100">
                    </el-table-column>
                    <el-table-column prop='cpStock' label="剩余库存" width="100">
                    </el-table-column>
                    <el-table-column prop='validDate' label="券有效期" width="200">
                    </el-table-column>
                    <el-table-column prop="cpStatusText" label="状态" width="100">
                    </el-table-column>
                    <el-table-column width="260" label='操作' fixed='right'>
                        <template slot-scope="scope">
                            <Button small="Btn small" Name="查看" @click.native.stop="seecoupon(scope.row,scope.$index)"></Button>
                            <i class="cut_off_rule" v-if="scope.row.cpStatus=='1'"></i>
                            <Button v-if='scope.row.cpStatus=="1"' small="Btn small" Name="投放" @click.native.stop="putIn(scope.row,scope.$index)"></Button>
                            <i class="cut_off_rule" v-if="scope.row.cpStatus!='3'"></i>
                            <Button v-if='scope.row.cpStatus!="3"' small="Btn small" Name="编辑" @click.native.stop="editCoupon(scope.row,scope.$index)"></Button>
                            <i class="cut_off_rule" v-if="scope.row.cpDefCode=='1'"></i>
                            <Button v-if='scope.row.cpDefCode=="1"' small="Btn small" Name="自定义券码" @click.native.stop="userDefinedBtn(scope.row,scope.$index)"></Button>
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
        <!-- 自定义券码 start -->
        <transition name="el-fade-in">
            <div class='x_model user_defined_model' v-show='cpDefCodeShow'>
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">自定义券码</div>
                        <div class="right curor icon Fork" @click="closeDefCodeModel"></div>
                    </header>
                    <div class="x_model_main">
                        <div class="search_wrap">
                            导入券码列表
                        </div>
                        <div class="transfer_wrap">
                            <to-import :id='batchNo' v-model='importMsg' apiName='userDefined'></to-import>
                        </div>
                    </div>

                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeDefCodeModel" buttonClass="None" />
                        <Button Name="确定" @click.native="closeDefCodeModel" />
                    </div>
                </div>
            </div>
        </transition>
        <!--自定义券码 end -->
        <!-- 投放券 start -->
        <transition name="el-fade-in">
            <div class='x_model put_in_model' v-show='putInCodeShow'>
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">投放优惠券</div>
                        <div class="right curor icon Fork" @click="closePutInCodeModel"></div>
                    </header>
                    <div class="x_model_main ">
                        <el-tabs type="card" v-model="activeName" @tab-click='tabClick'>
                            <el-tab-pane label="自主投放" name="0">
                                <ul>
                                    <li>您可以通过多种方式投放：</li>
                                    <li>1.直接向客户分享或展示下方的二维码或链接</li>
                                </ul>
                                <el-card class="el_card">
                                    <vue-qr :logoSrc="config.logo" :text="config.value" :size="200" :margin="0"></vue-qr>
                                </el-card>
                                <el-tooltip placement="top">
                                    <div slot="content">点击复制</div>
                                    <span class="tag-read cursor" :data-clipboard-text="config.value" @click="copyUrl">{{config.value}}</span>
                                </el-tooltip>
                                <!-- <input type="text" class="x_input" v-model='config.value'>
                                <Button Name="复制" @click.native="copyUrl" buttonClass="None" /> -->
                            </el-tab-pane>
                            <el-tab-pane label="第三方系统投放" name="1">
                                投放平台：
                                <el-select v-model="putInData.launchChannel" placeholder="请选择 ">
                                    <el-option v-for="item in putInStatus" :label="item.value" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-tab-pane>
                        </el-tabs>
                    </div>

                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closePutInCodeModel" buttonClass="None" />
                        <Button Name="确定" @click.native="surePutIn" />
                    </div>
                </div>
            </div>
        </transition>
        <!--投放券 end -->
    </div>
</template>
<script>
import Button from "@/components/common/Button";
import Paging from "@/components/common/Paging";
import Input from "@/components/common/Input";
import ToImport from "@/components/common/toImport";
import Select from "../../common/Select";
import Clipboard from 'clipboard';
import VueQr from 'vue-qr'
import Vue from "vue";
import { mapState, mapMutations } from "vuex"
export default {
    name: "Customer",
    components: { VueQr, Button, Paging, Input, ToImport, Select, getCorpStore: resolve => { require(['@/components/common/getCorpStore'], resolve) }, },
    // props:[values,],
    data() {
        return {
            //投放show
            putInCodeShow: false,
            //二维码
            config: {
                value: 'https://www.baidu.com',//显示的值、跳转的地址
                // logo: 'static/img/logo.png'//中间logo的地址
            },
            //tab
            activeName: '0',
            //自定义券码 model show
            cpDefCodeShow: false,

            total: 0,
            //券类型
            couponStatus: [
                {
                    key: '2',
                    value: '代金券'
                },
                {
                    key: '0',
                    value: '兑换券'
                }, {
                    key: '1',
                    value: '折扣券'
                }
            ],
            //付费类型
            payStatus: [
                { value: '免费', key: '1' },
                { value: '积分', key: '3' },
                { value: '付费', key: '2' },
                { value: '第三方团购', key: '4' },
            ],
            //有效期类型
            periodStatus: [
                { value: '相对时间', key: '2' },
                { value: '绝对时间', key: '1' },
                { value: '统一截止时间', key: '3' },
            ],
            //投放类型
            putStatus: [
                { value: '未投放', key: '1' },
                { value: '已投放', key: '2' },
                { value: '已过期', key: '3' },
            ],

            //投放平台
            putInStatus: [
                { value: '美团点评', key: '1' },
                { value: '支付宝口碑', key: '2' },
            ],


            //datas
            datas: [],

            //搜索
            search: {
                "cpName": '',//优惠券名称,
                "cpStatus": '',// 状态,（1-未投放 2-已投放 3. 已过期）
                "startTime": '',//有效开始日期,
                "endTime": '',//有效截止日期,
                "cpType": '',//优惠券类型,（ 0 兑换券,1. 折扣券 2. 代金券）
                "cpPayType": '',//付费类型,（1-免费 2-付费 3-积分  4.第三方团购）
                "cpValidType": '',// 有效期类型（1-绝对时间 2-相对时间 3-统一截止日期）
            },
            //优惠券 编码
            batchNo: '',
            //导入
            importMsg: {
                failedMsg: [],
                failedTot: '',
                respCode: '',
                respMsg: '',
                success: '',
                successTot: '',
                totalSum: '',
            },

            //投放数据
            putInData: {
                "id": '',//优惠券ID,
                "launchChannel": '1',//投放渠道（0:自主投放  1:新美大）
                "cpDefCode": '',//是否自定义券码
                "batchNo": '',//优惠券批次号
            },
        }
    },
    computed: {

    },
    methods: {
        //tabClick
        tabClick(val) {
            this.putInData.launchChannel = val.name;
        },
        //复制链接
        copyUrl() {
            let clipboard = new Clipboard('.tag-read')
            clipboard.on('success', e => {
                // success("复制成功");//这里你如果引入了elementui的提示就可以用，没有就注释即可
                this.$message({
                    type: "success",
                    message: "复制成功！"
                });
                // 释放内存  
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制  
                this.$message({
                    type: "warning",
                    message: "该浏览器不支持自动复制！"
                });
                // 释放内存  
                clipboard.destroy()
            })
        },
        //putin model close
        closePutInCodeModel() {
            this.putInCodeShow = false;
        },
        //自定义券码 btn
        userDefinedBtn(val) {
            this.cpDefCodeShow = true;
            this.batchNo = val.batchNo;
        },
        //关闭 自定义券码 model
        closeDefCodeModel() {
            this.cpDefCodeShow = false;
        },
        //确定投放按钮
        surePutIn() {
            this.$post(this.$host + '/api/mkt/coupon/launchCoupon', this.putInData).then(d => {
                if (d.success) {
                    this.getData(1)
                    this.$message({
                        type: "success",
                        message: "投放成功！"
                    });
                    this.putInCodeShow = false;

                }
            })
        },
        //编辑
        editCoupon(val) {
            // let path = val.cpStatus == 1 ? "/NavDetail/coupon/addCoupon" : "/NavDetail/coupon/seeCoupon" ;
            let path = "/NavDetail/coupon/addCoupon"
            this.$router.push({
                path: path,
                query: {
                    id: val.id,
                    type: '_edit',
                }
            });
        },
        //下载图片
        downloadImg() {
            var oQrcode = document.querySelector('#qrcode img')
            var url = oQrcode.src
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            // 下载图名字
            a.download = '张三的二维码'
            //url 
            a.href = url
            //合成函数，执行下载 
            a.dispatchEvent(event)
        },
        //putIn 投放
        putIn(val) {
            this.putInCodeShow = true;
            this.putInData.id = val.id
            this.putInData.cpDefCode = val.cpDefCode;
            this.putInData.batchNo = val.batchNo;
            this.getData(1)

        },
        //查看
        seecoupon(val) {
            this.$router.push({
                path: "/NavDetail/coupon/seeCoupon",
                query: {
                    id: val.id
                }
            });
        },
        addData() {
            this.$router.push({
                path: "/NavDetail/coupon/addCoupon",
                query: {

                }
            });
        },
        //搜索重置
        reset() {
            this.search = {
                "cpName": '',//优惠券名称,
                "cpStatus": '',// 状态,（1-未投放 2-已投放 3. 已过期）
                "startTime": '',//有效开始日期,
                "endTime": '',//有效截止日期,
                "cpType": '',//优惠券类型,（ 0 兑换券,1. 折扣券 2. 代金券）
                "cpPayType": '',//付费类型,（1-免费 2-付费 3-积分  4.第三方团购）
                "cpValidType": '',// 有效期类型（1-绝对时间 2-相对时间 3-统一截止日期）
            };
        },
        //获取数据方法
        getData(index) {
            let _data = {
                "pageNumber": parseInt(index) || 1,
                "pageSize": 20,
            }
            for (let key in this.search) {
                if (key === 'startTime') {
                    if (this.search[key] != '' && this.search[key] != null) {
                        console.log(this.search.startTime[1])
                        _data.endTime = this.$dateFormat('yy-MM-dd', this.search.startTime[1]);
                        _data.startTime = this.$dateFormat('yy-MM-dd', this.search.startTime[0])
                    }
                } else {
                    if (this.search[key] != '') {
                        _data[key] = this.search[key]
                    }
                }
            }
            this.$post(this.$host + '/api/mkt/coupon/findCouponList', _data).then(d => {
                if (d.success) {
                    d.data.content.map(el => {
                        //状态
                        switch (el.cpStatus) {
                            case 1:
                                el.cpStatusText = '未投放'
                                break;
                            case 2:
                                el.cpStatusText = '已投放'
                                break;
                            case 3:
                                el.cpStatusText = '已过期'
                                break;
                        }
                        //券类型
                        switch (el.cpType) {
                            case 0:
                                el.cpType = '兑换券'
                                break;
                            case 1:
                                el.cpType = '折扣券'
                                break;
                            case 2:
                                el.cpType = '代金券'
                                break;
                        };
                        //付费类型
                        switch (el.cpPayType) {
                            case 1:
                                el.cpPayType = '免费'
                                break;
                            case 2:
                                el.cpPayType = '付费'
                                break;
                            case 3:
                                el.cpPayType = '积分'
                                break;
                            case 4:
                                el.cpPayType = '第三方团购'
                                break;
                        }
                    })
                    this.datas = d.data.content;
                    this.total = d.data.total;
                }
            })
        },
    },
    activated() {
        this.getData(1)
    },
    mounted() {
        // this.getData(1)
    },


}

</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.user_defined_model .model_content {
    width: 600px;
}
.put_in_model .model_content {
    width: 600px;
}
.el_card {
    width: 240px;
    height: 240px;
    margin: 24px auto 0;
    position: relative;
}
.x_model_main {
    height: 410px;
}
.tag-read {
    margin: 12px 0;
    display: inline-block;
}
.btn_wrap{
    margin-bottom: 12px;
}
</style>
<style>
</style>


