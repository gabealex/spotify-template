// This is the javascript file associated with spotify website
var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=';
var trackUrl = 'https://api.spotify.com/v1/tracks/';
var artistUrl = 'https://api.spotify.com/v1/artists/';
var myApp = angular.module('myApp', []);

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}

  //get the songs associated with the user input
  $scope.getSongs = function() {
    $http.get(baseUrl + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items
    })
  }

  //given the selected song, gets the related songs that match
  $scope.getSuggested = function(track) {
    $scope.chosenTrack = track;
    var suggestedTracks = [];
    var suggestedArtists = [];

    //gets the track selected
    $http.get(trackUrl + track.id).success(function(result) {
      var artist = result.artists[0];
      $scope.chosenArtist = artist;
      //gets the other artists related to the selected song
      $http.get(artistUrl + artist.id + '/related-artists').success(function(relateresult) {
        for (i = 0; i < 3; i++) {
          var related = relateresult.artists[i];
          suggestedArtists.push(related);
          //gets the top track of the respective artists
          $http.get(artistUrl + related.id + '/top-tracks?country=SE').success(function(trackresult) {
            var top = trackresult.tracks[0];
            suggestedTracks.push(top);
          })
        }
        $scope.suggestedTracks = suggestedTracks;
        $scope.suggestedArtists = suggestedArtists;
      })
    })
  }

  //Controls the playing of the song
  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause()
      $scope.currentSong = false
      return
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play()  
      $scope.currentSong = song
    }
  }
  //shows the div
  $scope.show = function() {
    $scope.showartist = true;
  }

  //refreshes the div to reload new songs
  $scope.refresh = function() {
    $scope.hide = false;
  }

})

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
