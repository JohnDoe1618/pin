<template>
    <div class="pin-chat-main">
        <!-- Шапка -->
        <div class="pin-chat-main__header">
            <h4 class="header-title">{{ pinData.title }}</h4>
        </div>

        <!-- Блок отрисовки сообщений -->
        <div class="pin-chat-main__body">
            {{ pinData.description }}
        </div>

        <!-- Блок периферии -->
        <div class="pin-chat-main__actions">

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useMainStore from '@/store/mainStore';

const route = useRoute();

// ====================================  DATA  ====================================
const mainStore = useMainStore(); 
const pinData = ref({
    id: null,
    title: null,
    description: null,
});


onMounted(() => {
    try {
        mainStore.pins.forEach((pin) => {
            if(+route.params.id === pin.id) {
                pinData.value = {
                    id: pin.id,
                    title: pin.title,
                    description: pin.description,
                }
            }
        })

    } catch (err) {
        console.error(err);
        throw new Error(`components/pinChat/pinChatMainComp: onMounted => ${err}`);
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
    border: 1px solid black;
}
</style>