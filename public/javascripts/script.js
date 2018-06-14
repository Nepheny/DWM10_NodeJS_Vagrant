document.querySelector('button[data-action="scrap"]').addEventListener('click', function () {
    let xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            location.reload();
        }
    }
    xhttp.open("GET", '/champions/list', true);
    xhttp.send();
});

document.querySelector('main').addEventListener('click', function (el) {
    if(el.target.nodeName == 'BUTTON') {
        let url = el.target.dataset.url;
        let xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                const container = document.querySelector('#modal')
                container.classList.remove('modal-hide');
                container.classList.add('modal-show');

                const renderName = document.querySelector('.name');
                const renderDesc = document.querySelector('.desc');
                const renderTypeImg = document.querySelector('.typeImg');
                const renderHealth = document.querySelector('.health');
                const renderHealthRegen = document.querySelector('.health-regen');
                const renderMana = document.querySelector('.mana');
                const renderManaRegen = document.querySelector('.mana-regen');
                const renderRange = document.querySelector('.range');
                const renderAtkDmg = document.querySelector('.atk-dmg');
                const renderAtkSpeed = document.querySelector('.atk-speed');
                const renderArmor = document.querySelector('.armor');
                const renderMagicResist = document.querySelector('.magic-resist');
                const renderMvSpeed = document.querySelector('.mv-speed');
                //const renderPassive = document.querySelector('.passive');
                //const renderASpell = document.querySelector('.a-spell');
                //const renderZSpell = document.querySelector('.z-spell');
                //const renderESpell = document.querySelector('.e-spell');
                //const renderRSpell = document.querySelector('.r-spell');

                const result = JSON.parse(this.response);
                renderName.innerHTML = result.name;
                renderDesc.innerHTML = result.desc;
                renderTypeImg.src = result.typeImg;
                renderHealth.innerHTML = result.health;
                renderHealthRegen.innerHTML = result.healthRegen;
                renderMana.innerHTML = result.mana;
                renderManaRegen.innerHTML = result.manaRegen;
                renderRange.innerHTML = result.range;
                renderAtkDmg.innerHTML = result.atkDmg;
                renderAtkSpeed.innerHTML = result.atkSpeed;
                renderArmor.innerHTML = result.armor;
                renderMagicResist.innerHTML = result.magicResist;
                renderMvSpeed.innerHTML = result.mvSpeed;
                //renderPassive.innerHTML = result.passive;
                //renderASpell.innerHTML = result.aSpell;
                //renderZSpell.innerHTML = result.zSpell;
                //renderESpell.innerHTML = result.eSpell;
                //renderRSpell.innerHTML = result.rSpell;
            }
        }
        xhttp.open("POST", "/champion/scrap", true);
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(JSON.stringify({
            "url": url
        }));
    }
});

document.querySelector('#modal').addEventListener('click', function () {
    const container = document.querySelector('#modal')
    const div = document.querySelector('.modal-container');
    div.innerHTML = "";
    container.classList.remove('modal-show');
    container.classList.add('modal-hide');
});