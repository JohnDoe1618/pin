<template>
    <v-dialog 
    class="dialog-comp"
    :model-value="props.isShow"
    @update:model-value="emit('close')"
    >
        <!-- ФОРМА РЕДАКТИРОВАНИЯ ПОСТА -->
        <v-card class="edit-from-post">
            <!-- Секция заголовка -->
            <section class="edit-form-post__section title">
                <v-btn 
                class="btn-close" 
                icon="mdi-close"
                @click="emit('close')"
                ></v-btn>
                <v-card-title class="edit-form-post__title">Edit a post</v-card-title>
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
            class="edit-form-post__section content"
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
            <section class="edit-form-post__section tags">
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
           <section class="edit-form-post__section file">
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
            <section class="edit-form-post__section actions">
                <v-btn
                class="btn-confirm"
                block
                variant="flat"
                @click="confirmToEditPost"
                :loading="isLoadingEdition"
                >Confirm</v-btn>
            </section>

        </v-card>
    </v-dialog>
</template>

<script setup>
import useMainStore from '@/store/mainStore';
import { editPostDB } from '../../api/messagesApi';
import { ref, defineProps, defineEmits, watch, nextTick } from 'vue';

const mainStore = useMainStore();

// =====================================  EMITS  ==================================
const emit = defineEmits({
    close: null,
    error: null,
    success: null,
});

// =====================================  PROPS  ==================================
const props = defineProps({
    isShow: {
        type: Boolean,
        required: true,
    },
    postData: {
        type: Object,
        required: true,
    },
});

// =====================================  DATA  ==================================
const tagValue = ref('');
const tags = ref([]);
const files = ref([]);
const title = ref('');
const content = ref('');
const isErrorTag = ref(false);
const errorTagName = ref('');
const isLoadingEdition = ref(false);
const postDataCopy = ref({
    files: [],
    tags: [],
    textContent: null,
    title: null,
});
// DOM Elements
const inputTag = ref(null);
const tagListWrapper = ref(null);

// =====================================  METHODS  ==================================
// Функция для создания копии объекта поста
function createCopyForm(post) {
    try {
        postDataCopy.value.files = post.files ?? [];
        postDataCopy.value.tags = post.tags ?? [];
        postDataCopy.value.textContent = post.textContent;
        postDataCopy.value.title = post.title;
    } catch (err) {
        throw new Error(`components/pinChat/editPostFormComp: createCopyForm  => ${err}`);
    }
}

function declareErrorTag(msg, duration) {
    try {
        isErrorTag.value = true;
        errorTagName.value = msg;
        setTimeout(() => {
            isErrorTag.value = false;
            errorTagName.value = '';
        }, duration);
    } catch (err) {
        throw new Error(`components/pinChat/editPostFormComp: declareErrorTag  => ${err}`);
    }
}

// Функция обработчик удаления тега из списка
function handlerCloseTag(tag) {
    try {
        tags.value = tags.value.filter((element) => element !== tag);
    } catch (err) {
        throw new Error(`components/pinChat/editPostFormComp: handlerCloseTag  => ${err}`);
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
        throw new Error(`components/pinChat/editPostFormComp: handlerAppendTag  => ${err}`);
    }
}

// Собирает массив выбранных файлов
function handlerFilesBunlde(filesValue) {
    try {
        files.value = filesValue;
        console.log(files.value);
    } catch (err) {
        throw new Error(`components/pinChat/editPostFormComp: handlerFiles  => ${err}`);
    }
}

// Функция собирает объект тех полей поста которые были изменены
function bundleFormData(isCompareFiles, isCompareTags) {
    try {
        const readyForm = {};
        if(isCompareFiles === false) {
            readyForm.files = [...files.value];
        }
        if(isCompareTags === false) {
            readyForm.tags = [...tags.value];
        }
        if(content.value !== postDataCopy.value.textContent) {
            readyForm.textContent = content.value;
        }
        if(title.value !== postDataCopy.value.title) {
            readyForm.title = title.value;
        }
        return readyForm;
    } catch (err) {
        throw new Error(`components/pinChat/editPostFormComp: bundleFormData  => ${err}`);
    }
}

// Подтверждение формы для редактирования поста
async function confirmToEditPost() {
    try {
        isLoadingEdition.value = true;
        // Проверка на наличие изменений в форме
        const isCompare = mainStore.compareObjects(postDataCopy.value, {
            textContent: content.value,
            title: title.value,
        });
        const isCompareTags = JSON.stringify(tags.value) === JSON.stringify(postDataCopy.value.tags);
        const isCompareFiles = JSON.stringify(files.value) === JSON.stringify(postDataCopy.value.files);
        // Если что либо изменилось относительно исходых данных поста, то выполняется редактирование
        if(isCompare === false || isCompareTags === false || isCompareFiles === false) {
            const changedFields =  bundleFormData(isCompareFiles, isCompareTags);
            const editionPost = await editPostDB(props.postData.id, changedFields);
            editionPost
            mainStore.messages.forEach((element, index) => {
                if(element.id === editionPost.id) {
                    mainStore.messages[index] = editionPost;
                }
            });
            emit('close');
            emit('success');
        }
    } catch (err) {
        throw new Error(`components/pinChat/editPostFormComp: confirmToCreatePost  => ${err}`);
    } finally {
        isLoadingEdition.value = false;
    }
}

// =====================================  WATCH  ==================================
watch(() => [props.isShow, props.postData], async ([isShow, postData]) => {
    if(isShow === true) {
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
            throw new Error(`components/pinChat/editPostFormComp: watch[isShow]  => ${err}`);
        }
    }
    // Ловим изменения в данных поста
    try {
        if(postData) {
            tags.value = [...postData.tags];
            files.value = [...postData.files];
            title.value = postData.title;
            content.value = postData.textContent;
            createCopyForm(postData);
        }
    } catch (err) {
        throw new Error(`components/pinChat/editPostFormComp: watch[postData]  => ${err}`);
    }

});

</script>

<style scoped>
.dialog-comp {
    z-index: 99999999 !important;
}

.edit-from-post {
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
.edit-form-post__section {
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
.edit-form-post__title {
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