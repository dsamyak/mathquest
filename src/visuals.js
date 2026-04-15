/* ============================================
   MathQuest — Visual Aids Generator
   Generates rich SVG/HTML visual illustrations
   to accompany math questions for better
   student comprehension.
   ============================================ */

// Color palette for visuals
const V_COLORS = {
  primary: '#7c3aed',
  primaryLight: '#a78bfa',
  secondary: '#06b6d4',
  secondaryLight: '#67e8f9',
  success: '#10b981',
  successLight: '#6ee7b7',
  warning: '#f59e0b',
  warningLight: '#fcd34d',
  danger: '#ef4444',
  dangerLight: '#fca5a5',
  pink: '#ec4899',
  pinkLight: '#f9a8d4',
  orange: '#f97316',
  blue: '#3b82f6',
  blueLight: '#93c5fd',
  indigo: '#6366f1',
  teal: '#14b8a6',
  textDark: '#1e293b',
  textMuted: '#94a3b8',
  bgDark: 'rgba(15, 23, 42, 0.6)',
  bgLight: 'rgba(255, 255, 255, 0.08)',
  gridLine: 'rgba(148, 163, 184, 0.25)',
  filledDot: '#7c3aed',
  emptyDot: 'rgba(148, 163, 184, 0.2)',
};

const MULTI_COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#f97316', '#6366f1'];

/**
 * Main entry: generate visual HTML based on visual descriptor
 * @param {{ type: string, params: object }} visual
 * @returns {string} HTML string
 */
export function generateVisual(visual) {
  if (!visual || !visual.type) return '';
  const fn = VISUAL_GENERATORS[visual.type];
  if (!fn) return '';
  try {
    return `<div class="visual-container visual-${visual.type}">${fn(visual.params || {})}</div>`;
  } catch (e) {
    console.warn('Visual generation failed:', visual.type, e);
    return '';
  }
}

/* ====================================================================
   VISUAL GENERATORS
   ==================================================================== */

const VISUAL_GENERATORS = {

  /* ──────────────────────────────────────────
     NUMBER LINE
     Shows a line with ticks, optional highlight
     and hop arrows for addition/subtraction
     ────────────────────────────────────────── */
  number_line({ min = 0, max = 20, highlight = [], hops = [], label = '' }) {
    const w = 500, h = 90, pad = 40;
    const lineY = 50;
    const range = max - min;
    const step = (w - pad * 2) / range;

    // Determine tick interval for readability
    let tickInterval = 1;
    if (range > 40) tickInterval = 10;
    else if (range > 20) tickInterval = 5;
    else if (range > 10) tickInterval = 2;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-number-line-svg">`;

    // Main line
    svg += `<line x1="${pad - 10}" y1="${lineY}" x2="${w - pad + 10}" y2="${lineY}" stroke="${V_COLORS.textMuted}" stroke-width="2" stroke-linecap="round"/>`;

    // Arrow ends
    svg += `<polygon points="${w - pad + 10},${lineY} ${w - pad + 3},${lineY - 5} ${w - pad + 3},${lineY + 5}" fill="${V_COLORS.textMuted}"/>`;

    // Ticks & labels
    for (let i = min; i <= max; i++) {
      const x = pad + (i - min) * step;
      const isMajor = i % tickInterval === 0;
      const isHighlighted = highlight.includes(i);
      const tickH = isMajor ? 12 : 6;
      const color = isHighlighted ? V_COLORS.primary : V_COLORS.textMuted;
      const strokeW = isHighlighted ? 3 : 1.5;

      svg += `<line x1="${x}" y1="${lineY - tickH}" x2="${x}" y2="${lineY + tickH}" stroke="${color}" stroke-width="${strokeW}"/>`;

      if (isMajor || isHighlighted) {
        svg += `<text x="${x}" y="${lineY + 28}" text-anchor="middle" fill="${isHighlighted ? V_COLORS.primary : '#cbd5e1'}" font-size="${isHighlighted ? 13 : 11}" font-weight="${isHighlighted ? 700 : 400}" font-family="Inter, sans-serif">${i}</text>`;
      }

      // Highlight dot
      if (isHighlighted) {
        svg += `<circle cx="${x}" cy="${lineY}" r="5" fill="${V_COLORS.primary}" opacity="0.9">
          <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite"/>
        </circle>`;
      }
    }

    // Hop arrows (for showing addition/subtraction steps)
    hops.forEach((hop, idx) => {
      const x1 = pad + (hop.from - min) * step;
      const x2 = pad + (hop.to - min) * step;
      const arcY = lineY - 25 - idx * 12;
      const color = hop.color || MULTI_COLORS[idx % MULTI_COLORS.length];
      const midX = (x1 + x2) / 2;

      svg += `<path d="M ${x1} ${lineY - 6} Q ${midX} ${arcY} ${x2} ${lineY - 6}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-${idx})"/>`;
      svg += `<defs><marker id="arrow-${idx}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${color}"/></marker></defs>`;

      if (hop.label) {
        svg += `<text x="${midX}" y="${arcY - 3}" text-anchor="middle" fill="${color}" font-size="10" font-weight="600" font-family="Inter, sans-serif">${hop.label}</text>`;
      }
    });

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     TEN FRAME
     Two 5-cell grids showing filled/empty dots
     ────────────────────────────────────────── */
  ten_frame({ count = 0, total = 20 }) {
    const framesNeeded = Math.ceil(total / 10);
    let html = `<div class="visual-ten-frame-wrap">`;

    for (let f = 0; f < framesNeeded; f++) {
      html += `<div class="ten-frame-grid">`;
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 5; c++) {
          const idx = f * 10 + r * 5 + c;
          const filled = idx < count;
          html += `<div class="ten-frame-cell ${filled ? 'filled' : 'empty'}">
            <div class="ten-frame-dot ${filled ? 'filled' : ''}"></div>
          </div>`;
        }
      }
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  },

  /* ──────────────────────────────────────────
     BASE-10 BLOCKS
     Hundreds flats, tens rods, ones cubes
     ────────────────────────────────────────── */
  base10_blocks({ hundreds = 0, tens = 0, ones = 0 }) {
    let html = `<div class="visual-base10-wrap">`;

    if (hundreds > 0) {
      html += `<div class="base10-group"><div class="base10-label">Hundreds</div><div class="base10-items">`;
      for (let i = 0; i < Math.min(hundreds, 9); i++) {
        html += `<div class="base10-flat" title="100">
          <svg viewBox="0 0 40 40" width="40" height="40">
            ${Array.from({ length: 100 }, (_, j) => {
              const x = (j % 10) * 4;
              const y = Math.floor(j / 10) * 4;
              return `<rect x="${x}" y="${y}" width="3.5" height="3.5" rx="0.5" fill="${V_COLORS.primary}" opacity="0.85"/>`;
            }).join('')}
          </svg>
        </div>`;
      }
      html += `</div></div>`;
    }

    if (tens > 0) {
      html += `<div class="base10-group"><div class="base10-label">Tens</div><div class="base10-items">`;
      for (let i = 0; i < Math.min(tens, 9); i++) {
        html += `<div class="base10-rod" title="10">
          <svg viewBox="0 0 8 40" width="8" height="40">
            ${Array.from({ length: 10 }, (_, j) => `<rect x="0" y="${j * 4}" width="7" height="3.5" rx="0.5" fill="${V_COLORS.secondary}" opacity="0.85"/>`).join('')}
          </svg>
        </div>`;
      }
      html += `</div></div>`;
    }

    if (ones > 0) {
      html += `<div class="base10-group"><div class="base10-label">Ones</div><div class="base10-items">`;
      for (let i = 0; i < Math.min(ones, 9); i++) {
        html += `<div class="base10-cube" title="1">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <rect x="1" y="1" width="10" height="10" rx="2" fill="${V_COLORS.success}" opacity="0.85"/>
          </svg>
        </div>`;
      }
      html += `</div></div>`;
    }

    html += `</div>`;
    return html;
  },

  /* ──────────────────────────────────────────
     ARRAY DOTS
     Rows × Columns dot grid for multiplication
     ────────────────────────────────────────── */
  array_dots({ rows = 3, cols = 4, groupBy = 'row', label = '' }) {
    const dotR = 8, gap = 28;
    const w = cols * gap + 30, h = rows * gap + 40;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-array-svg">`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 20 + c * gap;
        const y = 20 + r * gap;
        const color = groupBy === 'row' ? MULTI_COLORS[r % MULTI_COLORS.length] : MULTI_COLORS[c % MULTI_COLORS.length];

        svg += `<circle cx="${x}" cy="${y}" r="${dotR}" fill="${color}" opacity="0.85">
          <animate attributeName="opacity" values="0;0.85" dur="0.3s" begin="${(r * cols + c) * 0.03}s" fill="freeze"/>
        </circle>`;
      }

      // Row grouping bracket
      if (groupBy === 'row') {
        const bx = 20 + cols * gap + 4;
        svg += `<text x="${bx}" y="${20 + r * gap + 4}" fill="${V_COLORS.textMuted}" font-size="11" font-family="Inter, sans-serif">${cols}</text>`;
      }
    }

    // Column count label
    if (rows > 0 && cols > 0) {
      svg += `<text x="${w / 2}" y="${h - 2}" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="11" font-family="Inter, sans-serif">${rows} × ${cols} = ${rows * cols}</text>`;
    }

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     CLOCK FACE
     Analog clock with hour & minute hands
     ────────────────────────────────────────── */
  clock({ hour = 12, minute = 0 }) {
    const size = 160, cx = size / 2, cy = size / 2, r = 65;

    // Angles (12 o'clock is -90deg in math coords)
    const minAngle = (minute / 60) * 360 - 90;
    const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30 - 90;

    const minRad = minAngle * Math.PI / 180;
    const hourRad = hourAngle * Math.PI / 180;

    const minLen = r * 0.78;
    const hourLen = r * 0.55;

    const minX = cx + Math.cos(minRad) * minLen;
    const minY = cy + Math.sin(minRad) * minLen;
    const hourX = cx + Math.cos(hourRad) * hourLen;
    const hourY = cy + Math.sin(hourRad) * hourLen;

    let svg = `<svg viewBox="0 0 ${size} ${size}" class="visual-svg visual-clock-svg">`;

    // Clock face circle
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(15,23,42,0.5)" stroke="${V_COLORS.primaryLight}" stroke-width="3"/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="none" stroke="rgba(124,58,237,0.15)" stroke-width="1"/>`;

    // Hour marks + numbers
    for (let i = 1; i <= 12; i++) {
      const angle = (i / 12) * 360 - 90;
      const rad = angle * Math.PI / 180;

      // Tick mark
      const tickOuter = r - 6;
      const tickInner = i % 3 === 0 ? r - 16 : r - 12;
      const tx1 = cx + Math.cos(rad) * tickInner;
      const ty1 = cy + Math.sin(rad) * tickInner;
      const tx2 = cx + Math.cos(rad) * tickOuter;
      const ty2 = cy + Math.sin(rad) * tickOuter;
      svg += `<line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="${V_COLORS.textMuted}" stroke-width="${i % 3 === 0 ? 2.5 : 1.5}" stroke-linecap="round"/>`;

      // Number
      const numR = r - 22;
      const nx = cx + Math.cos(rad) * numR;
      const ny = cy + Math.sin(rad) * numR;
      svg += `<text x="${nx}" y="${ny}" text-anchor="middle" dominant-baseline="central" fill="#e2e8f0" font-size="${i % 3 === 0 ? 13 : 10}" font-weight="${i % 3 === 0 ? 700 : 400}" font-family="Outfit, sans-serif">${i}</text>`;
    }

    // Minute hand
    svg += `<line x1="${cx}" y1="${cy}" x2="${minX}" y2="${minY}" stroke="${V_COLORS.secondary}" stroke-width="2.5" stroke-linecap="round"/>`;

    // Hour hand
    svg += `<line x1="${cx}" y1="${cy}" x2="${hourX}" y2="${hourY}" stroke="${V_COLORS.primary}" stroke-width="4" stroke-linecap="round"/>`;

    // Center dot
    svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="${V_COLORS.primary}"/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="#e2e8f0"/>`;

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     SHAPE CANVAS
     Renders 2D/3D shape SVGs
     ────────────────────────────────────────── */
  shape({ name = 'circle', showLabels = true }) {
    const size = 150, cx = size / 2, cy = size / 2;
    let svg = `<svg viewBox="0 0 ${size} ${size}" class="visual-svg visual-shape-svg">`;

    const stroke = V_COLORS.primaryLight;
    const fill = 'rgba(124, 58, 237, 0.15)';
    const sw = 2.5;

    switch (name) {
      case 'circle':
        svg += `<circle cx="${cx}" cy="${cy}" r="55" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
        if (showLabels) svg += `<text x="${cx}" y="${cy + 4}" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="12" font-family="Inter, sans-serif">circle</text>`;
        break;

      case 'triangle':
        svg += `<polygon points="${cx},15 15,135 135,135" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
        if (showLabels) {
          svg += `<text x="45" y="100" fill="${V_COLORS.textMuted}" font-size="10" font-family="Inter, sans-serif" transform="rotate(-56,45,100)">side</text>`;
          svg += `<text x="${cx}" y="148" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="10" font-family="Inter, sans-serif">side</text>`;
        }
        break;

      case 'rectangle':
        svg += `<rect x="15" y="35" width="120" height="80" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
        if (showLabels) {
          svg += `<text x="${cx}" y="130" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="10" font-family="Inter, sans-serif">length</text>`;
          svg += `<text x="8" y="${cy + 4}" fill="${V_COLORS.textMuted}" font-size="10" font-family="Inter, sans-serif" transform="rotate(-90,8,${cy})" text-anchor="middle">width</text>`;
        }
        break;

      case 'square':
        svg += `<rect x="25" y="25" width="100" height="100" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
        if (showLabels) svg += `<text x="${cx}" y="140" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="10" font-family="Inter, sans-serif">all sides equal</text>`;
        break;

      case 'pentagon':
        const pentPts = Array.from({ length: 5 }, (_, i) => {
          const a = (i * 72 - 90) * Math.PI / 180;
          return `${cx + 55 * Math.cos(a)},${cy + 55 * Math.sin(a)}`;
        }).join(' ');
        svg += `<polygon points="${pentPts}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
        break;

      case 'hexagon':
        const hexPts = Array.from({ length: 6 }, (_, i) => {
          const a = (i * 60 - 90) * Math.PI / 180;
          return `${cx + 55 * Math.cos(a)},${cy + 55 * Math.sin(a)}`;
        }).join(' ');
        svg += `<polygon points="${hexPts}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
        break;

      // 3D shapes with perspective effect
      case 'cube': {
        const s = 60, ox = 30, oy = 35, d = 22;
        // Front face
        svg += `<rect x="${ox}" y="${oy + d}" width="${s}" height="${s}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
        // Top face
        svg += `<polygon points="${ox},${oy + d} ${ox + d},${oy} ${ox + s + d},${oy} ${ox + s},${oy + d}" fill="rgba(124,58,237,0.1)" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
        // Right face
        svg += `<polygon points="${ox + s},${oy + d} ${ox + s + d},${oy} ${ox + s + d},${oy + s} ${ox + s},${oy + s + d}" fill="rgba(124,58,237,0.2)" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
        break;
      }

      case 'cuboid': {
        const w = 80, h2 = 50, ox = 20, oy = 40, d = 25;
        svg += `<rect x="${ox}" y="${oy + d}" width="${w}" height="${h2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
        svg += `<polygon points="${ox},${oy + d} ${ox + d},${oy} ${ox + w + d},${oy} ${ox + w},${oy + d}" fill="rgba(6,182,212,0.1)" stroke="${V_COLORS.secondaryLight}" stroke-width="${sw}" stroke-linejoin="round"/>`;
        svg += `<polygon points="${ox + w},${oy + d} ${ox + w + d},${oy} ${ox + w + d},${oy + h2} ${ox + w},${oy + h2 + d}" fill="rgba(6,182,212,0.15)" stroke="${V_COLORS.secondaryLight}" stroke-width="${sw}" stroke-linejoin="round"/>`;
        break;
      }

      case 'cylinder': {
        const crx = 45, cry = 15;
        svg += `<ellipse cx="${cx}" cy="${cy + 35}" rx="${crx}" ry="${cry}" fill="rgba(16,185,129,0.1)" stroke="${V_COLORS.successLight}" stroke-width="${sw}"/>`;
        svg += `<rect x="${cx - crx}" y="${cy - 35}" width="${crx * 2}" height="70" fill="rgba(16,185,129,0.08)" stroke="none"/>`;
        svg += `<line x1="${cx - crx}" y1="${cy - 35}" x2="${cx - crx}" y2="${cy + 35}" stroke="${V_COLORS.successLight}" stroke-width="${sw}"/>`;
        svg += `<line x1="${cx + crx}" y1="${cy - 35}" x2="${cx + crx}" y2="${cy + 35}" stroke="${V_COLORS.successLight}" stroke-width="${sw}"/>`;
        svg += `<ellipse cx="${cx}" cy="${cy - 35}" rx="${crx}" ry="${cry}" fill="rgba(16,185,129,0.15)" stroke="${V_COLORS.successLight}" stroke-width="${sw}"/>`;
        break;
      }

      case 'cone': {
        svg += `<ellipse cx="${cx}" cy="${cy + 40}" rx="45" ry="14" fill="rgba(245,158,11,0.1)" stroke="${V_COLORS.warningLight}" stroke-width="${sw}"/>`;
        svg += `<line x1="${cx - 45}" y1="${cy + 40}" x2="${cx}" y2="${cy - 50}" stroke="${V_COLORS.warningLight}" stroke-width="${sw}"/>`;
        svg += `<line x1="${cx + 45}" y1="${cy + 40}" x2="${cx}" y2="${cy - 50}" stroke="${V_COLORS.warningLight}" stroke-width="${sw}"/>`;
        svg += `<circle cx="${cx}" cy="${cy - 50}" r="3" fill="${V_COLORS.warning}"/>`;
        break;
      }

      case 'sphere':
        svg += `<circle cx="${cx}" cy="${cy}" r="55" fill="rgba(239,68,68,0.08)" stroke="${V_COLORS.dangerLight}" stroke-width="${sw}"/>`;
        svg += `<ellipse cx="${cx}" cy="${cy}" rx="55" ry="18" fill="none" stroke="${V_COLORS.dangerLight}" stroke-width="1" stroke-dasharray="4,4"/>`;
        svg += `<ellipse cx="${cx}" cy="${cy}" rx="18" ry="55" fill="none" stroke="${V_COLORS.dangerLight}" stroke-width="1" stroke-dasharray="4,4"/>`;
        // Highlight
        svg += `<circle cx="${cx - 18}" cy="${cy - 20}" r="12" fill="rgba(255,255,255,0.08)"/>`;
        break;

      default:
        svg += `<text x="${cx}" y="${cy}" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="14" font-family="Inter, sans-serif">${name}</text>`;
    }

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     FRACTION CIRCLE
     Pie-chart style circle with shaded sectors
     ────────────────────────────────────────── */
  fraction_circle({ numerator = 1, denominator = 4, showLabel = true }) {
    const size = 150, cx = size / 2, cy = size / 2, r = 55;
    let svg = `<svg viewBox="0 0 ${size} ${size}" class="visual-svg visual-fraction-svg">`;

    // Draw sectors
    for (let i = 0; i < denominator; i++) {
      const startAngle = (i / denominator) * 360 - 90;
      const endAngle = ((i + 1) / denominator) * 360 - 90;
      const isFilled = i < numerator;

      const sr = startAngle * Math.PI / 180;
      const er = endAngle * Math.PI / 180;

      const x1 = cx + r * Math.cos(sr);
      const y1 = cy + r * Math.sin(sr);
      const x2 = cx + r * Math.cos(er);
      const y2 = cy + r * Math.sin(er);

      const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

      const fillColor = isFilled ? V_COLORS.primary : 'rgba(148,163,184,0.1)';
      const opacity = isFilled ? 0.7 : 1;

      svg += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${fillColor}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" opacity="${opacity}"/>`;
    }

    // Center label
    if (showLabel) {
      svg += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="#f1f5f9" font-size="18" font-weight="700" font-family="Outfit, sans-serif">${numerator}</text>`;
      svg += `<line x1="${cx - 14}" y1="${cy + 2}" x2="${cx + 14}" y2="${cy + 2}" stroke="#f1f5f9" stroke-width="2"/>`;
      svg += `<text x="${cx}" y="${cy + 18}" text-anchor="middle" fill="#f1f5f9" font-size="18" font-weight="700" font-family="Outfit, sans-serif">${denominator}</text>`;
    }

    // Outer ring
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${V_COLORS.primaryLight}" stroke-width="2"/>`;

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     BAR CHART
     Mini animated bar chart
     ────────────────────────────────────────── */
  bar_chart({ labels = [], values = [], colors = [], title = '' }) {
    const w = 320, h = 160, padL = 35, padB = 30, padT = 15;
    const barCount = Math.min(labels.length, values.length);
    if (barCount === 0) return '';

    const maxVal = Math.max(...values, 1);
    const barW = Math.min(40, (w - padL - 20) / barCount - 8);
    const chartH = h - padB - padT;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-bar-chart-svg">`;

    // Y-axis
    svg += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${h - padB}" stroke="${V_COLORS.gridLine}" stroke-width="1.5"/>`;
    // X-axis
    svg += `<line x1="${padL}" y1="${h - padB}" x2="${w - 10}" y2="${h - padB}" stroke="${V_COLORS.gridLine}" stroke-width="1.5"/>`;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      svg += `<line x1="${padL}" y1="${y}" x2="${w - 10}" y2="${y}" stroke="${V_COLORS.gridLine}" stroke-width="0.5" stroke-dasharray="3,3"/>`;
      svg += `<text x="${padL - 5}" y="${y + 4}" text-anchor="end" fill="${V_COLORS.textMuted}" font-size="9" font-family="Inter, sans-serif">${val}</text>`;
    }

    // Bars
    for (let i = 0; i < barCount; i++) {
      const barH = (values[i] / maxVal) * chartH;
      const x = padL + 15 + i * (barW + 8);
      const y = h - padB - barH;
      const color = (colors[i]) || MULTI_COLORS[i % MULTI_COLORS.length];

      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${color}" opacity="0.85">
        <animate attributeName="height" from="0" to="${barH}" dur="0.5s" begin="${i * 0.1}s" fill="freeze"/>
        <animate attributeName="y" from="${h - padB}" to="${y}" dur="0.5s" begin="${i * 0.1}s" fill="freeze"/>
      </rect>`;

      // Value on top
      svg += `<text x="${x + barW / 2}" y="${y - 4}" text-anchor="middle" fill="${color}" font-size="10" font-weight="600" font-family="Inter, sans-serif">${values[i]}</text>`;

      // Label
      svg += `<text x="${x + barW / 2}" y="${h - padB + 14}" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="9" font-family="Inter, sans-serif">${labels[i]}</text>`;
    }

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     NUMBER BOND DIAGRAM
     Classic circle-and-line bond visual
     ────────────────────────────────────────── */
  number_bond({ whole = 10, part1 = null, part2 = null, missingPart = 'part2' }) {
    const w = 220, h = 130;
    const topCx = w / 2, topCy = 30, br = 24;
    const leftCx = w / 2 - 55, leftCy = 100;
    const rightCx = w / 2 + 55, rightCy = 100;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-bond-svg">`;

    // Connecting lines
    svg += `<line x1="${topCx}" y1="${topCy + br}" x2="${leftCx}" y2="${leftCy - br}" stroke="${V_COLORS.primaryLight}" stroke-width="2.5" stroke-linecap="round"/>`;
    svg += `<line x1="${topCx}" y1="${topCy + br}" x2="${rightCx}" y2="${rightCy - br}" stroke="${V_COLORS.primaryLight}" stroke-width="2.5" stroke-linecap="round"/>`;

    // Helper to draw a bond node
    function bondNode(cx, cy, value, isMissing) {
      const fill = isMissing ? 'rgba(245,158,11,0.2)' : 'rgba(124,58,237,0.2)';
      const strokeColor = isMissing ? V_COLORS.warning : V_COLORS.primaryLight;
      const textColor = isMissing ? V_COLORS.warning : '#f1f5f9';
      const label = isMissing ? '?' : value;

      svg += `<circle cx="${cx}" cy="${cy}" r="${br}" fill="${fill}" stroke="${strokeColor}" stroke-width="2.5"/>`;
      if (isMissing) {
        svg += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" fill="${textColor}" font-size="20" font-weight="700" font-family="Outfit, sans-serif">?</text>`;
        svg += `<circle cx="${cx}" cy="${cy}" r="${br}" fill="none" stroke="${V_COLORS.warning}" stroke-width="2" stroke-dasharray="4,4">
          <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite"/>
        </circle>`;
      } else {
        svg += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" fill="${textColor}" font-size="16" font-weight="700" font-family="Outfit, sans-serif">${value}</text>`;
      }
    }

    bondNode(topCx, topCy, whole, missingPart === 'whole');
    bondNode(leftCx, leftCy, part1, missingPart === 'part1');
    bondNode(rightCx, rightCy, part2, missingPart === 'part2');

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     COMPARISON BARS
     Side-by-side proportional bars
     ────────────────────────────────────────── */
  comparison_bars({ values = [], labels = [] }) {
    if (values.length === 0) return '';
    const maxVal = Math.max(...values, 1);
    const w = 320, barH = 28, gap = 12, padL = 60, padT = 10;
    const chartW = w - padL - 20;
    const h = padT + values.length * (barH + gap) + 10;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-comparison-svg">`;

    values.forEach((val, i) => {
      const y = padT + i * (barH + gap);
      const barW = (val / maxVal) * chartW;
      const color = MULTI_COLORS[i % MULTI_COLORS.length];
      const lbl = labels[i] || `#${i + 1}`;

      svg += `<text x="${padL - 5}" y="${y + barH / 2 + 4}" text-anchor="end" fill="${V_COLORS.textMuted}" font-size="11" font-weight="500" font-family="Inter, sans-serif">${lbl}</text>`;

      svg += `<rect x="${padL}" y="${y}" width="${barW}" height="${barH}" rx="6" fill="${color}" opacity="0.8">
        <animate attributeName="width" from="0" to="${barW}" dur="0.6s" begin="${i * 0.1}s" fill="freeze"/>
      </rect>`;

      svg += `<text x="${padL + barW + 6}" y="${y + barH / 2 + 4}" fill="${color}" font-size="12" font-weight="700" font-family="Inter, sans-serif">${val}</text>`;
    });

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     PATTERN STRIP
     Colorful visual strip showing pattern items
     ────────────────────────────────────────── */
  pattern_strip({ items = [], highlightLast = false }) {
    if (items.length === 0) return '';
    const cellSize = 42, gap = 6;
    const w = items.length * (cellSize + gap) + (highlightLast ? cellSize + gap : 0) + 20;
    const h = cellSize + 20;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-pattern-svg">`;

    items.forEach((item, i) => {
      const x = 10 + i * (cellSize + gap);
      const y = 10;
      svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="8" fill="rgba(255,255,255,0.06)" stroke="${V_COLORS.gridLine}" stroke-width="1.5"/>`;
      svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 6}" text-anchor="middle" font-size="20" font-family="sans-serif">${item}</text>`;
    });

    // Question mark box
    if (highlightLast) {
      const x = 10 + items.length * (cellSize + gap);
      svg += `<rect x="${x}" y="10" width="${cellSize}" height="${cellSize}" rx="8" fill="rgba(245,158,11,0.15)" stroke="${V_COLORS.warning}" stroke-width="2" stroke-dasharray="5,4">
        <animate attributeName="stroke-dashoffset" values="0;9" dur="1s" repeatCount="indefinite"/>
      </rect>`;
      svg += `<text x="${x + cellSize / 2}" y="${10 + cellSize / 2 + 8}" text-anchor="middle" fill="${V_COLORS.warning}" font-size="24" font-weight="700" font-family="Outfit, sans-serif">?</text>`;
    }

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     MONEY VISUAL
     Shows coins and/or notes
     ────────────────────────────────────────── */
  money({ dollars = 0, cents = 0, notes = [] }) {
    let html = `<div class="visual-money-wrap">`;

    // Dollar notes
    if (notes.length > 0) {
      html += `<div class="money-notes">`;
      notes.forEach((n, i) => {
        const colors = { 2: '#10b981', 5: '#7c3aed', 10: '#f59e0b', 50: '#3b82f6', 100: '#ef4444' };
        const color = colors[n] || V_COLORS.primary;
        html += `<div class="money-note" style="--note-color: ${color}; --note-offset: ${i * 5}px">
          <span class="money-note-value">$${n}</span>
        </div>`;
      });
      html += `</div>`;
    } else if (dollars > 0 || cents > 0) {
      // Show as coin stack
      html += `<div class="money-display">`;
      if (dollars > 0) {
        html += `<div class="money-coin dollar">
          <span class="money-coin-label">$${dollars}</span>
        </div>`;
      }
      if (cents > 0) {
        html += `<div class="money-coin cent">
          <span class="money-coin-label">${cents}¢</span>
        </div>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  },

  /* ──────────────────────────────────────────
     RULER / MEASUREMENT
     SVG ruler showing lengths
     ────────────────────────────────────────── */
  ruler({ lengths = [], unit = 'cm', maxVal = 0 }) {
    const trueMax = maxVal || Math.max(...lengths, 10);
    const w = 400, h = 70, padL = 10;
    const scale = (w - padL * 2) / trueMax;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-ruler-svg">`;

    // Ruler body
    svg += `<rect x="${padL}" y="20" width="${w - padL * 2}" height="20" rx="3" fill="rgba(245,158,11,0.1)" stroke="${V_COLORS.warningLight}" stroke-width="1.5"/>`;

    // Tick marks
    for (let i = 0; i <= trueMax; i++) {
      const x = padL + i * scale;
      const tickH = i % 5 === 0 ? 18 : (i % 1 === 0 ? 10 : 6);
      svg += `<line x1="${x}" y1="20" x2="${x}" y2="${20 + tickH}" stroke="${V_COLORS.warningLight}" stroke-width="1"/>`;
      if (i % 5 === 0 || i === trueMax) {
        svg += `<text x="${x}" y="56" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="9" font-family="Inter, sans-serif">${i}</text>`;
      }
    }

    // Highlight lengths with colored brackets
    lengths.forEach((len, i) => {
      const x = padL;
      const endX = padL + len * scale;
      const color = MULTI_COLORS[i % MULTI_COLORS.length];
      const bracketY = 12 - i * 6;

      svg += `<line x1="${x}" y1="${bracketY}" x2="${endX}" y2="${bracketY}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
      svg += `<circle cx="${x}" cy="${bracketY}" r="2.5" fill="${color}"/>`;
      svg += `<circle cx="${endX}" cy="${bracketY}" r="2.5" fill="${color}"/>`;
      svg += `<text x="${(x + endX) / 2}" y="${bracketY - 4}" text-anchor="middle" fill="${color}" font-size="10" font-weight="600" font-family="Inter, sans-serif">${len} ${unit}</text>`;
    });

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     BALANCE SCALE
     Compares two weights
     ────────────────────────────────────────── */
  balance({ left = '', right = '', leftVal = 0, rightVal = 0 }) {
    const w = 250, h = 130;
    const cx = w / 2, baseY = 115;
    const tilt = leftVal > rightVal ? -8 : (leftVal < rightVal ? 8 : 0);

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-balance-svg">`;

    // Base
    svg += `<polygon points="${cx - 25},${baseY} ${cx + 25},${baseY} ${cx},${baseY - 15}" fill="${V_COLORS.textMuted}" opacity="0.4"/>`;
    // Post
    svg += `<line x1="${cx}" y1="${baseY - 15}" x2="${cx}" y2="35" stroke="${V_COLORS.textMuted}" stroke-width="3" stroke-linecap="round"/>`;

    // Beam (tilted)
    const beamLen = 90;
    const beamY = 35;
    const leftX = cx - beamLen;
    const rightX = cx + beamLen;
    const leftY = beamY + tilt;
    const rightY = beamY - tilt;

    svg += `<line x1="${leftX}" y1="${leftY}" x2="${rightX}" y2="${rightY}" stroke="${V_COLORS.primaryLight}" stroke-width="3" stroke-linecap="round"/>`;
    // Fulcrum circle
    svg += `<circle cx="${cx}" cy="${beamY}" r="5" fill="${V_COLORS.primary}"/>`;

    // Left pan
    svg += `<line x1="${leftX}" y1="${leftY}" x2="${leftX}" y2="${leftY + 20}" stroke="${V_COLORS.textMuted}" stroke-width="1.5"/>`;
    svg += `<rect x="${leftX - 30}" y="${leftY + 20}" width="60" height="6" rx="3" fill="${V_COLORS.secondary}" opacity="0.6"/>`;
    svg += `<text x="${leftX}" y="${leftY + 42}" text-anchor="middle" fill="${V_COLORS.secondaryLight}" font-size="11" font-weight="600" font-family="Inter, sans-serif">${left}</text>`;

    // Right pan
    svg += `<line x1="${rightX}" y1="${rightY}" x2="${rightX}" y2="${rightY + 20}" stroke="${V_COLORS.textMuted}" stroke-width="1.5"/>`;
    svg += `<rect x="${rightX - 30}" y="${rightY + 20}" width="60" height="6" rx="3" fill="${V_COLORS.warning}" opacity="0.6"/>`;
    svg += `<text x="${rightX}" y="${rightY + 42}" text-anchor="middle" fill="${V_COLORS.warningLight}" font-size="11" font-weight="600" font-family="Inter, sans-serif">${right}</text>`;

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     PLACE VALUE CHART
     Columns for digit positions
     ────────────────────────────────────────── */
  place_value_chart({ number = 0, columns = ['Th', 'H', 'T', 'O'] }) {
    const digits = String(number).padStart(columns.length, '0').split('');
    // take last N digits matching column count
    const displayDigits = digits.slice(-columns.length);

    let html = `<div class="visual-pv-chart">`;
    html += `<div class="pv-row pv-header">`;
    columns.forEach((col, i) => {
      const colors = ['#ef4444', '#f59e0b', '#06b6d4', '#10b981', '#7c3aed'];
      html += `<div class="pv-cell pv-header-cell" style="--pv-color: ${colors[i % colors.length]}">${col}</div>`;
    });
    html += `</div>`;

    html += `<div class="pv-row pv-digits">`;
    displayDigits.forEach((d, i) => {
      const colors = ['#ef4444', '#f59e0b', '#06b6d4', '#10b981', '#7c3aed'];
      html += `<div class="pv-cell pv-digit-cell" style="--pv-color: ${colors[i % colors.length]}">${d}</div>`;
    });
    html += `</div>`;

    html += `</div>`;
    return html;
  },

  /* ──────────────────────────────────────────
     RECTANGLE GRID
     Grid for area/perimeter visualization
     ────────────────────────────────────────── */
  rectangle_grid({ length = 4, width = 3, showArea = true }) {
    const cellSize = 28, gap = 2;
    const svgW = length * (cellSize + gap) + 50;
    const svgH = width * (cellSize + gap) + 50;

    let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" class="visual-svg visual-rect-grid-svg">`;

    // Grid cells
    for (let r = 0; r < width; r++) {
      for (let c = 0; c < length; c++) {
        const x = 25 + c * (cellSize + gap);
        const y = 15 + r * (cellSize + gap);
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="3" fill="rgba(124,58,237,0.2)" stroke="${V_COLORS.primaryLight}" stroke-width="1">
          <animate attributeName="opacity" values="0;1" dur="0.2s" begin="${(r * length + c) * 0.02}s" fill="freeze"/>
        </rect>`;
      }
    }

    // Dimension labels
    const totalW = length * (cellSize + gap) - gap;
    const totalH = width * (cellSize + gap) - gap;

    // Bottom label (length)
    svg += `<text x="${25 + totalW / 2}" y="${15 + totalH + 20}" text-anchor="middle" fill="${V_COLORS.secondary}" font-size="12" font-weight="600" font-family="Inter, sans-serif">${length} cm</text>`;
    svg += `<line x1="25" y1="${15 + totalH + 10}" x2="${25 + totalW}" y2="${15 + totalH + 10}" stroke="${V_COLORS.secondary}" stroke-width="1.5" marker-start="url(#dimArrowL)" marker-end="url(#dimArrowR)"/>`;

    // Left label (width)
    svg += `<text x="12" y="${15 + totalH / 2}" text-anchor="middle" fill="${V_COLORS.success}" font-size="12" font-weight="600" font-family="Inter, sans-serif" transform="rotate(-90,12,${15 + totalH / 2})">${width} cm</text>`;

    // Arrow markers
    svg += `<defs><marker id="dimArrowL" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M6,0 L0,3 L6,6" fill="${V_COLORS.secondary}" stroke="none"/></marker>`;
    svg += `<marker id="dimArrowR" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="${V_COLORS.secondary}" stroke="none"/></marker></defs>`;

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     ANGLE VISUAL
     Shows angles on a straight line or at a point
     ────────────────────────────────────────── */
  angle({ known = 90, unknown = 90, type = 'straight' }) {
    const w = 200, h = 120, cx = w / 2, cy = 100;
    const armLen = 75;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-angle-svg">`;

    // Base line (straight line)
    svg += `<line x1="15" y1="${cy}" x2="${w - 15}" y2="${cy}" stroke="${V_COLORS.textMuted}" stroke-width="2" stroke-linecap="round"/>`;

    // Known angle arm
    const knownRad = (-known) * Math.PI / 180;
    const kx = cx + armLen * Math.cos(knownRad);
    const ky = cy + armLen * Math.sin(knownRad);
    svg += `<line x1="${cx}" y1="${cy}" x2="${kx}" y2="${ky}" stroke="${V_COLORS.primary}" stroke-width="2.5" stroke-linecap="round"/>`;

    // Arc for known angle
    const arcR = 30;
    const kArcX = cx + arcR * Math.cos(knownRad);
    const kArcY = cy + arcR * Math.sin(knownRad);
    const largeArc = known > 180 ? 1 : 0;
    svg += `<path d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${kArcX} ${kArcY}" fill="none" stroke="${V_COLORS.primary}" stroke-width="1.5"/>`;
    // Known angle label
    const labelRad = (-known / 2) * Math.PI / 180;
    const labelX = cx + (arcR + 14) * Math.cos(labelRad);
    const labelY = cy + (arcR + 14) * Math.sin(labelRad);
    svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="${V_COLORS.primaryLight}" font-size="12" font-weight="600" font-family="Inter, sans-serif">${known}°</text>`;

    // Unknown angle arc (the remaining part)
    const uArcStartX = cx - arcR;
    svg += `<path d="M ${kArcX} ${kArcY} A ${arcR} ${arcR} 0 0 0 ${uArcStartX} ${cy}" fill="none" stroke="${V_COLORS.warning}" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    const uLabelRad = (-(known + unknown / 2)) * Math.PI / 180;
    const uLabelX = cx + (arcR + 14) * Math.cos(uLabelRad);
    const uLabelY = cy + (arcR + 14) * Math.sin(uLabelRad);
    svg += `<text x="${uLabelX}" y="${uLabelY}" text-anchor="middle" fill="${V_COLORS.warning}" font-size="13" font-weight="700" font-family="Inter, sans-serif">?</text>`;

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     GROUPING VISUAL (for division)
     Shows items being divided into groups
     ────────────────────────────────────────── */
  grouping({ total = 12, groups = 3, perGroup = 4, emoji = '🔵' }) {
    let html = `<div class="visual-grouping-wrap">`;

    for (let g = 0; g < groups; g++) {
      html += `<div class="grouping-group">`;
      html += `<div class="grouping-items">`;
      for (let i = 0; i < perGroup; i++) {
        html += `<span class="grouping-item">${emoji}</span>`;
      }
      html += `</div>`;
      html += `<div class="grouping-label">Group ${g + 1}</div>`;
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  },

  /* ──────────────────────────────────────────
     SPEED/DISTANCE VISUAL
     Shows a simple road with car icon
     ────────────────────────────────────────── */
  speed_distance({ speed = 60, hours = 3, distance = 180 }) {
    const w = 400, h = 80;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-speed-svg">`;

    // Road
    svg += `<rect x="20" y="35" width="${w - 40}" height="20" rx="4" fill="rgba(148,163,184,0.15)" stroke="${V_COLORS.gridLine}" stroke-width="1"/>`;
    // Dashes
    for (let i = 0; i < 12; i++) {
      svg += `<rect x="${40 + i * 30}" y="43" width="15" height="4" rx="2" fill="${V_COLORS.textMuted}" opacity="0.3"/>`;
    }

    // Car emoji at start
    svg += `<text x="25" y="32" font-size="20">🚗</text>`;
    // Flag at end
    svg += `<text x="${w - 45}" y="32" font-size="18">🏁</text>`;

    // Labels
    svg += `<text x="${w / 2}" y="72" text-anchor="middle" fill="${V_COLORS.secondary}" font-size="11" font-weight="600" font-family="Inter, sans-serif">${speed} km/h × ${hours} hr = ${distance} km</text>`;

    // Arrow with distance
    svg += `<line x1="40" y1="18" x2="${w - 50}" y2="18" stroke="${V_COLORS.secondary}" stroke-width="1.5" marker-end="url(#spdArrow)"/>`;
    svg += `<text x="${w / 2}" y="14" text-anchor="middle" fill="${V_COLORS.secondaryLight}" font-size="10" font-weight="500" font-family="Inter, sans-serif">${distance} km</text>`;
    svg += `<defs><marker id="spdArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${V_COLORS.secondary}"/></marker></defs>`;

    svg += `</svg>`;
    return svg;
  },

  /* ──────────────────────────────────────────
     BAR GRAPH (2-group)
     Simple bar graph for Group A vs Group B
     ────────────────────────────────────────── */
  bar_graph({ groupA = 0, groupB = 0, item = 'items' }) {
    // Delegate to bar_chart with labeled groups
    return VISUAL_GENERATORS.bar_chart({
      labels: ['Group A', 'Group B'],
      values: [groupA, groupB],
      colors: [V_COLORS.secondary, V_COLORS.warning],
      title: item
    });
  },

  /* ──────────────────────────────────────────
     FRACTION BAR
     Shows addition of like fractions visually
     ────────────────────────────────────────── */
  fraction_bar({ numerator1 = 1, numerator2 = 1, denominator = 4 }) {
    const w = 300, h = 90;
    const barW = 220, barH = 28;
    const startX = 40, y1 = 15, y2 = 55;
    const segW = barW / denominator;

    let svg = `<svg viewBox="0 0 ${w} ${h}" class="visual-svg visual-fraction-svg">`;

    // First fraction bar
    for (let i = 0; i < denominator; i++) {
      const filled = i < numerator1;
      svg += `<rect x="${startX + i * segW}" y="${y1}" width="${segW - 2}" height="${barH}" rx="3" fill="${filled ? V_COLORS.primary : 'rgba(148,163,184,0.1)'}" stroke="rgba(255,255,255,0.15)" stroke-width="1" opacity="${filled ? 0.75 : 1}"/>`;
    }
    svg += `<text x="${startX - 5}" y="${y1 + barH / 2 + 4}" text-anchor="end" fill="${V_COLORS.primaryLight}" font-size="12" font-weight="600" font-family="Inter, sans-serif">${numerator1}/${denominator}</text>`;

    // Plus sign
    svg += `<text x="${w / 2}" y="${y1 + barH + 12}" text-anchor="middle" fill="${V_COLORS.textMuted}" font-size="14" font-weight="600" font-family="Inter, sans-serif">+</text>`;

    // Second fraction bar
    for (let i = 0; i < denominator; i++) {
      const filled = i < numerator2;
      svg += `<rect x="${startX + i * segW}" y="${y2}" width="${segW - 2}" height="${barH}" rx="3" fill="${filled ? V_COLORS.secondary : 'rgba(148,163,184,0.1)'}" stroke="rgba(255,255,255,0.15)" stroke-width="1" opacity="${filled ? 0.75 : 1}"/>`;
    }
    svg += `<text x="${startX - 5}" y="${y2 + barH / 2 + 4}" text-anchor="end" fill="${V_COLORS.secondaryLight}" font-size="12" font-weight="600" font-family="Inter, sans-serif">${numerator2}/${denominator}</text>`;

    svg += `</svg>`;
    return svg;
  },
};
