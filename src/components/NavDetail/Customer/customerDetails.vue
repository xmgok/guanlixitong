<template>
    <div class="right_content_wrap customer_detail">
        <div class="right_content">
            <div class="detail_left left">
                <div class="detail_left_top">
                    <div class="customer_name">
                        <img src="http://p3t5upnkj.bkt.clouddn.com/20180425182928708_微信图片_20180425144038.jpg?imageView2/1/w/60/h/60" alt="">
                        <p>
                            {{datas.cName}} ({{datas.cGender===0?'男':'女'}})

                        </p>
                    </div>
                    <div class="customer_msg">
                        <i class="icon weixin pointer"></i>
                        <i class="icon dianhua pointer"></i>
                        <i class="icon youxiang pointer"></i>
                    </div>

                </div>
                <div class="detail_left_bottom">
                    <ul>
                        <li>
                            <span>
                                可用总余额：
                            </span>
                            <span class="pointer" @click='seeBalance'>
                                <span>
                                    ￥{{Number(customerAccount.accCurAmount) +Number(customerAccount.accCurCashcou) }}
                                </span>
                                <span>
                                    >>
                                </span>
                            </span>
                        </li>
                        <li>
                            <span>
                                可用积分：
                            </span>
                            <span class="pointer" @click="seeIntegral">
                                <span>
                                    ￥{{customerAccount.accIntegral}}
                                </span>
                                <span>
                                    >>
                                </span>
                            </span>
                        </li>
                        <li>
                            <span>
                                套卡数量：
                            </span>
                            <span class="pointer" @click="seeCard">
                                <span>
                                    ￥{{customerAccount.tkCount}}
                                </span>
                                <span>
                                    >>
                                </span>
                            </span>
                        </li>
                        <li>
                            <span>
                                优惠券：
                            </span>
                            <span class="pointer" @click="seeCoupon">
                                <span>
                                    <!-- ￥{{customerAccount.tkCount}} -->
                                </span>
                                <span>
                                    >>
                                </span>
                            </span>
                        </li>

                    </ul>
                </div>
            </div>
            <div class="detail_right left">
                <div class="detail_right_content">
                    <el-tabs v-model="activeName" @tab-click="tabClick">
                        <el-tab-pane label="个人资料" name="first">
                            <ul class="personal_data ">
                                <li>
                                    <span>
                                        会员编号：
                                    </span>
                                    <span>
                                        {{datas.cCode}}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        手机号：
                                    </span>
                                    <span>
                                        {{datas.cPhoneHide}}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        会员等级：
                                    </span>
                                    <span>
                                        {{customerAccount.levelName}}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        成长值：
                                    </span>
                                    <span>
                                        {{customerAccount.growVal}}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        会员状态：
                                    </span>
                                    <span>
                                        {{datas.cCustStatus}}
                                    </span>
                                </li>

                                <li>
                                    <span>
                                        是否为内部员工：
                                    </span>
                                    <span>

                                        {{datas.cWorkNo==null?"否":"是，工号："+datas.cWorkNo}}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        归属门店：
                                    </span>
                                    <span>
                                        {{datas.cStore}}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        归属顾问：
                                    </span>
                                    <span v-if='datas.cSaleMgrName'>
                                        {{datas.cSaleMgrName}}（{{datas.cSaleMgrWorkNo}}）
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        归属技师：
                                    </span>
                                    <span v-if='datas.cBlongEmpName'>
                                        {{datas.cBlongEmpName}}（{{datas.cBlongEmpWorkNo}}）
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        来源类型：
                                    </span>
                                    <span>
                                        {{datas.cFromType}}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        来源渠道：
                                    </span>
                                    <span>
                                        {{datas.cFrom}}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        备注：
                                    </span>
                                    <span>
                                        {{datas.cRemark}}
                                    </span>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="拓展信息" name="second">
                            <div>
                                <ul>
                                    <li>
                                        <span>
                                            会员标签
                                        </span>

                                        <span class="icon icon-bianji" @click="editTag"></span>
                                        <ul class="tag" v-show="sureTagData.length>0">
                                            <li class="tagdetail" v-for="item in sureTagData">
                                                <span class="tagDetailTitle">{{item.tagName}}:</span>
                                                <ul class="label_content">
                                                    <li v-for="items in item.detail" class="x_tags" @click="">{{items.value}}
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>
                                            特殊日期
                                        </span>
                                        <span class="icon icon-bianji" @click="editTechnicalDates"></span>
                                        <ul class="tag" v-show="sureTagData.length>0">
                                            <li class="tagdetail">
                                                <!-- <span class="tagDetailTitle">{{item.tagName}}:</span> -->
                                                <ul class="label_content">
                                                    <li v-for="item in this.technicalDatesData " class="x_tags" @click="">
                                                        {{item.dateTypeName+ "："+item.cDate}}
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>
                                            客户关系
                                        </span>

                                        <span class="icon icon-bianji" @click="editCustomerRelationBtn"></span>
                                        <ul class="tag" v-show="sureTagData.length>0">
                                            <li class="tagdetail">
                                                <!-- <span class="tagDetailTitle">{{item.tagName}}:</span> -->
                                                <ul class="label_content">
                                                    <li v-for="item in relationData " class="x_tags" @click="">
                                                        {{item.socDicName+ "："+item.socCustomerName + "（"+ item.socCustomerCode +"）"}}
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="护理日志" name="third">
                            <div>
                                <el-table :data="nurseLogData" border style="width: 100%">
                                    <el-table-column label="重要程度" width="200">
                                        <template slot-scope="scope">
                                            <el-rate v-model="scope.row.careDegree" disabled show-text :texts="['极差', '失望', '一般', '满意', '惊喜']"> </el-rate>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="recorder" width="180" label="记录人">
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="记录日期" width="200">
                                    </el-table-column>
                                    <el-table-column width="100">
                                        <template slot-scope="scope">
                                            <Button small="Btn small" Name="查看详情" @click.native="seeNurseDetail(scope.row)"></Button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column min-width='1'>
                                    </el-table-column>
                                </el-table>
                                <div class="pagingwidth">
                                    <Paging :handleCurrentChange="getNursePage" :total="nurseLogTotal" />
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="消费记录" name="four">
                            <div>
                                <el-table :data="expenseData" border style="width: 100%">
                                    <el-table-column label="消费单号" width="200" fixed='left'>
                                        <template slot-scope="scope">
                                            <Button small="Btn small" :Name="scope.row.billNo" @click.native="seeBillDetail(scope.row.billNo)"></Button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="sName" width="180" label="消费门店">
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="消费时间" width="200">
                                    </el-table-column>
                                    <el-table-column prop="psEndTime" label="确认时间" width="200">
                                    </el-table-column>
                                    <el-table-column prop="psName" label="服务项目" width="200">
                                        <template slot-scope="scope">
                                            <el-popover placement="top-start" title="服务项目" width="200" trigger="hover" :open-delay='500'>
                                                <ul>
                                                    <li v-for='(item,key) in scope.row.psNames' :key="key">{{item}}</li>
                                                </ul>
                                                <div slot="reference">
                                                    <Button small="Btn small" :Name="scope.row.psName"></Button>
                                                </div>
                                            </el-popover>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="psName" label="服务员工" width="200">
                                        <template slot-scope="scope">
                                            <el-popover placement="top-start" title="服务员工" width="200" trigger="hover" :open-delay='500'>
                                                <ul>
                                                    <li v-for='(item,key) in scope.row.empNames' :key="key">{{item}}</li>
                                                </ul>
                                                <div slot="reference">
                                                    <Button small="Btn small" :Name="scope.row.empName"></Button>
                                                </div>
                                            </el-popover>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="totalMoney" label="消费总额" width="100">
                                    </el-table-column>
                                    <el-table-column prop="time" label="服务时长" width="100">
                                    </el-table-column>
                                    <el-table-column min-width='1'>
                                    </el-table-column>
                                </el-table>
                                <div class="pagingwidth">
                                    <Paging :handleCurrentChange="expensePage" :total="expenseTotal" />
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="开卡记录" name="five">
                            <div>
                                <el-table :data="openCardDatas" style="width:100%" border>
                                    <el-table-column prop="storeName" label="门店" width="200">

                                    </el-table-column>
                                    <el-table-column prop="psName" label="会员" width="100">
                                        <template slot-scope="scope">
                                            <span>
                                                <span>{{scope.row.customerName}}</span>
                                                <i v-if="scope.row.workNo" :title="'内部员工，工号：'+scope.row.workNo" class="icon sign"></i>
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="创建日期" width="200">

                                    </el-table-column>
                                    <el-table-column label="开卡单号" width="250">
                                        <template slot-scope="scope">
                                            <Button :Name="scope.row.orderNo" class="Btn" @click.stop.native="SeeDetail(scope.$index,scope.row)" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="ordStatus" label="状态" width="150">
                                        <template slot-scope="scope">
                                            <span> {{ (scope.row.ordStatus==1?'已开卡':'已退卡') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="ordStatus" label="操作" width="100" fixed="right">
                                        <template slot-scope="scope">
                                            <Button Name="退卡" v-if="scope.row.ordStatus==1" class="Btn" @click.native.stop="Revoke(scope.$index,scope.row)" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column min-width="1" fixed="right"></el-table-column>
                                </el-table>
                                <div class="pagingwidth">
                                    <Paging :handleCurrentChange="getOpenCardDatas" :total="openCardTotal" />
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="等级变动历史" name="six">
                            <el-table :data="cusLevelDatas" style="width:100%" border>
                                <el-table-column label="客户名称" prop="cName" width="120"></el-table-column>
                                <el-table-column label="客户编号" prop="cCode" width="120"></el-table-column>
                                <el-table-column label="客户手机号" prop="cPhone" width="150"></el-table-column>
                                <el-table-column label="变动前等级名称" prop="fromName" width="200"></el-table-column>
                                <el-table-column label="变动时间" prop="createTime" width="200">
                                    <template slot-scope="scope">{{$dateFormat("yy-MM-dd",scope.row.createTime)}}</template>
                                </el-table-column>
                                <el-table-column label="变动后等级名称" prop="toName" width="200"></el-table-column>
                                <el-table-column min-width="1"></el-table-column>
                            </el-table>
                            <div class="pagingwidth">
                                <Paging :handleCurrentChange="getCusLevelDatas" :total="cusLevelTotal" :pageSize='20' />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="跟进员工变动历史" name="seven">
                            <el-table :data="custchghistDatas" style="width:100%" border>
                                <el-table-column label="工号" prop="workNo" width="150"></el-table-column>
                                <el-table-column label="员工姓名" prop="empName" width="150"></el-table-column>
                                <el-table-column label="是否主跟进人" prop="isMain" width="150"></el-table-column>
                                <el-table-column label="跟进类型" prop="flowType" width="150"></el-table-column>
                                <el-table-column label="跟进开始时间" prop="createTime" width="200"></el-table-column>
                                <el-table-column label="跟进结束时间" prop="endTime" width="200"></el-table-column>

                                <el-table-column min-width="1"></el-table-column>
                            </el-table>
                            <div class="pagingwidth">
                                <Paging :handleCurrentChange="getCustchghistDatas" :total="custchghistTotal" />
                            </div>

                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <!--  -->

            <!--  -->
        </div>

        <div class='x_model customer_tag' v-if="tagShow">
            <div class="model_content">
                <header class="x_model_header clear">
                    <div class="left">选择会员标签</div>
                    <div class="right curor icon Fork" @click="closeModel"></div>
                </header>
                <div class="x_model_main">
                    <ul class="tagSelected clearfix">
                        <li v-for="(item,index) in tagSelected" @click="cancleSelected(item,index)">{{item.tagName+">"+item.value}}
                            <i class="icon CloseIcon"></i>
                        </li>
                    </ul>
                    <div class="clearfix tag_content">
                        <div class="left">
                            <ul class="leftUl">
                                <li class="tagSort">标签类别
                                    <i></i>
                                </li>
                                <ul class="tableShow">
                                    <li v-for="(item,index) in tagTit" @click="selectTagTitFun(item,index)">
                                        <i class="icon x_unchecked" :class="{x_checked:item.isChecked}"></i>{{item.tagName}}</li>
                                    <li v-if="tagTit.length<7" v-for="it in tagTit.length>7?0:(7-tagTit.length)"></li>
                                </ul>
                            </ul>
                        </div>
                        <div class="right">
                            <ul class="leftUl" v-if="tagDatas.length>0">
                                <li class="tagSort">标签值（{{tagDatas[0].tagMode==1?"可多选":"单选"}}）
                                    <i></i>
                                </li>
                                <ul class="tableShow">
                                    <li v-for="(item,index) in tagDatas" @click="selectTagDatas(item,index)">
                                        <i v-if='item.tagMode==1' class="icon x_unchecked" :class="{x_checked:item.isChecked}"></i>
                                        <i v-if='item.tagMode==0' class="icon x_unradio" :class="{x_radio:item.isChecked}"></i>{{item.value}}
                                    </li>
                                    <li v-if="tagDatas.length<7" v-for="it in tagDatas.length>7?0:(7-tagDatas.length)"></li>
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="x_model_footer">
                    <Button Name="取消" @click.native="closeModel" buttonClass="None" />
                    <Button Name="确定" @click.native="sureSelected" />
                </div>
            </div>
        </div>
        <!--特殊日期  -->

        <div class='x_model customer_date' v-if="technicalDatesShow">
            <div class="model_content">
                <header class="x_model_header clear">
                    <div class="left">编辑特殊日期</div>
                    <div class="right curor icon Fork" @click="closeModelTechnical"></div>
                </header>
                <div class="x_model_main">

                    <div class="date_content">
                        <ul>
                            <li>
                                <el-select class="sel_tit" v-model='addTechnicalDatesData.dateType' placeholder="请选择">
                                    <el-option v-for="(item,index) in dateTypeSelect" :label="item.dateTypeName" :value="item.dateType" :key="index">
                                    </el-option>
                                </el-select>
                                <el-date-picker v-model="addTechnicalDatesData.cDate" type="date" placeholder="选择日期" format='MM月dd日'>
                                </el-date-picker>
                                <span class="add_customer_btn" @click="addTechnicalDatesBtn">
                                    <i class="icon tianjia"></i>添加
                                </span>
                            </li>
                            <li v-for="item in editTechnicalDatesData">
                                <el-select v-model='item.dateType' placeholder="请选择">
                                    <el-option v-for="(item,index) in dateTypeSelect" :label="item.dateTypeName" :value="item.dateType" :key="index">
                                    </el-option>
                                </el-select>
                                <el-date-picker v-model="item.cDate" type="date" placeholder="选择日期" format='MM月dd日'>
                                </el-date-picker>
                                <span class="add_customer_btn" @click="delTechnicalDatesData(item,index)">
                                    <i class="icon shanchu"></i>删除
                                </span>
                                <!-- <i class="icon quxiao" @click='delTechnicalDatesData'></i> -->
                            </li>

                        </ul>
                    </div>

                </div>
                <div class="x_model_footer">
                    <Button Name="取消" @click.native="closeModelTechnical" buttonClass="None" />
                    <Button Name="确定" @click.native="sureEditTechnicalDates" />
                </div>
            </div>
        </div>
        <!--  -->

        <!-- 客户关系 -->
        <div class='x_model customer_date' v-if="customerRelationShow">
            <div class="model_content">
                <header class="x_model_header clear">
                    <div class="left">编辑客户关系</div>
                    <div class="right curor icon Fork" @click="closeModelRelation"></div>
                </header>
                <div class="x_model_main">
                    <!-- <div class="tagSelected clearfix">
                        <Button Name="新增" @click.native="addRelationBtn" />
                    </div> -->
                    <div class="date_content">
                        <ul>
                            <!-- v-show='addRelationShow' -->
                            <li>
                                <el-select v-model='addRelationData.socDicKey' placeholder="请选择会员关系">
                                    <el-option v-for="(item,index) in relationSecect" :label="item.socDicName" :value="item.socDicKey" :key="index">
                                    </el-option>
                                </el-select>
                                <div class="select_customer">
                                    <input class="x_input" type="text" v-model='customerPhone' placeholder="请输入会员手机号查询" />
                                    <Button Name="查询" @click.native="queryCustomer(1)" />
                                    <span v-if='customerData.length!=0||customerDataShow' class="add_customer_btn">
                                        <input readonly v-model='customerData[0].cName' class="customer_name" type="text" placeholder="该会员不存在">
                                        <span class="add_customer_btn" @click="addCustomerBtn">
                                            <i class="icon tianjia"></i>添加
                                        </span>
                                    </span>
                                </div>

                            </li>
                            <li v-for="(item,index) in editRelationData">
                                <el-select v-model='item.socDicKey' placeholder="请选择">
                                    <el-option v-for="(item,index) in relationSecect" :label="item.socDicName" :value="item.socDicKey" :key="index">
                                    </el-option>
                                </el-select>
                                <!-- <input type="text" v-model='item.socCustomerPhone' placeholder="请输入会员手机号查询" /> -->
                                <input class="x_input" type="text" v-model='item.socCustomerPhone' placeholder="请输入会员手机号查询" />
                                <Button Name="查询" @click.native="queryCustomer(2,item)" />
                                <input readonly v-model='item.socCustomerName' class="customer_name" type="text" placeholder="该会员不存在">
                                <span class="add_customer_btn" @click="delRelationData(item,index)">
                                    <i class="icon shanchu"></i>删除
                                </span>
                            </li>

                        </ul>
                    </div>

                </div>
                <div class="x_model_footer">
                    <Button Name="取消" @click.native="closeModelRelation" buttonClass="None" />
                    <Button Name="确定" @click.native="sureEditRelation" />
                </div>
            </div>
        </div>
        <!-- 客户关系 -->
    </div>
</template>
<script>
import Button from "../../common/Button";
import Paging from "../../common/Paging";
import Input from "../../common/Input";
import Vue from "vue";
import { Radio, Select, Option, DatePicker, Tabs, TabPane, } from "element-ui";
Vue.use(Select);
Vue.use(Option);
Vue.use(Radio);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(DatePicker);
export default {
    components: { Button, Paging, Input },
    // props:[values,],
    data() {
        return {
            //开卡记录总个数
            openCardTotal: 0,

            //开卡记录
            openCardDatas: [],

            //当前客户code
            cCode: '',

            //护理日志
            nurseLogData: [],

            //消费记录
            expenseData: [],

            //expense
            expenseTotal: 0,

            //护理日志总个数
            nurseLogTotal: 0,

            //activeName
            activeName: "first",
            //数据
            datas: [],

            //客户标签
            customerLebal: [],

            //标签 false 
            tagShow: false,

            //特殊日期 model show
            technicalDatesShow: false,

            //新增特殊日期显示
            addTechnicalDateShow: false,

            //客户关系 show
            customerRelationShow: false,

            //新增客户关系显示
            addRelationShow: false,

            //查询到的客户信息显示
            customerDataShow: false,

            //确定标签数据
            sureTagData: [],

            //已选标签
            tagSelected: [],

            //标签 
            tagTit: [],

            //标签值
            tagDatas: [],

            //已选标签值
            selTagDatas: [],

            //特殊日期
            technicalDatesData: [],

            //特殊日期选项
            dateTypeSelect: [],

            //添加特殊日期
            addTechnicalDatesData: {
                dateType: "",
                cDate: '',
                dateTypeName: ''
            },

            //编辑特殊日期
            editTechnicalDatesData: [],

            //客户关系选项
            relationSecect: [],

            //客户关系
            relationData: [],

            //添加客户关系
            addRelationData: {
                socCustomerId: "",
                socCustomerName: "",
                socDicKey: "",
                socDicName: "",
                socRemark: ""
            },

            //编辑客户关系
            editRelationData: [],

            //手机号查询到的客户
            customerData: [{
                cName: '输入手机号搜索',
                id: ''
            }],

            //新增手机号查询客户
            customerPhone: '',

            //手机号查询到的用户
            queryCustomerData: {
                socCustomerId: '',
                socCustomerCode: "",
                socCustomerPhone: "",
                socCustomerName: "",
                socDicKey: "",
                socDicName: "",
                socRemark: ""
            },


            //客户账户 展示
            customerAccount: {
                accLockAmount: '',//锁定金额
                accCurAmount: '',//当前余额
                accCurCashcou: '',//当前赠送金额
                lockCurCashcou: '',//当前锁定赠送金额
                customerId: '',//客户id
                customerCode: '',//客户编码
                customerName: '',//客户名称
                levelName: '',//客户等级
                tkCount: '',//套卡数量
                growVal: '',//成长值
            },

            //客户id
            customerId: '',
            //客户code
            customerCode: '',

            //客户等级total
            cusLevelTotal: 0,

            //客户等级数据
            cusLevelDatas: [],

            //客户跟进员工变动 数据
            custchghistDatas: [],
            //客户跟进员工变动 total
            custchghistTotal: 0,

        }
    },

    methods: {
        //查看优惠券
        seeCoupon() {

        },
        //客户等级变动历史
        getCusLevelDatas(index) {
            let _data = {
                pageNumber: parseInt(index),
                pageSize: 20,
                cCodeOrNameOrPhone: this.$route.query.code,
            }
            this.$post(this.$host + `/api/cust/lev/changehist/page`, _data).then(d => {
                if (d.success) {
                    this.cusLevelDatas = d.data.content;
                    this.cusLevelTotal = d.data.total;
                }
            })
        },
        //客户跟进员工变动历史
        getCustchghistDatas(index) {
            if (this.custchghistDatas.length == 0) {
                let _data = {
                    pageNumber: parseInt(index),
                    pageSize: 20,
                    cCode: this.$route.query.code,
                }
                this.$post(this.$host + '/api/cust/custFlowHist/findCustFlowHistPage', _data).then(d => {
                    if (d.success) {
                        d.data.content.map(el => {
                            switch (el.flowType) {
                                case 1: el.flowType = '技师'; break;
                                case 2: el.flowType = '顾问'; break;
                            }
                            switch (el.isMain) {
                                case 0: el.isMain = '否';
                                case 1: el.isMain = '是';
                            }
                            el.endTime = this.$dateFormat('yy-MM-dd hh:mm:ss', el.endTime)
                            el.createTime = this.$dateFormat('yy-MM-dd hh:mm:ss', el.createTime)
                        })
                        this.custchghistDatas = d.data.content;
                        this.custchghistTotal = d.data.total;
                    }
                })
            }

        },
        //查看客户余额按钮
        seeBalance() {
            this.$router.push({
                path: "/NavDetail/Customer/customerBalance",
                query: {
                    code: this.customerCode,
                    id: this.customerId,
                }
            })
        },

        //查看客户积分按钮
        seeIntegral() {
            this.$router.push({
                path: "/NavDetail/Customer/integral",
                query: {
                    code: this.customerCode
                }
            })
        },

        seeCard() {
            this.$router.push({
                path: "/NavDetail/Customer/customerCard",
                query: {
                    code: this.customerCode
                }
            })
        },

        //查看消费单详情
        seeBillDetail(item) {
            this.$router.push({
                path: "/NavDetail/OrderDetail",
                query: {
                    billNo: item,
                }
            })
        },

        //查看护理日志详情
        seeNurseDetail(item) {
            this.$router.push({
                path: "/NavDetail/nurseLog/addNurse",
                query: {
                    id: item.id,
                    type: '_see',//   护理日志id  
                }
            });
        },

        //tab click
        tabClick(e) {
            if (e.name === "third") { //加载护理日志
                this.getNursePage();
            } else if (e.name === "four") {
                this.expensePage();
            } else if (e.name === "five") {
                this.getOpenCardDatas(1)
            } else if (e.name === "six") {
                this.getCusLevelDatas(1)
            } else if (e.name === "seven") {
                this.getCustchghistDatas(1)
            }
        },

        //查看套卡详情
        SeeDetail(index, item) {
            this.$router.push({ path: "/NavDetail/OpenCardInfo", query: { orderNo: item.orderNo } })
        },

        //退卡
        Revoke(index, item) {
            this.$router.push({ path: "/NavDetail/RevokeCard", query: { orderNo: item.orderNo } })
        },
        //开卡记录
        getOpenCardDatas(index) {

            let _data = {
                cCode: this.customerCode,
                pageSize: 20,
                pageNumber: parseInt(index)
            }
            this.$post(this.$host + "/api/order/ord/findOrder", _data).then(d => {
                if (d.success) {
                    let content = d.data.content
                    content.map(e => { e.createTime != null ? e.createTime = this.$dateFormat("yy-MM-dd hh:mm:ss", e.createTime) : "--" })
                    this.openCardDatas = content
                    this.openCardTotal = d.data.total
                }
            })
        },

        //获取消费记录
        expensePage(index) {
            // if (this.expenseData === 0) {
            let par = {
                cCode: this.customerCode,
                pageNumber: 1,
                pageSize: 20,
            };
            if (typeof (index) !== "object" && typeof (index) !== "undefined") {
                par.pageNumber = parseInt(index);
            }
            this.$post(this.$host + "/api/order/consume/findConsumebillByCCodePage", par)
                .then(d => {
                    if (d.success) {
                        this.expenseData = d.data.content;
                        this.expenseTotal = d.data.total;
                        this.expenseData.map(el => {
                            el.psEndTime = el.psEndTime === null ? "--" : this.$dateFormat('yy-MM-dd hh:mm:ss', el.psEndTime);
                            el.createTime = el.createTime === null ? "--" : this.$dateFormat('yy-MM-dd hh:mm:ss', el.createTime);
                            el.time === null ? el.time = 0 + " min" : el.time + " min";
                            el.totalMoney = "￥ " + el.totalMoney
                            if (el.psName) {
                                let psArr = el.psName.split(',')
                                el.psName = psArr.length == 1 ? psArr[0] : psArr[0] + '...';
                                el.psNames = psArr;
                            }
                            if (el.empName) {
                                let empArr = el.empName.split(',');
                                el.empName = empArr.length == 1 ? empArr[0] : empArr[0] + '...';
                                el.empNames = empArr;
                            }
                        })
                    }
                });
        },

        //护理日志数据加载翻页
        getNursePage(index) {
            if (this.nurseLogData.length === 0) {
                let par = {
                    cCode: this.customerCode,
                    pageNumber: 1,
                    pageSize: 10,
                }
                if (typeof (index) !== "object" && typeof (index) !== "undefined") {
                    par.pageNumber = parseInt(index);
                }
                this.$post(this.$host + "/api/cust/customer/findCServLogByCcode", par)
                    .then(d => {
                        if (d.success) {
                            this.nurseLogData = d.data.content;
                            this.nurseLogData.map(el => {
                                el.createTime = this.$dateFormat('yy-MM-dd', el.createTime);
                            })
                        }
                    });
            }

        },

        //删除特殊日期数据
        delTechnicalDatesData(item, index) {
            this.editTechnicalDatesData.splice(index, 1)
        },

        //删除客户关系数据
        delRelationData(item, index) {
            this.editRelationData.splice(index, 1)
        },
        //添加到客户关系 数据
        addCustomerBtn() {
            let list = [];
            if (this.addRelationData.socDicKey !== "" && this.customerPhone !== "") {
                let newObj = {
                    "socCustomerId": this.customerData[0].id,
                    "socDicKey": this.addRelationData.socDicKey,
                    "socRemark": ""
                }

                this.relationData.map(el => {
                    if (el.socDicKey === this.addRelationData.socDicKey) {
                        this.queryCustomerData.socDicName = el.socDicName;
                    }
                })
                this.queryCustomerData.socDicKey = this.addRelationData.socDicKey;

                this.editRelationData.push(this.queryCustomerData);
                this.queryCustomerData = {
                    socCustomerId: '',
                    socCustomerCode: "",
                    socCustomerPhone: "",
                    socCustomerName: "",
                    socDicKey: "",
                    socDicName: "",
                    socRemark: ""
                };
                this.addRelationData = {
                    socCustomerId: "",
                    socCustomerName: "",
                    socDicKey: "",
                    socDicName: "",
                    socRemark: ""
                };
                this.customerPhone = '';
                this.customerData = [{
                    cName: '输入手机号搜索',
                    id: ''
                }];

            } else {
                this.$message({
                    type: 'warning',
                    message: '新增会员关系都不能为空!',
                    duration: "1000",
                    onClose: () => {

                    }
                });
            }
        },

        //确定编辑关系 
        sureEditRelation() {
            let list = [];
            if (this.editRelationData.length > 0) {
                this.editRelationData.map(el => {
                    let obj = {};
                    obj.socCustomerId = el.socCustomerId;
                    obj.socDicKey = el.socDicKey;
                    obj.socRemark = el.socRemark;
                    list.push(obj)
                })
            }
            let par = {
                customerId: this.customerId,
                list: list,
            }
            this.setRelationData(par);

        },

        //客户关系编辑 调用接口
        setRelationData(par) {
            this.$post(this.$host + "/api/cust/socon/update", par)
                .then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '会员关系编辑成功!',
                            duration: "1000",
                            onClose: () => {
                                this.customerRelationShow = false;
                                this.relationData = JSON.parse(JSON.stringify(this.editRelationData));
                            }
                        });
                    }
                });
        },

        //手机号查询客户
        queryCustomer(a, b) {
            if (a === 1) {//新增关系的查询
                if (this.customerPhone === "") {
                    this.$message({
                        type: 'warning',
                        message: '请输入手机号!',
                        duration: "1000",
                        onClose: () => {
                            // this.sureTagData = datas;
                        }
                    });
                    this.customerData[0].cName = '无'
                    return;
                } else {
                    let par = {
                        "pageNumber": 1,
                        "pageSize": 100,
                        cCodeOrNameOrPhone: this.customerPhone,
                    };
                    this.$post(this.$host + "/api/cust/customer/page", par)
                        .then(d => {
                            if (d.success) {
                                this.customerDataShow = true;
                                if (d.data.content.length > 0) {
                                    let obj = JSON.parse(JSON.stringify(d.data.content))

                                    this.customerData = d.data.content;
                                    this.queryCustomerData.socCustomerId = obj[0].id;
                                    this.queryCustomerData.socCustomerCode = obj[0].cCode;
                                    this.queryCustomerData.socCustomerPhone = obj[0].cPhone;
                                    this.queryCustomerData.socCustomerName = obj[0].cName;
                                } else {
                                    this.customerData = [{
                                        cName: "该会员不存在"
                                    }]
                                }

                            }
                        });
                }
            } else {//编辑地方的查询
                if (b.socCustomerPhone === "") {
                    this.$message({
                        type: 'warning',
                        message: '请输入手机号!',
                        duration: "1000",
                        onClose: () => {
                            // this.sureTagData = datas;
                        }
                    });
                    return;
                } else {
                    let par = {
                        "pageNumber": 1,
                        "pageSize": 100,
                        cCodeOrNameOrPhone: b.socCustomerPhone,
                    };
                    this.$post(this.$host + "/api/cust/customer/page", par)
                        .then(d => {
                            if (d.success) {
                                if (d.data.content.length > 0) {
                                    b.socCustomerName = d.data.content[0].cName;
                                } else {
                                    b.socCustomerName = "该会员不存在"
                                }

                            }
                        });
                }
            }



        },

        //编辑客户关系按钮
        editCustomerRelationBtn() {
            this.$post(this.$host + "/api/cust/socon/socontype", {})
                .then(d => {
                    if (d.success) {
                        this.relationSecect = d.data;
                    }
                });
            this.customerRelationShow = true;

        },

        //特殊日期新增按钮
        addTechnicalDatesBtn() {
            let list = [];
            if (this.addTechnicalDatesData.cDate !== "" && this.addTechnicalDatesData.dateType !== "") {
                let newObj = {
                    cDate: this.addTechnicalDatesData.cDate,
                    dateType: this.addTechnicalDatesData.dateType,
                }
                newObj.cDate = this.$dateFormat("yy-MM-dd", newObj.cDate)

                this.dateTypeSelect.map(el => {
                    if (el.dateType === this.addTechnicalDatesData.dateType) {
                        newObj.dateTypeName = el.dateTypeName
                    }
                })
                list.push(newObj);
                this.editTechnicalDatesData.push(newObj);
                this.addTechnicalDatesData = {
                    dateType: "",
                    cDate: '',
                    dateTypeName: ''
                };
            } else {
                this.$message({
                    type: 'warning',
                    message: '新增特殊日期都不能为空!',
                    duration: "1000",
                    onClose: () => {
                    }
                });
            }
        },

        //确定编辑特殊日期
        sureEditTechnicalDates() {
            let list = [];
            if (this.editTechnicalDatesData.length > 0) {

                this.editTechnicalDatesData.map(el => {
                    let obj = {};
                    obj.dateType = el.dateType;
                    if (typeof (el.cDate) === "string") {
                        obj.cDate = el.cDate;
                    } else {
                        obj.cDate = this.$dateFormat("yy-MM-dd", el.cDate);
                    }
                    list.push(obj)
                })
            }

            let par = {
                customerId: this.customerId,
                list: list,
            }
            this.setTechnicalDates(par);

        },

        //编辑特殊日期 调用接口
        setTechnicalDates(par) {
            this.$post(this.$host + "/api/cust/custdate/update", par)
                .then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '特殊日期设置成功!',
                            duration: "800",
                            onClose: () => {
                                this.technicalDatesShow = false;
                                this.technicalDatesData = JSON.parse(JSON.stringify(this.editTechnicalDatesData))
                                // this.sureTagData = datas;
                            }
                        });
                    }
                });
        },

        //关闭特殊日期model
        closeModelTechnical() {
            this.technicalDatesShow = false;
            this.addTechnicalDateShow = false;
            this.addTechnicalDatesData = {
                dateType: "",
                cDate: '',
                dateTypeName: ''
            };
        },

        //关闭 客户关系model
        closeModelRelation() {
            this.customerRelationShow = false;
            this.addRelationShow = false;
            this.queryCustomerData = {
                socCustomerId: '',
                socCustomerCode: "",
                socCustomerPhone: "",
                socCustomerName: "",
                socDicKey: "",
                socDicName: "",
                socRemark: ""
            };
            this.addRelationData = {
                socCustomerId: "",
                socCustomerName: "",
                socDicKey: "",
                socDicName: "",
                socRemark: ""
            };
            this.customerPhone = '';
            this.customerData = [{
                cName: '输入手机号搜索',
                id: ''
            }];
        },

        //编辑特殊日期 按钮
        editTechnicalDates() {
            this.$post(this.$host + "/api/cust/custdate/datetype", {})
                .then(d => {
                    if (d.success) {
                        this.dateTypeSelect = d.data;
                    }
                });
            this.technicalDatesShow = true;
        },

        // 取消页面上确定选中的
        cancleSureSelected(items) {
            this.sureTagData.map((el, i) => {
                if (el.id == items.id) {
                    el.detail.map((val, index) => {
                        if (val.value == items.value) {
                            el.detail.splice(index, 1);
                        }
                    });
                    if (el.detail.length == 0) {
                        this.sureTagData.splice(i, 1);
                    }
                }
            });
            this.tagSelected.map((v, i) => {
                if (v.id == items.id && v.value == items.value) {
                    this.tagSelected.splice(i, 1);
                }
            })
            // 默认第一个标签类别
            this.tagTit.map((el, index) => {
                el.isChecked = false;
                if (index == 0) {
                    el.isChecked = true;
                }
            })
            let tagDatasValue = this.tagTit[0].tagValue.split(",");
            let newArr = [];
            tagDatasValue.map(el => {
                let newObj = new Object();
                newObj.id = this.tagTit[0].id;
                newObj.isChecked = false;
                newObj.value = el;
                this.tagSelected.map((v, i) => {
                    if (v.id == newObj.id && v.value == newObj.value) {
                        newObj.isChecked = true;
                    }
                })
                newObj.tagName = this.tagTit[0].tagName;
                newObj.tagMode = this.tagTit[0].tagMode;
                newArr.push(newObj);
            });
            this.tagDatas = newArr;
            this.tagDatas.map((v, i) => {
                if (v.id == items.id && v.value == items.value) {
                    v.isChecked = false;
                }
            })

        },

        //确定选择标签
        sureSelected() {
            let datas = [];
            this.tagSelected.map((v, i) => {
                let newObj = new Object();
                if (datas.length > 0) {
                    let canPush = true;
                    datas.map((value, index) => {
                        if (value.id == v.id) {
                            value.detail.push(v);
                            canPush = false;
                        }
                    })

                    if (canPush) {//没有这个id
                        newObj.id = v.id;
                        newObj.tagName = v.tagName;
                        let newArr = [];
                        newArr.push(v);
                        this.tagTit.map(val => {
                            if (val.id == v.id) {
                                newObj.detailTotal = val.tagValue.split(",")
                            }
                        })
                        newObj.detail = newArr;
                        datas.push(newObj);
                    }
                } else {
                    newObj.id = v.id;
                    newObj.tagName = v.tagName;
                    let newArr = [];
                    newArr.push(v);
                    this.tagTit.map(val => {
                        if (val.id == v.id) {
                            newObj.detailTotal = val.tagValue.split(",")
                        }
                    });
                    newObj.detail = newArr;
                    datas.push(newObj);
                }

            });
            let tags = [];
            datas.map((el, k) => {
                let obj = {
                    tagValue: ""
                };
                obj.tagId = el.detail[0].id;
                el.detail.map((it, ix) => {
                    if (it.value != undefined && ix < el.detail.length - 1) {
                        obj.tagValue += it.value + ",";
                    } else if (ix === el.detail.length - 1) {
                        obj.tagValue += it.value;

                    }

                })
                tags.push(obj);
            })
            let par = {
                customerIds: [Number(this.$route.query.id)],
                tags: tags,
            }
            this.sureTagData = datas;
            this.$post(this.$host + "/api/cust/tag/allotTag", par)
                .then(d => {
                    if (d.success) {
                        this.$message({
                            type: 'success',
                            message: '标签设置成功!',
                            duration: "800",
                            onClose: () => {
                                this.tagShow = false;
                                this.sureTagData = datas;
                            }
                        });

                    }
                });

        },

        //标签取消选择
        cancleSelected(item, index) {
            this.tagDatas.map(el => {
                if (el.id == item.id && el.value == item.value) {
                    el.isChecked = false;
                }
            });
            this.tagSelected.splice(index, 1);
        },

        //选择标签
        selectTagTitFun(item, index) {
            this.tagTit.map((v, i) => {
                v.isChecked = false;
            })
            this.tagTit[index].isChecked = true;
            let tagDatasValue = this.tagTit[index].tagValue.split(",");
            let newArr = [];
            tagDatasValue.map(el => {
                let newObj = new Object();
                newObj.id = item.id;
                newObj.isChecked = false;
                this.tagSelected.map((v, i) => {
                    if (v.id == item.id && v.value == el) {
                        newObj.isChecked = true;
                    }
                });
                newObj.value = el;
                newObj.tagName = item.tagName;
                newObj.tagMode = item.tagMode;
                newArr.push(newObj);
            });
            this.tagDatas = newArr;
        },

        //选择标签值
        selectTagDatas(item, index) {
            if (item.tagMode == 0) {//单选
                this.tagDatas.map((v, i) => {
                    v.isChecked = false;
                    if (i == index) {
                        v.isChecked = true;
                    }
                });
                this.tagSelected.map((v, i) => {
                    if (v.id == item.id) {
                        this.tagSelected.splice(i, 1);
                    }
                })
            } else {
                this.tagDatas[index].isChecked = true;
            }
            // this.tagDatas[index].isChecked=true;
            let Canpush = true;
            if (this.tagSelected.length > 0) {
                this.tagSelected.map(el => {
                    if (el.id == item.id && el.value == item.value) {
                        Canpush = false;
                    }
                })
            }
            if (Canpush) {
                this.tagSelected.push(item);
            }
            console.log(this.tagSelected)
        },


        //反选标签
        invertGetTag() {
            this.tagSelected.map((item, index) => {
                this.tagDatas.map(el => {
                    if (el.id == item.id && el.value == item.value) {
                        el.isChecked = !el.isChecked;
                    }
                });
                // this.tagSelected.splice(index, 1);
            })

        },

        //编辑
        editTag() {
            this.tagShow = !this.tagShow;
        },

        //关闭model
        closeModel() {
            this.tagShow = !this.tagShow;
        },

        // //  获取标签
        // getTag() {
        //     let data = {
        //         pageNumber: 1,
        //         pageSize: 100
        //     }
        //     this.$post(this.$host + "/api/cust/tag/page", data).then(d => {
        //         if (d.success) {
        //             d.data.content.map((el, index) => {
        //                 el.isChecked = false;
        //                 if (index == 0) {
        //                     el.isChecked = true;
        //                     let newobj = {};
        //                     newobj.id = el.id;
        //                     newobj.psName = el.psName;
        //                     newobj.psPrice = el.psPrice;
        //                     newobj.isChecked = false;
        //                     this.selTagDatas.push(newobj);
        //                 }
        //             })
        //             this.tagTit = d.data.content;
        //             let tagDatasValue = this.tagTit[0].tagValue.split(",");
        //             let newArr = [];
        //             tagDatasValue.map(el => {
        //                 let newObj = {};
        //                 newObj.id = this.tagTit[0].id;
        //                 newObj.tagMode = this.tagTit[0].tagMode;
        //                 newObj.isChecked = false;
        //                 newObj.value = el;
        //                 newObj.tagName = this.tagTit[0].tagName;
        //                 newArr.push(newObj);
        //             });
        //             this.tagDatas = newArr;
        //             // console.log('>>', this.tagDatas)
        //         }
        //     })
        // },


    },
    mounted() {

        this.customerId = this.$route.query.id;
        this.customerCode = this.$route.query.code;
        this.$post(this.$host + "/api/cust/customer/queryone", { id: this.customerId })
            .then(d => {
                if (d.success) {

                    switch (d.cCustStatus) {
                        case 0: d.cCustStatus = '正常'; break;
                        case 1: d.cCustStatus = '休眠'; break;
                        case 2: d.cCustStatus = '冻结'; break;
                    }

                    this.datas = d;
                    this.cCode = d.cCode;
                }
            });

        //客户标签
        this.$post(this.$host + "/api/cust/tag/findByCustId", { customerId: this.customerId })
            .then(d => {
                if (d.success) {
                    // this.customerLebal = d;

                    // .
                    d.data.map((item, index) => {
                        item.isChecked = false;
                        if (index == 0) {
                            item.isChecked = true;
                            let newobj = {};
                            newobj.id = item.id;
                            newobj.psName = item.psName;
                            newobj.psPrice = item.psPrice;
                            newobj.isChecked = false;
                            this.selTagDatas.push(newobj);
                        }


                        let obj = {};
                        let arr = [];
                        let detail = []
                        if (item.tagVal != null) {
                            arr = item.tagVal.split(',');
                            arr.map(el => {
                                let arrChil = {};
                                arrChil.value = el;
                                arrChil.id = item.tagId;
                                arrChil.tagName = item.tagName;
                                arrChil.isChecked = true;
                                // tagMode:1
                                detail.push(arrChil)
                            })
                            obj.detail = detail;
                            obj.id = item.tagId;
                            obj.tagName = item.tagName;
                            obj.detailTotal = '';
                            this.sureTagData.push(obj)
                        }


                    })
                    // 全部标签渲染
                    this.tagTit = d.data;
                    if (this.tagTit.length > 0) {
                        let tagDatasValue = this.tagTit[0].tagValue.split(",");
                        let newArr = [];
                        tagDatasValue.map(el => {
                            let newObj = {};
                            newObj.id = this.tagTit[0].id;
                            newObj.tagMode = this.tagTit[0].tagMode;
                            newObj.isChecked = false;
                            newObj.value = el;
                            newObj.tagName = this.tagTit[0].tagName;
                            newArr.push(newObj);
                        });
                        this.tagDatas = newArr;
                    }

                    // 全部标签渲染

                    // console.log(this.sureTagData);
                    this.sureTagData.map(item => {
                        item.detail.map(el => {
                            this.tagSelected.push(el);
                        })
                    });
                    this.invertGetTag();
                }
            });



        //获取全部标签
        // this.getTag();

        //获取客户特殊日期
        this.$post(this.$host + "/api/cust/custdate/query", { customerId: this.customerId })
            .then(d => {
                if (d.success) {
                    this.technicalDatesData = d.list;

                    this.editTechnicalDatesData = JSON.parse(JSON.stringify(d.list))
                }
            });

        //获取客户 关系
        this.$post(this.$host + "/api/cust/socon/query", { customerId: this.customerId })
            .then(d => {
                if (d.success) {
                    if (d.lsit.length > 0) {
                        this.editRelationData = JSON.parse(JSON.stringify(d.lsit))
                    }
                    this.relationData = d.lsit;
                }
            });

        //获取客户账号

        this.$post(this.$host + "/api/cust/accInfo/findByCustomerId/" + this.customerId, {})
            .then(d => {
                if (d.success) {
                    if (d.data === null) {
                        this.customerAccount = {
                            accLockAmount: '0',//锁定金额
                            accCurAmount: '0',//当前余额
                            accCurCashcou: '0',//当前赠送金额
                            lockCurCashcou: '0',//当前锁定赠送金额
                            customerId: '',//客户id
                            customerCode: '',//客户编码
                            customerName: '',//客户名称
                            levelName: '',//客户等级
                            tkCount: '',//套卡数量
                            growVal: '0',//成长值
                        };
                    } else {
                        for (var key in d.data) {
                            if (d.data[key] === null) {
                                d.data[key] = "0";
                            }
                        }
                        this.customerAccount = d.data;
                    }
                }
            });
    }

}

</script>
<style scoped>
@import "../../../../static/commonStyle.css";
.tianjia::after {
    content: "\e752";
}
.shanchu,
.tianjia {
    margin-right: 4px;
}
.shanchu::after {
    content: "\e613";
}
.add_customer_btn {
    color: #58c4d4;
}
.add_customer_btn i {
    font-size: 14px;
}
.add_customer_btn:hover {
    cursor: pointer;
}
.customer_detail .model_content {
    width: 50rem;
}
.customer_tag .model_content .tagSelected {
    padding: 1rem;
    border-bottom: 1px dotted #cccccc;
}
.customer_tag .model_content .left,
.customer_tag .model_content .right {
    max-height: 25rem;
    overflow-y: auto;
}

.customer_tag .tag_content {
    padding: 1rem;
}
.customer_tag .tag_content > div {
    width: 48%;
    margin-top: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
}
.customer_tag .tag_content li.tagSort {
    background: #eee;
}
.customer_tag .tag_content li {
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom: 1px solid #eee;
    padding-left: 1rem;
    cursor: pointer;
}

.customer_name {
    font-size: 16px;
    color: #666;
    text-align: center;
}
.customer_name img {
    margin: 10px 0 20px;
}
.customer_msg {
    text-align: center;
    margin: 12px 0;
}
.customer_msg i {
    margin: 0 6px;
}
.customer_tag .tag_content li * {
    vertical-align: middle;
}
.customer_detail .x_model_footer {
    margin-top: 1rem;
}
.customer_tag .tagSelected li {
    float: left;
    margin-right: 0.833333rem;
    padding: 3px 5px;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
}
.customer_date .tagSelected {
    padding: 1rem;
}
.customer_date .date_content {
    min-height: 300px;
}
.customer_date .date_content li {
    margin: 0 1rem;
    padding-top: 1rem;
}
.customer_date .date_content li:first-child {
    border-bottom: 1px dotted #ccc;
    padding-bottom: 1rem;
}

.select_customer {
    position: relative;
    display: inline-block;
}

.curor:hover {
    cursor: pointer;
}
.icon-bianji::before {
    display: inline-block;
    content: "\e6cf";
    color: #386b88;
    font-size: 16px;
}
.CloseIcon::before {
    content: "\e61a";
    font-size: 14px;
}
.quxiao:hover {
    cursor: pointer;
}
.quxiao {
    vertical-align: middle;
}
.quxiao::before {
    content: "\e613";
    color: #386b88;
    font-size: 18px;
    vertical-align: middle;
}
.weixin::before {
    content: "\e64f";
    font-size: 18px;
}
.dianhua::before {
    content: "\e654";
    font-size: 18px;
}
.youxiang::before {
    content: "\e68b";
    font-size: 18px;
}

.icon-bianji {
    cursor: pointer;
}

/*  */
.right_content {
    background-color: transparent;
    padding: 0;
}
.detail_left {
    width: 208px;
    padding-right: 8px;
}
.detail_left_bottom,
.detail_left_top {
    padding: 8px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(220, 223, 230, 0.5);
    border-radius: 4px;
    margin-bottom: 12px;
}

/* .detail_left_bottom {
  margin-top: 12px;
  background-color: #fff;
  border-radius: 4px;
  padding: 4px;
  padding-bottom: 8px;
} */
.detail_left_bottom li {
    border-bottom: 1px solid #eee;
    padding: 4px;
}
.detail_left_bottom li > span:first-child {
    display: inline-block;
    width: 74px;
    text-align: right;
}
.detail_right {
    width: calc(100% - 216px);
    padding-left: 8px;

    border-radius: 4px;
}
.detail_right_content {
    background-color: #fff;
    padding: 4px;
}
.personal_data li {
    border-bottom: 1px solid #eeeeee;
    padding: 8px 24px;
}
.label_content::after {
    content: "";
    clear: both;
    display: block;
}
.tag > li {
    padding: 4px 0;
    padding-left: 24px;
}

.pointer:hover {
    cursor: pointer;
}
</style>
<style>
/* .sel_tit .el-input .el-input__inner{
    width: 100%;
} */
</style>


