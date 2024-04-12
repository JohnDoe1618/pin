import { defineStore } from "pinia";
import { ref } from 'vue';

const useMainStore = defineStore('mainStore', () => {
    // =============================  STATE  =============================
    const pins = ref([]);
    const messages = ref([]);
    const isShowSuccessNote = ref(false);
    const isShowErrorNote = ref(false);

    // =============================  MUTATIONS  =============================
    function activateSuccessNote(duration) {
        try {
            isShowSuccessNote.value = true;
            setTimeout(() => {
                isShowSuccessNote.value = false;
            }, duration);
        } catch (err) {
            throw new Error(`store/mainStore: activateSuccessNote  => ${err}`);
        }
    }
    function activateErrorNote(duration) {
        try {
            isShowErrorNote.value = true;
            setTimeout(() => {
                isShowErrorNote.value = false;
            }, duration);
        } catch (err) {
            throw new Error(`store/mainStore: activateErrorNote  => ${err}`);
        }
    }


    // =============================  GETTERS  =============================


    // =============================  ACTIONS  =============================
    // Функция для сравнения двух объектов на разность значений их ключей
    function compareObjects(obj1, obj2) {
        try {
            let flag = true;
            for (const key in obj1) {
                if (typeof obj1[key] === 'object' && obj1[key] !== null) {
                    continue;
                }
                if (obj1[key] !== obj2[key]) {
                    flag = false;
                    break;
                }
            }
            return flag;
        } catch (err) {
            throw new Error(`store/mainStore.js:compareObjects =>  ${err}`);
        }
    }


    return {
        // STATE
        pins,
        messages,
        isShowSuccessNote,
        isShowErrorNote,

        // MUTATIONS
        activateSuccessNote,
        activateErrorNote,

        // GETTERS
        // ACTIONS
        compareObjects,
    }
});

export default useMainStore;