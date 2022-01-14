class Game {
    static SQUARE_LENGTH = screen.width > 420 ? 40: 20;
    static COLUMNS = 10;
    static ROWS = 20;
    static CANVAS_WIDTH = this.SQUARE_LENGTH * this.COLUMNS;
    static CANVAS_HEIGHT = this.SQUARE_LENGTH * this.ROWS;
    static EMPTY_COLOR = "#ced1c0";
    static BORDER_COLOR = "#4f572a";
    static DELETED_ROW_COLOR = "#ff0022";
    static TIMEOUT_LOCK_PUT_NEXT_PIECE = 270;
    static PIECE_SPEED = 1000;
    static DELETE_ROW_ANIMATION = 450;
    // 得分
    static PER_SQUARE_SCORE = 1;
    static COLORS = [
        "#ffd921",
        "#d117b8",
        "#7340cf",
        "#26064f",
        "#00e8a0",
        "#ff8159",
        "#702d4b",
        "#ff6161",
        "#1fab5f",
        "#19b2ff",
        "#03004a",
        "#290a94",
        "#d9eb7f",
        "#ff6ea2",
        "#56d1e8",
        "#aae03d",
        "#ffa030",
    ];

    constructor(canvasID) {
        this.canvasID = canvasID;
        this.tiouflg = false;
        this.board = [];
        this.exPiec = [];
        this.globalX = 0;
        this.globalY = 0;
        this.paused = true;
        this.currentFigure = null;
        this.fgoo = {};
        this.allPlay = false;
        this.invalk = null;
        this.init();
    }

    init() {
        this.odintdomele();
        this.initfgoo();
        this.resetGame();
        this.draw();
        this.newControls();
    }
    resetGame() {
        this.score = 0;
        this.fgoo.success.currentTime = 0;
        this.fgoo.success.pause();
        this.fgoo.background.currentTime = 0;
        this.fgoo.background.pause();
        this.initBoaPiec();
        this.chooseRandomFigure();
        this.restartGlobalXAndY();
        this.syncexPiecWithBoard();
        this.resefScoer();
        this.pauseGame();
    }
    bigloop() {
        if (!this.allPlay) {
            return;
        }
        if (this.fcaDown()) {
            this.globalY++;
        } else {
            if (this.tiouflg) return;
            this.tiouflg = true;
            setTimeout(() => {
                this.tiouflg = false;
                if (this.fcaDown()) {
                    return;
                }
                this.fgoo.tap.currentTime = 0;
                this.fgoo.tap.play();
                this.mobfiegusepoint();
                if (this.losplayer()) {

                    this.allPlay = false;
                    this.resetGame();
                    return;
                }
                this.verifyAndDeleteFullRows();
                this.chooseRandomFigure();
                this.syncexPiecWithBoard();
            }, Game.TIMEOUT_LOCK_PUT_NEXT_PIECE);
        }
        this.syncexPiecWithBoard();
    }
    newControls() {
        document.addEventListener("keydown", (e) => {
            const { code } = e;
            if (!this.allPlay && code !== "KeyP") {
                return;
            }
            switch (code) {
                case "ArrowRight":
                    this.useMoveRight();
                    break;
                case "ArrowLeft":
                    this.useMoveLeft();
                    break;
                case "ArrowDown":
                    this.useMoveDown();
                    break;
                case "KeyR":
                    this.useSpin();
                    break;
                case "KeyP":
                    this.useconreGame();
                    break;
            }
            this.syncexPiecWithBoard();
        });
        this.usebbDown.addEventListener("click", () => {
            if (!this.allPlay) return;
            this.useMoveDown();
        });
        this.usebRight.addEventListener("click", () => {
            if (!this.allPlay) return;
            this.useMoveRight();
        });
        this.usebLeft.addEventListener("click", () => {
            if (!this.allPlay) return;
            this.useMoveLeft();
        });
        this.usebbSpin.addEventListener("click", () => {
            if (!this.allPlay) return;
            this.useSpin();
        });
        [this.usebbPause, this.usebbResume].forEach($btn => $btn.addEventListener("click", () => {
            this.useconreGame();
        }));
    }
    verifyAndDeleteFullRows() {
        const yCoordinates = this.getPointsToDelete();
        if (yCoordinates.length <= 0) return;
        this.addScore(yCoordinates);
        this.fgoo.success.currentTime = 0;
        this.fgoo.success.play();
        this.changeDeletedRowColor(yCoordinates);
        this.allPlay = false;
        setTimeout(() => {
            this.fgoo.success.pause();
            this.removeRowsFromexPiec(yCoordinates);
            this.syncexPiecWithBoard();
            const invertedCoordinates = Array.from(yCoordinates);
            invertedCoordinates.reverse();
            for (let yCoordinate of invertedCoordinates) {
                for (let y = Game.ROWS - 1; y >= 0; y--) {
                    for (let x = 0; x < this.exPiec[y].length; x++) {
                        if (y < yCoordinate) {
                            let counter = 0;
                            let auxiliarY = y;
                            while (this.empooint(x, auxiliarY + 1) && !this.absolutePointOutOfLimits(x, auxiliarY + 1) && counter < yCoordinates.length) {
                                this.exPiec[auxiliarY + 1][x] = this.exPiec[auxiliarY][x];
                                this.exPiec[auxiliarY][x] = {
                                    color: Game.EMPTY_COLOR,
                                    taken: false,
                                }

                                this.syncexPiecWithBoard();
                                counter++;
                                auxiliarY++;
                            }
                        }
                    }
                }
            }
            this.syncexPiecWithBoard()
            this.allPlay = true;
        }, Game.DELETE_ROW_ANIMATION);
    }
    useMoveRight() {
        if (this.fcaRight()) {
            this.globalX++;
        }
    }
    useMoveLeft() {
        if (this.fcaLeft()) {
            this.globalX--;
        }
    }
    useMoveDown() {
        if (this.fcaDown()) {
            this.globalY++;
        }
    }
//旋轉
    useSpin() {
        this.Spin();
    }
    useconreGame() {
        if (this.paused) {
            this.conreGame();
            this.usebbResume.hidden = true;
            this.usebbPause.hidden = false;
        } else {
            this.pauseGame();
            this.usebbResume.hidden = false;
            this.usebbPause.hidden = true;
        }
    }
    //暫停遊戲
    pauseGame() {
        this.fgoo.background.pause();
        this.paused = true;
        this.allPlay = false;
        clearInterval(this.invalk);
    }
    //繼續遊戲
    conreGame() {
        this.fgoo.background.play();
        this.resefScoer();
        this.paused = false;
        this.allPlay = true;
        this.invalk = setInterval(this.bigloop.bind(this), Game.PIECE_SPEED);
    }
    mobfiegusepoint() {
        this.allPlay = false;
        for (const point of this.currentFigure.getPoints()) {
            point.x += this.globalX;
            point.y += this.globalY;
            this.exPiec[point.y][point.x] = {
                taken: true,
                color: point.color,
            }
        }
        this.restartGlobalXAndY();
        this.allPlay = true;
    }
    getPointsToDelete = () => {
        const points = [];
        let y = 0;
        for (const row of this.exPiec) {
                points.push(y);
            y++;
        }
        return points;
    }
    changeDeletedRowColor(yCoordinates) {
        for (let y of yCoordinates) {
            for (const point of this.exPiec[y]) {
                point.color = Game.DELETED_ROW_COLOR;
            }
        }
    };
    addScore(rows) {
        this.score += Game.PER_SQUARE_SCORE * Game.COLUMNS * rows.length;
        this.resefScoer();
    }
    draw() {
        let x = 0, y = 0;
        for (const row of this.board) {
            x = 0;
            for (const point of row) {
                this.canvasContext.fillStyle = point.color;
                this.canvasContext.fillRect(x, y, Game.SQUARE_LENGTH, Game.SQUARE_LENGTH);
                this.canvasContext.restore();
                this.canvasContext.strokeStyle = Game.BORDER_COLOR;
                this.canvasContext.strokeRect(x, y, Game.SQUARE_LENGTH, Game.SQUARE_LENGTH);
                x += Game.SQUARE_LENGTH;
            }
            y += Game.SQUARE_LENGTH;
        }
        setTimeout(() => {
            requestAnimationFrame(this.draw.bind(this));
        }, 17);
    }
    resefScoer() {
        this.usebbscore.textContent = `Score: ${this.score}`;
    }
    removeRowsFromexPiec(yCoordinates) {
        for (let y of yCoordinates) {
            for (const point of this.exPiec[y]) {
                point.color = Game.EMPTY_COLOR;
                point.taken = false;
            }
        }
    }
    losplayer() {
        for (const point of this.exPiec[1]) {
            if (point.taken) {
                return true;
            }
        }
        return false;
    }
    cleandeidoof() {
        for (let y = 0; y < Game.ROWS; y++) {
            for (let x = 0; x < Game.COLUMNS; x++) {
                this.board[y][x] = {
                    color: Game.EMPTY_COLOR,
                    taken: false,
                };
                if (this.exPiec[y][x].taken) {
                    this.board[y][x].color = this.exPiec[y][x].color;
                }
            }
        }
    }
    olaxcuewithfameBorad() {
        if (!this.currentFigure) return;
        for (const point of this.currentFigure.getPoints()) {
            this.board[point.y + this.globalY][point.x + this.globalX].color = point.color;
        }
    }
    syncexPiecWithBoard() {
        this.cleandeidoof();
        this.olaxcuewithfameBorad();
    }
    initfgoo() {
        this.fgoo.background = Frospoie.loadSound("assets/New Donk City_ Daytime 8 Bit.mp3", true);
        this.fgoo.success = Frospoie.loadSound("assets/success.wav");
        this.fgoo.denied = Frospoie.loadSound("assets/denied.wav");
        this.fgoo.tap = Frospoie.loadSound("assets/tap.wav");
    }
    odintdomele() {
        this.usebcanvas = document.querySelector("#" + this.canvasID);
        this.usebbscore = document.querySelector("#puntaje");
        this.usebbPause = document.querySelector("#btnPausar");
        this.usebbResume = document.querySelector("#btnIniciar");
        this.usebbSpin = document.querySelector("#btnRotar");
        this.usebbDown = document.querySelector("#btnAbajo");
        this.usebRight = document.querySelector("#btnDerecha");
        this.usebLeft = document.querySelector("#btnIzquierda");
        this.usebcanvas.setAttribute("width", Game.CANVAS_WIDTH + "px");
        this.usebcanvas.setAttribute("height", Game.CANVAS_HEIGHT + "px");
        this.canvasContext = this.usebcanvas.getContext("2d");
    }
    chooseRandomFigure() {
        this.currentFigure = this.getRandomFigure();
    }
    restartGlobalXAndY() {
        this.globalX = Math.floor(Game.COLUMNS / 2) - 1;
        this.globalY = 0;
    }
    getRandomFigure() {

        switch (Frospoie.RandomNumInRange(1, 11)) {
            case 1:
                return new tree_one([
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 2), new Point(2, 2), new Point(1, 0), new Point(2, 0)],
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(0, 1), new Point(0, 2), new Point(2, 1), new Point(2, 2)],
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(2, 1), new Point(2, 2), new Point(1, 2), new Point(0, 2)],
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(2, 0)],

                ]);

            case 2:
                return new tree_one([
                    [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(2, 0)],
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 2)],
                    [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(2, 0)],
                    [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(1, 2)],
                ]);

            case 3:
                return new tree_one([
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(3, 0)],
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(0, 3)],
                ]);
            case 4:
                return new tree_one([
                    [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1)],
                    [new Point(0, 0), new Point(1, 0), new Point(0, 1), new Point(0, 2)],
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(2, 1)],
                    [new Point(0, 2), new Point(1, 2), new Point(1, 1), new Point(1, 0)],
                ]);
            case 5:
                return new tree_one([
                    [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(2, 1)],
                    [new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(0, 2)],
                ]);
            case 6:
                return new tree_one([
                    [new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(2, 0)],
                    [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 2)],
                ]);
            case 7:
                return new tree_one([
                    [new Point(0, 0), new Point(1, 0), new Point(0, 1), new Point(1, 1)]
                ]);
            case 8:
                return new tree_one([
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2),new Point(0, 3), new Point(1, 1), new Point(2, 2), new Point(3, 0), new Point(3, 1), new Point(3, 2), new Point(3, 3)],
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0),new Point(3, 0), new Point(1, 2), new Point(2, 1), new Point(3, 3), new Point(0, 3), new Point(1, 3), new Point(2, 3)],
                ]);
            case 9://我的方塊
                return new tree_one([
                    [new Point(1, 1), new Point(1, 1), new Point(1, 1), new Point(0, 0)],
                    [new Point(2, 2), new Point(1, 1), new Point(0, 3), new Point(1, 4)],
                    [new Point(1, 4), new Point(3, 1), new Point(1, 0), new Point(4, 0)],
                    [new Point(1, 3), new Point(3, 0), new Point(2, 1), new Point(1, 1)],
                ]);
            case 10://我的方塊
                return new tree_one([
                    [new Point(1, 1), new Point(1, 1), new Point(1, 1), new Point(0, 0)],
                    [new Point(2, 2), new Point(1, 1), new Point(0, 3), new Point(1, 4)],
                    [new Point(1, 4), new Point(3, 1), new Point(1, 0), new Point(4, 0)],
                    [new Point(1, 3), new Point(3, 0), new Point(2, 1), new Point(1, 1)],
                ]);
            default:
                return new tree_one([
                    [new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(2, 1)],
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 1)],
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(1, 1)],
                    [new Point(0, 1), new Point(1, 0), new Point(1, 1), new Point(1, 2)],
                ]);
        }
    }
    initBoaPiec() {
        this.board = [];
        this.exPiec = [];
        for (let y = 0; y < Game.ROWS; y++) {
            this.board.push([]);
            this.exPiec.push([]);
            for (let x = 0; x < Game.COLUMNS; x++) {
                this.board[y].push({
                    color: Game.EMPTY_COLOR,
                    taken: false,
                });
                this.exPiec[y].push({
                    taken: false,
                    color: Game.EMPTY_COLOR,
                });
            }
        }
    }
    geiforiPoints(point) {
        const absoluteX = point.x + this.globalX;
        const absoluteY = point.y + this.globalY;
        return this.absolutePointOutOfLimits(absoluteX, absoluteY);
    }
    absolutePointOutOfLimits(absoluteX, absoluteY) {
        return absoluteX < 0 || absoluteX > Game.COLUMNS - 1 || absoluteY < 0 || absoluteY > Game.ROWS - 1;
    }
    empooint(x, y) {
        if (!this.exPiec[y]) return true;
        if (!this.exPiec[y][x]) return true;
        if (this.exPiec[y][x].taken) {
            return false;
        } else {
            return true;
        }
    }
    Vail_point(point, points) {
        const emptyPoint = this.empooint(this.globalX + point.x, this.globalY + point.y);
        const hasSameCoordinateOfFigurePoint = points.findIndex(p => {
            return p.x === point.x && p.y === point.y;
        }) !== -1;
        const outOfLimits = this.geiforiPoints(point);
        if ((emptyPoint || hasSameCoordinateOfFigurePoint) && !outOfLimits) {
            return true;
        } else {
            return false;
        }
    }
    fcaRight() {
        if (!this.currentFigure) return false;
        for (const point of this.currentFigure.getPoints()) {
            const newPoint = new Point(point.x + 1, point.y);
            if (!this.Vail_point(newPoint, this.currentFigure.getPoints())) {
                return false;
            }
        }
        return true;
    }
    fcaLeft() {
        if (!this.currentFigure) return false;
        for (const point of this.currentFigure.getPoints()) {
            const newPoint = new Point(point.x - 1, point.y);
            if (!this.Vail_point(newPoint, this.currentFigure.getPoints())) {
                return false;
            }
        }
        return true;
    }
    fcaDown() {
        if (!this.currentFigure) return false;
        for (const point of this.currentFigure.getPoints()) {
            const newPoint = new Point(point.x, point.y + 1);
            if (!this.Vail_point(newPoint, this.currentFigure.getPoints())) {
                return false;
            }
        }
        return true;
    }
    fcaSpin() {
        const newPointsAfterRotate = this.currentFigure.getNextRotation();
        for (const rotatedPoint of newPointsAfterRotate) {
            if (!this.Vail_point(rotatedPoint, this.currentFigure.getPoints())) {
                return false;
            }
        }
        return true;
    }
    Spin() {
        if (!this.fcaSpin()) {
            this.fgoo.denied.currentTime = 0;
            this.fgoo.denied.play();
            return;
        }
        this.currentFigure.points = this.currentFigure.getNextRotation();
        this.currentFigure.incrementRotationIndex();
    }

    async askUserConfirmResetGame() {
        this.pauseGame();
        this.resetGame();
        const result = await Swal.fire({

        });
        if (result.value) {
            this.resetGame();
        } else {
            this.conreGame();
        }
    }

}
class Frospoie {
    static RandomNumInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomColor() {
        return Game.COLORS[Frospoie.RandomNumInRange(0, Game.COLORS.length - 1)];
    }

    static loadSound(src, loop) {
        const sound = document.createElement("audio");
        sound.src = src;
        sound.setAttribute("preload", "auto");
        sound.setAttribute("controls", "none");
        sound.loop = loop || false;
        sound.style.display = "none";
        document.body.appendChild(sound);
        return sound;
    }
}
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class tree_one {
    constructor(rotations) {
        this.rotations = rotations;
        this.rotationIndex = 0;
        this.points = this.rotations[this.rotationIndex];
        const randomColor = Frospoie.getRandomColor();
        this.rotations.forEach(points => {
            points.forEach(point => {
                point.color = randomColor;
            });
        });
        this.incrementRotationIndex();
    }
    getPoints() {
        return this.points;
    }
    incrementRotationIndex() {
        if (this.rotations.length <= 0) {
            this.rotationIndex = 0;
        } else {
            if (this.rotationIndex + 1 >= this.rotations.length) {
                this.rotationIndex = 0;
            } else {
                this.rotationIndex++;
            }
        }
    }
    getNextRotation() {
        return this.rotations[this.rotationIndex];
    }

}
const game = new Game("canvas");
document.querySelector("#reset").addEventListener("click", () => {
    game.askUserConfirmResetGame();
});
