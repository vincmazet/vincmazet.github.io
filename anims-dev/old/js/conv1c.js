/*
    PRODUIT DE CONVOLUTION UNIDIMENSIONNEL
    
    Version du 15/01/2015
    
    Copyright Vincent Mazet (vincent.mazet@unistra.fr), 2014.

    Les programmes Javascript fournis par l'intermédiaire de ces pages
    proposent des illustrations et des animations pédagogiques de traitement
    du signal.

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
var anim, g1, g2, g = [], btnclear;

// Paramètres
var xmax = 5;       // Valeurs extrême des abscisses
var A = 1;          // Amplitude de x(t)
var a = 1.5;        // Demi-durée de x(t)
var B = 1;          // Amplitude de y(t)
var b = 1;          // Demi-durée de y(t)
var dpt = -4;       // Actuel décalage (en point)
var dpx, odpx;      // Actuel et ancien décalages (en pixel)

// Taille des graphiques
var gw = 350;       // Largeur d'un graphe
var gh = 80;        // Hauteur d'un graphe
var gs = 20;        // Espacement entre les graphes

// Abscisse pour le signal z(t) (résultat de la convolution)
var t = new Array(gw), z = new Array(gw);
for( i = 0 ; i < gw+1 ; i++ )
    t[i] = i / gw * 2 * xmax - xmax;

window.onload = function (){ init(); }

// Initialisation
function init()
{
    // Animation
    anim = inidiv('conv1c', gw, 4*gh+3*gs);
    
    // Graphes statiques
    for (i=0; i<4; i++)
    {
      g[i] = new Graph(anim, 0, i*(gh+gs), gw, gh);
      g[i].xlim = [-xmax, xmax];
      g[i].ylim = [-0.1, 1.5];
      g[i].strokeStyle = '#b0b0b0';
      g[i].axes();
    }
    
    // Etiquettes
    Label(anim, '\\(x(\\tau)\\)',    gw/2+2,         0, 'blue', 'tl');
    Label(anim, '\\(h(\\tau)\\)',    gw/2+2,     gh+gs, 'red', 'tl');
    Label(anim, '\\(x(\\tau)\\)',    gw/2+2, 2*(gh+gs), 'blue', 'tl');
    Label(anim, '\\(h(t-\\tau)\\)', gw/2+40, 2*(gh+gs), 'red', 'tl');
    Label(anim, '\\(y(t)\\)',        gw/2+2, 3*(gh+gs), 'green', 'tl');
    Label(anim, '\\(\\tau\\)', 1,   gh     -22, '#b0b0b0', 'tr');
    Label(anim, '\\(\\tau\\)', 1, 2*gh+  gs-22, '#b0b0b0', 'tr');
    Label(anim, '\\(\\tau\\)', 1, 3*gh+2*gs-22, '#b0b0b0', 'tr');
    Label(anim, '\\(t\\)', 1,     4*gh+3*gs-22, '#b0b0b0', 'tr');
    
    // Graphe 1
    g1 = new Graph(anim, 0, 2*(gh+gs), gw, gh);
    g1.xlim = [-xmax, xmax];
    g1.ylim = [-0.1, 1.5];
    
    g1.mousemovedown(schtroumpf);
    
    var c = g1.mycanvas;
    c.addEventListener("mousedown", function(evt)
    {
        var rect = c.getBoundingClientRect();
        odpx = Math.round(evt.clientX - rect.left);
    });
    c.addEventListener("touchstart", function(evt)
    {
        var rect = c.getBoundingClientRect();
        odpx = Math.round(evt.clientX - rect.left);
        evt.preventDefault();
    });
    
    // Graphe 2
    g2 = new Graph(anim, 0, 3*(gh+gs), gw, gh);
    g2.xlim = [-xmax, xmax];
    g2.ylim = [-0.1, 1.5];
    
    // Bouton d'effacement
    btnclear = new ClearButton(anim, 0, 3*(gh+gs));
    btnclear.addEventListener('mousedown', function() {z = []; draw();}, false);
    btnclear.addEventListener('touchstart', function() {z = []; draw();}, false);
    
    // Signal x
    g[0].strokeStyle = 'blue';
    g[0].plot([-xmax, -a, -a, a, a, xmax], [0, 0, A, A, 0, 0]);
    
    // Signal h
    g[1].strokeStyle = 'red';
    g[1].plot([-xmax, -b, b, b, xmax], [0, 0, B, 0, 0]);
    
    // Signal x
    g[2].strokeStyle = 'blue';
    g[2].plot([-xmax, -a, -a, a, a, xmax], [0, 0, A, A, 0, 0]);
    
    // Dessin
    draw();
}

// Mousemove
function schtroumpf(x, tmp)
{
    // Calcule les valeurs du signal y
    // Les valeurs comprises entre k1 et k2 sont calculées. k1 et k2 sont les
    // coordonnées correspondantes à l'ancienne position de la souris et
    // l'actuelle. Cela permet de prévenir le fait que la navigateur "saute"
    // certains points.
  
    dpt = x;
    var p = g1.pt2px(dpt);
    dpx = Math.round(p[0]);
    
    // Détermine la plage de calcul
    var k1 = Math.min( dpx, odpx );
    var k2 = Math.max( dpx, odpx );
    
    // Calcule les valeurs du signal
    for (var k=k1; k<=k2; k++)
    {
        p = g1.px2pt(k);
        dpt = p[0];//k / gw * 2 * xmax - xmax;
        if      (dpt+b < -a)
            z[k] = 0;
        else if (dpt-b < -a)
            z[k] = A*B/4/b * Math.pow(dpt+a+b,2);
        else if (dpt+b < a) 
            z[k] = A*B*b;
        else if (dpt-b < a) 
            z[k] = -A*B/4/b * Math.pow(dpt-a+b,2) + A*B*b;
        else if (dpt-b > a)
            z[k] = 0;
    }
  
    // Décalage temporel (t)
    odpx = dpx;
    draw();
}

function draw()
{
    // Signal x(tau)h(t-tau) (seulement les 4 points de l'aire)
    var xa = []; ya = [];
    if      (dpt+b < -a)
    {
        xa = [NaN, NaN, NaN, NaN];
        ya = [NaN, NaN, NaN, NaN];
    }
    else if (dpt-b < -a)
    {
        xa = [ -a, -a, b+dpt, b+dpt ];
        ya = [ 0, B*b/2*(b+a+dpt), 0, 0 ];
    }
    else if (dpt+b < a) 
    {
        xa = [ -b+dpt, -b+dpt, b+dpt, b+dpt ];
        ya = [ 0, B, 0, 0 ];
    }
    else if (dpt-b < a) 
    {
        xa = [ -b+dpt, -b+dpt, a, a ];
        ya = [ 0, B, B*b/2*(b-a+dpt), 0 ];
    }
    else if (dpt-b > a)
    {
        xa = [NaN, NaN, NaN, NaN];
        ya = [NaN, NaN, NaN, NaN];
    }
    
    g1.clear();
    g2.clear();
    
    // Aire sous la courbe
    g1.strokeStyle = 'blue';
    g1.fillStyle = 'green';
    g1.plotf(xa, ya);
    
    // Signal h renversé et décalé
    g1.strokeStyle = 'red';
    g1.plot([-xmax, -b+dpt, -b+dpt, b+dpt, xmax], [0, 0, B, 0, 0]);
    
    // Résultat
    g2.fillStyle = 'green';
    g2.strokeStyle = '#b0b0b0';
    g2.stem([dpt], [z[dpx]]);
    g2.strokeStyle = 'green';
    g2.plot(t, z);
}
