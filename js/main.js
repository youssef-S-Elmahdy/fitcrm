/**
 * FitNile CRM - Main JavaScript File
 * Assignment 2: Adding interactivity and localStorage functionality
 */

// ===================================
// GLOBAL VARIABLES AND STATE
// ===================================

let clients = [];
let currentEditId = null;
let currentViewId = null;
let currentViewClientId = null;

// ===================================
// LOCALSTORAGE UTILITIES
// ===================================

/**
 * Load clients from localStorage
 */
function loadClients() {
    const stored = localStorage.getItem('fitcrm_clients');
    if (stored) {
        try {
            clients = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing clients from localStorage:', e);
            clients = [];
        }
    } else {
        // Initialize with sample data if no data exists
        clients = getSampleClients();
        saveClients();
    }
}

/**
 * Save clients to localStorage
 */
function saveClients() {
    try {
        localStorage.setItem('fitcrm_clients', JSON.stringify(clients));
    } catch (e) {
        console.error('Error saving clients to localStorage:', e);
        alert('Error saving data. Your storage might be full.');
    }
}

/**
 * Get sample clients data (10 clients as per Assignment 1)
 */
function getSampleClients() {
    return [
        {
            id: generateId(),
            fullName: 'Ahmed Hassan',
            age: 28,
            gender: 'male',
            email: 'ahmed.hassan@email.com',
            phone: '+20 122 345 6789',
            goal: 'weight-loss',
            startDate: '2025-01-15',
            trainingHistory: [
                {
                    id: generateId(),
                    date: '2025-01-18',
                    type: 'Cardio Session',
                    duration: 45,
                    notes: 'Treadmill running and cycling. Great endurance progress!'
                },
                {
                    id: generateId(),
                    date: '2025-01-22',
                    type: 'HIIT Training',
                    duration: 30,
                    notes: 'High-intensity interval training. Client showed excellent stamina.'
                }
            ]
        },
        {
            id: generateId(),
            fullName: 'Fatima Ali',
            age: 32,
            gender: 'female',
            email: 'fatima.ali@email.com',
            phone: '+20 100 234 5678',
            goal: 'muscle-gain',
            startDate: '2025-02-01',
            trainingHistory: [
                {
                    id: generateId(),
                    date: '2025-02-05',
                    type: 'Strength Training',
                    duration: 60,
                    notes: 'Upper body workout with focus on chest and arms. Increased weights successfully.'
                }
            ]
        },
        {
            id: generateId(),
            fullName: 'Mohamed Ibrahim',
            age: 25,
            gender: 'male',
            email: 'mohamed.ibrahim@email.com',
            phone: '+20 111 876 5432',
            goal: 'general-fitness',
            startDate: '2025-01-20',
            trainingHistory: []
        },
        {
            id: generateId(),
            fullName: 'Sara Mahmoud',
            age: 29,
            gender: 'female',
            email: 'sara.mahmoud@email.com',
            phone: '+20 125 987 6543',
            goal: 'endurance',
            startDate: '2025-03-10',
            trainingHistory: []
        },
        {
            id: generateId(),
            fullName: 'Khaled Nasser',
            age: 35,
            gender: 'male',
            email: 'khaled.nasser@email.com',
            phone: '+20 101 234 5678',
            goal: 'strength',
            startDate: '2025-02-15',
            trainingHistory: []
        },
        {
            id: generateId(),
            fullName: 'Layla Abdel-Rahman',
            age: 27,
            gender: 'female',
            email: 'layla.rahman@email.com',
            phone: '+20 109 876 5432',
            goal: 'flexibility',
            startDate: '2025-01-05',
            trainingHistory: []
        },
        {
            id: generateId(),
            fullName: 'Omar Farouk',
            age: 30,
            gender: 'male',
            email: 'omar.farouk@email.com',
            phone: '+20 115 432 1098',
            goal: 'weight-loss',
            startDate: '2025-03-01',
            trainingHistory: []
        },
        {
            id: generateId(),
            fullName: 'Yasmine Samir',
            age: 26,
            gender: 'female',
            email: 'yasmine.samir@email.com',
            phone: '+20 128 765 4321',
            goal: 'muscle-gain',
            startDate: '2025-02-20',
            trainingHistory: []
        },
        {
            id: generateId(),
            fullName: 'Amr El-Shazly',
            age: 33,
            gender: 'male',
            email: 'amr.shazly@email.com',
            phone: '+20 106 543 2109',
            goal: 'general-fitness',
            startDate: '2025-01-25',
            trainingHistory: []
        },
        {
            id: generateId(),
            fullName: 'Nour Abdallah',
            age: 24,
            gender: 'female',
            email: 'nour.abdallah@email.com',
            phone: '+20 112 098 7654',
            goal: 'endurance',
            startDate: '2025-03-05',
            trainingHistory: []
        }
    ];
}

/**
 * Generate unique ID for clients
 */
function generateId() {
    return 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===================================
// FORM VALIDATION
// ===================================

/**
 * Validate full name
 */
function validateFullName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Full name is required' };
    }
    if (name.trim().length < 2) {
        return { valid: false, message: 'Full name must be at least 2 characters' };
    }
    if (!/^[a-zA-Z\s\-.']+$/.test(name)) {
        return { valid: false, message: 'Full name can only contain letters, spaces, hyphens, periods, and apostrophes' };
    }
    return { valid: true };
}

/**
 * Validate age
 */
function validateAge(age) {
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum)) {
        return { valid: false, message: 'Age is required' };
    }
    if (ageNum <= 0) {
        return { valid: false, message: 'Age must be greater than 0' };
    }
    if (ageNum < 16) {
        return { valid: false, message: 'Client must be at least 16 years old' };
    }
    if (ageNum > 120) {
        return { valid: false, message: 'Please enter a valid age' };
    }
    return { valid: true };
}

/**
 * Validate gender
 */
function validateGender(gender) {
    if (!gender || gender === '') {
        return { valid: false, message: 'Gender is required' };
    }
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(gender)) {
        return { valid: false, message: 'Please select a valid gender' };
    }
    return { valid: true };
}

/**
 * Validate email format
 */
function validateEmail(email) {
    if (!email || email.trim().length === 0) {
        return { valid: false, message: 'Email is required' };
    }
    // Comprehensive email regex pattern
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        return { valid: false, message: 'Please enter a valid email address (e.g., user@example.com)' };
    }
    return { valid: true };
}

/**
 * Validate phone number
 */
function validatePhone(phone) {
    if (!phone || phone.trim().length === 0) {
        return { valid: false, message: 'Phone number is required' };
    }
    // Remove spaces and special characters for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Accept Egyptian phone numbers (+20...) or international format
    const phonePattern = /^(\+\d{1,3})?\d{10,15}$/;
    if (!phonePattern.test(cleanPhone)) {
        return { valid: false, message: 'Please enter a valid phone number (e.g., +20 123 456 7890)' };
    }
    return { valid: true };
}

/**
 * Validate fitness goal
 */
function validateGoal(goal) {
    if (!goal || goal === '') {
        return { valid: false, message: 'Fitness goal is required' };
    }
    const validGoals = ['weight-loss', 'muscle-gain', 'general-fitness', 'endurance', 'flexibility', 'strength'];
    if (!validGoals.includes(goal)) {
        return { valid: false, message: 'Please select a valid fitness goal' };
    }
    return { valid: true };
}

/**
 * Validate start date
 */
function validateStartDate(startDate) {
    if (!startDate || startDate.trim().length === 0) {
        return { valid: false, message: 'Membership start date is required' };
    }
    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
        return { valid: false, message: 'Please enter a valid date' };
    }
    // Check if date is not too far in the past (more than 5 years)
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    if (date < fiveYearsAgo) {
        return { valid: false, message: 'Start date cannot be more than 5 years in the past' };
    }
    // Check if date is not in the future (more than 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (date > oneYearFromNow) {
        return { valid: false, message: 'Start date cannot be more than 1 year in the future' };
    }
    return { valid: true };
}

/**
 * Show validation error for a field
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Remove any existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error styling to field
    field.classList.add('error');

    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

/**
 * Clear validation error for a field
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('error');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Clear all validation errors
 */
function clearAllErrors() {
    const fields = ['fullName', 'age', 'gender', 'email', 'phone', 'goal', 'startDate'];
    fields.forEach(fieldId => clearFieldError(fieldId));
}

/**
 * Validate entire form
 */
function validateForm(formData) {
    const errors = [];

    const nameValidation = validateFullName(formData.fullName);
    if (!nameValidation.valid) {
        errors.push({ field: 'fullName', message: nameValidation.message });
    }

    const ageValidation = validateAge(formData.age);
    if (!ageValidation.valid) {
        errors.push({ field: 'age', message: ageValidation.message });
    }

    const genderValidation = validateGender(formData.gender);
    if (!genderValidation.valid) {
        errors.push({ field: 'gender', message: genderValidation.message });
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
        errors.push({ field: 'email', message: emailValidation.message });
    }

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
        errors.push({ field: 'phone', message: phoneValidation.message });
    }

    const goalValidation = validateGoal(formData.goal);
    if (!goalValidation.valid) {
        errors.push({ field: 'goal', message: goalValidation.message });
    }

    const dateValidation = validateStartDate(formData.startDate);
    if (!dateValidation.valid) {
        errors.push({ field: 'startDate', message: dateValidation.message });
    }

    return errors;
}

// ===================================
// CLIENT MANAGEMENT FUNCTIONS
// ===================================

/**
 * Add new client
 */
function addClient(formData) {
    // Validate form
    clearAllErrors();
    const errors = validateForm(formData);

    if (errors.length > 0) {
        // Show all errors
        errors.forEach(error => {
            showFieldError(error.field, error.message);
        });
        // Focus on first error field
        document.getElementById(errors[0].field).focus();
        return false;
    }

    // Check for duplicate email
    const existingClient = clients.find(c => c.email.toLowerCase() === formData.email.toLowerCase());
    if (existingClient) {
        showFieldError('email', 'A client with this email already exists');
        document.getElementById('email').focus();
        return false;
    }

    // Create new client
    const newClient = {
        id: generateId(),
        fullName: formData.fullName.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        goal: formData.goal,
        startDate: formData.startDate,
        trainingHistory: []
    };

    clients.push(newClient);
    saveClients();

    // Show success message
    showNotification('Client added successfully!', 'success');

    // Clear form
    document.querySelector('.client-form').reset();

    // Refresh client list if on that page
    renderClientList();

    return true;
}

/**
 * Update existing client
 */
function updateClient(id, formData) {
    // Validate form
    clearAllErrors();
    const errors = validateForm(formData);

    if (errors.length > 0) {
        // Show all errors
        errors.forEach(error => {
            showFieldError(error.field, error.message);
        });
        // Focus on first error field
        document.getElementById(errors[0].field).focus();
        return false;
    }

    // Check for duplicate email (excluding current client)
    const existingClient = clients.find(c =>
        c.email.toLowerCase() === formData.email.toLowerCase() && c.id !== id
    );
    if (existingClient) {
        showFieldError('email', 'A client with this email already exists');
        document.getElementById('email').focus();
        return false;
    }

    // Find and update client
    const clientIndex = clients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
        showNotification('Client not found', 'error');
        return false;
    }

    // Preserve training history
    const trainingHistory = clients[clientIndex].trainingHistory || [];

    clients[clientIndex] = {
        id: id,
        fullName: formData.fullName.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        goal: formData.goal,
        startDate: formData.startDate,
        trainingHistory: trainingHistory
    };

    saveClients();
    showNotification('Client updated successfully!', 'success');

    // Clear edit mode
    currentEditId = null;

    // Update button text
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add Client';

    // Hide back button and reset title
    const backBtn = document.getElementById('editBackBtn');
    const pageTitle = document.getElementById('formPageTitle');
    if (backBtn) backBtn.style.display = 'none';
    if (pageTitle) pageTitle.textContent = 'Add New Client';

    // Clear form
    document.querySelector('.client-form').reset();

    // Refresh client list and navigate to it
    renderClientList();
    showPage('client-list');

    return true;
}

/**
 * Delete client
 */
function deleteClient(id) {
    const client = clients.find(c => c.id === id);
    if (!client) {
        showNotification('Client not found', 'error');
        return;
    }

    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete ${client.fullName}?\n\nThis action cannot be undone.`)) {
        clients = clients.filter(c => c.id !== id);
        saveClients();
        showNotification('Client deleted successfully', 'success');
        renderClientList();
    }
}

/**
 * Get client by ID
 */
function getClientById(id) {
    return clients.find(c => c.id === id);
}

// ===================================
// UI RENDERING FUNCTIONS
// ===================================

/**
 * Render client list table
 */
function renderClientList() {
    const tbody = document.getElementById('clientTableBody');
    if (!tbody) return;

    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-users" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem; display: block;"></i>
                    <p style="color: var(--text-secondary);">No clients found. Add your first client to get started!</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = clients.map(client => `
        <tr onclick="viewClient('${client.id}')" style="cursor: pointer;">
            <td data-label="Name">${escapeHtml(client.fullName)}</td>
            <td data-label="Email">${escapeHtml(client.email)}</td>
            <td data-label="Phone">${escapeHtml(client.phone)}</td>
            <td data-label="Goal">${renderGoalBadge(client.goal)}</td>
            <td data-label="Start Date">${formatDate(client.startDate)}</td>
            <td data-label="Actions">
                <div class="action-buttons">
                    <button class="btn-icon edit" title="Edit" onclick="event.stopPropagation(); editClient('${client.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" title="Delete" onclick="event.stopPropagation(); deleteClient('${client.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Render goal badge with proper styling
 */
function renderGoalBadge(goal) {
    const goalLabels = {
        'weight-loss': 'Weight Loss',
        'muscle-gain': 'Muscle Gain',
        'general-fitness': 'General Fitness',
        'endurance': 'Endurance Training',
        'flexibility': 'Flexibility & Mobility',
        'strength': 'Strength Training'
    };

    const label = goalLabels[goal] || goal;
    return `<span class="goal-badge ${goal}">${escapeHtml(label)}</span>`;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// EDIT CLIENT FUNCTIONS
// ===================================

/**
 * Edit client - populate form with existing data
 */
function editClient(id) {
    const client = getClientById(id);
    if (!client) {
        showNotification('Client not found', 'error');
        return;
    }

    // Set current edit ID
    currentEditId = id;

    // Populate form
    document.getElementById('fullName').value = client.fullName;
    document.getElementById('age').value = client.age;
    document.getElementById('gender').value = client.gender;
    document.getElementById('email').value = client.email;
    document.getElementById('phone').value = client.phone;
    document.getElementById('goal').value = client.goal;
    document.getElementById('startDate').value = client.startDate;

    // Change button text
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Client';

    // Show back button and update title
    const backBtn = document.getElementById('editBackBtn');
    const pageTitle = document.getElementById('formPageTitle');
    if (backBtn) backBtn.style.display = 'flex';
    if (pageTitle) pageTitle.textContent = 'Edit Client';

    // Switch to new client page BUT keep Client List button active
    // Hide all pages first
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show the form page
    document.getElementById('new-client').classList.add('active');

    // Keep Client List nav button active (don't call showPage to avoid nav change)
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const clientListBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn =>
        btn.getAttribute('onclick')?.includes('client-list')
    );
    if (clientListBtn) {
        clientListBtn.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Focus on name field
    document.getElementById('fullName').focus();

    showNotification('Edit mode: Update client information', 'info');
}

/**
 * Cancel edit mode and return to client list
 */
function cancelEdit() {
    // Reset form
    document.getElementById('clientForm').reset();

    // Clear edit mode
    currentEditId = null;

    // Reset button text
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add Client';
    }

    // Hide back button and reset title
    const backBtn = document.getElementById('editBackBtn');
    const pageTitle = document.getElementById('formPageTitle');
    if (backBtn) backBtn.style.display = 'none';
    if (pageTitle) pageTitle.textContent = 'Add New Client';

    // Navigate back to client list
    showPage('client-list');

    showNotification('Edit cancelled', 'info');
}

// ===================================
// VIEW CLIENT FUNCTIONS
// ===================================

/**
 * View client details
 */
function viewClient(id) {
    currentViewId = id;
    currentViewClientId = id; // Set for training session functions
    const client = getClientById(id);

    if (!client) {
        showNotification('Client not found', 'error');
        return;
    }

    // Use a wrapper function for better state management
    displayClientView(id);
}

/**
 * Display client view page
 */
function displayClientView(id) {
    const client = getClientById(id);

    if (!client) {
        showNotification('Client not found', 'error');
        return;
    }

    // Populate client details
    document.getElementById('viewClientName').textContent = client.fullName;
    document.getElementById('viewClientEmail').textContent = client.email;
    document.getElementById('viewClientPhone').textContent = client.phone;
    document.getElementById('viewClientAge').textContent = `${client.age} years old`;
    document.getElementById('viewClientGender').textContent = client.gender.charAt(0).toUpperCase() + client.gender.slice(1);
    document.getElementById('viewClientGoal').innerHTML = renderGoalBadge(client.goal);
    document.getElementById('viewClientStartDate').textContent = formatDate(client.startDate);

    // Render training history
    renderTrainingHistory(client);

    // Fetch and display exercises
    fetchExercises();

    // Switch to client view page
    showPage('client-view');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Render training history
 */
function renderTrainingHistory(client) {
    const historyContainer = document.getElementById('trainingHistory');

    if (!client.trainingHistory || client.trainingHistory.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No training history yet</p>
            </div>
        `;
        return;
    }

    historyContainer.innerHTML = client.trainingHistory.map(session => `
        <div class="history-item">
            <div class="history-header">
                <div class="history-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(session.date)}
                </div>
                <button class="delete-session-btn" onclick="deleteTrainingSession('${client.id}', '${session.id}')" title="Delete session">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="history-details">
                <strong>${escapeHtml(session.type)}</strong>
                <span class="session-duration"><i class="fas fa-clock"></i> ${session.duration} min</span>
                ${session.notes ? `<p>${escapeHtml(session.notes)}</p>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Get sample exercises as fallback
 */
function getSampleExercises() {
    return [
        {
            name: 'Push-ups',
            description: 'A classic upper body exercise that targets chest, shoulders, and triceps. Start in a plank position with hands shoulder-width apart. Lower your body until chest nearly touches the floor, then push back up.',
            category: 'Strength'
        },
        {
            name: 'Squats',
            description: 'A fundamental lower body exercise for building leg strength. Stand with feet shoulder-width apart, lower your body by bending knees and hips, keeping back straight. Return to starting position.',
            category: 'Legs'
        },
        {
            name: 'Plank',
            description: 'Core strengthening exercise that improves stability. Hold a push-up position with forearms on the ground, keeping body in a straight line from head to heels. Engage core muscles throughout.',
            category: 'Core'
        },
        {
            name: 'Lunges',
            description: 'Excellent exercise for leg strength and balance. Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Push back to starting position and alternate legs.',
            category: 'Legs'
        },
        {
            name: 'Burpees',
            description: 'Full-body cardio exercise that builds endurance and strength. From standing, drop to squat, kick feet back to plank, do a push-up, jump feet forward, and explode upward with a jump.',
            category: 'Cardio'
        },
        {
            name: 'Mountain Climbers',
            description: 'Dynamic cardio exercise that works multiple muscle groups. Start in plank position, alternate bringing knees toward chest in a running motion while maintaining plank form.',
            category: 'Cardio'
        },
        {
            name: 'Dumbbell Rows',
            description: 'Strengthens back muscles and improves posture. Bend forward at waist, pull dumbbell up to chest level, keeping elbow close to body. Lower with control and repeat.',
            category: 'Back'
        },
        {
            name: 'Bicycle Crunches',
            description: 'Effective ab exercise that targets obliques. Lie on back, bring opposite elbow to knee in a pedaling motion while keeping core engaged throughout the movement.',
            category: 'Core'
        },
        {
            name: 'Jumping Jacks',
            description: 'Classic cardio warm-up exercise. Jump feet apart while raising arms overhead, then return to starting position with feet together and arms at sides.',
            category: 'Cardio'
        },
        {
            name: 'Shoulder Press',
            description: 'Builds shoulder strength and stability. Press dumbbells or barbell overhead from shoulder height, fully extending arms. Lower with control back to starting position.',
            category: 'Shoulders'
        }
    ];
}

/**
 * Fetch exercises from Free Exercise DB API (No authentication required)
 * API Source: https://github.com/yuhonas/free-exercise-db
 */
async function fetchExercises() {
    const exercisesContainer = document.getElementById('nextSessionExercises');

    // Show loading state
    exercisesContainer.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading exercises...</p>
        </div>
    `;

    try {
        // Fetch exercises from Free Exercise DB
        // This is a free, open-source API with no authentication required
        const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch exercises from API: ${response.status} ${response.statusText}`);
        }

        const allExercises = await response.json();
        console.log('✅ API Response received');
        console.log(`✅ Total exercises from API: ${allExercises.length}`);

        // Validate we have exercises
        if (!Array.isArray(allExercises) || allExercises.length === 0) {
            throw new Error('No exercises returned from API');
        }

        // Get 5 random exercises from API
        const selectedExercises = [];
        const usedIndices = new Set();

        const targetCount = Math.min(5, allExercises.length);
        while (selectedExercises.length < targetCount) {
            const randomIndex = Math.floor(Math.random() * allExercises.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                selectedExercises.push(allExercises[randomIndex]);
            }
        }

        // Render exercises from API
        exercisesContainer.innerHTML = selectedExercises.map((exercise, index) => {
            // Get full instructions as numbered list
            let instructionsHtml = '';
            if (exercise.instructions && Array.isArray(exercise.instructions) && exercise.instructions.length > 0) {
                instructionsHtml = '<ol class="exercise-instructions">' +
                    exercise.instructions.map(step => `<li>${escapeHtml(step)}</li>`).join('') +
                    '</ol>';
            } else {
                instructionsHtml = '<p>Complete this exercise following proper form and technique.</p>';
            }

            // Get category/equipment info
            let categoryName = exercise.category || 'Strength';
            if (exercise.equipment && exercise.equipment !== 'body only') {
                categoryName += ` - ${exercise.equipment}`;
            }

            // Add difficulty level
            const difficultyBadge = exercise.level
                ? `<span class="difficulty-badge difficulty-${exercise.level}">${exercise.level}</span>`
                : '';

            return `
                <div class="exercise-item">
                    <div class="exercise-number">${index + 1}</div>
                    <div class="exercise-details">
                        <h4>${escapeHtml(exercise.name)}</h4>
                        ${instructionsHtml}
                        <div class="exercise-meta">
                            <span class="exercise-category">${escapeHtml(categoryName)}</span>
                            ${difficultyBadge}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        console.log(`✅ Successfully loaded ${selectedExercises.length} exercises from Free Exercise DB API`);

    } catch (error) {
        // If API fails, show error state
        console.error('❌ Failed to load exercises from API:', error.message);

        exercisesContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load exercises from API</p>
                <p style="font-size: 0.875rem; color: var(--text-secondary);">${escapeHtml(error.message)}</p>
            </div>
        `;
    }
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

/**
 * Filter clients by name
 */
function filterClients() {
    const searchInput = document.getElementById('searchClient').value.toLowerCase();
    const rows = document.querySelectorAll('#clientTableBody tr');

    let visibleCount = 0;

    rows.forEach(row => {
        const nameCell = row.querySelector('td[data-label="Name"]');
        if (!nameCell) return;

        const name = nameCell.textContent.toLowerCase();
        if (name.includes(searchInput)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Show message if no results
    if (visibleCount === 0 && searchInput.length > 0) {
        const tbody = document.getElementById('clientTableBody');
        const existingMessage = document.getElementById('noResultsMessage');

        if (!existingMessage) {
            const messageRow = document.createElement('tr');
            messageRow.id = 'noResultsMessage';
            messageRow.innerHTML = `
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-search" style="font-size: 2rem; color: var(--text-light); margin-bottom: 0.5rem; display: block;"></i>
                    <p style="color: var(--text-secondary);">No clients found matching "${escapeHtml(searchInput)}"</p>
                </td>
            `;
            tbody.appendChild(messageRow);
        }
    } else {
        const existingMessage = document.getElementById('noResultsMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// ===================================
// PAGE NAVIGATION
// ===================================

/**
 * Show specific page
 */
function showPage(pageId) {
    // If navigating to new-client page while in edit mode, clear edit state
    if (pageId === 'new-client' && currentEditId !== null) {
        // Reset form
        document.getElementById('clientForm').reset();

        // Clear edit mode
        currentEditId = null;

        // Reset button text
        const submitBtn = document.querySelector('.btn-primary');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add Client';
        }

        // Hide back button and reset title
        const backBtn = document.getElementById('editBackBtn');
        const pageTitle = document.getElementById('formPageTitle');
        if (backBtn) backBtn.style.display = 'none';
        if (pageTitle) pageTitle.textContent = 'Add New Client';
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update nav buttons - always update when not in edit mode, or when explicitly navigating
    if (currentEditId === null || pageId === 'new-client') {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Find and activate the corresponding nav button
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes(pageId)) {
                btn.classList.add('active');
            }
        });
    }
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
                 type === 'error' ? 'fa-exclamation-circle' :
                 type === 'warning' ? 'fa-exclamation-triangle' :
                 'fa-info-circle';

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load clients from localStorage
    loadClients();

    // Render initial client list
    renderClientList();

    // Set up form submission
    const clientForm = document.querySelector('.client-form');
    const submitBtn = document.querySelector('.btn-primary');

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            goal: document.getElementById('goal').value,
            startDate: document.getElementById('startDate').value
        };

        if (currentEditId) {
            // Update existing client
            updateClient(currentEditId, formData);
        } else {
            // Add new client
            if (addClient(formData)) {
                // Switch to client list to see the new client
                showPage('client-list');
            }
        }
    });

    // Set up real-time validation
    const fields = ['fullName', 'age', 'gender', 'email', 'phone', 'goal', 'startDate'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                // Clear error when user starts typing
                clearFieldError(fieldId);
            });

            field.addEventListener('input', function() {
                // Clear error when user starts typing
                clearFieldError(fieldId);
            });
        }
    });

    // Set up search functionality
    const searchInput = document.getElementById('searchClient');
    if (searchInput) {
        searchInput.addEventListener('input', filterClients);
    }

    console.log('FitNile CRM initialized successfully');
    console.log(`Loaded ${clients.length} clients`);
});

// ===================================
// TRAINING HISTORY FUNCTIONALITY
// ===================================

/**
 * Open the add session modal
 */
function openAddSessionModal() {
    const modal = document.getElementById('addSessionModal');
    const form = document.getElementById('addSessionForm');

    // Reset form
    form.reset();

    // Set default date to today
    document.getElementById('sessionDate').valueAsDate = new Date();

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * Close the add session modal
 */
function closeAddSessionModal() {
    const modal = document.getElementById('addSessionModal');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
}

/**
 * Handle add session form submission
 */
function handleAddSession(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Get form values
    const sessionData = {
        id: generateId(),
        date: formData.get('sessionDate'),
        type: formData.get('sessionType'),
        duration: parseInt(formData.get('sessionDuration')),
        notes: formData.get('sessionNotes') || ''
    };

    // Validate
    if (!sessionData.date || !sessionData.type || !sessionData.duration) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (sessionData.duration < 1 || sessionData.duration > 300) {
        showNotification('Duration must be between 1 and 300 minutes', 'error');
        return;
    }

    // Add to current client's training history
    if (!currentViewClientId) {
        showNotification('Error: No client selected', 'error');
        return;
    }

    const client = clients.find(c => c.id === currentViewClientId);
    if (!client) {
        showNotification('Error: Client not found', 'error');
        return;
    }

    // Initialize trainingHistory if it doesn't exist
    if (!Array.isArray(client.trainingHistory)) {
        client.trainingHistory = [];
    }

    // Add new session
    client.trainingHistory.push(sessionData);

    // Sort by date (newest first)
    client.trainingHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save to localStorage
    saveClients();

    // Close modal
    closeAddSessionModal();

    // Show success notification
    showNotification('Training session added successfully!', 'success');

    // Refresh the display
    displayClientView(currentViewClientId);
}

/**
 * Delete a training session
 */
function deleteTrainingSession(clientId, sessionId) {
    if (!confirm('Are you sure you want to delete this training session?')) {
        return;
    }

    const client = clients.find(c => c.id === clientId);
    if (!client) {
        showNotification('Error: Client not found', 'error');
        return;
    }

    // Remove session
    client.trainingHistory = client.trainingHistory.filter(s => s.id !== sessionId);

    // Save to localStorage
    saveClients();

    // Show success notification
    showNotification('Training session deleted successfully!', 'success');

    // Refresh the display
    displayClientView(clientId);
}
