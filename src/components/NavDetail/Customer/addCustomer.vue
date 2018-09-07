<template>

    <div class="add_customer right_content_wrap">
        <div class="right_content">
            <div class='update_sysparas update_content'>
                <ul class="update_sysparas_content">
                    <li v-if='datas.cCode!=undefined'>
                        <div class="update_tit">会员编码：</div>
                        <div class="update_main">
                            <input class="x_input" type="text" :disabled='datas.cCode!=undefined' :value="datas.cCode">
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            手机：</div>
                        <div class="update_main">
                            <input class="x_input" @keyup="keyupFun" maxlength="11" @blur="verifyFun('cPhone')" type="text" v-model='datas.cPhone'>
                            <span class="x_error">{{verify.cPhone}}</span>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>
                            姓名：</div>
                        <div class="update_main">
                            <input class="x_input" @focus="verifyFocus('cName')" maxlength="10" type="text" @blur="verifyFun('cName')" v-model='datas.cName'>
                            <span class="x_error">{{verify.cName}}</span>

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">性别：</div>
                        <div class="update_main">
                            <el-select placeholder="请选择" v-model='datas.cGender'>
                                <el-option v-for="item in gender" :label="item.name" :value="item.value" :key="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>

                    <li>
                        <div class="update_tit">生日：</div>
                        <div class="update_main">
                            <el-select placeholder="请选择 " v-model='calData' class="calendar">
                                <el-option v-for="item in calendar" :label="item.name" :value="item.value" :key="item.value">
                                </el-option>
                            </el-select>
                            <el-date-picker :picker-options="pickerOptions" v-model='birthday' type="date" placeholder="选择日期" size="small">
                            </el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">来源类型：</div>
                        <div class="update_main">
                            <el-select placeholder="请选择 " v-model='datas.cFromType'>
                                <el-option v-for="item in sourceType" :label="item.typeName" :value="item.typeCode" :key="item.typeCode">
                                </el-option>
                            </el-select>

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">来源渠道：</div>
                        <div class="update_main">
                            <input class="x_input" type="text" v-model='datas.cFrom'>

                        </div>
                    </li>

                    <!-- <li>
                        <div class="update_tit">所属技师：</div>
                        <div class="update_main">
                            <el-select placeholder="请选择 " v-model='datas.cEmpId'>
                                <el-option v-for="item in staff" :label="item.empName" :value="item.id" :key="item.id">
                                </el-option>
                            </el-select>

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">所属顾问：</div>
                        <div class="update_main">
                            <el-select placeholder="请选择 " v-model='datas.cSaleMgr'>
                                <el-option v-for="item in manager" :label="item.empName" :value="item.id" :key="item.id">
                                </el-option>
                            </el-select>

                        </div>
                    </li> -->
                    <li>
                        <div class="update_tit">内部员工工号：</div>
                        <div class="update_main">

                            <div class="input_wrap">
                                <input class="x_input cursor" type="text" v-model='datas.cWorkNo' readonly placeholder="内部员工请点击选择" @click="showPeople">
                                <i class="icon cha cursor" v-if='datas.cWorkNo' @click="cancleSelStaf"></i>
                            </div>
                            <AboutPeople :canclefun='colseAboutPeople' :RadioPeople="Radio" :AboutPeopleSelected="AboutPeopelSelected" v-show="PeopleShow" />
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">备注：</div>
                        <div class="update_main">
                            <textarea name="" id="" cols="30" rows="3" v-model='datas.cRemark'></textarea>
                        </div>
                    </li>
                </ul>
                <div class="btn_wrap">
                    <Button Name='取消' buttonClass='None' @click.native="cancle"></Button>
                    <Button Name='提交' @click.native="submit"></Button>
                </div>
            </div>
        </div>
        <!-- 客户已存在 -->
        <transition name="el-fade-in">

            <div class='x_model customer_exist' v-if="customerExistShow">
                <div class="model_content">
                    <header class="x_model_header clear">
                        <div class="left">客户已存在</div>
                        <div class="right curor icon Fork" @click="closeModel"></div>
                    </header>
                    <div class="x_model_main">
                        <p class="x_warning">通过手机号校验，该客户已激活其他业务类型！ 您可以直接将Ta的资料同步至本店，激活本业务类型。</p>
                        <ul>
                            <li>
                                <div>客户编号：</div>
                                <div>
                                    {{isCustomer.cCode }}
                                </div>
                            </li>
                            <li>
                                <div>姓名：</div>
                                <div> {{isCustomer.cName }}</div>
                            </li>
                            <li>
                                <div>性别：</div>
                                <div>{{isCustomer.cGender }}</div>
                            </li>
                            <li>
                                <div>手机：</div>
                                <div>{{isCustomer.cPhone }}</div>
                            </li>
                            <li>
                                <div>生日：</div>
                                <div>{{isCustomer.birthday }}</div>
                            </li>
                            <li>
                                <div>已激活业务类型：</div>
                                <div>
                                    <p v-for="(item,key) in isCustomer.sNameAndBTypeArr " :key='key'>
                                        {{item.busiName}} | {{item.sName}}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="x_model_footer">
                        <Button Name="取消" @click.native="closeModel" buttonClass="None" />
                        <Button Name="激活本业务类型" @click.native="activateBusiness()" />
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import Vue from "vue";
import Button from "@/components/common/Button";
import AboutPeople from "@/components/common/AboutPeople"
import { mapState, mapMutations } from "vuex"
export default {
    components: { Button, AboutPeople },
    data() {
        return {


            headerTitle: '新增会员',
            datas: {
                cName: "",
                cGender: '0',
                cPhone: "",
                cBirthday: "",
                cGbirthday: "",
                cFromType: "",
                cFrom: "",
                // cEmpId: "",
                // cSaleMgr: "",
                cWorkNo: "",
                cRemark: ""
            },
            //验证
            verify: {
                cName: '',
                cPhone: '',
            },
            //性别
            gender: [
                {
                    value: '0',
                    name: '女'
                },
                {
                    value: '1',
                    name: '男'
                }
            ],

            //日历
            calendar: [
                {
                    value: '0',
                    name: '农历'
                },
                {
                    value: '1',
                    name: '公历'
                }
            ],


            pickerOptions: {
                disabledDate(time) {
                    const date = new Date();
                    return time.getTime() > date - 3600 * 1000 * 24 * 1;
                },
            },

            //calData
            calData: "0",

            //birthday
            birthday: '',

            //source
            sourceType: [],

            Radio: true,

            //选择员工组件显示
            PeopleShow: false,

            len: 0,
            //客户已存在modelshow
            customerExistShow: false,
            //客户
            isCustomer: {
                id: '',
                cCode: "",
                cName: "",
                cGender: '',
                cPhone: "",
                cBirthday: '',
                birthday: '',
                cGbirthday: "",
                sNameAndBTypeArr: []
            }
        }
    },
    methods: {
        cancleSelStaf() {
            this.datas.cWorkNo = '';
        },
        //
        activateBusiness() {
            this.$post(this.$host + "/api/cust/customer/synchronization", { cPhone: this.isCustomer.cPhone, id: this.isCustomer.id }).then(d => {
                if (d.success) {
                    this.$message({
                        message: '激活成功！',
                        type: 'success',
                    })
                    this.customerExistShow = false;
                    let type = resurl === '/NavDetail/appointment/addAppointment' ? "_add" : undefined;
                    if (resurl) {
                        this.$router.push({
                            path: resurl,
                            query: {
                                cCode: d.cCode,
                                cName: d.cName,
                                cPhone: this.datas.cPhone,
                                id: d.id,
                                type: type
                            }
                        })

                    } else {
                        this.setDatas({ name: "newCustomer", value: true })
                        history.go(-1);
                    }
                }
            })
        },
        //关闭客户已存在model
        closeModel() {
            this.customerExistShow = false;
        },
        keyupFun() {
            if (this.datas.cPhone.length === 1) {
                this.datas.cPhone = this.datas.cPhone.replace(/[^1]/g, '')
            } else if (this.datas.cPhone.length > 1) {
                this.datas.cPhone = this.datas.cPhone.replace(/[^0-9]/g, '')
            } else {
                this.datas.cPhone = this.datas.cPhone.replace(/\D/g, '')
            }
        },
        ...mapMutations(['setDatas']),
        //关闭
        colseAboutPeople() {
            this.PeopleShow = false;
        },
        verifyFocus(el) {
            let tv = this.verify;
            let tn = this.datas;
            if (el === 'cName') {
                tv[el] = '姓名只能是汉字或只能是英文且不能超过10个字！'
            }
        },
        //验证
        verifyFun(el) {
            let tv = this.verify;
            let tn = this.datas;
            let phoneReg = /^1[3-578]\d{9}$/;
            let nameReg = /^([\u4e00-\u9fa5]{1,10}|[a-zA-Z\.\s]{1,10})$/;
            if (el === 'cPhone') {
                if (!tn[el]) {
                    tv[el] = '必填！'
                } else if (!phoneReg.test(tn[el])) {
                    tv[el] = '手机号不合法！'
                } else {
                    this.$post(this.$host + "/api/cust/customer/byphone", { cPhone: this.datas.cPhone }).then(d => {
                        if (d.success) {
                            if (d.data != null) {
                                if (d.data.cGbirthday != null) {
                                    d.data.birthday = d.data.cGbirthday + "(公历)"
                                } else if (d.data.cBirthday != null) {
                                    d.data.birthday = d.data.cBirthday + "农历"
                                }
                                switch (d.data.cGender) {
                                    case 0: d.data.cGender = '女';
                                        break;
                                    case 1: d.data.cGender = '男';
                                        break;
                                }
                                this.isCustomer = d.data;
                                this.customerExistShow = true;
                            }
                        }
                    })
                    tv[el] = '';
                    this.len++;
                }
            } else if (el === 'cName') {
                if (!tn[el]) {
                    tv[el] = '必填！'
                } else if (!nameReg.test(tn[el])) {
                    console.log('>>>', tn[el])
                    tv[el] = '姓名只能是汉字或只能是英文且不能超过10个字！'
                } else {
                    tv[el] = '';
                    this.len++
                }
            }
        },

        //验证必填
        isSubFun(ver, val) {
            let num = 0;
            this.len = 0;

            for (let key in ver) {
                num++
                if (key === "cPhone") {
                    this.verifyFun('cPhone')
                } else if (key === "cName") {
                    this.verifyFun('cName')
                } else if (key === "cName") {
                    this.verifyFun('cName')
                }
            };
            if (this.len === num) {
                return true;
            } else {
                return false;
            }
        },

        upDatas(val, key) {
            this.datas[key] = val;
        },

        //新增或修改
        //新增或修改
        update() {
            let resurl = this.$route.query.resurl || "";
            let message = '';
            let url = '';
            if (this.$route.query.id != undefined) {//修改
                message = '修改成功！'
                url = "/api/cust/customer/update";

            } else {//新增
                message = '新增成功！'
                url = "/api/cust/customer/add";
            }
            let obj = JSON.parse(JSON.stringify(this.datas));
            if (this.calData === "0") {
                if (typeof (this.birthday) === 'string') {
                    obj.cBirthday = this.birthday
                } else {
                    obj.cBirthday = this.$dateFormat("yy-MM-dd", this.birthday);
                }

            } else if (this.calData === "1") {
                if (typeof (this.birthday) === 'string') {
                    obj.cGbirthday = this.birthday
                } else {
                    obj.cGbirthday = this.$dateFormat("yy-MM-dd", this.birthday);
                }
            };
            this.$post(this.$host + url, obj).then(d => {
                if (d.success) {
                    this.$message({
                        type: 'success',
                        message: message,
                        duration: "1000",
                        onClose: () => {
                            let type = resurl === '/NavDetail/appointment/addAppointment' ? "_add" : undefined;
                            if (resurl) {
                                this.$router.push({
                                    path: resurl,
                                    query: {
                                        cCode: d.cCode,
                                        cName: d.cName,
                                        cPhone: this.datas.cPhone,
                                        id: d.id,
                                        type: type
                                    }
                                })
                            } else {
                                this.setDatas({ name: "newCustomer", value: true })
                                history.go(-1);
                            }
                        }
                    });
                }
            })

        },

        //
        submit() {
            if (this.$stop()) { return }
            if (this.isSubFun(this.verify, this.datas)) {
                this.update();
            } else {
                this.$message({
                    message: '信息填写不完整！',
                    type: 'warning',
                })
            }

        },

        showPeople() {
            this.PeopleShow = !this.PeopleShow;
        },

        //撤销
        cancle() {
            let resurl = this.$route.query.resurl || "";
            let type = resurl === '/NavDetail/appointment/addAppointment' ? "_add" : undefined;
            if (resurl) {
                this.$router.push({
                    path: resurl,
                })
            } else {

                history.go(-1);
            }
        },

        // 选择用户
        AboutPeopelSelected(item, index) {
            this.datas.cWorkNo = item.workNo;
            this.showPeople();
        },

        //获取来源类型
        getSource() {
            this.$post(this.$host + "/api/cust/customer/custfromtype", {}).then(d => {
                if (d.success) {
                    this.sourceType = d.data;
                }
            })
        }
    },
    mounted() {
        if (this.$route.query.id != undefined) {//修改客户
            this.headerTitle = "修改会员";
            this.getSource()
            let par = {
                id: this.$route.query.id
            }
            this.$post(this.$host + "/api/cust/customer/queryone", par).then(d => {
                if (d.success) {
                    if (d.cGbirthday == null) {
                        this.birthday = d.cBirthday;
                        this.calData = "0"
                    } else {
                        this.birthday = d.cGbirthday;
                        this.calData = "1"
                    }
                    for (let key in d) {
                        for (let val in this.datas) {
                            if (key === val) {
                                this.datas[val] = d[val]
                            }
                        }
                    }
                    this.datas.id = d.id
                    this.datas.cGender = d.cGender + "";
                }
            })
        } else {//新增客户
            this.getSource()
        };

        // let par = {
        //     belongShop: this.$getCookie("belongShop"),
        //     pageNumber: 1,
        //     pageSize: 10
        // }
        // this.$post(this.$host + "/api/store/employee/query/page", par)
        //     .then(d => {
        //         if (d.success) {
        //             this.manager = JSON.parse(JSON.stringify(d.pageData.content));
        //             this.staff = JSON.parse(JSON.stringify(d.pageData.content));
        //         }
        //     });
    }
}
</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.input_wrap {
    display: inline-block;
    position: relative;
}
.input_wrap .cha::before {
    content: "\e61a";
    position: absolute;
    top: 52%;
    right: 6px;
    transform: translateY(-50%);
    -ms-transform: translateY(-50%); /* IE 9 */
    -moz-transform: translateY(-50%); /* Firefox */
    -webkit-transform: translateY(-50%); /* Safari 和 Chrome */
    -o-transform: translateY(-50%);
    opacity: 0;
    transition: all 0.2s;
    -ms-transform: all 0.2s; /* IE 9 */
    -moz-transform: all 0.2s; /* Firefox */
    -webkit-transform: all 0.2s; /* Safari 和 Chrome */
    -o-transform: all 0.2s;
}
.input_wrap:hover .cha::before {
    opacity: 1;
    transition: all 0.2s;
    -ms-transform: all 0.2s; /* IE 9 */
    -moz-transform: all 0.2s; /* Firefox */
    -webkit-transform: all 0.2s; /* Safari 和 Chrome */
    -o-transform: all 0.2s;
}
.icon-xing::before {
    content: "\e69b";
    color: #fc1433;
    font-size: 12px;
}
.btn_wrap {
    margin: 1.666667rem 0;
    text-align: center;
}
.customer_exist .model_content {
    width: 400px;
}
.customer_exist .model_content .x_model_main li::after {
    content: "";
    display: block;
    clear: both;
}
.customer_exist .model_content .x_model_main div {
}
.customer_exist .model_content .x_model_main div:first-child {
    width: 120px;
    text-align: right;
    float: left;
}
.customer_exist .model_content .x_model_main div:last-child {
    margin-left: 120px;
}
.customer_exist .x_warning {
    line-height: 18px !important;
    margin-bottom: 12px;
}
.x_model_footer {
    margin-top: 12px;
}
</style>
<style>
.add_customer .el-select {
    width: 160px;
}

.calendar.el-select .el-input,
.calendar.el-select,
.calendar .add_store .el-select > .el-input {
    width: 70px;
}
</style>
