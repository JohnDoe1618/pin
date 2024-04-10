<template>
    <div class="success-note">
        <p class="note-message">
            Success!
        </p>
    </div>
</template>

<script setup>
import useMainStore from '@/store/mainStore';
import gsap from 'gsap';
import { watch, defineEmits } from 'vue';

const mainStore = useMainStore();

// ============================  EMITS  ==============================
const emit = defineEmits(['complete']);


// ============================  WATCH  ==============================
watch(() => mainStore.isShowSuccessNote, (newValue) => {
    try {
        if (newValue === true) {
            gsap.to('.success-note', { duration: 0.5, right: '20px', visibility: 'visible' });
        }
        else if (newValue === false) {
            gsap.to('.success-note', { duration: 0.5, right: '-40rem', visibility: 'visible' })
            .then(() => {
                // Объявляем, что анимация уведомления завершена
                emit('complete');
            })
        }
    } catch (err) {
        throw new Error(`components/notifications/successNoteComp: watch => ${err}`);
    }
});

</script>

<style scoped>
.success-note {
    position: fixed;
    right: -40rem;
    top: 10px;
    background-color: var(--succ-bg);
    color: white;
    z-index: 9999999;
    min-width: 50px;
    width: max-content;
    max-width: 400px;
    padding: 0.5rem 1rem;
    border-left: 5px solid var(--succ-fg);
    visibility: hidden;
}

.note-message {
    display: flex;
    align-items: center;
    justify-content: start;
    color: var(--succ-fg);
    font-size: 1.2rem;
}
</style>
