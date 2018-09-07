<template>
  <div class="OpenCardInfo">
      <div class="OpenCardInfoBox">
          <span class="InfoBoxText"><i class="icon sign"></i>基本信息</span>
      </div>
      <div class="CardInfoBox">
          <table class="CardInfoTable">
                  <tr>
                    <td class="TableBackground" style="width:25%">开卡单号：</td>
                    <td style="width:25%">{{Data.orderNo}}</td>
                    <td class="TableBackground" style="width:25%">业务类型：</td>
                    <td style="width:25%"></td>
                  </tr>
                  <tr>
                    <td class="TableBackground">客户：</td>
                    <td>{{Data.customerName}}</td>
                    <td class="TableBackground">是否是内部员工：</td>
                    <td>{{Data.workNo?('内部员工编号：'+Data.workNo):'否'}}</td>
                  </tr>
                  <tr>
                    <td class="TableBackground">门店：</td>
                    <td>{{Data.storeName}}</td>
                    <td class="TableBackground">状态：</td>
                    <td>{{Data.ordStatus==1?'已开卡':'已退卡'}}</td>
                  </tr>
                  <tr>
                    <td class="TableBackground">订单总额：</td>
                    <td>{{Data.totalAmount}}</td>
                    <td class="TableBackground">创建时间：</td>
                    <td>{{Data.createTime}}</td>
                  </tr>
                  <tr>
                    <td class="TableBackground">创建人：</td>
                    <td>{{Data.uName}}</td>
                    <td class="TableBackground">备注：</td>
                    <td></td>
                  </tr>
            </table>
      </div>
      <div class="OpenCardInfoBox">
          <span class="InfoBoxText"><i class="icon sign"></i>购买套卡</span>
      </div>
      <div class="CardInfoBox">
          <el-table :data="tkList" border style="width: 100%">
              <el-table-column  prop="tkCode" label="编号" width="120"></el-table-column>
              <el-table-column  prop="tkName" label="套卡名称" width="200"></el-table-column>
              <el-table-column  prop="streetAmount" label="实际开卡价格" width="120"></el-table-column>
              <el-table-column  prop="saleNum" label="数量" width="100"></el-table-column>
              <el-table-column  label="应收小计" width="150">
                    <template slot-scope="scope">
                        {{scope.row.saleNum*scope.row.streetAmount}}
                    </template>
              </el-table-column>
              <el-table-column  prop="validDate" label="有效期" width="150">
                     <template slot-scope="scope">
                        {{scope.row.validDate?scope.row.validDate:'无限制'}}
                    </template>
              </el-table-column>
              <el-table-column  prop="prodRules" label="扣款方式" width="250">
                    <template slot-scope="scope">
                        {{scope.row.prodRules?scope.row.prodRules.name:'每次消费后扣（按折后价）'}}
                    </template>
              </el-table-column>
              <el-table-column  prop="status" label="状态" width="120">
                    <template slot-scope="scope">
                        {{(scope.row.status===0&&'正常')||(scope.row.status===1&&'已退卡')||(scope.row.status===2&&'已到期')}}
                    </template>
              </el-table-column>
              <el-table-column  label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <Button Name="查看详情" small="Btn" @click.native.stop="SeeDetail(scope.$index,scope.row)"/>
                    </template>
              </el-table-column>
              <el-table-column  min-width="1" fixed="right"></el-table-column>
          </el-table>
      </div>
      <!-- <div class="CardInfoBox">
            <div>套卡数：<span class="CardInfoBoxSpan">{{saleNum}}</span></div>
            <div>总价：<span class="CardInfoBoxSpan">{{Data.totalAmount}}</span></div>
            <div>活动优惠：<span class="CardInfoBoxSpan">￥{{0}}</span></div>
            <div>优惠券抵扣：<span class="CardInfoBoxSpan">￥{{0}}</span></div>
            <div>积分抵扣：<span class="CardInfoBoxSpan">￥{{0}}</span></div>
            <div class="FontSize">订单总额：<span class="CardInfoBoxSpan">￥{{Data.totalAmount}}</span></div>
      </div> -->
  </div>
</template>

<script>
import Button from '../../common/Button'
export default {
  components:{Button},
  data(){
    return{
      Data:'',
      tkList:[],
    }
  },
  computed:{
     saleNum(){
        let Num = 0
        this.tkList.map(e=>{
            Num += e.saleNum*1
        })
        return Num
     },
  },
  mounted(){
    this.$post(this.$host+'/api/order/ord/findProdByOrderNo',{orderNo:this.$route.query.orderNo}).then(d=>{
        if(d.success){
          let data = d.data
            data.createTime = this.$dateFormat("yy-MM-dd hh:mm:ss",d.data.createTime);
            this.Data = data
            this.tkList = data.tkList
        }
    })
  },
  methods:{
      SeeDetail(index,item){
          this.$router.push({
                path:"/NavDetail/ProductServe/ProductCardAdd",
                query:{
                    id:item.id,
                    detail:"detail",
                }
            })
      },
   }
}
</script>

<style scoped>
.OpenCardInfoBox{
  border:1px solid #efefef;
  border-bottom: none;
  /* width: 80%;   */
  font-size: 1.166667rem;
  color: #2cbcc8;
  font-weight: 700;  
}
.CardInfoBox{
  /* width: 80%; */
  font-size: 1.166667rem;
	color: #2cbcc8;
  text-align: right;
}
.InfoBoxText{
  display: inline-block;
  margin:.5rem 1.5rem;
}
.OpenCardInfo .Cursor{
  cursor: pointer;
  float: right;
}
.CardInfoTable{
  width: 100%;
  margin-bottom: 3.333333rem;
}
.CardInfoTable tr{
  height: 2.5rem;
}
.CardInfoTable th,
.CardInfoTable td{
  border: 1px solid #efefef;
  padding: 0 1rem;
  font-size: 1rem;
  text-align: left;
  line-height: 2.5rem;
  color: #666666;
  overflow:hidden;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  white-space:nowrap;
  border-collapse:collapse;
}
.CardInfoTable  .TableBackground{
  background-color: #fafafa;
  text-align: right;
}
.InfoBoxTable{
  width:100%;
}
.CardInfoBoxSpan{
  width: 8%;
  display: inline-block;
  text-align: left;
  color: #ed8617;
}
.FontSize{
  font-size: 1.333333rem;
}
</style>
