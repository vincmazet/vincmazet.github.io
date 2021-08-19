/*
    LIMITE DE SIGNAUX VERS UNE IMPULSION DE DIRAC
    
    Version du 27/02/2015
    
    Copyright Vincent Mazet (vincent.mazet@unistra.fr) et Frank Schorr, 2014.

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
var anim, gb, gf, sel, lbl, sld;

// Dimensions des objets
var gw = 300;   // Largeur du graphe
var gh = 200;   // Hauteur du graphe
var sh = 30;    // Hauteur des contrôles sous le graphe
var sep = 10;   // Espace de séparation

// Liste des signaux
var signals = ['Porte', 'Gaussienne', 'Sinus cardinal'];

// Paramètres
var xmax = 5;               // Valeur extrême des abscisses
var ymin = -1, ymax = 6;    // Valeurs extrêmes des ordonnées
var msdown = true;          // Etat du bouton de la souris

function init()
{
    // Animation
    anim = inidiv('limite-dirac', gw, gh+2*sh+2*sep);
    
    // Graphe d'arrière-plan
    gb = new Graph(anim, 0, 0, gw, gh);
    gb.xlim = [-xmax, xmax];
    gb.ylim = [ymin, ymax];
    gb.strokeStyle = '#d0d0d0';
    gb.grid();
    gb.strokeStyle = '#b0b0b0';
    gb.axes();
    
    // Graphe d'avant-plan
    gf = new Graph(anim, 0, 0, gw, gh);
    gf.xlim = [-xmax, xmax];
    gf.ylim = [ymin, ymax];
    
    // Liste des signaux
    sel = new Select(anim, 0, gh+sep, gw, signals);
    sel.addEventListener('change', function() {draw();}, false);
    
    // Etiquette
    Label(anim, 'Largeur :', 0, gh+sh+2*sep, '#404040', 'l');

    // Slider
    sld = Slider(anim, 80, gh+sh+2*sep, gw-80, 0, xmax/2, xmax/2, xmax/400);
    sld.addEventListener('mousemove', function() {setTimeout(draw,50);}, false);
    sld.addEventListener('mousedown', function() {msdown = true;},       false);
    sld.addEventListener('mouseup',   function() {msdown = false;},      false);
    sld.addEventListener('touchmove', function() {setTimeout(draw,50);}, false);
    sld.addEventListener('touchdown', function() {msdown = true;},       false);
    sld.addEventListener('touchup',   function() {msdown = false;},      false);
    
    // Affiche le signal
    draw();
    msdown = false;
}

function draw()
{
    // N'exécute la fonction que si le bouton de la souris est enfoncé
    // (inutile de tracer si la souris se déplace simplement sur le slider)
    if (msdown === false) { return; }

    // Définition des variables
    var n, t = [], x = [];
    var N = 100;            // Nombre de points du signal
    
    // Récupère la largeur du signal (= valeur du slider)
    s = parseFloat(sld.value);
    
    // Calcule le signal
    if (s==0)
    {
        t = [-xmax, 0, 0, 0, xmax];
        x = [0, 0, ymax, 0, 0];
    }
    else{
        switch (sel.value) {
                
                case 'Porte':
                t = [-xmax, -s, -s, s, s, xmax];
                x = [0, 0, 1/(2*s), 1/(2*s), 0, 0];
                break;
                
                case 'Gaussienne':
                for(n=0; n<=N; n++)
                {
                    t.push( 2*xmax/N*n - xmax);
                    x.push( 1 / Math.sqrt(2*Math.PI*s*s) * Math.exp(-t[n]*t[n]/(2*s*s)) );
                };
                break;
                
                case 'Sinus cardinal':
                for(n=0; n<=N; n++)
                {
                    t.push( 2*xmax/N*n - xmax);
                    if (t[n]==0)
                    {
                        x.push(1/s);
                    }
                    else
                    {
                        x.push( Math.sin(t[n]/s) / (t[n]/s) / s );
                    }
                    
                };
                break;
        }
    }
    
    // Affiche le signal
    gf.clear();
    gf.lineWidth = 1;
    gf.strokeStyle = '#0020e0';
    gf.plot(t,x);
}

window.onload = function (){ init(); }
