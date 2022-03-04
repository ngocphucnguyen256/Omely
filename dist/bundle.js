/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ceb0369c32c09137930a"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/app.js")(__webpack_require__.s = "./src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ext/config.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Upload server
Cookies.set('uploadr', 'http://www.aothunthongdiep.qsv');

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Popper!./node_modules/popper.js/dist/esm/popper.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Popper"] = __webpack_require__("./node_modules/popper.js/dist/esm/popper.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/popper.js/dist/esm/popper.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

var timeoutDuration = function () {
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      return 1;
    }
  }
  return 0;
}();

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the reference node of the reference object, or the reference object itself.
 * @method
 * @memberof Popper.Utils
 * @param {Element|Object} reference - the reference element (the popper will be relative to this)
 * @returns {Element} parent
 */
function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop);
    var marginLeft = parseFloat(styles.marginLeft);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicitly asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

    // flips variation if reference element overflows boundaries
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    // flips variation if popper content overflows boundaries
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

/* harmony default export */ __webpack_exports__["default"] = (Popper);
//# sourceMappingURL=popper.js.map

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./node_modules/bootstrap/dist/js/bootstrap.js":
/***/ (function(module, exports) {

module.exports = "/*!\n  * Bootstrap v4.4.1 (https://getbootstrap.com/)\n  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)\n  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n  */\n(function (global, factory) {\n  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('popper.js')) :\n  typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :\n  (global = global || self, factory(global.bootstrap = {}, global.jQuery, global.Popper));\n}(this, (function (exports, $, Popper) { 'use strict';\n\n  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;\n  Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;\n\n  function _defineProperties(target, props) {\n    for (var i = 0; i < props.length; i++) {\n      var descriptor = props[i];\n      descriptor.enumerable = descriptor.enumerable || false;\n      descriptor.configurable = true;\n      if (\"value\" in descriptor) descriptor.writable = true;\n      Object.defineProperty(target, descriptor.key, descriptor);\n    }\n  }\n\n  function _createClass(Constructor, protoProps, staticProps) {\n    if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n    if (staticProps) _defineProperties(Constructor, staticProps);\n    return Constructor;\n  }\n\n  function _defineProperty(obj, key, value) {\n    if (key in obj) {\n      Object.defineProperty(obj, key, {\n        value: value,\n        enumerable: true,\n        configurable: true,\n        writable: true\n      });\n    } else {\n      obj[key] = value;\n    }\n\n    return obj;\n  }\n\n  function ownKeys(object, enumerableOnly) {\n    var keys = Object.keys(object);\n\n    if (Object.getOwnPropertySymbols) {\n      var symbols = Object.getOwnPropertySymbols(object);\n      if (enumerableOnly) symbols = symbols.filter(function (sym) {\n        return Object.getOwnPropertyDescriptor(object, sym).enumerable;\n      });\n      keys.push.apply(keys, symbols);\n    }\n\n    return keys;\n  }\n\n  function _objectSpread2(target) {\n    for (var i = 1; i < arguments.length; i++) {\n      var source = arguments[i] != null ? arguments[i] : {};\n\n      if (i % 2) {\n        ownKeys(Object(source), true).forEach(function (key) {\n          _defineProperty(target, key, source[key]);\n        });\n      } else if (Object.getOwnPropertyDescriptors) {\n        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));\n      } else {\n        ownKeys(Object(source)).forEach(function (key) {\n          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));\n        });\n      }\n    }\n\n    return target;\n  }\n\n  function _inheritsLoose(subClass, superClass) {\n    subClass.prototype = Object.create(superClass.prototype);\n    subClass.prototype.constructor = subClass;\n    subClass.__proto__ = superClass;\n  }\n\n  /**\n   * --------------------------------------------------------------------------\n   * Bootstrap (v4.4.1): util.js\n   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n   * --------------------------------------------------------------------------\n   */\n  /**\n   * ------------------------------------------------------------------------\n   * Private TransitionEnd Helpers\n   * ------------------------------------------------------------------------\n   */\n\n  var TRANSITION_END = 'transitionend';\n  var MAX_UID = 1000000;\n  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)\n\n  function toType(obj) {\n    return {}.toString.call(obj).match(/\\s([a-z]+)/i)[1].toLowerCase();\n  }\n\n  function getSpecialTransitionEndEvent() {\n    return {\n      bindType: TRANSITION_END,\n      delegateType: TRANSITION_END,\n      handle: function handle(event) {\n        if ($(event.target).is(this)) {\n          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params\n        }\n\n        return undefined; // eslint-disable-line no-undefined\n      }\n    };\n  }\n\n  function transitionEndEmulator(duration) {\n    var _this = this;\n\n    var called = false;\n    $(this).one(Util.TRANSITION_END, function () {\n      called = true;\n    });\n    setTimeout(function () {\n      if (!called) {\n        Util.triggerTransitionEnd(_this);\n      }\n    }, duration);\n    return this;\n  }\n\n  function setTransitionEndSupport() {\n    $.fn.emulateTransitionEnd = transitionEndEmulator;\n    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();\n  }\n  /**\n   * --------------------------------------------------------------------------\n   * Public Util Api\n   * --------------------------------------------------------------------------\n   */\n\n\n  var Util = {\n    TRANSITION_END: 'bsTransitionEnd',\n    getUID: function getUID(prefix) {\n      do {\n        // eslint-disable-next-line no-bitwise\n        prefix += ~~(Math.random() * MAX_UID); // \"~~\" acts like a faster Math.floor() here\n      } while (document.getElementById(prefix));\n\n      return prefix;\n    },\n    getSelectorFromElement: function getSelectorFromElement(element) {\n      var selector = element.getAttribute('data-target');\n\n      if (!selector || selector === '#') {\n        var hrefAttr = element.getAttribute('href');\n        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';\n      }\n\n      try {\n        return document.querySelector(selector) ? selector : null;\n      } catch (err) {\n        return null;\n      }\n    },\n    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {\n      if (!element) {\n        return 0;\n      } // Get transition-duration of the element\n\n\n      var transitionDuration = $(element).css('transition-duration');\n      var transitionDelay = $(element).css('transition-delay');\n      var floatTransitionDuration = parseFloat(transitionDuration);\n      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found\n\n      if (!floatTransitionDuration && !floatTransitionDelay) {\n        return 0;\n      } // If multiple durations are defined, take the first\n\n\n      transitionDuration = transitionDuration.split(',')[0];\n      transitionDelay = transitionDelay.split(',')[0];\n      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;\n    },\n    reflow: function reflow(element) {\n      return element.offsetHeight;\n    },\n    triggerTransitionEnd: function triggerTransitionEnd(element) {\n      $(element).trigger(TRANSITION_END);\n    },\n    // TODO: Remove in v5\n    supportsTransitionEnd: function supportsTransitionEnd() {\n      return Boolean(TRANSITION_END);\n    },\n    isElement: function isElement(obj) {\n      return (obj[0] || obj).nodeType;\n    },\n    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {\n      for (var property in configTypes) {\n        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {\n          var expectedTypes = configTypes[property];\n          var value = config[property];\n          var valueType = value && Util.isElement(value) ? 'element' : toType(value);\n\n          if (!new RegExp(expectedTypes).test(valueType)) {\n            throw new Error(componentName.toUpperCase() + \": \" + (\"Option \\\"\" + property + \"\\\" provided type \\\"\" + valueType + \"\\\" \") + (\"but expected type \\\"\" + expectedTypes + \"\\\".\"));\n          }\n        }\n      }\n    },\n    findShadowRoot: function findShadowRoot(element) {\n      if (!document.documentElement.attachShadow) {\n        return null;\n      } // Can find the shadow root otherwise it'll return the document\n\n\n      if (typeof element.getRootNode === 'function') {\n        var root = element.getRootNode();\n        return root instanceof ShadowRoot ? root : null;\n      }\n\n      if (element instanceof ShadowRoot) {\n        return element;\n      } // when we don't find a shadow root\n\n\n      if (!element.parentNode) {\n        return null;\n      }\n\n      return Util.findShadowRoot(element.parentNode);\n    },\n    jQueryDetection: function jQueryDetection() {\n      if (typeof $ === 'undefined') {\n        throw new TypeError('Bootstrap\\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\\'s JavaScript.');\n      }\n\n      var version = $.fn.jquery.split(' ')[0].split('.');\n      var minMajor = 1;\n      var ltMajor = 2;\n      var minMinor = 9;\n      var minPatch = 1;\n      var maxMajor = 4;\n\n      if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {\n        throw new Error('Bootstrap\\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');\n      }\n    }\n  };\n  Util.jQueryDetection();\n  setTransitionEndSupport();\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME = 'alert';\n  var VERSION = '4.4.1';\n  var DATA_KEY = 'bs.alert';\n  var EVENT_KEY = \".\" + DATA_KEY;\n  var DATA_API_KEY = '.data-api';\n  var JQUERY_NO_CONFLICT = $.fn[NAME];\n  var Selector = {\n    DISMISS: '[data-dismiss=\"alert\"]'\n  };\n  var Event = {\n    CLOSE: \"close\" + EVENT_KEY,\n    CLOSED: \"closed\" + EVENT_KEY,\n    CLICK_DATA_API: \"click\" + EVENT_KEY + DATA_API_KEY\n  };\n  var ClassName = {\n    ALERT: 'alert',\n    FADE: 'fade',\n    SHOW: 'show'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Alert =\n  /*#__PURE__*/\n  function () {\n    function Alert(element) {\n      this._element = element;\n    } // Getters\n\n\n    var _proto = Alert.prototype;\n\n    // Public\n    _proto.close = function close(element) {\n      var rootElement = this._element;\n\n      if (element) {\n        rootElement = this._getRootElement(element);\n      }\n\n      var customEvent = this._triggerCloseEvent(rootElement);\n\n      if (customEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      this._removeElement(rootElement);\n    };\n\n    _proto.dispose = function dispose() {\n      $.removeData(this._element, DATA_KEY);\n      this._element = null;\n    } // Private\n    ;\n\n    _proto._getRootElement = function _getRootElement(element) {\n      var selector = Util.getSelectorFromElement(element);\n      var parent = false;\n\n      if (selector) {\n        parent = document.querySelector(selector);\n      }\n\n      if (!parent) {\n        parent = $(element).closest(\".\" + ClassName.ALERT)[0];\n      }\n\n      return parent;\n    };\n\n    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {\n      var closeEvent = $.Event(Event.CLOSE);\n      $(element).trigger(closeEvent);\n      return closeEvent;\n    };\n\n    _proto._removeElement = function _removeElement(element) {\n      var _this = this;\n\n      $(element).removeClass(ClassName.SHOW);\n\n      if (!$(element).hasClass(ClassName.FADE)) {\n        this._destroyElement(element);\n\n        return;\n      }\n\n      var transitionDuration = Util.getTransitionDurationFromElement(element);\n      $(element).one(Util.TRANSITION_END, function (event) {\n        return _this._destroyElement(element, event);\n      }).emulateTransitionEnd(transitionDuration);\n    };\n\n    _proto._destroyElement = function _destroyElement(element) {\n      $(element).detach().trigger(Event.CLOSED).remove();\n    } // Static\n    ;\n\n    Alert._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var $element = $(this);\n        var data = $element.data(DATA_KEY);\n\n        if (!data) {\n          data = new Alert(this);\n          $element.data(DATA_KEY, data);\n        }\n\n        if (config === 'close') {\n          data[config](this);\n        }\n      });\n    };\n\n    Alert._handleDismiss = function _handleDismiss(alertInstance) {\n      return function (event) {\n        if (event) {\n          event.preventDefault();\n        }\n\n        alertInstance.close(this);\n      };\n    };\n\n    _createClass(Alert, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION;\n      }\n    }]);\n\n    return Alert;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * Data Api implementation\n   * ------------------------------------------------------------------------\n   */\n\n\n  $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n  $.fn[NAME] = Alert._jQueryInterface;\n  $.fn[NAME].Constructor = Alert;\n\n  $.fn[NAME].noConflict = function () {\n    $.fn[NAME] = JQUERY_NO_CONFLICT;\n    return Alert._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$1 = 'button';\n  var VERSION$1 = '4.4.1';\n  var DATA_KEY$1 = 'bs.button';\n  var EVENT_KEY$1 = \".\" + DATA_KEY$1;\n  var DATA_API_KEY$1 = '.data-api';\n  var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];\n  var ClassName$1 = {\n    ACTIVE: 'active',\n    BUTTON: 'btn',\n    FOCUS: 'focus'\n  };\n  var Selector$1 = {\n    DATA_TOGGLE_CARROT: '[data-toggle^=\"button\"]',\n    DATA_TOGGLES: '[data-toggle=\"buttons\"]',\n    DATA_TOGGLE: '[data-toggle=\"button\"]',\n    DATA_TOGGLES_BUTTONS: '[data-toggle=\"buttons\"] .btn',\n    INPUT: 'input:not([type=\"hidden\"])',\n    ACTIVE: '.active',\n    BUTTON: '.btn'\n  };\n  var Event$1 = {\n    CLICK_DATA_API: \"click\" + EVENT_KEY$1 + DATA_API_KEY$1,\n    FOCUS_BLUR_DATA_API: \"focus\" + EVENT_KEY$1 + DATA_API_KEY$1 + \" \" + (\"blur\" + EVENT_KEY$1 + DATA_API_KEY$1),\n    LOAD_DATA_API: \"load\" + EVENT_KEY$1 + DATA_API_KEY$1\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Button =\n  /*#__PURE__*/\n  function () {\n    function Button(element) {\n      this._element = element;\n    } // Getters\n\n\n    var _proto = Button.prototype;\n\n    // Public\n    _proto.toggle = function toggle() {\n      var triggerChangeEvent = true;\n      var addAriaPressed = true;\n      var rootElement = $(this._element).closest(Selector$1.DATA_TOGGLES)[0];\n\n      if (rootElement) {\n        var input = this._element.querySelector(Selector$1.INPUT);\n\n        if (input) {\n          if (input.type === 'radio') {\n            if (input.checked && this._element.classList.contains(ClassName$1.ACTIVE)) {\n              triggerChangeEvent = false;\n            } else {\n              var activeElement = rootElement.querySelector(Selector$1.ACTIVE);\n\n              if (activeElement) {\n                $(activeElement).removeClass(ClassName$1.ACTIVE);\n              }\n            }\n          } else if (input.type === 'checkbox') {\n            if (this._element.tagName === 'LABEL' && input.checked === this._element.classList.contains(ClassName$1.ACTIVE)) {\n              triggerChangeEvent = false;\n            }\n          } else {\n            // if it's not a radio button or checkbox don't add a pointless/invalid checked property to the input\n            triggerChangeEvent = false;\n          }\n\n          if (triggerChangeEvent) {\n            input.checked = !this._element.classList.contains(ClassName$1.ACTIVE);\n            $(input).trigger('change');\n          }\n\n          input.focus();\n          addAriaPressed = false;\n        }\n      }\n\n      if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {\n        if (addAriaPressed) {\n          this._element.setAttribute('aria-pressed', !this._element.classList.contains(ClassName$1.ACTIVE));\n        }\n\n        if (triggerChangeEvent) {\n          $(this._element).toggleClass(ClassName$1.ACTIVE);\n        }\n      }\n    };\n\n    _proto.dispose = function dispose() {\n      $.removeData(this._element, DATA_KEY$1);\n      this._element = null;\n    } // Static\n    ;\n\n    Button._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var data = $(this).data(DATA_KEY$1);\n\n        if (!data) {\n          data = new Button(this);\n          $(this).data(DATA_KEY$1, data);\n        }\n\n        if (config === 'toggle') {\n          data[config]();\n        }\n      });\n    };\n\n    _createClass(Button, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$1;\n      }\n    }]);\n\n    return Button;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * Data Api implementation\n   * ------------------------------------------------------------------------\n   */\n\n\n  $(document).on(Event$1.CLICK_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {\n    var button = event.target;\n\n    if (!$(button).hasClass(ClassName$1.BUTTON)) {\n      button = $(button).closest(Selector$1.BUTTON)[0];\n    }\n\n    if (!button || button.hasAttribute('disabled') || button.classList.contains('disabled')) {\n      event.preventDefault(); // work around Firefox bug #1540995\n    } else {\n      var inputBtn = button.querySelector(Selector$1.INPUT);\n\n      if (inputBtn && (inputBtn.hasAttribute('disabled') || inputBtn.classList.contains('disabled'))) {\n        event.preventDefault(); // work around Firefox bug #1540995\n\n        return;\n      }\n\n      Button._jQueryInterface.call($(button), 'toggle');\n    }\n  }).on(Event$1.FOCUS_BLUR_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {\n    var button = $(event.target).closest(Selector$1.BUTTON)[0];\n    $(button).toggleClass(ClassName$1.FOCUS, /^focus(in)?$/.test(event.type));\n  });\n  $(window).on(Event$1.LOAD_DATA_API, function () {\n    // ensure correct active class is set to match the controls' actual values/states\n    // find all checkboxes/readio buttons inside data-toggle groups\n    var buttons = [].slice.call(document.querySelectorAll(Selector$1.DATA_TOGGLES_BUTTONS));\n\n    for (var i = 0, len = buttons.length; i < len; i++) {\n      var button = buttons[i];\n      var input = button.querySelector(Selector$1.INPUT);\n\n      if (input.checked || input.hasAttribute('checked')) {\n        button.classList.add(ClassName$1.ACTIVE);\n      } else {\n        button.classList.remove(ClassName$1.ACTIVE);\n      }\n    } // find all button toggles\n\n\n    buttons = [].slice.call(document.querySelectorAll(Selector$1.DATA_TOGGLE));\n\n    for (var _i = 0, _len = buttons.length; _i < _len; _i++) {\n      var _button = buttons[_i];\n\n      if (_button.getAttribute('aria-pressed') === 'true') {\n        _button.classList.add(ClassName$1.ACTIVE);\n      } else {\n        _button.classList.remove(ClassName$1.ACTIVE);\n      }\n    }\n  });\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n  $.fn[NAME$1] = Button._jQueryInterface;\n  $.fn[NAME$1].Constructor = Button;\n\n  $.fn[NAME$1].noConflict = function () {\n    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;\n    return Button._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$2 = 'carousel';\n  var VERSION$2 = '4.4.1';\n  var DATA_KEY$2 = 'bs.carousel';\n  var EVENT_KEY$2 = \".\" + DATA_KEY$2;\n  var DATA_API_KEY$2 = '.data-api';\n  var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];\n  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key\n\n  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key\n\n  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch\n\n  var SWIPE_THRESHOLD = 40;\n  var Default = {\n    interval: 5000,\n    keyboard: true,\n    slide: false,\n    pause: 'hover',\n    wrap: true,\n    touch: true\n  };\n  var DefaultType = {\n    interval: '(number|boolean)',\n    keyboard: 'boolean',\n    slide: '(boolean|string)',\n    pause: '(string|boolean)',\n    wrap: 'boolean',\n    touch: 'boolean'\n  };\n  var Direction = {\n    NEXT: 'next',\n    PREV: 'prev',\n    LEFT: 'left',\n    RIGHT: 'right'\n  };\n  var Event$2 = {\n    SLIDE: \"slide\" + EVENT_KEY$2,\n    SLID: \"slid\" + EVENT_KEY$2,\n    KEYDOWN: \"keydown\" + EVENT_KEY$2,\n    MOUSEENTER: \"mouseenter\" + EVENT_KEY$2,\n    MOUSELEAVE: \"mouseleave\" + EVENT_KEY$2,\n    TOUCHSTART: \"touchstart\" + EVENT_KEY$2,\n    TOUCHMOVE: \"touchmove\" + EVENT_KEY$2,\n    TOUCHEND: \"touchend\" + EVENT_KEY$2,\n    POINTERDOWN: \"pointerdown\" + EVENT_KEY$2,\n    POINTERUP: \"pointerup\" + EVENT_KEY$2,\n    DRAG_START: \"dragstart\" + EVENT_KEY$2,\n    LOAD_DATA_API: \"load\" + EVENT_KEY$2 + DATA_API_KEY$2,\n    CLICK_DATA_API: \"click\" + EVENT_KEY$2 + DATA_API_KEY$2\n  };\n  var ClassName$2 = {\n    CAROUSEL: 'carousel',\n    ACTIVE: 'active',\n    SLIDE: 'slide',\n    RIGHT: 'carousel-item-right',\n    LEFT: 'carousel-item-left',\n    NEXT: 'carousel-item-next',\n    PREV: 'carousel-item-prev',\n    ITEM: 'carousel-item',\n    POINTER_EVENT: 'pointer-event'\n  };\n  var Selector$2 = {\n    ACTIVE: '.active',\n    ACTIVE_ITEM: '.active.carousel-item',\n    ITEM: '.carousel-item',\n    ITEM_IMG: '.carousel-item img',\n    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',\n    INDICATORS: '.carousel-indicators',\n    DATA_SLIDE: '[data-slide], [data-slide-to]',\n    DATA_RIDE: '[data-ride=\"carousel\"]'\n  };\n  var PointerType = {\n    TOUCH: 'touch',\n    PEN: 'pen'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Carousel =\n  /*#__PURE__*/\n  function () {\n    function Carousel(element, config) {\n      this._items = null;\n      this._interval = null;\n      this._activeElement = null;\n      this._isPaused = false;\n      this._isSliding = false;\n      this.touchTimeout = null;\n      this.touchStartX = 0;\n      this.touchDeltaX = 0;\n      this._config = this._getConfig(config);\n      this._element = element;\n      this._indicatorsElement = this._element.querySelector(Selector$2.INDICATORS);\n      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;\n      this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);\n\n      this._addEventListeners();\n    } // Getters\n\n\n    var _proto = Carousel.prototype;\n\n    // Public\n    _proto.next = function next() {\n      if (!this._isSliding) {\n        this._slide(Direction.NEXT);\n      }\n    };\n\n    _proto.nextWhenVisible = function nextWhenVisible() {\n      // Don't call next when the page isn't visible\n      // or the carousel or its parent isn't visible\n      if (!document.hidden && $(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden') {\n        this.next();\n      }\n    };\n\n    _proto.prev = function prev() {\n      if (!this._isSliding) {\n        this._slide(Direction.PREV);\n      }\n    };\n\n    _proto.pause = function pause(event) {\n      if (!event) {\n        this._isPaused = true;\n      }\n\n      if (this._element.querySelector(Selector$2.NEXT_PREV)) {\n        Util.triggerTransitionEnd(this._element);\n        this.cycle(true);\n      }\n\n      clearInterval(this._interval);\n      this._interval = null;\n    };\n\n    _proto.cycle = function cycle(event) {\n      if (!event) {\n        this._isPaused = false;\n      }\n\n      if (this._interval) {\n        clearInterval(this._interval);\n        this._interval = null;\n      }\n\n      if (this._config.interval && !this._isPaused) {\n        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);\n      }\n    };\n\n    _proto.to = function to(index) {\n      var _this = this;\n\n      this._activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);\n\n      var activeIndex = this._getItemIndex(this._activeElement);\n\n      if (index > this._items.length - 1 || index < 0) {\n        return;\n      }\n\n      if (this._isSliding) {\n        $(this._element).one(Event$2.SLID, function () {\n          return _this.to(index);\n        });\n        return;\n      }\n\n      if (activeIndex === index) {\n        this.pause();\n        this.cycle();\n        return;\n      }\n\n      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;\n\n      this._slide(direction, this._items[index]);\n    };\n\n    _proto.dispose = function dispose() {\n      $(this._element).off(EVENT_KEY$2);\n      $.removeData(this._element, DATA_KEY$2);\n      this._items = null;\n      this._config = null;\n      this._element = null;\n      this._interval = null;\n      this._isPaused = null;\n      this._isSliding = null;\n      this._activeElement = null;\n      this._indicatorsElement = null;\n    } // Private\n    ;\n\n    _proto._getConfig = function _getConfig(config) {\n      config = _objectSpread2({}, Default, {}, config);\n      Util.typeCheckConfig(NAME$2, config, DefaultType);\n      return config;\n    };\n\n    _proto._handleSwipe = function _handleSwipe() {\n      var absDeltax = Math.abs(this.touchDeltaX);\n\n      if (absDeltax <= SWIPE_THRESHOLD) {\n        return;\n      }\n\n      var direction = absDeltax / this.touchDeltaX;\n      this.touchDeltaX = 0; // swipe left\n\n      if (direction > 0) {\n        this.prev();\n      } // swipe right\n\n\n      if (direction < 0) {\n        this.next();\n      }\n    };\n\n    _proto._addEventListeners = function _addEventListeners() {\n      var _this2 = this;\n\n      if (this._config.keyboard) {\n        $(this._element).on(Event$2.KEYDOWN, function (event) {\n          return _this2._keydown(event);\n        });\n      }\n\n      if (this._config.pause === 'hover') {\n        $(this._element).on(Event$2.MOUSEENTER, function (event) {\n          return _this2.pause(event);\n        }).on(Event$2.MOUSELEAVE, function (event) {\n          return _this2.cycle(event);\n        });\n      }\n\n      if (this._config.touch) {\n        this._addTouchEventListeners();\n      }\n    };\n\n    _proto._addTouchEventListeners = function _addTouchEventListeners() {\n      var _this3 = this;\n\n      if (!this._touchSupported) {\n        return;\n      }\n\n      var start = function start(event) {\n        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {\n          _this3.touchStartX = event.originalEvent.clientX;\n        } else if (!_this3._pointerEvent) {\n          _this3.touchStartX = event.originalEvent.touches[0].clientX;\n        }\n      };\n\n      var move = function move(event) {\n        // ensure swiping with one touch and not pinching\n        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {\n          _this3.touchDeltaX = 0;\n        } else {\n          _this3.touchDeltaX = event.originalEvent.touches[0].clientX - _this3.touchStartX;\n        }\n      };\n\n      var end = function end(event) {\n        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {\n          _this3.touchDeltaX = event.originalEvent.clientX - _this3.touchStartX;\n        }\n\n        _this3._handleSwipe();\n\n        if (_this3._config.pause === 'hover') {\n          // If it's a touch-enabled device, mouseenter/leave are fired as\n          // part of the mouse compatibility events on first tap - the carousel\n          // would stop cycling until user tapped out of it;\n          // here, we listen for touchend, explicitly pause the carousel\n          // (as if it's the second time we tap on it, mouseenter compat event\n          // is NOT fired) and after a timeout (to allow for mouse compatibility\n          // events to fire) we explicitly restart cycling\n          _this3.pause();\n\n          if (_this3.touchTimeout) {\n            clearTimeout(_this3.touchTimeout);\n          }\n\n          _this3.touchTimeout = setTimeout(function (event) {\n            return _this3.cycle(event);\n          }, TOUCHEVENT_COMPAT_WAIT + _this3._config.interval);\n        }\n      };\n\n      $(this._element.querySelectorAll(Selector$2.ITEM_IMG)).on(Event$2.DRAG_START, function (e) {\n        return e.preventDefault();\n      });\n\n      if (this._pointerEvent) {\n        $(this._element).on(Event$2.POINTERDOWN, function (event) {\n          return start(event);\n        });\n        $(this._element).on(Event$2.POINTERUP, function (event) {\n          return end(event);\n        });\n\n        this._element.classList.add(ClassName$2.POINTER_EVENT);\n      } else {\n        $(this._element).on(Event$2.TOUCHSTART, function (event) {\n          return start(event);\n        });\n        $(this._element).on(Event$2.TOUCHMOVE, function (event) {\n          return move(event);\n        });\n        $(this._element).on(Event$2.TOUCHEND, function (event) {\n          return end(event);\n        });\n      }\n    };\n\n    _proto._keydown = function _keydown(event) {\n      if (/input|textarea/i.test(event.target.tagName)) {\n        return;\n      }\n\n      switch (event.which) {\n        case ARROW_LEFT_KEYCODE:\n          event.preventDefault();\n          this.prev();\n          break;\n\n        case ARROW_RIGHT_KEYCODE:\n          event.preventDefault();\n          this.next();\n          break;\n      }\n    };\n\n    _proto._getItemIndex = function _getItemIndex(element) {\n      this._items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(Selector$2.ITEM)) : [];\n      return this._items.indexOf(element);\n    };\n\n    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {\n      var isNextDirection = direction === Direction.NEXT;\n      var isPrevDirection = direction === Direction.PREV;\n\n      var activeIndex = this._getItemIndex(activeElement);\n\n      var lastItemIndex = this._items.length - 1;\n      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;\n\n      if (isGoingToWrap && !this._config.wrap) {\n        return activeElement;\n      }\n\n      var delta = direction === Direction.PREV ? -1 : 1;\n      var itemIndex = (activeIndex + delta) % this._items.length;\n      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];\n    };\n\n    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {\n      var targetIndex = this._getItemIndex(relatedTarget);\n\n      var fromIndex = this._getItemIndex(this._element.querySelector(Selector$2.ACTIVE_ITEM));\n\n      var slideEvent = $.Event(Event$2.SLIDE, {\n        relatedTarget: relatedTarget,\n        direction: eventDirectionName,\n        from: fromIndex,\n        to: targetIndex\n      });\n      $(this._element).trigger(slideEvent);\n      return slideEvent;\n    };\n\n    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {\n      if (this._indicatorsElement) {\n        var indicators = [].slice.call(this._indicatorsElement.querySelectorAll(Selector$2.ACTIVE));\n        $(indicators).removeClass(ClassName$2.ACTIVE);\n\n        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];\n\n        if (nextIndicator) {\n          $(nextIndicator).addClass(ClassName$2.ACTIVE);\n        }\n      }\n    };\n\n    _proto._slide = function _slide(direction, element) {\n      var _this4 = this;\n\n      var activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);\n\n      var activeElementIndex = this._getItemIndex(activeElement);\n\n      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);\n\n      var nextElementIndex = this._getItemIndex(nextElement);\n\n      var isCycling = Boolean(this._interval);\n      var directionalClassName;\n      var orderClassName;\n      var eventDirectionName;\n\n      if (direction === Direction.NEXT) {\n        directionalClassName = ClassName$2.LEFT;\n        orderClassName = ClassName$2.NEXT;\n        eventDirectionName = Direction.LEFT;\n      } else {\n        directionalClassName = ClassName$2.RIGHT;\n        orderClassName = ClassName$2.PREV;\n        eventDirectionName = Direction.RIGHT;\n      }\n\n      if (nextElement && $(nextElement).hasClass(ClassName$2.ACTIVE)) {\n        this._isSliding = false;\n        return;\n      }\n\n      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);\n\n      if (slideEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      if (!activeElement || !nextElement) {\n        // Some weirdness is happening, so we bail\n        return;\n      }\n\n      this._isSliding = true;\n\n      if (isCycling) {\n        this.pause();\n      }\n\n      this._setActiveIndicatorElement(nextElement);\n\n      var slidEvent = $.Event(Event$2.SLID, {\n        relatedTarget: nextElement,\n        direction: eventDirectionName,\n        from: activeElementIndex,\n        to: nextElementIndex\n      });\n\n      if ($(this._element).hasClass(ClassName$2.SLIDE)) {\n        $(nextElement).addClass(orderClassName);\n        Util.reflow(nextElement);\n        $(activeElement).addClass(directionalClassName);\n        $(nextElement).addClass(directionalClassName);\n        var nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);\n\n        if (nextElementInterval) {\n          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;\n          this._config.interval = nextElementInterval;\n        } else {\n          this._config.interval = this._config.defaultInterval || this._config.interval;\n        }\n\n        var transitionDuration = Util.getTransitionDurationFromElement(activeElement);\n        $(activeElement).one(Util.TRANSITION_END, function () {\n          $(nextElement).removeClass(directionalClassName + \" \" + orderClassName).addClass(ClassName$2.ACTIVE);\n          $(activeElement).removeClass(ClassName$2.ACTIVE + \" \" + orderClassName + \" \" + directionalClassName);\n          _this4._isSliding = false;\n          setTimeout(function () {\n            return $(_this4._element).trigger(slidEvent);\n          }, 0);\n        }).emulateTransitionEnd(transitionDuration);\n      } else {\n        $(activeElement).removeClass(ClassName$2.ACTIVE);\n        $(nextElement).addClass(ClassName$2.ACTIVE);\n        this._isSliding = false;\n        $(this._element).trigger(slidEvent);\n      }\n\n      if (isCycling) {\n        this.cycle();\n      }\n    } // Static\n    ;\n\n    Carousel._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var data = $(this).data(DATA_KEY$2);\n\n        var _config = _objectSpread2({}, Default, {}, $(this).data());\n\n        if (typeof config === 'object') {\n          _config = _objectSpread2({}, _config, {}, config);\n        }\n\n        var action = typeof config === 'string' ? config : _config.slide;\n\n        if (!data) {\n          data = new Carousel(this, _config);\n          $(this).data(DATA_KEY$2, data);\n        }\n\n        if (typeof config === 'number') {\n          data.to(config);\n        } else if (typeof action === 'string') {\n          if (typeof data[action] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + action + \"\\\"\");\n          }\n\n          data[action]();\n        } else if (_config.interval && _config.ride) {\n          data.pause();\n          data.cycle();\n        }\n      });\n    };\n\n    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {\n      var selector = Util.getSelectorFromElement(this);\n\n      if (!selector) {\n        return;\n      }\n\n      var target = $(selector)[0];\n\n      if (!target || !$(target).hasClass(ClassName$2.CAROUSEL)) {\n        return;\n      }\n\n      var config = _objectSpread2({}, $(target).data(), {}, $(this).data());\n\n      var slideIndex = this.getAttribute('data-slide-to');\n\n      if (slideIndex) {\n        config.interval = false;\n      }\n\n      Carousel._jQueryInterface.call($(target), config);\n\n      if (slideIndex) {\n        $(target).data(DATA_KEY$2).to(slideIndex);\n      }\n\n      event.preventDefault();\n    };\n\n    _createClass(Carousel, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$2;\n      }\n    }, {\n      key: \"Default\",\n      get: function get() {\n        return Default;\n      }\n    }]);\n\n    return Carousel;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * Data Api implementation\n   * ------------------------------------------------------------------------\n   */\n\n\n  $(document).on(Event$2.CLICK_DATA_API, Selector$2.DATA_SLIDE, Carousel._dataApiClickHandler);\n  $(window).on(Event$2.LOAD_DATA_API, function () {\n    var carousels = [].slice.call(document.querySelectorAll(Selector$2.DATA_RIDE));\n\n    for (var i = 0, len = carousels.length; i < len; i++) {\n      var $carousel = $(carousels[i]);\n\n      Carousel._jQueryInterface.call($carousel, $carousel.data());\n    }\n  });\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n  $.fn[NAME$2] = Carousel._jQueryInterface;\n  $.fn[NAME$2].Constructor = Carousel;\n\n  $.fn[NAME$2].noConflict = function () {\n    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;\n    return Carousel._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$3 = 'collapse';\n  var VERSION$3 = '4.4.1';\n  var DATA_KEY$3 = 'bs.collapse';\n  var EVENT_KEY$3 = \".\" + DATA_KEY$3;\n  var DATA_API_KEY$3 = '.data-api';\n  var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];\n  var Default$1 = {\n    toggle: true,\n    parent: ''\n  };\n  var DefaultType$1 = {\n    toggle: 'boolean',\n    parent: '(string|element)'\n  };\n  var Event$3 = {\n    SHOW: \"show\" + EVENT_KEY$3,\n    SHOWN: \"shown\" + EVENT_KEY$3,\n    HIDE: \"hide\" + EVENT_KEY$3,\n    HIDDEN: \"hidden\" + EVENT_KEY$3,\n    CLICK_DATA_API: \"click\" + EVENT_KEY$3 + DATA_API_KEY$3\n  };\n  var ClassName$3 = {\n    SHOW: 'show',\n    COLLAPSE: 'collapse',\n    COLLAPSING: 'collapsing',\n    COLLAPSED: 'collapsed'\n  };\n  var Dimension = {\n    WIDTH: 'width',\n    HEIGHT: 'height'\n  };\n  var Selector$3 = {\n    ACTIVES: '.show, .collapsing',\n    DATA_TOGGLE: '[data-toggle=\"collapse\"]'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Collapse =\n  /*#__PURE__*/\n  function () {\n    function Collapse(element, config) {\n      this._isTransitioning = false;\n      this._element = element;\n      this._config = this._getConfig(config);\n      this._triggerArray = [].slice.call(document.querySelectorAll(\"[data-toggle=\\\"collapse\\\"][href=\\\"#\" + element.id + \"\\\"],\" + (\"[data-toggle=\\\"collapse\\\"][data-target=\\\"#\" + element.id + \"\\\"]\")));\n      var toggleList = [].slice.call(document.querySelectorAll(Selector$3.DATA_TOGGLE));\n\n      for (var i = 0, len = toggleList.length; i < len; i++) {\n        var elem = toggleList[i];\n        var selector = Util.getSelectorFromElement(elem);\n        var filterElement = [].slice.call(document.querySelectorAll(selector)).filter(function (foundElem) {\n          return foundElem === element;\n        });\n\n        if (selector !== null && filterElement.length > 0) {\n          this._selector = selector;\n\n          this._triggerArray.push(elem);\n        }\n      }\n\n      this._parent = this._config.parent ? this._getParent() : null;\n\n      if (!this._config.parent) {\n        this._addAriaAndCollapsedClass(this._element, this._triggerArray);\n      }\n\n      if (this._config.toggle) {\n        this.toggle();\n      }\n    } // Getters\n\n\n    var _proto = Collapse.prototype;\n\n    // Public\n    _proto.toggle = function toggle() {\n      if ($(this._element).hasClass(ClassName$3.SHOW)) {\n        this.hide();\n      } else {\n        this.show();\n      }\n    };\n\n    _proto.show = function show() {\n      var _this = this;\n\n      if (this._isTransitioning || $(this._element).hasClass(ClassName$3.SHOW)) {\n        return;\n      }\n\n      var actives;\n      var activesData;\n\n      if (this._parent) {\n        actives = [].slice.call(this._parent.querySelectorAll(Selector$3.ACTIVES)).filter(function (elem) {\n          if (typeof _this._config.parent === 'string') {\n            return elem.getAttribute('data-parent') === _this._config.parent;\n          }\n\n          return elem.classList.contains(ClassName$3.COLLAPSE);\n        });\n\n        if (actives.length === 0) {\n          actives = null;\n        }\n      }\n\n      if (actives) {\n        activesData = $(actives).not(this._selector).data(DATA_KEY$3);\n\n        if (activesData && activesData._isTransitioning) {\n          return;\n        }\n      }\n\n      var startEvent = $.Event(Event$3.SHOW);\n      $(this._element).trigger(startEvent);\n\n      if (startEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      if (actives) {\n        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');\n\n        if (!activesData) {\n          $(actives).data(DATA_KEY$3, null);\n        }\n      }\n\n      var dimension = this._getDimension();\n\n      $(this._element).removeClass(ClassName$3.COLLAPSE).addClass(ClassName$3.COLLAPSING);\n      this._element.style[dimension] = 0;\n\n      if (this._triggerArray.length) {\n        $(this._triggerArray).removeClass(ClassName$3.COLLAPSED).attr('aria-expanded', true);\n      }\n\n      this.setTransitioning(true);\n\n      var complete = function complete() {\n        $(_this._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).addClass(ClassName$3.SHOW);\n        _this._element.style[dimension] = '';\n\n        _this.setTransitioning(false);\n\n        $(_this._element).trigger(Event$3.SHOWN);\n      };\n\n      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);\n      var scrollSize = \"scroll\" + capitalizedDimension;\n      var transitionDuration = Util.getTransitionDurationFromElement(this._element);\n      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);\n      this._element.style[dimension] = this._element[scrollSize] + \"px\";\n    };\n\n    _proto.hide = function hide() {\n      var _this2 = this;\n\n      if (this._isTransitioning || !$(this._element).hasClass(ClassName$3.SHOW)) {\n        return;\n      }\n\n      var startEvent = $.Event(Event$3.HIDE);\n      $(this._element).trigger(startEvent);\n\n      if (startEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      var dimension = this._getDimension();\n\n      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + \"px\";\n      Util.reflow(this._element);\n      $(this._element).addClass(ClassName$3.COLLAPSING).removeClass(ClassName$3.COLLAPSE).removeClass(ClassName$3.SHOW);\n      var triggerArrayLength = this._triggerArray.length;\n\n      if (triggerArrayLength > 0) {\n        for (var i = 0; i < triggerArrayLength; i++) {\n          var trigger = this._triggerArray[i];\n          var selector = Util.getSelectorFromElement(trigger);\n\n          if (selector !== null) {\n            var $elem = $([].slice.call(document.querySelectorAll(selector)));\n\n            if (!$elem.hasClass(ClassName$3.SHOW)) {\n              $(trigger).addClass(ClassName$3.COLLAPSED).attr('aria-expanded', false);\n            }\n          }\n        }\n      }\n\n      this.setTransitioning(true);\n\n      var complete = function complete() {\n        _this2.setTransitioning(false);\n\n        $(_this2._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).trigger(Event$3.HIDDEN);\n      };\n\n      this._element.style[dimension] = '';\n      var transitionDuration = Util.getTransitionDurationFromElement(this._element);\n      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);\n    };\n\n    _proto.setTransitioning = function setTransitioning(isTransitioning) {\n      this._isTransitioning = isTransitioning;\n    };\n\n    _proto.dispose = function dispose() {\n      $.removeData(this._element, DATA_KEY$3);\n      this._config = null;\n      this._parent = null;\n      this._element = null;\n      this._triggerArray = null;\n      this._isTransitioning = null;\n    } // Private\n    ;\n\n    _proto._getConfig = function _getConfig(config) {\n      config = _objectSpread2({}, Default$1, {}, config);\n      config.toggle = Boolean(config.toggle); // Coerce string values\n\n      Util.typeCheckConfig(NAME$3, config, DefaultType$1);\n      return config;\n    };\n\n    _proto._getDimension = function _getDimension() {\n      var hasWidth = $(this._element).hasClass(Dimension.WIDTH);\n      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;\n    };\n\n    _proto._getParent = function _getParent() {\n      var _this3 = this;\n\n      var parent;\n\n      if (Util.isElement(this._config.parent)) {\n        parent = this._config.parent; // It's a jQuery object\n\n        if (typeof this._config.parent.jquery !== 'undefined') {\n          parent = this._config.parent[0];\n        }\n      } else {\n        parent = document.querySelector(this._config.parent);\n      }\n\n      var selector = \"[data-toggle=\\\"collapse\\\"][data-parent=\\\"\" + this._config.parent + \"\\\"]\";\n      var children = [].slice.call(parent.querySelectorAll(selector));\n      $(children).each(function (i, element) {\n        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);\n      });\n      return parent;\n    };\n\n    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {\n      var isOpen = $(element).hasClass(ClassName$3.SHOW);\n\n      if (triggerArray.length) {\n        $(triggerArray).toggleClass(ClassName$3.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);\n      }\n    } // Static\n    ;\n\n    Collapse._getTargetFromElement = function _getTargetFromElement(element) {\n      var selector = Util.getSelectorFromElement(element);\n      return selector ? document.querySelector(selector) : null;\n    };\n\n    Collapse._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var $this = $(this);\n        var data = $this.data(DATA_KEY$3);\n\n        var _config = _objectSpread2({}, Default$1, {}, $this.data(), {}, typeof config === 'object' && config ? config : {});\n\n        if (!data && _config.toggle && /show|hide/.test(config)) {\n          _config.toggle = false;\n        }\n\n        if (!data) {\n          data = new Collapse(this, _config);\n          $this.data(DATA_KEY$3, data);\n        }\n\n        if (typeof config === 'string') {\n          if (typeof data[config] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n          }\n\n          data[config]();\n        }\n      });\n    };\n\n    _createClass(Collapse, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$3;\n      }\n    }, {\n      key: \"Default\",\n      get: function get() {\n        return Default$1;\n      }\n    }]);\n\n    return Collapse;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * Data Api implementation\n   * ------------------------------------------------------------------------\n   */\n\n\n  $(document).on(Event$3.CLICK_DATA_API, Selector$3.DATA_TOGGLE, function (event) {\n    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element\n    if (event.currentTarget.tagName === 'A') {\n      event.preventDefault();\n    }\n\n    var $trigger = $(this);\n    var selector = Util.getSelectorFromElement(this);\n    var selectors = [].slice.call(document.querySelectorAll(selector));\n    $(selectors).each(function () {\n      var $target = $(this);\n      var data = $target.data(DATA_KEY$3);\n      var config = data ? 'toggle' : $trigger.data();\n\n      Collapse._jQueryInterface.call($target, config);\n    });\n  });\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n  $.fn[NAME$3] = Collapse._jQueryInterface;\n  $.fn[NAME$3].Constructor = Collapse;\n\n  $.fn[NAME$3].noConflict = function () {\n    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;\n    return Collapse._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$4 = 'dropdown';\n  var VERSION$4 = '4.4.1';\n  var DATA_KEY$4 = 'bs.dropdown';\n  var EVENT_KEY$4 = \".\" + DATA_KEY$4;\n  var DATA_API_KEY$4 = '.data-api';\n  var JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];\n  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key\n\n  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key\n\n  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key\n\n  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key\n\n  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key\n\n  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)\n\n  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + \"|\" + ARROW_DOWN_KEYCODE + \"|\" + ESCAPE_KEYCODE);\n  var Event$4 = {\n    HIDE: \"hide\" + EVENT_KEY$4,\n    HIDDEN: \"hidden\" + EVENT_KEY$4,\n    SHOW: \"show\" + EVENT_KEY$4,\n    SHOWN: \"shown\" + EVENT_KEY$4,\n    CLICK: \"click\" + EVENT_KEY$4,\n    CLICK_DATA_API: \"click\" + EVENT_KEY$4 + DATA_API_KEY$4,\n    KEYDOWN_DATA_API: \"keydown\" + EVENT_KEY$4 + DATA_API_KEY$4,\n    KEYUP_DATA_API: \"keyup\" + EVENT_KEY$4 + DATA_API_KEY$4\n  };\n  var ClassName$4 = {\n    DISABLED: 'disabled',\n    SHOW: 'show',\n    DROPUP: 'dropup',\n    DROPRIGHT: 'dropright',\n    DROPLEFT: 'dropleft',\n    MENURIGHT: 'dropdown-menu-right',\n    MENULEFT: 'dropdown-menu-left',\n    POSITION_STATIC: 'position-static'\n  };\n  var Selector$4 = {\n    DATA_TOGGLE: '[data-toggle=\"dropdown\"]',\n    FORM_CHILD: '.dropdown form',\n    MENU: '.dropdown-menu',\n    NAVBAR_NAV: '.navbar-nav',\n    VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'\n  };\n  var AttachmentMap = {\n    TOP: 'top-start',\n    TOPEND: 'top-end',\n    BOTTOM: 'bottom-start',\n    BOTTOMEND: 'bottom-end',\n    RIGHT: 'right-start',\n    RIGHTEND: 'right-end',\n    LEFT: 'left-start',\n    LEFTEND: 'left-end'\n  };\n  var Default$2 = {\n    offset: 0,\n    flip: true,\n    boundary: 'scrollParent',\n    reference: 'toggle',\n    display: 'dynamic',\n    popperConfig: null\n  };\n  var DefaultType$2 = {\n    offset: '(number|string|function)',\n    flip: 'boolean',\n    boundary: '(string|element)',\n    reference: '(string|element)',\n    display: 'string',\n    popperConfig: '(null|object)'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Dropdown =\n  /*#__PURE__*/\n  function () {\n    function Dropdown(element, config) {\n      this._element = element;\n      this._popper = null;\n      this._config = this._getConfig(config);\n      this._menu = this._getMenuElement();\n      this._inNavbar = this._detectNavbar();\n\n      this._addEventListeners();\n    } // Getters\n\n\n    var _proto = Dropdown.prototype;\n\n    // Public\n    _proto.toggle = function toggle() {\n      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED)) {\n        return;\n      }\n\n      var isActive = $(this._menu).hasClass(ClassName$4.SHOW);\n\n      Dropdown._clearMenus();\n\n      if (isActive) {\n        return;\n      }\n\n      this.show(true);\n    };\n\n    _proto.show = function show(usePopper) {\n      if (usePopper === void 0) {\n        usePopper = false;\n      }\n\n      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || $(this._menu).hasClass(ClassName$4.SHOW)) {\n        return;\n      }\n\n      var relatedTarget = {\n        relatedTarget: this._element\n      };\n      var showEvent = $.Event(Event$4.SHOW, relatedTarget);\n\n      var parent = Dropdown._getParentFromElement(this._element);\n\n      $(parent).trigger(showEvent);\n\n      if (showEvent.isDefaultPrevented()) {\n        return;\n      } // Disable totally Popper.js for Dropdown in Navbar\n\n\n      if (!this._inNavbar && usePopper) {\n        /**\n         * Check for Popper dependency\n         * Popper - https://popper.js.org\n         */\n        if (typeof Popper === 'undefined') {\n          throw new TypeError('Bootstrap\\'s dropdowns require Popper.js (https://popper.js.org/)');\n        }\n\n        var referenceElement = this._element;\n\n        if (this._config.reference === 'parent') {\n          referenceElement = parent;\n        } else if (Util.isElement(this._config.reference)) {\n          referenceElement = this._config.reference; // Check if it's jQuery element\n\n          if (typeof this._config.reference.jquery !== 'undefined') {\n            referenceElement = this._config.reference[0];\n          }\n        } // If boundary is not `scrollParent`, then set position to `static`\n        // to allow the menu to \"escape\" the scroll parent's boundaries\n        // https://github.com/twbs/bootstrap/issues/24251\n\n\n        if (this._config.boundary !== 'scrollParent') {\n          $(parent).addClass(ClassName$4.POSITION_STATIC);\n        }\n\n        this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());\n      } // If this is a touch-enabled device we add extra\n      // empty mouseover listeners to the body's immediate children;\n      // only needed because of broken event delegation on iOS\n      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html\n\n\n      if ('ontouchstart' in document.documentElement && $(parent).closest(Selector$4.NAVBAR_NAV).length === 0) {\n        $(document.body).children().on('mouseover', null, $.noop);\n      }\n\n      this._element.focus();\n\n      this._element.setAttribute('aria-expanded', true);\n\n      $(this._menu).toggleClass(ClassName$4.SHOW);\n      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));\n    };\n\n    _proto.hide = function hide() {\n      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || !$(this._menu).hasClass(ClassName$4.SHOW)) {\n        return;\n      }\n\n      var relatedTarget = {\n        relatedTarget: this._element\n      };\n      var hideEvent = $.Event(Event$4.HIDE, relatedTarget);\n\n      var parent = Dropdown._getParentFromElement(this._element);\n\n      $(parent).trigger(hideEvent);\n\n      if (hideEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      if (this._popper) {\n        this._popper.destroy();\n      }\n\n      $(this._menu).toggleClass(ClassName$4.SHOW);\n      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));\n    };\n\n    _proto.dispose = function dispose() {\n      $.removeData(this._element, DATA_KEY$4);\n      $(this._element).off(EVENT_KEY$4);\n      this._element = null;\n      this._menu = null;\n\n      if (this._popper !== null) {\n        this._popper.destroy();\n\n        this._popper = null;\n      }\n    };\n\n    _proto.update = function update() {\n      this._inNavbar = this._detectNavbar();\n\n      if (this._popper !== null) {\n        this._popper.scheduleUpdate();\n      }\n    } // Private\n    ;\n\n    _proto._addEventListeners = function _addEventListeners() {\n      var _this = this;\n\n      $(this._element).on(Event$4.CLICK, function (event) {\n        event.preventDefault();\n        event.stopPropagation();\n\n        _this.toggle();\n      });\n    };\n\n    _proto._getConfig = function _getConfig(config) {\n      config = _objectSpread2({}, this.constructor.Default, {}, $(this._element).data(), {}, config);\n      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);\n      return config;\n    };\n\n    _proto._getMenuElement = function _getMenuElement() {\n      if (!this._menu) {\n        var parent = Dropdown._getParentFromElement(this._element);\n\n        if (parent) {\n          this._menu = parent.querySelector(Selector$4.MENU);\n        }\n      }\n\n      return this._menu;\n    };\n\n    _proto._getPlacement = function _getPlacement() {\n      var $parentDropdown = $(this._element.parentNode);\n      var placement = AttachmentMap.BOTTOM; // Handle dropup\n\n      if ($parentDropdown.hasClass(ClassName$4.DROPUP)) {\n        placement = AttachmentMap.TOP;\n\n        if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {\n          placement = AttachmentMap.TOPEND;\n        }\n      } else if ($parentDropdown.hasClass(ClassName$4.DROPRIGHT)) {\n        placement = AttachmentMap.RIGHT;\n      } else if ($parentDropdown.hasClass(ClassName$4.DROPLEFT)) {\n        placement = AttachmentMap.LEFT;\n      } else if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {\n        placement = AttachmentMap.BOTTOMEND;\n      }\n\n      return placement;\n    };\n\n    _proto._detectNavbar = function _detectNavbar() {\n      return $(this._element).closest('.navbar').length > 0;\n    };\n\n    _proto._getOffset = function _getOffset() {\n      var _this2 = this;\n\n      var offset = {};\n\n      if (typeof this._config.offset === 'function') {\n        offset.fn = function (data) {\n          data.offsets = _objectSpread2({}, data.offsets, {}, _this2._config.offset(data.offsets, _this2._element) || {});\n          return data;\n        };\n      } else {\n        offset.offset = this._config.offset;\n      }\n\n      return offset;\n    };\n\n    _proto._getPopperConfig = function _getPopperConfig() {\n      var popperConfig = {\n        placement: this._getPlacement(),\n        modifiers: {\n          offset: this._getOffset(),\n          flip: {\n            enabled: this._config.flip\n          },\n          preventOverflow: {\n            boundariesElement: this._config.boundary\n          }\n        }\n      }; // Disable Popper.js if we have a static display\n\n      if (this._config.display === 'static') {\n        popperConfig.modifiers.applyStyle = {\n          enabled: false\n        };\n      }\n\n      return _objectSpread2({}, popperConfig, {}, this._config.popperConfig);\n    } // Static\n    ;\n\n    Dropdown._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var data = $(this).data(DATA_KEY$4);\n\n        var _config = typeof config === 'object' ? config : null;\n\n        if (!data) {\n          data = new Dropdown(this, _config);\n          $(this).data(DATA_KEY$4, data);\n        }\n\n        if (typeof config === 'string') {\n          if (typeof data[config] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n          }\n\n          data[config]();\n        }\n      });\n    };\n\n    Dropdown._clearMenus = function _clearMenus(event) {\n      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {\n        return;\n      }\n\n      var toggles = [].slice.call(document.querySelectorAll(Selector$4.DATA_TOGGLE));\n\n      for (var i = 0, len = toggles.length; i < len; i++) {\n        var parent = Dropdown._getParentFromElement(toggles[i]);\n\n        var context = $(toggles[i]).data(DATA_KEY$4);\n        var relatedTarget = {\n          relatedTarget: toggles[i]\n        };\n\n        if (event && event.type === 'click') {\n          relatedTarget.clickEvent = event;\n        }\n\n        if (!context) {\n          continue;\n        }\n\n        var dropdownMenu = context._menu;\n\n        if (!$(parent).hasClass(ClassName$4.SHOW)) {\n          continue;\n        }\n\n        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {\n          continue;\n        }\n\n        var hideEvent = $.Event(Event$4.HIDE, relatedTarget);\n        $(parent).trigger(hideEvent);\n\n        if (hideEvent.isDefaultPrevented()) {\n          continue;\n        } // If this is a touch-enabled device we remove the extra\n        // empty mouseover listeners we added for iOS support\n\n\n        if ('ontouchstart' in document.documentElement) {\n          $(document.body).children().off('mouseover', null, $.noop);\n        }\n\n        toggles[i].setAttribute('aria-expanded', 'false');\n\n        if (context._popper) {\n          context._popper.destroy();\n        }\n\n        $(dropdownMenu).removeClass(ClassName$4.SHOW);\n        $(parent).removeClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));\n      }\n    };\n\n    Dropdown._getParentFromElement = function _getParentFromElement(element) {\n      var parent;\n      var selector = Util.getSelectorFromElement(element);\n\n      if (selector) {\n        parent = document.querySelector(selector);\n      }\n\n      return parent || element.parentNode;\n    } // eslint-disable-next-line complexity\n    ;\n\n    Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {\n      // If not input/textarea:\n      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command\n      // If input/textarea:\n      //  - If space key => not a dropdown command\n      //  - If key is other than escape\n      //    - If key is not up or down => not a dropdown command\n      //    - If trigger inside the menu => not a dropdown command\n      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $(event.target).closest(Selector$4.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {\n        return;\n      }\n\n      event.preventDefault();\n      event.stopPropagation();\n\n      if (this.disabled || $(this).hasClass(ClassName$4.DISABLED)) {\n        return;\n      }\n\n      var parent = Dropdown._getParentFromElement(this);\n\n      var isActive = $(parent).hasClass(ClassName$4.SHOW);\n\n      if (!isActive && event.which === ESCAPE_KEYCODE) {\n        return;\n      }\n\n      if (!isActive || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {\n        if (event.which === ESCAPE_KEYCODE) {\n          var toggle = parent.querySelector(Selector$4.DATA_TOGGLE);\n          $(toggle).trigger('focus');\n        }\n\n        $(this).trigger('click');\n        return;\n      }\n\n      var items = [].slice.call(parent.querySelectorAll(Selector$4.VISIBLE_ITEMS)).filter(function (item) {\n        return $(item).is(':visible');\n      });\n\n      if (items.length === 0) {\n        return;\n      }\n\n      var index = items.indexOf(event.target);\n\n      if (event.which === ARROW_UP_KEYCODE && index > 0) {\n        // Up\n        index--;\n      }\n\n      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {\n        // Down\n        index++;\n      }\n\n      if (index < 0) {\n        index = 0;\n      }\n\n      items[index].focus();\n    };\n\n    _createClass(Dropdown, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$4;\n      }\n    }, {\n      key: \"Default\",\n      get: function get() {\n        return Default$2;\n      }\n    }, {\n      key: \"DefaultType\",\n      get: function get() {\n        return DefaultType$2;\n      }\n    }]);\n\n    return Dropdown;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * Data Api implementation\n   * ------------------------------------------------------------------------\n   */\n\n\n  $(document).on(Event$4.KEYDOWN_DATA_API, Selector$4.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event$4.KEYDOWN_DATA_API, Selector$4.MENU, Dropdown._dataApiKeydownHandler).on(Event$4.CLICK_DATA_API + \" \" + Event$4.KEYUP_DATA_API, Dropdown._clearMenus).on(Event$4.CLICK_DATA_API, Selector$4.DATA_TOGGLE, function (event) {\n    event.preventDefault();\n    event.stopPropagation();\n\n    Dropdown._jQueryInterface.call($(this), 'toggle');\n  }).on(Event$4.CLICK_DATA_API, Selector$4.FORM_CHILD, function (e) {\n    e.stopPropagation();\n  });\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n  $.fn[NAME$4] = Dropdown._jQueryInterface;\n  $.fn[NAME$4].Constructor = Dropdown;\n\n  $.fn[NAME$4].noConflict = function () {\n    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;\n    return Dropdown._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$5 = 'modal';\n  var VERSION$5 = '4.4.1';\n  var DATA_KEY$5 = 'bs.modal';\n  var EVENT_KEY$5 = \".\" + DATA_KEY$5;\n  var DATA_API_KEY$5 = '.data-api';\n  var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];\n  var ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key\n\n  var Default$3 = {\n    backdrop: true,\n    keyboard: true,\n    focus: true,\n    show: true\n  };\n  var DefaultType$3 = {\n    backdrop: '(boolean|string)',\n    keyboard: 'boolean',\n    focus: 'boolean',\n    show: 'boolean'\n  };\n  var Event$5 = {\n    HIDE: \"hide\" + EVENT_KEY$5,\n    HIDE_PREVENTED: \"hidePrevented\" + EVENT_KEY$5,\n    HIDDEN: \"hidden\" + EVENT_KEY$5,\n    SHOW: \"show\" + EVENT_KEY$5,\n    SHOWN: \"shown\" + EVENT_KEY$5,\n    FOCUSIN: \"focusin\" + EVENT_KEY$5,\n    RESIZE: \"resize\" + EVENT_KEY$5,\n    CLICK_DISMISS: \"click.dismiss\" + EVENT_KEY$5,\n    KEYDOWN_DISMISS: \"keydown.dismiss\" + EVENT_KEY$5,\n    MOUSEUP_DISMISS: \"mouseup.dismiss\" + EVENT_KEY$5,\n    MOUSEDOWN_DISMISS: \"mousedown.dismiss\" + EVENT_KEY$5,\n    CLICK_DATA_API: \"click\" + EVENT_KEY$5 + DATA_API_KEY$5\n  };\n  var ClassName$5 = {\n    SCROLLABLE: 'modal-dialog-scrollable',\n    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',\n    BACKDROP: 'modal-backdrop',\n    OPEN: 'modal-open',\n    FADE: 'fade',\n    SHOW: 'show',\n    STATIC: 'modal-static'\n  };\n  var Selector$5 = {\n    DIALOG: '.modal-dialog',\n    MODAL_BODY: '.modal-body',\n    DATA_TOGGLE: '[data-toggle=\"modal\"]',\n    DATA_DISMISS: '[data-dismiss=\"modal\"]',\n    FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',\n    STICKY_CONTENT: '.sticky-top'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Modal =\n  /*#__PURE__*/\n  function () {\n    function Modal(element, config) {\n      this._config = this._getConfig(config);\n      this._element = element;\n      this._dialog = element.querySelector(Selector$5.DIALOG);\n      this._backdrop = null;\n      this._isShown = false;\n      this._isBodyOverflowing = false;\n      this._ignoreBackdropClick = false;\n      this._isTransitioning = false;\n      this._scrollbarWidth = 0;\n    } // Getters\n\n\n    var _proto = Modal.prototype;\n\n    // Public\n    _proto.toggle = function toggle(relatedTarget) {\n      return this._isShown ? this.hide() : this.show(relatedTarget);\n    };\n\n    _proto.show = function show(relatedTarget) {\n      var _this = this;\n\n      if (this._isShown || this._isTransitioning) {\n        return;\n      }\n\n      if ($(this._element).hasClass(ClassName$5.FADE)) {\n        this._isTransitioning = true;\n      }\n\n      var showEvent = $.Event(Event$5.SHOW, {\n        relatedTarget: relatedTarget\n      });\n      $(this._element).trigger(showEvent);\n\n      if (this._isShown || showEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      this._isShown = true;\n\n      this._checkScrollbar();\n\n      this._setScrollbar();\n\n      this._adjustDialog();\n\n      this._setEscapeEvent();\n\n      this._setResizeEvent();\n\n      $(this._element).on(Event$5.CLICK_DISMISS, Selector$5.DATA_DISMISS, function (event) {\n        return _this.hide(event);\n      });\n      $(this._dialog).on(Event$5.MOUSEDOWN_DISMISS, function () {\n        $(_this._element).one(Event$5.MOUSEUP_DISMISS, function (event) {\n          if ($(event.target).is(_this._element)) {\n            _this._ignoreBackdropClick = true;\n          }\n        });\n      });\n\n      this._showBackdrop(function () {\n        return _this._showElement(relatedTarget);\n      });\n    };\n\n    _proto.hide = function hide(event) {\n      var _this2 = this;\n\n      if (event) {\n        event.preventDefault();\n      }\n\n      if (!this._isShown || this._isTransitioning) {\n        return;\n      }\n\n      var hideEvent = $.Event(Event$5.HIDE);\n      $(this._element).trigger(hideEvent);\n\n      if (!this._isShown || hideEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      this._isShown = false;\n      var transition = $(this._element).hasClass(ClassName$5.FADE);\n\n      if (transition) {\n        this._isTransitioning = true;\n      }\n\n      this._setEscapeEvent();\n\n      this._setResizeEvent();\n\n      $(document).off(Event$5.FOCUSIN);\n      $(this._element).removeClass(ClassName$5.SHOW);\n      $(this._element).off(Event$5.CLICK_DISMISS);\n      $(this._dialog).off(Event$5.MOUSEDOWN_DISMISS);\n\n      if (transition) {\n        var transitionDuration = Util.getTransitionDurationFromElement(this._element);\n        $(this._element).one(Util.TRANSITION_END, function (event) {\n          return _this2._hideModal(event);\n        }).emulateTransitionEnd(transitionDuration);\n      } else {\n        this._hideModal();\n      }\n    };\n\n    _proto.dispose = function dispose() {\n      [window, this._element, this._dialog].forEach(function (htmlElement) {\n        return $(htmlElement).off(EVENT_KEY$5);\n      });\n      /**\n       * `document` has 2 events `Event.FOCUSIN` and `Event.CLICK_DATA_API`\n       * Do not move `document` in `htmlElements` array\n       * It will remove `Event.CLICK_DATA_API` event that should remain\n       */\n\n      $(document).off(Event$5.FOCUSIN);\n      $.removeData(this._element, DATA_KEY$5);\n      this._config = null;\n      this._element = null;\n      this._dialog = null;\n      this._backdrop = null;\n      this._isShown = null;\n      this._isBodyOverflowing = null;\n      this._ignoreBackdropClick = null;\n      this._isTransitioning = null;\n      this._scrollbarWidth = null;\n    };\n\n    _proto.handleUpdate = function handleUpdate() {\n      this._adjustDialog();\n    } // Private\n    ;\n\n    _proto._getConfig = function _getConfig(config) {\n      config = _objectSpread2({}, Default$3, {}, config);\n      Util.typeCheckConfig(NAME$5, config, DefaultType$3);\n      return config;\n    };\n\n    _proto._triggerBackdropTransition = function _triggerBackdropTransition() {\n      var _this3 = this;\n\n      if (this._config.backdrop === 'static') {\n        var hideEventPrevented = $.Event(Event$5.HIDE_PREVENTED);\n        $(this._element).trigger(hideEventPrevented);\n\n        if (hideEventPrevented.defaultPrevented) {\n          return;\n        }\n\n        this._element.classList.add(ClassName$5.STATIC);\n\n        var modalTransitionDuration = Util.getTransitionDurationFromElement(this._element);\n        $(this._element).one(Util.TRANSITION_END, function () {\n          _this3._element.classList.remove(ClassName$5.STATIC);\n        }).emulateTransitionEnd(modalTransitionDuration);\n\n        this._element.focus();\n      } else {\n        this.hide();\n      }\n    };\n\n    _proto._showElement = function _showElement(relatedTarget) {\n      var _this4 = this;\n\n      var transition = $(this._element).hasClass(ClassName$5.FADE);\n      var modalBody = this._dialog ? this._dialog.querySelector(Selector$5.MODAL_BODY) : null;\n\n      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {\n        // Don't move modal's DOM position\n        document.body.appendChild(this._element);\n      }\n\n      this._element.style.display = 'block';\n\n      this._element.removeAttribute('aria-hidden');\n\n      this._element.setAttribute('aria-modal', true);\n\n      if ($(this._dialog).hasClass(ClassName$5.SCROLLABLE) && modalBody) {\n        modalBody.scrollTop = 0;\n      } else {\n        this._element.scrollTop = 0;\n      }\n\n      if (transition) {\n        Util.reflow(this._element);\n      }\n\n      $(this._element).addClass(ClassName$5.SHOW);\n\n      if (this._config.focus) {\n        this._enforceFocus();\n      }\n\n      var shownEvent = $.Event(Event$5.SHOWN, {\n        relatedTarget: relatedTarget\n      });\n\n      var transitionComplete = function transitionComplete() {\n        if (_this4._config.focus) {\n          _this4._element.focus();\n        }\n\n        _this4._isTransitioning = false;\n        $(_this4._element).trigger(shownEvent);\n      };\n\n      if (transition) {\n        var transitionDuration = Util.getTransitionDurationFromElement(this._dialog);\n        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);\n      } else {\n        transitionComplete();\n      }\n    };\n\n    _proto._enforceFocus = function _enforceFocus() {\n      var _this5 = this;\n\n      $(document).off(Event$5.FOCUSIN) // Guard against infinite focus loop\n      .on(Event$5.FOCUSIN, function (event) {\n        if (document !== event.target && _this5._element !== event.target && $(_this5._element).has(event.target).length === 0) {\n          _this5._element.focus();\n        }\n      });\n    };\n\n    _proto._setEscapeEvent = function _setEscapeEvent() {\n      var _this6 = this;\n\n      if (this._isShown && this._config.keyboard) {\n        $(this._element).on(Event$5.KEYDOWN_DISMISS, function (event) {\n          if (event.which === ESCAPE_KEYCODE$1) {\n            _this6._triggerBackdropTransition();\n          }\n        });\n      } else if (!this._isShown) {\n        $(this._element).off(Event$5.KEYDOWN_DISMISS);\n      }\n    };\n\n    _proto._setResizeEvent = function _setResizeEvent() {\n      var _this7 = this;\n\n      if (this._isShown) {\n        $(window).on(Event$5.RESIZE, function (event) {\n          return _this7.handleUpdate(event);\n        });\n      } else {\n        $(window).off(Event$5.RESIZE);\n      }\n    };\n\n    _proto._hideModal = function _hideModal() {\n      var _this8 = this;\n\n      this._element.style.display = 'none';\n\n      this._element.setAttribute('aria-hidden', true);\n\n      this._element.removeAttribute('aria-modal');\n\n      this._isTransitioning = false;\n\n      this._showBackdrop(function () {\n        $(document.body).removeClass(ClassName$5.OPEN);\n\n        _this8._resetAdjustments();\n\n        _this8._resetScrollbar();\n\n        $(_this8._element).trigger(Event$5.HIDDEN);\n      });\n    };\n\n    _proto._removeBackdrop = function _removeBackdrop() {\n      if (this._backdrop) {\n        $(this._backdrop).remove();\n        this._backdrop = null;\n      }\n    };\n\n    _proto._showBackdrop = function _showBackdrop(callback) {\n      var _this9 = this;\n\n      var animate = $(this._element).hasClass(ClassName$5.FADE) ? ClassName$5.FADE : '';\n\n      if (this._isShown && this._config.backdrop) {\n        this._backdrop = document.createElement('div');\n        this._backdrop.className = ClassName$5.BACKDROP;\n\n        if (animate) {\n          this._backdrop.classList.add(animate);\n        }\n\n        $(this._backdrop).appendTo(document.body);\n        $(this._element).on(Event$5.CLICK_DISMISS, function (event) {\n          if (_this9._ignoreBackdropClick) {\n            _this9._ignoreBackdropClick = false;\n            return;\n          }\n\n          if (event.target !== event.currentTarget) {\n            return;\n          }\n\n          _this9._triggerBackdropTransition();\n        });\n\n        if (animate) {\n          Util.reflow(this._backdrop);\n        }\n\n        $(this._backdrop).addClass(ClassName$5.SHOW);\n\n        if (!callback) {\n          return;\n        }\n\n        if (!animate) {\n          callback();\n          return;\n        }\n\n        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);\n        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);\n      } else if (!this._isShown && this._backdrop) {\n        $(this._backdrop).removeClass(ClassName$5.SHOW);\n\n        var callbackRemove = function callbackRemove() {\n          _this9._removeBackdrop();\n\n          if (callback) {\n            callback();\n          }\n        };\n\n        if ($(this._element).hasClass(ClassName$5.FADE)) {\n          var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);\n\n          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);\n        } else {\n          callbackRemove();\n        }\n      } else if (callback) {\n        callback();\n      }\n    } // ----------------------------------------------------------------------\n    // the following methods are used to handle overflowing modals\n    // todo (fat): these should probably be refactored out of modal.js\n    // ----------------------------------------------------------------------\n    ;\n\n    _proto._adjustDialog = function _adjustDialog() {\n      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;\n\n      if (!this._isBodyOverflowing && isModalOverflowing) {\n        this._element.style.paddingLeft = this._scrollbarWidth + \"px\";\n      }\n\n      if (this._isBodyOverflowing && !isModalOverflowing) {\n        this._element.style.paddingRight = this._scrollbarWidth + \"px\";\n      }\n    };\n\n    _proto._resetAdjustments = function _resetAdjustments() {\n      this._element.style.paddingLeft = '';\n      this._element.style.paddingRight = '';\n    };\n\n    _proto._checkScrollbar = function _checkScrollbar() {\n      var rect = document.body.getBoundingClientRect();\n      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;\n      this._scrollbarWidth = this._getScrollbarWidth();\n    };\n\n    _proto._setScrollbar = function _setScrollbar() {\n      var _this10 = this;\n\n      if (this._isBodyOverflowing) {\n        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set\n        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set\n        var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));\n        var stickyContent = [].slice.call(document.querySelectorAll(Selector$5.STICKY_CONTENT)); // Adjust fixed content padding\n\n        $(fixedContent).each(function (index, element) {\n          var actualPadding = element.style.paddingRight;\n          var calculatedPadding = $(element).css('padding-right');\n          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this10._scrollbarWidth + \"px\");\n        }); // Adjust sticky content margin\n\n        $(stickyContent).each(function (index, element) {\n          var actualMargin = element.style.marginRight;\n          var calculatedMargin = $(element).css('margin-right');\n          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this10._scrollbarWidth + \"px\");\n        }); // Adjust body padding\n\n        var actualPadding = document.body.style.paddingRight;\n        var calculatedPadding = $(document.body).css('padding-right');\n        $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + \"px\");\n      }\n\n      $(document.body).addClass(ClassName$5.OPEN);\n    };\n\n    _proto._resetScrollbar = function _resetScrollbar() {\n      // Restore fixed content padding\n      var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));\n      $(fixedContent).each(function (index, element) {\n        var padding = $(element).data('padding-right');\n        $(element).removeData('padding-right');\n        element.style.paddingRight = padding ? padding : '';\n      }); // Restore sticky content\n\n      var elements = [].slice.call(document.querySelectorAll(\"\" + Selector$5.STICKY_CONTENT));\n      $(elements).each(function (index, element) {\n        var margin = $(element).data('margin-right');\n\n        if (typeof margin !== 'undefined') {\n          $(element).css('margin-right', margin).removeData('margin-right');\n        }\n      }); // Restore body padding\n\n      var padding = $(document.body).data('padding-right');\n      $(document.body).removeData('padding-right');\n      document.body.style.paddingRight = padding ? padding : '';\n    };\n\n    _proto._getScrollbarWidth = function _getScrollbarWidth() {\n      // thx d.walsh\n      var scrollDiv = document.createElement('div');\n      scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;\n      document.body.appendChild(scrollDiv);\n      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;\n      document.body.removeChild(scrollDiv);\n      return scrollbarWidth;\n    } // Static\n    ;\n\n    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {\n      return this.each(function () {\n        var data = $(this).data(DATA_KEY$5);\n\n        var _config = _objectSpread2({}, Default$3, {}, $(this).data(), {}, typeof config === 'object' && config ? config : {});\n\n        if (!data) {\n          data = new Modal(this, _config);\n          $(this).data(DATA_KEY$5, data);\n        }\n\n        if (typeof config === 'string') {\n          if (typeof data[config] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n          }\n\n          data[config](relatedTarget);\n        } else if (_config.show) {\n          data.show(relatedTarget);\n        }\n      });\n    };\n\n    _createClass(Modal, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$5;\n      }\n    }, {\n      key: \"Default\",\n      get: function get() {\n        return Default$3;\n      }\n    }]);\n\n    return Modal;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * Data Api implementation\n   * ------------------------------------------------------------------------\n   */\n\n\n  $(document).on(Event$5.CLICK_DATA_API, Selector$5.DATA_TOGGLE, function (event) {\n    var _this11 = this;\n\n    var target;\n    var selector = Util.getSelectorFromElement(this);\n\n    if (selector) {\n      target = document.querySelector(selector);\n    }\n\n    var config = $(target).data(DATA_KEY$5) ? 'toggle' : _objectSpread2({}, $(target).data(), {}, $(this).data());\n\n    if (this.tagName === 'A' || this.tagName === 'AREA') {\n      event.preventDefault();\n    }\n\n    var $target = $(target).one(Event$5.SHOW, function (showEvent) {\n      if (showEvent.isDefaultPrevented()) {\n        // Only register focus restorer if modal will actually get shown\n        return;\n      }\n\n      $target.one(Event$5.HIDDEN, function () {\n        if ($(_this11).is(':visible')) {\n          _this11.focus();\n        }\n      });\n    });\n\n    Modal._jQueryInterface.call($(target), config, this);\n  });\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n  $.fn[NAME$5] = Modal._jQueryInterface;\n  $.fn[NAME$5].Constructor = Modal;\n\n  $.fn[NAME$5].noConflict = function () {\n    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;\n    return Modal._jQueryInterface;\n  };\n\n  /**\n   * --------------------------------------------------------------------------\n   * Bootstrap (v4.4.1): tools/sanitizer.js\n   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n   * --------------------------------------------------------------------------\n   */\n  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];\n  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\\w-]*$/i;\n  var DefaultWhitelist = {\n    // Global attributes allowed on any supplied element below.\n    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],\n    a: ['target', 'href', 'title', 'rel'],\n    area: [],\n    b: [],\n    br: [],\n    col: [],\n    code: [],\n    div: [],\n    em: [],\n    hr: [],\n    h1: [],\n    h2: [],\n    h3: [],\n    h4: [],\n    h5: [],\n    h6: [],\n    i: [],\n    img: ['src', 'alt', 'title', 'width', 'height'],\n    li: [],\n    ol: [],\n    p: [],\n    pre: [],\n    s: [],\n    small: [],\n    span: [],\n    sub: [],\n    sup: [],\n    strong: [],\n    u: [],\n    ul: []\n  };\n  /**\n   * A pattern that recognizes a commonly useful subset of URLs that are safe.\n   *\n   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts\n   */\n\n  var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;\n  /**\n   * A pattern that matches safe data URLs. Only matches image, video and audio types.\n   *\n   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts\n   */\n\n  var DATA_URL_PATTERN = /^data:(?:image\\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\\/(?:mpeg|mp4|ogg|webm)|audio\\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;\n\n  function allowedAttribute(attr, allowedAttributeList) {\n    var attrName = attr.nodeName.toLowerCase();\n\n    if (allowedAttributeList.indexOf(attrName) !== -1) {\n      if (uriAttrs.indexOf(attrName) !== -1) {\n        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));\n      }\n\n      return true;\n    }\n\n    var regExp = allowedAttributeList.filter(function (attrRegex) {\n      return attrRegex instanceof RegExp;\n    }); // Check if a regular expression validates the attribute.\n\n    for (var i = 0, l = regExp.length; i < l; i++) {\n      if (attrName.match(regExp[i])) {\n        return true;\n      }\n    }\n\n    return false;\n  }\n\n  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {\n    if (unsafeHtml.length === 0) {\n      return unsafeHtml;\n    }\n\n    if (sanitizeFn && typeof sanitizeFn === 'function') {\n      return sanitizeFn(unsafeHtml);\n    }\n\n    var domParser = new window.DOMParser();\n    var createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');\n    var whitelistKeys = Object.keys(whiteList);\n    var elements = [].slice.call(createdDocument.body.querySelectorAll('*'));\n\n    var _loop = function _loop(i, len) {\n      var el = elements[i];\n      var elName = el.nodeName.toLowerCase();\n\n      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {\n        el.parentNode.removeChild(el);\n        return \"continue\";\n      }\n\n      var attributeList = [].slice.call(el.attributes);\n      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);\n      attributeList.forEach(function (attr) {\n        if (!allowedAttribute(attr, whitelistedAttributes)) {\n          el.removeAttribute(attr.nodeName);\n        }\n      });\n    };\n\n    for (var i = 0, len = elements.length; i < len; i++) {\n      var _ret = _loop(i);\n\n      if (_ret === \"continue\") continue;\n    }\n\n    return createdDocument.body.innerHTML;\n  }\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$6 = 'tooltip';\n  var VERSION$6 = '4.4.1';\n  var DATA_KEY$6 = 'bs.tooltip';\n  var EVENT_KEY$6 = \".\" + DATA_KEY$6;\n  var JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];\n  var CLASS_PREFIX = 'bs-tooltip';\n  var BSCLS_PREFIX_REGEX = new RegExp(\"(^|\\\\s)\" + CLASS_PREFIX + \"\\\\S+\", 'g');\n  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];\n  var DefaultType$4 = {\n    animation: 'boolean',\n    template: 'string',\n    title: '(string|element|function)',\n    trigger: 'string',\n    delay: '(number|object)',\n    html: 'boolean',\n    selector: '(string|boolean)',\n    placement: '(string|function)',\n    offset: '(number|string|function)',\n    container: '(string|element|boolean)',\n    fallbackPlacement: '(string|array)',\n    boundary: '(string|element)',\n    sanitize: 'boolean',\n    sanitizeFn: '(null|function)',\n    whiteList: 'object',\n    popperConfig: '(null|object)'\n  };\n  var AttachmentMap$1 = {\n    AUTO: 'auto',\n    TOP: 'top',\n    RIGHT: 'right',\n    BOTTOM: 'bottom',\n    LEFT: 'left'\n  };\n  var Default$4 = {\n    animation: true,\n    template: '<div class=\"tooltip\" role=\"tooltip\">' + '<div class=\"arrow\"></div>' + '<div class=\"tooltip-inner\"></div></div>',\n    trigger: 'hover focus',\n    title: '',\n    delay: 0,\n    html: false,\n    selector: false,\n    placement: 'top',\n    offset: 0,\n    container: false,\n    fallbackPlacement: 'flip',\n    boundary: 'scrollParent',\n    sanitize: true,\n    sanitizeFn: null,\n    whiteList: DefaultWhitelist,\n    popperConfig: null\n  };\n  var HoverState = {\n    SHOW: 'show',\n    OUT: 'out'\n  };\n  var Event$6 = {\n    HIDE: \"hide\" + EVENT_KEY$6,\n    HIDDEN: \"hidden\" + EVENT_KEY$6,\n    SHOW: \"show\" + EVENT_KEY$6,\n    SHOWN: \"shown\" + EVENT_KEY$6,\n    INSERTED: \"inserted\" + EVENT_KEY$6,\n    CLICK: \"click\" + EVENT_KEY$6,\n    FOCUSIN: \"focusin\" + EVENT_KEY$6,\n    FOCUSOUT: \"focusout\" + EVENT_KEY$6,\n    MOUSEENTER: \"mouseenter\" + EVENT_KEY$6,\n    MOUSELEAVE: \"mouseleave\" + EVENT_KEY$6\n  };\n  var ClassName$6 = {\n    FADE: 'fade',\n    SHOW: 'show'\n  };\n  var Selector$6 = {\n    TOOLTIP: '.tooltip',\n    TOOLTIP_INNER: '.tooltip-inner',\n    ARROW: '.arrow'\n  };\n  var Trigger = {\n    HOVER: 'hover',\n    FOCUS: 'focus',\n    CLICK: 'click',\n    MANUAL: 'manual'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Tooltip =\n  /*#__PURE__*/\n  function () {\n    function Tooltip(element, config) {\n      if (typeof Popper === 'undefined') {\n        throw new TypeError('Bootstrap\\'s tooltips require Popper.js (https://popper.js.org/)');\n      } // private\n\n\n      this._isEnabled = true;\n      this._timeout = 0;\n      this._hoverState = '';\n      this._activeTrigger = {};\n      this._popper = null; // Protected\n\n      this.element = element;\n      this.config = this._getConfig(config);\n      this.tip = null;\n\n      this._setListeners();\n    } // Getters\n\n\n    var _proto = Tooltip.prototype;\n\n    // Public\n    _proto.enable = function enable() {\n      this._isEnabled = true;\n    };\n\n    _proto.disable = function disable() {\n      this._isEnabled = false;\n    };\n\n    _proto.toggleEnabled = function toggleEnabled() {\n      this._isEnabled = !this._isEnabled;\n    };\n\n    _proto.toggle = function toggle(event) {\n      if (!this._isEnabled) {\n        return;\n      }\n\n      if (event) {\n        var dataKey = this.constructor.DATA_KEY;\n        var context = $(event.currentTarget).data(dataKey);\n\n        if (!context) {\n          context = new this.constructor(event.currentTarget, this._getDelegateConfig());\n          $(event.currentTarget).data(dataKey, context);\n        }\n\n        context._activeTrigger.click = !context._activeTrigger.click;\n\n        if (context._isWithActiveTrigger()) {\n          context._enter(null, context);\n        } else {\n          context._leave(null, context);\n        }\n      } else {\n        if ($(this.getTipElement()).hasClass(ClassName$6.SHOW)) {\n          this._leave(null, this);\n\n          return;\n        }\n\n        this._enter(null, this);\n      }\n    };\n\n    _proto.dispose = function dispose() {\n      clearTimeout(this._timeout);\n      $.removeData(this.element, this.constructor.DATA_KEY);\n      $(this.element).off(this.constructor.EVENT_KEY);\n      $(this.element).closest('.modal').off('hide.bs.modal', this._hideModalHandler);\n\n      if (this.tip) {\n        $(this.tip).remove();\n      }\n\n      this._isEnabled = null;\n      this._timeout = null;\n      this._hoverState = null;\n      this._activeTrigger = null;\n\n      if (this._popper) {\n        this._popper.destroy();\n      }\n\n      this._popper = null;\n      this.element = null;\n      this.config = null;\n      this.tip = null;\n    };\n\n    _proto.show = function show() {\n      var _this = this;\n\n      if ($(this.element).css('display') === 'none') {\n        throw new Error('Please use show on visible elements');\n      }\n\n      var showEvent = $.Event(this.constructor.Event.SHOW);\n\n      if (this.isWithContent() && this._isEnabled) {\n        $(this.element).trigger(showEvent);\n        var shadowRoot = Util.findShadowRoot(this.element);\n        var isInTheDom = $.contains(shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement, this.element);\n\n        if (showEvent.isDefaultPrevented() || !isInTheDom) {\n          return;\n        }\n\n        var tip = this.getTipElement();\n        var tipId = Util.getUID(this.constructor.NAME);\n        tip.setAttribute('id', tipId);\n        this.element.setAttribute('aria-describedby', tipId);\n        this.setContent();\n\n        if (this.config.animation) {\n          $(tip).addClass(ClassName$6.FADE);\n        }\n\n        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;\n\n        var attachment = this._getAttachment(placement);\n\n        this.addAttachmentClass(attachment);\n\n        var container = this._getContainer();\n\n        $(tip).data(this.constructor.DATA_KEY, this);\n\n        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {\n          $(tip).appendTo(container);\n        }\n\n        $(this.element).trigger(this.constructor.Event.INSERTED);\n        this._popper = new Popper(this.element, tip, this._getPopperConfig(attachment));\n        $(tip).addClass(ClassName$6.SHOW); // If this is a touch-enabled device we add extra\n        // empty mouseover listeners to the body's immediate children;\n        // only needed because of broken event delegation on iOS\n        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html\n\n        if ('ontouchstart' in document.documentElement) {\n          $(document.body).children().on('mouseover', null, $.noop);\n        }\n\n        var complete = function complete() {\n          if (_this.config.animation) {\n            _this._fixTransition();\n          }\n\n          var prevHoverState = _this._hoverState;\n          _this._hoverState = null;\n          $(_this.element).trigger(_this.constructor.Event.SHOWN);\n\n          if (prevHoverState === HoverState.OUT) {\n            _this._leave(null, _this);\n          }\n        };\n\n        if ($(this.tip).hasClass(ClassName$6.FADE)) {\n          var transitionDuration = Util.getTransitionDurationFromElement(this.tip);\n          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);\n        } else {\n          complete();\n        }\n      }\n    };\n\n    _proto.hide = function hide(callback) {\n      var _this2 = this;\n\n      var tip = this.getTipElement();\n      var hideEvent = $.Event(this.constructor.Event.HIDE);\n\n      var complete = function complete() {\n        if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {\n          tip.parentNode.removeChild(tip);\n        }\n\n        _this2._cleanTipClass();\n\n        _this2.element.removeAttribute('aria-describedby');\n\n        $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);\n\n        if (_this2._popper !== null) {\n          _this2._popper.destroy();\n        }\n\n        if (callback) {\n          callback();\n        }\n      };\n\n      $(this.element).trigger(hideEvent);\n\n      if (hideEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      $(tip).removeClass(ClassName$6.SHOW); // If this is a touch-enabled device we remove the extra\n      // empty mouseover listeners we added for iOS support\n\n      if ('ontouchstart' in document.documentElement) {\n        $(document.body).children().off('mouseover', null, $.noop);\n      }\n\n      this._activeTrigger[Trigger.CLICK] = false;\n      this._activeTrigger[Trigger.FOCUS] = false;\n      this._activeTrigger[Trigger.HOVER] = false;\n\n      if ($(this.tip).hasClass(ClassName$6.FADE)) {\n        var transitionDuration = Util.getTransitionDurationFromElement(tip);\n        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);\n      } else {\n        complete();\n      }\n\n      this._hoverState = '';\n    };\n\n    _proto.update = function update() {\n      if (this._popper !== null) {\n        this._popper.scheduleUpdate();\n      }\n    } // Protected\n    ;\n\n    _proto.isWithContent = function isWithContent() {\n      return Boolean(this.getTitle());\n    };\n\n    _proto.addAttachmentClass = function addAttachmentClass(attachment) {\n      $(this.getTipElement()).addClass(CLASS_PREFIX + \"-\" + attachment);\n    };\n\n    _proto.getTipElement = function getTipElement() {\n      this.tip = this.tip || $(this.config.template)[0];\n      return this.tip;\n    };\n\n    _proto.setContent = function setContent() {\n      var tip = this.getTipElement();\n      this.setElementContent($(tip.querySelectorAll(Selector$6.TOOLTIP_INNER)), this.getTitle());\n      $(tip).removeClass(ClassName$6.FADE + \" \" + ClassName$6.SHOW);\n    };\n\n    _proto.setElementContent = function setElementContent($element, content) {\n      if (typeof content === 'object' && (content.nodeType || content.jquery)) {\n        // Content is a DOM node or a jQuery\n        if (this.config.html) {\n          if (!$(content).parent().is($element)) {\n            $element.empty().append(content);\n          }\n        } else {\n          $element.text($(content).text());\n        }\n\n        return;\n      }\n\n      if (this.config.html) {\n        if (this.config.sanitize) {\n          content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);\n        }\n\n        $element.html(content);\n      } else {\n        $element.text(content);\n      }\n    };\n\n    _proto.getTitle = function getTitle() {\n      var title = this.element.getAttribute('data-original-title');\n\n      if (!title) {\n        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;\n      }\n\n      return title;\n    } // Private\n    ;\n\n    _proto._getPopperConfig = function _getPopperConfig(attachment) {\n      var _this3 = this;\n\n      var defaultBsConfig = {\n        placement: attachment,\n        modifiers: {\n          offset: this._getOffset(),\n          flip: {\n            behavior: this.config.fallbackPlacement\n          },\n          arrow: {\n            element: Selector$6.ARROW\n          },\n          preventOverflow: {\n            boundariesElement: this.config.boundary\n          }\n        },\n        onCreate: function onCreate(data) {\n          if (data.originalPlacement !== data.placement) {\n            _this3._handlePopperPlacementChange(data);\n          }\n        },\n        onUpdate: function onUpdate(data) {\n          return _this3._handlePopperPlacementChange(data);\n        }\n      };\n      return _objectSpread2({}, defaultBsConfig, {}, this.config.popperConfig);\n    };\n\n    _proto._getOffset = function _getOffset() {\n      var _this4 = this;\n\n      var offset = {};\n\n      if (typeof this.config.offset === 'function') {\n        offset.fn = function (data) {\n          data.offsets = _objectSpread2({}, data.offsets, {}, _this4.config.offset(data.offsets, _this4.element) || {});\n          return data;\n        };\n      } else {\n        offset.offset = this.config.offset;\n      }\n\n      return offset;\n    };\n\n    _proto._getContainer = function _getContainer() {\n      if (this.config.container === false) {\n        return document.body;\n      }\n\n      if (Util.isElement(this.config.container)) {\n        return $(this.config.container);\n      }\n\n      return $(document).find(this.config.container);\n    };\n\n    _proto._getAttachment = function _getAttachment(placement) {\n      return AttachmentMap$1[placement.toUpperCase()];\n    };\n\n    _proto._setListeners = function _setListeners() {\n      var _this5 = this;\n\n      var triggers = this.config.trigger.split(' ');\n      triggers.forEach(function (trigger) {\n        if (trigger === 'click') {\n          $(_this5.element).on(_this5.constructor.Event.CLICK, _this5.config.selector, function (event) {\n            return _this5.toggle(event);\n          });\n        } else if (trigger !== Trigger.MANUAL) {\n          var eventIn = trigger === Trigger.HOVER ? _this5.constructor.Event.MOUSEENTER : _this5.constructor.Event.FOCUSIN;\n          var eventOut = trigger === Trigger.HOVER ? _this5.constructor.Event.MOUSELEAVE : _this5.constructor.Event.FOCUSOUT;\n          $(_this5.element).on(eventIn, _this5.config.selector, function (event) {\n            return _this5._enter(event);\n          }).on(eventOut, _this5.config.selector, function (event) {\n            return _this5._leave(event);\n          });\n        }\n      });\n\n      this._hideModalHandler = function () {\n        if (_this5.element) {\n          _this5.hide();\n        }\n      };\n\n      $(this.element).closest('.modal').on('hide.bs.modal', this._hideModalHandler);\n\n      if (this.config.selector) {\n        this.config = _objectSpread2({}, this.config, {\n          trigger: 'manual',\n          selector: ''\n        });\n      } else {\n        this._fixTitle();\n      }\n    };\n\n    _proto._fixTitle = function _fixTitle() {\n      var titleType = typeof this.element.getAttribute('data-original-title');\n\n      if (this.element.getAttribute('title') || titleType !== 'string') {\n        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');\n        this.element.setAttribute('title', '');\n      }\n    };\n\n    _proto._enter = function _enter(event, context) {\n      var dataKey = this.constructor.DATA_KEY;\n      context = context || $(event.currentTarget).data(dataKey);\n\n      if (!context) {\n        context = new this.constructor(event.currentTarget, this._getDelegateConfig());\n        $(event.currentTarget).data(dataKey, context);\n      }\n\n      if (event) {\n        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;\n      }\n\n      if ($(context.getTipElement()).hasClass(ClassName$6.SHOW) || context._hoverState === HoverState.SHOW) {\n        context._hoverState = HoverState.SHOW;\n        return;\n      }\n\n      clearTimeout(context._timeout);\n      context._hoverState = HoverState.SHOW;\n\n      if (!context.config.delay || !context.config.delay.show) {\n        context.show();\n        return;\n      }\n\n      context._timeout = setTimeout(function () {\n        if (context._hoverState === HoverState.SHOW) {\n          context.show();\n        }\n      }, context.config.delay.show);\n    };\n\n    _proto._leave = function _leave(event, context) {\n      var dataKey = this.constructor.DATA_KEY;\n      context = context || $(event.currentTarget).data(dataKey);\n\n      if (!context) {\n        context = new this.constructor(event.currentTarget, this._getDelegateConfig());\n        $(event.currentTarget).data(dataKey, context);\n      }\n\n      if (event) {\n        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;\n      }\n\n      if (context._isWithActiveTrigger()) {\n        return;\n      }\n\n      clearTimeout(context._timeout);\n      context._hoverState = HoverState.OUT;\n\n      if (!context.config.delay || !context.config.delay.hide) {\n        context.hide();\n        return;\n      }\n\n      context._timeout = setTimeout(function () {\n        if (context._hoverState === HoverState.OUT) {\n          context.hide();\n        }\n      }, context.config.delay.hide);\n    };\n\n    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {\n      for (var trigger in this._activeTrigger) {\n        if (this._activeTrigger[trigger]) {\n          return true;\n        }\n      }\n\n      return false;\n    };\n\n    _proto._getConfig = function _getConfig(config) {\n      var dataAttributes = $(this.element).data();\n      Object.keys(dataAttributes).forEach(function (dataAttr) {\n        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {\n          delete dataAttributes[dataAttr];\n        }\n      });\n      config = _objectSpread2({}, this.constructor.Default, {}, dataAttributes, {}, typeof config === 'object' && config ? config : {});\n\n      if (typeof config.delay === 'number') {\n        config.delay = {\n          show: config.delay,\n          hide: config.delay\n        };\n      }\n\n      if (typeof config.title === 'number') {\n        config.title = config.title.toString();\n      }\n\n      if (typeof config.content === 'number') {\n        config.content = config.content.toString();\n      }\n\n      Util.typeCheckConfig(NAME$6, config, this.constructor.DefaultType);\n\n      if (config.sanitize) {\n        config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);\n      }\n\n      return config;\n    };\n\n    _proto._getDelegateConfig = function _getDelegateConfig() {\n      var config = {};\n\n      if (this.config) {\n        for (var key in this.config) {\n          if (this.constructor.Default[key] !== this.config[key]) {\n            config[key] = this.config[key];\n          }\n        }\n      }\n\n      return config;\n    };\n\n    _proto._cleanTipClass = function _cleanTipClass() {\n      var $tip = $(this.getTipElement());\n      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);\n\n      if (tabClass !== null && tabClass.length) {\n        $tip.removeClass(tabClass.join(''));\n      }\n    };\n\n    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(popperData) {\n      var popperInstance = popperData.instance;\n      this.tip = popperInstance.popper;\n\n      this._cleanTipClass();\n\n      this.addAttachmentClass(this._getAttachment(popperData.placement));\n    };\n\n    _proto._fixTransition = function _fixTransition() {\n      var tip = this.getTipElement();\n      var initConfigAnimation = this.config.animation;\n\n      if (tip.getAttribute('x-placement') !== null) {\n        return;\n      }\n\n      $(tip).removeClass(ClassName$6.FADE);\n      this.config.animation = false;\n      this.hide();\n      this.show();\n      this.config.animation = initConfigAnimation;\n    } // Static\n    ;\n\n    Tooltip._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var data = $(this).data(DATA_KEY$6);\n\n        var _config = typeof config === 'object' && config;\n\n        if (!data && /dispose|hide/.test(config)) {\n          return;\n        }\n\n        if (!data) {\n          data = new Tooltip(this, _config);\n          $(this).data(DATA_KEY$6, data);\n        }\n\n        if (typeof config === 'string') {\n          if (typeof data[config] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n          }\n\n          data[config]();\n        }\n      });\n    };\n\n    _createClass(Tooltip, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$6;\n      }\n    }, {\n      key: \"Default\",\n      get: function get() {\n        return Default$4;\n      }\n    }, {\n      key: \"NAME\",\n      get: function get() {\n        return NAME$6;\n      }\n    }, {\n      key: \"DATA_KEY\",\n      get: function get() {\n        return DATA_KEY$6;\n      }\n    }, {\n      key: \"Event\",\n      get: function get() {\n        return Event$6;\n      }\n    }, {\n      key: \"EVENT_KEY\",\n      get: function get() {\n        return EVENT_KEY$6;\n      }\n    }, {\n      key: \"DefaultType\",\n      get: function get() {\n        return DefaultType$4;\n      }\n    }]);\n\n    return Tooltip;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n\n  $.fn[NAME$6] = Tooltip._jQueryInterface;\n  $.fn[NAME$6].Constructor = Tooltip;\n\n  $.fn[NAME$6].noConflict = function () {\n    $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;\n    return Tooltip._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$7 = 'popover';\n  var VERSION$7 = '4.4.1';\n  var DATA_KEY$7 = 'bs.popover';\n  var EVENT_KEY$7 = \".\" + DATA_KEY$7;\n  var JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];\n  var CLASS_PREFIX$1 = 'bs-popover';\n  var BSCLS_PREFIX_REGEX$1 = new RegExp(\"(^|\\\\s)\" + CLASS_PREFIX$1 + \"\\\\S+\", 'g');\n\n  var Default$5 = _objectSpread2({}, Tooltip.Default, {\n    placement: 'right',\n    trigger: 'click',\n    content: '',\n    template: '<div class=\"popover\" role=\"tooltip\">' + '<div class=\"arrow\"></div>' + '<h3 class=\"popover-header\"></h3>' + '<div class=\"popover-body\"></div></div>'\n  });\n\n  var DefaultType$5 = _objectSpread2({}, Tooltip.DefaultType, {\n    content: '(string|element|function)'\n  });\n\n  var ClassName$7 = {\n    FADE: 'fade',\n    SHOW: 'show'\n  };\n  var Selector$7 = {\n    TITLE: '.popover-header',\n    CONTENT: '.popover-body'\n  };\n  var Event$7 = {\n    HIDE: \"hide\" + EVENT_KEY$7,\n    HIDDEN: \"hidden\" + EVENT_KEY$7,\n    SHOW: \"show\" + EVENT_KEY$7,\n    SHOWN: \"shown\" + EVENT_KEY$7,\n    INSERTED: \"inserted\" + EVENT_KEY$7,\n    CLICK: \"click\" + EVENT_KEY$7,\n    FOCUSIN: \"focusin\" + EVENT_KEY$7,\n    FOCUSOUT: \"focusout\" + EVENT_KEY$7,\n    MOUSEENTER: \"mouseenter\" + EVENT_KEY$7,\n    MOUSELEAVE: \"mouseleave\" + EVENT_KEY$7\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Popover =\n  /*#__PURE__*/\n  function (_Tooltip) {\n    _inheritsLoose(Popover, _Tooltip);\n\n    function Popover() {\n      return _Tooltip.apply(this, arguments) || this;\n    }\n\n    var _proto = Popover.prototype;\n\n    // Overrides\n    _proto.isWithContent = function isWithContent() {\n      return this.getTitle() || this._getContent();\n    };\n\n    _proto.addAttachmentClass = function addAttachmentClass(attachment) {\n      $(this.getTipElement()).addClass(CLASS_PREFIX$1 + \"-\" + attachment);\n    };\n\n    _proto.getTipElement = function getTipElement() {\n      this.tip = this.tip || $(this.config.template)[0];\n      return this.tip;\n    };\n\n    _proto.setContent = function setContent() {\n      var $tip = $(this.getTipElement()); // We use append for html objects to maintain js events\n\n      this.setElementContent($tip.find(Selector$7.TITLE), this.getTitle());\n\n      var content = this._getContent();\n\n      if (typeof content === 'function') {\n        content = content.call(this.element);\n      }\n\n      this.setElementContent($tip.find(Selector$7.CONTENT), content);\n      $tip.removeClass(ClassName$7.FADE + \" \" + ClassName$7.SHOW);\n    } // Private\n    ;\n\n    _proto._getContent = function _getContent() {\n      return this.element.getAttribute('data-content') || this.config.content;\n    };\n\n    _proto._cleanTipClass = function _cleanTipClass() {\n      var $tip = $(this.getTipElement());\n      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);\n\n      if (tabClass !== null && tabClass.length > 0) {\n        $tip.removeClass(tabClass.join(''));\n      }\n    } // Static\n    ;\n\n    Popover._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var data = $(this).data(DATA_KEY$7);\n\n        var _config = typeof config === 'object' ? config : null;\n\n        if (!data && /dispose|hide/.test(config)) {\n          return;\n        }\n\n        if (!data) {\n          data = new Popover(this, _config);\n          $(this).data(DATA_KEY$7, data);\n        }\n\n        if (typeof config === 'string') {\n          if (typeof data[config] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n          }\n\n          data[config]();\n        }\n      });\n    };\n\n    _createClass(Popover, null, [{\n      key: \"VERSION\",\n      // Getters\n      get: function get() {\n        return VERSION$7;\n      }\n    }, {\n      key: \"Default\",\n      get: function get() {\n        return Default$5;\n      }\n    }, {\n      key: \"NAME\",\n      get: function get() {\n        return NAME$7;\n      }\n    }, {\n      key: \"DATA_KEY\",\n      get: function get() {\n        return DATA_KEY$7;\n      }\n    }, {\n      key: \"Event\",\n      get: function get() {\n        return Event$7;\n      }\n    }, {\n      key: \"EVENT_KEY\",\n      get: function get() {\n        return EVENT_KEY$7;\n      }\n    }, {\n      key: \"DefaultType\",\n      get: function get() {\n        return DefaultType$5;\n      }\n    }]);\n\n    return Popover;\n  }(Tooltip);\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n\n  $.fn[NAME$7] = Popover._jQueryInterface;\n  $.fn[NAME$7].Constructor = Popover;\n\n  $.fn[NAME$7].noConflict = function () {\n    $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;\n    return Popover._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$8 = 'scrollspy';\n  var VERSION$8 = '4.4.1';\n  var DATA_KEY$8 = 'bs.scrollspy';\n  var EVENT_KEY$8 = \".\" + DATA_KEY$8;\n  var DATA_API_KEY$6 = '.data-api';\n  var JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];\n  var Default$6 = {\n    offset: 10,\n    method: 'auto',\n    target: ''\n  };\n  var DefaultType$6 = {\n    offset: 'number',\n    method: 'string',\n    target: '(string|element)'\n  };\n  var Event$8 = {\n    ACTIVATE: \"activate\" + EVENT_KEY$8,\n    SCROLL: \"scroll\" + EVENT_KEY$8,\n    LOAD_DATA_API: \"load\" + EVENT_KEY$8 + DATA_API_KEY$6\n  };\n  var ClassName$8 = {\n    DROPDOWN_ITEM: 'dropdown-item',\n    DROPDOWN_MENU: 'dropdown-menu',\n    ACTIVE: 'active'\n  };\n  var Selector$8 = {\n    DATA_SPY: '[data-spy=\"scroll\"]',\n    ACTIVE: '.active',\n    NAV_LIST_GROUP: '.nav, .list-group',\n    NAV_LINKS: '.nav-link',\n    NAV_ITEMS: '.nav-item',\n    LIST_ITEMS: '.list-group-item',\n    DROPDOWN: '.dropdown',\n    DROPDOWN_ITEMS: '.dropdown-item',\n    DROPDOWN_TOGGLE: '.dropdown-toggle'\n  };\n  var OffsetMethod = {\n    OFFSET: 'offset',\n    POSITION: 'position'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var ScrollSpy =\n  /*#__PURE__*/\n  function () {\n    function ScrollSpy(element, config) {\n      var _this = this;\n\n      this._element = element;\n      this._scrollElement = element.tagName === 'BODY' ? window : element;\n      this._config = this._getConfig(config);\n      this._selector = this._config.target + \" \" + Selector$8.NAV_LINKS + \",\" + (this._config.target + \" \" + Selector$8.LIST_ITEMS + \",\") + (this._config.target + \" \" + Selector$8.DROPDOWN_ITEMS);\n      this._offsets = [];\n      this._targets = [];\n      this._activeTarget = null;\n      this._scrollHeight = 0;\n      $(this._scrollElement).on(Event$8.SCROLL, function (event) {\n        return _this._process(event);\n      });\n      this.refresh();\n\n      this._process();\n    } // Getters\n\n\n    var _proto = ScrollSpy.prototype;\n\n    // Public\n    _proto.refresh = function refresh() {\n      var _this2 = this;\n\n      var autoMethod = this._scrollElement === this._scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;\n      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;\n      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;\n      this._offsets = [];\n      this._targets = [];\n      this._scrollHeight = this._getScrollHeight();\n      var targets = [].slice.call(document.querySelectorAll(this._selector));\n      targets.map(function (element) {\n        var target;\n        var targetSelector = Util.getSelectorFromElement(element);\n\n        if (targetSelector) {\n          target = document.querySelector(targetSelector);\n        }\n\n        if (target) {\n          var targetBCR = target.getBoundingClientRect();\n\n          if (targetBCR.width || targetBCR.height) {\n            // TODO (fat): remove sketch reliance on jQuery position/offset\n            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];\n          }\n        }\n\n        return null;\n      }).filter(function (item) {\n        return item;\n      }).sort(function (a, b) {\n        return a[0] - b[0];\n      }).forEach(function (item) {\n        _this2._offsets.push(item[0]);\n\n        _this2._targets.push(item[1]);\n      });\n    };\n\n    _proto.dispose = function dispose() {\n      $.removeData(this._element, DATA_KEY$8);\n      $(this._scrollElement).off(EVENT_KEY$8);\n      this._element = null;\n      this._scrollElement = null;\n      this._config = null;\n      this._selector = null;\n      this._offsets = null;\n      this._targets = null;\n      this._activeTarget = null;\n      this._scrollHeight = null;\n    } // Private\n    ;\n\n    _proto._getConfig = function _getConfig(config) {\n      config = _objectSpread2({}, Default$6, {}, typeof config === 'object' && config ? config : {});\n\n      if (typeof config.target !== 'string') {\n        var id = $(config.target).attr('id');\n\n        if (!id) {\n          id = Util.getUID(NAME$8);\n          $(config.target).attr('id', id);\n        }\n\n        config.target = \"#\" + id;\n      }\n\n      Util.typeCheckConfig(NAME$8, config, DefaultType$6);\n      return config;\n    };\n\n    _proto._getScrollTop = function _getScrollTop() {\n      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;\n    };\n\n    _proto._getScrollHeight = function _getScrollHeight() {\n      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);\n    };\n\n    _proto._getOffsetHeight = function _getOffsetHeight() {\n      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;\n    };\n\n    _proto._process = function _process() {\n      var scrollTop = this._getScrollTop() + this._config.offset;\n\n      var scrollHeight = this._getScrollHeight();\n\n      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();\n\n      if (this._scrollHeight !== scrollHeight) {\n        this.refresh();\n      }\n\n      if (scrollTop >= maxScroll) {\n        var target = this._targets[this._targets.length - 1];\n\n        if (this._activeTarget !== target) {\n          this._activate(target);\n        }\n\n        return;\n      }\n\n      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {\n        this._activeTarget = null;\n\n        this._clear();\n\n        return;\n      }\n\n      var offsetLength = this._offsets.length;\n\n      for (var i = offsetLength; i--;) {\n        var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);\n\n        if (isActiveTarget) {\n          this._activate(this._targets[i]);\n        }\n      }\n    };\n\n    _proto._activate = function _activate(target) {\n      this._activeTarget = target;\n\n      this._clear();\n\n      var queries = this._selector.split(',').map(function (selector) {\n        return selector + \"[data-target=\\\"\" + target + \"\\\"],\" + selector + \"[href=\\\"\" + target + \"\\\"]\";\n      });\n\n      var $link = $([].slice.call(document.querySelectorAll(queries.join(','))));\n\n      if ($link.hasClass(ClassName$8.DROPDOWN_ITEM)) {\n        $link.closest(Selector$8.DROPDOWN).find(Selector$8.DROPDOWN_TOGGLE).addClass(ClassName$8.ACTIVE);\n        $link.addClass(ClassName$8.ACTIVE);\n      } else {\n        // Set triggered link as active\n        $link.addClass(ClassName$8.ACTIVE); // Set triggered links parents as active\n        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor\n\n        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_LINKS + \", \" + Selector$8.LIST_ITEMS).addClass(ClassName$8.ACTIVE); // Handle special case when .nav-link is inside .nav-item\n\n        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_ITEMS).children(Selector$8.NAV_LINKS).addClass(ClassName$8.ACTIVE);\n      }\n\n      $(this._scrollElement).trigger(Event$8.ACTIVATE, {\n        relatedTarget: target\n      });\n    };\n\n    _proto._clear = function _clear() {\n      [].slice.call(document.querySelectorAll(this._selector)).filter(function (node) {\n        return node.classList.contains(ClassName$8.ACTIVE);\n      }).forEach(function (node) {\n        return node.classList.remove(ClassName$8.ACTIVE);\n      });\n    } // Static\n    ;\n\n    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var data = $(this).data(DATA_KEY$8);\n\n        var _config = typeof config === 'object' && config;\n\n        if (!data) {\n          data = new ScrollSpy(this, _config);\n          $(this).data(DATA_KEY$8, data);\n        }\n\n        if (typeof config === 'string') {\n          if (typeof data[config] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n          }\n\n          data[config]();\n        }\n      });\n    };\n\n    _createClass(ScrollSpy, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$8;\n      }\n    }, {\n      key: \"Default\",\n      get: function get() {\n        return Default$6;\n      }\n    }]);\n\n    return ScrollSpy;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * Data Api implementation\n   * ------------------------------------------------------------------------\n   */\n\n\n  $(window).on(Event$8.LOAD_DATA_API, function () {\n    var scrollSpys = [].slice.call(document.querySelectorAll(Selector$8.DATA_SPY));\n    var scrollSpysLength = scrollSpys.length;\n\n    for (var i = scrollSpysLength; i--;) {\n      var $spy = $(scrollSpys[i]);\n\n      ScrollSpy._jQueryInterface.call($spy, $spy.data());\n    }\n  });\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n  $.fn[NAME$8] = ScrollSpy._jQueryInterface;\n  $.fn[NAME$8].Constructor = ScrollSpy;\n\n  $.fn[NAME$8].noConflict = function () {\n    $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;\n    return ScrollSpy._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$9 = 'tab';\n  var VERSION$9 = '4.4.1';\n  var DATA_KEY$9 = 'bs.tab';\n  var EVENT_KEY$9 = \".\" + DATA_KEY$9;\n  var DATA_API_KEY$7 = '.data-api';\n  var JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];\n  var Event$9 = {\n    HIDE: \"hide\" + EVENT_KEY$9,\n    HIDDEN: \"hidden\" + EVENT_KEY$9,\n    SHOW: \"show\" + EVENT_KEY$9,\n    SHOWN: \"shown\" + EVENT_KEY$9,\n    CLICK_DATA_API: \"click\" + EVENT_KEY$9 + DATA_API_KEY$7\n  };\n  var ClassName$9 = {\n    DROPDOWN_MENU: 'dropdown-menu',\n    ACTIVE: 'active',\n    DISABLED: 'disabled',\n    FADE: 'fade',\n    SHOW: 'show'\n  };\n  var Selector$9 = {\n    DROPDOWN: '.dropdown',\n    NAV_LIST_GROUP: '.nav, .list-group',\n    ACTIVE: '.active',\n    ACTIVE_UL: '> li > .active',\n    DATA_TOGGLE: '[data-toggle=\"tab\"], [data-toggle=\"pill\"], [data-toggle=\"list\"]',\n    DROPDOWN_TOGGLE: '.dropdown-toggle',\n    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Tab =\n  /*#__PURE__*/\n  function () {\n    function Tab(element) {\n      this._element = element;\n    } // Getters\n\n\n    var _proto = Tab.prototype;\n\n    // Public\n    _proto.show = function show() {\n      var _this = this;\n\n      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName$9.ACTIVE) || $(this._element).hasClass(ClassName$9.DISABLED)) {\n        return;\n      }\n\n      var target;\n      var previous;\n      var listElement = $(this._element).closest(Selector$9.NAV_LIST_GROUP)[0];\n      var selector = Util.getSelectorFromElement(this._element);\n\n      if (listElement) {\n        var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector$9.ACTIVE_UL : Selector$9.ACTIVE;\n        previous = $.makeArray($(listElement).find(itemSelector));\n        previous = previous[previous.length - 1];\n      }\n\n      var hideEvent = $.Event(Event$9.HIDE, {\n        relatedTarget: this._element\n      });\n      var showEvent = $.Event(Event$9.SHOW, {\n        relatedTarget: previous\n      });\n\n      if (previous) {\n        $(previous).trigger(hideEvent);\n      }\n\n      $(this._element).trigger(showEvent);\n\n      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      if (selector) {\n        target = document.querySelector(selector);\n      }\n\n      this._activate(this._element, listElement);\n\n      var complete = function complete() {\n        var hiddenEvent = $.Event(Event$9.HIDDEN, {\n          relatedTarget: _this._element\n        });\n        var shownEvent = $.Event(Event$9.SHOWN, {\n          relatedTarget: previous\n        });\n        $(previous).trigger(hiddenEvent);\n        $(_this._element).trigger(shownEvent);\n      };\n\n      if (target) {\n        this._activate(target, target.parentNode, complete);\n      } else {\n        complete();\n      }\n    };\n\n    _proto.dispose = function dispose() {\n      $.removeData(this._element, DATA_KEY$9);\n      this._element = null;\n    } // Private\n    ;\n\n    _proto._activate = function _activate(element, container, callback) {\n      var _this2 = this;\n\n      var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(Selector$9.ACTIVE_UL) : $(container).children(Selector$9.ACTIVE);\n      var active = activeElements[0];\n      var isTransitioning = callback && active && $(active).hasClass(ClassName$9.FADE);\n\n      var complete = function complete() {\n        return _this2._transitionComplete(element, active, callback);\n      };\n\n      if (active && isTransitioning) {\n        var transitionDuration = Util.getTransitionDurationFromElement(active);\n        $(active).removeClass(ClassName$9.SHOW).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);\n      } else {\n        complete();\n      }\n    };\n\n    _proto._transitionComplete = function _transitionComplete(element, active, callback) {\n      if (active) {\n        $(active).removeClass(ClassName$9.ACTIVE);\n        var dropdownChild = $(active.parentNode).find(Selector$9.DROPDOWN_ACTIVE_CHILD)[0];\n\n        if (dropdownChild) {\n          $(dropdownChild).removeClass(ClassName$9.ACTIVE);\n        }\n\n        if (active.getAttribute('role') === 'tab') {\n          active.setAttribute('aria-selected', false);\n        }\n      }\n\n      $(element).addClass(ClassName$9.ACTIVE);\n\n      if (element.getAttribute('role') === 'tab') {\n        element.setAttribute('aria-selected', true);\n      }\n\n      Util.reflow(element);\n\n      if (element.classList.contains(ClassName$9.FADE)) {\n        element.classList.add(ClassName$9.SHOW);\n      }\n\n      if (element.parentNode && $(element.parentNode).hasClass(ClassName$9.DROPDOWN_MENU)) {\n        var dropdownElement = $(element).closest(Selector$9.DROPDOWN)[0];\n\n        if (dropdownElement) {\n          var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(Selector$9.DROPDOWN_TOGGLE));\n          $(dropdownToggleList).addClass(ClassName$9.ACTIVE);\n        }\n\n        element.setAttribute('aria-expanded', true);\n      }\n\n      if (callback) {\n        callback();\n      }\n    } // Static\n    ;\n\n    Tab._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var $this = $(this);\n        var data = $this.data(DATA_KEY$9);\n\n        if (!data) {\n          data = new Tab(this);\n          $this.data(DATA_KEY$9, data);\n        }\n\n        if (typeof config === 'string') {\n          if (typeof data[config] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n          }\n\n          data[config]();\n        }\n      });\n    };\n\n    _createClass(Tab, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$9;\n      }\n    }]);\n\n    return Tab;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * Data Api implementation\n   * ------------------------------------------------------------------------\n   */\n\n\n  $(document).on(Event$9.CLICK_DATA_API, Selector$9.DATA_TOGGLE, function (event) {\n    event.preventDefault();\n\n    Tab._jQueryInterface.call($(this), 'show');\n  });\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n  $.fn[NAME$9] = Tab._jQueryInterface;\n  $.fn[NAME$9].Constructor = Tab;\n\n  $.fn[NAME$9].noConflict = function () {\n    $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;\n    return Tab._jQueryInterface;\n  };\n\n  /**\n   * ------------------------------------------------------------------------\n   * Constants\n   * ------------------------------------------------------------------------\n   */\n\n  var NAME$a = 'toast';\n  var VERSION$a = '4.4.1';\n  var DATA_KEY$a = 'bs.toast';\n  var EVENT_KEY$a = \".\" + DATA_KEY$a;\n  var JQUERY_NO_CONFLICT$a = $.fn[NAME$a];\n  var Event$a = {\n    CLICK_DISMISS: \"click.dismiss\" + EVENT_KEY$a,\n    HIDE: \"hide\" + EVENT_KEY$a,\n    HIDDEN: \"hidden\" + EVENT_KEY$a,\n    SHOW: \"show\" + EVENT_KEY$a,\n    SHOWN: \"shown\" + EVENT_KEY$a\n  };\n  var ClassName$a = {\n    FADE: 'fade',\n    HIDE: 'hide',\n    SHOW: 'show',\n    SHOWING: 'showing'\n  };\n  var DefaultType$7 = {\n    animation: 'boolean',\n    autohide: 'boolean',\n    delay: 'number'\n  };\n  var Default$7 = {\n    animation: true,\n    autohide: true,\n    delay: 500\n  };\n  var Selector$a = {\n    DATA_DISMISS: '[data-dismiss=\"toast\"]'\n  };\n  /**\n   * ------------------------------------------------------------------------\n   * Class Definition\n   * ------------------------------------------------------------------------\n   */\n\n  var Toast =\n  /*#__PURE__*/\n  function () {\n    function Toast(element, config) {\n      this._element = element;\n      this._config = this._getConfig(config);\n      this._timeout = null;\n\n      this._setListeners();\n    } // Getters\n\n\n    var _proto = Toast.prototype;\n\n    // Public\n    _proto.show = function show() {\n      var _this = this;\n\n      var showEvent = $.Event(Event$a.SHOW);\n      $(this._element).trigger(showEvent);\n\n      if (showEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      if (this._config.animation) {\n        this._element.classList.add(ClassName$a.FADE);\n      }\n\n      var complete = function complete() {\n        _this._element.classList.remove(ClassName$a.SHOWING);\n\n        _this._element.classList.add(ClassName$a.SHOW);\n\n        $(_this._element).trigger(Event$a.SHOWN);\n\n        if (_this._config.autohide) {\n          _this._timeout = setTimeout(function () {\n            _this.hide();\n          }, _this._config.delay);\n        }\n      };\n\n      this._element.classList.remove(ClassName$a.HIDE);\n\n      Util.reflow(this._element);\n\n      this._element.classList.add(ClassName$a.SHOWING);\n\n      if (this._config.animation) {\n        var transitionDuration = Util.getTransitionDurationFromElement(this._element);\n        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);\n      } else {\n        complete();\n      }\n    };\n\n    _proto.hide = function hide() {\n      if (!this._element.classList.contains(ClassName$a.SHOW)) {\n        return;\n      }\n\n      var hideEvent = $.Event(Event$a.HIDE);\n      $(this._element).trigger(hideEvent);\n\n      if (hideEvent.isDefaultPrevented()) {\n        return;\n      }\n\n      this._close();\n    };\n\n    _proto.dispose = function dispose() {\n      clearTimeout(this._timeout);\n      this._timeout = null;\n\n      if (this._element.classList.contains(ClassName$a.SHOW)) {\n        this._element.classList.remove(ClassName$a.SHOW);\n      }\n\n      $(this._element).off(Event$a.CLICK_DISMISS);\n      $.removeData(this._element, DATA_KEY$a);\n      this._element = null;\n      this._config = null;\n    } // Private\n    ;\n\n    _proto._getConfig = function _getConfig(config) {\n      config = _objectSpread2({}, Default$7, {}, $(this._element).data(), {}, typeof config === 'object' && config ? config : {});\n      Util.typeCheckConfig(NAME$a, config, this.constructor.DefaultType);\n      return config;\n    };\n\n    _proto._setListeners = function _setListeners() {\n      var _this2 = this;\n\n      $(this._element).on(Event$a.CLICK_DISMISS, Selector$a.DATA_DISMISS, function () {\n        return _this2.hide();\n      });\n    };\n\n    _proto._close = function _close() {\n      var _this3 = this;\n\n      var complete = function complete() {\n        _this3._element.classList.add(ClassName$a.HIDE);\n\n        $(_this3._element).trigger(Event$a.HIDDEN);\n      };\n\n      this._element.classList.remove(ClassName$a.SHOW);\n\n      if (this._config.animation) {\n        var transitionDuration = Util.getTransitionDurationFromElement(this._element);\n        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);\n      } else {\n        complete();\n      }\n    } // Static\n    ;\n\n    Toast._jQueryInterface = function _jQueryInterface(config) {\n      return this.each(function () {\n        var $element = $(this);\n        var data = $element.data(DATA_KEY$a);\n\n        var _config = typeof config === 'object' && config;\n\n        if (!data) {\n          data = new Toast(this, _config);\n          $element.data(DATA_KEY$a, data);\n        }\n\n        if (typeof config === 'string') {\n          if (typeof data[config] === 'undefined') {\n            throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n          }\n\n          data[config](this);\n        }\n      });\n    };\n\n    _createClass(Toast, null, [{\n      key: \"VERSION\",\n      get: function get() {\n        return VERSION$a;\n      }\n    }, {\n      key: \"DefaultType\",\n      get: function get() {\n        return DefaultType$7;\n      }\n    }, {\n      key: \"Default\",\n      get: function get() {\n        return Default$7;\n      }\n    }]);\n\n    return Toast;\n  }();\n  /**\n   * ------------------------------------------------------------------------\n   * jQuery\n   * ------------------------------------------------------------------------\n   */\n\n\n  $.fn[NAME$a] = Toast._jQueryInterface;\n  $.fn[NAME$a].Constructor = Toast;\n\n  $.fn[NAME$a].noConflict = function () {\n    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;\n    return Toast._jQueryInterface;\n  };\n\n  exports.Alert = Alert;\n  exports.Button = Button;\n  exports.Carousel = Carousel;\n  exports.Collapse = Collapse;\n  exports.Dropdown = Dropdown;\n  exports.Modal = Modal;\n  exports.Popover = Popover;\n  exports.Scrollspy = ScrollSpy;\n  exports.Tab = Tab;\n  exports.Toast = Toast;\n  exports.Tooltip = Tooltip;\n  exports.Util = Util;\n\n  Object.defineProperty(exports, '__esModule', { value: true });\n\n})));\n//# sourceMappingURL=bootstrap.js.map\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./node_modules/daemonite-material/js/material.js":
/***/ (function(module, exports) {

module.exports = "/*!\n * Daemonite Material v4.1.1 (http://daemonite.github.io/material/)\n * Copyright 2011-2018 Daemon Pty Ltd\n * Licensed under MIT (https://github.com/Daemonite/material/blob/master/LICENSE)\n */\n\n(function (global, factory) {\n  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :\n  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :\n  (factory((global.material = {}),global.jQuery));\n}(this, (function (exports,$) { 'use strict';\n\n  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;\n\n  /*\n   * Expansion panel plugins expands a collapsed panel in full upon selecting\n   */\n\n  var ExpansionPanel = function ($$$1) {\n    // constants >>>\n    var DATA_KEY = 'bs.collapse';\n    var EVENT_KEY = \".\" + DATA_KEY;\n    var ClassName = {\n      SHOW: 'show',\n      SHOW_PREDECESSOR: 'show-predecessor'\n    };\n    var Event = {\n      HIDE: \"hide\" + EVENT_KEY,\n      SHOW: \"show\" + EVENT_KEY\n    };\n    var Selector = {\n      PANEL: '.expansion-panel',\n      PANEL_BODY: '.expansion-panel .collapse' // <<< constants\n\n    };\n    $$$1(document).on(\"\" + Event.HIDE, Selector.PANEL_BODY, function () {\n      var target = $$$1(this).closest(Selector.PANEL);\n      target.removeClass(ClassName.SHOW);\n      var predecessor = target.prev(Selector.PANEL);\n\n      if (predecessor.length) {\n        predecessor.removeClass(ClassName.SHOW_PREDECESSOR);\n      }\n    }).on(\"\" + Event.SHOW, Selector.PANEL_BODY, function () {\n      var target = $$$1(this).closest(Selector.PANEL);\n      target.addClass(ClassName.SHOW);\n      var predecessor = target.prev(Selector.PANEL);\n\n      if (predecessor.length) {\n        predecessor.addClass(ClassName.SHOW_PREDECESSOR);\n      }\n    });\n  }($);\n\n  /*\n   * Floating label plugin moves inline label to float above the field\n   * when a user engages with the assosciated text input field\n   */\n\n  var FloatingLabel = function ($$$1) {\n    // constants >>>\n    var DATA_KEY = 'md.floatinglabel';\n    var EVENT_KEY = \".\" + DATA_KEY;\n    var NAME = 'floatinglabel';\n    var NO_CONFLICT = $$$1.fn[NAME];\n    var ClassName = {\n      IS_FOCUSED: 'is-focused',\n      HAS_VALUE: 'has-value'\n    };\n    var Event = {\n      CHANGE: \"change\" + EVENT_KEY,\n      FOCUSIN: \"focusin\" + EVENT_KEY,\n      FOCUSOUT: \"focusout\" + EVENT_KEY\n    };\n    var Selector = {\n      DATA_PARENT: '.floating-label',\n      DATA_TOGGLE: '.floating-label .custom-select, .floating-label .form-control' // <<< constants\n\n    };\n\n    var FloatingLabel =\n    /*#__PURE__*/\n    function () {\n      function FloatingLabel(element) {\n        this._element = element;\n        this._parent = $$$1(element).closest(Selector.DATA_PARENT)[0];\n      }\n\n      var _proto = FloatingLabel.prototype;\n\n      _proto.change = function change() {\n        if ($$$1(this._element).val() || $$$1(this._element).is('select') && $$$1('option:first-child', $$$1(this._element)).html().replace(' ', '') !== '') {\n          $$$1(this._parent).addClass(ClassName.HAS_VALUE);\n        } else {\n          $$$1(this._parent).removeClass(ClassName.HAS_VALUE);\n        }\n      };\n\n      _proto.focusin = function focusin() {\n        $$$1(this._parent).addClass(ClassName.IS_FOCUSED);\n      };\n\n      _proto.focusout = function focusout() {\n        $$$1(this._parent).removeClass(ClassName.IS_FOCUSED);\n      };\n\n      FloatingLabel._jQueryInterface = function _jQueryInterface(event) {\n        return this.each(function () {\n          var _event = event ? event : 'change';\n\n          var data = $$$1(this).data(DATA_KEY);\n\n          if (!data) {\n            data = new FloatingLabel(this);\n            $$$1(this).data(DATA_KEY, data);\n          }\n\n          if (typeof _event === 'string') {\n            if (typeof data[_event] === 'undefined') {\n              throw new Error(\"No method named \\\"\" + _event + \"\\\"\");\n            }\n\n            data[_event]();\n          }\n        });\n      };\n\n      return FloatingLabel;\n    }();\n\n    $$$1(document).on(Event.CHANGE + \" \" + Event.FOCUSIN + \" \" + Event.FOCUSOUT, Selector.DATA_TOGGLE, function (event) {\n      FloatingLabel._jQueryInterface.call($$$1(this), event.type);\n    });\n    $$$1.fn[NAME] = FloatingLabel._jQueryInterface;\n    $$$1.fn[NAME].Constructor = FloatingLabel;\n\n    $$$1.fn[NAME].noConflict = function () {\n      $$$1.fn[NAME] = NO_CONFLICT;\n      return FloatingLabel._jQueryInterface;\n    };\n\n    return FloatingLabel;\n  }($);\n\n  function _defineProperties(target, props) {\n    for (var i = 0; i < props.length; i++) {\n      var descriptor = props[i];\n      descriptor.enumerable = descriptor.enumerable || false;\n      descriptor.configurable = true;\n      if (\"value\" in descriptor) descriptor.writable = true;\n      Object.defineProperty(target, descriptor.key, descriptor);\n    }\n  }\n\n  function _createClass(Constructor, protoProps, staticProps) {\n    if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n    if (staticProps) _defineProperties(Constructor, staticProps);\n    return Constructor;\n  }\n\n  function _defineProperty(obj, key, value) {\n    if (key in obj) {\n      Object.defineProperty(obj, key, {\n        value: value,\n        enumerable: true,\n        configurable: true,\n        writable: true\n      });\n    } else {\n      obj[key] = value;\n    }\n\n    return obj;\n  }\n\n  function _objectSpread(target) {\n    for (var i = 1; i < arguments.length; i++) {\n      var source = arguments[i] != null ? arguments[i] : {};\n      var ownKeys = Object.keys(source);\n\n      if (typeof Object.getOwnPropertySymbols === 'function') {\n        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {\n          return Object.getOwnPropertyDescriptor(source, sym).enumerable;\n        }));\n      }\n\n      ownKeys.forEach(function (key) {\n        _defineProperty(target, key, source[key]);\n      });\n    }\n\n    return target;\n  }\n\n  /*\n   * Global util js\n   * Based on Bootstrap's (v4.1.X) `util.js`\n   */\n\n  var Util = function ($$$1) {\n    var MAX_UID = 1000000;\n    var MILLISECONDS_MULTIPLIER = 1000;\n    var TRANSITION_END = 'transitionend';\n\n    function getSpecialTransitionEndEvent() {\n      return {\n        bindType: TRANSITION_END,\n        delegateType: TRANSITION_END,\n        handle: function handle(event) {\n          if ($$$1(event.target).is(this)) {\n            return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params\n          }\n\n          return undefined; // eslint-disable-line no-undefined\n        }\n      };\n    }\n\n    function setTransitionEndSupport() {\n      $$$1.fn.emulateTransitionEnd = transitionEndEmulator;\n      $$$1.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();\n    }\n\n    function toType(obj) {\n      return {}.toString.call(obj).match(/\\s([a-z]+)/i)[1].toLowerCase();\n    }\n\n    function transitionEndEmulator(duration) {\n      var _this = this;\n\n      var called = false;\n      $$$1(this).one(Util.TRANSITION_END, function () {\n        called = true;\n      });\n      setTimeout(function () {\n        if (!called) {\n          Util.triggerTransitionEnd(_this);\n        }\n      }, duration);\n      return this;\n    }\n\n    var Util = {\n      TRANSITION_END: 'mdTransitionEnd',\n      getSelectorFromElement: function getSelectorFromElement(element) {\n        var selector = element.getAttribute('data-target');\n\n        if (!selector || selector === '#') {\n          selector = element.getAttribute('href') || '';\n        }\n\n        try {\n          var $selector = $$$1(document).find(selector);\n          return $selector.length > 0 ? selector : null;\n        } catch (err) {\n          return null;\n        }\n      },\n      getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {\n        if (!element) {\n          return 0;\n        }\n\n        var transitionDuration = $$$1(element).css('transition-duration');\n\n        if (!transitionDuration) {\n          return 0;\n        }\n\n        transitionDuration = transitionDuration.split(',')[0];\n        return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER;\n      },\n      getUID: function getUID(prefix) {\n        do {\n          // eslint-disable-next-line no-bitwise\n          prefix += ~~(Math.random() * MAX_UID);\n        } while (document.getElementById(prefix));\n\n        return prefix;\n      },\n      isElement: function isElement(obj) {\n        return (obj[0] || obj).nodeType;\n      },\n      reflow: function reflow(element) {\n        return element.offsetHeight;\n      },\n      supportsTransitionEnd: function supportsTransitionEnd() {\n        return Boolean(TRANSITION_END);\n      },\n      triggerTransitionEnd: function triggerTransitionEnd(element) {\n        $$$1(element).trigger(TRANSITION_END);\n      },\n      typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {\n        for (var property in configTypes) {\n          if (Object.prototype.hasOwnProperty.call(configTypes, property)) {\n            var expectedTypes = configTypes[property];\n            var value = config[property];\n            var valueType = value && Util.isElement(value) ? 'element' : toType(value);\n\n            if (!new RegExp(expectedTypes).test(valueType)) {\n              throw new Error(componentName.toUpperCase() + \": \" + (\"Option \\\"\" + property + \"\\\" provided type \\\"\" + valueType + \"\\\" \") + (\"but expected type \\\"\" + expectedTypes + \"\\\".\"));\n            }\n          }\n        }\n      }\n    };\n    setTransitionEndSupport();\n    return Util;\n  }($);\n\n  /*\n   * Navigation drawer plguin\n   * Based on Bootstrap's (v4.1.X) `modal.js`\n   */\n\n  var NavDrawer = function ($$$1) {\n    // constants >>>\n    var DATA_API_KEY = '.data-api';\n    var DATA_KEY = 'md.navdrawer';\n    var ESCAPE_KEYCODE = 27;\n    var EVENT_KEY = \".\" + DATA_KEY;\n    var NAME = 'navdrawer';\n    var NO_CONFLICT = $$$1.fn[NAME];\n    var ClassName = {\n      BACKDROP: 'navdrawer-backdrop',\n      OPEN: 'navdrawer-open',\n      SHOW: 'show'\n    };\n    var Default = {\n      breakpoint: '',\n      keyboard: true,\n      show: true,\n      type: 'default'\n    };\n    var DefaultType = {\n      keyboard: 'boolean',\n      show: 'boolean',\n      type: 'string'\n    };\n    var Event = {\n      CLICK_DATA_API: \"click\" + EVENT_KEY + DATA_API_KEY,\n      CLICK_DISMISS: \"click.dismiss\" + EVENT_KEY,\n      FOCUSIN: \"focusin\" + EVENT_KEY,\n      HIDDEN: \"hidden\" + EVENT_KEY,\n      HIDE: \"hide\" + EVENT_KEY,\n      KEYDOWN_DISMISS: \"keydown.dismiss\" + EVENT_KEY,\n      MOUSEDOWN_DISMISS: \"mousedown.dismiss\" + EVENT_KEY,\n      MOUSEUP_DISMISS: \"mouseup.dismiss\" + EVENT_KEY,\n      SHOW: \"show\" + EVENT_KEY,\n      SHOWN: \"shown\" + EVENT_KEY\n    };\n    var Selector = {\n      CONTENT: '.navdrawer-content',\n      DATA_DISMISS: '[data-dismiss=\"navdrawer\"]',\n      DATA_TOGGLE: '[data-toggle=\"navdrawer\"]' // <<< constants\n\n    };\n\n    var NavDrawer =\n    /*#__PURE__*/\n    function () {\n      function NavDrawer(element, config) {\n        this._backdrop = null;\n        this._config = this._getConfig(config);\n        this._content = $$$1(element).find(Selector.CONTENT)[0];\n        this._element = element;\n        this._ignoreBackdropClick = false;\n        this._isShown = false;\n        this._typeBreakpoint = this._config.breakpoint === '' ? '' : \"-\" + this._config.breakpoint;\n      }\n\n      var _proto = NavDrawer.prototype;\n\n      _proto.hide = function hide(event) {\n        var _this = this;\n\n        if (event) {\n          event.preventDefault();\n        }\n\n        if (this._isTransitioning || !this._isShown) {\n          return;\n        }\n\n        var hideEvent = $$$1.Event(Event.HIDE);\n        $$$1(this._element).trigger(hideEvent);\n\n        if (!this._isShown || hideEvent.isDefaultPrevented()) {\n          return;\n        }\n\n        this._isShown = false;\n        this._isTransitioning = true;\n\n        this._setEscapeEvent();\n\n        $$$1(document).off(Event.FOCUSIN);\n        $$$1(document.body).removeClass(ClassName.OPEN + \"-\" + this._config.type + this._typeBreakpoint);\n        $$$1(this._element).removeClass(ClassName.SHOW);\n        $$$1(this._element).off(Event.CLICK_DISMISS);\n        $$$1(this._content).off(Event.MOUSEDOWN_DISMISS);\n        var transitionDuration = Util.getTransitionDurationFromElement(this._content);\n        $$$1(this._content).one(Util.TRANSITION_END, function (event) {\n          return _this._hideNavdrawer(event);\n        }).emulateTransitionEnd(transitionDuration);\n\n        this._showBackdrop();\n      };\n\n      _proto.show = function show(relatedTarget) {\n        var _this2 = this;\n\n        if (this._isTransitioning || this._isShown) {\n          return;\n        }\n\n        this._isTransitioning = true;\n        var showEvent = $$$1.Event(Event.SHOW, {\n          relatedTarget: relatedTarget\n        });\n        $$$1(this._element).trigger(showEvent);\n\n        if (this._isShown || showEvent.isDefaultPrevented()) {\n          return;\n        }\n\n        this._isShown = true;\n\n        this._setEscapeEvent();\n\n        $$$1(this._element).addClass(NAME + \"-\" + this._config.type + this._typeBreakpoint);\n        $$$1(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {\n          return _this2.hide(event);\n        });\n        $$$1(this._content).on(Event.MOUSEDOWN_DISMISS, function () {\n          $$$1(_this2._element).one(Event.MOUSEUP_DISMISS, function (event) {\n            if ($$$1(event.target).is(_this2._element)) {\n              _this2._ignoreBackdropClick = true;\n            }\n          });\n        });\n\n        this._showBackdrop();\n\n        this._showElement(relatedTarget);\n      };\n\n      _proto.toggle = function toggle(relatedTarget) {\n        return this._isShown ? this.hide() : this.show(relatedTarget);\n      };\n\n      _proto._enforceFocus = function _enforceFocus() {\n        var _this3 = this;\n\n        $$$1(document).off(Event.FOCUSIN).on(Event.FOCUSIN, function (event) {\n          if (document !== event.target && _this3._element !== event.target && $$$1(_this3._element).has(event.target).length === 0) {\n            _this3._element.focus();\n          }\n        });\n      };\n\n      _proto._getConfig = function _getConfig(config) {\n        config = _objectSpread({}, Default, config);\n        Util.typeCheckConfig(NAME, config, DefaultType);\n        return config;\n      };\n\n      _proto._hideNavdrawer = function _hideNavdrawer() {\n        this._element.style.display = 'none';\n\n        this._element.setAttribute('aria-hidden', true);\n\n        this._isTransitioning = false;\n        $$$1(this._element).trigger(Event.HIDDEN);\n      };\n\n      _proto._removeBackdrop = function _removeBackdrop() {\n        if (this._backdrop) {\n          $$$1(this._backdrop).remove();\n          this._backdrop = null;\n        }\n      };\n\n      _proto._setEscapeEvent = function _setEscapeEvent() {\n        var _this4 = this;\n\n        if (this._isShown && this._config.keyboard) {\n          $$$1(this._element).on(Event.KEYDOWN_DISMISS, function (event) {\n            if (event.which === ESCAPE_KEYCODE) {\n              event.preventDefault();\n\n              _this4.hide();\n            }\n          });\n        } else if (!this._isShown) {\n          $$$1(this._element).off(Event.KEYDOWN_DISMISS);\n        }\n      };\n\n      _proto._showBackdrop = function _showBackdrop() {\n        var _this5 = this;\n\n        if (this._isShown) {\n          this._backdrop = document.createElement('div');\n          $$$1(this._backdrop).addClass(ClassName.BACKDROP).addClass(ClassName.BACKDROP + \"-\" + this._config.type + this._typeBreakpoint).appendTo(document.body);\n          $$$1(this._element).on(Event.CLICK_DISMISS, function (event) {\n            if (_this5._ignoreBackdropClick) {\n              _this5._ignoreBackdropClick = false;\n              return;\n            }\n\n            if (event.target !== event.currentTarget) {\n              return;\n            }\n\n            _this5.hide();\n          });\n          Util.reflow(this._backdrop);\n          $$$1(this._backdrop).addClass(ClassName.SHOW);\n        } else if (!this._isShown && this._backdrop) {\n          $$$1(this._backdrop).removeClass(ClassName.SHOW);\n\n          this._removeBackdrop();\n        }\n      };\n\n      _proto._showElement = function _showElement(relatedTarget) {\n        var _this6 = this;\n\n        if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {\n          document.body.appendChild(this._element);\n        }\n\n        this._element.style.display = 'block';\n\n        this._element.removeAttribute('aria-hidden');\n\n        Util.reflow(this._element);\n        $$$1(document.body).addClass(ClassName.OPEN + \"-\" + this._config.type + this._typeBreakpoint);\n        $$$1(this._element).addClass(ClassName.SHOW);\n\n        this._enforceFocus();\n\n        var shownEvent = $$$1.Event(Event.SHOWN, {\n          relatedTarget: relatedTarget\n        });\n\n        var transitionComplete = function transitionComplete() {\n          _this6._element.focus();\n\n          _this6._isTransitioning = false;\n          $$$1(_this6._element).trigger(shownEvent);\n        };\n\n        var transitionDuration = Util.getTransitionDurationFromElement(this._content);\n        $$$1(this._content).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);\n      };\n\n      NavDrawer._jQueryInterface = function _jQueryInterface(config, relatedTarget) {\n        return this.each(function () {\n          var _config = _objectSpread({}, Default, $$$1(this).data(), typeof config === 'object' && config ? config : {});\n\n          var data = $$$1(this).data(DATA_KEY);\n\n          if (!data) {\n            data = new NavDrawer(this, _config);\n            $$$1(this).data(DATA_KEY, data);\n          }\n\n          if (typeof config === 'string') {\n            if (typeof data[config] === 'undefined') {\n              throw new TypeError(\"No method named \\\"\" + config + \"\\\"\");\n            }\n\n            data[config](relatedTarget);\n          } else if (_config.show) {\n            data.show(relatedTarget);\n          }\n        });\n      };\n\n      _createClass(NavDrawer, null, [{\n        key: \"Default\",\n        get: function get() {\n          return Default;\n        }\n      }]);\n\n      return NavDrawer;\n    }();\n\n    $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {\n      var _this7 = this;\n\n      var selector = Util.getSelectorFromElement(this);\n      var target;\n\n      if (selector) {\n        target = $$$1(selector)[0];\n      }\n\n      var config = $$$1(target).data(DATA_KEY) ? 'toggle' : _objectSpread({}, $$$1(target).data(), $$$1(this).data());\n\n      if (this.tagName === 'A' || this.tagName === 'AREA') {\n        event.preventDefault();\n      }\n\n      var $target = $$$1(target).one(Event.SHOW, function (showEvent) {\n        if (showEvent.isDefaultPrevented()) {\n          return;\n        }\n\n        $target.one(Event.HIDDEN, function () {\n          if ($$$1(_this7).is(':visible')) {\n            _this7.focus();\n          }\n        });\n      });\n\n      NavDrawer._jQueryInterface.call($$$1(target), config, this);\n    });\n    $$$1.fn[NAME] = NavDrawer._jQueryInterface;\n    $$$1.fn[NAME].Constructor = NavDrawer;\n\n    $$$1.fn[NAME].noConflict = function () {\n      $$$1.fn[NAME] = NO_CONFLICT;\n      return NavDrawer._jQueryInterface;\n    };\n\n    return NavDrawer;\n  }($);\n\n  function createCommonjsModule(fn, module) {\n  \treturn module = { exports: {} }, fn(module, module.exports), module.exports;\n  }\n\n  var picker = createCommonjsModule(function (module, exports) {\n  /*!\n   * pickadate.js v3.5.6, 2015/04/20\n   * By Amsul, http://amsul.ca\n   * Hosted on http://amsul.github.io/pickadate.js\n   * Licensed under MIT\n   */\n\n  (function ( factory ) {\n\n      // AMD.\n      if ( typeof undefined == 'function' && undefined.amd )\n          undefined( 'picker', ['jquery'], factory );\n\n      // Node.js/browserify.\n      else module.exports = factory( $ );\n\n  }(function( $$$1 ) {\n\n  var $window = $$$1( window );\n  var $document = $$$1( document );\n  var $html = $$$1( document.documentElement );\n  var supportsTransitions = document.documentElement.style.transition != null;\n\n\n  /**\n   * The picker constructor that creates a blank picker.\n   */\n  function PickerConstructor( ELEMENT, NAME, COMPONENT, OPTIONS ) {\n\n      // If there’s no element, return the picker constructor.\n      if ( !ELEMENT ) return PickerConstructor\n\n\n      var\n          IS_DEFAULT_THEME = false,\n\n\n          // The state of the picker.\n          STATE = {\n              id: ELEMENT.id || 'P' + Math.abs( ~~(Math.random() * new Date()) )\n          },\n\n\n          // Merge the defaults and options passed.\n          SETTINGS = COMPONENT ? $$$1.extend( true, {}, COMPONENT.defaults, OPTIONS ) : OPTIONS || {},\n\n\n          // Merge the default classes with the settings classes.\n          CLASSES = $$$1.extend( {}, PickerConstructor.klasses(), SETTINGS.klass ),\n\n\n          // The element node wrapper into a jQuery object.\n          $ELEMENT = $$$1( ELEMENT ),\n\n\n          // Pseudo picker constructor.\n          PickerInstance = function() {\n              return this.start()\n          },\n\n\n          // The picker prototype.\n          P = PickerInstance.prototype = {\n\n              constructor: PickerInstance,\n\n              $node: $ELEMENT,\n\n\n              /**\n               * Initialize everything\n               */\n              start: function() {\n\n                  // If it’s already started, do nothing.\n                  if ( STATE && STATE.start ) return P\n\n\n                  // Update the picker states.\n                  STATE.methods = {};\n                  STATE.start = true;\n                  STATE.open = false;\n                  STATE.type = ELEMENT.type;\n\n\n                  // Confirm focus state, convert into text input to remove UA stylings,\n                  // and set as readonly to prevent keyboard popup.\n                  ELEMENT.autofocus = ELEMENT == getActiveElement();\n                  ELEMENT.readOnly = !SETTINGS.editable;\n                  ELEMENT.id = ELEMENT.id || STATE.id;\n                  if ( ELEMENT.type != 'text' ) {\n                      ELEMENT.type = 'text';\n                  }\n\n\n                  // Create a new picker component with the settings.\n                  P.component = new COMPONENT(P, SETTINGS);\n\n\n                  // Create the picker root and then prepare it.\n                  P.$root = $$$1( '<div class=\"' + CLASSES.picker + '\" id=\"' + ELEMENT.id + '_root\" />' );\n                  prepareElementRoot();\n\n\n                  // Create the picker holder and then prepare it.\n                  P.$holder = $$$1( createWrappedComponent() ).appendTo( P.$root );\n                  prepareElementHolder();\n\n\n                  // If there’s a format for the hidden input element, create the element.\n                  if ( SETTINGS.formatSubmit ) {\n                      prepareElementHidden();\n                  }\n\n\n                  // Prepare the input element.\n                  prepareElement();\n\n\n                  // Insert the hidden input as specified in the settings.\n                  if ( SETTINGS.containerHidden ) $$$1( SETTINGS.containerHidden ).append( P._hidden );\n                  else $ELEMENT.after( P._hidden );\n\n\n                  // Insert the root as specified in the settings.\n                  if ( SETTINGS.container ) $$$1( SETTINGS.container ).append( P.$root );\n                  else $ELEMENT.after( P.$root );\n\n\n                  // Bind the default component and settings events.\n                  P.on({\n                      start: P.component.onStart,\n                      render: P.component.onRender,\n                      stop: P.component.onStop,\n                      open: P.component.onOpen,\n                      close: P.component.onClose,\n                      set: P.component.onSet\n                  }).on({\n                      start: SETTINGS.onStart,\n                      render: SETTINGS.onRender,\n                      stop: SETTINGS.onStop,\n                      open: SETTINGS.onOpen,\n                      close: SETTINGS.onClose,\n                      set: SETTINGS.onSet\n                  });\n\n\n                  // Once we’re all set, check the theme in use.\n                  IS_DEFAULT_THEME = isUsingDefaultTheme( P.$holder[0] );\n\n\n                  // If the element has autofocus, open the picker.\n                  if ( ELEMENT.autofocus ) {\n                      P.open();\n                  }\n\n\n                  // Trigger queued the “start” and “render” events.\n                  return P.trigger( 'start' ).trigger( 'render' )\n              }, //start\n\n\n              /**\n               * Render a new picker\n               */\n              render: function( entireComponent ) {\n\n                  // Insert a new component holder in the root or box.\n                  if ( entireComponent ) {\n                      P.$holder = $$$1( createWrappedComponent() );\n                      prepareElementHolder();\n                      P.$root.html( P.$holder );\n                  }\n                  else P.$root.find( '.' + CLASSES.box ).html( P.component.nodes( STATE.open ) );\n\n                  // Trigger the queued “render” events.\n                  return P.trigger( 'render' )\n              }, //render\n\n\n              /**\n               * Destroy everything\n               */\n              stop: function() {\n\n                  // If it’s already stopped, do nothing.\n                  if ( !STATE.start ) return P\n\n                  // Then close the picker.\n                  P.close();\n\n                  // Remove the hidden field.\n                  if ( P._hidden ) {\n                      P._hidden.parentNode.removeChild( P._hidden );\n                  }\n\n                  // Remove the root.\n                  P.$root.remove();\n\n                  // Remove the input class, remove the stored data, and unbind\n                  // the events (after a tick for IE - see `P.close`).\n                  $ELEMENT.removeClass( CLASSES.input ).removeData( NAME );\n                  setTimeout( function() {\n                      $ELEMENT.off( '.' + STATE.id );\n                  }, 0);\n\n                  // Restore the element state\n                  ELEMENT.type = STATE.type;\n                  ELEMENT.readOnly = false;\n\n                  // Trigger the queued “stop” events.\n                  P.trigger( 'stop' );\n\n                  // Reset the picker states.\n                  STATE.methods = {};\n                  STATE.start = false;\n\n                  return P\n              }, //stop\n\n\n              /**\n               * Open up the picker\n               */\n              open: function( dontGiveFocus ) {\n\n                  // If it’s already open, do nothing.\n                  if ( STATE.open ) return P\n\n                  // Add the “active” class.\n                  $ELEMENT.addClass( CLASSES.active );\n                  aria( ELEMENT, 'expanded', true );\n\n                  // * A Firefox bug, when `html` has `overflow:hidden`, results in\n                  //   killing transitions :(. So add the “opened” state on the next tick.\n                  //   Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=625289\n                  setTimeout( function() {\n\n                      // Add the “opened” class to the picker root.\n                      P.$root.addClass( CLASSES.opened );\n                      aria( P.$root[0], 'hidden', false );\n\n                  }, 0 );\n\n                  // If we have to give focus, bind the element and doc events.\n                  if ( dontGiveFocus !== false ) {\n\n                      // Set it as open.\n                      STATE.open = true;\n\n                      // Prevent the page from scrolling.\n                      if ( IS_DEFAULT_THEME ) {\n                          $html.\n                              css( 'overflow', 'hidden' ).\n                              css( 'padding-right', '+=' + getScrollbarWidth() );\n                      }\n\n                      // Pass focus to the root element’s jQuery object.\n                      focusPickerOnceOpened();\n\n                      // Bind the document events.\n                      $document.on( 'click.' + STATE.id + ' focusin.' + STATE.id, function( event ) {\n\n                          var target = event.target;\n\n                          // If the target of the event is not the element, close the picker picker.\n                          // * Don’t worry about clicks or focusins on the root because those don’t bubble up.\n                          //   Also, for Firefox, a click on an `option` element bubbles up directly\n                          //   to the doc. So make sure the target wasn't the doc.\n                          // * In Firefox stopPropagation() doesn’t prevent right-click events from bubbling,\n                          //   which causes the picker to unexpectedly close when right-clicking it. So make\n                          //   sure the event wasn’t a right-click.\n                          if ( target != ELEMENT && target != document && event.which != 3 ) {\n\n                              // If the target was the holder that covers the screen,\n                              // keep the element focused to maintain tabindex.\n                              P.close( target === P.$holder[0] );\n                          }\n\n                      }).on( 'keydown.' + STATE.id, function( event ) {\n\n                          var\n                              // Get the keycode.\n                              keycode = event.keyCode,\n\n                              // Translate that to a selection change.\n                              keycodeToMove = P.component.key[ keycode ],\n\n                              // Grab the target.\n                              target = event.target;\n\n\n                          // On escape, close the picker and give focus.\n                          if ( keycode == 27 ) {\n                              P.close( true );\n                          }\n\n\n                          // Check if there is a key movement or “enter” keypress on the element.\n                          else if ( target == P.$holder[0] && ( keycodeToMove || keycode == 13 ) ) {\n\n                              // Prevent the default action to stop page movement.\n                              event.preventDefault();\n\n                              // Trigger the key movement action.\n                              if ( keycodeToMove ) {\n                                  PickerConstructor._.trigger( P.component.key.go, P, [ PickerConstructor._.trigger( keycodeToMove ) ] );\n                              }\n\n                              // On “enter”, if the highlighted item isn’t disabled, set the value and close.\n                              else if ( !P.$root.find( '.' + CLASSES.highlighted ).hasClass( CLASSES.disabled ) ) {\n                                  P.set( 'select', P.component.item.highlight );\n                                  if ( SETTINGS.closeOnSelect ) {\n                                      P.close( true );\n                                  }\n                              }\n                          }\n\n\n                          // If the target is within the root and “enter” is pressed,\n                          // prevent the default action and trigger a click on the target instead.\n                          else if ( $$$1.contains( P.$root[0], target ) && keycode == 13 ) {\n                              event.preventDefault();\n                              target.click();\n                          }\n                      });\n                  }\n\n                  // Trigger the queued “open” events.\n                  return P.trigger( 'open' )\n              }, //open\n\n\n              /**\n               * Close the picker\n               */\n              close: function( giveFocus ) {\n\n                  // If we need to give focus, do it before changing states.\n                  if ( giveFocus ) {\n                      if ( SETTINGS.editable ) {\n                          ELEMENT.focus();\n                      }\n                      else {\n                          // ....ah yes! It would’ve been incomplete without a crazy workaround for IE :|\n                          // The focus is triggered *after* the close has completed - causing it\n                          // to open again. So unbind and rebind the event at the next tick.\n                          P.$holder.off( 'focus.toOpen' ).focus();\n                          setTimeout( function() {\n                              P.$holder.on( 'focus.toOpen', handleFocusToOpenEvent );\n                          }, 0 );\n                      }\n                  }\n\n                  // Remove the “active” class.\n                  $ELEMENT.removeClass( CLASSES.active );\n                  aria( ELEMENT, 'expanded', false );\n\n                  // * A Firefox bug, when `html` has `overflow:hidden`, results in\n                  //   killing transitions :(. So remove the “opened” state on the next tick.\n                  //   Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=625289\n                  setTimeout( function() {\n\n                      // Remove the “opened” and “focused” class from the picker root.\n                      P.$root.removeClass( CLASSES.opened + ' ' + CLASSES.focused );\n                      aria( P.$root[0], 'hidden', true );\n\n                  }, 0 );\n\n                  // If it’s already closed, do nothing more.\n                  if ( !STATE.open ) return P\n\n                  // Set it as closed.\n                  STATE.open = false;\n\n                  // Allow the page to scroll.\n                  if ( IS_DEFAULT_THEME ) {\n                      $html.\n                          css( 'overflow', '' ).\n                          css( 'padding-right', '-=' + getScrollbarWidth() );\n                  }\n\n                  // Unbind the document events.\n                  $document.off( '.' + STATE.id );\n\n                  // Trigger the queued “close” events.\n                  return P.trigger( 'close' )\n              }, //close\n\n\n              /**\n               * Clear the values\n               */\n              clear: function( options ) {\n                  return P.set( 'clear', null, options )\n              }, //clear\n\n\n              /**\n               * Set something\n               */\n              set: function( thing, value, options ) {\n\n                  var thingItem, thingValue,\n                      thingIsObject = $$$1.isPlainObject( thing ),\n                      thingObject = thingIsObject ? thing : {};\n\n                  // Make sure we have usable options.\n                  options = thingIsObject && $$$1.isPlainObject( value ) ? value : options || {};\n\n                  if ( thing ) {\n\n                      // If the thing isn’t an object, make it one.\n                      if ( !thingIsObject ) {\n                          thingObject[ thing ] = value;\n                      }\n\n                      // Go through the things of items to set.\n                      for ( thingItem in thingObject ) {\n\n                          // Grab the value of the thing.\n                          thingValue = thingObject[ thingItem ];\n\n                          // First, if the item exists and there’s a value, set it.\n                          if ( thingItem in P.component.item ) {\n                              if ( thingValue === undefined ) thingValue = null;\n                              P.component.set( thingItem, thingValue, options );\n                          }\n\n                          // Then, check to update the element value and broadcast a change.\n                          if ( thingItem == 'select' || thingItem == 'clear' ) {\n                              $ELEMENT.\n                                  val( thingItem == 'clear' ? '' : P.get( thingItem, SETTINGS.format ) ).\n                                  trigger( 'change' );\n                          }\n                      }\n\n                      // Render a new picker.\n                      P.render();\n                  }\n\n                  // When the method isn’t muted, trigger queued “set” events and pass the `thingObject`.\n                  return options.muted ? P : P.trigger( 'set', thingObject )\n              }, //set\n\n\n              /**\n               * Get something\n               */\n              get: function( thing, format ) {\n\n                  // Make sure there’s something to get.\n                  thing = thing || 'value';\n\n                  // If a picker state exists, return that.\n                  if ( STATE[ thing ] != null ) {\n                      return STATE[ thing ]\n                  }\n\n                  // Return the submission value, if that.\n                  if ( thing == 'valueSubmit' ) {\n                      if ( P._hidden ) {\n                          return P._hidden.value\n                      }\n                      thing = 'value';\n                  }\n\n                  // Return the value, if that.\n                  if ( thing == 'value' ) {\n                      return ELEMENT.value\n                  }\n\n                  // Check if a component item exists, return that.\n                  if ( thing in P.component.item ) {\n                      if ( typeof format == 'string' ) {\n                          var thingValue = P.component.get( thing );\n                          return thingValue ?\n                              PickerConstructor._.trigger(\n                                  P.component.formats.toString,\n                                  P.component,\n                                  [ format, thingValue ]\n                              ) : ''\n                      }\n                      return P.component.get( thing )\n                  }\n              }, //get\n\n\n\n              /**\n               * Bind events on the things.\n               */\n              on: function( thing, method, internal ) {\n\n                  var thingName, thingMethod,\n                      thingIsObject = $$$1.isPlainObject( thing ),\n                      thingObject = thingIsObject ? thing : {};\n\n                  if ( thing ) {\n\n                      // If the thing isn’t an object, make it one.\n                      if ( !thingIsObject ) {\n                          thingObject[ thing ] = method;\n                      }\n\n                      // Go through the things to bind to.\n                      for ( thingName in thingObject ) {\n\n                          // Grab the method of the thing.\n                          thingMethod = thingObject[ thingName ];\n\n                          // If it was an internal binding, prefix it.\n                          if ( internal ) {\n                              thingName = '_' + thingName;\n                          }\n\n                          // Make sure the thing methods collection exists.\n                          STATE.methods[ thingName ] = STATE.methods[ thingName ] || [];\n\n                          // Add the method to the relative method collection.\n                          STATE.methods[ thingName ].push( thingMethod );\n                      }\n                  }\n\n                  return P\n              }, //on\n\n\n\n              /**\n               * Unbind events on the things.\n               */\n              off: function() {\n                  var i, thingName,\n                      names = arguments;\n                  for ( i = 0, namesCount = names.length; i < namesCount; i += 1 ) {\n                      thingName = names[i];\n                      if ( thingName in STATE.methods ) {\n                          delete STATE.methods[thingName];\n                      }\n                  }\n                  return P\n              },\n\n\n              /**\n               * Fire off method events.\n               */\n              trigger: function( name, data ) {\n                  var _trigger = function( name ) {\n                      var methodList = STATE.methods[ name ];\n                      if ( methodList ) {\n                          methodList.map( function( method ) {\n                              PickerConstructor._.trigger( method, P, [ data ] );\n                          });\n                      }\n                  };\n                  _trigger( '_' + name );\n                  _trigger( name );\n                  return P\n              } //trigger\n          }; //PickerInstance.prototype\n\n\n      /**\n       * Wrap the picker holder components together.\n       */\n      function createWrappedComponent() {\n\n          // Create a picker wrapper holder\n          return PickerConstructor._.node( 'div',\n\n              // Create a picker wrapper node\n              PickerConstructor._.node( 'div',\n\n                  // Create a picker frame\n                  PickerConstructor._.node( 'div',\n\n                      // Create a picker box node\n                      PickerConstructor._.node( 'div',\n\n                          // Create the components nodes.\n                          P.component.nodes( STATE.open ),\n\n                          // The picker box class\n                          CLASSES.box\n                      ),\n\n                      // Picker wrap class\n                      CLASSES.wrap\n                  ),\n\n                  // Picker frame class\n                  CLASSES.frame\n              ),\n\n              // Picker holder class\n              CLASSES.holder,\n\n              'tabindex=\"-1\"'\n          ) //endreturn\n      } //createWrappedComponent\n\n\n\n      /**\n       * Prepare the input element with all bindings.\n       */\n      function prepareElement() {\n\n          $ELEMENT.\n\n              // Store the picker data by component name.\n              data(NAME, P).\n\n              // Add the “input” class name.\n              addClass(CLASSES.input).\n\n              // If there’s a `data-value`, update the value of the element.\n              val( $ELEMENT.data('value') ?\n                  P.get('select', SETTINGS.format) :\n                  ELEMENT.value\n              );\n\n\n          // Only bind keydown events if the element isn’t editable.\n          if ( !SETTINGS.editable ) {\n\n              $ELEMENT.\n\n                  // On focus/click, open the picker.\n                  on( 'focus.' + STATE.id + ' click.' + STATE.id, function(event) {\n                      event.preventDefault();\n                      P.open();\n                  }).\n\n                  // Handle keyboard event based on the picker being opened or not.\n                  on( 'keydown.' + STATE.id, handleKeydownEvent );\n          }\n\n\n          // Update the aria attributes.\n          aria(ELEMENT, {\n              haspopup: true,\n              expanded: false,\n              readonly: false,\n              owns: ELEMENT.id + '_root'\n          });\n      }\n\n\n      /**\n       * Prepare the root picker element with all bindings.\n       */\n      function prepareElementRoot() {\n          aria( P.$root[0], 'hidden', true );\n      }\n\n\n       /**\n        * Prepare the holder picker element with all bindings.\n        */\n      function prepareElementHolder() {\n\n          P.$holder.\n\n              on({\n\n                  // For iOS8.\n                  keydown: handleKeydownEvent,\n\n                  'focus.toOpen': handleFocusToOpenEvent,\n\n                  blur: function() {\n                      // Remove the “target” class.\n                      $ELEMENT.removeClass( CLASSES.target );\n                  },\n\n                  // When something within the holder is focused, stop from bubbling\n                  // to the doc and remove the “focused” state from the root.\n                  focusin: function( event ) {\n                      P.$root.removeClass( CLASSES.focused );\n                      event.stopPropagation();\n                  },\n\n                  // When something within the holder is clicked, stop it\n                  // from bubbling to the doc.\n                  'mousedown click': function( event ) {\n\n                      var target = event.target;\n\n                      // Make sure the target isn’t the root holder so it can bubble up.\n                      if ( target != P.$holder[0] ) {\n\n                          event.stopPropagation();\n\n                          // * For mousedown events, cancel the default action in order to\n                          //   prevent cases where focus is shifted onto external elements\n                          //   when using things like jQuery mobile or MagnificPopup (ref: #249 & #120).\n                          //   Also, for Firefox, don’t prevent action on the `option` element.\n                          if ( event.type == 'mousedown' && !$$$1( target ).is( 'input, select, textarea, button, option' )) {\n\n                              event.preventDefault();\n\n                              // Re-focus onto the holder so that users can click away\n                              // from elements focused within the picker.\n                              P.$holder[0].focus();\n                          }\n                      }\n                  }\n\n              }).\n\n              // If there’s a click on an actionable element, carry out the actions.\n              on( 'click', '[data-pick], [data-nav], [data-clear], [data-close]', function() {\n\n                  var $target = $$$1( this ),\n                      targetData = $target.data(),\n                      targetDisabled = $target.hasClass( CLASSES.navDisabled ) || $target.hasClass( CLASSES.disabled ),\n\n                      // * For IE, non-focusable elements can be active elements as well\n                      //   (http://stackoverflow.com/a/2684561).\n                      activeElement = getActiveElement();\n                      activeElement = activeElement && ( activeElement.type || activeElement.href );\n\n                  // If it’s disabled or nothing inside is actively focused, re-focus the element.\n                  if ( targetDisabled || activeElement && !$$$1.contains( P.$root[0], activeElement ) ) {\n                      P.$holder[0].focus();\n                  }\n\n                  // If something is superficially changed, update the `highlight` based on the `nav`.\n                  if ( !targetDisabled && targetData.nav ) {\n                      P.set( 'highlight', P.component.item.highlight, { nav: targetData.nav } );\n                  }\n\n                  // If something is picked, set `select` then close with focus.\n                  else if ( !targetDisabled && 'pick' in targetData ) {\n                      P.set( 'select', targetData.pick );\n                      if ( SETTINGS.closeOnSelect ) {\n                          P.close( true );\n                      }\n                  }\n\n                  // If a “clear” button is pressed, empty the values and close with focus.\n                  else if ( targetData.clear ) {\n                      P.clear();\n                      if ( SETTINGS.closeOnClear ) {\n                          P.close( true );\n                      }\n                  }\n\n                  else if ( targetData.close ) {\n                      P.close( true );\n                  }\n\n              }); //P.$holder\n\n      }\n\n\n       /**\n        * Prepare the hidden input element along with all bindings.\n        */\n      function prepareElementHidden() {\n\n          var name;\n\n          if ( SETTINGS.hiddenName === true ) {\n              name = ELEMENT.name;\n              ELEMENT.name = '';\n          }\n          else {\n              name = [\n                  typeof SETTINGS.hiddenPrefix == 'string' ? SETTINGS.hiddenPrefix : '',\n                  typeof SETTINGS.hiddenSuffix == 'string' ? SETTINGS.hiddenSuffix : '_submit'\n              ];\n              name = name[0] + ELEMENT.name + name[1];\n          }\n\n          P._hidden = $$$1(\n              '<input ' +\n              'type=hidden ' +\n\n              // Create the name using the original input’s with a prefix and suffix.\n              'name=\"' + name + '\"' +\n\n              // If the element has a value, set the hidden value as well.\n              (\n                  $ELEMENT.data('value') || ELEMENT.value ?\n                      ' value=\"' + P.get('select', SETTINGS.formatSubmit) + '\"' :\n                      ''\n              ) +\n              '>'\n          )[0];\n\n          $ELEMENT.\n\n              // If the value changes, update the hidden input with the correct format.\n              on('change.' + STATE.id, function() {\n                  P._hidden.value = ELEMENT.value ?\n                      P.get('select', SETTINGS.formatSubmit) :\n                      '';\n              });\n      }\n\n\n      // Wait for transitions to end before focusing the holder. Otherwise, while\n      // using the `container` option, the view jumps to the container.\n      function focusPickerOnceOpened() {\n\n          if (IS_DEFAULT_THEME && supportsTransitions) {\n              P.$holder.find('.' + CLASSES.frame).one('transitionend', function() {\n                  P.$holder[0].focus();\n              });\n          }\n          else {\n              P.$holder[0].focus();\n          }\n      }\n\n\n      function handleFocusToOpenEvent(event) {\n\n          // Stop the event from propagating to the doc.\n          event.stopPropagation();\n\n          // Add the “target” class.\n          $ELEMENT.addClass( CLASSES.target );\n\n          // Add the “focused” class to the root.\n          P.$root.addClass( CLASSES.focused );\n\n          // And then finally open the picker.\n          P.open();\n      }\n\n\n      // For iOS8.\n      function handleKeydownEvent( event ) {\n\n          var keycode = event.keyCode,\n\n              // Check if one of the delete keys was pressed.\n              isKeycodeDelete = /^(8|46)$/.test(keycode);\n\n          // For some reason IE clears the input value on “escape”.\n          if ( keycode == 27 ) {\n              P.close( true );\n              return false\n          }\n\n          // Check if `space` or `delete` was pressed or the picker is closed with a key movement.\n          if ( keycode == 32 || isKeycodeDelete || !STATE.open && P.component.key[keycode] ) {\n\n              // Prevent it from moving the page and bubbling to doc.\n              event.preventDefault();\n              event.stopPropagation();\n\n              // If `delete` was pressed, clear the values and close the picker.\n              // Otherwise open the picker.\n              if ( isKeycodeDelete ) { P.clear().close(); }\n              else { P.open(); }\n          }\n      }\n\n\n      // Return a new picker instance.\n      return new PickerInstance()\n  } //PickerConstructor\n\n\n\n  /**\n   * The default classes and prefix to use for the HTML classes.\n   */\n  PickerConstructor.klasses = function( prefix ) {\n      prefix = prefix || 'picker';\n      return {\n\n          picker: prefix,\n          opened: prefix + '--opened',\n          focused: prefix + '--focused',\n\n          input: prefix + '__input',\n          active: prefix + '__input--active',\n          target: prefix + '__input--target',\n\n          holder: prefix + '__holder',\n\n          frame: prefix + '__frame',\n          wrap: prefix + '__wrap',\n\n          box: prefix + '__box'\n      }\n  }; //PickerConstructor.klasses\n\n\n\n  /**\n   * Check if the default theme is being used.\n   */\n  function isUsingDefaultTheme( element ) {\n\n      var theme,\n          prop = 'position';\n\n      // For IE.\n      if ( element.currentStyle ) {\n          theme = element.currentStyle[prop];\n      }\n\n      // For normal browsers.\n      else if ( window.getComputedStyle ) {\n          theme = getComputedStyle( element )[prop];\n      }\n\n      return theme == 'fixed'\n  }\n\n\n\n  /**\n   * Get the width of the browser’s scrollbar.\n   * Taken from: https://github.com/VodkaBears/Remodal/blob/master/src/jquery.remodal.js\n   */\n  function getScrollbarWidth() {\n\n      if ( $html.height() <= $window.height() ) {\n          return 0\n      }\n\n      var $outer = $$$1( '<div style=\"visibility:hidden;width:100px\" />' ).\n          appendTo( 'body' );\n\n      // Get the width without scrollbars.\n      var widthWithoutScroll = $outer[0].offsetWidth;\n\n      // Force adding scrollbars.\n      $outer.css( 'overflow', 'scroll' );\n\n      // Add the inner div.\n      var $inner = $$$1( '<div style=\"width:100%\" />' ).appendTo( $outer );\n\n      // Get the width with scrollbars.\n      var widthWithScroll = $inner[0].offsetWidth;\n\n      // Remove the divs.\n      $outer.remove();\n\n      // Return the difference between the widths.\n      return widthWithoutScroll - widthWithScroll\n  }\n\n\n\n  /**\n   * PickerConstructor helper methods.\n   */\n  PickerConstructor._ = {\n\n      /**\n       * Create a group of nodes. Expects:\n       * `\n          {\n              min:    {Integer},\n              max:    {Integer},\n              i:      {Integer},\n              node:   {String},\n              item:   {Function}\n          }\n       * `\n       */\n      group: function( groupObject ) {\n\n          var\n              // Scope for the looped object\n              loopObjectScope,\n\n              // Create the nodes list\n              nodesList = '',\n\n              // The counter starts from the `min`\n              counter = PickerConstructor._.trigger( groupObject.min, groupObject );\n\n\n          // Loop from the `min` to `max`, incrementing by `i`\n          for ( ; counter <= PickerConstructor._.trigger( groupObject.max, groupObject, [ counter ] ); counter += groupObject.i ) {\n\n              // Trigger the `item` function within scope of the object\n              loopObjectScope = PickerConstructor._.trigger( groupObject.item, groupObject, [ counter ] );\n\n              // Splice the subgroup and create nodes out of the sub nodes\n              nodesList += PickerConstructor._.node(\n                  groupObject.node,\n                  loopObjectScope[ 0 ],   // the node\n                  loopObjectScope[ 1 ],   // the classes\n                  loopObjectScope[ 2 ]    // the attributes\n              );\n          }\n\n          // Return the list of nodes\n          return nodesList\n      }, //group\n\n\n      /**\n       * Create a dom node string\n       */\n      node: function( wrapper, item, klass, attribute ) {\n\n          // If the item is false-y, just return an empty string\n          if ( !item ) return ''\n\n          // If the item is an array, do a join\n          item = $$$1.isArray( item ) ? item.join( '' ) : item;\n\n          // Check for the class\n          klass = klass ? ' class=\"' + klass + '\"' : '';\n\n          // Check for any attributes\n          attribute = attribute ? ' ' + attribute : '';\n\n          // Return the wrapped item\n          return '<' + wrapper + klass + attribute + '>' + item + '</' + wrapper + '>'\n      }, //node\n\n\n      /**\n       * Lead numbers below 10 with a zero.\n       */\n      lead: function( number ) {\n          return ( number < 10 ? '0': '' ) + number\n      },\n\n\n      /**\n       * Trigger a function otherwise return the value.\n       */\n      trigger: function( callback, scope, args ) {\n          return typeof callback == 'function' ? callback.apply( scope, args || [] ) : callback\n      },\n\n\n      /**\n       * If the second character is a digit, length is 2 otherwise 1.\n       */\n      digits: function( string ) {\n          return ( /\\d/ ).test( string[ 1 ] ) ? 2 : 1\n      },\n\n\n      /**\n       * Tell if something is a date object.\n       */\n      isDate: function( value ) {\n          return {}.toString.call( value ).indexOf( 'Date' ) > -1 && this.isInteger( value.getDate() )\n      },\n\n\n      /**\n       * Tell if something is an integer.\n       */\n      isInteger: function( value ) {\n          return {}.toString.call( value ).indexOf( 'Number' ) > -1 && value % 1 === 0\n      },\n\n\n      /**\n       * Create ARIA attribute strings.\n       */\n      ariaAttr: ariaAttr\n  }; //PickerConstructor._\n\n\n\n  /**\n   * Extend the picker with a component and defaults.\n   */\n  PickerConstructor.extend = function( name, Component ) {\n\n      // Extend jQuery.\n      $$$1.fn[ name ] = function( options, action ) {\n\n          // Grab the component data.\n          var componentData = this.data( name );\n\n          // If the picker is requested, return the data object.\n          if ( options == 'picker' ) {\n              return componentData\n          }\n\n          // If the component data exists and `options` is a string, carry out the action.\n          if ( componentData && typeof options == 'string' ) {\n              return PickerConstructor._.trigger( componentData[ options ], componentData, [ action ] )\n          }\n\n          // Otherwise go through each matched element and if the component\n          // doesn’t exist, create a new picker using `this` element\n          // and merging the defaults and options with a deep copy.\n          return this.each( function() {\n              var $this = $$$1( this );\n              if ( !$this.data( name ) ) {\n                  new PickerConstructor( this, name, Component, options );\n              }\n          })\n      };\n\n      // Set the defaults.\n      $$$1.fn[ name ].defaults = Component.defaults;\n  }; //PickerConstructor.extend\n\n\n\n  function aria(element, attribute, value) {\n      if ( $$$1.isPlainObject(attribute) ) {\n          for ( var key in attribute ) {\n              ariaSet(element, key, attribute[key]);\n          }\n      }\n      else {\n          ariaSet(element, attribute, value);\n      }\n  }\n  function ariaSet(element, attribute, value) {\n      element.setAttribute(\n          (attribute == 'role' ? '' : 'aria-') + attribute,\n          value\n      );\n  }\n  function ariaAttr(attribute, data) {\n      if ( !$$$1.isPlainObject(attribute) ) {\n          attribute = { attribute: data };\n      }\n      data = '';\n      for ( var key in attribute ) {\n          var attr = (key == 'role' ? '' : 'aria-') + key,\n              attrVal = attribute[key];\n          data += attrVal == null ? '' : attr + '=\"' + attribute[key] + '\"';\n      }\n      return data\n  }\n\n  // IE8 bug throws an error for activeElements within iframes.\n  function getActiveElement() {\n      try {\n          return document.activeElement\n      } catch ( err ) { }\n  }\n\n\n\n  // Expose the picker constructor.\n  return PickerConstructor\n\n\n  }));\n  });\n\n  var picker$1 = /*#__PURE__*/Object.freeze({\n    default: picker,\n    __moduleExports: picker\n  });\n\n  var require$$0 = ( picker$1 && picker ) || picker$1;\n\n  var picker_date = createCommonjsModule(function (module, exports) {\n  /*!\n   * Date picker for pickadate.js v3.5.6\n   * http://amsul.github.io/pickadate.js/date.htm\n   */\n\n  (function ( factory ) {\n\n      // AMD.\n      if ( typeof undefined == 'function' && undefined.amd )\n          undefined( ['picker', 'jquery'], factory );\n\n      // Node.js/browserify.\n      else module.exports = factory( require$$0, $ );\n\n  }(function( Picker, $$$1 ) {\n\n\n  /**\n   * Globals and constants\n   */\n  var DAYS_IN_WEEK = 7,\n      WEEKS_IN_CALENDAR = 6,\n      _ = Picker._;\n\n\n\n  /**\n   * The date picker constructor\n   */\n  function DatePicker( picker, settings ) {\n\n      var calendar = this,\n          element = picker.$node[ 0 ],\n          elementValue = element.value,\n          elementDataValue = picker.$node.data( 'value' ),\n          valueString = elementDataValue || elementValue,\n          formatString = elementDataValue ? settings.formatSubmit : settings.format,\n          isRTL = function() {\n\n              return element.currentStyle ?\n\n                  // For IE.\n                  element.currentStyle.direction == 'rtl' :\n\n                  // For normal browsers.\n                  getComputedStyle( picker.$root[0] ).direction == 'rtl'\n          };\n\n      calendar.settings = settings;\n      calendar.$node = picker.$node;\n\n      // The queue of methods that will be used to build item objects.\n      calendar.queue = {\n          min: 'measure create',\n          max: 'measure create',\n          now: 'now create',\n          select: 'parse create validate',\n          highlight: 'parse navigate create validate',\n          view: 'parse create validate viewset',\n          disable: 'deactivate',\n          enable: 'activate'\n      };\n\n      // The component's item object.\n      calendar.item = {};\n\n      calendar.item.clear = null;\n      calendar.item.disable = ( settings.disable || [] ).slice( 0 );\n      calendar.item.enable = -(function( collectionDisabled ) {\n          return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1\n      })( calendar.item.disable );\n\n      calendar.\n          set( 'min', settings.min ).\n          set( 'max', settings.max ).\n          set( 'now' );\n\n      // When there’s a value, set the `select`, which in turn\n      // also sets the `highlight` and `view`.\n      if ( valueString ) {\n          calendar.set( 'select', valueString, {\n              format: formatString,\n              defaultValue: true\n          });\n      }\n\n      // If there’s no value, default to highlighting “today”.\n      else {\n          calendar.\n              set( 'select', null ).\n              set( 'highlight', calendar.item.now );\n      }\n\n\n      // The keycode to movement mapping.\n      calendar.key = {\n          40: 7, // Down\n          38: -7, // Up\n          39: function() { return isRTL() ? -1 : 1 }, // Right\n          37: function() { return isRTL() ? 1 : -1 }, // Left\n          go: function( timeChange ) {\n              var highlightedObject = calendar.item.highlight,\n                  targetDate = new Date( highlightedObject.year, highlightedObject.month, highlightedObject.date + timeChange );\n              calendar.set(\n                  'highlight',\n                  targetDate,\n                  { interval: timeChange }\n              );\n              this.render();\n          }\n      };\n\n\n      // Bind some picker events.\n      picker.\n          on( 'render', function() {\n              picker.$root.find( '.' + settings.klass.selectMonth ).on( 'change', function() {\n                  var value = this.value;\n                  if ( value ) {\n                      picker.set( 'highlight', [ picker.get( 'view' ).year, value, picker.get( 'highlight' ).date ] );\n                      picker.$root.find( '.' + settings.klass.selectMonth ).trigger( 'focus' );\n                  }\n              });\n              picker.$root.find( '.' + settings.klass.selectYear ).on( 'change', function() {\n                  var value = this.value;\n                  if ( value ) {\n                      picker.set( 'highlight', [ value, picker.get( 'view' ).month, picker.get( 'highlight' ).date ] );\n                      picker.$root.find( '.' + settings.klass.selectYear ).trigger( 'focus' );\n                  }\n              });\n          }, 1 ).\n          on( 'open', function() {\n              var includeToday = '';\n              if ( calendar.disabled( calendar.get('now') ) ) {\n                  includeToday = ':not(.' + settings.klass.buttonToday + ')';\n              }\n              picker.$root.find( 'button' + includeToday + ', select' ).attr( 'disabled', false );\n          }, 1 ).\n          on( 'close', function() {\n              picker.$root.find( 'button, select' ).attr( 'disabled', true );\n          }, 1 );\n\n  } //DatePicker\n\n\n  /**\n   * Set a datepicker item object.\n   */\n  DatePicker.prototype.set = function( type, value, options ) {\n\n      var calendar = this,\n          calendarItem = calendar.item;\n\n      // If the value is `null` just set it immediately.\n      if ( value === null ) {\n          if ( type == 'clear' ) type = 'select';\n          calendarItem[ type ] = value;\n          return calendar\n      }\n\n      // Otherwise go through the queue of methods, and invoke the functions.\n      // Update this as the time unit, and set the final value as this item.\n      // * In the case of `enable`, keep the queue but set `disable` instead.\n      //   And in the case of `flip`, keep the queue but set `enable` instead.\n      calendarItem[ ( type == 'enable' ? 'disable' : type == 'flip' ? 'enable' : type ) ] = calendar.queue[ type ].split( ' ' ).map( function( method ) {\n          value = calendar[ method ]( type, value, options );\n          return value\n      }).pop();\n\n      // Check if we need to cascade through more updates.\n      if ( type == 'select' ) {\n          calendar.set( 'highlight', calendarItem.select, options );\n      }\n      else if ( type == 'highlight' ) {\n          calendar.set( 'view', calendarItem.highlight, options );\n      }\n      else if ( type.match( /^(flip|min|max|disable|enable)$/ ) ) {\n          if ( calendarItem.select && calendar.disabled( calendarItem.select ) ) {\n              calendar.set( 'select', calendarItem.select, options );\n          }\n          if ( calendarItem.highlight && calendar.disabled( calendarItem.highlight ) ) {\n              calendar.set( 'highlight', calendarItem.highlight, options );\n          }\n      }\n\n      return calendar\n  }; //DatePicker.prototype.set\n\n\n  /**\n   * Get a datepicker item object.\n   */\n  DatePicker.prototype.get = function( type ) {\n      return this.item[ type ]\n  }; //DatePicker.prototype.get\n\n\n  /**\n   * Create a picker date object.\n   */\n  DatePicker.prototype.create = function( type, value, options ) {\n\n      var isInfiniteValue,\n          calendar = this;\n\n      // If there’s no value, use the type as the value.\n      value = value === undefined ? type : value;\n\n\n      // If it’s infinity, update the value.\n      if ( value == -Infinity || value == Infinity ) {\n          isInfiniteValue = value;\n      }\n\n      // If it’s an object, use the native date object.\n      else if ( $$$1.isPlainObject( value ) && _.isInteger( value.pick ) ) {\n          value = value.obj;\n      }\n\n      // If it’s an array, convert it into a date and make sure\n      // that it’s a valid date – otherwise default to today.\n      else if ( $$$1.isArray( value ) ) {\n          value = new Date( value[ 0 ], value[ 1 ], value[ 2 ] );\n          value = _.isDate( value ) ? value : calendar.create().obj;\n      }\n\n      // If it’s a number or date object, make a normalized date.\n      else if ( _.isInteger( value ) || _.isDate( value ) ) {\n          value = calendar.normalize( new Date( value ), options );\n      }\n\n      // If it’s a literal true or any other case, set it to now.\n      else /*if ( value === true )*/ {\n          value = calendar.now( type, value, options );\n      }\n\n      // Return the compiled object.\n      return {\n          year: isInfiniteValue || value.getFullYear(),\n          month: isInfiniteValue || value.getMonth(),\n          date: isInfiniteValue || value.getDate(),\n          day: isInfiniteValue || value.getDay(),\n          obj: isInfiniteValue || value,\n          pick: isInfiniteValue || value.getTime()\n      }\n  }; //DatePicker.prototype.create\n\n\n  /**\n   * Create a range limit object using an array, date object,\n   * literal “true”, or integer relative to another time.\n   */\n  DatePicker.prototype.createRange = function( from, to ) {\n\n      var calendar = this,\n          createDate = function( date ) {\n              if ( date === true || $$$1.isArray( date ) || _.isDate( date ) ) {\n                  return calendar.create( date )\n              }\n              return date\n          };\n\n      // Create objects if possible.\n      if ( !_.isInteger( from ) ) {\n          from = createDate( from );\n      }\n      if ( !_.isInteger( to ) ) {\n          to = createDate( to );\n      }\n\n      // Create relative dates.\n      if ( _.isInteger( from ) && $$$1.isPlainObject( to ) ) {\n          from = [ to.year, to.month, to.date + from ];\n      }\n      else if ( _.isInteger( to ) && $$$1.isPlainObject( from ) ) {\n          to = [ from.year, from.month, from.date + to ];\n      }\n\n      return {\n          from: createDate( from ),\n          to: createDate( to )\n      }\n  }; //DatePicker.prototype.createRange\n\n\n  /**\n   * Check if a date unit falls within a date range object.\n   */\n  DatePicker.prototype.withinRange = function( range, dateUnit ) {\n      range = this.createRange(range.from, range.to);\n      return dateUnit.pick >= range.from.pick && dateUnit.pick <= range.to.pick\n  };\n\n\n  /**\n   * Check if two date range objects overlap.\n   */\n  DatePicker.prototype.overlapRanges = function( one, two ) {\n\n      var calendar = this;\n\n      // Convert the ranges into comparable dates.\n      one = calendar.createRange( one.from, one.to );\n      two = calendar.createRange( two.from, two.to );\n\n      return calendar.withinRange( one, two.from ) || calendar.withinRange( one, two.to ) ||\n          calendar.withinRange( two, one.from ) || calendar.withinRange( two, one.to )\n  };\n\n\n  /**\n   * Get the date today.\n   */\n  DatePicker.prototype.now = function( type, value, options ) {\n      value = new Date();\n      if ( options && options.rel ) {\n          value.setDate( value.getDate() + options.rel );\n      }\n      return this.normalize( value, options )\n  };\n\n\n  /**\n   * Navigate to next/prev month.\n   */\n  DatePicker.prototype.navigate = function( type, value, options ) {\n\n      var targetDateObject,\n          targetYear,\n          targetMonth,\n          targetDate,\n          isTargetArray = $$$1.isArray( value ),\n          isTargetObject = $$$1.isPlainObject( value ),\n          viewsetObject = this.item.view;/*,\n          safety = 100*/\n\n\n      if ( isTargetArray || isTargetObject ) {\n\n          if ( isTargetObject ) {\n              targetYear = value.year;\n              targetMonth = value.month;\n              targetDate = value.date;\n          }\n          else {\n              targetYear = +value[0];\n              targetMonth = +value[1];\n              targetDate = +value[2];\n          }\n\n          // If we’re navigating months but the view is in a different\n          // month, navigate to the view’s year and month.\n          if ( options && options.nav && viewsetObject && viewsetObject.month !== targetMonth ) {\n              targetYear = viewsetObject.year;\n              targetMonth = viewsetObject.month;\n          }\n\n          // Figure out the expected target year and month.\n          targetDateObject = new Date( targetYear, targetMonth + ( options && options.nav ? options.nav : 0 ), 1 );\n          targetYear = targetDateObject.getFullYear();\n          targetMonth = targetDateObject.getMonth();\n\n          // If the month we’re going to doesn’t have enough days,\n          // keep decreasing the date until we reach the month’s last date.\n          while ( /*safety &&*/ new Date( targetYear, targetMonth, targetDate ).getMonth() !== targetMonth ) {\n              targetDate -= 1;\n              /*safety -= 1\n              if ( !safety ) {\n                  throw 'Fell into an infinite loop while navigating to ' + new Date( targetYear, targetMonth, targetDate ) + '.'\n              }*/\n          }\n\n          value = [ targetYear, targetMonth, targetDate ];\n      }\n\n      return value\n  }; //DatePicker.prototype.navigate\n\n\n  /**\n   * Normalize a date by setting the hours to midnight.\n   */\n  DatePicker.prototype.normalize = function( value/*, options*/ ) {\n      value.setHours( 0, 0, 0, 0 );\n      return value\n  };\n\n\n  /**\n   * Measure the range of dates.\n   */\n  DatePicker.prototype.measure = function( type, value/*, options*/ ) {\n\n      var calendar = this;\n\n      // If it’s anything false-y, remove the limits.\n      if ( !value ) {\n          value = type == 'min' ? -Infinity : Infinity;\n      }\n\n      // If it’s a string, parse it.\n      else if ( typeof value == 'string' ) {\n          value = calendar.parse( type, value );\n      }\n\n      // If it's an integer, get a date relative to today.\n      else if ( _.isInteger( value ) ) {\n          value = calendar.now( type, value, { rel: value } );\n      }\n\n      return value\n  }; ///DatePicker.prototype.measure\n\n\n  /**\n   * Create a viewset object based on navigation.\n   */\n  DatePicker.prototype.viewset = function( type, dateObject/*, options*/ ) {\n      return this.create([ dateObject.year, dateObject.month, 1 ])\n  };\n\n\n  /**\n   * Validate a date as enabled and shift if needed.\n   */\n  DatePicker.prototype.validate = function( type, dateObject, options ) {\n\n      var calendar = this,\n\n          // Keep a reference to the original date.\n          originalDateObject = dateObject,\n\n          // Make sure we have an interval.\n          interval = options && options.interval ? options.interval : 1,\n\n          // Check if the calendar enabled dates are inverted.\n          isFlippedBase = calendar.item.enable === -1,\n\n          // Check if we have any enabled dates after/before now.\n          hasEnabledBeforeTarget, hasEnabledAfterTarget,\n\n          // The min & max limits.\n          minLimitObject = calendar.item.min,\n          maxLimitObject = calendar.item.max,\n\n          // Check if we’ve reached the limit during shifting.\n          reachedMin, reachedMax,\n\n          // Check if the calendar is inverted and at least one weekday is enabled.\n          hasEnabledWeekdays = isFlippedBase && calendar.item.disable.filter( function( value ) {\n\n              // If there’s a date, check where it is relative to the target.\n              if ( $$$1.isArray( value ) ) {\n                  var dateTime = calendar.create( value ).pick;\n                  if ( dateTime < dateObject.pick ) hasEnabledBeforeTarget = true;\n                  else if ( dateTime > dateObject.pick ) hasEnabledAfterTarget = true;\n              }\n\n              // Return only integers for enabled weekdays.\n              return _.isInteger( value )\n          }).length;/*,\n\n          safety = 100*/\n\n\n\n      // Cases to validate for:\n      // [1] Not inverted and date disabled.\n      // [2] Inverted and some dates enabled.\n      // [3] Not inverted and out of range.\n      //\n      // Cases to **not** validate for:\n      // • Navigating months.\n      // • Not inverted and date enabled.\n      // • Inverted and all dates disabled.\n      // • ..and anything else.\n      if ( !options || (!options.nav && !options.defaultValue) ) if (\n          /* 1 */ ( !isFlippedBase && calendar.disabled( dateObject ) ) ||\n          /* 2 */ ( isFlippedBase && calendar.disabled( dateObject ) && ( hasEnabledWeekdays || hasEnabledBeforeTarget || hasEnabledAfterTarget ) ) ||\n          /* 3 */ ( !isFlippedBase && (dateObject.pick <= minLimitObject.pick || dateObject.pick >= maxLimitObject.pick) )\n      ) {\n\n\n          // When inverted, flip the direction if there aren’t any enabled weekdays\n          // and there are no enabled dates in the direction of the interval.\n          if ( isFlippedBase && !hasEnabledWeekdays && ( ( !hasEnabledAfterTarget && interval > 0 ) || ( !hasEnabledBeforeTarget && interval < 0 ) ) ) {\n              interval *= -1;\n          }\n\n\n          // Keep looping until we reach an enabled date.\n          while ( /*safety &&*/ calendar.disabled( dateObject ) ) {\n\n              /*safety -= 1\n              if ( !safety ) {\n                  throw 'Fell into an infinite loop while validating ' + dateObject.obj + '.'\n              }*/\n\n\n              // If we’ve looped into the next/prev month with a large interval, return to the original date and flatten the interval.\n              if ( Math.abs( interval ) > 1 && ( dateObject.month < originalDateObject.month || dateObject.month > originalDateObject.month ) ) {\n                  dateObject = originalDateObject;\n                  interval = interval > 0 ? 1 : -1;\n              }\n\n\n              // If we’ve reached the min/max limit, reverse the direction, flatten the interval and set it to the limit.\n              if ( dateObject.pick <= minLimitObject.pick ) {\n                  reachedMin = true;\n                  interval = 1;\n                  dateObject = calendar.create([\n                      minLimitObject.year,\n                      minLimitObject.month,\n                      minLimitObject.date + (dateObject.pick === minLimitObject.pick ? 0 : -1)\n                  ]);\n              }\n              else if ( dateObject.pick >= maxLimitObject.pick ) {\n                  reachedMax = true;\n                  interval = -1;\n                  dateObject = calendar.create([\n                      maxLimitObject.year,\n                      maxLimitObject.month,\n                      maxLimitObject.date + (dateObject.pick === maxLimitObject.pick ? 0 : 1)\n                  ]);\n              }\n\n\n              // If we’ve reached both limits, just break out of the loop.\n              if ( reachedMin && reachedMax ) {\n                  break\n              }\n\n\n              // Finally, create the shifted date using the interval and keep looping.\n              dateObject = calendar.create([ dateObject.year, dateObject.month, dateObject.date + interval ]);\n          }\n\n      } //endif\n\n\n      // Return the date object settled on.\n      return dateObject\n  }; //DatePicker.prototype.validate\n\n\n  /**\n   * Check if a date is disabled.\n   */\n  DatePicker.prototype.disabled = function( dateToVerify ) {\n\n      var\n          calendar = this,\n\n          // Filter through the disabled dates to check if this is one.\n          isDisabledMatch = calendar.item.disable.filter( function( dateToDisable ) {\n\n              // If the date is a number, match the weekday with 0index and `firstDay` check.\n              if ( _.isInteger( dateToDisable ) ) {\n                  return dateToVerify.day === ( calendar.settings.firstDay ? dateToDisable : dateToDisable - 1 ) % 7\n              }\n\n              // If it’s an array or a native JS date, create and match the exact date.\n              if ( $$$1.isArray( dateToDisable ) || _.isDate( dateToDisable ) ) {\n                  return dateToVerify.pick === calendar.create( dateToDisable ).pick\n              }\n\n              // If it’s an object, match a date within the “from” and “to” range.\n              if ( $$$1.isPlainObject( dateToDisable ) ) {\n                  return calendar.withinRange( dateToDisable, dateToVerify )\n              }\n          });\n\n      // If this date matches a disabled date, confirm it’s not inverted.\n      isDisabledMatch = isDisabledMatch.length && !isDisabledMatch.filter(function( dateToDisable ) {\n          return $$$1.isArray( dateToDisable ) && dateToDisable[3] == 'inverted' ||\n              $$$1.isPlainObject( dateToDisable ) && dateToDisable.inverted\n      }).length;\n\n      // Check the calendar “enabled” flag and respectively flip the\n      // disabled state. Then also check if it’s beyond the min/max limits.\n      return calendar.item.enable === -1 ? !isDisabledMatch : isDisabledMatch ||\n          dateToVerify.pick < calendar.item.min.pick ||\n          dateToVerify.pick > calendar.item.max.pick\n\n  }; //DatePicker.prototype.disabled\n\n\n  /**\n   * Parse a string into a usable type.\n   */\n  DatePicker.prototype.parse = function( type, value, options ) {\n\n      var calendar = this,\n          parsingObject = {};\n\n      // If it’s already parsed, we’re good.\n      if ( !value || typeof value != 'string' ) {\n          return value\n      }\n\n      // We need a `.format` to parse the value with.\n      if ( !( options && options.format ) ) {\n          options = options || {};\n          options.format = calendar.settings.format;\n      }\n\n      // Convert the format into an array and then map through it.\n      calendar.formats.toArray( options.format ).map( function( label ) {\n\n          var\n              // Grab the formatting label.\n              formattingLabel = calendar.formats[ label ],\n\n              // The format length is from the formatting label function or the\n              // label length without the escaping exclamation (!) mark.\n              formatLength = formattingLabel ? _.trigger( formattingLabel, calendar, [ value, parsingObject ] ) : label.replace( /^!/, '' ).length;\n\n          // If there's a format label, split the value up to the format length.\n          // Then add it to the parsing object with appropriate label.\n          if ( formattingLabel ) {\n              parsingObject[ label ] = value.substr( 0, formatLength );\n          }\n\n          // Update the value as the substring from format length to end.\n          value = value.substr( formatLength );\n      });\n\n      // Compensate for month 0index.\n      return [\n          parsingObject.yyyy || parsingObject.yy,\n          +( parsingObject.mm || parsingObject.m ) - 1,\n          parsingObject.dd || parsingObject.d\n      ]\n  }; //DatePicker.prototype.parse\n\n\n  /**\n   * Various formats to display the object in.\n   */\n  DatePicker.prototype.formats = (function() {\n\n      // Return the length of the first word in a collection.\n      function getWordLengthFromCollection( string, collection, dateObject ) {\n\n          // Grab the first word from the string.\n          // Regex pattern from http://stackoverflow.com/q/150033\n          var word = string.match( /[^\\x00-\\x7F]+|\\w+/ )[ 0 ];\n\n          // If there's no month index, add it to the date object\n          if ( !dateObject.mm && !dateObject.m ) {\n              dateObject.m = collection.indexOf( word ) + 1;\n          }\n\n          // Return the length of the word.\n          return word.length\n      }\n\n      // Get the length of the first word in a string.\n      function getFirstWordLength( string ) {\n          return string.match( /\\w+/ )[ 0 ].length\n      }\n\n      return {\n\n          d: function( string, dateObject ) {\n\n              // If there's string, then get the digits length.\n              // Otherwise return the selected date.\n              return string ? _.digits( string ) : dateObject.date\n          },\n          dd: function( string, dateObject ) {\n\n              // If there's a string, then the length is always 2.\n              // Otherwise return the selected date with a leading zero.\n              return string ? 2 : _.lead( dateObject.date )\n          },\n          ddd: function( string, dateObject ) {\n\n              // If there's a string, then get the length of the first word.\n              // Otherwise return the short selected weekday.\n              return string ? getFirstWordLength( string ) : this.settings.weekdaysShort[ dateObject.day ]\n          },\n          dddd: function( string, dateObject ) {\n\n              // If there's a string, then get the length of the first word.\n              // Otherwise return the full selected weekday.\n              return string ? getFirstWordLength( string ) : this.settings.weekdaysFull[ dateObject.day ]\n          },\n          m: function( string, dateObject ) {\n\n              // If there's a string, then get the length of the digits\n              // Otherwise return the selected month with 0index compensation.\n              return string ? _.digits( string ) : dateObject.month + 1\n          },\n          mm: function( string, dateObject ) {\n\n              // If there's a string, then the length is always 2.\n              // Otherwise return the selected month with 0index and leading zero.\n              return string ? 2 : _.lead( dateObject.month + 1 )\n          },\n          mmm: function( string, dateObject ) {\n\n              var collection = this.settings.monthsShort;\n\n              // If there's a string, get length of the relevant month from the short\n              // months collection. Otherwise return the selected month from that collection.\n              return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.month ]\n          },\n          mmmm: function( string, dateObject ) {\n\n              var collection = this.settings.monthsFull;\n\n              // If there's a string, get length of the relevant month from the full\n              // months collection. Otherwise return the selected month from that collection.\n              return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.month ]\n          },\n          yy: function( string, dateObject ) {\n\n              // If there's a string, then the length is always 2.\n              // Otherwise return the selected year by slicing out the first 2 digits.\n              return string ? 2 : ( '' + dateObject.year ).slice( 2 )\n          },\n          yyyy: function( string, dateObject ) {\n\n              // If there's a string, then the length is always 4.\n              // Otherwise return the selected year.\n              return string ? 4 : dateObject.year\n          },\n\n          // Create an array by splitting the formatting string passed.\n          toArray: function( formatString ) { return formatString.split( /(d{1,4}|m{1,4}|y{4}|yy|!.)/g ) },\n\n          // Format an object into a string using the formatting options.\n          toString: function ( formatString, itemObject ) {\n              var calendar = this;\n              return calendar.formats.toArray( formatString ).map( function( label ) {\n                  return _.trigger( calendar.formats[ label ], calendar, [ 0, itemObject ] ) || label.replace( /^!/, '' )\n              }).join( '' )\n          }\n      }\n  })(); //DatePicker.prototype.formats\n\n\n\n\n  /**\n   * Check if two date units are the exact.\n   */\n  DatePicker.prototype.isDateExact = function( one, two ) {\n\n      var calendar = this;\n\n      // When we’re working with weekdays, do a direct comparison.\n      if (\n          ( _.isInteger( one ) && _.isInteger( two ) ) ||\n          ( typeof one == 'boolean' && typeof two == 'boolean' )\n       ) {\n          return one === two\n      }\n\n      // When we’re working with date representations, compare the “pick” value.\n      if (\n          ( _.isDate( one ) || $$$1.isArray( one ) ) &&\n          ( _.isDate( two ) || $$$1.isArray( two ) )\n      ) {\n          return calendar.create( one ).pick === calendar.create( two ).pick\n      }\n\n      // When we’re working with range objects, compare the “from” and “to”.\n      if ( $$$1.isPlainObject( one ) && $$$1.isPlainObject( two ) ) {\n          return calendar.isDateExact( one.from, two.from ) && calendar.isDateExact( one.to, two.to )\n      }\n\n      return false\n  };\n\n\n  /**\n   * Check if two date units overlap.\n   */\n  DatePicker.prototype.isDateOverlap = function( one, two ) {\n\n      var calendar = this,\n          firstDay = calendar.settings.firstDay ? 1 : 0;\n\n      // When we’re working with a weekday index, compare the days.\n      if ( _.isInteger( one ) && ( _.isDate( two ) || $$$1.isArray( two ) ) ) {\n          one = one % 7 + firstDay;\n          return one === calendar.create( two ).day + 1\n      }\n      if ( _.isInteger( two ) && ( _.isDate( one ) || $$$1.isArray( one ) ) ) {\n          two = two % 7 + firstDay;\n          return two === calendar.create( one ).day + 1\n      }\n\n      // When we’re working with range objects, check if the ranges overlap.\n      if ( $$$1.isPlainObject( one ) && $$$1.isPlainObject( two ) ) {\n          return calendar.overlapRanges( one, two )\n      }\n\n      return false\n  };\n\n\n  /**\n   * Flip the “enabled” state.\n   */\n  DatePicker.prototype.flipEnable = function(val) {\n      var itemObject = this.item;\n      itemObject.enable = val || (itemObject.enable == -1 ? 1 : -1);\n  };\n\n\n  /**\n   * Mark a collection of dates as “disabled”.\n   */\n  DatePicker.prototype.deactivate = function( type, datesToDisable ) {\n\n      var calendar = this,\n          disabledItems = calendar.item.disable.slice(0);\n\n\n      // If we’re flipping, that’s all we need to do.\n      if ( datesToDisable == 'flip' ) {\n          calendar.flipEnable();\n      }\n\n      else if ( datesToDisable === false ) {\n          calendar.flipEnable(1);\n          disabledItems = [];\n      }\n\n      else if ( datesToDisable === true ) {\n          calendar.flipEnable(-1);\n          disabledItems = [];\n      }\n\n      // Otherwise go through the dates to disable.\n      else {\n\n          datesToDisable.map(function( unitToDisable ) {\n\n              var matchFound;\n\n              // When we have disabled items, check for matches.\n              // If something is matched, immediately break out.\n              for ( var index = 0; index < disabledItems.length; index += 1 ) {\n                  if ( calendar.isDateExact( unitToDisable, disabledItems[index] ) ) {\n                      matchFound = true;\n                      break\n                  }\n              }\n\n              // If nothing was found, add the validated unit to the collection.\n              if ( !matchFound ) {\n                  if (\n                      _.isInteger( unitToDisable ) ||\n                      _.isDate( unitToDisable ) ||\n                      $$$1.isArray( unitToDisable ) ||\n                      ( $$$1.isPlainObject( unitToDisable ) && unitToDisable.from && unitToDisable.to )\n                  ) {\n                      disabledItems.push( unitToDisable );\n                  }\n              }\n          });\n      }\n\n      // Return the updated collection.\n      return disabledItems\n  }; //DatePicker.prototype.deactivate\n\n\n  /**\n   * Mark a collection of dates as “enabled”.\n   */\n  DatePicker.prototype.activate = function( type, datesToEnable ) {\n\n      var calendar = this,\n          disabledItems = calendar.item.disable,\n          disabledItemsCount = disabledItems.length;\n\n      // If we’re flipping, that’s all we need to do.\n      if ( datesToEnable == 'flip' ) {\n          calendar.flipEnable();\n      }\n\n      else if ( datesToEnable === true ) {\n          calendar.flipEnable(1);\n          disabledItems = [];\n      }\n\n      else if ( datesToEnable === false ) {\n          calendar.flipEnable(-1);\n          disabledItems = [];\n      }\n\n      // Otherwise go through the disabled dates.\n      else {\n\n          datesToEnable.map(function( unitToEnable ) {\n\n              var matchFound,\n                  disabledUnit,\n                  index,\n                  isExactRange;\n\n              // Go through the disabled items and try to find a match.\n              for ( index = 0; index < disabledItemsCount; index += 1 ) {\n\n                  disabledUnit = disabledItems[index];\n\n                  // When an exact match is found, remove it from the collection.\n                  if ( calendar.isDateExact( disabledUnit, unitToEnable ) ) {\n                      matchFound = disabledItems[index] = null;\n                      isExactRange = true;\n                      break\n                  }\n\n                  // When an overlapped match is found, add the “inverted” state to it.\n                  else if ( calendar.isDateOverlap( disabledUnit, unitToEnable ) ) {\n                      if ( $$$1.isPlainObject( unitToEnable ) ) {\n                          unitToEnable.inverted = true;\n                          matchFound = unitToEnable;\n                      }\n                      else if ( $$$1.isArray( unitToEnable ) ) {\n                          matchFound = unitToEnable;\n                          if ( !matchFound[3] ) matchFound.push( 'inverted' );\n                      }\n                      else if ( _.isDate( unitToEnable ) ) {\n                          matchFound = [ unitToEnable.getFullYear(), unitToEnable.getMonth(), unitToEnable.getDate(), 'inverted' ];\n                      }\n                      break\n                  }\n              }\n\n              // If a match was found, remove a previous duplicate entry.\n              if ( matchFound ) for ( index = 0; index < disabledItemsCount; index += 1 ) {\n                  if ( calendar.isDateExact( disabledItems[index], unitToEnable ) ) {\n                      disabledItems[index] = null;\n                      break\n                  }\n              }\n\n              // In the event that we’re dealing with an exact range of dates,\n              // make sure there are no “inverted” dates because of it.\n              if ( isExactRange ) for ( index = 0; index < disabledItemsCount; index += 1 ) {\n                  if ( calendar.isDateOverlap( disabledItems[index], unitToEnable ) ) {\n                      disabledItems[index] = null;\n                      break\n                  }\n              }\n\n              // If something is still matched, add it into the collection.\n              if ( matchFound ) {\n                  disabledItems.push( matchFound );\n              }\n          });\n      }\n\n      // Return the updated collection.\n      return disabledItems.filter(function( val ) { return val != null })\n  }; //DatePicker.prototype.activate\n\n\n  /**\n   * Create a string for the nodes in the picker.\n   */\n  DatePicker.prototype.nodes = function( isOpen ) {\n\n      var\n          calendar = this,\n          settings = calendar.settings,\n          calendarItem = calendar.item,\n          nowObject = calendarItem.now,\n          selectedObject = calendarItem.select,\n          highlightedObject = calendarItem.highlight,\n          viewsetObject = calendarItem.view,\n          disabledCollection = calendarItem.disable,\n          minLimitObject = calendarItem.min,\n          maxLimitObject = calendarItem.max,\n\n\n          // Create the calendar table head using a copy of weekday labels collection.\n          // * We do a copy so we don't mutate the original array.\n          tableHead = (function( collection, fullCollection ) {\n\n              // If the first day should be Monday, move Sunday to the end.\n              if ( settings.firstDay ) {\n                  collection.push( collection.shift() );\n                  fullCollection.push( fullCollection.shift() );\n              }\n\n              // Create and return the table head group.\n              return _.node(\n                  'thead',\n                  _.node(\n                      'tr',\n                      _.group({\n                          min: 0,\n                          max: DAYS_IN_WEEK - 1,\n                          i: 1,\n                          node: 'th',\n                          item: function( counter ) {\n                              return [\n                                  collection[ counter ],\n                                  settings.klass.weekdays,\n                                  'scope=col title=\"' + fullCollection[ counter ] + '\"'\n                              ]\n                          }\n                      })\n                  )\n              ) //endreturn\n          })( ( settings.showWeekdaysFull ? settings.weekdaysFull : settings.weekdaysShort ).slice( 0 ), settings.weekdaysFull.slice( 0 ) ), //tableHead\n\n\n          // Create the nav for next/prev month.\n          createMonthNav = function( next ) {\n\n              // Otherwise, return the created month tag.\n              return _.node(\n                  'div',\n                  ' ',\n                  settings.klass[ 'nav' + ( next ? 'Next' : 'Prev' ) ] + (\n\n                      // If the focused month is outside the range, disabled the button.\n                      ( next && viewsetObject.year >= maxLimitObject.year && viewsetObject.month >= maxLimitObject.month ) ||\n                      ( !next && viewsetObject.year <= minLimitObject.year && viewsetObject.month <= minLimitObject.month ) ?\n                      ' ' + settings.klass.navDisabled : ''\n                  ),\n                  'data-nav=' + ( next || -1 ) + ' ' +\n                  _.ariaAttr({\n                      role: 'button',\n                      controls: calendar.$node[0].id + '_table'\n                  }) + ' ' +\n                  'title=\"' + (next ? settings.labelMonthNext : settings.labelMonthPrev ) + '\"'\n              ) //endreturn\n          }, //createMonthNav\n\n\n          // Create the month label.\n          createMonthLabel = function() {\n\n              var monthsCollection = settings.showMonthsShort ? settings.monthsShort : settings.monthsFull;\n\n              // If there are months to select, add a dropdown menu.\n              if ( settings.selectMonths ) {\n\n                  return _.node( 'select',\n                      _.group({\n                          min: 0,\n                          max: 11,\n                          i: 1,\n                          node: 'option',\n                          item: function( loopedMonth ) {\n\n                              return [\n\n                                  // The looped month and no classes.\n                                  monthsCollection[ loopedMonth ], 0,\n\n                                  // Set the value and selected index.\n                                  'value=' + loopedMonth +\n                                  ( viewsetObject.month == loopedMonth ? ' selected' : '' ) +\n                                  (\n                                      (\n                                          ( viewsetObject.year == minLimitObject.year && loopedMonth < minLimitObject.month ) ||\n                                          ( viewsetObject.year == maxLimitObject.year && loopedMonth > maxLimitObject.month )\n                                      ) ?\n                                      ' disabled' : ''\n                                  )\n                              ]\n                          }\n                      }),\n                      settings.klass.selectMonth,\n                      ( isOpen ? '' : 'disabled' ) + ' ' +\n                      _.ariaAttr({ controls: calendar.$node[0].id + '_table' }) + ' ' +\n                      'title=\"' + settings.labelMonthSelect + '\"'\n                  )\n              }\n\n              // If there's a need for a month selector\n              return _.node( 'div', monthsCollection[ viewsetObject.month ], settings.klass.month )\n          }, //createMonthLabel\n\n\n          // Create the year label.\n          createYearLabel = function() {\n\n              var focusedYear = viewsetObject.year,\n\n              // If years selector is set to a literal \"true\", set it to 5. Otherwise\n              // divide in half to get half before and half after focused year.\n              numberYears = settings.selectYears === true ? 5 : ~~( settings.selectYears / 2 );\n\n              // If there are years to select, add a dropdown menu.\n              if ( numberYears ) {\n\n                  var\n                      minYear = minLimitObject.year,\n                      maxYear = maxLimitObject.year,\n                      lowestYear = focusedYear - numberYears,\n                      highestYear = focusedYear + numberYears;\n\n                  // If the min year is greater than the lowest year, increase the highest year\n                  // by the difference and set the lowest year to the min year.\n                  if ( minYear > lowestYear ) {\n                      highestYear += minYear - lowestYear;\n                      lowestYear = minYear;\n                  }\n\n                  // If the max year is less than the highest year, decrease the lowest year\n                  // by the lower of the two: available and needed years. Then set the\n                  // highest year to the max year.\n                  if ( maxYear < highestYear ) {\n\n                      var availableYears = lowestYear - minYear,\n                          neededYears = highestYear - maxYear;\n\n                      lowestYear -= availableYears > neededYears ? neededYears : availableYears;\n                      highestYear = maxYear;\n                  }\n\n                  return _.node( 'select',\n                      _.group({\n                          min: lowestYear,\n                          max: highestYear,\n                          i: 1,\n                          node: 'option',\n                          item: function( loopedYear ) {\n                              return [\n\n                                  // The looped year and no classes.\n                                  loopedYear, 0,\n\n                                  // Set the value and selected index.\n                                  'value=' + loopedYear + ( focusedYear == loopedYear ? ' selected' : '' )\n                              ]\n                          }\n                      }),\n                      settings.klass.selectYear,\n                      ( isOpen ? '' : 'disabled' ) + ' ' + _.ariaAttr({ controls: calendar.$node[0].id + '_table' }) + ' ' +\n                      'title=\"' + settings.labelYearSelect + '\"'\n                  )\n              }\n\n              // Otherwise just return the year focused\n              return _.node( 'div', focusedYear, settings.klass.year )\n          }; //createYearLabel\n\n\n      // Create and return the entire calendar.\n      return _.node(\n          'div',\n          ( settings.selectYears ? createYearLabel() + createMonthLabel() : createMonthLabel() + createYearLabel() ) +\n          createMonthNav() + createMonthNav( 1 ),\n          settings.klass.header\n      ) + _.node(\n          'table',\n          tableHead +\n          _.node(\n              'tbody',\n              _.group({\n                  min: 0,\n                  max: WEEKS_IN_CALENDAR - 1,\n                  i: 1,\n                  node: 'tr',\n                  item: function( rowCounter ) {\n\n                      // If Monday is the first day and the month starts on Sunday, shift the date back a week.\n                      var shiftDateBy = settings.firstDay && calendar.create([ viewsetObject.year, viewsetObject.month, 1 ]).day === 0 ? -7 : 0;\n\n                      return [\n                          _.group({\n                              min: DAYS_IN_WEEK * rowCounter - viewsetObject.day + shiftDateBy + 1, // Add 1 for weekday 0index\n                              max: function() {\n                                  return this.min + DAYS_IN_WEEK - 1\n                              },\n                              i: 1,\n                              node: 'td',\n                              item: function( targetDate ) {\n\n                                  // Convert the time date from a relative date to a target date.\n                                  targetDate = calendar.create([ viewsetObject.year, viewsetObject.month, targetDate + ( settings.firstDay ? 1 : 0 ) ]);\n\n                                  var isSelected = selectedObject && selectedObject.pick == targetDate.pick,\n                                      isHighlighted = highlightedObject && highlightedObject.pick == targetDate.pick,\n                                      isDisabled = disabledCollection && calendar.disabled( targetDate ) || targetDate.pick < minLimitObject.pick || targetDate.pick > maxLimitObject.pick,\n                                      formattedDate = _.trigger( calendar.formats.toString, calendar, [ settings.format, targetDate ] );\n\n                                  return [\n                                      _.node(\n                                          'div',\n                                          targetDate.date,\n                                          (function( klasses ) {\n\n                                              // Add the `infocus` or `outfocus` classes based on month in view.\n                                              klasses.push( viewsetObject.month == targetDate.month ? settings.klass.infocus : settings.klass.outfocus );\n\n                                              // Add the `today` class if needed.\n                                              if ( nowObject.pick == targetDate.pick ) {\n                                                  klasses.push( settings.klass.now );\n                                              }\n\n                                              // Add the `selected` class if something's selected and the time matches.\n                                              if ( isSelected ) {\n                                                  klasses.push( settings.klass.selected );\n                                              }\n\n                                              // Add the `highlighted` class if something's highlighted and the time matches.\n                                              if ( isHighlighted ) {\n                                                  klasses.push( settings.klass.highlighted );\n                                              }\n\n                                              // Add the `disabled` class if something's disabled and the object matches.\n                                              if ( isDisabled ) {\n                                                  klasses.push( settings.klass.disabled );\n                                              }\n\n                                              return klasses.join( ' ' )\n                                          })([ settings.klass.day ]),\n                                          'data-pick=' + targetDate.pick + ' ' + _.ariaAttr({\n                                              role: 'gridcell',\n                                              label: formattedDate,\n                                              selected: isSelected && calendar.$node.val() === formattedDate ? true : null,\n                                              activedescendant: isHighlighted ? true : null,\n                                              disabled: isDisabled ? true : null\n                                          })\n                                      ),\n                                      '',\n                                      _.ariaAttr({ role: 'presentation' })\n                                  ] //endreturn\n                              }\n                          })\n                      ] //endreturn\n                  }\n              })\n          ),\n          settings.klass.table,\n          'id=\"' + calendar.$node[0].id + '_table' + '\" ' + _.ariaAttr({\n              role: 'grid',\n              controls: calendar.$node[0].id,\n              readonly: true\n          })\n      ) +\n\n      // * For Firefox forms to submit, make sure to set the buttons’ `type` attributes as “button”.\n      _.node(\n          'div',\n          _.node( 'button', settings.today, settings.klass.buttonToday,\n              'type=button data-pick=' + nowObject.pick +\n              ( isOpen && !calendar.disabled(nowObject) ? '' : ' disabled' ) + ' ' +\n              _.ariaAttr({ controls: calendar.$node[0].id }) ) +\n          _.node( 'button', settings.clear, settings.klass.buttonClear,\n              'type=button data-clear=1' +\n              ( isOpen ? '' : ' disabled' ) + ' ' +\n              _.ariaAttr({ controls: calendar.$node[0].id }) ) +\n          _.node('button', settings.close, settings.klass.buttonClose,\n              'type=button data-close=true ' +\n              ( isOpen ? '' : ' disabled' ) + ' ' +\n              _.ariaAttr({ controls: calendar.$node[0].id }) ),\n          settings.klass.footer\n      ) //endreturn\n  }; //DatePicker.prototype.nodes\n\n\n\n\n  /**\n   * The date picker defaults.\n   */\n  DatePicker.defaults = (function( prefix ) {\n\n      return {\n\n          // The title label to use for the month nav buttons\n          labelMonthNext: 'Next month',\n          labelMonthPrev: 'Previous month',\n\n          // The title label to use for the dropdown selectors\n          labelMonthSelect: 'Select a month',\n          labelYearSelect: 'Select a year',\n\n          // Months and weekdays\n          monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],\n          monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],\n          weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],\n          weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],\n\n          // Today and clear\n          today: 'Today',\n          clear: 'Clear',\n          close: 'Close',\n\n          // Picker close behavior\n          closeOnSelect: true,\n          closeOnClear: true,\n\n          // The format to show on the `input` element\n          format: 'd mmmm, yyyy',\n\n          // Classes\n          klass: {\n\n              table: prefix + 'table',\n\n              header: prefix + 'header',\n\n              navPrev: prefix + 'nav--prev',\n              navNext: prefix + 'nav--next',\n              navDisabled: prefix + 'nav--disabled',\n\n              month: prefix + 'month',\n              year: prefix + 'year',\n\n              selectMonth: prefix + 'select--month',\n              selectYear: prefix + 'select--year',\n\n              weekdays: prefix + 'weekday',\n\n              day: prefix + 'day',\n              disabled: prefix + 'day--disabled',\n              selected: prefix + 'day--selected',\n              highlighted: prefix + 'day--highlighted',\n              now: prefix + 'day--today',\n              infocus: prefix + 'day--infocus',\n              outfocus: prefix + 'day--outfocus',\n\n              footer: prefix + 'footer',\n\n              buttonClear: prefix + 'button--clear',\n              buttonToday: prefix + 'button--today',\n              buttonClose: prefix + 'button--close'\n          }\n      }\n  })( Picker.klasses().picker + '__' );\n\n\n\n\n\n  /**\n   * Extend the picker to add the date picker.\n   */\n  Picker.extend( 'pickadate', DatePicker );\n\n\n  }));\n  });\n\n  /*\n   * Date picker plugin extends `pickadate.js` by Amsul\n   */\n\n  var PickDate = function ($$$1) {\n    // constants >>>\n    var DATA_KEY = 'md.pickdate';\n    var NAME = 'pickdate';\n    var NO_CONFLICT = $$$1.fn[NAME];\n    var Default = {\n      cancel: 'Cancel',\n      closeOnCancel: true,\n      closeOnSelect: false,\n      container: '',\n      containerHidden: '',\n      disable: [],\n      firstDay: 0,\n      format: 'd/m/yyyy',\n      formatSubmit: '',\n      hiddenName: false,\n      hiddenPrefix: '',\n      hiddenSuffix: '',\n      klass: {\n        // button\n        buttonClear: 'btn btn-outline-primary picker-button-clear',\n        buttonClose: 'btn btn-outline-primary picker-button-close',\n        buttonToday: 'btn btn-outline-primary picker-button-today',\n        // day\n        day: 'picker-day',\n        disabled: 'picker-day-disabled',\n        highlighted: 'picker-day-highlighted',\n        infocus: 'picker-day-infocus',\n        now: 'picker-day-today',\n        outfocus: 'picker-day-outfocus',\n        selected: 'picker-day-selected',\n        weekdays: 'picker-weekday',\n        // element\n        box: 'picker-box',\n        footer: 'picker-footer',\n        frame: 'picker-frame',\n        header: 'picker-header',\n        holder: 'picker-holder',\n        table: 'picker-table',\n        wrap: 'picker-wrap',\n        // input element\n        active: 'picker-input-active',\n        input: 'picker-input',\n        // month and year nav\n        month: 'picker-month',\n        navDisabled: 'picker-nav-disabled',\n        navNext: 'material-icons picker-nav-next',\n        navPrev: 'material-icons picker-nav-prev',\n        selectMonth: 'picker-select-month',\n        selectYear: 'picker-select-year',\n        year: 'picker-year',\n        // root picker\n        focused: 'picker-focused',\n        opened: 'picker-opened',\n        picker: 'picker'\n      },\n      labelMonthNext: 'Next month',\n      labelMonthPrev: 'Previous month',\n      labelMonthSelect: 'Select a month',\n      labelYearSelect: 'Select a year',\n      max: false,\n      min: false,\n      monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],\n      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],\n      ok: 'OK',\n      onClose: function onClose() {// Do nothing\n      },\n      onOpen: function onOpen() {// Do nothing\n      },\n      onRender: function onRender() {// Do nothing\n      },\n      onSet: function onSet() {// Do nothing\n      },\n      onStart: function onStart() {// Do nothing\n      },\n      onStop: function onStop() {// Do nothing\n      },\n      selectMonths: false,\n      selectYears: false,\n      today: '',\n      weekdaysFull: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],\n      weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']\n    };\n    var DefaultType = {\n      cancel: 'string',\n      closeOnCancel: 'boolean',\n      closeOnSelect: 'boolean',\n      container: 'string',\n      containerHidden: 'string',\n      disable: 'array',\n      firstDay: 'number',\n      format: 'string',\n      formatSubmit: 'string',\n      hiddenName: 'boolean',\n      hiddenPrefix: 'string',\n      hiddenSuffix: 'string',\n      klass: 'object',\n      labelMonthNext: 'string',\n      labelMonthPrev: 'string',\n      labelMonthSelect: 'string',\n      labelYearSelect: 'string',\n      max: 'boolean || date',\n      min: 'boolean || date',\n      monthsFull: 'array',\n      monthsShort: 'array',\n      ok: 'string',\n      onClose: 'function',\n      onOpen: 'function',\n      onRender: 'function',\n      onSet: 'function',\n      onStart: 'function',\n      onStop: 'function',\n      selectMonths: 'boolean',\n      selectYears: 'boolean || number',\n      today: 'string',\n      weekdaysFull: 'array',\n      weekdaysShort: 'array'\n    };\n\n    var PickDate =\n    /*#__PURE__*/\n    function () {\n      function PickDate(element, config) {\n        this._config = this._getConfig(config);\n        this._element = element;\n      }\n\n      var _proto = PickDate.prototype;\n\n      _proto.display = function display(datepickerApi, datepickerRoot, datepickerValue) {\n        $$$1('.picker-date-display', datepickerRoot).remove();\n        $$$1('.picker-wrap', datepickerRoot).prepend(\"<div class=\\\"picker-date-display\\\"><div class=\\\"picker-date-display-top\\\"><span class=\\\"picker-year-display\\\">\" + datepickerApi.get(datepickerValue, 'yyyy') + \"</span></div><div class=\\\"picker-date-display-bottom\\\"><span class=\\\"picker-weekday-display\\\">\" + datepickerApi.get(datepickerValue, 'dddd') + \"</span><span class=\\\"picker-day-display\\\">\" + datepickerApi.get(datepickerValue, 'd') + \"</span><span class=\\\"picker-month-display\\\">\" + datepickerApi.get(datepickerValue, 'mmm') + \"</span></div></div>\");\n      };\n\n      _proto.show = function show() {\n        var _this = this;\n\n        $$$1(this._element).pickadate({\n          clear: this._config.cancel,\n          close: this._config.ok,\n          closeOnClear: this._config.closeOnCancel,\n          closeOnSelect: this._config.closeOnSelect,\n          container: this._config.container,\n          containerHidden: this._config.containerHidden,\n          disable: this._config.disable,\n          firstDay: this._config.firstDay,\n          format: this._config.format,\n          formatSubmit: this._config.formatSubmit,\n          klass: this._config.klass,\n          hiddenName: this._config.hiddenName,\n          hiddenPrefix: this._config.hiddenPrefix,\n          hiddenSuffix: this._config.hiddenSuffix,\n          labelMonthNext: this._config.labelMonthNext,\n          labelMonthPrev: this._config.labelMonthPrev,\n          labelMonthSelect: this._config.labelMonthSelect,\n          labelYearSelect: this._config.labelYearSelect,\n          max: this._config.max,\n          min: this._config.min,\n          monthsFull: this._config.monthsFull,\n          monthsShort: this._config.monthsShort,\n          onClose: this._config.onClose,\n          onOpen: this._config.onOpen,\n          onRender: this._config.onRender,\n          onSet: this._config.onSet,\n          onStart: this._config.onStart,\n          onStop: this._config.onStop,\n          selectMonths: this._config.selectMonths,\n          selectYears: this._config.selectYears,\n          today: this._config.today,\n          weekdaysFull: this._config.weekdaysFull,\n          weekdaysShort: this._config.weekdaysShort\n        });\n        var datepickerApi = $$$1(this._element).pickadate('picker');\n        var datepickerRoot = datepickerApi.$root;\n        datepickerApi.on({\n          close: function close() {\n            $$$1(document.activeElement).blur();\n          },\n          open: function open() {\n            if (!$$$1('.picker__date-display', datepickerRoot).length) {\n              _this.display(datepickerApi, datepickerRoot, 'highlight');\n            }\n          },\n          set: function set() {\n            if (datepickerApi.get('select') !== null) {\n              _this.display(datepickerApi, datepickerRoot, 'select');\n            }\n          }\n        });\n      };\n\n      _proto._getConfig = function _getConfig(config) {\n        config = _objectSpread({}, Default, config);\n        Util.typeCheckConfig(NAME, config, DefaultType);\n        return config;\n      };\n\n      PickDate._jQueryInterface = function _jQueryInterface(config) {\n        return this.each(function () {\n          var _config = _objectSpread({}, Default, $$$1(this).data(), typeof config === 'object' && config ? config : {});\n\n          var data = $$$1(this).data(DATA_KEY);\n\n          if (!data) {\n            data = new PickDate(this, _config);\n            $$$1(this).data(DATA_KEY, data);\n          }\n\n          data.show();\n        });\n      };\n\n      return PickDate;\n    }();\n\n    $$$1.fn[NAME] = PickDate._jQueryInterface;\n    $$$1.fn[NAME].Constructor = PickDate;\n\n    $$$1.fn[NAME].noConflict = function () {\n      $$$1.fn[NAME] = NO_CONFLICT;\n      return PickDate._jQueryInterface;\n    };\n  }($);\n\n  /*\n   * Selection control plugin fixes the focus state problem with\n   * Chrome persisting focus state on checkboxes/radio buttons after clicking\n   */\n\n  var SelectionControlFocus = function ($$$1) {\n    // constants >>>\n    var DATA_KEY = 'md.selectioncontrolfocus';\n    var EVENT_KEY = \".\" + DATA_KEY;\n    var ClassName = {\n      FOCUS: 'focus'\n    };\n    var LastInteraction = {\n      IS_MOUSEDOWN: false\n    };\n    var Event = {\n      BLUR: \"blur\" + EVENT_KEY,\n      FOCUS: \"focus\" + EVENT_KEY,\n      MOUSEDOWN: \"mousedown\" + EVENT_KEY,\n      MOUSEUP: \"mouseup\" + EVENT_KEY\n    };\n    var Selector = {\n      CONTROL: '.custom-control',\n      INPUT: '.custom-control-input' // <<< constants\n\n    };\n    $$$1(document).on(\"\" + Event.BLUR, Selector.INPUT, function () {\n      $$$1(this).removeClass(ClassName.FOCUS);\n    }).on(\"\" + Event.FOCUS, Selector.INPUT, function () {\n      if (LastInteraction.IS_MOUSEDOWN === false) {\n        $$$1(this).addClass(ClassName.FOCUS);\n      }\n    }).on(\"\" + Event.MOUSEDOWN, Selector.CONTROL, function () {\n      LastInteraction.IS_MOUSEDOWN = true;\n    }).on(\"\" + Event.MOUSEUP, Selector.CONTROL, function () {\n      setTimeout(function () {\n        LastInteraction.IS_MOUSEDOWN = false;\n      }, 1);\n    });\n  }($);\n\n  /*\n   * Tab indicator animation\n   * Requires Bootstrap's (v4.1.X) `tab.js`\n   */\n\n  var TabSwitch = function ($$$1) {\n    // constants >>>\n    var DATA_KEY = 'md.tabswitch';\n    var NAME = 'tabswitch';\n    var NO_CONFLICT = $$$1.fn[NAME];\n    var ClassName = {\n      ANIMATE: 'animate',\n      DROPDOWN_ITEM: 'dropdown-item',\n      INDICATOR: 'nav-tabs-indicator',\n      MATERIAL: 'nav-tabs-material',\n      SCROLLABLE: 'nav-tabs-scrollable',\n      SHOW: 'show'\n    };\n    var Event = {\n      SHOW_BS_TAB: 'show.bs.tab'\n    };\n    var Selector = {\n      DATA_TOGGLE: '.nav-tabs [data-toggle=\"tab\"]',\n      DROPDOWN: '.dropdown',\n      NAV: '.nav-tabs' // <<< constants\n\n    };\n\n    var TabSwitch =\n    /*#__PURE__*/\n    function () {\n      function TabSwitch(nav) {\n        this._nav = nav;\n        this._navindicator = null;\n      }\n\n      var _proto = TabSwitch.prototype;\n\n      _proto.switch = function _switch(element, relatedTarget) {\n        var _this = this;\n\n        var navLeft = $$$1(this._nav).offset().left;\n        var navScrollLeft = $$$1(this._nav).scrollLeft();\n        var navWidth = $$$1(this._nav).outerWidth();\n\n        if (!this._navindicator) {\n          this._createIndicator(navLeft, navScrollLeft, navWidth, relatedTarget);\n        }\n\n        if ($$$1(element).hasClass(ClassName.DROPDOWN_ITEM)) {\n          element = $$$1(element).closest(Selector.DROPDOWN);\n        }\n\n        var elLeft = $$$1(element).offset().left;\n        var elWidth = $$$1(element).outerWidth();\n        $$$1(this._navindicator).addClass(ClassName.SHOW);\n        Util.reflow(this._navindicator);\n        $$$1(this._nav).addClass(ClassName.ANIMATE);\n        $$$1(this._navindicator).css({\n          left: elLeft + navScrollLeft - navLeft,\n          right: navWidth - (elLeft + navScrollLeft - navLeft + elWidth)\n        });\n\n        var complete = function complete() {\n          $$$1(_this._nav).removeClass(ClassName.ANIMATE);\n          $$$1(_this._navindicator).removeClass(ClassName.SHOW);\n        };\n\n        var transitionDuration = Util.getTransitionDurationFromElement(this._navindicator);\n        $$$1(this._navindicator).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);\n      };\n\n      _proto._createIndicator = function _createIndicator(navLeft, navScrollLeft, navWidth, relatedTarget) {\n        this._navindicator = document.createElement('div');\n        $$$1(this._navindicator).addClass(ClassName.INDICATOR).appendTo(this._nav);\n\n        if (typeof relatedTarget !== 'undefined') {\n          if ($$$1(relatedTarget).hasClass(ClassName.DROPDOWN_ITEM)) {\n            relatedTarget = $$$1(relatedTarget).closest(Selector.DROPDOWN);\n          }\n\n          var relatedLeft = $$$1(relatedTarget).offset().left;\n          var relatedWidth = $$$1(relatedTarget).outerWidth();\n          $$$1(this._navindicator).css({\n            left: relatedLeft + navScrollLeft - navLeft,\n            right: navWidth - (relatedLeft + navScrollLeft - navLeft + relatedWidth)\n          });\n        }\n\n        $$$1(this._nav).addClass(ClassName.MATERIAL);\n      };\n\n      TabSwitch._jQueryInterface = function _jQueryInterface(relatedTarget) {\n        return this.each(function () {\n          var nav = $$$1(this).closest(Selector.NAV)[0];\n\n          if (!nav) {\n            return;\n          }\n\n          var data = $$$1(nav).data(DATA_KEY);\n\n          if (!data) {\n            data = new TabSwitch(nav);\n            $$$1(nav).data(DATA_KEY, data);\n          }\n\n          data.switch(this, relatedTarget);\n        });\n      };\n\n      return TabSwitch;\n    }();\n\n    $$$1(document).on(Event.SHOW_BS_TAB, Selector.DATA_TOGGLE, function (event) {\n      TabSwitch._jQueryInterface.call($$$1(this), event.relatedTarget);\n    });\n    $$$1.fn[NAME] = TabSwitch._jQueryInterface;\n    $$$1.fn[NAME].Constructor = TabSwitch;\n\n    $$$1.fn[NAME].noConflict = function () {\n      $$$1.fn[NAME] = NO_CONFLICT;\n      return TabSwitch._jQueryInterface;\n    };\n\n    return TabSwitch;\n  }($);\n\n  exports.Util = Util;\n  exports.ExpansionPanel = ExpansionPanel;\n  exports.FloatingLabel = FloatingLabel;\n  exports.NavDrawer = NavDrawer;\n  exports.PickDate = PickDate;\n  exports.SelectionControlFocus = SelectionControlFocus;\n  exports.TabSwitch = TabSwitch;\n\n  Object.defineProperty(exports, '__esModule', { value: true });\n\n})));\n//# sourceMappingURL=material.js.map\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./node_modules/js-cookie/src/js.cookie.js":
/***/ (function(module, exports) {

module.exports = "/*!\n * JavaScript Cookie v2.2.1\n * https://github.com/js-cookie/js-cookie\n *\n * Copyright 2006, 2015 Klaus Hartl & Fagner Brack\n * Released under the MIT license\n */\n;(function (factory) {\n\tvar registeredInModuleLoader;\n\tif (typeof define === 'function' && define.amd) {\n\t\tdefine(factory);\n\t\tregisteredInModuleLoader = true;\n\t}\n\tif (typeof exports === 'object') {\n\t\tmodule.exports = factory();\n\t\tregisteredInModuleLoader = true;\n\t}\n\tif (!registeredInModuleLoader) {\n\t\tvar OldCookies = window.Cookies;\n\t\tvar api = window.Cookies = factory();\n\t\tapi.noConflict = function () {\n\t\t\twindow.Cookies = OldCookies;\n\t\t\treturn api;\n\t\t};\n\t}\n}(function () {\n\tfunction extend () {\n\t\tvar i = 0;\n\t\tvar result = {};\n\t\tfor (; i < arguments.length; i++) {\n\t\t\tvar attributes = arguments[ i ];\n\t\t\tfor (var key in attributes) {\n\t\t\t\tresult[key] = attributes[key];\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t}\n\n\tfunction decode (s) {\n\t\treturn s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);\n\t}\n\n\tfunction init (converter) {\n\t\tfunction api() {}\n\n\t\tfunction set (key, value, attributes) {\n\t\t\tif (typeof document === 'undefined') {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tattributes = extend({\n\t\t\t\tpath: '/'\n\t\t\t}, api.defaults, attributes);\n\n\t\t\tif (typeof attributes.expires === 'number') {\n\t\t\t\tattributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);\n\t\t\t}\n\n\t\t\t// We're using \"expires\" because \"max-age\" is not supported by IE\n\t\t\tattributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';\n\n\t\t\ttry {\n\t\t\t\tvar result = JSON.stringify(value);\n\t\t\t\tif (/^[\\{\\[]/.test(result)) {\n\t\t\t\t\tvalue = result;\n\t\t\t\t}\n\t\t\t} catch (e) {}\n\n\t\t\tvalue = converter.write ?\n\t\t\t\tconverter.write(value, key) :\n\t\t\t\tencodeURIComponent(String(value))\n\t\t\t\t\t.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);\n\n\t\t\tkey = encodeURIComponent(String(key))\n\t\t\t\t.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)\n\t\t\t\t.replace(/[\\(\\)]/g, escape);\n\n\t\t\tvar stringifiedAttributes = '';\n\t\t\tfor (var attributeName in attributes) {\n\t\t\t\tif (!attributes[attributeName]) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\tstringifiedAttributes += '; ' + attributeName;\n\t\t\t\tif (attributes[attributeName] === true) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\t// Considers RFC 6265 section 5.2:\n\t\t\t\t// ...\n\t\t\t\t// 3.  If the remaining unparsed-attributes contains a %x3B (\";\")\n\t\t\t\t//     character:\n\t\t\t\t// Consume the characters of the unparsed-attributes up to,\n\t\t\t\t// not including, the first %x3B (\";\") character.\n\t\t\t\t// ...\n\t\t\t\tstringifiedAttributes += '=' + attributes[attributeName].split(';')[0];\n\t\t\t}\n\n\t\t\treturn (document.cookie = key + '=' + value + stringifiedAttributes);\n\t\t}\n\n\t\tfunction get (key, json) {\n\t\t\tif (typeof document === 'undefined') {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tvar jar = {};\n\t\t\t// To prevent the for loop in the first place assign an empty array\n\t\t\t// in case there are no cookies at all.\n\t\t\tvar cookies = document.cookie ? document.cookie.split('; ') : [];\n\t\t\tvar i = 0;\n\n\t\t\tfor (; i < cookies.length; i++) {\n\t\t\t\tvar parts = cookies[i].split('=');\n\t\t\t\tvar cookie = parts.slice(1).join('=');\n\n\t\t\t\tif (!json && cookie.charAt(0) === '\"') {\n\t\t\t\t\tcookie = cookie.slice(1, -1);\n\t\t\t\t}\n\n\t\t\t\ttry {\n\t\t\t\t\tvar name = decode(parts[0]);\n\t\t\t\t\tcookie = (converter.read || converter)(cookie, name) ||\n\t\t\t\t\t\tdecode(cookie);\n\n\t\t\t\t\tif (json) {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tcookie = JSON.parse(cookie);\n\t\t\t\t\t\t} catch (e) {}\n\t\t\t\t\t}\n\n\t\t\t\t\tjar[name] = cookie;\n\n\t\t\t\t\tif (key === name) {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t} catch (e) {}\n\t\t\t}\n\n\t\t\treturn key ? jar[key] : jar;\n\t\t}\n\n\t\tapi.set = set;\n\t\tapi.get = function (key) {\n\t\t\treturn get(key, false /* read as raw */);\n\t\t};\n\t\tapi.getJSON = function (key) {\n\t\t\treturn get(key, true /* read as json */);\n\t\t};\n\t\tapi.remove = function (key, attributes) {\n\t\t\tset(key, '', extend(attributes, {\n\t\t\t\texpires: -1\n\t\t\t}));\n\t\t};\n\n\t\tapi.defaults = {};\n\n\t\tapi.withConverter = init;\n\n\t\treturn api;\n\t}\n\n\treturn init(function () {});\n}));\n"

/***/ }),

/***/ "./node_modules/script-loader/addScript.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ }),

/***/ "./node_modules/script-loader/index.js!./node_modules/bootstrap/dist/js/bootstrap.js":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/script-loader/addScript.js")(__webpack_require__("./node_modules/raw-loader/index.js!./node_modules/bootstrap/dist/js/bootstrap.js"))

/***/ }),

/***/ "./node_modules/script-loader/index.js!./node_modules/daemonite-material/js/material.js":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/script-loader/addScript.js")(__webpack_require__("./node_modules/raw-loader/index.js!./node_modules/daemonite-material/js/material.js"))

/***/ }),

/***/ "./node_modules/script-loader/index.js!./node_modules/js-cookie/src/js.cookie.js":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/script-loader/addScript.js")(__webpack_require__("./node_modules/raw-loader/index.js!./node_modules/js-cookie/src/js.cookie.js"))

/***/ }),

/***/ "./node_modules/scrollMonitor/scrollMonitor.js":
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define("scrollMonitor",[],e):"object"==typeof exports?exports.scrollMonitor=e():t.scrollMonitor=e()}(this,function(){return function(t){function e(o){if(i[o])return i[o].exports;var s=i[o]={exports:{},id:o,loaded:!1};return t[o].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){"use strict";var o=i(1),s=o.isInBrowser,n=i(2),r=new n(s?document.body:null);r.setStateFromDOM(null),r.listenToDOM(),s&&(window.scrollMonitor=r),t.exports=r},function(t,e){"use strict";e.VISIBILITYCHANGE="visibilityChange",e.ENTERVIEWPORT="enterViewport",e.FULLYENTERVIEWPORT="fullyEnterViewport",e.EXITVIEWPORT="exitViewport",e.PARTIALLYEXITVIEWPORT="partiallyExitViewport",e.LOCATIONCHANGE="locationChange",e.STATECHANGE="stateChange",e.eventTypes=[e.VISIBILITYCHANGE,e.ENTERVIEWPORT,e.FULLYENTERVIEWPORT,e.EXITVIEWPORT,e.PARTIALLYEXITVIEWPORT,e.LOCATIONCHANGE,e.STATECHANGE],e.isOnServer="undefined"==typeof window,e.isInBrowser=!e.isOnServer,e.defaultOffsets={top:0,bottom:0}},function(t,e,i){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t){return c?0:t===document.body?window.innerHeight||document.documentElement.clientHeight:t.clientHeight}function n(t){return c?0:t===document.body?Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.documentElement.clientHeight):t.scrollHeight}function r(t){return c?0:t===document.body?window.pageYOffset||document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop:t.scrollTop}var h=i(1),c=h.isOnServer,a=h.isInBrowser,l=h.eventTypes,p=i(3),u=!1;if(a)try{var w=Object.defineProperty({},"passive",{get:function(){u=!0}});window.addEventListener("test",null,w)}catch(t){}var d=!!u&&{capture:!1,passive:!0},f=function(){function t(e,i){function h(){if(a.viewportTop=r(e),a.viewportBottom=a.viewportTop+a.viewportHeight,a.documentHeight=n(e),a.documentHeight!==p){for(u=a.watchers.length;u--;)a.watchers[u].recalculateLocation();p=a.documentHeight}}function c(){for(w=a.watchers.length;w--;)a.watchers[w].update();for(w=a.watchers.length;w--;)a.watchers[w].triggerCallbacks()}o(this,t);var a=this;this.item=e,this.watchers=[],this.viewportTop=null,this.viewportBottom=null,this.documentHeight=n(e),this.viewportHeight=s(e),this.DOMListener=function(){t.prototype.DOMListener.apply(a,arguments)},this.eventTypes=l,i&&(this.containerWatcher=i.create(e));var p,u,w;this.update=function(){h(),c()},this.recalculateLocations=function(){this.documentHeight=0,this.update()}}return t.prototype.listenToDOM=function(){a&&(window.addEventListener?(this.item===document.body?window.addEventListener("scroll",this.DOMListener,d):this.item.addEventListener("scroll",this.DOMListener,d),window.addEventListener("resize",this.DOMListener)):(this.item===document.body?window.attachEvent("onscroll",this.DOMListener):this.item.attachEvent("onscroll",this.DOMListener),window.attachEvent("onresize",this.DOMListener)),this.destroy=function(){window.addEventListener?(this.item===document.body?(window.removeEventListener("scroll",this.DOMListener,d),this.containerWatcher.destroy()):this.item.removeEventListener("scroll",this.DOMListener,d),window.removeEventListener("resize",this.DOMListener)):(this.item===document.body?(window.detachEvent("onscroll",this.DOMListener),this.containerWatcher.destroy()):this.item.detachEvent("onscroll",this.DOMListener),window.detachEvent("onresize",this.DOMListener))})},t.prototype.destroy=function(){},t.prototype.DOMListener=function(t){this.setStateFromDOM(t)},t.prototype.setStateFromDOM=function(t){var e=r(this.item),i=s(this.item),o=n(this.item);this.setState(e,i,o,t)},t.prototype.setState=function(t,e,i,o){var s=e!==this.viewportHeight||i!==this.contentHeight;if(this.latestEvent=o,this.viewportTop=t,this.viewportHeight=e,this.viewportBottom=t+e,this.contentHeight=i,s)for(var n=this.watchers.length;n--;)this.watchers[n].recalculateLocation();this.updateAndTriggerWatchers(o)},t.prototype.updateAndTriggerWatchers=function(t){for(var e=this.watchers.length;e--;)this.watchers[e].update();for(e=this.watchers.length;e--;)this.watchers[e].triggerCallbacks(t)},t.prototype.createCustomContainer=function(){return new t},t.prototype.createContainer=function(e){"string"==typeof e?e=document.querySelector(e):e&&e.length>0&&(e=e[0]);var i=new t(e,this);return i.setStateFromDOM(),i.listenToDOM(),i},t.prototype.create=function(t,e){"string"==typeof t?t=document.querySelector(t):t&&t.length>0&&(t=t[0]);var i=new p(this,t,e);return this.watchers.push(i),i},t.prototype.beget=function(t,e){return this.create(t,e)},t}();t.exports=f},function(t,e,i){"use strict";function o(t,e,i){function o(t,e){if(0!==t.length)for(E=t.length;E--;)y=t[E],y.callback.call(s,e,s),y.isOne&&t.splice(E,1)}var s=this;this.watchItem=e,this.container=t,i?i===+i?this.offsets={top:i,bottom:i}:this.offsets={top:i.top||w.top,bottom:i.bottom||w.bottom}:this.offsets=w,this.callbacks={};for(var d=0,f=u.length;d<f;d++)s.callbacks[u[d]]=[];this.locked=!1;var m,v,b,I,E,y;this.triggerCallbacks=function(t){switch(this.isInViewport&&!m&&o(this.callbacks[r],t),this.isFullyInViewport&&!v&&o(this.callbacks[h],t),this.isAboveViewport!==b&&this.isBelowViewport!==I&&(o(this.callbacks[n],t),v||this.isFullyInViewport||(o(this.callbacks[h],t),o(this.callbacks[a],t)),m||this.isInViewport||(o(this.callbacks[r],t),o(this.callbacks[c],t))),!this.isFullyInViewport&&v&&o(this.callbacks[a],t),!this.isInViewport&&m&&o(this.callbacks[c],t),this.isInViewport!==m&&o(this.callbacks[n],t),!0){case m!==this.isInViewport:case v!==this.isFullyInViewport:case b!==this.isAboveViewport:case I!==this.isBelowViewport:o(this.callbacks[p],t)}m=this.isInViewport,v=this.isFullyInViewport,b=this.isAboveViewport,I=this.isBelowViewport},this.recalculateLocation=function(){if(!this.locked){var t=this.top,e=this.bottom;if(this.watchItem.nodeName){var i=this.watchItem.style.display;"none"===i&&(this.watchItem.style.display="");for(var s=0,n=this.container;n.containerWatcher;)s+=n.containerWatcher.top-n.containerWatcher.container.viewportTop,n=n.containerWatcher.container;var r=this.watchItem.getBoundingClientRect();this.top=r.top+this.container.viewportTop-s,this.bottom=r.bottom+this.container.viewportTop-s,"none"===i&&(this.watchItem.style.display=i)}else this.watchItem===+this.watchItem?this.watchItem>0?this.top=this.bottom=this.watchItem:this.top=this.bottom=this.container.documentHeight-this.watchItem:(this.top=this.watchItem.top,this.bottom=this.watchItem.bottom);this.top-=this.offsets.top,this.bottom+=this.offsets.bottom,this.height=this.bottom-this.top,void 0===t&&void 0===e||this.top===t&&this.bottom===e||o(this.callbacks[l],null)}},this.recalculateLocation(),this.update(),m=this.isInViewport,v=this.isFullyInViewport,b=this.isAboveViewport,I=this.isBelowViewport}var s=i(1),n=s.VISIBILITYCHANGE,r=s.ENTERVIEWPORT,h=s.FULLYENTERVIEWPORT,c=s.EXITVIEWPORT,a=s.PARTIALLYEXITVIEWPORT,l=s.LOCATIONCHANGE,p=s.STATECHANGE,u=s.eventTypes,w=s.defaultOffsets;o.prototype={on:function(t,e,i){switch(!0){case t===n&&!this.isInViewport&&this.isAboveViewport:case t===r&&this.isInViewport:case t===h&&this.isFullyInViewport:case t===c&&this.isAboveViewport&&!this.isInViewport:case t===a&&this.isInViewport&&this.isAboveViewport:if(e.call(this,this.container.latestEvent,this),i)return}if(!this.callbacks[t])throw new Error("Tried to add a scroll monitor listener of type "+t+". Your options are: "+u.join(", "));this.callbacks[t].push({callback:e,isOne:i||!1})},off:function(t,e){if(!this.callbacks[t])throw new Error("Tried to remove a scroll monitor listener of type "+t+". Your options are: "+u.join(", "));for(var i,o=0;i=this.callbacks[t][o];o++)if(i.callback===e){this.callbacks[t].splice(o,1);break}},one:function(t,e){this.on(t,e,!0)},recalculateSize:function(){this.height=this.watchItem.offsetHeight+this.offsets.top+this.offsets.bottom,this.bottom=this.top+this.height},update:function(){this.isAboveViewport=this.top<this.container.viewportTop,this.isBelowViewport=this.bottom>this.container.viewportBottom,this.isInViewport=this.top<this.container.viewportBottom&&this.bottom>this.container.viewportTop,this.isFullyInViewport=this.top>=this.container.viewportTop&&this.bottom<=this.container.viewportBottom||this.isAboveViewport&&this.isBelowViewport},destroy:function(){var t=this.container.watchers.indexOf(this),e=this;this.container.watchers.splice(t,1);for(var i=0,o=u.length;i<o;i++)e.callbacks[u[i]].length=0},lock:function(){this.locked=!0},unlock:function(){this.locked=!1}};for(var d=function(t){return function(e,i){this.on.call(this,t,e,i)}},f=0,m=u.length;f<m;f++){var v=u[f];o.prototype[v]=d(v)}t.exports=o}])});
//# sourceMappingURL=scrollMonitor.js.map

/***/ }),

/***/ "./node_modules/select2/dist/js/select2.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;/*!
 * Select2 4.0.13
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
;(function (factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        }
        else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
} (function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 =(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
    var S2 = jQuery.fn.select2.amd;
  }
var S2;(function () { if (!S2 || !S2.requirejs) {
if (!S2) { S2 = {}; } else { require = S2; }
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

S2.requirejs = requirejs;S2.require = require;S2.define = define;
}
}());
S2.define("almond", function(){});

/* global jQuery:false, $:false */
S2.define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before Select2 on your ' +
      'web page.'
    );
  }

  return _$;
});

S2.define('select2/utils',[
  'jquery'
], function ($) {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
      var superMethod = superMethods[m];

      DecoratedClass.prototype[superMethod] =
        SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;
    var params = slice.call(arguments, 1);

    this.listeners = this.listeners || {};

    // Params should always come in as an array
    if (params == null) {
      params = [];
    }

    // If there are no arguments to the event, use a temporary object
    if (params.length === 0) {
      params.push({});
    }

    // Set the `_type` of the first object to the event
    params[0]._type = event;

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  Utils.escapeMarkup = function (markup) {
    var replaceMap = {
      '\\': '&#92;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
      return markup;
    }

    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
      return replaceMap[match];
    });
  };

  // Append an array of jQuery nodes to a given element.
  Utils.appendMany = function ($element, $nodes) {
    // jQuery 1.7.x does not support $.fn.append() with an array
    // Fall back to a jQuery object collection using $.fn.add()
    if ($.fn.jquery.substr(0, 3) === '1.7') {
      var $jqNodes = $();

      $.map($nodes, function (node) {
        $jqNodes = $jqNodes.add(node);
      });

      $nodes = $jqNodes;
    }

    $element.append($nodes);
  };

  // Cache objects in Utils.__cache instead of $.data (see #4346)
  Utils.__cache = {};

  var id = 0;
  Utils.GetUniqueElementId = function (element) {
    // Get a unique element Id. If element has no id,
    // creates a new unique number, stores it in the id
    // attribute and returns the new id.
    // If an id already exists, it simply returns it.

    var select2Id = element.getAttribute('data-select2-id');
    if (select2Id == null) {
      // If element has id, use it.
      if (element.id) {
        select2Id = element.id;
        element.setAttribute('data-select2-id', select2Id);
      } else {
        element.setAttribute('data-select2-id', ++id);
        select2Id = id.toString();
      }
    }
    return select2Id;
  };

  Utils.StoreData = function (element, name, value) {
    // Stores an item in the cache for a specified element.
    // name is the cache key.
    var id = Utils.GetUniqueElementId(element);
    if (!Utils.__cache[id]) {
      Utils.__cache[id] = {};
    }

    Utils.__cache[id][name] = value;
  };

  Utils.GetData = function (element, name) {
    // Retrieves a value from the cache by its key (name)
    // name is optional. If no name specified, return
    // all cache items for the specified element.
    // and for a specified element.
    var id = Utils.GetUniqueElementId(element);
    if (name) {
      if (Utils.__cache[id]) {
        if (Utils.__cache[id][name] != null) {
          return Utils.__cache[id][name];
        }
        return $(element).data(name); // Fallback to HTML5 data attribs.
      }
      return $(element).data(name); // Fallback to HTML5 data attribs.
    } else {
      return Utils.__cache[id];
    }
  };

  Utils.RemoveData = function (element) {
    // Removes all cached items for a specified element.
    var id = Utils.GetUniqueElementId(element);
    if (Utils.__cache[id] != null) {
      delete Utils.__cache[id];
    }

    element.removeAttribute('data-select2-id');
  };

  return Utils;
});

S2.define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="select2-results__options" role="listbox"></ul>'
    );

    if (this.options.get('multiple')) {
      $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    var escapeMarkup = this.options.get('escapeMarkup');

    this.clear();
    this.hideLoading();

    var $message = $(
      '<li role="alert" aria-live="assertive"' +
      ' class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.append(
      escapeMarkup(
        message(params.args)
      )
    );

    $message[0].className += ' select2-results__message';

    this.$results.append($message);
  };

  Results.prototype.hideMessages = function () {
    this.$results.find('.select2-results__message').remove();
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.$results.children().length === 0) {
        this.trigger('results:message', {
          message: 'noResults'
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.highlightFirstItem = function () {
    var $options = this.$results
      .find('.select2-results__option[aria-selected]');

    var $selected = $options.filter('[aria-selected=true]');

    // Check if there are any selected options
    if ($selected.length > 0) {
      // If there are selected options, highlight the first
      $selected.first().trigger('mouseenter');
    } else {
      // If there are no selected options, highlight the first option
      // in the dropdown
      $options.first().trigger('mouseenter');
    }

    this.ensureHighlightVisible();
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = $.map(selected, function (s) {
        return s.id.toString();
      });

      var $options = self.$results
        .find('.select2-results__option[aria-selected]');

      $options.each(function () {
        var $option = $(this);

        var item = Utils.GetData(this, 'data');

        // id needs to be converted to a string when comparing
        var id = '' + item.id;

        if ((item.element != null && item.element.selected) ||
            (item.element == null && $.inArray(id, selectedIds) > -1)) {
          $option.attr('aria-selected', 'true');
        } else {
          $option.attr('aria-selected', 'false');
        }
      });

    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.className = 'select2-results__option';

    var attrs = {
      'role': 'option',
      'aria-selected': 'false'
    };

    var matches = window.Element.prototype.matches ||
      window.Element.prototype.msMatchesSelector ||
      window.Element.prototype.webkitMatchesSelector;

    if ((data.element != null && matches.call(data.element, ':disabled')) ||
        (data.element == null && data.disabled)) {
      delete attrs['aria-selected'];
      attrs['aria-disabled'] = 'true';
    }

    if (data.id == null) {
      delete attrs['aria-selected'];
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.title) {
      option.title = data.title;
    }

    if (data.children) {
      attrs.role = 'group';
      attrs['aria-label'] = data.text;
      delete attrs['aria-selected'];
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var $option = $(option);

      var label = document.createElement('strong');
      label.className = 'select2-results__group';

      var $label = $(label);
      this.template(data, label);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul></ul>', {
        'class': 'select2-results__options select2-results__options--nested'
      });

      $childrenContainer.append($children);

      $option.append(label);
      $option.append($childrenContainer);
    } else {
      this.template(data, option);
    }

    Utils.StoreData(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
        self.highlightFirstItem();
      }
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('query', function (params) {
      self.hideMessages();
      self.showLoading(params);
    });

    container.on('select', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();

      if (self.options.get('scrollAfterSelect')) {
        self.highlightFirstItem();
      }
    });

    container.on('unselect', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();

      if (self.options.get('scrollAfterSelect')) {
        self.highlightFirstItem();
      }
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$results.attr('aria-expanded', 'true');
      self.$results.attr('aria-hidden', 'false');

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$results.attr('aria-expanded', 'false');
      self.$results.attr('aria-hidden', 'true');
      self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:toggle', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      $highlighted.trigger('mouseup');
    });

    container.on('results:select', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      var data = Utils.GetData($highlighted[0], 'data');

      if ($highlighted.attr('aria-selected') == 'true') {
        self.trigger('close', {});
      } else {
        self.trigger('select', {
          data: data
        });
      }
    });

    container.on('results:previous', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      // If we are already at the top, don't move further
      // If no options, currentIndex will be -1
      if (currentIndex <= 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      // If none are highlighted, highlight the first
      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top;
      var nextTop = $next.offset().top;
      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextTop - currentOffset < 0) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:next', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      var nextIndex = currentIndex + 1;

      // If we are at the last option, stay there
      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var nextBottom = $next.offset().top + $next.outerHeight(false);
      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextBottom > currentOffset) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:focus', function (params) {
      params.element.addClass('select2-results__option--highlighted');
    });

    container.on('results:message', function (params) {
      self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
      this.$results.on('mousewheel', function (e) {
        var top = self.$results.scrollTop();

        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

        if (isAtTop) {
          self.$results.scrollTop(0);

          e.preventDefault();
          e.stopPropagation();
        } else if (isAtBottom) {
          self.$results.scrollTop(
            self.$results.get(0).scrollHeight - self.$results.height()
          );

          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.$results.on('mouseup', '.select2-results__option[aria-selected]',
      function (evt) {
      var $this = $(this);

      var data = Utils.GetData(this, 'data');

      if ($this.attr('aria-selected') === 'true') {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        } else {
          self.trigger('close', {});
        }

        return;
      }

      self.trigger('select', {
        originalEvent: evt,
        data: data
      });
    });

    this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
      function (evt) {
      var data = Utils.GetData(this, 'data');

      self.getHighlightedResults()
          .removeClass('select2-results__option--highlighted');

      self.trigger('results:focus', {
        data: data,
        element: $(this)
      });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
      return;
    }

    var $options = this.$results.find('[aria-selected]');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
      this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
      this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');
    var escapeMarkup = this.options.get('escapeMarkup');

    var content = template(result, container);

    if (content == null) {
      container.style.display = 'none';
    } else if (typeof content === 'string') {
      container.innerHTML = escapeMarkup(content);
    } else {
      $(container).append(content);
    }
  };

  return Results;
});

S2.define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  return KEYS;
});

S2.define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" role="combobox" ' +
      ' aria-haspopup="true" aria-expanded="false">' +
      '</span>'
    );

    this._tabindex = 0;

    if (Utils.GetData(this.$element[0], 'old-tabindex') != null) {
      this._tabindex = Utils.GetData(this.$element[0], 'old-tabindex');
    } else if (this.$element.attr('tabindex') != null) {
      this._tabindex = this.$element.attr('tabindex');
    }

    $selection.attr('title', this.$element.attr('title'));
    $selection.attr('tabindex', this._tabindex);
    $selection.attr('aria-disabled', 'false');

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.on('focus', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('blur', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection.attr('aria-expanded', 'true');
      self.$selection.attr('aria-owns', resultsId);

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection.attr('aria-expanded', 'false');
      self.$selection.removeAttr('aria-activedescendant');
      self.$selection.removeAttr('aria-owns');

      self.$selection.trigger('focus');

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', self._tabindex);
      self.$selection.attr('aria-disabled', 'false');
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
      self.$selection.attr('aria-disabled', 'true');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
      // Don't trigger `blur` if the focus is still in the selection
      if (
        (document.activeElement == self.$selection[0]) ||
        ($.contains(self.$selection[0], document.activeElement))
      ) {
        return;
      }

      self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
      var $target = $(e.target);

      var $select = $target.closest('.select2');

      var $all = $('.select2.select2-container--open');

      $all.each(function () {
        if (this == $select[0]) {
          return;
        }

        var $element = Utils.GetData(this, 'element');

        $element.select2('close');
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  BaseSelection.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  BaseSelection.prototype.isDisabled = function () {
    return this.options.get('disabled');
  };

  return BaseSelection;
});

S2.define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered')
      .attr('id', id)
      .attr('role', 'textbox')
      .attr('aria-readonly', 'true');
    this.$selection.attr('aria-labelledby', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.$selection.trigger('focus');
      }
    });
  };

  SingleSelection.prototype.clear = function () {
    var $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title'); // clear tooltip on empty
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = this.display(selection, $rendered);

    $rendered.empty().append(formatted);

    var title = selection.title || selection.text;

    if (title) {
      $rendered.attr('title', title);
    } else {
      $rendered.removeAttr('title');
    }
  };

  return SingleSelection;
});

S2.define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.isDisabled()) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = Utils.GetData($selection[0], 'data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );
  };

  MultipleSelection.prototype.clear = function () {
    var $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title');
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);

      $selection.append(formatted);

      var title = selection.title || selection.text;

      if (title) {
        $selection.attr('title', title);
      }

      Utils.StoreData($selection[0], 'data', selection);

      $selections.push($selection);
    }

    var $rendered = this.$selection.find('.select2-selection__rendered');

    Utils.appendMany($rendered, $selections);
  };

  return MultipleSelection;
});

S2.define('select2/selection/placeholder',[
  '../utils'
], function (Utils) {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder.addClass('select2-selection__placeholder')
                .removeClass('select2-selection__choice');

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

S2.define('select2/selection/allowClear',[
  'jquery',
  '../keys',
  '../utils'
], function ($, KEYS, Utils) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    if (this.placeholder == null) {
      if (this.options.get('debug') && window.console && console.error) {
        console.error(
          'Select2: The `allowClear` option should be used in combination ' +
          'with the `placeholder` option.'
        );
      }
    }

    this.$selection.on('mousedown', '.select2-selection__clear',
      function (evt) {
        self._handleClear(evt);
    });

    container.on('keypress', function (evt) {
      self._handleKeyboardClear(evt, container);
    });
  };

  AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.isDisabled()) {
      return;
    }

    var $clear = this.$selection.find('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if ($clear.length === 0) {
      return;
    }

    evt.stopPropagation();

    var data = Utils.GetData($clear[0], 'data');

    var previousVal = this.$element.val();
    this.$element.val(this.placeholder.id);

    var unselectData = {
      data: data
    };
    this.trigger('clear', unselectData);
    if (unselectData.prevented) {
      this.$element.val(previousVal);
      return;
    }

    for (var d = 0; d < data.length; d++) {
      unselectData = {
        data: data[d]
      };

      // Trigger the `unselect` event, so people can prevent it from being
      // cleared.
      this.trigger('unselect', unselectData);

      // If the event was prevented, don't clear it out.
      if (unselectData.prevented) {
        this.$element.val(previousVal);
        return;
      }
    }

    this.$element.trigger('input').trigger('change');

    this.trigger('toggle', {});
  };

  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
      return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
      this._handleClear(evt);
    }
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
      return;
    }

    var removeAll = this.options.get('translations').get('removeAllItems');

    var $remove = $(
      '<span class="select2-selection__clear" title="' + removeAll() +'">' +
        '&times;' +
      '</span>'
    );
    Utils.StoreData($remove[0], 'data', data);

    this.$selection.find('.select2-selection__rendered').prepend($remove);
  };

  return AllowClear;
});

S2.define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var $search = $(
      '<li class="select2-search select2-search--inline">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="searchbox" aria-autocomplete="list" />' +
      '</li>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    var $rendered = decorated.call(this);

    this._transferTabIndex();

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var resultsId = container.id + '-results';

    decorated.call(this, container, $container);

    container.on('open', function () {
      self.$search.attr('aria-controls', resultsId);
      self.$search.trigger('focus');
    });

    container.on('close', function () {
      self.$search.val('');
      self.$search.removeAttr('aria-controls');
      self.$search.removeAttr('aria-activedescendant');
      self.$search.trigger('focus');
    });

    container.on('enable', function () {
      self.$search.prop('disabled', false);

      self._transferTabIndex();
    });

    container.on('disable', function () {
      self.$search.prop('disabled', true);
    });

    container.on('focus', function (evt) {
      self.$search.trigger('focus');
    });

    container.on('results:focus', function (params) {
      if (params.data._resultId) {
        self.$search.attr('aria-activedescendant', params.data._resultId);
      } else {
        self.$search.removeAttr('aria-activedescendant');
      }
    });

    this.$selection.on('focusin', '.select2-search--inline', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('focusout', '.select2-search--inline', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
      evt.stopPropagation();

      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();

      var key = evt.which;

      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
        var $previousChoice = self.$searchContainer
          .prev('.select2-selection__choice');

        if ($previousChoice.length > 0) {
          var item = Utils.GetData($previousChoice[0], 'data');

          self.searchRemoveChoice(item);

          evt.preventDefault();
        }
      }
    });

    this.$selection.on('click', '.select2-search--inline', function (evt) {
      if (self.$search.val()) {
        evt.stopPropagation();
      }
    });

    // Try to detect the IE version should the `documentMode` property that
    // is stored on the document. This is only implemented in IE and is
    // slightly cleaner than doing a user agent check.
    // This property is not available in Edge, but Edge also doesn't have
    // this bug.
    var msie = document.documentMode;
    var disableInputEvents = msie && msie <= 11;

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$selection.on(
      'input.searchcheck',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents) {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        // Unbind the duplicated `keyup` event
        self.$selection.off('keyup.search');
      }
    );

    this.$selection.on(
      'keyup.search input.search',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents && evt.type === 'input') {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        var key = evt.which;

        // We can freely ignore events from modifier keys
        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
          return;
        }

        // Tabbing will be handled during the `keydown` phase
        if (key == KEYS.TAB) {
          return;
        }

        self.handleSearch(evt);
      }
    );
  };

  /**
   * This method will transfer the tabindex attribute from the rendered
   * selection to the search box. This allows for the search box to be used as
   * the primary focus instead of the selection container.
   *
   * @private
   */
  Search.prototype._transferTabIndex = function (decorated) {
    this.$search.attr('tabindex', this.$selection.attr('tabindex'));
    this.$selection.attr('tabindex', '-1');
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    var searchHadFocus = this.$search[0] == document.activeElement;

    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.$selection.find('.select2-selection__rendered')
                   .append(this.$searchContainer);

    this.resizeSearch();
    if (searchHadFocus) {
      this.$search.trigger('focus');
    }
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.$search.val(item.text);
    this.handleSearch();
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '';

    if (this.$search.attr('placeholder') !== '') {
      width = this.$selection.find('.select2-selection__rendered').width();
    } else {
      var minimumWidth = this.$search.val().length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

S2.define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting',
      'clear', 'clearing'
    ];

    var preventableEvents = [
      'opening', 'closing', 'selecting', 'unselecting', 'clearing'
    ];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if ($.inArray(name, relayEvents) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if ($.inArray(name, preventableEvents) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

S2.define('select2/translation',[
  'jquery',
  'require'
], function ($, require) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

S2.define('select2/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u0152': 'OE',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u0153': 'oe',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03CE': '\u03C9',
    '\u03C2': '\u03C3',
    '\u2019': '\''
  };

  return diacritics;
});

S2.define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = container.id + '-result-';

    id += Utils.generateChars(4);

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

S2.define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(':selected').each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if ($(data.element).is('option')) {
      data.element.selected = true;

      this.$element.trigger('input').trigger('change');

      return;
    }

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          var id = data[d].id;

          if ($.inArray(id, val) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('input').trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);
      this.$element.trigger('input').trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    data.selected = false;

    if ($(data.element).is('option')) {
      data.element.selected = false;

      this.$element.trigger('input').trigger('change');

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        var id = currentData[d].id;

        if (id !== data.id && $.inArray(id, val) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);

      self.$element.trigger('input').trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by Select2
      Utils.RemoveData(this);
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      var $option = $(this);

      if (!$option.is('option') && !$option.is('optgroup')) {
        return;
      }

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data
    });
  };

  SelectAdapter.prototype.addOptions = function ($options) {
    Utils.appendMany(this.$element, $options);
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement('optgroup');
      option.label = data.text;
    } else {
      option = document.createElement('option');

      if (option.textContent !== undefined) {
        option.textContent = data.text;
      } else {
        option.innerText = data.text;
      }
    }

    if (data.id !== undefined) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    if (data.title) {
      option.title = data.title;
    }

    var $option = $(option);

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    Utils.StoreData(option, 'data', normalizedData);

    return $option;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = Utils.GetData($option[0], 'data');

    if (data != null) {
      return data;
    }

    if ($option.is('option')) {
      data = {
        id: $option.val(),
        text: $option.text(),
        disabled: $option.prop('disabled'),
        selected: $option.prop('selected'),
        title: $option.prop('title')
      };
    } else if ($option.is('optgroup')) {
      data = {
        text: $option.prop('label'),
        children: [],
        title: $option.prop('title')
      };

      var $children = $option.children('option');
      var children = [];

      for (var c = 0; c < $children.length; c++) {
        var $child = $($children[c]);

        var child = this.item($child);

        children.push(child);
      }

      data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    Utils.StoreData($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (item !== Object(item)) {
      item = {
        id: item,
        text: item
      };
    }

    item = $.extend({}, {
      text: ''
    }, item);

    var defaults = {
      selected: false,
      disabled: false
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
      item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

S2.define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    this._dataToConvert = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.bind = function (container, $container) {
    ArrayAdapter.__super__.bind.call(this, container, $container);

    this.addOptions(this.convertToOptions(this._dataToConvert));
  };

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option').filter(function (i, elm) {
      return elm.value == data.id.toString();
    });

    if ($option.length === 0) {
      $option = this.option(data);

      this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if ($.inArray(item.id, existingIds) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, item, existingData);

        var $newOption = this.option(newData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        Utils.appendMany($option, $children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

S2.define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return $.extend({}, params, {
          q: params.term
        });
      },
      transport: function (params, success, failure) {
        var $request = $.ajax(params);

        $request.then(success);
        $request.fail(failure);

        return $request;
      }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if ($.isFunction(this._request.abort)) {
        this._request.abort();
      }

      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data.call(this.$element, params);
    }

    function request () {
      var $request = options.transport(options, function (data) {
        var results = self.processResults(data, params);

        if (self.options.get('debug') && window.console && console.error) {
          // Check to make sure that the response included a `results` key.
          if (!results || !results.results || !$.isArray(results.results)) {
            console.error(
              'Select2: The AJAX results did not return an array in the ' +
              '`results` key of the response.'
            );
          }
        }

        callback(results);
      }, function () {
        // Attempt to detect if a request was aborted
        // Only works if the transport exposes a status property
        if ('status' in $request &&
            ($request.status === 0 || $request.status === '0')) {
          return;
        }

        self.trigger('results:message', {
          message: 'errorLoading'
        });
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

S2.define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
      this.createTag = createTag;
    }

    var insertTag = options.get('insertTag');

    if (insertTag !== undefined) {
        this.insertTag = insertTag;
    }

    decorated.call(this, $element, options);

    if ($.isArray(tags)) {
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        var item = this._normalizeItem(tag);

        var $option = this.option(item);

        this.$element.append($option);
      }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (obj, child) {
      var data = obj.results;

      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null &&
          !wrapper({
            results: option.children
          }, true)
        );

        var optionText = (option.text || '').toUpperCase();
        var paramsTerm = (params.term || '').toUpperCase();

        var checkText = optionText === paramsTerm;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          obj.data = data;
          callback(obj);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);

      if (tag != null) {
        var $option = self.option(tag);
        $option.attr('data-select2-tag', true);

        self.addOptions([$option]);

        self.insertTag(data, tag);
      }

      obj.results = data;

      callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
      if (this.selected) {
        return;
      }

      $(this).remove();
    });
  };

  return Tags;
});

S2.define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function createAndSelect (data) {
      // Normalize the data object so we can use it for checks
      var item = self._normalizeItem(data);

      // Check if the data object already exists as a tag
      // Select it if it doesn't
      var $existingOptions = self.$element.find('option').filter(function () {
        return $(this).val() === item.id;
      });

      // If an existing option wasn't found for it, create the option
      if (!$existingOptions.length) {
        var $option = self.option(item);
        $option.attr('data-select2-tag', true);

        self._removeOldTags();
        self.addOptions([$option]);
      }

      // Select the item, now that we know there is an option for it
      select(item);
    }

    function select (data) {
      self.trigger('select', {
        data: data
      });
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.trigger('focus');
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      return {
        id: params.term,
        text: params.term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if ($.inArray(termChar, separators) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      if (data == null) {
        i++;
        continue;
      }

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});

S2.define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooShort',
        args: {
          minimum: this.minimumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

S2.define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
        params.term.length > this.maximumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooLong',
        args: {
          maximum: this.maximumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

S2.define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.bind =
    function (decorated, container, $container) {
      var self = this;

      decorated.call(this, container, $container);

      container.on('select', function () {
        self._checkIfMaximumSelected();
      });
  };

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
      var self = this;

      this._checkIfMaximumSelected(function () {
        decorated.call(self, params, callback);
      });
  };

  MaximumSelectionLength.prototype._checkIfMaximumSelected =
    function (_, successCallback) {
      var self = this;

      this.current(function (currentData) {
        var count = currentData != null ? currentData.length : 0;
        if (self.maximumSelectionLength > 0 &&
          count >= self.maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: self.maximumSelectionLength
            }
          });
          return;
        }

        if (successCallback) {
          successCallback();
        }
      });
  };

  return MaximumSelectionLength;
});

S2.define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.bind = function () {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  return Dropdown;
});

S2.define('select2/dropdown/search',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
      '<span class="select2-search select2-search--dropdown">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="searchbox" aria-autocomplete="list" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var resultsId = container.id + '-results';

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();
    });

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$search.on('input', function (evt) {
      // Unbind the duplicated `keyup` event
      $(this).off('keyup');
    });

    this.$search.on('keyup input', function (evt) {
      self.handleSearch(evt);
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);
      self.$search.attr('aria-controls', resultsId);

      self.$search.trigger('focus');

      window.setTimeout(function () {
        self.$search.trigger('focus');
      }, 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);
      self.$search.removeAttr('aria-controls');
      self.$search.removeAttr('aria-activedescendant');

      self.$search.val('');
      self.$search.trigger('blur');
    });

    container.on('focus', function () {
      if (!container.isOpen()) {
        self.$search.trigger('focus');
      }
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer.removeClass('select2-search--hide');
        } else {
          self.$searchContainer.addClass('select2-search--hide');
        }
      }
    });

    container.on('results:focus', function (params) {
      if (params.data._resultId) {
        self.$search.attr('aria-activedescendant', params.data._resultId);
      } else {
        self.$search.removeAttr('aria-activedescendant');
      }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

S2.define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
      var item = data[d];

      if (this.placeholder.id === item.id) {
        modifiedData.splice(d, 1);
      }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

S2.define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.$results.append(this.$loadingMore);
      this.loadMoreIfNeeded();
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.$results.on('scroll', this.loadMoreIfNeeded.bind(this));
  };

  InfiniteScroll.prototype.loadMoreIfNeeded = function () {
    var isLoadMoreVisible = $.contains(
      document.documentElement,
      this.$loadingMore[0]
    );

    if (this.loading || !isLoadMoreVisible) {
      return;
    }

    var currentOffset = this.$results.offset().top +
      this.$results.outerHeight(false);
    var loadingMoreOffset = this.$loadingMore.offset().top +
      this.$loadingMore.outerHeight(false);

    if (currentOffset + 50 >= loadingMoreOffset) {
      this.loadMore();
    }
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
      '<li ' +
      'class="select2-results__option select2-results__option--load-more"' +
      'role="option" aria-disabled="true"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

S2.define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = $(options.get('dropdownParent') || document.body);

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      // Must bind after the results handlers to ensure correct sizing
      self._bindContainerResultHandlers(container);
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.$dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown.removeClass('select2');
    $dropdown.addClass('select2-container--open');

    $dropdown.css({
      position: 'absolute',
      top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._bindContainerResultHandlers =
      function (decorated, container) {

    // These should only be bound once
    if (this._containerResultsHandlersBound) {
      return;
    }

    var self = this;

    container.on('results:all', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('results:append', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('results:message', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('select', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('unselect', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    this._containerResultsHandlersBound = true;
  };

  AttachBody.prototype._attachPositioningHandler =
      function (decorated, container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
      Utils.StoreData(this, 'select2-scroll-position', {
        x: $(this).scrollLeft(),
        y: $(this).scrollTop()
      });
    });

    $watchers.on(scrollEvent, function (ev) {
      var position = Utils.GetData(this, 'select2-scroll-position');
      $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler =
      function (decorated, container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
      left: offset.left,
      top: container.bottom
    };

    // Determine what the parent element is to use for calculating the offset
    var $offsetParent = this.$dropdownParent;

    // For statically positioned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css('position') === 'static') {
      $offsetParent = $offsetParent.offsetParent();
    }

    var parentOffset = {
      top: 0,
      left: 0
    };

    if (
      $.contains(document.body, $offsetParent[0]) ||
      $offsetParent[0].isConnected
      ) {
      parentOffset = $offsetParent.offset();
    }

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')) {
      css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown
        .removeClass('select2-dropdown--below select2-dropdown--above')
        .addClass('select2-dropdown--' + newDirection);
      this.$container
        .removeClass('select2-container--below select2-container--above')
        .addClass('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var css = {
      width: this.$container.outerWidth(false) + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
      css.minWidth = css.width;
      css.position = 'relative';
      css.width = 'auto';
    }

    this.$dropdown.css(css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

S2.define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    var count = 0;

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      if (item.children) {
        count += countResults(item.children);
      } else {
        count++;
      }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    if (this.minimumResultsForSearch < 0) {
      this.minimumResultsForSearch = Infinity;
    }

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
      return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

S2.define('select2/dropdown/selectOnClose',[
  '../utils'
], function (Utils) {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function (params) {
      self._handleSelectOnClose(params);
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
    if (params && params.originalSelect2Event != null) {
      var event = params.originalSelect2Event;

      // Don't select an item if the close event was triggered from a select or
      // unselect event
      if (event._type === 'select' || event._type === 'unselect') {
        return;
      }
    }

    var $highlightedResults = this.getHighlightedResults();

    // Only select highlighted results
    if ($highlightedResults.length < 1) {
      return;
    }

    var data = Utils.GetData($highlightedResults[0], 'data');

    // Don't re-select already selected resulte
    if (
      (data.element != null && data.element.selected) ||
      (data.element == null && data.selected)
    ) {
      return;
    }

    this.trigger('select', {
        data: data
    });
  };

  return SelectOnClose;
});

S2.define('select2/dropdown/closeOnSelect',[

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
      self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
      self._selectTriggered(evt);
    });
  };

  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    var originalEvent = evt.originalEvent;

    // Don't close if the control key is being held
    if (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey)) {
      return;
    }

    this.trigger('close', {
      originalEvent: originalEvent,
      originalSelect2Event: evt
    });
  };

  return CloseOnSelect;
});

S2.define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    },
    removeAllItems: function () {
      return 'Remove all items';
    }
  };
});

S2.define('select2/defaults',[
  'jquery',
  'require',

  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',
  './dropdown/closeOnSelect',

  './i18n/en'
], function ($, require,

             ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend(true, {}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }

      if (options.minimumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MinimumInputLength
        );
      }

      if (options.maximumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumInputLength
        );
      }

      if (options.maximumSelectionLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumSelectionLength
        );
      }

      if (options.tags) {
        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Tokenizer
        );
      }

      if (options.query != null) {
        var Query = require(options.amdBase + 'compat/query');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Query
        );
      }

      if (options.initSelection != null) {
        var InitSelection = require(options.amdBase + 'compat/initSelection');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          InitSelection
        );
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }

      if (options.selectOnClose) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          SelectOnClose
        );
      }
    }

    if (options.dropdownAdapter == null) {
      if (options.multiple) {
        options.dropdownAdapter = Dropdown;
      } else {
        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

        options.dropdownAdapter = SearchableDropdown;
      }

      if (options.minimumResultsForSearch !== 0) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          MinimumResultsForSearch
        );
      }

      if (options.closeOnSelect) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          CloseOnSelect
        );
      }

      if (
        options.dropdownCssClass != null ||
        options.dropdownCss != null ||
        options.adaptDropdownCssClass != null
      ) {
        var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          DropdownCSS
        );
      }

      options.dropdownAdapter = Utils.Decorate(
        options.dropdownAdapter,
        AttachBody
      );
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );
      }

      if (options.allowClear) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          AllowClear
        );
      }

      if (options.multiple) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionSearch
        );
      }

      if (
        options.containerCssClass != null ||
        options.containerCss != null ||
        options.adaptContainerCssClass != null
      ) {
        var ContainerCSS = require(options.amdBase + 'compat/containerCss');

        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          ContainerCSS
        );
      }

      options.selectionAdapter = Utils.Decorate(
        options.selectionAdapter,
        EventRelay
      );
    }

    // If the defaults were not previously applied from an element, it is
    // possible for the language option to have not been resolved
    options.language = this._resolveLanguage(options.language);

    // Always fall back to English since it will always be complete
    options.language.push('en');

    var uniqueLanguages = [];

    for (var l = 0; l < options.language.length; l++) {
      var language = options.language[l];

      if (uniqueLanguages.indexOf(language) === -1) {
        uniqueLanguages.push(language);
      }
    }

    options.language = uniqueLanguages;

    options.translations = this._processTranslations(
      options.language,
      options.debug
    );

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdBase: './',
      amdLanguageBase: './i18n/',
      closeOnSelect: true,
      debug: false,
      dropdownAutoWidth: false,
      escapeMarkup: Utils.escapeMarkup,
      language: {},
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      scrollAfterSelect: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.applyFromElement = function (options, $element) {
    var optionLanguage = options.language;
    var defaultLanguage = this.defaults.language;
    var elementLanguage = $element.prop('lang');
    var parentLanguage = $element.closest('[lang]').prop('lang');

    var languages = Array.prototype.concat.call(
      this._resolveLanguage(elementLanguage),
      this._resolveLanguage(optionLanguage),
      this._resolveLanguage(defaultLanguage),
      this._resolveLanguage(parentLanguage)
    );

    options.language = languages;

    return options;
  };

  Defaults.prototype._resolveLanguage = function (language) {
    if (!language) {
      return [];
    }

    if ($.isEmptyObject(language)) {
      return [];
    }

    if ($.isPlainObject(language)) {
      return [language];
    }

    var languages;

    if (!$.isArray(language)) {
      languages = [language];
    } else {
      languages = language;
    }

    var resolvedLanguages = [];

    for (var l = 0; l < languages.length; l++) {
      resolvedLanguages.push(languages[l]);

      if (typeof languages[l] === 'string' && languages[l].indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = languages[l].split('-');
        var baseLanguage = languageParts[0];

        resolvedLanguages.push(baseLanguage);
      }
    }

    return resolvedLanguages;
  };

  Defaults.prototype._processTranslations = function (languages, debug) {
    var translations = new Translation();

    for (var l = 0; l < languages.length; l++) {
      var languageData = new Translation();

      var language = languages[l];

      if (typeof language === 'string') {
        try {
          // Try to load it with the original name
          languageData = Translation.loadPath(language);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            language = this.defaults.amdLanguageBase + language;
            languageData = Translation.loadPath(language);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files
            if (debug && window.console && console.warn) {
              console.warn(
                'Select2: The language file for "' + language + '" could ' +
                'not be automatically loaded. A fallback will be used instead.'
              );
            }
          }
        }
      } else if ($.isPlainObject(language)) {
        languageData = new Translation(language);
      } else {
        languageData = language;
      }

      translations.extend(languageData);
    }

    return translations;
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(true, this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

S2.define('select2/options',[
  'require',
  'jquery',
  './defaults',
  './utils'
], function (require, $, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    if ($element != null) {
      this.options = Defaults.applyFromElement(this.options, $element);
    }

    this.options = Defaults.apply(this.options);

    if ($element && $element.is('input')) {
      var InputCompat = require(this.get('amdBase') + 'compat/inputData');

      this.options.dataAdapter = Utils.Decorate(
        this.options.dataAdapter,
        InputCompat
      );
    }
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if (Utils.GetData($e[0], 'select2Tags')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      Utils.StoreData($e[0], 'data', Utils.GetData($e[0], 'select2Tags'));
      Utils.StoreData($e[0], 'tags', true);
    }

    if (Utils.GetData($e[0], 'ajaxUrl')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-url` attribute has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.attr('ajax--url', Utils.GetData($e[0], 'ajaxUrl'));
      Utils.StoreData($e[0], 'ajax-Url', Utils.GetData($e[0], 'ajaxUrl'));
    }

    var dataset = {};

    function upperCaseLetter(_, letter) {
      return letter.toUpperCase();
    }

    // Pre-load all of the attributes which are prefixed with `data-`
    for (var attr = 0; attr < $e[0].attributes.length; attr++) {
      var attributeName = $e[0].attributes[attr].name;
      var prefix = 'data-';

      if (attributeName.substr(0, prefix.length) == prefix) {
        // Get the contents of the attribute after `data-`
        var dataName = attributeName.substring(prefix.length);

        // Get the data contents from the consistent source
        // This is more than likely the jQuery data helper
        var dataValue = Utils.GetData($e[0], dataName);

        // camelCase the attribute name to match the spec
        var camelDataName = dataName.replace(/-([a-z])/g, upperCaseLetter);

        // Store the data attribute contents into the dataset since
        dataset[camelDataName] = dataValue;
      }
    }

    // Prefer the element's `dataset` attribute if it exists
    // jQuery 1.x does not correctly handle data attributes with multiple dashes
    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
      dataset = $.extend(true, {}, $e[0].dataset, dataset);
    }

    // Prefer our internal data cache if it exists
    var data = $.extend(true, {}, Utils.GetData($e[0]), dataset);

    data = Utils._convertData(data);

    for (var key in data) {
      if ($.inArray(key, excludedData) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

S2.define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if (Utils.GetData($element[0], 'select2') != null) {
      Utils.GetData($element[0], 'select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up the tabindex

    var tabindex = $element.attr('tabindex') || 0;
    Utils.StoreData($element[0], 'old-tabindex', tabindex);
    $element.attr('tabindex', '-1');

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.dataAdapter = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.dataAdapter.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    // Hide the original select
    $element.addClass('select2-hidden-accessible');
    $element.attr('aria-hidden', 'true');

    // Synchronize any monitored attributes
    this._syncAttributes();

    Utils.StoreData($element[0], 'select2', this);

    // Ensure backwards compatibility with $element.data('select2').
    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
      $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
      var styleWidth = this._resolveWidth($element, 'style');

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
      var elementWidth = $element.outerWidth(false);

      if (elementWidth <= 0) {
        return 'auto';
      }

      return elementWidth + 'px';
    }

    if (method == 'style') {
      var style = $element.attr('style');

      if (typeof(style) !== 'string') {
        return null;
      }

      var attrs = style.split(';');

      for (var i = 0, l = attrs.length; i < l; i = i + 1) {
        var attr = attrs[i].replace(/\s/g, '');
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    if (method == 'computedstyle') {
      var computedStyle = window.getComputedStyle($element[0]);

      return computedStyle.width;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.dataAdapter.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
      self.dataAdapter.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this.$element.on('focus.select2', function (evt) {
      self.trigger('focus', evt);
    });

    this._syncA = Utils.bind(this._syncAttributes, this);
    this._syncS = Utils.bind(this._syncSubtree, this);

    if (this.$element[0].attachEvent) {
      this.$element[0].attachEvent('onpropertychange', this._syncA);
    }

    var observer = window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    ;

    if (observer != null) {
      this._observer = new observer(function (mutations) {
        self._syncA();
        self._syncS(null, mutations);
      });
      this._observer.observe(this.$element[0], {
        attributes: true,
        childList: true,
        subtree: false
      });
    } else if (this.$element[0].addEventListener) {
      this.$element[0].addEventListener(
        'DOMAttrModified',
        self._syncA,
        false
      );
      this.$element[0].addEventListener(
        'DOMNodeInserted',
        self._syncS,
        false
      );
      this.$element[0].addEventListener(
        'DOMNodeRemoved',
        self._syncS,
        false
      );
    }
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.dataAdapter.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle', 'focus'];

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('focus', function (params) {
      self.focus(params);
    });

    this.selection.on('*', function (name, params) {
      if ($.inArray(name, nonRelayEvents) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container.addClass('select2-container--open');
    });

    this.on('close', function () {
      self.$container.removeClass('select2-container--open');
    });

    this.on('enable', function () {
      self.$container.removeClass('select2-container--disabled');
    });

    this.on('disable', function () {
      self.$container.addClass('select2-container--disabled');
    });

    this.on('blur', function () {
      self.$container.removeClass('select2-container--focus');
    });

    this.on('query', function (params) {
      if (!self.isOpen()) {
        self.trigger('open', {});
      }

      this.dataAdapter.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.on('query:append', function (params) {
      this.dataAdapter.query(params, function (data) {
        self.trigger('results:append', {
          data: data,
          query: params
        });
      });
    });

    this.on('keypress', function (evt) {
      var key = evt.which;

      if (self.isOpen()) {
        if (key === KEYS.ESC || key === KEYS.TAB ||
            (key === KEYS.UP && evt.altKey)) {
          self.close(evt);

          evt.preventDefault();
        } else if (key === KEYS.ENTER) {
          self.trigger('results:select', {});

          evt.preventDefault();
        } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
          self.trigger('results:toggle', {});

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger('results:previous', {});

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger('results:next', {});

          evt.preventDefault();
        }
      } else {
        if (key === KEYS.ENTER || key === KEYS.SPACE ||
            (key === KEYS.DOWN && evt.altKey)) {
          self.open();

          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.isDisabled()) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable', {});
    } else {
      this.trigger('enable', {});
    }
  };

  Select2.prototype._isChangeMutation = function (evt, mutations) {
    var changed = false;
    var self = this;

    // Ignore any mutation events raised for elements that aren't options or
    // optgroups. This handles the case when the select element is destroyed
    if (
      evt && evt.target && (
        evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP'
      )
    ) {
      return;
    }

    if (!mutations) {
      // If mutation events aren't supported, then we can only assume that the
      // change affected the selections
      changed = true;
    } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
      for (var n = 0; n < mutations.addedNodes.length; n++) {
        var node = mutations.addedNodes[n];

        if (node.selected) {
          changed = true;
        }
      }
    } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
      changed = true;
    } else if ($.isArray(mutations)) {
      $.each(mutations, function(evt, mutation) {
        if (self._isChangeMutation(evt, mutation)) {
          // We've found a change mutation.
          // Let's escape from the loop and continue
          changed = true;
          return false;
        }
      });
    }
    return changed;
  };

  Select2.prototype._syncSubtree = function (evt, mutations) {
    var changed = this._isChangeMutation(evt, mutations);
    var self = this;

    // Only re-pull the data if we think there is a change
    if (changed) {
      this.dataAdapter.current(function (currentData) {
        self.trigger('selection:update', {
          data: currentData
        });
      });
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      'open': 'opening',
      'close': 'closing',
      'select': 'selecting',
      'unselect': 'unselecting',
      'clear': 'clearing'
    };

    if (args === undefined) {
      args = {};
    }

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.isDisabled()) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    if (this.isDisabled()) {
      return;
    }

    this.trigger('query', {});
  };

  Select2.prototype.close = function (evt) {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close', { originalEvent : evt });
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  Select2.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  Select2.prototype.isDisabled = function () {
    return this.options.get('disabled');
  };

  Select2.prototype.isOpen = function () {
    return this.$container.hasClass('select2-container--open');
  };

  Select2.prototype.hasFocus = function () {
    return this.$container.hasClass('select2-container--focus');
  };

  Select2.prototype.focus = function (data) {
    // No need to re-trigger focus events if we are already focused
    if (this.hasFocus()) {
      return;
    }

    this.$container.addClass('select2-container--focus');
    this.trigger('focus', {});
  };

  Select2.prototype.enable = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("enable")` method has been deprecated and will' +
        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
        ' instead.'
      );
    }

    if (args == null || args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.data = function () {
    if (this.options.get('debug') &&
        arguments.length > 0 && window.console && console.warn) {
      console.warn(
        'Select2: Data can no longer be set using `select2("data")`. You ' +
        'should consider setting the value instead using `$element.val()`.'
      );
    }

    var data = [];

    this.dataAdapter.current(function (currentData) {
      data = currentData;
    });

    return data;
  };

  Select2.prototype.val = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("val")` method has been deprecated and will be' +
        ' removed in later Select2 versions. Use $element.val() instead.'
      );
    }

    if (args == null || args.length === 0) {
      return this.$element.val();
    }

    var newVal = args[0];

    if ($.isArray(newVal)) {
      newVal = $.map(newVal, function (obj) {
        return obj.toString();
      });
    }

    this.$element.val(newVal).trigger('input').trigger('change');
  };

  Select2.prototype.destroy = function () {
    this.$container.remove();

    if (this.$element[0].detachEvent) {
      this.$element[0].detachEvent('onpropertychange', this._syncA);
    }

    if (this._observer != null) {
      this._observer.disconnect();
      this._observer = null;
    } else if (this.$element[0].removeEventListener) {
      this.$element[0]
        .removeEventListener('DOMAttrModified', this._syncA, false);
      this.$element[0]
        .removeEventListener('DOMNodeInserted', this._syncS, false);
      this.$element[0]
        .removeEventListener('DOMNodeRemoved', this._syncS, false);
    }

    this._syncA = null;
    this._syncS = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex',
    Utils.GetData(this.$element[0], 'old-tabindex'));

    this.$element.removeClass('select2-hidden-accessible');
    this.$element.attr('aria-hidden', 'false');
    Utils.RemoveData(this.$element[0]);
    this.$element.removeData('select2');

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.dataAdapter = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container.addClass('select2-container--' + this.options.get('theme'));

    Utils.StoreData($container[0], 'element', this.$element);

    return $container;
  };

  return Select2;
});

S2.define('jquery-mousewheel',[
  'jquery'
], function ($) {
  // Used to shim jQuery.mousewheel for non-full builds.
  return $;
});

S2.define('jquery.select2',[
  'jquery',
  'jquery-mousewheel',

  './select2/core',
  './select2/defaults',
  './select2/utils'
], function ($, _, Select2, Defaults, Utils) {
  if ($.fn.select2 == null) {
    // All methods that should return the element
    var thisMethods = ['open', 'close', 'destroy'];

    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend(true, {}, options);

          var instance = new Select2($(this), instanceOptions);
        });

        return this;
      } else if (typeof options === 'string') {
        var ret;
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var instance = Utils.GetData(this, 'select2');

          if (instance == null && window.console && console.error) {
            console.error(
              'The select2(\'' + options + '\') method was called on an ' +
              'element that is not using Select2.'
            );
          }

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning `this`
        if ($.inArray(options, thisMethods) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = Defaults;
  }

  return Select2;
});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("jquery")))

/***/ }),

/***/ "./node_modules/slick-carousel/slick/slick.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.1
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
;(function(factory) {
    'use strict';
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return $('<button type="button" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                focusOnChange: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: false,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                swiping: false,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    Slick.prototype.activateADA = function() {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.getNavTarget = function() {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        _.autoPlayClear();

        if ( _.slideCount > _.options.slidesToShow ) {
            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if ( !_.paused && !_.interrupted && !_.focussed ) {

            if ( _.options.infinite === false ) {

                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
                    _.direction = 0;
                }

                else if ( _.direction === 0 ) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if ( _.currentSlide - 1 === 0 ) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler( slideTo );

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 0) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

            if (_.options.accessibility === true) {
                _.$dots.off('keydown.slick', _.keyHandler);
            }
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
                _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
            }
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.cleanUpSlideEvents = function() {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 0) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }
        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.focusHandler = function() {

        var _ = this;

        _.$slider
            .off('focus.slick blur.slick')
            .on('focus.slick blur.slick', '*', function(event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function() {

                if( _.options.pauseOnFocus ) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }

            }, 0);

        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            if (_.slideCount <= _.options.slidesToShow) {
                 ++pagerQty;
            } else {
                while (breakPoint < _.slideCount) {
                    ++pagerQty;
                    breakPoint = counter + _.options.slidesToScroll;
                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
                }
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if(!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        }else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide,
            coef;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                coef = -1

                if (_.options.vertical === true && _.options.centerMode === true) {
                    if (_.options.slidesToShow === 2) {
                        coef = -1.5;
                    } else if (_.options.slidesToShow === 1) {
                        coef = -2
                    }
                }
                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
        } else if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft =  0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft =  0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if ( _.options.autoplay ) {

            _.paused = false;
            _.autoPlay();

        }

    };

    Slick.prototype.initADA = function() {
        var _ = this,
                numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
                tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
                    return (val >= 0) && (val < _.slideCount);
                });

        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        if (_.$dots !== null) {
            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
                var slideControlIndex = tabControlIndexes.indexOf(i);

                $(this).attr({
                    'role': 'tabpanel',
                    'id': 'slick-slide' + _.instanceUid + i,
                    'tabindex': -1
                });

                if (slideControlIndex !== -1) {
                   var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex
                   if ($('#' + ariaButtonControl).length) {
                     $(this).attr({
                         'aria-describedby': ariaButtonControl
                     });
                   }
                }
            });

            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                var mappedSlideIndex = tabControlIndexes[i];

                $(this).attr({
                    'role': 'presentation'
                });

                $(this).find('button').first().attr({
                    'role': 'tab',
                    'id': 'slick-slide-control' + _.instanceUid + i,
                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
                    'aria-label': (i + 1) + ' of ' + numDotGroups,
                    'aria-selected': null,
                    'tabindex': '-1'
                });

            }).eq(_.currentSlide).find('button').attr({
                'aria-selected': 'true',
                'tabindex': '0'
            }).end();
        }

        for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {
          if (_.options.focusOnChange) {
            _.$slides.eq(i).attr({'tabindex': '0'});
          } else {
            _.$slides.eq(i).removeAttr('tabindex');
          }
        }

        _.activateADA();

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'previous'
               }, _.changeSlide);
            _.$nextArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'next'
               }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow.on('keydown.slick', _.keyHandler);
                _.$nextArrow.on('keydown.slick', _.keyHandler);
            }
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$dots.on('keydown.slick', _.keyHandler);
            }
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {

            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initSlideEvents = function() {

        var _ = this;

        if ( _.options.pauseOnHover ) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(_.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' :  'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageSrcSet = $(this).attr('data-srcset'),
                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {

                    image
                        .animate({ opacity: 0 }, 100, function() {

                            if (imageSrcSet) {
                                image
                                    .attr('srcset', imageSrcSet );

                                if (imageSizes) {
                                    image
                                        .attr('sizes', imageSizes );
                                }
                            }

                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy data-srcset data-sizes')
                                        .removeClass('slick-loading');
                                });
                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                        });

                };

                imageToLoad.onerror = function() {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

        if (_.options.lazyLoad === 'anticipated') {
            var prevSlide = rangeStart - 1,
                nextSlide = rangeEnd,
                $slides = _.$slider.find('.slick-slide');

            for (var i = 0; i < _.options.slidesToScroll; i++) {
                if (prevSlide < 0) prevSlide = _.slideCount - 1;
                loadRange = loadRange.add($slides.eq(prevSlide));
                loadRange = loadRange.add($slides.eq(nextSlide));
                prevSlide--;
                nextSlide++;
            }
        }

        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        if( !_.unslicked ) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            if (_.slideCount > _.options.slidesToShow) {
                _.setPosition();
            }

            _.swipeLeft = null;

            if ( _.options.autoplay ) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();

                if (_.options.focusOnChange) {
                    var $currentSlide = $(_.$slides.get(_.currentSlide));
                    $currentSlide.attr('tabindex', 0).focus();
                }
            }

        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {

        event.preventDefault();

    };

    Slick.prototype.progressiveLazyLoad = function( tryCount ) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
            image,
            imageSource,
            imageSrcSet,
            imageSizes,
            imageToLoad;

        if ( $imgsToLoad.length ) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageSrcSet = image.attr('data-srcset');
            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function() {

                if (imageSrcSet) {
                    image
                        .attr('srcset', imageSrcSet );

                    if (imageSizes) {
                        image
                            .attr('sizes', imageSizes );
                    }
                }

                image
                    .attr( 'src', imageSource )
                    .removeAttr('data-lazy data-srcset data-sizes')
                    .removeClass('slick-loading');

                if ( _.options.adaptiveHeight === true ) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function() {

                if ( tryCount < 3 ) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout( function() {
                        _.progressiveLazyLoad( tryCount + 1 );
                    }, 500 );

                } else {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [ _ ]);

        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this, currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if ( _.slideCount <= _.options.slidesToShow ) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption =
    Slick.prototype.slickSetOption = function() {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this, l, item, option, value, refresh = false, type;

        if( $.type( arguments[0] ) === 'object' ) {

            option =  arguments[0];
            refresh = arguments[1];
            type = 'multiple';

        } else if ( $.type( arguments[0] ) === 'string' ) {

            option =  arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

                type = 'responsive';

            } else if ( typeof arguments[1] !== 'undefined' ) {

                type = 'single';

            }

        }

        if ( type === 'single' ) {

            _.options[option] = value;


        } else if ( type === 'multiple' ) {

            $.each( option , function( opt, val ) {

                _.options[opt] = val;

            });


        } else if ( type === 'responsive' ) {

            for ( item in value ) {

                if( $.type( _.options.responsive ) !== 'array' ) {

                    _.options.responsive = [ value[item] ];

                } else {

                    l = _.options.responsive.length-1;

                    // loop through the responsive object and splice out duplicates.
                    while( l >= 0 ) {

                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

                            _.options.responsive.splice(l,1);

                        }

                        l--;

                    }

                    _.options.responsive.push( value[item] );

                }

            }

        }

        if ( refresh ) {

            _.unload();
            _.reinit();

        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                    _.$slides
                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.interrupt = function( toggle ) {

        var _ = this;

        if( !toggle ) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.slideHandler(index, false, true);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this, navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if ( _.options.autoplay ) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if ( _.options.asNavFor ) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.swiping = false;

        if (_.scrolling) {
            _.scrolling = false;
            return false;
        }

        _.interrupted = false;
        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

        if ( _.touchObject.curX === undefined ) {
            return false;
        }

        if ( _.touchObject.edgeHit === true ) {
            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
        }

        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

            direction = _.swipeDirection();

            switch ( direction ) {

                case 'left':
                case 'down':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
                            _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
                            _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if( direction != 'vertical' ) {

                _.slideHandler( slideCount );
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction ]);

            }

        } else {

            if ( _.touchObject.startX !== _.touchObject.curX ) {

                _.slideHandler( _.currentSlide );
                _.touchObject = {};

            }

        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        verticalSwipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
            _.scrolling = true;
            return false;
        }

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = verticalSwipeLength;
        }

        swipeDirection = _.swipeDirection();

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            _.swiping = true;
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                    .removeClass('slick-active')
                    .end();

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if ( _.options.autoplay ) {

            if ( document[_.hidden] ) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/app.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("./node_modules/expose-loader/index.js?Popper!./node_modules/popper.js/dist/esm/popper.js-exposed");

__webpack_require__("./node_modules/script-loader/index.js!./node_modules/bootstrap/dist/js/bootstrap.js");

__webpack_require__("./node_modules/script-loader/index.js!./node_modules/daemonite-material/js/material.js");

__webpack_require__("./node_modules/script-loader/index.js!./node_modules/js-cookie/src/js.cookie.js");

__webpack_require__("./ext/config.js");

__webpack_require__("./src/tracking.js");

__webpack_require__("./src/app.scss");

__webpack_require__("./src/general.js");

__webpack_require__("./src/floatbar.js");

__webpack_require__("./src/popup.js");

__webpack_require__("./src/product.js");

__webpack_require__("./src/article.js");

/***/ }),

/***/ "./src/app.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./src/article.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

$('.slider-tab').slick({
  arrows: false,
  variableWidth: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  loop: false
});

$('.tag-pagenews').each(function () {
  var $tag = $(this);

  $tag.find('.next').click(function () {
    $tag.find('.slider-tab').slick('slickNext');
  });
  $tag.find('.prev').click(function () {
    $tag.find('.slider-tab').slick('slickPrev');
  });

  $tag.find('.next').click(function () {
    $tag.find('.product-line').slick('slickNext');
  });
  $tag.find('.prev').click(function () {
    $tag.find('.product-line').slick('slickPrev');
  });
});

$('.product-line').slick({
  arrows: false,
  variableWidth: true,
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 2
});

//show alt img
$('.genesys-content-blog').ready(function () {

  $('img').parent().addClass('image-container');
  // Find our gallery container, and the list of image containers within it:
  var imageContainers = $('.genesys-content-blog').find('.image-container');

  // Loop through the image containers:
  $.each(imageContainers, function (i) {

    // Find the image in each container:
    var image = $(imageContainers[i]).find('img')[0];

    // Create a span element - we'll use this to house our caption:
    var caption = document.createElement('span');

    // Stick the alt tag from the image we found above into the caption <span>:
    $(caption).html(image.alt);

    // Insert the caption <span> into the image container:
    $(imageContainers[i]).append(caption);
  });
});

// Scroll Monitor
window.scrollr = __webpack_require__("./node_modules/scrollMonitor/scrollMonitor.js");

// Floating Tabs
var $floatbar = $('#floatbar nav'),
    $parent = $floatbar.parent();
$parent.height($parent.height());

// Floatbar watcher
var fbWatcher = scrollr.create($floatbar);
fbWatcher.lock();
fbWatcher.stateChange(function () {
  $floatbar.toggleClass('fixed', this.isAboveViewport);
});
if (fbWatcher.isAboveViewport) {
  $floatbar.addClass('fixed');
}

// Tab watcher
$floatbar.find('ul li a').each(function () {
  var tabbtn = $(this),
      tabid = tabbtn.attr('href'),
      fheight = $floatbar.parent().height(),
      tabWatcher = scrollr.create(tabid, {
    top: fheight + 20,
    bottom: -fheight
  });

  // Highlight when scroll
  tabWatcher.stateChange(function () {
    var tabli = tabbtn.parent();
    if (!tabWatcher.isInViewport) {
      tabli.removeClass('active');
    } else if (tabWatcher.isInViewport && tabWatcher.isAboveViewport) {
      tabli.addClass('active');

      // Slide to active tab
      var index = tabli.data("index");
      $floatbar.find('.slider-tab').slick('slickGoTo', index);
    } else {
      tabli.removeClass('active');
    }
  });
});

// Click to scroll
$floatbar.find('ul li a').click(function () {
  var tabid = $(this).attr('href'),
      fheight = $floatbar.parent().height(),
      top = $(tabid).offset().top - (fheight - 30);
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) window.scrollTo(0, top);else $("html,body").animate({ scrollTop: top }, 900);
  return false;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("jquery")))

/***/ }),

/***/ "./src/floatbar.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

// Mobile menu
$('#icon-sidebar').click(function (e) {
  e.stopPropagation();
  $(this).hide();
  $("#icon-stop").show();
  $(".navbar-right-down").addClass("show-mobile");
  $('.lean-overlay').addClass("lean-overlay-sh");
});

$('.lean-overlay,#icon-stop').click(function (e) {
  e.stopPropagation();
  $("#icon-sidebar").show();
  $("#icon-stop").hide();
  $(".navbar-right-down,.level_2").removeClass("show-mobile");
  $('.lean-overlay').removeClass("lean-overlay-sh");
});

$('.three-menu').on("click", function (e) {
  e.stopPropagation();
  $(this).find(" > .level_2").addClass("show-mobile");
});

$('.pre_menu_level2').click(function (e) {
  e.stopPropagation();
  $(this).parent().removeClass("show-mobile");
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("jquery")))

/***/ }),

/***/ "./src/general.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__("./node_modules/slick-carousel/slick/slick.js");

// Plugins
//window.swal = require('sweetalert2');
//window.perfect = require('perfect-scrollbar');

// Validate email
window.ValidEmail = function (mail) {
  var pattern = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(mail);
};

/*
// Back to top
var $gotop = $('#gotop');
if ($(window).width() < 768) $gotop.hide();
else {
  $gotop.find('a').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
    return false;
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() >= 200) $gotop.fadeIn(200);
    else $gotop.fadeOut(200);
  });
}
*/

// Slick gallery


// Slick center slider
$(".discover .slider").slick({
  arrows: true,
  infinite: true,
  centerMode: true,
  slidesToShow: 1,
  slidesToScroll: 3,
  centerPadding: '330px',
  responsive: [{
    breakpoint: 768,
    settings: {
      centerPadding: '50px',
      slidesToScroll: 2
    }
  }, {
    breakpoint: 480,
    settings: {
      centerPadding: '5px',
      slidesToScroll: 1
    }
  }]
});

// Slick center slider
$(".banner-sales-home .slider").slick({
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,
  centerMode: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [{
    breakpoint: 768,
    settings: {
      slidesToScroll: 1
    }
  }, {
    breakpoint: 480,
    settings: {
      slidesToScroll: 1
    }
  }]
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("jquery")))

/***/ }),

/***/ "./src/popup.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

// Khoi tao popup
var $signlog = $('#signlogin'),
    $lostpass = $('#lostpass'),
    $qsvpopup = $('#qsvpopup');
$signlog.modal({ show: false });
$lostpass.modal({ show: false });
$qsvpopup.modal({ show: false });

// Mo popup tu URL
function OpenPopup(url, param, name, id) {
  var method = 'post';
  if (typeof param == 'undefined') {
    method = 'get';
    param = {};
  }
  if (typeof id == 'undefined') id = 'qsvbody';

  ViewPopup(name);
  $.ajax({
    url: url,
    type: method,
    data: param,
    dataType: "html"
  }).done(function (data) {
    $('#' + id).html(data);
  }).fail(function (jqXHR, status) {
    $('#' + id).html("Request failed: " + status);
  });

  return false;
}

// Mo cua so popup
function ViewPopup(name) {
  if (typeof name == 'undefined') name = '';
  $('#qsvname').html(name);
  $('#qsvbody').html('<p class="loading"><i class="fas fa-spinner fa-pulse"></i> Đang xử lý thông tin ...</p>');

  $qsvpopup.modal('show');
  $signlog.modal('hide');
  $lostpass.modal('hide');
}

function ClosePopup() {
  $signlog.modal('hide');
  $lostpass.modal('hide');
  $qsvpopup.modal('hide');
}

// Yeu cau tu van
function SendRequest(id) {
  var frm = $('#' + id),
      ok = true,
      err = '';

  if (frm.find('*[name=name]').val() == "") {
    frm.find('*[name=name]').focus();
    ok = false;
    err += "Bạn chưa nhập họ tên!\n";
  }

  if (frm.find('*[name=tel]').val() == "") {
    frm.find('*[name=tel]').focus();
    ok = false;
    err += "Bạn chưa nhập số điện thoại!\n";
  }

  var email = frm.find('*[name=email]').val();
  if (email != '' && !ValidEmail(email)) {
    frm.find('*[name=email]').focus();
    ok = false;
    err += "Địa chỉ email không hợp lệ!\n";
  }

  if (err != '') {
    alert(err);
    return false;
  }

  if (ok) {
    var $btn = frm.find('button'),
        $proc = $btn.next();
    $btn.hide();
    $proc.show();

    $.ajax({
      type: frm.attr('method'),
      url: frm.attr('action'),
      data: frm.serialize(),
      dataType: 'json'
    }).done(function (data) {
      var msg = "Gửi yêu cầu thất bại. Vui lòng thử lại sau!";
      if (data.success) {
        msg = "Gửi yêu cầu thành công. Cám ơn bạn!";

        // Reset form
        frm[0].reset();
        ClosePopup();
      }
      alert(msg);
    }).always(function (data) {
      //console.log("Complete: ",data);
      $btn.show();
      $proc.hide();
    }).fail(function (xhr, status) {
      console.log("Request failed: ", status);
    });
  }

  return false;
}

$('a[rel="qsvpopup"]').click(function () {
  var url = $(this).attr('href'),
      name = $(this).html(),
      title = $(this).attr('title');
  if (title != null && title != '') name = title;
  OpenPopup(url, { a: 1 }, name);
  return false;
});

// Export object Popup
window.Popup = {
  Open: OpenPopup,
  View: ViewPopup,
  Close: ClosePopup,
  Request: SendRequest
};

$(".lp-voucher").ready(function () {
  $('.select2x').select2();
});

function MakeContact(id) {
  var frm = $('#' + id),
      ok = true,
      err = '';

  if (frm.find('*[name=name]').val() == "") {
    frm.find('*[name=name]').focus();
    ok = false;
    err += "Bạn chưa nhập họ tên!\n";
  }

  if (frm.find('*[name=tel]').val() == "") {
    frm.find('*[name=tel]').focus();
    ok = false;
    err += "Bạn chưa nhập điện thoại!\n";
  }

  if (frm.find('*[name=note]').val() == "") {
    frm.find('*[name=note]').focus();
    ok = false;
    err += "Bạn chưa chọn Voucher!\n";
  }

  if (err != '') {
    alert(err);
    return false;
  }

  if (ok) {
    var $btn = frm.find('button');
    $btn.hide();
    $btn.next().show();

    // Thong tin san pham
    var param = $opts.find('select,input').serialize();
    frm.attr('action', "/lead");
    frm.submit();
  }

  return false;
}

$(".genesys-contact-show-popup").on("click", function () {
  $(".popup-goto-facebook").show();
  $(".popupNew").show();
});

// Xu ly popup
$(".close-popup-send").on("click", function () {
  $(".popup-goto-facebook").hide("300");
  $(".filter-mobile").hide("300");
});

$(".show-list-cata").on("click", function () {
  $(".filter-mobile-fil").show();
});

$(".show-filter-mobile").on("click", function () {
  $(".test-filter").show();
});

$(".close-popup").on("click", function () {
  $(".genesys-popup-product").hide();
  $(".popup-goto-facebook").hide();
  $(".popupNew").hide();
});

$(document).on("click", function (e) {
  if (e.target.id === 'popupSend') {
    $(".popup-goto-facebook").hide("300");
    $(".popupNew").hide();
  }
});

$(document).on("click", function (e) {
  if (e.target.id === 'popup') {
    $(".filter-mobile").hide("300");
  }
});

$(document).on("click", function (e) {
  if (e.target.id === 'popupDM') {
    $(".filter-mobile").hide("300");
  }
});

// var $modal = $('#popupSend');
// if ($modal.length > 0) {
//   setTimeout(function () { $modal.show() }, 30000);
// }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("jquery")))

/***/ }),

/***/ "./src/product.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__("./node_modules/select2/dist/js/select2.js");

$('#product .select2x').select2({
  theme: 'material',
  minimumResultsForSearch: -1,
  allowClear: false,
  closeOnSelect: true,
  dropdownParent: '#product',
  language: 'vi'
});

// // Vertical gallery slider
// $('.slider-main').slick({
//   slidesToShow: 1,
//   arrows: false,
//   asNavFor: '.slider-nav',
//   vertical: true,
//   autoplay: false,
//   verticalSwiping: true,
//   centerMode: false
// });

// if ($(window).width() > 540) {
//   $('.slider-nav').slick({
//     slidesToShow: 5,
//     arrows: false,
//     asNavFor: '.slider-main',
//     vertical: true,
//     focusOnSelect: true,
//     verticalSwiping: false,
//     autoplay: false,
//     centerMode: false

//   });
// }
// else {
//   $('.slider-nav').slick(
//     {
//       slidesToShow: 4,
//       arrows: false,
//       asNavFor: '.slider-main',
//       vertical: true,
//       focusOnSelect: true,
//       verticalSwiping: false,
//       autoplay: false,
//       centerMode: false
//     });

// }

// Select2
$('.slider-main').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: '.slider-nav'
});
if ($(window).width() > 540) {
  $('.slider-nav').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: '.slider-main',
    arrows: false,
    // dots: true,
    // centerMode: true,
    focusOnSelect: true
  });
} else {
  $('.slider-nav').slick({
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-main',
    dots: true,
    centerMode: true,
    focusOnSelect: true
  });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("jquery")))

/***/ }),

/***/ "./src/tracking.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

// tracking phone click
$('.call-phone').click(function (e) {
	e.stopPropagation();
	gtag('event', 'click', { 'event_category': 'Phone', 'non_interaction': true });
});
$('#messageus_button').click(function (e) {
	e.stopPropagation();
	gtag('event', 'click', { 'event_category': 'Messenger', 'non_interaction': true });
});

$('.genesys-zalo-cta').click(function (e) {
	e.stopPropagation();
	gtag('event', 'click', { 'event_category': 'Zalo', 'non_interaction': true });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("jquery")))

/***/ }),

/***/ "jquery":
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map