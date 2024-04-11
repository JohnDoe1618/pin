// Файл работы с API Cообщений

// Получить все Сообщения с БД сервера
async function getAllMessagesDB() {
    try {
        const messagesJsonStr = localStorage.getItem('messages');
        if(messagesJsonStr) {
            const messages = JSON.parse(messagesJsonStr);
            if(Array.isArray(messages)) {
                return messages;
            }
        } else {
            localStorage.setItem('messages', '[]');
            return [];
        }
    } catch (err) {
        throw new Error(`api/messagesApi: getAllMessagesDB  => ${err}`);
    }
}

async function getMessagesByPinIdDB(pinId) {
    try {
        const allMessages = JSON.parse(localStorage.getItem('messages'));
        let resultMessages = [];
        allMessages.forEach((message) => {
            if(message.pinId === pinId) {
                resultMessages.push(message);
            }
        });
        return resultMessages;
    } catch (err) {
        throw new Error(`api/messagesApi: getMessagesByPinIdDB  => ${err}`);
    }
}

// Создание нового Сообщения в БД Сервера
async function createNewMessageDB(newMessage) {
    try {
        const messages = JSON.parse(localStorage.getItem('messages'));
        messages.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(messages));
        return newMessage;
    } catch (err) {
        throw new Error(`api/messagesApi: createNewMessageDB  => ${err}`);
    }
}

// Создание нового поста 
async function createNewPostDB(newPost) {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                const messages = JSON.parse(localStorage.getItem('messages'));
                messages.push(newPost);
                localStorage.setItem('messages', JSON.stringify(messages));
                resolve(newPost);
            }, 500);
        });
    } catch (err) {
        throw new Error(`api/messagesApi: createNewPostDB  => ${err}`);
    }
}

export {
    getAllMessagesDB,
    createNewMessageDB,
    getMessagesByPinIdDB,
    createNewPostDB,
}
