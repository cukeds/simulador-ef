let game = {
  width: 1366,
  height: 768,
  artist: null,
  images: [],
  round: 0,
  maestro: null,
  controller: null,
  delta: 0,
  sounds: [],
  music: [],
  sfxVolume: 15,
  musicVolume: 15,
  simulador: null,

	load: function(){
    this.artist = new Artist(this.width,this.height);
    this.maestro = new Maestro();
    this.controller = new MouseController(this.artist.canvas);
    this.artist.drawRect(0,0,this.width,this.height,"#aaa");
    this.simulador = new Simulador(this.width, this.height);

    this.simulador.load();


      ////////////////////  IMAGES
      let imageNames = ["arrow", "concentracion_n_llena", "concentracion_n_vacia", "concentracion_p_llena", "concentracion_p_vacia"];
      imageNames.forEach(img => {
        this.images[img] = this.artist.loadImg('./assets/' + img + '.png');
      })


    ////////////////////  SFX
    let soundNames = [];
    soundNames.forEach(snd =>{
      this.sounds[snd] = this.maestro.loadSound(snd);
    })
    ///////////////////   Music
    let musicNames = [];
    musicNames.forEach(mus =>{
      this.music[mus] = this.maestro.loadSound(mus);
    })

    if(localStorage.sfxVolume !== undefined){
      game.sfxVolume = Number(localStorage.sfxVolume);
    }
    if(localStorage.musicVolume !== undefined){
      game.musicVolume = Number(localStorage.musicVolume);
    }

    this.start();
	},

  start: function(){

    let loaded = true;
    let loadCount = 0;

    Object.keys(this.images).forEach(img => {
      if(this.images[img].ready === false){
        loaded = false;
        loadCount++;
      }
    })
    Object.keys(this.sounds).forEach(snd => {
      if(this.sounds[snd].ready === false){
        loaded = false;
        loadCount++;
      }
    })
    Object.keys(this.music).forEach(mus => {
      if(this.music[mus].ready === false){
        loaded = false;
        loadCount++;
      }
    })

    if(loaded === false){
      //draw loading screen
      game.artist.drawRect(0,0,game.width,game.height, 'black')
      game.artist.writeText('Things to load: ' + loadCount, 50,50,50,'white');
      window.requestAnimationFrame(game.start.bind(this));
    }else{
      //start game
      this.simulador.start();
      this.update();
    }
	},

	update: function(tstamp){

    this.delta = tstamp - this.timestamp;
    this.timestamp = tstamp;


    this.simulador.update();

    this.controller.update();
    this.draw();
	},

	draw: function(){
    this.artist.drawRect(0,0,game.width,game.height,'#78787F');


    this.simulador.draw();
    this.artist.drawRect(game.controller.x-1, game.controller.y-1, 3,3,'red');


    window.requestAnimationFrame(game.update.bind(game));
	},

  randInt: function(range, start = 0){
    return Math.floor(Math.random() * range) + start;
  },

}

window.addEventListener('load', function(){
  game.load();
})