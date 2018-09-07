<template>
  <div class="GiveStores">
      <div class="GiveStoresBox">
              <span class="FontStyle">所在地区：</span>
              <getArea @getAreaCode="getAreaCode" />
        </div>
        <div class="GiveStoresBox">
              <span class="FontStyle">所属部门：</span>
              <getCorpStore @getCorpStore="getCorpStore"/>
        </div>
        <div class="GiveStoresBox">
              <span class="FontStyle">所属门店：</span>
              <Select :SelecttemData="storeDatas" :values="storeCode" arguName="storeCode" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonSelect"  widths="13.333333rem"/>
        </div>
        <div class="GiveStoresBox">
             <Button Name='查询' :Search="true" @click.native="prodIds.length==1?Topage(1):gopage(1)"/>
        </div>
        <div class="GiveStoresBtn">
             <Button Name='全选' @click.native="CheckAll"/>            
             <Button Name='取消全选' @click.native="UnCheck"/>
             <span v-show="this.isAll == 1">已选中{{total}}条</span>                         
        </div>
        <template>
            <el-table :data="Data" style="width:100%" border ref="table"  @selection-change="change" @row-click="rowClick">
                <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                <el-table-column label="门店编号" prop="storeCode" width="100"></el-table-column>
                <el-table-column label="门店名称" prop="storeName" width="250"></el-table-column>
                <el-table-column label="所在地区" prop="areaName" width="150"></el-table-column>
                <el-table-column label="所在部门" prop="corpName" width="250"></el-table-column>
                <el-table-column min-width="1"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="prodIds.length==1?Topage:gopage" :total="total"  class="pagingwidth"/> 
        <div class="GiveButton">
            <Button Name="取消" class="None" @click.native="cancel"/>
            <Button name="确定" @click.native="confirm"/>
        </div>
  </div>
</template>

<script>
import Input from "../../common/Input"
import Button from '../../common/Button'
import Select from '../../common/Select'
import Paging from '../../common/Paging'
import {mapState,mapMutations} from 'vuex'
export default {
    components:{Input,Button,Select,Paging,
    getArea:resolve => {require(['../../common/getArea'],resolve)},
    getCorpStore:resolve => {require(['../../common/getCorpStore'],resolve)},},
    data(){
        return{
            prodIds:JSON.parse(this.$route.query.prodIds),//产品id数组
            storeIds:[],//门店id数组
            pageNumber:'',
            pageSize:20,
            areaCode:'',//地区code
            corpCode:'',//部门code
            storeCode:'',//门店code
            total:0,
            storeDatas:[],//门店数组
            Data:[],//门店数据
            state:[],//选中的门店
            isAll:'',
        }
    },
    computed:{
        ...mapState(['storesvuex'])
    },
    mounted(){
        this.getStore()
        if(this.prodIds.length == 1){
            this.Topage(1)
        }else{
            this.gopage(1)            
        }
    },
    methods:{
        ...mapMutations(['setDatas']),
        getAreaCode(value){
            if(this.areaCode != value){
                this.areaCode = value
                this.storeCode = "";
                this.getStore()
            }
        },
        getCorpStore(value) {
            if (this.corpCode != value[value.length-1]) {
                this.corpCode = value[value.length-1];
                this.storeCode = "";
                this.getStore();
            }
        },
        //根据部门 查门店
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.corpCode || this.$getCookie("dept") || "",
                queryType:0,
                sDistrictCode:this.areaCode||''
            }
            if(!this.corpCode&&!this.areaCode){//默认门店（当前部门下的门店）
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
        sonSelect(value,arguName){
            this[arguName] = value
        },
        Topage(index){
            let _data = {
                areaCode:this.areaCode,
                corpCode:this.corpCode,
                storeCode:this.storeCode,
                pageSize:this.pageSize,
                pageNumber:parseInt(index)
            }
            this.$post(this.$host+'/api/store/store/getStoreMap/'+this.prodIds[0],_data).then(d=>{
                if(d.success){
                    let Data = d.data.content
                    this.$refs.table.clearSelection();
                    Data.map(e=>{
                        if(e.isSelectd == 1){
                            this.$refs.table.toggleRowSelection(e,true)
                        }
                    })
                    this.Data = Data
                    this.total = d.data.total
                    this.pageNumber = d.data.pageNumber
                }
            })
        },
        gopage(index){
            let _data = {
                areaCode:this.areaCode,
                corpCode:this.corpCode,
                storeCode:this.storeCode,
                pageSize:this.pageSize,
                pageNumber:parseInt(index)
            }
            this.$post(this.$host+'/api/store/store/getStoreMap',_data).then(d=>{
                if(d.success){
                    this.Data = d.data.content
                    this.total = d.data.total
                    this.pageNumber = d.data.pageNumber
                }
            })
        },
        CheckAll(){
            this.Data.map(e=>{
                this.$refs.table.toggleRowSelection(e,true)                
            })
            this.isAll = 1
        },
        UnCheck(){
            this.$refs.table.clearSelection()
            this.isAll = ''
        },
        change(rows){
            this.state = rows 
        },
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        cancel(){
            this.$router.back(-1)
        },
        getStoreIds(storeIds){   //存储id方法
            this.Data.map(e=>{
                if(this.state.some(el=>{return(e.storeId == el.storeId)}) && storeIds.indexOf(e.storeId) == -1){
                    storeIds.push(e.storeId)
                }else if(!this.state.some(el=>{return(e.storeId == el.storeId)}) && storeIds.indexOf(e.storeId) > -1){
                    storeIds.splice(storeIds.indexOf(e.storeId),1)
                }
            })
        },
        confirm(){
            let _data = {
                isAll:this.isAll,
                areaCode:this.areaCode,
                corpCode:this.corpCode,
                storeCode:this.storeCode,
                prodIds:this.prodIds,
                storeIds:this.storeIds,
            }
            if(this.isAll == 1){
                this.$messagebox.confirm('此操作将授权所有门店, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        _data.storeIds = []                        
                        this.Query(_data)
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消',
                            duration:"1500",
                        });          
                });
                return
            }
            if(this.isAll == ''){
                this.getStoreIds(this.storeIds)
                if(this.storeIds.length==0){
                    this.$message({
                        type: 'warning',
                        message: '请选择授权门店！',
                        duration:"1500",
                    }); 
                    return
                }
                this.Query(_data)
            }
        },
        Query(_data){
            this.$post(this.$host+'/api/prod/store/grantStore',_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '授权成功!',
                        duration:"1500",
                        // onClose:()=>{
                        //     this.cancel()
                        // }
                    });
                    this.storeIds=[]
                }
            })
        }
    }
}
</script>

<style>
.GiveStoresBox{
    display: inline-block;
    margin:0 1rem 1rem 0;
}
.GiveStores .GiveStoresBtn button{
    margin: 0 1rem 1rem 0;
}
.GiveButton{
    margin: 2rem 0;
    text-align: center;
}
.GiveButton button:first-child{
    margin-right:2rem;
}

</style>
