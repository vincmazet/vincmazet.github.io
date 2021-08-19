// Variables globales
var color = [ '#333', '#999', '#CCC', '#0060A9', '#BE1600', '#00A90B', '#EFED00'];

// Initialise le <div> de la simulation
function inidiv(id, w, h)
{
    // id :   ID du div
    // w, h : largeur et hauteur de la simulation
    var o = document.getElementById(id);
    o.style.width  = w.toString() + 'px';
    o.style.height = h.toString() + 'px';
    return o;
}

/************************************************************************************************/

// Graphe
function Graph(div, x, y, w, h)
{
    // Les graphes sont à créer en dernier, notamment après les Labels,
    // afin qu'ils aient le bon z-index et être accessibles avec la souris.
    // Ou alors il faut forcer la propriété z-index
    // div :        div contenant la simulation (obtenu grâce à inidiv)
    // x, y, w, h : position et taille du graphe
        
    // Création d'un canvas et de son contexte
    var cnv = document.createElement('canvas');
    var ctx = cnv.getContext('2d');
    
    // Position et taille
    cnv.style.position = 'absolute';
    cnv.style.left   = x.toString() + 'px';
    cnv.style.top    = y.toString() + 'px';
    cnv.style.width  = w.toString() + 'px';
    cnv.style.height = h.toString() + 'px';
    cnv.width = w * window.devicePixelRatio;
    cnv.height = h * window.devicePixelRatio;
    
    div.appendChild(cnv);

    // Propriétés du graphe (et valeurs par défaut)
    ctx.xlim = [-1, 1];
    ctx.ylim = [-1, 1];

    // ***************************************************************************************** //

    // Conversion point du graphe -> pixel du canvas
    ctx.pt2px = function(pt)
    {
      return [ (pt[0] * window.devicePixelRatio - ctx.xlim[0]) / (ctx.xlim[1] - ctx.xlim[0]) * (cnv.width-1)  ,
               (ctx.ylim[1] - pt[1] * window.devicePixelRatio) / (ctx.ylim[1] - ctx.ylim[0]) * (cnv.height-1) ];
    };

    // ***************************************************************************************** //

    // Conversion pixel du canvas -> point du graphe
    ctx.px2pt = function(px)
    {
        // Attention, cette conversion se fait bien entre les pixels du canvas, et non les pixels de l'écran.
        // Dans le cas des écrans HiDPI, ces pixels ne sont pas identiques. Le rapport entre les tailles de ces pixels
        // est donné par window.devicePixelRatio.
        // Aussi, lorsqu'on utilise la fonction à partir d'un pixel du canvas, il n'y a rien de particulier à faire :
        //      p = mongraphe.px2pt([x, y]);
        // Mais si la fonction est utilisée à partir d'un pixel physique, il faut annuler les multiplications
        // présentes aux lignes ci-dessous et donc faire :
        //      p = mongraphe.px2pt([x / window.devicePixelRatio, y / window.devicePixelRatio]);

        return [      px[0] /  cnv.width  * (ctx.xlim[1] - ctx.xlim[0]) + ctx.xlim[0] ,
                 (1 - px[1] / cnv.height) * (ctx.ylim[1] - ctx.ylim[0]) + ctx.ylim[0] ];
    };

    // ***************************************************************************************** //

    // Efface le graphe
    ctx.clear = function()
    {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
    };

    // ***************************************************************************************** //

    // Cadre
    ctx.box = function(clr)
    {
        // Couleur
        clr = clr || color[1];

        // Tracé
        ctx.beginPath();
        ctx.moveTo(0.5, 0.5);
        ctx.lineTo(0.5, cnv.height-0.5);
        ctx.lineTo(cnv.width-0.5, cnv.height-0.5);
        ctx.lineTo(cnv.width-0.5, 0.5);
        ctx.lineTo(0.5, 0.5);
        ctx.lineWidth = 1;
        ctx.strokeStyle = clr;
        ctx.stroke();
        ctx.closePath();
    };

    // ***************************************************************************************** //

    // Axes
    ctx.axes = function(clr)
    {
        // Couleur
        clr = clr || color[1];

        // Coordonnées en pixel de l'origine
        var z = ctx.pt2px([0, 0]);
        z = [ Math.round(z[0])+.5 , Math.round(z[1])+.5 ];

        // Tracé
        ctx.beginPath();
        ctx.moveTo(z[0], 0);
        ctx.lineTo(z[0], cnv.height);
        ctx.moveTo(0, z[1]);
        ctx.lineTo(cnv.width, z[1]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = clr;
        ctx.stroke();
        ctx.closePath();
    };

    // ***************************************************************************************** //

    // Grille
    ctx.grid = function(dx, dy, clr)
    {
        // Couleur
        clr = clr || color[2];

        // Ecart entre les lignes
        dx = dx || 1, dy = dy || 1;
        var i, p;
        ctx.beginPath();

        // Grille sur les abscisses (lignes verticales)
        for (i = ctx.xlim[0]-ctx.xlim[0]%dx ; i <= ctx.xlim[1]-ctx.xlim[1]%dx ; i = i+dx)
        {
            i = Math.round(i*1E3) * 1E-3;   // Arrondi à 1E-3 pour contrer les erreurs d'arrondi
            p = ctx.pt2px([i, 0]);          // Conversion point -> pixel
            p = Math.round(p[0])+.5;
            ctx.moveTo(p, 0);
            ctx.lineTo(p, cnv.height);
        }

        // Grille sur les ordonnées (lignes horizontales)
        for (i = ctx.ylim[0]-ctx.ylim[0]%dy ; i <= ctx.ylim[1]-ctx.ylim[1]%dy ; i = i+dy)
        {
            i = Math.round(i*1E3) * 1E-3;   // Arrondi à 1E-3 pour contrer les erreurs d'arrondi
            p = ctx.pt2px([0, i]);          // Conversion point -> pixel
            p = Math.round(p[1])+.5;
            ctx.moveTo(0, p);
            ctx.lineTo(cnv.width, p);
        }

        // Affiche les lignes
        ctx.lineWidth = 1;
        ctx.strokeStyle = clr;
        ctx.stroke();
        ctx.closePath();
    };

    // ***************************************************************************************** //

    // Trace un signal en reliant les points (pour un signal continu)
    ctx.plot = function(xx,yy)
    {
        var n, p = new Array(2), op = new Array(2);
        
        op[1] = NaN; // Il n'y a pas de point avant le tout premier : on le fixe à NaN
        
        for (n=0; n<xx.length; n++)
        {
            // Point à représenter
            p = ctx.pt2px([xx[n],yy[n]]);
            p[0] = p[0]+0.5;
            p[1] = p[1]+0.5;

            // Premier point
            if (n===0 && !isNaN(p[1]))
            {
                ctx.beginPath();
                ctx.moveTo(p[0], p[1]);
            }
        
            if (!isNaN(p[1]) && isNaN(op[1]))
            {
                ctx.beginPath();
                ctx.moveTo(p[0], p[1]);
            }
            
            if (!isNaN(p[1]) && !isNaN(op[1]))
            {
                ctx.lineTo(p[0], p[1]);
            }
            
            if (isNaN (p[1]) && !isNaN(op[1]))
            {
                ctx.lineTo(p[0], p[1]);
                ctx.stroke();
                ctx.closePath();
            }
            
            // Dernier point
            if (n==xx.length-1 && !isNaN(p[1]))
            {
                ctx.lineTo(p[0], p[1]);
                ctx.stroke();
                ctx.closePath();
            }
            
            op[1] = p[1];
        }
        
        /*
        var n, p;

        ctx.beginPath();
        for (n=0; n<xx.length; n++)
        {
            // Point à représenter
            p = ctx.pt2px([xx[n],yy[n]]);
            p[0] = p[0]+0.5;
            p[1] = p[1]+0.5;

            // Trace la ligne avec le point précédent
            if (n==0)
                ctx.moveTo(p[0], p[1]);
            else
                ctx.lineTo(p[0], p[1]);
                
        }
        ctx.stroke();
        ctx.closePath();
        */
    };

    // ***************************************************************************************** //

    // Trace des impulsions de Dirac
    ctx.dirac = function(xx,yy)
    {
        var n, p, z, s;
        
        // Ligne horizontale
        ctx.beginPath();
        ctx.moveTo(0, cnv.height/2);
        ctx.lineTo(cnv.width, cnv.height/2);
        ctx.stroke();
        ctx.closePath();

        // Origine
        z = ctx.pt2px([0, 0]);
        z[1] = Math.round(z[1])+0.5;

        for (n=0; n<xx.length; n++)
        {
            // Signe des ordonnées (pour connaître l'orientation de la flèche)
            s = Math.sign(yy[n]);
            
            // Point à représenter
            p = ctx.pt2px([xx[n],yy[n]]);
            p[0] = Math.round(p[0])+0.5;
            p[1] = p[1]+0.5;

            // Barre verticale
            ctx.beginPath();
            ctx.moveTo(p[0], z[1]);
            ctx.lineTo(p[0], p[1]);
            ctx.stroke();
            ctx.closePath();

            // Petite flèche
            ctx.beginPath();
            ctx.moveTo(p[0]-5, p[1]+7*s);
            ctx.lineTo(p[0], p[1]);
            ctx.lineTo(p[0]+5, p[1]+7*s);
            ctx.stroke();
            ctx.closePath();
        }
    };

    // ***************************************************************************************** //

    // Trace un signal sans relier les points, avec des barres verticales (pour un signal discret)
    ctx.stem = function(xx,yy)
    {
        var n, p, z;

        // Origine
        z = ctx.pt2px([0, 0]);
        z[1] = Math.round(z[1])+0.5;

        for (n=0; n<xx.length; n++)
        {
            // Point à représenter
            p = ctx.pt2px([xx[n],yy[n]]);
            p[0] = Math.round(p[0])+0.5;
            p[1] = p[1]+0.5;

            // Barre verticale
            ctx.beginPath();
            ctx.moveTo(p[0], z[1]);
            ctx.lineTo(p[0], p[1]);
            ctx.stroke();
            ctx.closePath();

            // Petit disque
            ctx.beginPath();
            ctx.arc(p[0], p[1], 3, 0, 6.2831853, true);
            ctx.fill();
            ctx.closePath();
        }
    };;

    // ***************************************************************************************** //

    // Trace un signal sans relier les points, sans barres verticales (pour un signal discret)
    ctx.dots = function(xx,yy)
    {
        var n, p;

        for (n=0; n<xx.length; n++)
        {
            // Point à représenter
            p = ctx.pt2px([xx[n],yy[n]]);
            p[0] = Math.round(p[0])+0.5;
            p[1] = p[1]+0.5;

            // Petit disque
            ctx.beginPath();
            ctx.arc(p[0], p[1], 3, 0, 6.2831853, true);
            ctx.fill();
            ctx.closePath();
        }
    };

    // ***************************************************************************************** //

    // Trace un point en (x,y) de rayon r
    ctx.dot = function(x, y, r)
    {
        // Point à représenter
        var p = ctx.pt2px([x,y]);
        p[0] = Math.round(p[0])+0.5;
        p[1] = p[1]+0.5;

        // Représente le point
        ctx.beginPath();
        ctx.arc(p[0], p[1], r, 0, 6.2831853, true);
        ctx.fill();
        ctx.closePath();
    };

    // ***************************************************************************************** //

    // Évènement : souris qui se déplace sans bouton appuyé
    ctx.mouseMove = function(f)
    {
        cnv.addEventListener('mousemove', function(evt)
        {
            if (evt.buttons!=0)
                return;

          var rect = cnv.getBoundingClientRect();
          var x = Math.round(evt.clientX - rect.left); // pourquoi pas valeurs entières ?
          var y = Math.round(evt.clientY - rect.top);
          var p = ctx.px2pt([x, y]);
          x = p[0];
          y = p[1];
          f(x, y);
        });
    };

    // ***************************************************************************************** //

    // Évènement : souris qui se déplace et bouton appuyé
    ctx.mouseDrag = function(f)
    {
        cnv.addEventListener('mousemove', function(evt)
        {
            if (evt.buttons==0)
                return;
                
            cnv.style.cursor = 'default';
            var rect = cnv.getBoundingClientRect();
            var x = Math.round(evt.clientX - rect.left);
            var y = Math.round(evt.clientY - rect.top);
            var p = ctx.px2pt([x, y]);
            x = p[0];
            y = p[1];
            f(x, y);
        });
        cnv.addEventListener('touchmove', function(evt)
        {
            var rect = cnv.getBoundingClientRect();
            var x = Math.round(evt.targetTouches[0].pageX - rect.left);
            var y = Math.round(evt.targetTouches[0].pageY - rect.top + document.body.getBoundingClientRect().top);
            var p = ctx.px2pt([x, y]);
            x = p[0];
            y = p[1];
            f(x, y);
            evt.preventDefault();
        });
    };

    // ***************************************************************************************** //

    // Retourne le contexte
    return ctx;


    /*

    // Propriétés et méthodes associées
    ctx.ctx = ctx;
    ctx.mycanvas = cnv;


    // Trace une ligne brisée aux coordonnées définies dans x (abscises) et y (ordonnées)
    ctx.line = function(x,y)
    {
        var i;
        ctx.beginPath();
        ctx.moveTo(x[0]+0.5, y[0]+0.5);
        for(i=1; i<x.length; i++)
        {
            if (isNaN(y[i-1]))
            { ctx.moveTo(x[i]+0.5, y[i]+0.5); }
            else
            { ctx.lineTo(x[i]+0.5, y[i]+0.5); }
        }
        ctx.stroke();
        ctx.closePath();
    }

    // Trace un rectangle vide aux coordonnées (x,y) et de dimension (w,h)
    ctx.rect = function(x,y,w,h)
    {
        ctx.beginPath();
        ctx.rect(x+0.5, y+0.5, w, h);
        ctx.stroke();
        ctx.closePath();
    }

    // Trace un rectangle plein aux coordonnées (x,y) et de dimension (w,h)
    ctx.rectf = function(x,y,w,h)
    {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fill();
        ctx.closePath();
    }

    // Trace un cercle vide de centre (x,y) et de rayon r
    ctx.circle = function(x,y,r)
    {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.2831853, true);
        ctx.stroke();
        ctx.closePath();
    }

    */

}




/****************************************************** */
/* FONCTIONS MATHÉMATIQUES POUR LE TRAITEMENT DU SIGNAL */
/****************************************************** */

// Produit de convolution
/*
    z = conv(x, y) calcule le produit de convolution entre x et y (tous deux de taille N)
    et renvoie le résultat dans une nouvelle liste de taille N.
    Correspond à z = conv(x, y, 'same') en Matlab.
*/
function conv(x,y)
{
    var z = [];
    var i ,j, tmp, jmin, jmax;
    var N = x.length; // = y.length
    for(i = (N-1)/2; i <= (N-1)*3/2; i++)
    {
        tmp = 0;
        jmin = Math.max(0,i-N+1);
        jmax = Math.min(i,N-1);
        for(j = jmin; j <= jmax; j++)
        {
            tmp += x[j] * y[i-j];
        }
        z[i-((N-1)/2)] = tmp;
    }
    return z;
}

// Liste de progression arithmétique
/*
    n = range(N)        renvoie la liste [1, 2, 3, ..., N]
    n = range(a, b)     renvoie la liste [a, a+1, a+2, ..., b-1, b]
    n = range(a, b, d)  renvoie la liste [a, a+d, a+d, ..., b]
*/
function range(a, b, c)
{
    var i, n = [];
    if      (arguments.length==1)
    {
        for (i = 1; i <= a; i++)
            n.push(i);
    }
    else if (arguments.length==2)
    {
      if (a<b)
      {
        for (i = a; i <= b; i++)
            n.push(i);
      }
      else
      {
        for (i = a; i >= b; i--)
            n.push(i);
      }
    }
    else if (arguments.length==3)
    {
      if (c>0)
      {
        for (i = a; i <= b; i=i+c)
            n.push(i);
      }
      else
      {
        for (i = a; i >= b; i=i+c)
            n.push(i);
      }
    }
   return n;
}
