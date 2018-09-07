<template>
    <div class="tabbable custom-tab">
        <ul class="nav nav-tabs">
            <li v-for="(item,index) in this.datas" :class="{active:item.active}" @click="toggle(item.id)"><a href="javascript:void(0)" data-toggle="tab" >{{item.Name+index}}</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane" :class="{active:this.datas[0].active}" id="tab_1_1">
                <p>I'm in Section 1.</p>
                <p>
                    Phasellus fringilla suscipit risus nec eleifend. Pellentesque eu quam sem, ac malesuada leo. Sed ut quam at magna porttitor hendrerit.
                    Maecenas quis erat fringilla augue feugiat vulputate a eu sem.Vivamus ut diam at turpis varius tempor. Aliquam dictum sagittis erat,
                    vehicula adipiscing diam condimentum id.
                </p>
            </div>
            <div class="tab-pane" :class="{active:this.datas[1].active}" id="tab_1_2">
                <p>Howdy, I'm in Section 2.</p>
                <p>
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,
                </p>
            </div>
            <div class="tab-pane" :class="{active:this.datas[2].active}" id="tab_1_3">
                <p>What up girl, this is Section 3.</p>
                <p>
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                datas:[
                    {id:0,Name:"Section 1",active:true},
                    {id:1,Name:"Section 2",active:false},
                    {id:2,Name:"Section 3",active:false}
                ]
            }
        },
        methods:{
            toggle(index){
                console.log(index)
                this.datas.map((v,i)=>{
                    this.datas.forEach(element => {
                        element.active=false;
                    });
                    this.datas[index].active=true;
                })
            }
        }
    }
</script>
<style scoped>
   .tabbable:before, .tabbable:after {
    display: table;
    line-height: 0;
    content: "";
}
.nav {
    margin-bottom: 20px;
    margin-left: 0;
    list-style: none;
}
.custom-tab > .nav-tabs {
    border: medium none;
    margin: 0;
}
.nav-tabs:before, .nav-pills:before, .nav-tabs:after, .nav-pills:after {
    display: table;
    line-height: 0;
    content: "";
}
.nav-tabs>li, .nav-pills>li {
    float: left;
}

.nav-tabs>li {
    margin-bottom: -1px;
}
a, a:hover {
    text-shadow: none !important;
    color: #4a8bc2;
}
.nav>li>a {
    display: block;
}
.nav-tabs>li>a, .nav-pills>li>a {
    padding-right: 12px;
    padding-left: 12px;
    margin-right: 2px;
    line-height: 14px;
}
.nav-tabs>li>a {
    padding-top: 8px;
    padding-bottom: 8px;
    line-height: 20px;
    border: 1px solid transparent;
    -webkit-border-radius: 4px 4px 0 0;
    -moz-border-radius: 4px 4px 0 0;
    border-radius: 4px 4px 0 0;
}
.nav-tabs>.active>a, .nav-tabs>.active>a:hover, .nav-tabs>.active>a:focus {
    color: #555;
    cursor: default;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-color: transparent;
}
.custom-tab .nav-tabs > li > a {
    border-radius: 0!important;
    -moz-border-radius: 0!important;
    -webkit-border-radius: 0!important;
}
.nav-tabs:before, .nav-pills:before, .nav-tabs:after, .nav-pills:after {
    display: table;
    line-height: 0;
    content: "";
}
.nav-tabs:after, .nav-pills:after {
    clear: both;
}
.tab-content {
    padding: 0px;
    overflow: hidden;
}
.custom-tab > .tab-content {
    /* background-color: #FFFFFF; */
    border: 1px solid #DDDDDD;
    border-radius: 0 0 0 0;
    padding: 10px;
}
.tab-content>.tab-pane, .pill-content>.pill-pane {
    display: none;
}
.tab-content>.active, .pill-content>.active {
    display: block;
}
p {
    margin: 0 0 10px;
}
</style>