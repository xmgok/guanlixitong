<template>
    <div class="Nav " v-show="NavShow"  ref="p">
        <div class="personalInfo">
            <div class="logo">
                <img src="../../../static/img/info/logo.png" alt="">
            </div>
            <div class="detailinfo clearfix">
                <div class="left">
                    <img class="detailinfoImg" :src="$getCookie('uHeader')?$getCookie('uHeader'):'../../../static/img/info/header.png'" alt="">
                </div>
                <ul  class="right">
                    <li>{{ucode}}</li>
                    <li>{{uname}}</li>
                    <li>
                        <i class="icon iconnews"></i>
                        <i class="icon iconset" @click.stop="Personal"></i>
                    </li>
                </ul>
            </div>
        </div>
        <el-menu
        :style="{height:menuHeight}" 
        default-active="2"
        unique-opened
        class="el-menu-vertical-demo "
        @open="handleOpen"
        @close="handleClose">
        <el-menu-item index="-1" class="el-submenu__title" @click="gotoindex">
        <i class="icon iconindex"></i>
        <span slot="title">首页</span>
      </el-menu-item>
        <el-submenu  v-for="(item,index) in this.auths.filter(this.isfCode)" :index="''+index" :key="index">
          <template slot="title">
            <i class="icon cor_menu" :class="item.fCode"></i>
            <span class="cor_menu">{{item.fName}}</span>
          </template>
          <el-menu-item-group class="el_Nav">
            <el-menu-item :index="''+index+'-'+subindex" v-for="(it,subindex) in Filter(item.fCode)" :key="subindex" @click="gotoDetail($event,it.fUrl)">{{it.fName}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
</template>
<script>
    import {mapState,mapMutations} from "vuex";
    import Vue from "vue";
    import {Menu,Submenu,MenuItem,MenuItemGroup} from "element-ui";
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    export default {
        data(){
            return{
                datas:[],
                show:[{id:false},{id:false}],
                unique:true,
                ucode:"",
                uname:"",
                menuHeight:(document.documentElement.clientHeight-160)+"px"
            }
        },
        methods:{
            ...mapMutations(["getauths"]),
            gotoindex(){
                this.$router.push({path:'/index'})
            },
            Personal(){
                this.$router.push({path:'/NavDetail/Personal'})
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            //过滤一级菜单
            isfCode(el){
                return (el.fParentCode=="0"&&el.fType==1);
            },
            //切换导航栏
            toggle(index){
                this.show.map((v,i)=>{
                    if(i==index){
                        v.id=!v.id;
                    }else{
                        v.id=false;
                    }
                })
            },
            //跳转去下级菜单详情
            gotoDetail(e,url){
                e.cancelBubble=true;//阻止冒泡
                console.log(url)
                this.$router.push({
                    path:"/NavDetail/"+url
                })
            },
            //过滤出来对应的二级菜单
            Filter(fCode){
               return this.auths.filter((el)=>{
                    return (el.fParentCode==fCode);
                })
            }
        },
        computed: {
            //获取vuex的auths数据
            ...mapState(["auths","NavShow"]),
            isHeight:function(){
               return (document.documentElement.clientHeight)+"px"
            },
            // menuHeight:function (){
            //     return (document.documentElement.clientHeight-160)+"px"
            // }
        },
        mounted () {
            // console.log(JSON.stringify(this.auths));
            // console.log(this.$refs.p.offsetTop);
            const that = this;
            window.onresize = function temp() {
                that.menuHeight = (document.documentElement.clientHeight-160)+"px";
            };
            this.ucode=this.$getCookie("ucode")||"";
            this.uname=this.$getCookie("uname")||"";
        }
    }
</script>
<style lang="less">
    /* @import url("../../../static/img/iconlist.png"); */
    /* @import url("../../assets/css/commonLess.less") */
    /* @import url("../../assets/css/commonLess.less"); */
.Nav{
    width: 190px;
    font-size: 14px; 
    position: fixed;
    left: 0;
    top: 0;
    background: #5d717c;
    height: 100vh;
}
.Nav li.el-menu-item.el-submenu__title{
    text-align: left;
}
.Nav .right{
    color: #fff;
}
.Nav .iconnews::before{
    content: "\e68b";
}
.Nav .icon.iconnews{
    margin-right: 12px;
}
.Nav .iconset::before{
    content: "\e620";
    cursor: pointer;
}
.Nav .el-menu{
  border-right:none;
  overflow-y: auto;
}
.Nav .el-submenu__title{
    padding-left: 2.333333rem !important;
}
.Nav .el-icon-arrow-down:before{
    font-family:pictos;
    content: "\e65e";

}
.Nav .el-menu-item.el-submenu__title{
    border-left:none;
}
.Nav .el-menu-item.el-submenu__title:hover,.Nav .el-menu-item.el-submenu__title.is-active,.Nav .el-menu-item.el-submenu__title:focus{
    border-left: none !important;
}
.Nav .icon{
    font-size: 1.333333rem;
    margin-right: 1.666667rem;
}
.Nav .personalInfo{
    height:160px;
}
.Nav .personalInfo .logo{
    padding: 10px 0;
    text-align: center;
}
.Nav .personalInfo .detailinfo .left{
    float: left;
    width: 50%;
    padding-left: 25px;
}
.Nav .personalInfo .detailinfoImg{
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
}
.Nav .personalInfo .detailinfo .right{
    float: right;
    width: 50%;
    font-size: 14px;
}
.Nav .personalInfo .detailinfo .right li{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.iconindex::before{
    content: "\e662";
}
.Nav .icon.F001::before{
    content: "\e602";
}
.Nav .icon.F009::before{
    content: "\e61b";
}
.Nav .icon.F013::before{
    content: "\e677";
}
.Nav .icon.F020::before{
    content: "\e627";
}
.Nav .icon.F051::before{
    content: "\e604";
}
.Nav .icon.F059::before{
    content: "\e7c0";
}
.Nav .icon.F120::before{
    content: "\e660";
}
.Nav .icon.F130::before{
    content: "\e7a8";
}
.Nav .icon.F110::before{
    content: "\e623";
}
.Nav .icon.F168::before{
    content: "\e687";
}
.Nav li{
    width: 100% !important;
}
.Nav .el-menu-item{
    border-left: 5px solid transparent;
}
.Nav .el-submenu .el-menu-item{
    min-width:0%;
}
.Nav .el-menu-item-group__title{
    padding: 0;
    height: 0;
}
.Nav li.el-menu-item{
    text-align: center;
}
.Nav .el-submenu [class^=el-icon-]{
    margin-right: 15px;
}
</style>
