async function load_list() 
{
    const container = document.getElementById('elixir_container');
    container.innerHTML = '<div class="loading"> Подождите! Загружаем... </div>';

    const response = await fetch('https://wizard-world-api.herokuapp.com/Elixirs');
    const elixirs = await response.json();

    show_elixirs(elixirs);
}

function search() 
{
    const api_text = document.getElementById('search_input').value.toLowerCase();
    const container = document.getElementById('elixir_container');

    container.innerHTML = '<div class="loading">Поиск эликсиров...</div>'

    fetch('https://wizard-world-api.herokuapp.com/Elixirs')
        .then(response => response.json())
        .then(elixirs => {
            const found_elixirs = elixirs.filter(elixir =>
                elixir.name.toLowerCase().includes(api_text)
            );

            if (found_elixirs.length === 0) 
            {
                container.innerHTML = `<div class="no_elixir">Эликсир не найден</div>`;
            }
            else
            {
                show_elixirs(found_elixirs);
            }
        })
}

function show_elixirs(elixirs) 
{
    const container = document.getElementById('elixir_container');
    let html = '';

    elixirs.forEach(elixir => {
        html += `
            <div class="elixir_card">
                <h2 class="elixir_name">${elixir.name || 'Неизвестно'}</h2>
                <p><strong>Побочные эффекты: </strong>${elixir.sideEffects || 'Неизвестно'}</p>
                <p><strong>Сложность приготовления: </strong>${elixir.difficulty || 'Неизвестно'}</p>
                <p><strong>Время приготовления: </strong>${elixir.time || 'Неизвестно'}</p>

                <p><strong>Ингредиенты: </strong></p>
                <ul>
                    ${elixir.ingredients && elixir.ingredients.length > 0 
                        ? elixir.ingredients.map(ingredient => `<li>${ingredient.name || 'Неизвестный ингредиент'}</li>`).join('')
                        : '<li>Не указаны</li>'
                    }
                </ul>
            </div>
        `;
    });

    container.innerHTML = html;
}

function key_press(event)
{
    if(event.key === 'Enter')
    {
        search();
    }
}


document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("find_all").addEventListener('click',load_list);
    document.getElementById("search_wizard").addEventListener('click',search);
    document.getElementById("search_input").addEventListener('keypress',key_press);
})
