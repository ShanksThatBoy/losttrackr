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
    async getAppInfo(){ if(window.pywebview?.api?.getAppInfo) return window.pywebview.api.getAppInfo(); await wait(60); return {name:"LostTrackr",version:"1.3.1",platform:navigator.platform,updateChannel:"demo",launchState:{showOnboarding:false,showWhatsNew:false,currentVersion:"1.3.1",releaseNotes:[]}}; },
    async getLaunchState(){ if(window.pywebview?.api?.getLaunchState) return window.pywebview.api.getLaunchState(); const info = await this.getAppInfo(); return info.launchState || {showOnboarding:false,showWhatsNew:false,currentVersion:"1.3.1",releaseNotes:[]}; },
    async completeOnboarding(){ if(window.pywebview?.api?.completeOnboarding) return window.pywebview.api.completeOnboarding(); try{ localStorage.setItem("lt_onboarded","1"); }catch(error){} return {showOnboarding:false,showWhatsNew:false,currentVersion:"1.3.1",releaseNotes:[]}; },
    async acknowledgeLaunchState(){ if(window.pywebview?.api?.acknowledgeLaunchState) return window.pywebview.api.acknowledgeLaunchState(); return {showOnboarding:false,showWhatsNew:false,currentVersion:"1.3.1",releaseNotes:[]}; },
    async checkUpdate(){ if(window.pywebview?.api?.checkUpdate) return window.pywebview.api.checkUpdate(); await wait(120); return {ok:true,currentVersion:"1.3.1",updateAvailable:false}; },
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
        "Remix":{status:"unmatched"},
        "Gasolina":{status:"matched",confidence:.99,canonical:{title:"Gasolina",artist:"Daddy Yankee",bpm:96,camelot_key:"11B",genre:"Reggaeton"}},
        "Djadja":{status:"matched",confidence:.95,canonical:{title:"Djadja",artist:"Aya Nakamura",bpm:100,camelot_key:"8A",genre:"Afropop"}}
      };
      return {ok:true, matches:(tracks||[]).map(t => ({client_track_id:t.client_track_id, status:"unmatched", ...demo[t.title]}))};
    },
    async djSetPreflight(){
      if(window.pywebview?.api?.djSetPreflight) return window.pywebview.api.djSetPreflight();
      await wait(140);
      return {
        activeSoftware:MOCK.smartImport.preflight.softwareDetection.softwares[0],
        softwareDetection:MOCK.smartImport.preflight.softwareDetection,
        existingTargets:MOCK.smartImport.preflight.crates,
        recentFilesCount:MOCK.smartImport.plan.files.length,
        writeMode:"backup_required",
        modes:[
          {id:"event",label:"Préparer un nouvel évènement"},
          {id:"organize",label:"Organiser mes playlists"},
          {id:"recent_imports",label:"Envoyer mes derniers imports dans les crates"}
        ],
        eventTypes:[
          {id:"club",label:"Club"},
          {id:"wedding",label:"Mariage"}
        ]
      };
    },
    async djSetStyleInspirationPlan(options) {
      if(window.pywebview?.api?.djSetStyleInspirationPlan) return window.pywebview.api.djSetStyleInspirationPlan(options || {});
      await wait(500);
      
      const style = options?.style || "Afro House";
      const mood = options?.mood || "Club";
      const source = options?.source || "deezer";
      const limit = options?.limit || 40;
      const localOnly = options?.localOnly || false;
      
      const tracks = {
        "Afro House": [
          { artist: "Adam Port, Stryv, Keinemusik", title: "Move" },
          { artist: "Rampa", title: "Les Gout" },
          { artist: "Black Coffee", title: "Drive" },
          { artist: "&ME", title: "The Rapture Pt.III" },
          { artist: "Francis Mercier", title: "Premier Gaou" },
          { artist: "MoBlack", title: "Yamore" }
        ],
        "Amapiano": [
          { artist: "Uncle Waffles", title: "Tanzania" },
          { artist: "Tyler ICU", title: "Mnike" },
          { artist: "Kabza De Small", title: "Imithandazo" },
          { artist: "Focalistic", title: "Ke Star" }
        ],
        "Reggaeton": [
          { artist: "Daddy Yankee", title: "Gasolina" },
          { artist: "Bad Bunny", title: "Tití Me Preguntó" },
          { artist: "Karol G", title: "Provenza" },
          { artist: "Feid", title: "Luna" }
        ],
        "Baile Funk": [
          { artist: "MC Fioti", title: "Bum Bum Tam Tam" },
          { artist: "DJ GBR", title: "Let’s Go 4" },
          { artist: "Anitta", title: "Envolver" },
          { artist: "DENNIS", title: "Tá OK" }
        ],
        "Latino": [
          { artist: "Elvis Crespo", title: "Suavemente" },
          { artist: "Marc Anthony", title: "Vivir Mi Vida" },
          { artist: "Shakira", title: "Hips Don’t Lie" },
          { artist: "Don Omar", title: "Danza Kuduro" }
        ],
        "Tech House": [
          { artist: "Fisher", title: "Losing It" },
          { artist: "John Summit", title: "Where You Are" },
          { artist: "Chris Lake", title: "Turn Off The Lights" },
          { artist: "Mau P", title: "Drugs From Amsterdam" }
        ],
        "Rap FR": [
          { artist: "Ninho", title: "Jefe" },
          { artist: "Gazo", title: "Die" },
          { artist: "Damso", title: "Macarena" },
          { artist: "Tiakola", title: "Meuda" }
        ],
        "R&B": [
          { artist: "Usher", title: "Yeah!" },
          { artist: "Chris Brown", title: "Under The Influence" },
          { artist: "SZA", title: "Snooze" },
          { artist: "The Weeknd", title: "Earned It" }
        ],
        "Afrobeats": [
          { artist: "Burna Boy", title: "City Boys" },
          { artist: "Rema", title: "Calm Down" },
          { artist: "Wizkid", title: "Essence" },
          { artist: "Tyla", title: "Water" }
        ],
        "Généraliste": [
          { artist: "Dua Lipa", title: "Houdini" },
          { artist: "David Guetta", title: "Titanium" },
          { artist: "Rihanna", title: "We Found Love" },
          { artist: "Beyoncé", title: "Crazy In Love" }
        ]
      };
      
      const baseTracks = tracks[style] || [];
      const generalTracks = tracks["Généraliste"] || [];
      let combined = [...baseTracks];
      
      Object.keys(tracks).forEach(k => {
        if (k !== style && k !== "Généraliste") {
          combined = combined.concat(tracks[k]);
        }
      });
      combined = combined.concat(generalTracks);
      
      const resultItems = [];
      const prefixes = ["", " (Extended Mix)", " (Remix)", " (Radio Edit)", " (Club Mix)", " (Dub Mix)", " (VIP Edit)"];
      
      for (let i = 0; i < limit; i++) {
        const baseTrack = combined[i % combined.length];
        const prefixIndex = Math.floor(i / combined.length) % prefixes.length;
        const suffix = prefixes[prefixIndex];
        const title = baseTrack.title + suffix;
        const artist = baseTrack.artist;
        
        const mod = i % 4;
        let status = "local";
        let statusLabel = "Présent localement";
        let matchScore = 100;
        let isSelectable = true;
        let reason = "Présent dans la bibliothèque";
        let knowledgeStatus = "known";
        
        if (mod === 0) {
          status = "local";
          statusLabel = "Présent localement";
          matchScore = 100;
          isSelectable = true;
          reason = "Présent dans la bibliothèque";
          knowledgeStatus = "known";
        } else if (mod === 1) {
          status = "probable";
          statusLabel = "Match probable";
          matchScore = 85;
          isSelectable = true;
          reason = "Nom et artiste concordent";
          knowledgeStatus = "known";
        } else if (mod === 2) {
          status = "missing";
          statusLabel = "Absent de la bibliothèque";
          matchScore = 0;
          isSelectable = false;
          reason = "Non trouvé localement";
          knowledgeStatus = "unknown";
        } else if (mod === 3) {
          status = "review";
          statusLabel = "À vérifier";
          matchScore = 60;
          isSelectable = false;
          reason = "Artiste similaire, titre différent";
          knowledgeStatus = "unknown";
        }
        
        const localPath = status === "missing" ? null : `~/Music/LostTrackr Library/${style}/${artist} - ${title}.mp3`;
        
        resultItems.push({
          id: `style_${i + 1}`,
          title: title,
          artist: artist,
          trackLabel: artist ? `${artist} - ${title}` : title,
          provider: source,
          providerTrackId: `track_${source}_${1000 + i}`,
          sourcePlaylistName: `Mock ${style} ${mood}`,
          status,
          statusLabel,
          matchScore,
          localPath,
          durationMs: 180000 + (i * 2000),
          isrc: `FRMOCK${1000000 + i}`,
          isSelectable,
          reason,
          knowledgeStatus,
          canonical: knowledgeStatus === "known" ? { title, artist, album: `Album de ${artist}`, isrc: `FRMOCK${1000000 + i}` } : null
        });
      }
      
      const total = limit;
      const localCount = resultItems.filter(item => item.status === "local").length;
      const probableCount = resultItems.filter(item => item.status === "probable").length;
      const reviewCount = resultItems.filter(item => item.status === "review").length;
      const missingCount = resultItems.filter(item => item.status === "missing").length;
      
      const filteredItems = localOnly ? resultItems.filter(item => item.status !== "missing") : resultItems;
      const visibleCount = filteredItems.length;
      
      return {
        mode: "style_inspiration",
        headline: "Inspiration par style",
        modeLabel: `Inspiration ${style} · ${mood}`,
        provider: {
          id: source,
          name: source === "spotify" ? "Spotify" : source === "apple_music" ? "Apple Music" : "Deezer",
          mode: "mock",
          label: "Mode aperçu"
        },
        options: {
          style,
          mood,
          source,
          limit,
          localOnly
        },
        totals: {
          total,
          local: localCount,
          probable: probableCount,
          review: reviewCount,
          missing: missingCount,
          visible: visibleCount
        },
        items: filteredItems
      };
    },
    async djSetPlan(options){
      if(window.pywebview?.api?.djSetPlan) return window.pywebview.api.djSetPlan(options || {});
      await wait(520);
      const mode = options?.mode === "organize" ? "organize" : options?.mode === "recent_imports" ? "recent_imports" : "event";
      const eventType = options?.eventType === "wedding" ? "wedding" : "club";
      const software = MOCK.smartImport.preflight.softwareDetection.softwares[0];
      const files = MOCK.smartImport.plan.files;
      const eventTargets = eventType === "wedding"
        ? {Afro:"Dancefloor",Latino:"Dancefloor",Brazil:"Dancefloor",Dancehall:"Dancefloor",Warmup:"Cocktail",Gospel:"Cérémonie",Disco:"Dancefloor",Club:"Dancefloor",House:"Dancefloor",Electro:"Dancefloor",Pop:"Dancefloor","R&B":"Dîner"}
        : {Afro:"Groove",Latino:"Groove",Brazil:"Groove",Dancehall:"Groove",Warmup:"Warmup",Club:"Peak Time",House:"Peak Time",Electro:"Peak Time",Pop:"Peak Time",Techno:"Peak Time","Hip-Hop":"Peak Time"};
      const items = files.map((file, index) => {
        const existing = MOCK.smartImport.preflight.crates.find(crate => [file.genre, file.artist, file.title].some(value => value && crate.name.toLowerCase().includes(String(value).toLowerCase().split(" ")[0])));
        const targetName = mode === "event"
          ? (eventTargets[file.genre] || "LostTrackr Event / A vérifier")
          : (existing?.name || (file.genre === "A verifier" ? "LostTrackr - A vérifier" : `LostTrackr - ${file.genre}`));
        const targetType = mode !== "event" && existing ? "existing" : "new";
        const confidence = file.confidence === "review" ? "review" : (existing ? "high" : "medium");
        return {
          id:`dj-demo-${index}`,
          fileId:file.id,
          file:file.file,
          title:file.title,
          artist:file.artist,
          trackLabel:file.artist ? `${file.artist} - ${file.title}` : file.title,
          sourceDisplay:file.destinationDisplay,
          targetName,
          targetType,
          confidence,
          confidenceLabel:confidence === "high" ? "Très probable" : confidence === "medium" ? "Bonne suggestion" : "À vérifier",
          reason:mode === "event" ? `Base ${eventType === "wedding" ? "mariage" : "club"} proposée` : (existing ? `Cohérent avec ${existing.name}` : "Nouvelle playlist proposée"),
          softwareName:software.name,
          containerName:software.containerName
        };
      });
      const grouped = new Map();
      items.forEach(item => {
        if(!grouped.has(item.targetName)) grouped.set(item.targetName, []);
        grouped.get(item.targetName).push(item);
      });
      const groups = [...grouped.entries()].map(([targetName, rows], index) => {
        const confidence = rows.some(item => item.confidence === "review") ? "review" : (rows.some(item => item.confidence === "medium") ? "medium" : "high");
        return {
          id:`dj-demo-group-${index}`,
          name:targetName,
          targetName,
          targetType:rows.some(item => item.targetType === "existing") ? "existing" : "new",
          trackCount:rows.length,
          confidence,
          confidenceLabel:confidence === "high" ? "Très probable" : confidence === "medium" ? "Bonne suggestion" : "À vérifier",
          status:confidence === "review" ? "review" : "suggested",
          reason:rows[0]?.reason || "Suggestion LostTrackr",
          softwareName:software.name,
          containerName:software.containerName,
          items:rows.map(item => item.id)
        };
      });
      return {
        mode,
        eventType,
        modeLabel:mode === "event" ? `Préparer un évènement ${eventType === "wedding" ? "mariage" : "club"}` : mode === "recent_imports" ? "Envoyer mes derniers imports dans les crates" : "Organiser mes playlists",
        headline:mode === "event" ? `Structure ${eventType === "wedding" ? "mariage" : "club"} proposée` : mode === "recent_imports" ? "Derniers imports à envoyer" : "Cohérence des playlists",
        activeSoftware:software,
        containerName:software.containerName,
        containerPlural:software.containerPlural,
        writeMode:"backup_required",
        requiresBackup:true,
        source:"demo",
        totals:{
          groupCount:groups.length,
          itemCount:items.length,
          reliableCount:groups.reduce((sum, group) => sum + (group.confidence === "review" ? 0 : group.trackCount), 0),
          reviewCount:groups.reduce((sum, group) => sum + (group.confidence === "review" ? group.trackCount : 0), 0),
          newTargetCount:groups.filter(group => group.targetType === "new").length,
          existingTargetCount:groups.filter(group => group.targetType === "existing").length
        },
        groups,
        items,
        existingTargets:MOCK.smartImport.preflight.crates
      };
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
    djSet:$("djSetView"),
    djSetNewSet:$("djSetNewSetView"),
    djSetStyleInspiration:$("djSetStyleInspirationView"),
    djSetStyleResults:$("djSetStyleResultsView"),
    djSetEvent:$("djSetEventView"),
    djSetPlan:$("djSetPlanView"),
    prepare:$("prepareView"),
    scan:$("scanView"),
    results:$("resultsView"),
    preview:$("previewView"),
    review:$("reviewView"),
    completed:$("completedView")
  };
  const navButtons = {home:$("navHome"), prepare:$("navRepair"), organize:$("navOrganize"), library:$("navLibrary")};
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
  let djSetPlan = null;
  let djSetGroupStates = new Map();
  let djSetExpandedGroupId = null;
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
    if(active === "home") navButtons.home.classList.add("is-active");
    else if(active === "organize") navButtons.organize.classList.add("is-active");
    else if(active === "library") navButtons.library.classList.add("is-active");
    else navButtons.prepare.classList.add("is-active");
  }
  function showView(name){
    Object.entries(views).forEach(([key, view]) => view.classList.toggle("is-active", key === name));
    app.dataset.view = name;
    setNav(name === "home" ? "home" : name.startsWith("djSet") ? "library" : name.startsWith("smart") ? "organize" : "prepare");
  }
  function showScreen(name){ showView(name); }

  function goHome(){ setState("idle"); showView("home"); }
  function goPrepare(){ setState("prepare"); showView("prepare"); refreshPreflight(); }
  function goDjSet(){ setState("dj-set"); showView("djSet"); }
  function goDjSetEvent(){ setState("dj-set-event"); showView("djSetEvent"); }
  function goDjSetNewSet(){ setState("dj-set-new-set"); showView("djSetNewSet"); }
  function goDjSetStyleInspiration(){ setState("dj-set-style-inspiration"); showView("djSetStyleInspiration"); updateDjSetStyleControls(); }

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
    $("smartAnalysisSourceCard").classList.add("is-loading");
    $("smartAnalysisDestinationCard").classList.add("is-loading");
    $("smartAnalysisSourceTitle").textContent = "Analyse du dossier source…";
    $("smartAnalysisSourceDetail").textContent = "Détection des fichiers audio compatibles.";
    $("smartAnalysisDestinationTitle").textContent = "Cartographie des sous-dossiers…";
    $("smartAnalysisDestinationDetail").textContent = "Analyse des dossiers enfants et des titres déjà présents.";
    $("smartAnalysisMapIntro").textContent = "LostTrackr lit la structure de ta bibliothèque.";
    $("smartAnalysisStatus").textContent = "Analyse en cours";
    $("smartAnalysisTree").innerHTML = `<div class="smart-analysis-placeholder"><i></i><i></i><i></i><span>Lecture des dossiers…</span></div>`;
    $("smartContinueVerify").disabled = true;
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
    $("smartAnalysisSourceCard").classList.remove("is-loading");
    $("smartAnalysisDestinationCard").classList.remove("is-loading");
    $("smartAnalysisSourceTitle").textContent = `${fmt(audioCount, "titre détecté", "titres détectés")} dans ${sourceLabel}`;
    $("smartAnalysisSourceDetail").textContent = smartImportPlan?.totals?.limited ? "Analyse limitée aux premiers titres compatibles." : "Tous les fichiers audio compatibles ont été pris en compte.";
    $("smartAnalysisDestinationTitle").textContent = `${fmt(directChildren.size || folders.length, "sous-dossier", "sous-dossiers")} et ${fmt(childCount, "dossier enfant", "dossiers enfants")} détectés`;
    $("smartAnalysisDestinationDetail").textContent = `Sous ${destinationRoot}`;
    $("smartAnalysisMapIntro").textContent = `${fmt(directChildren.size || folders.length, "sous-dossier", "sous-dossiers")} et ${fmt(childCount, "dossier enfant", "dossiers enfants")} détectés sous ${destinationRoot}.`;
    $("smartAnalysisStatus").textContent = "Analyse terminée";
    const rows = smartFolderTreeRows();
    $("smartAnalysisTree").innerHTML = rows.length ? rows.map(row => `
      <article class="smart-analysis-branch">
        <header><strong>${esc(row.top)}</strong><span>${esc(fmt(row.totalSuggestions, "titre suggéré", "titres suggérés"))}</span></header>
        <div>
          ${row.children.map(child => `
            <p><b>${esc(child.name)}</b><span>${child.count ? esc(fmt(child.count, "titre suggéré", "titres suggérés")) : esc(fmt(child.audioCount, "titre présent", "titres présents"))}</span></p>
          `).join("")}
        </div>
      </article>
    `).join("") : `<div class="empty">Aucun sous-dossier exploitable détecté dans ce dossier racine.</div>`;
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
        <div class="smart-group-track" title="${esc(item.destinationDisplay || item.destination || "")}">
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
    setState("smart-complete");
    showView("smartComplete");
  }
  async function enrichSmartMetadata(){
    const files = smartImportPlan?.files || [];
    if(!files.length){ showToast("Aucun titre à enrichir pour l’instant."); return; }
    const button = $("smartMetadataButton");
    button.disabled = true;
    button.textContent = "Analyse...";
    try{
      const tracks = files.slice(0,80).map((item, index) => ({
        client_track_id:`smart-${index}`,
        title:item.title || item.file,
        artist:item.artist || "",
        source_app:"smart_import"
      }));
      const result = await API.knowledgeMatch(tracks);
      const matched = (result?.matches || []).filter(item => item.status && item.status !== "unmatched").length;
      showToast(`${matched} titre${matched > 1 ? "s" : ""} identifié${matched > 1 ? "s" : ""} pour les métadonnées.`);
    }catch(error){
      showToast("Le centre de connaissances est momentanément indisponible.");
    }finally{
      button.disabled = false;
      button.textContent = "Compléter les métadonnées";
    }
  }

  function djSetItemsById(){
    return new Map((djSetPlan?.items || []).map(item => [item.id, item]));
  }
  function djSetGroups(){
    return (djSetPlan?.groups || []).map(group => ({
      ...group,
      confidence:group.confidence === "low" ? "review" : (group.confidence || "review"),
      confidenceLabel:group.confidenceLabel || smartConfidenceLabel(group.confidence)
    }));
  }
  function djSetGroupState(group){
    if(!djSetGroupStates.has(group.id)){
      djSetGroupStates.set(group.id, group.status || (group.confidence === "review" ? "review" : "suggested"));
    }
    return djSetGroupStates.get(group.id);
  }
  function djSetReliableGroups(groups){
    return groups.filter(group => group.confidence === "high" || group.confidence === "medium");
  }
  function djSetValidatedItemIds(){
    return djSetGroups().flatMap(group => djSetGroupState(group) === "validated" ? (group.items || []) : []);
  }
  function djSetStartButton(mode, options = {}){
    if(mode === "organize") return $("djSetOrganizePlaylists");
    if(mode === "recent_imports") return $("djSetRecentImports");
    if(options.eventType === "wedding") return $("djSetEventWedding");
    if(options.eventType === "club") return $("djSetEventClub");
    return $("djSetNewEvent");
  }
  async function startDjSetPlan(mode, options = {}){
    const button = djSetStartButton(mode, options);
    const isCard = button && button.tagName.toLowerCase() === "article";
    const previous = isCard ? null : button.textContent;
    
    if (button) {
      if (isCard) {
        button.style.pointerEvents = "none";
        button.style.opacity = "0.6";
      } else {
        button.disabled = true;
        button.textContent = "Analyse...";
      }
    }
    
    try{
      djSetPlan = await API.djSetPlan({mode, ...options});
      djSetGroupStates = new Map();
      djSetExpandedGroupId = null;
      renderDjSetPlan();
      setState(`dj-set-${mode}${options.eventType ? `-${options.eventType}` : ""}`);
      showView("djSetPlan");
    }catch(error){
      showToast(error?.message || "Impossible de préparer ce plan DJ Set.");
    }finally{
      if (button) {
        if (isCard) {
          button.style.pointerEvents = "";
          button.style.opacity = "";
        } else {
          button.disabled = false;
          button.textContent = previous;
        }
      }
    }
  }
  let selectedSource = "deezer";
  function updateDjSetStyleControls(){
    selectedSource = "deezer";
    const pills = document.querySelectorAll("#djSetStyleInspirationView .style-source-pill");
    pills.forEach(pill => {
      const src = pill.dataset.source;
      pill.classList.toggle("is-active", src === selectedSource);
    });
    $("styleGenre").value = "Afro House";
    $("styleLimit").value = "40";
    $("styleLocalOnly").checked = false;
  }
  function styleInspirationSelectedOptions(){
    return {
      style: $("styleGenre").value,
      source: selectedSource,
      limit: parseInt($("styleLimit").value, 10),
      localOnly: $("styleLocalOnly").checked
    };
  }
  async function startDjSetStyleInspiration(){
    const btn = $("styleGenerateBtn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Génération...";
    try {
      const options = styleInspirationSelectedOptions();
      const plan = await API.djSetStyleInspirationPlan(options);
      renderDjSetStyleResults(plan);
      setState("dj-set-style-results");
      showView("djSetStyleResults");
    } catch(err) {
      console.error(err);
      showToast("Erreur lors de la génération de l'inspiration.");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
  let currentStylePlan = null;
  function renderDjSetStyleResults(plan){
    currentStylePlan = plan;
    const style = plan.options?.style || "Afro House";
    const source = plan.provider?.name || "Deezer";
    const limit = plan.options?.limit || 40;
    $("djSetStyleResultsSub").textContent = `Base ${style} · ${source} · ${limit} titres`;
    
    const totals = plan.totals || {};
    const presentCount = (totals.local || 0) + (totals.probable || 0);
    const absentCount = (totals.missing || 0);
    
    rollTo($("styleStatLocal"), presentCount);
    rollTo($("styleStatMissing"), absentCount);
    
    const sourceLabel = plan.provider?.label || "Mode aperçu";
    $("styleStatSource").textContent = `${source}, ${sourceLabel}`;
    
    const warning = $("styleLocalOnlyWarning");
    if(plan.options?.localOnly && absentCount > 0) {
      $("styleLocalOnlyWarningText").textContent = `${absentCount} ${absentCount > 1 ? "titres absents ont été masqués" : "titre absent a été masqué"} car l’option local uniquement est activée.`;
      warning.style.display = "grid";
    } else {
      warning.style.display = "none";
    }
    
    const presentList = $("stylePresentList");
    const absentList = $("styleAbsentList");
    const columnsContainer = $("styleResultsColumns");
    const absentColumn = $("styleAbsentColumn");
    
    presentList.innerHTML = "";
    absentList.innerHTML = "";
    
    $("stylePresentBadgeCount").textContent = presentCount;
    $("styleAbsentBadgeCount").textContent = absentCount;
    
    if(plan.options?.localOnly) {
      columnsContainer.classList.add("local-only");
      absentColumn.style.display = "none";
    } else {
      columnsContainer.classList.remove("local-only");
      absentColumn.style.display = "flex";
    }
    
    const items = plan.items || [];
    const presentItems = items.filter(item => item.status !== "missing");
    const absentItems = items.filter(item => item.status === "missing");
    
    if(presentItems.length === 0) {
      presentList.innerHTML = `<div class="smart-analysis-placeholder">Aucun titre présent.</div>`;
    } else {
      presentItems.forEach(item => {
        const row = createTrackRow(item);
        presentList.appendChild(row);
      });
    }
    
    if(absentItems.length === 0) {
      absentList.innerHTML = `<div class="smart-analysis-placeholder">Aucun titre absent.</div>`;
    } else {
      absentItems.forEach(item => {
        const row = createTrackRow(item);
        absentList.appendChild(row);
      });
    }
    
    const valBtn = $("styleValidateBtn");
    valBtn.disabled = presentCount <= 0;
    
    const textSpan = valBtn.querySelector("span");
    if (textSpan) {
      textSpan.innerHTML = `<b>Valider les titres présents</b><small id="styleValidateSubText">${presentCount} ${presentCount > 1 ? "titres prêts" : "titre prêt"} pour la future crate</small>`;
    }
  }
  function createTrackRow(item) {
    const row = document.createElement("div");
    row.className = `style-track-row is-${item.status}`;
    
    let pathHtml = "";
    if(item.localPath) {
      pathHtml = `<div class="style-track-path" title="${item.localPath}">${item.localPath}</div>`;
    }
    
    let metadataHelp = "";
    if(item.knowledgeStatus === "unknown") {
      metadataHelp = `<div class="style-track-metadata-help">Métadonnées à enrichir plus tard</div>`;
    }
    
    row.innerHTML = `
      <div class="style-track-info">
        <div class="style-track-title">${item.title}</div>
        <div class="style-track-artist">${item.artist}</div>
        ${pathHtml}
        ${metadataHelp}
      </div>
      <div class="style-status-badge is-${item.status}">${item.statusLabel}</div>
    `;
    return row;
  }
  function validateStylePresentTracks(){
    const totals = currentStylePlan?.totals || {};
    const valCount = (totals.local || 0) + (totals.probable || 0);
    showToast(`${valCount} titres présents prêts pour une future crate. L’écriture réelle sera branchée après validation du flux.`);
  }
  function updateDjSetControls(groups){
    const totals = djSetPlan?.totals || {};
    const reliableCount = Number(totals.reliableCount ?? groups.reduce((sum, group) => sum + (group.confidence === "review" ? 0 : Number(group.trackCount || 0)), 0));
    const reviewCount = Number(totals.reviewCount ?? groups.reduce((sum, group) => sum + (group.confidence === "review" ? Number(group.trackCount || 0) : 0), 0));
    const newTargetCount = Number(totals.newTargetCount ?? groups.filter(group => group.targetType === "new").length);
    const reliableGroups = djSetReliableGroups(groups);
    const allReliableValidated = reliableGroups.length > 0 && reliableGroups.every(group => djSetGroupState(group) === "validated");
    const validatedIds = djSetValidatedItemIds();
    rollTo($("djSetReliableCount"), reliableCount);
    rollTo($("djSetNewTargetCount"), newTargetCount);
    rollTo($("djSetReviewCount"), reviewCount);
    $("djSetValidateReliableSub").textContent = `${fmt(reliableCount, "titre prêt", "titres prêts")} pour l’écriture`;
    $("djSetReviewRemainingSub").textContent = `${fmt(reviewCount, "titre nécessite", "titres nécessitent")} ton avis`;
    $("djSetValidateReliable").disabled = reliableCount <= 0 || allReliableValidated;
    $("djSetReviewRemaining").disabled = reviewCount <= 0;
    $("djSetPreviewApply").disabled = validatedIds.length <= 0;
    $("djSetPreviewApply").textContent = validatedIds.length
      ? `Préparer l’écriture pour ${fmt(validatedIds.length, "titre validé", "titres validés")}`
      : "Préparer l’écriture sécurisée";
  }
  function renderDjSetGroupTracks(group, itemMap){
    return (group.items || []).slice(0,8).map(id => {
      const item = itemMap.get(id) || {};
      return `
        <div class="smart-group-track" title="${esc(item.sourceDisplay || "")}">
          <b>${esc(item.trackLabel || item.file || "Titre")}</b>
          <code>${esc(item.sourceDisplay || item.targetName || "")}</code>
        </div>`;
    }).join("") || `<div class="empty">Aucun titre détaillé. LostTrackr préparera cette structure comme point de départ.</div>`;
  }
  function renderDjSetPlan(){
    const groups = djSetGroups();
    const list = $("djSetPlanList");
    const software = djSetPlan?.activeSoftware?.name || "logiciel DJ";
    $("djSetPlanTitle").textContent = djSetPlan?.headline || "Vérifier les suggestions";
    const safetyCopy = djSetPlan?.writeMode === "backup_required" || djSetPlan?.requiresBackup
      ? "Écriture réelle préparée avec sauvegarde obligatoire avant modification."
      : "Aucune crate ou playlist n’est écrite sans validation.";
    $("djSetPlanSub").innerHTML = `${esc(djSetPlan?.modeLabel || "Préparer mon DJ Set")} pour ${esc(software)}.<br>${esc(safetyCopy)}`;
    list.innerHTML = "";
    if(!groups.length){
      updateDjSetControls([]);
      list.innerHTML = `<div class="empty">Aucune suggestion DJ Set disponible. Range quelques titres avec Smart Import ou connecte une bibliothèque DJ.</div>`;
      return;
    }
    const itemMap = djSetItemsById();
    groups.forEach(group => {
      const state = djSetGroupState(group);
      const confidenceClass = smartConfidenceClass(group.confidence);
      const card = document.createElement("article");
      card.className = `smart-suggestion-card is-${esc(state)} ${group.confidence === "review" ? "is-review" : ""} ${djSetExpandedGroupId === group.id ? "is-expanded" : ""}`;
      card.dataset.groupId = group.id;
      const typeLabel = group.targetType === "existing" ? `${group.containerName || "playlist"} existante` : `Nouvelle ${group.containerName || "playlist"}`;
      const reviewActions = group.confidence === "review"
        ? `<button class="smart-card-btn" type="button" data-djset-action="view">Voir</button><button class="smart-card-btn warning" type="button" data-djset-action="ignore">Ignorer</button>`
        : `<button class="smart-card-btn" type="button" data-djset-action="view">Voir les titres</button><button class="smart-card-btn primary" type="button" data-djset-action="validate" ${state === "validated" ? "disabled" : ""}>${state === "validated" ? "Validé" : "Valider"}</button><button class="smart-card-btn ghost" type="button" data-djset-action="change">Changer</button>`;
      card.innerHTML = `
        <div class="smart-card-handle" aria-hidden="true"></div>
        <div class="smart-crate-logo-placeholder" aria-hidden="true"><span>?</span></div>
        <div class="smart-suggestion-copy">
          <div class="smart-suggestion-top">
            <h2>${esc(group.name || "Suggestion DJ")}</h2>
            <em class="smart-confidence-badge smart-confidence-${esc(confidenceClass)}">${esc(group.confidenceLabel || smartConfidenceLabel(group.confidence))}</em>
          </div>
          <span class="smart-suggestion-count">${esc(fmt(Number(group.trackCount || 0), "titre", "titres"))} · ${esc(typeLabel)}</span>
          <p class="smart-suggestion-reason">${esc(group.reason || "Suggestion LostTrackr")}</p>
        </div>
        <div class="smart-suggestion-actions">${reviewActions}</div>
        <div class="smart-group-tracks">${renderDjSetGroupTracks(group, itemMap)}</div>`;
      list.appendChild(card);
    });
    updateDjSetControls(groups);
  }
  function handleDjSetSuggestionClick(event){
    const button = event.target.closest("[data-djset-action]");
    if(!button) return;
    const card = button.closest(".smart-suggestion-card");
    const groupId = card?.dataset?.groupId;
    if(!groupId) return;
    const action = button.dataset.djsetAction;
    if(action === "view"){
      djSetExpandedGroupId = djSetExpandedGroupId === groupId ? null : groupId;
      renderDjSetPlan();
      return;
    }
    if(action === "validate"){
      djSetGroupStates.set(groupId, "validated");
      renderDjSetPlan();
      showToast("Suggestion DJ Set validée en aperçu. Rien n’a été écrit.");
      return;
    }
    if(action === "ignore"){
      djSetGroupStates.set(groupId, "ignored");
      renderDjSetPlan();
      showToast("Groupe ignoré pour cet aperçu.");
      return;
    }
    if(action === "change"){
      djSetExpandedGroupId = groupId;
      renderDjSetPlan();
      showToast("Changement manuel bientôt disponible. Vérifie les titres avant de valider.");
    }
  }
  function validateReliableDjSetGroups(){
    const groups = djSetGroups();
    djSetReliableGroups(groups).forEach(group => {
      if(djSetGroupState(group) !== "ignored") djSetGroupStates.set(group.id, "validated");
    });
    renderDjSetPlan();
    const count = djSetValidatedItemIds().length;
    showToast(`${fmt(count, "titre validé", "titres validés")} pour l’aperçu DJ Set.`);
  }
  function focusDjSetReviewGroups(){
    const reviewGroup = djSetGroups().find(group => group.confidence === "review" && djSetGroupState(group) !== "ignored");
    if(!reviewGroup){ showToast("Aucun groupe restant à vérifier."); return; }
    djSetExpandedGroupId = reviewGroup.id;
    renderDjSetPlan();
    const card = [...$("djSetPlanList").querySelectorAll(".smart-suggestion-card")].find(element => element.dataset.groupId === reviewGroup.id);
    card?.scrollIntoView({behavior:reduced ? "auto" : "smooth", block:"center"});
  }
  function previewDjSetApply(){
    const selectedCount = djSetValidatedItemIds().length;
    if(!selectedCount){ showToast("Valide au moins une suggestion avant de préparer l’écriture."); return; }
    showToast(`Écriture préparée pour ${fmt(selectedCount, "titre", "titres")}. Sauvegarde obligatoire avant modification du logiciel DJ.`);
  }

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
  $("goDjSet").addEventListener("click", goDjSet);
  $("navHome").addEventListener("click", goHome);
  $("navRepair").addEventListener("click", goPrepare);
  $("navOrganize").addEventListener("click", goSmartImport);
  $("navLibrary").addEventListener("click", goDjSet);
  $("comingCard").addEventListener("click", event => {
    if(event.target.closest("button")) return;
    goSmartImport();
  });
  $("djSetCard").addEventListener("click", event => {
    if(event.target.closest("button")) return;
    goDjSet();
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
  $("smartApplyBackReview").addEventListener("click", () => { renderSmartFilePlan(); showView("smartFiles"); });
  $("smartFinalApply").addEventListener("click", applySmartImportMoves);
  $("djSetBack").addEventListener("click", goHome);
  $("djSetNewEvent").addEventListener("click", goDjSetNewSet);
  $("djSetOrganizePlaylists").addEventListener("click", () => startDjSetPlan("organize"));
  $("djSetRecentImports").addEventListener("click", () => startDjSetPlan("recent_imports"));
  
  // New Set views listeners
  $("djSetNewSetBack").addEventListener("click", goDjSet);
  $("djSetNewSetSimple").addEventListener("click", goDjSetStyleInspiration);
  $("djSetNewSetEvent").addEventListener("click", goDjSetEvent);
  $("djSetStyleBack").addEventListener("click", goDjSetNewSet);
  
  document.querySelectorAll("#djSetStyleInspirationView .style-source-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      selectedSource = pill.dataset.source;
      document.querySelectorAll("#djSetStyleInspirationView .style-source-pill").forEach(p => {
        p.classList.toggle("is-active", p.dataset.source === selectedSource);
      });
    });
  });

  $("styleGenerateBtn").addEventListener("click", startDjSetStyleInspiration);
  $("djSetStyleResultsBack").addEventListener("click", goDjSetStyleInspiration);
  $("styleValidateBtn").addEventListener("click", validateStylePresentTracks);
  $("styleExportMissingBtn").addEventListener("click", () => showToast("Export CSV bientôt disponible"));

  $("djSetEventBack").addEventListener("click", goDjSetNewSet);
  $("djSetEventClub").addEventListener("click", () => startDjSetPlan("event", {eventType:"club"}));
  $("djSetEventWedding").addEventListener("click", () => startDjSetPlan("event", {eventType:"wedding"}));
  $("djSetPlanBack").addEventListener("click", goDjSet);
  $("djSetPlanList").addEventListener("click", handleDjSetSuggestionClick);
  $("djSetValidateReliable").addEventListener("click", validateReliableDjSetGroups);
  $("djSetReviewRemaining").addEventListener("click", focusDjSetReviewGroups);
  $("djSetPreviewApply").addEventListener("click", previewDjSetApply);
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

  buildRepairWave();
  attachCardGlow();
  goHome();
  loadAppInfo();
  initLaunchExperience();
  setTimeout(() => { if(updateInfo?.type !== "whatsNew") checkForAppUpdate(); }, 900);
