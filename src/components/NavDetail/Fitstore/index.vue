<template>
  <div class="Fitstore">
        <div class="HeadInfo">
            产品编号/名称：
            <Input :value="prodKey"  widths="13.333333rem" arguName="prodKey" @sonInput="sonInput"/>
        </div>
        <div class="HeadInfo">
            产品分类：
            <ProductTag @sonProductSelect="upProductSelect"/>
        </div>
        <div class="HeadInfo">
            <Button Name="查询" :Search="true" @click.native="ToPage(1)"/>
        </div>
        <div class="HeadBtn">
            <Button Name="批量授权门店"  @click.native="BatchStore"/>
            <Button Name="批量限定员工" v-if="prodClass===0" @click.native="BatchStaff"/>
        </div>
        <div>
            <template>
                <el-table :data="content" style="width:100%" border ref="table" row-key="id" @selection-change="change" @row-click="rowClick">
                    <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                    <el-table-column label="编号" prop="prodCode" width="200"></el-table-column>
                    <el-table-column label="产品名称" prop="name" width="300"></el-table-column>
                    <el-table-column label="操作"  width="200">
                        <template slot-scope="scope">
                            <Button Name="授权门店" class="Btn" @click.native.stop="give(scope.$index,scope.row)"/>
                            <!-- <i class="borderLeft"></i>
                            <Button Name="限定员工" class="Btn" @click.native.stop="Restrict(scope.$index,scope.row)"/> -->
                            <i v-if="scope.row.prodClass==0" class="borderLeft"></i>
                            <Button v-if="scope.row.prodClass==0" Name="限定员工" class="Btn" @click.native.stop="Restrict(scope.$index,scope.row)"/>
                        </template>
                    </el-table-column>
                    <el-table-column></el-table-column>
                </el-table>
            </template>
            <Paging :handleCurrentChange="ToPage" :total="total" class="pagingwidth"/>
        </div>
        <Mtk v-if="IsDisplay"/>
        <div v-if="IsDisplay" class="AddModStaff" >
            <header class="Head">选择适用员工<i class="icon Fork Postion" @click.stop="cancel"></i></header>
            <div class="FitstoreBox">
                <div class="FitstoreText">选择适用类型：</div>
                <div>
                    <span class="MarginRight" @click.stop="Radio(0)"><i class="icon unradio IconRight" :class="{'radio':linkType==0}"></i>全体适用</span>
                    <span class="MarginRight" @click.stop="Radio(1)"><i class="icon unradio IconRight" :class="{'radio':linkType==1}"></i>按职位适用</span>
                    <span class="MarginRight" @click.stop="Radio(2)"><i class="icon unradio IconRight" :class="{'radio':linkType==2}"></i>按员工适用</span>
                </div>
            </div>
            <div class="FitstoreBox">
                <div class="FitstoreText">选择适用范围：</div>
                <div>
                    <div v-if="linkType==0" class="">所有适用门店的员工均适用同一种规则，无需选择</div>
                    <div v-else-if="linkType==1">
                        <div>所有适用门店的员工中，符合以下岗位职级名称的适用本规则</div>                        
                        <ul class="FitstoreUl">
                            <li v-for="(item,index) in Data" :key="index" class="BatchConentLi"><span  @click.stop="MultiSelect(index,item)"><i class="IconRight icon" :class="[{'unchecked':item.isSelectd==0},{'checked':item.isSelectd==1}]"></i>{{item.name}}</span></li>                             
                        </ul>
                        <div class="Batchcue">注：没有想要选择的岗位，请管理员前往组织结构中添加！</div>
                    </div>
                    <div v-else-if="linkType==2">
                        <div>所有适用的门店中，分别按照不同的门店选定适用的员工适用本规则</div>
                        <div class="FitstoreStaff"> 
                            <div class="StoresStaff">
                                <div class="SecrchsName">
                                    <Input :value="sName"  widths="100%" arguName="sName" @sonInput="sonInput" @keyup.13.native="SecrchsName" />                                    
                                </div>
                                <ul class="FitstoreStores">
                                     <li v-for="(item,index) in Data" :key="index" @click.stop="Detail(index,item)" :class="{active:item.active}" >{{item.sName}}</li>                                    
                                </ul>
                            </div>
                            <ul class="employee">
                                <li v-for="(item,index) in stores.pstList" :key="index">
                                    <div class="Staffposition">{{item.pstName}}</div>
                                    <span v-for="(e,i) in item.empList" :key="i" @click.stop="CheckBox(i,e)" ><i class="icon IconRight" :class="[{'unchecked':e.isSelectds==0},{'checked':e.isSelectds==1}]"></i>{{e.empNames}}</span>
                                </li>
                            </ul>
                        </div>
                        <div>总共已选择{{StaffTotal}}名员工 <p class="Batchcue">注：没有想要选择的员工，请前往员工信息添加</p> </div>
                    </div>
                </div>
            </div>
            <div class="StaffBtn">
                <Button Name="取消" class="None" @click.native="cancel"/>
                <Button name="确定" @click.native="confirm"/>
            </div>
        </div>
  </div>
</template>

<script>
import Input from "../../common/Input"
import Select from "../../common/Select"
import Button from "../../common/Button"
import Product from "../../common/Product"
import Paging from  "../../common/Paging"
import Mtk from '../../common/Mtk'
export default {
    components:{Input,Select,Button,Product,ProductTag:resolve => {require(['../../common/ProductTag'],resolve)},Paging,Mtk},
    data(){
        return{
            prodClass:'',
            prodKey:"",//产品编号/名称
            cateId:"",//产品分类id
            pageNumber:"",
            pageSize:20,
            content:[],
            total:0,
            ThCheckAll:false,
            IsDisplay:false,
            data:[],
            linkType:0,
            sName:'',//门店
            Data:[],
            stores:[],
            prodIds:[],//产品id
            CheckedArr:[]//已选中的产品数据
        }
    },
    computed:{
        StaffTotal(){
            let count=0
            this.Data.map(e=>{
                e.pstList.map(el=>{
                    el.empList.map(em=>{
                        if(em.isSelectds==1){
                            count++
                        }
                    })
                })
            })
            return count
        }
    },
    mounted(){
        if(this.$route.query.prodClass){
            this.prodClass=this.$route.query.prodClass
        }
        this.ToPage(1)
    },
    methods:{
        upProductSelect(id){
            this.cateId=id;
            this.ProductShow=!this.ProductShow;
        },
        sonInput(value,arguName){
                this[arguName]=value;
        },
        ToPage(index){
            let _data = {
                prodKey:this.prodKey,
                cateId:this.cateId,
                prodClass:this.prodClass,
                pageNumber:parseInt(index),
                pageSize:this.pageSize
            }
            this.$post(this.$host+"/api/prod/prtserv/findAllProd",_data).then(d=>{
                if(d.success){
                     this.content = d.data.content
                     this.total = d.data.total
                }
            })
        },
        change(rows){
            this.CheckedArr = rows
        },
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        BatchStore(){
            if(this.CheckedArr.length < 1){
                return this.$message({
                    type: 'info',
                    message: '请选择产品!',
                    duration:"1000",
                });
                return
            }
            this.getProdIds(this.CheckedArr)
            let prodIds = JSON.stringify(this.prodIds)
            this.$router.push({path:"/NavDetail/GiveStores",
                    query:{prodIds:prodIds}
            })
        },
        give(index,item){
            this.prodIds.push(item.id)
            let prodIds = JSON.stringify(this.prodIds)            
            this.$router.push({path:"/NavDetail/GiveStores",
                    query:{prodIds:prodIds}
            })         
        },
        BatchStaff(){ //批量限定员工
            if(this.CheckedArr.length < 1){
                return this.$message({
                    type: 'info',
                    message: '请选择产品!',
                    duration:"1000",
                });
            }
            this.IsDisplay = true
        },
        Restrict(index,item){  //单个限定员工
            this.$refs.table.clearSelection()            
            this.$refs.table.toggleRowSelection(item,true)
            this.IsDisplay = true
        },
        Radio(Num){
            if(Num == 0){
                this.linkType = Num
                return
            }
            if(Num&&Num!=this.linkType){
                let _data ={
                    linkType:Num,
                }
                if(this.CheckedArr.length==1){
                    _data.prodId=this.CheckedArr[0].id
                }
                if(this.linkType==2){
                    _data.sName=this.sName
                }
                this.$post(this.$host+"/api/prod/emp/getDataByType",_data).then(d=>{
                    if(d.success){
                        let Data = d.data
                        this.linkType = Num
                        if(Num==2&&Data.length>0){
                            Data.map(e=>{e.active=false})
                            Data[0].active = true
                            this.stores=Data[0]
                        } 
                        this.Data = Data                                                      
                    }
                })            
            }
        },
        SecrchsName(){
            let _data ={
                linkType:2,
                sName:this.sName,
                prodId:this.CheckedArr[0].id,
            }
            this.$post(this.$host+"/api/prod/emp/getDataByType",_data).then(d=>{
                    if(d.success){
                        let Data = d.data
                        if(Data.length>0){
                            Data.map(e=>{e.active=false})
                            Data[0].active = true
                            this.stores=Data[0]
                        } 
                        this.Data = Data                                                      
                    }
            }) 
        },
        Detail(index,item){
            this.stores=item
            this.Data.map(e=>{e.active=false})
            item.active=true
        },
        CheckBox(index,item){
            item.isSelectds==0?item.isSelectds=1:item.isSelectds=0
        },
        MultiSelect(index,item){
            item.isSelectd == 0?item.isSelectd = 1:item.isSelectd = 0;            
        },
        getProdIds(Arr){
            let arr = []
            Arr.map(e=>{
                if(arr.indexOf(e.id) == -1){
                    arr.push(e.id)
                }
            })
            return this.prodIds = arr
        },
        getlinkIds(linkIds){
            if(this.linkType==0){
                return linkIds.push(0)
            }
            if(this.linkType==1){
                this.Data.map((e,i)=>{
                    if(e.isSelectd === 1 && linkIds.indexOf(e.id)==-1){
                        linkIds.push(e.id)
                    }else if(e.isSelectd == 0 && linkIds.indexOf(e.id)>-1){
                        linkIds.splice(linkIds.indexOf(e.id),1)
                    }
                })
                if(linkIds.length<1){
                    this.$message({
                        type: 'warning',
                        message: '请选择员工职位！',
                        duration:"1500",
                    });
                    return false
                }else{
                    return true
                }
            }
            if(this.linkType==2){
                this.Data.map(el=>{
                    el.pstList.map(e=>{
                        e.empList.map(em=>{
                            if(em.isSelectds==1 && linkIds.indexOf(em.empId)==-1){
                                linkIds.push(em.empId)
                            }else if(em.isSelectd == 0 && linkIds.indexOf(em.id)>-1){
                                linkIds.splice(linkIds.indexOf(em.id),1)
                            }
                        })
                    })
                })
                if(linkIds.length<1){
                    this.$message({
                        type: 'warning',
                        message: '请选择员工！',
                        duration:"1500",
                    });
                    return false
                }else{
                    return true
                }
            }
        },
        confirm(){
            this.getProdIds(this.CheckedArr) //产品id数组
            let linkIds = []           
            if(!this.getlinkIds(linkIds))return
            let _data = {
                linkType:this.linkType,
                linkIds:linkIds,
                prodIds:this.prodIds
            }
            this.$post(this.$host+"/api/prod/emp/grantEmp",_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                        duration:"1000",
                    });
                    this.cancel()
                }
            })
        },
        cancel(){
            this.IsDisplay = false
            this.linkType = 0
            this.select = true
            this.sName=''
        },
    }
}
</script>

<style scoped>
.Fitstore .HeadInfo{
    display: inline-block;
    font-size: 1rem;
    color: #666666;
    margin:0 2rem 1rem 0;
}
.HeadBtn button{
    margin: 0 1rem 1rem 0;
}

.AddModStaff{
    width: 50rem;
    height: 34.166667rem;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
    border-radius:.4px ;
    z-index: 1000;
}
.Head{
    padding:1.333333rem 0 .833333rem 0;
    color: #5d717c;
    margin:0 1.5rem;
	font-size: 1.166667rem;
    border-bottom:solid 1px #efefef;
}
.Fitstore .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1rem;
}
.FitstoreBox{
    margin-top: .833333rem;
    display: flex;
    color: #666666;
}
.FitstoreText{
    width: 20%;
    text-align: right;
}
.MarginRight{
    margin-right:1rem;
    cursor: pointer;
}
.IconRight::before{
    margin-right: .5rem;    
    margin-right: .5rem;
}
.FitstoreUl{
    margin-top: .833333rem;
    width: 35.833333rem;
    height: 15.416667rem;
    border:1px solid#efefef;
    padding: 0 1rem;
    overflow: auto;
}
.BatchConentLi{
    line-height: 2.5rem;
    font-size: 1rem;
    color: #666666;
    cursor:pointer;
}
.Batchcue{
    font-size: 1rem;
    color: #999;
}
.FitstoreStaff{
    display: flex; 
    margin-top: .833333rem;  
    width:35.833333rem;
    height: 14.166667rem;
    border:solid 1px #efefef;
    overflow: hidden;
}
.StoresStaff{
    width: 25%;
    height: 100%;
    overflow: hidden;
}
.SecrchsName{
    margin-top: -1px;
}
.FitstoreStores{
    margin-top: 1px;
    height: 11.666667rem;
    overflow: auto;
}
.FitstoreStores li{
    line-height: 2.5rem;    
    padding: 0 1rem;
    cursor: pointer;
    text-align: center;
    white-space:nowrap;
    overflow:hidden;
    text-overflow: ellipsis; 
}
.FitstoreStores .active{
    color: #fff;
    background: #2cbcc8;
}
.employee{
    width: 75%;
    height: 100%;
    overflow: auto;
    padding-left: 1rem;
}
.Staffposition{
    line-height: 2.5rem;
}
.StaffBtn{
    position: absolute;
    left: 50%;
    bottom: 2rem;
    transform: translateX(-50%)
}
.StaffBtn button:first-child{
    margin-right: 2rem;
}

</style>
