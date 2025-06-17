
# Facility-Connect - Project Setup Guide

## Benodigdheden voor het project

Om het project correct te laten werken, zijn er twee **API-sleutels** nodig die in de **.env**-bestand moeten worden opgenomen:

- **VITE_MAPBOX_API_KEY**
- **VITE_API_PREFIX**

Zonder deze sleutels zal de applicatie niet correct functioneren.

## Stappen om het project op te zetten

### 1. Clone de repository

Het eerste wat je moet doen, is de projectbestanden naar je computer halen. Dit doe je door de volgende opdracht in je terminal of command prompt in te voeren:

```sh
git clone https://gitlab.com/ikdoeict/vakken/opo_agile_team_project/projecten/2425/2425_atp_duurzaamfm/frontend/cense-ui.git
```

### 2. Voeg een `.env`-bestand toe

In de hoofdmap van het project moet je een bestand genaamd `.env` aanmaken. Dit bestand bevat de twee benodigde API-sleutels en een server-URL.

1. Maak een nieuw bestand met de naam **.env** in de hoofdmap van je project.
2. Voeg de volgende regels toe aan dit bestand:

```sh
VITE_MAPBOX_API_KEY=<<hier je Mapbox API-sleutel invullen>>
VITE_API_PREFIX=<<hier de URL van de server invullen zonder https://, bijvoorbeeld: localhost:37770>>
```

Zorg ervoor dat je de **Mapbox API-sleutel** en de **server-URL** (zoals `localhost:37770` voor lokale ontwikkeling) invult, anders werkt de applicatie niet. De Mapbox API Key kan je genereren door een account aan te maken op Mapbox, de stappen te volgen en de token te kopiëren.

### 3. Installeer de benodigde libraries

Voordat je de applicatie kunt draaien, moet je de benodigde libraries installeren. Dit doe je door de volgende opdracht in te voeren:

```sh
pnpm install
```

### 4. Start de ontwikkelserver

Als de installatie klaar is, kun je de applicatie starten. Voer de volgende opdracht uit om de ontwikkelserver te starten:

```sh
pnpm dev
```

De applicatie zou nu draaien. Je kunt de applicatie in je browser openen door naar **http://localhost:3000** (of de poort die je hebt ingesteld) te gaan.

### 5. Bouw de applicatie voor productie

Als je de applicatie wilt klaarmaken voor productie, gebruik dan de onderstaande opdracht. Dit genereert de juiste bestanden voor een productieomgeving:

```sh
pnpm build
```

### 6. Voer tests uit

Als je de tests van de applicatie wilt uitvoeren om te controleren of alles goed werkt, kun je dit doen met de volgende opdracht:

```sh
pnpm test
```

### 7. Lint de code

Om ervoor te zorgen dat de code voldoet aan de kwaliteitsnormen, kun je de **ESLint**-tool gebruiken. Dit controleert de code op eventuele fouten of inconsistenties.

Voer de volgende opdracht uit om de linting te laten draaien:

```sh
pnpm lint
```

---

## Samenvatting

1. **Clone de repository** met het `git clone` commando.
2. **Voeg een .env-bestand toe** met je API-sleutels en de server-URL.
3. Installeer de benodigde **libraries** met `pnpm install`.
4. Start de applicatie in de **ontwikkelmodus** met `pnpm dev`.
5. Als je klaar bent voor productie, bouw dan de applicatie met `pnpm build`.
6. Voer de **tests** uit met `pnpm test`.
7. Gebruik **ESLint** om de code te controleren met `pnpm lint`.

---
