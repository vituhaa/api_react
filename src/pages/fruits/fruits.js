const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const BASE_URL = 'https://www.fruityvice.com/api/fruit';

async function load_list() {
    const container = document.getElementById('fruit_container');
    container.innerHTML = '<div class="loading"> Loading... </div>';

    try {
        const url = PROXY_URL + encodeURIComponent(BASE_URL + '/all');
        const response = await fetch(url);
        const fruits = await response.json();
        
        show_fruits(fruits);
    } catch (error) {
        container.innerHTML = `<div class="error">Loading error: ${error.message}</div>`;
    }
}

function search_fruits() {
    const searchText = document.getElementById('search_input').value.toLowerCase();
    const container = document.getElementById('fruit_container');

    container.innerHTML = '<div class="loading">Loading...</div>';

    const url = PROXY_URL + encodeURIComponent(BASE_URL + '/all');
    
    fetch(url)
        .then(response => response.json())
        .then(fruits => {
            const found_fruits = fruits.filter(fruit =>
                fruit.name.toLowerCase().includes(searchText)
            );

            if (found_fruits.length === 0) {
                container.innerHTML = `<div class="error">No such fruit</div>`;
            } else {
                show_fruits(found_fruits);
            }
        })
        .catch(error => {
            container.innerHTML = `<div class="error">Loading error: ${error.message}</div>`;
        });
}

function show_fruits(fruits) {
    const container = document.getElementById('fruit_container');
    let html = '';

    fruits.forEach(fruit => {
        const nutrition = fruit.nutritions || {};
        
        html += `
            <div class="fruit_card">
                <h2 class="fruit_name">${fruit.name || 'Unknown'}</h2>
                <p><strong>Family: </strong>${fruit.family || 'Unknown'}</p>
                <p><strong>Genus: </strong>${fruit.genus || 'Unknown'}</p>
                <p><strong>Order: </strong>${fruit.order || 'Unknown'}</p>
                <p><strong>Calories: </strong>${nutrition.calories || 'Unknown'}</p>
                <p><strong>Carpohydrates: </strong>${nutrition.carbohydrates || 'Unknown'}</p>
                <p><strong>Proteins: </strong>${nutrition.protein || 'Unknown'}</p>
                <p><strong>Fats: </strong>${nutrition.fat || 'Unknown'}</p>
                <p><strong>Sugar: </strong>${nutrition.sugar || 'Unknown'}</p>
            </div>
        `;
    });

    container.innerHTML = html;
}

function key_press(event) {
    if (event.key === 'Enter') {
        search_fruits;
    }
}

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("allFruits").addEventListener('click',load_list);
    document.getElementById("searchFruit").addEventListener('click',search_fruits);
    document.getElementById("search_input").addEventListener('keypress',key_press);
})