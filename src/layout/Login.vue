<template>
    <div>
        <transition name="slide-fade">
            <div class="contain" v-show="visible">
                <div class="contain--bg"></div>
                <img class="contain--image" src="@/assets/image/xy/login-panel.png" alt="">
                <span class="contain--button" @click.once="login">登录</span>
            </div>
        </transition>

    </div>
</template>

<script>
import  EventBus  from '@/utils/EventBus.ts';
export default {
    name: 'AppLogin',
    data() {
        return {
            visible: true
        };
    },
    methods: {
        login() {
            const node = document.querySelector('.map-mapview-cloud-connect');
            node.click();
            setTimeout(() => {
                this.visible = false;
            }, 200);
        }
    },

    mounted() {
        // let time = setInterval(() => {
        //     let node = document.querySelector('.map-mapview-cloud-connect');
        //     if (node != null) {
        //         node.click()
        //         clearInterval(time)
        //     }
        // }, 500)
    }
};
</script>

<style lang="less" scoped>
.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
    {
    transform: translateY(-25%);
    opacity: 0;
}

.contain {
    position: relative;
    z-index: 999;

    &--bg {
        width: 100vw;
        height: 100vh;
        background: rgba(12, 62, 114, .6);
        backdrop-filter: blur(.2rem);
    }

    &--image {
        position: absolute;
        left: 50%;
        top: 45%;
        transform: translate(-50%, -50%);
    }

    &--button {
        border-radius: .08rem;
        color: white;
        cursor: pointer;
        position: absolute;
        left: 50%;
        top: 45%;
        transform: translate(-50%, 200%);
        font-size: 0.16rem;
        padding: 0.5em 4em;
        background: #97cad2;
        transition: background-color .2s ease;

        &:hover {
            background: #60CADA;
        }
    }
}
</style>
