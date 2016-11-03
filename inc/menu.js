
//Menüstruktur 
var menu = [
  {title:"Home", lnk:"index.html"},
  {title:"Club", lnk:"club/index.html", submenu: [
    {title:"Treffpunkt", lnk:"club/lageplan.html"},
    {title:"Vorstand", lnk:"club/vorstand.html"},
    {title:"Impressum", lnk:"club/impressum.html"}
  ]},
  {title:"Termine", lnk:"termine/index.html"},
  {title:"Fotos", lnk:"foto/index.html"}
  //,{title:"Intern", lnk:"intern/index.html"}  
];

var MENUWIDTH = 175;
var MENUHEIGHT = 25;


// ------------- Hier drunter nichts ändern -----------------

window.onload = posFooter;    

var PATHNAME = "";

//Menü Zentrieren
function centerMenu(initial) {
  var w;
  
  if (!document.getElementById("menubar")) return;
  if (document.documentElement.clientWidth) w = document.documentElement.clientWidth;
  else w = window.innerWidth;
  
  var head = document.getElementById("head");
  var bar = document.getElementById("menubar");
  var crumb = document.getElementById("crumb");
  
  if (w < 704 || typeof(fixedhead) != "undefined") head.style.position = "absolute";
  else head.style.position = "fixed";
  
  if (w >= 706) { 
    var leftpix = (w - menu.length*(MENUWIDTH+1) - 61)/2;
    
    bar.style.left = leftpix + "px";
    if (crumb) crumb.style.left = (leftpix + 30) + "px";
  } else {
    bar.style.left = "0px";
    if (crumb) crumb.style.left = "0px";
  }

  var logo = document.getElementById("logo");
  //logo.style.left = ((w - logo.width) / 2) + "px";
    
  var sel = document.getElementById("yearsel");
  if (sel) sel.style.left = (w/2 + 286) + "px";

  var wp = w<806?w:(w+806)/2;
  document.getElementById("print").style.left = (wp - 40) + "px";
   
  if (!initial) posFooter();
}

//Menüobjekt
function Menu() {
  this.data = menu;
  
  this.show = function () {
    
    var menuNode = document.createElement("div");
    menuNode.className = "head";
    menuNode.id = "head";
    
    var logoDiv = document.createElement("div");
    logoDiv.id = "logodiv";
    var logoNode = document.createElement("img");
    logoNode.src = PATHNAME + "inc/logo2.png";
    logoNode.onclick = function() { window.location.href = PATHNAME + "index.html"; }
    logoNode.id = "logo";
    logoDiv.appendChild(logoNode);
    menuNode.appendChild(logoDiv);
   
    var barNode = document.createElement("div");
    barNode.className = "bar";
    barNode.id = "menubar";
    
    menuNode.appendChild(barNode);

    barNode.appendChild(this.createBorder("left"));
    barNode.appendChild(this.createBorder("right"));
    
    for (var i=0; i<this.data.length; i++) {
       var menuItem = this.createMenu(this.data[i]);
       if (menuItem == -1) continue; 
   
       menuItem.style.left = i*(MENUWIDTH+1) + 30 + "px";
       menuItem.onmouseover = function() { if (this.lastChild.id) this.lastChild.style.display = 'block'; };
       menuItem.onmouseout = function() { if (this.lastChild.id) this.lastChild.style.display = 'none'; };
//       menuItem.onclick = function() { if (this.lastChild.id) this.lastChild.style.display = 'none'; };
       
       if (this.data[i].submenu != undefined) {
         
         var subItem = this.createSubmenu(this.data[i].submenu);
         subItem.id = "sm"+i;
         menuItem.appendChild(subItem);
       }      
       barNode.appendChild(menuItem);
    }

   
    var printItem = this.createPrintbtn();
    menuNode.appendChild(printItem);

    var ftrNode = this.createFooter();
   
    var crumb = this.createBreadcrumb();

    var bdy = document.getElementsByTagName("body")[0];
    bdy.appendChild(menuNode);
    bdy.appendChild(ftrNode);
    if (crumb) bdy.appendChild(crumb);
    
    var logohook = document.createElement("div");
    logohook.id = "hook";
    bdy.appendChild(logohook);
    
    //posFooter();
    var im1 = new Image();
    im1.src = PATHNAME + "inc/logo2.png";
    
    var sel = document.getElementById("yearsel");
    if (sel) this.createYearSel(sel);
    
    if (!window.onresize) window.onresize = centerMenu;

  };
  

  //Menübegrenzung erzeugen
  this.createBorder = function(align) {
    var menuNode = document.createElement("img");
    if (align == "left") {
      menuNode.src = PATHNAME + "inc/left.png";
      menuNode.className = "left";
    } else if (align == "right") {
      menuNode.src = PATHNAME + "inc/right.png";
      menuNode.className = "right";
      menuNode.style.left = (this.data.length*(MENUWIDTH+1) + 1) + "px";
    }
    menuNode.style.top = "0px"; 
    return menuNode;
  }
  
  //Menüentrag erzeugen
  this.createMenu = function(item) {
    if (item.title == undefined || item.lnk == undefined) return -1;

    var menuNode = document.createElement("div");
    menuNode.className = "menu";

    if (item.lnk != undefined) {
      var menuLnk = document.createElement("a");
      menuLnk.setAttribute("href", PATHNAME + item.lnk);
      var path = this.getCurrentPath();
      if ((!path && item.lnk == "index.html") || (path && item.lnk.indexOf(path) == 0)) {
        menuLnk.style.fontStyle = "italic";
        menuLnk.style.lineHeight = "1.48";
      }
      var menuTxt = document.createTextNode(item.title)
      menuLnk.appendChild(menuTxt);
      menuNode.appendChild(menuLnk); 
    }
       
    return(menuNode);
  }

    
  //Untermenü-popup erzuegen
  this.createSubmenu = function(item) {

    var menuNode = document.createElement("div");
    menuNode.className = "submenu";
    menuNode.style.height = ((MENUHEIGHT-1)*item.length) + "px";
    
    for (var i=0; i<item.length; i++) {
      if (item[i].title == undefined || item[i].lnk == undefined) continue;
      var menuLnk = document.createElement("a");
      menuLnk.setAttribute("href", PATHNAME + item[i].lnk);
      
      var menuTxt = document.createTextNode(item[i].title)
      menuLnk.appendChild(menuTxt);
      menuNode.appendChild(menuLnk); 
    }
   
    return menuNode;
  };


  //Druck-Schaltfläche erzeugen
  this.createPrintbtn = function() {
     lnkPrint = document.createElement("a");
     lnkPrint.href = "javascript:printme();"

     btnPrint = document.createElement("img");
     btnPrint.src = PATHNAME + "inc/print.png";
     btnPrint.title = "Seite ausdrucken";
     btnPrint.style.position ="absolute";
     btnPrint.style.left = (this.getScreenWidth() - 40) + "px";
     btnPrint.className = "print";
     btnPrint.id = "print";
     
     lnkPrint.appendChild(btnPrint);
     
     return lnkPrint;
  }

  
  //Seitenfuss erzeugen
  this.createFooter = function(align) {
    var ftrNode = document.createElement("div");
    ftrNode.className = "footer";
    ftrNode.id = "foot";
    ftrNode.style.fontSize = "9pt"; 
    ftrNode.style.textAlign = "center";
    ftrNode.style.color = "#666";
    
    var dtNow = new Date();
    var dtMod = new Date(document.lastModified);

    var ftr = document.createElement("div");
    var ftrImg = document.createElement("img");
    ftrImg.src = PATHNAME + "inc/foot.png";
    ftrImg.className = "plain";
    ftr.appendChild(ftrImg); 

    var ftrLnk1 = document.createElement("a");
    ftrLnk1.setAttribute("href", PATHNAME + "sitemap.html");
    ftrLnk1.innerHTML = "Sitemap";

    var ftrLnk2 = document.createElement("a");
    ftrLnk2.setAttribute("href", PATHNAME + "club/impressum.html");
    ftrLnk2.innerHTML = "Impressum";
    
    var ftrLnk3 = document.createElement("a");
    ftrLnk3.setAttribute("href", PATHNAME + "club/lageplan.html");
    ftrLnk3.innerHTML = "Lageplan";

    var ftrTxt1 = document.createTextNode("\u00a9 SkipperTreff Torrevieja " + dtNow.getFullYear() + " \u2014 ");
    var ftrTxt2 = document.createTextNode(" \u2014 ");
    var ftrTxt3 = document.createTextNode(" \u2014 " + "Letzte \u00c4nderung: " + dtMod.toLocaleDateString());
    var ftrTxt4 = document.createTextNode(" \u2014 ");

    ftrNode.appendChild(ftr); 
    ftrNode.appendChild(ftrTxt1); 
    ftrNode.appendChild(ftrLnk1); 
    ftrNode.appendChild(ftrTxt2); 
    ftrNode.appendChild(ftrLnk2); 
    ftrNode.appendChild(ftrTxt4); 
    ftrNode.appendChild(ftrLnk3); 
    ftrNode.appendChild(ftrTxt3); 
    return ftrNode;
  }


  //Breadcrumb-pfad ermitteln und formatieren
  this.createBreadcrumb = function() {
    var crumb = [];
    var url = window.location.pathname;
    //if (url.indexOf("/") == 0)
    url = url.replace(/(.*htdocs)?\//, "");

    var folder = url.split("/");
    if (!folder[0] || folder[0] == "index.html") return this.formatCrumb(crumb);
    
    crumb = [{lnk:"index.html", title:"SkipperTreff Homepage"}];
    
    var ptrn = new RegExp(folder[0]);
    for (var i=0; i<menu.length; i++) {
      if (menu[i].lnk.search(ptrn) != -1) {
        crumb[1] = menu[i];
        break;   
      }
    }    
    if (!crumb[1]) return;
     
    if (!folder[1]) return this.formatCrumb(crumb);

    if (folder[1] == "index.html" || folder[1] == "intern.html") {
      crumb[2] = {title:"\u00dcbersicht"};
    //} else if (!menu[i].submenu) {  //intern
    //  crumb[2] = this.getIntern(folder[1]);
    } else {
      crumb[2] = this.getTitle(folder[1]);

/*      var ptrn = new RegExp(folder[1]);    
    
      for (var j=0; j<menu[i].submenu.length; j++) {
        if (menu[i].submenu[j].lnk.search(ptrn) != -1) {
          if (menu[i].submenu[j].lnk.search("kalender") != -1)
            crumb[2] = {title:"Kalender/Wettbewerb", lnk:"foto/fotowet/fotowet.html"};
          else if (menu[i].submenu[j].lnk.search("was_wann_wer") != -1)
            crumb[2] = {title:"Was Wann Wer", lnk:"termine/was_wann_wer/was_wann_wer.html"};
          else
            crumb[2] = menu[i].submenu[j];
          break;   
        }
      }*/    
    }
    
    if (!folder[2]) return this.formatCrumb(crumb);

/*    if ((folder[1] == "was_wann_wer" || folder[1] == "fotowet" || folder[1] == "feste") && (folder[2].search(folder[1]) == -1 || folder[2].search("feste_") != -1))
      crumb[3] = this.getJahr(folder[2]);

    if (folder[1] == "infos" || folder[1] == "humor")
    crumb[3] = this.getTitle(folder[2]);*/
      
      
    return this.formatCrumb(crumb);
    
  }
  
  //Breadcrumb formatieren  
  this.formatCrumb = function(crumb) {
    var nodeCrumb = document.createElement("div");
    nodeCrumb.className = "crumb";
    nodeCrumb.id = "crumb";
    //if (document.getElementById("head").style.display != "none")
    nodeCrumb.style.left = (this.getScreenWidth() - this.data.length*(MENUWIDTH+1))/2 + "px";

    for (var i=0; i<crumb.length; i++) {
      if (!crumb[i].lnk || i==crumb.length-1) {
         var txtCrumb = document.createTextNode(crumb[i].title);
         nodeCrumb.appendChild(txtCrumb);
      } else {
        var lnkCrumb = document.createElement("a");
        lnkCrumb.href = PATHNAME + crumb[i].lnk;
        lnkCrumb.innerHTML = crumb[i].title;
        nodeCrumb.appendChild(lnkCrumb);
        if (i < crumb.length-1) {
          var txtSpcr = document.createTextNode(" \u00bb ");
          nodeCrumb.appendChild(txtSpcr);
        }
      }
    }

    return nodeCrumb;
  }  
  
  //Breadcrumb Hilfsfunktion
  this.getIntern = function(fldr) {
    switch (fldr) {
      case "wettbewerb_bedingungen.html": return {title:"Fotowettbewerb"};
      case "vs_beschreibungen": return {title:"Vorstand"};
      case "skype.html": return {title:"CCI Skype"};
      default: return {title:"Interne Information"};
    }
  };


  //Breadcrumb Hilfsfunktionen
  this.getJahr = function(fldr) {
    var yr = fldr.replace(/\D|\./g, "");
    return {title:yr};
  }  

  this.getTitle = function(str) {
    if (!str) return;
    var ttl = str.replace(/\.html$/, "");
    ttl = ttl.substring(0,1).toUpperCase() + ttl.substring(1);
    return {title:ttl};
  }
 
  //Jahresauswahlliste
  this.createYearSel = function(sel) {
    var dt = new Date();
    var selLnk = [];
    var startYr = 2001;
    var endYr = dt.getFullYear();
    var step = 20;
    
    var doc = this.getDoc();
    doc = doc.replace(/\D*/g, "");

    var selNode = document.createElement("div");
    selNode.className = "sellst";
    selNode.id = "sellist";
    selNode.style.height = ((endYr-startYr+2)*step) + "px";
    selNode.style.display = "none";
    
    for (var i=endYr; i>=startYr; i--) {
      if (i == doc) {
        selLnk[i-startYr] = document.createElement("div");
        selLnk[i-startYr].className = "grey";
      } else {
        selLnk[i-startYr] = document.createElement("a");
        selLnk[i-startYr].href = i.toString() + "_vor.html";
        selLnk[i-startYr].className = getColor(i);
      }
      //selLnk[i-startYr].style.top = (i-startYr)*step + "px";
      selLnk[i-startYr].innerHTML = i.toString();
      selNode.appendChild(selLnk[i-startYr]);
    }
    
    sel.appendChild(selNode);
    sel.onmouseover = function() { if (this.lastChild.id) this.lastChild.style.display = 'block'; };
    sel.onmouseout = function() { if (this.lastChild.id) this.lastChild.style.display = 'none'; };
    //sel.onclick = function() { if (this.lastChild.id) this.lastChild.style.display = 'none'; };    
  }
  
  
  function getColor(yr) {
    var cols= {"2001": "purple"}
    if (cols[yr]) return cols[yr];
    return "blue";
  }
  
  
  //Stilzuweisungen
  this.setStyle = function(item, stl) {
    var ss = document.styleSheets[0];
    var rules = ss.cssRules?ss.cssRules:ss.rules;
    
    for(var i=rules.length-1; i>=0; i--) {
      if (rules[i].selectorText == stl) {
        for (var j=0; j<rules[i].style.length; j++) {
          var attr = rules[i].style[j];
          if (rules[i].style.getPropertyValue)
            item.style[attr] = rules[i].style.getPropertyValue(attr);  
          else
            item.style[attr] = rules[i].style.getAttribute(attr); 
        }
        break;
      }
    }
  }
  
 
  this.addEvent = function (obj, evType, fn){ 
    if (obj.addEventListener){ 
      obj.addEventListener(evType, fn, false); 
      return true; 
    } else if (obj.attachEvent) { 
      var r = obj.attachEvent("on"+evType, fn); 
      return r; 
    } else { 
      return false; 
    } 
  }


  this.getCurrentPath = function() {
    var path = "";
    var url = window.location.pathname;
    if (url.indexOf("/") == 0)
      url = url.replace(/.*htdocs/, "");

    var folder = url.split("/");
    if (folder[1]) return folder[1];
    else return folder[0];
  }

  
  this.getDoc = function() {
    var path = "";
    var url = window.location.pathname;

    var folder = url.split("/");
    return folder[folder.length-1];
  }

  
  this.getPath = function() {
    var path = "";
    var url = window.location.pathname;
    if (url.indexOf("/") == 0)
      url = url.replace(/.*htdocs/, "");

    var depth = url.match(/\//g);
    for (var i=0; i<depth.length-1; i++)
      path += "../";
    PATHNAME = path;
  }
 
  this.getScreenWidth = function() {
    if (document.documentElement.clientWidth)
      return document.documentElement.clientWidth;
    else
      return window.innerWidth;
  }

  if (top != self) top.location = self.location;
  
  this.getPath();
  this.show();
  centerMenu(true);
};


function printme() {
  window.print();
}

function get(id) {
	return document.getElementById(id);
}

function posFooter() {
  var elemTop = null;
  var ftrNode = document.getElementById("foot")
  var h = window.innerHeight || document.body.clientHeight;
  try {
    elemTop = parseInt(window.getComputedStyle(ftrNode, null).top);
  } catch(e) {};
  if (!elemTop) elemTop = ftrNode.offsetTop;
  if (h > elemTop + 70) {
    ftrNode.style.top = (window.innerHeight - 70).toString() + "px";
    ftrNode.style.position = "fixed";
  }
}

function isDefined() { }


function getCookie(s) {
  var res, val;
  
  if(!document.cookie || !s) return;
  val = new RegExp(s + "=([^;]+)");
  res = document.cookie.match(val);
  if (res != null) return res[1];
}

function checkCookie(s) {
  if(document.cookie && document.cookie.search(s) != -1) return true;
  return false;
}


function setCookie(s) {
  var expire = new Date();
  expire.setTime(expire.getTime() + (365 * 86400000));
  document.cookie = s + "; expires=" + expire.toGMTString();
}

function hasFlash() {
  var fo, yes = false;
  try {
    fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    if (fo) {
      yes = true;
    }
  } catch (e) {
    if (navigator.mimeTypes
          && navigator.mimeTypes['application/x-shockwave-flash'] != undefined//) {
          && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
      yes = true;
    }
  }
  return yes;
}


//var m = new Menu();
//m.show();
