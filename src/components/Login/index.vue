<template>
    <div class="Login">
        <div class="LoginDetail" v-if="loginShow">
            <div class="register">用户登录</div>
            <div class="InputAccount .clearfix">
                <div class="left">
                    <i class="icon iconPeople"></i>
                    
                </div>
                <div class="right">
                    <input type="text" placeholder="账号" v-model="acct">
                </div>
            </div>
            <div class="Input .clearfix">
                <div class="left">
                    <i class="icon iconpassword" ></i>
                    
                </div>
                <div class="right">
                    <input :type="passwordType" v-model="password" name="passwords" maxlength="20" placeholder="密码" class="password">
                    <i class="icon iconS" :class={iconSH:showS} @click="showHide"></i>
                </div>
            </div>
            <div class="Input YZM clearfix">
                <div class="left">
                    <input  placeholder="输入图形验证码" maxlength="4" v-model="inputMsg" @keyup="onkeyup">
                </div>
                <div class="right">
                    <img :src="'data:img/png;base64,'+this.codeImageBase64" alt="" @click="get_verification">
                </div>
            </div>
            <div class="Account clearfix">
                <div class="right" @click="gotoreset">
                    忘记密码？
                </div>
            </div>
            <div class="Register">
                <button @click="register">登录</button>
            </div>
        </div>
        <div class="LoginDetail reset" v-if="!loginShow">
            <div class="register">密码重置</div>
            <div class="InputAccount .clearfix">
                <input type="text" placeholder="输入手机号" v-model="phone" :onkeyup="onkeyupphone">
            </div>
            <div class="Input YZM clearfix">
                <div class="left">
                    <input  placeholder="动态密码" maxlength="6" v-model="phoneyzm">
                </div>
                <div class="right" id="rightbutton" @click="getyzm" :class="{nocanget:!cangetyzm}">
                    {{rightName+(!cangetyzm?("("+rightmiao+")"):"")}}
                </div>
            </div>
            <div class="InputAccount .clearfix">
                <input :type="resetpasswordType" name="passwords" maxlength="20" placeholder="输入新密码" class="password" v-model="phonescr">
                <i class="icon iconscre" :class={iconSH:showR} @click="showHidereset"></i>
            </div>
            <div class="InputAccount .clearfix">
                <input :type="resetpasswordTypesure" name="passwords" maxlength="20" placeholder="确认新密码" class="password" v-model="phonescrsecond">
                <i class="icon iconscre" :class={iconSH:showRsure} @click="showHideresetsure"></i>
            </div>
            <div class="footer">
                <Button Name="取消" buttonClass="None" @click.native="gotoreset"/>
                <Button Name="确定" @click.native="surereset"/>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapMutations} from "vuex";
    import Button from "../common/Button"
    import axios from "axios"
    export default{
        components: {
            Button  
        },
        data(){
            return{
                rightName:"获取验证码",
                rightmiao:"",
                cangetyzm:true,
                codeImageBase64:"",
                code:"",
                checkToken:"",
                inputMsg:"",
                acct:"",
                password:"",
                passwordType:"password",
                resetpasswordType:"password",
                showS:false,
                showR:false,
                showRsure:false,
                resetpasswordTypesure:"password",
                loginShow:true,
                phone:"",
                phoneyzm:"",
                phonescr:"",
                phonescrsecond:"",
                checkToken:"",
            }
        },
        methods:{
            surereset(){
                if(!this.$checkMobile(this.phone)){
                    if(this.phone==""){
                        this.$message({type:"error",message:"手机号不能为空"})
                    }
                    return;
                }
                if(!this.phoneyzm){
                    this.$message({type:"error",message:"验证码不能为空"})
                    return;
                }
                if(!this.phonescr){
                    this.$message({type:"error",message:"新密码不能为空"})
                    return;
                }
                if(this.phonescr!=this.phonescrsecond){
                    this.$message({type:"error",message:"两次密码不一致，请重新输入"})
                    return;
                }
                let data={
                    phone:this.phone,
                    newPwd:this.phonescr,
                    checkToken:this.checkToken,
                    code:this.phoneyzm
                }
                this.$post(this.$host+"/api/sysmgr/user/getBackPwd",data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"重置密码成功",
                            onClose:()=>{
                                this.gotoreset();
                            }
                        })
                    }
                })
            },
            //获取手机验证码
            getyzm(){
                if(!this.cangetyzm){
                    return;
                }
                if(!this.$checkMobile(this.phone)){
                    if(this.phone==""){
                        this.$message({type:"error",message:"手机号不能为空"})
                    }
                    return;
                }
                let data={
                    phone:this.phone
                }
                this.$post(this.$host+"/api/sysmgr/user/getVerificationCode",data).then(d=>{
                    if(d.success){
                        this.checkToken=d.data.checkToken;
                        this.Countdown();
                        this.cangetyzm=false;
                    }
                })
            },
            Countdown(){
                this.rightName="重新发送";
                this.rightmiao=60;
                let timer=setInterval(()=>{
                    this.rightmiao--;
                    if(this.rightmiao<=0){
                        clearInterval(timer);
                        this.rightmiao="";
                        this.rightName="获取验证码";
                        this.cangetyzm=true;
                    }
                },1000)
            },
            gotoreset(){
                this.loginShow=!this.loginShow;
            },
            onkeyupphone(value){
                value.target.value=value.target.value.replace(/\D/g,'')
            },
            onkeyup(value){
                if(value.keyCode==13){//回车事件
                    this.register();
                }
            },
            showHide(){
                this.showS=!this.showS;
                if(this.showS){
                    this.passwordType="text"
                }else{
                    this.passwordType="password"
                }
            },
            showHideresetsure(){
                this.showRsure=!this.showRsure;
                if(this.showRsure){
                    this.resetpasswordTypesure="text"
                }else{
                    this.resetpasswordTypesure="password"
                }
            },
            showHidereset(){
                this.showR=!this.showR;
                if(this.showR){
                    this.resetpasswordType="text"
                }else{
                    this.resetpasswordType="password"
                }
            },
            ...mapMutations(["getauths"]),
            //获取图形验证码
            get_verification(){
                // axios.get("https://www.baidu.com",{})
                 //获取验证码
                let that=this;
                this.$post(this.$host+"/api/sysmgr/getVerificationCode",{}).then((d)=>{
                    if(d.success){
                        that.codeImageBase64=d.codeImageBase64;
                        that.code=d.respCode;
                        that.checkToken=d.checkToken;
                    }
                });
            },
            register(){//登录
                if(this.$getCookie("accessToken")){
                    this.$router.replace({
                        path:"/index"
                    })
                    return ;
                }
                let data={
                    "acct":this.acct||"12345",
                    "password":this.password||"12345",
                    "code":this.inputMsg,
                    "checkToken":this.checkToken
                }
                console.log(JSON.stringify(data))
                let that=this;
                this.$post(this.$host+"/api/sysmgr/loginByCode",data).then((d)=>{
                    if(d.success){
                        this.$setSession("auths",JSON.stringify(d.auths));//用户auths
                        this.$setCookie("accessToken",d.accessToken);//用户token
                        this.$setCookie("belongOrg",d.belongOrg);//用户belongOrg
                        this.$setCookie("belongShop",d.belongShop);//用户belongShop
                        this.$setCookie("uname",d.uname);//用户uname
                        this.$setCookie("ucode",d.ucode);//用户ucode
                        this.$setCookie("dept",d.dept);//用户dept
                        this.$setCookie("shopName",d.shopName);//用户shopName
                        this.$setCookie("workNo",d.workNo);//用户workNo
                        this.$setCookie("sysName",d.sysName);//用户workNo
                        this.$setCookie('uHeader',d.uHeader||'');//用户头像
                        // that.getauths(d.auths);
                        this.$message({
                            type:"success",
                            message:"登录成功",
                            duration:"800",
                            onClose:()=>{
                                this.$router.replace({
                                    path:"/index"
                                })
                            }
                        })
                        
                    }else{
                        this.get_verification();
                    }
                })
            },
        },
        mounted () {
            this.get_verification();
        }
    }
</script>
<style scoped>
    .reset .InputAccount{
        position: relative;
    }
    .iconscre::before{
        content: "\E7D3";
        position: absolute;
        right: 1.25rem;
        top: 0;
        cursor: pointer;
        z-index: 1;
        font-size: 14px;
    }
    .iconscre.iconSH::before{
        content: "\E7D2";
    }
    .footer{
        margin-top: 6px;
        margin-bottom: 30px;
        text-align: center;
    }
    .footer button:last-child{
        margin-left: 24px;
    }
    #rightbutton {
        text-align: center;
        color: #fff;
        background: #2CBCC8;
        border-radius: 2px;
    }
    #rightbutton.nocanget{
        color: #999;
        background: #efefef;
    }
    #rightbutton.nocanget:hover{
        background: #efefef;
    }
    #rightbutton:hover{
        background: #7ad0d8;
    }
    .register{
        font-size: 20px;
        color: #5d717c;
        text-align: center;
        padding: 17px 0;
    }
   .Login{
       background: url("../../../static/img/LoginBg.jpg") no-repeat;
       /* background-size:100% 100%; */
       background-position: top center;
       width: 100%;
       height: 100%;
   }
   .iconS.iconSH::before{
        content: "\e7d2";
   }
   .iconS::before{
       content: "\e7d3";
       position: absolute;
        right: 1.25rem;
        top: 0;
        cursor: pointer;
        z-index: 1;
        font-size: 14px;
   }
   .iconPeople::before{
       content: "\e677";
   }
   .iconPeople,.iconpassword{
       font-size: 14px;
   }
   .iconpassword::before{
    content: "\e652";
   }
   input.password::-webkit-input-safebox-button{
       display:none;
   }
   .LoginDetail{
        position: absolute;
        top:50%;
        right: 16%;
        width: 360px;
        padding: 0 60px;
        transform: translateY(-50%);
        background: #fff;
        border-radius: 4px;
   }
   .headerImg{
       width: 11rem;
       border-radius: .833333rem;
       margin-bottom: 4.416667rem;
   }
   .Input,.InputAccount{
       overflow: hidden;
       margin-bottom: 24px;
       background: #fff;
       padding-left: 12px;
       font-size: 12px;
       border-radius: 2px;
       height: 36px;
       line-height: 36px;
       text-align: left;
       border: 1px solid #dcdfe6;
   }
   .Input .left{
       float: left;
       text-align: left;
   }
   .Input .right{
       float: right;
       width: 93%;
       position: relative;
       padding-left: 6px;
       font-size: 12px;
   }
   .InputAccount .left{
       float: left;
       text-align: left;
   }
   .InputAccount .right{
        float: right;
        width: 93%;
       padding-left: 6px;
       font-size: 12px;
   }
   .Input input,.InputAccount input{
       border: none;
       width: 100%;
       color: #666;
       font-size: 12px !important;
       background: #fff;
       height: 26px;
       line-height: 26px !important; 
   }
   .reset .Input.YZM{
       margin-bottom: 24px;
   }
   .Input.YZM{
       background: transparent;
   }
   .Input.YZM {
    padding-left: 0;
    margin-bottom: 0;
    border: none;
   }
   .Input.YZM .left{
        background: #fff;
        width: 120px;
        float: left;
        border-radius: 2px;
        padding: 0 .833333rem;
        color: #666;
        border: 1px solid #dcdfe6;
        height: 36px;
        line-height: 36px;
   }
   .Input.YZM .right{
        /* background: rgba(255, 255, 255, 0.48); */
        float: right;
        width: 100px;
        height: 100%;
        cursor: pointer;
        text-align: right;
   }
   .Input.YZM .right img{
       width: 100%;
       border-radius: .833333rem;
   }
   .Account{
        font-size:1.333333rem;
   }
   .Account .right{
       float: left;
       margin-top: 15px;
       color: #2CBCC8;
       font-size: 12px;
       cursor: pointer;
   }
   .Register button{
        background: #2CBCC8;
        border-radius: 2px;
        cursor: pointer;
        height: 36px;
        line-height: 36px;
        color: #fff;
        width: 100%;
        margin-bottom: 30px;
        margin-top: 30px;
   }
</style>