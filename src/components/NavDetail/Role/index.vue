<template>
  <div class="Role">
      <div class="RoleHead">
          <div class="roles">角色名称：<Input :value="rNames" arguName="rNames"  @sonInput="sonInput"  widths="13.333333rem"/></div>  
      </div>
      <div class="RoleHead">
          <Button Name="查询" :Search="true" @click.native="getpage(1)"/>          
      </div>
    <div class="BodyBtn">
        <Button Name="新增" :iconadd="true" @click.native="gotoadd"/>
        <!-- <Button Name="分配权限" class="" @click.native="gotopower"/> -->
    </div>
    <template>
        <el-table :data="content" style="width:100%" border>
            <el-table-column label="角色名称" prop="rName" width="200"></el-table-column>
            <el-table-column label="角色说明" prop="R_REMARK" width="450"></el-table-column>
            <el-table-column label="操作"  width="250">
                <template slot-scope="scope">
                    <Button Name="修改" class="Btn" @click.native.stop="Modify(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                    <Button Name="分配权限" class="Btn" @click.native.stop="assign(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                    <Button Name="删除" class="Btn" @click.native.stop="Delete(scope.$index,scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column></el-table-column>
        </el-table>
    </template>
    <Paging :handleCurrentChange="getpage" :total="total"  class="pagingwidth"/>
    <Mtk v-if="IsShow"/>
    <div v-if="IsShow" class="Popup">
        <header class="Header">{{rAddMod.Title}}<i class="icon Fork Postion" @click.stop="cancel"></i></header>
        <div class="RoleData">
            <div class="RoleDataText"><i class="waring icon"></i>角色名称：</div>
            <Input :value="rAddMod.rName"  @sonInput="upInput" arguName="rName" widths="13.333333rem" :blur="rNameblur"/>
            <i class="error" v-show="rNameShow">必填</i>
        </div>
        <div class="RoleData">
            <div class="RoleDataText">角色说明：</div>
            <Input :value="rAddMod.rRemark"   @sonInput="upInput" arguName="rRemark" widths="13.333333rem"/>
        </div>
        <div class="RoleBtn">
            <Button Name="取消" class="None" @click.native="cancel"/>                    
            <Button Name="确定" @click.native="submit(rAddMod.id)"/>
        </div>
    </div>
    <Mtk v-if="Display"/>
    <div v-if="Display" class="OneBy">
            <header class="OneByHeader">单个分配权限<i class="icon Fork Postion" @click.stop="torole"></i></header>
            <div class="titeltxt">角色名称：<span>{{datas.rName}}</span></div>
            <div class="titeltxt titelText">角色说明：<span>{{datas.R_REMARK}}</span></div>
            <div class="tree">
                <ul class="treeConent">
                    <li v-for="(item,Index) in list" :key="Index" @click.stop ="OneShow(Index)" >
                            <i v-if="item.childs" class="icon Arrow" :class="{'UPDown':item.active}" @click.stop ="OneShow(Index)" ></i>
                            <i class="icon unchecked" :class="{'checked':item.checked}" @click.stop="checkbox(item.id)"></i>
                            <span>{{item.fName}}</span>
                            <transition-group name="fade"  tag="ul">
                                    <li v-for="(childs,index) in item.childs" :key="index" v-show="item.active" @click.stop="TowShow(Index,index)" class="one">
                                        <i v-if="childs.childs" class="icon Arrow" :class="[{'UPDown':childs.active},{'arrow':childs.childs}]" @click.stop ="TowShow(Index,index)"></i>                                        
                                        <i  class="icon unchecked" :class="{'checked':childs.checked}" @click.stop="checkbox(childs.id)"></i>                            
                                        <span>{{childs.fName}}</span>
                                        <transition-group name="fade" tag="ul">
                                            <li v-for="(child,index) in childs.childs" :key="index" v-show="childs.active" class="tow">
                                                <i class="icon unchecked" :class="{'checked':child.checked}" @click.stop="checkbox(child.id)"></i>                                                                
                                                <span>{{child.fName}}</span>                          
                                            </li>
                                        </transition-group>
                                    </li>                             
                            </transition-group>
                    </li>
                </ul>
            </div>  
            <div class="Btn">
                <Button Name="取消" class="None" @click.native="torole"/>
                <Button Name="确定" @click.native="FunSubmit"/>                    
            </div> 
    </div>
  </div>
</template>

<script>
import Select from "../../common/Select";
import Input from "../../common/Input"
import Button from "../../common/Button"
import Paging from "../../common/Paging"
import Mtk from '../../common/Mtk'
import {mapMutations,mapState} from "vuex"
export default {
    components:{Select,Input,Button,Paging,Mtk},
    data(){
      return{
        rNames:"",//角色名称
        pageNumber:'',//第几页（默认第一页）
        pageSize:10,//每页请求数据条数
        total:0,//总的数据条数           
        content:[], //数据数组
        IsShow:false, //新增修改遮罩层
        rAddMod:{
            Title:"新增角色信息",            
            rUpdateUser:"",  //遮罩层角色名称      
            rRemark : "", //遮罩层角色说明
            rName : "",  //遮罩层角色权限
            id:"" //角色id
        },
        Display:false, //单一权限分配遮罩层
        datas:{}, //单个角色信息储存
        list:[], //权限树数据
        funcs:[],//单个id功能权限
        funcIds:[],//权限id数据
        rNameShow:false,
      }
  },
  mounted(){
      this.getpage(1)
  },
  computed:{
      ...mapState(['functreevuex'])
  },
  methods:{
      ...mapMutations(['setDatas']),
        rNameblur(){
            if(!this.rAddMod.rName){
                return this.rNameShow = true
            }
            this.rNameShow = false
        },
        getpage(index){   //分页请求
            let _data = {
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
                rName:this.rNames,
            }
            this.$post(this.$host+"/api/sysmgr/role/gtisusadedrol",_data).then(d=>{    
                if(d.success){
                    this.content = d.pageData.content               
                    this.total = d.pageData.total
                    this.pageNumber  = d.pageData.pageNumber
                }
            })
        },
        sonInput(value,arguName){
            this[arguName] = value;
        },
        upInput(value,arguName){
            this.rAddMod[arguName]=value;
        },
        gotopower(){  //权限分配页跳转
            this.$router.push({path:"/NavDetail/ToAllocate",})
        },
        gotoadd(){ 
            this.IsShow = true
            this.rAddMod.Title ="新增角色信息" 
        },
        submit(id){
            let CanNot = true;//能提交
            if(!this.rAddMod.rName){
                    this.rNameShow = true
                    CanNot = false
            }
            if(!CanNot){
                return;
            }
            let _data = {
                    rname:this.rAddMod.rName,
                    rremark:this.rAddMod.rRemark,
            }
            if(id){ 
                _data.id=id,                 
                this.$post(this.$host+"/api/sysmgr/role/update",_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"1000",
                            onClose:()=>{
                                this.getpage(this.pageNumber)
                            }
                        });
                        this.cancel()                                
                    }
                })
            }else{
                this.$post(this.$host+"/api/sysmgr/role/add",_data).then(d=>{
                    if(d.success){                     
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                            duration:"1000",
                            onClose:()=>{
                                this.getpage(this.pageNumber)
                            }
                        });
                        this.cancel()                    
                    }
                })                   
            }
        },
        cancel(){
            this.IsShow = false
            this.rAddMod = {
                Title:"",            
                rUpdateUser:"",  //遮罩层角色名称      
                rRemark : "", //遮罩层角色说明
                rName : "",  //遮罩层角色权限
                id:"" //角色id
            }
            this.rNameShow = false;
        },
        Delete(index,item){  //删除角色
                this.$messagebox.confirm('此操作将永久删除该角色配置, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$post(this.$host+"/api/sysmgr/role/delete", {id:item.id}).then(d => {
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
                                duration:"1000",
                            });          
                    });
        },
        Modify(index,item){
            this.$post(this.$host+"/api/sysmgr/role/queryone",{id:item.id}).then(d=>{
                if(d.success){
                    this.rAddMod = {
                        rRemark : d.rRemark,
                        rName : d.rName,
                        id : item.id,
                        Title :"修改角色信息" 
                    }                         
                    this.IsShow = true 
                }
            })
        },
        assign(index,item){  //分配权限页跳转
            this.content.map( e=>{
                if(e.id == item.id){
                        this.datas = {
                                    id:e.id,
                                    rName:e.rName,
                                    R_REMARK:e.R_REMARK
                                }
                }
            })
            this.$post(this.$host+"/api/sysmgr/rolefunc/role/query",{roleId:item.id}).then(d =>{ //通过id查询功能权限
                    if(d.success){        
                            d.funcs.map( e=>{this.funcIds.push(e.id)})
                            this.funcs = d.funcs
                            if(this.functreevuex){
                                this.renderTree(this.functreevuex,this.funcIds)                                                                
                                this.list = this.functreevuex
                                this.Display = true; 
                            }else{
                                this.$post(this.$host+"/api/sysmgr/user/functree",{}).then(d =>{ //登录用户的权限树
                                    if(d.success){        
                                        this.renderTree(d.list,this.funcIds)
                                        this.list = d.list
                                        this.Display = true; 
                                        this.setDatas({name:'functreevuex',value:this.list})
                                    }
                                })
                            }    
                    }
            })
        },
        renderTree(data,arr){ //递归渲染功能权限树
            if(data != null){
                data.map( e=>{
                    e.active = true;arr.some(el=>{return(el == e.id)})? e.checked = true:e.checked = false;
                    this.renderTree(e.childs,arr)
                })
            }else{
            return data
            }
        },
        OneShow(index){//一级下拉切换
                this.list[index].active = !this.list[index].active;
        },
        TowShow(Index,index){//二级下拉切换
            this.list[Index].childs[index].active = !this.list[Index].childs[index].active;
                // this.list.map((e,i) =>{
                //     e.childs.map( e=>{
                //             if(e.id == id){
                //                     e.active = !e.active
                //             }
                //     })
                // })
        },
        checkbox(id){
            this.list.map((e,i)=>{
                    if(e.id == id){
                        e.checked = !e.checked
                        if(e.childs != null){
                            e.childs.map(el=>{
                                el.checked = e.checked
                                if(el.childs != null){
                                    el.childs.map(em=>{
                                        em.checked = e.checked
                                    })
                                }
                            })
                        }
                    }else if(e.childs != null){
                        e.childs.map((el,j)=>{
                            if(el.id == id){
                                el.checked = !el.checked
                                if(el.childs != null){
                                    el.childs.map(em=>{em.checked = el.checked})
                                }
                                    e.childs.some(el=>{return(el.checked)})?e.checked = true:e.checked = false;
                            }else if(el.childs != null){
                                    el.childs.map((em,k)=>{
                                        if(em.id == id){
                                            em.checked = !em.checked
                                            if(em.checked){e.checked = el.checked = true}
                                        }
                                    })
                            }
                        })
                    }
            })
        },
        updateId(Arr,arr){
            if(Arr != null){
                Arr.map((e,i)=>{
                    if(e.checked && arr.indexOf(e.id) == -1){
                        arr.push(e.id)
                    }else if(!e.checked && arr.indexOf(e.id) > -1){
                        arr.splice(arr.indexOf(e.id),1)
                    }
                    this.updateId(e.childs,arr)
                })
            }else{
                return arr
            }
        },
        FunSubmit(){  // 角色功能权限更新
                this.updateId(this.list,this.funcIds)
                let _data = {
                        roleId:this.datas.id, 
                        funcIds:this.funcIds,
                }
                this.$post(this.$host+"/api/sysmgr/rolefunc/update",_data).then(d =>{
                        if(d.success){
                            this.Display = false; 
                            this.funcIds=[];
                            this.$message({
                                type: 'success',
                                message: '提交成功!',
                                duration:"1000",
                            });                              
                        }
               })            
        },
        torole(){
             this.Display = false;
             this.funcIds=[];               
        },
    }
}
</script>

<style scoped>
.error{
  margin-left:.5rem;
  font-size:1rem;
  color: #f50;
}
.Role .unchecked::before{
   margin-left: .5rem;
   margin-right: .5rem;
}
.fade-enter-active, .fade-leave-active{
  transition: all 0.5s ease; 
}
.fade-enter, .fade-leave-active{
  opacity: 0 ;
}

.RoleHead{
    margin:0 1rem 1rem 0;
    display: inline-block;
    font-size: 1rem;
    color: #666666;
}
.BodyBtn button{
  margin:0 1rem 1rem 0!important;
}

.Role .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
/* 新增修改角色 */

 .Popup{
  width: 33.333333rem;
  height:20rem;
  background:#fff;
  border: solid 1px #ccc;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 4px;
  z-index: 1000;
}
 .Popup .Header{
    font-size: 1.333333rem;
    margin: 0 1.5rem 1.5rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
    color: #5d717c;  
}
 .Popup .RoleData{
    margin-top: 2rem;
} 
.RoleDataText{
    display: inline-block;
    width: 32%;
    font-size: 1rem; 
    color: #666666;
    text-align: right;
}

 .Popup  .RoleBtn{
    text-align: center;
    margin-top: 2.5rem;
} 
 .Popup  .RoleBtn button:first-child{
     margin-right: 2rem;
 }
/* 权限树 */
.Role .OneBy{
    width: 50rem;
	height:50rem;
	background: #fff;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
    border-radius: 4px;
    z-index: 1000;    
}
.Role .OneByHeader{
    font-size: 1.333333rem;
    margin: 0 1.5rem 1.5rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
    color: #5d717c;
}
.OneBy .titeltxt{
    display: inline-block;
    padding-left: 3rem;
    margin-bottom:.666667rem;
    width: 49%;
	font-size: 1rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.OneBy .titelText{
     padding-left: 2rem;
}
.OneBy .titeltxt span{
	font-size: 1rem;
	color: #666666;
}

.tree{
  width: 90%;
  height: 35rem;
  position: relative;
  overflow: hidden;
  border: solid 1px #efefef;
  margin:0 auto;
}
.tree .treeConent{
  width: 100%;
  height: 100%;
  overflow-y:scroll;
  padding:1rem 1.3rem 1rem 13.5rem;
}
.tree .treeConent li{
  line-height: 2.5rem;
  font-size: 1rem;
  cursor:pointer;
  vertical-align: middle;
}
.tree .treeConent li span{
  font-size: 1.166667rem;
  color: #666666;
}
.tree .treeConent .one{
  margin-left: 3.5rem;
}
.tree .treeConent .tow{
  margin-left: 2rem;
}
.tree .treeConent .arrow{
  margin-left: -1.5rem;
}
.OneBy .Btn{
   text-align: center;
   margin-top: 2rem;
}
.OneBy .Btn button:first-child{
   margin-right: 2rem;
}
</style>
