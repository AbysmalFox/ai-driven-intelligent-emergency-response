// Admin credentials (in a real app, this would be handled server-side)
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminLoginForm = document.getElementById('admin-login-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const loginError = document.getElementById('login-error');

    // Add modal overlay to the body
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);

    // Check if we're on the main page with the admin login button
    if (adminLoginBtn) {
        // Event Listeners
        adminLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Admin login button clicked'); // Debug log
            showModal();
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', hideModal);
        }
        
        modalOverlay.addEventListener('click', hideModal);

        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('admin-username').value;
                const password = document.getElementById('admin-password').value;
                
                // Validate credentials
                if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                    // Login successful
                    hideModal();
                    loginSuccess();
                } else {
                    // Login failed
                    if (loginError) {
                        loginError.textContent = "Invalid username or password";
                        loginError.style.display = "block";
                    }
                    
                    // Shake the form to indicate error
                    adminLoginForm.classList.add('shake');
                    setTimeout(() => {
                        adminLoginForm.classList.remove('shake');
                    }, 500);
                }
            });
        }

        // Functions
        function showModal() {
            console.log('Showing modal'); // Debug log
            if (adminLoginModal) {
                adminLoginModal.classList.add('show');
                modalOverlay.classList.add('show');
                
                // Clear previous login attempts
                if (adminLoginForm) {
                    adminLoginForm.reset();
                }
                
                if (loginError) {
                    loginError.style.display = "none";
                }
                
                // Focus on username field
                setTimeout(() => {
                    const usernameField = document.getElementById('admin-username');
                    if (usernameField) {
                        usernameField.focus();
                    }
                }, 300);
            } else {
                console.error('Admin login modal not found in the DOM');
            }
        }

        function hideModal() {
            if (adminLoginModal) {
                adminLoginModal.classList.remove('show');
                modalOverlay.classList.remove('show');
            }
        }

        function loginSuccess() {
            // Redirect to admin dashboard page
            window.location.href = 'adminDashboard.html';
        }
    }

    // Check if we're on the admin dashboard page
    const adminLogoutBtn = document.getElementById('admin-logout');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            // Redirect back to the main page
            window.location.href = 'index.html';
        });
        
        // Load admin data when on admin dashboard
        loadAdminData();
    }
});

function loadAdminData() {
    // This is a placeholder function that would normally fetch data from a server
    // For now, we'll just simulate some data
    
    // Update stats
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 3) {
        statValues[0].textContent = "0";
        statValues[1].textContent = "0";
        statValues[2].textContent = "0";
    }
    
    // In a real application, you would fetch reports from a database
    // and populate the table
}

// Helper functions to show/hide sections
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden-section');
        section.classList.add('active-section');
    }
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('hidden-section');
        section.classList.remove('active-section');
    }
}

// Add shake animation for login errors
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
`;
document.head.appendChild(style);

/**
 * Admin Dashboard Module
 * Handles admin dashboard functionality for emergency reports
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard module loaded');
    
    // Get references to important elements
    const reportsTableBody = document.getElementById('reports-table-body');
    const filterType = document.getElementById('filter-type');
    const filterStatus = document.getElementById('filter-status');
    const searchReports = document.getElementById('search-reports');
    const totalReportsStat = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const pendingReportsStat = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const resolvedReportsStat = document.querySelector('.stat-card:nth-child(3) .stat-value');
    
    // Location map modal elements
    const locationMapModal = document.getElementById('location-map-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Add event listeners for the close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (locationMapModal) {
                locationMapModal.classList.remove('show');
                document.querySelector('.modal-overlay').classList.remove('show');
            }
        });
    });
    
    // Current filters
    const currentFilters = {
        type: 'all',
        status: 'all',
        search: ''
    };
    
    // Initialize the dashboard
    initDashboard();
    
    // Add event listeners for filters
    if (filterType) {
        filterType.addEventListener('change', function() {
            currentFilters.type = this.value;
            loadFilteredReports();
        });
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            currentFilters.status = this.value;
            loadFilteredReports();
        });
    }
    
    if (searchReports) {
        searchReports.addEventListener('input', function() {
            currentFilters.search = this.value;
            loadFilteredReports();
        });
    }
    
    // Add event listener for logout button
    const logoutButton = document.getElementById('admin-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // In a real app, you would handle logout logic here
            window.location.href = 'index.html';
        });
    }
    
    /**
     * Initialize the dashboard
     */
    function initDashboard() {
        loadFilteredReports();
    }
    
    /**
     * Load reports based on current filters
     */
    function loadFilteredReports() {
        if (window.dbOperations) {
            window.dbOperations.getFilteredReports(currentFilters)
                .then(reports => {
                    displayReports(reports);
                    updateStats(reports);
                })
                .catch(error => {
                    console.error('Error loading filtered reports:', error);
                    showErrorMessage('Failed to load reports. Please try again.');
                });
        } else {
            console.error('Database operations not available');
            showErrorMessage('Database connection failed. Please refresh the page.');
        }
    }
    
    /**
     * Display reports in the table
     */
    function displayReports(reports) {
        if (!reportsTableBody) {
            console.error('Reports table body not found');
            return;
        }
        
        // Clear existing rows
        reportsTableBody.innerHTML = '';
        
        if (reports.length === 0) {
            // Show no reports message
            const noReportsRow = document.createElement('tr');
            noReportsRow.innerHTML = `
                <td colspan="7" class="no-reports-message">
                    <i class="fas fa-info-circle"></i> No reports found matching your criteria
                </td>
            `;
            reportsTableBody.appendChild(noReportsRow);
            return;
        }
        
        // Add reports to table
        reports.forEach(report => {
            const row = createReportRow(report);
            reportsTableBody.appendChild(row);
        });
        
        // Add event listeners for status change buttons
        document.querySelectorAll('.status-change-btn').forEach(button => {
            button.addEventListener('click', function() {
                const reportId = this.dataset.reportId;
                const newStatus = this.dataset.status;
                updateReportStatus(reportId, newStatus);
            });
        });
    }
    
    /**
     * Create a table row for a report
     */
    function createReportRow(report) {
        const row = document.createElement('tr');
        row.className = `report-row ${report.type}-report`;
        
        // Get emergency type info
        const typeInfo = getEmergencyTypeInfo(report.type);
        
        // Format the status with appropriate styling
        let statusClass = '';
        switch(report.status.toLowerCase()) {
            case 'pending':
                statusClass = 'status-pending';
                break;
            case 'in progress':
            case 'in-progress':
                statusClass = 'status-in-progress';
                break;
            case 'resolved':
                statusClass = 'status-resolved';
                break;
            default:
                statusClass = 'status-pending';
        }
        
        row.innerHTML = `
            <td class="report-id">${report.id}</td>
            <td class="report-type">
                <i class="${typeInfo.icon}"></i> ${typeInfo.name}
            </td>
            <td class="report-reporter">${report.reporter}</td>
            <td class="report-location" title="${report.location}">
                ${report.location.length > 20 ? report.location.substring(0, 20) + '...' : report.location}
            </td>
            <td class="report-status ${statusClass}">${report.status}</td>
            <td class="report-time">${report.timestamp}</td>
            <td class="report-actions">
                <div class="actions-container">
                    <div class="actions-left-border"></div>
                    <div class="actions-content">
                        <button class="action-btn view-btn" data-report-id="${report.id}" title="View Details" >
                            <i class="fas fa-eye"></i>
                        </button>

                        <div class="status-dropdown">
                            <button class="action-btn status-btn" title="Change Status" >
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="status-dropdown-content" style="z-index: 100;">
                                <button class="status-change-btn" data-report-id="${report.id}" data-status="Pending">
                                    <span class="status-dot pending-dot"></span> Pending
                                </button>
                                <button class="status-change-btn" data-report-id="${report.id}" data-status="In Progress">
                                    <span class="status-dot progress-dot"></span> In Progress
                                </button>
                                <button class="status-change-btn" data-report-id="${report.id}" data-status="Resolved">
                                    <span class="status-dot resolved-dot"></span> Resolved
                                </button>
                            </div>
                        </div>
                        <button class="action-btn delete-btn" data-report-id="${report.id}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="actions-right-border"></div>
                </div>
            </td>
        `;
        
        // Add event listener for view button
        const viewBtn = row.querySelector('.view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                showReportDetails(report);
            });
        }
        
        // Add event listener for delete button
        const deleteBtn = row.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                deleteReport(report.id);
            });
        }
        

        
        return row;
    }
    
    /**
     * Update report status
     */
    function updateReportStatus(reportId, newStatus) {
        if (window.dbOperations) {
            window.dbOperations.updateReportStatus(reportId, newStatus)
                .then(() => {
                    showNotification(`Report status updated to ${newStatus}`);
                    loadFilteredReports();
                })
                .catch(error => {
                    console.error('Error updating report status:', error);
                    showErrorMessage('Failed to update report status. Please try again.');
                });
        } else {
            console.error('Database operations not available');
            showErrorMessage('Database connection failed. Please refresh the page.');
        }
    }
    
    /**
     * Delete a report
     */
    function deleteReport(reportId) {
        if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            if (window.dbOperations) {
                window.dbOperations.deleteReport(reportId)
                    .then(() => {
                        showNotification('Report deleted successfully');
                        loadFilteredReports();
                    })
                    .catch(error => {
                        console.error('Error deleting report:', error);
                        showErrorMessage('Failed to delete report. Please try again.');
                    });
            } else {
                console.error('Database operations not available');
                showErrorMessage('Database connection failed. Please refresh the page.');
            }
        }
    }
    
    /**
     * Show report details in a slide-in panel
     */
    function showReportDetails(report) {
        console.log('Showing report details:', report);
        
        // Create slide panel if it doesn't exist
        let slidePanel = document.getElementById('report-details-panel');
        if (!slidePanel) {
            slidePanel = document.createElement('div');
            slidePanel.id = 'report-details-panel';
            slidePanel.className = 'slide-panel';
            document.body.appendChild(slidePanel);
        }
        
        // Get emergency type info
        const typeInfo = getEmergencyTypeInfo(report.type);
        
        // Format coordinates
        const coordinates = report.coordinates && report.coordinates.latitude && report.coordinates.longitude
            ? `${report.coordinates.latitude}, ${report.coordinates.longitude}`
            : 'Not available';
        
        // Format media files
        let mediaFilesHtml = '';
        if (report.mediaFiles && report.mediaFiles.length > 0) {
            mediaFilesHtml = `
                <div class="report-detail-section">
                    <h4>Media Files</h4>
                    <div class="media-files-list">
                        ${report.mediaFiles.map(file => `<div class="media-file">${file}</div>`).join('')}
                    </div>
                </div>
            `;
        }
        
        // Set panel content
        slidePanel.innerHTML = `
            <div class="panel-content">
                <div class="panel-header ${report.type}-header">
                    <h3><i class="${typeInfo.icon}"></i> ${typeInfo.name} Report</h3>
                    <button class="close-panel">&times;</button>
                </div>
                <div class="panel-body">
                    <div class="report-detail-section">
                        <h4>Report ID</h4>
                        <p>${report.id}</p>
                    </div>
                    <div class="report-detail-section">
                        <h4>Status</h4>
                        <p class="status-badge status-${report.status.toLowerCase().replace(' ', '-')}">${report.status}</p>
                    </div>
                    <div class="report-detail-section">
                        <h4>Reporter</h4>
                        <p>${report.reporter || 'Anonymous'}</p>
                    </div>
                    <div class="report-detail-section">
                        <h4>Reported On</h4>
                        <p>${report.timestamp}</p>
                    </div>
                    <div class="report-detail-section">
                        <h4>Location</h4>
                        <p>${report.location}</p>
                    </div>
                    <div class="report-detail-section">
                        <h4>Coordinates</h4>
                        <p>${coordinates}</p>
                    </div>
                    <div class="report-detail-section">
                        <h4>Map Location</h4>
                        <div id="report-location-map" class="report-map-container" style="height: 250px; width: 100%; margin-top: 10px;"></div>
                    </div>
                    <div class="report-detail-section">
                        <h4>Description</h4>
                        <p>${report.description || 'No description provided'}</p>
                    </div>
                    ${mediaFilesHtml}
                </div>
                <div class="panel-footer">
                    <button class="primary-btn close-btn">Close</button>
                </div>
            </div>
        `;
        
        // Show the panel with animation
        setTimeout(() => {
            slidePanel.classList.add('active');
        }, 10);
        
        // Add event listeners for close buttons
        const closeButtons = slidePanel.querySelectorAll('.close-panel, .close-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                slidePanel.classList.remove('active');
            });
        });
        
        // Initialize map after panel is shown
        setTimeout(() => {
            initializeReportMap(report);
        }, 300);
    }
    
    /**
     * Initialize map with the report location
     */
    function initializeReportMap(report) {
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet library is not loaded.');
            const mapContainer = document.getElementById('report-location-map');
            if (mapContainer) {
                mapContainer.innerHTML = '<p style="text-align:center; padding:20px; color: red;">Map library (Leaflet) could not be loaded. Please check your internet connection.</p>';
            }
            return;
        }
        
        // Get map container
        const mapContainer = document.getElementById('report-location-map');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }
        
        // Extract coordinates from report
        let lat, lng;
        
        if (report.coordinates && report.coordinates.latitude && report.coordinates.longitude) {
            lat = parseFloat(report.coordinates.latitude);
            lng = parseFloat(report.coordinates.longitude);
        } else {
            // Try to extract from coordinates string if available
            const coordStr = document.querySelector('.report-detail-section:nth-of-type(6) p').textContent;
            const coordMatch = coordStr.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
            
            if (coordMatch) {
                lat = parseFloat(coordMatch[1]);
                lng = parseFloat(coordMatch[2]);
            } else {
                // Default coordinates (center of map) if not available
                lat = 14.5995;  // Default to Manila, Philippines
                lng = 120.9842;
                
                // Show error message in map
                mapContainer.innerHTML = '<p style="text-align:center; padding:20px; color: orange;">Exact coordinates not available. Showing approximate location.</p>';
                return;
            }
        }
        
        // Create map
        const map = L.map('report-location-map').setView([lat, lng], 15);
        
        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add marker at the emergency location
        const marker = L.marker([lat, lng]).addTo(map);
        
        // Add popup with emergency information
        marker.bindPopup(`<b>${getEmergencyTypeInfo(report.type).name} Emergency</b><br>${report.location}`).openPopup();
        
        // Add circle to indicate the area
        L.circle([lat, lng], {
            color: getEmergencyColor(report.type),
            fillColor: getEmergencyColor(report.type),
            fillOpacity: 0.2,
            radius: 200
        }).addTo(map);
        
        // Force a resize of the map to ensure it renders correctly
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
    
    /**
     * Get color for emergency type
     */
    function getEmergencyColor(type) {
        switch(type.toLowerCase()) {
            case 'fire':
                return '#ff4d4d';  // Red
            case 'medical':
                return '#4da6ff';  // Blue
            case 'police':
                return '#668cff';  // Blue-purple
            case 'traffic':
                return '#ffaa00';  // Orange
            case 'natural':
                return '#00cc44';  // Green
            default:
                return '#8c8c8c';  // Gray
        }
    }
    
    /**
     * Update dashboard statistics
     */
    function updateStats(reports) {
        if (!totalReportsStat || !pendingReportsStat || !resolvedReportsStat) {
            console.error('Stat elements not found');
            return;
        }
        
        const totalReports = reports.length;
        const pendingReports = reports.filter(report => 
            report.status.toLowerCase() === 'pending'
        ).length;
        const resolvedReports = reports.filter(report => 
            report.status.toLowerCase() === 'resolved'
        ).length;
        
        totalReportsStat.textContent = totalReports;
        pendingReportsStat.textContent = pendingReports;
        resolvedReportsStat.textContent = resolvedReports;
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
        let notification = document.querySelector('.admin-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'admin-notification';
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
    
    /**
     * Show error message
     */
    function showErrorMessage(message) {
        showNotification(message);
    }
    
    
    // Add event listener for modal overlay to close the modal
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('modal-overlay')) {
            if (locationMapModal) {
                locationMapModal.classList.remove('show');
                e.target.classList.remove('show');
            }
        }
    });
});

    /**
     * Filter reports based on current filter settings
     */
    function filterReports(reports) {
        const typeFilter = document.getElementById('filter-type').value;
        const statusFilter = document.getElementById('filter-status').value;
        const searchQuery = document.getElementById('search-reports').value.toLowerCase();
        
        return reports.filter(report => {
            // Filter by type
            if (typeFilter !== 'all' && report.type !== typeFilter) {
                return false;
            }
            
            // Filter by status (case-insensitive comparison)
            if (statusFilter !== 'all') {
                const reportStatus = report.status.toLowerCase().replace(' ', '-');
                if (reportStatus !== statusFilter) {
                    return false;
                }
            }
            
            // Filter by search query
            if (searchQuery) {
                const searchableText = `${report.id} ${report.type} ${report.reporter} ${report.location} ${report.status}`.toLowerCase();
                if (!searchableText.includes(searchQuery)) {
                    return false;
                }
            }
            
            return true;
        });
    }

// Tab navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation items
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    
    // Add click event listener to each nav item
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the section ID from the data-section attribute
            const sectionId = this.getAttribute('data-section');
            
            // Hide all sections
            document.querySelectorAll('main section').forEach(section => {
                section.classList.remove('active-section');
                section.classList.add('hidden-section');
            });
            
            // Show the selected section
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.remove('hidden-section');
                selectedSection.classList.add('active-section');
                
                // If statistics section is activated, initialize charts
                if (sectionId === 'admin-statistics') {
                    initializeStatisticsCharts();
                }
            }
            
            // Update active state on nav items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            this.classList.add('active');
        });
    });
});

/**
 * Initialize all statistics charts
 */
function initializeStatisticsCharts() {
    // Get all reports first
    if (window.dbOperations) {
        window.dbOperations.getAllReports()
            .then(reports => {
                createEmergencyTypeChart(reports);
                createStatusChart(reports);
                createTimelineChart(reports);
                createResponseTimeChart(reports);
                createUrgencyScatterChart(reports);
                populateTopLocationsTable(reports);
                populateUserActivityTable(reports);
            })
            .catch(error => {
                console.error('Error fetching reports for statistics:', error);
                showErrorMessage('Failed to load statistics data. Please try again.');
            });
    } else {
        console.error('Database operations not available');
        showErrorMessage('Database connection failed. Please refresh the page.');
    }
}

/**
 * Create pie chart for emergency types
 */
function createEmergencyTypeChart(reports) {
    const canvas = document.getElementById('emergencyTypeChart');
    if (!canvas) return;
    
    // Count reports by type
    const typeCounts = {
        medical: 0,
        fire: 0,
        police: 0,
        disaster: 0,
        traffic: 0,
        other: 0
    };
    
    reports.forEach(report => {
        if (typeCounts.hasOwnProperty(report.type)) {
            typeCounts[report.type]++;
        } else {
            typeCounts.other++;
        }
    });
    
    // Create chart
    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Medical', 'Fire', 'Police', 'Natural Disaster', 'Traffic Accident', 'Other'],
            datasets: [{
                data: [
                    typeCounts.medical,
                    typeCounts.fire,
                    typeCounts.police,
                    typeCounts.disaster,
                    typeCounts.traffic,
                    typeCounts.other
                ],
                backgroundColor: [
                    '#e91e63', // Medical
                    '#f44336', // Fire
                    '#3f51b5', // Police
                    '#2196f3', // Disaster
                    '#ff9800', // Traffic
                    '#607d8b'  // Other
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Emergency Types'
                }
            }
        }
    });
}

/**
 * Create pie chart for report statuses
 */
function createStatusChart(reports) {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    
    // Count reports by status
    const statusCounts = {
        pending: 0,
        'in progress': 0,
        resolved: 0
    };
    
    reports.forEach(report => {
        const status = report.status.toLowerCase();
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        } else {
            // Handle any unexpected status values
            console.warn('Unexpected status:', report.status);
        }
    });
    
    // Create chart
    new Chart(canvas, {
        type: 'pie',
        data: {
            labels: ['Pending', 'In Progress', 'Resolved'],
            datasets: [{
                data: [
                    statusCounts.pending,
                    statusCounts['in progress'],
                    statusCounts.resolved
                ],
                backgroundColor: [
                    '#f57c00', // Pending
                    '#1976d2', // In Progress
                    '#388e3c'  // Resolved
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Report Status Distribution'
                }
            }
        }
    });
}

/**
 * Create timeline chart for reports over time
 */
function createTimelineChart(reports) {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) return;
    
    // Group reports by date
    const reportsByDate = {};
    
    reports.forEach(report => {
        // Extract date part only (without time)
        const date = new Date(report.timestamp).toLocaleDateString();
        
        if (!reportsByDate[date]) {
            reportsByDate[date] = 1;
        } else {
            reportsByDate[date]++;
        }
    });
    
    // Sort dates
    const sortedDates = Object.keys(reportsByDate).sort((a, b) => new Date(a) - new Date(b));
    
    // Create chart
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: sortedDates,
            datasets: [{
                label: 'Number of Reports',
                data: sortedDates.map(date => reportsByDate[date]),
                borderColor: '#3f51b5',
                backgroundColor: 'rgba(63, 81, 181, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Reports Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Reports'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

/**
 * Create bar chart for response time analysis
 */
function createResponseTimeChart(reports) {
    const canvas = document.getElementById('responseTimeChart');
    if (!canvas) return;
    
    // For this chart, we'll simulate response times
    // In a real app, you would track when a report status changes from pending to in-progress
    
    // Group by emergency type
    const responseTimeByType = {
        medical: Math.floor(Math.random() * 10) + 5,
        fire: Math.floor(Math.random() * 5) + 2,
        police: Math.floor(Math.random() * 15) + 10,
        disaster: Math.floor(Math.random() * 20) + 15,
        traffic: Math.floor(Math.random() * 12) + 8,
        other: Math.floor(Math.random() * 25) + 20
    };
    
    // Create chart
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Medical', 'Fire', 'Police', 'Natural Disaster', 'Traffic Accident', 'Other'],
            datasets: [{
                label: 'Average Response Time (minutes)',
                data: [
                    responseTimeByType.medical,
                    responseTimeByType.fire,
                    responseTimeByType.police,
                    responseTimeByType.disaster,
                    responseTimeByType.traffic,
                    responseTimeByType.other
                ],
                backgroundColor: [
                    '#e91e63', // Medical
                    '#f44336', // Fire
                    '#3f51b5', // Police
                    '#2196f3', // Disaster
                    '#ff9800', // Traffic
                    '#607d8b'  // Other
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Response Time by Emergency Type'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

/**
 * Populate top locations table
 */
function populateTopLocationsTable(reports) {
    const tableBody = document.querySelector('#top-locations-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Count reports by location
    const locationCounts = {};
    const totalReports = reports.length;
    
    reports.forEach(report => {
        if (!locationCounts[report.location]) {
            locationCounts[report.location] = 1;
        } else {
            locationCounts[report.location]++;
        }
    });
    
    // Sort locations by count (descending)
    const sortedLocations = Object.keys(locationCounts).sort((a, b) => 
        locationCounts[b] - locationCounts[a]
    );
    
    // Take top 5 locations
    const topLocations = sortedLocations.slice(0, 5);
    
    // Create table rows
    topLocations.forEach(location => {
        const count = locationCounts[location];
        const percentage = ((count / totalReports) * 100).toFixed(1);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${location}</td>
            <td>${count}</td>
            <td>${percentage}%</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add "Other" row if there are more than 5 locations
    if (sortedLocations.length > 5) {
        const otherCount = sortedLocations.slice(5).reduce((sum, location) => 
            sum + locationCounts[location], 0
        );
        const otherPercentage = ((otherCount / totalReports) * 100).toFixed(1);
        
        const otherRow = document.createElement('tr');
        otherRow.innerHTML = `
            <td>Other Locations</td>
            <td>${otherCount}</td>
            <td>${otherPercentage}%</td>
        `;
        
        tableBody.appendChild(otherRow);
    }
}

/**
 * Populate user activity table
 */
function populateUserActivityTable(reports) {
    const tableBody = document.querySelector('#user-activity-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Group reports by user
    const userReports = {};
    
    reports.forEach(report => {
        const user = report.reporter || 'Anonymous';
        
        if (!userReports[user]) {
            userReports[user] = {
                count: 1,
                lastReport: new Date(report.timestamp)
            };
        } else {
            userReports[user].count++;
            const reportDate = new Date(report.timestamp);
            if (reportDate > userReports[user].lastReport) {
                userReports[user].lastReport = reportDate;
            }
        }
    });
    
    // Sort users by report count (descending)
    const sortedUsers = Object.keys(userReports).sort((a, b) => 
        userReports[b].count - userReports[a].count
    );
    
    // Take top 10 users
    const topUsers = sortedUsers.slice(0, 10);
    
    // Create table rows
    topUsers.forEach(user => {
        const userData = userReports[user];
        const lastReportDate = userData.lastReport.toLocaleDateString();
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user}</td>
            <td>${userData.count}</td>
            <td>${lastReportDate}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Create scatter chart for emergency urgency levels
 */
function createUrgencyScatterChart(reports) {
    const canvas = document.getElementById('urgencyScatterChart');
    if (!canvas) return;
    
    // Prepare data for scatter plot
    // X-axis: Emergency type
    // Y-axis: Time of day
    // Point size and color: Urgency level
    
    const scatterData = {
        high: [],
        medium: [],
        low: []
    };
    
    const emergencyTypes = ['medical', 'fire', 'police', 'disaster', 'traffic', 'other'];
    
    reports.forEach(report => {
        // Determine urgency level based on type and description
        let urgencyLevel = 'medium'; // default
        
        // Simulate urgency level based on emergency type
        if (report.type === 'fire' || report.type === 'disaster') {
            urgencyLevel = 'high';
        } else if (report.type === 'traffic' || report.type === 'other') {
            urgencyLevel = 'low';
        }
        
        // Check description for keywords that might indicate higher urgency
        if (report.description) {
            const description = report.description.toLowerCase();
            if (description.includes('severe') || 
                description.includes('critical') || 
                description.includes('urgent') ||
                description.includes('life-threatening')) {
                urgencyLevel = 'high';
            }
        }
        
        // Get x position based on emergency type
        const xPosition = emergencyTypes.indexOf(report.type) + 1;
        
        // Get y position based on time (hours of day)
        const reportDate = new Date(report.timestamp);
        const hoursOfDay = reportDate.getHours() + (reportDate.getMinutes() / 60);
        
        // Add data point to appropriate urgency level array
        scatterData[urgencyLevel].push({
            x: xPosition,
            y: hoursOfDay,
            id: report.id,
            type: report.type,
            location: report.location
        });
    });
    
    // Create chart
    new Chart(canvas, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'High Urgency',
                    data: scatterData.high,
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    pointRadius: 10,
                    pointHoverRadius: 12
                },
                {
                    label: 'Medium Urgency',
                    data: scatterData.medium,
                    backgroundColor: 'rgba(255, 165, 0, 0.7)',
                    pointRadius: 8,
                    pointHoverRadius: 10
                },
                {
                    label: 'Low Urgency',
                    data: scatterData.low,
                    backgroundColor: 'rgba(0, 128, 0, 0.7)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0,
                    max: 7,
                    ticks: {
                        callback: function(value) {
                            if (value === 0) return '';
                            const types = ['', 'Medical', 'Fire', 'Police', 'Disaster', 'Traffic', 'Other'];
                            return types[value];
                        }
                    },
                    title: {
                        display: true,
                        text: 'Emergency Type'
                    }
                },
                y: {
                    min: 0,
                    max: 24,
                    title: {
                        display: true,
                        text: 'Time of Day (24h)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const data = context.raw;
                            const types = ['', 'Medical', 'Fire', 'Police', 'Disaster', 'Traffic', 'Other'];
                            const hours = Math.floor(data.y);
                            const minutes = Math.round((data.y - hours) * 60);
                            const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
                            
                            return [
                                `Report ID: ${data.id}`,
                                `Type: ${types[data.x]}`,
                                `Time: ${timeStr}`,
                                `Location: ${data.location}`
                            ];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Emergency Urgency Distribution'
                }
            }
        }
    });
}


