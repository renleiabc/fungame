$(document).ready(function () {
    //(function() {

    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch (err) {
    }
    ;

    var PLAYER = 1,
        LASER = 2,
        ALIEN = 4,
        ALIEN_BOMB = 8,
        SHIELD = 16,
        SAUCER = 32,
        TOP_OF_SCREEN = 64,
        TANK_Y = 352 - 16,
        SHIELD_Y = TANK_Y - 56,
        SCREEN_WIDTH = 480,
        SCREEN_HEIGHT = 384,
        ALIEN_COLUMNS = 11,
        ALIEN_ROWS = 5,
        SYS_process,
        SYS_collisionManager,
        SYS_timeInfo,
        SYS_spriteParams = {
            width: 32,
            height: 32,
            imagesWidth: 256,
            images: './static/images/common/invaders.png',
            $drawTarget: $('#draw-target')
        };

// process
    var processor = function () {
        var processList = [],
            addedItems = [];
        return {
            add: function (process) {
                addedItems.push(process);
            },
            process: function () {
                var newProcessList = [],
                    len = processList.length;
                for (var i = 0; i < len; i++) {
                    if (!processList[i].removed) {
                        processList[i].move();
                        newProcessList.push(processList[i]);
                    }
                }
                processList = newProcessList.concat(addedItems);
                addedItems = [];
            }
        };
    };

// collision manager
    var collisionManager = function () {
        var listIndex = 0,
            checkListIndex = 0,
            grid = [],
            checkList = {},
            gridWidth = 15,
            gridHeight = 12;
        for (var i = 0; i < gridWidth * gridHeight; i++) {
            grid.push({});
        }
        var getGridList = function (x, y) {
            var idx = (Math.floor(y / 32) * gridWidth) + Math.floor(x / 32);
            if (grid[idx] === undefined) {
                return;
            }
            return grid[idx];
        };
        return {
            newCollider: function (colliderFlag, collideeFlags, width, height, callback) {
                var list, indexStr = '' + listIndex++,
                    checkIndex;
                var colliderObj = {
                    halfWidth: width / 2,
                    halfHeight: height / 2,
                    centerX: 0,
                    centerY: 0,
                    colliderFlag: colliderFlag,
                    collideeFlags: collideeFlags,
                    update: function (x, y) {
                        colliderObj.centerX = x + 16;
                        colliderObj.centerY = y + 32 - colliderObj.halfHeight;
                        if (list) {
                            delete list[indexStr];
                        }
                        list = getGridList(colliderObj.centerX, colliderObj.centerY);
                        if (list) {
                            list[indexStr] = colliderObj;
                        }
                    },
                    remove: function () {
                        if (collideeFlags) {
                            delete checkList[checkIndex];
                        }
                        if (list) { // list could be undefined if item was off-screen
                            delete list[indexStr];
                        }
                    },
                    callback: function () {
                        callback();
                    },
                    checkCollisions: function (offsetX, offsetY) {
                        var list = getGridList(colliderObj.centerX + offsetX,
                            colliderObj.centerY + offsetY);
                        if (!list) {
                            return;
                        }
                        var idx, collideeObj;
                        for (idx in list) {
                            if (list.hasOwnProperty(idx) &&
                                idx !== indexStr &&
                                (colliderObj.collideeFlags & list[idx].colliderFlag)) {
                                collideeObj = list[idx];
                                if (Math.abs(colliderObj.centerX - collideeObj.centerX) >
                                    (colliderObj.halfWidth + collideeObj.halfWidth)) {
                                    continue;
                                }
                                if (Math.abs(colliderObj.centerY - collideeObj.centerY) >
                                    (colliderObj.halfHeight + collideeObj.halfHeight)) {
                                    continue;
                                }
                                collideeObj.callback(colliderObj.colliderFlag);
                                callback(collideeObj.colliderFlag);
                                return true;
                            }
                        }
                        return false;
                    }
                };
                if (collideeFlags) {
                    checkIndex = '' + checkListIndex++;
                    checkList[checkIndex] = colliderObj;

                }
                return colliderObj;
            },
            checkCollisions: function () {
                var idx, colliderObj;
                for (idx in checkList) {
                    if (checkList.hasOwnProperty(idx)) {
                        colliderObj = checkList[idx];

                        for (var y = -32; y <= 32; y += 32) {
                            for (var x = -32; x <= 32; x += 32) {
                                if (colliderObj.checkCollisions(x, y)) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        };
    };

    var DHTMLSprite = function (params) {
        var width = params.width,
            height = params.height,
            imagesWidth = params.imagesWidth,
            $element = params.$drawTarget.append('<div/>').find(':last'),
            elemStyle = $element[0].style,
            mathFloor = Math.floor;
        $element.css({
            position: 'absolute', left: -9999, /*********************/
            width: width,
            height: height,
            backgroundImage: 'url(' + params.images + ')'
        });
        var that = {
            draw: function (x, y) {
                elemStyle.left = x + 'px';
                elemStyle.top = y + 'px';
            },
            changeImage: function (index) {
                index *= width;
                var vOffset = -mathFloor(index / imagesWidth) * height;
                var hOffset = -index % imagesWidth;
                elemStyle.backgroundPosition = hOffset + 'px ' + vOffset + 'px';
            },
            show: function () {
                elemStyle.display = 'block';
            },
            hide: function () {
                elemStyle.display = 'none';
            },
            destroy: function () {
                $element.remove();
            }
        };
        return that;
    };

    var timeInfo = function (goalFPS) {
        var oldTime, paused = true,
            iterCount = 0,
            totalFPS = 0,
            totalCoeff = 0;
        return {
            getInfo: function () {

                if (paused === true) {
                    paused = false;
                    oldTime = +new Date();
                    return {
                        elapsed: 0,
                        coeff: 0,
                        FPS: 0,
                        averageFPS: 0
                    };
                }

                var newTime = +new Date();
                var elapsed = newTime - oldTime;
                oldTime = newTime;
                var FPS = 1000 / elapsed;
                iterCount++;
                totalFPS += FPS;

                var coeff = goalFPS / FPS;
                totalCoeff += coeff;


                return {
                    elapsed: elapsed,
                    coeff: coeff,
                    FPS: FPS,
                    averageFPS: totalFPS / iterCount,
                    averageCoeff: totalCoeff / iterCount
                };
            },
            pause: function () {
                paused = true;
            }
        };
    };

// Key input.
    var keys = function () {
        var keyMap = {
                '65': 'left',
                '68': 'right',
                '77': 'fire'
            },
            kInfo = {
                'left': 0,
                'right': 0,
                'fire': 0
            },
            key;
        $(document).bind('keydown keyup', function (event) {
            key = '' + event.which;
            console.log(event.which);
            if (keyMap[key] !== undefined) {
                kInfo[keyMap[key]] = event.type === 'keydown' ? 1 : 0;
                return false;
            }
        });
        return kInfo;
    }();

// Animation effect.
    var animEffect = function (x, y, imageList, timeout) {
        var imageIndex = 0,
            that = DHTMLSprite(SYS_spriteParams);
        setTimeout(function () {
            that.removed = true;
            that.destroy();
        }, timeout);
        that.move = function () {
            that.changeImage(imageList[imageIndex]);
            imageIndex++;
            if (imageIndex === imageList.length) {
                imageIndex = 0;
            }
            that.draw(x, y);
        };
        SYS_process.add(that);
    };

// Alien.
    var alien = function (x, y, frame, points, hitCallback) {

        var animFlag = 0,
            that = DHTMLSprite(SYS_spriteParams),
            collider, collisionWidth = 16;
        that.canFire = false;

        that.remove = function (colliderFlag) {
            if (colliderFlag & SHIELD) {
                return;
            }
            animEffect(x, y, [8], 250);
            that.destroy();
            collider.remove();
            that.removed = true;
            hitCallback(points);

        };
        if (frame === 2) {
            collisionWidth = 22;
        }
        else if (frame === 4) {
            collisionWidth = 25;
        }
        collider = SYS_collisionManager.newCollider(ALIEN, 0, collisionWidth, 16, that.remove);
        collider.update(x, y);

        that.move = function (dx, dy) {
            that.changeImage(frame + animFlag);
            animFlag ^= 1;
            x += dx;
            y += dy;

            if (!collider.collideeFlags && y >= SHIELD_Y - 16) {
                collider.remove();
                collider = SYS_collisionManager.newCollider(ALIEN, SHIELD, collisionWidth, 16, that.remove);
            }
            collider.update(x, y);
            that.draw(x, y);
            if ((dx > 0 && x >= SCREEN_WIDTH - 32 - 16) || (dx < 0 && x <= 16)) {
                return true;
            }

            return false;
        };
        that.getXY = function () {
            return {
                x: x,
                y: y
            };
        };
        return that;
    };
    // aliens
    var aliensManager = function (gameCallback, startY) {
        var aliensTable = [],
            aliensFireList = [],
            paused = false,
            moveIndex, dx = 4,
            dy = 0,
            images = [0, 2, 2, 4, 4],
            changeDir = false,
            waitFire = false,
            scores = [40, 20, 20, 10, 10],
            that,
            hitFunc = function (points) {
                if (!paused) {
                    that.pauseAliens(150);
                }
                gameCallback({
                    message: 'alienKilled',
                    score: points
                });

            };
        for (var y = 0; y < ALIEN_ROWS; y++) {

            for (var x = 0; x < ALIEN_COLUMNS; x++) {
                var anAlien = alien((x * 32) + 16, (y * 32) + startY,
                    images[y], scores[y], hitFunc);
                aliensTable.push(anAlien);
                if (y == ALIEN_ROWS - 1) {
                    aliensTable[aliensTable.length - 1].canFire = true;
                }
            }
        }
        moveIndex = aliensTable.length - 1;
        that = {
            pauseAliens: function (pauseTime) {
                paused = true;
                setTimeout(function () {
                    paused = false;
                }, pauseTime);
            },
            move: function () {

                if (paused) {
                    return;
                }
                if (!aliensTable.length) {
                    that.removed = true;
                    gameCallback({
                        message: 'allAliensKilled'
                    });
                    return;
                }
                var anAlien = aliensTable[moveIndex];

                if (anAlien.removed) {
                    for (var i = aliensTable.length - 1; i >= 0; i--) {
                        if (aliensTable[i].getXY().x === anAlien.getXY().x &&
                            i !== moveIndex) {
                            if (i < moveIndex) {
                                aliensTable[i].canFire = true;
                            }
                            break;
                        }
                    }
                    aliensTable.splice(moveIndex, 1);
                    moveIndex--;
                    if (moveIndex === -1) {
                        moveIndex = aliensTable.length - 1;
                    }


                    return;
                }

                if (anAlien.canFire) {
                    aliensFireList.push(anAlien);
                }
                var dx2 = dy ? 0 : dx;
                if (anAlien.move(dx2, dy)) {
                    changeDir = true;
                }

                if (anAlien.getXY().y >= TANK_Y) {
                    gameCallback({
                        message: 'aliensAtBottom'
                    });
                    return;
                }
                moveIndex--;
                if (moveIndex === -1) {
                    moveIndex = aliensTable.length - 1;
                    dy = 0;
                    var coeff = SYS_timeInfo.averageCoeff;
                    dx = 4 * (dx < 0 ? -coeff : coeff);
                    if (changeDir === true) {
                        dx = -dx;
                        changeDir = false;
                        dy = 16;
                    }
                    if (!waitFire) {
                        var fireAlien = aliensFireList[Math.floor(Math.random() *
                            (aliensFireList.length))];
                        var xy = fireAlien.getXY();
                        alienBomb(xy.x, xy.y, function () {
                            waitFire = false;
                        });
                        //setTimeout(function(){waitFire = false;},500);
                        aliensFireList = [];
                        waitFire = true;
                    }
                }
            }
        };
        SYS_process.add(that);
        return that;
    };

// Player bomb.
    var laser = function (x, y, callback) {
        var that = DHTMLSprite(SYS_spriteParams);
        that.remove = function (collideeFlags) {
            if (collideeFlags & (TOP_OF_SCREEN + SHIELD + ALIEN_BOMB)) {
                animEffect(x, y, [18], 250);
            }
            that.destroy();
            collider.remove();
            that.removed = true;
            setTimeout(callback, 200);
        };

        var collider = SYS_collisionManager.newCollider(LASER, ALIEN + ALIEN_BOMB + SHIELD + SAUCER, 2, 10, that.remove);
        that.changeImage(7);
        that.move = function () {
            //if(that.removed) {return};
            y -= 7 * SYS_timeInfo.coeff;
            that.draw(x, y);
            collider.update(x, y);
            if (y <= -8) {
                that.remove(TOP_OF_SCREEN);
            }
        };
        SYS_process.add(that);
    };

// Alien bomb.
    var alienBomb = function (x, y, removedCallback) {
        var that = DHTMLSprite(SYS_spriteParams),
            collider;
        that.changeImage(19);

        that.remove = function () {
            animEffect(x, y + 8, [18], 250);
            that.destroy();
            collider.remove();
            that.removed = true;
            removedCallback();
        };
        collider = SYS_collisionManager.newCollider(ALIEN_BOMB, SHIELD,
            6, 12, that.remove);

        that.move = function () {
            y += 3.5 * SYS_timeInfo.coeff;
            that.draw(x, y);
            collider.update(x, y);
            if (y >= TANK_Y) {
                that.remove();
            }
        };
        SYS_process.add(that);
    };

// tank
    var tank = function (gameCallback) {
        var x = ((SCREEN_WIDTH / 2) - 160),
            canFire = true,
            collider,
            waitFireRelease = true,
            that = DHTMLSprite(SYS_spriteParams);
        that.changeImage(6);
        that.draw(x, TANK_Y);
        that.canFire = function () {
            canFire = true;
        };
        that.move = function () {
            var dx = keys.left ? -2 : 0;
            dx = keys.right ? 2 : dx;
            x += dx * SYS_timeInfo.coeff;
            if (dx > 0 && x >= (SCREEN_WIDTH / 2) + 168) {
                x = (SCREEN_WIDTH / 2) + 168;
            }
            if (dx < 0 && x <= (SCREEN_WIDTH / 2) - 200) {
                x = (SCREEN_WIDTH / 2) - 200;
            }
            that.draw(x, TANK_Y);
            collider.update(x, TANK_Y);
            if (canFire) {
                if (keys.fire) {
                    if (!waitFireRelease) {
                        laser(x, TANK_Y + 8, function () {
                            canFire = true;
                        });
                        canFire = false;
                        waitFireRelease = true;
                    }
                } else {
                    waitFireRelease = false;
                }
            }
        };
        that.hit = function () {
            collider.remove();
            that.destroy();  //hidden = true;
            that.removed = true;
            animEffect(x, TANK_Y, [8], 250);
            gameCallback({
                message: 'playerKilled'
            });
        };

        collider = SYS_collisionManager.newCollider(PLAYER, ALIEN_BOMB, 30, 12, that.hit);
        SYS_process.add(that);
    };

// Shield.
    var shield = function (x, y) {
        var shieldBrick = function (x, y, image) {
                var that = DHTMLSprite(SYS_spriteParams),
                    collider,
                    hit = function () {
                        that.destroy();
                        collider.remove();
                    };
                collider = SYS_collisionManager.newCollider(SHIELD, 0, 4, 8, hit);
                that.removed = false;
                that.changeImage(image);
                that.draw(x, y);
                collider.update(x, y);
            },
            brickLayout = [
                1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5,
                3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
                3, 3, 3, 6, 7, 0, 0, 8, 9, 3, 3, 3,
                3, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3];
        for (var i = 0; i < brickLayout.length; i++) {
            if (brickLayout[i]) {
                shieldBrick(x + ((i % 12) * 4), y +
                    (Math.floor(i / 12) * 8),
                    brickLayout[i] + 8);
            }
        }
    };

// Saucer.
    var saucer = function (gameCallback) {
        var dx = (Math.floor(Math.random() * 2) * 2) - 1,
            x = 0;
        dx *= 1.25;
        if (dx < 0) {
            x = SCREEN_WIDTH - 32;
        }

        var that = DHTMLSprite(SYS_spriteParams);
        that.changeImage(20);

        var remove = function () {
            that.destroy();
            collider.remove();
            that.removed = true;
        };

        var hit = function () {
            remove();
            gameCallback({
                message: 'saucerHit',
                x: x,
                y: 32
            });
        };

        var collider = SYS_collisionManager.newCollider(SAUCER, 0, 32, 14, hit);

        that.move = function () {
            that.draw(x, 32);
            collider.update(x, 32);
            x += dx;
            if (x < 0 || x > SCREEN_WIDTH - 32) {
                remove();
            }
        };
        SYS_process.add(that);
    };

// Game.
    var game = function () {
        var time,
            aliens,
            gameState = 'titleScreen',
            aliensStartY,
            lives,
            score = 0,
            highScore = 0,
            extraLifeScore = 0,
            saucerTimeout = 0,
            newTankTimeout,
            newWaveTimeout,
            gameOverFlag = false,
            startText =
                '<div class="message">' +
                '<h1>太空入侵者</h1>' +
                '<p>按M键可以开始游戏</p>' +
                '<p>A键——向左移动</p>' +
                '<p>D键——向右移动</p>' +
                '<p>M键——开火</p>' +
                '<p>得分超过5000分，额外送一辆坦克</p>' +
                '</div>',

            initShields = function () {
                for (var x = 0; x < 4; x++) {
                    shield((SCREEN_WIDTH / 2) - 192 + 12 + (x * 96), SHIELD_Y);
                }
            },

            updateScores = function () {
                if (score - extraLifeScore >= 5000) {
                    extraLifeScore += 5000;
                    lives++;
                }
                if (!$('#score').length) {
                    $("#draw-target").append('<div id="score"></div><div id="lives"></div><div id="highScore"></div>');
                }
                if (score > highScore) {
                    highScore = score;
                }
                $('#score').text('SCORE: ' + score);
                $('#highScore').text('HIGH: ' + highScore);
                $('#lives').text('LIVES: ' + lives);
            },

            newSaucer = function () {
                clearTimeout(saucerTimeout);
                saucerTimeout = setTimeout(function () {
                    saucer(gameCallback);
                    newSaucer();
                }, (Math.random() * 5000) + 15000);
            },

            init = function () {
                $("#draw-target").children().remove();
                SYS_process = processor();
                SYS_collisionManager = collisionManager();
                aliens = aliensManager(gameCallback, aliensStartY);
                setTimeout(function () {
                    tank(gameCallback);
                }, 2000);
                initShields();
                newSaucer();
                updateScores();
            },

            gameOver = function () {
                gameOverFlag = true;
                clearTimeout(newTankTimeout);
                clearTimeout(newWaveTimeout);
                clearTimeout(saucerTimeout);

                setTimeout(function () {
                    $("#draw-target").children().remove();
                    $("#draw-target").append('<div class="message">' +
                        '<p>*** 游戏结束 ***</p></div>' + startText);
                    gameState = 'titleScreen';
                }, 2000);
            },

            gameCallback = function (messageObj) {
                if (gameOverFlag) {
                    return;
                }
                switch (messageObj.message) {

                    case 'alienKilled':
                        score += messageObj.score;
                        updateScores();
                        break;

                    case 'saucerHit':
                        var pts = Math.floor((Math.random() * 3) + 1);
                        score += pts * 50;
                        updateScores();
                        animEffect(messageObj.x, messageObj.y, [pts + 20], 500);
                        break;

                    case 'playerKilled':
                        aliens.pauseAliens(2500);
                        lives--;
                        updateScores();
                        if (!lives) {
                            gameOver();
                        } else {
                            newTankTimeout = setTimeout(function () {

                                tank(gameCallback);
                            }, 2000);
                        }
                        break;

                    case 'allAliensKilled':
                        if (aliensStartY < 160) {
                            aliensStartY += 32;
                        }
                        newWaveTimeout = setTimeout(function () {
                            init();
                        }, 2000);
                        break;

                    case 'aliensAtBottom':
                        gameOver();
                        break;
                }
            },

            gameLoop = function () {
                switch (gameState) {
                    case 'playing':
                        SYS_timeInfo = time.getInfo();
                        SYS_process.process();
                        SYS_collisionManager.checkCollisions();
                        break;

                    case 'titleScreen':
                        if (keys.fire) {
                            gameOverFlag = false;
                            time = timeInfo(60);
                            keys.fire = 0;
                            lives = 3;
                            score = 0;
                            extraLifeScore = 0;
                            aliensStartY = 64;
                            gameState = 'playing';
                            init();
                        }
                }
                setTimeout(gameLoop, 15);
            };

        $("#draw-target").append(startText);
        gameLoop();
    }();


    //       })();
});