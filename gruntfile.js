'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/background/**/*.js', 'src/contentscript/**/*.js','src/options/**/*.js','!src/options/StationListServlet.js'],
      options: {
        jshintrc: true
      }
    },
    ts: {
      build: {
        src: ['src/background/**/*.ts', 'src/contentscript/**/*.ts','src/options/**/*.ts']
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-ts");
  
  grunt.registerTask('test', ['ts:build','jshint']);

  grunt.registerTask('default', ['jshint']);

};