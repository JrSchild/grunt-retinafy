/*
 * grunt-retinafy
 * https://github.com/JrSchild/grunt-retinafy
 *
 * Copyright (c) 2013 Joram Ruitenschild
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var im = require('node-imagemagick'),
		async = require('async'),
		path = require('path'),
		os = require('os'),
		numCPUs = os.cpus().length,
		r_percentage = /([0-9]+)%$/, // Percentage matching.
		r_width = /w([0-9]+)/, // Width matching.
		r_height = /h([0-9]+)/; // Height matching.

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
		} else {
			return {
				width: (targetSize.match(r_width) || [])[1] || 0,
				height: (targetSize.match(r_height) || [])[1] || 0
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
		};
	}

	/**
	 * Simplified from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format.
	 * Format given string with the list of values. Works like printf
	 * where each replacing value should be an integer.
	 * @param  {String} string
	 * @param  {Array} values
	 * @return {String}
	 */
	function format(string, values) {
		return string.replace(/\{(\d+)\}/g, function(match, number) {
			return values[number];
		});
	}

	grunt.registerMultiTask('retinafy', 'Take the 2x images and generate retina and regular versions', function() {
		var done = this.async(),
			options = this.options({
				sizes: {},
				asyncLimit: numCPUs - 2 || 1
			}),
			start = Date.now();

		// Convert sizes to something more readable.
		options.sizes = convertSizes(options.sizes);

		// For each file asynchronously read it and do other stuff.
		async.eachLimit(this.files, options.asyncLimit, function(f, callback) {
			var extName = path.extname(f.dest),
				srcPath = f.src[0],
				dirName = path.dirname(f.dest),
				baseName = path.basename(srcPath, extName); // filename without extension

			// Get file info.
			im.identify(srcPath, function(err, features) {

				// Make directory if it doesn't exist.
				if (!grunt.file.isDir(dirName)) {
					grunt.file.mkdir(dirName);
				}

				// For each size, resize the image.
				async.eachSeries(options.sizes, function(size, callback) {
					var dstPath = dirName + "/" + baseName + size.settings.suffix + extName,
						destImageSize = processSize(size.size, features);

					im.resize({
						srcPath: srcPath,
						dstPath: dstPath,
						format: extName.replace('.', ''),
						width: destImageSize.width,
						height: destImageSize.height
					}, whenReady(callback));
				}, whenReady(callback));
			});
		}, function (err) {
            if (err) {
                throw err;
            }

			var message = format('Resized {0} image{1} to {2} sizes in {3} ms', [
				this.files.length,
				this.files.length === 1 ? '' : 's',
				options.sizes.length,
				Date.now() - start
			]);
			grunt.log.writeln(message);

            done();
        }.bind(this));
	});

};