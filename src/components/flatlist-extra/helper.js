export const isEmpty = (item) =>
    !!!item || item.length === 0 || Object.keys(item).length === 0;
