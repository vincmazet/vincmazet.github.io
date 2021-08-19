/*
    PRODUIT DE CONVOLUTION DISCRET UNIDIMENSIONNEL
    
    Version du 15/01/2015
    
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

// TODO: placement correct des labels

// Objets
var anim, gx, gh, gy, lbl3;

// Paramètres
var gw = 230;           // Côté d'un graphe
var gs = 50;            // Séparation entre graphes
var gc = 100;           // Taille de la bordure basse des listes de choix

// Couleurs
var clrgrid = '#d0d0d0';
var clraxes = '#b0b0b0';

// Signaux pré-enregistrés
var N = 17;             // Nombre total de points dans les signaux (valeur impaires)
var gmax = (N-1)/2;     // Valeur max des ordonnées
var i, n = [];
for(i=0; i<N; i++)
    n[i] = i - (N-1)/2;

window.onload = function (){ init(); }

// Initialisation
function init()
{
    // Animation
    anim = inidiv('convolution', 3*gw+2*gs, gw+gc);
    
    // Etiquettes du graphe de résultat
    //Label(anim, '\\(n\\)', 3*gw+2*gs-20, gw/2, clraxes, 'lt');
    lbl3 = Label(anim, '\\(' + gmax + '\\)', .5*gw, 0, clraxes, 'rt');
    Label(anim, '\\(y[n]\\)', 2*(gw+gs), 0, clraxes, 'lt');
    
    // Signes
    var lblconv = Label(anim, '\\(*\\)', gw+gs/2, gw/2, '#404040', 'lt');
    lblconv.style.fontSize = '250%';
    var lblequal = Label(anim, '\\(=\\)', 2*gw+3*gs/2, gw/2, '#404040', 'lt');
    lblequal.style.fontSize = '250%';
    
    // Graphe x
    // Graphes un peu spéciaux qui contiennent les graphes,
    // les signaux, les sélecteurs de choix
    gx = new GraphConv(0, 'x[n]');
    gh = new GraphConv(1, 'h[n]');
    
    // Graphe y
    gy = new Graph(anim, 2*(gw+gs), 0, gw, gw);
    gy.xlim = [-gmax, gmax];
    gy.ylim = [-gmax, gmax];
    gy.strokeStyle = clrgrid;
    gy.grid();
    gy.strokeStyle = clraxes;
    gy.axes();
    
    // Affiche les signaux
    draw();
}

function draw()
{   
    // Calcule et affiche le résultat de la convolution si et seulement si les trois graphes existent
  // TODO: remplacer par si tout = undeifined alors escape
    if ((typeof gx != 'undefined') && (typeof gh != 'undefined') && (typeof gy != 'undefined'))
    {   
        // Produit de convolution
        y = conv(gx.x, gh.x);
        
        // Valeur max du signal et axe des ordonnées
        var i, yn, ymax = 0;
        for (i=0; i<N; i++)
        {
            yn = Math.max(Math.abs(y[i]));
            ymax = Math.max(yn, ymax);
        }
        ymax = Math.ceil(1.1 * ymax);
        ymax = Math.max(ymax,8);
        
        // Etiquette des ordonnées
        lbl3.innerHTML = '\\(' + ymax + '\\)';
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,lbl3]);// TODO : apparemment c'est ce qui est lent sous FF+Ubuntu
        
        // Graphe du résultat
        gy.ylim = [-ymax, ymax];
        gy.clear();
        gy.strokeStyle = clrgrid;
        gy.grid(1, Math.round(ymax/8));
        gy.strokeStyle = clraxes;
        gy.axes();
        gy.strokeStyle = 'black';
        gy.stem(n,y);
    }
}

// Objet contenant un graphe, un signal et un sélecteur
function GraphConv(num, lbly)
{
    // Initialisation des signaux
    var signals = ['Signal nul', 'Kronecker', 'Porte', 'Gaussienne', 'Exponentielle décroissante', 'Rampe', 'Personnalisé'];
    var idperso = signals.length - 1;
    this.x = [];
    
    // Etiquettes
    //Label(anim, '\\(n\\)', (num+1)*gw+num*gs-20, gw/2, clraxes, 'lt');
    Label(anim, '\\(' + gmax + '\\)', (2.5-num)*gw+(2-num)*gs, 0, clraxes, 'lr');
    Label(anim, '\\(' + lbly + '\\)', num*(gw+gs), 0, clraxes, 'lt');
    
    // Sélecteur
    var sel = new Select(anim, num*(gw+gs), gw+10, gw, signals);
    sel.addEventListener('change', function() {selectchange();}, false);
    
    // Graphe d'arrière-plan
    var gb = new Graph(anim, num*(gw+gs), 0, gw, gw);
    gb.xlim = [-gmax, gmax];
    gb.ylim = [-gmax, gmax];
    gb.strokeStyle = clrgrid;
    gb.grid();
    gb.strokeStyle = clraxes;
    gb.axes();

    // Graphe d'avant-plan
    var gf = new Graph(anim, num*(gw+gs), 0, gw, gw);
    gf.xlim = [-gmax, gmax];
    gf.ylim = [-gmax, gmax];
    
    // Objet this accessible par les méthodes privées
    // cf http://javascript.crockford.com/private.html
    var that = this;

    // Affiche les signaux
    selectchange();
    
    // Changement dans la sélection
    function selectchange()
    {
      that.x = initsignal(sel.value);
      drawme();
    }

    // Déplacement de la souris sur le graphe d'avant-plan
    gf.mousemovedown(function(i,y){
      sel.options[idperso].selected = 'true';
      i = Math.round(i) + (N-1)/2;
      y = Math.round(y);
      that.x[i] = y;
      drawme();
    });
    
    // Affiche le signal
    function drawme()
    {
      gf.clear();
      gf.stem(n,that.x);
      draw();
    }
    
    // Renvoie un vecteur correspondant au signal donné en entrée
    function initsignal(s)
    {
        var i, x = [];
        switch (s)
        {
            case signals[0]: // Signal nul
              for(i=0; i<N; i++)
                  x[i] = 0;
              break;
              
            case signals[1]: // Kronecker
              for(i=0; i<N; i++)
                  x[i] = (i==(N-1)/2 ? 1 : 0);
              break;
              
            case signals[2]: // Porte
              for(i=0; i<N; i++)
                  x[i] = ((i>(N-1)/4)&(i<3*(N-1)/4) ? 1 : 0);
              break;
              
            case signals[3]: // Gaussienne
              for(i=0; i<N; i++)
                  x[i] = (N-1)/4 * Math.exp(- Math.pow(i-(N-1)/2,2)/4 );
              break;
              
            case signals[4]: // Exponentielle décroissante
              for(i=0; i<N; i++)
                  if (i-(N-1)/2 < 0)
                      x[i] = 0;
                  else
                      x[i] = (N-1)/4 * Math.exp(- (i-(N-1)/2) );
              break;
              
            case signals[5]: // Rampe
              for(i=0; i<N; i++)
                  x[i] = i - (N-1)/2;
              break;
              
            case signals[6]: // Personnalisé
                  x = that.x;
              break;
        }
        return x;
    }
    
}
