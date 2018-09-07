<template>
    <div>
        <div class="x_sure">
            <div class='x_sure_header'>
                客户确认单
                <div class="x_sure_header_rt">
                    <Button Name="下载"></Button>
                    <Button Name="打印"></Button>
                </div>

            </div>
            <div class="x_sure_content">
                <!-- <p>尊敬的客户：</p> -->
                <div class="x_sure_main">
                    <ul>
                        <!-- <li>您的余额账户最新交易信息</li> -->
                        <li>
                            <span>姓名：</span>
                            {{datas.cName}}（{{datas.cCode}}）</li>
                        <li>
                            <span>交易时间：</span>
                            {{datas.createTime}}
                        </li>
                        <li>
                            <span>交易商户：</span>
                            {{datas.sName}}
                        </li>
                        <li>
                            <span>交易类型：</span>
                            {{typetran}}
                        </li>
                        <li>
                            <span>交易金额： </span>
                            {{datas.amount}}
                        </li>
                    </ul>
                    <div class="dealDetail" v-show="billNo">
                        交易详情：
                        <el-table :data="datas.prodList" border style="width: max-content" >
                            <el-table-column  prop="fwName" label="服务名称" width="120"></el-table-column>
                            <el-table-column  prop="dPrice" label="价格" width="120"></el-table-column>
                            <el-table-column  prop="dTimes" label="数量" width="120"></el-table-column>
                            <el-table-column  prop="tkName" label="套卡消耗" width="120">
                                <template slot-scope="scope">
                                    {{scope.row.tkName==null?"未使用":scope.row.tkName}}
                                </template>
                            </el-table-column>
                            <el-table-column min-width='1'></el-table-column>
                        </el-table>
                    </div>
                    <p>
                        您的余额账户消费后可用余额￥{{datas.usableAllAmo}}，其中可用实付金额￥{{datas.usableRealityAmo}}，可用赠送金额￥{{datas.usableDonateAmo}}
                    </p>
                    <p>
                        本人已认真审查本单据内容，并已要求工作人员进行说明。本人对本单据内容无疑问、无异议。特此确认！
                    </p>
                    <div class="signature_area_content">
                        <div class="signature_area_main">
                            <span class="left">
                                顾客签名：
                            </span>
                            <div class="container signature_area" id="container">
                                <span>
                                    签名区域
                                </span>
                            </div>
                        </div>
                        <div class="btn_wrap">
                            <Button Name="保存签名" @click.native="submit"></Button>
                            <Button Name="重新签名"></Button>
                            <Button Name="上传拍照"></Button>
                        </div>

                    </div>
                </div>

            </div>
            <div class="x_sure_footer">
                <p>
                    业务单号：{{this.billNo||this.rcptNo||this.resurl}} 操作门店：{{this.$getCookie("shopName")}} 操作人：{{this.$getCookie("uname")}} 
                    <!-- 创建时间：{{datas.createTime}} -->
                </p>
                <!-- <p>
                    门店电话：010-88862885 总部咨询电话：400-888-999-5 总部投诉电话：400-8813-555
                </p> -->
            </div>
        </div>
    </div>
</template>

<script>
import Button from "../../../common/Button";
import {mapMutations,mapState} from "vuex"
export default {
    components: {
        Button,
    },
    data() {
        return {
            typetran:"预存收款",
            datas: {},
            rcptNo:"",
            resurl:"",
            billNo:"",
        }
    },
    beforeRouteLeave(to, from, next) {
        if(to.path=="/NavDetail/Order"){
            this.setDatas({name:"newOrder",value:true})
        }else if(to.path=="/NavDetail/Receipt"){
            this.setDatas({name:"newReceipt",value:true})
        }else if(to.path=="/NavDetail/OpenCard"){
            this.setDatas({name:"newOpenCard",value:true})
        }
        next()
    },
    methods: {
        ...mapMutations(["setDatas"]),
        // 保存签名
        submit(){
            if(this.rcptNo){
                let data={
                    "rcptNo": this.rcptNo,
                    signImg:"123"
                }
                this.$post(this.$host+"/api/order/receiptbill/affirm", data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"保存签名成功"
                        })
                        if(this.resurl){
                            this.$router.push({
                                path:this.resurl
                            })
                        }else{
                            this.$router.push({
                                path:"/NavDetail/Receipt"
                            })
                        }
                    }
                })
            }else if(this.billNo){
                let data={
                    "billNo": this.billNo,
                    signImg:"123"
                }
                this.$post(this.$host+"/api/order/consume/sign", data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"保存签名成功"
                        })
                        if(this.resurl){
                            this.$router.push({
                                path:this.resurl
                            })
                        }else{
                            this.$router.push({
                                path:"/NavDetail/Receipt"
                            })
                        }
                    }
                })
            }
        },
    },
    mounted() {
        this.rcptNo=this.$route.query.rcptNo||"";
        this.billNo=this.$route.query.billNo||"";
        this.resurl=this.$route.query.resurl||"";
        if(this.rcptNo){
            let data = {
                "rcptNo": this.rcptNo,
            }
            this.$post(this.$host + "/api/order/receiptbill/signdet", data).then(d => {
                if (d.success) {
                    d.data.createTime = this.$dateFormat('yy-MM-dd hh:mm:ss', d.data.createTime);
                    for (var key in d.data) {
                        if (d.data[key] == null) {
                            d.data[key] = "0"
                        }
                    }
                    this.datas = d.data;
                }
            });
        }else if(this.billNo){
            let data = {
                "billNo": this.billNo,
            }
            this.$post(this.$host + "/api/order/consume/signdet", data).then(d => {
                if (d.success) {
                    this.typetran="消费";
                    d.createTime = this.$dateFormat('yy-MM-dd hh:mm:ss', d.createTime);
                    d.amount=d.totalMoney;
                    d.usableAllAmo=d.accCurTotal;
                    d.usableRealityAmo=d.accCurAmount;
                    d.usableDonateAmo=d.accCurCashcou;
                    this.datas=d;
                }
            });
        }
        
    }

}
</script>
<style scoped>
.left {
  float: left;
}
.right {
  float: right;
}
.signature_area {
  height: 240px;
  margin: 6px 0;
  margin-left:60px;
}
.signature_area_content {
  margin: 20px 0;
}
.x_sure {
  display: inline-block;
  margin: 20px;
}
.x_sure_main ul + p {
  margin-bottom: 24px;
}
.x_sure_header {
  padding: 12px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  position: relative;
}
.x_sure_header_rt {
  position: absolute;
  right: 12px;
  top: 12px;
}
.x_sure_content {
  padding: 12px;
  padding-right: 24px;
}
/* .sure_main {
  padding-left: 24px;
} */
.x_sure_main span {
  display: inline-block;
  width: 60px;
  text-align: right;
}
.x_sure_main p,
.x_sure_main li {
  margin: 4px 0;
}
.x_sure_footer {
  padding: 12px;
  text-align: right;
}
.signature_area_main::after {
  content: "";
  clear: both;
  display: block;
}
.btn_wrap {
  text-align: right;
}
</style>