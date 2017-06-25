/*
 * goslings-client.js
 * https://github.com/kaitoy/goslings-client.js
 * MIT licensed
 *
 * Copyright (C) 2016-2017 Kaito Yamada
 */

import 'material-design-lite';
import url from 'url';
import progressBar from './progress-bar';
import api from './goslings-api';
import dialogs from './dialogs';
import Network from './network';
import resizeHandler from './resize-handler';

dialogs.init();

async function showNetworkView(token, isRemote) {
  document.getElementById('goslings-container').innerHTML = `
    <div id="network-container"></div>
  `;

  const adjustNetworkContainer = () => {
    const windowHeight = document.documentElement.clientHeight;
    document.getElementById('network-container').style.height = `${windowHeight}px`;
  };
  adjustNetworkContainer();
  resizeHandler.addListener(adjustNetworkContainer);

  const commits = await api.getCommits(token);
  if (commits.message) {
    throw commits;
  }

  const network = new Network(commits);
  let surpressContentsDialog = 0;
  network.addEventListener('click', (x, y, nodeId) => {
    setTimeout(() => {
      (async () => {
        if (surpressContentsDialog > 0) {
          surpressContentsDialog -= 1;
          return;
        }

        dialogs.closeObjectContentsDialog();
        if (nodeId) {
          const contents = await api.getContents(token, nodeId);
          if (contents.message) {
            throw contents;
          }
          dialogs.showObjectContents(contents, x, y);
        }
      })().catch((err) => {
        console.error(err);
        dialogs.showError(err.message);
      });
    }, 350);
  });
  network.addEventListener('doubleClick', (x, y, nodeId) => {
    (async () => {
      surpressContentsDialog = 2;
      if (!nodeId) {
        return;
      }

      const node = network.nodes.get(nodeId);
      if (node.isOpened) {
        return;
      }

      let treeIds = [];
      let blobIds = [];
      const idToName = {};
      switch (node.type) {
        case 'commit':
          treeIds = [node.tree];
          idToName[node.tree] = 'Project Root';
          break;
        case 'tree':
          treeIds = Object.keys(node.trees);
          blobIds = Object.keys(node.blobs);
          Object.assign(idToName, node.trees, node.blobs);
          break;
        case 'index':
          blobIds = Object.keys(node.blobs);
          Object.assign(idToName, node.blobs);
          break;
        default:
          return;
      }

      if (treeIds && treeIds.length > 0) {
        const trees = await api.getTrees(token, treeIds);
        if (trees.message) {
          throw trees;
        }
        trees.forEach((tree) => {
          tree.name = idToName[tree.id]; // eslint-disable-line no-param-reassign
        });
        network.addTrees(nodeId, trees);
      }
      if (blobIds && blobIds.length > 0) {
        network.addBlobs(nodeId, blobIds.map(blobId => ({
          id: blobId,
          name: idToName[blobId],
        })));
      }
      node.isOpened = true;
      network.nodes.update(node);
    })().catch((err) => {
      console.error(err);
      dialogs.showError(err.message);
    });
  });

  const branches = await api.getBranches(token);
  if (branches.message) {
    throw branches;
  }
  network.addBranches(branches);

  const tags = await api.getTags(token);
  if (tags.message) {
    throw tags;
  }
  network.addTags(tags);

  const symrefs = await api.getSymrefs(token);
  if (symrefs.message) {
    throw symrefs;
  }
  network.addSymrefs(symrefs);

  if (!isRemote) {
    const index = await api.getIndex(token);
    if (index.message) {
      throw index;
    }
    network.addIndex(index);
  }

  progressBar.setInProgress(false);
  window.network = network;
}

function showFormView() {
  const uriForm = document.getElementById('goslings-uri-form');
  uriForm.style.visibility = 'visible';

  const adjustUriForm = () => {
    const windowHeight = document.documentElement.clientHeight;
    const titleHeight = document.getElementById('goslings-title').offsetHeight;
    uriForm.style.height = `${windowHeight - titleHeight}px`;
  };
  adjustUriForm();
  resizeHandler.addListener(adjustUriForm);

  const formButton = uriForm.querySelector('.mdl-button');
  formButton.addEventListener('click', () => {
    (async () => {
      formButton.setAttribute('disabled', 'disabled');
      progressBar.setInProgress(true);

      const inputUri = document.getElementById('goslings-uri').value;
      const token = await api.getToken(inputUri);
      if (token.message) {
        throw token;
      }

      resizeHandler.removeListener(adjustUriForm);
      const isRemote = !!url.parse(inputUri).hostname;
      showNetworkView(token.text, isRemote).catch((err) => {
        console.error(err);
        progressBar.setInProgress(false);
        dialogs.showError(err.message);
      });
    })().catch((err) => {
      console.error(err);
      formButton.removeAttribute('disabled');
      progressBar.setInProgress(false);
      dialogs.showError(err.message);
    });
  });
}

export default {
  showFormView,
};
