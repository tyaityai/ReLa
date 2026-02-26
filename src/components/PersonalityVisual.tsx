import { useState, useEffect, useMemo } from 'react';
import { generateBytesFromURL, isHTTPS } from '../utils/hash';

interface PersonalityVisualProps {
  url: string;
  size?: number;
}

function extractParams(bytes: Uint8Array) {
  return {
    // ── 配色 ──
    hue: Math.round((bytes[0] / 255) * 360),
    saturation: Math.round((bytes[1] / 255) * 30) + 45, // 45〜75%
    lightness: Math.round((bytes[2] / 255) * 15) + 55, // 55〜70%
    schemeType: bytes[3] % 4, // 0:補色 1:トライアド 2:類似 3:単色
    bgDark: bytes[4] % 4 === 0, // 1/4の確率でダーク背景

    // ── ルール選択 ──
    ruleType: bytes[5] % 7, // 0〜6の7種類

    // ── 放射対称 ──
    rotations: (bytes[6] % 5) + 3, // 3〜7
    twist: (bytes[7] / 255) * 25, // 0〜25度のねじれ
    layers: (bytes[8] % 3) + 2, // 2〜4層

    // ── ブロブ ──
    blobPoints: (bytes[9] % 4) + 4, // 4〜7頂点
    blobWobble: (bytes[10] / 255) * 0.4 + 0.3, // 0.3〜0.7
    blobLayers: (bytes[11] % 3) + 2, // 2〜4重

    // ── 花 ──
    petalCount: (bytes[12] % 5) + 4, // 4〜8枚
    petalWidth: (bytes[13] / 255) * 0.4 + 0.3,
    petalLayers: (bytes[14] % 2) + 1, // 1〜2層

    // ── 泡 ──
    bubbleCount: (bytes[15] % 6) + 5, // 5〜10個
    bubbleSize: (bytes[16] / 255) * 25 + 15, // 15〜40px

    // ── 星 ──
    starPoints: (bytes[17] % 4) + 4, // 4〜7角
    innerRatio: (bytes[18] / 255) * 0.4 + 0.3, // 0.3〜0.7
    crystalLayers: (bytes[19] % 3) + 2, // 2〜4層

    // ── タイリング ──
    gridSize: (bytes[20] % 3) + 3, // 3x3〜5x5
    tileVariant: bytes[21] % 3,

    // ── 再帰多角形 ──
    sides: (bytes[22] % 4) + 3, // 3〜6角
    depth: (bytes[23] % 3) + 2, // 2〜4段

    // ── 共通 ──
    opacity: (bytes[24] / 255) * 0.35 + 0.55, // 0.55〜0.90
    strokeW: (bytes[25] / 255) * 0.3 + 0.3, // 0.3〜0.6
    fillMix: bytes[26] % 2 === 0,
  };
}

type Params = ReturnType<typeof extractParams>;
type Palette = ReturnType<typeof buildPalette>;

interface RuleProps {
  p: Params;
  palette: Palette;
}

function buildPalette(p: ReturnType<typeof extractParams>, isSecure: boolean) {
  const { hue, saturation, lightness, schemeType } = p;
  
  // HTTPの場合は彩度を0に(グレースケール化)
  const sat = isSecure ? saturation : 0;
  const light = isSecure ? lightness : 30;
  
  const offsets = [
    [0, 180], // 補色
    [0, 120, 240], // トライアド
    [0, 30, 60], // 類似色
    [0, 15, 30, 45], // 単色グラデ
  ][schemeType];

  return offsets.map((offset) => {
    const h = (hue + offset) % 360;
    return {
      fill: `hsl(${h}, ${sat}%, ${light}%)`,
      stroke: `hsl(${h}, ${sat}%, ${light - 20}%)`,
      light: `hsl(${h}, ${sat - 10}%, ${light + 15}%)`,
    };
  });
}

function blobPath(
  cx: number,
  cy: number,
  r: number,
  points: number,
  wobble: number,
  angleOffset = 0
) {
  const angles = Array.from(
    { length: points },
    (_, i) => (i / points) * Math.PI * 2 + angleOffset
  );
  const radii = angles.map(
    (a, i) => r * (1 + Math.sin(a * 2.5 + i) * wobble * 0.5)
  );

  const coords = angles.map((a, i) => ({
    x: cx + radii[i] * Math.cos(a),
    y: cy + radii[i] * Math.sin(a),
  }));

  const d = coords.map((pt, i) => {
    const next = coords[(i + 1) % coords.length];
    const mx = (pt.x + next.x) / 2;
    const my = (pt.y + next.y) / 2;
    return `Q ${pt.x} ${pt.y} ${mx} ${my}`;
  });

  const start = coords[0];
  const firstMid = {
    x: (coords[coords.length - 1].x + start.x) / 2,
    y: (coords[coords.length - 1].y + start.y) / 2,
  };

  return `M ${firstMid.x} ${firstMid.y} ${d.join(' ')} Z`;
}


function starPoints(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
  rotation = 0
) {
  return Array.from({ length: points * 2 }, (_, i) => {
    const angle = (i / (points * 2)) * Math.PI * 2 + rotation - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

function polyPoints(
  cx: number,
  cy: number,
  r: number,
  n: number,
  rotation = 0
) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rotation - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

function RadialRule({ p, palette }: RuleProps) {
  const { rotations, twist, layers, opacity, strokeW, fillMix } = p;
  return (
    <>
      {Array.from({ length: layers }, (_, layer) => {
        const scale = 1 - layer * 0.22;
        const color = palette[layer % palette.length];
        return Array.from({ length: rotations }, (_, i) => {
          const angle = i * (360 / rotations) + twist * layer;
          const r = 80 * scale;
          const path = `M 100 100 Q ${100 + r * 0.45} ${100 - r * 0.45} 100 ${
            100 - r
          } Q ${100 - r * 0.45} ${100 - r * 0.45} 100 100 Z`;
          return (
            <g key={`${layer}-${i}`} transform={`rotate(${angle}, 100, 100)`}>
              <path
                d={path}
                fill={fillMix && layer % 2 === 1 ? 'none' : color.fill}
                fillOpacity={opacity - layer * 0.08}
                stroke={color.stroke}
                strokeWidth={strokeW}
                strokeLinejoin="round"
              />
            </g>
          );
        });
      })}
    </>
  );
}

function BlobRule({ p, palette }: RuleProps) {
  const { blobPoints, blobWobble, blobLayers, opacity, strokeW } = p;
  return (
    <>
      {Array.from({ length: blobLayers }, (_, i) => {
        const scale = 1 - i * 0.2;
        const color = palette[i % palette.length];
        const angleOffset = i * 0.4;
        return (
          <path
            key={i}
            d={blobPath(100, 100, 75 * scale, blobPoints, blobWobble, angleOffset)}
            fill={color.fill}
            fillOpacity={opacity - i * 0.1}
            stroke={color.stroke}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        );
      })}
    </>
  );
}

function FlowerRule({ p, palette }: RuleProps) {
  const { petalCount, petalWidth, petalLayers, opacity, strokeW } = p;
  const elements = [];

  for (let layer = 0; layer < petalLayers + 1; layer++) {
    const r = 70 * (1 - layer * 0.3);
    const color = palette[layer % palette.length];
    const rotOffset = layer * (180 / petalCount);

    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2 + rotOffset;
      const cx = 100 + r * 0.5 * Math.cos(angle);
      const cy = 100 + r * 0.5 * Math.sin(angle);
      const rx = r * petalWidth;
      const ry = r * 0.45;
      const deg = (angle * 180) / Math.PI + 90;

      elements.push(
        <ellipse
          key={`${layer}-${i}`}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          transform={`rotate(${deg}, ${cx}, ${cy})`}
          fill={color.fill}
          fillOpacity={opacity - layer * 0.1}
          stroke={color.stroke}
          strokeWidth={strokeW}
        />
      );
    }
  }

  elements.push(
    <circle
      key="center"
      cx={100}
      cy={100}
      r={12}
      fill={palette[0].light}
      stroke={palette[0].stroke}
      strokeWidth={strokeW}
    />
  );
  return <>{elements}</>;
}

function BubbleRule({ p, palette }: RuleProps) {
  const { bubbleCount, bubbleSize, opacity, strokeW } = p;
  return (
    <>
      {Array.from({ length: bubbleCount }, (_, i) => {
        const angle = (i / bubbleCount) * Math.PI * 2;
        const dist = i % 2 === 0 ? 45 : 65;
        const cx = 100 + dist * Math.cos(angle);
        const cy = 100 + dist * Math.sin(angle);
        const r = bubbleSize * (0.6 + (i % 3) * 0.25);
        const color = palette[i % palette.length];
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill={color.fill}
            fillOpacity={opacity+0.1}
            stroke={color.stroke}
            strokeWidth={strokeW}
          />
        );
      })}
      <circle
        cx={100}
        cy={100}
        r={bubbleSize * 0.9}
        fill={palette[0].light}
        fillOpacity={opacity}
        stroke={palette[0].stroke}
        strokeWidth={strokeW}
      />
    </>
  );
}

function StarRule({ p, palette }: RuleProps) {
  const { starPoints: pts, innerRatio, crystalLayers, twist, opacity, strokeW } = p;
  return (
    <>
      {Array.from({ length: crystalLayers }, (_, i) => {
        const scale = 1 - i * 0.2;
        const color = palette[i % palette.length];
        const rotation = i * ((twist * Math.PI) / 180);
        return (
          <polygon
            key={i}
            points={starPoints(100, 100, 80 * scale, 80 * scale * innerRatio, pts, rotation)}
            fill={i % 2 === 0 ? color.fill : 'none'}
            fillOpacity={opacity - i * 0.08}
            stroke={color.stroke}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        );
      })}
    </>
  );
}

function TileRule({ p, palette }: RuleProps) {
  const { gridSize, tileVariant, opacity, strokeW } = p;
  const size = 200;
  const cell = size / gridSize;

  return (
    <>
      {Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => {
          const x = col * cell;
          const y = row * cell;
          const cx = x + cell / 2;
          const cy = y + cell / 2;
          const r = cell / 2 - 2;
          const color = palette[(row + col) % palette.length];
          const v = (row * gridSize + col) % 4;

          return (
            <g key={`${row}-${col}`}>
              {tileVariant === 0 && (
                <path
                  d={
                    v < 2
                      ? `M ${x} ${cy} Q ${cx} ${y} ${cx} ${cy} Q ${cx} ${y + cell} ${
                          x + cell
                        } ${cy}`
                      : `M ${cx} ${y} Q ${x + cell} ${cy} ${cx} ${cy} Q ${x} ${cy} ${cx} ${
                          y + cell
                        }`
                  }
                  fill="none"
                  stroke={color.fill}
                  strokeWidth={strokeW * 7}
                  strokeLinecap="round"
                  opacity={opacity}
                />
              )}
              {tileVariant === 1 && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={r * (0.4 + (v % 3) * 0.2)}
                  fill={v % 2 === 0 ? color.fill : 'none'}
                  stroke={color.stroke}
                  strokeWidth={strokeW}
                  fillOpacity={opacity}
                />
              )}
              {tileVariant === 2 && (
                <rect
                  x={x + 3}
                  y={y + 3}
                  width={cell - 6}
                  height={cell - 6}
                  rx={cell * 0.3}
                  ry={cell * 0.3}
                  fill={v % 2 === 0 ? color.fill : color.light}
                  fillOpacity={opacity}
                  stroke={color.stroke}
                  strokeWidth={strokeW}
                />
              )}
            </g>
          );
        })
      )}
    </>
  );
}

function RecursiveRule({ p, palette }: RuleProps) {
  const { sides, depth, twist, opacity, strokeW } = p;
  return (
    <>
      {Array.from({ length: depth + 2 }, (_, d) => {
        const scale = 1 - d * (0.7 / (depth + 1));
        const r = 85 * scale;
        const rotation = d * ((twist * Math.PI) / 180) - Math.PI / 2;
        const color = palette[d % palette.length];
        return (
          <polygon
            key={d}
            points={polyPoints(100, 100, r, sides, rotation)}
            fill={d % 2 === 0 ? color.fill : 'none'}
            fillOpacity={opacity * (1 - d * 0.1)}
            stroke={color.stroke}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        );
      })}
    </>
  );
}

const RULES = [
  { component: RadialRule, label: '放射対称' },
  { component: BlobRule, label: 'ブロブ' },
  { component: FlowerRule, label: '花' },
  { component: BubbleRule, label: '泡' },
  { component: StarRule, label: '星' },
  { component: TileRule, label: 'タイル' },
  { component: RecursiveRule, label: '再帰' },
];

// ═══════════════════════════════════════════════════
// メインコンポーネント
// ═══════════════════════════════════════════════════
function PersonalityVisual({ url, size = 100 }: PersonalityVisualProps) {
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const isSecure = isHTTPS(url);

  useEffect(() => {
    generateBytesFromURL(url).then(setBytes);
  }, [url]);

  const params = useMemo(() => (bytes ? extractParams(bytes) : null), [bytes]);
  const palette = useMemo(
    () => (params ? buildPalette(params, isSecure) : []),
    [params, isSecure]
  );

  if (!bytes || !params) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: '#eee',
          borderRadius: '8px',
        }}
      />
    );
  }

  const { hue, saturation, bgDark, ruleType } = params;
  const bg = bgDark
    ? `hsl(${hue}, ${saturation * 0.4}%, 12%, 0%)`
    : `hsl(${hue}, ${saturation * 0.25}%, 85%, 0%)`;

  const { component: RuleComp } = RULES[ruleType];

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: bg, borderRadius: '8px', display: 'block' }}
    >
      <RuleComp p={params} palette={palette} />
    </svg>
  );
}

export default PersonalityVisual;