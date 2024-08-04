import { get, writable } from "svelte/store";
import { browser } from '$app/environment';

export const user_data = writable(undefined);
export const token_data = writable(undefined);
export const backend_adress = import.meta.env.VITE_BACKEND_ADDRESS;
export const site_adress =  import.meta.env.BASE_URL;
console.log(backend_adress)
export const target_image = writable(undefined)

user_data.subscribe(async (value) => {
    if(value != undefined && value.permissions == undefined)user_data.set(undefined);
    if (browser && value != undefined)  
        localStorage.setItem("user_data", JSON.stringify(value));
});
token_data.subscribe(async (value) => { 
    if (browser && value != undefined) {
        const spworlds_data_fetch = await fetch(backend_adress + "/user_data?token=" + value.access_token).then((response) => {if(response.ok)return response.json();else return null;}); 
        user_data.set(spworlds_data_fetch);
        localStorage.setItem("token_data", JSON.stringify(value));
    }


});
if (browser) {
    user_data.set(JSON.parse(localStorage.getItem("user_data")));
    token_data.set(JSON.parse(localStorage.getItem("token_data"))); 
}
 