/**
 * Created by crims_000 on 4/6/2016.
 */

var sizex = 800;
var sizey = 600;
var game = new Phaser.Game(sizex, sizey);
var ballx = 150;
var bally = 200;
var level = 1;


// Create our 'main' state that will contain the game
var mainState = {
    preload: function() {
        //game.world.removeAll();
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.load.spritesheet('redBrick','BrickBreaker/RedBrick.png',136,30);
        game.load.spritesheet('blueBrick','BrickBreaker/BlueBrick.png',136,30);
        game.load.spritesheet('goldBrick','BrickBreaker/GoldBrick.png',136,30);
        game.load.spritesheet('paddle','BrickBreaker/paddle.png',284,27);
        game.load.spritesheet('ball','BrickBreaker/Ball.png',28,28);
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        this.brickGroup = game.add.group();
        this.ballGroup = game.add.group();
        this.paddleGroup = game.add.group();
        game.stage.backgroundColor = "#A6A6A6";
        this.populateBricks();

        this.paddle = game.add.sprite(sizex/2 - 142, sizey - 60,'paddle');
        this.paddleGroup.add(this.paddle);
        this.ball = game.add.sprite(sizex/2 - 14, sizey - 60 - 27, 'ball');
        this.ballGroup.add(this.ball);

        game.physics.arcade.enable(this.paddle);
        game.physics.arcade.enable(this.ball);
        this.paddle.body.immovable = true;

        this.paddle.inputEnabled = true;
        this.paddle.input.enableDrag();
        this.paddle.input.allowVerticalDrag = false;

        this.ball.body.velocity.setTo(ballx * level,bally * level);
        this.ball.body.bounce.set(1);
        this.ball.body.collideWorldBounds = true;
    },

    update: function() {
        game.physics.arcade.collide(this.paddle, this.ballGroup, this.paddleHitBall, null, this);
        game.physics.arcade.collide(this.ball, this.brickGroup, this.ballHitBrick, null, this);
        if(this.ball.y > sizey - 40){
            this.loseGame();

        }
        if(this.brickAmount <= 0){
            level = level + 0.5;
            game.state.start('main');
        }
    },
    
    paddleHitBall: function (paddle, ball) {
        this.ball.body.velocity.setTo(this.ball.body.velocity.x + 10, this.ball.body.velocity.y);
    },
    
    ballHitBrick: function (ball, brick) {
        this.brickAmount--;
        brick.destroy();
    },

    loseGame: function () {
        game.state.start('menu');
    },

    makeBrick: function (x,y) {
        var block = game.add.sprite(x, y, 'redBrick');

        // Add the block to our previously created group
        this.brickGroup.add(block);

        // Enable physics on the block
        game.physics.arcade.enable(block);

        block.body.immovable = true;

        block.checkWorldBounds = true;
        block.outOfBoundsKill = true;
    },

    populateBricks: function () {
        this.brickAmount = 12;
        var x = 0;
        var y = 40;

        for(var w = 0; w < 12; w++){
            if(w%4 == 0 && w != 0){
                y = y + 40;
                x =0;
            }
            this.makeBrick(x*136 + (x+1)*50,y);
            x++
        }

    }
};

var menuState = {
    preload: function () {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.load.spritesheet('startButton','BrickBreaker/StartButton.png',200,71);
    },

    create: function () {
        game.stage.backgroundColor = "#A6A6A6";
        game.add.text(350,20,"Brick",{font: "45px Arial",fill: "$ffffffff" });
        game.add.text(320,60, "Breaker", {font: "45px Arial", fill: "$fffffff"});

        if(level > 1){
            game.add.text(309,150,"Got to: " +( ((level - 1)*2) + 1),{font: "45px Arial", fill:"#ffffffff"});
        }

        this.button = game.add.button(sizex/2 - 100, sizey - 200,'startButton',this.gameStart,this,2,1,0);
    },

    update: function(){

    },

    gameStart: function () {
        game.state.start('main');

    }
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.add('menu', menuState);
game.state.start('menu');