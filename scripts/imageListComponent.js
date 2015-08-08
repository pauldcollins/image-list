'use strict';

var React = require('react/addons');

var listStyle = {
    height: '300',
};

var Filters = React.createClass({
    handleFilterChange: function() {
        var value = this.refs.filterInput.getDOMNode().value;
        this.props.updateFilter(value);
    },
    render: function() {
        return <input type="text" ref="filterInput" onChange={this.handleFilterChange} placeholder="Filter" />;
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
                            <small>Camera model: <strong>{item.model}</strong></small><br/>
                            <small>Camera make: <strong>{item.make}</strong></small>
                        </p>
                    </li>
                )
            });
            content = <ul className="list-unstyled">{items}</ul>            
        } else {
            content = <p>No items matching this filter</p>;
        }
        return (
            <div className="results">
                <h4>Results</h4>
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
            nameFilter: ''
        };            
    }, 

    componentWillMount: function() {
        this.loadNotificationsFromServer();
        this.interval = setInterval(this.loadNotificationsFromServer, this.props.pollInterval);
    }, 

    _handleFilterUpdate: function(filterValue) {
        this.setState({
            nameFilter: filterValue
        });
    },     

    _hasData: function() {

        var data = this.state.data.map(function(item) {
            return item.works.work; 
        });

        if (data.length > 0) {                
            var imageDetails = _.map(data[0], function(result, n, key){
                var image = _(result.urls.url).find({'_type': 'small'});

                return {
                    id: result.id,
                    filename: result.filename,
                    imageType: image ? image._type : null,
                    photoLink: image ? image.__text : null,
                    model: result.exif.model,
                    make: result.exif.make
                };

                console.log(result);

            }, []);  
            return imageDetails

            // }, []);   
console.log(imageDetails);
            // var displayedItems = imageDetails.filter(function(item) {
            //     console.log(item.model);
            //     var match = item.model.toLowerCase().indexOf(this.state.nameFilter.toLowerCase());
            //     return (match !== -1);
            // }.bind(this));

            // return displayedItems

        } else {
            return false
        }
    }, 

    render: function() {
        return (
          <div>
            <Filters updateFilter={this._handleFilterUpdate} />
            <List items={this._hasData()} />
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