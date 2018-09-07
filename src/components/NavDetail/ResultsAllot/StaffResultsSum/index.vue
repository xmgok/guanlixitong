
<template>
  <div class="StaffResultsSum">
        <div class="StaffResultsBox">
              <span class="FontStyle">所在地区：</span>
              <getArea @getAreaCode="getAreaCode" />
        </div>
        <div class="StaffResultsBox">
              <span class="FontStyle">所属部门：</span>
              <span class="SearchBranch">
                    <Input placeholder="请选择部门" arguName="cName" :value="cName" @sonInput="sonInput" @click.native="ShowBranch" readonly="readonly" widths="9.166667rem"/>
                    <AboutBranch class="Storetem" :Radio="true" v-show="BranchShow" :Selected="SelectedStore" :style="{zIndex:998}"/>
              </span>
        </div>
        <div class="StaffResultsBox">
              <span class="FontStyle">所属门店：</span>
              <i class="ShopSelect" @click.stop="showShop"></i>
              <Input placeholder="输入/选择门店" :value="belongShop"  widths="9.166667rem"/>
              <div :class="{AllotResult:StoreShow}">
                    <AboutStore :AboutStoreSelected="AboutStoreSelected" v-show="StoreShow" :Radio="true"/>
              </div>
        </div>
        <div class="StaffResultsBox">
            <span class="FontStyle">生成日期：</span>
            <DateRange :value="[startTime,endTime]" :arguName="['startTime','endTime']" @getDateRange="getDateRange"/>
        </div>
        <div class="StaffResultsBox">
             <Button Name='查询' :Search="true" @click.native="Search"/>
             <Button Name="重置" :Reset="true" @click.native="Reset" />
        </div>
        <div>
            <Button name="导出" @click.native.stop="Export" />
        </div>
        <div class="StaffResultsSumTable">
            <template>
                <el-table :data="tableData" style="width: 100%" border @sort-change="Sorting">
                    <el-table-column label="门店" width="150" fixed>
                        <template slot-scope="scope">
                            <span> {{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="员工姓名" width="150" fixed>
                        <template slot-scope="scope">
                            <span @click.stop="OrderDdetail(scope.$index,scope.row)"> {{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="员工工号" width="150" prop="ocurDate" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.date }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="岗位" width="150" prop="ocurDate" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="职级" width="150" prop="ocurDate" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="汇总金额" width="150" prop="ocurDate" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="收款总业绩" width="150" prop="ocurDate" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务总提成" width="150" prop="ocurDate" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="销售总提成" width="150" prop="ocurDate" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
  </div>
</template>

<script>
import Input from '../../../common/Input'
import Button from '../../../common/Button'
import getArea from '../../../common/getArea'
import DateRange from '../../../common/DateRange'
import AboutStore from '../../../common/AboutStore'
import AboutBranch from '../../../common/AboutBranch'
import Paging from '../../../common/Paging'
export default {
    components:{Input,Button,getArea,DateRange,AboutStore,AboutBranch,Paging},
    data(){
      return{
          BranchShow:false,
          pageSize:20,
          cName:'',//部门名称
          belongShop:'',//门店名称
          aCode:'',//所在地区的code 
          cCode:'',           
          sCode:'',//门店sCode
          eId:'',
          startTime:"",//开始日期
          endTime:"",//截止日期
          ToggleShow:0,
          sDistrictCode:'',//所在地区的code
          StoreShow:false,
          fOrder: "desc",//发生日期desc 降序  asc 升序 
          yOrder: "desc",//业务发生额desc 降序  asc 升序 
          kOrder: "desc",//可分配金额desc 降序  asc 升序 
          wOrder: "desc",//未分配金额desc 降序  asc 升序 
          sOrder: "asc",//剩余分配时效desc 降序  asc 升序 
          tableData:[
              { date: 'ORD20180316223',name: '王小虎',},
              { date: 'ORD20180316203',name: '王小虎',},
              { date: 'ORD20180316200',name: '王小虎',},
          ],
      }
    },
    mounted(){
        // this.gotoPage(1)
    },
    methods:{
        gotoPage(index){
           let _data = {
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
                aCode:this.aCode,
                cCode:this.cCode,
                sCode:this.sCode,
                eId:this.eId,
                startTime:this.startTime,
                endTime:this.endTime,
                fOrder: this.fOrder,//发生日期desc 降序  asc 升序 
                yOrder: this.yOrder,//业务发生额desc 降序  asc 升序 
                kOrder: this.kOrder,//可分配金额desc 降序  asc 升序 
                wOrder: this.wOrder,//未分配金额desc 降序  asc 升序 
                sOrder: this.sOrder,//剩余分配时效desc 降序  asc 升序 
           }
            this.$post(this.$host+'/api/performance/emp/page',{}).then(d=>{
                if(d.success){

                }
            })
        },
        Sorting(column,prop,order){      
            if(column.order === 'ascending'){ //升序
                switch(column.prop){
                    case 'ocurDate':
                    this.fOrder = 'asc'
                    this.gotoPage(1)
                    break;
                    case 'factAmount':
                    this.yOrder = 'asc'
                    this.gotoPage(1)
                    break;
                    case 'canAmount':
                    this.kOrder = 'asc'
                    this.gotoPage(1)
                    break;
                    case 'notAllotAmount':
                    this.wOrder = 'asc'
                    this.gotoPage(1)
                    break;
                    case 'residueTime':
                    this.sOrder = 'asc'
                    this.gotoPage(1)
                    break;
                }
            }
            if(column.order === 'descending'){ //降序
                switch(column.prop){
                    case 'ocurDate':
                    this.fOrder = 'desc'
                    this.gotoPage(1)
                    break;
                    case 'factAmount':
                    this.yOrder = 'desc'
                    this.gotoPage(1)
                    break;
                    case 'canAmount':
                    this.kOrder = 'desc'
                    this.gotoPage(1)
                    break;
                    case 'notAllotAmount':
                    this.wOrder = 'desc'
                    this.gotoPage(1)
                    break;
                    case 'residueTime':
                    this.sOrder = 'desc'
                    this.gotoPage(1)
                    break;
                }
            }
        },
        getAreaCode(value){
            this.sDistrictCode = value
            console.log(this.sDistrictCode)
        },
        ShowBranch() {
            this.BranchShow = !this.BranchShow;
        },
        SelectedStore(model) {
            console.log(model);
            this.cCode = model.cCode;
            this.cName = model.cName;
            console.log(this.cCode,this.cName);
            this.ShowBranch();
        },
        sonInput(value,arguName){
            this[arguName] =  value
        },
        getDateRange(value,arguName){
            console.log(arguName,value)            
            if(value != null){
                this[arguName[0]]=value[0];
                this[arguName[1]]=value[1];
            }
        },
        AboutStoreSelected(modle){
            console.log(modle)
            this.belongShop=modle.sShortName;//门店名称
            console.log(this.belongShop)
            this.showShop();
        },
        showShop(){
            this.StoreShow = !this.StoreShow
        },
        Search(){
            if(!this.aCode && !this.cCode && !this.sCode && !this.eId && !this.endTime){
                this.$message({
                  type: 'info',
                  message: '请输入搜索内容！',
                  duration:"1000",
                });
                return
            }
            this.gotoPage(1)
        },
        Reset(){
            this.cName=''//部门名称
            this.belongShop=''//门店名称
            this.aCode ='' 
            this.cCode =''
            this.sCode ='' 
            this.eId ='' 
            this.endTime =''
            this.gotoPage(1)
        },
        Export(){},
        OrderDdetail(index,item){
            console.log(index,item)
            this.$router.push({path:'/NavDetail/StaffResultsDetail',query:{}})
        }
    }
}
</script>

<style>
.StaffResultsSum{
  height: 100%;
  background-color: #fff;
  padding: 1rem 1rem;
}
.StaffResultsBox{
  display: inline-block;
  margin:0 1rem 1rem 0;
  position: relative;
}
.StaffResultsBox .FontStyle{
  font-family: SimHei;     
}
.StaffResultsSumTable{
 max-width: 112.666667rem;
}



.SearchBranch {
  position: relative;
}
.SearchBranch .Storetem {
  position: absolute;
  left: 0%;
  top: 1.833333rem;
  z-index: 1000;
}
/* 遮罩层 */
.StaffResultsSum .AllotResult{
  background: rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.StaffResultsBox .ShopSelect {
  position: absolute;
  right: 0.8rem;
  top: 0.7rem;
  width: 8px;
  height: 8px;
  border-right: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  transform: rotate(45deg);
  cursor:pointer;
}
</style>
