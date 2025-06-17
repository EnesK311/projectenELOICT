
## Backend Setup Guide

### Benodigde omgevingsvariabelen

Om het backend-project goed te laten draaien, moet je de volgende omgevingsvariabelen instellen in een **.env** bestand in de hoofdmap van het project. Dit bestand moet de volgende inhoud bevatten:

```sh
CONNECTION_STRING=<<Vul hier de connection string naar de database in, bv: "Server=localhost;Database=FacilityConnect;User Id=admin;Password=Azerty123;">>
CLOUDINARY_URL=cloudinary://<jouw Cloudinary API Key>:<Jouw Cloudinary API Secret>@<<jouw project>>
EMAIL_URL=<<Vul hier de URL van de frontend, bv. http://localhost:5173>>
MAPBOX_API_KEY=<<Vul hier de API Key in vanan Mapbox>>
SENDGRID_API_KEY=<<Vul hier de API Key in van Sendgrid>>
```

Zorg ervoor dat je de waarden van de omgevingsvariabelen invult met de juiste gegevens om de applicatie goed te kunnen laten werken. API Keys kan je aanmaken door naar de website van de service (Mapbox, Sendgrid, Cloudinary) te gaan, een account te maken en instructies volgen om een API Key te genereren.

### Clone het project

```sh
git clone https://gitlab.com/ikdoeict/vakken/opo_agile_team_project/projecten/2425/2425_atp_duurzaamfm/backend/cense-api.git
```

### Het project openen in Visual Studio

1. Open **Visual Studio**.
2. Klik op **Open Project** en selecteer de map waarin je het project hebt gekloond.
3. Visual Studio zal het project openen en de benodigde afhankelijkheden automatisch herstellen (indien nodig).

### Dockerfile uitvoeren

Om het project met Docker te draaien, kun je eenvoudig de **Dockerfile** gebruiken. Volg deze stappen:

1. Zorg ervoor dat Docker is geïnstalleerd en draaiend is op je systeem.
2. Klik op de groene knop in Visual Studio die het project start. Dit zal de Docker-container opzetten en het project uitvoeren in de container. Zorg ervoor dat de groene knop op 'Container (dockerfile)' staat, anders zal de dockerfile niet opgezet worden en de backend opgezet worden.
3. Eenmaal je de dockerfile gerunned heb, zou nu een URL geopend moeten worden op je browser met alle Swagger documentatie van alle beschikbare API endpoints.

### Tests uitvoeren

Om de tests uit te voeren binnen Visual Studio:

1. Klik op het **Test**-tabblad bovenaan.
2. Selecteer **Run All Tests** of gebruik de sneltoets **Ctrl+R, A** om alle tests in één keer uit te voeren.

Zorg ervoor dat alle tests succesvol zijn uitgevoerd om te controleren of alles goed werkt.

---