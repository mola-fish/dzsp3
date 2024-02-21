export type PromiseQueueItem = {
    key: PropertyKey;
    $promise: Promise<any>;
    $resolve: Function;
}
// promise 队列管理工具
export class PromiseQueue {
    private queue: Array<PromiseQueueItem>;

    constructor () {
        this.queue = [];
    }

    /**
     * 添加队列实例
     * @param key {String}
     */
    addItem (key: PropertyKey) {
        const item = {} as PromiseQueueItem;
        item.$promise = new Promise((resolve: Function) => {
            item.$resolve = resolve;
        });
        item.key = key;
        this.queue.push(item);

        return item.$promise;
    }

    /**
     * 更新queue的状态
     * @param key {String}
     * @param instance {MapManager}
     */
    updateQueue (key, instance) {
        return this.queue
            .filter(item => item.key === key)
            .map(item => [
                item.$resolve(instance)
            ]);
    }
}
