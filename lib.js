import { create } from 'zustand'

export const apitoken = '66d5cd94113e5'
// export const apilink = 'https://wa-api.vercel.app'
// export const apilinkAlt = 'https://biztech-api.fwa-bd.com'
export const apilink = 'https://server216.99itbd.com'
// export const apilink = 'http://localhost:3028'
export const apilinkAlt = 'https://waapi.universalinternational.org'
export const imageLink = 'https://dash.universalinternational.org/wa-api-images/'
export const localapi = "http://localhost:3060"
export let WA_token=''
export let Phone_Id = ''


function getDifferenceInDays(date1, date2) {//check the validation od subscription
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Milliseconds in one day
  const date1Time = new Date(date1).getTime();
  const date2Time = new Date(date2).getTime();

  const differenceInMilliseconds = Math.abs(date1Time - date2Time);
  return Math.floor(differenceInMilliseconds / oneDayInMilliseconds);
}


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
    const days = getDifferenceInDays(newinstance?.login_info?.start,newinstance?.login_info?.end)
    set({instancedata:{...newinstance,subscriptionexpired:Number(days)>Number(newinstance?.login_info?.subscriptionfordays)?true:false} })
  },
  removeData: () => set({ instancedata: {
    qr:null,
    info:null,
    login_info:null
  }}),
  
}))