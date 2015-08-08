jest.dontMock('../scripts/imageListComponent.js');

describe('ImageList', function() {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var ImageList;

  beforeEach(function() {
    ImageList = require('../scripts/imageListComponent');
  });

  it('should exists', function() {
    // Render into document
    var imageList = TestUtils.renderIntoDocument( <List /> );
    expect(TestUtils.isCompositeComponent(imageList)).toBeTruthy();
  });
});