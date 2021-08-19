/*
    REPRÉSENTATION D'UNE SINUSOÏDE
    
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


// Objets
var anim, gb, gf, slda, sldf, sldp, lbla, lblf, lblp;

// Paramètres
var a = 1;              // Amplitude de la sinusoïde
var f = 1;              // Fréquence de la sinusoïde
var p = 0;              // Phase de la sinusoïde
var N = 300;            // Nombre de points du signal
var xmax = 5;           // Valeur extrême des abscisses
var ymax = 3;           // Valeur extrême des ordonnées
var msdown = true;      // Etat du bouton de la souris

window.onload = function (){ init(); }

function init()
{
    // Animation
    anim = inidiv('sinus', 350, 320);
    
    // Graphe d'arrière-plan
    gb = new Graph(anim, 0, 0, 350, 200);
    gb.xlim = [-xmax, xmax];
    gb.ylim = [-ymax, ymax];
    
    // Graphe d'avant-plan
    gf = new Graph(anim, 0, 0, 350, 200);
    gf.xlim = [-xmax, xmax];
    gf.ylim = [-ymax, ymax];
    
    // Etiquettes du graphe
    Label(anim, '\\(t\\)', 1, 100, '#b0b0b0', 'tr');
    Label(anim, '\\(x(t)\\)', 177, 2, '#b0b0b0', 'tl');
    
    // Slider et étiquette "Amplitude"
    lbla = Label(anim, 'Amplitude : ', 0, 220);
    slda = Slider(anim, 150, 220, 200, -3,  3, a, 0.1);
    //slda.addEventListener('mousemove', draw, false);
    //slda.addEventListener('touchmove', draw, false);
    slda.addEventListener('mousemove', function() {setTimeout(draw,50);}, false);
    slda.addEventListener('mousedown', function() {msdown = true;},       false);
    slda.addEventListener('mouseup',   function() {msdown = false;},      false);
    slda.addEventListener('touchmove', function() {setTimeout(draw,50);}, false);
    slda.addEventListener('touchdown', function() {msdown = true;},       false);
    slda.addEventListener('touchup',   function() {msdown = false;},      false);
    
    // Slider et étiquette "Fréquence"
    lblf = Label(anim, 'Fréquence : ', 0, 250);
    sldf = Slider(anim, 150, 250, 200, 0.1, 2, f, 0.1);
    //sldf.addEventListener('mousemove', draw, false);
    //sldf.addEventListener('touchmove', draw, false);
    sldf.addEventListener('mousemove', function() {setTimeout(draw,50);}, false);
    sldf.addEventListener('mousedown', function() {msdown = true;},       false);
    sldf.addEventListener('mouseup',   function() {msdown = false;},      false);
    sldf.addEventListener('touchmove', function() {setTimeout(draw,50);}, false);
    sldf.addEventListener('touchdown', function() {msdown = true;},       false);
    sldf.addEventListener('touchup',   function() {msdown = false;},      false);
    
    // Slider et étiquette "Phase"
    lblp = Label(anim, 'Phase : ', 0, 280);
    sldp = Slider(anim, 150, 280, 200, 0, 6.28, p, 0.1);
    //sldp.addEventListener('mousemove', draw, false);
    //sldp.addEventListener('touchmove', draw, false);
    sldp.addEventListener('mousemove', function() {setTimeout(draw,50);}, false);
    sldp.addEventListener('mousedown', function() {msdown = true;},       false);
    sldp.addEventListener('mouseup',   function() {msdown = false;},      false);
    sldp.addEventListener('touchmove', function() {setTimeout(draw,50);}, false);
    sldp.addEventListener('touchdown', function() {msdown = true;},       false);
    sldp.addEventListener('touchup',   function() {msdown = false;},      false);
    
    // Grille et axes
    gb.strokeStyle = '#d0d0d0';
    gb.grid();
    gb.strokeStyle = '#b0b0b0';
    gb.axes();
    
    // Affiche la sinusoïde
    draw();
    msdown = false;
}

function draw()
{
    // N'exécute la fonction que si le bouton de la souris est enfoncé
    // (inutile de tracer si la souris se déplace simplement sur le slider)
    if (msdown === false) {return;}
    var n, t = [], y = [];
    
    // Récupère les valeurs des sliders
    a = parseFloat(slda.value);
    f = parseFloat(sldf.value);
    p = parseFloat(sldp.value);
    
    // Arrondi les valeurs (bugs sur certains navigateurs)
    a = Math.round(a*10) / 10;
    f = Math.round(f*10) / 10;
    p = Math.round(p*10) / 10;
    
    // Etiquettes de valeur
    lbla.innerHTML = 'Amplitude : ' + a.toString();
    lblf.innerHTML = 'Fréquence : ' + f.toString();
    lblp.innerHTML = 'Phase : ' + p.toString() + ' radians';
    
    // Calcule les valeurs de la sinusoïde
    for(n = 0; n < N; n++)
    {
        t[n] = n/N*2*xmax - xmax;
        y[n] = a * Math.sin( 2 * Math.PI * f * t[n] + p );
    }
    
    // Affiche la sinusoïde
    gf.clear();
    gf.lineWidth = 1;
    gf.strokeStyle = '#0020e0';
    gf.plot(t,y);
}
