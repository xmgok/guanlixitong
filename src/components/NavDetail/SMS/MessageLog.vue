<template>
    <div class="MessageLog">
        <template>
            <el-table :data="content"  style="width:100%" border>
                <el-table-column prop="busiCode" label="业务单号" width="200"></el-table-column>
                <el-table-column label="业务类型" width="120">
                    <template slot-scope="scope">
                        <span>{{ (scope.row.busiType==0&&'预约')||(scope.row.busiType==1&&'注册')||(scope.row.busiType==2&&'促销') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
                <el-table-column prop="msg" label="短信内容" width="450"></el-table-column>
                <el-table-column label="发送时间" width="150">
                    <template slot-scope="scope">
                        <span>{{ $dateFormat("yy-MM-dd hh:mm:ss",scope.row.sendTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="retMsg" label="返回消息" width="150"></el-table-column>                
                <el-table-column label="发送状态" width="120">
                    <template slot-scope="scope">
                        <span>{{ (scope.row.status==0&&'成功')||(scope.row.status==1&&'失败') }}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="Topage" :total="total" class="pagingwidth"/>
    </div>
</template>

<script>
import Paging from '../../common/Paging'
export default {
    components:{Paging},    
    data(){
        return{
            content:[],
            pageNumber:'',
            pageSize:20,
            total:0,
        }
    },
    mounted(){
        this.Topage(1)
    },
    methods:{
        Topage(index){
            let data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
            }
            this.$post(this.$host+'/api/msg/log/findMsgLogPage',data).then(d=>{
                if(d.success){
                    this.content = d.data.content
                    this.pageNumber = d.data.pageNumber
                    this.total = d.data.total
                }
            })
        }
    },
}
</script>

<style scoped>

</style>
