<template>
    <div class="Approve_task_detail">
        <ul  class="Detail clearfix" >
            <li v-for="(item,index) in detaildata">
                <div class="header">
                    <i class="icon" :class="'F'+item.checkStatus"></i>
                    <p>{{(item.checkStatus=="1"&&"待审批")||(item.checkStatus=="2"&&"审批通过")||(item.checkStatus=="3"&&"驳回")}}</p>
                    <i class="xuxian"></i>
                </div>
                <div class="footer ">
                    <div class="clearfix">
                        <span class="left">审批人：</span>
                        <div class="right">{{item.operator.slice(0,item.operator.indexOf(":"))||"暂无"}}</div>
                    </div>
                    <div class="clearfix">
                        <span class="left">审批理由：</span>
                        <div class="right">{{detailStatus[index]?(detailStatus[index].remark?detailStatus[index].remark:"暂无"):"暂无"}}</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                id:"",
                detaildata:[],
                detailStatus:[],
                detaildatas:[],
            }
        },
        methods: {
          getDetail(){
            this.id=this.$route.query.id||"";
            this.$post(this.$host+"/api/sysmgr/flowHistory/getProgress/"+this.id,{}).then(d=>{
                if(d.success){
                    this.detaildata=d.data;
                }
            });
            this.$post(this.$host+"/api/sysmgr/flowTaskHistory/listTasks/"+this.id,{}).then(d=>{
                if(d.success){
                    this.detailStatus=d.data;
                }
            })
            this.$post(this.$host+"/api/sysmgr/formDataInfo/getByHistoryId/"+this.id,{}).then(d=>{
                if(d.success){
                    let str=d.data.jsonData;
                    str=JSON.parse(str)
                    console.log(str)
                    let canShow=true;
                    if(str[0]['approveType']=="refund"){//退款的详情页
                        this.$router.push({
                            path:"/NavDetail/refund/seeRefund",
                            query:{
                                flowDataId:d.data.id
                            }
                        });
                        canShow=false;
                    }
                    if(canShow){
                        this.detaildatas=str;
                    }
                }
            })
          }  
        },
        mounted () {
            this.getDetail();
        }
    }
</script>
<style scoped>
    .Detail .header{
            text-align: center;
        }
        .process{
            position: absolute;
            width: 800px;
            left: 600px;
            top: 60px;
        }
        .Approve_task_detail .Detail{
            border: 1px solid #dcdfe6;
            padding-top: 24px;
            width: max-content;
        }
        .Approve_task_detail .Detail .footer{
            border-top: 1px solid #dcdfe6;
            padding-top: 1.5rem;
            margin-top: 1.5rem;
        }
        .Approve_task_detail .Detail .footer .clearfix{
            margin-bottom: .833333rem;
        }
        .Approve_task_detail .Detail .footer .left{
            float: left;
            display: inline-block;
            width: 8.333333rem;
            text-align: right;
        }
        .Approve_task_detail .Detail .footer .right{
            float: right;
            display: inline-block;
            width: 8.333333rem;
            padding-right: 1.25rem;
        }
        li{
            display: inline-table;
            width: 16.666667rem;
            float: left;
            position: relative;
        }
        li>p{
            width: 5rem;
            text-align: center;
        }
        li.Tbody .left{
            height: 6.416667rem;
            line-height: 6.416667rem;
        }
        .Approve_task_detail .icon{
            font-size: 48px;
            color: #888;
            padding-bottom: 20px;
            display: inline-block;
        }
        .Approve_task_detail .xuxian{
            display: inline-table;
            border-top: 2px dashed #888;
            width: 10rem;
            position: absolute;
            right: -4.833333rem;
            top: 20px;
        }
        .Approve_task_detail li:last-child .xuxian{
            display: none;
        }
        /* 待审核 */
        .Approve_task_detail .icon.F1::before{
            content: "\e62c";
        }
        /* 已审核 */
        .Approve_task_detail .icon.F2::before{
            content: "\e624";
        }
         /* 已驳回 */
         .Approve_task_detail .icon.F2::before{
            content: "\e68d";
        }
        
</style>