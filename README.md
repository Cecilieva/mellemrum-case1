# Optimeringer og tekniske forbedringer
Projektet er løbende blevet optimeret med fokus på performance, tilgængelighed, kodekvalitet og en mere overskuelig datastruktur.

# Mere målrettet datahentning
Forsiden har kun brug for følgende oplysninger om hvert event:
- ID
- Titel
- Kort beskrivelse
- Dato
- Kategori
- Billede
- Venue-navn
Supabase-forespørgslen er derfor begrænset til de kolonner, som eventkortene faktisk anvender. Lange beskrivelser, adresser og andre oplysninger hentes først på eventets detaljeside. Det reducerer størrelsen på serverens svar og gør dataflowet tydeligere.

# Billedoptimering
Billed-URL’erne i Supabase er blevet opdateret, så eventbillederne hentes i dimensioner, der passer bedre til eventkortenes 4:3-format. Billederne leveres nu i 800 × 600 px med komprimeret kvalitet i stedet for i unødigt store dimensioner.
Optimeringen reducerer mængden af billeddata, som browseren skal hente, og kan derfor forbedre sidens indlæsningstid og performance. Selve billederne administreres fortsat gennem de URL’er, der er gemt i Supabase.

# Lighthouse og tredjepartscookies
Lighthouse registrerer fortsat tredjepartscookies, fordi billederne stadig leveres fra Unsplash. Optimeringen af billedstørrelsen reducerer overførte bytes, men fjerner ikke Unsplash som ekstern afhængighed og løser derfor ikke nødvendigvis Best Practices-advarslen.

# Scroll til toppen ved navigation
Da løsningen er en React SPA, skifter brugeren side uden en fuld genindlæsning. Der er derfor tilføjet en funktion, som automatisk scroller til toppen ved routeskift.
Det sikrer, at brugeren starter ved den nye sides overskrift og ikke lander på samme scrollposition som på den forrige side.

# Fælles footer
Footeren er samlet i én genanvendelig komponent og renderes centralt i App.jsx. Det fjerner gentaget kode fra de enkelte sider og sikrer et ensartet udtryk på tværs af alle routes.

# Dynamiske sidetitler
Browserfanens titel opdateres ved navigation, så hver side får en relevant titel. Det gør det lettere at orientere sig mellem faner og forbedrer samtidig sidens SEO og tilgængelighed.

# Synligt tastaturfokus
Links, knapper og formularfelter har tydelig fokusmarkering. Det gør siden nemmere at navigere med tastatur og forbedrer oplevelsen for brugere, som ikke anvender mus eller touch.

# Forbedret hero-tekst
Den negative afstand mellem bogstaverne i hero-overskriften er fjernet eller reduceret. Det forbedrer læsbarheden, især på små skærme, uden at ændre sidens visuelle identitet væsentligt.

# Favicon
Vites standard-favicon er erstattet med Mellemrums eget ikon. Det gør browserfanen mere genkendelig og understøtter projektets visuelle identitet.

# Forenklet state-håndtering
Unødvendig state til antallet af tilmeldinger er fjernet. Antallet beregnes eller hentes nu fra én tydelig datakilde, hvilket reducerer risikoen for, at forskellige state-værdier kommer ud af sync.

# Opdeling af EventPage
EventPage havde tidligere ansvar for både datahentning, visning af eventdata, formularfelter, indsendelse samt loading-, succes- og fejltilstande.
Siden er opdelt i mindre komponenter:
src/components/
├── EventDetails.jsx
└── RegistrationForm.jsx
EventPage står nu primært for at hente eventet og vælge den relevante UI-tilstand. EventDetails viser eventets oplysninger, mens RegistrationForm håndterer formularens state, indsendelse, succes og fejl. Opdelingen følger princippet om single responsibility og gør komponenterne lettere at vedligeholde og teste.

# Users-tabel i Supabase
Der er oprettet en separat users-tabel i Supabase for at skabe en mere overskuelig struktur for brugerdata. Tabellen giver et bedre grundlag for at organisere brugere og senere forbinde dem med tilmeldinger.

# Videreudvikling
Event-tabellen indeholder fortsat gentagne venue-oplysninger, fordi samme venue kan være gemt direkte på flere events. En planlagt forbedring er derfor at oprette en separat venues-tabel og forbinde events til den via venueId.
Det vil reducere gentagne data og gøre det muligt at opdatere eksempelvis adresse og website ét sted. Ændringen kan verificeres i Supabase Schema Visualizer og ved at hente venue-oplysninger som relationelle data i React.

# Test og validering
Løsningen kontrolleres løbende med Lighthouse, Chrome DevTools og responsive viewport-tests. Der testes blandt andet for:
- Performance og Best Practices
- Korrekt billedindlæsning
- Vandret overflow på mobil
- Tastaturnavigation og fokusmarkering
- Korrekte sidetitler
- Søgning og kategorifiltrering
- Navigation mellem eventoversigt og detaljesider
- Fejl og advarsler i browserkonsollen
- Production build uden fejl

## Kendte begrænsninger
Eventbillederne leveres fortsat fra Unsplash via URL’er gemt i Supabase. Det medfører tredjepartscookies og påvirker Lighthouse Best Practices. 

## Responsivt design
Løsningen er kontrolleret ved mobilbredder på 320 px og 390 px. Navigation, hero-sektion, filtre og eventkort tilpasser sig uden vandret overflow eller overlappende indhold.