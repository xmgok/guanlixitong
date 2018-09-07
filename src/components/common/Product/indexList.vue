<template>
    <li >
        <i @click.stop.prevent='toggle($event)' v-if="isFolder" class="fa icon" :class="{'fa-folder-open':open}"></i>
        <i :class="model.childs?'iconF':'iconN'" class="icon curor" @click="Selected(model,Index)"></i>            
        <span @click="Selected(model,Index)" class="curor">{{model.cateName}}</span>
        <ul v-show="open" v-if='isFolder' class="Second">
            <items v-for="(cel,index) in model.childs" :Index="Index" :model='cel' :Selected="Selected" :key="index"/>
            <!-- <li v-for="(Itme,index) in item.childs" :key="index" @click.stop="Inside(item,index)" v-show="item.active" class="TowTier">
                <i :class="[{'unchecked':true},{'checked':Itme.checked}]" @click.stop="checkBox(Itme,index)"></i>                       
                <span>{{Itme.cateName}}</span>
            </li> -->
        </ul>
    </li>
</template>

<script>
export default {
    name: 'items',
    data(){
        return{
            open: false,
        }
    },
    props:{
        model:{
            type:Object,
            default:{}
        },
        Selected:{
            type:Function,
            default:()=>{}
        },
        Index:{
            default:1
        }

    },
    computed: {
        isFolder: function () {
            return this.model.childs && this.model.childs.length
        }
    },
    methods: {
        toggle: function (event) {
            event.cancelBubble = true;
            if (this.isFolder) {
                this.open = !this.open
            }
        }
    }
}
</script>

<style scoped>
    .curor{
        cursor: pointer;
    }
    li{
        position: relative;
        padding-left: 1.666667rem;
    }
    li span{
        padding-left: .5rem;
    }
    .fa{
        position: absolute;
        left: 0;
        top: 0;
        /* transform: rotate(90deg); */
        cursor: pointer;
        color: #48a7d5;
        padding-right: 10px;
        /* font-size: 1.333333rem; */
        /* transform-origin:0% 50%; */
    }
    .fa.Color{
        color: #eeeeee;
    }
    .fa.fa-folder-open{
        /* transform: rotate(180deg); */
    }
    .fa::before{
        content: "\e65c";
    }
    .fa.fa-folder-open::before{
        content: "\e65e";
        color: #48a7d5;
    }
    .iconF::before{
        content: "\e621";
        color: #48a7d5;
    }
    .iconN::before{
        content: "\e783";
        color: #48a7d5;
    }
</style>
