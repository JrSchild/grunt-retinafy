/*
 * grunt-retinafy
 * https://github.com/JrSchild/grunt-retinafy
 *
 * Copyright (c) 2013 Joram Ruitenschild
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
						'50%':	{ suffix: '@1x' },
						'75%':	{ suffix: '@1.5x' },
						'100%': { suffix: '@2x' }
					}
				},
				files: [{
					expand: true,
					cwd: 'test/default_options',
					src: ['**.{jpg,gif,png}'],
					dest: 'tmp/default_options'
				}]
			},
			keep_structure: {
				options: {
					sizes: {
						'50%':	{ suffix: '@1x' },
						'100%': { suffix: '@2x' }
					}
				},
				files: [{
					expand: true,
					cwd: 'test/keep_structure',
					src: ['**/*.{jpg,gif,png}'],
					dest: 'tmp/keep_structure'
				}],
			},
			fixed_proportions: {
				options: {
					sizes: {
						'w50':		{ suffix: '@w50' },
						'h70':		{ suffix: '@h70' },
						'w80h90':	{ suffix: '@w80h90' }
					}
				},
				files: [{
					expand: true,
					cwd: 'test/default_options',
					src: ['**/*.{jpg,gif,png}'],
					dest: 'tmp/fixed_proportions'
				}],
			},
			prefix_image: {
				options: {
					sizes: {
						'50%':	{ prefix: '1x' },
						'100%': { prefix: '2x' }
					}
				},
				files: [{
					expand: true,
					cwd: 'test/default_options',
					src: ['**/*.{jpg,gif,png}'],
					dest: 'tmp/prefix_image'
				}],
			},
			prefix_to_dir: {
				options: {
					sizes: {
						'50%':	{ prefix: '1x/' },
						'100%': { prefix: '2x/' }
					}
				},
				files: [{
					expand: true,
					cwd: 'test/keep_structure',
					src: ['**/*.{jpg,gif,png}'],
					dest: 'tmp/prefix_to_dir'
				}],
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js'],
		}

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
	grunt.registerTask('default', ['jshint', 'test']);

};
