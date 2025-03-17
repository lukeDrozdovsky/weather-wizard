// Funkcja pobierająca listę miast z serwera
async function fetchCities(query) {
    const response = await fetch(`/search-city?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data; // zakładamy, że data to tablica miast
}

  // Wywoływana przy wpisywaniu tekstu
async function onCityInput(e) {
    const query = e.target.value;
    if(query.length < 3) { // minimalna liczba znaków
      document.getElementById("suggestions").innerHTML = "";
      return;
    }
    const cities = await fetchCities(query);
    let suggestionsHTML = "";
    cities.forEach(city => {
      suggestionsHTML += `<li onclick="selectCity('${city.name}', ${city.latitude}, ${city.longitude})">
                            ${city.name}
                            </li>`;
    });
    document.getElementById("suggestions").innerHTML = suggestionsHTML;
}

// Funkcja obsługująca wybór miasta ze sugestii
function selectCity(name, latitude, longitude) {
    document.getElementById("city-input").value = name;
    document.getElementById("latitude").value = latitude;
    document.getElementById("longitude").value = longitude;
    // Ukryj listę sugestii
    document.getElementById("suggestions").innerHTML = "";
}