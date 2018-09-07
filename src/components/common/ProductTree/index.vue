<template>
    <ul class="ProductTree">
        <Son v-for="(model,index) in list" :model='model' :index="index" :NewProduct="NewProduct" :Modify="Modify" :Roof="Roof" :Delete="Delete" :key="model.id"/>
    </ul>
</template>

<script>
import Son from './Son'
export default {
    components:{Son},
    props:{
        list:{
            default:[]
        },
        NewProduct: {
            type: Function,
            default: () => { }
        },
        Modify: {
            type: Function,
            default: () => { }
        },
        Roof: {
            type: Function,
            default: () => { }
        },
        Delete: {
            type: Function,
            default: () => { }
        },
    },
}
</script>

<style scoped>
.ProductTree{
    border: 1px solid #EFEFEF;
}
.ProductTree li{
    line-height: 2.5rem;
}
</style>
