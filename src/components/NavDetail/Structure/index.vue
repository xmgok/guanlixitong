<template>
    <!-- 组织结构模块 -->
    <div class="structure">
        <div class="query">
           <span>商户名称:<input type="text"></span>
           <span>联系电话:<input type="text"></span>
           <button>查询</button>
           <button>高级</button>
        </div>
        <div class="add">
            <button @click="this.addContact">新增</button>
            <button>新增门店</button>
        </div>
        <div>
            <!-- 商户列表渲染 -->
                <div class="table table-bordered">
                        <header>
                            <span>商户编号</span>
                            <span>商户名称</span>
                            <span>商户简称</span>
                            <span>商户地址</span>
                            <span>联系人</span>
                            <span>联系电话</span>
                            <span></span>
                        </header>
                            <div  v-for="(item,index) in datas" >
                                <span class="cCode" @click="toggle(index)">{{item.cCode}}</span>
                                <span>{{item.cName}}</span>
                                <span>{{item.cShortName}}</span>
                                <span>{{item.cAddr}}</span>
                                <span>{{item.cLinkman}}</span>
                                <span>{{item.cLinkTel}}</span>
                                <span>
                                    <button @click="update(item.id)">修改</button>
                                    <button @click="deleteItem(item.cCode,index)">删除</button>
                                </span>
                                <transition-group name="fade" tag="div"  >
                                    <div v-for="(items,i) in item.childsCorpDTO" v-show="item.active" :key="i" >
                                        <span class="cCode1">{{items.cCode}}</span>
                                        <span>{{items.cName}}</span>
                                        <span>{{items.cShortName}}</span>
                                        <span>{{items.cAddr}}</span>
                                        <span>{{items.cLinkman}}</span>
                                        <span>{{items.cLinkTel}}</span>
                                        <span>
                                            <button @click="update(items.id)">修改</button>
                                            <button @click="deleteItem(items.cCode,index,i)">删除</button>
                                        </span>
                                    </div>
                                </transition-group>
                            </div>
                    </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                datas:[]
            }
        },
        methods: {
            //新增
            addContact(){
                this.$router.push({
                    path:"/NavDetail/addContact"
                })
            },
            //上下拉切换
            toggle(index){
                this.datas[index].active=!this.datas[index].active;
            },
            //修改
            update(id){
                this.$router.push({
                    path:"/NavDetail/updateContact",
                    query:{
                        id:id
                    }
                })
            },
            //删除
            deleteItem(cCode,index,child){
                let that=this;
                this.$delete(this.$host + "/api/sysmgr/ccorp/delete/"+cCode,{}).then((d)=>{
                   if(d.success){
                        if(child>=0){//二级门店数据
                            that.datas[index].childsCorpDTO.splice(child,1);
                        }else{//一级门店数据
                            if(that.datas[index].childsCorpDTO){
                                alert("有子门店，不可直接删除");
                                return;
                            }
                            that.datas.splice(index,1);
                        }
                    console.log("删除成功");
                   }else{
                       alert(d.respMsg)
                   }
                   
                })
            }
           
        },
        mounted () {
            let data={
                accessToken:this.$getCookie("accessToken")
            }
            //获取列表信息
            let that=this;
            this.$post(this.$host+"/api/sysmgr/ccorp/findAll",data).then((d)=>{
                if(d.success){
                    d.list.map((v,i)=>{
                        return v.active=false;
                    });
                    console.log(d.list)
                    that.datas=d.list;
                }else{
                    alert(d.respMsg)
                }
            })
        }
    }
</script>
<style scoped>
.table .cCode1{
    padding-left: 40px;
}
.fade-enter-active, .fade-leave-active{
  transition: all 0.5s ease; 
}
.fade-enter, .fade-leave-active{
  opacity: 0 ;
}
    .structure{
        min-width: 800px;
        width: 60%;
        margin: 10px auto;
    }
    .query{
        border:1px solid #ddd;
        padding: 10px 0;
        
    }
    .add{
        margin: 30px 0 10px 0;
        text-align: left;
    }
    button{
        background: #d5d5d5;
        padding: 0 6px;
        text-align: center;
        line-height: 20px;
        font-size: 14px !important;
        border-radius: 2px;
        cursor:pointer
    }
    button:hover{
        background:#e6e6e6;
    }
    input{
        border:1px solid #ddd;
        font-size: 16px;
        color: #333;
        padding: 2px 5px;
    }
    .table-bordered {
        border: 1px solid #ddd;
        border-collapse: separate;
        border-left: 0;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        font-size: 0;
    }
    .table-bordered span {
    border-left: 1px solid #ddd;
}
.table span {
    padding: 8px;
    line-height: 20px;
    vertical-align: top;
    border-top: 1px solid #ddd;
    font-size: 16px;
    display: inline-block;
    width: 14.285714285714286%;
    text-align: center;

}
.table header span{
    border-top:none;
}
</style>