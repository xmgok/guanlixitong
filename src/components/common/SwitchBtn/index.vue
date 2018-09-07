<template>
  <el-switch
    v-model="values"
    active-color="#4DB0E8"
    inactive-color="#aaa"  @change="Change">
</el-switch>
</template>

<script>
import Vue from "vue";
import {Switch} from "element-ui"
Vue.use(Switch);
export default {
    props:{
        values:{
            default:"",
        },
        arguName:{
            default:"",
        }
    },
    methods:{
        Change(){
            this.$emit("switchBtn",this.values,this.arguName)
        }
    }
}
</script>

<style>

</style>
