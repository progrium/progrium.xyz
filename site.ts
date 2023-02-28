
export default {
  src: "./content",
  global: {
    site: "progrium.xyz",
    cover_image: "https://progrium.xyz/photo_wide.png"
  }
}

export function groupByYear(pages) {
  return Object.entries(groupBy(pages, ({date}) => (date||"").substring(0, 4))).reverse();
}

export function byDate(a, b) {
  const dateA = (a.date || "");
  const dateB = (b.date || "");
  if (dateA < dateB) return 1;
  if (dateA > dateB) return -1;
  return 0;
}

const groupBy = (arr, fn) =>
  arr.map(fn).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc;
  }, {});