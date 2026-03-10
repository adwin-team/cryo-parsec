import { createIcons, Globe, ArrowRight } from 'lucide-static';
import gsap from 'gsap';

// --- Configuration ---
const GNEWS_API_KEY = '5f89eb8a5d33f268b8156108139cd35e'; // Pre-obtained or dummy key for demo
const BASE_URL = 'https://gnews.io/api/v4/top-headlines';

interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

let currentCountry = 'jp';
let currentLang = 'ja';

// --- DOM Elements ---
const newsGrid = document.getElementById('news-grid') as HTMLElement;
const regionDisplay = document.querySelector('.current-region') as HTMLElement;
const lastUpdated = document.getElementById('last-updated') as HTMLElement;
const countryBtns = document.querySelectorAll('.country-btn');

// --- Functions ---

function init() {
  createIcons({
    icons: {
      Globe,
      ArrowRight
    }
  });
  
  fetchNews(currentCountry, currentLang);
  
  countryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const country = target.dataset.country || 'jp';
      const lang = target.dataset.lang || 'ja';
      
      if (country === currentCountry) return;
      
      // Update UI state
      countryBtns.forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      
      currentCountry = country;
      currentLang = lang;
      
      const regionName = target.textContent || 'Japan';
      regionDisplay.textContent = `${regionName} - Latest Headlines`;
      
      fetchNews(currentCountry, currentLang);
    });
  });
}

async function fetchNews(country: string, lang: string) {
  // Show skeletons
  renderSkeletons();
  
  try {
    const url = `${BASE_URL}?category=general&lang=${lang}&country=${country}&max=10&apikey=${GNEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.articles) {
      renderArticles(data.articles);
      updateTimestamp();
    } else {
      console.error('No articles found:', data);
      newsGrid.innerHTML = `<p class="error">Failed to load news. Please try again later.</p>`;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    newsGrid.innerHTML = `<p class="error">Network error. Check your connection.</p>`;
  }
}

function renderSkeletons() {
  newsGrid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    newsGrid.appendChild(skeleton);
  }
}

function renderArticles(articles: NewsArticle[]) {
  newsGrid.innerHTML = '';
  
  articles.forEach((article, index) => {
    const date = new Date(article.publishedAt).toLocaleString();
    const card = document.createElement('div');
    card.className = 'news-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${article.image || 'https://via.placeholder.com/800x450/1e293b/94a3b8?text=No+Image'}" alt="${article.title}" loading="lazy">
      </div>
      <div class="card-content">
        <span class="card-source">${article.source.name}</span>
        <h3 class="card-title">${article.title}</h3>
        <p class="card-desc">${article.description || 'No description available.'}</p>
        <div class="card-footer">
          <span class="card-time">${date}</span>
          <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">
            Read Full <i data-lucide="arrow-right" size="16"></i>
          </a>
        </div>
      </div>
    `;
    
    newsGrid.appendChild(card);
    
    // Fade in animation
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });
  
  // Re-run Lucide for new icons
  createIcons({
    icons: {
      ArrowRight
    }
  });
}

function updateTimestamp() {
  const now = new Date().toLocaleTimeString();
  lastUpdated.textContent = `Last updated: ${now}`;
}

// Start the app
init();
