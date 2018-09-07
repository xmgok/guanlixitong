<template>
    <div class="NewGrade">
        <ul class="NewGradeForm">
            <li class="NewBox">
                <div class="NewBoxText"><i class="icon waring"></i>等级名称：</div>
                <div class="NewGradeInput">
                    <Input :value="levName" widths="13.333333rem" arguName="levName" @sonInput="sonInput"  :blur="levNameblur"/>
                    <i class="error" v-show="levNameShow">必填</i>                      
                </div>  
            </li>
            <li class="NewBox">
                <div class="NewBoxText"><i class="icon waring"></i>生效条件：</div>
                <div class="NewGradeInput">
                    <span class="Textsum">成长值 ≥</span>
                    <Input :value="lvlChangeValue" widths="13.333333rem" arguName="lvlChangeValue" @sonInput="sonInput" RMBColor='true' :blur="lvlChangeValueblur"/>
                    <i class="error" v-show="lvlChangeValueShow">必填</i> 
                    <i class="error" v-show="lvlChangeValueDisplay">成长值须为数字不能包含小数</i>     
                </div>
            </li>
            <li class="NewBox">
                <div class="NewBoxText"><i class="icon waring"></i>默认折扣率：</div>
                <div class="NewGradeInput">
                    <Input :value="discountRate" widths="13.333333rem" arguName="discountRate" @sonInput="sonInput" :maxlength='3' :blur="discountRateblur"/> %    
                    <i class="error" v-show="discountRateShow">必填</i>                    
                    <i class="error" v-show="discountRateDisplay">折扣率格式为大于0小于等于100的正数</i>                    
                </div>
            </li>
            <li class="NewBox">
                <div class="NewBoxText"><i class="icon waring"></i>有效期：</div>
                <div class="NewGradeInput">
                    <Select :SelecttemData="validity" arguName="isPerpetual" :values="isPerpetual" :SelecttemDetail="['isPerpetual','name']" @sonSelect="sonInput" widths="13.333333rem" :clearable="false"/>
                    <div v-if="isPerpetual==1" class="validity">
                        <Input :value="usefulTime" widths="10rem" arguName="usefulTime" @sonInput="sonInput" :blur="usefulTimeblur"/><span class="month">个月</span>
                    </div>
                    <i class="error" v-show="usefulTimeShow">必填</i>
                    <i class="error" v-show="usefulTimeDisplay">月份须为整数</i>
                </div>
            </li>
            <li class="NewBox" v-if="isPerpetual==1">
                <div class="NewBoxText">有效期顺延：</div>          
                <div class="NewGradeInput">
                    <div class="NewGradeBox">
                        满足以下
                        <div class="validity">
                            <Select :SelecttemData="AnyAll" arguName="continueType" :values="continueType" :SelecttemDetail="['continueType','name']" @sonSelect="sonSelect" widths="10rem" />
                        </div>
                        条件则有效期顺延 
                        <div class="validity">
                            <Input :value="continueMonth" widths="10rem" arguName="continueMonth" @sonInput="sonInput" :blur="continueMonthblur"/><span class="month">个月</span>
                        </div>
                        <i class="error" v-show="continueMonthShow">必填</i>
                        <i class="error" v-show="continueMonthDisplay">月份须为整数</i>
                    </div>
                    <div class="NewGradeBox">
                        <i class="icon unchecked FontLeft" :class="{checked:needAmontCheck}" @click.stop="onCheck('needAmontCheck')"></i>
                        当前账户可用余额（不含赠金）≥ 
                        <div class="validity">
                            <Input :value="needAmont" widths="10rem" arguName="needAmont" @sonInput="sonInput" :blur="needAmontblur"/><span class="month">元</span>
                        </div>
                        <i class="error" v-show="needAmontShow">必填</i>
                        <i class="error" v-show="needAmontDisplay">金额须为可包含俩位小数的数字</i>
                    </div>
                    <div class="NewGradeBox">
                        <i class="icon unchecked FontLeft" :class="{checked:needPointCheck}" @click.stop="onCheck('needPointCheck')"></i>
                        当前账户可用积分 ≥
                        <div class="validity">
                            <Input :value="needPoint" widths="10rem" arguName="needPoint" @sonInput="sonInput" :blur="needPointblur"/><span class="month">点</span>
                        </div>
                        <i class="error" v-show="needPointShow">必填</i>
                        <i class="error" v-show="needPointDisplay">积分点数须为大于0的整数</i>
                    </div>
                    <div class="NewGradeBox">
                        <i class="icon unchecked FontLeft" :class="{checked:needDealTypeCheck}" @click.stop="onCheck('needDealTypeCheck')"></i>
                        期间有效
                        <div class="validity">
                            <Select :SelecttemData="needDealTypeArr" arguName="needDealType" :values="needDealType" :SelecttemDetail="['needDealType','name']" @sonSelect="sonInput" widths="10rem" :clearable="false"/>                            
                        </div>
                        天数 ≥
                        <div class="validity">
                            <Input :value="needDealDays" widths="10rem" arguName="needDealDays" @sonInput="sonInput" :blur="needDealDaysblur"/><span class="month">天</span>
                        </div>
                        <i class="error" v-show="needDealDaysShow">必填</i>
                        <i class="error" v-show="needDealDaysDisplay">天数为大于0的整数</i>
                    </div>
                </div>
            </li>
            <li class="NewBox" v-if="isPerpetual==1">
                <div class="NewBoxText"><i class="icon waring"></i>到期后扣减成长值：</div>          
                <div class="NewGradeInput">
                    <Input :value="dueReduceValue" widths="13.333333rem" arguName="dueReduceValue" @sonInput="sonInput" :blur="dueReduceValueblur"/>
                    <i class="error" v-show="dueReduceValueShow">必填</i>
                    <i class="error" v-show="dueReduceValueDisplay">成长值须为数字不能包含小数</i>
                    <span class="remark">注：成长值扣除后将根据剩余成长值重新计算等级，如当前成长值不足以扣减，则扣减至0</span>
                </div>
            </li>
            <li class="NewBox clearfix">
                <div class="NewBoxText">备注：</div>
                <div class="NewGradeInput">
                    <Textarea :values="levMemo"  @sonTextarea="sonInput" arguName="levMemo" minRows="3" maxRows="5" widths="30rem"/>                    
                </div>
            </li>
        </ul>
        <div><span  class="senior cursor" @click.stop="senior">高级设置>></span></div>        
        <div class="NewBoxBtn">
            <Button Name="取消" class="None" @click.native="Return"/>
            <Button Name="确认" @click.native="Submit"/>
        </div>
        <Mtk v-show="IsShow" />
        <div v-show="IsShow" class="seniorContent">
            <header class="NewGradTitle">会员高级等级设置<i class="icon Fork cancel" @click.stop="Cancel"></i></header>
            <div class="NewGradBox">
                <span class="NewGradText">
                    <i class="FontLeft icon unchecked" :class="{'checked':limenValueShow}"  @click="onCheck('limenValueShow')"></i>
                    <span class="">可缴款时最高余额</span>
                </span>
                <Input :value="limenValue"  widths="13.333333rem" arguName="limenValue" @sonInput="getInput" :readonly="!limenValueShow"/>
            </div>
            <div class="NewGradBox">
                <span class="NewGradText">
                    <i class="FontLeft icon unchecked" :class="{'checked':monthPayCeilShow}"  @click="onCheck('monthPayCeilShow')"></i>
                    <span class="">月缴款金额上限</span>
                </span>
                <Input :value="monthPayCeil"  widths="13.333333rem" arguName="monthPayCeil" @sonInput="getInput" :readonly="!monthPayCeilShow"/>                           
            </div>
            <div class="NewGradBox">
                <span class="NewGradText">
                    <i class="FontLeft icon unchecked" :class="{'checked':monthConsumeCeilShow}" @click="onCheck('monthConsumeCeilShow')"></i>
                    <span class="">月消费金额上限</span>
                </span>
                <Input :value="monthConsumeCeil"  widths="13.333333rem" arguName="monthConsumeCeil" @sonInput="getInput" :readonly="!monthConsumeCeilShow"/>                           
            </div>
            <div class="NewGradBox">
                <span class="NewGradText">
                    <i class="FontLeft icon unchecked" :class="{'checked':dayUseCiCeilShow}" @click="onCheck('dayUseCiCeilShow')"></i>
                    <span class="">日消费次数上限</span>
                </span>
                <Input :value="dayUseCiCeil"  widths="13.333333rem" arguName="dayUseCiCeil" @sonInput="sonValue" :readonly="!dayUseCiCeilShow"/>                           
            </div>
            <div class="NewGradeBtn">
                <Button Name="取消" class="None" @click.native="Cancel"/>
                <Button Name="确认" @click.native="Confirm"/>
            </div>
        </div>
    </div>
</template>

<script>
import Input from "../../common/Input"
import Button from "../../common/Button"
import Select from '../../common/Select'
import Textarea from '../../common/Textarea'
import Mtk from '../../common/Mtk'
export default {
    components:{Input,Button,Select,Textarea,Mtk},
    data(){
        return{
            levName:"",
            levNameShow:false,
            lvlChangeValue:"",
            lvlChangeValueShow:false,
            lvlChangeValueDisplay:false,
            endPoint:"",
            discountRate:"",
            discountRateShow:false,
            discountRateDisplay:false,
            validity:[
                {name:'永久有效',isPerpetual:0},
                {name:'升降级后',isPerpetual:1},
            ],
            isPerpetual:0,//有效期类型
            usefulTime:'',//有效期月
            usefulTimeShow:false,
            usefulTimeDisplay:false,
            AnyAll:[
                {name:'全部',continueType:0},
                {name:'任意',continueType:1},
            ],
            continueType:'',//满足条件
            continueMonth:'',//等级顺延几个月
            continueMonthShow:false,
            continueMonthDisplay:false,
            needAmont:'', //账户可用余额
            needAmontShow:false,
            needAmontDisplay:false,
            needAmontCheck:false,
            needPoint:'', //账户可用积分
            needPointShow:false,
            needPointDisplay:false,
            needPointCheck:false,
            needDealTypeArr:[
                {name:'充值',needDealType:0},
                {name:'消费',needDealType:1},
                {name:'开卡',needDealType:2},
            ],
            needDealType:'',
            needDealTypeCheck:false,
            needDealDays:'',
            needDealDaysShow:false,
            needDealDaysDisplay:false,
            dueReduceValue:'',//到期扣减成长值
            dueReduceValueShow:false,
            dueReduceValueDisplay:false,
            limenValue:"",
            monthPayCeil:"",
            monthConsumeCeil:"",
            dayUseCiCeil:"",
            levMemo:"",
            IsShow:false,
            limenValueShow:false,
            monthPayCeilShow:false,
            monthConsumeCeilShow:false,
            dayUseCiCeilShow:false,
        }
    },
    methods:{
        levNameblur(){
            if(!this.levName){
                this.levNameShow = true
            }else{
                this.levNameShow = false                
            }
        },
        lvlChangeValueblur(){
            if(!this.lvlChangeValue){
                this.lvlChangeValueShow = true
                this.lvlChangeValueDisplay = false
                return
            }
            this.lvlChangeValueShow = false  
            if(!/^([1-9]\d{0,9})$/.test(this.lvlChangeValue)){
                this.lvlChangeValueDisplay = true
                return
            }
            this.lvlChangeValueDisplay = false   
        },
        discountRateblur(){
            if(!this.discountRate){
                this.discountRateShow = true
                this.discountRateDisplay = false
                return           
            }
            this.discountRateShow = false   
            if(!/^100$|^[1-9][0-9]?$/.test(this.discountRate)){
                this.discountRateDisplay = true                            
            }else{
                this.discountRateDisplay = false                            
            }
        },
        usefulTimeblur(){
            if(this.isPerpetual==1&&!this.usefulTime){
               this.usefulTimeShow = true
                this.usefulTimeDisplay = false
                return           
            }
            this.usefulTimeShow = false   
            if(this.isPerpetual==1&&!/^([1-9]\d{0,9})$/.test(this.usefulTime)){
                this.usefulTimeDisplay = true                            
            }else{
                this.usefulTimeDisplay = false                            
            }
        },
        continueMonthblur(){
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&!this.continueMonth){
                this.continueMonthShow = true
                this.continueMonthDisplay = false
                return           
            }
            this.continueMonthShow = false   
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&!/^([1-9]\d{0,9})$/.test(this.continueMonth)){
                this.continueMonthDisplay = true                            
            }else{
                this.continueMonthDisplay = false                            
            }
        },
        needAmontblur(){//可用余额
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needAmontCheck&&!this.needAmont){
                this.needAmontShow = true
                this.needAmontDisplay = false
                return           
            }else{
                this.needAmontShow = false                   
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needAmontCheck&&!/^\d+(?:\.\d{1,2})?$/.test(this.needAmont)){
                this.needAmontDisplay = true                            
            }else{
                this.needAmontDisplay = false                            
            }
        },
        needPointblur(){//可用积分
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needPointCheck&&!this.needPoint){
                this.needPointShow = true
                this.needPointDisplay = false
                return           
            }else{
                this.needPointShow = false                   
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needPointCheck&&!/^([1-9]\d{0,9})$/.test(this.needPoint)){
                this.needPointDisplay = true                            
            }else{
                this.needPointDisplay = false                            
            }
        },
        needDealDaysblur(){ //有效天数
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needDealTypeCheck&&!this.needDealDays){
                this.needDealDaysShow = true
                this.needDealDaysDisplay = false
                return           
            }else{
                this.needDealDaysShow = false                
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needDealTypeCheck&&!/^([1-9]\d{0,9})$/.test(this.needDealDays)){
                this.needDealDaysDisplay = true
            }else{
                this.needDealDaysDisplay = false                            
            }
        },
        dueReduceValueblur(){
            if(!this.dueReduceValue){
                this.dueReduceValueShow = true
                this.dueReduceValueDisplay = false
                return
            }
            this.dueReduceValueShow = false  
            if(!/^([1-9]\d{0,9})$/.test(this.dueReduceValue)){
                this.dueReduceValueDisplay = true
                return
            }
            this.dueReduceValueDisplay = false
        },
        getInput(value,arguName){
            if(!value){
                this[arguName]=''
                return
            }
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '金额格式须为大于0的正整数！',
                    duration:"1500",
                });
            }
            this[arguName]=value
        },
        sonValue(value,arguName){
            if(!value){
                this[arguName]=''
                return
            }
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '消费次数格式须为大于0的正整数！',
                    duration:"1500",
                });
            }
            this[arguName]=value
        },
        sonInput(value,arguName){
            this[arguName]=value
        },
        sonSelect(value,arguName){
            this[arguName]=value
            if(value===''||value==1){
                this.needAmontCheck = this.needPointCheck = this.needDealTypeCheck = false
            }else{
                this.needAmontCheck = this.needPointCheck = this.needDealTypeCheck = true
            }
        },
        moneyValue(value){
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '金额格式须为大于0的正整数！',
                    duration:"1500",
                });
                return false
            }else{
                return true
            }
        },
        integralValue(value){
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '消费次数格式须为大于0的正整数！',
                    duration:"1500",
                });
                return false
            }else{
                return true
            }
        },
        Confirm(){
            let flag=true
            if(this.limenValueShow&&!this.moneyValue(this.limenValue)){
                flag=false
            }
            if(!this.limenValueShow){
                this.limenValue=""
            }
            if(this.monthPayCeilShow&&!this.moneyValue(this.monthPayCeil)){
                flag=false
            }
            if(!this.monthPayCeilShow){
                this.monthPayCeil=""
            }
            if(this.monthConsumeCeilShow&&!this.moneyValue(this.monthConsumeCeil)){
                flag=false
            }
            if(!this.monthConsumeCeilShow){
                this.monthConsumeCeil=""
            }
            if(this.dayUseCiCeilShow&&!this.integralValue(this.dayUseCiCeil)){
                flag=false
            }
            if(!this.dayUseCiCeilShow){
                this.dayUseCiCeil=""
            }
            if(!flag)return
            this.IsShow = false;
        },
        Cancel(){
            this.IsShow = false;
            this.limenValue=""
            this.monthPayCeil=""
            this.monthConsumeCeil=""
            this.dayUseCiCeil=""
        },
        onCheck(state){
            this[state] = !this[state]
        },
        senior(){
            this.IsShow = true;
        },
        Submit(){
            let CanNot = true;//能提交
            if(!this.levName){
                CanNot = false
                this.levNameShow = true
            }
            if(!this.lvlChangeValue){
                CanNot = false
                this.lvlChangeValueShow = true
            }
            if(this.lvlChangeValueDisplay){
                CanNot = false
            }
            if(!this.discountRate){
                CanNot = false
                this.discountRateShow = true
            }
            if(this.discountRateDisplay){
                CanNot = false
            }
            if(this.isPerpetual==1&&!this.usefulTime){
                CanNot = false
                this.usefulTimeShow = true
            }
            if(this.isPerpetual==1&&this.usefulTimeDisplay){
                CanNot = false
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&!this.continueMonth){
                CanNot = false
                this.continueMonthShow = true
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.continueMonthDisplay){
                CanNot = false
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needAmontCheck&&!this.needAmont){ //可用余额
                CanNot = false
                this.needAmontShow = true
            }else{
                this.needAmontShow = false
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needAmontCheck&&this.needAmontDisplay){ //可用余额
                CanNot = false
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needPointCheck&&!this.needPoint){//可用积分
                CanNot = false
                this.needPointShow = true
            }else{
                this.needPointShow = false
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needPointCheck&&this.needPointDisplay){// 可用积分
                CanNot = false
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needDealTypeCheck&&this.needDealType===''){ //有效类型
                this.$message({
                    type: 'warning',
                    message: '请选择期间有效类型！',
                    duration:"1500",
                });
                return
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needDealTypeCheck&&!this.needDealDays){//有效天数
                CanNot = false
                this.needDealDaysShow = true
            }else{
                this.needDealDaysShow = false
            }
            if(this.isPerpetual==1&&(this.continueType===0||this.continueType===1)&&this.needDealTypeCheck&&this.needDealDaysDisplay){//有效天数
                CanNot = false
            }
            if(this.isPerpetual==1&&this.continueType===1&&!this.needAmontCheck&&!this.needPointCheck&&!this.needDealTypeCheck){
                this.$message({
                    type: 'warning',
                    message: '至少勾选一种延顺条件！',
                    duration:"1500",
                });
                return
            }
            if(this.isPerpetual==1&&!this.dueReduceValue){
                CanNot = false
                this.dueReduceValueShow = true
            }
            if(this.isPerpetual==1&&this.dueReduceValueDisplay){
                CanNot = false
            }
            if(!CanNot)return
            let _data = {
                levName:this.levName,//等级名称
                lvlChangeValue:this.lvlChangeValue,//成长值 
                discountRate:this.discountRate,//折扣率
                isPerpetual:this.isPerpetual,//有效期类型
                levMemo:this.levMemo,//备注
            }
            if(this.isPerpetual==1){
                _data.usefulTime = this.usefulTime //等级有效期 时间(月)
                _data.dueReduceValue = this.dueReduceValue //到期扣减成长值
            }
            if(this.isPerpetual==1&&this.continueType===0){
                _data.continueType = this.continueType 
                _data.continueMonth = this.continueMonth 
                _data.needAmont = this.needAmont 
                _data.needPoint = this.needPoint 
                _data.needDealType = this.needDealType 
                _data.needDealDays = this.needDealDays 
            }
            if(this.isPerpetual==1&&this.continueType===1&&this.needAmontCheck){
                _data.continueType = this.continueType 
                _data.continueMonth = this.continueMonth
                _data.needAmont = this.needAmont 
            }
            if(this.isPerpetual==1&&this.continueType===1&&this.needPointCheck){
                _data.continueType = this.continueType 
                _data.continueMonth = this.continueMonth
                _data.needPoint = this.needPoint 
            }
            if(this.isPerpetual==1&&this.continueType===1&&this.needDealTypeCheck){
                _data.continueType = this.continueType 
                _data.continueMonth = this.continueMonth
                _data.needDealType = this.needDealType
                _data.needDealDays = this.needDealDays
            }
            if(this.limenValueShow){
                _data.limenValue = this.limenValue
            }
            if(this.monthPayCeilShow){
                _data.monthPayCeil = this.monthPayCeil
            }
            if(this.monthConsumeCeilShow){
                _data.monthConsumeCeil = this.monthConsumeCeil
            }
            if(this.dayUseCiCeilShow){
                _data.dayUseCiCeil = this.dayUseCiCeil
            }
            this.$post(this.$host+"/api/cust/lev/add",_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '添加成功!',
                        duration:"1000",
                        onClose:()=>{
                            this.Return()
                        }
                    });
                }
            })
        },
        Return(){
            this.$router.push({ path:"/NavDetail/CustomerExpand"}) 
        },
    }
}
</script>

<style scoped>
.error{
  font-size:1rem;
  color: #f50;
  margin-left: 1rem;
}
.NewGrade .FontLeft::before{
  margin-right: .5rem;
}
.NewGradeForm{
    border:1px solid #EFEFEF;
}
.NewBox{
    border-bottom: 1px solid #EFEFEF;
    display: flex;
}
.NewBox:last-child{
    border-bottom:none;
}
.NewBoxText{
    width: 20rem;
    background: #FAFAFA;    
    padding: 6px 0;
    text-align:right;
    font-size: 1rem;
    border-right: 1px solid #EFEFEF;
}
.NewGradeInput{
    padding: .5rem 1rem;
}
.Textsum{
    font-size: 1rem; 
    color: #2cbcc8;
}
.validity{
    display: inline-block;
    position: relative;
    margin-left: 1rem;
    margin-right: 1rem;
}
.month{
    display: inline-block;    
    position: absolute;
    right: 1px;
    top: 2px;
    width: 2.5rem;
    height: 2rem;
    background: #fafafa;
    text-align: center;
    border-left: solid 1px #dcdfe6;
}
.NewGrade .remark{
    color: #ccc;
    margin-left: 1rem;
}
.NewGradeBox{
    margin-bottom: 1rem;
}
.NewGradeBox:last-child{
    margin-bottom: 0;
}
.NewGrade .cursor{
    font-size: 1rem;
    color: #1dade2;
    cursor: pointer;
}
.NewGrade .senior{
    display: inline-block;
    margin:1rem 0;
}
.NewBoxBtn{
    margin-top: 2rem;
    margin-left: 16rem;
}
.NewBoxBtn button:first-child{
    margin-right: 3rem;
}

.NewGrade .seniorContent{
    width: 33.333333rem;
    height: 29.166667rem;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    z-index: 1000;
}
.NewGradTitle {
    color: #5d717c;
    font-size: 1.166667rem;
    margin: 0 1.5rem 2.5rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
}
.NewGrade .cancel{
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    cursor: pointer;
}
.seniorContent .NewGradBox{
    margin-top: 1.5rem;
}
.seniorContent .NewGradText{
    display: inline-block;
    width: 45%;
    padding-left: 4rem;
    cursor: pointer;
}
.seniorContent .NewGradeBtn{
    text-align: center;
    margin-top: 3.333333rem;
}
.seniorContent .NewGradeBtn button:first-child{
    margin-right: 2rem;
}
</style>
