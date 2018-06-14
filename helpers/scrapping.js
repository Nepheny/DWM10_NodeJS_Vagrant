const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const MongoClient = require('mongodb').MongoClient;
 
module.exports = {
    // To read the ".json" file
    "read": function(fileName) {
        return JSON.parse(fs.readFileSync('data/' + fileName + '.json').toString());
    },

    // To write in the ".json" file
    "write": function(fileName, data) {
        fs.writeFileSync('data/' + fileName + '.json', data);
        return true;
    },

    // To write in 'champions' file
    "champions": {
        "scrap": function (callback) {
            const stream = fs.createWriteStream('data/champions.json', {flags:'a'});
            const options = {
                url: "http://leagueoflegends.wikia.com/wiki/League_of_Legends_Wiki",
                transform: (body) => {
                    return cheerio.load(body);
                }
            }
            rp(options)
                .then(($) => {
                    fs.writeFileSync('data/champions.json', '');
                    stream.write('[');
                    let length = $('.lcs-container #left #tabber .tabbertab:nth-of-type(1) #champion-grid .champion_roster li a').length;
                    $('.lcs-container #left #tabber .tabbertab:nth-of-type(1) #champion-grid .champion_roster li a').each(function(i, el) {
                        stream.write(
                            JSON.stringify({
                                "id": i + 1,
                                "name": $(this).children('img').attr('alt'),
                                "img": ($(this).children('img').attr('data-src')).split('.png')[0] + '.png',
                                "url": (options.url).replace('/wiki/League_of_Legends_Wiki', '') + $(this).attr('href')
                            })
                        );
                        if(i !== length - 1) {
                            stream.write(',');
                        }
                    })
                    stream.write(']');
                    callback();
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        "scrapDB": function (callback) {
            const options = {
                url: "http://leagueoflegends.wikia.com/wiki/League_of_Legends_Wiki",
                transform: (body) => {
                    return cheerio.load(body);
                }
            }
            rp(options)
                .then(($) => {
                    MongoClient.connect('mongodb://localhost:27017', function (err, client) {
                        let db = client.db('lol');
                        $('.lcs-container #left #tabber .tabbertab:nth-of-type(1) #champion-grid .champion_roster li a').each(function(i, el) {
                            let id = i + 1;
                            let name = $(this).children('img').attr('alt');
                            let img = ($(this).children('img').attr('data-src')).split('.png')[0] + '.png';
                            let url = (options.url).replace('/wiki/League_of_Legends_Wiki', '') + $(this).attr('href');

                            db.collection('champions').find({name: name}).toArray(function (err, result) {
                                if(result.length === 0) {
                                    db.collection('champions').insertOne({
                                        "id": id,
                                        "name": name,
                                        "img": img,
                                        "url": url
                                    }, function(err, result) {
                                        console.log(result);
                                    });
                                }
                            });
                        });
                        db.collection('champions').find().toArray(function (err, result) {
                            callback(result);
                        });
                    }); 
                });
        }
    },

    // To load infos from the site
    "champion": {
        "scrap": function (url, callback) {
            const options = {
                url: url,
                transform: (body) => {
                    return cheerio.load(body);
                }
            }
            rp(options)
                .then(($) => {
                    let result = {
                        "name": $('#championName').text(),
                        "desc": $('#champion-container table tbody tr td table tbody tr td span span').text(),
                        "typeImg": $('img[data-image-key="Mage_icon.png"]').attr('src'),
                        "health": $('#Health_Ahri').text(),
                        "healthRegen": $('#HealthRegen_Ahri').text(),
                        "mana": $('#ResourceBar_Ahri').text(),
                        "manaRegen": $('#ResourceRegen_Ahri').text(),
                        "range": $('#Range_Ahri').text(),
                        "atkDmg": $('#AttackDamage_Ahri').text(),
                        "atkSpeed": $('#AttackSpeed_Ahri').text(),
                        "armor": $('#Armor_Ahri').text(),
                        "magicResist": $('#Armor_Ahri').text(),
                        "mvSpeed": $('#MagicResist_Ahri').text()
                    }
                    callback(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}