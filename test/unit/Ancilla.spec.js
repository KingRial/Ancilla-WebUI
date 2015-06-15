import {AncillaCore} from '../../Compiler/source/Ancilla/Ancilla/www/libs/Ancilla';

/*
class RouterStub {
  configure(handler) {
    handler(this);
  }
  map(routes) {
    this.routes = routes;
  }
}
*/

describe('the Ancilla class', () => {
  //var Ancilla;
  //beforeEach(() => { Ancilla = new AncillaCore(); });
  var sut
   , mockedRouter
   , Ancilla ;

 beforeEach(() => {
   mockedRouter = new RouterStub();
   sut = new App(mockedRouter);
   sut.configureRouter(mockedRouter, mockedRouter);
   Ancilla = new AncillaCore();
 });

  it('contains a __oOptions property', () => {
    expect( Ancilla.__oOptions ).toBeDefined();
  });
  /*
  it('configures the router title', () => {
    expect( sut.router.title ).toEqual('Aurelia');
  });

  it('should have a welcome route', () => {
    expect( sut.router.routes ).toContain({ route: ['','welcome'],  moduleId: 'welcome', nav: true, title:'Welcome' });
  });

  it('should have a flickr route', () => {
     expect( sut.router.routes ).toContain({ route: 'flickr', moduleId: 'flickr', nav: true });
  });

  it('should have a child router route', () => {
    expect( sut.router.routes ).toContain({ route: 'child-router', moduleId: 'child-router', nav: true, title:'Child Router' });
  });
  */
});
