<template>
    <div class="Parameter">
        <div class="ParameterSearch">
            <span>参数类型：</span>
            <Select :SelecttemData="Data" :values="code"  arguName="code" :SelecttemDetail="['dCode','dName']" @sonSelect="sonInput" widths="13.333333rem"/>
        </div>
        <div class="ParameterSearch">
            <Button Name="查询" :Search="true" @click.native.stop='search'/>
        </div>
        <div class="ParameterBtn">
            <Button Name="新增" :iconadd="true" @click.native.stop='add'/>
        </div>
        <template>
            <el-table :data="content" style="width:100%" border>
                <el-table-column label="参数名称" prop="parmName" width="250" ></el-table-column>
                <el-table-column label="参数类型" prop="dName" width="200"></el-table-column>
                <el-table-column label="参数值" prop="parmValue" width="300" ></el-table-column>
                <el-table-column label="操作" fixed="right" width="100">
                    <template slot-scope="scope">
                        <Button Name="修改" v-if="scope.row.parentCode!=0" class="Btn purple" @click.native.stop="Modify(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="Topage" :total="total" class="pagingwidth"/>
        <Mtk v-if="IsShow"/>
        <div v-if="IsShow" class="ParameterInfo">
            <div class="ParameterTheader">{{id?'修改参数':'新增参数'}}<i class="icon Fork Postion" @click.stop="cancel"></i></div>
            <div class="ParameterBox" :class="{MarGinTop:id}">
                <span class="ParameterText" ><i class="icon waring"></i>参数名称：</span>
                <Input arguName="parmName" :value="parmName" @sonInput="sonInput" widths="13.333333rem"/>
            </div>
            <div class="ParameterBox" v-show="!id">
                <span class="ParameterText"><i class="icon waring"></i>参数类型：</span>
                <Select :SelecttemData="Data" :values="dCode"  arguName="dCode" :SelecttemDetail="['dCode','dName']" @sonSelect="sonInput" widths="10rem"/>
            </div>
            <div class="ParameterBox" v-show="!id">
                <span class="ParameterText"><i class="icon waring"></i>参数值：</span>
                <Input arguName="parmValue" :value="parmValue" @sonInput="sonInput" widths="13.333333rem"/>
            </div>
            <div class="ParameterInfoBtn" :class="{BTNMarGinTop:id}">
                <Button Name="取消" class="None" @click.native="cancel"/>
                <Button Name="确定" @click.native="save"/>
            </div>
        </div>
    </div>
</template>

<script>
import Input from '../../common/Input'
import Button from '../../common/Button'
import Select from '../../common/Select'
import Paging from '../../common/Paging'
import Mtk from '../../common/Mtk'
import Vue from 'vue'
import {Table} from 'element-ui'
Vue.use(Table)
export default {
    components:{Input,Button,Select,Paging,Mtk},
    data(){
        return{
            content:[],
            IsShow:false,
            Data:[],
            id:'',
            parmName:'',
            dCode:'',
            parmValue:'',
            pageSize:20,
            code:'',
            total:0,
        }
    },
    mounted(){
        this.getType()
        // this.Topage(1)        
    },
    methods:{
        sonInput(value,arguName){
            this[arguName] = value
            console.log(value,arguName)
        },
        Topage(index){
            let _data = {
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
                code:this.code,
            }
            this.$post(this.$host+'/api/sysmgr/dictsysparm/page',_data).then(d=>{
                if(d.success){
                    this.content = d.data.content
                    this.pageNumber = d.data.pageNumber
                    this.total = d.data.total
                }
            })
        },
        getType(){
            this.$post(this.$host+'/api/sysmgr/dictsysparm/select',{}).then(d=>{
                if(d.success){
                    this.Data = d.data
                }
            })
        },
        search(){
            if(!this.code){
                this.$message({
                    type: 'info',
                    message: '请选择查询条件！',
                    duration:"1000",
                });
                return
            }
            this.Topage(1)
        },
        add(){
            this.IsShow = true
        },
        cancel(){
            this.id = ''
             this.parmName = ''
            this.parmValue = ''
            this.dCode = ''
            this.IsShow = false
        },
        save(){
            if(this.id){
                this.$post(this.$host+'/api/sysmgr/dictsysparm/update',{id:this.id,parmName:this.parmName}).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"1000",
                        });
                        this.content.map(e=>{if(e.id == this.id){e.parmName = this.parmName}})
                        this.cancel()                        
                    }
                })
            }else{
                let _data = {
                    dCode:this.dCode,
                    parmName:this.parmName,
                    parmValue:this.parmValue
                }
                this.$post(this.$host+'/api/sysmgr/dictsysparm/add',_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '新增成功!',
                            duration:"1000",
                        });
                        this.cancel()
                        this.Topage(1)
                    }
                })
            }
        },
        Modify(index,item){
            this.id = item.id
            this.parmName = item.parmName
            // this.parmValue = item.parmValue
            // this.dCode = item.dCode
            this.IsShow = true
        },
    }
}
</script>

<style>
.ParameterBtn button{
    margin:0 1rem 1rem 0;
}
.Parameter .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.ParameterSearch{
    margin:0 2rem 1rem 0;
    display: inline-block;
    font-size: 1rem;
}
.ParameterInfo{
    width: 33.333333rem;
    height: 20.833333rem;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 4px;
    background: #fff;
    z-index: 1000;
}
.ParameterTheader{
    font-size: 1.166667rem;
    color: #5d717c;
    margin: 0 1.5rem 2rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
}
.ParameterBox{
    margin-bottom:1rem ;
}
.ParameterText{
    display: inline-block;
    width: 35%;
    font-size: 1rem;
    color: #666;
    text-align: right;
}
.MarGinTop{
    margin-top: 5rem;
}
.ParameterInfoBtn{
    margin-top: 2rem;
    /* margin-bottom: 2rem; */
    text-align: center;
}
.BTNMarGinTop{
    margin-top:4rem; 
}
.ParameterInfoBtn button:first-child{
    margin-right: 2rem;
}

</style>
