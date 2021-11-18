import { fetchData } from './fetch.js';

// Need to use the limit in the URL, for the first generation
const firstGenerationPokeURL = 'https://pokeapi.co/api/v2/pokemon?limit=151';

// Get stats for all characters
// function characterDetails(url) {
//     const newArray = [];
//     return fetchData(url)
//         .then(async (data) => {
//             const keys = Object.keys(data.results);
//             for (const item of keys) {
//                 await fetchData(data.results[item].url).then((el) => {
//                     const single = {
//                         name: el.name,
//                         height: el.height / 10, // In meters
//                         weight: el.weight / 10, // in KG
//                     };
//                     newArray.push(single);
//                 });
//             }
//             return newArray;
//         })
//         .catch((err) => console.log(err));
// }

// Refactor:
function characterDetails(url) {
    const newArray = [];
    const promises = [];
    return fetchData(url)
        .then((data) => {
            const keys = Object.keys(data.results);
            for (const item of keys) {
                const p = fetchData(data.results[item].url).then((el) => {
                    const single = {
                        name: el.name,
                        height: el.height / 10, // In meters
                        weight: el.weight / 10, // in KG
                    };
                    newArray.push(single);
                });
                promises.push(p);
            }
            Promise.all(promises).catch((err) => console.log(err)); // Wait for all promises to complete if one fails, the whole promise fails
            return newArray;
        })
        .catch((err) => console.log(err));
}

function getSingleCharacter(array, characterName) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
        if (characterName === `${array[i].name}`) {
            result.push(array[i]);
        }
    }
    return result;
}

console.log(getSingleCharacter(await characterDetails(firstGenerationPokeURL), 'pikachu'));

export { characterDetails, getSingleCharacter };
