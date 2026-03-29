// Globale variabler
let currentTab = 'all';
let currentSort = 'name';
let currentSearch = '';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let chart = null;

// DOM elementer
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const citiesGrid = document.getElementById('citiesGrid');
const tabButtons = document.querySelectorAll('.tab-btn');
const chartCanvas = document.getElementById('priceChart');

// Event listeners
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase();
    renderCities();
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCities();
});

tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tabButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTab = e.target.dataset.tab;
        renderCities();
    });
});

// Filtrer og sorter byer
function getFilteredCities() {
    let filtered = citiesData;

    // Søgning
    if (currentSearch) {
        filtered = filtered.filter(city =>
            city.name.toLowerCase().includes(currentSearch)
        );
    }

    // Favoritter filter
    if (currentTab === 'favorites') {
        filtered = filtered.filter(city => favorites.includes(city.id));
    }

    // Sortering
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            default:
                return 0;
        }
    });

    return filtered;
}

// Tegn kort
function renderCities() {
    const filtered = getFilteredCities();

    if (filtered.length === 0) {
        citiesGrid.innerHTML = '<div class="no-results">Ingen byer fundet...</div>';
        updateChart([]);
        return;
    }

    citiesGrid.innerHTML = filtered.map(city => `
        <div class="city-card">
            <div class="city-header">
                <span class="city-name">${city.name}</span>
                <button class="favorite-btn ${favorites.includes(city.id) ? 'favorited' : ''}"
                        onclick="toggleFavorite(${city.id})">
                    ${favorites.includes(city.id) ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="city-info">
                <div class="price">${city.price.toLocaleString('da-DK')} DKK</div>
                <div class="price-label">Gennemsnitspris</div>
            </div>
            <div class="city-details">
                <div class="detail">
                    <span class="detail-label">Region</span>
                    <span>${city.region}</span>
                </div>
                <div class="detail">
                    <span class="detail-label">Skoler</span>
                    <span>${city.schools}</span>
                </div>
                <div class="detail">
                    <span class="detail-label">Rating</span>
                    <span>⭐ ${city.avgRating}</span>
                </div>
            </div>
        </div>
    `).join('');

    updateChart(filtered);
}

// Toggle favorit
function toggleFavorite(cityId) {
    const index = favorites.indexOf(cityId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(cityId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderCities();
}

// Opdater diagram
function updateChart(data) {
    if (data.length === 0) {
        if (chart) {
            chart.destroy();
            chart = null;
        }
        return;
    }

    const chartData = {
        labels: data.map(city => city.name),
        datasets: [{
            label: 'Pris (DKK)',
            data: data.map(city => city.price),
            backgroundColor: 'rgba(102, 126, 234, 0.6)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2,
            borderRadius: 5
        }]
    };

    const ctx = chartCanvas.getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: data.length > 8 ? 'y' : 'x',
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('da-DK') + ' DKK';
                        }
                    }
                },
                x: {
                    ticks: {
                        autoSkipPadding: 20
                    }
                }
            }
        }
    });
}

// Initialiser app
renderCities();
