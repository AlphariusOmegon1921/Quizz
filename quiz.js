let currentQuestion = 0;
let score = 0;
let totalQuestions = 0;
let questions = [];
let selectedCategory = '';
let difficulty = 'easy';
let timerInterval;
let timeRemaining = 10; 


const signInForm = document.getElementById('signInForm');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results');
const playerNameElement = document.getElementById('playerName');
const correctAnswersElement = document.getElementById('correct');
const incorrectAnswersElement = document.getElementById('incorrect');
const totalScoreElement = document.getElementById('totalScore');
const categorySelection = document.getElementById('categorySelection');
const difficultySelection = document.getElementById('difficultySelection');
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answers');
const timerDisplay = document.getElementById('timer');


function startQuiz() {
    const playerName = document.getElementById('playerNameInput').value;
    if (playerName) {
        playerNameElement.textContent = `Player: ${playerName}`;
        categorySelection.style.display = 'block';
        signInForm.style.display = 'none';
    }
    else {
        alert("Please enter your name before starting the quiz!");
    }
}


function handleCategorySelection() {
    const selectedCategoryRadio = document.querySelector('input[name="category"]:checked');
    if (selectedCategoryRadio) {
        selectedCategory = selectedCategoryRadio.value;
        categorySelection.style.display = 'none';
        difficultySelection.style.display = 'block';
    } else {
        alert('Please select a category!');
    }
}


function handleDifficultySelection() {
    const selectedDifficultyRadio = document.querySelector('input[name="difficulty"]:checked');
    if (selectedDifficultyRadio) {
        difficulty = selectedDifficultyRadio.value;
        difficultySelection.style.display = 'none';
        quizContainer.style.display = 'block';
        fetchQuestions();
    } else {
        alert('Please select a difficulty!');
    }
}


async function fetchQuestions() {
    const apiUrl = `https://the-trivia-api.com/api/questions?categories=${selectedCategory}&limit=5&difficulty=${difficulty}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        questions = data; 
        totalQuestions = questions.length;  
        showNextQuestion(); 
    } catch (error) {
        alert(`Error fetching questions: ${error.message}`);
    }
}




function showNextQuestion() {
    if (currentQuestion < totalQuestions) {
        const questionData = questions[currentQuestion];
        const answers = [questionData.correctAnswer, ...questionData.incorrectAnswers];
        shuffleArray(answers);

        questionText.textContent = questionData.question;
        answersContainer.innerHTML = answers.map((answer) => `
            <button onclick="answerQuestion('${answer}')">${answer}</button>
        `).join('');
        startTimer();
    } else {
        showResults();
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}


function startTimer() {
    timeRemaining = 10;
    timerDisplay.textContent = `Time Remaining: ${timeRemaining}`;
    
    timerInterval = setInterval(function() {
        timeRemaining--;
        timerDisplay.textContent = `Time Remaining: ${timeRemaining}`;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            answerQuestion(null); 
        }
    }, 1000);
}


function answerQuestion(answer) {
    clearInterval(timerInterval); 
    
    const questionData = questions[currentQuestion];
    const answerButtons = answersContainer.querySelectorAll('button');
    
    
    answerButtons.forEach(button => button.disabled = true);
    
    
    if (answer === questionData.correctAnswer) {
        score++;
    }
    
   
    answerButtons.forEach(button => {
        if (button.textContent === answer && answer === questionData.correctAnswer) {
            button.classList.add('correct'); 
        } else if (button.textContent === answer && answer !== questionData.correctAnswer) {
            button.classList.add('incorrect'); 
        }
        
        if (button.textContent === questionData.correctAnswer) {
            button.classList.add('correct'); 
        }
    });

    currentQuestion++;
    setTimeout(() => showNextQuestion(), 1000); 
}


function showResults() {
    quizContainer.style.display = 'none';
    const correctAnswers = score;
    const incorrectAnswers = totalQuestions - score;
    const totalScore = (correctAnswers / totalQuestions) * 100;

    correctAnswersElement.textContent = `Correct Answers: ${correctAnswers}`;
    incorrectAnswersElement.textContent = `Incorrect Answers: ${incorrectAnswers}`;
    totalScoreElement.textContent = `Total Score: ${totalScore.toFixed(2)}%`;

    resultsContainer.style.display = 'block';
}


function restartQuiz() {
    score = 0;
    currentQuestion = 0;
    questions = [];
    selectedCategory = '';
    difficulty = 'easy';
    
   
    resultsContainer.style.display = 'none';
    signInForm.style.display = 'block';
    
    
    document.getElementById('playerNameInput').value = '';
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => radio.checked = false);
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    difficultyRadios.forEach(radio => radio.checked = false);
    
   
    quizContainer.style.display = 'none';
}
