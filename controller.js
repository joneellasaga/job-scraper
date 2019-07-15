var appJobScrapper = angular.module('appJobScrapper', [
	'config','ui.router', 'underscore',
    'underscore.string', 'MessageCenterModule', 
])
appJobScrapper.factory('getJobsDataService', function ($http, $rootScope) {

    var getJobsDataService = {
        getCast: function () {
            // $http returns a 'promise'
            return $http.get($rootScope.ENV.apiEndpointMongo+'?fields=job_data_id&fields=active').then(function (response) {
                return response.data.results;
            });
        }
    };

    return getJobsDataService;
})

.run(['$rootScope', 'ENV', 'CONST', '$location', function ($rootScope, ENV, CONST, $location) {
   // console.log(ENV);
//    console.log(ENV.name);

    ENV.localhost_alternative_port = $location.port();
    $rootScope.ENV = ENV;
    $rootScope.CONST = CONST;
}])

;

appJobScrapper.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('/', {
      url: "/",
      templateUrl: "form.html"
    });
});


appJobScrapper.controller('dataController', [
		 '_', '$scope' , '$rootScope', '$state' ,  '$stateParams' ,  '$http' , '$httpBackend',  '$location', 'messageCenterService', 'getJobsDataService',
         function (_, $scope , $rootScope, $state ,  $stateParams ,  $http , $httpBackend,  $location, messageCenterService, getJobsDataService ){
	

	
	function defaultEntity() {
		//return mockEntity();
		return {
			name: '',
			url: '',
			description: '',
			company: '',
			company_id: '',
			job_no: '',
			work_type: '',
			talent_community: '',
			location: '',
			job_data: '',
			job_data_id: ''
		};
	}	

	$scope.model = {
		entity: defaultEntity()
	}
	// Initialization
	/*if (!$scope.model) {
		$scope.model = {
			entity: defaultEntity(),
		};
	}*/	 
	
	$scope.jobLists = [];
	
	$scope.applyChanges = function(){	
		$scope.domUpdates();
		if(!$scope.model.entity.company || !$scope.model.entity.name){
			return false;
		}	
		angular.element('#apply-changes').attr('disabled', true);
		angular.element('#ajax-loader').removeClass('hide');

		//prepare to send data	
		setTimeout(function () {

			angular.element('#save').trigger('click');
			//console.log($scope.jobLists);
			//console.log("Sent");
			$scope.send();				

		}, 1000);	
		
	};

	$scope.domUpdates = function(){
		
		//apply dom updates to angular
		//console.log("dom updates")
		angular.element('#company, #company_id, #title, #url, #description, #job_no, #job_data, #job_data_id, #work_type, #talent_community, #location').trigger('change');
		angular.element('#company, #company_id, #title, #url, #description, #job_no, #job_data, #job_data_id, #work_type, #talent_community, #location').trigger('click');		
	};
	
	$scope.addJobLists = function(company, company_id, name, job_no, work_type, talent_community, location,  url, desc, job_data, job_data_id, key_values){
		if(!company || !name) return false;

		$scope.jobLists.push({
			company: company,
			company_id: company_id,
			name: name,
			job_no: job_no,
			work_type: work_type,
			talent_community: talent_community,
			location: location,
			url: url,
			description: desc,
			job_data: job_data,
			job_data_id: job_data_id,
			active: true,	
			key_values: key_values
		});
			
	};
	
	$scope.send = function () {
		
		//$scope.jobsData = getJobsDataService;
		getJobsDataService.getCast().then(function (asyncCastData) {
			//$scope.jobsData.cast = asyncCastData;
			//console.log($scope.model.entity.job_data);
			
			var getObjResult = getObjects(asyncCastData, 'job_data_id', $scope.model.entity.job_data_id);
			//console.log(getObjResult);
			if(getObjResult.length > 0){
				if(getObjResult[0].active == true){
					//update
					
					console.log(getObjResult[0]._id);
					$http.patch($rootScope.ENV.apiEndpointMongo+'/'+ getObjResult[0]._id,
						{
							entity: $scope.jobLists[0]
						})
						.success(
							function (data, status, headers, config) {
							//console.log(data);
							//console.log(config);				
							 messageCenterService.add('success', $scope.jobLists[0].name+' was updated!', { timeout: 3000 } );					
							 console.log('updated');	
							 		
							//reset 	
							$scope.jobLists = [];
							angular.element('#ajax-loader').addClass('hide');
							angular.element('#apply-changes').attr('disabled', false);	
							
						})
						.error(
							function (data, status, headers, config) {
							//block.stop();
							messageCenterService.add('danger', 'Failed to update!', { timeout: 3000 } );
							angular.element('#ajax-loader').addClass('hide');
							angular.element('#apply-changes').attr('disabled', false);
					});
				}
				else if(getObjResult[0].active == false){
					messageCenterService.add('danger', $scope.model.entity.name+' is deactivated!', { timeout: 3000 } );
					angular.element('#ajax-loader').addClass('hide');
					angular.element('#apply-changes').attr('disabled', false);
					//return;
				}
			}
			else{
				//create
				
				//console.log($scope.jobLists);
				if($scope.jobLists[0]){
					$scope.jobLists[0].location_suburb = '';
					$scope.jobLists[0].location_state = '';
					$scope.jobLists[0].location_postcode = '';
				}
				else{
					angular.element('#ajax-loader').addClass('hide');
					angular.element('#apply-changes').attr('disabled', false);	
					return false;
				}
				
				//console.log($scope.jobLists[0]);
				$http.post($rootScope.ENV.apiEndpointMongo,
					{
						entity: $scope.jobLists[0]
					})
					.success(
						function (data, status, headers, config) {
						//console.log(data);
						//console.log(config);		
						messageCenterService.add('success', $scope.jobLists[0].name+' was added!', { timeout: 3000 } );				
						console.log("Sent!");
						console.log($scope.jobLists[0]);
						//reset 	
						$scope.jobLists = [];
						angular.element('#ajax-loader').addClass('hide');
						angular.element('#apply-changes').attr('disabled', false);
					})
					.error(
						function (data, status, headers, config) {
						//block.stop();
		
						console.log('Error');
						console.log(data);
						console.log(status);
						console.log(headers);
						console.log(config);
						messageCenterService.add('danger', 'Sending failed!', { timeout: 3000 } );
						angular.element('#ajax-loader').addClass('hide');
						angular.element('#apply-changes').attr('disabled', false);
				});
			}
		
			//reset form values
			$scope.model = {
				entity: defaultEntity()
			};
			$scope.customFields = [{key: '', value: ''}];
			
		});
				
	};		
	$scope.clearForm = function(){
		$scope.model = {
			entity: defaultEntity()
		};
		$scope.customFields = [{key: '', value: ''}];
		$scope.jobLists = [];
		angular.element('#company, #company_id, #title, #url, #description, #job_no, #job_data, #job_data_id, #work_type, #talent_community, #location').val('');
	};
	
	$scope.customFields = [{key: '', value: ''}];
	
	$scope.addCustomFields = function () {
		
		$scope.customFields.push({
			key: '',
			value: ''
		});
	};
	$scope.removeCustomFields = function (index) {
		$scope.customFields.splice(index, 1);
	};
	
	$scope.addDescription = function(){
		$scope.model.entity.description = getSelectionText();
	}
	$scope.addUrl = function(){
		$scope.model.entity.url = window.location.origin + window.location.pathname;
	}
	
	function getSelectionText() {
		var text = "";
		if (window.parent.getSelection) {
			text = window.parent.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			text = document.selection.createRange().text;
		}
		return text;
	}
	function getObjects(obj, key, val) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(getObjects(obj[i], key, val));
			} else if (i == key && obj[key] == val) {
				objects.push(obj);
			}
		}
		return objects;
	};
	String.prototype.hashCode = function() {
		var hash = 0, i, chr, len;
		if (this.length == 0) return hash;
		for (i = 0, len = this.length; i < len; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};
	$scope.sendJobLists = function () {
		
		
		//block.start('Updating Job');
		
		//console.log('ID: ' + $scope.model.entity._id);
		//console.log($rootScope.ENV.apiEndpointMongo);
		var jobs = $scope.jobLists.length;
		if(!jobs || jobs === 0) return false;
		
		console.log('Sending Job');
		
		for(var i = 0; i < jobs; i++){
		//console.log($scope.jobLists[i]);

		$http.post($rootScope.ENV.apiEndpointMongo,
			{
					entity: $scope.jobLists[i],
					index: i
				
			})
			.success(
				function (data, status, headers, config) {
					//console.log(data);
					//console.log(config);
					//block.stop();
					var i = 0;
					//remove data entry
					$scope.jobLists.splice(i, 1);
					i++;
					if(config.data.index + 1 == jobs) messageCenterService.add('success', 'Successfully sent!', { timeout: 3000 } );				
					//console.log('i: '+ i + 'jobs: '+ jobs + 'index: ' + config.data.index);
					//$scope.cancel();
					//$scope.loadData();	
					
				})
			.error(
				function (data, status, headers, config) {
					//block.stop();
	
					console.log('Error');
					console.log(data);
					console.log(status);
					console.log(headers);
					console.log(config);
					if(config.data.index + 1 == jobs) messageCenterService.add('danger', 'Sending failed!', { timeout: 3000 } );
		
				});
			
		}
		
	};		
}]);



