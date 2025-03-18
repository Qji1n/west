import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';
import card from "./Card.js";


class Creature extends Card {
    constructor(name, maxPower) {
        super(name, maxPower);
    }

    getDescriptions(card){
        return [getCreatureDescription(card),
            ...super.getDescriptions()];
    }
}

class Duck extends Creature {
    constructor() {
        super("Мирная утка", 2);
    }

    quacks() {
        console.log('quack');
    }

    swims() {
        console.log('float: both;');
    }
}

class Dog extends Creature {
    constructor() {
        super("Пес бандит", 2);
    }
}

class Trasher extends Dog {
    constructor() {
        super();
        this.name = "Громила";
        this.maxPower = 5;
        this.currentPower = 5;
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation){
        this.view.signalAbility(() => continuation(value - 1));
    }

    getDescriptions() {
        return ["Уменьшение входящего урона на 1",
            ...super.getDescriptions()];
    }
}

class Gatling extends Creature {
    constructor() {
        super("Гатлинг", 6);
    }

    attack(gameContext, continuation) {

        const oppositeCards = gameContext.oppositePlayer.table;

        if (oppositeCards.length > 0) {
            for (const oppositeCard of oppositeCards) {
                super.dealDamageToCreature(2, oppositeCard, gameContext);
                setTimeout(1)
            }
        }
    }
}


// Отвечает является ли карта уткой.
function isDuck(card) {
    console.log(card && card.quacks && card.swims);
    return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    console.log(card instanceof Dog);
    return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}


// Колода Шерифа, нижнего игрока.
const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Gatling(),
];

// Колода Бандита, верхнего игрока.
const banditStartDeck = [
    new Trasher(),
    new Dog(),
    new Dog(),
];


// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});


