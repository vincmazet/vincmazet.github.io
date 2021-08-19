/*
    ANIMATIONS PÉDAGOGIQUES EN JAVASCRIPT
    
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


/* Produit de convolution */
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

/* Initialise le <div> */
function inidiv(id, w, h)
{
    var o = document.getElementById(id);
    o.style.width  = w.toString() + 'px';
    o.style.height = h.toString() + 'px';
    return o;
}

// Etiquette
function Label(id, t, x, y, c, align)
{
    var o = document.createElement('div');
    
    // Position
    o.style.position = 'absolute';
    if (typeof align==='undefined') { align = '' ;}
    if (align.search('b')>-1) {o.style.bottom = y.toString() + 'px';} else {o.style.top = y.toString() + 'px'; }
    if (align.search('r')>-1) {o.style.right = x.toString() + 'px'; } else {o.style.left = x.toString() + 'px';}
    
    // Autres propriétés
    o.style.color = c;
    o.innerHTML = t;
    id.appendChild(o);
    
    // Transcription avec MathJax
    // http://docs.mathjax.org/en/latest/typeset.html
    // http://docs.mathjax.org/en/latest/api/hub.html
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,o]);
    
    return o;
}

// Bouton
function Button(id, t, x, y, w, h, tip)
{
    var o = document.createElement('button');
    o.style.position = 'absolute';
    o.style.left = x.toString() + 'px';
    o.style.top  = y.toString() + 'px';
    o.style.width = w.toString() + 'px';
    o.style.height  = h.toString() + 'px';
    o.className = 'anim-button';
    //var tt = document.createTextNode(t);
    //o.appendChild(tt);
    o.title = tip;
    o.innerHTML = t;
    id.appendChild(o);
    return o;
}

// Sélecteur de choix sous forme de liste
function Select(id, x, y, w, list)
{
    var o = document.createElement('select');
    o.style.position = 'absolute';
    o.style.left = x.toString() + 'px';
    o.style.top  = y.toString() + 'px';
    o.style.width= w.toString() + 'px';
    
    var option = [];
    for(var i=0; i<list.length; i++)
    {
        option[i] = document.createElement("option")
        option[i].text = list[i];
        o.add(option[i]);
    }
    o.option = option;
    
    id.appendChild(o);
    return o;
}

// Bouton Effacer
function ClearButton(id, x, y)
{
    var o = document.createElement('button');
    o.style.position = 'absolute';
    o.style.left = x.toString() + 'px';
    o.style.top  = y.toString() + 'px';
    o.className = 'anim-button-clear';
    o.title = 'Effacer';
    o.innerHTML = '&times;';
    id.appendChild(o);
    return o;
}

// Ascenceur (TODO: remplacer par le terme technique)
function Slider(id, x, y, w, min, max, value, step)
{
    var o = document.createElement('input');
    o.type = 'range';
    o.min = min;
    o.max = max;
    o.step = step;
    o.value = value; // doit arriver après l'initialisation de min, max et step
    o.style.position = 'absolute';
    o.style.left  = x.toString() + 'px';
    o.style.top   = y.toString() + 'px';
    o.style.width = w.toString() + 'px';
    id.appendChild(o);
    return o;
}

// Silhouette (rectangle gris pour le prototypage de l'interface)
function Silhouette(id, x, y, w, h)
{
    var cnv = document.createElement('canvas');
    cnv.style.position = 'absolute';
    cnv.style.left   = x.toString() + 'px';
    cnv.style.top    = y.toString() + 'px';
    cnv.style.width  = w.toString() + 'px';
    cnv.style.height = h.toString() + 'px';
    cnv.width = w;
    cnv.height = h;
    id.appendChild(cnv);
    
    ctx = cnv.getContext('2d');
    
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fill();
    ctx.closePath();
}

// Graph
// Les graphes sont à créer en dernier, après les Labels notamment)
// pour qu'ils aient le bon z-index et être accessibles avec la souris.
// Ou alors : il faut forcer la propriété z-index
function Graph(id, x, y, w, h)
{
    // Canvas
    var cnv = document.createElement('canvas');
    cnv.style.position = 'absolute';
    cnv.style.left   = x.toString() + 'px';
    cnv.style.top    = y.toString() + 'px';
    cnv.style.width  = w.toString() + 'px';
    cnv.style.height = h.toString() + 'px';
    cnv.width = w;  // Ecran Retina : * window.devicePixelRatio ?
    cnv.height = h; // Ecran Retina : * window.devicePixelRatio ?
    id.appendChild(cnv);
    
    // Contexte
    var ctx = cnv.getContext('2d');
    
    // DEBUG
    //ctx.fillText(window.devicePixelRatio, 10, 10);
    
    // Propriétés par défaut
    xlim = [-1, 1];        // Abscisses limites (pt)
    ylim = [-1, 1];        // Ordonnées limites (pt)
    var msdown = false;    // Etat du bouton de la souris
    
    // Propriétés et méthodes associées
    ctx.xlim = xlim;
    ctx.ylim = ylim;
    ctx.ctx = ctx;
    ctx.mycanvas = cnv;
    
    // Évènement : souris qui se déplace et bouton appuyé
    ctx.mousemovedown = function(f)
    {
        cnv.addEventListener("mousedown", function(evt)
        {
            msdown = true;
        });
        
        cnv.addEventListener('mousemove', function(evt)
        {
            cnv.style.cursor = 'default';
            if (msdown)
            {
                var rect = cnv.getBoundingClientRect();
                var x = Math.round(evt.clientX - rect.left); // pourquoi pas valeurs entières ?
                var y = Math.round(evt.clientY - rect.top);
                var p = ctx.px2pt(x,y);
                x = p[0];
                y = p[1];
                f(x, y);
            }
        });
        
        cnv.addEventListener("mouseup", function(evt)
        {
            msdown = false;
        });
        
        cnv.addEventListener("touchstart", function(evt)
        {
            msdown = true;
            evt.preventDefault();
        });
        
        cnv.addEventListener('touchmove', function(evt)
        {
            cnv.style.cursor = 'default';
            if (msdown)
            {
                var rect = cnv.getBoundingClientRect();
                var touchobj = evt.changedTouches[0];
                var x = Math.round(parseInt(touchobj.clientX) - rect.left); // pourquoi pas valeurs entières ?
                var y = Math.round(parseInt(touchobj.clientY) - rect.top);
                f(x, y);
            }
            evt.preventDefault();
        });
        
        cnv.addEventListener("touchend", function(evt)
        {
            msdown = false;
            evt.preventDefault();
        });
    }
    
    // Grille
    ctx.axes = function()
    {
        // Points caractéristiques du graphe
        var p, x0, y0;
        p = ctx.pt2px(0, 0);
        x0 = Math.round(p[0]);
        y0 = Math.round(p[1]);
	
        // Axes
        // line rajoute systématiquement 0.5 !
        ctx.line( [-0.5,cnv.width+0.5], [y0,y0]);
        ctx.line( [x0,x0], [cnv.height+0.5,-0.5]);
    }
    
    // Efface le graphe
    ctx.clear = function()
    {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
    }
    
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
    
    /* Trace un rectangle vide aux coordonnées (x,y) et de dimension (w,h) */
    ctx.rect = function(x,y,w,h)
    {
        ctx.beginPath();
        ctx.rect(x+0.5, y+0.5, w, h);
        ctx.stroke();
        ctx.closePath();
    }

    /* Trace un rectangle plein aux coordonnées (x,y) et de dimension (w,h) */
    ctx.rectf = function(x,y,w,h)
    {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fill();
        ctx.closePath();
    }

    /* Trace un cercle vide de centre (x,y) et de rayon r */
    ctx.circle = function(x,y,r)
    {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.2831853, true);
        ctx.stroke();
        ctx.closePath();
    }

    /* Trace un cercle plein de centre (x,y) et de rayon r */
    ctx.circlef = function(x,y,r)
    {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.2831853, true);
        ctx.fill();
        ctx.closePath();
    }

    // Conversion point du graphe -> pixel du canvas
    ctx.pt2px = function(ptx,pty)
    {
        var pxx =              (ptx - ctx.xlim[0]) / (ctx.xlim[1] - ctx.xlim[0]) * cnv.width;
        var pxy = cnv.height - (pty - ctx.ylim[0]) / (ctx.ylim[1] - ctx.ylim[0]) * cnv.height;
        return [pxx, pxy];
    }
    
    // Conversion pixel du canvas -> point du graphe
    ctx.px2pt = function(pxx,pxy)
    {
        var ptx =                pxx / cnv.width  * (ctx.xlim[1] - ctx.xlim[0]) + ctx.xlim[0];
        var pty = (cnv.height - pxy) / cnv.height * (ctx.ylim[1] - ctx.ylim[0]) + ctx.ylim[0];
        return [ptx, pty];
    }
    
    // stem
    ctx.stem = function(xx,yy)
    {
        var n, p, x1, y1, y0;
        p = this.pt2px(0, 0);
        y0 = Math.round(p[1]);
        for (n=0; n<xx.length; n++)
        {
            p = ctx.pt2px(xx[n],yy[n]);
            x1 = p[0];
            y1 = p[1];
            if (y0 < y1)
                ctx.line([x1,x1], [y0-0.5,y1+0.5]);
            else
                ctx.line([x1,x1], [y0+0.5,y1-0.5]);
            ctx.circlef(x1, y1, 2 + ctx.lineWidth);
        }
    }
    
    // plot
    ctx.plot = function(xx,yy)
    {
        var n, p;
        var N = xx.length;
        var xn = new Array(N);
        var yn = new Array(N);
        for (n=0; n<xx.length; n++)
        {
            p = ctx.pt2px(xx[n],yy[n]);
            xn[n] = p[0];
            yn[n] = p[1];
        }
        /*
          function mettreAuPluriel(singulier) {
            return singulier + "s";
          }
          var singuliers = ["pied", "main", "tête"];
          var pluriels = singuliers.map(mettreAuPluriel);*/
        ctx.line(xn, yn);
    }
    
    // plot
    ctx.plotround = function(xx,yy)
    {
        var n, p;
        var N = xx.length;
        var xn = new Array(N);
        var yn = new Array(N);
        for (n=0; n<2; n++)
        {
            //p = ctx.pt2px(xx[n],yy[n]);
            p = ctx.pt2px(xx[n],yy[1]);
            xn[n] = n*100;
            yn[n] = Math.round(p[1]);
        }
        /*
          function mettreAuPluriel(singulier) {
            return singulier + "s";
          }
          var singuliers = ["pied", "main", "tête"];
          var pluriels = singuliers.map(mettreAuPluriel);*/
        ctx.line(xn, yn);
    }

    // plotf
    ctx.plotf = function(xx,yy)
    {
        ctx.plot(xx,yy);
        ctx.fill();
    }
    
    // Grille
    ctx.grid = function(dx, dy)
    {
      var i, dx = dx || 1, dy = dy || 1;
      var p;
      ctx.beginPath();
      
      // Grille sur les abscisses (lignes verticales)
      for (i=Math.floor(ctx.xlim[0]/dx)*dx; i<=Math.floor(ctx.xlim[1]/dx)*dx; i=i+dx)
      {
          p = (i-ctx.xlim[0]) / (ctx.xlim[1]-ctx.xlim[0]) * (cnv.width-1) +0.5;
          ctx.moveTo(p, 0);
          ctx.lineTo(p, cnv.height);
      }
      
      // Grille sur les ordonnées (lignes horizontales)
      for (i=Math.floor(ctx.ylim[0]/dy)*dy; i<=Math.floor(ctx.ylim[1]/dy)*dy; i=i+dy)
      {
          p = (i-ctx.ylim[0]) / (ctx.ylim[1]-ctx.ylim[0]) * (cnv.height-1) + 0.5;
          ctx.moveTo(0, p);
          ctx.lineTo(cnv.width, p);
      }
      ctx.stroke();
      ctx.closePath();
    }
    
    // Retourne le contexte
    return ctx;
    
}
