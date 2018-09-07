<template>
        <el-date-picker
        v-model="value"
        type="date"
        size="mini"
        value-format="yyyy-MM-dd"
        :clearable="clearable"
        placeholder="选择日期" @change="Change">
      </el-date-picker>
</template>
<script>
    import {DatePicker} from "element-ui";
    import Vue from "vue"
    Vue.use(DatePicker)
    export default{
        components: {
            DatePicker
        },
        data(){
            return{
                value: this.values,
            }
        },
        props:{
            arguName:{
                default:""
            },
            values:{
                default:""
            },
            clearable:{
                default:true
            }
        },
        methods:{
            Change(e){
                this.$emit("clickDatePiker",e,this.arguName)
            }
        }
    }
</script>
<style>
.el-input__icon{
    line-height: 30px;
}
</style>