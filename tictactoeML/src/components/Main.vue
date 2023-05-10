<script setup lang="ts">
import {defineComponent,reactive,ref} from 'vue'

//Make Tic Tac Toe game
const counter = reactive({count: 0})
const count = ref(0)
const increment = () => {
    counter.count++
    count.value++
}
const bvalues = ref([" "," "," "," "," "," "," "," "," "])
function turntable(index){
    bvalues.value[index] = isturn.value ? "X" : "O"
    isturn.value = !isturn.value
}
const isturn = ref(true)
</script>

<template>
    <div>
        <h1>Tic Tac Toe</h1>
        <h3>..but with Machine Learning!</h3>
        <br>
        <h3>Status: {{isturn ? "X's turn" : "O's turn"}}</h3>
    </div>
    <main>
        <input type="button" v-for="(text,index) in bvalues" :key="index" v-model="bvalues[index]" @click="turntable(index)"/>
    </main>
</template>

<style scoped>
main {
    display: grid;
    grid-template-columns: repeat(3, 50px);
    grid-template-rows: repeat(3, 50px);
    gap: 10px;
}

input[type="button"] {
    margin: 0;
}
</style>