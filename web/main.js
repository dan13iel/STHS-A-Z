// For everything else
const debugLog = true;
const sideNav = true;
let container = document.getElementById("listings");
let lettersDiv = null;
let onLoaded = null;
let hasLetterClicked = false;
let currentLetter = "";

let webdata = {};

let media = ["./media/video/AuditoriumCompressed.mp4", "./media/video/A-BlockCompressed.mp4"];
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

const relativeToFullURL = function(path){
    return new URL(`${window.location.origin}/${path}`).href
}

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
    source.className = "widget-video-source";

    title.innerHTML = name;
    desc.innerHTML = description;


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
    if (cachedMedia[path] != undefined){
        url = cachedMedia[path]
    }
    source.src = url;
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

    title.innerHTML = name;
    desc.innerHTML = description;


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
    desc.innerHTML = text;
    title.innerHTML = name;

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

const setSettings = async function(){
    if (sideNav && window.innerWidth > 650) {
        let lettersDiv = document.getElementById("letters").style;
        let spanLetters = document.getElementsByClassName
        lettersDiv.position = "absolute";
        lettersDiv.height = "90%";
        lettersDiv.top = "5%";
        lettersDiv.left = "5%";
        lettersDiv.width = "26px";
    }
}

// Preload content functions

const preloadMediaVideo = async function(path){
    let video = await fetch(path);
    let blob = await video.blob();
    let url = URL.createObjectURL(blob);
    return url;
}

const preloadMedia = async function(){
    media.forEach(await async function(url){
        cachedMedia[url] = await preloadMediaVideo(url);
        console.log("Cached")
    });
    console.log(cachedMedia);
};

// Load content functions

const createLetters = function(){
    let letters = document.getElementById("letters");
    let div = document.createElement("div");
    
    toCharArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ").forEach(function(char){
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
        window.location.hash = letter.toUpperCase();
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
            let newLetter = toCharArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ")[ind + 1];
            log("Switching to letter: " + newLetter);
            switchToLetter(newLetter);
        }
    }
};



// event listers

document.addEventListener("DOMContentLoaded", function(){

    //add the letters to the menu bar
    setSettings();
    container = document.getElementById("listings");
    if (lettersDiv != null){
        let letters = document.getElementById("letters");
        letters.innerHTML = ""
        letters.appendChild(lettersDiv);
        onLoaded = true // createLetters has completed
    } else {
        onLoaded = false // createLetters has not completed yet
    }

    if (window.location.hash == "" || !toCharArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ").includes(window.location.hash.toUpperCase())){
        switchToLetter("A") // First letter
    } else if (toCharArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ").includes(window.location.hash.toUpperCase())){
        switchToLetter(window.location.hash.toUpperCase())
    }
});

document.addEventListener("keyup", function(event){

    if (event.code == "Space") {
        switchToNextLetter();
    }
});

const start = function(){ // entry point
    document.getElementById("start").className += " glideAway"
}



window.addEventListener('resize', setSettings);

preloadMedia();
createLetters();




// Functions for letters

const letterA = function(){
    let auditorium = widgetAnimation(
        "Auditorium",
        "./media/video/AuditoriumCompressed.mp4",
        "The STHS Auditorium is used for many things, such as musical preformances, assemblies, and large exams.",
        "#7ed957",  // Background color
        true,       // Double size
        false       // Video controls
    );

    let assemblies = widgetText(
        "Assemblies",
        "<i>Assembly</i>: a meeting of a student body and usually faculty for administrative, educational, or recreational purposes.<br><br>Assemblies are held most of the time on fridays, although they can also be run during other days of the week.",
        "#cb6ce6",             // Background color
        false,                 // Double size
        2
    );

    let aBlock = widgetAnimation(
        "A Block",
        "./media/video/A-BlockCompressed.mp4",
        "A Block is the main building, housing rooms 1-20, including science, English, mathematics, and history classrooms.",
        "#ffbd59",  // Background color
        true,       // Double size
        false       // Video controls
    );
    
    let atomi = widgetText(
        "Atomi",
        "<b>What is atomi for?</b><br>Atomi's primary use is for study, where for each subject, you have a section for it with lessons in it.<br><br><b>Is it mandatory?</b><br>No mostly. Whilst Atomi is an optional study resource, a teacher will sometimes assign parts of it as homework or classwork.",
        "#38b6ff",             // Background color
        false,                 // Double size
        2
    );


    empty();
    container.appendChild(assemblies);
    container.appendChild(auditorium);
    container.appendChild(aBlock);
    container.appendChild(atomi);
    
}


const letterB = function(){
    let byod = widgetText(
        "BYOD",
        "The Bring Your Own Device (BYOD) program at Sydney Technical High School lets students bring their laptops or tablets to school. This helps enhance their learning and develop digital skills. The school ensures a secure network for the effective use of these devices.",
        "#38b6ff",             // Background color
        true,                 // Double size
        2
    );

    let assemblies = widgetText(
        "Assemblies",
        "<i>Assembly</i>: a meeting of a student body and usually faculty for administrative, educational, or recreational purposes.<br><br>Assemblies are held most of the time on fridays, although they can also be run during other days of the week.",
        "#cb6ce6",             // Background color
        false,                 // Double size
        2
    );

    let aBlock = widgetAnimation(
        "A Block",
        "./media/video/A-BlockCompressed.mp4",
        "A Block is the main building, housing rooms 1-20, including science, English, mathematics, and history classrooms.",
        "#ffbd59",  // Background color
        true,       // Double size
        false       // Video controls
    );
    
    let atomi = widgetText(
        "Atomi",
        "<b>What is atomi for?</b><br>Atomi's primary use is for study, where for each subject, you have a section for it with lessons in it.<br><br><b>Is it mandatory?</b><br>No mostly. Whilst Atomi is an optional study resource, a teacher will sometimes assign parts of it as homework or classwork.",
        "#38b6ff",             // Background color
        false,                 // Double size
        2
    );
    empty();
    container.appendChild(byod);
}