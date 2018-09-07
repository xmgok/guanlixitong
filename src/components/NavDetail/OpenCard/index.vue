<template>
  <div class="OpenCard">
        <div class="CardHeaderBox" v-if="corpShow">
            <span>部门：</span>
            <getCorpStore @getCorpStore="getCorpStore" :values="cCodesArr"/>
        </div>
        <div class="CardHeaderBox" v-if="sCodeShow">
            <span>门店：</span>
            <Select :SelecttemData="storeDatas" :values="sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonInput" widths="13.333333rem" />
        </div>
        <div class="CardHeaderBox">
            <span>会员：</span>
            <Input placeholder="会员编号/姓名/手机号码" arguName="cCode" :value="cCode" @sonInput="sonInput" widths="13.333333rem"/>
        </div>
        <div class="CardHeaderBox">
            <span>创建日期：</span>
            <DateRange :values="timesArr" :arguName="['dateStart','dateEnd']" @getDateRange="getDateRange"/>
        </div>
        <div class="CardHeaderBox">
            <span>开卡单号：</span>
            <Input placeholder="开卡单号" arguName="orderNo" :value="orderNo" @sonInput="sonInput" widths="13.333333rem"/>                
        </div>
        <div class="CardHeaderBox">
            <span>状态：</span>
            <Select :SelecttemData="SelecttemData" arguName="ordStatus" :values="ordStatus" :SelecttemDetail="['key','value']" @sonSelect="sonInput" widths="13.333333rem"/>
        </div>
        <div class="CardHeaderBox">
            <Button Name="查询" @click.native="Topage(1)" :Search="true"/>
            <Button Name="重置" @click.native="Reset" :Reset="true"/>
        </div>
        <div class="OpenCardBtn" v-if="isShop">
            <Button Name="新增" @click.native="Added" :iconadd="true"/>
        </div>
        <template>
            <el-table :data="content" style="width:100%" border>
                <el-table-column fixed prop="storeName" label="门店" width="200"></el-table-column>
                <el-table-column fixed label="客户" width="150">
                    <template slot-scope="scope">
                        <span> 
                            <span class="active" @click.stop="ClientDetail(scope.$index,scope.row)">{{scope.row.customerName}}</span>
                            <i v-if="scope.row.workNo" :title="'内部员工，工号：'+scope.row.workNo" class="icon sign"></i>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="250"></el-table-column>
                <el-table-column label="开卡单号" width="250">
                    <template slot-scope="scope">
                        <span class="active" @click.stop="SeeDetail(scope.$index,scope.row)"> {{ scope.row.orderNo }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="订单总额" width="150">
                    <template slot-scope="scope">
                        <span> {{ "￥"+scope.row.totalAmount }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="150">
                    <template slot-scope="scope">
                        <span> {{ (scope.row.ordStatus==1?'已开卡':'已退卡') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="100" fixed="right" v-if="isShop">
                    <template slot-scope="scope">
                        <Button Name="退卡" v-if="scope.row.ordStatus==1" class="Btn" @click.native.stop="Revoke(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="Topage" :total="total" class="pagingwidth" :currentPage="pageNumber"/>
  </div>
</template>

<script>
import Input from "../../common/Input"
import Button from "../../common/Button"
import Select from "../../common/Select"
import DateRange from "../../common/DateRange"
import Paging from "../../common/Paging"
import {mapState,mapMutations} from "vuex"
export default {
    name:"OpenCard",
    components:{Input,Button,Select,getCorpStore:resolve => {require(['../../common/getCorpStore'],resolve)},DateRange,Paging},
    data(){
        return{
            isShop:true,//是否有所属门店
            corpShow:false,//部门权限
            sCodeShow:false,//门店权限
            cCodesArr: this.$getCookie('belongShop')=='null'?[this.$getCookie('dept')]:[],//部门数组
            cCodes: "",//部门code
            storeDatas:[],
            sCode: this.$getCookie('belongShop'),//门店code
            // StoreShow:false,
            orderNo:"",//订单号
            timesArr:[],//日期
            cCode:"",//客户编号，名称，手机
            pageSize:20,//页数
            total:0,
            pageNumber:'',
            content:[],
            SelecttemData:[
                {key:0,value:'已退卡'},
                {key:1,value:'已开卡'}
            ],
            ordStatus:'',
            // modelemployee:false,
            // SelectedData:[],
        }
    },
    mounted(){
        if(!this.$getCookie("belongShop")){
            this.isShop=false;
        }    
        this.getStore() 
        let auths = JSON.parse(this.$getSession("auths"));
        auths.map(el => {
            if (el.fParentCode == "F061") {//开卡管理的权限
                if (el.fUrl == "corp") {
                    this.corpShow = true;
                }
                if (el.fUrl == "sCode") {
                    this.sCodeShow = true;
                }
            }
        })
       
    },
    beforeRouteLeave(to, from, next) {
        if(to.path=="/NavDetail/OpenCardAdd"){
            this.updateAlives({name:"OpenCardAdd"})
        }
        next()
    },
    activated(){
        //查询开卡列表
        if(this.$route.query.cCode){
            this.cCode = this.$route.query.cCode
            this.sCode = '';
            this.cCodes = '';
            this.Topage(this.pageNumber);
            this.setDatas({name:"newOpenCard",value:true})
        }else{
            // if(this.newOpenCard){
                this.cCode = "";
                this.sCode =  this.$getCookie('belongShop');
                this.cCodes =  "";
                this.Topage(this.pageNumber);
                this.setDatas({name:"newOpenCard",value:false})
            // }           
        }
       
    },
    computed:{
        ...mapState(['storesvuex',"newOpenCard"])
    },
    methods:{
        ...mapMutations(["updateAlives",'setDatas']),
        sonInput(value,arguName){
            this[arguName]=value
            console.log(this[arguName])
        },
        getCorpStore(value) {
            if (this.cCodes != value[value.length-1]) {
                this.cCodes = value[value.length-1];
                this.sCode = "";
                this.getStore();
            }
        },
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.cCodes || this.$getCookie("dept") || "",
                queryType:0
            }
            if(!this.cCodes){//默认门店（当前部门下的门店）
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
        getDateRange(value,arguName){
            this.timesArr = value
        },
        Topage(index){
            let _data = {
                corpCode:this.cCodes||this.$getCookie('dept'),//部门cCodes
                sCode:this.sCode,
                orderNo:this.orderNo,
                dateStart:this.timesArr[0],
                dateEnd:this.timesArr[1],
                cCode:this.cCode,
                ordStatus:this.ordStatus,
                pageSize:this.pageSize,
                pageNumber:parseInt(index)
            }
            this.$post(this.$host+"/api/order/ord/findOrder",_data).then(d=>{
                if(d.success){
                    let content = d.data.content
                    content.map(e=>{e.createTime != null ? e.createTime = this.$dateFormat("yy-MM-dd hh:mm:ss",e.createTime) : "无"})
                    this.content = content
                    this.total = d.data.total
                    this.pageNumber = d.data.pageNumber
                }
            })
        },
        Reset(){
            this.cCodesArr = this.$getCookie('belongShop')=='null'?[this.$getCookie('dept')]:[]
            this.cCodes = "",//部门code
            this.sCode = this.$getCookie('belongShop'),//门店code
            this.orderNo = "",//订单号
            this.timesArr = []//日期
            this.cCode = ""//客户编号，名称，手机   
            this.ordStatus=""//状态
            this.getStore()
        },
        Added(){
            this.$router.push({ path:"/NavDetail/OpenCardAdd"}) 
        },
        ClientDetail(index,item){
            this.$router.push({path:'/NavDetail/customerDetails',query:{id:item.custId,code:item.customerCode}})
        },
        SeeDetail(index,item){
            this.$router.push({path:"/NavDetail/OpenCardInfo",query:{orderNo:item.orderNo}})
        },
        Revoke(index,item){
            this.$router.push({path:"/NavDetail/RevokeCard",query:{orderNo:item.orderNo}})
        },
    }
}
</script>

<style>
.OpenCard .sign::before {
  content: "\E708";
  color: #eb8617;    
}
.OpenCard .CardHeaderBox{
    margin:0 2rem 1rem 0;
    font-family: SimHei;
    font-size: 1rem;
    display: inline-block;
}
.OpenCard .CardHeaderBox button:first-child{
    margin-right: 1rem;
}
.OpenCard .OpenCardBtn{
    margin-bottom: 1rem;
}
.OpenCard .active{
    color: #4DB0E8;
    cursor: pointer;
}

</style>
