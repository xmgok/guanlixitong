<template>
    <div>
    <div v-show="model.show" class="model">
        <header v-if="model.title">{{model.title}}</header>
        <div>
            <i class="waring"></i>
            {{model.content}}</div>
        <div class="footer">
            <Button v-show="model.sureName" :Name="model.sureName" @click.native="model.confirm"/>
            <Button v-show="model.cancelName" :Name="model.cancelName" @click.native="model.cancel"/>
            <!-- <span @click="model.confirm" v-show="model.sureName">{{model.sureName}}</span> -->
            <!-- <span @click="model.cancel" v-show="model.cancelName">{{model.cancelName}}</span> -->
        </div>
    </div>
    <MTK v-show="model.show"/>
</div>
    
</template>
<script>
    import Button from "../../common/Button"
    import MTK from "../../common/Mtk"
    export default{
        components: {
            MTK,Button
        },
        props:{
            model:{
                show:false,
                title:"",
                content:"",
                sureName:"",
                cancelName:"",
                cancel:()=>{},
                confirm:()=>{}
            }
        }
    }
</script>
<style scoped>
    .model{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        min-width: 300px;
        background: #ffffff;
        padding: 2.5rem 2.666667rem 1.666667rem 2.666667rem;
        color: #444444;
        z-index: 1000;
        font-size: 1.166667rem;
        border: 1px solid #cccccc;
    }
    .model .footer{
        margin-top: 2.5rem;
    }
    .model .waring::before {
  content: "\e6ab";
  color: #e6a23c;
}
    .model .footer button:first-child{
        background: #ffffff;
        color: #444444;
        border: 1px solid #cccccc;
    }
    .model .footer button:last-child{
        background: #82a9bf;
        color: #fffefe;
        margin-left: 1.666667rem;
        border: 1px solid #82a9bf;
    }
</style>