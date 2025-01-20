// Form Submission with Formspree
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const formData = new FormData(form);
    const feedbackMessage = document.getElementById("feedback-message");

    // Reset feedback message initially
    feedbackMessage.textContent = "";
    feedbackMessage.style.display = "none";

    // Send form data to Formspree
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            "Accept": "application/json" 
        }
    })
    .then(response => {
        if (response.ok) {
            // Display success feedback
            displayFeedback("Your message has been sent successfully!", "success");
            form.reset(); // Reset the form after successful submission
        } else {
            // If response is not ok, display error feedback
            response.text().then(text => {
                console.error("Form submission error:", text);
                displayFeedback("There was an error submitting your message. Please try again.", "error");
            });
        }
    })
    .catch(error => {
        // If there's a network or other error, display a generic error message
        console.error("Network or other error:", error);
        displayFeedback("There was an error submitting your message. Please try again.", "error");
    });

    // Function to display feedback messages
    function displayFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.style.display = "block";

        if (type === "success") {
            feedbackMessage.style.color = "#4CAF50"; // Green for success
        } else if (type === "error") {
            feedbackMessage.style.color = "#FF6F61"; // Red for error
        }
    }
});


// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navList.classList.toggle('active');
        }
    });
}

// Handle window resizing for mobile menu toggle
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navList.classList.contains('active')) {
        navList.classList.remove('active');
    }
});

// Close the menu when clicking on a link
if (navList) {
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
            }
        });
    });
}

// Smooth Scrolling for Internal Links
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// FAQ Toggle
const faqItems = document.querySelectorAll('.faq-item h3');
faqItems.forEach(item => {
    item.setAttribute('aria-expanded', 'false');
    item.addEventListener('click', () => {
        const answer = item.nextElementSibling;
        const isExpanded = item.getAttribute('aria-expanded') === 'true';

        faqItems.forEach(otherItem => {
            const otherAnswer = otherItem.nextElementSibling;
            if (otherItem !== item) {
                otherAnswer.style.display = 'none';
                otherItem.setAttribute('aria-expanded', 'false');
            }
        });

        if (answer) {  // Ensure the next sibling exists
            answer.style.display = isExpanded ? 'none' : 'block';
            item.setAttribute('aria-expanded', !isExpanded);
        }
    });
});

// Carousel Navigation
let currentIndex = 0;

function navigateCarousel(direction) {
    const container = document.querySelector('.carousel-container');
    const items = Array.from(document.querySelectorAll('.carousel-item')).filter(item => item.style.display !== 'none');
    const totalItems = items.length;

    if (totalItems === 0) return; // No visible items, stop navigation

    // Update currentIndex with wrapping
    currentIndex = (currentIndex + direction + totalItems) % totalItems;

    // Calculate the new offset for the visible items
    const offset = -currentIndex * 100;
    container.style.transform = `translateX(${offset}%)`;

    updateProgressBar(currentIndex, totalItems);
}

function updateProgressBar(index, total) {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((index + 1) / total) * 100;
    progressBar.style.width = `${progress}%`;
}

// Search input for carousel items
document.getElementById('search-input').addEventListener('input', function () {
    updateSearchResults(); // Trigger search result update on input change
    resetCarousel();       // Reset carousel index to the first visible item
});

function updateSearchResults() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('.carousel-item');
    let found = false;

    items.forEach(item => {
        const courseName = item.querySelector('.course-name').textContent.toLowerCase();
        if (courseName.includes(query)) {
            item.style.display = 'flex'; // Show matching item
            found = true;
        } else {
            item.style.display = 'none'; // Hide non-matching item
        }
    });

    // Show "No results found" message if no items match
    const noResultsMessage = document.getElementById('no-results-message');
    if (!found) {
        if (!noResultsMessage) {
            const message = document.createElement('p');
            message.id = 'no-results-message';
            message.textContent = 'No courses found';
            message.style.textAlign = 'center';
            message.style.fontSize = '1.2rem';
            message.style.color = '#FF6F61';
            document.querySelector('.search-bar').appendChild(message);
        }
    } else {
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }
}

function resetCarousel() {
    const items = Array.from(document.querySelectorAll('.carousel-item')).filter(item => item.style.display !== 'none');
    const container = document.querySelector('.carousel-container');

    if (items.length > 0) {
        currentIndex = 0; // Reset to the first visible item
        container.style.transform = `translateX(0%)`;
        updateProgressBar(currentIndex, items.length);
    }
}

// Function to toggle the description visibility when a course is clicked
function toggleDescription(courseElement, descriptionId) {
    const description = document.getElementById(descriptionId);
    if (description.classList.contains('open')) {
        description.classList.remove('open'); // Close description
    } else {
        // Close any open descriptions
        const openDescriptions = document.querySelectorAll('.course-description.open');
        openDescriptions.forEach(desc => desc.classList.remove('open'));

        // Open the clicked description
        description.classList.add('open');
    }
}

// Testimonials section (AutoPlay)
(function () {
    let currentUniqueSlide = 0;
    let uniqueSlideInterval;

    function updateUniqueSlides() {
        const slides = document.querySelectorAll('.unique-testimonial-card');
        const dots = document.querySelectorAll('.unique-dot');
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            dots[index].classList.remove('active');
        });
        slides[currentUniqueSlide].classList.add('active');
        dots[currentUniqueSlide].classList.add('active');
    }

    function nextUniqueSlide() {
        const slides = document.querySelectorAll('.unique-testimonial-card');
        currentUniqueSlide = (currentUniqueSlide + 1) % slides.length;
        updateUniqueSlides();
    }

    function goToUniqueSlide(index) {
        currentUniqueSlide = index;
        updateUniqueSlides();
    }

    function startUniqueAutoplay() {
        uniqueSlideInterval = setInterval(nextUniqueSlide, 5000);
    }

    function stopUniqueAutoplay() {
        clearInterval(uniqueSlideInterval);
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateUniqueSlides();
        startUniqueAutoplay();

        // Pause autoplay on hover
        document.querySelector('.unique-slider').addEventListener('mouseover', stopUniqueAutoplay);
        document.querySelector('.unique-slider').addEventListener('mouseout', startUniqueAutoplay);
    });
})();

// Hero Section Functionality
document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.getElementById("reveal-text");
    const text = textElement.textContent; // Original text
    textElement.textContent = ""; // Clear the text content

    [...text].forEach((char, index) => {
        const span = document.createElement("span");

        if (char === " ") {
            span.classList.add("space");
        } else {
            span.textContent = char;

            // Highlight for the letter "O"
            if (char === "O") {
                span.classList.add("highlight");
            }
        }

        // animation delay for each letter
        span.style.animationDelay = `${index * 0.15}s`;
        textElement.appendChild(span);
    });
});
