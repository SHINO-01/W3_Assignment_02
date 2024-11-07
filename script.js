//=====================================LOCATION MODAL====================================================
document.getElementById("country-name").addEventListener("click", function () {
    document.getElementById("display-settings-modal").style.display = "block";
    document.body.classList.add("no-scroll"); // Disable background scroll
    loadCountries();
});

document.querySelector(".save-button-loc").addEventListener("click", function () {
    const countrySelect = document.getElementById("region");
    const selectedCountry = countrySelect.options[countrySelect.selectedIndex].text;
    const selectedCurrency = countrySelect.value;

    document.getElementById("country-name").textContent = selectedCountry;

    // Save the selected country and currency to localStorage
    localStorage.setItem("selectedCountry", selectedCountry);
    localStorage.setItem("selectedCurrency", selectedCurrency);

    // Close the modal after saving
    document.getElementById("display-settings-modal").style.display = "none";
    document.body.classList.remove("no-scroll");
});

// Load countries and currencies dynamically from the text file
async function loadCountries() {
    try {
        const response = await fetch('countries.txt');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const text = await response.text();
        const countryCurrencyData = parseCountryCurrencyData(text);

        const countrySelect = document.getElementById("region");
        const currencySelect = document.getElementById("currency");

        // Clear previous options
        countrySelect.innerHTML = '';
        currencySelect.innerHTML = '';
        currencySelect.disabled = true;

        // Populate country dropdown
        countryCurrencyData.forEach(({ country, currency }) => {
            const option = document.createElement("option");
            option.value = currency;
            option.textContent = country;
            countrySelect.appendChild(option);
        });

        // Set initial region and currency based on saved values or header default
        const selectedCountryName = localStorage.getItem("selectedCountry") || document.getElementById('country-name').textContent;
        const selectedCurrency = getCurrencyByCountry(selectedCountryName, countryCurrencyData);

        if (selectedCurrency) {
            updateCurrency(selectedCurrency);
            countrySelect.value = selectedCurrency;
        }

        countrySelect.addEventListener("change", function () {
            const selectedCountry = countrySelect.options[countrySelect.selectedIndex].text;
            const selectedCurrency = countrySelect.value;

            document.getElementById("currency").innerHTML = `<option value="${selectedCurrency}">${selectedCurrency}</option>`;
        });
    } catch (error) {
        console.error('There was an error fetching the countries:', error);
    }
}

function parseCountryCurrencyData(text) {
    const lines = text.trim().split('\n');
    return lines.map(line => {
        const [country, currency] = line.split(':');
        return { country, currency };
    });
}

function getCurrencyByCountry(countryName, countryCurrencyData) {
    const countryData = countryCurrencyData.find(item => item.country === countryName);
    return countryData ? countryData.currency : null;
}

function updateCurrency(currency) {
    const currencySelect = document.getElementById("currency");
    currencySelect.innerHTML = `<option value="${currency}">${currency}</option>`;
}

// Close the modal
document.querySelector(".close-button-loc").addEventListener("click", function () {
    document.getElementById("display-settings-modal").style.display = "none";
    document.body.classList.remove("no-scroll");
});

window.addEventListener("load", function () {
    localStorage.clear();
});
//==============================================Gallery MODAL===========================================================

//==============================================