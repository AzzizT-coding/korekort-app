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

// Beregn laveste pris for en by
function getLowestPrice(city) {
    if (!city.schools || city.schools.length === 0) return Infinity;
    const prices = city.schools.map(s => s.price).filter(p => p !== null);
    return prices.length > 0 ? Math.min(...prices) : Infinity;
}

// Beregn gennemsnitspris for en by
function getAveragePrice(city) {
    if (!city.schools || city.schools.length === 0) return 0;
    const prices = city.schools.map(s => s.price).filter(p => p !== null);
    if (prices.length === 0) return 0;
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
}

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
                return getLowestPrice(a) - getLowestPrice(b);
            case 'price-desc':
                return getLowestPrice(b) - getLowestPrice(a);
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
        <div class="city-card" onclick="showDetails(${city.id}); return false;">
            <div class="city-header">
                <span class="city-name">${city.name}</span>
                <button class="favorite-btn ${favorites.includes(city.id) ? 'favorited' : ''}"
                        onclick="event.stopPropagation(); toggleFavorite(${city.id}); return false;">
                    ${favorites.includes(city.id) ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="city-info">
                <div class="price">${getAveragePrice(city).toLocaleString('da-DK')} DKK</div>
                <div class="price-label">Gennemsnitspris</div>
            </div>
            <div class="city-details">
                <div class="detail">
                    <span class="detail-label">Region</span>
                    <span>${city.region}</span>
                </div>
                <div class="detail">
                    <span class="detail-label">Skoler</span>
                    <span>${city.schools.length}</span>
                </div>
                <div class="detail">
                    <span class="detail-label">Laveste pris</span>
                    <span>${getLowestPrice(city) === Infinity ? 'N/A' : getLowestPrice(city).toLocaleString('da-DK') + ' DKK'}</span>
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
            label: 'Laveste pris (DKK)',
            data: data.map(city => getLowestPrice(city)),
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

// Vis detaljer modal
function showDetails(cityId) {
    console.log('showDetails kaldt med cityId:', cityId);
    const city = citiesData.find(c => c.id === cityId);
    console.log('By fundet:', city);
    
    if (!city) {
        console.error('By ikke fundet');
        return;
    }

    const modal = document.getElementById('detailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const schoolsList = document.getElementById('schoolsList');

    console.log('Modal element:', modal);

    modalTitle.textContent = `${city.name} - Kørekortsskoler`;

    schoolsList.innerHTML = city.schools.map(school => `
        <div class="school-item">
            <div>
                <div class="school-name">${school.name}</div>
                <div class="school-rating">⭐ ${school.rating}</div>
            </div>
            <div class="school-price ${school.price === null ? 'no-price' : ''}">
                ${school.price === null ? 'Ring for pris' : school.price.toLocaleString('da-DK') + ' DKK'}
            </div>
        </div>
    `).join('');

    modal.classList.add('active');
    console.log('Modal classe ændret');
}

// Luk modal
function closeModal() {
    const modal = document.getElementById('detailsModal');
    modal.classList.remove('active');
}

// Luk modal ved klik uden for indhold
window.onclick = function(event) {
    const modal = document.getElementById('detailsModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialiser app
renderCities();
