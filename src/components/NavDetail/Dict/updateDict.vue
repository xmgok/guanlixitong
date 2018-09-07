<template>
    <div class="addSysparas right_content_wrap">
        <div class=" right_content">
            <div class='update_sysparas update_content'>
                <ul class="">
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>字典编号：</div>
                        <div class="update_main">
                            <input class="x_input" type="text" v-model="datas.dCode" @blur="verifyFun('dCode')">
                            <a class="x_error" v-if="verify.dCode">
                                必填
                            </a>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>字典名称：</div>
                        <div class="update_main">
                            <input class="x_input" type="text" v-model="datas.dName" @blur="verifyFun('dName')">
                            <a class="x_error" v-if="verify.dName">
                                必填
                            </a>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            字典分类：</div>
                        <div class="update_main">
                            <Select :SelecttemData="SelecttemData" :clearable='false' :values="datas.dType" :widths='iptWidth' arguName="dType" :SelecttemDetail="['key','value']" @sonSelect="upSelect" />

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>字典健：</div>
                        <div class="update_main">
                            <input class="x_input" type="text" v-model="datas.dKey" @blur="verifyFun('dKey')">
                            <a class="x_error" v-if="verify.dKey">
                                必填
                            </a>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>字典健名：</div>
                        <div class="update_main">
                            <input class="x_input" type="text" v-model="datas.dKeyname" @blur="verifyFun('dKeyname')">
                            <a class="x_error" v-if="verify.dKeyname">
                                必填
                            </a>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>字典值：</div>
                        <div class="update_main">
                            <input class="x_input" type="text" v-model="datas.dValue" @blur="verifyFun('dValue')">
                            <a class="x_error" v-if="verify.dValue">
                                必填
                            </a>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            是否固定：</div>
                        <div class="update_main">
                            <Select :SelecttemData="SelecttemDataFixed" :clearable='false' :values="datas.dIsFixed" :widths='iptWidth' arguName="dIsFixed" :SelecttemDetail="['key','value']" @sonSelect="upSelect" />

                        </div>
                    </li>
                    <li>
                        <div class="update_tit">
                            <i class="icon waring"></i>上级字典编号：</div>
                        <div class="update_main">
                            <input class="x_input" type="text" v-model="datas.dParentCode" @blur="verifyFun('dParentCode')">
                            <a class="x_error" v-if="verify.dParentCode">
                                必填
                            </a>
                        </div>
                    </li>
                </ul>
                <div class="btn_wrap">
                    <Button Name='取消' @click.native="cancle" buttonClass="None"></Button>
                    <Button Name='提交' @click.native="submit"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Select from "@/components/common/Select";
export default {
    components: { Input, Button, Select },
    data() {
        return {
            SelecttemDataFixed: [
                { key: 0, value: "否" },
                { key: 1, value: "是" },
            ],
            SelecttemData: [
                { key: 0, value: "公共" },
                { key: 1, value: "归属" },
                { key: 2, value: "变量" },
            ],
            headerTitle: '新增数据字典',
            pageNum: 1,
            iptWidth: "160px",
            dType: 0,
            // dIsFixed: 0,
            datas: {
                dCode: "",
                dName: "",
                dType: 0,
                dKey: "",
                dKeyname: "",
                dValue: "",
                dIsFixed: 0,
                dParentCode: ""
            },
            //验证
            verify: {
                dCode: false,
                dName: false,
                dType: false,
                dKey: false,
                dKeyname: false,
                dValue: false,
                // dIsFixed: false,
                dParentCode: false
            },
        }
    },
    methods: {
        verifyFun(el) {
            let tv = this.verify;
            let tn = this.datas;
            !tn[el] ? tv[el] = true : tv[el] = false;
        },

        isSubFun(ver, val) {
            let len = 0;
            for (let key in ver) {
                if (val[key] === '' || val[key] === null) {
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

        upSelect(value, argu) {
            this.datas[argu] = value;
        },

        upDatas(val, key) {
            this.datas[key] = val;
            if (val === "") {
                this.verify[key] = true;
            } else {
                this.verify[key] = false;
            }
        },



        //update
        update() {
            let message = '';
            let url = '';
            if (this.$route.query.update != undefined) {//修改
                message = '修改成功！'
                url = "/api/sysmgr/dict/update";

            } else {//新增
                message = '新增成功！'
                url = "/api/sysmgr/dict/add";
            }
            this.$post(this.$host + url, this.datas).then(d => {
                if (d.success) {
                    this.$message({
                        type: 'success',
                        message: message,
                        duration: "1000",
                        onClose: () => {
                            history.back(-1)
                        }
                    });
                }
            })
        },

        //修改
        submit() {
            if(this.$stop()){return} 
            if (this.isSubFun(this.verify, this.datas)) {
                this.update();
            } else {
                this.$message({
                    message: '有必填信息未填写！',
                    type: 'warning',
                    duration: "1000",
                })
            }


        },
        //撤销
        cancle() {
            history.back(-1)
        }
    },
    mounted() {
        if (this.$route.query.id != undefined) {
            this.headerTitle = "修改数据字典"
            let id = this.$route.query.id;
            let that = this;
            this.$post(this.$host + "/api/sysmgr/dict/getOne/" + id, { accessToken: this.$getCookie("accessToken") }).then(d => {
                if (d.success) {
                    that.datas = d.dictDTO;
                    this.dType = this.datas.dType;
                    this.dIsFixed = this.datas.dIsFixed;
                    // this.SelecttemData.map(el=>{
                    //     if(that.datas.dType==el.key){
                    //         this.dTypeName=el.key;
                    //     }
                    // })
                }
            })
        }
    }
}
</script>
<style scoped>
@import "../../../../static/commonStyle.css";

.btn_wrap {
  margin: 40px 0;
  text-align: left;
}
.btn_wrap button:first-child {
  margin-right: 24px;
  margin-left: 160px;
}

</style>