// Import firebase.js from module
import app from "./firebase.js";

// Import firebase functions that we'll use
import { getDatabase, ref, set, get, push} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

// Define database reference point variables
const database = getDatabase(app);
const dbRef = ref(database);
const answers = ref(database, `/answers`);

// Define DOM element variables
const form = document.querySelector('form');
const ul = document.querySelector('ul');
const submit = document.querySelector('button');

// Define questions array
const questions = [
    "It's nice to meet you! Tell me, do you like hot dogs?",
    "What is your favourite hot dog topping?",
    "How many hot dogs do you eat in a year?",
    "What is your favourite place to get hot dogs?"
];

// Define ul scrolling for chatbox
ul.scrollTop = ul.scrollHeight - ul.clientHeight;

// Set question interval counter
let i = 0;

// Reset database node for answers
set(answers, "");

// Define push function to add user inputted messages to database
const addToList = function (userResponse){
    return push(answers, userResponse);
};

    // Submit button Event Listener, which does a few main things:
    // 1) Checks user input, and if it's not empty, it continues
    // 2) Checks the position in the program questions and determines what logic to use for the response
    // 3) If mid-program, it logs user input to firebase and populates it in a chat message for the user
    // 4) The computer hands out the appropriate next question if the answer is valid and it's populated in a chat message
    // 5) The question interval counter is cycled forward one number for the next question
    // 6) There is a check for when the array is done, when the program ends and disables the inputs
form.addEventListener('submit', function(event) {
    
    // Prevent default form submission
    event.preventDefault();
    
    // Get the message from the input and store in msg variable
    const input = document.querySelector('input');
    const msg = input.value.trim();

    // Define some variables to help create elements
    const liGreen = document.createElement('li');
    const pGreen = document.createElement('p');
    const liBlue = document.createElement('li');
    const pBlue = document.createElement('p');

    // FUNCTIONS FOR EVENTLISTENER
    // Places user msg in a green chat message in chatbox
    const liGreenPlacement = (msg) => {
        liGreen.className = 'green';
        pGreen.textContent = msg;
        liGreen.append(pGreen);
        ul.appendChild(liGreen);
    };

    // Places "loading dots" animation on a new blue chat message in chatbox
    const dottedLiPlacement = () => {
        liBlue.className = 'dotted-li dot-pulse';
        liBlue.append(pBlue);
        ul.appendChild(liBlue);
        liBlue.scrollIntoView({block: 'end'});
        ul.scrollIntoView();
    };

    // Places the current computer generated question into a blue chat message in the chatbox
    const computerQuestion = (currentQ) => {
        liBlue.className = 'blue';
        pBlue.textContent = currentQ;
        liBlue.append(pBlue);
        ul.appendChild(liBlue);
        liBlue.scrollIntoView({block: 'end'});
        ul.scrollIntoView();
    }
    
    // If/Else check to make sure msg is not an empty string
    // If it is not empty, proceed with program
    // Else, ask the user to try again
    if (msg) {  

        // Create a lowercase version of msg for later
        const lcMsg = msg.toLowerCase();

        // If/Else check to see what question number we are on and use the right logic for that question
        // If the i variable indicates we're on question 1, run that logic
        // Else if the i variable indicates we're on question 2, run that logic... etc
        // If the i variable indicates we're out of questions, run the end of program logic
        
        // Question 1
        if (i === 0){

            // logic to check if user inputted string not just numbers, lodge answer, produce messages and move on to next q
            if (isNaN(msg)) {
                addToList(msg);
                liGreenPlacement(msg);
                input.value = '';
                dottedLiPlacement();
                i++;
                return setTimeout(() => {
                    computerQuestion(questions[0]);
                }, 1250);
            } else {
                computerQuestion("That doesn't look like a name to me. Could you try again with a name that isn't comprised of just numbers?");
                input.value = '';
        }

        // Question 2
        } else if (i === 1){

            // If/Else to check against answer 3 ways
            // If yes, then continue (produce chat messages, save input, cycle question interval)
            // Else If no, then act sad and end the program
            // Else, it's an error, so insist the user answers yes or no
            if (lcMsg === 'yes') {
                addToList(msg);
                liGreenPlacement(msg);
                dottedLiPlacement();
                input.value = '';
                i++;
                return setTimeout(() => {
                    computerQuestion('Amazing! I LOVE hot dogs! ' + questions[1]);
                }, 1250);
            } else if (lcMsg === 'no') {
                addToList(msg);
                liGreenPlacement(msg);
                dottedLiPlacement();
                input.value = '';
                i++;
                return setTimeout(() => {
                    computerQuestion("Oh no! That's a shame. I can only really talk about hot dogs, so I'll go ahead and end our program now to save you the time. I'll be here 24/7, so let me know if you want to chat about hot dogs later by refreshing the page :)");
                    input.value = '';
                    input.disabled = true;
                    submit.disabled = true;
                }, 1250);
            } else {
                const prevQ = i - 1;
                computerQuestion("Please answer 'yes' or 'no'. Do you like hot dogs?");
                input.value = '';
            }

        // Question 3
        } else if (i === 2){

            // No logic to check answer against, lodge answer, produce messages and move on to next q
            addToList(msg);
            liGreenPlacement(msg);
            dottedLiPlacement();
            input.value = '';
            i++;
            return setTimeout(() => {
                computerQuestion(questions[2]);
            }, 1250);

        // Question 4
        } else if (i === 3){

            // If/Else checking if the answer for question 4 is a number
            // If it is not a number, then we need to ask for a number again
            // Else, it is a number, we log the answer in the db, put it in a green chat message, then run the next computer question and shift the question interval
            if (isNaN(msg)) {
                const prevQ = i - 1;
                computerQuestion("That doesn't look like a number to me. " + questions[prevQ]);
                input.value = '';
            } else {
                addToList(msg);
                liGreenPlacement(msg);
                dottedLiPlacement();
                input.value = '';
                i++;
                return setTimeout(() => {   
                    computerQuestion(questions[3]);
                }, 1250);
            }
        
        // End of program code
        } else if (i === 4) {

            // Clear input field and disable form
            input.value = '';
            input.disabled = true;
            submit.disabled = true;

            // Get the user's answers from the database and put into a JS array for later
            get (answers)
            .then((data)=>{
                let aObj = data.val();
                let aArray = Object.values(aObj);
                const liBlue2 = document.createElement('li');
                const pBlue2 = document.createElement('p');

                // Create some lower case versions of the user answers for later
                const a1Lower = aArray[1].toLowerCase();
                const a2Lower = aArray[2].toLowerCase();
                const a3Lower = aArray[3].toLowerCase();

                // Place user message on screen
                liGreenPlacement(msg);

                // Show loading dots
                dottedLiPlacement();
                
                // After a delay, show the first end of program computer message
                setTimeout(() => {
                    computerQuestion("Congratulations, " + aArray[0] + ", you finished my quiz! Let me show you your answers:");
                }, 1250);

                // After a longer delay, add a second computer message reciting back the user's answers and encourage them to try again by refreshing
                return setTimeout(() => {
                    liBlue2.className = 'dotted-li dot-pulse';
                    liBlue2.append(pBlue2);
                    ul.appendChild(liBlue2);
                    liBlue2.scrollIntoView({block: 'end'});
                    ul.scrollIntoView();
                    setTimeout(() => {
                        liBlue2.className = 'blue';
                        pBlue2.textContent = "When I asked if you liked hot dogs, you said " + a1Lower + "! Your favourite topping is " + a2Lower + " (I love that one too!). You estimated that you eat about " + a3Lower + " hot dogs in a year; incredible! Finally, I can't thank you enough for the tip on where to get my next hot dog, I'll be sure to try " + msg + "! Thanks for taking my quiz! Refresh the page to try again :)";
                        liBlue2.append(pBlue2);
                        ul.appendChild(liBlue2);
                        liBlue2.scrollIntoView({block: 'start'});
                        ul.scrollIntoView();
                    }, 2000);
                }, 2000)
            });

        // This would mean we don't have any kind of value in i, or i has exceeded the value of the array, so it's a check for the dev mostly to let them know if we can't properly check our i variable
        } else {
            alert('Something has gone wrong.');
        }
    
    // If user inputs empty string
    } else {

        // Check against i variable to see what question we're on, as initial question is populated directly in HTML so needs to be treated differently
        if (i < 1) {
            computerQuestion('Please try again. My name is Hot Dog Bot, thanks for coming to chat with me today! What is your name?');
        } else {
            const prevQ = i - 1;
            computerQuestion('Please try again. ' + questions[prevQ]); 
            input.value = '';
        }
    }
});




                