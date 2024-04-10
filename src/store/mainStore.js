import { defineStore } from "pinia";
import { ref } from 'vue';

const useMainStore = defineStore('mainStore', () => {
    // =============================  STATE  =============================
    const pins = ref([]);
    const messages = ref([]);
    
    // =============================  GETTERS  =============================


    // =============================  ACTIONS  =============================

    return {
        // STATE
        pins,
        messages,

        // GETTERS
        // ACTIONS
    }
});

export default useMainStore;