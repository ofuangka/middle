module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            options: {
                force: true
            },
            dist: 'dist/'
        },
        copy: {
            components: {
                expand: true,
                cwd: 'src/',
                src: 'components/**',
                dest: 'dist/'
            },
            src: {
                expand: true,
                cwd: 'src/',
                src: ['**/*', '!**/components/**', '!**/*.js', '!**/*.css', '!index.html'],
                dest: 'dist/'
            }
        },
        concat: {
            build: {
                src: ['src/**/*.js', '!**/components/**'],
                dest: 'dist/middle.js'
            }
        },
        uglify: {
            build: {
                src: 'dist/middle.js',
                dest: 'dist/middle.min.js'
            }
        },
        cssmin: {
            build: {
                src: ['src/**/*.css', '!**/components/**'],
                dest: 'dist/middle.min.css'
            }
        },
        processhtml: {
            build: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            }
        },
        htmlmin: {
            options: {
                collapseWhitespace: true
            },
            build: {
                expand: true,
                cwd: 'dist',
                src: '**/*.html',
                dest: 'dist/'
            }
        }
    });
    grunt.registerTask('build', ['clean', 'copy:components', 'copy:src', 'concat', 'uglify', 'cssmin', 'processhtml', 'htmlmin']);
    grunt.registerTask('default', ['build']);
};