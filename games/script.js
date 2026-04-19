const game = {
    score: 0, combo: 1, time: 15, mode: '',
    sequence: [], userStep: 0, currentLevel: 1,
    config: { aimTime: 15, pulseTime: 15, size: 55 },
    timer: null, spawner: null, pulseInterval: null,
    audio: new (window.AudioContext || window.webkitAudioContext)(),

    playSfx(f, d = 0.1) {
        if (this.audio.state === 'suspended') this.audio.resume();
        const o = this.audio.createOscillator();
        const g = this.audio.createGain();
        o.frequency.value = f;
        g.gain.setValueAtTime(0.02, this.audio.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.audio.currentTime + d);
        o.connect(g).connect(this.audio.destination);
        o.start(); o.stop(this.audio.currentTime + d);
    },

    start(mode) {
        this.stop();
        this.mode = mode; this.score = 0; this.combo = 1; this.currentLevel = 1;
        this.time = (mode === 'aim') ? this.config.aimTime : 20;
        
        ui.screen('game-view');
        ui.update();

        if (mode === 'sequence') {
            this.initSequence();
        } else {
            this.timer = setInterval(() => {
                this.time--; ui.update();
                if (this.time <= 0) this.end();
            }, 1000);

            if (mode === 'aim') this.spawner = setInterval(() => this.spawnAim(), 650);
            if (mode === 'pulse') this.initPulse();
        }
    },

    initSequence() {
        this.userStep = 0; this.sequence = [];
        const stage = document.getElementById('stage');
        stage.innerHTML = `<h1 style="font-size:40px; color:var(--text)">ЗАПОМИНАЙ...</h1>`;

        for(let i = 0; i < 2 + this.currentLevel; i++) {
            this.sequence.push(Math.floor(Math.random() * 89) + 10);
        }
        setTimeout(() => this.showNumbers(0), 1000);
    },

    showNumbers(step) {
        const stage = document.getElementById('stage');
        if (step >= this.sequence.length) {
            stage.innerHTML = '';
            setTimeout(() => this.showGrid(), 400);
            return;
        }
        stage.innerHTML = `<h1 style="font-size:80px; font-weight:900; color:var(--green)">${this.sequence[step]}</h1>`;
        this.playSfx(400 + step * 50);
        setTimeout(() => {
            stage.innerHTML = '';
            setTimeout(() => this.showNumbers(step + 1), 300);
        }, 800);
    },

    showGrid() {
        const stage = document.getElementById('stage');
        stage.innerHTML = `<div class="grid-container" id="grid"></div>`;
        let opts = [...this.sequence];
        while(opts.length < 9) {
            let r = Math.floor(Math.random() * 89) + 10;
            if(!opts.includes(r)) opts.push(r);
        }
        opts.sort(() => Math.random() - 0.5);
        opts.forEach(v => {
            const t = document.createElement('div');
            t.className = 'tile'; t.textContent = v;
            t.onmousedown = () => {
                if(v === this.sequence[this.userStep]) {
                    t.style.background = 'var(--green)';
                    t.style.color = 'black';
                    this.playSfx(600);
                    this.userStep++;
                    if(this.userStep === this.sequence.length) {
                        this.score += 500 * this.currentLevel;
                        this.currentLevel++;
                        setTimeout(() => this.initSequence(), 600);
                    }
                } else {
                    this.playSfx(150);
                    this.end();
                }
            };
            document.getElementById('grid').appendChild(t);
        });
    },

    spawnAim() {
        const stage = document.getElementById('stage');
        const t = document.createElement('div');
        const r = Math.random();
        let type = r > 0.9 ? 'gold' : (r > 0.8 ? 'red' : 'green');
        t.className = `target ${type}`;
        t.style.width = t.style.height = this.config.size + 'px';
        t.style.left = (Math.random() * 80 + 10) + '%';
        t.style.top = (Math.random() * 70 + 15) + '%';
        t.onmousedown = (e) => {
            e.stopPropagation();
            if(type === 'red') { this.score -= 100; this.combo = 1; this.playSfx(150); }
            else { this.score += (type === 'gold' ? 50 : 10) * this.combo; this.combo++; this.playSfx(500); }
            t.remove(); ui.update();
        };
        stage.appendChild(t);
        setTimeout(() => { if(t.parentElement) t.remove(); }, 1500);
    },

    initPulse() {
        const stage = document.getElementById('stage');
        stage.innerHTML = `<div id="p-ring" class="pulse-ring" style="width:200px; height:200px;"></div><div id="p-wave" style="width:200px; height:200px; border:4px solid white; border-radius:50%; position:absolute;"></div>`;
        let scale = 0;
        stage.onmousedown = () => {
            const ring = document.getElementById('p-ring');
            if(Math.abs(scale - 1) < 0.2) {
                this.score += 100 * this.combo; this.combo++;
                ring.className = 'pulse-ring hit'; this.playSfx(600);
            } else {
                this.combo = 1; ring.className = 'pulse-ring miss'; this.playSfx(200);
            }
            scale = 0; ui.update();
            setTimeout(() => { if(ring) ring.className = 'pulse-ring'; }, 200);
        };
        const loop = () => {
            if(this.mode !== 'pulse') return;
            scale += 0.035;
            if(scale > 1.5) { scale = 0; this.combo = 1; ui.update(); }
            const w = document.getElementById('p-wave');
            if(w) w.style.transform = `scale(${scale})`;
            this.pulseInterval = requestAnimationFrame(loop);
        };
        loop();
    },

    stop() {
        clearInterval(this.timer); clearInterval(this.spawner);
        if(this.pulseInterval) cancelAnimationFrame(this.pulseInterval);
        document.getElementById('stage').innerHTML = '';
    },

    end() { this.stop(); ui.screen('result'); document.getElementById('final-score').textContent = this.score; }
};

const ui = {
    screen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active'); },
    update() {
        document.getElementById('score').textContent = game.score;
        document.getElementById('combo').textContent = 'x' + game.combo;
        document.getElementById('timer').textContent = game.time + 's';
        document.getElementById('hud').style.display = (game.mode === 'sequence') ? 'none' : 'flex';
    },
    modal(id) { document.getElementById(id).classList.toggle('active'); },
    set(type, val, el) {
        game.config[type] = val;
        el.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        el.classList.add('selected');
    },
    setTheme(theme) {
        document.body.className = '';
        if(theme !== 'dark') document.body.classList.add('theme-' + theme);
    }
};