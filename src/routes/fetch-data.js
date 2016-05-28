import fetch from '../core/fetch';

export const getJson = async(url, options) => {
  let res = await fetch(url, options);
  return await res.json();
};

export const getStatByProject = async () => {
  const result = await getJson('/api/stat/by-project');
  if (result.ret === 0) return result.data;
  else throw new Error('getStatByProject failed');
};

export const getStatByYear = async () => {
  const result = await getJson('/api/stat/by-year');
  if (result.ret === 0) return result.data;
  else throw new Error('getStatByYear failed');
};

export const findAcceptorsByProject = async (project, pageIndex = 0) => {
  let result = await getJson(`/api/acceptors/list/${pageIndex}?project=${encodeURIComponent(project)}`);
  if(result.ret === 0) return result.data;
  else throw new Error(`find acceptors by project failed:${JSON.stringify(result.msg)}`);
}

export const findAcceptors = async ({ project, year, text, pageIndex, pageSize } = {
  pageIndex: 0,
  pageSize: 20,
}) => {
  let query = `project=${project ? encodeURIComponent(project) : ''}`;
  query += `&year=${year || ''}`;
  query += `&text=${text ? encodeURIComponent(text) : ''}`;
  query += `&pageSize=${pageSize || 20}`;
  const res = await fetch(`/api/acceptors/list/${pageIndex}?${query}`, {
    credentials: 'same-origin',
  });
  const result = await res.json();
  if (result.ret === 0) return result.data;
  else throw result;
};
