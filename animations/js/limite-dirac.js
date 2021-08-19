/*
    LIMITE DE SIGNAUX VERS UNE IMPULSION DE DIRAC
    
    Version du 10/07/2015
    
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


//// Objets
var div, gb, gf, sel, lbl, sld;

// Dimensions des objets
var gw = 300;   // Largeur du graphe
var gh = 200;   // Hauteur du graphe
var sh = 30;    // Hauteur des contrôles
var sep = 10;   // Espace de séparation

// Liste des signaux
var signals = ['Porte', 'Gaussienne', 'Sinus cardinal'];

// Paramètres
var xmax = 5;               // Valeur extrême des abscisses
var ymin = -1, ymax = 6;    // Valeurs extrêmes des ordonnées

function init()
{
  // Initialisation du div
    div = inidiv('limite-dirac', gw, gh+2*sh+2*sep);
    
    // Graphe d'arrière-plan
    gb = new Graph(div, 0, 0, gw, gh);
    gb.xlim = [-xmax, xmax];
    gb.ylim = [ymin, ymax];
    gb.box(color[1]);
    gb.axes(color[1]);

    // Graphe d'avant-plan
    gf = new Graph(div, 0, 0, gw, gh);
    gf.xlim = [-xmax, xmax];
    gf.ylim = [ymin, ymax];
    
    // Liste des signaux
    sel = new Select(div, 0, gh+sep, gw, signals, draw);
    
    // Etiquette
    lbl = Label(div, 'Largeur :', 0, gh+sh+2*sep, 'l');

    // Slider
    sld = Slider(div, 80, gh+sh+2*sep, gw-80, 0, xmax/2, xmax/2, xmax/400, draw);
    
    // Affiche le signal
    gf.lineWidth = 2;
    gf.strokeStyle = color[3];
    draw();
}

function draw()
{
    // Définition des variables
    var n, t = [], x = [];
    var N = gw/2;                   // Nombre de points du signal
    s = sel.value;                  // Type de signal
    w = parseFloat(sld.value);      // Largeur du signal (= valeur du slider)
    
    // Calcule le signal
    if (w==0)
    {
        // Impulsion de Dirac
        t = [-xmax, 0, 0, 0, xmax];
        x = [0, 0, ymax, 0, 0];
    }
    else if (s == 'Porte')
    {
        t = [-xmax, -w, -w, w, w, xmax];
        x = [0, 0, 1/(2*w), 1/(2*w), 0, 0];
    }
    else if (s == 'Gaussienne')
    {
        for(n=0; n<=N; n++)
        {
            t.push( 2*xmax/N*n - xmax);
            x.push( 1 / Math.sqrt(2*Math.PI*w*w) * Math.exp(-t[n]*t[n]/(2*w*w)) );
        }
    }
    else if (s == 'Sinus cardinal')
    {
        // Augmente le nombre de points si le sinus cardinal évolu rapidement
        if (w<0.15)   { N = 1000; }
        if (w<0.0375) { N = 2000; }
        for(n=0; n<=N; n++)
        {
            t.push( 2*xmax/N*n - xmax);
            if (t[n]==0)
                x.push(1/w);
            else
                x.push( Math.sin(t[n]/w) / (t[n]/w) / w );
        }
    }
    
    // Affiche le signal
    gf.clear();
    gf.plot(t,x);
}

window.onload = function (){ init(); }
