<template>
  <div class="Func">
        <div class="Funcinfo">
            <span class="FuncText">父级权限：</span>
            <Select widths="13.333333rem" :SelecttemData="ParentData" :values="isMgnStore" arguName="isMgnStore" :SelecttemDetail="['fCode','fName']" @sonSelect="upInput"/>
        </div>
        <div class="Funcinfo">
            <span class="FuncText">权限名称：</span>
            <Input :value="FunName" arguName="FunName" widths="13.333333rem" @sonInput="upInput"/>
        </div>
        <div class="Funcinfo">
            <Button Name="查询" :Search="true" @click.native="Search"/>
            <Button Name="重置" :Reset="true" @click.native="Reset"/>
        </div>
        <div class="FuncButton">
            <Button Name="新增" :iconadd="true"  @click.native="add"/>    
        </div>
        <template>
            <el-table :data="content" style="width:100%" border>
                <el-table-column label="功能编号" prop="fCode" width="100"></el-table-column>
                <el-table-column label="权限名称" prop="fName" width="150"></el-table-column>
                <el-table-column label="权限标识" prop="fUrl" width="200"></el-table-column>
                <el-table-column label="访问地址" prop="fAuth" width="100"></el-table-column>
                <el-table-column label="上级功能" prop="fParentCode" width="150"></el-table-column>
                <el-table-column label="功能类型" prop="fType" width="150"></el-table-column>
                <el-table-column label="操作"  width="150" fixed="right">
                    <template slot-scope="scope">
                        <Button Name="修改" class="Btn" @click.native.stop="Modify(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                        <Button Name="删除" class="Btn" @click.native.stop="Delete(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="getpage" :total="total" class="pagingwidth"/>
        <Mtk v-if="IsShow" />
        <div v-if="IsShow"  class="Revise">
            <header class="RevHeader">{{FuncData.Title}}<i class="icon Fork Postion" @click.stop="revoke"></i></header>
            <div class="InpBox">
                <div class="Add_mod"><i class="waring icon"></i>排序号：</div>
                <Input type="text" :value="FuncData.fSortNo" arguName="fSortNo" widths="13.333333rem" @sonInput="sonInput" :blur="fSortNoblur"/>
                <i class="error" v-show="fSortNoShow">必填</i>
            </div>              
            <div class="InpBox">
                <div class="Add_mod"><i class="waring icon"></i>功能编号：</div>
                <Input type="text" :value="FuncData.fCode" arguName="fCode" widths="13.333333rem" @sonInput="sonInput" :blur="fCodeblur"/>
                <i class="error" v-show="fCodeShow">必填</i>
            </div>
            <div class="InpBox">
                <div class="Add_mod"><i class="waring icon"></i>权限名称：</div>
                <Input type="text" :value="FuncData.fName" arguName="fName" widths="13.333333rem" @sonInput="sonInput" :blur="fNameblur"/>
                <i class="error" v-show="fNameShow">必填</i>
            </div>
            <div class="InpBox">
                <div class="Add_mod"><i class="waring icon"></i>权限标识：</div>
                <Input type="text" :value="FuncData.fUrl" arguName="fUrl" widths="13.333333rem" @sonInput="sonInput" :blur="fUrlblur"/>
                <i class="error" v-show="fUrlShow">必填</i>
            </div>
            <div class="InpBox">
                <div class="Add_mod"><i class="waring icon"></i>访问地址：</div>
                <Input type="text" :value="FuncData.fAuth" arguName="fAuth" widths="13.333333rem" @sonInput="sonInput" :blur="fAuthblur"/>
                <i class="error" v-show="fAuthShow">必填</i>
            </div>
            <div class="InpBox">
                <div class="Add_mod"><i class="waring icon"></i>功能类型：</div>
                <Select :SelecttemData="UpFuns" :values="FuncData.fType" arguName="fType" :SelecttemDetail="['value','name']" @sonSelect="sonSelect"/>
                <i class="error" v-show="fTypeShow">必填</i>
            </div>
            <div class="InpBox">
                <div class="Add_mod"><i class="waring icon"></i>上级功能：</div>
                <Select v-show="FuncData.fType==1" :SelecttemData="ParentData" :values="FuncData.fParentCode" arguName="fParentCode" :SelecttemDetail="['fCode','fName']" @sonSelect="sonSelect" :disabled="!FuncData.fType" widths="10rem"/>
                <Selects v-show="FuncData.fType==3" :SelecttemData="ParentData" :props="props" :disabled="!FuncData.fType" @sonProductSelect="sonProductSelect" widths="10rem"/>
                <i class="error" v-show="fParentCodeShow">必填</i>
            </div>
            <div class="BtnBox">
                <Button Name="取消" class="None"  @click.native="revoke"/>                  
                <Button Name="确定" @click.native="submit(FuncData.id)"/>
            </div>
        </div>
  </div>
</template>

<script>
import Select from "../../common/Select"
import Selects from "../../common/Selects"
import Input from "../../common/Input"
import Table from "../../common/Table"
import Paging from "../../common/Paging"
import Button from "../../common/Button"
import Mtk from '../../common/Mtk'
export default {
    components:{Select,Input,Table,Paging,Button,Selects,Mtk},
    data(){
        return{
            selectShow:true,
            FunName:"",
            ParentData:[] , //父级权限
            isMgnStore:"",
            props:{
                value:"fCode",
                label:"fName",
                children:"childs"
            },
            UpFuns:[ //上级功能
                {name:"商户管理菜单",value:1},
                {name:"移动用户菜单",value:2},
                {name:"商户管理功能",value:3},
                {name:"移动用户功能",value:4},
            ],
            pageNumber:'',//页码
            pageSize:20,//数据条数
            total:0,//总的数据条数
            content:[],
            IsShow:false,
            FuncData:{
                id:"",  
                Title:"",                
                fCode: "",
                fName: "",
                fParentCode: "",
                fSortNo: "",
                fType: 1,
                fUrl: "",
                fAuth:"",
            },
            fSortNoShow:false,
            fCodeShow:false,
            fNameShow:false,
            fUrlShow:false,
            fAuthShow:false,
            fTypeShow:false,
            fParentCodeShow:false,
        }
    },
    mounted(){
      this.getpage(1)
      
    },
    methods:{
        getParentData(){
            this.$post(this.$host+"/api/sysmgr/func/query/tree",{ accessToken:this.accessToken}).then(d =>{ //登录用户的权限树
                if(d.success){ 
                    d.list.push({
                        fCode : "0",
                        fName :"顶级菜单",
                        fParentCode : "0",
                    })
                    let data=d.list;
                    data.map((el,index)=>{
                        if(el.fType==3){
                            data.splice(index,1)
                        }
                        if(el.childs){
                            if(el.childs.length>0){
                                el.childs.map(val=>{
                                    val.childs=null;
                                })
                            }
                        }
                    });
                    this.ParentData = data;           
                }
            }) 
        },
        //表单校验
        fSortNoblur(){
            if(!this.FuncData.fSortNo){
                return this.fSortNoShow = true
            }
            this.fSortNoShow = false   
        },
        fCodeblur(){
            if(!this.FuncData.fCode){
                return this.fCodeShow = true
            }
            this.fCodeShow = false   
        }, 
        fNameblur(){
            if(!this.FuncData.fName){
                return this.fNameShow = true
            }
            this.fNameShow = false   
        }, 
        fUrlblur(){
            if(!this.FuncData.fUrl){
                return this.fUrlShow = true
            }
            this.fUrlShow = false   
        }, 
        fAuthblur(){
            if(!this.FuncData.fAuth){
                return this.fAuthShow = true
            }
            this.fAuthShow = false   
        }, 

        sonProductSelect(id){
            this.FuncData.fParentCode=id;
            console.log(id)
        },
        getpage(index){
            let _data = {
                    pageNumber:parseInt(index),
                    pageSize:this.pageSize,
                    fName:this.FunName,
                    fParentCode:this.isMgnStore
            }          
            this.$post(this.$host+"/api/sysmgr/func/query/page",_data).then(d =>{
                if(d.success){
                    this.total = d.pageData.total               
                    this.content = d.pageData.content 
                    this.pageNumber = d.pageData.pageNumber 
                }
            })
        },
        Search(){
            // if(!this.FunName && !this.isMgnStore){
            //     return this.$message({
            //             type: 'info',
            //             message: '请输入搜索内容！',
            //             duration:"1000",
            //         });
            // }
            this. getpage(1)
        },
        Reset(){
            if(this.FunName || this.isMgnStore){
                this.FunName = ''
                this.isMgnStore = ''
                this.getpage()
            }
        },
        upInput(value,arguName){
                this[arguName] = value;
        },
        sonInput(value,arguName){
                this.FuncData[arguName]=value;
        },
        sonSelect(value,arguName){
            if(arguName=="fType"){
                if(value==1){
                    this.selectShow=true;
                }else if(value==3){
                    this.selectShow=false;
                }
            }         
            this.FuncData[arguName]=value;
            if(value===""){
                this[arguName+"Show"]=true;
            }else{
                this[arguName+"Show"]=false;
            }
        },
        add(){
            this.IsShow = true;
            this.FuncData.Title = "新增系统功能权限"   
            this.getParentData();         
        },
        Modify(index,item){
            this.$post(this.$host+"/api/sysmgr/func/queryone",{id:item.id}).then(d=>{
                if(d.success){
                    this.FuncData = {
                        fCode : d.fCode,
                        fName : d.fName,
                        fParentCode : d.fParentCode,
                        fSortNo : d.fSortNo,
                        fType : d.fType,
                        fUrl : d.fUrl,
                        id : d.id,
                        fAuth:d.fAuth,
                        Title : "修改系统功能权限"
                    }
                    this.IsShow = true;                 
                }
            });
            this.getParentData();         
        },
        submit(id){
            let CanNot = true;//能提交
            if(this.FuncData.fSortNo === ""){
                    this.fSortNoShow = true
                    CanNot = false
            }
            if(this.FuncData.fCode == ""){
                    this.fCodeShow = true
                    CanNot = false
            }
            if(this.FuncData.fName == ""){
                    this.fNameShow = true
                    CanNot = false
            }
            if(this.FuncData.fUrl == ""){
                    this.fUrlShow = true
                    CanNot = false
            }
            if(this.FuncData.fAuth == ""){
                    this.fAuthShow = true
                    CanNot = false
            }
            if(this.FuncData.fType == ""){
                    this.fTypeShow = true
                    CanNot = false
            }
            if(this.FuncData.fParentCode === ""){
                    this.fParentCodeShow = true
                    CanNot = false
            }
            if(!CanNot){
                return;
            }
            let _data = {
                    fCode: this.FuncData.fCode,
                    fName: this.FuncData.fName,
                    fParentCode: this.FuncData.fParentCode,
                    fSortNo: this.FuncData.fSortNo,
                    fType: this.FuncData.fType,
                    fUrl: this.FuncData.fUrl,
                    fAuth:this.FuncData.fAuth,
                }
            if(id){
                _data.id = id,
                this.$post(this.$host+"/api/sysmgr/func/update",_data).then(d =>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"1000",
                            onClose:()=>{
                                this.getpage(this.pageNumber)
                            }
                        }); 
                        this.revoke()                        
                    }
                })
            }else{
                this.$post(this.$host+"/api/sysmgr/func/add",_data).then(d =>{
                    if(d.success){
                         this.$message({
                            type: 'success',
                            message: '添加成功!',
                            duration:"1000",
                            onClose:()=>{
                                this.getpage(this.pageNumber)
                            }
                        });
                        this.revoke()                           
                    }
                })
            }
        },
        revoke(){
            this.IsShow = false;
            this.fSortNoShow=false,
            this.fCodeShow=false,
            this.fNameShow=false,
            this.fUrlShow=false,
            this.fAuthShow=false,
            this.fTypeShow=false,
            this.fParentCodeShow=false,
            this.FuncData = {
                                id:"",  
                                Title:"",                
                                fCode: "",
                                fName: "",
                                fParentCode: "",
                                fSortNo: "",
                                fType: "",
                                fUrl: "",
                                fAuth:""
                            }
        },
        Delete(index,item){  //删除角色
            this.$messagebox.confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$post(this.$host+"/api/sysmgr/func/delete", {id:item.id}).then(d => {
                        if (d.success) {
                                this.content.splice(index, 1);
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!',
                                    duration:"1000",
                                    onClose:()=>{
                                        this.getpage(this.pageNumber)
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
    }
}
</script>

<style>
.error{
    margin-left: .5rem;
    font-size:1rem;
    color: #f50;
}
.Func .Funcinfo{
    display: inline-block;
    font-size: 1rem;
    color: #666666;
    margin:0 2rem 1rem 0;
}
.Func .Funcinfo button:first-child{
    margin-right: 1rem;
}
.Func .FuncButton{
    margin-bottom:1rem;
}


.Revise{
  width: 33.333333rem;
  height: 37.5rem;
  background:#fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  overflow: hidden;
  z-index: 1000;
}
.Revise .RevHeader{
    font-size:1.166667rem;
    color: #5d717c;
    margin:0 1.5rem 1rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
}
.Revise .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.Revise .InpBox{
     margin-top: 1.5rem;
}
.InpBox .Add_mod{
  width: 35%;
  display: inline-block;
  text-align:right;
  font-size: 1rem;
  color: #666;  
}
.Revise .BtnBox{
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
}
.Revise .BtnBox button:first-child{
    margin-right: 1rem;
}

</style>
