Ancilla Web UI — Free Home Automation
==================================================

[![Join the chat at https://gitter.im/KingRial/Ancilla-WebUI](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/KingRial/Ancilla-WebUI?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the web user interface part of the Ancilla project.
Built using the framework [Aurelia](http://aurelia.io/) the purpose is to create a fully customizable and free solution to handle the Ancilla UI.

*Please be aware this is just an experimental version used to test technologies and solutions; it's still far from being the final result*

*Any idea or contribution is welcome!*

Changelog
----------------------------
![Technology Concept](CHANGELOG.md)

Project documentation
----------------------------
TODO

How to compile Ancilla Web UI
----------------------------

## Running The App

To run the app, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. Clone a copy of the main Ancilla Web UI git repo by running:

  ```bash
  git clone https://github.com/KingRial/Ancilla-WebUI.git
  ```
3. From the project folder, execute the following command:

  ```shell
  npm install
  ```
4. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
5. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g jspm
  ```
  > **Note:** jspm queries GitHub to install semver packages, but GitHub has a rate limit on anonymous API requests. It is advised that you configure jspm with your GitHub credentials in order to avoid problems. You can do this by executing `jspm registry config github` and following the prompts.
  >**Note:** Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip`.
6. Ensure that [http-server](https://github.com/indexzero/http-server) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g http-server
  ```
7. To run the app, execute the following command:

  ```shell
  http-server -o
  ```

Running The Unit Tests
----------------------------

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```

2. You can now run the tests with this command:

  ```shell
  karma start
  ```

Running The E2E Tests
----------------------------
Integration tests are performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your E2E-Tests into the folder ```test/e2e/src```

2. Configure the path to the webdriver by opening the file ```protractor.conf.js``` and adjusting the ```seleniumServerJar``` property. Typically its only needed to adjust the version number.

3. Run the E2E-Tests

  ```shell
  gulp test-e2e
  ```


The future
--------------------------------------
- Administration tools
- Developer tools
- Branding and full Customization

License
-------
See [Aurelia License]( https://github.com/aurelia/framework/blob/master/LICENSE )
