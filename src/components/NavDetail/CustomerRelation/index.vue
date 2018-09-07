<template>
    <div class="CustomerRelation">
        <div class="RelationBox">
            <span>客户：</span>
            <Input :value="custCodeOrNameOrTel" placeholder="客户名称/编号/手机号" widths="160px" arguName="custCodeOrNameOrTel" @sonInput="sonInput"/>
        </div>
        <div class="RelationBox">
            <span>变动类型：</span>
            <Select :SelecttemData="cTypeArr" :values="cType" arguName="cType" :SelecttemDetail="['value','key']" @sonSelect="sonInput"  widths="13.333333rem"/>
        </div>
        <div class="RelationBox">
            <span>所属门店：</span>
            <Select :SelecttemData="storeDatas" :values="sCode" arguName="sCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonInput"  widths="13.333333rem"/>
        </div>
        <div class="RelationBox">
            <span>创建日期：</span>
            <DateRange :values="timesArr" :arguName="['startTime','endTime']" @getDateRange="getDateRange"/>
        </div>
        <div class="RelationBox">
            <Button Name='查询' :Search="true" @click.native="Search"/>
             <Button Name="重置" :Reset="true" @click.native="Reset" />
        </div>
        <template>
            <el-table :data="content" style="width:100%" border>
                <el-table-column label="客户姓名" prop="cName" width="120"></el-table-column>
                <el-table-column label="客户编号" prop="cCode" width="120"></el-table-column>
                <el-table-column label="变动前服务技师" prop="fromEmpName" width="150" ></el-table-column>
                <el-table-column label="变动后服务技师" prop="toEmpName" width="150" ></el-table-column>
                <el-table-column label="变动前服务经理" prop="fromSaleMgrName" width="150" ></el-table-column>                
                <el-table-column label="变动后服务经理" prop="toSaleMgrName" width="150" ></el-table-column>   
                <el-table-column label="变动前门店" prop="fromStoreName" width="200" ></el-table-column>                
                <el-table-column label="变动后门店" prop="toStoreName" width="200" ></el-table-column>                
                <el-table-column label="变动时间" prop="createTime"  width="150">
                    <template slot-scope="scope">{{$dateFormat("yy-MM-dd",scope.row.createTime)}}</template>
                </el-table-column>
                <el-table-column  min-width="1"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="Topage" :total="total"  class="pagingwidth"/>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import Input from '../../common/Input'
import Select from '../../common/Select'
import DateRange from '../../common/DateRange'
import Button from '../../common/Button'
import Paging from '../../common/Paging'
export default {
    components:{Input,Select,DateRange,Button,Paging},
    data(){
        return{
            custCodeOrNameOrTel:'',//客户名称/编号/手机号
            cTypeArr:[
                {key:'转店变动',value:1},
                {key:'分配服务员工变动',value:2},
            ],
            cType:'',
            storeDatas:[],
            sCode:'',//门店code
            timesArr:[],//日期
            content:[],
            pageNumber:'',
            total:0,
            pageSize:20,
        }
    },
    computed:{
        ...mapState(['storesvuex'])
    },
    mounted(){
        this.getStore()
        this.Topage(1)
    },
    methods:{
        ...mapMutations(['setDatas']),
        sonInput(value,arguName){
            this[arguName]=value
        },
        //根据部门 查门店
        getStore(){
            let data = {
                pageNumber: 1,
                pageSize: 500,
                corpCode: this.$getCookie("dept") || "",
                queryType:0
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
        getDateRange(value,arguName){
            this.timesArr = value
        },
        Topage(index){
            let _data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
                cType:this.cType,
                sCode:this.sCode,
                custCodeOrNameOrTel:this.custCodeOrNameOrTel,
                createTimeStart:this.timesArr[0],
                createTimeEnd:this.timesArr[1]
            }
            this.$post(this.$host+`/api/cust/custchghist/page`,_data).then(d=>{
                if(d.success){
                    this.content = d.data.content
                    this.pageNumber = d.data.pageNumber
                    this.total = d.data.total
                }
            })
        },
        Search(){
            if(!this.custCodeOrNameOrTel && !this.cType && !this.sCode && this.timesArr.length==0)return
            this.Topage(1)
        },
        Reset(){
            if(!this.custCodeOrNameOrTel && !this.cType && !this.sCode && this.timesArr.length==0)return
            this.custCodeOrNameOrTel = ''
            this.cType = ''
            this.sCode = ''
            this.timesArr = []
            this.Topage(1)
        }
    }
}
</script>

<style scoped>
.RelationBox{
    display: inline-block;
    margin:0 1rem 1rem 0;
}
.RelationBox button:first-child{
    margin-right: 1rem;
}
</style>
