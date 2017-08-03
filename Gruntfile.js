module.exports = function build(grunt) {
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
      options: {
        separator: ';',
        stripBanners: true,
      },
      dist: {
        src: ['temp/config.js',
          'temp/map.js', 'temp/init.js',
          'temp/dawa/connections.js', 'temp/dawa/main.js'],
        dest: 'build/js/app.js',
      },
    },
    uglify: {
      options: {
        mangle: {
          reserved: ['init', '_config', 'map', 'L', 'dawa'],
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
          'build/css/app.min.css': ['build/css/leaflet.css',
            'build/css/dawa.css', 'build/css/custom.css'],
        },
      },
    },
    clean: {
      folder: ['temp', 'build/js/dawa'],
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

  // Default task(s).
  grunt.registerTask('test', ['copy']);
  grunt.registerTask('default', ['copy', 'babel', 'concat', 'uglify', 'cssmin', 'clean']);
  require('load-grunt-tasks')(grunt); // eslint-disable-line
};
