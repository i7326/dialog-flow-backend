/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */

const { series, crossEnv, concurrent, rimraf, runInNewWindow } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps serve',
    /**
     * Starts the builded app from the dist directory
     */
    start: {
      script: 'node bin/app.js',
      description: 'Starts the builded app from the dist directory'
    },
    /**
     * Serves the current app and watches for changes to restart it
     */
    serve: {
      script: series(
        'nps banner.serve',
        'nodemon --watch src --watch .env'
      ),
      description: 'Serves the current app and watches for changes to restart it'
    },
    /**
     * Builds the app into the dist directory
     */
    build: {
      script: series(
        'nps banner.build',
        'nps lint',
        'nps clean.bin',
        'nps transpile'
      ),
      description: 'Builds the app into the bin directory'
    },
    /**
     * Runs TSLint over your project
     */
    lint: {
      script: tslint(`./src/**/*.ts`),
      hiddenFromHelp: true
    },
    /**
     * Transpile your app into javascript
     */
    transpile: {
      script: `tsc --project ./tsconfig.json`,
      hiddenFromHelp: true
    },
    /**
     * Clean files and folders
     */
    clean: {
      default: {
        script: series(
          `nps banner.clean`,
          `nps clean.bin`
        ),
        description: 'Deletes the ./bin folder'
      },
      bin: {
        script: rimraf('./bin'),
        hiddenFromHelp: true
      },
      dist: {
        script: rimraf('./dist'),
        hiddenFromHelp: true
      }
    },
    /**
     * This creates pretty banner to the terminal
     */
    banner: {
      build: banner('build'),
      serve: banner('serve'),
      testUnit: banner('test.unit'),
      testIntegration: banner('test.integration'),
      testE2E: banner('test.e2e'),
      package: banner('package'),
      revert: banner('revert'),
      clean: banner('clean')
    }
  }
};

function banner(name) {
  return {
    hiddenFromHelp: true,
    silent: true,
    description: `Shows ${name} banners to the console`,
    script: run(`./commands/banner.ts ${name}`)
  }
}

function run(path) {
  return `ts-node ${path}`;
}

function tslint(path) {
  return `tslint -c ./tslint.json ${path} --format stylish`;
}
