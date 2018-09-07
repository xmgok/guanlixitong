import Vue from 'vue'
import router from './router'
import store from "./store/store.js"
import Index from "./Index";
import $a from "./assets/common";
import { MessageBox,Message } from 'element-ui';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
require("!style-loader!css-loader!less-loader!./assets/reset.css")
require("!style-loader!css-loader!less-loader!./assets/css/commonLess.less")
Vue.config.productionTip = false;
Vue.prototype.$post=$a.post;
Vue.prototype.$get=$a.get;
Vue.prototype.$delete=$a.delete;
Vue.prototype.$getCookie=$a.getCookie;
Vue.prototype.$setCookie=$a.setCookie;
Vue.prototype.$setSession=$a.setSession;
Vue.prototype.$getSession=$a.getSession;
Vue.prototype.$clearCookie=$a.clearCookie;
Vue.prototype.alertF=$a.alertF;
Vue.prototype.$stop=$a.stop;
Vue.prototype.$dateFormat=$a.dateFormat;
Vue.prototype.$messagebox=MessageBox;
Vue.prototype.$message=Message;
Vue.prototype.$checkMobile=$a.checkMobile;
Vue.prototype.$checkEmail=$a.checkEmail;
Vue.prototype.$exportExcel=$a.exportExcel;
Vue.prototype.$base64encode=$a.base64encode;
Vue.prototype.$uploadimg=$a.uploadimg;
Vue.prototype.$logOut=$a.logOut;
var $host='';
var $cspr='';
if(process.env.NODE_ENV=="development"){
$host = "/ip";
$cspr='/cspr';
}else if(process.env.NODE_ENV=="production"){
$host = "";
$cspr='';
}
Vue.prototype.$host=$host;
Vue.prototype.$cspr=$cspr;
let $root=null;
Vue.prototype.$Model={
    setRoot(vm){
        $root=vm;
    },
    //弹出
    create(title,content,sureName,cancelName,confirm=()=>{},cancel=()=>{}){
        if(!$root)return
        $root.model={
            show:true,
            title:title,
            content:content,
            sureName:sureName,
            cancelName:cancelName,
            cancel:cancel,
            confirm:confirm
        }
    },
    //消失
    cancle(){
        if(!$root)return
        $root.model={
            show:false,
            title:"",
            content:"",
            cancel:()=>{},
            confirm:()=>{}
        }
    }
}
router.afterEach((to,from,next) => {
    window.scrollTo(0,0);
});
new Vue({
    router,
    store,
    el: '#app',
    render:h => h(Index)
})