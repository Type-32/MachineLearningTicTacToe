<script setup lang="ts">
import {defineComponent,reactive,ref} from 'vue'
import {NButton} from 'naive-ui'

//Make Tic Tac Toe game
const counter = reactive({count: 0})
const count = ref(0)
const endmessage = ref("You Tied with the Algorithm!")
const increment = () => {
    counter.count++
    count.value++
}
const bvalues = ref([" "," "," "," "," "," "," "," "," "])
function checkEndgame(){
    //Check for win
    //Check for tie
    //Check for loss
    var win = false
    var tie = false
    if (bvalues.value[0] == bvalues.value[1] && bvalues.value[1] == bvalues.value[2] && bvalues.value[0] != " "){
        //Check for first row
        if (bvalues.value[0] == "X"){
            win = true
        }
    }
    else if (bvalues.value[3] == bvalues.value[4] && bvalues.value[4] == bvalues.value[5] && bvalues.value[3] != " "){
        //Check for second row
        if (bvalues.value[3] == "X"){
            win = true
        }
    }
    else if (bvalues.value[6] == bvalues.value[7] && bvalues.value[7] == bvalues.value[8] && bvalues.value[6] != " "){
        //Check for third row
        if (bvalues.value[6] == "X"){
            win = true
        }
    }
    else if (bvalues.value[0] == bvalues.value[3] && bvalues.value[3] == bvalues.value[6] && bvalues.value[0] != " "){
        //check for first column
        if (bvalues.value[0] == "X"){
            win = true
        }
    }
    else if (bvalues.value[1] == bvalues.value[4] && bvalues.value[4] == bvalues.value[7] && bvalues.value[1] != " "){
        //check for second column
        if (bvalues.value[1] == "X"){
            win = true
        }
    }
    else if (bvalues.value[2] == bvalues.value[5] && bvalues.value[5] == bvalues.value[8] && bvalues.value[2] != " "){
        //check for third column
        if (bvalues.value[2] == "X"){
            win = true
        }
    }
    else if (bvalues.value[0] == bvalues.value[4] && bvalues.value[4] == bvalues.value[8] && bvalues.value[0] != " "){
        //check for positive diagonal
        if (bvalues.value[0] == "X") {
            win = true
        }
    }
    else if (bvalues.value[2] == bvalues.value[4] && bvalues.value[4] == bvalues.value[6] && bvalues.value[2] != " ") {
        //check for negative diagonal
        if (bvalues.value[2] == "X") {
            win = true
        }
    }
    else if (bvalues.value[0] != " " && bvalues.value[1] != " " && bvalues.value[2] != " " && bvalues.value[3] != " " && bvalues.value[4] != " " && bvalues.value[5] != " " && bvalues.value[6] != " " && bvalues.value[7] != " " && bvalues.value[8] != " "){
        win = false
        tie = true
    }else{
        return
    }
    if(tie){
        document.getElementById("endgame-msg")?.classList.add("tie-text")
        endmessage.value = "You Tied with the Algorithm!"
    }else if(win){
        document.getElementById("endgame-msg")?.classList.add("win-text")
        endmessage.value = "You Won!"
    }else{
        document.getElementById("endgame-msg")?.classList.add("lose-text")
        endmessage.value = "You Lost!"
    }
    document.getElementById("reset-game-button")?.classList.remove("hidden")
    document.getElementById("endgame-msg")?.classList.remove("hidden")
    document.getElementById("slot-button")?.classList.add("uninteractable")
}
function turntable(index){
    if(bvalues.value[index] != " "){
        document.getElementById("warning-msg")?.classList.remove("hidden")
        return
    }else{
        document.getElementById("warning-msg")?.classList.add("hidden")
    }
    bvalues.value[index] = isturn.value ? "X" : "O"
    checkEndgame()
    isturn.value = !isturn.value
}
function resetGame(){
    document.getElementById("endgame-msg")?.classList.add("hidden")
    for (let i = 0; i < bvalues.value.length; i++) {
        bvalues.value[i] = " "
    }
    document.getElementById("reset-game-button")?.classList.add("hidden")
    document.getElementById("slot-button")?.classList.remove("uninteractable")
    isturn.value = true
}
const isturn = ref(true)
</script>

<template>
    <div>
        <h1>Tic Tac Toe</h1>
        <h3>...but with Machine Learning!</h3>
        <br>
        <h4>You are: X</h4>
        <h3>Status: {{isturn ? "X's turn" : "O's turn"}}</h3>
        <h3 class="hidden" id="endgame-msg">{{endmessage}}</h3>
        <h3 class="hidden warning" id="warning-msg">You cannot fill that spot! It is Occupied.</h3>
        <NButton @click="resetGame" class="hidden" id="reset-game-button">Reset Game</NButton>
    </div>
    <main>
        <input type="button" id="slot-button" v-for="(text,index) in bvalues" :key="index" v-model="bvalues[index]" @click="turntable(index)"/>
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
.uninteractable{
    pointer-events: none;
}
.warning{
    color: red;
    font-weight: bold;
    animation: ease-in-out 1s;
}
.hidden{
    visibility: hidden;
    animation: ease-in-out 1s;
}
.win-text{
    color: green;
    font-weight: bold;
    animation: ease-in-out 1s;
}
.lose-text{
    color: red;
    font-weight: bold;
    animation: ease-in-out 1s;
}
.tie-text{
    color: yellow;
    font-weight: bold;
    animation: ease-in-out 1s;
}
</style>