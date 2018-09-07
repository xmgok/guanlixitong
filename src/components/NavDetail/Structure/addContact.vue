<template>
    <!-- 添加商户信息 -->
    <div class="addContact">
        <header class="header">新增商户信息</header>
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
            <span>上级机构: <input type="text" v-model="datas.cParentCode"></span>
            <span>机构类111型: 
                <select  disabled="disabled" v-model="datas.cOrgType">
                    <option value="1">公司</option>
                    <option value="2">区域</option>
                    <option value="3">部门</option>
                </select>
                <!-- <input type="text" v-model="datas.cOrgType"> -->
            </span>
            <span>LOGO: <input type="text" v-model="datas.cLogo"></span>
        </div>
        <div>
            <span>机构坐标: <input type="text" v-model="datas.cCoor"></span>
            <span>可含门店: <input type="text" v-model="datas.isMgnStore"></span>
        </div>
        <div class="footer">
            <button @click="this.commit">提交</button>
            <button>撤销</button>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                datas:{
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
            //添加商户信息
            commit(){
                let data={
                    accessToken:this.$getCookie("accessToken"),
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
                this.$post(this.$host+"/api/sysmgr/ccorp/add",data).then((d)=>{
                    if(d.success){
                        alert("添加成功")
                    }else{
                        alert(d.respMsg)
                    }
                })
            }
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