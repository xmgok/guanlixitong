<template>
    <div class="LevelChange">
        <div class="Filter">
            <span>客户：</span>
            <Input :value="cCodeOrNameOrPhone" placeholder="客户名称/编号/手机号" widths="160px" arguName="cCodeOrNameOrPhone" @sonInput="sonInput"/>
        </div>
        <div class="Filter">
            <Button Name="查询" :Search="true" @click.native.stop="Search" />
        </div>
        <template>
            <el-table :data="content" style="width:100%" border>
                <el-table-column label="客户名称" prop="cName" width="120"></el-table-column>
                <el-table-column label="客户编号" prop="cCode" width="120"></el-table-column>
                <el-table-column label="客户手机号" prop="cPhone" width="150" ></el-table-column>
                <el-table-column label="变动前等级名称" prop="fromName" width="200" ></el-table-column>
                <el-table-column label="变动时间" prop="createTime"  width="200">
                    <template slot-scope="scope">{{$dateFormat("yy-MM-dd",scope.row.createTime)}}</template>
                </el-table-column>
                <el-table-column label="变动后等级名称" prop="toName" width="200" ></el-table-column>
                <el-table-column  min-width="1"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="Topage" :total="total"  class="pagingwidth"/>
    </div>
</template>

<script>
import Input from '../../common/Input'
import Button from '../../common/Button'
import Paging from '../../common/Paging'
export default {
    components:{Input,Button,Paging},
    data(){
        return{
            cCodeOrNameOrPhone:'',
            pageNumber:'',
            pageSize:20,
            total:0,
            content:[],
        }
    },
    mounted(){
        this.Topage(1)
    },
    methods:{
        Topage(index){
            let _data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
                cCodeOrNameOrPhone:this.cCodeOrNameOrPhone,
            }
            this.$post(this.$host+`/api/cust/lev/changehist/page`,_data).then(d=>{
                if(d.success){
                    this.content = d.data.content
                    this.pageNumber = d.data.pageNumber
                    this.total = d.data.total
                }
            })
        },
        sonInput(value,arguName){
            this[arguName]=value
        },
        Search(){
            if(!this.cCodeOrNameOrPhone)return
            this.Topage(1)
        }
    },
}
</script>

<style scoped>
.Filter{
    display: inline-block;
    margin:0 2rem 1rem 0;
}
</style>
