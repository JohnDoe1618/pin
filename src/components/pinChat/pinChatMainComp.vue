<template>
    <div class="pin-chat-main">
        <!-- Шапка -->
        <div class="pin-chat-main__header">
            <h4 class="header-title">{{ pinData.title }}</h4>
        </div>

        <!-- Блок отрисовки сообщений -->
        <div class="pin-chat-main__body" ref="pinChatMainBody">
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
                <v-btn class="btn-options" icon="mdi-menu"></v-btn>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
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
                    resolve({ 
                        id: Date.now(), 
                        textContent: message.value.trim(),
                    })
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

onMounted(() => {
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
    try {
        mainStore.pins.forEach((pin) => {
            if (+route.params.id === pin.id) {
                pinData.value = {
                    id: pin.id,
                    title: pin.title,
                    description: pin.description,
                }
            }
        })
    } catch (err) {
        console.error(err);
        throw new Error(`components/pinChat/pinChatMainComp: onMounted[parsing pin data] => ${err}`);
    }
})

</script>

<style scoped>
.pin-chat-main {
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
    width: 95%;
    height: 100%;
    overflow: auto;
    padding: 1rem 0;
    border: 1px solid black;
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
.btn-options {
    background-color: var(--chat-input-btn-bg);
    color: var(--chat-input-btn-fg);
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