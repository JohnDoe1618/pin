<template>
    <div class="pin-chat-main">

        <!-- Уведомление ошибки -->
        <error-note-comp 
        :error-msg="errorMsg"
        ></error-note-comp>

        <!-- Уведомление успеха -->
        <success-note-comp
        @complete="handlerSuccessAnimation"
        ></success-note-comp>

        <contextMenuComp 
        :is-show="isShowContextMenu"
        :position="{x: positionMenuX, y: positionMenuY }"
        :message-id="messageIdForMenu"
        :message-type="messageTypeForMenu"
        :is-loading-delete="isLoadingDeletedMessage"
        @close="isShowContextMenu = false"
        @delete="handlerDeleteMessage"
        @edit="handlerOpenEditMode"
        />

        <!-- Шапка -->
        <div class="pin-chat-main__header">
            <h4 class="header-title">{{ pinData.title }}</h4>
        </div>

        <!-- Блок отрисовки сообщений -->
        <div 
        class="pin-chat-main__body"
        ref="pinChatMainBody"
        >
            <!-- Уведомление "Еще нет Сообщений" -->
            <div 
            class="if-not-messages"
            v-show="!mainStore.messages.length"
            >
                <h1 class="if-not-message__title">Not Message</h1>
            </div>

            <!-- Форма создания поста -->
            <creationPostFormComp 
            :is-show="isShowCreationPost"
            @close="handlerCloseCreationFormPost"
            @success="handlerSuccess"
            />

            <!-- Форма редактирования поста -->
            <editPostFormComp 
            :is-show="isShowEditorPost"
            :post-data="currentMessage"
            @close="handlerCloseEditorFormPost"
            @success="handlerSuccess"
            />

            <pinChatItemComp
            v-for="messageItem in mainStore.messages" 
            :key="messageItem.id" 
            :message-data="messageItem"
            @position="(coords) => handlerMountedContextMenu(coords)"
            />
        </div>

        <!-- Блок периферии -->
        <div class="pin-chat-main__actions-container">

            <!-- Блок обзора редактируемого сообщения -->
            <div class="edit-preview" v-show="chatMode === 'edit'">
                <div class="edit-preview__header">
                    <v-icon icon="mdi-pen" size="20"></v-icon>
                </div>
                <div class="edit-preview__message">
                    <h4 class="edit-preview__title">
                        Edit message
                    </h4>
                    <!-- Контент редактируемого сообщения -->
                    <p class="edit-preview__message-content">
                        {{ messageCopy.textContent }}
                    </p>
                </div>
            </div>

            <form class="pin-chat-main__actions" @submit.prevent>
                <!-- Меню опций панели ввода -->
                <div class="actions--options">
                    <optionsMenuComp 
                    @open-creation-post="isShowCreationPost = true"
                    />
                </div>
    
                <!-- Поле ввода сообщений -->
                <div class="actions--input">
                    <textarea 
                    class="actions-form__message-input"
                    @input="autoExpand"
                    @keyup.shift.enter="handlerCreateMessage"
                    ref="messageInput"
                    placeholder="Enter your message"
                    v-model="message"
                    ></textarea>
                </div>
    
                <!-- Кнопки для управления панелью ввода -->
                <div class="actions--btns">
                    <v-btn 
                    class="btn-send" 
                    icon="mdi-send-variant"
                    @click="handlerCreateMessage"
                    :loading="isLoadingCreationMessage"
                    ></v-btn>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
// API
import optionsMenuComp from './optionsMenuComp.vue';
import creationPostFormComp from './creationPostFormComp.vue';
import editPostFormComp from './editPostFormComp.vue';
import contextMenuComp from './contextMenuComp.vue';
import pinChatItemComp from './pinChatItemComp.vue';
// API
import { 
    createNewMessageDB, 
    getMessagesByPinIdDB, 
    deleteMessageDB, 
    editMessageDB 
} from '../../api/messagesApi';
// STORE
import useMainStore from '@/store/mainStore';
// VUE
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();

// ====================================  DATA  ====================================
const message = ref('');
const messageCopy = ref({
    files: [],
    tags: [],
    textContent: '',
    title: '',
});
const chatMode = ref('default') // default | edit
const pinData = ref({
    id: null,
    title: null,
    description: null,
});
const currentMessage = ref({
    id: 0,
    pinId: 0,
    files: [],
    tags: [],
    textContent: '',
    title: '',
    type: '',
});
const isLoadingCreationMessage = ref(false);
const isLoadingDeletedMessage = ref(false);
const maxHeightInput = ref('30px');
const isShowCreationPost = ref(false);
const isShowEditorPost = ref(false);
const errorMsg = ref('');
// DOM ELEMENTS
const pinChatMainBody = ref(null);
const messageInput = ref(null);
// Context Menu
const positionMenuX = ref(0);
const positionMenuY = ref(0);
const messageIdForMenu = ref(null);
const messageTypeForMenu = ref('default'); // default | post
const isShowContextMenu = ref(false);


// ====================================  METHODS  ====================================
// Функция выполняет действия для отображения сообщения которое необходимо отредактировать
function handlerOpenEditMode(messageId) {
    try {
        // Достаем объект сообщения из массива сообщений
        const foundMessage = mainStore.messages.find((message) => {
            return message.id === messageId;
        });
        // Запоминаем сообщение с которым работаем
        currentMessage.value = {
            files: foundMessage?.files ?? null,
            id: foundMessage.id ?? null,
            pinId: foundMessage.pinId ?? null,
            tags: foundMessage?.tags ?? null,
            textContent: foundMessage.textContent,
            title: foundMessage.title ?? null,
            type: foundMessage.type ?? 'default',
        }
        isShowContextMenu.value = false;
        // Если нажали на обычное сообщение
        if(messageTypeForMenu.value === 'default') {
            chatMode.value = 'edit';
            message.value = foundMessage.textContent;
            messageCopy.value = {
                files: foundMessage?.files,
                tags: foundMessage?.tags,
                textContent: foundMessage.textContent,
                title: foundMessage?.title,
            };
        } 
        // Если нажали на сообщение с типом "post"
        else if(messageTypeForMenu.value === 'post') {
            messageCopy.value = {
                files: foundMessage?.files,
                tags: foundMessage?.tags,
                textContent: foundMessage.textContent,
                title: foundMessage?.title,
            };
            isShowEditorPost.value = true;
        }
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp.vue: handlerOpenEditMode => ${err}`);
    }
}

// Обработчик открытия контекстного меню для взаимодействия с сообщениями
function handlerMountedContextMenu({ x, y, messageId, messageType }) {
    try {
        positionMenuX.value = x;
        positionMenuY.value = y;
        messageIdForMenu.value = messageId;
        isShowContextMenu.value = true;
        messageTypeForMenu.value = messageType;
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp.vue: handlerMountedContextMenu => ${err}`);
    }
}

function autoExpand(event) {
    // Сбросить высоту перед получением новой
    if(event.target.value === '') {
        return event.target.style.height = maxHeightInput.value;
    }
    event.target.style.height = maxHeightInput.value;
    // Установить новую высоту
    event.target.style.height = (event.target.scrollHeight) + 'px';
}

// Обновляет состояние прокрутки окна сообщений
function updateScroll() {
    try {
        if(pinChatMainBody.value) {
            const beforeScroll = pinChatMainBody.value.scrollHeight;
            setTimeout(() => {
                pinChatMainBody.value.scroll({
                    top: beforeScroll,
                });
            }, 0);
        }
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp.vue: updateScroll => ${err}`);
    }
}

// Обработчик создания сообщения
async function handlerCreateMessage() {
    try {
        isLoadingCreationMessage.value = true
        if(chatMode.value === 'edit') {
            return await handlerEditMessage(messageIdForMenu.value);
        }
        // Иммитация отправки запроса
        if(message.value.trim().length) {
            const newMessage = await new Promise((resolve) => {
                setTimeout(() => {
                    // Создание обычного сообщения
                    const creationMessage = createNewMessageDB({ 
                        id: Date.now(), 
                        textContent: message.value.trim(), 
                        pinId: pinData.value.id,
                        files: null,
                        tags: null,
                        title: null,
                        type: 'default',
                    });
                    resolve(creationMessage);
                }, 800);
            });
            mainStore.messages.push(newMessage);
            message.value = '';
            updateScroll();
            messageInput.value.style.height = maxHeightInput.value;
        }
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp: handlerCreateMessage => ${err}`);
    } finally {
        isLoadingCreationMessage.value = false;
    }
}

// Обработчик Удаления сообщения
async function handlerDeleteMessage(messageId) {
    try {
        isLoadingDeletedMessage.value = true;
        await deleteMessageDB(messageId);
        mainStore.messages = mainStore.messages.filter((message) => message.id !== messageId);
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp.vue: handlerDeleteMessage => ${err}`);
    } finally {
        isLoadingDeletedMessage.value = false;
        isShowContextMenu.value = false;
    }
}

// Обработчик Редактирования сообщения
async function handlerEditMessage(messageId) {
    try {
        const isComapre = mainStore.compareObjects(messageCopy.value, {
            textContent: message.value
        });
        // Если изменения в сообщении были, то отправляем запрос
        if(isComapre === false) {
            if(currentMessage.value.type === "default") {
                currentMessage.value.textContent = message.value;
            }
            else if(currentMessage.value.type === "post") {
                // currentMessage.value = {
                //     id: 0,
                //     pinId: 0,
                //     files: [],
                //     tags: [],
                //     textContent: '',
                //     title: '',
                //     type: '',
                // }
            }
            const modifiedMessage = await editMessageDB(messageId, currentMessage.value);
            mainStore.messages.forEach((message, index) => {
                if(message.id === messageId) {
                    mainStore.messages[index] = modifiedMessage;
                }
            });
            clearGeneralData();
        }
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp.vue: handlerEditMessage => ${err}`);
    }
}

// Обработчик закрытия формы создания поста
function handlerCloseCreationFormPost() {
    try {
        isShowCreationPost.value = false;
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp: handlerCloseCreationFormPost => ${err}`);
    }
}

// Обработчик закрытия формы редактирования поста
function handlerCloseEditorFormPost() {
    try {
        isShowEditorPost.value = false;
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp: handlerCloseEditorFormPost => ${err}`);
    }
}

// Обработчик уведомления об успехе
function handlerSuccess() {
    try {
        mainStore.activateSuccessNote(1200);
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp.vue: handlerSuccess => ${err}`);
    }
}

// Выполняется когда завершается анимация уведомления успеха 
function handlerSuccessAnimation() {
    try {
        if(isShowCreationPost.value === true) {
            // isShowCreationForm.value = false;
        }
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp.vue: handlerSuccessAnimation => ${err}`);
    }
}

// Очистка второстепенных переменных
function clearGeneralData() {
    try {
        currentMessage.value = {
            id: 0,
            pinId: 0,
            files: [],
            tags: [],
            textContent: '',
            title: '',
            type: '',
        }
        messageCopy.value = {
            files: [],
            tags: [],
            textContent: '',
            title: '',
        }
        message.value = '';
        messageTypeForMenu.value = 'default';
        messageIdForMenu.value = null;
        positionMenuY.value = 0;
        positionMenuX.value = 0;
        chatMode.value = 'default';
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp.vue: clearGeneralData => ${err}`);
    }
}

// ====================================  LIFECYCLE HOOKS  ====================================
onBeforeMount(() => {
    // Получение данных текущего пина
    try {
        mainStore.pins.forEach((pin) => {
            if (+route.params.id === pin.id) {
                pinData.value = {
                    id: pin.id,
                    title: pin.title,
                    description: pin.description,
                }
            }
        });
        if(pinData.value.id === null) {
            router.push({name: 'pins'});
        }
    } catch (err) {
        console.error(err);
        throw new Error(`components/pinChat/pinChatMainComp: onBeforeMount[parsing pin data] => ${err}`);
    }
});

onMounted(async() => {
    // Обработчик нажатия Enter и Shift + Enter в поле ввода сообщений
    messageInput.value.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
        }
        if(event.key === 'Enter') {
            message.value;
        }
    });
    // Обновляем состояние прокрутки сообщений до самого последнего сообщения
    try {
        updateScroll();
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp: onMounted[updateScroll] => ${err}`);
    }
    // Получение сообщений текущего пина
    try {
        mainStore.messages = await getMessagesByPinIdDB(pinData.value.id);
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp: onMounted[fetch messages] => ${err}`);
    }
});

</script>

<style scoped>

.pin-chat-main {
    position: relative;
    border: 1px solid black;
    position: relative;
    height: 92vh;
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-family: var(--font);
    z-index: 10;
}

.pin-chat-main__header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 20px;
    background-color: var(--pin-chat-title-bg);
    color: var(--pin-chat-title-fg);
}

.pin-chat-main__body {
    position: relative;
    width: 95%;
    height: 100%;
    overflow: auto;
    padding: 1rem 0;
    border: 1px solid black;
}

.if-not-messages {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90%;
    z-index: 100;
}
.if-not-message__title {
    font-family: monospace;
    font-weight: 900;
}
.pin-chat-main__actions-container {
    position: relative;
    width: 95%;
    display: flex;
    flex-direction: column;
}
.pin-chat-main__actions {
    position: relative;
    display: flex;
    width: 100%;
    border: 1px solid black;
}
.edit-preview {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    background-color: var(--edition-block-bg);
    color: var(--edition-block-fg);
    bottom: 0;
    padding: 0.3rem 0;
}
.edit-preview__header {
    margin: 0 0.4rem;
}
.actions--options {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 5%;
    border: 1px solid black;
}

.actions--input {
    width: 90%;
    height: 100%;
    border: 1px solid black;
}
.actions-form__message-input {
    height: 30px;
    width: 100%;
    max-height: 170px;
    padding: 0.4rem;
    overflow-y: auto;
    resize: none;
    border: none;
    outline: none;
}

.actions--btns {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 5%;
    border: 1px solid black;
    padding: 0.1rem 0;
}
.btn-send {
    background-color: var(--chat-input-btn-bg);
    color: var(--chat-input-btn-fg);
}


</style>