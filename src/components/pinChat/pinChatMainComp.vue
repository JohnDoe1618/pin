<template>
    <div class="pin-chat-main">

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
            :is-show="true"
            />

            <div class="message-wrapper"></div>
            <pinChatItemComp 
            v-for="message in mainStore.messages" 
            :key="message.id" 
            :message-data="message"
            />
        </div>

        <!-- Блок периферии -->
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
</template>

<script setup>
import optionsMenuComp from './optionsMenuComp.vue';
import creationPostFormComp from './creationPostFormComp.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { createNewMessageDB, getMessagesByPinIdDB } from '../../api/messagesApi';
import useMainStore from '@/store/mainStore';
import pinChatItemComp from './pinChatItemComp.vue';

const route = useRoute();

// ====================================  DATA  ====================================
const message = ref('');
const mainStore = useMainStore();
const pinData = ref({
    id: null,
    title: null,
    description: null,
});
const isLoadingCreationMessage = ref(false);
const maxHeightInput = ref('30px');
const isShowCreationPost = ref(false);
// DOM ELEMENTS
const pinChatMainBody = ref(null);
const messageInput = ref(null);


// ====================================  METHODS  ====================================
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
        throw new Error(`components/pinChat/pinChatMainComp: updateScroll => ${err}`);
    }
}

// Обработчик создания сообщения
async function handlerCreateMessage() {
    try {
        isLoadingCreationMessage.value = true
        // Иммитация отправки запроса
        if(message.value.trim().length) {
            const newMessage = await new Promise((resolve) => {
                setTimeout(() => {
                    const creationMessage = createNewMessageDB({ 
                        id: Date.now(), 
                        textContent: message.value.trim(), 
                        pinId: pinData.value.id,
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

// ====================================  LIFECYCLE HOOKS  ====================================
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
    try {
        updateScroll()
    } catch (err) {
        throw new Error(`components/pinChat/pinChatMainComp: onMounted[updateScroll] => ${err}`);
    }
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
    } catch (err) {
        console.error(err);
        throw new Error(`components/pinChat/pinChatMainComp: onMounted[parsing pin data] => ${err}`);
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
.message-wrapper {
    width: 100%;
    height: max-content;
}

.pin-chat-main__actions {
    position: relative;
    display: flex;
    width: 95%;
    border: 1px solid black;
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
}
.btn-send {
    background-color: var(--chat-input-btn-bg);
    color: var(--chat-input-btn-fg);
}


</style>