class SmartBundleSelector {
  constructor() {
    this.bundlePrice = 1199;
    this.init();
  }

  init() {
    const selector = document.querySelector('[data-bundle-selector]');
    if (!selector) return;

    this.checkboxes = selector.querySelectorAll('.smart-bundle__item-checkbox');
    this.selectedCountEl = document.getElementById('selected-count');
    this.regularPriceEl = document.getElementById('regular-price');
    this.finalRegularPriceEl = document.getElementById('final-regular-price');
    this.saveAmountEl = document.getElementById('save-amount');
    this.bundleCheckoutEl = document.getElementById('bundle-checkout');
    this.regularCheckoutEl = document.getElementById('regular-checkout');
    this.addBtn = document.getElementById('bundle-add-btn');

    this.checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.updateBundleInfo());
    });

    this.addBtn.addEventListener('click', () => this.addToCart());
  }

  updateBundleInfo() {
    const selected = Array.from(this.checkboxes).filter(cb => cb.checked);
    const selectedCount = selected.length;
    const totalPrice = selected.reduce((sum, checkbox) => {
      return sum + parseInt(checkbox.dataset.itemPrice || 0);
    }, 0);

    // Update selected count
    this.selectedCountEl.textContent = selectedCount;

    // Update regular price
    this.regularPriceEl.textContent = '₹' + totalPrice;
    this.finalRegularPriceEl.textContent = '₹' + totalPrice;

    // Show/hide bundle offer
    if (selectedCount === 5) {
      this.regularCheckoutEl.classList.add('smart-bundle__price-option--hidden');
      this.bundleCheckoutEl.classList.remove('smart-bundle__price-option--hidden');
      
      const savings = totalPrice - this.bundlePrice;
      this.saveAmountEl.textContent = savings;

      // Enable button
      this.addBtn.disabled = false;
      this.addBtn.textContent = 'Add Bundle to Cart';
    } else if (selectedCount > 0) {
      this.regularCheckoutEl.classList.remove('smart-bundle__price-option--hidden');
      this.bundleCheckoutEl.classList.add('smart-bundle__price-option--hidden');

      this.addBtn.disabled = false;
      this.addBtn.textContent = `Add ${selectedCount} Items to Cart - ₹${totalPrice}`;
    } else {
      this.regularCheckoutEl.classList.remove('smart-bundle__price-option--hidden');
      this.bundleCheckoutEl.classList.add('smart-bundle__price-option--hidden');

      this.addBtn.disabled = true;
      this.addBtn.textContent = 'Select Items';
    }
  }

  addToCart() {
    const selected = Array.from(this.checkboxes).filter(cb => cb.checked);
    const selectedCount = selected.length;

    if (selectedCount === 0) {
      alert('कृपया कम से कम 1 item चुनें');
      return;
    }

    // Get selected items info
    const selectedItems = selected.map(cb => ({
      id: cb.dataset.itemId,
      name: cb.dataset.itemName,
      price: cb.dataset.itemPrice
    }));

    // Get final price
    const finalPrice = selectedCount === 5 ? this.bundlePrice : 
                       selected.reduce((sum, cb) => sum + parseInt(cb.dataset.itemPrice || 0), 0);

    // Create success message
    const message = selectedCount === 5 
      ? `✅ Bundle बंद! 5 Items के लिए ₹${this.bundlePrice} में जोड़ा गया`
      : `✅ ${selectedCount} Items (₹${finalPrice}) कार्ट में जोड़ा गया`;

    alert(message);

    // Log for debugging
    console.log('Bundle Added:', {
      items: selectedItems,
      count: selectedCount,
      price: finalPrice,
      isBundleDeal: selectedCount === 5
    });

    // In production, you would send this to your cart API
    // window.location.href = '/cart';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SmartBundleSelector();
});
