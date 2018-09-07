<template>
  <div class="IntegraDetail">
      <div class="DetailBox">
          <span>客户：</span>
          <Input arguName="cCode" :value="cCode" @sonInput="sonInput" widths="13.333333rem"/>
      </div>
      <div class="DetailBox" >
          <span></span>
      </div>
      <div class="DetailBox">
          <span>赠送日期：</span>
          <DateRange :value="[changeTimeStart,changeTimeEnd]" :arguName="['changeTimeStart','changeTimeEnd']" @getDateRange="getDateRange"/>
      </div>
      <div class="DetailBox">
          <Button Name='查询' :Search="true" @click.native="Search"/>
      </div>
      <div>
          <Button Name="导出明细"/> 
      </div>
      <div class="IntegraDetailTable">
          <template>
                <el-table :data="content" style="width:100%" border @sort-change="Sorting">
                    <el-table-column label="赠送日期" width="150" fixed prop="changeTime" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.changeTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="会员" width="150" prop="custName" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.custName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="赠送积分值" width="200" prop="changeAmount" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.changeAmount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注"  width="300">
                        <template slot-scope="scope">
                            <span> {{ scope.row.remark }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="赠送操作人"  width="150" fixed="right">
                        <template slot-scope="scope">
                            <span> {{ scope.row.presenter }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <Paging :handleCurrentChange="gopage" :total="total"/>
      </div>
  </div>
</template>

<script>
import Input from '../../common/Input'
import Button from '../../common/Button'
import DateRange from '../../common/DateRange'
import Paging from '../../common/Paging'
import Vue from 'vue'
import {Table} from 'element-ui'
export default {
    components:{Input,Button,DateRange,Paging},
    data(){
        return{
            cCode:'',//客户code/名称/手机
            changeTimeStart:'',//时间截距开始            
            changeTimeEnd:'',//时间截距结束     
            total:1,  
            content:[],   
        }
    },
    mounted(){
        this.gopage(1)
    },
    methods:{
        sonInput(value,arguName){
            this[arguName] = value
        },
        getDateRange(value,arguName){
            console.log(arguName,value)            
            if(value != null){
                this[arguName[0]]=value[0];
                this[arguName[1]]=value[1];
            }
            console.log(this.changeTimeEnd)
        },
        gopage(index){
            let _data = {
                cCode:this.cCode,
                belongShop:this.$route.query.storeCode,
                changeTimeStart:this.changeTimeStart,            
                changeTimeEnd:this.changeTimeEnd,   
            }
            this.$post(this.$host+'/api/order/integralHis/getIntegralHisOfPresent',_data).then(d=>{
                if(d.success){
                    d.data.content.map(e=>{e.changeTime? e.changeTime  = this.$dateFormat("yy-MM-dd hh:mm:ss",e.changeTime) : null ;})
                    this.content = d.data.content
                    this.total = d.data.total
                }
            })
        },
        Search(){
            if(!this.cCode && !this.changeTimeEnd){
                this.$message({
                  type: 'info',
                  message: '请输入搜索内容！',
                  duration:"1000",
                });
                return
            }
            this.gopage(1)
        },
        Sorting(){}
    }
}
</script>

<style>
.IntegraDetail{
    height: 100%;
    background-color: #fff;
}
.DetailBox{
    display: inline-block;
    margin:0 1rem 1rem 0;
}
.IntegraDetailTable{
    width: 79.25rem;
}
</style>
