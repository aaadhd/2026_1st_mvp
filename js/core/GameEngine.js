export class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) throw new Error(`Canvas #\${canvasId} not found`);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;

        this.lastTime = 0;
        this.accumulator = 0;
        this.deltaTime = 1 / 60;

        this.running = false;
        this.gameInstance = null;

        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.canvas);

        // Bind loop
        this.loop = this.loop.bind(this);

        // Input Handling
        this.input = { x: 0, y: 0, isDown: false, justPressed: false };
        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleEnd(e));

        this.canvas.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleEnd(e), { passive: false });
    }

    setGame(gameInstance) {
        this.gameInstance = gameInstance;
        gameInstance.engine = this;
        gameInstance.init();
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
    }

    resize() {
        // Handle High DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;

        if (this.gameInstance) this.gameInstance.resize(this.width, this.height);
    }

    loop(currentTime) {
        if (!this.running) return;

        const frameTime = (currentTime - this.lastTime) / 1000; // seconds
        this.lastTime = currentTime;

        // Cap frame time to prevent spirals
        const safeFrameTime = Math.min(frameTime, 0.1);

        if (this.gameInstance) {
            this.gameInstance.update(safeFrameTime);

            // Render
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.gameInstance.draw(this.ctx);
        }

        // Reset input 'justPressed'
        this.input.justPressed = false;

        requestAnimationFrame(this.loop);
    }

    // Input Helpers
    getPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    handleStart(e) {
        e.preventDefault();
        const pos = this.getPos(e);
        this.input.x = pos.x;
        this.input.y = pos.y;
        this.input.isDown = true;
        this.input.justPressed = true;

        if (this.gameInstance) this.gameInstance.onInputDown(pos.x, pos.y);
    }

    handleMove(e) {
        e.preventDefault();
        const pos = this.getPos(e);
        this.input.x = pos.x;
        this.input.y = pos.y;

        if (this.gameInstance) this.gameInstance.onInputMove(pos.x, pos.y);
    }

    handleEnd(e) {
        e.preventDefault();
        this.input.isDown = false;

        if (this.gameInstance) this.gameInstance.onInputUp(this.input.x, this.input.y);
    }
}
