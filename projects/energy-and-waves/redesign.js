(function installRedesign(){
  "use strict";
  const $id=(id)=>document.getElementById(id);
  const STAGES=[
    {name:"A speaker makes noise",termId:27,desc:"Observe the diaphragm moving in and out. Where does the energy go next?",ask:"What part of the speaker do you actually see moving?"},
    {name:"The speaker pushes air",termId:13,desc:"Zoom out to neighboring particles. Their oscillation transfers a disturbance; the air does not travel all the way to a listener.",ask:"Do the air particles travel with the sound wave?"},
    {name:"Longitudinal waves",termId:11,desc:"Watch compressions pass a stationary detector. Compare their count with crests of a transverse wave.",ask:"Can both kinds of waves have the same frequency?",extra:[16,21,22]},
    {name:"Transverse waves",termId:15,desc:"Use a vibrating string to compare the direction of particle motion with the direction of wave travel.",ask:"Which way does a point on the string move?",extra:[17,18,19,20]},
    {name:"Waves need a medium",termId:10,desc:"Compare sound through matter with the absence of sound transmission through a vacuum.",ask:"What changes when a sound wave has no particles to interact with?"},
    {name:"Visible light",termId:24,desc:"Explore color and connect visible light with an oscillating electromagnetic field.",ask:"How is visible light different from sound?"},
    {name:"Light meets materials",termId:29,desc:"Investigate reflection, absorption, transmission, and refraction; surface and material properties affect what happens.",ask:"Can more than one interaction happen at one boundary?",extra:[26,25,0]},
    {name:"Light travels in a vacuum",termId:12,desc:"Mechanical waves need a medium; electromagnetic fields can propagate through empty space.",ask:"Does light need air between the Sun and Earth?"},
    {name:"The EM spectrum",termId:23,desc:"Compare radio through gamma rays. Each kind is electromagnetic; wavelength and frequency vary.",ask:"Where does visible light fit among electromagnetic waves?"},
    {name:"Return to the circuit",termId:5,desc:"Trace the energy path: electrical signal → magnetic force → diaphragm → air → listener.",ask:"How does energy reach the speaker diaphragm?",extra:[4,14,8,9]}
  ];
  const CATEGORIES=[
    {title:"Matter & Energy",icon:"⬡",test:w=>w.group==="Matter & energy"},
    {title:"Circuits",icon:"⚡",test:w=>w.group==="Electric circuits"},
    {title:"Sound Waves",icon:"〰",test:w=>w.group==="Sound & vibrations"||w.group==="Waves & motion"},
    {title:"Waves & Light",icon:"☀",test:w=>w.group==="Light & EM waves"}
  ];
  const pageTitle="Unit 2 Phenomena";
  Object.assign(WORDS[0],{question:"Which property compares the mass of a sample with its volume?",choices:["Density","Length"],correct:0,why:"Density is mass divided by volume. Sample dimensions can change without changing the material’s density.",note:"A material’s density is an intrinsic property. Length and thickness are dimensions of a particular sample; reflectivity also depends on its surface and the incoming light."});
  const nav=document.createElement("nav");
  nav.className="redesignTabs";nav.setAttribute("aria-label","Application modes");
  nav.innerHTML='<button type="button" data-newview="home">⌂ Start</button><button type="button" data-newview="sequence">Learning Sequence</button><button type="button" data-newview="wall">Word Wall</button><button type="button" data-newview="bonus">✦ Bonus Physics</button><details id="speedTool"><summary>Animation speed: <span id="speedValue">1×</span></summary><div class="speedContent"><label for="globalSpeed"><strong>Playback multiplier</strong></label><input id="globalSpeed" type="range" min="0" max="3" step="0.25" value="1" aria-label="Playback speed multiplier"><div class="speedTicks"><span>0× paused</span><span>1× normal</span><span>3×</span></div><p style="font-size:12px;color:#64728c;margin-bottom:0">Changes animation playback, not the physical frequency or wavelength.</p></div></details>';
  document.querySelector(".hero").insertAdjacentElement("afterend",nav);
  const home=document.createElement("section");
  home.id="redesignHome";home.className="modePanel";
  home.innerHTML='<span class="hint">WELCOME · EXPLORE AT YOUR OWN PACE</span><h2>What makes a wireless speaker produce sound?</h2><p>Start with a vibrating speaker, then investigate waves, light, and circuits. You can follow the sequence or jump directly to any model—during the unit or weeks later.</p><div class="modeCards"><button class="modeCard" type="button" data-newview="sequence"><span>🔊</span><strong>Follow the learning sequence</strong><small>Ten connected investigations begin with the speaker and return to its circuit.</small></button><button class="modeCard" type="button" data-newview="wall"><span>📖</span><strong>Explore the Word Wall</strong><small>Choose any science concept, change a variable, and check your understanding. No required order.</small></button></div><button class="bonusLink" type="button" data-newview="bonus">✦ Curious about the deeper physics? Open optional Bonus Physics Mode.</button>';
  const sequence=document.createElement("section");
  sequence.id="redesignSequence";sequence.className="modePanel hidden";
  sequence.innerHTML='<span class="hint">BUILD ONE IDEA ON ANOTHER</span><h2>The speaker investigation</h2><p>Follow the path from sound to waves, light, and circuits. Every stop is available to revisit; nothing is locked.</p><div class="sequenceProgress"><span id="sequenceProgressLabel">0 of 10 stage checks passed</span><progress id="sequenceProgressBar" value="0" max="10"></progress></div><div id="sequenceCards" class="modeCards"></div>';
  const word=document.createElement("section");
  word.id="redesignWall";word.className="modePanel hidden";
  word.innerHTML='<span class="hint">OPEN EXPLORATION · NO LOCKED LESSONS</span><h2>Interactive Word Wall</h2><p>Definitions, models, and understanding checks. Open any category and revisit any concept whenever you want.</p><input type="search" id="wordSearch" placeholder="Search science vocabulary…" aria-label="Search science vocabulary"><div id="redesignCategories"></div>';
  const bonus=document.createElement("section");
  bonus.id="redesignBonus";bonus.className="modePanel hidden";
  bonus.innerHTML='<span class="hint">OPTIONAL · UNDERGRADUATE PHYSICS</span><h2>Bonus Physics Mode</h2><p>For curious learners who want the mathematics behind the pictures. These quantitative models and derivations are optional, not sixth-grade expectations.</p><div id="bonusMount"></div>';
  const main=$id("main");
  main.insertBefore(home,$id("explorePage"));
  main.insertBefore(sequence,$id("explorePage"));
  main.insertBefore(word,$id("explorePage"));
  main.insertBefore(bonus,$id("explorePage"));
  const explore=$id("explorePage");
  const actions=document.createElement("div");
  actions.className="modelActions";
  actions.innerHTML='<button type="button" id="backToMode">← Back to mode</button><span id="modelBreadcrumb">Interactive model</span><button type="button" id="openBonusFromModel" title="Optional deeper mathematics">✦ Explore deeper physics</button>';
  explore.prepend(actions);
  const rail=document.createElement("div");rail.id="sequenceRail";rail.setAttribute("aria-label","Sequence stages");explore.insertBefore(rail,explore.children[1]);
  const context=document.createElement("div");context.id="sequenceContext";explore.insertBefore(context,explore.children[2]);
  const review=document.createElement("div");review.id="reviewStatus";review.setAttribute("role","status");review.setAttribute("aria-live","polite");
  $id("feedback").insertAdjacentElement("afterend",review);
  const bonusExtra=document.createElement("div");bonusExtra.id="bonusRelated";bonusExtra.className="hidden";explore.appendChild(bonusExtra);
  let mode="home",entryMode="sequence",stageIndex=0,search="";
  const attempts=new Map();
  const oldSelect=selectTerm,oldRefresh=refresh,oldDraw=draw,oldChoose=choose;
  const oldProgressKey="sparklab-progress-v2";
  const verifiedKey="energy-waves-verified-v3";
  const originalDone=new Set(state.done);
  try{state.done=new Set(JSON.parse(localStorage.getItem(verifiedKey)||"[]"));}catch(e){state.done=new Set();}
  save=function(){try{localStorage.setItem(verifiedKey,JSON.stringify(Array.from(state.done)));}catch(e){}};
  function updateProgress(){
    const count=state.done.size;
    $id("progressText").textContent=`${count} checks passed`;
    const passed=STAGES.filter(s=>state.done.has(s.termId)).length;
    $id("sequenceProgressLabel").textContent=`${passed} of 10 stage checks passed`;
    $id("sequenceProgressBar").value=passed;
  }
  function verify(id){
    state.done.add(Number(id));save();updateProgress();
    if(state.id===Number(id))updateReview();
    if(mode==="sequence"||entryMode==="sequence")renderRail();
  }
  window.energyWavesVerify=verify;
  window.energyWavesModelChanged=(id)=>{
    const attempt=attempts.get(id)||{correct:false,interacted:false};
    attempt.interacted=true;attempts.set(id,attempt);
    if(attempt.correct)verify(id);else if(state.id===id)updateReview();
  };
  function updateReview(){
    const passed=state.done.has(state.id),attempt=attempts.get(state.id)||{};
    review.textContent=passed?"✓ Prediction and model investigation completed. Revisit this anytime.":attempt.correct?"Prediction correct. Now change a model variable to test it and complete the check.":attempt.interacted?"You tested the model. Choose a prediction to check your understanding.":"Make a prediction and change a model variable to test it. Both are needed for this check.";
    review.classList.toggle("passed",passed);
  }
  function showView(target){
    mode=target;
    const map={home,sequence,wall,bonus};
    Object.entries(map).forEach(([key,el])=>el.classList.toggle("hidden",key!==target));
    explore.classList.toggle("hidden",target!=="model");
    if(target==="model"){state.page="explore";}
    else{state.page="redesign-"+target;}
    nav.querySelectorAll("[data-newview]").forEach(b=>{
      const active=(target==="model"?entryMode:target)===b.dataset.newview;
      if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
    });
    if(target==="sequence"){renderSequence();}
    if(target==="wall"){renderWordWall();}
    if(target==="bonus" && window.EnergyBonus){window.EnergyBonus.mount($id("bonusMount"),()=>state.time);}
    document.body.classList.toggle("frequencySelected",target==="model"&&state.id===11);
    document.body.classList.toggle("materialSelected",target==="model"&&state.id===0);
    window.EnergyMaterial?.panel.classList.toggle("hidden",!(target==="model"&&state.id===0));
    const detector=$id("frequencyDetectorPanel");
    if(detector)detector.classList.toggle("hidden",!(target==="model"&&state.id===11));
    $id("speedTool").classList.toggle("hidden",target==="home");
    if(target==="model")draw();
    window.scrollTo({top:0,behavior:"instant"});
  }
  function renderSequence(){
    $id("sequenceCards").innerHTML=STAGES.map((s,i)=>`<button class="modeCard" type="button" data-stage="${i}"><span>${state.done.has(s.termId)?"✓":String(i+1).padStart(2,"0")}</span><strong>${safe(s.name)}</strong><small>${safe(s.desc)}</small></button>`).join("");
  }
  function safe(t){return String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function renderRail(){
    rail.innerHTML=STAGES.map((s,i)=>`<button class="stageLink ${i===stageIndex?"active":""}" data-stage="${i}" type="button"><span class="stepNum">STAGE ${i+1} ${state.done.has(s.termId)?"✓":""}</span>${safe(s.name)}</button>`).join("");
  }
  function openStage(i,targetId){
    stageIndex=Math.min(9,Math.max(0,Number(i)));
    entryMode="sequence";
    selectTerm(targetId??STAGES[stageIndex].termId);
  }
  function openWord(i){
    entryMode="wall";selectTerm(i);
  }
  function renderWordWall(){
    const q=$id("wordSearch").value.trim().toLowerCase();
    const html=CATEGORIES.map(category=>{
      const found=WORDS.filter(w=>category.test(w)&&(w.term.toLowerCase().includes(q)||w.student_definition.toLowerCase().includes(q)));
      if(q&&!found.length)return"";
      return `<details class="wordCategory" ${q?'open':''}><summary>${category.icon} ${safe(category.title)}<span class="count">${found.length} concepts</span></summary><div class="wordCategoryBody">${found.map(w=>`<button type="button" class="wordConcept" data-word="${w.id}"><strong>${safe(w.term)} ${state.done.has(w.id)?"✓":""}</strong><small>${safe(w.student_definition)}</small></button>`).join("")}</div></details>`;
    }).join("");
    $id("redesignCategories").innerHTML=html||"<p>No matching concepts.</p>";
  }
  function updateModel(){
    const current=WORDS[state.id];
    document.body.classList.toggle("frequencySelected",state.id===11);
    document.body.classList.toggle("materialSelected",state.id===0);
    window.EnergyMaterial?.panel.classList.toggle("hidden",state.id!==0);
    if(state.id===0)window.EnergyMaterial?.render();
    $id("frequencyDetectorPanel")?.classList.toggle("hidden",state.id!==11);
    $id("modelBreadcrumb").textContent=entryMode==="sequence"?`Learning Sequence · ${stageIndex+1} of 10`:`Word Wall · ${current.group}`;
    $id("backToMode").textContent=entryMode==="sequence"?"← All sequence stages":"← Word Wall";
    rail.classList.toggle("hidden",entryMode!=="sequence");
    context.classList.toggle("hidden",entryMode!=="sequence");
    $id("explorePage").querySelector(".nextrow").classList.toggle("hidden",entryMode!=="sequence");
    if(entryMode==="sequence"){
      const s=STAGES[stageIndex];
      const more=(s.extra||[]).map(id=>`<button type="button" data-related="${id}" style="border:1px solid #c4c9e7;background:white;border-radius:8px;padding:7px 10px;margin:9px 6px 0 0;font-weight:750;font-size:12px">${safe(WORDS[id].term)}</button>`).join("");
      context.innerHTML=`<h3>${stageIndex+1}. ${safe(s.name)}</h3><p>${safe(s.desc)} <strong>Think about:</strong> ${safe(s.ask)}</p>${more}`;
      $id("prev").disabled=stageIndex===0;$id("next").disabled=stageIndex===9;
      $id("prev").textContent="← Previous stage";$id("next").textContent="Next stage →";
      renderRail();
    }
    updateReview();updateProgress();
    $id("topic").textContent=current.group;
    $id("scopeDetails").open=false;$id("advDetails").open=false;
    draw();
  }
  selectTerm=function(i){
    attempts.set(Number(i),{correct:false,interacted:false});
    oldSelect(Number(i));
    showView("model");
    updateModel();
  };
  refresh=function(){oldRefresh();if(mode==="model")updateModel();};
  draw=function(){
    if(state.id===11){
      if(mode==="model"&&window.EnergyFrequency)window.EnergyFrequency.render(state.time,Number(val()));
    } else if(state.id===0){
      if(mode==="model")window.EnergyMaterial?.render();
    } else oldDraw();
  };
  choose=function(n){
    oldChoose(n);
    const attempt=attempts.get(state.id)||{correct:false,interacted:false};
    attempt.correct=Number(n)===term().correct;
    attempts.set(state.id,attempt);
    if(attempt.correct && attempt.interacted)verify(state.id);
    else updateReview();
  };
  const oldControlChanged=controlChanged;
  controlChanged=function(v){
    const id=state.id,before=val();
    oldControlChanged(v);
    const attempt=attempts.get(id)||{correct:false,interacted:false};
    if(Number(v)!==Number(before))attempt.interacted=true;
    attempts.set(id,attempt);
    if(attempt.correct && attempt.interacted)verify(id);
    else updateReview();
  };
  $id("mastered").onclick=null;
  $id("backToMode").onclick=()=>showView(entryMode);
  $id("openBonusFromModel").onclick=()=>{
    const group=term().group,scene=term().scene;
    const moduleIndex=group==="Electric circuits"?4:group==="Light & EM waves"?(["refraction","optics","absorb","transmit","reflect"].includes(scene)?3:2):group==="Sound & vibrations"?1:group==="Waves & motion"?0:3;
    showView("bonus");window.EnergyBonus?.openModule(moduleIndex);
  };
  $id("prev").onclick=()=>openStage(stageIndex-1);
  $id("next").onclick=()=>openStage(stageIndex+1);
  $id("wordSearch").addEventListener("input",renderWordWall);
  document.addEventListener("click",e=>{
    const el=e.target.closest("[data-newview],[data-stage],[data-word],[data-related]");
    if(!el)return;
    if(el.dataset.newview)showView(el.dataset.newview);
    else if(el.dataset.stage!==undefined)openStage(el.dataset.stage);
    else if(el.dataset.word!==undefined)openWord(el.dataset.word);
    else if(el.dataset.related!==undefined)openStage(stageIndex,Number(el.dataset.related));
  });
  const speed=$id("globalSpeed");
  const initialReduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
  state.speedMultiplier=initialReduced?0:1;
  speed.value=String(state.speedMultiplier);
  $id("speedValue").textContent=`${state.speedMultiplier}×`;
  speed.addEventListener("input",()=>{
    state.speedMultiplier=Number(speed.value);
    state.paused=false;
    $id("speedValue").textContent=`${state.speedMultiplier.toFixed(2).replace(/\.?0+$/,"")}×`;
  });
  $id("modeStudent").onclick=null;
  $id("modeAdvanced").onclick=null;
  if(window.EnergyFrequency)window.EnergyFrequency.reset();
  updateProgress();
  showView("home");
  // Preserve the existing visited-word localStorage separately; new checks are earned by actual responses.
  document.documentElement.dataset.redesign="v3";
  document.title=pageTitle+" · Energy and Waves";
})();