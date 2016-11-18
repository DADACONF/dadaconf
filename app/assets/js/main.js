(function() {
  var MONOLITH_ID = '#monolith';
  var camera, scene, renderer;
  var cube;
  var clock = new THREE.Clock();
  var monolith;
  var rotateX = 150, rotateY = -75;

  function init() {
    scene = new THREE.Scene();

    var VIEW_ANGLE = 45, ASPECT = 2.0, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,150,400);
    camera.lookAt(scene.position);

    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(100,250,100);
    scene.add(light);

    var geometry = new THREE.BoxBufferGeometry( 150, 150, 150 );
    var texture = new THREE.TextureLoader().load( 'images/promo_pictures_sprite.png' );
    var material = new THREE.MeshBasicMaterial( { map: texture } );


    var runnerTexture = new THREE.TextureLoader().load( 'images/promo_pictures_sprite.jpg' );
    annie = new TextureAnimator(runnerTexture, 22, 1, 22, 666); // texture, #horiz, #vert, #total, duration.
    var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, side:THREE.FrontSide } );

    var runnerGeometry = new THREE.BoxBufferGeometry(150,150,150);
    cube = new THREE.Mesh(runnerGeometry, runnerMaterial);
    cube.position.set(0, 70, 150);
    scene.add(cube);

    var skyBoxGeometry = new THREE.BoxBufferGeometry( 600, 600, 600);
    var skyBoxTexture = new THREE.TextureLoader().load( 'images/simpsons_bg.jpg' );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { map: skyBoxTexture, side: THREE.BackSide} );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial);
    skyBox.position.set(0, 0, 0);
    scene.add(skyBox);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio);
    renderer.setSize(monolith.width(), monolith.height());

    monolith.append(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize() {
    var height = monolith.height();
    camera.aspect = monolith.width() / height;
    camera.updateProjectionMatrix();
    renderer.setSize(monolith.width(), height);
  }

  function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame( animate );
    cube.rotation.y += 0.0009;
    annie.update(1000 * delta);

    renderer.render( scene, camera );
  }

  function onMouseClick(event) {

    rotateX = 50 * Math.exp(0.5 * event.pageX - monolith.offset().left, 2);
    rotateY = 50 * Math.exp(0.5 * event.pageY - monolith.offset().top, 2);
  }

  $(document).ready(function(){
    monolith = $(MONOLITH_ID);
    init();
    animate();
    onWindowResize();
    monolith.click(onMouseClick);
  });


function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration)
{
  // note: texture passed by reference, will be updated by the update function.

  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet.
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;

  this.update = function( milliSec )
  {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration)
    {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles)
        this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
}
})();
