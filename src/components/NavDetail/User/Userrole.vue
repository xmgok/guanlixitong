<template>
  <div class="Userrole">
        <div class="Header">
            <div class="HeaderTitle"><i class="icon sign"></i> 用户账号</div>
            <template>
                <el-table :data="Ucontent" style="width:100%" border @row-click="QueryRole">
                    <el-table-column width="50">
                        <template slot-scope="scope"><el-checkbox v-if="scope.row.isSuperManger===0" @click.stop='QueryRole(scope.row)' v-model="scope.row.checked"></el-checkbox></template>
                    </el-table-column>
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
            <Paging :handleCurrentChange="UPagein" :total="utotal" :pageSize="pageSize" class="pagingwidth"/>
        </div>
        <div class="Header">
            <div class="HeaderTitle"><i class="icon sign"></i> 可分配角色</div>
            <template>
                <el-table :data="Rcontent" style="width:100%" border ref="Table"  @selection-change="change" @row-click="rowClick">
                    <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                    <el-table-column label="角色名称" prop="rName" width="250"></el-table-column>
                    <el-table-column label="角色说明" prop="R_REMARK" width="400"></el-table-column>
                    <el-table-column min-width="1"></el-table-column>
                </el-table>
            </template>
            <Paging :handleCurrentChange="RPagein" :total="rtotal" :pageSize="pageSize" class="pagingwidth"/>
        </div>
        <div class="UserroleBtn">
            <Button Name="取消" class="None" @click.native="revoke"/>                             
            <Button Name="保存" @click.native="submit"/>
        </div>
  </div>
</template>

<script>
import Button from "../../common/Button"
import Table from "../../common/Table"
import Paging from "../../common/Paging"
export default {
  components:{Button,Table,Paging},
  data(){
    return{
        uCode:'',
        utotal:0,//用户总的数据条数
        rtotal:0,//角色总的数据条数
        UpageNumber:'',//第几页（默认第一页）      
        RpageNumber:"",//第几页（默认第一页）
        pageSize:10,//每页请求数据条数
        Ucontent:[],//分页查询的用户数据
        Rcontent:[], //获取当前用户增加的角色
        roles:[],  //用于保存角色
        roleIds:[], //存储单个用户的角色id
        userId:"" ,//用于保存用户id
        state:[],//状态  
    }
  },
 mounted(){  
         this.UPagein(1) 
         this.RPagein(1) 
  },
  methods:{
    UPagein(index){ 
        let _data ={
            pageNumber:parseInt(index),           
            pageSize:this.pageSize,
        }
        this.$post(this.$host+"/api/sysmgr/user/query/page",_data).then((d)=>{ //分页查询用户 
                if(d.success){
                    this.utotal = d.data.total                    
                    let Ucontent = d.data.content
                    this.UpageNumber = d.data.pageNumber
                    Ucontent.map( e =>{e.checked = false}) 
                    this.Ucontent =  Ucontent 
                }
         })
    },
    RPagein(index){
        let _data ={
            pageNumber:parseInt(index),           
            pageSize:this.pageSize,
        }
        this.getRoleIds()                        
        this.$post(this.$host+"/api/sysmgr/role/gtisusadedrol",_data).then(d=>{ //仅获取当前用户增加的角色
            if(d.success){
                this.rtotal = d.pageData.total                
                this.RpageNumber = d.pageData.pageNumber                
                this.Rcontent = d.pageData.content
                this.RoleIdRender(this.roleIds)
            }
        })
    },
    UserChoice(id){//用户单选
        this.Ucontent.map((e,i)=>{
            if(id == e.id){
                e.checked = true;
            }else{
                e.checked = false;
            }
        })
    },
    QueryRole(item){ //通过用户id查询其角色
            if(item.isSuperManger===1)return
            this.roleIds = []            
            this.userId = item.id 
            this.uCode = item.uCode 
            this.UserChoice(item.id)
            this.$post(this.$host+"/api/sysmgr/userrole/user/query",{userId:item.id}).then(d =>{ //通过id查询角色
                if(d.success){
                    let roles = d.roles
                    roles.map(e=>{
                        if(this.Rcontent.some(el=>{return e.id==el.id})){
                            this.roleIds.push(e.id)
                        }
                    })
                    this.RoleIdRender(this.roleIds)
                }  
            }) 
    },
    RoleIdRender(roleIds){
        this.$refs.Table.clearSelection()
        this.Rcontent.map((e,i)=>{
            if(roleIds.some(el=>{return(e.id==el)})){
                this.$refs.Table.toggleRowSelection(e,true)
            }
        })
    },
    change(rows){
        if(!this.Ucontent.some(e=>{return(e.checked)})){
            this.$message({
                type: 'info',
                message: '请先选择用户!',
                duration:"1000",
            });
            this.$refs.Table.clearSelection()
            return
        }
        this.state = rows
    },
    rowClick(row){
        this.$refs.Table.toggleRowSelection(row)
    },
    getRoleIds(roleIds){   //存储角色id方法
        this.Rcontent.map(e=>{
            if(this.state.some(el=>{return(e.id == el.id)}) && roleIds.indexOf(e.id) == -1){
                roleIds.push(e.id)
            }else if(!this.state.some(el=>{return(e.id == el.id)}) && roleIds.indexOf(e.id) > -1){
                roleIds.splice(roleIds.indexOf(e.id),1)
            }
        })
    },
    submit(){
        if(!this.Ucontent.some(e=>{return(e.checked)})){
            this.$message({
                type: 'info',
                message: '请先选择用户！',
                duration:"1000",
            });
            this.$refs.Table.clearSelection()
            return
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
            userId:this.userId,
            roleIds:this.roleIds,
        }
        if(this.uCode==this.$getCookie('ucode')){
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
                        });
                        this.userId = '';   
                }
            })
        }
    },
    revoke(){
       this.$router.push({ path:"/NavDetail/User"})            
    }
  }
}
</script>

<style scoped>
.Userrole .unchecked::before{
    font-size: 16px;
}
.Userrole .checked::before{
    font-size: 16px;
}
.Userrole .Header {
    font-size: 1.166667rem;
    color:#2CBCC8;
    margin-bottom: .833333rem;
}
.HeaderTitle{
    font-size: 1.166667rem;
    font-weight: 700;
    margin-bottom: .5rem;
}
.Userrole  .UserroleBtn{
    text-align: center;
    margin-top: 3.333333rem;
}
.Userrole .UserroleBtn button:first-child{
    margin-right: 2rem;
}
</style>
