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
const galleryModal = document.getElementById("gallery-display-modal");
const closeBtn = document.querySelector(".close-btn-gallery");
const prevBtn = document.querySelector(".prev-btn-gallery");
const nextBtn = document.querySelector(".next-btn-gallery");
const modalImage = document.querySelector(".modal-image");
const modalTitle = document.querySelector(".modal-title-gallery");
const modalCount = document.querySelector(".modal-count-gallery");

let images = [];
let imageTitles = [];
let currentIndex = 0;

// Fetch the image data from the text file
fetch('image-titles.txt')
    .then(response => response.text())
    .then(data => {
        const lines = data.trim().split('\n');
        lines.forEach(line => {
            const [filename, title] = line.split('-'); // Split line by delimiter
            images.push(`travel-images/${filename.trim()}`);
            imageTitles.push(title.trim());
        });
        updateGalleryView(); // Initialize gallery view
    })
    .catch(error => console.error('Error loading image titles:', error));

// Function to update the gallery view based on current index
function updateGalleryView() {
    modalImage.src = images[currentIndex];
    modalTitle.textContent = imageTitles[currentIndex];
    modalCount.textContent = `${currentIndex + 1} / ${images.length}`;

    // Enable/disable navigation buttons at boundaries
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === images.length - 1;

    // Styling for disabled buttons
    prevBtn.style.opacity = currentIndex === 0 ? 0.5 : 1;
    nextBtn.style.opacity = currentIndex === images.length - 1 ? 0.5 : 1;
}

// Event listener for Next button
nextBtn.addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateGalleryView();
    }
});

// Event listener for Previous button
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateGalleryView();
    }
});

// Event listener to close the gallery modal
closeBtn.addEventListener('click', () => {
    galleryModal.style.display = 'none';
    document.body.classList.remove("no-scroll");
    currentIndex = 0;
});

// Event listener to open the gallery modal
document.querySelector('.image-overlay span').addEventListener('click', () => {
    galleryModal.style.display = 'block';
    document.body.classList.add("no-scroll");
    updateGalleryView();
});

//==============================================SAVE FUNCTION==============================================

//===============================================Share FUNCTION===========================================

//==============================================TRAVELLER SECTION=============================================
// Selecting the elements
const travelersInputField = document.querySelector('.travelers-input');
const bookingModal = document.getElementById('booking-modal');
const closeBtnBooking = document.querySelector('.close-btn-booking');
const doneBtnBooking = document.querySelector('.modal-btn-booking');
const adultsInput = document.getElementById('adults-booking');
const childrenInput = document.getElementById('children-booking');
const decrementBtns = document.querySelectorAll('.decrement-btn-booking');
const incrementBtns = document.querySelectorAll('.increment-btn-booking');

// Function to smoothly show the modal
function openModal() {
    bookingModal.style.display = 'block';
    setTimeout(() => {
        bookingModal.classList.add('show'); // Smooth fade-in effect
        updateButtonStates(); // Check button states on open
    }, 10);
}

// Function to smoothly hide the modal
function closeModal() {
    bookingModal.classList.remove('show'); // Smooth fade-out effect
    setTimeout(() => {
        bookingModal.style.display = 'none';
    }, 300); // Delay to match the CSS transition duration
}

// Event listener to open the modal on traveler input click
travelersInputField.addEventListener('click', openModal);

// Event listener to close the modal on close button click
closeBtnBooking.addEventListener('click', closeModal);

// Update button states based on input values
function updateButtonStates() {
    // For adults
    incrementBtns[0].disabled = parseInt(adultsInput.value) >= parseInt(adultsInput.max);
    decrementBtns[0].disabled = parseInt(adultsInput.value) <= parseInt(adultsInput.min);

    // For children
    incrementBtns[1].disabled = parseInt(childrenInput.value) >= parseInt(childrenInput.max);
    decrementBtns[1].disabled = parseInt(childrenInput.value) <= parseInt(childrenInput.min);

    // Style the buttons when disabled
    incrementBtns.forEach(btn => {
        btn.style.opacity = btn.disabled ? '0.5' : '1';
        btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
    });
    decrementBtns.forEach(btn => {
        btn.style.opacity = btn.disabled ? '0.5' : '1';
        btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
    });
}

// Event listener for increment and decrement buttons
incrementBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        const inputField = event.target.closest('.travelers-input-booking').querySelector('input[type="number"]');
        const max = parseInt(inputField.getAttribute('max'));
        if (parseInt(inputField.value) < max) {
            inputField.value = parseInt(inputField.value) + 1;
            updateButtonStates(); // Update button states after increment
        }
    });
});

decrementBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        const inputField = event.target.closest('.travelers-input-booking').querySelector('input[type="number"]');
        const min = parseInt(inputField.getAttribute('min'));
        if (parseInt(inputField.value) > min) {
            inputField.value = parseInt(inputField.value) - 1;
            updateButtonStates(); // Update button states after decrement
        }
    });
});

// Event listener for Done button to update travelers field and close modal
doneBtnBooking.addEventListener('click', () => {
    const totalTravelers = parseInt(adultsInput.value) + parseInt(childrenInput.value);
    travelersInputField.querySelector('.date-value').textContent = `${totalTravelers} traveler${totalTravelers > 1 ? 's' : ''}`;
    closeModal();
});

//==============================================CALLENDER OPTIONAL=============================================