<template>
    <div class="NavDetail">
        <!-- <el-time-picker
            v-model="value2"
            :picker-options="{
              selectableRange: '18:30:00 - 20:30:00'
            }"
            placeholder="任意时间点">
          </el-time-picker>
        <div class="block">
            <span class="demonstration">默认</span>
            <el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
        </div>
        <el-Button>按钮</el-Button> -->
        <!-- <Organization v-if="show"/>
        <Approve_progress />
        <Approve_task />
        <ApproveForm />
        <ApproveStart /> -->
        <!-- <AboutPeople /> -->
        <!-- <ApproveStart /> -->
        <!-- <ExamineApprove/> -->
        <!-- <getArea/> -->
        <!-- <product-rule></product-rule> -->
        <!-- <batchEditCard/> -->
        <!-- <productCard/> -->
        <!-- <batch-edit-rule></batch-edit-rule> -->
        <!-- <priceControl/> -->
        <!-- <Customer/> -->
        <!-- <upload></upload> -->
        <!-- <sureReceipt/> -->
        <!-- <addRefund/> -->
        <!-- <refund/> -->
        <!-- <ul class="headerNav clearfix" id="top">
            <li>当前位置：</li>
            <li v-for="(item,index) in Path" @click="gotoPath(item.path)">&nbsp;{{item.name+((index==Path.length-1)?"":" /")}}</li>
            <li class="back" @click="gotoback" v-show="backShow">
                <i class="icon iconback"></i>
                返回
            </li>
        </ul> -->
        <!-- <transition :name="transitionName"> -->
        <!-- <headerNav /> -->
        <keep-alive :include="keepAlives">
            <router-view class="childview" ></router-view>
        </keep-alive>
        <!-- <Main v-show="$route.path=='/index'"/> -->
        <!-- <router-view class="childview" v-if="!$route.meta.keepAlive"></router-view> -->
        <!-- </transition> -->
    </div>
</template>
<script>
import Main from "./Main";
import headerNav from "../headerNav";
import Organization from "./Organization";
import Button from "../common/Button"
import Approve_progress from "./Approve/Approve_progress"
import Approve_task from "./Approve/Approve_task";
import ApproveForm from "./Approve/ApproveForm"
import ApproveStart from "./Approve/ApproveStart";
import AboutPeople from "../common/AboutPeople";
import upload from "@/components/common/upload";
import ExamineApprove from "@/components/NavDetail/ExamineApprove";
import getArea from "../common/getArea";
import productRule from "./productRule/index.vue";
import productCard from "./productCard";
import batchEditRule from "./productRule/batchEditRule.vue";
import batchEditCard from "./productCard/batchEditCard.vue";
import priceControl from "./priceControl";
import Customer from "./Customer";
import sureReceipt from "./Receipt/sureReceipt";
import { mapState } from "vuex"
import refund from "./refund";
import addRefund from "./refund/addRefund";

// import Vue from "vue";
// import {TimePicker,Button,DatePicker} from "element-ui";
// Vue.use(TimePicker);
// Vue.use(Button);
// Vue.use(DatePicker);
export default {
    components: {
        headerNav,
        Main,
        Organization,
        Approve_progress,
        Approve_task,
        ApproveForm,
        ApproveStart,
        AboutPeople,
        ExamineApprove,
        getArea,
        productRule,
        batchEditRule,
        batchEditCard,
        productCard,
        priceControl,
        Customer,
        upload,
        sureReceipt,
        refund,
        addRefund,
        Button
    },
    data() {
        return {
            backShow: true,
            Path: [
            ],
            value2: new Date(2016, 9, 10, 18, 40),
            show: true,
            transitionName: 'slide-left',
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            value1: '',
            value2: '',
        }
    },
    computed: {
        ...mapState(["NavShow","keepAlives"]),
        isHeight: function () {
            return (document.documentElement.clientHeight - 100) + "px";
        }
    },
    methods: {
        gotoback() {
            history.go(-1);
        },
        gotoPath(path) {
            if (path == "") { return; }
            this.$router.push({
                path: path
            })
        },
        visit(to) {
            let list = JSON.parse(this.$getSession("auths"));
            let canvisit = false;
            if (!to.meta.isvisit) {
                return;
            }
            console.log(to)
            console.log(to.query.detail)
            list.map(el => {
                if ((to.path == "/NavDetail/" + el.fUrl )|| (to.path == "/index")||(to.path == "/NavDetail/" + el.fauth)) {
                    canvisit = true;
                }
            });
            if((to.path == "/NavDetail/ProductServe/ProductCardAdd")&&(to.query.detail=="detail")){
                canvisit = true;
            }
            if((to.path == "/NavDetail/ProductServe/ProductServeAdd")&&(to.query.detail=="detail")){
                canvisit = true;
            }
            !canvisit && this.$router.replace({
                path: "/"
            });
        },
        watchPath(to) {
            this.visit(to)
            this.backShow = true;
            switch (to.path) {
                case "/index": this.backShow = false; this.Path = [{ name: "系统首页", path: "" }];break;
                case "/NavDetail/Personal": this.Path = [{ name: "个人中心", path: "" }]; break;
                case "/NavDetail/Organization": this.Path = [{ name: "组织机构", path: "" }]; break;
                case "/NavDetail/addContact": if (to.query.update) {
                    this.Path = [{ name: "组织机构", path: "/NavDetail/Organization" }, { name: "部门修改", path: "" }];
                } else { this.Path = [{ name: "组织机构", path: "/NavDetail/Organization" }, { name: "部门新增", path: "" }]; }; break;
                case "/NavDetail/ProductServelist": this.Path = [{ name: "产品服务", path: "" }]; break;
                case "/NavDetail/ProductServe/ProductServeAdd": if (to.query.detail) { this.Path = [{ name: "产品服务", path: "/NavDetail/ProductServelist" }, { name: "服务详情", path: "" }]; } else if(to.query.update){
                    this.Path = [{ name: "产品服务", path: "/NavDetail/ProductServelist" }, { name: "服务修改", path: "" }];
                    }else{this.Path = [{ name: "产品服务", path: "/NavDetail/ProductServelist" }, { name: "服务新增", path: "" }];}; break;
                case "/NavDetail/ProductCardlist": this.Path = [{ name: "产品套卡", path: "" }]; break;
                case "/NavDetail/ProductServe/ProductCardAdd": if (to.query.detail) {
                        this.Path = [{ name: "产品套卡", path: "/NavDetail/ProductCardlist" }, { name: "套卡详情", path: "" }];
                    } else if (to.query.update){ this.Path = [{ name: "产品套卡", path: "/NavDetail/ProductCardlist" }, { name: "套卡修改", path: "" }]; }
                    else{this.Path = [{ name: "产品套卡", path: "/NavDetail/ProductCardlist" }, { name: "套卡新增", path: "" }]; } break;
                case "/NavDetail/Order": this.Path = [{ name: "点单消费", path: "" }]; break;
                case "/NavDetail/addOrder": if (to.query.resUrl) { this.Path = [{ name: '会员预约', path: '/NavDetail/appointment' }, { name: '添加消费单', path: '' }] } else { this.Path = [{ name: "点单消费", path: "/NavDetail/Order" }, { name: "添加消费单", path: "" }] }; break;
                case "/NavDetail/OrderDetail": this.Path = [{ name: "点单消费", path: "/NavDetail/Order" }, { name: "消费单详情", path: "" }]; break;
                case "/NavDetail/cancleOrder": this.Path = [{ name: "点单消费", path: "/NavDetail/Order" }, { name: "消费单撤销", path: "" }]; break;
                case "/NavDetail/Receipt": this.Path = [{ name: "预存收款", path: "" }]; break;
                case "/NavDetail/addReceipt": this.Path = [{ name: "预存收款", path: "/NavDetail/Receipt" }, { name: "收款单新增", path: "" }]; break;
                case "/NavDetail/ReceiptDetail": this.Path = [{ name: "预存收款", path: "/NavDetail/Receipt" }, { name: "收款单详情", path: "" }]; break;
                case "/NavDetail/Arrange": this.Path = [{ name: "排班管理", path: "" }]; break;
                case "/NavDetail/Grounp": this.Path = [{ name: "排班管理", path: "/NavDetail/Arrange" }, { name: "设置分组", path: "" }]; break;
                case "/NavDetail/Payment": this.Path = [{ name: "支付页面", path: "" }]; break;
                case "/NavDetail/Partner": this.Path = [{ name: "合作商", path: "" }]; break;
                case "/NavDetail/Approve_progress": this.Path = [{ name: "审批进程", path: "" }]; break;
                case "/NavDetail/ApproveStart": this.Path = [{ name: "发起审批", path: "" }]; break;
                case "/NavDetail/Approve_task": this.Path = [{ name: "我的审批", path: "" }]; break;
                case "/NavDetail/Position": this.Path = [{ name: "职位管理", path: "" }]; break;
                case "/NavDetail/Station": this.Path = [{ name: "岗位管理", path: "" }]; break;
                case "/NavDetail/User": this.Path = [{ name: "用户管理", path: "" }]; break;
                case "/NavDetail/Newuser": this.Path = [{ name: '用户管理', path: '/NavDetail/User' }, { name: '新增用户', path: '' }]; break;
                case "/NavDetail/Userrole": this.Path = [{ name: '用户管理', path: '/NavDetail/User' }, { name: '角色分配', path: '' }]; break;
                case "/NavDetail/Assignroles": this.Path = [{ name: '用户管理', path: '/NavDetail/User' }, { name: '角色分配', path: '' }]; break;
                case "/NavDetail/Role": this.Path = [{ name: "角色管理", path: "" }]; break;
                case "/NavDetail/Power": this.Path = [{ name: '角色管理', path: '/NavDetail/Role' }, { name: '分配权限', path: '' }]; break;
                case "/NavDetail/Func": this.Path = [{ name: "权限管理", path: "" }]; break;
                case "/NavDetail/Parameter": this.Path = [{ name: "参数设置", path: "" }]; break;
                case "/NavDetail/Staffinfo": this.Path = [{ name: "员工信息", path: "" }]; break;
                case "/NavDetail/Addstaff": this.Path = [{ name: '员工信息', path: '/NavDetail/Staffinfo' }, { name: '新增员工', path: '' }]; break;
                case "/NavDetail/Modifysta": this.Path = [{ name: '员工信息', path: '/NavDetail/Staffinfo' }, { name: '修改员工', path: '' }]; break;
                case "/NavDetail/Changeinfo": this.Path = [{ name: "员工异动", path: "" }]; break;
                case "/NavDetail/Product": this.Path = [{ name: "产品分类", path: "" }]; break;
                case "/NavDetail/Prodlabel": this.Path = [{ name: "产品标签", path: "" }]; break;
                case "/NavDetail/Fitstore": this.Path = [{ name: "适用门店", path: "" }]; break;
                case "/NavDetail/GiveStores": this.Path = [{ name: '适用门店', path: '/NavDetail/Fitstore' }, { name: '授权门店', path: '' }]; break;
                case "/NavDetail/CustomerExpand": this.Path = [{ name: "会员等级", path: "" }]; break;
                case "/NavDetail/NewGrade": this.Path = [{ name: '会员等级', path: '/NavDetail/CustomerExpand' }, { name: '新增会员等级', path: '' }]; break;
                case "/NavDetail/ModifyGrade": if (to.query.see) { this.Path = [{ name: '会员等级', path: '/NavDetail/CustomerExpand' }, { name: '查看会员等级', path: '' }] } else { this.Path = [{ name: '会员等级', path: '/NavDetail/CustomerExpand' }, { name: '修改会员等级', path: '' }] }; break;
                case "/NavDetail/IntegralRule": this.Path = [{ name: "积分设置", path: "" }]; break;
                case "/NavDetail/CustomerTag": this.Path = [{ name: "会员标签", path: "" }]; break;
                case "/NavDetail/OpenCard": this.Path = [{ name: "开卡管理", path: "" }]; break;
                case "/NavDetail/OpenCardAdd": this.Path = [{ name: '开卡管理', path: '/NavDetail/OpenCard' }, { name: '开卡', path: '' }]; break;
                case "/NavDetail/OpenCardInfo": this.Path = [{ name: '开卡管理', path: '/NavDetail/OpenCard' }, { name: '开卡详情', path: '' }]; break;
                case "/NavDetail/RevokeCard": this.Path = [{ name: '开卡管理', path: '/NavDetail/OpenCard' }, { name: '退卡', path: '' }]; break;
                case "/NavDetail/SetResults": this.Path = [{ name: "业绩设置", path: "" }]; break;
                case "/NavDetail/BatchSetResults": this.Path = [{ name: '业绩设置', path: '/NavDetail/BatchSetResults' }, { name: '业绩批量设置', path: '' }]; break;
                case "/NavDetail/ResultsAllot": this.Path = [{ name: "业绩分配", path: "" }]; break;
                case "/NavDetail/SystemMessage": this.Path = [{ name: "系统消息", path: "" }]; break;
                case "/NavDetail/SetMessage": this.Path = [{ name: "短信配置", path: "" }]; break;
                case "/NavDetail/MessageLog": this.Path = [{ name: "短信日志", path: "" }]; break;

                case "/NavDetail/Store": this.Path = [{ name: "门店信息", path: "" }]; break;
                case "/NavDetail/storeDetail": this.Path = [{ name: '门店信息', path: '/NavDetail/Store' }, { name: '门店详情', path: '' }]; break;
                case "/NavDetail/addStore": if (to.query.id) { this.Path = [{ name: '门店信息', path: '/NavDetail/Store' }, { name: '修改门店信息', path: '' }] } else { this.Path = [{ name: '门店信息', path: '/NavDetail/Store' }, { name: '新增信息', path: '' }] }; break;

                case "/NavDetail/Customer": this.Path = [{ name: "会员信息", path: "" }]; break;
                case "/NavDetail/customerDetails": this.Path = [{ name: '会员信息', path: '/NavDetail/Customer' }, { name: '会员详情', path: '' }]; break;
                case "/NavDetail/addCustomer": if (to.query.id) { this.Path = [{ name: '会员信息', path: '/NavDetail/Customer' }, { name: '修改会员信息', path: '' }] } else { this.Path = [{ name: '会员信息', path: '/NavDetail/Customer' }, { name: '新增会员信息', path: '' }] }; break;
                // case "/NavDetail/refund/addRefund": this.Path = [{ name: '添加退款', path: '' }]; break; /////////////////////////////

                case "/NavDetail/appointmentGrade": this.Path = [{ name: '预约看板', path: '' }]; break;
                case "/NavDetail/appointment": this.Path = [{ name: '会员预约', path: '' }]; break;
                case "/NavDetail/appointment/addAppointment": if (to.query.type === '_add') { this.Path = [{ name: '会员预约', path: '/NavDetail/appointment' }, { name: '添加预约', path: '' }] } else { this.Path = [{ name: '会员预约', path: '/NavDetail/appointment' }, { name: '变更预约', path: '' }] }; break;

                case "/NavDetail/Refunds": this.Path = [{ name: '退款管理', path: '' }]; break;
                case "/NavDetail/refund/addRefund":
                    if (to.query.type === '_add' || to.query.flowDataId) {
                        this.Path = [{ name: '退款管理', path: '/NavDetail/Refunds' }, { name: '新增退款', path: '' }]
                    } else if (to.query.type === '_add' && to.query.flowDataId) {
                        this.Path = [{ name: '退款管理', path: '/NavDetail/Refunds' }, { name: '重新发起退款', path: '' }]
                    } else if (to.query.type === '_selected') {
                        this.Path = [{ name: '会员信息', path: '/NavDetail/Customer' }, { name: '添加退款', path: '' }]
                    };
                    break;
                case "/NavDetail/nurseLog": this.Path = [{ name: '护理日志', path: '' }]; break;
                case "/NavDetail/nurseLog/addNurse":
                    if (to.query.type === '_edit') {
                        this.Path = [{ name: '护理日志', path: '/NavDetail/nurseLog' }, { name: '修改护理日志', path: '' }]
                    } else if (to.query.type === '_see') {
                        this.Path = [{ name: '护理日志', path: '/NavDetail/nurseLog' }, { name: '查看护理日志', path: '' }]
                    } else {
                        this.Path = [{ name: '护理日志', path: '/NavDetail/nurseLog' }, { name: '添加护理日志', path: '' }]
                    };
                    break;

                case "/NavDetail/productCard": this.Path = [{ name: '套卡规则', path: '' }]; break;
                case "/NavDetail/batchEditCard": this.Path = [{ name: '套卡规则', path: '/NavDetail/productCard' }, { name: '编辑套卡规则', path: '' },]; break;

                case "/NavDetail/productRule": this.Path = [{ name: '服务规则', path: '' }]; break;
                case "/NavDetail/batchEditRule": this.Path = [{ name: '服务规则', path: '/NavDetail/productRule' }, { name: '编辑服务规则', path: '' },]; break;

                case "/NavDetail/priceControl": this.Path = [{ name: '价格规则', path: '' }]; break;
                case "/NavDetail/batchEditPrice": this.Path = [{ name: '价格规则', path: '/NavDetail/priceControl' }, { name: '编辑价格规则', path: '' },]; break;

                case "/NavDetail/Base": this.Path = [{ name: '基础数据', path: '' }]; break;
                case "/NavDetail/ExamineApprove": this.Path = [{ name: '审批配置', path: '' }]; break;
                case "/NavDetail/GrowthValue": this.Path = [{ name: '成长值规则', path: '' }]; break;
                case "/NavDetail/allocateNode":
                    if (to.query.type === '_see') {
                        this.Path = [{ name: '审批配置', path: '/NavDetail/ExamineApprove' }, { name: '查看节点', path: '' },];
                    } else {
                        this.Path = [{ name: '审批配置', path: '/NavDetail/ExamineApprove' }, { name: '配置节点', path: '' },];
                    }
                    break;
                case "/NavDetail/editNode":
                    if (to.query.type === '_add') {
                        this.Path = [{ name: '审批配置', path: '/NavDetail/ExamineApprove' }, { name: '配置节点', path: '/NavDetail/allocateNode' }, { name: '添加节点', path: '' },]
                    } else {
                        this.Path = [{ name: '审批配置', path: '/NavDetail/ExamineApprove' }, { name: '配置节点', path: '/NavDetail/allocateNode' }, { name: '修改节点', path: '' },]
                    };
                    break;
                case "/NavDetail/BusinessTotal": this.Path = [{ name: '营业汇总', path: '' }]; break;
                case "/NavDetail/ReceiptTotal": this.Path = [{ name: '收款汇总', path: '' }]; break;
                case "/NavDetail/ReceiptTotaldetail": this.Path = [{ name: '收款明细', path: '' }]; break;
                case "/NavDetail/OrderTotal": this.Path = [{ name: '消费汇总', path: '' }]; break;
                case "/NavDetail/OrderTotaldetail": this.Path = [{ name: '消费明细', path: '' }]; break;
                case "/NavDetail/refundTotal": this.Path = [{ name: '退款汇总', path: '' }]; break;
                case "/NavDetail/refundTotaldetail": this.Path = [{ name: '退款明细', path: '' }]; break;
                case "/NavDetail/perforTotal": this.Path = [{ name: '业绩汇总', path: '' }]; break;
                case "/NavDetail/perforTotaldetail": this.Path = [{ name: '业绩明细', path: '' }]; break;
                default: this.Path = [{ name: "", path: "" }]; break;
            }
        },
    },
    watch: {
        // $route(to, from) {
        //     this.watchPath(to);
        // }
    },
    mounted() {
        // this.watchPath(this.$route);
    }
}
</script>
<style scoped>
.headerNav {
  position: fixed;
  z-index: 400;
  left: 190px;
  top: 60px;
  background: #ffffff;
  right: 0;
  padding: 0 24px;
  height: 40px;
  line-height: 40px;
  box-shadow: 0px 2px 2px #efefef;
  border-radius: 4px;
  z-index: 9;

}

.headerNav li.back {
  margin-left: 12px;
  float: right;
}
.iconback::before {
  content: "\e669";
  font-size: 18px;
}
.headerNav li {
  float: left;
  cursor: pointer;
  font-size: 14px;
}
.NavDetail {
  padding: 0px 0px 0px 24px;
}
.NavDetail.unfold {
  /* padding-left: 17.166667rem; */
}

.NavDetail::after {
  content: "";
  display: block;
  clear: both;
}
.NavDetail .childview {
  /* transition: all 0.5s linear; */
  /* overflow-y: auto; */
  /* padding-right: 24px; */
  padding-top: 16px;
  /* overflow-y: auto; */
}

.slide-left-enter {
  opacity: 0;
  transform: translate(30px, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate(-30px, 0);
}
</style>
<style>

</style>

      