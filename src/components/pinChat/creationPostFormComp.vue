<template>
    <v-dialog 
    class="dialog-comp"
    :model-value="props.isShow"
    @update:model-value="emit('close')"
    >
        <!-- ФОРМА СОЗДАНИЯ ПОСТА -->
        <v-card class="creation-from-post">
            <!-- Секция заголовка -->
            <section class="creation-form-post__section title">
                <v-btn 
                class="btn-close" 
                icon="mdi-close"
                @click="emit('close')"
                ></v-btn>
                <v-card-title class="creation-form-post__title">Creating a post</v-card-title>
                <!-- Заголовок статьи -->
                <v-text-field
                variant="filled"
                density="comfortable"
                v-model="title"
                label="Title"
                hide-details
                ></v-text-field>
            </section>

            <!-- Секция контента -->
            <section 
            class="creation-form-post__section content"
            >
                <v-card-title class="content__title">Text Content</v-card-title>
                <!-- Контент -->
                <v-textarea
                class="content-input"
                variant="filled"
                density="comfortable"
                label="Text content"
                v-model="content"
                hide-details
                auto-grow
                ></v-textarea>
            </section>


            <!-- Секция для добавления тегов поиска -->
            <section class="creation-form-post__section tags">
                <v-card-title class="content__title">Tags to search</v-card-title>

                <!-- Контейнер отрисовки тегов поиска -->
                <div 
                class="tag-list-wrapper"
                ref="tagListWrapper"
                >
                    <v-card-subtitle v-show="!tags.length">
                        Tags will appear here
                    </v-card-subtitle>
                    <v-chip
                    class="tag"
                    v-for="tag in tags" 
                    closable
                    @click:close="handlerCloseTag(tag)"
                    :key="tag">
                        {{ tag }}
                    </v-chip>
                </div>

                <!-- Добавить слово -->
                <v-text-field
                ref="inputTag"
                variant="filled"
                density="compact"
                placeholder="Tags"
                v-model="tagValue"
                :error="isErrorTag"
                :error-messages="errorTagName"
                >
                    <template v-slot:append-inner>
                        <v-btn 
                        icon="mdi-send"
                        variant="flat"
                        style="background: rgba(0,0,0,0);"
                        @click="handlerAppendTag"
                        ></v-btn>
                    </template>
                </v-text-field>
            </section>

           <!-- Секция Для добавления файлов -->
           <section class="creation-form-post__section file">
                <v-card-title class="content__title">Files</v-card-title>
                <v-file-input 
                label="Files"
                variant="filled"
                density="comfortable"
                clearable 
                chips
                multiple
                @update:model-value="(e) => handlerFilesBunlde(e)"
                hide-details
                :prepend-icon="null"
                >
                    <template
                    v-slot:prepend-inner
                    >
                        <v-icon 
                        class="mr-2"
                        icon="mdi-file-multiple-outline"
                        ></v-icon>
                    </template>

                </v-file-input>
            </section>


            <!-- Секция кнопок взаимодействия -->
            <section class="creation-form-post__section actions">
                <v-btn
                class="btn-confirm"
                block
                variant="flat"
                @click="confirmToCreatePost"
                :loading="isLoadingCreation"
                >Confirm</v-btn>
            </section>

        </v-card>
    </v-dialog>
</template>

<script setup>
import useMainStore from '@/store/mainStore';
import { createNewPostDB } from '../../api/messagesApi';
import { ref, defineProps, defineEmits, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const mainStore = useMainStore();

const emit = defineEmits({
    close: null,
    error: null,
    success: null,
});

const props = defineProps({
    isShow: {
        type: Boolean,
        required: true,
    }
});

const tagValue = ref('');
const tags = ref([]);
const files = ref([]);
const title = ref('');
const content = ref('');
const isErrorTag = ref(false);
const errorTagName = ref('');
const inputTag = ref(null);
const tagListWrapper = ref(null);
const isLoadingCreation = ref(false);


// =====================================  METHODS  ==================================

function declareErrorTag(msg, duration) {
    try {
        isErrorTag.value = true;
        errorTagName.value = msg;
        setTimeout(() => {
            isErrorTag.value = false;
            errorTagName.value = '';
        }, duration);
    } catch (err) {
        throw new Error(`components/pinChat/creationPostFormComp: declareErrorTag  => ${err}`);
    }
}

// Функция обработчик удаления тега из списка
function handlerCloseTag(tag) {
    try {
        tags.value = tags.value.filter((element) => element !== tag);
    } catch (err) {
        throw new Error(`components/pinChat/creationPostFormComp: handlerCloseTag  => ${err}`);
    }
}

// Обработчик добавления нового тега в массив
function handlerAppendTag() {
    try {
        if(tagValue.value.length > 0) {
            tags.value.push(tagValue.value);
            if(tagListWrapper.value) {
            const beforeScroll = tagListWrapper.value.scrollHeight;
            setTimeout(() => {
                tagListWrapper.value.scroll({
                    top: beforeScroll,
                });
            }, 0);
        }
            tagValue.value = '';
        } else {
            declareErrorTag('Specify the tag name', 3000);
        }
    } catch (err) {
        throw new Error(`components/pinChat/creationPostFormComp: handlerAppendTag  => ${err}`);
    }
}

// Собирает массив выбранных файлов
function handlerFilesBunlde(filesValue) {
    try {
        files.value = filesValue;
        console.log(files.value);
    } catch (err) {
        throw new Error(`components/pinChat/creationPostFormComp: handlerFiles  => ${err}`);
    }
}

// Подтверждение формы для создания нового поста в качестве сообщения
async function confirmToCreatePost() {
    try {
        isLoadingCreation.value = true;
        const pinIdParam = +route.params.id;
        if(title.value && content.value && pinIdParam) {
            console.log('hell');
            const newPost = { 
                id: Date.now(), 
                type: 'post', 
                pinId: pinIdParam, 
                title: title.value,
                textContent: content.value,
                tags: tags.value,
                files: [],
            }
            const creationPost = await createNewPostDB(newPost);
            mainStore.messages.push(creationPost);
            emit('close');
            emit('success');
        }
    } catch (err) {
        throw new Error(`components/pinChat/creationPostFormComp: confirmToCreatePost  => ${err}`);
    } finally {
        isLoadingCreation.value = false;
    }
}

// =====================================  WATCH  ==================================
watch(() => props.isShow, async (newValue) => {
    if(newValue === true) {
        try {
            await nextTick();
            if(inputTag.value) {
                inputTag.value.addEventListener('keydown', (event) => {
                    if(event.key === 'Enter') {
                        handlerAppendTag();
                    }
                });
            }
        } catch (err) {
            throw new Error(`components/pinChat/creationPostFormComp: watch  => ${err}`);
        }
    }
});

</script>

<style scoped>
.dialog-comp {
    z-index: 99999999 !important;
}

.creation-from-post {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-around;
    width: 50%;
    height: 80vh;
    margin: auto;
}
.btn-close {
    position: absolute;
    right: 1rem;
    top: 0.5rem;
    width: 40px !important;
    height: 40px !important;
    font-size: .9rem;
}
.creation-form-post__section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    padding: 1rem 2rem;
    /* border-top: var(--section-border); */
    /* border-bottom: var(--section-border); */
}
.content {
    max-height: 45%;
    overflow: auto;

}
.content__title {
    font-size: 1.1rem;
    align-self: center;
}
.creation-form-post__title {
    align-self: center;
    font-size: 1.5rem;
    font-weight: bolder;
}
.tag-list-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-top: var(--section-border);
    border-bottom: var(--section-border);
    padding: 0.3rem;
    min-height: 50px;
    max-height: 150px;
    overflow: auto;
    margin-bottom: 0.4rem;

}
.tag {
    margin-left: 0.3rem;
    margin-top: 0.2rem;
}

.btn-confirm {
    background-color: var(--btn-bg);
    color: var(--btn-fg);
}
</style>