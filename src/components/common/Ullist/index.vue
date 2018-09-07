<template>
    <ul>
        <li>li1</li>
        <li>li1</li>
        <li>li1</li>
        <li>li1</li>
        <li>li1</li>
    </ul>
</template>
<script>
    export default{
        
    }
</script>
<style scoped>
    ul{
        padding: 10px;
    }
    li{
        background: #c09853;
        padding: 8px 35px 8px 14px;
        margin-bottom: 20px;
        text-shadow: 0 1px 0 rgba(255,255,255,0.5);
        background-color: #fcf8e3;
        border: 1px solid #fbeed5;
        font-size: 16px;
    }
    li:nth-child(odd){
        background: #ddd;
        border: 1px solid #ddd;
    }
</style>