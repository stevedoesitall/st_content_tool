export function get_id(e) { 
    return document.getElementById(e);
};

export function get_class(e) { 
    return document.getElementsByClassName(e);
};

export function qsa(e) {
    return document.querySelectorAll(e);
};

export function qs(e) {
    return document.querySelector(e);
};

export function cl(e) {
    return console.log(e);
};

export function string(e) {
    return JSON.stringify(e);
};

export function parse(e) {
    return JSON.parse(e);
};

export const headers = {
    "Accept" : "application/json",
    "Content-Type": "application/json"
};

export const year = new Date().getFullYear();

const month_ph = new Date().getMonth() + 1;

const day_ph = new Date().getDate();

let month_string = "";

let day_string = "";

switch(month_ph)  {
    case 1: 
    month_string = "01";

    case 2: 
    month_string = "02";

    case 3: 
    month_string = "03";

    case 4: 
    month_string = "04";

    case 5: 
    month_string = "05";

    case 6: 
    month_string = "06";

    case 7: 
    month_string = "07";

    case 6: 
    month_string = "06";

    case 7: 
    month_string = "07";

    case 8: 
    month_string = "08";

    case 9: 
    month_string = "09";
}

if (month_string == "") {
    month_string = month_ph;
}

switch(day_ph)  {
    case 1: 
    day_string = "01";

    case 2: 
    day_string = "02";

    case 3: 
    day_string = "03";

    case 4: 
    day_string = "04";

    case 5: 
    day_string = "05";

    case 6: 
    day_string = "06";

    case 7: 
    day_string = "07";

    case 6: 
    day_string = "06";

    case 7: 
    day_string = "07";

    case 8: 
    day_string = "08";

    case 9: 
    day_string = "09";
}

if (day_string == "") {
    day_string = day_ph;
}

export const month = month_string;

export const day = day_string;

export const date = year + "-" + month + "-" + day;

export const cookie = document.cookie;

export const query_params = window.location.search;;