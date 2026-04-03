export const money = (n) => `Rs ${n.toLocaleString("en-IN")}`;

export const formatTooltipValue = (value) => {
  const raw = Array.isArray(value) ? value[0] : value;
  return money(Number(raw ?? 0));
};
