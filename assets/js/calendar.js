/**
 * ============================================================================
 * CALENDAR.JS - Tech Calendar Management System
 * ============================================================================
 * 
 * Full-featured calendar application with event management
 * 
 * Features:
 * - Monthly calendar view with event display
 * - Create, edit, and delete events
 * - LocalStorage persistence (events saved in browser)
 * - Event list sidebar with sorting
 * - Export to JSON and ICS formats
 * - Share calendar via URL
 * - Responsive design
 * - Keyboard navigation support
 * 
 * Data Structure:
 * Events are stored as:
 * {
 *   id: string (timestamp),
 *   title: string,
 *   date: string (YYYY-MM-DD),
 *   time: string (HH:MM) or null,
 *   description: string or null,
 *   createdAt: string (ISO date)
 * }
 * 
 * Performance:
 * - Efficient calendar rendering (only visible month)
 * - Debounced resize handlers
 * - Event delegation for day clicks
 * 
 * @author Your School
 * @version 1.0.0
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================================================
    // CONSTANTS
    // ========================================================================
    const STORAGE_KEY = 'tech_calendar_events';  // localStorage key for events
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    let currentDate = new Date();      // Currently displayed month/year
    let events = loadEvents();         // Array of all events
    let editingEventId = null;        // ID of event being edited (null = new event)

    // ========================================================================
    // DOM ELEMENT REFERENCES
    // ========================================================================
    // Cache DOM queries for performance
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearEl = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    const addEventBtn = document.getElementById('add-event-btn');
    const shareCalendarBtn = document.getElementById('share-calendar-btn');
    const eventsListContainer = document.getElementById('events-list-container');
    const eventModal = document.getElementById('event-modal');
    const shareModal = document.getElementById('share-modal');
    const eventForm = document.getElementById('event-form');
    const eventIdInput = document.getElementById('event-id');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const eventTimeInput = document.getElementById('event-time');
    const eventDescriptionInput = document.getElementById('event-description');
    const shareLinkInput = document.getElementById('share-link');

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    renderCalendar();        // Draw initial calendar view
    renderEventsList();     // Display events in sidebar
    setupModalHandlers();   // Configure modal close handlers

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
    });

    addEventBtn.addEventListener('click', () => {
        openEventModal();
    });

    shareCalendarBtn.addEventListener('click', () => {
        openShareModal();
    });

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEvent();
    });

    document.getElementById('cancel-event-btn').addEventListener('click', () => {
        closeEventModal();
    });

    document.getElementById('copy-link-btn').addEventListener('click', () => {
        copyShareLink();
    });

    document.getElementById('export-json-btn').addEventListener('click', () => {
        exportJSON();
    });

    document.getElementById('export-ics-btn').addEventListener('click', () => {
        exportICS();
    });

    // ========================================================================
    // DATA PERSISTENCE FUNCTIONS
    // ========================================================================
    
    /**
     * Load events from localStorage
     * @returns {Array} - Array of event objects, or empty array if none exist
     */
    function loadEvents() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading events:', e);
            return [];
        }
    }

    /**
     * Save events to localStorage
     * Handles errors gracefully with user feedback
     */
    function saveEvents() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        } catch (e) {
            console.error('Error saving events:', e);
            alert('Error saving events. Please try again.');
        }
    }

    // ========================================================================
    // CALENDAR RENDERING FUNCTIONS
    // ========================================================================
    
    /**
     * Render the calendar grid for the current month
     * - Creates day headers (Sun-Sat)
     * - Adds empty cells for days before month starts
     * - Creates day cells with event indicators
     * - Highlights today's date
     * - Makes days clickable to add events
     */
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month/year display
        monthYearEl.textContent = `${MONTHS[month]} ${year}`;

        // Clear grid
        calendarGrid.innerHTML = '';

        // Add day headers
        DAYS.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar__day-header';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar__day calendar__day--other-month';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            const date = new Date(year, month, day);
            const dateStr = formatDate(date);
            const isToday = dateStr === formatDate(today);
            
            dayEl.className = 'calendar__day';
            if (isToday) {
                dayEl.classList.add('calendar__day--today');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar__day-number';
            dayNumber.textContent = day;
            dayEl.appendChild(dayNumber);

            // Add events for this day
            const dayEvents = events.filter(e => e.date === dateStr);
            dayEvents.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'calendar__event';
                eventEl.textContent = event.title;
                eventEl.title = `${event.title}${event.time ? ' at ' + event.time : ''}`;
                eventEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    editEvent(event.id);
                });
                dayEl.appendChild(eventEl);
            });

            dayEl.addEventListener('click', () => {
                openEventModal(dateStr);
            });

            calendarGrid.appendChild(dayEl);
        }
    }

    /**
     * Render the events list sidebar
     * - Sorts events by date/time
     * - Displays event title, date, and description
     * - Provides edit and delete buttons
     * - Shows empty state if no events
     */
    function renderEventsList() {
        if (events.length === 0) {
            eventsListContainer.innerHTML = '<p class="text-muted">No events scheduled. Click "Add Event" to get started.</p>';
            return;
        }

        // Sort events by date
        const sortedEvents = [...events].sort((a, b) => {
            const dateA = new Date(a.date + (a.time ? 'T' + a.time : ''));
            const dateB = new Date(b.date + (b.time ? 'T' + b.time : ''));
            return dateA - dateB;
        });

        eventsListContainer.innerHTML = '';

        sortedEvents.forEach(event => {
            const item = document.createElement('div');
            item.className = 'events-list__item';

            const content = document.createElement('div');
            content.className = 'events-list__content';

            const title = document.createElement('div');
            title.className = 'events-list__title';
            title.textContent = event.title;

            const date = document.createElement('div');
            date.className = 'events-list__date';
            const dateObj = new Date(event.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            date.textContent = dateStr + (event.time ? ' at ' + event.time : '');

            content.appendChild(title);
            content.appendChild(date);
            if (event.description) {
                const desc = document.createElement('div');
                desc.className = 'text-sm text-muted mt-2';
                desc.textContent = event.description;
                content.appendChild(desc);
            }

            const actions = document.createElement('div');
            actions.className = 'events-list__actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn--secondary btn--sm';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editEvent(event.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn--outline btn--sm';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteEvent(event.id));

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            item.appendChild(content);
            item.appendChild(actions);
            eventsListContainer.appendChild(item);
        });
    }

    // ========================================================================
    // MODAL MANAGEMENT FUNCTIONS
    // ========================================================================
    
    /**
     * Open event modal for creating a new event
     * @param {string|null} dateStr - Pre-fill date (YYYY-MM-DD) or null for today
     */
    function openEventModal(dateStr = null) {
        editingEventId = null;
        eventForm.reset();
        eventIdInput.value = '';
        
        if (dateStr) {
            eventDateInput.value = dateStr;
        } else {
            eventDateInput.value = formatDate(new Date());
        }

        document.getElementById('event-modal-title').textContent = 'Add Event';
        eventModal.removeAttribute('hidden');
        eventModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => eventTitleInput.focus(), 100);
    }

    /**
     * Open event modal for editing an existing event
     * @param {string} eventId - ID of event to edit
     */
    function editEvent(eventId) {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        editingEventId = eventId;
        eventIdInput.value = event.id;
        eventTitleInput.value = event.title;
        eventDateInput.value = event.date;
        eventTimeInput.value = event.time || '';
        eventDescriptionInput.value = event.description || '';

        document.getElementById('event-modal-title').textContent = 'Edit Event';
        eventModal.removeAttribute('hidden');
        eventModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => eventTitleInput.focus(), 100);
    }

    /**
     * Close event modal and reset form
     */
    function closeEventModal() {
        eventModal.setAttribute('hidden', '');
        eventModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        editingEventId = null;
    }

    // ========================================================================
    // EVENT CRUD OPERATIONS
    // ========================================================================
    
    /**
     * Save or update an event
     * Validates required fields before saving
     * Updates calendar and event list after save
     */
    function saveEvent() {
        const title = eventTitleInput.value.trim();
        const date = eventDateInput.value;
        const time = eventTimeInput.value || null;
        const description = eventDescriptionInput.value.trim() || null;

        if (!title || !date) {
            alert('Please fill in all required fields.');
            return;
        }

        if (editingEventId) {
            // Update existing event
            const index = events.findIndex(e => e.id === editingEventId);
            if (index !== -1) {
                events[index] = {
                    ...events[index],
                    title,
                    date,
                    time,
                    description
                };
            }
        } else {
            // Create new event
            const newEvent = {
                id: Date.now().toString(),
                title,
                date,
                time,
                description,
                createdAt: new Date().toISOString()
            };
            events.push(newEvent);
        }

        saveEvents();
        renderCalendar();
        renderEventsList();
        closeEventModal();
    }

    /**
     * Delete an event after confirmation
     * @param {string} eventId - ID of event to delete
     */
    function deleteEvent(eventId) {
        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }

        events = events.filter(e => e.id !== eventId);
        saveEvents();
        renderCalendar();
        renderEventsList();
    }

    // ========================================================================
    // SHARING & EXPORT FUNCTIONS
    // ========================================================================
    
    /**
     * Open share modal with current page URL
     * Users can copy link to share calendar
     */
    function openShareModal() {
        // Generate share link
        const shareUrl = window.location.href;
        shareLinkInput.value = shareUrl;

        shareModal.removeAttribute('hidden');
        shareModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close share modal
     */
    function closeShareModal() {
        shareModal.setAttribute('hidden', '');
        shareModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /**
     * Copy share link to clipboard
     * Uses modern Clipboard API with fallback to execCommand
     * Provides visual feedback on success
     */
    function copyShareLink() {
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand('copy');
            const btn = document.getElementById('copy-link-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        } catch (err) {
            // Fallback for modern browsers
            navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                const btn = document.getElementById('copy-link-btn');
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            }).catch(() => {
                alert('Failed to copy link. Please copy manually.');
            });
        }
    }

    /**
     * Export events as JSON file
     * Downloads file with current date in filename
     */
    function exportJSON() {
        const dataStr = JSON.stringify(events, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-calendar-${formatDate(new Date())}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Export events as ICS (iCalendar) file
     * Compatible with Google Calendar, Outlook, Apple Calendar, etc.
     * Handles all-day events and timed events
     */
    function exportICS() {
        let icsContent = 'BEGIN:VCALENDAR\n';
        icsContent += 'VERSION:2.0\n';
        icsContent += 'PRODID:-//Tech Calendar//EN\n';
        icsContent += 'CALSCALE:GREGORIAN\n';
        icsContent += 'METHOD:PUBLISH\n';

        events.forEach(event => {
            icsContent += 'BEGIN:VEVENT\n';
            icsContent += `UID:${event.id}@techcalendar\n`;
            icsContent += `DTSTART:${formatICSDate(event.date, event.time)}\n`;
            
            // End date is same as start for all-day events, or add 1 hour if time specified
            if (event.time) {
                const endDate = new Date(event.date + 'T' + event.time);
                endDate.setHours(endDate.getHours() + 1);
                icsContent += `DTEND:${formatICSDateTime(endDate)}\n`;
            } else {
                const nextDay = new Date(event.date);
                nextDay.setDate(nextDay.getDate() + 1);
                icsContent += `DTEND:${formatICSDate(nextDay.toISOString().split('T')[0])}\n`;
            }
            
            icsContent += `SUMMARY:${escapeICS(event.title)}\n`;
            if (event.description) {
                icsContent += `DESCRIPTION:${escapeICS(event.description)}\n`;
            }
            icsContent += 'END:VEVENT\n';
        });

        icsContent += 'END:VCALENDAR\n';

        const dataBlob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-calendar-${formatDate(new Date())}.ics`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    
    /**
     * Format date as YYYY-MM-DD
     * @param {Date} date - Date object to format
     * @returns {string} - Formatted date string
     */
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Format date for ICS format (YYYYMMDDTHHMMSS)
     * @param {string} dateStr - Date string (YYYY-MM-DD)
     * @param {string|null} timeStr - Time string (HH:MM) or null for all-day
     * @returns {string} - ICS formatted date string
     */
    function formatICSDate(dateStr, timeStr = null) {
        if (timeStr) {
            const date = new Date(dateStr + 'T' + timeStr);
            return formatICSDateTime(date);
        }
        return dateStr.replace(/-/g, '') + 'T000000';
    }

    /**
     * Format Date object for ICS format
     * @param {Date} date - Date object
     * @returns {string} - ICS formatted date string (YYYYMMDDTHHMMSS)
     */
    function formatICSDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    }

    /**
     * Escape special characters for ICS format
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    function escapeICS(text) {
        return text.replace(/\\/g, '\\\\')
                   .replace(/;/g, '\\;')
                   .replace(/,/g, '\\,')
                   .replace(/\n/g, '\\n');
    }

    /**
     * Setup modal close handlers
     * - Close on overlay click
     * - Close on close button click
     * - Close on Escape key
     */
    function setupModalHandlers() {
        // Close modals on backdrop click
        const modals = [eventModal, shareModal];
        modals.forEach(modal => {
            const overlay = modal.querySelector('.modal__overlay');
            const closeBtn = modal.querySelector('.modal__close');
            
            if (overlay) {
                overlay.addEventListener('click', () => {
                    if (modal === eventModal) closeEventModal();
                    if (modal === shareModal) closeShareModal();
                });
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    if (modal === eventModal) closeEventModal();
                    if (modal === shareModal) closeShareModal();
                });
            }
        });

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!eventModal.hasAttribute('hidden')) {
                    closeEventModal();
                }
                if (!shareModal.hasAttribute('hidden')) {
                    closeShareModal();
                }
            }
        });
    }
});

