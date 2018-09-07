<template>
    <input type="checkbox" :checked="checked"/> 
</template>
<script>
    export default{
        props:{
            checked:{
                default:false,
            }
        },
    }
</script>
<style scoped>

</style>