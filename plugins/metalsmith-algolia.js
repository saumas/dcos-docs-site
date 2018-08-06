const algoliasearch = require('algoliasearch');
const semverRegex = require('semver-regex');
const semverSort = require('semver-sort');
const sanitizeHtml = require('sanitize-html');
const extname = require('path').extname;
const debug = require('debug')('metalsmith-algolia');

/**
 * Search indexing for algolia
 */

module.exports = function algoliaMiddlewareCreator(options = {}) {
  /**
   * Algolia Configuration
   * @param {Object} options
   * @param {string} options.projectIds
   * @param {string} options.privateKey
   * @param {string} options.index
   * @param {boolean} options.clearIndex
   * @param {array} options.skipSections
   * @param {string} options.renderPathPattern
   */

  const parameters = ['projectId', 'privateKey', 'index'];

  for (let i = 0; i < parameters.length; i += 1) {
    const parameter = parameters[i];
    if (!options[parameter]) {
      console.error(`Algolia: "${parameter}" option must be set, skipping indexation`);
      return null;
    }
  }

  const client = algoliasearch(options.projectId, options.privateKey);
  const index = client.initIndex(options.index);

  /**
   * Algolia Indexing Settings
   */
  index.setSettings({
    distinct: true,
    attributeForDistinct: 'path',
    searchableAttributes: ['title', 'excerpt', 'content'],
    attributesToSnippet: [
      'excerpt:40',
      'content:40',
    ],
    attributesForFaceting: ['section', 'product', 'version', 'type'],
    customRanking: ['asc(section)', 'desc(product)', 'asc(versionWeight)'],
  });

  return function metalsmithAlgoliaMiddleware(files, metalsmith, done) {
    // Get metadata
    const metadata = metalsmith.metadata();
    if (!metadata) {
      console.error('Metadata must be configured');
      return;
    }

    // Get hierarchy
    const hierarchy = metadata.hierarchy;
    if (!hierarchy) {
      console.error('Hierarchy must be configured');
      return;
    }

    // Build semver map
    const semverMap = buildSemverMap(files, options.skipSections, options.renderPathPattern);

    // Start promise chain
    let start;

    // Clear index
    if (options.clearIndex === true) {
      start = new Promise((resolve, reject) => {
        index.clearIndex((err) => {
          if (err) {
            console.error('Algolia: Error while cleaning index:', err);
            reject();
          } else {
            console.log('Algolia: Cleared index');
            resolve();
          }
        });
      });
    } else {
      start = Promise.resolve();
    }

    // Initialize indexing
    start.then(() => {
      const promises = [];
      const objects = [];

      // Loop through metalsmith object
      Object.keys(files).forEach((file) => {
        if (inExcludedSection(file, options.skipSections, options.renderPathPattern)) {
          return;
        }
        if (extname(file) !== '.html') return;
        const fileData = files[file];
        const postContent = sanitize(fileData.contents);
        const postParts = convertStringToArray(postContent, 9000);
        postParts.forEach((value, _index) => {
          const record = getSharedAttributes(fileData, hierarchy, semverMap);
          record.objectID = `${file}-${index.indexName}`;
          record.content = value;
          objects.push(record);
        });
      });

      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        promises.push(
          new Promise((resolve, reject) => {
            index.addObject(object, (err, _content) => {
              if (err) {
                console.error(`Algolia: Skipped "${object.objectID}": ${err.message}`);
                reject(err);
              } else {
                console.log(`Algolia: Updating "${object.objectID}"`);
              }
              resolve();
            });
          }),
        );
      }

      promises.reduce((promise, item) => {
        return promise.then(() => item.then());
      }, Promise.resolve()).then(() => {
        done();
      });
    });
  };
};

// File paths caught here will not be indexed for search.
// This is determined by the ALGOLIA_SKIP_SECTIONS environment variable.
const inExcludedSection = (filePath, skipSections, renderPathPattern) => {
  if (renderPathPattern) {
    const pathPatternRegex = RegExp(renderPathPattern);
    if (!pathPatternRegex.test(filePath)) {
      return true;
    }
  }

  for (let i = 0; i < skipSections.length; i += 1) {
    const skipSection = skipSections[i];
    const regex = RegExp(skipSection);

    if (regex.test(filePath)) {
      return true;
    }
  }

  return false;
};

// Build a sorted map that ranks semver
const buildSemverMap = (files, skipSections, renderPathPattern) => {
  const versions = [];

  const cleanVersion = (version) => {
    if (semverRegex().test(version)) {
      return version;
    }
    const v = version.split('.');
    if (v.length < 3) {
      v.push('0');
    }
    return v.slice(0, 3).join('.');
  };

  // Filter
  const filePaths = Object.keys(files);
  for (let i = 0; i < filePaths.length; i += 1) {
    const file = filePaths[i];
    const pathParts = file.split('/');
    if (inExcludedSection(file, skipSections, renderPathPattern)) {
      continue;
    } else if (pathParts[0] === 'services' && pathParts[2] && /^(v|)[0-9].[0-9](.*)/.test(pathParts[2]) && versions.indexOf(pathParts[2]) === -1) {
      versions.push(pathParts[2]);
    } else if (/^[0-9]\.[0-9](.*)/.test(pathParts[0]) && versions.indexOf(pathParts[0]) === -1) {
      versions.push(pathParts[0]);
    }
  }

  // Sort
  let versionsSorted = versions.map(cleanVersion);
  versionsSorted = semverSort.desc(versionsSorted);

  // Map
  const map = {};

  versions.forEach((version) => {
    const cv = cleanVersion(version);
    const weight = versionsSorted.indexOf(cv);
    map[version] = {
      version: cv,
      weight,
    };
  });

  return map;
};

// Get shared attributes for a record.
const getSharedAttributes = (fileData, hierarchy, semverMap) => {
  const pathParts = fileData.path.split('/');
  const record = {};

  if (pathParts[0] === 'test') {
    return record;
  } else if (pathParts[0] === '404') {
    return record;
  } else if (pathParts[0] === 'services') {
    let product;
    record.section = 'Service Docs';
    // If in /services/product/**
    if (pathParts[1]) {
      const productPath = pathParts.slice(0, 2).join('/');
      product = hierarchy.findByPath(productPath).title || '';
      if (product) {
        record.product = product;
      }
    }
    // If in /services/product/version/**
    if (pathParts[2]) {
      const regex = /^(v|)[0-9].[0-9](.*)/g;
      const isVersion = regex.test(pathParts[2]);
      if (isVersion) {
        record.version = `${product} ${pathParts[2].substr(1)}`;
        record.versionNumber = pathParts[2].substr(1);
        record.versionWeight = semverMap[pathParts[2]].weight;
      }
    }
  } else if (/^[0-9]\.[0-9](.*)/.test(pathParts[0])) {
    // Docs version
    const product = 'DC/OS';
    record.section = 'DC/OS Docs';
    record.product = product;
    // If in /1.*/*
    if (pathParts[0]) {
      record.version = `${product} ${pathParts[0]}`;
      record.versionNumber = pathParts[0];
      record.versionWeight = semverMap[pathParts[0]].weight;
    }
  }

  let type = '';
  if (fileData.enterprise) type = 'Enterprise';
  if (fileData.oss) type = 'Open Source';

  record.title = fileData.title;
  record.path = fileData.path;
  record.type = type;

  // Excerpt
  if (fileData.excerpt) {
    record.excerpt = fileData.excerpt;
  } else {
    const excerptPath = pathParts.join('/');
    const objectHierarchy = hierarchy.findByPath(excerptPath) || '';
    const excerpt = objectHierarchy.excerpt || '';
    if (objectHierarchy && excerpt) {
      record.excerpt = excerpt;
    }
  }

  return record;
};

// Trim whitespace from of string.
const trim = string => string.replace(/^\s+|\s+$/g, '');

/**
 * Parses buffer to string and sanitizes html.
 * Removes all contained <pre></pre> tags.
 * Removes all tags and replaces with whitespace.
 * @param {Buffer} buffer
 */
const sanitize = (buffer) => {
  const string = buffer.toString();
  let parsedString = sanitizeHtml(string, {
    allowedTags: [],
    allowedAttributes: [],
    selfClosing: [],
    nonTextTags: ['style', 'script', 'textarea', 'noscript', 'pre'],
  });
  parsedString = trim(parsedString);
  return parsedString;
};

// Push content to array.
const convertStringToArray = (str, maxPartSize) => {
  const chunkArr = [];
  let leftStr = str;
  do {
    chunkArr.push(leftStr.substring(0, maxPartSize));
    leftStr = leftStr.substring(maxPartSize, leftStr.length);
  } while (leftStr.length > 0);
  return chunkArr;
};
