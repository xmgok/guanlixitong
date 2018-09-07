<template>
  <div class="PresentIntegral">
      <div class="summaryBox"> 
          <span>所在地区：</span>
          <getArea @getAreaCode="getAreaCode" />
      </div>
      <div class="summaryBox">
           <span>所属部门：</span>
           <getCorpStore @getCorpStore="getCorpStore"/>
      </div>
      <div class="summaryBox">
          <span>所属门店：</span>
          <Select :SelecttemData="storeDatas" :values="belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonSelect" />
      </div>
      <div class="summaryBox">
          <span>赠送日期：</span>
          <DateRange :value="[changeTimeStart,changeTimeEnd]" :arguName="['changeTimeStart','changeTimeEnd']" @getDateRange="getDateRange"/>
      </div>
      <div class="summaryBox">
          <Button Name='查询' :Search="true" @click.native="Search"/>
          <Button Name="重置" :Reset="true" @click.native="Reset" />
      </div>
      <div>
            <Button Name='导出汇总'/>
            <Button Name="导出全部明细"/> 
      </div>
      <div class="summaryTable">
          <template>
                <el-table :data="content" style="width:100%" border @sort-change="Sorting">
                    <el-table-column label="部门" width="250" fixed>
                        <template slot-scope="scope">
                            <span> {{ scope.row.corpName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="门店" width="250">
                        <template slot-scope="scope">
                            <span> {{ scope.row.storeName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="赠送总积分" width="200" prop="ocurDate" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.sumIntegral }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="" fixed="right" width="150">
                        <template slot-scope="scope">
                            <Button Name="查看明细" class="Btn" @click.native.stop="ViewDetail(scope.$index,scope.row)"/>
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
import getArea from '../../common/getArea'
import getCorpStore from '../../common/getCorpStore'
import Select from '../../common/Select'
import DateRange from '../../common/DateRange'
import Paging from '../../common/Paging'
export default {
    components:{Input,Button,getArea,getCorpStore,Select,DateRange,Paging},
    data(){
        return{
            districtCode:'',//地区
            sCorp:'',//部门
            belongShop:'',//门店
            changeTimeStart:'',
            changeTimeEnd:'',
            pageSize:10,
            storeDatas:[],
            content:[
                {"sumIntegral": 60.0,"corpName": "奈瑞儿下级区域下级部门","storeName": "上海市嘉定区联友路门店","storeCode": "T001"},
            ],
            total:1,
        }
    },
    mounted(){
        this.gopage(1)
        this.getStore()
    },
    methods:{
        gopage(index){
            let _data = {
                districtCode:this.districtCode,
                sCorp:this.sCorp,
                belongShop:this.belongShop,
                changeTimeStart:this.changeTimeStart,
                changeTimeEnd:this.changeTimeEnd,
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
            }
            this.$post(this.$host+'/api/order/integralHis/getIntegralHisByStore',_data).then(d=>{
                if(d.success){
                    this.content = d.data.content
                    this.total = d.data.total
                }
            })
        },
        getAreaCode(value){
            this.districtCode = value
            console.log(this.districtCode)
        },
        sonSelect(value,arguName){
            this[arguName] = value
            console.log(value,arguName)            
        },
        getStore(){
            let data = {
                pageNumber: 1,
                pageSize: this.pageSize,
                cCode: this.sCorp || this.$getCookie("dept") || ""
            }
            this.$post(this.$host + "/api/store/store/query/page",data).then(d => {
                if (d.success) {
                    let content = d.pageData.content.map(e => {e.active = false;return e;})
                    this.storeDatas = content;
                }
            });
        },
        getCorpStore(value) {
            console.log(value)
            if (this.sCorp != value) {
                this.sCorp = value;
                this.belongShop = "";
                this.getStore();
            }
        },
        getDateRange(value,arguName){
            console.log(arguName,value)            
            if(value != null){
                this[arguName[0]]=value[0];
                this[arguName[1]]=value[1];
            }
        },
        Search(){
            if(!this.districtCode  && !this.sCorp && !this.belongShop && !this.changeTimeEnd){
                this.$message({
                  type: 'info',
                  message: '请输入搜索内容！',
                  duration:"1000",
                });
                return
            }
            this.gopage(1)
        },
        Reset(){
            if(!this.districtCode  && !this.sCorp && !this.belongShop && !this.changeTimeEnd)return
            this.districtCode=''//部门名称
            this.sCorp=''//门店名称
            this.belongShop ='' 
            this.changeTimeStart =''
            this.changeTimeEnd ='' 
            this.gopage(1)
        },
        Sorting(){},
        ViewDetail(index,item){
            this.$router.push({path:'/NavDetail/IntegraDetail',query:{storeCode:item.storeCode}})
        },
    },
}
</script>

<style>
.PresentIntegral{
    height: 100%;
    background-color: #fff;
}
.summaryBox{
    display: inline-block;
    margin:0 1rem 1rem 0;
}
.summaryTable{
    max-width: 70.916667rem;
}
</style>
