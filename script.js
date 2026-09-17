/* ==========================================================================
   THEME TOGGLER
   ========================================================================== */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check saved theme or system preference
const savedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || (!savedTheme && !systemDark)) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeIcon.className = 'fa-solid fa-sun';
} else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeIcon.className = 'fa-solid fa-moon';
}

themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.replace('dark-theme', 'light-theme');
        themeIcon.className = 'fa-solid fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.replace('light-theme', 'dark-theme');
        themeIcon.className = 'fa-solid fa-moon';
        localStorage.setItem('theme', 'dark');
    }
});

/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
const mobileLinks = document.querySelectorAll('.mobile-link');

mobileNavToggle.addEventListener('click', () => {
    mobileNavDrawer.classList.toggle('active');
    const isExpanded = mobileNavDrawer.classList.contains('active');
    mobileNavToggle.querySelector('i').className = isExpanded ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

// Close menu when clicking links
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
        mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
});

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
const revealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Trigger only once
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

/* ==========================================================================
   NAVBAR ACTIVE STATE SYNC
   ========================================================================== */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link:not(.btn-contact)');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

/* ==========================================================================
   AML SIMULATOR CODE
   ========================================================================== */
const riskSlider = document.getElementById('risk-threshold');
const thresholdVal = document.getElementById('threshold-val');
const blacklistSelect = document.getElementById('country-blacklist');

const statTotal = document.getElementById('stat-total');
const statFlagged = document.getElementById('stat-flagged');
const statApproved = document.getElementById('stat-approved');

const btnStartSim = document.getElementById('btn-start-sim');
const btnResetSim = document.getElementById('btn-reset-sim');
const transactionLog = document.getElementById('transaction-log');

let simInterval = null;
let stats = { total: 0, flagged: 0, approved: 0 };

// Mock bank/fintech transaction pool
const mockAccounts = [
    { name: "John Sterling", id: "ACC-58291", country: "United Kingdom", baseRisk: 25, type: "Salary Credit" },
    { name: "Amelia Thorne", id: "ACC-12948", country: "Cayman Islands", baseRisk: 82, type: "Rapid Layering Transfer" },
    { name: "Zhang Wei", id: "ACC-83921", country: "Singapore", baseRisk: 41, type: "ATM Cash Withdrawal" },
    { name: "Nikolai Volkov", id: "ACC-30491", country: "Panama", baseRisk: 78, type: "Structured Cash Inflow" },
    { name: "Fatima Al-Sayed", id: "ACC-49102", country: "United Arab Emirates", baseRisk: 35, type: "International Wire" },
    { name: "David Miller", id: "ACC-20194", country: "United States", baseRisk: 15, type: "Online Purchase" },
    { name: "Alpha Shell Corp", id: "ACC-90412", country: "British Virgin Islands", baseRisk: 91, type: "Crypto Mixer Sweep" },
    { name: "Rajesh Kumar", id: "ACC-57123", country: "India", baseRisk: 30, type: "Domestic NEFT Transfer" },
    { name: "Elena Rostova", id: "ACC-66892", country: "Cyprus", baseRisk: 68, type: "Smurfing / Cash Placement" },
    { name: "Carlos Menendez", id: "ACC-11029", country: "Colombia", baseRisk: 55, type: "Peer-to-Peer Transfer" }
];

// Update threshold displayed value
riskSlider.addEventListener('input', (e) => {
    thresholdVal.textContent = e.target.value;
});

// Generate realistic transactions
function generateTransaction() {
    const account = mockAccounts[Math.floor(Math.random() * mockAccounts.length)];
    const amount = (Math.random() * 150000 + 500).toFixed(2);
    
    // Add random variance to base risk score
    let calculatedRisk = account.baseRisk + Math.floor(Math.random() * 12 - 6);
    calculatedRisk = Math.max(10, Math.min(99, calculatedRisk)); // Clamp risk between 10 and 99
    
    const isHighRiskCountry = ["Cayman Islands", "Panama", "British Virgin Islands", "Cyprus"].includes(account.country);
    
    // Adjust risk based on dropdown blacklists
    if (blacklistSelect.value === 'high-risk' && isHighRiskCountry) {
        calculatedRisk += 15;
        calculatedRisk = Math.min(99, calculatedRisk);
    }
    
    const threshold = parseInt(riskSlider.value);
    const isFlagged = calculatedRisk >= threshold;
    
    stats.total++;
    statTotal.textContent = stats.total;
    
    // Timestamp
    const time = new Date().toLocaleTimeString();
    
    // Create Line item
    const line = document.createElement('div');
    line.className = `terminal-line ${isFlagged ? 'flagged' : 'approved'}`;
    
    if (isFlagged) {
        stats.flagged++;
        statFlagged.textContent = stats.flagged;
        line.innerHTML = `
            [${time}] ⚠️ <strong>ALERT (RISK: ${calculatedRisk})</strong> - ACC: ${account.id} (${account.name}) | Amount: $${Number(amount).toLocaleString()} | Country: ${account.country}<br>
            &gt;&gt; Activity: ${account.type} | STATUS: FLAGGED FOR SUSPICIOUS PATTERN | Triggering EDD protocols & SAR drafting...
        `;
    } else {
        stats.approved++;
        statApproved.textContent = stats.approved;
        line.innerHTML = `
            [${time}] ✅ <strong>CLEAR (RISK: ${calculatedRisk})</strong> - ACC: ${account.id} (${account.name}) | Amount: $${Number(amount).toLocaleString()} | Country: ${account.country}<br>
            &gt;&gt; Activity: ${account.type} | STATUS: TRANSACTION PASSED | Risk tolerance compliant.
        `;
    }
    
    transactionLog.appendChild(line);
    
    // Scroll terminal to bottom
    transactionLog.scrollTop = transactionLog.scrollHeight;
}

// Start/Stop stream control
btnStartSim.addEventListener('click', () => {
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
        btnStartSim.innerHTML = `<i class="fa-solid fa-play"></i> Resume Stream`;
        const line = document.createElement('div');
        line.className = 'terminal-line system-msg';
        line.textContent = `[SYSTEM] Scrutiny stream paused by analyst.`;
        transactionLog.appendChild(line);
        transactionLog.scrollTop = transactionLog.scrollHeight;
    } else {
        const line = document.createElement('div');
        line.className = 'terminal-line system-msg';
        line.textContent = `[SYSTEM] Resuming live transaction monitoring...`;
        transactionLog.appendChild(line);
        transactionLog.scrollTop = transactionLog.scrollHeight;
        
        generateTransaction(); // Run first one instantly
        simInterval = setInterval(generateTransaction, 2500);
        btnStartSim.innerHTML = `<i class="fa-solid fa-pause"></i> Pause Stream`;
    }
});

// Reset Logs
btnResetSim.addEventListener('click', () => {
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
    }
    stats = { total: 0, flagged: 0, approved: 0 };
    statTotal.textContent = '0';
    statFlagged.textContent = '0';
    statApproved.textContent = '0';
    btnStartSim.innerHTML = `<i class="fa-solid fa-play"></i> Start Stream`;
    transactionLog.innerHTML = `<div class="terminal-line system-msg">[SYSTEM] AML screening log database wiped. Ready to initialize stream.</div>`;
});

/* ==========================================================================
   CONTACT FORM SUBMISSION WITH SECURE LOADER EFFECT
   ========================================================================== */
const contactForm = document.getElementById('contact-form');
const formSubmitBtn = document.getElementById('form-submit-btn');
const formFeedback = document.getElementById('form-feedback');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Lock button and show loader text
    formSubmitBtn.disabled = true;
    formSubmitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Transmitting Secure Report...`;
    
    // Simulate API delay
    setTimeout(() => {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Secure transmission successful! Your message has been encrypted and sent. Govind will contact you shortly.`;
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Secure Message`;
        
        // Clear message after 6 seconds
        setTimeout(() => {
            formFeedback.style.display = 'none';
        }, 6000);
    }, 1800);
});
