<template>
  <div class="baserule">
      <ul>
          <li class="clearfix">
              <div class="left"><i class="waring icon"></i>商户名称：</div>
              <div class="right">
                    <Input placeholder="奈瑞儿塑身美颜连锁" :value="cName" arguName="cName" @sonInput="upInput"  maxlength="12" />
                    <i  class="pleft warings" v-show="cNameShow">必填</i>
                    <br/>
                    <i>字数上限为12个汉字</i>
              </div>
          </li>
          <li class="clearfix">
              <div class="left"><i class="waring icon"></i>商户LOGO：</div>
              <div class="right">
                    <upload :url='cLogo'  @sonInput='uploadimg'   imgType="logo"/>
                    <i  class="pleft warings" v-show="cLogoShow">必填</i>
              </div>
          </li>
          <li class="clearfix">
              <div class="left">官方网站：</div>
              <div class="right">
                    <Input placeholder="http://" :value="netAddr" arguName="netAddr" @sonInput="upInput" />
              </div>
          </li>
           <li class="clearfix">
              <div class="left">客服热线：</div>
              <div class="right">
                    <Input placeholder="" :value="cLinkTel" arguName="cLinkTel" @sonInput="upInput" />
              </div>
          </li>
          <li class="clearfix">
              <div class="left">商户简介：</div>
              <div class="right">
                  <Textarea  arguName="cRemark" @sonTextarea="upInput" :values="cRemark"/>
              </div>
          </li>
          <li class="clearfix">
              <div class="left">客户协议：</div>
              <div class="right">
                  <Textarea  />
              </div>
          </li>
          
      </ul>
      <footer>
          <Button @click.native="submit"/>
      </footer>
  </div>
</template>
<script>
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import Select from "../../../common/Select";
import upload from "../../../common/upload";
import Textarea from "../../../common/Textarea";

export default {
  components: {
    Input,
    Select,
    Button,upload,Textarea
  },
  data() {
    return {
        cNameShow:false,
        cLogoShow:false,
      radio: 1,
      SelecttemStatus: [
        { key: 1, value: "累计实付金额" },
        { key: 2, value: "累计消费金额" },
        { key: 3, value: "累计获得积分" },
        { key: 4, value: "成长值" }
      ],
      cName:"",
      cLogo:"",
      netAddr:"",
      cLinkTel:"",
      cRemark:"",
      custProt:"",
    };
  },
  methods: {
    upInput(value, arguName) {
        if(arguName=="cName"){
            if(value==""){
                this.cNameShow=true;
            }else{
                this.cNameShow=false;
            }
        }
      this[arguName] = value;
    },
    uploadimg(value,arguName){
        if(value){
            this.cLogoShow=false;
        }
        this.cLogo=value;
    },
    submit(){
        if(!this.cName){
            this.cNameShow=true;
            return;
        }
        if(!this.cLogo){
            this.cLogoShow=true;
            return;
        }
        let data={
            netAddr:this.netAddr,
            cRemark:this.cRemark,
            cLinkTel:this.cLinkTel,
            cName:this.cName,
            cLogo:this.cLogo,
            custProt:this.custProt,
        }
        this.$post(this.$host+"/api/sysmgr/ccorp/setMerchantInfo",data).then(d=>{
            if(d.success){
                this.$message({
                    type:"success",
                    message:"设置成功"
                })
            }
        })
    },
    getinfo(){
        this.$post(this.$host+"/api/sysmgr/ccorp/getMerchantInfo",{type:0}).then(d=>{
            if(d.success){
                this.cName=d.data.cName;
                this.cLogo=d.data.cLogo;
                this.netAddr=d.data.netAddr;
                this.cLinkTel=d.data.cLinkTel;
                this.custProt=d.data.custProt;
                this.cRemark=d.data.cRemark;

            }
        })
    },
  },
  mounted(){
      this.getinfo();
  }
};
</script>
<style scoped>
.waring::before {
  content: "\e69b";
  color: #FF5500;
}
.warings.pleft{
    color: #FF5500;
}
.pleft{
    padding-left: 1rem;
    color:#999;
}
li .left {
  width: 40%;
  text-align: right;
  padding-right: 10px;
  padding-bottom: 12px;
}
li .right {
  width: 60%;
}
footer {
  text-align: center;
  margin-top: 24px;
}
</style>


