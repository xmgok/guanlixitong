import Vue from 'vue'
import Vuex from 'vuex'
import router from "../router/index"
Vue.use(Vuex)

const state = {
    MTKshow:false,
    auths:[
        {fName:1},
        {fName:2}
    ],
    getSysparasTotalPages:0,
    NavShow:true,
    ReminderShow:false,
    ReminderDetail:"处理失败",
    GotoUrl:"",
    Organization:false,
    keepAlives:["Order","Receipt","OpenCard","ResultsAllot","Customer","appointment"],//缓存页面
    corpsvuex:"",//部门数据
    storesvuex:"",//当前部门下的门店
    statposttree:"",//岗位职位
    Postionvuex:'',//职位
    payTypevuex:"",//支付方式
    allstatusvuex:'',//员工状态
    typeDatavuex:'',//变动类型
    functreevuex:'',//当前用户的权限树
    employee:[],//一页员工
    employeetotal:'',//员工数量
    isShopemployee:[],//一页门店服务员工
    isShopemployeetotal:'',//门店服务员工数量
    productcate:"",//产品分类
    AreaParams:"",//地区第一列省
    newOrder:true,//是否拿最新点单数据
    newReceipt:true,//是否拿最新收款数据
    newOpenCard:true,//是否拿最新开卡数据
    newCustomer:true,//是否拿最新会员数据
    belongShopVuex:'',//门店
    deptVuex:'',//部门
}
const mutations = {
    setDatas:(state,setobj)=>{
        state[setobj.name]=setobj.value;
    },
    updateAlives:(state,comNameobj)=>{
        let index=state.keepAlives.indexOf(comNameobj.name)
        // alert(comNameobj.key)
        if(comNameobj.key){//增加缓存
            if(index<0){
                state.keepAlives.push(comNameobj.name)
            }
        }else{//删除缓存
            if(index>-1){
                state.keepAlives.splice(index,1)
            }
        }
        // alert(state.keepAlives)
    },
    "MTKshow":(state)=>{
        if(!state.MTKshow){
            state.MTKshow=true;
        }
    },
    "MTKhide":(state)=>{
        if(state.MTKshow){
            state.MTKshow=false;
        }
    },
    "getauths":(state,json)=>{
        state.auths=json;
    },
    "getNavShow":(state)=>{
        state.NavShow=!state.NavShow;
    },
    //调用提示框方法 detail：提示的信息  Url：提示后操作跳转去哪里
    "ReminderShowFunc":(state,datas)=>{
        state.ReminderDetail=datas.detail||datas||"";
        state.ReminderShow=!state.ReminderShow;
        datas.Url&&(state.GotoUrl=datas.Url);
    },
    //提示框 点击确认的回调
    "ReminderCallback":(state)=>{
        if(state.GotoUrl){
            router.push({
                path:state.GotoUrl
            });
            state.GotoUrl=false;
        }
    },
    //提示框 点击确认
    "ReminderClick":(state,callback)=>{
        state.ReminderShow=!state.ReminderShow;
        (callback && typeof(callback) === "function") && callback();
    }
}
const actions = {
   
}
export default new Vuex.Store({
    state,
    mutations,
    actions,
})