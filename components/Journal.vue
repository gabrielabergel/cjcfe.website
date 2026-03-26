<template>
    <div class="journal">
        <div class="journal_content">
            <p class="journal_text">{{ text }}</p>
            <AppButton :href="buttonUrl" variant="primary">{{ buttonText }}</AppButton>
        </div>
    </div>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        required: true,
    },
    buttonUrl: {
        type: String,
        default: '#',
    },
});
</script>

<style lang="scss" scoped>

.journal {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--beige);
}

.journal_content {
    width: 100%;
    padding: var(--40);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: var(--20);
}

.journal_text {
    font-size: 18px;
    color: var(--white);
}
</style>