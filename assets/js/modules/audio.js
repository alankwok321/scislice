export function createAudioPlayer(getApiKey){
  let audioCtx=null,currentSource=null;
  return async function playAudio(text,buttonEl){
    if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') await audioCtx.resume();
    if(currentSource){try{currentSource.stop();}catch{} currentSource.disconnect(); currentSource=null;}
    let original='';
    if(buttonEl){original=buttonEl.innerHTML;buttonEl.innerHTML='<span class="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full animate-spin-slow"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></span>';buttonEl.disabled=true;}
    const payload={contents:[{parts:[{text}]}],generationConfig:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:'Aoede'}}}},model:'gemini-2.5-flash-preview-tts'};
    const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${getApiKey()}`;
    try{
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!res.ok) throw new Error('TTS failed');
      const data=await res.json();
      const inlineData=data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if(inlineData){const base64PCM=inlineData.data;let sampleRate=24000;const rateMatch=inlineData.mimeType.match(/rate=(\d+)/);if(rateMatch)sampleRate=parseInt(rateMatch[1],10);const binaryStr=window.atob(base64PCM);const bytes=new Uint8Array(binaryStr.length);for(let i=0;i<binaryStr.length;i++)bytes[i]=binaryStr.charCodeAt(i);const float32Data=new Float32Array(binaryStr.length/2);const dataView=new DataView(bytes.buffer);for(let i=0;i<binaryStr.length/2;i++){const int16=dataView.getInt16(i*2,true);float32Data[i]=int16/(int16<0?32768:32767);}const audioBuffer=audioCtx.createBuffer(1,float32Data.length,sampleRate);audioBuffer.getChannelData(0).set(float32Data);currentSource=audioCtx.createBufferSource();currentSource.buffer=audioBuffer;currentSource.connect(audioCtx.destination);currentSource.start();}
    }catch(err){alert(`AI Voice Generation Failed:\n\n${err.message}`);}finally{if(buttonEl){buttonEl.innerHTML=original;buttonEl.disabled=false;}}
  }
}
