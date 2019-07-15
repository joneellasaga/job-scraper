$(document).ready(function() {
	 	
	var provider = getParameterByName('provider');
	$('#reload').attr('data-provider', provider);
	
	var host = window.location.host;
	if(provider){
		generateProvider(provider);				
	}
	else if(host === "www.seek.com.au"){
		var pathname = window.location.pathname;
		var jobs = pathname.split("/");	
		if(jobs[1] === "jobs"){			
			var provider = "isSeekList";
			generateProvider(provider);
			$('#providers select').val(provider);
		}				
	}
	//console.log(p);
	//
	function generateProvider(provider){
		$('#providers').val(provider);
		//console.log(provider);
		
		//set data link value
		var link = $('#providers option[value='+provider+']').attr('data-link');
					
		$('#link').attr('href', link);
		
		top.window.postMessage(provider, window.location.origin);
		return false;	
	}
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
});