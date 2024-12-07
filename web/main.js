// For everything else
let container = document.getElementById("listings");
let lettersDiv = null;
let onLoaded = null;
let hasLetterClicked = false;
let currentLetter = "";

//helper functions

const toCharArray = function(str){
    let output = []
    for(let i = 0; i < str.length; i++){
        output.push(str.charAt(i));
    };
    return output
};

const empty = function(){
    if (container){container.innerHTML = ""}
};

const widgetAnimation = function(name, path, description, color, double = false, controls = false){
    let widget = document.createElement("div");
    let video = document.createElement("video");
    let source = document.createElement("source");
    let title = document.createElement("span");
    let desc = document.createElement("span");


    widget.id = "widget-" + name;
    video.id = "widget-animation";
    title.id = "widget-title";
    desc.id = "widget-desc";

    title.innerText = name;
    desc.innerText = description;


    if (double) {
        widget.className = "double"
    } else {
        widget.className = "single"
    } 

    widget.className += " widget"
    widget.style.backgroundColor = color;

    video.controls = controls;
    video.autoplay = false;
    source.src = path;
    source.type = "video/mp4";
    // todo: add more attributes here

    video.appendChild(source);

    widget.appendChild(title);
    widget.appendChild(video);
    widget.appendChild(desc);

    return widget;
}

// Load content functions

const createLetters = function(){
    let letters = document.getElementById("letters");
    let div = document.createElement("div");
    
    toCharArray("ABCDEFGHIJKLMNOPQRTUVWXYZ").forEach(function(char){
        let span = document.createElement("span");
        span.innerText = ` ${char}`;
        span.setAttribute("onclick", `switchToLetter("${char}")`);
        span.id = "letter-" + char;
        span.className = "noclick";
        span.style.color = "#ffffff"
        div.appendChild(span);
    });
    lettersDiv = div;
    if (onLoaded == false){
        letters.innerHTML = null;
        letters.appendChild(lettersDiv);
    }
}

const lastLetter = function(){
    /* does nothing, is supposed to do stuff after the Z section had been read */
};

const loadLetterData = function(letter){
    try {
        eval("letter"+letter.toUpperCase()+"()");
    } catch (e) {
        empty();
    }
}


const switchToLetter = function(letter){
    console.log(letter);
    if (letter != currentLetter){    
        let oldSpan = document.getElementById("letter-" + currentLetter);
        let newSpan = document.getElementById("letter-" + letter);

        if (currentLetter){oldSpan.style.color = "#ffffff";};
        newSpan.style.color = "#ededed";

        currentLetter = letter;
        loadLetterData(letter);
    }
};

const switchToNextLetter = function(){
    if (currentLetter != ""){
        let ind = toCharArray("ABCDEFGHIJKLMNOPQRTUVWXYZ").indexOf(currentLetter);

        if (currentLetter == "Z"){
            lastLetter();
        } else {
            let newLetter = toCharArray("ABCDEFGHIJKLMNOPQRTUVWXYZ")[ind + 1]
            switchToLetter(newLetter);
        }
    }
};

// event listers

document.addEventListener("DOMContentLoaded", function(){
    //add the letters to the menu bar
    container = document.getElementById("listings");
    if (lettersDiv != null){
        let letters = document.getElementById("letters");
        letters.innerHTML = ""
        letters.appendChild(lettersDiv);
        onLoaded = true // createLetters has completed
    } else {
        onLoaded = false // createLetters has not completed yet
    }

    switchToLetter("A")

});

document.addEventListener("keyup", function(event){
    if (event.code == "Space") {
        switchToNextLetter();
    }
    console.log(event);
    console.log(event.code);
});

const start = function(){ // entry point
    
}

createLetters();

// Functions for letters

const letterA = function(){
    let auditorium = widgetAnimation(
        "Auditorium",
        "./media/video/AuditoriumCompressed.mp4",
        "This is a desc.",
        "#7ed957",  // Background color
        true,       // Double size
        false       // Video controls
    );

    empty();
    container.appendChild(auditorium)
}