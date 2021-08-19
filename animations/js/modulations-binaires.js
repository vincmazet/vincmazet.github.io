/*
    MODULATIONS BINAIRES

    Version du 13/07/2015

    Copyright Vincent Mazet (vincent.mazet@unistra.fr) et Frank Schorr, 2015.

    Les programmes Javascript fournis par l'intermédiaire de ces pages
    proposent des illustrations et des divations pédagogiques pour le
    traitement du signal, les communications numériques, etc.

    Ces programmes sont régis par la licence CeCILL-B soumise au droit français
    et respectant les principes de diffusion des logiciels libres. Vous pouvez
    utiliser, modifier et/ou redistribuer ce programme sous les conditions de
    a licence CeCILL-B telle que diffusée par le CEA, le CNRS et l'INRIA sur le
    site www.cecill.info.

    En contrepartie de l'accessibilité au code source et des droits de copie, de
    modification et de redistribution accordés par cette licence, il n'est
    offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
     seule une responsabilité restreinte pèse sur l'auteur du programme, le
     titulaire des droits patrimoniaux et les concédants successifs.

    À cet égard, l'attention de l'utilisateur est attirée sur les risques
    associés au chargement, à l'utilisation, à la modification et/ou au
    développement et à la reproduction du logiciel par l'utilisateur étant donné
    sa spécificité de logiciel libre, qui peut le rendre complexe à manipuler et
    qui le réserve donc à des développeurs et des professionnels avertis
    possédant des connaissances informatiques approfondies. Les utilisateurs
    sont donc invités à charger et tester l'adéquation du logiciel à leurs
    besoins dans des conditions permettant d'assurer la sécurité de leurs
    systèmes et ou de leurs données et, plus généralement, à l'utiliser et
    l'exploiter dans les mêmes conditions de sécurité.

    Le fait que vous puissiez accéder à cet en-tête signifie que vous avez pris
    connaissance de la licence CeCILL-B, et que vous en avez accepté les termes.
*/

// Variables de la séquence binaire
var seq = [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0];             // Séquence binaire
var B = seq.length;                                                     // Nombre de bits

// Variables des modulations
var mods = [ 'NRZ', 'RZ', 'Manchester', 'AMI', 'ASK', 'FSK', 'PSK' ];   // Modulations possibles
var M = 0;                                                              // Nombre de modulations affichées
var idcounter = 0;                                                      // Indice unique des modulations (ne réduit jamais)
var listmod = [];                                                       // Liste des indices des modulations

// Interface
var lw = 150;           // Largeur des listes déroulantes
var cw = 36;            // Largeur des boutons des bits
var bw = 40;            // Largeur d'un bit
var gh = 60;            // Hauteur des graphes
var cs = (bw-cw)/2;     // Espacement entre les contrôles

// Objets
var div,            // div principal
    btnBit = [],    // Boutons des bits
    btnAdd;         // Bouton d'ajout de modulation


// Dessin d'une modulation
function drawMod(divMod)
{
    var n, val, x = [], y = [];

    // Détermine les coordonnées du signal
    switch (divMod.childNodes[0].value) {

        case 'NRZ':
            for(n=0; n<B; n++)
            {
                val = 0.8 * (2*seq[n]-1);
                x.push(n, n+1);
                y.push(val, val);
            };
            break;

        case 'RZ':
            for(n=0; n<B; n++)
            {
                val = 0.8 * (2*seq[n]-1);
                x.push(n, n+.5, n+.5, n+1);
                y.push(val, val, 0, 0);
            };
            break;

        case 'Manchester':
            for(n=0; n<B; n++)
            {
                val = 0.8 * (2*seq[n]-1);
                x.push(n, n+.5, n+.5, n+1);
                y.push(val, val, -val, -val);
            };
            break;

        case 'AMI':
            var tmp = 1;
            for(n=0; n<B; n++)
            {
                if (seq[n] == 0)    { val = 0; }
                else                { val = 0.8*tmp; tmp = -tmp; };
                x.push(n, n+1);
                y.push(val, val);
            };
            break;

        case 'ASK':
            for(n=0; n<B; n++)
            {
                var m, M = 100;
                for(m = 0; m < M; m++)
                {
                    x.push( n+m/M );
                    y.push( (.2 + .6*seq[n]) * Math.sin( 2 * Math.PI * 4 * m/M ) );
                }
            };
            break;

        case 'FSK':
            for(n=0; n<B; n++)
            {
                var m, M = 100;
                for(m = 0; m < M; m++)
                {
                    x.push( n+m/M );
                    y.push( .8 * Math.sin( 2 * Math.PI * (3+2*seq[n]) * m/M ) );
                }
            };
            break;

        case 'PSK':
            for(n=0; n<B; n++)
            {
                var m, M = 100;
                for(m = 0; m < M; m++)
                {
                    x.push( n+m/M );
                    y.push( .8 * Math.sin( 2 * Math.PI * 4 * m/M + seq[n]*Math.PI ) );
                }
            };
            break;

        default:
            for(n=0; n<B+1; n++) { x[n] = n; };
            for(n=0; n<B+1; n++) { y[n] = 0; };
            break;

    }

    // Affiche le signal
    var gphMod = divMod.childNodes[1].getContext('2d');
    gphMod.clear();
    gphMod.strokeStyle = color[1];
    gphMod.grid();
    gphMod.strokeStyle = color[3];
    gphMod.lineWidth = 2;
    gphMod.plot(x,y);
}


/* GESTION DES ÉVÈNEMENTS */

// Clic sur un bit
function bittoggle(i) { return function()
{
    // Modifie la valeur du bit et met à jour le texte du bouton
    seq[i] = 1 - seq[i];
    btnBit[i].innerHTML = seq[i];

    // Redessine les modulations
    var divs = div.getElementsByTagName('div');
    for(var j = 0; j < divs.length; j++)
        drawMod(divs[j]);
};}

// Change une modulation = cela revient à la redessiner
function changeMod(divMod) { return function()
{
    drawMod(divMod);
};}

// Supprime une modulation
function supprMod(no) { return function()
{
    var myelt = document.getElementById(no);

    // Correspond à quel élément (dans l'odre de présentation) ?
    var ind = listmod.indexOf(parseInt(myelt.id));

    // Supprime la modulation
    div.removeChild(myelt);

    // Remonte les suivants
    var pos;
    for(var k=ind+1;k<listmod.length;k++)
    {
        pos = bw + (k-1)*gh + cs;
        document.getElementById(listmod[k]).style.top = pos.toString() + 'px';
    }

    // Bouton d'ajout de Modulation
    var btnAddTop = bw + (M-1)*gh + cs;
    btnAdd.style.top = btnAddTop.toString() + 'px';

    // Nouvel hauteur du div div
    var divHeight = 2*bw + (M-1)*gh;
    div.style.height = divHeight.toString() + 'px';

    // Une modulation de moins
    listmod.splice(ind,1);
    M = M - 1;
};}

// Ajoute une modulation
function addMod()
{
    // Nouvel hauteur du div
    var divHeight = 2*bw + (M+1)*gh;
    div.style.height = divHeight.toString() + 'px';

    // div de la modulation
    var divLeft   = 0,
        divTop    = bw + M*gh + cs,
        divWidth  = lw + (B+1)*bw,
        divHeight = gh - 2*cs;
    var divMod = document.createElement('div');
    divMod.style.position = 'absolute';
    divMod.style.left   = divLeft.toString() + 'px';
    divMod.style.top    = divTop.toString() + 'px';
    divMod.style.width  = divWidth.toString() + 'px';
    divMod.style.height = divHeight.toString() + 'px';
    divMod.id = idcounter;
    div.appendChild(divMod);

    // Nom
    var selMod = Select(divMod, 0, 0, lw-cs, mods, changeMod(divMod));
    var pos = (gh-selMod.offsetHeight) / 2
    selMod.style.top = pos.toString() + 'px';

    // Graphe
    gphMod = Graph(divMod, lw, 0, B*bw, gh-2*cs);
    gphMod.xlim = [0, B];
    gphMod.ylim = [-1, 1];

    // Bouton de suppression
    btnMod = Button(divMod, symbClear, lw+B*bw+2*cs, (gh-cw)/2, cw, cw, 'Supprimer', supprMod(idcounter));

    // Bouton d'ajout de Modulation
    var btnAddTop = bw + (M+1)*gh + cs;
    btnAdd.style.top = btnAddTop.toString() + 'px';

    // Dessine les modulations
    drawMod(divMod);

    // Un objet de plus
    listmod.push(idcounter);
    idcounter = idcounter + 1;
    M = M + 1;
}


/* INITIALISATION */

function init()
{
    // Initialisation du div
    div = inidiv('modulations-numeriques', lw + (B+1)*bw, 2*bw + gh);

    // Boutons de la séquence binaire
    for (i = 0; i < B; i++)
        btnBit[i] = Button(div, seq[i], lw+i*bw+cs, cs, cw, cw, '', bittoggle(i));

    // Bouton d'ajout de modulation
    btnAdd = Button(div, 'Ajouter une modulation', lw, bw+M*gh+cs, 6*bw, cw, 'Ajouter une modulation', addMod);

    // Div modulations (avec nom, graphe et bouton)
    for (i = 0; i < 1; i++)
        addMod();
}


/* ÉXÉCUTION AU CHARGEMENT DE LA PAGE */

window.onload = function () { init(); };