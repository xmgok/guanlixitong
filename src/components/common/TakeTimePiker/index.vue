<template>
        <el-date-picker
      v-model="value2"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      :placeholder="value2?value2:'选择日期时间'" @change="Change"
      :readonly="readonly">
    </el-date-picker>
</template>
<script>
    export default{
        data(){
            return{
                value1:"",
            }
        },
        computed: {
            // value1:function(){
            //     return this.value2||""
            // }
        },
        props:{
            arguName:{
                default:""
            },
            value2:{
                default:""
            },
            readonly:{
                default:false
            }
        },
        methods:{
            Change(e){
                this.$emit("clickTakeTimePiker",e,this.arguName)
            }
        }
    }
</script>
<style scoped>

</style>