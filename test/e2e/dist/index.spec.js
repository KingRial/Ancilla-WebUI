'use strict';

describe('ancilla skeleton app', function () {

  beforeEach(function () {
    browser.loadAndWaitForAureliaPage('http://localhost:9000');
  });

  it('should load the page and display the initial page title', function () {
    expect(browser.getTitle()).toBe('_LOGOUT | _ANCILLA');
  });
  /*
    it('should navigate to "runtime"', () => {
      element( by.css('a[href="#/runtime"]') ).click();
      browser.waitForHttpDone();
      expect( browser.getTitle() ).toBe('Flickr | Aurelia');
    });
  */
});