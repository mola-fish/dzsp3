class CompInterface {
    constructor(type) {
        this.type = type;
        this.collection = [];
        this._visible = true;
    }
    get visible() {
        return this._visible;
    }
    set visible(visible) {
        this._visible = visible;
        this.collection.map(entity => {
            entity.show = visible;
        });
    }
    show() {
        this.visible = true;
    }
    hide() {
        this.visible = false;
    }
}
export default CompInterface;
