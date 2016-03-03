module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      prod: {
        src: ['app/assets/js/main.js'],
        dest: 'build/js/main.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      prod: {
        src: ['build/js/main.js'],
        dest: 'build/js/main.min.js',
        compress: true
      }
    },
    less: {
      dev: {
        options: {
          paths: ["app/assets/stylesheets"]
        },
        files: {
          "build/stylesheets/main.css" : "app/assets/stylesheets/main.less"
        }
      },
      prod: {
        options: {
          paths: ["app/assets/stylesheets"]
        },
        files: {
          "build/stylesheets/main.min.css" : "app/assets/stylesheets/main.less"
        },
        compress: true, 
        cleancss: true,
        strictimports: true,
      }
    },
    copy: {
      dev: {
        files: [
          {expand: true, src: "app/views/**", dest: "build/", flatten: true, filter: "isFile"},  
          {expand: true, src: "app/assets/js/*.js", dest: "build/js/", flatten: true},          
          {expand: true, src: "app/assets/images/*", dest: "build/images/", flatten: true},          
          {expand: true, src: "bower_components/jquery/dist/jquery.min.js", dest: "build/js/libs", flatten: true}
        ]
      },
      prod: {
        files: [    
          {expand: true, src: "app/views/**", dest: "build/", flatten: true, filter: "isFile"},  
          {expand: true, src: "app/assets/images/*", dest: "build/images/", flatten: true},          
          {expand: true, src: "bower_components/jquery/dist/jquery.min.js", dest: "build/js/libs", flatten: true}
        ]
      }
    },
    processhtml: {
      prod: {
        files: {
          'build/index.html': ['app/views/index.html'],
          'build/codeofconduct.html': ['app/views/codeofconduct.html'],
          'build/opensource.html': ['app/views/opensource.html']
        }
      }
    }, 
    replace: {
      prod: {
        src: ["build/*.html"],
        overwrite: true,
        replacements: [
          { from: "stylesheets/main.css",
            to: "stylesheets/main.min.css"
          },
          { from: "js/libs/main.js",
            to: "js/libs/main.min.js"
          }
        ]
      }
    },
    clean: ["build/"],
    aws: grunt.file.readJSON('grunt-aws.json'),
    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'private',
        gzip: true,
        gzipExclude: ['.jpg', '.jpeg', '.png']
      },
      prod: {
        upload: [
          {
            src: 'build/*',
            dest: ''
          },
          {
            src: 'build/js/*.min.js',
            dest: 'js/'
          },
          {
            src: 'build/js/libs/*.min.js',
            dest: 'js/libs/'
          },
          {
            src: 'build/stylesheets/*',
            dest: 'stylesheets/'
          },
          {
            src: 'build/images/*',
            dest: 'images/'
          }
        ]
      }
    },
    'http-server': {
      dev: {
        // the server root directory
        root: "build/",
        port: 8282, 
        host: "127.0.0.1",

        cache: 500,
        showDir : true,
        autoIndex: true,
        ext: ["html", "js"],
        runInBackground: false
      }
    },
    watch: {
      coffee: {
        files: ['app/assets/stylesheets/*', 'app/assets/js/*.js', 'app/views/*.html'],
        tasks: ['dev']    
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-http-server');

  // Default task(s).
  grunt.registerTask('default', 'Building a production build', 
    ['clean',
     'concat:prod',
     'uglify:prod', 
     'less:prod', 
     'copy:prod',
     'processhtml:prod', 
     'replace:prod']);

  grunt.registerTask('dev', 'Generating a development build', 
    ['clean',
     'less:dev',
     'copy:dev']);

  grunt.registerTask('deploy', 'Uploading to S3',
    ['default',
     's3:prod']);
};