import { createInitialState, dictionary } from './modules/data.js';
import { createAudioPlayer } from './modules/audio.js';
import { createAnalyzer } from './modules/analyze.js';
import { createUI } from './modules/ui.js';
const state=createInitialState();
const getAllWords=()=>({...dictionary,...state.customWords});
const playAudio=createAudioPlayer(()=>state.apiKey);
const ui=createUI({state,getAllWords,playAudio});
function setTab(tab){state.activeTab=tab;['slice','compare','settings'].forEach(t=>{const btn=document.getElementById(`tab-btn-${t}`);const content=document.getElementById(`tab-${t}`);if(t===tab){btn.className='px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 bg-white text-indigo-700 shadow-sm';content.classList.remove('hidden');}else{btn.className='px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 text-slate-600 hover:text-slate-900';content.classList.add('hidden');}});ui.renderAll();}
function setCurrentWord(wordId){state.currentWordId=wordId;state.isSliced=false;state.selectedPart=null;ui.renderPresets();ui.renderWordInfo();ui.renderPartDetails();}
function handleSlice(){state.isSliced=true;state.selectedPart=null;ui.updateSliceVisuals();ui.renderPartDetails();}
function resetSlice(){state.isSliced=false;state.selectedPart=null;ui.updateSliceVisuals();ui.renderPartDetails();}
function selectPart(index){if(!state.isSliced)return;const wordData=getAllWords()[state.currentWordId];state.selectedPart=wordData.parts[index];ui.renderPartDetails();}
function toggleSave(){if(state.savedWords.includes(state.currentWordId))state.savedWords=state.savedWords.filter(w=>w!==state.currentWordId);else state.savedWords.push(state.currentWordId);localStorage.setItem('sciSlice_savedWords',JSON.stringify(state.savedWords));ui.renderPresets();}
function setComparePair(pairId){state.currentPairId=pairId;ui.renderCompareTab();}
const analyzeWord=createAnalyzer({state,getAllWords,setCurrentWord});
window.SciSlice={setTab,setCurrentWord,handleSlice,resetSlice,selectPart,toggleSave,setComparePair,playAudio,updateSource:ui.updateSource,saveApiKey:ui.saveApiKey,toggleDarkMode:ui.toggleDarkMode,analyzeWord};
document.getElementById('customInput').addEventListener('input',(e)=>{document.getElementById('analyzeBtn').disabled=e.target.value.trim().length===0||document.getElementById('analyzeText').innerText==='Analyzing...';});
ui.applyTheme();
ui.renderAll();
setTab('slice');
window.analyzeWord=analyzeWord;
window.setTab=setTab;
window.setCurrentWord=setCurrentWord;
window.handleSlice=handleSlice;
window.resetSlice=resetSlice;
window.selectPart=selectPart;
window.toggleSave=toggleSave;
window.playAudio=playAudio;
window.setComparePair=setComparePair;
window.updateSource=ui.updateSource;
window.saveApiKey=ui.saveApiKey;
