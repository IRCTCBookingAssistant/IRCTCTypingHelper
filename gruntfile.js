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
    tslint: {
      options: {
        configuration: grunt.file.readJSON("./node_modules/grunt-tslint/tslint.json")
      },
      files: {
        src: ['src/background/**/*.ts', 'src/contentscript/**/*.ts','src/options/**/*.ts']
      }
    },
    watch: {
      files: ['<%= ts.build.src%>','<%= jshint.files %>'],
      tasks: ['tslint','ts:build','jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-tslint');
  
  grunt.registerTask('test', ['tslint','ts:build','jshint']);

  grunt.registerTask('default', ['tslint','ts:build','jshint']);

};