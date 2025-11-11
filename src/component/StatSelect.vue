<template>
    <div class="select">
        <div class="text" @click.stop="visible=!visible; renderOptions()" style="cursor:pointer">
            <!-- <template v-if="modelValue">{{ modelValue }}</template> -->
            <component v-if="modelValue" :is="options[modelValue]"/>
            <template v-else>{{ text }}</template>
        </div>
        <div class="options" style="position: absolute;" v-if="visible" @click.stop>
            <render-options></render-options>
        </div>
    </div>
</template>

<script setup>
import {ref, useSlots, onMounted, onBeforeUnmount, onBeforeUpdate} from 'vue';

const visible = ref(false)
const props = defineProps({
    text: {type: String, default: 'Toggle dropdown'},
    options: Array,
    modelValue: String
})
const options = ref({});
const emit = defineEmits(["update:modelValue"])

const $slots = useSlots();
const renderOptions = () => {
    return $slots.default()
    .map(vnode => {
        // if a v-for is used to generate the options it's necessary to open the children instead for some reason
        if(vnode.props === null){
            for (let i = 0; i < vnode.children.length; i++) {
                options.value[vnode.children[i].props.value] = vnode.children[i].children.default;
                Object.assign(vnode.children[i].props ??= {}, {onClick: () => select(vnode.children[i].props.value)}, vnode.children[i].props ?? {})
            }
        }
        else {
            options.value[vnode.props.value] = vnode.children.default;
            Object.assign(vnode.props ??= {}, {onClick: () => select(vnode.props.value)}, vnode.props ?? {});
        }
        return vnode;
    });
}

renderOptions()

function select(option){
    visible.value = false;
    emit("update:modelValue", option)
}

// hide the menu if the user clicks outside
onMounted(() => {
    document.addEventListener('click', () => { visible.value = false })
})

onBeforeUnmount(() => {
    document.removeEventListener('click', () => { visible.value = false })
})

onBeforeUpdate(() => {
    // additionally update the values whenever gear is changed
    renderOptions()
})
</script>

<style scoped>
.select{
    position: relative;
    padding: 5px 10px;
    border: 1px solid gray;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fefeff;
}

.select:hover {
    background-color: #f1f1f3;
}

.select::after {
    content: "";
    position: absolute;
    top: 18px;
    right: 10px;

    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-color: gray transparent transparent transparent;
}
</style>