module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      prod: {
        src: ['build/js/main.js'],
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
          {expand: true, src: "app/assets/sprites/*.png", dest: "build/sprites/", flatten: true},          
          {expand: true, src: "bower_components/bootstrap/dist/css/bootstrap.min.css", dest: "build/stylesheets/", flatten: true},
          {expand: true, src: "bower_components/bootstrap/dist/js/bootstrap.js", dest: "build/js/libs", flatten: true},
          {expand: true, src: "bower_components/jquery/dist/jquery.js", dest: "build/js/libs", flatten: true},
        ]
      },
      prod: {
        files: [    
          {expand: true, src: "app/views/**", dest: "build/", flatten: true, filter: "isFile"},  
          {expand: true, src: "app/assets/js/*.js", dest: "build/js/", flatten: true},      
          {expand: true, src: "app/assets/sprites/*.png", dest: "build/sprites/", flatten: true},                
          {expand: true, src: "bower_components/bootstrap/dist/css/bootstrap.min.css", dest: "build/stylesheets/", flatten: true},
          {expand: true, src: "bower_components/bootstrap/dist/js/bootstrap.min.js", dest: "build/js/libs", flatten: true},
          {expand: true, src: "bower_components/jquery/dist/jquery.min.js", dest: "build/js/libs", flatten: true},
        ]
      }
    },
    processhtml: {
      prod: {
        files: {
          'build/index.html': ['app/views/index.html']
        }
      }
    }, 
    replace: {
      prod: {
        src: ["build/index.html"],
        overwrite: true,
        replacements: [
          { from: "stylesheets/main.css",
            to: "stylesheets/main.min.css"
          },
          { from: "js/libs/jquery.js",
            to: "js/libs/jquery.min.js"
          },
          { from: "js/libs/bootstrap.js",
            to: "js/libs/bootstrap.min.js"
          },
          
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
        access: 'private'
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
            src: 'build/sprites/*.png',
            dest: 'sprites/'
          },
          {
            src: 'build/js/libs/*.min.js',
            dest: 'js/libs/'
          },
          {
            src: 'build/stylesheets/*',
            dest: 'stylesheets/'
          }
        ]
      }
    },
    watch: {
      coffee: {
        files: ['app/assets/coffee/*.coffee', 'app/assets/stylesheets/*.less', 'app/assets/js/*.js', 'app/views/*.html'],
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
    ['less:dev',
     'copy:dev']);

  grunt.registerTask('deploy', 'Uploading to S3',
    ['default',
     's3:prod']);
};