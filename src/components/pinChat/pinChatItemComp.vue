<template>
    <div class="pin-chat-item__container">
        <div class="pin-chat-item">
            <p class="pin-chat-item__text">
                g
            </p>
        </div>

    </div>
</template>

<script setup>

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
    padding: 0.4rem 1rem;
    max-width: 60%;
}
.pin-chat-item__text {
    width: 100%;
    word-wrap: break-word;
}
</style>