<template>
        <el-time-picker
        v-model="value2"
        value-format="HH-mm-ss"
        placeholder="任意时间点" @change="Change">
      </el-time-picker>
</template>
<script>
    import {TimePicker} from "element-ui";
    import Vue from "vue"
    Vue.use(TimePicker)
    export default{
        components: {
            TimePicker
        },
        data(){
            return{
                value2: this.values,
            }
        },
        props:{
            arguName:{
                default:""
            },
            values:{
                default:"",
            }
        },
        methods:{
            Change(e){
                this.$emit("clickTimePiker",e,this.arguName)
            }
        }
    }
</script>
<style scoped>

</style>