<template>
    <!-- 修改商户信息 -->
    <div class="addContact">
        <header class="header">修改商户信息</header>
        <div>
            <span>商户代码:<input type="text" v-model="datas.cCode"></span>
        </div>
        <div>
            <span>商户名称: <input type="text" v-model="datas.cName"></span>
            <span>商户简称: <input type="text" v-model="datas.cShortName"></span>
            <span>商户地址: <input type="text" v-model="datas.cAddr"></span>
        </div>
        <div>
            <span>联系人: <input type="text" v-model="datas.cLinkman"></span>
            <span>联系电话: <input type="text" v-model="datas.cLinkTel"></span>
            <span>微信号: <input type="text" v-model="datas.cWechat"></span>
        </div>
        <div>
            <span>上级机构: <input type="text" v-model="datas.cParentCode||'无'"></span>
            <span>机构类型: <input type="text" v-model="datas.cOrgType"></span>
            <span>LOGO: <input type="text" v-model="datas.cLogo"></span>
        </div>
        <div>
            <span>机构坐标: <input type="text" v-model="datas.cCoor"></span>
            <span>可含门店: <input type="text" v-model="datas.isMgnStore"></span>
        </div>
        <div class="footer">
            <button @click="this.update">提交</button>
            <button>撤销</button>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                datas:{
                    id:"",
                    cCode:"",
                    cName:"",
                    cShortName:"",
                    cAddr:"",
                    cLinkman:"",
                    cLinkTel:"",
                    cWechat:"",
                    cParentCode:"",
                    cOrgType:"",
                    cCoor:"",
                    cLogo:"",
                    isMgnStore:""
                }
            }
        },
        methods:{
            //修改商户信息
            update(){
                let data={
                    accessToken:this.$getCookie("accessToken"),
                    id:this.datas.id,
                    "cAddr" : this.datas.cAddr,
                    "cCode" : this.datas.cCode,
                    "cCoor" : this.datas.cCoor,
                    "cLinkTel" : this.datas.cLinkTel,
                    "cLinkman" : this.datas.cLinkman,
                    "cLogo" : this.datas.cLogo,
                    "cName" : this.datas.cName,
                    "cOrgType" : parseInt(this.datas.cOrgType),
                    "cParentCode" : this.datas.cParentCode,
                    "cShortName" : this.datas.cShortName,
                    "cWechat" : this.datas.cWechat,
                    "isMgnStore" : parseInt(this.datas.isMgnStore)
                }
                this.$post(this.$host+"/api/sysmgr/ccorp/update",data).then((d)=>{
                    if(d.success){
                        alert("修改成功");
                    }else{
                        alert(d.respMsg)
                    }
                })
            }
        },
        mounted () {
            //获取指定商户信息详情
            let id=this.$route.query.id;
            console.log(id);
            this.$post(this.$host+"/api/sysmgr/ccorp/getOne/"+id,{accessToken:this.$getCookie("accessToken")}).then(d=>{
                if(d.success){
                    this.datas=d.data;
                }else{

                }
            })
        }
    }
</script>
<style scoped>
    .footer{
        border-top:1px solid #333;
        padding-top: 10px;
        text-align: right;
    }
    .addContact{
        width: 60%;
        min-width:800px;
        margin:20px auto;
        border-radius: 10px;
        border:1px solid #ddd;
        padding: 10px 30px 30px 30px;
    }
    .addContact>div{
        margin: 5px 0;
    }
    span{
        width: 33%;
        display: inline-block;
        text-align: right;
    }
    .header{
        font-size: 20px;
        text-align: center;
    }
   input{
        border-radius: 2px;
        border:1px solid #ddd;
        font-size: 16px !important;
        padding: 0 5px;
        color: rgb(85, 85, 85);

    }
    button{
        background: #d5d5d5;
        padding: 5px 20px;
        text-align: center;
        line-height: 20px;
        font-size: 14px !important;
        border-radius: 8px;
        cursor:pointer;
        margin-left: 10px;
    }
    button:hover{
        background:#e6e6e6;
    }
</style>