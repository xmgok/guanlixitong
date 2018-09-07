<template>
    <div class="ReceiptTotal">
        <div class="search-wraps">
            <ul>
                <li>
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
                </li>
                <li>
                    <span>日期：</span>
                    <!-- <div class="dates">
                        <span v-for="item in dateslis" :class="{active:item.active}" @click="selectdate(item)">{{item.value}}</span>
                    </div> -->
                    <DateRange @getDateRange="upDateRange" :arguName="times" :values="timesArr"/>
                </li>
                <li>
                    <span>经营性质：</span>
                    <Select :SelecttemData="sOwnerDatas" :values="searchFlow.sOwner" arguName="sOwner" :SelecttemDetail="['ownerId','ownerName']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="getDatas(1)" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="deptSelect">
            <ul class="clearfix funHeader">
                <li v-for="item in lis" @click="selectclass(item)" :class="{active:item.active}">{{item.value}}
                    <i class="icon icongou" v-show="item.active"></i>
                </li>
                <li>
                    <Button :Upload="true" Name="导出已选择" @click.native="downSelected"></Button>
                    <Button :Upload="true" Name="导出全部" @click.native="demandAll(1,total)"></Button>
                </li>
            </ul>

        </div>
        <el-table :data="datas" border style="width:100%" show-summary :summary-method="getSummaries" @selection-change="selectDatasFun" ref="multipleTable" :row-key="getRowKeys">
            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
            <el-table-column  prop="areaName" label="地区" width="120" v-if="AreaShow" :key="Math.random()"></el-table-column>
            <el-table-column  prop="deptName" label="部门" width="200" v-if="deptShow" :key="Math.random()"></el-table-column>
            <el-table-column  prop="storeName" label="门店" width="200" v-if="storeShow" :key="Math.random()"></el-table-column>
            <el-table-column  prop="sumVal" label="消费总金额(￥)" width="200" v-if="storeShow" :key="Math.random()"></el-table-column>
            <el-table-column v-for="(item,index) in cateDatas" :key="index"  :label="item.cateName"  width="200" >
                <template slot-scope="scope">
                    {{getids(scope.row.prodCateList,item.cateId)}}
                </template>
            </el-table-column>
            <el-table-column  width="150" label="操作">
                <template slot-scope="scope">
                    <Button Name="查看明细" buttonClass="Btn" @click.native="gotoDetail(scope.row,scope.$index)" />
                </template>
            </el-table-column>
            <el-table-column min-width='1'></el-table-column>
        </el-table>
        <Paging :handleCurrentChange="getDatas" :total="total" class="pagingwidth"  :pageSize="searchFlow.pageSize"/>
        
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
                sOwnerDatas:[],
                cateDatas:[],
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
                dataTotal:[],
                searchFlow:{
                    sCode:this.$getCookie("belongShop"),
                    areaCode:"",
                    deptCode:"",
                    pageNumber:1,
                    pageSize:50,
                    startDate:"",
                    endDate:"",
                    sOwner:"",
                    groupType:"1",
                },
                lis:[
                    {value:"按门店汇总",key:"1",active:true,},
                    {value:"按部门汇总",key:"2",active:false,},
                    {value:"按地区汇总",key:"3",active:false,},
                ],
                dateslis:[
                    {value:"今日",key:"1",active:false,},
                    {value:"昨日",key:"2",active:false,},
                    {value:"本周",key:"3",active:false,},
                    {value:"本月",key:"4",active:false,},
                    
                ],
                selectDatas:[],
                totalamount:0,
            }
        },
        computed: {
            ...mapState(["storesvuex"]),
        },
        methods: {
            getRowKeys(row){
                return row.storeCode;
            },
            getids(list,id){
                let value="--";
                list.map(el=>{
                    if(el.cateId==id){
                        value=el.val;
                    }
                });
                return value;
            },
            ...mapMutations(["setDatas"]),
            gotoDetail(item){
                this.$router.push({
                    path:"/NavDetail/OrderTotaldetail",
                    query:{
                        sCode:item.storeCode
                    }
                })
            },
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
                        message: '请选择期望导出的汇总!',
                        duration: "1000",
                        onClose: () => {
                        }
                    });
                } else {
                    console.log(this.searchFlow.groupType);
                    let cateIds=[];
                    let catevals=[];
                    this.cateDatas.map(el=>{
                        cateIds.push(el.cateId)
                        catevals.push(el.cateName)
                    })
                    switch(this.searchFlow.groupType){
                        case "1":
                            let arr1 = ["地区", "部门", "门店", "消费总金额(￥)", ];
                            arr1.push.apply(arr1,catevals);
                            let Tbody1=["areaName","deptName","storeName","sumVal"];
                            Tbody1.push.apply(Tbody1,cateIds);
                            let newobj=new Object();
                            newobj.areaName="";
                            newobj.deptName="";
                            newobj.storeName="合计";
                            newobj.sumVal=this.totalamount;
                            this.cateDatas.map(el=>{
                                this.dataTotal.map(val=>{
                                    if(val.cateId==el.cateId){
                                        newobj[el.cateId]=val.val;
                                    }
                                })
                            })
                            this.selectDatas.push(newobj);
                            this.$exportExcel(arr1, Tbody1, this.selectDatas, '消费汇总');
                            break;
                        case "2":
                            let arr2 = [ "部门", "消费总金额(￥)",];
                            arr2.push.apply(arr2,catevals);
                            let Tbody2=["deptName","sumVal",];
                            Tbody2.push.apply(Tbody2,cateIds);
                            let newobj2=new Object();
                            newobj2.deptName="合计";
                            newobj2.sumVal=this.totalamount;
                            this.cateDatas.map(el=>{
                                this.dataTotal.map(val=>{
                                    if(val.cateId==el.cateId){
                                        newobj2[el.cateId]=val.val;
                                    }
                                })
                            })
                            this.selectDatas.push(newobj2);
                            this.$exportExcel(arr2, Tbody2, this.selectDatas, '消费汇总');
                            break;
                        case "3":
                            let arr3 = [ "地区", "消费总金额(￥)",];
                            arr3.push.apply(arr3,catevals);
                            let Tbody3=["areaName","sumVal",];
                            Tbody3.push.apply(Tbody3,cateIds);
                            let newobj3=new Object();
                            newobj3.areaName="合计";
                            newobj3.sumVal=this.totalamount;
                            this.cateDatas.map(el=>{
                                this.dataTotal.map(val=>{
                                    if(val.cateId==el.cateId){
                                        newobj3[el.cateId]=val.val;
                                    }
                                })
                            })
                            this.selectDatas.push(newobj3);
                            this.$exportExcel(arr3, Tbody3, this.selectDatas, '消费汇总');
                            break;
                    }
                    this.toggleSelection();
                }
            },
            // 导出全部
            demandAll(){
                let data=this.searchFlow;
                data.pageSize=this.total;
                this.$post(this.$cspr+"/api/report/consumeSummary/getConsumeSummaryData",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        let totalamount=0;
                        content.map(el=>{
                            el.prodCateList.map(val=>{
                                el[val.cateId]=val.val;
                            });
                            totalamount+=el.sumVal;
                        })
                        let dataTotal=d.data.dataTotal;
                        let cateIds=[];
                        let catevals=[];
                        this.cateDatas.map(el=>{
                            cateIds.push(el.cateId)
                            catevals.push(el.cateName)
                        })
                        switch(this.searchFlow.groupType){
                        case "1":
                            let arr1 = ["地区", "部门", "门店", "消费总金额(￥)", ];
                            arr1.push.apply(arr1,catevals);
                            let Tbody1=["areaName","deptName","storeName","sumVal"];
                            Tbody1.push.apply(Tbody1,cateIds);
                            let newobj=new Object();
                            newobj.areaName="";
                            newobj.deptName="";
                            newobj.storeName="合计";
                            newobj.sumVal=totalamount;
                            this.cateDatas.map(el=>{
                                dataTotal.map(val=>{
                                    if(val.cateId==el.cateId){
                                        newobj[el.cateId]=val.val;
                                    }
                                })
                            })
                            content.push(newobj);
                            this.$exportExcel(arr1, Tbody1, content, '消费汇总');
                            break;
                        case "2":
                            let arr2 = [ "部门", "消费总金额(￥)",];
                            arr2.push.apply(arr2,catevals);
                            let Tbody2=["deptName","sumVal",];
                            Tbody2.push.apply(Tbody2,cateIds);
                            let newobj2=new Object();
                            newobj2.deptName="合计";
                            newobj2.sumVal=totalamount;
                            this.cateDatas.map(el=>{
                                dataTotal.map(val=>{
                                    if(val.cateId==el.cateId){
                                        newobj2[el.cateId]=val.val;
                                    }
                                })
                            })
                            content.push(newobj2);
                            this.$exportExcel(arr2, Tbody2, content, '消费汇总');
                            break;
                        case "3":
                            let arr3 = [ "地区", "消费总金额(￥)",];
                            arr3.push.apply(arr3,catevals);
                            let Tbody3=["areaName","sumVal",];
                            Tbody3.push.apply(Tbody3,cateIds);
                            let newobj3=new Object();
                            newobj3.areaName="合计";
                            newobj3.sumVal=totalamount;
                            this.cateDatas.map(el=>{
                                dataTotal.map(val=>{
                                    if(val.cateId==el.cateId){
                                        newobj3[el.cateId]=val.val;
                                    }
                                })
                            })
                            content.push(newobj3);
                            this.$exportExcel(arr3, Tbody3, content, '消费汇总');
                            break;
                    }
                    }
                })
            },
            getSummaries(){
                let arrSUm=[];
                this.cateDatas.map(el=>{
                    let hasdata=false;//是否有此分类
                    this.dataTotal.map(val=>{
                        if(val.cateId==el.cateId){
                            hasdata=true;
                            arrSUm.push(val.val);
                        }
                    });
                    !hasdata&&arrSUm.push("");
                });
                if(this.searchFlow.groupType==1){
                    let arr1= ["","","","合计",this.totalamount];
                    arr1.push.apply(arr1,arrSUm);
                    return arr1;
                }else{
                    let arr2= ["","合计",this.totalamount];
                    arr2.push.apply(arr2,arrSUm);
                    return arr2;
                }
            },
            // 重置
            resetAll(){
                this.searchFlow.sCode=this.$getCookie("belongShop");
                this.searchFlow.areaCode="";
                this.searchFlow.deptCode="";
                this.searchFlow.startDate="";
                this.searchFlow.endDate="";
                this.searchFlow.sOwner="";
                this.sDistrictCodearr=[];
                this.corpCodeArr=[];
                this.timesArr=[];
                this.getStore();
                this.dateslis.map(el=>{
                    el.active=false;
                })
            },
            selectclass(item){
                this.lis.map(el=>{
                    el.active=false;
                })
                item.active=true;
                this.searchFlow.groupType=item.key;
                switch(item.key){
                    case "1":this.AreaShow=true;this.deptShow=true;this.storeShow=true;break;
                    case "2":this.AreaShow=false;this.deptShow=true;this.storeShow=false;break;
                    case "3":this.AreaShow=true;this.deptShow=false;this.storeShow=false;break;
                }
                this.getDatas();
            },
             // 搜索查询的条件
            upInput(value,arguName){
                this.searchFlow[arguName]=value||"";
            },
            getAreaCode(value){
                this.searchFlow.areaCode=value;
            },
            upDateRange(value,arguName){
                this.timesArr=value;
                console.log(value)
                this.dateslis.map(el=>{
                    el.active=false;
                });
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
            getcates(){
                // 产品类别
                this.$post(this.$cspr+"/api/report/busiSummary/getProdClass",{}).then(d=>{
                    if(d.success){
                        this.cateDatas=d.data;
                    }
                })
            },
            getDatas(index){
                if(index){
                    this.searchFlow.pageNumber=parseInt(index);
                }
                this.searchFlow.pageSize=50;
                let data=this.searchFlow;
                this.$post(this.$cspr+"/api/report/consumeSummary/getConsumeSummaryData",data).then(d=>{
                    if(d.success){
                        let content=d.data.dataList.content;
                        let totalamount=0;
                        content.map(el=>{
                            el.prodCateList.map(val=>{
                                el[val.cateId]=val.val;
                            });
                            totalamount+=el.sumVal;
                        })
                        this.totalamount=totalamount;
                        this.datas=content;
                        console.log(content)
                        this.total=d.data.dataList.total;
                        this.dataTotal=d.data.dataTotal;
                    }
                })
            },
             // 获取经营方式
             getsOwnerDatas(){
                this.$post(this.$cspr+"/api/report/busiSummary/getSowner",{}).then(d=>{
                    if(d.success){
                        let content=d.data;
                        this.sOwnerDatas=content;
                    }
                })
            },
        },
        mounted () {
            this.getcates();
            this.getDatas();
            this.getStore();
            this.getsOwnerDatas();
        }
    }
</script>
<style scoped>
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