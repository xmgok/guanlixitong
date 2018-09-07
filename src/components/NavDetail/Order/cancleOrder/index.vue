<template>
    <div class="cancleOrder">
        <header>消费单{{billNo}}的撤销申请</header>
        <div class="body">
            <div class="Cell clearfix">
                <div class="left">产品信息：</div>
                <div class="right">
                    <div class="detail" :style="{width:'842px'}">
                        <el-table :data="ServicesInfo" border style="width: 100%" >
                            <el-table-column  prop="psCode" label="编号" width="80"></el-table-column>
                            <el-table-column  prop="psName" label="服务" width="200"></el-table-column>
                            <el-table-column  prop="dPrice" label="单次结算价格" width="120"></el-table-column>
                            <el-table-column  prop="dTimes" label="数量" width="120"></el-table-column>
                            <el-table-column  prop="dPrice" label="实际护理价格" width="120">
                                <template slot-scope="scope">
                                    {{(parseFloat(scope.row.dPrice)*scope.row.dTimes).toFixed(2)}}
                                </template>
                            </el-table-column>
                            <el-table-column  prop="tkName" label="套卡消耗" width="200">
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row.tkName||'未使用'}}
                                        <p class="btncor" v-show="scope.row.id">查看详情</p>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="Cell clearfix">
                <div class="left">撤销原因：</div>
                <div class="right">
                    <Textarea arguName="reason" @sonTextarea="upTextarea"/>
                </div>
            </div>
            <div class="Cell clearfix">
                <div class="left">返还实付金额：</div>
                <div class="right">￥{{returnRealAmount}}</div>
            </div>
            <div class="Cell clearfix">
                <div class="left">返还赠送金额：</div>
                <div class="right">￥{{returnGiveAmount}}</div>
            </div>
            <!-- <div class="Cell clearfix">
                <div class="left">返还套卡锁定实付金额：</div>
                <div class="right">00</div>
            </div>
            <div class="Cell clearfix">
                <div class="left">返还套卡锁定赠送金额：</div>
                <div class="right">00</div>
            </div> -->
        </div>
        <div class="footer">
            <Button class="None" Name="取消" @click.native="cancle"/>
            <Button Name="确定" @click.native="submit"/>
        </div>
    </div>
</template>
<script>
    import Button from "../../../common/Button"
    import Textarea from "../../../common/Textarea"
    export default{
        components: {
          Button,Textarea  
        },
        data(){
            return{
                ServicesInfo:[],
                billNo:"",
                cCode:"",
                returnRealAmount:0,//实付返还金额
                returnGiveAmount:"",//返还赠送金额
                reason:"",//撤销原因
            }
        },
        methods: {
            upTextarea(value,arguName){
                this[arguName]=value;
            },
            cancle(){
                history.go(-1);
            },
            submit(){
                let data={
                    billNo:this.billNo,
                    reason:this.reason,
                    returnRealAmount:this.returnRealAmount,
                    returnGiveAmount:this.returnGiveAmount,
                    cCode:this.cCode,
                }
                this.$post(this.$host+"/api/order/consume/saveConsumeListRevoke",data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"订单撤销成功",
                            duration:800,
                            onClose:()=>{
                                history.go(-1);
                            }
                        });
                    }
                })
            }
        },
        mounted () {
            this.billNo=this.$route.query.billNo||"";
            this.cCode=this.$route.query.cCode||"";
            this.$post(this.$host+"/api/order/consume/findConsumeDetailByBillNoRevoke",{billNo:this.billNo}).then(d=>{
                if(d.success){
                    this.ServicesInfo=d.data.info;
                    this.returnRealAmount=d.data.returnRealAmount;
                    this.returnGiveAmount=d.data.returnGiveAmount;
                }
            })
        }
    }
</script>
<style scoped lang="less">
    .body header{
        padding-bottom: 2rem;
    }
    .body .Cell{
        margin-bottom: 1rem;
    }
    .body .Cell .left{
        float: left;
        width: 85px;
        text-align: right;
    }
    .body .Cell .right{
        float: left;
        width: 700px;
    }
    .footer{
        padding: 40px 0 40px 250px;
    }
    .footer button:last-child{
        margin-left: 24px;
    }
    .btncor{
        cursor: pointer;
        color: #1dade2;
    }
</style>