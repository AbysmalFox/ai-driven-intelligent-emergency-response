/**
 * Emergency Reports Module
 * Handles saving and displaying emergency reports
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Emergency Reports module loaded');
    
    // Get references to important elements
    const emergencyForm = document.getElementById('emergency-form');
    const reportsContainer = document.querySelector('.reports-container');
    const noReportsMessage = document.querySelector('.no-reports-message');
    
    // Load existing reports from database
    let reports = [];
    loadReports();
    
    // Add event listener to the form
    if (emergencyForm) {
        console.log('Form found, adding submit listener');
        emergencyForm.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Emergency form not found!');
    }
    
    // Add event listeners to delete buttons
    document.addEventListener('click', function(event) {
        if (event.target.closest('.delete-report-btn')) {
            const reportCard = event.target.closest('.report-card');
            if (reportCard) {
                const reportId = reportCard.querySelector('.report-id').textContent.split(':')[1].trim();
                deleteReport(reportId);
            }
        }
    });
    
    /**
     * Handle form submission
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        console.log('Form submitted');
        
        // Get form data
        const form = event.target;
        
        // Get selected emergency type
        const emergencyTypeSelect = document.getElementById('emergency-type');
        const emergencyType = emergencyTypeSelect ? emergencyTypeSelect.value : 'other';
        console.log('Emergency type:', emergencyType);
        
        // Get location data
        const location = document.getElementById('location').value || 'Unknown location';
        const latitude = document.getElementById('latitude') ? document.getElementById('latitude').value : '';
        const longitude = document.getElementById('longitude') ? document.getElementById('longitude').value : '';
        
        // Get description
        const description = document.getElementById('description') ? document.getElementById('description').value : 'No description provided';
        
        // Get reporter name (if available)
        const reporterName = document.getElementById('reporter-name') ? document.getElementById('reporter-name').value : 'Anonymous';
        
        // Get urgency level
        const urgency = document.getElementById('urgency') ? document.getElementById('urgency').value : 'medium';
        
        // Get media files if any
        const mediaInput = document.getElementById('media-upload');
        let mediaFiles = [];
        if (mediaInput && mediaInput.files.length > 0) {
            // In a real app, you would upload these files to a server
            // For now, we'll just store the file names
            for (let i = 0; i < mediaInput.files.length; i++) {
                mediaFiles.push(mediaInput.files[i].name);
            }
        }
        
        // Create a unique report ID
        const reportId = Date.now().toString();
        
        // Create report object
        const report = {
            id: reportId,
            type: emergencyType,
            location: location,
            coordinates: {
                latitude: latitude,
                longitude: longitude
            },
            description: description,
            reporter: reporterName,
            urgency: urgency,
            mediaFiles: mediaFiles,
            timestamp: new Date().toLocaleString(),
            status: 'Pending'
        };
        
        console.log('Saving report:', report);
        
        // Save the report
        saveReport(report);
        

        
        // NEW CODE: Pass data to AI response system and navigate to AI response section
        if (window.aiResponseSystem) {
            console.log('Passing data to AI response system');
            window.aiResponseSystem.setEmergencyData({
                type: emergencyType,
                description: description,
                location: location,
                coordinates: {
                    latitude: latitude,
                    longitude: longitude
                }
            });
            
            // Navigate to AI response section
            navigateToSection('ai-response');
        } else {
            console.error('AI Response System not found');
            // Navigate to My Reports section as fallback
            navigateToMyReports();
        }
        
        return false; // Prevent form submission
    }
    
    /**
     * Navigate to a section
     * @param {string} sectionId - ID of the section to navigate to
     */
    function navigateToSection(sectionId) {
        console.log('Navigating to section:', sectionId);
        
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
            
            // Dispatch event for section change
            const event = new CustomEvent('sectionChange', {
                detail: { section: sectionId }
            });
            document.dispatchEvent(event);
        } else {
            console.error('Section not found:', sectionId);
        }
    }
    
    /**
     * Navigate to My Reports section
     */
    function navigateToMyReports() {
        console.log('Navigating to My Reports section');
        
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });
        
        // Show My Reports section
        const myReportsSection = document.getElementById('my-reports-section');
        if (myReportsSection) {
            myReportsSection.classList.remove('hidden-section');
            myReportsSection.classList.add('active-section');
        } else {
            console.error('My Reports section not found');
        }
        
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Find the My Reports nav item (4th item)
        const myReportsNavItem = document.querySelector('.nav-item:nth-child(4)');
        if (myReportsNavItem) {
            myReportsNavItem.classList.add('active');
        } else {
            console.error('My Reports nav item not found');
        }
    }
    
    /**
     * Save a report to database
     */
    function saveReport(report) {
        // Check if database operations are available
        if (window.dbOperations) {
            window.dbOperations.saveReport(report)
                .then(() => {
                    // Refresh the reports list
                    loadReports();
                })
                .catch(error => {
                    console.error('Error saving to database:', error);
                    // Fallback to localStorage if database fails
                    saveFallbackToLocalStorage(report);
                });
        } else {
            console.warn('Database operations not available, using localStorage fallback');
            saveFallbackToLocalStorage(report);
        }
    }
    
    /**
     * Fallback to save in localStorage if database is not available
     */
    function saveFallbackToLocalStorage(report) {
        reports.unshift(report); // Add to beginning of array
        localStorage.setItem('emergencyReports', JSON.stringify(reports));
        console.log('Report saved to localStorage, total reports:', reports.length);
        displayReports();
    }
    
    /**
     * Load reports from database
     */
    function loadReports() {
        // Check if database operations are available
        if (window.dbOperations) {
            window.dbOperations.getAllReports()
                .then(dbReports => {
                    reports = dbReports;
                    console.log('Loaded reports from database:', reports.length);
                    displayReports();
                })
                .catch(error => {
                    console.error('Error loading from database:', error);
                    // Fallback to localStorage if database fails
                    loadFallbackFromLocalStorage();
                });
        } else {
            console.warn('Database operations not available, using localStorage fallback');
            loadFallbackFromLocalStorage();
        }
    }
    
    /**
     * Fallback to load from localStorage if database is not available
     */
    function loadFallbackFromLocalStorage() {
        const savedReports = localStorage.getItem('emergencyReports');
        reports = savedReports ? JSON.parse(savedReports) : [];
        console.log('Loaded reports from localStorage:', reports.length);
        displayReports();
    }
    
    /**
     * Delete a report
     */
    function deleteReport(reportId) {
        // Check if database operations are available
        if (window.dbOperations) {
            window.dbOperations.deleteReport(reportId)
                .then(() => {
                    // Refresh the reports list
                    loadReports();
                    showNotification('Report deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting from database:', error);
                    // Fallback to localStorage if database fails
                    deleteFallbackFromLocalStorage(reportId);
                });
        } else {
            console.warn('Database operations not available, using localStorage fallback');
            deleteFallbackFromLocalStorage(reportId);
        }
    }
    
    /**
     * Fallback to delete from localStorage if database is not available
     */
    function deleteFallbackFromLocalStorage(reportId) {
        reports = reports.filter(report => report.id !== reportId);
        localStorage.setItem('emergencyReports', JSON.stringify(reports));
        displayReports();
        showNotification('Report deleted successfully');
    }
    
    /**
     * Display reports in the UI
     */
    function displayReports() {
        if (!reportsContainer) {
            console.error('Reports container not found');
            return;
        }
        
        // Clear existing reports (except the no-reports message)
        const existingReports = reportsContainer.querySelectorAll('.report-card');
        existingReports.forEach(report => report.remove());
        
        if (reports.length === 0) {
            // Show no reports message
            if (noReportsMessage) {
                noReportsMessage.style.display = 'flex';
            }
            return;
        }
        
        // Hide no reports message
        if (noReportsMessage) {
            noReportsMessage.style.display = 'none';
        }
        
        // Add reports to container
        reports.forEach(report => {
            const reportCard = createReportCard(report);
            reportsContainer.appendChild(reportCard);
        });
    }
    
    /**
     * Create a report card element
     */
    function createReportCard(report) {
        const reportCard = document.createElement('div');
        reportCard.className = `report-card ${report.type}-report`;
        
        // Get emergency type info
        const typeInfo = getEmergencyTypeInfo(report.type);
        
        reportCard.innerHTML = `
            <div class="report-header">
                <div class="report-type">
                    <i class="${typeInfo.icon}"></i> ${typeInfo.name}
                </div>
                <button class="delete-report-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="report-id">Report ID: ${report.id}</div>
            <div class="report-details">
                <div class="report-detail">
                    <i class="fas fa-map-marker-alt"></i> Location: ${report.location}
                </div>
                <div class="report-detail">
                    <i class="fas fa-comment"></i> Description: ${report.description}
                </div>
                <div class="report-detail">
                    <i class="fas fa-user"></i> Reporter: ${report.reporter}
                </div>
                <div class="report-detail">
                    <i class="fas fa-calendar-alt"></i> Reported on: ${report.timestamp}
                </div>
            </div>
            <div class="report-status">Status: ${report.status}</div>
        `;
        
        return reportCard;
    }
    
    /**
     * Get emergency type info
     */
    function getEmergencyTypeInfo(type) {
        const typeInfo = {
            medical: { name: 'Medical Emergency', icon: 'fas fa-heartbeat' },
            fire: { name: 'Fire Emergency', icon: 'fas fa-fire' },
            police: { name: 'Police Emergency', icon: 'fas fa-shield-alt' },
            disaster: { name: 'Natural Disaster', icon: 'fas fa-water' },
            traffic: { name: 'Traffic Accident', icon: 'fas fa-car-crash' },
            other: { name: 'Other Emergency', icon: 'fas fa-exclamation-triangle' }
        };
        
        return typeInfo[type] || typeInfo.other;
    }
    

    
    /**
     * Show notification
     */
    function showNotification(message) {
        console.log('Showing notification:', message);
        
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});