<template>
    <div class="ReceiptTotal">
        <div class="search-wraps">
            <ul>
                <!-- <li>
                    <span>所在地区：</span>
                        <getArea @getAreaCode="getAreaCode" :values="sDistrictCodearr"/>
                </li>
                <li>
                    <span>部门：</span>
                    <getCorpStore @getCorpStore="getCorpStore" :values="corpCodeArr" :widths="'160px'"/>
                </li>
                <li>
                    <span>门店：</span>
                    <Select :SelecttemData="storeDatas" :values="searchFlow.sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="upInput" :widths="'160px'"/>
                </li> -->
                <li>
                    <span>会员等级：</span>
                    <Select :SelecttemData="lvlCodeDatas" :values="searchFlow.lvlCode" arguName="lvlCode" :SelecttemDetail="['lvlId','lvlName']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>是否内部员工：</span>
                    <Select :SelecttemData="isEmpDatas" :values="searchFlow.isEmp" arguName="isEmp" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>产品分类：</span>
                    <Select :SelecttemData="cateDatas" :values="searchFlow.prodCate" arguName="prodCate" :SelecttemDetail="['cateId','cateName']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>产品名称：</span>
                    <Input placeholder="产品名称" :value="searchFlow.prodName" arguName="prodName" @sonInput="upInput" />
                </li>
                <li>
                    <span>消费方式：</span>
                    <Select :SelecttemData="isOrderDatas" :values="searchFlow.isOrder" arguName="isOrder" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>消费日期：</span>
                    <DateRange @getDateRange="upDateRange" :arguName="times" :values="timesArr"/>
                </li>
                <li>
                    <span>确认日期：</span>
                    <DateRange @getDateRange="upDateRange" :arguName="signtimes" :values="signtimesArr"/>
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="getDatas(1)" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="deptSelect">
            <ul class="clearfix funHeader">
                <li>
                    <Button :Upload="true" Name="导出已选择" @click.native="downSelected"></Button>
                    <Button :Upload="true" Name="导出全部" @click.native="demandAll(1,total)"></Button>
                </li>
            </ul>
        </div>
        <el-table :data="datas" border style="width:100%"  @selection-change="selectDatasFun" ref="multipleTable"  :row-key="getRowKeys">
            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
            <el-table-column  prop="custName" label="客户" width="200" >
                <template slot-scope="scope">
                    {{scope.row.custName+"("+scope.row.custCode+")"}}
                    <i class="icon iconF" v-show="scope.row.workNo!=0&&scope.row.workNo!=null" :title="'内部员工，工号：'+scope.row.workNo"></i>
                </template>
            </el-table-column>
            <el-table-column  prop="lvlName" label="客户等级" width="120"  ></el-table-column>
            <el-table-column  prop="cateName" label="产品分类" width="200"  ></el-table-column>
            <el-table-column  prop="prodName" label="消费项目" width="200" ></el-table-column>
            <el-table-column  prop="totalMoney" label="消费金额(￥)" width="150"></el-table-column>
            <el-table-column  prop="cashCouMoney" label="优惠券抵扣金额(￥)" width="150"></el-table-column>
            <el-table-column  prop="Integral" label="积分抵扣金额(￥)" width="150"></el-table-column>
            <el-table-column  prop="AccMoney" label="实际结算金额(￥)" width="150"></el-table-column>
            <el-table-column  prop="orderNo" label="消费方式" width="120"></el-table-column>
            <el-table-column  prop="consumeTime" label="消费日期" width="120"></el-table-column>
            <el-table-column  prop="signTime" label="确认日期" width="120"></el-table-column>
            <el-table-column  prop="billNo" label="消费单号" width="200"></el-table-column>
            <el-table-column  prop="billNo" label="创建人" width="120"></el-table-column>
            <el-table-column  min-width='1'></el-table-column>
        </el-table>
        <Paging :handleCurrentChange="getDatas" :total="total" class="pagingwidth" :pageSize="searchFlow.pageSize"/>
    </div>
</template>
<script>
    import getArea from "@/components/common/getArea";
    import getCorpStore from "@/components/common/getCorpStore";
    import Select from "@/components/common/Select";
    import DateRange from "@/components/common/DateRangeNr";
    import Button from "@/components/common/Button";
    import Input from "@/components/common/Input";
    import Paging from "@/components/common/Paging";
    import {mapMutations,mapState} from "vuex"
    export default {
        components: {
            Select,getArea:resolve => {require(['../../common/getArea'], resolve)},getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)},
            DateRange,Button,Paging,Input
        },
        data () {
            return {
                cateDatas:[],
                lvlCodeDatas:[],
                isEmpDatas:[
                    {key:1,value:"是"},
                    {key:0,value:"否"},
                ],
                isOrderDatas:[
                    {key:1,value:"套卡消耗"},
                    {key:0,value:"单点消费"},
                ],
                total:1,
                AreaShow:true,
                deptShow:true,
                storeShow:true,
                datas:[],
                times:['startDate','endDate'],
                signtimes:['signTimeStart','signTimeEnd'],
                timesArr:[],
                signtimesArr:[],
                sDistrictCodearr:[],
                corpCodeArr:[],
                storeDatas:[],
                dataTotal:{},
                searchFlow:{
                    sCode:"",
                    areaCode:"",
                    deptCode:"",
                    pageNumber:1,
                    pageSize:50,
                    startDate:"",
                    endDate:"",
                    signTimeStart:"",
                    signTimeEnd:"",
                    lvlCode:"",
                    isEmp:"",
                    prodCate:"",
                    prodName:"",
                    isOrder:"",
                },
                selectDatas:[],
            }
        },
        computed: {
            ...mapState(["storesvuex"]),
        },
        methods: {
             getRowKeys(row){
                return row.Index;
            },
            ...mapMutations(["setDatas"]),
            //选择的数据
            selectDatasFun(val) {
                this.selectDatas = val;
            },
            toggleSelection(rows) {
                this.$refs.multipleTable.clearSelection();
                this.selectDatas="";
            },
            downSelected(){
                if (this.selectDatas.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '请选择期望导出的消费明细!',
                        duration: "1000",
                        onClose: () => {
                        }
                    });
                } else {
                    let arr1 = ["客户", "客户等级","产品分类","消费项目","消费金额(￥)", "优惠券抵扣金额(￥)", "积分抵扣金额(￥)", "实际结算金额(￥)", "消费方式","消费日期","确认日期","消费单号","创建人"];
                    let Tbody1=["custNames","lvlName","cateName","prodName","totalMoney","cashCouMoney","Integral","AccMoney","orderNo","consumeTime","signTime","billNo","billNo"];
                   
                    this.$exportExcel(arr1, Tbody1, this.selectDatas, '收款明细');
                    this.toggleSelection();
                }
            },
            // 导出全部
            demandAll(){
                let data=this.searchFlow;
                data.pageSize=this.total;
                this.$post(this.$cspr+"/api/report/consumeSummary/getConsumeSummaryDetail",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        content.map(el=>{
                            el.totalMoney=parseFloat(el.totalMoney).toFixed(2);
                            el.cashCouMoney=parseFloat(-el.cashCouMoney).toFixed(2);
                            el.Integral=parseFloat(-el.Integral).toFixed(2);
                            el.AccMoney=parseFloat(el.AccMoney).toFixed(2);
                            el.orderNo===null?el.orderNo="单点消费":el.orderNo="套卡消耗"
                            el.consumeTime=this.$dateFormat("yy-MM-dd",el.consumeTime);
                            el.signTime=this.$dateFormat("yy-MM-dd",el.signTime);
                            el.workNo?(el.custNames=el.custName+"("+el.custCode+","+el.workNo+")"):(el.custNames=el.custName+"("+el.custCode+")")
                        })
                        let arr1 = ["客户", "客户等级","产品分类","消费项目","消费金额(￥)", "优惠券抵扣金额(￥)", "积分抵扣金额(￥)", "实际结算金额(￥)", "消费方式","消费日期","确认日期","消费单号","创建人"];
                        let Tbody1=["custNames","lvlName","cateName","prodName","totalMoney","cashCouMoney","Integral","AccMoney","orderNo","consumeTime","signTime","billNo","billNo"];
                        this.$exportExcel(arr1, Tbody1, content, '收款明细');
                    }
                })
            },
            // 重置
            resetAll(){
                this.searchFlow.sCode=this.$getCookie("belongShop");
                this.searchFlow.areaCode="";
                this.searchFlow.deptCode="";
                this.searchFlow.startDate="";
                this.searchFlow.endDate="";
                this.searchFlow.lvlCode="";
                this.searchFlow.isEmp="";
                this.searchFlow.prodCate="";
                this.searchFlow.prodName="";
                this.searchFlow.isOrder="";
                this.searchFlow.signTimeStart="";
                this.searchFlow.signTimeEnd="";
                this.signtimesArr=[];
                this.sDistrictCodearr=[];
                this.corpCodeArr=[];
                this.timesArr=[];
                this.getStore();
            },
             // 搜索查询的条件
            upInput(value,arguName){
                this.searchFlow[arguName]=value;
            },
            getAreaCode(value){
                this.searchFlow.areaCode=value;
            },
            upDateRange(value,arguName){
                // this.timesArr=value;
                console.log(value)
                if(value){
                    this.searchFlow[arguName[0]]=value[0];
                    this.searchFlow[arguName[1]]=value[1];
                }else{
                    this.searchFlow[arguName[0]]="";
                    this.searchFlow[arguName[1]]="";
                }
                
            },
            getCorpStore(value){
                if(this.searchFlow.deptCode!=value[value.length-1]){
                    this.searchFlow.deptCode=value[value.length-1];
                    this.searchFlow.sCode="";
                    this.getStore();
                }
            },
            getStore(){
                let data={
                    pageNumber:1,
                    pageSize:1000,
                    corpCode:this.searchFlow.deptCode||this.$getCookie("dept")||"",
                    queryType:0
                }
                if(!this.searchFlow.deptCode){//默认门店（当前部门下的门店）
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
            getDatas(index){
                if(index){
                    this.searchFlow.pageNumber=parseInt(index);
                }
                this.searchFlow.pageSize=50;
                let data=this.searchFlow;
                this.$post(this.$cspr+"/api/report/consumeSummary/getConsumeSummaryDetail",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        content.map((el,i)=>{
                            el.totalMoney=parseFloat(el.totalMoney).toFixed(2);
                            el.cashCouMoney=parseFloat(-el.cashCouMoney).toFixed(2);
                            el.Integral=parseFloat(-el.Integral).toFixed(2);
                            el.AccMoney=parseFloat(el.AccMoney).toFixed(2);
                            el.orderNo===null?el.orderNo="单点消费":el.orderNo="套卡消耗"
                            el.Index=""+index+i;
                            el.consumeTime=this.$dateFormat("yy-MM-dd",el.consumeTime);
                            el.signTime=this.$dateFormat("yy-MM-dd",el.signTime);
                            el.workNo!==null?(el.custNames=el.custName+"("+el.custCode+","+el.workNo+")"):(el.custNames=el.custName+"("+el.custCode+")")
                        })
                        this.datas=content;
                        this.total=d.data.dataList.total;
                    }
                })
            },
            // 获取会员等级
            getCustLevel(){
                this.$post(this.$cspr+"/api/report/busiSummary/getCustLevel",{}).then(d=>{
                    if(d.success){
                        let content=d.data;
                        this.lvlCodeDatas=content;
                    }
                })
            },
            getcates(){
                // 产品类别
                this.$post(this.$cspr+"/api/report/busiSummary/getProdClass",{}).then(d=>{
                    if(d.success){
                        this.cateDatas=d.data;
                    }
                })
            },
        },
        mounted () {
            this.searchFlow.sCode=this.$route.query.sCode||"";
            this.getDatas(1);
            this.getStore();
            this.getCustLevel();
            this.getcates();
        }
    }
</script>
<style scoped>
    .iconF::before{
        content: "\E708";
        color: #eb8617;
        cursor: pointer;
    }
    .dates{
        display: inline-block;
    }
    .dates >span{
        height: 25px;
        line-height: 25px;
        width: 34px;
        text-align: center;
        border: 1px solid #dcdfe6;
        display: inline-block;
        cursor: pointer;
        margin-left: 4px;
    }
    .dates >span.active{
        border: 1px solid #2cbcc8;
        background: #2cbcc8;
        color: #ffffff;
    }
    .deptSelect{
        padding-bottom: 12px;
    }
    .funHeader li{
        float: left;
        border: 1px solid #dcdfe6;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        position: relative;
        cursor: pointer;
    }
    .funHeader li:last-child{
        float: right;
        width: inherit;
        border: none;
    }
    .funHeader li.active{
        border: 1px solid #2cbcc8;
        color: #2cbcc8;
    }
    .icongou::before {
        content: "\E650";
        position: absolute;
        font-size: 36px;
        right: -10px;
        bottom: -9px;
    }
</style>