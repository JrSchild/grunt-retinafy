/*
 * grunt-retinafy
 * https://github.com/laurentvd/grunt-retinafy
 *
 * Copyright (c) 2013 Laurent van Dommelen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>',
			],
			options: {
				jshintrc: '.jshintrc',
			},
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp'],
		},

		// Configuration to be run (and then tested).
		retinafy: {
			default_options: {
				options: {
					sizes: {
						'50%': '1x/${name}@1x',
						'75%': '1.5x/${name}@1.5x',
						'100%': '2x/${name}@2x'
					}
				},
				files: [{
					expand: true,
					cwd: 'test/fixtures',
					src: ['**.{jpg,gif,png}'],
					dest: 'tmp/default_options'
				}],
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js'],
		},

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'retinafy', 'nodeunit']);

	// By default, lint and run all tests.
	// grunt.registerTask('default', ['jshint', 'test']);
	grunt.registerTask('default', ['test']);

};
