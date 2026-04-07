/**
 * Charts Service
 * SVG-based charts for progress visualization
 */

/**
 * Chart configuration defaults
 */
const CHART_CONFIG = {
  padding: { top: 20, right: 15, bottom: 30, left: 40 },
  colors: {
    primary: '#C4956A',
    secondary: '#5C7A5C',
    grid: 'rgba(255,255,255,0.05)',
    text: 'rgba(240,240,240,0.35)',
    axis: 'rgba(255,255,255,0.1)'
  },
  animation: {
    duration: 800,
    easing: 'ease-out'
  }
};

/**
 * Create SVG element with namespace
 * @param {string} tag - SVG element tag
 * @param {object} attrs - Element attributes
 * @returns {SVGElement} SVG element
 */
function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

/**
 * Line chart for progress tracking
 * @param {HTMLElement} container - Container element
 * @param {Array} data - Array of { date, value } objects
 * @param {object} options - Chart options
 */
export function lineChart(container, data, options = {}) {
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="chart-empty">Keine Daten vorhanden</div>';
    return;
  }

  const config = { ...CHART_CONFIG, ...options };
  const width = container.offsetWidth || 300;
  const height = options.height || 150;

  const chartWidth = width - config.padding.left - config.padding.right;
  const chartHeight = height - config.padding.top - config.padding.bottom;

  // Calculate scales
  const values = data.map(d => d.value);
  const minValue = Math.min(...values) * 0.95;
  const maxValue = Math.max(...values) * 1.05;
  const valueRange = maxValue - minValue || 1;

  const xScale = (index) => config.padding.left + (index / (data.length - 1 || 1)) * chartWidth;
  const yScale = (value) => config.padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Create SVG
  const svg = createSVGElement('svg', {
    width: '100%',
    height: height,
    viewBox: `0 0 ${width} ${height}`,
    class: 'chart-svg'
  });

  // Grid lines
  const gridGroup = createSVGElement('g', { class: 'chart-grid' });
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const y = config.padding.top + (i / gridLines) * chartHeight;
    const line = createSVGElement('line', {
      x1: config.padding.left,
      y1: y,
      x2: width - config.padding.right,
      y2: y,
      stroke: config.colors.grid,
      'stroke-width': 1
    });
    gridGroup.appendChild(line);

    // Y-axis labels
    const value = maxValue - (i / gridLines) * valueRange;
    const label = createSVGElement('text', {
      x: config.padding.left - 8,
      y: y + 4,
      fill: config.colors.text,
      'font-size': '9',
      'text-anchor': 'end',
      'font-family': 'JetBrains Mono, monospace'
    });
    label.textContent = Math.round(value);
    gridGroup.appendChild(label);
  }
  svg.appendChild(gridGroup);

  // Create gradient
  const defs = createSVGElement('defs');
  const gradient = createSVGElement('linearGradient', {
    id: 'lineGradient',
    x1: '0%', y1: '0%', x2: '0%', y2: '100%'
  });
  gradient.appendChild(createSVGElement('stop', {
    offset: '0%',
    'stop-color': config.colors.primary,
    'stop-opacity': '0.3'
  }));
  gradient.appendChild(createSVGElement('stop', {
    offset: '100%',
    'stop-color': config.colors.primary,
    'stop-opacity': '0'
  }));
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Area path
  const areaPoints = data.map((d, i) => `${xScale(i)},${yScale(d.value)}`).join(' ');
  const areaPath = createSVGElement('polygon', {
    points: `${config.padding.left},${config.padding.top + chartHeight} ${areaPoints} ${width - config.padding.right},${config.padding.top + chartHeight}`,
    fill: 'url(#lineGradient)'
  });
  svg.appendChild(areaPath);

  // Line path
  const linePoints = data.map((d, i) => `${xScale(i)},${yScale(d.value)}`).join(' ');
  const linePath = createSVGElement('polyline', {
    points: linePoints,
    fill: 'none',
    stroke: config.colors.primary,
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  });

  // Animate line
  const pathLength = linePath.getTotalLength?.() || chartWidth;
  linePath.style.strokeDasharray = pathLength;
  linePath.style.strokeDashoffset = pathLength;
  linePath.style.animation = `chartDraw ${config.animation.duration}ms ${config.animation.easing} forwards`;

  svg.appendChild(linePath);

  // Data points
  const dotsGroup = createSVGElement('g', { class: 'chart-dots' });
  data.forEach((d, i) => {
    const dot = createSVGElement('circle', {
      cx: xScale(i),
      cy: yScale(d.value),
      r: 4,
      fill: '#050505',
      stroke: config.colors.primary,
      'stroke-width': 2
    });
    dot.style.opacity = '0';
    dot.style.animation = `fadeIn 200ms ease-out ${config.animation.duration + i * 50}ms forwards`;
    dotsGroup.appendChild(dot);
  });
  svg.appendChild(dotsGroup);

  // X-axis labels (show first, middle, last)
  const xLabelsGroup = createSVGElement('g', { class: 'chart-x-labels' });
  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];
  labelIndices.forEach(i => {
    if (data[i]) {
      const label = createSVGElement('text', {
        x: xScale(i),
        y: height - 8,
        fill: config.colors.text,
        'font-size': '8',
        'text-anchor': 'middle',
        'font-family': 'JetBrains Mono, monospace'
      });
      label.textContent = formatDateShort(data[i].date);
      xLabelsGroup.appendChild(label);
    }
  });
  svg.appendChild(xLabelsGroup);

  // Add CSS animation
  if (!document.querySelector('#chart-animations')) {
    const style = document.createElement('style');
    style.id = 'chart-animations';
    style.textContent = `
      @keyframes chartDraw {
        to { stroke-dashoffset: 0; }
      }
      @keyframes fadeIn {
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  container.innerHTML = '';
  container.appendChild(svg);
}

/**
 * Bar chart for weekly overview
 * @param {HTMLElement} container - Container element
 * @param {Array} data - Array of { label, value, color, highlight } objects
 * @param {object} options - Chart options
 */
export function barChart(container, data, options = {}) {
  if (!data || data.length === 0) return;

  const config = { ...CHART_CONFIG, ...options };
  const width = container.offsetWidth || 300;
  const height = options.height || 80;
  const barGap = 5;
  const barWidth = (width - (data.length + 1) * barGap) / data.length;

  const maxValue = Math.max(...data.map(d => d.value)) || 1;

  const svg = createSVGElement('svg', {
    width: '100%',
    height: height,
    viewBox: `0 0 ${width} ${height}`,
    class: 'chart-svg bar-chart'
  });

  const barsGroup = createSVGElement('g', { class: 'chart-bars' });

  data.forEach((d, i) => {
    const barHeight = (d.value / maxValue) * (height - 20);
    const x = barGap + i * (barWidth + barGap);
    const y = height - 15 - barHeight;

    // Bar background
    const barBg = createSVGElement('rect', {
      x,
      y: 5,
      width: barWidth,
      height: height - 20,
      fill: 'rgba(255,255,255,0.02)',
      rx: 3
    });
    barsGroup.appendChild(barBg);

    // Bar fill
    const bar = createSVGElement('rect', {
      x,
      y: height - 15,
      width: barWidth,
      height: 0,
      fill: d.color || config.colors.primary,
      rx: 3
    });

    // Animate
    bar.style.transition = `all ${config.animation.duration}ms ${config.animation.easing}`;
    setTimeout(() => {
      bar.setAttribute('y', y);
      bar.setAttribute('height', barHeight);
    }, i * 50);

    barsGroup.appendChild(bar);

    // Label
    const label = createSVGElement('text', {
      x: x + barWidth / 2,
      y: height - 3,
      fill: d.highlight ? config.colors.primary : config.colors.text,
      'font-size': '8',
      'text-anchor': 'middle',
      'font-family': 'JetBrains Mono, monospace',
      'text-transform': 'uppercase'
    });
    label.textContent = d.label;
    barsGroup.appendChild(label);
  });

  svg.appendChild(barsGroup);
  container.innerHTML = '';
  container.appendChild(svg);
}

/**
 * Circular progress chart
 * @param {HTMLElement} container - Container element
 * @param {number} value - Progress value (0-100)
 * @param {object} options - Chart options
 */
export function circularProgress(container, value, options = {}) {
  const size = options.size || 100;
  const strokeWidth = options.strokeWidth || 8;
  const color = options.color || CHART_CONFIG.colors.primary;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const svg = createSVGElement('svg', {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    class: 'circular-progress'
  });

  // Background circle
  const bgCircle = createSVGElement('circle', {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: 'none',
    stroke: 'rgba(255,255,255,0.05)',
    'stroke-width': strokeWidth
  });
  svg.appendChild(bgCircle);

  // Progress circle
  const progressCircle = createSVGElement('circle', {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: 'none',
    stroke: color,
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-dasharray': circumference,
    'stroke-dashoffset': circumference,
    transform: `rotate(-90 ${size / 2} ${size / 2})`
  });

  // Animate
  progressCircle.style.transition = `stroke-dashoffset ${CHART_CONFIG.animation.duration}ms ${CHART_CONFIG.animation.easing}`;
  setTimeout(() => {
    progressCircle.setAttribute('stroke-dashoffset', offset);
  }, 50);

  svg.appendChild(progressCircle);

  // Center text
  if (options.showValue !== false) {
    const text = createSVGElement('text', {
      x: size / 2,
      y: size / 2 + 5,
      fill: '#F0F0F0',
      'font-size': options.fontSize || '20',
      'font-weight': '600',
      'text-anchor': 'middle',
      'font-family': 'Anton, sans-serif'
    });
    text.textContent = `${Math.round(value)}%`;
    svg.appendChild(text);
  }

  container.innerHTML = '';
  container.appendChild(svg);
}

/**
 * Mini sparkline chart
 * @param {HTMLElement} container - Container element
 * @param {Array} values - Array of numbers
 * @param {object} options - Chart options
 */
export function sparkline(container, values, options = {}) {
  if (!values || values.length < 2) return;

  const width = options.width || container.offsetWidth || 80;
  const height = options.height || 30;
  const color = options.color || CHART_CONFIG.colors.primary;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const xScale = (i) => (i / (values.length - 1)) * width;
  const yScale = (v) => height - ((v - min) / range) * (height - 4) - 2;

  const points = values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');

  const svg = createSVGElement('svg', {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    class: 'sparkline'
  });

  const line = createSVGElement('polyline', {
    points,
    fill: 'none',
    stroke: color,
    'stroke-width': 1.5,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  });
  svg.appendChild(line);

  // End dot
  const lastX = xScale(values.length - 1);
  const lastY = yScale(values[values.length - 1]);
  const dot = createSVGElement('circle', {
    cx: lastX,
    cy: lastY,
    r: 2.5,
    fill: color
  });
  svg.appendChild(dot);

  container.innerHTML = '';
  container.appendChild(svg);
}

/**
 * Format date for chart labels
 * @param {string} dateStr - Date string
 * @returns {string} Formatted date
 */
function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  return `${date.getDate()}.${date.getMonth() + 1}`;
}

export default {
  lineChart,
  barChart,
  circularProgress,
  sparkline
};
