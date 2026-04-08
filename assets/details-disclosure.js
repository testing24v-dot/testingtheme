class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach(animation => animation.play());
    } else {
      this.animations.forEach(animation => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.closeTimer = null;
    
    this.mainDetailsToggle.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.mainDetailsToggle.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    
    // Add listeners to the content div for mega-menus
    const contentDiv = this.mainDetailsToggle.querySelector('.mega-menu__content');
    if (contentDiv) {
      contentDiv.addEventListener('mouseover', this.onContentMouseOver.bind(this));
      contentDiv.addEventListener('mouseleave', this.onContentMouseLeave.bind(this));
    }
  }

  onMouseOver() {
    if (window.innerWidth < 990) return;
    clearTimeout(this.closeTimer);
    this.mainDetailsToggle.open = true;
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', true);
  }

  onMouseLeave() {
    if (window.innerWidth < 990) return;
    // Add a small delay to prevent closing when moving from summary to content
    this.closeTimer = setTimeout(() => {
      this.mainDetailsToggle.open = false;
      this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
    }, 150);
  }

  onContentMouseOver() {
    if (window.innerWidth < 990) return;
    clearTimeout(this.closeTimer);
    this.mainDetailsToggle.open = true;
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', true);
  }

  onContentMouseLeave() {
    if (window.innerWidth < 990) return;
    // Close menu when leaving the content area
    this.mainDetailsToggle.open = false;
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty('--header-bottom-position-desktop', `${Math.floor(this.header.getBoundingClientRect().bottom)}px`);
  }
}

customElements.define('header-menu', HeaderMenu);
