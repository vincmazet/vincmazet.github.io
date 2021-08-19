
// Objets
var div, gbs, gbe, gfs, gfe;

// Paramètres
var gw = 200;       // Côté du diagramme de l'oeil
var sep = 15;       // Séparation entre les deux graphes
var K = 4;          // Nombre de symboles sur le signal = rapport entre les largeurs des deux graphes
var T = 1;          // Durée d'un signal
var N = 16;          // Nombre de points dans le diagramme de l'oeil
var x = [];         // Valeur du signal

// Initialisation
function init()
{
    // Initialisation du div
    div = inidiv('eyediag', K*gw, gw*2+sep);

    // Graphe d'arrière-plan du signal
    gbs = Graph(div, 0, 0, K*gw, gw);
    gbs.xlim = [0, K*T];
    gbs.ylim = [-T/2, T/2];
    gbs.grid(T/5, T/5);
    gbs.box();
    gbs.axes();
    gbs.plot([T, T],[-T/2, T/2]);
    gbs.plot([2*T, 2*T],[-T/2, T/2]);
    gbs.plot([3*T, 3*T],[-T/2, T/2]);
    
    // Graphe d'arrière-plan du diagramme de l'oeil
    gbe = Graph(div, gw*1.5, gw+2*sep, gw, gw);
    gbe.xlim = [-T/2,  T/2];
    gbe.ylim = [-T/2, T/2];
    gbe.grid(T/5, T/5);
    gbe.box();
    gbe.axes();
    
    // Graphe d'avant-plan du signal
    gfs = Graph(div, 0, 0, K*gw, gw);
    gfs.xlim = [0, K*T];
    gfs.ylim = [-T/2, T/2];
    gfs.lineWidth = 2;
    gfs.mouseDrag(mousemove);
    
    // Graphe d'avant-plan du diagramme de l'oeil
    gfe = Graph(div, gw*1.5, gw+2*sep, gw, gw);
    gfe.xlim = [-T/2,  T/2];
    gfe.ylim = [-T/2, T/2];
    gfe.lineWidth = 2;
    
    // Etiquettes
    Label(div, '\\(0\\)',        0, gw, 't', color[1]);
    Label(div, '\\(T\\)',    gw- 5, gw, 't', color[1]);
    Label(div, '\\(2T\\)', 2*gw-10, gw, 't', color[1]);
    Label(div, '\\(3T\\)', 3*gw-10, gw, 't', color[1]);
    Label(div, '\\(4T\\)', 4*gw-20, gw, 't', color[1]);
    Label(div, '\\(0\\)',  gw*1.5+ 0, 2*gw+2*sep, 't', color[1]);
    Label(div, '\\(T\\)',  gw*2.5-10, 2*gw+2*sep, 't', color[1]);
 
    // Définit et affiche le signal
    initsignal(0);
    draw();
}

// Signal prédéfini
function initsignal(s)
{
    var i;
    switch (s)
    {
        case 0:
            // Signal nul
            for(i=0; i<=K*N; i++)
                x[i] = 0;
            break;
        
            // TODO : définir d'autres signaux et les sélectionner à partir d'une liste
    }
    return x;
}

// Mouvement de la souris : récupère l'ordonnée du pointeur pour définir l'ordonnée du signal
function mousemove(xx, yy)
{
    var n = Math.round(xx/(T/N));       // Indice du tableau
    x[n] = yy;                          // Valeur du signal
    draw();                             // Mise à jour de l'affichage
}

// Affichage des signaux
function draw()
{
    var i, j, r, g, b, clr;
    
    // Efface les signaux
    gfs.clear();
    gfe.clear();

    // Affiche les signaux par segment (ie point par point)
    for (i=0; i<K*N; i++)
    {
        // Définit la couleur du segment suivant un dégradé de couleur
        // (http://i.imgur.com/yJCDd.png)
        // TODO : à calculer une fois puis stocker les variables
        j = i/(K*N-1);
        if (j<0.25)
        {
            r = 0;      
            g = 1024*j;
            b = 255;
        }
        else if (j<0.5)
        {
            r = 0;
            g = 255;
            b = -1024*j + 512;
        }
        else if (j<0.75)
        {
            r = 1024*j - 512;
            g = 255;
            b = 0;
        }
        else
        {
            r = 255;
            g = -1024*j + 1024;
            b = 0;
        }
        clr = "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";

        // Segments des signaux à afficher        
        tsel1 = [i/N, (i+1)/N];
        tsel2 = [(i%N-N/2)/N, (i%N+1-N/2)/N];
        xsel  = [x[i], x[i+1]];

        // Affichage du signal temporel
        gfs.strokeStyle = clr;
        gfs.plot(tsel1,xsel);
        
        // Affichage du diagramme de l'oeil
        gfe.strokeStyle = clr;
        gfe.plot(tsel2,xsel);
    }
}

window.onload = function (){ init(); };
