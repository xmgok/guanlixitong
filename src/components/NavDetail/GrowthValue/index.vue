<template>
    <div class="GrowthValue">
        <template>
            <el-table :data="data" style="width:100%" border>
                <el-table-column label="规则类型" prop="ruleType" width="150">
                    <template slot-scope="scope">
                        <span> {{(scope.row.ruleType==0&&'收款')||(scope.row.ruleType==1&&'消费')||(scope.row.ruleType==2&&'退款')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规则内容" prop="growValRules" width="800">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.growValRules.ratio" :key="index">
                            {{
                                (scope.row.ruleType==0&&scope.row.growValRules.calType==0&&'累计充值满'+item.moneyVal+'元，赠送'+item.growVal+'成长值；')
                                ||(scope.row.ruleType==0&&scope.row.growValRules.calType==1&&'单次充值满'+item.moneyVal+'元，赠送'+item.growVal+'成长值；')
                                ||(scope.row.ruleType==1&&scope.row.growValRules.calType==0&&'累计消费满'+item.moneyVal+'元，赠送'+item.growVal+'成长值；')
                                ||(scope.row.ruleType==1&&scope.row.growValRules.calType==1&&'单次消费满'+item.moneyVal+'元，赠送'+item.growVal+'成长值；')
                                ||(scope.row.ruleType==2&&scope.row.growValRules.calType==0&&'累计退款满'+item.moneyVal+'元，扣减'+item.growVal+'成长值；')
                            }} 
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="120" fixed="right">
                    <template slot-scope="scope">
                        <Button Name="编辑" class="Btn" @click.native.stop="Modify(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Mtk v-show="IsShow"/>
        <div v-show="IsShow" class="rules">
            <header class="rulesHeader">{{(ruleType===0&&'收款成长值规则')||(ruleType==1&&'消费成长值规则')||(ruleType==2&&'退款成长值规则')}}<i class="icon Fork postion" @click.stop="cancel"></i></header>
            <div class="rulesBox" v-if="ruleType==1">
                <div class="rulesText">总体限制：</div>
                <div class="cursor" @click.stop="CheckBox"><i class="icon MarginRight" :class="cashcouValid==0?'checked':'unchecked'"></i>赠送金额不计入计算</div>
            </div>
            <div class="rulesBox">
                <div class="rulesText">计算方式：</div>
                <div>
                    <Select widths="13.333333rem" :clearable="false" :disabled="ruleType==2" :SelecttemData="calTypes" arguName="calType" :values="calType" :SelecttemDetail="['calType','name']" @sonSelect="sonSelect"/>
                    <Button Name="添加规则"  v-if="calType==1" :iconadd="true" class="Btn" @click.native.stop="Append"/>
                </div>
            </div>
            <div class="rulesBoxContent" v-if="calType==0">
                <div  class="rulesBox" v-for="(item,index) in Base" :key="index">
                    <div class="ContentText">规则：</div>
                    <div>
                        每 <Input :value="item.moneyVal" widths="10rem" :arguName="index" @sonInput="moneyVal" /> 元，{{ruleType==2?'扣减':'赠送'}}
                        <Input :value="item.growVal" widths="10rem" :arguName="index" @sonInput="growVal" /> 成长值
                    </div>
                </div>
            </div>
            <div class="rulesBoxContent" v-if="calType==1">
                <div class="rulesBox" v-for="(item,index) in Single" :key="index">
                    <div class="ContentText">规则{{index+1}}：</div>
                    <div>
                        满 <Input :value="item.moneyVal" widths="10rem" :arguName="index" @sonInput="moneyVal" /> 元，赠送
                        <Input :value="item.growVal" widths="10rem" :arguName="index" @sonInput="growVal" /> 成长值 
                        <i class="icon DeleTe" @click.stop="DeleTe(index,item)"></i> 
                    </div>
                </div>
            </div>
            <div class="rulesButton">
                <Button Name="取消" class="None" @click.native="cancel"/>                    
                <Button Name="确定" @click.native="submit"/>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '../../common/Button'
import Mtk from '../../common/Mtk'
import Select from '../../common/Select'
import Input from '../../common/Input'
export default {
    components:{Button,Mtk,Select,Input},
    data(){
        return{
            data:[],
            IsShow:false,
            Index:'',
            ruleType:'',
            cashcouValid:'',
            calTypes:[
                {name:'累计',calType:'0'},
                {name:'单次',calType:'1'},
            ],
            calType:'',
            operateSign:'',
            Base:[],
            Single:[],
        }
    },
    mounted(){
        this.growval()
    },
    methods:{
        growval(){
            this.$post(this.$host+'/api/cust/growval/queryall',{}).then(d=>{
                if(d.success){
                    let data=d.data
                    data.map(e=>{
                        if(e.growValRules.calType==0){
                            e.growValRules.Base=e.growValRules.ratio
                            e.growValRules.Single=[{
                                moneyVal:'',
                                growVal:'',
                            }]
                        }else if(e.growValRules.calType==1){
                            e.growValRules.Base=[{
                                moneyVal:'',
                                growVal:'',
                            }]
                            e.growValRules.Single=e.growValRules.ratio
                        }
                    })
                    this.data = data
                }
            })
        },
        Modify(index,item){
            this.IsShow=true
            this.Index=index
            this.ruleType=item.ruleType
            this.cashcouValid=item.growValRules.cashcouValid
            this.calType=item.growValRules.calType
            this.operateSign=item.growValRules.operateSign
            this.Base=JSON.parse(JSON.stringify(item.growValRules.Base))
            this.Single=JSON.parse(JSON.stringify(item.growValRules.Single))
        },
        CheckBox(){
            this.cashcouValid===0?this.cashcouValid=1:this.cashcouValid=0
        },
        sonSelect(value,arguName){
                this[arguName]=value;
        },
        moneyVal(value,index){
            if(this.calType==0){
                this.Base[index].moneyVal=value                
            }else{            
                this.Single[index].moneyVal=value                                
            }
            if(value&&!/^([1-9]\d{0,9})$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '金额为大于0的整数！',
                    duration:"1200",
                });
            }
        },
        growVal(value,index){
            if(this.calType==0){           
                this.Base[index].growVal=value                
            }else{              
                this.Single[index].growVal=value                
            }
            if(value&&!/^([1-9]\d{0,9})$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '成长值为大于0的整数！',
                    duration:"1200",
                });
            }
        },
        DeleTe(index,item){
            this.Single.splice(index,1)
        },
        Append(){
            if(this.Single.some(e=>{return e.moneyVal==''&&e.growVal==''}))return
            this.Single.push({moneyVal:'', growVal:'',})
        },
        cancel(){
            this.IsShow=false
        },
        submit(){
            let _data ={
                ruleType:this.ruleType,
                growValRules:{calType:this.calType}
            }
            if(this.ruleType==1){
                _data.growValRules.cashcouValid=this.cashcouValid            
            }
            if(this.calType==0){
                let moneyVal=this.Base[0].moneyVal
                let growVal=this.Base[0].growVal
                if(moneyVal==''&&growVal=='')return
                if(!/^([1-9]\d{0,9})$/.test(moneyVal)){
                    this.$message({
                        type: 'warning',
                        message: '金额为大于0的整数！',
                        duration:"1200",
                    });
                    return
                }
                if(!/^([1-9]\d{0,9})$/.test(growVal)){
                    this.$message({
                        type: 'warning',
                        message: '成长值为大于0的整数！',
                        duration:"1200",
                    });
                    return
                }
                _data.growValRules.ratio=this.Base            
            }
            if(this.calType==1){
                if(this.Single.some(e=>{return e.moneyVal==''&&e.growVal==''})){
                    this.Single.splice(this.Single.length-1,1)
                } 
                for(let len=this.Single.length,i=0;i<len;i++){
                    if(!/^([1-9]\d{0,9})$/.test(this.Single[i].moneyVal)){
                        this.$message({
                            type: 'warning',
                            message: '金额为大于0的整数！',
                            duration:"1200",
                        });
                        return
                    }
                    if(!/^([1-9]\d{0,9})$/.test(this.Single[i].growVal)){
                        this.$message({
                            type: 'warning',
                            message: '成长值为大于0的整数！',
                            duration:"1200",
                        });
                        return
                    }
                }
                _data.growValRules.ratio=this.Single            
            }
            this.$post(this.$host+'/api/cust/growval/update',_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '修改成功!',
                        duration:"1200",
                    });
                    if(this.calType==0){
                        this.data[this.Index].growValRules.Base=_data.growValRules.ratio   
                        this.data[this.Index].growValRules.calType='0'                                              
                    }
                     if(this.calType==1){
                        this.data[this.Index].growValRules.Single=_data.growValRules.ratio 
                        this.data[this.Index].growValRules.calType='1'                                                 
                    }
                    this.data[this.Index].growValRules.ratio=_data.growValRules.ratio  
                    this.cancel()
                }
            })
        }
    }
}
</script>

<style>
.rules{
    width: 50rem;
    height: 33.333333rem;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    z-index: 1000;
    border-radius: .333333rem;
}
.rulesHeader{
    font-size:1.166667rem; 
    margin:0 1.5rem 2rem 1.5rem;
    padding:1.333333rem 0 .833333rem 0;
    border-bottom:solid 1px #efefef;
    color: #5d717c;
}
.rulesHeader .postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.rulesBox{
    display: flex;
    margin-bottom: 1rem;
}
.rulesText{
    width: 20%;
    text-align: right;
    font-size: 1rem;
    color: #666;
}
.rulesBoxContent{
    height: 15rem;
    width: 80%;
    overflow: auto;
    border:1px solid #efefef;
    padding: 1rem 0;
    margin:0 auto;
}
.ContentText{
    width: 13%;
    text-align: right;
    font-size: 1rem;
    color: #666;
}
.cursor{
    cursor: pointer;
}
.MarginRight::before{
    margin-right: .5rem;
}
.GrowthValue .DeleTe::before{
    font-size: 1.166667rem;
}
.rulesButton{
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 2.333333rem;
}
.rulesButton button:first-child{
    margin-right: 2rem;
}
</style>
