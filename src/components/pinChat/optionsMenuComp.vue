<template>
    <v-menu transition="slide-x-transition">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="btn-options" icon="mdi-menu"></v-btn>
        </template>

        <v-list>
            <v-list-item 
            class="menu-option-item"
            title="Post" 
            value="post"
            @click="emit('openCreationPost')"
            >
                <template v-slot:prepend>
                    <v-icon icon="mdi-post-outline"></v-icon>
                </template>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['openCreationPost']);

</script>

<style scoped>
.btn-options {
    background-color: var(--chat-input-btn-bg);
    color: var(--chat-input-btn-fg);
}
.menu-option-item {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
</style>