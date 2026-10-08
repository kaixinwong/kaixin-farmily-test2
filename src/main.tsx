import { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, Camera, CheckCircle2, ChevronRight, Heart, Leaf, Sparkles, UploadCloud, X } from 'lucide-react';
import './styles.css';

type Step = 'photo' | 'details' | 'story' | 'packaging' | 'design' | 'preview' | 'published';

const stepMeta: Record<Step, { title: string; label: string; progress: number }> = {
  photo: { title: 'Add Product', label: 'Add photos', progress: 15 },
  details: { title: 'Product Details', label: 'Product details', progress: 28 },
  story: { title: 'Tell Us More', label: 'Tell us more', progress: 45 },
  packaging: { title: 'Settle title', label: 'Product packaging', progress: 64 },
  design: { title: 'Settle title', label: 'Your packaging', progress: 82 },
  preview: { title: 'Settle title', label: 'Product listing', progress: 100 },
  published: { title: 'Your Listing', label: 'Published', progress: 100 }
};
const stageOrder: Step[] = ['photo','details','story','packaging','design','preview','published'];
const asset = (name: string) => `/images/${name}.svg`;

function App() {
  const [step, setStep] = useState<Step>('photo');
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [details, setDetails] = useState({category:'Daily',name:'Heirloom Tomatoes',ingredients:'Heirloom tomatoes',allergens:'None declared',quantity:'1 lb',price:'4.50'});
  const [story, setStory] = useState('Heirloom tomatoes from Green Valley Farm. Freshly picked and great for salads.');
  const [mode, setMode] = useState<'original'|'enhanced'>('enhanced');
  const [packaging, setPackaging] = useState<'original'|'enhanced'>('enhanced');
  const [choice, setChoice] = useState<'create'|'upload'>('create');
  const [prompt, setPrompt] = useState('');
  const [checked, setChecked] = useState(false);
  const [modal, setModal] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const image = uploaded || asset('tomatoes');
  const meta = stepMeta[step];
  const index = stageOrder.indexOf(step);
  const go = (next: Step) => { setStep(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const back = () => index > 0 && go(stageOrder[index - 1]);
  const field = (key: keyof typeof details, value: string) => setDetails(v => ({ ...v, [key]: value }));

  const productCard = useMemo(() => (
    <section className="listing-card">
      <div className="listing-top"><span>Farmily</span><Heart size={18}/></div>
      <img src={image} className="listing-photo" alt="" />
      <h2>{details.name}</h2><p className="muted">Green Valley Farm</p><h3>${details.price} / {details.quantity}</h3>
      <p>Freshly picked. Great for salads.</p><hr/><h4>Product information</h4>
      <div className="kv"><span>Quantity</span><b>{details.quantity}</b><span>Ingredients</span><b>{details.ingredients}</b><span>Allergens</span><b>{details.allergens}</b></div>
      <hr/><h4>Packaging</h4><img src={asset('packing')} className="listing-image" alt="" /><p className="small muted">Your produce, your way.</p>
      <hr/><h4>The story behind your tomatoes</h4><p>{story}</p><img src={asset('farm')} className="listing-image" alt="" />
      <hr/><h4>From picking to packing</h4><div className="grid2"><img src={asset('harvest')} alt="" /><img src={asset('packing')} alt="" /></div>
      <hr/><h4>Meet your farmer</h4><div className="farmer"><img src={asset('farm')} alt="" /><div><b>Green Valley Farm</b><small>View farm profile →</small></div></div>
    </section>
  ), [details, image, story]);

  const Footer = ({primary,onPrimary,secondary,onSecondary}:{primary:string;onPrimary:()=>void;secondary?:string;onSecondary?:()=>void}) => (
    <div className="footer">{secondary && <button className="btn outline" onClick={onSecondary}>{secondary}</button>}<button className="btn primary" onClick={onPrimary}>{primary}</button></div>
  );

  return <div className="shell">
    <aside className="desk">
      <div className="brand"><span><Leaf size={24}/></span>farmily<strong>.</strong></div>
      <div className="eyebrow">LOCAL INTERACTIVE PROTOTYPE</div><h2>From your farm<br/>to their table.</h2>
      <p>Walk through the product listing experience, from product photos and farm stories to AI-assisted packaging and publishing.</p>
      <div className="steps">{[['photo','Add product'],['story','Tell us more'],['packaging','Design packaging'],['preview','Preview listing'],['published','Publish']].map(([k,l],i)=><button key={k} className={step===k?'active':''} onClick={()=>go(k as Step)}><span>{i+1}</span>{l}<ChevronRight size={15}/></button>)}</div>
    </aside>

    <div className="phone">
      <div className="status"><span>9:41</span><i></i><span>▰ ◇ ▰</span></div>
      <header><button className="icon" onClick={back} disabled={step==='photo'}><ArrowLeft size={18}/></button><h1>{meta.title}</h1><span className="icon ghost"></span></header>
      <div className="progress"><div>{meta.label} · Step {Math.min(index+1,5)} of 5</div><span><i style={{width:meta.progress+'%'}}></i></span></div>
      <main>
        {step==='photo' && <><div className="upload" onClick={()=>input.current?.click()}>{uploaded?<img src={uploaded} alt="" />:<><span><Camera size={26}/></span><p>Take a clear photo of your product and its packaging</p></>}</div><input ref={input} hidden type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)setUploaded(URL.createObjectURL(f));}}/><div className="grid2"><button className="btn outline" onClick={()=>input.current?.click()}>Take a photo</button><button className="btn outline" onClick={()=>input.current?.click()}>Upload a photo</button></div><div className="ai gold"><b>✦ Farmily AI</b><span>We'll read your photo and fill in the details.</span></div><Footer primary="Continue" onPrimary={()=>go('details')}/></>}

        {step==='details' && <><div className="identity"><img src={image} alt="" /><div><b>Green Valley Farm</b><small>Check and edit your product information.</small></div></div><div className="form">{Object.entries({category:'CATEGORY',name:'PRODUCT NAME',ingredients:'INGREDIENTS',allergens:'ALLERGENS',quantity:'QUANTITY',price:'PRICE ($)'}).map(([key,label])=><label key={key}>{label}<input value={details[key as keyof typeof details]} onChange={e=>field(key as keyof typeof details,e.target.value)}/></label>)}</div><label className="check"><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/><span>I've checked ingredients and allergens.<small>All product information should be accurate.</small></span></label><Footer primary="Continue" onPrimary={()=>go('story')}/></>}

        {step==='story' && <><div className="optional">Optional</div><section className="card"><h2>Your story</h2><textarea value={story} onChange={e=>setStory(e.target.value)} rows={5}/><button className="btn gold-btn" onClick={()=>setStory('Two generations of growers at Green Valley Farm bring you these colourful heirloom tomatoes, picked fresh from our fields and grown with care for your table.')}><Sparkles size={14}/> Polish with AI</button></section><section className="card"><h2>Photos</h2><h3>Personal / Team Photos</h3><p className="small muted">Show the people behind the farm</p><img src={asset('farm')} className="cover" alt="" /><div className="grid2"><button className="btn outline">Add/Replace Photo</button><button className="btn gold-btn" onClick={()=>setModal(true)}>Enhance with AI</button></div><h3>Production / Process Photos</h3><p className="small muted">Show how your produce is made</p><div className="grid2"><img src={asset('harvest')} alt="" /><img src={asset('packing')} alt="" /></div></section><Footer primary="Continue" onPrimary={()=>go('packaging')} secondary="Skip" onSecondary={()=>go('packaging')}/></>}

        {step==='packaging' && <><div className="ai light"><b>✦ AI Recommended</b><span>Based on your product and story, we recommend this structure.</span></div><div className="subhead">PACKAGING</div><div className="choice" onClick={()=>setChoice('upload')}><div className="choice-head"><UploadCloud size={20}/><span className={choice==='upload'?'selected-dot':''}></span></div><h2>Use existing packaging</h2><p>Upload your packaging design and improve it while keeping the original.</p></div><div className={'choice '+(choice==='create'?'selected':'')} onClick={()=>setChoice('create')}><div className="choice-head"><Leaf size={20}/><span className="selected-dot"></span></div><h2>Create a new design</h2><p>Create packaging based on your product information and story.</p></div><div className="identity"><img src={image} alt="" /><div><b>{details.name}</b><small>Green Valley Farm · {details.quantity}</small></div></div><Footer primary="Generate Design" onPrimary={()=>go(choice==='create'?'design':'preview')} secondary="Skip packaging" onSecondary={()=>go('preview')}/></>}

        {step==='design' && <><div className="ai light"><b>✦ AI-generated</b><span>Created from your product information and story.</span></div><div className="pack"><img src={asset('packing')} alt="" /><span>✦ {mode==='enhanced'?'AI-enhanced':'Original'}</span></div><div className="toggle"><button className={packaging==='original'?'active':''} onClick={()=>setPackaging('original')}>Original</button><button className={packaging==='enhanced'?'active':''} onClick={()=>setPackaging('enhanced')}>Enhanced</button></div><div className="chips">{['Improve lighting','Clean background','Improve clarity'].map(t=><button key={t} onClick={()=>setPrompt(t)}>{t}</button>)}</div><div className="prompt"><input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Tell us what to beautify..."/><button onClick={()=>setPrompt(prompt||'Design refreshed')}><Sparkles size={15}/></button></div>{prompt&&<p className="small muted">Applied: {prompt}</p>}<Footer primary="Use this design" onPrimary={()=>go('preview')} secondary="Keep original" onSecondary={()=>setPackaging('original')}/></>}

        {step==='preview' && <><div className="ai light"><b>✦ AI Recommended</b><span>Choose what customers can see.</span></div><div className="subhead">CUSTOMER PREVIEW <span className="status-pill">Not published</span></div>{productCard}<Footer primary="Publish" onPrimary={()=>go('published')} secondary="Edit" onSecondary={()=>go('details')}/></>}

        {step==='published' && <><div className="ai success"><CheckCircle2 size={19}/><div><b>Your listing is live</b><span>Customers can now discover your product.</span></div></div><div className="subhead">CUSTOMER PREVIEW <span className="status-pill live">LIVE</span></div>{productCard}<Footer primary="View in marketplace" onPrimary={()=>go('preview')} secondary="Add another product" onSecondary={()=>{setUploaded(null);setStory('');go('photo')}}/></>}
      </main>
    </div>

    {modal&&<div className="overlay" onClick={()=>setModal(false)}><div className="sheet" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setModal(false)}><X size={18}/></button><h2><Sparkles size={18}/> Enhance with AI</h2><p className="small muted">Personal / Team Photos</p><div className="pack"><img src={asset('farm')} alt="" /></div><div className="chips">{['Improve lighting','Clean background','Improve clarity'].map(t=><button key={t} onClick={()=>setPrompt(t)}>{t}</button>)}</div><div className="prompt"><input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="How can Farmily AI help you?"/><button onClick={()=>{setMode('enhanced');setModal(false)}}><Sparkles size={15}/></button></div></div></div>}
  </div>;
}
createRoot(document.getElementById('root')!).render(<App />);
