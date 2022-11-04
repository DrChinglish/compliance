// let fetchCatch = (e)=>{
//     let status = e.name
//     switch(status){
//         case 504
//     }
// }

export default function fetchHandle(res){
    if(res.status>=200&&res.status<300){
        return res
    }
    const errortext = res.statusText;
    const error = new Error(errortext);
    error.name = res.status;
    // error.response = res;
    throw error;
}