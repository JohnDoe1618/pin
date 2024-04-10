import { defineStore } from "pinia";
import { ref } from 'vue';

const useMainStore = defineStore('mainStore', () => {
    // =============================  STATE  =============================
    const pins = ref([
        {id: 1, title: 'Учетные Данные', description: "Тут хранятся все учетные данные"},
        {id: 2, title: 'О Электросхемах', description: "Обучение по Электросхемам"},
        {id: 3, title: 'Сети', description: "Общая инфа о сетях"},
    ]);
    
    // =============================  GETTERS  =============================


    // =============================  ACTIONS  =============================

    return {
        // STATE
        pins

        // GETTERS
        // ACTIONS
    }
});

export default useMainStore;