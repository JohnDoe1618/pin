<template>
    <div
    class="context-menu__dialog" 
    v-show="props.isShow"
    @click="emit('close')"
    >
        <div class="context-menu__container" ref="contextMenuContainer">
            <v-list class="context-menu">
    
                <v-btn
                prepend-icon="mdi-pencil-outline" 
                title="Delete message" 
                variant="flat"
                @click.stop="emit('delete', props.messageId)"
                :loading="props.isLoadingDelete"
                >
                    Edit message
                </v-btn>
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
import { ref, defineProps, defineEmits, watch, onMounted, nextTick } from 'vue';

// =========================================  PROPS  =========================================  
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

// =========================================  EMITS  =========================================  
const emit = defineEmits({
    delete: null,
    close: null,
});

// =========================================  DATA  =========================================  
const contextMenuContainer = ref(null);

// =========================================  WATCH  =========================================
// Записываем позицию появления контекстного меню относительно позиции курсора
watch(() => [props.position.x, props.position.y], async([newX, newY]) => {
    try {
        if (newX && newY) {
            // Запись позиции контекстного меню по умолчанию
            contextMenuContainer.value.style.left = `${newX}px`;
            contextMenuContainer.value.style.top = `${newY}px`;
            await nextTick();
            // Вычисление позиции курсора относительно ширины и высоты контейнера который содержит контекстное меню
            // Для избежания монтирования этого меню за границей области просмотра
            const overflowRight = (contextMenuContainer.value.parentElement.offsetWidth - newX) - contextMenuContainer.value.offsetWidth;
            const overflowBottom = (contextMenuContainer.value.parentElement.offsetHeight - newY) - contextMenuContainer.value.offsetHeight;
            if(overflowRight < 0) {
                contextMenuContainer.value.style.left = `${newX - Math.abs(overflowRight)}px`;
            }
            if(overflowBottom < 0) {
                contextMenuContainer.value.style.top = `${newY - Math.abs(overflowBottom)}px`;
            }
        }
    } catch (err) {
        throw new Error(`components/pinChat/contextMenuComp.vue: watch  => ${err}`);
    }
});

// =========================================  LIFECYCLE HOOKS  =========================================
onMounted(() => {
    try {
        document.addEventListener('keydown', (event) => {
            if(props.isShow) {
                if(event.key === 'Escape') {
                    emit('close');
                }
            }
        });
    } catch (err) {
        throw new Error(`components/pinChat/contextMenuComp.vue: onMounted  => ${err}`);
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
.context-menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>