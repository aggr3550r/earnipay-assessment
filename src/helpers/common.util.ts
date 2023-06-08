/**
 * Checks to see if the data structure is empty
 * @param data
 * @returns
 */
export const IsEmpty = (data: string | Array<unknown>) => {
  return !data.length;
};

export const IsNull = (data: any) => {
  return data === null || data === undefined;
};
