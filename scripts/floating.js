/*Tab section*/
var MyItemTab = React.createClass({
  displayName: 'MyItemTab',
  mixins: [TabWrapperMixin],

  handleClick: function () {
    if (typeof this.props.onClose === "function") {
      this.props.onClose(this.props.index);
    }
  },

  render: function() {

    return (
      React.createElement(Tab, {
        icon: this.props.icon,
        title: this.props.title
      },
          React.createElement(Content, null, React.createElement(section, {location:this.props.item.name})
        )
      )
    );
  }
});
/*Main panel section*/
var MyFloatingPanel = React.createClass({
  displayName: 'MyFloatingPanel',

  getInitialState: function () {
      if (!localStorage.tabs) {
          var arr = [{
              "id": "0",
              "name": 'New York, NY'
          },
          {
              "id": "1",
              "name": 'Kiev, UA'
          }];
          localStorage.tabs = JSON.stringify(arr);
      }
    var myTabs = JSON.parse(localStorage.tabs);
    this.itemsShown = myTabs;
    return {toolbars: true};
  },
/*City verification*/
  addTab: function (itemIndex) {
    if (this.refs.newLocation.getDOMNode().value) {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/find?q="+this.refs.newLocation.getDOMNode().value+"&appid=44db6a862fba0b067b1930da0d769e98",
            dataType: 'json',
            success: function(data) {
                if (data.cod === "200"){
                    var weather = data,
                        add = {
                        "id": (Math.random()*Math.pow(36,4) << 0).toString(36),
                        "name": this.refs.newLocation.getDOMNode().value
                    };
                    this.itemsShown.push(add);
                    localStorage.tabs = JSON.stringify(this.itemsShown);
                    this.refs.myPanel.setSelectedIndex(JSON.parse(localStorage.tabs).length-1);
                    this.forceUpdate();}
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
  },

  removeTab: function (itemIndex) {
    var self = this,
        newTabs = this.state.tabs,
        selectedIndex = this.refs.myPanel.getSelectedIndex();
    this.itemsShown.splice(itemIndex, 1);
    localStorage.tabs = JSON.stringify(this.itemsShown);
    this.refs.myPanel.setSelectedIndex((selectedIndex === 0)?localStorage.selectedIndex:localStorage.selectedIndex-1);
    this.forceUpdate();
  },

  render: function() {
    var self = this;

    return (
            React.createElement("div", {className:"floating"},
                React.createElement("form", {onSubmit:this.props.submitZip},
                React.createElement("input", {type: "text",
                  className:"location",
                  ref: "newLocation",
                  placeholder: "Location...",
                  onChange: this.props.update}
                ),
            React.createElement("span", {style: {textAlign: "left", marginLeft: 14}},
                React.createElement("input", {type: "button", value: "Submit", onClick: this.addTab})
            )),
            React.createElement(Panel, {ref: "myPanel", theme: "flexbox"},
                self.itemsShown.map(function (item) {
                  return (
                      React.createElement(MyItemTab, {title: item.name, icon: "fa fa-umbrella", item: item, showToolbar: self.state.toolbars,
                        onButtonClick:self.removeTab, onClose: self.removeTab, key: item.id})
                  );
                })
            )
        )
    );
  }
});
/*Content section*/
var section = React.createClass({
    getInitialState: function() {
        return {weatherLoading: true, zip: '22102'};
    },

    getWeather: function() {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q="+this.props.location+"&appid=44db6a862fba0b067b1930da0d769e98&units=metric",
            dataType: 'json',
            success: function(data) {
                this.setState({
                        title: data.name,
                        temperature: Math.round(data.main.temp),
                        wind: data.wind.speed+" mph",
                        humidity: data.main.humidity+" %",
                        pressure: Math.round(data.main.pressure)+" hpa",
                        image: data.weather[0].icon,
                        country: data.sys.country
                    }
                );
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.getWeather();
    },

    render: function() {

        return (
            React.createElement("div", {className:"section"},
                React.createElement("h1", null, this.state.title,",  " ,this.state.country),
                React.createElement("div", null, React.createElement("img", {src:'http://openweathermap.org/img/w/'+this.state.image+'.png', className:"clouds"}),
                React.createElement("span", {className:"temperature"}, this.state.temperature,
                        React.createElement("span", {className:"degree-symbol"},"°" ),"C")),
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement("i", {className:"fa fa-leaf fa-lg"}),
                        React.createElement("span", null, this.state.wind)),
                    React.createElement("li", null,
                        React.createElement("i", {className:"fa fa-tint fa-lg"}),
                        React.createElement("span", null, this.state.humidity)),
                    React.createElement("li", null,
                        React.createElement("i", {className:"fa fa-bars fa-lg"}),
                        React.createElement("span", null, this.state.pressure))
                )
            )
        )
    }
});

var App = React.render(
  React.createElement("div", null, 
    React.createElement(MyFloatingPanel, null)
  ),
  document.getElementById('root')
);
