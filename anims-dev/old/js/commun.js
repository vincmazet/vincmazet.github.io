/*
    ANIMATIONS PÉDAGOGIQUES EN JAVASCRIPT
    
    Version du 12/09/2014
    
    Copyright Vincent Mazet (vincent.mazet@unistra.fr) et Frank Schorr, 2014.

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

/* Trace une ligne brisée aux coordonnées définies dans x (abscises) et y (ordonnées) */
function line(context,x,y)
{
    var i;
    context.beginPath();
    context.moveTo(x[0]+0.5, y[0]+0.5);
    for(i=1; i<x.length; i++)
    {
        context.lineTo(x[i]+0.5, y[i]+0.5);
    }
    context.stroke();
    context.closePath();
}

/* Trace un rectangle vide aux coordonnées (x,y) et de dimension (w,h) */
function rect(context,x,y,w,h)
{
    context.beginPath();
    context.rect(x+0.5, y+0.5, w, h);
    context.stroke();
    context.closePath();
}

/* Trace un rectangle plein aux coordonnées (x,y) et de dimension (w,h) */
function rectf(context,x,y,w,h)
{
    context.beginPath();
    context.rect(x, y, w, h);
    context.fill();
    context.closePath();
}

/* Trace un cercle vide de centre (x,y) et de rayon r */
function circle(context,x,y,r)
{
    context.beginPath();
    context.arc(x, y, r, 0, 6.2831853, true);
    context.stroke();
    context.fill();
}

/* Trace un cercle plein de centre (x,y) et de rayon r */
function circlef(context,x,y,r)
{
    context.beginPath();
    context.arc(x, y, r, 0, 6.2831853, true);
    context.fill();
    context.fill();
}

/* Écrit une chaine de caractères aux coordonnées (x,y) */
function text(context,txt,x,y)
{
    context.fillText(txt, x+0.5, y+0.5);
}

/* Efface le canvas */
function clearCanvas(canvas,context)
{
    context.clearRect(0,0,canvas.width,canvas.height);
}

/* Position de la souris dans le canvas */
function getOffset(canvas,evt)
{
    var rect = canvas.getBoundingClientRect();
    return { 
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top 
    };
}
        
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
        z[i - ((N-1)/2)] = tmp;
    }
    return z;
}






/* Graphe */
function graph(ctx, x, y, w, h)
{
    // Propriétés
    this.ctx = ctx;             // Contexte
    this.x = x;                 // Abscisse du graphe (px)
    this.y = y;                 // Ordonnée du graphe (px)
    this.w = w;                 // Largeur du graphe (px)
    this.h = h;                 // Hauteur du graphe (px)
    this.xlim = [-1, 1];        // Abscisses limites (pt)
    this.ylim = [-1, 1];        // Ordonnées limites (pt)
    this.xgdelta = 1;           // Espacement de la grille des abscisses (pt) (si = 0 : pas de grille)
    this.xglength = 5;          // Longeur des marques des abscisses (px)
    this.xglabel = 1;           // Espacement de la numérotation des abscisses (pt)
    this.ygdelta = 1;           // Espacement de la grille des ordonnées (pt) (si = 0 : pas de grille)
    this.yglength = 5;          // Longeur des marques des ordonnées (px)
    this.yglabel = 1;           // Espacement de la numérotation des ordonnées (pt)
    this.xtitletext = '';       // Texte en abscisses
    this.ytitletext = '';       // Texte en ordonnées
/*    this.xtickdelta = 1;        // Espacement des marques sur les abscisses (si 0 : pas de marques)
    this.ytickdelta = 1;        // Espacement des marques sur les ordonnées (si 0 : pas de marques)
    this.xticklength = 5;       // Taille (en pixel) des marques (si inf -> grille)
    this.yticklength = 5;       // Taille (en pixel) des marques (si inf -> grille)*/

    // Méthodes
    this.pt2px = pt2px;         // Conversion point -> pixel
    this.px2pt = px2pt;         // Conversion pixel -> point
    this.clear = clear;         // Efface le graphe
    this.axes = axes;           // Affiche les axes
    this.xgrid = xgrid;         // Affiche la grille des abscisses
    this.ygrid = ygrid;         // Affiche la grille des ordonnées
    this.xtitle = xtitle;       // Affiche le titre des abscisses
    this.ytitle = ytitle;       // Affiche le titre des ordonnées
    this.stem = stem;           // stem (comme en Matlab)
    this.plot = plot;           // plot (comme en Matlab)
    this.plotf = plotf;         // plotf
    
    // Convertion point du graphe -> pixel du canvas
    function pt2px(ptx,pty)
    {
        var xmin = this.xlim[0], xmax = this.xlim[1];
        var ymin = this.ylim[0], ymax = this.ylim[1];
        var x = this.x, y = this.y, w = this.w, h = this.h;
        var pxx = x + (ptx - xmin) * w / (xmax - xmin);
        var pxy = y + h - (pty - ymin) * h / (ymax - ymin);
        return [pxx, pxy];
    }

    // Convertion point du graphe -> pixel du canvas
    function px2pt()
    {
    }

    // Efface le graphe
    function clear()
    {
        this.ctx.clearRect(this.x, this.y, this.w, this.h);
    }

    // Affiche les axes
    function axes()
    {
        // Points caractéristiques du graphe
        var p, x0, y0, x1, x2, y1, y2;
        p = this.pt2px(0, 0);
        x0 = Math.round(p[0]);    y0 = Math.round(p[1]);
        x1 = this.x;
        x2 = this.x + this.w;
        y1 = this.y + this.h;
        y2 = this.y;
        
        // Axes
        // line rajoute systématiquement 0.5 !
        line(this.ctx, [x1-0.5,x2+0.5], [y0,y0]);
        line(this.ctx, [x0,x0], [y1+0.5,y2-0.5]);
    }
    
    // Affiche la grille des abscisses
    function xgrid(delta,length,label)
    {
        this.xgriddelta = delta;
        this.xgridlength = length;
        this.xgridlabel = label;
        
        // On sort si on ne veut pas de grille
        if (this.xgriddelta == 0)
            return;
        
        var x, xg, p, y0, x1;
        p = this.pt2px(0, 0);
        y0 = Math.round(p[1]);
        x1 = Math.ceil(this.xlim[0]/delta+1e-6);
        
        // Marques
        for (x = x1; x < this.xlim[1]; x += delta)
        {
            p = this.pt2px(x, 0);
            xg = Math.round(p[0]);
            line(this.ctx, [xg,xg], [y0-length-0.5,y0+length+0.5]);
        }
        
        // On sort si on ne veut pas d'étiquettes
        if (label == 0)
            return;
        
        // Etiquettes
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        for (x = x1; x < this.xlim[1]; x += label)
        {
            if (x==0) continue;
            p = this.pt2px(x, 0);
            xg = Math.round(p[0]);
            text(this.ctx, x, xg, y0+1.5*length);
        }
    }
    
    // Affiche la grille des ordonnées
    function ygrid(delta,length,label)
    {
        this.ygriddelta = delta;
        this.ygridlength = length;
        this.ygridlabel = label;
        
        // On sort si on ne veut pas de grille
        if (this.ygriddelta == 0)
            return;
        
        var y, yg, p, x0, y1;
        p = this.pt2px(0, 0);
        x0 = Math.round(p[0]);
        y1 = Math.ceil(this.ylim[0]/delta+1e-6);
        
        // Marques
        for (y = y1; y < this.ylim[1]; y += delta)
        {
            p = this.pt2px(0, y);
            yg = Math.round(p[1]);
            line(this.ctx, [x0-length-0.5,x0+length+0.5], [yg,yg]);
        }
        
        // On sort si on ne veut pas d'étiquettes
        if (label == 0)
            return;
        
        // Etiquettes
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        y1 = this.ylim[0]/label;
        if (y1 === 0)
            y1 = 0;
        else if (y1 > 0)
            y1 = Math.floor(y1);
        else
            y1 = Math.ceil(y1);
        y1 = y1 * label;
        for (y = y1; y < this.ylim[1]; y += label)
        {
            if (y==0) continue;
            p = this.pt2px(0, y);
            yg = Math.round(p[1]);
            text(this.ctx, y, x0-1.5*length, yg);
        }
    }
    
    // Affiche le titre des abscisses
    function xtitle(label)
    {
        var p, y0;
        p = this.pt2px(0, 0);
        y0 = Math.round(p[1]);
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'bottom';
        text(this.ctx, label, this.x+this.w, y0-1.5*this.ygridlength);
    }
    
    // Affiche le titre des ordonnées
    function ytitle(label)
    {
        var p, x0;
        p = this.pt2px(0, 0);
        x0 = Math.round(p[0]);
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        text(this.ctx, label, x0+1.5*this.ygridlength, this.y);
    }

    // stem
    function stem(xx,yy)
    {
        var n;
        var p, x0, x1, y1;
        p = this.pt2px(0, 0); y0 = Math.round(p[1]); // mettre en variable globale ?
        for (n=0; n<xx.length; n++)
        {
            p = this.pt2px(xx[n],yy[n]);
            x1 = p[0];
            y1 = p[1];
            if (y0 < y1)
                line(this.ctx, [x1,x1], [y0-0.5,y1+0.5]);
            else
                line(this.ctx, [x1,x1], [y0+0.5,y1-0.5]);
            circlef(this.ctx, x1, y1, 2 + this.ctx.lineWidth);
        }
    }

    // plot
    function plot(xx,yy)
    {
        var n;
        var N = xx.length;
        var xn = new Array(N);
        var yn = new Array(N);
        for (n=0; n<xx.length; n++)
        {
            p = this.pt2px(xx[n],yy[n]);
            xn[n] = p[0];
            yn[n] = p[1];
        }
        line(this.ctx, xn, yn);
    }

    // plotf
    function plotf(xx,yy)
    {
        this.plot(xx,yy);
        this.ctx.fill();
    }

}


function graph2()
{
    var canvas = document.createElement('canvas');
    canvas.id     = "CursorLayer";
    canvas.left  = '0px';
    canvas.top = '0px';
    canvas.width  = 50;
    canvas.height = 50;
    canvas.style.zIndex   = 2;
    canvas.style.position = "absolute";
    canvas.style.border   = "1px solid";
    document.body.appendChild(canvas);
}






/*




        // Fonction effaçant un rectangle du canvas UTILE ?
        function clearRectangle(x1,y1,x2,y2,context)
        {
            context.clearRect(x1,y1,x2,y2);
        }


        // Fonction de 'reset' d'un tableau
        function clearTab(tab)
        {
            tab.length = 0;
        }



        function initTabGraph(tab,x,y,longeur)
        {
            var i;
            for(i=0;i<longeur;i++)
            {
                tab[i] = {
                    x : x+i,
                    y : y
                };
            }
        }

        function max(a,b)
        {
            if (a > b) return a;
            else return b;
        }*/



