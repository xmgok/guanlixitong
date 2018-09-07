<template>
    <div id="app" class="body">
        <transition :name="transitionName">
            <router-view class="childview "></router-view>
        </transition>
        <div id="MTkFooter" v-show="MTKshow"></div>
        <!-- 遮罩阻拦请求的 -->
    </div>
</template>
<script>
import("../static/fontsize.js");
import Reminder from "./components/common/Reminder";
import Vue from "vue";
import { mapState } from "vuex";
export default {
    components: {
        Reminder
    },
    data() {
        return {
            model: {
                show: false,
                title: "",
                content: "",
                sureName: "",
                cancelName: "",
                cancel: () => { },
                confirm: () => { }
            },
            transitionName: 'slide-left',
        }
    },
    created() {
        this.$Model.setRoot(this)
    },
    beforeCreate() {
        document.getElementsByTagName("body")[0].className = "defaultTheme";
    },
    computed: {
        ...mapState(["MTKshow"])
    },
    mounted() {

    },
}
</script>
<style lang="less">
html,
body {
  min-height: 100%;
  _height: 100%;
  height: 100%;
}
#app.body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #666666;
//   background-color: #f6f6f6;
  height: 100%;
  width: 100%;
  /* overflow-x: hidden; */
}

#MTkFooter {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: transparent;
}
.slide-left-enter {
  opacity: 0;
  transform: translate(30px, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate(-30px, 0);
}
/* .childview {
  transition: all 0.5s linear;
  position: relative;
} */
</style>