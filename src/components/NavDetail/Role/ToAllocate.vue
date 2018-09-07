<template>
    <div class="ToAllocate">
        <div class="clearfix">
            <div class="RoleTable left">
                <template>
                    <el-table :data="content" style="width:100%" border ref="single" highlight-current-row @row-click="clickRequest" >
                        <el-table-column label="角色名称" prop="rName" width="200"></el-table-column>
                        <el-table-column label="角色说明" prop="R_REMARK" width="399"></el-table-column>
                    </el-table>
                </template>
                <Paging :handleCurrentChange="Topage" :total="total"  class="pagingwidth"/>
            </div>
            <div class="FunTree left clearfix">
                <div class="SelectAll Cursor"><span @click.stop="CheckAll"><i class="icon unchecked" :class="{'checked':CheckedAll,'indeterminate':indeterminate}"></i>访问权限（全选）</span></div>
                <ul class="left">
                    <li v-for="(item,index) in list" class="clearfix" :class="{active:item.active}"><span @click.stop="CheckBox(item.id)" class="Cursor left"><i class="icon unchecked" :class="{'checked':item.checked}"></i>{{item.fName}}</span><i v-if="item.childs" class="icon RArrow Cursor right" @click.stop="OneShow(index,item)"></i></li>
                </ul>
                <el-collapse-transition>
                    <ul class="left" v-show="list2&&list2.length">
                        <li v-for="(item,index) in list2" class="clearfix" :class="{active:item.active}"><span @click.stop="CheckBox(item.id)" class="Cursor left"><i class="icon unchecked" :class="{'checked':item.checked}"></i>{{item.fName}}</span><i v-if="item.childs" class="icon RArrow Cursor right" @click.stop="TowShow(index,item)"></i></li>
                    </ul>
                </el-collapse-transition>
                <el-collapse-transition>
                    <ul class="left" v-show="list3&&list3.length">
                        <li v-for="(item,index) in list3" class="clearfix" :class="{active:item.active}"><span @click.stop="CheckBox(item.id)" class="Cursor left"><i class="icon unchecked" :class="{'checked':item.checked}"></i>{{item.fName}}</span></li>
                    </ul>
                </el-collapse-transition>
            </div>
        </div>        
        <div class="FunTreeBtn">
            <Button Name="取消" class="None" @click.native="torole"/>
            <Button Name="确定" @click.native="submit"/>              
        </div>
    </div>
</template>

<script>
import Button from "../../common/Button"
import Paging from "../../common/Paging"
export default {
    components:{Button,Paging},
    data(){
        return{
            pageNumber:1,//第几页（默认第一页）
            pageSize:20,//每页请求数据条数
            total:0,//总的数据条数               
            content:[], //数据数组
            funcIds:[],//权限id数组
            roleId:"",//用于保存角色id
            Index:'',            
            list:[], //权限树数据
            list2:[], //权限树数据            
            list3:[], //权限树数据 
            indeterminate:false,
            CheckedAll:false,    
        }
    },
    mounted(){
        this.Topage(1)    
        this.getfunctree()
    },
    methods:{
        getfunctree(){
            this.$post(this.$host+"/api/sysmgr/user/functree",{}).then(d =>{ //登录用户的权限树
                if(d.success){        
                    this.renderTree(d.list,this.funcIds)
                    this.list = d.list
                }
            })
        },
        renderTree(data,arr){ //递归渲染功能权限树
            if(data != null){
                data.map( e=>{
                    e.active = false;arr.some(el=>{return(el == e.id)})? e.checked = true:e.checked = false;
                    this.renderTree(e.childs,arr)
                })
            }else{
                return data
            }
        },
        Topage(index){
            let _data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
            }
            this.$post(this.$host+"/api/sysmgr/role/gtisusadedrol",_data).then(d=>{  //分页请求
                if(d.success){
                    this.content = d.pageData.content
                    this.total = d.pageData.total
                    this.pageNumber = d.pageData.pageNumber
                }
            })
        },
        CheckAll(){
            this.CheckedAll = !this.CheckedAll
            this.indeterminate = false
            this.CheckRender(this.list,this.CheckedAll)
        },
        CheckRender(arr,CheckedAll){
            if(arr){
                arr.map(e=>{
                    e.checked = CheckedAll
                    e.childs&&this.CheckRender(e.childs,CheckedAll)
                })
            }
        },
        clickRequest(row){
            this.$post(this.$host+"/api/sysmgr/rolefunc/role/query",{roleId:row.id}).then(d =>{ //通过id查询功能权限
                if(d.success){ 
                    this.funcIds=[];
                    this.roleId = row.id; 
                    let funcs = d.funcs  
                    funcs.map( e=>{this.funcIds.push(e.id)})
                    this.renderTree(this.list,this.funcIds) //根据id重新渲染权限树
                    this.CheckedAll=true;
                    this.CheckAllRender(this.list)
                    this.indeterminate = !this.CheckedAll
                }
            })
        },
        CheckAllRender(list){
            if(list){
                list.map(el=>{
                    if(!el.checked){
                        this.CheckedAll=false;
                    }
                    el.childs&&this.CheckAllRender(el.childs);
                })
            }
        },
        CheckBox(id){ //三级全选反选
            this.list.map((e,i)=>{
                if(e.id == id){
                    e.checked = !e.checked
                    if(e.childs){
                        e.childs.map(el=>{
                            el.checked = e.checked
                            if(el.childs){
                                el.childs.map(em=>{
                                    em.checked = e.checked
                                })
                            }
                        })
                    }
                    this.list.some(e=>{return(e.checked)})&&(this.indeterminate = true)||this.list.every(e=>{return(!e.checked)})&&(this.indeterminate = false)
                }else if(e.childs){
                    e.childs.map((el,j)=>{
                        if(el.id == id){
                            el.checked = !el.checked
                            if(el.childs){
                                el.childs.map(em=>{em.checked = el.checked})
                            }
                            e.childs.some(el=>{return(el.checked)})?this.indeterminate = e.checked = true:this.indeterminate = e.checked = false;
                        }else if(el.childs){
                            el.childs.map((em,k)=>{
                                if(em.id == id){
                                    em.checked = !em.checked
                                    !em.checked&&(this.indeterminate = true)
                                    em.checked&&(e.checked = el.checked = true)
                                }
                            })
                        }
                    })
                }
            })
            this.CheckedAll=true;
            this.CheckAllRender(this.list)
            this.CheckedAll&&(this.indeterminate=false)||this.indeterminate&&(this.CheckedAll=false)
        },
        OneShow(index,item){
            this.list2 = this.list[index].childs
            this.list.map(e=>{
                e.active = false
                e.childs&&e.childs.map(el=>{el.active = false})
            })
            this.list[index].active = true
            if(this.Index != index){
                this.list3 = []
            }
            this.Index = index            
        },
        TowShow(index,item){
            this.list2.map(e=>{e.active = false})
            this.list2[index].active = true
            this.list3 = this.list2[index].childs
        },
        updateId(Arr,arr){
            if(Arr){
                Arr.map((e,i)=>{
                    if(e.checked && arr.indexOf(e.id) == -1){
                        arr.push(e.id)
                    }else if(!e.checked && arr.indexOf(e.id) > -1){
                        arr.splice(arr.indexOf(e.id),1)
                    }
                    e.childs&&this.updateId(e.childs,arr)
                })
            }
        },
        submit(){  // 角色功能权限更新
            if(!this.roleId){
                this.$message({
                    type: 'info',
                    message: '请选择用户！',
                    duration:"1000",
                }); 
                return
            }
            this.updateId(this.list,this.funcIds)
            let _data = {
                roleId:this.roleId,
                funcIds:this.funcIds,
            }
            this.$post(this.$host+"/api/sysmgr/rolefunc/update",_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '保存成功！',
                        duration:"1000",
                    });  
                    this.Topage(this.pageNumber)    
                }
            })
        },
        torole(){
            this.$router.push({ path:"/NavDetail/Role"})
        },
    }
}
</script>

<style scoped>
.RoleTable{
    width: 50rem;
    display:inline-block;
    margin-right: 2rem;
}
.FunTree{
    display:inline-block;
}
.SelectAll{
    line-height: 2.5rem;
    padding: 0 .5rem;
}
.Cursor{
    cursor: pointer;
}
.FunTree li{
    width: 13rem;
    line-height: 2.5rem;
    padding: 0 .5rem;
}
.unchecked::before{
    margin-right: .5rem;
}
.FunTree li:hover{
    background: #f5f7fa;
}
.FunTree li.active{
    background: #f5f7fa;
}
.FunTreeBtn{
    margin-top: 2rem;
    text-align: center;
}
.FunTreeBtn button:first-child{
    margin-right: 2rem;
}
</style>
