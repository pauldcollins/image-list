'use strict';

// require dependencies
var React = require('react/addons');
var _ = require('lodash');
var $ = require('jquery');

// create extra styles for components
var listStyle = {
    height: '300',
}; 
var rowStyle = {
    marginTop: '50',
};

// create filters
var Filters = React.createClass({

    // filtering function run from each filter element
    handleFilterChange: function() {
        this.props.updateFilter({
            model: this.refs.filterInput.getDOMNode().value,
            make: this.refs.filterMake.getDOMNode().value
        });
    },

    // render filter elements
    render: function() {
        var options = this.props.makes.map(function(make, key){
            return <option key={key} value={make}>{make}</option>;
        });
        return (
            <form className="row">
                <div className="col-lg-2">
                    <h2>Filter by:</h2>
                </div>
                <div className="col-lg-3">
                    <label className="pull-left" htmlFor="camera-model">Camera Model</label>
                    <input className="form-control" id="camera-model" type="text" ref="filterInput" onChange={this.handleFilterChange} placeholder="Camera model" />
                </div>
                <div className="col-lg-3">
                    <label htmlFor="camera-make">Camera Make</label>
                    <select id="camera-make" className="form-control" ref="filterMake" onChange={this.handleFilterChange}>
                        <option value="">-- All camera makes</option>
                        {options}
                    </select>
                </div>
            </form>
        );
    }
});

// create each list component
var List = React.createClass({
    render: function() {        
        var content;   
        if (this.props.items.length > 0) {
            var items = this.props.items.map(function(item, key) {
                return (
                    <li key={key} className="col-lg-3" style={listStyle}>
                        <h2>{item.filename}</h2>
                        <p><img className="img-thumbnail" src={item.photoLink}/></p>
                        <p>
                            {item.model ? [<small>Camera model: <strong>{item.model}</strong></small>, <br/>] : null }
                            {item.make ? [<small>Camera make: <strong>{item.make}</strong></small>] : null }
                        </p>
                    </li>
                )
            });
            content = <ul className="list-unstyled">{items}</ul>            
        } else {
            content = <p className="col-lg-12">No items matching this filter</p>;
        }
        return (
            <div className="results row" style={rowStyle}>
                <h3 className="col-lg-12">Images</h3>
                {content}
            </div>
        );

    }
});

// import data and create parent list container
var ListContainer = React.createClass({

    // get JSON data using AJAX
    loadNotificationsFromServer: function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        success: function(data) { 
          this.setState({data: this.state.data.concat([data])});                
          clearInterval(this.interval);     
        }.bind(this)
      });
    },

    // empty data on initial state
    getInitialState: function() {
        return {
            data: [],
            filterOptions: {}
        };            
    }, 

    // keep checking for data until loaded
    componentWillMount: function() {
        this.loadNotificationsFromServer();
        this.interval = setInterval(this.loadNotificationsFromServer, this.props.pollInterval);
    }, 

    // function used by both filters
    _handleFilterUpdate: function(filterOptions) {
        this.setState({
            filterOptions: filterOptions
        });
    },     

    // function to grab the parts of data we need and create new array
    _hasData: function() {

        // dig down to individual works and map
        var data = this.state.data.map(function(item) {
            return item.works.work; 
        });

        var makes = [];

        // if data loaded, run through data and create new array
        if (data.length > 0) {                
            var imageDetails = _.map(data[0], function(result, n, key){
                var image = _(result.urls.url).find({'_type': 'small'});

                return {
                    id: result.id,
                    filename: result.filename,
                    imageType: image ? image._type : null,
                    photoLink: image ? image.__text : null,
                    model: result.exif.model || '',
                    make: result.exif.make || ''
                };

            }, []);   

            // map makes for filtering
            var makes = imageDetails.map(function(item) { 
                return item.make; 
            });

            // create filters for content when loading
            var displayedItems = imageDetails.filter(function(item) {
                var filterOptions = this.state.filterOptions;
                var match;

                // filter for model
                if (filterOptions.model) {
                    match = item.model.toLowerCase().indexOf(filterOptions.model.toLowerCase());
                    if (match === -1 ) {
                        return false;
                    }
                }

                // filter for make
                if(filterOptions.make) {
                    match = item.make.toLowerCase().indexOf(filterOptions.make.toLowerCase());
                    if (match === -1 ) {
                        return false;
                    }
                }
                return true;
            }.bind(this));

            return [displayedItems, makes];

        } else {
            return [[], makes]
        }
    }, 


    // render filters and image list
    render: function() {
        var result = this._hasData();

        return (
          <div>
            <Filters makes={result[1]} updateFilter={this._handleFilterUpdate} />
            <List items={result[0]} />
          </div>
        );        
    }

});

// initialise the page and add data into child components
var imageList = React.createClass({
    render: function() {
      return (
        <div>       
            <ListContainer url="/scripts/works.json" pollInterval={2000}/>          
        </div>
      );
    }
});


module.exports = imageList;