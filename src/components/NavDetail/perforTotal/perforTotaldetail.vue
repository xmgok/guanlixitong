<template>
    <div class="ReceiptTotal">
        <div class="search-wraps">
            <ul>
                <li>
                    <span>业绩日期：</span>
                    <DateRange @getDateRange="upDateRange" :arguName="times" :values="timesArr"/>
                </li>
            </ul>
        </div>
        <!-- <div class="deptSelect">
            <ul class="clearfix funHeader">
                <li>
                    <Button :Upload="true" Name="导出已选择" @click.native="downSelected"></Button>
                    <Button :Upload="true" Name="导出全部" @click.native="demandAll(1,total)"></Button>
                </li>
            </ul>
        </div> -->
        <el-table :data="datas" border style="width:100%" @selection-change="selectDatasFun" ref="multipleTable">
            <el-table-column  prop="busiNo" label="业务单号" width="150" >
                <template slot-scope="scope">
                    {{scope.row.busiNo}}
                </template>
            </el-table-column>
            <el-table-column  prop="storeName" label="业务发生门店" width="200"  ></el-table-column>
            <el-table-column  prop="busiType" label="业务类型" width="120"  ></el-table-column>
            <el-table-column  prop="perDate" label="分配日期" width="120" ></el-table-column>
            <el-table-column  prop="custName" label="客户" width="150"></el-table-column>
            <el-table-column  prop="factAmount" label="业务发生额" width="150"></el-table-column>
            <el-table-column  prop="perAmount" label="可分配金额" width="150"></el-table-column>
            <el-table-column  prop="canAmount" label="本人分得金额" width="120"></el-table-column>
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
    import Paging from "@/components/common/Paging";
    import {mapMutations,mapState} from "vuex"
    export default {
        components: {
            Select,getArea:resolve => {require(['../../common/getArea'], resolve)},getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)},
            DateRange,Button,Paging
        },
        data () {
            return {
                payTypeDatas:[],
                lvlCodeDatas:[],
                isEmpDatas:[
                    {key:1,value:"是"},
                    {key:0,value:"否"},
                ],
                Tbody:["areaName","deptName","storeName","payCount","refundCount","payCount","consumeCount","busiCount"],
                total:1,
                AreaShow:true,
                deptShow:true,
                storeShow:true,
                datas:[],
                times:['startDate','endDate'],
                timesArr:[],
                sDistrictCodearr:[],
                corpCodeArr:[],
                storeDatas:[],
                dataTotal:{},
                searchFlow:{
                    pageNumber:1,
                    pageSize:50,
                    startDate:"",
                    endDate:"",
                    emp:"",
                },
                selectDatas:[],
            }
        },
        computed: {
            ...mapState(["storesvuex"]),
        },
        methods: {
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
                        message: '请选择期望导出的产品!',
                        duration: "1000",
                        onClose: () => {
                        }
                    });
                } else {
                    let arr1 = ["客户", "客户等级", "支付金额(￥)", "支付方式", "支付时间", "支付单号", "收款单号","创建人","状态"];
                    let Tbody1=["custName","lvlName","payAmount","payType","payTime","payFlow","rectNo","payEmp","billStatus"];
                    this.$exportExcel(arr1, Tbody1, this.selectDatas, '收款明细');
                    this.toggleSelection();
                }
            },
            // 导出全部
            demandAll(){
                let data=this.searchFlow;
                data.pageSize=this.total;
                this.$post(this.$cspr+"/api/report/perSummary/getPerSummaryDetail",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        content.map(el=>{
                            el.payAmount=(parseFloat(el.payAmount)).toFixed(2);
                            el.custName=el.custName+"("+el.custCode+")";
                        })
                        let dataTotal=d.data.dataTotal;
                        let arr1 = ["客户", "客户等级", "支付金额(￥)", "支付方式", "支付时间", "支付单号", "收款单号","创建人","状态"];
                        let Tbody1=["custName","lvlName","payAmount","payType","payTime","payFlow","rectNo","payEmp","billStatus"];
                        this.$exportExcel(arr1, Tbody1, content, '收款明细');
                    }
                })
            },
            getSummaries(){
                return ["","合计",parseFloat(this.dataTotal.amountTotal).toFixed(2),]
            },
            upDateRange(value,arguName){
                this.timesArr=value;
                console.log(value)
                if(value){
                    this.searchFlow[arguName[0]]=value[0];
                    this.searchFlow[arguName[1]]=value[1];
                }else{
                    this.searchFlow[arguName[0]]="";
                    this.searchFlow[arguName[1]]="";
                }
                this.getDatas(1);
            },
            getDatas(index){
                console.log(index)
                if(index){
                    this.searchFlow.pageNumber=parseInt(index);
                }
                this.searchFlow.pageSize=50;
                this.searchFlow.emp=this.$route.query.code||"";
                let data=this.searchFlow;
                this.$post(this.$cspr+"/api/report/perSummary/getPerSummaryDetail",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        content.map(el=>{
                            el.busiType==0?el.busiType="预存收款":el.busiType=="1"?el.busiType="点单消费":""
                            el.perDate=this.$dateFormat("yy-MM-dd",el.perDate)
                            el.factAmount=(parseFloat(el.factAmount)).toFixed(2);
                            el.perAmount=(parseFloat(el.perAmount)).toFixed(2);
                            el.canAmount=(parseFloat(el.canAmount)).toFixed(2);
                            el.custName=el.custName+"("+el.custCode+")";
                        })
                        this.datas=content;
                        this.total=d.data.dataList.total;
                    }
                })
            },
            
        },
        mounted () {
            this.getDatas();
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