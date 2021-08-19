// Objets
var div, g1, g1b, g2, g2b, g;

// Couleurs
var color = [ '#333', '#999', '#CCC', '#0060A9', '#BE1600', '#00A90B', '#EFED00'];

// Taille des graphiques
var gw = 250;       // Largeur d'un graphe
var gh = 200;       // Hauteur d'un graphe
var gy = gh + 10;   // Ordonnée du premier graphe

// Paramètres
var xmax = 5;       // Valeurs extrême des abscisses
var A = 1;          // Amplitude de x(t)
var a = 1.5;        // Demi-durée de x(t)
var B = 1;          // Amplitude de y(t)
var b = 1;          // Demi-durée de y(t)
var d = -4;         // Actuel décalage (en point)
var dpx, odpx;      // Actuel et ancien décalages (en pixel)

// Abscisse pour le signal z(t) (résultat de la convolution)
var t = new Array(gw), z = new Array(gw);
for( i = 0 ; i < gw+1 ; i++ )
    t[i] = i / gw * 2 * xmax - xmax;

// Signaux pré-enregistrés
var N = 9;                         // Nombre total de points dans les signaux (valeur impaires)
var gmax = (N-1)/2;                 // Valeur max des ordonnées

var pente; // Pente de la droite
   
// Abscisses
var n = range(-(N-1)/2, (N-1)/2);
var signal = Array(N);

/*************************************************************************************************/

// Initialisation
function initA()
{
    // Graphe statique 1
    g1b = Graph(div, 5, gy, gw, gh/2);
    g1b.xlim = [-xmax, xmax];
    g1b.ylim = [-0.1, 1.5];
    g1b.box(color[2]);

    // Graphe statique 2
    g2b = Graph(div, 5, gy+gh/2, gw, gh/2);
    g2b.xlim = [-xmax, xmax];
    g2b.ylim = [-0.1, 1.5];
    g2b.box(color[2]);

    // Graphe 1
    g1 = new Graph(div, 5, gy, gw, gh/2);
    g1.xlim = [-xmax, xmax];
    g1.ylim = [-0.1, 1.5];
    g1.lineWidth = 2;
    g1.strokeStyle = color[4];

    // Graphe 2
    g2 = new Graph(div, 5, gy+gh/2, gw, gh/2);
    g2.xlim = [-xmax, xmax];
    g2.ylim = [-0.1, 1.5];
    g2.lineWidth = 2;
    g2.fillStyle = color[5];
    g2.strokeStyle = color[5];

    // Déplacements avec la souris
    g1.mouseDrag(deplacement);
    g1.mouseMove(levecrayon);
    g2.mouseDrag(deplacement);
    g2.mouseMove(levecrayon);

    // Dessin
    draw();
}

// Déplacement de la souris sur le graphe
function levecrayon(x, tmp)
{
    odpx = undefined;
}

// Déplacement de la souris sur le graphe
function deplacement(x, tmp)
{
    // Calcule les valeurs du signal y
    // Les valeurs comprises entre k1 et k2 sont calculées. k1 et k2 sont les
    // coordonnées correspondantes à l'ancienne position de la souris et
    // l'actuelle. Cela permet de prévenir le fait que la navigateur "saute"
    // certains points.

    d = x;
    var p = g1.pt2px([d, 0]);
    dpx = Math.round(p[0]);
    odpx = odpx || dpx;
    
    // Détermine la plage de calcul
    var k1 = Math.min( dpx, odpx );
    var k2 = Math.max( dpx, odpx );
    
    // Calcule les valeurs du signal
    for (var k=k1; k<=k2; k++)
    {
        p = g1.px2pt([k, 0]);
        myd = k / gw * 2 * xmax - xmax;
        if      (myd+b < -a)
            z[k] = 0;
        else if (myd-b < -a)
            z[k] = A*B/4/b * Math.pow(myd+a+b,2);
        else if (myd+b < a)
            z[k] = A*B*b;
        else if (myd-b < a)
            z[k] = -A*B/4/b * Math.pow(myd-a+b,2) + A*B*b;
        else if (myd-b > a)
            z[k] = 0;
    }
    
    odpx = dpx;
    draw();
    
    /*
    d = x;
    var p = g1.pt2px([d, 0]);
    dpx = Math.round(p[0]);
    odpx = odpx || dpx;

    // Détermine la plage de calcul
    var k1 = Math.min( dpx, odpx );
    var k2 = Math.max( dpx, odpx );
    
    // Calcule les valeurs du signal
    for (var k=k1; k<=k2; k++)
    {
        p = g1.px2pt([k, 0]);
        d = p[0];//k / gw * 2 * xmax - xmax;
        //console.log(d + ' : ' + k1 + ' -> ' + k2);
        if      (d+b < -a)
            z[k] = 0;
        else if (d-b < -a)
            z[k] = A*B/4/b * Math.pow(d+a+b,2);
        else if (d+b < a)
            z[k] = A*B*b;
        else if (d-b < a)
            z[k] = -A*B/4/b * Math.pow(d-a+b,2) + A*B*b;
        else if (d-b > a)
            z[k] = 0;
    }

    // Décalage temporel (t)
    odpx = dpx;
    draw();
    */
}

function draw()
{
    // Signal 1
    g1.clear();
    g1.plot([-xmax, -b+d, -b+d, b+d, xmax], [0, 0, B, 0, 0]);

    // Signal 2
    g2.clear();
    g2.stem([d], [z[dpx]]);
    g2.plot(t, z);
}

/*************************************************************************************************/

function initB()
{
    // Graphe
    g = Graph(div, 5, 2*gy, gw, gh);
    g.mouseMove(point);
    g.mouseDrag(droite);

    // Initialisation
    droite(-10, 0);
}

// Représente un point à l'emplacement du pointeur
function point(x, y)
{
    // Axes et cadre
    g.clear();
    g.box();

    // Ligne et point
    g.lineWidth = 2;
    g.strokeStyle = color[3];
    g.fillStyle = color[5];
    g.plot([-1, 1], [-pente, pente]);
    g.dot(x, y, 5);
}

// Représente une droite dont la pente est déterminée grâce à la position du pointeur
function droite(x, y)
{
    // Calcul de la pente
    pente = x!==0 ? y/x : 1e3;

    // Axes et cadre
    g.clear();
    g.box();

    // Ligne et point
    g.lineWidth = 2;
    g.strokeStyle = color[3];
    g.fillStyle = color[4];
    g.plot([-1, 1], [-pente, pente]);
    g.dot(x, y, 5);
}
    
/*************************************************************************************************/

function initC()
{   
    // Graphe d'arrière-plan
    gxb = Graph(div, 5, 3*gy, gw, gh);
    gxb.xlim = [-gmax, gmax];
    gxb.ylim = [-gmax, gmax];
    gxb.grid(1, 1, color[2]);
    
    // Graphe d'avant-plan
    gxf = Graph(div, 5, 3*gy, gw, gh);
    gxf.xlim = [-gmax, gmax];
    gxf.ylim = [-gmax, gmax];
    
    // Evènements sur les graphes
    gxf.mouseDrag(moveX);

    // Initialise le signal nul
    for(i=0; i<N; i++)
        signal[i] = 0;
        
    // Affiche le signal
    gxf.stem(n,signal);
}

// Déplacement de la souris sur le graphe X
function moveX(x, y)
{
    x = Math.round(x);
    y = Math.round(y);
    signal[x+(N-1)/2] = y;
    gxf.clear();
    gxf.stem(n,signal);
}

/*************************************************************************************************/

window.onload = function ()
{
    // Initialisation du div (inidiv)
    //div = inidiv('graphmouse', gw+10, 900);
    div = document.getElementById('graphmouse');
    div.style.width  = '260px';
    div.style.height = '900px';
    div.style.background = 'white';
 
    // Etiquettes
    var lbl1 = document.createElement('div');
    lbl1.innerHTML = 'window.devicePixelRatio = ' + window.devicePixelRatio;
    div.appendChild(lbl1);
    
    initA();
    initB();
    initC();
};
