  const LT_ICONS = Object.freeze({
    logo: "assets/losttrackr_icons/clean/logo_losttrackr_v2_clean.png",
    home: "assets/losttrackr_icons/clean/icon_home_v2_clean.png",
    repair: "assets/losttrackr_icons/clean/icon_repair_v2_clean.png",
    smartImport: "assets/losttrackr_icons/clean/icon_smart_import_v2_clean.png",
    library: "assets/losttrackr_icons/clean/icon_library_v2_clean.png",
    health: "assets/losttrackr_icons/clean/icon_library_health_v2_clean.png",
    folderMusic: "assets/losttrackr_icons/clean/icon_folder_music_v2_clean.png",
    externalDrive: "assets/losttrackr_icons/clean/icon_external_drive_v2_clean.png",
    tip: "assets/losttrackr_icons/clean/icon_tip_v2_clean.png",
    user: "assets/losttrackr_icons/clean/icon_user_v2_clean.png"
  });

  const MOCK = {
    libraries:[{name:"Macintosh HD",root:"~/Music/_Serato_",found:588,missing:2},{name:"DJ-USB",root:"/Volumes/DJ-USB/_Serato_",found:32,missing:0}],
    totals:{found:620,missing:2},
    matches:[
      {file:"Wedding March Vs EoO Bad Bunny Mashup.mp3",old:".../Musiques Remy/DL2026/Wedding March Vs EoO.mp3",new:".../DJ Shanks/DL2026/Wedding March Vs EoO.mp3"},
      {file:"Elvis Crespo - Suavemente.mp3",old:".../Musiques Remy/Latino/Suavemente.mp3",new:".../DJ Shanks/Latino/Suavemente.mp3"},
      {file:"Warmup Edit 124.mp3",old:"Sets/Old/Warmup/Warmup Edit 124.mp3",new:"Sets/Club/Warmup/Warmup Edit 124.mp3"},
      {file:"Pile ou Face - Remix.mp3",old:".../Musiques/Pile ou Face - Remix.mp3",new:".../DJ Shanks/FR/Pile ou Face - Remix.mp3"},
      {file:"Daddy Yankee - Gasolina.mp3",old:".../Reggaeton/Gasolina.mp3",new:".../DJ Shanks/Latino/Gasolina.mp3"},
      {file:"Aya Nakamura - Djadja.mp3",old:".../Old/Djadja.mp3",new:".../DJ Shanks/Hits/Djadja.mp3"}
    ],
    missing:[
      {file:"Afro Latino private edit.mp3",reason:"aucun fichier de ce nom sur les disques scannés"},
      {file:"mix-down-v4.mp3",reason:"probablement supprimé ou disque non branché"}
    ]
  };

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const API = {
    async scan(){ if(window.pywebview?.api?.scan) return window.pywebview.api.scan(); await wait(450); return MOCK; },
    async preflight(){
      if(window.pywebview?.api?.preflight) return window.pywebview.api.preflight();
      await wait(120);
      const software = {id:"serato",name:"Serato DJ",libraryName:"bibliothèque Serato",containerName:"crate",containerPlural:"crates",groupName:"subcrates",repairSupported:true,betaLabel:"Réparation active",sources:[{path:"~/Music/_Serato_",kind:"Dossier _Serato_",detail:"database V2 + crates"}]};
      return {libraryFound:true,canScan:true,repairSupported:true,activeSoftwareId:"serato",activeSoftware:software,softwareDetection:{preferredSoftwareId:"serato",multipleDetected:false,softwares:[software],profiles:[software]},libraries:MOCK.libraries,searchRoots:["~/Music","/Volumes/DJ-USB"],defaultSeratoDir:"~/Music/_Serato_"};
    },
    async detectSoftware(){ if(window.pywebview?.api?.detectSoftware) return window.pywebview.api.detectSoftware(); const info = await this.preflight(); return info.softwareDetection; },
    async selectSoftware(id){ if(window.pywebview?.api?.selectSoftware) return window.pywebview.api.selectSoftware(id); const info = await this.preflight(); info.activeSoftwareId = id; return info; },
    async apply(){ if(window.pywebview?.api?.apply) return window.pywebview.api.apply(); await wait(450); return {fixed:620,missing:2,backupPath:"~/Music/_Serato_BACKUP_20260624_121500"}; },
    async restore(){ if(window.pywebview?.api?.restore) return window.pywebview.api.restore(); await wait(350); return {restoredFrom:"~/Music/_Serato_BACKUP_20260624_121500",previousMovedTo:"~/Music/_Serato_REPLACED_20260624_122000"}; },
    async cleanMissing(){ if(window.pywebview?.api?.cleanMissing) return window.pywebview.api.cleanMissing(); if(window.pywebview?.api?.clean_missing) return window.pywebview.api.clean_missing(); await wait(350); return {removed:2,referencesRemoved:4,missing:0,backupPath:"~/Music/_Serato_BACKUP_20260624_122500",reportPath:"~/Music/LostTrackr_CLEANUP.csv"}; },
    async openSerato(){ if(window.pywebview?.api?.openSerato) return window.pywebview.api.openSerato(); if(window.pywebview?.api?.open_serato) return window.pywebview.api.open_serato(); await wait(180); return {opened:true,app:"Serato DJ Pro"}; },
    async getAppInfo(){ if(window.pywebview?.api?.getAppInfo) return window.pywebview.api.getAppInfo(); await wait(60); return {name:"LostTrackr",version:"1.2.5",platform:navigator.platform,updateChannel:"demo"}; },
    async checkUpdate(){ if(window.pywebview?.api?.checkUpdate) return window.pywebview.api.checkUpdate(); await wait(120); return {ok:true,currentVersion:"1.2.5",updateAvailable:false}; },
    async installUpdate(){ if(window.pywebview?.api?.installUpdate) return window.pywebview.api.installUpdate(); await wait(120); return {launched:false,message:"Mode aperçu : aucune mise à jour."}; },
    async knowledgeMatch(tracks){
      if(window.pywebview?.api?.knowledgeMatch) return window.pywebview.api.knowledgeMatch(tracks);
      await wait(700);
      const demo = {
        "Wedding March Vs EoO Bad Bunny Mashup":{status:"uncertain",confidence:.48,canonical:{title:"Wedding March Vs EoO Mashup",artist:"DJ Edit",bpm:96,camelot_key:"9A",genre:"Latin"}},
        "Suavemente":{status:"matched",confidence:.97,canonical:{title:"Suavemente",artist:"Elvis Crespo",bpm:127,camelot_key:"4B",genre:"Merengue"}},
        "Warmup Edit 124":{status:"unmatched"},
        "Remix":{status:"unmatched"},
        "Gasolina":{status:"matched",confidence:.99,canonical:{title:"Gasolina",artist:"Daddy Yankee",bpm:96,camelot_key:"11B",genre:"Reggaeton"}},
        "Djadja":{status:"matched",confidence:.95,canonical:{title:"Djadja",artist:"Aya Nakamura",bpm:100,camelot_key:"8A",genre:"Afropop"}}
      };
      return {ok:true, matches:(tracks||[]).map(t => ({client_track_id:t.client_track_id, status:"unmatched", ...demo[t.title]}))};
    },
    async openExternalUrl(url){ if(window.pywebview?.api?.openExternalUrl) return window.pywebview.api.openExternalUrl(url); window.open(url,"_blank","noopener"); return {opened:true,url}; }
  };

  const $ = id => document.getElementById(id);
  const app = $("app");
  const views = {home:$("homeView"), prepare:$("prepareView"), scan:$("scanView"), results:$("resultsView"), preview:$("previewView"), review:$("reviewView"), completed:$("completedView")};
  const navButtons = {home:$("navHome"), prepare:$("navRepair"), library:$("navLibrary")};
  const toast = $("toast");
  const modal = $("modal");
  const updateBanner = $("updateBanner");
  const confirmed = $("confirmed");
  const applyBtn = $("applyBtn");
  let scanData = null;
  let applyResult = null;
  let updateInfo = null;
  let totalFound = 0;
  let totalMissing = 0;
  let totalReview = 0;
  let trackEls = [];
  let preflightInfo = null;
  let selectedSoftwareId = null;
  try{ selectedSoftwareId = localStorage.getItem("lt_preferred_software") || null; }catch(error){}

  function esc(value){ return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char])); }
  function fmt(n,singular,plural){ return `${n} ${n > 1 ? plural : singular}`; }
  function backendAvailable(){ return Boolean(window.pywebview?.api?.scan); }
  function showToast(message){ toast.textContent = message; toast.classList.add("is-open"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("is-open"), 3600); }

  async function loadAppInfo(){
    try{
      const info = await API.getAppInfo();
      if(info?.version) $("appVersionLabel").textContent = `v${info.version}`;
    }catch(error){}
  }

  function hideUpdateBanner(){
    updateBanner.hidden = true;
    updateBanner.classList.remove("is-open","is-mandatory");
    document.querySelector(".main").classList.remove("has-banner");
  }

  function renderUpdateBanner(info){
    updateInfo = info;
    if(!info?.updateAvailable){ hideUpdateBanner(); return; }
    const latest = info.latestVersion || "nouvelle version";
    const current = info.currentVersion || "version actuelle";
    $("updateTitle").textContent = info.mandatory ? `Mise à jour requise : LostTrackr ${latest}` : `LostTrackr ${latest} est disponible`;
    $("updateSummary").textContent = info.summary ? `${info.summary} Version actuelle : ${current}.` : `Tu utilises la version ${current}. Cette mise à jour peut être installée directement depuis LostTrackr.`;
    $("updateLater").hidden = Boolean(info.mandatory);
    $("updateNotes").disabled = !info.notesUrl;
    updateBanner.hidden = false;
    updateBanner.classList.toggle("is-mandatory", Boolean(info.mandatory));
    requestAnimationFrame(() => {
      updateBanner.classList.add("is-open");
      document.querySelector(".main").classList.add("has-banner");
    });
  }

  async function checkForAppUpdate(){
    try{
      const info = await API.checkUpdate();
      if(info?.updateAvailable) renderUpdateBanner(info);
    }catch(error){
      console.warn("LostTrackr update check failed", error);
    }
  }

  async function installAvailableUpdate(){
    const button = $("updateNow");
    const previous = button.textContent;
    button.disabled = true;
    button.textContent = "Préparation...";
    try{
      const result = await API.installUpdate();
      if(result?.launched){
        showToast(result?.quitting
          ? "Installateur lancé. LostTrackr se ferme — termine l’installation puis rouvre l’app."
          : "Installateur lancé. Termine la mise à jour, puis relance LostTrackr.");
        hideUpdateBanner();
      }else{
        showToast(result?.message || "LostTrackr est déjà à jour.");
      }
    }catch(error){
      showToast(error?.message || "La mise à jour n’a pas pu être lancée.");
    }finally{
      button.disabled = false;
      button.textContent = previous;
    }
  }

  async function openUpdateNotes(){
    if(!updateInfo?.notesUrl) return;
    try{ await API.openExternalUrl(updateInfo.notesUrl); }
    catch(error){ showToast("Impossible d’ouvrir les notes de version."); }
  }
  function setState(state){ app.dataset.state = state; }
  function setNav(active){
    Object.values(navButtons).forEach(btn => btn.classList.remove("is-active"));
    if(active === "home") navButtons.home.classList.add("is-active");
    else if(active === "library") navButtons.library.classList.add("is-active");
    else navButtons.prepare.classList.add("is-active");
  }
  function showView(name){
    Object.entries(views).forEach(([key, view]) => view.classList.toggle("is-active", key === name));
    app.dataset.view = name;
    setNav(name === "home" ? "home" : name === "library" ? "library" : "prepare");
  }
  function showScreen(name){ showView(name); }

  function goHome(){ setState("idle"); showView("home"); }
  function goPrepare(){ setState("prepare"); showView("prepare"); refreshPreflight(); }

  function detectedSoftwares(info){
    const detected = info?.softwareDetection?.softwares || [];
    if(detected.length) return detected;
    return info?.softwareDetection?.profiles || [];
  }

  function activeSoftware(info = preflightInfo){
    const choices = detectedSoftwares(info);
    const wanted = selectedSoftwareId || info?.activeSoftwareId || info?.softwareDetection?.preferredSoftwareId;
    return choices.find(item => item.id === wanted) || info?.activeSoftware || choices[0] || {
      id:"serato", name:"Serato DJ", libraryName:"bibliothèque Serato", containerName:"crate", containerPlural:"crates", groupName:"subcrates", repairSupported:true, betaLabel:"Réparation active", sources:[]
    };
  }

  function firstSourcePath(software, info = preflightInfo){
    const firstSource = (software?.sources || [])[0];
    if(firstSource?.path) return firstSource.path;
    const firstLibrary = (info?.libraries || [])[0];
    if(software?.id === "serato" && firstLibrary?.seratoDir) return firstLibrary.seratoDir;
    if(software?.id === "serato") return info?.defaultSeratoDir || "~/Music/_Serato_";
    return "Aucune source détectée";
  }

  function sourceMissingMessage(){
    const software = activeSoftware();
    return `Aucun dossier source ${software.name || "DJ"} n'a été trouvé. Ouvre le logiciel au moins une fois ou branche le disque qui contient ta bibliothèque, puis relance la détection.`;
  }

  function scanErrorMessage(error){
    const raw = String(error?.message || error || "");
    const lower = raw.toLowerCase();
    if(raw.includes("_Serato_") || lower.includes("aucun dossier source") || lower.includes("bibliotheque _serato") || lower.includes("est bien detecte")){
      return raw;
    }
    if(lower.includes("serato dj") || lower.includes("serato semble ouvert")){
      return raw;
    }
    return "Le scan a échoué. Vérifie que ton logiciel DJ est fermé, que tes disques sont branchés, puis relance.";
  }

  function updateSoftwareCopy(info){
    const software = activeSoftware(info);
    const libraryName = software.libraryName || `bibliothèque ${software.name || "DJ"}`;
    const containers = software.containerPlural || "listes";
    const found = Boolean((software.sources || []).length || info?.libraryFound);
    const canScan = Boolean(info?.canScan);
    $("prepareIntro").textContent = `LostTrackr va chercher les morceaux que ${software.name || "ton logiciel DJ"} ne retrouve plus. Rien ne sera modifié avant ta validation.`;
    $("prepareRadarText").textContent = `LostTrackr va inspecter ta ${libraryName}, tes dossiers musique et les disques connectés pour retrouver les fichiers déplacés.`;
    $("sourceStepTitle").textContent = `Détecter la ${libraryName}`;
    $("sourceStepText").textContent = `Identifier les bases et ${containers} à analyser.`;
    $("primarySourceTitle").textContent = found ? `${libraryName} détectée` : `${libraryName} introuvable`;
    $("seratoSourcePath").textContent = firstSourcePath(software, info);
    const state = $("seratoSourceState");
    state.classList.remove("warn", "blue");
    state.textContent = found ? (canScan ? "OK" : "Détecté") : "Introuvable";
    if(!found) state.classList.add("warn");
    else if(!canScan) state.classList.add("blue");
    const libraries = info?.libraries || [];
    $("externalStatus").textContent = libraries.length > 1 ? `${libraries.length - 1} source externe détectée${libraries.length > 2 ? "s" : ""}` : "Inclus si détectés";
    $("closeAdvice").textContent = `Pour éviter les conflits, ferme ${software.name || "ton logiciel DJ"} avant de lancer le scan.`;
    $("missionSub").textContent = `LostTrackr inspecte ${software.name || "ta bibliothèque DJ"}, tes dossiers musique et les disques connectés. Aucun fichier n’est modifié pendant cette phase.`;
    $("softwareScanTitle").textContent = libraryName.charAt(0).toUpperCase() + libraryName.slice(1);
    $("softwareScanSub").textContent = software.id === "serato" ? "Crates et database V2" : `${containers} et fichiers source`;
    $("startScan").disabled = !canScan;
    $("startScan").textContent = canScan ? "Démarrer le scan" : found ? `${software.name} bientôt réparable` : "Source introuvable";
  }

  function renderSoftwareChoices(info){
    const container = $("softwareChoice");
    if(!container) return;
    const choices = detectedSoftwares(info);
    const active = activeSoftware(info);
    container.innerHTML = "";
    if(!choices.length){
      container.innerHTML = `<div class="empty">Aucun logiciel DJ détecté pour l’instant.</div>`;
      return;
    }
    choices.forEach(software => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `software-option ${software.id === active.id ? "is-active" : ""} ${software.repairSupported ? "is-supported" : ""}`;
      const sourceCount = (software.sources || []).length;
      const sourceText = sourceCount ? `${sourceCount} source${sourceCount > 1 ? "s" : ""} détectée${sourceCount > 1 ? "s" : ""}` : "Non détecté";
      button.innerHTML = `<span><b>${esc(software.name)}</b><small>${esc(sourceText)} · ${esc(software.libraryName || "bibliothèque DJ")}</small></span><em>${esc(software.betaLabel || (software.repairSupported ? "Réparation active" : "Détection"))}</em>`;
      button.addEventListener("click", () => chooseSoftware(software.id));
      container.appendChild(button);
    });
  }

  async function chooseSoftware(id){
    selectedSoftwareId = id;
    try{ localStorage.setItem("lt_preferred_software", id); }catch(error){}
    try{
      preflightInfo = await API.selectSoftware(id);
      renderSoftwareChoices(preflightInfo);
      updateSoftwareCopy(preflightInfo);
      if(preflightInfo?.message) showToast(preflightInfo.message);
    }catch(error){
      showToast(error?.message || "Impossible de sélectionner ce logiciel pour l’instant.");
    }
  }

  async function refreshPreflight(){
    try{
      let info = await API.preflight();
      const choices = detectedSoftwares(info);
      if(selectedSoftwareId && choices.some(item => item.id === selectedSoftwareId) && info.activeSoftwareId !== selectedSoftwareId){
        info = await API.selectSoftware(selectedSoftwareId);
      }
      preflightInfo = info;
      renderSoftwareChoices(info);
      updateSoftwareCopy(info);
      if(info?.message && !info?.canScan){
        showToast(info.message);
      }
    }catch(error){
      showToast(scanErrorMessage(error));
    }
  }

  const repairWave = $("repairWave");
  function buildRepairWave(){
    if(!repairWave || repairWave.childElementCount) return;
    for(let i = 0; i < 56; i++){
      const bar = document.createElement("i");
      const h = 24 + Math.abs(Math.sin(i * .55)) * 58 + Math.random() * 16;
      bar.style.setProperty("--h", `${Math.min(Math.round(h), 100)}%`);
      repairWave.appendChild(bar);
    }
  }
  function litRepairWave(percent){
    if(!repairWave) return;
    const bars = repairWave.children;
    const lit = Math.round((percent / 100) * bars.length);
    for(let i = 0; i < bars.length; i++) bars[i].classList.toggle("lit", i < lit);
    const caption = $("repairWaveCaption");
    if(caption) caption.textContent = percent >= 100 ? "Bibliothèque reconstruite." : `Ta bibliothèque se reconstruit… ${Math.round(percent)}%`;
  }

  function attachCardGlow(){
    document.querySelectorAll(".feature-card:not(.disabled)").forEach(card => {
      card.addEventListener("pointermove", event => {
        if(reduced) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
        card.style.setProperty("--ry", `${(x - .5) * 4}deg`);
        card.style.setProperty("--rx", `${(.5 - y) * 4}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }

  function rollTo(el,to,duration=700){
    if(reduced){ el.textContent = to; return; }
    const from = parseInt(String(el.textContent).replace(/\D/g,""),10) || 0;
    const start = performance.now();
    function step(now){
      const k = Math.min(1,(now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if(k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function deriveScanCounts(){
    const matches = scanData?.matches || [];
    const ambiguous = scanData?.review || scanData?.ambiguous || [];
    totalReview = Number(scanData?.totals?.review ?? scanData?.totals?.ambiguous ?? (Array.isArray(ambiguous) ? ambiguous.length : 0));
    return {
      reliable: totalFound,
      review: totalReview,
      missing: totalMissing,
      scanned: totalFound + totalMissing + totalReview,
      libraries: (scanData?.libraries || []).length
    };
  }

  function sampleMatches(){
    const matches = scanData?.matches || [];
    if(matches.length) return matches;
    return backendAvailable() ? [] : MOCK.matches;
  }

  function renderResults(){
    const counts = deriveScanCounts();
    const repairableText = counts.reliable > 0 ? `${counts.reliable} morceaux retrouvés` : "Aucun morceau retrouvé";
    const total = Math.max(counts.scanned, counts.reliable + counts.missing);
    const percent = total ? Math.round((counts.reliable / total) * 100) : 0;
    rollTo($("reliableCount"), counts.reliable);
    rollTo($("reviewCount"), counts.review);
    rollTo($("notFoundCount"), counts.missing);
    $("repairReliable").textContent = counts.reliable > 0 ? `Réparer les ${counts.reliable} résultats fiables` : "Aucune réparation fiable";
    $("repairReliable").disabled = counts.reliable <= 0;
    $("reviewAmbiguous").textContent = counts.review > 0 ? `Vérifier les ${counts.review} morceaux` : "Vérifier les détails";
    $("resultsHeroText").textContent = `${repairableText} sur ${total}. Tu peux réparer ${percent}% de ta bibliothèque maintenant. ${counts.review} morceau${counts.review > 1 ? "x" : ""} demandent ton avis. Aucun fichier audio ne sera supprimé. Une sauvegarde est prête.`;
  }

  function renderPreview(){
    const counts = deriveScanCounts();
    const rows = sampleMatches();
    const before = $("beforePaths");
    const after = $("afterPaths");
    const arrows = $("pathArrows");
    before.innerHTML = "";
    after.innerHTML = "";
    arrows.innerHTML = "";
    if(!rows.length){
      before.innerHTML = `<div class="empty">Aucun exemple détaillé renvoyé par ce scan.</div>`;
      after.innerHTML = `<div class="empty">L’aperçu détaillé apparaîtra quand des correspondances exploitables seront disponibles.</div>`;
    }
    rows.forEach((item, index) => {
      const beforeRow = document.createElement("div");
      beforeRow.className = "path-row";
      beforeRow.innerHTML = `<code>${esc(item.old || ".../OldFolder/track.mp3")}</code><span>Introuvable</span>`;
      before.appendChild(beforeRow);
      const afterRow = document.createElement("div");
      afterRow.className = "path-row";
      afterRow.innerHTML = `<code>${esc(item.new || ".../DJ SSD/Music/track.mp3")}</code><span>${index === rows.length - 1 && counts.review ? "À vérifier" : "Très fiable"}</span>`;
      after.appendChild(afterRow);
      arrows.appendChild(document.createElement("i"));
    });
    syncPathScroll();
    rollTo($("previewReliable"), counts.reliable);
    rollTo($("previewReview"), counts.review);
    rollTo($("previewMissing"), counts.missing);
  }

  function syncPathScroll(){
    const before = $("beforePaths");
    const after = $("afterPaths");
    const arrows = $("pathArrows");
    let syncing = false;
    const sync = (source, targets) => {
      if(syncing) return;
      syncing = true;
      targets.forEach(target => { target.scrollTop = source.scrollTop; });
      requestAnimationFrame(() => { syncing = false; });
    };
    before.onscroll = () => sync(before, [after, arrows]);
    after.onscroll = () => sync(after, [before, arrows]);
  }

  function renderCompleted(){
    const fixed = Number(applyResult?.fixed ?? totalFound);
    const pending = Number(applyResult?.missing ?? totalMissing);
    rollTo($("completedFixed"), fixed, 900);
    rollTo($("completedPending"), pending, 900);
    $("completedTimelineFixed").textContent = `${fixed} chemin${fixed > 1 ? "s" : ""} corrigé${fixed > 1 ? "s" : ""}.`;
    $("completedTimelinePending").textContent = pending ? `${pending} morceau${pending > 1 ? "x" : ""} à vérifier plus tard.` : "Aucun morceau en attente.";
    $("backupBeforeLabel").textContent = `${fixed + pending} fichiers concernés`;
  }

  function knowledgeTracksFromScan(){
    return sampleMatches().map((item, index) => {
      const base = String(item.file || "").replace(/\.[a-z0-9]{2,4}$/i, "");
      const parts = base.split(" - ");
      return {
        client_track_id: `scan-${index}`,
        title: parts.length > 1 ? parts.slice(1).join(" - ") : base,
        artist: parts.length > 1 ? parts[0] : "",
        source_app: activeSoftware()?.id || "losttrackr"
      };
    });
  }

  async function runKnowledgeMatch(){
    const card = $("knowledgeCard");
    const rows = $("knowledgeRows");
    const status = $("knowledgeStatus");
    const tracks = knowledgeTracksFromScan();
    if(!tracks.length){ card.hidden = true; return; }
    card.hidden = false;
    rows.innerHTML = "";
    status.textContent = `Analyse de ${tracks.length} morceaux dans le centre de connaissances…`;
    let result = null;
    try{ result = await API.knowledgeMatch(tracks.map(t => ({...t}))); }catch(error){}
    if(!result?.ok || !Array.isArray(result.matches)){
      status.textContent = "Centre de connaissances injoignable — l’analyse reprendra au prochain scan.";
      return;
    }
    const byId = new Map(result.matches.map(m => [m.client_track_id, m]));
    const enriched = tracks.map(t => ({track:t, match:byId.get(t.client_track_id)}))
      .filter(x => x.match && x.match.status !== "unmatched");
    const withFeatures = enriched.filter(x => x.match.canonical?.bpm || x.match.canonical?.camelot_key);
    status.textContent = `${enriched.length} morceau${enriched.length > 1 ? "x" : ""} identifié${enriched.length > 1 ? "s" : ""} sur ${tracks.length} — BPM et clé récupérés pour ${withFeatures.length}.`;
    enriched.slice(0, 4).forEach(({track, match}) => {
      const row = document.createElement("div");
      row.className = "knowledge-row";
      const c = match.canonical || {};
      row.innerHTML = `<b>${esc(c.title || track.title)}${c.artist ? " — " + esc(c.artist) : ""}</b><span class="k-sep"></span>` +
        (c.bpm ? `<span class="k-chip">${Math.round(c.bpm)} BPM</span>` : "") +
        (c.camelot_key ? `<span class="k-chip key">${esc(c.camelot_key)}</span>` : "") +
        (c.genre ? `<span class="k-chip genre">${esc(c.genre)}</span>` : "") +
        (match.status === "uncertain" ? `<span class="k-chip off">à confirmer</span>` : "");
      rows.appendChild(row);
    });
  }

  function goResults(){ setState("results"); renderResults(); showScreen("results"); runKnowledgeMatch(); }
  function goPreview(){ setState("preview"); renderPreview(); showScreen("preview"); }
  function goReview(){ setState("review"); renderReview(); showScreen("review"); }
  function goCompleted(){ setState("done"); renderCompleted(); showScreen("completed"); }

  async function startRepairScan(){
    setState("scanning");
    showView("scan");
    $("startScan").disabled = true;
    $("filesAnalyzed").textContent = "…";
    $("possibleMatches").textContent = "…";
    $("remainingMissing").textContent = "…";
    $("scanProgress").style.width = "12%";
    litRepairWave(12);
    $("seratoScanLabel").textContent = "En cours";
    $("musicScanLabel").textContent = "+0 fichiers";
    $("externalScanLabel").textContent = "Analyse";
    try{
      const progress = animateScanProgress();
      scanData = await API.scan();
      clearInterval(progress);
      totalFound = Number(scanData?.totals?.found ?? (scanData?.libraries || []).reduce((sum, lib) => sum + Number(lib.found || 0), 0));
      totalReview = Number(scanData?.totals?.review ?? (scanData?.review || []).length);
      totalMissing = Number(scanData?.totals?.missing ?? (scanData?.missing || []).length);
      const totalAnalyzed = Number((scanData?.libraries || []).reduce((sum, lib) => sum + Number(lib.pathsRead || 0), 0)) || totalFound + totalReview + totalMissing;
      $("scanProgress").style.width = "100%";
      litRepairWave(100);
      rollTo($("filesAnalyzed"), totalAnalyzed, 450);
      rollTo($("possibleMatches"), totalFound + totalReview, 450);
      rollTo($("remainingMissing"), totalMissing, 450);
      $("seratoScanLabel").textContent = "OK";
      $("musicScanLabel").textContent = `+${totalFound} fichiers`;
      $("externalScanLabel").textContent = totalMissing ? "À vérifier" : "OK";
      await wait(reduced ? 80 : 520);
      finishScan();
    }catch(error){
      setState("prepare");
      showView("prepare");
      showToast(scanErrorMessage(error));
    }finally{
      $("startScan").disabled = !preflightInfo?.canScan;
    }
  }

  function animateScanProgress(){
    let width = 12;
    return setInterval(() => {
      width = Math.min(88, width + Math.random() * 10);
      $("scanProgress").style.width = `${width}%`;
      litRepairWave(width);
    }, reduced ? 500 : 260);
  }

  function finishScan(){
    goResults();
  }

  function renderReview(){
    const libraries = scanData?.libraries || [];
    const matches = scanData?.matches || [];
    const review = scanData?.review || [];
    const missing = scanData?.missing || [];
    rollTo($("summaryFound"), totalFound);
    rollTo($("summaryMissing"), totalMissing);
    rollTo($("summaryLibraries"), libraries.length);
    applyBtn.textContent = totalFound > 0 ? `Réparer ${fmt(totalFound,"morceau","morceaux")}` : "Aucune réparation disponible";
    applyBtn.disabled = true;
    confirmed.checked = false;

    const matchRows = $("matchRows");
    const missingRows = $("missingRows");
    matchRows.innerHTML = (matches.length || review.length) ? "" : `<div class="empty">Aucun fichier réparable trouvé.</div>`;
    trackEls = matches.slice(0,10).map(item => {
      const row = document.createElement("div");
      row.className = "track-row";
      row.innerHTML = `<b>${esc(item.file || "Fichier")}</b><code>ancien : ${esc(item.old || "")}</code><code class="new-path">nouveau : ${esc(item.new || "")}</code>`;
      row.addEventListener("click", () => row.classList.toggle("peek"));
      matchRows.appendChild(row);
      return row;
    });
    review.slice(0,10).forEach(item => {
      const row = document.createElement("div");
      row.className = "track-row";
      const candidate = (item.candidates || [])[0] || "à choisir manuellement";
      row.innerHTML = `<b>${esc(item.file || "Fichier")}</b><code>à vérifier : ${esc(item.reason || "plusieurs candidats possibles")}</code><code class="new-path">candidat : ${esc(candidate)}</code>`;
      row.addEventListener("click", () => row.classList.toggle("peek"));
      matchRows.appendChild(row);
    });

    missingRows.innerHTML = missing.length ? "" : `<div class="empty">Aucun fichier manquant après scan.</div>`;
    missing.slice(0,10).forEach(item => {
      const row = document.createElement("div");
      row.className = "track-row";
      row.innerHTML = `<b>${esc(item.file || "Fichier")}</b><code>${esc(item.old || item.reason || "non retrouvé")}</code>`;
      missingRows.appendChild(row);
    });
  }

  function setRepairEnabled(){ applyBtn.disabled = !confirmed.checked || app.dataset.state !== "review" || totalFound <= 0; }

  async function doApply(){
    setState("repairing");
    const previewApply = $("applyPreview");
    const returnView = app.dataset.view === "preview" ? "preview" : "review";
    applyBtn.disabled = true;
    applyBtn.textContent = "Réparation en cours...";
    if(previewApply){ previewApply.disabled = true; previewApply.textContent = "Réparation en cours..."; }
    try{
      applyResult = await API.apply();
      trackEls.forEach(row => row.classList.add("fixed"));
      goCompleted();
    }catch(error){
      setState(returnView);
      showView(returnView);
      applyBtn.textContent = totalFound > 0 ? `Réparer ${fmt(totalFound,"morceau","morceaux")}` : "Aucune réparation disponible";
      setRepairEnabled();
      showToast("La réparation a échoué. La sauvegarde existante n’a pas été modifiée.");
    }finally{
      if(previewApply){ previewApply.disabled = false; previewApply.textContent = "Appliquer les réparations"; }
    }
  }

  function finishDone(){
    setState("done");
    const fixed = applyResult?.fixed ?? totalFound;
    const missing = applyResult?.missing ?? totalMissing;
    $("modalTitle").textContent = fmt(fixed,"morceau reconnecté","morceaux reconnectés");
    $("modalText").textContent = "La bibliothèque pointe de nouveau vers les bons fichiers. Beatgrids, cue points et gains restent intacts.";
    $("modalMissing").textContent = missing > 0 ? `${fmt(missing,"morceau reste introuvable","morceaux restent introuvables")} sur les disques branchés.` : "Aucun fichier introuvable après réparation.";
    $("backupText").textContent = `Sauvegarde créée : ${applyResult?.backupPath || "sauvegarde automatique"}`;
    $("cleanMissingDone").style.display = missing > 0 ? "inline-flex" : "none";
    modal.classList.add("is-open");
  }

  async function doClean(){
    if(!confirm("LostTrackr va retirer de Serato les références encore introuvables. Aucun fichier audio ne sera supprimé. Une sauvegarde _Serato_BACKUP_* est créée avant écriture. Continuer ?")) return;
    $("cleanMissingDone").disabled = true;
    try{
      const result = await API.cleanMissing();
      $("modalTitle").textContent = fmt(result.removed ?? 0,"référence introuvable retirée","références introuvables retirées");
      $("modalText").textContent = "Aucun fichier audio n’a été supprimé.";
      $("modalMissing").textContent = result.missing ? `${fmt(result.missing,"morceau reste à vérifier","morceaux restent à vérifier")}.` : "Aucun introuvable ne reste dans les bibliothèques scannées.";
      $("backupText").textContent = `Sauvegarde créée : ${result.backupPath || "aucune écriture"}${result.reportPath ? ` | rapport : ${result.reportPath}` : ""}`;
      $("cleanMissingDone").style.display = "none";
    }catch(error){ showToast("Le nettoyage a échoué."); }
    finally{ $("cleanMissingDone").disabled = false; }
  }

  async function doRestore(){
    $("restoreDone").disabled = true;
    $("restoreInline").disabled = true;
    try{
      const result = await API.restore();
      $("modalTitle").textContent = "Sauvegarde restaurée";
      $("modalText").textContent = "La version actuelle a été déplacée de côté avant restauration. Rien n’a été supprimé.";
      $("modalMissing").textContent = "";
      $("backupText").textContent = `Restauré depuis : ${result.restoredFrom || "dernière sauvegarde"} | version déplacée : ${result.previousMovedTo || "aucune"}`;
      $("cleanMissingDone").style.display = "none";
      modal.classList.add("is-open");
    }catch(error){ showToast("La restauration a échoué."); }
    finally{
      $("restoreDone").disabled = false;
      $("restoreInline").disabled = false;
    }
  }

  async function openSeratoApp(){
    const button = $("openSerato");
    button.disabled = true;
    const previous = button.textContent;
    button.textContent = "Ouverture...";
    try{
      const result = await API.openSerato();
      showToast(`${result?.app || "Serato"} est en cours d’ouverture.`);
    }catch(error){
      showToast(error?.message || "Impossible d’ouvrir Serato DJ Pro ou Lite.");
    }finally{
      button.disabled = false;
      button.textContent = previous;
    }
  }

  function resetFlow(){
    modal.classList.remove("is-open");
    scanData = null;
    applyResult = null;
    totalFound = 0;
    totalMissing = 0;
    totalReview = 0;
    trackEls = [];
    confirmed.checked = false;
    applyBtn.disabled = true;
    $("scanProgress").style.width = "0%";
    goPrepare();
  }

  $("updateLater").addEventListener("click", hideUpdateBanner);
  $("updateNow").addEventListener("click", installAvailableUpdate);
  $("updateNotes").addEventListener("click", openUpdateNotes);
  $("goPrepare").addEventListener("click", goPrepare);
  $("navHome").addEventListener("click", goHome);
  $("navRepair").addEventListener("click", goPrepare);
  $("navOrganize").addEventListener("click", () => showToast("Cette fonction arrive bientôt."));
  $("navLibrary").addEventListener("click", () => showToast("Diagnostic bientôt disponible."));
  $("comingCard").addEventListener("click", () => showToast("Cette fonction arrive bientôt."));
  $("healthBtn").addEventListener("click", () => showToast("Diagnostic bientôt disponible."));
  $("topBack").addEventListener("click", goHome);
  $("bottomBack").addEventListener("click", goHome);
  $("reviewBack").addEventListener("click", () => scanData ? goResults() : goPrepare());
  $("startScan").addEventListener("click", startRepairScan);
  $("cancelScan").addEventListener("click", goPrepare);
  $("scanDetails").addEventListener("click", () => showToast("Détails techniques disponibles après le scan dans l’écran de vérification."));
  $("resultsBack").addEventListener("click", goPrepare);
  $("repairReliable").addEventListener("click", () => { if(!$("repairReliable").disabled) goPreview(); });
  $("reviewAmbiguous").addEventListener("click", goReview);
  $("quitWithoutChanges").addEventListener("click", () => { showToast("Aucune modification appliquée. Tu gardes le contrôle."); goHome(); });
  $("previewBack").addEventListener("click", goResults);
  $("previewToResults").addEventListener("click", goResults);
  $("previewToReview").addEventListener("click", goReview);
  $("applyPreview").addEventListener("click", doApply);
  $("openReport").addEventListener("click", () => showToast("Ouverture du rapport bientôt disponible."));
  $("rescanDone").addEventListener("click", resetFlow);
  $("openSerato").addEventListener("click", openSeratoApp);
  $("restoreCompleted").addEventListener("click", () => { modal.classList.add("is-open"); doRestore(); });
  $("backupDetails").addEventListener("click", () => showToast("Détail des sauvegardes bientôt disponible."));
  $("chooseFolder").addEventListener("click", () => showToast("Le choix manuel d’un dossier sera ajouté à la sélection avancée."));
  $("advancedToggle").addEventListener("click", () => $("advancedOptions").classList.toggle("is-open"));
  confirmed.addEventListener("change", setRepairEnabled);
  applyBtn.addEventListener("click", () => { if(!applyBtn.disabled) doApply(); });
  $("again").addEventListener("click", resetFlow);
  $("cleanMissingDone").addEventListener("click", doClean);
  $("restoreDone").addEventListener("click", doRestore);
  $("restoreInline").addEventListener("click", () => { modal.classList.add("is-open"); doRestore(); });
  modal.addEventListener("click", event => { if(event.target === modal) modal.classList.remove("is-open"); });

  const onboarding = $("onboarding");
  const obSteps = Array.from(document.querySelectorAll(".ob-step"));
  const obDots = Array.from(document.querySelectorAll("#obDots i"));
  let obIndex = 0;
  function closeOnboarding(startScanFlow){
    onboarding.classList.remove("is-open");
    try{ localStorage.setItem("lt_onboarded","1"); }catch(error){}
    if(startScanFlow === true) goPrepare();
    else goHome();
  }
  function buildObWave(){
    const wave = $("obWave");
    if(!wave || wave.childElementCount) return;
    const missing = new Set([5,6,12,19,20,27]);
    for(let i = 0; i < 34; i++){
      const bar = document.createElement("i");
      const h = 26 + Math.abs(Math.sin(i * .6)) * 60 + Math.random() * 12;
      bar.style.setProperty("--h", `${Math.min(Math.round(h), 100)}%`);
      if(missing.has(i)) bar.classList.add("missing");
      wave.appendChild(bar);
    }
  }
  function showObStep(index, backwards){
    obIndex = Math.max(0, Math.min(obSteps.length - 1, index));
    obSteps.forEach((step, i) => {
      step.classList.toggle("is-current", i === obIndex);
      step.classList.toggle("ob-back", i === obIndex && Boolean(backwards));
    });
    obDots.forEach((dot, i) => dot.classList.toggle("is-on", i === obIndex));
    $("obPrev").hidden = obIndex === 0;
    $("obNext").textContent = obIndex === obSteps.length - 1 ? "Lancer mon premier scan" : "Continuer";
  }
  $("obNext").addEventListener("click", () => {
    if(obIndex === obSteps.length - 1) closeOnboarding(true);
    else showObStep(obIndex + 1);
  });
  $("obPrev").addEventListener("click", () => showObStep(obIndex - 1, true));
  $("skipOnboarding").addEventListener("click", () => closeOnboarding(false));
  document.addEventListener("keydown", event => {
    if(!onboarding.classList.contains("is-open")) return;
    if(event.key === "ArrowRight" && obIndex < obSteps.length - 1) showObStep(obIndex + 1);
    else if(event.key === "ArrowLeft" && obIndex > 0) showObStep(obIndex - 1, true);
    else if(event.key === "Escape") closeOnboarding(false);
  });
  let onboarded = false;
  try{ onboarded = localStorage.getItem("lt_onboarded") === "1"; }catch(error){}
  if(!onboarded){ buildObWave(); showObStep(0); onboarding.classList.add("is-open"); }

  buildRepairWave();
  attachCardGlow();
  loadAppInfo();
  goHome();
  setTimeout(checkForAppUpdate, 900);
