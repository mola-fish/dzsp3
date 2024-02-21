<template>
    <div class="menu__list">
        <div v-for="(m, i) in menuList" :key="m.key" class="menu__item" :class="{ 'is-active': menuActive === i }" @click="showOperatorPanel(m, i)">
            <div class="menu__item--label">{{ m.label }}</div>
            <div class="menu__item--icon">
                <i v-html="m.icon" class="icon iconfont"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppMenu',
    props: {
        menuList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        menuActive: {
            type: Number,
            require: true
        }
    },
    methods: {
        showOperatorPanel (item, index) {
            this.$emit('update:menuActive', index);
            this.$emit('menuClick', item);
        }
    }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/common.less";

@keyframes rotateRound {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
}

.menu {
    &__list {
        position: fixed;
        left: 0;
        top: @header-logo-height;
        bottom: 0;
        z-index: 3;
        padding: 0 .6rem 0 .1rem;
        height: 0;
    }
    &__item {
        position: relative;
        // width: 1.5rem;
        height: .38rem;
        margin: .5rem 0;
        line-height: .38rem;
        text-align: right;
        font-size: .18rem;
        color: #fff;
        cursor: pointer;
        transform: scale(1);
        // transition: all .2s;
        user-select: none;

        &--label {
            display: inline-block;
            padding: 0 .4rem 0 .3rem;
            background-image: linear-gradient(90deg, transparent, @theme-color 100%);
        }
        &--icon {
            position: absolute;
            right: -.38rem;
            top: -.12rem;
            width: .64rem;
            height: .64rem;
            line-height: .64rem;
            text-align: center;
            border-radius: 50%;

            &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                width: .64rem;
                height: .64rem;
                background-image: linear-gradient(180deg, #f8a419, transparent);
                border-radius: 50%;
                box-shadow: 0 0 .04rem fade(#f8a419, 50%);
            }
            &::after {
                content: "";
                position: absolute;
                left: .02rem;
                top: .02rem;
                width: .6rem;
                height: .6rem;
                background-image: radial-gradient(#4fb1ff 0%, #0959a9 100%);
                border-radius: 50%;
            }
            .icon {
                position: relative;
                z-index: 1;
                font-size: .34rem;
                font-weight: normal;
                color: #fff;
            }
        }
        &:hover{
            transform: scale(1.1);

            .menu__item--icon::before {
                animation: rotateRound .8s linear .2s infinite;
            }
        }
        &.is-active {
            font-weight: bold;
            color: #f8a419;
        }
    }
}
</style>
