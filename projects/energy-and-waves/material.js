(function installMaterial(){
 const panel=document.createElement("section");panel.id="materialPanel";panel.className="hidden";
 panel.innerHTML='<div class="materialIntro"><h3>Properties and dimensions of matter</h3><p>Choose one quantity to change. Density describes a material; length and thickness describe a sample; reflectivity depends on the surface and light.</p></div><div class="materialTabs" role="group" aria-label="Choose a material investigation"><button data-property="density" class="active">Density</button><button data-property="length">Length</button><button data-property="thickness">Thickness</button><button data-property="reflectivity">Reflectivity</button></div><canvas id="materialCanvas" width="960" height="450" role="img" aria-label="Interactive illustration of material dimensions, density, and light response"></canvas><div class="materialControls"><label for="materialSlider" id="materialSliderLabel">Density (g/cm³)</label><input type="range" id="materialSlider"><output id="materialSliderValue"></output></div><div class="materialValues" id="materialValues" aria-live="polite"></div><p class="materialCaution">Idealized sample: density is independent of dimensions; in the light model, attenuation is fixed and reflected, transmitted, and absorbed fractions sum to 100%.</p>';
 document.querySelector("#explorePage .canvasCard").insertAdjacentElement("beforebegin",panel);
 const canvas=panel.querySelector("#materialCanvas"),ctx=canvas.getContext("2d");
 const vals={density:2.5,length:8,thickness:4,reflectivity:22};
 let current="density";
 const meta={
  density:{label:"Density",min:.5,max:8,step:.25,unit:"g/cm³"},
  length:{label:"Length",min:2,max:15,step:.5,unit:"cm"},
  thickness:{label:"Thickness",min:1,max:15,step:1,unit:"mm"},
  reflectivity:{label:"Surface reflectivity",min:0,max:90,step:5,unit:"%"}
 };
 function box(x,y,w,h,fill="#20355a"){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h)}
 function line(x,y,X,Y,color,width=3){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.stroke()}
 function txt(t,x,y,size=17,color="#e5f3ff",align="left"){ctx.fillStyle=color;ctx.font=`700 ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(t,x,y)}
 function arrow(x,y,X,Y,color,width=5){line(x,y,X,Y,color,width);const a=Math.atan2(Y-y,X-x),l=14;line(X,Y,X-l*Math.cos(a-.45),Y-l*Math.sin(a-.45),color,width);line(X,Y,X-l*Math.cos(a+.45),Y-l*Math.sin(a+.45),color,width)}
 function render(){
  const m=meta[current],value=vals[current];
  panel.querySelector("#materialSliderLabel").textContent=`${m.label} (${m.unit})`;
  const slider=panel.querySelector("#materialSlider");slider.min=m.min;slider.max=m.max;slider.step=m.step;slider.value=value;
  panel.querySelector("#materialSliderValue").textContent=`${value} ${m.unit}`;
  ctx.clearRect(0,0,960,450);box(0,0,960,450,"#101b3b");
  for(let x=40;x<960;x+=40)line(x,0,x,450,"#223457",.7);
  for(let y=40;y<450;y+=40)line(0,y,960,y,"#223457",.7);
  const rho=current==="density"?vals.density:2.5;
  const length=current==="length"?vals.length:8;
  const thickness=current==="thickness"?vals.thickness:4;
  const R=current==="reflectivity"?vals.reflectivity/100:.22;
  if(current==="density"||current==="length"){
    const blockW=length*43;
    box(90,160,blockW,138,"#337baf");box(90,160,blockW,20,"#5aabe0");
    line(90,319,90+blockW,319,"#ffe392",3);
    line(90,309,90,328,"#ffe392",3);line(90+blockW,309,90+blockW,328,"#ffe392",3);
    txt(`Length: ${length.toFixed(1)} cm`,90+blockW/2,354,18,"#ffe392","center");
    txt(`Density: ${rho.toFixed(2)} g/cm³`,90,113,22,"#c5eaff");
    const volume=length*4*1;const mass=rho*volume;
    txt(`Volume: ${volume.toFixed(1)} cm³`,535,195,20,"#cfe0fa");
    txt(`Mass: ${mass.toFixed(1)} g`,535,238,20,"#cfe0fa");
    txt("ρ = mass ÷ volume",535,285,21,"#ffe392");
    txt("This block's width and thickness are fixed.",90,397,16,"#a6bbdb");
    panel.querySelector("#materialValues").textContent=`Sample length ${length.toFixed(1)} cm × width 4.0 cm × thickness 1.0 cm. Density ${rho.toFixed(2)} g/cm³. Calculated volume ${volume.toFixed(1)} cm³ and mass ${mass.toFixed(1)} g.`;
  }else{
    const trans=(1-R)*Math.exp(-.15*thickness),abs=(1-R)-trans;
    const slabW=50+thickness*13;
    const slabX=445;
    box(slabX,120,slabW,230,"#446789");
    txt(`Sample thickness ${thickness.toFixed(0)} mm`,slabX+slabW/2,385,16,"#cce1ff","center");
    arrow(80,235,slabX-8,235,"#ffe392",5);
    arrow(slabX,225,285,90,"#a58bff",Math.max(2,6*R));
    arrow(slabX+slabW+8,235,845,235,"#59ddcd",Math.max(2,6*trans));
    txt("Incoming light",95,204,17,"#ffe392");
    txt(`Reflection ${(R*100).toFixed(0)}%`,95,72,18,"#bba4ff");
    txt(`Transmission ${(trans*100).toFixed(0)}%`,620,208,18,"#59ddcd");
    txt(`Absorption ${(abs*100).toFixed(0)}%`,620,340,18,"#ffb7a6");
    txt("Idealized absorption: T = (1 − R)e^(−αd)",98,416,18,"#cce1ff");
    panel.querySelector("#materialValues").textContent=`Illustrative coefficients: reflectivity ${(R*100).toFixed(0)}%, transmitted ${(trans*100).toFixed(1)}%, absorbed ${(abs*100).toFixed(1)}%. Thickness ${thickness} mm, attenuation coefficient 0.15 mm⁻¹; values total 100%.`;
  }
 }
 panel.querySelector(".materialTabs").addEventListener("click",e=>{
   const b=e.target.closest("[data-property]");if(!b)return;
   current=b.dataset.property;
   panel.querySelectorAll(".materialTabs button").forEach(el=>el.classList.toggle("active",el===b));
   render();
 });
 panel.querySelector("#materialSlider").addEventListener("input",e=>{
   vals[current]=Number(e.target.value);render();window.energyWavesModelChanged?.(0);
 });
 window.EnergyMaterial={panel,render};
 render();
})();