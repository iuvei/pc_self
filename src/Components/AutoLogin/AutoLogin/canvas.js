const onCanvas01=()=> {
    var num = 200;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var max = 100;
    var _x = 0;
    var _y = 0;
    var _z = 150;
    var dtr = function(d) {
        return d * Math.PI / 180;
    };

    var rnd = function() {
        return Math.sin(Math.floor(Math.random() * 360) * Math.PI / 180);
    };
    var dist = function(p1, p2, p3) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
    };

    var cam = {
        obj: {
            x: _x,
            y: _y,
            z: _z
        },
        dest: {
            x: 0,
            y: 0,
            z: 1
        },
        dist: {
            x: 0,
            y: 0,
            z: 200
        },
        ang: {
            cplane: 0,
            splane: 0,
            ctheta: 0,
            stheta: 0
        },
        zoom: 1,
        disp: {
            x: w / 2,
            y: h / 2,
            z: 0
        },
        upd: function() {
            cam.dist.x = cam.dest.x - cam.obj.x;
            cam.dist.y = cam.dest.y - cam.obj.y;
            cam.dist.z = cam.dest.z - cam.obj.z;
            cam.ang.cplane = -cam.dist.z / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z);
            cam.ang.splane = cam.dist.x / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z);
            cam.ang.ctheta = Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z) / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.y * cam.dist.y + cam.dist.z * cam.dist.z);
            cam.ang.stheta = -cam.dist.y / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.y * cam.dist.y + cam.dist.z * cam.dist.z);
        }
    };

    var trans = {
        parts: {
            sz: function(p, sz) {
                return {
                    x: p.x * sz.x,
                    y: p.y * sz.y,
                    z: p.z * sz.z
                };
            },
            rot: {
                x: function(p, rot) {
                    return {
                        x: p.x,
                        y: p.y * Math.cos(dtr(rot.x)) - p.z * Math.sin(dtr(rot.x)),
                        z: p.y * Math.sin(dtr(rot.x)) + p.z * Math.cos(dtr(rot.x))
                    };
                },
                y: function(p, rot) {
                    return {
                        x: p.x * Math.cos(dtr(rot.y)) + p.z * Math.sin(dtr(rot.y)),
                        y: p.y,
                        z: -p.x * Math.sin(dtr(rot.y)) + p.z * Math.cos(dtr(rot.y))
                    };
                },
                z: function(p, rot) {
                    return {
                        x: p.x * Math.cos(dtr(rot.z)) - p.y * Math.sin(dtr(rot.z)),
                        y: p.x * Math.sin(dtr(rot.z)) + p.y * Math.cos(dtr(rot.z)),
                        z: p.z
                    };
                }
            },
            pos: function(p, pos) {
                return {
                    x: p.x + pos.x,
                    y: p.y + pos.y,
                    z: p.z + pos.z
                };
            }
        },
        pov: {
            plane: function(p) {
                return {
                    x: p.x * cam.ang.cplane + p.z * cam.ang.splane,
                    y: p.y,
                    z: p.x * -cam.ang.splane + p.z * cam.ang.cplane
                };
            },
            theta: function(p) {
                return {
                    x: p.x,
                    y: p.y * cam.ang.ctheta - p.z * cam.ang.stheta,
                    z: p.y * cam.ang.stheta + p.z * cam.ang.ctheta
                };
            },
            set: function(p) {
                return {
                    x: p.x - cam.obj.x,
                    y: p.y - cam.obj.y,
                    z: p.z - cam.obj.z
                };
            }
        },
        persp: function(p) {
            return {
                x: p.x * cam.dist.z / p.z * cam.zoom,
                y: p.y * cam.dist.z / p.z * cam.zoom,
                z: p.z * cam.zoom,
                p: cam.dist.z / p.z
            };
        },
        disp: function(p, disp) {
            return {
                x: p.x + disp.x,
                y: -p.y + disp.y,
                z: p.z + disp.z,
                p: p.p
            };
        },
        steps: function(_obj_, sz, rot, pos, disp) {
            var _args = trans.parts.sz(_obj_, sz);
            _args = trans.parts.rot.x(_args, rot);
            _args = trans.parts.rot.y(_args, rot);
            _args = trans.parts.rot.z(_args, rot);
            _args = trans.parts.pos(_args, pos);
            _args = trans.pov.plane(_args);
            _args = trans.pov.theta(_args);
            _args = trans.pov.set(_args);
            _args = trans.persp(_args);
            _args = trans.disp(_args, disp);
            return _args;
        }
    };

    (function() {
        "use strict";
        var threeD = function(param) {
            this.transIn = {};
            this.transOut = {};
            this.transIn.vtx = (param.vtx);
            this.transIn.sz = (param.sz);
            this.transIn.rot = (param.rot);
            this.transIn.pos = (param.pos);
        };

        threeD.prototype.vupd = function() {
            this.transOut = trans.steps(

                this.transIn.vtx,
                this.transIn.sz,
                this.transIn.rot,
                this.transIn.pos,
                cam.disp
            );
        };

        var Build = function() {
            this.vel = 0.04;
            this.lim = 360;
            this.diff = 200;
            this.initPos = 100;
            this.toX = _x;
            this.toY = _y;
            this.go();
        };

        Build.prototype.go = function() {
            this.canvas = document.getElementById("canvas");
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.$ = canvas.getContext("2d");
            this.$.globalCompositeOperation = 'source-over';
            this.varr = [];
            this.dist = [];
            this.calc = [];

            for (var i = 0, len = num; i < len; i++) {
                this.add();
            }

            this.rotObj = {
                x: 0,
                y: 0,
                z: 0
            };
            this.objSz = {
                x: w / 5,
                y: h / 5,
                z: w / 5
            };
        };

        Build.prototype.add = function() {
            this.varr.push(new threeD({
                vtx: {
                    x: rnd(),
                    y: rnd(),
                    z: rnd()
                },
                sz: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                rot: {
                    x: 20,
                    y: -20,
                    z: 0
                },
                pos: {
                    x: this.diff * Math.sin(360 * Math.random() * Math.PI / 180),
                    y: this.diff * Math.sin(360 * Math.random() * Math.PI / 180),
                    z: this.diff * Math.sin(360 * Math.random() * Math.PI / 180)
                }
            }));
            this.calc.push({
                x: 360 * Math.random(),
                y: 360 * Math.random(),
                z: 360 * Math.random()
            });
        };

        Build.prototype.upd = function() {
            cam.obj.x += (this.toX - cam.obj.x) * 0.05;
            cam.obj.y += (this.toY - cam.obj.y) * 0.05;
        };

        Build.prototype.draw = function() {
            this.$.clearRect(0, 0, this.canvas.width, this.canvas.height);
            cam.upd();
            this.rotObj.x += 0.1;
            this.rotObj.y += 0.1;
            this.rotObj.z += 0.1;

            for (var i = 0; i < this.varr.length; i++) {
                for (var val in this.calc[i]) {
                    if (this.calc[i].hasOwnProperty(val)) {
                        this.calc[i][val] += this.vel;
                        if (this.calc[i][val] > this.lim) this.calc[i][val] = 0;
                    }
                }

                this.varr[i].transIn.pos = {
                    x: this.diff * Math.cos(this.calc[i].x * Math.PI / 180),
                    y: this.diff * Math.sin(this.calc[i].y * Math.PI / 180),
                    z: this.diff * Math.sin(this.calc[i].z * Math.PI / 180)
                };
                this.varr[i].transIn.rot = this.rotObj;
                this.varr[i].transIn.sz = this.objSz;
                this.varr[i].vupd();
                if (this.varr[i].transOut.p < 0) continue;
                var g = this.$.createRadialGradient(this.varr[i].transOut.x, this.varr[i].transOut.y, this.varr[i].transOut.p, this.varr[i].transOut.x, this.varr[i].transOut.y, this.varr[i].transOut.p * 2);
                this.$.globalCompositeOperation = 'lighter';
                g.addColorStop(0, 'hsla(255, 255%, 255%, 1)');
                g.addColorStop(.5, 'hsla(' + (i + 2) + ',85%, 40%,1)');
                g.addColorStop(1, 'hsla(' + (i) + ',85%, 40%,.5)');
                this.$.fillStyle = g;
                this.$.beginPath();
                this.$.arc(this.varr[i].transOut.x, this.varr[i].transOut.y, this.varr[i].transOut.p * 2, 0, Math.PI * 2, false);
                this.$.fill();
                this.$.closePath();
            }
        };
        Build.prototype.anim = function() {
            window.requestAnimationFrame = (function() {
                return window.requestAnimationFrame ||
                    function(callback, element) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
            var anim = function() {
                this.upd();
                this.draw();
                window.requestAnimationFrame(anim);
            }.bind(this);
            window.requestAnimationFrame(anim);
        };

        Build.prototype.run = function() {
            this.anim();
            window.addEventListener('mousemove', function(e) {
                this.toX = (e.clientX - this.canvas.width / 2) * -0.8;
                this.toY = (e.clientY - this.canvas.height / 2) * 0.8;
            }.bind(this));
            window.addEventListener('touchmove', function(e) {
                e.preventDefault();
                this.toX = (e.touches[0].clientX - this.canvas.width / 2) * -0.8;
                this.toY = (e.touches[0].clientY - this.canvas.height / 2) * 0.8;
            }.bind(this));
            window.addEventListener('mousedown', function(e) {
                for (var i = 0; i < 100; i++) {
                    this.add();
                }
            }.bind(this));
            window.addEventListener('touchstart', function(e) {
                e.preventDefault();
                for (var i = 0; i < 100; i++) {
                    this.add();
                }
            }.bind(this));
        };
        var app = new Build();
        app.run();
    })();
    window.addEventListener('resize', function() {
        canvas.width = w = window.innerWidth;
        canvas.height = h = window.innerHeight;
    }, false);
};
const onCanvas02=()=> {
    var canvas = document.getElementById('canvas');
    var w = canvas.width = window.innerWidth
        ,h = canvas.height = window.innerHeight
        ,ctx = canvas.getContext( '2d' )
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
        window.requestAnimationFrame( anim );

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = opts.repaintAlpha;
        ctx.fillRect( 0, 0, w, h );

        ctx.globalCompositeOperation = 'lighter';

        ++tick;

        if( particles.length < opts.particles && Math.random() < opts.particleChance )
            particles.push( new Particle );

        particles.map( function( particle ){ particle.step(); } );
    }
    ctx.fillStyle = '#222';
    ctx.fillRect( 0, 0, w, h );
    anim();

    window.addEventListener( 'resize', function(){

        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;

        ctx.fillStyle = '#222';
        ctx.fillRect( 0, 0, w, h );
    })
};
const onCanvas03=()=> {
    function project3D(x, y, z, vars) {
        var p, d;
        x -= vars.camX;
        y -= vars.camY - 8;
        z -= vars.camZ;
        p = Math.atan2(x, z);
        d = Math.sqrt(x * x + z * z);
        x = Math.sin(p - vars.yaw) * d;
        z = Math.cos(p - vars.yaw) * d;
        p = Math.atan2(y, z);
        d = Math.sqrt(y * y + z * z);
        y = Math.sin(p - vars.pitch) * d;
        z = Math.cos(p - vars.pitch) * d;
        var rx1 = -1000;
        var ry1 = 1;
        var rx2 = 1000;
        var ry2 = 1;
        var rx3 = 0;
        var ry3 = 0;
        var rx4 = x;
        var ry4 = z;
        var uc = (ry4 - ry3) * (rx2 - rx1) - (rx4 - rx3) * (ry2 - ry1);
        var ua = ((rx4 - rx3) * (ry1 - ry3) - (ry4 - ry3) * (rx1 - rx3)) / uc;
        var ub = ((rx2 - rx1) * (ry1 - ry3) - (ry2 - ry1) * (rx1 - rx3)) / uc;
        if (!z) z = 0.000000001;
        if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {
            return {
                x: vars.cx + (rx1 + ua * (rx2 - rx1)) * vars.scale,
                y: vars.cy + y / z * vars.scale,
                d: (x * x + y * y + z * z)
            }
        } else {
            return {d: -1}
        }
    }

    function elevation(x, y, z) {
        var dist = Math.sqrt(x * x + y * y + z * z);
        if (dist && z / dist >= -1 && z / dist <= 1)return Math.acos(z / dist);
        return 0.00000001
    }

    function rgb(col) {
        col += 0.000001;
        var r = parseInt((0.5 + Math.sin(col) * 0.5) * 16);
        var g = parseInt((0.5 + Math.cos(col) * 0.5) * 16);
        var b = parseInt((0.5 - Math.sin(col) * 0.5) * 16);
        return "#" + r.toString(16) + g.toString(16) + b.toString(16)
    }

    function interpolateColors(RGB1, RGB2, degree) {
        var w2 = degree;
        var w1 = 1 - w2;
        return [w1 * RGB1[0] + w2 * RGB2[0], w1 * RGB1[1] + w2 * RGB2[1], w1 * RGB1[2] + w2 * RGB2[2]]
    }

    function rgbArray(col) {
        col += 0.000001;
        var r = parseInt((0.5 + Math.sin(col) * 0.5) * 256);
        var g = parseInt((0.5 + Math.cos(col) * 0.5) * 256);
        var b = parseInt((0.5 - Math.sin(col) * 0.5) * 256);
        return [r, g, b]
    }

    function colorString(arr) {
        var r = parseInt(arr[0]);
        var g = parseInt(arr[1]);
        var b = parseInt(arr[2]);
        return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2)
    }

    function process(vars) {
        if (vars.points.length < vars.initParticles)for (var i = 0; i < 5; ++i)spawnParticle(vars);
        var p, d, t;
        p = Math.atan2(vars.camX, vars.camZ);
        d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
        d -= Math.sin(vars.frameNo / 80) / 25;
        t = Math.cos(vars.frameNo / 300) / 165;
        vars.camX = Math.sin(p + t) * d;
        vars.camZ = Math.cos(p + t) * d;
        vars.camY = -Math.sin(vars.frameNo / 220) * 15;
        vars.yaw = Math.PI + p + t;
        vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
        var t;
        for (var i = 0; i < vars.points.length; ++i) {
            var x = vars.points[i].x,
            y = vars.points[i].y,
            z = vars.points[i].z;
            d = Math.sqrt(x * x + z * z) / 1.0075;
            t = .1 / (1 + d * d / 5);
            p = Math.atan2(x, z) + t;
            vars.points[i].x = Math.sin(p) * d;
            vars.points[i].z = Math.cos(p) * d;
            vars.points[i].y += vars.points[i].vy * t * ((Math.sqrt(vars.distributionRadius) - d) * 2);
            if (vars.points[i].y > vars.vortexHeight / 2 || d < .25) {
                vars.points.splice(i, 1);
                spawnParticle(vars)
            }
        }
    }

    function drawFloor(vars) {
        var x, y, z, d, point, a, size;
        for (var i = -25; i <= 25; i += 1) {
            for (var j = -25; j <= 25; j += 1) {
                x = i * 2;
                z = j * 2;
                y = vars.floor;
                d = Math.sqrt(x * x + z * z);
                point = project3D(x, y - d * d / 85, z, vars);
                if (point.d != -1) {
                    size = 1 + 15000 / (1 + point.d);
                    a = 0.15 - Math.pow(d / 50, 4) * 0.15;
                    if (a > 0) {
                        vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(d / 26 - vars.frameNo / 40), [0, 128, 32], .5 + Math.sin(d / 6 - vars.frameNo / 8) / 2));
                        vars.ctx.globalAlpha = a;
                        vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size)
                    }
                }
            }
        }
        vars.ctx.fillStyle = "#82f";
        for (var i = -25; i <= 25; i += 1) {
            for (var j = -25; j <= 25; j += 1) {
                x = i * 2;
                z = j * 2;
                y = -vars.floor;
                d = Math.sqrt(x * x + z * z);
                point = project3D(x, y + d * d / 85, z, vars);
                if (point.d != -1) {
                    size = 1 + 15000 / (1 + point.d);
                    a = 0.15 - Math.pow(d / 50, 4) * 0.15;
                    if (a > 0) {
                        vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(-d / 26 - vars.frameNo / 40), [32, 0, 128], .5 + Math.sin(-d / 6 - vars.frameNo / 8) / 2));
                        vars.ctx.globalAlpha = a;
                        vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size)
                    }
                }
            }
        }
    }

    function sortFunction(a, b) {
        return b.dist - a.dist
    }

    function draw(vars) {
        vars.ctx.globalAlpha = .15;
        vars.ctx.fillStyle = "#000";
        vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawFloor(vars);
        var point, x, y, z, a;
        for (var i = 0; i < vars.points.length; ++i) {
            x = vars.points[i].x;
            y = vars.points[i].y;
            z = vars.points[i].z;
            point = project3D(x, y, z, vars);
            if (point.d != -1) {
                vars.points[i].dist = point.d;
                var size = 1 + vars.points[i].radius / (1 + point.d),
                d = Math.abs(vars.points[i].y);
                a = .8 - Math.pow(d / (vars.vortexHeight / 2), 1000) * .8;
                vars.ctx.globalAlpha = a >= 0 && a <= 1 ? a : 0;
                vars.ctx.fillStyle = rgb(vars.points[i].color);
                if (point.x > -1 && point.x < vars.canvas.width && point.y > -1 && point.y < vars.canvas.height) vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size)
            }
        }
        vars.points.sort(sortFunction)
    }

    function spawnParticle(vars) {
        var p, ls;
        var pt = {};
        p = Math.PI * 2 * Math.random();
        ls = Math.sqrt(Math.random() * vars.distributionRadius);
        pt.x = Math.sin(p) * ls;
        pt.y = -vars.vortexHeight / 2;
        pt.vy = vars.initV / 20 + Math.random() * vars.initV;
        pt.z = Math.cos(p) * ls;
        pt.radius = 200 + 800 * Math.random();
        pt.color = pt.radius / 1000 + vars.frameNo / 250;
        vars.points.push(pt)
    }

    function frame(vars) {
        if (vars === undefined) {
            var vars = {};
            vars.canvas = document.querySelector("canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = document.body.clientWidth;
            vars.canvas.height = document.body.clientHeight;
            window.addEventListener("resize", function () {
                vars.canvas.width = document.body.clientWidth;
                vars.canvas.height = document.body.clientHeight;
                vars.cx = vars.canvas.width / 2;
                vars.cy = vars.canvas.height / 2
            }, true);
            vars.frameNo = 0;
            vars.camX = 0;
            vars.camY = 0;
            vars.camZ = -14;
            vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
            vars.yaw = 0;
            vars.cx = vars.canvas.width / 2;
            vars.cy = vars.canvas.height / 2;
            vars.bounding = 10;
            vars.scale = 500;
            vars.floor = 26.5;
            vars.points = [];
            vars.initParticles = 1000;
            vars.initV = .01;
            vars.distributionRadius = 800;
            vars.vortexHeight = 25
        }
        vars.frameNo++;
        requestAnimationFrame(function () {
            console.log("requestAnimationFrame")
            frame(vars)
        });
        process(vars);
        draw(vars)
    }

    frame();
};
const onCanvas = [
    onCanvas01,
    onCanvas02,
    onCanvas03,
];

export default onCanvas
