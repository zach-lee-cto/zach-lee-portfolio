// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
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

// Update scroll event listener for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = '#1a1a1a';
    } else {
        navbar.style.background = '#1a1a1a';
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
    document.querySelectorAll('.nav-links a').forEach(link => {
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

// Function to toggle between image logos and Font Awesome icons
function createLogoToggleButton() {
    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Try Icon Style Logos';
    toggleButton.className = 'logo-toggle-btn';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.padding = '8px 12px';
    toggleButton.style.backgroundColor = '#333';
    toggleButton.style.color = '#E8E8E8';
    toggleButton.style.border = '1px solid #C0C0C0';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif';
    toggleButton.style.fontSize = '0.9rem';
    toggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    
    // Add hover effect
    toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.backgroundColor = '#444';
    });
    
    toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.backgroundColor = '#333';
    });
    
    // Add event listener
    let usingIcons = false;
    toggleButton.addEventListener('click', () => {
        const techStacks = document.querySelectorAll('.tech-stack');
        
        if (!usingIcons) {
            // Switch to Font Awesome icons
            techStacks.forEach(stack => {
                const icons = Array.from(stack.querySelectorAll('img'));
                
                // Save the original images
                if (!stack.dataset.originalContent) {
                    stack.dataset.originalContent = stack.innerHTML;
                }
                
                // Replace with icons
                let newContent = '';
                icons.forEach(img => {
                    const tech = img.getAttribute('alt');
                    if (tech === 'Python') {
                        newContent += '<i class="fab fa-python" title="Python"></i>';
                    } else if (tech === 'SQL') {
                        newContent += '<i class="fas fa-database" title="SQL"></i>';
                    } else if (tech === 'Tableau') {
                        newContent += '<i class="fas fa-chart-bar" title="Tableau"></i>';
                    } else if (tech === 'Excel') {
                        newContent += '<i class="fas fa-file-excel" title="Excel"></i>';
                    }
                });
                
                stack.innerHTML = newContent;
            });
            
            toggleButton.textContent = 'Restore Image Logos';
            usingIcons = true;
        } else {
            // Switch back to original images
            techStacks.forEach(stack => {
                if (stack.dataset.originalContent) {
                    stack.innerHTML = stack.dataset.originalContent;
                }
            });
            
            toggleButton.textContent = 'Try Icon Style Logos';
            usingIcons = false;
        }
    });
    
    document.body.appendChild(toggleButton);
}

// Enhanced interactions for project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Enhance logo display
    const techLogos = document.querySelectorAll('.tech-stack img');
    techLogos.forEach(logo => {
        // Add a slight border to help with visibility
        logo.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        
        // Handle specific logos with special treatments
        if (logo.alt === 'SQL') {
            logo.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        }
        
        // Add shimmer effect on hover
        logo.addEventListener('mouseenter', () => {
            logo.style.filter = 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.filter = 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3))';
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
            
            // Hide the project links div since the entire card is now clickable
            const projectLinks = card.querySelector('.project-links');
            if (projectLinks) {
                projectLinks.style.display = 'none';
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
            const techIcons = card.querySelectorAll('.tech-stack img, .tech-stack i');
            techIcons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.style.transform = 'scale(1.15)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            
            // Reset tech stack icons
            const techIcons = card.querySelectorAll('.tech-stack img, .tech-stack i');
            techIcons.forEach(icon => {
                icon.style.transform = 'scale(1)';
            });
        });
        
        // Add tooltip functionality for tech stack icons
        const techIcons = card.querySelectorAll('.tech-stack img, .tech-stack i');
        techIcons.forEach(icon => {
            // Remove tooltip creation functionality
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.15)';
                icon.style.filter = 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
                icon.style.filter = 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3))';
            });
        });
    });
    
    // Add toggle button for logo style
    createLogoToggleButton();
}); 