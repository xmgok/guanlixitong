<template>
    <div class="examine_approve Dailybalance">
        <div class="search-wraps">
            <ul>
                <li>
                    <span>月份：</span>
                    <el-date-picker
                        v-model="searchFlow.beginTime"
                        type="month"
                        @change="changebeginTime"
                        value-format="yyyy-MM"
                        placeholder="选择月">
                    </el-date-picker>至
                    <el-date-picker
                        v-model="searchFlow.endTime"
                        type="month"
                        @change="changeendTime"
                        value-format="yyyy-MM"
                        placeholder="选择月">
                    </el-date-picker>
                </li>
                <li >
                    <span>状态：</span>
                    <Select :SelecttemData="selDatas" :values="searchFlow.status" arguName="status" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <Button Name='查询' buttonClass='purple' @click.native="demand" :Search="true"></Button>
                    <Button Name='重置' buttonClass='purple' @click.native="resetAll" Reset="true"></Button>
                </li>
            </ul>
        </div>
        <div class="btn-wrap">
            <el-table :data="datas" border style="width:100%" >
                <el-table-column  prop="busiDate" label="月份" width="120"></el-table-column>
                <el-table-column  prop="statusName" label="状态" width="80"></el-table-column>
                <el-table-column  prop="uName" label="操作员" width="120"></el-table-column>
                <el-table-column  prop="dayEndTime" label="操作时间" width="200"></el-table-column>
                <el-table-column  prop="" label="操作" width="120">
                    <template slot-scope="scope">
                        <Button :Name="scope.row.status?'取消关账':'关账'" buttonClass="Btn" @click.native="Closing(scope.row,scope.$index)"/>
                    </template>
                </el-table-column>
            </el-table>
        <Paging :handleCurrentChange="gotoPage" :total="total"  class="pagingwidth"/>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import Button from "../../common/Button";
import Input from "@/components/common/Input";
import Table from "@/components/common/Table";
import Select from "../../common/Select";
import Paging from "../../common/Paging";
import {mapMutations,mapState} from "vuex"
export default {
    name:"Dailybalance",
    components: { Paging, Button, Input, Select,Table,getArea:resolve => {require(['../../common/getArea'], resolve)}
    ,getCorpStore:resolve => {require(['../../common/getCorpStore'], resolve)} },
    data() {
        return {
            searchFlow:{//搜索条件
                beginTime:"",
                endTime:"",
                pageNumber:1,
                pageSize:20,
                status:"",
            },
            lastDate:"",
            selDatas:[
                {key:"",value:"全部"},
                {key:0,value:"未关账"},
                {key:1,value:"已关账"},
            ],
            datas:[],
            total:0,
        };
    },
    methods: {
        gotoPage(index){
            let data=this.searchFlow;
            data.pageNumber=index;
            this.demandFunc(data);
        },
        changebeginTime(value){
            this.searchFlow.beginTime=value;
        },
        changeendTime(value){
            this.searchFlow.endTime=value;
        },
        resetAll(){
            // this.$dateFormat('yy-MM',new Date(this.lastDate))
            this.searchFlow={
                beginTime:"",
                endTime:"",
                pageNumber:1,
                pageSize:20,
                status:"",
            };
        },
         // 搜索查询的条件
        upInput(value,arguName){
            this.searchFlow[arguName]=value;
        },
        // 取消或关账
        Closing(item){
            let message="";
            if(item.status==1){//已关账的取消
                message="取消关账成功"
            }else{
                message="关账成功"
            }
            let status=0;
            if(item.status==1){
                status=0
            }else{
                status=1
            }
            let data={
                busiDate:item.busiDate,
                status:status,
                id:item.id,
            }
            this.$post(this.$host+"/api/store/business/statistics/modifyStoreCloseAcctStatus", data).then(d => {
                if (d.success) {
                    if(item.status==1){//已关账的取消
                        item.status=0;
                        item.statusName="未关账"
                    }else{
                        item.status=1;
                        item.statusName="已关账"
                    }
                    item.dayEndTime=this.$dateFormat("yy-MM-dd hh:mm:ss",new Date());
                    item.uName=this.$getCookie("uname")||"";
                    this.$message({
                        type:"success",
                        message:message
                    })
                }
            });
        },
        // 查询
        demand(){
            console.log(this.searchFlow)
            if(new Date(this.searchFlow.beginTime)>new Date(this.searchFlow.endTime)){
                this.$message({
                    type:'info',
                    message:'截止月份不小于初始月份'
                })
                return
            }
            this.demandFunc(this.searchFlow);
        },
        demandFunc(data){
            this.$post(this.$host+"/api/store/business/statistics/findStoreCloseAcctPage", data).then(d => {
                if (d.success) {
                    let content=d.data.content;
                    content.map(el=>{
                        if(el.status==1){
                            el.statusName="已关账"
                        }else{
                            el.statusName="未关账"
                        }
                        el.dayEndTime=this.$dateFormat("yy-MM-dd hh:mm:ss",el.dayEndTime)
                    })
                   this.datas=content;
                   this.total=d.data.total;
                }
            });
        },
    },
    mounted() {
        let nowdays = new Date();  
        let year = nowdays.getFullYear();  
        let month = nowdays.getMonth();  
        if(month==0)  
        {  
            month=12;  
            year=year-1;  
        }  
        if (month < 10) {  
            month = "0" + month;  
        } 
        this.lastDate=year + "-" + month;
        console.log(new Date(this.lastDate))
        // this.$dateFormat('yy-MM',new Date(this.lastDate))
        this.searchFlow={
            beginTime:"",
            endTime:"",
            pageNumber:1,
            pageSize:20,
            status:"",
        }
        this.demandFunc(this.searchFlow);
    },
};
</script>
<style scoped>
   
</style>




