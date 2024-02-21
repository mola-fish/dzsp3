// promise 队列管理工具
export class PromiseQueue {
    constructor() {
        this.queue = [];
    }
    /**
     * 添加队列实例
     * @param key {String}
     */
    addItem(key) {
        const item = {};
        item.$promise = new Promise((resolve) => {
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
    updateQueue(key, instance) {
        return this.queue
            .filter(item => item.key === key)
            .map(item => [
            item.$resolve(instance)
        ]);
    }
}
