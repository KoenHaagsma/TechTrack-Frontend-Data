import fetch, { FetchError } from 'node-fetch';

// https://www.javascripttutorial.net/javascript-fetch-api/
async function fetchData(url) {
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

export { fetchData };
