<script setup lang="ts">
import {defineComponent,reactive,ref} from 'vue'
import {NButton, NModal, NSpace, NSelect, NH1, NH2, NH3, NH4, NText, NDivider, useLoadingBar, useMessage} from 'naive-ui'
import * as tf from '@tensorflow/tfjs';

const model = tf.sequential();
model.add(tf.layers.dense({units: 9, inputShape: [9], activation: 'softmax'}));
model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam', metrics:['accuracy']});

//Board & Record Arrays
const endmessage = ref("You Tied with the Algorithm!")
const bvalues = ref([" "," "," "," "," "," "," "," "," "])
const modelValues = ref([[0,0,0,0,0,0,0,0,0]])
const prevModelValues = ref([[0,0,0,0,0,0,0,0,0]])
const trainedTimes = ref(0)
const predictionIndex = ref(0)

//Modals
const errorModal = ref(false)
const trainingModal = ref(false)

//Contents
const applyIterationButton = ref(true)// true = enabled, false = disabled; These values are inverted on input at the template section.
const iterationSelectBar = ref(true)
const mainContent = ref(false)
const matchFinished = ref(false)

//Loading bar
const loadingBar = useLoadingBar()
const floatingMessage = useMessage()

const iterationData = ref([
    [
        //Preset Record Array Data - Iteration 1, Horizontal + Perpendicular
        //Mid
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],

        //Mid Left
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0],

        //Mid Right
        [0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,1,0,0,0]
    ],
    [
        //Preset Record Array Data - Iteration 2, Diagonal
        //Top Left
        [1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],

        //Top Right
        [0,0,1,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],

        //Bottom Right
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],

        //Bottom Left
        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,0]
    ],
    [
        //Preset Record Array Data - Iteration 3, Complementary Horizontal + Perpendicular
        //Mid
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],

        //Top Left
        [1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],

        //Top Right
        [0,0,1,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],

        //Bottom Right
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],

        //Bottom Left
        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,0],

        //Mid Left
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0],

        //Mid Right
        [0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,1,0,0,0]
    ],
    [
        //Preset Record Array Data - Iteration 4, Complementary Diagonal
        //Mid
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],

        //Top Left
        [1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],

        //Top Right
        [0,0,1,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],

        //Bottom Right
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],

        //Bottom Left
        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,0],

        //Mid Left
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0],

        //Mid Right
        [0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,1,0,0,0]
    ]
]);
const iterationLabels = ref([
    [
        //Preset Record Labels - Iteration 1, Horizontal + Perpendicular
        //Init Mid
        [1,0,0,0,1,0,0,0,1],
        [0,0,1,0,1,0,1,0,0],
        [0,1,0,0,1,0,0,1,0],
        [0,0,0,1,1,1,0,0,0],

        //Init Mid Left
        [0,0,0,1,1,1,0,0,0],
        [1,0,0,1,0,0,1,0,0],

        //Init Mid Right
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,0,0,1,0,0,1]
    ],
    [
        //Preset Record Labels - Iteration 2, Diagonal
        //Init Top Left
        [1,0,0,1,0,0,1,0,0],
        [1,0,0,0,1,0,0,0,1],
        [1,1,1,0,0,0,0,0,0],

        //Init Top Right
        [0,0,1,0,0,1,0,0,1],
        [0,0,1,0,1,0,1,0,0],
        [1,1,1,0,0,0,0,0,0],

        //Init Bottom Right
        [0,0,1,0,0,1,0,0,1],
        [1,0,0,0,1,0,0,0,1],
        [0,0,0,0,0,0,1,1,1],

        //Init Bottom Left
        [1,0,0,1,0,0,1,0,0],
        [0,0,1,0,1,0,1,0,0],
        [0,0,0,0,0,0,1,1,1]
    ],
    [
        //Preset Record Labels - Iteration 3, Complementary Horizontal + Perpendicular
        //Init Mid
        [1,0,0,0,1,0,0,0,1],
        [0,0,1,0,1,0,1,0,0],
        [0,1,0,0,1,0,0,1,0],
        [0,0,0,1,1,1,0,0,0],

        //Init Top Left
        [1,0,0,1,0,0,1,0,0],
        [1,0,0,0,1,0,0,0,1],
        [1,1,1,0,0,0,0,0,0],

        //Init Top Right
        [0,0,1,0,0,1,0,0,1],
        [0,0,1,0,1,0,1,0,0],
        [1,1,1,0,0,0,0,0,0],

        //Init Bottom Right
        [0,0,1,0,0,1,0,0,1],
        [1,0,0,0,1,0,0,0,1],
        [0,0,0,0,0,0,1,1,1],

        //Init Bottom Left
        [1,0,0,1,0,0,1,0,0],
        [0,0,1,0,1,0,1,0,0],
        [0,0,0,0,0,0,1,1,1],

        //Init Mid Left
        [0,0,0,1,1,1,0,0,0],
        [1,0,0,1,0,0,1,0,0],

        //Init Mid Right
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,0,0,1,0,0,1]
    ],
    [
        //Preset Record Labels - Iteration 4, Complementary Diagonal
        //Init Mid
        [1,0,0,0,1,0,0,0,1],
        [0,0,1,0,1,0,1,0,0],
        [0,1,0,0,1,0,0,1,0],
        [0,0,0,1,1,1,0,0,0],

        //Init Top Left
        [1,0,0,1,0,0,1,0,0],
        [1,0,0,0,1,0,0,0,1],
        [1,1,1,0,0,0,0,0,0],

        //Init Top Right
        [0,0,1,0,0,1,0,0,1],
        [0,0,1,0,1,0,1,0,0],
        [1,1,1,0,0,0,0,0,0],

        //Init Bottom Right
        [0,0,1,0,0,1,0,0,1],
        [1,0,0,0,1,0,0,0,1],
        [0,0,0,0,0,0,1,1,1],

        //Init Bottom Left
        [1,0,0,1,0,0,1,0,0],
        [0,0,1,0,1,0,1,0,0],
        [0,0,0,0,0,0,1,1,1],

        //Init Mid Left
        [0,0,0,1,1,1,0,0,0],
        [1,0,0,1,0,0,1,0,0],

        //Init Mid Right
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,0,0,1,0,0,1]
    ]
]);
//Preset Record Array Data - Iteration 5, Optimal Complementary Horizontal + Perpendicular
//Preset Record Array Data - Iteration 6, Optimal Complementary Diagonal


//Training Data Container
const trainingData = ref([]);
const labels = ref([]);
const iterations = ref(1);
const iterationSelection = ref([
    {
        label:"Model Iteration 1 (\"Vincent\" Epoch 1)",
        value:1
    },
    {
        label:"Model Iteration 2 (\"Gogh\" Epoch 2)",
        value:2
    },
    {
        label:"Model Iteration 3 (\"Xander\" Epoch 3)",
        value:3
    },
    {
        label:"Model Iteration 4 (\"Turing\" Epoch 4)",
        value:4
    },
    {
        label:"Model Iteration 5 (\"Shannon\" Epoch 5)",
        value:5
    },
    {
        label:"Model Iteration 6 (\"Polar\" Epoch 6)",
        value:6
    },
]);

async function applyIteration(){
    iterationSelectBar.value = false;
    applyIterationButton.value = false;
    clearLabelsData()
    clearTrainingData()
    for (let n = 0; n < 2; n++) {
        for (let i = 0; i < iterations.value; i++) {
            //console.log(iterationData.value[i])
            for (let j = 0; j < iterationData.value[i].length; j++) {
                //console.log(iterationData.value[i][j])
                recordTrainingData(iterationData.value[i][j])
                recordTrainingData(invertRecordData(iterationData.value[i][j]))
            }
            for (let j = 0; j < iterationLabels.value[i].length; j++) {
                recordLabelsData(iterationLabels.value[i][j])
                recordLabelsData(invertRecordData(iterationLabels.value[i][j]))
            }
        }
    }
    let tempFlag:boolean = false
    try{
        iterationSelectBar.value = false;
        applyIterationButton.value = false;
        floatingMessage.info("Synchronizing Iteration Data...")
        tempFlag = await trainModel(false)
    }catch (e) {
        iterationSelectBar.value = true;
        applyIterationButton.value = true;
        floatingMessage.error("An Unexpected Error occurred returning the message: " + e)
        return false
    }
    if(tempFlag) {
        floatingMessage.success("Synchronized Iteration Data Successfully!")
        mainContent.value = true;
        matchFinished.value = false;
        return true
    }else{
        iterationSelectBar.value = true;
        applyIterationButton.value = true;
        floatingMessage.error("Unable to synchronize Iteration Data.")
        mainContent.value=false;
        return false
    }
}
function returnToSelection(){
    iterationSelectBar.value = true;
    applyIterationButton.value = true;
    //floatingMessage.error("Unable to synchronize Iteration Data.")
    mainContent.value = false;
    clearTrainingData()
    clearLabelsData()
    resetGame()
}

function recordTrainingData(tmpArr){
    trainingData.value.push(tmpArr)
}
function recordLabelsData(tmpArr){
    labels.value.push(tmpArr)
}
function clearTrainingData(){
    trainingData.value = []
}
function clearLabelsData(){
    labels.value = []
}
function invertRecordData(recordArr){
    let tempArr = recordArr
    for (let i = 0; i < tempArr.length; i++){
        tempArr[i] = invertBoardArray(tempArr[i])
    }
    return tempArr
}

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
    matchFinished.value = true
    document.getElementById("main-container")?.classList.add("uninteractable")
}

function scanBoard(){
    let tmpArr = [0,0,0,0,0,0,0,0,0]
    for(let i = 0; i < 9; i++){
        if(bvalues.value[i] == "X"){
            tmpArr[i] = 1
        }else if(bvalues.value[i] == "O"){
            tmpArr[i] = 2
        }else{
            tmpArr[i] = 0
        }
    }
    return tmpArr
}
function invertBoardArray(tmpArr){
    for(let i = 0; i < tmpArr.length; i++){
        if(tmpArr[i] == 1){
            tmpArr[i] = 2
        }else if(tmpArr[i] == 2){
            tmpArr[i] = 1
        }
    }
    return tmpArr
}
function turntable(index, reportError:boolean = true){
    if(bvalues.value[index] != " "){
        if(reportError) errorModal.value = true
        return false
    }
    prevModelValues.value = modelValues.value // Record board before change occurs
    bvalues.value[index] = isturn.value ? "X" : "O"
    modelValues.value.push(scanBoard()); //Record board after change occurs
    checkEndgame()
    isturn.value = !isturn.value

    //Pushing the normal board to training model
    //recordTrainingData(prevModelValues.value)
    //recordLabelsData(modelValues.value)

    //Pushing the inverted board to training model
    //recordTrainingData(invertRecordData(prevModelValues))
    //recordLabelsData(invertRecordData(modelValues))
    return true
}
function resetGame(){
    for (let i = 0; i < bvalues.value.length; i++) {
        bvalues.value[i] = " "
    }
    for(let i = 0; i < modelValues.value.length; i++){
        modelValues.value.pop()
    }
    for(let i = 0; i < prevModelValues.value.length; i++){
        prevModelValues.value.pop()
    }
    matchFinished.value = false
    document.getElementById("main-container")?.classList.remove("uninteractable")
    isturn.value = true
}
const isturn = ref(true)

async function trainModel(announceMessage: boolean = true) {
    let success = false
    loadingBar.start()
    if(announceMessage) {
        floatingMessage.info("Training Machine Learning Model...")
    }
    trainingModal.value = false
    document.getElementById("config-buttons")?.classList.add("uninteractable")
    console.log(trainingData.value)
    try {
        await model.fit(tf.tensor2d(trainingData.value), tf.tensor2d(labels.value), {epochs: 200}).then(() => {
            loadingBar.finish()
            if(announceMessage) {
                floatingMessage.success("Machine Learning Model Trained Successfully!")
                trainingModal.value = true
            }
            document.getElementById("config-buttons")?.classList.remove("uninteractable")
            success = true
        });
    } catch (e) {
        floatingMessage.error("Error while Training Machine Learning Model: " + e)
        success = false
    }
    trainedTimes.value = model.getWeights().length
    return success
}
const prediction = ref('')
const argDef = ref(-1)
function makePrediction() {
    //trainModel()
    if (!model) return;

    // Define the game board state
    const gameState = tf.tensor2d([scanBoard()]);

    // Use the model to predict the next move
    const output = model.predict(gameState);

    // Get the predicted move
    predictionIndex.value = output.argMax(-1).dataSync()[0];
    prediction.value = `(${Math.floor(predictionIndex.value / 3)}, ${predictionIndex.value % 3})`;
    console.log(prediction)
    let val = turntable(predictionIndex.value,false)
    let cnt = 0
    while (!val){
        console.log((predictionIndex.value + cnt) % 9)
        val = turntable((predictionIndex.value + cnt) % 9,false)
        cnt += 1
        if(cnt > 9){
            console.log("No more moves available")
            break
        }
    }
}
async function clearModelWeights() {
    while (true){
        try {
            await model.pop()
        } catch (error) {
            break
        }
    }
    trainedTimes.value = model.getWeights().length
}
trainedTimes.value = model.getWeights().length
</script>

<template>
    <NModal
            v-model:show="errorModal"
            :mask-closable="true"
            preset="dialog"
            title="Error"
            content="Cannot Execute Operation: Slot is already occupied."
        />
    <NModal
            v-model:show="trainingModal"
            :mask-closable="true"
            preset="dialog"
            title="Results"
            content="Model Training Complete!"
        />
    <NSpace vertical class="middle-align">

        <!--Title Space-->
        <div class="middle-align">
            <h1>Tic Tac Toe</h1>
            <h3>Powered by Machine Learning</h3>
        </div>
        <!--<NText>{{iterationData[1][1]}}</NText>-->
        <NDivider/>
        <!--Selection Space-->
        <NCard class="middle-align" v-if="mainContent === false">
            <h3>Options</h3>
            <NSpace align="center" justify="center">
                <NSelect :disabled="!iterationSelectBar" v-model:value="iterations" :options="iterationSelection" :consistent-menu-width="false"/>
                <NButton type="primary" :disabled="!applyIterationButton" @click="applyIteration">Set Iteration</NButton>
            </NSpace>
        </NCard>

        <!--Main Space-->
        <NSpace id="mainContent" vertical v-else>
            <NSpace id="config-buttons">
                <NButton type="primary" @click="resetGame" id="reset-game-button" v-show="matchFinished">Reset Game</NButton>
                <NButton type="primary" @click="trainModel" id="train-model-button" v-show="matchFinished">Train Model</NButton>
                <!--<NButton @click="initialize" class="" id="reset-game-button">Initialize Model</NButton>-->
                <NButton type="primary" @click="makePrediction" id="ML-predict-button" v-show="!matchFinished">Make AI Prediction</NButton>
                <!--<NButton @click="clearModelWeights" id="clear-model-button">Clear Model</NButton>-->
                <NButton type="primary" @click="returnToSelection" id="return-to-selection-button">Switch Model</NButton>
            </NSpace>
            <NSpace vertical>
                <h4>You are: X</h4>
                <h4>Status: {{isturn ? "X's turn" : "O's turn"}}</h4>
                <h4 class="hidden" id="endgame-msg" v-show="matchFinished">{{endmessage}}</h4>
                <h4 id="trained-amount">Trained Times: {{trainedTimes}}; Prediction Index: {{predictionIndex}}</h4>
            </NSpace>
            <main id="main-container">
                <input type="button" id="slot-button" class="slot-button" v-for="(text,index) in bvalues" :key="index" v-model="bvalues[index]" @click="turntable(index);"/>
            </main>
        </NSpace>
    </NSpace>
</template>

<style scoped>
main {
    margin: 10px 10px 10px 10px;
    display: grid;
    grid-template-columns: repeat(3, 50px);
    grid-template-rows: repeat(3, 50px);
    gap: 10px;
    justify-content: center;
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
}
.hidden{
    visibility: hidden;
    display: none;
}
.win-text{
    color: green;
    font-weight: bold;
}
.lose-text{
    color: red;
    font-weight: bold;
}
.tie-text{
    color: #ffb700;
    font-weight: bold;
}
.slot-button{
    font-size: 25px;
    font-weight: bold;
    animation: ease-in-out 0.15s;
    border-width: 0px;
    border-radius: 5px;
    transition: ease-in-out 0.15s;
    background-color: #e0e0e0;
}
.slot-button:hover{
    background-color: rgb(176, 239, 161);
    transition: ease-in-out 0.1s;
    border-width: 2px;
    border-color: rgb(53, 128, 36);
    transform: scale(1.1);
}
.slot-button:active{
    background-color: rgb(176, 239, 161);
    transition: ease-in-out 0.05s;
    transform: scale(0.95);
    border-width: 1px;
    border-color: rgb(53, 128, 36);
}
NButton{
    margin: 10px 10px 10px 10px;
}
.middle-align{
    text-align: center;
}
h1{
    font-size: 50px;
    font-weight: bold;
}
h3{
    font-size: 20px;
    font-weight: bold;
}
h4{
    font-size: 15px;
    font-weight: bold;
}
</style>