module.exports = function(grunt){
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
      src: [
        'src/context.js',
        'src/courier.js',
        'src/injector.js',
        'src/url_state.js',
        'src/view_bag.js',
        'src/manager.js',
        'src/public.js',
      ],
      options: {
        specs: 'specs/*_spec.js'
      }
    },
    concat: {
      options: {
        separator: '\n',
        banner: '<%= meta.banner %>'
      },
      src: {
        src: [
          'src/context.js',
          'src/courier.js',
          'src/injector.js',
          'src/url_state.js',
          'src/view_bag.js',
          'src/manager.js',
          'src/public.js',
        ],
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
