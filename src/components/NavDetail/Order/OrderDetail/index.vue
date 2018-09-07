<template>
    <div class="OrderDetail">
        <header class="clearfix header">
            <div class=""><span class="Name">{{OrderDetail.cName}}</span>({{OrderDetail.cCode}})的消费单</div>
        </header>
        <div class="modelBody">
            <div class="modeltable clearfix">
                <header class="CellHeader">
                    <i class="icon iconsign"></i>基本信息
                </header>
                <table class="Table">
                    <tr>
                        <td>消费单号：</td>
                        <td class="tleft">{{billNo}}</td>
                        <td>业务类型：</td>
                        <td class="tleft">消费</td>
                        <td>客户：</td>
                        <td class="tleft">
                            {{OrderDetail.cName}}
                            <span>({{OrderDetail.cCode}})</span>
                        </td>
                    </tr>
                    <tr>
                        <td>是否内部员工：</td>
                        <td class="tleft">{{OrderDetail.cWorkNo||"否"}}</td>
                        <td>门店：</td>
                        <td class="tleft">{{OrderDetail.sName}}</td>
                        <td>状态：</td>
                        <td class="tleft">{{OrderDetail.billStatus}}</td>
                    </tr>
                    <tr>
                        <td>消费总额：</td>
                        <td class="tleft">{{OrderDetail.totalMoney}}</td>
                        <td>创建时间：</td>
                        <td class="tleft">{{OrderDetail.createTime}}</td>
                        <td>创建人：</td>
                        <td class="tleft">{{OrderDetail.empName}}</td>
                    </tr>
                    <tr>
                        <td>客户签名时间：</td>
                        <td class="tleft">{{OrderDetail.signTime}}</td>
                        <td>客户签名状态：</td>
                        <td class="tleft">{{OrderDetail.signStatus}}</td>
                        <td>备注：</td>
                        <td class="tleft">{{OrderDetail.remark}}</td>
                    </tr>
                </table>
            </div>
            <div class="modeltable clearfix">
                <header class="CellHeader">
                    <i class="icon iconsign"></i>消费服务
                </header>
                <div class="detail layout" >
                    <el-table :data="OrderDetail.prodList" border style="width: 100%" >
                        <el-table-column  prop="psCode" label="编号" width="120"></el-table-column>
                        <el-table-column  prop="fwName" label="服务/商品" width="200"></el-table-column>
                        <el-table-column  prop="dPrice" label="单次结算价格" width="120"></el-table-column>
                        <el-table-column  prop="dTimes" label="数量" width="50"></el-table-column>
                        <el-table-column  prop="tkName" label="套卡消耗" width="200"></el-table-column>
                        <el-table-column  prop="consumePrice" label="应收小计" width="120">
                            <template slot-scope="scope">
                                <div>{{scope.row.tkName=="未使用"?("￥"+scope.row.subtotal):"已开卡"}}</div>
                            </template> 
                        </el-table-column>
                        <el-table-column  ></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="modeltable clearfix">
                <header class="CellHeader">
                    <i class="icon iconsign"></i>支付明细
                </header>
                <div class="detail layout" >
                    <el-table :data="payDetailList" border style="width: 100%" >
                        <el-table-column  prop="payType" label="支付类型" width="200"></el-table-column>
                        <el-table-column  prop="payMoney" label="支付金额" width="200"></el-table-column>
                        <el-table-column  ></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="modeltable clearfix">
                <header class="CellHeader">
                    <i class="icon iconsign"></i>套卡消耗明细
                </header>
                <div class="detail layout" >
                    <el-table :data="OrderDetail.tkConsDetList" border style="width: 100%" >
                        <el-table-column  prop="tkName" label="套卡名称" width="200"></el-table-column>
                        <el-table-column  prop="fwName" label="消耗服务" width="200"></el-table-column>
                        <el-table-column  prop="createTime" label="消耗时间" width="200">
                            <template slot-scope="scope">
                                <span>{{$dateFormat("yy-MM-dd hh:mm:ss",scope.row.createTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="dTimes" label="消耗次数" width="120"></el-table-column>
                        <el-table-column  prop="remainTimes" label="剩余次数" width="120"></el-table-column>
                        <el-table-column  prop="deductionsType" label="扣款方式" width="120"></el-table-column>
                        <el-table-column  prop="subtotal" label="扣款金额" width="120"></el-table-column>
                        <el-table-column  ></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Input from "../../../common/Input"
    import Buttons from "../../../common/Button"
    import Tables from "../../../common/Table"
    export default {
        components: {
            Input,Buttons,Tables
        },
        data(){
            return{
                billNo:"",
                OrderDetail:[],
                payDetailList:[],
            }
        },
        mounted () {
            this.billNo=this.$route.query.billNo||"";
            this.$post(this.$host+"/api/order/consume/consumedet",{billNo:this.billNo}).then(d=>{
                if(d.success){
                    let data=d;
                    data.signTime=this.$dateFormat("yy-MM-dd hh:mm:ss",data.signTime);//签名时间
                    data.createTime =this.$dateFormat("yy-MM-dd hh:mm:ss",data.createTime);//创建时间
                    data.psStartTime =this.$dateFormat("yy-MM-dd hh:mm:ss",data.psStartTime);//服务开始时间
                    data.psEndTime =this.$dateFormat("yy-MM-dd hh:mm:ss",data.psEndTime);//服务结束时间
                    switch(data.billStatus){//消费单单状态
                        case 0:data.billStatus="待服务";break;
                        case 1:data.billStatus="服务中";break;
                        case 2:data.billStatus="已结束";break;
                        case 3:data.billStatus="已撤销";break;
                    }
                    switch(data.signStatus){//签名状态
                        case 0:data.signStatus="未签名";break;
                        case 1:data.signStatus="已签名";break;
                    }
                    this.OrderDetail=data;
                    let payDetailList=data.payDetailList;
                    payDetailList.map(el=>{
                        switch(el.payType){
                            case 1:el.payType="可用实付余额";break;
                            case 2:el.payType="可用赠送余额";break;
                        }
                        el.payMoney="￥"+parseFloat(el.payMoney).toFixed(2);
                    })
                    this.payDetailList=payDetailList;
                    data.prodList.map(el=>{
                        if(!el.tkName){
                            el.tkName="未使用"
                        }
                        el.dPrice="￥"+el.dPrice;
                    })
                }
            })
        },
        methods: {
        }
    }
</script>
<style scoped lang="less">
    .OrderDetail{
       background: #fff;
    }
    .modeltable {
        margin-bottom: 24px;
    }
    .OrderDetail .header{
        box-shadow: 0px 2px 2px #efefef;
        height: 40px;
        line-height: 40px;
        margin-bottom: 24px;
    }
    .OrderDetail .header .Name{
        color: #ab9ee6;
        font-size: 14px;
        vertical-align: baseline;
    }
    .iconsign::before{
        content: "\E62D";
    }
    .iconsign{
        margin-right: 2px;
    }
    .CellHeader{
        color: #2cbcc8;
        font-size: 14px;
        font-weight: 600;
    }
    .modeltable .Table{
        border-top: 1px solid #efefef;
    border-left: 1px solid #efefef;
    width: 100%;
    }
    .modeltable .Table td{
        border-right: 1px solid #efefef;
        border-bottom: 1px solid #efefef;
        width: 16.66%;
        text-align: right;
        height: 30px;
        line-height: 30px;
        padding: 0 0.5rem;
        color: #666666;
        background: #fafafa;
    }
    .modeltable .Table td.tleft{
        text-align: left;
        background: #fff;
    }
</style>