<template>
    <div class="content">
        <div id="webContainer" :class="debug ? 'debug' : ''"></div>

        <slot></slot>
    </div>
</template>
<script setup lang="ts">
/// 整个项目内，地图相关的对象不应该有vue实例来管理，会有严重的性能问题
import MapManager from '@/mapTool/MapManager'
import DataDebug from '../debug/MapDataDebug'
import { onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
import { usemapState } from "@/store/mapState";

let mapManager: any
const props = defineProps(["debug", 'images', 'setting', 'option'])
const proxy: any = getCurrentInstance()
const that: any = proxy?.appContext.config.globalProperties
const mapState = usemapState();
mapState.that = that;
onMounted(() => {
    if (!that.$params_center){
        console.error('尚未配置地图的中心，请配置config.json/params/$params_center属性\n 格式为[经度,纬度,高度]');
    }
    initMap();
    initDebug();
})

/** 初始化地图 */
let initMap = function (): void {
    let singleServer: string = that.$url_single_server
    let inputMode: string = that.$url_inputMode
    let centerViewOp = {
        heading:that.$params_heading,
        pitch:that.$params_pitch,
        roll:that.$params_roll,
    }
    mapManager = new MapManager('webContainer', that.images, that.$params_center, { viewerQuality: that.$params_mode, dem: that.$params_dem_url, singleServer, inputMode,centerViewOp });
}
/** 初始化测试内容 */
let initDebug = function (): void {
    if (props.debug === true) {
        const _debug = new DataDebug(mapManager.viewer);
        _debug.loadDebugTile();
    }
}
</script>

<style lang="less">
@import "../assets/css/common.less";

.content {
    position: relative;
}

#webContainer {
    width: 100vw;
    height: 100vh;

    &.debug {
        --size: 500px;
        width: var(--size);
        height: var(--size);
        position: absolute;
        right: 0;
    }

    .zmap-tip-container {
        .zmap-tip-wrap {
            position: absolute;
        }

        .zmap-tip-wrap[data-render-type='string'],
        .zmap-tip-wrap[data-render-type='table'],
        .zmap-tip-wrap[data-render-type='rich-table'] {
            background: rgba(0, 0, 0, .7);
            font-size: 0.12rem;
            padding: 3px 5px;
            color: white;
        }

        .zmap-tip-wrap[data-render-type='table'],
        .zmap-tip-wrap[data-render-type='rich-table'] {
            background: fade(#00376e, 60%);
            border: 1px solid @theme-color;
            color: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        }

        .zmap-tip-wrap[data-render-type='rich-table'] {
            padding: 0;

            table {
                margin: .06rem .15rem;
            }
        }

        .zmap-tip-wrap[data-render-type='rich-table']::before {
            content: attr(data-title);
            padding: .06rem .15rem;
            display: block;
            background: @theme-color;
        }

        @border-color: rgba(255, 255, 255, .5);
        @border-style: solid;

        table,
        table td {
            border: 1px @border-style @border-color;
            border-collapse: collapse;
            padding: .05rem .07rem;
        }
    }
}
</style>
