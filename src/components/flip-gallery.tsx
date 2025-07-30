'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  { title: 'Joshua Hibbert', url: 'https://picsum.photos/id/870/600/1000' },
  { title: 'Joshua Earle', url: 'https://picsum.photos/id/883/600/1000' },
  { title: 'Antoine Beauvillain', url: 'https://picsum.photos/id/478/600/1000' },
  { title: 'Greg Rakozy', url: 'https://picsum.photos/id/903/600/1000' },
  { title: 'Ramiro Checchi', url: 'https://picsum.photos/id/503/600/1000' }
];

const FLIP_SPEED = 400; // Réduit de 750ms à 400ms pour une animation plus rapide
const flipTiming = { duration: FLIP_SPEED, iterations: 1, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' };

// flip down
const flipAnimationTop = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' }
];
const flipAnimationBottom = [
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(0)' }
];

// flip up
const flipAnimationTopReverse = [
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(0)' }
];
const flipAnimationBottomReverse = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' }
];

export default function FlipGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniteRef = useRef<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // initialise first image once and preload all images
  useEffect(() => {
    if (!containerRef.current) return;
    uniteRef.current = Array.from(containerRef.current.querySelectorAll('.unite'));
    defineFirstImg();
    
    // Précharger toutes les images pour éviter le lag
    images.forEach((img) => {
      const preloadImg = new Image();
      preloadImg.src = img.url;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defineFirstImg = () => {
    uniteRef.current.forEach(setActiveImage);
    setImageTitle();
  };

  const setActiveImage = (el: HTMLElement) => {
    el.style.backgroundImage = `url('${images[currentIndex].url}')`;
  };

  const setImageTitle = () => {
    const gallery = containerRef.current;
    if (!gallery) return;
    gallery.setAttribute('data-title', images[currentIndex].title);
    gallery.style.setProperty('--title-y', '0');
    gallery.style.setProperty('--title-opacity', '1');
  };

  const updateGallery = async (nextIndex: number, isReverse = false) => {
    const gallery = containerRef.current;
    if (!gallery || isAnimating) return;
    
    setIsAnimating(true);

    // Précharger l'image suivante AVANT de lancer l'animation
    const nextImage = new Image();
    nextImage.src = images[nextIndex].url;
    
    // Attendre que l'image soit chargée
    await new Promise((resolve) => {
      if (nextImage.complete) {
        resolve(true);
      } else {
        nextImage.onload = () => resolve(true);
      }
    });

    // Mettre à jour les overlay avec la nouvelle image AVANT l'animation
    const overlayTop = gallery.querySelector('.overlay-top') as HTMLElement;
    const overlayBottom = gallery.querySelector('.overlay-bottom') as HTMLElement;
    if (overlayTop && overlayBottom) {
      overlayTop.style.backgroundImage = `url('${images[nextIndex].url}')`;
      overlayBottom.style.backgroundImage = `url('${images[nextIndex].url}')`;
    }

    // determine direction animation arrays
    const topAnim = isReverse ? flipAnimationTopReverse : flipAnimationTop;
    const bottomAnim = isReverse
      ? flipAnimationBottomReverse
      : flipAnimationBottom;

    // Lancer l'animation
    overlayTop?.animate(topAnim, flipTiming);
    overlayBottom?.animate(bottomAnim, flipTiming);

    // hide title
    gallery.style.setProperty('--title-y', '-1rem');
    gallery.style.setProperty('--title-opacity', '0');
    gallery.setAttribute('data-title', '');

    // Mettre à jour les éléments de base immédiatement après le début de l'animation
    setTimeout(() => {
      const topEl = gallery.querySelector('.top') as HTMLElement;
      const bottomEl = gallery.querySelector('.bottom') as HTMLElement;
      if (topEl && bottomEl) {
        topEl.style.backgroundImage = `url('${images[nextIndex].url}')`;
        bottomEl.style.backgroundImage = `url('${images[nextIndex].url}')`;
      }
    }, FLIP_SPEED / 2);

    // reveal new title roughly half‑way through animation
    setTimeout(() => {
      const gallery = containerRef.current;
      if (!gallery) return;
      gallery.setAttribute('data-title', images[nextIndex].title);
      gallery.style.setProperty('--title-y', '0');
      gallery.style.setProperty('--title-opacity', '1');
    }, FLIP_SPEED * 0.5);
    
    // Réactiver les boutons après l'animation
    setTimeout(() => {
      setIsAnimating(false);
    }, FLIP_SPEED);
  };

  const updateIndex = (increment: number) => {
    const inc = Number(increment);
    const newIndex = (currentIndex + inc + images.length) % images.length;
    const isReverse = inc < 0;
    setCurrentIndex(newIndex);
    updateGallery(newIndex, isReverse);
  };

  return (
    <div className='h-full w-full flex items-center justify-center bg-gray-900 font-sans'>
      <div
        className='relative bg-white/10 border border-white/25 p-2'
        style={{ '--gallery-bg-color': 'rgba(255 255 255 / 0.075)' } as React.CSSProperties}
      >
        {/* flip gallery */}
        <div
          id='flip-gallery'
          ref={containerRef}
          className='relative w-[240px] h-[400px] md:w-[300px] md:h-[500px] text-center'
          style={{ perspective: '800px' }}
        >
          <div className='top unite bg-cover bg-no-repeat'></div>
          <div className='bottom unite bg-cover bg-no-repeat'></div>
          <div className='overlay-top unite bg-cover bg-no-repeat'></div>
          <div className='overlay-bottom unite bg-cover bg-no-repeat'></div>
        </div>

        {/* navigation */}
        <div className='absolute top-full right-0 mt-2 flex gap-2'>
          <button
            type='button'
            onClick={() => updateIndex(-1)}
            title='Previous'
            disabled={isAnimating}
            className={`text-white transition ${isAnimating ? 'opacity-30 cursor-not-allowed' : 'opacity-75 hover:opacity-100 hover:scale-125'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type='button'
            onClick={() => updateIndex(1)}
            title='Next'
            disabled={isAnimating}
            className={`text-white transition ${isAnimating ? 'opacity-30 cursor-not-allowed' : 'opacity-75 hover:opacity-100 hover:scale-125'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* component-scoped styles that Tailwind cannot express */}
      <style>{`
        #flip-gallery::after {
          content: '';
          position: absolute;
          background-color: black;
          width: 100%;
          height: 4px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }

        #flip-gallery::before {
          content: attr(data-title);
          color: rgba(255 255 255 / 0.75);
          font-size: 0.75rem;
          left: -0.5rem;
          position: absolute;
          top: calc(100% + 1rem);
          line-height: 2;
          opacity: var(--title-opacity, 0);
          transform: translateY(var(--title-y, 0));
          transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
        }

        #flip-gallery > * {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          background-size: 240px 400px;
          backface-visibility: hidden;
          transform: translateZ(0);
          will-change: transform;
        }

        @media (min-width: 600px) {
          #flip-gallery > * {
            background-size: 300px 500px;
          }
        }

        .top,
        .overlay-top {
          top: 0;
          transform-origin: bottom;
          background-position: top;
        }

        .bottom,
        .overlay-bottom {
          bottom: 0;
          transform-origin: top;
          background-position: bottom;
        }
      `}</style>
    </div>
  );
}