module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('config/aws.json'),
    copy: {
      target: {
        files: [
          {
            expand: true,
            src: ['bower/jquery/dist/jquery.min.js'],
            dest: 'build/scripts/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            src: ['bower/underscore/underscore-min.js'],
            dest: 'build/scripts/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('-min','');
            }
          },
          {
            expand: true,
            flatten: true,
            src: ['bower/backbone/backbone.js'],
            dest: 'build/scripts/lib/'
          },
          {
            expand: true,
            src: ['bower/marionette/lib/backbone.marionette.min.js'],
            dest: 'build/scripts/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            src: ['bower/d3/d3.min.js'],
            dest: 'build/scripts/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            src: ['bower/foundation/js/foundation.min.js'],
            dest: 'build/scripts/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            flatten: true,
            src: [
              'src/scripts/lib/underscore.js',
              'src/scripts/lib/json2.js',
              'src/scripts/lib/flatpage_stubs.js',
              'src/scripts/lib/d3bb.js'
            ],
            dest: 'build/scripts/lib/'
          },
          { expand: true, flatten: true, src: ['bower/foundation/css/foundation.min.css'], dest: 'build/style/lib' },
          { expand: true, flatten: true, src: ['bower/normalize-css/normalize.css'], dest: 'build/style/lib' },
          { expand: true, flatten: true, src: ['src/data/*'], dest: 'build/data/' },
          { expand: true, flatten: true, src: ['src/images/*'], dest: 'build/images/' },
          { expand: true, flatten: true, src: ['src/style/fonts/boomer/*'], dest: 'build/style/fonts/boomer/' },
          { expand: true, flatten: true, src: ['src/style/fonts/boomer_cond/*'], dest: 'build/style/fonts/boomer_cond/' },
          { expand: true, flatten: true, src: ['src/style/fonts/boomer_extracond/*'], dest: 'build/style/fonts/boomer_extracond/' },
          { expand: true, flatten: true, src: ['src/style/fonts/boomerslab/*'], dest: 'build/style/fonts/boomerslab/' },
          { expand: true, flatten: true, src: ['src/style/fonts/boomerslab_cond*'], dest: 'build/style/fonts/boomerslab_cond' },
          { expand: true, flatten: true, src: ['src/style/fonts/boomerslab_extracond/*'], dest: 'build/style/fonts/boomerslab_extracond/' },
          { expand: true, flatten: true, src: ['src/style/fonts/publico/*'], dest: 'build/style/fonts/publico/' },
          { expand: true, flatten: true, src: ['src/style/fonts/Scout/*'], dest: 'build/style/fonts/Scout/' },
          { expand: true, flatten: true, src: ['src/style/lib/fontawesome/css/*'], dest: 'build/style/lib/fontawesome/css' },
          { expand: true, flatten: true, src: ['src/style/lib/fontawesome/fonts/*'], dest: 'build/style/lib/fontawesome/fonts' },
          { expand: true, flatten: true, src: ['bower/foundation/js/modernizr.js'], dest: 'build/scripts/lib/' },
          { expand: true, flatten: true, src: ['src/scripts/lib/flatpage_stubs.js'], dest: 'build/scripts/lib/' },
          { expand: true, flatten: true, src: ['src/robots.txt'], dest: 'build/' }
        ]
      }
    },

    jshint: {
      files: [
        'src/scripts/*.js'
      ],
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        latedef: true,
        undef: true,
        unused: true,
        trailing: true,
        smarttabs: true,
        indent: 2,
        globals: {
          jQuery: true,
          $: true,
          _: true
        }
      }
    },

    uglify: {
      options: {
        mangle: { except: ['d3', '_','$'] },
        compress: true,
        report: 'gzip'
      },
      my_target: {
        files: {
          'build/scripts/main.js'   : ['src/scripts/main.js'],
          ///// add the rest of your scripts that go inside the build/scripts main.js comment in the html here
        }
      }
    },

    processhtml: {
      options: {
        process: false,
        strip: false
      },
      build: {
        files: {
          'tmp/index.html': ['src/index.html']
        }
      }
    },

    htmlmin: {
      build: {
        options: {
          removeComments: false,
          collapsWhitespace: true,
          useShortDoctype: true
        },
        files: {
          'build/index.html'    : 'src/index.html'
        }
      }
    },

    cssmin: {
      compress: {
        options: {
          report: 'gzip'
        },
        files: {
          'build/style/app.css'       : ['src/style/app.css'],
          'build/style/fonts.css'     : ['src/style/fonts.css']
        }
      }
    },

    imagemin: {
      jpg: {
        options: { progressive: true },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.jpg"],
          dest: "build/images"
        }]
      },
      png: {
        options: { optimizationLevel: 3 },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.png"],
          dest: "build/images"
        }]
      },
      gif: {
        options: { interlaced: true },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.gif"],
          dest: "build/images"
        }]
      },
      svg: {
        options: {
          removeViewBox: false,
          removeEmptyAttrs: false
        },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.svg"],
          dest: "build/images"
        }]
      }
    },

    s3: {
      options: {
        accessKeyId: "<%= aws.key %>",
        secretAccessKey: "<%= aws.secret %>",
        bucket: "<%= aws.bucket %>",
        access: "public-read",
        gzip: true,
        cache: false
      },
      build: {
        cwd: "build/",
        src: "**"
      }
    },

    bowercopy: {
      options: {
        // clean: true,
        runBower: true,
        report: true
      },
      test: {
        options: {
          destPrefix: 'test'
        },
        files: {
          "boot.js": "jasmine/lib/jasmine-core/boot.js",
          "console.js": "jasmine/lib/console/console.js",
          "jasmine-html.js": "jasmine/lib/jasmine-core/jasmine-html.js",
          "jasmine.css": "jasmine/lib/jasmine-core/jasmine.css",
          "jasmine.js": "jasmine/lib/jasmine-core/jasmine.js",
          "jasmine_favicon.png": "jasmine/images/jasmine_favicon.png",
          "sinon.js": "sinon/lib/sinon.js"
        }
      },
      lib_scripts: {
        options: {
          destPrefix: 'src/scripts/lib'
        },
        files: {
          "jquery.js": "jquery/dist/jquery.js",
          "underscore.js": "underscore/underscore.js",
          "json2.js": "json2/json2.js",
          "d3.js": "d3/d3.min.js",
          "d3bb.js": "d3bb/build/d3bb.js",
          "backbone.js": "backbone/backbone.js",
          "backbone.marionette.js": "marionette/lib/backbone.marionette.min.js",
          "modernizr.js": "foundation/js/vendor/modernizr.js",
          "foundation.js": "foundation/js/foundation.min.js"
        }
      },
      lib_styles: {
        options: {
          destPrefix: 'src/style/lib'
        },
        files: {
          "normalize.css": "normalize-css/normalize.css",
          "foundation.css": "foundation/css/foundation.min.css",
          "fontawesome": "fontawesome"
        }
      },
      fonts: {
        options: {
          destPrefix: 'src/style'
        },
        files: {
          "fonts.css": "ajc-design/build/style/fonts.css",
          "fonts": "ajc-design/build/style/fonts"
        }
      }

    },

    sass: {                           // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'src/style/app.css': 'src/style/scss/custom.scss'
        }
      }
    },

    express: {
      dev: {
        options: {
          hostname: '*',
          port: 8000,
          bases: 'src',
          livereload: true,
          showStack: true
        }
      },
      test: {
        options: {
          hostname: '*',
          port: 8080,
          bases: '.',
          livereload: true
        }
      }
    },

    open: {
      dev: {
        path: 'http://localhost:<%= express.dev.options.port %>',
        app: "Google Chrome"
      },
      test: {
        path: 'http://localhost:<%= express.test.options.port %>/SpecRunner.html'
      }
    },

    watch: {
      scss: {
        tasks: ['sass'],
        files: ['src/style/**/*.scss'],
        options: {
          livereload: true
        }
      },
      dev: {
        files: ['src/index.html','src/scripts/*.js','src/scripts/*.js','src/style/**/*.css'],
        options: {
          livereload: true
        }
      },
      test: {
        files: ['src/index.html','src/scripts/*.js','spec/*.js'],
        options: {
          livereload: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['bowercopy','copy','uglify','cssmin','processhtml','htmlmin','s3']);
  grunt.registerTask('build', ['bowercopy','copy','uglify','cssmin','processhtml','htmlmin']);
  grunt.registerTask('deploy', ['s3']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('server', ['express:dev','open:dev','watch:dev','express-keepalive']);
  grunt.registerTask('server:test', ['express:test','open:test','watch:test','express-keepalive']);
  grunt.registerTask('default',['sass']);
};
