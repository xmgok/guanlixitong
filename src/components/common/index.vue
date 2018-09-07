<template>
    <div>
        <router-view></router-view>
        <div class="theme">
                <Ullist />
                <Table />
                <Input />
                <Button />
                <Checkbox />
                <Radio />
                <Select />
                <Tabs />
                <!-- 分页组件 -->
                <Paging :pageFun="goto"/>
                <!-- 模态框 -->
                <Reminder :detail="detail" :show="show" :close="showToggle"/>
            </div>
    </div>
    
</template>
<script>
    import Input from "./Input";
    import Button from "./Button";
    import Checkbox from "./Checkbox";
    import Radio from "./Radio";
    import Select from "./Select";
    import Ullist from "./Ullist";
    import Table from "./Table";
    import Tabs from "./Tabs";
    import Paging from "./Paging";
    import Reminder from "./Reminder";
    export default{
        data(){
            return{
                show:false,
                detail:"我是内容"
            }
        },
        components:{Input,Button,Checkbox,Radio,Select,Ullist,Table,Tabs,Paging,Reminder},
        methods:{
            goto(){
                console.log("传的方法")
            },
            showToggle(){
                this.show=!this.show;
            }
        }
    }
</script>
<style scoped>
    .theme{
        float: right;
        width: 95%;
        padding-top: 300px;
    }
</style>