<template>
        <div class="Selectcascader" >
            <el-cascader
                :options="SelecttemData"
                :props="props"
                change-on-select
                clearable
                :disabled="disabled"
                @change="Change"
            ></el-cascader>
        </div>
    </template>
    <script>
        import {Cascader} from "element-ui";
        import Vue from "vue";
        Vue.use(Cascader);
        export default{
            data(){
                return{
                   
                }
            },
            props: {
                arguName:{
                    default:""
                },
                SelecttemData:{
                    type:Array,
                    default:()=>{
                        return[]
                    }
                },
                props:{
                    type:Object,
                    default:()=>{
                        return{}
                    }
                },
                disabled:{
                    default:false
                }
            },
            methods:{
                Change(e){
                    let id=e[e.length-1];
                    this.$emit("sonProductSelect",id,this.arguName)
                },
            },
        }
    </script>
    <style >
        .Selectcascader{
            display: inline-block;
        }
    .Selectcascader .el-cascader{
        width: 160px;
        font-size: 12px;
        line-height: 26px;
    }
     .el-cascader-menu__item{
        font-size: 1rem;
    }
    
    </style>