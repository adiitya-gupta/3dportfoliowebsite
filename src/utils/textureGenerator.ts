import * as THREE from 'three';

export function createSkillBoxTexture(skillName: string, category: string, colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 512);

  // Border & Accent Grid
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 16;
  ctx.strokeRect(12, 12, 488, 488);

  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.strokeRect(32, 32, 448, 448);

  // Top Category Pill
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.roundRect(80, 60, 352, 48, 24);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(category.toUpperCase(), 256, 84);

  // Center Skill Name with Auto-Scale
  let fontSize = 48;
  ctx.font = `900 ${fontSize}px system-ui, sans-serif`;
  while (ctx.measureText(skillName).width > 420 && fontSize > 24) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize}px system-ui, sans-serif`;
  }

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 20;
  ctx.fillText(skillName, 256, 240);
  ctx.shadowBlur = 0;

  // Bottom Tagline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('CRASH TO BUMP!', 256, 400);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createBillboardTexture(title: string, subtitle: string, accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark glass background gradient
  const gradient = ctx.createLinearGradient(0, 0, 2048, 1024);
  gradient.addColorStop(0, '#0a0f1d');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2048, 1024);

  // Outer Glowing Neon Frame
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 24;
  ctx.strokeRect(24, 24, 2000, 976);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 6;
  ctx.strokeRect(48, 48, 1952, 928);

  const maxTextWidth = 1800; // Leave 124px padding on each side

  // --- 1. TITLE WITH SMART TEXT WRAPPING & AUTO-SCALING ---
  let titleFontSize = 80;
  ctx.font = `900 ${titleFontSize}px system-ui, sans-serif`;

  let titleLines = getWrappedLines(ctx, title, maxTextWidth);
  while (titleLines.length > 2 && titleFontSize > 44) {
    titleFontSize -= 6;
    ctx.font = `900 ${titleFontSize}px system-ui, sans-serif`;
    titleLines = getWrappedLines(ctx, title, maxTextWidth);
  }

  ctx.fillStyle = accentColor;
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 30;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Position title starting at Y=280px to leave ample top margin clear of any overlay
  const titleStartY = 280 - ((titleLines.length - 1) * titleFontSize * 0.55);
  titleLines.forEach((line, idx) => {
    ctx.fillText(line, 1024, titleStartY + idx * (titleFontSize * 1.25));
  });

  // --- 2. SUBTITLE / DESCRIPTION WITH SMART TEXT WRAPPING & AUTO-SCALING ---
  ctx.shadowBlur = 0;
  let subFontSize = 46;
  ctx.font = `600 ${subFontSize}px system-ui, sans-serif`;

  let subLines = getWrappedLines(ctx, subtitle, maxTextWidth);
  while (subLines.length > 4 && subFontSize > 28) {
    subFontSize -= 4;
    ctx.font = `600 ${subFontSize}px system-ui, sans-serif`;
    subLines = getWrappedLines(ctx, subtitle, maxTextWidth);
  }

  ctx.fillStyle = '#f1f5f9';
  const subStartY = 580 - ((subLines.length - 1) * subFontSize * 0.55);
  subLines.forEach((line, idx) => {
    ctx.fillText(line, 1024, subStartY + idx * (subFontSize * 1.35));
  });

  // --- 3. BOTTOM PROMPT PILL ---
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.roundRect(424, 870, 1200, 76, 38);
  ctx.fill();

  ctx.fillStyle = '#090d16';
  ctx.font = 'bold 34px system-ui, sans-serif';
  ctx.fillText('⚡ DRIVE INTO TRIGGER TO OPEN DETAILS ⚡', 1024, 908);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function getWrappedLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export function createNitroArrowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 1024);

  // Outer Neon Borders
  ctx.strokeStyle = '#00f3ff';
  ctx.lineWidth = 16;
  ctx.strokeRect(10, 10, 492, 1004);

  ctx.fillStyle = '#00f3ff';
  ctx.shadowColor = '#00f3ff';
  ctx.shadowBlur = 40;

  // Draw 3 glowing forward arrows pointing towards top (y=0)
  for (let i = 0; i < 3; i++) {
    const yOffset = i * 280 + 120;
    ctx.beginPath();
    ctx.moveTo(256, yOffset);
    ctx.lineTo(420, yOffset + 180);
    ctx.lineTo(340, yOffset + 180);
    ctx.lineTo(256, yOffset + 90);
    ctx.lineTo(172, yOffset + 180);
    ctx.lineTo(92, yOffset + 180);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createRoadGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Asphalt base
  ctx.fillStyle = '#1e2638';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle grid tile borders
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 4;
  for (let x = 0; x <= 1024; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, x);
    ctx.lineTo(1024, x);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(40, 40);
  texture.needsUpdate = true;
  return texture;
}
