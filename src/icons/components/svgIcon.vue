   <template>
    <svg :class="svgClass" v-bind="$attrs" :style="{ color: color }">
        <use :xlink:href="iconName" rel="external nofollow" />
    </svg>
</template>

<script setup>


import { computed } from "vue";

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: '1rem'
    }
})

const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
    if (props.name) {
        return `svg-icon icon-${props.name}`
    }
    return 'svg-icon'
});
</script>

<style lang='less'>
.svg-icon {
    width: v-bind(size);
    height: v-bind(size);
    fill: currentColor;
    vertical-align: middle;
    margin-bottom: .4rem;

}
</style>
