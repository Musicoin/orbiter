angular.module('BlocksApp').controller('HomeController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
    });

    var URL = '/data';

    $rootScope.isHome = true;
    $scope.current_block_number = 0;
    $scope.averaged_block_time = 0;

    $scope.autorefresh= function() {
      $scope.refresh_timer = 30;

      (function update() {
        $scope.refresh_timer--;
        $timeout(update, 1000);
        if ($scope.refresh_timer==0){
          $scope.reloadBlocks();
          $scope.reloadTransactions();
          $scope.refresh_timer = 30
        }
      }());
    }

    // Fetch the complete info on the latest block for difficulty and other stats
    $scope.getLatestBlockInfo = function(blockNum) {
        $http({
          method: 'POST',
          url: '/web3relay',
          data: {"block": blockNum}
        }).success(function(data) {
          if (data.error)
            $location.path("/err404/block/" + blockNum);
          else {
                $scope.getSecondToLastBlockInfo(blockNum -1);                
                $scope.last_block = data;
          }
        });
    }

    // This is ugly, and violates the DRY principle, but it works for now until we can refactor it
    $scope.getSecondToLastBlockInfo = function(blockNum) {
        $http({
          method: 'POST',
          url: '/web3relay',
          data: {"block": blockNum}
        }).success(function(data) {
          if (data.error)
            $scope.second_to_last_block = $scope.last_block;
          else
            $scope.second_to_last_block = data;
        });
    }


    $scope.reloadBlocks = function() {
      $scope.blockLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: {"action": "latest_blocks", "limit": 20}
      }).success(function(data) {
        $scope.blockLoading = false;
        $scope.latest_blocks = data.blocks;
        
        if ($scope.current_block_number < data.blocks[0].number)
        {
            $scope.current_block_number = data.blocks[0].number;
            $scope.getLatestBlockInfo(data.blocks[0].number);
            $scope.calculateAverageBlocktime();
        }

      });
    }


    $scope.reloadTransactions = function() {
      $scope.txLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: {"action": "latest_txs"}
      }).success(function(data) {
        $scope.latest_txs = data.txs;
        $scope.txLoading = false;
      });
    }

    // Calculate the average block time for showing a more accurate hash rate
    $scope.calculateAverageBlocktime = function() { 
      if ($scope.latest_blocks)
      {
        let total_time = 0;
        let cur_timestamp = 0;
        for (var i = 0, len = $scope.latest_blocks.length; i < len; i++) {
          cur_timestamp = $scope.latest_blocks[i].timestamp;
          if (i > 0) { 
            let prev_timestamp = $scope.latest_blocks[i-1].timestamp;  // reminder: 'prev' block is actually the next block higher up on the chain due to descending ordering
            let blocktime = prev_timestamp - cur_timestamp;
            total_time = total_time + blocktime;
          }
        }
        
        $scope.averaged_block_time = total_time / $scope.latest_blocks.length;
      }
    }

    $scope.reloadBlocks();
    $scope.reloadTransactions();
    $scope.txLoading = false;
    $scope.blockLoading = false;
})
.directive('summaryStats', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/views/summary-stats.html',
    scope: true,
    link: function(scope, elem, attrs){
      scope.stats = {};

      var etcEthURL = "/stats";
      var etcPriceURL = "https://coinmarketcap-nexuist.rhcloud.com/api/etc";
      var ethPriceURL = "https://coinmarketcap-nexuist.rhcloud.com/api/eth"
      scope.stats.ethDiff = 1;
      scope.stats.ethHashrate = 1;
      scope.stats.usdEth = 1;



      $http.post(etcEthURL, {"action": "etceth"})
       .then(function(res){
          scope.stats.etcHashrate = res.data.etcHashrate;
          scope.stats.ethHashrate = res.data.ethHashrate;
          scope.stats.etcEthHash = res.data.etcEthHash;
          scope.stats.ethDiff = res.data.ethDiff;
          scope.stats.etcDiff = res.data.etcDiff;
          scope.stats.etcEthDiff = res.data.etcEthDiff;
        });
      $http.get(etcPriceURL)
       .then(function(res){
          scope.stats.usdEtc = res.data.price["usd"].toFixed(2);
          scope.stats.usdEtcEth = parseInt(100*scope.stats.usdEtc/scope.stats.usdEth);
        });
      $http.get(ethPriceURL)
       .then(function(res){
          scope.stats.usdEth = res.data.price["usd"].toFixed(2);
          scope.stats.usdEtcEth = parseInt(100*scope.stats.usdEtc/scope.stats.usdEth);
          scope.stats.ethChange = parseFloat(res.data.change);
        });

      }
  }
});
