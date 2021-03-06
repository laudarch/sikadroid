/* $Id: xhr.js,v 1.0 2011/05/31 17:22:00 aedavies Exp $ */

var a$ = {	
    xhr:function( url, options) {
        var o = options ? options : {};
        
        if (typeof options == "function") {
            o = {};
            o.callback = options;
        }
        
        var xhr     = this.getxhr();
        var method  = o.method  || 'get';
	    var restype = o.restype || 'text';
        var async   = o.async   || false;           
        var params  = o.data    || null;
        var i       = 0;
		var ret;
		
		if (!xhr) return(false);
		xhr.open(method, url, async);

        if (o.headers) {
            for (; i<o.headers.length; i++) {
              xhr.setRequestHeader(o.headers[i].name, o.headers[i].value);
            }
        }

		if ((/POST/i).test(method)) {
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("Content-length", params.length);
			xhr.setRequestHeader("Accept", "*/*");
			xhr.setRequestHeader("Connection", "close");
	    }

		if (method == 'post') {
			xhr.send(params);
		} else {
			xhr.send(null);
		}

        handleResp  = (o.callback != null) ?
		               o.callback          :
			          function(rt) {alert("Resp: "+rt);};
        handleError = (o.error && typeof o.error == 'function') ?
		               o.error                          :
			           function(e) {
			           if (!dbg) {
			           		alert("Error: "+e);
			           } else {
			           		e$("dbg").innerHTML = "<pre>"+e+"</pre>";
			           }
			           };
        function hdl() {
            if (xhr.readyState==4) {
                delete(xhr);
                if (xhr.status===0 || xhr.status==200) {
		        if (/text/i.test(restype)) ret = xhr.responseText;
			if (/xml/i.test(restype))  ret = xhr.responseXML;
			if (/json/i.test(restype)) ret = xhr.responseText; // XXX: unserialize
			handleResp(ret);
		}
                if((/^[4(5|0)]/).test(xhr.status)) handleError(xhr.responseText+" "+xhr.status);
            }
        }

        if (async) {
            xhr.onreadystatechange = hdl;
        }
        if (!async) hdl();

        return (this);
    },
    getxhr:function() {
		   var req = false;
		   try {
			   req = new XMLHttpRequest();
		   } catch (e1) {
			   try {
				   req = new ActiveObject("Msxml2.XMLHTTP");
			   } catch (e2) {
				   try {
					   req = new ActiveObject("Microsoft.XMLHTTP");
				   } catch (e3) {
					   return (false);
				   }
			   }
		   }
		   return (req);
	}
};
function e$(id) { return (document.getElementById(id)); }