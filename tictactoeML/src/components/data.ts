import {ref} from "vue";

//My Data Code
export const iterationData = ref([
    [
        //Preset Record Array Data - Iteration 1, Horizontal + Perpendicular
        //Mid
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [1,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,1],

        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,1,0],
        [0,1,0,0,1,0,0,0,0],

        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,1,0,0,0],
        [0,0,0,1,1,0,0,0,0],

        //Mid Left
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0],

        //Mid Right
        [0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,1,0,0,0],

        //Mid Oriented
        [0,0,0,1,1,0,0,0,0],
        [0,0,0,0,1,1,0,0,0],
        [0,0,0,1,0,1,0,0,0],
    ],
    [
        //Preset Record Array Data - Iteration 2, Diagonal
        //Top Left
        [1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],

        [1,0,0,0,1,0,0,0,0],
        [1,0,0,0,0,0,0,0,1],

        //Top Right
        [0,0,1,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],

        [0,0,1,0,1,0,0,0,0],
        [0,0,1,0,0,0,1,0,0],

        //Bottom Right
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],

        [0,0,0,0,1,0,0,0,1],
        [1,0,0,0,0,0,0,0,1],

        //Bottom Left
        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,0],

        [0,0,0,0,1,0,1,0,0],
        [0,0,1,0,0,0,1,0,0],

        //Middle
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],

        [1,0,0,0,1,0,0,0,0],
        [0,0,1,0,1,0,0,0,0],
        [0,0,0,0,1,0,1,0,0],
        [0,0,0,0,1,0,0,0,1],
    ],
    [
        //Preset Record Array Data - Iteration 3, Complementary Horizontal + Perpendicular
        //Perpendicular
        [1,0,0,0,0,0,1,0,0],
        [0,1,0,0,0,0,0,1,0],
        [0,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,0,0],
        [0,1,0,0,1,0,0,0,0],
        [0,0,1,0,0,1,0,0,0],
        [0,0,0,1,0,0,1,0,0],
        [0,0,0,0,1,0,0,1,0],
        [0,0,0,0,0,1,0,0,1],

        //Horizontal
        [1,0,1,0,0,0,0,0,0],
        [0,0,0,1,0,1,0,0,0],
        [0,0,0,0,0,0,1,0,1],
        [1,1,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0,0],
        [0,0,0,0,0,0,1,1,0],
        [0,1,1,0,0,0,0,0,0],
        [0,0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,1]
    ],
]);
export const iterationLabels = ref([
    [
        //Preset Record Labels - Iteration 1, Horizontal + Perpendicular
        //Init Mid
        [1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0],

        [0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0],

        [0,0,0,0,0,1,0,0,0],
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0],

        //Init Mid Left
        [0,0,0,0,0,1,0,0,0],
        [0,0,0,0,1,0,0,0,0],

        //Init Mid Right
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],

        //Mid Oriented
        [0,0,0,0,0,1,0,0,0],
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
    ],
    [
        //Preset Record Labels - Iteration 2, Diagonal
        //Init Top Left
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,1],

        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,1,0,0,0,0],

        //Init Top Right
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,1,0,0],

        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,1,0,0,0,0],

        //Init Bottom Right
        [0,0,0,0,1,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],

        [1,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],

        //Init Bottom Left
        [0,0,0,0,1,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],

        [0,0,1,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],

        //Init Middle
        [0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0],

        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,1,0,0],
        [0,0,1,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],
    ],
    [
        //Preset Record Labels - Iteration 3, Complementary Horizontal + Perpendicular
        //Init Perpendicular
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],

        //Init Horizontal
        [0,1,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,1,0],
        [0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0],
    ],
]);
