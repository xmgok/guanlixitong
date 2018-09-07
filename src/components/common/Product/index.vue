<template>
  <div class="ProductClass" >
      <ul class="List">
        <Li v-for="(model,index) in list" :model='model' :Index="index" :Selected="Selected" :key="index"/>
        <!-- <li v-for="(Itme,index) in item.childs" :key="index" @click.stop="Inside(item,index)" v-show="item.active" class="TowTier">
            <i :class="[{'unchecked':true},{'checked':Itme.checked}]" @click.stop="checkBox(Itme,index)"></i>                       
            <span>{{Itme.cateName}}</span>
        </li> -->
    </ul>
  </div>
</template>
<script>
    import Li from "./indexList.vue"
    export default {
        data(){
            return{
                open: false,
            }
        },
        components: {
            Li
        },
        props:{
            list:{
                type:Array,
                default:function(){
                    return []
                }
            },
            Selected:{
                type:Function,
                default:()=>{}
            },
        },
}
</script>

<style scoped>
    .List{
        padding-left: .416667rem;
    }
    .ProductClass{
        border: 1px solid #cccccc;
    }
</style>
