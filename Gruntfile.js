var path = require("path");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-gitbook');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
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
    grunt.registerTask('default', 'gitbook');
};