angular.module('blumeDeploymentApp', [])

.controller('DeploymentController', ['$scope', '$http', 
	function($scope, $http){

		//Declare Deployment Controller scope variables
		$scope.getResources = getResources;
		$scope.deployWebsite = deployWebsite;
		$scope.test = "";

		//Initialize Deployment Controller
		function getResources(){
			$http.get('/test').then(function(res){
				$scope.test = res.data;
			})
		}

		function deployWebsite(){

			$http.post('/deploy', $scope.formData).then(function(response){
				$scope.testPass = response.data;
			})
		}

		function buildWebsite(baseTemplate){
			//Configure required variables
			var old = JSON.stringify(baseTemplate).replace(/siteName/g, $scope.formData.siteName); //convert to JSON string
			return JSON.parse(old); //convert back to array
		}


	}])