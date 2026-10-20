'use strict';

/* =====================================================================
   BIP – Kartläggning
   1. Innehåll (delar, frågor, skalor)  – ändra texter här
   2. Tillstånd och sparande
   3. Progressionskortet (canvas)
   4. Bygga delarna 3–7
   5. Navigering och händelser
   6. PDF-export
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. INNEHÅLL
   --------------------------------------------------------------------- */

const PARTS = [
    { n: 1, short: 'Introduktion', title: 'Introduktion', desc: 'Om kartläggningen och uppgifter om mätningen.' },
    { n: 2, short: 'Progressionskort', title: 'Progressionskort', desc: 'Individen markerar sin nivå inom tio områden.' },
    { n: 3, short: 'Indikator 1–2', title: 'Indikator 1–2', desc: 'Vad individen vill arbeta med och vilken kompetens som finns.' },
    { n: 4, short: 'Indikator 3–5', title: 'Indikator 3–5', desc: 'Hur mycket individen klarar av, vad som behövs för att nå arbete och samarbete.' },
    { n: 5, short: 'Indikator 6–7', title: 'Indikator 6–7', desc: 'Att ta kontakt med personer man inte känner och hälsa i förhållande till arbete.' },
    { n: 6, short: 'Indikator 8–9', title: 'Indikator 8–9 och övriga frågor', desc: 'Tid i vardagen, stöd från familj och vänner samt övriga frågor.' },
    { n: 7, short: 'Sökande, lön, team', title: 'Arbetssökande, lön och teamets reflektion', desc: 'Hur individen söker arbete, önskad lön och teamets reflektion.' }
];

const INFO_FIELDS = [
    { key: 'name', label: 'Gäller' },
    { key: 'date', label: 'Datum' },
    { key: 'measurement', label: 'Progressionsmätning' },
    { key: 'convener', label: 'Sammankallande' }
];

/* Frågorna i progressionskortet (del 2). Ordningen är medsols från toppen. */
const CARD_QUESTIONS = [
    'Vet du vad du skulle vilja jobba med?',
    'Tror du att dina kunskaper och erfarenheter kan användas på en arbetsplats?',
    'Tror du själv att du klarar av ett arbete eller studier?',
    'Vet du vad du ska göra för att förbättra dina möjligheter att få ett jobb?',
    'Söker jobb? Lön?',
    'Hur bra är du på att samarbeta med andra?',
    'Hur lätt har du att ta kontakt med personer du inte känner?',
    'Hur tycker du din hälsa som helhet är (fysiskt, psykiskt, missbruk) i förhållande till att kunna jobba eller studera?',
    'Har du tid i vardagen för att fokusera på att få ett arbete/ta del av aktiviteter eller studier?',
    'Får du rätt slags stöd från familj och vänner när du behöver hjälp?'
];

/* Frågor med skala 1–5. "part" anger vilken del frågan visas i. */
const ITEMS = [
    {
        id: 'i1', part: 3, num: 1,
        heading: 'Vet du vad du skulle vilja arbeta med?',
        examples: [
            'Vad skulle du vilja arbeta med?',
            'Vad tycker du om att arbeta med? (t.ex. utifrån tidigare arbeten eller praktikplatser)',
            'Vilken typ av arbete tänker du passar dig? (eventuella behov av anpassning t.ex.)',
            'Om studier är en förutsättning för att du ska få arbeta med det du vill, hur ser du på det?',
            'Kan du tänka dig att flytta för att få ett arbete?',
            'Vad är viktigast för dig med ett arbete?'
        ],
        prompt: 'Så, på en skala 1–5, hur väl vet du vad du vill jobba med?',
        scale: [
            'Jag vet inte vad jag vill arbeta med.',
            'Jag vet i väldigt liten grad vad jag vill arbeta med.',
            'Jag vet någorlunda vad jag vill arbeta med.',
            'Jag vet ganska säkert vad jag vill arbeta med.',
            'Jag vet precis vad jag vill arbeta med.'
        ]
    },
    {
        id: 'i2', part: 3, num: 2,
        heading: 'Vad har du för kompetens som kan vara till nytta på en arbetsplats?',
        examples: [
            'Vad är du bra på?',
            'Tror du att dina kompetenser kan användas på en arbetsplats?',
            'Berätta för mig vad du tycker du är bra på.',
            'Vad har du att bidra med på en framtida arbetsplats – vad skulle de vara nöjda med om de anställer dig?'
        ],
        prompt: 'Så, på en skala 1–5, hur ser du på dina kompetenser som kan vara till nytta på en arbetsplats?',
        scale: [
            'Jag tror inte att jag har något som kan vara till nytta på en arbetsplats.',
            'Jag tvivlar starkt på att jag har något som kan vara till nytta på en arbetsplats.',
            'Det varierar. Ibland blir jag osäker på om jag har något som kan vara till nytta på en arbetsplats.',
            'Jag är för det mesta säker på att jag har något som kan vara till nytta på en arbetsplats.',
            'Jag är säker på att jag har massor som kan vara till nytta på en arbetsplats.'
        ]
    },
    {
        id: 'i3', part: 4, num: 3,
        heading: 'Hur mycket tror du att du skulle klara av att arbeta eller studera?',
        examples: [
            'Har du jobbat eller studerat förut? Har det skett förändringar i ditt liv sedan dess?',
            'Vet du vad som menas med heltid/deltid?'
        ],
        prompt: 'Så, på en skala 1–5, hur mycket tror du att du skulle klara av att arbeta eller studera?',
        scale: [
            'Jag tror inte jag kan klara av att arbeta/studera.',
            'Jag tror att jag skulle klara av att arbeta eller studera 2 timmar/dag.',
            'Jag tror att jag skulle klara av att arbeta eller studera 4 timmar/dag.',
            'Jag tror att jag skulle klara av att arbeta eller studera 6 timmar/dag.',
            'Jag tror att jag skulle klara av att arbeta eller studera 8 timmar/dag.'
        ]
    },
    {
        id: 'i4', part: 4, num: 4,
        heading: 'Vet du vad du behöver utveckla eller göra annorlunda för att få ett arbete eller påbörja studier?',
        examples: [
            'Söker du jobb?',
            'Hur söker du jobb?',
            'Vet du vilka utbildningar du har möjlighet att söka?',
            'Vet du vad en arbetsgivare söker efter hos en arbetstagare?'
        ],
        prompt: 'Så, på en skala 1–5, hur väl vet du vad du behöver göra för att få ett arbete eller påbörja studier?',
        scale: [
            'Jag vet inte hur jag ska göra för att nå ett arbete.',
            'Jag vet till viss del vad jag ska göra, för att nå ett arbete.',
            'Jag vet ganska väl vad jag ska göra för att nå ett arbete.',
            'Jag vet till stor del vad jag ska göra för att nå ett arbete.',
            'Jag vet precis hur jag ska göra för att nå ett arbete.'
        ]
    },
    {
        id: 'i5', part: 4, num: 5,
        heading: 'Hur bra är du på att samarbeta med andra?',
        examples: [
            'Har du erfarenhet av att jobba mot ett gemensamt mål tillsammans med andra?',
            'Vad innebär samarbete för dig?',
            'Tycker du om att hjälpa till? Kan du låta andra hjälpa dig?'
        ],
        prompt: 'Så, på en skala 1–5, hur bra är du på att samarbeta med andra?',
        scale: [
            'Jag tycker det är väldigt svårt att samarbeta i grupp med andra.',
            'Jag har ofta svårt att samarbeta med andra.',
            'Det varierar. Ibland är det svårt och ibland är det enkelt.',
            'Jag tycker oftast att det är lätt att samarbeta med andra.',
            'Jag tycker det är väldigt lätt att samarbeta med andra.'
        ]
    },
    {
        id: 'i6', part: 5, num: 6,
        heading: 'Hur lätt har du för att ta kontakt med personer du inte känner?',
        examples: [
            'Är du blyg?',
            'Känner du dig osäker på att prata svenska?',
            'Är det lätt för dig att berätta vad du är bra på? Eller vad du behöver stöd i?'
        ],
        prompt: 'Så, på en skala 1–5, hur lätt är det för dig att ta kontakt med personer du inte känner?',
        scale: [
            'Jag tycker det är väldigt svårt att ta kontakt med andra.',
            'Jag har ofta svårt att ta kontakt med andra.',
            'Det varierar. Ibland är det svårt och ibland är det enkelt.',
            'Jag tycker oftast att det är lätt att ta kontakt med andra.',
            'Jag tycker det är väldigt lätt att ta kontakt med andra.'
        ]
    },
    {
        id: 'i7', part: 5, num: 7,
        heading: 'Hur är din hälsa i förhållande till arbete eller studier?',
        examples: [
            'Hur mår du?',
            'Har du ont någonstans? Berätta gärna mer om det.',
            'Äter du mediciner?',
            'Hur fungerar din sömn?',
            'Har du psykiska besvär så som ångest eller panik? Berätta gärna mer om det.',
            'Har du ett skadligt bruk/beroende?',
            'Hindrar din hälsa dig från att kunna jobba/studera? I vilken utsträckning?'
        ],
        prompt: 'Så, på en skala 1–5, hur mår du?',
        scale: [
            'Min hälsa hindrar mig helt och hållet från att arbeta.',
            'Min hälsa sätter enorma begränsningar för att jag ska kunna arbeta. Jag kan arbeta maximalt några timmar.',
            'Det varierar. Ibland är det svårt. Jag kanske kan ha deltidsarbete med rätt typ av hjälp och stöd.',
            'Min hälsa hindrar mig inte att arbeta men kan ibland sätta begränsningar.',
            'Min hälsa hindrar mig inte från att arbeta.'
        ]
    },
    {
        id: 'i8', part: 6, num: 8,
        heading: 'Har du tid i vardagen att fokusera på att få ett arbete eller ta del av aktiviteter?',
        examples: [
            'Har du barn?',
            'Hur ser en vanlig dag ut för dig?',
            'Vad tar mest av din tid?'
        ],
        prompt: 'Så, på en skala 1–5, hur mycket tid har du att söka arbete/utbildning eller delta i aktiviteter som för dig närmare arbete/studier?',
        scale: [
            'Jag har nästan aldrig tid att fokusera på det.',
            'Jag har oftast inte tid att fokusera på det.',
            'Det varierar. Ibland har jag tid och ibland inte.',
            'Jag har mestadels tid att fokusera på det.',
            'Jag har definitivt tid att fokusera på det.'
        ]
    },
    {
        id: 'i9', part: 6, num: 9,
        heading: 'Får du (rätt slags) stöd från vänner och familj om du behöver det?',
        examples: [
            'Har du vänner och familj?',
            'När kan du vara i behov av stöd från vänner och familj?',
            'Finns det något du behöver stöd med, men som du saknar?'
        ],
        prompt: 'Så, på en skala 1–5, hur väl får du stöd från vänner och familj om du behöver det?',
        scale: [
            'Jag får ingen hjälp från familj/vänner.',
            'Jag får väldigt sällan hjälp från familj/vänner.',
            'Det varierar. Ibland får jag hjälp och ibland inte från familj/vänner.',
            'Jag får för det mesta hjälp från familj/vänner.',
            'Jag får alltid hjälp från familj/vänner.'
        ]
    },
    {
        id: 'x1', part: 6, group: 'extra',
        heading: 'Har du motivation att aktivt söka ett arbete/praktik eller utbildning?',
        scale: [
            'Jag har nästan aldrig motivation att fokusera på det.',
            'Jag har oftast inte motivation att fokusera på det.',
            'Det varierar. Ibland har jag motivation och ibland inte.',
            'Jag har mestadels motivation att fokusera på det.',
            'Jag har definitivt motivation att fokusera på det.'
        ]
    },
    {
        id: 'x2', part: 6, group: 'extra',
        heading: 'Hur bra är du på svenska språket?',
        scale: [
            'Jag tycker att det är väldigt svårt med svenska språket.',
            'Jag tycker att det är svårt med svenska språket.',
            'Det varierar. Ibland lätt, ibland svårt.',
            'Jag tycker det är ganska lätt med svenska språket.',
            'Jag tycker det är väldigt lätt med svenska språket.'
        ]
    },
    {
        id: 't1', part: 7, group: 'team',
        heading: 'Tror du att individen kommer att få arbete inom det närmaste året?',
        scale: [
            'Tror inte att individen kommer att få ett arbete inom det närmaste året.',
            'Tvivlar på att individen kommer att få ett arbete inom det närmaste året.',
            'Det varierar. Ibland är jag optimistisk, ibland inte.',
            'Tror att det finns goda möjligheter för individen att få arbete inom det närmaste året.',
            'Tror definitivt på att individen kommer att få ett arbete inom det närmaste året.'
        ]
    },
    {
        id: 't2', part: 7, group: 'team',
        heading: 'I vilken utsträckning agerar individen målmedvetet för att få ett arbete?',
        scale: [
            'Agerar aldrig eller nästan aldrig målmedvetet för att få arbete.',
            'Agerar sällan målmedvetet för att få arbete, men ibland kan det hända.',
            'Det varierar. Agerar målmedvetet ibland och ibland inte.',
            'Agerar oftast målmedvetet för att få arbete.',
            'Agerar alltid målmedvetet för att få arbete.'
        ]
    }
];

const JOB_SEARCH_QUESTION = 'Hur söker du arbete?';
const JOB_SEARCH_HINT = 'Kryssa gärna flera alternativ.';
const JOB_SEARCH_OPTIONS = [
    'Genom annonser i tidningar.',
    'Via Platsbanken eller andra sidor.',
    'Har kontaktat en arbetsgivare på eget initiativ (t.ex. ringt, skickat in spontanansökan eller dykt upp på deras kontor).',
    'Har frågat min familj, vänner och bekanta om de känner någon som kan hjälpa mig att hitta ett arbete.',
    'Har gjort min praktik uppmärksam på att jag skulle vilja ha en anställning efter att praktiken är över.',
    'Intresseanmälan till bemanningsföretag.',
    'Sociala medier t.ex. Facebook, LinkedIn m.fl.',
    'Jag letar inte efter ett arbete (eftersom jag är sjuk eller av andra skäl).',
    'Vill ej svara'
];
const JOB_SEARCH_EXCLUSIVE = JOB_SEARCH_OPTIONS.length - 1; // "Vill ej svara" kan inte kombineras

const SALARY_QUESTION = 'Hur hög lön vill du ha, före skatt, för att tacka ja till ett arbete?';
const SALARY_OPTIONS = [
    '0–4\u00A0900 kr/månad',
    '5\u00A0000–9\u00A0900 kr/månad',
    '10\u00A0000–14\u00A0900 kr/månad',
    '15\u00A0000–19\u00A0900 kr/månad',
    '20\u00A0000–24\u00A0900 kr/månad',
    '25\u00A0000–29\u00A0900 kr/månad',
    '30\u00A0000–34\u00A0900 kr/månad',
    '40\u00A0000 kr/månad eller mer'
];

/* Vad som visas i varje del (i ordning). Del 1 och 2 ligger i index.html. */
const PART_BLOCKS = {
    3: [{ info: true }, { item: 'i1' }, { item: 'i2' }],
    4: [{ item: 'i3' }, { item: 'i4' }, { item: 'i5' }],
    5: [{ item: 'i6' }, { item: 'i7' }],
    6: [
        { item: 'i8' }, { item: 'i9' },
        { group: 'Övriga frågor utanför indikatorer', note: 'Görs vid utrymme.' },
        { item: 'x1' }, { item: 'x2' }
    ],
    7: [
        { jobs: true }, { salary: true },
        { group: 'Frågor till teamet – för reflektion' },
        { item: 't1' }, { item: 't2' }
    ]
};


/* ---------------------------------------------------------------------
   2. TILLSTÅND OCH SPARANDE
   --------------------------------------------------------------------- */

const NUM_ARMS = CARD_QUESTIONS.length;
const STORE_KEY = 'bip-kartlaggning-v1';
/* sessionStorage = svaren försvinner när fliken stängs (säkrast för personuppgifter).
   Byt till window.localStorage om svaren ska finnas kvar mellan besök. */
const store = window.sessionStorage;

function todayString() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function defaultState() {
    return {
        info: { name: '', date: todayString(), measurement: '', convener: '' },
        card: new Array(NUM_ARMS).fill(-1), // -1 = inget val, 0 = "Kan inte svara", 1–5 = nivå
        answers: {},                        // frågans id -> 1–5
        notes: {},                          // frågans id -> text
        jobSearch: [],                      // index i JOB_SEARCH_OPTIONS
        salary: null                        // index i SALARY_OPTIONS
    };
}

function loadState() {
    const base = defaultState();
    try {
        const saved = JSON.parse(store.getItem(STORE_KEY));
        if (!saved) return base;
        return {
            info: Object.assign(base.info, saved.info),
            card: Array.isArray(saved.card) && saved.card.length === NUM_ARMS ? saved.card : base.card,
            answers: saved.answers || {},
            notes: saved.notes || {},
            jobSearch: Array.isArray(saved.jobSearch) ? saved.jobSearch : [],
            salary: Number.isInteger(saved.salary) ? saved.salary : null
        };
    } catch (e) {
        return base;
    }
}

function persist() {
    try { store.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* sparande är en bonus */ }
}

let state = loadState();
let currentPart = 1;


/* ---------------------------------------------------------------------
   3. PROGRESSIONSKORTET
   (ritkoden är densamma som i den tidigare appen, så att placeringen
    av texterna är oförändrad)
   --------------------------------------------------------------------- */

const canvas = document.getElementById('spiderCanvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const levels = 5;
const radiusStep = 42;
const zeroRadius = 38;  // avstånd till "Kan inte svara"-bladen
const circleSize = 18;  // storlek på valbara 1–5-cirklar
const zeroSize = 12;    // storlek på "Kan inte svara"-bladen

function armAngle(i) {
    return (i * 2 * Math.PI / NUM_ARMS) - Math.PI / 2;
}

function drawCard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const selectedValues = state.card;

    // 1. Mitten ("Kan inte svara")
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#e0e0e0';
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Kan inte', centerX, centerY - 6);
    ctx.fillText('svara', centerX, centerY + 8);

    // 2. Armar, cirklar och texter
    for (let i = 0; i < NUM_ARMS; i++) {
        const angle = armAngle(i);

        // Nivå 0 (bladen)
        const x0 = centerX + Math.cos(angle) * zeroRadius;
        const y0 = centerY + Math.sin(angle) * zeroRadius;
        ctx.beginPath();
        ctx.arc(x0, y0, zeroSize, 0, Math.PI * 2);
        ctx.fillStyle = selectedValues[i] === 0 ? '#666' : '#f0f0f0';
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Nivå 1–5
        for (let level = 1; level <= levels; level++) {
            const r = zeroRadius + (level * radiusStep);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            ctx.beginPath();
            ctx.arc(x, y, circleSize, 0, Math.PI * 2);
            ctx.fillStyle = selectedValues[i] === level ? '#1e3a8a' : `rgb(${255 - (level * 30)}, ${275 - (level * 30)}, 255)`;
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();

            // Siffran centrerad i cirkeln
            ctx.fillStyle = selectedValues[i] === level ? 'white' : 'black';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(level, x, y);

            // Yttre texter
            if (level === levels) {
                const textDist = r + 30;
                let tx = centerX + Math.cos(angle) * textDist;
                let ty = centerY + Math.sin(angle) * textDist;

                let hAlign = 'center';
                let vAlign = 'middle';
                const customWidth = 160;

                // Fråga 3 (index 2) och fråga 9 (index 8): texten knuffas uppåt
                if (i === 2 || i === 8) {
                    vAlign = 'bottom';
                    hAlign = 'center';
                    ty -= 15;
                }
                // Fråga 4 (index 3) och fråga 8 (index 7): texten knuffas nedåt
                else if (i === 3 || i === 7) {
                    vAlign = 'top';
                    hAlign = 'center';
                    ty += 15;
                }
                // Övriga armar: kompass-logik så att texterna inte krockar
                else {
                    if (Math.cos(angle) > 0.5) hAlign = 'left';
                    else if (Math.cos(angle) < -0.5) hAlign = 'right';

                    if (Math.sin(angle) > 0.5) vAlign = 'top';
                    else if (Math.sin(angle) < -0.5) vAlign = 'bottom';
                }

                wrapText(ctx, CARD_QUESTIONS[i], tx, ty, customWidth, 16, vAlign, hAlign);
            }
        }
    }

    // 3. Linjerna (polygonen)
    const points = [];
    for (let i = 0; i < NUM_ARMS; i++) {
        if (selectedValues[i] >= 0) {
            const angle = armAngle(i);
            const r = zeroRadius + (selectedValues[i] * radiusStep);
            points.push({ x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r });
        }
    }
    if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(30, 58, 138, 0.8)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

function wrapText(context, text, x, y, maxWidth, lineHeight, vAlign, hAlign) {
    context.fillStyle = '#333';
    context.font = '13px sans-serif';
    context.textAlign = hAlign;

    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    let startY = y;
    if (vAlign === 'bottom') {
        startY = y - (lines.length - 1) * lineHeight;
        context.textBaseline = 'alphabetic';
    } else if (vAlign === 'top') {
        startY = y;
        context.textBaseline = 'top';
    } else {
        startY = y - ((lines.length - 1) * lineHeight) / 2;
        context.textBaseline = 'middle';
    }

    for (let k = 0; k < lines.length; k++) {
        context.fillText(lines[k].trim(), x, startY + (k * lineHeight));
    }
}

/* Vilken cirkel (om någon) ligger under pekaren? */
function cardHitTest(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    for (let i = 0; i < NUM_ARMS; i++) {
        const angle = armAngle(i);

        const x0 = centerX + Math.cos(angle) * zeroRadius;
        const y0 = centerY + Math.sin(angle) * zeroRadius;
        if (Math.hypot(mouseX - x0, mouseY - y0) < zeroSize + 2) return { arm: i, level: 0 };

        for (let level = 1; level <= levels; level++) {
            const r = zeroRadius + (level * radiusStep);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (Math.hypot(mouseX - x, mouseY - y) < circleSize + 2) return { arm: i, level };
        }
    }
    return null;
}

canvas.addEventListener('click', (e) => {
    const hit = cardHitTest(e);
    if (!hit) return;
    // Klick på redan valt svar tar bort valet
    state.card[hit.arm] = state.card[hit.arm] === hit.level ? -1 : hit.level;
    persist();
    drawCard();
    refreshStepper();
});

canvas.addEventListener('mousemove', (e) => {
    canvas.style.cursor = cardHitTest(e) ? 'pointer' : 'default';
});

/* Bilden av kortet med vit bakgrund (används i båda PDF-filerna) */
function cardImageData() {
    const off = document.createElement('canvas');
    off.width = canvas.width;
    off.height = canvas.height;
    const g = off.getContext('2d');
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, off.width, off.height);
    g.drawImage(canvas, 0, 0);
    return off.toDataURL('image/jpeg', 0.92);
}


/* ---------------------------------------------------------------------
   4. BYGGA DELARNA 3–7
   --------------------------------------------------------------------- */

function el(tag, props, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props || {})) {
        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else node.setAttribute(key, value);
    }
    children.flat().forEach((child) => { if (child) node.append(child); });
    return node;
}

function buildInfoFields() {
    return document.getElementById('tplInfo').content.firstElementChild.cloneNode(true);
}

function buildItem(item) {
    const titleId = 't-' + item.id;
    const promptId = 'p-' + item.id;

    const title = el('h3', { class: 'item__title', id: titleId });
    if (item.num) title.append(el('span', { class: 'item__num', text: 'Indikator ' + item.num + ' – ' }));
    title.append(item.heading);

    const article = el('article', { class: 'item', 'data-item': item.id }, title);

    if (item.examples) {
        article.append(el('div', { class: 'examples' },
            el('p', { class: 'examples__label', text: 'Exempel på frågor' }),
            el('ul', {}, item.examples.map((text) => el('li', { text })))
        ));
    }

    if (item.prompt) article.append(el('p', { class: 'prompt', id: promptId, text: item.prompt }));

    article.append(el('div',
        { class: 'scale', role: 'group', 'aria-labelledby': item.prompt ? promptId : titleId },
        item.scale.map((text, i) => el('button',
            { type: 'button', class: 'opt', 'data-value': i + 1, 'aria-pressed': 'false' },
            el('span', { class: 'opt__num', text: String(i + 1) }),
            el('span', { class: 'opt__text', text })
        ))
    ));

    article.append(el('label', { class: 'note' },
        el('span', { text: 'Anteckningar (valfritt)' }),
        el('textarea', { rows: '2', 'data-note': item.id })
    ));

    return article;
}

function buildJobs() {
    return el('section', { class: 'item' },
        el('h3', { class: 'item__title', id: 'job-title', text: JOB_SEARCH_QUESTION }),
        el('p', { class: 'item__hint', text: JOB_SEARCH_HINT }),
        el('div', { class: 'checks', role: 'group', 'aria-labelledby': 'job-title' },
            JOB_SEARCH_OPTIONS.map((text, i) => el('label', { class: 'check' },
                el('input', { type: 'checkbox', 'data-job': i }),
                el('span', { text })
            ))
        )
    );
}

function buildSalary() {
    return el('section', { class: 'item' },
        el('h3', { class: 'item__title', id: 'salary-title', text: SALARY_QUESTION }),
        el('div', { class: 'choices', role: 'group', 'aria-labelledby': 'salary-title' },
            SALARY_OPTIONS.map((text, i) => el('button',
                { type: 'button', class: 'choice', 'data-salary': i, 'aria-pressed': 'false', text }
            ))
        )
    );
}

function buildParts() {
    PARTS.filter((p) => p.n >= 3).forEach((part) => {
        const host = document.getElementById('part-' + part.n);
        const sheet = el('div', { class: 'sheet' });

        PART_BLOCKS[part.n].forEach((block) => {
            if (block.info) {
                const slot = el('div', { 'data-slot': 'info' });
                sheet.append(slot);
            } else if (block.item) {
                sheet.append(buildItem(ITEMS.find((it) => it.id === block.item)));
            } else if (block.group) {
                sheet.append(el('h3', { class: 'group-title', text: block.group }));
                if (block.note) sheet.append(el('p', { class: 'group-note', text: block.note }));
            } else if (block.jobs) {
                sheet.append(buildJobs());
            } else if (block.salary) {
                sheet.append(buildSalary());
            }
        });

        host.append(
            el('header', { class: 'part__head' },
                el('p', { class: 'part__count', 'data-count': '' }),
                el('h2', { id: 'h-' + part.n, text: part.title })
            ),
            sheet
        );
    });

    // Fyll alla platshållare för uppgiftsfälten (del 1 och del 3)
    document.querySelectorAll('[data-slot="info"]').forEach((slot) => slot.replaceWith(buildInfoFields()));

    // Delarna-listan på introduktionssidan
    const list = document.getElementById('partlist');
    PARTS.filter((p) => p.n >= 2).forEach((part) => {
        list.append(el('li', {},
            el('button', { type: 'button', class: 'partlink', 'data-go': part.n },
                el('span', { class: 'partlink__n', text: String(part.n) }),
                el('span', { class: 'partlink__title', text: part.title }),
                el('span', { class: 'partlink__desc', text: part.desc })
            )
        ));
    });

    // Stegvisaren överst
    const stepper = document.getElementById('stepper');
    PARTS.forEach((part) => {
        stepper.append(el('li', {},
            el('button', { type: 'button', class: 'step', 'data-go': part.n },
                el('span', { class: 'step__badge', text: String(part.n) }),
                el('span', { class: 'step__label', text: part.short })
            )
        ));
    });

    document.querySelectorAll('[data-count]').forEach((p) => {
        const n = p.closest('.part').dataset.part;
        p.textContent = 'Del ' + n + ' av ' + PARTS.length;
    });
}

/* Läs in sparade värden i alla fält och knappar */
function syncControls() {
    document.querySelectorAll('[data-bind]').forEach((input) => {
        input.value = state.info[input.dataset.bind] || '';
    });

    document.querySelectorAll('[data-item]').forEach((item) => {
        const value = state.answers[item.dataset.item];
        item.querySelectorAll('.opt').forEach((btn) => {
            btn.setAttribute('aria-pressed', String(Number(btn.dataset.value) === value));
        });
    });

    document.querySelectorAll('textarea[data-note]').forEach((area) => {
        area.value = state.notes[area.dataset.note] || '';
    });

    document.querySelectorAll('input[data-job]').forEach((box) => {
        box.checked = state.jobSearch.includes(Number(box.dataset.job));
    });

    document.querySelectorAll('.choice').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(Number(btn.dataset.salary) === state.salary));
    });

    drawCard();
    refreshStepper();
}


/* ---------------------------------------------------------------------
   5. NAVIGERING OCH HÄNDELSER
   --------------------------------------------------------------------- */

function isComplete(n) {
    if (n === 1) return state.info.name.trim() !== '' && state.info.date !== '';
    if (n === 2) return state.card.every((v) => v !== -1);
    const items = ITEMS.filter((it) => it.part === n);
    return items.length > 0 && items.every((it) => state.answers[it.id] !== undefined);
}

function refreshStepper() {
    document.querySelectorAll('.step').forEach((btn) => {
        const n = Number(btn.dataset.go);
        const part = PARTS[n - 1];
        const done = isComplete(n);
        btn.classList.toggle('is-done', done);
        btn.querySelector('.step__badge').textContent = done ? '✓' : String(n);
        btn.setAttribute('aria-label', 'Del ' + n + ': ' + part.short + (done ? ' (ifylld)' : ''));
        if (n === currentPart) btn.setAttribute('aria-current', 'step');
        else btn.removeAttribute('aria-current');
    });
}

function partFromHash() {
    const match = location.hash.match(/^#del-(\d+)$/);
    const n = match ? Number(match[1]) : 1;
    return n >= 1 && n <= PARTS.length ? n : 1;
}

function showPart(n, { moveFocus = false } = {}) {
    currentPart = n;
    document.querySelectorAll('.part').forEach((section) => {
        section.hidden = Number(section.dataset.part) !== n;
    });

    document.getElementById('prevBtn').disabled = n === 1;
    document.getElementById('nextBtn').textContent = n === PARTS.length ? 'Exportera sammanfattning (PDF)' : 'Nästa del';
    document.getElementById('pagerInfo').textContent = 'Del ' + n + ' av ' + PARTS.length;
    document.title = PARTS[n - 1].title + ' – BIP Kartläggning';
    refreshStepper();

    // Visa aktivt steg i den bläddringsbara raden (utan att flytta sidan)
    const stepList = document.getElementById('stepper');
    const current = stepList.querySelector('.step[aria-current="step"]');
    if (current && stepList.scrollWidth > stepList.clientWidth) {
        stepList.scrollLeft = current.offsetLeft - (stepList.clientWidth - current.offsetWidth) / 2;
    }

    if (moveFocus) {
        window.scrollTo(0, 0);
        const heading = document.getElementById('h-' + n);
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
    }
}

function goTo(n) {
    const target = '#del-' + n;
    if (location.hash === target) showPart(n, { moveFocus: true });
    else location.hash = target; // hashchange visar delen
}

window.addEventListener('hashchange', () => showPart(partFromHash(), { moveFocus: true }));

document.addEventListener('click', (e) => {
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) { goTo(Number(goBtn.dataset.go)); return; }

    const opt = e.target.closest('.opt');
    if (opt) {
        const id = opt.closest('[data-item]').dataset.item;
        const value = Number(opt.dataset.value);
        if (state.answers[id] === value) delete state.answers[id];
        else state.answers[id] = value;
        persist();
        syncControls();
        return;
    }

    const choice = e.target.closest('.choice');
    if (choice) {
        const index = Number(choice.dataset.salary);
        state.salary = state.salary === index ? null : index;
        persist();
        syncControls();
    }
});

document.addEventListener('change', (e) => {
    const box = e.target.closest('input[data-job]');
    if (!box) return;

    const index = Number(box.dataset.job);
    let selected = new Set(state.jobSearch);
    if (box.checked) {
        if (index === JOB_SEARCH_EXCLUSIVE) selected = new Set([index]);
        else { selected.delete(JOB_SEARCH_EXCLUSIVE); selected.add(index); }
    } else {
        selected.delete(index);
    }
    state.jobSearch = [...selected].sort((a, b) => a - b);
    persist();
    syncControls();
});

document.addEventListener('input', (e) => {
    const field = e.target;

    if (field.matches('[data-bind]')) {
        const key = field.dataset.bind;
        state.info[key] = field.value;
        // Samma uppgift kan finnas på flera sidor – håll dem lika
        document.querySelectorAll('[data-bind="' + key + '"]').forEach((other) => {
            if (other !== field) other.value = field.value;
        });
        persist();
        refreshStepper();
    } else if (field.matches('textarea[data-note]')) {
        state.notes[field.dataset.note] = field.value;
        persist();
    }
});

document.getElementById('prevBtn').addEventListener('click', () => goTo(currentPart - 1));
document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentPart === PARTS.length) exportSummary();
    else goTo(currentPart + 1);
});
document.getElementById('exportBtn').addEventListener('click', exportSummary);
document.getElementById('cardPdfBtn').addEventListener('click', downloadCardPDF);

document.getElementById('resetCardBtn').addEventListener('click', () => {
    state.card.fill(-1);
    persist();
    drawCard();
    refreshStepper();
});

document.getElementById('resetAllBtn').addEventListener('click', () => {
    if (!window.confirm('Nollställa alla uppgifter, svar och anteckningar? Det går inte att ångra.')) return;
    state = defaultState();
    persist();
    syncControls();
    toast('Allt är nollställt.');
});

let toastTimer = null;
function toast(message, ms = 3500) {
    const box = document.getElementById('toast');
    box.textContent = message;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { box.hidden = true; }, ms);
}


/* ---------------------------------------------------------------------
   6. PDF-EXPORT
   --------------------------------------------------------------------- */

/* PDF-ernas standardtypsnitt klarar å, ä och ö men inte alla specialtecken */
function pdfSafe(text) {
    return String(text)
        .replace(/[\u2013\u2014\u2212]/g, '-')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\u2026/g, '...')
        .replace(/[\u00A0\u2009\u202F]/g, ' ')
        .replace(/[^\x00-\xFF]/g, '?');
}

function fileSlug(name) {
    return name.trim().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_-]/gu, '');
}

function pdfLibraryMissing() {
    if (window.jspdf && window.jspdf.jsPDF) return false;
    toast('PDF-biblioteket kunde inte laddas. Kontrollera internetanslutningen och ladda om sidan.', 6000);
    return true;
}

/* Samma PDF som i den tidigare appen: bara progressionskortet */
function downloadCardPDF() {
    if (pdfLibraryMissing()) return;
    const { jsPDF } = window.jspdf;

    const name = state.info.name.trim() || 'Ej angivet';
    const date = state.info.date || 'Ej angivet';

    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const imgSize = 210 - (margin * 2);

    pdf.setFontSize(18);
    pdf.text('Progressionskort - Resultat', margin, 20);
    pdf.setFontSize(12);
    pdf.text(pdfSafe('Namn: ' + name), margin, 30);
    pdf.text(pdfSafe('Datum: ' + date), margin, 37);
    pdf.addImage(cardImageData(), 'JPEG', margin, 45, imgSize, imgSize);

    pdf.save('progressionskort_' + (fileSlug(state.info.name) || 'ej_angivet') + '.pdf');
}

/* Sammanfattning av hela kartläggningen */
function exportSummary() {
    if (pdfLibraryMissing()) return;
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW = 210, PH = 297, M = 16, CW = PW - 2 * M, BOTTOM = PH - 18;
    const INK = [31, 41, 55], MUTED = [91, 100, 114], BLUE = [30, 58, 138], LINE = [213, 217, 227];
    let y = M;

    const S = pdfSafe;
    const lineHeight = (pt) => pt * 0.3528 * 1.35;
    const ensure = (h) => { if (y + h > BOTTOM) { pdf.addPage(); y = M; } };
    const setText = (size, style, color) => {
        pdf.setFont('helvetica', style);
        pdf.setFontSize(size);
        pdf.setTextColor(color[0], color[1], color[2]);
    };

    function write(text, { size = 10, style = 'normal', color = INK, x = M, width = CW } = {}) {
        setText(size, style, color);
        const h = lineHeight(size);
        pdf.splitTextToSize(S(text), width).forEach((line) => {
            ensure(h);
            pdf.text(line, x, y + h * 0.78);
            y += h;
        });
    }

    function sectionHeading(text) {
        ensure(22);
        y += 3;
        setText(13, 'bold', BLUE);
        pdf.text(S(text), M, y + 5);
        y += 8;
        pdf.setDrawColor(LINE[0], LINE[1], LINE[2]);
        pdf.setLineWidth(0.3);
        pdf.line(M, y, M + CW, y);
        y += 5;
    }

    /* En fråga med fem rutor (valt svar markerat) och svarets beskrivning */
    function scaleBlock(label, heading, value, texts, note) {
        const titleSize = 10.5, descSize = 9.5, box = 6, gap = 1.4;

        setText(titleSize, 'bold', INK);
        const titleLines = pdf.splitTextToSize(S(label + heading), CW).length;
        const descX = M + 5 * (box + gap) + 3;
        const desc = value ? texts[value - 1] : 'Ej besvarad';
        setText(descSize, value ? 'normal' : 'italic', value ? INK : MUTED);
        const descLines = pdf.splitTextToSize(S(desc), PW - M - descX);
        const descH = descLines.length * lineHeight(descSize);

        ensure(titleLines * lineHeight(titleSize) + 1.2 + Math.max(box, descH) + 4);
        write(label + heading, { size: titleSize, style: 'bold' });
        y += 1.2;

        for (let n = 1; n <= 5; n++) {
            const bx = M + (n - 1) * (box + gap);
            const selected = value === n;
            if (selected) { pdf.setFillColor(BLUE[0], BLUE[1], BLUE[2]); pdf.setDrawColor(BLUE[0], BLUE[1], BLUE[2]); }
            else { pdf.setFillColor(244, 246, 250); pdf.setDrawColor(LINE[0], LINE[1], LINE[2]); }
            pdf.setLineWidth(0.3);
            pdf.roundedRect(bx, y, box, box, 1, 1, 'FD');
            setText(9, selected ? 'bold' : 'normal', selected ? [255, 255, 255] : MUTED);
            pdf.text(String(n), bx + box / 2, y + 4.2, { align: 'center' });
        }

        setText(descSize, value ? 'normal' : 'italic', value ? INK : MUTED);
        descLines.forEach((line, i) => {
            pdf.text(line, descX, y + 0.8 + lineHeight(descSize) * (i + 0.78));
        });
        y += Math.max(box, descH + 1) + 2;

        if (note && note.trim()) write('Anteckningar: ' + note.trim(), { size: 9, style: 'italic', color: MUTED });
        y += 4;
    }

    // ---------- Sida 1: titel, uppgifter, progressionskort ----------
    setText(20, 'bold', BLUE);
    pdf.text('BIP - Sammanfattning', M, y + 6);
    y += 11;
    write('Frågor till individen om progression och utveckling kopplat till arbete och studier', { size: 9, color: MUTED });
    y += 4;

    INFO_FIELDS.forEach((field, i) => {
        const x = M + (i % 2) * (CW / 2);
        if (i % 2 === 0 && i > 0) y += 12;
        setText(8.5, 'normal', MUTED);
        pdf.text(S(field.label), x, y + 3);
        setText(11, 'bold', INK);
        pdf.text(S(state.info[field.key].trim() || '-'), x, y + 8.5);
    });
    y += 14;

    sectionHeading('Progressionskort');
    const cardAnswered = state.card.some((v) => v !== -1);
    if (cardAnswered) {
        const size = CW; // 178 mm
        ensure(size);
        pdf.addImage(cardImageData(), 'JPEG', M, y, size, size);
        y += size;
        pdf.addPage();
        y = M;
    } else {
        write('Progressionskortet är inte ifyllt.', { style: 'italic', color: MUTED });
        y += 4;
    }

    // ---------- Indikatorer ----------
    sectionHeading('Indikatorer');
    ITEMS.filter((it) => it.num).forEach((it) => {
        scaleBlock('Indikator ' + it.num + ' - ', it.heading, state.answers[it.id], it.scale, state.notes[it.id]);
    });

    // ---------- Övriga frågor ----------
    sectionHeading('Övriga frågor');
    ITEMS.filter((it) => it.group === 'extra').forEach((it) => {
        scaleBlock('', it.heading, state.answers[it.id], it.scale, state.notes[it.id]);
    });

    // ---------- Arbetssökande och lön ----------
    sectionHeading('Arbetssökande och lön');
    write(JOB_SEARCH_QUESTION, { size: 10.5, style: 'bold' });
    y += 1;
    if (state.jobSearch.length) {
        state.jobSearch.forEach((i) => write('- ' + JOB_SEARCH_OPTIONS[i], { size: 9.5, x: M + 2, width: CW - 2 }));
    } else {
        write('Ej besvarad', { size: 9.5, style: 'italic', color: MUTED });
    }
    y += 5;
    write(SALARY_QUESTION, { size: 10.5, style: 'bold' });
    y += 1;
    if (state.salary !== null) write(SALARY_OPTIONS[state.salary], { size: 9.5 });
    else write('Ej besvarad', { size: 9.5, style: 'italic', color: MUTED });
    y += 4;

    // ---------- Teamets reflektion ----------
    sectionHeading('Teamets reflektion');
    ITEMS.filter((it) => it.group === 'team').forEach((it) => {
        scaleBlock('', it.heading, state.answers[it.id], it.scale, state.notes[it.id]);
    });

    // ---------- Sidfot på alla sidor ----------
    const pages = pdf.getNumberOfPages();
    const footerName = state.info.name.trim();
    for (let p = 1; p <= pages; p++) {
        pdf.setPage(p);
        setText(8, 'normal', MUTED);
        pdf.text(S('BIP - Kartläggning' + (footerName ? '  |  ' + footerName : '')), M, PH - 9);
        pdf.text('Sida ' + p + ' av ' + pages, PW - M, PH - 9, { align: 'right' });
    }

    const slug = fileSlug(state.info.name) || 'ej_angivet';
    const date = state.info.date ? '_' + state.info.date : '';
    pdf.save('bip_sammanfattning_' + slug + date + '.pdf');
    toast('Sammanfattningen har skapats som PDF.');
}


/* ---------------------------------------------------------------------
   START
   --------------------------------------------------------------------- */

buildParts();
syncControls();
showPart(partFromHash());
