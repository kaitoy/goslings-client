/*
 * goslings-client.js
 * https://github.com/kaitoy/goslings-client.js
 * MIT licensed
 *
 * Copyright (C) 2016 Kaito Yamada
 */

import vis from 'vis';
import path from 'path';

class Network {

  constructor(commits) {
    this.nodes = new vis.DataSet([]);
    this.edges = new vis.DataSet([]);
    this.addCommits(commits);
    this.network = new vis.Network(
      document.getElementById('network-container'),
      {
        nodes: this.nodes,
        edges: this.edges,
      },
      {
        edges: {
          arrows: 'to',
          color: 'black',
          dashes: true,
          shadow: true,
        },
        nodes: {
          borderWidth: 0,
          color: 'rgb(255, 0, 102)',
          font: "10px 'Roboto' black",
          shape: 'dot',
          shadow: true,
        },
        interaction: {
          navigationButtons: false,
        },
      },
    );
  }

  addEventListener(event, listener) {
    this.network.on(event, (params) => {
      listener(params.pointer.DOM.x, params.pointer.DOM.y, params.nodes[0]);
    });
  }

  addCommits(commits) {
    this.nodes.add(
      commits.map(commit => ({
        id: commit.id,
        label: commit.id,
        title: commit.id,
        type: 'commit',
        tree: commit.treeId,
      })),
    );

    const edges = [];
    commits.forEach((commit) => {
      commit.parentIds.forEach((parentId) => {
        edges.push({
          from: commit.id,
          to: parentId,
        });
      });
    });
    this.edges.add(edges);
  }

  addBranches(branches) {
    this.nodes.add(
      branches.map(branch => ({
        id: branch.name,
        label: branch.name,
        title: branch.name,
        color: 'rgb(75, 172, 198)',
        shape: 'box',
        type: 'branch',
      })),
    );
    this.edges.add(
      branches.map(branch => ({
        from: branch.name,
        to: branch.referentId,
      })),
    );
  }

  addTags(tags) {
    tags.forEach((tag) => {
      this.nodes.add({
        id: tag.name,
        label: tag.name,
        title: tag.name,
        color: 'rgb(75, 172, 198)',
        shape: 'box',
        type: 'tag',
      });
      if (tag.tagObjectId) {
        this.nodes.add({
          id: tag.tagObjectId,
          label: tag.tagObjectId,
          title: tag.tagObjectId,
          color: 'rgb(255, 0, 0)',
          shape: 'diamond',
          type: 'tagObject',
        });
        this.edges.add({
          from: tag.name,
          to: tag.tagObjectId,
        });
        this.edges.add({
          from: tag.tagObjectId,
          to: tag.referentId,
        });
      } else {
        this.edges.add({
          from: tag.name,
          to: tag.referentId,
        });
      }
    });
  }

  addSymrefs(symrefs) {
    this.nodes.add(
      symrefs.map(symref => ({
        id: symref.name,
        label: symref.name,
        title: symref.name,
        color: 'rgb(75, 172, 198)',
        shape: 'box',
        type: 'symref',
      })),
    );
    this.edges.add(
      symrefs.map(symref => ({
        from: symref.name,
        to: symref.referent,
      })),
    );
  }

  addTrees(parentId, trees) {
    this.nodes.add(
      trees.filter(tree => !this.nodes.get(tree.id)).map(tree => ({
        id: tree.id,
        label: tree.name,
        title: tree.id,
        color: 'rgb(87, 254 ,64)',
        shape: 'triangle',
        type: 'tree',
        trees: tree.trees,
        blobs: tree.blobs,
      })),
    );
    this.edges.add(
      trees.map(tree => ({
        from: parentId,
        to: tree.id,
      })),
    );
  }

  addBlobs(parentId, blobs) {
    this.nodes.add(
      blobs.filter(blob => !this.nodes.get(blob.id)).map(blob => ({
        id: blob.id,
        label: blob.name,
        title: blob.id,
        color: 'rgb(153, 0, 153)',
        shape: 'box',
        type: 'blob',
      })),
    );
    this.edges.add(
      blobs.map(blob => ({
        from: parentId,
        to: blob.id,
      })),
    );
  }

  addIndex(index) {
    const indexNodeId = 'index';
    this.nodes.add({
      id: indexNodeId,
      label: indexNodeId,
      title: indexNodeId,
      font: { size: 40 },
      color: 'rgb(3, 231, 41)',
      shape: 'box',
      type: 'index',
      blobs: index.entries.reduce((blobs, entry) => {
        blobs[entry.id] = path.basename(entry.path); // eslint-disable-line no-param-reassign
        return blobs;
      }, {}),
    });
  }

}

export default Network;
