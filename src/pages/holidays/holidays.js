// все страны
const countries = {
    'AD': 'Андорра','AL': 'Албания','AM': 'Армения','AR': 'Аргентина','AT': 'Австрия','AU': 'Австралия',
    'AX': 'Аландские острова','BA': 'Босния и Герцеговина','BB': 'Барбадос','BE': 'Бельгия','BG': 'Болгария',
    'BJ': 'Бенин','BO': 'Боливия','BR': 'Бразилия','BS': 'Багамы','BW': 'Ботсвана','BY': 'Беларусь','BZ': 'Белиз',
    'CA': 'Канада','CD': 'ДР Конго','CG': 'Конго','CH': 'Швейцария','CL': 'Чили','CN': 'Китай','CO': 'Колумбия',
    'CR': 'Коста-Рика','CU': 'Куба','CY': 'Кипр','CZ': 'Чехия','DE': 'Германия','DK': 'Дания','DO': 'Доминиканская Республика',
    'EC': 'Эквадор','EE': 'Эстония','EG': 'Египет','ES': 'Испания','FI': 'Финляндия','FO': 'Фарерские острова',
    'FR': 'Франция','GA': 'Габон','GB': 'Великобритания','GD': 'Гренада','GE': 'Грузия','GG': 'Гернси','GI': 'Гибралтар',
    'GL': 'Гренландия','GM': 'Гамбия','GR': 'Греция','GT': 'Гватемала','GY': 'Гайана','HK': 'Гонконг','HN': 'Гондурас',
    'HR': 'Хорватия','HT': 'Гаити','HU': 'Венгрия','ID': 'Индонезия','IE': 'Ирландия','IM': 'Остров Мэн','IS': 'Исландия',
    'IT': 'Италия','JE': 'Джерси','JM': 'Ямайка','JP': 'Япония','KE': 'Кения','KR': 'Южная Корея','KZ': 'Казахстан',
    'LI': 'Лихтенштейн','LS': 'Лесото','LT': 'Литва','LU': 'Люксембург','LV': 'Латвия','MA': 'Марокко','MC': 'Монако',
    'MD': 'Молдова','ME': 'Черногория','MG': 'Мадагаскар','MK': 'Северная Македония','MN': 'Монголия','MS': 'Монтсеррат',
    'MT': 'Мальта','MX': 'Мексика','MZ': 'Мозамбик','NA': 'Намибия','NE': 'Нигер','NG': 'Нигерия','NI': 'Никарагуа',
    'NL': 'Нидерланды','NO': 'Норвегия','NZ': 'Новая Зеландия','PA': 'Панама','PE': 'Перу','PG': 'Папуа-Новая Гвинея',
    'PH': 'Филиппины','PL': 'Польша','PR': 'Пуэрто-Рико','PT': 'Португалия','PY': 'Парагвай','RO': 'Румыния','RS': 'Сербия',
    'RU': 'Россия','SE': 'Швеция','SG': 'Сингапур','SI': 'Словения','SJ': 'Шпицберген и Ян-Майен','SK': 'Словакия',
    'SM': 'Сан-Марино','SR': 'Суринам','SV': 'Сальвадор','TN': 'Тунис','TR': 'Турция','UA': 'Украина','US': 'США',
    'UY': 'Уругвай','VA': 'Ватикан','VE': 'Венесуэла','VN': 'Вьетнам','ZA': 'Южная Африка','ZW': 'Зимбабве'
};

const API_BASE = 'https://date.nager.at/api/v3';

async function getHolidays(year, countryCode) {
    try {
        const response = await fetch(`${API_BASE}/PublicHolidays/${year}/${countryCode}`);
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении праздников:', error);
        throw error;
    }
}

function formatDate(dateString) {
    // перевод даты
    const [y,m,d] = dateString.split('-');
    const date = new Date(`${y}-${m}-${d}T00:00:00`);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function displayHolidays(holidays, containerId, showCountry = true) {
    const container = document.getElementById(containerId);
    if (!holidays || holidays.length === 0) {
        container.innerHTML = '<div class="no-holidays">Праздники не найдены. Но это не повод грустить :)</div>';
        return;
    }

    let html = '';
    holidays.forEach(holiday => {
        const types = Array.isArray(holiday.types) ? holiday.types.join(', ') : (holiday.types || '');
        html += `
            <div class="holiday-item">
                <div class="holiday-name">${holiday.localName || holiday.name}</div>
                <div class="holiday-details">
                    ${showCountry ? `<span class="holiday-country">${countries[holiday.countryCode] || holiday.countryCode}</span>` : ''}
                    <span class="holiday-types">${types}</span>
                </div>
                ${holiday.name && holiday.name !== holiday.localName ? `<div class="holiday-details">${holiday.name}</div>` : ''}
                <div class="holiday-details">Дата: ${formatDate(holiday.date)}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function displayError(message, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="error">${message}</div>`;
}
// праздники сегодня в России
async function loadTodayHolidays() {
    const today = new Date();
    const todayDate = document.getElementById('today-date');
    const todayContainer = document.getElementById('today-holidays');
    const loadingElement = document.getElementById('today-loading');

    const todayStr = today.toISOString().split('T')[0];
    todayDate.textContent = formatDate(todayStr);

    try {
        const year = today.getFullYear();
        const holidays = await getHolidays(year, 'RU'); // можно расширить
        const todayHolidays = holidays.filter(h => h.date === todayStr);

        loadingElement.style.display = 'none';
        displayHolidays(todayHolidays, 'today-holidays', false);
    } catch (error) {
        loadingElement.style.display = 'none';
        displayError('Не удалось загрузить праздники на сегодня', 'today-holidays');
    }
}

async function searchHolidays() {
    const dateInput = document.getElementById('holiday-date');
    const resultsContainer = document.getElementById('search-results');
    const loadingElement = document.getElementById('search-loading');
    const searchBtn = document.getElementById('search-btn');

    const selectedDate = dateInput.value;
    const checkboxNodeList = document.querySelectorAll('#country-checkboxes input[type="checkbox"]');
    const selectedCountries = Array.from(checkboxNodeList).filter(cb => cb.checked).map(cb => cb.value);

    if (!selectedDate) {
        alert('Пожалуйста, выберите дату');
        return;
    }

    if (selectedCountries.length === 0) {
        alert('Пожалуйста, выберите хотя бы одну страну');
        return;
    }

    searchBtn.disabled = true;
    loadingElement.style.display = 'block';
    resultsContainer.innerHTML = '';

    const year = selectedDate.split('-')[0];
    let allHolidays = [];

    try {
        const promises = selectedCountries.map(country => getHolidays(year, country));
        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
            const countryCode = selectedCountries[index];
            if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                const countryHolidays = result.value.filter(holiday => holiday.date === selectedDate)
                    .map(h => ({ ...h, countryCode })); 
                allHolidays.push(...countryHolidays);
            } else {
                console.error(`Ошибка для страны ${countryCode}:`, result.reason);
            }
        });

        allHolidays.sort((a, b) => {
            const aName = countries[a.countryCode] || a.countryCode;
            const bName = countries[b.countryCode] || b.countryCode;
            return aName.localeCompare(bName, 'ru');
        });

        loadingElement.style.display = 'none';
        displayHolidays(allHolidays, 'search-results', true);
    } catch (error) {
        loadingElement.style.display = 'none';
        displayError('Произошла ошибка при поиске праздников', 'search-results');
    } finally {
        searchBtn.disabled = false;
    }
}

function renderCountryCheckboxes() {
    const container = document.getElementById('country-checkboxes');
    container.innerHTML = ''; 
    const entries = Object.entries(countries).sort((a, b) => a[1].localeCompare(b[1], 'ru'));

    entries.forEach(([code, name]) => {
        const label = document.createElement('label');
        label.setAttribute('title', name);
        label.innerHTML = `<input type="checkbox" value="${code}"> ${name}`;
        container.appendChild(label);
    });
}

function setDefaultSelections() {
    const checkbox = document.querySelector('#country-checkboxes input[value="RU"]');
    if (checkbox) checkbox.checked = true;
}

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('holiday-date').value = todayStr;

    renderCountryCheckboxes();
    setDefaultSelections();

    document.getElementById('search-btn').addEventListener('click', searchHolidays);

    document.getElementById('holiday-date').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchHolidays();
    });

    const selectAllBtn = document.getElementById('select-all-btn');
    const deselectAllBtn = document.getElementById('deselect-all-btn');

    selectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('#country-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = true);
    });

    deselectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('#country-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
    });

    loadTodayHolidays();
});
