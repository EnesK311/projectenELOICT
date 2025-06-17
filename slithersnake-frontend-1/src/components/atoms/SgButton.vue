<template>
    <button><slot></slot></button>
</template>

<style scoped lang="scss">
    button {
        font-size: 1.1em;
        cursor: pointer;
        color: var(--btn-color);
        background-color: var(--accent);
        border: none;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        border-radius: 10px;
        width: 100%;
        min-width: 1%;

        &:hover {
            background-color: var(--accent-light);
        }

        &:disabled {
            cursor: not-allowed;
            background-color: var(--accent-dark);

            &:hover {
                background-color: var(--accent-dark);
            }
        }
    }
</style>