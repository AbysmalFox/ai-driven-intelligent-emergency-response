/**
 * Location Service
 * Handles geolocation functionality for the emergency response system
 */
class LocationService {
    constructor() {
        this.currentPosition = null;
        this.map = null;
        this.marker = null;
    }

    /**
     * Initialize the location service
     * @param {string} mapElementId - The ID of the HTML element to render the map
     */
    init(mapElementId) {
        this.mapElementId = mapElementId;
    }

    /**
     * Get the user's current location
     * @returns {Promise} - Resolves with the location data or rejects with an error
     */
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    
                    this.reverseGeocode(this.currentPosition.latitude, this.currentPosition.longitude)
                        .then(address => {
                            this.currentPosition.address = address;
                            resolve(this.currentPosition);
                        })
                        .catch(error => {
                            console.error('Error getting address:', error);
                            // Still resolve but without address
                            resolve(this.currentPosition);
                        });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    /**
     * Initialize and render the map
     */
    initMap() {
        if (!this.currentPosition) {
            console.error('No position available to initialize map');
            return;
        }

        const mapElement = document.getElementById(this.mapElementId);
        if (!mapElement) {
            console.error(`Map element with ID ${this.mapElementId} not found`);
            return;
        }

        // Initialize the map if it doesn't exist
        if (!this.map) {
            this.map = L.map(this.mapElementId).setView(
                [this.currentPosition.latitude, this.currentPosition.longitude], 
                15
            );

            // Add the OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);

            // Add a marker for the user's location
            this.marker = L.marker([this.currentPosition.latitude, this.currentPosition.longitude])
                .addTo(this.map)
                .bindPopup('Your location')
                .openPopup();
        } else {
            // Update the map view and marker position
            this.map.setView([this.currentPosition.latitude, this.currentPosition.longitude], 15);
            this.marker.setLatLng([this.currentPosition.latitude, this.currentPosition.longitude]);
        }

        // Force a map resize to ensure it renders correctly
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);
    }

    /**
     * Convert coordinates to an address using reverse geocoding
     * @param {number} latitude - The latitude coordinate
     * @param {number} longitude - The longitude coordinate
     * @returns {Promise} - Resolves with the address string
     */
    async reverseGeocode(latitude, longitude) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data.display_name;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return 'Unknown location';
        }
    }

    /**
     * Get nearby emergency services based on the current location
     * @param {string} type - The type of emergency service to find
     * @returns {Promise} - Resolves with an array of nearby services
     */
    async getNearbyEmergencyServices(type) {
        if (!this.currentPosition) {
            throw new Error('No location available');
        }

        // In a real application, this would call an API to get nearby services
        // For this demo, we'll return mock data
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.getMockEmergencyServices(type));
            }, 1000);
        });
    }

    /**
     * Generate mock emergency services data for demonstration
     * @param {string} type - The type of emergency service
     * @returns {Array} - Array of mock emergency services
     */
    getMockEmergencyServices(type) {
        const services = {
            medical: [
                { name: 'City General Hospital', phone: '911', distance: '1.2 miles' },
                { name: 'Emergency Medical Services', phone: '911', distance: '2.5 miles' },
                { name: 'Urgent Care Clinic', phone: '555-123-4567', distance: '0.8 miles' }
            ],
            fire: [
                { name: 'Downtown Fire Station', phone: '911', distance: '1.5 miles' },
                { name: 'Fire Department HQ', phone: '911', distance: '3.2 miles' }
            ],
            police: [
                { name: 'Police Department', phone: '911', distance: '2.1 miles' },
                { name: 'Sheriff\'s Office', phone: '911', distance: '4.3 miles' }
            ],
            disaster: [
                { name: 'Emergency Management Agency', phone: '911', distance: '5.0 miles' },
                { name: 'Disaster Response Team', phone: '555-789-0123', distance: '3.7 miles' }
            ],
            traffic: [
                { name: 'Highway Patrol', phone: '911', distance: '2.8 miles' },
                { name: 'Traffic Management Center', phone: '555-456-7890', distance: '6.2 miles' }
            ],
            other: [
                { name: 'Emergency Services', phone: '911', distance: '2.0 miles' },
                { name: 'Community Emergency Response', phone: '555-987-6543', distance: '1.9 miles' }
            ]
        };

        return services[type] || services.other;
    }

    /**
     * Share the user's location via the Web Share API
     */
    shareLocation() {
        if (!this.currentPosition) {
            alert('No location available to share');
            return;
        }

        if (!navigator.share) {
            // Fallback for browsers that don't support the Web Share API
            this.copyLocationToClipboard();
            return;
        }

        const locationText = `My emergency location: ${this.currentPosition.address || 'Unknown address'}\nCoordinates: ${this.currentPosition.latitude}, ${this.currentPosition.longitude}\nhttps://www.google.com/maps?q=${this.currentPosition.latitude},${this.currentPosition.longitude}`;

        navigator.share({
            title: 'Emergency Location',
            text: locationText
        })
        .catch(error => {
            console.error('Error sharing location:', error);
            this.copyLocationToClipboard();
        });
    }

    /**
     * Fallback method to copy location to clipboard
     */
    copyLocationToClipboard() {
        const locationText = `My emergency location: ${this.currentPosition.address || 'Unknown address'}\nCoordinates: ${this.currentPosition.latitude}, ${this.currentPosition.longitude}\nhttps://www.google.com/maps?q=${this.currentPosition.latitude},${this.currentPosition.longitude}`;
        
        navigator.clipboard.writeText(locationText)
            .then(() => {
                alert('Location copied to clipboard');
            })
            .catch(err => {
                console.error('Could not copy location: ', err);
                alert('Could not copy location to clipboard');
            });
    }
}

// Create and export a singleton instance
const locationService = new LocationService();