// For everything else
const debugLog = true;
let container = document.getElementById("listings");
let lettersDiv = null;
let onLoaded = null;
let hasLetterClicked = false;
let currentLetter = "";

let webdata = {};

let media = ["./media/video/AuditoriumCompressed.mp4"];
let cachedMedia = {};

//helper functions

const toCharArray = function(str){
    let output = []
    for(let i = 0; i < str.length; i++){
        output.push(str.charAt(i));
    };
    return output
};

const empty = function(){
    if (container){
        container.innerHTML = "";
    }
};

const log = function(content){
    if (debugLog){
        console.log(content);
    }
};

const widgetAnimation = function(name, path, description, color, double = false, controls = false){
    let widget = document.createElement("div");
    let video = document.createElement("video");
    let source = document.createElement("source");
    let title = document.createElement("span");
    let desc = document.createElement("span");

    widget.id = "widget-" + name;
    video.id = "widget-animation";
    video.className = "widget-animation"
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
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    let url = path
    if (typeof cachedMedia[url] != undefined){
        url = cachedMedia[url];
    }
    source.src = path;
    source.type = "video/mp4";
    // todo: add more attributes here

    video.appendChild(source);

    widget.appendChild(title);
    widget.appendChild(video);
    widget.appendChild(desc);

    return widget;
}

const widgetImage = function(name, path, description, color, double = false){
    let widget = document.createElement("div");
    let img = document.createElement("img");
    let title = document.createElement("span");
    let desc = document.createElement("span");

    widget.id = "widget-" + name;
    img.id = "widget-image";
    img.className = "widget-image"
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

    img.src = path;

    widget.appendChild(title);
    widget.appendChild(img);
    widget.appendChild(desc);

    return widget;
}


const widgetText = function(name, text, color, double = false, whitespace = 1){
    let widget = document.createElement("div");
    let title = document.createElement("span");
    let desc = document.createElement("span");
    //let mapIcons = document.createElement()

    widget.id = "widget-" + name;
    title.id = "widget-title";
    desc.id = "widget-desc";

    if (double) {
        widget.className = "double"
    } else {
        widget.className = "single"
    } 
    
    widget.className += " widget"
    widget.style.backgroundColor = color;
    desc.innerText = text;
    title.innerText = name;

    widget.appendChild(title);
    for (let i=0;i<whitespace;i++){
        widget.appendChild(document.createElement("br"))}
    widget.appendChild(desc);

    return widget
}

const widgetWhitespace = function(name, double){
    let widget = document.createElement("div");

    widget.id = "widget-" + name;

    if (double) {
        widget.className = "double"
    } else {
        widget.className = "single"
    } 
    
    widget.className += " widget";
    widget.className += " widget-whitespace";

    return widget;
}

// Preload content functions

const preloadMediaVideo = async function(path){
    let video = await fetch(path);
    let blob = await video.blob();
    let url = new URL.createObjectURL(blob);
    return url;

}

const preloadMedia = async function(){
    media.forEach(function(url){
        cachedMedia[url] = preloadMediaVideo(url);
    });
};

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
        console.error("Letter not defined: " + letter.toUpperCase());
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
        log("Loaded letter: " + letter);
    }
};

const switchToNextLetter = function(){
    if (currentLetter != ""){
        let ind = toCharArray("ABCDEFGHIJKLMNOPQRTUVWXYZ").indexOf(currentLetter);

        if (currentLetter == "Z"){
            lastLetter();
        } else {
            let newLetter = toCharArray("ABCDEFGHIJKLMNOPQRTUVWXYZ")[ind + 1];
            log("Switching to letter: " + newLetter);
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

    switchToLetter("A") // First letter

});

document.addEventListener("keyup", function(event){

    if (event.code == "Space") {
        switchToNextLetter();
    }
});

const start = function(){ // entry point
    document.getElementById("start").className += " glideAway"
}




createLetters();




// Functions for letters

const letterA = function(){
    let auditorium = widgetAnimation(
        "Auditorium",
        "./media/video/AuditoriumCompressed.mp4",
        "Built in 1952, the Sydney Technical High School auditorium is a historic venue with a capacity of around 1000, used for both school performances and important examinations. Home to a large instrument collection, it showcases the school's rich artistic heritage and musical talent. ",
        "#7ed957",  // Background color
        true,       // Double size
        false       // Video controls
    );

    let assemblies = widgetText(
        "Assemblies",
        "Assemblies are usally held on fridays but can be held on any day",
        "#cb6ce6",             // Background color
        false,                 // Double size
        2
    );

    let aBlock = widgetAnimation(
        "A Block",
        "./media/video/AuditoriumCompressed.mp4",
        "A Block is the main building, housing rooms 1-20, including science, English, mathematics, and history classrooms, The science and math staff rooms are on the bottom floor, while the history and English staff rooms are next to room 20 on the top floor, with room 11a, an administrative room",
        "#ffbd59",  // Background color
        true,       // Double size
        false       // Video controls
    );
    
    let whitespace = widgetWhitespace(
        "fill0",
        false
    );


    empty();
    container.appendChild(assemblies);
    container.appendChild(auditorium);
    container.appendChild(aBlock);
    container.appendChild(whitespace);
    
}
