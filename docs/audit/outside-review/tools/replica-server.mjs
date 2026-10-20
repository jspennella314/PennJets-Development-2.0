// Local replica of the deployed site (gh-pages tree) + stub of the CRM public API
// answered from the repo's own build caches, exactly as scripts/prerender.mjs does.
import https from 'node:https'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const S = process.env.S; const DIST = path.join(S, 'deployed'); const REPO = '/home/user/pennjets-development-2.0';
const posts = JSON.parse(fs.readFileSync(path.join(REPO,'scripts/crm-posts.cache.json'),'utf8'));
const articles = JSON.parse(fs.readFileSync(path.join(REPO,'scripts/crm-articles.cache.json'),'utf8'));
const extraPosts = JSON.parse(fs.readFileSync(path.join(S,'srv','extra-posts.json'),'utf8')); posts.push(...extraPosts); Object.assign(articles, JSON.parse(fs.readFileSync(path.join(S,'srv','extra-articles.json'),'utf8')));
let inventory = JSON.parse(fs.readFileSync(path.join(REPO,'scripts/crm-inventory.cache.json'),'utf8'));
const LOG = path.join(S,'srv','requests.log');
const mime = {html:'text/html; charset=utf-8',js:'text/javascript',css:'text/css',json:'application/json',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',mp4:'video/mp4',woff2:'font/woff2',svg:'image/svg+xml',xml:'application/xml',txt:'text/plain',ico:'image/x-icon'};
function cors(res){res.setHeader('Access-Control-Allow-Origin','https://www.pennjets.com');res.setHeader('Access-Control-Allow-Headers','content-type');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');}
function send(res,code,body,type='application/json'){res.writeHead(code,{'content-type':type});res.end(body);}
function handler(req,res){
  const host=(req.headers.host||'').split(':')[0]; const u=new URL(req.url,'https://'+host);
  if(host==='www.pennforce.pennjets.com'){
    cors(res); if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
    let body='';req.on('data',c=>body+=c);req.on('end',()=>{
      fs.appendFileSync(LOG, JSON.stringify({t:new Date().toISOString(),m:req.method,u:u.pathname+u.search,body:body.slice(0,4000)})+'\n');
      const p=u.pathname;
      if(p==='/api/public/blog'){const limit=Number(u.searchParams.get('limit')||10),offset=Number(u.searchParams.get('offset')||0);const sorted=[...posts].sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));return send(res,200,JSON.stringify({posts:sorted.slice(offset,offset+limit),pagination:{total:posts.length,limit,offset,hasMore:offset+limit<posts.length}}));}
      let m=p.match(/^\/api\/public\/blog\/([^/]+)\/view$/); if(m) return send(res,200,JSON.stringify({ok:true}));
      m=p.match(/^\/api\/public\/blog\/([^/]+)$/); if(m){const slug=decodeURIComponent(m[1]);const meta=posts.find(x=>x.slug===slug);const a=articles[slug];if(!meta)return send(res,404,'{"error":"not found"}');const b=a?.body; return send(res,200,JSON.stringify(b&&typeof b==='object'?b:{...meta,content:b??'',contentHtml:b??''}));}
      if(p==='/api/public/inventory') return send(res,200,JSON.stringify({listings:inventory}));
      m=p.match(/^\/api\/webhooks\/incoming\/([^/]+)$/); if(m) return send(res,200,JSON.stringify({success:true,id:'stub-'+Date.now(),message:'stubbed locally; nothing reached the CRM'}));
      return send(res,404,'{"error":"stub: unknown route '+p+'"}');
    }); return;
  }
  if(host==='pennjets.com'){res.writeHead(301,{location:'https://www.pennjets.com'+req.url});return res.end();}
  // GitHub Pages semantics
  let p=decodeURIComponent(u.pathname); if(p.endsWith('/')&&p!=='/')p=p.slice(0,-1);
  let f=path.join(DIST,p==='/'?'index.html':p);
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory()){ if(fs.existsSync(path.join(f,'index.html'))) f=path.join(f,'index.html'); else if(fs.existsSync(f+'.html')) f=f+'.html'; }
  if(!fs.existsSync(f)&&fs.existsSync(f+'.html')) f=f+'.html';
  if(!fs.existsSync(f)){ f=path.join(DIST,'404.html'); const b=fs.readFileSync(f); res.writeHead(404,{'content-type':'text/html; charset=utf-8'}); return res.end(b);}
  const ext=path.extname(f).slice(1).toLowerCase(); const st=fs.statSync(f);
  const h={'content-type':mime[ext]||'application/octet-stream','content-length':st.size,'cache-control':'max-age=600'};
  if(ext==='mp4'&&req.headers.range){const [s,e]=req.headers.range.replace('bytes=','').split('-').map(Number);const end=e||st.size-1;res.writeHead(206,{...h,'content-range':`bytes ${s}-${end}/${st.size}`,'content-length':end-s+1,'accept-ranges':'bytes'});return fs.createReadStream(f,{start:s,end}).pipe(res);}
  res.writeHead(200,h); fs.createReadStream(f).pipe(res);
}
https.createServer({key:fs.readFileSync(path.join(S,'srv/key.pem')),cert:fs.readFileSync(path.join(S,'srv/cert.pem'))},handler).listen(443,()=>console.log('https :443'));
http.createServer((req,res)=>{res.writeHead(301,{location:'https://'+(req.headers.host||'www.pennjets.com').split(':')[0]+req.url});res.end();}).listen(80,()=>console.log('http :80'));
