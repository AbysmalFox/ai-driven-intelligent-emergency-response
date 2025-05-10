/**
 * Admin Security Module
 * Handles secure authentication for admin users
 */
class AdminSecurity {
    constructor() {
        this.maxLoginAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes in milliseconds
        this.csrfToken = '';
        
        // Initialize
        this.init();
    }
    
    init() {
        // Generate CSRF token
        this.generateCSRFToken();
        
        // Set up event listeners
        document.getElementById('admin-login-form')?.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        
        // Initialize reCAPTCHA (if using Google reCAPTCHA)
        this.initRecaptcha();
        
        // Check for previous failed attempts
        this.checkLoginStatus();
    }
    
    /**
     * Generate a CSRF token and add it to the form
     */
    generateCSRFToken() {
        // Generate a random token
        const token = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
        
        // Store in session storage
        sessionStorage.setItem('csrfToken', token);
        
        // Add to form
        const tokenInput = document.getElementById('csrf-token');
        if (tokenInput) {
            tokenInput.value = token;
        }
        
        this.csrfToken = token;
    }
    
    /**
     * Initialize reCAPTCHA
     */
    initRecaptcha() {
        // If using Google reCAPTCHA, you would initialize it here
        // This is a placeholder for where you would add the actual reCAPTCHA code
        const recaptchaContainer = document.getElementById('recaptcha-container');
        if (recaptchaContainer) {
            // Example placeholder - replace with actual reCAPTCHA implementation
            recaptchaContainer.innerHTML = `
                <div class="captcha-placeholder">
                    <label>
                        <input type="checkbox" id="captcha-checkbox"> I'm not a robot
                    </label>
                </div>
            `;
        }
    }
    
    /**
     * Check if user is currently locked out
     */
    checkLoginStatus() {
        const lockoutUntil = localStorage.getItem('adminLockoutUntil');
        const attempts = localStorage.getItem('adminLoginAttempts') || 0;
        
        // Update attempts counter in form
        document.getElementById('login-attempts').value = attempts;
        
        if (lockoutUntil && new Date().getTime() < parseInt(lockoutUntil)) {
            // User is locked out
            this.showLockoutMessage(parseInt(lockoutUntil));
        }
    }
    
    /**
     * Show lockout message with countdown
     * @param {number} lockoutUntil - Timestamp when lockout ends
     */
    showLockoutMessage(lockoutUntil) {
        const errorElement = document.getElementById('login-error');
        if (!errorElement) return;
        
        errorElement.style.display = 'block';
        
        // Calculate remaining time
        const updateMessage = () => {
            const now = new Date().getTime();
            const remainingMs = lockoutUntil - now;
            
            if (remainingMs <= 0) {
                // Lockout period is over
                errorElement.style.display = 'none';
                localStorage.removeItem('adminLockoutUntil');
                localStorage.setItem('adminLoginAttempts', '0');
                clearInterval(interval);
                return;
            }
            
            // Format remaining time
            const minutes = Math.floor(remainingMs / (60 * 1000));
            const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
            
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                Too many failed attempts. Please try again in ${minutes}m ${seconds}s.
            `;
        };
        
        // Update immediately and then every second
        updateMessage();
        const interval = setInterval(updateMessage, 1000);
    }
    
    /**
     * Handle login form submission
     * @param {Event} e - Form submit event
     */
    handleLoginSubmit(e) {
        e.preventDefault();
        
        // Check if user is locked out
        const lockoutUntil = localStorage.getItem('adminLockoutUntil');
        if (lockoutUntil && new Date().getTime() < parseInt(lockoutUntil)) {
            // Still locked out
            this.showLockoutMessage(parseInt(lockoutUntil));
            return;
        }
        
        // Verify CSRF token
        const formToken = document.getElementById('csrf-token').value;
        const storedToken = sessionStorage.getItem('csrfToken');
        
        if (formToken !== storedToken) {
            this.showError('Security validation failed. Please refresh the page and try again.');
            return;
        }
        
        // Verify captcha (simplified example)
        const captchaChecked = document.getElementById('captcha-checkbox')?.checked;
        if (!captchaChecked) {
            this.showError('Please complete the CAPTCHA verification.');
            return;
        }
        
        // Get form data
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        // Perform login (this would typically be an API call)
        this.performLogin(username, password);
    }
    
    /**
     * Perform the actual login
     * @param {string} username - Admin username
     * @param {string} password - Admin password
     */
    performLogin(username, password) {
        // This is where you would make your actual authentication request
        // For demo purposes, we'll simulate a login check
        
        // IMPORTANT: In a real application, NEVER store credentials in client-side code
        // This is just for demonstration - you should use a secure backend API
        const isValid = (username === 'admin' && password === 'securepassword');
        
        if (isValid) {
            // Successful login
            this.handleSuccessfulLogin();
        } else {
            // Failed login
            this.handleFailedLogin();
        }
    }
    
    /**
     * Handle successful login
     */
    handleSuccessfulLogin() {
        // Reset login attempts
        localStorage.removeItem('adminLockoutUntil');
        localStorage.setItem('adminLoginAttempts', '0');
        
        // Set authentication token/session
        const authToken = this.generateAuthToken();
        sessionStorage.setItem('adminAuthToken', authToken);
        
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
    }
    
    /**
     * Generate authentication token
     * @returns {string} Authentication token
     */
    generateAuthToken() {
        // In a real application, this would be a JWT or similar token from your server
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15) + 
               Date.now().toString(36);
    }
    
    /**
     * Handle failed login attempt
     */
    handleFailedLogin() {
        // Increment failed attempts
        const attempts = parseInt(localStorage.getItem('adminLoginAttempts') || '0') + 1;
        localStorage.setItem('adminLoginAttempts', attempts.toString());
        
        // Check if max attempts reached
        if (attempts >= this.maxLoginAttempts) {
            // Lock the account
            const lockoutUntil = new Date().getTime() + this.lockoutTime;
            localStorage.setItem('adminLockoutUntil', lockoutUntil.toString());
            
            // Show lockout message
            this.showLockoutMessage(lockoutUntil);
        } else {
            // Show error with attempts remaining
            this.showError(`Invalid username or password. ${this.maxLoginAttempts - attempts} attempts remaining.`);
        }
        
        // Generate new CSRF token for next attempt
        this.generateCSRFToken();
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
            errorElement.style.display = 'block';
        }
    }
}

// Initialize admin security when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on pages with admin login
    if (document.getElementById('admin-login-modal')) {
        window.adminSecurity = new AdminSecurity();
    }
});