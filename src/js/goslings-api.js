/*
 * goslings-client.js
 * https://github.com/kaitoy/goslings-client.js
 * MIT licensed
 *
 * Copyright (C) 2016 Kaito Yamada
 */

import request from 'browser-request';

const lastModified = {};

function get(url, qs) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url,
      qs,
      json: true,
      timeout: 300000,
    };
    if (lastModified[url]) {
      options.headers = {
        'If-Modified-Since': lastModified[url],
      };
    }

    request(
      options,
      (err, resp, body) => {
        if (err) {
          reject(err);
        } else {
          if (resp.getResponseHeader['last-modified']) {
            lastModified[url] = resp.getResponseHeader['last-modified'];
          }
          resolve(body);
        }
      },
    );
  });
}

function getToken(uri) {
  return get('/v1/tokens', { uri });
}

function getCommits(token) {
  return get(`/v1/${token}/objects/commits`);
}

function getBranches(token) {
  return get(`/v1/${token}/refs/branches`);
}

function getTags(token) {
  return get(`/v1/${token}/refs/tags`);
}

function getSymrefs(token) {
  return get(`/v1/${token}/symrefs`);
}

function getTrees(token, ids) {
  return get(`/v1/${token}/objects/trees/${ids.join(',')}`);
}

function getContents(token, id) {
  if (id.match('[0-9a-f]{40}')) {
    return get(`/v1/${token}/objects/${id}/contents`);
  } else if (id.startsWith('refs')) {
    return get(`/v1/${token}/${id}/contents`);
  } else if (id === 'index') {
    return get(`/v1/${token}/index/contents`);
  }
  return get(`/v1/${token}/symrefs/${id}/contents`);
}

function getIndex(token) {
  return get(`/v1/${token}/index`);
}

export default {
  getToken,
  getCommits,
  getBranches,
  getTags,
  getSymrefs,
  getTrees,
  getContents,
  getIndex,
};
