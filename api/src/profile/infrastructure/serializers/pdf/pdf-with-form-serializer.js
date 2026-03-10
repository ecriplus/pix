// PDFDict, PDFName, PDFNumber : types bas niveau de pdf-lib pour lire les dictionnaires PDF
import { PDFDict, PDFDocument, PDFName, PDFNumber } from 'pdf-lib';

import { FONTS, initializeFonts } from '../../../../shared/infrastructure/serializers/pdf/utils.js';
import { getDataBuffer } from '../../../../shared/infrastructure/utils/buffer.js';

// Point d'entrée : reçoit un stream (template depuis S3) et les données à injecter
export async function serializeStream(stream, entry, creationDate = new Date()) {
  // Convertit le stream en Buffer pour pouvoir le lire plusieurs fois
  const template = await getDataBuffer(stream);

  return serializePdf(template, entry, creationDate);
}

// Aiguillage : un seul élément → PDF simple, tableau → PDF multi-pages
async function serializePdf(template, entry, creationDate = new Date()) {
  if (Array.isArray(entry)) {
    return serializeArray(template, entry, creationDate);
  } else {
    return serializeObject(template, entry, creationDate);
  }
}

// Génère un PDF unique contenant une page par élève
async function serializeArray(template, entries, creationDate) {
  // Charge le template une seule fois pour extraire les positions des champs
  const templateDoc = await PDFDocument.load(template);
  // Lit dans le template l'emplacement et l'alignement de chaque champ de formulaire
  const fieldPositions = extractFieldPositions(templateDoc);

  const mergedPdf = await PDFDocument.create();
  mergedPdf.setCreationDate(creationDate);
  mergedPdf.setModificationDate(creationDate);

  // Embarque la police Roboto une seule fois dans le document final (partagée par toutes les pages)
  const { [FONTS.robotoRegular]: robotoFont } = await initializeFonts(mergedPdf, [FONTS.robotoRegular]);

  // embedPage() convertit la page du template en Form XObject (un objet PDF réutilisable)
  // Les annotations AcroForm (champs de formulaire vides) ne font PAS partie du content stream
  // → elles ne seront donc pas visibles dans le PDF généré
  const embeddedTemplate = await mergedPdf.embedPage(templateDoc.getPage(0));
  // Récupère les dimensions du template pour créer des pages de même taille
  const { width, height } = embeddedTemplate;

  for (const entry of entries) {
    // Crée une nouvelle page vierge aux dimensions du template
    const page = mergedPdf.addPage([width, height]);

    // Dessine le fond commun (image, graphismes, texte décoratif) via le Form XObject partagé
    // → le template n'est stocké qu'une seule fois dans le fichier, toutes les pages y font référence
    page.drawPage(embeddedTemplate);

    // Pour chaque champ à remplir (firstName, lastName, date…)
    for (const [fieldName, value] of entry) {
      // "filename" est une clé interne pour nommer le fichier, pas un champ PDF
      if (fieldName === 'filename') continue;
      const pos = fieldPositions.get(fieldName);
      // Ignore les champs absents du template ou sans valeur
      if (!pos || !value) continue;

      // Si la taille est définie dans le template (DA ≠ 0), on l'utilise directement
      // Sinon, on calcule la plus grande taille qui rentre dans les dimensions du champ
      const fontSize = pos.daFontSize > 0 ? pos.daFontSize : autoFontSize(value, pos.width, pos.height, robotoFont);
      // Mesure la largeur réelle du texte à cette taille (nécessaire pour le centrage horizontal)
      const textWidth = robotoFont.widthOfTextAtSize(value, fontSize);
      // Calcule x selon l'alignement du champ (gauche / centré / droite)
      const x = computeX(pos, textWidth);
      // Calcule y pour centrer verticalement le texte dans le champ
      const y = computeY(pos, fontSize, robotoFont);

      page.drawText(value, {
        x,
        y,
        size: fontSize,
        font: robotoFont,
      });
    }
  }

  const bytes = await mergedPdf.save();
  return Buffer.from(bytes);
}

// Valeurs du champ Q dans la spec PDF (quadding = alignement horizontal)
const ALIGN_LEFT = 0;
const ALIGN_CENTER = 1;
const ALIGN_RIGHT = 2;

// Lit dans le template la position, la taille de police et l'alignement de chaque champ
function extractFieldPositions(pdfDoc) {
  const form = pdfDoc.getForm();
  const positions = new Map();

  for (const field of form.getFields()) {
    const name = field.getName();
    const widgets = field.acroField.getWidgets();
    // Un champ sans widget n'a pas de représentation visuelle sur la page
    if (widgets.length === 0) continue;

    // getRectangle() retourne {x, y, width, height} dans le repère de la page (origine bas-gauche)
    const rect = widgets[0].getRectangle();
    // Lit la taille de police depuis la Default Appearance string du champ (peut être 0 = auto)
    const daFontSize = parseFontSizeFromDA(field);
    // Lit l'alignement horizontal en remontant la hiérarchie des champs
    const align = parseAlignFromQ(field);

    positions.set(name, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, daFontSize, align });
  }

  return positions;
}

// Calcule la position x du texte selon l'alignement du champ
function computeX(pos, textWidth) {
  // Centré : décale de (largeur_champ - largeur_texte) / 2 depuis le bord gauche du champ
  if (pos.align === ALIGN_CENTER) return pos.x + (pos.width - textWidth) / 2;
  // Droite : colle le texte au bord droit avec un petit padding
  if (pos.align === ALIGN_RIGHT) return pos.x + pos.width - textWidth - 2;
  // Gauche (défaut) : colle au bord gauche avec un petit padding
  return pos.x + 2;
}

// Calcule la position y (baseline du texte) pour centrer verticalement dans le champ
function computeY(pos, fontSize, font) {
  // heightAtSize({ descender: false }) retourne la hauteur des capitales (cap height)
  // qui correspond à la hauteur visuelle des majuscules, sans les jambages descendants
  const capHeight = font.heightAtSize(fontSize, { descender: false });
  // On centre le cap height dans la hauteur du champ :
  //   baseline = bas_du_champ + (hauteur_champ - cap_height) / 2
  // → le centre visuel du texte tombe exactement au centre du champ
  return pos.y + (pos.height - capHeight) / 2;
}

// Lit l'alignement Q en remontant la chaîne de parents du champ
// Q est un attribut héritable : il peut être défini sur un champ parent plutôt que sur le champ lui-même
function parseAlignFromQ(field) {
  let node = field.acroField.dict;
  while (node instanceof PDFDict) {
    // lookup() résout les références indirectes PDF (contrairement à get() qui retourne la ref brute)
    const q = node.lookup(PDFName.of('Q'));
    if (q instanceof PDFNumber) return q.asNumber();
    // Remonte au champ parent s'il existe
    const parent = node.lookup(PDFName.of('Parent'));
    if (!(parent instanceof PDFDict)) break;
    node = parent;
  }
  // Par défaut : alignement gauche (valeur 0 selon la spec PDF)
  return ALIGN_LEFT;
}

// Calcule la plus grande taille de police qui rentre dans les dimensions du champ
function autoFontSize(text, fieldWidth, fieldHeight, font) {
  const PADDING = 4;
  // Descend depuis 24pt jusqu'à 6pt par pas de 0.5
  for (let size = 24; size >= 6; size -= 0.5) {
    const textWidth = font.widthOfTextAtSize(text, size);
    // heightAtSize() sans option retourne ascendants + descendants (hauteur totale de la ligne)
    const textHeight = font.heightAtSize(size);
    // Vérifie que le texte rentre en largeur ET en hauteur dans le champ (avec padding)
    if (textWidth <= fieldWidth - PADDING && textHeight <= fieldHeight - PADDING) return size;
  }
  return 6;
}

// Lit la taille de police depuis la Default Appearance string (DA) du champ
// La DA est une chaîne PDF du type "/FontName 12 Tf 0 g" (nom police, taille, opérateur, couleur)
function parseFontSizeFromDA(field) {
  try {
    const da = field.acroField.DA?.();
    if (typeof da === 'string') {
      // Extrait le nombre qui précède "Tf" (ex: "12 Tf" → 12, "0 Tf" → 0 pour auto-size)
      const match = da.match(/(\d+(?:\.\d+)?)\s+Tf/);
      if (match) return parseFloat(match[1]);
    }
  } catch {
    // Certains champs n'ont pas de DA (hérité du parent ou absent)
  }
  return null;
}

// Génère un PDF simple pour une seule attestation (téléchargement individuel)
// Utilise l'API AcroForm de pdf-lib : remplit les champs et reconstruit les apparences
async function serializeObject(template, entry, creationDate) {
  const pdf = await PDFDocument.load(template);
  const { [FONTS.robotoRegular]: embeddedRobotoFont } = await initializeFonts(pdf, [FONTS.robotoRegular]);

  pdf.setCreationDate(creationDate);
  pdf.setModificationDate(creationDate);

  const form = pdf.getForm();
  for (const [fieldName, value] of entry) {
    if (fieldName === 'filename') continue;
    const field = form.getTextField(fieldName);
    field.setText(value);
    // Rend le champ non-modifiable dans le PDF final
    field.enableReadOnly();
  }

  // Reconstruit les apparences visuelles de tous les champs avec la police Roboto
  form.updateFieldAppearances(embeddedRobotoFont);

  const bytes = await pdf.save({
    // false = format xref classique (PDF 1.4), compatibilité maximale avec les vieux lecteurs
    useObjectStreams: false,
  });

  return Buffer.from(bytes);
}
