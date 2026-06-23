import type { BibleTestament } from "@prisma/client";

export type BibleBookMeta = {
  name: string;
  abbreviation: string;
  testament: BibleTestament;
  position: number;
  aliases: string[];
};

export const BIBLE_BOOKS_META: BibleBookMeta[] = [
  { name: "Gênesis", abbreviation: "gn", testament: "OLD", position: 1, aliases: ["genesis", "gen"] },
  { name: "Êxodo", abbreviation: "ex", testament: "OLD", position: 2, aliases: ["exodo"] },
  { name: "Levítico", abbreviation: "lv", testament: "OLD", position: 3, aliases: ["levitico"] },
  { name: "Números", abbreviation: "nm", testament: "OLD", position: 4, aliases: ["numeros"] },
  { name: "Deuteronômio", abbreviation: "dt", testament: "OLD", position: 5, aliases: ["deuteronomio"] },
  { name: "Josué", abbreviation: "js", testament: "OLD", position: 6, aliases: ["josue"] },
  { name: "Juízes", abbreviation: "jz", testament: "OLD", position: 7, aliases: ["juizes"] },
  { name: "Rute", abbreviation: "rt", testament: "OLD", position: 8, aliases: ["rute"] },
  { name: "1 Samuel", abbreviation: "1sm", testament: "OLD", position: 9, aliases: ["1 samuel"] },
  { name: "2 Samuel", abbreviation: "2sm", testament: "OLD", position: 10, aliases: ["2 samuel"] },
  { name: "1 Reis", abbreviation: "1rs", testament: "OLD", position: 11, aliases: ["1 reis"] },
  { name: "2 Reis", abbreviation: "2rs", testament: "OLD", position: 12, aliases: ["2 reis"] },
  { name: "1 Crônicas", abbreviation: "1cr", testament: "OLD", position: 13, aliases: ["1 cronicas"] },
  { name: "2 Crônicas", abbreviation: "2cr", testament: "OLD", position: 14, aliases: ["2 cronicas"] },
  { name: "Esdras", abbreviation: "ed", testament: "OLD", position: 15, aliases: ["esdras"] },
  { name: "Neemias", abbreviation: "ne", testament: "OLD", position: 16, aliases: ["neemias"] },
  { name: "Ester", abbreviation: "et", testament: "OLD", position: 17, aliases: ["ester"] },
  { name: "Jó", abbreviation: "jo", testament: "OLD", position: 18, aliases: ["jo"] },
  { name: "Salmos", abbreviation: "sl", testament: "OLD", position: 19, aliases: ["salmo", "salmos", "ps"] },
  { name: "Provérbios", abbreviation: "pv", testament: "OLD", position: 20, aliases: ["proverbios"] },
  { name: "Eclesiastes", abbreviation: "ec", testament: "OLD", position: 21, aliases: ["eclesiastes"] },
  { name: "Cânticos", abbreviation: "ct", testament: "OLD", position: 22, aliases: ["canticos"] },
  { name: "Isaías", abbreviation: "is", testament: "OLD", position: 23, aliases: ["isaias"] },
  { name: "Jeremias", abbreviation: "jr", testament: "OLD", position: 24, aliases: ["jeremias"] },
  { name: "Lamentações", abbreviation: "lm", testament: "OLD", position: 25, aliases: ["lamentacoes"] },
  { name: "Ezequiel", abbreviation: "ez", testament: "OLD", position: 26, aliases: ["ezequiel"] },
  { name: "Daniel", abbreviation: "dn", testament: "OLD", position: 27, aliases: ["daniel"] },
  { name: "Oseias", abbreviation: "os", testament: "OLD", position: 28, aliases: ["oseias"] },
  { name: "Joel", abbreviation: "jl", testament: "OLD", position: 29, aliases: ["joel"] },
  { name: "Amós", abbreviation: "am", testament: "OLD", position: 30, aliases: ["amos"] },
  { name: "Obadias", abbreviation: "ob", testament: "OLD", position: 31, aliases: ["obadias"] },
  { name: "Jonas", abbreviation: "jn", testament: "OLD", position: 32, aliases: ["jonas"] },
  { name: "Miqueias", abbreviation: "mq", testament: "OLD", position: 33, aliases: ["miqueias"] },
  { name: "Naum", abbreviation: "na", testament: "OLD", position: 34, aliases: ["naum"] },
  { name: "Habacuque", abbreviation: "hc", testament: "OLD", position: 35, aliases: ["habacuque"] },
  { name: "Sofonias", abbreviation: "sf", testament: "OLD", position: 36, aliases: ["sofonias"] },
  { name: "Ageu", abbreviation: "ag", testament: "OLD", position: 37, aliases: ["ageu"] },
  { name: "Zacarias", abbreviation: "zc", testament: "OLD", position: 38, aliases: ["zacarias"] },
  { name: "Malaquias", abbreviation: "ml", testament: "OLD", position: 39, aliases: ["malaquias"] },
  { name: "Mateus", abbreviation: "mt", testament: "NEW", position: 40, aliases: ["mateus"] },
  { name: "Marcos", abbreviation: "mc", testament: "NEW", position: 41, aliases: ["marcos"] },
  { name: "Lucas", abbreviation: "lc", testament: "NEW", position: 42, aliases: ["lucas"] },
  { name: "João", abbreviation: "joao", testament: "NEW", position: 43, aliases: ["joao", "joão"] },
  { name: "Atos", abbreviation: "at", testament: "NEW", position: 44, aliases: ["atos"] },
  { name: "Romanos", abbreviation: "rm", testament: "NEW", position: 45, aliases: ["romanos"] },
  { name: "1 Coríntios", abbreviation: "1co", testament: "NEW", position: 46, aliases: ["1 corintios"] },
  { name: "2 Coríntios", abbreviation: "2co", testament: "NEW", position: 47, aliases: ["2 corintios"] },
  { name: "Gálatas", abbreviation: "gl", testament: "NEW", position: 48, aliases: ["galatas"] },
  { name: "Efésios", abbreviation: "ef", testament: "NEW", position: 49, aliases: ["efesios"] },
  { name: "Filipenses", abbreviation: "fp", testament: "NEW", position: 50, aliases: ["filipenses"] },
  { name: "Colossenses", abbreviation: "cl", testament: "NEW", position: 51, aliases: ["colossenses"] },
  { name: "1 Tessalonicenses", abbreviation: "1ts", testament: "NEW", position: 52, aliases: ["1 tessalonicenses"] },
  { name: "2 Tessalonicenses", abbreviation: "2ts", testament: "NEW", position: 53, aliases: ["2 tessalonicenses"] },
  { name: "1 Timóteo", abbreviation: "1tm", testament: "NEW", position: 54, aliases: ["1 timoteo"] },
  { name: "2 Timóteo", abbreviation: "2tm", testament: "NEW", position: 55, aliases: ["2 timoteo"] },
  { name: "Tito", abbreviation: "tt", testament: "NEW", position: 56, aliases: ["tito"] },
  { name: "Filemom", abbreviation: "fm", testament: "NEW", position: 57, aliases: ["filemom"] },
  { name: "Hebreus", abbreviation: "hb", testament: "NEW", position: 58, aliases: ["hebreus"] },
  { name: "Tiago", abbreviation: "tg", testament: "NEW", position: 59, aliases: ["tiago"] },
  { name: "1 Pedro", abbreviation: "1pe", testament: "NEW", position: 60, aliases: ["1 pedro"] },
  { name: "2 Pedro", abbreviation: "2pe", testament: "NEW", position: 61, aliases: ["2 pedro"] },
  { name: "1 João", abbreviation: "1jo", testament: "NEW", position: 62, aliases: ["1 joao", "1 joão"] },
  { name: "2 João", abbreviation: "2jo", testament: "NEW", position: 63, aliases: ["2 joao", "2 joão"] },
  { name: "3 João", abbreviation: "3jo", testament: "NEW", position: 64, aliases: ["3 joao", "3 joão"] },
  { name: "Judas", abbreviation: "jd", testament: "NEW", position: 65, aliases: ["judas"] },
  { name: "Apocalipse", abbreviation: "ap", testament: "NEW", position: 66, aliases: ["apocalipse", "rev"] },
];

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

export function findBookMetaByAbbrev(abbrev: string): BibleBookMeta | undefined {
  const n = abbrev
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  return BIBLE_BOOKS_META.find(
    (b) =>
      b.abbreviation === n ||
      b.aliases.some((a) => a.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "") === n)
  );
}

export function findBookMetaByName(name: string): BibleBookMeta | undefined {
  const n = norm(name);
  const exact = BIBLE_BOOKS_META.find((b) => norm(b.name) === n);
  if (exact) return exact;
  const byAbbrev = BIBLE_BOOKS_META.find((b) => b.abbreviation === n);
  if (byAbbrev) return byAbbrev;
  return BIBLE_BOOKS_META.find((b) =>
    b.aliases.some((a) => {
      const alias = norm(a);
      return alias === n || n.startsWith(`${alias} `);
    })
  );
}
