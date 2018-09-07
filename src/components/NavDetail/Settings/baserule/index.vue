<template>
  <div class="baserule">
      <ul>
          <li class="clearfix">
              <div class="left">系统重命名：</div>
              <div class="right">
                    <Input placeholder="店务管理系统" :value="paraSet.sysNm" arguName="sysNm" @sonInput="upInput" />
              </div>
          </li>
          <li class="clearfix">
              <div class="left">金额保留小数点后2位，超出时：</div>
              <div class="right">
                    <el-radio-group v-model="paraSet.dec">
                        <el-radio :label="0">抹零</el-radio>
                        <el-radio :label="1">四舍五入</el-radio>
                    </el-radio-group>
              </div>
          </li>
          <li class="clearfix">
              <div class="left">显示客户手机时：</div>
              <div class="right">
                    <el-radio-group v-model="paraSet.isHideCell">
                        <el-radio :label="0">隐藏中间4位，如：138****8888 </el-radio>
                        <el-radio :label="1">完全显示，如：13888888888</el-radio>
                    </el-radio-group>
              </div>
          </li>
          <li class="clearfix">
              <div class="left">收款是否需要客户确认：</div>
              <div class="right">
                    <el-radio-group v-model="paraSet.pmCof">
                        <el-radio :label="0">必须客户确认</el-radio>
                        <el-radio :label="1">无需客户确认</el-radio>
                    </el-radio-group>
              </div>
          </li>
          <li class="clearfix">
              <div class="left">收款是否需要审核：</div>
              <div class="right">
                    <el-radio-group v-model="paraSet.pmAud">
                        <el-radio :label="0">必须审核</el-radio>
                        <el-radio :label="1">无需审核</el-radio>
                    </el-radio-group>
              </div>
          </li>
           <li class="clearfix">
              <div class="left">消费是否需要客户确认：</div>
              <div class="right">
                    <el-radio-group v-model="paraSet.conCof">
                        <el-radio :label="0">必须客户确认  </el-radio>
                        <el-radio :label="1">无需客户确认</el-radio>
                    </el-radio-group>
              </div>
          </li>
           <li class="clearfix">
              <div class="left">分配消费提成前是否需要填写护理日志：</div>
              <div class="right">
                    <el-radio-group v-model="paraSet.perLog">
                        <el-radio :label="0">必须填写护理日志</el-radio>
                        <el-radio :label="1">无需填写护理日志</el-radio>
                    </el-radio-group>
              </div>
          </li>
           <li class="clearfix">
              <div class="left">休眠时长：</div>
              <div class="right">
                    <Input placeholder="6" :value="paraSet.sleepTime" arguName="sleepTime" @sonInput="upInput" :onkeyup="onkeyup"/> 月
              </div>
          </li>
           <li class="clearfix">
              <div class="left">会员等级晋升的判断维度：</div>
              <div class="right">
                    <Select :SelecttemData="SelecttemStatus" :values="paraSet.custLvl" arguName="custLvl" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
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
export default {
  components: {
    Input,
    Select,
    Button
  },
  data() {
    return {
      radio: 1,
      SelecttemStatus: [
        { key: 1, value: "累计实付金额" },
        { key: 2, value: "累计消费金额" },
        { key: 3, value: "累计获得积分" },
        { key: 4, value: "成长值" }
      ],
      paraSet: {
        sysNm:"",
        dec: 1,
        isHideCell: 0,
        pmCof: 0,
        pmAud: 0,
        conCof: 0,
        perLog: 0,
        custLvl: 1,
        sleepTime:""
      }
    };
  },
  methods: {
    onkeyup(value){
        value.target.value = value.target.value.replace(/[^\d]/g,"");  //清除“数字”以外的字符   
        if(value.target.value.indexOf(".")< 0 && value.target.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
            value.target.value= parseFloat(value.target.value);  
        } 
    },
    upInput(value, arguName) {
      this["paraSet"][arguName] = value;
    },
    submit(){
        let subparaSet=new Object();
        if(this.paraSet.sysNm===""){
            subparaSet.sysNm="店务管理系统";
        }else{
            subparaSet.sysNm=this.paraSet.sysNm;
        }
        if(this.paraSet.sleepTime===""){
            subparaSet.sleepTime=6;
        }else{
            subparaSet.sleepTime=this.paraSet.sleepTime;
        }
        subparaSet.dec=this.paraSet.dec;
        subparaSet.isHideCell=this.paraSet.isHideCell;
        subparaSet.pmCof=this.paraSet.pmCof;
        subparaSet.pmAud=this.paraSet.pmAud;
        subparaSet.conCof=this.paraSet.conCof;
        subparaSet.perLog=this.paraSet.perLog;
        subparaSet.custLvl=this.paraSet.custLvl;
        this.$post(this.$host+"/api/sysmgr/ccorp/setMerchantInfo",{paraSet:JSON.stringify(subparaSet)}).then(d=>{
            if(d.success){
                this.$message({
                    type:"success",
                    message:"设置成功"
                })
            }
        })
    },
    getinfo(){
        this.$post(this.$host+"/api/sysmgr/ccorp/getMerchantInfo",{type:1}).then(d=>{
            if(d.success){
                let paraSet=d.data.paraSet;
                let getparaSet={};
                if(paraSet){
                    getparaSet=JSON.parse(paraSet);
                    console.log(getparaSet)
                    this.paraSet.sysNm=getparaSet.sysNm||"";
                    this.paraSet.dec=getparaSet.dec;
                    this.paraSet.isHideCell=getparaSet.isHideCell||0;
                    this.paraSet.pmCof=getparaSet.pmCof||0;
                    this.paraSet.pmAud=getparaSet.pmAud||0;
                    this.paraSet.conCof=getparaSet.conCof||0;
                    this.paraSet.perLog=getparaSet.perLog||0;
                    this.paraSet.custLvl=getparaSet.custLvl||1;
                    this.paraSet.sleepTime=getparaSet.sleepTime||"";
                }

            }
        })
    },
  },
  created(){
      this.getinfo();
  }
};
</script>
<style scoped>
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


