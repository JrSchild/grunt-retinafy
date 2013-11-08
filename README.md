# grunt-retinafy v0.1.1

> Take the 2x images and generate retina and regular versions

## Getting Started
This plugin requires Grunt `~0.4.1`

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

An object with in the key a percentage based value like `"50%"` for the image to scale to. And in the value an object with the key suffix that will define what will be appended to the end of the filename. Example: `"50%": { suffix: '@1x' }`


#### options.asyncLimit
Type: `integer`
Default value: number of CPU's - 1

Grunt-retinafy tries to optimize the speed by asynchronously scaling images. You can force the program to use more than the default amount (for your system) of asynchronous actions.

Getting the error message: `Fatal error: Cannot call method 'match' of undefined`? Try using a lower number here and see what works most optimal for your system.



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


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
