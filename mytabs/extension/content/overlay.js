var mytabs = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
  },
  go: function() {
    var w = window.open("chrome://mytabs/content/mytabs.html", "", "chrome,centerscreen,height=300,width=500");
  }
};

window.addEventListener("load", function(e) { mytabs.onLoad(e); }, false);