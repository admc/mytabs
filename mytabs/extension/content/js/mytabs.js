// ***** BEGIN LICENSE BLOCK *****// ***** BEGIN LICENSE BLOCK *****
// Version: MPL 1.1/GPL 2.0/LGPL 2.1
// 
// The contents of this file are subject to the Mozilla Public License Version
// 1.1 (the "License"); you may not use this file except in compliance with
// the License. You may obtain a copy of the License at
// http://www.mozilla.org/MPL/
// 
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
// for the specific language governing rights and limitations under the
// License.
// 
// 
// The Initial Developer of the Original Code is
// Adam Christian.
// Portions created by the Initial Developer are Copyright (C) 2008
// the Initial Developer. All Rights Reserved.
// 
// Contributor(s):
//  Adam Christian <adam.christian@gmail.com>
// 
// Alternatively, the contents of this file may be used under the terms of
// either the GNU General Public License Version 2 or later (the "GPL"), or
// the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
// in which case the provisions of the GPL or the LGPL are applicable instead
// of those above. If you wish to allow use of your version of this file only
// under the terms of either the GPL or the LGPL, and not to allow others to
// use your version of this file under the terms of the MPL, indicate your
// decision by deleting the provisions above and replace them with the notice
// and other provisions required by the GPL or the LGPL. If you do not delete
// the provisions above, a recipient may use your version of this file under
// the terms of any one of the MPL, the GPL or the LGPL.
// 
// ***** END LICENSE BLOCK *****

var controller = {}; Components.utils.import('resource://mytabs/modules/controller.js', controller);
var elementslib = {}; Components.utils.import('resource://mytabs/modules/elementslib.js', elementslib);
// 
//Components.utils.import("resource://gre/modules/JSON.jsm");
var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                          .getService(Components.interfaces.nsIPrefBranch);
                          
var mytabs = new function(){
  this.entries = {};
  this.entriesArr = [];
  this.openTabs = [];
  
  this.init = function(){
    mytabs.initialized = true;
        
    //if there is a state to restore
    if (mytabs.getState()){
      for (var i=0;i<mytabs.entriesArr.length;i++){
        mytabs.addURL(mytabs.entries[mytabs.entriesArr[i]]);
        
        if ($("#allauto")[0].checked){
          window.open('http://wiki.github.com/admc/mytabs');
          //if it's to get run on open
          if (mytabs.entries[mytabs.entriesArr[i]].onopen){
            mytabs.run(mytabs.entriesArr[i]);
          }
        }

      }
    }
  };
  
  this.getState = function(){
    try {
      var eJSON = prefManager.getCharPref("mytabs.entries");
      var eaJSON = prefManager.getCharPref("mytabs.entriesArr");
      var allauto = prefManager.getCharPref("mytabs.allauto");
      mytabs.entries = JSON.fromString(eJSON);
      mytabs.entriesArr = JSON.fromString(eaJSON);
      
      if (allauto == "true"){ $("#allauto")[0].checked = true; }
      else{ $("#allauto")[0].checked = false; }
      
      return true;
    }
    catch(err){
      mytabs.storeState();
      return false;
    }
  };
  
  this.storeState = function(){
    prefManager.setCharPref("mytabs.entries", JSON.toString(mytabs.entries));
    prefManager.setCharPref("mytabs.entriesArr", JSON.toString(mytabs.entriesArr));
    var allauto = $("#allauto")[0].checked;
    prefManager.setCharPref("mytabs.allauto", String(allauto));    
  };
  
  this.run = function(key){
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
               .getService(Components.interfaces.nsIWindowMediator);

    var url = mytabs.entries[key].url;
    var script = mytabs.entries[key].script;     
    var w = wm.getMostRecentWindow('navigator:browser');
    try {
      var wObj = w.window;
      var newTab = w.window.gBrowser.addTab(url);
      var tabWin = w.window.gBrowser.getBrowserForTab(newTab);
      w.window.gBrowser.selectedTab = newTab;
      mytabs.openTabs.push(tabWin);
     
      var runit = function() { 
        var tab = new controller.MozMillController(tabWin.contentDocument.defaultView);
        var doc = tabWin.contentDocument;
        var win = doc.defaultView;
        try {
          eval(script);
        }
        catch(err){
          alert('There was a problem with the provided script! \n\n' + err.lineNumber + '\n' + err.fileName + '\n' + err.message );
        }
        tabWin.removeEventListener("load", runit, true);
      }
     
      tabWin.addEventListener("load", runit, true);
      
    }
    catch(err){
      var w = window.open(url);
    }
  };
  
  this.del = function(key){
    document.getElementById(key).parentNode.removeChild(document.getElementById(key));
    delete mytabs.entries[key];
    var newEntArr = [];
    //get rid of undefined in entriesArr
    for (i=0;i<mytabs.entriesArr.length;i++){
      if (mytabs.entriesArr[i] != key){
        newEntArr.push(mytabs.entriesArr[i]);
      }
    }
    mytabs.entriesArr = newEntArr;
    mytabs.storeState();
  };
  
  this.clear = function(){
    $('#entries').html("");
    mytabs.entries = {};
    mytabs.entriesArr = [];
    mytabs.storeState();
  };
  
  this.closeAll = function(){
    for (var i=0;i<mytabs.openTabs.length;i++){
      try {
        mytabs.openTabs[i].contentDocument.defaultView.close();
      } catch(err){}
    }
    this.openTabs = [];
  };
  
  this.buildAll = function(){
    mytabs.closeAll();
    for (var i=0;i<mytabs.entriesArr.length;i++){
      mytabs.run(mytabs.entriesArr[i]);
    }
  };
  
  this.addToDB = function(entObj){
    mytabs.entries[entObj.name] = entObj;
    mytabs.entriesArr.push(entObj.name);
  };
  
  this.addURL = function(entObj){
    var newDiv = document.createElement('div');
    var tbl = document.createElement('table');
    tbl.style.width = "100%";
    var row = document.createElement('tr');
    var col = document.createElement('td');
    col.style.width="30%";
    col.innerHTML = "<b>"+entObj.name+"</b> ";
    var col1 = document.createElement('td');
    col1.style.textAlign = "left";
    col1.style.width="40%";
    col1.innerHTML = "<a target=_blank href='"+entObj.url+"'>"+entObj.url+"</a>";
    var col2 = document.createElement('td');
    col2.style.textAlign = "center";
    col2.innerHTML = "auto: "+ entObj.onopen;
    col2.style.width="20%";
    var col3 = document.createElement('td');
    col3.style.width="10%";
    col3.style.textAlign = "right";
    col3.name = entObj.name;
    col3.innerHTML = "<a href='#'><u>run</u></a> | <a href='#'><u>del</u></a>";
    col3.onclick = function(e){
      if (e.target.innerHTML == "run"){
        mytabs.run(e.target.parentNode.parentNode.name);
      }
      if (e.target.innerHTML == "del"){
        mytabs.del(e.target.parentNode.parentNode.name);
      }
    };
    
    row.appendChild(col);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);    
      
    tbl.appendChild(row);
    newDiv.appendChild(tbl);
    
    newDiv.style.width = "99%";
    newDiv.style.background = "lightgray";
    newDiv.style.borderBottom = "1px solid #aaa";
    newDiv.style.padding = "2px";
    newDiv.style.overflow = "hidden";
    newDiv.id = entObj.name;
    
    document.getElementById('entries').appendChild(newDiv);
  };
};