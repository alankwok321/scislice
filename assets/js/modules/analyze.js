export function createAnalyzer({state,getAllWords,setCurrentWord}){
  return async function analyzeWord(e){
    e.preventDefault();
    const customInput=document.getElementById('customInput');
    const analyzeBtn=document.getElementById('analyzeBtn');
    const cleanWord=customInput.value.trim().toLowerCase();
    if(!cleanWord) return;
    const errorEl=document.getElementById('errorText');
    errorEl.classList.add('hidden');
    const allWords=getAllWords();
    if(allWords[cleanWord]){customInput.value=''; setCurrentWord(cleanWord); return;}
    analyzeBtn.disabled=true;
    document.getElementById('searchIcon').classList.add('hidden');
    document.getElementById('loaderIcon').classList.remove('hidden');
    document.getElementById('analyzeText').innerText='Analyzing...';
    customInput.disabled=true;
    const prompt=`Analyze the science word "${cleanWord}" using the data style and definitions of ${state.selectedSource}. If the input contains a typo, automatically correct it to the most likely intended valid scientific term. Break it down into morphological parts (prefix, root, suffix). Output ONLY valid JSON.`;
    const payload={contents:[{parts:[{text:prompt}]}],systemInstruction:{parts:[{text:'Expert science lexicographer. Valid JSON only.'}]},generationConfig:{responseMimeType:'application/json'}};
    const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.apiKey}`;
    try{
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data=await res.json();
      let text=data.candidates?.[0]?.content?.parts?.[0]?.text||'{}';
      text=text.replace(/```json/g,'').replace(/```/g,'').trim();
      const result=JSON.parse(text);

      // Defensive normalization (avoid UI crashing on missing parts)
      if(!result || typeof result!== 'object') throw new Error('Invalid JSON result');
      if(!result.word) result.word = cleanWord;
      if(!Array.isArray(result.parts)) result.parts = [];

      const correctedWord=String(result.word).toLowerCase();
      state.customWords[correctedWord]=result;
      localStorage.setItem('sciSlice_customWords',JSON.stringify(state.customWords));
      customInput.value='';
      setCurrentWord(correctedWord);
    }catch(err){
      errorEl.innerText=`Analysis failed: ${err.message}.`;
      errorEl.classList.remove('hidden');
    }finally{
      analyzeBtn.disabled=customInput.value.trim().length===0;
      document.getElementById('searchIcon').classList.remove('hidden');
      document.getElementById('loaderIcon').classList.add('hidden');
      document.getElementById('analyzeText').innerText='Analyze';
      customInput.disabled=false;
      customInput.focus();
    }
  }
}
