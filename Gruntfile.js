module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.initConfig({
        jshint: {
            all: ['main.js', 'scene.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: ['*.js'],
            tasks: ['jshint']
        }
    });
};
