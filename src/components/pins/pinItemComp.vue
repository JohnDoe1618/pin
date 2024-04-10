<template>
    <div class="pin-item">
        <h2 class="pin-item__title">
            {{ props.itemData.title }}
        </h2>
        <p class="pin-item__description">
            {{ props.itemData.description }}
        </p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    itemData: {
        require: true,
    }
})

</script>

<style scoped>
.pin-item {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: .3rem 1.5rem;
    transition: all 0.6s ease;
    background-color: rgb(255, 255, 255);
    cursor: pointer;
    border: 1px dashed rgba(128, 128, 128, 0.724);
    margin: 0.3rem 0;
    font-family: monospace;
}
.pin-item:hover {
    transition: all 0.3s ease;
    background-color: rgba(126, 125, 125, 0.2);
}
.pin-item__title {
    color: rgb(105, 105, 105);
}
.pin-item__description {
    margin-left: 0.5rem;
}
</style>