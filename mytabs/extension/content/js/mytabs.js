var mytabs = new function(){
  this.entries = {};
  this.entriesArr = [];
  
  this.run = function(node){
    var key = node.parentNode.id;
    //open a new FF window, and open the url in a new tab
    var url = this.entries[key];
  }
  this.addURL = function(name, url){
    mytabs.entries[name] = url;
    mytabs.entriesArr.push(name);
    
    var newDiv = document.createElement('div');
    newDiv.innerHTML = "<span style='position:absolute;width:300px;'><b>"+name+"</b>: <a href='"+url+"'>"+url+"</a></span>"
    newDiv.innerHTML += "<span style='position:absolute;left:80%;' onclick='mytabs.run(this);'>Run</span>";
    newDiv.style.width = "99%";
    newDiv.style.height = "20px";
    newDiv.style.background = "lightgray";
    newDiv.style.borderBottom = "1px solid #aaa";
    newDiv.style.padding = "2px";
    newDiv.style.overflow = "hidden";
    newDiv.id = name;
    
    document.getElementById('entries').appendChild(newDiv);
  }
}
