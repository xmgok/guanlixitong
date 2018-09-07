<template>
  <div class="tree">
          <ul>
            <li v-for="(item,index) in list" :key="index" @click.stop ="show(index)" class="one">
               <input type="checkbox" :checked="item.checked" @click.stop="checkbox(item.id)">{{item.fName}}
               <!-- <label for="box1"><input type="checkbox"  style="display:none" id="box1" :checked="item.checked" @click.stop="checkbox(item.id)"></label>{{item.fName}} -->
               <transition-group name="fade" tag="li"  >
                  <li v-for="(childs,index) in item.childs" :key="index" v-show="item.active" @click.stop="open(childs.id)" class="tow">
                    <input type="checkbox" :checked="childs.checked" @click.stop="checkbox(childs.id)" >{{childs.fName}}
                    <transition-group name="fade" tag="li"  >
                        <li v-for="(child,index) in childs.childs" :key="index" v-show="childs.active" @click.stop class="tow">
                          <input type="checkbox" :checked="child.checked" @click.stop="checkbox(child.id)" >{{child.fName}}
                        </li>
                    </transition-group>
                  </li>
               </transition-group>
            </li>
          </ul>
    </div>
</template>

<script>
export default {
    props:{
        list:{
            default:[]
        },
        show:{
            type:Function,
            default:()=>{}
        },
        open:{
            type:Function,
            default:()=>{}
        },
        checkbox:{
            type:Function,
            default:()=>{}
        },
    }
}
</script>

<style>
.fade-enter-active, .fade-leave-active{
  transition: all 0.5s ease; 
}
.fade-enter, .fade-leave-active{
  opacity: 0 ;
}
 .tree{
  width: 20rem;
  height: 32rem;
  overflow: auto;
  box-sizing: border-box;
}
.tree:hover{
  background:#ebfdfd;
}
.tree ::-webkit-scrollbar{
  width:0px
}
.tree ul{
  width: 100%;
}
.tree ul li{
  line-height: 2.5rem;
  font-size: 1rem;
  padding: .2rem .5rem;
  cursor:pointer;
  vertical-align: middle;
}
.tree ul .one{
  margin-left: 5rem;
}
.tree .tow{
  margin-left: 2rem;
}
</style>
