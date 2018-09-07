<template>
    <div>
        <div class="sure">
            <div class='sure_header'>
                会员确认单
                <div class="sure_header_rt">
                    <Button Name="下载"></Button>
                    <Button Name="打印"></Button>
                </div>

            </div>
            <div class="sure_content">
                <!-- <p>尊敬的客户：</p> -->
                <div class="sure_main">
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
                            预存收款
                        </li>
                        <li>
                            <span>交易金额： </span>
                            {{datas.amount}}
                        </li>
                    </ul>
                    <p>
                        您的余额账户当前可用总额￥{{datas.usableAllAmo}}，其中可用实付金额￥{{datas.usableRealityAmo}}，可用赠送金额￥{{datas.usableDonateAmo}}
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
            <div class="sure_footer">
                <p>
                    业务单号：201801196398345 操作门店：A门店 操作人：樊小美 创建时间：2018-01-19 15:43:23
                </p>
                <p>
                    门店电话：010-88862885 总部咨询电话：400-888-999-5 总部投诉电话：400-8813-555
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import Button from "../../../common/Button";


export default {
    components: {
        Button,
    },
    data() {
        return {
            datas: '',
            rcptNo:"",
        }
    },
    methods: {
        // 保存签名
        submit(){
            this.$router.push({
                path:"/NavDetail/Receipt"
            })
        },
    },
    mounted() {
        this.rcptNo=this.$route.query.rcptNo||"";
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
  border: 1px solid #666;
  height: 240px;
  margin: 6px 0;
  width: calc(100% - 60px);
  float: left;
}
.signature_area_content {
  margin: 20px 0;
}
.sure {
  border: 1px solid #ccc;
  display: inline-block;
  margin: 20px;
}
.sure_main ul + p {
  margin-bottom: 24px;
}
.sure_header {
  padding: 12px;
  background-color: #f3f3f3;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  position: relative;
  border-bottom: 1px solid #ccc;
}
.sure_header_rt {
  position: absolute;
  right: 12px;
  top: 12px;
}
.sure_content {
  padding: 12px;
  padding-right: 24px;
}
/* .sure_main {
  padding-left: 24px;
} */
.sure_main span {
  display: inline-block;
  width: 60px;
  text-align: right;
}
.sure_main p,
.sure_main li {
  margin: 4px 0;
}
.sure_footer {
  padding: 12px;
  background-color: #f3f3f3;
  border-top: 1px solid #ccc;
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