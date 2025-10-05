// script.js

// This is where you would add interactive functionality.
// For a static landing page, a lot of this might not be needed.

// Example: Add a click event to a button
document.addEventListener('DOMContentLoaded', () => {
    const startTrackingBtn = document.querySelector('.btn-cta');
    if (startTrackingBtn) {
        startTrackingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Starting to track your commute... (This is a demo)');
        });
    }
});