# grunt-retinafy v0.1.5

> Take the 2x images and generate retina and regular versions

## Getting Started
This plugin requires Grunt `~0.4.1` as well as [Imagemagick](http://www.imagemagick.org/).

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-retinafy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-retinafy');
```

## The "retinafy" task

### Overview
In your project's Gruntfile, add a section named `retinafy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  retinafy: {
    options: {
      // Task-specific options go here.
    },
    files: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.sizes
Type: `Object`
Default value: `',  '`

An object with in each key the target size of your images. This could either be a fixed value or percentage. Possible values: `50%`, `w100`, `h80`. When both a height and width is specified (`w50h80`) the image will be scaled to it's biggest possible size inside these values without stretching it.

The value of each item should be an object with a key suffix and/or prefix. The suffix will be appended to the filename before the extension. Example: `"50%": { suffix: '@1x' }`. The prefix will be prepended to the filename. If this ends with a slash, a subfolder will be created for this file. Examples: `"75%": { prefix: '1.5x' }`, `"75%": { prefix: '1.5x/' }`


### Usage Examples

#### Default Options
In this example, all the images with extension jpg, gif and png present in the folder and subfolder of test/default_options will be placed in three different sizes inside tmp/default_options. The same folder structure will be kept intact.

```js
grunt.initConfig({
  retinafy: {
    options: {
      sizes: {
        '50%':  { suffix: '@1x' },
        '75%':  { suffix: '@1.5x' },
        '100%': { suffix: '@2x' }
      }
    },
    files: [{
      expand: true,
      cwd: 'test/default_options',
      src: ['**/*.{jpg,gif,png}'],
      dest: 'tmp/default_options'
    }],
  },
})
```

#### Fixed width and/or height
All specified files will be resized to three images, one with a width of 50px and one with a height of 70px, the last one will have a maximum of 80px x 90px. That image will have the highest possible resolution within those numbers. The image won't be stretched.

```js
grunt.initConfig({
  retinafy: {
    options: {
      sizes: {
        'w50':    { suffix: '@w50' },
        'h70':    { suffix: '@h70' },
        'w80h90': { suffix: '@w80h90' }
      }
    },
    files: [{
      // File options go here
    }],
  },
})
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2013-11-21   v0.1.5   Removing asyncLimit. Was causing too many problems.
* 2013-11-11   v0.1.4   By default use 1 parallel resize function at the same time. Prefix support.
* 2013-11-09   v0.1.3   Support for fixed width and/or height.
* 2013-10-09   v0.1.2   Use the amount of CPU's - 1 as the amount of parallel resize functions.
* 2013-10-09   v0.1.1   Using async to manage the resize methods. Change in API, in sizes now using an object with options for this size.
