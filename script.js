document.getElementById("country-name").addEventListener("click", function () {
    document.getElementById("display-settings-modal").style.display = "block";
    loadCountries();
});

document.querySelector(".close-button-loc").addEventListener("click", function () {
    document.getElementById("display-settings-modal").style.display = "none";
});

document.querySelector(".save-button-loc").addEventListener("click", function () {
    const selectedCountry = document.getElementById("region").options[document.getElementById("region").selectedIndex].text;
    document.getElementById("country-name").textContent = selectedCountry;
    
    // Close the modal after saving
    document.getElementById("display-settings-modal").style.display = "none";
});

async function loadCountries() {
    const response = await fetch('countries.txt');
    const text = await response.text();
    const lines = text.trim().split('\n');

    const countrySelect = document.getElementById("region");
    const currencySelect = document.getElementById("currency");

    lines.forEach(line => {
        const [country, currency] = line.split(':');
        
        // Create an option element for each country
        const option = document.createElement("option");
        option.value = currency; // set the currency as value
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    // Enable the currency select box when a country is selected
    countrySelect.addEventListener("change", function () {
        const selectedCountry = countrySelect.options[countrySelect.selectedIndex].text;
        const selectedCurrency = countrySelect.value;

        document.getElementById("currency").innerHTML = `<option value="${selectedCurrency}">${selectedCurrency}</option>`;
    });
}
// This function will load countries and currencies dynamically from the text file
async function loadCountries() {
    try {
        // Fetch country and currency data from the text file
        const response = await fetch('countries.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const text = await response.text();
        const countryCurrencyData = parseCountryCurrencyData(text);

        const countrySelect = document.getElementById("region");
        const currencySelect = document.getElementById("currency");

        // Clear previous options (if any)
        countrySelect.innerHTML = '';
        currencySelect.innerHTML = '';
        currencySelect.disabled = true;

        // Populate the country select dropdown with countries
        countryCurrencyData.forEach(({ country, currency }) => {
            const option = document.createElement("option");
            option.value = currency;  // Use currency as value
            option.textContent = country;  // Display country name
            countrySelect.appendChild(option);
        });

        // Set initial region and currency based on the header country
        const selectedCountryName = document.getElementById('country-name').textContent;
        const selectedCurrency = getCurrencyByCountry(selectedCountryName, countryCurrencyData);

        // Set the selected country and currency in the modal
        if (selectedCurrency) {
            updateCurrency(selectedCurrency);
        }

        // Update the currency when a country is selected from the dropdown
        countrySelect.addEventListener("change", function () {
            const selectedCountry = countrySelect.options[countrySelect.selectedIndex].text;
            const selectedCurrency = countrySelect.value;

            document.getElementById("currency").innerHTML = `<option value="${selectedCurrency}">${selectedCurrency}</option>`;
            document.getElementById("currency").disabled = false;

            // Update header country name
            document.getElementById('country-name').textContent = selectedCountry;
        });
    } catch (error) {
        console.error('There was an error fetching the countries:', error);
    }
}

// This function will parse the text content of the file into a usable format
function parseCountryCurrencyData(text) {
    const lines = text.trim().split('\n');
    const countryCurrencyData = lines.map(line => {
        const [country, currency] = line.split(':');
        return { country, currency };
    });
    return countryCurrencyData;
}

// This function dynamically gets the currency based on the selected country
function getCurrencyByCountry(countryName, countryCurrencyData) {
    const countryData = countryCurrencyData.find(item => item.country === countryName);
    return countryData ? countryData.currency : null;  // Return the currency if found, otherwise null
}

// This function updates the currency in the modal
function updateCurrency(currency) {
    const currencySelect = document.getElementById("currency");
    currencySelect.innerHTML = `<option value="${currency}">${currency}</option>`;
    currencySelect.disabled = false;
}

// Open the modal and load the countries and currencies
document.getElementById("country-name").addEventListener("click", function () {
    // Open the modal
    document.getElementById("display-settings-modal").style.display = "block";
    loadCountries();
});

// Close the modal
document.querySelector(".close-button-loc").addEventListener("click", function () {
    document.getElementById("display-settings-modal").style.display = "none";
});
