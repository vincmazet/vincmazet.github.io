/*
    PRODUIT DE CONVOLUTION DISCRET UNIDIMENSIONNEL
    
    Version du 14/09/2014
    
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

window.onload = function ()
{
    // Canvas & contexte
    var cnv = document.getElementById("conv1d");
    var ctx = cnv.getContext("2d");
    
    // Evite la sélection lors d'un double clic    
    cnv.onselectstart = function () { return false; };
    
    // Taille des graphes
    var gw = 150;
    var gh = 100;
    var gs = 20;
    var N = 6;
    
    // Taille du Canvas 
    cw = 2*gw +   gs;
    ch = 5*gh + 3*gs;
    cnv.width = cw;
    cnv.height = ch;
    cnv.style.width = cw + 'px';
    cnv.style.height = ch + 'px';
    
    // Couleur du texte
    clrtxt = "#404040";
    
    // Etat du bouton de la souris (appuyé ou non)
    var mouseDown = false;
    
    // Indice de la souris
    var k = 0;
    
    // Graphiques
    var g1 = new graph(ctx,     0,           0,      gw, gh);
    var g2 = new graph(ctx, gw+gs,           0,      gw, gh);
    var g3 = new graph(ctx,     0,       gh+gs, 2*gw+gs, gh);
    var g4 = new graph(ctx,     0,   2*(gh+gs), 2*gw+gs, gh);
    var g5 = new graph(ctx,     0,   3*(gh+gs), 2*gw+gs, 2*gh);
               
    g1.xlim = [-N-1, N+1]; g1.ylim = [-2, 2];
    g2.xlim = [-N-1, N+1]; g2.ylim = [-2, 2];
    g3.xlim = [-2*N-1, 2*N+1]; g3.ylim = [-2, 2];
    g4.xlim = [-2*N-1, 2*N+1]; g4.ylim = [-2, 2];
    g5.xlim = [-2*N-1, 2*N+1]; g5.ylim = [-4, 4];
    
    sig1 = 1;
    sig2 = 1;
    
    // Renvoit les valeurs d'un signal pré-enregistré
    function initsignal(M,type)
    {
        var i;
        var sig = [];
        switch (type)
        {
//            case "nul":
//                for(i = 0;i < N;i++)
//                    sig[i] = 0;
//                break;
                
            case "sin":
                for(i=0;i<M;i++)
                    sig[i] = Math.sin( (i-(M-1)/2) / M *    4 * Math.PI );
                break;
                
            case "rampe":
                for(i=0;i<M;i++)
                    sig[i] = i - (M-1)/2;
                break;
                
            case "exp":
                for(i=0;i<M;i++)
                    if (i-(M-1)/2 < 0)
                        sig[i] = 0;
                    else
                        sig[i] = Math.exp(- (i-(M-1)/2) * 0.8 );
                break;
                
//            case "gauss":
//                for(i = 0;i < N;i++)
//                    sig[i] = 3 * Math.exp(- Math.pow(i-(N-1)/2,2)/4 );
//                break;
                
            case "porte":
                for(i=0;i<M;i++)
                    if (Math.abs(i-(M-1)/2) > 3)
                        sig[i] = 0;
                    else
                        sig[i] = 1;
                break;
                
            case 'portedec':
                for(i=0;i<M;i++)
                    if ((i-(M-1)/2 >= 0) && (i-(M-1)/2 < 4))
                        sig[i] = 1;
                    else
                        sig[i] = 0;
                break;
                
            case 'haar':
                for(i=0;i<M;i++)
                {
                    n = i - (M-1)/2;
                    if ((n>=-3) && (n<0))
                        sig[i] = -1;
                    else if ((n>=0) && (n<3))
                        sig[i] = 1;
                    else
                        sig[i] = 0;
                }
                break;
                
            case 'kron':
                for(i=0;i<M;i++)
                    if (i-(M-1)/2 == 0)
                        sig[i] = 1;
                    else
                        sig[i] = 0;
                break;
                
        }
        
        return sig;
    }
    
    // Affichage des signaux
    function draw()
    {   
        // Efface le canvas
        clearCanvas(cnv,ctx)
        
        // Affiche les axes
        ctx.strokeStyle = '#c0c0c0';
        ctx.fillStyle = '#c0c0c0';
        ctx.font = '100% Source Sans Pro';
        ctx.lineWidth = 1;
        g1.axes(); g1.xgrid(1,3,0); g1.ygrid(1,3,0); g1.xtitle('m');
        g2.axes(); g2.xgrid(1,3,0); g2.ygrid(1,3,0); g2.xtitle('m');
        g3.axes(); g3.xgrid(1,3,0); g3.ygrid(1,3,0); g3.xtitle('m');
        g4.axes(); g4.xgrid(1,3,0); g4.ygrid(1,3,0); g4.xtitle('m');
        g5.axes(); g5.xgrid(1,3,0); g5.ygrid(1,3,0); g5.xtitle('n');
        
        // Signaux
        var x = [], y = [], yr = [], xy = [], z = [], zk = 0;
        var n = initsignal(2*N+1,"rampe");
        var m = initsignal(4*N+1,"rampe");
        
        if (sig1 == 1)
            signal1 = 'porte';
        else if (sig1 == 2)
            signal1 = 'haar';
        else if (sig1 == 3)
            signal1 = 'portedec';
        else
            signal1 = 'kron';
            
        if (sig2 == 1)
            signal2 = 'porte';
        else if (sig2 == 2)
            signal2 = 'haar';
        else if (sig2 == 3)
            signal2 = 'portedec';
        else
            signal2 = 'kron';
            
        // Signal x[n] en fonction de n
        x = initsignal(2*N+1,signal1)            
        ctx.fillStyle = 'blue'
        ctx.strokeStyle = 'blue';
        g1.ytitle('x[m]');
        g1.stem(n,x);
        
        // Signal y[n] en fonction de n
        x = initsignal(2*N+1,signal2);
        ctx.fillStyle = 'red'
        ctx.strokeStyle = 'red';
        g2.ytitle('y[m]');
        g2.stem(n,x);
        
        // Signal y[n-m] en fonction de m
        x = initsignal(4*N+1,signal1);
        ctx.fillStyle = 'blue'
        ctx.strokeStyle = 'blue';
        text(ctx,'x[m]',gw-25,gh+gs);
        g3.stem(m,x);
        y = initsignal(4*N+1,signal2);
        for(i=0;i<4*N+1;i++)
        {
            yr[i] = y[4*N-i+k];
            if (isNaN(yr[i]))
                yr[i] = 0;
        }
        ctx.fillStyle = 'red'
        ctx.strokeStyle = 'red';
        g3.ytitle('y[' + k + '-m]');
        g3.stem(m,yr);
        
        // Signal x[m]*y[n-m] en fonction de m
        for(i=0;i<4*N+1;i++)
            xy[i] = x[i]*yr[i];
        ctx.fillStyle = 'green'
        ctx.strokeStyle = 'green';
        g4.ytitle('x[m]y[' + k + '-m]');
        g4.stem(m,xy);
        
        // Signal z[n] = sum_m x[m]*y[n-m] en fonction de n
        for(i=0;i<4*N+1;i++)
            zk = zk + xy[i];
        z = conv(x,y);
        ctx.fillStyle = 'gray'
        ctx.strokeStyle = 'gray';
        g5.ytitle('(x*y)[n]');
        g5.stem(m,z);
        ctx.fillStyle = 'black'
        ctx.strokeStyle = 'black';
        text(ctx,'z[' + k + ']',gw-25,gh*3+gs*3);
        g5.stem([k],[zk]);  // [.] car il faut des tableaux
        
    }

    // Mise a jour des des valeurs des signaux lors avec la souris */
    function changeOnDown(pos)
    {
        // pos : position de la souris par rapport au canvas
        var i;
        if ((pos.x > g1.x) && (pos.x < g1.x + g1.w)
         && (pos.y > g1.y) && (pos.y < g1.y + g1.h))
        {
            sig1 = (sig1+1) % 4;
            draw();
        }
        if ((pos.x > g2.x) && (pos.x < g2.x + g2.w)
         && (pos.y > g2.y) && (pos.y < g2.y + g2.h))
        {
            sig2 = (sig2+1) % 4;
            draw();
        }
        if (pos.y > g3.y)
        {
            k = Math.round( (pos.x-g3.x) * (g3.xlim[1]-g3.xlim[0]) / g3.w + g3.xlim[0] );
            draw();
        }
    }

    // Appui sur un bouton de la souris
    cnv.addEventListener("mousedown", function(evt)
    {
        mouseDown = true;
        var souris = getOffset(cnv,evt);
        changeOnDown(souris);
    }, false);
    
    // Mouvement de la souris
    cnv.addEventListener("mousemove", function(evt)
    {
        if(mouseDown)
        {
            var souris = getOffset(cnv,evt);
            changeOnDown(souris);
        }
        
        // Carré de sélection
        var pos = getOffset(cnv,evt);
        if ((pos.x > g1.x) && (pos.x < g1.x + g1.w)
         && (pos.y > g1.y) && (pos.y < g1.y + g1.h))
            ctx.strokeStyle = 'gray';
        else
            ctx.strokeStyle = 'white';
        rect(ctx,g1.x,g1.y,g1.x+g1.w,g1.y+g1.h);
        
        // Carré de sélection
        var pos = getOffset(cnv,evt);
        if ((pos.x > g2.x) && (pos.x < g2.x + g2.w)
         && (pos.y > g2.y) && (pos.y < g2.y + g2.h))
            ctx.strokeStyle = 'gray';
        else
            ctx.strokeStyle = 'white';
        rect(ctx,g2.x,g2.y,g2.x+g2.w,g2.y+g2.h);
        
    }, false);
    
    // Relâchement de la souris 
    cnv.addEventListener("mouseup", function(evt)
    {
        mouseDown = false;
    }, false);


//
//
//    // Appui sur un bouton de la souris
//    cnv.addEventListener("touchstart", function(evt)
//    {
//        mouseDown = true;
//        //var souris = getOffset(cnv,evt);
//        var rect = cnv.getBoundingClientRect();
//        var touchobj = evt.changedTouches[0];
//        var souris = {
//          x : parseInt(touchobj.clientX) - rect.left,
//          y : parseInt(touchobj.clientY) - rect.top
//        };
//        changeOnDown(souris);
//        draw();
//        evt.preventDefault();
//    }, false);
//    
//    // Mouvement de la souris
//    cnv.addEventListener("touchmove", function(evt)
//    {
//        if(mouseDown)
//        {
//            var rect = cnv.getBoundingClientRect();
//            var touchobj = evt.changedTouches[0];
//            var souris = {
//              x : parseInt(touchobj.clientX) - rect.left,
//              y : parseInt(touchobj.clientY) - rect.top
//            };
//            changeOnDown(souris);
//            draw();
//        }
//        evt.preventDefault();
//    }, false);
//    
//    // Relâchement de la souris 
//    cnv.addEventListener("touchend", function(evt)
//    {
//        mouseDown = false;
//        evt.preventDefault();
//    }, false);
//
//
//*/
//
//    
    // La souris quitte le canvas 
    cnv.addEventListener("mouseleave", function(evt)
    {
        mouseDown = false;
        ctx.strokeStyle = 'white';
        rect(ctx,g1.x,g1.y,g1.x+g1.w,g1.y+g1.h);
        rect(ctx,g2.x,g2.y,g2.x+g2.w,g2.y+g2.h);
    }, false);
  
    
    // Affichage initial
    draw();    
}
