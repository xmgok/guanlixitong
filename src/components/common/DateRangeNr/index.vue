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
                        text: '今日',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '昨日',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 );
                            end.setTime(end.getTime() - 3600 * 1000 * 24 );
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(new Date().setDate(new Date().getDate()-new Date().getDay()+1) );
                            end.setTime(new Date().setDate(new Date().getDate()+8-new Date().getDay()));
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '本月',
                        onClick(picker) {
                            var Nowdate=new Date();
                            var MonthFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1); 
                            let M=Number(MonthFirstDay.getMonth())+1;
                            const start=MonthFirstDay.getFullYear()+"-"+M+"-"+MonthFirstDay.getDate(); 
                            var MonthNextFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth()+1,1);
                            var MonthLastDay=new Date(MonthNextFirstDay-86400000);
                            let MN=Number(MonthLastDay.getMonth())+1;
                            const end =MonthLastDay.getFullYear()+"-"+MN+"-"+MonthLastDay.getDate();
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
