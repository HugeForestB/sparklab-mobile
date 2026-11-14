(function installFrequency(){
  const canvas=document.createElement("canvas");
  canvas.id="frequencyDetectorCanvas";
  canvas.width=960;canvas.height=545;
  canvas.setAttribute("role","img");
  canvas.setAttribute("aria-label","Two animated representations of waves with stationary detectors counting successive crests and compressions.");
  const context=canvas.getContext("2d");
  const meter=document.createElement("div");
  meter.className="frequencyMeter";
  const task=document.createElement("div");
  task.className="frequencyChallenge";
  task.innerHTML='<strong>Try it:</strong> Set the frequency to <b>4 Hz</b>, allow one simulated second to finish, and check the detector. <button type="button" id="checkFourCycles">Check 4 Hz</button><span id="frequencyChallengeFeedback" role="status" aria-live="polite"></span>';
  const panel=document.createElement("section");
  panel.id="frequencyDetectorPanel";panel.className="hidden";
  panel.innerHTML='<div class="frequencyIntro"><div><span class="eyebrow">Two wave types · One measurement</span><h3>Count what passes the detector</h3><p>A wave’s frequency tells us how many complete cycles pass one position per second. The vertical yellow lines are fixed detectors, not moving particles.</p></div><div class="measureCaption">Measurement: 1 simulated second</div></div>';
  panel.appendChild(canvas);panel.appendChild(meter);panel.appendChild(task);
  const canvasCard=document.querySelector("#explorePage .canvasCard");
  canvasCard.parentNode.insertBefore(panel,canvasCard);
  const p=context;
  const X0=70, X1=885, detector=480, pxPerMeter=100, c=3.2, waveY=154, longY=315;
  let lastState=null;
  const rect=(x,y,w,h,color,r=0)=>{p.fillStyle=color;if(r){p.beginPath();p.roundRect(x,y,w,h,r);p.fill();}else p.fillRect(x,y,w,h)};
  const label=(txt,x,y,size=16,color="#eff7ff",align="left",weight=700)=>{p.fillStyle=color;p.font=`${weight} ${size}px system-ui,sans-serif`;p.textAlign=align;p.fillText(txt,x,y)};
  const line=(x0,y0,x1,y1,color="#93a9d7",width=2,dash=[])=>{p.strokeStyle=color;p.lineWidth=width;p.setLineDash(dash);p.beginPath();p.moveTo(x0,y0);p.lineTo(x1,y1);p.stroke();p.setLineDash([])};
  const dot=(x,y,r,color)=>{p.fillStyle=color;p.beginPath();p.arc(x,y,r,0,Math.PI*2);p.fill()};
  function render(time,f){
    if(!panel.isConnected||panel.classList.contains("hidden"))return;
    const normalizedTime=Math.max(0,time);
    const sec=Math.max(0,Math.floor(normalizedTime-1e-7));
    const elapsed=Math.max(0,Math.min(1,normalizedTime-sec));
    const count=Math.min(f,Math.floor(elapsed*f+1e-7));
    const lambda=c/f, omega=2*Math.PI*f, k=2*Math.PI/lambda;
    p.clearRect(0,0,960,545);
    rect(0,0,960,545,"#101b3b");
    for(let x=40;x<960;x+=40)line(x,0,x,540,"#1b2c50",1);
    for(let y=34;y<545;y+=40)line(0,y,960,y,"#1b2c50",1);
    rect(30,54,900,184,"#1b2b50",14);
    rect(30,258,900,184,"#1b2b50",14);
    label("TRANSVERSE — a vibrating string",50,82,19);
    label("LONGITUDINAL — compressions in a material",50,286,19);
    line(X0,waveY,X1,waveY,"#5b7196",2,[8,6]);
    p.beginPath();
    for(let x=X0;x<=X1;x+=3){
      const dx=(x-detector)/pxPerMeter;
      const y=waveY-47*Math.cos(k*dx-omega*normalizedTime);
      if(x===X0)p.moveTo(x,y);else p.lineTo(x,y);
    }
    p.strokeStyle="#51e2d1";p.lineWidth=4;p.stroke();
    for(let x=X0;x<=X1;x+=40){
      let dx=(x-detector)/pxPerMeter, y=waveY-47*Math.cos(k*dx-omega*normalizedTime);
      dot(x,y,4,"#b5fff3");
    }
    // A longitudinal displacement field u=-A*sin(kx-omega*t) makes a compression at the detector at time zero.
    for(let row=0;row<4;row++){
      for(let col=0;col<82;col++){
        const base=X0+col*9.75, xMeters=(base-detector)/pxPerMeter;
        const shift=-Math.min(7,lambda*14)*Math.sin(k*xMeters-omega*normalizedTime);
        dot(base+shift,longY-54+row*28,3.5,(col%8===0?"#ffe8a5":"#6bdded"));
      }
    }
    line(detector,94,detector,220,"#ffe28d",3,[7,5]);
    line(detector,297,detector,423,"#ffe28d",3,[7,5]);
    rect(detector-54,210,108,25,"#554326",8);
    rect(detector-54,414,108,25,"#554326",8);
    label("DETECTOR",detector,228,11,"#ffe28d","center");
    label("DETECTOR",detector,431,11,"#ffe28d","center");
    const flash=Math.cos(omega*normalizedTime)>0.96;
    if(flash){dot(detector,154,8,"#ffe28d");dot(detector,315,8,"#ffe28d")}
    label("Particles oscillate perpendicular to propagation.",48,212,13,"#b3c2da", "left",500);
    label("Particles oscillate parallel to propagation.",48,416,13,"#b3c2da", "left",500);
    rect(30,455,900,71,"#25345b",12);
    label("The detector counts successive crest / compression passages.",52,483,15,"#eaf7ff");
    label(`${f.toFixed(0)} Hz  ·  λ = ${(lambda).toFixed(2)} m  ·  example wave speed = ${c.toFixed(1)} m/s`,52,511,14,"#90ddf5");
    meter.innerHTML=`<div><span class="small">Transverse crest count</span><strong>${count}</strong></div><div><span class="small">Longitudinal compression count</span><strong>${count}</strong></div><div><span class="small">Elapsed / 1 s</span><strong>${elapsed.toFixed(2)} s</strong></div><div><span class="small">Frequency setting</span><strong>${f} Hz</strong></div>`;
    lastState={time:normalizedTime,f,count,elapsed,completed:normalizedTime>=1};
    const btn=document.getElementById("checkFourCycles");
    if(btn)btn.disabled=!(f===4 && normalizedTime>=1);
  }
  task.querySelector("button").addEventListener("click",()=>{
    const feedback=document.getElementById("frequencyChallengeFeedback");
    if(lastState&&lastState.f===4&&lastState.completed){
      feedback.textContent="✓ Four full cycles pass each detector in one simulated second. Both waves have the same frequency.";
      if(typeof window.energyWavesVerify==="function")window.energyWavesVerify(11);
    } else feedback.textContent="Set 4 Hz and let at least one simulated second pass.";
  });
  window.EnergyFrequency={panel,render,reset:()=>{lastState=null;},getState:()=>lastState};
})();