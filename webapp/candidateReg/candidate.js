angular
  .module('samarth.candidateReg', [])
  .config(candidateRegConfig);

  function candidateRegConfig($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('index.candidateReg', {
      url:'candidateregistration',
      views: {
        'content@': {
          templateUrl: 'candidateReg/template/candidateRegistration.html',
          controller:'candidateRegCtrl',
          controllerAs : 'vm'
        }
      }
    })
  }