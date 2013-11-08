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
	var os = require('os');
	var numCPUs = os.cpus().length;
	var r_percentage = /([0-9]+)%$/; // Percentage matching.

	/**
	 * Process the size, return object of new size.
	 * Currently only test percentages.
	 */
	function processSize(targetSize, origSize) {
		var match = (targetSize.match(r_percentage) || [])[1];

		if (match /= 100) {
			return {
				width: origSize.width * match,
				height: 0
			};
		}
	}

	/**
	 * In order to do async.each we have to iterate over an array
	 * Turn the sizes-object into an array of objects.
	 * @param  {Object} sizes
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

	/**
	 * Create simple callback function that will
	 * call callback if no errors are given
	 * @param  {Function} callback
	 * @return {Function}
	 */
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
		var options = this.options({
			sizes: {},
			asyncLimit: numCPUs - 1 || 1
		});

		// Convert sizes to something more readable.
		options.sizes = convertSizes(options.sizes);

		// For each file asynchronously read it and do other stuff.
		async.eachLimit(this.files, options.asyncLimit, function(f, callback) {
			var extName = path.extname(f.dest),
				srcPath = f.src[0],
				dirName = path.dirname(f.dest),
				baseName = path.basename(srcPath, extName); // filename without extension

			// get file info.
			im.identify(srcPath, function(err, features) {

				// Make directory if it doesn't exist.
				if (!grunt.file.isDir(dirName)) {
					grunt.file.mkdir(dirName);
				}

				// For each size, resize the image.
				async.eachLimit(options.sizes, 1, function(size, callback) {
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
		}, whenReady(done));

	});

};