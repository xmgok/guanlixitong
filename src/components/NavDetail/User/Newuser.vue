<template>
  <div class="Newuser">
        <ul class="NewRevis">
            <li class="ReviseBox">
                <div class="Add_mod">工号：</div>
                <div class="ReviseBoxInput">
                    <Input :value="workNo" widths="13.333333rem" arguName="workNo" @sonInput="sonInput" :maxlength="8" :blur="workNoblur"/>                    
                </div>
            </li>
            <li class="ReviseBox">
                <div class="Add_mod"><i class="waring icon"></i>用户账号：</div>
                <div class="ReviseBoxInput">
                    <Input :value="uCode" widths="13.333333rem" arguName="uCode" @sonInput="sonInput" :maxlength="16" :blur="uCodeblur"/>
                    <i class="error" v-show="uCodeShow">必填</i>
                    <i class="error" v-show="uCodeDisplay">用户账号由(3到16位)字母汉字或数字组合</i>
                </div>
            </li>
            <li class="ReviseBox">
                <div class="Add_mod"><i class="waring icon"></i>登录密码：</div>
                <div class="ReviseBoxInput">
                    <Input type="password" :value="uPasswd" widths="13.333333rem" arguName="uPasswd" @sonInput="sonInput" :maxlength="16"  :blur="uPasswdblur"/>
                    <i class="error" v-show="uPasswdShow">必填</i>
                </div>
            </li>
            <li class="ReviseBox">
                <div class="Add_mod"><i class="waring icon"></i>确认密码：</div>
                <div class="ReviseBoxInput">
                    <Input type="password" :value="NewuPasswd" widths="13.333333rem" arguName="NewuPasswd" @sonInput="sonInput"  :maxlength="16"  :blur="NewuPasswdblur"/>
                    <i class="error" v-show="NewuPasswdShow">必填</i>
                    <i class="error" v-show="NewuPasswdDisplay">密码和确认密码不一致</i>
                </div>
            </li>               
            <li class="ReviseBox">
                <div class="Add_mod"><i class="waring icon"></i>用户名称：</div>
                <div class="ReviseBoxInput">
                    <Input :value="uName" widths="13.333333rem" arguName="uName" @sonInput="sonInput" :maxlength="16" :blur="uNameblur"/>
                    <i class="error" v-show="uNameShow">必填</i>
                    <i class="error" v-show="uNameDisplay">用户名称不能有特殊字符</i>
                </div>
            </li>
            <li class="ReviseBox">
                <div class="Add_mod"><i class="waring icon"></i>性别：</div>
                <div class="ReviseBoxInput">
                    <Select :SelecttemData="Sex" arguName="uSex" :values="uSex" :SelecttemDetail="['value','key']" @sonSelect="sonSelect" widths="10rem"/>
                    <i class="error" v-show="uSexShow">必填</i>
                </div>
            </li>
            <li class="ReviseBox">
                <div class="Add_mod">QQ：</div>
                <div class="ReviseBoxInput">
                    <Input :value="uQq" widths="13.333333rem" arguName="uQq" @sonInput="sonInput" :maxlength="10"/>                    
                </div>
            </li>
            <li class="ReviseBox">
                <div class="Add_mod">微信：</div> 
                <div class="ReviseBoxInput">
                    <Input :value="uWechat" widths="13.333333rem" arguName="uWechat" @sonInput="sonInput" :maxlength="20"/>                    
                </div>
            </li>
            <li class="ReviseBox">
                <div class="Add_mod"><i class="waring icon"></i>手机号码：</div>
                <div class="ReviseBoxInput">
                    <Input :value="uTel"  widths="13.333333rem" arguName="uTel" @sonInput="sonInput" :maxlength="11" :blur="uTelblur"/>
                    <i class="error" v-show="uTelShow">必填</i>
                    <i class="error" v-show="uTelDisplay">手机号码格式错误!</i>  
                </div>              
            </li>
            <li class="ReviseBox">
                <div class="Add_mod">电子邮件：</div> 
                <div class="ReviseBoxInput">
                    <Input :value="uEmail" widths="13.333333rem" arguName="uEmail" @sonInput="sonInput" :blur="uEmailblur"/>
                    <i class="error" v-show="uEmailDisplay">邮箱格式不正确!</i>
                </div>        
            </li>
            <li class="ReviseBox">
                <div class="Add_mod">角色：</div>
                <div class="ReviseBoxInput">
                    <el-select v-model="roleIds" multiple size="mini" placeholder="请选择" style="width:160px">
                        <el-option v-for="item in Rcontent" :key="item.id" :label="item.rName" :value="item.id"> </el-option>
                    </el-select>
                </div>    
            </li>
        </ul>
        <div class="ReviseBtn">
            <Button Name="取消" class="None" @click.native="revoke"/>            
            <Button Name="提交" @click.native="submit"/>
        </div>
  </div>
</template>

<script>
import Input from "../../common/Input"
import Button from "../../common/Button"
import Select from "../../common/Select";
export default {
    components:{Input,Button,Select},
    data(){
        return{
            Rcontent:[],//角色数组
            roleIds:[],//已选角色id
            Sex:[
                  {key:"女",value:0},
                  {key:"男",value:1},
            ],
            uEmpId:3,
            uCode :"",
            uEmail :"",
            uName :"",
            uPasswd :"",   
            NewuPasswd:"",
            uQq :"",
            workNo:'',
            uSex :0,
            uTel :"",
            uWechat :"",
            uCodeShow:false,
            uCodeDisplay:false,
            uPasswdShow:false,
            NewuPasswdShow:false,
            NewuPasswdDisplay:false, 
            uNameShow:false,
            uNameDisplay:false,       
            // workNoShow:false,
            uSexShow:false,
            uTelShow:false,
            uTelDisplay:false,
            uEmailDisplay:false,
            // roleIdsShow:false,
        }
    },
    mounted(){
        this.getroleAll()
    },
    methods:{
        getroleAll(){
            this.$post(this.$host+"/api/sysmgr/role/gtisusadedrol",{pageNumber:1,pageSize:200}).then(d=>{    
                if(d.success){
                    this.Rcontent = d.pageData.content
                }
            })
        },
        workNoblur(){
            if(this.workNo){
                this.$post(this.$host+"/api/sysmgr/user/worknoverify",{workNo:this.workNo}).then(d=>{    
                    if(d.success){
                        this.uTel = d.uTel
                        this.uName = d.uName
                        this.uSex = d.uSex
                        this.roleIds = d.roles
                    }
                })
            }
        },
        uCodeblur(){
            if(!this.uCode){
                this.uCodeDisplay = false;
                this.uCodeShow = true ;
                return 
            }
            this.uCodeShow = false
            if(!/^([a-zA-Z0-9_\u4e00-\u9fa5]){3,16}$/.test(this.uCode)){
                this.uCodeDisplay = true
                this.uCodeShow = false
            }else{
                this.uCodeShow = this.uCodeDisplay = false
            }
        },
        uPasswdblur(){
            if(!this.uPasswd){
                return this.uPasswdShow = true
            }
            this.uPasswdShow = false
            if(this.uPasswd && this.NewuPasswd){
                if(this.uPasswd != this.NewuPasswd){
                    this.NewuPasswdDisplay = true
                    return
                }
                this.NewuPasswdDisplay = false
            }
        },
        NewuPasswdblur(){
             if(!this.NewuPasswd){
                this.NewuPasswdShow = true;this.NewuPasswdDisplay = false
                return 
            }
            this.NewuPasswdShow = false
            if(this.uPasswd && this.NewuPasswd){
                if(this.uPasswd != this.NewuPasswd){
                    this.NewuPasswdDisplay = true
                    return
                }
                this.NewuPasswdDisplay = false
            }
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
        sonInput(value,arguName){
                this[arguName]=value;  
                console.log(value,arguName)
        },
        sonSelect(value, arguName) {
          console.log(this[arguName]+'='+value)            
          this[arguName] = value;
          if(value===""){
            this[arguName+"Show"]=true;
          }else{
            this[arguName+"Show"]=false;
          }
        },
        submit(){
            let CanNot = true;//能提交
            if(this.uCode == ""){
                this.uCodeShow = true
                CanNot = false
            }
            if(this.uCodeDisplay){
                CanNot = false
            }
            if(this.uPasswd == ""){
                this.uPasswdShow = true                
                CanNot = false
            }
            if(this.NewuPasswd == ""){
                this.NewuPasswdShow = true      
                CanNot = false
            }
            if(this.NewuPasswdDisplay){
                CanNot = false
            }
            if(this.uName == ''){
                this.uNameShow = true
                CanNot = false                
            }
            if(this.uNameDisplay){
                CanNot = false
            }
            if(this.uSex === ""){
                this.uSexShow = true      
                CanNot = false
            }
            if(this.uTel == ""){
                this.uTelShow = true      
                CanNot = false
            }
            if(this.uTelDisplay){
                CanNot = false
            }
            if(this.uEmailDisplay){
                CanNot = false
            }
            // if(!this.roleIds){
            //     this.roleIdsShow = ture
            //     CanNot = false
            // }
            if(!CanNot){
               return
            }
            let _updata = {
                uCode : this.uCode,
                uEmail : this.uEmail,
                uName : this.uName,
                uPasswd : this.uPasswd,
                uQq : this.uQq,
                workNo:this.workNo,
                uSex : this.uSex,
                uTel : this.uTel,
                roleIds:this.roleIds,
                uWechat : this.uWechat
            }
            this.$post(this.$host+"/api/sysmgr/user/add",_updata).then(d =>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                            duration:"1000",
                            onClose:()=>{
                                this.revoke() 
                            }
                        }); 
                    }
            }) 
        },
        revoke(){
            this.$router.push({ path:"/NavDetail/User"})            
        }
    }
}
</script>

<style scoped>
.pleft{
    margin-left: 1rem;
    color: #999;
}
.error{
    margin-left: 1rem;
    font-size:1rem;
    color: #f50;
}
.Newuser .NewRevis{
    border:1px solid #EFEFEF;
}
.Newuser .ReviseBox {
    border-bottom: 1px solid #EFEFEF;
    display: flex;
}
.Newuser .ReviseBox:last-child{
  border-bottom: none;
}
.Newuser .ReviseBox .Add_mod{
    width: 20rem;
    background: #FAFAFA;
    padding: 6px 0;
    text-align: right;
    font-size: 1rem;
    border-right: 1px solid #EFEFEF;
    color: #666;
}
.ReviseBoxInput{
    padding: .5rem 1rem;
}
.Newuser .ReviseBtn{
  margin-left: 16rem;
  margin-top: 4rem;
}
.Newuser .ReviseBtn button:first-child{
  margin-right:2rem;
}
</style>
