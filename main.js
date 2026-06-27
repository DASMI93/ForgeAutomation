/**
 * MAIN.JS - Forge Automation
 * Premium UI Interactions, Canvas Particles, Modal Control, Accordions, and Form Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- LOADER HANDLING ---
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }, 600); // smooth entry
    });
    
    // Fallback if window load doesn't trigger quickly
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 2000);
  }

  // --- MOBILE NAVIGATION MENU ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileNavToggle.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileNavToggle.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- STICKY NAV & ACTIVE SECTION HIGHLIGHTING ---
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  
  const handleScroll = () => {
    // Add scrolled class for glass header styling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Tracking via Scroll position
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200; // Offset for trigger point

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);

  // --- CANVAS PARTICLE BACKGROUND ---
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 10;
        this.speedX = (Math.random() * 0.4) - 0.2;
        this.speedY = (Math.random() * 0.4) - 0.2;
      }

      draw() {
        ctx.fillStyle = 'rgba(249, 115, 22, 0.4)'; // Primary orange tint
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Slow float
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundary bounce
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Interaction with mouse pointer
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.hypot(dx, dy);
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            // Attract/Repel effect
            this.x -= dirX * force * 1.5;
            this.y -= dirY * force * 1.5;
          }
        }
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.min((canvas.width * canvas.height) / 10000, 100);
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Connect nearby particles with lines
      connectParticles();
      requestAnimationFrame(animateParticles);
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.hypot(dx, dy);

          if (distance < 120) {
            const alpha = (1 - (distance / 120)) * 0.15;
            ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    window.addEventListener('resize', resizeCanvas);
    
    // Set mouse coordinates when hovering hero
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateParticles();
  }

  // --- REVEAL ON SCROLL ANIMATION ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(r => revealObserver.observe(r));

  // --- GLASS CARD LIGHTING MOUSE INTERACTION ---
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- PARALLAX / 3D EFFECT FOR CODE MOCKUP ---
  const visualContainer = document.querySelector('.hero-visual');
  const codeMockup = document.querySelector('.code-mockup');
  if (visualContainer && codeMockup) {
    visualContainer.addEventListener('mousemove', (e) => {
      const rect = visualContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const calcX = -(y - (rect.height / 2)) / 15;
      const calcY = (x - (rect.width / 2)) / 15;
      
      codeMockup.style.transform = `rotateY(${calcY}deg) rotateX(${calcX}deg) scale(1.03)`;
    });
    
    visualContainer.addEventListener('mouseleave', () => {
      codeMockup.style.transform = `rotateY(-8deg) rotateX(5deg) scale(1)`;
    });
  }

  // --- STATS COUNT ANIMATION ---
  const statsSection = document.getElementById('statistics');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statsSection && statNumbers.length > 0) {
    let countersStarted = false;
    
    const startCounters = () => {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const suffix = stat.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 10);
        
        const timer = setInterval(() => {
          count += Math.ceil(target / (duration / stepTime));
          if (count >= target) {
            stat.innerHTML = target.toLocaleString() + `<span>${suffix}</span>`;
            clearInterval(timer);
          } else {
            stat.innerHTML = count.toLocaleString() + `<span>${suffix}</span>`;
          }
        }, stepTime);
      });
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          startCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --- FAQ ACCORDION TOGGLE ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other panels
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-panel').style.maxHeight = null;
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current panel
      if (isActive) {
        item.classList.remove('active');
        panel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- TESTIMONIALS SLIDER ---
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const testimonialPrev = document.querySelector('.testimonial-btn.prev');
  const testimonialNext = document.querySelector('.testimonial-btn.next');
  let currentSlide = 0;
  const slideCount = testimonialDots.length;

  const updateSlider = (index) => {
    currentSlide = (index + slideCount) % slideCount;
    testimonialTrack.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    
    testimonialDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  };

  if (testimonialTrack) {
    if (testimonialNext) {
      testimonialNext.addEventListener('click', () => updateSlider(currentSlide + 1));
    }
    if (testimonialPrev) {
      testimonialPrev.addEventListener('click', () => updateSlider(currentSlide - 1));
    }

    testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', () => updateSlider(index));
    });

    // Auto rotate every 7 seconds
    let sliderTimer = setInterval(() => updateSlider(currentSlide + 1), 7000);
    
    // Pause auto-rotation on mouse enter
    const sliderContainer = document.querySelector('.testimonials-slider');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(sliderTimer));
    sliderContainer.addEventListener('mouseleave', () => {
      sliderTimer = setInterval(() => updateSlider(currentSlide + 1), 7000);
    });
  }

  // --- DISCOVERY BOOKING MODAL CONTROL ---
  const modalOverlay = document.getElementById('booking-modal');
  const openModalBtns = document.querySelectorAll('.btn-booking');
  const closeModalBtn = document.querySelector('.modal-close-btn');

  const openModal = () => {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    document.addEventListener('keydown', handleEscKey);
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = 'auto'; // Unlock scroll
    document.removeEventListener('keydown', handleEscKey);
  };

  const handleEscKey = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // --- MODAL CALENDAR MOCKUP INTERACTIONS ---
  const calDays = document.querySelectorAll('.calendar-day-num:not(.disabled)');
  const timeSlots = document.querySelectorAll('.time-slot-btn');
  const modalSubmit = document.querySelector('.modal-submit-btn');
  
  let selectedDate = null;
  let selectedTime = null;

  calDays.forEach(day => {
    day.addEventListener('click', () => {
      calDays.forEach(d => d.classList.remove('active'));
      day.classList.add('active');
      selectedDate = day.textContent;
    });
  });

  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      selectedTime = slot.textContent;
    });
  });

  if (modalSubmit) {
    modalSubmit.addEventListener('click', () => {
      if (!selectedDate || !selectedTime) {
        alert('Please choose a date and a time slot first.');
        return;
      }
      modalSubmit.textContent = 'Scheduling...';
      modalSubmit.disabled = true;
      setTimeout(() => {
        modalSubmit.textContent = 'Scheduled Successfully!';
        modalSubmit.style.backgroundColor = '#10B981';
        modalSubmit.style.borderColor = '#10B981';
        
        // Show confirmation alert
        setTimeout(() => {
          alert(`Discovery Call Booked! \nDate: July ${selectedDate}, 2026 \nTime: ${selectedTime} BST. \nWe will email your Teams link shortly!`);
          closeModal();
          // Reset
          modalSubmit.textContent = 'Confirm Booking';
          modalSubmit.disabled = false;
          modalSubmit.style.backgroundColor = '';
          modalSubmit.style.borderColor = '';
          calDays.forEach(d => d.classList.remove('active'));
          timeSlots.forEach(s => s.classList.remove('active'));
          selectedDate = null;
          selectedTime = null;
        }, 800);
      }, 1200);
    });
  }

  // --- CONTACT FORM SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Disable and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="loader-spinner" style="width:16px; height:16px; margin:0; border-width:2px; display:inline-block;" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
        </svg> Sending...`;

      // Mock API call
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Validate inputs (simple demo)
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const msg = document.getElementById('form-comment').value.trim();

        if (!name || !email || !msg) {
          formMessage.className = 'form-message error';
          formMessage.textContent = 'Please fill out all required fields.';
          return;
        }

        // Show Success Action
        formMessage.className = 'form-message success';
        formMessage.textContent = "Thank you! We've received your query and will be in touch within 2 hours.";
        contactForm.reset();
        
        // Auto fade message
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 6000);
      }, 1500);
    });
  }
});
