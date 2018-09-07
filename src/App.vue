<template>
  <div>
    <Header/>
    <Nav />
    <headerNav />
    <div class="rightBody" :style="{height:isHeight}">
      <NavDetail />
    </div>
    <!-- <Common /> -->
  </div>
</template>

<script>
import Header from "./components/Header";
import headerNav from "./components/headerNav";
import Nav from "./components/Nav";
import { mapState } from 'vuex';
// import NavDetail from "./components/NavDetail"
import Common from "./components/common/index";
export default {
  components:{Header,Nav,Common,headerNav,
    NavDetail:()=>import("./components/NavDetail")
  },
  data(){
    return{
      isHeight:(document.documentElement.clientHeight-60)+"px"
    }
  },
  mounted () {
    let that=this;
    window.onresize = function temp() {
        console.log(document.documentElement.clientHeight)
        that.isHeight = (document.documentElement.clientHeight-60)+"px";
    };
  }
}
</script>

<style scoped>
.rightBody{
    position: absolute;
    left: 190px;
    top: 60px;
    right: 0;
    background: #fff;
    padding-top: 40px;
    border-top-right-radius: 2px;
    border-top-left-radius: 2px;
    overflow-y: auto;
    padding-right: 24px;
}
</style>
