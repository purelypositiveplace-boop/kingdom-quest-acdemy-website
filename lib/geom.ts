/** Round SVG coordinates so server and browser render identical strings (avoids hydration mismatches). */
export const r2 = (n: number) => Math.round(n * 100) / 100;
export const cos = (a: number) => r2(Math.cos(a));
export const sin = (a: number) => r2(Math.sin(a));
