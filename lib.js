import { create } from 'zustand'

export const apitoken = '66d5cd94113e5'
// export const apilink = 'https://wa-api.vercel.app'
// export const apilinkAlt = 'https://biztech-api.fwa-bd.com'
export const apilink = 'http://103.112.62.216'
export const apilinkAlt = 'https://waapi.fwa-bd.com'
export const imageLink = 'https://dash.universalinternational.org/wa-api-images/'
export const localapi = "http://localhost:3060"
export let WA_token=''
export let Phone_Id = ''



export const useStore = create((set) => ({
  instancedata: {
    qr:null,
    info:null,
    login_info:null
  },
  updatedata:(newinstance)=>{
    Phone_Id = newinstance?.login_info?.Phone_id
    WA_token = newinstance?.login_info?.wa_token
    console.log('newinstance',newinstance,Phone_Id,WA_token);
    
    set({instancedata:newinstance})
  },
  removeData: () => set({ instancedata: {
    qr:null,
    info:null,
    login_info:null
  }}),
  
}))