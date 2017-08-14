module.exports = function build(grunt) {
  require('load-grunt-tasks')(grunt); // eslint-disable-line
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files: [{ expand: true, src: '**', cwd: 'src/', dest: 'build/' }] },
    },
    babel: {
      options: {
        presets: ['es2015'],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'build/js/',
          src: ['**/*.js'],
          dest: 'temp/',
          ext: '.js',
        }],
      },
    },
    concat: {
      telia: {
        options: {
          separator: ';',
          stripBanners: true,
        },
        src: [
          'temp/dawa.js',
          'temp/config_telia.js',
          'temp/niras.js',
          'temp/layerControl.js',
          'temp/opacityControl.js',
          'temp/index.js',
        ],
        dest: 'build/js/app.js',
      },
      tdc: {
        options: {
          separator: ';',
          stripBanners: true,
        },
        src: [
          'temp/dawa.js',
          'temp/config_tdc.js',
          'temp/niras.js',
          'temp/layerControl.js',
          'temp/opacityControl.js',
          'temp/index.js',
        ],
        dest: 'build/js/app.js',
      },
    },
    uglify: {
      options: {
        mangle: {
          reserved: ['init', 'config', 'map', 'L', 'dawa', 'layerControl', 'opacityControl', 'niras'],
        },
      },
      my_target: {
        files: {
          'build/js/app.min.js': ['build/js/app.js'],
        },
      },
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1,
      },
      target: {
        files: {
          'build/css/app.min.css': [
            'build/css/leaflet.css',
            'build/css/dawa.css',
            'build/css/custom.css',
          ],
        },
      },
    },
    clean: {
      folder: ['temp', 'build/js/dawa'],
      test: ['build/index_test.html'],
      js: ['build/js/*.js', '!build/js/*.min.js'],
      css: ['build/css/*.css', '!build/css/*.min.css'],
    },
  });

  // load plugins
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rename-util');

  grunt.registerTask('telia',
  ['copy', 'babel', 'concat:telia', 'uglify', 'cssmin', 'clean']);
  grunt.registerTask('tdc',
  ['copy', 'babel', 'concat:tdc', 'uglify', 'cssmin', 'clean']);
};
