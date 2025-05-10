// Add this to your existing app.js file

// Handle emergency type selection
document.addEventListener('DOMContentLoaded', function() {
    // Get all sections
    const welcomeSection = document.getElementById('welcome-section');
    const emergencyDashboard = document.getElementById('emergency-dashboard');
    const reportForm = document.getElementById('report-form');
    const aiResponse = document.getElementById('ai-response');
    const hotlinesSection = document.getElementById('hotlines-section');
    const myReportsSection = document.getElementById('my-reports-section');
    
    // Get navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    // Get buttons
    const reportEmergencyBtn = document.getElementById('report-emergency-btn');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const backToFormBtn = document.getElementById('back-to-form');
    const viewHotlinesBtn = document.querySelector('.action-buttons .action-btn:first-child');
    const viewMyReportsBtn = document.querySelector('.action-buttons .action-btn:last-child');
    
    // Add section-transition class to all sections
    [welcomeSection, emergencyDashboard, reportForm, aiResponse, hotlinesSection, myReportsSection].forEach(section => {
        if (section) section.classList.add('section-transition');
    });
    
    // Function to show a section with transition
    function showSection(section, direction = 'right') {
        // Hide all sections
        [welcomeSection, emergencyDashboard, reportForm, aiResponse, hotlinesSection, myReportsSection].forEach(s => {
            if (s === section) return;
            s.classList.remove('active-section', 'slide-in');
            s.classList.add('hidden-section');
            s.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');
        });
        
        // Show the target section
        section.classList.remove('hidden-section', 'slide-out-left', 'slide-out-right');
        
        // Force reflow to ensure transition works
        void section.offsetWidth;
        
        section.classList.add('active-section', 'slide-in');
    }
    
    // Function to update active nav item
    function updateActiveNav(index) {
        navItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Event listeners for navigation
    navItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            updateActiveNav(index);
            
            // Handle navigation based on index
            switch(index) {
                case 0: // Home
                    showSection(welcomeSection);
                    break;
                case 1: // Report
                    showSection(reportForm);
                    break;
                case 2: // Hotlines
                    showSection(hotlinesSection);
                    break;
                case 3: // My Reports
                    showSection(myReportsSection);
                    break;
            }
        });
    });
    
    // Event listener for Report Emergency button on welcome page
    if (reportEmergencyBtn) {
        reportEmergencyBtn.addEventListener('click', function() {
            showSection(reportForm);
            updateActiveNav(1); // Update nav to Report
        });
    }
    
    // Event listener for View Hotlines button in quick actions
    if (viewHotlinesBtn) {
        viewHotlinesBtn.addEventListener('click', function() {
            showSection(hotlinesSection);
            updateActiveNav(2); // Update nav to Hotlines
        });
    }
    
    // Event listener for View My Reports button in quick actions
    if (viewMyReportsBtn) {
        viewMyReportsBtn.addEventListener('click', function() {
            showSection(myReportsSection);
            updateActiveNav(3); // Update nav to My Reports
        });
    }
    
    // Event listener for Back button on report form
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', function() {
            showSection(welcomeSection, 'left');
            updateActiveNav(0); // Update nav to Home
        });
    }
    
    // Event listener for Back button on AI response
    if (backToFormBtn) {
        backToFormBtn.addEventListener('click', function() {
            showSection(reportForm, 'left');
        });
    }
    
    // Handle emergency form submission
    const emergencyForm = document.getElementById('emergency-form');
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would process the form data
            // For now, just show the AI response section
            showSection(aiResponse);
            
            // Simulate saving the report to My Reports
            // In a real app, you would store this in localStorage or a database
            setTimeout(() => {
                // This would be implemented in a real app
                console.log('Emergency report submitted');
            }, 1000);
        });
    }
    
    // Handle emergency type selection in the dashboard
    const emergencyButtons = document.querySelectorAll('.emergency-btn');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            const typeTitle = document.getElementById('emergency-type-title');
            
            if (typeTitle) {
                typeTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1) + ' Emergency';
                typeTitle.dataset.type = type;
            }
            
            showSection(reportForm);
        });
    });
    
    // Handle delete report buttons
    const deleteReportBtns = document.querySelectorAll('.delete-report-btn');
    deleteReportBtns.forEach(button => {
        button.addEventListener('click', function() {
            const reportCard = this.closest('.report-card');
            
            // Add a fade-out animation
            reportCard.style.transition = 'opacity 0.3s, transform 0.3s';
            reportCard.style.opacity = '0';
            reportCard.style.transform = 'translateX(100%)';
            
            // Remove the card after animation completes
            setTimeout(() => {
                reportCard.remove();
                
                // Check if there are any reports left
                const remainingReports = document.querySelectorAll('.report-card');
                const noReportsMessage = document.querySelector('.no-reports-message');
                
                if (remainingReports.length === 0 && noReportsMessage) {
                    noReportsMessage.style.display = 'block';
                }
            }, 300);
        });
    });
    
    // Safety tips rotation
    const safetyTips = [
        "Always keep emergency contacts easily accessible.",
        "Create a family emergency plan and practice it regularly.",
        "Keep a first aid kit in your home and vehicle.",
        "Know the emergency exits in buildings you frequent.",
        "Store at least 3 days of water and non-perishable food.",
        "Have a battery-powered radio for emergency updates.",
        "Keep emergency cash in small denominations.",
        "Learn basic first aid and CPR skills."
    ];
    
    const safetyTipElement = document.getElementById('safety-tip');
    if (safetyTipElement) {
        let currentTipIndex = 0;
        
        // Set initial tip
        safetyTipElement.textContent = safetyTips[currentTipIndex];
        
        // Change tip every 10 seconds
        setInterval(() => {
            currentTipIndex = (currentTipIndex + 1) % safetyTips.length;
            
            // Fade out
            safetyTipElement.style.opacity = '0';
            
            // Change text and fade in after transition
            setTimeout(() => {
                safetyTipElement.textContent = safetyTips[currentTipIndex];
                safetyTipElement.style.opacity = '1';
            }, 500);
        }, 10000);
        
        // Add transition to the element
        safetyTipElement.style.transition = 'opacity 0.5s ease';
    }
});

// Emergency type interactive selection
const emergencyOptions = document.querySelectorAll('.emergency-option');
const emergencyTypeSelect = document.getElementById('emergency-type');

if (emergencyOptions.length > 0 && emergencyTypeSelect) {
    emergencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            emergencyOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update the hidden select value
            const value = this.getAttribute('data-value');
            emergencyTypeSelect.value = value;
            
            // Trigger change event on select
            const event = new Event('change');
            emergencyTypeSelect.dispatchEvent(event);
        });
    });
    
    // If select has a value on page load, highlight the corresponding option
    if (emergencyTypeSelect.value) {
        const selectedOption = document.querySelector(`.emergency-option[data-value="${emergencyTypeSelect.value}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
}

// Location tracking and map functionality
document.addEventListener('DOMContentLoaded', function() {
    // Map and location tracking
    const locationInput = document.getElementById('location');
    const refreshLocationBtn = document.getElementById('refresh-location');
    const locationMap = document.getElementById('location-map');
    const locationStatus = document.getElementById('location-status');
    const coordinatesDisplay = document.getElementById('coordinates-display');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    
    let map = null;
    let marker = null;
    let userLocation = null;
    
    // Initialize map with Leaflet (OpenStreetMap)
    function initMap(lat, lng) {
        // If map already exists, remove it and create a new one
        if (map) {
            map.remove();
        }
        
        // Show the map container
        locationMap.style.display = 'block';
        
        // Create map centered at the given coordinates
        map = L.map('location-map').setView([lat, lng], 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Create a custom marker with pulse effect
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div class="map-marker-pulse"></div><div class="map-marker"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Add marker at the given coordinates
        marker = L.marker([lat, lng], {icon: customIcon}).addTo(map);
        
        // Update the map when it's fully loaded
        map.whenReady(function() {
            setTimeout(function() {
                map.invalidateSize();
            }, 100);
        });
    }
    
    // Function to get address from coordinates using reverse geocoding
    async function getAddressFromCoordinates(lat, lng) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            
            if (data && data.display_name) {
                return data.display_name;
            } else {
                return `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
            }
        } catch (error) {
            console.error('Error getting address:', error);
            return `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
        }
    }
    
    // Function to get user's current location
    function getCurrentLocation() {
        // Update status
        locationStatus.textContent = 'Fetching your location...';
        locationStatus.className = 'location-status loading';
        
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            locationStatus.textContent = 'Geolocation is not supported by your browser';
            locationStatus.className = 'location-status error';
            return;
        }
        
        // Get current position
        navigator.geolocation.getCurrentPosition(
            // Success callback
            async function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Store location data
                userLocation = {
                    latitude: lat,
                    longitude: lng
                };
                
                // Update hidden inputs
                latitudeInput.value = lat;
                longitudeInput.value = lng;
                
                // Display coordinates
                coordinatesDisplay.textContent = `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                
                // Initialize or update map
                initMap(lat, lng);
                
                // Get address from coordinates
                const address = await getAddressFromCoordinates(lat, lng);
                locationInput.value = address;
                
                // Update status
                locationStatus.textContent = 'Location found successfully';
                locationStatus.className = 'location-status success';
                
                // Hide status after 3 seconds
                setTimeout(function() {
                    locationStatus.textContent = '';
                }, 3000);
            },
            // Error callback
            function(error) {
                let errorMessage = 'Unknown error occurred while retrieving location';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                
                locationStatus.textContent = errorMessage;
                locationStatus.className = 'location-status error';
                locationInput.value = '';
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
    
    // Add event listener to refresh location button
    if (refreshLocationBtn) {
        refreshLocationBtn.addEventListener('click', function() {
            getCurrentLocation();
        });
    }
    
    // Get location when form is loaded
    if (locationInput && document.getElementById('report-form')) {
        // Check if we're on the report form and try to get location
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.classList.contains('active-section') && 
                    mutation.target.id === 'report-form') {
                    getCurrentLocation();
                }
            });
        });
        
        observer.observe(document.getElementById('report-form'), {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

// In js/script.js (or your main navigation script)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const sectionId = this.dataset.section; // Get section from data-section attribute

        // Remove 'active' class from all nav items and add to clicked one
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        // Hide all sections
        document.querySelectorAll('main > section').forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });

        // Show the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');

            // The MutationObserver in map-functions.js should now pick up this change
            // and initialize/update the map.
        }
    });
});