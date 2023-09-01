<template>
    <v-img :src="img" :max-height="size" aspect-ratio="1/1" class="text-right">
        <v-tooltip v-if="text" activator="parent" location="end">
            <v-label v-if="title && title !== null">{{ title }}</v-label>
            <p v-if="text && text !== null " class="text-body-2">{{ text }}</p>
        </v-tooltip>
    </v-img>
</template>
  
<script>
export default {
    props: ['img', 'size', 'title', 'text'],
    data() {
        return {};
    }
};
</script>
