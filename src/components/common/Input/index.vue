<template>
    <input type="text" :readonly="readonlys" :disabled="disabled" :placeholder="placeholder" @focus="focus" @blur="blur" :value="value" :style="{width:widths,height:Height}" v-on:input.stop="change($event.target.value)" :class="[{'small':small},{'RMBColor':RMBColor},{'BorderBTm':BorderBTm}]" :maxlength="maxlength" @keyup="onkeyup">
</template>
<script>
export default {
    data() {
        return {
            values: ""
        }
    },
    props: {
        placeholder: {
            default: ""
        },
        value: {
            default: ""
        },
        arguName: {
            default: ""
        },
        widths: {
            default: "160px"
        },
        Height:{
            default: "26px"
        },
        readonlys: {
            default: false
        },
        disabled:{
            default: false
        },
        small: {
            default: false
        },
        RMBColor: {
            default: false
        },
        BorderBTm:{
            default:false
        },
        maxlength: {
            default: "30"
        },
        onkeyup:{
            type:Function,
            default:()=>{}
        },
        focus:{
            type:Function,
            default:()=>{}
        },
        blur:{
            type:Function,
            default:()=>{}
        },
    },
    methods: {
        change(e) {
            this.$emit("sonInput", e, this.arguName)
        },
    }

}
</script>
<style scoped>
input {
  height: 26px;
  border-radius: 2px;
  font-size: 1rem!important;
  color: #666666;
    line-height: 26px;
  background: #fff;
  padding: 0 .666667rem;
}
.RMBColor{
    color: #FF962F!important;
}
.BorderBTm{
    border:none!important;
    border-bottom: 1px solid #ccc!important;
}
.BorderBTm:focus{
    border:none!important;
    border-bottom: 1px solid #ccc!important;
}
input.small {
  height: 22px;
}
input::-webkit-input-placeholder {
  color: #ccc;
}
</style>