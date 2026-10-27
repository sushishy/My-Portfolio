/* 
================================================================================
                        INTRO CONTROLLER - OOP ANIMATION ENGINE
================================================================================
*/

import { animate, stagger, createTimeline } from './vendor/anime.esm.min.js';

export class IntroController {
  constructor() {
    this.headline = document.querySelector('.hero-headline');
    this.mockupCard = document.querySelector('.mockup-card-3d');
    this.mockupStage = document.querySelector('.mockup-stage');
    this.timeline = null;
  }

  init() {
    if (!this.headline) return;
    this.prepareTextSplits();
    this.playEntranceSequence();
    this.bindParallaxInteractions();
  }

  prepareTextSplits() {
    const rawText = this.headline.textContent.trim();
    this.headline.innerHTML = '';

    const words = rawText.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      word.split('').forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.classList.add('letter');
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      });

      this.headline.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        const space = document.createTextNode('\u00A0');
        this.headline.appendChild(space);
      }
    });
  }

  playEntranceSequence() {
    this.timeline = createTimeline({
      defaults: {
        ease: 'outExpo',
        duration: 900
      }
    });

    this.timeline
      .add('.intro-nav', {
        opacity: [0, 1],
        y: [-15, 0],
        duration: 800
      })
      .add('.hero-subtitle-tag', {
        opacity: [0, 1],
        x: [-20, 0],
        duration: 600
      }, '-=400')
      .add('.hero-headline .letter', {
        opacity: [0, 1],
        y: [35, 0],
        delay: stagger(30),
        duration: 800,
        ease: 'outQuart'
      }, '-=300')
      .add('.hero-description', {
        opacity: [0, 1],
        y: [20, 0],
        duration: 700
      }, '-=400')
      .add('.hero-cta-group', {
        opacity: [0, 1],
        y: [20, 0],
        duration: 600
      }, '-=400')
      .add('.mockup-card-3d', {
        opacity: [0, 1],
        scale: [0.92, 1],
        rotateY: [-15, 0],
        rotateX: [10, 0],
        duration: 1100,
        ease: 'outElastic(1, .8)'
      }, '-=600')
      .add('.intro-footer', {
        opacity: [0, 1],
        duration: 800
      }, '-=400');
  }

  bindParallaxInteractions() {
    if (!this.mockupStage || !this.mockupCard) return;

    const handleMouseMove = (event) => {
      const rect = this.mockupStage.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      const rotateY = (x / (rect.width / 2)) * 14;
      const rotateX = -(y / (rect.height / 2)) * 14;

      animate(this.mockupCard, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 400,
        ease: 'outQuad'
      });
    };

    const handleMouseLeave = () => {
      animate(this.mockupCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 800,
        ease: 'outElastic(1, .6)'
      });
    };

    this.mockupStage.addEventListener('mousemove', handleMouseMove);
    this.mockupStage.addEventListener('mouseleave', handleMouseLeave);
  }
}
