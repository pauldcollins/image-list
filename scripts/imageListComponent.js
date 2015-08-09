'use strict';

var React = require('react/addons');

var listStyle = {
    height: '300',
};

var Filters = React.createClass({
    handleFilterChange: function() {
        this.props.updateFilter({
            model: this.refs.filterInput.getDOMNode().value,
            make: this.refs.filterMake.getDOMNode().value
        });
    },
    render: function() {
        var options = this.props.makes.map(function  (make){
            return <option value={make}>{make}</option>;
        });
        return (
            <form className="row">
                <div className="col-lg-2">
                    <h2>Filter by:</h2>
                </div>
                <div className="col-lg-3">
                    <label className="pull-left" for="camera-model">Camera Model</label>
                    <input className="form-control" id="camera-model" type="text" ref="filterInput" onChange={this.handleFilterChange} placeholder="Camera model" />
                </div>
                <div className="col-lg-3">
                    <label for="camera-model">Camera Make</label>
                    <select className="form-control" ref="filterMake" onChange={this.handleFilterChange}>
                        <option value="">-- All camera makes</option>
                        {options}
                    </select>
                </div>
            </form>
        );
    }
});

/** @jsx React.DOM */
var List = React.createClass({
    render: function() {        
        var content;   
        if (this.props.items.length > 0) {
            var items = this.props.items.map(function(item) {
                return (
                    <li className="col-lg-3" style={listStyle}>
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
            content = <p>No items matching this filter</p>;
        }
        return (
            <div className="results row">
                <h4 className="col-lg-12">Results</h4>
                {content}
            </div>
        );

    }
});

var ListContainer = React.createClass({
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

    getInitialState: function() {
        return {
            data: [],
            filterOptions: {}
        };            
    }, 

    componentWillMount: function() {
        this.loadNotificationsFromServer();
        this.interval = setInterval(this.loadNotificationsFromServer, this.props.pollInterval);
    }, 

    _handleFilterUpdate: function(filterOptions) {
        this.setState({
            filterOptions: filterOptions
        });
    },     

        _hasData: function() {

        var data = this.state.data.map(function(item) {
            return item.works.work; 
        });
        var makes = [];

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

            var makes = imageDetails.map(function(item) { return item.make; });

            var displayedItems = imageDetails.filter(function(item) {
                var filterOptions = this.state.filterOptions;
                var match;
                if (filterOptions.model) {
                    match = item.model.toLowerCase().indexOf(filterOptions.model.toLowerCase());
                    if (match === -1 ) {
                        return false;
                    }
                }
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

// INITIALISE PAGE
var imageList= React.createClass({
    render: function() {
      /* component composition == function componsition */
      return (
        <div>       
            <ListContainer url="/scripts/works.json" pollInterval={2000}/>          
        </div>
      );
    }
  });

module.exports = imageList;