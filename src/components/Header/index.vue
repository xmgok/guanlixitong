<template>
    <div class="HeaderComponent">
        <ul class="left">
            <li>{{$getCookie("sysName")||'店务管理系统'}}</li>
        </ul>
        <ul class="right">
            <li v-show="false"><img :src="srcImg" alt="" ref="img"></li>
            <li  class="HeaderIcon" v-on:mouseover='HeaderIcon' v-on:mouseout='test2()' v-if="hasregister">
                <span>{{registerName.slice(6)}}<i class="icon sanjiao" :class="{zhankai:headerShow}"></i></span>
                <ul v-show="headerShow">
                    <li v-for="item in registerarr" :class="{active:item.active}" @click="selregister(item)">{{item.fName.slice(6)}}</li>
                </ul>
                <i></i>
            </li>
            <li v-show="shopName">当前登录门店：{{shopName}}</li>
            <li @click="logOut">
                <i class="icon iconF"></i>
                <span>退出</span>
            </li>
        </ul>
    </div>
</template>
<script>
    import {mapMutations,mapState} from "vuex";
    export default {
        data(){
            return {
                headerShow:false,
                shopName:"暂无",
                period:"",
                srcImg:"",
                auths:[],
                registerName:"",
                registerarr:[],
                hasregister:false
            }
        },
        methods:{
            ...mapMutations(["getauths","getNavShow","setDatas"]),
            HeaderIcon(){
                this.headerShow=true;
            },
            test2(){
                this.headerShow=false;
            },
            selregister(item){
                this.$post(this.$host+"/api/sysmgr/changeCorp",{toBelongOrg:item.fauth}).then((d)=>{
                    if(d.success){
                        this.$setCookie("auths",JSON.stringify(d.auths));//用户auths
                        this.$setCookie("accessToken",d.accessToken);//用户token
                        this.$setCookie("belongOrg",d.belongOrg);//用户belongOrg
                        this.$setCookie("belongShop",d.belongShop);//用户belongShop
                        this.$setCookie("uname",d.uname);//用户uname
                        this.$setCookie("ucode",d.ucode);//用户ucode
                        this.$setCookie("dept",d.dept);//用户dept
                        this.$setCookie("shopName",d.shopName);//用户shopName
                        this.$setCookie("workNo",d.workNo);//用户workNo
                        this.registerarr.map(el=>{
                            el.active=false;
                            if(el.fauth==this.$getCookie("belongOrg")){this.registerName=el.fName;el.active=true;}
                        })
                        this.registerarr.map(el=>{
                            el.active=false;
                        });
                        item.active=true;
                    }
                })
                
            },
            logOut(){//退出登录
                let that = this
                this.$logOut(that)
            },
        },
        mounted () {
            if(!this.$getCookie("accessToken")){//没登录
                this.$router.replace({
                    path:"/"
                })
            }
            //登录用户刷新时获取auths数据到vuex
            if(this.$getSession("auths")){
                this.auths=JSON.parse(this.$getSession("auths"));
                this.auths.map(el=>{
                    if(el.fCode=="F161"){//有切换登录权限
                        this.hasregister=true;
                    }
                })
                if(this.hasregister){
                    this.registerarr=this.auths.filter((el)=>{return el.fParentCode=="F161"});
                    this.registerarr.map(el=>{
                        el.active=false;
                        if(el.fauth==this.$getCookie("belongOrg")){this.registerName=el.fName;el.active=true;}
                    })
                }
                this.getauths(JSON.parse(this.$getSession("auths")));
            }else{
                this.$router.replace({
                    path:"/"
                })
            }   
            this.shopName=this.$getCookie("shopName")||"";
            console.log(JSON.parse(this.$getSession("auths")))  
            // this.$setCookie("ucode","13391181999");//用户uname
            // this.$setCookie("accessToken","KGDwsLQ6k0bJWYV+HoO3kA==");//用户uname
        }
    }
</script>
<style scoped lang="less">
.HeaderComponent{
    height: 80px;
    font-size: 14px;
    color: #fefefe;
    position: absolute;
    top: 0;
    left: 190px;
    right: 0;
}
.HeaderComponent .iconNav{
    cursor: pointer;
    font-size: 1.5rem;
}
.iconF::before{
    content: "\e63b";

}
.HeaderComponent .iconNav::before{
    content: "\e607";
    color: #ffffff;
}
.HeaderIcon{
    position: relative;
    left: 0;
    top: 0;
    
    cursor: pointer;
}
.sanjiao::before{
    content: "\e605";
    color: #666;
}
.sanjiao{
    display: inherit;
    margin-left: 3px;
    transition: transform .3s;
}
.sanjiao.zhankai{
    transform: rotateZ(180deg); 
}
.HeaderIcon >span{
    background: #ffffff;
    color: #666;
    display: inline-block;
    padding: 0px 10px;
    line-height: 23px;
    border-radius: 12px;
    font-size: 12px;
}
.HeaderIcon>ul{
    position: absolute;
    left: 0px;
    top:50px;
    color: #666;
    border:1px solid #efefef;
    width: 100px;
    border-radius: 5px;
    z-index: 10;
}
.HeaderIcon>ul li{
    text-align: center;
    background: #ffffff;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
.HeaderIcon>ul li:hover{
    background-color: #f5f7fa;
}
.HeaderIcon>ul li.active{
    color: #2cbcc8;
}
.left{
    float: left;
}
.left>li{
    float: left;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
}
.left li img{
    width: 70px;
    vertical-align: middle;
}
.right{
    float: right;
    padding-right: 2.333333rem;
}
.right>li{
    float: left;
    height: 60px;
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    margin-left: 1rem;
}
.right>li span{
    /* width: 50px;
    display: inline-block; */
}
/* .right>li i{
    height: 1.5rem;
    width: 2px;
    background: #f4f4f4;
    border-radius: 2px;
    display: inline-block;
    vertical-align: middle;
} */
.right li input{
    font-size: 16px !important;
}
</style>
