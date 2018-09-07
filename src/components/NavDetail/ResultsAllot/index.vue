<template>
  <div class="ResultAllot">
        <div class="ResultBox" v-if="areaShow">
              <span class="FontStyle">所在地区：</span>
              <getArea @getAreaCode="getAreaCode" :values="aCodeArr"/>
        </div>
        <div class="ResultBox" v-if="corpShow">
              <span class="FontStyle">所属部门：</span>
              <getCorpStore @getCorpStore="getCorpStore" :values="cCodesArr"/>
        </div>
        <div class="ResultBox" v-if="sCodeShow">
              <span class="FontStyle">所属门店：</span>
              <Select :SelecttemData="storeDatas" :values="sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonInput"  widths="13.333333rem"/>
        </div>
        <div class="ResultBox">
            <span class="FontStyle">生成日期：</span>
            <DateRange :values="timesArr" :arguName="['startTime','endTime']" @getDateRange="getDateRange"/>
        </div>
        <div class="ResultBox">
              <span class="FontStyle">分配状态：</span>
              <Select :SelecttemData="perStatusArr" :values="perStatus" arguName="perStatus" :SelecttemDetail="['perStatus','name']" @sonSelect="sonInput"  widths="13.333333rem"/>
        </div>
        <div class="ResultBox">
             <Button Name='查询' :Search="true" @click.native="Toggle"/>
             <Button Name="重置" :Reset="true" @click.native="Reset" />
        </div>
        <ul class="clearfix">
            <li class="ResultSelect" :class="{ToggleShow:item.ToggleShow===ToggleShow}" v-for="(item,index) in ToggleShowArr" :key="index" @click.stop="toggle(item.ToggleShow)">{{item.name}}<i class="icon icongou" v-show="item.ToggleShow===ToggleShow"></i></li>
        </ul>
        <div class="ResultAllotTable" v-show="ToggleShow===0">
             <template>
                <el-table :data="Fcontent" style="width:100%" border @sort-change="Sorting">
                    <el-table-column label="业务单号" width="160" prop="busiNo" fixed>
                        <template slot-scope="scope">
                            <span class="Btncor" @click.stop="OrderDdetail(scope.$index,scope.row)"> {{ scope.row.busiNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="可分配员工" width="130" prop="empName" fixed>
                        <template slot-scope="scope">{{ scope.row.empName+'...'}}</template>
                    </el-table-column>
                    <el-table-column label="业务发生门店" width="160" prop="sName"></el-table-column>
                    <el-table-column label="发生时间" width="150" prop="ocurDate" sortable="custom"></el-table-column>
                    <el-table-column label="客户" width="80" prop="cName">
                        <template slot-scope="scope">
                            <span class="Btncor" @click.stop="ClientDetail(scope.$index,scope.row)"> {{ scope.row.cName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="业务发生额" width="120" prop="factAmount" sortable="custom"></el-table-column>
                    <el-table-column label="分配总金额" width="120" prop="perAmount" sortable="custom"></el-table-column>
                    <el-table-column label="未分配金额" width="120" prop="canAmount" sortable="custom"></el-table-column>
                    <el-table-column label="剩余分配时效" width="150" prop="residueTime" sortable="custom"></el-table-column>
                    <el-table-column label="分配状态" width="100">
                        <template slot-scope="scope">
                            <span> {{ (scope.row.perStatus == 0 && '未分配')||(scope.row.perStatus == 1 && '部分分配')||(scope.row.perStatus == 2 && '已分配') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="150">
                        <template slot-scope="scope">
                            <Button Name="分配业绩" class="Btn" v-if="scope.row.canallot&&sCodeDisplay&&isShop" @click.native.stop="AllocateResult(scope.$index,scope.row)"/>
                            <Button Name="查看业绩" class="Btn" v-if="!scope.row.canallot&&scope.row.perStatus!=0" @click.native.stop="SeeResult(scope.$index,scope.row)"/>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="1" fixed="right"></el-table-column>
                </el-table>
            </template>
            <Paging :handleCurrentChange="gotoFPage" :total="Ftotal"  class="pagingwidth" :currentPage='FpageNumber'/>
        </div>
        <div class="ResultAllotTable" v-show="ToggleShow==1">
             <template>
                <el-table :data="Scontent" style="width:100%" border @sort-change="Sorting">
                    <el-table-column label="业务单号" width="160" prop="busiNo" fixed>
                        <template slot-scope="scope">
                            <span class="Btncor" @click.stop="OrderDdetail(scope.$index,scope.row)"> {{ scope.row.busiNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="可分配员工" width="130" fixed>
                        <template slot-scope="scope">
                            <span :class="{Btncor:scope.row.canallot?(scope.row.perStatus!=2?true:false):false}" @click.stop="ChoiceStaff(scope.$index,scope.row)"> 
                                {{ scope.row.empName==null?'(未选择)':scope.row.empName+'...'}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="业务发生门店" width="160" prop="sName"></el-table-column>
                    <el-table-column label="发生时间" width="150" prop="ocurDate" sortable="custom"></el-table-column>
                    <el-table-column label="客户" width="80" prop="cName">
                        <template slot-scope="scope">
                            <span class="Btncor" @click.stop="ClientDetail(scope.$index,scope.row)"> {{ scope.row.cName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="业务发生额" width="120" prop="factAmount" sortable="custom"></el-table-column>
                    <el-table-column label="分配总金额" width="120" prop="perAmount" sortable="custom"></el-table-column>
                    <el-table-column label="未分配金额" width="120" prop="canAmount" sortable="custom"></el-table-column>
                    <el-table-column label="剩余分配时效" width="150" prop="residueTime" sortable="custom"></el-table-column>
                    <el-table-column label="分配状态" width="100">
                        <template slot-scope="scope">
                            <span> {{ (scope.row.perStatus == 0 && '未分配')||(scope.row.perStatus == 1 && '部分分配')||(scope.row.perStatus == 2 && '已分配') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="150">
                        <template slot-scope="scope">
                            <Button Name="分配业绩" class="Btn" v-if="scope.row.canallot&&sCodeDisplay&&isShop" @click.native.stop="AllocateResult(scope.$index,scope.row)"/>
                            <Button Name="查看业绩" class="Btn" v-if="!scope.row.canallot&&scope.row.perStatus != 0" @click.native.stop="SeeResult(scope.$index,scope.row)"/>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="1" fixed="right"></el-table-column>
                </el-table>
            </template>
            <Paging :handleCurrentChange="gotoSPage" :total="Stotal"  class="pagingwidth" :currentPage="SpageNumber"/>
        </div>
        <Mtk v-show="ResultIsShow"/>
        <div v-show="ResultIsShow" class="ResultInfo">
            <header class="ResultHeader">{{ToggleShow===0?'分配服务提成':'分配收款业绩'}}<i class="icon Fork Postion" @click.stop="cancel"></i></header>
            <div v-if="ToggleShow==0" class="ResultContentBox">
                <div v-for="(item,index) in list" :key="index">
                    <div>服务项目：{{item.psName}}</div>
                    <div class="ResultContent">
                        <span class="">可分配：<span class="Resultmoney">￥{{item.perAmo}}</span></span>
                        <span class="">已分配：<span class="Resultmoney">￥{{item.residue}}</span></span>
                        <Button Name='平分' @click.native="Bisect(index,item)"/>
                    </div>
                    <div class="tableH">
                        <el-table :data="item.list" border style="width: 100%">
                            <el-table-column prop="empName" label="姓名"  width="109"></el-table-column>
                            <el-table-column label="金额" width="200">
                                <template slot-scope="scope">
                                    <span v-if="BtnShow" class="ContentBox">
                                        ￥ <Input :arguName="[index,scope.$index]" :value="scope.row.perMoney" @sonInput="SetperMoney" widths="6.666667rem"/>
                                    </span>
                                    <span v-if="!BtnShow">￥{{scope.row.perMoney}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="百分比" width="200">
                                <template slot-scope="scope">
                                    <span v-if="BtnShow" class="ContentBox">
                                        <Input :arguName="[index,scope.$index]" :value="scope.row.Percent" @sonInput="SetPercent" widths="6.666667rem" :maxlength="5"/> %
                                    </span>
                                    <span v-if="!BtnShow">{{scope.row.Percent}}%</span>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="1"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div v-else-if="ToggleShow==1" class="ResultContentBox">
                <div class="ResultContent">
                    <span class="ResultText">可分配：<span class="Resultmoney">￥{{perAmount}}</span></span>
                    <span class="ResultText">已分配：<span class="Resultmoney">￥{{ResidueAmount}}</span></span>                
                </div>
                <div class="tableH">
                    <el-table :data="list" border style="width: 100%">
                        <el-table-column prop="empName" label="姓名"  width="109"></el-table-column>
                        <el-table-column label="金额" width="200">
                            <template slot-scope="scope">
                                <span v-if="BtnShow" class="ContentBox">
                                    ￥ <Input :arguName="scope.$index" :value="scope.row.perMoney" @sonInput="getperMoney" widths="6.666667rem"/>
                                </span>
                                <span v-if="!BtnShow">￥{{scope.row.perMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="百分比" width="200">
                            <template slot-scope="scope">
                                <span v-if="BtnShow" class="ContentBox">
                                    <Input :arguName="scope.$index" :value="scope.row.Percent" @sonInput="getPercent" widths="6.666667rem" :maxlength="5"/> %
                                </span>
                                <span v-if="!BtnShow">{{scope.row.Percent}}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="1"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="ResultBtn">
                <Button Name="取消" class="None" @click.native="cancel"/>
                <Button Name="确定" @click.native="save"/>
            </div>
        </div>
        <AboutPeople :RadioPeople="false" v-if="modelemployee" :submit="submit" :SelectedData="Employees" :canclefun="canclefun" :corpShow="corpShow" :sCodeShow="sCodeShow"/>        
  </div>
</template>

<script>
import Mtk from '../../common/Mtk'
import Input from '../../common/Input'
import Button from '../../common/Button'
import Select from '../../common/Select'
import DateRange from '../../common/DateRange'
import Paging from '../../common/Paging'
import {mapState,mapMutations} from 'vuex'
export default {
    name:"ResultsAllot",
    components:{Mtk,Input,Button,Select,
    getArea:resolve => {require(['../../common/getArea'],resolve)},
    DateRange,
    getCorpStore:resolve => {require(['../../common/getCorpStore'],resolve)},
    Paging,
    AboutPeople:resolve => {require(['../../common/AboutPeople'],resolve)}},
    data(){
        return{
            isShop:false,
            areaShow:false,//地区权限
            corpShow:false,//部门权限
            sCodeShow:false,//门店权限
            ToggleShowArr:[
                {name:'服务提成',ToggleShow:0},
                {name:'收款业绩',ToggleShow:1},
                // {name:'商品销售提成',ToggleShow:2},
            ],
            ToggleShow:0,
            storeDatas:[],
            perStatusArr:[
                {name:'待分配',perStatus:-1},
                {name:'已分配',perStatus:2},
                {name:'已过期',perStatus:-2}
            ],
            perStatus:'',
            aCodeArr:[],
            aCode:'',//所在地区的code 
            cCodesArr: this.$getCookie('belongShop')=='null'?[this.$getCookie('dept')]:[],
            cCode: this.$getCookie('dept'), //部门code        
            sCode: this.$getCookie('belongShop'),//门店sCode
            sCodeDisplay: this.$getCookie('belongShop')=='null'?false:true,
            eId:'',
            timesArr:[],//日期
            // startTime:"",//开始日期
            // endTime:"",//截止日期
            fOrder: "desc",//发生日期desc 降序  asc 升序 
            yOrder: "",//业务发生额desc 降序  asc 升序 
            kOrder: "",//可分配金额desc 降序  asc 升序 
            wOrder: "",//未分配金额desc 降序  asc 升序 
            // sOrder: "asc",//剩余分配时效desc 降序  asc 升序 
            FpageNumber:1,//服务页数
            SpageNumber:1,//收款页数
            pageSize:20,
            Ftotal:0,
            Stotal:0,
            Fcontent:[],//服务数据
            Scontent:[],//收款数据
            ResultIsShow:false,
            updTimestamp :'',//时间标记
            perAmount :'',//分配总额
            residueAmount :'',// 剩余分配额
            iId:'',//分配单id
            billNo:'',//查看员工订单号
            list:[],//员工分配详情
            BtnShow:false,
            modelemployee:false,
            // AddempIsShow:false,
            employees:[],//已选中的员工
            Employees:[],//传入组件的员工
        }
    },
    computed:{
        ...mapState(['storesvuex']),
        ResidueAmount(){
            let sum = 0
            this.list.map(e=>{
                sum += e.perMoney*1
            })
            if(sum > this.perAmount){
                this.$message({
                    type: 'info',
                    message: '已超出可分配总额！',
                    duration:"1500",
                });
            }
            return this.residueAmount = parseInt(sum*100)/100
        },
        residue(item){

        }
    },
    mounted(){
        this.getStore();
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F065") {//业绩分配的权限
                if (el.fUrl == "area") {
                    this.areaShow = true;
                }
                if (el.fUrl == "corp") {   
                    this.corpShow = true;
                }
                if (el.fUrl == "sCode") {
                    this.sCodeShow = true;
                }
            }
        })
    },
    activated(){
        //查询会员列表
        let type=this.$route.query.type||"";
        if (this.$getCookie("belongShop")){
          this.isShop = true;
        }else{
          this.isShop = false;
        }
        if(type=="undistributed"){//待分配提成/业绩
            this.perStatus=-1;
        }else{
            this.perStatus="";
        }
        this.gotoFPage(this.FpageNumber)
        this.gotoSPage(this.SpageNumber)
    },
    methods:{
        ...mapMutations(['setDatas']),
        getAreaCode(value){
            if(this.aCode != value){
                this.aCode = value
                this.sCode = "";
                this.getStore()
                console.log(this.aCode)
            }
        },
        getCorpStore(value) {
            console.log(value)
            if (this.cCode != value[value.length-1]) {
                this.cCode = value[value.length-1];
                this.sCode = "";
                this.getStore();
            }
        },
        //根据部门 查门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.cCode || this.$getCookie("dept") || "",
                queryType:0,
                sDistrictCode:this.aCode||''
            }
            if(!this.cCode&&!this.aCode){//默认门店（当前部门下的门店）
                if(this.storesvuex){
                    this.storesvuex.map(e=>{
                        e.active=false;
                        return e;
                    })
                    this.storeDatas=this.storesvuex;
                }else{
                    this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                        if(d.success){
                            let content=d.data.content.map(e=>{
                                e.active=false;
                                return e;
                            })
                            this.storeDatas=content;
                            this.setDatas({name:"storesvuex",value:this.storeDatas})
                        }
                    });
                }
            }else{
                this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                    if(d.success){
                        let content=d.data.content.map(e=>{
                            e.active=false;
                            return e;
                        })
                        this.storeDatas=content;
                    }
                });
            }
        },
        Toggle(){
            if(this.ToggleShow === 0){
                this.gotoFPage(1)
            }
            if(this.ToggleShow === 1){
                this.gotoSPage(1)
            }
            if(this.ToggleShow === 2){
            }
        },
        Sorting(column,prop,order){  
            if(column.order === 'ascending'){ //升序
                switch(column.prop){
                    case 'ocurDate':
                    this.fOrder = 'asc';this.yOrder = this.kOrder = this.wOrder = ''
                    this.Toggle()
                    break;
                    case 'factAmount':
                    this.yOrder = 'asc';this.fOrder = this.kOrder = this.wOrder = ''
                    this.Toggle()
                    break;
                    case 'perAmount':
                    this.kOrder = 'asc';this.yOrder = this.fOrder = this.wOrder = ''
                    this.Toggle()
                    break;
                    case 'canAmount':
                    this.wOrder = 'asc';this.yOrder = this.kOrder = this.fOrder = ''
                    this.Toggle()
                    break;
                    case 'residueTime':
                    this.fOrder = 'desc';this.yOrder = this.kOrder = this.wOrder = ''
                    this.Toggle()
                    break;
                }
            }
            if(column.order === 'descending'){ //降序
                switch(column.prop){
                    case 'ocurDate':
                    this.fOrder = 'desc';this.yOrder = this.kOrder = this.wOrder = ''
                    this.Toggle()
                    break;
                    case 'factAmount':
                    this.yOrder = 'desc';this.fOrder = this.kOrder = this.wOrder = ''
                    this.Toggle()
                    break;
                    case 'perAmount':
                    this.kOrder = 'desc';this.yOrder = this.fOrder = this.wOrder = ''
                    this.Toggle()
                    break;
                    case 'canAmount':
                    this.wOrder = 'desc';this.yOrder = this.kOrder = this.fOrder = ''
                    this.Toggle()
                    break;
                    case 'residueTime':
                    this.fOrder = 'asc';this.yOrder = this.kOrder = this.wOrder = ''
                    this.Toggle()
                    break;
                }
            }
        },
        gotoFPage(index){
            let _data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
                aCode:this.aCode,
                cCode:this.cCode,
                sCode:this.sCode,
                eId:this.eId,
                perStatus:this.perStatus,
                startTime:this.timesArr[0],
                endTime:this.timesArr[1],
                fOrder: this.fOrder,//发生日期desc 降序  asc 升序 
                yOrder: this.yOrder,//业务发生额desc 降序  asc 升序 
                kOrder: this.kOrder,//可分配金额desc 降序  asc 升序 
                wOrder: this.wOrder,//未分配金额desc 降序  asc 升序 
                // sOrder: this.sOrder,//剩余分配时效desc 降序  asc 升序 
            }
            this.$post(this.$host+'/api/performance/servallot/page',_data).then(d=>{
                if(d.success){
                    let Fcontent = d.data.content
                    Fcontent.map(e=>{e.ocurDate? e.ocurDate  = this.$dateFormat("yy-MM-dd hh:mm:ss",e.ocurDate) : null ;})
                    this.Fcontent = Fcontent
                    this.FpageNumber = d.data.pageNumber
                    this.Ftotal = d.data.total
                }
            })
        },
        gotoSPage(index){
            let _data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
                aCode:this.aCode,
                cCode:this.cCode,
                sCode:this.sCode,
                eId:this.eId,
                perStatus:this.perStatus,                
                startTime:this.timesArr[0],
                endTime:this.timesArr[1],
                fOrder: this.fOrder,//发生日期desc 降序  asc 升序 
                yOrder: this.yOrder,//业务发生额desc 降序  asc 升序 
                kOrder: this.kOrder,//可分配金额desc 降序  asc 升序 
                wOrder: this.wOrder,//未分配金额desc 降序  asc 升序 
                // sOrder: this.sOrder,//剩余分配时效desc 降序  asc 升序 
            }
            this.$post(this.$host+'/api/performance/receiptallot/page',_data).then(d=>{
                if(d.success){
                    let Scontent = d.data.content
                    Scontent.map(e=>{e.ocurDate ? e.ocurDate  = this.$dateFormat("yy-MM-dd hh:mm:ss",e.ocurDate) : null ;})
                    this.Scontent = Scontent
                    this.SpageNumber = d.data.pageNumber
                    this.Stotal = d.data.total
                }
            })
        },
        Reset(){
            this.aCodeArr = []
            this.aCode =  ''               
            this.cCodesArr = this.$getCookie('belongShop')=='null'?[this.$getCookie('dept')]:[]
            this.cCode = this.$getCookie('belongShop')=='null'?this.$getCookie('dept'):"", //部门code 
            this.sCode = this.$getCookie('belongShop')=='null'?'':this.$getCookie('belongShop'),//门店sCode
            this.eId ='' 
            this.timesArr = []
            this.getStore()
        },
        sonInput(value,arguName){
            this[arguName]=value
        },
        SetperMoney(value,index){
            let index0=index[0]
            let index1=index[1]
            if(value==0||!value){
                this.list[index0].list[index1]['perMoney'] = this.list[index0].list[index1]['Percent'] = ''
                let residue=0
                this.list[index0].list.map(e=>{ residue+=Number(e.perMoney)})    
                this.list[index1]['residue']=residue                    
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(value*1)){
                this.$message({
                    type: 'warning',
                    message: '金额格式为可包含俩位小数的数字！',
                    duration:"1200",
                });
            }else{
                this.list[index0].list[index1]['perMoney']  = value
                this.list[index0].list[index1]['Percent'] =  parseInt(value/this.list[index0]['perAmo']*10000)/100
                let residue=0
                this.list[index0].list.map(e=>{ residue+=Number(e.perMoney)})   
                this.list[index0]['residue']=residue
                let perAmo = this.list[index1].perAmo
                if(residue>perAmo){
                    this.$message({
                        type: 'warning',
                        message: '已超出可分配金额！',
                        duration:"1200",
                    });
                }
            }
        },
        SetPercent(value,index){
            let index0=index[0]
            let index1=index[1]
            if(value==0||!value){
                this.list[index0].list[index1]['Percent'] = this.list[index0].list[index1]['perMoney'] = ''
                let residue=0
                this.list[index0].list.map(e=>{ residue+=Number(e.perMoney)})    
                this.list[index0]['residue']=residue                     
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(value*1)){
                this.$message({
                    type: 'warning',
                    message: '百分比格式为可包含俩位小数的数字！',
                    duration:"1200",
                });
            }else{
                this.list[index0].list[index1]['Percent'] = value
                this.list[index0].list[index1]['perMoney'] = parseInt(value*this.list[index0]['perAmo'])/100
                let residue=0
                this.list[index0].list.map(e=>{ residue+=Number(e.perMoney)})  
                this.list[index0]['residue']=residue
                let perAmo = this.list[index1].perAmo
                if(residue>perAmo){
                    this.$message({
                        type: 'warning',
                        message: '已超出可分配金额！',
                        duration:"1200",
                    });
                }
            }          
        },
        getperMoney(value,index){       
            if(value==0||!value){
                this.list[index]['perMoney'] = this.list[index].Percent = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(value*1)){
                this.$message({
                    type: 'warning',
                    message: '金额格式为可包含俩位小数的数字！',
                    duration:"1200",
                });
            }else{
                this.list[index]['perMoney'] = value
                this.list[index].Percent =  parseInt(this.list[index]['perMoney']/this.perAmount*10000)/100              
            }
        },
        getPercent(value,index){
            if(value==0||!value){
                this.list[index]['Percent'] = this.list[index].perMoney = ''
                return
            }        
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(value*1)){
                this.$message({
                    type: 'warning',
                    message: '百分比格式为可包含俩位小数的数字！',
                    duration:"1200",
                });
            }else{
                this.list[index]['Percent'] = value
                this.list[index].perMoney = parseInt(this.list[index]['Percent']*this.perAmount)/100
            }
        },
        getDateRange(value,arguName){
            this.timesArr = value
        },
        toggle(num){                       
            if(this.ToggleShow != num){
                this.ToggleShow = num      
            }
        },
        OrderDdetail(index,item){
            if(this.ToggleShow===0){
                this.$router.push({path:"/NavDetail/OrderDetail",query:{billNo:item.busiNo}})
            }else{
                this.$router.push({path:"/NavDetail/ReceiptDetail",query:{rcptNo:item.busiNo}})                
            }
        },
        AllocateResult(index,item){
            if(!item.empName){
                this.$message({
                    type: 'info',
                    message: '请选择要分配的员工',
                    duration:"1500",
                });
                return
            }
            if(this.ToggleShow === 0){
                this.$post(this.$host+'/api/performance/servallot/allotquery',{billNo:item.busiNo,perStatus:item.perStatus}).then(d=>{
                    if(d.success){
                        if(d.data.pass){
                            this.perAmount = item.perAmount                              
                            this.updTimestamp = d.data.updTimestamp
                            this.iId = d.data.iId
                            let pList = d.data.pList
                            pList.map(e=>{
                                let residue = 0
                                e.list.map(el=>{
                                    residue+=parseFloat(el.perMoney)
                                    el.perMoney>0?el.Percent=parseInt(el.perMoney/e.perAmo*10000)/100:el.perMoney=el.Percent = '';
                                })
                                e.residue = residue
                            })
                            this.list = pList
                            this.BtnShow = this.ResultIsShow = true 
                        }
                        if(!d.data.pass){
                            this.$alert('该业绩记录属于点单消费类型，必须先填写护理日志！', '提示', {
                                confirmButtonText: '去填写',
                                type: 'warning'
                            }).then(() => {
                                this.$router.push({path:'/NavDetail/nurseLog/addNurse',
                                    query:{
                                        id: "_add",	
                                        billNo: item.busiNo,	//消费单号
                                        cName: item.cName,		//消费客户名称
                                        cCode: item.cCode,		//消费客户 code
                                        date: item.ocurDate,		//消费单 护理时间
                                    }
                                })
                            })
                        }
                    }
                })
            }
            if(this.ToggleShow === 1){
                this.$post(this.$host+'/api/performance/receiptallot/allotquery',{billNo:item.busiNo}).then(d=>{
                    if(d.success){
                        this.perAmount = item.perAmount                              
                        this.updTimestamp = d.data.updTimestamp
                        this.iId = d.data.iId
                        let list = d.data.list
                        list.map(e=>{
                            e.perMoney>0?e.Percent = parseInt(e.perMoney/item.perAmount*10000)/100:e.perMoney=e.Percent = '';
                        })
                        this.list = list                   
                        this.BtnShow = this.ResultIsShow = true 
                    }
                })
            }
        },
        SeeResult(index,item){
            if(this.ToggleShow === 0){
                this.$post(this.$host+'/api/performance/servallot/allotquery',{billNo:item.busiNo,perStatus:item.perStatus}).then(d=>{
                    if(d.success){
                        this.perAmount = item.perAmount                              
                        this.updTimestamp = d.data.updTimestamp
                        this.iId = d.data.iId
                        let pList = d.data.pList
                        pList.map(e=>{
                            let residue = 0
                            e.list.map(el=>{
                                residue+=parseFloat(el.perMoney)
                                el.perMoney>0?el.Percent=parseInt(el.perMoney/e.perAmo*10000)/100:el.perMoney=el.Percent = '';
                            })
                            e.residue = residue
                        })
                        this.list = pList
                        this.ResultIsShow = true 
                    }
                })
            }
            if(this.ToggleShow === 1){
                this.$post(this.$host+'/api/performance/receiptallot/allotquery',{billNo:item.busiNo}).then(d=>{
                    if(d.success){
                            this.perAmount = item.perAmount                              
                            this.updTimestamp = d.data.updTimestamp
                            this.iId = d.data.iId
                            let list = d.data.list
                            list.map(e=>{
                                e.perMoney>0?e.Percent = parseInt(e.perMoney/item.perAmount*10000)/100:e.perMoney=e.Percent = '';
                            })
                            this.list = list
                            this.ResultIsShow = true 
                    }
                })
            }
        },
        cancel(){
            this.BtnShow = this.ResultIsShow = false
        },
        Bisect(index,item){
            if(item.perAmo!=0){
                let len=item.list.length
                let residue=0
                let perMoney = parseInt(item.perAmo*100/len)/100
                let Percent = parseInt(perMoney*10000/item.perAmo)/100
                item.list.map(e=>{e.perMoney=perMoney;e.Percent=Percent})  
                if(item.perAmo%perMoney){
                    item.list[len-1].perMoney=(item.perAmo*100-perMoney*100*(len-1))/100
                    item.list[len-1].Percent=parseInt(10000-item.list[len-1].Percent*100*(len-1))/100
                }
                item.list.map(e=>{residue+=e.perMoney}) 
                item.residue = residue
            }          
        }, 
        getlist(Arr){
            let arr = []
            if(this.ToggleShow === 0){
                Arr.map(e=>{
                    e.list.map(el=>{
                        if(!el.perMoney){
                            el.perMoney = '0'
                        }
                    let EL = {
                        dId:el.dId,
                        perMoney:el.perMoney
                    }
                    arr.push(EL)
                    })
                })
            }else if(this.ToggleShow === 1){
                Arr.map(e=>{
                    if(!e.perMoney){
                        e.perMoney = '0'
                    }
                    let el = {
                        dId:e.dId,
                        perMoney:e.perMoney
                    }
                    arr.push(el)
                })
            }
            return arr
        },
        save(){
            if(!this.BtnShow){
                this.cancel()
                return
            }
            let _data = {
                updTimestamp:this.updTimestamp,
                iId:this.iId,
            }
            if(this.ToggleShow === 0){
                for(let i=0,len=this.list.length;i<len;i++){
                    let item=this.list[i]
                    if(item.perAmo<item.residue){
                        this.$message({
                            type: 'warning',
                            message: '已超出可分配总额！',
                            duration:"1000",
                        });
                        return
                    }
                }
                _data.list=this.getlist(this.list)
                this.$post(this.$host+'/api/performance/servallot/update',_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '分配成功！',
                            duration:"1000",
                        });
                        this.gotoFPage(this.FpageNumber)
                        this.cancel()
                    }
                })
            }
            if(this.ToggleShow === 1){
                if(this.residueAmount==0){
                    this.$message({
                        type: 'warning',
                        message: '请填写分配金额！',
                        duration:"1000",
                    });
                    return
                }
                if(parseFloat(this.residueAmount) > parseFloat(this.perAmount)){
                    this.$message({
                        type: 'warning',
                        message: '已超出可分配总额！',
                        duration:"1000",
                    });
                    return
                }
                _data.list=this.getlist(this.list)
                this.$post(this.$host+'/api/performance/receiptallot/update',_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '分配成功！',
                            duration:"1000",
                        });
                        this.gotoSPage(this.SpageNumber)
                        this.cancel()
                    }
                })
            }
        },
        ChoiceStaff(index,item){
            if(!item.canallot||item.perStatus==2)return
            this.$post(this.$host+'/api/performance/receiptallot/allotquery',{billNo:item.busiNo}).then(d=>{
                if(d.success){
                    this.billNo = item.busiNo
                    // this.AddempIsShow = true    
                    this.employees = d.data.list
                    this.modelemployee = true
                    this.Employees=this.deepCopy(this.employees);
                }
            })
        },
        deepCopy(arr){
            let newArr=[];
            for(let i=0;i<arr.length;i++){
                newArr.push(this.copy(arr[i]));
            }
            return newArr;
        },
        copy(obj){
            let newobj={};
            for(let attr in obj){
                newobj[attr] = obj[attr];
            }
            return newobj;
        },
        ClientDetail(index,item){
            this.$router.push({path:'/NavDetail/customerDetails',query:{id:item.cId,code:item.cCode}})
        },
        canclefun(){
            this.modelemployee=false;
        },
        submit(items){
            if(items.length==0){
                this.$message({
                    type: 'warning',
                    message: '请选择分配员工！',
                    duration:"1000",
                });
                return
            }
            let empCodes = []
            items.map(e=>{empCodes.push(e.workNo)})
            this.$post(this.$host+'/api/performance/receiptallot/superpositionupdateemp',{billNo:this.billNo,empCodes:empCodes}).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '操作成功！',
                        duration:"1000",
                    });
                    this.modelemployee=false;
                    this.employees=this.deepCopy(items);
                    this.Scontent.map(e=>{if(e.busiNo == this.billNo){e.empName = this.employees.length>0?this.employees[0].empName:null}})                    
                }
            })
        },
    },
}
</script>

<style scoped>
.Cursor{
  cursor: pointer;
  font-size: 1rem;
}
.icongou::before{
    content: "\e650";
    position: absolute;
    font-size: 36px;
    right: -10px;
    bottom: -9px;
}
.cross::before {
  content: "\e61a";
  color: #666666;
}
/* .cross:hover::before{
  color: #1dade2;
} */
.Add::before{
  content: "\e752";
  color: #1dade2;
  margin-right: .2rem;
}
.ResultAllot{
    height: 100%;
    background-color: #fff;
    /* padding: 1rem 1rem; */
}
.ResultBox{
    display: inline-block;
    margin:0 1rem 1rem 0;
}
.ResultBox button:first-child{
    margin-right: 1rem;
}
.FontStyle{
    font-size: 1rem; 
}
.ResultSelect{
    float: left;
    border: 1px solid #efefef;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.ResultSelect.ToggleShow{
    border: 1px solid #2cbcc8;
    color: #2cbcc8;
}


.Allemployee{
    width: 33.333333rem;
    height: 20rem;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 4px;
    background: #fff;
    z-index: 1000;
}
.ResultAllotTable{
    margin-top: 1rem;
}
.ResultAllotTable .Btncor {
    color: #1dade2;
    cursor: pointer;
}
.ResultInfo{
    width: 50rem;
    height: 33.333333rem;
    /* max-height: 33.333333rem; */
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 4px;
    background: #fff;
    z-index: 1000;
}

.ResultHeader{
    font-size:1.166667rem; 
    margin:0 1.5rem 1.5rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
    color: #5d717c;
}
.ResultHeader .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.AllemployeeBox{
    padding: 0 2rem;
    height: 9rem;
    overflow: auto;
}
.Element{
    display: inline-block;
    padding: 0 .5rem;
    height: 2rem;
    line-height: 2rem;
    border:1px solid #efefef;
    border-radius: 2px;
    margin:0 .5rem .5rem 0;
    background: #fafafa;
    cursor: pointer;
}
.Element:hover{
    border-color: #cae5ff;
    color: #1dade2;
}
.Element:hover .cross::before{
    color: #1dade2;
}
.ElementAdd{
    display: inline-block;
    height: 2rem;
    line-height: 2rem;
    color: #1dade2;
    margin:0 .5rem .5rem 0;
}
.ResultContent{
    margin-bottom:1rem ;
}
.ResultContentBtn{
     margin-top:1rem ;
     padding: 0 15%;
}
.ResultText{
    display: inline-block;
    width: 40%;
    text-align: right;
    font-size: 1rem;
    color: #666666;
}
.Resultmoney{
    display: inline-block;
    font-size: 1.166667rem;
    color: red;
}
.ResultContentBox{
    width: 88%;
    height: 21rem;
    overflow-y:auto;
    margin:0 auto;
    padding: 1rem 0;
}
.ContentBox{
    display: inline-block;
    width: 32%;
    text-align: center;
    line-height: 2rem;
    font-size: 1rem;
    color: #666666;;
}
.elementBox{
    margin-bottom: .5rem;
}
.elementBox:last-child{
    margin-bottom: none;
}
.ResultBtn{
    text-align: center;
    margin-top: 1.5rem;
}
.ResultBtn button:first-child{
    margin-right: 2rem;
}
</style>
