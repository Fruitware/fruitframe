'use strict';

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      stylus: {
        files: ['src/style/{,*/}*.styl'],
        tasks: ['stylus:development'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      coffee: {
        files: ['src/script/{,*/}*.coffee'],
        tasks: ['coffee:development'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      template: {
        files: ['src/template/{,*/}*.hbs', 'src/template/data/data.json'],
        tasks: ['template'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      development: {
        options: {
          nospawn: true,
          livereload: true
        },
        files: [
          'mockup/{,*/}*.html',
          'mockup/{,*/}*.css',
          'mockup/{,*/}*.js',
          'mockup/{,*/}*.{png,jpg,jpeg,gif}'
        ],
        tasks: []
      }
    },
    stylus: {
      development: {
        options: {
          urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI embedding
          compress: false,
          linenos: true
        },
        files: {
          'mockup/css/application.css': 'src/style/*.build.styl' // compile and concat into single file
        }
      },
      production: {
        options: {
          urlfunc: 'embedurl'
        },
        files: {
          'mockup/css/application.css': 'src/style/*.build.styl'
        }
      }
    },
    coffee: {
      development: {
        options: {
          sourceMap: true,
          bare: true
        },
        files: [{
          expand: true,
          cwd: 'src/script',
          src: '*.coffee',
          dest: 'mockup/js',
          ext: '.js'
        }]
      },
      production: {
        options: {
          bare: true,
          join: true
        },
        files: {
          'mockup/js/application.js': 'src/script/*.coffee' // concat then compile into single file
        }
      }
    },
    template: {
      all: {
        engine: 'handlebars',
        cwd: 'src/template/',
        partials: ['src/template/partials/*.hbs'],
        data: 'src/template/data/data.json',
        options: {
        },
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'src/template/',      // Src matches are relative to this path.
            src: '*.hbs', // Actual pattern(s) to match.
            dest: 'mockup/',   // Destination path prefix.
            ext: '.html'  // Dest filepaths will have this extension.
          }
        ]
      }
    },
    clean: {
      production: {
        src: ['mockup/js/*.map']
      }
    },
    copy: {
      production: {
        files: [
          {expand: false, src: 'mockup/css/application.css', dest: 'app/wp-content/themes/flpwindow/css/application.css'},
          {expand: false, src: 'mockup/js/application.js', dest: 'app/wp-content/themes/flpwindow/js/application.js'},
          {expand: true, cwd: 'mockup/img/', src: '**', dest: 'app/wp-content/themes/flpwindow/img/', filter: 'isFile'}
        ]
      }
    }
  });

  grunt.registerTask('build', [
    'stylus:production',
    'coffee:production',
    'template',
    'clean:production',
    'copy:production'
  ]);

  grunt.registerTask('server', [
    'stylus:development',
    'coffee:development',
    'watch'
  ]);

  grunt.registerTask('default', [
    'server'
  ]);

};
