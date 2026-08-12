// Statiska TTF-instanser av Geist (samma typsnitt som appen) för PDF-exporten
// — jsPDF kan bädda in TTF men inte woff2-varianterna från @fontsource.
// Egen modul så att pdf-export kan ladda den dynamiskt och falla tillbaka på
// Helvetica i miljöer där ?url-imports inte finns (t.ex. tester i Node).
import geistRegularUrl from "../assets/fonts/Geist-Regular.ttf?url";
import geistBoldUrl from "../assets/fonts/Geist-Bold.ttf?url";

export { geistRegularUrl, geistBoldUrl };
