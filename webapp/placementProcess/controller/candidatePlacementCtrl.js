(function(){
 'use strict'
 angular.module('samarth.placementProcess')
 	.controller('candidatePlacementCtrl', ['$scope',
   '$stateParams',
   'Pagination',
   'candiPlacement',
   'circlesGetService',
   'applyFactory',
   '$mdDialog',
   'statusFactory',
   function($scope, $stateParams, Pagination,candiPlacement,circlesGetService,applyFactory,$mdDialog,statusFactory) {
    $scope.prof=$stateParams.profession;
    candiPlacement.parsetext($stateParams.profession).then(function(results) {
      $scope.results = results;
      $scope.pagination = Pagination.getNew(4);
      $scope.pagination.numPages = Math.ceil(results.length / $scope.pagination.perPage);
      console.log(results);
      for(i=0;i<results.length;i++)
      {
        statusFactory.status(results[i].candidateid,$stateParams.jobcode)
        .then(function successCallbackfun(response){
          console.log(response.data[0].candidateid);
          results.forEach(function(candidate)
          {
            if(candidate.candidateid==response.data[0].candidateid)
            {
              console.log("candidateid:"+candidate.candidateid)
              if(response.data[0].status=="applied")
              {
                candidate.applyStatus=true
              }
              else{
                candidate.applyStatus=false
              }
              console.log("applied status:"+candidate.applyStatus)
            }
          })
        },function errorCallbackfun(error){
          console.log(error);
        },
        function(err)
        {
          $scope.message = err;
        })

      }


    }, function err(err) {
      $scope.message = err;
    });

    var i=0;
    $scope.check=function()
    {
      alert(i++);
    }
    $scope.apply=function(cid)
    {
      applyFactory.applyJob(cid,$stateParams.jobcode)
      .then(function successCallbackfun(response){
        console.log(response);
      },function errorCallbackfun(error){
        console.log(error);
      },
      function(err)
      {
        $scope.message = err;
      })
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title("Message")
        .textContent(cid+"Sugested to the job:"+$stateParams.jobcode)
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        );
    }

  }
  ])
})()