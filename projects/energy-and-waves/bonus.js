(function installBonus(){
 const host=document.createElement("div");
 host.id="bonusWorkspace";
 const modules=[
  {id:"mechanics",name:"Mechanical waves",lead:"Explore traveling waves, superposition, standing-wave boundaries, and dispersion.",kind:"string",math:"∂²u/∂t² = c²∂²u/∂x²\nu(x,t) = A sin(kx − ωt)\nω = c k  ·  c = √(T/μ)\nP̄ = ½μω²A²c",assumptions:"Small transverse displacement; uniform string with tension T and linear mass density μ. The simple wave equation assumes negligible bending stiffness, damping, and nonlinearities.",challenge:"If the tension quadruples while linear density stays constant, predict how wave speed and the harmonics change.",derivation:"For a short string element, the net transverse tension is T(∂²u/∂x²)dx. Newton's second law gives μdx (∂²u/∂t²) = Tdx (∂²u/∂x²), or c² = T/μ."},
  {id:"acoustics",name:"Acoustic fields",lead:"Connect oscillating particle velocities to propagating pressure disturbances and acoustic impedance.",kind:"sound",math:"∂ρ′/∂t + ρ₀∇·v = 0\nρ₀∂v/∂t = −∇p′\np′ = c²ρ′\n∇²p′ − (1/c²)∂²p′/∂t² = 0\nZ = ρ₀c  ·  Ī = p̂²/(2ρ₀c)",assumptions:"Small-amplitude, linear, inviscid, uniform barotropic fluid; harmonic plane waves in the pressure/intensity formulas. A real speaker produces spreading, frequency-dependent fields.",challenge:"A medium's density doubles while c stays fixed. What happens to characteristic acoustic impedance and intensity for the same peak pressure?",derivation:"Differentiate the linearized continuity equation and use the divergence of linearized Euler momentum. With p′=c²ρ′, eliminate v and ρ′ to obtain the acoustic wave equation."},
  {id:"maxwell",name:"Electromagnetic fields",lead:"Use vector calculus to derive propagating electric and magnetic fields from Maxwell's equations.",kind:"em",math:"∇·E = ρ/ε₀\n∇·B = 0\n∇×E = −∂B/∂t\n∇×B = μ₀J + μ₀ε₀∂E/∂t\n∇²E − μ₀ε₀∂²E/∂t² = 0\nS = (E × B)/μ₀",assumptions:"Wave-equation result is in a homogeneous vacuum, ρ=0 and J=0; a displayed 1D plane wave is idealized. E and B are perpendicular to each other and to propagation.",challenge:"Use the curl of Faraday's law together with Maxwell–Ampère to recover the vacuum wave equation. Where does ∇·E = 0 enter?",derivation:"Take ∇×(∇×E) = ∇(∇·E)−∇²E. Substitute ∇×E=−∂B/∂t and, in vacuum, ∇×B=μ₀ε₀∂E/∂t. This yields ∇²E = μ₀ε₀∂²E/∂t²."},
  {id:"optics",name:"Optical boundaries",lead:"Study refraction, reflection coefficients, and how material properties affect a beam.",kind:"optics",math:"n₁ sin θ₁ = n₂ sin θ₂\nrₛ = (n₁cosθ₁ − n₂cosθ₂)/(n₁cosθ₁ + n₂cosθ₂)\nR = |rₛ|²  ·  T = 1 − R (lossless)\nI(z) = I₀ exp(−αz)",assumptions:"Plane, isotropic, nonmagnetic, lossless dielectric interface for Fresnel energy balance; s-polarized incidence. Absorption equation is a separate homogeneous medium approximation.",challenge:"If n₁=1.5, n₂=1.0, find the critical angle for total internal reflection. How does increased incidence angle change the result?",derivation:"Continuity of the tangential phase along the interface gives k₁ sinθ₁ = k₂ sinθ₂. Because k=nω/c, Snell's law follows. Tangential E and H boundary conditions give Fresnel amplitudes."},
  {id:"speaker",name:"Circuits → speaker → sound",lead:"Link driven circuits, Lorentz force, diaphragm motion, and outgoing acoustic pressure.",kind:"speaker",math:"L di/dt + Ri + Bℓ dx/dt = V(t)\nm d²x/dt² + b dx/dt + Kx = Bℓ i − Fₐc\np′(r,t) ∝ (ρ₀/r) d²x(t−r/c)/dt²\nZₑ(ω) = R + iωL\nω₀ = √(K/m)",assumptions:"Lumped 1D voice coil and diaphragm model, ideal constant force factor Bℓ, linear spring/damping. Far-field pressure expression is schematic: full acoustic radiation depends on diaphragm area, geometry, boundary conditions, and frequency.",challenge:"At low frequency, compare two drive signals with the same voltage amplitude but different frequencies. Which terms oppose coil motion, and why does resonance matter?",derivation:"Faraday induction gives a back-emf proportional to coil velocity. The coil's magnetic force is F=Bℓi. Substitute that force into a driven, damped mass–spring system and couple its acceleration to the surrounding fluid's acoustic field."}
 ];
 let active=0, amplitude=1,frequency=2,phase=0;
 host.innerHTML='<div class="bonusTopics" role="tablist" aria-label="Bonus physics topics"></div><div class="bonusLab" role="tabpanel"><h3 id="bonusTitle"></h3><p id="bonusLead"></p><canvas class="bonusLabCanvas" id="bonusCanvas" width="800" height="300" aria-label="Dynamic field or wave graph"></canvas><div class="bonusControls"><label>Amplitude or drive strength <input type="range" id="bonusAmp" min="0.25" max="2" step="0.25" value="1"></label><label>Frequency or wave mode <input type="range" id="bonusFreq" min="1" max="6" step="0.5" value="2"></label></div><div class="bonusValues" id="bonusNumbers" role="status" aria-live="polite"></div><h4>Governing equations</h4><div class="bonusEquations"><code id="bonusMath"></code></div><details><summary>Assumptions and limitations</summary><p id="bonusAssumptions"></p></details><details><summary>Where do these equations come from?</summary><p id="bonusDerive"></p></details><details><summary>Try a harder physics challenge</summary><p id="bonusChallenge"></p></details><p style="font-size:12px;color:#73819c;margin-top:15px">Educational models; parameters are illustrative unless SI values are stated. These are not numerically calibrated speaker measurements.</p></div>';
 const els=(id)=>host.querySelector("#"+id);
 function renderTabs(){
  host.querySelector(".bonusTopics").innerHTML=modules.map((x,i)=>`<button type="button" data-physics="${i}" class="${active===i?"active":""}" role="tab" aria-selected="${active===i}">${x.name}</button>`).join("");
 }
 function select(i){
  active=i;renderTabs();
  const m=modules[active];els("bonusTitle").textContent=m.name;els("bonusLead").textContent=m.lead;
  els("bonusMath").textContent=m.math;els("bonusAssumptions").textContent=m.assumptions;
  els("bonusDerive").textContent=m.derivation;els("bonusChallenge").textContent=m.challenge;
  draw(0);
 }
 const canvas=els("bonusCanvas"),ctx=canvas.getContext("2d");
 const bg=()=>{ctx.fillStyle="#101a3d";ctx.fillRect(0,0,800,300);ctx.strokeStyle="#21385f";ctx.lineWidth=1;for(let x=40;x<800;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,300);ctx.stroke()}for(let y=40;y<300;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(800,y);ctx.stroke()}};
 const text=(str,x,y,color="#e4efff",size=14)=>{ctx.fillStyle=color;ctx.font=`600 ${size}px system-ui`;ctx.fillText(str,x,y)};
 const line=(x,y,X,Y,color="#94c5ed",width=2)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.stroke()};
 const wave=(fn,color,width=3)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();for(let x=40;x<=760;x+=3){const y=fn(x);if(x===40)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()};
 const detector=(x)=>{line(x,42,x,270,"#ffe28d",2);text("x = fixed",x+7,59,"#ffe28d",12)};
 function draw(t){
  if(!host.isConnected || host.getClientRects().length===0)return;
  const kind=modules[active].kind;bg();
  const v=frequency, a=amplitude,center=152, A=45*a, omega=2*Math.PI*v;
  text("Optional quantitative model • time and length are normalized for comparison",30,24,"#acbfde",12);
  if(kind==="string"){
   line(40,center,760,center,"#647999",1);
   wave(x=>center-A*Math.sin(2*Math.PI*v*(x-40)/720-2*Math.PI*t*.6),"#4ce2d4",4);
   wave(x=>center-A*.45*Math.sin(2*Math.PI*v*(x-40)/720+2*Math.PI*t*.6),"#9b8cff",2);
   text("Traveling waves, opposite propagation directions",48,271);
  }else if(kind==="sound"){
   for(let j=0;j<5;j++)for(let i=0;i<48;i++){const xx=55+i*14.2,phase=2*Math.PI*v*(xx-50)/690-2*Math.PI*t*.35,shift=-7*a*Math.sin(phase);ctx.beginPath();ctx.arc(xx+shift,86+j*30,3.3,0,Math.PI*2);ctx.fillStyle="#51e2d7";ctx.fill();}
   wave(x=>center+95-A*Math.cos(2*Math.PI*v*(x-40)/720-2*Math.PI*t*.35),"#ffe28d",3);text("pressure perturbation p′(x,t)",50,275,"#ffe28d");detector(430);
  }else if(kind==="em"){
   const k=2*Math.PI*v/720,shift=2*Math.PI*t*.35;
   wave(x=>center-A*Math.sin(k*(x-40)-shift),"#5de4d7",4);
   wave(x=>center-A*.5*Math.sin(k*(x-40)-shift),"#ffb88f",3);
   text("E(x,t)  ·  B(x,t) plotted with separate scales",50,265);
   text("Real E and B are perpendicular vectors in 3D.",50,286,"#a6bbdb",12);
  }else if(kind==="optics"){
   line(405,34,405,263,"#d1d8f1",2);
   const theta1=Math.PI/180*(15+v*7),n1=1,n2=1.5;
   const theta2=Math.asin(n1/n2*Math.sin(theta1));
   const start=[405-160*Math.sin(theta1),150-160*Math.cos(theta1)];
   const end=[405+145*Math.sin(theta2),150+145*Math.cos(theta2)];
   line(start[0],start[1],405,150,"#ffe28d",5);line(405,150,end[0],end[1],"#57e2d4",5);
   line(405,150,405+125*Math.sin(theta1),150-125*Math.cos(theta1),"#a28dff",2);
   line(50,150,740,150,"#7285b1",2);
   text("Air n₁ = 1",60,142);text("Glass n₂ = 1.5",60,176);
   text(`θ₁ ≈ ${(theta1*180/Math.PI).toFixed(1)}°    θ₂ ≈ ${(theta2*180/Math.PI).toFixed(1)}°`,490,260);
  }else{
   wave(x=>center-38*a*Math.sin(2*Math.PI*v*(x-40)/720-2*Math.PI*t*.6),"#63dfe1",4);
   ctx.fillStyle="#ad8eff";ctx.fillRect(102,68,25,164);
   const shift=22*a*Math.sin(2*Math.PI*t*.65*v);
   ctx.beginPath();ctx.moveTo(128,92);ctx.lineTo(214+shift,120);ctx.lineTo(214+shift,185);ctx.lineTo(128,214);ctx.closePath();ctx.fillStyle="#83b6e3";ctx.fill();
   line(210+shift,150,260,150,"#ffe28d",3);text("voice coil + moving diaphragm → acoustic field",42,273);
  }
  const val=kind==="optics"?`Incidence angle: ${(15+frequency*7).toFixed(1)}°. Two-index refraction example; the amplitude slider has no effect in this view.`:kind==="string"?`Relative amplitude ${amplitude.toFixed(2)}; mode ${frequency.toFixed(1)}.`:`Relative amplitude ${amplitude.toFixed(2)} · frequency parameter ${frequency.toFixed(1)} (normalized units).`;
  const valueLine=(kind==="speaker"?`Resonance and back-emf depend on circuit and mechanical parameters. `:kind==="sound"?`Pressure and velocity are phase-linked for a plane traveling wave. `:"")+val;
  els("bonusNumbers").textContent=valueLine;
 }
 host.querySelector(".bonusTopics").addEventListener("click",e=>{const b=e.target.closest("[data-physics]");if(b)select(Number(b.dataset.physics));});
 els("bonusAmp").addEventListener("input",e=>{amplitude=Number(e.target.value);draw(0)});
 els("bonusFreq").addEventListener("input",e=>{frequency=Number(e.target.value);draw(0)});
 let hostTime=()=>0;
 function mount(target,time){if(host.parentElement!==target)target.replaceChildren(host);hostTime=time;renderTabs();select(active);}
 function tick(){if(!host.isConnected||host.getClientRects().length===0)return;draw(hostTime());}
 window.EnergyBonus={mount,tick,openModule:select};
})();