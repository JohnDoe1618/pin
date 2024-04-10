<template>
    <div class="error-note">
        <p class="note-message">
            {{ props.errorMsg ?? 'Error' }}
        </p>
    </div>
</template>

<script setup>
import useMainStore from '@/store/mainStore';
import gsap from 'gsap';
import { watch, defineProps, defineEmits } from 'vue';

const mainStore = useMainStore();

// ============================  EMITS  ==============================
const emit = defineEmits(['complete']);

// ============================  PROPS  ==============================
const props = defineProps({
    errorMsg: {
        type: String,
        required: true,
    }
});

// ============================  WATCH  ==============================
watch(() => mainStore.isShowErrorNote, (newValue) => {
    try {
        if (newValue === true) {
            gsap.to('.error-note', { duration: 0.5, right: '20px', visibility: 'visible' });
        }
        else if (newValue === false) {
            gsap.to('.error-note', { duration: 0.5, right: '-40rem', visibility: 'visible' })
            .then(() => {
                // Объявляем, что анимация уведомления завершена
                emit('complete');
            })
        }
    } catch (err) {
        throw new Error(`components/notifications/successNoteComp: watch => ${err}`);
    }
})

</script>

<style scoped>
.error-note {
    position: fixed;
    right: -40rem;
    top: 10px;
    background-color: var(--err-bg);
    color: white;
    z-index: 9999999;
    min-width: 50px;
    width: max-content;
    max-width: 400px;
    padding: 0.5rem 1rem;
    border-left: 5px solid var(--err-fg);
    visibility: hidden;
}

.note-message {
    display: flex;
    align-items: center;
    justify-content: start;
    color: var(--err-fg);
    font-size: 1.2rem;
}
</style>
