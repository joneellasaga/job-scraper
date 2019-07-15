
<!-- manually added 3rd party libraries -->
//_.mixin(s.exports());
function sendMessage(sel){
	//set data link value
	var provider = sel.value;
	var selected = sel.options[sel.selectedIndex];
	var link = selected.getAttribute('data-link');
	
	document.getElementById('link').setAttribute('href', link);
	document.getElementById('reload').setAttribute('data-provider', provider);	
	
	/*top.window.postMessage({data: {providers: sel.value}}, "*");
	return false;*/
	top.window.postMessage(provider, window.location.origin);
	return false;	
}
function reloadButton(data){
	var provider = data.getAttribute('data-provider');
	top.window.postMessage(provider, window.location.origin);
	return false;
}
//appJobScrapper.controller('dataController', function($scope, $http, $filter){
	//var id = jQuery('.js-button').attr('data-job-id');
	//console.log(window.location.origin);
	//console.log(jQuery('title').text());
	/*angular.element('.js-button').click(function(e) {
		var id = angular.element(this).attr('data-job-id');
		console.log(id);
		$scrope.$apply(function(){
			$scope.company = 'Test';
		});
    });*/
//});
function openNewWindowPath(href, path, provider){
	
	href = href.getAttribute('href');
	var origin = window.location.origin+'/'+path+'/';
	window.open(origin+href+provider, '_new');
	event.preventDefault();
	event.stopPropagation();
	return false;
}
function openNewWindow(href, provider){
	
	href = href.getAttribute('href');
	var origin = window.location.origin;
	window.open(origin+href+provider, '_new');
	event.preventDefault();
	event.stopPropagation();
	return false;
}
function hello(){
		console.log("Hello");
	}

