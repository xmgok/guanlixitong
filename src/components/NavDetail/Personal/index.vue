<template>
    <div class="Personal">
        <div class="PersonalContent" >
            <div class="ContentInfo">
                <div class="headInfo">
                    <img :src="uHEADER?uHEADER:'../../../../static/img/header.png'" class="HeadInfoImg">
                    <div class="InfoName">{{uNAME}}</div>
                    <div class="InfoSel">{{uSEX?'男':'女'}}|{{uTEL}}</div>
                    <button class="InfoButton" @click.stop="logOut">退出登录</button>
                </div>
                <ul class="InfoList">
                    <li v-for="(item,index) in List" :key="index" @click.stop="navigation(index,item)"><i :class="{active:item.active}"></i> {{item.name}}</li>
                </ul>
            </div>
            <div class="PersonalBox">
                <div class="PersonalHeader">{{Index?'个人密码修改':'个人资料设置'}}</div>                
                <div v-if="Index==0">
                    <div class="portrait">
                        <img :src="uHeader?uHeader:'../../../../static/img/header.png'"  @click.stop="HeadShow=!HeadShow" class="portraitImg">
                        <div class="Modifyportrait" @click.stop="HeadShow=!HeadShow">修改头像</div>
                    </div>
                    <div class="portraitBox">
                        <div class="portraitText"><i class="icon waring"></i>姓名：</div>
                        <div class="portraitInput">
                            <Input widths="20rem" Height="3rem" :value="uName" arguName="uName" :maxlength="16" @sonInput="sonInput" :blur="uNameblur"/>
                            <i class="error" v-show="uNameShow">必填</i>
                            <i class="error" v-show="uNameDisplay">用户名称不能有特殊字符</i>                                       
                        </div>
                    </div>
                    <div class="portraitBox">
                        <div class="portraitText"><i class="icon waring"></i>性别：</div>
                        <div class="portraitInput">
                            <el-radio v-model="uSex " :label="0">女</el-radio>
                            <el-radio v-model="uSex " :label="1">男</el-radio>
                        </div>
                    </div>
                    <div class="portraitBox">
                        <div class="portraitText">QQ：</div>
                        <div class="portraitInput">
                            <Input widths="20rem" Height="3rem" :value="uQq" arguName="uQq" @sonInput="sonInput" :maxlength="10"/>                                                    
                        </div>
                    </div>
                    <div class="portraitBox">
                        <div class="portraitText">微信：</div>
                        <div class="portraitInput">
                            <Input widths="20rem" Height="3rem" :value="uWechat" arguName="uWechat" @sonInput="sonInput" :maxlength="20"/>                                                    
                        </div>
                    </div>
                    <div class="portraitBox">
                        <div class="portraitText"><i class="icon waring"></i>手机号码：</div>
                        <div class="portraitInput">
                            <Input widths="20rem" Height="3rem" :value="uTel" arguName="uTel" :maxlength="11" @sonInput="sonInput" :blur="uTelblur"/>
                            <i class="error" v-show="uTelShow">必填</i>
                            <i class="error" v-show="uTelDisplay">手机号码格式错误!</i>                                            
                        </div>
                    </div>
                    <div class="portraitBox">
                        <div class="portraitText">电子邮件：</div>
                        <div class="portraitInput">
                            <Input widths="20rem" Height="3rem" :value="uEmail" arguName="uEmail" @sonInput="sonInput" :blur="uEmailblur"/>
                            <i class="error" v-show="uEmailDisplay">邮箱格式不正确!</i>                                     
                        </div>
                    </div>
                    <div class="portraitBTn">
                        <button @click="Save">保存</button>  
                    </div>  
                </div>
                <div v-else-if="Index==1">
                    <div class="portraitBox">
                        <div class="portraitText"><i class="icon waring"></i>原始密码：</div>
                        <div class="portraitInput">
                            <Input placeholder="原始密码" :maxlength="16" widths="20rem" Height="3rem" arguName="oldPasswd" @sonInput="sonInput"  :blur="oldPasswdblur" />
                            <i class="error" v-show="oldPasswdShow">必填</i>
                        </div>
                    </div>
                    <div class="portraitBox"> 
                        <div class="portraitText"><i class="icon waring"></i>新密码：</div>
                        <div class="portraitInput">
                            <span class="ChangeBox">
                                <Input placeholder="新密码" :maxlength="16"  widths="20rem" Height="3rem" :type="Newpassword" arguName="uPasswd" @sonInput="sonInput" :blur="uPasswdblur" />
                                <i class="icon NoEyes" :class="{OffEyes:Newpassword=='text'}" @click.stop="NewSwitch"></i>
                            </span>
                            <i class="error" v-show="uPasswdShow">必填</i>
                            <i class="error" v-show="uPasswdDisplay">密码需为6到16位数字或字母组合</i>
                        </div>
                    </div>
                    <div class="portraitBox">
                        <div class="portraitText"><i class="icon waring"></i>确认密码：</div>
                        <div class="portraitInput">
                            <span class="ChangeBox">
                                <Input placeholder="确认密码" :maxlength="16" widths="20rem" Height="3rem" :type="Xinpassword" arguName="NewPasswd" @sonInput="sonInput" :blur="NewPasswdblur" />
                                <i class="icon NoEyes" :class="{OffEyes:Xinpassword=='text'}" @click.stop="XinSwitch"></i>                                      
                            </span>
                            <i class="error" v-show="NewPasswdShow">必填</i> 
                            <i class="error" v-show="NewPasswdDisplay">新密码与确认密码不同</i>  
                        </div>             
                    </div>
                    <div class="portraitBTn">
                        <button @click="Confirm">保存</button>  
                    </div>                  
                </div>
            </div>
        </div>
        <Mtk v-show="HeadShow"/>
        <div v-show="HeadShow" class="bounces">
            <div class="bouncesHeader">修改头像<i class="icon Fork postion" @click.stop="cancel"></i></div> 
            <!-- <div class="bouncesFlex">
                <div>
                    <upload @sonInput="sonInput" :url="imgUrl" arguName="imgUrl"/>                    
                </div>
                <div class="bouncesImg">
                    <img v-if="imgUrl" :src="imgUrl">
                    <div v-if="imgUrl" class="InfoSel">头像预览</div>
                </div>
            </div> -->
            <div class="bouncesFlex">
               <div class="elUpload">
                    <el-upload
                        list-type="picture-card"
                        :data="object"
                        action="https://up.qbox.me"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="onSuccess">
                        <img v-if="imgUrl" :src="imgUrl">
                        <i v-else class="el-icon-plus"></i>
                    </el-upload>
                    <div v-if="imgUrl" class="TheZoom">
                        <i class="icon ZoomIn" @click.stop="ZoomIn"></i>
                        <i class="icon Shrink" @click.stop="Shrink"></i>
                        <i class="icon rotate" @click.stop="rotate"></i>
                    </div>
               </div>
                <div class="bouncesImg">
                    <img v-if="imgUrl" :src="imgUrl">
                    <div v-if="imgUrl" class="InfoSel">头像预览</div>
                </div>
            </div>
            <div class="bouncesBtn">
                <Button Name="取消" class="None" @click.native="cancel"/>                    
                <Button Name="确定" @click.native="submit"/>
            </div>
        </div>
    </div>
</template>

<script>
import upload from '../../common/upload'
import Input from '../../common/Input'
import Button from '../../common/Button'
import Mtk from '../../common/Mtk'
import * as qiniu from 'qiniu-js';
export default {
    components:{upload,Input,Button,Mtk},
    data(){
        return{
            List:[
                {name:'个人资料',value:0,active:true},                
                {name:'密码修改',value:1,active:false},              
            ],
            Index:0,
            id:'',
            uCode:'',
            uEmail:'',
            uEmailDisplay:false,
            uName:'',
            uNAME:'',
            uNameShow:false,
            uNameDisplay:false,
            uSex:'',
            uSEX:'',
            uTel:'',
            uTEL:'',
            uTelShow:false,            
            uTelDisplay:false,            
            uQq:'',
            uWechat:'',
            uHeader:'',
            uHEADER:'',
            HeadShow:false,
            imgUrl:'',
            http:'',
            object:{},
            deg:0,
            count:100,//放大缩小倍数
            oldPasswd:"",//原始密码
            oldPasswdShow:false,
            uPasswd: "",//新密码
            Newpassword:'password',
            uPasswdShow:false,
            uPasswdDisplay:false,               
            NewPasswd:"",//密码确认
            Xinpassword:'password',
            NewPasswdShow:false,
            NewPasswdDisplay:false,
        }
    },
    mounted(){
        this.$post(this.$host+'/api/sysmgr/user/queryone',{logicType:1}).then(d=>{
            if(d.success){
                this.id = d.id
                this.uCode  = d.uCode 
                this.uEmail  = d.uEmail 
                this.uName  = d.uName
                this.uNAME = d.uName
                this.uSex  = d.uSex
                this.uSEX  = d.uSex
                this.uTel  = d.uTel
                this.uTEL  = d.uTel
                this.uQq = d.uQq
                this.uWechat = d.uWechat                
                this.uHeader = d.uHeader     
                this.uHEADER = d.uHeader     
            }
        })
    },
    methods:{
        beforeUpload(file){
            const type = ['image/jpeg', 'image/jpg','image/png', 'image/gif']
            const isJPG = type.some(el => { return el === file.type });
            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isJPG) {
                return this.$message.error('上传图片只能是 jpeg/jpg/png/gif 格式!');
            }
            if (!isLt2M) {
                return this.$message.error('上传图片大小不能超过 2MB!');
            }
            if(isJPG&&isLt2M){
                return this.$post(this.$host+'/api/sysmgr/getQiNiuToken',{ "expireSeconds": "3600", "bucket": "testpic1" }).then(res=>{
                    const key = `${this.$dateFormat("yyMMddhhmmssSS",new Date())}_${file.name}`
                    const token = res
                    this.object = {
                        key:key,
                        token:token
                    } 
            
                })
            }
        },
        onSuccess(res,file){
            this.http = 'http://p3t5upnkj.bkt.clouddn.com/'+res.key+"?imageView2/1/w/200/h/200|imageMogr2"
            this.imgUrl = this.http
        },
        ZoomIn(){
            if(this.count>=150)return
            this.count+=25
            this.imgUrl = this.http+'/thumbnail/!'+this.count+"p/rotate/"+this.deg
        },
        Shrink(){         
            if(this.count<=50)return
            this.count-=25
            this.imgUrl = this.http+'/thumbnail/!'+this.count+"p/rotate/"+this.deg                           
        },
        rotate(){     
           this.deg+=90                   
           if(this.deg>=360){
               this.deg=0
           }       
           this.imgUrl = this.http+'/thumbnail/!'+this.count+"p/rotate/"+this.deg
        },
        logOut(){
            let that = this
            this.$logOut(that)
        },
        navigation(index,item){
            if(this.Index!=index){
                this.List.map(e=>{e.active=false})
                item.active=true
                this.Index=index
            }
        },
        sonInput(value,arguName){
            this[arguName] = value
        },
        uNameblur(){
            if(!this.uName){
                this.uNameDisplay = false
                this.uNameShow = true
                return
            }
            this.uNameShow = false 
            if(/[@#\$%\^&\*]+/g.test(this.uName)){
                return this.uNameDisplay = true
            }
            this.uNameDisplay = false 
        },
        uTelblur(){
            if(!this.uTel){
                this.uTelDisplay = false
                this.uTelShow = true
                return 
            }
            this.uTelShow = false
            if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.uTel)){
                return this.uTelDisplay = true
            }
            this.uTelDisplay = false 
        },
        uEmailblur(){
            if(!this.uEmail)return this.uEmailDisplay = false  
            if(!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.uEmail)){
                return this.uEmailDisplay = true
            }
            this.uEmailDisplay = false
        },
        Save(){
            let CanNot = true
            if(!this.uName){
                this.uNameShow = true
                CanNot = false
            }
            if(this.uNameShowDisplay){
                CanNot = false
            }
            if(!this.uTel){
                this.uTelShow = true
                CanNot = false
            }
            if(this.uTelDisplay){
                CanNot = false
            }
            if(this.uEmailDisplay){
                CanNot = false
            }
            if(!CanNot)return
            let _data ={
                id:this.id,
                uCode:this.uCode,
                uName:this.uName,
                uSex :this.uSex,
                uQq:this.uQq,
                uWechat:this.uWechat,
                uTel:this.uTel,
                uEmail:this.uEmail,
                uHeader:this.uHeader
            }
            this.$post(this.$host+"/api/sysmgr/user/update",_data).then(d =>{
                if(d.success){
                    this.uNAME=this.uName
                    this.uSEX=this.uSex
                    this.uTEL=this.uTel
                    this.uHEADER=this.uHeader
                    this.$setCookie('uHeader',this.uHeader)
                    this.$message({
                        type: 'success',
                        message: '修改成功!',
                        duration:"1000",
                    });
                }
            })
        },
        oldPasswdblur(){
            if(!this.oldPasswd){
                this.oldPasswdShow = true
                return
            }
            this.oldPasswdShow = false
        },
        uPasswdblur(){
            if(!this.uPasswd){
                this.uPasswdShow = true
                this.uPasswdDisplay = false
                return
            }
            this.uPasswdShow = false
            if(!/^([0-9]|[a-zA-Z]){6,16}$/.test(this.uPasswd)){
                this.uPasswdDisplay = true
                return
            }         
            this.uPasswdDisplay = false 
             if(this.NewPasswd && this.NewPasswd != this.uPasswd){
                this.NewPasswdDisplay = true
            }else{
                this.NewPasswdDisplay = false   
            }   
        },
        NewPasswdblur(){
            if(!this.NewPasswd){
                this.NewPasswdShow = true
                this.NewPasswdDisplay = false
                return
            }
            this.NewPasswdShow = false            
            if(this.NewPasswd != this.uPasswd){
                this.NewPasswdDisplay = true
            }else{
                this.NewPasswdDisplay = false
            }
        },
        NewSwitch(){
            this.Newpassword == 'text'?this.Newpassword = 'password':this.Newpassword = 'text'
        },
        XinSwitch(){
            this.Xinpassword == 'text'?this.Xinpassword = 'password':this.Xinpassword = 'text'
            
        },
        Confirm(){
            let CanNot = true
            if(!this.oldPasswd){
                this.oldPasswdShow = true
                CanNot = false
            }
            if(!this.uPasswd){
                this.uPasswdShow = true
                CanNot = false
            }
            if(this.uPasswdDisplay){
                CanNot = false
            }
            if(!this.NewPasswd){
                this.NewPasswdShow = true
                CanNot = false
            }
            if(this.NewPasswdDisplay){
                CanNot = false
            }
            if(!CanNot)return
            let _data = {
                uCode:this.uCode,
                uName:this.uName,
                oldPasswd:this.oldPasswd,
                uPasswd:this.uPasswd,
            }
            this.$post(this.$host+"/api/sysmgr/user/resetPwd",_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '修改成功',
                        duration:"1000",
                    });     
                }
            })
        },
        cancel(){
            this.HeadShow = false
            this.imgUrl = ''
        },
        submit(){
            this.uHEADER=this.uHeader= this.imgUrl
            this.cancel()
        }
    }
}
</script>

<style>
.error{
    margin-left: 1rem;
    font-size:1rem;
    color: #f50;
}
.Personal{
    background: url('../../../../static/img/Personal.png') no-repeat;
    background-position: top center;
    width: 100%;
    height: 100%;
}
.Personal .PersonalContent{
    width: 95%;
    min-height: 66.666667rem;
    padding-bottom: 3rem;
    margin:1.5rem auto 0;
    display: flex;
}
.headInfo{
    background: #fff;
    padding: 3.166667rem 1.666667rem;
    border-radius: .333333rem;
}
.HeadInfoImg{
    width: 6.666667rem;
    height: 6.666667rem;
    border-radius: 50%;
    display: block;
    margin:0 auto 1.833333rem;
}
.InfoName{
    font-size: 1.166667rem;
    color: #444;
    text-align: center;
}
.InfoSel{
    font-size: 1rem;
    color: #999;
    text-align: center;
}
.InfoButton{
    font-size: 1.333333rem;
    color: #fff;
    padding:.333333rem 5.5rem;
    background: #2CBCC8;
    border-radius: 4px;
    margin:2.166667rem auto 0;
    text-align: center;
    display: block;
}
.InfoList{
    margin-top: 1rem;
    background: #fff;
    border-radius: .333333rem;
    width: 100%;
    height: 60.5%;
}
.InfoList li{
    font-size: 1.333333rem;
    color: #666;
    padding: 1.5rem 1.666667rem;
    border-bottom: 1px solid #EFEFEF;
    cursor: pointer;
    position: relative;
}
.active{
    display:inline-block;
    width: .25rem;
    height: 2.333333rem;
    background: #2CBCC8;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}
.PersonalBox{
    width: 80%;
    margin-left: 1rem;
    background: #fff;
    border-radius: 4px;
}
.PersonalHeader{
    font-size: 1.5rem;
    color: #5D717C;
    padding: 1.333333rem 1.666667rem .833333rem 1.666667rem;
    border-bottom: 2px solid #EFEFEF;
}
.portrait{
    width: 9.333333rem;
    margin:3.5rem auto 0;
}
.portraitImg{
    width: 100%;
    height: 9.333333rem;
    border-radius: 50%;
    cursor: pointer;   
}
.Modifyportrait{
    color:  #1DADE2;
    font-size: 1.333333rem;
    text-align: center;
    margin-top: .666667rem;
    cursor: pointer;
}
.portraitBox{
    margin: 2.5rem auto 0;
    display: flex;
}
.portraitText{
    width: 40%;
    text-align: right;
    line-height: 3rem;
    font-size: 1rem;
    color: #999;
}
.portraitInput{
    padding-left: 2.5rem;
}
.ChangeBox{
    display: inline-block;
    position: relative;
}
.NoEyes::before{
    width:2.833333rem;
    height:2.833333rem;
    text-align: center;
    background: #fff;
    position: absolute;
    line-height: 3rem;
    top: 1px;
    right: 1px;
}
.portraitBTn{
   text-align: center;
   margin:3rem auto;
}
.portraitBTn button{
    padding: 0 2rem;
    background: #2CBCC8;
    border-radius: 2px;
    font-size: 12px;
    color: #FFFFFF;
}
.bounces{
    width: 33.333333rem;
    height: 33.333333rem;
    background: #fff;
    border-radius: 4px;
    z-index: 1000;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.bouncesHeader{
    font-size:1.166667rem; 
    margin:0 1.5rem 2rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
    color: #5d717c;
}
.bouncesHeader .postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.bouncesFlex{
    display: flex;
    padding: 0 3rem;
}
.el-upload--picture-card{
    width: 16.666667rem;
    height:16.666667rem;
    border:1px dashed #d9d9d9;
    line-height: 16.666667rem;
    border-radius: 0;
    overflow: hidden;
}
.el-upload--picture-card:hover{
    border-color:#d9d9d9;
}
.elUpload{
    position: relative;
}
.TheZoom{
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: -2.5rem;
}
.TheZoom i:first-child{
    margin-right: 1.5rem;
}
.TheZoom i:nth-child(2){
    margin-right: 1.5rem;
}
.bouncesImg{
    width: 5rem;
    height: 5rem;
    margin-left: 3.5rem;
}
.bouncesImg img{
    width: 100%;
    height: 100%;
}
.bouncesBtn{
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 2.333333rem;
}
.bouncesBtn button:first-child{
    margin-right: 2rem;
}
</style>
