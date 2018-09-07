<template>
    <div class="Selecttem" :class="{small:small}">
        <el-select :value="values" placeholder="请选择" :style="{width:widths}" :disabled="disabled" @change="Change" :clearable='clearable' @clear="Clear" @blur="Blur" @focus="Focus" @visible-change="showHide">
            <el-option v-for="item in SelecttemData" :key="item[SelecttemDetail[0]]" :label="item[SelecttemDetail[1]]" :value="item[SelecttemDetail[0]]">
            </el-option>
        </el-select>
    </div>
</template>
<script>
// import {Select,Option} from "element-ui";
// import Vue from "vue";
// Vue.use(Select);
// Vue.use(Option);
export default {
    data() {
        return {
            value: ""
        }
    },
    props: {
        widths: {},
        small: {
            default: false
        },
        SelecttemData: {
            type: Array,
            default: function () {
                return []
            }
        },
        SelecttemDetail: {
            default: []
        },
        arguName: {
            default: ""
        },
        disabled: {
            default: false
        },
        values: {
            default: ""
        },
        clearable: {
            default: true
        },
        sonSelect: {
            type: Function,
            default: () => { }
        },
        sonSelectobj: {
            type: Function,
            default: () => { }
        },
        Blur: {
            type: Function,
            default: () => { }
        },
        Focus: {
            type: Function,
            default: () => { }
        },
        showHide: {
            type: Function,
            default: () => { }
        }
    },
    methods: {
        Change(e) {
            this.$emit("sonSelect", e, this.arguName);
            let obj = {};
            obj = this.SelecttemData.find((item) => {
                return item[this.SelecttemDetail[0]] === e;
            });
            this.$emit("sonSelectobj", obj, e, this.arguName);
        },
        Clear() {
            this.$emit("sonSelectCleaer")
        },

    }
}
</script>
<style >
.Selecttem {
    display: inline-block;
}

.Selecttem .el-input__inner {
    height: 26px !important;
    padding: 0 0.666667rem;
}
.Selecttem .el-input.is-disabled .el-input__inner {
    height: 26px !important;
}
.Selecttem.small .el-input__inner {
    height: 22px;
}
.el-select-dropdown__item {
    font-size: 1rem;
}
</style>