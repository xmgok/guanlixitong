<template>
  <div class="CustomerExpand">
        <header class="CustExp">
            <Button Name="新增" :iconadd='true' @click.native.stop="found"/>
        </header>
        <template>
            <el-table :data="data" style="width:100%" border>
                <el-table-column label="等级名称" prop="levName" width="200" fixed></el-table-column>
                <el-table-column label="生效条件" prop="levChangeValue" width="200">
                    <template slot-scope="scope">
                        {{'成长值 ≥' + scope.row.lvlChangeValue}}
                    </template>
                </el-table-column>
                <el-table-column label="默认折扣率" prop="levUseRules.discountRate" width="100" ></el-table-column>
                <el-table-column label="有效期" prop="levUseRules" width="300" >
                    <template slot-scope="scope">{{(scope.row.levUseRules&&(scope.row.levUseRules.isPerpetual==0)&&'永久有效')||(scope.row.levUseRules&&(scope.row.levUseRules.isPerpetual==1)&&'升级后'+scope.row.levUseRules.usefulTime+'个月')}}</template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <Button Name="查看" class="Btn purple" @click.native.stop="Toview(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                        <Button Name="修改" class="Btn purple" @click.native.stop="Torevise(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                        <Button Name="删除" class="Btn purple" @click.native.stop="Delete(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
  </div>
</template>

<script>
import Button  from "../../common/Button"
export default {
    components:{Button},
    data(){
        return{
            data:[],
        }
    },
    mounted(){
        this.$post(this.$host+`/api/cust/lev/queryall`,{}).then(d=>{
            if(d.success){
                this.data = d.data
            }
        })
    },
    methods:{
        Toview(index,item){
            this.$router.push({ path:"/NavDetail/ModifyGrade",
                                query:{see:'see',id:item.id}
            }) 
        },
        found(){
            this.$router.push({ path:"/NavDetail/NewGrade"}) 
        },
        Torevise(index,item){
            this.$router.push({path:"/NavDetail/ModifyGrade",
                                query:{id:item.id}
            })
        },
        Delete(index,item){
            this.$messagebox.confirm('此操作将永久删除该等级, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                  }).then(() => {
                        this.$post(this.$host+"/api/cust/lev/delete", {id:item.id}).then(d => {
                            if (d.success) {
                                    this.data.splice(index,1);
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!',
                                        duration:"1000",
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
        }
    }
}
</script>

<style>

.CustomerExpand .CustExp button{
    margin: 0 1rem 1rem 0;
}
</style>
