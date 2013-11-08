/*
 * grunt-retinafy
 * https://github.com/laurentvd/grunt-retinafy
 *
 * Copyright (c) 2013 Laurent van Dommelen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var im = require('node-imagemagick');
	var async = require('async');
	var path = require('path');

	// cache regexes.
	var r_percentage = /([0-9]+)%$/;

	/**
	 * Process the targetsize to an object suitable for imagemagick
	 */
	function processSize(targetSize, currSize) {
		var match = (targetSize.match(r_percentage) || [])[1];
		var sizes;

		if (match /= 100) {
			sizes = {
				width: currSize.width * match,
				height: 0
			};
			return sizes;
		}
	}

	/**
	 * In order to do async.each we have to iterate over an array
	 * Turn the sizes array into an array of objects.
	 * @return {Object}
	 */
	function convertSizes(sizes) {
		var tmp = [];
		for (var size in sizes) {
			tmp.push({
				size: size,
				settings: sizes[size]
			});
		}
		return tmp;
	}

	function whenReady(callback) {
		return function(err) {
			if (err) {
				throw err;
			}
			callback();
		}
	}

	grunt.registerMultiTask('retinafy', 'Take the 2x images and generate retina and regular versions', function() {
		var done = this.async();
		var series = [];
		var options = this.options({
			sizes: {}
		});

		// Convert sizes to something more readable.
		options.sizes = convertSizes(options.sizes);

		async.each(this.files, function(f, callback) {
			var extName = path.extname(f.dest),
				srcPath = f.src[0],
				dirName = path.dirname(f.dest),
				baseName = path.basename(srcPath, extName); // filename without extension

			// get file info...
			im.identify(f.src[0], function(err, features) {

				// Make directory if it doesn't exist.
				if (!grunt.file.isDir(dirName)) {
					grunt.file.mkdir(dirName);
				}

				// For each size resize the image.
				async.each(options.sizes, function(size, callback) {
					// var dstPath = path.join(dirName, baseName, size.settings.suffix, extName);
					var dstPath = dirName + "/" + baseName + size.settings.suffix + extName;
					var destImageSize = processSize(size.size, features);

					im.resize({
						srcPath: srcPath,
						dstPath: dstPath,
						format: extName.replace('.', ''),
						width: destImageSize.width,
						height: destImageSize.height
					}, whenReady(callback));
				}, whenReady(callback));
			});
		}, done);

	}); /** /registerMultiTask */

};
