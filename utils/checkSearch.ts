export const checkSearch = (searchIn: string, search: string) => {
  return searchIn.toLowerCase().trim().includes(search.toLowerCase().trim());
};
