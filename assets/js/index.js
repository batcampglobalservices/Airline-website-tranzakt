// ===== BOOKING FORM FUNCTIONALITY =====

// Tab switching
const flightTab = document.getElementById('flightTab');
const carTab = document.getElementById('carTab');
const flightForm = document.getElementById('flightForm');

if (flightTab && carTab) {
    flightTab.addEventListener('click', () => {
        flightTab.classList.add('active');
        carTab.classList.remove('active');
        flightForm.style.display = 'block';
        // Show flight form (currently only flight form exists)
    });

    carTab.addEventListener('click', () => {
        carTab.classList.add('active');
        flightTab.classList.remove('active');
        alert('Car rental booking coming soon!');
    });
}

// Date validation - Set min date to today
const dateInputs = document.querySelectorAll('input[type="date"]');
const today = new Date().toISOString().split('T')[0];

// Initialize Flatpickr for date inputs with beautiful calendar UI
let departurePicker, returnPicker;

if (dateInputs.length >= 2) {
    // Departure date picker
    departurePicker = flatpickr(dateInputs[0], {
        minDate: "today",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        theme: "light",
        animate: true,
        monthSelectorType: "dropdown",
        showMonths: 1,
        onChange: function(selectedDates, dateStr) {
            // Update return date minimum when departure changes
            if (returnPicker) {
                returnPicker.set('minDate', dateStr);
                
                // Clear return date if it's before new departure date
                const returnDate = returnPicker.selectedDates[0];
                const departureDate = selectedDates[0];
                
                if (returnDate && returnDate < departureDate) {
                    returnPicker.clear();
                }
            }
        },
        onOpen: function(selectedDates, dateStr, instance) {
            instance.calendarContainer.classList.add('flatpickr-slide-in');
        }
    });

    // Return date picker
    returnPicker = flatpickr(dateInputs[1], {
        minDate: "today",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        theme: "light",
        animate: true,
        monthSelectorType: "dropdown",
        showMonths: 1,
        onOpen: function(selectedDates, dateStr, instance) {
            instance.calendarContainer.classList.add('flatpickr-slide-in');
            
            // If departure date is selected, start calendar from that date
            if (departurePicker.selectedDates[0]) {
                instance.jumpToDate(departurePicker.selectedDates[0]);
            }
        }
    });
}

// Trip type handling (Round Trip vs One Way)
const tripTypeRadios = document.querySelectorAll('input[name="trip"]');
const returnDateGroup = document.querySelector('.form-group:has(input[type="date"]:last-child)');

tripTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'one-way' || e.target.nextSibling.textContent.trim() === 'One Way') {
            // Disable return date for one way
            if (returnDateGroup) {
                returnDateGroup.style.opacity = '0.5';
                if (returnPicker) {
                    returnPicker.input.disabled = true;
                    returnPicker.altInput.disabled = true;
                }
            }
        } else {
            // Enable return date for round trip
            if (returnDateGroup) {
                returnDateGroup.style.opacity = '1';
                if (returnPicker) {
                    returnPicker.input.disabled = false;
                    returnPicker.altInput.disabled = false;
                }
            }
        }
    });
});

// Passenger dropdown with realistic options
const passengerSelect = document.querySelector('select[option*="Passengers"]');
if (passengerSelect) {
    passengerSelect.innerHTML = `
        <option value="">Select Passengers</option>
        <option value="1">1 Passenger</option>
        <option value="2">2 Passengers</option>
        <option value="3">3 Passengers</option>
        <option value="4">4 Passengers</option>
        <option value="5">5 Passengers</option>
        <option value="6+">6+ Passengers</option>
    `;
}

// City dropdowns with popular destinations
const citySelects = document.querySelectorAll('.form-group select');
const popularCities = [
    'Select City',
    'New York (JFK)',
    'London (LHR)',
    'Paris (CDG)',
    'Tokyo (NRT)',
    'Dubai (DXB)',
    'Sydney (SYD)',
    'Toronto (YYZ)',
    'Los Angeles (LAX)',
    'Singapore (SIN)',
    'Rome (FCO)',
    'Barcelona (BCN)',
    'Amsterdam (AMS)',
    'Hong Kong (HKG)',
    'Istanbul (IST)',
    'San Francisco (SFO)'
];

citySelects.forEach((select, index) => {
    if (index < 2) { // Only for From and To dropdowns
        select.innerHTML = popularCities.map((city, i) => 
            `<option value="${i === 0 ? '' : city}">${city}</option>`
        ).join('');
    }
});

// Search button functionality
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get form values
        const fromCity = citySelects[0]?.value;
        const toCity = citySelects[1]?.value;
        const departureDate = departureDateInput?.value;
        const returnDate = returnDateInput?.value;
        const passengers = passengerSelect?.value;
        const tripType = document.querySelector('input[name="trip"]:checked');
        
        // Validation
        const errors = [];
        
        if (!fromCity) errors.push('Please select departure city');
        if (!toCity) errors.push('Please select arrival city');
        if (fromCity === toCity && fromCity) errors.push('Departure and arrival cities must be different');
        if (!departureDate) errors.push('Please select departure date');
        if (tripType?.nextSibling.textContent.trim() === 'Round Trip' && !returnDate) {
            errors.push('Please select return date for round trip');
        }
        if (!passengers) errors.push('Please select number of passengers');
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }
        
        // Show loading state
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';
        
        // Simulate search (in real app, this would be an API call)
        setTimeout(() => {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Search Flights';
            
            alert(`Searching flights:\n\nFrom: ${fromCity}\nTo: ${toCity}\nDeparture: ${departureDate}\nReturn: ${returnDate || 'N/A'}\nPassengers: ${passengers}\n\nResults will appear here...`);
        }, 2000);
    });
}

// Swap cities functionality
const fromSelect = citySelects[0];
const toSelect = citySelects[1];

if (fromSelect && toSelect) {
    const swapBtn = document.createElement('button');
    swapBtn.type = 'button';
    swapBtn.className = 'swap-cities-btn';
    swapBtn.innerHTML = '<i class="fa-solid fa-arrow-right-arrow-left"></i>';
    swapBtn.title = 'Swap cities';
    
    // Insert swap button between From and To fields
    fromSelect.closest('.form-group').insertAdjacentElement('afterend', swapBtn);
    
    swapBtn.addEventListener('click', () => {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        
        // Animate the swap
        swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapBtn.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// ===== NAVIGATION TOGGLE =====

const navToggle = document.querySelector(".nav-toggle");
const navGroups = document.querySelector(".nav-groups");

if (navToggle && navGroups) {
    navToggle.addEventListener("click", () => {
        const isOpen = navGroups.classList.toggle("is-open");
        navToggle.classList.toggle("nav-toggle--open", isOpen);
        navToggle.setAttribute("aria-expanded", isOpen);
    });
}