let Simulador = function(width, height){
    this.X = []
    this.V = 0;
    this.bandas = [];
    this.sliders = [];
    this.concentraciones = [];
    this.axis = null;
    this.height = height;
    this.width = width;
    this.gap = Math.abs(this.height / 8 * 4 - this.height / 8 * 7);


    this.load = function(){
        for(let i = -50; i <= 50; i++){
            this.X.push(i/10);
        }
    };

    this.start = function(){
        this.bandas["conduccion"] = new Banda(this.width / 2, this.height / 8 * 4, this.X, this.gap/2)
        this.bandas["valencia"] = new Banda(this.width / 2, this.height / 8 * 7, this.X, -this.gap/2, "red")

        this.axis = new Axis(this.width / 2 - 5 * 120 - 5, this.height / 8 * 7 + 5, 11 * 120, 5 * 120, "X", "E")

        this.sliders["V"] = new Slider(500, 20, -0.8, 0.6, 0.01, 300);
        this.concentraciones["n"] = new Concentracion(this.width / 2 - 5 * 120, this.height / 8, game.images["concentracion_n_llena"], game.images["concentracion_n_vacia"], 2);
        this.concentraciones["p"] = new Concentracion(this.width / 2 + 5 * 120 - 50, this.height / 8 * 5, game.images["concentracion_p_vacia"], game.images["concentracion_p_llena"], 2);
    }

    this.update = function(){

        this.axis.update();

        for(let i = 0; i < this.sliders.length; i++){
            this.sliders[i].update();
        }

        Object.keys(this.sliders).forEach(k => this.sliders[k].update())
        Object.keys(this.bandas).forEach(k => this.bandas[k].update())
        Object.keys(this.concentraciones).forEach(k => {
                this.concentraciones[k].update();
            }
        )


        if(this.sliders["V"].value > 0) {
            this.bandas["valencia"].V = this.sliders["V"].value;
            this.concentraciones["p"].offsetY = this.V * 120;
            this.concentraciones["p"].percentage = 0.6 + this.V / 4;
            this.concentraciones["n"].percentage = 0.6 + this.V / 4;
        }
        else{
            this.bandas["conduccion"].V = this.sliders["V"].value;
            this.concentraciones["p"].percentage = 0.6 - this.V / 2;
            this.concentraciones["n"].percentage = 0.6 + this.V / 2;
        }
        this.V = this.sliders["V"].value;
        this.bandas.forEach(banda => {
                banda.update();
        });


    }


    this.draw = function(){

        game.artist.writeText("V=" + this.V.toString() + " V", 50, 30, 20, "black");


        game.artist.writeText("N", this.width/6 * 2, this.height / 10, 64, "#FF2C00");
        game.artist.writeText("P", this.width/6 * 4, this.height / 10, 64, "#00FF4C");
        game.artist.drawDottedLine(this.width / 2, this.height / 8, this.width / 2, this.height / 8 * 7, "#333300");
        game.artist.writeText("Zona de Transicion", this.width / 2 - 100, this.height / 11, 22, "#333300");

        game.artist.drawDottedLine(this.width / 2 - this.V*50 + 75, this.height / 8, this.width / 2 - this.V*50 + 75, this.height / 8 * 7, "#333300");
        game.artist.drawDottedLine(this.width / 2 + this.V *40 - 75, this.height / 8, this.width / 2 + this.V*40 - 75, this.height / 8 * 7, "#333300");
        this.axis.draw();
        Object.keys(this.bandas).forEach(k => this.bandas[k].draw())
        Object.keys(this.sliders).forEach(k => this.sliders[k].draw())
        Object.keys(this.concentraciones).forEach(k => this.concentraciones[k].draw())

    }

}


let Banda = function(x, y, X, fermi, color = "black", scale = 120){
    this.x = x;
    this.y = y;
    this.X = X;
    this.scale = scale;
    this.color = color;
    this.V = 0;
    this.offsetY = 75;
    this.offsetX = fermi < 0 ? 1200 : 0;
    this.ogfermi = fermi;
    this.fermi = fermi;

    this.update = function(){
        this.fermi = this.ogfermi - Math.abs(this.ogfermi)/this.ogfermi * this.V * this.scale;
    }


    this.draw = function(){
        game.artist.drawLine(this.x, this.y - this.offsetY*3/2 + this.fermi, 100 + this.offsetX, this.y - this.offsetY *3/2 + this.fermi)
        game.artist.drawDottedLine(this.x, this.y - this.offsetY*3/2 + this.fermi, this.x + (5 * this.scale * Math.abs(this.ogfermi)/this.ogfermi), this.y - this.offsetY *3/2 + this.fermi)
        game.artist.writeText("Ef", this.offsetX + 90, this.y - this.offsetY *3/2 + this.fermi + 10, 25, "black");
        game.artist.drawFunc(this.x, this.y, this.X, (x)=>sigmoid(x, this.V), this.scale, this.color);
        game.artist.drawFunc(this.x, this.y - this.offsetY, this.X, (x)=>sigmoid(x, this.V), this.scale, this.color);
    }

}

let Axis = function(x, y, width, height, labelX = "X", labelY = "Y"){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.labelX = labelX;
    this.labelY = labelY;
    this.update = function(){
    }

    this.draw = function(){
        game.artist.drawLine(x, y, width, y, "black");
        game.artist.drawLine(x, y, x, y - height, "black");
        game.artist.writeText(this.labelX, width, y + 20, 20, "black");
        game.artist.writeText(this.labelY, x-20, y - height, 20, "black");
    }
}

let Slider = function(x, y, min, max, step, scale = 1, color="black", secondaryColor = "blue"){
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.color = color;
    this.secondaryColor = secondaryColor;
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = 0;


    this.update = function(){

        if(this.rightCollision() && game.controller.isClicked && this.value < this.max)
            this.value += this.step;

        if(this.leftCollision() && game.controller.isClicked && this.value > this.min)
            this.value -= this.step;

        this.value = Number(this.value.toFixed(2));
    }

    this.draw = function(){

        game.artist.drawImage(game.images["arrow"], this.x + 120 + this.min * this.scale, this.y + 20, 30, 30);
        game.artist.drawImageRot(game.images["arrow"], this.x + 100 + this.min * this.scale, this.y + 50, 30, 30, -Math.PI);
        game.artist.drawLine(this.x + this.min * this.scale, this.y, this.x + this.max * this.scale, this.y, this.color, 5);
        game.artist.drawCircle(this.x + this.value * this.scale, this.y, 10, this.secondaryColor);
        game.artist.writeText(this.value.toString(), this.x + this.min * this.scale, this.y + 20, 20, color);
    }

    this.rightCollision = function(){
        return game.controller.x > this.x + 120  + this.min * this.scale && game.controller.x < this.x + 150 + this.min * this.scale &&
            game.controller.y > this.y + 20 && game.controller.y < this.y + 50;
    }

    this.leftCollision = function(){
        return game.controller.x > this.x + 70 + this.min * this.scale && game.controller.x < this.x + 100 + this.min * this.scale &&
            game.controller.y > this.y + 20 && game.controller.y < this.y + 50;
    }
}

let Concentracion = function(x, y, full, empty, scale, percentage){
    this.x = x;
    this.y = y;
    this.full = full;
    this.empty = empty;
    this.percentage = percentage;
    this.scale = scale;
    this.offsetY = 0;
    this.update = function(){

    }

    this.draw = function(){
        game.artist.drawImage(this.empty, this.x, this.y + this.offsetY, 50 * this.scale, 100*this.scale);
        game.artist.drawImage(this.full, this.x, this.y + this.offsetY, 50* this.scale, 100 * this.percentage * this.scale, 0, 0, 50, 100 * this.percentage);
    }

}

function sigmoid(x, V, scale= 2, pn= 0){

    return (V - 0.6 * scale) / (1 + Math.exp(-5*(x - pn)));
}