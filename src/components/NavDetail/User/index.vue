<template>
   <div class="User">
        <div class="userinfo">用户账号：<Input :value="SuCode"  widths="13.333333rem" arguName="SuCode" @sonInput="getInptval"/></div>
        <div class="userinfo">用户名称：<Input :value="SuName" widths="13.333333rem" arguName="SuName" @sonInput="getInptval"/></div>       
        <div class="userinfo">手机号：<Input :value="SuTel" widths="13.333333rem" arguName="SuTel" @sonInput="getInptval"/></div>
        <div class="userinfo">角色：<Select :SelecttemData="Rcontent" widths="13.333333rem" arguName="roleId" :values="roleId" :SelecttemDetail="['id','rName']" @sonSelect="getInptval"/></div>
        <div class="userinfo">
            <Button Name="查询" :Search="true" @click.native="topage(1)"/>
            <Button Name="重置" :Reset="true" @click.native="Reset" />
        </div>
        <div class="UserBtn">
            <Button Name="新增" :iconadd="true"  @click.native="register"/>         
            <Button Name="角色分配" :Role="true" @click.native="torole"/>      
        </div>
        <template>
            <el-table :data="content" style="width:100%" border>
                <el-table-column label="用户账号" prop="uCode" width="200"></el-table-column>
                <el-table-column label="用户名称" prop="uName" width="200"></el-table-column>
                <el-table-column label="电子邮箱" prop="uEmail" width="200"></el-table-column>
                <el-table-column label="性别" width="100">
                    <template slot-scope="scope">
                        <span> {{(scope.row.uSex === 0 && '女')||(scope.row.uSex === 1 && '男') }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" prop="uTel" width="150"></el-table-column>
                <el-table-column label="操作"  width="250" fixed="right">
                    <template slot-scope="scope">
                        <Button Name="修改" class="Btn" @click.native.stop="Modify(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                        <Button Name="删除" class="Btn" :class="{Btndisabled:scope.row.isSuperManger===1||scope.row.uCode==ucode}" @click.native.stop="Delete(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                        <Button Name="角色分配" class="Btn" :class="{Btndisabled:scope.row.isSuperManger===1}" @click.native.stop="assign(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="topage" :total="total" class="pagingwidth"/>
        <Mtk v-if="IsShow"/>
        <div v-if="IsShow" class="Revis">
            <header class="RHeader">修改用户<i class="icon Fork Postion" @click.stop="revoke"></i></header>
            <div class="ReviseBox">
                <span class="Add_mod">用户账号：</span>
                <span>{{UserData.uCode}}</span>
                <!-- <Input  widths="13.333333rem" :placeholder="UserData.uCode" arguName="uCode" @sonInput="upInput" :readonlys="true"/> -->
            </div>
            <div class="ReviseBox">
                <div class="Add_mod">工号：</div>
                <Input v-if="UserData.isSuperManger===0" :value="UserData.workNo" widths="13.333333rem" arguName="workNo" @sonInput="upInput" :maxlength="8"/>
                <span v-if="UserData.isSuperManger===1">{{UserData.workNo}}</span>
            </div>
            <div class="ReviseBox"> 
                <span class="Add_mod"><i class="waring icon"></i>用户名称：</span>
                <Input :value="UserData.uName" widths="13.333333rem" arguName="uName" @sonInput="upInput" :blur="uNameblur" :maxlength="16"/>
                <i class="error" v-show="uNameShow">必填</i>
            </div>
            <div class="ReviseBox">
                <span class="Add_mod">性 别：</span>
                <Select :SelecttemData="Sex" arguName="uSex" :values="UserData.uSex" :SelecttemDetail="['value','key']" @sonSelect="sonSelect" widths="10rem"/>
                <i class="error" v-show="uSexShow">必填</i>                    
            </div>
            <div class="ReviseBox">
                <span class="Add_mod">联 系QQ：</span>
                <Input :value="UserData.uQq" widths="13.333333rem" arguName="uQq" @sonInput="upInput" :maxlength="10"/>
            </div>
            <div class="ReviseBox">
                <span class="Add_mod">联系微信：</span> 
                <Input :value="UserData.uWechat" widths="13.333333rem" arguName="uWechat" @sonInput="upInput"/>
            </div>
            <div class="ReviseBox">
                <span class="Add_mod"><i class="waring icon"></i>手机号码：</span>
                <Input :value="UserData.uTel"  widths="13.333333rem" arguName="uTel" @sonInput="upInput" :maxlength="11" :blur="uTelblur"/>
                <i class="error" v-show="uTelShow">必填</i>                                         
            </div>
            <div class="ReviseBox">
                <span class="Add_mod">电子邮件：</span> 
                <Input :value="UserData.uEmail" type="'email'" widths="13.333333rem" arguName="uEmail" @sonInput="upInput" :blur="uEmailblur"/>
            </div>
            <!-- <div class="ReviseBox">
                <span class="Add_mod">角色：</span> 
                <el-select v-if="UserData.isSuperManger===0" v-model="UserData.roleIds" multiple size="mini" placeholder="请选择" style="width:160px">
                        <el-option v-for="item in Rcontent" :key="item.id" :label="item.rName" :value="item.id"> </el-option>
                </el-select>
                <span v-if="UserData.isSuperManger===1">系统管理员</span>
            </div> -->
            <div class="ReviseBtn">
                <Button Name="取消" class="None" @click.native="revoke"/>                    
                <Button Name="确定" @click.native="submit(UserData.id)"/>
            </div>
        </div>
   </div>
</template>

<script>
import Input from "../../common/Input"
import Button from "../../common/Button"
import Select from "../../common/Select";
import Paging from "../../common/Paging";
import Mtk from '../../common/Mtk'
export default {
    components:{Input,Button,Select,Paging,Mtk},
    data(){
        return{
            ucode:this.$getCookie('ucode'),
            content:[],//分页查询的用户数据   
            SuCode:"",  //搜索用户账号                       
            SuName:"",  //搜索用户名称  
            SuTel:"",   //搜索手机号码
            roleId:'',
            pageSize:20,//每页请求数据条数
            total:0,//总的数据条数
            IsShow:false, //新增修改遮罩层
            pageNumber:"",
            Sex:[
                  {key:"女",value:0},
                  {key:"男",value:1},
            ],
            NPasswd:false,
            Rcontent:[],//当前用户增加的角色
            UserData:{   //新增修改用户数据
                uEmpId:"",
                id :"",
                uCode :"",
                uEmail :"",
                uName :"",
                workNo:'',
                uQq :"",
                uSex :"",
                uTel :"",
                uWechat :"",
                isSuperManger:'',
            },
            uNameShow:false,
            uSexShow:false,
            uTelShow:false,
        }
    },
    mounted(){
        this.topage(1);
        this.getroleAll()
    },
    methods:{
        getroleAll(){
            this.$post(this.$host+"/api/sysmgr/role/gtisusadedrol",{pageNumber:1,pageSize:1000}).then(d=>{    
                if(d.success){
                    this.Rcontent = d.pageData.content
                }
            })
        },
        uNameblur(){
            if(!this.UserData.uName){
                return this.uNameShow = true
            }
            this.uNameShow = false
            if(/[@#\$%\^&\*]+/g.test(this.UserData.uName)){
                return this.$message({
                    type: 'info',
                    message: '用户名称不能有特殊字符！',
                    duration:"1000",
                }); 
            }
        },
        uTelblur(){
            if(!this.UserData.uTel){
                return this.uTelShow = true
            }
            this.uTelShow = false
            if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.UserData.uTel)){
                return this.$message({
                    type: 'info',
                    message: '手机号码格式错误！',
                    duration:"1000",
                }); 
            }          
        },
        uEmailblur(){
            if(!this.UserData.uEmail)return
            if(!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.UserData.uEmail)){
                return this.$message({
                    type: 'info',
                    message: '邮箱格式错误！',
                    duration:"1000",
                });
            }                      
        },
        topage(index){
            let _data ={
                roleId:this.roleId,
                uCode:this.SuCode,                            
                uName:this.SuName,
                uTel:this.SuTel,
                pageNumber:parseInt(index),           
                pageSize:this.pageSize,
            }
            this.$post(this.$host+"/api/sysmgr/user/query/page",_data).then((d)=>{
                if(d.success){
                    this.content = d.data.content;
                    this.total = d.data.total;
                    this.pageNumber = d.data.pageNumber;
                }
            })
        },
        getInptval(value,arguName){
                this[arguName]=value;
        },
        upInput(value,arguName){
                this.UserData[arguName]=value;
        },
        sonSelect(value, arguName) {
          this.UserData[arguName] = value;
          if(value === 0 || value === 1){
                    this[arguName+"Show"]=false;
                }else{
                    this[arguName+"Show"]=true;
                } 
        },
        Reset(){
            if(!this.SuCode && !this.SuName && !this.SuTel && !this.roleId)return
            this.SuCode =this.SuName=this.SuTel =this.roleId=''
        },
        register(){
             this.$router.push({ path:"/NavDetail/Newuser"})                    
        },
        torole(){
            this.$router.push({ path:"/NavDetail/Userrole"})            
        },
        assign(index,item){
            if(item.isSuperManger===1)return
            this.$router.push({path:"/NavDetail/Assignroles",
                    query:{data:JSON.stringify(item)}
            })
        },
        Modify(index,item){
            this.$post(this.$host+"/api/sysmgr/user/queryone",{id:item.id}).then((d)=>{
                if(d.success){
                    let _datas = {
                        id : d.id,
                        uCode : d.uCode,
                        uEmail : d.uEmail,
                        uName : d.uName,
                        workNo:d.workNo,
                        uQq : d.uQq,
                        uSex : d.uSex,
                        uTel : d.uTel,
                        uUpdateTime : d.uUpdateTime,
                        uUpdateUser : d.uUpdateUser,
                        uWechat : d.uWechat,
                        isSuperManger: item.isSuperManger,
                    }
                    this.UserData = _datas
                    this.IsShow = true;
                }
            })           
        },
        Delete(index,item){  //删除角色
            if(item.isSuperManger===1)return
            if(item.uCode==this.ucode){
                this.$alert('该账号为当前登录账号，无法删除！', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                })
                return
            }
            this.$messagebox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                  }).then(() => {
                        this.$post(this.$host+"/api/sysmgr/user/delete", {id:item.id}).then(d => {
                            if (d.success) {
                                    this.content.splice(index, 1);
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!',
                                        duration:"1000",
                                        onClose:()=>{
                                            this.topage(this.pageNumber)
                                        }
                                    });
                            }
                        });
                  }).catch(() => {
                        this.$message({
                              type: 'info',
                              message: '已取消删除',
                              duration:"1500",
                        });          
                  });
        },
       submit(){
           let CanNot = true;//能提交
           if(this.UserData.uName == ""){
                    this.uNameShow = true
                    CanNot = false
           }
           if(/[@#\$%\^&\*]+/g.test(this.UserData.uName)){
                 this.$message({
                    type: 'info',
                    message: '用户名称不能有特殊字符！',
                    duration:"1000",
                });
                return  CanNot = false
            }
           if(this.UserData.uSex === ""){
                    this.uSexShow = true
                    CanNot = false
           }
           if(this.UserData.uTel == ""){
                    this.uTelShow = true
                    CanNot = false
           }
           if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.UserData.uTel)){
                this.$message({
                    type: 'info',
                    message: '手机号码格式错误！',
                    duration:"1000",
                }); 
                return  CanNot = false                
            }
            if(this.UserData.uEmail){
                if(!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.UserData.uEmail)){
                    this.$message({
                        type: 'info',
                        message: '邮箱格式错误！',
                        duration:"1000",
                    });
                    return  CanNot = false 
                }
            } 
           if(!CanNot){
               return;
           }
            let _updata = {
                    id: this.UserData.id,
                    uCode : this.UserData.uCode,
                    uEmail : this.UserData.uEmail,
                    uName : this.UserData.uName,
                    workNo: this.UserData.workNo,
                    uQq : this.UserData.uQq,
                    uSex : this.UserData.uSex,
                    uTel : this.UserData.uTel,
                    uWechat : this.UserData.uWechat,
                }
            if(this.UserData.uCode==this.ucode){
                this.$confirm('此账号为当前登录账号，修改后将退出重新登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post(this.$host+"/api/sysmgr/user/update",_updata).then(d =>{
                        if(d.success){
                            this.$message({
                                type: 'success',
                                message: '修改成功!',
                                duration:"1000",
                                onClose:()=>{
                                    let that = this
                                    this.$logOut(that)
                                }
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改',
                        duration:"1000",
                    });          
                });
            }else{
                this.$post(this.$host+"/api/sysmgr/user/update",_updata).then(d =>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"1000",
                            onClose:()=>{
                                this.topage(this.pageNumber);
                                this.revoke()
                            }
                        });
                    }
                })
            }
        },
        revoke(){
                this.IsShow = false;
                this.UserData = { 
                    id :"",
                    Title:"",
                    uCode :"",
                    uDelFlag :"",
                    uEmail :"",
                    uName :"",
                    uQq :"",
                    uSex :"",
                    uTel :"",
                    uUpdateTime :"",
                    uUpdateUser :"",
                    uWechat :"",
                }    
            },
        }
}

</script>

<style scoped>
.error{
    margin-left: 1rem;
    font-size:1rem;
    color: #f50;
}
.User .userinfo{
    display: inline-block;
    font-size: 1rem;
    color: #666666;
    margin:0 2rem 1rem 0;
}
.User .userinfo button:first-child{
    margin-right: 1rem;
}
.User .UserBtn button{
    margin: 0 1rem 1rem 0;
}
.Revis{
  width:33.333333rem;
  /* height:41.666667rem; */
  background: #ffffff;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
  border-radius: 4px;
  transform: translate(-50%,-50%);
}
.Revis .RHeader{
    font-size:1.166667rem; 
    margin:0 1.5rem 1.5rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
    color: #5d717c;
}
.Revis .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.Revis .ReviseBox{
    margin-bottom: 1rem;
}
.Revis .Add_mod{
  width: 35%;
  display: inline-block;
  text-align:right;
  font-size: 1rem;
  color: #666;
}
.Revis .ReviseBtn{
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.Revis .ReviseBtn button:first-child{
    margin-right: 2rem;
}
</style>
