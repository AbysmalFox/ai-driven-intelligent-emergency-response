/**
 * Database Configuration Module
 * Handles database connection and operations for emergency reports
 */

// Initialize the database connection
const initDatabase = () => {
    return new Promise((resolve, reject) => {
        // Check if IndexedDB is supported
        if (!window.indexedDB) {
            console.error("Your browser doesn't support IndexedDB. Falling back to localStorage.");
            reject("IndexedDB not supported");
            return;
        }

        // Open a connection to the database
        const request = indexedDB.open("EmergencyResponseDB", 1);

        // Handle database upgrade (first time or version change)
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object store for emergency reports if it doesn't exist
            if (!db.objectStoreNames.contains("emergencyReports")) {
                const store = db.createObjectStore("emergencyReports", { keyPath: "id" });
                
                // Create indexes for common search fields
                store.createIndex("type", "type", { unique: false });
                store.createIndex("status", "status", { unique: false });
                store.createIndex("timestamp", "timestamp", { unique: false });
                store.createIndex("reporter", "reporter", { unique: false });
            }
            
            console.log("Database setup complete");
        };

        // Handle successful database open
        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log("Database connected successfully");
            resolve(db);
        };

        // Handle database connection errors
        request.onerror = (event) => {
            console.error("Database error:", event.target.error);
            reject("Error connecting to database");
        };
    });
};

// Database operations object
const dbOperations = {
    // Save a report to the database
    saveReport: (report) => {
        return new Promise((resolve, reject) => {
            initDatabase().then(db => {
                const transaction = db.transaction(["emergencyReports"], "readwrite");
                const store = transaction.objectStore("emergencyReports");
                
                const request = store.add(report);
                
                request.onsuccess = () => {
                    console.log("Report saved to database:", report.id);
                    resolve(report);
                };
                
                request.onerror = (event) => {
                    console.error("Error saving report:", event.target.error);
                    reject("Failed to save report");
                };
                
                transaction.oncomplete = () => {
                    db.close();
                };
            }).catch(error => {
                console.error("Database connection error:", error);
                reject(error);
            });
        });
    },
    
    // Get all reports from the database
    getAllReports: () => {
        return new Promise((resolve, reject) => {
            initDatabase().then(db => {
                const transaction = db.transaction(["emergencyReports"], "readonly");
                const store = transaction.objectStore("emergencyReports");
                const index = store.index("timestamp");
                
                const request = index.openCursor(null, "prev"); // Get in reverse chronological order
                const reports = [];
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        reports.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(reports);
                    }
                };
                
                request.onerror = (event) => {
                    console.error("Error getting reports:", event.target.error);
                    reject("Failed to get reports");
                };
                
                transaction.oncomplete = () => {
                    db.close();
                };
            }).catch(error => {
                console.error("Database connection error:", error);
                reject(error);
            });
        });
    },
    
    // Delete a report from the database
    deleteReport: (reportId) => {
        return new Promise((resolve, reject) => {
            initDatabase().then(db => {
                const transaction = db.transaction(["emergencyReports"], "readwrite");
                const store = transaction.objectStore("emergencyReports");
                
                const request = store.delete(reportId);
                
                request.onsuccess = () => {
                    console.log("Report deleted from database:", reportId);
                    resolve(true);
                };
                
                request.onerror = (event) => {
                    console.error("Error deleting report:", event.target.error);
                    reject("Failed to delete report");
                };
                
                transaction.oncomplete = () => {
                    db.close();
                };
            }).catch(error => {
                console.error("Database connection error:", error);
                reject(error);
            });
        });
    },
    
    // Update a report's status
    updateReportStatus: (reportId, newStatus) => {
        return new Promise((resolve, reject) => {
            initDatabase().then(db => {
                const transaction = db.transaction(["emergencyReports"], "readwrite");
                const store = transaction.objectStore("emergencyReports");
                
                // First get the report
                const getRequest = store.get(reportId);
                
                getRequest.onsuccess = (event) => {
                    const report = event.target.result;
                    if (report) {
                        // Update the status
                        report.status = newStatus;
                        
                        // Put the updated report back
                        const updateRequest = store.put(report);
                        
                        updateRequest.onsuccess = () => {
                            console.log("Report status updated:", reportId, newStatus);
                            resolve(report);
                        };
                        
                        updateRequest.onerror = (event) => {
                            console.error("Error updating report:", event.target.error);
                            reject("Failed to update report");
                        };
                    } else {
                        reject("Report not found");
                    }
                };
                
                getRequest.onerror = (event) => {
                    console.error("Error getting report:", event.target.error);
                    reject("Failed to get report");
                };
                
                transaction.oncomplete = () => {
                    db.close();
                };
            }).catch(error => {
                console.error("Database connection error:", error);
                reject(error);
            });
        });
    },
    
    // Get reports filtered by type and/or status
    getFilteredReports: (filters) => {
        return new Promise((resolve, reject) => {
            dbOperations.getAllReports().then(reports => {
                let filteredReports = [...reports];
                
                // Filter by type if specified
                if (filters.type && filters.type !== 'all') {
                    filteredReports = filteredReports.filter(report => report.type === filters.type);
                }
                
                // Filter by status if specified
                if (filters.status && filters.status !== 'all') {
                    filteredReports = filteredReports.filter(report => report.status.toLowerCase() === filters.status);
                }
                
                // Filter by search term if specified
                if (filters.search && filters.search.trim() !== '') {
                    const searchTerm = filters.search.toLowerCase().trim();
                    filteredReports = filteredReports.filter(report => 
                        report.description.toLowerCase().includes(searchTerm) ||
                        report.location.toLowerCase().includes(searchTerm) ||
                        report.reporter.toLowerCase().includes(searchTerm)
                    );
                }
                
                resolve(filteredReports);
            }).catch(error => {
                reject(error);
            });
        });
    }
};

// Export the database operations
window.dbOperations = dbOperations;