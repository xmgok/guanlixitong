<template>
    <div class="SetResults">
         <div class="SetResultsBox">
              <span >产品编号/名称：</span>
              <Input  arguName="pCodeOrName" :value="pCodeOrName" @sonInput="sonInput" widths="13.333333rem"/>
         </div>
         <div class="SetResultsBox">
              <span >产品分类：</span>
              <ProductTag @sonProductSelect="sonInput" arguName='pCateId'/>
         </div>
         <div class="SetResultsBox">
             <Button Name="查询" @click.native.stop="serverPage(1)"/>
         </div>
        <div class="SetResultsBtn clearfix">
            <ul class="clearfix left">
                <li v-for="(item,index) in ToggleArr" :key="index" class="SetSelect" :class="{avtive:Toggle==item.Toggle}" @click.stop="Switch(item.Toggle)">{{item.name}}<i class="icon icongou" v-show="item.Toggle==Toggle"></i></li>
            </ul>
            <div class="right">
                <Button Name="总规则设置" @click.native.stop="setTotal" />
                <Button Name="批量编辑" @click.native.stop="Batch" />
            </div>
        </div>
        <div v-show="Toggle==1" class="tableH">
            <template>
                <el-table :data="content" style="width: 100%" border @selection-change="CheckBox">
                    <el-table-column type="selection" width="50" fixed ></el-table-column>
                    <el-table-column label="产品编号" prop="psCode" width="150"></el-table-column>
                    <el-table-column label="服务名称" prop="psName" width="250"></el-table-column>
                    <el-table-column label="分类名称" prop="cateName" width="200"></el-table-column>
                    <el-table-column label="提成方式" width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.active">{{(scope.row.perType==0&&'百分比')||(scope.row.perType==1&&'固定金额')||(scope.row.perType)}}</span>
                            <Select v-if="scope.row.active" widths="100px" :SelecttemData="SelecttemData" @sonSelect='sonSelect' :arguName="scope.$index" :clearable="false" :SelecttemDetail="['perType','perValue']" :values="scope.row.perType"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="点客提成值" width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.active">{{(scope.row.perType===0&&scope.row.perPercDk+'%')||(scope.row.perType===1&&scope.row.perFixDk+'元')||''}}</span>
                            <span v-if="scope.row.active">
                                <span v-if="scope.row.perType===0"><Input widths="90px" @sonInput='SetperPercDk' :arguName="scope.$index" :value="scope.row.perPercDk" :maxlength='5'/> %</span>
                                <span v-if="scope.row.perType===1"><Input widths="90px" @sonInput='SetperFixDk' :arguName="scope.$index" :value="scope.row.perFixDk" :maxlength='20'/> 元</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="非点客提成值" width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.active">{{(scope.row.perType===0&&scope.row.perPerc+'%')||(scope.row.perType===1&&scope.row.perFix+'元')||''}}</span>
                            <span v-if="scope.row.active">
                                <span v-if="scope.row.perType===0"><Input widths="90px" @sonInput='SetperPerc' :arguName="scope.$index" :value="scope.row.perPerc" :maxlength='5'/> %</span>
                                <span v-if="scope.row.perType===1"><Input widths="90px" @sonInput='SetperFix' :arguName="scope.$index" :value="scope.row.perFix" :maxlength='20'/> 元</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最低提成金额" width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.active">{{scope.row.feeLimit?scope.row.feeLimit+'元':''}}</span>
                            <span v-if="scope.row.active"><Input widths="90px" @sonInput='getInput' :arguName="scope.$index" :value="scope.row.feeLimit" :maxlength='20'/> 元</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="120">
                        <template slot-scope="scope">
                            <Button v-if="!scope.row.active" Name="编辑" class="Btn" @click.native.stop="Editor(scope.$index,scope.row)"/>
                            <span v-if="scope.row.active">
                                <Button Name="取消" class="Btn" @click.native.stop="revocation(scope.$index,scope.row)"/>
                                <i class="borderLeft"></i>
                                <Button  Name="保存" class="Btn" @click.native.stop="Save(scope.$index,scope.row)"/>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="1" fixed="right"></el-table-column>
                </el-table>
            </template>
            <Paging :handleCurrentChange="serverPage" :total="Setotal" class="pagingwidth"/>            
        </div>
        <div v-show="Toggle==2" class="tableH">
            <template>
                <el-table :data="Sacontent" style="width: 100%" border @selection-change="CheckBox">
                    <el-table-column type="selection" width="50" fixed ></el-table-column>
                    <el-table-column label="商品编号" prop="psCode" width="150"></el-table-column>
                    <el-table-column label="所属分类" prop="cateName" width="200"></el-table-column>
                    <el-table-column label="商品名称" prop="psName" width="250"></el-table-column>
                    <el-table-column label="提成方式" width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.active">{{(scope.row.perType==0&&'百分比')||(scope.row.perType==1&&'固定金额')||(scope.row.perType)}}</span>
                            <Select v-if="scope.row.active" widths="100px" :SelecttemData="SelecttemData" @sonSelect='sonSelect' :arguName="scope.$index" :clearable="false" :SelecttemDetail="['perType','perValue']" :values="scope.row.perType"/>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="提成值" width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.active">{{(scope.row.perType===0&&scope.row.perPercDk+'%')||(scope.row.perType===1&&scope.row.perFixDk+'元')||''}}</span>
                            <span v-if="scope.row.active">
                                <span v-if="scope.row.perType===0"><Input widths="90px" @sonInput='SetperPercDk' :arguName="scope.$index" :value="scope.row.perPercDk" :maxlength='5'/> %</span>
                                <span v-if="scope.row.perType===1"><Input widths="90px" @sonInput='SetperFixDk' :arguName="scope.$index" :value="scope.row.perFixDk" :maxlength='20'/> 元</span>
                            </span>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="提成值" width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.active">{{(scope.row.perType===0&&scope.row.perPerc+'%')||(scope.row.perType===1&&scope.row.perFix+'元')||''}}</span>
                            <span v-if="scope.row.active">
                                <span v-if="scope.row.perType===0"><Input widths="90px" @sonInput='SaperPerc' :arguName="scope.$index" :value="scope.row.perPerc" :maxlength='5'/> %</span>
                                <span v-if="scope.row.perType===1"><Input widths="90px" @sonInput='SaperFix' :arguName="scope.$index" :value="scope.row.perFix" :maxlength='20'/> 元</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最低提成金额" width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.active">{{scope.row.feeLimit?scope.row.feeLimit+'元':''}}</span>
                            <span v-if="scope.row.active"><Input widths="90px" @sonInput='SaInput' :arguName="scope.$index" :value="scope.row.feeLimit" :maxlength='20'/> 元</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="120">
                        <template slot-scope="scope">
                            <Button v-if="!scope.row.active" Name="编辑" class="Btn" @click.native.stop="Editor(scope.$index,scope.row)"/>
                            <span v-if="scope.row.active">
                                <Button Name="取消" class="Btn" @click.native.stop="revocation(scope.$index,scope.row)"/>
                                <i class="borderLeft"></i>
                                <Button  Name="保存" class="Btn" @click.native.stop="Save(scope.$index,scope.row)"/>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="1" fixed="right"></el-table-column>
                </el-table>
            </template>
            <Paging :handleCurrentChange="salesPage" :total="Satotal" class="pagingwidth"/>            
        </div>               
        <Mtk v-show="IsShow"/>
        <div v-show="IsShow" class="SetResultsAll">
            <header class="SetResultsHaeder">总体规则设置<i class="icon Fork Postion" @click.stop="cancel"></i></header>
            <div class="ResultsAllBox">
                <span class="ResultsAllText">业绩分配时效控制：</span>
                <span>
                    <el-input-number v-model="daysCtrl" controls-position="right" :min="1" size="mini"></el-input-number> 天                    
                </span>
            </div>
            <div class="ResultsAllBox">
                <span class="ResultsAllText">收款业绩控制：</span>
                <el-checkbox v-model="isEmpPerc">内部员工不计收款业绩</el-checkbox>
                <!-- <span @click.stop='checkIsEmpPerc'><i class="icon unchecked" :class="{checked:isEmpPerc===1}"></i>内部员工不计收款业绩</span> -->
            </div>
            <div class="ResultsAllBox">
                <span class="ResultsAllText">服务业绩控制：</span>
                <el-checkbox v-model="mustCareLog">分配服务业绩前必须填写护理日志</el-checkbox>                
                <!-- <span @click.stop='checkMustCareLog'><i class="icon unchecked" :class="{checked:mustCareLog===0}"></i>分配服务业绩前必须填写护理日志</span> -->
            </div>
            <div class="ResultsAllBut">
                <Button Name="取消" class="None" @click.native.stop="cancel"/>
                <Button Name="确定" @click.native.stop="submit"/>
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
import {InputNumber} from 'element-ui'
Vue.use(InputNumber)
export default {
    components:{Input,Button,Select,ProductTag:resolve => {require(['../../common/ProductTag'],resolve)},Paging,Mtk},
    data(){
        return{
            ToggleArr:[
                {name:'服务提成',Toggle:1},
                {name:'商品销售提成',Toggle:2},
            ],
            Toggle:1,
            pCodeOrName:"",
            pCateId:'',//产品分类id
            pageNumber:1,
            pageSize:20,
            Setotal:1,
            Satotal:1,
            SelecttemData:[
                {perType:0,perValue:'百分比'},
                {perType:1,perValue:'固定金额'},
            ],
            content:[],
            Sacontent:[],
            Checked:[],//选中的数据储存
            perType:'',
            perPerc:'',
            perFix:'',
            perPercDk:'',
            perFixDk:'',
            feeLimit:'',
            IsShow:false,
            daysCtrl:'',
            isEmpPerc:'',
            mustCareLog:'',
        }
    },
    mounted(){
        this.serverPage(1)
        this.$post(this.$host+'/api/performance/cfg/query',{}).then(d=>{
            if(d.success){
                this.daysCtrl=parseInt(d.data.daysCtrl)               
                d.data.isEmpPerc==1?this.isEmpPerc=true:this.isEmpPerc=false
                d.data.mustCareLog==0?this.mustCareLog=true:this.mustCareLog=false
            }
        })
    },
    methods:{
        Switch(value){
            if(this.Toggle!=value){
                this.Toggle=value
                if(value==1){
                    this.serverPage(1)
                }
                if(value==2){
                    this.salesPage(1)
                }
            }
        },
        sonInput(value,arguName){
            this[arguName] = value
        },
        sonSelect(value,index) {
            if(this.Toggle==1){
                this.content[index]['perType']=value;
            }
            if(this.Toggle==2){
                this.Sacontent[index]['perType']=value;
            }
        },
        SetperPercDk(value,index){
            if(!value){
                this.content[index]['perPercDk'] = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(parseFloat(value))||value>100){
                this.$message({
                    type: 'warning',
                    message: '百分比格式为一百以内的数字，可包含俩位小数！',
                    duration:"2000",
                });
            }
            this.content[index]['perPercDk'] = value
        },
        SetperFixDk(value,index){
            if(!value){
                this.content[index]['perFixDk'] = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(parseFloat(value))){
                this.$message({
                    type: 'warning',
                    message: '提成值格式为数字，可包含俩位小数！',
                    duration:"2000",
                });
            }
            this.content[index]['perFixDk'] = value
        },
        SetperPerc(value,index){
            if(!value){
                this.content[index]['perPerc'] = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(parseFloat(value))||value>100){
                this.$message({
                    type: 'warning',
                    message: '百分比格式为一百以内的数字，可包含俩位小数！',
                    duration:"2000",
                });
            }
            this.content[index]['perPerc'] = value
        },
        SetperFix(value,index){
            if(!value){
                this.content[index]['perFix'] = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(parseFloat(value))){
                this.$message({
                    type: 'warning',
                    message: '提成值格式为数字，可包含俩位小数！',
                    duration:"2000",
                });
            }
            this.content[index]['perFix'] = value
        },
        getInput(value,index){
            if(!value){
                this.content[index]['feeLimit'] = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(parseFloat(value))){
                this.$message({
                    type: 'warning',
                    message: '金额格式为数字，可包含俩位小数！',
                    duration:"2000",
                });
            }
            this.content[index]['feeLimit'] = value
        },
        serverPage(index){
            let _data ={
                pCateId:this.pCateId,
                pCodeOrName:this.pCodeOrName,
                pageNumber:index,
                pageSize:this.pageSize,
            }
            this.$post(this.$host+'/api/performance/product/page',_data).then(d=>{
                if(d.success){
                    let content=d.data.content
                    content.map(e=>{e.active = false})
                    this.Setotal = d.data.total
                    this.content = content
                }
            })
        },
        SaperPerc(value,index){
            if(!value){
                this.Sacontent[index]['perPerc'] = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(parseFloat(value))||value>100){
                this.$message({
                    type: 'warning',
                    message: '百分比格式为一百以内的数字，可包含俩位小数！',
                    duration:"2000",
                });
            }
            this.Sacontent[index]['perPerc'] = value
        },
        SaperFix(value,index){
            if(!value){
                this.Sacontent[index]['perFix'] = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(parseFloat(value))){
                this.$message({
                    type: 'warning',
                    message: '提成值格式为数字，可包含俩位小数！',
                    duration:"2000",
                });
            }
            this.Sacontent[index]['perFix'] = value
        },
        SaInput(value,index){
            if(!value){
                this.Sacontent[index]['feeLimit'] = ''
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(parseFloat(value))){
                this.$message({
                    type: 'warning',
                    message: '金额格式为数字，可包含俩位小数！',
                    duration:"2000",
                });
            }
            this.Sacontent[index]['feeLimit'] = value
        },
        salesPage(index){
            let _data ={
                pstype:2,
                pCateId:this.pCateId,
                pCodeOrName:this.pCodeOrName,
                pageNumber:index,
                pageSize:this.pageSize,
            }
            this.$post(this.$host+'/api/performance/product/page',_data).then(d=>{
                if(d.success){
                    let Sacontent=d.data.content
                    Sacontent.map(e=>{e.active = false})
                    this.Satotal = d.data.total
                    this.Sacontent = Sacontent
                }
            })
        },
        CheckBox(val){
            this.Checked = val
        },
        setTotal(){
            this.IsShow = true
        },
        Batch(){
            if(this.Checked.length<1){
                this.$message({
                    type: 'warning',
                    message: '请选择产品!',
                    duration:"1000",
                });
                return
            }
            let ids = [],Batch=''
            this.Checked.map(e=>{ids.push(e.id)})
            this.Toggle==1&&(Batch='server')||this.Toggle==2&&(Batch='sales')
            this.$router.push({path:"/NavDetail/BatchSetResults",query:{Batch:Batch,ids:JSON.stringify(ids)}})
        },
        // checkIsEmpPerc(){
        //     this.isEmpPerc === 0? this.isEmpPerc = 1:this.isEmpPerc = 0
        // },
        // checkMustCareLog(){
        //     this.mustCareLog === 0? this.mustCareLog = 1:this.mustCareLog = 0
        // },
        submit(){
            let _data ={
                daysCtrl:this.daysCtrl,
                isEmpPerc:this.isEmpPerc?1:0,
                mustCareLog:this.mustCareLog?0:1,
            }
            this.$post(this.$host+'/api/performance/cfg/add',_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '保存成功!',
                        duration:"1000",
                    });
                    this.cancel()
                }
            })
        },
        cancel(){
            this.IsShow = false
        },
        Editor(index,item){
            if(this.Toggle==1){
                if(this.content.some(e=>{return(e.active)}))return
                this.perType = item.perType
                this.perPerc = item.perPerc
                this.perFix = item.perFix
                this.perPercDk = item.perPercDk
                this.perFixDk = item.perFixDk
                this.feeLimit = item.feeLimit
                this.content[index].active = true
            }
            if(this.Toggle==2){
                if(this.Sacontent.some(e=>{return(e.active)}))return
                this.perType = item.perType
                this.perPerc = item.perPerc
                this.perFix = item.perFix
                this.feeLimit = item.feeLimit
                this.Sacontent[index].active = true
            }
        },
        revocation(index,item){        
            if(this.Toggle==1){
                this.content[index].perType=this.perType
                this.content[index].perPerc=this.perPerc
                this.content[index].perFix=this.perFix
                this.content[index].perPercDk=this.perPercDk
                this.content[index].perFixDk=this.perFixDk
                this.content[index].feeLimit=this.feeLimit
                this.content[index].active = false
            }
            if(this.Toggle=2){
                this.Sacontent[index].perType=this.perType
                this.Sacontent[index].perPerc=this.perPerc
                this.Sacontent[index].perFix=this.perFix
                this.Sacontent[index].feeLimit=this.feeLimit
                this.Sacontent[index].active = false
            }
        },
        Save(index,item){
            if(this.Toggle==1){
                if(parseInt(item.perType)==0 && (!item.perPerc||!item.perPercDk)){
                    this.$message({
                        type: 'warning',
                        message: '请填写提成百分比',
                        duration:"2000",
                    });
                    return
                }
                if(parseInt(item.perType)==0 && (!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(item.perPerc)||!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(item.perPercDk)||item.perPerc>100||item.perPercDk>100)){
                    this.$message({
                        type: 'warning',
                        message: '百分比格式为一百以内的数字，可包含俩位小数！',
                        duration:"2000",
                    });
                    return
                }
                if(parseInt(item.perType)==1 && (!item.perFix||!item.perFixDk)){
                    this.$message({
                        type: 'warning',
                        message: '请填写提成额',
                        duration:"2000",
                    });
                    return
                }
                if(parseInt(item.perType)==1 && (!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(item.perFix)||!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(item.perFixDk))){
                    this.$message({
                        type: 'warning',
                        message: '提成值格式为数字，可包含俩位小数！',
                        duration:"2000",
                    });
                    return
                }
            }
            if(this.Toggle==2){
                if(parseInt(item.perType)==0&&!item.perPerc){
                    this.$message({
                        type: 'warning',
                        message: '请填写提成百分比',
                        duration:"2000",
                    });
                    return
                }
                if(parseInt(item.perType)==0 && (!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(item.perPerc)||item.perPerc>100)){
                    this.$message({
                        type: 'warning',
                        message: '百分比格式为一百以内的数字，可包含俩位小数！',
                        duration:"2000",
                    });
                    return
                }
                if(parseInt(item.perType)==1 &&!item.perFix){
                    this.$message({
                        type: 'warning',
                        message: '请填写提成额',
                        duration:"2000",
                    });
                    return
                }
                if(parseInt(item.perType)==1 && (!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(item.perFix))){
                    this.$message({
                        type: 'warning',
                        message: '提成值格式为数字，可包含俩位小数！',
                        duration:"2000",
                    });
                    return
                }
            }
            if(!item.feeLimit){
                this.$message({
                    type: 'warning',
                    message: '请填写最低提成金额',
                    duration:"2000",
                });
                return
            }
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(item.feeLimit)){
                this.$message({
                    type: 'warning',
                    message: '金额格式为数字，可包含俩位小数！',
                    duration:"2000",
                });
                return
            }
            let ids = [item.id]
            let _data = {
                ids:ids,
                perType:item.perType,
                feeLimit:item.feeLimit,
            }
            if(this.Toggle==1){
                if(item.perType===0){
                    _data.perPerc=item.perPerc
                    _data.perPercDk=item.perPercDk
                }
                if(item.perType===1){
                    _data.perFix=item.perFix
                    _data.perFixDk=item.perFixDk
                }
            }
            if(this.Toggle==2){
                item.perType===0?_data.perPerc=item.perPerc:_data.perFix=item.perFix
            }
            this.$post(this.$host+'/api/performance/product/set',_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '保存成功！',
                        duration:"1000",
                    });
                    if(this.Toggle==1){
                        this.content[index].active = false
                    }
                    if(this.Toggle==2){
                        this.Sacontent[index].active = false
                    }
                }
            })
        },
    }
}
</script>

<style >
.el-input-number.is-controls-right[class*=mini] [class*=decrease], .el-input-number.is-controls-right[class*=mini] [class*=increase]{
    line-height: 12px;
}
.el-checkbox__label{
    font-size: 12px;
    padding-top: 4px;
}
.SetResultsBox{
    display: inline-block;
    margin:0 1rem 1rem 0;
    position: relative;
}
.SetResultsBtn{
    margin-bottom: 1rem;
}
.SetSelect{
    float: left;
    border: 1px solid #efefef;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.SetSelect.avtive{
    border: 1px solid #2cbcc8;
    color: #2cbcc8;
}
.icongou::before{
    content: "\e650";
    position: absolute;
    font-size: 36px;
    right: -10px;
    bottom: -9px;
}
.SetResultsBtn button{
    margin-right:1rem;
}
.SetResults .tableH{
    margin-bottom: 1rem;
}
.SetResultsAll{
    width: 33.333333rem;
    height: 25rem;
    background: #fff;
    border-radius: 4px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index:1000;
}
.SetResultsHaeder{
    font-size:1.166667rem; 
    margin:0 1.5rem 3rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
    color: #5d717c;
}
.SetResultsAll .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.ResultsAllBox{
    margin-bottom: 1.5rem;
}
.ResultsAllText{
    display: inline-block;
    width: 35%;
    text-align: right;
}
.SetResultsAll .unchecked::before {
   margin-right: .5rem;
}
.ResultsAllBut{
    text-align: center;
}
.ResultsAllBut button:first-child{
    margin-right: 2rem;
}
</style>
