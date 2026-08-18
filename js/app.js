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
    ],
    smartImport:{
      preflight:{
        defaultSourceDir:"~/Downloads",
        defaultSourceDisplay:"~/Downloads",
        sourceExists:true,
        defaultDestinationDir:"~/Music/LostTrackr Smart Import",
        defaultDestinationDisplay:"~/Music/LostTrackr Smart Import",
        libraryRoots:["~/Music/DJ Library"],
        libraryRootDisplays:["~/Music/DJ Library"],
        moveOnly:true,
        crates:[
          {name:"Afro / Amapiano",library:"Macintosh HD"},
          {name:"Club Warmup",library:"Macintosh HD"},
          {name:"Peak Time",library:"Macintosh HD"}
        ],
        softwareDetection:{softwares:[{id:"serato",name:"Serato DJ",containerName:"crate",containerPlural:"crates"}]}
      },
      plan:{
        sourceDir:"~/Downloads",
        sourceDisplay:"~/Downloads",
        destinationMode:"existing",
        destinationRoot:"~/Music/DJ Library",
        destinationRootDisplay:"~/Music/DJ Library",
        totals:{audio:6,ready:6,review:1,conflicts:1,limited:false},
        libraryFolders:[
          {path:"~/Music/DJ Library/Afro",display:"~/Music/DJ Library/Afro",name:"Afro",audioCount:120,genres:["Afro"]},
          {path:"~/Music/DJ Library/Afro/Amapiano",display:"~/Music/DJ Library/Afro/Amapiano",name:"Amapiano",audioCount:42,genres:["Afro"]},
          {path:"~/Music/DJ Library/House",display:"~/Music/DJ Library/House",name:"House",audioCount:180,genres:["House"]},
          {path:"~/Music/DJ Library/House/Deep House",display:"~/Music/DJ Library/House/Deep House",name:"Deep House",audioCount:36,genres:["House"]},
          {path:"~/Music/DJ Library/Latino",display:"~/Music/DJ Library/Latino",name:"Latino",audioCount:92,genres:["Latino"]},
          {path:"~/Music/DJ Library/Pop",display:"~/Music/DJ Library/Pop",name:"Pop",audioCount:74,genres:["Pop"]},
          {path:"~/Music/DJ Library/Warmup",display:"~/Music/DJ Library/Warmup",name:"Warmup",audioCount:58,genres:["Warmup"]}
        ],
        files:[
          {id:"si-1",file:"Burna Boy - City Boys.mp3",sourceDisplay:"~/Downloads/Burna Boy - City Boys.mp3",destinationDisplay:"~/Music/DJ Library/Afro/Burna Boy - City Boys.mp3",destinationFolderDisplay:"~/Music/DJ Library/Afro",action:"move",confidence:"high",reason:"Match avec Afro",artist:"Burna Boy",title:"City Boys",genre:"Afro",conflict:false},
          {id:"si-2",file:"Peggy Gou - Nanana.wav",sourceDisplay:"~/Downloads/Peggy Gou - Nanana.wav",destinationDisplay:"~/Music/DJ Library/House/Peggy Gou - Nanana.wav",destinationFolderDisplay:"~/Music/DJ Library/House",action:"move",confidence:"high",reason:"Match avec House",artist:"Peggy Gou",title:"Nanana",genre:"House",conflict:false},
          {id:"si-3",file:"warmup edit 124.mp3",sourceDisplay:"~/Downloads/warmup edit 124.mp3",destinationDisplay:"~/Music/DJ Library/Warmup/warmup edit 124_2.mp3",destinationFolderDisplay:"~/Music/DJ Library/Warmup",action:"move",confidence:"medium",reason:"Nom ajusté pour éviter un conflit",artist:"",title:"warmup edit 124",genre:"Warmup",conflict:true},
          {id:"si-4",file:"Daddy Yankee - Gasolina.mp3",sourceDisplay:"~/Downloads/Daddy Yankee - Gasolina.mp3",destinationDisplay:"~/Music/DJ Library/Latino/Daddy Yankee - Gasolina.mp3",destinationFolderDisplay:"~/Music/DJ Library/Latino",action:"move",confidence:"high",reason:"Match avec Latino",artist:"Daddy Yankee",title:"Gasolina",genre:"Latino",conflict:false},
          {id:"si-5",file:"track-07-final.mp3",sourceDisplay:"~/Downloads/track-07-final.mp3",destinationDisplay:"~/Music/DJ Library/LostTrackr Smart Import/A verifier/track-07-final.mp3",destinationFolderDisplay:"~/Music/DJ Library/LostTrackr Smart Import/A verifier",action:"move",confidence:"review",reason:"Nommage faible, rangement dans À vérifier",artist:"",title:"track-07-final",genre:"A verifier",conflict:false},
          {id:"si-6",file:"Dua Lipa - Houdini.m4a",sourceDisplay:"~/Downloads/Dua Lipa - Houdini.m4a",destinationDisplay:"~/Music/DJ Library/Pop/Dua Lipa - Houdini.m4a",destinationFolderDisplay:"~/Music/DJ Library/Pop",action:"move",confidence:"medium",reason:"Dossier Pop probable",artist:"Dua Lipa",title:"Houdini",genre:"Pop",conflict:false}
        ],
        metadataOffer:{available:true,fields:["artiste","titre","annee","genre","BPM","cle Camelot"],source:"Centre de connaissances LostTrackr"}
      }
    }
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
    async getAppInfo(){ if(window.pywebview?.api?.getAppInfo) return window.pywebview.api.getAppInfo(); await wait(60); return {name:"LostTrackr",version:"1.4.0",platform:navigator.platform,updateChannel:"demo",launchState:{showOnboarding:false,showWhatsNew:false,currentVersion:"1.4.0",releaseNotes:[]}}; },
    async getLaunchState(){ if(window.pywebview?.api?.getLaunchState) return window.pywebview.api.getLaunchState(); const info = await this.getAppInfo(); return info.launchState || {showOnboarding:false,showWhatsNew:false,currentVersion:"1.4.0",releaseNotes:[]}; },
    async completeOnboarding(){ if(window.pywebview?.api?.completeOnboarding) return window.pywebview.api.completeOnboarding(); try{ localStorage.setItem("lt_onboarded","1"); }catch(error){} return {showOnboarding:false,showWhatsNew:false,currentVersion:"1.4.0",releaseNotes:[]}; },
    async acknowledgeLaunchState(){ if(window.pywebview?.api?.acknowledgeLaunchState) return window.pywebview.api.acknowledgeLaunchState(); return {showOnboarding:false,showWhatsNew:false,currentVersion:"1.4.0",releaseNotes:[]}; },
    async checkUpdate(){ if(window.pywebview?.api?.checkUpdate) return window.pywebview.api.checkUpdate(); await wait(120); return {ok:true,currentVersion:"1.4.0",updateAvailable:false}; },
    async installUpdate(){ if(window.pywebview?.api?.installUpdate) return window.pywebview.api.installUpdate(); await wait(120); return {launched:false,message:"Mode aperçu : aucune mise à jour."}; },
    async smartImportPreflight(){ if(window.pywebview?.api?.smartImportPreflight) return window.pywebview.api.smartImportPreflight(); await wait(120); return MOCK.smartImport.preflight; },
    async smartImportScan(options){
      if(window.pywebview?.api?.smartImportScan) return window.pywebview.api.smartImportScan(options);
      await wait(520);
      return {...MOCK.smartImport.plan, sourceDir:options?.sourceDir || MOCK.smartImport.plan.sourceDir, destinationMode:options?.destinationMode || "existing"};
    },
    async smartImportApply(selectedIds){
      if(window.pywebview?.api?.smartImportApply) return window.pywebview.api.smartImportApply(selectedIds || []);
      await wait(520);
      const wanted = new Set(selectedIds || []);
      const files = (MOCK.smartImport.plan.files || []).filter(item => !wanted.size || wanted.has(item.id));
      return {moved:files.length,skipped:0,errors:0,manifestDisplay:"~/Music/LostTrackr Smart Import/_manifests/smart_import_demo.json",items:files.map(item => ({id:item.id,file:item.file,toDisplay:item.destinationDisplay}))};
    },
    async smartImportMetadata(selectedIds){
      if(window.pywebview?.api?.smartImportMetadata) return window.pywebview.api.smartImportMetadata(selectedIds || []);
      await wait(900);
      const basePlan = smartImportPlan || MOCK.smartImport.plan;
      const wanted = new Set(selectedIds || []);
      const files = (basePlan.files || []).filter(item => !wanted.size || wanted.has(item.id));
      const tracks = files.slice(0,80).map(item => ({
        client_track_id:String(item.id),
        title:item.title || item.file,
        artist:item.artist || "",
        genre:item.genre && item.genre !== "A verifier" ? item.genre : "",
        source_app:"smart_import"
      }));
      const result = await this.knowledgeMatch(tracks);
      const byId = new Map((result?.matches || []).map(item => [String(item.client_track_id), item]));
      const totals = {complete:0,suggestion:0,incomplete:0,total:files.length};
      const records = files.map(item => {
        const match = byId.get(String(item.id)) || {};
        const canonical = match.canonical || {};
        const rawStatus = String(match.status || "unmatched").toLowerCase();
        let status = "incomplete";
        let source = "Non identifié";
        if(["matched","known","complete","exact"].includes(rawStatus)){
          status = "complete"; source = "Base de connaissances"; totals.complete++;
        }else if(["probable","uncertain","suggestion","probable_suggestion","enriched_sourcing"].includes(rawStatus)){
          status = "probable_suggestion"; source = "Suggestion KB"; totals.suggestion++;
        }else{
          totals.incomplete++;
        }
        return {
          id:item.id,
          file:item.file,
          title:canonical.title || item.title || item.file,
          artist:canonical.artist || item.artist || "",
          year:canonical.year || null,
          bpm:canonical.bpm || null,
          camelot_key:canonical.camelot_key || null,
          genre:canonical.genre || item.genre || "A verifier",
          status,
          source,
          confidence:match.confidence || null,
          destinationDisplay:item.destinationDisplay
        };
      });
      return {ok:true, source:"Centre de connaissances LostTrackr", records, totals};
    },
    async smartImportChooseDestination(payload){
      if(window.pywebview?.api?.smartImportChooseDestination) return window.pywebview.api.smartImportChooseDestination(payload || {});
      const folder = payload?.destinationFolder || prompt("Choisir le dossier de destination");
      const basePlan = smartImportPlan || MOCK.smartImport.plan;
      if(!folder) return basePlan;
      const plan = typeof structuredClone === "function" ? structuredClone(basePlan) : JSON.parse(JSON.stringify(basePlan));
      const planGroups = plan.groups?.length ? plan.groups : buildSmartGroupsFromFiles(plan.files || []);
      const group = planGroups.find(item => item.id === payload?.id);
      const wanted = payload?.scope === "track" ? new Set([payload.id]) : new Set(group?.items || []);
      const cleanFolder = folder.replace(/\/+$/,"");
      plan.files = (plan.files || []).map(item => {
        if(!wanted.has(item.id)) return item;
        return {
          ...item,
          destinationFolder:folder,
          destinationFolderDisplay:folder,
          destination:`${cleanFolder}/${item.file}`,
          destinationDisplay:`${cleanFolder}/${item.file}`,
          confidence:"medium",
          confidenceLabel:"Bonne suggestion",
          reason:"Destination choisie manuellement",
          reasonCode:"manual_destination"
        };
      });
      plan.groups = null;
      return plan;
    },
    async chooseFolder(title){
      if(window.pywebview?.api?.chooseFolder) return window.pywebview.api.chooseFolder(title);
      const path = prompt(title || "Chemin du dossier");
      return {path:path || null};
    },
    async knowledgeMatch(tracks){
      if(window.pywebview?.api?.knowledgeMatch) return window.pywebview.api.knowledgeMatch(tracks);
      await wait(700);
      const demo = {
        "Wedding March Vs EoO Bad Bunny Mashup":{status:"uncertain",confidence:.48,canonical:{title:"Wedding March Vs EoO Mashup",artist:"DJ Edit",bpm:96,camelot_key:"9A",genre:"Latin"}},
        "Suavemente":{status:"matched",confidence:.97,canonical:{title:"Suavemente",artist:"Elvis Crespo",bpm:127,camelot_key:"4B",genre:"Merengue"}},
        "Warmup Edit 124":{status:"unmatched"},
        "City Boys":{status:"matched",confidence:.96,canonical:{title:"City Boys",artist:"Burna Boy",bpm:100,camelot_key:"3A",genre:"Afrobeats"}},
        "Nanana":{status:"matched",confidence:.94,canonical:{title:"Nanana",artist:"Peggy Gou",bpm:122,camelot_key:"6A",genre:"House"}},
        "warmup edit 124":{status:"uncertain",confidence:.56,canonical:{title:"Warmup Edit 124",artist:"DJ Edit",bpm:124,camelot_key:"7A",genre:"Warmup"}},
        "Houdini":{status:"matched",confidence:.98,canonical:{title:"Houdini",artist:"Dua Lipa",bpm:117,camelot_key:"5A",genre:"Pop"}},
        "Remix":{status:"unmatched"},
        "Gasolina":{status:"matched",confidence:.99,canonical:{title:"Gasolina",artist:"Daddy Yankee",bpm:96,camelot_key:"11B",genre:"Reggaeton"}},
        "Djadja":{status:"matched",confidence:.95,canonical:{title:"Djadja",artist:"Aya Nakamura",bpm:100,camelot_key:"8A",genre:"Afropop"}}
      };
      return {ok:true, matches:(tracks||[]).map(t => ({client_track_id:t.client_track_id, status:"unmatched", ...demo[t.title]}))};
    },
    async analyzeFolderMetadata(folderPath, options){
      if(window.pywebview?.api?.analyzeFolderMetadata) return window.pywebview.api.analyzeFolderMetadata(folderPath, options || {});
      await wait(1500);
      return {
        ok: true,
        tracks: [
          {id: "1", file: "Adam Port - Move.mp3", path: folderPath + "/Adam Port - Move.mp3", artist: "Adam Port, Stryv, Keinemusik", title: "Move", bpm: 120.0, camelot_key: "8A", genre: "Afro House", status: "complete", source: "Base de connaissances"},
          {id: "2", file: "Suavemente.mp3", path: folderPath + "/Suavemente.mp3", artist: "Elvis Crespo", title: "Suavemente", bpm: 127.0, camelot_key: "4B", genre: "Latino", status: "complete", source: "Base de connaissances"},
          {id: "3", file: "Losing It.wav", path: folderPath + "/Losing It.wav", artist: "Fisher", title: "Losing It", bpm: 126.0, camelot_key: "5A", genre: "Tech House", status: "enriched_sourcing", source: "Sourcing externe"},
          {id: "4", file: "Inconnu - Titre.mp3", path: folderPath + "/Inconnu - Titre.mp3", artist: "Inconnu", title: "Titre", bpm: null, camelot_key: null, genre: "A verifier", status: "incomplete", source: "Non identifié"}
        ]
      };
    },
    async refineTrackMetadata(path, title, artist){
      if(window.pywebview?.api?.refineTrackMetadata) return window.pywebview.api.refineTrackMetadata(path, title, artist);
      await wait(700);
      return {ok:true, status:"probable", method:"text",
        recording:{artist:artist || "Linkin Park", title:title || "Numb", year:2003},
        canonical:{artist:artist || "Linkin Park", title:title || "Numb", year:2003, bpm:110.0, camelot_key:"11A", genre:"Rock"}};
    },
    async openExternalUrl(url){ if(window.pywebview?.api?.openExternalUrl) return window.pywebview.api.openExternalUrl(url); window.open(url,"_blank","noopener"); return {opened:true,url}; }
  };

  const $ = id => document.getElementById(id);
  const app = $("app");
  const views = {
    home:$("homeView"),
    smartImport:$("smartImportView"),
    smartAnalysis:$("smartAnalysisView"),
    smartFiles:$("smartFilesView"),
    smartComplete:$("smartCompleteView"),
    smartMetadata:$("smartMetadataView"),
    complete:$("completeView"),
    relink:$("relinkView"),
    prepare:$("prepareView"),
    scan:$("scanView"),
    results:$("resultsView"),
    preview:$("previewView"),
    review:$("reviewView"),
    completed:$("completedView")
  };
  const navButtons = {home:$("navHome"), prepare:$("navRepair"), complete:$("navComplete"), organize:$("navOrganize")};
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
  let smartPreflightInfo = null;
  let smartImportPlan = null;
  let smartImportResult = null;
  let smartGroupStates = new Map();
  let smartExpandedGroupId = null;
  let smartSourceDir = null;
  let smartDestinationRoot = null;
  let smartDestinationManual = false;
  let smartDestinationMode = "existing";
  let smartApplySelectedIds = [];
  let smartMetadataResult = null;
  let smartMetadataRunning = false;
  let completeFolder = "";
  let completeTracks = [];
  try{ selectedSoftwareId = localStorage.getItem("lt_preferred_software") || null; }catch(error){}

  function esc(value){ return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char])); }
  function fmt(n,singular,plural){ return `${n} ${n > 1 ? plural : singular}`; }
  function backendAvailable(){ return Boolean(window.pywebview?.api?.scan); }
  function showToast(message){ toast.textContent = message; toast.classList.add("is-open"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("is-open"), 3600); }

  async function loadAppInfo(){
    try{
      const info = await API.getAppInfo();
      if(info?.version) $("appVersionLabel").textContent = `v${info.version}`;
      return info;
    }catch(error){}
    return null;
  }

  async function hideUpdateBanner(){
    if(updateInfo?.type === "whatsNew"){
      try{ await API.acknowledgeLaunchState(); }catch(error){}
    }
    updateInfo = null;
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
    $("updateLater").textContent = "Plus tard";
    $("updateNotes").disabled = !info.notesUrl;
    $("updateNotes").textContent = "Nouveautés";
    $("updateNow").hidden = false;
    $("updateNow").textContent = "Mettre à jour";
    updateBanner.hidden = false;
    updateBanner.classList.toggle("is-mandatory", Boolean(info.mandatory));
    requestAnimationFrame(() => {
      updateBanner.classList.add("is-open");
      document.querySelector(".main").classList.add("has-banner");
    });
  }

  function renderWhatsNewBanner(state){
    const notes = state?.releaseNotes || [];
    if(!state?.showWhatsNew || !notes.length) return;
    updateInfo = {type:"whatsNew", ...state};
    $("updateTitle").textContent = `Nouveautés LostTrackr ${state.currentVersion || ""}`.trim();
    $("updateSummary").textContent = notes.slice(0, 2).join(" ");
    $("updateLater").hidden = false;
    $("updateLater").textContent = "Plus tard";
    $("updateNotes").disabled = false;
    $("updateNotes").textContent = "Détails";
    $("updateNow").hidden = false;
    $("updateNow").textContent = "Compris";
    updateBanner.hidden = false;
    updateBanner.classList.remove("is-mandatory");
    requestAnimationFrame(() => {
      updateBanner.classList.add("is-open");
      document.querySelector(".main").classList.add("has-banner");
    });
  }

  async function checkForAppUpdate(){
    if(updateInfo?.type === "whatsNew") return;
    try{
      const info = await API.checkUpdate();
      if(info?.updateAvailable) renderUpdateBanner(info);
    }catch(error){
      console.warn("LostTrackr update check failed", error);
    }
  }

  async function installAvailableUpdate(){
    if(updateInfo?.type === "whatsNew"){
      await hideUpdateBanner();
      showToast("Nouveautés marquées comme vues.");
      return;
    }
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
    if(updateInfo?.type === "whatsNew"){
      showToast((updateInfo.releaseNotes || []).join(" · "));
      return;
    }
    if(!updateInfo?.notesUrl) return;
    try{ await API.openExternalUrl(updateInfo.notesUrl); }
    catch(error){ showToast("Impossible d’ouvrir les notes de version."); }
  }
  function setState(state){ app.dataset.state = state; }
  function setNav(active){
    Object.values(navButtons).forEach(btn => btn.classList.remove("is-active"));
    const target = navButtons[active] || navButtons.prepare;
    if(target) target.classList.add("is-active");
  }
  function showView(name){
    Object.entries(views).forEach(([key, view]) => view.classList.toggle("is-active", key === name));
    app.dataset.view = name;
    setNav(name === "home" ? "home" : (name === "complete" || name === "relink") ? "complete" : name.startsWith("smart") ? "organize" : "prepare");
  }
  function showScreen(name){ showView(name); }

  function goHome(){ setState("idle"); showView("home"); LTHomeWave.play(); }
  function goPrepare(){ setState("prepare"); showView("prepare"); refreshPreflight(); }
  function goComplete(){ setState("complete"); $("completeFolder").value = completeFolder; $("completeStartBtn").disabled = !completeFolder; LTScanFX.stop(); $("completeLoader").style.display = "none"; { var _cfg2 = $("completeConfig"); if (_cfg2) _cfg2.style.display = ""; } $("completeResultsSection").style.display = "none"; showView("complete"); }

  function smartDisplay(path, fallback = "À définir"){ return path || fallback; }
  function smartLibraryRoots(info = smartPreflightInfo){ return info?.libraryRoots || []; }
  function smartLibraryDisplays(info = smartPreflightInfo){ return info?.libraryRootDisplays || smartLibraryRoots(info); }
  function currentSmartDestinationRoot(){
    if(smartDestinationRoot) return smartDestinationRoot;
    return smartLibraryRoots()[0] || null;
  }
  function currentSmartDestinationDisplay(){
    if(smartDestinationRoot) return smartDestinationRoot;
    return smartLibraryDisplays()[0] || "Dossier racine à sélectionner";
  }
  function smartConfidenceLabel(value){
    if(value === "high") return "Très probable";
    if(value === "medium") return "Bonne suggestion";
    return "À vérifier";
  }
  function smartConfidenceClass(value){
    return value === "review" ? "low" : (value || "low");
  }
  function smartTrackLabel(item){
    const artist = item?.artist ? `${item.artist} — ` : "";
    return `${artist}${item?.title || item?.file || "Titre"}`;
  }
  function renderSmartPreflight(info){
    smartPreflightInfo = info || {};
    if(!smartSourceDir) smartSourceDir = info?.defaultSourceDir || "~/Downloads";
    if(!smartDestinationRoot && smartLibraryRoots(info).length){
      smartDestinationRoot = smartLibraryRoots(info)[0];
      smartDestinationManual = false;
    }
    $("smartSourcePath").textContent = smartDisplay(info?.defaultSourceDisplay || smartSourceDir);
    $("smartSourceLabel").textContent = smartSourceDir === info?.defaultSourceDir ? "Dossier Téléchargements" : "Dossier sélectionné";
    $("smartSourceStatus").textContent = info?.sourceExists ? "Adapté à ton système" : "À choisir manuellement";
    $("smartDestinationPath").textContent = currentSmartDestinationDisplay();
    $("smartDestinationLabel").textContent = currentSmartDestinationRoot()
      ? (smartDestinationManual ? "Dossier racine sélectionné" : "Dossier probable détecté")
      : "Dossier à sélectionner";
    const displays = smartLibraryDisplays(info);
    $("smartLibraryRoots").textContent = displays.length
      ? "LostTrackr détectera et analysera automatiquement tous les sous-dossiers"
      : "Sélectionne le dossier principal de ta bibliothèque. LostTrackr analysera ensuite ses sous-dossiers";
    $("smartAnalyze").disabled = !smartSourceDir || !currentSmartDestinationRoot();
  }
  async function refreshSmartPreflight(){
    try{
      const info = await API.smartImportPreflight();
      renderSmartPreflight(info);
    }catch(error){
      showToast(error?.message || "Impossible de préparer Smart Import.");
    }
  }
  async function goSmartImport(){
    setState("smart-import");
    showView("smartImport");
    await refreshSmartPreflight();
  }
  async function chooseSmartFolder(kind){
    const title = kind === "source" ? "Choisir le dossier qui contient les nouveaux sons" : "Choisir le dossier racine de rangement";
    try{
      const result = await API.chooseFolder(title);
      if(!result?.path) return;
      if(kind === "source"){
        smartSourceDir = result.path;
        $("smartSourceLabel").textContent = "Dossier sélectionné";
        $("smartSourcePath").textContent = result.path;
        $("smartSourceStatus").textContent = "Source personnalisée";
      }else{
        smartDestinationRoot = result.path;
        smartDestinationManual = true;
        smartDestinationMode = "existing";
        $("smartDestinationPath").textContent = result.path;
        $("smartDestinationLabel").textContent = "Dossier racine sélectionné";
        $("smartLibraryRoots").textContent = "LostTrackr détectera et analysera automatiquement tous les sous-dossiers";
      }
      $("smartAnalyze").disabled = !smartSourceDir || !currentSmartDestinationRoot();
    }catch(error){
      showToast("Impossible d’ouvrir le sélecteur de dossier.");
    }
  }
  function resetSmartSource(){
    smartSourceDir = smartPreflightInfo?.defaultSourceDir || "~/Downloads";
    $("smartSourceLabel").textContent = "Dossier Téléchargements";
    $("smartSourcePath").textContent = smartPreflightInfo?.defaultSourceDisplay || smartSourceDir;
    $("smartSourceStatus").textContent = smartPreflightInfo?.sourceExists ? "Adapté à ton système" : "À vérifier";
    $("smartAnalyze").disabled = !smartSourceDir || !currentSmartDestinationRoot();
  }
  function setSmartAnalyzeButton(busy = false){
    $("smartAnalyze").innerHTML = busy
      ? `<span class="smart-cta-icon" aria-hidden="true">⌁</span><span><b>Préparation...</b><small>Ouverture de l’analyse</small></span>`
      : `<span class="smart-cta-icon" aria-hidden="true">→</span><span><b>Suivant</b><small>Lancer l’analyse des fichiers et des sous-dossiers</small></span>`;
  }
  function smartPathName(path, fallback = "Dossier"){
    return String(path || "").split(/[\\/]/).filter(Boolean).pop() || fallback;
  }
  function smartEscapePath(path){
    return String(path || "").replace(/\\/g,"/");
  }
  function smartUnderPath(child, parent){
    const childPath = smartEscapePath(child).replace(/\/+$/,"");
    const parentPath = smartEscapePath(parent).replace(/\/+$/,"");
    return childPath === parentPath || childPath.startsWith(`${parentPath}/`);
  }
  function setSmartAnalysisLoading(){
    document.querySelectorAll("#smartAnalysisInsights .crate-tile").forEach(tile => tile.classList.add("is-loading"));
    $("ciSourceCount").textContent = "–";
    $("ciSourceDetail").textContent = "Analyse du dossier source…";
    $("ciLibraryCount").textContent = "–";
    $("ciLibraryDetail").textContent = "Cartographie en cours…";
    $("ciCrateCount").textContent = "–";
    $("ciCrateDetail").textContent = "Lecture des dossiers…";
    $("ciTopName").textContent = "–";
    $("ciTopDetail").textContent = "…";
    $("smartAnalysisMapIntro").textContent = "LostTrackr lit la structure de ta bibliothèque.";
    $("smartAnalysisStatus").textContent = "Analyse en cours";
    $("smartAnalysisTree").innerHTML = `<div class="smart-analysis-placeholder"><i></i><i></i><i></i><span>Lecture des dossiers…</span></div>`;
    $("smartContinueVerify").disabled = true;
  }

  function crateCountUp(el, target){
    const value = Math.max(0, Number(target) || 0);
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = value.toLocaleString("fr-FR");
      return;
    }
    // setTimeout plutôt que requestAnimationFrame : rAF est suspendu quand la
    // fenêtre est occultée et laisserait le compteur figé à 0.
    const t0 = performance.now(), duration = 650;
    (function tick(){
      const p = Math.min(1, (performance.now() - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(value * eased).toLocaleString("fr-FR");
      if (p < 1) setTimeout(tick, 24);
    })();
  }
  function smartFolderSuggestionCount(folder){
    const path = folder?.path || "";
    return (smartImportPlan?.files || []).filter(item => smartUnderPath(item.destinationFolder || "", path)).length;
  }
  function smartFolderTreeRows(){
    const root = currentSmartDestinationRoot();
    const folders = smartImportPlan?.libraryFolders || [];
    const childrenByTop = new Map();
    folders.forEach(folder => {
      const rawPath = smartEscapePath(folder.path || "");
      const rootPath = smartEscapePath(root || "").replace(/\/+$/,"");
      let relative = rawPath.startsWith(`${rootPath}/`) ? rawPath.slice(rootPath.length + 1) : smartPathName(rawPath);
      relative = relative.replace(/^\/+/,"");
      const parts = relative.split("/").filter(Boolean);
      if(!parts.length) return;
      const top = parts[0];
      const childName = parts.length > 1 ? parts.slice(1).join(" / ") : top;
      if(!childrenByTop.has(top)) childrenByTop.set(top, []);
      childrenByTop.get(top).push({
        name:childName,
        count:smartFolderSuggestionCount(folder),
        audioCount:Number(folder.audioCount || 0),
        genres:folder.genres || []
      });
    });
    if(!childrenByTop.size){
      (smartImportPlan?.groups || []).forEach(group => {
        const name = group.name || "À vérifier";
        if(!childrenByTop.has(name)) childrenByTop.set(name, []);
        childrenByTop.get(name).push({name, count:Number(group.trackCount || 0), audioCount:0, genres:[]});
      });
    }
    return [...childrenByTop.entries()].slice(0,10).map(([top, children]) => {
      const uniqueChildren = [];
      const seen = new Set();
      children
        .sort((left, right) => right.count - left.count || right.audioCount - left.audioCount || left.name.localeCompare(right.name))
        .forEach(child => {
          if(seen.has(child.name)) return;
          seen.add(child.name);
          uniqueChildren.push(child);
        });
      const totalSuggestions = uniqueChildren.reduce((sum, child) => sum + Number(child.count || 0), 0);
      return {top, children:uniqueChildren.slice(0,8), totalSuggestions};
    });
  }
  function renderSmartAnalysisComplete(){
    const audioCount = Number(smartImportPlan?.totals?.audio || 0);
    const sourceLabel = smartImportPlan?.sourceDisplay || smartImportPlan?.sourceDir || "dossier source";
    const destinationRoot = smartImportPlan?.destinationRootDisplay || smartImportPlan?.destinationRoot || currentSmartDestinationDisplay();
    const folders = smartImportPlan?.libraryFolders || [];
    const directChildren = new Set();
    const rootPath = smartEscapePath(smartImportPlan?.destinationRoot || currentSmartDestinationRoot() || "").replace(/\/+$/,"");
    folders.forEach(folder => {
      const rawPath = smartEscapePath(folder.path || "");
      const relative = rawPath.startsWith(`${rootPath}/`) ? rawPath.slice(rootPath.length + 1) : "";
      const top = relative.split("/").filter(Boolean)[0];
      if(top) directChildren.add(top);
    });
    const childCount = Math.max(0, folders.length - directChildren.size);
    const libraryTotal = folders.reduce((sum, f) => sum + Number(f.audioCount || 0), 0);
    let biggest = null;
    folders.forEach(f => { if (!biggest || Number(f.audioCount || 0) > Number(biggest.audioCount || 0)) biggest = f; });

    document.querySelectorAll("#smartAnalysisInsights .crate-tile").forEach(tile => tile.classList.remove("is-loading"));
    crateCountUp($("ciSourceCount"), audioCount);
    $("ciSourceDetail").textContent = `dans ${sourceLabel}`;
    crateCountUp($("ciLibraryCount"), libraryTotal);
    $("ciLibraryDetail").textContent = `sous ${destinationRoot}`;
    crateCountUp($("ciCrateCount"), folders.length);
    $("ciCrateDetail").textContent = `${fmt(directChildren.size || 0, "famille", "familles")} · ${fmt(childCount, "dossier enfant", "dossiers enfants")}`;
    $("ciTopName").textContent = biggest ? smartPathName(biggest.path || "") : "—";
    $("ciTopDetail").textContent = biggest ? fmt(Number(biggest.audioCount || 0), "titre présent", "titres présents") : "aucune crate détectée";

    $("smartAnalysisMapIntro").textContent = `${fmt(directChildren.size || folders.length, "famille", "familles")} et ${fmt(childCount, "dossier enfant", "dossiers enfants")} sous ${destinationRoot}. La longueur des barres reflète le volume de chaque crate.`;
    $("smartAnalysisStatus").textContent = "Analyse terminée";

    const rows = smartFolderTreeRows();
    $("smartAnalysisTree").innerHTML = rows.length ? `<div class="crate-map">` + rows.map((row, i) => {
      const groupTotal = row.children.reduce((sum, c) => sum + Number(c.audioCount || 0), 0);
      const share = libraryTotal ? Math.round(groupTotal / libraryTotal * 100) : 0;
      const maxCount = Math.max(1, ...row.children.map(c => Number(c.audioCount || 0) + Number(c.count || 0)));
      const bars = row.children.map((child, j) => {
        const present = Number(child.audioCount || 0);
        const incoming = Number(child.count || 0);
        const w = Math.max(4, Math.round(present / maxCount * 100));
        const sw = incoming ? Math.max(2, Math.min(100 - w, Math.round(incoming / maxCount * 100))) : 0;
        const delay = i * 70 + 160 + j * 45;
        const genres = (child.genres || []).slice(0, 4).join(", ");
        const barLabel = child.name === row.top ? "À la racine" : child.name;
        return `<div class="crate-bar"${genres ? ` title="${esc(genres)}"` : ""}>
          <span class="crate-bar-name">${esc(barLabel)}</span>
          <span class="crate-bar-track"><i style="--w:${w}%; --d:${delay}ms"></i>${sw ? `<em style="--w:${w}%; --sw:${sw}%; --d:${delay}ms"></em>` : ""}</span>
          <span class="crate-bar-count">${esc(String(present))}${incoming ? ` <b>+${esc(String(incoming))}</b>` : ""}</span>
        </div>`;
      }).join("");
      return `<article class="crate-card" style="--d:${i * 70}ms">
        <header class="crate-card-head">
          <h3>${esc(row.top)}</h3>
          <div class="crate-card-meta">
            ${row.totalSuggestions ? `<span class="crate-card-badge">+${esc(String(row.totalSuggestions))} à ranger</span>` : ""}
            <span class="crate-card-share">${esc(fmt(groupTotal, "titre", "titres"))}${share ? ` · ${share}%` : ""}</span>
          </div>
        </header>
        <div class="crate-bars">${bars}</div>
      </article>`;
    }).join("") + `</div>` : `<div class="empty">Aucun sous-dossier exploitable détecté dans ce dossier racine.</div>`;
    $("smartContinueVerify").disabled = false;
  }
  async function startSmartImportScan(){
    const button = $("smartAnalyze");
    button.disabled = true;
    setSmartAnalyzeButton(true);
    setState("smart-analysis");
    showView("smartAnalysis");
    setSmartAnalysisLoading();
    try{
      const destinationRoot = currentSmartDestinationRoot();
      smartImportPlan = await API.smartImportScan({
        sourceDir: smartSourceDir || smartPreflightInfo?.defaultSourceDir,
        destinationMode: "existing",
        destinationRoot,
        libraryRoots: destinationRoot ? [destinationRoot] : []
      });
      smartGroupStates = new Map();
      smartExpandedGroupId = null;
      smartMetadataResult = null;
      renderSmartAnalysisComplete();
    }catch(error){
      showView("smartImport");
      showToast(error?.message || "Smart Import n’a pas pu analyser ce dossier.");
    }finally{
      button.disabled = false;
      setSmartAnalyzeButton(false);
    }
  }
  function continueSmartVerify(){
    if(!smartImportPlan){ showToast("L’analyse n’est pas encore terminée."); return; }
    renderSmartFilePlan();
    setState("smart-files");
    showView("smartFiles");
  }
  function smartGroupName(path){
    const name = String(path || "").split(/[\\/]/).filter(Boolean).pop() || "Destination";
    return /^a[ _-]?verifier$/i.test(name.normalize("NFD").replace(/[\u0300-\u036f]/g,"")) ? "À vérifier" : name;
  }
  function buildSmartGroupsFromFiles(files){
    const grouped = new Map();
    files.forEach(item => {
      const folder = item.destinationFolder || item.destinationFolderDisplay || "À vérifier";
      if(!grouped.has(folder)) grouped.set(folder, []);
      grouped.get(folder).push(item);
    });
    return [...grouped.entries()].map(([folder, items], index) => {
      const confidences = new Set(items.map(item => item.confidence || "review"));
      const confidence = confidences.has("review") || confidences.has("low") ? "low" : (confidences.has("medium") ? "medium" : "high");
      return {
        id:`group-${index}-${folder}`,
        name:smartGroupName(folder),
        trackCount:items.length,
        confidence,
        confidenceLabel:smartConfidenceLabel(confidence),
        status:confidence === "low" ? "review" : "suggested",
        reason:items[0]?.reason || "Destination proposée",
        reasonCode:items[0]?.reasonCode || "library_match",
        destinationFolder:folder,
        destinationFolderDisplay:items[0]?.destinationFolderDisplay || folder,
        logoKey:null,
        items:items.map(item => item.id)
      };
    }).sort((left, right) => (left.confidence === "low") - (right.confidence === "low") || right.trackCount - left.trackCount || left.name.localeCompare(right.name));
  }
  function smartGroups(){
    const files = smartImportPlan?.files || [];
    return (smartImportPlan?.groups?.length ? smartImportPlan.groups : buildSmartGroupsFromFiles(files)).map(group => ({
      ...group,
      confidence:group.confidence === "review" ? "low" : (group.confidence || "low"),
      confidenceLabel:group.confidenceLabel || smartConfidenceLabel(group.confidence)
    }));
  }
  function smartFilesById(){
    return new Map((smartImportPlan?.files || []).map(item => [item.id, item]));
  }
  function smartGroupState(group){
    if(!smartGroupStates.has(group.id)){
      smartGroupStates.set(group.id, group.status || (group.confidence === "low" ? "review" : "suggested"));
    }
    return smartGroupStates.get(group.id);
  }
  function smartReliableGroups(groups){
    return groups.filter(group => group.confidence === "high" || group.confidence === "medium");
  }
  function smartValidatedFileIds(){
    const groups = smartGroups();
    return groups.flatMap(group => smartGroupState(group) === "validated" ? (group.items || []) : []);
  }
  function updateSmartReviewControls(groups){
    const reliableCount = groups.reduce((sum, group) => sum + ((group.confidence === "high" || group.confidence === "medium") ? Number(group.trackCount || 0) : 0), 0);
    const reviewCount = groups.reduce((sum, group) => sum + (group.confidence === "low" ? Number(group.trackCount || 0) : 0), 0);
    const validatedIds = smartValidatedFileIds();
    const reliableGroups = smartReliableGroups(groups);
    const allReliableValidated = reliableGroups.length > 0 && reliableGroups.every(group => smartGroupState(group) === "validated");
    rollTo($("smartReliableCount"), reliableCount);
    $("smartReviewNeedsCount").textContent = fmt(reviewCount, "morceau", "morceaux");
    $("smartValidateReliableSub").textContent = `${fmt(reliableCount, "morceau sera prêt", "morceaux seront prêts")} à déplacer`;
    $("smartReviewRemainingSub").textContent = `${fmt(reviewCount, "morceau nécessite", "morceaux nécessitent")} ton avis`;
    $("smartValidateReliable").disabled = reliableCount <= 0 || allReliableValidated;
    $("smartReviewRemaining").disabled = reviewCount <= 0;
    $("smartMoveFiles").disabled = validatedIds.length <= 0;
    $("smartMoveFiles").textContent = validatedIds.length
      ? `Continuer vers Appliquer (${fmt(validatedIds.length, "morceau", "morceaux")})`
      : "Continuer vers Appliquer";

    const sourceDisplay = smartImportPlan?.sourceDisplay || smartImportPlan?.sourceDir || "À définir";
    const destinationDisplay = smartImportPlan?.destinationRootDisplay || smartImportPlan?.destinationRoot || "À définir";
    $("smartReviewSourcePath").textContent = sourceDisplay;
    $("smartReviewSourcePath").title = smartImportPlan?.sourceDir || sourceDisplay;
    $("smartReviewDestinationPath").textContent = destinationDisplay;
    $("smartReviewDestinationPath").title = smartImportPlan?.destinationRoot || destinationDisplay;
  }
  function smartKnownDestinationFolders(currentPath = ""){
    const folders = new Map();
    (smartImportPlan?.libraryFolders || []).forEach(folder => {
      if(!folder?.path) return;
      folders.set(folder.path, folder);
    });
    if(currentPath && !folders.has(currentPath)){
      folders.set(currentPath, {
        path:currentPath,
        display:currentPath,
        name:smartGroupName(currentPath),
        audioCount:0,
        genres:[]
      });
    }
    return [...folders.values()].sort((left, right) => {
      const leftName = smartGroupName(left.path || left.display || left.name);
      const rightName = smartGroupName(right.path || right.display || right.name);
      return leftName.localeCompare(rightName);
    });
  }
  function smartReviewFolder(path){
    const normalized = smartGroupName(path);
    return normalized === "À vérifier" || /LostTrackr Smart Import[\\/]+A verifier/i.test(String(path || ""));
  }
  function smartDestinationOptionLabel(folder){
    const root = smartImportPlan?.destinationRoot || currentSmartDestinationRoot() || "";
    const raw = smartEscapePath(folder.path || folder.display || "");
    const rootPath = smartEscapePath(root).replace(/\/+$/,"");
    const relative = raw.startsWith(`${rootPath}/`) ? raw.slice(rootPath.length + 1) : (folder.name || raw);
    const count = Number(folder.audioCount || 0);
    return `${relative || folder.name || "Dossier"}${count ? ` · ${fmt(count, "titre", "titres")}` : ""}`;
  }
  function renderSmartDestinationSelect(item){
    const currentFolder = item.destinationFolder || "";
    const currentIsReview = item.confidence === "review" || item.confidence === "low" || smartReviewFolder(currentFolder);
    const options = smartKnownDestinationFolders(currentIsReview ? "" : currentFolder);
    if(!options.length){
      return `<button class="smart-track-change" type="button" data-smart-track-change="${esc(item.id || "")}">Changer</button>`;
    }
    return `
      <select class="smart-track-select" data-smart-track-select="${esc(item.id || "")}" aria-label="Changer le sous-dossier de ${esc(item.file || "ce titre")}">
        <option value="" ${currentIsReview ? "selected" : ""}>Ignorer ce titre</option>
        ${options.map(folder => {
          const selected = !currentIsReview && folder.path === currentFolder ? "selected" : "";
          return `<option value="${esc(folder.path)}" ${selected}>${esc(smartDestinationOptionLabel(folder))}</option>`;
        }).join("")}
      </select>`;
  }
  function renderSmartGroupTracks(group, fileMap){
    return (group.items || []).slice(0,8).map(id => {
      const item = fileMap.get(id) || {};
      return `
        <div class="smart-group-track" data-tooltip="${esc(item.destinationDisplay || item.destination || "")}">
          <b>${esc(smartTrackLabel(item))}</b>
          <code>${esc(item.destinationDisplay || item.destinationFolderDisplay || "")}</code>
          ${renderSmartDestinationSelect(item)}
        </div>`;
    }).join("") || `<div class="empty">Aucun morceau détaillé dans ce groupe.</div>`;
  }
  function renderSmartFilePlan(){
    const files = smartImportPlan?.files || [];
    const list = $("smartSuggestionList");
    list.innerHTML = "";
    if(!files.length){
      updateSmartReviewControls([]);
      list.innerHTML = `<div class="empty">Aucun fichier audio compatible dans ce dossier.</div>`;
      return;
    }
    const groups = smartGroups();
    const fileMap = smartFilesById();
    groups.forEach(group => {
      const state = smartGroupState(group);
      const confidenceClass = smartConfidenceClass(group.confidence);
      const card = document.createElement("article");
      card.className = `smart-suggestion-card is-${esc(state)} ${group.confidence === "low" ? "is-review" : ""} ${smartExpandedGroupId === group.id ? "is-expanded" : ""}`;
      card.dataset.groupId = group.id;
      const reviewActions = group.confidence === "low"
        ? `<button class="smart-card-btn" type="button" data-smart-action="view">Choisir un dossier</button><button class="smart-card-btn warning" type="button" data-smart-action="ignore">Ignorer</button>`
        : `<button class="smart-card-btn" type="button" data-smart-action="view">Voir les morceaux</button><button class="smart-card-btn primary" type="button" data-smart-action="validate" ${state === "validated" ? "disabled" : ""}>${state === "validated" ? "Validé" : "Valider"}</button><button class="smart-card-btn ghost" type="button" data-smart-action="change">Changer</button>`;
      const reason = group.confidence === "low"
        ? `${group.reason || "Score insuffisant"} · choisis un sous-dossier ou laisse ignoré.`
        : (group.reason || "Destination proposée");
      card.innerHTML = `
        <div class="smart-card-handle" aria-hidden="true"></div>
        <div class="smart-crate-logo-placeholder smart-folder-placeholder" aria-hidden="true"><span>?</span></div>
        <div class="smart-suggestion-copy">
          <div class="smart-suggestion-top">
            <h2>${esc(group.name || "Destination proposée")}</h2>
            <em class="smart-confidence-badge smart-confidence-${esc(confidenceClass)}">${esc(group.confidenceLabel || smartConfidenceLabel(group.confidence))}</em>
          </div>
          <span class="smart-suggestion-count">${esc(fmt(Number(group.trackCount || 0), "morceau", "morceaux"))}</span>
          <p class="smart-suggestion-reason">${esc(reason)}</p>
        </div>
        <div class="smart-suggestion-actions">${reviewActions}</div>
        <div class="smart-group-tracks">${renderSmartGroupTracks(group, fileMap)}</div>`;
      list.appendChild(card);
    });
    updateSmartReviewControls(groups);
  }
  function setSmartGroupStatus(groupId, status){
    smartGroupStates.set(groupId, status);
    renderSmartFilePlan();
  }
  async function refreshSmartPlanDestination(payload){
    const previousExpanded = smartExpandedGroupId;
    try{
      const nextPlan = await API.smartImportChooseDestination(payload);
      if(nextPlan?.files){
        smartImportPlan = nextPlan;
        smartGroupStates = new Map();
        const nextGroups = smartGroups();
        smartExpandedGroupId = nextGroups.some(group => group.id === previousExpanded)
          ? previousExpanded
          : nextGroups.find(group => group.confidence === "low")?.id || null;
        renderSmartFilePlan();
        showToast("Destination mise à jour dans le plan. Aucun fichier n’a encore été déplacé.");
      }
    }catch(error){
      showToast(error?.message || "Impossible de modifier cette destination.");
    }
  }
  function changeSmartGroupDestination(groupId){
    refreshSmartPlanDestination({scope:"group", id:groupId});
  }
  function changeSmartTrackDestination(trackId, destinationFolder = null){
    if(destinationFolder === ""){
      showToast("Titre ignoré pour ce déplacement. Il reste dans son dossier source.");
      return;
    }
    refreshSmartPlanDestination({scope:"track", id:trackId, destinationFolder});
  }
  function handleSmartDestinationSelect(event){
    const select = event.target.closest("[data-smart-track-select]");
    if(!select) return;
    const trackId = select.dataset.smartTrackSelect;
    if(trackId) changeSmartTrackDestination(trackId, select.value);
  }
  function handleSmartSuggestionClick(event){
    const trackButton = event.target.closest("[data-smart-track-change]");
    if(trackButton){
      event.stopPropagation();
      const trackId = trackButton.dataset.smartTrackChange;
      if(trackId) changeSmartTrackDestination(trackId);
      return;
    }
    const button = event.target.closest("[data-smart-action]");
    if(!button) return;
    const card = button.closest(".smart-suggestion-card");
    const groupId = card?.dataset?.groupId;
    if(!groupId) return;
    const action = button.dataset.smartAction;
    if(action === "view"){
      smartExpandedGroupId = smartExpandedGroupId === groupId ? null : groupId;
      renderSmartFilePlan();
      return;
    }
    if(action === "validate"){
      setSmartGroupStatus(groupId, "validated");
      showToast("Suggestion validée. Aucun fichier n’a encore été déplacé.");
      return;
    }
    if(action === "ignore"){
      setSmartGroupStatus(groupId, "ignored");
      showToast("Groupe ignoré pour ce déplacement.");
      return;
    }
    if(action === "change"){
      changeSmartGroupDestination(groupId);
      return;
    }
    if(action === "open"){
      smartExpandedGroupId = groupId;
      renderSmartFilePlan();
      showToast("Ouverture du dossier bientôt disponible. Les morceaux sont affichés ici pour vérification.");
    }
  }
  function validateReliableSmartGroups(){
    const groups = smartGroups();
    smartReliableGroups(groups).forEach(group => {
      if(smartGroupState(group) !== "ignored") smartGroupStates.set(group.id, "validated");
    });
    renderSmartFilePlan();
    const count = smartValidatedFileIds().length;
    showToast(`${fmt(count, "morceau fiable validé", "morceaux fiables validés")}. Lance le déplacement quand tu es prêt.`);
  }
  function focusSmartReviewGroups(){
    const reviewGroup = smartGroups().find(group => group.confidence === "low" && smartGroupState(group) !== "ignored");
    if(!reviewGroup){ showToast("Aucun groupe restant à vérifier."); return; }
    smartExpandedGroupId = reviewGroup.id;
    renderSmartFilePlan();
    const card = [...document.querySelectorAll(".smart-suggestion-card")].find(element => element.dataset.groupId === reviewGroup.id);
    card?.scrollIntoView({behavior:reduced ? "auto" : "smooth", block:"center"});
  }
  function renderSmartApplyList(files){
    const list = $("smartApplyList");
    list.innerHTML = files.length ? files.slice(0,80).map(item => `
      <div class="smart-apply-row">
        <b>${esc(smartTrackLabel(item))}</b>
        <code>${esc(item.sourceDisplay || item.source || "")}</code>
        <span>→</span>
        <code>${esc(item.destinationDisplay || item.destination || "")}</code>
      </div>
    `).join("") : `<div class="empty">Aucun changement validé pour l’instant.</div>`;
  }
  function goSmartApplyPreview(){
    smartApplySelectedIds = smartValidatedFileIds();
    if(!smartApplySelectedIds.length){ showToast("Valide au moins une suggestion avant de continuer."); return; }
    const fileMap = smartFilesById();
    const selectedFiles = smartApplySelectedIds.map(id => fileMap.get(id)).filter(Boolean);
    const total = Number(smartImportPlan?.totals?.audio || smartImportPlan?.files?.length || 0);
    const pending = Math.max(0, total - selectedFiles.length);
    $("smartCompleteTitle").textContent = "Appliquer les changements";
    $("smartCompleteSub").textContent = "Dernier état des lieux avant déplacement. Rien n’est modifié tant que tu ne valides pas cette page.";
    $("smartApplyReadyBadge").textContent = "À valider";
    $("smartDoneMoved").textContent = String(selectedFiles.length);
    $("smartDonePending").textContent = String(pending);
    $("smartDoneManifest").textContent = "Le manifeste sera créé au moment du déplacement.";
    $("smartFinalApply").disabled = false;
    $("smartFinalApply").textContent = "Valider et déplacer";
    $("smartApplyBackReview").disabled = false;
    $("smartMetadataButton").disabled = false;
    renderSmartApplyList(selectedFiles);
    updateSmartMetadataButtonState();
    setState("smart-apply");
    showView("smartComplete");
  }
  async function applySmartImportMoves(){
    const selectedIds = smartApplySelectedIds.length ? smartApplySelectedIds : smartValidatedFileIds();
    if(!selectedIds.length){ showToast("Valide au moins une suggestion avant de déplacer."); return; }
    if(!confirm(`LostTrackr va déplacer ${fmt(selectedIds.length, "morceau validé", "morceaux validés")}. Aucune copie audio ne sera créée. Continuer ?`)) return;
    const button = $("smartFinalApply");
    button.disabled = true;
    button.textContent = "Déplacement...";
    try{
      smartImportResult = await API.smartImportApply(selectedIds);
      showToast(`${smartImportResult.moved || 0} fichier${(smartImportResult.moved || 0) > 1 ? "s" : ""} déplacé${(smartImportResult.moved || 0) > 1 ? "s" : ""}.`);
      renderSmartApplyResult();
    }catch(error){
      showToast(error?.message || "Le déplacement a échoué. Vérifie les droits du dossier.");
    }finally{
      if(!smartImportResult){
        button.disabled = false;
        button.textContent = "Valider et déplacer";
      }
    }
  }
  function renderSmartApplyResult(){
    const moved = Number(smartImportResult?.moved || 0);
    const total = Number(smartImportPlan?.totals?.audio || smartImportPlan?.files?.length || 0);
    const pending = Math.max(0, total - moved);
    $("smartCompleteTitle").textContent = "Déplacement terminé";
    $("smartCompleteSub").textContent = "Les fichiers validés ont été déplacés. Le manifeste permet de garder une trace de l’opération.";
    $("smartApplyReadyBadge").textContent = "Manifeste créé";
    rollTo($("smartDoneMoved"), moved);
    rollTo($("smartDonePending"), pending);
    $("smartDoneManifest").textContent = smartImportResult?.manifestDisplay
      ? `Manifeste créé : ${smartImportResult.manifestDisplay}`
      : "Aucun déplacement lancé depuis cet écran. Le plan reste disponible pendant la session.";
    renderSmartApplyList((smartImportResult?.items || []).map(item => ({
      file:item.file,
      title:item.file,
      sourceDisplay:item.fromDisplay,
      destinationDisplay:item.toDisplay
    })));
    $("smartFinalApply").disabled = true;
    $("smartFinalApply").textContent = "Déplacement terminé";
    $("smartApplyBackReview").disabled = true;
    $("smartMetadataButton").disabled = true;
    setState("smart-complete");
    showView("smartComplete");
  }
  function smartMetadataSelectedIds(){
    return smartApplySelectedIds.length ? smartApplySelectedIds : smartValidatedFileIds();
  }
  function smartMetadataSelectedFiles(){
    const fileMap = smartFilesById();
    return smartMetadataSelectedIds().map(id => fileMap.get(id)).filter(Boolean);
  }
  function updateSmartMetadataButtonState(){
    const button = $("smartMetadataButton");
    if(!button) return;
    const title = button.querySelector("b");
    const detail = button.querySelector("small");
    const totals = smartMetadataResult?.totals;
    if(totals && Number(totals.total || 0) > 0){
      if(title) title.textContent = "Métadonnées prêtes";
      if(detail) detail.textContent = `${Number(totals.complete || 0)} reconnus · ${Number(totals.suggestion || 0)} suggestions · ${Number(totals.incomplete || 0)} incomplets`;
    }else{
      if(title) title.textContent = "Compléter les métadonnées";
      if(detail) detail.textContent = "BPM, artiste, titre, année, genre et clé Camelot";
    }
  }
  function smartMetadataStatusClass(status){
    if(status === "complete") return "is-complete";
    if(status === "probable_suggestion" || status === "enriched_sourcing") return "is-suggestion";
    return "is-incomplete";
  }
  function smartMetadataStatusBadge(status){
    if(status === "complete") return `<span class="status-badge status-complete">Base de connaissances</span>`;
    if(status === "probable_suggestion" || status === "enriched_sourcing") return `<span class="status-badge status-suggestion">Suggestion KB</span>`;
    return `<span class="status-badge status-incomplete">Incomplet</span>`;
  }
  function smartMetadataConfidenceText(value){
    if(value === null || value === undefined || value === "") return "";
    const numeric = Number(value);
    if(Number.isNaN(numeric)) return "";
    const pct = numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric);
    return `${pct}% confiance`;
  }
  function smartMetadataChip(label, muted = false){
    return `<span class="smart-metadata-chip${muted ? " is-muted" : ""}">${esc(label)}</span>`;
  }
  function renderSmartMetadataError(message){
    $("smartMetadataLoader").style.display = "none";
    $("smartMetadataResults").hidden = false;
    $("smartMetadataTotalCount").textContent = "0";
    $("smartMetadataKnownCount").textContent = "0";
    $("smartMetadataSuggestionCount").textContent = "0";
    $("smartMetadataMissingCount").textContent = "0";
    $("smartMetadataSummary").textContent = message || "Le centre de connaissances est momentanément indisponible.";
    $("smartMetadataList").innerHTML = `<div class="empty">Aucune métadonnée n’a été appliquée. Tu peux revenir à l’écran précédent et relancer plus tard.</div>`;
  }
  function renderSmartMetadataResults(result){
    const records = result?.records || [];
    const totals = result?.totals || records.reduce((acc, record) => {
      acc.total++;
      if(record.status === "complete") acc.complete++;
      else if(record.status === "probable_suggestion" || record.status === "enriched_sourcing") acc.suggestion++;
      else acc.incomplete++;
      return acc;
    }, {complete:0,suggestion:0,incomplete:0,total:0});
    const fileMap = smartFilesById();
    records.forEach(record => {
      const item = fileMap.get(record.id);
      if(item) item.metadata = record;
    });
    $("smartMetadataLoader").style.display = "none";
    $("smartMetadataResults").hidden = false;
    $("smartMetadataTotalCount").textContent = Number(totals.total || records.length || 0);
    $("smartMetadataKnownCount").textContent = Number(totals.complete || 0);
    $("smartMetadataSuggestionCount").textContent = Number(totals.suggestion || 0);
    $("smartMetadataMissingCount").textContent = Number(totals.incomplete || 0);
    $("smartMetadataSourceBadge").textContent = result?.source || "Knowledge Base";
    $("smartMetadataSummary").textContent = records.length
      ? "Ces résultats enrichissent le plan Smart Import. Les suggestions orange restent à vérifier avant toute écriture de tags."
      : "Aucun titre sélectionné n’a pu être envoyé à la Base de connaissances.";
    $("smartMetadataList").innerHTML = records.length ? records.map(record => {
      const artistTitle = record.artist ? `${record.artist} - ${record.title || record.file}` : (record.title || record.file || "Titre inconnu");
      const chips = [
        record.bpm ? smartMetadataChip(`${parseFloat(record.bpm).toFixed(1)} BPM`) : smartMetadataChip("BPM manquant", true),
        record.camelot_key ? smartMetadataChip(record.camelot_key) : smartMetadataChip("Clé manquante", true),
        record.genre ? smartMetadataChip(record.genre) : smartMetadataChip("Genre manquant", true),
        record.year ? smartMetadataChip(String(record.year)) : ""
      ].filter(Boolean).join("");
      const confidence = smartMetadataConfidenceText(record.confidence);
      return `
        <article class="smart-metadata-row ${smartMetadataStatusClass(record.status)}">
          <div class="smart-metadata-file">
            <b>${esc(record.file || record.title || "Titre")}</b>
            <small>${esc(record.destinationDisplay || "Destination conservée dans le plan")}</small>
          </div>
          <div class="smart-metadata-main">
            <strong>${esc(artistTitle)}</strong>
            <div class="smart-metadata-chips">${chips}</div>
          </div>
          <div class="smart-metadata-status">
            ${smartMetadataStatusBadge(record.status)}
            ${confidence ? `<span class="smart-metadata-confidence">${confidence}</span>` : ""}
          </div>
        </article>`;
    }).join("") : `<div class="empty">Aucun résultat à afficher.</div>`;
    updateSmartMetadataButtonState();
    renderSmartApplyList(smartMetadataSelectedFiles());
  }
  function returnSmartMetadataToApply(){
    LTScanFX.stop();
    setState("smart-apply");
    showView("smartComplete");
  }
  async function enrichSmartMetadata(){
    if(smartMetadataRunning) return;
    const selectedIds = smartMetadataSelectedIds();
    if(!selectedIds.length){ showToast("Valide au moins une suggestion avant d’enrichir les métadonnées."); return; }
    smartMetadataRunning = true;
    const metadataButton = $("smartMetadataButton");
    const retryButton = $("smartMetadataRetry");
    if(metadataButton) metadataButton.disabled = true;
    if(retryButton) retryButton.disabled = true;
    $("smartMetadataLoader").style.display = "flex";
    $("smartMetadataResults").hidden = true;
    $("smartMetadataLoaderText").textContent = "Connexion au Centre de connaissances LostTrackr…";
    setState("smart-metadata");
    showView("smartMetadata");
    setWaveformProgressTarget("smartMetadataWaveformProgressBarWrapper", "smartMetadataWaveformProgressText");
    generateWaveformBars();
    updateWaveformProgress(0);
    LTScanFX.start(document.getElementById("smartMetadataScanCanvas"), "#smartMetadataLoader");
    let progress = 0;
    const progressTimer = setInterval(() => {
      progress = Math.min(92, progress + (progress < 55 ? 9 : 4));
      updateWaveformProgress(progress);
      if(progress > 30) $("smartMetadataLoaderText").textContent = "Croisement avec lt-intelligence et lt-db-prod…";
      if(progress > 68) $("smartMetadataLoaderText").textContent = "Consolidation BPM, clé Camelot et genre…";
    }, 260);
    try{
      const result = await API.smartImportMetadata(selectedIds);
      if(!result || !result.ok) throw new Error(result?.error || "Le centre de connaissances est indisponible.");
      smartMetadataResult = result;
      clearInterval(progressTimer);
      updateWaveformProgress(100);
      await wait(220);
      LTScanFX.stop();
      renderSmartMetadataResults(result);
      const totals = result.totals || {};
      const known = Number(totals.complete || 0) + Number(totals.suggestion || 0);
      showToast(`${known} titre${known > 1 ? "s" : ""} enrichi${known > 1 ? "s" : ""} par la Base de connaissances.`);
    }catch(error){
      clearInterval(progressTimer);
      LTScanFX.stop();
      renderSmartMetadataError(error?.message || "Le centre de connaissances est momentanément indisponible.");
      showToast(error?.message || "Le centre de connaissances est momentanément indisponible.");
    }finally{
      smartMetadataRunning = false;
      if(metadataButton) metadataButton.disabled = false;
      if(retryButton) retryButton.disabled = false;
      updateSmartMetadataButtonState();
    }
  }

  async function chooseCompleteFolder() {
    try {
      const result = await API.chooseFolder("Choisir le dossier à analyser");
      if (!result?.path) return;
      completeFolder = result.path;
      $("completeFolder").value = result.path;
      $("completeStartBtn").disabled = false;
    } catch(error) {
      showToast("Impossible d’ouvrir le sélecteur de dossier.");
    }
  }

  // ===== lt-intelligence · animation de scan (WebGL, shader "wave" porté du composant Siri) =====
  /* ------------------------------------------------------------------
     LTHomeWave — signature d'accueil.
     Portage 2D de la direction artistique du site (ParticleField) : un nuage
     de particules « perdu » (chaud, desature, cassé) se recompose en une
     forme d'onde DJ propre qui culmine sur le bleu LostTrackr.
     Volontairement plus leger que le site (WebGL, ~6000 particules) : ici
     ~1600 particules en canvas 2D, joue une fois puis se fige.
     ------------------------------------------------------------------ */
  const LTHomeWave = (function () {
    const COLS = 230, ROWS = 11, COUNT = COLS * ROWS;
    const DURATION = 2400;

    // Etat casse : les couleurs d'alerte du systeme (--danger / --orange).
    const LOST = [[255,106,85],[201,74,58],[255,133,14],[124,80,64]];
    // Etat repare : noyau grave chaud -> pointes aigues sur le bleu de marque.
    const FIXED = [[0,[255,59,47]],[0.2,[255,106,61]],[0.4,[255,155,42]],
                   [0.58,[255,93,143]],[0.74,[198,92,255]],[0.88,[21,152,255]],[1,[87,180,255]]];

    let canvas = null, ctx = null, raf = 0, started = 0, field = null, dpr = 1;

    const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
    const hash = n => { const v = Math.sin(n * 12.9898) * 43758.5453; return v - Math.floor(v); };

    function gradient(v){
      v = clamp01(v);
      for(let k = 1; k < FIXED.length; k++){
        if(v <= FIXED[k][0]){
          const [t0, c0] = FIXED[k-1], [t1, c1] = FIXED[k];
          const f = (v - t0) / (t1 - t0);
          return [c0[0]+(c1[0]-c0[0])*f, c0[1]+(c1[1]-c0[1])*f, c0[2]+(c1[2]-c0[2])*f];
        }
      }
      return FIXED[FIXED.length-1][1];
    }

    // Enveloppe « musicale » : montee lente, transitoires de kick, detail fin.
    function amplitude(i){
      const u = i / (COLS - 1);
      const build = 0.32 + 0.42 * (0.5 + 0.5 * Math.sin(u * Math.PI * 2 - Math.PI/2));
      const phrase = 0.16 * Math.sin(u * Math.PI * 6.3 + 0.6);
      const beat = Math.pow(Math.max(0, Math.sin(i * 0.49)), 6);
      const detail = 0.5 + 0.5 * Math.sin(i * 1.27) * Math.cos(i * 0.41);
      return Math.max(0.06, (build + phrase) * (0.55 + 0.45 * detail) + beat * 0.55);
    }

    function build(){
      const ox = new Float32Array(COUNT), oy = new Float32Array(COUNT);
      const sx = new Float32Array(COUNT), sy = new Float32Array(COUNT);
      const cl = new Float32Array(COUNT*3), cf = new Float32Array(COUNT*3);
      const stag = new Float32Array(COUNT), size = new Float32Array(COUNT);
      const amps = new Float32Array(COLS);
      let max = 0;
      for(let i = 0; i < COLS; i++){ amps[i] = amplitude(i); if(amps[i] > max) max = amps[i]; }

      let n = 0;
      for(let i = 0; i < COLS; i++){
        const u = i / (COLS - 1);
        const norm = amps[i] / max;
        for(let j = 0; j < ROWS; j++){
          const r1 = hash(n * 1.7), r2 = hash(n * 3.1 + 5), r3 = hash(n * 5.3 + 11);
          const v = ROWS === 1 ? 0 : (j / (ROWS - 1)) * 2 - 1;   // -1..1 autour de l'axe
          ox[n] = u;                                              // 0..1 sur la largeur
          oy[n] = v * norm * (0.82 + 0.3 * r1);                   // -1..1, amplitude locale
          sx[n] = clamp01(u + (r2 - 0.5) * 0.34);                 // nuage disperse
          sy[n] = (r3 - 0.5) * 2.4;
          const lost = LOST[n % LOST.length];
          cl[n*3] = lost[0]; cl[n*3+1] = lost[1]; cl[n*3+2] = lost[2];
          const g = gradient(Math.abs(v) * (0.55 + 0.45 * norm));
          cf[n*3] = g[0]; cf[n*3+1] = g[1]; cf[n*3+2] = g[2];
          stag[n] = clamp01(u * 0.55 + r1 * 0.3);                 // se repare de gauche a droite
          size[n] = 0.7 + 1.5 * r2;
          n++;
        }
      }
      return {ox, oy, sx, sy, cl, cf, stag, size};
    }

    function resize(){
      if(!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if(!rect.width || !rect.height) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    }

    function draw(progress){
      if(!ctx || !canvas) return;
      const w = canvas.width / dpr, h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const midY = h * 0.5, amp = h * 0.44;
      const f = field;
      for(let i = 0; i < COUNT; i++){
        // chaque particule se repare sur sa propre fenetre : effet de vague
        const local = clamp01((progress - f.stag[i] * 0.45) / 0.55);
        const e = local * local * (3 - 2 * local);              // smoothstep
        const x = (f.sx[i] + (f.ox[i] - f.sx[i]) * e) * w;
        const y = midY - (f.sy[i] + (f.oy[i] - f.sy[i]) * e) * amp;
        const r = f.cl[i*3]   + (f.cf[i*3]   - f.cl[i*3])   * e;
        const g = f.cl[i*3+1] + (f.cf[i*3+1] - f.cl[i*3+1]) * e;
        const b = f.cl[i*3+2] + (f.cf[i*3+2] - f.cl[i*3+2]) * e;
        const a = (0.10 + 0.62 * e) * (0.5 + 0.5 * f.size[i]);
        ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},${a.toFixed(3)})`;
        const s = f.size[i] * (1.15 + 0.5 * e);
        ctx.fillRect(x, y, s, s);
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function frame(now){
      const p = clamp01((now - started) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);                       // ease-out cubic
      draw(eased);
      if(p < 1) raf = requestAnimationFrame(frame);
      else raf = 0;
    }

    function play(){
      canvas = document.getElementById("homeWave");
      if(!canvas || !canvas.getContext) return;
      ctx = canvas.getContext("2d");
      if(!ctx) return;
      if(!field) field = build();
      if(!resize()) return;
      if(raf) cancelAnimationFrame(raf), raf = 0;
      // Mouvement reduit : on affiche directement la bibliotheque reparee.
      if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        draw(1);
        return;
      }
      started = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop(){ if(raf){ cancelAnimationFrame(raf); raf = 0; } }

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      if(!canvas) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if(resize()) draw(1); }, 160);
    });

    return {play, stop};
  })();

  const LTScanFX = (function () {
    const VS = "attribute vec2 aPos; void main(){ gl_Position=vec4(aPos,0.0,1.0); }";
    const FS = `precision highp float;
uniform vec2 iResolution; uniform float iTime;
const float PI = 3.14159265359;
const float AMPLITUDE=0.32; const float FREQ=1.1; const float ABER_FREQ=1.0; const float SPEED=2.4;
const float WAVE_SCALE=0.6; const float ABERRATION=2.6; const float THICKNESS=3.0; const float INTENSITY=2.;
const float FALLOFF=1.7; const float EDGE_MASK=0.4; const float EDGE_INSET=0.0; const float BAND_FILL=30000.0;
const float BAND_THICK=0.08; const float SOFTNESS=2.5; const float LOW_AMP=6.0; const float LOW_INT=1.5;
const float MID_ABER=0.8; const float MID_ABAMP=0.05; const float MID_BAND=20.0; const float MID_SOFT=0.4;
const float HIGH_ABER=0.5; const float HIGH_ABAMP=0.06; const float RESOLVED=1.0; const float UNRES_SCALE=0.14;
vec3 spectral4(int s){ float x=float(s); return clamp(vec3(abs(x-3.0)-1.0, 2.0-abs(x-2.0), 2.0-abs(x-4.0)),0.0,1.0); }
void mainImage(out vec4 fragColor, in vec2 fragCoord){
  vec2 R=iResolution.xy; float aspect=R.x/R.y;
  vec2 p=(fragCoord+0.5)*2.0/R-1.0; p.x*=aspect; float yScreen=p.y; p/=max(WAVE_SCALE,0.1);
  float t=iTime;
  float low=clamp(0.45+0.45*sin(t*0.8)*sin(t*0.37+1.0),0.0,1.0);
  float mid=clamp(0.40+0.40*sin(t*1.7+2.0)*sin(t*0.53),0.0,1.0);
  float high=clamp(0.30+0.30*sin(t*2.9+4.0)*sin(t*0.71+2.0),0.0,1.0);
  float res=clamp(RESOLVED,0.0,1.0); float drift=mod(t,20.0*PI)*SPEED;
  float xN=p.x/max(aspect,1.0); float env=cos(PI*0.5*min(abs(0.9*xN),1.0)); env*=env;
  float A1=AMPLITUDE+0.01*low*LOW_AMP; float A2=A1+mid*MID_ABAMP+high*HIGH_ABAMP;
  float AB=(ABERRATION+mid*MID_ABER+high*HIGH_ABER)*res; float th=mix(0.1,0.01*THICKNESS,res);
  float inten=mix(0.1,0.01*(INTENSITY+low*LOW_INT),res); float soft=0.01*res*max(0.0,SOFTNESS+mid*MID_SOFT);
  float dUnres=max(length(p)-mix(0.14,UNRES_SCALE,res),0.0); float yMain=A1*env*res*sin(p.x*FREQ+drift);
  float bandFillTh=max(BAND_THICK,1e-4); float bandAmt=1e-4*BAND_FILL*inten;
  vec3 num=vec3(0.0), den=vec3(0.0);
  for(int s=0;s<4;s++){
    vec3 hue=mix(vec3(1.0),spectral4(s),res); den+=hue;
    float ab=mix(-AB,AB,float(s)/3.0); float yL=A2*env*res*sin(p.x*ABER_FREQ+drift+ab);
    float d=mix(dUnres,abs(p.y-yL),res); float lor=mix(1.0/(1.0+(0.02*d)*(0.02*d)),1.0,res);
    float line=inten/(sqrt(d*d+soft*soft)+th);
    float lo=min(yMain,yL), hi=max(yMain,yL); float dBand=max(0.0,max(p.y-hi,lo-p.y));
    float band=bandAmt/(dBand+bandFillTh); num+=hue*lor*(line+band);
  }
  vec3 col=num/den;
  float dM=mix(dUnres,abs(p.y-yMain),res); float lorM=mix(1.0/(1.0+(0.02*dM)*(0.02*dM)),1.0,res);
  float boost=(1.0-res)*(14.0*low+4.0);
  col+=0.5*inten*(lorM+boost)/(sqrt(dM*dM+soft*soft)+th);
  col=pow(max(col,0.0),vec3(1.5));
  float emT=clamp((abs(yScreen)-1.0+EDGE_INSET)/(-max(EDGE_MASK,1e-4)),0.0,1.0); float em=emT*emT*(3.0-2.0*emT);
  float gauss=exp(-pow(xN*FALLOFF,2.0)); col*=mix(1.0,em*gauss,res); col*=res;
  fragColor=vec4(col, clamp(max(col.r,max(col.g,col.b)),0.0,1.0));
}
void main(){ mainImage(gl_FragColor, gl_FragCoord.xy); }`;
    let raf = 0, stepTimer = 0, glCtx = null, prog = null, buf = null, activeLoaderSelector = "#completeLoader";
    function compile(gl, type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.warn("shader:", gl.getShaderInfoLog(sh)); gl.deleteShader(sh); return null; }
      return sh;
    }
    function stopStations() {
      clearInterval(stepTimer); stepTimer = 0;
      document.querySelectorAll(`${activeLoaderSelector} .mdx-pl-step`).forEach(function (e) { e.classList.remove("is-active", "is-done"); });
    }
    function startStations() {
      stopStations();
      const steps = Array.prototype.slice.call(document.querySelectorAll(`${activeLoaderSelector} .mdx-pl-step`));
      if (!steps.length) return;
      let i = 0;
      const tick = function () {
        steps.forEach(function (e, k) { e.classList.toggle("is-active", k === i); e.classList.toggle("is-done", k < i); });
        i = (i + 1) % (steps.length + 1);
      };
      tick();
      stepTimer = setInterval(tick, 1100);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf); raf = 0;
      stopStations();
      if (glCtx && prog) { glCtx.deleteProgram(prog); prog = null; }
      if (glCtx && buf) { glCtx.deleteBuffer(buf); buf = null; }
      glCtx = null;
    }
    function start(canvas, loaderSelector) {
      stop();
      if (!canvas) return;
      activeLoaderSelector = loaderSelector || "#completeLoader";
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) { return; }
      const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
      if (!gl) return;
      glCtx = gl;
      const vs = compile(gl, gl.VERTEX_SHADER, VS);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
      if (!vs || !fs) { glCtx = null; return; }
      prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); gl.useProgram(prog);
      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      const uRes = gl.getUniformLocation(prog, "iResolution");
      const uTime = gl.getUniformLocation(prog, "iTime");
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const dim = Math.round((canvas.clientWidth || 320) * dpr);
      canvas.width = dim; canvas.height = dim; gl.viewport(0, 0, dim, dim);
      const t0 = performance.now();
      const frame = function () {
        const t = (performance.now() - t0) / 1000;
        gl.uniform2f(uRes, dim, dim); gl.uniform1f(uTime, t);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        raf = requestAnimationFrame(frame);
      };
      frame();
      startStations();
    }
    return { start: start, stop: stop };
  })();

  let waveformProgressTarget = {wrapper:"waveformProgressBarWrapper", text:"waveformProgressText"};
  function setWaveformProgressTarget(wrapperId, textId){
    waveformProgressTarget = {wrapper:wrapperId, text:textId};
  }
  function generateWaveformBars(wrapperId = waveformProgressTarget.wrapper) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const barCount = 45;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement("span");
      bar.className = "waveform-bar";
      const progress = i / (barCount - 1);
      const sineHeight = Math.sin(progress * Math.PI);
      const randHeight = 0.3 + 0.7 * Math.random();
      const heightPercent = Math.max(12, Math.round(sineHeight * randHeight * 88));
      bar.style.height = `${heightPercent}%`;
      wrapper.appendChild(bar);
    }
  }

  function updateWaveformProgress(percent, wrapperId = waveformProgressTarget.wrapper, textId = waveformProgressTarget.text) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const bars = wrapper.querySelectorAll(".waveform-bar");
    const count = bars.length;
    const activeCount = Math.round((percent / 100) * count);
    bars.forEach((bar, idx) => {
      if (idx < activeCount) {
        bar.classList.add("is-active");
      } else {
        bar.classList.remove("is-active");
      }
    });
    const text = document.getElementById(textId);
    if (text) text.textContent = `${percent}%`;
  }
  window.updateMetadataProgress = updateWaveformProgress;

  async function startCompleteAnalysis() {
    if (!completeFolder) return;
    
    $("completeStartBtn").disabled = true;
    $("completeChooseFolder").disabled = true;
    $("completeResultsSection").style.display = "none";
    $("completeLoader").style.display = "flex";
    { var _cfg = $("completeConfig"); if (_cfg) _cfg.style.display = "none"; var _v = $("completeView"); if (_v) _v.scrollTop = 0; }
    setWaveformProgressTarget("waveformProgressBarWrapper", "waveformProgressText");
    generateWaveformBars();
    updateWaveformProgress(0);
    LTScanFX.start(document.getElementById("completeScanCanvas"));
    
    try {
      const result = await API.analyzeFolderMetadata(completeFolder);
      LTScanFX.stop(); $("completeLoader").style.display = "none"; { var _cfg2 = $("completeConfig"); if (_cfg2) _cfg2.style.display = ""; }
      $("completeChooseFolder").disabled = false;
      $("completeStartBtn").disabled = false;
      
      if (!result || !result.ok) {
        showToast(result?.error || "Une erreur est survenue lors de l'analyse.");
        return;
      }
      
      renderCompleteResults(result.tracks);
    } catch(error) {
      LTScanFX.stop(); $("completeLoader").style.display = "none"; { var _cfg2 = $("completeConfig"); if (_cfg2) _cfg2.style.display = ""; }
      $("completeChooseFolder").disabled = false;
      $("completeStartBtn").disabled = false;
      showToast("Une erreur critique est survenue lors de l'analyse.");
    }
  }

  async function saveMetadataModifications() {
    const saveBtn = $("completeSaveBtn");
    if (!saveBtn || saveBtn.disabled) return;
    
    saveBtn.disabled = true;
    const originalText = saveBtn.innerHTML;
    saveBtn.textContent = "Enregistrement en cours...";
    
    try {
      const result = await API.saveTracksMetadata(completeTracks);
      if (result && result.ok) {
        showToast(`${result.saved_count} fichier(s) mis à jour avec succès !`);
        const confirmedCheck = $("completeConfirmed");
        if (confirmedCheck) confirmedCheck.checked = false;
        saveBtn.disabled = true;
      } else {
        showToast(result?.error || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch(error) {
      showToast("Impossible d'enregistrer les modifications.");
    } finally {
      saveBtn.innerHTML = originalText;
    }
  }

  // ===== Drawer d'affinage manuel : corriger → rechercher → valider =====
  let refineIndex = -1;
  let refineProposal = null;

  function initRefineKeySelect(){
    const sel = $("refKey");
    if (!sel || sel.options.length > 1) return;
    for (let mode of ["A", "B"]) for (let n = 1; n <= 12; n++) {
      const o = document.createElement("option");
      o.value = `${n}${mode}`; o.textContent = `${n}${mode}`;
      sel.appendChild(o);
    }
  }

  function openRefineDrawer(i){
    const t = completeTracks[i];
    if (!t) return;
    refineIndex = i;
    refineProposal = null;
    initRefineKeySelect();
    $("refineFile").textContent = t.file || "";
    $("refArtist").value = t.artist || "";
    $("refTitle").value = t.title || "";
    $("refYear").value = t.year || "";
    $("refGenre").value = (t.genre && t.genre !== "A verifier") ? t.genre : "";
    $("refBpm").value = t.bpm || "";
    $("refKey").value = t.camelot_key || "";
    $("refineProposal").hidden = true;
    $("refineOverlay").hidden = false;
    setTimeout(() => { $(t.artist ? "refTitle" : "refArtist").focus(); }, 80);
  }

  function closeRefineDrawer(){
    $("refineOverlay").hidden = true;
    refineIndex = -1;
  }

  async function runRefineSearch(){
    const btn = $("refineSearch");
    if (btn.classList.contains("is-loading")) return;
    btn.classList.add("is-loading");
    const original = btn.innerHTML;
    btn.textContent = "Recherche en cours…";
    try {
      const t = completeTracks[refineIndex] || {};
      const res = await API.refineTrackMetadata(t.path || "", $("refTitle").value.trim(), $("refArtist").value.trim());
      const box = $("refineProposal");
      const body = $("refineProposalBody");
      if (res && res.ok && res.status && res.status !== "unmatched") {
        const c = res.canonical || {}, r = res.recording || {};
        refineProposal = {
          artist: c.artist || r.artist || "", title: c.title || r.title || "",
          year: c.year || r.year || null, genre: c.genre || null,
          bpm: c.bpm || null, camelot_key: c.camelot_key || null
        };
        const chips = [];
        if (refineProposal.year) chips.push(String(refineProposal.year));
        if (refineProposal.bpm) chips.push(parseFloat(refineProposal.bpm).toFixed(1) + " BPM");
        if (refineProposal.camelot_key) chips.push(refineProposal.camelot_key);
        if (refineProposal.genre) chips.push(refineProposal.genre);
        body.innerHTML = `<b>${esc(refineProposal.artist)} – ${esc(refineProposal.title)}</b><br>` +
          chips.map(x => `<span class="mdx-chip">${esc(x)}</span>`).join("");
      } else {
        refineProposal = null;
        body.innerHTML = `<span style="color:#f5b48a">Aucun résultat fiable. Vérifie l'orthographe, ou renseigne les champs et valide directement — c'est toi l'expert.</span>`;
      }
      $("refineApply").hidden = !refineProposal;
      box.hidden = false;
    } catch (error) {
      showToast("Recherche impossible pour le moment.");
    } finally {
      btn.classList.remove("is-loading");
      btn.innerHTML = original;
    }
  }

  function applyRefineProposal(){
    if (!refineProposal) return;
    if (refineProposal.artist) $("refArtist").value = refineProposal.artist;
    if (refineProposal.title) $("refTitle").value = refineProposal.title;
    if (refineProposal.year) $("refYear").value = refineProposal.year;
    if (refineProposal.genre) $("refGenre").value = refineProposal.genre;
    if (refineProposal.bpm) $("refBpm").value = refineProposal.bpm;
    if (refineProposal.camelot_key) $("refKey").value = refineProposal.camelot_key;
    $("refineValidate").focus();
  }

  function validateAllSuggestions(){
    let n = 0;
    completeTracks.forEach((t) => {
      if (t.status === "probable_suggestion" || t.status === "enriched_sourcing") {
        t.status = "complete";
        t.source = "Validé par toi";
        t.validated = true;
        n++;
      }
    });
    if (!n) return;
    renderCompleteResults(completeTracks);
    showToast(`${n} titre(s) validé(s) ✓`);
  }

  function validateRefine(){
    const t = completeTracks[refineIndex];
    if (!t) return;
    const title = $("refTitle").value.trim();
    if (!title) { showToast("Le titre ne peut pas être vide."); $("refTitle").focus(); return; }
    t.artist = $("refArtist").value.trim();
    t.title = title;
    t.year = parseInt($("refYear").value, 10) || null;
    t.genre = $("refGenre").value.trim() || t.genre;
    t.bpm = parseFloat($("refBpm").value) || null;
    t.camelot_key = $("refKey").value || null;
    t.status = "complete";
    t.source = "Validé par toi";
    t.validated = true;
    closeRefineDrawer();
    renderCompleteResults(completeTracks);
    showToast(`« ${t.title} » validé ✓`);
  }

  function renderCompleteResults(tracks) {
    completeTracks = tracks;
    const confirmedCheck = $("completeConfirmed");
    if (confirmedCheck) confirmedCheck.checked = false;
    const saveBtn = $("completeSaveBtn");
    if (saveBtn) saveBtn.disabled = true;

    const tbody = $("completeTableBody");
    tbody.innerHTML = "";
    
    let completeCount = 0;
    let suggestionCount = 0;
    let incompleteCount = 0;
    
    if (!tracks || tracks.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: #adb8c9;">Aucun titre trouvé dans ce dossier.</td></tr>`;
      $("completeTotalCount").textContent = "0";
      $("completeKbCount").textContent = "0";
      $("completeSuggestionCount").textContent = "0";
      $("completeUnknownCount").textContent = "0";
      $("completeResultsSection").style.display = "block";
      return;
    }

    tracks.forEach((track, idx) => {
      let badgeClass = "";
      let statusText = "";

      if (track.status === "complete") {
        completeCount++;
        badgeClass = "status-complete";
        statusText = track.validated ? "✓ Validé" : "Base de connaissances";
      } else if (track.status === "probable_suggestion" || track.status === "enriched_sourcing") {
        suggestionCount++;
        badgeClass = "status-suggestion";
        statusText = "Suggestion KB";
      } else {
        incompleteCount++;
        badgeClass = "status-incomplete";
        statusText = "Incomplet";
      }
      
      const bpmText = track.bpm ? parseFloat(track.bpm).toFixed(1) : '<span style="color: #f87171;">--</span>';
      const keyText = track.camelot_key ? track.camelot_key : '<span style="color: #f87171;">--</span>';
      const artistTitle = track.artist ? `${track.artist} - ${track.title}` : track.title;
      
      const editBadge = track.is_edit_detected ? ` <span class="status-badge" style="background: rgba(147, 197, 253, 0.15); color: #93c5fd; border: 1px solid rgba(147, 197, 253, 0.3); padding: 2px 6px; font-size: 11px; margin-left: 6px;">Edit ?</span>` : '';
      const yearText = track.year ? ` <span style="color: #8794a7; font-weight: 500; font-size: 13px;">(${esc(String(track.year))})</span>` : '';

      const row = document.createElement("tr");
      row.className = "metadata-table-row";
      row.innerHTML = `
        <td style="word-break: break-all;" title="${esc(track.path || '')}">${esc(track.file || '')}</td>
        <td><strong>${esc(artistTitle || 'Inconnu')}</strong>${yearText}${editBadge}</td>
        <td style="text-align: center; font-family: monospace;">${bpmText}</td>
        <td style="text-align: center; font-family: monospace; font-weight: 600;">${keyText}</td>
        <td>${esc(track.genre || 'Inconnu')}</td>
        <td style="text-align: center;"><span class="status-badge ${badgeClass}">${statusText}</span><svg class="mdx-row-edit" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8fb6e4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"></path></svg></td>
      `;
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("aria-label", `Affiner ${track.file || 'ce titre'}`);
      row.addEventListener("click", () => openRefineDrawer(idx));
      row.addEventListener("keydown", (e) => { if (e.key === "Enter") openRefineDrawer(idx); });
      tbody.appendChild(row);
    });

    $("completeTotalCount").textContent = tracks.length;
    $("completeKbCount").textContent = completeCount;
    $("completeSuggestionCount").textContent = suggestionCount;
    $("completeUnknownCount").textContent = incompleteCount;

    const validateAllBtn = $("completeValidateAllBtn");
    if (validateAllBtn) {
      validateAllBtn.hidden = suggestionCount === 0;
      const label = validateAllBtn.querySelector("svg") ? validateAllBtn.childNodes[validateAllBtn.childNodes.length - 1] : null;
      if (label) label.textContent = `Tout valider (${suggestionCount})`;
    }
    
    $("completeResultsSection").style.display = "block";
  }

  let currentStylePlan = null;

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

  // --- Apercu du renommage + relink Serato (doctrine : jamais de renommage sans relink) ---
  const RELINK_WRITABLE = new Set(["complete", "probable_suggestion"]);

  function sanitizeFilePart(value){
    return String(value || "")
      .replace(/[\/\\:*?"<>|]/g, "-")   // caracteres interdits par le systeme de fichiers
      .replace(/\s+/g, " ")
      .trim();
  }

  function proposedFileName(track){
    const artist = sanitizeFilePart(track.artist);
    const title = sanitizeFilePart(track.title);
    if(!artist || !title) return null;
    const current = String(track.file || "");
    const dot = current.lastIndexOf(".");
    const ext = dot > 0 ? current.slice(dot) : "";
    return `${artist} - ${title}${ext}`;
  }

  function relinkRows(){
    return completeTracks.map(track => {
      const proposed = RELINK_WRITABLE.has(track.status) ? proposedFileName(track) : null;
      return {track, proposed, changes: Boolean(proposed) && proposed !== track.file};
    });
  }

  function renderRelinkPreview(){
    const rows = relinkRows();
    const renames = rows.filter(r => r.changes);
    const skipped = rows.length - renames.length;
    const before = $("relinkBeforePaths");
    const after = $("relinkAfterPaths");
    const arrows = $("relinkArrows");

    if(!renames.length){
      before.innerHTML = `<div class="path-item is-empty">Aucun fichier à renommer.</div>`;
      after.innerHTML = `<div class="path-item is-empty">Valide d’abord des titres dans l’écran précédent.</div>`;
      arrows.innerHTML = "";
    }else{
      before.innerHTML = renames.map(r => `<div class="path-item">${esc(r.track.file)}</div>`).join("");
      after.innerHTML = renames.map(r => `<div class="path-item">${esc(r.proposed)}</div>`).join("");
      arrows.innerHTML = renames.map(() => `<i></i>`).join("");
    }

    $("relinkRenameCount").textContent = renames.length;
    $("relinkSeratoCount").textContent = renames.length;
    $("relinkSkipCount").textContent = skipped;
  }

  function goRelink(){
    setState("relink");
    renderRelinkPreview();
    showView("relink");
  }

  function renderHomeStatus(info){
    const software = activeSoftware(info);
    const softwareText = $("homeStatusSoftwareText");
    const libraryText = $("homeStatusLibraryText");
    const softwareItem = $("homeStatusSoftware");
    const sidebar = $("sidebarSoftware");
    const found = Boolean(info?.libraryFound && software);
    if(softwareText){
      softwareText.textContent = found
        ? `${software.name} détecté`
        : "Aucun logiciel DJ détecté";
    }
    if(softwareItem){
      softwareItem.classList.toggle("status-green", found);
      softwareItem.classList.toggle("status-blue", !found);
    }
    if(libraryText){
      const path = firstSourcePath(software, info);
      libraryText.textContent = path
        ? path
        : "Choisis un dossier au moment du scan";
    }
    if(sidebar){
      sidebar.textContent = found ? software.name : "Aucun logiciel détecté";
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
      renderHomeStatus(info);
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
  $("goSmartImport").addEventListener("click", goSmartImport);
  $("navHome").addEventListener("click", goHome);
  $("navRepair").addEventListener("click", goPrepare);
  $("navOrganize").addEventListener("click", goSmartImport);
  $("navComplete").addEventListener("click", goComplete);
  $("goComplete").addEventListener("click", goComplete);
  $("repairCard").addEventListener("click", event => {
    if(event.target.closest("button")) return;
    goPrepare();
  });
  $("completeCard").addEventListener("click", event => {
    if(event.target.closest("button")) return;
    goComplete();
  });
  $("organizeCard").addEventListener("click", event => {
    if(event.target.closest("button")) return;
    goSmartImport();
  });
  $("smartBackTop").addEventListener("click", goHome);
  $("smartDefaultSource").addEventListener("click", resetSmartSource);
  $("smartChooseSource").addEventListener("click", () => chooseSmartFolder("source"));
  $("smartChooseDestination").addEventListener("click", () => chooseSmartFolder("destination"));
  $("smartAnalyze").addEventListener("click", startSmartImportScan);
  $("smartAnalysisBack").addEventListener("click", goSmartImport);
  $("smartContinueVerify").addEventListener("click", continueSmartVerify);
  $("smartFilesBack").addEventListener("click", () => showView("smartAnalysis"));
  $("smartSuggestionList").addEventListener("click", handleSmartSuggestionClick);
  $("smartSuggestionList").addEventListener("change", handleSmartDestinationSelect);
  $("smartValidateReliable").addEventListener("click", validateReliableSmartGroups);
  $("smartReviewRemaining").addEventListener("click", focusSmartReviewGroups);
  $("smartMoveFiles").addEventListener("click", goSmartApplyPreview);
  $("smartMetadataButton").addEventListener("click", enrichSmartMetadata);
  $("smartMetadataBack").addEventListener("click", returnSmartMetadataToApply);
  $("smartMetadataReturn").addEventListener("click", returnSmartMetadataToApply);
  $("smartMetadataRetry").addEventListener("click", enrichSmartMetadata);
  $("smartApplyBackReview").addEventListener("click", () => { renderSmartFilePlan(); showView("smartFiles"); });
  $("smartFinalApply").addEventListener("click", applySmartImportMoves);
  $("completeBack").addEventListener("click", goHome);
  $("goRelink").addEventListener("click", goRelink);
  $("relinkBack").addEventListener("click", goComplete);
  $("relinkToResults").addEventListener("click", goComplete);
  $("completeChooseFolder").addEventListener("click", chooseCompleteFolder);
  $("completeStartBtn").addEventListener("click", startCompleteAnalysis);
  
  


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

  const completeMetaConfirmed = $("completeConfirmed");
  const completeMetaSaveBtn = $("completeSaveBtn");
  if (completeMetaConfirmed && completeMetaSaveBtn) {
    completeMetaConfirmed.addEventListener("change", () => {
      completeMetaSaveBtn.disabled = !completeMetaConfirmed.checked;
    });
    completeMetaSaveBtn.addEventListener("click", saveMetadataModifications);
  }
  const refineOverlay = $("refineOverlay");
  if (refineOverlay) {
    $("refineClose").addEventListener("click", closeRefineDrawer);
    refineOverlay.addEventListener("click", (e) => { if (e.target === refineOverlay) closeRefineDrawer(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !refineOverlay.hidden) closeRefineDrawer(); });
    $("refineSearch").addEventListener("click", runRefineSearch);
    $("refineApply").addEventListener("click", applyRefineProposal);
    $("refineValidate").addEventListener("click", validateRefine);
  }
  const validateAllBtnEl = $("completeValidateAllBtn");
  if (validateAllBtnEl) validateAllBtnEl.addEventListener("click", validateAllSuggestions);
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
    API.completeOnboarding().catch(() => {});
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
  async function initLaunchExperience(){
    let state = null;
    try{ state = await API.getLaunchState(); }catch(error){}
    let legacyOnboarded = false;
    try{ legacyOnboarded = localStorage.getItem("lt_onboarded") === "1"; }catch(error){}
    if(state?.showOnboarding && legacyOnboarded){
      try{ state = await API.completeOnboarding(); }catch(error){ state = {showOnboarding:false,showWhatsNew:false}; }
    }
    if(state?.showOnboarding){
      buildObWave();
      showObStep(0);
      onboarding.classList.add("is-open");
      return;
    }
    if(state?.showWhatsNew){
      renderWhatsNewBanner(state);
    }
  }

  // Custom styled tooltip system to replace buggy/basic native tooltips
  let currentTooltip = null;
  document.addEventListener("mouseenter", function(e) {
    const el = e.target.closest("[data-tooltip]");
    if (!el) return;
    const text = el.getAttribute("data-tooltip");
    if (!text) return;
    if (currentTooltip) {
      currentTooltip.remove();
    }
    currentTooltip = document.createElement("div");
    currentTooltip.className = "custom-tooltip";
    currentTooltip.textContent = text;
    document.body.appendChild(currentTooltip);
    const rect = el.getBoundingClientRect();
    const tooltipWidth = currentTooltip.offsetWidth;
    const tooltipHeight = currentTooltip.offsetHeight;
    const left = rect.left + (rect.width - tooltipWidth) / 2;
    const top = rect.top - tooltipHeight - 8;
    const finalLeft = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));
    const finalTop = Math.max(12, top);
    currentTooltip.style.left = `${finalLeft}px`;
    currentTooltip.style.top = `${finalTop}px`;
    currentTooltip.classList.add("is-visible");
  }, true);
  function removeTooltip() {
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  }
  document.addEventListener("mouseleave", function(e) {
    const el = e.target.closest("[data-tooltip]");
    if (el) removeTooltip();
  }, true);
  document.addEventListener("scroll", removeTooltip, true);

  buildRepairWave();
  attachCardGlow();
  goHome();
  refreshPreflight();
  loadAppInfo();
  initLaunchExperience();
  setTimeout(() => { if(updateInfo?.type !== "whatsNew") checkForAppUpdate(); }, 900);
