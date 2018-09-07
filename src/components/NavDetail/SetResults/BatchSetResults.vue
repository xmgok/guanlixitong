<template>
    <div class="BatchSetResults">
        <div class="BatchSetThead">
            <span class="BatchSetText"><i class="icon iconsign"></i>产品信息</span>
        </div>
        <template>
            <el-table :data="data" border style="width: 100%">
                <el-table-column label="产品编号" prop="psCode" width="200"></el-table-column>
                <el-table-column label="产品名称" prop="psName" width="350"></el-table-column>
                <el-table-column min-width="1" ></el-table-column>
            </el-table>
        </template>
        <div class="BatchSetThead">
            <span class="BatchSetText"><i class="icon iconsign"></i>批量编辑</span>
        </div>
        <ul class="BatchSet">
            <li class="BatchSetBox">
                <div class="resultsText"><i class="icon waring"></i>提成方式：</div>
                <div class="resultsContent">
                    <Select widths="105px" :SelecttemData="SelecttemData" @sonSelect='sonSelect' arguName="perType" :clearable="false" :SelecttemDetail="['perType','perValue']" :values="perType"/> 
                    <i class="error" v-show="perTypeShow">必填</i>                   
                </div>
            </li>
            <li class="BatchSetBox" v-if="$route.query.Batch=='server'">
                <div class="resultsText"><i class="icon waring"></i>点客提成值：</div>
                <div class="resultsContent">
                    <span v-if="perType===0"><Input widths="100px" @sonInput='sonInput' :blur="perPercDkblur" arguName="perPercDk" :value="perPercDk" :maxlength='5'/> %</span>
                    <i class="error" v-show="perPercDkShow">必填</i>
                    <i class="error" v-show="perPercDkDisplay">百分比格式为一百以内的数字，可包含俩位小数！</i>
                    <span v-if="perType===1"><Input widths="100px" @sonInput='sonInput' :blur="perFixDkblur" arguName="perFixDk" :value="perFixDk" :maxlength='20'/> 元</span>
                    <i class="error" v-show="perFixDkShow">必填</i>
                    <i class="error" v-show="perFixDkDisplay">提成值格式为数字可包含俩位小数！</i>
                </div>
            </li>
            <li class="BatchSetBox">
                <div class="resultsText"><i class="icon waring"></i>{{$route.query.Batch=='server'&&'非点客提成值：'||$route.query.Batch=='sales'&&'提成值：'}}</div>
                <div class="resultsContent">
                    <span v-if="perType===0"><Input widths="100px" @sonInput='sonInput' :blur="perPercblur" arguName="perPerc" :value="perPerc" :maxlength='5'/> %</span>
                    <i class="error" v-show="perPercShow">必填</i>
                    <i class="error" v-show="perPercDisplay">百分比格式为一百以内的数字，可包含俩位小数！</i>
                    <span v-if="perType===1"><Input widths="100px" @sonInput='sonInput' :blur="perFixblur" arguName="perFix" :value="perFix" :maxlength='20'/> 元</span>
                    <i class="error" v-show="perFixShow">必填</i>
                    <i class="error" v-show="perFixDisplay">提成值格式为数字可包含俩位小数！</i> 
                </div>              
            </li>
            <li class="BatchSetBox">
                <div class="resultsText"><i class="icon waring"></i>最低提成金额：</div>
                <div class="resultsContent">
                    <span><Input widths="100px" @sonInput='sonInput' :blur="feeLimitblur" arguName="feeLimit" :value="feeLimit" :maxlength='20'/> 元</span>
                    <i class="error" v-show="feeLimitShow">必填</i>
                    <i class="error" v-show="feeLimitDisplay">金额格式为数字可包含俩位小数！</i>
                </div>              
            </li>
        </ul>
        <div class=" TextRight">
            <Button Name='取消' class="None"  @click.native.stop="cancel"/>
            <Button Name='确定' @click.native.stop="Save"/>
        </div>
    </div>
</template>

<script>
import Input from '../../common/Input'
import Select from '../../common/Select'
import Button from '../../common/Button'
import Vue from 'vue'
import {Table} from 'element-ui'
Vue.use(Table)
export default {
    components:{Input,Select,Button},
    data(){
        return{
            data:[],
            SelecttemData:[
                {perType:0,perValue:'百分比'},
                {perType:1,perValue:'固定金额'},
            ],
            perType:'',
            perTypeShow:false,
            perPercDk:'',
            perPercDkShow:false,
            perPercDkDisplay:false,
            perFixDk:'',
            perFixDkShow:false,
            perFixDkDisplay:false,
            perPerc:'',
            perPercShow:false,
            perPercDisplay:false,
            perFix:'',
            perFixShow:false,
            perFixDisplay:false,
            feeLimit:'',
            feeLimitShow:false,
            feeLimitDisplay:false,
        }
    },
    mounted(){
        this.$post(this.$host+'/api/performance/product/selectquery',{ids:JSON.parse(this.$route.query.ids)}).then(d=>{
            if(d.success){
                this.data = d.data
            }
        })
    },
    methods:{
        sonSelect(value,arguName) {
            if(value!==this[arguName]){
                this[arguName] = value;
                this.perPercDkShow = this.perFixDkShow = this.perPercShow = this.perFixShow = this.perPercDkDisplay = this.perFixDkDisplay = this.perPercDisplay = this.perFixDisplay = false
            }
            if(value===""){
                this[arguName+"Show"]=true;
            }else{
                this[arguName+"Show"]=false;
            }
        },
        sonInput(value,arguName){
            this[arguName] = value
        },
        perPercDkblur(){
            if(!this.perPercDk){
                return this.perPercDkShow = true , this.perPercDkDisplay = false
            }
            this.perPercDkDisplay = this.perPercDkShow = false
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(this.perPercDk)||this.perPercDk>100){
                this.perPercDkDisplay = true
                this.perPercDkShow = false
                return
            }
            this.perPercDkDisplay = false
        },
        perFixDkblur(){
            if(!this.perFixDk){
                return this.perFixDkShow = true , this.perFixDkDisplay = false
            }
            this.perFixDkDisplay = this.perFixDkShow = false
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(this.perFixDk)){
                this.perFixDkDisplay = true
                this.perFixDkShow = false
                return
            }
            this.perFixDkDisplay = false
        },
        perPercblur(){
            if(!this.perPerc){
                return this.perPercShow = true , this.perPercDisplay = false
            }
            this.perPercDisplay = this.perPercShow = false
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(this.perPerc)||this.perPerc>100){
                this.perPercDisplay = true
                this.perPercShow = false
                return
            }
            this.perPercDisplay = false
        },
        perFixblur(){
            if(!this.perFix){
                return this.perFixShow = true , this.perFixDisplay = false
            }
            this.perFixDisplay = this.perFixShow = false
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(this.perFix)){
                this.perFixDisplay = true
                this.perFixShow = false
                return
            }
            this.perFixDisplay = false
        },
        feeLimitblur(){
            if(!this.feeLimit){
                return this.feeLimitShow = true , this.feeLimitDisplay = false
            }
            this.feeLimitDisplay = this.feeLimitShow = false
            if(!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(this.feeLimit)){
                this.feeLimitDisplay = true
                this.feeLimitShow = false
                return
            }
            this.feeLimitDisplay = false
        },
        cancel(){
            this.$router.push({path:"/NavDetail/SetResults"})
        },
        Save(){
            let CanNot = true
            if(this.perType===0||this.perType===1){
                this.perTypeShow = false
            }else{
                CanNot = false
                this.perTypeShow = true
            }
            if(this.$route.query.Batch=='server'&&this.perType===0&&!this.perPercDk){
                CanNot = false
                this.perPercDkShow = true
            }else{
                this.perPercDkShow = false
            }
            if(this.$route.query.Batch=='server'&&this.perPercDkDisplay){
                CanNot = false
            }
            if(this.$route.query.Batch=='server'&&this.perType===1&&!this.perFixDk){
                CanNot = false
                this.perFixDkShow = true
            }else{
                this.perFixDkShow = false
            }
            if(this.$route.query.Batch=='server'&&this.perFixDkDisplay){
                CanNot = false
            }
            if(this.perType===0&&!this.perPerc){
                CanNot = false
                this.perPercShow = true
            }else{
                this.perPercShow = false
            }
            if(this.perPercDisplay){
                CanNot = false
            }
            if(this.perType===1&&!this.perFix){
                CanNot = false
                this.perFixShow = true
            }else{
                this.perFixShow = false
            }
            if(this.perFixDisplay){
                CanNot = false
            }
            if(!this.feeLimit){
                CanNot = false
                this.feeLimitShow = true
            }
            if(!CanNot)return
            let _data = {
                ids:JSON.parse(this.$route.query.ids),
                perType:this.perType,
                feeLimit:this.feeLimit,
            }
            if(this.$route.query.Batch=='server'){
                if(this.perType===0){
                    _data.perPercDk=this.perPercDk
                    _data.perPerc=this.perPerc
                }
                if(this.perType===1){
                    _data.perFixDk=this.perFixDk
                    _data.perFix=this.perFix
                }
            }
            if(this.$route.query.Batch=='sales'){
                if(this.perType===0){
                    _data.perPerc=this.perPerc
                }
                if(this.perType===1){
                    _data.perFix=this.perFix
                }
            }
            this.$post(this.$host+'/api/performance/product/set',_data).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '保存成功！',
                        duration:"1000",
                        onClose:()=>{
                            this.cancel()
                        }
                    });
                }
            })
        }
    },
}
</script>

<style>
.iconsign::before {
    content: "\E62D";
    color: #2CBCC8;
}
.error{
    font-size:1rem;
    color: #f50;
    margin-left: 1rem;
}
.BatchSetThead{
    border: 1px solid #EFEFEF;
    border-bottom: none;
    margin-top: 3.333333rem;
    color: #2cbcc8;
}
.BatchSetThead:first-child{
    margin-top: 0;
}
.BatchSetText {
    display: inline-block;
    font-size: 1.166667rem;
    margin: .5rem 1.5rem;
}
.BatchSet{
    border:1px solid #EFEFEF;
}
.BatchSetBox{
    border-bottom: 1px solid #EFEFEF;
    display: flex;
}
.BatchSetBox:last-child{
    border-bottom: none;
}
.BatchSetBox .resultsText{
    width: 20rem;
    background: #FAFAFA;
    padding: 6px 0;
    text-align: right;
    font-size: 1rem;
    color: #666; 
    border-right: 1px solid #EFEFEF;
}
.BatchSetBox .resultsContent{
    padding: .5rem 1rem;
}
.TextRight{
    margin-left: 16rem;
    margin-top: 4rem;
}
.TextRight button:first-child{
    margin-right: 2rem;
}
</style>
