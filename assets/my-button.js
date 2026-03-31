class MyButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        my-button button {
          background: #000;
          color: #fff;
          padding: 12px 28px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }
        my-button button:hover {
          background: #333;
        }
      </style>
      <button>Click Me</button>
    `

    this.querySelector('button').addEventListener('click', () => {
      alert('Web Component to work ! 🎉')
    })
  }
}
customElements.define('my-button', MyButton)