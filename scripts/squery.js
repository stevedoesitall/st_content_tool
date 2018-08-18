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

export const cookie = document.cookie;

export const query_params = window.location.search;;

const month = new Date().getMonth();

switch (month) {
	case 0:
	export const current_month = "January"
	break;

	case 1:
	export const current_month = "February"
	break;

	case 2:
	export const current_month = "March"
	break;

	case 3:
	export const current_month = "April"
	break;

	case 4:
	export const current_month = "May"
	break;

	case 5:
	export const current_month = "June"
	break;

	case 6:
	export const current_month = "July"
	break;

	case 7:
	export const current_month = "August"
	break;

	case 8:
	export const current_month = "September"
	break;

	case 9:
	export const current_month = "October"
	break;

	case 10:
	export const current_month = "November"
	break;

	case 11:
	export const current_month = "December"
	break;
}