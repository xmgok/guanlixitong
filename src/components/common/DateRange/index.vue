<template>
    <span class="DateRange">
  <el-date-picker 
      v-model="valuess"
      value-format="yyyy-MM-dd"
      type="daterange"
      align="right"
      size='mini'
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      @change="Change">
    </el-date-picker>
</span>
    
</template>

<script>
import {DatePicker} from "element-ui"
import Vue from "vue"
Vue.use(DatePicker)
export default {
    components:{DatePicker},
    data(){
        return{
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ],
            },
            valuess:this.values
        }
    },
    watch:{
        values(val){
            this.valuess=val;
        }
    },
    props:{
        values:{
            type:Array,
            default:function () {return[]  }
        },
        arguName:{
            default:""
        }
    },
    methods:{
        Change(e){
            this.$emit('getDateRange',e,this.arguName)
        }
    },
}
</script>

<style>

.el-input__inner{
  line-height:normal!important;
}
.el-date-editor .el-range-separator{
  padding: 0!important;
}
.DateRange .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 350px !important;
}
</style>
