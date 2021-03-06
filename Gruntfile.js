const config = require('config')['knex'];

// if (process.env.DATABASE_URL) {
//   const url = process.env.DATABASE_URL;
//   const name = process.env.DATABASE_DB;
// } else {
//   const url = require('./config/development.json').postgresql.DATABASE_URL;
//   const name = require('./config/development.json').postgresql.DATABASE_DB;
// }

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      target: ['Gruntfile.js', 'client/**/*.js', 'db/**/*.js', 'server/**/*.js']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['server/test/**/*.js']
      }
    },

    pgcreatedb: {
       default: {
        connection: {
          user: config.connection.user,
          password: config.connection.password,
          host: config.connection.host,
          port: config.connection.port,
          database: 'template1'
        },
        name: config.connection.database,
      staging: {
        connection: {
          url: config.connection.url,
        },
        name: config.connection.database,
      },
      production: {
        connection: {
          url: config.connection.url,
        },
        name: config.connection.database,
      },
    }
  }




  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-pg');

  grunt.registerTask('default', ['eslint']);
  grunt.registerTask('test', ['mochaTest']);
};
