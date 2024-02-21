export type PromiseQueueItem = {
    key: PropertyKey;
    $promise: Promise<any>;
    $resolve: Function;
};
export declare class PromiseQueue {
    private queue;
    constructor();
    /**
     * 添加队列实例
     * @param key {String}
     */
    addItem(key: PropertyKey): Promise<any>;
    /**
     * 更新queue的状态
     * @param key {String}
     * @param instance {MapManager}
     */
    updateQueue(key: any, instance: any): any[][];
}
