/**
 * AI Response System
 * Handles AI guidance and nearby emergency contacts
 */
class AIResponseSystem {
    constructor() {
        this.apiKey = ''; // You'll need to add your API key here
        this.emergencyData = null;
        this.userLocation = null;
        this.initEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Listen for when the AI response section becomes visible
        document.addEventListener('sectionChange', (event) => {
            if (event.detail.section === 'ai-response') {
                this.processEmergencyData();
            }
        });

        // Back button
        const backButton = document.getElementById('back-to-form');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.navigateToSection('report-form');
            });
        }

        // Call emergency button
        const callEmergencyBtn = document.getElementById('call-emergency');
        if (callEmergencyBtn) {
            callEmergencyBtn.addEventListener('click', () => {
                this.callEmergencyServices();
            });
        }

        // Share location button
        const shareLocationBtn = document.getElementById('share-location');
        if (shareLocationBtn) {
            shareLocationBtn.addEventListener('click', () => {
                this.shareLocation();
            });
        }
    }

    /**
     * Set emergency data from form submission
     * @param {Object} data - Emergency data from form
     */
    setEmergencyData(data) {
        console.log('Setting emergency data:', data);
        this.emergencyData = data;
        this.userLocation = {
            latitude: data.coordinates?.latitude || null,
            longitude: data.coordinates?.longitude || null
        };
    }

    /**
     * Process emergency data to generate AI guidance and find nearby services
     */
    async processEmergencyData() {
        if (!this.emergencyData) {
            console.error('No emergency data available');
            return;
        }

        // Show loading indicators
        this.showLoadingState();

        try {
            // Generate AI guidance
            await this.generateAIGuidance();
            
            // Find nearby emergency services
            await this.findNearbyEmergencyServices();
        } catch (error) {
            console.error('Error processing emergency data:', error);
            this.showErrorState();
        }
    }

    /**
     * Generate AI guidance based on emergency data
     */
    async generateAIGuidance() {
        const guidanceContent = document.getElementById('ai-guidance-content');
        if (!guidanceContent) return;

        try {
            // If you have an actual AI API, use this:
            // const response = await this.callAIAPI(this.emergencyData);
            // const guidance = response.guidance;

            // For demo purposes, we'll use simulated responses
            const guidance = this.getSimulatedAIGuidance();
            
            // Display the guidance
            guidanceContent.innerHTML = guidance;
        } catch (error) {
            console.error('Error generating AI guidance:', error);
            guidanceContent.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to generate guidance. Please try again.</p>
                </div>
            `;
        }
    }

    /**
     * Call AI API to get guidance (replace with actual API call)
     * @param {Object} emergencyData - Emergency data
     * @returns {Promise} - API response
     */
    async callAIAPI(emergencyData) {
        // Replace this with your actual API call
        // Example using OpenAI API:
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an emergency response assistant. Provide clear, concise guidance for the emergency situation described. Format your response as HTML with <div class="guidance-item"><h4>Step Title</h4><p>Step description</p></div> elements.'
                        },
                        {
                            role: 'user',
                            content: `Emergency type: ${emergencyData.type}. Description: ${emergencyData.description}. Location: ${emergencyData.location}.`
                        }
                    ]
                })
            });

            const data = await response.json();
            return {
                guidance: data.choices[0].message.content
            };
        } catch (error) {
            console.error('Error calling AI API:', error);
            throw error;
        }
    }

    /**
     * Get simulated AI guidance based on emergency type
     * @returns {string} - HTML content for guidance
     */
    getSimulatedAIGuidance() {
        const emergencyType = this.emergencyData.type;
        let guidance = '';

        switch (emergencyType) {
            case 'medical':
                guidance = `
                    <div class="guidance-item">
                        <h4><i class="fas fa-check-circle"></i> Check Responsiveness</h4>
                        <p>If the person is unresponsive, check for breathing and pulse.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-hand-holding-medical"></i> Provide First Aid</h4>
                        <p>If trained, provide appropriate first aid while waiting for emergency services.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-user-shield"></i> Stay with the Person</h4>
                        <p>Do not leave the person alone. Keep them comfortable and monitor their condition.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-head-side-mask"></i> Maintain Airway</h4>
                        <p>Ensure the person's airway is clear. If they're unconscious but breathing, place them in the recovery position.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-thermometer"></i> Monitor Vital Signs</h4>
                        <p>Check breathing, pulse, and level of consciousness regularly until help arrives.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-notes-medical"></i> Gather Medical Information</h4>
                        <p>If possible, collect information about medications, allergies, and medical conditions to share with emergency responders.</p>
                    </div>
                `;
                break;
            case 'fire':
                guidance = `
                    <div class="guidance-item">
                        <h4><i class="fas fa-running"></i> Evacuate Immediately</h4>
                        <p>Get everyone out of the building. Do not go back inside for any reason.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-door-closed"></i> Close Doors Behind You</h4>
                        <p>Close doors as you leave to help contain the fire.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-phone-alt"></i> Call from a Safe Distance</h4>
                        <p>Once safely outside, call emergency services if you haven't already.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-smoke"></i> Stay Low in Smoke</h4>
                        <p>If there's smoke, crawl low under it where the air is clearer. Cover your nose and mouth with a damp cloth if possible.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-temperature-high"></i> Check Doors Before Opening</h4>
                        <p>Feel doors with the back of your hand before opening. If hot, find another exit route.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-users"></i> Account for Everyone</h4>
                        <p>Once outside, gather at your designated meeting spot and make sure everyone is accounted for.</p>
                    </div>
                `;
                break;
            case 'police':
                guidance = `
                    <div class="guidance-item">
                        <h4><i class="fas fa-shield-alt"></i> Stay Safe</h4>
                        <p>Remove yourself from danger if possible. Find a secure location.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-eye"></i> Observe Details</h4>
                        <p>Note descriptions of people, vehicles, or other important details if safe to do so.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-volume-mute"></i> Stay Quiet</h4>
                        <p>If hiding, silence your phone and remain quiet until help arrives.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-lock"></i> Secure Your Location</h4>
                        <p>If possible, lock and barricade doors. Turn off lights and stay away from windows.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-hands"></i> Show Empty Hands</h4>
                        <p>When police arrive, keep your hands visible and follow all instructions carefully.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-clipboard"></i> Report Accurately</h4>
                        <p>When safe, provide clear, factual information to authorities about what you witnessed.</p>
                    </div>
                `;
                break;
            case 'disaster':
                guidance = `
                    <div class="guidance-item">
                        <h4><i class="fas fa-house-damage"></i> Seek Appropriate Shelter</h4>
                        <p>For earthquakes: get under sturdy furniture. For floods: move to higher ground.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-broadcast-tower"></i> Stay Informed</h4>
                        <p>Listen to emergency broadcasts for official instructions.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-first-aid"></i> Prepare Emergency Supplies</h4>
                        <p>Gather water, food, medications, and other essential items if possible.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-lightbulb"></i> Turn Off Utilities</h4>
                        <p>If instructed and if it's safe to do so, turn off gas, water, and electricity at the main switches.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-map-marked-alt"></i> Know Evacuation Routes</h4>
                        <p>Be familiar with multiple evacuation routes in case some are blocked or damaged.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-battery-full"></i> Conserve Resources</h4>
                        <p>Use phones sparingly to conserve battery. Ration food and water if supplies are limited.</p>
                    </div>
                `;
                break;
            case 'traffic':
                guidance = `
                    <div class="guidance-item">
                        <h4><i class="fas fa-car"></i> Move to Safety</h4>
                        <p>If possible, move vehicles out of traffic. Turn on hazard lights.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-exclamation-triangle"></i> Set Up Warning Signs</h4>
                        <p>Place warning triangles or flares if available and safe to do so.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-user-injured"></i> Check for Injuries</h4>
                        <p>Check yourself and others for injuries. Do not move seriously injured people.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-fire-extinguisher"></i> Assess Vehicle Hazards</h4>
                        <p>Check for fuel leaks, smoke, or fire. If present, evacuate the area immediately.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-id-card"></i> Exchange Information</h4>
                        <p>Exchange contact and insurance information with other involved parties when safe to do so.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-camera"></i> Document the Scene</h4>
                        <p>Take photos of vehicle damage, the accident scene, and any relevant road conditions if it's safe.</p>
                    </div>
                `;
                break;
            default:
                guidance = `
                    <div class="guidance-item">
                        <h4><i class="fas fa-exclamation-circle"></i> Stay Calm</h4>
                        <p>Take deep breaths and try to remain calm.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-phone-alt"></i> Call Emergency Services</h4>
                        <p>Provide clear information about your emergency.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-info-circle"></i> Follow Instructions</h4>
                        <p>Listen carefully to emergency dispatcher instructions.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-map-marker-alt"></i> Share Your Location</h4>
                        <p>Be as specific as possible about your location to help responders find you quickly.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-hand-holding-heart"></i> Help Others If Safe</h4>
                        <p>Assist others only if you can do so without endangering yourself.</p>
                    </div>
                    <div class="guidance-item">
                        <h4><i class="fas fa-clock"></i> Note the Time</h4>
                        <p>Keep track of when the emergency started and key developments to report to responders.</p>
                    </div>
                `;
        }

        // Add a general advice section at the end of all guidance types
        guidance += `
            <div class="guidance-separator"></div>
            <div class="guidance-item important-note">
                <h4><i class="fas fa-star"></i> Important Reminder</h4>
                <p>Your safety is the priority. Follow official instructions from emergency responders when they arrive.</p>
            </div>
        `;

        return guidance;
    }

    /**
     * Find nearby emergency services based on user location
     */
    async findNearbyEmergencyServices() {
        const servicesContainer = document.getElementById('emergency-contacts-list');
        if (!servicesContainer || !this.userLocation) return;
    
        try {
            // Use OpenStreetMap Overpass API to find nearby emergency services
            const radius = 5000; // 5km radius
            const lat = this.userLocation.latitude;
            const lon = this.userLocation.longitude;
    
            const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="hospital"](around:${radius},${lat},${lon});node["amenity"="police"](around:${radius},${lat},${lon});node["amenity"="fire_station"](around:${radius},${lat},${lon}););out body;>;out skel qt;`;
    
            const response = await fetch(overpassUrl);
            const data = await response.json();
    
            let servicesHTML = '';
            
            // If no real services found or error occurs, generate random ones
            if (!data.elements || data.elements.length === 0) {
                const randomServices = this.generateRandomServices(lat, lon);
                
                // Add markers to the map
                if (window.map && window.L) {
                    randomServices.forEach(service => {
                        const icon = window.L.divIcon({
                            html: `<i class="fas fa-${service.icon}" style="color: ${this.getServiceColor(service.type)}; font-size: 24px;"></i>`,
                            className: 'custom-map-icon',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        });
                        
                        const marker = window.L.marker([service.lat, service.lon], {icon: icon}).addTo(window.map);
                        marker.bindPopup(`<b>${service.name}</b><br>${service.distance.toFixed(1)} km away`);
                    });
                }
                
                // Generate HTML for the services list
                randomServices.forEach(service => {
                    servicesHTML += `
                        <div class="service-item">
                            <i class="fas fa-${service.icon}" style="color: ${this.getServiceColor(service.type)};"></i>
                            <div class="service-info">
                                <h4>${service.name}</h4>
                                <p>${service.distance.toFixed(1)} km away</p>
                            </div>
                        </div>
                    `;
                });
            } else {
                // Process real data from Overpass API
                data.elements.forEach(element => {
                    const distance = this.calculateDistance(lat, lon, element.lat, element.lon);
                    const type = element.tags.amenity;
                    
                    // Add marker to the map
                    if (window.map && window.L) {
                        const icon = window.L.divIcon({
                            html: `<i class="fas fa-${this.getServiceIcon(type)}" style="color: ${this.getServiceColor(type)}; font-size: 24px;"></i>`,
                            className: 'custom-map-icon',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        });
                        
                        const marker = window.L.marker([element.lat, element.lon], {icon: icon}).addTo(window.map);
                        marker.bindPopup(`<b>${element.tags.name || type}</b><br>${distance.toFixed(1)} km away`);
                    }
                    
                    servicesHTML += `
                        <div class="service-item">
                            <i class="fas fa-${this.getServiceIcon(type)}" style="color: ${this.getServiceColor(type)};"></i>
                            <div class="service-info">
                                <h4>${element.tags.name || type}</h4>
                                <p>${distance.toFixed(1)} km away</p>
                            </div>
                        </div>
                    `;
                });
            }

            servicesContainer.innerHTML = servicesHTML;
        } catch (error) {
            console.error('Error finding nearby services:', error);
            servicesContainer.innerHTML = `<p>Error loading nearby services: ${error.message}</p>`;
        }
    }

    getServiceIcon(type) {
        switch(type) {
            case 'hospital': return 'hospital';
            case 'police': return 'shield-alt';
            case 'fire_station': return 'fire';
            default: return 'building';
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    /**
     * Fetch nearby emergency services from API (replace with actual API call)
     * @param {Object} location - User location
     * @returns {Promise} - API response
     */
    async fetchNearbyServices(location) {
        // Replace this with your actual API call
        // Example using Google Places API:
        
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=5000&type=hospital|police|fire_station&key=${this.apiKey}`);
            const data = await response.json();
            
            return data.results.map(place => {
                return {
                    name: place.name,
                    address: place.vicinity,
                    distance: this.calculateDistance(
                        location.latitude, 
                        location.longitude,
                        place.geometry.location.lat,
                        place.geometry.location.lng
                    ),
                    phone: place.formatted_phone_number || 'N/A',
                    type: this.getServiceType(place.types),
                    icon: this.getServiceIcon(place.types)
                };
            });
        } catch (error) {
            console.error('Error fetching nearby services:', error);
            throw error;
        }
    }

    /**
     * Get service type based on place types
     * @param {Array} types - Place types
     * @returns {string} - Service type
     */
    getServiceType(types) {
        if (types.includes('hospital') || types.includes('doctor')) {
            return 'medical';
        } else if (types.includes('police')) {
            return 'police';
        } else if (types.includes('fire_station')) {
            return 'fire';
        } else {
            return 'other';
        }
    }

    /**
     * Get service icon based on place types
     * @param {Array} types - Place types
     * @returns {string} - Icon class
     */
    getServiceIcon(types) {
        if (types.includes('hospital') || types.includes('doctor')) {
            return 'fas fa-hospital';
        } else if (types.includes('police')) {
            return 'fas fa-shield-alt';
        } else if (types.includes('fire_station')) {
            return 'fas fa-fire-extinguisher';
        } else {
            return 'fas fa-phone-alt';
        }
    }

    /**
     * Get simulated nearby emergency services
     * @returns {Array} - Array of service objects
     */
    getSimulatedNearbyServices() {
        // Generate random distances between 0.5 and 5 km
        const randomDistance = () => (Math.random() * 4.5 + 0.5).toFixed(1);
        
        return [
            {
                name: 'City General Hospital',
                address: '123 Healthcare Ave',
                distance: randomDistance(),
                phone: '911',
                type: 'medical',
                icon: 'fas fa-hospital'
            },
            {
                name: 'Downtown Police Station',
                address: '456 Safety Blvd',
                distance: randomDistance(),
                phone: '911',
                type: 'police',
                icon: 'fas fa-shield-alt'
            },
            {
                name: 'Central Fire Department',
                address: '789 Rescue St',
                distance: randomDistance(),
                phone: '911',
                type: 'fire',
                icon: 'fas fa-fire-extinguisher'
            },
            {
                name: 'Rapid Response Ambulance',
                address: '321 Emergency Rd',
                distance: randomDistance(),
                phone: '911',
                type: 'medical',
                icon: 'fas fa-ambulance'
            }
        ].sort((a, b) => a.distance - b.distance); // Sort by distance
    }

    /**
     * Calculate distance between two coordinates (Haversine formula)
     * @param {number} lat1 - Latitude 1
     * @param {number} lon1 - Longitude 1
     * @param {number} lat2 - Latitude 2
     * @param {number} lon2 - Longitude 2
     * @returns {number} - Distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        return distance.toFixed(1);
    }

    /**
     * Convert degrees to radians
     * @param {number} deg - Degrees
     * @returns {number} - Radians
     */
    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    /**
     * Show loading state in the UI
     */
    showLoadingState() {
        const guidanceContent = document.getElementById('ai-guidance-content');
        const contactsList = document.getElementById('emergency-contacts-list');
        
        if (guidanceContent) {
            guidanceContent.innerHTML = '<p class="loading">Analyzing emergency and generating guidance...</p>';
        }
        
    }

    /**
     * Show error state in the UI
     */
    showErrorState() {
        const guidanceContent = document.getElementById('ai-guidance-content');
        const contactsList = document.getElementById('emergency-contacts-list');
        
        if (guidanceContent) {
            guidanceContent.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to generate guidance. Please try again.</p>
                </div>
            `;
        }
        
        if (contactsList) {
            contactsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to find nearby services. Please call emergency hotlines directly.</p>
                </div>
            `;
        }
    }

    /**
     * Navigate to a section
     * @param {string} sectionId - ID of the section to navigate to
     */
    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        }
    }

    /**
     * Call emergency services
     */
    callEmergencyServices() {
        // Get the appropriate emergency number based on emergency type
        let emergencyNumber = '911'; // Default
        
        // Redirect to phone call
        window.location.href = `tel:${emergencyNumber}`;
    }

    /**
     * Share user's location
     */
    async shareLocation() {
        if (!this.userLocation || !this.userLocation.latitude || !this.userLocation.longitude) {
            console.error('No location data available to share');
            return;
        }

        const locationString = `Emergency at: ${this.emergencyData.location}\nCoordinates: ${this.userLocation.latitude}, ${this.userLocation.longitude}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Emergency Location',
                    text: locationString,
                    url: `https://www.google.com/maps?q=${this.userLocation.latitude},${this.userLocation.longitude}`
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const tempInput = document.createElement('textarea');
                tempInput.value = locationString;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('Location copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing location:', error);
            alert('Failed to share location. Please try again.');
        }
    }

    /**
     * Fallback sharing method
     * @param {string} text - Text to share
     */
    fallbackShare(text) {
        // Create a temporary input element
        const input = document.createElement('textarea');
        input.value = text;
        document.body.appendChild(input);
        
        // Select and copy the text
        input.select();
        document.execCommand('copy');
        
        // Remove the temporary element
        document.body.removeChild(input);
        
        // Notify the user
        alert('Location copied to clipboard. You can now paste it into a message.');
    }

    /**
 * Get color for service type icon
 * @param {string} serviceType - Type of emergency service
 * @returns {string} - Color code
 */
getServiceColor(serviceType) {
    switch(serviceType) {
        case 'hospital':
        case 'medical':
            return '#e74c3c'; // Red
        case 'police':
            return '#3498db'; // Blue
        case 'fire_station':
        case 'fire':
            return '#e67e22'; // Orange
        default:
            return '#2ecc71'; // Green
    }
}

/**
 * Update AI guidance based on emergency type
 * @param {string} emergencyType - Type of emergency
 */
updateAIGuidance(emergencyType) {
    const specificGuidance = document.getElementById('specific-guidance');
    if (!specificGuidance) return;
    
    let guidanceContent = '';
    
    switch(emergencyType) {
        case 'medical':
            guidanceContent = `
                <p>For medical emergencies:</p>
                <ul class="guidance-list">
                    <li>Check for breathing and pulse</li>
                    <li>Apply pressure to stop bleeding</li>
                    <li>Keep the person still if spinal injury is suspected</li>
                    <li>If trained, perform CPR if necessary</li>
                    <li>Keep the person warm and comfortable</li>
                </ul>
            `;
            break;
        case 'fire':
            guidanceContent = `
                <p>For fire emergencies:</p>
                <ul class="guidance-list">
                    <li>Evacuate immediately - don't collect possessions</li>
                    <li>Stay low to avoid smoke inhalation</li>
                    <li>Test doors with the back of your hand before opening</li>
                    <li>Use stairs, never elevators</li>
                    <li>Once out, stay out - never re-enter a burning building</li>
                </ul>
            `;
            break;
        case 'police':
            guidanceContent = `
                <p>For crime/police emergencies:</p>
                <ul class="guidance-list">
                    <li>Find a safe location away from danger</li>
                    <li>Be observant of details (descriptions, license plates)</li>
                    <li>Don't confront suspects yourself</li>
                    <li>Preserve evidence if possible</li>
                    <li>Wait for police in a safe location</li>
                </ul>
            `;
            break;
        case 'disaster':
            guidanceContent = `
                <p>For natural disaster emergencies:</p>
                <ul class="guidance-list">
                    <li>Seek appropriate shelter (basement for tornado, high ground for flood)</li>
                    <li>Stay away from windows and exterior walls</li>
                    <li>Have emergency supplies ready</li>
                    <li>Listen to emergency broadcasts</li>
                    <li>Evacuate if instructed by authorities</li>
                </ul>
            `;
            break;
        case 'traffic':
            guidanceContent = `
                <p>For traffic accident emergencies:</p>
                <ul class="guidance-list">
                    <li>Turn on hazard lights and set up warning triangles if available</li>
                    <li>Move vehicles out of traffic if possible and safe to do so</li>
                    <li>Check for injuries but don't move seriously injured people</li>
                    <li>Exchange information with other drivers</li>
                    <li>Document the scene with photos if possible</li>
                </ul>
            `;
            break;
        default:
            guidanceContent = `
                <p>General emergency guidance:</p>
                <ul class="guidance-list">
                    <li>Assess the situation and identify immediate dangers</li>
                    <li>Move to safety if necessary</li>
                    <li>Call emergency services with clear information</li>
                    <li>Follow instructions from emergency personnel</li>
                    <li>Help others only if it's safe to do so</li>
                </ul>
            `;
    }
    
    specificGuidance.innerHTML = guidanceContent;
    
    // Set up event listeners for follow-up questions
    document.querySelectorAll('.followup-btn').forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            this.handleFollowupQuestion(question);
        });
    });
    
    // Set up resource buttons
    document.getElementById('first-aid-btn')?.addEventListener('click', this.showFirstAidGuide);
    document.getElementById('evacuation-btn')?.addEventListener('click', this.showEvacuationTips);
    document.getElementById('contact-btn')?.addEventListener('click', this.showEmergencyContacts);
}

/**
 * Handle follow-up questions
 * @param {string} questionType - Type of follow-up question
 */
handleFollowupQuestion(questionType) {
    const aiGuidanceContent = document.getElementById('ai-guidance-content');
    let responseHTML = '';
    
    switch(questionType) {
        case 'medical':
            responseHTML = `
                <div class="guidance-response">
                    <h5><i class="fas fa-reply"></i> Basic First Aid</h5>
                    <ul class="guidance-list">
                        <li><strong>Bleeding:</strong> Apply direct pressure with clean cloth</li>
                        <li><strong>Burns:</strong> Cool with running water for 10-15 minutes</li>
                        <li><strong>Choking:</strong> Perform abdominal thrusts if person cannot speak/breathe</li>
                        <li><strong>CPR:</strong> Push hard and fast in center of chest (100-120 compressions per minute)</li>
                        <li><strong>Recovery position:</strong> Place unconscious breathing person on their side</li>
                    </ul>
                    <button class="back-btn"><i class="fas fa-arrow-left"></i> Back to guidance</button>
                </div>
            `;
            break;
        case 'safety':
            responseHTML = `
                <div class="guidance-response">
                    <h5><i class="fas fa-reply"></i> Staying Safe While Waiting</h5>
                    <ul class="guidance-list">
                        <li>Stay in a well-lit area if possible</li>
                        <li>Keep your phone charged and accessible</li>
                        <li>Don't eat or drink anything if medical help is coming</li>
                        <li>Keep warm using blankets or extra clothing</li>
                        <li>Update emergency services if your condition changes</li>
                        <li>Lock doors and windows if crime-related emergency</li>
                    </ul>
                    <button class="back-btn"><i class="fas fa-arrow-left"></i> Back to guidance</button>
                </div>
            `;
            break;
        case 'others':
            responseHTML = `
                <div class="guidance-response">
                    <h5><i class="fas fa-reply"></i> Helping Others Safely</h5>
                    <ul class="guidance-list">
                        <li>Never put yourself in danger to help others</li>
                        <li>Ask conscious victims for permission before helping</li>
                        <li>Don't move injured people unless absolutely necessary</li>
                        <li>Provide reassurance and emotional support</li>
                        <li>Follow emergency dispatcher instructions</li>
                        <li>If trained, provide first aid while waiting for help</li>
                    </ul>
                    <button class="back-btn"><i class="fas fa-arrow-left"></i> Back to guidance</button>
                </div>
            `;
            break;
    }
    
    // Store original content
    if (!aiGuidanceContent.getAttribute('data-original')) {
        aiGuidanceContent.setAttribute('data-original', aiGuidanceContent.innerHTML);
    }
    
    // Show response
    aiGuidanceContent.innerHTML = responseHTML;
    
    // Add back button functionality
    document.querySelector('.back-btn').addEventListener('click', () => {
        aiGuidanceContent.innerHTML = aiGuidanceContent.getAttribute('data-original');
        
        // Reattach event listeners
        document.querySelectorAll('.followup-btn').forEach(button => {
            button.addEventListener('click', () => {
                const question = button.getAttribute('data-question');
                this.handleFollowupQuestion(question);
            });
        });
    });
}

// Resource button handlers
showFirstAidGuide() {
    // Implementation for showing first aid guide
    alert('First Aid Guide would open here');
}

showEvacuationTips() {
    // Implementation for showing evacuation tips
    alert('Evacuation Tips would open here');
}

showEmergencyContacts() {
    // Implementation for showing emergency contacts
    // Could navigate to the hotlines section
    document.getElementById('nav-hotlines')?.click();
}







}



// Initialize the AI Response System
const aiResponseSystem = new AIResponseSystem();

// Make it available globally
window.aiResponseSystem = aiResponseSystem;

