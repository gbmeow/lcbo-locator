'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('boozerApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));


  //Todo: Test this with ngMock
  it("should pull in data from the SoundCloud database",
  inject(function(SoundCloudService, $httpBackend) {

  $httpBackend.expect('GET',
    'https://api.soundcloud.com/tracks.json?' + 
      'client_id=YOUR_CLIENT_ID&q=dubstep')
    .respond(200,
      '[{ title : "some awesome dubstep song from 2013", id : 20 }]');

  SoundCloudService.get('dubstep').then(function(data) {
    expect(data[0].title).toContain('awesome dubstep song');
  });

  $httpBackend.flush();
  });

});
