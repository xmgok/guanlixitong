<template>
    <div class="StaffResultsDetail">
        <div class="ResultsDetailBox">
            <span class="FontStyle">业绩日期：</span>
            <DateRange :value="timesArr" :arguName="['startTime','endTime']" @getDateRange="getDateRange"/>
        </div>
        <div class="ResultsDetailBox">
             <Button Name='查询' :Search="true" @click.native="Search"/>
        </div>
        <template>
            <el-table :data="content" style="width: 100%" border>
                <el-table-column label="业务单号" width="200" fixed>
                    <template slot-scope="scope">
                        <span class="BusiNo" @click.stop="OrderDdetail(scope.$index,scope.row)"> {{ scope.row.busiNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sName" label="业务发生门店" width="150"></el-table-column>
                <el-table-column prop="busiType " label="业务类型" width="150"></el-table-column>
                <el-table-column prop="busiDate" label="分配日期" width="150"></el-table-column>
                <el-table-column prop="cName" label="客户" width="150"></el-table-column>
                <el-table-column prop="factAmount" label="业务发生额" width="150"></el-table-column>
                <el-table-column prop="perAmount" label="可分配金额" width="150"></el-table-column>
                <el-table-column prop="empPerAmount" label="本人分得金额" width="150"></el-table-column>
                <el-table-column min-width="1"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="ToPage" :total="total"  class="pagingwidth"/>
    </div>
</template>

<script>
import DateRange from '../../../common/DateRange'
import Button from '../../../common/Button'
import Paging from '../../../common/Paging'
export default {
    components:{DateRange,Button,Paging},
    data(){
        return{
            pageSize:20,
            timesArr:[],
            pageNumber:'',
            total:0,
            content:[],
            sumConsumPerMoney: '',
            sumConsumBusiMoney: '',
            sumReciptPerMoney: '',
            fOrder: "desc",//发生日期desc 降序  asc 升序 
            yOrder: "desc",//业务发生额desc 降序  asc 升序 
            kOrder: "desc",//可分配金额desc 降序  asc 升序 
            wOrder: "desc",//未分配金额desc 降序  asc 升序 
            sOrder: "asc",//剩余分配时效desc 降序  asc 升序 
        }
    },
    mounted(){
        this.ToPage(1)
    },
    methods:{
        ToPage(index){
            let _data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
                startTime:this.timesArr[0],
                endTime:this.timesArr[1],
            }
            this.$post(this.$host+'/api/performance/emp/page',_data).then(d=>{
                if(d.success){
                    this.sumAmount()
                    this.content = d.data.content
                    this.total = d.data.total
                    this.pageNumber = d.data.pageNumber
                }
            })
        },
        sumAmount(){
            let _data ={
                startTime:this.timesArr[0],
                endTime:this.timesArr[1],
            }
            this.$post(this.$host+'/api/performance/emp/sumAmount',_data).then(d=>{
                if(d.success){
                    this.sumConsumPerMoney = d.data.sumConsumPerMoney
                    this.sumConsumBusiMoney = d.data.sumConsumBusiMoney
                    this.sumReciptPerMoney = d.data.sumReciptPerMoney
                }
            })
        },
        getDateRange(value,arguName){
            this.timesArr = value
        },
        Search(){
            if(this.timesArr.length==0){
                this.$message({
                  type: 'info',
                  message: '请选择搜索日期！',
                  duration:"1000",
                });
                return
            }
            this.ToPage(1)
        },
        OrderDdetail(index,item){
            this.$router.push({path:"/NavDetail/OrderDetail",query:{billNo:item.busiNo}})                                
        },
    },
}
</script>

<style>
.ResultsDetailBox{
  display: inline-block;
  margin:0 1rem 1rem 0;
}
.StaffResultsDetail .BusiNo {
    color: #1dade2;
    cursor: pointer;
}
</style>
