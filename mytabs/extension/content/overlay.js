function getWindows(type) {
  if (type == undefined) {
      var type = "";
  }
  var windows = []
  var enumerator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator)
                     .getEnumerator(type);
  while(enumerator.hasMoreElements()) {
    windows.push(enumerator.getNext());
  }
  return windows;
};

function getWindowByTitle(title) {
  for each(w in getWindows()) {
    if (w.document.title && w.document.title == title) {
      return w;
    }
  }
};

var mytabs = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
  },
  go: function() {
    var mt = getWindowByTitle('MyTabs');
    if (mt){
      mt.focus();
    }
    else {
      var w = window.open("chrome://mytabs/content/mytabs.html", "", "chrome,centerscreen,height=300,width=500"); 
    }
  }
};

window.addEventListener("load", function(e) { mytabs.onLoad(e); }, false);

var boom = 'yayer';