<template>
    <v-card 
    class="creation-form"
    >
        <!-- HEADER -->
        <div class="creation-form__header">
            <v-card-title>Create a new Pin</v-card-title>
            <v-btn 
            class="btn-close"
            icon="mdi-close" 
            variant="text"
            @click="emit('close')"
            ></v-btn>
        </div>

        <!-- BODY -->
        <div class="creation-form__body">
            <!-- Title -->
            <v-text-field
            variant="filled"
            :density="'comfortable'"
            placeholder="Title"
            v-model="title"
            >
            </v-text-field>

            <!-- Description -->
            <v-text-field
            variant="filled"
            :density="'comfortable'"
            placeholder="Description"
            v-model="description"
            >
            </v-text-field>
        </div>

        <!-- ACTIONS -->
        <div class="creation-form__actions">
            <v-btn 
            class="btn-confirm" 
            append-icon="mdi-check"
            variant="elevated"
            @click="confirmToCreationPin"
            :loading="isLoading"
            >
                Confirm
            </v-btn>
        </div>
    </v-card>
</template>

<script setup>
import useMainStore from '@/store/mainStore';
import { createNewPinDB } from '../../api/pinsApi';
import { ref, defineEmits, onMounted } from 'vue';

const mainStore = useMainStore();

// ================================  EMITS  ================================
const emit = defineEmits({
    error: null,
    success: null,
    close: null,
});


// ================================  DATA  ================================
const title = ref('');
const description = ref('');
const isLoading = ref(false);

// ================================  METHODS  ================================
// Подтверждение создания нового пина
async function confirmToCreationPin() {
    try {
        isLoading.value = true;
        if(title.value && description.value) {
            const newPin = await new Promise((resolve) => {
                setTimeout(() => {
                    const creationPin = createNewPinDB({ id: Date.now(), title: title.value, description: description.value });
                    resolve(creationPin);
                }, 500);
            });
            mainStore.pins.push(newPin);
            emit('success');
            handlerCloseForm();
        } else {
            emit('error', 'Fill in all the fields');
        }
    } catch (err) {
        throw new Error(`component/pins/creationPinFormComp.vue: confirmToCreationPin => ${err}`);
    } finally {
        isLoading.value = false;
    }
}

// Обравботчик закрытия формы
function handlerCloseForm() {
    try {
        title.value = '';
        description.value = '';
        emit('close');
    } catch (err) {
        throw new Error(`component/pins/creationPinFormComp.vue: handlerCloseForm => ${err}`);
    }
}

onMounted(() => {
    try {
        // Обработчик нажатия Enter и Shift + Enter в поле ввода сообщений
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                confirmToCreationPin();
            }
        });
    } catch (err) {
        throw new Error(`component/pins/creationPinFormComp.vue: onMounted => ${err}`);
    }
});

</script>

<style scoped>
.creation-form {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
}
.creation-form__header {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem 2rem;
}
.btn-close {
    position: absolute;
    right: 1rem;
    top: 0.4rem;
}

.creation-form__body {
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    width: 100%;
}

.creation-form__actions {
    width: 100%;
    display: flex;
    padding: 1.5rem 2rem;
}
.btn-confirm {
    margin: 0 1rem 0 auto;
}
</style>