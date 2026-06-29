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
    async preflight(){ if(window.pywebview?.api?.preflight) return window.pywebview.api.preflight(); await wait(120); return {libraryFound:true,libraries:MOCK.libraries,searchRoots:["~/Music","/Volumes/DJ-USB"],defaultSeratoDir:"~/Music/_Serato_"}; },
    async apply(){ if(window.pywebview?.api?.apply) return window.pywebview.api.apply(); await wait(450); return {fixed:620,missing:2,backupPath:"~/Music/_Serato_BACKUP_20260624_121500"}; },
    async restore(){ if(window.pywebview?.api?.restore) return window.pywebview.api.restore(); await wait(350); return {restoredFrom:"~/Music/_Serato_BACKUP_20260624_121500",previousMovedTo:"~/Music/_Serato_REPLACED_20260624_122000"}; },
    async cleanMissing(){ if(window.pywebview?.api?.cleanMissing) return window.pywebview.api.cleanMissing(); if(window.pywebview?.api?.clean_missing) return window.pywebview.api.clean_missing(); await wait(350); return {removed:2,referencesRemoved:4,missing:0,backupPath:"~/Music/_Serato_BACKUP_20260624_122500",reportPath:"~/Music/LostTrackr_CLEANUP.csv"}; },
    async openSerato(){ if(window.pywebview?.api?.openSerato) return window.pywebview.api.openSerato(); if(window.pywebview?.api?.open_serato) return window.pywebview.api.open_serato(); await wait(180); return {opened:true,app:"Serato DJ Pro"}; }
  };

  const $ = id => document.getElementById(id);
  const app = $("app");
  const views = {home:$("homeView"), prepare:$("prepareView"), scan:$("scanView"), results:$("resultsView"), preview:$("previewView"), review:$("reviewView"), completed:$("completedView")};
  const navButtons = {home:$("navHome"), prepare:$("navRepair"), library:$("navLibrary")};
  const toast = $("toast");
  const modal = $("modal");
  const confirmed = $("confirmed");
  const applyBtn = $("applyBtn");
  let scanData = null;
  let applyResult = null;
  let totalFound = 0;
  let totalMissing = 0;
  let totalReview = 0;
  let trackEls = [];

  function esc(value){ return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char])); }
  function fmt(n,singular,plural){ return `${n} ${n > 1 ? plural : singular}`; }
  function backendAvailable(){ return Boolean(window.pywebview?.api?.scan); }
  function showToast(message){ toast.textContent = message; toast.classList.add("is-open"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("is-open"), 3600); }
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

  function sourceMissingMessage(){
    return "Aucun dossier source Serato (_Serato_) n'a ete trouve. Ouvre Serato au moins une fois, verifie que le dossier _Serato_ existe dans Musique ou branche le disque externe qui contient ta bibliotheque.";
  }

  function scanErrorMessage(error){
    const raw = String(error?.message || error || "");
    const lower = raw.toLowerCase();
    if(raw.includes("_Serato_") || lower.includes("aucun dossier source") || lower.includes("bibliotheque _serato")){
      return raw;
    }
    if(lower.includes("serato dj") || lower.includes("serato semble ouvert")){
      return raw;
    }
    return "Le scan a échoué. Vérifie que Serato DJ Pro est fermé, que tes disques sont branchés, puis relance.";
  }

  async function refreshPreflight(){
    try{
      const info = await API.preflight();
      const libraries = info?.libraries || [];
      const firstLibrary = libraries[0];
      const found = Boolean(info?.libraryFound || libraries.length);
      $("seratoSourcePath").textContent = firstLibrary?.seratoDir || info?.defaultSeratoDir || "_Serato_";
      $("seratoSourceState").textContent = found ? "OK" : "Introuvable";
      $("seratoSourceState").classList.toggle("warn", !found);
      $("externalStatus").textContent = libraries.length > 1 ? `${libraries.length - 1} source externe détectée${libraries.length > 2 ? "s" : ""}` : "Aucun disque externe détecté";
      if(!found){
        showToast(info?.message || sourceMissingMessage());
      }
    }catch(error){
      showToast(scanErrorMessage(error));
    }
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
    $("reliableCount").textContent = counts.reliable;
    $("reviewCount").textContent = counts.review;
    $("notFoundCount").textContent = counts.missing;
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
    $("previewReliable").textContent = counts.reliable;
    $("previewReview").textContent = counts.review;
    $("previewMissing").textContent = counts.missing;
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
    $("completedFixed").textContent = fixed;
    $("completedPending").textContent = pending;
    $("completedTimelineFixed").textContent = `${fixed} chemin${fixed > 1 ? "s" : ""} corrigé${fixed > 1 ? "s" : ""}.`;
    $("completedTimelinePending").textContent = pending ? `${pending} morceau${pending > 1 ? "x" : ""} à vérifier plus tard.` : "Aucun morceau en attente.";
    $("backupBeforeLabel").textContent = `${fixed + pending} fichiers concernés`;
  }

  function goResults(){ setState("results"); renderResults(); showScreen("results"); }
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
      $("startScan").disabled = false;
    }
  }

  function animateScanProgress(){
    let width = 12;
    return setInterval(() => {
      width = Math.min(88, width + Math.random() * 10);
      $("scanProgress").style.width = `${width}%`;
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
    $("summaryFound").textContent = totalFound;
    $("summaryMissing").textContent = totalMissing;
    $("summaryLibraries").textContent = libraries.length;
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
  function closeOnboarding(){ onboarding.classList.remove("is-open"); try{ localStorage.setItem("lt_onboarded","1"); }catch(error){} goHome(); }
  $("skipOnboarding").addEventListener("click", closeOnboarding);
  $("finishOnboarding").addEventListener("click", closeOnboarding);
  let onboarded = false;
  try{ onboarded = localStorage.getItem("lt_onboarded") === "1"; }catch(error){}
  if(!onboarded) onboarding.classList.add("is-open");

  goHome();
