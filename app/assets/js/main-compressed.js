/*! dadaconf 2016-11-17 */
!function(){function a(){g=new THREE.Scene;var a=45,c=2,d=.1,k=2e4;f=new THREE.PerspectiveCamera(a,c,d,k),g.add(f),f.position.set(0,150,400),f.lookAt(g.position);var l=new THREE.PointLight(16777215);l.position.set(100,250,100),g.add(l);var m=(new THREE.BoxBufferGeometry(150,150,150),(new THREE.TextureLoader).load("images/promo_pictures_sprite.png")),n=(new THREE.MeshBasicMaterial({map:m}),(new THREE.TextureLoader).load("images/promo_pictures_sprite.jpg"));annie=new e(n,22,1,22,666);var o=new THREE.MeshBasicMaterial({map:n,side:THREE.FrontSide}),p=new THREE.BoxBufferGeometry(150,150,150);i=new THREE.Mesh(p,o),i.position.set(0,70,150),g.add(i);var q=new THREE.BoxBufferGeometry(600,600,600),r=(new THREE.TextureLoader).load("images/simpsons_bg.jpg"),s=new THREE.MeshBasicMaterial({map:r,side:THREE.BackSide}),t=new THREE.Mesh(q,s);t.position.set(0,0,0),g.add(t),h=new THREE.WebGLRenderer,h.setPixelRatio(window.devicePixelRatio),h.setSize(j.width(),j.height()),j.append(h.domElement),window.addEventListener("resize",b,!1)}function b(){var a=j.height();f.aspect=j.width()/a,f.updateProjectionMatrix(),h.setSize(j.width(),a)}function c(){var a=l.getDelta();requestAnimationFrame(c),i.rotation.y+=9e-4,annie.update(1e3*a),h.render(g,f)}function d(a){m=50*Math.exp(.5*a.pageX-j.offset().left,2),n=50*Math.exp(.5*a.pageY-j.offset().top,2)}function e(a,b,c,d,e){this.tilesHorizontal=b,this.tilesVertical=c,this.numberOfTiles=d,a.wrapS=a.wrapT=THREE.RepeatWrapping,a.repeat.set(1/this.tilesHorizontal,1/this.tilesVertical),this.tileDisplayDuration=e,this.currentDisplayTime=0,this.currentTile=0,this.update=function(b){for(this.currentDisplayTime+=b;this.currentDisplayTime>this.tileDisplayDuration;){this.currentDisplayTime-=this.tileDisplayDuration,this.currentTile++,this.currentTile==this.numberOfTiles&&(this.currentTile=0);var c=this.currentTile%this.tilesHorizontal;a.offset.x=c/this.tilesHorizontal;var d=Math.floor(this.currentTile/this.tilesHorizontal);a.offset.y=d/this.tilesVertical}}}var f,g,h,i,j,k="#monolith",l=new THREE.Clock,m=150,n=-75;$(document).ready(function(){j=$(k),a(),c(),b(),j.click(d)})}();