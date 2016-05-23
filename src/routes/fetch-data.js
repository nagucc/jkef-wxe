import fetch from '../core/fetch';

export const getJson = async(url, options) => {
  let res = await fetch(url, options);
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

export const findAcceptorsByProject = async (project, pageIndex = 0) => {
  let result = await getJson(`/api/acceptors/list/${pageIndex}?project=${encodeURIComponent(project)}`);
  if(result.ret === 0) return result.data;
  else throw new Error(`find acceptors by project failed:${JSON.stringify(result.msg)}`);
}
