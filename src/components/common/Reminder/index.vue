<template>
    <div>
    <Mtk :show="ReminderShow"/>
    <div class="reminder" v-show="ReminderShow">
        <div class="detail">{{ReminderDetail}}</div>
        <div class="sure" @click="Sure">确定</div>
    </div>
</div>
    
</template>
<script>
    import Mtk from "../Mtk";
    import {mapState,mapMutations} from "vuex";
    export default{
        components: {
            Mtk
        },
        computed:{
            ...mapState(["ReminderShow","ReminderDetail"])
        },
        methods:{
            ...mapMutations(["ReminderClick","ReminderCallback"]),
            Sure(){
                this.ReminderClick(this.ReminderCallback);
            }
        }
    }
</script>
<style scoped>
    .reminder{
        position: fixed;
        left: 50%;
        top: 50%;
        z-index: 1000;
        border-radius: 5px;
        background: #fff;
        min-width: 500px;
        min-height: 100px;
        transform: translate(-50%,-50%);
        font-size: 16px;
        border: 1px solid #ccc;
    }
    .detail{
        text-align: center;
        padding: 50px 0;
    }
    .sure{
        text-align: center;
        border-top:1px solid #cccccc;
        padding: 20px 0;
    }
</style>