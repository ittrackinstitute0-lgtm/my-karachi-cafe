/**
 * My Karachi Café - Interactive Scripts
 * Features: Mobile drawer, sticky nav, menu filtering, order cart,
 * table reservation modal, live cafe status, and smooth scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Dynamic Year in Footer
  // --------------------------------------------------------------------------
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Header & Back to Top
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header blur/compact state
    if (scrollPos > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollPos > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const backdrop = document.getElementById('backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    backdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --------------------------------------------------------------------------
  // 4. Menu Category Filtering
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Switch active class
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Interactive Cart & WhatsApp Quick Ordering
  // --------------------------------------------------------------------------
  const orderAddButtons = document.querySelectorAll('.order-add-btn');
  const summaryCount = document.getElementById('summaryCount');
  const summaryTotal = document.getElementById('summaryTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cart = {};

  orderAddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const itemName = btn.getAttribute('data-name');
      const itemPrice = parseInt(btn.getAttribute('data-price'), 10);

      if (cart[itemName]) {
        cart[itemName].qty += 1;
      } else {
        cart[itemName] = { price: itemPrice, qty: 1 };
      }

      // Visual feedback on the button
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Added (${cart[itemName].qty})`;
      btn.style.background = 'var(--color-primary)';
      btn.style.color = '#12141a';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);

      updateCartUI();
    });
  });

  function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;

    for (const key in cart) {
      totalItems += cart[key].qty;
      totalPrice += cart[key].price * cart[key].qty;
    }

    if (summaryCount) {
      summaryCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'} selected`;
    }
    if (summaryTotal) {
      summaryTotal.textContent = `Total: PKR ${totalPrice.toLocaleString()}`;
    }

    if (checkoutBtn) {
      if (totalItems > 0) {
        checkoutBtn.removeAttribute('disabled');
      } else {
        checkoutBtn.setAttribute('disabled', 'true');
      }
    }
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      let message = "Salam My Karachi Café! I'd like to place an order:%0A";
      let totalPrice = 0;

      for (const [name, item] of Object.entries(cart)) {
        message += `• ${item.qty}x ${name} - PKR ${(item.price * item.qty).toLocaleString()}%0A`;
        totalPrice += item.price * item.qty;
      }

      message += `%0A*Grand Total: PKR ${totalPrice.toLocaleString()}*%0APlease confirm my order & delivery/pickup time!`;

      const whatsappURL = `https://wa.me/923001234567?text=${message}`;
      window.open(whatsappURL, '_blank');
    });
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Table Reservation & Modal Confirmation
  // --------------------------------------------------------------------------
  const reservationForm = document.getElementById('reservationForm');
  const bookingModal = document.getElementById('bookingModal');
  const modalBookingDetails = document.getElementById('modalBookingDetails');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');

  // Pre-fill today's date in reservation date input
  const resDateInput = document.getElementById('resDate');
  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.value = today;
    resDateInput.min = today;
  }

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('resName').value.trim();
      const phone = document.getElementById('resPhone').value.trim();
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const guests = document.getElementById('resGuests').value;
      const seating = document.getElementById('resSeating').value;
      const notes = document.getElementById('resNotes').value.trim();

      const bookingRef = 'MKC-' + Math.floor(1000 + Math.random() * 9000);

      // Generate visual digital ticket inside modal
      modalBookingDetails.innerHTML = `
        <div class="ticket-line">
          <span>Booking Reference</span>
          <strong>#${bookingRef}</strong>
        </div>
        <div class="ticket-line">
          <span>Guest Name</span>
          <strong>${escapeHTML(name)}</strong>
        </div>
        <div class="ticket-line">
          <span>Contact Number</span>
          <strong>${escapeHTML(phone)}</strong>
        </div>
        <div class="ticket-line">
          <span>Date & Time</span>
          <strong>${date} at ${time}</strong>
        </div>
        <div class="ticket-line">
          <span>Party Size</span>
          <strong>${guests} ${guests === '1' ? 'Person' : 'Guests'}</strong>
        </div>
        <div class="ticket-line">
          <span>Seating Section</span>
          <strong>${seating}</strong>
        </div>
        ${notes ? `
        <div class="ticket-line">
          <span>Special Request</span>
          <strong style="max-width: 200px; text-align: right;">${escapeHTML(notes)}</strong>
        </div>` : ''}
        <div style="margin-top: 1rem; font-size: 0.85rem; color: #ffd166; background: rgba(245, 166, 35, 0.1); padding: 0.6rem 0.8rem; border-radius: 6px;">
          <i class="fa-solid fa-mug-hot"></i> A warm table under our fairy lights has been set aside for you. An SMS confirmation will arrive shortly.
        </div>
      `;

      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      reservationForm.reset();
      if (resDateInput) {
        resDateInput.value = new Date().toISOString().split('T')[0];
      }
    });
  }

  function closeModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }

  // --------------------------------------------------------------------------
  // 7. Active Nav Link on Scroll (Intersection Observer)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // --------------------------------------------------------------------------
  // 8. Newsletter Subscription Feedback
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.style.display = 'none';
      newsletterSuccess.style.display = 'block';
    });
  }

  // --------------------------------------------------------------------------
  // Helper: Sanitize User Input
  // --------------------------------------------------------------------------
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
