<template>
    <div class="ProductServe">
        <!-- 查询头部 -->
        <header class="demandHeader clearfix">
            <div class="Cell">
                输入搜索：<Input placeholder="产品编号/名称" :value="codeOrName" arguName="codeOrName" @sonInput="upInput" :widths="widths" />
            </div>
            <div class="Cell">
                产品分类：
                <ProductTag @sonProductSelect="upProductSelect"/>
                <!-- <Select  :values="ProductName"  :SelecttemDetail="['key','value']" @sonSelect="upSelect" @click.native="showProductFunc"  @sonSelectCleaer="upClear" :showHide="showHide"/> -->
                <!-- <Input placeholder="请选择" :value="ProductName"  :widths="widths" class="curor" readonly @click.native="showProductFunc" v-on:mouseenter.native="goinProduct" v-on:mouseleave.native="gooutProduct"/> -->
                <!-- <i class="ProductSelect icon" :class="{Cliked:Cliked,CloseStatus:CloseStatus}" @click="IconshowProductFunc" v-on:mouseenter="goinProduct" v-on:mouseleave="gooutProduct"></i> -->
                <!-- <ProductCategory :list="CategoryList" class="ProductClass" v-show="ProductShow" :Selected="SelectedProduct"/> -->
                <!-- <Select :SelecttemData="SelecttemType" :values="product" arguName="product" :SelecttemDetail="['key','value']" @sonSelect="upSelect" /> -->
            </div>
            <div class="Cell">
                护理时长：<Input placeholder="请输入" :value="psServTime" arguName="psServTime" @sonInput="upInput" :widths="widths" />
                <!-- <Select :SelecttemData="SelecttemDuration" :values="product" arguName="product" :SelecttemDetail="['key','value']" @sonSelect="upSelect" /> -->
            </div>
            <div class="Cell">
                状态：<Select :SelecttemData="SelecttemStatus" :values="psStatus" arguName="psStatus" :SelecttemDetail="['key','value']" @sonSelect="upSelect" />
            </div>
            <div class="Cell">
                <Button Name="查询" @click.native="demandFunc" buttonClass="header"/>                
                <Button Name="重置" @click.native="reset" buttonClass="header"/>
            </div>
        </header>
        <div class="zhuti">
            <!-- 功能头部 -->
            <header class="funcHeader clearfix">
                <ul class="left">
                    <li @click="productAdd"><Button Name="新增"/></li>
                    <li class="btn_group">
                        <button>导入</button>
                        <button>导出</button>
                    </li>
                    <!-- <li><Button Name="导出"/></li> -->
                    <li class="marRight">产品使用门店</li>
                    <li class="marRight">产品规则管理</li>
                    <li class="marRight">产品价格管理</li>
                    
                </ul>
            </header>
            <!-- 列表详情List -->
            <div class="overflower">
                <Table  :TabelHeader="TabelHeader" :Tbody="Tbody" :demandShow="demandShow" :demandFunc="demandFuncId" :editShow="demandShow"  :editFunc="editFunc" amend="修改" :datas="datas" :update="update" :deleteItem="deleteItem" :NoDo="true" :widthValue="'1150px'" :PageNum="PageNum" />
                <Paging :handleCurrentChange="handleCurrentChange" :total="total" class="pagingwidth" v-show="total>10"/>
            </div>
            <div class="model" v-show="modelShow">
                <header>重新上架<i class=""></i></header>
                <div class="modeldetail">
                    该产品已下架，您确定要将它重新上架？
                    您需要重新设定该产品的自动下架和停用日期
                    如若不填，则按空值处理
                    <div class="date">
                        下架日期：<TakeTimePiker arguName="psOffShelf" @clickTakeTimePiker="upDatePiker" />
                    </div>
                </div>
                <div class="footer">
                    <Button Name="取消" @click.native="cancle"/>
                    <Button Name="确定" @click.native="sureEditFunc"/>
                </div>
            </div>
        </div>
        <MTK v-show="modelShow"/>
    </div>
</template>
<script>
    import Select from "../../../common/Select";
    import Input from "../../../common/Input";
    import Table from "../../../common/Table";
    import Button from "../../../common/Button";
    import Paging from "../../../common/Paging";
    import TakeTimePiker from "../../../common/TakeTimePiker";
    import MTK from "../../../common/Mtk";
    import ProductCategory from "../../../common/Product";//产品分类
    import ProductTag from "../../../common/ProductTag"
    export default {
        components: {
            Table,Input,Select,Button,Paging,TakeTimePiker,MTK,ProductCategory,ProductTag
        },
        data(){
            return{
                ProductName:"",
                ProductShow:false,
                CloseStatus:false,
                Cliked:false,
                CategoryList:[],//产品分类的数据
                productList:"product",//服务或套卡的识别
                listHeader:"服务列表",
                modelShow:false,
                demandShow:true,
                widths:"120px",
                product:"",
                SelecttemType:[],//产品分类数据
                SelecttemDuration:[],//护理时长数据
                SelecttemStatus:[
                    {key:0,value:"未上架"},
                    {key:1,value:"已上架"},
                    {key:2,value:"已下架"}
                ],//状态数据
                TabelHeader:[
                    {detail:"编号",width:"100px"},
                    {detail:"产品名称",width:"250px"},
                    {detail:"价格",width:"100px"},
                    {detail:"护理时长",width:"100px"},
                    {detail:"生效日期",width:"100px"},
                    {detail:"停用日期",width:"100px"},
                    {detail:"状态",width:"100px"},
                    {detail:"",width:"250px"},
                ],
                Tbody:["psCode","psName","psPrice","psServTime","psValidTime","psInvalidTime","psStatus"],
                datas:[],
                PageNum:"",
                total:0,
                codeOrName:"",//产品编号/名称
                cateId:"",//产品分类（产品类别id）
                psServTime:"",//护理时长
                psStatus:"",//上下架状态
                productId:"",//产品id
                index:"",//索引
                psOffShelf:"",//下架时间
            }
        },
        methods: {
            showHide(e){
                console.log(e);
                // this.ProductShow=!this.ProductShow;
            },
            upClear(){
                this.ProductName="";
                this.cateId="";
            },
            //选择产品分类
            upProductSelect(id){
                console.log(id)
                this.cateId=id;
                this.showProductFunc();
            },
            showProductFunc(){
                this.Cliked=!this.Cliked;
                this.ProductShow=!this.ProductShow;
            },
            IconshowProductFunc(){

                if(this.CloseStatus){
                    this.ProductName="";
                    this.cateId="";
                    this.Cliked=false;
                    this.CloseStatus=false;
                    return;
                }
                this.showProductFunc();
            },
            // 添加产品
            productAdd(){
                if(this.productList=="product"){//添加产品服务
                    this.$router.push({
                        path:"/NavDetail/ProductServe/ProductServeAdd"
                    })
                }else if(this.productList=="prtcard"){//添加产品套卡
                    this.$router.push({
                        path:"/NavDetail/ProductServe/ProductCardAdd"
                    })
                }
                
            },
            upDatePiker(value,arguName){
                this[arguName]=value;
            },
            // 查看
            demandFuncId(item){
                console.log(item.id)
                if(this.productList=="product"){//查看产品服务
                    this.$router.push({
                        path:"/NavDetail/ProductServe/ProductServeAdd",
                        query:{
                            id:item.id,
                            detail:"detail"
                        }
                    })
                }else if(this.productList=="prtcard"){//查看产品套卡
                    this.$router.push({
                        path:"/NavDetail/ProductServe/ProductCardAdd",
                        query:{
                            id:item.id,
                            detail:"detail"
                        }
                    })
                }
                
            },
            // 上下架
            editFunc(item,index){
                if(item.psStatus=="未上架"){//未上架的立即上架
                    let canshu="prtserv";
                    if(this.productList=="product"){//服务
                        canshu="prtserv";
                    }else if(this.productList=="prtcard"){//套卡
                        canshu="prtcard";
                    }
                    this.$post(this.$host+"/api/prod/"+canshu+"/up",{id:item.id}).then(d=>{
                        if(d.success){
                            this.$message({
                                type:"success",
                                message:"该产品已上架成功"
                            });
                            this.datas[index].psStatus="已上架";
                            this.datas[index].editName="下架";
                        }
                    })
                }else if(item.psStatus=="已上架"){//已上架的立即下架
                    let canshu="prtserv";
                    if(this.productList=="product"){//服务
                        canshu="prtserv";
                    }else if(this.productList=="prtcard"){//套卡
                        canshu="prtcard";
                    }
                    this.$post(this.$host+"/api/prod/"+canshu+"/down",{id:item.id}).then(d=>{
                        if(d.success){
                            if(d.success){
                                this.$message({
                                    type:"success",
                                    message:"该产品已下架成功"
                                });
                                this.datas[index].psStatus="已下架";
                                this.datas[index].editName="上架";
                            }
                        }
                    })
                }else{//已下架的上架操作（弹框）
                    this.modelShow=true;
                    this.productId=item.id;
                    this.index=index;
                    
                }
            },
            //已下架的重新上架（确定）
            sureEditFunc(){
                let canshu="prtserv";
                if(this.productList=="product"){//服务
                    canshu="prtserv";
                }else if(this.productList=="prtcard"){//套卡
                    canshu="prtcard";
                }
                let data={
                    id:this.productId,
                    psOffShelf:this.psOffShelf?(this.psOffShelf+" 00:00:00"):this.psOffShelf
                }
                this.$post(this.$host+"/api/prod/"+canshu+"/up",data).then(d=>{
                    if(d.success){
                        this.psOffShelf="";
                        this.$message({
                            type:"success",
                            message:"该产品已上架成功"
                        });
                        this.datas[this.index].psStatus="已上架";
                        this.datas[this.index].editName="下架";
                        this.cancle();
                    }
                })
            },
            // 取消上架
            cancle(){
                this.modelShow=false;
                this.productId="";
                this.index="";
            },
            upInput(value,arguName){
                this[arguName]=value;
            },
            upSelect(value, arguName){
                this[arguName]=value;
                console.log(value)
            },
            // 修改
            update(item){
                console.log(item)
                if(this.productList=="product"){//修改产品服务
                    this.$router.push({
                        path:"/NavDetail/ProductServe/ProductServeAdd",
                        query:{
                            id:item.id,
                            update:"update"
                        }
                    })
                }else if(this.productList=="prtcard"){//修改产品套卡
                    this.$router.push({
                        path:"/NavDetail/ProductServe/ProductCardAdd",
                        query:{
                            id:item.id,
                            update:"update"
                        }
                    })
                }
                
            },
            // 删除
            deleteItem(item,index){
                this.$messagebox.confirm('确定删除'+item.psCode+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                        duration:"800",
                        onClose:()=>{
                            this.$post(this.$host+"/api/prod/prtserv/delete",{id:item.id}).then(d=>{
                                if(d.success){
                                    this.datas.splice(index, 1);
                                    this.total--;
                                }
                            })
                        }
                    });
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            // 重置
            reset(){
                this.codeOrName="";
                this.cateId="";
                this.psServTime="";
                this.psStatus="";
                this.ProductName="";
            },
            //查询
            demandFunc(){
                let data={
                    pageNumber:this.PageNum+1,
                    pageSize:10,
                    codeOrName:this.codeOrName,//产品编号/名称
                    cateId: this.cateId,//产品分类（产品类别id）
                    psServTime:this.psServTime,//护理时长
                    psStatus:this.psStatus//上下架状态
                }
                if(this.productList=="product"){//服务分页查询
                    this.$post(this.$host+"/api/prod/prtserv/page",data).then(d=>{
                        let content=d.data.content;
                        content.map(el=>{
                            switch(el.psStatus){
                                case 0:el.psStatus="未上架";el.editName="上架";break;
                                case 1:el.psStatus="已上架";el.editName="下架";break;
                                case 2:el.psStatus="已下架";el.editName="上架";break;
                            };
                            el.psPrice="￥"+el.psServTime;//价格
                            el.psServTime=el.psServTime+"分钟";//护理时长
                            el.psValidTime=this.$dateFormat("yy-MM-dd",el.psValidTime);//生效日期
                            el.psInvalidTime=this.$dateFormat("yy-MM-dd",el.psInvalidTime);//失效日期
                        });
                        this.datas=content;
                        this.total=d.data.total;
                    })
                }else if(this.productList=="prtcard"){//套卡
                    this.$post(this.$host+"/api/prod/prtcard/page",data).then(d=>{
                        let content=d.data.content;
                        content.map(el=>{
                            switch(el.psStatus){
                                case 0:el.psStatus="未上架";el.editName="上架";break;
                                case 1:el.psStatus="已上架";el.editName="下架";break;
                                case 2:el.psStatus="已下架";el.editName="上架";break;
                            };
                            el.psPrice="￥"+el.psServTime;//价格
                            el.psServTime=el.psServTime+"分钟";//护理时长
                            el.psValidTime=this.$dateFormat("yy-MM-dd",el.psValidTime);//生效日期
                            el.psInvalidTime=this.$dateFormat("yy-MM-dd",el.psInvalidTime);//失效日期
                        });
                        this.datas=content;
                        this.total=d.data.total;
                    })
                }            
                
            },
            // 分页查询
            handleCurrentChange(index){
                let data={
                    pageNumber:index,
                    pageSize:10,
                    codeOrName:this.codeOrName,//产品编号/名称
                    cateId: this.cateId,//产品分类（产品类别id）
                    psServTime:this.psServTime,//护理时长
                    psStatus:this.psStatus//上下架状态
                }
                if(this.productList=="product"){//服务分页查询
                    this.$post(this.$host+"/api/prod/prtserv/page",data).then(d=>{
                        if(d.success){
                            let content=d.data.content;
                            content.map(el=>{
                                switch(el.psStatus){
                                    case 0:el.psStatus="未上架";el.editName="上架";break;
                                    case 1:el.psStatus="已上架";el.editName="下架";break;
                                    case 2:el.psStatus="已下架";el.editName="上架";break;
                                };
                                el.psPrice="￥"+el.psServTime;//价格
                                el.psServTime=el.psServTime+"分钟";//护理时长
                                el.psValidTime=this.$dateFormat("yy-MM-dd",el.psValidTime);//生效日期
                                el.psInvalidTime=this.$dateFormat("yy-MM-dd",el.psInvalidTime);//失效日期
                            });
                            this.datas=content;
                            this.total=d.data.total;
                             // 处理分页的序号问题
                            if (index > 1) {//第二页
                                this.PageNum = index - 1;
                            } else {//第一页
                                this.PageNum = 0;
                            }
                        }
                    })
                }else if(this.productList=="prtcard"){//套卡
                    this.$post(this.$host+"/api/prod/prtcard/page",data).then(d=>{
                        if(d.success){
                            let content=d.data.content;
                            content.map(el=>{
                                switch(el.psStatus){
                                    case 0:el.psStatus="未上架";el.editName="上架";break;
                                    case 1:el.psStatus="已上架";el.editName="下架";break;
                                    case 2:el.psStatus="已下架";el.editName="上架";break;
                                };
                                el.psPrice="￥"+el.psServTime;//价格
                                el.psServTime=el.psServTime+"分钟";//护理时长
                                el.psValidTime=this.$dateFormat("yy-MM-dd",el.psValidTime);//生效日期
                                el.psInvalidTime=this.$dateFormat("yy-MM-dd",el.psInvalidTime);//失效日期
                            });
                            this.datas=content;
                            this.total=d.data.total;
                             // 处理分页的序号问题
                            if (index > 1) {//第二页
                                this.PageNum = index - 1;
                            } else {//第一页
                                this.PageNum = 0;
                            }
                        }
                    })
                }
            },
            demandAll(){
                if(this.productList=="product"){//服务
                    // 查询全部
                    let data={
                        pageNumber:1,
                        pageSize:10
                    }
                    this.$post(this.$host+"/api/prod/prtserv/page",data).then(d=>{
                        if(d.success){
                            let content=d.data.content;
                            content.map(el=>{
                                switch(el.psStatus){
                                    case 0:el.psStatus="未上架";el.editName="上架";break;
                                    case 1:el.psStatus="已上架";el.editName="下架";break;
                                    case 2:el.psStatus="已下架";el.editName="上架";break;
                                };
                                el.psPrice="￥"+el.psServTime;//价格
                                el.psServTime=el.psServTime+"分钟";//护理时长
                                el.psValidTime=this.$dateFormat("yy-MM-dd",el.psValidTime);//生效日期
                                el.psInvalidTime=this.$dateFormat("yy-MM-dd",el.psInvalidTime);//失效日期
                            });
                            this.datas=content;
                            this.total=d.data.total;
                            console.log(this.datas)
                        }
                    })
                }else if(this.productList=="prtcard"){//套卡
                    this.listHeader="套卡列表";
                    // 查询全部
                    let data={
                        pageNumber:1,
                        pageSize:10
                    }
                    this.$post(this.$host+"/api/prod/prtcard/page",data).then(d=>{
                        if(d.success){
                            let content=d.data.content;
                            content.map(el=>{
                                switch(el.psStatus){
                                    case 0:el.psStatus="未上架";el.editName="上架";break;
                                    case 1:el.psStatus="已上架";el.editName="下架";break;
                                    case 2:el.psStatus="已下架";el.editName="上架";break;
                                };
                                el.psPrice="￥"+el.psServTime;//价格
                                el.psServTime=el.psServTime+"分钟";//护理时长
                                el.psValidTime=this.$dateFormat("yy-MM-dd",el.psValidTime);//生效日期
                                el.psInvalidTime=this.$dateFormat("yy-MM-dd",el.psInvalidTime);//失效日期
                            });
                            this.datas=content;
                            this.total=d.data.total;
                            console.log(this.datas)
                        }
                    })
                }
            },
            // 获取产品分类的数据
            getCategoryList(){
                this.$post(this.$host+"/api/prod/productcate/tree",{}).then(d=>{
                    if(d.success){
                        this.CategoryList=d.list;
                    }
                })
            }
        },
        mounted () {
            this.productList=this.$route.query.category;
            this.demandAll();
            this.getCategoryList();
        }
    }
</script>
<style scoped>
    .zhuti{
        background: #ffffff;
        margin-top: 1.333333rem;
        padding-left: 2rem;
        min-height: 100vh;
    }
    .overflower{
        overflow:auto;
    }
    .ProductClass{
        position: absolute;
        left: 5.583333rem;
        top: 2.666667rem;
        z-index: 3000;
        width: 20.833333rem;
        background: #ffffff;
        border-radius: .333333rem;
    }
    .ProductSelect{
        position: absolute;
        right: 1.2rem;
        top: .75rem;
        width: 8px;
        height: 8px;
        border-right: 1px solid #cccccc;
        border-bottom: 1px solid #cccccc;
        transform: rotate(45deg);
        cursor: pointer;
        transition: all 0.2s linear;
        transform-origin: 75% 75%;
    }
    .pagingwidth{
        width: 96.666667rem;
    }
    .ProductSelect.Cliked{
        transform: rotate(-135deg);
    }
    .ProductSelect.CloseStatus{
        position: absolute;
        right: 1.2rem;
        top: .416667rem;
        width: 8px;
        height: 8px;
        cursor: pointer;
        border-right: none;
        border-bottom: none;
        transform: rotate(0deg);
    }
    .ProductSelect.CloseStatus::before{
        content: "\e613"
    }
    .curor{
        cursor: pointer;
    }
    .ProductServe{
        min-height: 100vh;
    }
    .ProductServe .demandHeader{
        background-color: #82a9bf;
        font-size: 1.166667rem;
        padding: 8px 12px;
        border: 1px solid #6F97AD;
        border-radius: .25rem;
    }
    .ProductServe .demandHeader .Cell{
        float: left;
        margin-right: 1rem;
        vertical-align: middle;
        position: relative;
        height: 2.5rem;
        line-height: 2.5rem;
    }
    .ProductServe .demandHeader .Cell button{
        margin-left: 2rem;
    }
    .ProductServe .model{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background: #fff;
        border-radius: .333333rem;
        width: 33.333333rem;
        z-index: 1000;
    }
    .ProductServe .model header{
        font-size: 1.166667rem;
        background: #eeeeee;
        padding: 6px .833333rem;
    }
    .ProductServe .model {
        
    }
    .ProductServe .model .modeldetail{
        width: 300px;
        margin: 0 auto;
        padding: 1rem 0;
    }
    .ProductServe .model .modeldetail .date{
        margin-top: 1rem;
    }
    .ProductServe .model .footer{
        text-align: right;
        padding: 1.166667rem;
    }
    .ProductServe .funcHeader{
        padding: 1rem 0px;
    }
    .ProductServe .funcHeader .left{
        float: left;
    }
    .ProductServe .funcHeader .right{
        float: right;
    }
    .ProductServe .funcHeader .left li{
        float: left;
        margin-right: 2rem;
        cursor: pointer;
        color: #386b88;
        font-size: 1.166667rem;
    }
    .ProductServe .funcHeader .left li.marRight{
        margin-right: 1rem;
        height: 2.166667rem;
        line-height: 2.166667rem;
    }
</style>