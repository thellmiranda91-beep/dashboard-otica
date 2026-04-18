// ═══ DESIGN TOKENS — "Refined Warmth" ═══
export const C = {
  nv: "#0C1F2E", nvL: "#163348",
  co: "#E05C3A", coH: "#C94D2D", coS: "#FFF1ED",
  sg: "#1D8C6B", sgS: "#E4F6F0",
  cr: "#FAF7F2", wm: "#F4F1EC",
  tx: "#1A1A1A", md: "#5C5C5C", lt: "#9A9A9A",
  bd: "#E5E1DA", wh: "#FFFFFF",
  gl: "#C08930", glS: "#FDF6E8",
  ig: "#5B63D3", igS: "#ECEEFF",
  dn: "#C33A2E", dnS: "#FDECEB",
};

export const ft = "'Outfit',sans-serif";
export const ftD = "'Sora',sans-serif";

export const fm = v => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
export const fk = v => v >= 1000 ? `R$ ${(v / 1000).toFixed(1)}k` : fm(v);
export const pc = v => `${v.toFixed(1)}%`;
