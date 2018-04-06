const onCanvas01=()=> {
    var c = document.getElementById('canvas');
    var w = c.width = window.innerWidth
        ,h = c.height = window.innerHeight
        ,ctx = c.getContext( '2d' )
        ,opts = {
        baseBaseSize: 15,
        addedBaseSize: 5,
        baseVel: 2,
        addedVel: 1,
        baseTime: 60,
        addedTime: 20,
        overTime: 5,
        sliding: .99,
        particleChance: .9,
        particles: 100,
        templateParticleColor: 'hsla(hue,80%,40%,alp)',
        repaintAlpha: 'rgba(0,0,0,.1)',
        startColor: .2,
        fullColor: .5,
        stopColor: .6,
        timeToColorChange: 3
    }
        ,	particles = []
        ,	tick = 0;

    function Particle(){
        this.reset();
    }
    Particle.prototype.reset = function(){
        this.x = Math.pow( Math.random(), 1/4 );
        this.y = h / 2;
        var color = opts.templateParticleColor.replace( 'hue', this.x * 360 * 2 + tick * opts.timeToColorChange );
        this.baseSize = ( Math.random() + this.x ) / 2 * ( opts.baseBaseSize + opts.addedBaseSize * Math.random() );
        this.gradient = ctx.createRadialGradient( 0, 0, 0, 0, 0, this.baseSize / 2 );
        this.gradient.addColorStop( opts.startColor, color.replace( 'alp', 0 ) );
        this.gradient.addColorStop( opts.fullColor, color.replace( 'alp', 1 ) );
        this.gradient.addColorStop( opts.stopColor, color.replace( 'alp', 1 ) );
        this.gradient.addColorStop( 1, color.replace( 'alp', 0 ) );

        this.vx = -( 1 + Math.random() / 10 - this.x) * ( opts.baseVel + Math.random() * opts.addedVel );
        this.vy = Math.pow( this.x, 4 ) * ( opts.baseVel + Math.random() * opts.addedVel ) * ( Math.random() < .5 ? -1 : 1 );

        this.x *= w / 2;
        if( Math.random() < .5 ){
            this.x = w - this.x;
            this.vx *= -1;
        }

        this.time = opts.baseTime + opts.addedTime * Math.random();
        this.tick = this.time + opts.overTime;

    }
    Particle.prototype.step = function(){
        var size;
        if( this.tick <= this.time ){
            this.x += this.vx *= opts.sliding;
            this.y += this.vy *= opts.sliding;
            size = Math.pow( this.tick / this.time, 1/2 )
        } else size = 1 - ( ( this.tick - this.time ) / opts.overTime ) + .000001;

        --this.tick;

        ctx.translate( this.x, this.y );
        ctx.scale( size, size );
        ctx.fillStyle = this.gradient;
        ctx.fillRect( -this.baseSize / 2, -this.baseSize / 2, this.baseSize, this.baseSize );
        ctx.scale( 1/size, 1/size );
        ctx.translate( -this.x, -this.y );

        if( this.tick <= 0 )
            this.reset();
    }

    function anim(){
        window._closeAnimationFrame = window.requestAnimationFrame( anim );

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = opts.repaintAlpha;
        ctx.fillRect( 0, 0, w, h );

        ctx.globalCompositeOperation = 'lighter';

        ++tick;

        if( particles.length < opts.particles && Math.random() < opts.particleChance )
            particles.push( new Particle );

        particles.map( function( particle ){ particle.step(); } );
    }
    ctx.fillStyle = '#040404';
    ctx.fillRect( 0, 0, w, h );
    anim();

    window.addEventListener( 'resize', function(){

        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;

        ctx.fillStyle = '#040404';
        ctx.fillRect( 0, 0, w, h );
    })
};
const onCanvas02=()=> {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,

        hue = 255,
        stars = [],
        count = 0,
        maxStars = 1200;

    var canvas2 = document.createElement('canvas'),
        ctx2 = canvas2.getContext('2d');
    canvas2.width = 100;
    canvas2.height = 100;
    var half = canvas2.width / 2,
        gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#fff');
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

// End cache

    function random(min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }

        if (min > max) {
            var hold = max;
            max = min;
            min = hold;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function maxOrbit(x, y) {
        var max = Math.max(x, y),
            diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
    }

    var Star = function() {

        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(60, this.orbitRadius) / 12;
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / 900000;
        this.alpha = random(2, 10) / 10;

        count++;
        stars[count] = this;
    }

    Star.prototype.draw = function() {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
            y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
            twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
    }

    for (var i = 0; i < maxStars; i++) {
        new Star();
    }

    function animation(w, h) {
        if(window._closeAnimationFrame){
            window.cancelAnimationFrame(window._closeAnimationFrame)
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#040404';
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, l = stars.length; i < l; i++) {
            stars[i].draw();
        };

        window._closeAnimationFrame = window.requestAnimationFrame(animation);
    }

    animation(w, h);
    window.addEventListener( 'resize', function(){
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        ctx.fillStyle = '#040404';
        ctx.fillRect(0, 0, w, h);
        window._closeAnimationFrame = window.requestAnimationFrame(animation);
    })
};
const onCanvas = [
    onCanvas01,
    onCanvas02,
];

export default onCanvas
