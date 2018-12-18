<template>
    <div class="tabbar hairline--top">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Tabbar",
        props:{
            active:{
                type:[Number,String],
                default:0
            }
        },
        model: {
            prop: 'active',
            event: 'change'
        },
        data() {
            return {
                items:[],
            }
        },
        watch:{
            /* eslint-disadble no-new */
            active:{
                immediate: true,  /* eslint-disadble no-new */
                handler(){
                    this.setActiveItem();
                }
            },
            items() {
                this.setActiveItem();
            },
        },

        methods: {
            onChange(active){
                this.$emit('change', active);
            },
            setActiveItem(){
                this.items.forEach((item,index)=>{item.isActive = index === this.active})
            }
        }
    }
</script>

<style scoped lang="scss">
.tabbar{
    position: fixed;
    height: 50px;
    bottom: 0;
    left: 0;
    width:100%;
    display: flex;
    flex-wrap: nowrap;
    background: hsla(0,0%,100%,.98);
    &:before{
        z-index: -1;
        content: '';
        position: absolute;
        top:0;
        right: 0;
        bottom: 0;
        left: 0;
        filter: blur(20px);
    }
}
</style>
