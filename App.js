import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';
const DEFAULT_API = 'http://192.168.68.55:3000';
export default function App(){
 const [base,setBase]=useState(DEFAULT_API),[apiDraft,setApiDraft]=useState(DEFAULT_API);
 const [tasks,setTasks]=useState([]),[loading,setLoading]=useState(false),[editing,setEditing]=useState(null);
 const [title,setTitle]=useState(''),[description,setDescription]=useState(''),[completed,setCompleted]=useState(false);
 const [error,setError]=useState('');
 useEffect(()=>{AsyncStorage.getItem('taskflow_api').then(v=>{if(v){setBase(v);setApiDraft(v);}});},[]);
 const request=useCallback(async(path,options)=>{
  const res=await fetch(`${base.replace(/\/$/,'')}${path}`,{headers:{'Content-Type':'application/json'},...options});
  if(!res.ok){const body=await res.json().catch(()=>({}));throw Error(body.error||`Erro HTTP ${res.status}`);}
  return res.status===204?null:res.json();
 },[base]);
 const load=useCallback(async()=>{setLoading(true);setError('');try{setTasks(await request('/tasks'));}catch(e){setError(e.message);}finally{setLoading(false);}},[request]);
 useEffect(()=>{load();},[load]);
 const reset=()=>{setEditing(null);setTitle('');setDescription('');setCompleted(false);};
 const save=async()=>{if(!title.trim())return Alert.alert('Atenção','Informe o título da tarefa.');
  setLoading(true);try{await request(editing?`/tasks/${editing}`:'/tasks',{method:editing?'PUT':'POST',body:JSON.stringify({title:title.trim(),description,completed})});reset();await load();}catch(e){Alert.alert('Erro',e.message);}finally{setLoading(false);}};
 const edit=t=>{setEditing(t._id);setTitle(t.title);setDescription(t.description||'');setCompleted(!!t.completed);};
 const remove=t=>Alert.alert('Excluir tarefa',`Excluir "${t.title}"?`,[{text:'Cancelar',style:'cancel'},{text:'Excluir',style:'destructive',onPress:async()=>{try{await request(`/tasks/${t._id}`,{method:'DELETE'});await load();}catch(e){Alert.alert('Erro',e.message);}}}]);
 const toggle=async t=>{try{await request(`/tasks/${t._id}`,{method:'PUT',body:JSON.stringify({title:t.title,description:t.description,completed:!t.completed})});await load();}catch(e){Alert.alert('Erro',e.message);}};
 const saveApi=async()=>{const v=apiDraft.trim().replace(/\/$/,'');if(!/^https?:\/\//.test(v))return Alert.alert('URL inválida','Use http:// ou https://');await AsyncStorage.setItem('taskflow_api',v);setBase(v);};
 return <SafeAreaView style={s.root}><StatusBar style="dark"/><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
  <FlatList data={tasks} keyExtractor={t=>t._id} refreshing={loading} onRefresh={load}
   ListHeaderComponent={<View><Text style={s.heading}>TaskFlow</Text><Text style={s.sub}>Organize suas tarefas em um só lugar.</Text>
    <View style={s.card}><Text style={s.label}>Endereço da API (IP do computador)</Text><TextInput style={s.input} autoCapitalize="none" value={apiDraft} onChangeText={setApiDraft} placeholder="http://192.168.1.10:3000"/><Pressable style={s.secondary} onPress={saveApi}><Text style={s.secondaryText}>Salvar endereço da API</Text></Pressable></View>
    <View style={s.card}><Text style={s.section}>{editing?'Editar tarefa':'Nova tarefa'}</Text><TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="Título" maxLength={120}/><TextInput style={[s.input,{height:76}]} multiline value={description} onChangeText={setDescription} placeholder="Descrição" maxLength={1000}/><Pressable onPress={()=>setCompleted(!completed)}><Text style={s.check}>{completed?'☑':'☐'} Concluída</Text></Pressable><Pressable style={s.primary} onPress={save} disabled={loading}><Text style={s.primaryText}>{editing?'Salvar alterações':'Cadastrar tarefa'}</Text></Pressable>{editing&&<Pressable onPress={reset}><Text style={s.cancel}>Cancelar edição</Text></Pressable>}</View>
    <Text style={s.section}>Minhas tarefas ({tasks.length})</Text>{!!error&&<Text style={s.error}>Não foi possível conectar: {error}. Confira a API e a rede Wi-Fi.</Text>}{loading&&<ActivityIndicator color="#6750a4"/>}</View>}
   ListEmptyComponent={!loading?<Text style={s.empty}>Nenhuma tarefa cadastrada.</Text>:null}
   renderItem={({item:t})=><View style={s.task}><Pressable onPress={()=>toggle(t)}><Text style={s.taskTitle}>{t.completed?'☑':'☐'} {t.title}</Text></Pressable>{!!t.description&&<Text style={s.description}>{t.description}</Text>}<Text style={s.status}>{t.completed?'Concluída':'Pendente'}</Text><View style={s.actions}><Pressable onPress={()=>edit(t)}><Text style={s.action}>Editar</Text></Pressable><Pressable onPress={()=>remove(t)}><Text style={[s.action,{color:'#bd2737'}]}>Excluir</Text></Pressable></View></View>}
   contentContainerStyle={{padding:20,paddingBottom:55}}/>
 </KeyboardAvoidingView></SafeAreaView>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#f7f5fb'},heading:{fontSize:34,fontWeight:'800',color:'#39215f',marginTop:16},sub:{color:'#6b6477',marginBottom:20},card:{backgroundColor:'#fff',borderRadius:18,padding:18,marginBottom:18,borderWidth:1,borderColor:'#e8e1ef'},label:{fontWeight:'600',marginBottom:8,color:'#45365c'},input:{borderWidth:1,borderColor:'#ded6e7',borderRadius:10,padding:12,marginBottom:12,color:'#30283c',backgroundColor:'#fff'},section:{fontSize:19,fontWeight:'700',color:'#39215f',marginBottom:12},primary:{backgroundColor:'#6750a4',padding:14,borderRadius:10,alignItems:'center',marginTop:12},primaryText:{color:'#fff',fontWeight:'700'},secondary:{padding:10,alignItems:'center',borderRadius:10,backgroundColor:'#eee8f8'},secondaryText:{color:'#4d3680',fontWeight:'700'},check:{fontSize:16,color:'#45365c'},cancel:{textAlign:'center',marginTop:12,color:'#6750a4'},error:{color:'#ad2634',marginBottom:14},empty:{color:'#81778e',textAlign:'center',marginTop:16},task:{backgroundColor:'#fff',borderRadius:14,padding:16,marginBottom:12,borderWidth:1,borderColor:'#e8e1ef'},taskTitle:{fontSize:17,fontWeight:'700',color:'#35274b'},description:{marginTop:6,color:'#5f576b'},status:{marginTop:9,color:'#6750a4'},actions:{flexDirection:'row',gap:28,marginTop:14},action:{color:'#6750a4',fontWeight:'700'}});
