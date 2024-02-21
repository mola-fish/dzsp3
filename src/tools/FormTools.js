class FormTools {
    static createFormData (data) {
        const form = new FormData();
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                form.append(key, data[key]);
            }
        }
        return form;
    }

    static createArrayFormData (list, key = 'id') {
        const form = new FormData();
        list.forEach(val => {
            form.append(key + '[]', val);
        });
        return form;
    }
}

export default FormTools;
