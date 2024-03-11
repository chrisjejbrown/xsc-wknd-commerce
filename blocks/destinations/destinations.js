import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const link = block.querySelector('a');
  const divElements = block.querySelectorAll('div');
  let country = '';
  let data = [];

  divElements.forEach((divElement, index) => {
    if (divElement.textContent.trim().toLowerCase() === 'country') {
      if (divElements[index + 1]) {
        country = divElements[index + 1].textContent.trim();
      } else {
        console.log('No country value found.');
      }
    }
  });

  function modifyHTML() {
    block.innerHTML = '';

    data.forEach((item) => {
      const createdCard = document.createElement('div');
      createdCard.classList.add('wide-card');
      createdCard.innerHTML = `
        <div class="card-image">
          <picture>
            <img loading="lazy" alt="" src="${item.image}" width="100" height="100">
          </picture>
        </div>
        <div class="card-info">
          <h2>${item.name}</h2>
          <p>${item.description}</p>
          <p class="button-container"><a href="${item.cta}" title="View trips" class="custom-link">View trips</a></p>
        </div>
      `;
      createdCard.querySelectorAll('img').forEach((img) => {
        img.closest('picture').replaceWith(
          createOptimizedPicture(img.src, img.alt, true, [{ width: '750' }]),
        );
      });
      block.append(createdCard);
    });
  }

  async function initialize() {
    const response = await fetch(link?.href);

    if (response.ok) {
      const jsonData = await response.json();
      data = jsonData?.data;

      if (country) {
        const countries = jsonData?.raw.data;
        const foundCountry = countries.find((obj) => obj.name === country);
        data = [foundCountry];
        modifyHTML();
      } else {
        data = jsonData?.data;
        modifyHTML();
      }
    }
  }

  initialize();
}
