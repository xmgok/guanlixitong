<template>
    <div class="Collections">
        <div class="btn_wrap">
            <div>
                <Button v-if="addIsActive" Name="添加" @click.native="addReceipt()"></Button>
            </div>
            <div v-if="!addIsActive">
                <Button v-if="!isActive" Name="修改" @click.native="editDetail">
                </Button>
                <div v-if="isActive">
                    <Button Name="提交" @click.native="submit"></Button>
                    <Button buttonClass='None' Name="取消" @click.native="cancleEidtAdd"></Button>
                </div>
            </div>
        </div>
        <div class="update_content">
            <ul :class="{Border:!isActive}">
                <li>
                    <div class="update_tit">
                        <span>
                            <i class="icon waring"></i>支付方式：</span>
                    </div>
                    <div class="update_main">
                        <input @blur='verifyFun("payType")' class="x_input" type="text" placeholder="无" v-model="datas.payType" :readonly="!isActive">
                        <span class="x_error" v-if='verifyDatas.payType'>必填!</span>
                    </div>
                </li>
                <li>
                    <div class="update_tit">
                        <span>
                            <i class="icon waring"></i>收款账户：</span>
                    </div>
                    <div class="update_main">

                        <input @blur='verifyFun("gathAcct")' class="x_input" type="text" placeholder="无" v-model="datas.gathAcct" :readonly="!isActive">
                        <span class="x_error" v-if='verifyDatas.gathAcct'>必填!</span>
                    </div>
                </li>
                <li>
                    <div class="update_tit">
                        <span>
                            <i class="icon waring"></i>开户行名称：</span>
                    </div>
                    <div class="update_main">

                        <input @blur='verifyFun("gathBankName")' class="x_input" type="text" placeholder="无" v-model="datas.gathBankName" :readonly="!isActive">
                        <span class="x_error" v-if='verifyDatas.gathBankName'>必填!</span>
                    </div>
                </li>
                <li>
                    <div class="update_tit">
                        <span>
                            <i class="icon waring"></i>开户行行号：</span>
                    </div>
                    <div class="update_main">

                        <input @blur='verifyFun("gathBankNo")' class="x_input" type="text" placeholder="无" v-model="datas.gathBankNo" :readonly="!isActive">
                        <span class="x_error" v-if='verifyDatas.gathBankNo'>必填!</span>
                    </div>
                </li>
                <li>
                    <div class="update_tit">
                        <span>
                            <i class="icon waring"></i>开户名称：</span>
                    </div>
                    <div class="update_main">
                        <input @blur='verifyFun("gathAcctName")' class="x_input" type="text" placeholder="无" v-model="datas.gathAcctName" :readonly="!isActive">
                        <span class="x_error" v-if='verifyDatas.gathAcctName'>必填!</span>
                    </div>
                </li>
            </ul>
        </div>

    </div>
</template>
<script>
import Button from "../../../common/Button";
import { Message } from 'element-ui';
export default {
    components: {
        Button
    },
    data() {
        return {
            datas: {
                id: "",
                storeId: "",
                gathAcct: "",
                gathAcctName: "",
                gathBankName: "",
                gathBankNo: "",
                payType: "",
            },
            verifyDatas: {
                gathAcct: "",
                gathAcctName: "",
                gathBankName: "",
                gathBankNo: "",
                payType: "",
            },
            isActive: false,
            addIsActive: false,
            addEditState: 1,
        }
    },
    methods: {
        verifyFun(el) {
            let tv = this.verifyDatas;
            let tn = this.datas;
            !tn[el] ? tv[el] = true : tv[el] = false;
        },
        //验证必填
        isSubFun(ver, val) {
            let len = 0;
            for (let key in ver) {

                if (val[key] === '') {
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

        //返回
        goBack() {
            history.back(-1)
        },
        //添加财务
        addReceipt() {
            this.isActive = true;
            this.addIsActive = false;
            this.addEditState = 1;//取消按钮为取消新增按钮
        },
        //取消按钮
        cancleEidtAdd() {
            if (this.addEditState == 1) {//取消添加按钮
                this.isActive = false;
                this.addIsActive = true;
                this.datas = {
                    athAcct: null,
                    athAcctName: null,
                    athBankName: null,
                    athBankNo: null,
                    ayType: null
                };
            } else if (this.addEditState == 2) {//取消修改按钮
                let data = {
                    accessToken: this.$getCookie("accessToken"),
                    storeId: this.$route.query.storeId,
                    pageNumber: "",
                    pageSize: ""
                };
                this.$post(this.$host + "/api/store/payment/query/page", data).then(d => {
                    if (d.success) {
                        this.datas = d.pageData.content[0];
                        this.isActive = false;
                    }
                });
            }
        },

        //修改按钮
        editDetail() {
            this.addEditState = 2;
            this.isActive = true;
        },

        //提交按钮
        submit() {
            if (this.addEditState == 1) {//提交按钮为新增按钮
                if (this.isSubFun(this.verifyDatas, this.datas)) {
                    this.datas.storeId = this.$route.query.storeId
                    let params = this.datas;
                    this.$post(this.$host + "/api/store/payment/add", params).then(d => {
                        if (d.success) {
                            this.isActive = false;
                            Message({
                                message: '添加成功',
                                type: 'success'
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
            } else if (this.addEditState == 2) {//修改
                if (this.isSubFun(this.verifyDatas, this.datas)) {
                    this.datas.accessToken = this.$getCookie("accessToken");
                    console.log(">>>>", this.datas)
                    this.$post(this.$host + "/api/store/payment/update", this.datas).then(d => {
                        if (d.success) {
                            this.isActive = false
                            Message({
                                message: '修改成功',
                                type: 'success'
                            });
                        }
                    })
                } else {
                    this.$message({
                        message: '有必填信息未填写！',
                        type: 'warning',
                        duration: "1000",
                    })
                }
            }
        }
    },

    mounted() {
        let data = {
            accessToken: this.$getCookie("accessToken"),
            storeId: this.$route.query.storeId,
            pageNumber: "",
            pageSize: ""
        };
        this.$post(this.$host + "/api/store/payment/query/page", data).then(d => {
            if (d.success) {
                if (d.pageData.content.length == 0) {
                    this.datas = {
                        pgathAcct: "无",
                        pgathAcctName: "无",
                        pgathBankName: "无",
                        pgathBankNo: "无",
                        ppayType: "无"
                    };
                    this.addIsActive = true;
                } else {
                    this.datas = d.pageData.content[0];
                }
            }
        });
    }
};
</script>
<style scoped>
.btn_wrap {
  margin-bottom: 12px;
}

.Border input {
  border: 1px solid transparent;
}

@import "../../../../../static/commonStyle.css";
</style>
<style>

</style>
