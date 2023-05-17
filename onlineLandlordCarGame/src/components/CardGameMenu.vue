<script setup lang="ts">
import Card from "@/components/Card.vue";
import {defineComponent,reactive,ref} from 'vue'
const cardDeck = ref(["1"])
</script>

<template>
    <!--Make holder to hold card elements-->
  <n-list>
      <Card v-for="(text,index) in cardDeck" :key="index" v-model="cardDeck[index]" />
  </n-list>
</template>

<style scoped>
n-list{
    display: flex;
    justify-content: left;
    align-items: flex-start;
}
</style>