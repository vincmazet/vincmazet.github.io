/*
    REPRÉSENTATION D'UNE SINUSOÏDE

    Version du 13/07/2015

    Copyright Vincent Mazet (vincent.mazet@unistra.fr) et Frank Schorr, 2015

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
var div, gb, gf, slda, sldf, sldp, sldm, lbla, lblf, lblp, lblm;

// Paramètres
var a = 1;              // Amplitude de la sinusoïde
var f = 1;              // Fréquence de la sinusoïde
var p = 0;              // Phase de la sinusoïde
var m = 0;              // Moyenne de la sinusoïde
var xmax = 5;           // Valeur extrême des abscisses
var ymax = 3;           // Valeur extrême des ordonnées

function init()
{
    // Initialisation du div
    div = inidiv('sinus', 350, 350);

    // Graphe d'arrière-plan
    gb = Graph(div, 0, 0, 350, 200);
    gb.xlim = [-xmax, xmax];
    gb.ylim = [-ymax, ymax];
    gb.grid(1,1,color[2]);
    gb.box(color[1]);
    gb.axes(color[1]);

    // Graphe d'avant-plan
    gf = Graph(div, 0, 0, 350, 200);
    gf.xlim = [-xmax, xmax];
    gf.ylim = [-ymax, ymax];

    // Etiquettes du graphe
    Label(div, '\\(t\\)', 365, 115, 'br', color[1]);
    Label(div, '\\(x(t)\\)', 178, 2, 'tl', color[1]);

    // Défilement et étiquette "Moyenne"
    lblm = Label(div, 'Moyenne : ', 0, 220);
    sldm = Slider(div, 150, 220, 200, -3,  3, m, 0.1, draw);

    // Défilement et étiquette "Amplitude"
    lbla = Label(div, 'Amplitude : ', 0, 250);
    slda = Slider(div, 150, 250, 200, -3,  3, a, 0.1, draw);

    // Slider et étiquette "Fréquence"
    lblf = Label(div, 'Fréquence : ', 0, 280);
    sldf = Slider(div, 150, 280, 200, 0.1, 2, f, 0.1, draw);

    // Slider et étiquette "Phase"
    lblp = Label(div, 'Phase : ', 0, 310);
    sldp = Slider(div, 150, 310, 200, 0, 6.28, p, 0.1, draw);

    // Affiche la sinusoïde
    gf.lineWidth = 2;
    gf.strokeStyle = color[3];
    draw();
}

function draw()
{
    var n, t = [], y = [];

    // Récupère les valeurs des sliders
    m = parseFloat(sldm.value);
    a = parseFloat(slda.value);
    f = parseFloat(sldf.value);
    p = parseFloat(sldp.value);

//    // TODO ? : Arrondi les valeurs (bugs sur certains navigateurs)
//    a = Math.round(a*10) / 10;
//    f = Math.round(f*10) / 10;
//    p = Math.round(p*10) / 10;

    // Etiquettes de valeur
    lblm.innerHTML = 'Moyenne : ' + m.toString();
    lbla.innerHTML = 'Amplitude : ' + a.toString();
    lblf.innerHTML = 'Fréquence : ' + f.toString();
    lblp.innerHTML = 'Phase : ' + p.toString() + ' radians';

    // Calcule les valeurs de la sinusoïde
    for(n = -5; n < 5; n=n+.02)
    {
        t.push( n );
        y.push( m + a * Math.sin( 2 * Math.PI * f * n + p ) );
    }

    // Affiche la sinusoïde
    gf.clear();
    gf.plot(t,y);
}

window.onload = function (){ init(); }