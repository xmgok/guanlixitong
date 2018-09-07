<template>
    <div class="Assignroles">
        <div class="AssignrolesTable">
            <div class="Hrader"><i class="icon sign"></i> 用户基本信息</div>
            <template>
                <el-table :data="Data" style="width:100%" border>
                    <el-table-column label="用户名称" prop="uName" width="200"></el-table-column>
                    <el-table-column label="登录账号" prop="uCode" width="200"></el-table-column>
                    <el-table-column label="性别" width="100">
                        <template slot-scope="scope">
                            <span> {{(scope.row.uSex === 0 && '女')||(scope.row.uSex === 1 && '男') }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号码" prop="uTel" width="150"></el-table-column>                    
                    <el-table-column label="岗位" prop="statName" width="150"></el-table-column>
                    <el-table-column label="职位" prop="postName" width="200"></el-table-column>
                    <el-table-column min-width="1"></el-table-column>
                </el-table>
            </template>
        </div>
        <div class="AssignrolesTable">
            <div class="Hrader"><i class="icon sign"></i> 角色分配</div>
            <template>
                <el-table :data="content" style="width:100%" border ref="Rtable"  @selection-change="change" @row-click="rowClick">
                    <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>                    
                    <el-table-column label="角色名称" prop="rName" width="250"></el-table-column>
                    <el-table-column label="角色说明" prop="R_REMARK" width="350"></el-table-column>
                    <el-table-column min-width="1"></el-table-column>
                </el-table>
            </template>
            <Paging :handleCurrentChange="RPagein" :total="total" class="pagingwidth"/>            
        </div>
        <div class="UserroleBtn">
            <Button Name="取消" class="None" @click.native="revoke"/>                         
            <Button Name="确定" @click.native="submit"/>
        </div>
    </div>
</template>

<script>
import Table from "../../common/Table"
import Paging from "../../common/Paging"
import Button from "../../common/Button"
export default {
    components:{Table,Paging,Button},
    data(){
        return{
            Data:[JSON.parse(this.$route.query.data)],//用户
            content:[],//获取当前用户增加的角色
            total:0,//角色总的数据条数
            pageSize:20,//每页请求数据条数
            roleIds:[],//用户拥有的角色id
            state:[],//状态            
        }
    },
    mounted(){
        let _data = {
            pageNumber:1,
            pageSize:this.pageSize,
            userId:JSON.parse(this.$route.query.data).id, 
        }
        this.$post(this.$host+"/api/sysmgr/role/gtisusadedrol",_data).then(d=>{ //仅获取当前用户增加的角色
                if(d.success){        
                        this.content = d.pageData.content
                        this.total = d.pageData.total
                        this.$post(this.$host+"/api/sysmgr/userrole/user/query",{userId:JSON.parse(this.$route.query.data).id}).then(d =>{ //通过id查询角色
                            if(d.success){
                                let roles = d.roles
                                roles.map(e=>{
                                    if(this.content.some(el=>{return e.id==el.id})){
                                        this.roleIds.push(e.id)
                                    }
                                })
                                this.RoleIdRender(this.roleIds)
                            }  
                     })   
               }
        })
    },
    methods:{
        RoleIdRender(roleIds){
            this.content.map((e,i)=>{
                if(roleIds.some(el=>{return(e.id==el)})){
                    this.$refs.Rtable.toggleRowSelection(e,true)
                }
            })
        },
        RPagein(index){
            this.getRoleIds(this.roleIds)
            let _data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
            }
            this.$post(this.$host+"/api/sysmgr/role/gtisusadedrol",_data).then(d=>{ //仅获取当前用户增加的角色
                if(d.success){ 
                        this.content = d.pageData.content
                        this.total = d.pageData.total
                        this.RoleIdRender(this.roleIds)
                }
            })
        },
        change(rows){
            this.state = rows
        },
        rowClick(row){
            this.$refs.Rtable.toggleRowSelection(row)
        },
        getRoleIds(roleIds){   //存储角色id方法
            this.content.map(e=>{
                if(this.state.some(el=>{return(e.id == el.id)}) && roleIds.indexOf(e.id) == -1){
                    roleIds.push(e.id)
                }else if(!this.state.some(el=>{return(e.id == el.id)}) && roleIds.indexOf(e.id) > -1){
                    roleIds.splice(roleIds.indexOf(e.id),1)
                }
            })
        },
        submit(){
            if(this.content.lenth==0){
                this.$message({
                    type: 'info',
                    message: '请创建相关角色,并赋予角色权限！',
                    duration:"1000",
                });
            }
            this.getRoleIds(this.roleIds)
            if(this.roleIds.length == 0){
                this.$message({
                    type: 'info',
                    message: '用户至少分配一个角色！',
                    duration:"1000",
                });
                return
            }
            let _data = {
                userId:this.Data[0].id,
                roleIds:this.roleIds,
            }
            if(this.Data[0].uCode==this.$getCookie('ucode')){
                    this.$confirm('此账号为当前登录账号，修改角色后将退出重新登录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.$post(this.$host+"/api/sysmgr/userrole/update",_data).then(d =>{
                        if(d.success){
                            this.$message({
                                type: 'success',
                                message: '操作成功!',
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
                this.$post(this.$host+"/api/sysmgr/userrole/update",_data).then(d =>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '操作成功!',
                            duration:"1000",
                            onClose:()=>{
                                this.revoke()
                            }
                        }); 
                    }
                })
            }
        },
        revoke(){
            this.$router.push({ path:"/NavDetail/User"})  
        },
    }
}
</script>

<style>
.Assignroles .Hrader{
    font-size: 1.166667rem;
    color:#2CBCC8;
    margin-bottom: .5rem;
    font-weight: 700;
}
.AssignrolesTable{
    margin-bottom: 3.333333rem;
}
.UserroleBtn{
    text-align: center;
    margin-top: 3.333333rem;
}
.UserroleBtn button:first-child{
    margin-right: 2rem;
}
</style>
