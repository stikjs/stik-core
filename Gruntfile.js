module.exports = function(grunt){
  var srcFiles = [
    'src/setup.js',
    'src/context.js',
    'src/behavior.js',
    'src/boundary.js',
    'src/courier.js',
    'src/injector.js',
    'src/view_bag.js',
    'src/manager.js',
    'src/dom_lib_loader.js',
    'src/public.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '<%= pkg.banner.divider %>' +
              '<%= pkg.banner.project %>' +
              '<%= pkg.banner.copyright %>' +
              '<%= pkg.banner.license %>' +
              '<%= pkg.banner.licenseLink %>' +
              '<%= pkg.banner.divider %>' +
              '\n' +
              '// Version: <%= pkg.version %> | From: <%= grunt.template.today("dd-mm-yyyy") %>\n\n'
    },
    jasmine: {
      src: srcFiles,
      options: {
        specs: 'specs/*_spec.js',
        template: require('grunt-template-jasmine-istanbul'),
        templateOptions: {
          coverage: 'reports/coverage.json',
          report: [{
            type: 'lcov',
            options: {
              dir: 'reports/lcov'
            }
          },{
            type: 'html',
            options: {
              dir: 'reports/html'
            }
          }
          ]
        }
      }
    },
    concat: {
      options: {
        separator: '\n',
        banner: '<%= meta.banner %>'
      },
      src: {
        src: srcFiles,
        dest: '<%= pkg.name %>'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      stik: {
        files: {
         'stik.min.js': ['stik.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', 'jasmine');
  grunt.registerTask('pack', ['concat', 'uglify']);
};
