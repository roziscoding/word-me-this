import fs from 'fs';
import pluralize from 'pluralize';

const wordsData = JSON.parse(fs.readFileSync(
  './node_modules/an-array-of-english-words/index.json'
));

const fiveLetterWords = wordsData
  .filter(w => w.length === 5 && /^[a-z]+$/.test(w))
  .sort();

// Load common words
const commonWordsRaw = fs.readFileSync(
  './src/lib/common-words.txt',
  'utf-8'
);
const rankMap = new Map();
const top = commonWordsRaw.split('\n').map(w => w.trim()).filter(Boolean);
for (let i = 0; i < top.length; i++) {
  const w = top[i].toLowerCase();
  if (w.length === 5 && /^[a-z]+$/.test(w) && !rankMap.has(w)) {
    rankMap.set(w, i + 1);
  }
}
const TOTAL = top.length;

function commonnessMultiplier(word) {
  const rank = rankMap.get(word);
  if (rank === undefined) return 0.3;
  return 0.5 + 0.5 * (1 - Math.log10(rank) / Math.log10(TOTAL));
}

const PLURAL_PENALTY = 0.75;

function adjust(word, score) {
  let s = score * commonnessMultiplier(word);
  if (pluralize.isPlural(word)) s *= PLURAL_PENALTY;
  return s;
}

// Calculate position and letter frequencies
const posFreq = [{}, {}, {}, {}, {}];
const globalFreq = {};

for (const word of fiveLetterWords) {
  const seen = new Set();
  for (let i = 0; i < 5; i++) {
    const c = word[i];
    posFreq[i][c] = (posFreq[i][c] ?? 0) + 1;
    if (!seen.has(c)) {
      globalFreq[c] = (globalFreq[c] ?? 0) + 1;
      seen.add(c);
    }
  }
}

// Score with multiplier
const scores = fiveLetterWords.map(word => {
  const seen = new Set();
  let score = 0;
  for (let i = 0; i < 5; i++) {
    const c = word[i];
    score += posFreq[i][c] ?? 0;
    if (!seen.has(c)) {
      score += (globalFreq[c] ?? 0) * 0.5;
      seen.add(c);
    }
  }
  const adjustedScore = adjust(word, score);
  return { word, score, adjustedScore };
}).sort((a, b) => b.adjustedScore - a.adjustedScore);

console.log('\nTop 20 words with commonness multiplier applied:');
scores.slice(0, 20).forEach((item, i) => {
  const cm = commonnessMultiplier(item.word);
  const isPlural = pluralize.isPlural(item.word);
  console.log(`${i + 1}. ${item.word}: ${item.adjustedScore.toFixed(2)} (freq: ${item.score.toFixed(2)}, mult: ${cm.toFixed(2)}${isPlural ? ', PLURAL' : ''})`);
});

// Find slate
const slateEntry = scores.find(s => s.word === 'slate');
const slateIndex = scores.findIndex(s => s.word === 'slate');
console.log(`\n"slate" is at position ${slateIndex + 1} with adjusted score ${slateEntry.adjustedScore.toFixed(2)}`);
console.log(`Commonness multiplier for "slate": ${commonnessMultiplier('slate').toFixed(2)}`);
