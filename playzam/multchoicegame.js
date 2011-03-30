// JSON data for questions/answers
var data;

// user's score
var score;

// how many bonus points to add to score
var scoreBonus;

// current question and answer
var curQA;

// correct question and answer index
var correctQAIdx;

// array of the correct questions and answers
var correctQAIdxs;

// default background color of answers
var defaultBg;

// boolean, keep user from answering during background fade
var alreadyAnswered;

// boolean, whether or not arrow keys for game control are disabled
var controlsDisabled;

// boolean, previous answer is correct 
var previousCorrect;

// boolean, whether or not game timer has started
var timerStarted;

// seconds used for current game
var timerSeconds;

// the timer used to tracking seconds
var timer;

// highscore starts at 0
var highscore = 0;

// best time starts at positive infinity
var besttime = Infinity;

$(document).ready(function(){
    log("document ready");
    // get the default background color
    defaultBg = $(".answer").css("background-color");
    
    $(".answer").click(function() {
        log("answer click detected");
        onClickAnswer("#"+$(this).attr("id"));
        return !1;
    });
    
    // start new game when play again button clicked
    $("#playAgainButton").click(function() {
        log("play again click");
        startNewGame();
        return !1;
    });
    
    // temporarily disable arrow key game functionality to allow editing
    $("#data").focus(function () {
        controlsDisabled = true;
    }).focusout(function () {
        controlsDisabled = false;
    });
    
    // submit new JSON data for the game
    $("#submitData").click(function() {
        parseData();
        startNewGame();
        return !1;
    });
    
    // start the first game
    parseData();
    startNewGame();
});

// initialize (or reset) the game
function startNewGame(){
    log("startNewGame");
    controlsDisabled = false;
    previousCorrect = false;
    timerStarted = false;
    
    //reset score, bonus, and timer seconds
    score = 0;
    scoreBonus = 0;
    $("#score").text(score); 
    timerSeconds = 0;
    $("#timer").text(timerSeconds);
    
    // hide the Play Again button
    $("#playAgain").hide(200);
    
    // remove any messages
    $("#messages").html("");
    
    // reset correct answer idxs
    correctQAIdxs = new Array();
    
    // reset status bar
    updateStatusBar();
    
    showNextQA();
}

// parse JSON data in textarea
function parseData() {
    log("parseData");
    try {
        data = jQuery.parseJSON($('#data').val()); 
    } catch(e) {
        alert("Invalid JSON");
    }
}

function onClickAnswer(answerId) {
    log("onClickAnswer:"+answerId);
    if(alreadyAnswered || controlsDisabled) {
        // answered or controls disabled (end of game), so ignore
        log("answered:"+alreadyAnswered+" or disabled:"+controlsDisabled);
        return !1;
    }
    
    // start the timer if it hasn't started yet
    if(!timerStarted) {
        log("starting timer");
        timerStarted = true;
        // update every tenth of a second
        timer = setInterval("updateTimer()",100);
    }
    // TODO: change to make this work on images using $(id).hasClass("img")
    
     $(".smile").hide(0);
    
    // figure out amount to change score by and new background color
    var scoreChange = 0;
    var newBg, isCorrect;
    log("answer:"+$(answerId).text()+"\tcorrect:"+data[correctQAIdx].answer);
    if($(answerId).text() == data[correctQAIdx].answer) {
        // correct
        log("correct");
        scoreChange += 1+scoreBonus;
        scoreBonus = (scoreBonus+1)* 2;
        correctQAIdxs.push(correctQAIdx);
        newBg = "#afa";
        if(previousCorrect && genRandom(4) == 4) {
            // random extra bonus
            $("#smile2").show(0);
        }
        else{
            // regular smiley face
            $("#smile1").show(0);
        }
        isCorrect = true;
        previousCorrect = true;
        updateStatusBar();
    }
    else {
        // incorrect
        log("incorrect");
        scoreChange -= 1;
        scoreBonus = 0;
        newBg = "#faa";
        isCorrect = false;
        previousCorrect = false;
        // meh smiley face
        $("#smile0").show(0);
    }
    
    changeScore(scoreChange);
    showScoreChange(scoreChange, isCorrect);
    
    // momentarily fade the color to indicate right/wrong answer
    $(answerId).animate({
        backgroundColor:newBg
    }, 150, function() {
        log("wait 500 ms");
        setTimeout("onAnswerIndicatorFinish()", 500);
    });
}

//When the correct/incorrect answer indicator finishes animating
function onAnswerIndicatorFinish() {
    log("onAnswerIndicatorFinish");
    $(".answer").css("background-color",defaultBg);
    if(!isWin()) {
        showNextQA();
    }
}

// show the next question-answers
function showNextQA() {
    log("showNextQA");
    alreadyAnswered = false;
    
    // update the prompt with a random prompt
    correctQAIdx = genRandomNotIn(correctQAIdxs,data.length-1);
    var curQA = data[correctQAIdx];
    $("#prompt").text(curQA.prompt);

    var wrongQAIdx = genRandomNotIn([correctQAIdx],data.length-1);
    var randomizedQAs = shuffle([correctQAIdx, wrongQAIdx]);
    
    // TODO: more generic N number of questions
    $("#answerNumber0").text(data[randomizedQAs[0]].answer);
    $("#answerNumber1").text(data[randomizedQAs[1]].answer);
}

// show the given message
function showMessage(messageString) {
    log("showMessage:"+messageString);
    $("#messages").text(messageString);
}

// show the change in score above the element with ID aboveId
function showScoreChange(scoreChange, isCorrect) {
    log("showScoreChange:"+scoreChange+","+isCorrect);
    var color = "#c00";
    if(isCorrect) {
        color = "#0c4";
        scoreChange = "+"+scoreChange;
    }
    $("#scoreChange").fadeIn(500).text(scoreChange).css("color",color).fadeOut(300);
}

// handle score change
function changeScore(amount) {
    log("changeScore:"+amount);
    var curScore = parseInt($("#score").text());
    if ((curScore+amount)<0){
        curScore=0;
    }
    else {
        curScore += amount;
    }
    $("#score").text(curScore);
    
    // update highscore if necessary
    if(curScore > highscore) {
        highscore = curScore;
    }
}

// update the timer seconds by adding 1/10 second
function updateTimer() {
    // round to nearest 10th (precision problem)
    timerSeconds = Math.round((timerSeconds+0.1)*10)/10;
    if(timerSeconds == Math.round(timerSeconds)) {
        // add a '.0'
        $("#timer").text(timerSeconds+".0");
    }
    else {
        $("#timer").text(timerSeconds);
    }
}

// update the game status bar
function updateStatusBar() {
    log("updateStatusBar");
    var percentDone = correctQAIdxs.length/data.length;
    var newWidth = $("#statusbar").width() * percentDone;
    $("#currentstatus").css("width",newWidth+"px");
}

// check if user has won
function isWin(){
    log("isWin");
    if(correctQAIdxs.length >= data.length){
        log("DONE");
        // stop timer
        clearInterval(timer);
        
        // update best time if necessary
        if(timerSeconds < besttime) {
            besttime = timerSeconds;
        }
        
        // show game done and play again
        $("#messages").html("Game Done<br><span class='smaller'>High score: "+highscore+"</span><br><span class='smaller'>Best time: "+besttime+"</span>");
        $("#playAgain").show(200);
        return true;
    }
    return false;
}
