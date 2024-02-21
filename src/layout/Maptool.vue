<template>

</template>

<script>
import { EventBus } from '@/store/EventBus';
export default {
    components: {

    },
    data: function () {
        return {
            return: {

            }
        };
    },
    created () {
        EventBus.$on('conceal', () => {
            // 隐藏风场
        });
        EventBus.$on('concel-typhoon', () => {
            // 展示历史台风路径
        });
        EventBus.$on('typhoonlive', () => {
            // 展示实况台风路径
        });
    },
    methods: {

    }
};
</script>

<style lang="less" scoped>
</style>
