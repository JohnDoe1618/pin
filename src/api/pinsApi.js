// Файл работы с API пинов

// Получить все пины с БД сервера
async function getAllPinsDB() {
    try {
        const pinsJsonStr = localStorage.getItem('pins');
        if(pinsJsonStr) {
            const pins = JSON.parse(pinsJsonStr);
            if(Array.isArray(pins)) {
                return pins;
            }
        } else {
            localStorage.setItem('pins', '[]');
            return [];
        }
    } catch (err) {
        throw new Error(`api/pinsApi: getAllPinsDB  => ${err}`);
    }
}

// Создание нового пина в БД Сервера
async function createNewPinDB(newPin) {
    try {
        const pins = JSON.parse(localStorage.getItem('pins'));
        pins.push(newPin);
        localStorage.setItem('pins', JSON.stringify(pins));
        return newPin;
    } catch (err) {
        throw new Error(`api/pinsApi: createNewPinDB  => ${err}`);
    }
}

export {
    getAllPinsDB,
    createNewPinDB,
}