<template>
  <div class="IntegralRule">
        <div class="IntegralRuleTitle"><i class="icon iconsign"></i> 
            <span class="FontWidth">积分奖励规则</span>
            <span class="senior Cursor" @click.stop='Senior'>高级设置>></span>
        </div>
        <div class="clearfix">
            <div class="left IntegralRuleBox">
                <div class="IntegralRuleTitle">新手任务<span class="RuleTableTitle">(每个用户只奖励一次)</span></div>
                    <table class="IntegralRuleTable">
                            <thead>
                                <tr>
                                    <th style="width:20rem">场景</th>
                                    <th style="width:18rem">积分获取规则</th>
                                    <th style="width:12rem">是否开启</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>验证手机</td>
                                    <td>
                                        首次+<Input widths="48px" arguName="checkPhone" :value="pointGain.checkPhone" @sonInput="sonInput" :readonly="!checkPhoneSwitch" :BorderBTm='true'/>积分
                                    </td>
                                    <td>
                                        <el-switch v-model="checkPhoneSwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>关注微信公众号并绑定</td>
                                    <td>
                                        首次+<Input widths="48px" arguName="bindWx" :value="pointGain.bindWx" @sonInput="sonInput" :readonly="!bindWxSwitch" :BorderBTm='true'/>积分
                                    </td>
                                    <td>
                                        <el-switch v-model="bindWxSwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>设置头像</td>
                                    <td>
                                        首次+<Input widths="48px" arguName="setHeader" :value="pointGain.setHeader" @sonInput="sonInput" :readonly="!setHeaderSwitch" :BorderBTm='true'/>积分
                                    </td>
                                    <td>
                                        <el-switch v-model="setHeaderSwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>自主完成在线预约</td>
                                    <td>
                                        首次+<Input widths="48px" arguName="onlineDate" :value="pointGain.onlineDate" @sonInput="sonInput" :readonly="!onlineDateSwitch" :BorderBTm='true'/>积分
                                    </td>
                                    <td>
                                        <el-switch v-model="onlineDateSwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>开卡</td>
                                    <td>
                                        首次+<Input widths="48px" arguName="openCard" :value="pointGain.openCard" @sonInput="sonInput" :readonly="!openCardSwitch" :BorderBTm='true'/>积分
                                    </td>
                                    <td>
                                        <el-switch v-model="openCardSwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                            </tbody>
                    </table>
            </div>
            <div class="left IntegralRuleBox">
                <div class="IntegralRuleTitle">日常任务</div>
                <table class="IntegralRuleTable">
                            <thead>
                                <tr>
                                    <th style="width:20rem">场景</th>
                                    <th style="width:20rem">积分获取规则</th>
                                    <th style="width:20rem">日上限控制</th>
                                    <th style="width:10rem">是否开启</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>预存收款</td>
                                    <td class="RuleTableTxt">
                                        <span >每实收</span>
                                        <Input widths="48px" arguName="receipt0" :value="receipt0" @sonInput="getInput" :readonly="!receiptSwitch" :BorderBTm='true'/>元 +1积分
                                    </td>
                                    <td>
                                        <span class="Cursor MARGIN" @click.stop="Aadio(1)"><i class="icon unradio MargLeft" :class="{'radio':receipt}"></i>不限制</span>
                                        <span class="Cursor " @click.stop="Aadio(2)"><i class="icon unradio MargLeft" :class="{'radio':!receipt}"></i>最高</span>
                                        <Input widths="48px" arguName="receipt1" :value="receipt1" @sonInput="getInput" :readonly="receipt" :BorderBTm='true'/>
                                    </td>
                                    <td>
                                        <el-switch v-model="receiptSwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>点单消费</td>
                                    <td class="RuleTableTxt">
                                        <span >每消费</span>
                                        <Input widths="48px" arguName="consume0" :value="consume0" @sonInput="getInput" :readonly="!consumeSwitch" :BorderBTm='true' />元 +1积分
                                    </td>
                                    <td>
                                        <span class="Cursor MARGIN" @click.stop="Aadio(3)"><i class="icon unradio MargLeft" :class="{'radio':consume}"></i>不限制</span>
                                        <span class="Cursor " @click.stop="Aadio(4)"><i class="icon unradio MargLeft" :class="{'radio':!consume}"></i>最高</span>
                                        <Input widths="48px" arguName="consume1" :value="consume1" @sonInput="getInput" :readonly="consume" :BorderBTm='true'/>
                                    </td>
                                    <td>
                                        <el-switch v-model="consumeSwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>生日当天</td>
                                    <td class="RuleTableTxt">
                                        <span >每次 +</span>
                                        <Input widths="48px" arguName="birthday0" :value="birthday0" @sonInput="sonValue" :readonly="!birthdaySwitch" :BorderBTm='true'/>积分
                                    </td>
                                    <td>
                                        <span class="Cursor MARGIN" @click.stop="Aadio(5)"><i class="icon unradio MargLeft" :class="{'radio':birthday}"></i>不限制</span>
                                        <span class="Cursor " @click.stop="Aadio(6)"><i class="icon unradio MargLeft" :class="{'radio':!birthday}"></i>最高</span>
                                        <Input widths="48px" arguName="birthday1" :value="birthday1" @sonInput="sonValue" :readonly="birthday" :BorderBTm='true'/>
                                    </td>
                                    <td>
                                        <el-switch v-model="birthdaySwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>评价</td>
                                    <td class="RuleTableTxt">
                                        <span >每次 +</span>
                                        <Input widths="48px" arguName="comments0" :value="comments0" @sonInput="sonValue" :readonly="!commentsSwitch" :BorderBTm='true'/>积分
                                    </td>
                                    <td>
                                        <span class="Cursor MARGIN" @click.stop="Aadio(7)"><i class="icon unradio MargLeft" :class="{'radio':comments}"></i>不限制</span>
                                        <span class="Cursor" @click.stop="Aadio(8)"><i class="icon unradio MargLeft" :class="{'radio':!comments}"></i>最高</span>
                                        <Input widths="48px" arguName="comments1" :value="comments1" @sonInput="sonValue" :readonly="comments" :BorderBTm='true'/>
                                    </td>
                                    <td>
                                        <el-switch v-model="commentsSwitch" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>
                                    </td>
                                </tr>
                            </tbody>
                    </table>
            </div>
        </div>
        <div class="IntegralBoxTitle"><i class="icon iconsign"></i> 积分消耗规则</div>       
        <ul class="IntegralBox">
                <li class="Integralelem">
                    <span class="IntegralText">抵扣订单金额：</span>
                    <span class="MarginLeft">
                        <span>每</span>
                        <Input :value="pointConsume.pointDeduction" widths="48px" arguName="pointDeduction" @sonInput="getvalue" :BorderBTm='true'/>
                        <span>积分抵扣1元</span>
                    </span>
                </li>
                <li class="Integralelem">
                    <span class="IntegralText">与优惠券同时使用：</span>
                    <span  class="MarginLeft">
                        <el-switch v-model="pointConsume.pointSynCoupon" :width="width" active-color="#2cbcc8" inactive-color="#DCDFE6"/>                        
                    </span>
                </li>
                <li class="Integralelem">
                    <div class="IntegralText">积分有效期：</div>
                    <div class="MarginLeft">
                        <div class="Cursor Integralelemmargin">
                            <span  @click="Empty(0)" class="Cursor"><i class="icon unradio MargLeft" :class="{'radio':termType==0}"></i>永久有效</span>
                        </div>
                        <div class="Cursor Integralelemmargin">
                            <span @click="Empty(1)" class="Cursor"><i class="icon unradio MargLeft" :class="{'radio':termType==1}"></i>定期清零</span>
                            <span>
                                今年产生的积分，于
                                <Select :SelecttemData="SelecttemData" :SelecttemDetail="['value','key']" arguName="Year" :values="Year" :clearable="false"  @sonSelect="getInput" widths="6rem"/>
                                年底自动清零
                            </span>
                        </div>
                        <!-- <div class="Cursor Integralelemmargin">
                            <span  @click="Empty(2)" class="Cursor"><i class="icon unradio MargLeft" :class="{'radio':termType==2}"></i>滚动清零</span>
                            <span>
                                每笔获得的积分，
                                <Input :value="pointConsume.pointAbsolute" widths="5rem" arguName="pointConsume.pointAbsolute" @sonInput="getvalue" :maxlength="3"/>
                                年后自动清零（暂不支持）
                            </span>
                        </div> -->
                    </div>
                </li>
        </ul>
        <div class="IntegralButton">
                <span class="IntegralBtn"  @click.stop="Submit">保存</span>
        </div>
        <Mtk v-if="IsShow" />
        <div v-if="IsShow"  class="SeniorBox">
            <header class="SeniorBoxHeader">积分规则高级设置<i class="icon Fork Postion" @click.stop="cancel"></i></header>
            <div class="element">
                <span class="Seniorel">积分取整规则：</span>
                <span @click="count(0)" class="Cursor MaginRight"><i class="icon unradio MargLeft" :class="{'radio':pointGain.decimalRule==0}"></i>抹零</span>
                <span @click="count(1)" class="Cursor "> <i class="icon unradio MargLeft" :class="{'radio':pointGain.decimalRule==1}"></i>四舍五入</span>
            </div>
            <div class="element">
                <span class="Seniorel">翻倍数：</span> 
                × <Input :value="pointGain.multipleTimes" widths="46px" arguName="multipleTimes" @sonInput="multiple" :maxlength="5" :blur="multipleblur"/> 倍
                <i class="error" v-show="multipleTimesShow">倍数为大于0的正整数</i>
            </div>
            <div class="element">
                <span class="Seniorel">翻倍期限：</span>
                <el-date-picker v-model="pointGain.multipleDuring"  type="daterange" size='mini' value-format="yyyy-MM-dd"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </div>
            <div class="element elementColor">注：您可以根据活动需要，设置区间的积分翻倍规则</div>
            <div class="SeniorBoxBtn">
                <Button Name="取消" class="None" @click.native="cancel"/>
                <Button Name="确定" @click.native="save"/>
            </div>
        </div>
  </div>
</template>

<script>
import Input from "../../common/Input"
import Button from "../../common/Button"
import Select from '../../common/Select'
import Mtk from '../../common/Mtk'
import DateRange from '../../common/DateRange'
export default {
    components:{Input,Button,Select,Mtk,DateRange},
    data(){
        return{
            width:24,
            pointConsume:{
                pointSynCoupon:false,
            },
            pointGain:{
                decimalRule:0
            },
            checkPhoneSwitch:'',
            bindWxSwitch:'',
            setHeaderSwitch:'',
            onlineDateSwitch:'',
            openCardSwitch:'',

            receipt0:'',
            receipt1:'',
            receipt:true,
            receiptSwitch:'',
            consume0:'',
            consume1:'',     
            consume:true,    
            consumeSwitch:'',
            birthday0:'',
            birthday1:'',    
            birthday:true,                  
            birthdaySwitch:'',
            comments0:'',
            comments1:'',   
            comments:true,                               
            commentsSwitch:'',
            termType:"",//有效期类型
            Year:1,
            SelecttemData:[
                {key:'当',value:1},
                {key:'次',value:2},
                {key:'后',value:3},
            ],
            IsShow:false,
            multipleTimesShow:false,
        }
    },
    mounted(){
        this.$post(this.$host+'/api/cust/confRule/findScoreStratConf',{}).then(d=>{
            if(d.success){
                this.pointConsume = d.data.scoreStrat.pointConsume
                if(d.data.scoreStrat.pointConsume.pointForever){
                    this.termType = 0
                }
                if(d.data.scoreStrat.pointConsume.pointRelative && d.data.scoreStrat.pointConsume.pointRelative.length > 0){
                    this.termType = 1
                    this.Year = parseInt(d.data.scoreStrat.pointConsume.pointRelative[0])
                }
                if(d.data.scoreStrat.pointConsume.pointAbsolute){
                    this.termType = 2
                }
                
                this.pointGain = d.data.scoreStrat.pointGain
                d.data.scoreStrat.pointGain.checkPhone?this.checkPhoneSwitch = true:this.checkPhoneSwitch = false;
                d.data.scoreStrat.pointGain.bindWx?this.bindWxSwitch = true:this.bindWxSwitch = false;
                d.data.scoreStrat.pointGain.setHeader?this.setHeaderSwitch = true:this.setHeaderSwitch = false;
                d.data.scoreStrat.pointGain.onlineDate?this.onlineDateSwitch = true:this.onlineDateSwitch = false;
                d.data.scoreStrat.pointGain.openCard?this.openCardSwitch = true:this.openCardSwitch = false;
                if(d.data.scoreStrat.pointGain.receipt){
                    this.receiptSwitch = true
                    this.receipt0 = d.data.scoreStrat.pointGain.receipt[0]
                    this.receipt1 = d.data.scoreStrat.pointGain.receipt[1]
                    this.receipt1 == 0?(this.receipt1 ='',this.receipt=true):this.receipt=false;
                }else{
                    this.receipt = true
                    this.receiptSwitch = false
                }
                if(d.data.scoreStrat.pointGain.consume){
                    this.consumeSwitch = true
                    this.consume0 = d.data.scoreStrat.pointGain.consume[0]
                    this.consume1 = d.data.scoreStrat.pointGain.consume[1]
                    this.consume1 == 0?(this.consume1='',this.consume=true):this.consume=false;
                }else{
                    this.consume = true
                    this.consumeSwitch = false
                }
                if(d.data.scoreStrat.pointGain.birthday){
                    this.birthdaySwitch = true
                    this.birthday0 = d.data.scoreStrat.pointGain.birthday[0]
                    this.birthday1 = d.data.scoreStrat.pointGain.birthday[1]
                    this.birthday1 == 0?(this.birthday1='',this.birthday=true):this.birthday=false;                    
                }else{
                    this.birthday = true
                    this.birthdaySwitch = false
                }
                if(d.data.scoreStrat.pointGain.comments){
                    this.commentsSwitch = true
                    this.comments0 = d.data.scoreStrat.pointGain.comments[0]
                    this.comments1 = d.data.scoreStrat.pointGain.comments[1]
                    this.comments1 == 0?(this.comments1='',this.comments=true):this.comments=false; 
                }else{
                    this.comments = true
                    this.commentsSwitch = false
                }                              
            }
        })
    },
    methods:{
        multiple(value,arguName){
            this['pointGain'][arguName]=value
        },
        multipleblur(){
            if(!this.pointGain.multipleTimes){
                this.multipleTimesShow=false
                return 
            }
            if(!/^\+?[1-9][0-9]*$/.test(this.pointGain.multipleTimes)){
                this.multipleTimesShow=true
            }else{
                this.multipleTimesShow=false
            }
        },
        sonInput(value,arguName){
            if(!value){
                this['pointGain'][arguName]=''
                return
            }
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '积分格式须为正整数！',
                    duration:"1500",
                });
            }
            this['pointGain'][arguName]=value
        },
        getvalue(value,arguName){
            if(!value){
                this['pointConsume'][arguName]=''
                return
            }
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '积分格式须为正整数！',
                    duration:"1500",
                });
            }
            this['pointConsume'][arguName]=value
        },
        getInput(value,arguName){
            // this[arguName]=value
            if(!value){
                this[arguName]=''
                return
            }
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '金额格式须为正整数！',
                    duration:"1500",
                });
            }
            this[arguName]=value
        },
        sonValue(value,arguName){
            // this[arguName]=value
            if(!value){
                this[arguName]=''
                return
            }
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '积分格式须为正整数！',
                    duration:"1500",
                });
            }
            this[arguName]=value
        },
        count(Num){
            if(Num===0){return this.pointGain.decimalRule = 0}
            if(Num===1){return this.pointGain.decimalRule = 1}
        },
        Empty(Num){
            if(Num===0){return this.termType = 0  ;this.pointConsume.pointForever =1}
            if(Num===1){return this.termType = 1}
            if(Num===2){return this.termType = 2}
        },
        Aadio(Num){
            if(Num == 1 || Num == 2){
                return Num == 1?this.receipt = true:this.receipt = false;
            }
            if(Num == 3 || Num == 4){
                return Num == 3?this.consume = true:this.consume = false;
            }
            if(Num == 5 || Num == 6){
                return Num == 5?this.birthday = true:this.birthday = false;
            }
            if(Num == 7 || Num == 8){
                return Num == 7?this.comments = true:this.comments = false;
            }
        },
        Senior(){
            this.IsShow = true;
        },
        cancel(){
            this.multipleShow=this.IsShow = false;
        },
        save(){
            if(this.multipleShow)return
            this.IsShow = false;
        },
        moneyValue(value){
            if(!/^\+?[1-9][0-9]*$/.test(value)){
                this.$message({
                    type: 'warning',
                    message: '金额格式须为正整数！',
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
                    message: '积分格式须为正整数！',
                    duration:"1500",
                });
                return false
            }else{
                return true
            }
        },
        Submit(){
            let flag=true
            if(!this.integralValue(this.pointConsume.pointDeduction)){
                flag=false
            }
            let _data={
                pointGain:{
                    decimalRule:this.pointGain.decimalRule
                },
                pointConsume:{
                    pointDeduction:this.pointConsume.pointDeduction,
                    pointSynCoupon:this.pointConsume.pointSynCoupon
                }
            }
            if(this.checkPhoneSwitch){
                _data.pointGain.checkPhone = this.pointGain.checkPhone
                if(!this.integralValue(this.pointGain.checkPhone)){
                    flag=false
                }
            }
            if(this.bindWxSwitch){
                _data.pointGain.bindWx = this.pointGain.bindWx
                if(!this.integralValue(this.pointGain.bindWx)){
                    flag=false
                }
            }
            if(this.setHeaderSwitch){
                _data.pointGain.setHeader = this.pointGain.setHeader 
                if(!this.integralValue(this.pointGain.setHeader)){
                    flag=false
                }
            }
            if(this.onlineDateSwitch){
                _data.pointGain.onlineDate = this.pointGain.onlineDate
                if(!this.integralValue(this.pointGain.onlineDate)){
                    flag=false
                }
            }
            if(this.openCardSwitch){
                _data.pointGain.openCard = this.pointGain.openCard
                if(!this.integralValue(this.pointGain.openCard)){
                    flag=false
                }
            }
            if(this.pointGain.multipleTimes){
                _data.pointGain.multipleTimes = this.pointGain.multipleTimes
            }
            if(this.pointGain.multipleDuring){
                _data.pointGain.multipleDuring = this.pointGain.multipleDuring                
            }

            if(this.receiptSwitch){
                _data.pointGain.receipt = new Array
                _data.pointGain.receipt.push(this.receipt0)
                if(!this.moneyValue(this.receipt0)){
                    flag=false
                }
                if(this.receipt){
                    _data.pointGain.receipt.push(0)
                }else{
                    _data.pointGain.receipt.push(this.receipt1)
                    if(!this.moneyValue(this.receipt1)){
                        flag=false
                    }
                }
            }
            if(this.consumeSwitch){
                _data.pointGain.consume = new Array
                _data.pointGain.consume.push(this.consume0)
                if(!this.moneyValue(this.consume0)){
                    flag=false
                }
                // this.consume?_data.pointGain.consume.push(0):_data.pointGain.consume.push(this.consume1)
                if(this.consume){
                    _data.pointGain.consume.push(0)
                }else{
                    _data.pointGain.consume.push(this.consume1)
                    if(!this.moneyValue(this.consume1)){
                        flag=false
                    }
                }
            }
            if(this.birthdaySwitch){
                _data.pointGain.birthday = new Array
                _data.pointGain.birthday.push(this.birthday0)
                if(!this.integralValue(this.birthday0)){
                    flag=false
                }
                // this.birthday?_data.pointGain.birthday.push(0):_data.pointGain.birthday.push(this.birthday1)
                if(this.birthday){
                    _data.pointGain.birthday.push(0)
                }else{
                    _data.pointGain.birthday.push(this.birthday1)
                    if(!this.integralValue(this.birthday1)){
                        flag=false
                    }
                }
            }
            if(this.commentsSwitch){
                _data.pointGain.comments = new Array
                _data.pointGain.comments.push(this.comments0)
                if(!this.integralValue(this.comments0)){
                    flag=false
                }
                // this.comments?_data.pointGain.comments.push(0):_data.pointGain.comments.push(this.comments1)
                if(this.comments){
                    _data.pointGain.comments.push(0)
                }else{
                    _data.pointGain.comments.push(this.comments1)
                    if(!this.integralValue(this.comments1)){
                        flag=false
                    }
                }
            }
            if(this.termType == 0){
                _data.pointConsume.pointForever = 1 
            }
            if(this.termType == 1){
                _data.pointConsume.pointRelative = [this.Year,1]
            }
            if(this.termType == 2){
                _data.pointConsume.pointAbsolute = this.pointConsume.pointAbsolute  
            }
            if(!flag)return
            this.$post(this.$host+"/api/cust/confRule/editConfRule",_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '配置成功!',
                        duration:"1000",
                    });
                }
            })
        }
    }
}
</script>

<style>
.error{
    font-size:1rem;
    color: #f50;
    margin-left: 1rem;
}
.el-switch__core {
    height: 14px!important;
}
 .el-switch__core .el-switch__button {
  top: 0;
  left: 0;
  width: 12px!important;
  height: 12px!important;
}
 .is-checked .el-switch__core .el-switch__button {
  transform: translate3d(10px, 0px, 0px) !important;
}
.IntegralRule .el-switch__core:after{
  top: 0;
  left: 0;
  width: 12px!important;
  height: 12px!important;
}
.el-switch.is-checked .el-switch__core::after{
    margin-left: -12px!important;
}
.IntegralRule .el-range-editor--mini.el-input__inner{
    height: 26px!important;
}
.el-date-editor--daterange.el-input__inner{
    width: 300px!important;
}

.el-date-editor .el-range-separator{
    padding: 0;
}
.Cursor{
    cursor: pointer;
}
.MARGIN{
    margin-right: 1rem;
}
.MargLeft{
    margin-right: .416667rem;
    font-size: 1.166667rem;
}
.iconsign::before {
    content: "\E62D";
    color: #2CBCC8;
}
.IntegralRule{
    height: 100%;
    background: #fff;
}
.IntegralRuleTitle{
    font-size: 1rem;
    color: #2CBCC8;
    margin-bottom:.833333rem;
}
.FontWidth{
    font-weight: 700;
}
.senior{
    margin-left: .5rem;
    font-size: 1rem;
    color: #1DADE2;
}
.RuleTableTitle{
    /* font-size: 1rem; */
    color: #5d717c;
    /* line-height: 1.666667rem; */
    margin-left: .5rem;
}
.IntegralRuleBox:first-child{
    margin-right: 6.666667rem;
}
.IntegralRuleTable{
    height: 3.333333rem;
}
.IntegralRuleTable th,.IntegralRuleTable td{
    border:1px solid#EFEFEF;
    border-collapse:collapse;
    line-height: 3.333333rem;
    text-align: center;
}
.IntegralRuleTable thead{
    background: #FAFAFA;
    font-size: 1.166667rem;
    color: #565656;
}
.IntegralRuleTable tbody{
    font-size: 1rem;
    color: #666666;
}
.IntegralRuleTable .RuleTableTxt{
    text-align: left;
    padding-left: 6%;
}
.IntegralBoxTitle{
    font-size: 1.166667rem;
    color: #2CBCC8;
    margin-bottom:.833333rem;
    margin-top: 3rem;
    font-weight: 700;
}
.IntegralBox{
    border: 1px solid #EFEFEF;
}
.Integralelem{
    border-bottom: 1px solid #EFEFEF;
    display: flex;
}
.Integralelem:last-child{
    border-bottom: none;
}
.IntegralText{
    width: 24.5rem;
    display: inline-block;
    padding: .5rem 0;
    text-align: right;
    border-right: 1px solid #EFEFEF;
    font-size: 1rem;
    color: #565656;
    background: #FAFAFA;
}
.MarginLeft{
    padding: .5rem 1rem;
}
.IntegralButton{
    text-align: center;
    margin:3.333333rem 0;
}
.IntegralBtn{
    display: inline-block;
    width: 64px;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    background: #2cbcc8;
    color: #fff;
}
.Integralelemmargin{
    margin-bottom: 1rem;
}
/* 遮罩层 */
.SeniorBox{
    width: 50rem;
    height: 30rem;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    background: #fff;
    z-index: 1000;
}
.SeniorBoxHeader{
    font-size: 1.166667rem;
    color: #5d717c;
    margin: 0 1.5rem 2.5rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
}
.SeniorBox .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.SeniorBox .element{
    font-size: 1rem;
    color: #666666;
    margin-bottom: 1.5rem;
}
.MaginRight{
    margin-right: 1rem;
}
.SeniorBox .Seniorel{
    width: 30%;
    display: inline-block;
    text-align: right;
}
.SeniorBox .elementColor{
    color: #999;
    text-align: center;
    margin-top: 4rem;
}
.SeniorBoxBtn{
    text-align: center;
}
.SeniorBoxBtn button:first-child{
    margin-right: 2rem;
}
</style>
