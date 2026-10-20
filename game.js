(function(){var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n)),u=class{constructor(){this._handlers=new Map}on(e,t){return this._handlers.has(e)||this._handlers.set(e,new Set),this._handlers.get(e).add(t),()=>this.off(e,t)}once(e,t){let n=(...r)=>{this.off(e,n),t(...r)};return this.on(e,n)}off(e,t){this._handlers.get(e)?.delete(t)}listenerCount(e){return this._handlers.get(e)?.size??0}emit(e,...t){let n=this._handlers.get(e);if(n)for(let r of[...n])try{r(...t)}catch(t){console.error(`[EventBus] handler error for "${e}"`,t)}}clear(){this._handlers.clear()}},d=Math.PI*2,f=(e,t,n)=>Math.max(t,Math.min(n,e)),p=(e,t,n)=>e+(t-e)*n,m=(e,t,n,r)=>p(e,t,1-Math.exp(-n*r));function h(e,t){return e+Math.random()*(t-e)}function g(e){if(e?.length)return e[Math.floor(Math.random()*e.length)]}function _(e,t=`PLAYER`){return String(e??``).replace(/[<>&"'`\\/\u0000-\u001f\u007f]/g,``).replace(/\s+/g,` `).trim().slice(0,12)||t}function v(e){return String(e??``).toUpperCase().replace(/[^A-Z0-9]/g,``).slice(0,4)}function y(e){return/^[A-Z0-9]{1,4}$/.test(e)}function b(e){let t=Math.max(0,Math.floor(e)),n=Math.floor(t/60),r=t%60;return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`}function x(e){return!Number.isFinite(e)||e<=0?`--`:String(Math.round(e))}function S(e=`p`){return`${e}_${Math.random().toString(36).slice(2,8)}`}function C(e,t){let n=(t-e)%d;return n>Math.PI&&(n-=d),n<-Math.PI&&(n+=d),n}function w(e,t=0,n=-1/0,r=1/0){let i=typeof e==`number`?e:Number(e);return Number.isFinite(i)?f(i,n,r):t}var T=[`#00f6ff`,`#ff2bd6`,`#a6ff4d`,`#ffc857`,`#8a5bff`,`#ff7a45`,`#4dd2ff`,`#ff5e9c`],E=`neonstrike.settings.v1`,D=Object.freeze({sensitivity:1,fov:82,volume:65,quality:`high`,showFps:!1,ambientAudio:!0});function O(e={}){return{sensitivity:f(w(e.sensitivity,D.sensitivity,.2,3),.2,3),fov:f(Math.round(w(e.fov,D.fov,65,110)),65,110),volume:f(Math.round(w(e.volume,D.volume,0,100)),0,100),quality:e.quality===`low`?`low`:`high`,showFps:!!e.showFps,ambientAudio:e.ambientAudio!==!1}}var ee=class extends u{constructor(e=typeof localStorage<`u`?localStorage:null){super(),this.storage=e,this.values={...D},this.load()}load(){if(this.storage)try{let e=this.storage.getItem(E);e&&(this.values=O({...D,...JSON.parse(e)}))}catch(e){console.warn(`[Settings] failed to load`,e)}}save(){if(this.storage)try{this.storage.setItem(E,JSON.stringify(this.values))}catch(e){console.warn(`[Settings] failed to save`,e)}}get(e){return this.values[e]}set(e,t){let n=O({...this.values,[e]:t}),r=this.values;return this.values=n,this.save(),r[e]!==n[e]&&this.emit(`change`,e,n[e],n),n[e]}patch(e){let t=O({...this.values,...e}),n=this.values;this.values=t,this.save();for(let e of Object.keys(t))n[e]!==t[e]&&this.emit(`change`,e,t[e],t);return t}reset(){this.values={...D},this.save(),this.emit(`reset`,this.values);for(let[e,t]of Object.entries(this.values))this.emit(`change`,e,t,this.values)}},k=`neonstrike.net.v1`,te=Object.freeze({host:``,port:``,path:``,key:``,secure:!0,remember:!1});function ne(e=typeof localStorage<`u`?localStorage:null){let t={...te};if(e)try{let n=e.getItem(k);n&&(t={...t,...JSON.parse(n)})}catch(e){console.warn(`[NetConfig] failed to load`,e)}if(typeof location<`u`){let e=new URLSearchParams(location.search),n=t=>e.get(t);n(`peerhost`)&&(t.host=n(`peerhost`),t.port=n(`peerport`)??``,t.path=n(`peerpath`)??`/`,t.key=n(`peerkey`)??`peerjs`,t.secure=n(`peersecure`)===`1`,t.remember=!1)}return t}function A(e,t=typeof localStorage<`u`?localStorage:null){if(t)try{e.remember?t.setItem(k,JSON.stringify(e)):t.removeItem(k)}catch(e){console.warn(`[NetConfig] failed to save`,e)}}function re(e){return e.host?`${e.secure?`wss`:`ws`}://${e.host}:${e.port||(e.secure?443:80)}${e.path||`/`}`:`PeerJS Cloud`}var ie=class{constructor(e){this.settings=e,this.ctx=null,this.master=null,this.compressor=null,this.noiseBuffer=null,this.ambient=null,this.muted=!1,this._last=new Map}ensure(){if(this.ctx)return this.ctx.state===`suspended`&&this.ctx.resume().catch(()=>{}),this.ctx;try{let e=window.AudioContext||window.webkitAudioContext;return e?(this.ctx=new e,this.compressor=this.ctx.createDynamicsCompressor(),this.compressor.threshold.value=-18,this.compressor.knee.value=20,this.compressor.ratio.value=8,this.compressor.attack.value=.003,this.compressor.release.value=.2,this.master=this.ctx.createGain(),this.master.gain.value=this._volumeGain(),this.master.connect(this.compressor),this.compressor.connect(this.ctx.destination),this._buildNoise(),this.settings?.get(`ambientAudio`)&&this.startAmbient(),this.ctx):null}catch(e){return console.warn(`[Audio] unavailable`,e),null}}_volumeGain(){return(this.muted?0:f((this.settings?.get(`volume`)??65)/100,0,1))*.75}setVolume(){this.master&&this.ctx&&(this.master.gain.cancelScheduledValues(this.ctx.currentTime),this.master.gain.setTargetAtTime(this._volumeGain(),this.ctx.currentTime,.04))}setMuted(e){this.muted=e,this.setVolume()}isMuted(){return this.muted}toggleMuted(){return this.setMuted(!this.muted),this.muted}_buildNoise(){let e=this.ctx.sampleRate,t=Math.floor(e*1.2),n=this.ctx.createBuffer(1,t,e),r=n.getChannelData(0),i=0;for(let e=0;e<t;e++){let t=Math.random()*2-1;i=(i+.02*t)/1.02,r[e]=i*3.5}this.noiseBuffer=n}_canPlay(e,t){if(!e)return!0;let n=performance.now();return n-(this._last.get(e)??0)<t?!1:(this._last.set(e,n),!0)}_panNode(e=0){if(!this.ctx)return null;if(typeof this.ctx.createStereoPanner==`function`){let t=this.ctx.createStereoPanner();return t.pan.value=f(e,-1,1),t}return this.ctx.createGain()}_envGain(e,t,n,r=1e-4){let i=this.ctx.currentTime,a=this.ctx.createGain();return a.gain.setValueAtTime(1e-4,i),a.gain.linearRampToValueAtTime(Math.max(1e-4,e),i+Math.max(.001,t)),a.gain.exponentialRampToValueAtTime(Math.max(1e-4,r),i+Math.max(t+.01,n)),a}_tone({freq:e=440,endFreq:t=e,dur:n=.15,type:r=`sine`,volume:i=.1,pan:a=0,delay:o=0,detune:s=0}){if(!this.ctx||this.muted)return;let c=this.ctx,l=c.currentTime+o,u=c.createOscillator(),d=c.createGain(),f=this._panNode(a);u.type=r,u.frequency.setValueAtTime(Math.max(20,e),l),u.frequency.exponentialRampToValueAtTime(Math.max(20,t),l+n),s&&(u.detune.value=s),d.gain.setValueAtTime(1e-4,l),d.gain.exponentialRampToValueAtTime(Math.max(1e-4,i),l+.006),d.gain.exponentialRampToValueAtTime(1e-4,l+n),u.connect(d),d.connect(f),f.connect(this.master),u.start(l),u.stop(l+n+.03)}_noise({dur:e=.12,volume:t=.1,pan:n=0,delay:r=0,filterFreq:i=1200,endFreq:a=null,q:o=.8,type:s=`lowpass`}){if(!this.ctx||this.muted||!this.noiseBuffer)return;let c=this.ctx,l=c.currentTime+r,u=c.createBufferSource(),d=c.createBiquadFilter(),f=c.createGain(),p=this._panNode(n);u.buffer=this.noiseBuffer,u.loop=!0,d.type=s,d.Q.value=o,d.frequency.setValueAtTime(i,l),a&&d.frequency.exponentialRampToValueAtTime(Math.max(40,a),l+e),f.gain.setValueAtTime(1e-4,l),f.gain.exponentialRampToValueAtTime(Math.max(1e-4,t),l+.005),f.gain.exponentialRampToValueAtTime(1e-4,l+e),u.connect(d),d.connect(f),f.connect(p),p.connect(this.master),u.start(l,Math.random()*.5),u.stop(l+e+.03)}_ok(e,t=30){return this.ensure()?(this.ctx.state!==`running`&&this.ctx.resume().catch(()=>{}),this._canPlay(e,t)):!1}shot(e=`pulse`,{pan:t=0,volume:n=1}={}){if(!this._ok(`shot-${e}`,18))return;let r=f(t,-1,1)*.8,i=f(n,.1,1.2);switch(e){case`volt`:this._noise({dur:.075,volume:.075*i,pan:r,filterFreq:2400,endFreq:500,q:1.2}),this._tone({freq:h(210,250),endFreq:75,dur:.09,type:`sawtooth`,volume:.055*i,pan:r});break;case`scatter`:this._noise({dur:.2,volume:.16*i,pan:r,filterFreq:2800,endFreq:220,q:.6}),this._tone({freq:110,endFreq:38,dur:.22,type:`sine`,volume:.16*i,pan:r});break;case`rail`:this._tone({freq:1700,endFreq:140,dur:.28,type:`sawtooth`,volume:.09*i,pan:r}),this._tone({freq:3400,endFreq:600,dur:.16,type:`square`,volume:.035*i,pan:r}),this._noise({dur:.14,volume:.06*i,pan:r,filterFreq:6500,endFreq:900,type:`highpass`});break;case`nova`:this._noise({dur:.32,volume:.12*i,pan:r,filterFreq:900,endFreq:160,q:.7}),this._tone({freq:150,endFreq:42,dur:.28,type:`sawtooth`,volume:.11*i,pan:r});break;default:this._tone({freq:h(900,1100),endFreq:260,dur:.085,type:`square`,volume:.055*i,pan:r}),this._tone({freq:220,endFreq:90,dur:.06,type:`sine`,volume:.05*i,pan:r}),this._noise({dur:.04,volume:.035*i,pan:r,filterFreq:5e3,endFreq:1200,type:`highpass`})}}explosion({pan:e=0,volume:t=1,distant:n=!1}={}){if(!this._ok(`explosion`,40))return;let r=f(t,.1,1.2);this._noise({dur:n?.5:.85,volume:.2*r,pan:e,filterFreq:n?700:1300,endFreq:40,q:.5}),this._tone({freq:90,endFreq:24,dur:.75,type:`sine`,volume:.2*r,pan:e}),this._tone({freq:220,endFreq:45,dur:.35,type:`sawtooth`,volume:.06*r,pan:e})}hitmarker(e=!1){this._ok(e?`kill`:`hit`,e?80:35)&&(this._tone({freq:e?1600:1250,endFreq:e?2e3:1e3,dur:.045,type:`square`,volume:.05}),e&&(this._tone({freq:700,endFreq:300,dur:.18,type:`sawtooth`,volume:.045,delay:.035}),this._noise({dur:.18,volume:.02,filterFreq:3e3,type:`highpass`})))}hurt(){this._ok(`hurt`,120)&&(this._noise({dur:.22,volume:.1,filterFreq:600,endFreq:120}),this._tone({freq:120,endFreq:60,dur:.25,type:`triangle`,volume:.09}))}empty(){this._ok(`empty`,120)&&this._tone({freq:520,endFreq:380,dur:.035,type:`square`,volume:.04})}reload(e=1){this._ok(`reload`,100)&&(this._noise({dur:.05,volume:.05,filterFreq:2400,type:`bandpass`,q:2}),this._tone({freq:380,endFreq:280,dur:.04,type:`square`,volume:.03,delay:Math.max(.05,e*.55)}),this._tone({freq:640,endFreq:420,dur:.05,type:`square`,volume:.035,delay:Math.max(.12,e*.9)}))}switchWeapon(){this._ok(`switch`,60)&&(this._noise({dur:.04,volume:.035,filterFreq:3200,type:`bandpass`,q:2}),this._tone({freq:800,endFreq:500,dur:.05,type:`triangle`,volume:.03}))}jump(){this._ok(`jump`,90)&&this._noise({dur:.12,volume:.025,filterFreq:900,endFreq:2400,type:`bandpass`,q:1.1})}land(){this._ok(`land`,180)&&(this._noise({dur:.08,volume:.045,filterFreq:500,endFreq:120}),this._tone({freq:90,endFreq:50,dur:.09,type:`sine`,volume:.05}))}pickup(){this._ok(`pickup`,150)&&(this._tone({freq:600,endFreq:900,dur:.08,type:`sine`,volume:.05}),this._tone({freq:900,endFreq:1400,dur:.12,type:`sine`,volume:.04,delay:.07}),this._noise({dur:.18,volume:.015,filterFreq:4e3,type:`highpass`}))}teleport(){this._ok(`teleport`,200)&&(this._tone({freq:180,endFreq:1600,dur:.3,type:`sine`,volume:.06}),this._tone({freq:900,endFreq:220,dur:.35,type:`triangle`,volume:.035,delay:.06}),this._noise({dur:.3,volume:.035,filterFreq:2e3,endFreq:7e3,type:`bandpass`,q:2}))}jumpPad(){this._ok(`pad`,200)&&(this._tone({freq:200,endFreq:1100,dur:.25,type:`sawtooth`,volume:.055}),this._noise({dur:.32,volume:.04,filterFreq:500,endFreq:3500,type:`bandpass`,q:1.4}))}laser(){this._ok(`laser`,400)&&this._tone({freq:1200,endFreq:1600,dur:.12,type:`square`,volume:.022})}spawn(){this._ok(`spawn`,300)&&(this._tone({freq:300,endFreq:900,dur:.25,type:`sine`,volume:.05}),this._tone({freq:600,endFreq:1200,dur:.35,type:`triangle`,volume:.025,delay:.05}))}death(){this._ok(`death`,500)&&(this._tone({freq:340,endFreq:60,dur:.7,type:`sawtooth`,volume:.09}),this._noise({dur:.5,volume:.06,filterFreq:800,endFreq:90}))}ui(){this._ok(`ui`,45)&&this._tone({freq:900,endFreq:1200,dur:.035,type:`sine`,volume:.022})}error(){this._ok(`error`,200)&&(this._tone({freq:180,endFreq:140,dur:.12,type:`square`,volume:.035}),this._tone({freq:150,endFreq:110,dur:.16,type:`square`,volume:.03,delay:.11}))}startAmbient(){let e=this.ctx;if(!e||this.ambient||this.muted)return;let t=e.createGain();t.gain.value=1e-4,t.gain.setTargetAtTime(f((this.settings?.get(`volume`)??65)/100,0,1)*.012,e.currentTime,1.2);let n=e.createBiquadFilter();n.type=`lowpass`,n.frequency.value=240,n.Q.value=3;let r=e.createOscillator(),i=e.createOscillator();r.type=`sawtooth`,i.type=`sine`,r.frequency.value=55,i.frequency.value=82.4,r.detune.value=-7,i.detune.value=4;let a=e.createOscillator(),o=e.createGain();a.frequency.value=.07,o.gain.value=120,a.connect(o),o.connect(n.frequency),r.connect(n),i.connect(n),n.connect(t),t.connect(this.master),r.start(),i.start(),a.start(),this.ambient={gain:t,oscA:r,oscB:i,lfo:a,filter:n}}stopAmbient(){if(!this.ambient||!this.ctx)return;let{gain:e,oscA:t,oscB:n,lfo:r}=this.ambient,i=this.ctx.currentTime;e.gain.cancelScheduledValues(i),e.gain.setTargetAtTime(1e-4,i,.3);try{t.stop(i+1.4),n.stop(i+1.4),r.stop(i+1.4)}catch{}this.ambient=null}setAmbientEnabled(e){e?this.ctx&&this.startAmbient():this.stopAmbient()}dispose(){if(this.stopAmbient(),this.ctx){try{this.ctx.close()}catch{}this.ctx=null}this.master=null}},ae=class{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){let e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){let e=[];for(let t of this._parts)e.push(t);return oe(e).buffer}};function oe(e){let t=0;for(let n of e)t+=n.byteLength;let n=new Uint8Array(t),r=0;for(let t of e){let e=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);n.set(e,r),r+=t.byteLength}return n}function se(e){return new le(e).unpack()}function ce(e){let t=new ue,n=t.pack(e);return n instanceof Promise?n.then(()=>t.getBuffer()):t.getBuffer()}var le=class{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){let e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let t;if((t=e^160)<=15)return this.unpack_raw(t);if((t=e^176)<=15)return this.unpack_string(t);if((t=e^144)<=15)return this.unpack_array(t);if((t=e^128)<=15)return this.unpack_map(t);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return t=this.unpack_uint16(),this.unpack_string(t);case 217:return t=this.unpack_uint32(),this.unpack_string(t);case 218:return t=this.unpack_uint16(),this.unpack_raw(t);case 219:return t=this.unpack_uint32(),this.unpack_raw(t);case 220:return t=this.unpack_uint16(),this.unpack_array(t);case 221:return t=this.unpack_uint32(),this.unpack_array(t);case 222:return t=this.unpack_uint16(),this.unpack_map(t);case 223:return t=this.unpack_uint32(),this.unpack_map(t)}}unpack_uint8(){let e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){let e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t}unpack_uint32(){let e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t}unpack_uint64(){let e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t}unpack_int8(){let e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){let e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){let e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){let e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);let t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t}unpack_string(e){let t=this.read(e),n=0,r=``,i,a;for(;n<e;)i=t[n],i<160?(a=i,n++):(i^192)<32?(a=(i&31)<<6|t[n+1]&63,n+=2):(i^224)<16?(a=(i&15)<<12|(t[n+1]&63)<<6|t[n+2]&63,n+=3):(a=(i&7)<<18|(t[n+1]&63)<<12|(t[n+2]&63)<<6|t[n+3]&63,n+=4),r+=String.fromCodePoint(a);return this.index+=e,r}unpack_array(e){let t=Array(e);for(let n=0;n<e;n++)t[n]=this.unpack();return t}unpack_map(e){let t={};for(let n=0;n<e;n++){let e=this.unpack();t[e]=this.unpack()}return t}unpack_float(){let e=this.unpack_uint32(),t=e>>31,n=(e>>23&255)-127,r=e&8388607|8388608;return(t===0?1:-1)*r*2**(n-23)}unpack_double(){let e=this.unpack_uint32(),t=this.unpack_uint32(),n=e>>31,r=(e>>20&2047)-1023,i=(e&1048575|1048576)*2**(r-20)+t*2**(r-52);return(n===0?1:-1)*i}read(e){let t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw Error(`BinaryPackFailure: read index out of range`)}},ue=class{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e==`string`)this.pack_string(e);else if(typeof e==`number`)Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e==`boolean`)e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e==`object`){if(e===null)this._bufferBuilder.append(192);else{let t=e.constructor;if(e instanceof Array){let t=this.pack_array(e);if(t instanceof Promise)return t.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if(`BYTES_PER_ELEMENT`in e){let t=e;this.pack_bin(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else if(e instanceof Blob)return e.arrayBuffer().then(e=>{this.pack_bin(new Uint8Array(e)),this._bufferBuilder.flush()});else if(t==Object||t.toString().startsWith(`class`)){let t=this.pack_object(e);if(t instanceof Promise)return t.then(()=>this._bufferBuilder.flush())}else throw Error(`Type "${t.toString()}" not yet supported`)}}else throw Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){let t=e.length;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this._bufferBuilder.append(218),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(t);else throw Error(`Invalid length`);this._bufferBuilder.append_buffer(e)}pack_string(e){let t=this._textEncoder.encode(e),n=t.length;if(n<=15)this.pack_uint8(176+n);else if(n<=65535)this._bufferBuilder.append(216),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(n);else throw Error(`Invalid length`);this._bufferBuilder.append_buffer(t)}pack_array(e){let t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this._bufferBuilder.append(220),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(t);else throw Error(`Invalid length`);let n=r=>{if(r<t){let t=this.pack(e[r]);return t instanceof Promise?t.then(()=>n(r+1)):n(r+1)}};return n(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-0x8000000000000000&&e<=0x8000000000000000)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=0x10000000000000000)this._bufferBuilder.append(207),this.pack_uint64(e);else throw Error(`Invalid integer`)}pack_double(e){let t=0;e<0&&(t=1,e=-e);let n=Math.floor(Math.log(e)/Math.LN2),r=e/2**n-1,i=Math.floor(r*2**52),a=2**32,o=t<<31|n+1023<<20|i/a&1048575,s=i%a;this._bufferBuilder.append(203),this.pack_int32(o),this.pack_int32(s)}pack_object(e){let t=Object.keys(e),n=t.length;if(n<=15)this.pack_uint8(128+n);else if(n<=65535)this._bufferBuilder.append(222),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(n);else throw Error(`Invalid length`);let r=n=>{if(n<t.length){let i=t[n];if(e.hasOwnProperty(i)){this.pack(i);let t=this.pack(e[i]);if(t instanceof Promise)return t.then(()=>r(n+1))}return r(n+1)}};return r(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){let t=e|0;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_uint64(e){let t=e/2**32,n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){let t=Math.floor(e/2**32),n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}constructor(){this._bufferBuilder=new ae,this._textEncoder=new TextEncoder}},de=!0,fe=!0;function pe(e,t,n){let r=e.match(t);return r&&r.length>=n&&parseFloat(r[n],10)}function me(e,t,n){if(!e.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,`addEventListener`).writable){_e(`Unable to polyfill events`);return}let r=e.RTCPeerConnection.prototype,i=r.addEventListener;r.addEventListener=function(e,r){if(e!==t)return i.apply(this,arguments);let a=e=>{let t=n(e);t&&(r.handleEvent?r.handleEvent(t):r(t))};return this._eventMap=this._eventMap||{},this._eventMap[t]||(this._eventMap[t]=new Map),this._eventMap[t].set(r,a),i.apply(this,[e,a])};let a=r.removeEventListener;r.removeEventListener=function(e,n){if(e!==t||!this._eventMap||!this._eventMap[t]||!this._eventMap[t].has(n))return a.apply(this,arguments);let r=this._eventMap[t].get(n);return this._eventMap[t].delete(n),this._eventMap[t].size===0&&delete this._eventMap[t],Object.keys(this._eventMap).length===0&&delete this._eventMap,a.apply(this,[e,r])},Object.defineProperty(r,`on`+t,{get(){return this[`_on`+t]},set(e){this[`_on`+t]&&(this.removeEventListener(t,this[`_on`+t]),delete this[`_on`+t]),e&&this.addEventListener(t,this[`_on`+t]=e)},enumerable:!0,configurable:!0})}function he(e){return typeof e==`boolean`?(de=e,e?`adapter.js logging disabled`:`adapter.js logging enabled`):Error(`Argument type: `+typeof e+`. Please use a boolean.`)}function ge(e){return typeof e==`boolean`?(fe=!e,`adapter.js deprecation warnings `+(e?`disabled`:`enabled`)):Error(`Argument type: `+typeof e+`. Please use a boolean.`)}function _e(){if(typeof window==`object`){if(de)return;typeof console<`u`&&typeof console.log==`function`&&console.log.apply(console,arguments)}}function ve(e,t){fe&&console.warn(e+` is deprecated, please use `+t+` instead.`)}function ye(e){let t={browser:null,version:null};if(e===void 0||!e.navigator||!e.navigator.userAgent)return t.browser=`Not a browser.`,t;let{navigator:n}=e;if(n.userAgentData&&n.userAgentData.brands){let e=n.userAgentData.brands.find(e=>e.brand===`Chromium`);if(e){let t=parseInt(e.version,10);if(t>=90)return{browser:`chrome`,version:t}}}if(n.mozGetUserMedia)t.browser=`firefox`,t.version=parseInt(pe(n.userAgent,/Firefox\/(\d+)\./,1));else if(n.webkitGetUserMedia||e.isSecureContext===!1&&e.webkitRTCPeerConnection)t.browser=`chrome`,t.version=parseInt(pe(n.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(e.RTCPeerConnection&&n.userAgent.match(/AppleWebKit\/(\d+)\./))t.browser=`safari`,t.version=parseInt(pe(n.userAgent,/AppleWebKit\/(\d+)\./,1)),t.supportsUnifiedPlan=e.RTCRtpTransceiver&&`currentDirection`in e.RTCRtpTransceiver.prototype,t._safariVersion=pe(n.userAgent,/Version\/(\d+(\.?\d+))/,1);else return t.browser=`Not a supported browser.`,t;return t}function be(e){return Object.prototype.toString.call(e)===`[object Object]`}function xe(e){return be(e)?Object.keys(e).reduce(function(t,n){let r=be(e[n]),i=r?xe(e[n]):e[n],a=r&&!Object.keys(i).length;return i===void 0||a?t:Object.assign(t,{[n]:i})},{}):e}function Se(e,t,n){t&&!n.has(t.id)&&(n.set(t.id,t),Object.keys(t).forEach(r=>{r.endsWith(`Id`)?Se(e,e.get(t[r]),n):r.endsWith(`Ids`)&&t[r].forEach(t=>{Se(e,e.get(t),n)})}))}function Ce(e,t,n){let r=n?`outbound-rtp`:`inbound-rtp`,i=new Map;if(t===null)return i;let a=[];return e.forEach(e=>{e.type===`track`&&e.trackIdentifier===t.id&&a.push(e)}),a.forEach(t=>{e.forEach(n=>{n.type===r&&n.trackId===t.id&&Se(e,n,i)})}),i}var we=_e;function Te(e,t){if(t.version>=64)return;let n=e&&e.navigator;if(!n.mediaDevices)return;let r=function(e){if(typeof e!=`object`||e.mandatory||e.optional)return e;let t={};return Object.keys(e).forEach(n=>{if(n===`require`||n===`advanced`||n===`mediaSource`)return;let r=typeof e[n]==`object`?e[n]:{ideal:e[n]};r.exact!==void 0&&typeof r.exact==`number`&&(r.min=r.max=r.exact);let i=function(e,t){return e?e+t.charAt(0).toUpperCase()+t.slice(1):t===`deviceId`?`sourceId`:t};if(r.ideal!==void 0){t.optional=t.optional||[];let e={};typeof r.ideal==`number`?(e[i(`min`,n)]=r.ideal,t.optional.push(e),e={},e[i(`max`,n)]=r.ideal,t.optional.push(e)):(e[i(``,n)]=r.ideal,t.optional.push(e))}r.exact!==void 0&&typeof r.exact!=`number`?(t.mandatory=t.mandatory||{},t.mandatory[i(``,n)]=r.exact):[`min`,`max`].forEach(e=>{r[e]!==void 0&&(t.mandatory=t.mandatory||{},t.mandatory[i(e,n)]=r[e])})}),e.advanced&&(t.optional=(t.optional||[]).concat(e.advanced)),t},i=function(e,i){if(t.version>=61)return i(e);if(e=JSON.parse(JSON.stringify(e)),e&&typeof e.audio==`object`){let t=function(e,t,n){t in e&&!(n in e)&&(e[n]=e[t],delete e[t])};e=JSON.parse(JSON.stringify(e)),t(e.audio,`autoGainControl`,`googAutoGainControl`),t(e.audio,`noiseSuppression`,`googNoiseSuppression`),e.audio=r(e.audio)}if(e&&typeof e.video==`object`){let a=e.video.facingMode;a&&=typeof a==`object`?a:{ideal:a};let o=t.version<66;if(a&&(a.exact===`user`||a.exact===`environment`||a.ideal===`user`||a.ideal===`environment`)&&!(n.mediaDevices.getSupportedConstraints&&n.mediaDevices.getSupportedConstraints().facingMode&&!o)){delete e.video.facingMode;let t;if(a.exact===`environment`||a.ideal===`environment`?t=[`back`,`rear`]:(a.exact===`user`||a.ideal===`user`)&&(t=[`front`]),t)return n.mediaDevices.enumerateDevices().then(n=>{n=n.filter(e=>e.kind===`videoinput`);let o=n.find(e=>t.some(t=>e.label.toLowerCase().includes(t)));return!o&&n.length&&t.includes(`back`)&&(o=n[n.length-1]),o&&(e.video.deviceId=a.exact?{exact:o.deviceId}:{ideal:o.deviceId}),e.video=r(e.video),we(`chrome: `+JSON.stringify(e)),i(e)})}e.video=r(e.video)}return we(`chrome: `+JSON.stringify(e)),i(e)},a=function(e){return t.version>=64?e:{name:{PermissionDeniedError:`NotAllowedError`,PermissionDismissedError:`NotAllowedError`,InvalidStateError:`NotAllowedError`,DevicesNotFoundError:`NotFoundError`,ConstraintNotSatisfiedError:`OverconstrainedError`,TrackStartError:`NotReadableError`,MediaDeviceFailedDueToShutdown:`NotAllowedError`,MediaDeviceKillSwitchOn:`NotAllowedError`,TabCaptureError:`AbortError`,ScreenCaptureError:`AbortError`,DeviceCaptureError:`AbortError`}[e.name]||e.name,message:e.message,constraint:e.constraint||e.constraintName,toString(){return this.name+(this.message&&`: `)+this.message}}};if(n.getUserMedia=function(e,t,r){i(e,e=>{n.webkitGetUserMedia(e,t,e=>{r&&r(a(e))})})}.bind(n),n.mediaDevices.getUserMedia){let e=n.mediaDevices.getUserMedia.bind(n.mediaDevices);n.mediaDevices.getUserMedia=function(t){return i(t,t=>e(t).then(e=>{if(t.audio&&!e.getAudioTracks().length||t.video&&!e.getVideoTracks().length)throw e.getTracks().forEach(e=>{e.stop()}),new DOMException(``,`NotFoundError`);return e},e=>Promise.reject(a(e))))}}}var Ee=s({fixNegotiationNeeded:()=>P,shimAddTrackRemoveTrack:()=>Ae,shimAddTrackRemoveTrackWithNative:()=>M,shimGetSendersWithDtmf:()=>Oe,shimGetUserMedia:()=>Te,shimMediaStream:()=>j,shimOnTrack:()=>De,shimPeerConnection:()=>N,shimSenderReceiverGetStats:()=>ke});function j(e){e.MediaStream=e.MediaStream||e.webkitMediaStream}function De(e,t){if(!(t.version>102)){if(typeof e==`object`&&e.RTCPeerConnection&&!(`ontrack`in e.RTCPeerConnection.prototype)){Object.defineProperty(e.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(e){this._ontrack&&this.removeEventListener(`track`,this._ontrack),this.addEventListener(`track`,this._ontrack=e)},enumerable:!0,configurable:!0});let t=e.RTCPeerConnection.prototype.setRemoteDescription;e.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=t=>{t.stream.addEventListener(`addtrack`,n=>{let r;r=e.RTCPeerConnection.prototype.getReceivers?this.getReceivers().find(e=>e.track&&e.track.id===n.track.id):{track:n.track};let i=new Event(`track`);i.track=n.track,i.receiver=r,i.transceiver={receiver:r},i.streams=[t.stream],this.dispatchEvent(i)}),t.stream.getTracks().forEach(n=>{let r;r=e.RTCPeerConnection.prototype.getReceivers?this.getReceivers().find(e=>e.track&&e.track.id===n.id):{track:n};let i=new Event(`track`);i.track=n,i.receiver=r,i.transceiver={receiver:r},i.streams=[t.stream],this.dispatchEvent(i)})},this.addEventListener(`addstream`,this._ontrackpoly)),t.apply(this,arguments)}}else me(e,`track`,e=>(e.transceiver||Object.defineProperty(e,"transceiver",{value:{receiver:e.receiver}}),e))}}function Oe(e){if(typeof e==`object`&&e.RTCPeerConnection&&!(`getSenders`in e.RTCPeerConnection.prototype)&&`createDTMFSender`in e.RTCPeerConnection.prototype){let t=function(e,t){return{track:t,get dtmf(){return this._dtmf===void 0&&(this._dtmf=t.kind===`audio`?e.createDTMFSender(t):null),this._dtmf},_pc:e}};if(!e.RTCPeerConnection.prototype.getSenders){e.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};let n=e.RTCPeerConnection.prototype.addTrack;e.RTCPeerConnection.prototype.addTrack=function(e,r){let i=n.apply(this,arguments);return i||(i=t(this,e),this._senders.push(i)),i};let r=e.RTCPeerConnection.prototype.removeTrack;e.RTCPeerConnection.prototype.removeTrack=function(e){r.apply(this,arguments);let t=this._senders.indexOf(e);t!==-1&&this._senders.splice(t,1)}}let n=e.RTCPeerConnection.prototype.addStream;e.RTCPeerConnection.prototype.addStream=function(e){this._senders=this._senders||[],n.apply(this,[e]),e.getTracks().forEach(e=>{this._senders.push(t(this,e))})};let r=e.RTCPeerConnection.prototype.removeStream;e.RTCPeerConnection.prototype.removeStream=function(e){this._senders=this._senders||[],r.apply(this,[e]),e.getTracks().forEach(e=>{let t=this._senders.find(t=>t.track===e);t&&this._senders.splice(this._senders.indexOf(t),1)})}}else if(typeof e==`object`&&e.RTCPeerConnection&&`getSenders`in e.RTCPeerConnection.prototype&&`createDTMFSender`in e.RTCPeerConnection.prototype&&e.RTCRtpSender&&!(`dtmf`in e.RTCRtpSender.prototype)){let t=e.RTCPeerConnection.prototype.getSenders;e.RTCPeerConnection.prototype.getSenders=function(){let e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e},Object.defineProperty(e.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this._dtmf=this.track.kind===`audio`?this._pc.createDTMFSender(this.track):null),this._dtmf}})}}function ke(e,t){if(t.version>=67||!(typeof e==`object`&&e.RTCPeerConnection&&e.RTCRtpSender&&e.RTCRtpReceiver))return;if(!(`getStats`in e.RTCRtpSender.prototype)){let t=e.RTCPeerConnection.prototype.getSenders;t&&(e.RTCPeerConnection.prototype.getSenders=function(){let e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e});let n=e.RTCPeerConnection.prototype.addTrack;n&&(e.RTCPeerConnection.prototype.addTrack=function(){let e=n.apply(this,arguments);return e._pc=this,e}),e.RTCRtpSender.prototype.getStats=function(){let e=this;return this._pc.getStats().then(t=>Ce(t,e.track,!0))}}if(!(`getStats`in e.RTCRtpReceiver.prototype)){let t=e.RTCPeerConnection.prototype.getReceivers;t&&(e.RTCPeerConnection.prototype.getReceivers=function(){let e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e}),me(e,`track`,e=>(e.receiver._pc=e.srcElement,e)),e.RTCRtpReceiver.prototype.getStats=function(){let e=this;return this._pc.getStats().then(t=>Ce(t,e.track,!1))}}if(!(`getStats`in e.RTCRtpSender.prototype&&`getStats`in e.RTCRtpReceiver.prototype))return;let n=e.RTCPeerConnection.prototype.getStats;e.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof e.MediaStreamTrack){let e=arguments[0],t,n,r;return this.getSenders().forEach(n=>{n.track===e&&(t?r=!0:t=n)}),this.getReceivers().forEach(t=>(t.track===e&&(n?r=!0:n=t),t.track===e)),r||t&&n?Promise.reject(new DOMException(`There are more than one sender or receiver for the track.`,`InvalidAccessError`)):t?t.getStats():n?n.getStats():Promise.reject(new DOMException(`There is no sender or receiver for the track.`,`InvalidAccessError`))}return n.apply(this,arguments)}}function M(e){e.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(e=>this._shimmedLocalStreams[e][0])};let t=e.RTCPeerConnection.prototype.addTrack;e.RTCPeerConnection.prototype.addTrack=function(e,n){if(!n)return t.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};let r=t.apply(this,arguments);return this._shimmedLocalStreams[n.id]?this._shimmedLocalStreams[n.id].indexOf(r)===-1&&this._shimmedLocalStreams[n.id].push(r):this._shimmedLocalStreams[n.id]=[n,r],r};let n=e.RTCPeerConnection.prototype.addStream;e.RTCPeerConnection.prototype.addStream=function(e){this._shimmedLocalStreams=this._shimmedLocalStreams||{},e.getTracks().forEach(e=>{if(this.getSenders().find(t=>t.track===e))throw new DOMException(`Track already exists.`,`InvalidAccessError`)});let t=this.getSenders();n.apply(this,arguments);let r=this.getSenders().filter(e=>t.indexOf(e)===-1);this._shimmedLocalStreams[e.id]=[e].concat(r)};let r=e.RTCPeerConnection.prototype.removeStream;e.RTCPeerConnection.prototype.removeStream=function(e){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[e.id],r.apply(this,arguments)};let i=e.RTCPeerConnection.prototype.removeTrack;e.RTCPeerConnection.prototype.removeTrack=function(e){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},e&&Object.keys(this._shimmedLocalStreams).forEach(t=>{let n=this._shimmedLocalStreams[t].indexOf(e);n!==-1&&this._shimmedLocalStreams[t].splice(n,1),this._shimmedLocalStreams[t].length===1&&delete this._shimmedLocalStreams[t]}),i.apply(this,arguments)}}function Ae(e,t){if(!e.RTCPeerConnection)return;if(e.RTCPeerConnection.prototype.addTrack&&t.version>=65)return M(e);let n=e.RTCPeerConnection.prototype.getLocalStreams;e.RTCPeerConnection.prototype.getLocalStreams=function(){let e=n.apply(this);return this._reverseStreams=this._reverseStreams||{},e.map(e=>this._reverseStreams[e.id])};let r=e.RTCPeerConnection.prototype.addStream;e.RTCPeerConnection.prototype.addStream=function(t){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},t.getTracks().forEach(e=>{if(this.getSenders().find(t=>t.track===e))throw new DOMException(`Track already exists.`,`InvalidAccessError`)}),!this._reverseStreams[t.id]){let n=new e.MediaStream(t.getTracks());this._streams[t.id]=n,this._reverseStreams[n.id]=t,t=n}r.apply(this,[t])};let i=e.RTCPeerConnection.prototype.removeStream;e.RTCPeerConnection.prototype.removeStream=function(e){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},i.apply(this,[this._streams[e.id]||e]),delete this._reverseStreams[this._streams[e.id]?this._streams[e.id].id:e.id],delete this._streams[e.id]},e.RTCPeerConnection.prototype.addTrack=function(t,n){if(this.signalingState===`closed`)throw new DOMException(`The RTCPeerConnection's signalingState is 'closed'.`,`InvalidStateError`);let r=[].slice.call(arguments,1);if(r.length!==1||!r[0].getTracks().find(e=>e===t))throw new DOMException(`The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.`,`NotSupportedError`);if(this.getSenders().find(e=>e.track===t))throw new DOMException(`Track already exists.`,`InvalidAccessError`);this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};let i=this._streams[n.id];if(i)i.addTrack(t),Promise.resolve().then(()=>{this.dispatchEvent(new Event(`negotiationneeded`))});else{let r=new e.MediaStream([t]);this._streams[n.id]=r,this._reverseStreams[r.id]=n,this.addStream(r)}return this.getSenders().find(e=>e.track===t)};function a(e,t){let n=t.sdp;return Object.keys(e._reverseStreams||[]).forEach(t=>{let r=e._reverseStreams[t],i=e._streams[r.id];n=n.replace(new RegExp(i.id,`g`),r.id)}),new RTCSessionDescription({type:t.type,sdp:n})}function o(e,t){let n=t.sdp;return Object.keys(e._reverseStreams||[]).forEach(t=>{let r=e._reverseStreams[t],i=e._streams[r.id];n=n.replace(new RegExp(r.id,`g`),i.id)}),new RTCSessionDescription({type:t.type,sdp:n})}[`createOffer`,`createAnswer`].forEach(function(t){let n=e.RTCPeerConnection.prototype[t],r={[t](){let e=arguments;return arguments.length&&typeof arguments[0]==`function`?n.apply(this,[t=>{let n=a(this,t);e[0].apply(null,[n])},t=>{e[1]&&e[1].apply(null,t)},arguments[2]]):n.apply(this,arguments).then(e=>a(this,e))}};e.RTCPeerConnection.prototype[t]=r[t]});let s=e.RTCPeerConnection.prototype.setLocalDescription;e.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type||(arguments[0]=o(this,arguments[0])),s.apply(this,arguments)};let c=Object.getOwnPropertyDescriptor(e.RTCPeerConnection.prototype,`localDescription`);Object.defineProperty(e.RTCPeerConnection.prototype,"localDescription",{get(){let e=c.get.apply(this);return e.type===``?e:a(this,e)}}),e.RTCPeerConnection.prototype.removeTrack=function(e){if(this.signalingState===`closed`)throw new DOMException(`The RTCPeerConnection's signalingState is 'closed'.`,`InvalidStateError`);if(!e._pc)throw new DOMException(`Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.`,`TypeError`);if(e._pc!==this)throw new DOMException(`Sender was not created by this connection.`,`InvalidAccessError`);this._streams=this._streams||{};let t;Object.keys(this._streams).forEach(n=>{this._streams[n].getTracks().find(t=>e.track===t)&&(t=this._streams[n])}),t&&(t.getTracks().length===1?this.removeStream(this._reverseStreams[t.id]):t.removeTrack(e.track),this.dispatchEvent(new Event(`negotiationneeded`)))}}function N(e,t){!e.RTCPeerConnection&&e.webkitRTCPeerConnection&&(e.RTCPeerConnection=e.webkitRTCPeerConnection),e.RTCPeerConnection&&t.version<53&&[`setLocalDescription`,`setRemoteDescription`,`addIceCandidate`].forEach(function(t){let n=e.RTCPeerConnection.prototype[t],r={[t](){return arguments[0]=new(t===`addIceCandidate`?e.RTCIceCandidate:e.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};e.RTCPeerConnection.prototype[t]=r[t]})}function P(e,t){t.version>102||me(e,`negotiationneeded`,e=>{let n=e.target;if(!((t.version<72||n.getConfiguration&&n.getConfiguration().sdpSemantics===`plan-b`)&&n.signalingState!==`stable`))return e})}function je(e,t){let n=e&&e.navigator;if(!n.mediaDevices)return;let r=e&&e.MediaStreamTrack;if(n.getUserMedia=function(e,t,r){ve(`navigator.getUserMedia`,`navigator.mediaDevices.getUserMedia`),n.mediaDevices.getUserMedia(e).then(t,r)},!(t.version>55&&`autoGainControl`in n.mediaDevices.getSupportedConstraints())){let e=function(e,t,n){t in e&&!(n in e)&&(e[n]=e[t],delete e[t])},t=n.mediaDevices.getUserMedia.bind(n.mediaDevices);if(n.mediaDevices.getUserMedia=function(n){return typeof n==`object`&&typeof n.audio==`object`&&(n=JSON.parse(JSON.stringify(n)),e(n.audio,`autoGainControl`,`mozAutoGainControl`),e(n.audio,`noiseSuppression`,`mozNoiseSuppression`)),t(n)},r&&r.prototype.getSettings){let t=r.prototype.getSettings;r.prototype.getSettings=function(){let n=t.apply(this,arguments);return e(n,`mozAutoGainControl`,`autoGainControl`),e(n,`mozNoiseSuppression`,`noiseSuppression`),n}}if(r&&r.prototype.applyConstraints){let t=r.prototype.applyConstraints;r.prototype.applyConstraints=function(n){return this.kind===`audio`&&typeof n==`object`&&(n=JSON.parse(JSON.stringify(n)),e(n,`autoGainControl`,`mozAutoGainControl`),e(n,`noiseSuppression`,`mozNoiseSuppression`)),t.apply(this,[n])}}}}function Me(e,t){e.navigator.mediaDevices&&(e.navigator.mediaDevices&&`getDisplayMedia`in e.navigator.mediaDevices||(e.navigator.mediaDevices.getDisplayMedia=function(n){if(!(n&&n.video)){let e=new DOMException(`getDisplayMedia without video constraints is undefined`);return e.name=`NotFoundError`,e.code=8,Promise.reject(e)}return n.video===!0?n.video={mediaSource:t}:n.video.mediaSource=t,e.navigator.mediaDevices.getUserMedia(n)}))}var Ne=s({shimAddTransceiver:()=>Ve,shimCreateAnswer:()=>We,shimCreateOffer:()=>Ue,shimGetDisplayMedia:()=>Me,shimGetParameters:()=>He,shimGetStats:()=>Ie,shimGetUserMedia:()=>je,shimOnTrack:()=>Pe,shimPeerConnection:()=>Fe,shimRTCDataChannel:()=>Be,shimReceiverGetStats:()=>Re,shimRemoveStream:()=>ze,shimSenderGetStats:()=>Le});function Pe(e){typeof e==`object`&&e.RTCTrackEvent&&`receiver`in e.RTCTrackEvent.prototype&&!(`transceiver`in e.RTCTrackEvent.prototype)&&Object.defineProperty(e.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Fe(e,t){typeof e==`object`&&(e.RTCPeerConnection||e.mozRTCPeerConnection)&&(!e.RTCPeerConnection&&e.mozRTCPeerConnection&&(e.RTCPeerConnection=e.mozRTCPeerConnection),t.version<53&&[`setLocalDescription`,`setRemoteDescription`,`addIceCandidate`].forEach(function(t){let n=e.RTCPeerConnection.prototype[t],r={[t](){return arguments[0]=new(t===`addIceCandidate`?e.RTCIceCandidate:e.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};e.RTCPeerConnection.prototype[t]=r[t]}))}function Ie(e,t){if(typeof e!=`object`||!(e.RTCPeerConnection||e.mozRTCPeerConnection)||t.version>=151)return;let n={inboundrtp:`inbound-rtp`,outboundrtp:`outbound-rtp`,candidatepair:`candidate-pair`,localcandidate:`local-candidate`,remotecandidate:`remote-candidate`},r=e.RTCPeerConnection.prototype.getStats;e.RTCPeerConnection.prototype.getStats=function(){let[e,i,a]=arguments;return this.signalingState===`closed`?Promise.resolve(new Map):r.apply(this,[e||null]).then(e=>{if(t.version<53&&!i)try{e.forEach(e=>{e.type=n[e.type]||e.type})}catch(t){if(t.name!==`TypeError`)throw t;e.forEach((t,r)=>{e.set(r,Object.assign({},t,{type:n[t.type]||t.type}))})}return e}).then(i,a)}}function Le(e){if(!(typeof e==`object`&&e.RTCPeerConnection&&e.RTCRtpSender)||e.RTCRtpSender&&`getStats`in e.RTCRtpSender.prototype)return;let t=e.RTCPeerConnection.prototype.getSenders;t&&(e.RTCPeerConnection.prototype.getSenders=function(){let e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e});let n=e.RTCPeerConnection.prototype.addTrack;n&&(e.RTCPeerConnection.prototype.addTrack=function(){let e=n.apply(this,arguments);return e._pc=this,e}),e.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function Re(e){if(!(typeof e==`object`&&e.RTCPeerConnection&&e.RTCRtpSender)||e.RTCRtpSender&&`getStats`in e.RTCRtpReceiver.prototype)return;let t=e.RTCPeerConnection.prototype.getReceivers;t&&(e.RTCPeerConnection.prototype.getReceivers=function(){let e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e}),me(e,`track`,e=>(e.receiver._pc=e.srcElement,e)),e.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function ze(e){!e.RTCPeerConnection||`removeStream`in e.RTCPeerConnection.prototype||(e.RTCPeerConnection.prototype.removeStream=function(e){ve(`removeStream`,`removeTrack`),this.getSenders().forEach(t=>{t.track&&e.getTracks().includes(t.track)&&this.removeTrack(t)})})}function Be(e){e.DataChannel&&!e.RTCDataChannel&&(e.RTCDataChannel=e.DataChannel)}function Ve(e,t){if(!(typeof e==`object`&&e.RTCPeerConnection)||t.version>=110)return;let n=e.RTCPeerConnection.prototype.addTransceiver;n&&(e.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let e=arguments[1]&&arguments[1].sendEncodings;e===void 0&&(e=[]),e=[...e];let t=e.length>0;t&&e.forEach(e=>{if(`rid`in e&&!/^[a-z0-9]{0,16}$/i.test(e.rid))throw TypeError(`Invalid RID value provided.`);if(`scaleResolutionDownBy`in e&&!(parseFloat(e.scaleResolutionDownBy)>=1))throw RangeError(`scale_resolution_down_by must be >= 1.0`);if(`maxFramerate`in e&&!(parseFloat(e.maxFramerate)>=0))throw RangeError(`max_framerate must be >= 0.0`)});let r=n.apply(this,arguments);if(t){let{sender:t}=r,n=t.getParameters();(!(`encodings`in n)||n.encodings.length===1&&Object.keys(n.encodings[0]).length===0)&&(n.encodings=e,t.sendEncodings=e,this.setParametersPromises.push(t.setParameters(n).then(()=>{delete t.sendEncodings}).catch(()=>{delete t.sendEncodings})))}return r})}function He(e,t){if(!(typeof e==`object`&&e.RTCRtpSender)||t.version>=110)return;let n=e.RTCRtpSender.prototype.getParameters;n&&(e.RTCRtpSender.prototype.getParameters=function(){let e=n.apply(this,arguments);return`encodings`in e||(e.encodings=[].concat(this.sendEncodings||[{}])),e})}function Ue(e,t){if(!(typeof e==`object`&&e.RTCPeerConnection)||t.version>=110)return;let n=e.RTCPeerConnection.prototype.createOffer;e.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>n.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):n.apply(this,arguments)}}function We(e,t){if(!(typeof e==`object`&&e.RTCPeerConnection)||t.version>=110)return;let n=e.RTCPeerConnection.prototype.createAnswer;e.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>n.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):n.apply(this,arguments)}}var Ge=s({shimAudioContext:()=>et,shimCallbacksAPI:()=>Je,shimConstraints:()=>Xe,shimCreateOfferLegacy:()=>$e,shimGetUserMedia:()=>Ye,shimLocalStreamsAPI:()=>Ke,shimRTCIceServerUrls:()=>Ze,shimRemoteStreamsAPI:()=>qe,shimTrackEventTransceiver:()=>Qe});function Ke(e){if(typeof e==`object`&&e.RTCPeerConnection){if(`getLocalStreams`in e.RTCPeerConnection.prototype||(e.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||=[],this._localStreams}),!(`addStream`in e.RTCPeerConnection.prototype)){let t=e.RTCPeerConnection.prototype.addTrack;e.RTCPeerConnection.prototype.addStream=function(e){this._localStreams||=[],this._localStreams.includes(e)||this._localStreams.push(e),e.getAudioTracks().forEach(n=>t.call(this,n,e)),e.getVideoTracks().forEach(n=>t.call(this,n,e))},e.RTCPeerConnection.prototype.addTrack=function(e,...n){return n&&n.forEach(e=>{this._localStreams?this._localStreams.includes(e)||this._localStreams.push(e):this._localStreams=[e]}),t.apply(this,arguments)}}`removeStream`in e.RTCPeerConnection.prototype||(e.RTCPeerConnection.prototype.removeStream=function(e){this._localStreams||=[];let t=this._localStreams.indexOf(e);if(t===-1)return;this._localStreams.splice(t,1);let n=e.getTracks();this.getSenders().forEach(e=>{n.includes(e.track)&&this.removeTrack(e)})})}}function qe(e){if(typeof e==`object`&&e.RTCPeerConnection&&(`getRemoteStreams`in e.RTCPeerConnection.prototype||(e.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!(`onaddstream`in e.RTCPeerConnection.prototype))){Object.defineProperty(e.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(e){this._onaddstream&&(this.removeEventListener(`addstream`,this._onaddstream),this.removeEventListener(`track`,this._onaddstreampoly)),this.addEventListener(`addstream`,this._onaddstream=e),this.addEventListener(`track`,this._onaddstreampoly=e=>{e.streams.forEach(e=>{if(this._remoteStreams||=[],this._remoteStreams.includes(e))return;this._remoteStreams.push(e);let t=new Event(`addstream`);t.stream=e,this.dispatchEvent(t)})})}});let t=e.RTCPeerConnection.prototype.setRemoteDescription;e.RTCPeerConnection.prototype.setRemoteDescription=function(){let e=this;return this._onaddstreampoly||this.addEventListener(`track`,this._onaddstreampoly=function(t){t.streams.forEach(t=>{if(e._remoteStreams||=[],e._remoteStreams.indexOf(t)>=0)return;e._remoteStreams.push(t);let n=new Event(`addstream`);n.stream=t,e.dispatchEvent(n)})}),t.apply(e,arguments)}}}function Je(e){if(typeof e!=`object`||!e.RTCPeerConnection)return;let t=e.RTCPeerConnection.prototype,n=t.createOffer,r=t.createAnswer,i=t.setLocalDescription,a=t.setRemoteDescription,o=t.addIceCandidate;t.createOffer=function(e,t){let r=arguments.length>=2?arguments[2]:arguments[0],i=n.apply(this,[r]);return t?(i.then(e,t),Promise.resolve()):i},t.createAnswer=function(e,t){let n=arguments.length>=2?arguments[2]:arguments[0],i=r.apply(this,[n]);return t?(i.then(e,t),Promise.resolve()):i};let s=function(e,t,n){let r=i.apply(this,[e]);return n?(r.then(t,n),Promise.resolve()):r};t.setLocalDescription=s,s=function(e,t,n){let r=a.apply(this,[e]);return n?(r.then(t,n),Promise.resolve()):r},t.setRemoteDescription=s,s=function(e,t,n){let r=o.apply(this,[e]);return n?(r.then(t,n),Promise.resolve()):r},t.addIceCandidate=s}function Ye(e){let t=e&&e.navigator;if(t.mediaDevices&&t.mediaDevices.getUserMedia){let e=t.mediaDevices,n=e.getUserMedia.bind(e);t.mediaDevices.getUserMedia=e=>n(Xe(e))}!t.getUserMedia&&t.mediaDevices&&t.mediaDevices.getUserMedia&&(t.getUserMedia=function(e,n,r){t.mediaDevices.getUserMedia(e).then(n,r)}.bind(t))}function Xe(e){return e&&e.video!==void 0?Object.assign({},e,{video:xe(e.video)}):e}function Ze(e){if(!e.RTCPeerConnection)return;let t=e.RTCPeerConnection;e.RTCPeerConnection=function(e,n){if(e&&e.iceServers){let t=[];for(let n=0;n<e.iceServers.length;n++){let r=e.iceServers[n];r.urls===void 0&&r.url?(ve(`RTCIceServer.url`,`RTCIceServer.urls`),r=JSON.parse(JSON.stringify(r)),r.urls=r.url,delete r.url,t.push(r)):t.push(e.iceServers[n])}e.iceServers=t}return new t(e,n)},e.RTCPeerConnection.prototype=t.prototype,`generateCertificate`in t&&Object.defineProperty(e.RTCPeerConnection,"generateCertificate",{get(){return t.generateCertificate}})}function Qe(e){typeof e==`object`&&e.RTCTrackEvent&&`receiver`in e.RTCTrackEvent.prototype&&!(`transceiver`in e.RTCTrackEvent.prototype)&&Object.defineProperty(e.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function $e(e){let t=e.RTCPeerConnection.prototype.createOffer;e.RTCPeerConnection.prototype.createOffer=function(e){if(e){e.offerToReceiveAudio!==void 0&&(e.offerToReceiveAudio=!!e.offerToReceiveAudio);let t=this.getTransceivers().find(e=>e.receiver.track.kind===`audio`);e.offerToReceiveAudio===!1&&t?t.direction===`sendrecv`?t.setDirection?t.setDirection(`sendonly`):t.direction=`sendonly`:t.direction===`recvonly`&&(t.setDirection?t.setDirection(`inactive`):t.direction=`inactive`):e.offerToReceiveAudio===!0&&!t&&this.addTransceiver(`audio`,{direction:`recvonly`}),e.offerToReceiveVideo!==void 0&&(e.offerToReceiveVideo=!!e.offerToReceiveVideo);let n=this.getTransceivers().find(e=>e.receiver.track.kind===`video`);e.offerToReceiveVideo===!1&&n?n.direction===`sendrecv`?n.setDirection?n.setDirection(`sendonly`):n.direction=`sendonly`:n.direction===`recvonly`&&(n.setDirection?n.setDirection(`inactive`):n.direction=`inactive`):e.offerToReceiveVideo===!0&&!n&&this.addTransceiver(`video`,{direction:`recvonly`})}return t.apply(this,arguments)}}function et(e){typeof e!=`object`||e.AudioContext||(e.AudioContext=e.webkitAudioContext)}var tt=o(((e,t)=>{var n={};n.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)},n.localCName=n.generateIdentifier(),n.splitLines=function(e){return e.trim().split(`
`).map(e=>e.trim())},n.splitSections=function(e){return e.split(`
m=`).map((e,t)=>(t>0?`m=`+e:e).trim()+`\r
`)},n.getDescription=function(e){let t=n.splitSections(e);return t&&t[0]},n.getMediaSections=function(e){let t=n.splitSections(e);return t.shift(),t},n.matchPrefix=function(e,t){return n.splitLines(e).filter(e=>e.indexOf(t)===0)},n.parseCandidate=function(e){let t;t=e.indexOf(`a=candidate:`)===0?e.substring(12).split(` `):e.substring(10).split(` `);let n={foundation:t[0],component:{1:`rtp`,2:`rtcp`}[t[1]]||t[1],protocol:t[2].toLowerCase(),priority:parseInt(t[3],10),ip:t[4],address:t[4],port:parseInt(t[5],10),type:t[7]};for(let e=8;e<t.length;e+=2)switch(t[e]){case`raddr`:n.relatedAddress=t[e+1];break;case`rport`:n.relatedPort=parseInt(t[e+1],10);break;case`tcptype`:n.tcpType=t[e+1];break;case`ufrag`:n.ufrag=t[e+1],n.usernameFragment=t[e+1];break;default:n[t[e]]===void 0&&(n[t[e]]=t[e+1])}return n},n.writeCandidate=function(e){let t=[];t.push(e.foundation);let n=e.component;n===`rtp`?t.push(1):n===`rtcp`?t.push(2):t.push(n),t.push(e.protocol.toUpperCase()),t.push(e.priority),t.push(e.address||e.ip),t.push(e.port);let r=e.type;return t.push(`typ`),t.push(r),r!==`host`&&e.relatedAddress&&e.relatedPort!==void 0&&(t.push(`raddr`),t.push(e.relatedAddress),t.push(`rport`),t.push(e.relatedPort)),e.tcpType&&e.protocol.toLowerCase()===`tcp`&&(t.push(`tcptype`),t.push(e.tcpType)),(e.usernameFragment||e.ufrag)&&(t.push(`ufrag`),t.push(e.usernameFragment||e.ufrag)),`candidate:`+t.join(` `)},n.parseIceOptions=function(e){return e.substring(14).split(` `)},n.parseRtpMap=function(e){let t=e.substring(9).split(` `),n={payloadType:parseInt(t.shift(),10)};return t=t[0].split(`/`),n.name=t[0],n.clockRate=parseInt(t[1],10),n.channels=t.length===3?parseInt(t[2],10):1,n.numChannels=n.channels,n},n.writeRtpMap=function(e){let t=e.payloadType;e.preferredPayloadType!==void 0&&(t=e.preferredPayloadType);let n=e.channels||e.numChannels||1;return`a=rtpmap:`+t+` `+e.name+`/`+e.clockRate+(n===1?``:`/`+n)+`\r
`},n.parseExtmap=function(e){let t=e.substring(9).split(` `);return{id:parseInt(t[0],10),direction:t[0].indexOf(`/`)>0?t[0].split(`/`)[1]:`sendrecv`,uri:t[1],attributes:t.slice(2).join(` `)}},n.writeExtmap=function(e){return`a=extmap:`+(e.id||e.preferredId)+(e.direction&&e.direction!==`sendrecv`?`/`+e.direction:``)+` `+e.uri+(e.attributes?` `+e.attributes:``)+`\r
`},n.parseFmtp=function(e){let t={},n,r=e.substring(e.indexOf(` `)+1).split(`;`);for(let e=0;e<r.length;e++)n=r[e].trim().split(`=`),t[n[0].trim()]=n[1];return t},n.writeFmtp=function(e){let t=``,n=e.payloadType;if(e.preferredPayloadType!==void 0&&(n=e.preferredPayloadType),e.parameters&&Object.keys(e.parameters).length){let r=[];Object.keys(e.parameters).forEach(t=>{e.parameters[t]===void 0?r.push(t):r.push(t+`=`+e.parameters[t])}),t+=`a=fmtp:`+n+` `+r.join(`;`)+`\r
`}return t},n.parseRtcpFb=function(e){let t=e.substring(e.indexOf(` `)+1).split(` `);return{type:t.shift(),parameter:t.join(` `)}},n.writeRtcpFb=function(e){let t=``,n=e.payloadType;return e.preferredPayloadType!==void 0&&(n=e.preferredPayloadType),e.rtcpFeedback&&e.rtcpFeedback.length&&e.rtcpFeedback.forEach(e=>{t+=`a=rtcp-fb:`+n+` `+e.type+(e.parameter&&e.parameter.length?` `+e.parameter:``)+`\r
`}),t},n.parseSsrcMedia=function(e){let t=e.indexOf(` `),n={ssrc:parseInt(e.substring(7,t),10)},r=e.indexOf(`:`,t);return r>-1?(n.attribute=e.substring(t+1,r),n.value=e.substring(r+1)):n.attribute=e.substring(t+1),n},n.parseSsrcGroup=function(e){let t=e.substring(13).split(` `);return{semantics:t.shift(),ssrcs:t.map(e=>parseInt(e,10))}},n.getMid=function(e){let t=n.matchPrefix(e,`a=mid:`)[0];if(t)return t.substring(6)},n.parseFingerprint=function(e){let t=e.substring(14).split(` `);return{algorithm:t[0].toLowerCase(),value:t[1].toUpperCase()}},n.getDtlsParameters=function(e,t){return{role:`auto`,fingerprints:n.matchPrefix(e+t,`a=fingerprint:`).map(n.parseFingerprint)}},n.writeDtlsParameters=function(e,t){let n=`a=setup:`+t+`\r
`;return e.fingerprints.forEach(e=>{n+=`a=fingerprint:`+e.algorithm+` `+e.value+`\r
`}),n},n.parseCryptoLine=function(e){let t=e.substring(9).split(` `);return{tag:parseInt(t[0],10),cryptoSuite:t[1],keyParams:t[2],sessionParams:t.slice(3)}},n.writeCryptoLine=function(e){return`a=crypto:`+e.tag+` `+e.cryptoSuite+` `+(typeof e.keyParams==`object`?n.writeCryptoKeyParams(e.keyParams):e.keyParams)+(e.sessionParams?` `+e.sessionParams.join(` `):``)+`\r
`},n.parseCryptoKeyParams=function(e){if(e.indexOf(`inline:`)!==0)return null;let t=e.substring(7).split(`|`);return{keyMethod:`inline`,keySalt:t[0],lifeTime:t[1],mkiValue:t[2]?t[2].split(`:`)[0]:void 0,mkiLength:t[2]?t[2].split(`:`)[1]:void 0}},n.writeCryptoKeyParams=function(e){return e.keyMethod+`:`+e.keySalt+(e.lifeTime?`|`+e.lifeTime:``)+(e.mkiValue&&e.mkiLength?`|`+e.mkiValue+`:`+e.mkiLength:``)},n.getCryptoParameters=function(e,t){return n.matchPrefix(e+t,`a=crypto:`).map(n.parseCryptoLine)},n.getIceParameters=function(e,t){let r=n.matchPrefix(e+t,`a=ice-ufrag:`)[0],i=n.matchPrefix(e+t,`a=ice-pwd:`)[0];return r&&i?{usernameFragment:r.substring(12),password:i.substring(10)}:null},n.writeIceParameters=function(e){let t=`a=ice-ufrag:`+e.usernameFragment+`\r
a=ice-pwd:`+e.password+`\r
`;return e.iceLite&&(t+=`a=ice-lite\r
`),t},n.parseRtpParameters=function(e){let t={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},r=n.splitLines(e)[0].split(` `);t.profile=r[2];for(let i=3;i<r.length;i++){let a=r[i],o=n.matchPrefix(e,`a=rtpmap:`+a+` `)[0];if(o){let r=n.parseRtpMap(o),i=n.matchPrefix(e,`a=fmtp:`+a+` `);switch(r.parameters=i.length?n.parseFmtp(i[0]):{},r.rtcpFeedback=n.matchPrefix(e,`a=rtcp-fb:`+a+` `).map(n.parseRtcpFb),t.codecs.push(r),r.name.toUpperCase()){case`RED`:case`ULPFEC`:t.fecMechanisms.push(r.name.toUpperCase())}}}n.matchPrefix(e,`a=extmap:`).forEach(e=>{t.headerExtensions.push(n.parseExtmap(e))});let i=n.matchPrefix(e,`a=rtcp-fb:* `).map(n.parseRtcpFb);return t.codecs.forEach(e=>{i.forEach(t=>{e.rtcpFeedback.find(e=>e.type===t.type&&e.parameter===t.parameter)||e.rtcpFeedback.push(t)})}),t},n.writeRtpDescription=function(e,t){let r=``;r+=`m=`+e+` `,r+=t.codecs.length>0?`9`:`0`,r+=` `+(t.profile||`UDP/TLS/RTP/SAVPF`)+` `,r+=t.codecs.map(e=>e.preferredPayloadType===void 0?e.payloadType:e.preferredPayloadType).join(` `)+`\r
`,r+=`c=IN IP4 0.0.0.0\r
`,r+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,t.codecs.forEach(e=>{r+=n.writeRtpMap(e),r+=n.writeFmtp(e),r+=n.writeRtcpFb(e)});let i=0;return t.codecs.forEach(e=>{e.maxptime>i&&(i=e.maxptime)}),i>0&&(r+=`a=maxptime:`+i+`\r
`),t.headerExtensions&&t.headerExtensions.forEach(e=>{r+=n.writeExtmap(e)}),r},n.parseRtpEncodingParameters=function(e){let t=[],r=n.parseRtpParameters(e),i=r.fecMechanisms.indexOf(`RED`)!==-1,a=r.fecMechanisms.indexOf(`ULPFEC`)!==-1,o=n.matchPrefix(e,`a=ssrc:`).map(e=>n.parseSsrcMedia(e)).filter(e=>e.attribute===`cname`),s=o.length>0&&o[0].ssrc,c,l=n.matchPrefix(e,`a=ssrc-group:FID`).map(e=>e.substring(17).split(` `).map(e=>parseInt(e,10)));l.length>0&&l[0].length>1&&l[0][0]===s&&(c=l[0][1]),r.codecs.forEach(e=>{if(e.name.toUpperCase()===`RTX`&&e.parameters.apt){let n={ssrc:s,codecPayloadType:parseInt(e.parameters.apt,10)};s&&c&&(n.rtx={ssrc:c}),t.push(n),i&&(n=JSON.parse(JSON.stringify(n)),n.fec={ssrc:s,mechanism:a?`red+ulpfec`:`red`},t.push(n))}}),t.length===0&&s&&t.push({ssrc:s});let u=n.matchPrefix(e,`b=`);return u.length&&(u=u[0].indexOf(`b=TIAS:`)===0?parseInt(u[0].substring(7),10):u[0].indexOf(`b=AS:`)===0?parseInt(u[0].substring(5),10)*1e3*.95-16e3:void 0,t.forEach(e=>{e.maxBitrate=u})),t},n.parseRtcpParameters=function(e){let t={},r=n.matchPrefix(e,`a=ssrc:`).map(e=>n.parseSsrcMedia(e)).filter(e=>e.attribute===`cname`)[0];r&&(t.cname=r.value,t.ssrc=r.ssrc);let i=n.matchPrefix(e,`a=rtcp-rsize`);return t.reducedSize=i.length>0,t.compound=i.length===0,t.mux=n.matchPrefix(e,`a=rtcp-mux`).length>0,t},n.writeRtcpParameters=function(e){let t=``;return e.reducedSize&&(t+=`a=rtcp-rsize\r
`),e.mux&&(t+=`a=rtcp-mux\r
`),e.ssrc!==void 0&&e.cname&&(t+=`a=ssrc:`+e.ssrc+` cname:`+e.cname+`\r
`),t},n.parseMsid=function(e){let t,r=n.matchPrefix(e,`a=msid:`);if(r.length===1)return t=r[0].substring(7).split(` `),{stream:t[0],track:t[1]};let i=n.matchPrefix(e,`a=ssrc:`).map(e=>n.parseSsrcMedia(e)).filter(e=>e.attribute===`msid`);if(i.length>0)return t=i[0].value.split(` `),{stream:t[0],track:t[1]}},n.parseSctpDescription=function(e){let t=n.parseMLine(e),r=n.matchPrefix(e,`a=max-message-size:`),i;r.length>0&&(i=parseInt(r[0].substring(19),10)),isNaN(i)&&(i=65536);let a=n.matchPrefix(e,`a=sctp-port:`);if(a.length>0)return{port:parseInt(a[0].substring(12),10),protocol:t.fmt,maxMessageSize:i};let o=n.matchPrefix(e,`a=sctpmap:`);if(o.length>0){let e=o[0].substring(10).split(` `);return{port:parseInt(e[0],10),protocol:e[1],maxMessageSize:i}}},n.writeSctpDescription=function(e,t){let n=[];return n=e.protocol===`DTLS/SCTP`?[`m=`+e.kind+` 9 `+e.protocol+` `+t.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,`a=sctpmap:`+t.port+` `+t.protocol+` 65535\r
`]:[`m=`+e.kind+` 9 `+e.protocol+` `+t.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,`a=sctp-port:`+t.port+`\r
`],t.maxMessageSize!==void 0&&n.push(`a=max-message-size:`+t.maxMessageSize+`\r
`),n.join(``)},n.generateSessionId=function(){return Math.random().toString().substr(2,22)},n.writeSessionBoilerplate=function(e,t,r){let i,a=t===void 0?2:t;return i=e||n.generateSessionId(),`v=0\r
o=`+(r||`thisisadapterortc`)+` `+i+` `+a+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`},n.getDirection=function(e,t){let r=n.splitLines(e);for(let e=0;e<r.length;e++)switch(r[e]){case`a=sendrecv`:case`a=sendonly`:case`a=recvonly`:case`a=inactive`:return r[e].substring(2)}return t?n.getDirection(t):`sendrecv`},n.getKind=function(e){return n.splitLines(e)[0].split(` `)[0].substring(2)},n.isRejected=function(e){return e.split(` `,2)[1]===`0`},n.parseMLine=function(e){let t=n.splitLines(e)[0].substring(2).split(` `);return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(` `)}},n.parseOLine=function(e){let t=n.matchPrefix(e,`o=`)[0].substring(2).split(` `);return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}},n.isValidSDP=function(e){if(typeof e!=`string`||e.length===0)return!1;let t=n.splitLines(e);for(let e=0;e<t.length;e++)if(t[e].length<2||t[e].charAt(1)!==`=`)return!1;return!0},typeof t==`object`&&(t.exports=n)})),nt=s({removeExtmapAllowMixed:()=>lt,shimAddIceCandidateNullOrEmpty:()=>ut,shimConnectionState:()=>ct,shimMaxMessageSize:()=>ot,shimParameterlessSetLocalDescription:()=>dt,shimRTCIceCandidate:()=>it,shimRTCIceCandidateRelayProtocol:()=>at,shimSendThrowTypeError:()=>st}),rt=l(tt());function it(e){if(!e.RTCIceCandidate||e.RTCIceCandidate&&`foundation`in e.RTCIceCandidate.prototype)return;let t=e.RTCIceCandidate;e.RTCIceCandidate=function(e){if(typeof e==`object`&&e.candidate&&e.candidate.indexOf(`a=`)===0&&(e=JSON.parse(JSON.stringify(e)),e.candidate=e.candidate.substring(2)),e.candidate&&e.candidate.length){let n=new t(e),r=rt.default.parseCandidate(e.candidate);for(let e in r)e in n||Object.defineProperty(n,e,{value:r[e]});return n.toJSON=function(){return{candidate:n.candidate,sdpMid:n.sdpMid,sdpMLineIndex:n.sdpMLineIndex,usernameFragment:n.usernameFragment}},n}return new t(e)},e.RTCIceCandidate.prototype=t.prototype,me(e,`icecandidate`,t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new e.RTCIceCandidate(t.candidate),writable:`false`}),t))}function at(e){!e.RTCIceCandidate||e.RTCIceCandidate&&`relayProtocol`in e.RTCIceCandidate.prototype||me(e,`icecandidate`,e=>{if(e.candidate){let t=rt.default.parseCandidate(e.candidate.candidate);t.type===`relay`&&(e.candidate.relayProtocol={0:`tls`,1:`tcp`,2:`udp`}[t.priority>>24])}return e})}function ot(e,t){if(!e.RTCPeerConnection||t.browser===`chrome`&&t.version>102||t.browser===`firefox`&&t.version>=113)return;`sctp`in e.RTCPeerConnection.prototype||Object.defineProperty(e.RTCPeerConnection.prototype,"sctp",{get(){return this._sctp===void 0?null:this._sctp}});let n=function(e){if(!e||!e.sdp)return!1;let t=rt.default.splitSections(e.sdp);return t.shift(),t.some(e=>{let t=rt.default.parseMLine(e);return t&&t.kind===`application`&&t.protocol.indexOf(`SCTP`)!==-1})},r=function(e){let t=e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(t===null||t.length<2)return-1;let n=parseInt(t[1],10);return n===n?n:-1},i=function(e){let n=65536;return t.browser===`firefox`&&(n=t.version<57?e===-1?16384:2147483637:t.version<60?t.version===57?65535:65536:2147483637),n},a=function(e,n){let r=65536;t.browser===`firefox`&&t.version===57&&(r=65535);let i=rt.default.matchPrefix(e.sdp,`a=max-message-size:`);return i.length>0?r=parseInt(i[0].substring(19),10):t.browser===`firefox`&&n!==-1&&(r=2147483637),r},o=e.RTCPeerConnection.prototype.setRemoteDescription;e.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,t.browser===`chrome`&&t.version>=76){let{sdpSemantics:e}=this.getConfiguration();e===`plan-b`&&Object.defineProperty(this,"sctp",{get(){return this._sctp===void 0?null:this._sctp},enumerable:!0,configurable:!0})}if(n(arguments[0])){let e=r(arguments[0]),t=i(e),n=a(arguments[0],e),o;o=t===0&&n===0?1/0:t===0||n===0?Math.max(t,n):Math.min(t,n);let s={};Object.defineProperty(s,"maxMessageSize",{get(){return o}}),this._sctp=s}return o.apply(this,arguments)}}function st(e,t){if(!(e.RTCPeerConnection&&`createDataChannel`in e.RTCPeerConnection.prototype)||t.browser===`chrome`&&t.version>=149||t.browser===`firefox`&&t.version>60)return;function n(e,t){let n=e.send;e.send=function(){let r=arguments[0],i=r.length||r.size||r.byteLength;if(e.readyState===`open`&&t.sctp&&i>t.sctp.maxMessageSize)throw TypeError(`Message too large (can send a maximum of `+t.sctp.maxMessageSize+` bytes)`);return n.apply(e,arguments)}}let r=e.RTCPeerConnection.prototype.createDataChannel;e.RTCPeerConnection.prototype.createDataChannel=function(){let e=r.apply(this,arguments);return n(e,this),e},me(e,`datachannel`,e=>(n(e.channel,e.target),e))}function ct(e){if(!e.RTCPeerConnection||`connectionState`in e.RTCPeerConnection.prototype)return;let t=e.RTCPeerConnection.prototype;Object.defineProperty(t,"connectionState",{get(){return{completed:`connected`,checking:`connecting`}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(t,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(e){this._onconnectionstatechange&&(this.removeEventListener(`connectionstatechange`,this._onconnectionstatechange),delete this._onconnectionstatechange),e&&this.addEventListener(`connectionstatechange`,this._onconnectionstatechange=e)},enumerable:!0,configurable:!0}),[`setLocalDescription`,`setRemoteDescription`].forEach(e=>{let n=t[e];t[e]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=e=>{let t=e.target;if(t._lastConnectionState!==t.connectionState){t._lastConnectionState=t.connectionState;let n=new Event(`connectionstatechange`,e);t.dispatchEvent(n)}return e},this.addEventListener(`iceconnectionstatechange`,this._connectionstatechangepoly)),n.apply(this,arguments)}})}function lt(e,t){if(!e.RTCPeerConnection||t.browser===`chrome`&&t.version>=71||t.browser===`safari`&&t._safariVersion>=13.1)return;let n=e.RTCPeerConnection.prototype.setRemoteDescription;e.RTCPeerConnection.prototype.setRemoteDescription=function(t){if(t&&t.sdp&&t.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){let n=t.sdp.split(`
`).filter(e=>e.trim()!==`a=extmap-allow-mixed`).join(`
`);e.RTCSessionDescription&&t instanceof e.RTCSessionDescription?arguments[0]=new e.RTCSessionDescription({type:t.type,sdp:n}):t.sdp=n}return n.apply(this,arguments)}}function ut(e,t){if(!(e.RTCPeerConnection&&e.RTCPeerConnection.prototype))return;let n=e.RTCPeerConnection.prototype.addIceCandidate;n&&n.length!==0&&(e.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(t.browser===`chrome`&&t.version<78||t.browser===`firefox`&&t.version<68||t.browser===`safari`)&&arguments[0]&&arguments[0].candidate===``?Promise.resolve():n.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function dt(e,t){if(!(e.RTCPeerConnection&&e.RTCPeerConnection.prototype))return;let n=e.RTCPeerConnection.prototype.setLocalDescription;n&&n.length!==0&&(e.RTCPeerConnection.prototype.setLocalDescription=function(){let e=arguments[0]||{};if(typeof e!=`object`||e.type&&e.sdp)return n.apply(this,arguments);if(e={type:e.type,sdp:e.sdp},!e.type)switch(this.signalingState){case`stable`:case`have-local-offer`:case`have-remote-pranswer`:e.type=`offer`;break;default:e.type=`answer`}return e.sdp||e.type!==`offer`&&e.type!==`answer`?n.apply(this,[e]):(e.type===`offer`?this.createOffer:this.createAnswer).apply(this).then(e=>n.apply(this,[e]))})}function ft({window:e}={},t={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){let n=_e,r=ye(e),i={browserDetails:r,commonShim:nt,extractVersion:pe,disableLog:he,disableWarnings:ge,sdp:rt};switch(r.browser){case`chrome`:if(!Ee||!N||!t.shimChrome)return n(`Chrome shim is not included in this adapter release.`),i;if(r.version===null)return n(`Chrome shim can not determine version, not shimming.`),i;n(`adapter.js shimming chrome.`),i.browserShim=Ee,ut(e,r),dt(e,r),Te(e,r),j(e,r),N(e,r),De(e,r),Ae(e,r),Oe(e,r),ke(e,r),P(e,r),it(e,r),at(e,r),ct(e,r),ot(e,r),st(e,r),lt(e,r);break;case`firefox`:if(!Ne||!Fe||!t.shimFirefox)return n(`Firefox shim is not included in this adapter release.`),i;n(`adapter.js shimming firefox.`),i.browserShim=Ne,ut(e,r),dt(e,r),je(e,r),Fe(e,r),Ie(e,r),Pe(e,r),ze(e,r),Le(e,r),Re(e,r),Be(e,r),Ve(e,r),He(e,r),Ue(e,r),We(e,r),it(e,r),ct(e,r),ot(e,r),st(e,r);break;case`safari`:if(!Ge||!t.shimSafari)return n(`Safari shim is not included in this adapter release.`),i;n(`adapter.js shimming safari.`),i.browserShim=Ge,ut(e,r),dt(e,r),Ze(e,r),$e(e,r),Je(e,r),Ke(e,r),qe(e,r),Qe(e,r),Ye(e,r),et(e,r),it(e,r),at(e,r),ot(e,r),st(e,r),lt(e,r);break;default:n(`Unsupported browser!`)}return i}var pt=ft({window:typeof window>`u`?void 0:window});function mt(e,t,n,r){Object.defineProperty(e,t,{get:n,set:r,enumerable:!0,configurable:!0})}var ht=class{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{let t=[],n=e.byteLength,r=Math.ceil(n/this.chunkedMTU),i=0,a=0;for(;a<n;){let o=Math.min(n,a+this.chunkedMTU),s=e.slice(a,o),c={__peerData:this._dataCount,n:i,data:s,total:r};t.push(c),a=o,i++}return this._dataCount++,t}}};function gt(e){let t=0;for(let n of e)t+=n.byteLength;let n=new Uint8Array(t),r=0;for(let t of e)n.set(t,r),r+=t.byteLength;return n}var _t=pt.default||pt,vt=new class{isWebRTCSupported(){return typeof RTCPeerConnection<`u`}isBrowserSupported(){let e=this.getBrowser(),t=this.getVersion();return this.supportedBrowsers.includes(e)?e===`chrome`?t>=this.minChromeVersion:e===`firefox`?t>=this.minFirefoxVersion:e===`safari`&&!this.isIOS&&t>=this.minSafariVersion:!1}getBrowser(){return _t.browserDetails.browser}getVersion(){return _t.browserDetails.version||0}isUnifiedPlanSupported(){let e=this.getBrowser(),t=_t.browserDetails.version||0;if(e===`chrome`&&t<this.minChromeVersion)return!1;if(e===`firefox`&&t>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!(`currentDirection`in RTCRtpTransceiver.prototype))return!1;let n,r=!1;try{n=new RTCPeerConnection,n.addTransceiver(`audio`),r=!0}catch{}finally{n&&n.close()}return r}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<`u`&&[`iPad`,`iPhone`,`iPod`].includes(navigator.platform),this.supportedBrowsers=[`firefox`,`chrome`,`safari`],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},yt=e=>!e||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(e),bt=()=>Math.random().toString(36).slice(2),xt={iceServers:[{urls:`stun:stun.l.google.com:19302`},{urls:[`turn:eu-0.turn.peerjs.com:3478`,`turn:us-0.turn.peerjs.com:3478`],username:`peerjs`,credential:`peerjsp`}],sdpSemantics:`unified-plan`},St=new class extends ht{noop(){}blobToArrayBuffer(e,t){let n=new FileReader;return n.onload=function(e){e.target&&t(e.target.result)},n.readAsArrayBuffer(e),n}binaryStringToArrayBuffer(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t.buffer}isSecure(){return location.protocol===`https:`}constructor(...e){super(...e),this.CLOUD_HOST=`0.peerjs.com`,this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=xt,this.browser=vt.getBrowser(),this.browserVersion=vt.getVersion(),this.pack=ce,this.unpack=se,this.supports=function(){let e={browser:vt.isBrowserSupported(),webRTC:vt.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!e.webRTC)return e;let t;try{t=new RTCPeerConnection(xt),e.audioVideo=!0;let n;try{n=t.createDataChannel(`_PEERJSTEST`,{ordered:!0}),e.data=!0,e.reliable=!!n.ordered;try{n.binaryType=`blob`,e.binaryBlob=!vt.isIOS}catch{}}catch{}finally{n&&n.close()}}catch{}finally{t&&t.close()}return e}(),this.validateId=yt,this.randomToken=bt}},Ct=`PeerJS: `,F=new class{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...t){let n=[Ct,...t];for(let e in n)n[e]instanceof Error&&(n[e]=`(`+n[e].name+`) `+n[e].message);e>=3?console.log(...n):e>=2?console.warn(`WARNING`,...n):e>=1&&console.error(`ERROR`,...n)}constructor(){this._logLevel=0}},wt={},Tt=Object.prototype.hasOwnProperty,Et=`~`;function Dt(){}Object.create&&(Dt.prototype=Object.create(null),new Dt().__proto__||(Et=!1));function Ot(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function kt(e,t,n,r,i){if(typeof n!=`function`)throw TypeError(`The listener must be a function`);var a=new Ot(n,r||e,i),o=Et?Et+t:t;return e._events[o]?e._events[o].fn?e._events[o]=[e._events[o],a]:e._events[o].push(a):(e._events[o]=a,e._eventsCount++),e}function At(e,t){--e._eventsCount===0?e._events=new Dt:delete e._events[t]}function jt(){this._events=new Dt,this._eventsCount=0}jt.prototype.eventNames=function(){var e=[],t,n;if(this._eventsCount===0)return e;for(n in t=this._events)Tt.call(t,n)&&e.push(Et?n.slice(1):n);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e},jt.prototype.listeners=function(e){var t=Et?Et+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var r=0,i=n.length,a=Array(i);r<i;r++)a[r]=n[r].fn;return a},jt.prototype.listenerCount=function(e){var t=Et?Et+e:e,n=this._events[t];return n?n.fn?1:n.length:0},jt.prototype.emit=function(e,t,n,r,i,a){var o=Et?Et+e:e;if(!this._events[o])return!1;var s=this._events[o],c=arguments.length,l,u;if(s.fn){switch(s.once&&this.removeListener(e,s.fn,void 0,!0),c){case 1:return s.fn.call(s.context),!0;case 2:return s.fn.call(s.context,t),!0;case 3:return s.fn.call(s.context,t,n),!0;case 4:return s.fn.call(s.context,t,n,r),!0;case 5:return s.fn.call(s.context,t,n,r,i),!0;case 6:return s.fn.call(s.context,t,n,r,i,a),!0}for(u=1,l=Array(c-1);u<c;u++)l[u-1]=arguments[u];s.fn.apply(s.context,l)}else{var d=s.length,f;for(u=0;u<d;u++)switch(s[u].once&&this.removeListener(e,s[u].fn,void 0,!0),c){case 1:s[u].fn.call(s[u].context);break;case 2:s[u].fn.call(s[u].context,t);break;case 3:s[u].fn.call(s[u].context,t,n);break;case 4:s[u].fn.call(s[u].context,t,n,r);break;default:if(!l)for(f=1,l=Array(c-1);f<c;f++)l[f-1]=arguments[f];s[u].fn.apply(s[u].context,l)}}return!0},jt.prototype.on=function(e,t,n){return kt(this,e,t,n,!1)},jt.prototype.once=function(e,t,n){return kt(this,e,t,n,!0)},jt.prototype.removeListener=function(e,t,n,r){var i=Et?Et+e:e;if(!this._events[i])return this;if(!t)return At(this,i),this;var a=this._events[i];if(a.fn)a.fn===t&&(!r||a.once)&&(!n||a.context===n)&&At(this,i);else{for(var o=0,s=[],c=a.length;o<c;o++)(a[o].fn!==t||r&&!a[o].once||n&&a[o].context!==n)&&s.push(a[o]);s.length?this._events[i]=s.length===1?s[0]:s:At(this,i)}return this},jt.prototype.removeAllListeners=function(e){var t;return e?(t=Et?Et+e:e,this._events[t]&&At(this,t)):(this._events=new Dt,this._eventsCount=0),this},jt.prototype.off=jt.prototype.removeListener,jt.prototype.addListener=jt.prototype.on,jt.prefixed=Et,jt.EventEmitter=jt,wt=jt;var Mt={};mt(Mt,`ConnectionType`,()=>Nt),mt(Mt,`PeerErrorType`,()=>Pt),mt(Mt,`BaseConnectionErrorType`,()=>Ft),mt(Mt,`DataConnectionErrorType`,()=>It),mt(Mt,`SerializationType`,()=>Lt),mt(Mt,`SocketEventType`,()=>Rt),mt(Mt,`ServerMessageType`,()=>zt);var Nt=function(e){return e.Data=`data`,e.Media=`media`,e}({}),Pt=function(e){return e.BrowserIncompatible=`browser-incompatible`,e.Disconnected=`disconnected`,e.InvalidID=`invalid-id`,e.InvalidKey=`invalid-key`,e.Network=`network`,e.PeerUnavailable=`peer-unavailable`,e.SslUnavailable=`ssl-unavailable`,e.ServerError=`server-error`,e.SocketError=`socket-error`,e.SocketClosed=`socket-closed`,e.UnavailableID=`unavailable-id`,e.WebRTC=`webrtc`,e}({}),Ft=function(e){return e.NegotiationFailed=`negotiation-failed`,e.ConnectionClosed=`connection-closed`,e}({}),It=function(e){return e.NotOpenYet=`not-open-yet`,e.MessageToBig=`message-too-big`,e}({}),Lt=function(e){return e.Binary=`binary`,e.BinaryUTF8=`binary-utf8`,e.JSON=`json`,e.None=`raw`,e}({}),Rt=function(e){return e.Message=`message`,e.Disconnected=`disconnected`,e.Error=`error`,e.Close=`close`,e}({}),zt=function(e){return e.Heartbeat=`HEARTBEAT`,e.Candidate=`CANDIDATE`,e.Offer=`OFFER`,e.Answer=`ANSWER`,e.Open=`OPEN`,e.Error=`ERROR`,e.IdTaken=`ID-TAKEN`,e.InvalidKey=`INVALID-KEY`,e.Leave=`LEAVE`,e.Expire=`EXPIRE`,e}({}),Bt=`1.5.5`,Vt=class extends wt.EventEmitter{constructor(e,t,n,r,i,a=5e3){super(),this.pingInterval=a,this._disconnected=!0,this._messagesQueue=[];let o=e?`wss://`:`ws://`;this._baseUrl=o+t+`:`+n+r+`peerjs?key=`+i}start(e,t){this._id=e;let n=`${this._baseUrl}&id=${e}&token=${t}`;!this._socket&&this._disconnected&&(this._socket=new WebSocket(n+`&version=1.5.5`),this._disconnected=!1,this._socket.onmessage=e=>{let t;try{t=JSON.parse(e.data),F.log(`Server message received:`,t)}catch{F.log(`Invalid server message`,e.data);return}this.emit(Rt.Message,t)},this._socket.onclose=e=>{this._disconnected||(F.log(`Socket closed.`,e),this._cleanup(),this._disconnected=!0,this.emit(Rt.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),F.log(`Socket open`),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){F.log(`Cannot send heartbeat, because socket closed`);return}let e=JSON.stringify({type:zt.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){let e=[...this._messagesQueue];this._messagesQueue=[];for(let t of e)this.send(t)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(Rt.Error,`Invalid message`);return}if(!this._wsOpen())return;let t=JSON.stringify(e);this._socket.send(t)}close(){this._disconnected||=(this._cleanup(),!0)}_cleanup(){this._socket&&=(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),void 0),clearTimeout(this._wsPingTimer)}},Ht=class{constructor(e){this.connection=e}startConnection(e){let t=this._startPeerConnection();if(this.connection.peerConnection=t,this.connection.type===Nt.Media&&e._stream&&this._addTracksToConnection(e._stream,t),e.originator){let n=this.connection,r={ordered:!!e.reliable},i=t.createDataChannel(n.label,r);n._initializeDataChannel(i),this._makeOffer()}else this.handleSDP(`OFFER`,e.sdp)}_startPeerConnection(){F.log(`Creating RTCPeerConnection.`);let e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){let t=this.connection.peer,n=this.connection.connectionId,r=this.connection.type,i=this.connection.provider;F.log(`Listening for ICE candidates.`),e.onicecandidate=e=>{e.candidate&&e.candidate.candidate&&(F.log(`Received ICE candidates for ${t}:`,e.candidate),i.socket.send({type:zt.Candidate,payload:{candidate:e.candidate,type:r,connectionId:n},dst:t}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case`failed`:F.log(`iceConnectionState is failed, closing connections to `+t),this.connection.emitError(Ft.NegotiationFailed,`Negotiation of connection to `+t+` failed.`),this.connection.close();break;case`closed`:F.log(`iceConnectionState is closed, closing connections to `+t),this.connection.emitError(Ft.ConnectionClosed,`Connection to `+t+` closed.`),this.connection.close();break;case`disconnected`:F.log(`iceConnectionState changed to disconnected on the connection with `+t);break;case`completed`:e.onicecandidate=()=>{}}this.connection.emit(`iceStateChanged`,e.iceConnectionState)},F.log(`Listening for data channel`),e.ondatachannel=e=>{F.log(`Received data channel`);let r=e.channel;i.getConnection(t,n)._initializeDataChannel(r)},F.log(`Listening for remote stream`),e.ontrack=e=>{F.log(`Received remote stream`);let r=e.streams[0],a=i.getConnection(t,n);if(a.type===Nt.Media){let e=a;this._addStreamToMediaConnection(r,e)}}}cleanup(){F.log(`Cleaning up PeerConnection to `+this.connection.peer);let e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};let t=e.signalingState!==`closed`,n=!1,r=this.connection.dataChannel;r&&(n=!!r.readyState&&r.readyState!==`closed`),(t||n)&&e.close()}async _makeOffer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createOffer(this.connection.options.constraints);F.log(`Created offer.`),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform==`function`&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),F.log(`Set localDescription:`,n,`for:${this.connection.peer}`);let r={sdp:n,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===Nt.Data){let e=this.connection;r={...r,label:e.label,reliable:e.reliable,serialization:e.serialization}}t.socket.send({type:zt.Offer,payload:r,dst:this.connection.peer})}catch(e){e!=`OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer`&&(t.emitError(Pt.WebRTC,e),F.log(`Failed to setLocalDescription, `,e))}}catch(e){t.emitError(Pt.WebRTC,e),F.log(`Failed to createOffer, `,e)}}async _makeAnswer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createAnswer();F.log(`Created answer.`),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform==`function`&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),F.log(`Set localDescription:`,n,`for:${this.connection.peer}`),t.socket.send({type:zt.Answer,payload:{sdp:n,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(e){t.emitError(Pt.WebRTC,e),F.log(`Failed to setLocalDescription, `,e)}}catch(e){t.emitError(Pt.WebRTC,e),F.log(`Failed to create answer, `,e)}}async handleSDP(e,t){t=new RTCSessionDescription(t);let n=this.connection.peerConnection,r=this.connection.provider;F.log(`Setting remote description`,t);let i=this;try{await n.setRemoteDescription(t),F.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e===`OFFER`&&await i._makeAnswer()}catch(e){r.emitError(Pt.WebRTC,e),F.log(`Failed to setRemoteDescription, `,e)}}async handleCandidate(e){F.log(`handleCandidate:`,e);try{await this.connection.peerConnection.addIceCandidate(e),F.log(`Added ICE candidate for:${this.connection.peer}`)}catch(e){this.connection.provider.emitError(Pt.WebRTC,e),F.log(`Failed to handleCandidate, `,e)}}_addTracksToConnection(e,t){if(F.log(`add tracks from stream ${e.id} to peer connection`),!t.addTrack)return F.error(`Your browser does't support RTCPeerConnection#addTrack. Ignored.`);e.getTracks().forEach(n=>{t.addTrack(n,e)})}_addStreamToMediaConnection(e,t){F.log(`add stream ${e.id} to media connection ${t.connectionId}`),t.addStream(e)}},Ut=class extends wt.EventEmitter{emitError(e,t){F.error(`Error:`,t),this.emit(`error`,new Wt(`${e}`,t))}},Wt=class extends Error{constructor(e,t){typeof t==`string`?super(t):(super(),Object.assign(this,t)),this.type=e}},Gt=class extends Ut{get open(){return this._open}constructor(e,t,n){super(),this.peer=e,this.provider=t,this.options=n,this._open=!1,this.metadata=n.metadata}},Kt=class e extends Gt{static#e=this.ID_PREFIX=`mc_`;get type(){return Nt.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(t,n,r){super(t,n,r),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||e.ID_PREFIX+St.randomToken(),this._negotiator=new Ht(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{F.log(`DC#${this.connectionId} dc connection success`),this.emit(`willCloseOnRemote`)},this.dataChannel.onclose=()=>{F.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){F.log(`Receiving stream`,e),this._remoteStream=e,super.emit(`stream`,e)}handleMessage(e){let t=e.type,n=e.payload;switch(e.type){case zt.Answer:this._negotiator.handleSDP(t,n.sdp),this._open=!0;break;case zt.Candidate:this._negotiator.handleCandidate(n.candidate);break;default:F.warn(`Unrecognized message type:${t} from peer:${this.peer}`)}}answer(e,t={}){if(this._localStream){F.warn(`Local stream already exists on this MediaConnection. Are you answering a call twice?`);return}this._localStream=e,t&&t.sdpTransform&&(this.options.sdpTransform=t.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});let n=this.provider._getMessages(this.connectionId);for(let e of n)this.handleMessage(e);this._open=!0}close(){this._negotiator&&=(this._negotiator.cleanup(),null),this._localStream=null,this._remoteStream=null,this.provider&&=(this.provider._removeConnection(this),null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit(`close`))}},qt=class{constructor(e){this._options=e}_buildRequest(e){let t=this._options.secure?`https`:`http`,{host:n,port:r,path:i,key:a}=this._options,o=new URL(`${t}://${n}:${r}${i}${a}/${e}`);return o.searchParams.set(`ts`,`${Date.now()}${Math.random()}`),o.searchParams.set(`version`,Bt),fetch(o.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{let e=await this._buildRequest(`id`);if(e.status!==200)throw Error(`Error. Status:${e.status}`);return e.text()}catch(e){F.error(`Error retrieving ID`,e);let t=``;throw this._options.path===`/`&&this._options.host!==St.CLOUD_HOST&&(t=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),Error(`Could not get an ID from the server.`+t)}}async listAllPeers(){try{let e=await this._buildRequest(`peers`);if(e.status!==200){if(e.status===401){let e=``;throw e=this._options.host===St.CLOUD_HOST?`It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.`:"You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",Error(`It doesn't look like you have permission to list peers IDs. `+e)}throw Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw F.error(`Error retrieving list peers`,e),Error(`Could not get list peers from the server.`+e)}}},Jt=class e extends Gt{static#e=this.ID_PREFIX=`dc_`;static#t=this.MAX_BUFFERED_AMOUNT=8388608;get type(){return Nt.Data}constructor(t,n,r){super(t,n,r),this.connectionId=this.options.connectionId||e.ID_PREFIX+bt(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new Ht(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{F.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit(`open`)},this.dataChannel.onmessage=e=>{F.log(`DC#${this.connectionId} dc onmessage:`,e.data)},this.dataChannel.onclose=()=>{F.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){e?.flush?this.send({__peerData:{type:`close`}}):(this._negotiator&&=(this._negotiator.cleanup(),null),this.provider&&=(this.provider._removeConnection(this),null),this.dataChannel&&=(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,null),this.open&&(this._open=!1,super.emit(`close`)))}send(e,t=!1){if(!this.open)this.emitError(It.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");else return this._send(e,t)}async handleMessage(e){let t=e.payload;switch(e.type){case zt.Answer:await this._negotiator.handleSDP(e.type,t.sdp);break;case zt.Candidate:await this._negotiator.handleCandidate(t.candidate);break;default:F.warn(`Unrecognized message type:`,e.type,`from peer:`,this.peer)}}},Yt=class extends Jt{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType=`arraybuffer`,this.dataChannel.addEventListener(`message`,e=>this._handleDataMessage(e))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>Jt.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(e){return F.error(`DC#:${this.connectionId} Error when sending:`,e),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;let e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){e?.flush?this.send({__peerData:{type:`close`}}):(this._buffer=[],this._bufferSize=0,super.close())}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}},Xt=class extends Yt{close(e){super.close(e),this._chunkedData={}}constructor(e,t,n){super(e,t,n),this.chunker=new ht,this.serialization=Lt.Binary,this._chunkedData={}}_handleDataMessage({data:e}){let t=se(e),n=t.__peerData;if(n){if(n.type===`close`){this.close();return}this._handleChunk(t)}else this.emit(`data`,t)}_handleChunk(e){let t=e.__peerData,n=this._chunkedData[t]||{data:[],count:0,total:e.total};if(n.data[e.n]=new Uint8Array(e.data),n.count++,this._chunkedData[t]=n,n.total===n.count){delete this._chunkedData[t];let e=gt(n.data);this._handleDataMessage({data:e})}}_send(e,t){let n=ce(e);if(n instanceof Promise)return this._send_blob(n);!t&&n.byteLength>this.chunker.chunkedMTU?this._sendChunks(n):this._bufferedSend(n)}async _send_blob(e){let t=await e;t.byteLength>this.chunker.chunkedMTU?this._sendChunks(t):this._bufferedSend(t)}_sendChunks(e){let t=this.chunker.chunk(e);F.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);for(let e of t)this.send(e,!0)}},Zt=class extends Yt{_handleDataMessage({data:e}){super.emit(`data`,e)}_send(e,t){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=Lt.None}},Qt=class extends Yt{_handleDataMessage({data:e}){let t=this.parse(this.decoder.decode(e)),n=t.__peerData;n&&n.type===`close`?this.close():this.emit(`data`,t)}_send(e,t){let n=this.encoder.encode(this.stringify(e));n.byteLength>=St.chunkedMTU?this.emitError(It.MessageToBig,`Message too big for JSON channel`):this._bufferedSend(n)}constructor(...e){super(...e),this.serialization=Lt.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}},$t=class e extends Ut{static#e=this.DEFAULT_KEY=`peerjs`;get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){let e=Object.create(null);for(let[t,n]of this._connections)e[t]=n;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(t,n){super(),this._serializers={raw:Zt,json:Qt,binary:Xt,"binary-utf8":Xt,default:Xt},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let r;t&&t.constructor==Object?n=t:t&&(r=t.toString()),n={debug:0,host:St.CLOUD_HOST,port:St.CLOUD_PORT,path:`/`,key:e.DEFAULT_KEY,token:St.randomToken(),config:St.defaultConfig,referrerPolicy:`strict-origin-when-cross-origin`,serializers:{},...n},this._options=n,this._serializers={...this._serializers,...this.options.serializers},this._options.host===`/`&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!==`/`&&(this._options.path=`/`+this._options.path),this._options.path[this._options.path.length-1]!==`/`&&(this._options.path+=`/`)),this._options.secure===void 0&&this._options.host!==St.CLOUD_HOST?this._options.secure=St.isSecure():this._options.host==St.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&F.setLogFunction(this._options.logFunction),F.logLevel=this._options.debug||0,this._api=new qt(n),this._socket=this._createServerConnection(),!St.supports.audioVideo&&!St.supports.data?this._delayedAbort(Pt.BrowserIncompatible,`The current browser does not support WebRTC`):r&&!St.validateId(r)?this._delayedAbort(Pt.InvalidID,`ID "${r}" is invalid`):r?this._initialize(r):this._api.retrieveId().then(e=>this._initialize(e)).catch(e=>this._abort(Pt.ServerError,e))}_createServerConnection(){let e=new Vt(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(Rt.Message,e=>{this._handleMessage(e)}),e.on(Rt.Error,e=>{this._abort(Pt.SocketError,e)}),e.on(Rt.Disconnected,()=>{this.disconnected||(this.emitError(Pt.Network,`Lost connection to server.`),this.disconnect())}),e.on(Rt.Close,()=>{this.disconnected||this._abort(Pt.SocketClosed,`Underlying socket is already closed.`)}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){let t=e.type,n=e.payload,r=e.src;switch(t){case zt.Open:this._lastServerId=this.id,this._open=!0,this.emit(`open`,this.id);break;case zt.Error:this._abort(Pt.ServerError,n.msg);break;case zt.IdTaken:this._abort(Pt.UnavailableID,`ID "${this.id}" is taken`);break;case zt.InvalidKey:this._abort(Pt.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case zt.Leave:F.log(`Received leave message from ${r}`),this._cleanupPeer(r),this._connections.delete(r);break;case zt.Expire:this.emitError(Pt.PeerUnavailable,`Could not connect to peer ${r}`);break;case zt.Offer:{let e=n.connectionId,t=this.getConnection(r,e);if(t&&(t.close(),F.warn(`Offer received for existing Connection ID:${e}`)),n.type===Nt.Media){let i=new Kt(r,this,{connectionId:e,_payload:n,metadata:n.metadata});t=i,this._addConnection(r,t),this.emit(`call`,i)}else if(n.type===Nt.Data){let i=new this._serializers[n.serialization](r,this,{connectionId:e,_payload:n,metadata:n.metadata,label:n.label,serialization:n.serialization,reliable:n.reliable});t=i,this._addConnection(r,t),this.emit(`connection`,i)}else{F.warn(`Received malformed connection type:${n.type}`);return}let i=this._getMessages(e);for(let e of i)t.handleMessage(e);break}default:{if(!n){F.warn(`You received a malformed message from ${r} of type ${t}`);return}let i=n.connectionId,a=this.getConnection(r,i);a&&a.peerConnection?a.handleMessage(e):i?this._storeMessage(i,e):F.warn(`You received an unrecognized message:`,e);break}}}_storeMessage(e,t){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(t)}_getMessages(e){let t=this._lostMessages.get(e);return t?(this._lostMessages.delete(e),t):[]}connect(e,t={}){if(t={serialization:`default`,...t},this.disconnected){F.warn(`You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.`),this.emitError(Pt.Disconnected,`Cannot connect to new Peer after disconnecting from server.`);return}let n=new this._serializers[t.serialization](e,this,t);return this._addConnection(e,n),n}call(e,t,n={}){if(this.disconnected){F.warn(`You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.`),this.emitError(Pt.Disconnected,`Cannot connect to new Peer after disconnecting from server.`);return}if(!t){F.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}let r=new Kt(e,this,{...n,_stream:t});return this._addConnection(e,r),r}_addConnection(e,t){F.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(t)}_removeConnection(e){let t=this._connections.get(e.peer);if(t){let n=t.indexOf(e);n!==-1&&t.splice(n,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,t){let n=this._connections.get(e);if(!n)return null;for(let e of n)if(e.connectionId===t)return e;return null}_delayedAbort(e,t){setTimeout(()=>{this._abort(e,t)},0)}_abort(e,t){F.error(`Aborting!`),this.emitError(e,t),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(F.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit(`close`))}_cleanup(){for(let e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){let t=this._connections.get(e);if(t)for(let e of t)e.close()}disconnect(){if(this.disconnected)return;let e=this.id;F.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit(`disconnected`,e)}reconnect(){if(this.disconnected&&!this.destroyed)F.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else if(this.destroyed)throw Error(`This peer cannot reconnect to the server. It has already been destroyed.`);else if(!this.disconnected&&!this.open)F.error(`In a hurry? We're still trying to make the initial connection!`);else throw Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}listAllPeers(e=e=>{}){this._api.listAllPeers().then(t=>e(t)).catch(e=>this._abort(Pt.ServerError,e))}},en=`neonstrike-v1-`,tn=1e4,I=Object.freeze({HELLO:`hello`,WELCOME:`welcome`,REJECT:`reject`,STATE:`state`,SNAPSHOT:`snapshot`,HIT:`hit`,HAZARD:`hazard`,HEAL:`heal`,RESPAWN:`respawn`,FIRE:`fire`,PROJECTILE:`projectile`,DAMAGE:`damage`,KILL:`kill`,LOADOUT:`loadout`,MATCH_START:`match-start`,PING:`ping`,PONG:`pong`,BYE:`bye`,CHAT:`chat`});function nn(e){return`${en}${String(e).toLowerCase()}`}function rn(e={}){let t=!!e.host,n={debug:1,config:{...t?{}:{iceServers:[{urls:`stun:stun.l.google.com:19302`},{urls:`stun:stun1.l.google.com:19302`}]},iceCandidatePoolSize:4}};if(t){n.host=String(e.host).trim(),n.secure=!!e.secure;let t=Number(e.port);Number.isFinite(t)&&t>0&&(n.port=t),n.path=e.path?.trim()||`/`,n.key=e.key?.trim()||`peerjs`}return n}function an(e){let t=e?.type||e?.name||`unknown`;switch(t){case`unavailable-id`:return{code:`room-in-use`,message:`このルームコードは既に使用されています。別のコードを試してください。`};case`peer-unavailable`:return{code:`host-not-found`,message:`ホストが見つかりません。ルームコードを確認してください。`};case`network`:case`server-error`:case`socket-error`:case`socket-closed`:return{code:`signal-error`,message:`シグナリングサーバーに接続できません。回線または詳細設定を確認してください。`};case`browser-incompatible`:return{code:`unsupported`,message:`このブラウザはWebRTC / PeerJSに対応していません。`};case`webrtc`:return{code:`webrtc`,message:`P2P接続の確立に失敗しました。別のネットワークで再試行してください。`};default:return{code:t,message:`接続エラーが発生しました (${t})。`}}}function on(e){if(e==null)return null;if(typeof e==`object`&&!(e instanceof Blob)&&!(e instanceof ArrayBuffer))return e;try{if(typeof e==`string`)return JSON.parse(e)}catch{return null}return null}var sn=class extends u{constructor({role:e,code:t,name:n,netConfig:r}){super(),this.role=e,this.code=String(t||``).toUpperCase(),this.name=_(n),this.netConfig=r||{},this.peer=null,this.conn=null,this.selfId=null,this.opened=!1,this.sessionReady=!1,this.closed=!1,this.peerId=e===`host`?nn(this.code):null,this.connectionsByPlayer=new Map,this.playersByPeer=new Map,this.lastDataAt=0,this.lastPingAt=0,this.ping=null,this._pendingMessages=[],this._pendingJoins=new Map,this._joinTimers=new Map,this._connectTimer=null,this._pingTimer=null,this._healthTimer=null,this._connSeq=0,this._welcomeReceived=!1,this._left=!1,this._limiter=new Map}on(e,t){let n=super.on(e,t);return e===`join-request`&&this._flushPendingJoins(),n}get isHost(){return this.role===`host`}get hostId(){return nn(this.code)}_setFailure(e){return this.lastError=an(e),this.emit(`fatal-error`,this.lastError),this.lastError}async openHost(){if(!y(this.code))throw Error(`invalid-room-code`);if(this._createPeer(this.peerId),this.peer.on(`connection`,e=>this._handleIncoming(e)),await this._waitForPeerOpen(),this.closed)throw Error(`closed`);return this.opened=!0,this.selfId=`host`,this.peer.on(`disconnected`,()=>{this.closed||(this.emit(`signaling-lost`),this._tryReconnect())}),this.peer.on(`error`,e=>this._handleRuntimePeerError(e)),this._startHealthTimer(),this}async connectToHost(){if(!y(this.code))throw Error(`invalid-room-code`);if(this._createPeer(void 0),await this._waitForPeerOpen(),this.closed)throw Error(`closed`);let e=await new Promise((e,t)=>{let n=!1,r=(e,t)=>{n||(n=!0,clearTimeout(i),e(t))},i=setTimeout(()=>{r(t,{code:`timeout`,message:`接続がタイムアウトしました。ホストの状態とルームコードを確認してください。`}),this._safeCloseConnection()},tn),a=this.peer.connect(this.hostId,{reliable:!0,serialization:`json`,metadata:{name:this.name,protocol:1}});a?(this.conn=a,a.on(`open`,()=>{this.lastDataAt=performance.now(),this._sendRaw({t:I.HELLO,v:1,name:this.name,clientTime:Date.now()})}),a.on(`data`,n=>{this.lastDataAt=performance.now();let i=on(n);i&&(i.t===I.WELCOME&&!this._welcomeReceived?(this._welcomeReceived=!0,this.opened=!0,this.selfId=i.selfId,this.ping=0,this._startGuestTimers(),r(e,i)):i.t===I.REJECT?(r(t,{code:i.code||`rejected`,message:i.reason||`ホストに接続を拒否されました。`}),this._safeCloseConnection()):this._dispatchHostMessage(i))}),a.on(`close`,()=>{this._welcomeReceived?this.closed||this._handleHostLost(`ホストとの接続が切断されました。`):r(t,{code:`connection-closed`,message:`ホストとの接続が確立できませんでした。`})}),a.on(`error`,e=>{console.warn(`[PeerRoom] data connection error`,e),this._welcomeReceived||r(t,an(e))}),this.peer.on(`error`,e=>{let n=an(e);this._welcomeReceived?n.code===`signal-error`&&this.emit(`signaling-lost`):r(t,n)}),this.peer.on(`disconnected`,()=>{this.closed||this.emit(`signaling-lost`)})):r(t,{code:`connection-failed`,message:`接続を開始できませんでした。`})});return this.opened=!0,this.selfId=e.selfId,e}_createPeer(e){let t=rn(this.netConfig);try{this.peer=e?new $t(e,t):new $t(t)}catch{throw this.lastError={code:`peer-init`,message:`PeerJSの初期化に失敗しました。`},this.lastError}}_waitForPeerOpen(){return new Promise((e,t)=>{if(!this.peer){t({code:`peer-init`,message:`PeerJSが初期化されていません。`});return}let n=!1,r=setTimeout(()=>{if(!n){n=!0;try{this.peer.destroy()}catch{}t({code:`timeout`,message:`シグナリングサーバーへの接続がタイムアウトしました。詳細設定を確認してください。`})}},tn);this.peer.on(`open`,t=>{n||(n=!0,clearTimeout(r),this.signalId=t,this.isHost||(this.selfId=t),this.emit(`peer-open`,t),e())}),this.peer.on(`error`,e=>{n||(n=!0,clearTimeout(r),t(this._setFailure(e)))})})}_handleRuntimePeerError(e){console.warn(`[PeerRoom] runtime peer error`,e);let t=an(e);t.code===`signal-error`?(this.emit(`signaling-lost`),this._tryReconnect()):this.emit(`warning`,t)}_tryReconnect(){this.peer&&!this.peer.destroyed&&this.peer.disconnected!==!1&&setTimeout(()=>{if(!(this.closed||!this.peer||this.peer.destroyed))try{this.peer.reconnect()}catch{}},1200)}_handleIncoming(e){if(this.closed){try{e.close()}catch{}return}let t=this.playersByPeer.get(e.peer);if(t){let n=this.connectionsByPlayer.get(t);if(n&&n!==e){console.warn(`[PeerRoom] duplicate connection for peer, closing`,e.peer);try{e.close()}catch{}return}}e._neonConnId=++this._connSeq,e.on(`data`,t=>this._handleIncomingData(e,t)),e.on(`close`,()=>{this._dropPendingJoin(e),this._handleGuestClosed(e)}),e.on(`error`,t=>{console.warn(`[PeerRoom] guest connection error`,t),this._dropPendingJoin(e),this._handleGuestClosed(e)})}_flushPendingJoins(){if(this.closed||this.listenerCount(`join-request`)===0)return;let e=[...this._pendingJoins.values()];this._pendingJoins.clear();for(let{conn:t,request:n}of e)t._neonJoined||this.emit(`join-request`,n)}_armJoinTimeout(e){this._clearJoinTimeout(e.peer);let t=setTimeout(()=>{this._joinTimers.delete(e.peer),!this.playersByPeer.has(e.peer)&&(this._pendingJoins.delete(e.peer),this._rejectGuest(e,`timeout`,`ホストの応答がありません。`))},5e3);this._joinTimers.set(e.peer,t)}_clearJoinTimeout(e){let t=this._joinTimers.get(e);t&&clearTimeout(t),this._joinTimers.delete(e)}_dropPendingJoin(e){this._pendingJoins.delete(e.peer),this.playersByPeer.has(e.peer)||this._clearJoinTimeout(e.peer)}_handleIncomingData(e,t){let n=on(t);if(!n||typeof n.t!=`string`)return;let r=this.playersByPeer.get(e.peer);if(!r){if(n.t!==I.HELLO||e._neonJoined||e._neonRejected)return;if(this.lastDataAt=performance.now(),n.v!==1){this._rejectGuest(e,`protocol-mismatch`,`ゲームのバージョンが一致しません。ページを再読み込みしてください。`);return}if(this.playersByPeer.size>=11){this._rejectGuest(e,`room-full`,`ルームが満員です。`);return}if(this._joinTimers.has(e.peer))return;e._neonName=_(n.name),e._neonHelloAt=performance.now();let t={conn:e,name:e._neonName,peerId:e.peer,accept:t=>this._acceptGuest(e,t),reject:(t,n)=>this._rejectGuest(e,t,n)};this._armJoinTimeout(e),this.listenerCount(`join-request`)>0?this.emit(`join-request`,t):this._pendingJoins.set(e.peer,{conn:e,request:t})}else if(this.lastDataAt=performance.now(),e._neonLastSeen=this.lastDataAt,this._allowMessage(r,n.t)){if(n.t===I.PING)this.sendTo(r,{t:I.PONG,ts:n.ts,serverTime:Date.now()});else if(n.t===I.BYE){try{e.close()}catch{}this._handleGuestClosed(e)}else(n.t===I.FIRE||n.t===I.PROJECTILE)&&(n.from=r,this.broadcast(n,r)),this._emitSessionMessage(n,r)}}_allowMessage(e,t){let n={[I.STATE]:50,[I.FIRE]:30,[I.PROJECTILE]:30,[I.HIT]:20,[I.HAZARD]:6,[I.HEAL]:4,[I.LOADOUT]:8,[I.PING]:3,[I.CHAT]:5}[t];if(!n)return!1;let r=performance.now(),i=`${e}:${t}`,a=this._limiter.get(i);return(!a||r-a.time>1e3)&&(a={time:r,count:0},this._limiter.set(i,a)),a.count+=1,!(a.count>n)}_acceptGuest(e,t={}){if(this.playersByPeer.has(e.peer)||e._neonLeft||e._neonRejected)return!1;let n=String(t.playerId||``).slice(0,40);return!n||this.connectionsByPlayer.has(n)?(this._rejectGuest(e,`duplicate`,`参加処理に失敗しました。もう一度お試しください。`),!1):(this._pendingJoins.delete(e.peer),this._clearJoinTimeout(e.peer),e._neonJoined=!0,this.playersByPeer.set(e.peer,n),this.connectionsByPlayer.set(n,e),this.sendTo(n,{t:I.WELCOME,v:1,selfId:n,code:this.code,...t.welcome}),this.emit(`guest-joined`,{playerId:n,name:e._neonName||t.name||`PLAYER`,peerId:e.peer}),!0)}_rejectGuest(e,t,n){e._neonRejected=!0,this._pendingJoins.delete(e.peer),this._clearJoinTimeout(e.peer);try{e.open&&e.send({t:I.REJECT,code:t,reason:n})}catch{}setTimeout(()=>{try{e.close()}catch{}},350)}_handleGuestClosed(e){if(!e||e._neonLeft)return;let t=this.playersByPeer.get(e.peer);if(!t)return;let n=this.connectionsByPlayer.get(t);if(!(n&&n!==e)){e._neonLeft=!0,this.playersByPeer.delete(e.peer),this.connectionsByPlayer.delete(t),this._clearJoinTimeout(e.peer),this._pendingJoins.delete(e.peer);for(let e of this._limiter.keys())e.startsWith(`${t}:`)&&this._limiter.delete(e);this.emit(`guest-left`,{playerId:t})}}_dispatchHostMessage(e){e.t===I.PONG?typeof e.ts==`number`&&(this.ping=Math.max(0,Math.round(performance.now()-e.ts)),this.emit(`latency`,this.ping)):e.t===I.SNAPSHOT?(this.lastSnapshotAt=performance.now(),this.emit(`snapshot`,e)):(e.t===I.DAMAGE?this.emit(`damage`,e):e.t===I.KILL&&this.emit(`kill`,e),this._emitSessionMessage(e,`host`))}_emitSessionMessage(e,t){let n={message:e,fromId:t};this.sessionReady?this.emit(`message`,n):this._pendingMessages.length<200&&this._pendingMessages.push(n)}markSessionReady(){this.sessionReady=!0;let e=this._pendingMessages.splice(0);for(let{message:t,fromId:n}of e)this.emit(`message`,{message:t,fromId:n})}_sendRaw(e){try{if(this.conn?.open)return this.conn.send(e),!0}catch(e){console.warn(`[PeerRoom] send failed`,e)}return!1}sendToHost(e){return!this.isHost&&this._sendRaw(e)}broadcast(e,t=null){if(!this.isHost)return 0;let n=0;for(let[r,i]of this.connectionsByPlayer)if(r!==t)try{i.open&&(i.send(e),n+=1)}catch(e){console.warn(`[PeerRoom] broadcast failed`,e)}return n}sendTo(e,t){if(!this.isHost)return!1;let n=this.connectionsByPlayer.get(e);if(!n?.open)return!1;try{return n.send(t),!0}catch(e){return console.warn(`[PeerRoom] sendTo failed`,e),!1}}guestCount(){return this.connectionsByPlayer.size}playerIds(){return[...this.connectionsByPlayer.keys()]}_startGuestTimers(){clearInterval(this._pingTimer),this.pingTimer=setInterval(()=>{this.closed||this._sendRaw({t:I.PING,ts:performance.now()})},2e3),this._pingTimer=this.pingTimer}_startHealthTimer(){clearInterval(this._healthTimer),this._healthTimer=setInterval(()=>{if(this.closed)return;let e=performance.now();for(let[t,n]of this.connectionsByPlayer)if(!n._neonLeft&&e-(n._neonLastSeen||n._neonHelloAt||e)>14e3){console.warn(`[PeerRoom] stale guest, closing`,t);try{n.close()}catch{}this._handleGuestClosed(n)}},4e3)}update(){if(!this.closed&&!this.isHost){let e=performance.now();this._welcomeReceived&&this.lastDataAt&&e-this.lastDataAt>11e3&&(this.lastDataAt=e,this._handleHostLost(`ホストからの応答がありません。接続が切断された可能性があります。`))}}_handleHostLost(e){this.closed||this.emit(`connection-lost`,{reason:e})}_safeCloseConnection(){try{this.conn?.close()}catch{}this.conn=null}close(){if(!this.closed){this.closed=!0,clearTimeout(this._connectTimer);for(let e of this._joinTimers.values())clearTimeout(e);this._joinTimers.clear(),this._pendingJoins.clear(),clearInterval(this._pingTimer),clearInterval(this._healthTimer);try{this.conn?.open&&this.conn.send({t:I.BYE})}catch{}for(let e of this.connectionsByPlayer.values())try{e.close()}catch{}this.connectionsByPlayer.clear(),this.playersByPeer.clear();try{this.conn?.close()}catch{}try{this.peer?.destroy()}catch{}this.peer=null,this.conn=null,this.opened=!1,this.closed=!0}}},cn=1e3,ln=1001,un=1002,dn=1003,fn=1004,pn=1005,mn=1006,hn=1007,gn=1008,_n=1009,vn=1010,yn=1011,bn=1012,xn=1013,Sn=1014,Cn=1015,wn=1016,Tn=1017,En=1018,Dn=1020,On=35902,kn=35899,An=1021,jn=1022,Mn=1023,Nn=1026,Pn=1027,Fn=1028,In=1029,Ln=1030,Rn=1031,zn=1033,Bn=33776,Vn=33777,Hn=33778,Un=33779,Wn=35840,Gn=35841,Kn=35842,qn=35843,Jn=36196,Yn=37492,Xn=37496,Zn=37488,Qn=37489,$n=37490,er=37491,tr=37808,nr=37809,rr=37810,ir=37811,ar=37812,or=37813,sr=37814,cr=37815,lr=37816,ur=37817,dr=37818,fr=37819,pr=37820,mr=37821,hr=36492,gr=36494,_r=36495,vr=36283,yr=36284,br=36285,xr=36286,Sr=2300,Cr=2301,wr=2302,Tr=2303,Er=2400,Dr=2401,Or=2402,kr=3200,Ar=`srgb`,jr=`srgb-linear`,Mr=`linear`,Nr=`srgb`,Pr=7680,Fr=35044,Ir=2e3;function Lr(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Rr(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function zr(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Br(){let e=zr(`canvas`);return e.style.display=`block`,e}var Vr={};function Hr(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Ur(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function L(...e){e=Ur(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function R(...e){e=Ur(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Wr(...e){let t=e.join(` `);t in Vr||(Vr[t]=!0,L(...e))}function Gr(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Kr={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},qr=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Jr=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Yr=1234567,Xr=Math.PI/180,Zr=180/Math.PI;function Qr(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Jr[e&255]+Jr[e>>8&255]+Jr[e>>16&255]+Jr[e>>24&255]+`-`+Jr[t&255]+Jr[t>>8&255]+`-`+Jr[t>>16&15|64]+Jr[t>>24&255]+`-`+Jr[n&63|128]+Jr[n>>8&255]+`-`+Jr[n>>16&255]+Jr[n>>24&255]+Jr[r&255]+Jr[r>>8&255]+Jr[r>>16&255]+Jr[r>>24&255]).toLowerCase()}function $r(e,t,n){return Math.max(t,Math.min(n,e))}function ei(e,t){return(e%t+t)%t}function ti(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ni(e,t,n){return e===t?0:(n-e)/(t-e)}function ri(e,t,n){return(1-n)*e+n*t}function ii(e,t,n,r){return ri(e,t,1-Math.exp(-n*r))}function ai(e,t=1){return t-Math.abs(ei(e,t*2)-t)}function oi(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function si(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function ci(e,t){return e+Math.floor(Math.random()*(t-e+1))}function li(e,t){return e+Math.random()*(t-e)}function ui(e){return e*(.5-Math.random())}function di(e){e!==void 0&&(Yr=e);let t=Yr+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function fi(e){return e*Xr}function pi(e){return e*Zr}function mi(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function hi(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function gi(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function _i(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:L(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function vi(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function yi(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var bi={DEG2RAD:Xr,RAD2DEG:Zr,generateUUID:Qr,clamp:$r,euclideanModulo:ei,mapLinear:ti,inverseLerp:ni,lerp:ri,damp:ii,pingpong:ai,smoothstep:oi,smootherstep:si,randInt:ci,randFloat:li,randFloatSpread:ui,seededRandom:di,degToRad:fi,radToDeg:pi,isPowerOfTwo:mi,ceilPowerOfTwo:hi,floorPowerOfTwo:gi,setQuaternionFromProperEuler:_i,normalize:yi,denormalize:vi},z=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$r(this.x,e.x,t.x),this.y=$r(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$r(this.x,e,t),this.y=$r(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($r(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($r(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},xi=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:L(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($r(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},B=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ci.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ci.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$r(this.x,e.x,t.x),this.y=$r(this.y,e.y,t.y),this.z=$r(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$r(this.x,e,t),this.y=$r(this.y,e,t),this.z=$r(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($r(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Si.copy(this).projectOnVector(e),this.sub(Si)}reflect(e){return this.sub(Si.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($r(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Si=new B,Ci=new xi,V=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Wr(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(wi.makeScale(e,t)),this}rotate(e){return Wr(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(wi.makeRotation(-e)),this}translate(e,t){return Wr(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(wi.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},wi=new V,Ti=new V().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ei=new V().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Di(){let e={enabled:!0,workingColorSpace:jr,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=ki(e.r),e.g=ki(e.g),e.b=ki(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ai(e.r),e.g=Ai(e.g),e.b=Ai(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Mr:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Wr(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Wr(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[jr]:{primaries:t,whitePoint:r,transfer:Mr,toXYZ:Ti,fromXYZ:Ei,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ar},outputColorSpaceConfig:{drawingBufferColorSpace:Ar}},[Ar]:{primaries:t,whitePoint:r,transfer:Nr,toXYZ:Ti,fromXYZ:Ei,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ar}}}),e}var Oi=Di();function ki(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ai(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var ji,Mi=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ji===void 0&&(ji=zr(`canvas`)),ji.width=e.width,ji.height=e.height;let t=ji.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=ji}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=zr(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=ki(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(ki(t[e]/255)*255):t[e]=ki(t[e]);return{data:t,width:e.width,height:e.height}}return L(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Ni=0,Pi=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ni++}),this.uuid=Qr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Fi(r[t].image)):e.push(Fi(r[t]))}else e=Fi(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Fi(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Mi.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(L(`Texture: Unable to serialize Texture.`),{})}var Ii=0,Li=new B,Ri=class e extends qr{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=ln,i=ln,a=mn,o=gn,s=Mn,c=_n,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ii++}),this.uuid=Qr(),this.name=``,this.source=new Pi(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new z(0,0),this.repeat=new z(1,1),this.center=new z(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new V,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Li).x}get height(){return this.source.getSize(Li).y}get depth(){return this.source.getSize(Li).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){L(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?L(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case cn:e.x-=Math.floor(e.x);break;case ln:e.x=e.x<0?0:1;break;case un:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case cn:e.y-=Math.floor(e.y);break;case ln:e.y=e.y<0?0:1;break;case un:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ri.DEFAULT_IMAGE=null,Ri.DEFAULT_MAPPING=300,Ri.DEFAULT_ANISOTROPY=1;var zi=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$r(this.x,e.x,t.x),this.y=$r(this.y,e.y,t.y),this.z=$r(this.z,e.z,t.z),this.w=$r(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$r(this.x,e,t),this.y=$r(this.y,e,t),this.z=$r(this.z,e,t),this.w=$r(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($r(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Bi=class extends qr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:mn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new zi(0,0,e,t),this.scissorTest=!1,this.viewport=new zi(0,0,e,t),this.textures=[];let r=new Ri({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:mn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Pi(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Vi=class extends Bi{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Hi=class extends Ri{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=dn,this.minFilter=dn,this.wrapR=ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Ui=class extends Ri{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=dn,this.minFilter=dn,this.wrapR=ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Wi=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Gi.setFromMatrixColumn(e,0).length(),i=1/Gi.setFromMatrixColumn(e,1).length(),a=1/Gi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qi,e,Ji)}lookAt(e,t,n){let r=this.elements;return Zi.subVectors(e,t),Zi.lengthSq()===0&&(Zi.z=1),Zi.normalize(),Yi.crossVectors(n,Zi),Yi.lengthSq()===0&&(Math.abs(n.z)===1?Zi.x+=1e-4:Zi.z+=1e-4,Zi.normalize(),Yi.crossVectors(n,Zi)),Yi.normalize(),Xi.crossVectors(Zi,Yi),r[0]=Yi.x,r[4]=Xi.x,r[8]=Zi.x,r[1]=Yi.y,r[5]=Xi.y,r[9]=Zi.y,r[2]=Yi.z,r[6]=Xi.z,r[10]=Zi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],ee=r[2],k=r[6],te=r[10],ne=r[14],A=r[3],re=r[7],ie=r[11],ae=r[15];return i[0]=a*x+o*T+s*ee+c*A,i[4]=a*S+o*E+s*k+c*re,i[8]=a*C+o*D+s*te+c*ie,i[12]=a*w+o*O+s*ne+c*ae,i[1]=l*x+u*T+d*ee+f*A,i[5]=l*S+u*E+d*k+f*re,i[9]=l*C+u*D+d*te+f*ie,i[13]=l*w+u*O+d*ne+f*ae,i[2]=p*x+m*T+h*ee+g*A,i[6]=p*S+m*E+h*k+g*re,i[10]=p*C+m*D+h*te+g*ie,i[14]=p*w+m*O+h*ne+g*ae,i[3]=_*x+v*T+y*ee+b*A,i[7]=_*S+v*E+y*k+b*re,i[11]=_*C+v*D+y*te+b*ie,i[15]=_*w+v*O+y*ne+b*ae,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,ee=_*O-v*D+y*E+b*T-x*w+S*C;if(ee===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/ee;return e[0]=(o*O-s*D+c*E)*k,e[1]=(r*D-n*O-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*O-c*w)*k,e[5]=(t*O-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Gi.set(r[0],r[1],r[2]).length(),o=Gi.set(r[4],r[5],r[6]).length(),s=Gi.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Ki.copy(this);let c=1/a,l=1/o,u=1/s;return Ki.elements[0]*=c,Ki.elements[1]*=c,Ki.elements[2]*=c,Ki.elements[4]*=l,Ki.elements[5]*=l,Ki.elements[6]*=l,Ki.elements[8]*=u,Ki.elements[9]*=u,Ki.elements[10]*=u,t.setFromRotationMatrix(Ki),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Ir,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ir,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Gi=new B,Ki=new Wi,qi=new B(0,0,0),Ji=new B(1,1,1),Yi=new B,Xi=new B,Zi=new B,Qi=new Wi,$i=new xi,ea=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin($r(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-$r(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin($r(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-$r(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin($r(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-$r(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:L(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Qi.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qi,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return $i.setFromEuler(this),this.setFromQuaternion($i,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ea.DEFAULT_ORDER=`XYZ`;var ta=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},na=0,ra=new B,ia=new xi,aa=new Wi,oa=new B,sa=new B,ca=new B,la=new xi,ua=new B(1,0,0),da=new B(0,1,0),fa=new B(0,0,1),pa={type:`added`},ma={type:`removed`},ha={type:`childadded`,child:null},ga={type:`childremoved`,child:null},_a=class e extends qr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:na++}),this.uuid=Qr(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new B,n=new ea,r=new xi,i=new B(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Wi},normalMatrix:{value:new V}}),this.matrix=new Wi,this.matrixWorld=new Wi,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ta,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ia.setFromAxisAngle(e,t),this.quaternion.multiply(ia),this}rotateOnWorldAxis(e,t){return ia.setFromAxisAngle(e,t),this.quaternion.premultiply(ia),this}rotateX(e){return this.rotateOnAxis(ua,e)}rotateY(e){return this.rotateOnAxis(da,e)}rotateZ(e){return this.rotateOnAxis(fa,e)}translateOnAxis(e,t){return ra.copy(e).applyQuaternion(this.quaternion),this.position.add(ra.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ua,e)}translateY(e){return this.translateOnAxis(da,e)}translateZ(e){return this.translateOnAxis(fa,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(aa.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?oa.copy(e):oa.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),sa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?aa.lookAt(sa,oa,this.up):aa.lookAt(oa,sa,this.up),this.quaternion.setFromRotationMatrix(aa),r&&(aa.extractRotation(r.matrixWorld),ia.setFromRotationMatrix(aa),this.quaternion.premultiply(ia.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(R(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(pa),ha.child=e,this.dispatchEvent(ha),ha.child=null):R(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ma),ga.child=e,this.dispatchEvent(ga),ga.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),aa.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),aa.multiply(e.parent.matrixWorld)),e.applyMatrix4(aa),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(pa),ha.child=e,this.dispatchEvent(ha),ha.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sa,e,ca),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sa,la,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};_a.DEFAULT_UP=new B(0,1,0),_a.DEFAULT_MATRIX_AUTO_UPDATE=!0,_a.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var H=class extends _a{constructor(){super(),this.isGroup=!0,this.type=`Group`}},va={type:`move`},ya=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new H,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new H,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new H,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(va)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new H;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},ba={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xa={h:0,s:0,l:0},Sa={h:0,s:0,l:0};function Ca(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var U=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ar){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Oi.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Oi.workingColorSpace){return this.r=e,this.g=t,this.b=n,Oi.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Oi.workingColorSpace){if(e=ei(e,1),t=$r(t,0,1),n=$r(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Ca(i,r,e+1/3),this.g=Ca(i,r,e),this.b=Ca(i,r,e-1/3)}return Oi.colorSpaceToWorking(this,r),this}setStyle(e,t=Ar){function n(t){t!==void 0&&parseFloat(t)<1&&L(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:L(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);L(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ar){let n=ba[e.toLowerCase()];return n===void 0?L(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}copyLinearToSRGB(e){return this.r=Ai(e.r),this.g=Ai(e.g),this.b=Ai(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ar){return Oi.workingToColorSpace(wa.copy(this),e),Math.round($r(wa.r*255,0,255))*65536+Math.round($r(wa.g*255,0,255))*256+Math.round($r(wa.b*255,0,255))}getHexString(e=Ar){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Oi.workingColorSpace){Oi.workingToColorSpace(wa.copy(this),t);let n=wa.r,r=wa.g,i=wa.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Oi.workingColorSpace){return Oi.workingToColorSpace(wa.copy(this),t),e.r=wa.r,e.g=wa.g,e.b=wa.b,e}getStyle(e=Ar){Oi.workingToColorSpace(wa.copy(this),e);let t=wa.r,n=wa.g,r=wa.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(xa),this.setHSL(xa.h+e,xa.s+t,xa.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(xa),e.getHSL(Sa);let n=ri(xa.h,Sa.h,t),r=ri(xa.s,Sa.s,t),i=ri(xa.l,Sa.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},wa=new U;U.NAMES=ba;var Ta=class e{constructor(e,t=25e-5){this.isFogExp2=!0,this.name=``,this.color=new U(e),this.density=t}clone(){return new e(this.color,this.density)}toJSON(){return{type:`FogExp2`,name:this.name,color:this.color.getHex(),density:this.density}}},Ea=class extends _a{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ea,this.environmentIntensity=1,this.environmentRotation=new ea,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Da=new B,Oa=new B,ka=new B,Aa=new B,ja=new B,Ma=new B,Na=new B,Pa=new B,Fa=new B,Ia=new B,La=new zi,Ra=new zi,za=new zi,Ba=class e{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Da.subVectors(e,t),r.cross(Da);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Da.subVectors(r,t),Oa.subVectors(n,t),ka.subVectors(e,t);let a=Da.dot(Da),o=Da.dot(Oa),s=Da.dot(ka),c=Oa.dot(Oa),l=Oa.dot(ka),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Aa)!==null&&Aa.x>=0&&Aa.y>=0&&Aa.x+Aa.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Aa)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Aa.x),s.addScaledVector(a,Aa.y),s.addScaledVector(o,Aa.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return La.setScalar(0),Ra.setScalar(0),za.setScalar(0),La.fromBufferAttribute(e,t),Ra.fromBufferAttribute(e,n),za.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(La,i.x),a.addScaledVector(Ra,i.y),a.addScaledVector(za,i.z),a}static isFrontFacing(e,t,n,r){return Da.subVectors(n,t),Oa.subVectors(e,t),Da.cross(Oa).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Da.subVectors(this.c,this.b),Oa.subVectors(this.a,this.b),Da.cross(Oa).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;ja.subVectors(r,n),Ma.subVectors(i,n),Pa.subVectors(e,n);let s=ja.dot(Pa),c=Ma.dot(Pa);if(s<=0&&c<=0)return t.copy(n);Fa.subVectors(e,r);let l=ja.dot(Fa),u=Ma.dot(Fa);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(ja,a);Ia.subVectors(e,i);let f=ja.dot(Ia),p=Ma.dot(Ia);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Ma,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Na.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Na,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(ja,a).addScaledVector(Ma,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Va=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ua.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ua.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Ua.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Ua):Ua.fromBufferAttribute(r,t),Ua.applyMatrix4(e.matrixWorld),this.expandByPoint(Ua);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Wa.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Wa.copy(e.boundingBox)),Wa.applyMatrix4(e.matrixWorld),this.union(Wa)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ua),Ua.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Za),Qa.subVectors(this.max,Za),Ga.subVectors(e.a,Za),Ka.subVectors(e.b,Za),qa.subVectors(e.c,Za),Ja.subVectors(Ka,Ga),Ya.subVectors(qa,Ka),Xa.subVectors(Ga,qa);let t=[0,-Ja.z,Ja.y,0,-Ya.z,Ya.y,0,-Xa.z,Xa.y,Ja.z,0,-Ja.x,Ya.z,0,-Ya.x,Xa.z,0,-Xa.x,-Ja.y,Ja.x,0,-Ya.y,Ya.x,0,-Xa.y,Xa.x,0];return!to(t,Ga,Ka,qa,Qa)||(t=[1,0,0,0,1,0,0,0,1],!to(t,Ga,Ka,qa,Qa))?!1:($a.crossVectors(Ja,Ya),t=[$a.x,$a.y,$a.z],to(t,Ga,Ka,qa,Qa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ua).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ua).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Ha[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ha[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ha[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ha[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ha[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ha[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ha[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ha[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ha)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ha=[new B,new B,new B,new B,new B,new B,new B,new B],Ua=new B,Wa=new Va,Ga=new B,Ka=new B,qa=new B,Ja=new B,Ya=new B,Xa=new B,Za=new B,Qa=new B,$a=new B,eo=new B;function to(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){eo.fromArray(e,a);let o=i.x*Math.abs(eo.x)+i.y*Math.abs(eo.y)+i.z*Math.abs(eo.z),s=t.dot(eo),c=n.dot(eo),l=r.dot(eo);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var no=new B,ro=new z,io=0,ao=class extends qr{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:io++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Fr,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ro.fromBufferAttribute(this,t),ro.applyMatrix3(e),this.setXY(t,ro.x,ro.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)no.fromBufferAttribute(this,t),no.applyMatrix3(e),this.setXYZ(t,no.x,no.y,no.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)no.fromBufferAttribute(this,t),no.applyMatrix4(e),this.setXYZ(t,no.x,no.y,no.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)no.fromBufferAttribute(this,t),no.applyNormalMatrix(e),this.setXYZ(t,no.x,no.y,no.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)no.fromBufferAttribute(this,t),no.transformDirection(e),this.setXYZ(t,no.x,no.y,no.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=vi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yi(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=vi(t,this.array)),t}setX(e,t){return this.normalized&&(t=yi(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=vi(t,this.array)),t}setY(e,t){return this.normalized&&(t=yi(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=vi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yi(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=vi(t,this.array)),t}setW(e,t){return this.normalized&&(t=yi(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yi(t,this.array),n=yi(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=yi(t,this.array),n=yi(n,this.array),r=yi(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=yi(t,this.array),n=yi(n,this.array),r=yi(r,this.array),i=yi(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},oo=class extends ao{constructor(e,t,n){super(new Uint16Array(e),t,n)}},so=class extends ao{constructor(e,t,n){super(new Uint32Array(e),t,n)}},co=class extends ao{constructor(e,t,n){super(new Float32Array(e),t,n)}},lo=new Va,uo=new B,fo=new B,po=class{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?lo.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;uo.subVectors(e,this.center);let t=uo.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(uo,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(uo.copy(e.center).add(fo)),this.expandByPoint(uo.copy(e.center).sub(fo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},mo=0,ho=new Wi,go=new _a,_o=new B,vo=new Va,yo=new Va,bo=new B,xo=class e extends qr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mo++}),this.uuid=Qr(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Lr(e)?so:oo)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new V().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ho.makeRotationFromQuaternion(e),this.applyMatrix4(ho),this}rotateX(e){return ho.makeRotationX(e),this.applyMatrix4(ho),this}rotateY(e){return ho.makeRotationY(e),this.applyMatrix4(ho),this}rotateZ(e){return ho.makeRotationZ(e),this.applyMatrix4(ho),this}translate(e,t,n){return ho.makeTranslation(e,t,n),this.applyMatrix4(ho),this}scale(e,t,n){return ho.makeScale(e,t,n),this.applyMatrix4(ho),this}lookAt(e){return go.lookAt(e),go.updateMatrix(),this.applyMatrix4(go.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_o).negate(),this.translate(_o.x,_o.y,_o.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new co(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&L(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Va);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)R(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];vo.setFromBufferAttribute(n),this.morphTargetsRelative?(bo.addVectors(this.boundingBox.min,vo.min),this.boundingBox.expandByPoint(bo),bo.addVectors(this.boundingBox.max,vo.max),this.boundingBox.expandByPoint(bo)):(this.boundingBox.expandByPoint(vo.min),this.boundingBox.expandByPoint(vo.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&R(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new po);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)R(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new B,1/0);else if(e){let n=this.boundingSphere.center;if(vo.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];yo.setFromBufferAttribute(n),this.morphTargetsRelative?(bo.addVectors(vo.min,yo.min),vo.expandByPoint(bo),bo.addVectors(vo.max,yo.max),vo.expandByPoint(bo)):(vo.expandByPoint(yo.min),vo.expandByPoint(yo.max))}vo.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)bo.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(bo));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)bo.fromBufferAttribute(a,t),o&&(_o.fromBufferAttribute(e,t),bo.add(_o)),r=Math.max(r,n.distanceToSquared(bo))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&R(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){R(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new ao(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new B,s[e]=new B;let c=new B,l=new B,u=new B,d=new z,f=new z,p=new z,m=new B,h=new B;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new B,y=new B,b=new B,x=new B;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new ao(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new B,i=new B,a=new B,o=new B,s=new B,c=new B,l=new B,u=new B;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bo.fromBufferAttribute(e,t),bo.normalize(),e.setXYZ(t,bo.x,bo.y,bo.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new ao(a,r,i)}if(this.index===null)return L(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},So=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Fr,this.updateRanges=[],this.version=0,this.uuid=Qr()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Co=new B,wo=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Co.fromBufferAttribute(this,t),Co.applyMatrix4(e),this.setXYZ(t,Co.x,Co.y,Co.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Co.fromBufferAttribute(this,t),Co.applyNormalMatrix(e),this.setXYZ(t,Co.x,Co.y,Co.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Co.fromBufferAttribute(this,t),Co.transformDirection(e),this.setXYZ(t,Co.x,Co.y,Co.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=vi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yi(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=yi(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=yi(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=yi(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=yi(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=vi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=vi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=vi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=vi(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=yi(t,this.array),n=yi(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=yi(t,this.array),n=yi(n,this.array),r=yi(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=yi(t,this.array),n=yi(n,this.array),r=yi(r,this.array),i=yi(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){Hr(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new ao(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Hr(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},To=new B,Eo=new B,Do=new V,Oo=class{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=To.subVectors(n,t).cross(Eo.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(To),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Do.getNormalMatrix(e),r=this.coplanarPoint(To).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},ko=0,Ao=class extends qr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ko++}),this.uuid=Qr(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new U(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pr,this.stencilZFail=Pr,this.stencilZPass=Pr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){L(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?L(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new U().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Oo().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new z().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new z().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},jo=class extends Ao{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new U(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Mo,No=new B,Po=new B,Fo=new B,Io=new z,Lo=new z,Ro=new Wi,zo=new B,Bo=new B,Vo=new B,Ho=new z,Uo=new z,Wo=new z,Go=class extends _a{constructor(e=new jo){if(super(),this.isSprite=!0,this.type=`Sprite`,Mo===void 0){Mo=new xo;let e=new So(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);Mo.setIndex([0,1,2,0,2,3]),Mo.setAttribute(`position`,new wo(e,3,0,!1)),Mo.setAttribute(`uv`,new wo(e,2,3,!1))}this.geometry=Mo,this.material=e,this.center=new z(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&R(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),Po.setFromMatrixScale(this.matrixWorld),Ro.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Fo.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Po.multiplyScalar(-Fo.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;Ko(zo.set(-.5,-.5,0),Fo,a,Po,r,i),Ko(Bo.set(.5,-.5,0),Fo,a,Po,r,i),Ko(Vo.set(.5,.5,0),Fo,a,Po,r,i),Ho.set(0,0),Uo.set(1,0),Wo.set(1,1);let o=e.ray.intersectTriangle(zo,Bo,Vo,!1,No);if(o===null&&(Ko(Bo.set(-.5,.5,0),Fo,a,Po,r,i),Uo.set(0,1),o=e.ray.intersectTriangle(zo,Vo,Bo,!1,No),o===null))return;let s=e.ray.origin.distanceTo(No);s<e.near||s>e.far||t.push({distance:s,point:No.clone(),uv:Ba.getInterpolation(No,zo,Bo,Vo,Ho,Uo,Wo,new z),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Ko(e,t,n,r,i,a){Io.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?Lo.copy(Io):(Lo.x=a*Io.x-i*Io.y,Lo.y=i*Io.x+a*Io.y),e.copy(t),e.x+=Lo.x,e.y+=Lo.y,e.applyMatrix4(Ro)}var qo=new B,Jo=new B,Yo=new B,Xo=new B,Zo=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qo)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=qo.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qo.copy(this.origin).addScaledVector(this.direction,t),qo.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Jo.copy(e).add(t).multiplyScalar(.5),Yo.copy(t).sub(e).normalize(),Xo.copy(this.origin).sub(Jo);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Yo),o=Xo.dot(this.direction),s=-Xo.dot(Yo),c=Xo.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Jo).addScaledVector(Yo,d),f}intersectSphere(e,t){if(e.radius<0)return null;qo.subVectors(e.center,this.origin);let n=qo.dot(this.direction),r=qo.dot(qo)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,qo)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,ee,k,te,ne,A;if(y>=b&&y>=x?(w=s,D=u,k=p,A=g,s>=0?(S=c,C=l,T=d,E=f,O=m,ee=h,te=_,ne=v):(S=l,C=c,T=f,E=d,O=h,ee=m,te=v,ne=_)):b>=x?(w=c,D=d,k=m,A=_,c>=0?(S=l,C=s,T=f,E=u,O=h,ee=p,te=v,ne=g):(S=s,C=l,T=u,E=f,O=p,ee=h,te=g,ne=v)):(w=l,D=f,k=h,A=v,l>=0?(S=s,C=c,T=u,E=d,O=p,ee=m,te=g,ne=_):(S=c,C=s,T=d,E=u,O=m,ee=p,te=_,ne=g)),w===0)return null;let re=S/w,ie=C/w,ae=1/w,oe=T-re*D,se=E-ie*D,ce=O-re*k,le=ee-ie*k,ue=te-re*A,de=ne-ie*A,fe=ue*le-de*ce,pe=oe*de-se*ue,me=ce*se-le*oe;if(r){if(fe<0||pe<0||me<0)return null}else if((fe<0||pe<0||me<0)&&(fe>0||pe>0||me>0))return null;let he=fe+pe+me;if(he===0)return null;let ge=ae*(fe*D+pe*k+me*A);return(he>0?ge<0:ge>0)?null:this.at(ge/he,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Qo=class extends Ao{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new U(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ea,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},$o=new Wi,es=new Zo,ts=new po,ns=new B,rs=new B,is=new B,as=new B,os=new B,ss=new B,cs=new B,ls=new B,W=class extends _a{constructor(e=new xo,t=new Qo){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){ss.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(os.fromBufferAttribute(s,e),a?ss.addScaledVector(os,r):ss.addScaledVector(os.sub(t),r))}t.add(ss)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ts.copy(n.boundingSphere),ts.applyMatrix4(i),es.copy(e.ray).recast(e.near),!(ts.containsPoint(es.origin)===!1&&(es.intersectSphere(ts,ns)===null||es.origin.distanceToSquared(ns)>(e.far-e.near)**2))&&($o.copy(i).invert(),es.copy(e.ray).applyMatrix4($o),(n.boundingBox===null||es.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=ds(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=ds(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=ds(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=ds(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function us(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ls.copy(s),ls.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ls);return l<n.near||l>n.far?null:{distance:l,point:ls.clone(),object:e}}function ds(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,rs),e.getVertexPosition(c,is),e.getVertexPosition(l,as);let u=us(e,t,n,r,rs,is,as,cs);if(u){let e=new B;Ba.getBarycoord(cs,rs,is,as,e),i&&(u.uv=Ba.getInterpolatedAttribute(i,s,c,l,e,new z)),a&&(u.uv1=Ba.getInterpolatedAttribute(a,s,c,l,e,new z)),o&&(u.normal=Ba.getInterpolatedAttribute(o,s,c,l,e,new B),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new B,materialIndex:0};Ba.getNormal(rs,is,as,t.normal),u.face=t,u.barycoord=e}return u}var fs=class extends Ri{constructor(e=null,t=1,n=1,r,i,a,o,s,c=dn,l=dn,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ps=new po,ms=new z(.5,.5),hs=new B,gs=class{constructor(e=new Oo,t=new Oo,n=new Oo,r=new Oo,i=new Oo,a=new Oo){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ir,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ps.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ps.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ps)}intersectsSprite(e){return ps.center.set(0,0,0),ps.radius=.7071067811865476+ms.distanceTo(e.center),ps.applyMatrix4(e.matrixWorld),this.intersectsSphere(ps)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(hs.x=r.normal.x>0?e.max.x:e.min.x,hs.y=r.normal.y>0?e.max.y:e.min.y,hs.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(hs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},_s=class extends Ao{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new U(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},vs=new B,ys=new B,bs=new Wi,xs=new Zo,Ss=new po,Cs=new B,ws=new B,Ts=class extends _a{constructor(e=new xo,t=new _s){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)vs.fromBufferAttribute(t,e-1),ys.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=vs.distanceTo(ys);e.setAttribute(`lineDistance`,new co(n,1))}else L(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ss.copy(n.boundingSphere),Ss.applyMatrix4(r),Ss.radius+=i,e.ray.intersectsSphere(Ss)===!1)return;bs.copy(r).invert(),xs.copy(e.ray).applyMatrix4(bs);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=Es(this,e,xs,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=Es(this,e,xs,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=Es(this,e,xs,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=Es(this,e,xs,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Es(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(vs.fromBufferAttribute(s,i),ys.fromBufferAttribute(s,a),n.distanceSqToSegment(vs,ys,Cs,ws)>r)return;Cs.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(Cs);if(!(c<t.near||c>t.far))return{distance:c,point:ws.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var Ds=new B,Os=new B,ks=class extends Ts{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)Ds.fromBufferAttribute(t,e),Os.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+Ds.distanceTo(Os);e.setAttribute(`lineDistance`,new co(n,1))}else L(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},As=class extends Ao{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new U(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},js=new Wi,Ms=new Zo,Ns=new po,Ps=new B,Fs=class extends _a{constructor(e=new xo,t=new As){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ns.copy(n.boundingSphere),Ns.applyMatrix4(r),Ns.radius+=i,e.ray.intersectsSphere(Ns)===!1)return;js.copy(r).invert(),Ms.copy(e.ray).applyMatrix4(js);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Ps.fromBufferAttribute(l,n),Is(Ps,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Ps.fromBufferAttribute(l,a),Is(Ps,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Is(e,t,n,r,i,a,o){let s=Ms.distanceSqToPoint(e);if(s<n){let n=new B;Ms.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Ls=class extends Ri{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Rs=class extends Ri{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},zs=class extends Ri{constructor(e,t,n=Sn,r,i,a,o=dn,s=dn,c,l=Nn,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Pi(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Bs=class extends zs{constructor(e,t=Sn,n=301,r,i,a=dn,o=dn,s,c=Nn){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Vs=class extends Ri{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},G=class e extends xo{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new co(c,3)),this.setAttribute(`normal`,new co(l,3)),this.setAttribute(`uv`,new co(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new B;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Hs=class e extends xo{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new B,g=new B;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new co(o,3)),this.setAttribute(`normal`,new co(s,3)),this.setAttribute(`uv`,new co(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Us=class e extends xo{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new B,l=new z;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new co(a,3)),this.setAttribute(`normal`,new co(o,3)),this.setAttribute(`uv`,new co(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ws=class e extends xo{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new co(u,3)),this.setAttribute(`normal`,new co(d,3)),this.setAttribute(`uv`,new co(f,2));function _(){let a=new B,_=new B,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new z,m=new B,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Gs=class e extends Ws{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ks=class e extends xo{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new co(i,3)),this.setAttribute(`normal`,new co(i.slice(),3)),this.setAttribute(`uv`,new co(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new B,r=new B,i=new B;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new B;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new B;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new B,t=new B,n=new B,r=new B,o=new z,s=new z,c=new z;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},qs=new B,Js=new B,Ys=new B,Xs=new Ba,Zs=class extends xo{constructor(e=null,t=1){if(super(),this.type=`EdgesGeometry`,this.parameters={geometry:e,thresholdAngle:t},e!==null){let n=1e4,r=Math.cos(Xr*t),i=e.getIndex(),a=e.getAttribute(`position`),o=i?i.count:a.count,s=[0,0,0],c=[`a`,`b`,`c`],l=[,,,],u={},d=[];for(let e=0;e<o;e+=3){i?(s[0]=i.getX(e),s[1]=i.getX(e+1),s[2]=i.getX(e+2)):(s[0]=e,s[1]=e+1,s[2]=e+2);let{a:t,b:o,c:f}=Xs;if(t.fromBufferAttribute(a,s[0]),o.fromBufferAttribute(a,s[1]),f.fromBufferAttribute(a,s[2]),Xs.getNormal(Ys),l[0]=`${Math.round(t.x*n)},${Math.round(t.y*n)},${Math.round(t.z*n)}`,l[1]=`${Math.round(o.x*n)},${Math.round(o.y*n)},${Math.round(o.z*n)}`,l[2]=`${Math.round(f.x*n)},${Math.round(f.y*n)},${Math.round(f.z*n)}`,l[0]!==l[1]&&l[1]!==l[2]&&l[2]!==l[0])for(let e=0;e<3;e++){let t=(e+1)%3,n=l[e],i=l[t],a=Xs[c[e]],o=Xs[c[t]],f=`${n}_${i}`,p=`${i}_${n}`;p in u&&u[p]?(Ys.dot(u[p].normal)<=r&&(d.push(a.x,a.y,a.z),d.push(o.x,o.y,o.z)),u[p]=null):f in u||(u[f]={index0:s[e],index1:s[t],normal:Ys.clone()})}}for(let e in u)if(u[e]){let{index0:t,index1:n}=u[e];qs.fromBufferAttribute(a,t),Js.fromBufferAttribute(a,n),d.push(qs.x,qs.y,qs.z),d.push(Js.x,Js.y,Js.z)}this.setAttribute(`position`,new co(d,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Qs=class e extends Ks{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},$s=class e extends xo{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new co(p,3)),this.setAttribute(`normal`,new co(m,3)),this.setAttribute(`uv`,new co(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},ec=class e extends xo{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new B,d=new B,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new co(p,3)),this.setAttribute(`normal`,new co(m,3)),this.setAttribute(`uv`,new co(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},tc=class e extends xo{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new B,f=new B,p=new B;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new co(c,3)),this.setAttribute(`normal`,new co(l,3)),this.setAttribute(`uv`,new co(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function nc(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(ic(i))i.isRenderTargetTexture?(L(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(ic(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function rc(e){let t={};for(let n=0;n<e.length;n++){let r=nc(e[n]);for(let e in r)t[e]=r[e]}return t}function ic(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function ac(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function oc(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Oi.workingColorSpace}var sc={clone:nc,merge:rc},cc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,uc=class extends Ao{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cc,this.fragmentShader=lc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=nc(e.uniforms),this.uniformsGroups=ac(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new U().setHex(r.value);break;case`v2`:this.uniforms[n].value=new z().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new B().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new zi().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new V().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Wi().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},dc=class extends uc{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},fc=class extends Ao{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new U(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new U(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ea,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},pc=class extends Ao{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=kr,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},mc=class extends Ao{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function hc(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function gc(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var _c=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},vc=class extends _c{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Er,endingEnd:Er}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Dr:i=e,o=2*t-n;break;case Or:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Dr:a=e,s=2*n-t;break;case Or:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},yc=class extends _c{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},bc=class extends _c{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},xc=class extends _c{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=wc(n,t,g,y,r);i[p]=Sc(x,o,_,b,m)}return i}};function Sc(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Cc(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function wc(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Sc(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Cc(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Tc=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=hc(t,this.TimeBufferType),this.values=hc(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:hc(e.times,Array),values:hc(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),gc(e.settings)&&(n.settings={inTangents:hc(e.settings.inTangents,Array),outTangents:hc(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new bc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new yc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new vc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new xc(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Sr:t=this.InterpolantFactoryMethodDiscrete;break;case Cr:t=this.InterpolantFactoryMethodLinear;break;case wr:t=this.InterpolantFactoryMethodSmooth;break;case Tr:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return L(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Sr;case this.InterpolantFactoryMethodLinear:return Cr;case this.InterpolantFactoryMethodSmooth:return wr;case this.InterpolantFactoryMethodBezier:return Tr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;gc(this.settings)&&(Ec(this.settings.inTangents,e),Ec(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(R(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(R(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){R(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){R(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Rr(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){R(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===wr,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,gc(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ec(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Tc.prototype.ValueTypeName=``,Tc.prototype.TimeBufferType=Float32Array,Tc.prototype.ValueBufferType=Float32Array,Tc.prototype.DefaultInterpolation=Cr;var Dc=class extends Tc{constructor(e,t,n){super(e,t,n)}};Dc.prototype.ValueTypeName=`bool`,Dc.prototype.ValueBufferType=Array,Dc.prototype.DefaultInterpolation=Sr,Dc.prototype.InterpolantFactoryMethodLinear=void 0,Dc.prototype.InterpolantFactoryMethodSmooth=void 0;var Oc=class extends Tc{constructor(e,t,n,r){super(e,t,n,r)}};Oc.prototype.ValueTypeName=`color`;var kc=class extends Tc{constructor(e,t,n,r){super(e,t,n,r)}};kc.prototype.ValueTypeName=`number`;var Ac=class extends _c{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)xi.slerpFlat(i,0,a,c-o,a,c,s);return i}},jc=class extends Tc{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Ac(this.times,this.values,this.getValueSize(),e)}};jc.prototype.ValueTypeName=`quaternion`,jc.prototype.InterpolantFactoryMethodSmooth=void 0;var Mc=class extends Tc{constructor(e,t,n){super(e,t,n)}};Mc.prototype.ValueTypeName=`string`,Mc.prototype.ValueBufferType=Array,Mc.prototype.DefaultInterpolation=Sr,Mc.prototype.InterpolantFactoryMethodLinear=void 0,Mc.prototype.InterpolantFactoryMethodSmooth=void 0;var Nc=class extends Tc{constructor(e,t,n,r){super(e,t,n,r)}};Nc.prototype.ValueTypeName=`vector`;var Pc=class extends _a{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new U(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Fc=class extends Pc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(_a.DEFAULT_UP),this.updateMatrix(),this.groundColor=new U(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ic=new Wi,Lc=new B,Rc=new B,zc=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new z(512,512),this.mapType=_n,this.map=null,this.mapPass=null,this.matrix=new Wi,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gs,this._frameExtents=new z(1,1),this._viewportCount=1,this._viewports=[new zi(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Lc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Lc),Rc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Rc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Ic.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ic,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ic)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Bc=new B,Vc=new xi,Hc=new B,Uc=class extends _a{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Wi,this.projectionMatrix=new Wi,this.projectionMatrixInverse=new Wi,this.coordinateSystem=Ir,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Bc,Vc,Hc),Hc.x===1&&Hc.y===1&&Hc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bc,Vc,Hc.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Bc,Vc,Hc),Hc.x===1&&Hc.y===1&&Hc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bc,Vc,Hc.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Wc=new B,Gc=new z,Kc=new z,qc=class extends Uc{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Zr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Xr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zr*2*Math.atan(Math.tan(Xr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wc.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wc.x,Wc.y).multiplyScalar(-e/Wc.z),Wc.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wc.x,Wc.y).multiplyScalar(-e/Wc.z)}getViewSize(e,t){return this.getViewBounds(e,Gc,Kc),t.subVectors(Kc,Gc)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Xr*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Jc=class extends zc{constructor(){super(new qc(90,1,.5,500)),this.isPointLightShadow=!0}},Yc=class extends Pc{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Jc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Xc=class extends Uc{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Zc=class extends zc{constructor(){super(new Xc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Qc=class extends Pc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(_a.DEFAULT_UP),this.updateMatrix(),this.target=new _a,this.shadow=new Zc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},$c=class extends Pc{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},el=-90,tl=1,nl=class extends _a{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new qc(el,tl,e,t);r.layers=this.layers,this.add(r);let i=new qc(el,tl,e,t);i.layers=this.layers,this.add(i);let a=new qc(el,tl,e,t);a.layers=this.layers,this.add(a);let o=new qc(el,tl,e,t);o.layers=this.layers,this.add(o);let s=new qc(el,tl,e,t);s.layers=this.layers,this.add(s);let c=new qc(el,tl,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},rl=class extends qc{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},il=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=al.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function al(){this._document.hidden===!1&&this.reset()}var ol=`\\[\\]\\.:\\/`,sl=RegExp(`[\\[\\]\\.:\\/]`,`g`),cl=`[^\\[\\]\\.:\\/]`,ll=`[^`+ol.replace(`\\.`,``)+`]`,ul=`((?:WC+[\\/:])*)`.replace(`WC`,cl),dl=`(WCOD+)?`.replace(`WCOD`,ll),fl=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,cl),pl=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,cl),ml=RegExp(`^`+ul+dl+fl+pl+`$`),hl=[`material`,`materials`,`bones`,`map`],gl=class{constructor(e,t,n){let r=n||_l.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},_l=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(sl,``)}static parseTrackName(e){let t=ml.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);hl.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){L(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){R(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){R(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){R(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){R(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){R(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;R(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_l.Composite=gl,_l.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},_l.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},_l.prototype.GetterByBindingType=[_l.prototype._getValue_direct,_l.prototype._getValue_array,_l.prototype._getValue_arrayElement,_l.prototype._getValue_toArray],_l.prototype.SetterByBindingTypeAndVersioning=[[_l.prototype._setValue_direct,_l.prototype._setValue_direct_setNeedsUpdate,_l.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_l.prototype._setValue_array,_l.prototype._setValue_array_setNeedsUpdate,_l.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_l.prototype._setValue_arrayElement,_l.prototype._setValue_arrayElement_setNeedsUpdate,_l.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_l.prototype._setValue_fromArray,_l.prototype._setValue_fromArray_setNeedsUpdate,_l.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function vl(e,t,n,r){let i=yl(r);switch(n){case An:return e*t;case Fn:return e*t/i.components*i.byteLength;case In:return e*t/i.components*i.byteLength;case Ln:return e*t*2/i.components*i.byteLength;case Rn:return e*t*2/i.components*i.byteLength;case jn:return e*t*3/i.components*i.byteLength;case Mn:return e*t*4/i.components*i.byteLength;case zn:return e*t*4/i.components*i.byteLength;case Bn:case Vn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Hn:case Un:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Gn:case qn:return Math.max(e,16)*Math.max(t,8)/4;case Wn:case Kn:return Math.max(e,8)*Math.max(t,8)/2;case Jn:case Yn:case Zn:case Qn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Xn:case $n:case er:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case tr:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case nr:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case rr:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ir:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ar:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case or:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case sr:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case cr:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case lr:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case ur:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case dr:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case fr:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case pr:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case mr:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case hr:case gr:case _r:return Math.ceil(e/4)*Math.ceil(t/4)*16;case vr:case yr:return Math.ceil(e/4)*Math.ceil(t/4)*8;case br:case xr:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function yl(e){switch(e){case _n:case vn:return{byteLength:1,components:1};case bn:case yn:case wn:return{byteLength:2,components:1};case Tn:case En:return{byteLength:2,components:4};case Sn:case xn:case Cn:return{byteLength:4,components:1};case On:case kn:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?L(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function bl(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function xl(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var K={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},q={common:{diffuse:{value:new U(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new V},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new V}},envmap:{envMap:{value:null},envMapRotation:{value:new V},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new V}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new V}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new V},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new V},normalScale:{value:new z(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new V},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new V}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new V}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new V}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new U(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new U(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0},uvTransform:{value:new V}},sprite:{diffuse:{value:new U(16777215)},opacity:{value:1},center:{value:new z(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new V},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0}}},Sl={basic:{uniforms:rc([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.fog]),vertexShader:K.meshbasic_vert,fragmentShader:K.meshbasic_frag},lambert:{uniforms:rc([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new U(0)},envMapIntensity:{value:1}}]),vertexShader:K.meshlambert_vert,fragmentShader:K.meshlambert_frag},phong:{uniforms:rc([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new U(0)},specular:{value:new U(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:K.meshphong_vert,fragmentShader:K.meshphong_frag},standard:{uniforms:rc([q.common,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.roughnessmap,q.metalnessmap,q.fog,q.lights,{emissive:{value:new U(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:K.meshphysical_vert,fragmentShader:K.meshphysical_frag},toon:{uniforms:rc([q.common,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.gradientmap,q.fog,q.lights,{emissive:{value:new U(0)}}]),vertexShader:K.meshtoon_vert,fragmentShader:K.meshtoon_frag},matcap:{uniforms:rc([q.common,q.bumpmap,q.normalmap,q.displacementmap,q.fog,{matcap:{value:null}}]),vertexShader:K.meshmatcap_vert,fragmentShader:K.meshmatcap_frag},points:{uniforms:rc([q.points,q.fog]),vertexShader:K.points_vert,fragmentShader:K.points_frag},dashed:{uniforms:rc([q.common,q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:K.linedashed_vert,fragmentShader:K.linedashed_frag},depth:{uniforms:rc([q.common,q.displacementmap]),vertexShader:K.depth_vert,fragmentShader:K.depth_frag},normal:{uniforms:rc([q.common,q.bumpmap,q.normalmap,q.displacementmap,{opacity:{value:1}}]),vertexShader:K.meshnormal_vert,fragmentShader:K.meshnormal_frag},sprite:{uniforms:rc([q.sprite,q.fog]),vertexShader:K.sprite_vert,fragmentShader:K.sprite_frag},background:{uniforms:{uvTransform:{value:new V},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:K.background_vert,fragmentShader:K.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new V}},vertexShader:K.backgroundCube_vert,fragmentShader:K.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:K.cube_vert,fragmentShader:K.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:K.equirect_vert,fragmentShader:K.equirect_frag},distance:{uniforms:rc([q.common,q.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:K.distance_vert,fragmentShader:K.distance_frag},shadow:{uniforms:rc([q.lights,q.fog,{color:{value:new U(0)},opacity:{value:1}}]),vertexShader:K.shadow_vert,fragmentShader:K.shadow_frag}};Sl.physical={uniforms:rc([Sl.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new V},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new V},clearcoatNormalScale:{value:new z(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new V},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new V},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new V},sheen:{value:0},sheenColor:{value:new U(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new V},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new V},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new V},transmissionSamplerSize:{value:new z},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new V},attenuationDistance:{value:0},attenuationColor:{value:new U(0)},specularColor:{value:new U(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new V},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new V},anisotropyVector:{value:new z},anisotropyMap:{value:null},anisotropyMapTransform:{value:new V}}]),vertexShader:K.meshphysical_vert,fragmentShader:K.meshphysical_frag};var Cl={r:0,b:0,g:0},wl=new Wi,Tl=new V;Tl.set(-1,0,0,0,1,0,0,0,1);function El(e,t,n,r,i,a){let o=new U(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new W(new G(1,1,1),new uc({name:`BackgroundCubeMaterial`,uniforms:nc(Sl.backgroundCube.uniforms),vertexShader:Sl.backgroundCube.vertexShader,fragmentShader:Sl.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(wl.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Tl),l.material.toneMapped=Oi.getTransfer(i.colorSpace)!==Nr,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new W(new $s(2,2),new uc({name:`BackgroundMaterial`,uniforms:nc(Sl.background.uniforms),vertexShader:Sl.background.vertexShader,fragmentShader:Sl.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Oi.getTransfer(i.colorSpace)!==Nr,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Cl,oc(e)),n.buffers.color.setClear(Cl.r,Cl.g,Cl.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Dl(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Ol(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function kl(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(L(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&L(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Al(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Oo,s=new V,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var jl=4,Ml=6,Nl=20,Pl=256,Fl=new Xc,Il=new U,Ll=null,Rl=0,zl=0,Bl=!1,Vl=new B,Hl=new B,Ul=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Vl}=i;Ll=this._renderer.getRenderTarget(),Rl=this._renderer.getActiveCubeFace(),zl=this._renderer.getActiveMipmapLevel(),Bl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ll,Rl,zl),this._renderer.xr.enabled=Bl,e.scissorTest=!1,Kl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ll=this._renderer.getRenderTarget(),Rl=this._renderer.getActiveCubeFace(),zl=this._renderer.getActiveMipmapLevel(),Bl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:mn,minFilter:mn,generateMipmaps:!1,type:wn,format:Mn,colorSpace:jr,depthBuffer:!1},r=Gl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gl(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Wl(r)),this._blurMaterial=Jl(r,e,t),this._ggxMaterial=ql(r,e,t)}return r}_compileMaterial(e){let t=new W(new xo,e);this._renderer.compile(t,Fl)}_sceneToCubeUV(e,t,n,r,i){let a=new qc(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Il),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new W(new G,new Qo({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Il),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Kl(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yl());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Kl(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Fl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-jl?n-d+jl:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Kl(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Fl),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Kl(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Fl)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Kl(t,3*l*(r>this._lodMax-jl?r-this._lodMax+jl:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Fl)}};function Wl(e){let t=[],n=[],r=e,i=e-jl+1+Ml;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Hl.set(1,r,n):e===1?Hl.set(-n,1,-r):e===2?Hl.set(-n,r,1):e===3?Hl.set(-1,r,-n):e===4?Hl.set(-n,-1,r):Hl.set(n,r,-1),Hl.toArray(l,(e*6+t)*3)}}let u=new xo;u.setAttribute(`position`,new ao(c,3)),u.setAttribute(`outputDirection`,new ao(l,3)),n.push(new W(u,null)),r>jl&&r--}return{lodMeshes:n,sizeLods:t}}function Gl(e,t,n){let r=new Vi(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Kl(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ql(e,t,n){return new uc({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Pl,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Zl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Jl(e,t,n){return new uc({name:`SphericalGaussianBlur`,defines:{SAMPLES:Nl,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Zl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Yl(){return new uc({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Zl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Xl(){return new uc({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Zl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Ql=class extends Vi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ls(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new G(5,5,5),i=new uc({name:`CubemapFromEquirect`,uniforms:nc(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new W(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=mn),new nl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function $l(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Ql(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Ul(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Ul(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function eu(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Wr(`WebGLRenderer: `+e+` extension not supported.`),t}}}function tu(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?so:oo)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function nu(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function ru(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:R(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function iu(e,t,n){let r=new WeakMap,i=new zi;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],p=0;e===!0&&(p=1),n===!0&&(p=2),a===!0&&(p=3);let m=o.attributes.position.count*p,h=1;m>t.maxTextureSize&&(h=Math.ceil(m/t.maxTextureSize),m=t.maxTextureSize);let g=new Float32Array(m*h*4*u),_=new Hi(g,m,h,u);_.type=Cn,_.needsUpdate=!0;let v=p*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=m*h*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new z(m,h)},r.set(o,d);function f(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,f)}o.addEventListener(`dispose`,f)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function au(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var ou={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function su(e,t,n,r,i,a){let o=new Vi(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new xo;l.setAttribute(`position`,new co([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new co([0,2,0,0,2,0],2));let u=new dc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new W(l,u),f=new Xc(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new Vi(t,n,{type:wn,depthBuffer:!1,stencilBuffer:!1}),c=new Vi(t,n,{type:wn,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Oi.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=ou[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var cu=new Ri,lu=new zs(1,1),uu=new Hi,du=new Ui,fu=new Ls,pu=[],mu=[],hu=new Float32Array(16),gu=new Float32Array(9),_u=new Float32Array(4);function vu(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=pu[i];if(a===void 0&&(a=new Float32Array(i),pu[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function yu(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function bu(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function xu(e,t){let n=mu[t];n===void 0&&(n=new Int32Array(t),mu[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Su(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Cu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(yu(n,t))return;e.uniform2fv(this.addr,t),bu(n,t)}}function wu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(yu(n,t))return;e.uniform3fv(this.addr,t),bu(n,t)}}function Tu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(yu(n,t))return;e.uniform4fv(this.addr,t),bu(n,t)}}function Eu(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(yu(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),bu(n,t)}else{if(yu(n,r))return;_u.set(r),e.uniformMatrix2fv(this.addr,!1,_u),bu(n,r)}}function Du(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(yu(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),bu(n,t)}else{if(yu(n,r))return;gu.set(r),e.uniformMatrix3fv(this.addr,!1,gu),bu(n,r)}}function Ou(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(yu(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),bu(n,t)}else{if(yu(n,r))return;hu.set(r),e.uniformMatrix4fv(this.addr,!1,hu),bu(n,r)}}function ku(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Au(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(yu(n,t))return;e.uniform2iv(this.addr,t),bu(n,t)}}function ju(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(yu(n,t))return;e.uniform3iv(this.addr,t),bu(n,t)}}function Mu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(yu(n,t))return;e.uniform4iv(this.addr,t),bu(n,t)}}function Nu(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Pu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(yu(n,t))return;e.uniform2uiv(this.addr,t),bu(n,t)}}function Fu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(yu(n,t))return;e.uniform3uiv(this.addr,t),bu(n,t)}}function Iu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(yu(n,t))return;e.uniform4uiv(this.addr,t),bu(n,t)}}function Lu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(lu.compareFunction=n.isReversedDepthBuffer()?518:515,a=lu):a=cu,n.setTexture2D(t||a,i)}function Ru(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||du,i)}function zu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||fu,i)}function Bu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||uu,i)}function Vu(e){switch(e){case 5126:return Su;case 35664:return Cu;case 35665:return wu;case 35666:return Tu;case 35674:return Eu;case 35675:return Du;case 35676:return Ou;case 5124:case 35670:return ku;case 35667:case 35671:return Au;case 35668:case 35672:return ju;case 35669:case 35673:return Mu;case 5125:return Nu;case 36294:return Pu;case 36295:return Fu;case 36296:return Iu;case 35678:case 36198:case 36298:case 36306:case 35682:return Lu;case 35679:case 36299:case 36307:return Ru;case 35680:case 36300:case 36308:case 36293:return zu;case 36289:case 36303:case 36311:case 36292:return Bu}}function Hu(e,t){e.uniform1fv(this.addr,t)}function Uu(e,t){let n=vu(t,this.size,2);e.uniform2fv(this.addr,n)}function Wu(e,t){let n=vu(t,this.size,3);e.uniform3fv(this.addr,n)}function Gu(e,t){let n=vu(t,this.size,4);e.uniform4fv(this.addr,n)}function Ku(e,t){let n=vu(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function qu(e,t){let n=vu(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Ju(e,t){let n=vu(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Yu(e,t){e.uniform1iv(this.addr,t)}function Xu(e,t){e.uniform2iv(this.addr,t)}function Zu(e,t){e.uniform3iv(this.addr,t)}function Qu(e,t){e.uniform4iv(this.addr,t)}function $u(e,t){e.uniform1uiv(this.addr,t)}function ed(e,t){e.uniform2uiv(this.addr,t)}function td(e,t){e.uniform3uiv(this.addr,t)}function nd(e,t){e.uniform4uiv(this.addr,t)}function rd(e,t,n){let r=this.cache,i=t.length,a=xu(n,i);yu(r,a)||(e.uniform1iv(this.addr,a),bu(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?lu:cu;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function id(e,t,n){let r=this.cache,i=t.length,a=xu(n,i);yu(r,a)||(e.uniform1iv(this.addr,a),bu(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||du,a[e])}function ad(e,t,n){let r=this.cache,i=t.length,a=xu(n,i);yu(r,a)||(e.uniform1iv(this.addr,a),bu(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||fu,a[e])}function od(e,t,n){let r=this.cache,i=t.length,a=xu(n,i);yu(r,a)||(e.uniform1iv(this.addr,a),bu(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||uu,a[e])}function sd(e){switch(e){case 5126:return Hu;case 35664:return Uu;case 35665:return Wu;case 35666:return Gu;case 35674:return Ku;case 35675:return qu;case 35676:return Ju;case 5124:case 35670:return Yu;case 35667:case 35671:return Xu;case 35668:case 35672:return Zu;case 35669:case 35673:return Qu;case 5125:return $u;case 36294:return ed;case 36295:return td;case 36296:return nd;case 35678:case 36198:case 36298:case 36306:case 35682:return rd;case 35679:case 36299:case 36307:return id;case 35680:case 36300:case 36308:case 36293:return ad;case 36289:case 36303:case 36311:case 36292:return od}}var cd=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Vu(t.type)}},ld=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=sd(t.type)}},ud=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},dd=/(\w+)(\])?(\[|\.)?/g;function fd(e,t){e.seq.push(t),e.map[t.id]=t}function pd(e,t,n){let r=e.name,i=r.length;for(dd.lastIndex=0;;){let a=dd.exec(r),o=dd.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){fd(n,l===void 0?new cd(s,e,t):new ld(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new ud(s),fd(n,e)),n=e}}}var md=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);pd(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function hd(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var gd=37297,_d=0;function vd(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var yd=new V;function bd(e){Oi._getMatrix(yd,Oi.workingColorSpace,e);let t=`mat3( ${yd.elements.map(e=>e.toFixed(4))} )`;switch(Oi.getTransfer(e)){case Mr:return[t,`LinearTransferOETF`];case Nr:return[t,`sRGBTransferOETF`];default:return L(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function xd(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+vd(e.getShaderSource(t),r)}return i}function Sd(e,t){let n=bd(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Cd={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function wd(e,t){let n=Cd[t];return n===void 0?(L(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Td=new B;function Ed(){return Oi.getLuminanceCoefficients(Td),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Td.x.toFixed(4)}, ${Td.y.toFixed(4)}, ${Td.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Dd(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Ad).join(`
`)}function Od(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function kd(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Ad(e){return e!==``}function jd(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Md(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Nd=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pd(e){return e.replace(Nd,Id)}var Fd=new Map;function Id(e,t){let n=K[t];if(n===void 0){let e=Fd.get(t);if(e!==void 0)n=K[e],L(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Pd(n)}var Ld=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rd(e){return e.replace(Ld,zd)}function zd(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Bd(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Vd={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Hd(e){return Vd[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Ud={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Wd(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Ud[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Gd={302:`ENVMAP_MODE_REFRACTION`};function Kd(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Gd[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var qd={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Jd(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:qd[e.combine]||`ENVMAP_BLENDING_NONE`}function Yd(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Xd(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Hd(n),l=Wd(n),u=Kd(n),d=Jd(n),f=Yd(n),p=Dd(n),m=Od(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ad).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ad).join(`
`),_.length>0&&(_+=`
`)):(g=[Bd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Ad).join(`
`),_=[Bd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:K.tonemapping_pars_fragment,n.toneMapping===0?``:wd(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,K.colorspace_pars_fragment,Sd(`linearToOutputTexel`,n.outputColorSpace),Ed(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Ad).join(`
`)),o=Pd(o),o=jd(o,n),o=Md(o,n),s=Pd(s),s=jd(s,n),s=Md(s,n),o=Rd(o),s=Rd(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=hd(i,i.VERTEX_SHADER,y),S=hd(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=xd(i,x,`vertex`),n=xd(i,S,`fragment`);R(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):L(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new md(i,h),T=kd(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,gd)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=_d++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Zd=0,Qd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new $d(e),t.set(e,n)),n}},$d=class{constructor(e){this.id=Zd++,this.code=e,this.usedTimes=0}};function ef(e){return e===1030||e===37490||e===36285}function tf(e,t,n,r,i,a){let o=new ta,s=new Qd,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&L(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,ee,k;if(C){let e=Sl[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,k=t.id}let te=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),A=h.isInstancedMesh===!0,re=h.isBatchedMesh===!0,ie=!!i.map,ae=!!i.matcap,oe=!!x,se=!!i.aoMap,ce=!!i.lightMap,le=!!i.bumpMap&&i.wireframe===!1,ue=!!i.normalMap,de=!!i.displacementMap,fe=!!i.emissiveMap,pe=!!i.metalnessMap,me=!!i.roughnessMap,he=i.anisotropy>0,ge=i.clearcoat>0,_e=i.dispersion>0,ve=i.retroreflectivity>0,ye=i.iridescence>0,be=i.sheen>0,xe=i.transmission>0,Se=he&&!!i.anisotropyMap,Ce=ge&&!!i.clearcoatMap,we=ge&&!!i.clearcoatNormalMap,Te=ge&&!!i.clearcoatRoughnessMap,Ee=ye&&!!i.iridescenceMap,j=ye&&!!i.iridescenceThicknessMap,De=be&&!!i.sheenColorMap,Oe=be&&!!i.sheenRoughnessMap,ke=!!i.specularMap,M=!!i.specularColorMap,Ae=!!i.specularIntensityMap,N=xe&&!!i.transmissionMap,P=xe&&!!i.thicknessMap,je=!!i.gradientMap,Me=!!i.alphaMap,Ne=i.alphaTest>0,Pe=!!i.alphaHash,Fe=!!i.extensions,Ie=0;i.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ie=e.toneMapping);let Le={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:re,batchingColor:re&&h._colorsTexture!==null,instancing:A,instancingColor:A&&h.instanceColor!==null,instancingMorph:A&&h.morphTexture!==null,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Oi.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ie,matcap:ae,envMap:oe,envMapMode:oe&&x.mapping,envMapCubeUVHeight:S,aoMap:se,lightMap:ce,bumpMap:le,normalMap:ue,displacementMap:de,emissiveMap:fe,normalMapObjectSpace:ue&&i.normalMapType===1,normalMapTangentSpace:ue&&i.normalMapType===0,packedNormalMap:ue&&i.normalMapType===0&&ef(i.normalMap.format),metalnessMap:pe,roughnessMap:me,anisotropy:he,anisotropyMap:Se,clearcoat:ge,clearcoatMap:Ce,clearcoatNormalMap:we,clearcoatRoughnessMap:Te,dispersion:_e,retroreflection:ve,iridescence:ye,iridescenceMap:Ee,iridescenceThicknessMap:j,sheen:be,sheenColorMap:De,sheenRoughnessMap:Oe,specularMap:ke,specularColorMap:M,specularIntensityMap:Ae,transmission:xe,transmissionMap:N,thicknessMap:P,gradientMap:je,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Me,alphaTest:Ne,alphaHash:Pe,combine:i.combine,mapUv:ie&&m(i.map.channel),aoMapUv:se&&m(i.aoMap.channel),lightMapUv:ce&&m(i.lightMap.channel),bumpMapUv:le&&m(i.bumpMap.channel),normalMapUv:ue&&m(i.normalMap.channel),displacementMapUv:de&&m(i.displacementMap.channel),emissiveMapUv:fe&&m(i.emissiveMap.channel),metalnessMapUv:pe&&m(i.metalnessMap.channel),roughnessMapUv:me&&m(i.roughnessMap.channel),anisotropyMapUv:Se&&m(i.anisotropyMap.channel),clearcoatMapUv:Ce&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:we&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ee&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:j&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:De&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&m(i.sheenRoughnessMap.channel),specularMapUv:ke&&m(i.specularMap.channel),specularColorMapUv:M&&m(i.specularColorMap.channel),specularIntensityMapUv:Ae&&m(i.specularIntensityMap.channel),transmissionMapUv:N&&m(i.transmissionMap.channel),thicknessMapUv:P&&m(i.thicknessMap.channel),alphaMapUv:Me&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ue||he),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ie||Me),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ue===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ne,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ie,decodeVideoTexture:ie&&i.map.isVideoTexture===!0&&Oi.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:fe&&i.emissiveMap.isVideoTexture===!0&&Oi.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Fe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Fe&&i.extensions.multiDraw===!0||re)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Le.vertexUv1s=c.has(1),Le.vertexUv2s=c.has(2),Le.vertexUv3s=c.has(3),c.clear(),Le}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Sl[t];n=sc.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Xd(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function nf(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function rf(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function af(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function of(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||rf),r.length>1&&r.sort(t||af),i.length>1&&i.sort(t||af)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function sf(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new of,e.set(t,[i])):n>=r.length?(i=new of,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function cf(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new B,color:new U};break;case`SpotLight`:n={position:new B,direction:new B,color:new U,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new B,color:new U,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new B,skyColor:new U,groundColor:new U};break;case`RectAreaLight`:n={color:new U,position:new B,halfWidth:new B,halfHeight:new B}}return e[t.id]=n,n}}}function lf(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var uf=0;function df(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function ff(e){let t=new cf,n=lf(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new B);let i=new B,a=new Wi,o=new Wi;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(df);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=q.LTC_FLOAT_1,r.rectAreaLTC2=q.LTC_FLOAT_2):(r.rectAreaLTC1=q.LTC_HALF_1,r.rectAreaLTC2=q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=uf++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function pf(e){let t=new ff(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function mf(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new pf(e),t.set(n,[a])):r>=i.length?(a=new pf(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var hf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gf=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,_f=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],vf=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],yf=new Wi,bf=new B,xf=new B;function Sf(e,t,n){let r=new gs,i=new z,a=new z,o=new zi,s=new pc,c=new mc,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new uc({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new z},radius:{value:4}},vertexShader:hf,fragmentShader:gf}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new xo;m.setAttribute(`position`,new ao(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new W(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(L(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){L(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){L(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Vi(i.x,i.y,{format:Ln,type:wn,minFilter:mn,magFilter:mn,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new zs(i.x,i.y,Cn),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Nn,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=dn,d.map.depthTexture.magFilter=dn}else l.isPointLight?(d.map=new Ql(i.x),d.map.depthTexture=new Bs(i.x,Sn)):(d.map=new Vi(i.x,i.y),d.map.depthTexture=new zs(i.x,i.y,Sn)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Nn,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=mn,d.map.depthTexture.magFilter=mn):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=dn,d.map.depthTexture.magFilter=dn);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),bf.setFromMatrixPosition(l.matrixWorld),e.position.copy(bf),xf.copy(e.position),xf.add(_f[t]),e.up.copy(vf[t]),e.lookAt(xf),e.updateMatrixWorld(),n.makeTranslation(-bf.x,-bf.y,-bf.z),yf.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(yf,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Vi(i.x,i.y,{format:Ln,type:wn}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Cf(e,t){function n(){let t=!1,n=new zi,r=null,i=new zi(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?pe(e.DEPTH_TEST):me(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Kr[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?pe(e.STENCIL_TEST):me(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new U(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,ne=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),A=!1,re=0,ie=e.getParameter(e.VERSION);ie.indexOf(`WebGL`)===-1?ie.indexOf(`OpenGL ES`)!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),A=re>=2):(re=parseFloat(/^WebGL (\d)/.exec(ie)[1]),A=re>=1);let ae=null,oe={},se=e.getParameter(e.SCISSOR_BOX),ce=e.getParameter(e.VIEWPORT),le=new zi().fromArray(se),ue=new zi().fromArray(ce);function de(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let fe={};fe[e.TEXTURE_2D]=de(e.TEXTURE_2D,e.TEXTURE_2D,1),fe[e.TEXTURE_CUBE_MAP]=de(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[e.TEXTURE_2D_ARRAY]=de(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),fe[e.TEXTURE_3D]=de(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),pe(e.DEPTH_TEST),o.setFunc(3),Se(!1),Ce(1),pe(e.CULL_FACE),be(0);function pe(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function me(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function he(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ge(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function _e(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ve={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ve[103]=e.MIN,ve[104]=e.MAX;let ye={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function be(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(me(e.BLEND),g=!1);else if(g===!1&&(pe(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:R(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:R(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:R(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:R(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ve[n],ve[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ye[r],ye[i],ye[o],ye[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function xe(t,n){t.side===2?me(e.CULL_FACE):pe(e.CULL_FACE);let r=t.side===1;n&&(r=!r),Se(r),t.blending===1&&t.transparent===!1?be(0):be(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Te(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?pe(e.SAMPLE_ALPHA_TO_COVERAGE):me(e.SAMPLE_ALPHA_TO_COVERAGE)}function Se(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function Ce(t){t===0?me(e.CULL_FACE):(pe(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function we(t){t!==ee&&(A&&e.lineWidth(t),ee=t)}function Te(t,n,r){t?(pe(e.POLYGON_OFFSET_FILL),(k!==n||te!==r)&&(k=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):me(e.POLYGON_OFFSET_FILL)}function Ee(t){t?pe(e.SCISSOR_TEST):me(e.SCISSOR_TEST)}function j(t){t===void 0&&(t=e.TEXTURE0+ne-1),ae!==t&&(e.activeTexture(t),ae=t)}function De(t,n,r){r===void 0&&(r=ae===null?e.TEXTURE0+ne-1:ae);let i=oe[r];i===void 0&&(i={type:void 0,texture:void 0},oe[r]=i),(i.type!==t||i.texture!==n)&&(ae!==r&&(e.activeTexture(r),ae=r),e.bindTexture(t,n||fe[t]),i.type=t,i.texture=n)}function Oe(){let t=oe[ae];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function ke(){try{e.compressedTexImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function M(){try{e.compressedTexImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ae(){try{e.texSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function N(){try{e.texSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function P(){try{e.compressedTexSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function je(){try{e.compressedTexSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Me(){try{e.texStorage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ne(){try{e.texStorage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Pe(){try{e.texImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Fe(){try{e.texImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ie(t){return d[t]===void 0?e.getParameter(t):d[t]}function Le(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Re(t){le.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),le.copy(t))}function ze(t){ue.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ue.copy(t))}function Be(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ve(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function He(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ae=null,oe={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new U(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,le.set(0,0,e.canvas.width,e.canvas.height),ue.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:pe,disable:me,bindFramebuffer:he,drawBuffers:ge,useProgram:_e,setBlending:be,setMaterial:xe,setFlipSided:Se,setCullFace:Ce,setLineWidth:we,setPolygonOffset:Te,setScissorTest:Ee,activeTexture:j,bindTexture:De,unbindTexture:Oe,compressedTexImage2D:ke,compressedTexImage3D:M,texImage2D:Pe,texImage3D:Fe,pixelStorei:Le,getParameter:Ie,updateUBOMapping:Be,uniformBlockBinding:Ve,texStorage2D:Me,texStorage3D:Ne,texSubImage2D:Ae,texSubImage3D:N,compressedTexSubImage2D:P,compressedTexSubImage3D:je,scissor:Re,viewport:ze,reset:He}}function wf(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new z,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):zr(`canvas`)}function g(e,t,n){let r=1,i=ke(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),L(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&L(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];L(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||L(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Mr:Oi.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,L(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function ee(){O=0}function k(){return O}function te(e){O=e}function ne(){let e=O;return e>=i.maxTextures&&L(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function A(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function re(t,i){let a=r.get(t);if(t.isVideoTexture&&De(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)L(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)L(`WebGLRenderer: Texture marked for update but image is incomplete`);else{me(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ie(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?me(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function ae(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?me(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function oe(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?he(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let se={[cn]:e.REPEAT,[ln]:e.CLAMP_TO_EDGE,[un]:e.MIRRORED_REPEAT},ce={[dn]:e.NEAREST,[fn]:e.NEAREST_MIPMAP_NEAREST,[pn]:e.NEAREST_MIPMAP_LINEAR,[mn]:e.LINEAR,[hn]:e.LINEAR_MIPMAP_NEAREST,[gn]:e.LINEAR_MIPMAP_LINEAR},le={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ue(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&L(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,se[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,se[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,se[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ce[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ce[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,le[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function de(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=A(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function fe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function pe(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=fe(n.start,r.width,4),c=fe(t.start,r.width,4);n.start<=i+1&&a===c&&fe(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function me(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=de(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Oi.getPrimaries(Oi.workingColorSpace),r=o.colorSpace===``?null:Oi.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Oe(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);ue(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===Pn,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&pe(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=vl(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=vl(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=ke(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=ke(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function he(t,o,s){if(o.image.length!==6)return;let c=de(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Oi.getPrimaries(Oi.workingColorSpace),r=o.colorSpace===``?null:Oi.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Oe(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);ue(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=ke(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ge(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),j(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ee(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function _e(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;j(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ee(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ee(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);j(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ee(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ee(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ve(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),ue(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else re(i.depthTexture,0);let u=l.__webglTexture,d=Ee(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)j(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)j(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ye(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)ve(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?ve(i.__webglFramebuffer[0],t,0):ve(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),_e(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),_e(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function be(t,n,i){let a=r.get(t);n!==void 0&&ge(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ye(t)}function xe(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&j(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ee(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),_e(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),ue(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ge(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ge(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),ue(c,a),ge(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),ue(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ge(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ge(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ye(t)}function Se(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let Ce=[],we=[];function Te(t){if(t.samples>0){if(j(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ce.length=0,we.length=0,Ce.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Ce.push(l),we.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,we)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ce))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ee(e){return Math.min(i.maxSamples,e.samples)}function j(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function De(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Oe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Oi.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&L(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):R(`WebGLTextures: Unsupported texture color space:`,n)),t}function ke(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ne,this.resetTextureUnits=ee,this.getTextureUnits=k,this.setTextureUnits=te,this.setTexture2D=re,this.setTexture2DArray=ie,this.setTexture3D=ae,this.setTextureCube=oe,this.rebindTextures=be,this.setupRenderTarget=xe,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=Te,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=j,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Tf(e,t){function n(n,r=``){let i,a=Oi.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Ef=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Df=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Of=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Vs(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new uc({vertexShader:Ef,fragmentShader:Df,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new W(new $s(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},kf=class extends qr{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Of,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new z,C=null,w=null,T=new qc;T.viewport=new zi;let E=new qc;E.viewport=new zi;let D=[T,E],O=new rl,ee=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new ya,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new ya,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new ya,b[e]=t),t.getHandSpace()};function te(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ne(){r.removeEventListener(`select`,te),r.removeEventListener(`selectstart`,te),r.removeEventListener(`selectend`,te),r.removeEventListener(`squeeze`,te),r.removeEventListener(`squeezestart`,te),r.removeEventListener(`squeezeend`,te),r.removeEventListener(`end`,ne),r.removeEventListener(`inputsourceschange`,A);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}ee=null,k=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,te),r.addEventListener(`selectstart`,te),r.addEventListener(`selectend`,te),r.addEventListener(`squeeze`,te),r.addEventListener(`squeezestart`,te),r.addEventListener(`squeezeend`,te),r.addEventListener(`end`,ne),r.addEventListener(`inputsourceschange`,A),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Pn:Nn,a=_.stencil?Dn:Sn);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Vi(d.textureWidth,d.textureHeight,{format:Mn,type:_n,depthTexture:new zs(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Vi(f.framebufferWidth,f.framebufferHeight,{format:Mn,type:_n,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ue.setContext(r),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function A(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let re=new B,ie=new B;function ae(e,t,n){re.setFromMatrixPosition(t.matrixWorld),ie.setFromMatrixPosition(n.matrixWorld);let r=re.distanceTo(ie),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function oe(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(ee!==O.near||k!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),ee=O.near,k=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;oe(O,i);for(let e=0;e<a.length;e++)oe(a[e],i);a.length===2?ae(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),se(e,O,i)};function se(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Zr*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let ce=null;function le(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new qc,o.layers.enable(n),o.viewport=new zi,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Vs,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ce&&ce(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ue=new bl;ue.setAnimationLoop(le),this.setAnimationLoop=function(e){ce=e},this.dispose=function(){}}},Af=new Wi,jf=new V;jf.set(-1,0,0,0,1,0,0,0,1);function Mf(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,oc(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Af.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(jf),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Nf(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return R(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?L(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):L(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Pf=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ff=null;function If(){return Ff===null&&(Ff=new fs(Pf,16,16,Ln,wn),Ff.name=`DFG_LUT`,Ff.minFilter=mn,Ff.magFilter=mn,Ff.wrapS=ln,Ff.wrapT=ln,Ff.generateMipmaps=!1,Ff.needsUpdate=!0),Ff}var Lf=class{constructor(e={}){let{canvas:t=Br(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=_n}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([zn,Rn,In]),g=new Set([_n,Sn,bn,Dn,Tn,En]),_=new Uint32Array(4),v=new Int32Array(4),y=new B,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,ee=null,k=null;this._outputColorSpace=Ar;let te=0,ne=0,A=null,re=-1,ie=null,ae=new zi,oe=new zi,se=null,ce=new U(0),le=0,ue=t.width,de=t.height,fe=1,pe=null,me=null,he=new zi(0,0,ue,de),ge=new zi(0,0,ue,de),_e=!1,ve=new gs,ye=!1,be=!1,xe=new Wi,Se=new B,Ce=new zi,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Te=!1;function Ee(){return A===null?fe:1}let j=n;function De(e,n){return t.getContext(e,n)}let Oe,ke,M,Ae,N,P,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,Xe,!1),t.addEventListener(`webglcontextrestored`,Ze,!1),t.addEventListener(`webglcontextcreationerror`,Qe,!1),j===null){let t=`webgl2`;if(j=De(t,e),j===null)throw De(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Je()}catch(e){throw t.removeEventListener(`webglcontextlost`,Xe,!1),t.removeEventListener(`webglcontextrestored`,Ze,!1),t.removeEventListener(`webglcontextcreationerror`,Qe,!1),R(`WebGLRenderer: `+e.message),e}function Je(){Oe=new eu(j),Oe.init(),Ge=new Tf(j,Oe),ke=new kl(j,Oe,e,Ge),M=new Cf(j,Oe),ke.reversedDepthBuffer&&d&&M.buffers.depth.setReversed(!0),O=j.createFramebuffer(),ee=j.createFramebuffer(),k=j.createFramebuffer(),Ae=new ru(j),N=new nf,P=new wf(j,Oe,M,N,ke,Ge,Ae),je=new $l(T),Me=new xl(j),Ke=new Dl(j,Me),Ne=new tu(j,Me,Ae,Ke),Pe=new au(j,Ne,Me,Ke,Ae),He=new iu(j,ke,P),ze=new Al(N),Fe=new tf(T,je,Oe,ke,Ke,ze),Ie=new Mf(T,N),Le=new sf,Re=new mf(Oe),Ve=new El(T,je,M,Pe,p,s),Be=new Sf(T,Pe,ke),qe=new Nf(j,Ae,ke,M),Ue=new Ol(j,Oe,Ae),We=new nu(j,Oe,Ae),Ae.programs=Fe.programs,T.capabilities=ke,T.extensions=Oe,T.properties=N,T.renderLists=Le,T.shadowMap=Be,T.state=M,T.info=Ae}m!==1009&&(w=new su(m,t.width,t.height,o,r,i));let Ye=new kf(T,j);this.xr=Ye,this.getContext=function(){return j},this.getContextAttributes=function(){return j.getContextAttributes()},this.forceContextLoss=function(){let e=Oe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Oe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return fe},this.setPixelRatio=function(e){e!==void 0&&(fe=e,this.setSize(ue,de,!1))},this.getSize=function(e){return e.set(ue,de)},this.setSize=function(e,n,r=!0){Ye.isPresenting?L(`WebGLRenderer: Can't change size while VR device is presenting.`):(ue=e,de=n,t.width=Math.floor(e*fe),t.height=Math.floor(n*fe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(ue*fe,de*fe).floor()},this.setDrawingBufferSize=function(e,n,r){ue=e,de=n,fe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)R(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){L(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(ae)},this.getViewport=function(e){return e.copy(he)},this.setViewport=function(e,t,n,r){e.isVector4?he.set(e.x,e.y,e.z,e.w):he.set(e,t,n,r),M.viewport(ae.copy(he).multiplyScalar(fe).round())},this.getScissor=function(e){return e.copy(ge)},this.setScissor=function(e,t,n,r){e.isVector4?ge.set(e.x,e.y,e.z,e.w):ge.set(e,t,n,r),M.scissor(oe.copy(ge).multiplyScalar(fe).round())},this.getScissorTest=function(){return _e},this.setScissorTest=function(e){M.setScissorTest(_e=e)},this.setOpaqueSort=function(e){pe=e},this.setTransparentSort=function(e){me=e},this.getClearColor=function(e){return e.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(A!==null){let t=A.texture.format;e=h.has(t)}if(e){let e=A.texture.type,t=g.has(e),n=Ve.getClearColor(),r=Ve.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,j.clearBufferuiv(j.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,j.clearBufferiv(j.COLOR,0,v))}else r|=j.COLOR_BUFFER_BIT}t&&(r|=j.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=j.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&j.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Xe,!1),t.removeEventListener(`webglcontextrestored`,Ze,!1),t.removeEventListener(`webglcontextcreationerror`,Qe,!1),Ve.dispose(),Le.dispose(),Re.dispose(),N.dispose(),je.dispose(),Pe.dispose(),Ke.dispose(),qe.dispose(),Fe.dispose(),Ye.dispose(),Ye.removeEventListener(`sessionstart`,at),Ye.removeEventListener(`sessionend`,ot),st.stop()};function Xe(e){e.preventDefault(),Hr(`WebGLRenderer: Context Lost.`),E=!0}function Ze(){Hr(`WebGLRenderer: Context Restored.`),E=!1;let e=Ae.autoReset,t=Be.enabled,n=Be.autoUpdate,r=Be.needsUpdate,i=Be.type;Je(),Ae.autoReset=e,Be.enabled=t,Be.autoUpdate=n,Be.needsUpdate=r,Be.type=i}function Qe(e){R(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function $e(e){let t=e.target;t.removeEventListener(`dispose`,$e),et(t)}function et(e){tt(e),N.remove(e)}function tt(e){let t=N.get(e).programs;t!==void 0&&(t.forEach(function(e){Fe.releaseProgram(e)}),e.isShaderMaterial&&Fe.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=we);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=_t(e,t,n,r,i);M.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ne.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ke.setup(i,r,s,n,c);let h,g=Ue;if(c!==null&&(h=Me.get(c),g=We,g.setIndex(h)),i.isMesh)r.wireframe===!0?(M.setLineWidth(r.wireframeLinewidth*Ee()),g.setMode(j.LINES)):g.setMode(j.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),M.setLineWidth(e*Ee()),i.isLineSegments?g.setMode(j.LINES):i.isLineLoop?g.setMode(j.LINE_LOOP):g.setMode(j.LINE_STRIP)}else i.isPoints?g.setMode(j.POINTS):i.isSprite&&g.setMode(j.TRIANGLES);if(i.isBatchedMesh){if(Oe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Me.get(c).bytesPerElement:1,o=N.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(j,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function nt(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),ye===!0&&ze.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,pt(e,t,r),e.side=0,e.needsUpdate=!0,pt(e,t,r),e.side=2):pt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Re.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),be=this.localClippingEnabled,ye=ze.init(this.clippingPlanes,be),ye===!0&&ze.setGlobalState(this.clippingPlanes,t),D!==null&&Be.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];nt(o,n,t,e),r.add(o)}else nt(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=N.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Oe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let rt=null;function it(e){rt&&rt(e)}function at(){st.stop()}function ot(){st.start()}let st=new bl;st.setAnimationLoop(it),typeof self<`u`&&st.setContext(self),this.setAnimationLoop=function(e){rt=e,Ye.setAnimationLoop(e),e===null?st.stop():st.start()},Ye.addEventListener(`sessionstart`,at),Ye.addEventListener(`sessionend`,ot),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){R(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ye.enabled===!0&&Ye.isPresenting===!0,r=w!==null&&(A===null||n)&&w.begin(T,A);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ye.enabled===!0&&Ye.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ye.cameraAutoUpdate===!0&&Ye.updateCamera(t),t=Ye.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,A),x=Re.get(e,C.length),x.init(t),x.state.textureUnits=P.getTextureUnits(),C.push(x),xe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ve.setFromProjectionMatrix(xe,Ir,t.reversedDepth),be=this.localClippingEnabled,ye=ze.init(this.clippingPlanes,be),b=Le.get(e,S.length),b.init(),S.push(b),Ye.enabled===!0&&Ye.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&ct(e,t,-1/0,T.sortObjects)}ct(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(pe,me),Te=Ye.enabled===!1||Ye.isPresenting===!1||Ye.hasDepthSensing()===!1,Te&&Ve.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ye===!0&&ze.beginShadows();let i=x.state.shadowsArray;if(Be.render(i,e,t),ye===!0&&ze.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];ut(n,r,e,a)}Te&&Ve.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];lt(b,e,n,n.viewport)}}else r.length>0&&ut(n,r,e,t),Te&&Ve.render(e),lt(b,e,t)}A!==null&&ne===0&&(P.updateMultisampleRenderTarget(A),P.updateRenderTargetMipmap(A)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Ke.resetDefaultState(),re=-1,ie=null,C.pop(),C.length>0?(x=C[C.length-1],P.setTextureUnits(x.state.textureUnits),ye===!0&&ze.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function ct(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(ve)){r&&Ce.setFromMatrixPosition(e.matrixWorld).applyMatrix4(xe);let i=Pe.update(e),a=e.material;a.visible&&b.push(e,i,a,n,Ce.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(ve))){let i=Pe.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Ce.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ce.copy(e.boundingSphere.center)),Ce.applyMatrix4(e.matrixWorld).applyMatrix4(xe)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,Ce.z,s,t)}}else a.visible&&b.push(e,i,a,n,Ce.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ct(i[e],t,n,r)}function lt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),ye===!0&&ze.setGlobalState(T.clippingPlanes,n),r&&M.viewport(ae.copy(r)),i.length>0&&dt(i,t,n),a.length>0&&dt(a,t,n),o.length>0&&dt(o,t,n),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function ut(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Oe.has(`EXT_color_buffer_half_float`)||Oe.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Vi(1,1,{generateMipmaps:!0,type:e?wn:_n,minFilter:gn,samples:Math.max(4,ke.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Oi.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||ae;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ce),le=T.getClearAlpha(),le<1&&T.setClearColor(16777215,.5),T.clear(),Te&&Ve.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),ye===!0&&ze.setGlobalState(T.clippingPlanes,r),dt(e,n,r),P.updateMultisampleRenderTarget(a),P.updateRenderTargetMipmap(a),Oe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,ft(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(P.updateMultisampleRenderTarget(a),P.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ce,le),d!==void 0&&(r.viewport=d),T.toneMapping=u}function dt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&ft(o,t,n,s,l,c)}}function ft(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function pt(e,t,n){t.isScene!==!0&&(t=we);let r=N.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Fe.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Fe.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=je.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,$e),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return ht(e,s),d}else s.uniforms=Fe.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Fe.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=ze.uniform),ht(e,s),r.needsLights=yt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function mt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=md.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function ht(e,t){let n=N.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function gt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function _t(e,t,n,r,i){t.isScene!==!0&&(t=we),P.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=A===null?T.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Oi.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=je.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=N.get(r),y=x.state.lights;if(ye===!0&&(be===!0||e!==ie)){let t=e===ie&&r.id===re;ze.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==ze.numPlanes||v.numIntersection!==ze.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=pt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),ee=v.uniforms;if(M.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==re&&(re=r.id,w=!0),v.needsLights){let e=gt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||ie!==e){M.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(j,`projectionMatrix`,e.projectionMatrix),O.setValue(j,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(j,Se.setFromMatrixPosition(e.matrixWorld)),ke.logarithmicDepthBuffer&&O.setValue(j,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(j,`isOrthographic`,e.isOrthographicCamera===!0),ie!==e&&(ie=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(j,`sunShadowMap`,y.state.sunShadowMap,P),y.state.directionalShadowMap.length>0&&O.setValue(j,`directionalShadowMap`,y.state.directionalShadowMap,P),y.state.spotShadowMap.length>0&&O.setValue(j,`spotShadowMap`,y.state.spotShadowMap,P),y.state.pointShadowMap.length>0&&O.setValue(j,`pointShadowMap`,y.state.pointShadowMap,P)),i.isSkinnedMesh){O.setOptional(j,i,`bindMatrix`),O.setOptional(j,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(j,`boneTexture`,e.boneTexture,P))}i.isBatchedMesh&&(O.setOptional(j,i,`batchingTexture`),O.setValue(j,`batchingTexture`,i._matricesTexture,P),O.setOptional(j,i,`batchingIdTexture`),O.setValue(j,`batchingIdTexture`,i._indirectTexture,P),O.setOptional(j,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(j,`batchingColorTexture`,i._colorsTexture,P));let k=n.morphAttributes;if((k.position!==void 0||k.normal!==void 0||k.color!==void 0)&&He.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(j,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(ee.envMapIntensity.value=t.environmentIntensity),ee.dfgLUT!==void 0&&(ee.dfgLUT.value=If()),w){if(O.setValue(j,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&vt(ee,E),a&&r.fog===!0&&Ie.refreshFogUniforms(ee,a),Ie.refreshMaterialUniforms(ee,r,fe,de,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;ee.probesSH.value=e.texture,ee.probesMin.value.copy(e.boundingBox.min),ee.probesMax.value.copy(e.boundingBox.max),ee.probesResolution.value.copy(e.resolution)}md.upload(j,mt(v),ee,P)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(md.upload(j,mt(v),ee,P),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(j,`center`,i.center),O.setValue(j,`modelViewMatrix`,i.modelViewMatrix),O.setValue(j,`normalMatrix`,i.normalMatrix),O.setValue(j,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];qe.update(n,S),qe.bind(n,S)}}return S}function vt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function yt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return te},this.getActiveMipmapLevel=function(){return ne},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(e,t,n){let r=N.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),N.get(e.texture).__webglTexture=t,N.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=N.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){A=e,te=t,ne=n;let r=null,i=!1,a=!1;if(e){let o=N.get(e);if(o.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(j.FRAMEBUFFER,o.__webglFramebuffer),ae.copy(e.viewport),oe.copy(e.scissor),se=e.scissorTest,M.viewport(ae),M.scissor(oe),M.setScissorTest(se),re=-1;return}if(o.__webglFramebuffer===void 0)P.setupRenderTarget(e);else if(o.__hasExternalTextures)P.rebindTextures(e,N.get(e.texture).__webglTexture,N.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&N.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);P.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=N.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&P.useMultisampledRTT(e)===!1?N.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,ae.copy(e.viewport),oe.copy(e.scissor),se=e.scissorTest}else ae.copy(he).multiplyScalar(fe).floor(),oe.copy(ge).multiplyScalar(fe).floor(),se=_e;if(n!==0&&(r=O),M.bindFramebuffer(j.FRAMEBUFFER,r)&&M.drawBuffers(e,r),M.viewport(ae),M.scissor(oe),M.setScissorTest(se),i){let r=N.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=N.get(e.textures[t]);j.framebufferTextureLayer(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=N.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,t.__webglTexture,n)}re=-1};function bt(e){let t=N.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=ke.textureFormatReadable(e.format),t.__typeReadable=ke.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=N.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){M.bindFramebuffer(j.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s);let u=bt(o);if(u.__formatReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&j.readPixels(t,n,r,i,Ge.convert(c),Ge.convert(l),a)}finally{let e=A===null?null:N.get(A).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=N.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){M.bindFramebuffer(j.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s);let d=bt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=j.createBuffer();j.bindBuffer(j.PIXEL_PACK_BUFFER,f),j.bufferData(j.PIXEL_PACK_BUFFER,a.byteLength,j.STREAM_READ),j.readPixels(t,n,r,i,Ge.convert(l),Ge.convert(u),0),j.bindBuffer(j.PIXEL_PACK_BUFFER,null);let p=A===null?null:N.get(A).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,p);let m=j.fenceSync(j.SYNC_GPU_COMMANDS_COMPLETE,0);return j.flush(),await Gr(j,m,4),j.bindBuffer(j.PIXEL_PACK_BUFFER,f),j.getBufferSubData(j.PIXEL_PACK_BUFFER,0,a),j.bindBuffer(j.PIXEL_PACK_BUFFER,null),j.deleteBuffer(f),j.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;P.setTexture2D(e,0),j.copyTexSubImage2D(j.TEXTURE_2D,n,0,0,o,s,i,a),M.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ge.convert(t.format),_=Ge.convert(t.type),v;t.isData3DTexture?(P.setTexture3D(t,0),v=j.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(P.setTexture2DArray(t,0),v=j.TEXTURE_2D_ARRAY):(P.setTexture2D(t,0),v=j.TEXTURE_2D),M.activeTexture(j.TEXTURE0),M.pixelStorei(j.UNPACK_FLIP_Y_WEBGL,t.flipY),M.pixelStorei(j.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),M.pixelStorei(j.UNPACK_ALIGNMENT,t.unpackAlignment);let y=M.getParameter(j.UNPACK_ROW_LENGTH),b=M.getParameter(j.UNPACK_IMAGE_HEIGHT),x=M.getParameter(j.UNPACK_SKIP_PIXELS),S=M.getParameter(j.UNPACK_SKIP_ROWS),C=M.getParameter(j.UNPACK_SKIP_IMAGES);M.pixelStorei(j.UNPACK_ROW_LENGTH,h.width),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,h.height),M.pixelStorei(j.UNPACK_SKIP_PIXELS,l),M.pixelStorei(j.UNPACK_SKIP_ROWS,u),M.pixelStorei(j.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=N.get(e),r=N.get(t),h=N.get(n.__renderTarget),g=N.get(r.__renderTarget);M.bindFramebuffer(j.READ_FRAMEBUFFER,h.__webglFramebuffer),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,N.get(e).__webglTexture,i,d+n),j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,N.get(t).__webglTexture,a,m+n)),j.blitFramebuffer(l,u,o,s,f,p,o,s,j.DEPTH_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||N.has(e)){let n=N.get(e),r=N.get(t);M.bindFramebuffer(j.READ_FRAMEBUFFER,ee),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,k);for(let e=0;e<c;e++)w?j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):j.framebufferTexture2D(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,n.__webglTexture,i),T?j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):j.framebufferTexture2D(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,r.__webglTexture,a),i===0?T?j.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):j.copyTexSubImage2D(v,a,f,p,l,u,o,s):j.blitFramebuffer(l,u,o,s,f,p,o,s,j.COLOR_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?j.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?j.compressedTexSubImage2D(j.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h);M.pixelStorei(j.UNPACK_ROW_LENGTH,y),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,b),M.pixelStorei(j.UNPACK_SKIP_PIXELS,x),M.pixelStorei(j.UNPACK_SKIP_ROWS,S),M.pixelStorei(j.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&j.generateMipmap(v),M.unbindTexture()},this.initRenderTarget=function(e){N.get(e).__webglFramebuffer===void 0&&P.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?P.setTextureCube(e,0):e.isData3DTexture?P.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?P.setTexture2DArray(e,0):P.setTexture2D(e,0),M.unbindTexture()},this.resetState=function(){te=0,ne=0,A=null,M.reset(),Ke.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ir}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Oi._getDrawingBufferColorSpace(e),t.unpackColorSpace=Oi._getUnpackColorSpace()}},Rf={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},zf=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},Bf=new Xc(-1,1,1,-1,0,1),Vf=new class extends xo{constructor(){super(),this.setAttribute(`position`,new co([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new co([0,2,0,0,2,0],2))}},Hf=class{constructor(e){this._mesh=new W(Vf,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Bf)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Uf=class extends zf{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof uc?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=sc.clone(e.uniforms),this.material=new uc({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Hf(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Wf=class extends zf{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Gf=class extends zf{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Kf=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new z);this._width=n.width,this._height=n.height,t=new Vi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:wn}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Uf(Rf),this.copyPass.material.blending=0,this.timer=new il}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Wf!==void 0&&(r instanceof Wf?n=!0:r instanceof Gf&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new z);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},qf=class extends zf{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new U}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Jf={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new U(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Yf=class e extends zf{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new z(256,256):new z(e.x,e.y),this.clearColor=new U(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Vi(i,a,{type:wn,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new Vi(i,a,{type:wn,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new Vi(i,a,{type:wn,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Jf;this.highPassUniforms=sc.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new uc({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new z(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new B(1,1,1),new B(1,1,1),new B(1,1,1),new B(1,1,1),new B(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=sc.clone(Rf.uniforms),this.blendMaterial=new uc({uniforms:this.copyUniforms,vertexShader:Rf.vertexShader,fragmentShader:Rf.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new U,this._oldClearAlpha=1,this._basic=new Qo,this._fsQuad=new Hf(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new z(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new uc({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new z(.5,.5)},direction:{value:new z(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new uc({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Yf.BlurDirectionX=new z(1,0),Yf.BlurDirectionY=new z(0,1);var Xf={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Zf=class extends zf{constructor(){super(),this.isOutputPass=!0,this.uniforms=sc.clone(Xf.uniforms),this.material=new dc({name:Xf.name,uniforms:this.uniforms,vertexShader:Xf.vertexShader,fragmentShader:Xf.fragmentShader}),this._fsQuad=new Hf(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Oi.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Qf=class{constructor(){this.cache=new Map,this.textures=new Set,this.materials=new Set}standard(e,t){if(this.cache.has(e))return this.cache.get(e);let n=new fc(t);return this.cache.set(e,n),this.materials.add(n),n}basic(e,t){if(this.cache.has(e))return this.cache.get(e);let n=new Qo(t);return this.cache.set(e,n),this.materials.add(n),n}line(e,t){if(this.cache.has(e))return this.cache.get(e);let n=new _s(t);return this.cache.set(e,n),this.materials.add(n),n}trackTexture(e){return this.textures.add(e),e}dispose(){for(let e of this.materials)e.dispose();for(let e of this.textures)e.dispose();this.materials.clear(),this.textures.clear(),this.cache.clear()}},J={cyan:63231,magenta:16722902,violet:9067519,lime:10944333,amber:16762967,red:16726876,blue:3709183,white:14219519};function $f(e){let t=document.createElement(`canvas`);t.width=512,t.height=512;let n=t.getContext(`2d`);n.fillStyle=`#04070f`,n.fillRect(0,0,512,512);for(let e=0;e<240;e++)n.fillStyle=`rgba(60, 120, 150, ${Math.random()*.018})`,n.fillRect(Math.random()*512,Math.random()*512,Math.random()*40+2,Math.random()*40+2);n.strokeStyle=`rgba(0, 210, 235, 0.10)`,n.lineWidth=1;for(let e=1;e<4;e++)n.beginPath(),n.moveTo(e*128,0),n.lineTo(e*128,512),n.stroke(),n.beginPath(),n.moveTo(0,e*128),n.lineTo(512,e*128),n.stroke();n.strokeStyle=`rgba(0, 246, 255, 0.34)`,n.lineWidth=2,n.strokeRect(0,0,512,512),n.strokeStyle=`rgba(255, 43, 214, 0.2)`,n.lineWidth=2,n.beginPath(),n.moveTo(0,512),n.lineTo(512,0),n.stroke();let r=new Rs(t);return r.wrapS=cn,r.wrapT=cn,r.colorSpace=Ar,r.anisotropy=Math.min(8,e?.capabilities?.getMaxAnisotropy?.()??4),r}function ep(e,{pos:t=[0,0,0],size:n=[1,1,1],color:r=J.cyan,baseColor:i=527640,edge:a=!0,opacity:o=1,glowCap:s=!1,solid:c=!0,blocks:l=[`player`,`bullet`,`projectile`],minimap:u=!0,group:d=null,flat:p=!0,metalness:m=.56,roughness:h=.5,emissive:g=0,emissiveIntensity:_=0}){let[v,y,b]=n,[x,S,C]=t,w=new G(v,y,b),T=new W(w,e.materials.standard(`box-${i}-${m}-${h}-${g}-${_}`,{color:i,metalness:m,roughness:h,flatShading:p,emissive:g,emissiveIntensity:_}));if(T.position.set(x,S,C),T.castShadow=!1,T.receiveShadow=!1,(d||e.scene).add(T),a){let t=e.materials.line(`edge-${r}-${o}`,{color:r,transparent:!0,opacity:f(o,0,1),toneMapped:!1,blending:2,depthWrite:!1}),n=new ks(new Zs(w),t);n.position.copy(T.position),(d||e.scene).add(n)}if(s){let t=new W(new G(Math.max(.02,v-.04),.035,Math.max(.02,b-.04)),e.materials.basic(`glowcap-${r}-${o}`,{color:r,toneMapped:!1}));t.position.set(x,S+y/2+.015,C),(d||e.scene).add(t)}let E=null;if(c){let t=new Va(new B(x-v/2,S-y/2,C-b/2),new B(x+v/2,S+y/2,C+b/2));E=e.physics.addSolid(t,{blocks:l})}return u&&S-y/2<8&&y<10&&v<30&&b<30&&e.stage.minimapBoxes.push({x,z:C,w:v,d:b,color:r,top:S+y/2}),{mesh:T,solid:E,geometry:w,pos:new B(x,S,C)}}function tp(e,t,n,r,i=.03,a=null,o=.9){let s=new B(...t),c=new B(...n),l=new B().subVectors(c,s),u=l.length();if(u<=1e-4)return null;let d=new W(new G(i,i,u),e.materials.basic(`strip-${r}-${o}`,{color:r,toneMapped:!1,transparent:o<1,opacity:o}));return d.position.copy(s).addScaledVector(l,.5),d.quaternion.setFromUnitVectors(new B(0,0,1),l.clone().normalize()),(a||e.scene).add(d),d}function np(e,t,n){let r=document.createElement(`canvas`);r.width=e,r.height=t,n(r.getContext(`2d`),e,t);let i=new Rs(r);return i.colorSpace=Ar,i.needsUpdate=!0,i}function rp(e,t,n=``,r=`#00f6ff`,{width:i=512,height:a=128}={}){let o=np(i,a,(e,i,a)=>{e.clearRect(0,0,i,a),e.fillStyle=`rgba(3, 8, 18, 0.72)`,e.fillRect(0,0,i,a),e.strokeStyle=r,e.lineWidth=3,e.strokeRect(4,4,i-8,a-8),e.fillStyle=r,e.fillRect(0,0,90,4),e.fillRect(i-90,a-4,90,4),e.fillStyle=r,e.font=`700 42px Orbitron, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(t,i/2,n?a/2-10:a/2),n&&(e.fillStyle=`rgba(220, 250, 255, 0.65)`,e.font=`500 20px Orbitron, sans-serif`,e.fillText(n,i/2,a/2+32))});e.materials.trackTexture(o);let s=new jo({map:o,transparent:!0,depthWrite:!1,toneMapped:!1});e.materials.materials.add(s);let c=new Go(s);return c.scale.set(i/128,a/128,1),c}function ip(e,{pos:t=[0,0,0],radius:n=1,tube:r=.03,color:i,rotation:a=[-Math.PI/2,0,0],opacity:o=1,group:s=null}){let c=new W(new tc(n,r,6,48),e.materials.basic(`ring-${i}-${o}`,{color:i,transparent:o<1,opacity:o,toneMapped:!1,blending:2,depthWrite:!1}));return c.position.set(...t),c.rotation.set(...a),(s||e.scene).add(c),c}var ap=class{constructor(e={}){this.config=e,this.id=e.id||`${this.constructor.moduleType||`module`}-${Math.random().toString(36).slice(2,7)}`,this.group=null}build(e,t){}update(e,t,n,r){}dispose(e){this.group&&=(this.group.removeFromParent(),null)}},op=new class{constructor(){this.types=new Map}register(e,t){if(this.types.has(e))throw Error(`Stage module "${e}" already registered`);return this.types.set(e,t),t.moduleType=e,t}create(e){let t=this.types.get(e.type);if(!t)throw Error(`Unknown stage module type "${e.type}"`);return new t(e)}list(){return[...this.types.keys()]}},sp=class{constructor({id:e=`stage`,name:t=`UNTITLED ARENA`,subtitle:n=``}={}){this.id=e,this.name=t,this.subtitle=n,this.ctx=null,this.modules=[],this.spawnPoints=[],this.botWaypoints=[],this.pickups=[],this.minimapBoxes=[],this.minimapMarkers=[],this.triggerHandlers=new Map,this.bounds={minX:-32,maxX:32,minZ:-32,maxZ:32},this.startedAt=0,this._built=!1,this._lights=[]}build(e){}init(e){return this._built||(this._built=!0,this.ctx=e,e.stage=this,e.materials=new Qf,this.build(e)),this}addModule(e){if(!this.ctx)throw Error(`Stage not initialized`);let t=op.create({id:`${e.type}-${this.modules.length}`,...e});return t.build(this.ctx,this),this.modules.push(t),t}addLight(e){return this.ctx.scene.add(e),this._lights.push(e),e}registerSpawn(e,t,n,r=0){this.spawnPoints.push({pos:new B(e,t,n),yaw:r})}registerWaypoint(e,t,n=0){this.botWaypoints.push(new B(e,n,t))}addMapMarker(e){this.minimapMarkers.push(e)}registerTrigger(e,{kind:t,data:n={},enabled:r=!0,blocks:i=null}={}){return this.ctx.physics.addTrigger(e,{kind:t,data:n,enabled:r})}registerTriggerHandler(e,t){this.triggerHandlers.set(e,t)}getTriggerHandler(e){return this.triggerHandlers.get(e)}pickSpawn(e=[],t=Math.random){if(!this.spawnPoints.length)return{pos:new B(0,.1,0),yaw:0};let n=this.spawnPoints.map(t=>{let n=1/0;for(let r of e){let e=t.pos.distanceToSquared(r);e<n&&(n=e)}return{spawn:t,nearest:Number.isFinite(n)?n:1e3}});n.sort((e,t)=>t.nearest-e.nearest);let r=n.slice(0,Math.max(1,Math.min(3,n.length))),i=r[Math.floor(t()*r.length)]?.spawn??g(this.spawnPoints);return{pos:i.pos.clone().add(new B(0,.03,0)),yaw:i.yaw}}randomWaypoint(e=null,t=1/0){let n=this.botWaypoints.filter(n=>!e||n.distanceTo(e)<=t);return g(n.length?n:this.botWaypoints)?.clone()??new B}update(e,t){if(this.ctx){for(let n of this.modules)n.update(e,t,this.ctx,this);for(let n of this.pickups)n.module?.updatePickup&&n.module.updatePickup(n,e,t)}}dispose(){for(let e of[...this.modules].reverse())try{e.dispose(this.ctx)}catch(e){console.warn(`[Stage] module dispose failed`,e)}for(let e of this._lights)e.removeFromParent();this._lights.length=0,this.ctx?.materials?.dispose(),this.modules.length=0,this.pickups.length=0,this.minimapBoxes.length=0,this.minimapMarkers.length=0,this._built=!1}get accentColor(){return J.cyan}},cp=class extends ap{build(e){let t=e.scene;t.fog=new Ta(328463,.0115),t.background=new U(197130),this.group=new H,this.group.name=`environment`,t.add(this.group);let n=new ec(220,32,20),r=new uc({side:1,depthWrite:!1,fog:!1,uniforms:{topColor:{value:new U(131335)},midColor:{value:new U(1312811)},horizonColor:{value:new U(531246)},glowColor:{value:new U(3869524)}},vertexShader:`
        varying vec3 vWorldPosition;
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec3 vWorldPosition;
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        uniform vec3 glowColor;
        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
          vec3 col = mix(horizonColor, midColor, smoothstep(0.42, 0.68, h));
          col = mix(col, topColor, smoothstep(0.68, 1.0, h));
          float horizon = exp(-abs(dir.y - 0.02) * 14.0);
          col += glowColor * horizon * 0.33;
          float band = smoothstep(0.16, 0.18, abs(dir.y)) - smoothstep(0.2, 0.3, abs(dir.y));
          col += vec3(0.0, 0.05, 0.07) * band;
          gl_FragColor = vec4(col, 1.0);
        }
      `}),i=new W(n,r);i.frustumCulled=!1,this.group.add(i),this.skyMat=r;let a=new Float32Array(2550),o=new Float32Array(2550),s=[new U(10350591),new U(16753903),new U(12171007),new U(16777215)];for(let e=0;e<850;e++){let t=150+Math.random()*55,n=Math.random()*Math.PI*2,r=Math.acos(Math.random()*.92+.04);a[e*3]=Math.cos(n)*Math.sin(r)*t,a[e*3+1]=Math.cos(r)*t*.9+12,a[e*3+2]=Math.sin(n)*Math.sin(r)*t;let i=s[Math.floor(Math.random()*s.length)];o[e*3]=i.r,o[e*3+1]=i.g,o[e*3+2]=i.b}let c=new xo;c.setAttribute(`position`,new ao(a,3)),c.setAttribute(`color`,new ao(o,3));let l=new As({size:.85,vertexColors:!0,transparent:!0,opacity:.9,depthWrite:!1,blending:2,fog:!1,toneMapped:!1,sizeAttenuation:!0});this.stars=new Fs(c,l),this.group.add(this.stars);let u=new Float32Array(540);for(let e=0;e<180;e++)u[e*3]=(Math.random()-.5)*56,u[e*3+1]=Math.random()*13+.4,u[e*3+2]=(Math.random()-.5)*56;let d=new xo;d.setAttribute(`position`,new ao(u,3));let f=new As({color:7730943,size:.07,transparent:!0,opacity:.55,depthWrite:!1,blending:2,toneMapped:!1,fog:!1});this.motes=new Fs(d,f),this.group.add(this.motes);let p=new Fc(7047167,590863,1.5);this.group.add(p);let m=new Qc(10407935,1.4);m.position.set(12,24,8),this.group.add(m);let h=new Yc(J.cyan,260,52,1.8);h.position.set(-18,8,-18),this.group.add(h);let g=new Yc(J.magenta,300,52,1.8);g.position.set(18,8,18),this.group.add(g);let _=new Yc(7555071,220,44,2);_.position.set(0,11,0),this.group.add(_)}update(e,t){this.stars&&(this.stars.rotation.y=t*.004),this.motes&&(this.motes.rotation.y=t*.008,this.motes.position.y=Math.sin(t*.22)*.18)}};op.register(`environment`,cp);var lp=class extends ap{build(e){this.group=new H,this.group.name=`floor`,e.scene.add(this.group);let t=e.materials.trackTexture($f(e.renderer));t.repeat.set(8,8);let n=e.materials.standard(`floor-grid`,{map:t,color:10802408,roughness:.82,metalness:.25,emissive:892860,emissiveMap:t,emissiveIntensity:.43}),r=new W(new G(65,1,65),n);r.position.set(0,-.5,0),this.group.add(r),e.physics.addSolid(new Va(new B(-32.5,-1,-32.5),new B(32.5,0,32.5)),{blocks:[`player`,`bullet`,`projectile`]});let i=J.cyan;tp(e,[-31.5,.015,-31.5],[31.5,.015,-31.5],i,.055,this.group,.55),tp(e,[-31.5,.015,31.5],[31.5,.015,31.5],i,.055,this.group,.55),tp(e,[-31.5,.015,-31.5],[-31.5,.015,31.5],J.magenta,.055,this.group,.5),tp(e,[31.5,.015,-31.5],[31.5,.015,31.5],J.magenta,.055,this.group,.5),this.rings=[];for(let[t,n,r]of[[24,J.cyan,.18],[17.5,J.magenta,.22],[12.2,J.cyan,.22]]){let i=ip(e,{pos:[0,.022,0],radius:t,tube:.022,color:n,opacity:r,group:this.group});this.rings.push(i)}for(let t=0;t<8;t++){let n=t/8*Math.PI*2,r=12.5;tp(e,[Math.cos(n)*r,.024,Math.sin(n)*r],[Math.cos(n)*17,.024,Math.sin(n)*17],t%2?J.cyan:J.magenta,.035,this.group,.35)}for(let t=-2;t<=2;t++)tp(e,[-31.9,.01,t*9],[31.9,.01,t*9],t===0?J.magenta:J.cyan,.02,this.group,.08)}update(e,t){this.rings&&(this.rings[0].rotation.z=t*.025,this.rings[1].rotation.z=-t*.04,this.rings[2].rotation.z=t*.06)}};op.register(`floor`,lp);var up=class extends ap{build(e){this.group=new H,this.group.name=`blocks-${this.config.name||this.id}`,e.scene.add(this.group);let t=this.config;for(let n of t.boxes||[]){let t=n.color??J.cyan,r=ep(e,{pos:n.pos,size:n.size,color:t,baseColor:n.baseColor??462104,edge:n.edge!==!1,opacity:n.opacity??.7,glowCap:!!n.glowCap,solid:n.solid!==!1,blocks:n.blocks??[`player`,`bullet`,`projectile`],minimap:n.minimap!==!1,group:this.group,metalness:n.metalness??.6,roughness:n.roughness??.48,emissive:n.emissive??0,emissiveIntensity:n.emissiveIntensity??0});n.label&&r.mesh&&(r.mesh.userData.label=n.label)}for(let n of t.lines||[])tp(e,n.from,n.to,n.color??J.cyan,n.thickness??.035,this.group,n.opacity??.8);for(let e of t.lights||[]){let t=new Yc(e.color??J.cyan,e.intensity??80,e.distance??18,2);t.position.set(...e.pos),this.group.add(t)}}};op.register(`blocks`,up);var dp=class extends ap{build(e,t){this.group=new H,this.group.name=`spawns`,e.scene.add(this.group),this.rings=[];let n=this.config;for(let[r,i]of(n.spawns||[]).entries()){t.registerSpawn(i.x,i.y??.03,i.z,i.yaw??0);let n=i.color??(r%2?J.magenta:J.cyan);if(i.visual===!1)continue;let a=ip(e,{pos:[i.x,(i.y??.03)+.02,i.z],radius:.95,tube:.018,color:n,opacity:.34,group:this.group});this.rings.push(a);let o=ip(e,{pos:[i.x,(i.y??.03)+.03,i.z],radius:.42,tube:.012,color:n,opacity:.22,group:this.group});this.rings.push(o)}for(let e of n.waypoints||[])t.registerWaypoint(e[0],e[1],e[2]??0)}update(e,t){for(let e=0;e<this.rings.length;e++){let n=1+Math.sin(t*1.6+e*1.7)*.08;this.rings[e].scale.setScalar(n)}}};op.register(`spawn`,dp);var fp=class extends ap{build(e,t){let n=this.config,r=n.pos,i=n.color??J.cyan,a=n.power??16.8;this.group=new H,this.group.position.set(r[0],r[1]??0,r[2]),e.scene.add(this.group);let o=new W(new Ws(1.55,1.75,.18,24,1),e.materials.standard(`pad-base`,{color:463130,metalness:.7,roughness:.4,flatShading:!0}));o.position.y=.09,this.group.add(o);let s=e.materials.basic(`pad-disc-${i}`,{color:i,transparent:!0,opacity:.32,blending:2,depthWrite:!1,toneMapped:!1,side:2}),c=new W(new Us(1.5,32),s);c.rotation.x=-Math.PI/2,c.position.y=.19,this.group.add(c),this.discMat=s,this.rings=[];for(let[t,n]of[[1.42,.8],[1.1,.55],[.72,.4]])this.rings.push(ip(e,{pos:[0,.2,0],radius:t,tube:.026,color:i,opacity:n,group:this.group}));this.chevrons=[];for(let t=0;t<3;t++){let n=new W(new Gs(.38,.3,4,1,!0),e.materials.basic(`pad-chev-${i}-${t}`,{color:i,transparent:!0,opacity:.35-t*.07,blending:2,depthWrite:!1,side:2,toneMapped:!1}));n.rotation.x=Math.PI,n.rotation.y=Math.PI/4,n.position.y=.5+t*.25,this.group.add(n),this.chevrons.push(n)}let l=e.materials.basic(`pad-beam-${i}`,{color:i,transparent:!0,opacity:.06,blending:2,depthWrite:!1,side:2,toneMapped:!1}),u=new W(new Ws(1.35,1.55,3.8,24,1,!0),l);u.position.y=2,this.group.add(u),this.beamMat=l;let d=new Va(new B(r[0]-1.5,(r[1]??0)+.02,r[2]-1.5),new B(r[0]+1.5,(r[1]??0)+2.5,r[2]+1.5));this.trigger=t.registerTrigger(d,{kind:`jumpPad`,data:{power:a,color:i,x:r[0],z:r[2],y:r[1]??0}}),t.registerTriggerHandler(`jumpPad`,(e,t,n)=>{let r=n.time;r<(e.gimmickCooldowns?.get(`pad:${t.id}`)??0)||(e.vel.y=Math.max(e.vel.y,t.data.power),e.grounded=!1,e.groundSolid=null,e.gimmickCooldowns?.set(`pad:${t.id}`,r+.8),n.session.onJumpPad(e,t))}),t.addMapMarker({x:r[0],z:r[2],color:i,type:`jump`})}update(e,t){let n=t*1.8;for(let e=0;e<this.rings.length;e++){let t=1+Math.sin(n+e*.8)*.08;this.rings[e].scale.setScalar(t),this.rings[e].rotation.z=n*(e%2?-.7:.5)}for(let e=0;e<this.chevrons.length;e++){let t=.45+(n*.4+e*.33)%1*1.5;this.chevrons[e].position.y=t,this.chevrons[e].material.opacity=.05+Math.sin(Math.PI*((t-.45)/1.5))*.35}this.beamMat.opacity=.045+Math.sin(n*1.3)*.015,this.discMat.opacity=.26+Math.sin(n*2.1)*.08}};op.register(`jumpPad`,fp);var pp=class extends ap{build(e,t){let n=this.config;this.group=new H,e.scene.add(this.group),this.rings=[];let r=(n.pads||[]).map((t,r)=>{let i=t.color??(r%2?J.magenta:J.violet),a=new H;a.position.set(t.x,t.y??0,t.z),this.group.add(a);let o=new W(new Ws(1.3,1.5,.16,8),e.materials.standard(`tp-base`,{color:395796,metalness:.75,roughness:.32,flatShading:!0}));o.position.y=.08,a.add(o);let s=new W(new Us(1.14,8),e.materials.basic(`tp-disc-${i}`,{color:i,transparent:!0,opacity:.2,blending:2,depthWrite:!1,side:2,toneMapped:!1}));s.rotation.x=-Math.PI/2,s.position.y=.17,a.add(s);let c=[];for(let t=0;t<2;t++){let n=ip(e,{pos:[0,.18+t*.06,0],radius:1.2-t*.28,tube:.022,color:i,opacity:.75-t*.2,group:a});c.push(n),this.rings.push({mesh:n,phase:Math.random()*5,speed:t%2?-1.1:.8})}let l=new W(new Ws(1.1,1.28,3.2,16,1,!0),e.materials.basic(`tp-column-${i}`,{color:i,transparent:!0,opacity:.05,blending:2,depthWrite:!1,side:2,toneMapped:!1}));l.position.y=1.7,a.add(l);let u=rp(e,t.label??n.channel??`LINK`,t.sub??`TELEPORT`,`#${new U(i).getHexString()}`,{width:320,height:96});return u.position.set(0,3,0),u.scale.set(2.2,.66,1),a.add(u),{pad:t,color:i,group:a,rings:c,column:l}});for(let e=0;e<r.length;e++){let n=r[e],i=n.pad,a=(i.channel?r.find((t,n)=>n!==e&&t.pad.channel===i.channel):null)??r[(e+1)%r.length];if(!a||a===n)continue;let o=a.pad,s=new Va(new B(i.x-1.2,(i.y??0)+.02,i.z-1.2),new B(i.x+1.2,(i.y??0)+2.4,i.z+1.2));n.trigger=t.registerTrigger(s,{kind:`teleporter`,data:{color:n.color,target:new B(o.x,(o.y??0)+.06,o.z),x:i.x,z:i.z,channel:i.channel,label:i.label,targetLabel:o.label}}),t.addMapMarker({x:i.x,z:i.z,color:n.color,type:`teleport`})}t.registerTriggerHandler(`teleporter`,(e,t,n)=>{let r=n.time;if(r<(e.gimmickCooldowns?.get(`teleport`)??0))return;let i=e.pos.clone();e.pos.copy(t.data.target),e.pos.y+=.04,e.vel.set(0,2.2,0),e.grounded=!1,e.groundSolid=null,e.gimmickCooldowns?.set(`teleport`,r+1.1),n.session.onTeleport(e,i,t.data.target,t.data.color)})}update(e,t){for(let e of this.rings){e.mesh.rotation.z=t*e.speed+e.phase;let n=1+Math.sin(t*2+e.phase)*.06;e.mesh.scale.set(n,n,1)}}};op.register(`teleporter`,pp);var mp=class extends ap{build(e){let t=this.config,[n,r,i]=t.size??[3.4,.35,3.4],a=new B(...t.from??[0,.4,0]),o=new B(...t.to??[0,4,0]);this.from=a,this.to=o,this.speed=t.speed??.32,this.phase=t.phase??0,this.color=t.color??J.cyan,this.group=new H,this.group.name=`moving-platform-${this.id}`,e.scene.add(this.group),this.platformGroup=new H,this.group.add(this.platformGroup),ep(e,{pos:[0,0,0],size:[n,r,i],color:this.color,baseColor:660512,solid:!1,group:this.platformGroup,minimap:!1,glowCap:!0,metalness:.72,roughness:.38});let s=new W(new G(n*.8,.05,i*.8),e.materials.basic(`mp-under-${this.color}`,{color:this.color,transparent:!0,opacity:.8,toneMapped:!1,blending:2}));s.position.y=-r/2-.03,this.platformGroup.add(s);for(let t of[-n/2+.12,n/2-.12]){let n=new W(new G(.05,.05,i-.15),e.materials.basic(`mp-strip-${this.color}`,{color:this.color,toneMapped:!1}));n.position.set(t,r/2+.01,0),this.platformGroup.add(n)}let c=Math.min(a.y,o.y),l=Math.max(a.y,o.y);for(let[t,r]of[[-n/2+.25,-i/2+.25],[n/2-.25,i/2-.25]])tp(e,[a.x+t,c-.3,a.z+r],[a.x+t,l+.9,a.z+r],this.color,.035,this.group,.26);let u=this._sample(0);this.platformGroup.position.copy(u),this.solid=e.physics.addSolid(new Va(new B(u.x-n/2,u.y-r/2,u.z-i/2),new B(u.x+n/2,u.y+r/2,u.z+i/2)),{blocks:[`player`,`bullet`,`projectile`]}),this.lastPos=u.clone(),this.half=new B(n/2,r/2,i/2),e.stage.addMapMarker({x:a.x,z:a.z,color:this.color,type:`platform`})}_sample(e){let t=(e*this.speed+this.phase)%1,n=t<.5?t*2:(1-t)*2,r=n*n*(3-2*n);return new B().lerpVectors(this.from,this.to,r)}update(e,t){let n=this._sample(t);this.platformGroup.position.copy(n),this.platformGroup.rotation.y=Math.sin(t*this.speed*Math.PI*2+this.phase*Math.PI*2)*.035;let r=new B().subVectors(n,this.lastPos);this.solid.delta.copy(r),this.solid.box.min.set(n.x-this.half.x,n.y-this.half.y,n.z-this.half.z),this.solid.box.max.set(n.x+this.half.x,n.y+this.half.y,n.z+this.half.z),this.lastPos.copy(n)}};op.register(`movingPlatform`,mp);var hp=class extends ap{build(e,t){let n=this.config,[r,i,a]=n.pos,o=n.width??6,s=n.height??4,c=n.axis??`x`,l=n.color??J.violet,u=n.blocks??[`bullet`,`projectile`];this.group=new H,this.group.name=`phase-gate-${this.id}`,this.group.position.set(r,i,a),e.scene.add(this.group);let d=e.materials.standard(`gate-frame-${l}`,{color:725794,metalness:.8,roughness:.3,flatShading:!0}),f=o/2,p=s/2,m=new G(.22,s+.25,.22);for(let t of[-1,1]){let n=new W(m,d);c===`x`?n.position.set(t*f,0,0):n.position.set(0,0,t*f),this.group.add(n);let r=new W(new G(.03,s,.03),e.materials.basic(`gate-post-${l}`,{color:l,toneMapped:!1}));c===`x`?r.position.set(t*f,0,.125):r.position.set(.125,0,t*f),this.group.add(r)}let h=new W(new G(c===`x`?o+.25:.22,.2,c===`x`?.22:o+.25),d);h.position.y=p+.08,this.group.add(h);let g=new W(new G(c===`x`?o+.3:.45,.12,c===`x`?.45:o+.3),d);g.position.y=-p-.05,this.group.add(g);let _=np(256,256,(e,t,n)=>{e.clearRect(0,0,t,n);for(let n=0;n<32;n++)e.fillStyle=`rgba(255,255,255,${.05+(n%4==0?.18:.02)})`,e.fillRect(0,n*8,t,1);e.strokeStyle=`rgba(255,255,255,0.12)`,e.lineWidth=2;for(let r=0;r<6;r++)e.strokeRect(14+r*6,14+r*6,t-28-r*12,n-28-r*12);e.fillStyle=`rgba(255,255,255,0.12)`;for(let r=0;r<40;r++)e.fillRect(Math.random()*t,Math.random()*n,2,7)});e.materials.trackTexture(_),_.wrapS=cn,_.wrapT=cn,_.repeat.set(c===`x`?3:1,2);let v=e.materials.basic(`gate-field-${l}`,{map:_,color:l,transparent:!0,opacity:.44,side:2,depthWrite:!1,blending:2,toneMapped:!1}),y=new W(new $s(o-.28,s-.15),v);c===`z`&&(y.rotation.y=Math.PI/2),this.group.add(y),this.texture=_,this.fieldMat=v,this.field=y;let b=!u.includes(`player`);u.includes(`bullet`);let x=rp(e,b?`PLAYERS PASS`:`BULLETS PASS`,b?`弾丸は遮断`:`弾丸のみ通過`,`#${new U(l).getHexString()}`,{width:512,height:128});x.position.set(0,p+.75,0),x.scale.set(3.4,.85,1),this.group.add(x);let S=c===`x`?[o,s,.3]:[.3,s,o];this.solid=e.physics.addSolid(new Va(new B(r-S[0]/2,i-s/2,a-S[2]/2),new B(r+S[0]/2,i+s/2,a+S[2]/2)),{blocks:u}),t.addMapMarker({x:r,z:a,color:l,type:`gate`})}update(e,t){this.texture.offset.y=t*.21%1,this.fieldMat.opacity=.37+Math.sin(t*2.2)*.06,this.field.scale.x=1+Math.sin(t*3.1)*.004}};op.register(`gate`,hp);var gp=class extends ap{build(e,t){let n=this.config,[r,i,a]=n.pos,o=n.length??9,s=n.height??3.6,c=n.axis??`x`,l=n.offTime??1.6,u=n.warnTime??.55,d=n.onTime??2.1;this.cycle=u+d+l,this.warnTime=u,this.onTime=d,this.phase=n.phase??0,this.state=`off`,this.group=new H,this.group.position.set(r,i,a),e.scene.add(this.group);let f=e.materials.standard(`laser-post`,{color:789010,metalness:.85,roughness:.3,flatShading:!0});for(let e of[-1,1]){let t=new W(new Ws(.14,.19,s+.4,6),f);c===`x`?t.position.set(e*o/2,0,0):t.position.set(0,0,e*o/2),this.group.add(t)}this.beamMat=e.materials.basic(`laser-beam-${this.id}`,{color:J.red,transparent:!0,opacity:.7,blending:2,depthWrite:!1,toneMapped:!1}),this.beams=[];for(let e=0;e<7;e++){let t=new W(new G(c===`x`?o:.035,.035,c===`x`?.035:o),this.beamMat);t.position.y=-s/2+e/6*s,this.group.add(t),this.beams.push(t)}let p=e.materials.basic(`laser-plane-${this.id}`,{color:J.red,transparent:!0,opacity:.1,blending:2,depthWrite:!1,side:2,toneMapped:!1}),m=new W(new $s(o,s),p);c===`z`&&(m.rotation.y=Math.PI/2),this.group.add(m),this.planeMat=p;let h=e.materials.basic(`laser-emitter-${this.id}`,{color:J.amber,toneMapped:!1});for(let e of[-1,1]){let t=new W(new G(.08,.08,.08),h);c===`x`?t.position.set(e*o/2,s/2+.22,0):t.position.set(0,s/2+.22,e*o/2),this.group.add(t)}this.emitterMat=h;let g=c===`x`?[o,s,.24]:[.24,s,o];this.trigger=t.registerTrigger(new Va(new B(r-g[0]/2,i-s/2,a-g[2]/2),new B(r+g[0]/2,i+s/2,a+g[2]/2)),{kind:`laser`,enabled:!1,data:{damage:n.damage??15,x:r,z:a,color:J.red}}),t.registerTriggerHandler(`laser`,(e,t,n)=>{let r=n.time,i=`laser:${t.id}`;r<(e.gimmickCooldowns?.get(i)??0)||(e.gimmickCooldowns?.set(i,r+.62),n.session.damageSimulatedPlayer(e,t.data.damage,`laser`))}),t.addMapMarker({x:r,z:a,color:J.red,type:`laser`})}update(e,t){let n=((t+this.phase)%this.cycle+this.cycle)%this.cycle,r;if(r=n<this.warnTime?`warn`:n<this.warnTime+this.onTime?`on`:`off`,r!==this.state&&(this.state=r,this.trigger.enabled=r===`on`),this.trigger.enabled=r===`on`,r===`on`){let e=.78+Math.sin(t*30)*.12;this.beamMat.opacity=e,this.beamMat.color.setHex(J.red),this.planeMat.opacity=.1+Math.sin(t*8)*.025,this.emitterMat.color.setHex(J.red)}else if(r===`warn`){let e=Math.sin(t*22)>0?.5:.16;this.beamMat.opacity=e,this.beamMat.color.setHex(J.amber),this.planeMat.opacity=e*.12,this.emitterMat.color.setHex(J.amber)}else this.beamMat.opacity=.045,this.planeMat.opacity=.012,this.emitterMat.color.setHex(4535332)}};op.register(`laserFence`,gp);var _p=class extends ap{build(e,t){let n=this.config,[r,i,a]=n.pos,[o,s,c]=n.size??[8,9,8],l=n.color??J.cyan;this.group=new H,this.group.position.set(r,i,a),e.scene.add(this.group);let u=e.materials.basic(`grav-volume-${this.id}`,{color:l,transparent:!0,opacity:.035,side:2,depthWrite:!1,blending:2,toneMapped:!1}),d=new W(new G(o,s,c),u);this.group.add(d);let f=new ks(new Zs(new G(o,s,c)),e.materials.line(`grav-edge-${this.id}`,{color:l,transparent:!0,opacity:.3,toneMapped:!1,blending:2,depthWrite:!1}));this.group.add(f);let p=new Float32Array(330),m=new Float32Array(110);for(let e=0;e<110;e++)p[e*3]=(Math.random()-.5)*(o-.7),p[e*3+1]=(Math.random()-.5)*s,p[e*3+2]=(Math.random()-.5)*(c-.7),m[e]=.5+Math.random()*1.5;let h=new xo;h.setAttribute(`position`,new ao(p,3));let g=new As({color:l,size:.11,transparent:!0,opacity:.65,depthWrite:!1,blending:2,toneMapped:!1,fog:!1});this.particles=new Fs(h,g),this.group.add(this.particles),this.particlePositions=p,this.particleSpeeds=m,this.zoneSize=[o,s,c];let _=new W(new tc(o*.38,.02,6,48),e.materials.basic(`grav-ring-${this.id}`,{color:l,transparent:!0,opacity:.4,blending:2,depthWrite:!1,toneMapped:!1}));_.rotation.x=-Math.PI/2,_.position.y=-s/2+.05,this.group.add(_),this.ring=_;let v=rp(e,`LOW-G`,`UPDRAFT FIELD`,`#${new U(l).getHexString()}`,{width:384,height:112});v.position.set(0,s/2+.8,0),v.scale.set(2.8,.82,1),this.group.add(v),this.trigger=t.registerTrigger(new Va(new B(r-o/2,i-s/2,a-c/2),new B(r+o/2,i+s/2,a+c/2)),{kind:`gravity`,data:{gravityScale:n.gravityScale??.3,updraft:n.updraft??5.8}}),t.registerTriggerHandler(`gravity`,(e,t)=>{e.gravityScale=Math.min(e.gravityScale??1,t.data.gravityScale),e.updraft=Math.max(e.updraft??0,t.data.updraft),e.jumpScale=Math.min(e.jumpScale??1,.82)}),t.addMapMarker({x:r,z:a,color:l,type:`gravity`})}update(e,t){let n=this.particlePositions,[r,i,a]=this.zoneSize;for(let o=0;o<this.particleSpeeds.length;o++)n[o*3+1]+=this.particleSpeeds[o]*e,n[o*3]+=Math.sin(t*.7+o)*e*.08,n[o*3+1]>i/2&&(n[o*3+1]=-i/2,n[o*3]=(Math.random()-.5)*(r-.7),n[o*3+2]=(Math.random()-.5)*(a-.7));this.particles.geometry.attributes.position.needsUpdate=!0,this.ring.rotation.z=t*.22,this.ring.scale.setScalar(1+Math.sin(t*1.3)*.035)}};op.register(`gravityZone`,_p);var vp=class extends ap{build(e,t){this.group=new H,e.scene.add(this.group);let n=this.config;this.records=[];for(let[r,i]of(n.items||[]).entries()){let n=i.color??J.lime,a=new H;a.position.set(i.x,i.y??.9,i.z),this.group.add(a);let o=new W(new Qs(.3,0),e.materials.standard(`hp-core-${r}`,{color:1321494,emissive:n,emissiveIntensity:2.2,metalness:.4,roughness:.3,flatShading:!0}));a.add(o);let s=new ks(new Zs(new Qs(.52,0)),e.materials.line(`hp-shell-${r}`,{color:n,transparent:!0,opacity:.5,toneMapped:!1,blending:2,depthWrite:!1}));a.add(s);let c=ip(e,{pos:[0,0,0],radius:.62,tube:.012,color:n,opacity:.55,group:a});c.rotation.x=Math.PI/3,c.rotation.y=r;let l=ip(e,{pos:[0,0,0],radius:.46,tube:.009,color:n,opacity:.35,group:a});l.rotation.x=-Math.PI/2.5;let u=new W(new Ws(.16,.36,1.5,12,1,!0),e.materials.basic(`hp-beam-${r}`,{color:n,transparent:!0,opacity:.08,side:2,depthWrite:!1,blending:2,toneMapped:!1}));u.position.y=.55,a.add(u);let d=e.materials.basic(`hp-cross-${r}`,{color:15400914,toneMapped:!1}),f=new W(new G(.07,.24,.03),d),p=new W(new G(.24,.07,.03),d);f.position.z=-.32,p.position.z=-.32,a.add(f,p);let m=rp(e,`+${i.amount??35}`,`INTEGRITY`,`#a6ff4d`,{width:256,height:96});m.position.set(0,.95,0),m.scale.set(1.7,.64,1),a.add(m);let h={id:`hp-${r}`,pos:new B(i.x,i.y??.9,i.z),baseY:i.y??.9,amount:i.amount??35,respawn:i.respawn??16,radius:i.radius??1.45,height:i.height??1.6,group:a,core:o,shell:s,ringA:c,ringB:l,beam:u,available:!0,respawnAt:0,phase:r*.9};this.records.push(h),t.pickups.push(h),t.addMapMarker({x:i.x,z:i.z,color:n,type:`health`})}}update(e,t,n,r){for(let n of this.records){n.group.rotation.y=t*.7+n.phase,n.group.position.y=n.baseY+Math.sin(t*1.7+n.phase)*.12;let r=1+Math.sin(t*2.4+n.phase)*.06;if(n.core.scale.setScalar(r),n.ringA.rotation.z=t*.8+n.phase,n.ringB.rotation.z=-t*.55+n.phase,!n.available&&!n.remoteControlled&&t>=n.respawnAt&&(n.available=!0,n.group.visible=!0,n.group.scale.setScalar(.1)),n.available&&n.group.scale.x<1){let t=Math.min(1,n.group.scale.x+e*3.5);n.group.scale.setScalar(t)}}}};op.register(`healthPickup`,vp);var yp=class extends ap{build(e){let t=this.config;this.group=new H,e.scene.add(this.group),this.rings=[],this.shards=[];for(let n of t.rings||[]){let t=new H;t.position.set(...n.pos),t.rotation.set(...n.rotation??[0,0,0]),this.group.add(t);let r=ip(e,{pos:[0,0,0],radius:n.radius??7,tube:n.tube??.035,color:n.color??J.cyan,opacity:n.opacity??.32,group:t});this.rings.push({group:t,mesh:r,speed:n.speed??.08,phase:Math.random()*6})}for(let n of t.signs||[]){let t=np(1024,256,(e,t,r)=>{e.clearRect(0,0,t,r),e.fillStyle=`rgba(4, 8, 18, 0.6)`,e.fillRect(0,0,t,r),e.strokeStyle=n.color??`#00f6ff`,e.globalAlpha=.7,e.lineWidth=4,e.strokeRect(10,10,t-20,r-20),e.globalAlpha=.22;for(let n=0;n<t;n+=32)e.beginPath(),e.moveTo(n,0),e.lineTo(n,r),e.strokeStyle=`#3fd7ee`,e.lineWidth=1,e.stroke();e.globalAlpha=1,e.fillStyle=n.color??`#00f6ff`,e.font=`900 86px Orbitron, sans-serif`,e.textAlign=`left`,e.textBaseline=`middle`,e.fillText(n.text??`NEON`,48,110),e.fillStyle=`rgba(225, 250, 255, 0.66)`,e.font=`500 26px Orbitron, sans-serif`,e.fillText(n.sub??``,52,188),e.fillStyle=n.color??`#00f6ff`,e.fillRect(48,148,120,3),e.globalAlpha=.2,e.fillStyle=`#ffffff`;for(let n=0;n<30;n++)e.fillRect(Math.random()*t,Math.random()*r,Math.random()*60,1)});e.materials.trackTexture(t);let r=e.materials.basic(`sign-${n.text}`,{map:t,transparent:!0,opacity:.86,side:2,depthWrite:!1,toneMapped:!1}),i=new W(new $s(n.width??14,n.height??3.5),r);i.position.set(...n.pos),i.rotation.set(...n.rotation??[0,0,0]),this.group.add(i),this.signs??=[],this.signs.push(i)}let n=[J.cyan,J.magenta,J.violet,J.lime];for(let t=0;t<18;t++){let r=n[t%n.length],i=new W(new Qs(.2+Math.random()*.55,0),e.materials.standard(`shard-${r}-${t%3}`,{color:66e4,emissive:r,emissiveIntensity:1.7,metalness:.4,roughness:.25,flatShading:!0})),a=Math.random()*Math.PI*2,o=13+Math.random()*16;i.position.set(Math.cos(a)*o,5+Math.random()*8,Math.sin(a)*o),this.group.add(i),this.shards.push({mesh:i,baseY:i.position.y,radius:o,angle:a,speed:.018+Math.random()*.04,bob:Math.random()*6})}for(let n of t.lines||[])tp(e,n.from,n.to,n.color??J.cyan,n.thickness??.03,this.group,n.opacity??.4);this.overhead=[];for(let t=0;t<2;t++){let n=new W(new G(52,.07,.07),e.materials.basic(`overhead-${t}`,{color:t?J.magenta:J.cyan,toneMapped:!1,transparent:!0,opacity:.5}));n.position.set(0,12.5,t?12:-12),this.group.add(n),this.overhead.push(n)}}update(e,t){for(let e of this.rings)e.mesh.rotation.z=t*e.speed+e.phase,e.group.rotation.y=Math.sin(t*.15+e.phase)*.08;for(let n of this.shards)n.angle+=n.speed*e,n.mesh.position.x=Math.cos(n.angle)*n.radius,n.mesh.position.z=Math.sin(n.angle)*n.radius,n.mesh.position.y=n.baseY+Math.sin(t*.5+n.bob)*.35,n.mesh.rotation.x=t*.3+n.bob,n.mesh.rotation.y=t*.42+n.bob;if(this.signs)for(let e=0;e<this.signs.length;e++)this.signs[e].material.opacity=.78+Math.sin(t*1.1+e)*.05;if(this.overhead)for(let e=0;e<this.overhead.length;e++)this.overhead[e].material.opacity=.35+Math.sin(t*2.2+e*2)*.12}};op.register(`decor`,yp);var bp=class extends sp{constructor(){super({id:`neon-foundry`,name:`NEON FOUNDRY`,subtitle:`SECTOR 07 // P2P ARENA`})}build(e){this.addModule({type:`environment`}),this.addModule({type:`floor`});let t=J.cyan,n=J.magenta,r=J.violet,i=J.lime,a=[],o=[];for(let e of[-32.5,32.5])a.push({pos:[e,9,0],size:[1,18,65],color:e<0?t:n,baseColor:330002,edge:!0,minimap:!1,glowCap:!0,metalness:.72});for(let e of[-32.5,32.5])a.push({pos:[0,9,e],size:[65,18,1],color:e<0?n:t,baseColor:330002,edge:!0,minimap:!1,glowCap:!0,metalness:.72});for(let e of[2.6,6.2,10.2,14.2])o.push({from:[-31.3,e,-31.95],to:[31.3,e,-31.95],color:e===6.2?n:t,thickness:.055,opacity:.34}),o.push({from:[-31.3,e,31.95],to:[31.3,e,31.95],color:e===6.2?t:n,thickness:.055,opacity:.34}),o.push({from:[-31.95,e,-31.3],to:[-31.95,e,31.3],color:t,thickness:.055,opacity:.3}),o.push({from:[31.95,e,-31.3],to:[31.95,e,31.3],color:n,thickness:.055,opacity:.3});for(let[e,r]of[[-28,-28],[28,-28],[-28,28],[28,28]])a.push({pos:[e,7,r],size:[2.6,14,2.6],color:e*r>0?n:t,baseColor:461590,minimap:!1,glowCap:!0,metalness:.8,roughness:.35}),o.push({from:[e,.6,r+1.33],to:[e,13.2,r+1.33],color:e*r>0?n:t,thickness:.05,opacity:.7});a.push({pos:[0,.65,0],size:[14,1.3,14],color:t,baseColor:528669,glowCap:!0,metalness:.7,roughness:.4}),a.push({pos:[0,.12,0],size:[18,.24,18],color:r,baseColor:461332,glowCap:!1,minimap:!1,edge:!0});for(let e of[-1,1])for(let n=0;n<3;n++){let i=.33*(n+1),o=7.55+n*1.1;a.push({pos:[0,i/2,e*o],size:[5,i,1.1],color:n%2?t:r,baseColor:659484,edge:!0,minimap:!1,metalness:.64}),a.push({pos:[e*o,i/2,0],size:[1.1,i,5],color:n%2?r:t,baseColor:659484,edge:!0,minimap:!1,metalness:.64})}a.push({pos:[-4.6,1.75,0],size:[1.3,.9,2.6],color:n,baseColor:658712,glowCap:!0}),a.push({pos:[4.6,1.75,0],size:[1.3,.9,2.6],color:t,baseColor:658712,glowCap:!0}),a.push({pos:[0,1.75,-4.6],size:[2.6,.9,1.3],color:t,baseColor:658712,glowCap:!0});for(let e of[-1,1]){a.push({pos:[e*24,4,0],size:[4.6,.4,40],color:e<0?t:n,baseColor:528410,glowCap:!0,metalness:.75}),a.push({pos:[e*26.22,4.75,0],size:[.14,1.1,40],color:e<0?t:n,baseColor:594205,edge:!0,minimap:!1});for(let r of[-20,20])a.push({pos:[e*24,4.75,r],size:[4.6,1.1,.14],color:e<0?t:n,baseColor:594205,edge:!0,minimap:!1});for(let r of[-15,0,15])a.push({pos:[e*24,2,r],size:[.65,4,.65],color:e<0?n:t,baseColor:527896,edge:!0,minimap:!1,metalness:.8});a.push({pos:[e*21.5,4.05,-8],size:[1.7,.3,3.2],color:i,baseColor:528653,glowCap:!0,metalness:.7}),a.push({pos:[e*24,4.9,8],size:[2.8,1.4,1.4],color:i,baseColor:659216,glowCap:!0}),a.push({pos:[e*24,4.8,-14],size:[2.2,1.2,1.2],color:e<0?i:n,baseColor:855061,glowCap:!0})}let s=[{pos:[0,.9,-17],size:[5,1.8,1.2],color:n},{pos:[0,.9,17],size:[5,1.8,1.2],color:t},{pos:[-12,.75,0],size:[1.2,1.5,5.6],color:t},{pos:[12,.75,0],size:[1.2,1.5,5.6],color:n},{pos:[-18,.9,18],size:[2.4,1.8,2.4],color:r},{pos:[18,.9,-18],size:[2.4,1.8,2.4],color:r},{pos:[18,.9,18],size:[2.4,1.8,2.4],color:t},{pos:[10,.55,9],size:[2.2,1.1,2.2],color:i},{pos:[-9,.55,-10],size:[2.2,1.1,2.2],color:i},{pos:[-22,.4,0],size:[2.4,.8,4.5],color:n},{pos:[22,.4,0],size:[2.4,.8,4.5],color:t},{pos:[-15,4.7,-20],size:[3.6,.3,3.6],color:t,glowCap:!0},{pos:[-15,4.55,-20],size:[1.2,1.2,1.2],color:r}];for(let e of s)a.push({...e,baseColor:527638,edge:!0,glowCap:e.glowCap??!0,metalness:.65,roughness:.42});for(let e of[-1,1])o.push({from:[e*26.5,4.25,-19.5],to:[e*26.5,4.25,19.5],color:e<0?t:n,thickness:.045,opacity:.75}),o.push({from:[e*21.7,4.25,-19.5],to:[e*21.7,4.25,19.5],color:e<0?t:n,thickness:.035,opacity:.35});this.addModule({type:`blocks`,name:`foundry-structure`,boxes:a,lines:o,lights:[{pos:[-24,6,-24],color:t,intensity:100,distance:24},{pos:[24,6,24],color:n,intensity:100,distance:24},{pos:[0,4,-26],color:r,intensity:80,distance:20}]}),this.addModule({type:`spawn`,spawns:[{x:0,z:28,yaw:0},{x:0,z:-28,yaw:Math.PI},{x:28,z:0,yaw:Math.PI/2},{x:-28,z:0,yaw:-Math.PI/2},{x:20,z:20,yaw:Math.PI/4},{x:-20,z:-20,yaw:-3*Math.PI/4},{x:20,z:-20,yaw:3*Math.PI/4},{x:-20,z:20,yaw:-Math.PI/4},{x:30,z:14,yaw:Math.PI/2},{x:-30,z:-14,yaw:-Math.PI/2}],waypoints:[[0,13],[0,-13],[13,0],[-13,0],[15,15],[-15,15],[15,-15],[-15,-15],[22,6],[-22,6],[22,-6],[-22,-6],[6,22],[-6,22],[6,-22],[-6,-22],[0,24],[0,-24]]}),this.addModule({type:`movingPlatform`,from:[19.2,.5,-8],to:[19.2,4.05,-8],size:[3.2,.35,3.2],speed:.22,phase:0,color:i}),this.addModule({type:`movingPlatform`,from:[-19.2,.5,8],to:[-19.2,4.05,8],size:[3.2,.35,3.2],speed:.22,phase:.5,color:i}),this.addModule({type:`jumpPad`,pos:[-14,.02,18],power:17,color:t}),this.addModule({type:`jumpPad`,pos:[14,.02,-18],power:17,color:n}),this.addModule({type:`teleporter`,channel:`A`,pads:[{x:-27,z:27,y:0,channel:`A`,label:`A-1`,sub:`LINK ACTIVE`,color:n},{x:24,z:17,y:4.2,channel:`A`,label:`A-2`,sub:`CATWALK`,color:n},{x:27,z:-27,y:0,channel:`B`,label:`B-1`,sub:`LINK ACTIVE`,color:t},{x:-24,z:-17,y:4.2,channel:`B`,label:`B-2`,sub:`CATWALK`,color:t}]}),this.addModule({type:`gate`,pos:[-7,2.2,-12],width:6,height:4.4,axis:`x`,blocks:[`bullet`,`projectile`],color:n}),this.addModule({type:`gate`,pos:[7,2.2,12],width:6,height:4.4,axis:`x`,blocks:[`player`],color:t}),this.addModule({type:`laserFence`,pos:[-20,1.9,8],length:8,height:3.8,axis:`z`,phase:0,onTime:2.1,offTime:1.7,warnTime:.55,damage:15,color:`#ff3b5c`}),this.addModule({type:`laserFence`,pos:[20,1.9,-8],length:8,height:3.8,axis:`z`,phase:1.9,onTime:2.1,offTime:1.7,warnTime:.55,damage:15}),this.addModule({type:`gravityZone`,pos:[-15,4.2,-20],size:[8,8.4,8],gravityScale:.32,updraft:5.6,color:t}),this.addModule({type:`healthPickup`,items:[{x:0,y:2.45,z:0,amount:50,respawn:20,radius:1.6},{x:-24,y:5.15,z:10,amount:35,respawn:16},{x:24,y:5.15,z:-10,amount:35,respawn:16},{x:-15,y:5.6,z:-20,amount:35,respawn:18},{x:0,y:.95,z:-25,amount:30,respawn:14},{x:0,y:.95,z:25,amount:30,respawn:14}]}),this.addModule({type:`decor`,rings:[{pos:[0,10.5,0],radius:9.5,color:t,opacity:.15,speed:.035},{pos:[0,11.4,0],radius:6.5,color:n,opacity:.2,speed:-.05},{pos:[0,13,0],radius:4,color:r,opacity:.24,speed:.08,rotation:[.6,0,0]}],signs:[{text:`NEON FOUNDRY`,sub:`SECTOR 07 // FREE FOR ALL`,pos:[0,9.4,-31.2],width:16,height:4,color:`#00f6ff`},{text:`NO SIGNAL`,sub:`NO MERCY // P2P COMBAT`,pos:[31.2,8.2,0],width:12,height:3,rotation:[0,-Math.PI/2,0],color:`#ff2bd6`},{text:`PHASE // GATES`,sub:`PLAYERS PASS · BULLETS PASS`,pos:[-31.2,8.2,0],width:12,height:3,rotation:[0,Math.PI/2,0],color:`#a78bff`},{text:`STAY MOVING`,sub:`LOW-G ELEVATION AHEAD`,pos:[0,8.2,31.2],width:13,height:3.2,rotation:[0,Math.PI,0],color:`#a6ff4d`}],lines:[{from:[-30,13.4,-20],to:[30,13.4,-20],color:t,thickness:.03,opacity:.3},{from:[-30,13.4,20],to:[30,13.4,20],color:n,thickness:.03,opacity:.3},{from:[-20,13.4,-30],to:[-20,13.4,30],color:r,thickness:.03,opacity:.22},{from:[20,13.4,-30],to:[20,13.4,30],color:r,thickness:.03,opacity:.22}]})}},xp=.0025,Sp=.34,Cp=new B,wp=new B,Tp=.37,Ep=1.82,Dp=1.24,Op=1.66,kp=1.02;function Ap(e,t,n,r=new Va){return r.set(Cp.set(e.x-t,e.y,e.z-t),wp.set(e.x+t,e.y+n,e.z+t))}function jp(e){return e.crouch?Dp:Ep}function Mp(e){return e.crouch?kp:Op}function Np({position:e=new B(0,.05,0),yaw:t=0}={}){return{pos:e.clone(),vel:new B,yaw:t,pitch:0,crouch:!1,grounded:!0,groundSolid:null,coyote:.12,jumpBuffer:0,gravityScale:1,updraft:0,jumpScale:1,radius:Tp,justJumped:!1,justLanded:!1,landSpeed:0,externalMove:!1}}var Pp=class{constructor(){this.solids=[],this.triggers=[],this._solidId=0,this._triggerId=0,this._scratch=new Va}addSolid(e,{blocks:t=[`player`,`bullet`,`projectile`],enabled:n=!0}={}){let r={id:++this._solidId,box:e.clone(),blocks:new Set(t),enabled:n,delta:new B,linked:null};return this.solids.push(r),r}addTrigger(e,{kind:t=`generic`,data:n={},enabled:r=!0,tags:i=[`player`]}={}){let a={id:++this._triggerId,box:e.clone(),kind:t,data:n,enabled:r,tags:i,linked:null};return this.triggers.push(a),a}removeSolid(e){let t=this.solids.indexOf(e);t>=0&&this.solids.splice(t,1)}clear(){this.solids.length=0,this.triggers.length=0}_aabbFor(e,t,n){return new Va(new B(e.x-t,e.y,e.z-t),new B(e.x+t,e.y+n,e.z+t))}querySolids(e,t,n=[]){n.length=0;for(let r of this.solids)r.enabled&&r.blocks.has(t)&&e.intersectsBox(r.box)&&n.push(r);return n}collidesAt(e,t,n,r,i,a=`player`){let o=this._scratch.set(new B(e-r,t,n-r),new B(e+r,t+i,n+r));for(let e of this.solids)if(e.enabled&&e.blocks.has(a)&&o.intersectsBox(e.box))return!0;return!1}triggersAt(e){return this.triggers.filter(t=>t.enabled&&t.box.intersectsBox(e))}raycast(e,t,n=100,r=`bullet`){let i=null;for(let a of this.solids){if(!a.enabled||!a.blocks.has(r))continue;let o=this._rayBox(e,t,a.box,n);o&&(!i||o.distance<i.distance)&&(i={...o,solid:a})}return i}_rayBox(e,t,n,r){let i=0,a=r,o=-1,s=0;for(let r=0;r<3;r++){let c=r===0?e.x:r===1?e.y:e.z,l=r===0?t.x:r===1?t.y:t.z,u=r===0?n.min.x:r===1?n.min.y:n.min.z,d=r===0?n.max.x:r===1?n.max.y:n.max.z;if(Math.abs(l)<1e-9){if(c<u||c>d)return null;continue}let f=(u-c)/l,p=(d-c)/l,m=-1;if(f>p&&([f,p]=[p,f],m=1),f>i&&(i=f,o=r,s=m),p<a&&(a=p),i>a)return null}if(i<0||i>r)return null;let c=new B;return o===-1?c.copy(t).multiplyScalar(-1):c.setComponent(o,s),{distance:i,point:e.clone().addScaledVector(t,i),normal:c}}lineOfSight(e,t,n=`bullet`){let r=Cp.subVectors(t,e),i=r.length();return i<1e-4||(r.multiplyScalar(1/i),!this.raycast(e,r,i-.02,n))}moveBody(e,t,n){Fp(e),t.carry&&e.groundSolid?.delta&&e.pos.add(e.groundSolid.delta);let r=Cp.set(t.wishX||0,0,t.wishZ||0),i=Math.hypot(r.x,r.z);i>1&&r.multiplyScalar(1/i);let a=i>.01,o=!!t.sprint&&!e.crouch,s=e.crouch?4.3:o?10.4:7.35,c=e.grounded,l=e.gravityScale||1;if(t.jumpPressed&&(e.jumpBuffer=.13),e.jumpBuffer=Math.max(0,e.jumpBuffer-n),e.grounded&&(e.coyote=.12),e.jumpBuffer>0&&e.coyote>0&&(e.vel.y=8.85*(e.jumpScale||1),e.grounded=!1,e.groundSolid=null,e.coyote=0,e.jumpBuffer=0,e.justJumped=!0),e.grounded){if(a&&!t.noMove)e.vel.x=Ip(e.vel.x,r.x*s,74*n),e.vel.z=Ip(e.vel.z,r.z*s,74*n);else{let t=Math.exp(-9.5*n);e.vel.x*=t,e.vel.z*=t}}else if(a&&!t.noMove){let t=Math.hypot(e.vel.x,e.vel.z),i=Math.max(s,t);e.vel.x+=r.x*21*n,e.vel.z+=r.z*21*n;let a=Math.hypot(e.vel.x,e.vel.z);a>i&&(e.vel.x*=i/a,e.vel.z*=i/a)}e.vel.y-=26*l*n,e.vel.y+=(e.updraft||0)*n,e.vel.y=bi.clamp(e.vel.y,-46,30),this._moveHorizontal(e,`x`,e.vel.x*n),this._moveHorizontal(e,`z`,e.vel.z*n);let u=jp(e);e.grounded=!1,e.groundSolid=null;let d=e.vel.y;this._moveVertical(e,u,e.vel.y*n)||(e.vel.y=0),e.grounded?(e.coyote=.12,!c&&d<-4&&(e.justLanded=!0,e.landSpeed=Math.abs(d))):e.coyote=Math.max(0,e.coyote-n)}_moveHorizontal(e,t,n){if(Math.abs(n)<1e-7)return;let r=jp(e),i=Math.min(8,Math.ceil(Math.abs(n)/.18)),a=n/i;for(let n=0;n<i;n++){let n=e.pos[t];e.pos[t]+=a;let i=this._aabbFor(e.pos,e.radius,r),o=this.querySolids(i,`player`);if(!o.length)continue;let s=!1;if(e.grounded||e.coyote>0){let t=o.map(e=>e.box.max.y).filter(t=>t>e.pos.y+.008&&t<=e.pos.y+Sp+.02).sort((e,t)=>e-t);for(let n of t){let t=n+xp;if(!this.collidesAt(e.pos.x,t,e.pos.z,e.radius,r,`player`)){e.pos.y=t;let n=this._aabbFor(e.pos,e.radius,r);if(!this.querySolids(n,`player`).length){s=!0;break}}}}if(!s){e.pos[t]=n,e.vel[t]=0;break}}}_moveVertical(e,t,n){if(Math.abs(n)<1e-7){let n=this._aabbFor(e.pos,e.radius,t);return!this.querySolids(n,`player`).length}let r=Math.min(12,Math.ceil(Math.abs(n)/.15)),i=n/r;for(let n=0;n<r;n++){e.pos.y+=i;let n=this._aabbFor(e.pos,e.radius,t),r=this.querySolids(n,`player`);if(r.length){if(i<0){let t=-1/0,n=null;for(let e of r)e.box.max.y>t&&(t=e.box.max.y,n=e);e.pos.y=t+xp,e.vel.y=0,e.grounded=!0,e.groundSolid=n}else{let n=1/0;for(let e of r)e.box.min.y<n&&(n=e.box.min.y);e.pos.y=n-t-xp,e.vel.y=0}return!1}}return!0}tryUncrouch(e){return!e.crouch||!this.collidesAt(e.pos.x,e.pos.y,e.pos.z,e.radius,1.82,`player`)&&(e.crouch=!1,!0)}setCrouch(e,t){return t?(e.crouch=!0,!0):this.tryUncrouch(e)}};function Fp(e){e.justJumped=!1,e.justLanded=!1,e.landSpeed=0}function Ip(e,t,n){return Math.abs(t-e)<=n?t:e+Math.sign(t-e)*n}function Lp(){let e=document.createElement(`canvas`);e.width=64,e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.25,`rgba(255,255,255,0.85)`),n.addColorStop(.6,`rgba(255,255,255,0.2)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64);let r=new Rs(e);return r.colorSpace=Ar,r}var Rp=class{constructor(e){this.scene=e,this.group=new H,this.group.name=`effects`,e.add(this.group),this.transients=[],this.softTexture=Lp(),this.shake=0,this.flashLight=new Yc(16777215,0,24,2),this.flashLight.position.set(0,6,0),this.group.add(this.flashLight),this._lightTarget=0,this._decals=[]}_addTransient(e,t,n){if(this.group.add(e),this.transients.push({object:e,life:t,maxLife:t,update:n}),this.transients.length>220){let e=this.transients.shift();this._disposeObject(e.object)}}_disposeObject(e){e.removeFromParent(),e.traverse?.(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())})}addShake(e){this.shake=Math.min(.45,this.shake+e)}getShakeOffset(e=new B){let t=this.shake;return e.set((Math.random()*2-1)*t,(Math.random()*2-1)*t,(Math.random()*2-1)*t),e}flashLightAt(e,t,n=40,r=.09){this.flashLight.position.copy(e),this.flashLight.color.set(t),this.flashLight.intensity=Math.max(this.flashLight.intensity,n),this._lightTarget=Math.max(this._lightTarget,r)}tracer(e,t,n=8387839,{duration:r=.1,width:i=1}={}){let a=new Ts(new xo().setFromPoints([e.clone(),t.clone()]),new _s({color:n,transparent:!0,opacity:.95,blending:2,depthWrite:!1,toneMapped:!1,linewidth:i}));this._addTransient(a,r,(e,t,n)=>{n.material.opacity=e/r*.95})}railBeam(e,t,n=13350655){let r=new B().subVectors(t,e),i=r.length();if(i<.1)return;let a=new H,o=new W(new Ws(.035,.015,i,6,1,!0),new Qo({color:n,transparent:!0,opacity:.85,blending:2,depthWrite:!1,toneMapped:!1}));o.position.copy(e).addScaledVector(r,.5),o.quaternion.setFromUnitVectors(new B(0,1,0),r.clone().normalize()),a.add(o);let s=new W(new Ws(.1,.04,i,6,1,!0),new Qo({color:n,transparent:!0,opacity:.16,blending:2,depthWrite:!1,side:2,toneMapped:!1}));s.position.copy(o.position),s.quaternion.copy(o.quaternion),a.add(s),this._addTransient(a,.28,(e,t,n)=>{let r=Math.max(0,e/.28);n.children[0].material.opacity=.85*r,n.children[1].material.opacity=.16*r}),this.flashLightAt(t,n,35,.1)}muzzleFlash(e,t=10484991,n=1,r=!1){let i=new Go(new jo({map:this.softTexture,color:t,transparent:!0,opacity:.9,depthWrite:!1,depthTest:!0,blending:2,toneMapped:!1}));i.position.copy(e),i.scale.setScalar(.34*n),this._addTransient(i,.055,(e,t,r)=>{r.scale.setScalar(.34*n*(1+(1-e/.055)*.8)),r.material.opacity=Math.min(1,e/.02)*.9}),this.flashLightAt(e,t,r?18:10,.06)}impact(e,t,n=10484991,{heavy:r=!1}={}){let i=r?16:7;this._particles(e,n,{count:i,speed:r?4.5:2.2,gravity:7,size:r?.12:.07,life:r?.5:.32,normal:t,spread:.9}),this.decal(e,t,n,r?.35:.2),this.flashLightAt(e,n,r?16:6,.05)}bloodSpark(e,t,n){this._particles(e,n,{count:10,speed:2.8,gravity:9,size:.075,life:.4,normal:t,spread:1.1}),this.flashLightAt(e,n,8,.05)}explosion(e,t=16752704,n=4){let r=f(n/4,.7,2),i=new H;i.position.copy(e);let a=new W(new ec(.55,12,8),new Qo({color:t,transparent:!0,opacity:.9,blending:2,depthWrite:!1,toneMapped:!1}));i.add(a);let o=new W(new ec(1.1,12,8),new Qo({color:16734751,transparent:!0,opacity:.24,blending:2,depthWrite:!1,side:1,toneMapped:!1}));i.add(o);let s=new W(new tc(1,.06,6,36),new Qo({color:t,transparent:!0,opacity:.8,blending:2,depthWrite:!1,toneMapped:!1}));s.rotation.x=-Math.PI/2,s.position.y=-e.y+.12,i.add(s),this._addTransient(i,.65,(e,t,n)=>{let i=1-e/.65;a.scale.setScalar((.8+i*3.2)*r),a.material.opacity=Math.max(0,1-i*1.9),o.scale.setScalar((1+i*2)*r),o.material.opacity=Math.max(0,.24*(1-i)),s.scale.setScalar(.4+i*4.2*r),s.material.opacity=Math.max(0,.8*(1-i*1.4))}),this._particles(e,t,{count:30,speed:7*r,gravity:8,size:.16*r,life:.7,spread:1,normal:new B(0,1,0)}),this._particles(e,16773040,{count:16,speed:11*r,gravity:4,size:.09*r,life:.45,spread:1,normal:new B(0,1,0)}),this.flashLightAt(e,t,180*r,.25),this.addShake(.16*r)}_particles(e,t,{count:n=10,speed:r=3,gravity:i=6,size:a=.08,life:o=.4,normal:s=null,spread:c=1}={}){let l=new Float32Array(n*3),u=[];for(let t=0;t<n;t++){l[t*3]=e.x,l[t*3+1]=e.y,l[t*3+2]=e.z;let n=Math.random()*2-1,i=Math.random()*2-1,a=Math.random()*2-1,o=Math.hypot(n,i,a)||1;n/=o,i/=o,a/=o,s&&(n=n*(1-c*.5)+s.x*(.6+Math.random()),i=i*(1-c*.5)+s.y*(.6+Math.random()),a=a*(1-c*.5)+s.z*(.6+Math.random()));let d=r*(.4+Math.random()*.8);u.push(new B(n*d,i*d,a*d))}let d=new xo;d.setAttribute(`position`,new ao(l,3));let f=new Fs(d,new As({color:t,size:a,map:this.softTexture,transparent:!0,opacity:.9,depthWrite:!1,blending:2,sizeAttenuation:!0,toneMapped:!1}));f.frustumCulled=!1,this._addTransient(f,o,(e,t,r)=>{let a=r.geometry.attributes.position;for(let e=0;e<n;e++){let n=u[e];n.y-=i*t,a.array[e*3]+=n.x*t,a.array[e*3+1]+=n.y*t,a.array[e*3+2]+=n.z*t}a.needsUpdate=!0,r.material.opacity=Math.max(0,e/o*.9)})}decal(e,t,n,r=.2){let i=new Go(new jo({map:this.softTexture,color:n,transparent:!0,opacity:.55,depthWrite:!1,blending:2,toneMapped:!1}));i.position.copy(e).addScaledVector(t,.012),i.scale.setScalar(r),this._addTransient(i,1.8,(e,t,n)=>{n.material.opacity=Math.max(0,e/1.8*.55)})}teleportBurst(e,t){let n=new W(new tc(.8,.04,6,32),new Qo({color:t,transparent:!0,opacity:.8,blending:2,depthWrite:!1,toneMapped:!1}));n.position.copy(e),n.rotation.x=-Math.PI/2,this._addTransient(n,.45,(e,t,n)=>{let r=1-e/.45;n.scale.setScalar(1+r*2.4),n.material.opacity=.8*(1-r)}),this._particles(e.clone().add(new B(0,.8,0)),t,{count:18,speed:3.5,gravity:-2,size:.11,life:.55,spread:1}),this.flashLightAt(e,t,60,.16)}pickupBurst(e,t=10944333){this._particles(e,t,{count:18,speed:2.4,gravity:-1.8,size:.1,life:.65,spread:1});let n=new W(new tc(.4,.03,6,24),new Qo({color:t,transparent:!0,opacity:.9,blending:2,depthWrite:!1,toneMapped:!1}));n.position.copy(e),n.rotation.x=-Math.PI/2,this._addTransient(n,.5,(e,t,n)=>{let r=1-e/.5;n.scale.setScalar(1+r*3.2),n.material.opacity=.85*(1-r)}),this.flashLightAt(e,t,24,.1)}jumpPadBurst(e,t=63231){this._particles(e.clone().add(new B(0,.3,0)),t,{count:20,speed:6,gravity:-3,size:.1,life:.6,spread:.7,normal:new B(0,1,0)}),this.flashLightAt(e,t,30,.12)}spawnBurst(e,t=63231){let n=new W(new tc(.7,.035,6,32),new Qo({color:t,transparent:!0,opacity:.9,blending:2,depthWrite:!1,toneMapped:!1}));n.position.copy(e),n.position.y+=.1,n.rotation.x=-Math.PI/2,this._addTransient(n,.7,(e,t,n)=>{let r=1-e/.7;n.scale.setScalar(.4+r*2.4),n.material.opacity=.9*(1-r)}),this._particles(e.clone().add(new B(0,1,0)),t,{count:20,speed:3,gravity:-1,size:.1,life:.7,spread:1})}update(e){for(let t=this.transients.length-1;t>=0;t--){let n=this.transients[t];n.life-=e,n.life<=0?(this._disposeObject(n.object),this.transients.splice(t,1)):n.update?.(n.life,e,n.object)}this.shake*=Math.exp(-10*e),this.shake<5e-4&&(this.shake=0),this.flashLight.intensity>0&&(this.flashLight.intensity*=Math.exp(-18*e),this.flashLight.intensity<.2&&(this.flashLight.intensity=0))}dispose(){for(let e of this.transients)this._disposeObject(e.object);this.transients.length=0,this.softTexture.dispose(),this.flashLight.removeFromParent(),this.flashLight.dispose?.(),this.group.removeFromParent()}},zp=`projectile`;function Bp(e,t,n){let r=t.x-e.x,i=t.y-e.y,a=t.z-e.z,o=n.x-e.x,s=n.y-e.y,c=n.z-e.z,l=r*r+i*i+a*a,u=0;l>1e-8&&(u=f((o*r+s*i+c*a)/l,0,1));let d=o-r*u,p=s-i*u,m=c-a*u;return{distSq:d*d+p*p+m*m,t:u}}var Vp=class{constructor(e){this.session=e,this.scene=e.scene,this.physics=e.physics,this.effects=e.effects,this.projectiles=[],this.visualExplosions=new Set,this.nextId=1,this._step=new B,this._stepDir=new B,this._forward=new B(0,0,-1)}createId(){return`rk_${Date.now().toString(36)}_${this.nextId++}`}_buildMesh(e){let t=new H,n=new fc({color:1581100,metalness:.7,roughness:.35,emissive:e,emissiveIntensity:.45,flatShading:!0}),r=new W(new Ws(.075,.095,.42,8),n);r.rotation.x=Math.PI/2,r.position.z=.02,t.add(r);let i=new W(new Gs(.095,.2,8),new fc({color:2827032,metalness:.7,roughness:.3,flatShading:!0}));i.rotation.x=-Math.PI/2,i.position.z=-.27,t.add(i);let a=new W(new ec(.11,6,4),new Qo({color:e,transparent:!0,opacity:.95,blending:2,depthWrite:!1,toneMapped:!1}));return a.position.z=.28,t.add(a),t.userData.glow=a,t.userData.materials=[n,i.material,a.material],t.userData.geometries=[r.geometry,i.geometry,a.geometry],t}spawn({id:e=null,ownerId:t,origin:n,direction:r,weapon:i,authority:a=!0,startPos:o=null}){let s=i,c=new U(s.color).getHex(),l=this._buildMesh(c);l.position.copy(o||n);let u=r.clone().normalize(),d=s.projectile.speed??38;l.quaternion.setFromUnitVectors(new B(0,0,-1),u),this.scene.add(l);let f={id:e||this.createId(),ownerId:t,def:s,direction:u,velocity:u.clone().multiplyScalar(d),speed:d,gravity:s.projectile.gravity??0,ttl:s.projectile.ttl??6,age:0,authority:a,pos:l.position.clone(),prev:l.position.clone(),mesh:l,color:c,directHit:null,dead:!1,trailTimer:0};return this.projectiles.push(f),a&&this.session.netSendProjectile({action:`spawn`,id:f.id,weapon:s.id,ownerId:t,origin:[n.x,n.y,n.z],dir:[u.x,u.y,u.z]}),f}spawnRemote({id:e,ownerId:t,origin:n,dir:r,weapon:i}){let a=this.session.getWeaponDef(i);if(!a?.projectile)return null;let o=new B(...n),s=new B(...r);return this.spawn({id:e,ownerId:t,origin:o,direction:s,weapon:a,authority:!1,startPos:o})}detonateRemote(e,t){let n=new B(...t),r=this.projectiles.find(t=>t.id===e&&!t.dead);r?this._explode(r,n,null,!0):this.visualExplosions.has(e)||(this.visualExplosions.add(e),this.visualExplosions.size>60&&this.visualExplosions.delete(this.visualExplosions.values().next().value),this.effects.explosion(n,16757575,4.2),this.session.playExplosionAudio(n,!0))}update(e){for(let t of[...this.projectiles]){if(t.dead)continue;if(t.age+=e,t.trailTimer-=e,t.age>t.ttl){this._explode(t,t.pos,null,!t.authority);continue}t.prev.copy(t.pos),t.velocity.y-=(t.gravity||0)*e;let n=this._step.copy(t.velocity).multiplyScalar(e),r=n.length();if(r<1e-6)continue;let i=this._stepDir.copy(n).divideScalar(r);t.direction.copy(i);let a=t.pos.clone().add(n),o=this.physics.raycast(t.pos,i,r+.15,zp),s=null,c=null;if(t.authority){let e=this.session.getDamageableTargets(t.ownerId),n=1/0;for(let r of e){let e=r.state;if(!e.alive)continue;let i=e.pos.y+(e.crouch?.8:1),o=new B(e.pos.x,i,e.pos.z),l=e.crouch?.55:.58,u=new B(e.pos.x,e.pos.y+(e.crouch?1.3:1.58),e.pos.z);for(let[r,i]of[[o,l],[u,.33]]){let{distSq:o,t:l}=Bp(t.prev,a,r);o<=i*i&&l<n&&(n=l,s=e,c=t.prev.clone().lerp(a,l))}}if(s&&(!o||n*r<=o.distance)){this._explode(t,c||a,s,!1);continue}}if(o){let e=t.prev.clone().addScaledVector(t.direction,Math.max(0,o.distance-.05));this._explode(t,e,null,!t.authority);continue}t.pos.copy(a),t.mesh.position.copy(a),t.mesh.quaternion.setFromUnitVectors(this._forward,i);let l=t.mesh.userData.glow;if(l){let e=.8+Math.sin(t.age*38)*.25;l.scale.setScalar(e)}t.trailTimer<=0&&(t.trailTimer=.035,this.effects._particles(a,t.color,{count:1,speed:.4,gravity:-.2,size:.16,life:.35,spread:.5,normal:t.direction.clone().multiplyScalar(-1)}))}this.projectiles=this.projectiles.filter(e=>!e.dead)}_explode(e,t,n,r){if(e.dead)return;e.dead=!0,this._disposeMesh(e.mesh);let i=e.def.projectile.splashRadius??4;this.effects.explosion(t,16754253,i),this.session.playExplosionAudio(t,!e.authority),this.session.onProjectileDetonated?.(e,t,n,r),e.authority?(this.session.netSendProjectile({action:`explode`,id:e.id,pos:[t.x,t.y,t.z]}),this.session.handleProjectileDamage(e,t,n)):this.visualExplosions.add(e.id)}_disposeMesh(e){e.removeFromParent();for(let t of e.userData.geometries||[])t.dispose();for(let t of e.userData.materials||[])t.dispose()}clear(){for(let e of this.projectiles)this._disposeMesh(e.mesh);this.projectiles.length=0,this.visualExplosions.clear()}},Hp=class{constructor({renderer:e,weaponRegistry:t,settings:n}){this.renderer=e,this.registry=t,this.settings=n,this.scene=new Ea,this.camera=new qc(n?.get(`fov`)??82,1,.01,12),this.roots=new Map,this.activeId=null,this.switchTarget=null,this.switchTimer=0,this.switchPhase=`idle`,this.recoil=0,this.recoilPitch=0,this.recoilYaw=0,this.aim=0,this.bobT=0,this.swayX=0,this.swayY=0,this.time=0,this.muzzleTimer=0,this.reloadTilt=0,this.geometries=new Set,this.extraMaterials=new Set,this._build()}_build(){this.ambient=new $c(12115711,1.2),this.scene.add(this.ambient),this.key=new Qc(10480383,2.6),this.key.position.set(1.2,2.4,1.6),this.scene.add(this.key),this.rim=new Qc(16728536,2),this.rim.position.set(-1.6,.4,-.8),this.scene.add(this.rim),this.fill=new Yc(5810431,6,4,2),this.fill.position.set(-.5,-.7,.4),this.scene.add(this.fill),this.modelRoot=new H,this.scene.add(this.modelRoot);for(let e of this.registry.list()){let t=e.buildModel();t.visible=!1,this.modelRoot.add(t);let n=new W(new ec(.045,6,4),new Qo({color:15400959,transparent:!0,opacity:.9,blending:2,depthWrite:!1,toneMapped:!1}));n.visible=!1,t.userData.muzzle?(n.position.copy(t.userData.muzzle.position),t.userData.muzzle.add(n)):t.add(n),this.extraMaterials.add(n.material),this.geometries.add(n.geometry),this.roots.set(e.id,{def:e,model:t,muzzleFlash:n}),t.traverse(e=>{e.geometry&&this.geometries.add(e.geometry)})}this.muzzleLight=new Yc(10484991,0,3,2),this.scene.add(this.muzzleLight)}setWeapon(e){this.roots.has(e)&&this.activeId!==e&&(this.activeId?(this.switchTarget=e,this.switchTimer=0,this.switchPhase=`lower`):this._show(e))}_show(e){if(this.activeId){let e=this.roots.get(this.activeId);e&&(e.model.visible=!1)}this.activeId=e;let t=this.roots.get(e);t&&(t.model.visible=!0,t.model.position.copy(t.def.buildPosition??t.model.userData.basePosition??t.model.position),t.muzzleFlash.visible=!1),this.switchPhase=`idle`,this.switchTarget=null}fire(e){this.recoil=Math.min(1.4,this.recoil+(e.recoil?.kick??.03)*18),this.recoilPitch=Math.min(.35,this.recoilPitch+(e.recoil?.pitch??.01)*10),this.recoilYaw+=(Math.random()-.5)*(e.recoil?.yaw??.003)*14,this.muzzleTimer=.05;let t=this.roots.get(this.activeId);if(t&&(t.muzzleFlash.visible=!0,t.muzzleFlash.scale.setScalar(.7+Math.random()*.8),t.muzzleFlash.rotation.z=Math.random()*Math.PI,t.model.userData.muzzle)){let e=t.model.userData.muzzle.getWorldPosition(new B);this.muzzleLight.position.copy(e),this.muzzleLight.color.set(t.model.userData.muzzleColor??10484991),this.muzzleLight.intensity=2.4}}setAiming(e){this.aimTarget=+!!e}setMove(e,t){this.moveSpeed=e,this.grounded=t}addSway(e,t){this.swayX=f(this.swayX-e*32e-5,-.045,.045),this.swayY=f(this.swayY+t*32e-5,-.035,.035)}update(e,t,{reloading:n=!1,reloadProgress:r=0}={}){this.time=t,this.aim=m(this.aim,this.aimTarget??0,12,e),this.swayX=m(this.swayX,0,9,e),this.swayY=m(this.swayY,0,9,e),this.recoil=m(this.recoil,0,13,e),this.recoilPitch=m(this.recoilPitch,0,14,e),this.recoilYaw=m(this.recoilYaw,0,12,e),this.reloadTilt=m(this.reloadTilt,+!!n,10,e),this.switchPhase===`lower`?(this.switchTimer+=e,this.switchTimer>=.12&&this.switchTarget&&(this._show(this.switchTarget),this.switchPhase=`raise`,this.switchTimer=0)):this.switchPhase===`raise`&&(this.switchTimer+=e,this.switchTimer>=.18&&(this.switchPhase=`idle`,this.switchTimer=0));let i=this.roots.get(this.activeId);if(!i)return;let{model:a}=i,o=a.userData.basePosition;if(o){this.bobT+=e*(2.5+Math.min(this.moveSpeed??0,12)*1.1);let t=f((this.moveSpeed??0)/8,0,1.3),n=Math.sin(this.bobT)*.005*t,r=Math.abs(Math.cos(this.bobT))*.0055*t*(this.grounded?1:.3),i=this.switchPhase===`lower`?this.switchTimer/.12*.3:this.switchPhase===`raise`?(1-this.switchTimer/.18)*.3:0,s=.285-.115*this.aim,c=-.26+.035*this.aim,l=o.z+.06*this.aim;a.position.x=m(a.position.x,s+n+this.swayX,15,e),a.position.y=m(a.position.y,c+r-i+this.swayY,15,e),a.position.z=m(a.position.z,l+this.recoil*.12,18,e),a.rotation.x=m(a.rotation.x,-this.aim*.015+this.recoilPitch*.5-this.reloadTilt*.28,14,e),a.rotation.y=m(a.rotation.y,this.swayX*1.4+this.recoilYaw*.5+this.reloadTilt*.22,12,e),a.rotation.z=m(a.rotation.z,this.reloadTilt*.34+this.swayX*.6,12,e)}this.muzzleTimer>0?(this.muzzleTimer-=e,i.muzzleFlash.visible=this.muzzleTimer>0,this.muzzleLight.intensity=Math.max(0,this.muzzleLight.intensity-e*40)):(i.muzzleFlash.visible=!1,this.muzzleLight.intensity=0)}resize(e,t,n){this.camera.aspect=e/Math.max(1,t),n&&(this.camera.fov=n),this.camera.updateProjectionMatrix()}setFov(e){Math.abs(this.camera.fov-e)<.01||(this.camera.fov=e,this.camera.updateProjectionMatrix())}render(){let e=this.renderer.autoClear;this.renderer.autoClear=!1,this.renderer.clearDepth(),this.renderer.render(this.scene,this.camera),this.renderer.autoClear=e}dispose(){for(let e of this.geometries)e.dispose();for(let e of this.extraMaterials)e.dispose();this.geometries.clear(),this.extraMaterials.clear(),this.roots.clear()}};function Up(){let e=document.createElement(`canvas`);e.width=512,e.height=128;let t=new Rs(e);return t.colorSpace=Ar,t.minFilter=mn,{canvas:e,ctx:e.getContext(`2d`),texture:t}}var Wp=16726876,Gp=2.9,Kp=.725,qp=null;function Jp(){if(qp)return qp;let e=document.createElement(`canvas`);e.width=128,e.height=128;let t=e.getContext(`2d`),n=t.createRadialGradient(64,64,4,64,64,64);return n.addColorStop(0,`rgba(255,255,255,0.85)`),n.addColorStop(.45,`rgba(255,255,255,0.28)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,128,128),qp=new Rs(e),qp.colorSpace=Ar,qp}var Yp=class{constructor({id:e,name:t=`PLAYER`,color:n=`#00f6ff`,isBot:r=!1}={}){this.id=e,this.name=t,this.color=n,this.isBot=r,this.group=new H,this.group.name=`avatar-${e}`,this.group.rotation.order=`YXZ`,this.bodyGroup=new H,this.group.add(this.bodyGroup),this.materials=new Set,this.geometries=new Set,this.outlineMaterials=[],this.walkPhase=Math.random()*6,this.alive=!0,this.deathTime=0,this.health=100,this.lastHealth=-1,this.lastAlive=null,this.fireTimer=0,this.hitFlash=0,this._nameScale=1,this._rimOpacity=.78,this.crouch=!1,this.pitch=0,this._build(),this._buildMarker(),this.nameCanvas=Up(),this.nameTexture=this.nameCanvas.texture,this.nameMaterial=new jo({map:this.nameTexture,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1}),this.nameSprite=new Go(this.nameMaterial),this.nameSprite.position.set(0,2.15,0),this.nameSprite.scale.set(Gp,Kp,1),this.group.add(this.nameSprite),this._drawLabel(),this.setHealth(100,100)}_mat(e,{emissive:t=0,emissiveIntensity:n=0,metalness:r=.6,roughness:i=.45}={}){let a=new fc({color:e,emissive:t,emissiveIntensity:n,metalness:r,roughness:i,flatShading:!0});return this.materials.add(a),a}_basic(e){let t=new Qo({color:e,toneMapped:!1});return this.materials.add(t),t}_geo(e){return this.geometries.add(e),e}_mesh(e,t,n,r,i,a=this.bodyGroup){let o=new W(e,t);return o.position.set(n,r,i),a.add(o),o}_outline(e){if(!e)return null;let t=new Qo({color:Wp,transparent:!0,opacity:.78,side:1,blending:2,depthWrite:!1,toneMapped:!1});this.materials.add(t),this.outlineMaterials.push(t);let n=new W(e.geometry,t);return n.scale.setScalar(1.065),n.frustumCulled=!1,e.add(n),n}_buildMarker(){let e=new H;e.position.y=2.78,this.markerGroup=e;let t=new Qo({color:Wp,transparent:!0,opacity:.2,side:2,blending:2,depthWrite:!1,toneMapped:!1});this.materials.add(t),this.markerHalo=new W(this._geo(new Qs(.3,0)),t),this.markerHalo.scale.set(.9,1.5,.9),e.add(this.markerHalo);let n=new Qo({color:16766942,transparent:!0,opacity:.95,blending:2,depthWrite:!1,toneMapped:!1});this.materials.add(n),this.markerCore=new W(this._geo(new Qs(.14,0)),n),this.markerCore.scale.set(.72,1.35,.72),e.add(this.markerCore),this.group.add(e);let r=new jo({map:Jp(),color:Wp,transparent:!0,opacity:.16,blending:2,depthWrite:!1,depthTest:!0,toneMapped:!1});this.materials.add(r),this.aura=new Go(r),this.aura.position.y=1.05,this.aura.scale.set(1.7,2.2,1),this.group.add(this.aura)}_build(){let e=new U(this.color).getHex(),t=this._mat(1910840,{emissive:66e4,emissiveIntensity:.65,metalness:.62,roughness:.44}),n=this._mat(3425887,{emissive:792100,emissiveIntensity:.5,metalness:.68,roughness:.38}),r=this._mat(858917,{emissive:e,emissiveIntensity:1.7,metalness:.5,roughness:.35}),i=this._basic(e);this.legL=new H,this.legL.position.set(-.14,.86,0),this.bodyGroup.add(this.legL),this.legR=new H,this.legR.position.set(.14,.86,0),this.bodyGroup.add(this.legR);for(let[e,a]of[[this.legL,-1],[this.legR,1]]){let o=this._mesh(this._geo(new G(.17,.72,.2)),t,0,-.36,0,e);this._outline(o),this._mesh(this._geo(new G(.19,.14,.28)),n,0,-.72,-.03,e);let s=this._mesh(this._geo(new G(.02,.4,.02)),i,a*.095,-.32,-.1,e);s.scale.y=.7,this._mesh(this._geo(new G(.18,.025,.21)),r,0,-.16,0,e).scale.set(.9,1,.9)}let a=this._mesh(this._geo(new G(.42,.16,.28)),n,0,.88,0);this._outline(a),this.torso=new H,this.torso.position.y=1.16,this.bodyGroup.add(this.torso);let o=this._mesh(this._geo(new G(.48,.52,.3)),t,0,0,0,this.torso);this._outline(o),this._mesh(this._geo(new G(.34,.32,.05)),n,0,.03,-.17,this.torso),this._mesh(this._geo(new G(.36,.035,.06)),r,0,.15,-.18,this.torso),this._mesh(this._geo(new G(.05,.3,.02)),i,0,.02,-.195,this.torso),this._mesh(this._geo(new Qs(.065,0)),this._basic(16777215),0,.02,-.21,this.torso),this._mesh(this._geo(new G(.32,.34,.18)),n,0,.04,.2,this.torso);let s=this._mesh(this._geo(new G(.22,.025,.02)),i,0,.12,.295,this.torso);s.scale.y=.6,this.armL=new H,this.armL.position.set(-.32,1.39,0),this.bodyGroup.add(this.armL),this.armR=new H,this.armR.position.set(.32,1.39,0),this.bodyGroup.add(this.armR);for(let[e,i]of[[this.armL,-1],[this.armR,1]]){let a=this._mesh(this._geo(new G(.22,.16,.24)),n,i*.02,.03,0,e);this._outline(a);let o=this._mesh(this._geo(new G(.14,.46,.14)),t,i*.04,-.26,0,e);this._outline(o),this._mesh(this._geo(new G(.15,.12,.16)),n,i*.04,-.51,-.02,e),this._mesh(this._geo(new G(.15,.02,.15)),r,i*.04,-.42,0,e)}this.armR.rotation.x=-.85,this.armR.rotation.z=-.08,this.armL.rotation.x=-1,this.armL.rotation.z=.32,this.weaponGroup=new H,this.weaponGroup.position.set(.1,1.15,-.36),this.weaponGroup.rotation.x=-.04,this.bodyGroup.add(this.weaponGroup),this._mesh(this._geo(new G(.12,.12,.46)),n,0,0,-.05,this.weaponGroup),this._mesh(this._geo(new G(.055,.055,.28)),t,0,.045,-.24,this.weaponGroup),this._mesh(this._geo(new G(.13,.02,.2)),i,0,.06,-.1,this.weaponGroup),this._mesh(this._geo(new G(.06,.16,.08)),t,0,-.13,.03,this.weaponGroup),this.muzzleObject=new _a,this.muzzleObject.position.set(0,.045,-.42),this.weaponGroup.add(this.muzzleObject),this.muzzleFlash=new W(this._geo(new ec(.12,6,4)),new Qo({color:14286847,transparent:!0,opacity:.9,blending:2,depthWrite:!1,toneMapped:!1})),this.muzzleFlash.position.copy(this.muzzleObject.position),this.muzzleFlash.visible=!1,this.weaponGroup.add(this.muzzleFlash),this.materials.add(this.muzzleFlash.material),this.headGroup=new H,this.headGroup.position.set(0,1.63,0),this.bodyGroup.add(this.headGroup);let c=this._mesh(this._geo(new G(.28,.29,.28)),t,0,0,0,this.headGroup);this._outline(c),this._mesh(this._geo(new G(.24,.08,.03)),i,0,.02,-.155,this.headGroup),this._mesh(this._geo(new G(.3,.035,.3)),n,0,.16,0,this.headGroup),this._mesh(this._geo(new G(.06,.2,.02)),r,.15,.01,0,this.headGroup),this._mesh(this._geo(new G(.06,.2,.02)),r,-.15,.01,0,this.headGroup),this.hitGroup=new H,this.group.add(this.hitGroup);let l=new Qo({transparent:!0,opacity:0,depthWrite:!1,colorWrite:!1});this.materials.add(l),this.hitBody=new W(this._geo(new Hs(.31,.82,4,8)),l),this.hitBody.position.y=.88,this.hitBody.userData={playerId:this.id,hitPart:`body`,active:!0},this.hitBody.frustumCulled=!1,this.hitGroup.add(this.hitBody),this.hitHead=new W(this._geo(new ec(.24,8,6)),l),this.hitHead.position.y=1.64,this.hitHead.userData={playerId:this.id,hitPart:`head`,active:!0},this.hitHead.frustumCulled=!1,this.hitGroup.add(this.hitHead);let u=new W(this._geo(new tc(.46,.012,4,24)),new Qo({color:e,transparent:!0,opacity:.3,toneMapped:!1,depthWrite:!1,blending:2}));this.materials.add(u.material),u.rotation.x=-Math.PI/2,u.position.y=.02,this.group.add(u),this.groundRing=u,this.group.traverse(e=>{e.isMesh&&e!==this.hitBody&&e!==this.hitHead&&(e.castShadow=!1,e.receiveShadow=!1)})}_drawLabel(){let{ctx:e,canvas:t,texture:n}=this.nameCanvas,r=t.width,i=t.height;e.clearRect(0,0,r,i),e.fillStyle=`rgba(3, 8, 16, 0.82)`,e.beginPath(),e.roundRect(10,10,r-20,i-20,8),e.fill(),e.strokeStyle=this.color,e.globalAlpha=.55,e.lineWidth=3,e.stroke(),e.globalAlpha=1,e.fillStyle=this.color,e.fillRect(14,14,60,4),e.fillStyle=`#eaffff`,e.font=`700 40px Orbitron, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`;let a=String(this.name).slice(0,12);e.fillText(a,r/2,53);let o=f(this.health/100,0,1);e.fillStyle=`rgba(255,255,255,0.1)`,e.fillRect(34,88,r-68,12),e.fillStyle=o>.5?`#a6ff4d`:o>.25?`#ffc857`:`#ff3b5c`,e.fillRect(34,88,(r-68)*o,12),e.strokeStyle=`rgba(255,255,255,0.18)`,e.lineWidth=1,e.strokeRect(34,88,r-68,12),n.needsUpdate=!0}setHealth(e,t=100){let n=f(e,0,t);Math.abs(n-this.lastHealth)<.1&&this.lastAlive===this.alive||(this.alive&&this.lastHealth>=0&&n<this.lastHealth-.01&&(this.hitFlash=.16),this.health=n,this.lastHealth=n,this.lastAlive=this.alive,this.alive?(this._drawLabel(),this.nameSprite.visible=!0):this.nameSprite.visible=!1)}setAlive(e){this.alive!==e&&(this.alive=e,this.deathTime=e?0:1e-4,this.hitGroup.visible=e,this.hitBody.userData.active=e,this.hitHead.userData.active=e,e?(this.group.visible=!0,this.bodyGroup.rotation.z=0,this.bodyGroup.rotation.x=0,this.bodyGroup.position.y=0,this.nameSprite.visible=!0,this.markerGroup.visible=!0,this.aura.visible=!0,this.hitFlash=0,this._drawLabel()):(this.nameSprite.visible=!1,this.markerGroup.visible=!1,this.aura.visible=!1,this.lastHealth=-1))}setCrouch(e){this.crouch!==e&&(this.crouch=e,this.bodyGroup.scale.y=e?.82:1,this.nameSprite.position.y=e?1.9:2.15,this.hitBody.position.y=e?.72:.88,this.hitBody.scale.y=e?.78:1,this.hitHead.position.y=e?1.33:1.64)}setCameraDistance(e){let t=f(Number(e)/9,1,2.4);Math.abs(t-this._nameScale)<.02||(this._nameScale=t,this.nameSprite.scale.set(Gp*t,Kp*t,1),this.markerGroup?.scale.setScalar(.9+(t-1)*.55))}setWeaponColor(e){this._weaponGlow&&this._weaponGlow.color.set(e)}flashMuzzle(e=.055){this.fireTimer=Math.max(this.fireTimer,e),this.muzzleFlash.visible=!0,this.muzzleFlash.rotation.z=Math.random()*Math.PI,this.muzzleFlash.scale.setScalar(.8+Math.random()*.6)}getMuzzleWorld(e=new B){return this.muzzleObject.getWorldPosition(e)}getHitMeshes(){return this.alive?[this.hitHead,this.hitBody]:[]}update(e,{time:t=0,speed:n=0,grounded:r=!0,pitch:i=0,firing:a=!1}={}){if(!this.alive){this.deathTime+=e;let t=f(this.deathTime/.7,0,1);this.bodyGroup.rotation.z=t*1.35,this.bodyGroup.rotation.x=t*.1,this.bodyGroup.position.y=-t*.25,this.deathTime>1.6&&(this.group.visible=!1);return}this.pitch=m(this.pitch,f(i,-1.2,1.2),14,e),this.headGroup.rotation.x=this.pitch*.65,this.torso.rotation.x=this.pitch*.12,this.walkPhase+=e*(2.2+Math.min(n,12)*.9);let o=f(n/8,0,1.3),s=Math.sin(this.walkPhase)*.55*o;this.legL.rotation.x=s,this.legR.rotation.x=-s,this.armL.rotation.x=-1-s*.25,this.armR.rotation.x=-.85+s*.14;let c=r?Math.abs(Math.sin(this.walkPhase))*.035*o:.02;this.bodyGroup.position.y=c,this.fireTimer=Math.max(0,this.fireTimer-e),this.muzzleFlash.visible=this.fireTimer>0,this.weaponGroup.position.z=-.36+(a?.045:0),this.weaponGroup.rotation.x=-.04+(a?.08:0),this.groundRing.material.opacity=.18+Math.sin(t*2+this.walkPhase)*.06,this.groundRing.visible=r,this.hitFlash=Math.max(0,this.hitFlash-e);let l=.78+Math.min(.22,this.hitFlash*2.2);if(Math.abs(l-this._rimOpacity)>.004){this._rimOpacity=l;for(let e of this.outlineMaterials)e.opacity=l}this.markerGroup.position.y=(this.crouch?2.52:2.78)+Math.sin(t*2.6)*.05,this.markerCore.rotation.y=t*1.9,this.markerHalo.rotation.y=-t*1.2;let u=.86+Math.sin(t*4.2)*.14;this.markerHalo.scale.set(.9*u,1.5*u,.9*u)}dispose(){this.group.removeFromParent();for(let e of this.geometries)e.dispose();for(let e of this.materials)e.dispose();this.nameTexture?.dispose(),this.nameMaterial?.dispose(),this.geometries.clear(),this.materials.clear()}},Xp=class{constructor(e,t){this.canvas=e,this.session=t,this.ctx=e.getContext(`2d`),this.width=e.width,this.height=e.height,this.accum=0,this.interval=1/24}update(e){this.accum+=e,!(this.accum<this.interval)&&(this.accum=0,this.draw())}_map(e,t){let n=this.session.stage.bounds,r=n.maxX-n.minX,i=n.maxZ-n.minZ,a=this.width-60,o=this.height-60,s=Math.min(a/r,o/i);return{x:this.width/2+(e-(n.minX+n.maxX)/2)*s,y:this.height/2+(t-(n.minZ+n.maxZ)/2)*s,scale:s}}draw(){let e=this.ctx;if(!e)return;let{width:t,height:n}=this;e.clearRect(0,0,t,n);let r=e.createRadialGradient(t/2,n/2,10,t/2,n/2,t*.65);r.addColorStop(0,`rgba(4, 16, 27, 0.92)`),r.addColorStop(1,`rgba(2, 5, 13, 0.94)`),e.fillStyle=r,e.fillRect(0,0,t,n);let i=this.session.stage.bounds,a=this._map(i.minX,i.minZ),o=this._map(i.maxX,i.maxZ);e.save(),e.strokeStyle=`rgba(0, 246, 255, 0.08)`,e.lineWidth=1;for(let t=1;t<8;t+=1){let n=t/8,r=a.x+(o.x-a.x)*n,i=a.y+(o.y-a.y)*n;e.beginPath(),e.moveTo(r,a.y),e.lineTo(r,o.y),e.stroke(),e.beginPath(),e.moveTo(a.x,i),e.lineTo(o.x,i),e.stroke()}e.strokeStyle=`rgba(0, 246, 255, 0.22)`,e.strokeRect(a.x,a.y,o.x-a.x,o.y-a.y),e.restore();for(let t of this.session.stage.minimapBoxes){let n=this._map(t.x-t.w/2,t.z-t.d/2),r=this._map(t.x+t.w/2,t.z+t.d/2),i=typeof t.color==`number`?`#${t.color.toString(16).padStart(6,`0`)}`:String(t.color||`#00f6ff`);e.fillStyle=`${i}22`,e.strokeStyle=`${i}66`,e.lineWidth=1,e.fillRect(n.x,n.y,r.x-n.x,r.y-n.y),e.strokeRect(n.x,n.y,r.x-n.x,r.y-n.y)}for(let t of this.session.stage.minimapMarkers){if(t.type===`platform`)continue;let n=this._map(t.x,t.z),r=typeof t.color==`number`?`#${t.color.toString(16).padStart(6,`0`)}`:String(t.color||`#00f6ff`);e.save(),e.fillStyle=`${r}cc`,e.strokeStyle=r,e.shadowColor=r,e.shadowBlur=7,e.lineWidth=1.4,t.type===`health`?(e.beginPath(),e.arc(n.x,n.y,3.4,0,Math.PI*2),e.fill()):t.type===`teleport`?e.strokeRect(n.x-4,n.y-4,8,8):t.type===`jump`?(e.beginPath(),e.moveTo(n.x,n.y-5),e.lineTo(n.x+4.5,n.y+3),e.lineTo(n.x-4.5,n.y+3),e.closePath(),e.fill()):t.type===`laser`?e.fillRect(n.x-5,n.y-1,10,2):t.type===`gate`?(e.beginPath(),e.moveTo(n.x-5,n.y),e.lineTo(n.x+5,n.y),e.stroke()):t.type===`gravity`&&(e.beginPath(),e.arc(n.x,n.y,6,0,Math.PI*2),e.stroke()),e.restore()}for(let t of this.session.stage.pickups){if(!t.available)continue;let n=this._map(t.pos.x,t.pos.z);e.fillStyle=`rgba(166, 255, 77, 0.95)`,e.fillRect(n.x-1.5,n.y-4,3,8),e.fillRect(n.x-4,n.y-1.5,8,3)}for(let t of this.session.records.values()){if(t.isLocal||!t.alive)continue;let n=this._map(t.pos.x,t.pos.z);e.save(),e.fillStyle=t.color,e.shadowColor=t.color,e.shadowBlur=8,e.beginPath(),e.arc(n.x,n.y,t.isBot?4.3:5.2,0,Math.PI*2),e.fill(),t.isBot&&(e.strokeStyle=`rgba(0,0,0,0.8)`,e.lineWidth=1,e.stroke()),e.restore()}let s=this.session.localRecord;if(s){let t=this._map(s.pos.x,s.pos.z),n=s.yaw||0;e.save(),e.translate(t.x,t.y),e.rotate(-n);let r=e.createLinearGradient(0,0,0,-34);r.addColorStop(0,`rgba(0, 246, 255, 0.24)`),r.addColorStop(1,`rgba(0, 246, 255, 0)`),e.fillStyle=r,e.beginPath(),e.moveTo(0,0),e.lineTo(-20,-34),e.lineTo(20,-34),e.closePath(),e.fill(),e.fillStyle=s.alive?`#eaffff`:`#ff3b5c`,e.strokeStyle=`#00f6ff`,e.lineWidth=1.5,e.beginPath(),e.moveTo(0,-7.5),e.lineTo(5.5,5),e.lineTo(0,2.5),e.lineTo(-5.5,5),e.closePath(),e.fill(),e.stroke(),e.restore()}e.save(),e.fillStyle=`rgba(0, 246, 255, 0.8)`,e.font=`600 13px Orbitron, sans-serif`,e.textAlign=`center`,e.fillText(`N`,t/2,19),e.restore()}dispose(){this.ctx=null,this.session=null}},Zp=5,Qp=class{constructor(e){this.session=e;let t=e=>document.getElementById(e);this.el={mode:t(`hud-mode`),timer:t(`hud-timer`),roomCode:t(`hud-room-code`),net:t(`hud-net`),healthValue:t(`health-value`),healthFill:t(`health-fill`),kills:t(`hud-kills`),deaths:t(`hud-deaths`),ping:t(`hud-ping`),weaponClass:t(`weapon-class`),weaponName:t(`weapon-name`),ammoMag:t(`ammo-mag`),ammoReserve:t(`ammo-reserve`),ammoMain:t(`ammo-main`),reloadRing:t(`reload-ring`),reloadProgress:t(`reload-progress`),ammoPips:t(`ammo-pips`),weaponBar:t(`weapon-bar`),crosshair:t(`crosshair`),hitmarker:t(`hitmarker`),damageVignette:t(`damage-vignette`),damageDirection:t(`damage-direction`),killfeed:t(`killfeed`),toastStack:t(`toast-stack`),hint:t(`hint-line`),waiting:t(`waiting-note`),waitCode:t(`wait-code`),perf:t(`perf`),scoreboard:t(`scoreboard`),scoreRows:t(`score-rows`),scoreRoom:t(`score-room`),deathOverlay:t(`death-overlay`),deathBy:t(`death-by`),respawnTimer:t(`respawn-timer`)},this.slots=new Map,this.ammoPips=[],this.activeWeaponId=null,this.killEntries=[],this.toastEntries=[],this.hintTimer=0,this.damageTimer=0,this.hitmarkerTimer=0,this.scoreboardVisible=!1,this.lastScoreRefresh=0,this.lastFpsRefresh=0,this.lastPerfText=``,this.lastNetState=``,this._buildWeaponBar(),this.minimap=new Xp(t(`minimap`),e),this.el.mode.textContent=e.modeLabel,this.el.roomCode.textContent=e.roomCode,this.el.scoreRoom.textContent=`ROOM ${e.roomCode}`,this.el.deathOverlay.classList.add(`hidden`),e.practice&&this.el.waiting.classList.add(`hidden`)}_buildWeaponBar(){let e=document.createDocumentFragment();for(let t of this.session.loadout){let n=t.def,r=document.createElement(`div`);r.className=`weapon-slot`,r.style.setProperty(`--slot-color`,n.color),r.dataset.weapon=n.id,r.innerHTML=`
        <span class="ws-key">LOADOUT</span>
        <span class="ws-name">${n.name}</span>
        <span class="ws-bar"><i></i></span>
      `,e.appendChild(r),this.slots.set(n.id,{root:r,bar:r.querySelector(`.ws-bar i`)})}this.el.weaponBar.appendChild(e)}refreshWeaponBar(){this.el.weaponBar.replaceChildren(),this.slots.clear(),this.activeWeaponId=null,this._buildWeaponBar()}_buildAmmoPips(e){this.el.ammoPips.innerHTML=``,this.ammoPips=[];let t=Math.min(16,Math.max(4,e));for(let e=0;e<t;e+=1){let e=document.createElement(`i`);this.el.ammoPips.appendChild(e),this.ammoPips.push(e)}this.ammoPipMax=t}update(e){let t=this.session,n=t.localRecord;if(!n)return;let r=Math.max(0,Math.round(n.health));this.el.healthValue.textContent!==String(r)&&(this.el.healthValue.textContent=String(r)),this.el.healthFill.style.width=`${f(r,0,100)}%`,this.el.healthFill.classList.toggle(`low`,r<=30),this.el.kills.textContent=`K ${n.kills??0}`,this.el.deaths.textContent=`D ${n.deaths??0}`;let i=t.getDisplayPing();if(this.el.ping.textContent=i==null?`-- ms`:`${x(i)} ms`,this.el.timer.textContent=b(t.matchTime),this.el.crosshair.classList.toggle(`is-hidden`,!n.alive||!t.deployed),this.el.crosshair.classList.toggle(`is-reloading`,t.weapon?.reloading),this._updateWeapon(e),this._updateNetwork(),this._updateDeath(),this._updateWaiting(),this._updateScoreboard(e),t.weapon?.def){let e=t.aiming,r=Math.hypot(n.vel?.x||0,n.vel?.z||0),i=f(5+t.weapon.getSpread({aiming:e,moveSpeed:r,airborne:!n.grounded,crouching:n.crouch})*620,5,28);this.el.crosshair.style.setProperty(`--gap`,`${i.toFixed(1)}px`),this.el.crosshair.classList.toggle(`is-target`,t.crosshairTarget)}this.minimap.update(e),this.hintTimer>0&&(this.hintTimer-=e,this.hintTimer<=0&&this.el.hint.classList.remove(`show`)),this.damageTimer>0&&(this.damageTimer-=e,this.damageTimer<=0&&(this.el.damageVignette.classList.remove(`show`),this.el.damageDirection.classList.remove(`show`))),this.hitmarkerTimer>0&&(this.hitmarkerTimer-=e,this.hitmarkerTimer<=0&&this.el.hitmarker.classList.remove(`show`,`kill`)),this._updatePerf(e)}_updateWeapon(e){let t=this.session,n=t.weapon;if(!n)return;let r=n.def;this.activeWeaponId!==r.id&&(this.activeWeaponId=r.id,this._buildAmmoPips(r.magSize),this.el.weaponClass.textContent=r.classLabel,this.el.weaponName.textContent=r.name),this.el.ammoMag.textContent=String(n.ammo),this.el.ammoReserve.textContent=n.reserve===1/0?`/ ∞`:`/ ${n.reserve}`,this.el.ammoMain.classList.toggle(`is-low`,n.ammo<=Math.max(1,Math.floor(r.magSize*.25)));let i=n.reloadProgress;this.el.reloadRing.classList.toggle(`is-reloading`,n.reloading),this.el.reloadProgress.style.strokeDashoffset=String(113*(1-i));let a=n.ammo/Math.max(1,r.magSize),o=Math.ceil(a*this.ammoPipMax);for(let e=0;e<this.ammoPips.length;e+=1)this.ammoPips[e].classList.toggle(`on`,e<o);for(let[e,n]of this.slots){n.root.classList.toggle(`active`,e===t.weapon.id);let r=t.loadout.find(t=>t.id===e),i=!r||r.ammo===0&&r.reserve!==1/0&&r.reserve<=0;n.root.classList.toggle(`empty`,i),r&&(n.bar.style.width=`${f(r.ammo/Math.max(1,r.def.magSize),0,1)*100}%`)}}_updateNetwork(){let e=this.session,t=`LOCAL`,n=`local`;if(e.room){if(e.room.isHost)t=e.room.guestCount()>0?`P2P ${e.room.guestCount()+1}P`:`HOST`,n=`ok`;else{let r=e.room.ping;t=r==null?`P2P`:`P2P ${x(r)}ms`,n=r==null?`ok`:r>160?`bad`:r>80?`warn`:`ok`}}let r=`${t}|${n}`;if(r!==this.lastNetState){this.lastNetState=r;let e=this.el.net;e.querySelector(`span`).textContent=t,e.classList.toggle(`is-warn`,n===`warn`),e.classList.toggle(`is-bad`,n===`bad`)}}_updateDeath(){let e=this.session.localRecord,t=this.session.deployed&&e&&!e.alive;if(this.el.deathOverlay.classList.toggle(`hidden`,!t),!t)return;let n=this.session.localDeath;if(n){let e=`${n.killerName?`BY ${String(n.killerName).toUpperCase()}`:`BY ENVIRONMENT`}${n.weaponName?` // ${n.weaponName}`:``}`;this.el.deathBy.textContent!==e&&(this.el.deathBy.textContent=e)}else this.el.deathBy.textContent!==`BY UNKNOWN`&&(this.el.deathBy.textContent=`BY UNKNOWN`);let r=Math.max(0,Math.ceil(e.respawnRemaining??0));this.el.respawnTimer.textContent!==String(r)&&(this.el.respawnTimer.textContent=String(r))}_updateWaiting(){let e=this.session,t=!(!e.room||!e.room.isHost||e.room.guestCount()!==0||e.practice||e.deployed);this.el.waiting.classList.toggle(`hidden`,!t),t&&this.el.waitCode.textContent!==e.roomCode&&(this.el.waitCode.textContent=e.roomCode)}_updateScoreboard(e){if(this.el.scoreboard.classList.toggle(`hidden`,!this.scoreboardVisible),!this.scoreboardVisible||(this.lastScoreRefresh-=e,this.lastScoreRefresh>0))return;this.lastScoreRefresh=.25;let t=this.session.getScoreboardData(),n=document.createDocumentFragment();for(let e=0;e<t.length;e+=1){let r=t[e],i=document.createElement(`div`);i.className=`score-row`,r.isLocal&&i.classList.add(`is-self`),r.alive||i.classList.add(`is-dead`),i.style.setProperty(`--pc`,r.color);let a=[r.isLocal?`<span class="s-tag you">YOU</span>`:``,r.isHost?`<span class="s-tag host">HOST</span>`:``,r.isBot?`<span class="s-tag">BOT</span>`:``].join(``);i.innerHTML=`
        <span class="s-rank">#${String(e+1).padStart(2,`0`)}</span>
        <span class="s-player"><i class="s-dot"></i><span class="s-name">${$p(r.name)}</span>${a}</span>
        <span class="s-kills">${r.kills}</span>
        <span class="s-deaths">${r.deaths}</span>
        <span class="s-status ${r.alive?``:`dead`}">${r.alive?`ACTIVE`:`RESPAWN`}</span>
        <span class="s-ping">${r.ping==null?`--`:`${r.ping}ms`}</span>
      `,n.appendChild(i)}this.el.scoreRows.replaceChildren(n)}_updatePerf(e){if(this.lastFpsRefresh+=e,this.lastFpsRefresh<.4)return;this.lastFpsRefresh=0;let t=`${Math.round(this.session.fps||0)} FPS · ${this.session.getRenderLabel()}`;t!==this.lastPerfText&&(this.lastPerfText=t,this.el.perf.textContent=t),this.el.perf.classList.toggle(`hidden`,!this.session.settings.get(`showFps`))}setScoreboard(e){this.scoreboardVisible=!!e,e&&(this.lastScoreRefresh=0)}addKill({killerName:e,victimName:t,weaponName:n,killerId:r,victimId:i,headshot:a=!1,color:o=`#00f6ff`}){let s=document.createElement(`div`);for(s.className=`kill-entry`,s.style.setProperty(`--kill-color`,o),s.innerHTML=`
      <span class="k-name ${r===this.session.localId?`k-you`:``}">${$p(e||`WORLD`)}</span>
      <span class="k-icon">▸</span>
      <span class="k-name ${i===this.session.localId?`k-you`:``}">${$p(t||`UNKNOWN`)}</span>
      ${a?`<span class="k-head">HEAD</span>`:``}
      <span class="k-weapon">${$p(n||``)}</span>
    `,this.el.killfeed.prepend(s),this.killEntries.push({entry:s,timestamp:performance.now()});this.killEntries.length>Zp;)this.killEntries.shift()?.entry.remove();setTimeout(()=>{s.style.transition=`opacity 0.25s`,s.style.opacity=`0`,setTimeout(()=>s.remove(),260)},6500)}showToast(e,t=`#00f6ff`,n=1800){let r=document.createElement(`div`);for(r.className=`hud-toast`,r.textContent=e,r.style.setProperty(`--toast-color`,t),this.el.toastStack.appendChild(r),this.toastEntries.push(r);this.toastEntries.length>3;)this.toastEntries.shift()?.remove();setTimeout(()=>{r.style.transition=`opacity 0.22s`,r.style.opacity=`0`,setTimeout(()=>r.remove(),240)},n)}showHint(e,t=2.4){this.el.hint.textContent=e,this.el.hint.classList.add(`show`),this.hintTimer=t}showHitmarker(e=!1){let t=this.el.hitmarker;t.classList.remove(`show`,`kill`),t.offsetWidth,e&&t.classList.add(`kill`),t.classList.add(`show`),this.hitmarkerTimer=.22}showDamage(e=0,t=null){this.el.damageVignette.classList.toggle(`show`,e>0),t==null?this.el.damageDirection.classList.remove(`show`):(this.el.damageDirection.style.transform=`rotate(${t}rad)`,this.el.damageDirection.classList.add(`show`)),this.damageTimer=.16}showDeath(e=null,t=null){this.session.localDeath={killerName:e,weaponName:t},this.el.deathOverlay.classList.remove(`hidden`),this.el.deathBy.textContent=e?`BY ${String(e).toUpperCase()}`:`BY ENVIRONMENT`}hideDeath(){this.el.deathOverlay.classList.add(`hidden`),this.session.localDeath=null}setNetworkStatus(e,t=`ok`){let n=this.el.net;n.querySelector(`span`).textContent=e,n.classList.toggle(`is-warn`,t===`warn`),n.classList.toggle(`is-bad`,t===`bad`),this.lastNetState=`${e}|${t}`}dispose(){this.minimap.dispose();for(let{entry:e}of this.killEntries)e.remove();for(let e of this.toastEntries)e.remove();this.killEntries.length=0,this.toastEntries.length=0}};function $p(e){return String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var em=new Set([`KeyW`,`KeyA`,`KeyS`,`KeyD`,`KeyR`,`KeyM`,`KeyF`,`Digit1`,`Digit2`,`Digit3`,`Digit4`,`Digit5`,`ShiftLeft`,`ShiftRight`,`ControlLeft`,`ControlRight`,`Space`,`Tab`]);function tm(e){let t=e?.tagName;return t===`INPUT`||t===`TEXTAREA`||t===`SELECT`||e?.isContentEditable}var nm=class{constructor({canvas:e}){this.canvas=e,this.enabled=!1,this.pointerLocked=!1,this.keys=new Set,this.pressed=new Set,this.mouse=[!1,!1,!1],this.mousePressed=new Set,this.lookX=0,this.lookY=0,this.wheel=0,this.unlockedOverride=!1,this._onKeyDown=e=>this._handleKeyDown(e),this._onKeyUp=e=>this._handleKeyUp(e),this._onMouseDown=e=>this._handleMouseDown(e),this._onMouseUp=e=>this._handleMouseUp(e),this._onMouseMove=e=>this._handleMouseMove(e),this._onWheel=e=>this._handleWheel(e),this._onContextMenu=e=>{this._mouseActive&&e.preventDefault()},this._onPointerLock=()=>{this.pointerLocked=document.pointerLockElement===this.canvas,this.pointerLocked||this._clearButtons()},this._onBlur=()=>{this.keys.clear(),this.pressed.clear(),this._clearButtons()},this._onVisibility=()=>{document.hidden&&this._onBlur()},window.addEventListener(`keydown`,this._onKeyDown,{passive:!1}),window.addEventListener(`keyup`,this._onKeyUp),window.addEventListener(`mousedown`,this._onMouseDown),window.addEventListener(`mouseup`,this._onMouseUp),window.addEventListener(`mousemove`,this._onMouseMove),window.addEventListener(`wheel`,this._onWheel,{passive:!1}),window.addEventListener(`contextmenu`,this._onContextMenu),window.addEventListener(`blur`,this._onBlur),document.addEventListener(`pointerlockchange`,this._onPointerLock),document.addEventListener(`visibilitychange`,this._onVisibility),this.pointerLocked=document.pointerLockElement===this.canvas}setEnabled(e){this.enabled=!!e,this.enabled||(this.keys.clear(),this.pressed.clear(),this._clearButtons(),this.lookX=0,this.lookY=0)}setUnlockedOverride(e){this.unlockedOverride=!!e,this._mouseActive||this._clearButtons()}get _mouseActive(){return this.enabled&&(this.pointerLocked||this.unlockedOverride)}_clearButtons(){this.mouse.fill(!1),this.mousePressed.clear(),this.wheel=0}_handleKeyDown(e){this.enabled&&!tm(e.target)&&(em.has(e.code)&&e.preventDefault(),this.keys.has(e.code)||this.pressed.add(e.code),this.keys.add(e.code))}_handleKeyUp(e){tm(e.target)||(this.keys.delete(e.code),em.has(e.code)&&e.preventDefault())}_handleMouseDown(e){this._mouseActive&&(e.button<0||e.button>2||(this.mouse[e.button]||this.mousePressed.add(e.button),this.mouse[e.button]=!0,e.button===2&&e.preventDefault()))}_handleMouseUp(e){e.button<0||e.button>2||(this.mouse[e.button]=!1)}_handleMouseMove(e){this._mouseActive&&(this.lookX+=e.movementX||0,this.lookY+=e.movementY||0)}_handleWheel(e){this._mouseActive&&(e.preventDefault(),this.wheel+=Math.sign(e.deltaY))}isDown(e){return this.keys.has(e)}anyDown(...e){return e.some(e=>this.keys.has(e))}wasPressed(e){return this.pressed.has(e)}consumeKey(e){let t=this.pressed.has(e);return this.pressed.delete(e),t}isMouseDown(e=0){return!!this.mouse[e]}consumeMousePress(e=0){let t=this.mousePressed.has(e);return this.mousePressed.delete(e),t}takeLook(){let e={x:this.lookX,y:this.lookY,wheel:this.wheel};return this.lookX=0,this.lookY=0,this.wheel=0,e}get moveForward(){return+!!this.isDown(`KeyW`)-!!this.isDown(`KeyS`)}get moveRight(){return+!!this.isDown(`KeyD`)-!!this.isDown(`KeyA`)}endFrame(){this.pressed.clear(),this.mousePressed.clear(),this.wheel=0}dispose(){window.removeEventListener(`keydown`,this._onKeyDown),window.removeEventListener(`keyup`,this._onKeyUp),window.removeEventListener(`mousedown`,this._onMouseDown),window.removeEventListener(`mouseup`,this._onMouseUp),window.removeEventListener(`mousemove`,this._onMouseMove),window.removeEventListener(`wheel`,this._onWheel),window.removeEventListener(`contextmenu`,this._onContextMenu),window.removeEventListener(`blur`,this._onBlur),document.removeEventListener(`pointerlockchange`,this._onPointerLock),document.removeEventListener(`visibilitychange`,this._onVisibility)}},rm=[`NULL-7`,`VANTA`,`KILO-9`,`ECHO-4`,`SABLE`,`RIFT-2`],im=[`pulse`,`volt`,`scatter`];function am(e,t,n=new B){return n.set(t.x-e.x,0,t.z-e.z),n.lengthSq()>1e-4&&n.normalize(),n}var om=class{constructor(e,t,n=0){this.session=e,this.record=t,this.avatar=t.avatar,this.body=t.body,this.index=n,this.name=t.name,this.weaponId=im[n%im.length],this.skill=h(.46,.68),this.waypoint=e.stage.randomWaypoint(t.pos),this.waypointTimer=0,this.fireTimer=h(.7,2.2),this.switchTimer=h(5,10),this.strafeDir=Math.random()<.5?-1:1,this.strafeTimer=h(1.2,2.8),this.stuckTimer=0,this.lastPos=t.pos.clone(),this.reaction=h(.12,.3),this.targetVisible=!1,this.targetDistance=1/0,this.aimYaw=t.yaw,this.aimPitch=0,this._move=new B,this._toTarget=new B,this._eye=new B,this._targetEye=new B,this._aimPoint=new B,this._missPoint=new B,this._lastYaw=t.yaw}reset(e){this.waypoint=this.session.stage.randomWaypoint(e.pos),this.waypointTimer=0,this.fireTimer=h(.9,2.2),this.switchTimer=h(5,10),this.strafeTimer=h(1,2.5),this.stuckTimer=0,this.lastPos.copy(e.pos),this.reaction=h(.12,.3),this.targetVisible=!1,this.record.yaw=e.yaw,this.record.pitch=0}update(e,t){let n=this.record;if(!n.alive||!this.body)return;let r=this.session.localRecord,i=this.body;i.crouch=!1,this.record.pos.copy(i.pos);let a=r?.alive&&!r.isBot,o=1/0,s=!1;if(a&&(o=n.pos.distanceTo(r.pos),this._eye.copy(n.pos),this._eye.y+=1.58,this._targetEye.copy(r.pos),this._targetEye.y+=r.crouch?.85:1.42,s=o<72&&this.session.physics.lineOfSight(this._eye,this._targetEye,`bullet`)),this.targetVisible=s,this.targetDistance=o,a){let t=r.pos.x-n.pos.x,i=r.pos.z-n.pos.z,a=Math.atan2(-t,-i),o=4.5+this.skill*4;this.aimYaw=n.yaw+C(n.yaw,a)*Math.min(1,e*o),n.yaw=this.aimYaw;let s=r.pos.y+(r.crouch?.8:1.35)-(n.pos.y+1.5);n.pitch+=(Math.atan2(s,Math.max(.2,Math.hypot(t,i)))-n.pitch)*Math.min(1,e*5),n.pitch=f(n.pitch,-.8,.8)}this.switchTimer-=e,this.switchTimer<=0&&(this.switchTimer=h(6,11),o>18&&this.weaponId===`scatter`?this.weaponId=`volt`:o<8&&this.weaponId===`rail`?this.weaponId=`pulse`:Math.random()<.35&&(this.weaponId=im[Math.floor(Math.random()*im.length)])),this.waypointTimer-=e,this.strafeTimer-=e,this.strafeTimer<=0&&(this.strafeTimer=h(1.1,2.6),Math.random()<.55&&(this.strafeDir*=-1));let c=0,l=0;if(a&&s){let e=am(n.pos,r.pos,this._toTarget),t=this.weaponId===`scatter`?7:this.weaponId===`pulse`?14:19,i=f((o-t)/10,-1,1),a=-e.z*this.strafeDir,s=e.x*this.strafeDir;c=e.x*i+a*.75,l=e.z*i+s*.75,o<4&&(c=-e.x,l=-e.z)}else if((!this.waypoint||this.waypointTimer<=0||n.pos.distanceToSquared(this.waypoint)<2.2)&&(this.waypoint=this.session.stage.randomWaypoint(a?r.pos:n.pos,32),this.waypointTimer=h(4,8)),this.waypoint){let e=am(n.pos,this.waypoint,this._toTarget);c=e.x,l=e.z}let u=Math.sin(t*1.3+this.index*2.7)*.18;c+=u,l-=u*.6;let d=Math.hypot(c,l);d>.01&&(c/=d,l/=d);let p=i.jumpBuffer>0||Math.random()<e*.03;this.session.physics.moveBody(i,{wishX:c,wishZ:l,sprint:o>12&&s,jumpPressed:p,carry:!0},e),this.stuckTimer+=e,this.stuckTimer>1.1&&(this.stuckTimer=0,n.pos.distanceToSquared(this.lastPos)<.06&&(i.grounded&&=(i.vel.y=7.5,!1),this.waypoint=this.session.stage.randomWaypoint(n.pos),this.waypointTimer=h(3,6)),this.lastPos.copy(n.pos)),n.pos.copy(i.pos),n.vel.copy(i.vel),n.crouch=!1,n.grounded=i.grounded,n.moving=Math.hypot(i.vel.x,i.vel.z)>1.2,this.avatar&&this.avatar.setCrouch(!1),n.pos.y<-12?this.session.applyDamage(n.id,999,null,`fall`):a&&s&&o<50&&this._tryFire(e,r)}_tryFire(e,t){if(this.fireTimer-=e,this.fireTimer>0)return;let n=this.session.getWeaponDef(this.weaponId);if(!n)return;let r=Math.max(.14,n.fireInterval),i=this.weaponId===`scatter`?24:n.range;if(this.targetDistance>i){this.fireTimer=Math.min(this.fireTimer,.08);return}let a=Math.atan2(-(t.pos.x-this.record.pos.x),-(t.pos.z-this.record.pos.z));if(Math.abs(C(this.record.yaw,a))>.32){this.fireTimer=.05;return}this.session.botFire(this,t,n);let o=Math.random()<.18?h(.35,.8):0;this.fireTimer=r*h(1.05,1.65)+o}};function sm(e,t=3){let n=[],r=[...rm].sort(()=>Math.random()-.5);for(let i=0;i<t;i+=1){let t=e.addBot({name:r[i%r.length],color:e.nextPlayerColor()});t&&n.push(new om(e,t,i))}return n}var cm=`bullet`,lm=.42,um=.28;function dm(e,t=10484991){let n=e?.hitParticles??e?.color??t;try{return new U(n).getHex()}catch{return t}}function fm(e){return Math.round(e*1e3)/1e3}function pm(e,t,n=!1){let r=e?.damage??0,i=e?.falloff;if(i&&t>i.start){let e=f((t-i.start)/Math.max(.001,i.end-i.start),0,1);r*=1+(i.min-1)*e}return n&&(r*=e?.headshotMult??1),r}function mm(e){return!Array.isArray(e)||e.length<3?null:new B(Number(e[0])||0,Number(e[1])||0,Number(e[2])||0)}function hm(e,t,n=new B){let r=Math.cos(t);return n.set(-Math.sin(e)*r,Math.sin(t),-Math.cos(e)*r)}var gm=class{constructor(e){this.session=e,this.physics=e.physics,this.effects=e.effects,this._origin=new B,this._dir=new B,this._shotDir=new B,this._end=new B,this._point=new B,this._muzzle=new B,this._toTarget=new B,this._right=new B,this._up=new B,this._crosshairTimer=0,this._reloadHintAt=0,this._remoteFireAt=0}originFor(e,t=this._origin){let n=e?.body,r=n?Mp(n):e?.crouch?1.02:1.66;return t.set(e.pos.x,e.pos.y+r,e.pos.z)}spreadDirection(e,t,n){if(!t||t<=0)return n.copy(e);let r=Math.sqrt(Math.random())*t,i=Math.random()*d;this._right.set(-e.z,0,e.x),this._right.lengthSq()<1e-6&&this._right.set(1,0,0),this._right.normalize();let a=this._up.copy(e).cross(this._right).normalize();return n.copy(e).addScaledVector(this._right,Math.cos(i)*r).addScaledVector(a,Math.sin(i)*r).normalize()}updateLocal(e){let t=this.session,n=t.localRecord;if(!n?.alive)return;for(let n of t.loadout)n.update(e)?.reloadCompleted&&n===t.weapon&&this._onReloadFinished(n);let r=t.weapon;if(!r)return;let i=r.def,a=t.input,o=!!i.zoomFov&&a.isMouseDown(2)&&!r.reloading;t.aiming!==o&&(t.aiming=o,t.viewModel?.setAiming(o)),a.consumeKey(`KeyR`)&&this.startReload();let s=a.consumeMousePress(0),c=a.isMouseDown(0);(i.auto&&c||!i.auto&&s)&&this._tryFireLocal(n,r)}startReload(){let e=this.session,t=e.weapon;return!t||t.reloading?!1:t.startReload()?(e.audio?.reload(t.def.reloadTime),!0):(t.ammo<=0&&!t.hasReserve&&(t.cooldown=Math.max(t.cooldown,.3),e.audio?.empty()),!1)}_tryFireLocal(e,t){let n=this.session,r=t.def;if(t.reloading||t.cooldown>0)return;if(t.ammo<=0){t.canReload?this.startReload():(t.cooldown=Math.max(t.cooldown,.28),n.audio?.empty());return}if(!t.consumeShot())return;let i=this.originFor(e);hm(e.yaw,e.pitch,this._dir);let a=t.getSpread({aiming:n.aiming,moveSpeed:Math.hypot(e.vel.x,e.vel.z),airborne:!e.grounded,crouching:e.crouch}),o=n.aiming?.62:1;e.pitch=f(e.pitch+r.recoil.pitch*o*h(.85,1.15),-1.5,1.5),e.yaw+=(Math.random()-.5)*r.recoil.yaw*2*o,e.body&&(e.body.yaw=e.yaw,e.body.pitch=e.pitch),this.effects.addShake(f(r.recoil.kick*.45,.008,.055)),n.viewModel?.fire(r),n.audio?.shot(r.id,{volume:1}),n.netSendFire({ownerId:e.id,weapon:r.id,origin:[fm(i.x),fm(i.y),fm(i.z)],dir:[fm(this._dir.x),fm(this._dir.y),fm(this._dir.z)]}),this._resolveShot(e,t,i,this._dir,a)}_resolveShot(e,t,n,r,i){let a=t.def;if(a.type===`projectile`){let t=this.spreadDirection(r,i??0,this._shotDir),o=n.clone().addScaledVector(t,.45);this.effects.muzzleFlash(o,dm(a),1.15,!0),this.session.projectiles.spawn({ownerId:e.id,origin:o,direction:t,weapon:a})}else this._fireHitscan(e,t,n,r,i??0)}_fireHitscan(e,t,n,r,i){let a=this.session,o=t.def,s=o.range??60,c=Math.max(1,o.pellets??1),l=Math.max(1,o.pierce??1),u=a.getDamageableTargets(e.id),d=dm(o),f=new Map,p=c>4?3:c,m=0,h=0;for(let e=0;e<c;e+=1){let e=this.spreadDirection(r,i,this._shotDir),t=this.physics.raycast(n,e,s,cm),a=t?Math.min(s,t.distance):s,c=[];for(let t of u){let r=this._rayTarget(n,e,a,t.state);r&&c.push(r)}c.sort((e,t)=>e.distance-t.distance);let g=c.slice(0,l);for(let e of g){let t=pm(o,e.distance,e.headshot),n=f.get(e.record)??{amount:0,headshot:!1,point:e.point};n.amount+=t,n.headshot=n.headshot||e.headshot,f.set(e.record,n)}let _=g[0]??null;if(m<p){m+=1;let r=_?_.point:t?t.point:this._end.copy(n).addScaledVector(e,s),i=this._point.copy(n).addScaledVector(e,.45);o.id===`rail`?this.effects.railBeam(i,r,d):this.effects.tracer(i,r,d,{duration:.075})}if(_){if(h<2){h+=1;let t=this._toTarget.copy(e).multiplyScalar(-1);this.effects.bloodSpark(_.point,t,d)}}else t&&h<3&&(h+=1,this.effects.impact(t.point,t.normal,d,{heavy:o.type===`rail`||o.id===`scatter`}))}for(let[e,t]of f)e?.alive&&a.applyOutgoingDamage(e,t.amount,o.id,{headshot:t.headshot,cause:`weapon`})}_rayTarget(e,t,n,r){if(!r?.alive)return null;let i=!!r.crouch,a=this._toTarget.set(r.pos.x,r.pos.y+(i?.72:.88),r.pos.z),o=this._muzzle.set(r.pos.x,r.pos.y+(i?1.3:1.62),r.pos.z),s=this._segmentSphere(e,t,n,a,lm),c=this._segmentSphere(e,t,n,o,um);return c&&(!s||c.distance<=s.distance)?{record:r,distance:c.distance,headshot:!0,point:c.point}:s?{record:r,distance:s.distance,headshot:!1,point:s.point}:null}_segmentSphere(e,t,n,r,i){let a=e.x-r.x,o=e.y-r.y,s=e.z-r.z,c=t.x,l=t.y,u=t.z,d=a*c+o*l+s*u,f=a*a+o*o+s*s-i*i;if(f>0&&d>0)return null;let p=d*d-f;if(p<0)return null;let m=Math.sqrt(p),h=-d-m;return h<0&&(h=0),h>n?null:{distance:h,point:new B(e.x+c*h,e.y+l*h,e.z+u*h)}}updateCrosshair(e){let t=this.session,n=t.localRecord,r=t.weapon;if(!n?.alive||!r||!t.deployed){t.crosshairTarget=!1,this._crosshairTimer=0,t.aiming&&(t.aiming=!1,t.viewModel?.setAiming(!1));return}if(this._crosshairTimer-=e,this._crosshairTimer>0)return;this._crosshairTimer=.045;let i=this.originFor(n);hm(n.yaw,n.pitch,this._dir);let a=r.def.range??60,o=this.physics.raycast(i,this._dir,a,cm),s=o?Math.min(a,o.distance):a,c=!1;for(let e of t.getDamageableTargets(n.id))if(this._rayTarget(i,this._dir,s,e.state)){c=!0;break}t.crosshairTarget=c}handleRemoteFire(e){let t=this.session;if(!e)return;let n=e.ownerId??e.from,r=t.getWeaponDef(e.weapon);if(!r)return;let i=t.records.get(n);if(!i||i.isLocal)return;let a=mm(e.origin),o=mm(e.dir);if(!a||!o||o.lengthSq()<1e-6)return;o.normalize(),i.avatar?.flashMuzzle(.06);let s=i.avatar?i.avatar.getMuzzleWorld(this._muzzle.clone()):this._muzzle.copy(a),c=dm(r);if(r.type!==`projectile`){let e=this.physics.raycast(s,o,r.range??60,cm),t=e?e.point:this._end.copy(s).addScaledVector(o,r.range??60);r.id===`rail`?this.effects.railBeam(s,t,c):this.effects.tracer(s,t,c,{duration:.075}),e&&this.effects.impact(e.point,e.normal,c,{heavy:r.id===`scatter`})}this.effects.muzzleFlash(s,c,1,!1),t.audio?.shot(r.id,{pan:t.panFor(s),volume:t.volumeFor(s,80)})}botFire(e,t,n){let r=this.session;if(!r.isAuthority||!e?.record?.alive||!t?.alive)return;let i=e.record,a=this.originFor(i),o=i.avatar?i.avatar.getMuzzleWorld(this._muzzle.clone()):this._muzzle.copy(a),s=i.pos.distanceTo(t.pos),c=dm(n,16738893),l=n.id===`scatter`?26:n.range??60;this._toTarget.set(t.pos.x,t.pos.y+(t.crouch?.82:1.12),t.pos.z);let u=this._shotDir.subVectors(this._toTarget,a).normalize(),d=f(e.skill??.5,0,1),p=f(.3+d*.58-Math.max(0,s-10)*.0075,.08,.88),m=Math.random()<p,g=m?.014:h(.05,.11);this.spreadDirection(u,g,u);let _=this.physics.raycast(a,u,l,cm),v=_?Math.min(l,_.distance):l,y=m?this._rayTarget(a,u,v,t):null,b=y?y.point:_?_.point:this._end.copy(a).addScaledVector(u,l);if(i.avatar?.flashMuzzle(.06),n.id===`rail`?this.effects.railBeam(o,b,c):this.effects.tracer(o,b,c,{duration:.07}),this.effects.muzzleFlash(o,c,.95,!1),r.audio?.shot(n.id,{pan:r.panFor(i.pos),volume:r.volumeFor(i.pos,85)}),y){let e=y.headshot&&d>.6,a=pm(n,y.distance,e);this.effects.bloodSpark(y.point,this._point.copy(u).multiplyScalar(-1),c),r.applyDamage(t.id,a,i.id,`weapon`,{weaponId:n.id,headshot:e})}else _&&this.effects.impact(_.point,_.normal,c)}handleProjectileDamage(e,t,n){let r=this.session;if(!e||!t)return;let i=e.def,a=i?.projectile??{},o=a.splashRadius??4,s=a.splashDamage??0,c=a.selfDamageScale??.5,l=a.splashKnockback??6,u=e.ownerId,d=i?.hitParticles??16754253;for(let e of r.records.values()){if(!e.alive)continue;let a=e.pos.y+(e.crouch?.62:.92),f=e.pos.x-t.x,p=a-t.y,m=e.pos.z-t.z,h=Math.hypot(f,p,m),g=!!(n&&n.id===e.id),_=h>=o?0:(1-h/o)**.85;if(!g&&_<=0)continue;let v=e.id===u,y=0;if(g&&(y+=i?.damage??0),y+=v?s*c*(g?.6:_):s*_,y=Math.min(y,160),v&&!g&&y<1)continue;y>0&&(v?this._applySelfSplash(e,y,i):r.applyOutgoingDamage(e,y,i?.id,{cause:g?`projectile`:`splash`,headshot:!1}));let b=e.body;if(b){let e=Math.hypot(f,m)||1e-4,t=l*Math.max(.25,g?1:_);b.vel.x+=f/e*t,b.vel.z+=m/e*t,(b.grounded||p>.2)&&(b.vel.y+=Math.min(5.5,t*.5)),b.grounded=!1}(e.isLocal||e.isBot)&&this.effects.bloodSpark(this._point.set(e.pos.x,a,e.pos.z),this._toTarget.set(0,1,0),d)}}_applySelfSplash(e,t,n){let r=this.session,i=n?.name??`EXPLOSIVE`;r.isAuthority?r.applyDamage(e.id,t,e.id,`splash`,{weaponId:n?.id,weaponName:i}):(e.health=f(e.health-t,0,e.maxHealth),r.hud?.showDamage(t),r.audio?.hurt(),r.effects.addShake(f(t*.004,.02,.18)),r.net.sendHazard({kind:`splash`,amount:Math.round(t*10)/10}))}_onReloadFinished(e){this.session.audio?.reload(.06),this.session.hud?.showHint(`${e.def.name} 装填完了`,.8)}},_m=1/20,vm=1/15,ym=4;function bm(e){return Math.round(e*1e3)/1e3}function xm(e){return[bm(e.x),bm(e.y),bm(e.z)]}var Sm=class{constructor(e){this.session=e,this.room=e.room,this._unsubscribers=[],this._bound=!1,this._stateTimer=0,this._snapshotTimer=0}get active(){return!(!this.room||this.room.closed)}bind(){if(this._bound||!this.room)return;this._bound=!0;let e=(e,t)=>{this._unsubscribers.push(this.room.on(e,t))};e(`message`,e=>this.handleMessage(e)),e(`snapshot`,e=>this.handleSnapshot(e))}dispose(){for(let e of this._unsubscribers)try{e()}catch{}this._unsubscribers.length=0,this._bound=!1}update(e){let t=this.session;this.active&&t.running&&(t.isAuthority?(this._snapshotTimer-=e,this._snapshotTimer<=0&&(this._snapshotTimer=vm,this.sendSnapshot())):(this._stateTimer-=e,this._stateTimer<=0&&(this._stateTimer=_m,this.sendState())))}sendState(){let e=this.session,t=this.room,n=e.localRecord;t&&!t.isHost&&n&&(n.alive?t.sendToHost({t:I.STATE,pos:xm(n.pos),yaw:bm(n.yaw),pitch:bm(n.pitch),crouch:!!n.crouch,weapon:e.weaponId,moving:!!n.moving,health:Math.round(n.health),ping:Number.isFinite(t.ping)?Math.round(t.ping):null}):t.sendToHost({t:I.STATE,dead:!0}))}sendSnapshot(){let e=this.session,t=this.room;if(!t?.isHost)return;let n=[];for(let t of e.records.values())t.isBot||(t.isLocal?n.push({id:t.id,name:t.name,color:t.color,pos:xm(t.pos),yaw:bm(t.yaw),pitch:bm(t.pitch),crouch:!!t.crouch,weapon:e.weaponId,health:Math.round(t.health),alive:t.alive,kills:t.kills||0,deaths:t.deaths||0}):n.push({id:t.id,name:t.name,color:t.color,pos:xm(t.pos),yaw:bm(t.yaw),pitch:bm(t.pitch),crouch:!!t.crouch,weapon:t.weaponId||e.weaponId,health:Math.round(t.health),alive:t.alive,kills:t.kills||0,deaths:t.deaths||0,respawnRemaining:bm(t.respawnRemaining),ping:t.ping}));let r=[];for(let t of e.stage.pickups)t.available||r.push(t.id);t.broadcast({t:I.SNAPSHOT,time:bm(e.matchTime),deployed:e.deployed,players:n,pickups:r})}sendFire(e){let t=this.room;if(!this.active||!t)return;let n={t:I.FIRE,...e};t.isHost?t.broadcast(n):t.sendToHost(n)}sendProjectile(e){let t=this.room;if(!this.active||!t)return;let n={t:I.PROJECTILE,...e};t.isHost?t.broadcast(n):t.sendToHost(n)}sendHit(e){this.active&&!this.room.isHost&&this.room.sendToHost({t:I.HIT,...e})}sendHazard(e){this.active&&!this.room.isHost&&this.room.sendToHost({t:I.HAZARD,...e})}sendHeal(e){this.active&&!this.room.isHost&&e&&this.room.sendToHost({t:I.HEAL,pickupId:e})}sendLoadout(e){this.active&&!this.room.isHost&&e&&this.room.sendToHost({t:I.LOADOUT,weaponId:e})}handleMessage({message:e,fromId:t}={}){if(!e||typeof e.t!=`string`)return;let n=this.session,r=e.from??t;switch(e.t){case I.STATE:n.isAuthority&&this.handleState(e,r);break;case I.HIT:n.isAuthority&&this.handleHit(e,r);break;case I.HAZARD:n.isAuthority&&this.handleHazard(e,r);break;case I.HEAL:n.isAuthority?this.handleHealRequest(e,r):n.handleHealMessage(e);break;case I.FIRE:n.combat.handleRemoteFire({...e,ownerId:e.ownerId??r});break;case I.PROJECTILE:this.handleProjectile(e);break;case I.DAMAGE:n.handleDamageMessage(e);break;case I.KILL:n.handleKillMessage(e);break;case I.RESPAWN:n.handleRespawnMessage(e);break;case I.LOADOUT:n.isAuthority&&this.handleLoadout(e,r);break;case I.MATCH_START:n.isAuthority||n.requestMatchStart();break;case I.CHAT:n.hud?.showToast(`${e.name||`PLAYER`}: ${e.text||``}`,e.color,2600)}}handleState(e,t){let n=this.session,r=n.records.get(t);if(!r||r.isLocal||r.isBot||(e.health!=null&&(r.health=f(w(e.health,r.health,0,r.maxHealth),0,r.maxHealth)),e.ping!=null&&(r.ping=w(e.ping,r.ping,0,5e3)),e.dead||!r.alive))return;let i=n.parsePosition(e.pos);i&&r.pos.copy(i),r.yaw=w(e.yaw,r.yaw),r.pitch=w(e.pitch,r.pitch,-1.5,1.5),r.crouch=!!e.crouch,typeof e.weapon==`string`&&n.getWeaponDef(e.weapon)&&(r.weaponId=e.weapon),r.moving=!!e.moving,r.vel.set(0,0,0),r.missedSnapshots=0}handleSnapshot(e){let t=this.session,n=this.room;if(!n||n.isHost||!e)return;let r=new Set,i=t.localRecord;typeof e.time==`number`&&(t.matchTime=Math.max(0,e.time)),t.remoteDeployed=!!e.deployed;for(let n of e.players||[]){if(!n?.id)continue;r.add(n.id);let e=t.parsePosition(n.pos);if(n.id===t.localId){if(i&&!i.alive){let r=w(n.respawnRemaining,0,0,30);i.respawnRemaining=Math.max(0,r),n.alive&&t._reviveLocal(e||i.pos,w(n.yaw,i.yaw))}continue}let a=t.records.get(n.id);if(a||=t.addGuestRecord({id:n.id,name:n.name||`PLAYER`,color:n.color}),!a||a.isLocal)continue;e&&(a.pos.distanceToSquared(e)>36?a.pos.copy(e):a.pos.lerp(e,.5)),a.yaw=w(n.yaw,a.yaw),a.pitch=w(n.pitch,a.pitch,-1.5,1.5),a.crouch=!!n.crouch,typeof n.weapon==`string`&&t.getWeaponDef(n.weapon)&&(a.weaponId=n.weapon),a.health=f(w(n.health,a.health,0,100),0,a.maxHealth),a.kills=w(n.kills,a.kills,0,99999),a.deaths=w(n.deaths,a.deaths,0,99999),a.missedSnapshots=0,n.ping!=null&&(a.ping=w(n.ping,a.ping,0,5e3));let o=n.alive!==!1;o!==a.alive&&(a.alive=o,a.health=o?a.health:0,a.avatar?.setAlive(o)),a.avatar?.setHealth(a.health)}for(let e of[...t.records.values()])e.isLocal||e.isBot||r.has(e.id)||(e.missedSnapshots=(e.missedSnapshots||0)+1,e.missedSnapshots>=ym&&t.removePlayer(e.id,{notify:!0}));if(Number.isFinite(n.ping)){let e=t.records.get(`host`);e&&(e.ping=Math.round(n.ping))}this._syncPickups(e.pickups)}handleLoadout(e,t){let n=this.session;if(!n.isAuthority)return;let r=n.records.get(t),i=n.getWeaponDef(e?.weaponId);r&&i&&(r.weaponId=i.id)}_syncPickups(e){let t=this.session;if(!t.stage?.pickups?.length)return;let n=new Set(Array.isArray(e)?e:[]);for(let e of t.stage.pickups){let t=!n.has(e.id);e.available!==t&&(e.available=t,e.group.visible=t,t&&(e.group.scale.setScalar(1),e.respawnAt=0))}}handleProjectile(e){let t=this.session;t.projectiles&&e&&(e.action===`spawn`?t.projectiles.spawnRemote({id:e.id,ownerId:e.ownerId??e.from,origin:e.origin,dir:e.dir,weapon:e.weapon}):e.action===`explode`&&Array.isArray(e.pos)&&t.projectiles.detonateRemote(e.id,e.pos))}handleHit(e,t){let n=this.session;if(!n.isAuthority)return;let r=n.records.get(t),i=n.records.get(e.targetId);if(!r?.alive||!i?.alive||r===i)return;let a=n.getWeaponDef(e.weaponId);if(!a)return;let o=Math.max(1,a.pellets??1),s=a.damage*o*Math.max(1,a.headshotMult??1)+(a.projectile?.splashDamage??0),c=f(w(e.amount,0,0,999),0,Math.ceil(s));if(c<=0||r.pos.distanceTo(i.pos)>(a.range??60)+(a.projectile?.splashRadius??0)+8)return;let l=e.cause===`splash`?`splash`:e.cause===`projectile`?`projectile`:`weapon`;n.applyDamage(i.id,c,r.id,l,{weaponId:a.id,headshot:!!e.headshot})}handleHazard(e,t){let n=this.session;if(!n.isAuthority)return;let r=n.records.get(t);if(!r?.alive)return;let i=e.kind===`laser`?`laser`:e.kind===`splash`?`splash`:`fall`,a=i===`fall`?999:f(w(e.amount,0,0,200),0,200);a<=0||n.applyDamage(r.id,a,null,i,{weaponName:i===`laser`?`LASER FENCE`:i===`splash`?`SELF-DAMAGE`:`VOID`})}handleHealRequest(e,t){let n=this.session;if(!n.isAuthority)return;let r=n.records.get(t);if(!r?.alive||r.health>=r.maxHealth||n.time<(r._pickupBlockUntil||0))return;let i=n.stage.pickups.find(t=>t.id===e.pickupId&&t.available);if(!i||!n._nearPickup(r,i))return;let a=n._applyHeal(r,i);r._pickupBlockUntil=n.time+.8,a>0&&n.room?.sendTo(t,{t:I.HEAL,targetId:t,amount:Math.round(a*10)/10,health:Math.round(r.health*10)/10,pickupId:i.id})}},Cm=class{constructor(e){this.def=e,this.slot=e.slot,this.id=e.id,this.ammo=e.magSize,this.reserve=e.reserveMax,this.reloading=!1,this.reloadRemaining=0,this.cooldown=0,this.heat=0,this.shotCount=0,this.lastShotAt=-1}get isReloading(){return this.reloading}get isFull(){return this.ammo>=this.def.magSize}get hasReserve(){return this.reserve===1/0||this.reserve>0}get reloadProgress(){return this.reloading?f(1-this.reloadRemaining/this.def.reloadTime,0,1):0}get ammoFraction(){return this.def.magSize>0?this.ammo/this.def.magSize:0}get canReload(){return!this.reloading&&this.ammo<this.def.magSize&&this.hasReserve}update(e){let t={reloadCompleted:!1,reloadStarted:!1};return this.cooldown>0&&(this.cooldown=Math.max(0,this.cooldown-e)),this.heat>0&&(this.heat=Math.max(0,this.heat-e*3.2)),this.reloading&&(this.reloadRemaining-=e,this.reloadRemaining<=0&&(this._finishReload(),t.reloadCompleted=!0)),t}startReload(){return this.canReload?(this.reloading=!0,this.reloadRemaining=this.def.reloadTime/Math.max(.1,this.def.reloadSpeedBonus??1),!0):!1}cancelReload(){return this.reloading?(this.reloading=!1,this.reloadRemaining=0,!0):!1}_finishReload(){let e=this.def.magSize-this.ammo;if(this.reserve===1/0)this.ammo=this.def.magSize;else{let t=Math.min(e,this.reserve);this.ammo+=t,this.reserve-=t}this.reloading=!1,this.reloadRemaining=0}consumeShot(){return this.ammo<=0?!1:(--this.ammo,this.cooldown=this.def.fireInterval,this.heat=1,this.shotCount+=1,this.lastShotAt=performance.now()/1e3,!0)}refill(){this.ammo=this.def.magSize,this.reserve=this.def.reserveMax,this.reloading=!1,this.reloadRemaining=0,this.cooldown=0,this.heat=0}getSpread({aiming:e=!1,moveSpeed:t=0,airborne:n=!1,crouching:r=!1}={}){let i=e?this.def.spreadAim:this.def.spreadHip,a=f(t/10,0,1.4);return i*=1+a*(this.def.moveSpread??1.4),n&&(i*=this.def.airSpread??2),r&&(i*=this.def.crouchSpread??.72),i}getDamage(e,t=!1){let n=this.def.damage,r=this.def.falloff;if(r&&e>r.start){let t=f((e-r.start)/Math.max(.001,r.end-r.start),0,1);n*=1+(r.min-1)*t}return t&&(n*=this.def.headshotMult),n}getMaxDamagePerShot(){let e=this.def.pellets??1,t=this.def.damage*e*Math.max(1,this.def.headshotMult),n=this.def.projectile?.splashDamage??0;return Math.ceil(t+n)}snapshotAmmo(){return{ammo:this.ammo,reserve:this.reserve===1/0?-1:this.reserve}}resetCooldown(){this.cooldown=0}},wm=new class{constructor(){this.defs=new Map}register(e){if(!e?.id)throw Error(`Weapon definition requires an id`);if(this.defs.has(e.id))throw Error(`Weapon "${e.id}" already registered`);for(let t of[`name`,`slot`,`type`,`damage`,`magSize`,`reserveMax`,`fireInterval`,`reloadTime`])if(e[t]==null)throw Error(`Weapon "${e.id}" is missing "${t}"`);if(![`hitscan`,`projectile`].includes(e.type))throw Error(`Weapon "${e.id}" has invalid type`);let t={pellets:1,headshotMult:1.5,spreadHip:.01,spreadAim:.004,range:60,auto:!1,color:`#00f6ff`,classLabel:e.type.toUpperCase(),icon:`✦`,recoil:{pitch:.008,yaw:.002,kick:.025,recover:12},...e};return this.defs.set(e.id,t),t}get(e){return this.defs.get(e)}list(){return[...this.defs.values()].sort((e,t)=>e.slot-t.slot)}ids(){return this.list().map(e=>e.id)}createInstance(e){let t=this.defs.get(e);return t?new Cm(t):null}createLoadout(){return this.list().map(e=>new Cm(e))}},Tm=new Map;function Y(e=1317932,{metalness:t=.65,roughness:n=.42,emissive:r=0,emissiveIntensity:i=0,flat:a=!0}={}){let o=`${e}-${t}-${n}-${r}-${i}-${a}`;if(Tm.has(o))return Tm.get(o);let s=new fc({color:e,metalness:t,roughness:n,emissive:r,emissiveIntensity:i,flatShading:a});return Tm.set(o,s),s}function Em(e=63231,t=1,n=!1){let r=`glow-${e}-${t}-${n}`;if(Tm.has(r))return Tm.get(r);let i=new Qo({color:e,transparent:t<1||n,opacity:t,blending:n?2:1,depthWrite:!n,toneMapped:!1});return Tm.set(r,i),i}function X(e,t,n,r,i=0,a=0,o=0){let s=new W(new G(e,t,n),r);return s.position.set(i,a,o),s}function Dm(e,t,n,r,i=8){return new W(new Ws(e,t,n,i),r)}function Om(e=[.31,-.29,-.58]){let t=new H;t.position.set(...e),t.rotation.order=`YXZ`;let n=new H;return t.add(n),t.userData.pivot=n,t}function km(e,t,n,r,i=null){let a=new _a;return a.position.set(t,n,r),(i||e.userData.pivot||e).add(a),e.userData.muzzle=a,a}function Am(e,t,n,r,i,a=[0,0,0]){let o=new H;o.position.set(n,r,i),o.rotation.set(...a);let s=X(.075,.085,.11,e,0,0,0);o.add(s);let c=X(.08,.045,.115,t,0,.055,-.005);o.add(c);let l=X(.075,.065,.045,t,0,.02,-.075);o.add(l);let u=X(.082,.007,.06,Em(63231,.9),0,.075,.02);return o.add(u),o}function jm(e,t,n){return e.userData.parts||(e.userData.parts={}),e.userData.parts[t]=n,n}var Mm=725536,Nm=2503756,Pm={id:`pulse`,name:`PULSE-9`,slot:1,type:`hitscan`,classLabel:`PULSE / AUTO`,description:`エネルギー弾を連射する万能兵器。予備弾薬は無限。`,damage:16,headshotMult:1.8,fireInterval:.145,auto:!0,pellets:1,spreadHip:.0075,spreadAim:.0022,moveSpread:1.7,airSpread:2.1,crouchSpread:.75,magSize:14,reserveMax:1/0,reloadTime:1.05,range:70,color:`#00f6ff`,accent:63231,icon:`✦`,zoomFov:68,recoil:{pitch:.0065,yaw:.0022,kick:.022,recover:16},hitParticles:7666687,buildModel(){let e=Om([.29,-.27,-.56]),t=e.userData.pivot,n=X(.115,.105,.31,Y(Mm),0,0,-.08);t.add(n);let r=X(.085,.055,.27,Y(Nm,{metalness:.8}),0,.065,-.135);t.add(r);let i=X(.13,.028,.14,Y(1516600),0,.035,-.26);t.add(i);let a=Dm(.024,.026,.3,Y(3754595,{metalness:.9,roughness:.25}),10);a.rotation.x=Math.PI/2,a.position.set(0,.01,-.33),t.add(a);let o=new W(new tc(.042,.007,6,18),Em(63231,.95));o.position.set(0,.01,-.265),t.add(o);let s=o.clone();s.position.z=-.345,s.scale.setScalar(.85),t.add(s);let c=X(.012,.016,.22,Em(63231,.85),-.062,.025,-.13),l=c.clone();l.position.x=.062,t.add(c,l);let u=X(.03,.035,.08,Y(1712948),0,.1,-.17);t.add(u);let d=X(.012,.012,.008,Em(16722902),0,.115,-.212);t.add(d);let f=X(.072,.17,.075,Y(1054759),0,-.125,.035);f.rotation.x=-.2,t.add(f);let p=X(.07,.12,.085,Y(1647415),0,-.105,-.1);p.rotation.x=.08,t.add(p);let m=X(.072,.018,.087,Em(63231,.7),0,-.065,-.1);t.add(m),jm(e,`magazine`,p),jm(e,`magazineGlow`,m);let h=Am(Y(1383723),Y(528667),.018,-.15,.055,[.12,0,0]);return t.add(h),km(e,0,.01,-.485),e.userData.muzzleColor=7666687,e}},Fm=659484,Im=2372169,Lm={id:`volt`,name:`VOLT-AR`,slot:2,type:`hitscan`,classLabel:`VOLT / FULL AUTO`,description:`高レートのアサルトライフル。中距離の撃ち合いに強い。`,damage:11.5,headshotMult:1.75,fireInterval:.098,auto:!0,pellets:1,spreadHip:.013,spreadAim:.0045,moveSpread:2,airSpread:2.4,crouchSpread:.72,magSize:30,reserveMax:150,reloadTime:1.45,range:78,color:`#a6ff4d`,accent:10944333,icon:`≋`,zoomFov:66,recoil:{pitch:.0075,yaw:.0032,kick:.03,recover:13},hitParticles:12910458,buildModel(){let e=Om([.3,-.29,-.58]),t=e.userData.pivot,n=X(.105,.12,.42,Y(Fm),0,0,-.08);t.add(n);let r=X(.06,.03,.5,Y(Im,{metalness:.85}),0,.078,-.1);t.add(r);let i=X(.09,.085,.23,Y(1450292),0,-.005,-.35);t.add(i);let a=Dm(.019,.02,.32,Y(4872818,{metalness:.9,roughness:.25}),8);a.rotation.x=Math.PI/2,a.position.set(0,.015,-.47),t.add(a);let o=X(.065,.06,.075,Y(2701131),0,.015,-.61);t.add(o);let s=X(.068,.016,.03,Em(10944333,.75),0,.03,-.63);t.add(s);for(let e=0;e<4;e++){let n=X(.012,.012,.022,Em(10944333,.8),-.048,-.005,-.28-e*.055),r=n.clone();r.position.x=.048,t.add(n,r)}let c=X(.014,.012,.34,Em(63231,.7),0,.098,-.13);t.add(c);let l=X(.055,.055,.1,Y(1911100),0,.115,-.04);t.add(l);let u=X(.035,.03,.004,Em(63231,.6),0,.12,-.092);t.add(u);let d=X(.075,.17,.1,Y(1845049),0,-.145,-.06);d.rotation.x=-.12,t.add(d);let f=X(.078,.014,.104,Em(10944333,.8),0,-.08,-.06);t.add(f),jm(e,`magazine`,d),jm(e,`magazineGlow`,f);let p=X(.075,.11,.18,Y(1186601),0,-.015,.2);t.add(p);let m=X(.078,.012,.14,Em(63231,.45),0,.045,.2);t.add(m);let h=X(.068,.16,.075,Y(1054759),0,-.13,.1);h.rotation.x=-.25,t.add(h);let g=Am(Y(1383723),Y(528667),.018,-.16,.12,[.14,0,0]);t.add(g);let _=Am(Y(1383723),Y(528667),-.005,-.12,-.33,[.1,0,-.28]);return _.scale.setScalar(.82),t.add(_),km(e,0,.015,-.66),e.userData.muzzleColor=12910458,e}},Rm=1313305,zm=3810623,Bm={id:`scatter`,name:`SCATTER-12`,slot:3,type:`hitscan`,classLabel:`SCATTER / 8 PELLET`,description:`8発のペレットを拡散射撃。近距離では圧倒的。`,damage:10.5,headshotMult:1.5,fireInterval:.82,auto:!1,pellets:8,spreadHip:.058,spreadAim:.042,moveSpread:.9,airSpread:1.25,crouchSpread:.82,magSize:6,reserveMax:36,reloadTime:2.05,range:36,falloff:{start:8,end:30,min:.42},color:`#ff2bd6`,accent:16722902,icon:`⁂`,zoomFov:74,recoil:{pitch:.032,yaw:.005,kick:.075,recover:9},hitParticles:16744677,buildModel(){let e=Om([.3,-.3,-.56]),t=e.userData.pivot,n=X(.13,.13,.3,Y(Rm),0,0,.02);t.add(n);let r=X(.115,.055,.34,Y(zm,{metalness:.75}),0,.075,-.04);t.add(r);let i=Dm(.028,.028,.38,Y(2827061,{metalness:.95,roughness:.2}),10);i.rotation.x=Math.PI/2,i.position.set(-.032,.035,-.29),t.add(i);let a=i.clone();a.position.x=.032,t.add(a);let o=new W(new tc(.043,.006,6,16),Em(16722902,.85));o.position.set(0,.035,-.43),t.add(o);let s=X(.16,.075,.18,Y(2431534),0,-.025,-.25);t.add(s);let c=X(.162,.012,.12,Em(16722902,.7),0,.018,-.25),l=c.clone();l.position.y=-.066,t.add(c,l),jm(e,`pump`,s),jm(e,`pumpStrips`,c),jm(e,`pumpStrips2`,l);let u=Dm(.022,.022,.3,Y(3286336),8);u.rotation.x=Math.PI/2,u.position.set(0,-.065,-.31),t.add(u);let d=X(.082,.14,.21,Y(1774370),0,-.035,.27);d.rotation.x=.08,t.add(d);let f=X(.07,.15,.08,Y(1248793),0,-.13,.16);f.rotation.x=-.25,t.add(f);let p=X(.017,.045,.06,Em(16762967,.8),-.09,-.02,.06);t.add(p);let m=p.clone();m.position.x=-.065,t.add(m);let h=Am(Y(1774627),Y(656912),.015,-.16,.17,[.12,0,0]);t.add(h);let g=Am(Y(1774627),Y(656912),-.005,-.095,-.25,[.18,0,.05]);return g.scale.setScalar(.86),t.add(g),km(e,0,.035,-.49),e.userData.muzzleColor=16744677,e}},Vm=723736,Hm={id:`rail`,name:`RAIL-7`,slot:4,type:`hitscan`,classLabel:`RAIL / PIERCE`,description:`壁を貫かない超高威力ビーム。最大2体を貫通する。`,damage:78,headshotMult:2.1,fireInterval:1.02,auto:!1,pellets:1,pierce:2,spreadHip:.0018,spreadAim:2e-4,moveSpread:2.2,airSpread:3,crouchSpread:.75,magSize:4,reserveMax:16,reloadTime:2.2,range:110,color:`#a78bff`,accent:10980351,icon:`⟁`,zoomFov:48,recoil:{pitch:.02,yaw:.002,kick:.05,recover:8},hitParticles:13350655,buildModel(){let e=Om([.3,-.27,-.62]),t=e.userData.pivot,n=X(.08,.095,.5,Y(Vm),0,0,-.06);t.add(n);let r=Dm(.021,.025,.55,Y(4210782,{metalness:.92,roughness:.2}),10);r.rotation.x=Math.PI/2,r.position.set(0,.02,-.42),t.add(r);let i=[];for(let e=0;e<4;e++){let n=new W(new tc(.048,.007,5,20),Em(10980351,.9));n.position.set(0,.02,-.24-e*.11),i.push(n),t.add(n)}e.userData.coils=i;let a=X(.018,.018,.46,Em(63231,.85),0,.079,-.1);t.add(a);let o=X(.014,.07,.18,Y(1842224),-.052,.02,.1);o.rotation.z=-.14;let s=o.clone();s.position.x=.052,s.rotation.z=.14,t.add(o,s);let c=X(.062,.062,.22,Y(1513258),0,.115,-.02);t.add(c);let l=X(.04,.04,.005,Em(10980351,.8),0,.115,-.132);t.add(l);let u=l.clone();u.position.z=.092,t.add(u);let d=new W(new tc(.034,.006,5,16),Em(63231,.75));d.position.set(0,.115,-.128),t.add(d);let f=X(.07,.13,.24,Y(1184288),0,-.025,.28);t.add(f);let p=X(.073,.01,.2,Em(10980351,.6),0,.039,.28);t.add(p);let m=X(.055,.13,.1,Y(1776432),0,-.11,-.02);t.add(m);let h=X(.01,.09,.07,Em(63231,.8),.03,-.11,-.02);t.add(h),jm(e,`magazine`,m),jm(e,`magazineGlow`,h);let g=X(.065,.16,.08,Y(855320),0,-.132,.1);g.rotation.x=-.22,t.add(g);let _=Am(Y(1579044),Y(526352),.018,-.17,.11,[.12,0,0]);t.add(_);let v=Am(Y(1579044),Y(526352),-.002,-.11,-.23,[.12,0,-.15]);return v.scale.setScalar(.82),t.add(v),km(e,0,.02,-.71),e.userData.muzzleColor=14206719,e}},Um=1314827,Wm=3944221,Gm={id:`nova`,name:`NOVA-6`,slot:5,type:`projectile`,classLabel:`NOVA / ROCKET`,description:`直撃と範囲爆発を併せ持つロケットランチャー。自爆注意。`,damage:55,headshotMult:1.2,fireInterval:.92,auto:!1,pellets:1,spreadHip:.006,spreadAim:.002,moveSpread:.8,airSpread:1.1,crouchSpread:.8,magSize:2,reserveMax:10,reloadTime:2.35,range:120,color:`#ffb347`,accent:16757575,icon:`⊙`,zoomFov:72,recoil:{pitch:.028,yaw:.004,kick:.06,recover:8},projectile:{speed:38,radius:.12,gravity:2.4,ttl:6,splashDamage:58,splashRadius:4.2,splashKnockback:9,selfDamageScale:.55,directKnockback:5},hitParticles:16761446,buildModel(){let e=Om([.31,-.3,-.58]),t=e.userData.pivot,n=Dm(.092,.1,.58,Y(Um,{metalness:.55,roughness:.5}),12);n.rotation.x=Math.PI/2,n.position.set(0,.03,-.16),t.add(n);let r=new W(new tc(.092,.011,6,22),Em(16757575,.9));r.position.set(0,.03,-.45),t.add(r);let i=r.clone();i.position.z=.11,i.scale.setScalar(.94),t.add(i);let a=X(.045,.025,.34,Y(Wm),0,.13,-.18);t.add(a);let o=X(.05,.05,.08,Y(1774861),0,.155,-.03);t.add(o);let s=X(.032,.028,.004,Em(63231,.65),0,.157,-.073);t.add(s);let c=X(.008,.018,.34,Em(16757575,.75),-.088,.03,-.16),l=c.clone();l.position.x=.088,t.add(c,l);let u=Dm(.085,.085,.16,Y(2234639),10);u.rotation.z=Math.PI/2,u.position.set(.09,-.055,-.04),t.add(u);let d=new W(new tc(.062,.007,5,18),Em(16757575,.7));d.rotation.y=Math.PI/2,d.position.set(.175,-.055,-.04),t.add(d),jm(e,`drum`,u),jm(e,`drumGlow`,d);let f=X(.055,.17,.075,Y(1248776),0,-.13,.03);f.rotation.x=-.18,t.add(f);let p=X(.06,.13,.07,Y(1248776),0,-.1,-.33);p.rotation.x=.22,t.add(p);let m=X(.07,.14,.16,Y(1708810),0,0,.25);t.add(m);let h=Am(Y(1906190),Y(657157),.02,-.165,.05,[.12,0,0]);t.add(h);let g=Am(Y(1906190),Y(657157),0,-.15,-.33,[.1,0,.2]);return g.scale.setScalar(.85),t.add(g),km(e,0,.03,-.5),e.userData.muzzleColor=16765066,e}},Km=!1;function qm(){return Km||(Km=!0,[Pm,Lm,Bm,Hm,Gm].forEach(e=>wm.register(e))),wm}var Jm=1/60,Ym=5,Xm=3.4,Zm=1,Qm=100;function $m(e,t=`#00f6ff`){return/^#[0-9a-f]{6}$/i.test(String(e??``))?String(e).toLowerCase():t}function eh(e){return Math.atan2(Math.sin(e),Math.cos(e))}var th=class{constructor({canvas:e,room:t=null,practice:n=!1,settings:r,audio:i,localName:a=`PLAYER`,localId:o=null,roomCode:s=null,initialPlayers:c=[],weaponId:l=null}){this.canvas=e,this.room=t,this.practice=!!n,this.settings=r,this.audio=i,this.localName=_(a),this.roomCode=String(s||t?.code||(n?`SOLO`:`----`)).toUpperCase(),this.modeLabel=n?`PRACTICE // BOTS`:t?.isHost?`HOST // P2P`:`CLIENT // P2P`,this.localId=o||(n?`local`:t?.isHost?`host`:`guest`),this.isAuthority=n||!!t?.isHost,this.onMatchStart=null,this.matchStartRequested=!1,this.registry=qm(),this.loadout=[],this.weapon=this.registry.createInstance(l)||this.registry.createInstance(`pulse`),this.weapon&&this.loadout.push(this.weapon),this.weaponId=this.weapon?.id??`pulse`,this.records=new Map,this.bots=[],this.botControllers=new Map,this._botSeq=0,this._colorIndex=0,this._pickupCooldown=0,this._triggerBox=new Va,this._shakeOffset=new B,this._eyeDamp=1.66,this._bobPhase=0,this._landDip=0,this._lastFrame=0,this._accumulator=0,this._frameHandle=0,this._width=1280,this._height=720,this._composerAttempted=!1,this._bloomEnabled=!1,this._disposed=!1,this.time=0,this.matchTime=0,this.deployed=!1,this.paused=!1,this.running=!1,this.aiming=!1,this.crosshairTarget=!1,this.fps=60,this.localDeath=null;let u=$m(c.find(e=>e.id===this.localId)?.color,this.nextPlayerColor());this.renderer=new Lf({canvas:e,antialias:r?.get(`quality`)!==`low`,powerPreference:`high-performance`,stencil:!1}),this.renderer.setClearColor(197130,1),this.renderer.outputColorSpace=Ar,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.18,this.scene=new Ea,this.camera=new qc(r?.get(`fov`)??82,1,.05,420),this.camera.rotation.order=`YXZ`,this.physics=new Pp,this.effects=new Rp(this.scene),this.ctx={scene:this.scene,renderer:this.renderer,camera:this.camera,physics:this.physics,session:this,stage:null,materials:null},this.stage=new bp().init(this.ctx),this.projectiles=new Vp(this),this.viewModel=new Hp({renderer:this.renderer,weaponRegistry:this.registry,settings:this.settings}),this.viewModel.setWeapon(this.weaponId),this.input=new nm({canvas:e}),this.combat=new gm(this),this.localRecord=this._createRecord({id:this.localId,name:this.localName,color:u,isLocal:!0}),this._spawnRecord(this.localRecord,{silent:!0,initial:!0}),this._eyeDamp=Mp(this.localRecord.body);for(let e of c){if(!e?.id||e.id===this.localId||this.records.has(e.id))continue;let t=this._createRecord({id:e.id,name:e.name,color:e.color,weaponId:e.weapon||e.weaponId,isBot:!1});this._spawnRecord(t,{silent:!0,initial:!0})}if(this.practice){let e=sm(this,3);for(let t of e)this.bots.push(t),this.botControllers.set(t.record.id,t)}else if(!this.isAuthority)for(let e of this.stage.pickups)e.remoteControlled=!0,e.available=!1,e.group.visible=!1;this.net=new Sm(this),this.hud=new Qp(this),this._resizeHandler=()=>this.resize(),window.addEventListener(`resize`,this._resizeHandler),this._settingsOff=this.settings?.on(`change`,e=>{e===`quality`&&this.applyQuality()}),this.applyQuality(),this.resize()}playerCount(){let e=0;for(let t of this.records.values())t.isBot||(e+=1);return e}nextPlayerColor(){let e=T[this._colorIndex%T.length];return this._colorIndex+=1,e}_createRecord({id:e,name:t,color:n,weaponId:r=null,isLocal:i=!1,isBot:a=!1}){let o={id:String(e),name:_(t),color:$m(n,T[0]),isLocal:!!i,isBot:!!a,alive:!0,health:Qm,maxHealth:Qm,kills:0,deaths:0,pos:new B,vel:new B,yaw:0,pitch:0,crouch:!1,grounded:!1,moving:!1,respawnAt:0,respawnRemaining:0,invulnerableUntil:0,weaponId:(i?this.weaponId:r)||`pulse`,ping:null,missedSnapshots:0,body:null,avatar:null};return this.records.set(o.id,o),(i||a)&&(o.body=Np({position:new B(0,.05,0),yaw:0}),o.body.recordId=o.id,o.body.gimmickCooldowns=new Map),i||(o.avatar=new Yp({id:o.id,name:o.name,color:o.color,isBot:a}),o.avatar.group.visible=!1,this.scene.add(o.avatar.group)),o}_spawnRecord(e,{silent:t=!1,initial:n=!1}={}){let r=[];for(let t of this.records.values())t!==e&&t.alive&&r.push(t.pos);let i=this.stage.pickSpawn(r);e.pos.copy(i.pos),e.vel.set(0,0,0),e.yaw=i.yaw,e.pitch=0,e.crouch=!1,e.grounded=!1,e.moving=!1,e.alive=!0,e.health=Qm,e.respawnAt=0,e.respawnRemaining=0,e.invulnerableUntil=this.time+Zm,e.missedSnapshots=0;let a=e.body;if(a&&(a.pos.copy(e.pos),a.vel.set(0,0,0),a.yaw=e.yaw,a.pitch=0,a.crouch=!1,a.grounded=!1,a.groundSolid=null,a.coyote=0,a.jumpBuffer=0,a.gravityScale=1,a.updraft=0,a.jumpScale=1,a.gimmickCooldowns?.clear()),e.avatar&&(e.avatar.deathTime=0,e.avatar.setAlive(!0),e.avatar.setCrouch(!1),e.avatar.setHealth(Qm),e.avatar.group.visible=!0,e.avatar.group.position.copy(e.pos),e.avatar.group.rotation.set(0,e.yaw,0)),e.isLocal){for(let e of this.loadout)e.refill();this.localDeath=null,this.hud?.hideDeath(),this._eyeDamp=a?Mp(a):1.66}if(!t){let t=new U(e.color).getHex();this.effects.spawnBurst(e.pos,t),e.isLocal&&this.audio?.spawn()}return e}respawnRecord(e){this.isAuthority&&e&&(this._spawnRecord(e),this.botControllers.get(e.id)?.reset({pos:e.pos,yaw:e.yaw}),e.isLocal?this.hud?.showHint(`再展開 // 戦闘復帰`,1.6):this.room?.isHost&&!e.isBot&&this.room.sendTo(e.id,{t:I.RESPAWN,pos:[e.pos.x,e.pos.y,e.pos.z],yaw:e.yaw,health:Qm,time:this.matchTime}))}_reviveLocal(e,t=0,n=Qm){let r=this.localRecord;r.pos.copy(e),r.vel.set(0,0,0),r.yaw=eh(t),r.pitch=0,r.crouch=!1,r.grounded=!1,r.moving=!1,r.alive=!0,r.health=f(n,1,Qm),r.respawnAt=0,r.respawnRemaining=0,r.invulnerableUntil=this.time+Zm,r.missedSnapshots=0;let i=r.body;i&&(i.pos.copy(r.pos),i.vel.set(0,0,0),i.yaw=r.yaw,i.pitch=0,i.crouch=!1,i.grounded=!1,i.groundSolid=null,i.coyote=0,i.jumpBuffer=0,i.gravityScale=1,i.updraft=0,i.jumpScale=1,i.gimmickCooldowns?.clear(),this._eyeDamp=Mp(i));for(let e of this.loadout)e.refill();this.weapon?.cancelReload(),this.localDeath=null,this.hud?.hideDeath(),this.effects.spawnBurst(r.pos,new U(r.color).getHex()),this.audio?.spawn(),this._landDip=0,this._bobPhase=0}addGuestRecord({id:e,name:t,color:n,weaponId:r=`pulse`}){if(!e||this.records.has(e))return this.records.get(e)||null;let i=this._createRecord({id:e,name:t,color:n||this.nextPlayerColor(),weaponId:r,isBot:!1});return this._spawnRecord(i,{silent:!0}),i}addBot({name:e,color:t}){this._botSeq+=1;let n=this._createRecord({id:`bot_${this._botSeq}`,name:e,color:t||this.nextPlayerColor(),isBot:!0});return this._spawnRecord(n,{silent:!0,initial:!0}),n}removePlayer(e,{notify:t=!0}={}){let n=this.records.get(e);n&&!n.isLocal&&(n.avatar?.dispose(),this.records.delete(e),this.botControllers.delete(e),t&&this.hud?.showToast(`${n.name} が退出しました`,n.color,2200))}getRoster(){let e=[];for(let t of this.records.values())t.isBot||e.push({id:t.id,name:t.name,color:t.color,weapon:t.weaponId||`pulse`,kills:t.kills||0,deaths:t.deaths||0});return e}getWeaponDef(e){return this.registry.get(e)}setLocalWeapon(e){if(this.deployed)return!1;let t=this.registry.createInstance(e);return t?(t.id===this.weaponId||(this.weapon?.cancelReload(),this.loadout=[t],this.weapon=t,this.weaponId=t.id,this.localRecord.weaponId=t.id,this.viewModel?.setWeapon(t.id),this.hud?.refreshWeaponBar()),!0):!1}requestMatchStart(){return this.deployed||this.practice?!1:(this.matchStartRequested=!0,this.onMatchStart?.(),!0)}getDamageableTargets(e=null){let t=[];for(let n of this.records.values())n.alive&&n.id!==e&&t.push({state:n,record:n});return t}start(){return this.running||(this.running=!0,this.net.bind(),this.room&&this.room.markSessionReady(),this.input.setEnabled(!1),this._lastFrame=performance.now(),this._frameHandle=requestAnimationFrame(this._tick)),this}setDeployed(e=!0){let t=!!e;t!==this.deployed&&(this.deployed=t,this.matchTime=0,this._accumulator=0,this._lastFrame=performance.now(),this.deployed?(this.input.setEnabled(!0),this.hud?.showHint(this.practice?`演習開始 // BOTS ONLINE`:`戦闘開始 // 接続完了`,2.4)):this.input.setEnabled(!1))}setPaused(e){this.paused=!!e,this.paused?this.input.setEnabled(!1):this.deployed&&this.input.setEnabled(!0)}_tick=e=>{if(!this.running||this._disposed)return;let t=Math.max(0,(e-this._lastFrame)/1e3);this._lastFrame=e;let n=f(t,0,.1);t>0&&(this.fps=this.fps*.9+1/Math.max(t,1e-4)*.1);let r=!(this.paused&&this.practice),i=0;if(r){for(this._accumulator+=n;this._accumulator>=Jm&&i<Ym;)this.fixedUpdate(Jm),this._accumulator-=Jm,i+=1;i>=Ym&&(this._accumulator=0)}else this._accumulator=0;this.updateVisuals(n),this.hud?.update(n),this.viewModel.update(n,this.time,{reloading:this.weapon?.reloading,reloadProgress:this.weapon?.reloadProgress??0}),this.render(n),(i>0||!r)&&this.input.endFrame(),this.room?.update(),this._frameHandle=requestAnimationFrame(this._tick)};fixedUpdate(e){this._disposed||(this.time+=e,this.deployed&&(this.matchTime+=e),this.stage.update(e,this.time),this.deployed&&(this.localRecord.alive&&this._updateLocal(e),this.practice&&this._updateBots(e),this.projectiles.update(e)),this._updatePickups(e),this._updateRespawns(),this._updateTimers(e),this.net.update(e),this.combat.updateCrosshair(e),this.effects.update(e))}_updateLocal(e){let t=this.localRecord,n=t.body;if(!n)return;n.gravityScale=1,n.updraft=0,n.jumpScale=1;let r=this.input.takeLook(),i=this.settings?.get(`sensitivity`)??1;(r.x||r.y)&&(t.yaw=eh(t.yaw-r.x*.0022*i),t.pitch=f(t.pitch-r.y*.0022*i,-1.5,1.5),this.viewModel.addSway(r.x,r.y));let a=this.input.anyDown(`ControlLeft`,`ControlRight`);this.physics.setCrouch(n,a),n.yaw=t.yaw,n.pitch=t.pitch;let o=this.input.moveForward,s=this.input.moveRight,c=t.yaw,l=-Math.sin(c)*o+Math.cos(c)*s,u=-Math.cos(c)*o-Math.sin(c)*s,d=Math.hypot(l,u);d>1&&(l/=d,u/=d);let p=this.input.consumeKey(`Space`),m=this.input.anyDown(`ShiftLeft`,`ShiftRight`)&&!a;this._processTriggers(n,t,e),t.alive?(this.physics.moveBody(n,{wishX:l,wishZ:u,sprint:m,jumpPressed:p,carry:!0,noMove:!this.input.enabled},e),this._syncRecordFromBody(t),n.justJumped&&this.audio?.jump(),n.justLanded&&(this._landDip=Math.min(.09,n.landSpeed*.0035),this.effects.addShake(Math.min(.09,n.landSpeed*.0035)),n.landSpeed>6&&this.audio?.land()),t.pos.y<-12?this._fallOut(t):this.combat.updateLocal(e)):this._syncRecordFromBody(t)}_syncRecordFromBody(e){let t=e.body;t&&(e.pos.copy(t.pos),e.vel.copy(t.vel),e.yaw=t.yaw,e.pitch=t.pitch,e.crouch=t.crouch,e.grounded=t.grounded,e.moving=Math.hypot(t.vel.x,t.vel.z)>1.2)}switchWeapon(e){if(!this.loadout.length)return;let t=(e%this.loadout.length+this.loadout.length)%this.loadout.length,n=this.loadout[t];n&&n!==this.weapon&&(this.weapon?.cancelReload(),this.weapon=n,this.weaponId=n.id,this.localRecord.weaponId=n.id,this.viewModel.setWeapon(n.id),this.audio?.switchWeapon())}_updateBots(e){for(let t of this.botControllers.values()){let n=t.record;if(!n.alive||!n.body)continue;let r=n.body;r.gravityScale=1,r.updraft=0,r.jumpScale=1,r.gimmickCooldowns??=new Map,this._processTriggers(r,n,e),n.alive?(t.update(e,this.time),n.weaponId=t.weaponId,n.pos.y<-12&&this.applyDamage(n.id,999,null,`fall`,{weaponName:`VOID`})):n.pos.copy(r.pos)}}_processTriggers(e,t,n){if(!e||!t)return;let r=Ap(e.pos,e.radius,jp(e),this._triggerBox),i=this.physics.triggersAt(r);for(let t of i){let r=this.stage.getTriggerHandler(t.kind);if(r)try{r(e,t,{session:this,dt:n,time:this.time})}catch(e){console.warn(`[GameSession] trigger "${t.kind}" failed`,e)}}}_fallOut(e){e?.alive&&(this.isAuthority?this.applyDamage(e.id,999,null,`fall`,{weaponName:`VOID`}):(e.health=0,e.alive=!1,e.respawnAt=this.matchTime+Xm,e.respawnRemaining=Xm,this.localDeath={killerName:null,weaponName:`VOID`},this.hud?.showDeath(null,`VOID`),this.hud?.showDamage(100),this.audio?.death(),this.weapon?.cancelReload(),this.net.sendHazard({kind:`fall`})))}_updatePickups(e){if(this.stage?.pickups?.length){if(!this.isAuthority)this._requestGuestPickups();else for(let e of this.stage.pickups)if(e.available){for(let t of this.records.values())if(!(!t.alive||t.health>=t.maxHealth)&&(t.isLocal||t.isBot)&&this._nearPickup(t,e)){this._applyHeal(t,e);break}}}}_requestGuestPickups(){let e=this.localRecord;if(!(!e.alive||e.health>=e.maxHealth)&&!(this.time<this._pickupCooldown)){for(let t of this.stage.pickups)if(t.available&&this._nearPickup(e,t)){this._pickupCooldown=this.time+1.1,this.net.sendHeal(t.id);break}}}_nearPickup(e,t){let n=(t.radius??1.45)+.3,r=e.pos.x-t.pos.x,i=e.pos.z-t.pos.z;if(r*r+i*i>n*n)return!1;let a=t.pos.y-.6,o=t.pos.y+(t.height??1.6),s=e.pos.y,c=e.pos.y+(e.crouch?1.3:1.82);return s<o&&c>a}_applyHeal(e,t){if(!e?.alive||!t)return 0;let n=Math.min(t.amount??35,e.maxHealth-e.health);return n<=0?0:(e.health=f(e.health+n,0,e.maxHealth),e.avatar?.setHealth(e.health),t.available=!1,t.respawnAt=this.time+(t.respawn??16),t.group.visible=!1,this.effects.pickupBurst(new B(t.pos.x,t.pos.y,t.pos.z),10944333),e.isLocal&&(this.audio?.pickup(),this.hud?.showToast(`+${Math.round(n)} INTEGRITY`,`#a6ff4d`,1600),this.hud?.showHint(`体力回復 // INTEGRITY RESTORED`,1.5)),n)}_updateRespawns(){if(this.isAuthority)for(let e of this.records.values())e.alive||e.respawnAt>0&&this.matchTime>=e.respawnAt&&this.respawnRecord(e)}_updateTimers(e){for(let t of this.records.values())t.respawnRemaining=t.alive?0:this.isAuthority?Math.max(0,t.respawnAt-this.matchTime):Math.max(0,t.respawnRemaining-e)}applyDamage(e,t,n=null,r=`weapon`,i={}){let a=this.records.get(e);if(!a?.alive||r!==`fall`&&r!==`laser`&&this.time<(a.invulnerableUntil||0))return{applied:0,killed:!1};let o=f(Number(t)||0,0,999);if(o<=0)return{applied:0,killed:!1};let s=n?this.records.get(n):null,c=a.health;if(a.health=f(a.health-o,0,a.maxHealth),a.avatar?.setHealth(a.health),a.isLocal){let e=s?this._damageAngle(s.pos):null;this.hud?.showDamage(o,e),this.audio?.hurt(),this.effects.addShake(f(o*.004,.02,.2))}return this.room?.isHost&&!a.isLocal&&!a.isBot&&this.room.sendTo(a.id,{t:I.DAMAGE,targetId:a.id,attackerId:s?.id??null,amount:o,health:a.health,cause:r,weaponId:i.weaponId??null,headshot:!!i.headshot}),s?.isLocal&&s!==a&&(this.hud?.showHitmarker(!1),this.audio?.hitmarker(!1)),a.health<=0?(this._kill(a,s,r,i),{applied:c,killed:!0}):{applied:o,killed:!1}}applyOutgoingDamage(e,t,n,r={}){if(!e?.alive)return;let i=r.cause||`weapon`;this.isAuthority?this.applyDamage(e.id,t,r.attackerId||this.localId,i,{...r,weaponId:n}):(e.isLocal||(this.hud?.showHitmarker(!1),this.audio?.hitmarker(!1)),this.net.sendHit({targetId:e.id,amount:Math.round(f(t,0,999)*10)/10,weaponId:n,headshot:!!r.headshot,cause:i}))}_kill(e,t,n,r={}){if(!e?.alive)return;e.alive=!1,e.health=0,e.deaths=(e.deaths||0)+1,e.respawnAt=this.matchTime+Xm,e.respawnRemaining=Xm,e.body?.vel.set(0,0,0),e.avatar?.setAlive(!1),t&&t!==e&&(t.kills=(t.kills||0)+1);let i=r.weaponName;!i&&r.weaponId&&(i=this.getWeaponDef(r.weaponId)?.name),i||=n===`laser`?`LASER FENCE`:n===`fall`?`VOID`:n===`splash`||n===`projectile`?`EXPLOSIVE`:`ENVIRONMENT`;let a=t?.color??`#ff3b5c`,o={killerId:t?.id??null,killerName:t?.name??null,victimId:e.id,victimName:e.name,weaponName:i,headshot:!!r.headshot,color:a,respawnIn:Xm,killerKills:t?.kills??null,victimDeaths:e.deaths,cause:n};e.isLocal&&(this.localDeath={killerName:t?.name??null,weaponName:i},this.hud?.showDeath(t?.name??null,i),this.hud?.showDamage(100,t?this._damageAngle(t.pos):null),this.audio?.death(),this.weapon?.cancelReload(),this.effects.addShake(.14)),t?.isLocal&&(this.hud?.showHitmarker(!0),this.audio?.hitmarker(!0),this.hud?.showToast(`ELIMINATED ${e.name}`,t.color,1400)),this.hud?.addKill(o),this.room?.isHost&&this.room.broadcast({t:I.KILL,...o,weaponId:r.weaponId??null})}handleKillMessage(e){let t=this.records.get(e.victimId),n=e.killerId?this.records.get(e.killerId):null,r=w(e.respawnIn,Xm,0,20);t&&(t.alive=!1,t.health=0,t.deaths=w(e.victimDeaths,t.deaths+1,0,99999),t.respawnAt=this.matchTime+r,t.respawnRemaining=r,t.body?.vel.set(0,0,0),t.avatar?.setAlive(!1)),n&&e.killerKills!=null&&(n.kills=w(e.killerKills,n.kills,0,99999)),t?.isLocal&&(this.localDeath={killerName:e.killerName||null,weaponName:e.weaponName||null},this.hud?.showDeath(e.killerName||null,e.weaponName||null),this.hud?.showDamage(100),this.audio?.death(),this.weapon?.cancelReload(),this.effects.addShake(.14)),n?.isLocal&&(this.hud?.showHitmarker(!0),this.audio?.hitmarker(!0)),this.hud?.addKill({killerId:e.killerId,killerName:e.killerName,victimId:e.victimId,victimName:e.victimName,weaponName:e.weaponName,headshot:!!e.headshot,color:e.color||`#ff3b5c`})}handleDamageMessage(e){let t=this.records.get(e.targetId);if(!t)return;let n=t.health;if(t.health=typeof e.health==`number`?f(e.health,0,t.maxHealth):f(t.health-(Number(e.amount)||0),0,t.maxHealth),t.avatar?.setHealth(t.health),t.isLocal&&t.health!==n){let t=e.attackerId?this.records.get(e.attackerId):null;this.hud?.showDamage(Number(e.amount)||0,t?this._damageAngle(t.pos):null),this.audio?.hurt(),this.effects.addShake(f((Number(e.amount)||0)*.004,.015,.18))}}handleHealMessage(e){let t=this.localRecord;if(!t||e.targetId&&e.targetId!==this.localId)return;let n=t.health;t.health=f(typeof e.health==`number`?e.health:t.health+(e.amount||0),0,t.maxHealth);let r=this.stage.pickups.find(t=>t.id===e.pickupId);r&&(r.available=!1,r.group.visible=!1,r.respawnAt=this.time+(r.respawn??16)),t.health>n&&(this.effects.pickupBurst(t.pos.clone().add(new B(0,.9,0)),10944333),this.audio?.pickup(),this.hud?.showToast(`+${Math.round(t.health-n)} INTEGRITY`,`#a6ff4d`,1600),this.hud?.showHint(`体力回復 // INTEGRITY RESTORED`,1.5))}handleRespawnMessage(e){let t=this.parsePosition(e.pos);t&&this.localRecord&&this._reviveLocal(t,w(e.yaw,0),w(e.health,Qm,1,Qm))}parsePosition(e){if(!Array.isArray(e)||e.length<3)return null;let t=this.stage.bounds;return new B(f(w(e[0],0),t.minX-1,t.maxX+1),f(w(e[1],.05),-8,30),f(w(e[2],0),t.minZ-1,t.maxZ+1))}_damageAngle(e){let t=this.localRecord;if(!t||!e)return 0;let n=e.x-t.pos.x,r=e.z-t.pos.z,i=t.yaw,a=n*Math.cos(i)-r*Math.sin(i),o=-n*Math.sin(i)-r*Math.cos(i);return Math.atan2(a,o)}onJumpPad(e,t){let n=this.records.get(e?.recordId),r=t.data?.color??63231;this.effects.jumpPadBurst(new B(e.pos.x,e.pos.y+.18,e.pos.z),r),this.effects.addShake(.045),this.audio?.jumpPad(),n?.isLocal&&this.hud?.showHint(`ジャンプパッド // LAUNCH`,.9)}onTeleport(e,t,n,r){let i=this.records.get(e?.recordId);t&&this.effects.teleportBurst(t.clone(),r),n&&this.effects.teleportBurst(n.clone(),r),this.audio?.teleport(),i?.isLocal&&(this.hud?.showHint(`位相転移 // TELEPORT`,1),e&&(this._eyeDamp=Mp(e)))}damageSimulatedPlayer(e,t,n=`hazard`){let r=this.records.get(e?.recordId);if(!r?.alive)return;let i=f(w(t,0),0,200);this.isAuthority?this.applyDamage(r.id,i,null,n,{weaponName:n===`laser`?`LASER FENCE`:`HAZARD`}):(r.isLocal&&(r.health=f(r.health-i,0,r.maxHealth),this.hud?.showDamage(i),this.audio?.hurt(),this.effects.addShake(f(i*.004,.02,.16))),this.net.sendHazard({kind:n===`laser`?`laser`:`fall`}))}panFor(e){let t=this.localRecord;if(!t||!e)return 0;let n=e.x-t.pos.x,r=e.z-t.pos.z,i=Math.hypot(n,r);return i<.001?0:f((n*Math.cos(t.yaw)-r*Math.sin(t.yaw))/i,-1,1)}volumeFor(e,t=70){let n=this.localRecord;return!n||!e?.8:f(1-n.pos.distanceTo(e)/t,.1,1)}playExplosionAudio(e,t=!1){let n=this.localRecord?this.localRecord.pos.distanceTo(e):0;this.audio?.explosion({pan:this.panFor(e),volume:this.volumeFor(e,90),distant:!!t&&n>12})}netSendFire(e){this.net?.sendFire(e)}netSendProjectile(e){this.net?.sendProjectile(e)}botFire(e,t,n){this.combat?.botFire(e,t,n)}handleProjectileDamage(e,t,n){this.combat?.handleProjectileDamage(e,t,n)}updateVisuals(e){this._updateAvatars(e),this._updateCamera(e);let t=this.localRecord;t&&this.viewModel.setMove(Math.hypot(t.vel.x,t.vel.z),t.grounded)}_updateAvatars(e){for(let t of this.records.values()){let n=t.avatar;if(!n)continue;n.alive!==t.alive&&n.setAlive(t.alive),n.setCrouch(t.crouch),t.alive&&n.setHealth(t.health);let r=n.group;if(r.position.distanceToSquared(t.pos)>64)r.position.copy(t.pos);else{let n=1-Math.exp(-(t.isBot?30:20)*e);r.position.lerp(t.pos,n)}r.rotation.y=t.yaw,n.setCameraDistance(this.camera.position.distanceTo(r.position));let i=Math.hypot(t.vel.x,t.vel.z)||(t.moving?6:0);n.update(e,{time:this.time,speed:i,grounded:t.grounded,pitch:t.pitch,firing:!1})}}_updateCamera(e){let t=this.localRecord;if(!t)return;let n=t.body,r=t.alive&&n?Mp(n):.42;this._eyeDamp=m(this._eyeDamp,r,18,e);let i=Math.hypot(t.vel.x,t.vel.z);this._bobPhase+=e*(2.4+Math.min(i,12)*1.1),this._landDip=m(this._landDip,0,9,e),this.effects.getShakeOffset(this._shakeOffset);let a=f(i/8,0,1.3),o=t.alive&&t.grounded?Math.sin(this._bobPhase*2)*.012*a:0;this.camera.position.set(t.pos.x+this._shakeOffset.x*.07,t.pos.y+this._eyeDamp+o+this._shakeOffset.y*.05-this._landDip,t.pos.z+this._shakeOffset.z*.07);let s=this.weapon?.def,c=this.aiming&&t.alive&&s?.zoomFov?s.zoomFov:this.settings?.get(`fov`)??82;this.camera.fov=m(this.camera.fov,c,12,e),this.camera.updateProjectionMatrix(),this.camera.rotation.set(f(t.pitch+this._shakeOffset.y*.009,-1.52,1.52),t.yaw+this._shakeOffset.x*.012,this._shakeOffset.z*.006)}render(e){if(this.viewModel.setFov(this.camera.fov),this._bloomEnabled&&this.composer)try{this.composer.render()}catch(e){console.warn(`[GameSession] post-processing failed, falling back`,e),this._bloomEnabled=!1,this.renderer.render(this.scene,this.camera)}else this.renderer.render(this.scene,this.camera);this.viewModel.render()}resize(){let e=typeof this.canvas.getBoundingClientRect==`function`?this.canvas.getBoundingClientRect():{width:0,height:0},t=Math.round(this.canvas.clientWidth||e.width||window.innerWidth||1280),n=Math.round(this.canvas.clientHeight||e.height||window.innerHeight||720);(t<2||n<2)&&(t=1280,n=720),this._width=t,this._height=n,this.camera.aspect=t/n,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,n,!1),this.composer&&(this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.composer.setSize(t,n)),this.viewModel.resize(t,n,this.camera.fov)}applyQuality(){let e=this.settings?.get(`quality`)!==`low`,t=e?Math.min(window.devicePixelRatio||1,1.75):1;this.renderer.setPixelRatio(t),e&&this._ensureComposer(),this._bloomEnabled=!!(e&&this.composer),this.resize()}_ensureComposer(){if(!(this.composer||this._composerAttempted)){this._composerAttempted=!0;try{let e=new Kf(this.renderer);e.addPass(new qf(this.scene,this.camera));let t=new Yf(new z(this._width,this._height),.52,.55,.72);e.addPass(t),e.addPass(new Zf),this.composer=e,this.bloomPass=t}catch(e){console.warn(`[GameSession] post-processing unavailable`,e),this.composer=null,this.bloomPass=null}}}getDisplayPing(){return!this.room||this.room.isHost?null:Number.isFinite(this.room.ping)?this.room.ping:null}getScoreboardData(){let e=[...this.records.values()].map(e=>({id:e.id,name:e.name,color:e.color,kills:e.kills||0,deaths:e.deaths||0,alive:e.alive,isLocal:e.isLocal,isHost:!!(e.isLocal&&this.room?.isHost),isBot:e.isBot,ping:e.isLocal?this.getDisplayPing():e.ping}));return e.sort((e,t)=>t.kills-e.kills||e.deaths-t.deaths||e.name.localeCompare(t.name)),e}getRenderLabel(){let e=this.settings?.get(`quality`)===`low`?`LOW`:`HIGH`;return`${this.renderer.capabilities?.isWebGL2?`WEBGL2`:`WEBGL`} / ${e}`}dispose(){if(!this._disposed){this._disposed=!0,this.running=!1,cancelAnimationFrame(this._frameHandle),window.removeEventListener(`resize`,this._resizeHandler),this._settingsOff?.();try{document.pointerLockElement===this.canvas&&document.exitPointerLock?.()}catch{}this.net.dispose(),this.hud.dispose(),this.input.dispose(),this.viewModel.dispose(),this.projectiles.clear();for(let e of this.records.values())try{e.avatar?.dispose()}catch(e){console.warn(`[GameSession] avatar dispose failed`,e)}this.records.clear(),this.botControllers.clear(),this.bots.length=0,this.stage.dispose(),this.effects.dispose(),this.composer?.dispose?.(),this.composer=null,this.bloomPass=null,this.renderer.dispose?.(),this.scene.clear()}}},nh=4,rh=3,ih=600,ah=new Set([`timeout`,`connection-failed`,`connection-closed`,`host-not-found`,`signal-error`,`webrtc`]),oh=`neonstrike.name.v1`,sh=`neonstrike.weapon.v1`,Z=e=>document.getElementById(e),ch=new URLSearchParams(location.search);function lh(){try{return localStorage.getItem(oh)||``}catch{return``}}var uh=new ee,dh=new ie(uh),fh=qm();function ph(){try{let e=localStorage.getItem(sh);return fh.get(e)?e:`pulse`}catch{return`pulse`}}var Q={session:null,room:null,pendingRoom:null,connecting:!1,connectToken:0,phase:`menu`,name:_(ch.get(`name`)||lh()||`PLAYER`),netConfig:ne(),weaponId:ph(),lobbyTimer:null,toastTimer:null},$={menu:Z(`menu-screen`),lobby:Z(`lobby-screen`),game:Z(`game-screen`),name:Z(`input-name`),room:Z(`input-room`),roomCount:Z(`room-count`),status:Z(`menu-status`),statusText:Z(`menu-status`).querySelector(`span`),connectOverlay:Z(`connect-overlay`),connectKicker:Z(`connect-kicker`),connectTitle:Z(`connect-title`),connectDetail:Z(`connect-detail`),connectCancel:Z(`btn-connect-cancel`),lobbyCode:Z(`lobby-code`),lobbyRole:Z(`lobby-role`),lobbyMode:Z(`lobby-mode`),lobbyPlayerCount:Z(`lobby-player-count`),lobbyPlayers:Z(`lobby-players`),lobbyWeapons:Z(`lobby-weapons`),lobbyWeaponDetail:Z(`lobby-weapon-detail`),lobbyStart:Z(`btn-lobby-start`),lobbyLeave:Z(`btn-lobby-leave`),lobbyWait:Z(`lobby-wait`),lobbyCopy:Z(`btn-lobby-copy`),lobbyStatus:Z(`lobby-status`),pause:Z(`pause-menu`),pauseDesc:Z(`pause-desc`),pauseRoom:Z(`pause-room`),disconnect:Z(`disconnect-overlay`),disconnectReason:Z(`disconnect-reason`),death:Z(`death-overlay`),toast:Z(`toast`),toastText:Z(`toast-text`),settingsDialog:Z(`settings-dialog`),helpDialog:Z(`help-dialog`),btnHost:Z(`btn-host`),btnJoin:Z(`btn-join`),btnPractice:Z(`btn-practice`)};function mh(e,t=``){$.statusText.textContent=e,$.status.classList.toggle(`is-error`,t===`error`),$.status.classList.toggle(`is-ok`,t===`ok`)}function hh(e,t=`#00f6ff`,n=2400){e&&(clearTimeout(Q.toastTimer),$.toastText.textContent=e,$.toast.style.setProperty(`--toast-color`,t),$.toast.classList.add(`show`),Q.toastTimer=setTimeout(()=>$.toast.classList.remove(`show`),n))}function gh(e){for(let t of[$.btnHost,$.btnJoin,$.btnPractice])t.disabled=e}function _h(e,t,n){Q.connecting=!0,gh(!0),$.connectKicker.textContent=e,$.connectTitle.textContent=t,$.connectDetail.textContent=n,$.connectOverlay.classList.remove(`hidden`),$.connectCancel.classList.remove(`hidden`)}function vh(e){$.connectDetail.textContent=e}function yh(){Q.connecting=!1,gh(!1),$.connectOverlay.classList.add(`hidden`)}function bh(e){let t=e===`game`,n=e===`lobby`;$.game.classList.toggle(`hidden`,!t),$.lobby.classList.toggle(`hidden`,!n),$.menu.classList.toggle(`hidden`,t||n),document.body.classList.toggle(`in-game`,t),document.body.classList.toggle(`in-lobby`,n)}function xh(){let e=Q.session;e?.deployed&&($.pause.classList.remove(`hidden`),$.pauseRoom.textContent=`ROOM ${e.roomCode}`,$.pauseDesc.innerHTML=e.practice?`演習を一時停止しました。<br />再開するには下のボタンをクリックしてください。`:`戦闘は継続中です。<br />再開するには下のボタンをクリックしてください。`,e.setPaused(!0),e.hud?.setScoreboard(!1))}function Sh(){$.pause.classList.add(`hidden`)}function Ch(e){Q.session&&($.disconnectReason.textContent=e||`ホストとの接続が切れました。`,$.disconnect.classList.remove(`hidden`),Q.session.setPaused(!0),Q.session.input.setEnabled(!1))}function wh(){$.disconnect.classList.add(`hidden`)}function Th(){let e=Z(`game-canvas`),t=document.createElement(`canvas`);return t.id=`game-canvas`,e?e.replaceWith(t):$.game.prepend(t),t}function Eh(){if(Wh(),Q.session){try{Q.session.dispose()}catch(e){console.warn(`[NEONSTRIKE] session dispose failed`,e)}Q.session=null,window.__neonstrikeSession=null}}function Dh({room:e=null,practice:t=!1,code:n=`----`,initialPlayers:r=[],localId:i=null,weaponId:a=Q.weaponId}){Eh(),Sh(),wh(),$.death.classList.add(`hidden`);let o=Th(),s=new th({canvas:o,room:e,practice:t,settings:uh,audio:dh,localName:Q.name,localId:i,roomCode:n,initialPlayers:r,weaponId:a});return Q.session=s,window.__neonstrikeSession=s,e?.isHost&&Ph(e),s.start(),e&&!e.isHost&&s.net.sendLoadout(s.weaponId),o.addEventListener(`click`,()=>{if(s.deployed&&Q.session===s&&document.pointerLockElement!==o)try{let e=o.requestPointerLock?.();e?.catch&&e.catch(()=>{})}catch{}}),Q.phase=`lobby`,bh(`lobby`),Gh(),ch.get(`unlocked`)===`1`&&s.input.setUnlockedOverride(!0),s.onMatchStart=()=>Oh({requestLock:!1,directInput:!0}),s.matchStartRequested&&Oh({requestLock:!1,directInput:!0}),s}function Oh({requestLock:e=!0,directInput:t=!1}={}){let n=Q.session;n&&(Q.phase===`game`&&n.deployed||(Wh(),Q.phase=`game`,Sh(),wh(),bh(`game`),n.resize(),Ah({requestLock:e,directInput:t})))}function kh({requestLock:e=!0}={}){let t=Q.session;return!t||Q.phase!==`lobby`||!(t.practice||t.room?.isHost)?!1:(t.room?.isHost&&t.room.broadcast({t:I.MATCH_START}),Oh({requestLock:e}),!0)}function Ah({requestLock:e=!0,directInput:t=!1}={}){let n=Q.session;if(n&&(Sh(),dh.ensure(),dh.setVolume(),uh.get(`ambientAudio`)&&dh.startAmbient(),n.input.setEnabled(!0),n.setDeployed(!0),n.setPaused(!1),t&&!n.input.unlockedOverride&&(n.input.setUnlockedOverride(!0),hh(`MATCH START // クリックでマウスをロック`,`#a6ff4d`,3600)),e&&!n.input.unlockedOverride)){try{let e=n.canvas.requestPointerLock?.();e?.catch&&e.catch(()=>{})}catch{}setTimeout(()=>{Q.session&&Q.session===n&&n.deployed&&!n.input.unlockedOverride&&document.pointerLockElement!==n.canvas&&(n.input.setUnlockedOverride(!0),hh(`マウスロックを利用できません — 直接入力モードで続行`,`#ffc857`,3200))},800)}}function jh(){let e=Q.session;if(e?.deployed&&(xh(),document.pointerLockElement===e.canvas))try{document.exitPointerLock?.()}catch{}}function Mh(){let e=Q.session;if(e&&(Sh(),e.setPaused(!1),e.input.setEnabled(!0),!e.input.unlockedOverride))try{let t=e.canvas.requestPointerLock?.();t?.catch&&t.catch(()=>{})}catch{}}function Nh(){if(Eh(),Q.room){try{Q.room.close()}catch(e){console.warn(`[NEONSTRIKE] room close failed`,e)}Q.room=null}Q.pendingRoom?.close?.(),Q.pendingRoom=null,Sh(),wh(),yh(),$.death.classList.add(`hidden`),Q.phase=`menu`,bh(`menu`),dh.stopAmbient(),mh(`ネットワーク待機中`,``),$h()}function Ph(e){e.on(`join-request`,t=>{let n=Q.session;if(!n||Q.room!==e){t.reject(`not-ready`,`ホストは準備中です。数秒後に再試行してください。`);return}if(n.playerCount()>=nh){t.reject(`room-full`,`ルームが満員です（最大${nh}人）。`);return}let r=_(t.name),i=S(`g`),a=n.nextPlayerColor();n.addGuestRecord({id:i,name:r,color:a})?(t.accept({playerId:i,name:r,welcome:{players:n.getRoster(),hostName:n.localName,matchTime:n.matchTime,started:n.deployed,mode:`p2p`}}),Q.phase===`lobby`?(hh(`${r} がロビーに参加しました`,a,2200),Xh()):(n.hud?.showToast(`${r} が参加しました`,a,2400),n.hud?.showHint(`${r} 接続 // P2P`,2.2)),dh.pickup()):t.reject(`error`,`参加処理に失敗しました。もう一度お試しください。`)}),e.on(`guest-left`,({playerId:e})=>{let t=Q.session;if(!t)return;let n=t.records.get(e);n&&(t.removePlayer(e,{notify:!0}),Q.phase===`lobby`?(hh(`${n.name} がロビーから退出しました`,`#ffc857`,2200),Xh()):t.hud?.showHint(`${n.name} が退出しました`,2))})}function Fh(e){e.on(`fatal-error`,t=>{if(Q.room===e||Q.pendingRoom===e){if(Q.session&&Q.room===e){if(Q.phase===`lobby`){hh(t?.message||`接続エラーが発生しました。`,`#ff3b5c`,3400),Nh();return}Ch(t?.message||`接続エラーが発生しました。`)}else Q.pendingRoom===e?vh(t?.message||`接続エラーが発生しました。`):(yh(),mh(t?.message||`接続エラーが発生しました。`,`error`),hh(t?.message||`接続エラー`,`#ff3b5c`,3200),dh.error())}}),e.on(`warning`,t=>{(Q.room===e||Q.pendingRoom===e)&&t?.message&&hh(t.message,`#ffc857`,3e3)}),e.on(`signaling-lost`,()=>{(Q.room===e||Q.pendingRoom===e)&&(Q.session?hh(`シグナリング接続が不安定です — 再接続中`,`#ffc857`,2600):mh(`シグナリング再接続中…`,``))}),e.on(`connection-lost`,({reason:t}={})=>{Q.room===e&&Q.session&&(Q.phase===`lobby`?(hh(t||`ホストとの接続が切れました。`,`#ff3b5c`,3600),Nh()):Ch(t))})}function Ih(){return _($.name.value||Q.name||`PLAYER`)}function Lh(){return v($.room.value)}function Rh(e){Q.name=_(e),$.name.value=Q.name;try{localStorage.setItem(oh,Q.name)}catch{}}function zh(){Q.netConfig={host:Z(`peer-host`).value.trim(),port:Z(`peer-port`).value.trim(),path:Z(`peer-path`).value.trim(),key:Z(`peer-key`).value.trim(),secure:Z(`peer-secure`).checked,remember:Z(`peer-remember`).checked},A(Q.netConfig)}async function Bh(){if(Q.connecting)return!1;let e=Ih(),t=Lh();if(!y(t))return mh(`ルームコードは英数字1〜4文字で入力してください`,`error`),$.room.focus(),dh.error(),!1;Rh(e),zh(),dh.ensure(),dh.ui();let n=++Q.connectToken;_h(`HOSTING`,`ルームを準備中`,`ルームコード ${t} を確保しています…`);let r=new sn({role:`host`,code:t,name:e,netConfig:Q.netConfig});Q.pendingRoom=r,Fh(r);try{await r.openHost()}catch(e){if(n!==Q.connectToken)return!1;Q.pendingRoom=null,yh(),mh(e?.message||`ルームを作成できませんでした。`,`error`),hh(e?.message||`ルームを作成できませんでした。`,`#ff3b5c`,3400),dh.error();try{r.close()}catch{}return!1}if(n!==Q.connectToken){try{r.close()}catch{}return!1}return Q.pendingRoom=null,Q.room=r,yh(),mh(`ルーム ${t} のロビー — プレイヤーを待機中`,`ok`),Dh({room:r,practice:!1,code:r.code,weaponId:Q.weaponId}),hh(`ROOM ${t} // LOBBY`,`#00f6ff`,2600),!0}async function Vh(){if(Q.connecting)return!1;let e=Ih(),t=Lh();if(!y(t))return mh(`ルームコードは英数字1〜4文字で入力してください`,`error`),$.room.focus(),dh.error(),!1;Rh(e),zh(),dh.ensure(),dh.ui();let n=++Q.connectToken;_h(`CONNECTING`,`ルームに接続中`,`ルーム ${t} のホストを検索しています…`);let r=null,i=null;for(let a=1;a<=rh;a+=1){if(n!==Q.connectToken)return!1;r=new sn({role:`guest`,code:t,name:e,netConfig:Q.netConfig}),Q.pendingRoom=r,Fh(r),vh(a===1?`シグナリング完了 — P2Pチャンネルを確立しています…`:`P2P接続を再試行しています… (${a}/${rh})`);try{i=await r.connectToHost();break}catch(e){Q.pendingRoom===r&&(Q.pendingRoom=null);try{r.close()}catch{}if(r=null,i=null,n!==Q.connectToken)return!1;if(!(a<rh&&ah.has(e?.code)))return yh(),mh(e?.message||`ルームに接続できませんでした。`,`error`),hh(e?.message||`ルームに接続できませんでした。`,`#ff3b5c`,3400),dh.error(),!1;if(vh(`接続を再確立しています… (${a+1}/${rh})`),await new Promise(e=>{setTimeout(e,ih)}),n!==Q.connectToken)return!1}}if(!r||!i||n!==Q.connectToken){try{r?.close()}catch{}return Q.pendingRoom===r&&(Q.pendingRoom=null),!1}Q.pendingRoom=null,Q.room=r,yh();let a=Array.isArray(i?.players)?i.players:[];return mh(`ルーム ${t} のロビー — HOST: ${_(i?.hostName||`HOST`)}`,`ok`),Dh({room:r,practice:!1,code:r.code,initialPlayers:a,localId:r.selfId,weaponId:Q.weaponId}),i?.started?(Oh({requestLock:!1,directInput:!0}),Q.session.matchTime=Number(i?.matchTime)||0,hh(`ROOM ${t} // MATCH JOINED`,`#a6ff4d`,2600)):hh(`ROOM ${t} // LOBBY`,`#a6ff4d`,2600),!0}function Hh(){Q.connecting||(Rh(Ih()),dh.ensure(),dh.ui(),Q.room=null,Dh({practice:!0,code:`SOLO`,weaponId:Q.weaponId}),mh(`練習モード // ロビーで武装を選択`,`ok`))}function Uh(){if(!Q.connecting)return;Q.connectToken+=1;let e=Q.pendingRoom;Q.pendingRoom=null;try{e?.close()}catch{}yh(),mh(`接続を中止しました`,``)}function Wh(){clearInterval(Q.lobbyTimer),Q.lobbyTimer=null}function Gh(){Wh(),Xh(),Q.lobbyTimer=setInterval(()=>{Q.phase===`lobby`&&Xh()},400)}function Kh(e){Q.weaponId=e;try{localStorage.setItem(sh,e)}catch{}}function qh(e){let t=Q.session;return!t||Q.phase!==`lobby`||t.deployed||!t.setLocalWeapon(e)?!1:(Kh(t.weaponId),t.net?.sendLoadout(t.weaponId),Yh(),Xh(),dh.ui(),!0)}function Jh(){let e=document.createDocumentFragment();for(let t of fh.list()){let n=document.createElement(`button`);n.type=`button`,n.className=`lobby-weapon`,n.dataset.weapon=t.id,n.style.setProperty(`--weapon-color`,t.color),n.innerHTML=`
      <span class="lw-dot"></span>
      <span class="lw-text"><strong>${t.name}</strong><small>${t.classLabel}</small></span>
      <span class="lw-pick">SELECT</span>
    `,n.addEventListener(`click`,()=>{qh(t.id)}),e.appendChild(n)}$.lobbyWeapons.replaceChildren(e),Yh()}function Yh(){let e=Q.session,t=e?.weaponId||Q.weaponId;for(let n of $.lobbyWeapons.querySelectorAll(`.lobby-weapon`)){let r=n.dataset.weapon===t;n.classList.toggle(`is-selected`,r),n.setAttribute(`aria-pressed`,String(r)),n.disabled=!!e?.deployed}let n=fh.get(t);n&&($.lobbyWeaponDetail.innerHTML=`
    <div class="lwd-head">
      <span class="lwd-icon" style="color:${n.color}">${n.icon||`✦`}</span>
      <div><span class="micro-label">${n.classLabel}</span><strong>${n.name}</strong></div>
    </div>
    <p>${n.description||`この試合で使用する武装です。`}</p>
    <div class="lwd-stats">
      <span><b>${n.damage}</b>DMG</span>
      <span><b>${n.magSize}</b>MAG</span>
      <span><b>${n.range??60}</b>RANGE</span>
      <span><b>${String(n.type).toUpperCase()}</b>TYPE</span>
    </div>
  `)}function Xh(){let e=Q.session;if(!e)return;let t=!!(e.practice||e.room?.isHost),n=[...e.records.values()].filter(e=>!e.isBot).sort((e,n)=>{let r=e=>e.id===`host`||e.isLocal&&t?0:e.isLocal?1:2;return r(e)-r(n)||e.name.localeCompare(n.name)});$.lobbyCode.textContent=e.roomCode,$.lobbyRole.textContent=e.practice?`SOLO`:t?`HOST`:`GUEST`,$.lobbyMode.textContent=e.modeLabel,$.lobbyPlayerCount.textContent=`${n.length}/${e.practice?1:nh}`,$.lobbyCopy.classList.toggle(`hidden`,e.practice),$.lobbyStart.classList.toggle(`hidden`,!t),$.lobbyStart.innerHTML=e.practice?`<span class="btn-kicker">SOLO // OFFLINE</span><span class="lobby-start-label">演習を開始</span>`:`<span class="btn-kicker">HOST READY</span><span class="lobby-start-label">マッチを開始</span>`;let r=e.room?.guestCount?.()??0;if(e.practice?$.lobbyWait.textContent=`BOTS 3体 // オフライン演習。武装を選んで開始してください。`:t?$.lobbyWait.textContent=r>0?`${r+1}人で開始できます。フレンドの参加を待機中…`:`フレンドの参加を待機中… 1人でも開始できます。`:$.lobbyWait.textContent=`ホストがマッチを開始するまで待機中…`,e.practice)$.lobbyStatus.textContent=`LOCAL // OFFLINE`;else if(t)$.lobbyStatus.textContent=`P2P HOST // ${r+1}P`;else{let t=e.room?.ping;$.lobbyStatus.textContent=t==null?`P2P CLIENT`:`P2P CLIENT // ${t}ms`}let i=document.createDocumentFragment();for(let e of n){let n=document.createElement(`li`);n.className=`lobby-player`,n.style.setProperty(`--pc`,e.color);let r=document.createElement(`span`);r.className=`lp-dot`;let a=document.createElement(`div`);a.className=`lp-identity`;let o=document.createElement(`div`);o.className=`lp-name-line`;let s=document.createElement(`strong`);if(s.className=`lp-name`,s.textContent=e.name,o.appendChild(s),e.id===`host`||e.isLocal&&t){let e=document.createElement(`span`);e.className=`lp-tag host`,e.textContent=`HOST`,o.appendChild(e)}if(e.isLocal){let e=document.createElement(`span`);e.className=`lp-tag you`,e.textContent=`YOU`,o.appendChild(e)}let c=document.createElement(`span`);c.className=`lp-weapon`;let l=fh.get(e.weaponId);c.textContent=l?l.name:`PULSE-9`,a.append(o,c);let u=document.createElement(`span`);u.className=`lp-state`,u.textContent=`READY`,n.append(r,a,u),i.appendChild(n)}if(!e.practice)for(let e=n.length;e<nh;e+=1){let e=document.createElement(`li`);e.className=`lobby-player is-empty`,e.innerHTML=`<span class="lp-dot"></span><div class="lp-identity"><strong class="lp-name">WAITING FOR PLAYER</strong><span class="lp-weapon">—</span></div><span class="lp-state">OPEN</span>`,i.appendChild(e)}$.lobbyPlayers.replaceChildren(i),Yh()}async function Zh(){let e=Q.session?.roomCode;if(e){try{await navigator.clipboard.writeText(e),hh(`ルームコード ${e} をコピーしました`,`#a6ff4d`,2200)}catch{hh(`ROOM ${e}`,`#00f6ff`,2600)}dh.ui()}}function Qh(){Jh(),$.lobbyStart.addEventListener(`click`,()=>{kh({requestLock:!0})}),$.lobbyLeave.addEventListener(`click`,()=>{Nh()}),$.lobbyCopy.addEventListener(`click`,()=>{Zh()})}function $h(){let e=Z(`menu-weapon-list`);if(!e)return;let t=document.createDocumentFragment();for(let e of fh.list()){let n=document.createElement(`li`),r=document.createElement(`i`);r.style.background=e.color,r.style.boxShadow=`0 0 10px ${e.color}`;let i=document.createElement(`span`);i.className=`w-index`,i.textContent=String(e.slot).padStart(2,`0`);let a=document.createElement(`span`);a.className=`w-name`,a.textContent=e.name;let o=document.createElement(`span`);o.className=`w-meta`,o.textContent=(e.classLabel||e.type).split(` / `)[0],n.append(r,i,a,o),t.appendChild(n)}e.replaceChildren(t)}function eg(){let e=uh.get(`sensitivity`),t=uh.get(`fov`),n=uh.get(`volume`);Z(`sensitivity`).value=String(e),Z(`sensitivity-value`).textContent=Number(e).toFixed(2),Z(`fov`).value=String(t),Z(`fov-value`).textContent=`${t}°`,Z(`volume`).value=String(n),Z(`volume-value`).textContent=`${n}%`,Z(`show-fps`).checked=!!uh.get(`showFps`),Z(`ambient-audio`).checked=!!uh.get(`ambientAudio`);let r=uh.get(`quality`);for(let e of document.querySelectorAll(`#quality-segmented button`))e.classList.toggle(`active`,e.dataset.quality===r);Z(`settings-server-text`).textContent=re(Q.netConfig)}function tg(){Z(`sensitivity`).addEventListener(`input`,e=>{let t=uh.set(`sensitivity`,Number(e.target.value));Z(`sensitivity-value`).textContent=Number(t).toFixed(2)}),Z(`fov`).addEventListener(`input`,e=>{let t=uh.set(`fov`,Number(e.target.value));Z(`fov-value`).textContent=`${t}°`}),Z(`volume`).addEventListener(`input`,e=>{let t=uh.set(`volume`,Number(e.target.value));Z(`volume-value`).textContent=`${t}%`,dh.setVolume()}),Z(`show-fps`).addEventListener(`change`,e=>{uh.set(`showFps`,e.target.checked)}),Z(`ambient-audio`).addEventListener(`change`,e=>{uh.set(`ambientAudio`,e.target.checked),dh.setAmbientEnabled(e.target.checked)});for(let e of document.querySelectorAll(`#quality-segmented button`))e.addEventListener(`click`,()=>{uh.set(`quality`,e.dataset.quality===`low`?`low`:`high`),eg(),dh.ui()});Z(`btn-settings-reset`).addEventListener(`click`,()=>{uh.reset(),eg(),dh.setVolume(),dh.ui()}),Z(`btn-settings-close`).addEventListener(`click`,()=>$.settingsDialog.close()),Z(`settings-form`).addEventListener(`submit`,()=>{eg()}),uh.on(`change`,e=>{(e===`quality`||e===`fov`)&&eg()})}function ng(){Z(`peer-host`).value=Q.netConfig.host||``,Z(`peer-port`).value=Q.netConfig.port||``,Z(`peer-path`).value=Q.netConfig.path||``,Z(`peer-key`).value=Q.netConfig.key||``,Z(`peer-secure`).checked=!!Q.netConfig.secure,Z(`peer-remember`).checked=!!Q.netConfig.remember,Z(`settings-server-text`).textContent=re(Q.netConfig),Z(`btn-cloud-preset`).addEventListener(`click`,()=>{Z(`peer-host`).value=``,Z(`peer-port`).value=``,Z(`peer-path`).value=``,Z(`peer-key`).value=``,Z(`peer-secure`).checked=!0,mh(`PeerJSクラウドを使用します`,``),dh.ui()})}function rg(){$.name.value=Q.name,$.room.value=v(ch.get(`room`)||``),$.roomCount.textContent=`${$.room.value.length}/4`,$.room.addEventListener(`input`,()=>{let e=v($.room.value);$.room.value!==e&&($.room.value=e),$.roomCount.textContent=`${e.length}/4`}),$.name.addEventListener(`change`,()=>Rh($.name.value)),$.btnHost.addEventListener(`click`,()=>{Bh()}),$.btnJoin.addEventListener(`click`,()=>{Vh()}),$.btnPractice.addEventListener(`click`,()=>{Hh()}),$.connectCancel.addEventListener(`click`,()=>{Uh()}),Z(`btn-settings`).addEventListener(`click`,()=>{eg(),$.settingsDialog.open||$.settingsDialog.showModal(),dh.ui()}),Z(`btn-help`).addEventListener(`click`,()=>{$.helpDialog.open||$.helpDialog.showModal(),dh.ui()}),Z(`btn-help-close`).addEventListener(`click`,()=>$.helpDialog.close()),Z(`btn-help-done`).addEventListener(`click`,()=>$.helpDialog.close()),Z(`btn-resume`).addEventListener(`click`,()=>Mh()),Z(`btn-pause-settings`).addEventListener(`click`,()=>{eg(),$.settingsDialog.open||$.settingsDialog.showModal(),dh.ui()}),Z(`btn-leave`).addEventListener(`click`,()=>Nh()),Z(`btn-disconnect-menu`).addEventListener(`click`,()=>Nh()),$.name.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),Bh())}),$.room.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),Vh())})}function ig(){window.addEventListener(`keydown`,e=>{let t=Q.session;if(t?.deployed&&!($.settingsDialog.open||$.helpDialog.open)&&e.target?.tagName!==`INPUT`&&e.target?.tagName!==`TEXTAREA`){if(e.code===`Tab`)e.preventDefault(),t.hud?.setScoreboard(!0);else if(e.code===`Escape`)e.preventDefault(),e.stopPropagation(),$.pause.classList.contains(`hidden`)?jh():Mh();else if(!e.repeat){if(e.code===`KeyM`){let e=dh.toggleMuted();t.hud?.showToast(e?`AUDIO MUTED`:`AUDIO ON`,`#ffc857`,1500)}else e.code===`KeyF`&&ag()}}}),window.addEventListener(`keyup`,e=>{e.code===`Tab`&&Q.session?.hud?.setScoreboard(!1)}),document.addEventListener(`pointerlockchange`,()=>{let e=Q.session;e&&(e.input.unlockedOverride||(document.pointerLockElement===e.canvas?(Sh(),e.deployed&&(e.setPaused(!1),e.input.setEnabled(!0))):e.deployed&&$.death.classList.contains(`hidden`)&&xh()))}),window.addEventListener(`beforeunload`,()=>{try{Q.room?.close()}catch{}})}async function ag(){try{document.fullscreenElement?await document.exitFullscreen?.():await document.documentElement.requestFullscreen?.()}catch(e){console.warn(`[NEONSTRIKE] fullscreen unavailable`,e)}}function og(e){return e?{id:e.id,name:e.name,color:e.color,isLocal:!!e.isLocal,isBot:!!e.isBot,alive:!!e.alive,health:Math.round(e.health*10)/10,kills:e.kills||0,deaths:e.deaths||0,weapon:e.weaponId,pos:[e.pos.x,e.pos.y,e.pos.z],yaw:e.yaw,pitch:e.pitch,crouch:!!e.crouch}:null}window.__neonstrike={app:Q,registry:fh,get session(){return Q.session},get room(){return Q.room},state(){let e=Q.session;return e?{roomCode:e.roomCode,practice:e.practice,phase:Q.phase,isHost:e.isAuthority,isGuest:!(!e.room||e.room.isHost),localId:e.localId,deployed:e.deployed,paused:e.paused,matchTime:e.matchTime,weapon:e.weaponId,loadout:e.loadout.map(e=>e.id),ammo:e.weapon?.ammo??null,reserve:e.weapon?.reserve??null,reloading:!!e.weapon?.reloading,aiming:!!e.aiming,crosshairTarget:!!e.crosshairTarget,guestCount:e.room?.guestCount?.()??0,lobby:{visible:!$.lobby.classList.contains(`hidden`),role:$.lobbyRole.textContent,startVisible:!$.lobbyStart.classList.contains(`hidden`)},local:og(e.localRecord),records:[...e.records.values()].map(og),pickups:e.stage.pickups.map(e=>({id:e.id,available:e.available})),deployedPlayers:[...e.records.values()].filter(e=>!e.isBot).length}:null},async host({code:e=`TEST`,name:t=`HOST`,deploy:n=!0,weapon:r=null}={}){$.name.value=t,$.room.value=v(e),r&&fh.get(r)&&Kh(r);let i=await Bh();return i&&n&&kh({requestLock:!1}),i?this.state():null},async guest({code:e=`TEST`,name:t=`GUEST`,weapon:n=null}={}){return $.name.value=t,$.room.value=v(e),n&&fh.get(n)&&Kh(n),await Vh()?this.state():null},async practice({name:e=`TESTER`,deploy:t=!0,weapon:n=null}={}){return $.name.value=e,n&&fh.get(n)&&Kh(n),Hh(),t&&kh({requestLock:!1}),this.state()},start(e={}){return kh({requestLock:!1,...e}),this.state()},chooseWeapon(e){return qh(e)?this.state():null},deploy(e={}){return Ah({requestLock:!1,...e}),this.state()},pause(){jh()},resume(){Mh()},leave(){Nh()},setUnlockedInput(e=!0){Q.session?.input.setUnlockedOverride(e),e&&Q.session?.input.setEnabled(!0)},key(e,t=!0){let n=Q.session?.input;n&&(t?(n.keys.has(e)||n.pressed.add(e),n.keys.add(e)):n.keys.delete(e))},tap(e){let t=Q.session?.input;t&&t.pressed.add(e)},mouse(e=0,t=!0){let n=Q.session?.input;n&&(t&&!n.mouse[e]&&n.mousePressed.add(e),n.mouse[e]=!!t)},look(e=0,t=0){let n=Q.session?.input;n&&(n.lookX+=e,n.lookY+=t)},selectWeapon(e){let t=Q.session;return t?Q.phase===`lobby`?qh(e)?t.weaponId:null:t.weaponId===e?e:null:null},reload(){return Q.session?.combat?.startReload(),!!Q.session?.weapon?.reloading},fire(){let e=Q.session;e&&e.combat?._tryFireLocal(e.localRecord,e.weapon)},aimAt(e,{head:t=!1}={}){let n=Q.session;if(!n||!e)return;let r=n.records.get(e);if(!r)return;let i=n.localRecord,a=r.pos.x-i.pos.x,o=r.pos.z-i.pos.z,s=Math.atan2(-a,-o),c=r.pos.y+(t?1.62:1),l=Math.atan2(c-(i.pos.y+1.66),Math.max(.05,Math.hypot(a,o)));i.yaw=s,i.pitch=l,i.body&&(i.body.yaw=s,i.body.pitch=l)},aimAtNearest({head:e=!1}={}){let t=Q.session;if(!t)return null;let n=t.getDamageableTargets(t.localId);if(!n.length)return null;let r=n[0].state;for(let e of n)e.state.pos.distanceToSquared(t.localRecord.pos)<r.pos.distanceToSquared(t.localRecord.pos)&&(r=e.state);return this.aimAt(r.id,{head:e}),r.id},teleport(e,t,n){let r=Q.session;if(!r)return;let i=r.localRecord;i.pos.set(Number(e)||0,Number(t)||1,Number(n)||0),i.vel.set(0,0,0),i.body&&(i.body.pos.copy(i.pos),i.body.vel.set(0,0,0),i.body.grounded=!1)},advance(e=1){let t=Q.session;if(!t)return null;let n=Math.max(1,Math.min(1200,Math.round(Number(e)*60)));for(let e=0;e<n;e+=1)t.fixedUpdate(1/60);return t.input.endFrame(),this.state()},placeAhead(e,t=6,n=0){let r=Q.session,i=r?.records.get(e),a=r?.localRecord;if(!i||!a)return null;let o=a.yaw,s=-Math.sin(o),c=-Math.cos(o),l=Math.cos(o),u=-Math.sin(o);return i.pos.set(a.pos.x+s*t+l*n,a.pos.y+.02,a.pos.z+c*t+u*n),i.vel.set(0,0,0),i.alive=!0,i.health=i.maxHealth,i.invulnerableUntil=0,i.body&&(i.body.pos.copy(i.pos),i.body.vel.set(0,0,0),i.body.grounded=!1),i.avatar?.setAlive?.(!0),i.avatar?.setHealth?.(i.health),og(i)},setHealth(e,t=100){let n=Q.session?.records.get(e);return n?(n.health=Math.max(0,Math.min(n.maxHealth,Number(t)||0)),n.avatar?.setHealth?.(n.health),og(n)):null},triggers(e=null){return(Q.session?.physics?.triggers??[]).filter(t=>!e||t.kind===e).map(e=>({kind:e.kind,id:e.id,enabled:e.enabled,center:[(e.box.min.x+e.box.max.x)/2,(e.box.min.y+e.box.max.y)/2,(e.box.min.z+e.box.max.z)/2],size:[e.box.max.x-e.box.min.x,e.box.max.y-e.box.min.y,e.box.max.z-e.box.min.z],data:e.data?{damage:e.data.damage,power:e.data.power,gravityScale:e.data.gravityScale,updraft:e.data.updraft,channel:e.data.channel,label:e.data.label,targetLabel:e.data.targetLabel,target:e.data.target?[e.data.target.x,e.data.target.y,e.data.target.z]:null}:null}))},damage(e,t=25){let n=Q.session;return n?n.applyDamage(e,t,n.localId,`weapon`,{weaponId:n.weaponId}):null},kill(e){return this.damage(e,999)},respawn(e){let t=Q.session,n=t?.records.get(e);n&&t.respawnRecord(n)},setPaused(e=!0){let t=Q.session;t&&t.setPaused(e)},record(e){return og(Q.session?.records.get(e))}};function sg(){$h(),rg(),Qh(),tg(),ng(),ig(),eg(),mh(`ネットワーク待機中`,``),$.death.classList.add(`hidden`)}sg()})();