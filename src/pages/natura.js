import { addIdea, loadIdeas } from '../utils/ideas.js'
import { navUrl, fetchTripData } from '../utils/data.js'
import { openDayPicker } from '../utils/dayPicker.js'

// Giorni del viaggio, per agganciare una meta a una tappa. Restano vuoti se
// trip.json non si carica: in quel caso l'aggiunta ripiega sulle sole Idee.
let _giorni = []

/* ── DATI STATICI ─────────────────────────────────────────
   Suggerimenti in linea con l'itinerario: spostamenti di
   massimo ~1 ora in auto o traghetto dalla base della tappa.
   Ogni voce ha tipo 'natura' o 'cultura'.                   */

const NATURA_DATA = [
  /* ──────── BRAČ ──────── */
  {
    id: 'zlatni-rat',
    nome: 'Zlatni Rat',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🏖️ Spiaggia',
    descrizione: 'La spiaggia più fotografata della Croazia: un lungo promontorio di ciottoli bianchi che cambia forma con le correnti, circondato da acque turchesi e pinete. A ~40 min da Postira.',
    bambini: true,
    bambini_nota: 'Ottimo — acque basse, spiaggia servita, pini per l\'ombra',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.2560, lng: 16.6372 },
  },
  {
    id: 'vidova-gora',
    nome: 'Vidova Gora',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'panorama',
    categoriaLabel: '⛰️ Panorama',
    descrizione: 'Il punto più alto di tutte le isole dalmate (778 m). Vista a 360° su Zlatni Rat, Hvar e il mare aperto. Si raggiunge in auto su strada asfaltata, ~45 min da Postira.',
    bambini: true,
    bambini_nota: 'In auto facilissimo; il sentiero a piedi è impegnativo',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 43.3621, lng: 16.6588 },
  },


  /* ── Dalla Rough Guide to Croatia ── */
  {
    id: 'lovrecina-bay',
    nome: 'Baia di Lovrečina',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🏖️ Spiaggia sabbiosa',
    descrizione: 'Una delle pochissime spiagge davvero sabbiose di Brač, con acqua turchese e bassa e i resti di una chiesa medievale tra gli ulivi alle spalle dell\'arenile. Il parcheggio limitato la tiene meno affollata di altre. A ~10 min d\'auto da Postira (4 km).',
    bambini: true,
    bambini_nota: 'La migliore della zona per il piccolo di 2 anni: fondo sabbioso e acqua che degrada dolcemente, senza scarpette. Poca ombra: portare ombrellone e arrivare presto per il parcheggio.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.3693, lng: 16.666 },
  },
  {
    id: 'supetar-spiaggia',
    nome: 'Spiaggia di Supetar (Banj)',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🏖️ Spiaggia attrezzata',
    descrizione: 'Lunga spiaggia di ghiaia su una baia poco profonda, a 5 min a piedi dal centro di Supetar. Pensata per le famiglie: scivolo d\'acqua, parco acquatico gonfiabile e bar con terrazza sul mare. A ~15 min d\'auto da Postira.',
    bambini: true,
    bambini_nota: 'Acqua bassa per lunghi tratti, ideale per il bimbo di 2 anni; scivolo e gonfiabili tengono occupati gli 8 e 6 anni. Molti lettini a noleggio, ma resta spazio per il telo.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.3866, lng: 16.5469 },
  },
  {
    id: 'skrip-museo-brac',
    nome: 'Škrip e il Museo dell\'isola di Brač',
    area: 'Brač',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '🏘️ Borgo antico',
    descrizione: 'Il più antico insediamento dell\'isola, di origine illirica: case in pietra con tetti in lastre, un castello cinquecentesco in rovina e vista sulla terraferma. Il museo, in una casa-torre fortificata, conserva un rilievo romano di Ercole, attrezzi agricoli e all\'esterno mura dell\'età del ferro. A ~10 min d\'auto da Postira.',
    bambini: true,
    bambini_nota: 'Visita breve: il castello in rovina e la statua di Ercole piacciono ai più grandi, il museo si gira in mezz\'ora. Vicoli sconnessi: meglio marsupio o zaino che passeggino.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.3557, lng: 16.612 },
  },
  {
    id: 'pucisca',
    nome: 'Pučišća',
    area: 'Brač',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '🏘️ Borgo di pietra',
    descrizione: 'Cittadina di cavatori in fondo a un\'insenatura a Y, con due torri medievali e una scuola di scalpellini ancora attiva: la pietra bianca di Brač si estrae qui. Il porto è pulito abbastanza da farci il bagno, e a 20 min a piedi verso nord-ovest ci sono scogli attrezzabili. A ~20 min d\'auto da Postira.',
    bambini: true,
    bambini_nota: 'Lungomare pianeggiante adatto anche al passeggino; il bagno in porto e gli scalpellini al lavoro incuriosiscono i bambini. Spiagge rocciose: servono scarpette da scoglio.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.3479, lng: 16.7321 },
  },
  {
    id: 'bol-monastero-domenicano',
    nome: 'Bol — Monastero domenicano e baie del centro',
    area: 'Brač',
    tipo: 'cultura',
    categoria: 'museo',
    categoriaLabel: '⛪ Monastero e baie',
    descrizione: 'Su un promontorio a est del centro di Bol: chiesa del XII secolo, chiostro e museo con una Madonna col Bambino attribuita al Tintoretto. Ai lati del monastero si aprono baie di ghiaia più tranquille dello Zlatni Rat, con ristorante e gelati. A ~35 min d\'auto da Postira.',
    bambini: true,
    bambini_nota: 'Baie con acqua bassa, buone per tutti e tre, ma il fondale ha massi scivolosi: scarpette obbligatorie. Poca ombra fino a metà pomeriggio. Il museo interessa solo i più grandi, 20 minuti.',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 43.2607, lng: 16.6667 },
  },
  {
    id: 'povlja',
    nome: 'Povlja',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'borgo',
    categoriaLabel: '⚓ Porticciolo panoramico',
    descrizione: 'Uno dei paesi-baia più belli del nord dell\'isola: poche case attorno a un porticciolo, con la strada in discesa che regala una gran vista su porto, mare e monti della costa. A est del porto un promontorio roccioso con spiaggia di ciottoloni dall\'aspetto lunare. A ~40 min d\'auto da Postira.',
    bambini: false,
    bambini_nota: 'Il porticciolo va bene per tutti, ma la spiaggia del promontorio è di ciottoloni grossi e taglienti, senza ombra: scomoda col bimbo di 2 anni. Da valutare solo restando sul lungomare.',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 43.3338, lng: 16.836 },
  },
  {
    id: 'milna',
    nome: 'Milna',
    area: 'Brač',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '⛵ Porto da cartolina',
    descrizione: 'Principale centro della costa occidentale, raccolto attorno a una baia profonda. Il borgo vecchio sale dal mare con vicoli stretti e case in pietra attorno alla parrocchiale settecentesca e alla loggia ottocentesca. A ~40 min d\'auto da Postira, attraversando l\'isola.',
    bambini: true,
    bambini_nota: 'Meta rilassata da fine giornata: lungomare piatto con caffè e barche da guardare, adatto al passeggino. Il borgo vecchio è in salita e non ha attrazioni pensate per i bambini.',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 43.3266, lng: 16.4497 },
  },
  {
    id: 'eremo-blaca',
    nome: 'Eremo di Blaca (Pustinja Blaca)',
    area: 'Brač',
    tipo: 'cultura',
    categoria: 'museo',
    categoriaLabel: '🏔️ Eremo nella gola',
    descrizione: 'Fondato nel 1588 da monaci in fuga dai turchi e abitato fino agli anni Trenta, incastonato in una gola sul fianco occidentale della Vidova Gora: il colpo d\'occhio è il motivo per andarci. Dentro, celle spartane e le collezioni dell\'ultimo eremita, l\'astronomo Niko Miličević. Da Postira ~30 min d\'auto al bivio, poi sterrato e 40 min di sentiero a piedi (in discesa all\'andata).',
    bambini: false,
    bambini_nota: 'Sconsigliato con questa comitiva: sentiero sassoso ed esposto al sole, impraticabile col passeggino e faticoso in risalita anche per il bimbo di 6 anni. Fattibile solo col piccolo nello zaino, molta acqua e scarpe chiuse.',
    impegno: 'giornata-piena',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 43.2931, lng: 16.5294 },
  },
  {
    id: 'supetar-cimitero-petrinovic',
    nome: 'Cimitero di Supetar e mausoleo Petrinović',
    area: 'Brač',
    tipo: 'cultura',
    categoria: 'parco',
    categoriaLabel: '🗿 Parco di sculture',
    descrizione: 'Su una penisola di cipressi appena oltre la spiaggia di Supetar: più parco di sculture che camposanto, con le tombe firmate da Ivan Rendić. Il pezzo forte è il mausoleo Petrinović di Toma Rosandić, cupola neobizantina con angelo inginocchiato. A ~15 min d\'auto da Postira, si abbina alla spiaggia.',
    bambini: false,
    bambini_nota: 'Non è una meta per bambini, ma è all\'ombra dei cipressi e si visita in 15-20 minuti: l\'angelo del mausoleo colpisce anche i più grandi. Da incastrare mentre si è già a Supetar.',
    impegno: 'sosta-breve',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 43.3878, lng: 16.5474 },
  },
  {
    id: 'big-blue-bol',
    nome: 'Windsurf, kayak e SUP a Bol',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'attivita',
    categoriaLabel: '🏄 Sport acquatici',
    descrizione: 'Grazie ai venti costanti del canale di Hvar, Bol è uno dei due poli del windsurf croato: lungo la passeggiata che porta a Zlatni Rat si allineano i centri che noleggiano attrezzatura e danno lezioni. Il più completo ha tavole, kayak, stand-up paddle, beach volley e noleggio bici. A ~35-40 min d\'auto da Postira.',
    bambini: true,
    bambini_nota: 'Kayak e SUP sono gestibili coi genitori a bordo per il 6 e l\'8 anni; il windsurf ha senso solo per il maggiore. Col piccolo di 2 meglio restare su beach volley e spiaggia: prevedere che un adulto stia a terra.',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 43.26, lng: 16.642 },
  },
  {
    id: 'cinema-estivo-supetar',
    nome: 'Cinema all\'aperto di Supetar (Ljetno Kino)',
    area: 'Brač',
    tipo: 'cultura',
    categoria: 'attivita',
    categoriaLabel: '🎬 Cinema all\'aperto',
    descrizione: 'Dietro il lungomare di Supetar funziona ogni sera un cinema all\'aperto con proiezioni alle 21.30, tra film d\'autore, titoli hollywoodiani e animazione. Aperto da inizio luglio a fine agosto, quindi attivo durante il soggiorno (~15 min d\'auto). Ce n\'è un gemello a Bol, affacciato sul porto.',
    bambini: true,
    bambini_nota: 'Conviene solo nelle sere con un film d\'animazione in cartellone: verificare il programma in giornata. Alle 21.30 si finisce tardi — realistico per l\'8 e il 6 anni, difficile per il piccolo. Portare una felpa.',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 43.3834, lng: 16.5537 },
  },
  {
    id: 'diving-supetar',
    nome: 'Immersioni a Supetar',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'attivita',
    categoriaLabel: '🤿 Diving',
    descrizione: 'Le acque trasparenti attorno a Supetar si prestano bene alle immersioni. Il diving club locale noleggia attrezzatura, organizza corsi per principianti e porta i subacquei formati verso punti come l\'Orecchio del Drago (Zmajevo uho), una grotta sottomarina. Aperto da maggio a settembre, a ~15 min da Postira.',
    bambini: false,
    bambini_nota: 'Non è un\'attività per i bambini: i limiti di età li escludono tutti e tre, e la grotta è riservata a subacquei esperti. Semmai è un ritaglio di mezza giornata per un adulto, mentre l\'altro sta in spiaggia coi bimbi.',
    impegno: 'mezza-giornata',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 43.3868, lng: 16.5452 },
  },

  /* ──────── AREA ZARA ──────── */
  {
    id: 'zara-centro',
    nome: 'Zara — Centro Storico e Organo del Mare',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏛️ Città storica',
    descrizione: 'La penisola antica di Zara: Foro Romano, Cattedrale di Sant\'Anastasia, San Donato e i due gioielli sul lungomare — l\'Organo del Mare (Morske Orgulje) e il Saluto al Sole. A ~20 min da Petrčane.',
    bambini: true,
    bambini_nota: 'Piace ai bambini — l\'organo suona con le onde e il Saluto al Sole si illumina al tramonto',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.1170, lng: 15.2200 },
  },
  {
    id: 'nin',
    nome: 'Nin (Nona)',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '⛪ Borgo storico',
    descrizione: 'Piccola città-isola con la chiesa più piccola del mondo (Santa Croce), saline storiche e una laguna con spiagge sabbiose e fanghi curativi. A ~20 min da Petrčane.',
    bambini: true,
    bambini_nota: 'Adatto — spiaggia sabbiosa bassa (rara in Croazia) e visita del borgo breve',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 44.2431, lng: 15.1840 },
  },
  {
    id: 'vransko-lake',
    nome: 'Vransko Lake',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'lago',
    categoriaLabel: '🦢 Lago / Ornitologia',
    descrizione: 'Il lago più grande della Croazia, riserva ornitologica con oltre 250 specie di uccelli. Pista ciclabile panoramica e ambiente tranquillo. A ~40 min da Petrčane.',
    bambini: true,
    bambini_nota: 'Adatto — pista ciclabile e percorsi piani ideali con i bambini',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 43.8856, lng: 15.5475 },
  },
  {
    id: 'paklenica',
    nome: 'Paklenica National Park',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🏔️ Canyon / Trekking',
    descrizione: 'Canyon spettacolari ai piedi delle Alpi Dinare, con sentieri per tutti i livelli e la grotta Manita Peć. Ingresso di Starigrad a ~45 min da Petrčane.',
    bambini: false,
    bambini_nota: 'Sentieri brevi facili esistono, ma le gole principali sono impegnative con bambini piccoli',
    impegno: 'giornata-piena',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 44.3219, lng: 15.4722 },
  },


  /* ── Dalla Rough Guide to Croatia ── */
  {
    id: 'museo-illusioni-zara',
    nome: 'Museo delle Illusioni (Muzej iluzija), Zara',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'museo',
    categoriaLabel: '🎭 Museo interattivo',
    descrizione: 'Ologrammi, illusioni ottiche e stanze truccate (pavimenti inclinati, arredi fuori scala) nel centro di Zara, con un negozio pieno di rompicapo. È un museo che si tocca e si prova, non che si guarda soltanto. A ~20 min d\'auto da Petrčane.',
    bambini: true,
    bambini_nota: 'Il posto più adatto ai bambini in tutta Zara: l\'8 e il 6 anni si divertono con le stanze deformate, il piccolo di 2 gira in braccio senza problemi. Breve e al chiuso: ottimo rifugio nelle ore calde.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.1141, lng: 15.2297 },
  },
  {
    id: 'parco-naturale-telascica',
    nome: 'Parco naturale di Telašćica (Dugi Otok)',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🏞️ Parco naturale',
    descrizione: 'Baia lunga ~7 km sull\'Isola Lunga, chiusa da colline dolci e da falesie a picco sul mare aperto, con il lago salato Jezero Mir, più caldo e salato del mare. È la meraviglia naturale più celebrata dell\'arcipelago di Zara: ci si arriva in giornata con i battelli-escursione da Zara, o in catamarano fino a Sali (~1 h) più 3 km.',
    bambini: true,
    bambini_nota: 'Dal parcheggio alla baia ~20 min a piedi, fattibili per il 6 anni; per il 2 anni serve zaino. Il lago salato è tiepido e poco profondo, perfetto per i bambini. C\'è un bar-ristorante.',
    impegno: 'giornata-piena',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.8867, lng: 15.1657 },
  },
  {
    id: 'spiaggia-borik-puntamika',
    nome: 'Spiaggia di Borik / Puntamika, Zara',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🏖️ Spiaggia',
    descrizione: 'Il quartiere balneare di Zara, 4 km a nord-ovest del centro: lunga spiaggia di ghiaia, pinete, hotel e marina. Sulla punta di Puntamika un bar con grande terrazza affacciata sulle isole e sul tramonto. È la spiaggia attrezzata più vicina alla base: ~15 min d\'auto da Petrčane.',
    bambini: true,
    bambini_nota: 'Dietro il bar sulla punta ci sono parco giochi e chiosco di gelati: combinazione ideale con tre bambini. Fondale di ghiaia, meglio le scarpette; c\'è ombra tra i pini per il piccolo.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.1338, lng: 15.21 },
  },
  {
    id: 'spiaggia-saharun-dugi-otok',
    nome: 'Spiaggia di Sakarun, Dugi Otok',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🏖️ Spiaggia',
    descrizione: 'Mezzo chilometro di ciottoli finissimi con bordo sabbioso e fondale basso, alla fine di una strada nella pineta verso la punta nord di Dugi Otok. La guida la dà come una delle spiagge più belle di questo tratto d\'Adriatico. Si raggiunge in giornata via mare da Zara (catamarano per Božava ~1h15) o con un\'escursione in barca.',
    bambini: true,
    bambini_nota: 'Acqua bassissima e fondo sabbioso: la spiaggia da sguazzare ideale per il 2 anni, e i più grandi nuotano in sicurezza. Ultimo tratto a piedi nel bosco (~500 m). Pizzeria e griglia sul retro, ma care per cinque.',
    impegno: 'giornata-piena',
    nota_tipo: 'opzionale',
    coords: { lat: 44.1336, lng: 14.8714 },
  },
  {
    id: 'mercato-zara',
    nome: 'Mercato di Zara (Pijaca)',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'attivita',
    categoriaLabel: '🍑 Mercato',
    descrizione: 'Uno dei mercati quotidiani più vivaci dell\'Adriatico, in una lunga piazza addossata alle mura di Zara: frutta e verdura dalla campagna, pesce fresco nella sala accanto, chioschi di pane, formaggi e salumi. Solo la mattina; ottimo per riempire la borsa frigo prima della spiaggia. A ~20 min da Petrčane.',
    bambini: true,
    bambini_nota: 'Sosta breve e colorata: frutta da assaggiare subito e banchi del pesce che divertono i più grandi. Col passeggino si passa, ma la mattina è affollato: meglio presto.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.1157, lng: 15.228 },
  },
  {
    id: 'barkajol-zara',
    nome: 'Barkajol — il traghetto a remi di Zara',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'attivita',
    categoriaLabel: '🚣 Traversata a remi',
    descrizione: 'La barchetta a remi che da secoli traghetta i passeggeri tra la Liburnska obala, nel centro storico, e la riva di fronte. La guida la definisce il mezzo di trasporto pubblico più piacevole di Zara: costa pochissimo e dura pochi minuti. Da abbinare a una passeggiata in città, ~20 min d\'auto dalla base.',
    bambini: true,
    bambini_nota: 'Una vera barca a remi col barcaiolo: per i bambini vale più di molti musei, e dura abbastanza poco da tenere buono anche il 2 anni. Tenerli seduti durante la traversata.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.1183, lng: 15.2242 },
  },
  {
    id: 'campanile-santa-anastasia-zara',
    nome: 'Campanile di Sant\'Anastasia, Zara',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'panorama',
    categoriaLabel: '🔭 Panorama',
    descrizione: 'I 183 gradini del campanile alto 54 m, completato in stile neoromanico a fine Ottocento dall\'inglese T.G. Jackson, portano a una vista che abbraccia i tetti della città vecchia e le isole all\'orizzonte. Sotto, la cattedrale romanica col fregio di foglie d\'acanto sul portale. A ~20 min dalla base.',
    bambini: true,
    bambini_nota: 'La salita piace all\'8 anni e regge anche il 6; col 2 anni serve portarlo in braccio su una scala stretta, meglio fare i turni. Niente passeggino.',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 44.116, lng: 15.2248 },
  },
  {
    id: 'museo-vetro-antico-zara',
    nome: 'Museo del Vetro Antico, Zara',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'museo',
    categoriaLabel: '🏺 Museo',
    descrizione: 'In una villa ottocentesca fusa con un padiglione di vetro e cromo: boccette di profumo romane, oggetti d\'uso e una sala di urne cinerarie in vetro trovate negli scavi in città. C\'è un filmato di dieci minuti sulla soffiatura del vetro e, d\'estate, dimostrazioni dal vivo. A ~20 min d\'auto da Petrčane.',
    bambini: true,
    bambini_nota: 'Museo piccolo e fresco, con oggetti luccicanti che catturano i bambini per il tempo giusto; il video sulla soffiatura funziona meglio con l\'8 e il 6 anni. Non fermarsi più di un\'ora.',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 44.1143, lng: 15.2295 },
  },
  {
    id: 'sali-dugi-otok',
    nome: 'Sali (Dugi Otok)',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '⚓ Borgo di mare',
    descrizione: 'Il paese più grande di Dugi Otok, porto peschereccio tranquillo coi caffè attorno alla darsena. È la porta d\'accesso a Telašćica (3 km) e il punto di partenza delle gite alle Kornati. Catamarano da Zara ~1 h. Nel primo fine settimana di agosto ospita le Saljske užance, con concerti e la \'musica degli asini\' suonata coi corni.',
    bambini: true,
    bambini_nota: 'Porto raccolto e senza traffico, facile col passeggino sul lungomare; le barche da pesca intrattengono i bambini. Da abbinare a Telašćica per non fare la traversata solo per il paese.',
    impegno: 'giornata-piena',
    nota_tipo: 'opzionale',
    coords: { lat: 43.9382, lng: 15.1634 },
  },
  {
    id: 'isole-kornati',
    nome: 'Parco nazionale delle Incoronate (Kornati)',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🏝️ Arcipelago',
    descrizione: 'Novanta isole spoglie e quasi lunari, dal bianco pietra all\'ocra pallido, raggruppate attorno a Kornat: pascoli bruciati secoli fa, muretti a secco, acque limpidissime e taverne nelle cale. Le agenzie di Zara offrono la gita in giornata (partenza 8-9, rientro 17-18, soste bagno, ingresso al parco e di solito pranzo inclusi).',
    bambini: false,
    bambini_nota: 'Circa dieci ore di barca con lunghi trasferimenti e poca ombra: pesante per il 2 anni e noioso a tratti anche per il 6. Solo con mare calmo e se i bambini reggono le uscite in barca; le soste bagno sono il momento buono.',
    impegno: 'giornata-piena',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 43.8054, lng: 15.3221 },
  },
  {
    id: 'isola-silba',
    nome: 'Silba — l\'isola senza auto',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'borgo',
    categoriaLabel: '🚫🚗 Isola senza auto',
    descrizione: 'Isola senza automobili (e con le bici bandite tra metà luglio e fine agosto) coperta di querce, con un paese di case ombreggiate da palme e giardini murati, la torre Marinić e un parco di sculture. Sul lato est la spiaggia di Šotorišće, baia ampia e poco profonda dal fondale sabbioso. Catamarano da Zara ~1h30.',
    bambini: true,
    bambini_nota: 'Zero traffico: i bambini camminano liberi, e Šotorišće ha acqua bassa e fondo di sabbia, perfetta per il 2 anni, con un bar estivo accanto. Le altre spiagge sono a 50 min a piedi, troppo coi piccoli.',
    impegno: 'giornata-piena',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 44.3762, lng: 14.6962 },
  },
  {
    id: 'kraljicina-plaza-nin',
    nome: 'Kraljičina plaža e i fanghi di Nin',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'attivita',
    categoriaLabel: '🏖️ Spiaggia e fanghi',
    descrizione: 'Uno dei pochi posti in Croazia dove ha senso portare secchiello e paletta: la \'spiaggia della Regina\' è di sabbia vera, lunga e poco commercializzata, con vista sul Velebit dall\'altra parte dell\'acqua. Nel canneto dietro la spiaggia si raccoglie il fango peloide, che i bagnanti si spalmano addosso per i dolori reumatici. A ~20 min da Petrčane.',
    bambini: true,
    bambini_nota: 'Sabbia e acqua bassa la rendono la spiaggia migliore della zona per il bimbo di 2 anni. La spalmata di fango è un gioco perfetto per gli 8 e i 6 anni: mettere in conto una doccia lunga e costumi macchiati. Poca ombra: serve ombrellone.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.2514, lng: 15.1752 },
  },
  {
    id: 'solana-nin-saline',
    nome: 'Saline di Nin — percorso didattico',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'attivita',
    categoriaLabel: '🧂 Visita didattica',
    descrizione: 'Saline sfruttate da almeno duemila anni, dove acqua di mare, sole e bora producono un sale oggi considerato prodotto gourmet. C\'è un piccolo museo sulla storia della produzione, un negozio, e soprattutto un percorso didattico che corre sugli argini tra le vasche di evaporazione. A ~20 min da Petrčane.',
    bambini: true,
    bambini_nota: 'Il camminamento sugli argini piace molto: vasche, cumuli di sale e uccelli, tutto piano e compatibile col passeggino. Nessuna ombra: andare presto la mattina o nel tardo pomeriggio, con cappelli e acqua. Si abbina alla spiaggia di Nin.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.2398, lng: 15.1915 },
  },
  {
    id: 'rafting-zrmanja',
    nome: 'Rafting nel canyon della Zrmanja',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'attivita',
    categoriaLabel: '🚣 Rafting',
    descrizione: 'La Zrmanja scorre in uno dei canyon carsici più notevoli della Croazia, con pareti che arrivano a 200 m. Le agenzie di Starigrad organizzano discese in gommone e in kayak: le uscite sul tratto superiore partono da Kaštel Žegarski e finiscono a Muškovci. A ~1 h da Petrčane: si può incastrare nel trasferimento verso Otočac.',
    bambini: true,
    bambini_nota: 'Il rafting ha quasi sempre un\'età minima: realistico solo per l\'8 anni, da verificare per il 6, escluso il piccolo. Chiamare prima chiedendo esplicitamente il limite d\'età; in alternativa una gita in barca sul tratto basso è adatta a tutti.',
    impegno: 'giornata-piena',
    nota_tipo: 'opzionale',
    coords: { lat: 44.1619, lng: 15.8486 },
  },

  /* ──────── VELEBIT / LIKA ──────── */
  {
    id: 'kuterevo',
    nome: 'Kuterevo Bear Sanctuary',
    area: 'Velebit / Lika',
    tipo: 'natura',
    categoria: 'natura',
    categoriaLabel: '🐻 Rifugio animali',
    descrizione: 'Rifugio per orsi bruni orfani ai piedi del Velebit, gestito da volontari. Si visitano gli orsi nei recinti naturali con una guida. Esperienza educativa e a basso impatto.',
    bambini: true,
    bambini_nota: 'Ottimo per i bambini — orsi visibili da vicino in sicurezza, percorso breve',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.8266, lng: 15.1389 },
  },
  {
    id: 'gacka',
    nome: 'Valle della Gacka',
    area: 'Velebit / Lika',
    tipo: 'natura',
    categoria: 'fiume',
    categoriaLabel: '🌊 Fiume / Valle',
    descrizione: 'Uno dei fiumi carsici più limpidi d\'Europa, nella piana attorno a Otočac. Mulini storici, trote, prati verdi e paesaggi tranquilli. A ~20 min dall\'alloggio di Kuterevo.',
    bambini: true,
    bambini_nota: 'Adatto — passeggiate pianeggianti lungo il fiume e i mulini',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 44.8686, lng: 15.2372 },
  },


  /* ── Dalla Rough Guide to Croatia ── */
  {
    id: 'plitvice-laghi',
    nome: 'Parco Nazionale dei Laghi di Plitvice',
    area: 'Velebit / Lika',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🌊 Parco naturale',
    descrizione: 'Sedici laghi turchesi collegati da cascate, incassati in colline boscose e percorsi da passerelle di legno che corrono sull\'acqua. Bus navetta e battello sono compresi nel biglietto e riducono molto i tratti a piedi. A ~50 min d\'auto da Otočac: dall\'Ingresso 1 in dieci minuti si è al Veliki Slap, la cascata da 78 m.',
    bambini: true,
    bambini_nota: 'Pesci e rane nell\'acqua limpida piacciono molto a 8 e 6 anni; il piccolo di 2 va tenuto per mano o in zaino perché le passerelle sono senza parapetto. Passeggino sconsigliato.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.905, lng: 15.6113 },
  },
  {
    id: 'senj-nehaj',
    nome: 'Senj e la fortezza di Nehaj',
    area: 'Velebit / Lika',
    tipo: 'cultura',
    categoria: 'museo',
    categoriaLabel: '🏰 Fortezza',
    descrizione: 'Cittadina di vicoli stretti sul mare, dominata dalla fortezza di Nehaj (1558), quartier generale degli Uskoki, i guerrieri-pirati che da qui assalivano le navi veneziane. Dentro, tre piani di armi e costumi; dai camminamenti si vedono Senj e l\'isola di Krk. A ~40 min d\'auto da Otočac.',
    bambini: true,
    bambini_nota: 'Armi, torre e storie di pirati funzionano benissimo con 8 e 6 anni. Salita breve ma in pendenza e scale interne ripide: il bimbo di 2 va portato in braccio o in zaino.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.9865, lng: 14.9034 },
  },
  {
    id: 'rastoke-slunj',
    nome: 'Rastoke (Slunj)',
    area: 'Velebit / Lika',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '🏘️ Borgo dei mulini',
    descrizione: 'Borgo di mulini ad acqua dove lo Slunjčica precipita nella gola della Korana con una serie di cascatelle, tra case in pietra e legno collegate da ponticelli. Il punto panoramico migliore è il giardino del Pod Rastočkim Krovom, con i vecchi macchinari idraulici. A ~1 h d\'auto da Otočac: ideale come sosta verso Plitvice.',
    bambini: true,
    bambini_nota: 'Giro breve e scenografico, con acqua che scorre ovunque: piace a tutti e tre. Occhio ai bordi non protetti sopra le cascate con il bimbo di 2 anni.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.1213, lng: 15.5876 },
  },
  {
    id: 'kuca-velebita-krasno',
    nome: 'Casa del Velebit (Kuća Velebita), Krasno',
    area: 'Velebit / Lika',
    tipo: 'cultura',
    categoria: 'museo',
    categoriaLabel: '🦌 Museo natura',
    descrizione: 'Centro visite del Parco Nazionale del Velebit Settentrionale, a Krasno: flora, fauna e mestieri della montagna, con un allestimento sulla vita nelle grotte e una sala attività per bambini. Nello stesso paese anche il Museo della Silvicoltura. A ~30 min d\'auto da Otočac, sulla strada che sale al Velebit.',
    bambini: true,
    bambini_nota: 'La sala interattiva e la grotta ricostruita sono il punto forte per 8 e 6 anni; al coperto e senza rischi, gestibile anche col piccolo di 2.',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 44.8202, lng: 15.0709 },
  },
  {
    id: 'grotte-barac',
    nome: 'Grotte di Barać (Baračeve špilje)',
    area: 'Velebit / Lika',
    tipo: 'natura',
    categoria: 'grotta',
    categoriaLabel: '🕯️ Grotta',
    descrizione: 'Tre caverne in una valle boscosa presso Rakovica, poco a nord dell\'Ingresso 1 di Plitvice. La visita guidata dura una quarantina di minuti su ~200 m e passa per la Sala dei Piedi di Elefante e la Sala delle Anime Perdute. A ~55 min d\'auto da Otočac: ottima alternativa fresca a Plitvice.',
    bambini: true,
    bambini_nota: 'Durata contenuta e formato guidato adatti a 8 e 6 anni; dentro fa fresco (felpa anche in agosto) e ci sono scale e fondo umido, quindi il bimbo di 2 va tenuto in braccio.',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 44.9838, lng: 15.7228 },
  },
  {
    id: 'zavratnica-jablanac',
    nome: 'Cala Zavratnica e Jablanac',
    area: 'Velebit / Lika',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🏖️ Cala',
    descrizione: 'Insenatura strettissima e a pareti verticali che si incunea nelle pendici del Velebit di fronte all\'isola di Rab: un sentiero costeggia tutta la cala e in fondo c\'è una piccola spiaggia. Si arriva con 15 min a piedi dal porticciolo di Jablanac. A ~1 h d\'auto da Otočac verso la costa.',
    bambini: true,
    bambini_nota: 'Bagno in acqua calma e riparata alla fine del sentiero; i 15 min a piedi sono facili ma col bimbo di 2 conviene lo zaino. Serve ombra: è roccioso e senza pini sulla spiaggia.',
    impegno: 'mezza-giornata',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 44.6994, lng: 14.8968 },
  },

  /* ──────── ISTRIA (base Rovigno) ──────── */
  {
    id: 'rovinj-centro',
    nome: 'Rovigno — Centro Storico e Sant\'Eufemia',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '⛪ Città storica',
    descrizione: 'Il borgo veneziano arroccato sul mare: viuzze acciottolate, la Grisia degli artisti e la chiesa di Sant\'Eufemia con il campanile panoramico. Alla base della tappa.',
    bambini: true,
    bambini_nota: 'Bello a piedi — gelaterie sul porto e vista dall\'alto del campanile',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.0832, lng: 13.6310 },
  },
  {
    id: 'lim-fjord',
    nome: 'Lim Fjord (Limski Kanal)',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'natura',
    categoriaLabel: '🌲 Fiordo / Paesaggio',
    descrizione: 'Canale marino di 10 km incastrato tra boschi e vigneti istriani, famoso per le ostriche. Belvedere accessibile in auto, gita in barca dal basso. A ~20 min da Rovigno.',
    bambini: true,
    bambini_nota: 'Il belvedere è accessibile a tutti; la barca è ottima per i bambini',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.1419, lng: 13.6408 },
  },
  {
    id: 'brijuni',
    nome: 'Brijuni National Park',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🦒 Parco / Safari',
    descrizione: 'Arcipelago con safari park (zebre, elefanti), resti romani e spiagge. Accesso in traghetto da Fažana (~30 min da Rovigno + ~15 min di traghetto).',
    bambini: true,
    bambini_nota: 'Fantastico per i bambini — safari su trenino, animali esotici, mare pulito',
    impegno: 'giornata-piena',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.9167, lng: 13.7636 },
  },
  {
    id: 'aquarium-rovinj',
    nome: 'Acquario di Rovigno',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'natura',
    categoriaLabel: '🐟 Acquario',
    descrizione: 'Piccolo acquario storico (1891) nel centro di Rovigno. Vasche con pesci, granchi e specie dell\'Adriatico. Sosta breve e riparata, perfetta nelle ore calde.',
    bambini: true,
    bambini_nota: 'Ottimo con i bambini — visita breve al chiuso, animali marini da vicino',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 45.0855, lng: 13.6395 },
  },
  {
    id: 'dinopark-funtana',
    nome: 'Dinopark Funtana',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🦕 Parco a tema',
    descrizione: 'Parco a tema sui dinosauri a Funtana, a ~20 min da Rovigno. Dinosauri a grandezza naturale nel bosco, mini-golf, area giochi e trenino.',
    bambini: true,
    bambini_nota: 'Pensato per i bambini — percorsi facili e dinosauri a grandezza naturale',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 45.1695, lng: 13.6076 },
  },
  {
    id: 'istralandia',
    nome: 'Aquapark Istralandia',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🏊 Parco acquatico',
    descrizione: 'Grande parco acquatico a Brtonigla (~45 min da Rovigno): scivoli per tutte le età, piscine, zona baby e aree relax.',
    bambini: true,
    bambini_nota: 'Molto adatto — zona baby dedicata e scivoli graduati per età',
    impegno: 'giornata-piena',
    nota_tipo: 'opzionale',
    coords: { lat: 45.3466, lng: 13.6160 },
  },
  {
    id: 'pula-arena',
    nome: 'Pola — Arena Romana',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏛️ Sito romano',
    descrizione: 'Uno degli anfiteatri romani meglio conservati al mondo, con i corridoi sotterranei visitabili. Centro di Pola tutto intorno. A ~50 min da Rovigno.',
    bambini: true,
    bambini_nota: 'Piace ai bambini — si entra nell\'arena e nei sotterranei come i gladiatori',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.8732, lng: 13.8501 },
  },
  {
    id: 'porec',
    nome: 'Parenzo — Basilica Eufrasiana',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '⛪ Sito UNESCO',
    descrizione: 'Basilica Eufrasiana (VI sec.), patrimonio UNESCO con mosaici bizantini dorati, nel cuore di Parenzo. A ~40 min da Rovigno.',
    bambini: true,
    bambini_nota: 'Visita breve; il centro pedonale e il lungomare sono comodi con i bambini',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 45.2285, lng: 13.5936 },
  },


  /* ── Dalla Rough Guide to Croatia ── */
  {
    id: 'zlatni-rt-punta-corrente',
    nome: 'Parco forestale Zlatni Rt (Punta Corrente)',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🌲 Parco costiero',
    descrizione: 'Grande pineta costiera piantata dalla famiglia Hütterott a inizio Novecento, percorsa da sentieri per camminate e bici e affacciata sulle calette ghiaiose di Lone Bay. È il classico pomeriggio rovignese all\'ombra, con vista sul centro storico: ~20 min a piedi dal porto o 5 min d\'auto dalla base.',
    bambini: true,
    bambini_nota: 'Sentieri pianeggianti e ombreggiati, perfetti col passeggino per il piccolo di 2 anni; le insenature ghiaiose sono comode per il bagno dei più grandi, ma servono scarpette da scoglio.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.0676, lng: 13.632 },
  },
  {
    id: 'crveni-otok-isola-rossa',
    nome: 'Isola Rossa (Crveni otok) e Santa Caterina',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🏝️ Isole e bagni',
    descrizione: 'Le due isolette davanti a Rovigno: Santa Caterina, la più vicina, e Sveti Andrija, collegata da un istmo al Crveni otok. Rive ombreggiate da pini e acqua molto pulita — secondo la guida il meglio che offra la costa intorno a Rovigno per fare il bagno. Traghetti dal porto ogni 30–45 min, traversata di pochi minuti.',
    bambini: true,
    bambini_nota: 'Il tragitto in barchetta è già un\'attrazione; isole piccole e chiuse al traffico, si girano in libertà. Fondali rocciosi: portare scarpette e salvagente per il piccolo.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.0591, lng: 13.6246 },
  },
  {
    id: 'jama-baredine',
    nome: 'Grotta di Baredine (Jama Baredine)',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'grotta',
    categoriaLabel: '🕳️ Grotta carsica',
    descrizione: 'Sistema di cavità calcaree a Nova Vas, nell\'entroterra di Parenzo, visitabile con guida in ~40 min attraverso cinque sale piene di stalattiti. Si vedono anche esemplari di proteo, il \'drago\' bianco delle grotte carsiche, e si racconta la leggenda medievale dei due innamorati perdutisi nelle gallerie. A ~45 min d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'Ottimo rifugio dal caldo di agosto: dentro fa fresco, portare felpe. Ci sono scale e gradini: il bimbo di 2 anni va tenuto in braccio o in zaino, il passeggino non serve.',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.2703, lng: 13.6618 },
  },
  {
    id: 'dvigrad',
    nome: 'Dvigrad (Duecastelli)',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '🏰 Città fantasma',
    descrizione: 'Città murata abbandonata nel Seicento per la peste e le incursioni dei pirati, oggi un labirinto di rovine grigie tra campi e boschi, con due torri massicce, la cerchia di merli e il guscio della basilica romanica di Santa Sofia. Si entra liberamente e si cammina tra i vicoli invasi dall\'erba. A ~25 min d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'Un vero castello in rovina da esplorare: irresistibile per gli 8 e i 6 anni. Attenzione ai muri instabili e alle pietre sconnesse; col piccolo di 2 anni meglio lo zaino porta-bimbo.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.1273, lng: 13.8118 },
  },
  {
    id: 'vrsar',
    nome: 'Orsera (Vrsar)',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '⛪ Borgo panoramico',
    descrizione: 'Borgo arroccato all\'imbocco del Canale di Leme, un intrico di vicoli ripidi, cortili ombrosi e case di pietra: Casanova ci passò due volte e ne scrisse nelle memorie. Dal campanile di San Martino, in cima al colle, bel panorama sulla costa. A ~25 min d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'Salite e scalini rendono il passeggino scomodo; la vista dal campanile piace ai più grandi, mentre il porto turistico e i gelati salvano la sosta col piccolo.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.1512, lng: 13.6063 },
  },
  {
    id: 'svetvincenat',
    nome: 'Sanvincenti (Svetvinčenat)',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '🏯 Castello e piazza',
    descrizione: 'Paesino con quella che la guida indica come la più bella piazza dell\'Istria: la facciata rinascimentale dell\'Assunta da un lato e il castello dei Grimani, con cortile e due torri, dall\'altro. Nel castello una mostra multimediale con visori ne racconta la storia, compreso il rogo per stregoneria del 1632. A ~35 min d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'Castello vero con cortile e torri, più i visori VR: colpiscono soprattutto l\'8enne. La piazza è pianeggiante e chiusa, comoda per far girare il piccolo; c\'è una pizzeria davanti al castello.',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.0881, lng: 13.8822 },
  },
  {
    id: 'cape-kamenjak',
    nome: 'Capo Promontore (Rt Kamenjak)',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🦕 Riserva e calette',
    descrizione: 'La punta più meridionale dell\'Istria, riserva protetta di macchia bassa e scogliere con decine di calette appartate raggiungibili a piedi o in bici; si entra da Premantura seguendo 3 km di sterrato. Alla punta le grotte marine di Velika Kolumbarica e, vicino alla spiaggia di Pinižule, alcune impronte di dinosauro da cercare. A ~1 h d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'Le impronte di dinosauro entusiasmano i bimbi; a piedi/bici si entra gratis, in auto si paga al casello. Poca ombra e scogliere alte: scegliere una caletta riparata e andare presto. Il segnaposto punta all\'ingresso di Premantura — la punta è 3,5 km più avanti su sterrato.',
    impegno: 'giornata-piena',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.7967, lng: 13.9108 },
  },
  {
    id: 'vodnjan',
    nome: 'Dignano (Vodnjan) — murales e mummie',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🎨 Murales e mummie',
    descrizione: 'Cittadina di vicoli stretti nota per due cose molto diverse: i grandi murales contemporanei dipinti sulle facciate durante i festival di street art, e le mummie conservate nella chiesa di San Biagio, che ha il campanile più alto dell\'Istria. Dietro una tenda rossa dietro l\'altare, tre corpi di santi rimasti integri. A ~30 min d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'La caccia ai murales per le vie è un gioco perfetto per 8 e 6 anni. Le mummie possono impressionare: valutare se farle vedere ai più piccoli. Ingresso alla chiesa a pagamento.',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 44.9607, lng: 13.8477 },
  },
  {
    id: 'pazin-castello-foiba',
    nome: 'Pisino (Pazin) — castello e foiba',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'museo',
    categoriaLabel: '🏰 Castello e abisso',
    descrizione: 'Il capoluogo dell\'Istria interna ha un castello altomedievale che ospita il Museo etnografico istriano, con costumi e la ricostruzione di una cucina col focolare. Il castello strapiomba sulla gola della Foiba, un abisso che ispirò Dante e che Jules Verne usò per il salto del suo Mattia Sandorf; d\'estate c\'è una zipline di 220 m sopra il baratro. A ~45 min d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'Castello e voragine sono spettacolari per l\'8enne; la zipline ha limiti di età e peso, da verificare sul posto. Il sentiero nella gola è ripido e non fattibile col passeggino.',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 45.2402, lng: 13.9304 },
  },
  {
    id: 'motovun',
    nome: 'Montona (Motovun)',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'panorama',
    categoriaLabel: '🌄 Borgo sul colle',
    descrizione: 'Il più celebre dei borghi collinari istriani, un grumo di case medievali su un cocuzzolo boscoso sopra la valle del Mirna, tra grano e vigneti. Dalla piazza si accede al camminamento tra le due cinte murarie, con una vista memorabile sulla campagna. A ~50 min d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'Si parcheggia in basso e si sale a piedi ~20 min in salita: pesante col 2enne, meglio lo zaino. La guida avverte che i ristoranti di Motovun sono da gourmet e poco adatti ai bambini; alternativa la pizzeria di Karojba, 7 km a sud, con parco giochi.',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 45.3367, lng: 13.8283 },
  },
  {
    id: 'bale',
    nome: 'Valle (Bale)',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'borgo',
    categoriaLabel: '🏘️ Borgo su colle',
    descrizione: 'Borgo su un poggio con le case disposte in cerchio difensivo, vivace e con popolazione mista croata e italiana, a differenza di tanti paesi dell\'interno spopolati. Il pezzo forte è il palazzo Soardo-Bembo, gotico-veneziano del Quattrocento, accanto al quale un arco col leone di San Marco introduce al vicolo circolare del centro. A soli 20 min d\'auto da Rovigno.',
    bambini: false,
    bambini_nota: 'Visita breve e tranquilla, ma poco da fare per i bambini: il giro dell\'anello di vicoli dura mezz\'ora e regge finché non si annoiano. Meglio abbinarla a una tappa più movimentata.',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 45.0406, lng: 13.7863 },
  },
  {
    id: 'parco-sculture-dzamonja',
    nome: 'Parco delle sculture Dušan Džamonja',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'parco',
    categoriaLabel: '🗿 Sculture all\'aperto',
    descrizione: 'Prato-museo poco a nord di Orsera, accanto alla villa dove lo scultore Dušan Džamonja (1928–2009) passava le estati, con una grande esposizione permanente delle sue opere astratte: uova di alluminio lucido e blocchi di acciaio brunito. Ingresso libero e visita rapida, facile da abbinare a Orsera. A ~30 min d\'auto da Rovigno.',
    bambini: true,
    bambini_nota: 'Prato aperto dove i bambini possono correre e girare intorno alle sculture; gratis e senza code, ma l\'interesse dura poco: mezz\'ora scarsa.',
    impegno: 'sosta-breve',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 45.1598, lng: 13.6106 },
  },
  {
    id: 'sagra-sardine-fazana',
    nome: 'Sagra delle sardine di Fasana',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'attivita',
    categoriaLabel: '🎉 Sagra',
    descrizione: 'Fažana è in parte villaggio di vacanza e in parte porto peschereccio attivo, famoso per le sardine. Ad agosto si tiene la Sagra delle Sardine, con interi banchi di pesce grigliati sul lungomare. A ~35 min da Rovigno: si abbina alla giornata alle Brijuni, di cui Fažana è il porto d\'imbarco. ⚠️ La guida non dà la data esatta: da confermare con l\'ufficio turistico, la finestra 15-17/8 è stretta.',
    bambini: true,
    bambini_nota: 'Festa di paese sul lungomare, all\'aperto e senza biglietto: si entra e si esce quando si vuole, gestibile anche col bimbo di 2 anni. Molta folla e griglie accese: tenere d\'occhio il piccolo.',
    impegno: 'sosta-breve',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 44.9268, lng: 13.8029 },
  },

  /* ──────── TRIESTE ──────── */
  {
    id: 'trieste-centro',
    nome: 'Trieste — Piazza Unità d\'Italia',
    area: 'Trieste',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏛️ Città storica',
    descrizione: 'La piazza affacciata sul mare più grande d\'Europa, cuore della Trieste asburgica, tra caffè storici e palazzi liberty. Alla base della tappa.',
    bambini: true,
    bambini_nota: 'Spazi ampi e pedonali; gelato e passeggiata sul molo Audace',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.6501, lng: 13.7677 },
  },
  {
    id: 'miramare',
    nome: 'Castello di Miramare',
    area: 'Trieste',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏰 Castello / Parco',
    descrizione: 'Il castello bianco di Massimiliano d\'Asburgo a picco sul golfo, con un grande parco affacciato sul mare. A ~15 min dal centro di Trieste.',
    bambini: true,
    bambini_nota: 'Ottimo — parco enorme per correre e vista mare; interni brevi',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.7025, lng: 13.7125 },
  },
  {
    id: 'grotta-gigante',
    nome: 'Grotta Gigante',
    area: 'Trieste',
    tipo: 'natura',
    categoria: 'natura',
    categoriaLabel: '🕳️ Grotta',
    descrizione: 'Enorme caverna del Carso triestino, tra le più grandi visitabili al mondo. Visita guidata con scalinata tra stalattiti e stalagmiti. A ~20 min da Trieste.',
    bambini: true,
    bambini_nota: 'Adatto ai più grandi — tante scale ma spettacolo assicurato; fresco d\'estate',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 45.7099, lng: 13.7646 },
  },

  /* ──────── COLLIO / FRIULI ──────── */
  {
    id: 'aquileia',
    nome: 'Aquileia — Basilica e Area Romana',
    area: 'Collio / Friuli',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏛️ Sito UNESCO',
    descrizione: 'Antica città romana patrimonio UNESCO: basilica con il grande pavimento a mosaico paleocristiano, foro e scavi. A ~35 min da Capriva del Friuli.',
    bambini: true,
    bambini_nota: 'Adatto — mosaici enormi da percorrere su passerelle e aree archeologiche all\'aperto',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.7696, lng: 13.3709 },
  },

  /* ──────── SESTO / DOLOMITI ──────── */
  {
    id: 'dobbiaco',
    nome: 'Lago di Dobbiaco',
    area: 'Sesto / Alta Pusteria',
    tipo: 'natura',
    categoria: 'lago',
    categoriaLabel: '🏔️ Lago alpino',
    descrizione: 'Lago alpino in fondo alla Val Pusteria, a pochi km da Sesto. Raggiungibile a piedi o in bici sulla pista ciclabile. Acque verdissime, Dolomiti come sfondo.',
    bambini: true,
    bambini_nota: 'Perfetto — pista ciclabile pianeggiante, riva accessibile, area pic-nic',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 46.7358, lng: 12.2214 },
  },
  {
    id: 'braies',
    nome: 'Lago di Braies',
    area: 'Sesto / Alta Pusteria',
    tipo: 'natura',
    categoria: 'lago',
    categoriaLabel: '🏔️ Lago alpino',
    descrizione: 'Il "lago delle fiabe" delle Dolomiti: acque verde-smeraldo, barche a remi e sentiero attorno al lago (3 km). Molto affollato in agosto — meglio la mattina presto. A ~45 min da Sesto.',
    bambini: true,
    bambini_nota: 'Adatto — sentiero pianeggiante attorno al lago, barche a noleggio',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 46.6948, lng: 12.0853 },
  },
]

/* ── PILLOLE CULTURALI ────────────────────────────────────
   Curiosità dalla Rough Guide to Croatia, riscritte in proprio.
   Tenute fuori dalle schede (mappa per id) per non appesantire
   il dataset: chi non ha una pillola semplicemente non la mostra. */

const PILLOLE_LUOGO = {
  'zlatni-rat': 'Il Corno d\'Oro non sta mai fermo: la lingua di ghiaia a forma di dente di squalo cambia forma ogni anno, plasmata dai venti stagionali.',
  'skrip-museo-brac': 'Škrip è il posto abitato senza interruzioni più antico di Brač, fondato dagli Illiri. Fuori dal museo c\'è un mausoleo romano che secondo la leggenda locale custodisce la moglie o la figlia dell\'imperatore Diocleziano.',
  'milna': 'Dietro la loggia ottocentesca c\'è una vecchia casa cadente chiamata Anglešćina: un mito locale la lega a un crociato inglese.',
  'supetar-cimitero-petrinovic': 'Il mausoleo più grandioso fu voluto da Francisco Petrinović, nato a Supetar e diventato magnate navale in Cile. Ironia: l\'incarico non andò a Ivan Rendić, lo scultore locale che firmò quasi tutte le altre tombe.',
  'zara-centro': 'Alfred Hitchcock passò qui una vacanza nel 1964 e restò talmente colpito da definire il tramonto di Zara il più bello del mondo. Sul lungomare un cartellone lo ricorda ancora.',
  'nin': 'La chiesetta bianca della Santa Croce è la chiesa più antica di tutta la Croazia: sull\'architrave un\'iscrizione cita il conte Godečaj e risale all\'anno 800. Nin fu la residenza dei primi re croati.',
  'paklenica': 'Risalendo la gola di Velika Paklenica, dopo una ventina di minuti si passa davanti a gallerie sotterranee: le fece scavare l\'esercito jugoslavo come rifugio antiatomico per i dirigenti dello Stato.',
  'parco-naturale-telascica': 'Il lago di Jezero Mir è separato dal mare solo da una barriera di roccia: la sua acqua salatissima d\'estate è di parecchi gradi più calda del mare. Sulla barriera i visitatori costruiscono torri e piramidi di sassi.',
  'barkajol-zara': 'Il mezzo pubblico più bello di Zara è una barca a remi: il barkajol traghetta la gente da una sponda all\'altra ed è un servizio di linea a tutti gli effetti.',
  'campanile-santa-anastasia-zara': 'Il modello non è originale: Jackson lo ricopiò quasi identico dal campanile della cattedrale di Rab.',
  'museo-vetro-antico-zara': 'La sala più spettacolare è piena di urne cinerarie romane in vetro: sono saltate fuori scavando le fondamenta di un centro commerciale, dall\'altra parte del porto.',
  'sali-dugi-otok': 'La tovareća muzika si chiama «musica dell\'asino» perché i suonatori strombazzano nei corni fino a produrre un raglio collettivo perfettamente stonato.',
  'isole-kornati': 'Queste isole bianche e spoglie erano coperte di foreste: furono bruciate per fare pascolo alle pecore, che poi si mangiarono tutto il resto. I muretti a secco che le recintavano ci sono ancora, le pecore quasi più.',
  'isola-silba': 'Il nome viene probabilmente dal latino silva, bosco: l\'isola è ancora coperta di querce.',
  'kuterevo': 'Il rifugio nato nel 2002 accoglie orsetti orfani o malati che non sopravvivrebbero nel bosco: una volta abituati all\'uomo non possono più tornare liberi, e da un recinto-asilo passano a grandi aree sulla collina dietro.',
  'plitvice-laghi': 'I sedici laghi non sono stati scavati ma costruiti dall\'acqua: il fiume trasporta travertino, calcare che si deposita a valle formando barriere. In migliaia di anni quelle dighe naturali hanno creato la scala di laghi.',
  'senj-nehaj': 'Nehaj significa \'non temere\'. La fortezza fu tirata su nel 1558 dal comandante uscocco Ivan Lenković, che per avere le pietre fece demolire tutte le chiese e i conventi fuori dalle mura.',
  'rastoke-slunj': 'Le case di Rastoke hanno il piano basso in pietra e quello alto in legno, coi ponticelli sui torrenti: si vedono ancora il mulino da farina e quello che serviva a lavare i tappeti.',
  'kuca-velebita-krasno': 'Krasno vive di boschi da sempre: nel Museo della Silvicoltura si scopre che prima della guerra i boscaioli abbattevano gli alberi a mano col segone e portavano i tronchi fino al mare a dorso di cavallo.',
  'grotte-barac': 'Tra le attrazioni che la guida mostra c\'è anche una montagnetta di guano di pipistrello vecchia trecento anni.',
  'rovinj-centro': 'Il centro storico era un\'isola: il braccio di mare che lo separava dalla terraferma fu riempito a metà Settecento. Guardate i tetti — le case hanno tanti camini sottili perché ogni figlio sposato restava in casa dei genitori col proprio focolare.',
  'lim-fjord': 'Lim viene dal latino limes, confine: in epoca romana divideva il territorio di Pola da quello di Parenzo. Poi divenne un covo di pirati, e la leggenda dice che il capitano Morgan si fermò qui e fondò il villaggio di Mrgani.',
  'brijuni': 'Tito teneva sull\'isola un pappagallo di nome Koki: è ancora lì e continua a ripetere le frasi imparate dal maresciallo. Nel safari park vivono zebre e antilopi, regali dei capi di Stato in visita.',
  'pula-arena': 'Nel Cinquecento i veneziani volevano smontare l\'anfiteatro pezzo per pezzo e rimontarlo a Venezia. Li fermò il patrizio polese Gabriele Emo, ricordato da una lapide su una delle torri superstiti.',
  'porec': 'Il vescovo Eufrasio, che fece i mosaici nel 535, aveva fama di essere vanitosissimo: si fece ritrarre mentre regge il modellino della chiesa e sparse il proprio monogramma su tutta la decorazione.',
  'jama-baredine': 'Nelle vasche della grotta vivono alcuni proteo, salamandre bianche e cieche tipiche del carso croato e sloveno, che sembrano vermi pallidi con le zampe. La guida racconta anche la leggenda di Gabriel e Milka, due innamorati del Duecento che si persero qui dentro.',
  'dvigrad': 'Gli abitanti non sparirono nel nulla: se ne andarono e nel Seicento fondarono Kanfanar, il paese lì accanto.',
  'svetvincenat': 'Secondo la leggenda del paese, la vera colpa della donna bruciata come strega nel 1632 era una storia d\'amore con uno dei Grimani.',
  'vodnjan': 'I corpi santi arrivarono da Venezia nel 1818: la credenza popolare lega il fatto che non si siano decomposti ai loro poteri di guaritori.',
  'motovun': 'Svuotata dopo il 1945, quando quasi tutti gli abitanti italiani partirono, Motovun fu ripopolata come colonia di artisti. Qui nel 1940 era nato il futuro campione automobilistico Mario Andretti.',
  'pazin-castello-foiba': 'Jules Verne ci fece cadere il suo Mattia Sandorf senza aver mai visto Pisino: si accontentò delle fotografie che gli spedì il sindaco.',
}

const PILLOLE_AREA = {
  'Brač': [
    'Prima del turismo Brač viveva della sua pietra, un misto lattiginoso di marmo e calcare: è finita nel Reichstag di Berlino, nella Casa Bianca a Washington e nel Palazzo di Diocleziano a Spalato.',
    'Brač è un\'isola di pecore: la cucina tradizionale gira attorno all\'agnello e al montone. Nell\'entroterra si vedono enormi cumuli di pietre bianche, accumulati in secoli dai contadini che ripulivano un pezzo di terra per coltivare.',
    'Se sentite dire fjaka, non è una parolaccia: in dialetto dalmata è l\'arte di poltrire nel pomeriggio senza fare nulla, ed è considerata una cosa seria.',
    'Ivan Rendić (1849-1932), cresciuto a Supetar, fu il primo grande scultore accademico croato: fece un busto del primo ministro britannico Gladstone e ricevette in cambio una lettera di ringraziamento intestata 10 Downing Street.',
  ],
  'Area di Zara': [
    'Per secoli Zadar si chiamò Zara ed era una città di lingua italiana sotto Venezia. La sua università, fondata dai domenicani nel 1396, si dichiara la più antica della Croazia.',
    'Nella chiesa di San Simeone la regina Elisabetta d\'Ungheria volle a tal punto un pezzo del santo che ne staccò un dito e lo nascose in seno: si dice che marcì subito e si riprese solo una volta restituito. Il reliquiario d\'argento fu la sua penitenza.',
    'Il piatto da provare almeno una volta è l\'ispod peke: carne cotta lentamente sotto un coperchio di metallo ricoperto di braci. Richiede ore, quindi va ordinato in anticipo.',
    'In Dalmazia i bambini chiamano gli uomini adulti barba (zio, dal gergo italiano) e i signori rispettabili sjor, dal signore veneziano. Il resto della Croazia prende in giro i dalmati chiamandoli tovari, asini, per la loro lentezza.',
  ],
  'Velebit / Lika': [
    'Gli Uscocchi di Senj erano profughi della Bosnia ottomana diventati soldati: pagati male dagli Asburgo, si diedero alla pirateria con barche a remi di 15 metri. I veneziani, esasperati, misero in giro la voce che mangiassero il cuore crudo dei nemici.',
    'La bura è un vento gelido da nord-est incanalato tra le montagne: si dice che stia arrivando quando sul Velebit si forma una striscia di nuvola bianca. Nei giorni peggiori ribalta le auto e fa chiudere il ponte per Krk.',
    'Il sentiero Premužić attraversa il Velebit per 57 km: lo tracciò negli anni Trenta Ante Premužić con un\'ossessione — pendenze così dolci da camminare quasi in piano anche in mezzo alle rocce.',
    'Nei boschi sopra i laghi di Plitvice vivono orsi, lupi e cinghiali; nei laghi turchesi nuotano pesci e bisce d\'acqua, e sulle rive più tranquille a nord si vedono gli aironi.',
  ],
  'Istria': [
    'La caccia al tartufo comincia a fine settembre: cani addestrati e padroni spariscono nella nebbia istriana a fiutare il fungo. A Buzet, alla Buzetska Subotina, si festeggia friggendo in piazza una frittata al tartufo gigantesca.',
    'La bevanda istriana da provare almeno una volta è la supa: vino rosso caldo con zucchero, olio d\'oliva e pepe, servito in una brocca di terracotta con una fetta di pane tostato da inzuppare.',
    'Il primo vampiro documentato d\'Europa era istriano: Jure Grando, del villaggio di Kringa, che nel 1672 usciva ogni notte dalla tomba. La storia fu messa per iscritto dal geografo Valvasor, che andò a intervistare i compaesani.',
    'Sotto Mussolini in Istria il croato fu bandito dalla vita pubblica e i cognomi slavi tradotti in italiano. Oggi i cartelli stradali sono bilingui e Rovigno ha ancora un liceo italiano.',
  ],
}

/* ── QUERY GOOGLE MAPS ────────────────────────────────────
   Il nome REALE del posto (in croato dove è così che Maps lo
   conosce), che non coincide col titolo della scheda: cercare
   "Bol — Monastero domenicano e baie del centro" non trova nulla.
   Usata sia per "Naviga" sia per "Apri in Maps". Senza voce qui,
   si ripiega sul nome della scheda. */

const MAPS_Q = {
  'zlatni-rat': 'Zlatni rat, Bol',
  'vidova-gora': 'Vidova gora, Brač',
  'lovrecina-bay': 'Plaža Lovrečina, Postira',
  'supetar-spiaggia': 'Plaža Banj, Supetar',
  'skrip-museo-brac': 'Muzej otoka Brača, Škrip',
  'pucisca': 'Pučišća, Brač',
  'bol-monastero-domenicano': 'Dominikanski samostan Bol',
  'povlja': 'Povlja, Brač',
  'milna': 'Milna, Brač',
  'eremo-blaca': 'Pustinja Blaca, Brač',
  'supetar-cimitero-petrinovic': 'Mauzolej Petrinović, Supetar',
  'big-blue-bol': 'Big Blue Sport, Bol',
  'cinema-estivo-supetar': 'Ljetno kino Supetar',
  'diving-supetar': 'Fun Dive Club, Supetar',
  'zara-centro': 'Morske orgulje, Zadar',
  'nin': 'Nin, Hrvatska',
  'vransko-lake': 'Park prirode Vransko jezero',
  'paklenica': 'Nacionalni park Paklenica, Starigrad',
  'museo-illusioni-zara': 'Muzej iluzija Zadar',
  'parco-naturale-telascica': 'Park prirode Telašćica',
  'spiaggia-borik-puntamika': 'Plaža Borik, Zadar',
  'spiaggia-saharun-dugi-otok': 'Plaža Sakarun, Dugi otok',
  'mercato-zara': 'Gradska tržnica Zadar',
  'barkajol-zara': 'Barkajoli, Liburnska obala, Zadar',
  'campanile-santa-anastasia-zara': 'Katedrala svete Stošije, Zadar',
  'museo-vetro-antico-zara': 'Muzej antičkog stakla, Zadar',
  'sali-dugi-otok': 'Sali, Dugi otok',
  'isole-kornati': 'Nacionalni park Kornati',
  'isola-silba': 'Silba, Hrvatska',
  'kraljicina-plaza-nin': 'Kraljičina plaža, Nin',
  'solana-nin-saline': 'Solana Nin',
  'rafting-zrmanja': 'Kaštel Žegarski, Zrmanja',
  'kuterevo': 'Utočište za mlade medvjede Kuterevo',
  'gacka': 'Izvor Gacke, Otočac',
  'plitvice-laghi': 'Nacionalni park Plitvička jezera Ulaz 1',
  'senj-nehaj': 'Tvrđava Nehaj, Senj',
  'rastoke-slunj': 'Rastoke, Slunj',
  'kuca-velebita-krasno': 'Kuća Velebita, Krasno',
  'grotte-barac': 'Baraćeve špilje, Rakovica',
  'zavratnica-jablanac': 'Uvala Zavratnica, Jablanac',
  'rovinj-centro': 'Crkva svete Eufemije, Rovinj',
  'lim-fjord': 'Limski kanal',
  'brijuni': 'Nacionalni park Brijuni, Fažana',
  'aquarium-rovinj': 'Akvarij Rovinj',
  'dinopark-funtana': 'Dinopark Funtana',
  'istralandia': 'Aquapark Istralandia, Brtonigla',
  'pula-arena': 'Pulska Arena',
  'porec': 'Eufrazijeva bazilika, Poreč',
  'zlatni-rt-punta-corrente': 'Park šuma Zlatni rt, Rovinj',
  'crveni-otok-isola-rossa': 'Crveni otok, Rovinj',
  'jama-baredine': 'Jama Baredine, Nova Vas',
  'dvigrad': 'Dvigrad, Kanfanar',
  'vrsar': 'Vrsar, Istra',
  'svetvincenat': 'Kaštel Grimani, Svetvinčenat',
  'cape-kamenjak': 'Park Kamenjak, Premantura',
  'vodnjan': 'Crkva svetog Blaža, Vodnjan',
  'pazin-castello-foiba': 'Kaštel Pazin',
  'motovun': 'Motovun, Istra',
  'bale': 'Bale, Istra',
  'parco-sculture-dzamonja': 'Park skulptura Dušan Džamonja, Vrsar',
  'sagra-sardine-fazana': 'Fažana, Istra',
  'trieste-centro': 'Piazza Unità d\'Italia, Trieste',
  'miramare': 'Castello di Miramare, Trieste',
  'grotta-gigante': 'Grotta Gigante, Sgonico',
  'aquileia': 'Basilica di Aquileia',
  'dobbiaco': 'Lago di Dobbiaco',
  'braies': 'Lago di Braies',
}

const IMPEGNO_LABELS = {
  'sosta-breve':   { label: 'Sosta breve',   icon: '⚡', cls: 'impegno-breve' },
  'mezza-giornata':{ label: 'Mezza giornata', icon: '🕐', cls: 'impegno-mezza' },
  'giornata-piena':{ label: 'Giornata piena', icon: '📅', cls: 'impegno-piena' },
}

const NOTA_LABELS = {
  'molto-consigliato':  { label: '⭐ Molto consigliato', cls: 'nota-top' },
  'opzionale':          { label: '✔ Opzionale',          cls: 'nota-ok' },
  'solo-se-c-e-tempo':  { label: '⏱ Solo se c\'è tempo',  cls: 'nota-ifpos' },
}

const TIPO_LABELS = {
  'natura':  { label: '🌿 Natura',  cls: 'tipo-natura'  },
  'cultura': { label: '🏛️ Cultura', cls: 'tipo-cultura' },
}

/* ── RENDER ───────────────────────────────────────────── */

export async function renderNatura() {
  const content = document.getElementById('page-content')

  // La pagina vive di dati propri: i giorni servono solo per il selettore, e
  // se mancano non deve impedire di consultare le schede.
  try {
    _giorni = (await fetchTripData()).days || []
  } catch {
    _giorni = []
  }

  const aree = [...new Set(NATURA_DATA.map(n => n.area))]
  let _activeArea = 'tutte'
  let _activeTipo = 'tutti'

  content.innerHTML = `
    <div class="page-header">
      <h1>🌿 Natura & Cultura</h1>
      <p>Suggerimenti in linea con l'itinerario — a max ~1 ora in auto o traghetto dalla base della tappa, compatibili con 3 bambini.</p>
    </div>

    <div class="natura-filters" id="natura-tipo-filters" style="margin-bottom:0.5rem;">
      <button class="natura-filter-btn active" data-tipo="tutti">Tutti (${NATURA_DATA.length})</button>
      <button class="natura-filter-btn" data-tipo="natura">🌿 Natura (${NATURA_DATA.filter(n => n.tipo === 'natura').length})</button>
      <button class="natura-filter-btn" data-tipo="cultura">🏛️ Cultura (${NATURA_DATA.filter(n => n.tipo === 'cultura').length})</button>
    </div>

    <div class="natura-filters" id="natura-filters">
      <button class="natura-filter-btn active" data-area="tutte">Tutte le tappe</button>
      ${aree.map(a => `
        <button class="natura-filter-btn" data-area="${a}">
          ${a} (${NATURA_DATA.filter(n => n.area === a).length})
        </button>
      `).join('')}
    </div>

    <div id="natura-pillole-area">${pilloleAreaHtml(_activeArea)}</div>

    <div class="natura-grid" id="natura-grid">
      ${NATURA_DATA.map(renderCard).join('')}
    </div>
  `

  function applyFilters() {
    const box = document.getElementById('natura-pillole-area')
    if (box) box.innerHTML = pilloleAreaHtml(_activeArea)

    const grid = document.getElementById('natura-grid')
    if (!grid) return
    const filtered = NATURA_DATA.filter(n =>
      (_activeArea === 'tutte' || n.area === _activeArea) &&
      (_activeTipo === 'tutti' || n.tipo === _activeTipo)
    )
    grid.innerHTML = filtered.length
      ? filtered.map(renderCard).join('')
      : `<p style="color:var(--color-text-muted);padding:1rem;">Nessun suggerimento per questa combinazione di filtri.</p>`
    bindCardEvents()
  }

  // Filtro per tipo (natura / cultura)
  document.getElementById('natura-tipo-filters')?.addEventListener('click', e => {
    const btn = e.target.closest('.natura-filter-btn')
    if (!btn) return
    _activeTipo = btn.dataset.tipo
    document.querySelectorAll('#natura-tipo-filters .natura-filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    applyFilters()
  })

  // Filtro per area / tappa
  document.getElementById('natura-filters')?.addEventListener('click', e => {
    const btn = e.target.closest('.natura-filter-btn')
    if (!btn) return
    _activeArea = btn.dataset.area
    document.querySelectorAll('#natura-filters .natura-filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    applyFilters()
  })

  bindCardEvents()
}

/* Pillole sulla tappa: solo filtrando su una singola area — su "tutte le
   tappe" sarebbero un muro di testo prima delle schede. */
function pilloleAreaHtml(area) {
  const pillole = PILLOLE_AREA[area]
  if (!pillole?.length) return ''
  return `
    <div class="natura-pillole-box">
      <div class="natura-pillole-title">💡 Pillole — ${_esc(area)}</div>
      <ul class="natura-pillole-list">
        ${pillole.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>
  `
}

function renderCard(n) {
  const imp  = IMPEGNO_LABELS[n.impegno]  || { label: n.impegno, icon: '🕐', cls: '' }
  const nota = NOTA_LABELS[n.nota_tipo]   || { label: n.nota_tipo, cls: '' }
  const tipo = TIPO_LABELS[n.tipo]        || null
  // Sia "Naviga" sia "Apri in Maps" cercano il posto per NOME: risolverlo è
  // compito di Google, che lo sa fare meglio di noi. Le coords restano solo
  // per il pin sulla pagina Mappa.
  const q       = MAPS_Q[n.id] || n.nome
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
  const pillola = PILLOLE_LUOGO[n.id]

  return `
    <div class="natura-card ${nota.cls}" data-id="${n.id}">
      <div class="natura-card-top">
        <div>
          <div class="natura-nome">${n.nome}</div>
          <div class="natura-area">📍 ${n.area}</div>
        </div>
        <span class="natura-nota-badge ${nota.cls}">${nota.label}</span>
      </div>

      <div class="natura-badges">
        ${tipo ? `<span class="natura-badge ${tipo.cls}">${tipo.label}</span>` : ''}
        <span class="natura-badge natura-cat">${n.categoriaLabel}</span>
        <span class="natura-badge ${imp.cls}">${imp.icon} ${imp.label}</span>
        <span class="natura-badge ${n.bambini ? 'natura-kid-ok' : 'natura-kid-no'}">
          ${n.bambini ? '👶 Kids ✓' : '👶 Kids ≠'}
        </span>
      </div>

      <p class="natura-desc">${n.descrizione}</p>

      ${n.bambini_nota ? `
        <div class="natura-kids-note">
          <span style="font-size:0.9rem;">👶</span>
          <span>${n.bambini_nota}</span>
        </div>
      ` : ''}

      ${pillola ? `
        <div class="natura-pillola">
          <span style="font-size:0.9rem;">💡</span>
          <span><strong>Lo sapevi?</strong> ${pillola}</span>
        </div>
      ` : ''}

      <div class="natura-actions">
        <a href="${navUrl(q)}" target="_blank" rel="noopener" class="btn btn-outline natura-maps-btn">
          🚗 Naviga
        </a>
        <a href="${mapsUrl}" target="_blank" rel="noopener" class="btn btn-outline natura-maps-btn">
          🗺️ Apri in Maps
        </a>
        <button class="btn btn-outline natura-add-idea-btn"
          data-nome="${_esc(n.nome)}"
          data-area="${_esc(n.area)}"
          data-lat="${n.coords.lat}"
          data-lng="${n.coords.lng}">
          📌 Aggiungi a un giorno
        </button>
      </div>
    </div>
  `
}

function bindCardEvents() {
  document.querySelectorAll('.natura-add-idea-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nome  = btn.dataset.nome
      const area  = btn.dataset.area
      const lat   = parseFloat(btn.dataset.lat)
      const lng   = parseFloat(btn.dataset.lng)

      const salva = date => {
        addIdea({
          text: nome,
          location_name: area,
          categoria: 'escursione',
          stato: 'da-verificare',
          day_date: date,
          add_to_map: true,
          coordinates: { lat, lng },
          marker_color: '#10b981',
        })
        _conferma(btn, date)
      }

      // Senza giorni caricati il selettore non avrebbe nulla da offrire: si
      // salva tra le Idee, che e' poi il comportamento di prima.
      if (!_giorni.length) { salva(null); return }

      openDayPicker({
        nome,
        giorni: _giorni,
        giaScelti: loadIdeas().filter(i => i.text === nome && i.day_date).map(i => i.day_date),
        consentiNessuno: true,
        onConferma: salva,
      })
    })
  })
}

// Riscontro sul pulsante: dice anche DOVE e finita, perche' ora l'esito non e
// piu scontato come quando andava sempre e solo nelle Idee.
function _conferma(btn, date) {
  const giorno = date ? _giorni.find(g => g.date === date) : null
  btn.textContent = giorno ? `✅ Aggiunta al Gg. ${giorno.day}` : '✅ Aggiunta alle Idee'
  btn.disabled = true
  setTimeout(() => { btn.textContent = '📌 Aggiungi a un giorno'; btn.disabled = false }, 2200)
}

function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
