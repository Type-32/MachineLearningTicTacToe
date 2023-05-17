<script setup lang="ts">

import CardGameMenu from "@/components/CardGameMenu.vue";
</script>

<template>
    <n-divider>
        <header>
            <n-menu>
                <n-li><a href="/">Home</a></n-li>
                <n-li><a href="/game">Game</a></n-li>
                <n-li><a href="/about">About</a></n-li>
            </n-menu>
        </header>
    </n-divider>
    <CardGameMenu/>
</template>

<style scoped>
header {
    background-color: #f6f6f6;
    color: #fff;
    padding: 10px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}
n-menu{
    display: flex;
    justify-content: left;
    align-items: flex-start;
}
n-li{
    list-style-type: none;
    padding: 1px;
    margin: 5px;
}
n-li a{
    text-decoration: #4be831;
    color: #000000;
}
n-li a:hover{
    color: #8cce7e;
}
</style>