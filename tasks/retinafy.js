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

	grunt.registerMultiTask('retinafy', 'Take the 2x images and generate retina and regular versions', function() {
		var done = this.async();

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			sizes: {}
		});

		// cache regexes.
		var r_percentage = /([0-9]+)%$/;
		function processSize(targetSize, currSize) {
			var match = (targetSize.match(r_percentage) || [])[1];
			var sizes;

			if (match /= 100) {
				sizes = {
					width: currSize.width * match,
					height: 0
				}
				return sizes;
			}
		}

		function getPathTo(image, name) {
			var parts = image.split('/');
			var path = {};

			path.file = parts.slice(-1)[0].replace('${name}', name);
			if (parts.length > 1) {
				path.path = '/' + parts.slice(0, -1).join('/');
			}

			return path;
		}

		this.files.forEach(function(f) {
			var extName = path.extname(f.dest),
				srcPath = f.src[0],
				baseName = path.basename(srcPath, extName), // filename without extension
				dirName,
				dstPath;

			// First get the dimensions of the file.
			im.identify(f.src[0], function(err, features) {
				if (err) {
					throw err;
				}

				var currImageSize = {
					width: features.width,
					height: features.height
				}

				for (var size in options.sizes) {
					var imagePath = getPathTo(options.sizes[size], baseName);

					dirName = path.dirname(f.dest) + imagePath.path;

					// Make directory if it doesn't exist.
					if (!grunt.file.isDir(dirName)) {
						grunt.file.mkdir(dirName);
					}

					dstPath = path.join(dirName, baseName + size + extName);

					var dest = options.sizes[size];
					var destImageSize = processSize(size, currImageSize);

					im.resize({
						srcPath: srcPath,
						dstPath: dstPath,
						format: extName.replace('.', ''),
						width: destImageSize.width,
						height: destImageSize.height
					}, function(err, stdout, stderr) {
						if (err) {
							throw err;
						}
					});

				}
			}); /** /Identify */

		}); /** /files.forEach */

	}); /** /registerMultiTask */

};
