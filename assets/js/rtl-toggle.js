document.addEventListener('DOMContentLoaded', () => {
    const rtlToggle = document.getElementById('rtl-toggle');
    const htmlElement = document.documentElement;

    // Check for saved RTL preference
    const isRTL = localStorage.getItem('rtl') === 'true';
    if (isRTL) {
        htmlElement.setAttribute('dir', 'rtl');
        htmlElement.classList.add('rtl-mode');
        if (rtlToggle) rtlToggle.innerText = 'LTR';
    }

    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir');
            if (currentDir === 'rtl') {
                htmlElement.setAttribute('dir', 'ltr');
                htmlElement.classList.remove('rtl-mode');
                rtlToggle.innerText = 'RTL';
                localStorage.setItem('rtl', 'false');
            } else {
                htmlElement.setAttribute('dir', 'rtl');
                htmlElement.classList.add('rtl-mode');
                rtlToggle.innerText = 'LTR';
                localStorage.setItem('rtl', 'true');
            }
            // Trigger a resize event to help some scripts re-calculate layouts
            window.dispatchEvent(new Event('resize'));
        });
    }
});
