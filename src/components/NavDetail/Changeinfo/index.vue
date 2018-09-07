<template>
  <div class="Changeinfo">
        <div class="searchInfo">工号：<Input :value="workNo" widths="13.333333rem" arguName="workNo" @sonInput="sonInput" /></div>
        <div class="searchInfo">姓名：<Input :value="empName" widths="13.333333rem" arguName="empName" @sonInput="sonInput" /></div>
        <div class="searchInfo">
            <span class="searchText"> 职位：</span>
            <Select :SelecttemData="PostionArr" arguName="position" :values="position" :SelecttemDetail="['id','pstName']" @sonSelect="sonInput" widths="13.333333rem"/>
        </div>
        <div class="searchInfo ">
            <span class="searchText">所属门店：</span>
            <Select :SelecttemData="storeDatas" :values="belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonInput" widths="13.333333rem"/>
        </div>
        <div class="searchInfo">
            <span class="searchText">变动类型：</span>
            <Select :SelecttemData="typeData" :values="changeType" arguName="changeType" :SelecttemDetail="['changeType','changeName']" @sonSelect="sonInput" widths="13.333333rem"/>
        </div>
        <div class="searchInfo">
            <Button Name="查询" :Search="true" @click.native="ToPage(1)"/>
            <Button Name="重置" :Reset="true" @click.native="Reset"/>
        </div>
        <template>
            <el-table :data="content" style="width:100%" border ref="Table"  @selection-change="change">
                <!-- <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>   -->
                <el-table-column label="工号" prop="workNo" width="100"></el-table-column>
                <el-table-column label="姓名" prop="empName" width="100"></el-table-column>
                <el-table-column label="变动类型" prop="changeType" width="200"></el-table-column>
                <el-table-column label="所属门店" prop="belongShop" width="200"></el-table-column>
                <el-table-column label="生效时间" prop="effectTime" width="200"></el-table-column>
                <el-table-column label="截止时间" prop="endTime" width="200"></el-table-column>
                <el-table-column label="操作时间" prop="opTime" width="200"></el-table-column>
                <el-table-column label="变动详情" prop="cause" width="300"></el-table-column>
                <el-table-column min-width="1"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="ToPage" :total="total" class="pagingwidth"/>
  </div>
</template>

<script>
import Input from "../../common/Input"
import Button from "../../common/Button"
import Select from "../../common/Select"
import Paging from "../../common/Paging"
import {mapState,mapMutations} from 'vuex'
export default {
    components:{Input,Button,Select,Paging},
    data(){
        return{
            workNo:"", //工号
            empName:"",//员工姓名
            PostionArr:[],  // 查询职位        
            position:"", //职位
            belongShop:this.$getCookie('belongShop')!="null"?this.$getCookie('belongShop'):"",//所属门店
            storeDatas:[],
            typeData:[],
            changeType:'',
            content:[],
            pageSize:20,
            total:1,
            pageNumber:'',
        }
    },
    computed:{
        ...mapState(['Postionvuex','storesvuex','typeDatavuex'])
    },
    mounted(){
        this.ToPage(1)
        this.getStore()
        this.getPostion()
        this.getType()
    },
    methods:{
        ...mapMutations(['setDatas']),
        sonInput(value,arguName){
            this[arguName]=value;
        },
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.$getCookie("dept")|| "",
                queryType:0,
            }
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
        },
        //职位
        getPostion(){
            if(!this.Postionvuex){
                this.$post(this.$host + "/api/store/emppost/idNameQueryAll", {}).then(d => {
                    if (d.success) {
                        this.PostionArr = d.list;
                        this.setDatas({name:"Postionvuex",value:this.PostionArr})
                    }
                });
            }else{
                this.PostionArr = this.Postionvuex
            }
        },
        getType(){
            if(this.typeDatavuex){
                this.typeData = this.typeDatavuex
            }else{
                this.$post(this.$host+"/api/store/empchange/type", {}).then(d => { // 变动类型
                    if (d.success) {
                        this.typeData = d.data;
                        this.setDatas({name:"typeDatavuex",value:this.typeData})
                    }
                });
            }
        },
        ToPage(index){
            let _data = {
                    pageNumber:parseInt(index),
                    pageSize:this.pageSize,       
                    workNo:this.workNo,
                    empName:this.empName,
                    position:this.position,
                    belongShop:this.belongShop, 
                    changeType:this.changeType
                }
                this.$post(this.$host+"/api/store/empchange/query/page",_data).then(d=>{
                    if(d.success){
                        let content = d.data.content
                        content.map((e,i)=>{
                            e.effectTime != null ? e.effectTime = this.$dateFormat("yy-MM-dd hh:mm:ss",e.effectTime) : null ;
                            e.endTime != null ? e.endTime = this.$dateFormat("yy-MM-dd hh:mm:ss",e.endTime) : null;
                            e.opTime != null ? e.opTime = this.$dateFormat("yy-MM-dd hh:mm:ss",e.opTime) : null;
                        })
                        this.content = content
                        this.total = d.data.total
                        this.pageNumber = d.data.pageNumber
                    }
                })
        },
        change(rows){
            console.log(rows)
        },
        Reset(){
            if(!this.workNo && !this.empName && !this.position && !this.belongShop && !this.changeType)return
            this.workNo = this.empName = this.position = this.changeType = ""; this.belongShop = this.$getCookie('belongShop') || ""
        },
    },
}
</script>

<style scoped>

.Changeinfo .searchInfo{
    display: inline-block;
    margin:0 2rem 1rem 0;
    font-size: 1rem;
}
.Changeinfo .searchInfo button:first-child{
   margin-right: 1rem
}
</style>
