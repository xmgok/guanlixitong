import Vue from 'vue';
import Router from 'vue-router';
const Login = r => require.ensure([], () => r(require("@/components/Login")), "Login");
const App = r => require.ensure([], () => r(require("../App")), "App");
const Notfound = r => require.ensure([], () => r(require("@/components/Notfound")), "Notfound");
const nopermission = r => require.ensure([], () => r(require("@/components/nopermission")), "nopermission");
// const Organization = r => require.ensure([], () => r(require("@/components/NavDetail/Organization/index")), "Organization");
const Organization = () => import("@/components/NavDetail/Organization/index");
const addContact = r => require.ensure([], () => r(require("@/components/NavDetail/Organization/addContact")), "addContact");
const Sysparas = r => require.ensure([], () => r(require("@/components/NavDetail/Sysparas")), "Sysparas");
const Personal = r => require.ensure([], () => r(require("@/components/NavDetail/Personal/index")), "Personal");
const Staffinfo = r => require.ensure([], () => r(require("@/components/NavDetail/Staffinfo/index")), "Staffinfo");
const Addstaff = r => require.ensure([], () => r(require("@/components/NavDetail/Staffinfo/Addstaff")), "Addstaff");
const Modifystaff = r => require.ensure([], () => r(require("@/components/NavDetail/Staffinfo/Modifystaff")), "Modifystaff");
const Changeinfo = r => require.ensure([], () => r(require("@/components/NavDetail/Changeinfo/index")), "Changeinfo");
const User = r => require.ensure([], () => r(require("@/components/NavDetail/User/index")), "User");
const Newuser = r => require.ensure([], () => r(require("@/components/NavDetail/User/Newuser")), "Newuser");
const Userrole = r => require.ensure([], () => r(require("@/components/NavDetail/User/Userrole")), "Userrole");
const Assignroles = r => require.ensure([], () => r(require("@/components/NavDetail/User/Assignroles")), "Assignroles");
const Role = r => require.ensure([], () => r(require("@/components/NavDetail/Role/index")), "Role")
const ToAllocate = r => require.ensure([], () => r(require("@/components/NavDetail/Role/ToAllocate")), "ToAllocate")
const Jurisdiction = r => require.ensure([], () => r(require("@/components/NavDetail/Jurisdiction/index")), "Jurisdiction");
const Product = r => require.ensure([], () => r(require("@/components/NavDetail/Product/index")), "Product");
const Prodlabel = r => require.ensure([], () => r(require("@/components/NavDetail/Prodlabel/index")), "Prodlabel");
const Fitstore = r => require.ensure([], () => r(require("@/components/NavDetail/Fitstore/index")), "Fitstore");
const GiveStores = r => require.ensure([], () => r(require("@/components/NavDetail/Fitstore/GiveStores")), "GiveStores");
const Store = r => require.ensure([], () => r(require("@/components/NavDetail/StoreMsg/index")), "Store");
const Collections = r => require.ensure([], () => r(require("@/components/NavDetail/StoreMsg/Collections")), "Collections");
const storeDetail = r => require.ensure([], () => r(require("@/components/NavDetail/StoreMsg/storeDetail")), "storeDetail");
const Dict = r => require.ensure([], () => r(require("@/components/NavDetail/Dict")), "Dict");
const addDict = r => require.ensure([], () => r(require("@/components/NavDetail/Dict/addDict")), "addDict");
const updateDict = r => require.ensure([], () => r(require("@/components/NavDetail/Dict/updateDict")), "updateDict");
const addSysparas = r => require.ensure([], () => r(require("@/components/NavDetail/Sysparas/addSysparas")), "addSysparas");
const updateSysparas = r => require.ensure([], () => r(require("@/components/NavDetail/Sysparas/updateSysparas")), "updateSysparas");
const ExamineApprove = r => require.ensure([], () => r(require("@/components/NavDetail/ExamineApprove/index")), "ExamineApprove");
const allocateNode = r => require.ensure([], () => r(require("@/components/NavDetail/ExamineApprove/allocateNode")), "allocateNode");
const editNode = r => require.ensure([], () => r(require("@/components/NavDetail/ExamineApprove/editNode")), "editNode");
const addStore = r => require.ensure([], () => r(require("@/components/NavDetail/StoreMsg/addStore")), "addStore");
const ApproveStart = r => require.ensure([], () => r(require("@/components/NavDetail/Approve/ApproveStart")), "ApproveStart");
const ApproveForm = r => require.ensure([], () => r(require("@/components/NavDetail/Approve/ApproveForm")), "ApproveForm");
const Approve_task = r => require.ensure([], () => r(require("@/components/NavDetail/Approve/Approve_task")), "Approve_task");
const Approve_task_detail = r => require.ensure([], () => r(require("@/components/NavDetail/Approve/Approve_task/Approve_task_detail")), "Approve_task_detail");
const Approve_progress = r => require.ensure([], () => r(require("@/components/NavDetail/Approve/Approve_progress")), "Approve_progress");
const Approve_progress_detail = r => require.ensure([], () => r(require("@/components/NavDetail/Approve/Approve_progress/Approve_progress_detail")), "Approve_progress_detail");
const template = r => require.ensure([], () => r(require("@/components/NavDetail/template/index")), "template");
const ProductServelist = r => require.ensure([], () => r(require("@/components/NavDetail/Product/ProductServe/indexserver")), "ProductServelist");//产品服务列表
const ProductGoodslist = r => require.ensure([], () => r(require("@/components/NavDetail/Product/ProductServe/indexgoods")), "ProductGoodslist");//商品列表
const ProductCardlist = r => require.ensure([], () => r(require("@/components/NavDetail/Product/ProductServe/indexcard")), "ProductCardlist");//产品套卡列表
const ProductServeAdd = r => require.ensure([], () => r(require("@/components/NavDetail/Product/ProductServe/ProductServeAdd/index")), "ProductServeAdd");//产品服务新增
const ProductGoodsAdd = r => require.ensure([], () => r(require("@/components/NavDetail/Product/ProductServe/ProductGoodsAdd/index")), "ProductGoodsAdd");//商品新增
const ProductCardAdd = r => require.ensure([], () => r(require("@/components/NavDetail/Product/ProductServe/ProductCardAdd/index")), "ProductCardAdd");//产品套卡新增
const productRule = r => require.ensure([], () => r(require("@/components/NavDetail/productRule")), "productRule"); //产品服务
const productCard = r => require.ensure([], () => r(require("@/components/NavDetail/productCard")), "productCard"); //产品套卡
const priceControl = r => require.ensure([], () => r(require("@/components/NavDetail/priceControl")), "priceControl"); //产品价格
const batchEditPrice = r => require.ensure([], () => r(require("@/components/NavDetail/priceControl/batchEditPrice.vue")), "batchEditPrice"); //产品价格批量编辑
const batchEditCard = r => require.ensure([], () => r(require("@/components/NavDetail/productCard/batchEditCard.vue")), "batchEditCard"); //产品套卡批量编辑
const batchEditRule = r => require.ensure([], () => r(require("@/components/NavDetail/productRule/batchEditRule.vue")), "batchEditRule"); //产品服务批量编辑
const addCustomer = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/addCustomer.vue")), "addCustomer"); //新增会员
const Customer = r => require.ensure([], () => r(require("@/components/NavDetail/Customer")), "batchEditRule"); //会员列表
const customerDetails = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/customerDetails.vue")), "customerDetails"); //会员详情
const CustomerTag = r => require.ensure([], () => r(require("@/components/NavDetail/CustomerTag/index")), "CustomerTag"); //会员信息
const recentBirthday = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/recentBirthday")), "recentBirthday"); //近期生日会员
const CustomerExpand = r => require.ensure([], () => r(require("@/components/NavDetail/CustomerExpand/index")), "CustomerExpand"); //会员拓展配置
const NewGrade = r => require.ensure([], () => r(require("@/components/NavDetail/CustomerExpand/NewGrade")), "NewGrade"); //新增会员等级
const ModifyGrade = r => require.ensure([], () => r(require("@/components/NavDetail/CustomerExpand/ModifyGrade")), "ModifyGrade"); //修改会员等级
const CustomerRelation = r => require.ensure([], () => r(require("@/components/NavDetail/CustomerRelation/index")), "CustomerRelation"); //会员(客户)关系
const LevelChange = r => require.ensure([], () => r(require("@/components/NavDetail/CustomerRelation/LevelChange")), "LevelChange"); //会员等级异动
const IntegralRule = r => require.ensure([], () => r(require("@/components/NavDetail/IntegralRule/index")), "IntegralRule"); //积分
const PresentIntegral = r => require.ensure([], () => r(require("@/components/NavDetail/IntegralRule/PresentIntegral")), "PresentIntegral"); //积分赠送汇总
const IntegraDetail = r => require.ensure([], () => r(require("@/components/NavDetail/IntegralRule/IntegraDetail")), "IntegraDetail"); //积分赠送明细
const OpenCard = r => require.ensure([], () => r(require("@/components/NavDetail/OpenCard/index")), "OpenCard"); //开卡
const OpenCardAdd = r => require.ensure([], () => r(require("@/components/NavDetail/OpenCard/OpenCardAdd")), "OpenCardAdd"); //新增开卡
const OpenCardInfo = r => require.ensure([], () => r(require("@/components/NavDetail/OpenCard/OpenCardInfo")), "OpenCardInfo"); //开卡单
const RevokeCard = r => require.ensure([], () => r(require("@/components/NavDetail/OpenCard/RevokeCard")), "RevokeCard"); //退卡
const Station = r => require.ensure([], () => r(require("@/components/NavDetail/Station/index")), "Station");//岗位
const Position = r => require.ensure([], () => r(require("@/components/NavDetail/Position/index")), "Position");//职位
// const Partner = r => require.ensure([], () => r(require("@/components/NavDetail/Partner/index")), "Partner");//合作方
const Partner = () => import("@/components/NavDetail/Partner/index");//合作方
const allotStore = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/allotStore/index")), "allotStore");//分配门店
const allotPeople = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/allotPeople/index")), "allotStore");//分配跟进员工
const Receipt = r => require.ensure([], () => r(require("@/components/NavDetail/Receipt/index")), "Receipt");//预存收款
const addReceipt = r => require.ensure([], () => r(require("@/components/NavDetail/Receipt/addReceipt/index")), "addReceipt");//预存收款新增
const ReceiptDetail = r => require.ensure([], () => r(require("@/components/NavDetail/Receipt/ReceiptDetail/index")), "ReceiptDetail");//预存收款新增
const OrderDetail = r => require.ensure([], () => r(require("@/components/NavDetail/Order/OrderDetail/index")), "OrderDetail");//点单消费详情
const sureReceipt = r => require.ensure([], () => r(require("@/components/NavDetail/Receipt/sureReceipt/index")), "sureReceipt");//确认单签名
const Payment = r => require.ensure([], () => r(require("@/components/NavDetail/Payment/index")), "Payment");//支付页面
const Order = r => require.ensure([], () => r(require("@/components/NavDetail/Order/index")), "Order");//点单消费列表
const addOrder = r => require.ensure([], () => r(require("@/components/NavDetail/Order/addOrder/index")), "addOrder");//点单消费列表
const cancleOrder = r => require.ensure([], () => r(require("@/components/NavDetail/Order/cancleOrder/index")), "cancleOrder");//点单消费撤销
const Refunds = r => require.ensure([], () => r(require("@/components/NavDetail/refund/index")), "Refunds");//退款列表
const addRefund = r => require.ensure([], () => r(require("@/components/NavDetail/refund/addRefund/index")), "addRefund");//添加退款
const seeRefund = r => require.ensure([], () => r(require("@/components/NavDetail/refund/seeRefund")), "seeRefund");//查看退款详情
const refundBack = r => require.ensure([], () => r(require("@/components/NavDetail/refund/refundBack.vue")), " refundBack");//退款追溯
const refundDetail = r => require.ensure([], () => r(require("@/components/NavDetail/refund/refundDetail.vue")), " refundDetail");//退款详情
const nurseLog = r => require.ensure([], () => r(require("@/components/NavDetail/nurseLog")), "nurseLog");//护理日志
const addNurse = r => require.ensure([], () => r(require("@/components/NavDetail/nurseLog/addNurse")), "addNurse");//填写护理日志
const ResultsAllot = r => require.ensure([], () => r(require("@/components/NavDetail/ResultsAllot/index")), "ResultsAllot");//业绩分配
const SetResults = r => require.ensure([], () => r(require("@/components/NavDetail/SetResults/index")), "SetResults");//业绩方案设置
const BatchSetResults = r => require.ensure([], () => r(require("@/components/NavDetail/SetResults/BatchSetResults")), "BatchSetResults");//批量业绩规则设置
// const StaffResultsSum = r => require.ensure([], () => r(require("@/components/NavDetail/ResultsAllot/StaffResultsSum/index")), "StaffResultsSum");//员工业绩汇总
const StaffResultsDetail = r => require.ensure([], () => r(require("@/components/NavDetail/ResultsAllot/StaffResultsSum/StaffResultsDetail")), "StaffResultsDetail");//员工业绩明细
const customerBalance = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/balance")), "customerBalance");//会员余额详情
const customerCard = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/card")), "customerCard");//会员套卡
const balanceDetail = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/balance/balanceDetail")), "balanceDetail");//会员余额明细
const integral = r => require.ensure([], () => r(require("@/components/NavDetail/Customer/integral")), "integral");//会员积分变动明细
const Arrange = r => require.ensure([], () => r(require("@/components/NavDetail/Arrange/index")), "Arrange");//排班管理
const Grounp = r => require.ensure([], () => r(require("@/components/NavDetail/Arrange/Grounp/index")), "Grounp");//设置小组
const addAppointment = r => require.ensure([], () => r(require("@/components/NavDetail/appointment/addAppointment")), "addAppointment");//添加预约
const appointment = r => require.ensure([], () => r(require("@/components/NavDetail/appointment")), "appointment");//预约列表
const seeAppointment = r => require.ensure([], () => r(require("@/components/NavDetail/appointment/seeAppointment")), "seeAppointment");//查看预约
const appointmentGrade = r => require.ensure([], () => r(require("@/components/NavDetail/appointment/appointmentGrade/index.vue")), "appointmentGrade");//预约看板
const appCalendar = r => require.ensure([], () => r(require("@/components/NavDetail/appointment/appCalendar/index.vue")), "appCalendar");//预约看板
const Parameter = r => require.ensure([], () => r(require("@/components/NavDetail/Parameter/index")), "Parameter");//参数设置
const receiptforms = r => require.ensure([], () => r(require("@/components/NavDetail/receiptforms/index")), "receiptforms");//收款报表
const Orderforms = r => require.ensure([], () => r(require("@/components/NavDetail/Orderforms/index")), "Orderforms");//消费报表
const refundforms = r => require.ensure([], () => r(require("@/components/NavDetail/refundforms/index")), "refundforms");//退款报表
const SetMessage = r => require.ensure([], () => r(require("@/components/NavDetail/SMS/SetMessage")), "SetMessage");//短信设置
const MessageLog = r => require.ensure([], () => r(require("@/components/NavDetail/SMS/MessageLog")), "MessageLog");//短信日志
const SystemMessage = r => require.ensure([], () => r(require("@/components/NavDetail/SystemMessage/index")), "SystemMessage");//系统消息设置
// const BackMessage = r => require.ensure([], () => r(require("@/components/NavDetail/SystemMessage/BackMessage")), "BackMessage");//后台站内消息
// const AppMessage = r => require.ensure([], () => r(require("@/components/NavDetail/SystemMessage/AppMessage")), "AppMessage");//app消息
const dataImport = r => require.ensure([], () => r(require("@/components/NavDetail/dataImport/index")), "dataImport");//数据导入
const BusinessTotal = r => require.ensure([], () => r(require("@/components/NavDetail/BusinessTotal/index")), "BusinessTotal");//营业汇总
const ReceiptTotal = r => require.ensure([], () => r(require("@/components/NavDetail/ReceiptTotal/index")), "ReceiptTotal");//收款汇总
const ReceiptTotaldetail = r => require.ensure([], () => r(require("@/components/NavDetail/ReceiptTotal/ReceiptTotaldetail")), "ReceiptTotaldetail");//收款明细
const OrderTotal = r => require.ensure([], () => r(require("@/components/NavDetail/OrderTotal/index")), "OrderTotal");//消费汇总
const OrderTotaldetail = r => require.ensure([], () => r(require("@/components/NavDetail/OrderTotal/OrderTotaldetail")), "OrderTotaldetail");//消费明细
const refundTotal = r => require.ensure([], () => r(require("@/components/NavDetail/refundTotal/index")), "refundTotal");//退款汇总
const refundTotaldetail = r => require.ensure([], () => r(require("@/components/NavDetail/refundTotal/refundTotaldetail")), "refundTotaldetail");//退款明细
const perforforms = r => require.ensure([], () => r(require("@/components/NavDetail/perforforms")), "perforforms");//业绩报表
const perforTotal = r => require.ensure([], () => r(require("@/components/NavDetail/perforTotal/index")), "perforTotal");//业绩汇总
const perforTotaldetail = r => require.ensure([], () => r(require("@/components/NavDetail/perforTotal/perforTotaldetail")), "perforTotaldetail");//业绩明细
const arriveStore = r => require.ensure([], () => r(require("@/components/NavDetail/arriveStore")), "arriveStore");//到店列表
const baserule = r => require.ensure([], () => r(require("@/components/NavDetail/Settings/baserule")), "baserule");//基本规则设置
const orgdetail = r => require.ensure([], () => r(require("@/components/NavDetail/Settings/orgdetail")), "orgdetail");//基本规则设置
const GrowthValue = r => require.ensure([], () => r(require("@/components/NavDetail/GrowthValue/index")), "GrowthValue");//成长值设置
const customerAdjust = r => require.ensure([], () => r(require("@/components/NavDetail/customer/customerAdjust")), "customerAdjust");//客户调整
const Dailybalance = r => require.ensure([], () => r(require("@/components/NavDetail/Dailybalance/index")), "Dailybalance");//营业日结
const Closing = r => require.ensure([], () => r(require("@/components/NavDetail/Closing/index")), "Closing");//门店关账
const coupon = r => require.ensure([], () => r(require("@/components/NavDetail/coupon")), "coupon");//优惠券列表
const addCoupon = r => require.ensure([], () => r(require("@/components/NavDetail/coupon/addCoupon.vue")), "addCoupon");//添加优惠券
const seeCoupon = r => require.ensure([], () => r(require("@/components/NavDetail/coupon/seeCoupon.vue")), "seeCoupon");//查看优惠券
const Main = r => require.ensure([], () => r(require("@/components/NavDetail/Main")), "Main");//首页
const DailybalanceTotal = r => require.ensure([], () => r(require("@/components/NavDetail/DailybalanceTotal/index")), "DailybalanceTotal");//日营业汇总

Vue.use(Router)
export default new Router({
  mode: 'hash',
  base: '/',
  routes: [
        {path:"/",component:Login},//登录页
        { path: '/indexs', component: App ,
          children:[
            {path:"/index",component:Main},//首页
            {path:"/NavDetail/Organization",component:Organization,meta:{isvisit:true}},//组织结构
            {path:"/NavDetail/addContact",component:addContact},//组织结构新增和修改
            {path:"/NavDetail/Arg",component:Sysparas},//系统参数
            {path:"/NavDetail/Personal",component:Personal},
            {path:"/NavDetail/Staffinfo",component:Staffinfo,meta:{isvisit:true}},
            {path:"/NavDetail/Addstaff",component:Addstaff,meta:{isvisit:true}},
            {path:"/NavDetail/Modifysta",component:Modifystaff,meta:{isvisit:true}},
            {path:"/NavDetail/Changeinfo",component:Changeinfo,meta:{isvisit:true}},            
            {path:"/NavDetail/User",component:User,meta:{isvisit:true}},
            {path:"/NavDetail/Newuser",component:Newuser},
            {path:"/NavDetail/Userrole",component:Userrole},
            {path:"/NavDetail/Assignroles",component:Assignroles},
            {path:"/NavDetail/Role",component:Role,meta:{isvisit:true}},
            {path:"/NavDetail/ToAllocate",component:ToAllocate}, 
            {path:"/NavDetail/Func",component:Jurisdiction,meta:{isvisit:true}},
            {path:"/NavDetail/Product",component:Product,meta:{isvisit:true}},//产品分类
            {path:"/NavDetail/Prodlabel",component:Prodlabel},//产品标签
            {path:"/NavDetail/Fitstore",component:Fitstore,meta:{isvisit:true}},//产品授权
            {path:"/NavDetail/GiveStores",component:GiveStores},//产品授权
            {path:"/NavDetail/Store",component:Store,meta:{isvisit:true}},//门店信息
            {path:"/NavDetail/storeDetail",component:storeDetail},
            {path:"/NavDetail/Store/Collections",component:Collections},
            {path:"/NavDetail/Base",component:Dict,meta:{isvisit:true}},//数据字典
            {path:"/NavDetail/addDict",component:addDict},//字典新增
            {path:"/NavDetail/updateDict",component:updateDict},//字典修改
            {path:"/NavDetail/addSysparas",component:addSysparas},//新增系统参数
            {path:"/NavDetail/updateSysparas",component:updateSysparas},//
            {path:"/NavDetail/ExamineApprove",component:ExamineApprove,meta:{isvisit:true}},//审批管理
            {path:"/NavDetail/allocateNode",component:allocateNode},//
            {path:"/NavDetail/editNode",component:editNode},//
            {path:"/NavDetail/addStore",component:addStore,meta:{isvisit:true}},
            {path:"/NavDetail/ApproveStart",component:ApproveStart,meta:{isvisit:true}},//发起审批
            {path:"/NavDetail/Approve_task",component:Approve_task,meta:{isvisit:true}},//审批任务
            {path:"/NavDetail/Approve_task_detail",component:Approve_task_detail},//审批任务详情
            {path:"/NavDetail/template",component:template},//审批任务
            {path:"/NavDetail/ApproveForm",component:ApproveForm},//配置表单
            {path:"/NavDetail/Approve_progress",component:Approve_progress,meta:{isvisit:true}},//审批进程
            {path:"/NavDetail/Approve_progress_detail",component:Approve_progress_detail},//审批进程详情
            {path:"/NavDetail/ProductServelist",component:ProductServelist,meta:{isvisit:true}},//产品服务列表
            {path:"/NavDetail/ProductGoodslist",component:ProductGoodslist},//商品列表
            {path:"/NavDetail/ProductCardlist",component:ProductCardlist,meta:{isvisit:true}},//产品套卡列表
            {path:"/NavDetail/ProductServe/ProductServeAdd",component:ProductServeAdd,meta:{isvisit:true}},//产品服务添加和编辑
            {path:"/NavDetail/ProductServe/ProductGoodsAdd",component:ProductGoodsAdd},//商品添加和编辑
            {path:"/NavDetail/ProductServe/ProductCardAdd",component:ProductCardAdd,meta:{isvisit:true}},//产品套卡添加和编辑
            {path:"/NavDetail/productCard",component:productCard},//编辑产品套卡
            {path:"/NavDetail/productRule",component:productRule,meta:{isvisit:true}},//编辑产品服务
            {path:"/NavDetail/priceControl",component:priceControl,meta:{isvisit:true}},//编辑产品价格会员
            {path:"/NavDetail/batchEditCard",component:batchEditCard},//编辑产品套卡 批量
            {path:"/NavDetail/batchEditRule",component:batchEditRule},//编辑产品服务 批量
            {path:"/NavDetail/batchEditPrice",component:batchEditPrice},//编辑产品价格会员 批量
            {path:"/NavDetail/Customer",component:Customer,meta:{isvisit:true}},//会员列表
            {path:"/NavDetail/addCustomer",component:addCustomer,meta:{isvisit:true}},//新增会员
            {path:"/NavDetail/customerDetails",component:customerDetails},//会员详情
            {path:"/NavDetail/CustomerTag",component:CustomerTag,meta:{isvisit:true}},//会员标签
            {path:"/NavDetail/Customer/recentBirthday",component:recentBirthday},//近期生日会员
            {path:"/NavDetail/CustomerExpand",component:CustomerExpand,meta:{isvisit:true}},//会员拓展配置
            {path:"/NavDetail/NewGrade",component:NewGrade},//新增会员等级
            {path:"/NavDetail/ModifyGrade",component:ModifyGrade},//修改会员等级
            {path:"/NavDetail/CustomerRelation",component:CustomerRelation},//会员(客户)关系
            {path:"/NavDetail/LevelChange",component:LevelChange},//会员等级异动            
            {path:"/NavDetail/IntegralRule",component:IntegralRule,meta:{isvisit:true}},//积分
            {path:"/NavDetail/PresentIntegral",component:PresentIntegral},//积分赠送汇总
            {path:"/NavDetail/IntegraDetail",component:IntegraDetail},//积分赠送明细
            {path:"/NavDetail/OpenCard",component:OpenCard,meta:{isvisit:true}},//开卡
            {path:"/NavDetail/OpenCardAdd",component:OpenCardAdd},//新增开卡
            {path:"/NavDetail/OpenCardInfo",component:OpenCardInfo},//开卡单
            {path:"/NavDetail/RevokeCard",component:RevokeCard},//退卡
            {path:"/NavDetail/Station",component:Station,meta:{isvisit:true}},//岗位
            {path:"/NavDetail/Position",component:Position,meta:{isvisit:true}},//职位
            {path:"/NavDetail/Partner",component:Partner,meta:{isvisit:true}},//合作方
            {path:"/NavDetail/allotStore",component:allotStore,meta:{isvisit:true}},//会员分配门店
            {path:"/NavDetail/allotPeople",component:allotPeople,meta:{isvisit:true}},//会员分配跟进员工
            {path:"/NavDetail/Receipt",component:Receipt,meta:{isvisit:true}},//预存收款
            {path:"/NavDetail/addReceipt",component:addReceipt,meta:{isvisit:true}},//预存收款新增
            {path:"/NavDetail/ReceiptDetail",component:ReceiptDetail},//预存收款详情
            {path:"/NavDetail/Payment",component:Payment},//支付页面
            {path:"/NavDetail/sureReceipt",component:sureReceipt},//预存会员确认单
            {path:"/NavDetail/Order",component:Order,meta:{isvisit:true,keepAlive:true}},//点单消费
            {path:"/NavDetail/OrderDetail",component:OrderDetail},//点单消费详情
            {path:"/NavDetail/addOrder",component:addOrder,meta:{keepAlive:true}},//点单消费新增
            {path:"/NavDetail/cancleOrder",component:cancleOrder},//点单消费撤销
            {path:"/NavDetail/ResultsAllot",component:ResultsAllot,meta:{isvisit:true}},//业绩分配
            {path:"/NavDetail/SetResults",component:SetResults,meta:{isvisit:true}},//业绩方案设置
            {path:"/NavDetail/BatchSetResults",component:BatchSetResults},//批量业绩规则设置
            // {path:"/NavDetail/StaffResultsSum",component:StaffResultsSum},//员工业绩汇总
            {path:"/NavDetail/StaffResultsDetail",component:StaffResultsDetail},//员工业绩明细
            {path:"/NavDetail/Refunds",component:Refunds,meta:{isvisit:true}},//退款单列表
            {path:"/NavDetail/refund/seeRefund",component:seeRefund},//退款单列表
            {path:"/NavDetail/refund/addRefund",component:addRefund,meta:{isvisit:true}},//添加退款单
            {path:"/NavDetail/refund/refundBack",component:refundBack},//退款追溯
            {path:"/NavDetail/refund/refundDetail",component:refundDetail},//退款详情
            {path:"/NavDetail/nurseLog",component:nurseLog,meta:{isvisit:true}},//护理日志列表
            {path:"/NavDetail/nurseLog/addNurse",component:addNurse},//查看填写编辑护理日志
            {path:"/NavDetail/Customer/customerBalance",component:customerBalance},//会员余额详情
            {path:"/NavDetail/Customer/balanceDetail",component:balanceDetail},//会员余额明细
            {path:"/NavDetail/Customer/customerCard",component:customerCard},//会员套卡
            {path:"/NavDetail/Customer/integral",component:integral},//会员积分变动明细
            {path:"/NavDetail/appointment",component:appointment,meta:{isvisit:true}},//预约列表
            {path:"/NavDetail/appointment/addAppointment",component:addAppointment},//添加预约
            {path:"/NavDetail/appointmentGrade",component:appointmentGrade,meta:{isvisit:true}},//预约看板      
            {path:"/NavDetail/appCalendar",component:appCalendar},//预约看板
            {path:"/NavDetail/appointment/seeAppointment",component:seeAppointment},//预约看板     
            {path:"/NavDetail/Arrange",component:Arrange,meta:{isvisit:true}},//排班管理
            {path:"/NavDetail/Grounp",component:Grounp,meta:{isvisit:true}},//排班管理设置小组
            {path:"/NavDetail/Parameter",component:Parameter,meta:{isvisit:true}},//排班管理设置小组
            {path:"/NavDetail/receiptforms",component:receiptforms},//收款报表
            {path:"/NavDetail/refundforms",component:refundforms},//退款报表
            {path:"/NavDetail/perforforms",component:perforforms},//业绩报表
            {path:"/NavDetail/Orderforms",component:Orderforms},//消费报表
            {path:"/NavDetail/dataImport",component:dataImport},//数据导入
            {path:"/NavDetail/SetMessage",component:SetMessage},//短信设置
            {path:"/NavDetail/MessageLog",component:MessageLog},//短信日志
            {path:"/NavDetail/SystemMessage",component:SystemMessage},//系统消息设置
            // {path:"/NavDetail/BackMessage",component:BackMessage},//后台站内消息
            // {path:"/NavDetail/AppMessage",component:AppMessage},//app消息
            {path:"/NavDetail/BusinessTotal",component:BusinessTotal},//营业汇总
            {path:"/NavDetail/ReceiptTotal",component:ReceiptTotal},//收款汇总
            {path:"/NavDetail/ReceiptTotaldetail",component:ReceiptTotaldetail},//收款明细
            {path:"/NavDetail/OrderTotal",component:OrderTotal},//消费汇总
            {path:"/NavDetail/OrderTotaldetail",component:OrderTotaldetail},//消费明细
            {path:"/NavDetail/refundTotal",component:refundTotal},//退款汇总
            {path:"/NavDetail/refundTotaldetail",component:refundTotaldetail},//退款明细
            {path:"/NavDetail/perforTotal",component:perforTotal},//业绩汇总
            {path:"/NavDetail/perforTotaldetail",component:perforTotaldetail},//业绩明细
            {path:"/NavDetail/arriveStore",component:arriveStore},//到店列表
            {path:"/NavDetail/baserule",component:baserule},//基本规则设置
            {path:"/NavDetail/orgdetail",component:orgdetail},//商户信息设置
            {path:"/NavDetail/GrowthValue",component:GrowthValue},//成长值设置
            {path:"/NavDetail/customerAdjust",component:customerAdjust},//客户调整
            {path:"/NavDetail/Dailybalance",component:Dailybalance},//营业日结
            {path:"/NavDetail/Closing",component:Closing},//门店关账
            {path:"/NavDetail/coupon/addCoupon",component:addCoupon},//添加优惠券    
            {path:"/NavDetail/coupon/seeCoupon",component:seeCoupon},//查看优惠券    
            {path:"/NavDetail/coupon",component:coupon},//优惠券列表          
            {path:"/NavDetail/DailybalanceTotal",component:DailybalanceTotal},//日营业汇总
            
          ]
        },
        {path:"/nopermission",component:nopermission},//无权限页
        { path: '*', component: Notfound }
    ]
})

