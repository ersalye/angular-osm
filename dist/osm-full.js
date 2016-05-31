(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["name"] = factory();
	else
		root["angular-osm"] = root["angular-osm"] || {}, root["angular-osm"]["name"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _oauth = __webpack_require__(6);

	var _oauth2 = _interopRequireDefault(_oauth);

	var _base = __webpack_require__(4);

	var _base2 = _interopRequireDefault(_base);

	var _api = __webpack_require__(1);

	var _api2 = _interopRequireDefault(_api);

	var _overpass = __webpack_require__(8);

	var _overpass2 = _interopRequireDefault(_overpass);

	var _taginfo = __webpack_require__(10);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	var _nominatim = __webpack_require__(12);

	var _nominatim2 = _interopRequireDefault(_nominatim);

	var _togeojson = __webpack_require__(14);

	var _togeojson2 = _interopRequireDefault(_togeojson);

	var _osrm = __webpack_require__(17);

	var _osrm2 = _interopRequireDefault(_osrm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	angular.module('osm', [_api2.default.name, _base2.default.name, _oauth2.default.name, _overpass2.default.name, _taginfo2.default.name, _nominatim2.default.name, _togeojson2.default.name, _osrm2.default.name]);
	exports.default = angular.module('osm');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _api = __webpack_require__(2);

	var _api2 = _interopRequireDefault(_api);

	var _x2js = __webpack_require__(3);

	var _x2js2 = _interopRequireDefault(_x2js);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmAPIModule = angular.module('osm.api', [_x2js2.default.name]).provider('osmAPI', function osmAPIProvider() {
	    this.options = {
	        url: 'http://api.openstreetmap.org/api'
	    };
	    this.$get = function osmAPIFactory($http, $q, osmx2js) {
	        return new _api2.default($http, $q, osmx2js, this.options);
	    };
	    this.$get.$inject = ['$http', '$q', 'osmx2js'];
	});

	exports.default = osmAPIModule;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @ngdoc service
	 * @name osm.oauth.osmAuthService
	 * @description The main idea is use geojson object where it is possible
	 * for the rest of the API (changeset, ...) it's XML2JS that is used so always expect objects.
	 * @param  {Object} $http angular http
	 * @param  {Object} $q angular promise
	 */

	var osmAPI = function () {
	    function osmAPI($http, $q, osmx2js, options) {
	        _classCallCheck(this, osmAPI);

	        this.url = options.url;
	        this.$http = $http;
	        this.$q = $q;
	        this.osmx2js = osmx2js;
	        this._oauth = null;
	    }

	    /**
	     * @ngdoc method
	     * @name setAuthAdapter
	     * @description provide an adapter to make authenticated request
	     * @methodOf osm.api.osmAPI
	    */


	    _createClass(osmAPI, [{
	        key: 'setAuthAdapter',
	        value: function setAuthAdapter(oauth) {
	            this._oauth = oauth;
	        }

	        /**
	         * @ngdoc method
	         * @name setOauth
	         * @description use oauth object to call API
	         * @methodOf osm.api.osmAPI
	         * @return {Object} oauth
	        */

	    }, {
	        key: 'getAuthAdapter',
	        value: function getAuthAdapter() {
	            return this._oauth;
	        }

	        // ------------------ INTERNAL CALL SERVER (API) -----------------

	        /**
	         * @ngdoc method
	         * @name xhr
	         * @description call the API
	         * @param {Object} options
	         * ```
	            var options = {
	                method: 'GET', // POST, DELETE, PUT
	                path: '/0.6/changesets', //without the /api
	                data: content //if you need a payload
	            };
	            osmAPI.xhr(options);
	            ```
	         * @methodOf osm.api.osmAPI
	         * @return {Object} oauth
	        */

	    }, {
	        key: 'xhr',
	        value: function xhr(options) {
	            var deferred = this.$q.defer();
	            return this._oauth.xhr(options);
	        }

	        /**
	         * @ngdoc method
	         * @name getAuthenticated
	         * @description send a get request to OSM with
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} $http response
	        */

	    }, {
	        key: 'getAuthenticated',
	        value: function getAuthenticated(method, config) {
	            var _config = angular.copy(config);
	            if (!_config) {
	                _config = {};
	            }
	            _config.method = 'GET';
	            _config.path = method;
	            return this.xhr(_config);
	        }
	        /**
	         * @ngdoc method
	         * @name get
	         * @description send a get request
	         * @methodOf osm.api.osmAPI
	         * @param {string} method the api method
	         * @param {Object} config the $http.get config
	         * @returns {Promise} $http response with XML as string
	        */

	    }, {
	        key: 'get',
	        value: function get(method, config) {
	            var deferred = this.$q.defer();
	            var self = this;
	            var url = this.url + method;
	            this.$http.get(url, config).then(function (data) {
	                deferred.resolve(self.osmx2js.xml2js(data.data));
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        }
	        /**
	         * @ngdoc method
	         * @name put
	         * @description send a put request
	         * @methodOf osm.api.osmAPI
	         * @param {string} method the api method
	         * @param {Object} content payload
	         * @param {Object} config the $http.put config
	         * @returns {Promise} $http response
	        */

	    }, {
	        key: 'put',
	        value: function put(method, content, config) {
	            if (!config) {
	                config = {};
	            }
	            var _config = angular.copy(config);
	            _config.method = 'PUT';
	            _config.path = method;
	            _config.data = this.osmx2js.js2xml(content);
	            return this.xhr(_config);
	        }
	        /**
	         * @ngdoc method
	         * @name delete
	         * @description send a delete request
	         * @methodOf osm.api.osmAPI
	         * @param {string} method the api method
	         * @param {Object} config the $http.delete config
	         * @returns {Promise} $http response
	        */

	    }, {
	        key: 'delete',
	        value: function _delete(method, config) {
	            if (!config) {
	                config = {};
	            }
	            var _config = angular.copy(config);
	            _config.method = 'DELETE';
	            _config.path = method;
	            return this.xhr(_config);
	        }

	        // ------------------ CHANGESET -----------------

	        /**
	         * @ngdoc method
	         * @name createChangeset
	         * @methodOf osm.api.osmAPI
	         * @param {string} comment the comment assiociated to the changeset
	         * @returns {Promise} $http response
	        */

	    }, {
	        key: 'createChangeset',
	        value: function createChangeset(comment) {
	            var self = this;
	            var deferred = this.$q.defer();
	            var changeset = { osm: {
	                    changeset: {
	                        tag: [{ _k: 'created_by', _v: 'Angular-OSM' }, { _k: 'comment', _v: comment }]
	                    }
	                } };
	            this.put('/0.6/changeset/create', changeset).then(function (data) {
	                deferred.resolve(data);
	            });
	            return deferred.promise;
	        }
	        /**
	         * @ngdoc method
	         * @name getLastOpenedChangesetId
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} $http response with the last changeset id
	         * or undefined if no changeset was opened
	        */

	    }, {
	        key: 'getLastOpenedChangesetId',
	        value: function getLastOpenedChangesetId() {
	            var self = this;
	            var deferred = this.$q.defer();
	            var config = {
	                params: { user: this._oauth.getUserID(), open: true }
	            };
	            this.get('/0.6/changesets', config).then(function (data) {
	                var changesets = data.osm.changeset;
	                if (changesets.length > 0) {
	                    deferred.resolve(changesets[0].id);
	                } else if (changesets._id) {
	                    deferred.resolve(changesets._id);
	                } else {
	                    deferred.resolve();
	                }
	            });
	            return deferred.promise;
	        }
	        /**
	         * @ngdoc method
	         * @name closeChangeset
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} $http.put response of
	         * /0.6/changeset/CHANGESET_ID/close
	        */

	    }, {
	        key: 'closeChangeset',
	        value: function closeChangeset(id) {
	            var self = this;
	            return this.put('/0.6/changeset/' + id + '/close').then(function (data) {
	                return data;
	            });
	        }

	        // ------------------ USER API -----------------

	        /**
	         * @ngdoc method
	         * @name getUserById
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id of the user
	         * @returns {Promise} $http.get response
	         * /0.6/user/#id
	        */

	    }, {
	        key: 'getUserById',
	        value: function getUserById(id) {
	            return this.getAuthenticated('/0.6/user/' + id);
	        }

	        /**
	         * @ngdoc method
	         * @name getUserDetails
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} $http.get response
	         * /0.6/user/details
	        */

	    }, {
	        key: 'getUserDetails',
	        value: function getUserDetails() {
	            return this.getAuthenticated('/0.6/user/details');
	        }
	        /**
	         * @ngdoc method
	         * @name getUserPreferences
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} $http.get response
	         * /0.6/user/preferences
	        */

	    }, {
	        key: 'getUserPreferences',
	        value: function getUserPreferences() {
	            return this.getAuthenticated('/0.6/user/preferences');
	        }

	        /**
	         * @ngdoc method
	         * @name putUserPreferences
	         * @methodOf osm.api.osmAPI
	         * @param {string} key the preference key
	         * @param {string} value the preference value
	         * @returns {Promise} $http.get response
	         * /0.6/user/preferences
	        */

	    }, {
	        key: 'putUserPreferences',
	        value: function putUserPreferences(key, value) {
	            return this.put('/0.6/user/preferences/' + key, value);
	        }

	        //------------------ MAP DATA -------------------------

	        /**
	         * @ngdoc method
	         * @name getMap
	         * @methodOf osm.api.osmAPI
	         * @param {string} bbox left,bottom,right,top
	         * where:
	            left is the longitude of the left (westernmost) side of the bounding box.
	            bottom is the latitude of the bottom (southernmost) side of the bounding box.
	            right is the longitude of the right (easternmost) side of the bounding box.
	            top is the latitude of the top (northernmost) side of the bounding box.
	         * @returns {Promise} $http.get response
	         * /0.6/map?bbox=bbox
	        */

	    }, {
	        key: 'getMap',
	        value: function getMap(bbox) {
	            return this.get('/0.6/map?bbox=' + bbox);
	        }

	        /**
	         * @ngdoc method
	         * @name getNotes
	         * @methodOf osm.api.osmAPI
	         * @param {string} bbox left,bottom,right,top
	         * where:
	            left is the longitude of the left (westernmost) side of the bounding box.
	            bottom is the latitude of the bottom (southernmost) side of the bounding box.
	            right is the longitude of the right (easternmost) side of the bounding box.
	            top is the latitude of the top (northernmost) side of the bounding box.
	         * @returns {Promise} $http.get response
	        */

	    }, {
	        key: 'getNotes',
	        value: function getNotes(bbox) {
	            var url = '/0.6/notes?bbox=' + bbox;
	            return this.get(url);
	        }

	        //------------------ ELEMENTS: Node ----------------

	        /**
	         * @ngdoc method
	         * @name createNode
	         * @methodOf osm.api.osmAPI
	         * @param {Object/string} node
	             var node = {osm: {node: {
	                _changeset: '12', _lat: '...', _lon: '...',
	                tags: [
	                    {_k: '...', _v: '...'}
	                ]
	            }}};
	         * @returns {Promise} $http.put response
	         * PUT /0.6/node/create
	        */

	    }, {
	        key: 'createNode',
	        value: function createNode(node) {
	            return this.put('/0.6/node/create', node);
	        }

	        /**
	         * @ngdoc method
	         * @name getNode
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/node/#id
	        */

	    }, {
	        key: 'getNode',
	        value: function getNode(id) {
	            return this.get('/0.6/node/' + id);
	        }

	        /**
	         * @ngdoc method
	         * @name getNodeRelations
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/node/#id/relations
	        */

	    }, {
	        key: 'getNodeRelations',
	        value: function getNodeRelations(id) {
	            return this.get('/0.6/node/' + id + '/relations');
	        }

	        /**
	         * @ngdoc method
	         * @name getNodeWays
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/node/#id/ways
	        */

	    }, {
	        key: 'getNodeWays',
	        value: function getNodeWays(id) {
	            return this.get('/0.6/node/' + id + '/ways');
	        }

	        /**
	         * @ngdoc method
	         * @name getNodes
	         * @methodOf osm.api.osmAPI
	         * @param {array} ids ids
	         * @returns {Promise} $http.get response
	         * GET /0.6/node/#id
	        */

	    }, {
	        key: 'getNodes',
	        value: function getNodes(ids) {
	            return this.get('/0.6/nodes?nodes=' + ids.join(','));
	        }

	        /**
	         * @ngdoc method
	         * @name deleteNode
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.delete response
	         * DELETE /0.6/node/#id
	        */

	    }, {
	        key: 'deleteNode',
	        value: function deleteNode(id) {
	            return this.delete('/0.6/node/' + id);
	        }

	        //------------------ ELEMENTS: WAY ----------------

	        /**
	         * @ngdoc method
	         * @name createWay
	         * @methodOf osm.api.osmAPI
	         * @param {Object/string} way
	            var way = {osm: {way: {
	                _changeset: '12', _lat: '...', _lon: '...',
	                tags: [
	                    {_k: '...', _v: '...'}
	                ],
	                nd: [
	                    {_ref: '123'},
	                    {_ref: '456'},
	                ]
	            }}};
	         * @returns {Promise} $http.put response
	         * PUT /0.6/way/create
	        */

	    }, {
	        key: 'createWay',
	        value: function createWay(way) {
	            return this.put('/0.6/way/create', way);
	        }

	        /**
	         * @ngdoc method
	         * @name getWay
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/way/#id
	        */

	    }, {
	        key: 'getWay',
	        value: function getWay(id) {
	            return this.get('/0.6/way/' + id);
	        }

	        /**
	         * @ngdoc method
	         * @name getWayRelations
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/way/#id/relations
	        */

	    }, {
	        key: 'getWayRelations',
	        value: function getWayRelations(id) {
	            return this.get('/0.6/way/' + id + '/relations');
	        }

	        /**
	         * @ngdoc method
	         * @name getWayFull
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/way/#id/full
	        */

	    }, {
	        key: 'getWayFull',
	        value: function getWayFull(id) {
	            return this.get('/0.6/way/' + id + '/full');
	        }

	        /**
	         * @ngdoc method
	         * @name getWays
	         * @methodOf osm.api.osmAPI
	         * @param {array} ids ids
	         * @returns {Promise} $http.get response
	         * GET /0.6/ways?ways=ids
	        */

	    }, {
	        key: 'getWays',
	        value: function getWays(ids) {
	            return this.get('/0.6/ways?ways=' + ids.join(','));
	        }

	        /**
	         * @ngdoc method
	         * @name deleteWay
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.delete response
	         * DELETE /0.6/way/#id
	        */

	    }, {
	        key: 'deleteWay',
	        value: function deleteWay(id) {
	            return this.delete('/0.6/way/' + id);
	        }

	        //------------------ ELEMENTS: RELATION ----------------

	        /**
	         * @ngdoc method
	         * @name createRelation
	         * @methodOf osm.api.osmAPI
	         * @param {Object/string} relation
	            var relation = {osm: {relation: {
	                _changeset: '12', _lat: '...', _lon: '...',
	                tags: [
	                    {_k: '...', _v: '...'}
	                ],
	                member: [
	                    {_type: 'node', _role: 'stop', 'ref': '123'},
	                    {_type: 'way', 'ref': '234'}
	                ]
	            }}};
	         * @returns {Promise} $http.put response
	         * PUT /0.6/relation/create
	        */

	    }, {
	        key: 'createRelation',
	        value: function createRelation(relation) {
	            return this.put('/0.6/relation/create', relation);
	        }

	        /**
	         * @ngdoc method
	         * @name getRelation
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/relation/#id
	        */

	    }, {
	        key: 'getRelation',
	        value: function getRelation(id) {
	            return this.get('/0.6/relation/' + id);
	        }
	        /**
	         * @ngdoc method
	         * @name getRelationRelations
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/relation/#id/relations
	        */

	    }, {
	        key: 'getRelationRelations',
	        value: function getRelationRelations(id) {
	            return this.get('/0.6/relation/' + id + '/relations');
	        }

	        /**
	         * @ngdoc method
	         * @name getRelationFull
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/relation/#id/full
	        */

	    }, {
	        key: 'getRelationFull',
	        value: function getRelationFull(id) {
	            return this.get('/0.6/relation/' + id + '/full');
	        }

	        /**
	         * @ngdoc method
	         * @name getRelations
	         * @methodOf osm.api.osmAPI
	         * @param {array} ids ids
	         * @returns {Promise} $http.get response
	         * GET /0.6/relations?relations=ids
	        */

	    }, {
	        key: 'getRelations',
	        value: function getRelations(ids) {
	            return this.get('/0.6/relations?relations=' + ids.join(','));
	        }

	        /**
	         * @ngdoc method
	         * @name deleteRelation
	         * @methodOf osm.api.osmAPI
	         * @param {string} id id
	         * @returns {Promise} $http.delete response
	         * DELETE /0.6/relation/#id
	        */

	    }, {
	        key: 'deleteRelation',
	        value: function deleteRelation(id) {
	            return this.delete('/0.6/relation/' + id);
	        }
	    }]);

	    return osmAPI;
	}();

	osmAPI.$inject = ['$http', '$q', 'osmx2js'];
	exports.default = osmAPI;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	//https://github.com/abdmob/x2js as angular service
	var osmx2jsModule = angular.module('osm.x2js', []).provider('osmx2js', function osmx2jsProvider() {
	    this.options = {};
	    this.$get = function osmx2jsFactory() {
	        return new X2JS(this.options); //X2JS must be global
	    };
	});

	exports.default = osmx2jsModule;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _base = __webpack_require__(5);

	var _base2 = _interopRequireDefault(_base);

	var _api = __webpack_require__(1);

	var _api2 = _interopRequireDefault(_api);

	var _x2js = __webpack_require__(3);

	var _x2js2 = _interopRequireDefault(_x2js);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmBase64Module = angular.module('osm.base64', [_x2js2.default.name, _api2.default.name, 'base64']).provider('osmBase64', function osmBase64Provider() {
	    this.options = {
	        url: 'http://api.openstreetmap.org/api'
	    };
	    this.$get = function osmBase64Factory($base64, $http, $q, osmx2js) {
	        return new _base2.default($base64, $http, $q, osmx2js, this.options);
	    };
	    this.$get.$inject = ['$base64', '$http', 'osmx2js'];
	});

	exports.default = osmBase64Module;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Base64backend = function () {
	    function Base64backend($base64, $http, osmx2js) {
	        _classCallCheck(this, Base64backend);

	        this.$base64 = $base64;
	        this.storage = {};
	        this.$http = $http;
	        this.url = 'http://api.openstreetmap.org/api';
	        this.osmx2js = osmx2js;
	    }

	    _createClass(Base64backend, [{
	        key: 'xhr',
	        value: function xhr(options) {
	            var self = this;
	            options.url = this.url + options.path;
	            options.headers = {
	                Authorization: this.getAuthorization()
	            };
	            return this.$http(options).then(function (data) {
	                var d = data.data;
	                if (!d) {
	                    return;
	                }
	                if (d.substr) {
	                    if (d.substr(0, 5) === '<?xml') {
	                        return self.osmx2js.xml2js(d);
	                    }
	                }
	                return d;
	            });
	        }
	        /**
	         * @ngdoc method
	         * @name setCredentials
	         * @description if you don't use oauth, you can save
	         * credentials here using base64 localstorage (completly unsecure)
	         * @methodOf osm.api.osmAPI
	         * @returns {string} crendentials
	        */

	    }, {
	        key: 'setCredentials',
	        value: function setCredentials(username, password) {
	            this.storage.username = username;
	            var credentials = this.$base64.encode(username + ':' + password);
	            this.storage.credentials = credentials;
	            return credentials;
	        }
	        /**
	         * @ngdoc method
	         * @name getCredentials
	         * @description if you don't use oauth, you can manage
	         * credentials here using base64 headers
	         * @methodOf osm.api.osmAPI
	         * @returns {string} crendentials from the last set
	        */

	    }, {
	        key: 'getCredentials',
	        value: function getCredentials() {
	            return this.storage.credentials;
	        }
	        /**
	         * @ngdoc method
	         * @name getAuthorization
	         * @description compute authorization header from credentials
	         * @methodOf osm.api.osmAPI
	         * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
	        */

	    }, {
	        key: 'getAuthorization',
	        value: function getAuthorization() {
	            return 'Basic ' + this.storage.credentials;
	        }
	        /**
	         * @ngdoc method
	         * @name clearCredentials
	         * @description remove credentials from the localstorage
	         * @methodOf osm.api.osmAPI
	         * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
	        */

	    }, {
	        key: 'clearCredentials',
	        value: function clearCredentials() {
	            if (this.storage.removeItem) {
	                this.storage.removeItem('credentials');
	            } else {
	                delete this.storage.credentials;
	            }
	        }
	    }]);

	    return Base64backend;
	}();

	Base64backend.$inject = ['$base64', '$http', 'osmx2js'];

	exports.default = Base64backend;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _oauth = __webpack_require__(7);

	var _oauth2 = _interopRequireDefault(_oauth);

	var _api = __webpack_require__(1);

	var _api2 = _interopRequireDefault(_api);

	var _x2js = __webpack_require__(3);

	var _x2js2 = _interopRequireDefault(_x2js);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOAuthModule = angular.module('osm.oauth', [_api2.default.name, _x2js2.default.name]).provider('osmAuthService', function osmAuthServiceProvider() {
	    this.options = {};

	    this.$get = function osmAuthServiceFactory($q, osmx2js) {
	        return new _oauth2.default($q, osmx2js, this.options);
	    };
	    this.$get.$inject = ['$q', 'osmx2js'];
	});

	exports.default = osmOAuthModule;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	* @ngdoc service
	* @name osm.oauth.osmAuthService
	* @description handle osm oauth
	*/

	var osmAuthService = function () {
	    function osmAuthService($q, osmx2js, options) {
	        _classCallCheck(this, osmAuthService);

	        if (options) {
	            if (options.oauth_secret && options.oauth_consumer_key) {
	                this.auth = osmAuth(options);
	            }
	        }
	        this.osmx2js = osmx2js;
	        this.$q = $q;
	        this._options = options;
	    }
	    /**
	     * @ngdoc method
	     * @name logout
	     * @methodOf osm.auth.osmAuthService
	     */


	    _createClass(osmAuthService, [{
	        key: 'logout',
	        value: function logout() {
	            this.auth.logout();
	        }
	        /**
	         * @ngdoc method
	         * @name authenticated
	         * @methodOf osm.auth.osmAuthService
	         * @return {boolean} authenticated
	         */

	    }, {
	        key: 'authenticated',
	        value: function authenticated() {
	            return this.auth.authenticated();
	        }
	        /**
	         * @ngdoc method
	         * @name authenticate
	         * @methodOf osm.auth.osmAuthService
	         * @return {Promise} true/false
	         */

	    }, {
	        key: 'authenticate',
	        value: function authenticate() {
	            var deferred = this.$q.defer();
	            this.auth.authenticate(function () {
	                deferred.resolve(true);
	            });
	            return deferred.promise;
	        }
	        /**
	         * @ngdoc method
	         * @name xhr
	         * @methodOf osm.auth.osmAuthService
	         * @return {Promise} http response
	         */

	    }, {
	        key: 'xhr',
	        value: function xhr(options) {
	            var self = this;
	            var deferred = this.$q.defer();
	            options.path = '/api' + options.path;
	            if (options.data) {
	                options.body = options.data;
	                options.data = undefined;
	            }
	            this.auth.xhr(options, function (err, data) {
	                if (err) {
	                    deferred.reject(err);
	                } else {
	                    if (data instanceof XMLDocument) {
	                        deferred.resolve(self.osmx2js.dom2js(data));
	                    } else {
	                        deferred.resolve(data);
	                    }
	                }
	            });
	            return deferred.promise;
	        }
	        /**
	         * @ngdoc method
	         * @name options
	         * @methodOf osm.auth.osmAuthService
	         */

	    }, {
	        key: 'options',
	        value: function options(_options) {
	            if (this.auth) {
	                this.auth.options(_options);
	            } else {
	                this.auth = osmAuth(_options);
	            }
	        }
	    }]);

	    return osmAuthService;
	}();

	exports.default = osmAuthService;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _overpass = __webpack_require__(9);

	var _overpass2 = _interopRequireDefault(_overpass);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOverpassModule = angular.module('osm.overpass', []).provider('osmOverpassAPI', function osmOverpassAPIProvider() {
	    this.options = {
	        url: 'http://overpass-api.de/api/interpreter'
	    };
	    this.$get = function osmOverpassAPIFactory($http, $q) {
	        return new _overpass2.default($http, $q, this.options);
	    };
	    this.$get.$inject = ['$http', '$q'];
	});

	exports.default = osmOverpassModule;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @ngdoc service
	 * @name overpassAPI
	 * @param  {any} $http
	 * @param  {any} $q
	 */

	var osmOverpassAPI = function () {
	    function osmOverpassAPI($http, $q, options) {
	        _classCallCheck(this, osmOverpassAPI);

	        this.url = options.url;
	        this.$http = $http;
	        this.$q = $q;
	    }
	    /**
	     * @ngdoc method
	     * @name overpass
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API
	     * @methodOf osm.overpass.osmOverpassAPI
	     * @return {Promise} $http.get
	    */


	    _createClass(osmOverpassAPI, [{
	        key: 'overpass',
	        value: function overpass(query) {
	            var url = this.url;
	            var deferred = this.$q.defer();
	            var headers = {
	                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	            };
	            this.$http.post(url, 'data=' + encodeURIComponent(query), { headers: headers }).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        }
	        /**
	         * @ngdoc method
	         * @name overpass
	         * @description
	         * http://wiki.openstreetmap.org/wiki/FR:Overpass_API/Overpass_QL#By_area_.28area.29
	            By convention the area id can be calculated from an existing OSM way by adding 2400000000 to its OSM id, or in case of a relation by adding 3600000000 respectively. Note that area creation is subject to some extraction rules, i.e. not all ways/relations have an area counterpart (notably those that are tagged with area=no, and most multipolygons and that don't have a defined name=* will not be part of areas).
	         * @param {String} type 'r'/'relation' or 'w'/'way'
	         * @param {String/Number} osmId the id of the element
	         * @methodOf osm.overpass.osmOverpassAPI
	         * @return {Number} the area id
	        */

	    }, {
	        key: 'getAreaId',
	        value: function getAreaId(type, osmId) {
	            var id;
	            if (typeof osmId === 'string') {
	                id = parseInt(osmId, 10);
	            } else {
	                id = osmId;
	            }
	            if (type === 'r' || type === 'relation') {
	                return 3600000000 + id;
	            } else if (type === 'w' || type === 'way') {
	                return 2400000000 + id;
	            }
	        }
	    }, {
	        key: 'overpassToGeoJSON',
	        value: function overpassToGeoJSON(query, filter) {
	            var deferred = this.$q.defer();
	            var features = [];
	            var relations = [];
	            var result = {
	                type: 'FeatureCollection',
	                features: features,
	                relations: relations
	            };
	            if (filter === undefined) {
	                filter = function filter() {};
	            }
	            this.overpass(query).then(function (data) {
	                //TODO check if data is XML or JSON, here it's JSON
	                var node, feature, coordinates;
	                var cache = { loaded: false };
	                function getNodeById(id) {
	                    if (!cache.loaded) {
	                        var tmp;
	                        for (var i = 0; i < data.elements.length; i++) {
	                            tmp = data.elements[i];
	                            cache[tmp.id] = tmp;
	                        }
	                    }
	                    return cache[id];
	                }
	                for (var i = 0; i < data.elements.length; i++) {
	                    node = data.elements[i];
	                    if (node.type === 'node') {
	                        feature = {
	                            type: 'Feature',
	                            properties: node.tags,
	                            id: node.id,
	                            geometry: {
	                                type: 'Point',
	                                coordinates: [node.lon, node.lat]
	                            }
	                        };
	                        if (!filter(feature)) {
	                            features.push(feature);
	                        }
	                    } else if (node.type === 'way') {
	                        coordinates = [];
	                        feature = {
	                            type: 'Feature',
	                            properties: node.tags,
	                            id: node.id,
	                            geometry: {
	                                type: 'LineString',
	                                coordinates: coordinates
	                            }
	                        };
	                        for (var j = 0; j < node.nodes.length; j++) {
	                            coordinates.push([getNodeById(node.nodes[j]).lon, getNodeById(node.nodes[j]).lat]);
	                        }
	                        if (!filter(feature)) {
	                            features.push(feature);
	                        }
	                    } else if (node.type === 'relation') {
	                        result.relations.push({
	                            ref: node.id,
	                            tags: node.tags,
	                            type: 'relation',
	                            members: node.members
	                        });
	                    }
	                }
	                deferred.resolve(result);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        }
	    }]);

	    return osmOverpassAPI;
	}();

	exports.default = osmOverpassAPI;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _taginfo = __webpack_require__(11);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmTagInfoModule = angular.module('osm.taginfo', []).service('osmTagInfoAPI', _taginfo2.default);

	exports.default = osmTagInfoModule;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @ngdoc service
	 * @name osmTagInfoAPI
	 * @description integration of taginfo
	 * http://taginfo.openstreetmap.org/taginfo/apidoc
	 * @param  {any} $http
	 * @param  {any} $q
	 */

	var osmTagInfoAPI = function () {
	    function osmTagInfoAPI($http, $q) {
	        _classCallCheck(this, osmTagInfoAPI);

	        this.$http = $http;
	        this.$q = $q;
	        this.url = 'https://taginfo.openstreetmap.org/api/4';
	    }

	    _createClass(osmTagInfoAPI, [{
	        key: 'get',
	        value: function get(method, config) {
	            var deferred = this.$q.defer();
	            this.$http.get(this.url + method, config).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        }
	        /**
	         * @ngdoc method
	         * @name getKeyCombinations
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key matches this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeyCombinations',
	        value: function getKeyCombinations(params) {
	            return this.get('/key/combinations', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */

	    }, {
	        key: 'getKeyDistributionNodes',
	        value: function getKeyDistributionNodes(params) {
	            return this.get('/key/distribution/nodes', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */

	    }, {
	        key: 'getKeyDistributionWays',
	        value: function getKeyDistributionWays(params) {
	            return this.get('/key/distribution/ways', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getKeyStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */

	    }, {
	        key: 'getKeyStats',
	        value: function getKeyStats(params) {
	            return this.get('/key/stats', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getKeyValues
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            lang — Language for description (optional, default: 'en').
	            query — Only show results where the value matches this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeyValues',
	        value: function getKeyValues(params) {
	            return this.get('/key/values', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getKeyWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */

	    }, {
	        key: 'getKeyWikiPages',
	        value: function getKeyWikiPages(params) {
	            return this.get('/key/wiki_pages', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getKeysAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeysAll',
	        value: function getKeysAll(params) {
	            return this.get('/keys/all', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getKeysWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeysWikiPages',
	        value: function getKeysWikiPages(params) {
	            return this.get('/keys/wiki_pages', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getKeysWithoutWikiPage
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            english — Check for key wiki pages in any language (0, default) or in the English language (1).
	            min_count — How many tags with this key must there be at least to show up here? (default 10000).
	            query — Only show results where the key matches this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeysWithoutWikiPage',
	        value: function getKeysWithoutWikiPage(params) {
	            return this.get('/keys/without_wiki_page', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getRelationRoles
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the role matches this query (substring match, optional).
	            rtype — Relation type (required).
	         */

	    }, {
	        key: 'getRelationRoles',
	        value: function getRelationRoles(params) {
	            return this.get('/relation/roles', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getRelationStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */

	    }, {
	        key: 'getRelationStats',
	        value: function getRelationStats(params) {
	            return this.get('/relation/stats', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getRelationWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */

	    }, {
	        key: 'getRelationWikiPages',
	        value: function getRelationWikiPages(params) {
	            return this.get('/relation/wiki_pages', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getRelationsAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the relation type matches this query (substring match, optional).
	         */

	    }, {
	        key: 'getRelationsAll',
	        value: function getRelationsAll(params) {
	            return this.get('/relations/all', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyAndValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */

	    }, {
	        key: 'getSearchByKeyAndValue',
	        value: function getSearchByKeyAndValue(params) {
	            return this.get('/search/by_key_and_value', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyword
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */

	    }, {
	        key: 'getSearchByKeyword',
	        value: function getSearchByKeyword(params) {
	            return this.get('/search/by_keyword', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getSearchByRole
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Role to search for (substring search, required).
	         */

	    }, {
	        key: 'getSearchByRole',
	        value: function getSearchByRole(params) {
	            return this.get('/search/by_role', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getSearchByValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */

	    }, {
	        key: 'getSearchByValue',
	        value: function getSearchByValue(params) {
	            return this.get('/search/by_value', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getSiteInfo
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	             param: No params
	         */

	    }, {
	        key: 'getSiteInfo',
	        value: function getSiteInfo(params) {
	            return this.get('/site/info', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getSiteSources
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	             param: No params
	         */

	    }, {
	        key: 'getSiteSources',
	        value: function getSiteSources(params) {
	            return this.get('/site/sources', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getTagCombinations
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key or other_value matches this query (substring match, optional).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagCombinations',
	        value: function getTagCombinations(params) {
	            return this.get('/tag/combinations', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getTagDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagDistributionNodes',
	        value: function getTagDistributionNodes(params) {
	            return this.get('/tag/distribution/nodes', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getTagDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagDistributionWays',
	        value: function getTagDistributionWays(params) {
	            return this.get('/tag/distribution/ways', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getTagStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagStats',
	        value: function getTagStats(params) {
	            return this.get('/tag/stats', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getTagWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagWikiPages',
	        value: function getTagWikiPages(params) {
	            return this.get('/tag/wiki_pages', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getTagsPopular
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show tags matching this query (substring match in key and value, optional).
	         */

	    }, {
	        key: 'getTagsPopular',
	        value: function getTagsPopular(params) {
	            return this.get('/tags/popular', { params: params });
	        }
	        /**
	         * @ngdoc method
	         * @name getWikiLanguages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	             param: No params
	         */

	    }, {
	        key: 'getWikiLanguages',
	        value: function getWikiLanguages(params) {
	            return this.get('/wiki/languages', { params: params });
	        }
	    }]);

	    return osmTagInfoAPI;
	}();

	osmTagInfoAPI.$inject = ['$http', '$q'];

	exports.default = osmTagInfoAPI;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _nominatim = __webpack_require__(13);

	var _nominatim2 = _interopRequireDefault(_nominatim);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmNominatimModule = angular.module('osm.nominatim', []).factory('osmNominatim', _nominatim2.default).provider('osmNominatim', function osmNominatimProvider() {
	    this.options = {
	        url: 'https://nominatim.openstreetmap.org'
	    };
	    this.$get = function osmNominatimFactory($q) {
	        return new _nominatim2.default($q, this.options);
	    };
	    this.$get.$inject = ['$http'];
	});

	exports.default = osmNominatimModule;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	* @ngdoc service
	* @name osm.nominatim.osmNominatim
	* @description handle nominatim query
	*/

	var osmNominatim = function () {
	    function osmNominatim($http, options) {
	        _classCallCheck(this, osmNominatim);

	        this.url = options.url;
	        this.$http = $http;
	    }

	    /**
	     * @ngdoc method
	     * @name search
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/Nominatim
	     * @methodOf osm.nominatim.osmNominatim
	     * @return {Promise} $http.get
	    */


	    _createClass(osmNominatim, [{
	        key: 'search',
	        value: function search(query) {
	            //https://nominatim.openstreetmap.org/search
	            //?X-Requested-With=overpass-turbo&format=json&q=vern-sur-seiche
	            //params['accept-language'] = 'fr';
	            var params;
	            if (typeof query === 'string' || !query) {
	                params = {
	                    format: 'json',
	                    q: query
	                };
	            } else {
	                params = angular.copy(query);
	                params.format = 'json';
	            }
	            var config = {
	                params: params
	            };
	            var url = this.url + '/search';
	            return this.$http.get(url, config);
	        }

	        /**
	         * @ngdoc method
	         * @name reverse
	         * @param {Object/String} query
	         * http://wiki.openstreetmap.org/wiki/Nominatim
	         * @methodOf osm.nominatim.osmNominatim
	         * @return {Promise} $http.get
	        */

	    }, {
	        key: 'reverse',
	        value: function reverse(query) {
	            //https://nominatim.openstreetmap.org/reverse
	            //?X-Requested-With=overpass-turbo&format=json&q=vern-sur-seiche
	            //params['accept-language'] = 'fr';
	            var params;
	            if (typeof query === 'string') {
	                params = {
	                    format: 'json',
	                    q: query
	                };
	            } else {
	                params = angular.copy(query);
	                params.format = 'json';
	            }
	            var config = {
	                params: params
	            };
	            var url = this.url + '/reverse';
	            return this.$http.get(url, config);
	        }

	        /**
	         * @ngdoc method
	         * @name lookup
	         * @description
	         *  http://nominatim.openstreetmap.org/lookup?osm_ids=R146656,W104393803,N240109189
	         * @param {Object/String} query
	         * http://wiki.openstreetmap.org/wiki/Nominatim
	         * @methodOf osm.nominatim.osmNominatim
	         * @return {Promise} $http.get
	        */

	    }, {
	        key: 'lookup',
	        value: function lookup(query) {
	            var params;
	            if (typeof query === 'string') {
	                params = {
	                    format: 'json',
	                    q: query
	                };
	            } else {
	                params = angular.copy(query);
	                params.format = 'json';
	            }
	            var config = {
	                params: params
	            };
	            var url = this.url + '/lookup';
	            return this.$http.get(url, config);
	        }
	    }]);

	    return osmNominatim;
	}();

	exports.default = osmNominatim;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _togeojson = __webpack_require__(15);

	var _togeojson2 = _interopRequireDefault(_togeojson);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmtogeojsonModule = angular.module('osm.togeojson', []).provider('osmtogeojson', _togeojson2.default);

	exports.default = osmtogeojsonModule;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _togeojson = __webpack_require__(16);

	var _togeojson2 = _interopRequireDefault(_togeojson);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function osmtogejsonProvider() {
	    this.options = {
	        areaTags: ['area', 'building', 'leisure', 'tourism', 'ruins', 'historic', 'landuse', 'military', 'natural', 'sport'],
	        uninterestingTags: ['source', 'source_ref', 'source:ref', 'history', 'attribution', 'created_by', 'tiger:county', 'tiger:tlid', 'tiger:upload_uuid'],
	        styles: {}
	    };
	    this.$get = function () {
	        return (0, _togeojson2.default)(this.options);
	    };
	}
	exports.default = osmtogejsonProvider;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * @ngdoc service
	 * @name osmtogeojson
	 * @description osm to geojson without dependencies :)
	   
	   Import Note : geojson wait for lon/lat where every body else use lat/lon
	 */
	function factory(options) {
	    //copy/pasted/adapter from https://github.com/jfirebaugh/leaflet-osm/blob/master/leaflet-osm.js
	    var service = {
	        options: options,
	        getAsArray: getAsArray,
	        getFeatures: getFeatures,
	        getNodes: getNodes,
	        getWays: getWays,
	        getRelations: getRelations,
	        getTags: getTags,
	        buildFeatures: buildFeatures,
	        isWayArea: isWayArea,
	        interestingNode: interestingNode,
	        togeojson: togeojson
	    };
	    return service;

	    function getFeatures(data) {
	        var features = [];
	        if (!(data instanceof Array)) {
	            data = buildFeatures(data);
	        }

	        for (var i = 0; i < data.length; i++) {
	            var d = data[i];
	            var feature = {
	                type: 'Feature',
	                geometry: {},
	                properties: {
	                    id: d.id,
	                    tags: d.tags
	                }
	            };
	            if (d.type === "changeset") {
	                //build rectangle
	                // X = Long; Y = Lat, lets do it clockwise
	                feature.geometry.type = 'Polygon';
	                var bounds = d.latLngBounds;
	                feature.geometry.coordinates = [[[parseFloat(bounds._min_lon), parseFloat(bounds._min_lat)], [parseFloat(bounds._min_lon), parseFloat(bounds._max_lat)], [parseFloat(bounds._max_lon), parseFloat(bounds._max_lat)], [parseFloat(bounds._max_lon), parseFloat(bounds._min_lat)], [parseFloat(bounds._min_lon), parseFloat(bounds._min_lat)]]];
	            } else if (d.type === "node") {
	                //add a Point
	                feature.geometry.type = 'Point';
	                feature.geometry.coordinates = [d.latLng[1], d.latLng[0]];
	            } else {
	                var lngLats = new Array(d.nodes.length);

	                for (var j = 0; j < d.nodes.length; j++) {
	                    var latLng = d.nodes[j].latLng;
	                    lngLats[j] = [latLng[1], latLng[0]];
	                }

	                if (isWayArea(d)) {
	                    feature.geometry.type = 'Polygon';
	                    feature.geometry.coordinates = [lngLats];
	                } else {
	                    feature.geometry.type = 'LineString';
	                    feature.geometry.coordinates = lngLats;
	                }
	            }
	            features.push(feature);
	        }
	        return features;
	    }
	    function getAsArray(data) {
	        if (Array.isArray(data)) {
	            return data;
	        } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === "object") {
	            return [data];
	        } else {
	            return [];
	        }
	    }
	    function getTags(data) {
	        var rawtags = getAsArray(data.tag);
	        var tags = {};
	        rawtags.forEach(function (t) {
	            tags[t._k] = t._v;
	        });
	        return tags;
	    }
	    function getChangesets(data) {
	        var result = [];

	        var nodes = getAsArray(data.osm.changeset);
	        for (var i = 0; i < nodes.length; i++) {
	            var node = nodes[i];
	            result.push({
	                id: node._id,
	                type: "changeset",

	                latLngBounds: node,
	                tags: getTags(node)
	            });
	        }

	        return result;
	    }

	    function getNodes(data) {
	        var nodesAsArray = getAsArray(data.osm.node);
	        var nodesById = {};
	        nodesAsArray.forEach(function (node) {
	            nodesById[node._id] = {
	                id: node._id,
	                type: 'node',
	                latLng: [parseFloat(node._lat), parseFloat(node._lon)],
	                tags: getTags(node)
	            };
	        });
	        return nodesById;
	    }
	    function getWays(data, nodes) {
	        var result = [];
	        var ways = getAsArray(data.osm.way);
	        var features = [];
	        ways.forEach(function (way) {
	            var nds = way.nd;
	            var way_object = {
	                id: way._id,
	                type: "way",
	                nodes: new Array(nds.length),
	                tags: getTags(way)
	            };
	            for (var j = 0; j < nds.length; j++) {
	                way_object.nodes[j] = nodes[nds[j]._ref];
	            }
	            result.push(way_object);
	        });
	        return result;
	    }
	    function getRelations(data, nodes, way) {
	        var result = [];

	        var rels = getAsArray(data.osm.relation);
	        for (var i = 0; i < rels.length; i++) {
	            var rel = rels[i];
	            var members = getAsArray(rel.member);
	            var rel_object = {
	                id: rel._id,
	                type: "relation",
	                members: new Array(members.length),
	                tags: getTags(rel)
	            };
	            for (var j = 0; j < members.length; j++) {
	                if (members[j]._type === "node") {
	                    rel_object.members[j] = nodes[members[j]._ref];
	                } else {
	                    // relation-way and relation-relation membership not implemented
	                    rel_object.members[j] = null;
	                }
	            }
	            result.push(rel_object);
	        }
	        return result;
	    }

	    function buildFeatures(data) {
	        var features = [];
	        var nodes = getNodes(data); //-> {id: data, ...}
	        var ways = getWays(data, nodes); //->[]
	        var relations = getRelations(data, nodes, ways); //->[]

	        for (var node_id in nodes) {
	            var node = nodes[node_id];
	            if (interestingNode(node, ways, relations)) {
	                features.push(node);
	            }
	        }

	        for (var i = 0; i < ways.length; i++) {
	            var way = ways[i];
	            features.push(way);
	        }

	        return features;
	    }

	    function isWayArea(way) {
	        if (way.nodes[0] != way.nodes[way.nodes.length - 1]) {
	            return false;
	        }

	        for (var key in way.tags) {
	            if (options.areaTags.indexOf(key)) {
	                return true;
	            }
	        }

	        return false;
	    }

	    function interestingNode(node, ways, relations) {
	        var used = false;

	        for (var i = 0; i < ways.length; i++) {
	            if (ways[i].nodes.indexOf(node) >= 0) {
	                used = true;
	                break;
	            }
	        }

	        if (!used) {
	            return true;
	        }

	        for (var _i = 0; _i < relations.length; _i++) {
	            if (relations[_i].members.indexOf(node) >= 0) {
	                return true;
	            }
	        }

	        return false;
	    }
	    function togeojson(data, options) {
	        var res = {
	            type: 'FeatureCollection',
	            features: []
	        };
	        if (data) {
	            res.features = getFeatures(data);
	        }
	        return res;
	    }
	}

	exports.default = factory;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _osrm = __webpack_require__(18);

	var _osrm2 = _interopRequireDefault(_osrm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osrmModule = angular.module('osm.osrm', []).provider('osrmAPI', function osrmAPIProvider() {
	    this.options = {
	        url: 'http://router.project-osrm.org'
	    };
	    this.$get = function osrmAPIFactory($http, $q) {
	        return new _osrm2.default($http, $q, this.options);
	    };
	    this.$get.$inject = ['$http', '$q'];
	});

	exports.default = osrmModule;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @ngdoc service
	 * @name osrmAPI
	 * @param  {any} $http
	 * @param  {any} $q
	 * @description
	 * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md
	 */

	var osrmAPI = function () {
	    function osrmAPI($http, $q, options) {
	        _classCallCheck(this, osrmAPI);

	        this.url = options.url;
	        this.$http = $http;
	        this.$q = $q;
	    }

	    _createClass(osrmAPI, [{
	        key: 'get',
	        value: function get(service, version, profile, coordinates, options) {
	            var _coordinates = coordinates;
	            if (Array.isArray(coordinates)) {
	                _coordinates = coordinates.join(';');
	            }
	            var url = this.url + '/' + service + '/' + version + '/' + profile + '/' + _coordinates;
	            return this.$http.get(url, { params: options });
	        }
	        //coordinates is String of format {longitude},{latitude};{longitude},{latitude}[;{longitude},{latitude} ...]

	    }, {
	        key: 'nearest',
	        value: function nearest(profile, coordinates, number) {
	            var options;
	            if (number) {
	                options = { number: number };
	            }
	            return this.get('nearest', 'v1', profile, coordinates, options);
	        }
	    }, {
	        key: 'route',
	        value: function route(profile, coordinates, options) {
	            return this.get('route', 'v1', profile, coordinates, options);
	        }
	    }, {
	        key: 'table',
	        value: function table(profile, coordinates, options) {
	            return this.get('table', 'v1', profile, coordinates, options);
	        }
	    }, {
	        key: 'match',
	        value: function match(profile, coordinates, options) {
	            return this.get('match', 'v1', profile, coordinates, options);
	        }
	    }, {
	        key: 'trip',
	        value: function trip(profile, coordinates, options) {
	            return this.get('trip', 'v1', profile, coordinates, options);
	        }
	    }]);

	    return osrmAPI;
	}();

	exports.default = osrmAPI;

/***/ }
/******/ ])
});
;