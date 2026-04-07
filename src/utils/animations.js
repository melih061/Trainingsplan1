/**
 * Animation Utilities
 * Smooth animations and transitions for UI elements
 */

/**
 * Easing functions
 */
export const easing = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  spring: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  bounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

/**
 * Animate a value over time
 * @param {object} options - Animation options
 * @returns {Promise} Resolves when animation completes
 */
export function animate({
  from = 0,
  to = 1,
  duration = 300,
  ease = 'easeOutCubic',
  onUpdate,
  onComplete
}) {
  return new Promise(resolve => {
    const startTime = performance.now();
    const easeFn = typeof ease === 'function' ? ease : easing[ease] || easing.linear;

    function tick(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeFn(progress);
      const value = from + (to - from) * easedProgress;

      if (onUpdate) onUpdate(value, progress);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        if (onComplete) onComplete();
        resolve();
      }
    }

    requestAnimationFrame(tick);
  });
}

/**
 * Counter animation (number counting up/down)
 * @param {HTMLElement} element - Target element
 * @param {number} from - Start value
 * @param {number} to - End value
 * @param {object} options - Animation options
 */
export function animateCounter(element, from, to, {
  duration = 1000,
  ease = 'easeOutQuart',
  formatter = val => Math.round(val),
  suffix = ''
} = {}) {
  return animate({
    from,
    to,
    duration,
    ease,
    onUpdate: value => {
      element.textContent = formatter(value) + suffix;
    }
  });
}

/**
 * Progress bar animation
 * @param {HTMLElement} element - Progress bar fill element
 * @param {number} percentage - Target percentage (0-100)
 * @param {object} options - Animation options
 */
export function animateProgress(element, percentage, {
  duration = 800,
  ease = 'spring'
} = {}) {
  const currentWidth = parseFloat(element.style.width) || 0;
  return animate({
    from: currentWidth,
    to: percentage,
    duration,
    ease,
    onUpdate: value => {
      element.style.width = `${value}%`;
    }
  });
}

/**
 * Fade in element
 * @param {HTMLElement} element - Target element
 * @param {object} options - Animation options
 */
export function fadeIn(element, {
  duration = 300,
  ease = 'easeOutQuad',
  display = 'block'
} = {}) {
  element.style.opacity = '0';
  element.style.display = display;

  return animate({
    from: 0,
    to: 1,
    duration,
    ease,
    onUpdate: value => {
      element.style.opacity = value.toString();
    }
  });
}

/**
 * Fade out element
 * @param {HTMLElement} element - Target element
 * @param {object} options - Animation options
 */
export function fadeOut(element, {
  duration = 300,
  ease = 'easeOutQuad',
  hideAfter = true
} = {}) {
  return animate({
    from: 1,
    to: 0,
    duration,
    ease,
    onUpdate: value => {
      element.style.opacity = value.toString();
    },
    onComplete: () => {
      if (hideAfter) element.style.display = 'none';
    }
  });
}

/**
 * Slide down element
 * @param {HTMLElement} element - Target element
 * @param {object} options - Animation options
 */
export function slideDown(element, {
  duration = 300,
  ease = 'easeOutQuad'
} = {}) {
  element.style.overflow = 'hidden';
  element.style.height = 'auto';
  const targetHeight = element.offsetHeight;
  element.style.height = '0';
  element.style.opacity = '0';

  return animate({
    from: 0,
    to: 1,
    duration,
    ease,
    onUpdate: value => {
      element.style.height = `${targetHeight * value}px`;
      element.style.opacity = value.toString();
    },
    onComplete: () => {
      element.style.height = 'auto';
      element.style.overflow = '';
    }
  });
}

/**
 * Slide up element
 * @param {HTMLElement} element - Target element
 * @param {object} options - Animation options
 */
export function slideUp(element, {
  duration = 300,
  ease = 'easeOutQuad'
} = {}) {
  const startHeight = element.offsetHeight;
  element.style.overflow = 'hidden';

  return animate({
    from: 1,
    to: 0,
    duration,
    ease,
    onUpdate: value => {
      element.style.height = `${startHeight * value}px`;
      element.style.opacity = value.toString();
    },
    onComplete: () => {
      element.style.display = 'none';
      element.style.height = '';
      element.style.overflow = '';
    }
  });
}

/**
 * Shake animation (for error feedback)
 * @param {HTMLElement} element - Target element
 * @param {object} options - Animation options
 */
export function shake(element, {
  intensity = 10,
  duration = 400
} = {}) {
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: `translateX(-${intensity}px)` },
    { transform: `translateX(${intensity}px)` },
    { transform: `translateX(-${intensity}px)` },
    { transform: `translateX(${intensity}px)` },
    { transform: 'translateX(0)' }
  ];

  return element.animate(keyframes, {
    duration,
    easing: 'ease-out'
  }).finished;
}

/**
 * Pulse animation (for attention)
 * @param {HTMLElement} element - Target element
 * @param {object} options - Animation options
 */
export function pulse(element, {
  scale = 1.05,
  duration = 300
} = {}) {
  const keyframes = [
    { transform: 'scale(1)' },
    { transform: `scale(${scale})` },
    { transform: 'scale(1)' }
  ];

  return element.animate(keyframes, {
    duration,
    easing: 'ease-in-out'
  }).finished;
}

/**
 * Stagger children animations
 * @param {HTMLElement} parent - Parent element
 * @param {string} selector - Child selector
 * @param {object} options - Animation options
 */
export function staggerIn(parent, selector, {
  delay = 50,
  duration = 300,
  ease = 'easeOutQuad'
} = {}) {
  const children = parent.querySelectorAll(selector);

  return Promise.all(
    Array.from(children).map((child, index) => {
      return new Promise(resolve => {
        setTimeout(() => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(20px)';

          animate({
            from: 0,
            to: 1,
            duration,
            ease,
            onUpdate: value => {
              child.style.opacity = value.toString();
              child.style.transform = `translateY(${20 * (1 - value)}px)`;
            },
            onComplete: resolve
          });
        }, index * delay);
      });
    })
  );
}

/**
 * Create particle burst effect
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {object} options - Effect options
 */
export function particleBurst(x, y, {
  count = 12,
  colors = ['#C4956A', '#DBA97A', '#5C7A5C', '#78A078'],
  duration = 800
} = {}) {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const angle = (i / count) * Math.PI * 2;
    const velocity = 50 + Math.random() * 50;
    const size = 4 + Math.random() * 4;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
    `;

    container.appendChild(particle);

    const targetX = Math.cos(angle) * velocity;
    const targetY = Math.sin(angle) * velocity;

    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
    ], {
      duration,
      easing: 'cubic-bezier(0, 0.55, 0.45, 1)'
    });
  }

  setTimeout(() => container.remove(), duration);
}

export default {
  easing,
  animate,
  animateCounter,
  animateProgress,
  fadeIn,
  fadeOut,
  slideDown,
  slideUp,
  shake,
  pulse,
  staggerIn,
  particleBurst
};
