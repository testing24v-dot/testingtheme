class QuantitySelector extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        quantity-selector {
          display: flex;
          align-items: center;
          gap: 0;
        }
        quantity-selector button {
          width: 38px;
          height: 38px;
          border: 1px solid #ccc;
          background: #f5f5f5;
          font-size: 20px;
          cursor: pointer;
        }
        quantity-selector button:hover {
          background: #000;
          color: #fff;
        }
        quantity-selector input {
          width: 50px;
          height: 38px;
          text-align: center;
          border: 1px solid #ccc;
          border-left: none;
          border-right: none;
          font-size: 16px;
        }
      </style>
      <button class="minus">−</button>
      <input type="number" value="1" min="1">
      <button class="plus">+</button>
    `

    this.querySelector('.minus').addEventListener('click', () => this.update(-1))
    this.querySelector('.plus').addEventListener('click', () => this.update(1))
  }

  update(change) {
    const input = this.querySelector('input')
    const newVal = parseInt(input.value) + change
    if (newVal >= 1) {
      input.value = newVal

      // Cart update karo fetch se
      this.updateCart(newVal)
    }
  }

  updateCart(quantity) {
    const variantId = this.dataset.variantId // product page se lenge

    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    })
    .then(res => res.json())
    .then(cart => {
      console.log('Cart updated!', cart)
      // Cart count update karo
      document.querySelector('.cart-count').textContent = cart.item_count
    })
  }
}

customElements.define('quantity-selector', QuantitySelector)