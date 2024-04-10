<template>
    <div class="pins-main">
        <!-- Если нет пинов -->
        <div v-show="!pins.length" class="pins-main__header">
            <h1 class="header-title">No Pins</h1>
        </div>

        <!-- Отрисовка пинов -->
        <pinItemComp 
        v-for="item in pins" 
        :item-data="item"
        :key="item" 
        />

        <!-- + -->
        <v-btn class="btn-create" color="var(--primary-bg)" icon="mdi-plus"></v-btn>
    </div>
</template>

<script setup>
import pinItemComp from './pinItemComp.vue';
import { ref } from 'vue';

// =======================================  DATA  =================================
const pins = ref([
    {id: 1, title: 'Учетные Данные', description: "Тут хранятся все учетные данные"},
    {id: 2, title: 'О Электросхемах', description: "Обучение по Электросхемам"},
    {id: 3, title: 'Сети', description: "Общая инфа о сетях"},
]);


// =======================================  METHODS  =================================

</script>

<style scoped>
.pins-main {
    position: relative;
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-family: var(--font);
    padding: 2rem;
}

.pins-main__header {
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    height: 100%;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;

}
.header-title {
    font-family: var(--font);
    font-weight: 400;
}

.btn-create {
    color: rgb(69, 172, 69);
    position: absolute;
    left: 3%;
    bottom: 0%;
}
</style>