(function() {
  var NUM_FACES = 51;
  var FACE_PREFIX = "images/faces/ui_face"
  var FACE_EXTENSION = ".jpg"; 

  var ref = new Firebase("https://dadaconf.firebaseio.com/");

  function randomUIFace() {
  	var faceIndex = Math.floor((Math.random() * NUM_FACES));
  	return FACE_PREFIX + faceIndex + FACE_EXTENSION;
  }

  var setFaces = function(){
    var face1 = $("#about-0");
    var face2 = $("#about-1");
    face1.attr("src", randomUIFace());
    face2.attr("src", randomUIFace());
  };

  var initForm = function(){
    
  };

  $(document).ready(function() {
    setFaces();
    initForm();

  });
  // on document ready insert two random photos as source for about us images. 
  // on load get 2 random photos and go for it

})();
