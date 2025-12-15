// Search Page JavaScript

const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

const professions = [
  'Plombier', 'Électricien', 'Menuisier', 'Peintre', 'Couturière', 
  'Jardinier', 'Infirmière', 'Maçon', 'Carreleur', 'Plâtrier'
];

const cities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 
  'Meknès', 'Oujda', 'Kenitra', 'Tetouan'
];

class SearchManager {
  constructor() {
    this.currentResults = [];
    this.filteredResults = [];
    this.currentView = 'list';
    this.currentFilters = {
      search: '',
      profession: '',
      city: '',
      rating: '',
      budgetMin: '',
      budgetMax: '',
      availableNow: false
    };
    this.sortBy = 'rating';
    this.debounceTimer = null;
    
    this.init();
  }

  async init() {
    this.loadSavedFilters();
    this.setupEventListeners();
    await this.fetchArtisans();
    this.populateFilterOptions();
    this.renderResults();
    this.updateResultsCount();
  }

  async fetchArtisans() {
    this.showLoading();
    try {
      const response = await fetch(`${API_BASE_URL}/api/artisans?limit=100`);
      if (!response.ok) throw new Error('Failed to load artisans');
      const data = await response.json();
      
      this.currentResults = (data.data || []).map(artisan => ({
        id: artisan._id,
        name: `${artisan.firstName} ${artisan.lastName}`,
        profession: artisan.profession,
        city: artisan.city,
        rating: artisan.rating || 0,
        reviewCount: artisan.reviewCount || 0,
        description: artisan.description || '',
        skills: artisan.skills || [],
        priceRange: { 
            min: artisan.hourlyRate || 0, 
            max: artisan.hourlyRate || 0 
        },
        availability: artisan.availability === 'immediate' ? 'available' : 'busy',
        avatar: (artisan.firstName[0] + artisan.lastName[0]).toUpperCase(),
        distance: 0 // Backend doesn't support distance yet
      }));
      
      this.filteredResults = [...this.currentResults];
      this.applyFilters();
      
    } catch (error) {
      console.error('Error fetching artisans:', error);
      this.currentResults = [];
      this.filteredResults = [];
    } finally {
      this.hideLoading();
    }
  }

  showLoading() {
      const loadingState = document.getElementById('loading-state');
      const resultsContent = document.getElementById('results-content');
      if (loadingState) loadingState.classList.remove('hidden');
      if (resultsContent) resultsContent.classList.add('hidden');
  }

  hideLoading() {
      const loadingState = document.getElementById('loading-state');
      const resultsContent = document.getElementById('results-content');
      if (loadingState) loadingState.classList.add('hidden');
      if (resultsContent) resultsContent.classList.remove('hidden');
  }

  loadSavedFilters() {
    const saved = localStorage.getItem('searchFilters');
    if (saved) {
      this.currentFilters = { ...this.currentFilters, ...JSON.parse(saved) };
      this.applySavedFilters();
    }
  }

  saveFilters() {
    localStorage.setItem('searchFilters', JSON.stringify(this.currentFilters));
  }

  applySavedFilters() {
    // Apply saved filters to form elements
    const professionEl = document.getElementById('profession-filter');
    if (professionEl) professionEl.value = this.currentFilters.profession;
    
    const cityEl = document.getElementById('city-filter');
    if (cityEl) cityEl.value = this.currentFilters.city;
    
    const minEl = document.getElementById('budget-min');
    if (minEl) minEl.value = this.currentFilters.budgetMin;
    
    const maxEl = document.getElementById('budget-max');
    if (maxEl) maxEl.value = this.currentFilters.budgetMax;
    
    const availableEl = document.getElementById('available-now');
    if (availableEl) availableEl.checked = this.currentFilters.availableNow;
    
    const ratingRadio = document.querySelector(`input[name="rating"][value="${this.currentFilters.rating}"]`);
    if (ratingRadio) ratingRadio.checked = true;
  }

  populateFilterOptions() {
    // Populate profession filter
    const professionSelect = document.getElementById('profession-filter');
    const uniqueProfessions = [...new Set([...professions, ...this.currentResults.map(a => a.profession)])].sort();
    
    uniqueProfessions.forEach(profession => {
      // Check if option already exists
      if (!professionSelect.querySelector(`option[value="${profession}"]`)) {
        const option = document.createElement('option');
        option.value = profession;
        option.textContent = profession;
        professionSelect.appendChild(option);
      }
    });

    // Populate city filter
    const citySelect = document.getElementById('city-filter');
    const uniqueCities = [...new Set([...cities, ...this.currentResults.map(a => a.city)])].sort();
    
    uniqueCities.forEach(city => {
       if (!citySelect.querySelector(`option[value="${city}"]`)) {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
       }
    });
  }

  setupEventListeners() {
    // Search input with debouncing
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      this.debounce(() => {
        this.currentFilters.search = e.target.value;
        this.applyFilters();
      }, 300);
    });

    // Search suggestions
    searchInput.addEventListener('input', () => this.showSuggestions());
    searchInput.addEventListener('blur', () => this.hideSuggestions());
    searchInput.addEventListener('keydown', (e) => this.handleSuggestionKeydown(e));

    // Filter event listeners
    document.getElementById('profession-filter').addEventListener('change', (e) => {
      this.currentFilters.profession = e.target.value;
      this.applyFilters();
    });

    document.getElementById('city-filter').addEventListener('change', (e) => {
      this.currentFilters.city = e.target.value;
      this.applyFilters();
    });

    document.querySelectorAll('input[name="rating"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.currentFilters.rating = e.target.value;
        this.applyFilters();
      });
    });

    document.getElementById('budget-min').addEventListener('input', (e) => {
      this.currentFilters.budgetMin = e.target.value;
      this.applyFilters();
    });

    document.getElementById('budget-max').addEventListener('input', (e) => {
      this.currentFilters.budgetMax = e.target.value;
      this.applyFilters();
    });

    document.getElementById('available-now').addEventListener('change', (e) => {
      this.currentFilters.availableNow = e.target.checked;
      this.applyFilters();
    });

    // Budget presets
    document.querySelectorAll('.budget-preset').forEach(preset => {
      preset.addEventListener('click', (e) => {
        const min = e.target.dataset.min;
        const max = e.target.dataset.max;
        document.getElementById('budget-min').value = min;
        document.getElementById('budget-max').value = max;
        this.currentFilters.budgetMin = min;
        this.currentFilters.budgetMax = max;
        this.applyFilters();
      });
    });

    // Sort dropdown
    document.getElementById('sort-select').addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.sortResults();
      this.renderResults();
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });

    // Filter actions
    document.getElementById('apply-filters').addEventListener('click', () => {
      this.applyFilters();
    });

    document.getElementById('clear-filters').addEventListener('click', () => {
      this.clearFilters();
    });

    // Mobile filters toggle
    document.getElementById('toggle-filters').addEventListener('click', () => {
      this.toggleFilters();
    });

    // No results actions
    document.getElementById('clear-search').addEventListener('click', () => {
      this.clearSearch();
    });

    // Contact modal
    this.setupModal();
  }

  setupModal() {
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    const backdrop = document.getElementById('modal-backdrop');
    const form = document.getElementById('contact-form');

    closeBtn.addEventListener('click', () => this.hideModal());
    cancelBtn.addEventListener('click', () => this.hideModal());
    backdrop.addEventListener('click', () => this.hideModal());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitContactForm();
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        this.hideModal();
      }
    });
  }

  debounce(func, wait) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, wait);
  }

  showSuggestions() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (!searchTerm || searchTerm.length < 2) {
      suggestionsContainer.classList.add('hidden');
      return;
    }

    const suggestions = this.generateSuggestions(searchTerm);
    
    if (suggestions.length === 0) {
      suggestionsContainer.classList.add('hidden');
      return;
    }

    suggestionsContainer.innerHTML = suggestions
      .map(suggestion => `
        <div class="suggestion-item" data-type="${suggestion.type}" data-value="${suggestion.value}">
          <div class="suggestion-text">${suggestion.text}</div>
          <div class="suggestion-category">${suggestion.category}</div>
        </div>
      `)
      .join('');

    suggestionsContainer.classList.remove('hidden');

    // Add click listeners to suggestions
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectSuggestion(item);
      });
    });
  }

  generateSuggestions(searchTerm) {
    const suggestions = [];

    // Search in unique professions (including newly fetched)
    const allProfessions = [...new Set([...professions, ...this.currentResults.map(a => a.profession)])];
    allProfessions.forEach(profession => {
      if (profession.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'profession',
          value: profession,
          text: profession,
          category: 'Profession'
        });
      }
    });

    // Search in unique cities
    const allCities = [...new Set([...cities, ...this.currentResults.map(a => a.city)])];
    allCities.forEach(city => {
      if (city.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'city',
          value: city,
          text: city,
          category: 'City'
        });
      }
    });

    // Search in artisan names
    this.currentResults.forEach(artisan => {
      if (artisan.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'artisan',
          value: artisan.name,
          text: artisan.name,
          category: artisan.profession
        });
      }
    });

    // Search in skills
    this.currentResults.forEach(artisan => {
      artisan.skills.forEach(skill => {
        if (skill.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            type: 'skill',
            value: skill,
            text: skill,
            category: 'Skill'
          });
        }
      });
    });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }

  selectSuggestion(item) {
    const value = item.dataset.value;
    const type = item.dataset.type;
    
    document.getElementById('search-input').value = value;
    document.getElementById('search-suggestions').classList.add('hidden');

    // Apply specific filter based on suggestion type
    switch (type) {
      case 'profession':
        document.getElementById('profession-filter').value = value;
        this.currentFilters.profession = value;
        break;
      case 'city':
        document.getElementById('city-filter').value = value;
        this.currentFilters.city = value;
        break;
    }

    this.applyFilters();
  }

  handleSuggestionKeydown(e) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    const highlighted = document.querySelector('.suggestion-item.highlighted');
    
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (highlighted) {
          highlighted.classList.remove('highlighted');
          const next = highlighted.nextElementSibling || suggestions[0];
          next.classList.add('highlighted');
        } else {
          suggestions[0].classList.add('highlighted');
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (highlighted) {
          highlighted.classList.remove('highlighted');
          const prev = highlighted.previousElementSibling || suggestions[suggestions.length - 1];
          prev.classList.add('highlighted');
        } else {
          suggestions[suggestions.length - 1].classList.add('highlighted');
        }
        break;
      case 'Enter':
        if (highlighted) {
          e.preventDefault();
          this.selectSuggestion(highlighted);
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  hideSuggestions() {
    setTimeout(() => {
      const el = document.getElementById('search-suggestions');
      if (el) el.classList.add('hidden');
    }, 150);
  }

  applyFilters() {
    this.saveFilters();
    
    this.filteredResults = this.currentResults.filter(artisan => {
      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const matchesSearch = 
          artisan.name.toLowerCase().includes(searchTerm) ||
          artisan.profession.toLowerCase().includes(searchTerm) ||
          artisan.city.toLowerCase().includes(searchTerm) ||
          artisan.description.toLowerCase().includes(searchTerm) ||
          artisan.skills.some(skill => skill.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Profession filter
      if (this.currentFilters.profession && artisan.profession !== this.currentFilters.profession) {
        return false;
      }

      // City filter
      if (this.currentFilters.city && artisan.city !== this.currentFilters.city) {
        return false;
      }

      // Rating filter
      if (this.currentFilters.rating && artisan.rating < parseFloat(this.currentFilters.rating)) {
        return false;
      }

      // Budget filter
      if (this.currentFilters.budgetMin && artisan.priceRange.min < parseFloat(this.currentFilters.budgetMin)) {
        return false;
      }
      
      if (this.currentFilters.budgetMax && artisan.priceRange.max > parseFloat(this.currentFilters.budgetMax)) {
        return false;
      }

      // Availability filter
      if (this.currentFilters.availableNow && artisan.availability !== 'available') {
        return false;
      }

      return true;
    });

    this.sortResults();
    this.renderResults();
    this.updateResultsCount();
  }

  sortResults() {
    this.filteredResults.sort((a, b) => {
      switch (this.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-asc':
          return a.priceRange.min - b.priceRange.min;
        case 'price-desc':
          return b.priceRange.max - a.priceRange.max;
        case 'distance':
          return a.distance - b.distance;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return b.rating - a.rating;
      }
    });
  }

  renderResults() {
    const container = document.getElementById('list-view');
    if (!container) return;
    
    if (this.filteredResults.length === 0) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();
    
    container.innerHTML = this.filteredResults.map(artisan => this.renderArtisanCard(artisan)).join('');
    
    // Add contact button listeners
    container.querySelectorAll('.contact-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const artisanId = e.target.dataset.artisanId;
        this.showContactModal(artisanId);
      });
    });
  }

  renderArtisanCard(artisan) {
    const availabilityClass = artisan.availability === 'available' ? 'available' : 'busy';
    const availabilityText = artisan.availability === 'available' ? 
      i18n.translate('search.available') : 
      i18n.translate('search.busy');
    
    return `
      <div class="artisan-card" data-artisan-id="${artisan.id}">
        <div class="artisan-avatar">${artisan.avatar}</div>
        <div class="artisan-info">
          <div class="artisan-header">
            <div>
              <h3 class="artisan-name">${artisan.name}</h3>
              <p class="artisan-profession">${artisan.profession}</p>
              <p class="artisan-location">📍 ${artisan.city} • ${artisan.distance}km</p>
            </div>
          </div>
          
          <div class="artisan-rating">
            <div class="stars">${'★'.repeat(Math.floor(artisan.rating))}${'☆'.repeat(5 - Math.floor(artisan.rating))}</div>
            <span class="rating-count">${artisan.rating} (${artisan.reviewCount} reviews)</span>
          </div>
          
          <p class="artisan-description">${artisan.description}</p>
          
          <div class="artisan-skills">
            ${artisan.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
          
          <p class="artisan-price">${artisan.priceRange.min} - ${artisan.priceRange.max} DH</p>
        </div>
        
        <div class="artisan-actions">
          <div class="availability-badge ${availabilityClass}">
            ${availabilityText}
          </div>
          <button class="contact-btn" data-artisan-id="${artisan.id}">
            ${i18n.translate('search.contact')}
          </button>
        </div>
      </div>
    `;
  }

  showNoResults() {
    const noResults = document.getElementById('no-results');
    const listView = document.getElementById('list-view');
    if (noResults) noResults.classList.remove('hidden');
    if (listView) listView.classList.add('hidden');
  }

  hideNoResults() {
    const noResults = document.getElementById('no-results');
    const listView = document.getElementById('list-view');
    if (noResults) noResults.classList.add('hidden');
    if (listView) listView.classList.remove('hidden');
  }

  updateResultsCount() {
    const count = this.filteredResults.length;
    const countElement = document.getElementById('results-count');
    
    if (!countElement) return;

    if (i18n && typeof i18n.translate === 'function') {
      countElement.textContent = count;
      countElement.nextElementSibling.textContent = count === 1 ? 
        i18n.translate('search.results.found') : 
        `${count} ${i18n.translate('search.results.found')}`;
    } else {
      countElement.textContent = count;
      countElement.nextElementSibling.textContent = count === 1 ? 'professional found' : 'professionals found';
    }
  }

  switchView(view) {
    this.currentView = view;
    
    // Update toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      const isActive = btn.dataset.view === view;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });

    // Show/hide views
    const listView = document.getElementById('list-view');
    const mapView = document.getElementById('map-view');
    
    if (view === 'list') {
      if (listView) listView.classList.remove('hidden');
      if (mapView) mapView.classList.add('hidden');
    } else {
      if (listView) listView.classList.add('hidden');
      if (mapView) mapView.classList.remove('hidden');
    }
  }

  clearFilters() {
    this.currentFilters = {
      search: '',
      profession: '',
      city: '',
      rating: '',
      budgetMin: '',
      budgetMax: '',
      availableNow: false
    };

    // Reset form elements
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    const professionEl = document.getElementById('profession-filter');
    if (professionEl) professionEl.value = '';
    
    const cityEl = document.getElementById('city-filter');
    if (cityEl) cityEl.value = '';
    
    const minEl = document.getElementById('budget-min');
    if (minEl) minEl.value = '';
    
    const maxEl = document.getElementById('budget-max');
    if (maxEl) maxEl.value = '';
    
    const availableEl = document.getElementById('available-now');
    if (availableEl) availableEl.checked = false;
    
    const ratingRadio = document.querySelector('input[name="rating"][value=""]');
    if (ratingRadio) ratingRadio.checked = true;

    this.applyFilters();
  }

  clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    this.currentFilters.search = '';
    this.applyFilters();
  }

  toggleFilters() {
    const sidebar = document.getElementById('filters-sidebar');
    const toggleBtn = document.getElementById('toggle-filters');
    
    if (sidebar) sidebar.classList.toggle('hidden');
    if (toggleBtn && sidebar) {
        toggleBtn.textContent = sidebar.classList.contains('hidden') ? 
        i18n.translate('search.filters.show') : 
        i18n.translate('search.filters.hide');
    }
  }

  showContactModal(artisanId) {
    const modal = document.getElementById('contact-modal');
    const artisan = this.currentResults.find(a => a.id === artisanId);
    
    if (!artisan) return;

    // Populate modal with artisan info
    document.getElementById('artisan-id').value = artisanId;
    document.querySelector('.modal-header h2').textContent = 
      `${i18n.translate('contact.modal.title')} - ${artisan.name}`;

    modal.classList.remove('hidden');
    document.getElementById('contact-name').focus();
  }

  hideModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.add('hidden');
    const form = document.getElementById('contact-form');
    if (form) form.reset();
  }

  async submitContactForm() {
    const formData = new FormData(document.getElementById('contact-form'));
    const data = Object.fromEntries(formData.entries());
    
    // Validate phone number (Moroccan format)
    const phoneRegex = /^(\+212|0)[567]\d{8}$/;
    if (!phoneRegex.test(data.phone)) {
      alert(i18n.translate('contact.modal.invalidPhone') || 'Please enter a valid Moroccan phone number');
      return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = i18n.translate('contact.modal.sending') || 'Sending...';

    try {
      // Create contact request via API
      // Endpoint: POST /api/demandes (as per server.js mounting)
      // But contact form here is for specific artisan?
      // "ClientRequest" model has "serviceCategory", "serviceType", "city", etc.
      // But it doesn't seem to have direct link to an artisan in the model definition in memory?
      // "ClientRequests with budget, deadline, tracking"
      // Wait, this modal is "Contact Professional".
      // There is no endpoint documented for contacting a specific artisan in the ticket description.
      // "POST /api/demandes (create contact request)" exists.
      // I'll assume for now we just use the mock behavior or try to use /api/demandes if it fits.
      // Since ticket didn't ask to fix "Contact Professional" feature specifically but "Signup form" and "Search page display",
      // I will keep the mock behavior for contact form submit to avoid breaking it if API is not ready for direct contact.
      // But I will log it.
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Contact form submitted:', data);
      
      // Show success message
      alert(i18n.translate('contact.modal.success') || 'Message sent successfully!');
      
      this.hideModal();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert(i18n.translate('contact.modal.error') || 'Failed to send message. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

// Enhanced translations for search page
const searchTranslations = {
  en: {
    search: {
      title: 'Search Services',
      subtitle: 'Find the perfect professional for your needs',
      placeholder: 'Search for services, professionals...',
      viewList: 'List',
      viewMap: 'Map',
      available: 'Available',
      busy: 'Busy',
      contact: 'Contact',
      loading: 'Loading professionals...',
      noResults: {
        title: 'No professionals found',
        description: 'Try adjusting your search criteria or filters',
        clearSearch: 'Clear Search'
      },
      map: {
        comingSoon: 'Map View Coming Soon',
        description: 'Map integration will be available in a future update.'
      },
      results: {
        found: 'professionals found',
        sortBy: 'Sort by:',
        sortRating: 'Rating (High to Low)',
        sortPriceAsc: 'Price (Low to High)',
        sortPriceDesc: 'Price (High to Low)',
        sortDistance: 'Distance',
        sortReviews: 'Most Reviews'
      },
      filters: {
        title: 'Filters',
        toggle: 'Hide Filters',
        show: 'Show Filters',
        profession: 'Profession',
        allProfessions: 'All Professions',
        city: 'City',
        allCities: 'All Cities',
        rating: 'Minimum Rating',
        anyRating: 'Any Rating',
        budget: 'Budget Range',
        availability: 'Availability',
        availableNow: 'Available Now',
        apply: 'Apply Filters',
        clear: 'Clear All'
      }
    },
    contact: {
      modal: {
        title: 'Contact Professional',
        name: 'Your Name',
        namePlaceholder: 'John Doe',
        phone: 'Phone Number',
        phonePlaceholder: '+212 6XX XXX XXX',
        message: 'Message',
        messagePlaceholder: 'Describe your service needs...',
        cancel: 'Cancel',
        send: 'Send Message',
        invalidPhone: 'Please enter a valid Moroccan phone number',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again.'
      }
    }
  },
  fr: {
    search: {
      title: 'Rechercher des Services',
      subtitle: 'Trouvez le professionnel parfait pour vos besoins',
      placeholder: 'Rechercher des services, professionnels...',
      viewList: 'Liste',
      viewMap: 'Carte',
      available: 'Disponible',
      busy: 'Occupé',
      contact: 'Contacter',
      loading: 'Chargement des professionnels...',
      noResults: {
        title: 'Aucun professionnel trouvé',
        description: 'Essayez d\'ajuster vos critères de recherche ou filtres',
        clearSearch: 'Effacer la Recherche'
      },
      map: {
        comingSoon: 'Vue Carte Bientôt Disponible',
        description: 'L\'intégration de carte sera disponible dans une future mise à jour.'
      },
      results: {
        found: 'professionnels trouvés',
        sortBy: 'Trier par:',
        sortRating: 'Note (Du Plus Élevé au Plus Faible)',
        sortPriceAsc: 'Prix (Du Plus Faible au Plus Élevé)',
        sortPriceDesc: 'Prix (Du Plus Élevé au Plus Faible)',
        sortDistance: 'Distance',
        sortReviews: 'Plus d\'Avis'
      },
      filters: {
        title: 'Filtres',
        toggle: 'Masquer les Filtres',
        show: 'Afficher les Filtres',
        profession: 'Profession',
        allProfessions: 'Toutes les Professions',
        city: 'Ville',
        allCities: 'Toutes les Villes',
        rating: 'Note Minimale',
        anyRating: 'Toutes les Notes',
        budget: 'Gamme de Prix',
        availability: 'Disponibilité',
        availableNow: 'Disponible Maintenant',
        apply: 'Appliquer les Filtres',
        clear: 'Tout Effacer'
      }
    },
    contact: {
      modal: {
        title: 'Contacter le Professionnel',
        name: 'Votre Nom',
        namePlaceholder: 'Jean Dupont',
        phone: 'Numéro de Téléphone',
        phonePlaceholder: '+212 6XX XXX XXX',
        message: 'Message',
        messagePlaceholder: 'Décrivez vos besoins en service...',
        cancel: 'Annuler',
        send: 'Envoyer le Message',
        invalidPhone: 'Veuillez entrer un numéro de téléphone marocain valide',
        sending: 'Envoi...',
        success: 'Message envoyé avec succès!',
        error: 'Échec de l\'envoi du message. Veuillez réessayer.'
      }
    }
  },
  ar: {
    search: {
      title: 'البحث عن الخدمات',
      subtitle: 'اعثر على المحترف المثالي لاحتياجاتك',
      placeholder: 'ابحث عن خدمات، محترفين...',
      viewList: 'قائمة',
      viewMap: 'خريطة',
      available: 'متاح',
      busy: 'مشغول',
      contact: 'اتصل',
      loading: 'تحميل المحترفين...',
      noResults: {
        title: 'لم يتم العثور على محترفين',
        description: 'حاول تعديل معايير البحث أو المرشحات',
        clearSearch: 'مسح البحث'
      },
      map: {
        comingSoon: 'عرض الخريطة قريباً',
        description: 'سيكون تكامل الخريطة متاحاً في تحديث مستقبلي.'
      },
      results: {
        found: 'محترفون موجودون',
        sortBy: 'ترتيب حسب:',
        sortRating: 'التقييم (من الأعلى للأقل)',
        sortPriceAsc: 'السعر (من الأقل للأعلى)',
        sortPriceDesc: 'السعر (من الأعلى للأقل)',
        sortDistance: 'المسافة',
        sortReviews: 'أكثر المراجعات'
      },
      filters: {
        title: 'المرشحات',
        toggle: 'إخفاء المرشحات',
        show: 'إظهار المرشحات',
        profession: 'المهنة',
        allProfessions: 'جميع المهن',
        city: 'المدينة',
        allCities: 'جميع المدن',
        rating: 'الحد الأدنى للتقييم',
        anyRating: 'أي تقييم',
        budget: 'نطاق الميزانية',
        availability: 'التوفر',
        availableNow: 'متاح الآن',
        apply: 'تطبيق المرشحات',
        clear: 'مسح الكل'
      }
    },
    contact: {
      modal: {
        title: 'اتصل بالمحترف',
        name: 'اسمك',
        namePlaceholder: 'أحمد محمد',
        phone: 'رقم الهاتف',
        phonePlaceholder: '+212 6XX XXX XXX',
        message: 'الرسالة',
        messagePlaceholder: 'اشرح احتياجاتك للخدمة...',
        cancel: 'إلغاء',
        send: 'إرسال الرسالة',
        invalidPhone: 'يرجى إدخال رقم هاتف مغربي صحيح',
        sending: 'جاري الإرسال...',
        success: 'تم إرسال الرسالة بنجاح!',
        error: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.'
      }
    }
  }
};

// Extend existing translations
Object.keys(searchTranslations).forEach(lang => {
  if (typeof translations !== 'undefined' && translations[lang]) {
    translations[lang] = { ...translations[lang], ...searchTranslations[lang] };
  }
});

// Search Page Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize search manager
  window.searchManager = new SearchManager();

  // Handle navigation from landing page
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  
  if (mode === 'find') {
    // Focus on search input for find mode
    setTimeout(() => {
      document.getElementById('search-input').focus();
    }, 500);
  }

  // Update translations when language changes
  if (typeof i18n !== 'undefined') {
      const originalSetLanguage = i18n.setLanguage;
      i18n.setLanguage = function(lang) {
        originalSetLanguage.call(this, lang);
        
        // Re-render search results with new translations
        if (window.searchManager) {
          window.searchManager.renderResults();
          window.searchManager.updateResultsCount();
        }
      };
  }

  // Add some realistic delays for better UX
  setTimeout(() => {
    const header = document.querySelector('.search-header');
    if (header) {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }
  }, 100);
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  if (window.searchManager) {
    window.searchManager.loadSavedFilters();
    window.searchManager.applyFilters();
  }
});
