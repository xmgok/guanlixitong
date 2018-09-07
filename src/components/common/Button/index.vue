<template>
    <button :class="[buttonClass,small,Btn,BtnTow,'purple',iconShow?'ismargin':'']">
        <i class="icon " v-show="iconShow" :class="[{iconadd:iconadd},{Search:Search},{Reset:Reset},{Role:Role},{Upload:Upload},{Modify:Modify},{Roof:Roof},{Delete:Delete},{icondownload:icondownload}]"></i>{{Name}}</button>
</template>
<script>
export default {
    data() {
        return {
            iconShow: false
        }
    },
    props: {
        json: {
            default: ""
        },
        Name: {
            default: "提交"
        },
        buttonClass: {
            default: ""
        },
        small: {
            default: ""
        },
        Btn: {
            default: ""
        },
        BtnTow: {
            default: ""
        },
        iconadd: {
            default: false
        },
        Search: {
            default: false
        },
        Reset: {
            default: false
        },
        Role: {
            default: false
        },
        Upload: {
            default: false
        },
        Modify: {
            default: false
        },
        Roof: {
            default: false
        },
        Delete: {
            default: false
        },
        buttonFunc: {
            type: Function,
            default: () => { }
        },
        icondownload: {
            default: false
        }
    },
    mounted() {
        if (this.iconadd || this.Search || this.Reset || this.Role || this.Upload || this.Modify || this.Roof || this.Delete || this.icondownload) {
            this.iconShow = true;
        }
    }
}


</script>
<style scoped>
</style>