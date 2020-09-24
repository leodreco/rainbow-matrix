// Customizable
var defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%'.split('');
var fontSize = 12;
var columnSeparation = 1;
var fontColor = '#0F0';
var color = '#0F0';
var fontFamily = 'monospace';

var rgb = [];
var rainbow = false;
var rainbowInterval;

var extraChars = [];
var chars = defaultChars;
var speed = 5 || 35;

const canvas = document.querySelector('canvas');
const height = window.innerHeight;
const width = window.innerWidth;
canvas.height = height;
canvas.width = width;
var columns = parseInt(width / (fontSize + columnSeparation));
var drops = new Array(columns).fill(1000);
const c2d = canvas.getContext('2d');
var interval = undefined;

window.wallpaperPropertyListener = {
    applyUserProperties: setProperties
};

start();

function start(){
    interval = setInterval(draw, speed);
}

function restart(){
    clearInterval(interval);
    interval = setInterval(draw, speed);
}

function draw(){
    c2d.fillStyle = 'rgba(0, 0, 0, .04)';
    c2d.fillRect(0, 0, width, height);
    c2d.fillStyle = color;
    c2d.font = `${fontSize}px '${fontFamily}'`;

    for(let [i, number] of drops.entries()){
        let char = chars[Math.floor(Math.random() * chars.length)];
        c2d.fillText(char, i * (fontSize + columnSeparation), number * fontSize);

        if( number * fontSize > height && Math.random() > 0.975 )
            drops[i] = 0;

        drops[i]++;
    }
}

function rainbowFunction(){
    // subir verde
    if(rgb[0] == 12 && rgb[1] < 12 && rgb[2] == 0){
        rgb[1]++;
        if(rgb[1] == 12){
            rgb[0]--;
        }
    }
    //bajar rojo
    else if(rgb[0] < 12 && rgb[1] == 12 && rgb[2] == 0){
        rgb[0]--;
        if(rgb[0] == 0){
            rgb[2]++;
        }
    }

    //subir azul
    else if(rgb[0] == 0 && rgb[1] == 12 && rgb[2] < 12){
        rgb[2]++;
        if(rgb[2] == 12){
            rgb[1]--;
        }
    }

    //bajar verde
    else if(rgb[0] == 0 && rgb[1] < 12 && rgb[2] == 12){
        rgb[1]--;
        if(rgb[1] == 0){
            rgb[0]++;
        }
    }

    // subir rojo
    else if(rgb[0] < 12 && rgb[1] == 0 && rgb[2] == 12){
        rgb[0]++;
        if(rgb[0] == 12){
            rgb[2]--;
        }
    }

    // bajar azul
    else if(rgb[0] == 12 && rgb[1] == 0 && rgb[2] > 0){
        rgb[2]--;
        if(rgb[2] == 0){
            rgb[1]++;
        }
    }

    color = '#' + componentToHex(parseInt(rgb[0] * 20)) + componentToHex(parseInt(rgb[1] * 20)) + componentToHex(parseInt(rgb[2] * 20));
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function setProperties(properties) {

    if(properties.fontsize != undefined 
    && fontSize != properties.fontsize.value) {
        fontSize = properties.fontsize.value;
        columns = parseInt(width / (fontSize + columnSeparation));
        drops = new Array(columns).fill(1000);
    }

    if(properties.fontfamily != undefined){
        fontFamily = properties.fontfamily.value;
    }

    if(properties.space != undefined
    && columnSeparation != properties.space.value) {
        columnSeparation = properties.space.value;
        columns = parseInt(width / (fontSize + columnSeparation));
        drops = new Array(columns).fill(1000);
    }

    if(properties.schemecolor != undefined){
        let [r, g, b] = properties.schemecolor.value.split(' ');
        
        r = Math.floor(parseFloat(r) * 255);
        g = Math.floor(parseFloat(g) * 255);
        b = Math.floor(parseFloat(b) * 255);
        
        fontColor = '#' + componentToHex(parseInt(r)) + componentToHex(parseInt(g)) + componentToHex(parseInt(b));
        color = fontColor;
    }

    if(properties.speed != undefined){
        speed = 36 - properties.speed.value;
        if(interval != undefined){
            restart();
        };
    }

    if(properties.rainbow != undefined
    && rainbow != properties.rainbow.value){
        rainbow = properties.rainbow.value;
        if(rainbow){
            rgb = [12, 0, 0];
            rainbowInterval = setInterval(rainbowFunction, 100);
        }else if(!rainbow && rainbowInterval != undefined){
            clearInterval(rainbowInterval);
            color = fontColor;
        }
    }

    chars = defaultChars;
    if(properties.characters != undefined
    && extraChars.join('') !=  properties.characters.value){
        extraChars = properties.characters.value.replace(/ /g,'').split('');
        chars = defaultChars.concat(extraChars);
    }

}
