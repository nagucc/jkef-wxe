import fetch from '../core/fetch';

export const getJson = async(url) => {
  let res = await fetch(url);
  return await res.json();
}

export const getStatByProject = async () => {
  let result = await getJson('/api/stat/by-project')
  if(result.ret === 0) return result.data;
  else throw new Error('getStatByProject failed');
}

export const getStatByYear = async () => {
  let result = await getJson('/api/stat/by-year')
  if(result.ret === 0) return result.data;
  else throw new Error('getStatByYear failed');
}
