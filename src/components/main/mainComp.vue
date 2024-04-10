<template>
    <v-main class="main d-flex align-center justify-center">
        <router-view />
    </v-main>
</template>

<script setup>
import { getAllPinsDB } from '../../api/pinsApi';
import { getAllMessagesDB } from '../../api/messagesApi';
import useMainStore from '@/store/mainStore';
import { onMounted } from 'vue';

const mainStore = useMainStore();

onMounted(async() => {
    try {
        // Получение Пинов
        const fetchedPins = await getAllPinsDB();
        mainStore.pins = fetchedPins;
        // Поулчение Сообщений
        const fetchedMessages = await getAllMessagesDB();
        mainStore.messages = fetchedMessages;
    } catch (err) {
        throw new Error(`components/main/mainComp.vue: onMounted[fetch pins] => ${err}`);
    }
})

</script>

<style scoped></style>