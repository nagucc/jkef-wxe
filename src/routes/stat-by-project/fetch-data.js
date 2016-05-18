import fetch from '../../core/fetch';

export const getStatByProject = async () => {
  let res = await fetch('/api/stat/by-project');
  let result = await res.json();
  if(result.ret ===0) return result.data;
  else throw new Error('getStatByProject failed');
}
