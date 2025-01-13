// script.js

window.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const gamePage = document.getElementById('game-page');
    const startBtn = document.getElementById('startBtn');
  
    const blueBoardGrid = document.getElementById('blueBoardGrid');
    const redBoardGrid = document.getElementById('redBoardGrid');
    const regenerateBtn = document.getElementById('regenerateBtn');
  
    // Start button => show game page, load 25 photos
    startBtn.addEventListener('click', () => {
      landingPage.style.display = 'none';
      gamePage.style.display = 'block';
      loadPhotos();
    });
  
    // Regenerate => fetch new random 25
    regenerateBtn.addEventListener('click', () => {
      loadPhotos();
    });
  
    async function loadPhotos() {
      try {
        const response = await fetch('/api/photos');
        if (!response.ok) throw new Error('Failed to fetch photos');
        const photoNames = await response.json();
  
        if (!Array.isArray(photoNames) || photoNames.length !== 25) {
          throw new Error('Expected 25 filenames in the response');
        }
  
        // Clear existing
        blueBoardGrid.innerHTML = '';
        redBoardGrid.innerHTML = '';
  
        // Populate both boards
        photoNames.forEach(filename => {
          const blueCard = createPhotoCard(filename);
          blueBoardGrid.appendChild(blueCard);
  
          const redCard = createPhotoCard(filename);
          redBoardGrid.appendChild(redCard);
        });
  
      } catch (error) {
        console.error('Error loading photos:', error);
      }
    }
  
    // Create a photo card with image, overlay, name
    function createPhotoCard(filename) {
      // Remove extension for display name
      const displayName = filename.replace(/\.[^/.]+$/, '');
  
      // Card container
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('photo-card');
  
      // Image container
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
  
      const img = document.createElement('img');
      img.src = `photos/${filename}`;
      img.alt = displayName;
  
      // X overlay
      const xOverlay = document.createElement('div');
      xOverlay.classList.add('x-overlay');
      xOverlay.textContent = 'X';
  
      // Toggle "x-out" on click
      imageContainer.addEventListener('click', () => {
        imageContainer.classList.toggle('x-out');
      });
  
      imageContainer.appendChild(img);
      imageContainer.appendChild(xOverlay);
  
      // Name
      const nameDiv = document.createElement('div');
      nameDiv.classList.add('photo-name');
      nameDiv.textContent = displayName;
  
      // Assemble
      cardDiv.appendChild(imageContainer);
      cardDiv.appendChild(nameDiv);
  
      return cardDiv;
    }
  });