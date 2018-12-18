<template>
    <div class="Tabbar-Item" :class="{TabbarItemActive:isActive}" @click="onClick">
        <div class="icon-div">
            <i class="icon" :class="icon"></i>
        </div>
        <div class="title">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {routerLink} from '_com/js/mixin'

    export default {
        name: "tabbar-item",
        mixins: [routerLink],
        props: {
            icon: {
                type: String
            }
        },
        data() {
            return {
                isActive: false
            }
        },
        computed: {},

        beforeCreate() {
            this.$parent.items.push(this)
        },
        destroyed() {
            this.$parent.items.slice(this.$parent.items.indexOf(this), 1)
        },
        methods: {
            onClick: function () {
                this.$parent.onChange(this.$parent.items.indexOf(this))
                this.routerLink();
            }
        }
    }
</script>

<style scoped lang="scss">
    .Tabbar-Item {
        flex-grow: 1;
        box-sizing: content-box;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: $color-text-g;
        .icon-div {
            .icon {
                font-size: $font-size-large-x;
                line-height: $font-size-large-x;
            }
        }
        .title {
            font-size: $font-size-small-ss;
            line-height: $font-size-small-ss;
            /*-webkit-transform: scale(0.84);*/
            padding-top: 5px;
        }
    }

    .TabbarItemActive {
        color: $color-theme;
    }
</style>
