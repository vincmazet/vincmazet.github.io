/*
    CODE DE HUFFMAN
    
    Version du 18/02/2015
    
    Copyright Vincent Mazet (vincent.mazet@unistra.fr) et Frank Schorr, 2015.

    Les programmes Javascript fournis par l'intermédiaire de ces pages
    proposent des illustrations et des animations pédagogiques pour le
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


// Objets
var anim,       // Div Animation
    lblProba,   // Étiquette
    txtProba,   // Texte (valeur des probabilités)
    btnDraw,    // Bouton d'affichage
    ctx,        // Contexte du canvas du dessin de l'arbre
    lblc = [],  // Étiquettes des codes
    lbls = [],  // Étiquettes des symboles
    lblp = [];  // Étiquettes des probabilités

// Interface
var bdw = 150;  // Largeur du bouton
var bdh = 30;   // Hauteur du bouton
var cW  = 60;   // Largeur des codes
var sW  = 30;   // Largeur des symboles
var pW  = 30;   // Largeur des probabilités
var W   = 100;  // Largeur d'une étape du codage
var H   = 50;   // Hauteur des symboles
var sep = 20;   // Séparateur


/* DÉFINIT LES PROBABILITÉS EN FONCTION DES VALEURS DONNÉES PAR L'UTILISATEUR */

function readProbas()
{
    var str, arr, i, p, probas = [];
    str = txtProba.value;               // Récupère la chaîne de caractères
    str = str.replace(",", ".");        // Remplace les "," par des "."
    str = str.split(" ");               // Découpe en morceaux séparés par des espaces
    for(i=0; i<str.length; i++)
    {
        // Ajoute à la liste des probabilités si c'est un nombre strictement positif
        p = parseFloat(str[i]);
        if (p>0)
            probas.push(p);
    }
    return probas;
}


/* CALCUL DU CODE DE HUFFMAN */

function huffman(p)
{   
    var i, j;
    var tab = [], deb = [], ordre = [];
    var M = p.length;   // Nombre de symboles
    var h = [];
	
    // slice() permet de faire une copie superficielle 
    var probas = p.slice();
    
    // Construit l'arbre de Huffman (M-1 étapes)
    for(i=0; i<M-1; i++)
    {
        probas = probas.slice();
        
        // deb est le tableau allant de 0 à N-1 symboles restants
        deb.length = M-i;
        for (j=0; j<M-i; j++)
            deb[j] = j;
        
        // Tri des N symboles en fonction de leur probabilités
        ordre = sorting(probas, deb.slice(), 'descending');
        
        // Fusionner des deux probabilités les plus faibles
        probas = fusion(probas.slice());
        
        h[i] = { symb: ordre, prob: probas };  
    }
    
    // Codage de Huffman à partir de l'arbre
    h.code = coding(h);
    h.probas = p;
    
    return h;
}


/* TRI DES ÉLÉMENTS D'UN TABLEAU EN FONCTION D'UN AUTRE TABLEAU */

function sorting(tab1, tab2, ord)
{
    //  Entrées : tableaux tab1 et tab2
    //  Sortie : tab2 trié en fonction de tab1
    var i, j, k;

    // Parcourt tab1 de 0 a N-2
    for(i=0; i<tab1.length-1; i++)
    {
        k = i;

        // Recherche du min (si ord='ascending') ou du max (si ord='descending')
        for(j=i+1; j<tab1.length; j++)
        {
            if (ord == "ascending")
                k = (tab1[j]<tab1[k]) ? j : k;
            else
                k = (tab1[j]>tab1[k]) ? j : k;
        }

        // Échange
        if (k != i)
        {
            swap(tab1, i, k);
            swap(tab2, i, k);
        }
    }

    return tab2;
}


/* ÉCHANGE DE DEUX ÉLÉMENTS D'UN TABLEAU */

function swap(tab, i, j)
{
    //  Entrées : tableau et indices des éléments à échanger
    var tmp = tab[i];
    tab[i] = tab[j];
    tab[j] = tmp;
}


/* FUSION DES DEUX PROBABILITÉS LES PLUS PETITES */

function fusion(tab)
{    
    //   Entrée : tableau des probabilités de longueur N triées dans l'ordre décroissant
    //   Sortie : tableau des probabilités de longueur N-1 avec les deux plus petites probabilités additionnées
    
    // NB :
    // pop() renvoie le dernier élement du tableau et le supprime de celui-ci
    // push() ajoute un élément a la fin du tableau
    var p1 = parseFloat(tab.pop());
    var p2 = parseFloat(tab.pop());
    var p = p1 + p2;
    tab.push(parseFloat(p.toPrecision(3)));
    return tab;
}


/* GÉNÉRATION DU CODE DE HUFFMAN */

function coding(tab)
{
    //   Entrée : tableau de type huff
    //   Sortie : tableau contenant les codes
    var i, j, code = [''];
    var M = tab.length;

    // On parcourt les étapes de l'arbre de Huffman
    for(i=M-1; i>=0; i--)
    {
        j = tab.length-i;

        // Ajout d'un nouveau code identique au dernier (après tri du tableau)
        code.push( code[j-1] );

        // Ajout d'un 0 à l'avant dernier code et d'un 1 au dernier
        code[j-1] += '0';
        code[j]   += '1';

        // Tri les codes en fonction de la dernière fusion
        // si un code est une fusion alors on le duppliquera 
        // puis on lui rajoutera 1 ou 0
        code = sorting(tab[i].symb.slice(), code, 'ascending');
    }

    return code;
}


/* MISE À JOUR DE L'INTERFACE */

function interface(h)
{
    var pos, m, t, M, N;
    
    // TODO: faire une fonction du type : btnDraw.left = pos;
    
    // Ancienne et nouvelle valeur de M
    N = (typeof(lblc[0]) != "undefined") ? lblc.length : 0;
    M = h.length + 1;

    // Dimension du div
    pos = cW + sW + pW + Math.max(M-1,3)*W;
    anim.style.width = pos.toString() + 'px';
    pos = bdh + sep + M*H;
    anim.style.height = pos.toString() + 'px';
    
    // Positionnement du texte
    pos = anim.offsetWidth - lblProba.offsetWidth - bdw - 2*sep;
    txtProba.style.width = pos.toString() + 'px';
    
    // Positionnement du bouton
    pos = anim.offsetWidth - bdw;
    btnDraw.style.left = pos.toString() + 'px';

    // Taille du canvas
    pos = (M-1)*W;
    ctx.canvas.width = pos;
    ctx.canvas.style.width = pos.toString() + 'px';
    pos = M*H;
    ctx.canvas.height = pos;
    ctx.canvas.style.height = pos.toString() + 'px';
    
    // Efface le canvas
    ctx.clear();
    
    // Paramètres de dessin du canvas
    ctx.strokeStyle = '#404040';
    ctx.fillStyle = '#404040';
    ctx.lineWidth = 1.5;
    
    // Met à jour les étiquettes existantes
    for(m=0; m<Math.min(M,N); m++)
    {
        lblc[m].innerHTML = h.code[m];
        lblp[m].innerHTML = h.probas[m];
    }

    // Supprime les éventuelles étiquettes en trop
    for(m=M; m<N; m++)
    {
        /*lblc[m].remove();
        lbls[m].remove();
        lblp[m].remove();*/
        lblc[m].parentNode.removeChild(lblc[m]);
        lbls[m].parentNode.removeChild(lbls[m]);
        lblp[m].parentNode.removeChild(lblp[m]);
    }
    lblc.splice(M, N-M);
    lbls.splice(M, N-M);
    lblp.splice(M, N-M);
    
    // Créé d'éventuelles étiquettes supplémentaires
    for(m=N; m<M; m++)
    {   
        // Codes
        lblc.push( Label(anim, h.code[m], 0, 0) );
        pos = (H-lblc[m].offsetHeight) / 2 + bdh + sep + m*H
        lblc[m].style.top = pos.toString() + 'px';
    
        // Symboles
        lbls.push( Label(anim, '\\(S_{' + (m+1) + '}\\)', cW, 0) );
        pos = (H-lbls[m].offsetHeight) / 2 + bdh + sep + m*H
        lbls[m].style.top = pos.toString() + 'px';
    
        // Probabilités
        lblp.push( Label(anim, h.probas[m], cW+sW, 0) );
        pos = (H-lblp[m].offsetHeight) / 2 + bdh + sep + m*H
        lblp[m].style.top = pos.toString() + 'px';
    }
}


/* DESSIN DE L'ARBRE */

function draw(h)
{
    var i, j, delta;
        
    // M-1 étapes divisées en deux parties : tri puis fusion
    for(i=0; i<h.length; i++)
    {
        // Étape de tri
        for(j=0; j<h[i].symb.length; j++)
        {
            // Cas particulier des fusions
            if ((h[i].symb[j] == h[i].symb.length - 1) && (i > 0))
                delta = 1;
            else
                delta = .5;

            // Trace une ligne depuis la coordonée en Y du tableau symb vers la coordonnée en Y du tableau début
            ctx.beginPath();
            ctx.moveTo(i*W, (h[i].symb[j]+delta)*H);
            ctx.lineTo((i+0.5)*W, (j+.5)*H);
            ctx.stroke();
        }

        // Étape de fusion : cas des symboles non fusionnés (trait droit vers l'étape suivante)
        for(j = 0; j < h[i].symb.length - 2;j++)
        {   
            ctx.beginPath();
            ctx.moveTo((i+.5)*W, (j+.5)*H);
            ctx.lineTo((i+1)*W, (j+.5)*H);
            ctx.stroke();
            ctx.fillText(h[i].prob[j], (i+.85)*W, (j+.4)*H);
        }

        // Étape de fusion : cas des symboles fusionnés (fusion des traits)
        ctx.beginPath();
        ctx.moveTo((i+.50)*W, (j+0.5)*H);
        ctx.lineTo((i+0.75)*W, (j+0.5)*H);
        ctx.lineTo((i+0.75)*W, (j+1.5)*H);
        ctx.lineTo((i+.50)*W, (j+1.5)*H);
        ctx.moveTo((i+.75)*W, (j+1.0)*H);
        ctx.lineTo((i+1.00)*W, (j+1.0)*H);
        ctx.stroke();

        // Valeur des bits
        ctx.fillText('1', (i+.65)*W, (j+1.3)*H);
        ctx.fillText('0', (i+.65)*W, (j+.8)*H);

        // Probabilité issue de la fusion
        ctx.fillText(h[i].prob[h[i].prob.length-1], (i+.85)*W, (j+.9)*H);
    }
}


/* CLIC SUR LE BOUTON */

function run()
{   
    var p = readProbas();   // Lecture des probabilités
    var h = huffman(p);     // Construction de l'arbre de Huffman
    interface(h);           // Mise à jour de l'interface
    draw(h);                // Affichage de l'arbre
}


/* INITIALISATION */

function init()
{   
    // Div Animation
    anim = inidiv('huffman', 100, 100);
    
    // Étiquette
    lblProba = Label(anim, 'Probabilités :', 0, 0);
    var pos = (bdh-lblProba.offsetHeight) / 2
    lblProba.style.top = pos.toString() + 'px';
    
    // Texte (valeur des probabilités)
    txtProba = new InputText(anim, lblProba.offsetWidth+sep, 0, 1, bdh, '0.4 0.3 0.2 0.1');
    txtProba.style.height = '24px';
    
    // Bouton d'affichage
    btnDraw = new Button(anim, 'Calculer le code', 0, 0, bdw, bdh, '');
    btnDraw.addEventListener('click', run, false);
    
    // Canvas
    ctx = Graph(anim, cW + sW + pW, bdh+sep, 1, 1);
    
    // Dessin du canvas initial
    run();
}


/* ÉXÉCUTION AU CHARGEMENT DE LA PAGE */

window.onload = function () { init(); };
