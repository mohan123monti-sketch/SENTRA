const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'frontend/src/components/counsellor/CounsellorPortal.tsx');
let c = fs.readFileSync(p, 'utf8');

const statGridMatch = '<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">';
const statGridRepl = '<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">';

const statCardMatch = '<div className="glass-card p-4 rounded-xl flex items-center gap-4 relative overflow-hidden">';
const statCardRepl = '<div className="glass-card bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl flex items-center gap-5 relative overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl duration-300 group cursor-default">';

const listCardMatch = '<div className="glass-card rounded-xl p-4 md:p-6">';
const listCardRepl = '<div className="glass-card bg-white/80 dark:bg-slate-900/80 rounded-2xl p-5 md:p-7 shadow-lg border border-white/40 dark:border-slate-700/40">';

c = c.replace(statGridMatch, statGridRepl);
c = c.split(statCardMatch).join(statCardRepl);
c = c.split(listCardMatch).join(listCardRepl);

fs.writeFileSync(p, c);
console.log('Counsellor UI upgraded');
