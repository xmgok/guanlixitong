<template>
    <!-- <AboutPeople :RadioPeople="Radio"  :AboutPeopleSelected="AboutStoreSelected"/> -->
    <AboutStore :Radio="Radio" :AboutStoreSelected="AboutStoreSelected"/>    
    <!-- <AboutBranch class="AboutBranch" :Selected="AboutStoreSelected"/> -->
</template>
<script>
     import AboutPeople from "../../common/AboutPeople"
    import AboutStore from "../../common/AboutStore";
    import AboutBranch from "../../common/AboutBranch"
    export default{
        components:{
            AboutPeople,AboutStore,AboutBranch
        },
        data(){
            return{
                //true为单选，false为多选
                Radio:true
            }
        },
        methods:{
            //选中的函数（不同情况不同控制）
            AboutStoreSelected(item){
                console.log(item.id)
            }
        }
    }
</script>
<style scoped>
.AboutBranch{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-25%);
    z-index: 1000;
    background: #fff;
}
</style>