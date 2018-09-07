<template>
    <div class="Workplace model">
        <header class="Header clearfix">
            <div class="left">选择工位</div>
            <div class="right"><i class="icon iconclose" @click="cancleWorkplace"></i></div>
        </header>
        <div class="workbody">
            <ul class="workstatus clearfix">
                <li>可选</li>
                <li class="caned">已选</li>
                <li class="nocan">已占用</li>
            </ul>
            <div class="workdatas">
                <ul class=" clearfix">
                    <li v-for="item in workdatas">
                        <div :class="{status:item.cName,active:item.active}" @click="select(item)">
                            <span>
                                {{item.workplacName}}
                            </span>
                            <p>
                                {{item.cName}}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <Button Name="取消" buttonClass="None" @click.native="cancleWorkplace"/>
            <Button Name="确定"  @click.native="selectWorkplace(item)"/>
        </div>
    </div>
</template>
<script>
    import Button from "../../common/Button"
    export default{
        components: {
            Button
        },
        data(){
            return{
                // workdatas:[
                //     {workplacName:"11",active:false},
                //     {workplacName:"11",cName:"222",active:false},
                //     {workplacName:"11",active:false},
                //     {workplacName:"11",active:false},
                //     {workplacName:"11",active:false},
                //     {workplacName:"11",active:false},
                // ],
                item:{},//选中的工位
            }
        },
        methods: {
            select(item){
                if(item.active){//反选
                    item.active=false;
                    this.item={};
                    return;
                }
                if(item.cName){
                    this.$messagebox.confirm('该工位已被其他客户占用，您确定仍要选择吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.workdatas.map(el=>{
                            el.active=false;
                        })
                        item.active=true;
                        this.item=item;
                    }).catch(() => {
                        // this.$message({
                        //     type: 'info',
                        //     message: '已取消删除'
                        // });
                    });
                }else{
                    this.workdatas.map(el=>{
                        el.active=false;
                    })
                    item.active=true;
                    this.item=item;
                    console.log(item)
                }
            }  
        },
        props:{
            selectWorkplace:{
                type:Function,
                default:()=>{}
            },
            cancleWorkplace:{
                type:Function,
                default:()=>{}
            },
            workdatas:{
                type:Array,
                default:function(){
                    return[]
                }
            }
        },
        // mounted () {
        //     let data={
        //         sCode:this.$getCookie("belongShop"),
        //         pageNumber:1,
        //         pageSize :10
        //     }
        //     this.$post(this.$host+"/api/order/workplace/select",data).then(d=>{
        //         if(d.success){
        //             let data=d.data.content;
        //             data.map(el=>{
        //                 el.active=false;
        //             })
        //             this.workdatas=data;
        //         }
        //     })
        // }
    }
</script>
<style scoped>
    .Workplace{
        width: 600px;
    }
    .footer{
        text-align: center;
        padding: 2rem 0;
    }
    .footer button:last-child{
        margin-left: 24px;
    }
    .Workplace header .left{
        float: left;
    }
    .Workplace header .right{
        float: right;
    }
    .workbody{
        padding: 0 2rem;
    }
    .workstatus li{
        float: left;
        width: 50px;
        margin-bottom: 2rem;
        margin-right: 1rem;
        border: 1px solid #2cbcc8;
        border-radius: 2px;
        color: #2cbcc8;
        text-align: center;
        height: 24px;
    }
    .workstatus li.nocan{
        color: #cccccc;
        border: 1px solid #cccccc;
    }
    .workstatus li.caned{
        color: #ffffff;
        border: 1px solid #2cbcc8;
        background: #2cbcc8;
    }
    .iconclose::before{
        content: "\e61a";
        cursor: pointer;
    }
    .workdatas li{
        float: left;
        width: 20%;
        padding: 1rem;
    }
    .workdatas li>div.status{
        color: #cccccc;
        border: 1px solid #cccccc;
        line-height: 20px;
        padding-top: 10px;
    }
    .workdatas li>div{
        border: 1px solid #2cbcc8;
        color: #2cbcc8;
        border-radius: 2px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
        padding: 0 2px;
    }
    .workdatas li>div>span{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: 100%;
    }
    .workdatas li>div>p{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .workdatas li>div.active,.workdatas li>div.status.active{
        color: #ffffff;
        border: 1px solid #2cbcc8;
        background: #2cbcc8;
    }
    .workdatas{
        padding: 1rem;
        border: 1px solid #efefef;
        max-height: 400px;
        overflow-y: auto;
    }
</style>