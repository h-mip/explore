import type { Locale } from "../utils/urls";

export type PolicyKind = "legal" | "privacy" | "accessibility";

export const policyContent = {
  en: {
    draft: "Draft for project and legal review before publication",
    contact: "For questions or corrections, contact the project through the H-MIP website.",
    legal: {
      title: "Legal notice", intro: "H-MIP Explore is a public research website about human–mosquito interaction in Catalonia.",
      sections: [
        { title: "Publisher", body: "The project is associated with Universitat Pompeu Fabra (UPF) and CEAB-CSIC. The legal publisher, address and designated contact for this site must be confirmed by the project before launch." },
        { title: "Research information", body: "The site presents research data and draft model estimates. It is not medical or public-health advice. Scientific wording, methods and source attribution require project review." },
        { title: "Rights and reuse", body: "Site source code is licensed under GPL-3.0-only. That code license does not automatically apply to research datasets, administrative boundaries, map tiles, logos or third-party materials. Check each item's own license and attribution before reuse." },
        { title: "Map credits", body: "Basemap tiles and data: © OpenStreetMap contributors. Administrative boundaries: ICGC. Model estimates: H-MIP draft 2025 run. The map itself shows its attributions." },
      ],
    },
    privacy: {
      title: "Privacy information", intro: "This is a static information site. This draft explains the data flows visible in the current code; the final notice depends on the confirmed hosting and project controller.",
      sections: [
        { title: "Hosting", body: "If this site is served by GitHub Pages, GitHub says it logs visitor IP addresses for security when a Pages site is visited. The final hosting arrangement and controller details need confirmation before publication." },
        { title: "Interactive map", body: "Opening the map requests visible map tiles from OpenStreetMap servers. Those requests disclose the visitor's IP address and requested tile coordinates, which indicate the map area viewed. OpenStreetMap's own privacy policy governs its services." },
        { title: "This site's code", body: "The current site does not include an account, contact form or first-party analytics script. We do not claim that hosts or external services set no cookies or retain no logs. Following an external link is subject to that destination's policies." },
        { title: "Further information", body: "The responsible data controller, contact details, retention periods and rights-request procedure must be confirmed by H-MIP before this draft becomes a final privacy notice." },
      ],
    },
    accessibility: {
      title: "Accessibility statement", intro: "H-MIP Explore aims to meet WCAG 2.2 AA. This is a target, not a claim of audited conformance.",
      sections: [
        { title: "Available alternatives", body: "The map has a searchable, sortable municipality table and a textual selection panel. Time and activity charts include data tables. The site supports keyboard navigation and visible focus states." },
        { title: "Review status", body: "A complete independent accessibility audit has not yet been recorded. Browser, screen-reader and touch checks remain part of pre-release review. Any issues found should be documented and fixed before a formal conformance statement is published." },
        { title: "Feedback", body: "If a page or interaction is difficult to use, contact H-MIP through its project website and include the page and issue. A designated accessibility contact and response process require project confirmation." },
      ],
    },
  },
  es: {
    draft: "Borrador pendiente de revisión por el proyecto y asesoría jurídica antes de su publicación",
    contact: "Para preguntas o correcciones, contacta con el proyecto a través del sitio web de H-MIP.",
    legal: {
      title: "Aviso legal", intro: "H-MIP Explora es un sitio público de investigación sobre la interacción entre personas y mosquitos en Cataluña.",
      sections: [
        { title: "Entidad editora", body: "El proyecto está vinculado a la Universitat Pompeu Fabra (UPF) y CEAB-CSIC. El titular legal, la dirección y el contacto designado de este sitio deben ser confirmados por el proyecto antes del lanzamiento." },
        { title: "Información científica", body: "El sitio presenta datos de investigación y estimaciones provisionales de un modelo. No ofrece asesoramiento médico ni de salud pública. La redacción científica, los métodos y las atribuciones requieren revisión del proyecto." },
        { title: "Derechos y reutilización", body: "El código fuente del sitio se publica bajo GPL-3.0-only. Esa licencia del código no se aplica automáticamente a los conjuntos de datos, los límites administrativos, las teselas, los logotipos ni los materiales de terceros. Consulta la licencia y atribución de cada elemento antes de reutilizarlo." },
        { title: "Créditos del mapa", body: "Teselas y datos del mapa base: © colaboradores de OpenStreetMap. Límites administrativos: ICGC. Estimaciones del modelo: versión provisional de H-MIP de 2025. El mapa muestra sus atribuciones." },
      ],
    },
    privacy: {
      title: "Información de privacidad", intro: "Este es un sitio informativo estático. Este borrador explica los flujos de datos visibles en el código actual; el aviso definitivo depende del alojamiento y del responsable confirmados.",
      sections: [
        { title: "Alojamiento", body: "Si el sitio se sirve mediante GitHub Pages, GitHub indica que registra las direcciones IP de los visitantes por motivos de seguridad. El alojamiento final y los datos del responsable deben confirmarse antes de la publicación." },
        { title: "Mapa interactivo", body: "Al abrir el mapa se solicitan teselas de la zona visible a servidores de OpenStreetMap. Esas solicitudes revelan la dirección IP del visitante y las coordenadas de las teselas, que indican la zona consultada. Los servicios de OpenStreetMap se rigen por su propia política de privacidad." },
        { title: "Código de este sitio", body: "El sitio actual no incluye cuentas, formularios de contacto ni scripts propios de analítica. No afirmamos que el alojamiento o los servicios externos no utilicen cookies ni conserven registros. Los enlaces externos están sujetos a las políticas del destino." },
        { title: "Información pendiente", body: "H-MIP debe confirmar el responsable del tratamiento, sus datos de contacto, los plazos de conservación y el procedimiento para ejercer derechos antes de que este borrador sea definitivo." },
      ],
    },
    accessibility: {
      title: "Declaración de accesibilidad", intro: "H-MIP Explora tiene como objetivo cumplir WCAG 2.2 AA. Es un objetivo, no una declaración de conformidad auditada.",
      sections: [
        { title: "Alternativas disponibles", body: "El mapa incluye una tabla de municipios que permite buscar y ordenar, y un panel textual de selección. Los gráficos de tiempo y actividades incluyen tablas de datos. El sitio admite navegación por teclado y estados de foco visibles." },
        { title: "Estado de la revisión", body: "Todavía no consta una auditoría independiente completa de accesibilidad. Las pruebas con navegadores, lectores de pantalla y dispositivos táctiles siguen pendientes de la revisión previa al lanzamiento. Cualquier problema detectado debe documentarse y corregirse antes de publicar una declaración formal de conformidad." },
        { title: "Comentarios", body: "Si una página o interacción resulta difícil de usar, contacta con H-MIP mediante su sitio web e indica la página y el problema. El proyecto debe confirmar un contacto de accesibilidad y un proceso de respuesta." },
      ],
    },
  },
  ca: {
    draft: "Esborrany pendent de revisió del projecte i assessorament jurídic abans de publicar-lo",
    contact: "Per a preguntes o correccions, contacta amb el projecte a través del lloc web d'H-MIP.",
    legal: {
      title: "Avís legal", intro: "H-MIP Explora és un lloc públic de recerca sobre la interacció entre persones i mosquits a Catalunya.",
      sections: [
        { title: "Entitat editora", body: "El projecte està vinculat a la Universitat Pompeu Fabra (UPF) i al CEAB-CSIC. El titular legal, l'adreça i el contacte designat d'aquest lloc han de ser confirmats pel projecte abans del llançament." },
        { title: "Informació científica", body: "El lloc presenta dades de recerca i estimacions provisionals d'un model. No ofereix assessorament mèdic ni de salut pública. La redacció científica, els mètodes i les atribucions requereixen revisió del projecte." },
        { title: "Drets i reutilització", body: "El codi font del lloc es publica sota GPL-3.0-only. Aquesta llicència del codi no s'aplica automàticament als conjunts de dades, els límits administratius, les tessel·les, els logotips ni els materials de tercers. Consulta la llicència i l'atribució de cada element abans de reutilitzar-lo." },
        { title: "Crèdits del mapa", body: "Tessel·les i dades del mapa base: © col·laboradors d'OpenStreetMap. Límits administratius: ICGC. Estimacions del model: versió provisional d'H-MIP del 2025. El mapa mostra les atribucions." },
      ],
    },
    privacy: {
      title: "Informació de privacitat", intro: "Aquest és un lloc informatiu estàtic. Aquest esborrany explica els fluxos de dades visibles al codi actual; l'avís definitiu depèn de l'allotjament i del responsable confirmats.",
      sections: [
        { title: "Allotjament", body: "Si el lloc se serveix amb GitHub Pages, GitHub indica que registra les adreces IP dels visitants per motius de seguretat. L'allotjament final i les dades del responsable s'han de confirmar abans de publicar-lo." },
        { title: "Mapa interactiu", body: "En obrir el mapa se sol·liciten tessel·les de la zona visible a servidors d'OpenStreetMap. Aquestes sol·licituds revelen l'adreça IP del visitant i les coordenades de les tessel·les, que indiquen la zona consultada. Els serveis d'OpenStreetMap es regeixen per la seva política de privacitat." },
        { title: "Codi d'aquest lloc", body: "El lloc actual no inclou comptes, formularis de contacte ni scripts propis d'analítica. No afirmem que l'allotjament o els serveis externs no facin servir galetes ni conservin registres. Els enllaços externs estan subjectes a les polítiques del destí." },
        { title: "Informació pendent", body: "H-MIP ha de confirmar el responsable del tractament, les dades de contacte, els terminis de conservació i el procediment per exercir drets abans que aquest esborrany sigui definitiu." },
      ],
    },
    accessibility: {
      title: "Declaració d'accessibilitat", intro: "H-MIP Explora té com a objectiu complir WCAG 2.2 AA. És un objectiu, no una declaració de conformitat auditada.",
      sections: [
        { title: "Alternatives disponibles", body: "El mapa inclou una taula de municipis que permet cercar i ordenar, i un panell textual de selecció. Els gràfics de temps i activitats inclouen taules de dades. El lloc admet navegació amb teclat i estats de focus visibles." },
        { title: "Estat de la revisió", body: "Encara no consta una auditoria independent completa d'accessibilitat. Les proves amb navegadors, lectors de pantalla i dispositius tàctils continuen pendents de la revisió prèvia al llançament. Cal documentar i corregir qualsevol problema detectat abans de publicar una declaració formal de conformitat." },
        { title: "Comentaris", body: "Si una pàgina o interacció és difícil d'utilitzar, contacta amb H-MIP mitjançant el seu lloc web i indica la pàgina i el problema. El projecte ha de confirmar un contacte d'accessibilitat i un procés de resposta." },
      ],
    },
  },
} satisfies Record<Locale, Record<PolicyKind, { title: string; intro: string; sections: { title: string; body: string }[] }> & { draft: string; contact: string }>;
