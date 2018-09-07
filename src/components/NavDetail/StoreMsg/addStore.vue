<template>
    <div class="add_store right_content_wrap">
        <div class="right_content">
            <div class="update_content">
                <ul>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            门店编号：
                        </div>
                        <div class="update_main">
                            <input class="x_input" :disabled='isEdit' type="text" v-model='newStoreMsg.sCode' @focus="focusFun('sCode')" @blur="verifyFun('sCode')" />
                            <span class="x_error">{{verify.sCode}}</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            门店名称：
                        </div>
                        <div class="update_main">
                            <input @keyup="keyUpSpecial" class="x_input" type="text" v-model='newStoreMsg.sName' @blur="verifyFun('sName')" />
                            <span class="x_error" v-if='verify.sName'>必填!</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            门店简称：
                        </div>
                        <div class="update_main">
                            <input class="x_input" type="text" v-model='newStoreMsg.sShortName' @blur="verifyFun('sShortName')" />
                            <span class="x_error" v-if='verify.sShortName'>必填</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            所属部门：
                        </div>
                        <div class="update_main">
                            <getCorpStore isMgnStore='1' @getCorpStore="getCorpStore" :values="[this.newStoreMsg.sCorp]" />
                            <span class="x_error" v-if='verify.sCorp'>必填!</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            所在地区：
                        </div>
                        <div class="update_main">
                            <getArea @getAreaCode='getAreaCode' :defaultArea="aName" />
                            <span class="x_error" v-if='verify.sDistrictCode'>必填!</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            门店地址：
                        </div>
                        <div class="update_main">
                            <textarea v-model='newStoreMsg.sShopAddr' name="" id="" cols="30" rows="2" @blur="verifyFun('sShopAddr')"></textarea>
                            <Button Name="搜索" class="sec_map" :plain="true " @click.stop.native="localSearchFun() "></Button>
                            <div class="allmap_wrap">
                                <div id='allmap' style='height:400px;width:calc(100% - 160px);'>
                                </div>
                                <Button class="sec_map" Name="清除定位" :plain="true " @click.stop.native="clearSelectFun() "></Button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            门店电话：
                        </div>
                        <div class="update_main">
                            <input type="number" class="x_input" v-model='newStoreMsg.sTel' />
                            <span class="x_error" v-if='verify.sTel'>{{verify.sTel}}</span>

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">

                            经营性质：
                        </div>
                        <div class="update_main">
                            <el-select size='mini' v-model='newStoreMsg.sOwner' placeholder=" 请选择 ">
                                <el-option v-for="(item,index) in storeOwners " :label="item.ownerValue " :value="item.sOwner " :key="index">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <!-- <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            业务类型：
                        </div>
                        <div class="update_main">
                            <el-select size='mini' @change="focusFun('sTradType')" v-model='newStoreMsg.sTradType' placeholder=" 请选择 ">
                                <el-option v-for="(item,index) in sTradType " :label="item.dkey" :value="item.dvalue" :key="index">
                                </el-option>
                            </el-select>
                            <span class="x_error" v-if='verify.sTradType'>必填!</span>
                        </div>
                    </li> -->
                    <li>
                        <div class="update_tit">
                            门店状态：
                        </div>
                        <div class="update_main">
                            <el-select size='mini' width="120px " v-model='newStoreMsg.sStatus' placeholder="请选择 ">
                                <el-option v-for="(item,index) in storeStatus " :label="item.statusValue " :value="item.sStatus " :key="index">
                                </el-option>
                            </el-select>

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            开业日期：
                        </div>
                        <div class="update_main">
                            <el-date-picker v-model="newStoreMsg.sStartDate" type="date" placeholder="选择日期" size="mini">
                            </el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            停业日期：
                        </div>
                        <div class="update_main">
                            <el-date-picker v-model="newStoreMsg.sEndDate" type="date" placeholder="选择日期" size="mini">
                            </el-date-picker>
                            <a class="x_error">{{verifyDate}}</a>
                        </div>
                    </li>
                </ul>
                <div class="btn_wrap ">
                    <Button Name="取消 " buttonClass='None' @click.stop.native="goBack "></Button>
                    <Button Name="提交 " :plain="true " @click.stop.native="addStoreMsg() "></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import Vue from "vue";
import Button from "../../common/Button";
import getArea from "@/components/common/getArea";
import Mtk from "@/components/common/Mtk";
import Input from "@/components/common/Input";
import { mapMutations, mapState } from "vuex"
import BaiduMap from '../../../assets/baidu_map.js';
import getCorpStore from "@/components/common/getCorpStore"
export default {
    components: { getCorpStore, Button, getArea, Input, Mtk, AboutBranch: (resolve) => { require(["@/components/common/AboutBranch"], resolve) }, },
    data() {
        return {
            //部门
            cDept: [this.$getCookie('dept')],//部门数组,
            //编辑或新增
            isEdit: false,

            isMgnStore: 1,

            aaa: '',
            sCodeRem: '',
            //门店头部信息
            headerTitle: "新增门店信息",
            //belongCope
            belongCopeShow: false,
            //showBranch

            //验证
            verify: {
                sCode: "", //门店标号
                sName: false, //门店名称
                sDistrictCode: false, //所在地区
                sCorp: false, //所属部门
                sShortName: false,
                sTradType: false,
                sTel: '',
            },
            verifyDate: '',

            //新增店面信息
            newStoreMsg: {
                sCode: "",
                sName: "",
                sShortName: "",
                sDistrictCode: "",
                sCorp: "",
                sCoor: "",
                sShopAddr: "",
                sTel: '',
                sOwner: 0,
                sStatus: 1,
                sLevel: "",
                sTradType: '',
                sStartDate: undefined, //开业日期
                sEndDate: undefined,//停业日期
            },

            aName: '',
            //所属机构
            belongCopeName: '',

            //经营性质
            storeOwners: [],

            //业务类型
            sTradType: [],

            //门店状态
            storeStatus: [],
            // num:0,

            //地图搜索
            localSearchData: function () { },

            //清除地图
            map: function () { },

            //marker
            marker: '',

            len: 0,

        }
    },
    computed: {
        ...mapState(["storesvuex",]),
    },
    methods: {
        // 禁止输入输入特殊字符？
        keyUpSpecial(e) {
            let IllegalString = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘’";
            let textboxvalue = e.target.value;
            let index = textboxvalue.length - 1;
            let s = e.target.value.charAt(index);
            if (IllegalString.indexOf(s) >= 0) {
                e.target.value = e.target.value.substring(0, index);
            }
        },
        localSearchFun() {
            this.localSearchData.search(this.newStoreMsg.sShopAddr)
        },

        clearSelectFun() {
            this.map.removeOverlay(this.marker);
            this.newStoreMsg.sCoor = '';
            this.newStoreMsg.sShopAddr = ''
        },

        focusFun(el) {
            this.verify.sCode = '请使用4位字母或数字组合!'
        },

        //验证
        verifyFun(el) {
            this.len = 0;
            let tv = this.verify;
            let tn = this.newStoreMsg;
            let reg = /[a-zA-Z0-9]{4}/;
            if (el === 'sCode') {
                if (!tn.sCode) {
                    tv.sCode = '必填！'
                } else if (!reg.test(tn.sCode)) {
                    tv.sCode = '请使用4位字母或数字组合!'
                } else {
                    tv.sCode = '';
                    this.len++
                }
            } else if (el === 'sStartDate' || el === 'sEndDate') {
                if (tn.sStartDate != null && tn.sEndDate != null && tn.sStartDate > tn.sEndDate) {
                    this.verifyDate = '开业日期不能大于停业日期!';
                } else {
                    this.verifyDate = '';
                    this.len++
                }
            } else if (el == 'sTel') {
                if (tn.sTel) {
                    let telReg = /(^400[0-9]{7})|(^800[0-9]{7})|(^1(3|4|7|5|8)([0-9]{9}))|(^0[0-9]{2,3}-[0-9]{8})/
                    if (!reg.test(tn.sTel)) {
                        tv.sTel = '门店电话格式不合法!'
                    } else {
                        tv.sTel = ''
                        this.len++
                    }
                } else {
                    tv.sTel = ''
                    this.len++
                }

            } else {
                if (!tn[el]) {
                    tv[el] = true
                } else {
                    tv[el] = false;
                    this.len++
                }
            }
        },

        //验证必填
        isSubFun(ver, val) {
            let num = 0;
            this.len = 0
            for (let key in ver) {
                num++;
                if (key === "sCode") {
                    this.verifyFun('sCode')
                } else if (key === "sTel") {
                    this.verifyFun('sTel')
                } else if (val[key] === '' || val[key] === null) {
                    ver[key] = true;
                }
            };
            if (val.sStartDate != null && val.sEndDate != null && val.sStartDate > val.sEndDate) {
                num++;
                this.verifyDate = '开业日期不能大于停业日期!';
            } else {
                this.verifyDate = '';
            }
            if (num = this.len) {
                return true;
            } else {
                return false;
            }
        },
        ...mapMutations(["setDatas"]),
        updated() {
            let message = '';
            let url = '';
            if (this.$route.query.id != undefined) {//修改
                message = '修改成功！'
                url = "/api/store/store/update";
            } else {//新增
                message = '新增成功！'
                url = "/api/store/store/add";
                delete this.newStoreMsg.id;
            }
            let data = this.newStoreMsg

            if (data.sEndDate != undefined || data.sEndDate == '') {
                data.sEndDate = this.$dateFormat('yy-MM-dd hh:mm:ss', data.sEndDate)
            } else {
                delete data.sEndDate;
            }
            if (data.sStartDate != undefined || data.sStartDate == '') {
                data.sStartDate = this.$dateFormat('yy-MM-dd hh:mm:ss', data.sStartDate)
            } else {
                delete data.sStartDate
            }
            let par = {}
            for (let k in data) {
                if (data[k] != '' || data[k] != null) {
                    par[k] = data[k]
                }
            }
            this.$post(this.$host + url, par).then(d => {
                if (d.success) {
                    this.setDatas({ name: "storesvuex", value: '' })
                    this.$message({
                        type: 'success',
                        message: message,
                        duration: "3000",
                        onClose: () => {
                            history.go(-1);
                        }
                    });
                }
            });
        },

        //添加 修改门店信息
        addStoreMsg() {
            if (this.$stop()) { return }
            if (this.isSubFun(this.verify, this.newStoreMsg)) {
                this.updated();
            } else {
                this.$message({
                    message: '必填信息填写不完整！',
                    type: 'warning',
                    duration: "2000",
                })
            }
        },

        //获取所选地区 aCode 
        getAreaCode(val) {
            if (val !== undefined) {
                val.length < 1 ? this.verify.sDistrictCode = true : this.verify.sDistrictCode = false;
            } else {
                this.verify.sDistrictCode = true
            }
            this.newStoreMsg.sDistrictCode = val;
        },
        //选择部门
        getCorpStore(val) {
            val.length < 1 ? this.verify.sCorp = true : this.verify.sCorp = false;
            this.newStoreMsg.sCorp = val[val.length - 1];
        },

        goBack() {
            history.back(-1)
        },

        //选择所属机构
        belongCopeFunc() {
            this.belongCopeShow = !this.belongCopeShow;
        },
    },

    mounted() {
        let _that = this

        if (this.$route.query.id != undefined) {
            this.isEdit = true;
            this.headerTitle = "修改门店信息";
            let params = {
                accessToken: this.$getCookie("accessToken"),
                id: this.$route.query.id,
            }
            //根据id查询门店信息
            this.$post(this.$host + "/api/store/store/query", params)
                .then(d => {
                    if (d.success) {
                        d.data.sStatus = d.data.sStatus + '';
                        this.aName = d.data.aName;
                        for (let k in this.newStoreMsg) {
                            for (let v in d.data) {
                                if (k === v) {
                                    this.newStoreMsg[k] = d.data[k]
                                }
                            }
                        }
                        this.newStoreMsg.id = d.data.id;
                        // let isLocation = false;
                        let arr = [];
                        let isLocation = {}
                        if (d.data.sCoor != null && d.data.sCoor != '' && d.data.sCoor != undefined) {
                            arr = d.data.sCoor.split(',')
                            isLocation.lng = arr[0]; isLocation.lat = arr[1];
                        }


                        BaiduMap.init(_that, isLocation)
                            .then((BMap) => {
                                let map = new BMap.Map("allmap");
                                _that.map = map
                                let geolocation = new BMap.Geolocation();
                                let xPoint = '';
                                let yPoint = '';
                                // if (isLocation){
                                //     var marker = new BMap.Marker(point);//创建点    
                                //     map.addOverlay(marker);//绘制点                                
                                // }
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

                                        _that.newStoreMsg.sCoor = xPoint + "," + yPoint;
                
                                        var geoc = new BMap.Geocoder();//获取点详细位置实例
                                        // console.log("><<<", xPoint); console.log("><<", yPoint)
                                        let point = new BMap.Point(xPoint, yPoint);//创建点实例

                                        map.centerAndZoom(point, 16);

                                        // marker.enableDragging();//点可以拖动
                                        marker.enableMassClear();//点可以被清除

                                        map.addEventListener("click", function (e) {
                                            var pt = e.point;
                                            _that.newStoreMsg.sCoor = e.point.lng + "," + e.point.lat;
                                            map.removeOverlay(marker);
                                            marker = new BMap.Marker(e.point);//创建点
                                            map.addOverlay(marker);//绘制点
                                            _that.marker = marker
                                            geoc.getLocation(pt, function (rs) {
                                                var addComp = rs.addressComponents;
                                                _that.newStoreMsg.sShopAddr = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber

                                            });
                                        });

                                        _that.localSearchData = new BMap.LocalSearch(map, {//搜索实例
                                            renderOptions: { map: map }
                                        });
                                        // 绘制图形
                                    }
                                    else {
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
                                    }
                                });

                                map.enableScrollWheelZoom(true);//鼠标滚动事件
                                // map.enableDoubleClickZoom(true);//鼠标双击事件

                            })
                    }
                });
        } else {

            BaiduMap.init(_that)
                .then((BMap) => {
                    let map = new BMap.Map("allmap");
                    _that.map = map
                    let geolocation = new BMap.Geolocation();
                    let xPoint = '';
                    let yPoint = '';
                    geolocation.getCurrentPosition(function (r) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            var marker = new BMap.Marker(r.point);//创建点
                            _that.marker = marker
                            // _that.newStoreMsg.sCoor = r.point;
                            map.addOverlay(marker);//绘制点
                            console.log('>>>',r.point)
                            // map.panTo(r.point);//到 中心点
                            xPoint = r.point.lng || 116.403928;//定位x
                            yPoint = r.point.lat || 39.915024//定位y

                            _that.newStoreMsg.sCoor = xPoint + "," + yPoint;

                            var geoc = new BMap.Geocoder();//获取点详细位置实例

                            let point = new BMap.Point(xPoint, yPoint);//创建点实例

                            map.centerAndZoom(point, 16);

                            // marker.enableDragging();//点可以拖动
                            marker.enableMassClear();//点可以被清除

                            map.addEventListener("click", function (e) {
                                var pt = e.point;
                                _that.newStoreMsg.sCoor = e.point;
                                _that.newStoreMsg.sCoor = e.point.lng + "," + e.point.lat;
                                map.removeOverlay(marker);
                                marker = new BMap.Marker(e.point);//创建点
                                map.addOverlay(marker);//绘制点
                                _that.marker = marker
                                geoc.getLocation(pt, function (rs) {
                                    var addComp = rs.addressComponents;
                                    _that.newStoreMsg.sShopAddr = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber

                                });
                            });

                            _that.localSearchData = new BMap.LocalSearch(map, {//搜索实例
                                renderOptions: { map: map }
                            });
                            // 绘制图形
                        }
                        else {
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
                        }
                    });

                    map.enableScrollWheelZoom(true);//鼠标滚动事件
                    // map.enableDoubleClickZoom(true);//鼠标双击事件

                })

        }

        //门店状态-经营性质
        this.$post(this.$host + "/api/store/store/query/ownerandstatus", {})
            .then(d => {
                if (d.success) {
                    this.storeOwners = d.owners;
                    this.storeStatus = d.status;
                    this.newStoreMsg.sStatus = "1";
                    this.newStoreMsg.sOwner = "0";
                }
            });

        //门店业务类型
        this.$post(this.$host + "/api/sysmgr/dictsysparm/getdkeydvalue", { "dCode": "D030" })
            .then(d => {
                if (d.success) {
                    this.sTradType = d.data;
                }
            });


    }
}

</script>

<style scoped>
@import "../../../../static/commonStyle.css";
input {
    font-size: 12px !important;
}
#allmap {
    display: inline-block;
}
.sec_map {
    vertical-align: top !important;
}
.ipt-wrap {
    position: relative;
    display: inline-block;
}

.branch-wrap {
    position: absolute;
    bottom: 0;
    background-color: #fff;
    transform: translateY(100%);
    z-index: 1001;
    overflow: auto;
}

.btn_wrap {
    margin: 40px 0;
    text-align: left;
}
.btn_wrap button:first-child {
    margin-right: 24px;
    margin-left: 160px;
}

/*  */
.like_select {
    position: relative;
    display: inline-block;
}
.like_select .StoreSelect {
    position: absolute;
    right: 1.166667rem;
    top: 8px;
    width: 8px;
    height: 8px;
    border-right: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    transform: rotate(45deg);
    cursor: pointer;
    transition: all 0.2s linear;
    transform-origin: 75% 75%;
}
.like_select .StoreSelect.Cliked {
    transform: rotate(225deg);
}
.AboutBranch {
    position: absolute;
    left: 0;
    top: 30px;
    z-index: 1000;
    background: #fff;
}
</style>
<style>
</style>


