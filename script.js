"use strict";

// Sticky Navbar logic
let prevScrollpos = window.scrollY;
window.onscroll = function () {
  let currentScrollPos = window.scrollY;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-500px";
  }
  prevScrollpos = currentScrollPos;
};

// Menu rendering functions
async function fetchMenuData() {
  try {
    console.log('Fetching menu data...');
    const baseUrl = window.location.hostname === 'localhost' ? 
      'http://localhost:8888' : '';
    
    const response = await fetch(`${baseUrl}/.netlify/functions/getMenu`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    console.log('Menu data received:', categories);
    displayMenu(categories);
  } catch (error) {
    console.error('Error fetching menu:', error);
    displayError();
  }
}

function displayMenu(categories) {
  const categoryContainers = {
    'Gustose': {
      container: document.getElementById('gustose-container'),
      title: 'Gustose'
    },
    'Bianche': {
      container: document.getElementById('bianche-container'),
      title: 'Bianche'
    },
    'Al Metro': {
      container: document.getElementById('almetro-container'),
      title: 'Al Metro'
    }
  };

  // Clear and initialize containers
  Object.entries(categoryContainers).forEach(([name, config]) => {
    const { container, title } = config;
    if (!container) return;

    // Clear container
    container.innerHTML = `
      <ul id="${name.toLowerCase().replace(' ', '')}" class="title-menu margin-bottom">
        ${title}
      </ul>
    `;

    // Add items if they exist
    if (categories[name]) {
      categories[name].forEach(item => {
        const li = document.createElement('li');
        li.className = 'pizza-name';
        li.innerHTML = `
          ${item.name}
          <p class="ingridients">${item.description || ''}</p>
          <p class="price">${item.price ? `€${item.price}` : ''}</p>
        `;
        container.appendChild(li);
      });
    }
  });
}

function displayError() {
  const menuSection = document.querySelector('.menu-section');
  menuSection.innerHTML = `
    <div class="error-message">
      <p>Siamo spiacenti, il menu non è al momento disponibile. Riprova più tardi.</p>
    </div>
  `;
}

// Initialize menu when page loads
document.addEventListener('DOMContentLoaded', fetchMenuData);