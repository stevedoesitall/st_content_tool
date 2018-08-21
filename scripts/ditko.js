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

let month_val;

let day_val;

if (month_ph < 10) {
    month_val = "0" + month_ph;
}
else {
    month_val = month_ph;
}

if (day_ph < 10) {
    day_val = "0" + day_ph;
}
else {
    day_val = day_ph;
}

export const month = month_val;

export const day = day_val;

export const date = year + "-" + month + "-" + day;

export const cookie = document.cookie;

export const query_params = window.location.search;;