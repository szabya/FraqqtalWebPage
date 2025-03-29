document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            // Toggle the hamburger menu animation
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mainMenu.classList.contains('active') && 
                !mainMenu.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                mainMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Close Banner
    const closeBanner = document.querySelector('.close-banner');
    const riskBanner = document.querySelector('.risk-banner');
    
    if (closeBanner && riskBanner) {
        closeBanner.addEventListener('click', function() {
            riskBanner.style.display = 'none';
        });
    }
    
    // Enhanced stat boxes with interactive effects
    const statBoxes = document.querySelectorAll('.stat-box');
    const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    
    statBoxes.forEach(box => {
        // For touch devices, toggle popup on tap
        if (isTouchDevice) {
            box.addEventListener('touchstart', function(e) {
                // Toggle popup visibility
                const popup = this.querySelector('.popup-description');
                if (popup) {
                    const isActive = popup.classList.contains('active');
                    
                    // First hide all popups
                    document.querySelectorAll('.popup-description.active').forEach(p => {
                        p.classList.remove('active');
                    });
                    
                    // Then show this one if it wasn't active before
                    if (!isActive) {
                        popup.classList.add('active');
                        e.preventDefault(); // Prevent default only when showing popup
                    }
                }
            });
        } else {
            // Show popup on hover for non-touch devices
            box.addEventListener('mouseenter', function(e) {
                // Show the popup description for this box
                const popup = this.querySelector('.popup-description');
                if (popup) {
                    popup.classList.add('active');
                }
                
                const svg = this.querySelector('svg');
                if (svg) {
                    const electrons = svg.querySelectorAll('.electron');
                    electrons.forEach(electron => {
                        electron.setAttribute('r', 4);
                    });
                }
            });
            
            // Hide popup when mouse leaves
            box.addEventListener('mouseleave', function() {
                // Hide the popup description
                const popup = this.querySelector('.popup-description');
                if (popup) {
                    popup.classList.remove('active');
                }
                
                this.style.transform = '';
                
                // Reset SVG animations
                const svg = this.querySelector('svg');
                if (svg) {
                    const electrons = svg.querySelectorAll('.electron');
                    electrons.forEach(electron => {
                        electron.setAttribute('r', 3);
                    });
                    
                    const lines = svg.querySelectorAll('line, polyline, path, circle:not(.electron)');
                    lines.forEach(line => {
                        const baseWidth = line.classList.contains('chart-line') ? 1.5 : 1;
                        line.setAttribute('stroke-width', baseWidth);
                    });
                }
            });
        }
        
        // Add the tilt effect on mousemove (only when not showing popup)
        box.addEventListener('mousemove', function(e) {
            const boxRect = this.getBoundingClientRect();
            const boxCenterX = boxRect.left + boxRect.width / 2;
            const boxCenterY = boxRect.top + boxRect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate the tilt amount (max 5 degrees - reduced for more subtlety)
            const tiltX = (mouseY - boxCenterY) / (boxRect.height / 2) * 5;
            const tiltY = (boxCenterX - mouseX) / (boxRect.width / 2) * 5;
            
            // Apply the transformation
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03) translateY(-10px)`;
            
            // Enhanced SVG animation based on mouse position
            const svg = this.querySelector('svg');
            if (svg) {
                // Calculate distance from center as percentage (0-1)
                const distanceX = Math.abs(mouseX - boxCenterX) / (boxRect.width / 2);
                const distanceY = Math.abs(mouseY - boxCenterY) / (boxRect.height / 2);
                const distance = Math.min(1, Math.sqrt(distanceX * distanceX + distanceY * distanceY));
                
                // Apply subtle scaling/rotation to SVG elements based on mouse position
                const electrons = svg.querySelectorAll('.electron');
                electrons.forEach(electron => {
                    const baseScale = 1 + distance * 0.5;
                    electron.setAttribute('r', 3 * baseScale);
                });
                
                // Make the lines more responsive
                const lines = svg.querySelectorAll('line, polyline, path, circle:not(.electron)');
                lines.forEach(line => {
                    const currentWidth = parseFloat(line.getAttribute('stroke-width') || 1);
                    line.setAttribute('stroke-width', currentWidth * (1 + distance * 0.2));
                });
            }
        });
        
        // Add a pulse animation on click without showing popup
        box.addEventListener('click', function(e) {
            // Pulse animation on click for visual feedback
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
            
            // Click effect for SVGs
            const svg = this.querySelector('svg');
            if (svg) {
                svg.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    svg.style.transform = '';
                }, 300);
            }
        });
    });
    
    // Additional touch event handler to close popups when tapping elsewhere
    if (isTouchDevice) {
        document.addEventListener('touchstart', function(e) {
            if (!e.target.closest('.stat-box')) {
                document.querySelectorAll('.popup-description.active').forEach(popup => {
                    popup.classList.remove('active');
                });
            }
        });
    }
    
    // Additional mobile fixes
    
    // Make sure links within the main-menu close the menu when clicked
    const menuLinks = mainMenu ? mainMenu.querySelectorAll('a') : [];
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                if (menuToggle) menuToggle.classList.remove('active');
            }
        });
    });
    
    // Generate QR code for vCard
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    
    if (qrPlaceholder) {
        // When user hovers over or clicks the QR placeholder, show a message
        qrPlaceholder.addEventListener('mouseenter', function() {
            this.innerHTML = '<i class="fas fa-download"></i><span>Get Contact</span>';
        });
        
        qrPlaceholder.addEventListener('mouseleave', function() {
            this.innerHTML = '<i class="fas fa-qrcode"></i><span>Scan QR</span>';
        });
        
        qrPlaceholder.addEventListener('click', function() {
            // Trigger the vCard download when clicking on the QR placeholder as well
            const vcardLink = document.querySelector('.download-link');
            if (vcardLink) {
                vcardLink.click();
            }
        });
    }
    
    // Smooth Scroll for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only if the link is pointing to an anchor on the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    if (mainMenu && mainMenu.classList.contains('active')) {
                        mainMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Scroll to the target
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animation on Scroll
    const animateOnScroll = function() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('animate');
            }
        });
    };
    
    // Initial animation check
    animateOnScroll();
    
    // Add animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        });
    }
}); 