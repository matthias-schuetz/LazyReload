/**
 * LazyReload.js
 * A small library that reloads a web page when defined files have been modified.
 * Matthias Schuetz, https://github.com/matthias-schuetz
 *
 * Copyright (C) Matthias Schuetz
 * Free to use under the MIT license
 */

var LazyReload = function() {
	var _isValidDataType = function(obj, type) {
		return (typeof obj == type && obj !== null);
	}

	var _lazyArguments = arguments.callee.arguments,
	_lazyTimer = null,
	_lazyChecksumArray = [],
	_lazyChecksumTemp = null,
	_lazyFilesCount = 0,
	_lazyFilesTotal = 0,
	_lazyReloadPending = false,
	_lazyFileArray = _isValidDataType(_lazyArguments[0], "object") && _lazyArguments[0].length > 0 ? _lazyArguments[0] : null,
	_lazyInterval = _isValidDataType(_lazyArguments[0], "number") ? _lazyArguments[0] : _isValidDataType(_lazyArguments[1], "number") ? _lazyArguments[1] : 1000,
	_lazyMethod = _isValidDataType(_lazyArguments[1], "string") ? _lazyArguments[1] : _isValidDataType(_lazyArguments[2], "string") ? _lazyArguments[2] : "header";

	var _compareChecksums = function() {
		_lazyReloadPending = true;
	
		if (_lazyChecksumArray[_lazyFilesCount] === undefined) {
			_lazyChecksumArray[_lazyFilesCount] = _lazyChecksumTemp;
		} else if (_lazyChecksumArray[_lazyFilesCount] !== _lazyChecksumTemp) {
			location.reload();
		}

		_lazyFilesCount++;
		
		if (_lazyFilesCount < _lazyFilesTotal) {
			_xmlHttpRequest();
		} else {
			_lazyReloadPending = false;
			_lazyFilesCount = 0;
		}
	}
	
	var _xmlHttpRequest = function() {
		var lazyRequest = new XMLHttpRequest();
		
		lazyRequest.onreadystatechange = function() {
			if (lazyRequest.readyState === 4) {
				switch (_lazyMethod) {
					case "header":
						if (lazyRequest.status === 200) {
							_lazyChecksumTemp = lazyRequest.getResponseHeader("Last-Modified").toString();
							_compareChecksums();
						} else {
							console.error("LazyReload: Error on XMLHttpRequest");
						}
					break;
					
					case "length":
						_lazyChecksumTemp = lazyRequest.responseText.toString().length;
						_compareChecksums();
					break;
					
					case "content":
						_lazyChecksumTemp = lazyRequest.responseText.toString();
						_compareChecksums();
					break;
				}
			}
		};

		lazyRequest.open("GET", _lazyFileArray[_lazyFilesCount] + "?" + new Date().getTime(), true); 
		lazyRequest.send(null);
	}

	return {
		activate: function() {
			if (_isValidDataType(_lazyFileArray, "object") && _lazyFileArray.length > 0) {
				if (_lazyMethod == "header" || _lazyMethod == "length" || _lazyMethod == "content") {
					_lazyFilesTotal = _lazyFileArray.length;
					_lazyTimer = window.setInterval(this.run, _lazyInterval);
				} else {
					console.error("LazyReload: Unknown checksum compare method");
				}
			} else {
				console.error("LazyReload: Files for reloading must be defined as array");
			}
		},
		
		deactivate: function() {
			window.clearInterval(_lazyTimer);
		},
		
		add: function(fileName) {
			if (_lazyFileArray === null) _lazyFileArray = [];
			_lazyFileArray.push(fileName)
		},

		run: function() {
			if (!_lazyReloadPending) _xmlHttpRequest();
		}
	};
};