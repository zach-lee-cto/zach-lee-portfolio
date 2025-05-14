// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
        // Force close mobile menu if it's open (enhanced for iOS)
        if (document.querySelector('.mobile-nav.active')) {
            closeMobileMenu();
        }
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // ms
        let start = null;
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function for smooth acceleration and deceleration
            const easing = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            
            window.scrollTo(0, startPosition + distance * easing(percentage));
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    });
});

// Mobile menu toggle functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
let menuOpen = false;

// Function to specifically close the mobile menu (not toggle)
function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
    menuOpen = false;
    
    // Force hide on iOS to prevent any display issues
    mobileNav.style.transform = 'translateY(-100%)';
    
    // Extra delay to ensure animation completes on iOS
    setTimeout(() => {
        if (!menuOpen) {
            mobileNav.style.display = 'none';
            setTimeout(() => {
                if (!menuOpen) {
                    mobileNav.style.display = 'block';
                }
            }, 50);
        }
    }, 300);
}

function toggleMobileMenu() {
    menuOpen = !menuOpen;
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    if (menuOpen) {
        document.body.style.overflow = 'hidden';
        mobileNav.style.transform = 'translateY(0)';
    } else {
        document.body.style.overflow = '';
        mobileNav.style.transform = 'translateY(-100%)';
        
        // Extra check to ensure menu closes on iOS
        closeMobileMenu();
    }
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Add touch event for better iOS responsiveness
    mobileMenuToggle.addEventListener('touchend', function(e) {
        e.preventDefault(); // Prevent double-firing on iOS
    }, false);
}

// Also handle click events on mobile nav links
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Close the mobile menu when a link is clicked
        if (mobileNav.classList.contains('active')) {
            e.preventDefault(); // Ensure we handle the navigation
            closeMobileMenu();
            
            // Navigate after a short delay to ensure menu closes
            const href = this.getAttribute('href');
            setTimeout(() => {
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }, 300);
        }
    });
    
    // Add touch event listener for iOS
    link.addEventListener('touchend', function(e) {
        if (mobileNav.classList.contains('active')) {
            e.preventDefault();
            closeMobileMenu();
            
            // Navigate after menu closes
            const href = this.getAttribute('href');
            setTimeout(() => {
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }, 300);
        }
    }, false);
});

// Check for iOS-specific issues with position:fixed elements
document.addEventListener('DOMContentLoaded', function() {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Add iOS-specific class for additional styling
        document.body.classList.add('ios-device');
        
        // Add additional touchend handlers to ensure menu closes
        document.addEventListener('touchend', function(e) {
            if (menuOpen && !mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }, false);
    }
});

// Update scroll event listener for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = '#1a1a1a';
    } else {
        navbar.style.background = '#1a1a1a';
    }
    
    // Close mobile menu on scroll
    if (menuOpen) {
        closeMobileMenu();
    }
});

// Section visibility observer with more subtle transitions
const sections = document.querySelectorAll('section');

const observerOptions = {
    root: null,
    rootMargin: '-10% 0px',
    threshold: [0.15, 0.3, 0.5, 0.7, 0.9] // Multiple thresholds for smoother transitions
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Only update navigation when section is at least 50% visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            updateNavigation(entry.target.id);
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Update navigation highlighting
function updateNavigation(currentSection) {
    // Update main navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
    
    // Also update mobile navigation
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.clientHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;
    
    const progress = (scrolled / (fullHeight - windowHeight)) * 100;
    scrollProgress.style.width = `${progress}%`;
});

// Enhanced interactions for project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Enhance tech stack icons
    const techIcons = document.querySelectorAll('.tech-stack i');
    techIcons.forEach(icon => {
        // Add shimmer effect on hover
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.15)';
            icon.style.filter = 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
            icon.style.filter = 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3))';
        });
    });
    
    projectCards.forEach(card => {
        // Make whole card clickable
        card.style.cursor = 'pointer';
        
        // Get the project URL from the View Project button, if it exists
        let projectUrl = null;
        const viewProjectLink = card.querySelector('.project-links a:first-child');
        if (viewProjectLink) {
            projectUrl = viewProjectLink.getAttribute('href');
            
            // On mobile, we'll still show the links
            if (window.innerWidth > 768) {
                // Hide the project links div since the entire card is now clickable
                const projectLinks = card.querySelector('.project-links');
                if (projectLinks) {
                    projectLinks.style.display = 'none';
                }
            }
        }
        
        // Add click event for the entire card
        if (projectUrl) {
            card.addEventListener('click', () => {
                window.location.href = projectUrl;
            });
        }
        
        // Enhance hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            
            // Add subtle transition to tech stack icons
            const techIcons = card.querySelectorAll('.tech-stack i');
            techIcons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.style.transform = 'scale(1.15)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            
            // Reset tech stack icons
            const techIcons = card.querySelectorAll('.tech-stack i');
            techIcons.forEach(icon => {
                icon.style.transform = 'scale(1)';
            });
        });
        
        // Add touch interaction for mobile devices
        card.addEventListener('touchstart', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Responsive behavior for window resize
    window.addEventListener('resize', function() {
        const projectLinks = document.querySelectorAll('.project-links');
        
        if (window.innerWidth <= 768) {
            // Show project links on mobile
            projectLinks.forEach(link => {
                link.style.display = 'flex';
            });
        } else {
            // Hide project links on desktop (since cards are clickable)
            projectLinks.forEach(link => {
                link.style.display = 'none';
            });
        }
    });
    
    // Initialize project links visibility based on current screen size
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.project-links').forEach(link => {
            link.style.display = 'flex';
        });
    }
}); 