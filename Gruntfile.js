var path = require("path");

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-gitbook');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({

    'mochaTest': {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    
    watch: {
      test: {
        files:['bin/**/*.js', 'lib/**/*.js', 'test/**/*.js'],
        tasks:['mochaTest:test']
      }
    },

    'gitbook': {
      development: {
        input: "./doc",
        github: "Horsed/tainr"
      }
    },

    'gh-pages': {
      options: {
        base: 'doc/_book'
      },
      src: ['**']
    },

    'clean': {
      files: '.grunt'
    }
  });

  grunt.registerTask('publish', [
    'gitbook',
    'gh-pages',
    'clean'
  ]);
  grunt.registerTask('test', 'watch:test');
  grunt.registerTask('default', 'gitbook');
};
