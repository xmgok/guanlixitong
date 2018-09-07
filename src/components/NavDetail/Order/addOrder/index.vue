<template>
    <div class="addReceipt ">
        <div v-if="isShop">
        <div class="clearfix" :style="{overflow:'hidden'}" >
            <div class="left leftaddReceipt" ref="father">
                <header>
                    <span>会员选择：</span>
                    <span class="selectemp">
                        <Input placeholder="选择会员(输入姓名/编号/手机)" :value="cCodeOrNameOrPhone" :readonlys="readonlys" class="selectReceipt"  :widths="'240px'" :focus="focus" :blur="blur" :onkeyup="onkeyup"/>
                        <span class="sousuo" @click="ReceiptClick" :class="{active:focusActive}">
                            <i class="icon iconss"></i>
                        </span>
                        <el-collapse-transition>
                            <div class="shopNotes" v-show="shopNotesShow">
                                <header>今日已到店的会员</header>
                                <el-table :data="shopNotes" border style="width: 100%" :show-header="false" @row-click="handleRowHandle">
                                    <el-table-column  prop="cName" label="" width="120">
                                        <template slot-scope="scope">
                                            {{scope.row.cName+"("+scope.row.cCode+")"}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column  prop="cPhone" label="" width="120"></el-table-column>
                                    <el-table-column  prop="levName" label="" width="120"></el-table-column>
                                    <el-table-column  prop="updateTime" label="" width="120">
                                        <template slot-scope="scope">
                                            {{$dateFormat("hh:mm:ss",scope.row.updateTime)}}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-transition>
                        <el-collapse-transition>
                            <div class="shopNotes" v-show="shopReceiptShow">
                                <header>为您找到相关结果{{CustomerDatas.length}}个</header>
                                <el-table :data="CustomerDatas" border style="width: 100%" :show-header="false" @row-click="handleRowHandle">
                                    <el-table-column  prop="cName" label="" width="120">
                                        <template slot-scope="scope">
                                            {{scope.row.cName+"("+scope.row.cCode+")"}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column  prop="cPhone" label="" width="120"></el-table-column>
                                    <el-table-column  prop="levName" label="" width="120"></el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-transition>
                    </span>
                    <span class="padd">
                        <Button Name="添加新会员" @click.native="gotoAdd" class="" :iconadd="iconadd" buttonClass="Btn"/>
                        <span class="sanke" :class="{active:sanke}" @click="selectsanke">散客（不记名）</span>
                    </span>
                </header>
                <!-- 搜索 -->
                <div class="tkfws">
                    <ul class="tklist clearfix">
                        <li v-for="(item,index) in tklistData" :class="{active:item.active}" @click="toggletk(item)">{{item.name}}
                            <i class="icon icongou" v-show="item.active"></i>
                        </li>
                    </ul>
                    <span class="selectemp" v-show="tklistData[1].active">
                        <Input placeholder="输入名称/编号" :readonlys="readonlys" class="selectReceipt" :focus="profocus" :blur="problur" :widths="'240px'" arguName="prodKey" :value="prodKey"  @sonInput="sonInput"/>
                        <span class="sousuo" @click="Search" :class="{active:proActive}">
                            <i class="icon iconss"></i>
                        </span>
                    </span>
                    <ul class="fwlist clearfix" v-show="tklistData[1].active">
                        <li v-for="item in fwlist" :class="{active:item.active}" @click="togglefw(item)">{{item.cateName}}</li>
                    </ul>
                    <span class="selectemp" v-show="tklistData[2].active">
                        <Input placeholder="输入名称/编号" :readonlys="readonlys" class="selectReceipt" :focus="profocus" :blur="problur" :widths="'240px'" arguName="prodKeyGoods" :value="prodKeyGoods"  @sonInput="sonInput"/>
                        <span class="sousuo" @click="SearchGoods" :class="{active:proActive}">
                            <i class="icon iconss"></i>
                        </span>
                    </span>
                    <ul class="fwlist clearfix" v-show="tklistData[2].active">
                        <li v-for="item in fwlistGoods" :class="{active:item.active}" @click="togglefwGoods(item)">{{item.cateName}}</li>
                    </ul>
                </div>
                <!-- 套卡搜索出来的列表 -->
                <ul class="tklistdetail" v-show="tklistData[0].active">
                    <li v-for="item in servicesDatas" :class="{tkValidStatus:item.tkValidStatus==2}">
                        <header>
                            <span>{{item.tkName}}</span>有效期至：<i>{{item.validDate||'无限制'}}</i>
                        </header>
                        <ul class="clearfix">
                            <li v-for="items in item.serList" @click="addtk(items,item)" :class="{psValidStatus:items.psValidStatus==2}">
                              <div class="liDetail">
                                <div class="img">
                                  <img class="pro" :src="items.prodImg?items.prodImg:'../../../../../static/img/img.png'" alt="">
                                  <img class="tag" v-show="items.isGift==1" src="../../../../../static/img/give.png" alt="">
                                </div>
                                <div class="liprice">
                                    <span class="berName">{{items.prodName}}</span><br/>
                                    <span class="grade"><i>结算价格：</i>￥{{items.streetAmount}}/次</span><br/>
                                    <span class="grade"><i>剩余次数：</i>{{items.remainTimes>500?"不限次数":(items.remainTimes+"次")}}</span>
                                </div>
                              </div>
                                
                            </li>
                        </ul>
                    </li>
                    <li v-show="servicesDatas.length==0">暂无已购套卡</li>
                </ul>
                <!-- 服务搜索出来的列表 -->
                <ul class="fwlistdetail" v-show="tklistData[1].active">
                    <li v-for="item in SetSerData" @click="addfw(item)">
                        <div class="liDetail">
                            <div class="img">
                              <img :src="item.prodImg?item.prodImg:'../../../../../static/img/img.png'" alt="">
                            </div>
                            <div class="liprice">
                                <span class="berName">{{item.tkName}}</span><br/>
                                <span class="grade"><i>原价：</i>￥{{item.price}}/次</span><br/>
                                <span class="grade"><i>折后价：</i>￥{{item.disPrice}}/次</span>
                            </div>
                        </div>
                    </li>
                </ul>
                 <!-- 商品搜索出来的列表 -->
                <ul class="fwlistdetail" v-show="tklistData[2].active">
                    <li v-for="item in SetGoodsData" @click="addfw(item,'isGoods')">
                        <div class="liDetail">
                            <div class="img">
                              <img :src="item.prodImg?item.prodImg:'../../../../../static/img/img.png'" alt="">
                            </div>
                            <div class="liprice">
                                <span class="berName">{{item.tkName}}</span><br/>
                                <span class="grade"><i>原价：</i>￥{{item.price}}/次</span><br/>
                                <span class="grade"><i>折后价：</i>￥{{item.disPrice}}/次</span>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-show="SetGoodsData.length==0">暂无查询的商品</div>
            </div>
            <div class="right rightaddReceipt" >
                <div class="kfdetail clearfix">
                    <div class="left" @click="showInfo">
                        <img src="../../../../../static/img/header.png" alt="">
                        <span class="">{{InputValue}}</span><br/>
                    </div>
                </div>
                <span class="tkheader" v-show="selectedServices.filter(this.noorderNo).length>0">
                    <i class="icon icontk"></i>
                    套卡消耗</span>
                <ul class="tkselected">
                    <li v-for="item in selectedServices.filter(this.noorderNo)">
                        <div class="selectedServices clearfix">
                            <div class="left">
                                <img :src="item.prodImg?item.prodImg:'../../../../../static/img/img.png'" alt="">
                            </div>
                            <div class="right">
                                <div class="top clearfix">
                                    <span class="left">{{item.prodName}}</span>
                                    <i class="icon right icondelete" @click="deleteitem(item)"></i>
                                </div>
                                <div class="bottom clearfix">
                                    <span class="grade left">￥{{item.streetAmount}}</span>
                                    <span class="right">
                                        <el-input-number v-model="item.consumeTimes" size="mini" :min="1" :max="item.remainTimes||500"></el-input-number>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="selectedposition clearfix">
                            <el-checkbox  v-model="item.isDCust" class="left" >点客</el-checkbox>
                            <Button Name="选择服务员工" @click.native="addemployee(item)" class="left" :iconadd="iconadd" buttonClass="Btn"/>
                            <ul>
                                <li v-for="(items,index) in item.workNo" @click="deleteEmps(item,index)">{{items.empName}}
                                    <i class="icon iconClose"></i>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <span class="tkheader" v-show="selectedServices.filter(this.isorderNo).length>0">
                    <i class="icon iconfw"></i>
                    单点消费</span>
                <ul class="tkselected">
                    <li v-for="item in selectedServices.filter(this.isorderNo)">
                        <div class="selectedServices clearfix">
                            <div class="left">
                                <img :src="item.prodImg?item.prodImg:'../../../../../static/img/img.png'" alt="">
                            </div>
                            <div class="right">
                                <div class="top clearfix">
                                    <span class="left">{{item.prodName}}</span>
                                    <i class="icon right icondelete" @click="deleteitem(item)"></i>
                                </div>
                                <div class="bottom clearfix">
                                    <span class="grade left">￥{{item.streetAmount}}</span>
                                    <span class="right">
                                        <el-input-number v-model="item.consumeTimes" size="mini" :min="1" :max="item.remainTimes||500" @change="changeNum(item)"></el-input-number>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="selectedposition clearfix">
                            <el-checkbox  v-model="item.isDCust" class="left" v-show="item.prodClass!=2">点客</el-checkbox>
                            <Button :Name="item.prodClass==2?'选择销售员工':'选择服务员工'" @click.native="addemployee(item)" class="left" :iconadd="iconadd" buttonClass="Btn"/>
                            <ul>
                                <li v-for="(items,index) in item.workNo" @click="deleteEmps(item,index)">{{items.empName}}
                                    <i class="icon iconClose"></i>
                                </li>   
                            </ul>
                        </div>
                    </li>
                </ul>
                <div class="clearfix positions">
                    <div class="left">工位选择</div>
                    <div class="right" @click="gotoWorkp">
                        {{position.workplacName||"请选择"}}
                        <i >>></i>
                    </div>
                </div>
                <div class="clearfix positions" v-show="!sanke">
                    <div class="left">
                        <i class="icon iconcheck" :class="{active:activeYH}" @click="selectYH" v-show="!pointSynCoupon"></i>
                        优惠券
                    </div>
                    <div class="right" @click="addYH">
                      {{"-￥"+parseFloat(cashcouAmount).toFixed(2)}}
                        <i >>></i>
                    </div>
                </div>
                <div class="clearfix positions" v-show="!sanke">
                    <div class="left">
                        <i class="icon iconcheck" :class="{active:activeJF}" @click="selectJF" v-show="!pointSynCoupon"></i>
                        积分抵扣
                    </div>
                    <div class="right" @click="tcjifen">
                        {{"-￥"+accIntegralamount}}
                        <i>>></i>
                        <!-- <i class="icon iconjian"></i> -->
                    </div>
                </div>
                <div class="clearfix positions">
                    <div class="left">
                        储值账户支付
                    </div>
                    <div class="right">
                        <i >-￥{{(accCurAmount+accCurCashcou)>=Actualmoy?Actualmoy:(accCurAmount+accCurCashcou).toFixed(2)}}</i>
                    </div>
                </div>
                <div class="remark">
                    消费单备注：
                    <div>
                        <Textarea @sonTextarea="upTextarea" widths="100%" :values="remark"/>
                    </div>
                </div>
                <div class="footer">
                    <span class="actAmount">剩余待收：<i>￥{{(accCurAmount+accCurCashcou+YHamount-Actualmoy>=0)?'0.00':(Actualmoy-accCurAmount-accCurCashcou-YHamount).toFixed(2)}}</i></span>
                    <div >
                      <Button Name="开单" @click.native="submit" />
                      <Button Name="挂单" buttonClass="None"  @click.native="ConsemeBill" v-show="(updateShow&&getbillShow)||!updateShow"/>
                      <Button Name="取单" buttonClass="None"  @click.native="getBillbtn" v-show="(updateShow&&getbillShow)||!updateShow"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="model" v-show="infoShow">
            <header class="Header clearfix">
                <div class="left">客户信息</div>
                <div class="right"><i class="icon iconclose" @click="hideInfo"></i></div>
            </header>
            <div class="detail clearfix modelBox">
                <div class="tCenter">
                    <img src="../../../../../static/img/header.png" alt="">
                    <div >
                        <span class="berName">{{cName}}</span><br/>
                        <span class="grade">{{levName}}</span>
                    </div>
                </div>
                <div class="sum clearfix">
                    <div class="Cell fisrt">
                        <span class="">可用实付余额：</span>
                        <div class="">{{(accCurAmount).toFixed(2)}}</div>
                    </div>
                    <div class="Cell second">
                        <span class="">可用赠送余额：</span>
                        <div class="">{{accCurCashcou.toFixed(2)}}</div>
                    </div>
                    <div class="Cell four">
                        <span class="">可消耗套卡：</span>
                        <div class="">{{tkCount}}张</div>
                    </div>
                    <div class="Cell five">
                        <span class="">可消耗服务：</span>
                        <div class="">{{psCount}}项</div>
                    </div>
                    <div class="Cell six">
                        <span class="">可用优惠券：</span>
                        <div class="">0张</div>
                    </div>
                    <div class="Cell third">
                        <span class="">可用积分：</span>
                        <div class="">{{Integral}}分</div>
                    </div>
                </div>
            </div>
        </div>
        <AboutPeople :RadioPeople="Radio" :prodIds="prodIds"  :AboutPeopleSelected="AboutStoreSelected" v-if="modelemployee" :submit="sureemployee" :isShopStat="1"  :SelectedData="yuEmployees" :canclefun="canclefun"  :corpShow="corpShow" :sCodeShow="sCodeShow"/>
        <!-- <selectReceipt v-show="selectReceiptShow" :cancleReceipt="cancleReceipt" :sureselectReceipt="sureselectReceipt"/> -->
        <div class="modelservice model" v-show="serviceShow">
            <header class="clearfix Header">
                <div class="left">积分抵扣</div>
                <div class="right"><i class="icon iconClose" @click="closemodelservice"></i></div>
            </header>
            <div class="servicebody">
                <!-- <p>{{pointSynCoupon?'符合积分使用规则':'不符合积分使用规则，无可用积分'}}</p> -->
                <div>
                <!-- 账户共{{Integral}}积分 本次使用<Input :readonlys="!pointSynCoupon" placeholder="0" arguName="accIntegral" :onkeyup="accIntegralonkeyup" :value="accIntegral"/> 抵扣 <span>￥{{accIntegralamount||0.00}}</span> -->
                账户共{{Integral}}积分 本次使用<Input  placeholder="0" arguName="accIntegrals" :onkeyup="accIntegralonkeyup" :value="accIntegrals"/> 抵扣 <span>￥{{accIntegralamounts||0.00}}</span>
                </div>
            </div>
            <div class="footer">
                <Button Name="取消" buttonClass="None" @click.native="closemodelservice"/>
                <Button Name="确定" @click.native="sureJF"/>
            </div>
        </div>
        <div class="modelgetbill model" v-show="getbillmodelShow">
            <header class="clearfix Header">
                <div class="left">取单</div>
                <div class="right"><i class="icon iconClose" @click="closemodelgetbill"></i></div>
            </header>
            <div class="getbillbody">
               <ul class="clearfix">
                 <li class="getbillcell" v-for="item in getbilllist" @click="getbillnodetail(item.billNo)">
                   <ul>
                     <li >会员：{{item.cName}}
                       <i class="icon icondelete getbillicon"></i>
                       <i class="strip"></i>
                     </li>
                     <li >项目：{{item.prodNames}}</li>
                     <li >工位：{{item.workPlcName||'暂无'}}</li>
                     <li >备注：{{item.remark||'暂无'}}</li>
                   </ul>
                 </li>
               </ul>
            </div>
        </div>
        <!-- <div class="modelYH model" v-show="YHmodelShow">
            <header class="clearfix Header">
                <div class="left">优惠减免</div>
                <div class="right"><i class="icon iconClose" @click="closemodelYH"></i></div>
            </header>
            <div class="modelYHbody">
                <p>本单最高允许减价金额：￥{{totalmoy-tkmony}} <i @click="YHall">全部减免</i></p>
                <div>
                  <Input placeholder="输入金额" :widths="'240px'"  :value="YHamounts"  :onkeyup="onkeyupYHamounts"/>
                </div>
            </div>
            <div class="footer">
                <Button Name="取消" buttonClass="None" @click.native="closemodelYH"/>
                <Button Name="确定" @click.native="sureYH"/>
            </div>
        </div> -->
        <div class="modelYHs model" v-show="YHmodelShow">
            <header class="clearfix Header">
                <div class="left">优惠减免</div>
                <div class="right"><i class="icon iconClose" @click="closemodelYH"></i></div>
            </header>
            <div class="modelYHbody">
               <ul class="clearfix">
                 <li  class="YHli" v-for="item in YHList" @click="selYHli(item)"> 
                   <img src="../../../../../static/img/yh_bg.png" alt="">
                    <div class="YHliName"><span>{{item.couponTitle.slice(0,item.couponTitle.length-1)}}</span>{{item.couponTitle.slice(item.couponTitle.length-1),item.couponTitle.length}}</div>
                    <div class="YHlititle">{{item.cpName}}
                      <p>有效期至：{{$dateFormat('yy-MM-dd',item.endTime)}}</p>
                      <span class="leix">{{item.cpTypeName}}</span>
                    </div>
                    <i class="icon YHgou" v-show="item.active"></i>
                 </li>
                 <li  class="YHli" @click="giveCouponbtn()"> 
                    <div class="YHliAdd">
                      <i class="icon YHadd"></i>添加优惠券
                    </div>
                 </li>
               </ul>
            </div>
            <div class="footer">
                <Button Name="取消" buttonClass="None" @click.native="closemodelYH"/>
                <Button Name="确定" @click.native="sureYH"/>
            </div>
        </div>
        <div class=' give_coupon model' v-if="couponShow">
            <div class="model_content">
                <header class="x_model_header clear">
                    <div class="left">赠送优惠券</div>
                    <div class="right curor icon Fork" @click="closeCouponModel"></div>
                </header>
                <div class="x_model_main">
                    <div class="search_wrap">
                        <ul>
                            <li>
                                优惠券名称：
                                <input v-model="queryCoupon.cpName" placeholder="请输入券名称" type="text" class="x_input"></li>
                            <li>
                                优惠券类型：
                                <el-select v-model='queryCoupon.cpType' placeholder="请选择 " clearable>
                                    <el-option v-for="item in couponStatus" :label="item.value" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </li>
                            <li>
                                <Button Name="搜索" @click.native="giveCoupon(1)" />
                            </li>
                        </ul>
                    </div>
                    <div>
                        <el-table :data="couponDatas" border @selection-change="selectCouponFun" ref="couponTable" :row-key="getRowKeys" empty-text=' '>
                            <el-table-column type="selection" :reserve-selection="true">
                            </el-table-column>
                            <el-table-column prop="cpName" label="优惠券名称" width="200">
                            </el-table-column>
                            <el-table-column prop="cpType" label="优惠券类型" width="120">
                            </el-table-column>
                            <el-table-column prop="cpPayType" label="付费类型" width="100">
                            </el-table-column>
                            <el-table-column prop="cpStock" label="剩余库存" width="100">
                            </el-table-column>
                            <el-table-column prop="validDate" label="券有效期" width="180">
                            </el-table-column>
                            <el-table-column fixed='right' min-width='1'>
                            </el-table-column>
                        </el-table>
                        <Paging :handleCurrentChange="giveCoupon" :total="couponTotal" :pageSize='10' />
                    </div>

                </div>
                <div class="x_model_footer">
                    <Button Name="取消" @click.native="closeCouponModel" buttonClass="None" />
                    <Button Name="确定" @click.native="sureGiveCoupon" />
                </div>
            </div>
        </div>
        <Workplace v-show="WorkplaceShow" :selectWorkplace="selectWorkplace" :cancleWorkplace="cancleWorkplace" :workdatas="workdatas"/>
        <Mtk  v-show="getbillmodelShow"  @click.native="closemodelgetbill"/>
        <Mtk  v-show="WorkplaceShow"/>
        <Mtk  v-show="serviceShow"/>
        <Mtk  v-show="infoShow"/>
        <Mtk  v-show="AddserviceShow"/>
        <Mtk  v-show="YHmodelShow"/>
        <Mtk  v-show="couponShow"/>
    </div>
    <noShop v-if="!isShop"/>
    </div>
</template>
<script>
import Input from "../../../common/Input";
import Workplace from "../../../common/Workplace";
import Mtk from "../../../common/Mtk";
import Button from "../../../common/Button";
import Table from "../../../common/Table";
import Paging from "../../../common/Paging";
// import selectReceipt from "../../../common/selectReceipt";
import AboutPeople from "../../../common/AboutPeople";
import Textarea from "../../../common/Textarea";
import noShop from "../../../common/noShop";
import { mapMutations } from "vuex";
export default {
  name: "addOrder",
  components: {
    Input,
    Button,
    Table,
    Paging,
    AboutPeople,
    Textarea,
    Mtk,
    Workplace,
    noShop
  },
  data() {
    return {
      couponShow:false,
      YHmodelShow:false,
      getbillmodelShow:false,
      getbilllist:[],
      sanke:false,
      isShop: true, //是否有所属门店
      corpShow: false, //部门权限
      sCodeShow: false, //门店权限
      fatherHeight: 100,
      psCount: 0,
      cCodeOrNameOrPhone: "",
      CustomerDatas: [],
      shopReceiptShow: false,
      cateId: "",
      infoShow: false,
      activeYH: false,
      activeJF: false,
      shopNotesShow: false,
      shopNotes: [],
      fwlist: [],
      fwlistGoods: [],
      tklistData: [
        { name: "已购套卡", active: false, key: 0 },
        { name: "全部服务", active: true, key: 1 },
        { name: "商品销售", active: false, key: 2 },
      ],
      focusActive: false,
      proActive: false,
      pointShow: true,
      updateShow: false, //修改的显示内容
      getbillShow:false,//取单
      getbill:false,
      accIntegral: "", //积分抵扣
      cashcouAmount: 0, //优惠金额
      workdatas: [],
      WorkplaceShow: false, //工位
      position: {
        workplacName: "请选择"
      },
      prodKey: "",
      AddserviceShow: false,
      tkDatas: [], //已购套卡数据
      SetGoodsData:[],//商品数据
      servicesDatas: [], //已购套卡的服务列表数据
      selectedServices: [],
      yuselectedServices: [],
      tkShow: false,
      serviceShow: false,
      Not: true,
      showKong: false,
      yesDetail: true,
      iconadd: true,
      ipwidth: "160px",
      Radio: false,
      modelemployee: false,
      prodIds:[],
      employees: [], //选中的员工
      TabelHeader: [
        { detail: "员工姓名", width: "200px" },
        { detail: "员工等级", width: "200px" },
        { detail: "", width: "100px" }
      ],
      Tbody: ["empName", "position"],
      perfEmpIds: [],
      yuEmployees: [], //预选中的员工
      readonlys: false,
      selectReceiptShow: false,
      InputValue: "",
      cName: "会员名称",
      levName: "会员等级",
      Integral: 0, //账户可以积分
      cCode: "",
      customerId: "",
      remark: "", //备注
      accCurAmount: 0, //可用实际余额
      accCurCashcou: 0, //可用赠送余额
      tkCount: 0, //套卡数量
      Index: "",
      SetSerData: [], //可选服务的数据
      oldtotalMoney: 0, //原单的总金额
      oldaccAmount: 0, //原单的实付金额
      oldaccIntegral: 0, //原单的抵扣积分
      oldcashCouAmount: 0, //原单的赠送金额
      oldtimes: 0, //原单的服务数
      oldtkamount: 0, //原单的套卡扣减金额
      billNo: "",
      pointDeduct: 1, //积分换算比例10
      pointSynCoupon: true, //是否可以优惠和积分同时用
      isaccIntegral: true, //是否使用积分
      YHamount:0,
      YHamounts:"",
      cashcouAmountjia:0,
      accIntegraljia:0,
      accIntegrals:"",
      billStatus:"",
      prodKeyGoods:"",
      cateIdGoods:"",
      YHList:[],
      couponDatas:[],
      couponTotal:0,
      queryCoupon:{
        cpType:"",
        cpName:"",
      },
      couponStatus: [
          {
              key: '2',
              value: '代金券'
          },
          {
              key: '0',
              value: '兑换券'
          }, {
              key: '1',
              value: '折扣券'
          }
      ],
      //赠送优惠券
      giveCouponData: {
          "customerId": '',//客户ID,
          "custAcct": '',//客户账户编号,
          "batchNoList": [],//优惠券批次号
      },
      selectCoupon:[],
      couponNo:"",//优惠券券码
      couponNoIndex:"",
    };
  },
  computed: {
    //新单总价
    totalmoy: function() {
      let data = 0;
      this.selectedServices.map(el => {
        data += el.consumeTimes * el.streetAmount;
      });
      return data;
    },
    // 新单套卡扣减
    tkmony: function() {
      let data = 0;
      this.selectedServices.map(el => {
        if (el.tkName != "未使用") {
          data += el.consumeTimes * el.streetAmount;
        }
      });
      return data;
    },
    // 新单实收金额
    Actualmoy() {
        return parseFloat(
          this.totalmoy -
            this.tkmony -
            this.accIntegralamount -
            this.cashcouAmount
        ).toFixed(2);
      
    },
    // 积分抵扣金额
    accIntegralamount() {
      return this.accIntegral / this.pointDeduct;
    },
    accIntegralamounts() {
      return this.accIntegrals / this.pointDeduct;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/NavDetail/Payment") {
      this.updateAlives({ name: "addOrder", key: 1 });
    } else {
      this.updateAlives({ name: "addOrder" });
      this.$destroy();
      // this.updateAlives({name:"addOrder"})
    }
    next();
  },
  methods: {
    ...mapMutations(["updateAlives", "setDatas"]),
    // 选择优惠券
    selYHli(item){
      if(item.active){
        item.active=false;
      }else{
        this.YHList.map(el=>{
          el.active=false;
        });
        item.active=true;
      }
    },
    giveCouponbtn(){
      this.giveCoupon(1);
      this.couponShow=true;
      this.YHmodelShow=false;
    },
    getRowKeys(row) {
        return row.id;
    },
    //已选优惠券
    selectCouponFun(val) {
        this.selectCoupon = val
    },
    closeCouponModel() {
        this.couponShow = false;
        this.YHmodelShow=true;
        this.selectCoupon = [];
    },
     //赠送优惠券
    giveCoupon(val) {
      let par = {
          "pageNumber": parseInt(val),
          "pageSize": 10,
          logicType: 1,
          cpStatus: 2 ,
          cpType: this.queryCoupon.cpType || undefined,
          cpName: this.queryCoupon.cpName || undefined,
      };
      this.$post(this.$host + "/api/mkt/coupon/findCouponList", par)
      .then(d => {
          if (d.success) {
              d.data.content.map(el => {
                  //券类型
                  switch (el.cpType) {
                      case 0:
                          el.cpType = '兑换券'
                          break;
                      case 1:
                          el.cpType = '折扣券'
                          break;
                      case 2:
                          el.cpType = '代金券'
                          break;
                  };
                  //付费类型
                  switch (el.cpPayType) {
                      case 1:
                          el.cpPayType = '免费'
                          break;
                      case 2:
                          el.cpPayType = '付费'
                          break;
                      case 3:
                          el.cpPayType = '积分'
                          break;
                      case 4:
                          el.cpPayType = '第三方团购'
                          break;
                  }
              })
              let len = d.data.content.length
              if (d.data.content.length < 10) {
                  for (let i = 0; i < 10 - len; i++) {
                      let obj = {};
                      d.data.content.push(obj)
                  }
              }

              this.couponDatas = d.data.content;
              this.couponTotal = d.data.total;
          }
      });
    },
     //确定赠送
    sureGiveCoupon() {
      if (this.selectCoupon.length == 0) {
          this.$message({
              type: "warning",
              message: "请选择优惠券！",
          });
      } else {
          this.giveCouponData.batchNoList=[];
          this.selectCoupon.map(el => {
              this.giveCouponData.batchNoList.push(el.batchNo)
          })
          this.giveCouponData.customerId=this.customerId;
          this.giveCouponData.custAcct=this.cCode;
          this.$post(this.$host + "/api/mkt/coupon/giveCustCoupon", this.giveCouponData)
          .then(d => {
              if (d.success) {
                  this.$message({
                      type: "success",
                      message: "赠送成功！",
                  });
                  this.couponShow = false;
                  this.YHmodelShow=true;
                  this.getYH();
              }
          });
      }
    },
    sureYH(){
      let hasYH=false;
      let batchNo="";
      let couponNo="";
      let batchNoIndex="";
      this.YHList.map((el,index)=>{
        if(el.active){
          hasYH=true;
          batchNo=el.batchNo;
          couponNo=el.cpNo;
          batchNoIndex=index;
        }
      })
        let prosarr=this.selectedServices.filter(this.isorderNo);
      if(hasYH){//有选中的优惠券
        let prodList=[];
        prosarr.map(el=>{
          let newobj=new Object();
          newobj.salePrice=el.streetAmount;
          newobj.saleNum=el.consumeTimes;
          newobj.prodCode=el.prodCode;
          prodList.push(newobj);
        });
        let data={
          prodList:prodList,
          batchNo:batchNo
        };
        this.$post(this.$host+"/api/order/consume/getCouponChangeAmount",data).then(d=>{
          if(d.success){
              // this.cashcouAmount=this.YHamounts||0;
              this.cashcouAmount=d.data.totalCouponAmount||0;
              this.cashcouAmountjia=this.cashcouAmount;
              this.closemodelYH();
              this.couponNo=couponNo||'';
              this.couponNoIndex=batchNoIndex||'';
              if(d.data.prodArray.length>0){
                prosarr.map(el=>{
                  d.data.prodArray.map(val=>{
                    if(el.prodCode==val.prodCode){
                      el.couponAmount=parseFloat(val.couponAmount).toFixed(2);
                    }
                  })
                });
              }
          }
        })
      }else{
        // 清空优惠券
       this.clearYH();
        // this.cashcouAmountjia=this.cashcouAmount;
        this.closemodelYH();
      }

    },
    // 清空优惠券
    clearYH(){
        this.cashcouAmount=0;//优惠券金额
        this.couponNo="";//优惠券券码
        let prosarr=this.selectedServices.filter(this.isorderNo);
        if(prosarr.length>0){
          prosarr.map(el=>{
             el.couponAmount=0;
          })
        }
    },
    sureJF(){
      this.accIntegral=this.accIntegrals||0;
      this.accIntegraljia=this.accIntegral;
      this.closemodelservice();
    },
    YHall(){
      this.YHamounts=this.totalmoy -this.tkmony ;
    },
    onkeyupYHamounts(value){
      value.target.value = value.target.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
      value.target.value = value.target.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
      value.target.value = value.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
      value.target.value = value.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
      if(value.target.value.indexOf(".")< 0 && value.target.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
          value.target.value= parseFloat(value.target.value);  
      }  
      if(value.target.value>=( this.totalmoy -this.tkmony )){value.target.value=(this.totalmoy -this.tkmony)}
      this.YHamounts=value.target.value;
    },
    addYH(){
      if(this.activeYH&&(this.totalmoy >this.tkmony)){
        this.YHmodelShow=true;
        this.getYH();
      }
    },
    getYH(){
      let prosarr=this.selectedServices.filter(this.isorderNo);
      if(prosarr.length==0){
        return
      }else{
        let prodList=[];
        let cpLimit=0;
        prosarr.map(el=>{
          prodList.push(el.prodCode);
          cpLimit+=el.streetAmount*el.consumeTimes;
        });
        let data={
          customerId:this.customerId,
          // custAcct:this.cCode,
          prodList:prodList,
          cpLimit:cpLimit
        };
        this.$post(this.$host+"/api/cust/coupon/findCCustCouponList",data).then(d=>{
          if(d.success){
            let data=d.data;
            let isactive=false;
            data.map((el,index)=>{
              switch(el.cpType){
                case 0:el.cpTypeName="兑换券";break;
                case 1:el.cpTypeName="折扣券";break;
                case 2:el.cpTypeName="代金券";break;
              }
              if(this.couponNo&&(this.couponNo==el.batchNo)){//已选优惠券
                if(isactive){return}
                if(this.couponNoIndex){//选过的
                  if(this.couponNoIndex===index){
                    el.active=true;
                    isactive=true;
                  }else{
                    el.active=false;
                  }
                }else{
                  el.active=true;
                  isactive=true;
                }
              }else{
                el.active=false;
              }
            })
            this.YHList=data;
          }
        })
      }
    },
    closemodelYH(){
      this.YHmodelShow=false;
    },
    closemodelgetbill(){
      this.getbillmodelShow=false;
    },
    selectsanke(){
      if(this.updateShow){
        this.$message({
          type:"info",
          message:"不能修改会员"
        });
        return
      }
      if(!this.sanke){
        this.sanke=true;
        this.InputValue="散客(不记名)";
        let belongShop=this.$getCookie("belongOrg")+this.$getCookie("belongShop")+"000000";
        let item={cName:"散客",cCode:belongShop};
        this.selectedServices = [];
        this.accIntegral = 0;
        this.cashcouAmount = 0;
        this.cCode = belongShop;
        this.customerId="";
        this.YHamounts="";
        this.accIntegrals="";
        this.Search();
        this.SearchGoods();
        this.tklistData[0].active = false;
        this.tklistData[1].active = true;
        this.servicesDatas=[];
      }
    },
    getHeight() {
      console.log(this.$refs.father.offsetHeight);
      setTimeout((this.fatherHeight = this.$refs.father.offsetHeight), 1000);
    },
    tcjifen() {
      if(this.activeJF&&(this.totalmoy >this.tkmony)){
        this.serviceShow = true;
      }
    },
    canclefun() {
      this.modelemployee = false;
    },
    // 积分抵扣的输入规则
    accIntegralonkeyup(value) {
      console.log(value.target.value);
      value.target.value = value.target.value.replace(/\D/g, "");
      if (value.target.value > this.Integral) {
        value.target.value = this.Integral;
        this.accIntegrals = this.Integral;
       
      }else  if( value.target.value >(this.totalmoy -this.tkmony -this.cashcouAmount)*this.pointDeduct){
          value.target.value = (this.totalmoy -this.tkmony -this.cashcouAmount)*this.pointDeduct;
          this.accIntegrals = value.target.value;
        }
       else {
        this.accIntegrals = value.target.value;
      }
    },
    onkeyup(value) {
      if (value.keyCode == 13) {
        //回车事件
        this.ReceiptClick();
      }
      this.cCodeOrNameOrPhone = value.target.value;
      if ( value.target.value == "") {
        this.shopReceiptShow = false;
        setTimeout(()=>{this.shopNotesShow = true},500)
      } else {
        this.shopNotesShow = false;
      }
    },
    upInput(value) {
      if (value == "") {
        this.shopNotesShow = true;
        this.shopReceiptShow = false;
      } else {
        this.shopNotesShow = false;
      }
      this.cCodeOrNameOrPhone = value;
    },
    showInfo() {
      if (this.cCode&&!this.sanke) {
        this.infoShow = true;
      }
    },
    hideInfo() {
      this.infoShow = false;
    },
    selectYH() {
      if(!this.pointSynCoupon){//不可同用
        this.activeYH = !this.activeYH;
        if(this.activeYH){
          this.activeJF=false;
          this.cashcouAmount=this.cashcouAmountjia;
          this.accIntegral=0;
        }else{
          this.cashcouAmount=0;
        }
      }
    },
    selectJF() {
      if(!this.pointSynCoupon){//不可同用
        this.activeJF = !this.activeJF;
        this.isaccIntegral = !this.isaccIntegral;
        if(this.activeJF){
          this.activeYH=false;
          this.cashcouAmount=0;
          this.accIntegral=this.accIntegraljia;
        }else{
          this.accIntegral=0;
        }
      }
      
    },
    deleteEmps(item, i) {
      item.workNo.splice(i, 1);
      this.selectedServices.map((value, index) => {
        if (value.prodCode == item.prodCode && value.orderNo == item.orderNo) {
          this.$set(this.selectedServices, index, item);
        }
      });
    },
    isorderNo(el) {
      return el.orderNo == "";
    },
    noorderNo(el) {
      return el.orderNo != "";
    },
    handleRowHandle(row) {
      console.log(row);
      if (this.cCode != row.cCode) {
          //换了客户
          this.selectedServices = [];
          this.accIntegral = 0;
          this.cashcouAmount = 0;
        }else{
          this.selectReceiptShow = false;
          this.shopReceiptShow = false;
          return;
        }
      if(row.serList||row.serList===null){//是预约
        this.sureselectReceipt(row,true);
      }else{
        this.cCode=row.cCode;
        this.customerId=row.id;
        this.$post(this.$host+"/api/cust/dateBill/findDateBillCustomers",{cCode:row.cCode}).then(d=>{
          if(d.success){
            if(d.data.length>0){
              this.gettkfw(d.data[0],true);
            }else{
              this.gettkfw(row);
            }

          }
        })
        this.sureselectReceipt(row,false,true);
      }
    },
    // 删除服务
    deleteitem(item) {
      if(!item.tkCode){
        this.clearYH();
      }
      this.selectedServices.map((value, index) => {
        if (value.prodCode == item.prodCode && value.orderNo == item.orderNo) {
          this.selectedServices.splice(index, 1);
        }
      });
    },
    // 添加服务
    addfw(item,isGoods) {
      if (!this.cCode) {
        this.$message({
          type: "info",
          message: "请先选择会员"
        });
        return;
      }
      let canpush = true;
      this.selectedServices.map(val => {
        if (val.prodCode == item.tkCode && val.orderNo == "") {
          canpush = false;
        }
      });
      if (canpush) {
        let newobj = new Object();
        if(isGoods=="isGoods"){
          newobj.prodClass=item.prodClass;
        }
        newobj.prodName = item.tkName;
        newobj.streetAmount = parseFloat(item.disPrice);
        newobj.salePrice = parseFloat(item.price);
        newobj.tkName = "未使用";
        newobj.prodCode = item.tkCode;
        newobj.orderNo = "";
        newobj.isDCust=false;
        newobj.consumeTimes = 1;
        newobj.workNo = [];
        newobj.prodImg = item.prodImg;
        newobj.workNoName = "";
        newobj.psServTime = item.psServTime;
        newobj.prodId = item.prodId;
        this.selectedServices.push(newobj);
        this.clearYH();
      }
      console.log(this.selectedServices);
    },
    addtk(items, item,appoint) {
      let canpush = true;
      this.selectedServices.map(val => {
        if (val.prodCode == items.prodCode && val.orderNo == items.orderNo) {
          canpush = false;
        }
      });
      if(canpush){
        if ((items.psValidStatus == 2 || item.tkValidStatus == 2)&&!appoint) {
          //失效的服务或者套卡
          this.$messagebox.confirm('该服务已停用，是否继续添加该服务？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            this.pushTk(items, item,appoint);
          }).catch(() => {
          });
        }else{
          this.pushTk(items, item,appoint);
          
        }
      }
      console.log(this.selectedServices);
    },
    pushTk(items, item,appoint){
        if(!appoint){
          if(items.isGift==1){//是赠送服务
            let times=0;
            item.serList.map(el=>{
              if(el.prodCode==items.prodCode){
                times++;
              }
            });
            if(times==2){
              this.$message({
                type:"info",
                message:"该套卡有计价的同款服务["+items.prodName+"]未消耗完请先消耗完毕",
                duration:"3000"
              });
              return;
            }
          }
        }
        let newobj = new Object();
        newobj.prodName = items.prodName;
        newobj.streetAmount = parseFloat(items.streetAmount);
        newobj.salePrice = parseFloat(items.salePrice);
        newobj.prodCode = items.prodCode;
        newobj.tkCode = item.tkCode;
        newobj.orderNo = items.orderNo;
        newobj.consumeTimes = 1;
        newobj.isDCust=false;
        newobj.workNo = [];
        newobj.remainTimes=items.remainTimes;
        newobj.prodImg = items.prodImg;
        newobj.workNoName = "";
        newobj.psServTime = items.psServTime;
        newobj.prodId = items.prodId;
        this.selectedServices.push(newobj);
    },
    // 切换产品一级分类
    togglefw(item) {
      console.log(item);
      if (item.active) {
        this.cateId = "";
        this.Search();
        item.active = false;
        return;
      }
      this.cateId = item.id;
      this.Search();
      this.fwlist.map(el => {
        el.active = false;
      });
      item.active = true;
    },
    togglefwGoods(item) {
      console.log(item);
      if (item.active) {
        this.cateIdGoods = "";
        this.SearchGoods();
        item.active = false;
        return;
      }
      this.cateIdGoods = item.id;
      this.SearchGoods();
      this.fwlistGoods.map(el => {
        el.active = false;
      });
      item.active = true;
    },
    
    // 切换已购套卡和服务
    toggletk(item) {
      this.tklistData.map(el => {
        el.active = false;
      });
      item.active = true;
    },
    // 会员聚焦
    focus() {
      this.focusActive = true;
      if (!this.cCodeOrNameOrPhone && this.shopNotes.length > 0) {
        this.shopNotesShow = true;
      }
    },
    // 会员失去焦点
    blur() {
      this.focusActive = false;
      setTimeout(() => {
        this.shopNotesShow = false;
      }, 250);
    },
    profocus() {
      this.proActive = true;
    },
    problur() {
      this.proActive = false;
    },
    // 点击选择工位
    gotoWorkp() {
      let data = {
        sCode: this.$getCookie("belongShop")
      };
      this.$post(this.$host + "/api/order/workplace/select", data).then(d => {
        if (d.success) {
          let data = d.data;
          data.map(el => {
            el.active = false;
          });
          this.workdatas = data;
          this.WorkplaceShow = true;
        }
      });
    },
    // 选择工位
    selectWorkplace(item) {
      console.log(item);
      this.position = item;
      this.cancleWorkplace();
    },
    // 取消选择工位
    cancleWorkplace() {
      this.WorkplaceShow = false;
    },
    // 去除选择的工位
    deleteWork() {
      this.position = {};
      this.position.workplacName = "选择工位";
    },
    changeNum(val, index) {
      this.clearYH();
      console.log(this.selectedServices);
    },
    sonInput(value, arguName) {
      this[arguName] = value;
      if (this.accIntegral > this.Integral) {
        this.$message({
          type: "info",
          message: "抵扣积分不得大于账户积分"
        });
      }
    },
    // 删除一行
    handleClick(item, index) {
      this.selectedServices.splice(index, 1);
      // this.getAmount=0;
      this.selectedServices.map(el => {
        if (!el.orderNo) {
          // this.getAmount+=(el.streetAmount*el.consumeTimes);
        }
      });
    },
    cancleSelected() {
      this.tkShow = false;
      this.yuselectedServices = [];
      this.servicesDatas = [];
      console.log(this.selectedServices);
      console.log(this.yuselectedServices);
    },
    // 确定选择的服务
    sureSelected() {
      this.tkShow = false;
      // this.selectedServices=this.yuselectedServices;
      this.yuselectedServices.map((el, index) => {
        el.canpush = true;
        this.selectedServices.map(val => {
          if (val.prodCode == el.prodCode && val.orderNo == el.orderNo) {
            el.canpush = false;
          }
        });
        el.canpush && this.selectedServices.push(el);
      });
      this.yuselectedServices = [];
      this.servicesDatas = [];
      console.log(this.selectedServices);
      console.log(this.yuselectedServices);
    },
    // 选择服务
    selectService(item) {
      item.map((el, index) => {
        el.canpush = true;
        this.yuselectedServices.map(val => {
          if (val.prodCode == el.prodCode && val.orderNo == el.orderNo) {
            el.canpush = false;
          }
        });
        el.canpush && this.yuselectedServices.push(el);
      });
      // this.yuselectedServices.push.apply(this.yuselectedServices,item);
      // item.map(el=>{
      //     this.yuselectedServices.push(el);
      // })
      console.log(this.yuselectedServices);
      console.log(item);
      // this.yuselectedServices.concat(item);
    },
    closemodelservice() {
      this.serviceShow = false;
    },
    // 选择已购套卡
    showTk() {
      this.$post(this.$host + "/api/order/consume/getTKList", {
        cCode: this.cCode
      }).then(d => {
        if (d.success) {
          this.tkDatas = d.data;
          this.serviceShow = false;
          this.tkShow = true;
        }
      });
    },
    Search(item,appoint) {
      if (!this.prodKey) {
        let _data = {
          customerId: this.customerId,
          prodClass: 0,
          cateId: this.cateId
        };
        this.$post(this.$host + "/api/prod/prtserv/findForStore", _data).then(
          d => {
            if (d.success) {
              this.SetSerData = d.data;
              // this.getHeight();
              if(appoint){//预约来的
                  // let psNameLists=this.$route.query.psNameList||"";//预选的服务
                  // let workNo=this.$route.query.workNo||"";//预选的服务员工
                  // let empName=this.$route.query.empName||"";//预选的服务员工
                  // psNameLists=JSON.parse(psNameLists);
                  if(item.serList.length>0){
                    item.serList.map(el=>{
                        this.SetSerData.map(val=>{
                            if(el.psCode==val.tkCode&&!el.orderNo&&!el.tkCode){
                                this.addfw(val);
                            }
                        })
                    })
                  }
                  // item.workNo&&this.selectedServices.map(el=>{
                  //     el.workNo=[{workNo:item.workNo,empName:item.empName}];
                  //     el.isDCust=true;
                  // });
                  if(appoint&&item.workNo&&item.prodIds){
                      let arr=item.prodIds.split(",");
                      arr=arr.map(el=>el=parseFloat(el))
                      console.log(arr)
                      this.selectedServices.map(el=>{
                          if(arr.indexOf(el.prodId)>-1){
                            el.workNo=[{workNo:item.workNo,empName:item.empName}];
                            el.isDCust=true;
                          }
                      });
                  }
              }
            }
          }
        );
      } else {
        let _data = {
          customerId: this.customerId,
          prodKey: this.prodKey,
          prodClass: 0,
          cateId: this.cateId
        };
        this.$post(this.$host + "/api/prod/prtserv/findForStore", _data).then(
          d => {
            if (d.success) {
              this.SetSerData = d.data;
              // this.getHeight();
            }
          }
        );
      }
    },
    SearchGoods(item) {
      if (!this.prodKeyGoods) {
        let _data = {
          customerId: this.customerId,
          prodClass: 2,
          cateId: this.cateIdGoods
        };
        this.$post(this.$host + "/api/prod/prtserv/findForStore", _data).then(
          d => {
            if (d.success) {
              this.SetGoodsData = d.data;
            }
          }
        );
      } else {
        let _data = {
          customerId: this.customerId,
          prodKey: this.prodKeyGoods,
          prodClass: 2,
          cateId: this.cateIdGoods
        };
        this.$post(this.$host + "/api/prod/prtserv/findForStore", _data).then(
          d => {
            if (d.success) {
              this.SetGoodsData = d.data;
              // this.getHeight();
            }
          }
        );
      }
    },
    checkbox(item, index) {
      this.SetSerData.map(e => {
        if (e.prodId == item.prodId) {
          e.checked = !e.checked;
        }
      });
    },
    Cancel() {
      this.AddserviceShow = false;
    },
    // 选择服务的确定
    Submit() {
      this.SetSerData.map(el => {
        if (el.checked) {
          el.canpush = true;
          el.orderNo = "";
          this.selectedServices.map(val => {
            if (val.prodCode == el.tkCode && val.orderNo == el.orderNo) {
              el.canpush = false;
            }
          });
          if (el.canpush) {
            let newobj = new Object();
            newobj.prodName = el.tkName;
            newobj.streetAmount = parseFloat(el.disPrice);
            newobj.salePrice = parseFloat(el.price);
            newobj.tkName = "未使用";
            newobj.prodCode = el.tkCode;
            newobj.orderNo = el.orderNo;
            newobj.consumeTimes = 1;
            newobj.workNo = [];
            newobj.workNoName = "";
            newobj.psServTime = el.psServTime;
            newobj.prodId = el.prodId;
            this.selectedServices.push(newobj);
          }
        }
      });
      // this.getAmount=0;
      this.selectedServices.map(el => {
        if (!el.orderNo) {
          // this.getAmount+=(el.streetAmount*el.consumeTimes);
        }
      });
      console.log(this.SetSerData);
      console.log(this.selectedServices);
      this.AddserviceShow = false;
    },
    // 取消
    cancle() {
      history.go(-1);
    },
    upTextarea(value) {
      this.remark = value;
    },
    //提交
    submit() {
      if (this.cCode == "") {
        this.$message({
          type: "info",
          message: "请选择会员"
        });
        return;
      }
      let detailList = [];
      let canservEmp = true;
      this.selectedServices.map(el => {
        let newobj = new Object();
        newobj.orderNo = el.orderNo || "";
        newobj.prodName = el.prodName || "";
        newobj.prodId = el.prodId || "";
        newobj.tkCode = el.tkCode || "";
        newobj.psCode = el.prodCode || "";
        newobj.isDCust=el.isDCust?1:0;
        newobj.psServTime = el.psServTime || "";
        newobj.consumeTimes = el.consumeTimes || 1;
        newobj.couponAmount = el.couponAmount || 0;
        newobj.consumePrice = parseFloat(parseFloat(el.streetAmount)-parseFloat(newobj.couponAmount)).toFixed(2);
        newobj.servEmp = [];
        if (el.workNo.length == 0) {
          newobj.servEmp = [];
          canservEmp = false;
        } else {
          el.workNo.map(val => {
            newobj.servEmp.push({ workNo: val.workNo, name: val.empName });
          });
        }
        detailList.push(newobj);
      });
      let getAmountTotal = 0;
      this.selectedServices.map(el => {
        getAmountTotal += el.streetAmount * el.consumeTimes;
      });
      if (detailList.length == 0) {
        this.$message({
          type: "info",
          message: "请选择开单服务"
        });
        return;
      }
      let data = {
        cCode: this.cCode,
        customerId:this.customerId||"",
        position: this.position.workplacNo || "",
        totalMoney: getAmountTotal,
        remark: this.remark,
        detailList: detailList,
        accIntegral: parseFloat(this.accIntegral) || 0,
        couponAmount: parseFloat(this.cashcouAmount) || 0,//:优惠券金额
        couponNo:this.couponNo,
        // cashcouAmount: parseFloat(this.cashcouAmount) || 0,
      };
      if (this.updateShow) {
        //修改
        data.billNo = this.billNo;
        data.billStatus = this.billStatus;
      }
      if (canservEmp) {
          if (this.updateShow) {//修改或者是取单
            if(this.getbillShow){//取单
               if(this.accCurAmount+this.accCurCashcou-this.Actualmoy>=0){
                  this.$post(
                  this.$host + "/api/order/consume/createConsemeBill",
                    data
                  ).then(d => {
                    if (d.success) {
                      this.$message({
                        type: "success",
                        message: "开单成功"
                      });
                      this.$route.meta.nokeepAlive = true;
                      this.setDatas({ name: "newOrder", value: true });
                      this.$router.push({
                        path: "/NavDetail/Order"
                      });
                    }
                  });
                }else{
                  //去支付
                  if(this.sanke){
                    this.customerId="sanke"
                  }
                  this.$post(
                  this.$host + "/api/order/consume/createConsemeBill",
                    data
                  ).then(d => {
                    if (d.success) {
                        if(d.data.billNo=="1"){
                          this.$setCookie("jsondata", JSON.stringify(data));
                          this.$router.push({
                            path: "/NavDetail/Payment",
                            query: {
                              resurl: "/NavDetail/Order",
                              id: this.customerId,
                              amount: (this.Actualmoy-this.accCurAmount-this.accCurCashcou).toFixed(2)
                            }
                          });
                        }else if(d.data.billNo){
                          this.$message({
                            type: "success",
                            message: "开单成功"
                          });
                          this.$route.meta.nokeepAlive = true;
                          this.setDatas({ name: "newOrder", value: true });
                          this.$router.push({
                            path: "/NavDetail/Order"
                          });
                        }
                    }
                  });
                }
              }else{//修改
              console.log(this.accCurAmount)
              console.log(this.accCurCashcou)
              console.log(this.oldaccAmount)
              console.log(parseFloat(this.Actualmoy))
              console.log(this.accCurAmount+this.accCurCashcou+this.oldaccAmount-this.Actualmoy)
              if(this.accCurAmount+this.accCurCashcou+this.oldaccAmount-parseFloat(this.Actualmoy)>=0){
                //钱够不去支付，直接保存
                this.$post(
                this.$host + "/api/order/consume/updateConsemeBill",
                  data
                ).then(d => {
                  if (d.success) {
                    console.log('钱够不去支付，直接保存')
                    this.$message({
                      type: "success",
                      message: "开单成功"
                    });
                    this.$route.meta.nokeepAlive = true;
                    this.setDatas({ name: "newOrder", value: true });
                    this.$router.push({
                      path: "/NavDetail/Order"
                    });
                  }
                });
              }else{
                //去支付
                if(this.sanke){
                  this.customerId="sanke"
                }
                this.$post(
                this.$host + "/api/order/consume/updateConsemeBill",
                  data
                ).then(d => {
                  if (d.success) {
                    console.log('钱bu够去支付')
                    if(d.data.billNo=="1"){
                      this.$setCookie("jsondata", JSON.stringify(data));
                      this.$router.push({
                        path: "/NavDetail/Payment",
                        query: {
                          resurl: "/NavDetail/Order",
                          id: this.customerId,
                          amount: (this.Actualmoy-this.accCurAmount-this.accCurCashcou-this.oldaccAmount).toFixed(2),
                          update: "update"
                        }
                      });
                    }else{
                         this.$message({
                          type: "success",
                          message: "开单成功"
                        });
                        this.$route.meta.nokeepAlive = true;
                        this.setDatas({ name: "newOrder", value: true });
                        this.$router.push({
                          path: "/NavDetail/Order"
                        });
                    }                    
                  }
                });
                
              }
            }
          } else {//新增
            if(this.accCurAmount+this.accCurCashcou-this.Actualmoy>=0){
              this.$post(
              this.$host + "/api/order/consume/createConsemeBill",
                data
              ).then(d => {
                if (d.success) {
                  this.$message({
                    type: "success",
                    message: "开单成功"
                  });
                  this.$route.meta.nokeepAlive = true;
                  this.setDatas({ name: "newOrder", value: true });
                  this.$router.push({
                    path: "/NavDetail/Order"
                  });
                }
              });
            }else{
              //去支付
              if(this.sanke){
                this.customerId="sanke"
              }
              this.$post(
              this.$host + "/api/order/consume/createConsemeBill",
                data
              ).then(d => {
                if (d.success) {
                  if(d.data.billNo=="1"){
                    this.$setCookie("jsondata", JSON.stringify(data));
                    this.$router.push({
                      path: "/NavDetail/Payment",
                      query: {
                        resurl: "/NavDetail/Order",
                        id: this.customerId,
                        amount: (this.Actualmoy-this.accCurAmount-this.accCurCashcou).toFixed(2)
                      }
                    });
                  }else if(d.data.billNo){
                    this.$message({
                      type: "success",
                      message: "开单成功"
                    });
                    this.$route.meta.nokeepAlive = true;
                    this.setDatas({ name: "newOrder", value: true });
                    this.$router.push({
                      path: "/NavDetail/Order"
                    });
                  }
                }
              });
              
            }
          }
      } else {
        this.$messagebox
          .confirm(
            "该消费单有服务项未选择服务员工，相应的业绩将不可分配。您确定仍然继续？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
            if (this.updateShow) {//修改或者是取单
              if(this.getbillShow){//取单
                if(this.accCurAmount+this.accCurCashcou-this.Actualmoy>=0){
                    this.$post(
                    this.$host + "/api/order/consume/createConsemeBill",
                      data
                    ).then(d => {
                      if (d.success) {
                        this.$message({
                          type: "success",
                          message: "开单成功"
                        });
                        this.$route.meta.nokeepAlive = true;
                        this.setDatas({ name: "newOrder", value: true });
                        this.$router.push({
                          path: "/NavDetail/Order"
                        });
                      }
                    });
                  }else{
                    //去支付
                    if(this.sanke){
                      this.customerId="sanke"
                    }
                    this.$post(
                    this.$host + "/api/order/consume/createConsemeBill",
                      data
                    ).then(d => {
                      if (d.success) {
                          if(d.data.billNo=="1"){
                            this.$setCookie("jsondata", JSON.stringify(data));
                            this.$router.push({
                              path: "/NavDetail/Payment",
                              query: {
                                resurl: "/NavDetail/Order",
                                id: this.customerId,
                                amount: (this.Actualmoy-this.accCurAmount-this.accCurCashcou).toFixed(2)
                              }
                            });
                          }else if(d.data.billNo){
                            this.$message({
                              type: "success",
                              message: "开单成功"
                            });
                            this.$route.meta.nokeepAlive = true;
                            this.setDatas({ name: "newOrder", value: true });
                            this.$router.push({
                              path: "/NavDetail/Order"
                            });
                          }
                      }
                    });
                  }
                }else{//修改
                if(this.accCurAmount+this.accCurCashcou+this.oldaccAmount-this.Actualmoy>=0){
                  //钱够不去支付，直接保存
                  this.$post(
                  this.$host + "/api/order/consume/updateConsemeBill",
                    data
                  ).then(d => {
                    if (d.success) {
                      this.$message({
                        type: "success",
                        message: "开单成功"
                      });
                      this.$route.meta.nokeepAlive = true;
                      this.setDatas({ name: "newOrder", value: true });
                      this.$router.push({
                        path: "/NavDetail/Order"
                      });
                    }
                  });
                }else{
                  //去支付
                  if(this.sanke){
                    this.customerId="sanke"
                  }
                  this.$post(
                  this.$host + "/api/order/consume/updateConsemeBill",
                    data
                  ).then(d => {
                    if (d.success) {
                      if(d.data.billNo=="1"){
                        this.$setCookie("jsondata", JSON.stringify(data));
                        this.$router.push({
                          path: "/NavDetail/Payment",
                          query: {
                            resurl: "/NavDetail/Order",
                            id: this.customerId,
                            amount: (this.Actualmoy-this.accCurAmount-this.accCurCashcou-this.oldaccAmount).toFixed(2),
                            update: "update"
                          }
                        });
                      }else{
                         this.$message({
                            type: "success",
                            message: "开单成功"
                          });
                          this.$route.meta.nokeepAlive = true;
                          this.setDatas({ name: "newOrder", value: true });
                          this.$router.push({
                            path: "/NavDetail/Order"
                          });
                      }                    
                    }
                  });
                  
                }
              }
            } else {//新增
              if(this.accCurAmount+this.accCurCashcou-this.Actualmoy>=0){
                this.$post(
                this.$host + "/api/order/consume/createConsemeBill",
                  data
                ).then(d => {
                  if (d.success) {
                    this.$message({
                      type: "success",
                      message: "开单成功"
                    });
                    this.$route.meta.nokeepAlive = true;
                    this.setDatas({ name: "newOrder", value: true });
                    this.$router.push({
                      path: "/NavDetail/Order"
                    });
                  }
                });
              }else{
                //去支付
                if(this.sanke){
                  this.customerId="sanke"
                }
                this.$post(
                this.$host + "/api/order/consume/createConsemeBill",
                  data
                ).then(d => {
                  if (d.success) {
                    if(d.data.billNo=="1"){
                      this.$setCookie("jsondata", JSON.stringify(data));
                      this.$router.push({
                        path: "/NavDetail/Payment",
                        query: {
                          resurl: "/NavDetail/Order",
                          id: this.customerId,
                          amount: (this.Actualmoy-this.accCurAmount-this.accCurCashcou).toFixed(2)
                        }
                      });
                    }else if(d.data.billNo){
                        this.$message({
                          type: "success",
                          message: "开单成功"
                        });
                        this.$route.meta.nokeepAlive = true;
                        this.setDatas({ name: "newOrder", value: true });
                        this.$router.push({
                          path: "/NavDetail/Order"
                        });
                    }
                  }
                });
                
              }
            }
          })
          .catch(() => {});
      }
    },
    // 挂单
    ConsemeBill() {
      if (this.cCode == "") {
        this.$message({
          type: "info",
          message: "请选择会员"
        });
        return;
      }
      let detailList = [];
      let canservEmp = true;
      this.selectedServices.map(el => {
        let newobj = new Object();
        newobj.orderNo = el.orderNo || "";
        newobj.prodName = el.prodName || "";
        newobj.prodId = el.prodId || "";
        newobj.tkCode = el.tkCode || "";
        newobj.psCode = el.prodCode || "";
        newobj.isDCust=el.isDCust?1:0;
        newobj.psServTime = el.psServTime || "";
        newobj.consumeTimes = el.consumeTimes || 1;
        newobj.couponAmount = el.couponAmount || 0;
        newobj.consumePrice = parseFloat(parseFloat(el.streetAmount)-parseFloat(newobj.couponAmount)).toFixed(2);
        newobj.servEmp = [];
        if (el.workNo.length == 0) {
          newobj.servEmp = [];
          canservEmp = false;
        } else {
          el.workNo.map(val => {
            newobj.servEmp.push({ workNo: val.workNo, name: val.empName });
          });
        }
        detailList.push(newobj);
      });
      let getAmountTotal = 0;
      this.selectedServices.map(el => {
        getAmountTotal += el.streetAmount * el.consumeTimes;
      });
      if (detailList.length == 0) {
        this.$message({
          type: "info",
          message: "请选择开单服务"
        });
        return;
      }
      let data = {
        cCode: this.cCode,
        customerId:this.customerId||"",
        position: this.position.workplacNo || "",
        totalMoney: getAmountTotal,
        remark: this.remark,
        detailList: detailList,
        accIntegral: parseFloat(this.accIntegral) || 0,
        couponAmount: parseFloat(this.cashcouAmount) || 0,//:优惠券金额
        couponNo:this.couponNo,
        // cashcouAmount: parseFloat(this.cashcouAmount) || 0,
      };
      if (this.updateShow) {
        //修改
        data.billNo = this.billNo;
      }
      if (canservEmp) {
         this.$post(this.$host+"/api/order/consume/registConsemeBill",data).then(d=>{
           if(d.success){
             this.$message({
              type: "success",
              message: "挂单成功"
            });
            this.$route.meta.nokeepAlive = true;
            this.setDatas({ name: "newOrder", value: true });
            this.$router.push({
              path: "/NavDetail/Order"
            });
           }
         })
      } else {
        this.$messagebox
          .confirm(
            "该消费单有服务项未选择服务员工，相应的业绩将不可分配。您确定仍然继续？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
             this.$post(this.$host+"/api/order/consume/registConsemeBill",data).then(d=>{
              if(d.success){
                this.$message({
                  type: "success",
                  message: "挂单成功"
                });
                this.$route.meta.nokeepAlive = true;
                this.setDatas({ name: "newOrder", value: true });
                this.$router.push({
                  path: "/NavDetail/Order"
                });
              }
            })
          })
          .catch(() => {});
      }
    },
    getBillbtn(){
      this.$post(this.$host+"/api/order/consume/registConsemeList",{}).then(d=>{
        if(d.success){
          this.getbillShow=true;
          this.getbillmodelShow=true;
          this.getbilllist=d.data;
          // this.getbillno(d.data[1].billNo);
        }
      })
    },
    //删除选中的员工
    deleteemployee(item, index) {
      this.employees.splice(index, 1);
    },
    //确认选择的员工
    sureemployee(items) {
      this.modelemployee = false;
      items.map(el => {
        let canpush = true;
        this.selectedServices[this.Index].workNo.map(val => {
          if (el.workNo == val.workNo) {
            canpush = false;
          }
        });
        canpush && this.selectedServices[this.Index].workNo.push(el);
      });
      console.log(items);
    },
    AboutStoreSelected() {},
    // 点击添加业绩员工
    addemployee(item) {
      this.modelemployee = true;
      this.selectedServices.map((el, index) => {
        if (el.prodCode == item.prodCode && el.orderNo == item.orderNo) {
          this.Index = index;
          this.prodIds=[];
          this.prodIds.push(item.prodId)
        }
      });
      this.yuEmployees = [];
      console.log(this.Index);
    },
    deepCopy(arr) {
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        newArr.push(this.copy(arr[i]));
      }
      return newArr;
    },
    copy(obj) {
      let newobj = {};
      for (let attr in obj) {
        newobj[attr] = obj[attr];
      }
      return newobj;
    },
    //去添加新会员
    gotoAdd() {
      this.$router.push({
        path: "/NavDetail/addCustomer",
        query: {
          resurl: "/NavDetail/addOrder"
        }
      });
    },
    handleCurrentChange(index) {},
    ReceiptClick() {
      if (this.updateShow) {
        this.$message({
          type: "info",
          message: "不能修改会员"
        });
        return;
      }
      if (this.cCodeOrNameOrPhone == "") {
        this.$message({
          type: "info",
          message: "请输入查询条件"
        });
        return;
      }
      let data = {
        pageNumber: 1,
        pageSize: 100,
        cCodeOrNameOrPhone: this.cCodeOrNameOrPhone
      };
      this.$post(this.$host + "/api/cust/customer/page", data).then(d => {
        if (d.success) {
          let content = d.data.content;
          this.CustomerDatas = content;
          this.shopReceiptShow = true;
        }
      });
    },
    // 取消会员弹框
    cancleReceipt(item) {
      this.selectReceiptShow = false;
    },
    // 确定选择会员
    sureselectReceipt(item,appoint,noget) {
      this.selectReceiptShow = false;
      this.shopReceiptShow = false;
      if (!item.cCode) {
        return;
      }
      this.InputValue = item.cName + "(" + item.cCode + ")";
      this.$post(this.$host + "/api/order/consume/getCustInfo", {
        cCode: item.cCode
      }).then(d => {
        if (d.success) {
          if (!d.data) {
            this.$message({
              type: "info",
              message: "选择的会员暂无账户信息，请重新选择"
            });
            return;
          }
          this.sanke=false;
          this.cCodeOrNameOrPhone = "";
          this.cName = d.data.customerName;
          // if (this.cCode != d.data.customerCode) {
          //   //换了客户
          //   this.selectedServices = [];
          //   this.accIntegral = "";
          //   this.cashcouAmount = "";
          // }
          this.cCode = d.data.customerCode;
          this.levName = d.data.levelName;
          this.customerId = d.data.customerId;
          this.Integral = d.data.accIntegral;
          this.accCurAmount = parseFloat(d.data.accCurAmount) || 0;
          this.accCurCashcou = parseFloat(d.data.accCurCashcou) || 0;
          this.YHamounts="";
          this.accIntegrals="";
          this.tkCount = d.data.tkCount;
          this.psCount = d.data.psCount;
          if(noget){return}
          this.gettkfw(item,appoint);
        }
      });
    },
    // 获取会员的服务和套卡数据
    gettkfw(item,appoint) {
      this.Search(item,appoint);
      this.SearchGoods(item);
      let data = {
        cCode: this.cCode
      };
      this.$post(
        this.$host + "/api/order/consume/getCustOrderSerList",
        data
      ).then(d => {
        if (d.success) {
          let data = d.data;
          data.map(el => {
            el.serList.map(val => {
              val.orderNo = el.orderNo;
              val.tkCode = el.tkCode;
            });
          });
          // this.getHeight();
          this.servicesDatas = data;
          appoint&&this.servicesDatas.map(el=>{
              el.serList.map(val=>{
                item.serList.map(value=>{
                  if(val.orderNo==value.orderNo&&val.tkCode==value.tkCode&&val.prodCode==value.psCode){
                    this.addtk(val,el,appoint);
                  }
                })
              })
          })
          if(appoint&&item.workNo&&item.prodIds){
              let arr=item.prodIds.split(",");
              arr=arr.map(el=>el=parseFloat(el))
              this.selectedServices.map(el=>{
                  if(arr.indexOf(el.prodId)>0){
                    el.workNo=[{workNo:item.workNo,empName:item.empName}];
                    el.isDCust=true;
                  }
              });
          }
          if (this.servicesDatas.length > 0) {
            this.tklistData[0].active = true;
            this.tklistData[1].active = false;
            this.tklistData[2].active = false;
          } else {
            this.tklistData[0].active = false;
            this.tklistData[1].active = true;
            this.tklistData[2].active = false;
          }
        }
      });
    },
    gettags() {
      this.$post(this.$host + "/api/prod/productcate/tree", {}).then(d => {
        if (d.success) {
          let list = d.list;
          list.map(el => {
            el.active = false;
          });
          this.fwlist = list;
          this.fwlistGoods = this.copyArray(this.fwlist);
        }
      });
    },
    copyArray(arr){
      return arr.map((e)=>{
            if(typeof e==='object'){
              return Object.assign({},e);
            }else{
              return e;
          }
        }) 
    },
    getbillnodetail(billNo){
      this.billNo=billNo;
      this.getbillno(billNo);
      this.closemodelgetbill();
    },
    getbillno(billNo){
        this.updateShow = true;
        let data = {
          billNo: billNo
        };
        this.$post(
          this.$host + "/api/order/consume/EditConsemeBill",
          data
        ).then(d => {
          if (d.success) {
            let acctInfo = d.data.acctInfo; //账户信息
            this.InputValue =
              acctInfo.customerName + "(" + acctInfo.customerCode + ")";
            this.cCode = acctInfo.customerCode;
            this.cName = acctInfo.customerName;
            this.levName = acctInfo.levelName;
            this.customerId = acctInfo.customerId;
            this.Integral = acctInfo.accIntegral;
            this.accCurAmount = parseFloat(acctInfo.accCurAmount) || 0;
            this.accCurCashcou = parseFloat(acctInfo.accCurCashcou) || 0;
            this.tkCount = acctInfo.tkCount;
            let orderInfo = d.data.orderInfo; //原单的订单信息
            this.oldtotalMoney = parseFloat(orderInfo.totalMoney )|| 0;
            this.oldaccAmount = parseFloat(orderInfo.accAmount) || 0;
            this.oldaccIntegral = orderInfo.accIntegral || 0;
            this.accIntegral = orderInfo.accIntegral || 0;
            this.billStatus=orderInfo.billStatus||"";
            if(this.accIntegral>0){
              this.activeJF=true;
              this.accIntegrals=this.accIntegral;
              this.accIntegraljia=this.accIntegral;
            }
            this.oldcashCouAmount = orderInfo.cashCouAmount || 0;
            // this.cashcouAmount = orderInfo.cashCouAmount || 0;
            this.cashcouAmount = orderInfo.couponAmount || 0;
            this.couponNo = orderInfo.couponNo || "";
            if(this.cashCouAmount>0){
              this.activeYH=true;
              this.cashCouAmounts=this.cashCouAmount;
              this.cashCouAmountjia=this.cashCouAmount;
            }
            this.remark = orderInfo.remark;
            this.position.workplacName = orderInfo.workPlcName;
            this.position.workplacNo = orderInfo.position;
            let serList = d.data.serList; //原单的服务信息
            this.oldtimes = serList.length;
            serList.map(el => {
              if (el.tkCode) {
                this.oldtkamount += el.serTimes * parseFloat(el.streetAmount);
              } else {
                el.tkName = "未使用";
              }
              el.salePrice = el.prodPrice;
              el.consumeTimes = el.serTimes;
              if(el.isDCust==1){
                el.isDCust=true
              }else{
                el.isDCust=false
              }
              el.workNo = JSON.parse(el.workNo);
              el.workNo.map((val, index) => {
                val.empName = val.name;
              });
            });
            this.gettkfw();
            this.selectedServices = serList;
          }
        });
    },
    getmounted() {
      let update = this.$route.query.update || "";
      let billNo = this.$route.query.billNo || "";
      this.getbill = this.$route.query.getbill || "";
      this.billNo = billNo;
      this.gettags();
      if (update && billNo) {
        //修改
        if(this.getbill){this.getbillShow=true;}
        this.getbillno(billNo);
      } else {
        // 获取已到店的用户
        this.$post(this.$host + "/api/cust/dateBill/findDateBillCustomers", {
        }).then(d => {
          if (d.success) {
            this.shopNotes = d.data || [];
          }
        });
        let cCode = this.$route.query.cCode || "";
        if(cCode){
          this.cCode=cCode;
          this.customerId=this.$route.query.customerId || "";
          this.cName=this.$route.query.cName || "";
          let obj={
            cCode:this.cCode,
            cName:this.cName,
          }
          this.sureselectReceipt(obj);
        }
        let item = this.$route.query.item || "";
        if (item) {
            let Item = JSON.parse(item);
            Item.psNameList.map(el=>{
              el.tkCode=el.dateTk;
            })
            console.log(111)
            console.log(Item)
            let items=new Object();
            items.cCode=Item.cCode;
            items.empName=Item.empName;
            items.workNo=Item.workNo;
            items.serList=Item.psNameList;
            items.cName=Item.cName;
            items.prodIds=Item.prodIds;
            let appoint=true;
            this.sureselectReceipt(items,appoint);
        }else{
            let _data = {
            customerId: this.customerId,
            prodClass: 0
            };
            this.$post(this.$host + "/api/prod/prtserv/findForStore", _data).then(
            d => {
                if (d.success) {
                this.SetSerData = d.data;
                }
            }
            );
            let goodsdata = {
            customerId: this.customerId,
            prodClass: 2
            };
            this.$post(this.$host + "/api/prod/prtserv/findForStore", goodsdata).then(
            d => {
                if (d.success) {
                this.SetGoodsData = d.data;
                }
            }
            );
        }
      }

      this.$post(this.$host + "/api/order/consume/getScoreRules", {}).then(
        d => {
          if (d.success) {
            if (!d.data.pointDeduct) {
              this.pointShow = false;
              return;
            }
            this.pointDeduct = parseFloat(d.data.pointDeduct);
            if (d.data.pointSynCoupon == "true") {
              this.pointSynCoupon = true;
              this.activeYH=true;
              this.activeJF=true;
            } else if (d.data.pointSynCoupon == "false") {
              this.pointSynCoupon = false;
            } else {
              this.pointShow = false;
            }
            console.log(this.pointSynCoupon);
          }
        }
      );
    }
  },
  mounted() {
    if (this.$getCookie("belongShop")) {
      
      this.getmounted();
      this.updateAlives({ name: "addOrder", key: 1 });
      let auths = JSON.parse(this.$getSession("auths"));
      auths.map(el => {
        if (el.fParentCode == "F062") {
          //点单消费的权限
          if (el.fUrl == "corp") {
            this.corpShow = true;
          }
          if (el.fUrl == "sCode") {
            this.sCodeShow = true;
          }
        }
      });
    } else {
      this.isShop = false;
    }
  }
};
</script>
<style scoped >
.x_model_header {
    padding: 8px 0;
    margin: 0 18px;
    font-size: 14px;
}
.x_model_footer {
    padding: 0 18px 18px;
    text-align: center;
}
.x_model_footer button:last-child {
    margin-left: 24px;
}
.clear:after {
    clear: both;
    content: '';
    display: block;
}
.search_wrap {
    background-color: #fff;
    font-size: 12px;
    border: 1px solid #fff;
    margin-bottom: 12px;
}
.search_wrap li {
    display: inline-block;
    margin: 3px 24px 3px 0;
}
.x_model_main li {
    margin: 6px 0;
}
.x_model_main {
    margin: 12px 18px;
}
.give_coupon.model {
    width: 800px;
}
.modelYHs .modelYHbody{
  padding: 0 52px;
}
.modelYHs .footer{
  text-align: center;
}
.YHli{
  float: left;
  position: relative;
  margin-bottom: 20px;
  width: 304px;
  height: 104px;
  cursor: pointer;
}
.YHli .YHliAdd{
  font-size: 24px;
  color: #CCCCCC;
  line-height: 104px;
  background: #FAFAFA;
  border: 1px solid #EEEEEE;
  border-radius: 4px;
  padding-left: 36px;
}
.YHadd{
  font-size: 36px;
  line-height: 104px;
  margin-right: 12px;
}
.YHadd::before{
  content: "\e614";
}
.YHli:nth-child(even){
  float: right;
}
.YHliName{
  width: 96px;
  position: absolute;
  left: 0;
  top: 0;
  height: 96px;
  line-height: 96px;
  font-size: 14px;
  color: #fff;
  text-align: center;
}
.YHlititle{
  width: 208px;
  position: absolute;
  left: 96px;
  top: 0;
  padding-top: 25px;
  height: 96px;
  font-size: 16px;
  color: #666;
  padding-left: 16px;
}
.YHlititle .leix{
  position: absolute;
  right: 12px;
  top: 6px;
  font-size: 12px;
  color: #FFFFFF;
  padding: 0 5px;
  line-height: 20px;
  background: linear-gradient(-90deg, #BA8DED 0%, #E48CF2 100%);
  border-radius: 12px;
}
.YHlititle p{
  font-size: 12px;
  color: #999;
}
.YHliName span{
  font-size: 30px;
  vertical-align: baseline;
}
.YHgou::before{
  content: "\e8cd";
}
.YHgou{
  position: absolute;
  bottom: 3px;
  right: 3px;
  font-size: 30px;
  color: #C09EFE;
}
.modelgetbill.model{
  width: 800px;
}
.modelYH.model{
  width: 400px;
}
.modelYHs.model{
  width: 800px;
}
.modelYH.model .modelYHbody{
  padding:0 18px;
}
.modelYH.model .footer{
  text-align:center;
}
.modelYH.model .footer button:last-child{
  margin-left:24px;
}
.modelYH.model .modelYHbody>p{
  padding-bottom: 12px;
}
.modelYH.model .modelYHbody>p i{
  color: #1dade2;
  cursor: pointer;
  display: inline-block;
  margin-left: 8px;
}
.modelgetbill.model .getbillbody{
  margin: 0 13px 24px 13px;
}
.modelgetbill.model .getbillbody li.getbillcell{
  float: left;
  width: 193.5px;
  padding: 0 5px;
  margin-bottom: 12px;
}
.getbillicon{
  position: absolute;
  right: 8px;
  top: 0;
}
.strip{
  position: absolute;
  left: 0;
  top: 10px;
  width: 3px;
  height: 50px;
  background: #1dade2;
}
.modelgetbill.model .getbillbody li.getbillcell ul{
  border: 1px solid #dcdfe6;
  padding:0 12px;
  position: relative;
  border-radius: 4px;
}
.modelgetbill.model .getbillbody li.getbillcell li{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selectedposition  .Btn{
  margin-top: 3px;
}
.iconjian::before {
  content: "\e63d";
}
.sanke{
  border: 1px solid #dcdfe6;
  padding: 0px 5px;
  text-align: center;
  cursor: pointer;
  float: right;
  margin-right: 24px;
}
.sanke.active{
  background: #2cbcc8;
  border: 1px solid #2cbcc8;
  color: #fff;
}
.iconcheck::before {
  content: "\E68C";
  color: #dcdfe6;
  margin-right: 6px;
  font-size: 14px;
}
.iconcheck {
  cursor: pointer;
}
.iconcheck.active::before {
  content: "\E67E";
  color: #2cbcc8;
}
.positions {
  background: #fafafa;
  height: 40px;
  line-height: 40px;
  padding: 0 12px;
  margin-top: 12px;
}
.positions .left {
  height: 40px;
}
.positions .right {
  color: #1dade2;
  height: 40px;
  cursor: pointer;
}
.positions .right i {
  font-size: 14px;
  vertical-align: baseline;
}
.tkheader {
  padding-left: 12px;
  font-weight: 600;
}
.icontk::before {
  content: "\e674";
  margin-right: 6px;
}
.iconfw::before {
  content: "\e783";
  margin-right: 6px;
}
.shopNotes {
  position: absolute;
  background: #fff;
  z-index: 1;
}
.shopNotes header {
  background: #fafafa;
  border: 1px solid #efefef;
  border-bottom: none;
}
.tkselected > li {
  background: #fafafa;
  margin-bottom: 12px;
}
.selectedposition {
  padding: 8px 0;
  padding-left: 12px;
}
.selectedposition ul {
  float: left;
}
.selectedposition ul li {
  display: inline-block;
  padding: 0 0.5rem;
  height: 2rem;
  line-height: 2rem;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  margin: 0 12px 0 0;
  color: #999999;
  background: #f4f4f4;
}
.tklistdetail > li:first-child {
  padding-top: 24px;
}
.tklistdetail > li {
  padding-top: 12px;
}
.tklistdetail > .tkValidStatus,
.tklistdetail .psValidStatus {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
}

.selectedServices {
  padding: 12px;
  border-bottom: 1px solid #efefef;
}
.selectedServices > .left {
  width: 100px;
}
.selectedServices > .right {
  width: 100%;
  padding-left: 112px;
  height: 75px;
  margin-top: -75px;
}
.selectedServices > .right .bottom {
  color: #ff962f;
}
.selectedServices img {
  width: 100%;
}
.kfdetail {
  /* border-top: 1px solid #efefef; */
  border-bottom: 1px solid #efefef;
}
.kfdetail .left img {
  width: 48px;
  border-radius: 50%;
  margin: 6px;
}
.kfdetail .left {
  color: #ab9ee6;
  font-size: 14px;
  cursor: pointer;
}
.kfdetail .right {
  line-height: 70px;
  padding-right: 12px;
  font-size: 14px;
  cursor: pointer;
}
.icondelete::before {
  content: "\e659";
  color: #1dade2;
  font-size: 14px;
  cursor: pointer;
}
.fwlistdetail > li {
  float: left;
  width: 16.66%;
  cursor: pointer;
  margin-bottom: 12px;
  min-width: 180px;
}
.fwlistdetail > li .liDetail {
  margin-right: 18px;
  box-shadow: 0px 2px 2px #efefef;
}
.fwlistdetail > li .liDetail .img{
  position: relative;
  height: 0;
  overflow: hidden;
  padding-bottom:  75%;
}
.fwlistdetail > li .liDetail .img img{
  position: absolute;
  width: 100%; 
  height: 100%;
  top: 0;
  left: 0
}
.fwlistdetail > li .liprice {
  padding: 0 12px;
  border: 1px solid #efefef;
  border-top: none;
}
.fwlistdetail > li img {
  width: 100%;
  height: 59.70516%;
}
.tklistdetail > li > header span {
  font-size: 14px;
  vertical-align: baseline;
  margin-right: 12px;
  font-weight: 600;
}
.tklistdetail > li > header i {
  color: #eb8617;
}
.tklistdetail > li > ul > li {
  width: 16.66%;
  cursor: pointer;
  float: left;
  margin-bottom: 12px;
  min-width: 180px;
  
}
.tklistdetail > li > ul > li .liDetail .liprice{
padding: 0 12px;
    border: 1px solid #efefef;
    border-top: none;
}
.tklistdetail .liprice .grade i{
  width: 60px;
}
.tklistdetail > li > ul > li .liDetail {
    margin-right: 18px;
    box-shadow: 0px 2px 2px #efefef;
}
.tklistdetail > li > ul > li .liDetail .img .tag{
  position: absolute;
  right: 0;
  top: 0;
}
.tklistdetail > li > ul > li .liDetail .img{
  position: relative;
  height: 0;
  overflow: hidden;
  padding-bottom:  75%;
}
.tklistdetail > li > ul > li .liDetail .img img.pro {
  position: absolute;
  width: 100%; 
  height: 100%;
  top: 0;
  left: 0
}
.tkfws {
  margin-top: 12px;
}
.fwlist {
  margin: 12px 0;
}
.fwlist li {
  float: left;
  margin-right: 24px;
  padding: 0 10px;
  cursor: pointer;
}
.fwlist li.active {
  color: #2cbcc8;
}
.tklist {
  display: inline-block;
  margin-right: 12px;
}
.tklist li {
  float: left;
  border: 1px solid #efefef;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.tklist li.active {
  border: 1px solid #2cbcc8;
  color: #2cbcc8;
}
.icongou::before {
  content: "\E650";
  position: absolute;
  font-size: 36px;
  right: -10px;
  bottom: -9px;
}
.leftaddReceipt {
  width: 70%;
  padding-top: 14px;
  margin-bottom: -3000px;
  padding-bottom: 3000px;
  /* border-right: 1px solid #dcdfe6; */
}
.rightaddReceipt {
  margin-bottom: -3000px;
  padding-bottom: 3000px;
  width: 30%;
  border-left: 1px solid #dcdfe6;
}
.selectemp {
  position: relative;
  display: inline-block;
}
.sousuo {
  position: absolute;
  right: 0;
  top: 1px;
  border-left: 1px solid #dcdfe6;
  width: 26px;
  height: 26px;
  text-align: center;
  cursor: pointer;
}
.sousuo.active {
  border-left: 1px solid #2cbcc8;
}
.iconss::before {
  content: "\e632";
}
.sousuo.active .iconss {
  color: #2cbcc8;
}
.tkbody {
  padding: 0 18px 24px 18px;
}
.modelservice.tk {
  width: 1035px;
}
.workplac {
  width: 100px;
  height: 50px;
  border: 1px solid #efefef;
  text-align: center;
  line-height: 50px;
  position: relative;
  cursor: pointer;
}
.workplac .iconClose {
  position: absolute;
  right: 0;
  top: -18px;
}
.Addcard {
  width: 75rem;
  height: 50rem;
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.modelservice .AddcardTheader {
  font-size: 1.166667rem;
  color: #2cbcc8;
  padding: 0 1rem;
  background: #fff;
  line-height: 3rem;
}
.AddcardSearch {
  font-size: 1rem;
  font-family: SimHei;
  color: #666666;
  padding: 0 2.5rem;
}
.AddcardBtn {
  position: absolute;
  right: 3%;
  bottom: 1.666667rem;
}
.cardElement {
  width: 18%;
  display: inline-block;
  margin: 0 1rem 2rem 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  border: solid 2px #e6e2f7;
  padding: 1rem;
  background: #fff;
}
.Background {
  border: 2px solid #ab9ee6;
}
.BoxElement {
  border: solid 0.5rem #e6e2f7;
  text-align: center;
  font-size: 1rem;
  color: #666666;
  font-family: SimHei;
  line-height: 2.5rem;
}
.BoxElement p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.TextLine {
  text-decoration: line-through;
}
.TextColor {
  color: #ed8617 !important;
}
.AddcardBtn {
  position: absolute;
  right: 3%;
  bottom: 1.666667rem;
}
.cardText {
  font-family: SimHei;
  font-size: 0.666667rem;
  line-height: 1.666667rem;
}
.cardImg {
  width: 100%;
  cursor: pointer;
}
.AddcardBox {
  width: 93%;
  height: 75%;
  margin: 0 auto;
  margin-top: 1rem;
  border: #f3f3f6 solid 1px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 1rem 1rem;
}
.padding {
  padding: 0 12px;
}
.tkbody .left {
  float: left;
}
.xian {
  width: 100%;
  height: 1px;
  display: block;
  background: #efefef;
}
.tkbody .left.right {
  padding-left: 2rem;
}
.tkbody li {
  border: 1px solid #efefef;
  border-bottom: none;
  padding-left: 10px;
  height: 30px;
  line-height: 30px;
}
.tkbody li:last-child {
  border-bottom: 1px solid #efefef;
}
.tkbody li:hover {
  background: #effafb;
}
.tkbody ul {
  width: 200px;
}
.billtotal li .left {
  width: 100px;
  text-align: right;
}
.billtotal li .right {
  width: 100px;
  text-align: right;
  color: #ff5500;
}
.modelservice.model {
  width: 400px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: #fff;
}
.modelservice.tk .footer {
  width: 100%;
}
.servicebody {
  padding: 0 18px;
}
.servicebody ul {
  width: 750px;
  margin: 0 auto;
}
.servicebody li {
  float: left;
  text-align: center;
  font-size: 16px;
  border: 1px solid #dcdfe6;
  padding: 1rem;
  width: 250px;
  height: 68px;
  cursor: pointer;
}
.servicebody li:hover {
  color: #fff;
  background: #3bb19c;
}
.servicebody li.onlyser {
  line-height: 40px;
}
.servicebody li p {
  color: #eb8617;
  font-size: 12px;
}
.iconsign::before {
  content: "\e62d";
}
.iconClose::before {
  content: "\e61a";
  cursor: pointer;
}
.footer {
  padding: 24px 10px;
}
.footer .Billing {
  font-size: 18px;
  color: #fff;
  text-align: center;
  background: #2cbcc8;
  border-radius: 2px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  display: inline-block;
  width: 40%;
}
.footer .Billing:hover {
  background: #7ad0d8;
}
.footer .actAmount i{
  margin-right: 5%;
  font-size: 24px;
  color: #ff962f;
}
.footer button {
  margin-left: 2rem;
}
.footer div{
    margin-top: 24px;
    text-align: right;
}
.padd {
  padding-left: 24px;
}
.remark {
  margin-top: 12px;
  padding-left: 12px;
}
.addReceipt {
  margin-top: -14px;
}
.tCenter {
  text-align: center;
}
.berName {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  display: inline-block;
}
.grade {
  color: #ff962f;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
width: 100%;
    display: inline-block;
}
.liprice .grade i {
  width: 50px;
}
.grade i {
  display: inline-block;
  width: 60px;
  text-align: right;
  color: #666666;
}
.border {
  width: 900px;
  margin-bottom: 3.333333rem;
}
.border .right {
  float: right;
}
.Name {
  color: #2cbcc8;
  font-size: 18px;
}
.employee {
  margin-top: 3.333333rem;
}
.employee ul li {
  float: left;
  border: 1px solid #ccc;
  padding: 5px;
  cursor: pointer;
}
.employee ul li:hover {
  border: 1px solid #4db0e8;
  color: #4db0e8;
}
.employee ul li .iconF::before {
  content: "\E61A";
}
.model {
  width: 600px;
}
.detail .Cell {
  float: left;
  width: 50%;
  padding-bottom: 12px;
}
.detail .Cell span {
  float: left;
  width: 50%;
  text-align: right;
}
.detail .Cell div {
  float: left;
  width: 50%;
  color: #ff962f;
}
.sum {
  margin: 2rem auto;
  width: 480px;
  padding-bottom: 20px;
}
.detail img {
  width: 48px;
  border-radius: 100%;
}
.tCenter > div {
  margin-top: 12px;
  color: #ab9ee6;
}
.tCenter .berName {
  font-size: 14px;
}
</style>