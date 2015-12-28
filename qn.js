
var wls = window.localStorage,
    atag,
    anote;

function byId(id)          { return document.getElementById(id); }

function usort(arr)        { return arr.reduce((a, x) => ~a.indexOf(x) ? a : a.concat(x), []).sort(); }
function seq2(j,k)         { return Array.apply(null, Array((k - j) + 1)).map(function(discard, n){ return n + j; }); }
function seq(j)            { return seq2(0, j-1); }

function set_key(key,v)    { return wls.setItem(key, JSON.stringify(v)); }
function get_key(key)      { return JSON.parse(wls.getItem(key)); }
function list_keys()       { return seq(wls.length).map(i => wls.key(i)); }

function note_name(ts)     { return 'note:' + ts.toString(); }
function set_note(ts,t)    { return set_key(note_name(ts), t); }
function get_note(ts)      { return get_key(note_name(ts)); }
function add_note(t)       { var ts = Date.now().toString(); set_note(ts, t); return ts; }
function del_note(t)       { window.alert(`todo: del ${t}`); }
function list_notes()      { return list_keys().filter(k => k.substring(0,5) === "note:").map(k => parseInt(k.substring(5), 10)) }

function tag_name(ts)      { return 'tag:' + ts.toString(); }
function get_tag(tag)      { return get_key(tag_name(tag)) || []; }
function set_tag(tag,a)    { return set_key(tag_name(tag), a); }
function add_tag(tag,n)    { set_tag(tag, get_tag(tag).concat([n])); }
function del_tag(tag,n)    { window.alert(`todo: del tag ${tag} from ${n}`); }
function list_tags()       { return list_keys().filter(k => k.substring(0,4) === "tag:").map(k => k.substring(4)); }



function sl(ts)            { return make_note_link(ts); }
function slia(t)           { return atag === t? '<div class="slia">'+(get_tag(t).map(ts => sl(ts)).join('')+'</div>') : ''; }
function make_note_del(t)  { return `<a class="del" onclick="del_note(${t});">⨷</a>`; }
function make_note_b_ln(t) { return `<a class="note" onclick="anote = (anote === ${t})? '' : ${t}; byId('editor').value = '${get_note(t)}'; redraw();">${get_note(t)}</a>`; }
function make_note_link(t) { return `<div class="item">${make_note_del(t)} ${make_note_b_ln(t)}</div>`; }
function make_notelist()   { return list_notes().map(t => make_note_link(t)).join(''); }
function make_tag_link(t)  { return `<div class="item"><a class="tag" onclick="atag = (atag === '${t}')? '' : '${t}'; redraw();">${t}</a></div>${slia(t)}`; }
function make_taglist()    { return list_tags().map(t => make_tag_link(t)).join(''); }



function tags_from(t)      { return usort(t.match(/\#\S+/g) || []); }
function add_from(ts,txt)  { tags_from(txt).map(tag => add_tag(tag, ts)); }

function clear_editor()    { byId('editor').value = ''; }
function redraw_tags()     { byId('taglist_div').innerHTML = make_taglist(); }
function redraw_notes()    { byId('notelist_div').innerHTML = make_notelist(); }
function redraw()          { redraw_tags(); redraw_notes(); }

function store(text)       { add_from(add_note(text), text); redraw(); }





function boot() {
  byId('editorAdd').onclick = function() { store(byId('editor').value); }
  redraw();
}

window.onload = boot;
