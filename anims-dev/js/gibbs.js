/*
    PHÉNOMÈNE DE GIBBS

    Version du 11/06/2016

    Copyright Vincent Mazet (vincent.mazet@unistra.fr), Mehdi Abouhaouari, Shridevi Sandiramourty, 2016.

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



// TODO :
// - vérifier les formules (et les mettre au propre ?)
// - MahJax et Cie


// Objets
var div, gb, gf, sld, lbl, sel;

// Paramètres
var gw = 350;   // Largeur du graphe
var gh = 200;   // Largeur du graphe
var N = 4;      // Nombre de coefficients de la série de Fourier
var xmax = 5;   // Valeur extrême des abscisses
var ymax = 3;   // Valeur extrême des ordonnées
var sep = 15;   // Espace de séparation

// Liste des signaux
var signaux = ['Créneau', 'Dent de scie', 'Triangle'];

function init()
{
    // Initialisation du div
    div = inidiv('gibbs', gw, 290);

    // Liste des signaux
    sel = new Select(div, 0, 0, gw, signaux, draw);
    
    // Graphe d'arrière-plan
    gb = Graph(div, 0, 30+sep, gw, gh);
    gb.xlim = [-xmax, xmax];
    gb.ylim = [-ymax, ymax];
    gb.grid(1,1,color[2]);
    gb.box(color[1]);
    gb.axes(color[1]);
    
    // Graphe d'avant-plan
    gf = Graph(div, 0, 30+sep, gw, gh);
    gf.xlim = [-xmax, xmax];
    gf.ylim = [-ymax, ymax];
    gf.lineWidth = 2;
    gf.strokeStyle = color[3];

    // Nombre de coefficients : défilement et étiquette
    Label(div, '\\(N\\) = ',  0, 30+gh+2*sep);
    lbl = new Label(div, N.toString(), 35, 30+gh+2*sep);
    sld = new Slider(div, 70, 30+gh+2*sep, gw-70, 0, 50, N, 1, draw);
    
    // Affichage de la courbe
    draw();
}

function draw()
{
    var t = [], y = [];

    N = parseFloat(sld.value);      // Nombre de coefficients
    s = sel.value;                  // Type de signal

    // Etiquette de valeur    
    lbl.innerHTML = N.toString();

    // Détermine le signal issu de la reconstruction
    // TODO : utiliser la fonction MAP ?
    switch (s)
    {
        case signaux[0]:
            // Créneau de période 5 et d'amplitude 2
            for(x=-xmax; x<xmax; x=x+0.02)
            {
                sum = 0;            // Composante continue
                for(k=1; k<=N; k=k+2)
                {
                    // Évolution de 2 en 2 car les coefficients pairs sont nuls
                    sum = sum + 8/Math.PI/k * Math.sin(2*Math.PI*k*x/5);
                }
                t.push(x);      // Abscisse
                y.push(sum);    // Ordonnée
            }
            break;

        case signaux[1]:
            // Dent de scie
            for(x=-xmax; x<xmax; x=x+0.02)
            {
                sum = 0;            // Composante continue
                for(k=1; k<N; k=k+1)
                {
                    //sum = sum + Math.sin(2*0.2*Math.PI*k*x)/k;
                    sum = sum - 2*Math.pow(-1,k)/Math.PI/k * Math.sin(2*Math.PI*k*x/4);
                }
                t.push(x);      // Abscisse
                y.push(sum);    // Ordonnée
            }
            break;

        case signaux[2]:
            // Triangle
            for(x=-xmax; x<xmax; x=x+0.02)
            {
                sum = 0;            // Composante continue
                for(k=0; k<N; k=k+1)
                {
                    sum = sum + Math.pow(-1,k) * Math.sin(2*0.2*Math.PI*(2*k+1)*x) / Math.pow(2*k+1,2);
                }
                t.push(x);      // Abscisse
                y.push(sum);    // Ordonnée
            }
            break;
    }
    
    // Affiche la sinusoïde
    gf.clear();
    gf.plot(t,y);
}

window.onload = function (){ init(); };
