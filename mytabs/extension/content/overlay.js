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

var MyTabs = {
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
      var w = window.open("chrome://mytabs/content/mytabs.html", "", "chrome,centerscreen,height=300,width=500,resizable"); 
    }
  }
};

window.addEventListener("load", function(e) { MyTabs.onLoad(e); }, false);





var Prefs = Components.classes["@mozilla.org/preferences-service;1"]
                   .getService(Components.interfaces.nsIPrefService);
Prefs = Prefs.getBranch("extensions.my_extension_name.");

var Overlay = {
  init: function(){
    var ver = -1, firstrun = true;

    var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
                            .getService(Components.interfaces.nsIExtensionManager);
    var current = gExtensionManager.getItemForID("mytabs@adamchristian.com").version;
		
    try{
	ver = Prefs.getCharPref("version");
	firstrun = Prefs.getBoolPref("firstrun");
    }catch(e){
      //nothing
    }finally{
      if (firstrun){
        Prefs.setBoolPref("firstrun",false);
        Prefs.setCharPref("version",current);
	
        // Insert code for first run here        

        // The example below loads a page by opening a new tab.
        // Useful for loading a mini tutorial
        window.setTimeout(function(){
          gBrowser.selectedTab = gBrowser.addTab("about:MyTabs");
        }, 1500); //Firefox 2 fix - or else tab will get closed
				
      }		
      
      if (ver!=current && !firstrun){ // !firstrun ensures that this section does not get loaded if its a first run.
        Prefs.setCharPref("version",current);
        
        // Insert code if version is different here => upgrade
      }
    }
    window.removeEventListener("load",function(){ Overlay.init(); },true);
  }
};


window.addEventListener("load",function(){ Overlay.init(); },true);

