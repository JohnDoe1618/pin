<template>
    <div 
    :id="`message-` + props.messageData.id"
    class="pin-chat-item__container"
    >

        <div class="pin-chat-item">
            <!-- Если тип сообщения post то появляются все необходимые для поста UI элементы -->
            <div 
            class="pin-chat-item__header" 
            v-if="props.messageData?.type === 'post'" >
                <h2>{{ props.messageData?.title }}</h2>
            </div>
            <p class="pin-chat-item__text">
                {{ props.messageData?.textContent }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps({
    messageData: {
        type: Object,
        required: true,
    }
});
const emit = defineEmits({
    position: { x: 0, y: 0 },
});

// 
onMounted(() => {
    const chatItem = document.getElementById(`message-${props.messageData.id}`);
    chatItem.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        emit('position', { x: event.pageX, y: event.pageY, messageId: props.messageData.id, messageType: props.messageData?.type });
    });
});

</script>

<style scoped>
.pin-chat-item__container {
    width: 100%;
    padding: 0.2rem 1rem;
}

.pin-chat-item__container:hover {
    background-color: var(--message-hover);
    cursor: pointer;
}

.pin-chat-item {
    color: var(--message-fg);
    background-color: var(--message-bg);
    width: max-content;
    height: max-content;
    padding: 0.6rem 1rem;
    max-width: 60%;
    min-width: 20px;
}
.pin-chat-item__header {
    border-bottom: var(--post-border);
    margin-bottom: 1.4rem;
}

.pin-chat-item__text {
    width: 100%;
    word-wrap: break-word;
    white-space: pre-wrap;
    margin: auto;
    font-size: var(--font-size);
}
</style>