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


    return {
        // STATE
        pins,
        messages,
        isShowSuccessNote,
        isShowErrorNote,

        // MUTATIONS
        activateSuccessNote,
        activateErrorNote

        // GETTERS
        // ACTIONS
    }
});

export default useMainStore;