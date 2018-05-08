if (typeof emailthisanywhere == "undefined") {

 var emailthisanywhere = {
  getSelectedText: function(){
    var textWindow = document.commandDispatcher.focusedWindow;
    var text = textWindow.getSelection();
    if (text == null) {
      text =' ';
    }
    text = text.toString();
    text = text.replace(/^\s*$/ , "");
    text = text.replace(/\r/g, "\r");
    text = text.replace(/\n/g, "\n");
    text = text.replace(/^\s+|\s+$/g , " ");
    text = text.replace(new RegExp(/\u2019/g), "'");
    text = text.replace(new RegExp(/\u201A/g), ",");
    text = text.replace(new RegExp(/\u201B/g), "'");
    return {str:text};
  },

  GmailFunc: function(){
    var summary ='';
    var selectedObj = this.getSelectedText();
    if (selectedObj.str) {
      summary = selectedObj.str;
    }
    var createtab = gBrowser.loadOneTab('https://mail.google.com/mail/?view=cm&tf=1&to=&su='+encodeURIComponent(content.document.title)+'&body='+encodeURIComponent(content.location.href)+ '%0D%0A' + '%0D%0A' +encodeURIComponent(summary)+'');
    gBrowser.selectedTab = createtab;
  },

  GoogleAppsFunc: function(){
    var domainName = Services.prefs.getCharPref("extensions.email-this-anywhere.google_apps");
    var summary ='';
    var selectedObj = this.getSelectedText();
    if (selectedObj.str) {
      summary = selectedObj.str;
    }
    var createtab = gBrowser.loadOneTab('https://mail.google.com/a/' + domainName + '/?view=cm&tf=1&to=&su='+encodeURIComponent(content.document.title)+'&body='+encodeURIComponent(content.location.href)+ '%0D%0A' + '%0D%0A' +encodeURIComponent(summary)+'');
    gBrowser.selectedTab = createtab;
  },

  YahooFunc: function(){
    var options = Services.prefs.getCharPref("extensions.email-this-anywhere.yahoo_options");
    var summary ='';
    var selectedObj = this.getSelectedText();
    if (selectedObj.str) {
      summary = selectedObj.str;
    }
    var createtab2 = gBrowser.loadOneTab('http://' +options+ 'compose?&To=&Subj='+encodeURIComponent(content.document.title)+'&Content='+encodeURIComponent(content.location.href)+ ' --- ' +encodeURIComponent(summary)+'');
    gBrowser.selectedTab = createtab2;
  },

  MailToFunc: function () {
    var selectedObj = this.getSelectedText(838860800);
    var tx = "";
    if (selectedObj.str) {
       tx = selectedObj.str;
    }
    var doc = window.content.document;
    var title = doc.title;
    var body = doc.URL + "\n"+ tx;
    var hasIntegratedMailClient = ("@mozilla.org/messengercompose/composeparams;1" in Components.classes);
    if (hasIntegratedMailClient) {
      var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"]
        .createInstance(Components.interfaces.nsIMsgComposeParams);
      params.composeFields = Components.classes['@mozilla.org/messengercompose/composefields;1']
        .createInstance(Components.interfaces.nsIMsgCompFields);
      params.composeFields.subject = title;
      if (tx) {
        params.composeFields.body = body;
      } else {
        params.composeFields.body = doc.URL;
        params.bodyIsLink = true;
        var attachmentData = Components.classes["@mozilla.org/messengercompose/attachment;1"]
          .createInstance(Components.interfaces.nsIMsgAttachment);
        attachmentData.url = doc.URL;
        attachmentData.urlCharset = doc.characterSet;
        params.composeFields.addAttachment(attachmentData);
      }
      var composeService = Components.classes["@mozilla.org/messengercompose;1"]
        .getService(Components.interfaces.nsIMsgComposeService);
      try {
        params.identity = composeService.defaultIdentity;
      }
      catch (ex) {
        params.identity = null;
      }
      composeService.OpenComposeWindowWithParams(null, params);
    } else {
      var extProtocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
        .getService(Components.interfaces.nsIExternalProtocolService);
      var ioService = Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
      var body = encodeURIComponent(doc.URL)+ '%0D%0A' + '%0D%0A' + encodeURIComponent(tx) + '';
      var mailto = "mailto:?subject="+encodeURIComponent(title)+"&body="+body;
      var uri = ioService.newURI(mailto, null, null);
      extProtocolSvc.loadUrl(uri);
    }
  }
 }

};