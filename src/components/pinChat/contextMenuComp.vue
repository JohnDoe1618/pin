<template>
    <div 
    class="context-menu__dialog" 
    v-show="props.isShow"
    @click="emit('close')"
    >
        <div class="context-menu__container" ref="contextMenuContainer">
            <v-list class="context-menu">
    
                <!-- <v-list-item 
                prepend-icon="mdi-delete-outline" 
                title="Delete message" 
                value="delete"
                @click="emit('delete', props.messageId)"
                ></v-list-item> -->
                <v-btn
                prepend-icon="mdi-delete-outline" 
                title="Delete message" 
                variant="flat"
                @click.stop="emit('delete', props.messageId)"
                :loading="props.isLoadingDelete"
                >
                    Delete message
                </v-btn>
            </v-list>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    isShow: {
        type: Boolean,
        required: true,
    },
    position: {
        type: Object,
        required: false,
    },
    messageId: {
        type: [Number, String],
        required: false,
    },
    isLoadingDelete: {
        type: Boolean,
        required: false,
    }
});
const emit = defineEmits({
    delete: null,
    close: null,
});

const contextMenuContainer = ref(null);

watch(() => [props.position.x, props.position.y], ([newX, newY]) => {
    if (newX && newY) {
        console.log(newX, newY);
        contextMenuContainer.value.style.left = `${newX}px`;
        contextMenuContainer.value.style.top = `${newY}px`;
    }
})

</script>

<style scoped>
.context-menu__dialog {
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    z-index: 99999;
    background-color: #00000000;
}
.context-menu__container {
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.307);
}
</style>