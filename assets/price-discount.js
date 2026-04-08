/**
 * Price Discount Calculator
 * Automatically applies discount based on price
 */

class PriceDiscount {
  constructor() {
    this.discountRules = [
      { minPrice: 0, maxPrice: 500, discount: 3 },      // ₹0-500: 3%
      { minPrice: 500, maxPrice: 1000, discount: 5 },   // ₹500-1000: 5%
      { minPrice: 1000, maxPrice: Infinity, discount: 7 } // ₹1000+: 7%
    ];
  }

  /**
   * Get discount percentage for price
   * @param {number} price - Product price (in paise)
   * @returns {number} Discount percentage
   */
  getDiscountPercentage(price) {
    const priceInRupees = price / 100; // Convert paise to rupees
    
    for (let rule of this.discountRules) {
      if (priceInRupees >= rule.minPrice && priceInRupees < rule.maxPrice) {
        return rule.discount;
      }
    }
    return 0;
  }

  /**
   * Calculate discounted price
   * @param {number} price - Original price (in paise)
   * @returns {object} Discounted price and percentage
   */
  calculateDiscountedPrice(price) {
    const discountPercent = this.getDiscountPercentage(price);
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    
    return {
      originalPrice: price,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      discountedPrice: Math.round(discountedPrice)
    };
  }

  /**
   * Update discounts in DOM
   */
  updatePricesOnPage() {
    // Find price items and update discounts
    const priceItems = document.querySelectorAll('[data-original-price]');
    
    priceItems.forEach(element => {
      const originalPrice = parseInt(element.getAttribute('data-original-price'));
      const discountInfo = this.calculateDiscountedPrice(originalPrice);
      
      // Update discount badge if present
      const discountBadge = element.querySelector('.discount-badge');
      if (discountBadge && discountInfo.discountPercent > 0) {
        discountBadge.textContent = `${discountInfo.discountPercent}% OFF`;
        discountBadge.style.display = 'inline-block';
      }
      
      // Display discounted price
      const priceDisplay = element.querySelector('.price-display');
      if (priceDisplay) {
        const originalDisplay = element.querySelector('.original-price-display');
        if (originalDisplay) {
          originalDisplay.textContent = this.formatPrice(discountInfo.originalPrice);
          originalDisplay.style.textDecoration = 'line-through';
          originalDisplay.style.opacity = '0.7';
        }
        priceDisplay.textContent = this.formatPrice(discountInfo.discountedPrice);
      }
    });
  }

  /**
   * Format price for display
   * @param {number} price - Price in paise
   * @returns {string} Formatted price
   */
  formatPrice(price) {
    const rupees = Math.floor(price / 100);
    const paise = price % 100;
    return `₹${rupees}${paise > 0 ? '.' + String(paise).padStart(2, '0') : ''}`;
  }

  /**
   * Initialize discount UI
   */
  initializeDiscountUI() {
    // Initialize all price containers
    this.updatePricesOnPage();
    
    // Track price changes (for variant selection)
    document.addEventListener('variant-changed', () => {
      setTimeout(() => this.updatePricesOnPage(), 100);
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const priceDiscount = new PriceDiscount();
  priceDiscount.initializeDiscountUI();
});

// Also work in lazy loading scenarios
window.addEventListener('load', () => {
  if (window.priceDiscount) {
    window.priceDiscount.updatePricesOnPage();
  }
});
