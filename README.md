клиентские правки metabot

оригинальное расширение https://github.com/antibot4navalny/metabot
автор https://twitter.com/antibot4navalny/

***class injectionManager*** - просто запускает таймер, который втыкает какие-то элементы. Нужен, чтобы перезагружать элементы после того, как Твиттер реактивно обновляет интерфейс

***const bots*** - объект, внутри которого методы модификации страницы и массив с ботами
***bots.bots_posts*** - объект, в котором key - это URL конкретного поста, под которым собирается статистика
***bots.bots_posts[key].bots*** - объект со списком всех ботов, которые отвечали под этим сообщением, key - логин
***bots.bots_posts[key].bots[key]*** - массив сообщений, принадлежащих конкретному боту

***Как добавлять ботов и их сообщения?***
bots.bots_posts[URL титульного поста].bots[ник бота].push(URL ответа)

bots.bots_posts при необходимости могу переделать под формат исходных данных, чтобы удобнее было заполнять. Или сделаю функцию, которая будет пересобирать массив.

***bots.showBotsList(url)*** - отобразить окно со списком ботов, принимает параметр url поста
***bots.closeBotsList*** - закрыть окно со списком ботов (полностью)
***bots.collapseBotList*** - свернуть модальное окно и встроить в левую навигационную колонку

Сейчас скрипты, встраивающие элементы со счётчиками ботов в страницу, запускаются в участке 227:239 ('window.addEventListener('load', function () { ...'). В идеале переместить в какое-то одно место, где уже находится подобный функционал
