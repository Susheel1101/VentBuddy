console.log('Vent Buddy is initializing...');

// Basic test to make sure JS is working
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vent Buddy loaded successfully!');
    
    // Add a simple animation to the status text
    const status = document.querySelector('.status');
    if (status) {
        setInterval(() => {
            status.style.opacity = status.style.opacity === '0.5' ? '1' : '0.5';
        }, 1000);
    }
});
