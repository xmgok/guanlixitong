<template>
    <div class="right_content_wrap add_nurse">
        <div class="right_content">

            <div class="update_content">

                <ul>
                    <li>
                        <div class="update_tit">会员姓名：</div>
                        <div class="update_main">
                            {{cName}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">护理日期：</div>
                        <div class="update_main">
                            {{date}}
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">护理盘点：</div>
                        <div class="update_main">
                            <span v-if='isSee'>{{data.careLog}}</span>
                            <textarea v-if='!isSee' v-model='data.careLog' name="" id="" cols="40" rows="3"></textarea>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">潜在需求：</div>
                        <div class="update_main">
                            <span v-if='isSee'>{{data.cDemand}}</span>
                            <textarea v-if='!isSee' v-model='data.cDemand' name="" id="" cols="40" rows="3">
                            </textarea>
                        </div>
                    </li>
                    <li>
                        <div class="update_tit">备注：</div>
                        <div class="update_main">
                            <span v-if='isSee'>{{data.remark}}</span>
                            <textarea v-if='!isSee' v-model='data.remark' name="" id="" cols="40" rows="3"></textarea>
                        </div>
                    </li>
                    <li class="col_1">
                        <div class="update_tit">重要程度：</div>
                        <div class="update_main">
                            <el-rate :disable='isSee' v-model="data.careDegree">
                            </el-rate>
                        </div>
                    </li>
                </ul>
                <div class="btn_wrap ">
                    <Button Name="取消 " buttonClass='None' @click.stop.native="goBack "></Button>
                    <Button Name="保存 " :plain="true " @click.stop.native="submit() "></Button>
                </div>
            </div>

        </div>

    </div>
</template>

<script>


import Button from "@/components/common/Button";
export default {
    components: { Button },
    data() {
        return {
            isSee: false,
            //headerTitle
            headerTitle: '填写护理日志',

            data: {
                billNo: "",
                cStore: "",
                cCode: "",
                careLog: "",
                cDemand: "",
                remark: "",
                careDegree: 0
            },

            //选择客户的名字
            cName: '',

            //date
            date: '',


        }
    },
    methods: {

        //取消
        goBack() {
            history.back(-1);
        },

        //提交
        submit() {
            if (this.$route.query.id !== '_add') {//编辑
                let par = {
                    id: this.data.id,
                    careLog: this.data.careLog,
                    cDemand: this.data.cDemand,//潜在需求
                    remark: this.data.remark,//备注
                    careDegree: this.data.careDegree,//重要程度(1-5)
                }
                par.cStore = this.$getCookie('belongShop');
                this.$post(this.$host + "/api/order/servlog/update", par).then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration: "1500",
                            onClose: () => {
                                this.goBack();
                                this.data = {
                                    billNo: "",
                                    cStore: "",
                                    cCode: "",
                                    careLog: "",
                                    cDemand: "",
                                    remark: "",
                                    careDegree: 5
                                }
                            }
                        });
                    }
                });
            } else {//新增
                let par = this.data
                par.cStore = this.$getCookie('belongShop');
                this.$post(this.$host + "/api/order/servlog/add", par).then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '新增成功!',
                            duration: "1500",
                            onClose: () => {
                                this.goBack();
                                this.data = {
                                    billNo: "",
                                    cStore: "",
                                    cCode: "",
                                    careLog: "",
                                    cDemand: "",
                                    remark: "",
                                    careDegree: 5
                                }
                            }
                        });
                    }
                });
            }
        },

    },
    mounted() {
        if (this.$route.query.type === '_see') { //查看
            this.isSee = true;
            let par = {
                id: this.$route.query.id
            }
            this.$post(this.$host + "/api/order/servlog/query", par).then(d => {
                if (d.success) {
                    // this.data = d;
                    this.cName = d.cName;
                    this.date = this.$dateFormat('yy-MM-dd', d.servTime);
                    this.data = d;
                }
            });
        } else if (this.$route.query.type === '_edit') {// 编辑
            let par = {
                id: this.$route.query.id
            }
            this.$post(this.$host + "/api/order/servlog/query", par).then(d => {
                if (d.success) {
                    // this.data = d;
                    this.cName = d.cName;
                    this.date = this.$dateFormat('yy-MM-dd', d.servTime);
                    this.data = d;
                }
            });

        } else {    //新增
            this.cName = this.$route.query.cName;
            this.data.billNo = this.$route.query.billNo;
            this.data.cCode = this.$route.query.cCode;
            this.date = this.$route.query.date;

        }
    }
}    
</script>

<style scoped>
@import "../../../../../static/commonStyle.css";

.btn_wrap {
  margin: 24px 0;
  text-align: center;
}
</style>
<style>
.add_nurse .el-rate {
  margin-top: 3px;
}
</style>


