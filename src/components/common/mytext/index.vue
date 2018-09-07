<template>
        <div class="Textarea" :style="{width:widths}">
                <el-input
                type="textarea"
                :autosize="{ minRows:minRows,maxRows:maxRows}"
                :maxlength="100"
                placeholder="请输入内容"
                :readonly="readonlys"
                @blur="blur"
                :value="value" @input="value = arguments[0]">
              </el-input>
        </div>
</template>
<script>
    import {Input} from "element-ui";
    import Vue from "vue";
    Vue.use(Input);
    export default{
        data(){
            return{
                textarea:"",
            }
        },
        props:{
            widths:{},
            minRows:{
                default:2
            },
            maxRows:{
                default:4
            },
            arguName:{
                default:""
            },
            value:{
                default:""
            },
            placeholder:{
                default:"请输入内容"
            },
            readonlys:{
                default: false
            },
            blur:{
                type:Function,
                default:()=>{}
            },
            sonTextarea:{
                type:Function,
                default:()=>{}
            }
        },
        methods:{
            Change(e){
                this.$emit("input",e)
            }
        }
    }
</script>
<style >
.Textarea{
    width: 250px;
    display: inline-block;
}
.Textarea .el-textarea{
    vertical-align: top;
}
.Textarea .el-textarea__inner{
    padding: .416667rem 0.666667rem;
    font-size: 1rem!important;
    color: #666666;
}
</style>